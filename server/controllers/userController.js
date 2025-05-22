const { supabase } = require('../lib/supabase');
const jwt = require('jsonwebtoken');

// JWT token oluşturma
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'gizlianahtar123', {
        expiresIn: '30d'
    });
};

// @desc    Tüm kullanıcıları getir (test için)
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*');

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Kullanıcıları getirme hatası:', error);
        res.status(500).json({ message: 'Kullanıcılar getirilemedi' });
    }
};

// @desc    Kullanıcı kaydı
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Supabase ile kullanıcı kaydı
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (error) throw error;

        res.status(201).json({
            success: true,
            message: 'Kullanıcı başarıyla kaydedildi',
            user: data.user
        });

    } catch (error) {
        console.error('Kayıt hatası:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Kullanıcı girişi
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Supabase ile giriş
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: 'Giriş başarılı',
            user: data.user
        });

    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUsers
}; 