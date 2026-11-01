// Responsive image lookup.
//
// scripts/optimize-images.js writes WebP variants as `<name>-<width>.webp`
// into src/assets/images/optimized/. This turns those files into srcset
// strings so components never hard-code a URL or a width.

const modules = import.meta.glob("../assets/images/optimized/**/*.webp", {
    eager: true,
    query: "?url",
    import: "default",
});

/** { "board/president": [{ width: 400, url }, { width: 640, url }] } */
const variants = (() => {
    const map = {};
    for (const [path, url] of Object.entries(modules)) {
        const rel = path.replace("../assets/images/optimized/", "").replace(/\.webp$/, "");
        const match = rel.match(/^(.*)-(\d+)$/);
        if (!match) continue;
        const [, name, width] = match;
        (map[name] ??= []).push({ width: Number(width), url });
    }
    for (const list of Object.values(map)) list.sort((a, b) => a.width - b.width);
    return map;
})();

/**
 * @param {string} name path without extension or width, e.g. "board/president"
 * @returns {{ src: string, srcSet: string, width: number } | null}
 */
export const getImage = (name) => {
    const list = name ? variants[name] : null;
    if (!list?.length) return null;
    const largest = list[list.length - 1];
    return {
        src: largest.url,
        srcSet: list.map((v) => `${v.url} ${v.width}w`).join(", "),
        width: largest.width,
    };
};

/** Strips a filename down to the key getImage expects: "president.jpeg" -> "president". */
export const imageKey = (filename, dir = "") => {
    if (!filename) return "";
    const stem = filename.replace(/\.[^.]+$/, "");
    return dir ? `${dir}/${stem}` : stem;
};

export const hasImage = (name) => Boolean(name && variants[name]?.length);
