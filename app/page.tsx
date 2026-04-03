import { ACTIVE_THEME } from "@/config";
import PlayfulTheme from "@/app/playful/theme";
// import DarkTheme    from "@/app/dark/theme";
// import MinimalTheme from "@/app/minimal/theme";

// Each theme file imports its own CSS at the top
// so CSS is co-located with the theme component itself

const themes = {
  playful: PlayfulTheme,
  // dark:    DarkTheme,
  // minimal: MinimalTheme,
} as const;

export default function Home() {
  const Theme = themes[ACTIVE_THEME];
  return <Theme />;
}