import { routinesAtom, routinesLoadingAtom } from './atoms';
import {
  getRoutines,
  addRoutine,
  toggleRoutineDone,
  deleteRoutine,
  updateRoutineTitle,
} from '../services/routinesApi';

export async function refreshRoutines(get, set) {
  try {
    set(routinesLoadingAtom, true);
    const list = await getRoutines();
    set(routinesAtom, list);
  } finally {
    set(routinesLoadingAtom, false);
  }
}

export async function createRoutine(get, set, title) {
  const created = await addRoutine(title);
  set(routinesAtom, (prev) => [created, ...prev]);
}

export async function toggleRoutine(get, set, id, done) {
  const updated = await toggleRoutineDone(id, done);
  set(routinesAtom, (prev) => prev.map((r) => (r.id === id ? updated : r)));
}

export async function removeRoutine(get, set, id) {
  await deleteRoutine(id);
  set(routinesAtom, (prev) => prev.filter((r) => r.id !== id));
}

export async function editRoutineTitle(get, set, id, title) {
  const updated = await updateRoutineTitle(id, title);
  set(routinesAtom, (prev) => prev.map((r) => (r.id === id ? updated : r)));
}