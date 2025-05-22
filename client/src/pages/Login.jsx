import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sayfa yüklendiğinde kullanıcı kontrolü
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

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
      // Supabase ile giriş yap
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (authError) throw authError;

      if (authData?.user) {
        // Kullanıcı bilgilerini users tablosundan getir
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (userError) throw userError;

        // Eğer kullanıcı users tablosunda yoksa, oluştur
        if (!userData) {
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              username: authData.user.user_metadata.username || authData.user.email.split('@')[0],
              email: authData.user.email,
              created_at: new Date().toISOString()
            })
            .select()
            .single();

          if (insertError) throw insertError;

          // Kullanıcı bilgilerini localStorage'a kaydet
          localStorage.setItem('user', JSON.stringify({
            id: authData.user.id,
            username: authData.user.user_metadata.username || authData.user.email.split('@')[0],
            email: authData.user.email
          }));
        } else {
          // Kullanıcı bilgilerini localStorage'a kaydet
          localStorage.setItem('user', JSON.stringify({
            id: authData.user.id,
            username: userData.username,
            email: authData.user.email
          }));
        }

        // Başarılı girişten sonra dashboard'a yönlendir
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      if (error.message === 'Invalid login credentials') {
        setError('Email veya şifre hatalı.');
      } else {
        setError(error.message || 'Giriş yapılırken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
      <div className="bg-white/90 p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up border-2 border-indigo-600">
        <h2 className="text-3xl font-bold text-center mb-8 text-indigo-600">Giriş Yap</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="mt-6 text-center text-indigo-600">
          Hesabınız yok mu?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-purple-600 font-bold hover:text-indigo-600 transition-colors"
          >
            Kayıt Ol
          </button>
        </p>
      </div>
    </div>
  );
} 