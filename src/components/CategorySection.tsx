import { Text, View } from "react-native";

import { useTheme } from "@/theme";
import type { MealGroup } from "@/utils/menu";
import { MealCard } from "./MealCard";

interface CategorySectionProps {
  group: MealGroup;
}

export function CategorySection({ group }: CategorySectionProps) {
  const { colors, spacing, fontSize } = useTheme();
  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          marginBottom: 10,
          paddingHorizontal: spacing.xs,
          fontSize: fontSize.xs,
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: 1,
          color: colors.textMuted,
        }}
      >
        {group.category}
      </Text>
      {group.meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </View>
  );
}
