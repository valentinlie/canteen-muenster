import { Pressable, ScrollView, Text } from "react-native";

import type { Canteen } from "@/constants/canteens";

interface CanteenSelectorProps {
  canteens: Canteen[];
  selectedId: number;
  onSelect: (id: number) => void;
}

export function CanteenSelector({
  canteens,
  selectedId,
  onSelect,
}: CanteenSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {canteens.map((canteen) => {
        const active = canteen.id === selectedId;
        return (
          <Pressable
            key={canteen.id}
            onPress={() => onSelect(canteen.id)}
            className={`rounded-full px-4 py-2 ${
              active ? "bg-primary" : "border border-border bg-surface"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                active ? "text-on-primary" : "text-ink-muted"
              }`}
            >
              {canteen.shortName}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
