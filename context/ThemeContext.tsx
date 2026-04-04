"use client";
import { createContext, useContext, useState } from "react";
import { ACTIVE_THEME, THEME_COOKIE, type Theme } from "@/config";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: ACTIVE_THEME, setTheme: () => {} });

export function ThemeProvider({
  children,
  initialTheme = ACTIVE_THEME,
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  const setTheme = (t: Theme) => {
    document.cookie = `${THEME_COOKIE}=${t}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);