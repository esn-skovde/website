/** @type {import('tailwindcss').Config} */

// Colours resolve through CSS custom properties defined in src/index.css, so
// the whole site can be re-themed from one file and dark mode needs no
// per-utility `dark:` variant.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                ground: token("ground"),
                surface: token("surface"),
                "surface-2": token("surface-2"),
                ink: token("ink"),
                "ink-muted": token("ink-muted"),
                "ink-faint": token("ink-faint"),
                hairline: token("hairline"),
                // Per-page accent; PageShell rebinds these per route.
                // `signal` is the brand hue (borders, rings, glows).
                // `signal-ink` is the legible variant (text, links, button fills).
                signal: token("signal"),
                "signal-ink": token("signal-ink"),
                "on-signal": token("on-signal"),
                // The ESN star. Fixed brand values, never themed.
                esn: {
                    cyan: token("esn-cyan"),
                    magenta: token("esn-magenta"),
                    green: token("esn-green"),
                    orange: token("esn-orange"),
                    indigo: token("esn-indigo"),
                },
            },
            fontFamily: {
                display: ["Kelson Sans", "ui-sans-serif", "system-ui", "sans-serif"],
                body: ["Lato", "ui-sans-serif", "system-ui", "sans-serif"],
                sans: ["Lato", "ui-sans-serif", "system-ui", "sans-serif"],
            },
            fontSize: {
                "display-sm": ["clamp(2.25rem, 6vw, 3.25rem)", { lineHeight: "0.98" }],
                "display-md": ["clamp(2.75rem, 8vw, 4.5rem)", { lineHeight: "0.95" }],
                "display-lg": ["clamp(3.25rem, 10vw, 6rem)", { lineHeight: "0.92" }],
            },
            spacing: {
                nav: "var(--nav-height)",
            },
            borderRadius: {
                panel: "1.25rem",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-12px)" },
                },
                "rise-in": {
                    from: { opacity: "0", transform: "translateY(1.5rem)" },
                    to: { opacity: "1", transform: "none" },
                },
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                marquee: {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-50%)" },
                },
                "spin-slow": {
                    to: { transform: "rotate(360deg)" },
                },
            },
            animation: {
                /* One bob of five seconds, not a loop: motion that starts by
                   itself and runs longer than that needs a way to stop it
                   (WCAG 2.2.2), and the card image has none. */
                float: "float 5s ease-in-out 1",
                "rise-in": "rise-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
                "fade-in": "fade-in 0.6s ease-out both",
                marquee: "marquee 40s linear infinite",
                "spin-slow": "spin-slow 1.2s linear infinite",
            },
        },
    },
    plugins: [],
};
