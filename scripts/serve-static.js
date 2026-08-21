/**
 * Serves dist/ the way GitHub Pages does, so the prerendered output can be
 * checked before it is deployed.
 *
 * `vite preview` is not a substitute: it serves the SPA and rewrites unknown
 * paths to the root index.html, which silently hides whether prerendering
 * actually produced /en/board/index.html. GitHub Pages does neither — it maps a
 * directory to its index.html and everything else to 404.html.
 *
 * Usage: npm run preview:ssg
 *        node scripts/serve-static.js --port 4173
 *        node scripts/serve-static.js --base /my-repo
 *
 * --base mounts dist/ under a prefix, which is how Pages serves a project page.
 * Pass the same value the build was given, or nothing will resolve.
 */
import { createReadStream, existsSync, statSync } from "fs";
import { extname, join, normalize, dirname } from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");

const arg = (flag, fallback) => {
    const i = process.argv.indexOf(flag);
    return i === -1 ? fallback : process.argv[i + 1];
};
const port = Number(arg("--port", 4173));

const rawBase = arg("--base", "/");
const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

const TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".otf": "font/otf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
};

/** Resolves a URL path to a file inside dist/, or null. */
const resolve = (urlPath) => {
    let path = urlPath.split("?")[0];
    if (base !== "/") {
        // Outside the mount point Pages serves nothing at all.
        if (!path.startsWith(base) && `${path}/` !== base) return null;
        path = path.slice(base.length - 1);
    }

    // normalize() collapses any ../ before it can escape dist/.
    const clean = normalize(decodeURIComponent(path)).replace(/^(\.\.[/\\])+/, "");
    const target = join(distDir, clean);
    if (!target.startsWith(distDir)) return null;
    if (existsSync(target) && statSync(target).isFile()) return target;

    const asDir = join(target, "index.html");
    if (existsSync(asDir)) return asDir;
    return null;
};

if (!existsSync(distDir)) {
    console.error("dist/ not found — run `npm run build:ssg` first.");
    process.exit(1);
}

createServer((req, res) => {
    const file = resolve(req.url);

    if (!file) {
        const notFound = join(distDir, "404.html");
        res.writeHead(404, { "Content-Type": TYPES[".html"] });
        if (existsSync(notFound)) return createReadStream(notFound).pipe(res);
        return res.end("404");
    }

    res.writeHead(200, {
        "Content-Type": TYPES[extname(file).toLowerCase()] || "application/octet-stream",
        // Pages sends this; without it a byte-weight measurement over this
        // server reads every response as zero bytes.
        "Content-Length": statSync(file).size,
    });
    createReadStream(file).pipe(res);
}).listen(port, () => {
    console.log(`Serving dist/ as GitHub Pages would: http://localhost:${port}${base}`);
    console.log("Ctrl-C to stop.");
});
