import { Pressable, ScrollView, Text } from "react-native";

import type { Canteen } from "@/constants/canteens";
import { useTheme } from "@/theme";

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
  const { colors, radius, spacing, fontSize } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
    >
      {canteens.map((canteen) => {
        const active = canteen.id === selectedId;
        return (
          <Pressable
            key={canteen.id}
            onPress={() => onSelect(canteen.id)}
            style={{
              borderRadius: radius.pill,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm,
              backgroundColor: active ? colors.primary : colors.surface,
              borderWidth: active ? 0 : 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: fontSize.sm,
                fontWeight: "600",
                color: active ? colors.onPrimary : colors.textMuted,
              }}
            >
              {canteen.shortName}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
