// =======================
// FIREBASE IMPORTLARI (CDN)
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, limit, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// =======================
// FIREBASE AYARLARI
// =======================
const firebaseConfig = {
    apiKey: "AIzaSyDtDYR_lnULdYiZX_0bdEpVUHgewiaCoo4",
    authDomain: "yazilihazirlik.firebaseapp.com",
    projectId: "yazilihazirlik",
    storageBucket: "yazilihazirlik.firebasestorage.app",
    messagingSenderId: "502624255888",
    appId: "1:502624255888:web:1b4e56e20e3a288716bd15",
    measurementId: "G-7GNQWQC8TK"
};

// Uygulamayı Başlat
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Analytics servisi başlatıldı
const db = getFirestore(app);
const auth = getAuth(app);

// =======================
// KİMLİK & GÜVENLİK
// =======================
let currentUserAuthId = null;
let localAnonymousId = localStorage.getItem('localAnonId');

// Eğer tarayıcıda kayıtlı ID yoksa yeni oluştur
if (!localAnonymousId) {
    localAnonymousId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('localAnonId', localAnonymousId);
}

// Firebase'e Anonim Giriş Yap (Veritabanı yazma izni için şart)
signInAnonymously(auth).catch((error) => {
    console.error("Giriş Hatası:", error);
});

// Giriş durumunu dinle
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserAuthId = user.uid;
        console.log("Bağlantı başarılı. AuthID:", currentUserAuthId);
        loadQuestions(); // Bağlantı sağlanınca soruları çek
    }
});

// =======================
// ARAÇLAR (MODAL vb.)
// =======================
window.openModal = (id) => document.getElementById(id).style.display = "flex";
window.closeModal = (id) => document.getElementById(id).style.display = "none";

// Dosya adı gösterimi (Input değişince çalışır)
const qFileInput = document.getElementById('q-image');
if(qFileInput) {
    qFileInput.addEventListener('change', function() {
        document.getElementById('q-file-name').innerText = this.files[0] ? this.files[0].name : '';
    });
}

const aFileInput = document.getElementById('a-image');
if(aFileInput) {
    aFileInput.addEventListener('change', function() {
        document.getElementById('a-file-name').innerText = this.files[0] ? this.files[0].name : '';
    });
}

// Resmi Büyütme Fonksiyonu
window.expandImage = (url) => {
    document.getElementById('fullImage').src = url;
    document.getElementById('imageModal').style.display = "flex";
};

// =======================
// RESİM SIKIŞTIRMA (ÖNEMLİ)
// =======================
// Storage kullanmadığımız için resmi metne (Base64) çevirip küçültüyoruz.
function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                // Maksimum genişlik 800px olsun (Dosya boyutunu 1MB altında tutmak için)
                const maxWidth = 800; 
                
                let newWidth = img.width;
                let newHeight = img.height;

                if (img.width > maxWidth) {
                    const scaleSize = maxWidth / img.width;
                    newWidth = maxWidth;
                    newHeight = img.height * scaleSize;
                }

                canvas.width = newWidth;
                canvas.height = newHeight;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                // Kaliteyi %70'e düşür
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                resolve(dataUrl);
            };
        };
        reader.onerror = (error) => reject(error);
    });
}

// =======================
// SORU GÖNDERME İŞLEMİ
// =======================
const qForm = document.getElementById('questionForm');
if(qForm) {
    qForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!currentUserAuthId) return alert("Bağlantı bekleniyor... Lütfen sayfayı yenileyin.");

        const text = document.getElementById('q-text').value.trim();
        const file = document.getElementById('q-image').files[0];
        const btn = e.target.querySelector('button');

        if (!text && !file) {
            return alert("Lütfen yazı veya fotoğraf ekleyin.");
        }

        try {
            btn.disabled = true;
            btn.innerText = "Yükleniyor...";
            let imageUrl = "";

            // Resmi sıkıştır ve Base64'e çevir
            if (file) {
                if (file.size > 10 * 1024 * 1024) { // 10MB üstü tarayıcıyı dondurabilir
                    throw new Error("Dosya çok büyük. Lütfen 10MB altı bir resim seçin.");
                }
                imageUrl = await compressImage(file);
            }

            // Firestore'a kaydet
            await addDoc(collection(db, "questions"), {
                anonymousUserId: localAnonymousId,
                authId: currentUserAuthId,
                text: text,
                imageUrl: imageUrl, // Resim verisi (uzun string)
                createdAt: serverTimestamp()
            });

            // Formu Temizle
            e.target.reset();
            document.getElementById('q-file-name').innerText = "";
            closeModal('questionModal');
            // alert("Soru gönderildi!"); // Kullanıcıyı çok bölmemek için kapattım

        } catch (error) {
            console.error(error);
            if(error.code === 'resource-exhausted') {
                alert("Resim sıkıştırılmasına rağmen çok büyük geldi. Daha sade bir resim deneyin.");
            } else {
                alert("Hata oluştu: " + error.message);
            }
        } finally {
            btn.disabled = false;
            btn.innerText = "Gönder";
        }
    });
}

// =======================
// SORULARI LİSTELEME
// =======================
function loadQuestions() {
    const container = document.getElementById('questions-container');
    if(!container) return; // Eğer başka sayfadaysak hata vermesin

    // Tarihe göre sırala, en son atılan en üstte
    const qQuery = query(collection(db, "questions"), orderBy("createdAt", "desc"), limit(20));

    onSnapshot(qQuery, (snapshot) => {
        container.innerHTML = "";
        
        if(snapshot.empty) {
            container.innerHTML = "<p style='text-align:center; padding:20px;'>Henüz soru sorulmamış. İlk soruyu sen sor!</p>";
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const date = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString('tr-TR') : 'Yükleniyor...';
            const isMyQuestion = data.anonymousUserId === localAnonymousId;
            
            const div = document.createElement('div');
            div.className = "question-card";
            div.id = `card-${doc.id}`;
            
            // ImageUrl varsa resmi göster
            let imageHtml = data.imageUrl ? `<img src="${data.imageUrl}" class="post-image" onclick="expandImage('${data.imageUrl}')">` : '';
            
            div.innerHTML = `
                <div class="question-header">
                    <span>${isMyQuestion ? '<span class="user-badge">Sen</span>' : 'Anonim Öğrenci'}</span>
                    <span>${date}</span>
                </div>
                <div class="question-body">
                    ${data.text}
                    ${imageHtml}
                </div>
                <div class="answers-section" id="answers-${doc.id}">
                    <small>Cevaplar yükleniyor...</small>
                </div>
                <div class="question-footer">
                    <button class="reply-btn" onclick="prepareReply('${doc.id}')">
                        <i class="fa-solid fa-reply"></i> Cevap Yaz
                    </button>
                    ${isMyQuestion ? '<small style="color:#e74c3c">Kendi soruna cevap veremezsin</small>' : ''}
                </div>
            `;
            container.appendChild(div);

            // Bu sorunun cevaplarını yükle
            loadAnswers(doc.id);
        });
    });
}

// =======================
// CEVAP SİSTEMİ
// =======================
function loadAnswers(questionId) {
    const ansContainer = document.getElementById(`answers-${questionId}`);
    // Cevapları eskiden yeniye sırala
    const qQuery = query(collection(db, "answers"), where("questionId", "==", questionId), orderBy("createdAt", "asc"));

    onSnapshot(qQuery, (snapshot) => {
        if(snapshot.empty) {
            ansContainer.innerHTML = "<small>Henüz cevap yok.</small>";
            return;
        }

        let html = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            const isMe = data.anonymousUserId === localAnonymousId;
            const imgHtml = data.imageUrl ? `<br><img src="${data.imageUrl}" style="max-height:100px; border-radius:4px; margin-top:5px; cursor:pointer;" onclick="expandImage('${data.imageUrl}')">` : '';
            
            html += `
            <div class="answer-item" style="${isMe ? 'border-left: 3px solid var(--primary-color);' : ''}">
                <div style="font-size:0.8rem; color:#7f8c8d; margin-bottom:4px;">
                    ${isMe ? '<b>Sen</b>' : 'Birisi'} • ${data.createdAt ? new Date(data.createdAt.seconds*1000).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'}) : ''}
                </div>
                <div>${data.text} ${imgHtml}</div>
            </div>`;
        });
        ansContainer.innerHTML = html;
    });
}

// Cevap Modalını Aç
window.prepareReply = async (questionId) => {
    // 1. Kendi soruna cevap verme kontrolü
    const card = document.getElementById(`card-${questionId}`);
    const userBadge = card.querySelector('.user-badge');
    if(userBadge && userBadge.innerText === 'Sen') {
        return alert("Kendi sorunuza cevap veremezsiniz.");
    }

    // 2. Daha önce cevap verdin mi kontrolü
    const qQuery = query(
        collection(db, "answers"), 
        where("questionId", "==", questionId),
        where("anonymousUserId", "==", localAnonymousId)
    );
    
    const snapshot = await getDocs(qQuery);
    if (!snapshot.empty) {
        return alert("Bu soruya zaten bir cevap yazdınız.");
    }

    document.getElementById('currentQuestionId').value = questionId;
    openModal('answerModal');
};

// Cevap Formu Gönderimi
const aForm = document.getElementById('answerForm');
if(aForm) {
    aForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const questionId = document.getElementById('currentQuestionId').value;
        const text = document.getElementById('a-text').value.trim();
        const file = document.getElementById('a-image').files[0];
        const btn = e.target.querySelector('button');

        if (!text && !file) return alert("Boş cevap gönderilemez.");

        try {
            btn.disabled = true;
            btn.innerText = "İşleniyor...";
            let imageUrl = "";

            if (file) {
                imageUrl = await compressImage(file);
            }

            await addDoc(collection(db, "answers"), {
                questionId: questionId,
                anonymousUserId: localAnonymousId,
                authId: currentUserAuthId,
                text: text,
                imageUrl: imageUrl,
                createdAt: serverTimestamp()
            });

            e.target.reset();
            document.getElementById('a-file-name').innerText = "";
            closeModal('answerModal');

        } catch (error) {
            console.error(error);
            alert("Hata: " + error.message);
        } finally {
            btn.disabled = false;
            btn.innerText = "Cevabı Gönder";
        }
    });
}