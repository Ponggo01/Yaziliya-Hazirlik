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
        about.className = "about-link"; // CSS'de border-top var
        sidebar.appendChild(about);

        // 3. Soru - Cevap Linki (YENİ EKLENDİ)
        const forum = document.createElement('a');
        forum.href = "soru.html";
        forum.innerHTML = '<span style="font-size: 0.9em;">💬 Soru - Cevap</span>';
        forum.style.color = "#3498db"; // Dikkat çekmesi için hafif mavi
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
    }

    const updatesDiv = document.getElementById('recent-updates');
    if (updatesDiv) showRecentUpdates();
});

// =======================
// RECENT UPDATES
// =======================
async function showRecentUpdates() {
    const container = document.getElementById('recent-updates');
    container.innerHTML = '<p>Güncellemeler taranıyor...</p>';

    let allFiles = [];

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
                            allFiles.push({
                                ...d,
                                sinifAd: sinif.ad,
                                dersAd: ders.ad,
                                rawDate: new Date(d.tarih)
                            });
                        });
                    } catch {}
                }));
            } catch {}
        }));

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
