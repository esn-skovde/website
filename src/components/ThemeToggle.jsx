import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/ThemeContext";

const ThemeToggle = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <button
            onClick={toggleDarkMode}
            className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
            aria-label="Toggle Dark Mode"
        >
            {isDarkMode ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </button>
    );
};

export default ThemeToggle;
