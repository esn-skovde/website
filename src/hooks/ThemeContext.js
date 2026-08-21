import { createContext, useContext } from "react";

export const ThemeContext = createContext({
    theme: "system",
    resolved: "light",
    setTheme: () => {},
    cycleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
