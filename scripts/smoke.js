/**
 * Browser smoke test.
 *
 * Loads every route in a real browser, on a desktop window and on emulated
 * tablets and phones, and reports the failures that are invisible to a build:
 * runtime console errors, broken images, sideways page scroll, a layout
 * viewport that is not the device's width, scroll-reveals that never fired,
 * and a boot that blanked the prerendered page.
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

/* The tablets and phones are emulated devices, not narrow windows: isMobile is
   what makes Chrome honour <meta name="viewport">, as a real device does.
   setViewport() alone skips it, so a page without the meta still laid out
   at 390px here while a phone laid it out at 980px and shrank it to 40%. */
const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const IPAD_UA = 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

/* Each class at its narrow end as well: 768 is where the md: layouts switch
   on, and 320 is the narrowest phone, where a long translated word has the
   least room. Pages that fit at 834 and 390 have run sideways at 768 and
   320. */
const viewports = [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'tablet', width: 834, height: 1112, userAgent: IPAD_UA },
    { name: 'small-tablet', width: 768, height: 1024, userAgent: IPAD_UA },
    { name: 'mobile', width: 390, height: 844, userAgent: IPHONE_UA },
    { name: 'small-mobile', width: 320, height: 568, userAgent: IPHONE_UA },
];

/* Chrome noise that says nothing about the page. */
const IGNORED = [
    /favicon/i,
    /Download the React DevTools/i,
    /\[vite\]/i,
];

/* Installed before any page script runs. Every route is prerendered, so the
   page is on screen before the app starts, and the app has to take it over
   without flashing the route spinner or emptying <main> in between — both
   are what a cold load used to show. Mutation callbacks run before the
   browser paints, so they see every state that could reach the screen. */
const watchBoot = () => {
    const seen = (window.__smokeBoot = []);
    let hadContent = false;
    const note = (what) => {
        if (!seen.includes(what)) seen.push(what);
    };
    new MutationObserver(() => {
        if (document.querySelector('[data-page-loader]')) note('the route spinner replaced the page');
        const main = document.getElementById('main');
        if (main?.firstElementChild) hadContent = true;
        else if (hadContent) note('<main> was emptied');
    }).observe(document, { childList: true, subtree: true });
};

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
    const { width, height, userAgent } = viewport;
    if (userAgent) {
        await page.emulate({
            viewport: { width, height, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
            userAgent,
        });
    } else {
        await page.setViewport({ width, height });
    }
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

    await page.evaluateOnNewDocument(watchBoot);
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
    const boot = await page.evaluate(() => window.__smokeBoot ?? ['the boot watcher never ran']);
    await scrollThrough(page);

    const findings = await page.evaluate((deviceWidth) => {
        const out = [];

        /* A device lays the page out at the width the viewport meta asks for.
           Without the meta it uses 980px and zooms out, and the overflow check
           below cannot tell: the page fits that wider viewport. Desktop
           Chrome ignores the meta, so only the devices are checked. */
        const layoutWidth = document.documentElement.clientWidth;
        if (deviceWidth && layoutWidth !== deviceWidth) {
            out.push(`layout viewport is ${layoutWidth}px on a ${deviceWidth}px screen: ` +
                '<meta name="viewport"> missing or broken');
        }

        const reveals = [...document.querySelectorAll('.reveal')];
        // "instant" is a reveal shown on the boot render, over the prerendered page.
        const stranded = reveals.filter((r) => !['true', 'instant'].includes(r.dataset.revealed));
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
    }, userAgent ? width : null);

    await page.close();
    return [...errors, ...boot.map((b) => `boot: ${b}`), ...findings];
}

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
let failures = 0;
let checks = 0;

try {
    for (const lang of languages) {
        for (const p of paths) {
            // The slash form: GitHub Pages redirects the other to it.
            const route = p ? `/${lang}/${p}/` : `/${lang}/`;
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
