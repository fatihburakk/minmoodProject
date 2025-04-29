// Global değişkenler
let emotionChart = null;
let emotionTrendChart = null;
let currentDate = new Date();
let emotions = [];
let goals = [];
let journalEntries = [];
let motivationQuotes = [
    "Her yeni gün, yeni bir başlangıçtır.",
    "Küçük adımlar, büyük değişimlere yol açar.",
    "Bugün dünden daha güçlüsün.",
    "Her başarı, küçük başlangıçlarla gelir.",
    "Kendine inan, her şey mümkün.",
    "Her gün, kendini geliştirmek için bir fırsat.",
    "Pozitif düşün, pozitif yaşa.",
    "Hedeflerine ulaşmak için her gün bir adım at.",
    "En karanlık gece bile güneşin doğuşuyla biter.",
    "Kendini sev ve değer ver."
];
let currentUser = null;

// DOM Elements
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const closeBtn = document.querySelector('.close');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const backToLoginBtn = document.getElementById('backToLoginBtn');
const backToLoginBtn2 = document.getElementById('backToLoginBtn2');
const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
const startNowBtn = document.getElementById('startNowBtn');
const logoutBtn = document.getElementById('logoutBtn');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const menuItems = document.querySelectorAll('.menu-items li');

// Form Elements
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const registerName = document.getElementById('registerName');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const confirmPassword = document.getElementById('confirmPassword');
const resetEmail = document.getElementById('resetEmail');

// Event Listeners
loginBtn.addEventListener('click', () => {
    showModal();
    showForm('login');
});

registerBtn.addEventListener('click', () => {
    showModal();
    showForm('register');
});

startNowBtn.addEventListener('click', () => {
    showModal();
    showForm('register');
});

closeBtn.addEventListener('click', hideModal);

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        hideModal();
    }
});

showRegisterBtn.addEventListener('click', () => {
    showForm('register');
});

backToLoginBtn.addEventListener('click', () => {
    showForm('login');
});

backToLoginBtn2.addEventListener('click', () => {
    showForm('login');
});

forgotPasswordBtn.addEventListener('click', () => {
    showForm('forgot');
});

// Mobil menü toggle
mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Form gönderimi
loginForm.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginEmail.value;
    const password = loginPassword.value;

    try {
        // API çağrısı simülasyonu
        const response = await simulateApiCall('login', { email, password });
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        hideModal();
        showAppContainer();
        updateUserInfo(response.user);
        showSuccess('Başarıyla giriş yapıldı');
    } catch (error) {
        showError('Giriş yapılırken bir hata oluştu');
    }
});

registerForm.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = registerName.value;
    const email = registerEmail.value;
    const password = registerPassword.value;
    const confirmPass = confirmPassword.value;

    if (password !== confirmPass) {
        showError('Şifreler eşleşmiyor');
        return;
    }

    try {
        // API çağrısı simülasyonu
        const response = await simulateApiCall('register', { name, email, password });
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        hideModal();
        showAppContainer();
        updateUserInfo(response.user);
        showSuccess('Hesabınız başarıyla oluşturuldu');
    } catch (error) {
        showError('Kayıt olurken bir hata oluştu');
    }
});

forgotPasswordForm.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = resetEmail.value;

    try {
        // API çağrısı simülasyonu
        await simulateApiCall('resetPassword', { email });
        showSuccess('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi');
        showForm('login');
    } catch (error) {
        showError('Şifre sıfırlama işlemi sırasında bir hata oluştu');
    }
});

// Duygu analizi
document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const text = document.getElementById('emotionText').value;
    if (!text.trim()) {
        showError('Lütfen bir metin girin');
        return;
    }

    try {
        // API çağrısı simülasyonu
        const results = await simulateApiCall('analyzeEmotion', { text });
        updateEmotionResults(results);
        showSuccess('Analiz tamamlandı');
    } catch (error) {
        showError('Analiz sırasında bir hata oluştu');
    }
});

// Hızlı duygu girişi
document.querySelectorAll('.emotion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const emotion = btn.dataset.emotion;
        addQuickEmotion(emotion);
    });
});

// Günlük kaydetme
document.getElementById('saveJournalBtn').addEventListener('click', async () => {
    const text = document.getElementById('journalText').value;
    if (!text.trim()) {
        showError('Lütfen bir günlük girişi yapın');
        return;
    }

    try {
        // API çağrısı simülasyonu
        await simulateApiCall('saveJournal', { text });
        document.getElementById('journalText').value = '';
        showSuccess('Günlük kaydedildi');
        updateJournalHistory();
    } catch (error) {
        showError('Günlük kaydedilirken bir hata oluştu');
    }
});

// Ayarları kaydetme
document.querySelector('.settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('settingsName').value;
    const email = document.getElementById('settingsEmail').value;
    const emailNotifications = document.getElementById('emailNotifications').checked;
    const pushNotifications = document.getElementById('pushNotifications').checked;

    try {
        // API çağrısı simülasyonu
        await simulateApiCall('updateSettings', {
            name,
            email,
            emailNotifications,
            pushNotifications
        });
        showSuccess('Ayarlar kaydedildi');
        updateUserInfo({ name, email });
    } catch (error) {
        showError('Ayarlar kaydedilirken bir hata oluştu');
    }
});

// Helper Functions
function showForm(formType) {
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    forgotPasswordForm.classList.remove('active');
    
    switch (formType) {
        case 'login':
            loginForm.classList.add('active');
            break;
        case 'register':
            registerForm.classList.add('active');
            break;
        case 'forgot':
            forgotPasswordForm.classList.add('active');
            break;
    }
}

function showModal() {
    loginModal.style.display = 'block';
}

function hideModal() {
    loginModal.style.display = 'none';
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const activeForm = document.querySelector('.auth-form.active');
    if (activeForm) {
        activeForm.insertBefore(errorDiv, activeForm.firstChild);
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const activeForm = document.querySelector('.auth-form.active');
    if (activeForm) {
        activeForm.insertBefore(successDiv, activeForm.firstChild);
        setTimeout(() => successDiv.remove(), 3000);
    }
}

// API çağrısı simülasyonu
async function simulateApiCall(endpoint, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            switch (endpoint) {
                case 'login':
                    resolve({
                        token: 'dummy_token',
                        user: {
                            name: data.email.split('@')[0],
                            email: data.email
                        }
                    });
                    break;
                case 'register':
                    resolve({
                        token: 'dummy_token',
                        user: {
                            name: data.name,
                            email: data.email
                        }
                    });
                    break;
                case 'analyzeEmotion':
                    resolve({
                        happiness: Math.random() * 100,
                        sadness: Math.random() * 100,
                        anger: Math.random() * 100,
                        fear: Math.random() * 100
                    });
                    break;
                default:
                    resolve({ success: true });
            }
        }, 1000);
    });
}

// Duygu sonuçlarını güncelleme
function updateEmotionResults(results) {
    document.getElementById('happinessScore').textContent = `${Math.round(results.happiness)}%`;
    document.getElementById('sadnessScore').textContent = `${Math.round(results.sadness)}%`;
    document.getElementById('angerScore').textContent = `${Math.round(results.anger)}%`;
    document.getElementById('fearScore').textContent = `${Math.round(results.fear)}%`;

    document.getElementById('analysisResults').style.display = 'block';
    updateEmotionChart(results);
}

// Duygu grafiğini güncelleme
function updateEmotionChart(results) {
    if (emotionChart) {
        emotionChart.destroy();
    }

    const ctx = document.getElementById('emotionChart').getContext('2d');
    emotionChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Mutluluk', 'Üzüntü', 'Öfke', 'Korku'],
            datasets: [{
                label: 'Duygu Analizi',
                data: [
                    results.happiness,
                    results.sadness,
                    results.anger,
                    results.fear
                ],
                backgroundColor: 'rgba(74, 144, 226, 0.2)',
                borderColor: 'rgba(74, 144, 226, 1)',
                pointBackgroundColor: 'rgba(74, 144, 226, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(74, 144, 226, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Hızlı duygu ekleme
function addQuickEmotion(emotion) {
    const emotions = {
        happy: { text: 'Mutlu', icon: 'fa-smile', color: '#50c878' },
        sad: { text: 'Üzgün', icon: 'fa-sad-tear', color: '#4a90e2' },
        angry: { text: 'Öfkeli', icon: 'fa-angry', color: '#e74c3c' },
        fear: { text: 'Korkmuş', icon: 'fa-fear', color: '#f1c40f' }
    };

    const emotionData = emotions[emotion];
    if (!emotionData) return;

    const emotionEntry = {
        type: emotion,
        text: emotionData.text,
        icon: emotionData.icon,
        color: emotionData.color,
        timestamp: new Date()
    };

    emotions.push(emotionEntry);
    updateEmotionTimeline();
    showSuccess(`${emotionData.text} olarak işaretlendi`);
}

// Duygu zaman çizelgesini güncelleme
function updateEmotionTimeline() {
    const timeline = document.querySelector('.emotion-timeline');
    timeline.innerHTML = '';

    emotions.slice().reverse().forEach(emotion => {
        const entry = document.createElement('div');
        entry.className = 'timeline-entry';
        entry.innerHTML = `
            <div class="timeline-icon" style="background-color: ${emotion.color}">
                <i class="fas ${emotion.icon}"></i>
            </div>
            <div class="timeline-content">
                <h4>${emotion.text}</h4>
                <p>${emotion.timestamp.toLocaleString()}</p>
            </div>
        `;
        timeline.appendChild(entry);
    });
}

// Günlük geçmişini güncelleme
function updateJournalHistory() {
    const history = document.querySelector('.journal-history');
    history.innerHTML = '';

    journalEntries.slice().reverse().forEach(entry => {
        const journalEntry = document.createElement('div');
        journalEntry.className = 'journal-entry-item';
        journalEntry.innerHTML = `
            <div class="journal-entry-header">
                <h4>${entry.timestamp.toLocaleDateString()}</h4>
                <span>${entry.timestamp.toLocaleTimeString()}</span>
            </div>
            <p>${entry.text}</p>
        `;
        history.appendChild(journalEntry);
    });
}

// Kullanıcı bilgilerini güncelleme
function updateUserInfo(user) {
    document.getElementById('userName').textContent = user.name;
    currentUser = user;
}

// Sayfa bölümlerini gösterme
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        }
    });
}

// Uygulama container'ını gösterme
function showAppContainer() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('appContainer').style.display = 'flex';
    showSection('dashboard');
    updateMotivationQuote();
}

// Landing page'i gösterme
function showLandingPage() {
    document.getElementById('landingPage').style.display = 'block';
    document.getElementById('appContainer').style.display = 'none';
}

// Motivasyon sözünü güncelleme
function updateMotivationQuote() {
    const quote = motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
    document.getElementById('motivationQuote').textContent = quote;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        showAppContainer();
        updateUserInfo(JSON.parse(user));
    } else {
        showLandingPage();
    }

    // Tarih gösterimi
    const currentDate = new Date().toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = currentDate;

    // Menü işlemleri
    menuItems.forEach(item => {
        if (item.id === 'logoutBtn') {
            item.addEventListener('click', logout);
        } else {
            item.addEventListener('click', () => {
                showSection(item.dataset.section);
            });
        }
    });
});

// Logout function
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload();
}