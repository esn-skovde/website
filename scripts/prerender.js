import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync, existsSync, createReadStream, statSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// Languages and routes to prerender
const languages = ['en', 'sv', 'es', 'de', 'no', 'fr', 'it'];
const routes = [
    '', // home
    'events',
    'esn-card',
    'board',
    'contact',
    'new-to-skovde',
];

// Generate all routes
const allRoutes = ['/']; // Start with root
languages.forEach((lang) => {
    routes.forEach((route) => {
        const path = route ? `/${lang}/${route}` : `/${lang}`;
        allRoutes.push(path);
    });
    // Add 404 page for each language
    allRoutes.push(`/${lang}/404`);
});

// Simple static file server
function createStaticServer(port) {
    return new Promise((resolve) => {
        const server = createServer((req, res) => {
            let filePath = join(distDir, req.url === '/' ? 'index.html' : req.url);

            // Handle directory requests
            if (req.url.endsWith('/') && req.url !== '/') {
                filePath = join(distDir, req.url, 'index.html');
            }

            // Check if file exists
            if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
                // For SPA routes, serve index.html
                filePath = join(distDir, 'index.html');
            }

            const ext = filePath.split('.').pop();
            const contentType = {
                'html': 'text/html',
                'js': 'application/javascript',
                'css': 'text/css',
                'json': 'application/json',
                'png': 'image/png',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'gif': 'image/gif',
                'svg': 'image/svg+xml',
                'ico': 'image/x-icon',
            }[ext] || 'application/octet-stream';

            res.writeHead(200, { 'Content-Type': contentType });
            createReadStream(filePath).pipe(res);
        });

        server.listen(port, () => {
            console.log(`Static server running on http://localhost:${port}`);
            resolve(server);
        });
    });
}

async function prerenderRoute(browser, route, port) {
    const page = await browser.newPage();

    try {
        console.log(`Rendering: ${route}`);

        // Navigate to the route
        await page.goto(`http://localhost:${port}${route}`, {
            waitUntil: 'networkidle0',
            timeout: 30000,
        });

        // Wait for React to render and meta tags to be added
        await page.waitForFunction(
            () => document.querySelector('meta[name="description"]') !== null,
            { timeout: 10000 }
        ).catch(() => {
            // Continue even if meta tags aren't found
        });

        // Additional wait for any lazy-loaded content
        await new Promise(resolve => setTimeout(resolve, 1000));


        // Get the rendered HTML
        const html = await page.content();

        // Determine output path
        let outputPath;
        if (route === '/') {
            outputPath = join(distDir, 'index.html');
        } else {
            // Create directory structure: /en/events -> dist/en/events/index.html
            const pathParts = route.split('/').filter(Boolean);
            const lang = pathParts[0];
            const pagePath = pathParts.slice(1).join('/');

            if (pagePath) {
                // Has page path: /en/events -> dist/en/events/index.html
                const dirPath = join(distDir, lang, pagePath);
                mkdirSync(dirPath, { recursive: true });
                outputPath = join(dirPath, 'index.html');
            } else {
                // Just language: /en -> dist/en/index.html
                const dirPath = join(distDir, lang);
                mkdirSync(dirPath, { recursive: true });
                outputPath = join(dirPath, 'index.html');
            }
        }

        // Fix asset paths in the HTML for nested directories
        // Calculate relative path depth: /en/events -> ../../, /en/ -> ../
        // Depth = number of directories we're nested in
        const depth = route === '/' ? 0 : route.split('/').filter(Boolean).length;
        const basePath = depth === 0 ? '' : '../'.repeat(depth);

        let fixedHtml = html;

        // Replace absolute asset paths with relative paths
        if (depth > 0) {
            fixedHtml = fixedHtml
                .replace(/href="\/(assets\/[^"]+)"/g, `href="${basePath}$1"`)
                .replace(/src="\/(assets\/[^"]+)"/g, `src="${basePath}$1"`)
                .replace(/href="\/(favicon\.ico)"/g, `href="${basePath}$1"`)
                .replace(/href="\/(robots\.txt)"/g, `href="${basePath}$1"`)
                .replace(/href="\/(sitemap\.xml)"/g, `href="${basePath}$1"`);
        }

        // Write the HTML file
        writeFileSync(outputPath, fixedHtml, 'utf-8');
        console.log(`Saved: ${outputPath}`);

    } catch (error) {
        console.error(`Error rendering ${route}:`, error.message);
    } finally {
        await page.close();
    }
}

async function prerender() {
    console.log('Starting Static Site Generation...\n');
    console.log(`Routes to prerender: ${allRoutes.length}\n`);

    // Start static server
    const port = 4173; // Vite preview default port
    const server = await createStaticServer(port);

    // Launch browser
    console.log('Launching browser...\n');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        // Prerender all routes
        for (const route of allRoutes) {
            await prerenderRoute(browser, route, port);
        }

        // Also create a root-level 404.html for GitHub Pages
        // This will be served when a route doesn't exist
        console.log('Creating root 404.html for GitHub Pages...');
        const root404Path = join(distDir, '404.html');
        const en404Path = join(distDir, 'en', '404', 'index.html');

        if (existsSync(en404Path)) {
            // Copy the English 404 page as the root 404.html
            const en404Content = readFileSync(en404Path, 'utf-8');
            // Fix asset paths for root level
            const root404Content = en404Content
                .replace(/href="\.\.\/\.\.\/(assets\/[^"]+)"/g, 'href="/$1"')
                .replace(/src="\.\.\/\.\.\/(assets\/[^"]+)"/g, 'src="/$1"')
                .replace(/href="\.\.\/\.\.\/(favicon\.ico)"/g, 'href="/$1"');
            writeFileSync(root404Path, root404Content, 'utf-8');
            console.log('Created root 404.html');
        }

        console.log(`Successfully prerendered ${allRoutes.length} routes!\n`);

    } catch (error) {
        console.error('Prerendering failed:', error);
        // eslint-disable-next-line no-undef
        process.exit(1);
    } finally {
        await browser.close();
        server.close();
    }
}

// Run prerender
prerender().catch(console.error);

