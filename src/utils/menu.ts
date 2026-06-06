import type { Meal } from "@/services/openmensa";

export interface MealGroup {
  category: string;
  meals: Meal[];
}

/**
 * Group meals by their `category`, preserving the order in which categories
 * first appear in the API response (which roughly matches the serving line
 * order). Purely informational "Info" entries are pushed to the bottom.
 */
export function groupByCategory(meals: Meal[]): MealGroup[] {
  const order: string[] = [];
  const byCategory = new Map<string, Meal[]>();

  for (const meal of meals) {
    const category = meal.category?.trim() || "Sonstiges";
    if (!byCategory.has(category)) {
      byCategory.set(category, []);
      order.push(category);
    }
    byCategory.get(category)!.push(meal);
  }

  const isInfo = (c: string) => /info/i.test(c);
  order.sort((a, b) => Number(isInfo(a)) - Number(isInfo(b)));

  return order.map((category) => ({
    category,
    meals: byCategory.get(category)!,
  }));
}
