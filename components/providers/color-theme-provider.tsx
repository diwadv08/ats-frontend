/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Color Theme Provider
 * Applies the selected brand color palette to <html data-color-theme="...">
 * and persists the choice. Every component reads colors from CSS
 * variables (bg-primary, text-secondary, var(--chart-1), etc), so
 * this single attribute change re-themes the entire application —
 * dashboard, charts, sidebar, auth pages, badges, gradients — all
 * of it, instantly, on every page.
 *
 * Also drives the "wow" theme-change transition: whenever the
 * palette changes (preset or fully custom), a 2s animated overlay
 * plays while the new colors settle across every widget.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  COLOR_THEMES,
  DEFAULT_COLOR_THEME,
  COLOR_THEME_STORAGE_KEY,
  CUSTOM_THEME_ID,
  CUSTOM_THEME_STORAGE_KEY,
  DEFAULT_CUSTOM_COLORS,
  type CustomThemeColors,
  hexToHslTriplet,
} from "@/lib/color-themes";
import { ThemeTransitionOverlay } from "@/components/shared/theme-transition-overlay";

const TRANSITION_DURATION_MS = 2000;

interface ColorThemeContextValue {
  colorTheme: string;
  setColorTheme: (id: string) => void;
  customColors: CustomThemeColors;
  setCustomColors: (colors: CustomThemeColors) => void;
  themeLabel: string;
}

const ColorThemeContext = createContext<ColorThemeContextValue | undefined>(
  undefined
);

function applyCustomColors(colors: CustomThemeColors) {
  const root = document.documentElement;
  const primary = hexToHslTriplet(colors.primary);
  const secondary = hexToHslTriplet(colors.secondary);
  const accent = hexToHslTriplet(colors.accent);
  root.style.setProperty("--primary", primary);
  root.style.setProperty("--secondary", secondary);
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--ring", primary);
  root.style.setProperty("--chart-1", primary);
  root.style.setProperty("--chart-2", secondary);
  root.style.setProperty("--chart-3", accent);
}

function clearCustomColors() {
  const root = document.documentElement;
  [
    "--primary",
    "--secondary",
    "--accent",
    "--ring",
    "--chart-1",
    "--chart-2",
    "--chart-3",
  ].forEach((prop) => root.style.removeProperty(prop));
}

/** Inline script injected before hydration so there's no flash of the default palette. */
export const colorThemeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("${COLOR_THEME_STORAGE_KEY}");
    var valid = ${JSON.stringify([
      ...COLOR_THEMES.map((t) => t.id),
      CUSTOM_THEME_ID,
    ])};
    var theme = stored && valid.indexOf(stored) !== -1 ? stored : "${DEFAULT_COLOR_THEME}";
    document.documentElement.setAttribute("data-color-theme", theme);
    if (theme === "${CUSTOM_THEME_ID}") {
      var raw = localStorage.getItem("${CUSTOM_THEME_STORAGE_KEY}");
      if (raw) {
        var c = JSON.parse(raw);
        var root = document.documentElement;
        function hslOf(hex) {
          var clean = hex.replace('#', '');
          if (clean.length === 3) clean = clean.split('').map(function(ch){return ch+ch;}).join('');
          var bigint = parseInt(clean, 16);
          var r = ((bigint >> 16) & 255) / 255, g = ((bigint >> 8) & 255) / 255, b = (bigint & 255) / 255;
          var max = Math.max(r,g,b), min = Math.min(r,g,b), h=0,s=0,l=(max+min)/2;
          if (max !== min) {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
            else if (max === g) h = (b - r) / d + 2;
            else h = (r - g) / d + 4;
            h /= 6;
          }
          return Math.round(h*360) + ' ' + Math.round(s*100) + '% ' + Math.round(l*100) + '%';
        }
        root.style.setProperty('--primary', hslOf(c.primary));
        root.style.setProperty('--secondary', hslOf(c.secondary));
        root.style.setProperty('--accent', hslOf(c.accent));
        root.style.setProperty('--ring', hslOf(c.primary));
        root.style.setProperty('--chart-1', hslOf(c.primary));
        root.style.setProperty('--chart-2', hslOf(c.secondary));
        root.style.setProperty('--chart-3', hslOf(c.accent));
      }
    }
  } catch (e) {}
})();
`;

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<string>(
    DEFAULT_COLOR_THEME
  );
  const [customColors, setCustomColorsState] = useState<CustomThemeColors>(
    DEFAULT_CUSTOM_COLORS
  );
  const [transitioning, setTransitioning] = useState(false);
  const [transitionSwatch, setTransitionSwatch] = useState<
    [string, string, string]
  >(["#8b3ff2", "#3b6ff0", "#f5a623"]);
  const [transitionLabel, setTransitionLabel] = useState("Theme");
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(COLOR_THEME_STORAGE_KEY);
    const validIds = [...COLOR_THEMES.map((t) => t.id), CUSTOM_THEME_ID];
    const initial =
      storedTheme && validIds.includes(storedTheme)
        ? storedTheme
        : DEFAULT_COLOR_THEME;
    setColorThemeState(initial);
    document.documentElement.setAttribute("data-color-theme", initial);

    const storedCustom = window.localStorage.getItem(
      CUSTOM_THEME_STORAGE_KEY
    );
    if (storedCustom) {
      try {
        const parsed = JSON.parse(storedCustom) as CustomThemeColors;
        setCustomColorsState(parsed);
        if (initial === CUSTOM_THEME_ID) applyCustomColors(parsed);
      } catch {
        // ignore malformed storage
      }
    }
  }, []);

  const playTransition = (swatch: [string, string, string], label: string) => {
    setTransitionSwatch(swatch);
    setTransitionLabel(label);
    setTransitioning(true);
    if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    transitionTimeout.current = setTimeout(() => {
      setTransitioning(false);
    }, TRANSITION_DURATION_MS);
  };

  const setColorTheme = (id: string) => {
    setColorThemeState(id);
    document.documentElement.setAttribute("data-color-theme", id);
    window.localStorage.setItem(COLOR_THEME_STORAGE_KEY, id);

    if (id === CUSTOM_THEME_ID) {
      applyCustomColors(customColors);
      playTransition(
        [customColors.primary, customColors.secondary, customColors.accent],
        "Custom"
      );
      return;
    }

    clearCustomColors();
    const preset = COLOR_THEMES.find((t) => t.id === id);
    playTransition(preset?.swatch || ["#8b3ff2", "#3b6ff0", "#f5a623"], preset?.label || "Theme");
  };

  const setCustomColors = (colors: CustomThemeColors) => {
    setCustomColorsState(colors);
    window.localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify(colors));
    setColorThemeState(CUSTOM_THEME_ID);
    document.documentElement.setAttribute("data-color-theme", CUSTOM_THEME_ID);
    window.localStorage.setItem(COLOR_THEME_STORAGE_KEY, CUSTOM_THEME_ID);
    applyCustomColors(colors);
    playTransition([colors.primary, colors.secondary, colors.accent], "Custom");
  };

  const themeLabel =
    colorTheme === CUSTOM_THEME_ID
      ? "Custom"
      : COLOR_THEMES.find((t) => t.id === colorTheme)?.label || "Theme";

  return (
    <ColorThemeContext.Provider
      value={{
        colorTheme,
        setColorTheme,
        customColors,
        setCustomColors,
        themeLabel,
      }}
    >
      {children}
      <ThemeTransitionOverlay
        active={transitioning}
        swatch={transitionSwatch}
        label={transitionLabel}
      />
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  const ctx = useContext(ColorThemeContext);
  if (!ctx) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider");
  }
  return ctx;
}
