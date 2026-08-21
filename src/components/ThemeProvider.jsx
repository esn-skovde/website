import { useCallback, useEffect, useMemo, useState } from "react";
import ThemeContext from "../hooks/ThemeContext";

const STORAGE_KEY = "theme";
const THEMES = ["system", "light", "dark"];

const prefersDark = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

const readStored = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return THEMES.includes(stored) ? stored : "system";
    } catch {
        return "system";
    }
};

/**
 * Tri-state theme: system (default), light, dark.
 *
 * The initial class is set by the inline script in index.html, before first
 * paint — this provider only keeps it in sync afterwards.
 */
export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(readStored);
    const [systemDark, setSystemDark] = useState(prefersDark);

    // Follow the OS while the preference is "system".
    useEffect(() => {
        const query = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = (event) => setSystemDark(event.matches);
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, []);

    const resolved = theme === "system" ? (systemDark ? "dark" : "light") : theme;

    useEffect(() => {
        document.documentElement.classList.toggle("dark", resolved === "dark");
        document.documentElement.style.colorScheme = resolved;
    }, [resolved]);

    const setTheme = useCallback((next) => {
        setThemeState(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            /* private mode — the choice just won't persist */
        }
    }, []);

    const cycleTheme = useCallback(() => {
        setTheme(THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]);
    }, [theme, setTheme]);

    const value = useMemo(
        () => ({ theme, resolved, setTheme, cycleTheme }),
        [theme, resolved, setTheme, cycleTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
