import { atom } from 'jotai';

// theme
export const isDarkModeAtom = atom(false);

// routines list
export const routinesAtom = atom([]);

// loading flag for syncing
export const routinesLoadingAtom = atom(false);

// derived stats (auto updates)
export const routinesStatsAtom = atom((get) => {
  const routines = get(routinesAtom);
  const total = routines.length;
  const done = routines.filter((r) => r.done).length;
  const remaining = Math.max(total - done, 0);
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return { total, done, remaining, percent };
});