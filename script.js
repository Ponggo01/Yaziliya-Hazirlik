// =======================
// TEMA İŞLEMLERİ
// =======================
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        if (icon) icon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        if (icon) icon.textContent = '🌙';
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

// =======================
// SIDEBAR
// =======================
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
}

async function fetchSidebarData() {
    try {
        const response = await fetch(`data/siniflar.json?v=${Date.now()}`);
        const data = await response.json();
        const sidebar = document.getElementById('sidebar-content');

        if (!sidebar) return;
        sidebar.innerHTML = '';

        // 1. Sınıfları Listele
        data.siniflar.forEach(sinif => {
            const link = document.createElement('a');
            link.href = `sinif.html?id=${sinif.id}`;
            link.innerText = sinif.ad;
            sidebar.appendChild(link);
        });

        // 2. Hakkımızda Linki
        const about = document.createElement('a');
        about.href = "hakkimizda.html";
        about.innerText = "Hakkımızda";
        about.className = "about-link"; 
        sidebar.appendChild(about);

        // 3. Soru - Cevap Linki
        const forum = document.createElement('a');
        forum.href = "soru.html";
        forum.innerHTML = '<span style="font-size: 0.9em;">💬 Soru - Cevap</span>';
        forum.style.color = "#3498db"; 
        sidebar.appendChild(forum);

    } catch (e) {
        console.error("Sidebar yüklenemedi", e);
        const sidebar = document.getElementById('sidebar-content');
        if(sidebar) sidebar.innerHTML = '<p style="color:white; padding:15px;">Menü yüklenemedi.</p>';
    }
}

// =======================
// SAYFA YÜKLENİNCE
// =======================
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    fetchSidebarData();

    const path = window.location.pathname;

    if (path.includes('sinif.html')) {
        renderSinifPage();
    } else if (path.includes('ders.html')) {
        renderDersPage();
    } else if (path.includes('index.html') || path.endsWith('/')) {
        // Sadece anasayfada çalışsın
        const updatesDiv = document.getElementById('recent-updates');
        if (updatesDiv) showRecentUpdates();
        fetchInfoPanel(); // Duyuruları ve sayacı yükle
    }
});

// =======================
// DUYURU VE SAYAÇ (YENİ)
// =======================
async function fetchInfoPanel() {
    const panel = document.getElementById('info-panel');
    const annList = document.getElementById('announcement-list');
    const countdownTitle = document.getElementById('countdown-title');
    const timerDisplay = document.getElementById('countdown-timer');

    if(!panel) return;

    try {
        // Bu dosya yoksa catch bloğuna düşer ve paneli gizler
        const resp = await fetch(`data/duyurular.json?v=${Date.now()}`);
        if(!resp.ok) return;
        
        const data = await resp.json();
        
        // Paneli görünür yap
        panel.style.display = "flex";

        // Duyurular
        annList.innerHTML = "";
        data.duyurular.forEach(d => {
            const li = document.createElement('li');
            li.innerHTML = d.link ? `<a href="${d.link}" target="_blank" style="color:var(--primary-color)">${d.text}</a>` : d.text;
            annList.appendChild(li);
        });

        // Sayaç
        if(data.sayac && data.sayac.aktif) {
            countdownTitle.innerText = data.sayac.baslik;
            const targetDate = new Date(data.sayac.tarih).getTime();

            const updateTimer = () => {
                const now = new Date().getTime();
                const distance = targetDate - now;

                if (distance < 0) {
                    timerDisplay.innerText = "Süre Doldu!";
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                
                timerDisplay.innerText = `${days} gün ${hours}sa ${minutes}dk`;
            };

            updateTimer();
            setInterval(updateTimer, 60000); // Her dakika güncelle
        } else {
            document.querySelector('.countdown-box').style.display = 'none';
        }

    } catch (e) {
        console.log("Duyuru dosyası yok veya hata:", e);
        panel.style.display = "none";
    }
}

// =======================
// GLOBAL ARAMA (YENİ)
// =======================
let searchDebounce;
async function handleSearch(query) {
    clearTimeout(searchDebounce);
    const resultContainer = document.getElementById('search-results');
    const list = document.getElementById('search-list');
    const recent = document.getElementById('recent-container');

    if (!query || query.length < 3) {
        resultContainer.style.display = 'none';
        if(recent) recent.style.display = 'block';
        return;
    }

    searchDebounce = setTimeout(async () => {
        list.innerHTML = '<li style="justify-content:center;">Aranıyor...</li>';
        resultContainer.style.display = 'block';
        if(recent) recent.style.display = 'none';

        const allFiles = await getAllFiles(); // Aşağıdaki yardımcı fonksiyon
        const lowerQ = query.toLocaleLowerCase('tr');

        const filtered = allFiles.filter(f => 
            f.ad.toLocaleLowerCase('tr').includes(lowerQ) ||
            f.dersAd.toLocaleLowerCase('tr').includes(lowerQ) ||
            f.sinifAd.toLocaleLowerCase('tr').includes(lowerQ)
        );

        list.innerHTML = '';
        if (filtered.length === 0) {
            list.innerHTML = '<li style="justify-content:center;">Sonuç bulunamadı.</li>';
            return;
        }

        filtered.forEach(f => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="dosya-bilgi">
                    <span class="dosya-adi">${f.ad} <small>(${f.sinifAd} - ${f.dersAd})</small></span>
                    <span class="ogretmen-adi">${f.ogretmen}</span>
                </div>
                ${createDownloadButton(f.dosya)}
            `;
            list.appendChild(li);
        });

    }, 500);
}

// Yardımcı: Tüm dosyaları çeker (Cache mekanizması eklenebilir)
async function getAllFiles() {
    let files = [];
    try {
        const siniflarResp = await fetch(`data/siniflar.json?v=${Date.now()}`);
        const siniflarData = await siniflarResp.json();

        await Promise.all(siniflarData.siniflar.map(async sinif => {
            try {
                const derslerResp = await fetch(`data/${sinif.id}/dersler.json?v=${Date.now()}`);
                if (!derslerResp.ok) return;
                const derslerData = await derslerResp.json();

                await Promise.all(derslerData.dersler.map(async ders => {
                    try {
                        const dosyaResp = await fetch(`data/${sinif.id}/${ders.id}.json?v=${Date.now()}`);
                        if (!dosyaResp.ok) return;
                        const dosyaData = await dosyaResp.json();

                        dosyaData.dosyalar.forEach(d => {
                            files.push({
                                ...d,
                                sinifAd: sinif.ad,
                                dersAd: ders.ad
                            });
                        });
                    } catch {}
                }));
            } catch {}
        }));
    } catch {}
    return files;
}


// =======================
// RECENT UPDATES
// =======================
async function showRecentUpdates() {
    const container = document.getElementById('recent-updates');
    container.innerHTML = '<p>Güncellemeler taranıyor...</p>';

    try {
        let allFiles = await getAllFiles(); // Yukarıdaki fonksiyonu tekrar kullan
        // Tarih formatını işle
        allFiles = allFiles.map(f => ({...f, rawDate: new Date(f.tarih)}));
        
        allFiles.sort((a, b) => b.rawDate - a.rawDate);
        const recent = allFiles.slice(0, 5);

        if (recent.length === 0) {
            container.innerHTML = '<p>Henüz dosya yok.</p>';
            return;
        }

        let html = '<ul class="dosya-listesi">';
        recent.forEach(f => {
            html += `
            <li>
                <div class="dosya-bilgi">
                    <span class="dosya-adi">${f.ad}
                        <small>(${f.sinifAd} - ${f.dersAd})</small>
                    </span>
                    <span class="ogretmen-adi">
                        Hazırlayan: ${f.ogretmen} • ${f.tarih}
                    </span>
                </div>
                ${createDownloadButton(f.dosya)}
            </li>`;
        });
        html += '</ul>';
        container.innerHTML = html;

    } catch (e) {
        console.error(e);
        container.innerHTML = '<p>Hata oluştu.</p>';
    }
}

// =======================
// SINIF SAYFASI
// =======================
async function renderSinifPage() {
    const params = new URLSearchParams(window.location.search);
    const sinifId = params.get('id');
    const container = document.getElementById('dersler-grid');
    const title = document.getElementById('sinif-baslik');

    if (!sinifId) return;

    try {
        const response = await fetch(`data/${sinifId}/dersler.json?v=${Date.now()}`);
        const data = await response.json();

        title.innerText = `${data.sinif_ad} Dersleri`;
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

    } catch {
        container.innerHTML = '<p>Dersler yüklenemedi.</p>';
    }
}

// =======================
// DERS SAYFASI (EN YENİ ÜSTTE)
// =======================
async function renderDersPage() {
    const params = new URLSearchParams(window.location.search);
    const sinifId = params.get('sinif');
    const dersId = params.get('id');
    const container = document.getElementById('dosya-listesi-container');
    const title = document.getElementById('ders-baslik');

    if (!sinifId || !dersId) return;

    try {
        const response = await fetch(`data/${sinifId}/${dersId}.json?v=${Date.now()}`);
        const data = await response.json();

        title.innerText = `${data.sinif}. Sınıf - ${data.ders_ad}`;

        // 🔥 TARİHE GÖRE SIRALA (EN YENİ EN ÜSTTE)
        data.dosyalar.sort((a, b) => new Date(b.tarih) - new Date(a.tarih));

        let html = '<ul class="dosya-listesi">';
        data.dosyalar.forEach(d => {
            html += `
            <li>
                <div class="dosya-bilgi">
                    <span class="dosya-adi">${d.ad}</span>
                    <span class="ogretmen-adi">
                        Hazırlayan: ${d.ogretmen} • ${d.tarih}
                    </span>
                </div>
                ${createDownloadButton(d.dosya)}
            </li>`;
        });
        html += '</ul>';

        container.innerHTML = html;

    } catch {
        title.innerText = "Ders Bulunamadı";
        container.innerHTML = '<div class="uyari">Not bulunamadı.</div>';
    }
}

// =======================
// İNDİR / LİNK BUTONU
// =======================
function createDownloadButton(path) {
    const isExternal = path.startsWith('http');
    const label = isExternal ? "🔗 Git" : "⬇ İndir";
    const attr = isExternal ? 'target="_blank"' : 'download';
    return `<a href="${path}" ${attr} class="indir-buton">${label}</a>`;
}