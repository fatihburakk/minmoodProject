
# MindMood Web (Fullstack)

**MindMood**, kullanıcıların günlük zihinsel durumlarını ve duygularını analiz etmesini sağlayan modern bir web uygulamasıdır. Bu proje hem bir backend (`server`) hem de bir frontend (`client`) içerir.

---

## 🚀 Özellikler

- Kullanıcı dostu ve sezgisel React tabanlı web arayüzü
- Supabase ve HuggingFace API entegrasyonu
- Duygu analizi özelliği: Yazdığınız metinlere göre duygularınızı analiz eder
- Backend sunucusu: Express tabanlı REST API

---

## 📦 Başlangıç

Projeyi başlatmak için aşağıdaki adımları izleyin:

### 1️⃣ Depoyu Klonlayın

```bash
git clone https://github.com/fatihburakk/minmoodProjectWeb.git
cd minmoodProjectWeb
```

### 2️⃣ Bağımlılıkları Yükleyin

npm install

```

### 3️⃣ Ortam Değişkenlerini Ayarlayın

- `server/.env` veya `server/my.env`
- `client/.env` veya `client/my.env`

Bu dosyalara kendi Supabase ve HuggingFace API anahtarlarınızı ekleyin:

```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
HUGGINGFACE_API_KEY=...
```

> ❗ **Güvenlik Uyarısı:** Ortam dosyalarınızın `.gitignore` içinde listelendiğinden emin olun!

---

## 🏁 Projeyi Çalıştırma

1️⃣ **Backend’i Başlat:**
```bash
cd server
npm start
```

2️⃣ **Frontend’i Başlat:**
```bash
cd ../client
npm start
```

---

## 💻 Kullanılan Teknolojiler

- **React** (Client) – Kullanıcı arayüzü geliştirme
- **Express (Node.js)** (Server) – REST API sunucusu
- **PostgreSQL** – Veritabanı
- **Supabase** – Gerçek zamanlı veritabanı ve kullanıcı yönetimi
- **HuggingFace API** – Duygu analizi için

---

## 🙌 Katkı Sağlama

Projeye katkıda bulunmak isterseniz:

1. Fork oluşturun.
2. Yeni bir branch açın (`git checkout -b yeni-özellik`).
3. Değişikliklerinizi kaydedin (`git commit -m 'feat: yeni özellik'`).
4. Branch’i push’layın (`git push origin yeni-özellik`).
5. Bir Pull Request oluşturun.

---



**Keyifli kodlamalar! 🚀**
