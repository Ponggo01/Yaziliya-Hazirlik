// --- Temel Fonksiyonlar ---
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    body.classList.toggle('dark-mode');
    
    // Tema tercihini kaydet
    if (body.classList.contains('dark-mode')) {
        if(icon) icon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        if(icon) icon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const icon = document.getElementById('theme-icon');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (icon) icon.textContent = '☀️';
    }
}

function openNav() { document.getElementById("mySidebar").style.width = "250px"; }
function closeNav() { document.getElementById("mySidebar").style.width = "0"; }

// --- Sayfa Yüklenince Çalışacak Kodlar ---
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    fetchSidebarData();
    
    // Hangi sayfadayız kontrolü
    const path = window.location.pathname;
    
    if (path.includes('sinif.html')) {
        renderSinifPage();
    } else if (path.includes('ders.html')) {
        renderDersPage();
    } 
    
    // Eğer anasayfadaysak (recent-updates div'i varsa) güncellemeleri çek
    const updatesDiv = document.getElementById('recent-updates');
    if (updatesDiv) {
        showRecentUpdates(); 
    }
});

// --- Sidebar Menüsü ---
async function fetchSidebarData() {
    try {
        const response = await fetch('data/siniflar.json');
        const data = await response.json();
        const sidebar = document.getElementById('sidebar-content');
        if (sidebar) {
            sidebar.innerHTML = '';
            data.siniflar.forEach(sinif => {
                const link = document.createElement('a');
                link.href = `sinif.html?id=${sinif.id}`;
                link.innerText = sinif.ad;
                sidebar.appendChild(link);
            });
            const about = document.createElement('a');
            about.href = "hakkimizda.html";
            about.innerText = "Hakkımızda";
            about.className = "about-link";
            sidebar.appendChild(about);
        }
    } catch (error) { console.error('Sidebar yüklenemedi:', error); }
}

// --- GÜNCELLEMELERİ DENETLEME (YENİLENMİŞ) ---
async function showRecentUpdates() {
    const container = document.getElementById('recent-updates');
    container.innerHTML = '<p>Güncellemeler taranıyor...</p>';

    let allFiles = [];

    try {
        // 1. Sınıfları Çek (9, 10, 11, 12)
        const siniflarResp = await fetch('data/siniflar.json');
        const siniflarData = await siniflarResp.json();

        // 2. Her sınıfı tek tek gez
        // Promise.all kullanarak işlemleri paralel yapıyoruz (daha hızlı çalışır)
        await Promise.all(siniflarData.siniflar.map(async (sinif) => {
            try {
                // Sınıfın ders listesini çek (Örn: data/9/dersler.json)
                const derslerResp = await fetch(`data/${sinif.id}/dersler.json`);
                if (!derslerResp.ok) return; 
                const derslerData = await derslerResp.json();

                // 3. O sınıftaki her dersi tek tek gez
                await Promise.all(derslerData.dersler.map(async (ders) => {
                    try {
                        // Dersin dosya içeriğini çek (Örn: data/9/matematik.json)
                        const dosyaResp = await fetch(`data/${sinif.id}/${ders.id}.json`);
                        if (!dosyaResp.ok) return;
                        const dosyaData = await dosyaResp.json();

                        // Dosyaları ana listeye ekle
                        dosyaData.dosyalar.forEach(d => {
                            allFiles.push({
                                ...d,
                                sinifAd: sinif.ad,     // "9. Sınıf"
                                dersAd: ders.ad,       // "Matematik"
                                rawDate: new Date(d.tarih) // Sıralama için tarih objesi
                            });
                        });
                    } catch (err) {
                        // Bir dersin json dosyası yoksa veya hatalıysa atla
                    }
                }));

            } catch (err) {
                // Sınıfın ders listesi yoksa atla
            }
        }));

        // 4. Tarihe göre yeniden eskiye sırala
        allFiles.sort((a, b) => b.rawDate - a.rawDate);

        // 5. İlk 5 tanesini al
        const recentFiles = allFiles.slice(0, 5);

        // 6. Ekrana Bas
        if (recentFiles.length === 0) {
            container.innerHTML = '<p>Henüz yüklenmiş dosya bulunmamaktadır.</p>';
            return;
        }

        let html = '<ul class="dosya-listesi">';
        recentFiles.forEach(f => {
            html += `
                <li>
                    <div class="dosya-bilgi">
                        <span class="dosya-adi">${f.ad} <small>(${f.sinifAd} - ${f.dersAd})</small></span>
                        <span class="ogretmen-adi">Hazırlayan: ${f.ogretmen} • ${f.tarih}</span>
                    </div>
                    ${createDownloadButton(f.dosya)}
                </li>`;
        });
        html += '</ul>';
        container.innerHTML = html;

    } catch (e) {
        console.error(e);
        container.innerHTML = '<p>Güncellemeler alınırken hata oluştu.</p>';
    }
}

// --- SINIF SAYFASI (Örn: 9. Sınıf Dersleri) ---
async function renderSinifPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const sinifId = urlParams.get('id');
    const container = document.getElementById('dersler-grid');
    const title = document.getElementById('sinif-baslik');

    if (!sinifId) return;

    try {
        const response = await fetch(`data/${sinifId}/dersler.json`);
        if (!response.ok) throw new Error("Veri yok");
        const data = await response.json();

        title.innerText = data.sinif_ad + " Dersleri";
        
        let html = '';
        data.dersler.forEach(ders => {
            html += `
            <a href="ders.html?sinif=${sinifId}&id=${ders.id}" class="ders-kutu">
                <h3>${ders.ad}</h3>
                <p>${ders.aciklama || 'Ders notları için tıklayın.'}</p>
                <span class="ok-isareti">➜</span>
            </a>`;
        });
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<p>Dersler yüklenirken hata oluştu.</p>';
    }
}

// --- DERS SAYFASI (Örn: 9. Sınıf -> Matematik) ---
async function renderDersPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const sinifId = urlParams.get('sinif');
    const dersId = urlParams.get('id');
    const container = document.getElementById('dosya-listesi-container');
    const title = document.getElementById('ders-baslik');

    if (!sinifId || !dersId) return;

    try {
        const response = await fetch(`data/${sinifId}/${dersId}.json`);
        if (!response.ok) throw new Error("Dosya yok");
        const data = await response.json();
        
        title.innerText = `${data.sinif}. Sınıf - ${data.ders_ad}`;

        let html = '<ul class="dosya-listesi">';
        if(data.dosyalar.length === 0) {
            html += '<p>Bu derse ait dosya bulunamadı.</p>';
        } else {
            data.dosyalar.forEach(dosya => {
                html += `
                    <li>
                        <div class="dosya-bilgi">
                            <span class="dosya-adi">${dosya.ad}</span>
                            <span class="ogretmen-adi">Hazırlayan: ${dosya.ogretmen} • ${dosya.tarih}</span>
                        </div>
                        ${createDownloadButton(dosya.dosya)}
                    </li>`;
            });
        }
        html += '</ul>';
        container.innerHTML = html;
    } catch (e) {
        title.innerText = "Ders Bulunamadı";
        container.innerHTML = `<div class="uyari">Bu dersin notları henüz sisteme yüklenmemiştir.</div>`;
    }
}

// --- Yardımcı: İndirme Butonu ---
function createDownloadButton(dosyaYolu) {
    const isExternal = dosyaYolu.startsWith('http');
    const label = isExternal ? "🔗 Git" : "⬇ İndir";
    const target = isExternal ? 'target="_blank"' : 'download';
    return `<a href="${dosyaYolu}" ${target} class="indir-buton">${label}</a>`;
}