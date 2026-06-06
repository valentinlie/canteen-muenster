import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useTheme } from "@/theme/theme";

interface StateViewProps {
  kind: "loading" | "empty" | "error";
  title: string;
  message?: string;
  onRetry?: () => void;
}

const EMOJI: Record<StateViewProps["kind"], string> = {
  loading: "",
  empty: "🍽️",
  error: "⚠️",
};

export function StateView({ kind, title, message, onRetry }: StateViewProps) {
  const { isDark } = useTheme();
  const spinner = isDark ? "rgb(52,197,158)" : "rgb(16,107,90)";

  return (
    <View className="flex-1 items-center justify-center px-10 py-20">
      {kind === "loading" ? (
        <ActivityIndicator size="large" color={spinner} />
      ) : (
        <Text className="text-4xl">{EMOJI[kind]}</Text>
      )}

      <Text className="mt-4 text-center text-base font-semibold text-ink">
        {title}
      </Text>
      {message && (
        <Text className="mt-1.5 text-center text-sm leading-relaxed text-ink-muted">
          {message}
        </Text>
      )}

      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="mt-5 rounded-full bg-primary px-6 py-2.5 active:opacity-80"
        >
          <Text className="text-sm font-semibold text-on-primary">
            Erneut versuchen
          </Text>
        </Pressable>
      )}
    </View>
  );
}
