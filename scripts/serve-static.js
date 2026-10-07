/**
 * Serves dist/ the way GitHub Pages does, so the prerendered output can be
 * checked before it is deployed.
 *
 * `vite preview` is not a substitute: it serves the SPA and rewrites unknown
 * paths to the root index.html, which silently hides whether prerendering
 * actually produced /en/board/index.html. GitHub Pages does neither — it maps a
 * directory to its index.html and everything else to 404.html, and it serves a
 * directory only at its slash form: /en/board redirects to /en/board/.
 *
 * Usage: npm run preview:ssg
 *        node scripts/serve-static.js --port 4173
 *        node scripts/serve-static.js --base /my-repo
 *
 * --base mounts dist/ under a prefix, which is how Pages serves a project page.
 * Pass the same value the build was given, or nothing will resolve.
 */
import { createReadStream, existsSync, fstatSync, statSync } from "fs";
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

/**
 * How Pages answers a URL: { status: 200, file } inside dist/,
 * { status: 301, location }, or a bare { status }.
 */
const resolve = (url) => {
    const [requested] = url.split("?");
    const query = url.slice(requested.length);
    let path = requested;
    if (base !== "/") {
        // Outside the mount point Pages serves nothing at all.
        if (!path.startsWith(base) && `${path}/` !== base) return { status: 404 };
        path = path.slice(base.length - 1);
    }

    let decoded;
    try {
        decoded = decodeURIComponent(path);
    } catch {
        // A malformed escape such as /%E0%A4%A. Pages answers 400; uncaught,
        // the URIError ended the whole server.
        return { status: 400 };
    }
    // /%00 decodes to a NUL byte, which is no path at all: statSync() throws
    // ERR_INVALID_ARG_VALUE on it, and that too ended the whole server. Pages
    // answers 400 for it.
    if (decoded.includes("\0")) return { status: 400 };

    // normalize() collapses any ../ before it can escape dist/.
    const clean = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
    const target = join(distDir, clean);
    if (!target.startsWith(distDir)) return { status: 404 };
    // One stat that cannot throw, not existsSync() then statSync(): a rebuild
    // can delete the file in between, and the stat then ended the server.
    if (statSync(target, { throwIfNoEntry: false })?.isFile()) return { status: 200, file: target };

    const asDir = join(target, "index.html");
    if (!existsSync(asDir)) return { status: 404 };
    // Pages serves a directory only at its slash form and redirects the other
    // there, query and all. Answering 200 hid every link and canonical that
    // pointed at a redirect.
    if (!requested.endsWith("/")) return { status: 301, location: `${requested}/${query}` };
    return { status: 200, file: asDir };
};

/* Streams a file, or answers 500 if it cannot be read. Without an 'error'
   handler, a file that a rebuild deleted after the lookup raised an
   unhandled 'error' event, which ends the process. */
const send = (res, status, file) => {
    const stream = createReadStream(file);
    stream.on("open", (fd) => {
        res.writeHead(status, {
            "Content-Type": TYPES[extname(file).toLowerCase()] || "application/octet-stream",
            // Pages sends this; without it a byte-weight measurement over this
            // server reads every response as zero bytes.
            "Content-Length": fstatSync(fd).size,
        });
        stream.pipe(res);
    });
    stream.on("error", () => {
        if (res.headersSent) return res.destroy();
        res.writeHead(500, { "Content-Type": TYPES[".txt"] });
        res.end("500");
    });
};

if (!existsSync(distDir)) {
    console.error("dist/ not found — run `npm run build:ssg` first.");
    process.exit(1);
}

const handle = (req, res) => {
    const { status, file, location } = resolve(req.url);

    if (status === 301) {
        res.writeHead(301, { Location: location });
        return res.end();
    }

    if (status === 400) {
        res.writeHead(400, { "Content-Type": TYPES[".txt"] });
        return res.end("400 Bad Request");
    }

    if (status === 404) {
        const notFound = join(distDir, "404.html");
        if (existsSync(notFound)) return send(res, 404, notFound);
        res.writeHead(404, { "Content-Type": TYPES[".html"] });
        return res.end("404");
    }

    send(res, status, file);
};

createServer((req, res) => {
    // This server is shared by every check, so no request may end it: whatever
    // a URL provokes that the lookup above did not foresee answers 500.
    try {
        handle(req, res);
    } catch {
        if (res.headersSent) return res.destroy();
        res.writeHead(500, { "Content-Type": TYPES[".txt"] });
        res.end("500");
    }
}).listen(port, () => {
    console.log(`Serving dist/ as GitHub Pages would: http://localhost:${port}${base}`);
    console.log("Ctrl-C to stop.");
});
