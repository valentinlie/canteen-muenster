import { Text, View } from "react-native";

import type { Meal } from "@/services/openmensa";
import {
  priceCategoryLabel,
  priceFor,
  usePriceCategory,
} from "@/settings/priceCategory";
import { useTheme } from "@/theme";
import { cleanMealName, formatPrice } from "@/utils/format";
import { parseNotes } from "@/utils/notes";
import { FoodTagRow } from "./FoodTagBadge";

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const { colors, radius, spacing, fontSize } = useTheme();
  const { category } = usePriceCategory();
  const { tags, allergens } = parseNotes(meal.notes);
  const price = priceFor(category, meal.prices);

  return (
    <View
      style={{
        marginBottom: spacing.md,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        padding: spacing.lg,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: spacing.md,
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 15,
            fontWeight: "600",
            lineHeight: 21,
            color: colors.text,
          }}
        >
          {cleanMealName(meal.name)}
        </Text>

        {price !== null && (
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                fontSize: fontSize.md,
                fontWeight: "700",
                color: colors.primary,
              }}
            >
              {formatPrice(price)}
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: 0.25,
                color: colors.textFaint,
              }}
            >
              {priceCategoryLabel(category)}
            </Text>
          </View>
        )}
      </View>

      <FoodTagRow tags={tags} />

      {allergens.length > 0 && (
        <Text
          style={{
            marginTop: spacing.md,
            fontSize: fontSize.xs,
            lineHeight: 20,
            color: colors.textFaint,
          }}
        >
          Enthält: {allergens.join(", ")}
        </Text>
      )}
    </View>
  );
}
