/**
 * Design tokens. Everything in the UI themes off these values — no hard-coded
 * colors in components. Warm cream + deep avocado-green with a warm amber accent;
 * a warm-tinted charcoal dark counterpart.
 *
 * Ported from the project's former NativeWind CSS-variable palette so it matches
 * the token system used in the sibling "ritual" app.
 */

/** Semantic color slots a theme must provide. */
export interface ThemeColors {
  background: string;
  surface: string;
  /** Chips / inset rows. */
  surfaceInset: string;
  border: string;
  primary: string;
  primaryPress: string;
  onPrimary: string;
  accent: string;
  onAccent: string;
  /** Coloured app bar. */
  header: string;
  onHeader: string;
  onHeaderMuted: string;
  text: string;
  textMuted: string;
  textFaint: string;
}

const lightBase: ThemeColors = {
  background: "#F6F1E8", // warm cream
  surface: "#FFFDF9", // near-white, slightly warm cards
  surfaceInset: "#EEE7DB", // chips / inset rows
  border: "#E4DCCE",
  primary: "#106B5A", // deep avocado green
  primaryPress: "#0B5447",
  onPrimary: "#FFFFFF",
  accent: "#DD8231", // warm amber
  onAccent: "#FFFFFF",
  header: "#106B5A", // coloured app bar
  onHeader: "#F4F0E8",
  onHeaderMuted: "#ADCDC4",
  text: "#1C1B18",
  textMuted: "#5C564E",
  textFaint: "#968E82",
};

const darkBase: ThemeColors = {
  background: "#141518", // warm-tinted charcoal
  surface: "#1F2125",
  surfaceInset: "#2C2F34",
  border: "#363A40",
  primary: "#34C59E", // brighter green for dark surfaces
  primaryPress: "#28A886",
  onPrimary: "#061813",
  accent: "#F0A854",
  onAccent: "#181004",
  header: "#1C1F23",
  onHeader: "#ECEEEB",
  onHeaderMuted: "#969EA0",
  text: "#EBEDE9",
  textMuted: "#A6A9A3",
  textFaint: "#7A7E7A",
};

export function makeColors(scheme: "light" | "dark"): ThemeColors {
  return scheme === "dark" ? darkBase : lightBase;
}

/** 8pt spacing scale. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
  display: 40,
} as const;
