import { ACTIVE_THEME } from "@/config";
import PlayfulTheme from "@/app/playful/theme";
import DarkTheme    from "@/app/dark/theme";
import MinimalTheme from "@/app/minimal/theme";

const themes = {
  playful: PlayfulTheme,
  dark:    DarkTheme,
  minimal: MinimalTheme,
} as const;

export default function Home() {
  const Theme = themes[ACTIVE_THEME];
  return <Theme />;
}