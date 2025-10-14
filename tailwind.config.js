/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                'heading': ['Kelson Sans', 'system-ui', 'sans-serif'],
                'body': ['Lato', 'system-ui', 'sans-serif'],
                'sans': ['Kelson Sans', 'system-ui', 'sans-serif'], // Default for UI elements, nav, buttons
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "slide-in-left": {
                    "0%": { opacity: "0", transform: "translateX(-50px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                "glow-pulse": {
                    "0%, 100%": { textShadow: "1px 3px 6px rgba(0,0,0,0.7)" },
                    "50%": { textShadow: "1px 3px 6px rgba(0,0,0,0.7), 0 0 20px rgba(255,255,255,0.3)" },
                },
            },
            animation: {
                float: "float 4s ease-in-out infinite",
                "fade-in": "fade-in 1s ease-out",
                "slide-in-left": "slide-in-left 1.2s ease-out 0.5s both",
                "glow-pulse": "glow-pulse 3s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};

