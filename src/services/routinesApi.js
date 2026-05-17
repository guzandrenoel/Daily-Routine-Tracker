import { supabase } from './supabaseClient';

// ─── Date helpers ────────────────────────────────────────────────────────────

export function dateToString(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function todayString() {
  return dateToString(new Date());
}

// ─── Routines ────────────────────────────────────────────────────────────────

export async function getRoutines() {
  const { data, error } = await supabase
    .from('routines')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function addRoutine(title) {
  const { data, error } = await supabase
    .from('routines')
    .insert([{ title, done: false }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRoutine(id) {
  const { error } = await supabase.from('routines').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function updateRoutineTitle(id, title) {
  const { data, error } = await supabase
    .from('routines')
    .update({ title })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Completions ─────────────────────────────────────────────────────────────

/**
 * Returns a Set of routine_ids completed on a given date string "YYYY-MM-DD"
 */
export async function getCompletionsForDate(dateStr) {
  const { data, error } = await supabase
    .from('completions')
    .select('routine_id')
    .eq('completed_date', dateStr);

  if (error) throw error;
  return new Set((data ?? []).map((r) => r.routine_id));
}

/**
 * Mark a routine done for a specific date — inserts into completions.
 * Uses upsert so it's safe to call multiple times.
 */
export async function markDone(routineId, dateStr) {
  const { error } = await supabase
    .from('completions')
    .upsert({ routine_id: routineId, completed_date: dateStr });

  if (error) throw error;
}

/**
 * Unmark a routine done for a specific date — deletes from completions.
 */
export async function markUndone(routineId, dateStr) {
  const { error } = await supabase
    .from('completions')
    .delete()
    .eq('routine_id', routineId)
    .eq('completed_date', dateStr);

  if (error) throw error;
}

/**
 * Toggle: if done=true inserts a completion row, if false deletes it.
 */
export async function toggleRoutineDone(routineId, done, dateStr) {
  if (done) {
    await markDone(routineId, dateStr);
  } else {
    await markUndone(routineId, dateStr);
  }
}