import { useCallback, useEffect, useState } from "react";

import {
  fetchDays,
  fetchMeals,
  OpenMensaError,
  type Day,
  type Meal,
} from "@/services/openmensa";
import { todayISO } from "@/utils/format";

type Status = "loading" | "ready" | "error";

interface CanteenMenuState {
  status: Status;
  errorMessage: string | null;
  days: Day[];
  selectedDate: string | null;
  meals: Meal[];
  selectDate: (date: string) => void;
  reload: () => void;
}

const GENERIC_ERROR = "Etwas ist schiefgelaufen. Bitte erneut versuchen.";

/** Pick today if the canteen serves today, otherwise the next open day. */
function pickDefaultDate(days: Day[]): string | null {
  const open = days.filter((d) => !d.closed);
  if (open.length === 0) return null;
  const today = todayISO();
  return open.find((d) => d.date >= today)?.date ?? open[0].date;
}

/**
 * Loads the serving days for a canteen and the meals for the selected day.
 * Re-fetches whenever the canteen or selected date changes, and exposes a
 * manual `reload` for the error state's retry button.
 */
export function useCanteenMenu(canteenId: number): CanteenMenuState {
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);
  const selectDate = useCallback((date: string) => setSelectedDate(date), []);

  // Load available days whenever the canteen (or reload key) changes.
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setErrorMessage(null);
    setMeals([]);
    setDays([]);
    setSelectedDate(null);

    fetchDays(canteenId, controller.signal)
      .then((fetchedDays) => {
        setDays(fetchedDays);
        setSelectedDate(pickDefaultDate(fetchedDays));
        // `status` stays "loading" until meals for the chosen day arrive.
        if (pickDefaultDate(fetchedDays) === null) setStatus("ready");
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setStatus("error");
        setErrorMessage(
          err instanceof OpenMensaError ? err.message : GENERIC_ERROR,
        );
      });

    return () => controller.abort();
  }, [canteenId, reloadKey]);

  // Load meals whenever the selected date changes.
  useEffect(() => {
    if (!selectedDate) return;
    const controller = new AbortController();
    setStatus("loading");
    setErrorMessage(null);

    fetchMeals(canteenId, selectedDate, controller.signal)
      .then((fetchedMeals) => {
        setMeals(fetchedMeals);
        setStatus("ready");
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setStatus("error");
        setErrorMessage(
          err instanceof OpenMensaError ? err.message : GENERIC_ERROR,
        );
      });

    return () => controller.abort();
  }, [canteenId, selectedDate]);

  return {
    status,
    errorMessage,
    days,
    selectedDate,
    meals,
    selectDate,
    reload,
  };
}
