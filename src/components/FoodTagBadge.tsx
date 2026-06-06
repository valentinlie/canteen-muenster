import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";

import { useTheme } from "@/theme/theme";
import type { FoodTag } from "@/utils/notes";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface TagStyle {
  icon: IconName;
  label: string;
  /** Base accent colour as an RGB triplet. */
  rgb: [number, number, number];
}

const TAG_STYLES: Record<FoodTag, TagStyle> = {
  vegan: { icon: "leaf", label: "Vegan", rgb: [34, 160, 94] },
  vegetarisch: { icon: "sprout", label: "Vegetarisch", rgb: [124, 168, 54] },
  geflügel: { icon: "food-drumstick", label: "Geflügel", rgb: [214, 146, 56] },
  rind: { icon: "cow", label: "Rind", rgb: [163, 110, 78] },
  schwein: { icon: "pig-variant", label: "Schwein", rgb: [221, 122, 158] },
  fisch: { icon: "fish", label: "Fisch", rgb: [64, 150, 199] },
};

/** Mix a colour toward white by `amount` (0–1) for better contrast on dark. */
function lighten([r, g, b]: [number, number, number], amount: number): string {
  const m = (c: number) => Math.round(c + (255 - c) * amount);
  return `rgb(${m(r)}, ${m(g)}, ${m(b)})`;
}

export function FoodTagBadge({ tag }: { tag: FoodTag }) {
  const { isDark } = useTheme();
  const style = TAG_STYLES[tag];
  const [r, g, b] = style.rgb;

  const fg = isDark ? lighten(style.rgb, 0.25) : `rgb(${r}, ${g}, ${b})`;
  const bg = `rgba(${r}, ${g}, ${b}, ${isDark ? 0.22 : 0.14})`;

  return (
    <View
      accessibilityLabel={style.label}
      style={{ backgroundColor: bg }}
      className="h-8 w-8 items-center justify-center rounded-full"
    >
      <MaterialCommunityIcons name={style.icon} size={18} color={fg} />
    </View>
  );
}

export function FoodTagRow({ tags }: { tags: FoodTag[] }) {
  if (tags.length === 0) return null;
  return (
    <View className="mt-3 flex-row flex-wrap gap-2">
      {tags.map((tag) => (
        <FoodTagBadge key={tag} tag={tag} />
      ))}
    </View>
  );
}
