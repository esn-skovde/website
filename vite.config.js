import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* esnskovde.org serves from the domain root, but a GitHub project page serves
   from /<repo>/, and a hardcoded "/" base makes every asset URL 404 there — a
   blank site. BASE_PATH sets it: unset or empty for the domain root, "/<repo>"
   for a project page (actions/configure-pages reports exactly those two shapes,
   with the trailing slash stripped). Both are normalised below. */
const basePath = process.env.BASE_PATH || "/";
const base = basePath.endsWith("/") ? basePath : `${basePath}/`;

export default defineConfig({
    plugins: [react()],
    base,
    build: {
        /* Vite writes anything under 4 kB into the code as base64. For four
           small images that meant the entry chunk, which every page downloads,
           though a page shows at most one of them and a high-density phone
           picks none of the logos' small sizes. Images stay files that the
           page using them fetches; every other asset keeps Vite's rule. */
        assetsInlineLimit: (file) => (file.endsWith('.webp') ? false : undefined),
        rollupOptions: {
            output: {
                manualChunks: {
                    /* No 'vendor' entry: react and react-dom are reachable from
                       the entry itself, so Rollup keeps them in index and the
                       entry only ever emitted an empty chunk plus a build
                       warning. Everything below genuinely splits. */
                    router: ['react-router-dom'],
                    ui: ['lucide-react'],
                    i18n: ['react-i18next', 'i18next'],
                    supabase: ['@supabase/supabase-js'],
                    notifications: ['sonner'],
                }
            }
        },
        chunkSizeWarningLimit: 1000,
        sourcemap: false,
    },
});
