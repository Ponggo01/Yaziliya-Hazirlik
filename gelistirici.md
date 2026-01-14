# 📝 İçerik Yönetim Rehberi (JSON Tabanlı)

Bu rehber, portal üzerindeki sınıfları, dersleri ve dosyaları nasıl yöneteceğini açıklar.  
Sistem tamamen dinamiktir; JSON dosyalarında yapılan her değişiklik anında siteye yansır.

## 📂 Klasör Yapısı

```text
/data
  ├── siniflar.json
  ├── /9
  │    ├── dersler.json
  │    ├── matematik.json
  │    └── fizik.json
  ├── /10
  │    ├── dersler.json
  │    └── edebiyat.json
  └── /11
  └── /12
```

## 🧱 Sistem Mantığı

1. Sınıf → siniflar.json  
2. Ders listesi → /data/{sinif}/dersler.json  
3. Ders içeriği → /data/{sinif}/{ders}.json  

Akış: Sınıf → Ders → Dosyalar

## 1. Sınıf Listesi (siniflar.json)

```json
{
  "siniflar": [
    { "id": "9", "ad": "9. Sınıf" },
    { "id": "10", "ad": "10. Sınıf" }
  ]
}
```

## 2. Ders Listesi (data/9/dersler.json)

```json
{
  "sinif_ad": "10. Sınıf",
  "dersler": [
    {
      "ad": "Matematik",
      "id": "matematik",
      "aciklama": "Mantık, Kümeler ve Fonksiyonlar"
    },
    {
      "ad": "Felsefe",
      "id": "felsefe", //bu bizim json adımızdır felsefe.json
      "aciklama": "Mantık, Kümeler ve Fonksiyonlar"
    }
  ]
}
```

## 3. Ders İçeriği (data/9/matematik.json)

```json
{
  "ders_ad": "Adabımuaşeret",
  "sinif": "10",
  "dosyalar": [
    {
      "ad": "Adabımuaşeret 1. Dönem 2. Yazılı",
      "ogretmen": "Özay Arıcı",
      "dosya": "dosyalar/10/Adabımuaseret.doc",
      "tarih": "2026-01-09"
    }
  ]
}
```

## ⚠️ Kurallar

- Dosya adları ve id alanları küçük harf ve İngilizce karakter içermelidir.
- Türkçe karakter kullanma (ı, ş, ğ, ö, ü, ç).
- ID adı ile json adı aynı olmalı.
- Tarih formatı YYYY-MM-DD olmalıdır.
- JSON dosyalarında son elemandan sonra virgül bırakma.
- Linkler eklenebilir
