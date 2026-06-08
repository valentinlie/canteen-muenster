import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useTheme } from "@/theme";

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
  const { colors, radius, spacing, fontSize } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
        paddingVertical: 80,
      }}
    >
      {kind === "loading" ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Text style={{ fontSize: 36 }}>{EMOJI[kind]}</Text>
      )}

      <Text
        style={{
          marginTop: spacing.lg,
          textAlign: "center",
          fontSize: fontSize.md,
          fontWeight: "600",
          color: colors.text,
        }}
      >
        {title}
      </Text>
      {message && (
        <Text
          style={{
            marginTop: 6,
            textAlign: "center",
            fontSize: fontSize.sm,
            lineHeight: 23,
            color: colors.textMuted,
          }}
        >
          {message}
        </Text>
      )}

      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => ({
            marginTop: 20,
            borderRadius: radius.pill,
            backgroundColor: colors.primary,
            paddingHorizontal: spacing.xl,
            paddingVertical: 10,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text
            style={{
              fontSize: fontSize.sm,
              fontWeight: "600",
              color: colors.onPrimary,
            }}
          >
            Erneut versuchen
          </Text>
        </Pressable>
      )}
    </View>
  );
}
