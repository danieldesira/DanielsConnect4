import { Themes } from "@danieldesira/daniels-connect4-common";
import Authentication from "./authentication";

const applyLightTheme = () => document.documentElement.classList.remove('dark');
const applyDarkTheme = () => document.documentElement.classList.add('dark');
const applySystemTheme = (isDark: boolean) => isDark ? applyDarkTheme() : applyLightTheme();

const darkSystemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const themeListener = ({ matches }) => applySystemTheme(matches);

function trackSystemTheme() {
    darkSystemTheme.addEventListener('change', themeListener);
    applySystemTheme(darkSystemTheme.matches);
}

const untrackSystemTheme = () => darkSystemTheme.removeEventListener('change', themeListener);

export default async function applySelectedTheme() {
    if (Authentication.isLoggedIn()) {
        const settings = await Authentication.getSettings();
        switch (settings.theme) {
            case Themes.Light:
                applyLightTheme();
                untrackSystemTheme();
                break;
            case Themes.Dark:
                applyDarkTheme();
                untrackSystemTheme();
                break;
            case Themes.System:
                trackSystemTheme();
                break;
        }
    } else {
        trackSystemTheme();
    }
}