"use client";
import { useTheme } from "@/context/ThemeContext";
import PlayfulTheme from "@/app/playful/theme";
import DarkTheme    from "@/app/dark/theme";
import MinimalTheme from "@/app/minimal/theme";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const themes = {
  playful: PlayfulTheme,
  dark:    DarkTheme,
  minimal: MinimalTheme,
};

export default function Home() {
  const { theme } = useTheme();
  const Theme = themes[theme];
  return (
    <>
      <Theme />
      <ThemeSwitcher />
    </>
  );
}