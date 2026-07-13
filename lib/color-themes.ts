/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Color Theme Presets
 * Defines the available brand color palettes. Switching a preset
 * updates CSS custom properties on <html>, which every widget in
 * the app already reads via Tailwind (bg-primary, text-accent,
 * gradients, charts, shadows, focus rings, etc). Nothing else
 * needs to change — the whole product re-themes instantly.
 *
 * Three curated presets are offered, plus a fully custom option
 * where the user picks their own primary / secondary / accent
 * colors from the theme settings panel.
 * ─────────────────────────────────────────────────────────────
 */

export interface ColorTheme {
  id: string;
  label: string;
  /** 3 swatch colors shown in a row in the picker UI (light-mode primary/secondary/accent) */
  swatch: [string, string, string];
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: "violet",
    label: "Violet Gold",
    swatch: ["#8b3ff2", "#3b6ff0", "#f5a623"],
  },
  {
    id: "ocean",
    label: "Ocean Blue",
    swatch: ["#0ea5e9", "#8b5cf6", "#14b8a6"],
  },
  {
    id: "sunset",
    label: "Sunset Coral",
    swatch: ["#f2542d", "#ec4899", "#f5a623"],
  },
];

export const CUSTOM_THEME_ID = "custom";

export interface CustomThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

export const DEFAULT_CUSTOM_COLORS: CustomThemeColors = {
  primary: "#6d28d9",
  secondary: "#2563eb",
  accent: "#f59e0b",
};

export const DEFAULT_COLOR_THEME = "violet";
export const COLOR_THEME_STORAGE_KEY = "rdats-color-theme";
export const CUSTOM_THEME_STORAGE_KEY = "rdats-custom-theme-colors";

/** Convert a #rrggbb hex color into an "H S% L%" triplet, the format every CSS var in this app expects. */
export function hexToHslTriplet(hex: string): string {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/** Pick readable foreground (near-black or near-white) for a given hex background. */
export function readableForeground(hex: string): string {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "0 0% 10%" : "0 0% 100%";
}
