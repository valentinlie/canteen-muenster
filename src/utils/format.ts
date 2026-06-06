/** Small formatting helpers for dates and prices (German locale). */

const WEEKDAYS = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

const WEEKDAYS_SHORT = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

/** Today's date as an ISO `YYYY-MM-DD` string in local time. */
export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse an ISO date string into a Date at local midnight (no TZ surprises). */
function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Short weekday + day for a selector chip, e.g. "Do 5.". */
export function shortDateLabel(iso: string): { weekday: string; day: string } {
  const date = parseISO(iso);
  return {
    weekday: WEEKDAYS_SHORT[date.getDay()],
    day: `${date.getDate()}.`,
  };
}

/** Friendly header label: "Heute", "Morgen", or e.g. "Donnerstag, 5. Juni". */
export function friendlyDateLabel(iso: string): string {
  const date = parseISO(iso);
  const today = parseISO(todayISO());
  const diffDays = Math.round(
    (date.getTime() - today.getTime()) / 86_400_000,
  );

  if (diffDays === 0) return "Heute";
  if (diffDays === 1) return "Morgen";

  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
  ];
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]}`;
}

/** Format a price in euros, e.g. 3.1 → "3,10 €". Null → "—". */
export function formatPrice(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "—";
  return `${value.toFixed(2).replace(".", ",")} €`;
}

/**
 * Strip bracketed annotations from a meal name and tidy whitespace.
 *
 * OpenMensa folds allergen/additive codes into the dish title, e.g.
 * "Hähnchen Kebab Sandwich (2,3,AWE) Pommes frites" → those codes already
 * surface as structured tags/allergens, so we drop every `(…)`, `[…]` or
 * `{…}` group and collapse the leftover spacing.
 */
export function cleanMealName(name: string): string {
  return name
    .replace(/[([{][^)\]}]*[)\]}]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}
