import { Text, View } from "react-native";

import type { Meal } from "@/services/openmensa";
import {
  priceCategoryLabel,
  priceFor,
  usePriceCategory,
} from "@/settings/priceCategory";
import { cleanMealName, formatPrice } from "@/utils/format";
import { parseNotes } from "@/utils/notes";
import { FoodTagRow } from "./FoodTagBadge";

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const { category } = usePriceCategory();
  const { tags, allergens } = parseNotes(meal.notes);
  const price = priceFor(category, meal.prices);

  return (
    <View className="mb-3 rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-black/5">
      <View className="flex-row items-start justify-between gap-3">
        <Text className="flex-1 text-[15px] font-semibold leading-snug text-ink">
          {cleanMealName(meal.name)}
        </Text>

        {price !== null && (
          <View className="items-end">
            <Text className="text-base font-bold text-primary">
              {formatPrice(price)}
            </Text>
            <Text className="text-[10px] font-medium uppercase tracking-wide text-ink-faint">
              {priceCategoryLabel(category)}
            </Text>
          </View>
        )}
      </View>

      <FoodTagRow tags={tags} />

      {allergens.length > 0 && (
        <Text className="mt-3 text-xs leading-relaxed text-ink-faint">
          Enthält: {allergens.join(", ")}
        </Text>
      )}
    </View>
  );
}
