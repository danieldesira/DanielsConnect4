import { Themes } from "@danieldesira/daniels-connect4-common";
import Authentication from "./authentication";

const applyLightTheme = () => document.documentElement.classList.remove("dark");
const applyDarkTheme = () => document.documentElement.classList.add("dark");
const applySystemTheme = (isDark: boolean) =>
  isDark ? applyDarkTheme() : applyLightTheme();

const darkSystemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const themeListener = ({ matches }) => applySystemTheme(matches);

function trackSystemTheme() {
  darkSystemTheme.addEventListener("change", themeListener);
  applySystemTheme(darkSystemTheme.matches);
}

const untrackSystemTheme = () =>
  darkSystemTheme.removeEventListener("change", themeListener);

export default async function applySelectedTheme() {
  if (Authentication.isLoggedIn()) {
    try {
      const settings = await Authentication.getSettings();
      untrackSystemTheme();
      switch (settings.theme) {
        case Themes.Light:
          applyLightTheme();
          break;
        case Themes.Dark:
          applyDarkTheme();
          break;
        case Themes.System:
          trackSystemTheme();
          break;
      }
    } catch {
      trackSystemTheme();
    }
  } else {
    trackSystemTheme();
  }
}
