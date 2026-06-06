import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  PRICE_CATEGORIES,
  usePriceCategory,
} from "@/settings/priceCategory";
import { useTheme, type ThemePref } from "@/theme/theme";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const APPEARANCE_OPTIONS: {
  value: ThemePref;
  label: string;
  description: string;
  icon: IconName;
}[] = [
  {
    value: "system",
    label: "System",
    description: "Folgt den Geräteeinstellungen",
    icon: "theme-light-dark",
  },
  {
    value: "light",
    label: "Hell",
    description: "Immer helles Design",
    icon: "white-balance-sunny",
  },
  {
    value: "dark",
    label: "Dunkel",
    description: "Immer dunkles Design",
    icon: "weather-night",
  },
];

const PRICE_OPTIONS: {
  value: (typeof PRICE_CATEGORIES)[number]["value"];
  label: string;
  description: string;
  icon: IconName;
}[] = [
  {
    value: "students",
    label: "Studierende",
    description: "Preise für Studierende",
    icon: "school-outline",
  },
  {
    value: "guests",
    label: "Gäste",
    description: "Preise für Gäste und Bedienstete",
    icon: "account-outline",
  },
];

export function SettingsScreen({ onClose }: { onClose: () => void }) {
  const { pref, setPref, isDark } = useTheme();
  const { category, setCategory } = usePriceCategory();
  const iconColor = isDark ? "rgb(52,197,158)" : "rgb(16,107,90)";

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      {/* App bar */}
      <View className="flex-row items-center gap-2 bg-header px-2 pb-4 pt-2">
        <Pressable
          onPress={onClose}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color="rgb(244,240,232)"
          />
        </Pressable>
        <Text className="text-xl font-bold text-header-on">Einstellungen</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="mb-2.5 px-1 text-xs font-bold uppercase tracking-widest text-ink-muted">
          Erscheinungsbild
        </Text>

        <View className="overflow-hidden rounded-2xl border border-border bg-surface">
          {APPEARANCE_OPTIONS.map((option, index) => {
            const selected = pref === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setPref(option.value)}
                className={`flex-row items-center gap-3 px-4 py-3.5 active:opacity-70 ${
                  index > 0 ? "border-t border-border" : ""
                }`}
              >
                <MaterialCommunityIcons
                  name={option.icon}
                  size={22}
                  color={iconColor}
                />
                <View className="flex-1">
                  <Text className="text-[15px] font-semibold text-ink">
                    {option.label}
                  </Text>
                  <Text className="text-xs text-ink-faint">
                    {option.description}
                  </Text>
                </View>
                {selected && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={22}
                    color={iconColor}
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        <Text className="mb-2.5 mt-8 px-1 text-xs font-bold uppercase tracking-widest text-ink-muted">
          Preise
        </Text>

        <View className="overflow-hidden rounded-2xl border border-border bg-surface">
          {PRICE_OPTIONS.map((option, index) => {
            const selected = category === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setCategory(option.value)}
                className={`flex-row items-center gap-3 px-4 py-3.5 active:opacity-70 ${
                  index > 0 ? "border-t border-border" : ""
                }`}
              >
                <MaterialCommunityIcons
                  name={option.icon}
                  size={22}
                  color={iconColor}
                />
                <View className="flex-1">
                  <Text className="text-[15px] font-semibold text-ink">
                    {option.label}
                  </Text>
                  <Text className="text-xs text-ink-faint">
                    {option.description}
                  </Text>
                </View>
                {selected && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={22}
                    color={iconColor}
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        <Text className="mt-8 px-1 text-center text-xs leading-relaxed text-ink-faint">
          Mensa Münster{"\n"}Speiseplandaten von OpenMensa · ohne Werbung,
          ohne Tracking
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
