/**
 * Thin client for the OpenMensa API v2.
 *
 * Docs: https://docs.openmensa.org/api/v2/
 * Base: https://openmensa.org/api/v2
 *
 * We only need two endpoints:
 *   - GET /canteens/{id}/days            → which days have a menu
 *   - GET /canteens/{id}/days/{date}/meals → the meals for one day
 */

const BASE_URL = "https://openmensa.org/api/v2";

/** Price tiers as returned by the API. We only surface `students` in the UI. */
export interface OpenMensaPrices {
  students: number | null;
  employees: number | null;
  pupils: number | null;
  others: number | null;
}

export interface Meal {
  id: number;
  name: string;
  category: string;
  prices: OpenMensaPrices;
  /** Free-form notes: allergens, additives, diet keywords, eco info. */
  notes: string[];
}

export interface Day {
  date: string; // ISO date, e.g. "2026-06-05"
  closed: boolean;
}

/** Raised for any non-2xx response so the UI can show a clean error state. */
export class OpenMensaError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "OpenMensaError";
  }
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new OpenMensaError(
      "Keine Verbindung zur Mensa. Bitte Internetverbindung prüfen.",
    );
  }

  if (!response.ok) {
    throw new OpenMensaError(
      `OpenMensa antwortete mit Status ${response.status}.`,
      response.status,
    );
  }

  return (await response.json()) as T;
}

/**
 * List the serving days a canteen has data for (today and upcoming).
 * Returns an empty array if the canteen has no published days.
 */
export async function fetchDays(
  canteenId: number,
  signal?: AbortSignal,
): Promise<Day[]> {
  return getJson<Day[]>(`/canteens/${canteenId}/days`, signal);
}

/**
 * Fetch the meals served at a canteen on a given ISO date.
 *
 * OpenMensa replies 404 when a day has no menu (e.g. weekends or holidays);
 * we treat that as "no meals" rather than an error.
 */
export async function fetchMeals(
  canteenId: number,
  date: string,
  signal?: AbortSignal,
): Promise<Meal[]> {
  try {
    return await getJson<Meal[]>(
      `/canteens/${canteenId}/days/${date}/meals`,
      signal,
    );
  } catch (err) {
    if (err instanceof OpenMensaError && err.status === 404) return [];
    throw err;
  }
}
