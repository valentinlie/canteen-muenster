import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CanteenSelector } from "@/components/CanteenSelector";
import { CategorySection } from "@/components/CategorySection";
import { DateSelector } from "@/components/DateSelector";
import { StateView } from "@/components/StateView";
import { MUENSTER_CANTEENS, servingInfoForDate } from "@/constants/canteens";
import { useCanteenMenu } from "@/hooks/useCanteenMenu";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { useTheme } from "@/theme";
import { friendlyDateLabel } from "@/utils/format";
import { groupByCategory } from "@/utils/menu";

export function MenuScreen() {
  const [canteenId, setCanteenId] = useState(MUENSTER_CANTEENS[0].id);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const canteen = useMemo(
    () => MUENSTER_CANTEENS.find((c) => c.id === canteenId)!,
    [canteenId],
  );

  const { status, errorMessage, days, selectedDate, meals, selectDate, reload } =
    useCanteenMenu(canteenId);

  const groups = useMemo(() => groupByCategory(meals), [meals]);

  const serving = useMemo(
    () => (selectedDate ? servingInfoForDate(canteen, selectedDate) : null),
    [canteen, selectedDate],
  );

  const { colors, fontSize } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
        edges={["top"]}
      >
        {/* App bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: colors.header,
            paddingHorizontal: 16,
            paddingBottom: 16,
            paddingTop: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: fontSize.xs,
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: 1,
                color: colors.onHeaderMuted,
              }}
            >
              Mensa Münster
            </Text>
            <Text
              style={{
                marginTop: 2,
                fontSize: 24,
                fontWeight: "700",
                color: colors.onHeader,
              }}
            >
              {canteen.name}
            </Text>
            {/* Always rendered so the header keeps a constant height; a blank
                placeholder holds the line while a new canteen's days load. */}
            <Text
              style={{
                marginTop: 2,
                fontSize: fontSize.sm,
                color: colors.onHeaderMuted,
              }}
            >
              {selectedDate ? friendlyDateLabel(selectedDate) : " "}
            </Text>

            {/* Serving hours for the selected day. Likewise always rendered to
                keep the header height stable across canteen/day changes. */}
            <View
              style={{
                marginTop: 4,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={fontSize.sm}
                color={colors.onHeaderMuted}
              />
              <Text style={{ fontSize: fontSize.sm, color: colors.onHeaderMuted }}>
                {!serving
                  ? " "
                  : serving.window
                    ? `Ausgabe ${serving.window.start}–${serving.window.end} Uhr` +
                      (serving.isBreak ? " · Ferien" : "")
                    : "Keine Speisenausgabe" + (serving.isBreak ? " · Ferien" : "")}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => setSettingsOpen(true)}
            hitSlop={8}
            accessibilityLabel="Einstellungen"
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
              name="cog-outline"
              size={24}
              color={colors.onHeader}
            />
          </Pressable>
        </View>

        {/* Canteen chips */}
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            backgroundColor: colors.surface,
            paddingVertical: 12,
          }}
        >
          <CanteenSelector
            canteens={MUENSTER_CANTEENS}
            selectedId={canteenId}
            onSelect={setCanteenId}
          />
        </View>

        {/* Date chips */}
        {days.length > 0 && (
          <View style={{ backgroundColor: colors.background, paddingVertical: 12 }}>
            <DateSelector
              days={days}
              selectedDate={selectedDate}
              onSelect={selectDate}
            />
          </View>
        )}

        {/* Body */}
        <Body
          status={status}
          errorMessage={errorMessage}
          groups={groups}
          onRetry={reload}
        />
      </SafeAreaView>

      {/* Settings is an in-tree overlay rather than a native <Modal>: a Modal
          renders in a separate native view hierarchy, which breaks safe-area
          inset measurement (header slides under the status bar) and detaches it
          from the theme context, so it wouldn't re-render on scheme changes. */}
      <SettingsOverlay
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </View>
  );
}

function SettingsOverlay({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const screenHeight = Dimensions.get("window").height;
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, screenHeight, translateY]);

  // Android hardware back closes the overlay instead of the app.
  useEffect(() => {
    if (!mounted) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [mounted, onClose]);

  if (!mounted) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        transform: [{ translateY }],
      }}
    >
      <SettingsScreen onClose={onClose} />
    </Animated.View>
  );
}

interface BodyProps {
  status: "loading" | "ready" | "error";
  errorMessage: string | null;
  groups: ReturnType<typeof groupByCategory>;
  onRetry: () => void;
}

function Body({ status, errorMessage, groups, onRetry }: BodyProps) {
  if (status === "loading") {
    return <StateView kind="loading" title="Speiseplan wird geladen …" />;
  }

  if (status === "error") {
    return (
      <StateView
        kind="error"
        title="Speiseplan nicht verfügbar"
        message={errorMessage ?? undefined}
        onRetry={onRetry}
      />
    );
  }

  if (groups.length === 0) {
    return (
      <StateView
        kind="empty"
        title="Heute kein Speiseplan"
        message="Für diesen Tag liegen keine Gerichte vor. Schau an einem anderen Tag vorbei."
      />
    );
  }

  return (
    <FlatList
      data={groups}
      keyExtractor={(group) => group.category}
      renderItem={({ item }) => <CategorySection group={item} />}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
