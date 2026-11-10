(function () {
  "use strict";

  var K = window.KAFE;
  var AZ = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s) { return document.querySelector(s); };

  /* ---------------- Yardımcılar ---------------- */
  function el(etiket, sinif, metin) {
    var e = document.createElement(etiket);
    if (sinif) e.className = sinif;
    if (metin != null) e.textContent = metin;
    return e;
  }
  function slug(s) {
    return String(s).toLocaleLowerCase("tr")
      .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o")
      .replace(/ş/g, "s").replace(/ü/g, "u").replace(/[âà]/g, "a").replace(/î/g, "i").replace(/û/g, "u")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function kucukHarf(s) { return String(s || "").toLocaleLowerCase("tr"); }

  var IK = {
    ara: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    geri: '<path d="M15 5l-7 7 7 7"/>',
    ileri: '<path d="M9 5l7 7-7 7"/>',
    kapat: '<path d="M6 6l12 12M18 6L6 18"/>',
  };
  function ikon(ad) {
    var s = el("span", "ik");
    s.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IK[ad] + "</svg>";
    return s;
  }

  function fiyatYaz(f) {
    if (typeof f !== "number") return "";
    var kesirli = Math.round(f * 100) % 100 !== 0;
    return f.toLocaleString("tr-TR", { minimumFractionDigits: kesirli ? 2 : 0, maximumFractionDigits: 2 }) + " " + K.paraBirimi;
  }

  /* ---------------- Veriyi hazırla ---------------- */
  var KATLAR = [], KAT = {}, URUN = {}, HEPSI = [];
  K.kategoriler.forEach(function (c) {
    var k = { id: c.id || slug(c.ad), ad: c.ad, aciklama: c.aciklama || "", gorsel: c.gorsel || "", gruplar: [], sayi: 0 };
    (c.gruplar || []).forEach(function (g) {
      var us = (g.urunler || []).filter(function (u) { return K.ornekleriGoster || !u.ornek; });
      if (!us.length) return;
      var gr = { ad: g.ad, id: "g-" + slug(g.ad), urunler: us };
      us.forEach(function (u) {
        var id = slug(u.ad), n = 2;
        while (URUN[id]) id = slug(u.ad) + "-" + n++;
        u._id = id; u._kat = k; u._grup = gr;
        u._ara = kucukHarf([u.ad, u.aciklama, (u.icerik || []).join(" "), (u.etiket || []).join(" "), k.ad, gr.ad].join(" "));
        URUN[id] = u; HEPSI.push(u);
      });
      k.gruplar.push(gr);
      k.sayi += us.length;
    });
    KATLAR.push(k); KAT[k.id] = k;
  });

  /* ---------------- Kategori fotoğrafı ---------------- */
  // Fotoğraf yüklenirse kart "foto" görünümüne geçer; yoksa düz renkli kalır.
  function katFoto(k, kutu, art) {
    if (!k.gorsel) return;
    var uygula = function () {
      art.style.backgroundImage = 'url("images/' + encodeURI(k.gorsel) + '")';
      kutu.classList.add("foto");
    };
    if (k._foto) { uygula(); return; }
    var im = new Image();
    im.onload = function () { k._foto = true; uygula(); };
    im.src = "images/" + k.gorsel;
  }
  function katKart(k) {
    var a = el("a", "kat");
    a.href = "#/k/" + k.id;
    var art = el("span", "kat-art");
    a.appendChild(art);
    a.appendChild(el("span", "kat-ad", k.ad));
    a.appendChild(el("span", "kat-acik", k.aciklama || (k.sayi ? k.sayi + " ürün" : "Yakında")));
    katFoto(k, a, art);
    return { a: a, art: art };
  }

  /* ---------------- Ortak ürün parçaları ---------------- */
  function kucukResim(u) {
    var d = el("span", "thumb", u.ad.charAt(0));
    if (u.gorsel) {
      var im = new Image();
      im.alt = "";
      im.decoding = "async";
      im.onload = function () { d.classList.add("yuklu"); };
      im.onerror = function () { im.remove(); };
      im.src = "images/" + u.gorsel;
      d.appendChild(im);
    }
    return d;
  }
  // Fiyat ve yanında tek bir kısa not (protein miktarı ya da ilk etiket)
  function altSatir(u) {
    var d = el("span", "alt");
    var f = fiyatYaz(u.fiyat);
    if (f) d.appendChild(el("span", "fiyat", f));
    var not = (u.besin && u.besin.Protein) ? u.besin.Protein + " protein" : (u.etiket && u.etiket[0]) || "";
    if (not) d.appendChild(el("span", "not", not));
    return d.childNodes.length ? d : null;
  }
  function adYaz(hedef, ad, q) {
    var i = q ? kucukHarf(ad).indexOf(q) : -1;
    if (i < 0) { hedef.textContent = ad; return; }
    hedef.appendChild(document.createTextNode(ad.slice(0, i)));
    hedef.appendChild(el("mark", null, ad.slice(i, i + q.length)));
    hedef.appendChild(document.createTextNode(ad.slice(i + q.length)));
  }
  function satir(u, q) {
    var a = el("a", "urun");
    a.href = "#/u/" + u._id;
    var y = el("span", "urun-yazi");
    var ad = el("span", "urun-ad");
    adYaz(ad, u.ad, q);
    y.appendChild(ad);
    if (u.aciklama) y.appendChild(el("span", "urun-acik", u.aciklama));
    var alt = altSatir(u);
    if (alt) y.appendChild(alt);
    a.appendChild(y);
    a.appendChild(kucukResim(u));
    return a;
  }

  /* ---------------- Kaydırınca belirme ---------------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    var n = 0;
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.style.setProperty("--d", (n++ * 60) + "ms");
      e.target.classList.add("in");
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -4% 0px" }) : null;
  function izle(kok) {
    kok.querySelectorAll(".rv:not(.in)").forEach(function (e) { if (io) io.observe(e); else e.classList.add("in"); });
  }

  /* ---------------- Ana sayfa ---------------- */
  var ev = $("#ev"), katEl = $("#kat");
  var kartlar = {};

  function selamla() {
    var s = new Date().getHours();
    if (s >= 5 && s < 11) return "Günaydın";
    if (s >= 11 && s < 17) return "İyi günler";
    if (s >= 17 && s < 22) return "İyi akşamlar";
    return "İyi geceler";
  }

  function evCiz() {
    var i = 0;
    var gir = function (e) { e.classList.add("gir"); e.style.setProperty("--i", i++); return e; };

    var bas = gir(el("header", "bas"));
    bas.appendChild(el("div", "bas-ad", K.ad));
    var araB = el("a", "yuvarlak");
    araB.href = "#/ara";
    araB.setAttribute("aria-label", "Menüde ara");
    araB.appendChild(ikon("ara"));
    bas.appendChild(araB);
    ev.appendChild(bas);

    ev.appendChild(gir(el("p", "selam", selamla() + ",")));
    ev.appendChild(gir(el("h1", "manset", "ne alırsınız?")));
    if (K.slogan) ev.appendChild(gir(el("p", "slogan", K.slogan)));

    // Kategori çoksa ilk kart tam genişlikte, diğerleri ikişerli dizilir;
    // sonda tek kalan kart da tam genişliğe yayılır.
    var cok = KATLAR.length > 4;
    var katlar = el("div", "katlar" + (cok ? " cok" : ""));
    KATLAR.forEach(function (k, n) {
      var kart = katKart(k);
      if (cok && (n === 0 || (n === KATLAR.length - 1 && KATLAR.length % 2 === 0))) kart.a.classList.add("genis");
      gir(kart.a);
      katlar.appendChild(kart.a);
      kartlar[k.id] = kart.art;
    });
    ev.appendChild(katlar);

    var one = HEPSI.filter(function (u) { return u.oneCikan; });
    if (one.length) {
      ev.appendChild(el("h2", "baslik rv", "Öne çıkanlar"));
      var serit = el("div", "one rv");
      one.forEach(function (u) {
        var a = el("a", "one-kart");
        a.href = "#/u/" + u._id;
        a.appendChild(kucukResim(u));
        a.appendChild(el("div", "one-ad", u.ad));
        var alt = altSatir(u);
        if (alt) a.appendChild(alt);
        serit.appendChild(a);
      });
      ev.appendChild(serit);
    }

    var B = K.bilgi || {};
    var satirlar = [
      ["Çalışma saatleri", B.saatler], ["Adres", B.adres],
      ["Wi-Fi", B.wifiAdi], ["Wi-Fi şifresi", B.wifiSifre], ["Instagram", B.instagram],
    ].filter(function (s) { return s[1]; });
    if (satirlar.length) {
      var kutu = el("div", "bilgi rv");
      satirlar.forEach(function (s) {
        var d = el("div");
        d.appendChild(el("span", null, s[0]));
        d.appendChild(el("b", null, s[1]));
        kutu.appendChild(d);
      });
      ev.appendChild(kutu);
    }

    var dip = el("footer", "dip rv");
    dip.appendChild(el("b", null, K.ad));
    dip.appendChild(document.createTextNode("Alerjen ve içerik bilgisi için lütfen personele danışın."));
    ev.appendChild(dip);

    izle(ev);
  }

  /* ---------------- Kategori sayfası ---------------- */
  var sekmeler = [], sekmeCizgi = null, sekmeKutu = null, aktifSekme = -1;

  function katCiz(k) {
    katEl.textContent = "";
    sekmeler = []; sekmeCizgi = null; sekmeKutu = null; aktifSekme = -1;

    var kh = el("header", "kh");
    var khArt = el("span", "kh-art");
    kh.appendChild(khArt);
    katFoto(k, kh, khArt);
    var ust = el("div", "kh-ust");
    var geriB = el("button", "yuvarlak");
    geriB.type = "button";
    geriB.setAttribute("aria-label", "Menüye dön");
    geriB.appendChild(ikon("geri"));
    geriB.addEventListener("click", function () { geri("#/"); });
    var araB = el("a", "yuvarlak");
    araB.href = "#/ara";
    araB.setAttribute("aria-label", "Menüde ara");
    araB.appendChild(ikon("ara"));
    ust.appendChild(geriB);
    ust.appendChild(araB);
    kh.appendChild(ust);
    var yazi = el("div", "kh-yazi");
    yazi.appendChild(el("h1", "kh-ad", k.ad));
    if (k.aciklama) yazi.appendChild(el("p", "kh-acik", k.aciklama));
    kh.appendChild(yazi);
    katEl.appendChild(kh);

    if (!k.sayi) {
      var bos = el("div", "bos");
      bos.appendChild(el("b", null, "Çok yakında"));
      bos.appendChild(document.createTextNode("Bu bölüme ürünler ekleniyor."));
      katEl.appendChild(bos);
    }

    var cokGrup = k.gruplar.length > 1;
    if (cokGrup) {
      sekmeKutu = el("div", "sekmeler");
      var iz = el("div", "sekme-iz");
      sekmeCizgi = el("span", "sekme-cizgi");
      k.gruplar.forEach(function (g) {
        var b = el("button", "sekme", g.ad);
        b.type = "button";
        b.addEventListener("click", function () {
          var hedef = document.getElementById(g.id);
          if (hedef) hedef.scrollIntoView({ behavior: AZ ? "auto" : "smooth", block: "start" });
        });
        iz.appendChild(b);
        sekmeler.push({ b: b, id: g.id });
      });
      iz.appendChild(sekmeCizgi);
      sekmeKutu.appendChild(iz);
      katEl.appendChild(sekmeKutu);
    }

    k.gruplar.forEach(function (g) {
      var s = el("section", "grup");
      s.id = g.id;
      if (cokGrup) s.appendChild(el("h2", "grup-ad rv", g.ad));
      var l = el("div", "liste");
      g.urunler.forEach(function (u) {
        var r = satir(u);
        r.classList.add("rv");
        l.appendChild(r);
      });
      s.appendChild(l);
      katEl.appendChild(s);
    });

    var digerleri = KATLAR.filter(function (d) { return d !== k; });
    if (digerleri.length) {
      katEl.appendChild(el("h2", "baslik rv", "Menünün devamı"));
      var d = el("div", "diger rv");
      digerleri.slice(0, 4).forEach(function (o) { d.appendChild(katKart(o).a); });
      katEl.appendChild(d);
    }

    $("#ustbar-ad").textContent = k.ad;
    izle(katEl);
  }

  function sekmeSec(n) {
    if (n === aktifSekme || !sekmeler[n]) return;
    aktifSekme = n;
    sekmeler.forEach(function (s, i) { s.b.classList.toggle("aktif", i === n); });
    var b = sekmeler[n].b;
    sekmeCizgi.style.width = b.offsetWidth + "px";
    sekmeCizgi.style.transform = "translateX(" + b.offsetLeft + "px)";
    var hedef = b.offsetLeft - (sekmeKutu.clientWidth - b.offsetWidth) / 2;
    sekmeKutu.scrollTo({ left: hedef, behavior: AZ ? "auto" : "smooth" });
  }

  var ustbar = $("#ustbar");
  (function () {
    var g = el("button", "yuvarlak");
    g.type = "button";
    g.setAttribute("aria-label", "Menüye dön");
    g.appendChild(ikon("geri"));
    g.addEventListener("click", function () { geri("#/"); });
    var ad = el("div", "ustbar-ad");
    ad.id = "ustbar-ad";
    var a = el("a", "yuvarlak");
    a.href = "#/ara";
    a.setAttribute("aria-label", "Menüde ara");
    a.appendChild(ikon("ara"));
    ustbar.appendChild(g); ustbar.appendChild(ad); ustbar.appendChild(a);
  })();

  var kaydirmaBekliyor = false;
  function kaydirinca() {
    kaydirmaBekliyor = false;
    if (gorunum === "ev" || !gorunum) { ustbar.classList.remove("goster"); return; }
    var kh = katEl.firstElementChild;
    ustbar.classList.toggle("goster", window.scrollY > (kh ? kh.offsetHeight : 0) - 60);
    if (!sekmeler.length) return;
    var esik = 130, secili = 0;
    sekmeler.forEach(function (s, i) {
      var g = document.getElementById(s.id);
      if (g && g.getBoundingClientRect().top <= esik) secili = i;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      // Sayfa sonuna gelindiyse görünen son grubu seç
      for (var i = sekmeler.length - 1; i > secili; i--) {
        var g = document.getElementById(sekmeler[i].id);
        if (g && g.getBoundingClientRect().top < window.innerHeight * .6) { secili = i; break; }
      }
    }
    sekmeSec(secili);
  }
  window.addEventListener("scroll", function () {
    if (!kaydirmaBekliyor) { kaydirmaBekliyor = true; requestAnimationFrame(kaydirinca); }
  }, { passive: true });
  function sekmeHizala() {
    var n = aktifSekme;
    aktifSekme = -1;
    if (sekmeler.length) sekmeSec(n < 0 ? 0 : n);
  }
  window.addEventListener("resize", sekmeHizala);
  // Yazı tipi yüklenince sekme genişlikleri değişir; çizgiyi yeniden hizala
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sekmeHizala);

  /* ---------------- Ürün detayı ---------------- */
  var sayfa = $("#sayfa"), panel = $("#sayfa-panel"), perde = $("#sayfa-perde");
  var sMedya = $("#sayfa-medya"), sGovde = $("#sayfa-govde"), sKapat = $("#sayfa-kapat"), sTut = $("#sayfa-tut");
  var acikUrun = null, sayfaZaman = 0;
  sKapat.appendChild(ikon("kapat"));

  function sayfaAc(u) {
    if (acikUrun === u) return;
    acikUrun = u;
    clearTimeout(sayfaZaman);

    sMedya.textContent = "";
    panel.classList.toggle("resimsiz", !u.gorsel);
    if (u.gorsel) {
      var m = el("div", "sm");
      var im = new Image();
      im.alt = u.ad;
      im.draggable = false;
      im.onerror = function () { m.remove(); panel.classList.add("resimsiz"); };
      im.src = "images/" + u.gorsel;
      m.appendChild(im);
      sMedya.appendChild(m);
    }

    sGovde.textContent = "";
    sGovde.scrollTop = 0;
    var yer = u._kat.ad + (u._grup.ad !== u._kat.ad ? " · " + u._grup.ad : "");
    sGovde.appendChild(el("p", "s-yer", yer));
    var h = el("h2", "s-ad", u.ad);
    h.id = "sayfa-ad";
    sGovde.appendChild(h);
    var f = fiyatYaz(u.fiyat);
    if (f) sGovde.appendChild(el("p", "s-fiyat", f));
    if (u.aciklama) sGovde.appendChild(el("p", "s-acik", u.aciklama));

    var anahtarlar = u.besin ? Object.keys(u.besin) : [];
    if (anahtarlar.length) {
      sGovde.appendChild(el("h3", "s-etiket", "Besin değerleri"));
      var b = el("div", "besin");
      anahtarlar.forEach(function (k) {
        var kutu = el("div", k === "Protein" ? "ana" : "");
        var e = /^(\d+(?:[.,]\d+)?)\s*(.*)$/.exec(String(u.besin[k]).trim());
        var deger = el("b", null, e ? e[1] : u.besin[k]);
        if (e && e[2]) deger.appendChild(el("small", null, e[2]));
        kutu.appendChild(deger);
        kutu.appendChild(el("span", null, k));
        b.appendChild(kutu);
      });
      sGovde.appendChild(b);
    }

    if (u.icerik && u.icerik.length) {
      sGovde.appendChild(el("h3", "s-etiket", "İçindekiler"));
      // Cümle gibi okunsun: ilk madde büyük harfle, diğerleri küçük harfle başlar
      var maddeler = u.icerik.map(function (x, n) { return n ? x.charAt(0).toLocaleLowerCase("tr") + x.slice(1) : x; });
      sGovde.appendChild(el("p", "s-metin", maddeler.join(", ") + "."));
    }

    if (u.alerjen && u.alerjen.length) {
      var al = el("p", "s-alerjen");
      al.appendChild(el("b", null, "Alerjen: "));
      al.appendChild(document.createTextNode(u.alerjen.join(", ")));
      sGovde.appendChild(al);
    }

    panel.style.transform = "";
    perde.style.opacity = "";
    sayfa.hidden = false;
    void panel.offsetWidth;
    sayfa.classList.add("acik");
    kilitle();
    sKapat.focus({ preventScroll: true });
  }
  function sayfaKapat() {
    if (!acikUrun) return;
    acikUrun = null;
    panel.style.transition = "";
    panel.style.transform = "";
    perde.style.opacity = "";
    sayfa.classList.remove("acik");
    sayfaZaman = setTimeout(function () { sayfa.hidden = true; }, 480);
    kilitle();
  }
  function ustHash() { return gorunum && gorunum !== "ev" ? "#/k/" + gorunum : "#/"; }
  sKapat.addEventListener("click", function () { geri(ustHash()); });
  perde.addEventListener("click", function () { geri(ustHash()); });

  // Aşağı çekerek kapatma
  (function () {
    var basY = 0, dy = 0, t0 = 0, suruklu = false;
    sTut.addEventListener("pointerdown", function (e) {
      suruklu = true; basY = e.clientY; dy = 0; t0 = e.timeStamp;
      panel.style.transition = "none";
      try { sTut.setPointerCapture(e.pointerId); } catch (x) {}
    });
    sTut.addEventListener("pointermove", function (e) {
      if (!suruklu) return;
      dy = Math.max(0, e.clientY - basY);
      panel.style.transform = "translateY(" + dy + "px)";
      perde.style.opacity = String(1 - Math.min(dy / 420, .85));
    });
    var bitir = function (e) {
      if (!suruklu) return;
      suruklu = false;
      panel.style.transition = "";
      var hiz = dy / Math.max(e.timeStamp - t0, 1);
      if (dy > 120 || (dy > 30 && hiz > .55)) geri(ustHash());
      else { panel.style.transform = ""; perde.style.opacity = ""; }
    };
    sTut.addEventListener("pointerup", bitir);
    sTut.addEventListener("pointercancel", bitir);
  })();

  /* ---------------- Arama ---------------- */
  var ara = $("#ara"), araGiris = $("#ara-giris"), araGovde = $("#ara-govde");
  var araAcik = false, araZaman = 0;
  $("#ara-ikon").appendChild(ikon("ara"));

  function araCiz() {
    var q = kucukHarf(araGiris.value).trim();
    araGovde.textContent = "";
    araGovde.scrollTop = 0;

    if (!q) {
      KATLAR.forEach(function (k) {
        var a = el("a", "ara-kat");
        a.href = "#/k/" + k.id;
        a.appendChild(el("span", null, k.ad));
        a.appendChild(ikon("ileri"));
        araGovde.appendChild(a);
      });
      return;
    }

    var parcalar = q.split(/\s+/);
    var bulunan = HEPSI.filter(function (u) {
      return parcalar.every(function (p) { return u._ara.indexOf(p) >= 0; });
    });
    // Adında geçenler önce
    bulunan.sort(function (a, b) {
      return (kucukHarf(a.ad).indexOf(q) < 0) - (kucukHarf(b.ad).indexOf(q) < 0);
    });
    if (!bulunan.length) {
      var bos = el("div", "bos");
      bos.appendChild(el("b", null, "Bulunamadı"));
      bos.appendChild(document.createTextNode("“" + araGiris.value.trim() + "” ile eşleşen bir ürün yok."));
      araGovde.appendChild(bos);
      return;
    }
    araGovde.appendChild(el("div", "ara-etiket", bulunan.length + " ürün"));
    var l = el("div", "liste");
    bulunan.forEach(function (u) { l.appendChild(satir(u, q)); });
    araGovde.appendChild(l);
  }
  araGiris.addEventListener("input", araCiz);
  $("#ara-vazgec").addEventListener("click", function () { geri(ustHash()); });

  function araAc() {
    if (araAcik) return;
    araAcik = true;
    clearTimeout(araZaman);
    araGiris.value = "";
    araCiz();
    ara.hidden = false;
    void ara.offsetWidth;
    ara.classList.add("acik");
    kilitle();
    araGiris.focus({ preventScroll: true });
  }
  function araKapat() {
    if (!araAcik) return;
    araAcik = false;
    araGiris.blur();
    ara.classList.remove("acik");
    araZaman = setTimeout(function () { ara.hidden = true; }, 320);
    kilitle();
  }

  function kilitle() { document.body.classList.toggle("kilit", !!acikUrun || araAcik); }

  /* ---------------- Gezinme ---------------- */
  var gorunum = null, evKaydirma = 0;
  try { history.scrollRestoration = "manual"; } catch (x) {}

  function derinlik() { return (history.state && history.state.d) || 0; }
  function git(hash, degistir) {
    if (degistir) history.replaceState({ d: derinlik() }, "", hash);
    else history.pushState({ d: derinlik() + 1 }, "", hash);
    yonlendir();
  }
  function geri(yedek) {
    if (derinlik() > 0) history.back();
    else { history.replaceState({ d: 0 }, "", yedek || "#/"); yonlendir(); }
  }

  function coz() {
    var p = location.hash.replace(/^#\/?/, "").split("/").map(function (x) {
      try { return decodeURIComponent(x); } catch (e) { return x; }
    });
    if (p[0] === "k" && KAT[p[1]]) return { t: "k", id: p[1] };
    if (p[0] === "u" && URUN[p[1]]) return { t: "u", u: URUN[p[1]] };
    if (p[0] === "ara") return { t: "ara" };
    return { t: "ev" };
  }

  function gorunumGoster(id) {
    if (gorunum === id) return;
    var onceki = gorunum;
    var uygula = function () {
      if (onceki === "ev") evKaydirma = window.scrollY;
      gorunum = id;
      ustbar.classList.remove("goster");
      if (id === "ev") {
        katEl.hidden = true;
        ev.hidden = false;
        window.scrollTo(0, evKaydirma);
      } else {
        katCiz(KAT[id]);
        ev.hidden = true;
        katEl.hidden = false;
        window.scrollTo(0, 0);
        if (sekmeler.length) sekmeSec(0);
      }
      document.title = (id === "ev" ? "Menü" : KAT[id].ad) + " – " + K.ad;
    };
    // Ana sayfadaki kart ↔ kategori başlığı arasında ortak öğe geçişi
    var ortak = id !== "ev" ? id : onceki;
    Object.keys(kartlar).forEach(function (kid) {
      kartlar[kid].style.viewTransitionName = (kid === ortak && (onceki === "ev" || id === "ev")) ? "kathero" : "";
    });
    if (onceki && document.startViewTransition && !AZ) document.startViewTransition(uygula);
    else uygula();
  }

  function yonlendir() {
    var r = coz();
    if (r.t === "u") {
      if (!gorunum) gorunumGoster(r.u._kat.id);
      sayfaAc(r.u);
      return;
    }
    sayfaKapat();
    if (r.t === "ara") {
      if (!gorunum) gorunumGoster("ev");
      araAc();
      return;
    }
    araKapat();
    gorunumGoster(r.t === "k" ? r.id : "ev");
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href^='#/']");
    if (!a || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    var h = a.getAttribute("href");
    if (h === (location.hash || "#/")) return;
    // Bir kategoriden diğerine geçerken geçmişi şişirme
    var kategoriden = /^#\/k\//.test(h) && gorunum && gorunum !== "ev" && !acikUrun && !araAcik;
    git(h, kategoriden);
  });
  window.addEventListener("popstate", yonlendir);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && (acikUrun || araAcik)) geri(ustHash());
  });

  /* ---------------- Başlat ---------------- */
  history.replaceState({ d: 0 }, "", location.href);
  evCiz();
  yonlendir();

  var acilis = $("#acilis");
  var gordu = false;
  try { gordu = sessionStorage.getItem("acilis") === "1"; sessionStorage.setItem("acilis", "1"); } catch (x) {}
  var bekle = 0;
  if (gordu || AZ) {
    acilis.remove();
    document.body.classList.add("hazir");
  } else {
    $("#acilis-ad").textContent = K.ad;
    bekle = 1500;
    setTimeout(function () {
      acilis.classList.add("bitti");
      document.body.classList.add("hazir");
      setTimeout(function () { acilis.remove(); }, 700);
    }, bekle);
  }
  // İlk giriş animasyonu bittikten sonra, görünüm her açıldığında yeniden oynamasın
  setTimeout(function () { ev.classList.add("oturdu"); }, bekle + 2200);
})();
