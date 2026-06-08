import { Pressable, ScrollView, Text, View } from "react-native";

import type { Day } from "@/services/openmensa";
import { useTheme } from "@/theme";
import { shortDateLabel } from "@/utils/format";

interface DateSelectorProps {
  days: Day[];
  selectedDate: string | null;
  onSelect: (date: string) => void;
}

export function DateSelector({
  days,
  selectedDate,
  onSelect,
}: DateSelectorProps) {
  const { colors, radius, spacing, fontSize } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
    >
      {days.map((day) => {
        const active = day.date === selectedDate;
        const { weekday, day: dayNum } = shortDateLabel(day.date);
        return (
          <Pressable
            key={day.date}
            onPress={() => onSelect(day.date)}
            style={{
              minWidth: 52,
              alignItems: "center",
              borderRadius: radius.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              backgroundColor: active ? colors.accent : colors.surface,
              borderWidth: active ? 0 : 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "600",
                textTransform: "uppercase",
                color: active ? colors.onAccent : colors.textFaint,
                opacity: active ? 0.8 : 1,
              }}
            >
              {weekday}
            </Text>
            <View style={{ height: 2 }} />
            <Text
              style={{
                fontSize: fontSize.md,
                fontWeight: "700",
                color: active ? colors.onAccent : colors.text,
              }}
            >
              {dayNum}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
