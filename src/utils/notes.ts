/**
 * Turns OpenMensa's free-form `notes` array into structured, display-ready
 * information: a set of diet/ingredient tags (shown as icons) plus a list of
 * allergens. Empty and noisy notes (CO₂/water figures, additives) are dropped.
 *
 * The tag keywords below are exactly the ones that occur in the Münster
 * canteen data, e.g.: "vegan", "vegetarisch", "mit Geflügel", "mit Rind",
 * "mit Schwein", "mit Fisch".
 */

export type FoodTag =
  | "vegan"
  | "vegetarisch"
  | "geflügel"
  | "rind"
  | "schwein"
  | "fisch";

export interface ParsedNotes {
  /** Ordered tags (diet first, then meat/fish) rendered as icon badges. */
  tags: FoodTag[];
  /** Human-readable allergen names, e.g. ["Weizen", "Milch", "Senf"]. */
  allergens: string[];
}

/** Substrings that flag each tag. Order here defines display order. */
const TAG_KEYWORDS: { tag: FoodTag; keywords: string[] }[] = [
  { tag: "vegan", keywords: ["vegan"] },
  { tag: "vegetarisch", keywords: ["vegetarisch", "vegetarian"] },
  { tag: "geflügel", keywords: ["geflügel", "hähnchen", "huhn", "pute", "ente"] },
  { tag: "rind", keywords: ["rind"] },
  { tag: "schwein", keywords: ["schwein"] },
  { tag: "fisch", keywords: ["mit fisch", "fischfilet", "seelachs", "lachs"] },
];

/** "AWE) enthält Weizen*" → "Weizen" */
const ALLERGEN_RE = /enth(?:ä|ae)lt\s+(.+?)\*?$/i;

export function parseNotes(notes: string[]): ParsedNotes {
  const found = new Set<FoodTag>();
  const allergens: string[] = [];

  for (const raw of notes) {
    const note = raw.trim();
    if (!note) continue; // drop empty notes

    const lower = note.toLowerCase();

    for (const { tag, keywords } of TAG_KEYWORDS) {
      if (keywords.some((kw) => lower.includes(kw))) found.add(tag);
    }

    const allergenMatch = note.match(ALLERGEN_RE);
    if (allergenMatch) {
      const name = allergenMatch[1].trim().replace(/\*$/, "");
      if (name && !allergens.includes(name)) allergens.push(name);
    }
    // Everything else (additives, CO₂/water figures) is intentionally ignored.
  }

  // Emit tags in the canonical order defined by TAG_KEYWORDS.
  const tags = TAG_KEYWORDS.map((t) => t.tag).filter((t) => found.has(t));

  return { tags, allergens };
}
