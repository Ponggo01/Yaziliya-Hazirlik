// =======================
// FIREBASE IMPORTLARI
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, limit, where, getDocs, serverTimestamp, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// =======================
// KİMLİK & GÜVENLİK
// =======================
let currentUserAuthId = null;
let localAnonymousId = localStorage.getItem('localAnonId');

if (!localAnonymousId) {
    localAnonymousId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('localAnonId', localAnonymousId);
}

signInAnonymously(auth).catch((error) => console.error("Giriş Hatası:", error));

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserAuthId = user.uid;
        loadQuestions();
    }
});

// =======================
// YARDIMCI FONKSİYONLAR
// =======================
window.openModal = (id) => document.getElementById(id).style.display = "flex";
window.closeModal = (id) => document.getElementById(id).style.display = "none";

// Dosya Adı Gösterimi
['q-image', 'a-image'].forEach(id => {
    const el = document.getElementById(id);
    if(el) {
        el.addEventListener('change', function() {
            const targetId = id === 'q-image' ? 'q-file-name' : 'a-file-name';
            document.getElementById(targetId).innerText = this.files[0] ? this.files[0].name : '';
        });
    }
});

window.expandImage = (url) => {
    document.getElementById('fullImage').src = url;
    document.getElementById('imageModal').style.display = "flex";
};

// Resim Sıkıştırma
function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
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
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
        };
        reader.onerror = (error) => reject(error);
    });
}

// =======================
// BAN KONTROL SİSTEMİ
// =======================
async function checkBanStatus() {
    try {
        // Eğer veritabanı kuralları izin vermezse burası hata fırlatabilir.
        // Hata fırlatırsa "catch" bloğuna düşeriz, kullanıcıyı engellemeyiz (backend zaten engeller).
        const banRef = doc(db, "banned_ids", localAnonymousId);
        const banSnap = await getDoc(banRef);

        if (banSnap.exists()) {
            const data = banSnap.data();
            if(data.expiresAt) {
               const now = new Date();
               const expires = data.expiresAt.toDate(); 
               if (expires > now) return true; // Ban devam ediyor
               return false; // Ban süresi dolmuş
            }
            return true; // Süresiz ban
        }
        return false; // Temiz
    } catch (e) {
        // İzin hataları veya bağlantı hataları buraya düşer.
        // Kullanıcı deneyimini bozmamak için 'false' dönüyoruz.
        // Asıl güvenlik Firestore Rules tarafındadır.
        console.warn("Ban kontrolü yapılamadı (Bu bir hata değil, yetki kısıtlaması olabilir):", e.code);
        return false; 
    }
}

// =======================
// SORU İŞLEMLERİ
// =======================

window.resetAndOpenQuestionModal = () => {
    document.getElementById('questionForm').reset();
    document.getElementById('edit-q-id').value = "";
    document.getElementById('q-file-name').innerText = "";
    document.getElementById('q-modal-title').innerText = "Yeni Soru Sor";
    document.getElementById('q-submit-btn').innerText = "Gönder";
    document.getElementById('q-img-action-text').innerText = "Ekle";
    document.getElementById('q-ban-msg').style.display = "none";
    openModal('questionModal');
};

window.editQuestion = async (id, text, imageUrl) => {
    document.getElementById('edit-q-id').value = id;
    document.getElementById('q-text').value = text;
    document.getElementById('q-file-name').innerText = imageUrl ? "(Mevcut resim korunacak)" : "";
    document.getElementById('q-modal-title').innerText = "Soruyu Düzenle";
    document.getElementById('q-submit-btn').innerText = "Güncelle";
    document.getElementById('q-img-action-text').innerText = "Değiştir";
    document.getElementById('q-ban-msg').style.display = "none";
    openModal('questionModal');
};

const qForm = document.getElementById('questionForm');
if(qForm) {
    qForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const isBanned = await checkBanStatus();
        if (isBanned) {
            document.getElementById('q-ban-msg').style.display = "block";
            return;
        }

        const editId = document.getElementById('edit-q-id').value;
        const text = document.getElementById('q-text').value.trim();
        const file = document.getElementById('q-image').files[0];
        const btn = document.getElementById('q-submit-btn');

        if (!text && !file && !editId) return alert("İçerik giriniz.");

        try {
            btn.disabled = true;
            btn.innerText = "İşleniyor...";
            
            let imageUrl = null;
            if (file) {
                if (file.size > 10 * 1024 * 1024) throw new Error("Dosya > 10MB");
                imageUrl = await compressImage(file);
            }

            if (editId) {
                const updateData = { text: text };
                if (imageUrl) updateData.imageUrl = imageUrl;
                await updateDoc(doc(db, "questions", editId), updateData);
            } else {
                await addDoc(collection(db, "questions"), {
                    anonymousUserId: localAnonymousId,
                    authId: currentUserAuthId,
                    text: text,
                    imageUrl: imageUrl || "",
                    createdAt: serverTimestamp()
                });
            }

            closeModal('questionModal');
            e.target.reset();

        } catch (error) {
            console.error(error);
            alert("Hata: " + error.message);
        } finally {
            btn.disabled = false;
        }
    });
}

// =======================
// LİSTELEME (DÜZELTİLDİ: YAZI ÜSTTE, RESİM ALTTA)
// =======================
function loadQuestions() {
    const container = document.getElementById('questions-container');
    if(!container) return;

    const qQuery = query(collection(db, "questions"), orderBy("createdAt", "desc"), limit(20));

    onSnapshot(qQuery, (snapshot) => {
        container.innerHTML = "";
        
        if(snapshot.empty) {
            container.innerHTML = "<p style='text-align:center;'>Henüz soru yok.</p>";
            return;
        }

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const date = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString('tr-TR') : '...';
            const isMyQuestion = data.anonymousUserId === localAnonymousId;
            
            const safeText = data.text.replace(/"/g, '&quot;');
            const safeImg = data.imageUrl ? data.imageUrl : '';

            // Düzenle butonu
            const editBtn = isMyQuestion 
                ? `<button class="edit-btn" onclick="editQuestion('${docSnap.id}', '${safeText.replace(/'/g, "\\'")}', '${safeImg ? 'VAR' : ''}')"><i class="fa-solid fa-pen"></i></button>` 
                : '';

            const div = document.createElement('div');
            div.className = "question-card";
            div.id = `card-${docSnap.id}`;
            
            // --- GÖRÜNÜM DÜZENİ BURADA BELİRLENİYOR ---
            let contentHtml = "";
            
            // 1. ÖNCE YAZI
            if (data.text) {
                contentHtml += `<div class="text-content">${data.text}</div>`;
            }

            // 2. SONRA RESİM
            if (data.imageUrl) {
                contentHtml += `<div class="image-container">
                                    <img src="${data.imageUrl}" class="post-image" onclick="expandImage('${data.imageUrl}')">
                                </div>`;
            }
            
            div.innerHTML = `
                <div class="question-header">
                    <span>
                        ${isMyQuestion ? '<span class="user-badge">Sen</span>' : 'Anonim'} 
                        ${editBtn}
                    </span>
                    <span>${date}</span>
                </div>
                
                <div class="question-body">
                    ${contentHtml}
                </div>
                
                <div class="answers-container">
                    <button class="toggle-answers-btn" onclick="toggleAnswers('${docSnap.id}')" id="btn-show-${docSnap.id}">
                        <i class="fa-solid fa-chevron-down"></i> Cevapları Göster
                    </button>
                    
                    <div class="answers-section" id="answers-${docSnap.id}">
                        </div>
                </div>

                <div class="question-footer">
                    <button class="reply-btn" onclick="prepareReply('${docSnap.id}')">
                        <i class="fa-solid fa-reply"></i> Cevap Yaz
                    </button>
                    ${isMyQuestion ? '<small style="color:#e74c3c">Kendi soruna cevap veremezsin</small>' : ''}
                </div>
            `;
            container.appendChild(div);
        });
    });
}

// =======================
// CEVAPLARI GÖSTER / GİZLE
// =======================
window.toggleAnswers = (questionId) => {
    const section = document.getElementById(`answers-${questionId}`);
    const btn = document.getElementById(`btn-show-${questionId}`);
    const icon = btn.querySelector('i');

    if (section.classList.contains('active')) {
        section.classList.remove('active');
        icon.className = "fa-solid fa-chevron-down";
        btn.innerHTML = `<i class="fa-solid fa-chevron-down"></i> Cevapları Göster`;
    } else {
        section.classList.add('active');
        icon.className = "fa-solid fa-chevron-up";
        btn.innerHTML = `<i class="fa-solid fa-chevron-up"></i> Cevapları Gizle`;
        
        if(section.innerHTML.trim() === "" || section.innerHTML.includes("Yükleniyor")) {
            loadAnswers(questionId);
        }
    }
};

function loadAnswers(questionId) {
    const ansContainer = document.getElementById(`answers-${questionId}`);
    ansContainer.innerHTML = "<small>Yükleniyor...</small>";

    const qQuery = query(collection(db, "answers"), where("questionId", "==", questionId), orderBy("createdAt", "asc"));

    onSnapshot(qQuery, (snapshot) => {
        if(snapshot.empty) {
            ansContainer.innerHTML = "<small style='display:block; margin:10px 0;'>Henüz cevap yok.</small>";
            return;
        }

        let html = "";
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const isMe = data.anonymousUserId === localAnonymousId;
            const safeText = data.text.replace(/"/g, '&quot;');
            const safeImg = data.imageUrl ? 'VAR' : '';

            const editBtn = isMe 
                ? `<button class="edit-btn" onclick="editAnswer('${docSnap.id}', '${safeText.replace(/'/g, "\\'")}', '${safeImg}')"><i class="fa-solid fa-pen"></i></button>` 
                : '';

            const imgHtml = data.imageUrl ? `<br><img src="${data.imageUrl}" style="max-height:100px; border-radius:4px; margin-top:5px; cursor:pointer;" onclick="expandImage('${data.imageUrl}')">` : '';
            
            html += `
            <div class="answer-item" style="${isMe ? 'border-left: 3px solid var(--primary-color);' : ''}">
                <div style="font-size:0.8rem; color:#7f8c8d; margin-bottom:4px; display:flex; justify-content:space-between;">
                    <span>${isMe ? '<b>Sen</b>' : 'Birisi'}</span>
                    <span>
                         ${data.createdAt ? new Date(data.createdAt.seconds*1000).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'}) : ''}
                         ${editBtn}
                    </span>
                </div>
                <div>${data.text} ${imgHtml}</div>
            </div>`;
        });
        ansContainer.innerHTML = html;
    });
}

// =======================
// CEVAP EKLEME & DÜZENLEME
// =======================
window.prepareReply = async (questionId) => {
    const card = document.getElementById(`card-${questionId}`);
    const userBadge = card.querySelector('.user-badge');
    if(userBadge && userBadge.innerText === 'Sen') return alert("Kendi sorunuza cevap veremezsiniz.");

    document.getElementById('answerForm').reset();
    document.getElementById('currentQuestionId').value = questionId;
    document.getElementById('edit-a-id').value = "";
    document.getElementById('a-modal-title').innerText = "Cevap Yaz";
    document.getElementById('a-submit-btn').innerText = "Cevabı Gönder";
    document.getElementById('a-file-name').innerText = "";
    document.getElementById('a-ban-msg').style.display = "none";

    openModal('answerModal');
};

window.editAnswer = (ansId, text, hasImg) => {
    document.getElementById('edit-a-id').value = ansId;
    document.getElementById('a-text').value = text;
    document.getElementById('a-file-name').innerText = hasImg ? "(Mevcut resim korunacak)" : "";
    document.getElementById('a-modal-title').innerText = "Cevabı Düzenle";
    document.getElementById('a-submit-btn').innerText = "Güncelle";
    document.getElementById('a-ban-msg').style.display = "none";
    
    openModal('answerModal');
};

const aForm = document.getElementById('answerForm');
if(aForm) {
    aForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const isBanned = await checkBanStatus();
        if (isBanned) {
            document.getElementById('a-ban-msg').style.display = "block";
            return;
        }

        const editId = document.getElementById('edit-a-id').value;
        const questionId = document.getElementById('currentQuestionId').value;
        const text = document.getElementById('a-text').value.trim();
        const file = document.getElementById('a-image').files[0];
        const btn = document.getElementById('a-submit-btn');

        if (!text && !file && !editId) return alert("Boş içerik gönderilemez.");

        try {
            btn.disabled = true;
            btn.innerText = "İşleniyor...";
            
            let imageUrl = null;
            if (file) imageUrl = await compressImage(file);

            if (editId) {
                const updateData = { text: text };
                if(imageUrl) updateData.imageUrl = imageUrl;
                await updateDoc(doc(db, "answers", editId), updateData);
            } else {
                await addDoc(collection(db, "answers"), {
                    questionId: questionId,
                    anonymousUserId: localAnonymousId,
                    authId: currentUserAuthId,
                    text: text,
                    imageUrl: imageUrl || "",
                    createdAt: serverTimestamp()
                });
                
                const section = document.getElementById(`answers-${questionId}`);
                if (!section.classList.contains('active')) {
                     window.toggleAnswers(questionId);
                }
            }

            closeModal('answerModal');
            e.target.reset();

        } catch (error) {
            console.error(error);
            alert("Hata: " + error.message);
        } finally {
            btn.disabled = false;
        }
    });
}