// =====================================================================
//  MENÜNÜN TEK KAYNAĞI — QR menü de, ileride POS ekranı da bu dosyayı okur.
// =====================================================================
//
//  Yapı:  kategori  →  grup  →  ürün
//
//  Kategori alanları
//    ad        : ana sayfadaki kartta ve sayfa başlığında görünen ad
//    aciklama  : kartın altındaki kısa yazı
//    gorsel    : images/ klasöründeki arka plan fotoğrafı (yatay). Dosya yoksa
//                kart düz renkli görünür.
//
//  Ürün alanları (ad dışında hepsi isteğe bağlı)
//    ad        : ürün adı
//    aciklama  : kısa tanım
//    fiyat     : sayı (ör. 120 veya 45.5). null bırakılırsa fiyat gösterilmez.
//    gorsel    : images/ klasöründeki dosya adı. Dosya yoksa ürünün baş harfi gösterilir.
//    icerik    : içindekiler, ör. ["Süt", "Muz"]
//    besin     : besin değerleri, ör. { "Kalori": "320 kcal", "Protein": "30 g" }
//    alerjen   : ör. ["Süt", "Gluten"]
//    etiket    : ör. ["Popüler", "Yeni"]
//    oneCikan  : true ise ana sayfadaki "Öne Çıkanlar" şeridinde görünür
//    ornek     : true ise UYDURMA ÖRNEK üründür (aşağıdaki anahtara bakın)
//
window.KAFE = {
  ad: "Uğur Kafe",
  // Ana sayfada başlığın altında görünen kısa yazı. Boş bırakılırsa görünmez.
  slogan: "",
  paraBirimi: "₺",

  // Tasarımı dolu göstermek için eklenen ÖRNEK ürünler (ornek: true olanlar)
  // bu anahtar true iken görünür. Yayına çıkmadan önce gerçek ürünleri girip
  // bunu false yapın ya da örnekleri silin.
  ornekleriGoster: true,

  // Boş bırakılan satır menüde hiç görünmez.
  bilgi: {
    saatler: "",
    adres: "",
    wifiAdi: "",
    wifiSifre: "",
    instagram: "",
  },

  kategoriler: [
    {
      ad: "İçecekler",
      aciklama: "Shake, kahve ve soğuk içecekler",
      gorsel: "kat-icecekler.jpg",
      gruplar: [
        {
          ad: "Protein",
          urunler: [
            {
              ad: "Protein Shake",
              aciklama: "Antrenman sonrası toparlanma için.",
              fiyat: null,
              gorsel: "protein-shake.jpg",
              // ÖRNEK VERİ: içerik ve değerler gerçek tarifle değiştirilecek.
              icerik: ["Whey protein (1 ölçek)", "Süt", "Muz"],
              besin: { "Kalori": "320 kcal", "Protein": "30 g", "Karbonhidrat": "35 g", "Yağ": "6 g" },
              alerjen: ["Süt"],
              etiket: ["Popüler"],
              oneCikan: true,
            },
          ],
        },
        {
          ad: "Sıcak",
          urunler: [
            { ad: "Kahve", aciklama: "Taze demlenmiş.", fiyat: null, gorsel: "kahve.jpg", oneCikan: true },
          ],
        },
        {
          ad: "Soğuk",
          urunler: [
            { ad: "Portakal Suyu", aciklama: "", fiyat: null, gorsel: "portakal-suyu.jpg", oneCikan: true },
            { ad: "Küçük Su", aciklama: "0,5 L", fiyat: null, gorsel: "kucuk-su.jpg" },
            { ad: "Büyük Su", aciklama: "1,5 L", fiyat: null, gorsel: "buyuk-su.jpg" },
          ],
        },
      ],
    },

    {
      ad: "Yemekler",
      aciklama: "Doyurucu, dengeli öğünler",
      gorsel: "kat-yemekler.jpg",
      gruplar: [
        {
          ad: "Tost & Sandviç",
          urunler: [
            {
              ornek: true,
              ad: "Kaşarlı Tost", gorsel: "kasarli-tost.jpg",
              aciklama: "Tam buğday ekmeğinde.",
              fiyat: 120,
              icerik: ["Tam buğday ekmeği", "Kaşar peyniri"],
              alerjen: ["Gluten", "Süt"],
            },
            {
              ornek: true,
              ad: "Tavuklu Sandviç", gorsel: "tavuklu-sandvic.jpg",
              aciklama: "Izgara tavuk, yeşillik ve yoğurt sos.",
              fiyat: 190,
              icerik: ["Izgara tavuk göğsü", "Tam buğday ekmeği", "Marul", "Domates", "Yoğurt sos"],
              besin: { "Kalori": "420 kcal", "Protein": "34 g", "Karbonhidrat": "38 g", "Yağ": "12 g" },
              alerjen: ["Gluten", "Süt"],
              etiket: ["Yüksek Protein"],
              oneCikan: true,
            },
          ],
        },
        {
          ad: "Kâseler",
          urunler: [
            {
              ornek: true,
              ad: "Tavuklu Pilav Kâsesi", gorsel: "tavuklu-pilav-kasesi.jpg",
              aciklama: "Izgara tavuk, pirinç pilavı ve haşlanmış sebze.",
              fiyat: 240,
              icerik: ["Izgara tavuk göğsü", "Pirinç pilavı", "Brokoli", "Havuç"],
              besin: { "Kalori": "540 kcal", "Protein": "42 g", "Karbonhidrat": "60 g", "Yağ": "11 g" },
              etiket: ["Yüksek Protein"],
            },
            {
              ornek: true,
              ad: "Yulaf Kâsesi", gorsel: "yulaf-kasesi.jpg",
              aciklama: "Yulaf, yoğurt, muz ve bal.",
              fiyat: 160,
              icerik: ["Yulaf", "Yoğurt", "Muz", "Bal", "Ceviz"],
              alerjen: ["Gluten", "Süt", "Kuruyemiş"],
              etiket: ["Yeni"],
            },
          ],
        },
      ],
    },

    {
      ad: "Atıştırmalıklar",
      aciklama: "Antrenman arası hızlı enerji",
      gorsel: "kat-atistirmaliklar.jpg",
      gruplar: [
        {
          ad: "Atıştırmalıklar",
          urunler: [
            {
              ornek: true,
              ad: "Protein Bar", gorsel: "protein-bar.jpg",
              aciklama: "Çikolatalı.",
              fiyat: 90,
              besin: { "Kalori": "210 kcal", "Protein": "20 g", "Karbonhidrat": "18 g", "Yağ": "7 g" },
              alerjen: ["Süt", "Soya"],
              etiket: ["Yüksek Protein"],
              oneCikan: true,
            },
            { ornek: true, ad: "Kuruyemiş Kâsesi", gorsel: "kuruyemis-kasesi.jpg", aciklama: "Badem, fındık ve ceviz.", fiyat: 110, alerjen: ["Kuruyemiş"] },
            { ornek: true, ad: "Muz", gorsel: "muz.jpg", aciklama: "Tek adet.", fiyat: 25 },
            { ornek: true, ad: "Protein Kurabiye", gorsel: "protein-kurabiye.jpg", aciklama: "Yulaflı, damla çikolatalı.", fiyat: 80, alerjen: ["Gluten", "Süt"], etiket: ["Yeni"] },
          ],
        },
      ],
    },
  ],
};
