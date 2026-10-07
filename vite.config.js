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
