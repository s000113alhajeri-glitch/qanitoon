/* بحث محلي (بلا إنترنت) في قاعدة DUADB: استرجاع فقط — لا يولِّد نصاً، وكل نتيجة تحمل مصدرها.
   هجين: كلمات مطبَّعة بوزن BM25 + مرادفات عامية تُحوَّل إلى وسوم الوقت/الحالة + مطابقة العبارة كاملة. */
const DS = (() => {
  const norm = s => String(s)
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640\u200f\u200e]/g, "")
    .replace(/[إأآا]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/[ؤئ]/g, "ء")
    .replace(/[^\u0621-\u064A ]/g, " ").replace(/\s+/g, " ").trim();
  const STOP = new Set(["من", "في", "على", "الى", "عن", "ان", "او", "ما", "لا", "ثم", "قال", "كان", "يقول", "اذا", "و", "يا", "هذا", "هذه", "ذلك", "به", "له", "لها", "بها", "الذي", "التي", "انه", "انها", "قد", "كل", "دعاء", "ذكر", "اذكار", "ادعيه", "ابغي", "اريد", "ابي", "بغيت", "عندي", "انا", "لي", "لنا"]);
  /* مرادفات: كلمة من كلام المستخدم → وسوم + كلمات بحث إضافية */
  const SYN = [
    { w: ["صباح", "الصبح", "فجر", "اصبحت"], tags: ["sabah"] },
    { w: ["مساء", "مغرب", "عصر", "امسيت", "ليل"], tags: ["masa"] },
    { w: ["نوم", "انام", "بنام", "نام", "ارقد", "فراش", "ارق", "سرير", "قبل النوم", "مضجع"], tags: ["nawm"] },
    { w: ["استيقاظ", "صحيت", "قمت", "قيام", "استيقظت"], tags: ["wake", "qiyam"] },
    { w: ["بعد الصلاه", "عقب الصلاه", "سلم", "دبر"], tags: ["salah_after"] },
    { w: ["استفتاح", "بدايه الصلاه", "اول الصلاه", "بعد التكبير"], tags: ["istiftah"] },
    { w: ["سجود", "ركوع", "ساجد", "سجده"], tags: ["ruku"] },
    { w: ["تشهد", "قبل السلام", "اخر الصلاه"], tags: ["tashahhud"] },
    { w: ["وتر", "قنوت"], tags: ["witr"] },
    { w: ["ثلث الليل", "تهجد", "قيام الليل", "سحر"], tags: ["qiyam"] },
    { w: ["وضوء", "توضات", "اتوضا"], tags: ["wudu"] },
    { w: ["حمام", "خلاء", "دوره المياه", "تواليت"], tags: ["khala"] },
    { w: ["مسجد", "اذان", "مؤذن", "الجامع"], tags: ["masjid"] },
    { w: ["بيت", "خروج", "دخول", "المنزل", "طلعت"], tags: ["home"] },
    { w: ["اكل", "طعام", "شراب", "افطار", "فطور", "غداء", "عشاء", "شربت"], tags: ["food"] },
    { w: ["لبس", "ثوب", "ملابس", "جديد"], tags: ["libas"] },
    { w: ["سفر", "سافر", "اسافر", "بسافر", "مسافر", "مسافره", "طياره", "مطار", "سياره", "ركوب", "طريق", "رحله"], tags: ["safar"] },
    { w: ["مطر", "رعد", "ريح", "عاصفه", "برق", "غيم", "هوا"], tags: ["weather"] },
    { w: ["هلال", "كسوف", "خسوف", "قمر"], tags: ["moon"] },
    { w: ["هم", "حزن", "حزين", "ضيق", "كرب", "قلق", "مكتئب", "اكتئاب", "زعلان", "ضغط", "تعبان نفسيا", "مهموم", "مضايق", "فرج", "مخرج"], tags: ["karb"] },
    { w: ["دين", "ديون", "فلوس", "فقر", "فقير", "قرض", "مديون", "مال", "راتب"], tags: ["dayn", "rizq"] },
    { w: ["مرض", "مريض", "تعبان", "الم", "وجع", "شفاء", "عمليه", "مستشفى", "حمى", "رقيه", "عياده"], tags: ["marad"] },
    { w: ["موت", "ميت", "وفاه", "تعزيه", "اعزي", "توفي", "مات", "جنازه", "عزاء", "مصيبه", "قبر", "متوفي", "توفى", "فقدت", "مقبره"], tags: ["mawt"] },
    { w: ["زواج", "عرس", "تزوج", "عريس", "زوج", "زوجه", "خطوبه", "مولود", "ولاده", "حمل", "بيبي", "طفل", "رضيع"], tags: ["nikah", "ahl"] },
    { w: ["استخاره", "قرار", "محتار", "متردد", "اختيار", "خيره"], tags: ["istikhara"] },
    { w: ["غضب", "معصب", "عصبيه", "زعل", "غاضب", "انفعال"], tags: ["ghadab"] },
    { w: ["خوف", "خايف", "خايفه", "عدو", "ظلم", "ظالم", "ظلمني", "مظلوم", "حاكم", "سلطان", "تهديد", "خصومه", "مشكله مع", "شر الناس", "حسد", "عين"], tags: ["khawf", "isti3adha", "afiya"] },
    { w: ["حج", "عمره", "طواف", "اطوف", "سعي", "اسعى", "عرفه", "تلبيه", "احرام", "الكعبه", "منى", "مزدلفه"], tags: ["hajj"] },
    { w: ["رمضان", "صيام", "صائم", "صوم", "ليله القدر", "افطرت"], tags: ["ramadan", "food"] },
    { w: ["جمعه", "الجمعه"], tags: ["jumua", "salawat"] },
    { w: ["صلاه على النبي", "الصلاه على النبي", "الصلاه على الرسول", "صلوات", "الصلاه الابراهيميه", "صل على محمد"], tags: ["salawat"] },
    { w: ["استغفار", "استغفر", "ذنب", "ذنوب", "توبه", "معصيه", "غلطت", "ندم", "مغفره", "سيد الاستغفار", "اثم"], tags: ["istighfar"] },
    { w: ["رزق", "بركه", "وظيفه", "شغل", "عمل", "تجاره", "مشروع", "توفيق", "نجاح", "بيع", "زياده"], tags: ["rizq"] },
    { w: ["علم", "دراسه", "امتحان", "اختبار", "حفظ", "فهم", "مذاكره", "جامعه", "مدرسه", "نسيان"], tags: ["ilm", "thabat"] },
    { w: ["ثبات", "هدايه", "قلب", "ايمان", "استقامه", "ضعف ايمان", "فتور", "وسواس", "شك", "الهدى"], tags: ["thabat"] },
    { w: ["عافيه", "حفظ", "حمايه", "امان", "ستر", "صحه", "سلامه", "اطمئنان", "امن"], tags: ["afiya"] },
    { w: ["استعاذه", "شر", "شرور", "شيطان", "سحر", "وسواس", "جن"], tags: ["isti3adha"] },
    { w: ["جنه", "نار", "الاخره", "حسن الخاتمه", "رضا", "لقاء الله"], tags: ["jannah"] },
    { w: ["مجلس", "جلسه", "كفاره المجلس", "اجتماع", "لغو"], tags: ["majlis"] },
    { w: ["عطاس", "عطست", "تثاؤب"], tags: ["atas"] },
    { w: ["شكر", "حمد", "نعمه", "فرحه", "فرحان", "بشرى", "خبر حلو"], tags: ["hamd"] },
    { w: ["تسبيح", "تهليل", "تكبير", "سبحان الله", "الباقيات", "ذكر الله", "اذكر"], tags: ["tasbih"] },
    { w: ["والدين", "امي", "ابوي", "ابي", "اهلي", "اولادي", "عيالي", "ولدي", "بنتي", "زوجي", "زوجتي", "اسرتي", "ذريه", "عيال"], tags: ["ahl"] },
    { w: ["ضيف", "شخص ساعدني", "احسن لي", "جزاك", "صديق", "اخوي", "احب", "دعاء لشخص", "للغير", "لاخي"], tags: ["nas"] },
    { w: ["جامع", "شامل", "عام", "كل شي", "خير الدنيا والاخره", "اي دعاء", "افضل دعاء"], tags: ["umum"] },
  ];
  SYN.forEach(s => s.w = s.w.map(norm));
  const TAGN = {}; (typeof DUADB_TAGS !== "undefined" ? DUADB_TAGS : []).forEach(t => TAGN[t.k] = t.n);

  let DOCS = null, DF = null, AVG = 1;
  /* جذع مبسّط: حذف سوابق الجر والتعريف ولواحق الضمائر والجمع ليتطابق «سجوده/السجود/سجود» */
  const stemW = w => {
    let x = w;
    for (const p of ["وال", "بال", "فال", "لل", "ال", "و", "ب", "ف"]) if (x.startsWith(p) && x.length - p.length >= 3) { x = x.slice(p.length); break; }
    for (const q of ["هما", "كما", "ها", "هم", "كم", "نا", "ون", "ين", "ات", "ان", "ه", "ك", "ي", "ت"]) if (x.endsWith(q) && x.length - q.length >= 3) { x = x.slice(0, -q.length); break; }
    return x;
  };
  const tok = s => { const out = []; norm(s).split(" ").forEach(w => { if (w.length > 1 && !STOP.has(w)) { out.push(w); const st = stemW(w); if (st !== w) out.push(st); } }); return out; };
  function build() {
    DOCS = []; DF = {};
    DUADB.forEach((e, i) => {
      const tf = {};
      const add = (words, w) => words.forEach(x => tf[x] = (tf[x] || 0) + w);
      add(tok(e.t), 3);
      add(tok(e.h || ""), 1);
      add(tok(e.tags.map(k => TAGN[k] || "").join(" ")), 2);
      Object.keys(tf).forEach(k => DF[k] = (DF[k] || 0) + 1);
      const len = Object.values(tf).reduce((a, b) => a + b, 0);
      DOCS.push({ i, tf, len, nt: norm(e.t), nw: norm(e.t).split(" ").length, key: norm(e.t).split(" ").slice(0, 8).join(" ") });
    });
    AVG = DOCS.reduce((a, d) => a + d.len, 0) / (DOCS.length || 1);
  }
  const N = () => DOCS.length;
  const idf = t => Math.log(1 + (N() - (DF[t] || 0) + 0.5) / ((DF[t] || 0) + 0.5));
  function bm25(d, terms) {
    let s = 0;
    terms.forEach(t => {
      const f = d.tf[t]; if (!f) return;
      s += idf(t) * (f * 2.2) / (f + 1.2 * (0.25 + 0.75 * d.len / AVG));
    });
    return s;
  }
  /* تحويل سؤال المستخدم إلى وسوم عبر المرادفات (مطابقة جزئية للكلمة العامية) */
  const stem = stemW;
  function tagsOf(q) {
    const nq = " " + norm(q) + " ";
    const toks = new Set(); nq.trim().split(" ").forEach(t => { if (t) { toks.add(t); toks.add(stem(t)); } });
    const tags = new Set();
    SYN.forEach(s => {
      if (s.w.some(w => w.includes(" ") ? nq.includes(w) : (toks.has(w) || [...toks].some(t => t.length > 3 && w.length > 3 && (t.includes(w) || w.includes(t))))))
        s.tags.forEach(t => tags.add(t));
    });
    return [...tags];
  }
  function search(q, opt) {
    if (!DOCS) build();
    opt = opt || {};
    const nq = norm(q || "");
    const terms = [...new Set(tok(q || ""))];
    /* توسيع: جذور مبسّطة بحذف "ال" و"و" الواصلة */
    const ex = new Set(terms);
    terms.forEach(t => { if (t.startsWith("ال") && t.length > 4) ex.add(t.slice(2)); if (t.startsWith("و") && t.length > 3) ex.add(t.slice(1)); });
    const T = [...ex];
    const qtags = new Set((opt.tags || []).concat(nq ? tagsOf(q) : []));
    const out = [];
    if (!T.length && !qtags.size && !opt.tag) return { hits: [], total: 0, qtags: [] };
    DOCS.forEach(d => {
      const e = DUADB[d.i];
      if (opt.tag && !e.tags.includes(opt.tag)) return;
      const bm = T.length ? bm25(d, T) : 0;
      let s = bm * (qtags.size ? 0.5 : 0.7);
      const phrase = nq && d.nt.includes(nq);
      if (phrase) s += 6;
      let tagHit = 0; e.tags.forEach(t => { if (qtags.has(t)) tagHit++; });
      if (!bm && !phrase && !tagHit && !(opt.tag && !nq)) return;
      /* السؤال عن حالة/وقت: الوسم يتقدّم على تطابق الكلمات، ثم الأشهر (أكثر طرقاً) والمرفوع للنبي ﷺ */
      s += tagHit * (qtags.size ? 5 : 0);
      if (opt.tag && !nq) s += 1;
      if (e.who === "النبي ﷺ") s += 0.6; else if (e.who.startsWith("ورد")) s -= 0.4;
      s += Math.min(e.refs.length, 6) * 0.35;
      if (/صحيح/.test(e.refs[0].g)) s += 0.3;
      if (d.nw < 3) s -= 1.5;
      if (/[{}]/.test(e.t)) s -= 1;
      if (s > 0.6 || (opt.tag && !nq)) out.push({ e, s, tags: e.tags.filter(t => qtags.has(t)) });
    });
    out.sort((a, b) => b.s - a.s || a.e.t.length - b.e.t.length);
    return { hits: out.slice(0, opt.limit || 40), total: out.length, qtags: [...qtags] };
  }
  /* مفتاح التكرار لمقارنة مدخل من القاعدة بنص في المكتبة المُنسَّقة */
  const key = s => norm(s).split(" ").slice(0, 8).join(" ");
  return { search, tagsOf, norm, key, TAGN, build };
})();
