import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/** User's appearance preference. "system" follows the OS setting. */
export type ThemePref = "system" | "light" | "dark";

const STORAGE_KEY = "@mensa/theme-preference";

interface ThemeContextValue {
  pref: ThemePref;
  setPref: (pref: ThemePref) => void;
  /** The effective scheme after resolving "system". */
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [pref, setPrefState] = useState<ThemePref>("system");

  // Restore the saved preference on first mount.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value === "light" || value === "dark" || value === "system") {
        setPrefState(value);
        setColorScheme(value);
      }
    });
  }, [setColorScheme]);

  const setPref = (next: ThemePref) => {
    setPrefState(next);
    setColorScheme(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      // Persisting the theme is best-effort; ignore storage failures.
    });
  };

  return (
    <ThemeContext.Provider
      value={{ pref, setPref, isDark: colorScheme === "dark" }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
