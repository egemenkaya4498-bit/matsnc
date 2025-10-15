// DOM Elementlerini başta tanımlayalım
const tekSayiInput = document.getElementById('tekSayi');
const sonuclarDiv = document.getElementById('sonuclar');
const asalSonucSpan = document.getElementById('asalSonuc');
const girilenSayiSpan = document.getElementById('girilenSayi');
const kontrolButon = document.getElementById('kontrol-buton'); // Butonu da yakaladık

/**
 * Bir sayının asal olup olmadığını kontrol eder (Optimize edilmiş).
 * @param {number} sayi - Kontrol edilecek pozitif tam sayı.
 * @returns {boolean} Sayı asalsa true, değilse false.
 */
const asalMi = (sayi) => {
    if (sayi <= 1) return false;
    if (sayi <= 3) return true; 

    // Çift sayıları ve 3'ün katlarını ele
    if (sayi % 2 === 0 || sayi % 3 === 0) return false; 

    // 6k ± 1 formülü ile kontrol
    for (let i = 5; i * i <= sayi; i = i + 6) {
        if (sayi % i === 0 || sayi % (i + 2) === 0) {
            return false;
        }
    }
    return true;
};

/**
 * Kullanıcıdan alınan sayının asallık kontrolünü başlatır ve sonucu görüntüler.
 */
const kontrolEt = () => {
    // 1. Durum: Hata ve Giriş Kontrolü
    const sayi = +tekSayiInput.value; 
    if (!Number.isInteger(sayi) || sayi <= 0) {
        alert("GEÇERSİZ GİRİŞ: Lütfen sadece pozitif tam sayı (Integer) giriniz.");
        sonuclarDiv.style.display = 'none';
        return;
    }
    
    // 2. Durum: Analiz Mesajını Göster ve Butonu Devre Dışı Bırak (3 saniye beklemek için)
    girilenSayiSpan.textContent = sayi;
    asalSonucSpan.textContent = "...VERİLER ANALİZ EDİLİYOR..."; // İstediğin mesaj
    asalSonucSpan.className = "result-analiz"; // Yeni stil sınıfı
    sonuclarDiv.style.display = 'block';
    
    kontrolButon.disabled = true; // Tekrar basılmasını engelle
    kontrolButon.textContent = "⌛ ANALİZ EDİLİYOR..."; // Buton durumunu değiştir
    
    // 3. Durum: 3 Saniyelik Gecikme Sonrası Sonucu Göster
    setTimeout(() => {
        
        // Asıl Hesaplama
        const sonuc = asalMi(sayi);
        
        // Sonuçları Görüntüleme
        if (sonuc) {
            asalSonucSpan.textContent = ">>> EVET, ASALDIR <<<";
            asalSonucSpan.className = "result-asal"; 
        } else {
            asalSonucSpan.textContent = ">>> HAYIR, ASAL DEĞİLDİR <<<";
            asalSonucSpan.className = "result-değil";
        }
        
        // Gecikme bitti, butonu geri aç
        kontrolButon.disabled = false;
        kontrolButon.textContent = "🚨 KONTROLÜ BAŞLAT";

    }, 2000); // 2000 milisaniye = 2 saniye
};