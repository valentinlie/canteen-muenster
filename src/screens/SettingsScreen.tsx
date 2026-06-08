import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  PRICE_CATEGORIES,
  usePriceCategory,
} from "@/settings/priceCategory";
import { useTheme, type ThemePref } from "@/theme";

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
  const { pref, setPref, colors, radius, spacing, fontSize } = useTheme();
  const { category, setCategory } = usePriceCategory();
  const iconColor = colors.primary;

  const sectionLabel = {
    paddingHorizontal: spacing.xs,
    fontSize: fontSize.xs,
    fontWeight: "700" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    color: colors.textMuted,
  };
  const card = {
    overflow: "hidden" as const,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  };
  const row = (index: number) => ({
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderTopWidth: index > 0 ? 1 : 0,
    borderTopColor: colors.border,
  });

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      {/* App bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
          backgroundColor: colors.header,
          paddingHorizontal: spacing.sm,
          paddingBottom: spacing.lg,
          paddingTop: spacing.sm,
        }}
      >
        <Pressable
          onPress={onClose}
          hitSlop={8}
          style={({ pressed }) => ({
            height: 40,
            width: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={colors.onHeader}
          />
        </Pressable>
        <Text
          style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.onHeader }}
        >
          Einstellungen
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={{ ...sectionLabel, marginBottom: 10 }}>Erscheinungsbild</Text>

        <View style={card}>
          {APPEARANCE_OPTIONS.map((option, index) => {
            const selected = pref === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setPref(option.value)}
                style={({ pressed }) => ({
                  ...row(index),
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <MaterialCommunityIcons
                  name={option.icon}
                  size={22}
                  color={iconColor}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 15, fontWeight: "600", color: colors.text }}
                  >
                    {option.label}
                  </Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textFaint }}>
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

        <Text style={{ ...sectionLabel, marginBottom: 10, marginTop: spacing.xxl }}>
          Preise
        </Text>

        <View style={card}>
          {PRICE_OPTIONS.map((option, index) => {
            const selected = category === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setCategory(option.value)}
                style={({ pressed }) => ({
                  ...row(index),
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <MaterialCommunityIcons
                  name={option.icon}
                  size={22}
                  color={iconColor}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 15, fontWeight: "600", color: colors.text }}
                  >
                    {option.label}
                  </Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textFaint }}>
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

        <Text
          style={{
            marginTop: spacing.xxl,
            paddingHorizontal: spacing.xs,
            textAlign: "center",
            fontSize: fontSize.xs,
            lineHeight: 20,
            color: colors.textFaint,
          }}
        >
          Mensa Münster{"\n"}Speiseplandaten von OpenMensa · ohne Werbung,
          ohne Tracking
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
