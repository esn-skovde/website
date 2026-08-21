import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* esnskovde.org serves from the domain root, but a GitHub project page serves
   from /<repo>/, and a hardcoded "/" base makes every asset URL 404 there — a
   blank site. The deploy workflow passes actions/configure-pages' base_path,
   which is "/" for a custom domain and "/<repo>" for a project page. */
const basePath = process.env.BASE_PATH || "/";
const base = basePath.endsWith("/") ? basePath : `${basePath}/`;

export default defineConfig({
    plugins: [react()],
    base,
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    ui: ['lucide-react'],
                    i18n: ['react-i18next', 'i18next'],
                    utils: ['date-fns'],
                    supabase: ['@supabase/supabase-js'],
                    notifications: ['sonner'],
                }
            }
        },
        chunkSizeWarningLimit: 1000,
        sourcemap: false,
    },
});
