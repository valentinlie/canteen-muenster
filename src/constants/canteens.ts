/**
 * The seven OpenMensa canteens located in Münster.
 *
 * IDs and metadata come straight from the OpenMensa API v2
 * (https://openmensa.org/api/v2/canteens). They are stable, so we pin them
 * here instead of fetching the full global canteen list on every launch.
 */

/**
 * One contiguous food-serving window ("Speisenausgabe"), valid on a set of
 * weekdays. Weekdays use JS `Date.getDay()` numbering (0 = Sunday … 6 = Saturday).
 */
export interface ServingWindow {
  days: number[];
  /** Start time as "HH:MM" (24h). */
  start: string;
  /** End time as "HH:MM" (24h). */
  end: string;
}

/**
 * A canteen's serving hours. OpenMensa doesn't expose opening hours, so — like
 * the canteen IDs below — these are maintained by hand from the Studierendenwerk
 * Münster site (stw-muenster.de, "Ausgabezeiten").
 *
 * Münster canteens shorten (or drop) their hours during the lecture-free
 * "Semesterferien". `break` captures that:
 *   - `undefined`   → no separate break schedule published; `lecture` applies.
 *   - `ServingWindow[]` → distinct break-period windows.
 *   - `"closed"`    → no service at all during the break.
 */
export interface ServingSchedule {
  lecture: ServingWindow[];
  break?: ServingWindow[] | "closed";
}

export interface Canteen {
  id: number;
  /** Full official name, e.g. "Mensa Am Ring". */
  name: string;
  /** Short label used in the selector chips. */
  shortName: string;
  address: string;
  servingTimes: ServingSchedule;
}

const WEEKDAYS = [1, 2, 3, 4, 5]; // Mon–Fri

export const MUENSTER_CANTEENS: Canteen[] = [
  {
    id: 1213,
    name: "Mensa Bispinghof",
    shortName: "Bispinghof",
    address: "Bispinghof 9, 48143 Münster",
    servingTimes: { lecture: [{ days: WEEKDAYS, start: "11:00", end: "14:30" }] },
  },
  {
    id: 1170,
    name: "Mensa Aasee",
    shortName: "Aasee",
    address: "Bismarckallee 11, 48151 Münster",
    servingTimes: { lecture: [{ days: WEEKDAYS, start: "11:45", end: "14:30" }] },
  },
  {
    id: 1171,
    name: "Mensa Da Vinci",
    shortName: "Da Vinci",
    address: "Leonardo-Campus 8, 48149 Münster",
    servingTimes: { lecture: [{ days: WEEKDAYS, start: "11:30", end: "14:30" }] },
  },
  {
    id: 1169,
    name: "Mensa Am Ring",
    shortName: "Am Ring",
    address: "Domagkstraße 61, 48149 Münster",
    servingTimes: {
      lecture: [{ days: WEEKDAYS, start: "11:15", end: "14:15" }],
      break: [{ days: WEEKDAYS, start: "11:30", end: "14:00" }],
    },
  },
  {
    id: 1172,
    name: "Bistro Denkpause",
    shortName: "Denkpause",
    address: "Corrensstraße 25, 48149 Münster",
    servingTimes: { lecture: [{ days: WEEKDAYS, start: "11:30", end: "14:15" }] },
  },
  {
    id: 1214,
    name: "Bistro Oeconomicum",
    shortName: "Oeconomicum",
    address: "Universitätsstraße 14–16, 48143 Münster",
    servingTimes: {
      lecture: [{ days: WEEKDAYS, start: "11:15", end: "14:15" }],
      break: [{ days: WEEKDAYS, start: "11:00", end: "15:00" }],
    },
  },
  {
    id: 1238,
    name: "Bistro Kath. Hochschule",
    shortName: "Kath. Hochschule",
    address: "Piusallee 89, 48143 Münster",
    servingTimes: {
      lecture: [
        { days: [1, 2, 3, 4], start: "11:30", end: "14:00" },
        { days: [5], start: "11:30", end: "13:45" },
      ],
      break: "closed",
    },
  },
];

/**
 * Lecture periods ("Vorlesungszeit") of the University of Münster, used to tell
 * whether a date falls in the semester or the lecture-free break. Maintained by
 * hand — extend roughly once a year (uni-muenster.de → Semestertermine).
 * Sorted ascending; the last entry's end is our data horizon.
 */
export const LECTURE_PERIODS: { start: string; end: string }[] = [
  { start: "2026-04-13", end: "2026-07-24" }, // Sommersemester 2026
  { start: "2026-10-12", end: "2027-02-05" }, // Wintersemester 2026/27
];

/** Whether an ISO date falls in the lecture-free "Semesterferien". */
export function isSemesterBreak(iso: string): boolean {
  // Inside a known lecture period → not a break.
  if (LECTURE_PERIODS.some((p) => iso >= p.start && iso <= p.end)) return false;
  // Past our data horizon we can't tell, so assume the common lecture-time case
  // rather than silently flipping every future day to "Ferien".
  const horizon = LECTURE_PERIODS[LECTURE_PERIODS.length - 1].end;
  if (iso > horizon) return false;
  return true;
}

export interface ServingInfo {
  /** Serving window for the date, or `null` when the canteen doesn't serve. */
  window: ServingWindow | null;
  /** Whether the date falls in the semester break (drives the "Ferien" hint). */
  isBreak: boolean;
}

/**
 * Resolve a canteen's serving window for a given ISO date, accounting for
 * lecture vs. break schedules and the weekday.
 */
export function servingInfoForDate(canteen: Canteen, iso: string): ServingInfo {
  const isBreak = isSemesterBreak(iso);
  const { lecture, break: breakSchedule } = canteen.servingTimes;

  let windows: ServingWindow[];
  if (!isBreak || breakSchedule === undefined) {
    windows = lecture;
  } else if (breakSchedule === "closed") {
    return { window: null, isBreak };
  } else {
    windows = breakSchedule;
  }

  const [y, m, d] = iso.split("-").map(Number);
  const weekday = new Date(y, m - 1, d).getDay();
  return { window: windows.find((w) => w.days.includes(weekday)) ?? null, isBreak };
}
