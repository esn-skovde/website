/**
 * Re-encodes source images to WebP at the widths the site actually renders them at.
 *
 * Requires `cwebp` on PATH (macOS: `brew install webp`, Debian: `apt install webp`).
 * Output lands in src/assets/images/optimized/ and is committed, so CI and
 * contributors without cwebp can still build.
 *
 * Usage: npm run images
 */
import { execFileSync } from "child_process";
import { mkdirSync, readdirSync, statSync, existsSync } from "fs";
import { dirname, join, extname, basename, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "..", "src", "assets", "images");
const OUT = join(SRC, "optimized");

// Widths are chosen from how each image is laid out, not from the source file.
// A photo rendered into a 300px card never needs a 4080px source.
const RULES = [
    { match: /^hero\.png$/, widths: [1920, 1440, 1024], quality: 72 },
    { match: /^hero-portrait\.jpeg$/, widths: [1000, 720], quality: 70 },
    { match: /^section[12]\.jpeg$/, widths: [1280, 800], quality: 80 },
    { match: /^skovde-city\.jpg$/, widths: [1280, 800], quality: 80 },
    { match: /^trip-placeholder\.jpg$/, widths: [1280, 800], quality: 80 },
    { match: /^esn-card\.png$/, widths: [900, 600], quality: 82 },
    { match: /^logo\.png$/, widths: [192], quality: 90 },
    { match: /^board\/mascot\.png$/, widths: [560, 360], quality: 85 },
    { match: /^board\/.+$/, widths: [640, 400], quality: 80 },
    { match: /^partners\/.+$/, widths: [600, 360], quality: 85 },
];

const walk = (dir, acc = []) => {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (full.startsWith(OUT)) continue;
        if (statSync(full).isDirectory()) walk(full, acc);
        else if (/\.(png|jpe?g)$/i.test(entry)) acc.push(full);
    }
    return acc;
};

let converted = 0;
let skipped = 0;

for (const file of walk(SRC)) {
    const rel = relative(SRC, file).split("\\").join("/");
    const rule = RULES.find((r) => r.match.test(rel));
    if (!rule) {
        console.warn(`no rule for ${rel} — skipping`);
        skipped += 1;
        continue;
    }

    const outDir = join(OUT, dirname(rel));
    mkdirSync(outDir, { recursive: true });
    const stem = basename(rel, extname(rel));

    for (const width of rule.widths) {
        const out = join(outDir, `${stem}-${width}.webp`);
        if (existsSync(out) && statSync(out).mtimeMs > statSync(file).mtimeMs) continue;
        // `-resize w 0` preserves aspect ratio; cwebp never upscales past the source.
        execFileSync("cwebp", [
            "-quiet",
            "-q", String(rule.quality),
            "-resize", String(width), "0",
            "-metadata", "none",
            file,
            "-o", out,
        ]);
        converted += 1;
        process.stdout.write(`${relative(SRC, out)}\n`);
    }
}

console.log(`\n${converted} variants written, ${skipped} sources skipped.`);
