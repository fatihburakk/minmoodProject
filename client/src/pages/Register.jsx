import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Önce kullanıcı adının benzersiz olup olmadığını kontrol et
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', formData.username)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingUser) {
        throw new Error('Bu kullanıcı adı zaten kullanılıyor.');
      }

      // Supabase ile kullanıcı kaydı
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username
          }
        }
      });

      if (authError) throw authError;

      if (authData?.user) {
        // Kullanıcı bilgilerini users tablosuna ekle
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              username: formData.username,
              email: formData.email,
              created_at: new Date().toISOString()
            }
          ]);

        if (userError) {
          // Kullanıcı tablosuna ekleme başarısız olursa, auth kaydını da sil
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw userError;
        }

        // Kullanıcı bilgilerini localStorage'a kaydet
        localStorage.setItem('user', JSON.stringify({
          id: authData.user.id,
          username: formData.username,
          email: formData.email
        }));

        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      setError(error.message || 'Kayıt işlemi sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
      <div className="bg-white/90 p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up border-2 border-indigo-600">
        <h2 className="text-3xl font-bold text-center mb-8 text-indigo-600">Kayıt Ol</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-indigo-600 font-medium mb-2">Kullanıcı Adı</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border-2 border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
              minLength="3"
            />
          </div>

          <div>
            <label className="block text-indigo-600 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border-2 border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          <div>
            <label className="block text-indigo-600 font-medium mb-2">Şifre</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border-2 border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-bold text-lg transition-all ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
            }`}
          >
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="mt-6 text-center text-indigo-600">
          Zaten hesabınız var mı?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-purple-600 font-bold hover:text-indigo-600 transition-colors"
          >
            Giriş Yap
          </button>
        </p>
      </div>
    </div>
  );
} 