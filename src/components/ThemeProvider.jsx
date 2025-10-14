import { useState, useEffect } from "react";
import ThemeContext from "../hooks/ThemeContext";

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check user preferences when component mounts
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDarkMode(false);
        }
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkMode(true);
        }
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
