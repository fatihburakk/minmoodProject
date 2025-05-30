import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { createDiary, getDiaries, deleteDiary, updateDiary } from '../services/diaryService';
import { updateProfile, changePassword, deleteAccount } from '../services/authService';
import { supabase } from '../lib/supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import mindmoodLogo from '../assets/minmood.png';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  ChartDataLabels
);

const user = JSON.parse(localStorage.getItem('user'));
const today = new Date();
const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

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

const dailyQuotes = [
  "Duygularınızı kabul edin, onlar sizin rehberinizdir.",
  "Her nefes, yeni bir başlangıç için fırsattır.",
  "Kendinize karşı nazik olun, mükemmel olmak zorunda değilsiniz.",
  "Bugünkü duygularınız, yarının gücünü oluşturur.",
  "Her zorluk, içsel gücünüzü keşfetme fırsatıdır.",
  "Kendinizi dinleyin, içinizdeki ses en doğru rehberdir.",
  "Duygusal farkındalık, içsel huzurun anahtarıdır.",
  "Her gün, kendinizi daha iyi tanıma şansıdır.",
  "Kendinize zaman ayırın, ruhunuz buna değer.",
  "Duygularınızı bastırmayın, onları anlamaya çalışın.",
  "Her deneyim, büyümenize katkı sağlar.",
  "Kendinizi sevmek, en büyük iyilikseverliktir.",
  "Bugünkü duygularınız, yarının bilgeliğidir.",
  "Her an, kendinizi yeniden keşfetme fırsatıdır.",
  "İçsel huzur, dış dünyadaki başarının temelidir.",
  "Duygusal zeka, hayatın en değerli hazinesidir.",
  "Kendinize inanın, potansiyeliniz sınırsızdır.",
  "Her duygu, bir öğrenme ve büyüme fırsatıdır.",
  "Kendinizi kabul etmek, gerçek özgürlüktür.",
  "Bugün, dünün deneyimlerinden öğrenme günüdür."
];

const getDailyQuote = () => {
  return dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];
};

// Kullanıcıyı güvenli şekilde al
async function getCurrentUserId() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return user.id;
    }
    return null;
  } catch (error) {
    console.error('Kullanıcı ID alınamadı:', error);
    return null;
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [diaryContent, setDiaryContent] = useState('');
  const [diaryList, setDiaryList] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [profile, setProfile] = useState({ username: user?.username || '', email: user?.email || '' });
  const [profileEdit, setProfileEdit] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ old: '', new: '' });
  const [passwordError, setPasswordError] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [emotionText, setEmotionText] = useState("");
  const [emotionResult, setEmotionResult] = useState(null);
  const [showEmotionPopup, setShowEmotionPopup] = useState(false);
  const [analyzingEmotion, setAnalyzingEmotion] = useState(false);
  const [savingEmotion, setSavingEmotion] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [savedEmotions, setSavedEmotions] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [emotionRange, setEmotionRange] = useState('week');
  const [downloadingData, setDownloadingData] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isDiaryListening, setIsDiaryListening] = useState(false);
  const [diaryRecognition, setDiaryRecognition] = useState(null);
  const [currentQuote, setCurrentQuote] = useState(getDailyQuote());
  const [dailyEmotions, setDailyEmotions] = useState([]);

  useEffect(() => {
    if (activeTab === 'diary') {
      getCurrentUserId().then(userId => {
        if (userId) {
          getDiaries(userId).then(({ data }) => {
            setDiaryList(data || []);
          });
        }
      });
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'emotions' || activeTab === 'stats') {
      fetchSavedEmotions();
    }
  }, [activeTab]);

  useEffect(() => {
    // Web Speech API'yi başlat
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'tr-TR';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setEmotionText(prev => prev + ' ' + transcript);
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        console.error('Ses tanıma hatası:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognition);
    }
  }, []);

  useEffect(() => {
    // Günlük için Web Speech API'yi başlat
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'tr-TR';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setDiaryContent(prev => prev + ' ' + transcript);
        setIsDiaryListening(false);
      };
      
      recognition.onerror = (event) => {
        console.error('Ses tanıma hatası:', event.error);
        setIsDiaryListening(false);
      };
      
      recognition.onend = () => {
        setIsDiaryListening(false);
      };
      
      setDiaryRecognition(recognition);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(getDailyQuote());
    }, 60000); // 60000 ms = 1 minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let channel;
    let isMounted = true;

    const setupRealtime = async () => {
      try {
        const userId = await getCurrentUserId();
        if (!userId) {
          console.error('Kullanıcı ID bulunamadı');
          return;
        }

        // Önceki kanalı temizle
        if (channel) {
          await supabase.removeChannel(channel);
        }

        // Yeni kanal oluştur
        channel = supabase
          .channel('diary-realtime')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'diaries',
              filter: `user_id=eq.${userId}`
            },
            (payload) => {
              console.log('Günlük realtime değişiklik:', payload);
              if (!isMounted) return;

              // Silme işlemi
              if (payload.eventType === 'DELETE') {
                console.log('Günlük silme işlemi algılandı:', payload.old.id);
                setDiaryList(prev => prev.filter(item => item.id !== payload.old.id));
                if (selectedDiary && selectedDiary.id === payload.old.id) {
                  setSelectedDiary(null);
                  setModalOpen(false);
                }
              }
              // Ekleme işlemi
              else if (payload.eventType === 'INSERT') {
                console.log('Günlük ekleme işlemi algılandı:', payload.new);
                setDiaryList(prev => [payload.new, ...prev]);
              }
              // Güncelleme işlemi
              else if (payload.eventType === 'UPDATE') {
                console.log('Günlük güncelleme işlemi algılandı:', payload.new);
                setDiaryList(prev => 
                  prev.map(item => item.id === payload.new.id ? payload.new : item)
                );
                if (selectedDiary && selectedDiary.id === payload.new.id) {
                  setSelectedDiary(payload.new);
                }
              }
            }
          )
          .subscribe((status) => {
            console.log('Günlük subscription status:', status);
            if (status === 'SUBSCRIBED') {
              // İlk yükleme
              getCurrentUserId().then(userId => {
                if (userId) {
                  getDiaries(userId).then(({ data }) => {
                    setDiaryList(data || []);
                  });
                }
              });
            }
          });

      } catch (error) {
        console.error('Günlük realtime subscription hatası:', error);
      }
    };

    // Günlük sekmesi aktifse subscription'ı başlat
    if (activeTab === 'diary') {
      setupRealtime();
    }

    // Cleanup
    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [activeTab]);

  const toggleListening = () => {
    if (!recognition) {
      alert('Tarayıcınız ses tanıma özelliğini desteklemiyor.');
      return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Ses tanıma başlatma hatası:', error);
        setIsListening(false);
      }
    }
  };

  const toggleDiaryListening = () => {
    if (!diaryRecognition) {
      alert('Tarayıcınız ses tanıma özelliğini desteklemiyor.');
      return;
    }
    
    if (isDiaryListening) {
      diaryRecognition.stop();
    } else {
      try {
        diaryRecognition.start();
        setIsDiaryListening(true);
      } catch (error) {
        console.error('Ses tanıma başlatma hatası:', error);
        setIsDiaryListening(false);
      }
    }
  };

  const fetchSavedEmotions = async () => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        setSavedEmotions([]);
        return;
      }
      const { data, error } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const fixedEmotions = (data || []).map(item => {
        let emotionsArr = [];
        if (Array.isArray(item.emotions)) {
          emotionsArr = item.emotions;
        } else if (typeof item.emotions === 'string') {
          try {
            emotionsArr = JSON.parse(item.emotions);
          } catch (e) {
            emotionsArr = [];
          }
        } else if (item.emotions && typeof item.emotions === 'object') {
          emotionsArr = [item.emotions];
        }
        return { ...item, emotions: emotionsArr };
      });

      setSavedEmotions(fixedEmotions);
      console.log('savedEmotions:', fixedEmotions);
    } catch (error) {
      console.error('Duygular yüklenirken hata:', error);
    }
  };

  const handleDiarySubmit = async () => {
    if (!diaryContent.trim()) {
      alert('Lütfen bir metin girin.');
      return;
    }

    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        console.error('Kullanıcı ID bulunamadı');
        return;
      }

      const { error } = await createDiary(diaryContent, userId);
      if (error) {
        console.error('Günlük kaydedilirken hata:', error);
        alert('Günlük kaydedilirken bir hata oluştu.');
        return;
      }

      // Önce state'i güncelle
      setDiaryContent('');
      
      // Sonra verileri yeniden yükle
      const { data } = await getDiaries(userId);
      if (data) {
        setDiaryList(data);
      }
      
      // En son aktif tab'i güncelle
      setActiveTab('diary');
    } catch (error) {
      console.error('Günlük kaydedilirken beklenmeyen hata:', error);
      alert('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleDeleteDiary = async (id) => {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.error('Kullanıcı ID bulunamadı');
      return;
    }
    await deleteDiary(id, userId);
    const { data } = await getDiaries(userId);
    setDiaryList(data || []);
  };

  const handleEditDiary = (entry) => {
    setSelectedDiary(entry);
    setEditContent(entry.content);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleUpdateDiary = async () => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        console.error('Kullanıcı ID bulunamadı');
        return;
      }
      const { error } = await updateDiary(selectedDiary.id, editContent, userId);
      if (error) {
        console.error('Günlük güncellenirken hata:', error);
        return;
      }
      setEditMode(false);
      setModalOpen(false);
      const { data } = await getDiaries(userId);
      setDiaryList(data || []);
    } catch (error) {
      console.error('Günlük güncellenirken beklenmeyen hata:', error);
    }
  };

  const handleProfileSave = async () => {
    setProfileLoading(true);
    try {
      const { error } = await updateProfile(profile);
      if (error) {
        console.error('Profil güncellenirken hata:', error);
        return;
      }
      setProfileEdit(false);
      localStorage.setItem('user', JSON.stringify({ ...user, username: profile.username, email: profile.email }));
    } catch (error) {
      console.error('Profil güncellenirken beklenmeyen hata:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    if (!passwords.new || passwords.new.length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalı.');
      return;
    }
    const { error } = await changePassword(passwords.new);
    if (!error) {
      setPasswordModal(false);
      setPasswords({ old: '', new: '' });
    } else {
      setPasswordError('Şifre değiştirilemedi.');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');
    // Gerçek silme için admin yetkisi gerekir, burada sadece çıkış yapıyoruz.
    await deleteAccount();
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleEmotionAnalyze = async () => {
    if (!emotionText.trim()) {
      setEmotionResult({ error: "Lütfen analiz edilecek bir metin girin." });
      setShowEmotionPopup(true);
      return;
    }

    setAnalyzingEmotion(true);
    try {
      console.log('Duygu analizi isteği gönderiliyor:', emotionText);
      
      // Türkçe metni MyMemory API ile İngilizce'ye çevir
      console.log('MyMemory Translation API isteği gönderiliyor...');
      const translateResponse = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(emotionText) + '&langpair=tr|en');
      const translateData = await Promise.race([
        translateResponse.json(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('MyMemory API Timeout')), 10000))
      ]);
      
      let translatedText = translateData.responseData.translatedText;
      if (!translatedText) {
        console.log('MyMemory çeviri başarısız, orijinal metin kullanılıyor:', emotionText);
        translatedText = emotionText;
      }

      console.log('Çevrilen metin:', translatedText);

      // Hugging Face duygu analizi
      const hfResponse = await fetch('https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
        },
        body: JSON.stringify({ inputs: translatedText }),
      });

      const hfData = await Promise.race([
        hfResponse.json(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Hugging Face API Timeout')), 20000))
      ]);
      console.log('Hugging Face Raw Data:', hfData);

      // Duyguları filtrele ve sırala (0.1 eşik değeri ile)
      const filteredResults = hfData[0]
        .filter(emotion => emotion.score > 0.1)
        .sort((a, b) => b.score - a.score);

      // Duygu etiketlerini Türkçe'ye çevir
      const translatedResults = filteredResults.map(result => ({
        label: emotionLabels[result.label] || result.label,
        score: result.score,
        intensity: result.score * 100
      }));

      // Detaylı açıklama oluştur
      let detail = '';
      if (translatedResults.length === 0) {
        detail = 'Metinde belirgin bir duygu ifadesi bulunamadı.';
      } else {
        const emotionTexts = translatedResults.map(emotion => 
          `${emotion.label} (${emotion.intensity.toFixed(0)}%)`
        );
        detail = `Metinde ${emotionTexts.join(', ')} duyguları tespit edildi.`;
      }

      const formattedResponse = [{
        emotions: translatedResults,
        details: {
          description: detail,
          originalText: emotionText,
          translatedText: translatedText,
          rawEmotions: hfData[0]
        }
      }];

      setEmotionResult(formattedResponse);
      setShowEmotionPopup(true);
    } catch (error) {
      console.error('Duygu analizi hatası:', error);
      setEmotionResult({ 
        error: error.message || "Analiz başarısız oldu. Lütfen tekrar deneyin.",
        details: "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      });
      setShowEmotionPopup(true);
    } finally {
      setAnalyzingEmotion(false);
    }
  };

  const handleSaveEmotion = async () => {
    const userId = await getCurrentUserId();
    if (!emotionResult || !emotionText.trim() || !userId) {
      return;
    }

    setSavingEmotion(true);
    try {
      const { error } = await supabase
        .from('emotions')
        .insert([
          {
            user_id: userId,
            text: emotionText,
            emotions: emotionResult[0].emotions,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setShowSavePopup(true);
      setEmotionText('');
      setEmotionResult(null);
      setShowEmotionPopup(false);
      fetchSavedEmotions();
    } catch (error) {
      console.error('Duygu kaydetme hatası:', error);
      alert('Duygular kaydedilirken bir hata oluştu.');
    } finally {
      setSavingEmotion(false);
    }
  };

  const formatScore = (score) => {
    if (typeof score !== 'number' || isNaN(score)) return 'Bilinmiyor';
    return `${(score * 100).toFixed(2)}%`;
  };

  const handleDeleteEmotion = async (id) => {
    if (!window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    try {
      const { error } = await supabase
        .from('emotions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // State'i güncelle
      setSavedEmotions(prev => prev.filter(item => item.id !== id));
      if (selectedEmotion && selectedEmotion.id === id) {
        setSelectedEmotion(null);
      }
      
      // Başarılı silme mesajı
      alert('Kayıt başarıyla silindi');
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Silme işlemi sırasında hata oluştu.');
    }
  };

  const handleDownloadData = async () => {
    setDownloadingData(true);
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        alert('Kullanıcı bilgisi bulunamadı.');
        return;
      }

      // Günlük verilerini al
      const { data: diaryData } = await getDiaries(userId);

      // Duygu analizi verilerini al
      const { data: emotionData } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // PDF oluştur
      const doc = new jsPDF();
      
      // Başlık
      doc.setFontSize(16);
      doc.text('MindMood - Veri Raporu', 20, 20);
      doc.setFontSize(10);
      doc.text(`Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 20, 30);
      
      // Kullanıcı Bilgileri
      doc.setFontSize(12);
      doc.text('Kullanıcı Bilgileri:', 20, 40);
      doc.setFontSize(10);
      doc.text(`Kullanıcı Adı: ${profile.username || user?.username}`, 20, 50);
      doc.text(`E-posta: ${profile.email || user?.email}`, 20, 55);
      
      let yPosition = 70;
      
      // Günlük Kayıtları
      if (diaryData && diaryData.length > 0) {
        doc.setFontSize(12);
        doc.text('Günlük Kayıtları:', 20, yPosition);
        yPosition += 10;
        
        diaryData.forEach((entry, index) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFontSize(10);
          const date = new Date(entry.created_at).toLocaleDateString('tr-TR');
          doc.text(`Tarih: ${date}`, 20, yPosition);
          yPosition += 5;
          
          // İçeriği satırlara böl
          const contentLines = doc.splitTextToSize(entry.content, 170);
          contentLines.forEach(line => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(line, 20, yPosition);
            yPosition += 5;
          });
          
          yPosition += 5;
        });
      }
      
      // Duygu Analizleri
      if (emotionData && emotionData.length > 0) {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.text('Duygu Analizleri:', 20, yPosition);
        yPosition += 10;
        
        emotionData.forEach((emotion, index) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFontSize(10);
          const date = new Date(emotion.created_at).toLocaleDateString('tr-TR');
          doc.text(`Tarih: ${date}`, 20, yPosition);
          yPosition += 5;
          
          // Metni satırlara böl
          const textLines = doc.splitTextToSize(emotion.text, 170);
          textLines.forEach(line => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(line, 20, yPosition);
            yPosition += 5;
          });
          
          // Duyguları ekle
          if (emotion.emotions && Array.isArray(emotion.emotions)) {
            const emotionsText = emotion.emotions.map(e => 
              `${e.label}: ${(e.score * 100).toFixed(2)}%`
            ).join(', ');
            
            const emotionLines = doc.splitTextToSize(emotionsText, 170);
            emotionLines.forEach(line => {
              if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
              }
              doc.text(line, 20, yPosition);
              yPosition += 5;
            });
          }
          
          yPosition += 5;
        });
      }
      
      // PDF'i indir
      doc.save(`mindmood_rapor_${new Date().toISOString().split('T')[0]}.pdf`);
      alert('Raporunuz başarıyla indirildi!');
    } catch (error) {
      console.error('Rapor oluşturma hatası:', error);
      alert('Rapor oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setDownloadingData(false);
    }
  };

  const renderEmotionPopup = () => {
    if (!showEmotionPopup) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white rounded-xl p-8 shadow-2xl text-center max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#7c1fa0]">Duygu Analizi Sonucu</h2>
            <button
              onClick={() => {
                setShowEmotionPopup(false);
                setEmotionText('');
              }}
              className="text-[#7c1fa0] hover:text-[#ee00ee] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {emotionResult?.error ? (
            <div className="text-red-500 mb-4">
              <p className="font-bold">{emotionResult.error}</p>
              {emotionResult.details && (
                <p className="text-sm mt-2 text-gray-600">{emotionResult.details}</p>
              )}
              <button
                onClick={() => {
                  setShowEmotionPopup(false);
                  setEmotionText('');
                }}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          ) : emotionResult && Array.isArray(emotionResult) && emotionResult.length > 0 ? (
            <div>
              {emotionResult[0].emotions.length > 0 && (
                <p className="text-lg font-semibold text-[#7c1fa0] mb-4">
                  {emotionResult[0].emotions.length} Duygu Tespit Edildi:
                </p>
              )}
              <div className="space-y-3 mb-6">
                {emotionResult[0].emotions.map((emotion, index) => (
                  <div key={index} className="bg-white/50 p-3 rounded-lg border border-[#ee00ee]/20">
                    <p className="text-lg">
                      <span className="font-semibold text-[#7c1fa0]">Duygu:</span> {emotion.label}
                      <span className="mx-2">–</span>
                      <span className="font-semibold text-[#7c1fa0]">Oran:</span> {formatScore(emotion.score)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setShowEmotionPopup(false);
                    setEmotionText('');
                  }}
                  className="flex-1 px-6 py-2 bg-[#ee00ee] text-white rounded-lg hover:bg-[#7c1fa0] transition-colors"
                >
                  Yeni Analiz
                </button>
                <button
                  onClick={handleSaveEmotion}
                  disabled={savingEmotion}
                  className="flex-1 px-6 py-2 bg-[#7c1fa0] text-white rounded-lg hover:bg-[#ee00ee] transition-colors disabled:opacity-60"
                >
                  {savingEmotion ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-red-500">Sonuç alınamadı.</p>
              <button
                onClick={() => {
                  setShowEmotionPopup(false);
                  setEmotionText('');
                }}
                className="mt-4 px-4 py-2 bg-[#ee00ee] text-white rounded-lg hover:bg-[#7c1fa0] transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  function getEmotionColor(emotion) {
    const colors = {
  
  'Mutluluk': '#FFD700',       // parlak altın sarısı
  'Üzüntü': '#4682B4',         // soğuk çelik mavisi
  'Öfke': '#FF4500',           // canlı turuncu-kırmızı
  'Korku': '#800080',          // koyu mor
  'Şaşkınlık': '#FF69B4',      // parlak pembe
  'İğrenme': '#228B22',        // orman yeşili
  'Nötr': '#808080',           // sade gri
  'Sevgi': '#FF1493',          // sıcak pembe
  'Hayranlık': '#00CED1',      // koyu turkuaz
  'Eğlence': '#FFA500',        // canlı turuncu
  'Rahatsızlık': '#A0522D',    // yoğun kahverengi
  'Onay': '#32CD32',           // limon yeşili
  'İlgili': '#20B2AA',         // açık deniz mavisi
  'Kafa Karışıklığı': '#BA55D3', // orkide moru
  'Merak': '#FF6347',          // domates kırmızısı
  'İstek': '#FF8C00',          // koyu turuncu
  'Hayal Kırıklığı': '#8B4513', // koyu kahverengi
  'Onaylamama': '#DC143C',     // kiraz kırmızısı
  'Utangaçlık': '#DB7093',     // soluk pembe
  'Heyecan': '#FF6347',        // domates kırmızısı
  'Minnettarlık': '#DAA520',   // altın kahverengi
  'Keder': '#4B0082',          // çivit moru
  'Gerginlik': '#B22222',      // ateş kırmızısı
  'İyimserlik': '#00FF7F',     // yayla yeşili
  'Gurur': '#FF7F50',          // mercan rengi
  'Farkındalık': '#1E90FF',    // dodger blue
  'Rahatlık': '#98FB98',       // soluk yeşil
  'Pişmanlık': '#C71585'       // orta menekşe


    };
    return colors[emotion] || `hsl(${Math.random() * 360}, 70%, 50%)`;
  }

  const EmotionStackedBarChart = React.memo(({ data }) => {
    const chartRef = React.useRef(null);
    const [chartInstance, setChartInstance] = React.useState(null);

    React.useEffect(() => {
      if (!data || !data.labels || !data.datasets || data.labels.length === 0) return;
      const ctx = chartRef.current.getContext('2d');
      if (chartInstance) chartInstance.destroy();
      const newChart = new ChartJS(ctx, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) label += ': ';
                  if (context.parsed.y !== null) label += context.parsed.y.toFixed(1) + '%';
                  return label;
                }
              }
            }
          },
          scales: {
            x: { stacked: true, title: { display: true, text: 'Tarih' } },
            y: { stacked: true, beginAtZero: true, max: 100, title: { display: true, text: 'Yoğunluk (%)' } }
          }
        }
      });
      setChartInstance(newChart);
      return () => { if (newChart) newChart.destroy(); };
    }, [data]);
    if (!data || !data.labels || !data.datasets || data.labels.length === 0) {
      return <p className="text-gray-500">Grafik verisi yüklenemedi</p>;
    }
    return <div className="w-full h-full relative"><canvas ref={chartRef} /></div>;
  });

  function prepareStackedBarData(emotions) {
    if (!emotions || emotions.length === 0) return { labels: [], datasets: [] };
    const sorted = [...emotions].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const labels = sorted.map(entry => new Date(entry.created_at).toLocaleDateString('tr-TR'));
    const emotionLabels = Array.from(new Set(sorted.flatMap(e => (Array.isArray(e.emotions) ? e.emotions : []).map(em => em.label))));
    const datasets = emotionLabels.map(label => {
      return {
        label,
        data: sorted.map(entry => {
          const arr = Array.isArray(entry.emotions) ? entry.emotions : [];
          const found = arr.find(e => e.label === label);
          // Tek ondalık basamakla formatla
          return found ? parseFloat((found.score * 100).toFixed(1)) : 0;
        }),
        backgroundColor: getEmotionColor(label),
        borderColor: getEmotionColor(label),
        borderWidth: 1
      };
    });
    return { labels, datasets };
  }

  function filterEmotionsByRange(emotions, range) {
    if (!emotions || emotions.length === 0) return [];
    const now = new Date();
    let startDate;
    if (range === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6); // Son 7 gün
    } else if (range === 'month') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1); // Son 1 ay
    } else {
      return emotions;
    }
    return emotions.filter(entry => new Date(entry.created_at) >= startDate);
  }

  const EmotionPieChart = React.memo(({ data }) => {
    const chartRef = React.useRef(null);
    const [chartInstance, setChartInstance] = React.useState(null);

    React.useEffect(() => {
      if (!data || !data.labels || !data.datasets || data.labels.length === 0) return;
      const ctx = chartRef.current.getContext('2d');
      if (chartInstance) chartInstance.destroy();
      const newChart = new ChartJS(ctx, {
        type: 'pie',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right' },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.label || '';
                  if (label) label += ': ';
                  if (context.parsed !== null) label += context.parsed + ' kez';
                  return label;
                }
              }
            },
            datalabels: {
              color: '#fff',
              font: {
                weight: 'bold',
                size: 14
              },
              formatter: (value, context) => {
                const label = context.chart.data.labels[context.dataIndex];
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percent = total > 0 ? Math.round((value / total) * 100) : 0;
                return `${label}\n${percent}%`;
              },
              textAlign: 'center',
              anchor: 'center',
              clamp: true
            }
          },
          animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
          }
        },
        plugins: [ChartDataLabels]
      });
      setChartInstance(newChart);
      return () => { if (newChart) newChart.destroy(); };
    }, [data]);
    if (!data || !data.labels || !data.datasets || data.labels.length === 0) {
      return <p className="text-gray-500">Grafik verisi yüklenemedi</p>;
    }
    return <div className="w-full h-full relative"><canvas ref={chartRef} /></div>;
  });

  function preparePieChartData(emotions) {
    if (!emotions || emotions.length === 0) return { labels: [], datasets: [] };
    const counts = {};
    emotions.forEach(entry => (Array.isArray(entry.emotions) ? entry.emotions : []).forEach(e => { counts[e.label] = (counts[e.label] || 0) + 1; }));
    const labels = Object.keys(counts);
    const data = Object.values(counts);
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: labels.map(label => getEmotionColor(label)),
        borderColor: '#fff',
        borderWidth: 2
      }]
    };
  }

  // GÜNCEL: Duygular için realtime subscription
  useEffect(() => {
    let channel;
    let isMounted = true;

    const setupRealtime = async () => {
      try {
        const userId = await getCurrentUserId();
        if (!userId) {
          console.error('Kullanıcı ID bulunamadı');
          return;
        }

        // Önceki kanalı temizle
        if (channel) {
          await supabase.removeChannel(channel);
        }

        // Yeni kanal oluştur
        channel = supabase
          .channel('emotions-realtime')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'emotions',
              filter: `user_id=eq.${userId}`
            },
            (payload) => {
              console.log('Realtime değişiklik:', payload);
              if (!isMounted) return;

              // Silme işlemi
              if (payload.eventType === 'DELETE') {
                console.log('Silme işlemi algılandı:', payload.old.id);
                setSavedEmotions(prev => prev.filter(item => item.id !== payload.old.id));
                if (selectedEmotion && selectedEmotion.id === payload.old.id) {
                  setSelectedEmotion(null);
                }
              }
              // Ekleme işlemi
              else if (payload.eventType === 'INSERT') {
                console.log('Ekleme işlemi algılandı:', payload.new);
                setSavedEmotions(prev => [payload.new, ...prev]);
              }
              // Güncelleme işlemi
              else if (payload.eventType === 'UPDATE') {
                console.log('Güncelleme işlemi algılandı:', payload.new);
                setSavedEmotions(prev => 
                  prev.map(item => item.id === payload.new.id ? payload.new : item)
                );
              }
            }
          )
          .subscribe((status) => {
            console.log('Subscription status:', status);
            if (status === 'SUBSCRIBED') {
              // İlk yükleme
              fetchSavedEmotions();
            }
          });

      } catch (error) {
        console.error('Realtime subscription hatası:', error);
      }
    };

    // Duygular sekmesi aktifse subscription'ı başlat
    if (activeTab === 'emotions') {
      setupRealtime();
    }

    // Cleanup
    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [activeTab]);

  // Günlük duygu değişim grafiği
  const renderDailyEmotionChart = () => {
    if (!dailyEmotions.length) return null;

    const chartData = {
      labels: dailyEmotions.map(e => {
        const date = new Date(e.created_at);
        return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      }),
      datasets: [{
        label: 'Duygu Değişimi',
        data: dailyEmotions.map(e => e.intensity),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const emotion = dailyEmotions[context.dataIndex];
              return [
                `Duygu: ${emotion.emotion_name}`,
                `Yoğunluk: ${emotion.intensity}`,
                `Not: ${emotion.note || 'Yok'}`
              ];
            }
          }
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'x',
            modifierKey: 'ctrl',
          },
          zoom: {
            wheel: {
              enabled: true,
              modifierKey: 'ctrl',
            },
            pinch: {
              enabled: true
            },
            mode: 'x',
          },
          limits: {
            x: {min: 'original', max: 'original'}
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        },
        y: {
          beginAtZero: true,
          max: 10,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4">Günlük Duygu Değişimi</h3>
        <div className="relative" style={{ height: '300px' }}>
          <Line data={chartData} options={options} />
        </div>
        <div className="mt-2 text-sm text-gray-500 text-center">
          <p>Grafiği kaydırmak için CTRL tuşuna basılı tutarak fare tekerleğini kullanın</p>
          <p>veya dokunmatik ekranda iki parmakla kaydırın</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#ee00ee] to-[#7c1fa0] font-sans transition-colors duration-700 relative overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col items-center py-10 bg-white/90 shadow-2xl rounded-tr-3xl rounded-br-3xl animate-fade-in-left relative z-10">
        <div className="mb-4">
          <span className="text-3xl font-extrabold text-[#ee00ee] tracking-wide drop-shadow-lg">MindMood</span>
        </div>
        <img src={mindmoodLogo} alt="MindMood Logo" className="w-20 h-20 object-contain mb-8 rounded-full" />
        <nav className="flex flex-col gap-6 w-full mt-8">
          <SidebarIcon icon={<span role="img" aria-label="home" className="text-[#ee00ee]">🏠</span>} label="Ana Sayfa" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <SidebarIcon icon={<span role="img" aria-label="smile" className="text-[#ee00ee]">😊</span>} label="Duygularım" active={activeTab === 'emotions'} onClick={() => setActiveTab('emotions')} />
          <SidebarIcon icon={<span role="img" aria-label="notebook" className="text-[#ee00ee]">📔</span>} label="Günlük" active={activeTab === 'diary'} onClick={() => setActiveTab('diary')} />
          <SidebarIcon icon={<span role="img" aria-label="chart" className="text-[#ee00ee]">📊</span>} label="Analiz" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
          <SidebarIcon icon={<span role="img" aria-label="settings" className="text-[#ee00ee]">⚙️</span>} label="Ayarlar" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          <SidebarIcon icon={<span role="img" aria-label="logout" className="text-[#ee00ee]">↩️</span>} label="Çıkış Yap" onClick={() => {localStorage.removeItem('user'); navigate('/');}} />
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 relative animate-fade-in-up z-10">
        <div className="absolute top-8 right-12 flex items-center gap-4">
          <div className="bg-white/80 px-6 py-2 rounded-full flex items-center gap-2 text-lg shadow text-[#ee00ee] font-semibold animate-fade-in border-2 border-[#ee00ee]">
            {today.getDate()} {months[today.getMonth()]} <span className="font-bold">{days[today.getDay()]}</span>
          </div>
        </div>
        {/* Ana içerik: Tab'a göre göster */}
        {activeTab === 'home' && (
          <>
            <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl p-8 flex flex-col items-center mb-4 animate-fade-in-up border-2 border-[#ee00ee]">
              <h1 className="text-3xl font-bold text-[#7c1fa0] mb-2">Hoş Geldiniz!</h1>
              <p className="text-2xl font-extrabold text-[#ee00ee] mt-2">{profile.username || user?.username || 'Kullanıcı'}</p>
              <p className="text-lg text-[#7c1fa0] mb-2 mt-2">Bugün nasıl hissediyorsunuz?</p>
              <p className="text-lg text-center italic text-[#ee00ee] font-medium mt-4">"{currentQuote}"</p>
            </div>
            <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl p-8 flex flex-col items-center mb-4 animate-fade-in-up border-2 border-[#ee00ee]">
              <h2 className="text-2xl font-bold text-[#7c1fa0] mb-4">Duygu Analizi</h2>
              <div className="w-full relative">
                <textarea
                  value={emotionText}
                  onChange={e => setEmotionText(e.target.value)}
                  placeholder="Duygularınızı buraya yazın..."
                  className="w-full min-h-32 max-h-60 px-6 py-4 rounded-xl bg-white border-2 border-[#ee00ee] text-[#7c1fa0] placeholder-[#ee00ee] focus:outline-none focus:ring-2 focus:ring-[#ee00ee] transition-all mb-4 shadow resize-y overflow-x-hidden"
                />
                <button
                  onClick={toggleListening}
                  className={`absolute right-4 top-4 p-2 rounded-full transition-all ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-[#ee00ee] hover:bg-[#7c1fa0]'
                  }`}
                  title={isListening ? 'Dinlemeyi Durdur' : 'Sesli Giriş'}
                >
                  {isListening ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  )}
                </button>
              </div>
              <button
                onClick={handleEmotionAnalyze}
                disabled={analyzingEmotion}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#ee00ee] to-[#7c1fa0] rounded-xl text-white font-bold shadow-lg hover:scale-105 hover:shadow-2xl hover:from-[#7c1fa0] hover:to-[#ee00ee] transition-all text-lg animate-pulse border-2 border-[#ee00ee] disabled:opacity-60"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 19V6M5 12l7-7 7 7"/></svg>
                {analyzingEmotion ? "Analiz Ediliyor..." : "Analiz Et"}
              </button>
            </div>
            {renderEmotionPopup()}
            {/* Kartlar */}
            <div className="flex gap-8 mt-2">
              <AnimatedCard delay={0} className="bg-white/90 text-[#ee00ee] border-2 border-[#ee00ee]">
                <span className="text-4xl mb-2">📔</span>
                <span className="font-bold text-lg">Günlük</span>
              </AnimatedCard>
              <AnimatedCard delay={0.15} className="bg-white/90 text-[#ee00ee] border-2 border-[#ee00ee]">
                <span className="text-4xl mb-2">📈</span>
                <span className="font-bold text-lg">Gelişim Haritası</span>
              </AnimatedCard>
              <AnimatedCard delay={0.3} className="bg-white/90 text-[#ee00ee] border-2 border-[#ee00ee]">
                <span className="text-4xl mb-2">🧘‍♂️</span>
                <span className="font-bold text-lg">Meditasyon</span>
              </AnimatedCard>
            </div>
          </>
        )}
        {activeTab === 'emotions' && (
          <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl p-8 flex flex-col items-start mb-8 animate-fade-in-up border-2 border-[#ee00ee]">
            <h2 className="text-2xl font-bold text-[#7c1fa0] mb-4">Duygu Geçmişim</h2>
            <div className="w-full">
              {savedEmotions.length > 0 ? (
                <div className="space-y-6">
                  {savedEmotions.map((emotion, index) => (
                    <div
                      key={emotion.id}
                      className="bg-white/90 p-6 rounded-2xl shadow flex flex-col items-start mb-4 border-2 border-[#ee00ee] cursor-pointer hover:scale-105 transition-all relative"
                      onClick={() => setSelectedEmotion(emotion)}
                    >
                      <button
                        onClick={e => { e.stopPropagation(); handleDeleteEmotion(emotion.id); }}
                        className="absolute top-4 right-4 text-red-500 font-bold text-lg hover:text-red-700"
                        title="Sil"
                      >Sil</button>
                      <div className="text-xl font-bold text-[#7c1fa0] mb-2">{new Date(emotion.created_at).toLocaleDateString('tr-TR')}</div>
                      <div className="text-base text-[#222] mb-2">{emotion.text}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Henüz kaydedilmiş duygu analizi bulunmuyor.</p>
              )}
            </div>
            {/* Popup */}
            {selectedEmotion && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white rounded-2xl p-8 border-2 border-[#ee00ee] shadow-2xl max-w-lg w-full relative">
                  <button
                    onClick={() => setSelectedEmotion(null)}
                    className="absolute top-4 right-4 text-[#ee00ee] text-2xl font-bold hover:text-[#7c1fa0]"
                  >×</button>
                  <div className="text-2xl font-bold text-[#7c1fa0] mb-4">{new Date(selectedEmotion.created_at).toLocaleDateString('tr-TR')}</div>
                  <div className="text-base text-[#222] mb-4">{selectedEmotion.text}</div>
                  <div className="space-y-2">
                    {selectedEmotion.emotions.map((emotionData, idx) => (
                      <div key={idx} className="text-lg bg-white/50 p-2 rounded-lg border border-[#ee00ee]/20">
                        <p>
                          <span className="font-semibold text-[#7c1fa0]">Duygu:</span> {emotionData.label}
                          <span className="mx-2">–</span>
                          <span className="font-semibold text-[#7c1fa0]">Oran:</span> {formatScore(emotionData.score)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'stats' && (
          <div className="w-full max-w-5xl flex flex-col items-start mb-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#7c1fa0] mb-6">Duygu Analizi İstatistikleri</h2>
            <div className="flex gap-4 mb-4">
              <button
                className={`px-4 py-2 rounded-lg font-bold border-2 ${emotionRange === 'week' ? 'bg-[#ee00ee] text-white border-[#ee00ee]' : 'bg-white text-[#7c1fa0] border-[#ee00ee]'}`}
                onClick={() => setEmotionRange('week')}
              >Haftalık</button>
              <button
                className={`px-4 py-2 rounded-lg font-bold border-2 ${emotionRange === 'month' ? 'bg-[#ee00ee] text-white border-[#ee00ee]' : 'bg-white text-[#7c1fa0] border-[#ee00ee]'}`}
                onClick={() => setEmotionRange('month')}
              >Aylık</button>
            </div>
            <div className="w-full flex flex-col gap-8">
              {/* En Sık Duygu Kartı */}
              <div className="w-full bg-white/90 rounded-2xl shadow-2xl p-8 border-2 border-[#ee00ee]">
                <h3 className="text-xl font-bold text-[#7c1fa0] mb-2">En Sık Duygu</h3>
                {savedEmotions && savedEmotions.length > 0 ? (
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#ee00ee]">
                      {/* En sık duygu hesaplama */}
                      {(() => {
                        const filtered = filterEmotionsByRange(savedEmotions, emotionRange);
                        const counts = {};
                        filtered.forEach(entry => (Array.isArray(entry.emotions) ? entry.emotions : []).forEach(e => { counts[e.label] = (counts[e.label] || 0) + 1; }));
                        const max = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                        return max ? `${max[0]} (${max[1]} kez)` : 'Veri yok';
                      })()}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500">Henüz veri yok</p>
                    <p className="text-sm text-gray-400 mt-2">Duygu analizi yaparak veri ekleyebilirsiniz</p>
                  </div>
                )}
              </div>
              {/* Duygu Değişim Grafiği (Stacked Bar) */}
              <div className="w-full bg-white/90 rounded-2xl shadow-2xl p-8 border-2 border-[#ee00ee]">
                <h3 className="text-xl font-bold text-[#7c1fa0] mb-4">Duygu Değişim Grafiği</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Duygularınızın zaman içindeki değişimini ve yoğunluğunu gösteren yığılmış bar grafik.
                </p>
                {savedEmotions && savedEmotions.length > 0 ? (
                  <div className="h-[500px]">
                    <EmotionStackedBarChart data={prepareStackedBarData(filterEmotionsByRange(savedEmotions, emotionRange))} />
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500">Henüz veri yok</p>
                    <p className="text-sm text-gray-400 mt-2">Duygu analizi yaparak veri ekleyebilirsiniz</p>
                  </div>
                )}
              </div>
              {/* Pie Chart Kartı */}
              <div className="w-full bg-white/90 rounded-2xl shadow-2xl p-8 border-2 border-[#ee00ee]">
                <h3 className="text-xl font-bold text-[#7c1fa0] mb-4">Duygu Dağılımı </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Seçili aralıktaki duyguların oranlarını pasta grafik olarak görebilirsiniz.
                </p>
                {savedEmotions && savedEmotions.length > 0 ? (
                  <div className="h-[400px]">
                    <EmotionPieChart data={preparePieChartData(filterEmotionsByRange(savedEmotions, emotionRange))} />
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500">Henüz veri yok</p>
                    <p className="text-sm text-gray-400 mt-2">Duygu analizi yaparak veri ekleyebilirsiniz</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'diary' && (
          <>
            <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl p-8 flex flex-col items-start mb-8 animate-fade-in-up border-2 border-[#ee00ee]">
              <h2 className="text-2xl font-bold text-[#7c1fa0] mb-4">Duygu Günlüğüm</h2>
              <div className="w-full relative">
                <textarea
                  value={diaryContent}
                  onChange={(e) => setDiaryContent(e.target.value)}
                  placeholder="Bugün neler hissettiniz?"
                  className="w-full min-h-32 max-h-60 px-6 py-4 rounded-xl bg-white border-2 border-[#ee00ee] text-[#7c1fa0] placeholder-[#ee00ee] focus:outline-none focus:ring-2 focus:ring-[#ee00ee] transition-all mb-4 shadow resize-y overflow-x-hidden"
                />
                <button
                  onClick={toggleDiaryListening}
                  className={`absolute right-4 top-4 p-2 rounded-full transition-all ${
                    isDiaryListening 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-[#ee00ee] hover:bg-[#7c1fa0]'
                  }`}
                  title={isDiaryListening ? 'Dinlemeyi Durdur' : 'Sesli Giriş'}
                >
                  {isDiaryListening ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex justify-center w-full">
                <button
                  onClick={handleDiarySubmit}
                  className="px-8 py-3 bg-gradient-to-r from-[#ee00ee] to-[#7c1fa0] rounded-xl text-white font-bold shadow-lg hover:scale-105 hover:shadow-2xl hover:from-[#7c1fa0] hover:to-[#ee00ee] transition-all text-lg border-2 border-[#ee00ee]"
                >
                  Kaydet
                </button>
              </div>
            </div>

            {/* Günlük Listesi */}
            <div className="w-full max-w-xl space-y-4">
              {diaryList.map((entry, idx) => (
                <div
                  key={entry.id || idx}
                  className="w-full bg-white/90 rounded-2xl shadow-2xl p-8 flex flex-col items-start mb-6 animate-fade-in-up border-2 border-[#ee00ee] cursor-pointer"
                  onClick={() => { setSelectedDiary(entry); setModalOpen(true); setEditMode(false); }}
                >
                  <div className="flex w-full justify-between items-center mb-2">
                    <div className="text-xl font-bold text-[#7c1fa0]">{new Date(entry.created_at).toLocaleDateString('tr-TR')}</div>
                    <div className="flex gap-2">
                      <button
                        className="text-[#ee00ee] font-bold px-2 py-1 rounded hover:bg-[#ee00ee]/10"
                        onClick={e => { e.stopPropagation(); handleEditDiary(entry); }}
                      >Düzenle</button>
                      <button
                        className="text-red-500 font-bold px-2 py-1 rounded hover:bg-red-100"
                        onClick={e => { e.stopPropagation(); handleDeleteDiary(entry.id); }}
                      >Sil</button>
                    </div>
                  </div>
                  <div className="text-base text-[#222] truncate" style={{width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{entry.content}</div>
                </div>
              ))}
            </div>

            {/* Modal */}
            {modalOpen && selectedDiary && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-[#ee00ee] max-w-lg w-full relative">
                  <button 
                    onClick={() => { setModalOpen(false); setEditMode(false); }} 
                    className="absolute top-4 right-4 text-[#ee00ee] text-2xl font-bold hover:text-[#7c1fa0]"
                  >×</button>
                  <div className="text-xl font-bold text-[#7c1fa0] mb-4">{new Date(selectedDiary.created_at).toLocaleDateString('tr-TR')}</div>
                  {editMode ? (
                    <>
                      <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        className="w-full min-h-32 max-h-60 px-4 py-2 rounded-xl border-2 border-[#ee00ee] text-[#7c1fa0] mb-4"
                      />
                      <button
                        onClick={handleUpdateDiary}
                        className="px-6 py-2 bg-gradient-to-r from-[#ee00ee] to-[#7c1fa0] rounded-xl text-white font-bold shadow hover:scale-105 border-2 border-[#ee00ee]"
                      >Kaydet</button>
                    </>
                  ) : (
                    <div className="text-base text-[#222] whitespace-pre-line">{selectedDiary.content}</div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        {activeTab === 'settings' && (
          <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl p-8 flex flex-col items-start mb-8 animate-fade-in-up border-2 border-[#ee00ee]">
            <h2 className="text-2xl font-bold text-[#7c1fa0] mb-4">Ayarlar</h2>
            
            {/* Profil Bilgileri */}
            <div className="mb-6 w-full">
              <h3 className="text-lg font-bold text-[#7c1fa0] mb-3">Profil Bilgileri</h3>
              <label className="block text-[#7c1fa0] font-semibold mb-1">Kullanıcı Adı</label>
              <input
                type="text"
                value={profile.username}
                disabled={!profileEdit}
                onChange={e => setProfile({ ...profile, username: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-[#ee00ee] mb-2 focus:outline-none focus:ring-2 focus:ring-[#ee00ee]"
              />
              <label className="block text-[#7c1fa0] font-semibold mb-1">E-posta</label>
              <input
                type="email"
                value={profile.email}
                disabled={!profileEdit}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-[#ee00ee] mb-2 focus:outline-none focus:ring-2 focus:ring-[#ee00ee]"
              />
              <div className="flex gap-2 mt-2">
                {!profileEdit ? (
                  <button onClick={() => setProfileEdit(true)} className="px-4 py-2 bg-[#ee00ee] text-white rounded-lg font-bold">Düzenle</button>
                ) : (
                  <>
                    <button onClick={handleProfileSave} disabled={profileLoading} className="px-4 py-2 bg-[#7c1fa0] text-white rounded-lg font-bold">Kaydet</button>
                    <button onClick={() => { setProfileEdit(false); setProfile({ username: user?.username || '', email: user?.email || '' }); }} className="px-4 py-2 bg-gray-300 text-[#7c1fa0] rounded-lg font-bold">İptal</button>
                  </>
                )}
              </div>
            </div>

            {/* Veri Yönetimi */}
            <div className="mb-6 w-full">
              <h3 className="text-lg font-bold text-[#7c1fa0] mb-3">Veri Yönetimi</h3>
              <div className="space-y-2">
                <button 
                  onClick={handleDownloadData}
                  disabled={downloadingData}
                  className="w-full px-4 py-2 bg-[#ee00ee] text-white rounded-lg font-bold hover:bg-[#7c1fa0] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {downloadingData ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Veriler İndiriliyor...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Verilerimi İndir
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Güvenlik */}
            <div className="mb-6 w-full">
              <h3 className="text-lg font-bold text-[#7c1fa0] mb-3">Güvenlik</h3>
              <button onClick={() => setPasswordModal(true)} className="w-full px-4 py-2 bg-gradient-to-r from-[#ee00ee] to-[#7c1fa0] text-white rounded-lg font-bold">Şifre Değiştir</button>
            </div>

            {/* Şifre Değiştir Modal */}
            {passwordModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-[#ee00ee] max-w-md w-full relative">
                  <button onClick={() => setPasswordModal(false)} className="absolute top-4 right-4 text-[#ee00ee] text-2xl font-bold hover:text-[#7c1fa0]">×</button>
                  <h3 className="text-xl font-bold text-[#7c1fa0] mb-4">Şifre Değiştir</h3>
                  <input
                    type="password"
                    placeholder="Yeni Şifre"
                    value={passwords.new}
                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#ee00ee] mb-2 focus:outline-none focus:ring-2 focus:ring-[#ee00ee]"
                  />
                  {passwordError && <div className="text-red-500 mb-2">{passwordError}</div>}
                  <button onClick={handlePasswordChange} className="px-4 py-2 bg-gradient-to-r from-[#ee00ee] to-[#7c1fa0] text-white rounded-lg font-bold w-full">Kaydet</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function SidebarIcon({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-3 rounded-2xl cursor-pointer transition-all border-2 ${active ? 'bg-[#ee00ee] text-white font-bold shadow-lg border-[#ee00ee]' : 'hover:bg-[#ee00ee]/10 text-[#ee00ee] border-transparent'}`}
    >
      <div className={`w-10 h-10 flex items-center justify-center rounded-full ${active ? 'bg-white shadow text-[#ee00ee]' : 'bg-white/60 text-[#ee00ee]'} text-2xl transition-all`}>{icon}</div>
      <span className="text-lg font-medium">{label}</span>
    </div>
  );
}

function AnimatedCard({ children, delay = 0, className = '' }) {
  return (
    <div
      className={`rounded-xl p-6 w-48 flex flex-col items-center shadow-lg hover:scale-110 hover:rotate-3 hover:glow-border hover:shadow-2xl transition-transform cursor-pointer animate-fade-in-up animated-gradient ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
