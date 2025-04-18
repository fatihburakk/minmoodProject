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

// Form gönderimi
loginForm.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginEmail.value;
    const password = loginPassword.value;

    try {
        // Geçici olarak localStorage kullanıyoruz
        const response = {
            token: 'dummy_token',
            user: {
                name: email.split('@')[0],
                email: email
            }
        };
        
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
        // Geçici olarak localStorage kullanıyoruz
        const response = {
            token: 'dummy_token',
            user: {
                name: name,
                email: email
            }
        };
        
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
        // Geçici olarak sadece başarılı mesajı gösteriyoruz
        showSuccess('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi');
        showForm('login');
    } catch (error) {
        showError('Şifre sıfırlama işlemi sırasında bir hata oluştu');
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

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return user && token;
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload();
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
    const menuItems = document.querySelectorAll('.menu-items li');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.id === 'logoutBtn') {
                logout();
            } else {
                const section = item.dataset.section;
                showSection(section);
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });

    // Duygu analizi işlemleri
    const analyzeBtn = document.getElementById('analyzeBtn');
    const emotionText = document.getElementById('emotionText');
    const analysisResults = document.getElementById('analysisResults');
    const emotionChart = document.getElementById('emotionChart');

    analyzeBtn.addEventListener('click', () => {
        const text = emotionText.value;
        if (text.trim()) {
            // Geçici olarak rastgele sonuçlar gösteriyoruz
            const results = {
                happiness: Math.floor(Math.random() * 100),
                sadness: Math.floor(Math.random() * 100),
                anger: Math.floor(Math.random() * 100),
                fear: Math.floor(Math.random() * 100)
            };
            
            document.getElementById('happinessScore').textContent = `${results.happiness}%`;
            document.getElementById('sadnessScore').textContent = `${results.sadness}%`;
            document.getElementById('angerScore').textContent = `${results.anger}%`;
            document.getElementById('fearScore').textContent = `${results.fear}%`;

            // Grafik güncelleme
            updateChart(results);
            analysisResults.style.display = 'block';
        } else {
            showError('Lütfen bir metin girin');
        }
    });

    // Hızlı duygu girişi
    const emotionButtons = document.querySelectorAll('.emotion-btn');
    emotionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const emotion = button.dataset.emotion;
            const emotions = {
                happy: 'Mutlu',
                sad: 'Üzgün',
                angry: 'Kızgın',
                fear: 'Korku'
            };
            emotionText.value = `Bugün ${emotions[emotion]} hissediyorum.`;
            analyzeBtn.click();
        });
    });

    // Günlük kaydetme
    const saveJournalBtn = document.querySelector('.save-journal-btn');
    const journalText = document.getElementById('journalText');
    const journalHistory = document.getElementById('journalHistory');

    saveJournalBtn.addEventListener('click', () => {
        const text = journalText.value;
        if (text.trim()) {
            const date = new Date().toLocaleDateString('tr-TR');
            const entry = document.createElement('div');
            entry.className = 'journal-entry';
            entry.innerHTML = `
                <h3>${date}</h3>
                <p>${text}</p>
            `;
            journalHistory.insertBefore(entry, journalHistory.firstChild);
            journalText.value = '';
            showSuccess('Günlük kaydedildi');
        } else {
            showError('Lütfen bir metin girin');
        }
    });

    // Ayarları kaydetme
    const saveSettingsBtn = document.querySelector('.save-settings-btn');
    const userNameInput = document.getElementById('userNameInput');
    const userEmailInput = document.getElementById('userEmailInput');
    const dailyReminder = document.getElementById('dailyReminder');
    const weeklyReport = document.getElementById('weeklyReport');

    saveSettingsBtn.addEventListener('click', () => {
        const settings = {
            name: userNameInput.value,
            email: userEmailInput.value,
            dailyReminder: dailyReminder.checked,
            weeklyReport: weeklyReport.checked
        };
        localStorage.setItem('settings', JSON.stringify(settings));
        showSuccess('Ayarlar kaydedildi');
    });

    // Mobil menü işlemleri
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const menuList = document.querySelector('.menu-items');

    mobileMenuToggle.addEventListener('click', () => {
        menuList.classList.toggle('active');
    });

    // Menü öğesine tıklandığında menüyü kapat
    menuList.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            menuList.classList.remove('active');
        });
    });

    // Sayfa dışına tıklandığında menüyü kapat
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.side-menu')) {
            menuList.classList.remove('active');
        }
    });
});

// Modal Functions
function showAppContainer() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('appContainer').style.display = 'flex';
}

function showLandingPage() {
    document.getElementById('landingPage').style.display = 'block';
    document.getElementById('appContainer').style.display = 'none';
}

function updateUserInfo(user) {
    document.getElementById('userName').textContent = user.name;
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

function updateChart(results) {
    const ctx = document.getElementById('emotionChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mutluluk', 'Üzüntü', 'Öfke', 'Korku'],
            datasets: [{
                label: 'Duygu Analizi Sonuçları',
                data: [results.happiness, results.sadness, results.anger, results.fear],
                backgroundColor: [
                    'rgba(108, 92, 231, 0.5)',
                    'rgba(168, 164, 230, 0.5)',
                    'rgba(0, 184, 148, 0.5)',
                    'rgba(128, 113, 86, 0.5)'
                ],
                borderColor: [
                    'rgb(108, 92, 231)',
                    'rgb(168, 164, 230)',
                    'rgb(49, 110, 98)',
                    'rgb(253, 203, 110)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}