import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";

import {
  fontSize,
  makeColors,
  radius,
  spacing,
  type ThemeColors,
} from "./tokens";

/** User's appearance preference. "system" follows the OS setting. */
export type ThemePref = "system" | "light" | "dark";

const STORAGE_KEY = "@mensa/theme-preference";

export interface Theme {
  scheme: "light" | "dark";
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  fontSize: typeof fontSize;
}

interface ThemeContextValue extends Theme {
  pref: ThemePref;
  setPref: (pref: ThemePref) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>("system");

  // Dark-first: when the OS scheme is unavailable/unspecified, default to dark.
  const system = useColorScheme();
  const systemScheme: "light" | "dark" = system === "light" ? "light" : "dark";
  const scheme: "light" | "dark" = pref === "system" ? systemScheme : pref;

  // Restore the saved preference on first mount.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value === "light" || value === "dark" || value === "system") {
        setPrefState(value);
      }
    });
  }, []);

  const setPref = (next: ThemePref) => {
    setPrefState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      // Persisting the theme is best-effort; ignore storage failures.
    });
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      scheme,
      colors: makeColors(scheme),
      spacing,
      radius,
      fontSize,
      pref,
      setPref,
    }),
    [scheme, pref],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
