import { Text, View } from "react-native";

import type { MealGroup } from "@/utils/menu";
import { MealCard } from "./MealCard";

interface CategorySectionProps {
  group: MealGroup;
}

export function CategorySection({ group }: CategorySectionProps) {
  return (
    <View className="mb-5">
      <Text className="mb-2.5 px-1 text-xs font-bold uppercase tracking-widest text-ink-muted">
        {group.category}
      </Text>
      {group.meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </View>
  );
}
