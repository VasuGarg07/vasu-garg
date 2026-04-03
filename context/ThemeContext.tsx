"use client";
import { createContext, useContext, useState } from "react";
import type { Theme } from "@/config";
import { ACTIVE_THEME } from "@/config";

const ThemeContext = createContext<{
    theme: Theme;
    setTheme: (t: Theme) => void;
}>({ theme: "playful", setTheme: () => { } });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(ACTIVE_THEME);
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);