import { routinesAtom, routinesLoadingAtom, completionsAtom, selectedDateAtom } from './atoms';
import {
  getRoutines,
  addRoutine,
  deleteRoutine,
  updateRoutineTitle,
  getCompletionsForDate,
  toggleRoutineDone,
  dateToString,
} from '../services/routinesApi';

// ─── Load routines + completions for a given date ────────────────────────────

export async function refreshRoutines(get, set, date) {
  try {
    set(routinesLoadingAtom, true);

    const targetDate = date ?? get(selectedDateAtom);
    const dateStr = dateToString(targetDate);

    const [list, completedIds] = await Promise.all([
      getRoutines(),
      getCompletionsForDate(dateStr),
    ]);

    set(routinesAtom, list);
    set(completionsAtom, completedIds);
  } finally {
    set(routinesLoadingAtom, false);
  }
}

// ─── Load completions only (when user changes date) ──────────────────────────

export async function loadCompletionsForDate(get, set, date) {
  try {
    set(routinesLoadingAtom, true);
    const dateStr = dateToString(date);
    const completedIds = await getCompletionsForDate(dateStr);
    set(completionsAtom, completedIds);
  } finally {
    set(routinesLoadingAtom, false);
  }
}

// ─── Add routine ───

export async function createRoutine(get, set, title) {
  const created = await addRoutine(title);
  set(routinesAtom, (prev) => [created, ...prev]);
}

// ─── Toggle done for the currently selected date ───

export async function toggleRoutine(get, set, id, done) {
  const selectedDate = get(selectedDateAtom);
  const dateStr = dateToString(selectedDate);

  // Optimistic update
  set(completionsAtom, (prev) => {
    const next = new Set(prev);
    if (done) {
      next.add(id);
    } else {
      next.delete(id);
    }
    return next;
  });

  try {
    await toggleRoutineDone(id, done, dateStr);
  } catch (e) {
    // Rollback on failure
    set(completionsAtom, (prev) => {
      const next = new Set(prev);
      if (done) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    throw e;
  }
}

// ─── Delete routine ───

export async function removeRoutine(get, set, id) {
  await deleteRoutine(id);
  set(routinesAtom, (prev) => prev.filter((r) => r.id !== id));
  set(completionsAtom, (prev) => {
    const next = new Set(prev);
    next.delete(id);
    return next;
  });
}

// ─── Edit routine title ───

export async function editRoutineTitle(get, set, id, title) {
  const updated = await updateRoutineTitle(id, title);
  set(routinesAtom, (prev) => prev.map((r) => (r.id === id ? updated : r)));
}