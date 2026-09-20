/* nature.js — حسابات فلكية محلية بلا إنترنت:
   أوقات الصلاة، التقويم الهجري، أطوار القمر ومنازله، مواسم الصيام.
   تنبيه: كل هذه حسابات فلكية تقريبية للاستئناس، والمرجع في الأوقات والأهلّة إعلان الجهة الرسمية في بلدك. */

const D2R = Math.PI / 180, R2D = 180 / Math.PI;
const sin = d => Math.sin(d * D2R), cos = d => Math.cos(d * D2R), tan = d => Math.tan(d * D2R);
const asin = x => Math.asin(x) * R2D, acos = x => Math.acos(x) * R2D, atan2 = (y, x) => Math.atan2(y, x) * R2D;
const fix = (a, n) => { a = a - n * Math.floor(a / n); return a < 0 ? a + n : a; };

/* اليوم اليولياني */
function julian(y, m, d) {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

/* ===================== أوقات الصلاة ===================== */
const PRAYER_METHODS = {
  makkah: { name: "أم القرى (مكة)", fajr: 18.5, isha: null, ishaMin: 90 },
  uae: { name: "هيئة الإمارات للأوقاف", fajr: 18.2, isha: 18.2 },
  mwl: { name: "رابطة العالم الإسلامي", fajr: 18, isha: 17 },
  egypt: { name: "الهيئة المصرية العامة للمساحة", fajr: 19.5, isha: 17.5 },
  karachi: { name: "جامعة العلوم الإسلامية — كراتشي", fajr: 18, isha: 18 },
  isna: { name: "ISNA (أمريكا الشمالية)", fajr: 15, isha: 15 }
};
const PRAYER_NAMES = { fajr: "الفجر", sunrise: "الشروق", dhuhr: "الظهر", asr: "العصر", maghrib: "المغرب", isha: "العشاء" };

function sunPosition(jd) {
  const D = jd - 2451545.0;
  const g = fix(357.529 + 0.98560028 * D, 360);
  const q = fix(280.459 + 0.98564736 * D, 360);
  const L = fix(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360);
  const e = 23.439 - 0.00000036 * D;
  const decl = asin(sin(e) * sin(L));
  let RA = atan2(cos(e) * sin(L), cos(L)) / 15; RA = fix(RA, 24);
  const eqt = q / 15 - RA;
  return { decl, eqt: fix(eqt + 12, 24) - 12 };
}

/* زوايا الشمس → ساعات الفرق عن الظهر الشرعي */
function hourAngle(angle, lat, decl) {
  const x = (-sin(angle) - sin(lat) * sin(decl)) / (cos(lat) * cos(decl));
  if (x > 1 || x < -1) return null;            // ليل/نهار دائم في خطوط العرض العالية
  return acos(x) / 15;
}
function asrHourAngle(shadow, lat, decl) {
  const a = -R2D * Math.atan(1 / (shadow + tan(Math.abs(lat - decl))));
  return hourAngle(a, lat, decl);
}

/* prayerTimes → كائن بالساعات العشرية بتوقيت الجهاز */
function prayerTimes(date, lat, lng, opts = {}) {
  const method = PRAYER_METHODS[opts.method] || PRAYER_METHODS.makkah;
  const shadow = opts.asr === "hanafi" ? 2 : 1;
  const jd = julian(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const { decl, eqt } = sunPosition(jd);
  const tz = -date.getTimezoneOffset() / 60;
  const dhuhr = 12 - eqt - lng / 15 + tz;
  const mk = h => h === null ? null : h;
  const riseSet = hourAngle(0.833, lat, decl);
  const t = {
    fajr: mk(hourAngle(method.fajr, lat, decl)),
    sunrise: riseSet, dhuhr: 0,
    asr: asrHourAngle(shadow, lat, decl),
    maghrib: riseSet,
    isha: method.isha === null ? null : hourAngle(method.isha, lat, decl)
  };
  const out = {
    fajr: t.fajr === null ? null : dhuhr - t.fajr,
    sunrise: t.sunrise === null ? null : dhuhr - t.sunrise,
    dhuhr: dhuhr + 1 / 60,
    asr: t.asr === null ? null : dhuhr + t.asr,
    maghrib: t.maghrib === null ? null : dhuhr + t.maghrib + 1 / 60,
    isha: null
  };
  out.isha = method.isha === null
    ? (out.maghrib === null ? null : out.maghrib + method.ishaMin / 60)
    : (t.isha === null ? null : dhuhr + t.isha);
  const adj = opts.adjust || {};
  for (const k in out) if (out[k] !== null && adj[k]) out[k] = out[k] + adj[k] / 60;
  return out;
}
const hhmm = h => {
  if (h === null || h === undefined) return "—";
  let t = fix(h + 0.5 / 60, 24);
  const H = Math.floor(t), M = Math.floor((t - H) * 60);
  return String(H).padStart(2, "0") + ":" + String(M).padStart(2, "0");
};

/* ===================== التقويم الهجري (حساب تقويمي) ===================== */
const HIJRI_MONTHS = ["محرّم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"];
function toHijri(date, offset = 0) {
  const jd = Math.floor(julian(date.getFullYear(), date.getMonth() + 1, date.getDate()) + 0.5) + offset;
  const l0 = jd - 1948440 + 10632;
  const n = Math.floor((l0 - 1) / 10631);
  let l = l0 - 10631 * n + 354;
  const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const m = Math.floor((24 * l) / 709);
  const d = l - Math.floor((709 * m) / 24);
  const y = 30 * n + j - 30;
  return { y, m, d, name: HIJRI_MONTHS[m - 1] };
}
function hijriToDate(hy, hm, hd) {
  // بحث تقريبي عكسي
  let guess = new Date(Date.UTC(622, 6, 16) + Math.round((hy - 1) * 354.367 + (hm - 1) * 29.53 + (hd - 1)) * 86400000);
  for (let i = 0; i < 40; i++) {
    const h = toHijri(guess);
    const diff = (hy - h.y) * 354.367 + (hm - h.m) * 29.53 + (hd - h.d);
    if (Math.abs(diff) < 0.5) break;
    guess = new Date(guess.getTime() + Math.round(diff) * 86400000);
  }
  return guess;
}

/* ===================== القمر: الطور، العمر، المنزلة، الميلان ===================== */
const MOON_MANSIONS = ["الشَّرَطان", "البُطَين", "الثُّرَيّا", "الدَّبَران", "الهَقعة", "الهَنعة", "الذِّراع", "النَّثرة", "الطَّرْف", "الجَبهة", "الزُّبرة", "الصَّرفة", "العَوّاء", "السِّماك", "الغَفْر", "الزُّبانى", "الإكليل", "القَلْب", "الشَّولة", "النَّعائم", "البَلدة", "سعد الذابح", "سعد بُلَع", "سعد السُّعود", "سعد الأخبية", "الفَرْغ المُقدَّم", "الفَرْغ المُؤخَّر", "بَطن الحُوت"];

function moonInfo(date, lat = 24.45, lng = 54.38) {
  const jd = julian(date.getFullYear(), date.getMonth() + 1, date.getDate()) + (date.getHours() + date.getMinutes() / 60) / 24;
  const D = jd - 2451545.0;
  /* خط طول الشمس */
  const gs = fix(357.529 + 0.98560028 * D, 360);
  const Ls = fix(280.459 + 0.98564736 * D + 1.915 * sin(gs) + 0.020 * sin(2 * gs), 360);
  /* خط طول القمر (تقريب منخفض الرتبة) */
  const Lm = fix(218.316 + 13.176396 * D, 360);
  const Mm = fix(134.963 + 13.064993 * D, 360);
  const Fm = fix(93.272 + 13.229350 * D, 360);
  const lonM = fix(Lm + 6.289 * sin(Mm), 360);
  const latM = 5.128 * sin(Fm);
  /* زاوية الاستطالة ونسبة الإضاءة */
  const elong = fix(lonM - Ls, 360);
  const phaseAngle = 180 - elong;
  const illum = (1 - cos(elong)) / 2;
  const waxing = elong < 180;
  /* العمر بالأيام من الاقتران */
  const syn = 29.530588853;
  const age = elong / 360 * syn;
  /* المنزلة: خط الطور الفلكي مقسوماً على ٢٨ */
  const mansionIdx = Math.floor(fix(lonM, 360) / (360 / 28)) % 28;
  /* اسم الطور */
  let phase = "المحاق";
  if (age < 1.2) phase = "المحاق (الاقتران)";
  else if (age < 6.5) phase = "هلال أول";
  else if (age < 8.5) phase = "التربيع الأول";
  else if (age < 13.5) phase = "أحدب متزايد";
  else if (age < 16) phase = "البدر";
  else if (age < 21) phase = "أحدب متناقص";
  else if (age < 23.5) phase = "التربيع الأخير";
  else if (age < 28.4) phase = "هلال آخر";
  /* ميلان الهلال: تقريبياً يميل نحو الأفق كلما اقتربنا من خط الاستواء */
  const tilt = (waxing ? 1 : -1) * (90 - Math.min(80, Math.abs(lat))) * 0.85;
  return { age, illum, waxing, phase, phaseAngle, lon: lonM, lat: latM, tilt, mansion: MOON_MANSIONS[mansionIdx], mansionIdx };
}

/* كسوف/خسوف محتمل: عند الاقتران أو الاستقبال مع قرب العقدة */
function eclipseWatch(date) {
  const m = moonInfo(date);
  const nearNode = Math.abs(m.lat) < 1.5;
  if (m.age < 0.9 && nearNode) return { type: "كسوف شمسي محتمل", note: "قرب الاقتران والقمر قريب من العقدة" };
  if (Math.abs(m.age - 14.76) < 0.9 && nearNode) return { type: "خسوف قمري محتمل", note: "قرب الاستقبال والقمر قريب من العقدة" };
  return null;
}

/* ===================== مواسم الصيام والمناسبات ===================== */
const FAST_KINDS = { qada: "قضاء", nadhr: "نذر", nafl: "نافلة" };
const OCCASIONS = [
  { id: "ramadan", hm: 9, hd: 1, label: "دخول رمضان", note: "الصيام واجب، والعبرة بإعلان الجهة الرسمية في بلدك بعد ثبوت الرؤية." },
  { id: "laylat", hm: 9, hd: 21, label: "العشر الأواخر", note: "تحرّي ليلة القدر في أوتار العشر الأواخر." },
  { id: "fitr", hm: 10, hd: 1, label: "عيد الفطر", note: "يحرم صيامه، وتُشرع تكبيرات العيد من غروب ليلة العيد إلى صلاة العيد." },
  { id: "arafah", hm: 12, hd: 9, label: "يوم عرفة", note: "صيامه لغير الحاج يكفّر سنة ماضية وسنة باقية (مسلم)." },
  { id: "adha", hm: 12, hd: 10, label: "عيد الأضحى", note: "يحرم صيامه وأيام التشريق الثلاثة بعده." },
  { id: "ashura", hm: 1, hd: 10, label: "عاشوراء", note: "صيامه يكفّر السنة الماضية، ويُستحب صيام التاسع معه (مسلم)." },
  { id: "tasua", hm: 1, hd: 9, label: "تاسوعاء", note: "«لئن بقيتُ إلى قابلٍ لأصومنّ التاسع» (مسلم)." }
];
const SUNNAH_FASTS = [
  { id: "shawwal", label: "ست من شوال", rule: "6 أيام في شهر شوال بعد العيد", src: "مسلم", note: "«من صام رمضان ثم أتبعه ستاً من شوال كان كصيام الدهر». والقضاء مقدَّم عند جمهور أهل العلم." },
  { id: "bid", label: "الأيام البيض", rule: "13 و14 و15 من كل شهر هجري", src: "الترمذي والنسائي (صحيح)" },
  { id: "mon-thu", label: "الاثنين والخميس", rule: "كل أسبوع", src: "الترمذي (صحيح)", note: "«تُعرض الأعمال يوم الاثنين والخميس»." },
  { id: "arafah", label: "يوم عرفة", rule: "9 ذو الحجة لغير الحاج", src: "مسلم" },
  { id: "ashura", label: "عاشوراء وتاسوعاء", rule: "9 و10 محرّم", src: "مسلم" },
  { id: "shaban", label: "الإكثار في شعبان", rule: "أكثر شعبان", src: "البخاري ومسلم" }
];
const FAST_DUA = [
  { t: "دعاء الصائم عند فطره لا يُرد", s: "الترمذي وابن ماجه (حسن)", tag: "س", note: "فادعُ بما شئت قبل الفطر وعنده." },
  { t: "ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ", s: "أبو داود (حسن)", tag: "س", note: "بعد الإفطار." },
  { t: "اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ", s: "أبو داود مرسلاً وضعّفه جمع من أهل العلم", tag: "د", note: "دعاء مباح، لا يُجزم بأنه سنة ثابتة." },
  { t: "السحور بركة: «تسحّروا فإن في السحور بركة»", s: "البخاري ومسلم", tag: "س", note: "ويُستحب تأخيره إلى قُبيل الفجر." },
  { t: "تعجيل الفطر: «لا يزال الناس بخير ما عجّلوا الفطر»", s: "البخاري ومسلم", tag: "س" },
  { t: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", s: "الترمذي (صحيح)", tag: "س", note: "تُقال في ليلة القدر." },
  { t: "تكبير العيد: اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ", s: "ثابت عن ابن مسعود وابن عباس", tag: "س", note: "من غروب ليلة العيد إلى صلاة العيد." }
];

/* حالة اليوم من جهة الصيام */
function fastStatusFor(date) {
  const h = toHijri(date);
  const dow = date.getDay();
  const tags = [];
  if (h.m === 9) tags.push({ k: "wajib", t: "رمضان — صيام واجب" });
  if (h.m === 10 && h.d === 1) tags.push({ k: "haram", t: "عيد الفطر — يحرم صيامه" });
  if (h.m === 12 && h.d >= 10 && h.d <= 13) tags.push({ k: "haram", t: "العيد وأيام التشريق — يحرم صيامها" });
  if (h.m === 12 && h.d === 9) tags.push({ k: "sunnah", t: "يوم عرفة" });
  if (h.m === 1 && (h.d === 9 || h.d === 10)) tags.push({ k: "sunnah", t: h.d === 9 ? "تاسوعاء" : "عاشوراء" });
  if (h.m === 10 && h.d > 1) tags.push({ k: "sunnah", t: "وقت ست شوال" });
  if ([13, 14, 15].includes(h.d) && h.m !== 12) tags.push({ k: "sunnah", t: "الأيام البيض" });
  if ((dow === 1 || dow === 4) && h.m !== 9) tags.push({ k: "sunnah", t: dow === 1 ? "الاثنين" : "الخميس" });
  return { hijri: h, tags };
}
