import { supabase } from './supabaseClient';

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

export async function toggleRoutineDone(id, done) {
  const { data, error } = await supabase
    .from('routines')
    .update({ done })
    .eq('id', id)
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