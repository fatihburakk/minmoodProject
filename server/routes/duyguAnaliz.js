const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config({ path: './config.env' });

const HUGGINGFACE_API_TOKEN = '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';
const MODEL_URL = 'https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions';
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

// Duygu etiketlerini Türkçe'ye çevirme
const emotionLabels = {
  'admiration': 'Hayranlık',
  'amusement': 'Eğlence',
  'anger': 'Öfke',
  'annoyance': 'Rahatsızlık',
  'approval': 'Onay',
  'caring': 'İlgili',
  'confusion': 'Kafa Karışıklığı',
  'curiosity': 'Merak',
  'desire': 'İstek',
  'disappointment': 'Hayal Kırıklığı',
  'disapproval': 'Onaylamama',
  'disgust': 'İğrenme',
  'embarrassment': 'Utangaçlık',
  'excitement': 'Heyecan',
  'fear': 'Korku',
  'gratitude': 'Minnettarlık',
  'grief': 'Keder',
  'joy': 'Mutluluk',
  'love': 'Sevgi',
  'nervousness': 'Gerginlik',
  'optimism': 'İyimserlik',
  'pride': 'Gurur',
  'realization': 'Farkındalık',
  'relief': 'Rahatlık',
  'remorse': 'Pişmanlık',
  'sadness': 'Üzüntü',
  'surprise': 'Şaşkınlık',
  'neutral': 'Nötr'
};

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Duygu analizi route çalışıyor!' });
});

// Metni İngilizce'ye çevirme fonksiyonu
async function translateToEnglish(text) {
  try {
    console.log('MyMemory Translation API isteği gönderiliyor...');
    
    const response = await axios({
      method: 'get',
      url: MYMEMORY_URL,
      params: {
        q: text,
        langpair: 'tr|en'
      },
      timeout: 10000 // 10 saniye timeout
    });

    console.log('Çeviri yanıtı:', response.data);
    
    if (!response.data || !response.data.responseData || !response.data.responseData.translatedText) {
      throw new Error('Çeviri API geçersiz yanıt döndü');
    }

    return response.data.responseData.translatedText;
  } catch (error) {
    console.error('Çeviri hatası:', error.message);
    // Çeviri hatası durumunda orijinal metni döndür
    console.log('Çeviri başarısız, orijinal metin kullanılıyor:', text);
    return text;
  }
}

// Duygu analizi fonksiyonu
async function analyzeEmotions(text) {
  try {
    console.log('Hugging Face API isteği gönderiliyor...');
    
    const response = await axios({
      method: 'post',
      url: MODEL_URL,
      data: { inputs: text },
      headers: { 
        'Authorization': `Bearer ${HUGGINGFACE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 saniye timeout
    });

    console.log('Hugging Face API Yanıtı:', JSON.stringify(response.data, null, 2));
    
    if (!response.data || !Array.isArray(response.data[0])) {
      throw new Error('Hugging Face API geçersiz yanıt döndü');
    }

    return response.data[0];
  } catch (error) {
    console.error('Duygu analizi hatası:', error.message);
    throw error;
  }
}

router.post('/analyze', async (req, res) => {
  console.log('Duygu analizi isteği alındı');
  console.log('Request body:', req.body);
  
  const { text } = req.body;
  
  if (!text) {
    console.log('Hata: Metin alanı boş');
    return res.status(400).json({ error: 'Metin alanı boş olamaz.' });
  }

  try {
    // Önce metni İngilizce'ye çevir
    console.log('Orijinal metin:', text);
    const translatedText = await translateToEnglish(text);
    console.log('Çevrilen metin:', translatedText);

    // Duygu analizi yap
    const emotions = await analyzeEmotions(translatedText);

    // Duyguları puanlarına göre sırala ve sadece 0.3'ten büyük olanları al
    const processedEmotions = emotions
      .map(emotion => ({
        label: emotionLabels[emotion.label] || emotion.label,
        score: emotion.score,
        intensity: emotion.score * 100
      }))
      .filter(emotion => emotion.score > 0.3)
      .sort((a, b) => b.score - a.score);

    // Detaylı açıklama oluştur
    let detail = '';
    if (processedEmotions.length === 0) {
      detail = 'Metinde belirgin bir duygu ifadesi bulunamadı.';
    } else {
      const emotionTexts = processedEmotions.map(emotion => 
        `${emotion.label} (${emotion.intensity.toFixed(0)}%)`
      );
      detail = `Metinde ${emotionTexts.join(', ')} duyguları tespit edildi.`;
    }

    const formattedResponse = [{
      emotions: processedEmotions,
      details: {
        description: detail,
        originalText: text,
        translatedText: translatedText,
        rawEmotions: emotions
      }
    }];

    console.log('Formatlanmış yanıt:', JSON.stringify(formattedResponse, null, 2));
    
    res.json(formattedResponse);

  } catch (error) {
    console.error('Detaylı hata:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code
    });

    // API yanıt vermediğinde veya timeout olduğunda
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      console.error('API Timeout:', error.message);
      return res.status(504).json({
        error: 'API yanıt vermedi',
        details: 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.',
        message: error.message
      });
    }

    // API hatası durumunda
    if (error.response) {
      console.error('API Hatası:', error.response.status, error.response.data);
      return res.status(error.response.status).json({
        error: 'API hatası',
        details: error.response.data,
        message: error.message
      });
    }

    // Bağlantı hatası durumunda
    if (error.request) {
      console.error('Bağlantı Hatası:', error.request);
      return res.status(503).json({
        error: 'Bağlantı hatası',
        details: 'API\'ye bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.',
        message: error.message
      });
    }

    // Diğer hatalar
    console.error('Genel Hata:', error.message);
    return res.status(500).json({
      error: 'Sunucu hatası',
      details: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
      message: error.message
    });
  }
});

module.exports = router; 