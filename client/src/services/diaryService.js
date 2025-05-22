import { supabase } from '../lib/supabase';

export async function createDiary(content, user_id) {
  return await supabase
    .from('diaries')
    .insert([{ content, user_id }]);
}

export async function getDiaries(user_id) {
  return await supabase
    .from('diaries')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
}

export async function deleteDiary(id, user_id) {
  return await supabase
    .from('diaries')
    .delete()
    .eq('id', id)
    .eq('user_id', user_id);
}

export async function updateDiary(id, content, user_id) {
  try {
    const { data, error } = await supabase
      .from('diaries')
      .update({ content })
      .eq('id', id)
      .eq('user_id', user_id)
      .select();

    if (error) {
      console.error('Diary update error:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating diary:', error);
    return { data: null, error };
  }
} 