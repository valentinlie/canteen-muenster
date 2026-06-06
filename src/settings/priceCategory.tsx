import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { OpenMensaPrices } from "@/services/openmensa";

/**
 * Which price the user wants to see. OpenMensa exposes four tiers, but the
 * Münster canteens only fill in `students` and `employees` (the `others`/
 * `pupils` tiers come back as null), so we surface just two choices and map
 * "Gäste" onto the populated `employees` price.
 */
export type PriceCategory = "students" | "guests";

interface PriceCategoryMeta {
  value: PriceCategory;
  label: string;
  /** The OpenMensa price tier this category reads from. */
  field: keyof OpenMensaPrices;
}

/** Display order, German labels and the underlying API field for each choice. */
export const PRICE_CATEGORIES: PriceCategoryMeta[] = [
  { value: "students", label: "Studierende", field: "students" },
  { value: "guests", label: "Gäste", field: "employees" },
];

const STORAGE_KEY = "@mensa/price-category";
const DEFAULT_CATEGORY: PriceCategory = "students";

function isPriceCategory(value: unknown): value is PriceCategory {
  return PRICE_CATEGORIES.some((c) => c.value === value);
}

interface PriceCategoryContextValue {
  category: PriceCategory;
  setCategory: (category: PriceCategory) => void;
}

const PriceCategoryContext = createContext<PriceCategoryContextValue | null>(
  null,
);

export function PriceCategoryProvider({ children }: { children: ReactNode }) {
  const [category, setCategoryState] = useState<PriceCategory>(DEFAULT_CATEGORY);

  // Restore the saved preference on first mount.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (isPriceCategory(value)) setCategoryState(value);
    });
  }, []);

  const setCategory = (next: PriceCategory) => {
    setCategoryState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      // Persisting the preference is best-effort; ignore storage failures.
    });
  };

  return (
    <PriceCategoryContext.Provider value={{ category, setCategory }}>
      {children}
    </PriceCategoryContext.Provider>
  );
}

export function usePriceCategory(): PriceCategoryContextValue {
  const ctx = useContext(PriceCategoryContext);
  if (!ctx)
    throw new Error(
      "usePriceCategory must be used within a PriceCategoryProvider",
    );
  return ctx;
}

function meta(category: PriceCategory): PriceCategoryMeta {
  return PRICE_CATEGORIES.find((c) => c.value === category)!;
}

/** Human-readable label for a category, e.g. "students" → "Studierende". */
export function priceCategoryLabel(category: PriceCategory): string {
  return meta(category).label;
}

/** Read the price for a category from an OpenMensa price set. */
export function priceFor(
  category: PriceCategory,
  prices: OpenMensaPrices,
): number | null {
  return prices[meta(category).field];
}
