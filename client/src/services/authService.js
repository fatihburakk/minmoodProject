import axios from 'axios';
import { supabase } from '../lib/supabase';

export const login = async (email, password) => {
  const response = await axios.post('/api/auth/login', { email, password });
  return response.data;
};

export async function updateProfile({ username, email }) {
  // First update auth user
  const { data: authData, error: authError } = await supabase.auth.updateUser({
    email,
    data: { username }
  });

  if (authError) throw authError;

  // Then update public users table
  const { error: userError } = await supabase
    .from('users')
    .update({ username, email })
    .eq('id', authData.user.id);

  if (userError) throw userError;

  return { data: authData, error: null };
}

export async function changePassword(newPassword) {
  return await supabase.auth.updateUser({
    password: newPassword
  });
}

export async function deleteAccount() {
  // Kullanıcı kendi hesabını silemez, admin yetkisi gerekir. Burada sadece oturumu kapatıyoruz.
  return await supabase.auth.signOut();
} 