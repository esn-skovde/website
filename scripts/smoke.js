/**
 * Browser smoke test.
 *
 * Loads every route in a real browser at several viewports and reports the
 * failures that are invisible to a build: runtime console errors, broken
 * images, sideways page scroll, and scroll-reveals that never fired.
 *
 * Usage:
 *   npm run dev  &&  node scripts/smoke.js
 *   node scripts/smoke.js --base http://localhost:4173   # against a built site
 *   node scripts/smoke.js --all                          # all 7 languages
 */
import puppeteer from 'puppeteer';

const arg = (flag, fallback) => {
    const i = process.argv.indexOf(flag);
    return i === -1 ? fallback : process.argv[i + 1];
};

const BASE = arg('--base', 'http://localhost:5173');
const ALL_LANGS = process.argv.includes('--all');

const languages = ALL_LANGS ? ['en', 'sv', 'es', 'de', 'no', 'fr', 'it'] : ['en'];
const paths = ['', 'events', 'esn-card', 'board', 'contact', 'new-to-skovde', '404'];

const viewports = [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'tablet', width: 834, height: 1112 },
    { name: 'mobile', width: 390, height: 844 },
];

/* Chrome noise that says nothing about the page. */
const IGNORED = [
    /favicon/i,
    /Download the React DevTools/i,
    /\[vite\]/i,
];

const scrollThrough = (page) =>
    page.evaluate(async () => {
        document.documentElement.style.scrollBehavior = 'auto';
        const wait = (ms) => new Promise((r) => setTimeout(r, ms));
        for (let y = 0; y <= document.body.scrollHeight; y += 400) {
            window.scrollTo(0, y);
            await wait(50);
        }
        window.scrollTo(0, document.body.scrollHeight);
        await wait(400);
    });

async function check(browser, route, viewport, theme) {
    const page = await browser.newPage();
    await page.setViewport({ width: viewport.width, height: viewport.height });
    await page.emulateMediaFeatures([
        { name: 'prefers-color-scheme', value: theme },
    ]);

    const errors = [];
    page.on('console', (m) => {
        if (m.type() !== 'error' && m.type() !== 'warning') return;
        const text = m.text();
        if (IGNORED.some((re) => re.test(text))) return;
        errors.push(`${m.type()}: ${text.slice(0, 160)}`);
    });
    page.on('pageerror', (e) => errors.push(`pageerror: ${String(e).slice(0, 160)}`));
    page.on('requestfailed', (r) => {
        const url = r.url();
        if (IGNORED.some((re) => re.test(url))) return;
        errors.push(`requestfailed: ${url.slice(0, 120)}`);
    });

    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
    await scrollThrough(page);

    const findings = await page.evaluate(() => {
        const out = [];

        const reveals = [...document.querySelectorAll('.reveal')];
        const stranded = reveals.filter((r) => r.dataset.revealed !== 'true');
        if (stranded.length) {
            out.push(`${stranded.length}/${reveals.length} reveals never fired: ` +
                stranded.map((s) => JSON.stringify(s.textContent.slice(0, 24))).join(', '));
        }

        // The body must never scroll sideways; wide content scrolls inside itself.
        const de = document.documentElement;
        if (de.scrollWidth > de.clientWidth + 1) {
            const guilty = [...document.querySelectorAll('body *')]
                .filter((el) => el.getBoundingClientRect().right > de.clientWidth + 1)
                .slice(0, 3)
                .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`);
            out.push(`horizontal overflow ${de.scrollWidth}>${de.clientWidth} near ${guilty.join(', ')}`);
        }

        const broken = [...document.images]
            .filter((i) => i.loading !== 'lazy' || i.getBoundingClientRect().top < innerHeight * 3)
            .filter((i) => i.complete && i.naturalWidth === 0)
            .map((i) => i.currentSrc || i.src);
        if (broken.length) out.push(`broken images: ${broken.slice(0, 3).join(', ')}`);

        if (!document.querySelector('h1')) out.push('no <h1> on page');

        return out;
    });

    await page.close();
    return [...errors, ...findings];
}

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
let failures = 0;
let checks = 0;

try {
    for (const lang of languages) {
        for (const p of paths) {
            const route = p ? `/${lang}/${p}` : `/${lang}/`;
            for (const viewport of viewports) {
                // Both themes only on desktop; the palette is viewport independent.
                const themes = viewport.name === 'desktop' ? ['light', 'dark'] : ['light'];
                for (const theme of themes) {
                    checks += 1;
                    const problems = await check(browser, route, viewport, theme);
                    const label = `${route} ${viewport.name}/${theme}`;
                    if (problems.length) {
                        failures += 1;
                        console.log(`FAIL ${label}`);
                        for (const pr of problems) console.log(`       ${pr}`);
                    } else {
                        console.log(`ok   ${label}`);
                    }
                }
            }
        }
    }
} finally {
    await browser.close();
}

console.log(`\n${checks - failures}/${checks} passed.`);
process.exit(failures ? 1 : 0);
