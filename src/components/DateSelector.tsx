import { Pressable, ScrollView, Text, View } from "react-native";

import type { Day } from "@/services/openmensa";
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
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {days.map((day) => {
        const active = day.date === selectedDate;
        const { weekday, day: dayNum } = shortDateLabel(day.date);
        return (
          <Pressable
            key={day.date}
            onPress={() => onSelect(day.date)}
            className={`min-w-[52px] items-center rounded-xl px-3 py-2 ${
              active ? "bg-accent" : "border border-border bg-surface"
            }`}
          >
            <Text
              className={`text-[11px] font-semibold uppercase ${
                active ? "text-accent-on/80" : "text-ink-faint"
              }`}
            >
              {weekday}
            </Text>
            <View className="h-0.5" />
            <Text
              className={`text-base font-bold ${
                active ? "text-accent-on" : "text-ink"
              }`}
            >
              {dayNum}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
