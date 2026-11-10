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
//    gruplar   : kategori içindeki bölümler. Birden fazlaysa sayfada sekme olur.
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
//    oneCikan  : true ise ana sayfadaki "Öne çıkanlar" şeridinde görünür
//
window.KAFE = {
  ad: "Uğur Kafe",
  // Ana sayfada başlığın altında görünen kısa yazı. Boş bırakılırsa görünmez.
  slogan: "",
  paraBirimi: "₺",

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
      ad: "Meyve Suları",
      aciklama: "Taze sıkılmış",
      gorsel: "kat-meyve-sulari.jpg",
      gruplar: [
        {
          ad: "Meyve Suları",
          urunler: [
            { ad: "Portakal Suyu", aciklama: "Taze sıkılmış portakal", fiyat: null, gorsel: "portakal-suyu.jpg", oneCikan: true },
            { ad: "Nar Suyu", aciklama: "Taze sıkılmış nar", fiyat: null, gorsel: "nar-suyu.jpg" },
            { ad: "Mandalina Suyu", aciklama: "Taze sıkılmış mandalina", fiyat: null, gorsel: "mandalina-suyu.jpg" },
          ],
        },
      ],
    },

    {
      ad: "Fitness & Protein",
      aciklama: "Antrenman öncesi ve sonrası",
      gorsel: "kat-fitness-protein.jpg",
      gruplar: [
        {
          ad: "Fitness & Protein",
          urunler: [
            { ad: "Protein Shake", aciklama: "Antrenman sonrası protein içeceği", fiyat: null, gorsel: "protein-shake.jpg", oneCikan: true },
            { ad: "L-Carnitine Shot", aciklama: "", fiyat: null, gorsel: "l-carnitine-shot.jpg" },
            { ad: "Pre-Workout Shot", aciklama: "", fiyat: null, gorsel: "pre-workout-shot.jpg" },
          ],
        },
      ],
    },

    {
      ad: "Kahveler",
      aciklama: "Sıcak ve soğuk",
      gorsel: "kat-kahveler.jpg",
      gruplar: [
        {
          ad: "Sıcak",
          urunler: [
            { ad: "Espresso", aciklama: "", fiyat: null, gorsel: "espresso.jpg" },
            { ad: "Americano", aciklama: "", fiyat: null, gorsel: "americano.jpg" },
            { ad: "Latte", aciklama: "", fiyat: null, gorsel: "latte.jpg", oneCikan: true },
            { ad: "Türk Kahvesi", aciklama: "", fiyat: null, gorsel: "turk-kahvesi.jpg" },
          ],
        },
        {
          ad: "Soğuk",
          urunler: [
            { ad: "Ice Americano", aciklama: "", fiyat: null, gorsel: "ice-americano.jpg" },
            { ad: "Ice Latte", aciklama: "", fiyat: null, gorsel: "ice-latte.jpg" },
          ],
        },
      ],
    },

    {
      ad: "Özel İçecekler",
      aciklama: "Churchill, muzlu süt, atom",
      gorsel: "kat-ozel-icecekler.jpg",
      gruplar: [
        {
          ad: "Özel İçecekler",
          urunler: [
            { ad: "Churchill", aciklama: "Soda, limon ve tuz", fiyat: null, gorsel: "churchill.jpg" },
            { ad: "Muzlu Süt", aciklama: "", fiyat: null, gorsel: "muzlu-sut.jpg" },
            { ad: "Atom", aciklama: "Muz, süt ve enerji veren ek malzemeler", fiyat: null, gorsel: "atom.jpg", oneCikan: true },
          ],
        },
      ],
    },

    {
      ad: "Bitki Çayları",
      aciklama: "Papatya, ıhlamur, ada çayı, kuşburnu",
      gorsel: "kat-bitki-caylari.jpg",
      gruplar: [
        {
          ad: "Bitki Çayları",
          urunler: [
            { ad: "Papatya Çayı", aciklama: "", fiyat: null, gorsel: "papatya-cayi.jpg" },
            { ad: "Ihlamur Çayı", aciklama: "", fiyat: null, gorsel: "ihlamur-cayi.jpg" },
            { ad: "Ada Çayı", aciklama: "", fiyat: null, gorsel: "ada-cayi.jpg" },
            { ad: "Kuşburnu Çayı", aciklama: "", fiyat: null, gorsel: "kusburnu-cayi.jpg" },
          ],
        },
      ],
    },

    {
      ad: "Soğuk İçecekler",
      aciklama: "Enerji içeceği, soda ve su",
      gorsel: "kat-soguk-icecekler.jpg",
      gruplar: [
        {
          ad: "Soğuk İçecekler",
          urunler: [
            { ad: "Red Bull Sugarfree", aciklama: "", fiyat: null, gorsel: "red-bull-sugarfree.jpg" },
            { ad: "Monster Ultra White", aciklama: "", fiyat: null, gorsel: "monster-ultra-white.jpg" },
            { ad: "Beypazarı Soda", aciklama: "", fiyat: null, gorsel: "beypazari-soda.jpg" },
            { ad: "Büyük Su", aciklama: "", fiyat: null, gorsel: "buyuk-su.jpg" },
            { ad: "Küçük Su", aciklama: "", fiyat: null, gorsel: "kucuk-su.jpg" },
          ],
        },
      ],
    },
  ],
};
