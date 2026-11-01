/**
 * Renders the social sharing card to public/og-image.jpg.
 *
 * og:image pointed at /assets/logo.png, which has never existed in a built
 * site — Vite hashes and re-encodes everything under src/assets, so every
 * share on WhatsApp, Facebook, LinkedIn, Slack and Discord rendered with no
 * preview image at all. This writes a real 1200x630 card to public/, where
 * Vite copies it through verbatim and the URL stays stable across builds.
 *
 * Committed output — run it only when the artwork or wording changes:
 *   node scripts/generate-og-image.js
 */
import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const b64 = (p, mime) => `data:${mime};base64,${readFileSync(join(rootDir, p)).toString('base64')}`;

const hero = b64('src/assets/images/hero.png', 'image/png');
const logo = b64('src/assets/images/logo.png', 'image/png');
const kelson700 = b64('public/fonts/kelson-sans-700-normal.otf', 'font/otf');
const kelson400 = b64('public/fonts/kelson-sans-400-normal.otf', 'font/otf');

// 1200x630 is the size Facebook, LinkedIn and Slack all crop to, and it also
// satisfies Twitter's summary_large_image.
const WIDTH = 1200;
const HEIGHT = 630;

const page = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: "Kelson Sans"; src: url(${kelson700}) format("opentype"); font-weight: 700; }
  @font-face { font-family: "Kelson Sans"; src: url(${kelson400}) format("opentype"); font-weight: 400; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: ${WIDTH}px; height: ${HEIGHT}px; position: relative; overflow: hidden;
         background: #05070f; font-family: "Kelson Sans", sans-serif; }
  .photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  /* Same angled scrim the site's own hero uses, so the card reads as the site. */
  .scrim { position: absolute; inset: 0;
           background: linear-gradient(to top right, #05070f 0%, rgba(5,7,15,.92) 42%, rgba(5,7,15,.35) 100%); }
  .content { position: absolute; inset: 0; padding: 72px 80px; display: flex; flex-direction: column; justify-content: center; }
  .brand { display: flex; align-items: center; gap: 20px; }
  .brand img { width: 76px; height: 76px; }
  .name { font-weight: 700; font-size: 40px; letter-spacing: -0.01em; color: #fff; line-height: 1; }
  .kicker { font-weight: 400; font-size: 15px; letter-spacing: 0.2em; text-transform: uppercase; color: #00AEEF; margin-top: 8px; }
  h1 { font-weight: 700; font-size: 68px; line-height: 1.03; letter-spacing: -0.025em; color: #fff; margin-top: 44px; max-width: 15ch; }
  h1 .star { background: linear-gradient(to right, #00AEEF, #EC008C 55%, #F47B20);
             -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  p { font-weight: 400; font-size: 24px; line-height: 1.45; color: rgba(255,255,255,.82); margin-top: 26px; max-width: 30ch; }
  /* The ESN star as a five-segment rule, closing the card like the site's hero. */
  .rule { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; display: flex; }
  .rule span { flex: 1; }
</style></head><body>
  <img class="photo" src="${hero}" alt="">
  <div class="scrim"></div>
  <div class="content">
    <div class="brand">
      <img src="${logo}" alt="">
      <div><div class="name">ESN Skövde</div><div class="kicker">Erasmus Student Network</div></div>
    </div>
    <h1>Your people in <span class="star">Skövde</span></h1>
    <p>Events, trips and a ready-made community of international students.</p>
  </div>
  <div class="rule">
    <span style="background:#00AEEF"></span><span style="background:#EC008C"></span>
    <span style="background:#7AC143"></span><span style="background:#F47B20"></span>
    <span style="background:#2E3192"></span>
  </div>
</body></html>`;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const tab = await browser.newPage();
await tab.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
await tab.setContent(page, { waitUntil: 'networkidle0' });
await tab.evaluate(() => document.fonts.ready);

const out = join(rootDir, 'public', 'og-image.jpg');
// JPEG, not WebP: several social crawlers still refuse to render WebP previews.
writeFileSync(out, await tab.screenshot({ type: 'jpeg', quality: 90 }));
await browser.close();
console.log(`Wrote public/og-image.jpg (${WIDTH}x${HEIGHT})`);
