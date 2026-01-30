# 📚 Piri Reis Anadolu Lisesi - Yazılıya Hazırlık Portalı

[![Deploy to GitHub Pages](https://github.com/Ponggo01/Yaziliya-Hazirlik/actions/workflows/deploy.yml/badge.svg)](https://github.com/Ponggo01/Yaziliya-Hazirlik/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Piri Reis Anadolu Lisesi öğrencileri için geliştirilmiş, modern ve kullanıcı dostu bir yazılı sınav hazırlık platformu. Öğrencilerin ders notlarına, sınav sorularına ve çalışma materyallerine kolayca erişmesini sağlar.

## 🌟 Özellikler

### 📱 Kullanıcı Arayüzü
- **Responsive Tasarım**: Mobil, tablet ve masaüstü cihazlarda mükemmel görünüm
- **Dark/Light Mode**: Göz yorgunluğunu azaltan tema değiştirme
- **Dinamik Sidebar**: Kolay navigasyon için hamburger menü
- **Modern UI/UX**: Temiz ve sezgisel arayüz tasarımı

### 📖 İçerik Yönetimi
- **JSON Tabanlı Sistem**: Veritabanı olmadan kolay içerik yönetimi
- **Sınıf Bazlı Organizasyon**: 9, 10, 11 ve 12. sınıflar için ayrı içerik
- **Ders Kategorileri**: Her sınıf için tüm dersler organize edilmiş
- **Dinamik Güncelleme**: JSON dosyalarındaki değişiklikler anında yansır

### 💬 Soru-Cevap Sistemi
- **Firebase Entegrasyonu**: Gerçek zamanlı soru-cevap forumu
- **Anonim Kullanıcı Sistemi**: Gizlilik odaklı paylaşım
- **Resim Desteği**: Görsel içerik yükleme ve sıkıştırma
- **Düzenleme Yetkisi**: Kullanıcılar kendi içeriklerini düzenleyebilir
- **Ban Sistemi**: Yöneticiler için kullanıcı engelleme mekanizması

### 📥 Dosya Yönetimi
- **Çoklu Format Desteği**: PDF, DOC, DOCX, JPEG ve daha fazlası
- **Otomatik Sıralama**: En yeni dosyalar önce gösterilir
- **Harici Link Desteği**: Drive, OneDrive gibi harici bağlantılar
- **İndirme Takibi**: Öğretmen ve tarih bilgisi etiketleme

### 🚀 Performans
- **GitHub Pages Hosting**: Ücretsiz ve hızlı barındırma
- **Cache Control**: Hızlı yükleme için önbellekleme
- **Otomatik Deploy**: GitHub Actions ile otomatik yayınlama
- **Resim Optimizasyonu**: Otomatik resim sıkıştırma (800px, %70 kalite)

## 🛠️ Teknoloji Yığını

### Frontend
- **HTML5**: Semantik ve erişilebilir yapı
- **CSS3**: Modern ve responsive tasarım
  - CSS Variables (Dark/Light Mode)
  - Flexbox & Grid Layout
  - Smooth Animations
- **Vanilla JavaScript (ES6+)**: 
  - Async/Await
  - Fetch API
  - LocalStorage
  - Module Pattern

### Backend & Veritabanı
- **Firebase v9**:
  - Firestore (NoSQL Database)
  - Firebase Authentication (Anonymous)
  - Firebase Analytics
  - Real-time Listeners
- **JSON Files**: Statik içerik yönetimi

### DevOps & Deployment
- **GitHub Pages**: Static site hosting
- **GitHub Actions**: CI/CD pipeline
- **Version Control**: Git

## 📁 Proje Yapısı

```
Yaziliya-Hazirlik-main/
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment config
│
├── data/                       # JSON veri dosyaları
│   ├── siniflar.json          # Sınıf listesi
│   ├── 9/                     # 9. Sınıf
│   │   ├── dersler.json       # Ders listesi
│   │   ├── mat9.json          # Matematik içeriği
│   │   └── ...                # Diğer dersler
│   ├── 10/                    # 10. Sınıf
│   │   ├── dersler.json
│   │   ├── kim10.json
│   │   ├── ing10.json
│   │   ├── alm10.json
│   │   └── ...
│   ├── 11/                    # 11. Sınıf
│   └── 12/                    # 12. Sınıf
│
├── dosyalar/                  # Yüklenmiş dosyalar
│   ├── 9/
│   ├── 10/
│   │   ├── Adabımuaseret.doc
│   │   ├── alm1.jpeg
│   │   ├── bilgisarmalkimya.pdf
│   │   └── ...
│   ├── 11/
│   └── 12/
│
├── index.html                 # Ana sayfa
├── sinif.html                 # Sınıf seçim sayfası
├── ders.html                  # Ders içeriği sayfası
├── soru.html                  # Soru-cevap forumu
├── hakkimizda.html           # Hakkımızda sayfası
│
├── script.js                  # Ana JavaScript dosyası
├── forum.js                   # Forum modülü (Firebase)
├── style.css                  # Ana stil dosyası
│
├── gelistirici.md            # İçerik yönetim rehberi
├── README.md                  # Bu dosya
├── LICENSE                    # MIT Lisansı
└── okulfoto.jpeg             # Site görseli
```

## 🚀 Kurulum ve Başlangıç

### Gereksinimler
- Modern bir web tarayıcı (Chrome, Firefox, Safari, Edge)
- Git (opsiyonel, kaynak kodunu indirmek için)
- Metin editörü (VS Code, Sublime Text, vb.)

### Yerel Geliştirme

1. **Projeyi Klonlayın**
```bash
git clone https://github.com/Ponggo01/Yaziliya-Hazirlik.git
cd Yaziliya-Hazirlik
```

2. **Yerel Sunucu Başlatın**

Python kullanarak:
```bash
python -m http.server 8000
```

Node.js ile (http-server):
```bash
npx http-server -p 8000
```

VS Code Live Server eklentisi:
- VS Code'da projeyi açın
- Sağ tıklayın ve "Open with Live Server" seçin

3. **Tarayıcıda Açın**
```
http://localhost:8000
```

### GitHub Pages ile Yayınlama

1. **Repository Ayarları**
   - GitHub'da repository'nizi açın
   - Settings > Pages bölümüne gidin
   - Source: "GitHub Actions" seçin

2. **Otomatik Deploy**
   - `main` dalına push yaptığınızda otomatik olarak deploy edilir
   - `.github/workflows/deploy.yml` dosyası deploy işlemini yönetir

3. **Site URL'si**
   - Site `https://[kullaniciadi].github.io/[repo-adi]/` adresinde yayınlanır

## 📝 İçerik Yönetimi

### JSON Yapısı

#### 1. Sınıf Listesi (`data/siniflar.json`)
```json
{
  "siniflar": [
    { "id": "9", "ad": "9. Sınıf" },
    { "id": "10", "ad": "10. Sınıf" },
    { "id": "11", "ad": "11. Sınıf" },
    { "id": "12", "ad": "12. Sınıf" }
  ]
}
```

#### 2. Ders Listesi (`data/10/dersler.json`)
```json
{
  "sinif_ad": "10. Sınıf",
  "dersler": [
    {
      "ad": "Türk Dili ve Edebiyatı",
      "id": "tde10",
      "aciklama": "Türk Dili ve Edebiyatı notları"
    },
    {
      "ad": "Matematik",
      "id": "mat10",
      "aciklama": "Matematik çalışma soruları"
    },
    {
      "ad": "Kimya",
      "id": "kim10",
      "aciklama": "Kimya yazılı hazırlık"
    }
  ]
}
```

#### 3. Ders İçeriği (`data/10/kim10.json`)
```json
{
  "ders_ad": "Kimya",
  "sinif": "10",
  "dosyalar": [
    {
      "ad": "Kimya 1. Dönem 2. Yazılı",
      "ogretmen": "Bülent Hepsağ",
      "dosya": "dosyalar/10/bilgisarmalkimya.pdf",
      "tarih": "2026-01-14"
    },
    {
      "ad": "Periyodik Tablo Özet",
      "ogretmen": "Bülent Hepsağ",
      "dosya": "https://drive.google.com/file/d/...",
      "tarih": "2026-01-10"
    }
  ]
}
```

### Yeni İçerik Ekleme

#### Yeni Ders Eklemek
1. İlgili sınıfın `dersler.json` dosyasını açın
2. Yeni ders objesini ekleyin:
```json
{
  "ad": "Ders Adı",
  "id": "dersid",
  "aciklama": "Ders açıklaması"
}
```
3. Aynı klasörde `dersid.json` dosyası oluşturun

#### Yeni Dosya Eklemek
1. İlgili ders JSON dosyasını açın
2. `dosyalar` dizisine yeni obje ekleyin:
```json
{
  "ad": "Dosya Başlığı",
  "ogretmen": "Öğretmen Adı",
  "dosya": "dosyalar/10/dosya.pdf",
  "tarih": "2026-01-30"
}
```

#### Harici Link Eklemek
```json
{
  "ad": "Google Drive Dosyası",
  "ogretmen": "Öğretmen Adı",
  "dosya": "https://drive.google.com/file/d/xxxxx",
  "tarih": "2026-01-30"
}
```

### İçerik Yönetim Kuralları

✅ **Yapılması Gerekenler:**
- ID alanlarında küçük harf ve İngilizce karakterler kullanın
- Tarih formatını `YYYY-MM-DD` olarak tutun
- JSON syntax'ını kontrol edin (son elemandan sonra virgül yok)
- Dosya adlarını anlamlı tutun

❌ **Yapılmaması Gerekenler:**
- ID'lerde Türkçe karakter kullanmayın (ı, ş, ğ, ö, ü, ç)
- JSON dosyalarında syntax hatası bırakmayın
- Aynı ID'yi birden fazla yerde kullanmayın
- Dosya yollarını yanlış yazmayın

### Firebase Configuration

`forum.js` dosyasındaki Firebase yapılandırması:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};
```

⚠️ **Güvenlik Notu**: Firebase config bilgileri public'tir ve sorun değildir. Asıl güvenlik Firestore Security Rules ile sağlanır.

## 🎨 Tema Sistemi

### CSS Variables

Tema değişkenleri `:root` ve `body.dark-mode` ile tanımlanmıştır:

```css
:root {
    --bg-color: #f8f9fa;
    --text-color: #333;
    --header-bg: #2c3e50;
    --sidebar-bg: #1a252f;
    --card-bg: white;
    --border-color: #eee;
    --primary-color: #3498db;
    --success-color: #27ae60;
    --shadow: rgba(0,0,0,0.1);
}

body.dark-mode {
    --bg-color: #1a1a1a;
    --text-color: #e0e0e0;
    --header-bg: #0d1117;
    --sidebar-bg: #010409;
    --card-bg: #161b22;
    --border-color: #30363d;
    --primary-color: #58a6ff;
    --success-color: #3fb950;
    --shadow: rgba(0,0,0,0.4);
}
```

### Tema Değiştirme

JavaScript ile tema yönetimi:

```javascript
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        icon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        icon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-icon').textContent = '☀️';
    }
}
```

## 🔌 API Referansı

### Script.js Functions

#### Tema İşlemleri
```javascript
toggleTheme()           // Temayı değiştirir
loadTheme()            // Kaydedilmiş temayı yükler
```

#### Sidebar İşlemleri
```javascript
openNav()              // Sidebar'ı açar
closeNav()             // Sidebar'ı kapatır
fetchSidebarData()     // Sınıf listesini yükler
```

#### Sayfa Render Fonksiyonları
```javascript
renderSinifPage()      // Sınıf derslerini gösterir
renderDersPage()       // Ders dosyalarını gösterir
showRecentUpdates()    // Son eklenen dosyaları listeler
```

#### Yardımcı Fonksiyonlar
```javascript
createDownloadButton(path)  // İndirme/link butonu oluşturur
```

### Forum.js Functions

#### Modal İşlemleri
```javascript
openModal(id)          // Modal açar
closeModal(id)         // Modal kapatır
expandImage(url)       // Resmi tam ekran gösterir
```

#### Soru İşlemleri
```javascript
resetAndOpenQuestionModal()  // Yeni soru modalı
editQuestion(id, text, img)  // Soru düzenleme
loadQuestions()              // Soruları yükler
```

#### Cevap İşlemleri
```javascript
prepareReply(questionId)     // Cevap modalı açar
editAnswer(id, text, img)    // Cevap düzenleme
loadAnswers(questionId)      // Cevapları yükler
toggleAnswers(questionId)    // Cevapları göster/gizle
```

#### Yardımcı Fonksiyonlar
```javascript
compressImage(file)          // Resmi sıkıştırır (800px, %70)
checkBanStatus()             // Kullanıcı ban kontrolü
```

## 📱 Responsive Tasarım

### Breakpoint'ler

```css
/* Mobil (varsayılan) */
/* < 768px */

/* Tablet */
@media (min-width: 768px) {
    .container { max-width: 720px; }
}

/* Desktop */
@media (min-width: 992px) {
    .container { max-width: 960px; }
    .dersler-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Large Desktop */
@media (min-width: 1200px) {
    .container { max-width: 1140px; }
    .dersler-grid { grid-template-columns: repeat(3, 1fr); }
}
```

### Mobil Optimizasyonlar
- Touch-friendly butonlar (min 44x44px)
- Hamburger menü
- Responsive grid sistemi
- Viewport meta tag
- Font scaling

## 🔒 Güvenlik

### Frontend Güvenliği
- **XSS Koruması**: Kullanıcı girdilerinde HTML escape
- **HTTPS**: GitHub Pages otomatik HTTPS desteği
- **Content Security Policy**: Güvenli kaynak yükleme

### Firebase Güvenliği
- **Authentication**: Anonymous auth ile temel kimlik doğrulama
- **Firestore Rules**: Veri erişim kısıtlamaları
- **Rate Limiting**: Firebase otomatik rate limiting
- **Image Validation**: Sadece resim dosyaları kabul edilir
- **File Size Limit**: 10MB maksimum dosya boyutu

### Data Privacy
- **Anonim Kullanıcılar**: Kişisel bilgi saklanmaz
- **LocalStorage**: Sadece tema ve anonim ID
- **No Tracking**: Google Analytics hariç izleme yok

## 🐛 Hata Ayıklama

### Yaygın Sorunlar

#### 1. JSON Dosyası Yüklenmiyor
```javascript
// Hata: 404 Not Found
// Çözüm: Dosya yolu ve adını kontrol edin
fetch(`data/10/kim10.json?v=${Date.now()}`)
```

#### 2. Dark Mode Çalışmıyor
```javascript
// Sorun: LocalStorage temizlenmiş olabilir
// Çözüm: Tarayıcı cache'ini temizleyin
localStorage.clear();
location.reload();
```

#### 3. Firebase Bağlantı Hatası
```javascript
// Hata: Firebase not initialized
// Çözüm: Firebase config'i kontrol edin
console.log(firebase.apps.length); // 0 ise config sorunu var
```

#### 4. Resim Yüklenmiyor
```javascript
// Sorun: Base64 encoding hatası
// Çözüm: Resim formatını ve boyutunu kontrol edin
// Desteklenen formatlar: JPG, JPEG, PNG, GIF, WEBP
// Max boyut: 10MB (sıkıştırma sonrası ~2MB)
```

### Console Log'ları

Development için yararlı log'lar:

```javascript
// script.js içinde
console.log('Theme loaded:', localStorage.getItem('theme'));
console.log('Sidebar data:', data);

// forum.js içinde
console.log('User ID:', currentUserAuthId);
console.log('Ban status:', isBanned);
```

## 🧪 Test Etme

### Manuel Test Checklist

- [ ] Ana sayfa yükleniyor mu?
- [ ] Sidebar açılıp kapanıyor mu?
- [ ] Tema değişimi çalışıyor mu?
- [ ] Sınıf seçimi doğru yönlendiriyor mu?
- [ ] Dersler listelenip açılıyor mu?
- [ ] Dosyalar indiriliyor/açılıyor mu?
- [ ] Son eklenenler doğru sıralanıyor mu?
- [ ] Soru-cevap forumu çalışıyor mu?
- [ ] Resim yükleme çalışıyor mu?
- [ ] Mobilde responsive çalışıyor mu?

### Browser Compatibility

✅ **Desteklenen Tarayıcılar:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

⚠️ **Kısıtlı Destek:**
- Internet Explorer (desteklenmiyor)
- Opera Mini (kısıtlı)

## 📊 Performans Optimizasyonu

### Mevcut Optimizasyonlar
- ✅ CSS Minification (production)
- ✅ Image Compression (otomatik)
- ✅ Cache busting (`?v=${Date.now()}`)
- ✅ Lazy loading (Firestore real-time)
- ✅ LocalStorage caching (tema)

### İyileştirme Önerileri
- [ ] Service Worker (offline support)
- [ ] CDN kullanımı
- [ ] Image lazy loading
- [ ] Code splitting
- [ ] Gzip compression

## 🤝 Katkıda Bulunma

### Geliştirme Süreci

1. **Fork & Clone**
```bash
git clone https://github.com/YOUR_USERNAME/Yaziliya-Hazirlik.git
cd Yaziliya-Hazirlik
```

2. **Branch Oluştur**
```bash
git checkout -b feature/yeni-ozellik
```

3. **Değişiklik Yap**
- Kod standardlarına uyun
- Anlamlı commit mesajları yazın
- Test edin

4. **Commit & Push**
```bash
git add .
git commit -m "feat: yeni özellik eklendi"
git push origin feature/yeni-ozellik
```

5. **Pull Request Oluştur**
- Açıklayıcı başlık ve açıklama
- İlgili issue'ları etiketle
- Screenshot ekle (UI değişiklikleri için)

### Kod Standartları

#### JavaScript
```javascript
// Camel case kullanın
const myVariable = 'value';

// Async/await tercih edin
async function fetchData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Arrow functions
const myFunction = () => { /* ... */ };
```

#### CSS
```css
/* BEM metodolojisi */
.block__element--modifier { }

/* Anlamlı class isimleri */
.question-card { }
.answer-section { }

/* CSS variables kullanın */
color: var(--primary-color);
```

#### HTML
```html
<!-- Semantik HTML -->
<header>
<main>
<section>
<article>
<footer>

<!-- Alt text ekleyin -->
<img src="..." alt="Açıklayıcı metin">

<!-- ARIA labels -->
<button aria-label="Menüyü aç">☰</button>
```

### Commit Mesajı Formatı

```
type(scope): subject

body (opsiyonel)

footer (opsiyonel)
```

**Tipler:**
- `feat`: Yeni özellik
- `fix`: Bug düzeltme
- `docs`: Dokümantasyon
- `style`: Kod formatı (işlevselliği etkilemez)
- `refactor`: Kod düzenleme
- `test`: Test ekleme/düzeltme
- `chore`: Build, konfigürasyon vb.

**Örnekler:**
```
feat(forum): soru düzenleme özelliği eklendi
fix(theme): dark mode localStorage hatası düzeltildi
docs(readme): kurulum adımları güncellendi
```

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

```
MIT License

Copyright (c) 2025 Piri Reis Anadolu Lisesi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👥 Katkıda Bulunanlar

- **Proje Sahibi**: [Ponggo01](https://github.com/Ponggo01)
- **Okul**: Piri Reis Anadolu Lisesi
- **Yıl**: 2025-2026 Eğitim Öğretim Yılı

## 📞 İletişim

- **GitHub Issues**: [Yaziliya-Hazirlik/issues](https://github.com/Ponggo01/Yaziliya-Hazirlik/issues)
- **Email**: Okul iletişim bilgileri
- **Website**: [GitHub Pages](https://ponggo01.github.io/Yaziliya-Hazirlik/)

## 🙏 Teşekkürler

- Firebase ekibine ücretsiz backend hizmeti için
- GitHub'a ücretsiz hosting için
- Tüm açık kaynak katkıda bulunanlara
- Piri Reis Anadolu Lisesi öğretmen ve öğrencilerine

## 🗺️ Roadmap

### v1.1 (Planlanıyor)
- [ ] Kullanıcı profil sistemi
- [ ] Öğretmen paneli
- [ ] Dosya arama özelliği
- [ ] Favoriler sistemi
- [ ] Bildirim sistemi

### v1.2 (Gelecek)
- [ ] PWA desteği (offline çalışma)
- [ ] Push notifications
- [ ] Admin dashboard
- [ ] İstatistik sayfası
- [ ] Export/Import özelliği

### v2.0 (Uzun Vadeli)
- [ ] Backend API (Node.js/Express)
- [ ] Veritabanı geçişi (MongoDB)
- [ ] Kullanıcı kayıt sistemi
- [ ] Rol tabanlı yetkilendirme
- [ ] Gelişmiş raporlama

## 📚 Ek Kaynaklar

### Öğrenme Materyalleri
- [MDN Web Docs](https://developer.mozilla.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [GitHub Pages Guide](https://docs.github.com/en/pages)
- [JavaScript.info](https://javascript.info/)

### Geliştirme Araçları
- [VS Code](https://code.visualstudio.com/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/) (API testing)

### Design Resources
- [Google Fonts](https://fonts.google.com/)
- [Font Awesome](https://fontawesome.com/)
- [Coolors](https://coolors.co/) (Color palette)
- [Unsplash](https://unsplash.com/) (Free images)

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

Made with ❤️ by Piri Reis AL Students

</div>
