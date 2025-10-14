import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    base: "/",
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
