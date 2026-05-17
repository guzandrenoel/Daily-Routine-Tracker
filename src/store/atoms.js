import { atom } from 'jotai';

// ─── Theme ───
export const isDarkModeAtom = atom(false);

// ─── Routines list (titles/metadata only, no done field) ────
export const routinesAtom = atom([]);

// ─── Loading flag ───
export const routinesLoadingAtom = atom(false);

// ─── Selected date (shared between HomeScreen calendar and stats) ──
// Stored as a JS Date object
export const selectedDateAtom = atom(new Date());

// ─── Completions for the selected date ───
// A Set of routine_ids completed on selectedDate
export const completionsAtom = atom(new Set());

// ─── Derived stats for the SELECTED date ───
export const routinesStatsAtom = atom((get) => {
  const routines = get(routinesAtom);
  const completions = get(completionsAtom);

  const total = routines.length;
  const done = routines.filter((r) => completions.has(r.id)).length;
  const remaining = Math.max(total - done, 0);
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return { total, done, remaining, percent };
});