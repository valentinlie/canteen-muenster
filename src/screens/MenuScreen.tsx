import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CanteenSelector } from "@/components/CanteenSelector";
import { CategorySection } from "@/components/CategorySection";
import { DateSelector } from "@/components/DateSelector";
import { StateView } from "@/components/StateView";
import { MUENSTER_CANTEENS } from "@/constants/canteens";
import { useCanteenMenu } from "@/hooks/useCanteenMenu";
import { SettingsScreen } from "@/screens/SettingsScreen";
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

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      {/* App bar */}
      <View className="flex-row items-start justify-between bg-header px-4 pb-4 pt-2">
        <View className="flex-1">
          <Text className="text-xs font-medium uppercase tracking-widest text-header-muted">
            Mensa Münster
          </Text>
          <Text className="mt-0.5 text-2xl font-bold text-header-on">
            {canteen.name}
          </Text>
          {selectedDate && (
            <Text className="mt-0.5 text-sm text-header-muted">
              {friendlyDateLabel(selectedDate)}
            </Text>
          )}
        </View>

        <Pressable
          onPress={() => setSettingsOpen(true)}
          hitSlop={8}
          accessibilityLabel="Einstellungen"
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
        >
          <MaterialCommunityIcons
            name="cog-outline"
            size={24}
            color="rgb(244,240,232)"
          />
        </Pressable>
      </View>

      {/* Canteen chips */}
      <View className="border-b border-border bg-surface py-3">
        <CanteenSelector
          canteens={MUENSTER_CANTEENS}
          selectedId={canteenId}
          onSelect={setCanteenId}
        />
      </View>

      {/* Date chips */}
      {days.length > 0 && (
        <View className="bg-bg py-3">
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

      <Modal
        visible={settingsOpen}
        animationType="slide"
        onRequestClose={() => setSettingsOpen(false)}
      >
        <SettingsScreen onClose={() => setSettingsOpen(false)} />
      </Modal>
    </SafeAreaView>
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
