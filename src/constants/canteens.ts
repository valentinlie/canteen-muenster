/**
 * The seven OpenMensa canteens located in Münster.
 *
 * IDs and metadata come straight from the OpenMensa API v2
 * (https://openmensa.org/api/v2/canteens). They are stable, so we pin them
 * here instead of fetching the full global canteen list on every launch.
 */
export interface Canteen {
  id: number;
  /** Full official name, e.g. "Mensa Am Ring". */
  name: string;
  /** Short label used in the selector chips. */
  shortName: string;
  address: string;
}

export const MUENSTER_CANTEENS: Canteen[] = [
  {
    id: 1169,
    name: "Mensa Am Ring",
    shortName: "Am Ring",
    address: "Domagkstraße 61, 48149 Münster",
  },
  {
    id: 1170,
    name: "Mensa Aasee",
    shortName: "Aasee",
    address: "Bismarckallee 11, 48151 Münster",
  },
  {
    id: 1213,
    name: "Mensa Bispinghof",
    shortName: "Bispinghof",
    address: "Bispinghof 9, 48143 Münster",
  },
  {
    id: 1171,
    name: "Mensa Da Vinci",
    shortName: "Da Vinci",
    address: "Leonardo-Campus 8, 48149 Münster",
  },
  {
    id: 1214,
    name: "Bistro Oeconomicum",
    shortName: "Oeconomicum",
    address: "Universitätsstraße 14–16, 48143 Münster",
  },
  {
    id: 1172,
    name: "Bistro Denkpause",
    shortName: "Denkpause",
    address: "Corrensstraße 25, 48149 Münster",
  },
  {
    id: 1238,
    name: "Bistro Katholische Hochschule",
    shortName: "Kath. Hochschule",
    address: "Piusallee 89, 48143 Münster",
  },
];
