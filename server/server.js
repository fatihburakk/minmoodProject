require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const duyguAnalizRoutes = require('./routes/duyguAnaliz');
app.use('/api/duygu-analiz', duyguAnalizRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API çalışıyor!' });
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Bulunamadı:', req.method, req.url);
  res.status(404).json({ 
    error: 'Endpoint bulunamadı',
    path: req.url,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Sunucu hatası:', err);
  res.status(500).json({ 
    error: 'Sunucu hatası', 
    details: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Server başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
  console.log(`API endpoint: http://localhost:${PORT}/api/duygu-analiz/analyze`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
});