import puppeteer from 'puppeteer';
const OUT = process.env.SHOT_DIR;
const [route, mode = 'desktop', theme = 'dark'] = process.argv.slice(2);
const vp = mode === 'mobile' ? { width: 390, height: 844 } : { width: 1280, height: 900 };

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ ...vp, deviceScaleFactor: 1 });
await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
// Trigger reveals and lazy images before capturing the full page.
await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let y = 0; y <= document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await wait(40); }
    window.scrollTo(0, 0); await wait(500);
});
const name = `${route.replace(/\W+/g, '_')}-${mode}-${theme}.png`;
await page.screenshot({ path: `${OUT}/${name}`, fullPage: true });
console.log(`${OUT}/${name}`);
await browser.close();
