/* قانتون — تطبيق أوفلاين: مناسك العمرة والحج، المصحف، الأذكار، الورد، اسألني */

/* ============ تخزين محلي ============ */
const DB = {
  get(k, d) { try { const v = localStorage.getItem("zh_" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem("zh_" + k, JSON.stringify(v)); } catch (e) { } }
};
const today = () => new Date().toISOString().slice(0, 10);
const AR = n => String(n);
const ARI = n => String(n).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
const el = (h) => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstElementChild; };
const esc = s => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

/* ============ تنبيه: صوت + اهتزاز + بطاقة ============ */
let speakOn = DB.get("speak", true);
function speak(text) {
  if (!speakOn || !("speechSynthesis" in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA"; u.rate = 0.95;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch (e) { }
}
function notify(title, body) {
  if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
  speak(title + ". " + (body || ""));
  document.querySelectorAll(".alert").forEach(a => a.remove());
  const a = el(`<div class="alert">${esc(title)}<div style="font-weight:400;font-size:14px">${esc(body || "")}</div></div>`);
  a.onclick = () => a.remove();
  document.body.appendChild(a);
  setTimeout(() => a.remove(), 9000);
  if ("Notification" in window && Notification.permission === "granted") {
    try { new Notification(title, { body: body || "", icon: "icon.svg" }); } catch (e) { }
  }
}

/* ============ مواضع المسجد الحرام (تقريبية) ============ */
const SPOTS = {
  hajar: { name: "الحجر الأسود", lat: 21.422480, lng: 39.826180, r: 12 },
  yamani: { name: "الركن اليماني", lat: 21.422290, lng: 39.825990, r: 10 },
  maqam: { name: "مقام إبراهيم", lat: 21.422600, lng: 39.826330, r: 10 },
  hijr: { name: "حِجر إسماعيل", lat: 21.422760, lng: 39.826080, r: 10 },
  multazam: { name: "المُلتزم", lat: 21.422420, lng: 39.826230, r: 8 },
  safa: { name: "الصفا", lat: 21.422009, lng: 39.827398, r: 20 },
  marwa: { name: "المروة", lat: 21.425358, lng: 39.827235, r: 20 }
};
const SPOT_DUA = {
  hajar: "بِسْمِ اللَّهِ، اللَّهُ أَكْبَرُ، اللَّهُمَّ إِيمَانًا بِكَ، وَتَصْدِيقًا بِكِتَابِكَ، وَوَفَاءً بِعَهْدِكَ، وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ ﷺ",
  yamani: "﴿رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ﴾ — تُقال بين الركن اليماني والحجر الأسود (البخاري ومسلم)",
  maqam: "﴿وَاتَّخِذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى﴾ — صلِّ ركعتين خلف المقام إن تيسّر بلا مزاحمة",
  hijr: "حِجر إسماعيل من البيت، والطواف يكون من ورائه — وادعُ بما شئت",
  multazam: "المُلتزم بين الحجر والباب — ادعُ بما أهمّك إن تيسّر بلا أذى",
  safa: "﴿إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ﴾ — أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ",
  marwa: "اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ"
};
function dist(a, b, c, d) { // متر
  const R = 6371000, r = Math.PI / 180;
  const dLat = (c - a) * r, dLng = (d - b) * r;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

/* ============ تتبع الموقع ============ */
const GPS = {
  id: null, pos: null, acc: null,
  inside: {}, lastFire: {},
  start() {
    if (!navigator.geolocation) { notify("الموقع غير مدعوم", "استخدمي العدّ اليدوي"); return; }
    if (this.id !== null) return;
    this.id = navigator.geolocation.watchPosition(
      p => {
        this.pos = p.coords; this.acc = p.coords.accuracy;
        DB.set("lastpos", { lat: p.coords.latitude, lng: p.coords.longitude });
        this.tick();
      },
      e => notify("تعذّر تحديد الموقع", "فعّلي الإذن أو استخدمي العدّ اليدوي"),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
    );
    DB.set("gps", true); renderUmrah();
  },
  stop() { if (this.id !== null) navigator.geolocation.clearWatch(this.id); this.id = null; DB.set("gps", false); renderUmrah(); },
  tick() {
    const c = this.pos; if (!c) return;
    for (const k in SPOTS) {
      const s = SPOTS[k];
      const d = dist(c.latitude, c.longitude, s.lat, s.lng);
      const rIn = s.r + Math.min(this.acc || 0, 25);
      const rOut = rIn + 15; // hysteresis
      if (!this.inside[k] && d <= rIn) {
        this.inside[k] = true;
        if (Date.now() - (this.lastFire[k] || 0) > 15000) { this.lastFire[k] = Date.now(); onSpot(k); }
      } else if (this.inside[k] && d > rOut) this.inside[k] = false;
    }
    const st = document.getElementById("gpsInfo");
    if (st) st.textContent = "دقة الموقع: ±" + AR(Math.round(this.acc || 0)) + " م — " + nearestText(c);
  }
};
function nearestText(c) {
  let best = null, bd = 1e9;
  for (const k in SPOTS) { const s = SPOTS[k]; const d = dist(c.latitude, c.longitude, s.lat, s.lng); if (d < bd) { bd = d; best = s.name; } }
  return bd > 3000 ? "أنت خارج مكة" : "أقرب موضع: " + best + " (" + AR(Math.round(bd)) + " م)";
}

/* ============ حالة العمرة ============ */
const S = {
  get stage() { return DB.get("stage", 0); }, set stage(v) { DB.set("stage", v); },
  get tawaf() { return DB.get("tawaf", 0); }, set tawaf(v) { DB.set("tawaf", v); },
  get saee() { return DB.get("saee", 0); }, set saee(v) { DB.set("saee", v); },
  get saeeAt() { return DB.get("saeeAt", "safa"); }, set saeeAt(v) { DB.set("saeeAt", v); }
};

function onSpot(k) {
  const st = STAGES[S.stage] || {};
  if (k === "hajar") {
    if (st.kind !== "tawaf") { notify("أنت عند الحجر الأسود", SPOT_DUA.hajar); return; }
    if (S.tawaf < 7) {
      S.tawaf = S.tawaf + 1;
      if (S.tawaf === 7) notify("تمّ الطواف 7 أشواط", "اذهب إلى مقام إبراهيم وصلِّ ركعتين");
      else notify("تمّ الشوط " + AR(S.tawaf) + " — ابدأ الشوط " + AR(S.tawaf + 1), SPOT_DUA.hajar);
    }
    renderUmrah(); return;
  }
  if (k === "safa" || k === "marwa") {
    if (st.kind !== "saee") { notify("أنت عند " + SPOTS[k].name, SPOT_DUA[k]); return; }
    if (k !== S.saeeAt) return;           // لا يُحتسب إلا الطرف المقصود
    if (S.saee < 7) {
      S.saee = S.saee + 1;
      S.saeeAt = (k === "safa") ? "marwa" : "safa";
      if (S.saee === 7) notify("تمّ السعي 7 أشواط", "انتهى السعي — ثم الحلق أو التقصير");
      else notify("تمّ الشوط " + AR(S.saee) + " من السعي", "اتجه الآن إلى " + SPOTS[S.saeeAt].name);
    }
    renderUmrah(); return;
  }
  notify("أنت عند " + SPOTS[k].name, SPOT_DUA[k]);
}

/* ============ مراحل العمرة ============ */
const SEC = {};
MANASIK.forEach(s => SEC[s.id] = s);
const STAGES = [
  { t: "الخروج من المنزل", icon: "🏠", kind: "dua", secs: ["home"] },
  { t: "الركوب والسفر", icon: "🚗", kind: "dua", secs: ["ride"] },
  {
    t: "الإحرام والنية من الميقات", icon: "👕", kind: "info", html: `
    <p>الاغتسال والتطيّب في البدن قبل الإحرام، ثم لبس ثوبي الإحرام للرجل، والمرأة تلبس ما شاءت من غير نقاب ولا قفازين.</p>
    <p class="dua">لَبَّيْكَ اللَّهُمَّ عُمْرَةً — لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ</p>
    <div class="src">البخاري ومسلم — التلبية. يُكثر منها الرجل رافعاً صوته، والمرأة تُسمع نفسها، حتى يبدأ الطواف.</div>` },
  { t: "رؤية مكة والمسجد الحرام", icon: "🏙️", kind: "dua", secs: ["makkah", "haram", "door", "kaaba"] },
  { t: "الطواف سبعة أشواط", icon: "🕋", kind: "tawaf", secs: ["tawaf_intro"] },
  { t: "ركعتا الطواف والمقام وزمزم", icon: "🤲", kind: "dua", secs: ["maqam", "hijr", "multazam", "zamzam"] },
  { t: "السعي بين الصفا والمروة", icon: "🏃", kind: "saee", secs: ["saee_intro"] },
  {
    t: "الحلق أو التقصير — تمّت العمرة", icon: "✂️", kind: "info", html: `
    <p>الرجل يحلق رأسه كله أو يقصّر من جميعه، والحلق أفضل. والمرأة تقصّ من أطراف شعرها قدر أُنمُلة.</p>
    <p class="dua">تقبّل الله منك. اللَّهُمَّ اجْعَلْهَا عُمْرَةً مَبْرُورَةً، وَذَنْبًا مَغْفُورًا، وَسَعْيًا مَشْكُورًا.</p>
    <div class="src">«العُمرة إلى العُمرة كفّارة لما بينهما» (البخاري ومسلم)</div>` }
];

/* ============ شاشة العمرة ============ */
function renderUmrah() {
  const v = document.getElementById("v-umrah");
  const i = Math.min(S.stage, STAGES.length - 1);
  const st = STAGES[i];
  let body = "";

  if (st.kind === "tawaf") body = counterCard("tawaf");
  else if (st.kind === "saee") body = counterCard("saee");

  let duas = "";
  (st.secs || []).forEach(id => {
    const s = SEC[id]; if (!s) return;
    duas += `<details ${st.kind === "dua" ? "open" : ""}><summary>${esc(s.title)}</summary><div class="dua">${s.lines.map(l => esc(l)).join("<br>")}</div></details>`;
  });
  if (st.kind === "tawaf") {
    duas += `<div class="card"><h3>الثابت في الطواف عند جمهور العلماء</h3><ul style="font-size:14px">
      <li>التكبير عند محاذاة الحجر الأسود في كل شوط: «الله أكبر» (البخاري).</li>
      <li>بين الركن اليماني والحجر الأسود: ﴿رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ﴾ (أبو داود، صححه الألباني).</li>
      <li>وما عدا ذلك: يدعو المسلم بما شاء من خير الدنيا والآخرة، ويقرأ القرآن ويذكر الله.</li></ul>
      <div class="note">لم يثبت عن النبي ﷺ دعاءٌ مخصوص لكل شوط، وهذا قول جمهور أهل العلم وعليه فتاوى أئمة الحرم واللجنة الدائمة؛ فتخصيص دعاءٍ لكل شوط بدعة إن اعتُقد أنه سنة.</div></div>`;
    duas += `<details><summary>أدعية مختارة للأشواط (دعاء مباح — ليست سنة مخصوصة)</summary><div>${[1, 2, 3, 4, 5, 6, 7].map(n => {
      const s = SEC["tawaf_" + n]; return s ? `<details><summary>${esc(s.title)}</summary><div class="dua">${s.lines.map(esc).join("<br>")}</div></details>` : "";
    }).join("")}<div class="note">هذه أدعية حسنة المعنى من إنشاء الداعين، تُقرأ على أنها دعاء مباح لا على أنها سنة مخصوصة بشوط معيّن، ولا تُنسب للنبي ﷺ.</div></div></details>`;
  }
  if (st.kind === "saee") {
    duas += `<div class="card"><h3>الثابت في السعي عند جمهور العلماء</h3><ul style="font-size:14px">
      <li>عند الدنوّ من الصفا أول مرة يقرأ: ﴿إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ﴾ ويقول: «أبدأ بما بدأ الله به» (مسلم).</li>
      <li>على الصفا والمروة يستقبل القبلة ويكبّر ويقول: «لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير، لا إله إلا الله وحده، أنجز وعده، ونصر عبده، وهزم الأحزاب وحده» ثلاثاً ويدعو بينها بما شاء (مسلم).</li>
      <li>وما بينهما: دعاء وذكر مطلق بلا تخصيص.</li></ul>
      <div class="note">لم يثبت دعاء مخصوص لكل شوط من السعي، وهو قول جمهور العلماء وعليه فتاوى أئمة الحرم واللجنة الدائمة.</div></div>`;
    duas += `<details><summary>أدعية مختارة لأشواط السعي (دعاء مباح — ليست سنة مخصوصة)</summary><div>${[1, 2, 3, 4, 5, 6, 7].map(n => {
      const s = SEC["saee_" + n]; return s ? `<details><summary>${esc(s.title)}</summary><div class="dua">${s.lines.map(esc).join("<br>")}</div></details>` : "";
    }).join("")}${SEC.saee_end ? `<details><summary>${esc(SEC.saee_end.title)}</summary><div class="dua">${SEC.saee_end.lines.map(esc).join("<br>")}</div></details>` : ""}</div></details>`;
  }

  const gpsOn = GPS.id !== null;
  v.innerHTML = `
  <div class="card">
    <div class="mid">الخطوة ${AR(i + 1)} من ${AR(STAGES.length)}</div>
    <h3 style="font-size:22px;text-align:center">${st.icon} ${esc(st.t)}</h3>
    <div class="bar"><i style="width:${((i) / (STAGES.length - 1)) * 100}%"></i></div>
  </div>
  ${body}
  ${st.html ? `<div class="card">${st.html}</div>` : ""}
  ${duas}
  <div class="row">
    ${i > 0 ? `<button class="btn sec" id="prev">السابق</button>` : ""}
    <button class="btn" id="next">${i === STAGES.length - 1 ? "إنهاء وبدء من جديد" : "التالي ←"}</button>
  </div>
  <div class="card">
    <h3>📍 التنبيه بالموقع</h3>
    <p style="font-size:14px">يعمل داخل الحرم: ينبّهك عند الحجر الأسود والركن اليماني والمقام والحِجر والملتزم، ويعدّ أشواط الطواف والسعي تلقائياً.</p>
    <button class="btn ${gpsOn ? "sec" : ""}" id="gps">${gpsOn ? "إيقاف التتبّع" : "تشغيل التتبّع بالموقع"}</button>
    <div class="mid" id="gpsInfo">${gpsOn ? "جارٍ تحديد موقعك…" : "التتبّع متوقف"}</div>
    <label style="display:flex;gap:8px;align-items:center;margin-top:10px"><input type="checkbox" id="spk" ${speakOn ? "checked" : ""} style="width:auto"> نطق التنبيه بالصوت</label>
    <div class="note">دقة GPS داخل المسجد قد تضعف بسبب الازدحام والسقف؛ العدّ التلقائي مساعدة تقنية فقط، وعليك التأكد بنفسك، والعدّ اليدوي متاح دائماً.</div>
  </div>
  <details><summary>مناسك الحج يوماً بيوم</summary><div>
    ${HAJJ_DAYS.map(d => `<h3 style="color:var(--gold2)">${esc(d.day)}</h3><ul>${d.items.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`).join("")}
  </div></details>`;

  const nx = document.getElementById("next");
  nx.onclick = () => { S.stage = (i === STAGES.length - 1) ? 0 : i + 1; if (i === STAGES.length - 1) { S.tawaf = 0; S.saee = 0; S.saeeAt = "safa"; } renderUmrah(); window.scrollTo(0, 0); };
  const pv = document.getElementById("prev"); if (pv) pv.onclick = () => { S.stage = i - 1; renderUmrah(); window.scrollTo(0, 0); };
  document.getElementById("gps").onclick = () => gpsOn ? GPS.stop() : GPS.start();
  document.getElementById("spk").onchange = e => { speakOn = e.target.checked; DB.set("speak", speakOn); };

  v.querySelectorAll("[data-inc]").forEach(b => b.onclick = () => {
    const kind = b.dataset.inc, delta = +b.dataset.d;
    if (kind === "tawaf") S.tawaf = Math.max(0, Math.min(7, S.tawaf + delta));
    else { S.saee = Math.max(0, Math.min(7, S.saee + delta)); if (delta > 0) S.saeeAt = S.saeeAt === "safa" ? "marwa" : "safa"; }
    renderUmrah();
  });
  v.querySelectorAll("[data-pick]").forEach(b => b.onclick = () => openPicker(b.dataset.pick, +b.dataset.sh));
}
const KAABA3D = `<div class="kaabaWrap"><div class="shadow"></div><div class="kaaba">
  <div class="f fr"><i class="belt"></i><i class="studs"></i><i class="curtain"></i><i class="base"></i></div>
  <div class="f bk"><i class="belt"></i><i class="studs"></i><i class="curtain"></i><i class="base"></i></div>
  <div class="f lf"><i class="belt"></i><i class="studs"></i><i class="curtain"></i><i class="base"></i></div>
  <div class="f rt"><i class="belt"></i><i class="studs"></i><i class="curtain"></i><i class="base"></i></div>
  <div class="f tp"></div></div></div>`;
function counterCard(kind) {
  const n = kind === "tawaf" ? S.tawaf : S.saee;
  const label = kind === "tawaf" ? "أشواط الطواف" : "أشواط السعي";
  const hint = kind === "tawaf"
    ? (n >= 7 ? "تمّ الطواف — إلى مقام إبراهيم" : "ابدأ الشوط " + AR(n + 1) + " من الحجر الأسود")
    : (n >= 7 ? "تمّ السعي" : "اتجه إلى " + SPOTS[S.saeeAt].name + " — الشوط " + AR(n + 1));
  return `<div class="card">
    ${kind === "tawaf" ? KAABA3D : ""}
    <div class="mid">${label}</div>
    <div class="big">${AR(n)} من 7</div>
    <div class="dots">${[1, 2, 3, 4, 5, 6, 7].map(x => `<div class="dot ${x <= n ? "on" : ""}">${AR(x)}</div>`).join("")}</div>
    <div class="mid">${esc(hint)}</div>
    <div class="row" style="margin-top:12px">
      <button class="btn sec sm" data-inc="${kind}" data-d="-1">−</button>
      <button class="btn" data-inc="${kind}" data-d="1">+ شوط</button>
    </div>
    <div class="card" style="margin-top:12px"><div class="dua">${esc(kind === "tawaf" ? SPOT_DUA.hajar : SPOT_DUA.safa)}</div>
    <div class="src">${kind === "tawaf" ? "البخاري — التكبير عند محاذاة الحجر الأسود" : "البقرة ١٥٨ / مسلم — حديث جابر في صفة الحج"}</div></div>
  </div>
  ${myDuasCard(kind, Math.min(n + 1, 7))}
  ${spotsGuide(kind)}`;
}

/* ============ دليل المواضع بالرسوم ============ */
function spotsGuide(kind) {
  const keys = kind === "saee" ? ["safa"] : ["hajar", "yamani", "maqam", "hijr", "multazam"];
  const list = SPOT_ART.filter(x => keys.includes(x.k));
  return `<details><summary>تعرّف على المواضع بالصورة</summary><div>
    ${kind === "tawaf" ? `<div class="card"><h3>مخطط الكعبة من الأعلى</h3><div class="art">${KAABA_PLAN}</div></div>` : ""}
    ${list.map(x => `<div class="card">
      <h3>${esc(x.name)}</h3>
      <div class="art">${x.art}</div>
      <p style="font-size:14px"><b>أين هو؟</b> ${esc(x.where)}</p>
      <p style="font-size:14px">${esc(x.what)}</p>
    </div>`).join("")}
    <div class="note">الرسوم توضيحية تقريبية للتعريف بالموضع فقط، وليست صوراً فوتوغرافية.</div>
  </div></details>`;
}

/* ============ مكتبة الأدعية واختيار المستخدم ============ */
const MYDUAS_KEY = "myduas";
const getMyDuas = () => DB.get(MYDUAS_KEY, []);

function buildLib() {
  const out = [];
  DUA_CATEGORIES.forEach(c => c.items.forEach((x, i) =>
    out.push({ id: "c_" + c.id + "_" + i, t: x.t, s: x.s || "", g: c.title })));
  PROPHETS_DUA.forEach((c, ci) => c.items.forEach((x, i) =>
    out.push({ id: "p_" + ci + "_" + i, t: x.t, s: (x.p ? x.p + " — " : "") + (x.s || ""), g: "أدعية الأنبياء: " + c.topic })));
  ADHKAR_SALAH.forEach((x, i) =>
    out.push({ id: "a_" + i, t: x.t, s: x.s || "", g: "أذكار أدبار الصلوات" }));
  MORNING_EVENING.forEach((x, i) =>
    out.push({ id: "me_" + i, t: x.t, s: x.s || "", g: "أذكار الصباح والمساء" }));
  MANASIK.forEach(sec => sec.lines.forEach((l, i) => {
    if (String(l).trim().length < 12) return;
    out.push({ id: "m_" + sec.id + "_" + i, t: l, s: "دعاء مباح — من مختارات المناسك", g: "مناسك: " + sec.title });
  }));
  if (typeof QURAN_DUAS !== "undefined") QURAN_DUAS.forEach(c => c.items.forEach((x, i) =>
    out.push({ id: c.id + "_" + i, t: x.t, s: "قرآن — " + (x.s || ""), g: "أدعية القرآن: " + c.title })));
  getMyDuas().forEach(x =>
    out.push({ id: x.id, t: x.t, s: "دعاء مباح — من إنشائك", g: "أدعيتي الخاصة" }));
  return out;
}

let LIB = buildLib();
let LIBMAP = {}; LIB.forEach(x => LIBMAP[x.id] = x);
let LIBN = [];
function refreshLib() {
  LIB = buildLib();
  LIBMAP = {}; LIB.forEach(x => LIBMAP[x.id] = x);
  LIBN = LIB.map(x => norm(x.t + " " + x.s + " " + x.g));
}

/* بحث ذكي: تطبيع الحروف + مرادفات المواضيع */
const norm = s => String(s)
  .replace(/[\u064B-\u0652\u0670\u06D6-\u06ED\u0640]/g, "")
  .replace(/[\u0622\u0623\u0625\u0627]/g, "ا").replace(/[\u0649\u064A]/g, "ي")
  .replace(/\u0629/g, "ه").replace(/[\u0624\u0626]/g, "ء")
  .replace(/[\u200f\u200e\u061c]/g, "")
  .replace(/[۩﴾﴿۞؛،.,؟!«»"'()\[\]—–-]/g, " ")
  .replace(/\s+/g, " ").trim();

const TOPICS = [
  { k: "رزق", w: ["رزق", "فلوس", "مال", "فقر", "غني", "بركه", "معيشه", "قوت", "خير فقير", "الرزاق", "وسع", "فضلك"] },
  { k: "زواج", w: ["زواج", "زوج", "زوجه", "ازواج", "قره اعين", "نصيب", "عرس", "شريك", "ازواجنا"] },
  { k: "ذريه", w: ["ذريه", "ذريات", "عيال", "اولاد", "ولد", "ابناء", "طفل", "انجاب", "عقم", "الحمل", "غلام", "نسل"] },
  { k: "عمل", w: ["عمل", "وظيفه", "شغل", "مشروع", "تجاره", "توفيق", "نجاح", "مقابله", "امتحان", "دراسه", "استخاره"] },
  { k: "دين", w: ["دين", "قضاء الدين", "ديون", "قرض", "سداد", "ضلع الدين", "مدين"] },
  { k: "هدايه", w: ["هدايه", "اهدنا", "ثبات", "استقامه", "قلب", "ديني", "صلاح", "تقوى", "تقواها", "مقلب القلوب"] },
  { k: "توبه", w: ["توبه", "استغفار", "ذنب", "مغفره", "عفو", "اغفر", "خطيئه", "سيد الاستغفار", "ظلمت نفسي"] },
  { k: "هم", w: ["هم", "حزن", "ضيق", "كرب", "قلق", "خوف", "ضغط", "فرج", "مخرج", "ذي النون", "مكروب"] },
  { k: "مرض", w: ["مرض", "شفاء", "عافيه", "وجع", "الم", "سقم", "طب", "مريض", "الضر"] },
  { k: "حسد", w: ["حسد", "عين", "سحر", "رقيه", "شيطان", "شر", "مكر", "اعوذ"] },
  { k: "والدين", w: ["والد", "والدي", "امي", "ابوي", "بر الوالدين", "ارحمهما", "الجد", "جدتي", "اهلي"] },
  { k: "ميت", w: ["ميت", "موتانا", "قبر", "رحمه", "المتوفي", "جنازه"] },
  { k: "سفر", w: ["سفر", "طريق", "ركوب", "طياره", "رحله", "مسافر"] },
  { k: "علم", w: ["علم", "فهم", "حفظ", "دراسه", "اختبار", "زدني علما", "شرح صدري"] },
  { k: "ظلم", w: ["ظلم", "ظالم", "انصف", "حقي", "انتصر", "مظلوم", "قهر"] },
  { k: "حمايه", w: ["حفظ", "حمايه", "امان", "اعوذ", "شرور", "حرز", "كرب الليل"] },
  { k: "جنه", w: ["جنه", "فردوس", "النار", "الاخره", "حسن الخاتمه", "الموت"] },
  { k: "شكر", w: ["شكر", "نعمه", "حمد", "اوزعني"] },
  { k: "نصر", w: ["نصر", "انصر", "تمكين", "مغلوب", "فانتصر", "الظالمين", "العدو", "جهاد", "المستضعفين", "ثبت اقدامنا", "اهزم"] },
  { k: "عرفه", w: ["عرفه", "عرفات", "الحج", "الوقوف", "ذي الحجه", "التهليل", "لا اله الا الله"] }
];
LIBN = LIB.map(x => norm(x.t + " " + x.s + " " + x.g));

function libSearch(q) {
  const nq = norm(q);
  if (!nq) return LIB;
  const words = nq.split(" ").filter(w => w.length > 1);
  const keys = new Set(words);
  TOPICS.forEach(t => {
    const hit = t.w.some(w => words.some(q2 => w.includes(q2) || q2.includes(w))) || words.includes(t.k);
    if (hit) t.w.forEach(w => keys.add(w));
  });
  const terms = [...keys];
  const out = [];
  LIB.forEach((x, i) => {
    const hay = LIBN[i];
    let score = 0;
    if (hay.includes(nq)) score += 5;
    terms.forEach(t => { if (t.length > 1 && hay.includes(t)) score += 1; });
    if (score) out.push({ x, score });
  });
  return out.sort((a, b) => b.score - a.score).map(o => o.x);
}

const picksKey = (kind, sh) => "picks_" + kind + "_" + sh;
const getPicks = (kind, sh) => DB.get(picksKey(kind, sh), []);
const setPicks = (kind, sh, v) => DB.set(picksKey(kind, sh), v);

function myDuasCard(kind, sh) {
  const ids = getPicks(kind, sh);
  const items = ids.map(id => LIBMAP[id]).filter(Boolean);
  return `<div class="card">
    <h3>أدعيتي في الشوط ${AR(sh)}</h3>
    ${items.length ? items.map(x => `<div class="card"><div class="dua">${esc(x.t)}</div><div class="src">${esc(x.s)}</div></div>`).join("")
      : `<p class="mid">ما اخترتِ أدعية لهذا الشوط بعد.</p>`}
    <button class="btn" data-pick="${kind}" data-sh="${sh}">＋ اختر أدعيتك من المكتبة</button>
    <div class="note">اختيارك يُحفظ في جهازك ويظهر تلقائياً عند هذا الشوط. الدعاء في الطواف والسعي مطلق؛ لا تعتقدي أن ما تختارينه سنة مخصوصة بشوط.</div>
  </div>`;
}

/* كتابة دعاء شخصي مع فحص شرعي مساعد (محلي، بدون إنترنت) */
function openComposer(onSaved) {
  const wrap = document.createElement("div");
  wrap.className = "sheet";
  wrap.innerHTML = `<div class="sheetIn">
    <div class="sheetTop"><b>اكتبي دعاءك</b><button class="btn sec sm" id="cmClose">إغلاق</button></div>
    <textarea id="cmTxt" rows="4" placeholder="اكتبي دعاءك بلفظك… مثال: اللهم ارزقني واشف أمي"></textarea>
    <div class="row"><button class="btn sec" id="cmCheck">فحص الدعاء</button><button class="btn" id="cmSave">حفظ في مكتبتي</button></div>
    <div id="cmRes"></div>
    <div class="note">الفحص آلي مساعد ينبّه على المخالفات الظاهرة فقط، ولا يغني عن سؤال أهل العلم. وما تكتبينه دعاء مباح من إنشائك، لا يُنسب للنبي صلى الله عليه وسلم ولا يُجعل سنة.</div>
  </div>`;
  document.body.appendChild(wrap);
  const txt = wrap.querySelector("#cmTxt"), res = wrap.querySelector("#cmRes");
  const run = () => {
    const r = checkDua(txt.value);
    if (r.level === "empty") { res.innerHTML = `<p class="mid">اكتبي الدعاء أولاً.</p>`; return r; }
    const head = r.level === "block" ? "✖ لا يجوز بهذا اللفظ"
      : r.level === "warn" ? "⚠ يحتاج مراجعة" : "✓ لا مانع ظاهر — دعاء مباح";
    res.innerHTML = `<div class="card dc-${r.level}"><h3>${head}</h3>` +
      (r.hits.length ? r.hits.map(h => `<div class="card"><div class="dua">${esc(h.why)}</div><div class="src">${esc(h.fix)}</div></div>`).join("")
        : `<p class="mid">ادعي بما شئتِ من خيري الدنيا والآخرة، وأفضله ما وافق القرآن والسنة.</p>`) + `</div>`;
    return r;
  };
  wrap.querySelector("#cmCheck").onclick = run;
  wrap.querySelector("#cmSave").onclick = () => {
    const r = run();
    if (r.level === "empty") return;
    if (r.level === "block") { res.innerHTML += `<div class="note">لا يُحفظ هذا الدعاء ولا يُضاف لأشواطك حتى تُعدّلي صياغته.</div>`; return; }
    const list = getMyDuas();
    const id = "u_" + Date.now();
    list.push({ id, t: txt.value.trim() });
    DB.set(MYDUAS_KEY, list);
    refreshLib();
    wrap.remove();
    if (onSaved) onSaved(id);
  };
  wrap.querySelector("#cmClose").onclick = () => wrap.remove();
  wrap.onclick = e => { if (e.target === wrap) wrap.remove(); };
}

function openPicker(kind, sh) {
  const sel = new Set(getPicks(kind, sh));
  const wrap = document.createElement("div");
  wrap.className = "sheet";
  wrap.innerHTML = `<div class="sheetIn">
    <div class="sheetTop">
      <b>مكتبة الأدعية — ${kind === "tawaf" ? "طواف" : "سعي"} · الشوط ${AR(sh)}</b>
      <button class="btn sec sm" id="pkClose">إغلاق</button>
    </div>
    <input id="pkSearch" placeholder="ابحث بالمعنى: الرزق، الزواج، العيال، قضاء الدين، الهداية…">
    <div class="chips" id="pkChips">${["الرزق", "الزواج", "الذرية", "العمل", "قضاء الدين", "الهداية", "التوبة", "الهم والكرب", "الشفاء", "الوالدين", "الحسد", "العلم", "النصر", "قرآن", "أدعيتي"].map(c => `<button class="chip" data-q="${c}">${c}</button>`).join("")}</div>
    <div class="sheetList" id="pkList"></div>
    <div class="row"><button class="btn" id="pkSave">حفظ الاختيار (<span id="pkN">${AR(sel.size)}</span>)</button>
    <button class="btn sec" id="pkNew">✎ اكتبي دعاءك</button></div>
  </div>`;
  document.body.appendChild(wrap);
  const list = wrap.querySelector("#pkList");
  const draw = q => {
    const s = (q || "").trim();
    const items = libSearch(s);
    let g = null, html = "";
    if (s) html += `<div class="pkG">نتائج البحث عن «${esc(s)}» — ${AR(items.length)}</div>`;
    items.slice(0, 400).forEach(x => {
      if (!s && x.g !== g) { g = x.g; html += `<div class="pkG">${esc(g)}</div>`; }
      html += `<label class="pkI"><input type="checkbox" data-id="${x.id}" ${sel.has(x.id) ? "checked" : ""}>
        <span><span class="dua">${esc(x.t)}</span><span class="src">${esc(x.s)}</span></span></label>`;
    });
    list.innerHTML = html || `<p class="mid">لا نتيجة.</p>`;
  };
  draw("");
  list.addEventListener("change", e => {
    const id = e.target.dataset.id; if (!id) return;
    e.target.checked ? sel.add(id) : sel.delete(id);
    wrap.querySelector("#pkN").textContent = AR(sel.size);
  });
  const box = wrap.querySelector("#pkSearch");
  box.oninput = e => draw(e.target.value);
  wrap.querySelectorAll("#pkChips .chip").forEach(c => c.onclick = () => { box.value = c.dataset.q; draw(c.dataset.q); });
  wrap.querySelector("#pkNew").onclick = () => openComposer(id => { sel.add(id); draw(box.value); wrap.querySelector("#pkN").textContent = AR(sel.size); });
  wrap.querySelector("#pkClose").onclick = () => wrap.remove();
  wrap.querySelector("#pkSave").onclick = () => { setPicks(kind, sh, [...sel]); wrap.remove(); renderUmrah(); };
  wrap.onclick = e => { if (e.target === wrap) wrap.remove(); };
}

/* ============ المصحف ============ */
const Q = {
  get page() { return DB.get("qpage", 1); }, set page(v) { DB.set("qpage", Math.max(1, Math.min(604, v))); },
  get marks() { return DB.get("qmarks", []); }, set marks(v) { DB.set("qmarks", v); },
  get plan() { return DB.get("qplan", { pages: 4, log: {} }); }, set plan(v) { DB.set("qplan", v); }
};
function surahOfPage(p) {
  const list = QURAN.pages[String(p)] || [];
  const ids = [...new Set(list.map(x => x[0]))];
  return ids.map(i => QURAN.surahs[i - 1].name).join(" — ");
}
function renderQuran() {
  const v = document.getElementById("v-quran");
  const p = Q.page, refs = QURAN.pages[String(p)] || [];
  const juz = refs.length ? QURAN.surahs[refs[0][0] - 1].a.find(a => a[1] === refs[0][1])[3] : 1;
  let html = "", lastS = null;
  refs.forEach(([si, ai]) => {
    const s = QURAN.surahs[si - 1];
    if (si !== lastS) {
      lastS = si;
      if (ai === 1) html += `<div style="text-align:center;border:1px solid #8a6d22;border-radius:10px;margin:8px 0;padding:6px;color:#8a6d22">سُورَةُ ${esc(s.name)}</div>`;
      else html += `<div style="text-align:center;color:#8a6d22;font-size:13px">— ${esc(s.name)} —</div>`;
    }
    const ay = s.a[ai - 1];
    html += `<span>${esc(ay[0])}<span class="n">${ARI(ai)}</span></span> `;
  });
  const marks = Q.marks, plan = Q.plan;
  const doneDays = Object.keys(plan.log).length;
  v.innerHTML = `
  <div class="chips">
    <button class="chip on" data-q="read">القراءة</button>
    <button class="chip" data-q="surahs">السور</button>
    <button class="chip" data-q="search">بحث</button>
    <button class="chip" data-q="khatmah">الختمة</button>
    <button class="chip" data-q="adab">آداب التلاوة</button>
  </div>
  <div id="qread">
    <div class="qhead"><span>صفحة ${AR(p)} من 604</span><span>الجزء ${AR(juz)}</span><span>${esc(surahOfPage(p))}</span></div>
    <div class="qpage ayah">${html}</div>
    <div class="row">
      <button class="btn sec" id="qprev">الصفحة السابقة</button>
      <button class="btn sec" id="qnext">الصفحة التالية</button>
    </div>
    <div class="row">
      <button class="btn sec sm" id="qmark">${marks.includes(p) ? "★ إزالة العلامة" : "☆ علامة مرجعية"}</button>
      <button class="btn sec sm" id="qdone">✓ قرأت هذه الصفحة اليوم</button>
    </div>
    ${marks.length ? `<div class="card"><h3>العلامات</h3><div class="grid">${marks.map(m => `<button data-go="${m}">صفحة ${AR(m)} — ${esc(surahOfPage(m).split(" — ")[0])}</button>`).join("")}</div></div>` : ""}
    <div class="src">النص: الرسم العثماني من مشروع تنزيل (Tanzil.net) عبر واجهة AlQuran.cloud — 114 سورة، 6236 آية، 604 صفحات. عند أي اشتباه في ضبط كلمة فالمرجع مصحف المدينة المطبوع.</div>
  </div>
  <div id="qsurahs" class="hidden"><div class="grid">${QURAN.surahs.map(s => `<button data-go="${s.page}">${AR(s.n)}. ${esc(s.name)}<div style="font-size:11px;color:var(--dim)">${esc(s.type)} — ${AR(s.count)} آية</div></button>`).join("")}</div></div>
  <div id="qsearch" class="hidden">
    <input id="qq" placeholder="ابحث في القرآن… مثال: الصفا والمروة">
    <div id="qres"></div>
  </div>
  <div id="qkhatmah" class="hidden">
    <div class="card"><h3>خطة الختمة</h3>
      <label>عدد الصفحات يومياً</label>
      <input type="number" id="qpp" value="${plan.pages}" min="1" max="60">
      <p>الختمة في ${AR(Math.ceil(604 / plan.pages))} يوماً — أنجزت ${AR(doneDays)} يوماً.</p>
      <div class="bar"><i style="width:${Math.min(100, (p / 604) * 100)}%"></i></div>
      <p class="mid">وصلت إلى صفحة ${AR(p)} — ${AR(Math.round((p / 604) * 100))}٪</p>
      <button class="btn" id="qtoday">اقرأ ورد اليوم (${AR(plan.pages)} صفحات)</button>
    </div>
  </div>
  <div id="qadab" class="hidden"><div class="card"><h3>الاستخدام الصحيح للمصحف</h3>
    <ul>
      <li>الاستعاذة قبل القراءة: ﴿فَإِذَا قَرَأْتَ الْقُرْآنَ فَاسْتَعِذْ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ﴾ (النحل ٩٨)، ثم البسملة في أول السورة إلا التوبة.</li>
      <li>الترتيل والتدبر: ﴿وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا﴾ (المزمل ٤) — قليلٌ بتدبر خير من كثير بلا فهم.</li>
      <li>تعاهُد الحفظ: «تعاهدوا هذا القرآن، فوالذي نفسي بيده لهو أشدُّ تفلُّتاً من الإبل في عُقُلها» (البخاري ومسلم).</li>
      <li>لا يُشترط الوضوء لقراءة القرآن من الشاشة، والأفضل أن تكون على طهارة.</li>
      <li>الجهر بالقراءة حيث لا يُشوّش على مصلٍّ أو قارئ.</li>
      <li>إذا شككت في ضبط كلمة فارجع إلى مصحف مطبوع معتمد أو أهل العلم بالقراءات.</li>
    </ul></div>
    <div class="card"><h3>قبل التلاوة</h3>
      <div class="dua">أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ — بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
      <div class="src"><span class="tag q">قرآن</span> النحل ٩٨ — هذا هو الثابت المشروع قبل القراءة.</div>
    </div>
    <div class="card"><h3>دعاء يُقال قبل التلاوة أو بعدها</h3>
      <div class="dua">اللَّهُمَّ ذَكِّرْنَا مِنْهُ مَا نَسِينَا، وَعَلِّمْنَا مِنْهُ مَا جَهِلْنَا، وَارْزُقْنَا تِلَاوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ، وَاجْعَلْهُ لَنَا حُجَّةً يَا رَبَّ الْعَالَمِينَ</div>
      <div class="note">وردت هذه الألفاظ في رواية مرفوعة ضعّف إسنادَها أهل الحديث، فلا تُنسب إلى النبي ﷺ على أنها سنة ثابتة، ومعناها حسن فيجوز الدعاء بها كدعاء مطلق بلا تحديد عدد ولا وقت.</div>
      <div class="src"><span class="tag d">دعاء مباح — لم يثبت رفعه</span></div>
    </div>
    <div class="card"><h3>عند نسيان آية</h3>
      <div class="note">من نسي آية فلا حرج عليه؛ قال ﷺ لمّا سمع قارئاً: «رحمه الله، لقد أذكرني آية كنت أُنسيتها» (البخاري ومسلم). ويُكره أن يقول: «نسيتُ آية كذا» بل يقال: «نُسِّيتُها».</div>
      <div class="src"><span class="tag s">سنة صحيحة</span> البخاري ومسلم</div>
    </div></div>`;

  const show = k => {
    ["read", "surahs", "search", "khatmah", "adab"].forEach(x => document.getElementById("q" + x).classList.toggle("hidden", x !== k));
    v.querySelectorAll("[data-q]").forEach(b => b.classList.toggle("on", b.dataset.q === k));
  };
  v.querySelectorAll("[data-q]").forEach(b => b.onclick = () => show(b.dataset.q));
  document.getElementById("qprev").onclick = () => { Q.page = p - 1; renderQuran(); window.scrollTo(0, 0); };
  document.getElementById("qnext").onclick = () => { Q.page = p + 1; renderQuran(); window.scrollTo(0, 0); };
  document.getElementById("qmark").onclick = () => { const m = Q.marks; Q.marks = m.includes(p) ? m.filter(x => x !== p) : [...m, p].sort((a, b) => a - b); renderQuran(); };
  document.getElementById("qdone").onclick = () => { const pl = Q.plan; pl.log[today()] = (pl.log[today()] || 0) + 1; Q.plan = pl; Q.page = p + 1; notify("بارك الله فيك", "تم تسجيل صفحة في ختمتك"); renderQuran(); SUM.render(); };
  document.getElementById("qpp").onchange = e => { const pl = Q.plan; pl.pages = Math.max(1, +e.target.value || 1); Q.plan = pl; renderQuran(); show("khatmah"); };
  document.getElementById("qtoday").onclick = () => { show("read"); window.scrollTo(0, 0); };
  v.querySelectorAll("[data-go]").forEach(b => b.onclick = () => { Q.page = +b.dataset.go; renderQuran(); show("read"); window.scrollTo(0, 0); });
  const qq = document.getElementById("qq");
  qq.oninput = () => {
    const t = qq.value.trim(); const box = document.getElementById("qres");
    if (t.length < 3) { box.innerHTML = ""; return; }
    const norm = s => s.replace(/[\u064B-\u0652\u0653-\u065F\u0670\u06D6-\u06ED]/g, "").replace(/[إأآا]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");
    const nt = norm(t); const out = [];
    for (const s of QURAN.surahs) { for (const a of s.a) { if (norm(a[0]).includes(nt)) { out.push([s, a]); if (out.length > 40) break; } } if (out.length > 40) break; }
    box.innerHTML = out.length ? out.map(([s, a]) => `<div class="card"><div class="dua">${esc(a[0])}</div><div class="src">${esc(s.name)} — آية ${AR(a[1])} — <button class="chip" data-go="${a[2]}">صفحة ${AR(a[2])}</button></div></div>`).join("") : `<p class="mid">لا نتائج</p>`;
    box.querySelectorAll("[data-go]").forEach(b => b.onclick = () => { Q.page = +b.dataset.go; renderQuran(); });
  };
}

/* ============ الأذكار والأدعية ============ */
function item(x) {
  const src = x.s || "";
  const cls = x.tag === "ق" ? "q" : x.tag === "م" ? "m" : x.tag === "س" ? "h"
    : /﴿|سورة|البقرة|آل عمران|طه|الطور|الأحزاب|نوح|الحشر|إبراهيم|الإسراء|الفرقان|القصص|القمر|الأنبياء|الأحقاف|النحل/.test(src) ? "q"
    : (/مباح|السلف|حساب/.test(src) ? "m" : "h");
  const tag = cls === "q" ? "قرآن" : cls === "m" ? "دعاء مباح" : "سنة";
  return `<div class="card">
    <div class="dua">${esc(x.t)}</div>
    ${x.n && x.n > 1 ? `<div class="count"><span>التكرار المطلوب</span><b>${AR(x.n)}</b></div>${tasbih(x.t, x.n)}` : ""}
    ${x.note ? `<div class="note">${esc(x.note)}</div>` : ""}
    <div class="src"><span class="tag ${cls}">${tag}</span> ${esc(src)}${x.when ? " — " + esc(x.when) : ""}</div>
  </div>`;
}
function tasbih(key, n) {
  const id = "t" + Math.abs([...key].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7));
  const c = DB.get("cnt_" + id + "_" + today(), 0);
  return `<div class="count" id="box_${id}"><button class="cbtn" data-cnt="${id}" data-n="${n}" data-d="-1">−</button>
    <div class="bar" style="flex:1"><i style="width:${Math.min(100, (c / n) * 100)}%"></i></div>
    <b id="c_${id}">${AR(c)}</b>
    <button class="cbtn" data-cnt="${id}" data-n="${n}" data-d="1" style="background:var(--gold);color:#26200d">+</button></div>`;
}
function bindCounters(root) {
  root.querySelectorAll("[data-cnt]").forEach(b => b.onclick = () => {
    const id = b.dataset.cnt, k = "cnt_" + id + "_" + today();
    const v = Math.max(0, DB.get(k, 0) + (+b.dataset.d));
    DB.set(k, v);
    const out = root.querySelector("#c_" + id); if (out) out.textContent = AR(v);
    const n = +b.dataset.n || 100;
    const bar = root.querySelector("#box_" + id + " .bar > i");
    if (bar) bar.style.width = Math.min(100, (v / n) * 100) + "%";
    if (navigator.vibrate) navigator.vibrate(15);
    if (v === n) notify("أتممت العدد", "بارك الله فيك");
    SUM.render();
  });
}
const ADHKAR_TABS = [
  { k: "salah", t: "بعد الصلاة", r: () => ADHKAR_SALAH.map(item).join("") },
  { k: "sabah", t: "أذكار الصباح", r: () => `<div class="note">وقتها من بعد الفجر إلى طلوع الشمس، ومن فاته فلا حرج أن يقولها إلى الزوال.</div>` + MORNING_EVENING.filter(x => !/المساء خاصة/.test(x.when || "")).map(item).join("") },
  { k: "masa", t: "أذكار المساء", r: () => `<div class="note">وقتها من بعد العصر إلى غروب الشمس، ويمتد إلى نصف الليل لمن فاته.</div>` + MORNING_EVENING.filter(x => !/^الصباح$/.test(x.when || "")).map(item).join("") },
  { k: "tasbih", t: "أوقات التسبيح", r: () => TASBIH_TIMES.map(x => `<div class="card"><h3>${esc(x.title)}</h3><div class="dua" style="color:#8fe0b6">${esc(x.ayah)}</div><div class="src">${esc(x.ref)}</div><p><b>الوقت:</b> ${esc(x.when)}</p><p class="dua">${esc(x.what)}</p><div class="count"><span>التكرار</span><b>${AR(x.n)}</b></div>${tasbih(x.title, x.n)}<div class="src">${esc(x.s)}</div></div>`).join("") },
  { k: "safar", t: "السفر", r: () => `<div class="card"><h3>أحكام صلاة المسافر</h3>${SAFAR.ahkam.map(a => `<p><b>${esc(a.t)}:</b> ${esc(a.d)}<div class="src">${esc(a.s)}</div></p>`).join("")}</div>` + SAFAR.adhkar.map(item).join("") },
  { k: "tadabbur", t: "جدول التدبّر", r: () => TADABBUR_SCHEDULE.map(s => `<div class="card"><h3>${esc(s.salah)} — ${AR(s.mins)} دقيقة</h3><ol>${s.plan.map(p => `<li>${esc(p)}</li>`).join("")}</ol></div>`).join("") },
  { k: "anbiya", t: "أدعية الأنبياء", r: () => PROPHETS_DUA.map(g => `<details open><summary>${esc(g.topic)}</summary><div>${g.items.map(x => `<div class="card"><div class="mid" style="color:var(--gold2)">${esc(x.p)}</div><div class="dua">${esc(x.t)}</div>${x.n && x.n > 1 ? `<div class="count"><span>التكرار المقترح</span><b>${AR(x.n)}</b></div>${tasbih(x.p + x.t, x.n)}` : ""}${x.note ? `<div class="note">${esc(x.note)}</div>` : ""}<div class="src"><span class="tag q">قرآن</span> ${esc(x.s)}</div></div>`).join("")}</div></details>`).join("") },
  { k: "dua", t: "الأدعية المصنّفة", r: () => DUA_CATEGORIES.map(c => `<details><summary>${esc(c.title)}</summary><div>${c.note ? `<div class="note">${esc(c.note)}</div>` : ""}${c.items.map(item).join("")}</div></details>`).join("") },
  { k: "arafah", t: "يوم عرفة", r: () => arafahView() },
  { k: "ibn", t: "من هدي ابن تيمية", r: () => IBN_TAYMIYYAH.map(x => `<div class="card"><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p><div class="src">${esc(x.s)}</div></div>`).join("") },
  { k: "picks", t: "مختارات", r: () => `<div class="note">منقولة من حساب الشيخ مصطفى حسني — تُعامَل كأدعية مباحة لا كأحاديث، والقرآن منها موثّق بمصدره.</div>` + HOSNY_PICKS.map(item).join("") }
];
function arafahProgram(rows) {
  return rows.map(x => `<div class="card"><h3>${esc(x.w)}</h3><p>${esc(x.d)}</p>${x.s ? `<div class="src">${esc(x.s)}</div>` : ""}</div>`).join("");
}

function arafahView() {
  const who = DB.get("arafah_who", "ghayr");
  return `<div class="note">${esc(ARAFAH.note)}</div>
  <div class="chips">
    <button class="chip ${who === "hajj" ? "on" : ""}" data-arw="hajj">برنامج الحاجّ بعرفة</button>
    <button class="chip ${who === "ghayr" ? "on" : ""}" data-arw="ghayr">برنامج غير الحاجّ</button>
  </div>
  <div class="card"><h3>فضل اليوم</h3>${ARAFAH.fadl.map(x => `<div class="card"><div class="dua">${esc(x.t)}</div><div class="src">${esc(x.s)}</div></div>`).join("")}</div>
  <h3 style="margin:14px 4px 6px">برنامج اليوم بالترتيب</h3>
  ${arafahProgram(who === "hajj" ? ARAFAH.hajj : ARAFAH.ghayr)}
  <h3 style="margin:14px 4px 6px">ذكر ودعاء اليوم</h3>
  ${ARAFAH.adhkar.map(item).join("")}
  <div class="card"><h3>تنبيهات أهل العلم</h3><ul>${ARAFAH.tanbih.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div>`;
}

function renderAdhkar(tab) {
  const v = document.getElementById("v-adhkar");
  const k = tab || DB.get("atab", "salah"); DB.set("atab", k);
  const cur = ADHKAR_TABS.find(x => x.k === k) || ADHKAR_TABS[0];
  v.innerHTML = `<div class="chips">${ADHKAR_TABS.map(x => `<button class="chip ${x.k === k ? "on" : ""}" data-a="${x.k}">${x.t}</button>`).join("")}</div>
  <div class="note">التصنيف: <span class="tag q">قرآن</span> آية، <span class="tag h">سنة</span> ثابت عن النبي ﷺ، <span class="tag m">دعاء مباح</span> ليس حديثاً، تدعو به بلا نسبة للنبي ﷺ.</div>
  ${cur.r()}`;
  v.querySelectorAll("[data-a]").forEach(b => b.onclick = () => { renderAdhkar(b.dataset.a); window.scrollTo(0, 0); });
  v.querySelectorAll("[data-arw]").forEach(b => b.onclick = () => { DB.set("arafah_who", b.dataset.arw); renderAdhkar("arafah"); });
  bindCounters(v);
}

/* ============ الورد اليومي + التنبيهات ============ */
function wird() { return DB.get("wird", DEFAULT_WIRD); }
function renderWird() {
  const v = document.getElementById("v-wird");
  const w = wird(), d = today();
  let done = 0, total = 0;
  const cards = w.map((x, i) => {
    const c = DB.get("w_" + i + "_" + d, 0);
    done += Math.min(c, x.n); total += x.n;
    return `<div class="card">
      <div class="dua">${esc(x.t)}</div>
      <div class="count"><span>${AR(c)} من ${AR(x.n)}</span>
        <div class="bar" style="flex:1"><i style="width:${Math.min(100, (c / x.n) * 100)}%"></i></div>
        <button class="cbtn" data-w="${i}" data-d="-1">−</button>
        <button class="cbtn" data-w="${i}" data-d="1" style="background:var(--gold);color:#26200d">+</button>
        <button class="cbtn" data-del="${i}" style="font-size:14px">🗑</button>
      </div></div>`;
  }).join("");
  const pct = total ? Math.round((done / total) * 100) : 0;
  const streak = DB.get("streak", 0);
  const rem = DB.get("rem", { sabah: "05:30", masa: "17:30", wird: "21:00", on: false });
  v.innerHTML = `
  <div class="card"><div class="mid">ورد اليوم</div><div class="big">${AR(pct)}٪</div>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <div class="mid" style="margin-top:6px">${AR(done)} من ${AR(total)} — أيام متتابعة: ${AR(streak)}</div></div>
  ${cards}
  <div class="card"><h3>أضف ذكراً إلى وردك</h3>
    <input id="wt" placeholder="نص الذكر"><div style="height:8px"></div>
    <input id="wn" type="number" value="33" min="1" placeholder="عدد التكرار">
    <button class="btn" id="wadd">إضافة</button>
    <button class="btn sec sm" id="wreset">استعادة الورد الافتراضي</button>
  </div>
  <div class="card"><h3>🔔 التنبيهات</h3>
    <label>أذكار الصباح</label><input type="time" id="r1" value="${rem.sabah}">
    <label>أذكار المساء</label><input type="time" id="r2" value="${rem.masa}">
    <label>الورد اليومي</label><input type="time" id="r3" value="${rem.wird}">
    <button class="btn ${rem.on ? "sec" : ""}" id="rtog">${rem.on ? "إيقاف التنبيهات" : "تفعيل التنبيهات"}</button>
    <div class="note">التنبيه يعمل ما دام التطبيق مفتوحاً أو في الخلفية على الجوال بعد السماح بالإشعارات.</div>
  </div>`;
  v.querySelectorAll("[data-w]").forEach(b => b.onclick = () => {
    const i = b.dataset.w, k = "w_" + i + "_" + d;
    const n = wird()[i].n, val = Math.max(0, DB.get(k, 0) + (+b.dataset.d));
    DB.set(k, val);
    if (val === n) notify("أتممت الذكر", wird()[i].t);
    if (navigator.vibrate) navigator.vibrate(15);
    renderWird();
  });
  v.querySelectorAll("[data-del]").forEach(b => b.onclick = () => { const w2 = wird(); w2.splice(+b.dataset.del, 1); DB.set("wird", w2); renderWird(); });
  document.getElementById("wadd").onclick = () => {
    const t = document.getElementById("wt").value.trim(), n = +document.getElementById("wn").value || 1;
    if (!t) return; DB.set("wird", [...wird(), { t, n }]); renderWird();
  };
  document.getElementById("wreset").onclick = () => { DB.set("wird", DEFAULT_WIRD); renderWird(); };
  document.getElementById("rtog").onclick = async () => {
    const r = { sabah: document.getElementById("r1").value, masa: document.getElementById("r2").value, wird: document.getElementById("r3").value, on: !rem.on };
    if (r.on && "Notification" in window && Notification.permission !== "granted") { try { await Notification.requestPermission(); } catch (e) { } }
    DB.set("rem", r); renderWird();
  };
  if (pct === 100 && DB.get("lastFull", "") !== d) { DB.set("lastFull", d); DB.set("streak", streak + 1); }
  SUM.render();
}
setInterval(() => {
  const r = DB.get("rem", { on: false }); if (!r.on) return;
  const now = new Date().toTimeString().slice(0, 5), k = "fired_" + today() + "_" + now;
  if (DB.get(k, false)) return;
  if (now === r.sabah) { DB.set(k, true); notify("أذكار الصباح", "حان وقت أذكار الصباح"); }
  if (now === r.masa) { DB.set(k, true); notify("أذكار المساء", "حان وقت أذكار المساء"); }
  if (now === r.wird) { DB.set(k, true); notify("وردك اليومي", "بقي من وردك ما لم تُتمّه"); }
}, 30000);

/* ============ اسألني ============ */
function renderAsk(id) {
  const v = document.getElementById("v-ask");
  if (!id) {
    v.innerHTML = `<div class="card"><h3>كيف حالك الآن؟</h3><p>اختر ما تشعر به، وأدلّك على ذكر ودعاء ثابت بخطوات.</p></div>
    <div class="grid">${MOODS.map(m => `<button data-m="${m.id}">${esc(m.label)}</button>`).join("")}</div>
    <div class="note">هذا إرشاد للذكر والدعاء، وليس فتوى ولا علاجاً طبياً أو نفسياً؛ عند الحاجة راجع عالماً موثوقاً أو مختصاً.</div>`;
    v.querySelectorAll("[data-m]").forEach(b => b.onclick = () => renderAsk(b.dataset.m));
    return;
  }
  const m = MOODS.find(x => x.id === id);
  v.innerHTML = `<button class="btn sec sm" id="back">→ رجوع</button>
  <div class="card"><h3>${esc(m.label)}</h3>${m.intro ? `<p>${esc(m.intro)}</p>` : ""}</div>
  ${m.steps.map((s, i) => `<div class="card"><div class="mid">الخطوة ${AR(i + 1)}</div>${item(s)}</div>`).join("")}`;
  document.getElementById("back").onclick = () => renderAsk();
  bindCounters(v);
}

/* ============ التنقل ============ */
const RENDER = { home: () => renderHome(), umrah: renderUmrah, quran: renderQuran, adhkar: () => renderAdhkar(), wird: renderWird, ask: () => renderAsk() };
const TITLES = { home: ["قانتون", "ملخص يومك ومدخل كل قسم"], umrah: ["قانتون", "مناسك العمرة والحج بالترتيب"], quran: ["المصحف", "604 صفحات — بالرسم العثماني"], adhkar: ["الأذكار والأدعية", "بالمصدر وعدد التكرار"], wird: ["الورد اليومي", "تابع إنجازك يومياً"], ask: ["اسألني", "ذكرٌ لكل حال"] };
function go(v) {
  if (!RENDER[v]) v = "home";
  ["home", "umrah", "quran", "adhkar", "wird", "ask", "time"].forEach(x => document.getElementById("v-" + x).classList.toggle("hidden", x !== v));
  document.getElementById("summary").classList.toggle("hidden", v !== "home");
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("on", b.dataset.v === v));
  document.getElementById("hTitle").textContent = TITLES[v][0];
  document.getElementById("hSub").textContent = TITLES[v][1];
  RENDER[v]();
  DB.set("view", v); window.scrollTo(0, 0);
  if (location.hash.slice(1) !== v) history.replaceState(null, "", "#" + v);
}
document.querySelectorAll("#nav button").forEach(b => b.onclick = () => go(b.dataset.v));
addEventListener("hashchange", () => { const h = location.hash.slice(1); if (h && RENDER[h]) go(h); });

/* ============ سماء التطبيق: لون الوقت ============
   تدرّج السماء يتغيّر مع الشمس في موقعك: فجر، شروق، ضحى، ظهر، عصر، غروب، ليل بنجوم.
   الحساب فلكي محلي بلا إنترنت، وهو للجمال فقط لا لتحديد أوقات الصلاة. */
const SKY_PHASES = {
  fajr: "الفجر — قبيل الشروق",
  shuruq: "الشروق",
  duha: "الضحى",
  dhuhr: "الظهيرة",
  asr: "العصر",
  maghrib: "الغروب",
  isha: "الليل"
};
function sunTimes(date, lat, lng) { // ساعات محلية عشرية: الشروق والغروب والزوال
  const rad = Math.PI / 180;
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const doy = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start) / 86400000);
  const g = (357.529 + 0.98560028 * (doy - 1)) * rad;
  const decl = 23.44 * rad * Math.sin((280.46 + 0.9856474 * doy) * rad + 1.915 * rad * Math.sin(g));
  const eqt = 4 * (1.9148 * Math.sin(g) + 0.02 * Math.sin(2 * g)) - 7.66 * Math.sin(g); // دقائق (تقريب)
  const tzOffset = -date.getTimezoneOffset() / 60;
  const noon = 12 - lng / 15 - eqt / 60 + tzOffset;
  const cosH = (Math.cos(90.833 * rad) - Math.sin(lat * rad) * Math.sin(decl)) / (Math.cos(lat * rad) * Math.cos(decl));
  const H = Math.abs(cosH) > 1 ? 6 : Math.acos(cosH) / rad / 15;
  return { noon, sunrise: noon - H, sunset: noon + H };
}
function skyPhase(now, lat, lng) {
  const t = now.getHours() + now.getMinutes() / 60;
  const { noon, sunrise, sunset } = sunTimes(now, lat, lng);
  if (t >= sunrise - 1.4 && t < sunrise) return "fajr";
  if (t >= sunrise && t < sunrise + 1) return "shuruq";
  if (t >= sunrise + 1 && t < noon - 0.5) return "duha";
  if (t >= noon - 0.5 && t < noon + (sunset - noon) / 2) return "dhuhr";
  if (t >= noon + (sunset - noon) / 2 && t < sunset - 0.5) return "asr";
  if (t >= sunset - 0.5 && t < sunset + 0.6) return "maghrib";
  return "isha";
}
const SKY = {
  stars: [], raf: 0,
  pos() { return DB.get("lastpos", { lat: 21.4225, lng: 39.8262 }); },
  mode() { return DB.get("skymode", "auto"); },
  apply() {
    const m = this.mode();
    const p = this.pos();
    const ph = m === "auto" ? skyPhase(new Date(), p.lat, p.lng) : m;
    document.documentElement.dataset.sky = ph;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue("--sky1").trim() || "#e6efe9";
    const n = document.getElementById("skyName");
    if (n) n.textContent = (m === "auto" ? "سماء " : "سماء ثابتة: ") + SKY_PHASES[ph];
    this.draw();
  },
  build() {
    const c = document.getElementById("stars");
    if (!c) return;
    c.width = innerWidth; c.height = innerHeight;
    const count = Math.round((innerWidth * innerHeight) / 9000);
    this.stars = Array.from({ length: count }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height * 0.85,
      r: Math.random() * 1.3 + 0.3, ph: Math.random() * Math.PI * 2,
      sp: 0.6 + Math.random() * 1.6
    }));
  },
  draw() {
    const c = document.getElementById("stars");
    if (!c) return;
    const vis = +getComputedStyle(document.documentElement).getPropertyValue("--starOp") > 0;
    cancelAnimationFrame(this.raf);
    const ctx = c.getContext("2d");
    if (!vis) { ctx.clearRect(0, 0, c.width, c.height); return; }
    const tick = () => {
      const t = Date.now() / 1000;
      ctx.clearRect(0, 0, c.width, c.height);
      for (const s of this.stars) {
        const a = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph));
        ctx.globalAlpha = a;
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
      this.raf = requestAnimationFrame(tick);
    };
    tick();
  },
  cycle() {
    const order = ["auto", "fajr", "shuruq", "duha", "dhuhr", "asr", "maghrib", "isha"];
    DB.set("skymode", order[(order.indexOf(this.mode()) + 1) % order.length]);
    this.apply();
  }
};
document.documentElement.dataset.motion = DB.get("motion", true) ? "on" : "off";
SKY.build(); SKY.apply();
setInterval(() => SKY.apply(), 60000);
addEventListener("resize", () => { SKY.build(); SKY.draw(); });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) cancelAnimationFrame(SKY.raf); else SKY.apply();
});
document.getElementById("skyName").onclick = () => SKY.cycle();



/* ============ رسم القمر: الطور الحقيقي وميلان الهلال ============ */
const MOON = {
  now() { const p = SKY.pos(); return moonInfo(new Date(), p.lat, p.lng); },
  draw() {
    const c = document.getElementById("moonc"); if (!c) return;
    const m = this.now(), ctx = c.getContext("2d"), R = 62, cx = 80, cy = 80;
    ctx.clearRect(0, 0, 160, 160);
    if (m.age < 0.8 || m.age > 28.9) { document.getElementById("moon").style.setProperty("--moonOp", "0"); return; }
    document.getElementById("moon").style.removeProperty("--moonOp");
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(m.tilt * Math.PI / 180); ctx.translate(-cx, -cy);
    /* القرص المعتم */
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7);
    ctx.fillStyle = "rgba(190,200,220,.10)"; ctx.fill();
    /* الجزء المضيء: نصف دائرة + قطع ناقص للحدّ الفاصل */
    const k = m.illum, half = Math.PI / 2;
    const dir = m.waxing ? 1 : -1;
    ctx.beginPath();
    ctx.arc(cx, cy, R, -half, half, dir < 0);
    ctx.ellipse(cx, cy, R * Math.abs(1 - 2 * k), R, 0, half, -half, (k > 0.5) !== (dir > 0));
    ctx.closePath();
    const g = ctx.createRadialGradient(cx - 10 * dir, cy - 12, 4, cx, cy, R);
    g.addColorStop(0, "#fffdf3"); g.addColorStop(1, "#e6dcc2");
    ctx.fillStyle = g; ctx.fill();
    ctx.restore();
    const t = document.getElementById("moon");
    if (t) t.title = `${m.phase} — ${Math.round(m.illum * 100)}٪ — منزلة ${m.mansion}`;
  }
};

/* ============ الطقس والطوارئ (يحتاج إنترنت، ويعمل بدونه من الذاكرة) ============ */
const WX_CODES = {
  rain: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
  storm: [95, 96, 99],
  dust: [], snow: [71, 73, 75, 77, 85, 86], fog: [45, 48]
};
const WX = {
  data() { return DB.get("wx", null); },
  async refresh(force) {
    const d = this.data();
    if (!force && d && Date.now() - d.at < 1800000) { this.apply(); return d; }
    if (!navigator.onLine) { this.apply(); return d; }
    const p = SKY.pos();
    try {
      const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lng}&current=temperature_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&timezone=auto`);
      const j = await r.json(); const c = j.current || {};
      const out = { at: Date.now(), t: c.temperature_2m, code: c.weather_code, wind: c.wind_speed_10m, gust: c.wind_gusts_10m, prec: c.precipitation };
      DB.set("wx", out); this.apply(); this.alert(out); return out;
    } catch (e) { this.apply(); return d; }
  },
  state(d) {
    if (!d) return null;
    if (WX_CODES.storm.includes(d.code)) return { k: "storm", label: "عاصفة رعدية", ev: "thunder" };
    if (WX_CODES.rain.includes(d.code) || d.prec > 0.2) return { k: "rain", label: "مطر", ev: "rain" };
    if ((d.gust || d.wind) >= 40) return { k: "wind", label: "رياح شديدة", ev: "wind" };
    if (d.t >= 45) return { k: "heat", label: "حرّ شديد", ev: "heat" };
    if (WX_CODES.fog.includes(d.code)) return { k: "fog", label: "ضباب", ev: null };
    return { k: "clear", label: "صحو", ev: null };
  },
  apply() {
    const s = this.state(this.data());
    document.documentElement.dataset.wx = s ? s.k : "clear";
    const r = document.getElementById("rain");
    if (r) r.classList.toggle("on", !!s && (s.k === "rain" || s.k === "storm"));
    LIFE.rainOn = !!s && (s.k === "rain" || s.k === "storm");
    LIFE.stormOn = !!s && s.k === "storm";
  },
  alert(d) {
    const s = this.state(d); if (!s || !s.ev) return;
    const key = "wxa_" + s.k + "_" + new Date().toISOString().slice(0, 13);
    if (DB.get(key, false)) return; DB.set(key, true);
    const ev = EVENTS.find(e => e.id === s.ev); if (!ev) return;
    notify(s.label + " — " + ev.label, ev.items[0].t);
  },
  async quakes() {
    if (!navigator.onLine) return DB.get("quakes", []);
    try {
      const r = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson");
      const j = await r.json(); const p = SKY.pos();
      const near = (j.features || []).map(f => ({
        m: f.properties.mag, place: f.properties.place, time: f.properties.time,
        km: Math.round(dist(p.lat, p.lng, f.geometry.coordinates[1], f.geometry.coordinates[0]) / 1000)
      })).filter(x => x.km < 800).sort((a, b) => a.km - b.km);
      DB.set("quakes", near);
      if (near.length) {
        const k = "qk_" + near[0].time;
        if (!DB.get(k, false)) {
          DB.set(k, true);
          const ev = EVENTS.find(e => e.id === "quake");
          notify("هزة أرضية قريبة — " + AR(near[0].km) + " كم", ev.items[1].t);
        }
      }
      return near;
    } catch (e) { return DB.get("quakes", []); }
  }
};

/* ============ خلفية حيّة: مطر، برق، شهب، طيور، ذرات نور ============ */
const LIFE = {
  raf: 0, drops: [], birds: [], motes: [], meteor: null, flash: 0, rainOn: false, stormOn: false,
  ok() { return DB.get("motion", true) && !matchMedia("(prefers-reduced-motion: reduce)").matches; },
  build() {
    for (const id of ["rain", "life"]) {
      const c = document.getElementById(id); if (!c) continue;
      c.width = innerWidth; c.height = innerHeight;
    }
    this.drops = Array.from({ length: 160 }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, l: 8 + Math.random() * 18, v: 6 + Math.random() * 9 }));
    this.motes = Array.from({ length: 26 }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: 0.8 + Math.random() * 1.8, v: 0.15 + Math.random() * 0.35, ph: Math.random() * 6 }));
    this.birds = [];
  },
  start() {
    cancelAnimationFrame(this.raf);
    if (!this.ok()) { const c = document.getElementById("life"); if (c) c.getContext("2d").clearRect(0, 0, c.width, c.height); return; }
    const rc = document.getElementById("rain"), lc = document.getElementById("life");
    if (!rc || !lc) return;
    const rx = rc.getContext("2d"), lx = lc.getContext("2d");
    const night = () => ["isha", "fajr", "maghrib"].includes(document.documentElement.dataset.sky);
    const tick = () => {
      const W = innerWidth, H = innerHeight, t = Date.now() / 1000;
      /* مطر */
      rx.clearRect(0, 0, W, H);
      if (this.rainOn) {
        rx.strokeStyle = "rgba(190,215,240,.55)"; rx.lineWidth = 1.1;
        for (const d of this.drops) {
          rx.beginPath(); rx.moveTo(d.x, d.y); rx.lineTo(d.x - 2, d.y + d.l); rx.stroke();
          d.y += d.v; d.x -= 0.6;
          if (d.y > H) { d.y = -20; d.x = Math.random() * W; }
        }
        if (this.stormOn && Math.random() < 0.0025) this.flash = 1;
      }
      /* برق */
      lx.clearRect(0, 0, W, H);
      if (this.flash > 0) {
        lx.fillStyle = `rgba(255,255,255,${this.flash * 0.35})`;
        lx.fillRect(0, 0, W, H); this.flash -= 0.06;
      }
      /* ذرات نور تطفو */
      for (const m of this.motes) {
        m.y -= m.v; m.x += Math.sin(t * 0.4 + m.ph) * 0.25;
        if (m.y < -10) { m.y = H + 10; m.x = Math.random() * W; }
        lx.globalAlpha = 0.18 + 0.18 * (0.5 + 0.5 * Math.sin(t + m.ph));
        lx.fillStyle = night() ? "#cfe3ff" : "#fff8e6";
        lx.beginPath(); lx.arc(m.x, m.y, m.r, 0, 7); lx.fill();
      }
      lx.globalAlpha = 1;
      /* شهاب نادر في الليل */
      if (night() && !this.meteor && Math.random() < 0.0018) {
        this.meteor = { x: Math.random() * W * 0.8 + W * 0.2, y: Math.random() * H * 0.35, v: 9 + Math.random() * 6, life: 1 };
      }
      if (this.meteor) {
        const m = this.meteor;
        const g = lx.createLinearGradient(m.x, m.y, m.x + 90, m.y + 52);
        g.addColorStop(0, `rgba(255,255,255,${m.life})`); g.addColorStop(1, "rgba(255,255,255,0)");
        lx.strokeStyle = g; lx.lineWidth = 2;
        lx.beginPath(); lx.moveTo(m.x, m.y); lx.lineTo(m.x + 90, m.y + 52); lx.stroke();
        m.x -= m.v; m.y += m.v * 0.58; m.life -= 0.012;
        if (m.life <= 0 || m.y > H) this.meteor = null;
      }
      /* طيور بعيدة في النهار */
      if (!night() && !this.rainOn && this.birds.length < 3 && Math.random() < 0.002) {
        const y = 60 + Math.random() * H * 0.3, v = 0.6 + Math.random() * 0.7;
        for (let i = 0; i < 3 + Math.round(Math.random() * 3); i++)
          this.birds.push({ x: W + i * 26, y: y + (i % 2 ? 10 : -8) + i * 3, v, ph: Math.random() * 6, s: 4 + Math.random() * 3 });
      }
      lx.strokeStyle = "rgba(60,70,85,.35)"; lx.lineWidth = 1.4;
      for (const b of this.birds) {
        const w = Math.sin(t * 5 + b.ph) * b.s * 0.55;
        lx.beginPath();
        lx.moveTo(b.x - b.s, b.y + w); lx.quadraticCurveTo(b.x, b.y - w * 0.6, b.x + b.s, b.y + w);
        lx.stroke();
        b.x -= b.v;
      }
      this.birds = this.birds.filter(b => b.x > -40);
      this.raf = requestAnimationFrame(tick);
    };
    tick();
  },
  stop() { cancelAnimationFrame(this.raf); }
};

/* ============ أوقات الصلاة: حساب محلي + تنبيه + نداء ============ */
const PRAY = {
  opts() { return DB.get("pray", { method: "makkah", asr: "shafii", adhan: true, on: true, adjust: {} }); },
  set(o) { DB.set("pray", Object.assign(this.opts(), o)); },
  times(d) { const p = SKY.pos(); return prayerTimes(d || new Date(), p.lat, p.lng, this.opts()); },
  next(d) {
    const now = d || new Date(), h = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const t = this.times(now), order = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
    for (const k of order) if (t[k] !== null && t[k] > h) return { k, at: t[k], in: t[k] - h };
    const tm = this.times(new Date(now.getTime() + 86400000));
    return { k: "fajr", at: tm.fajr, in: 24 - h + tm.fajr, tomorrow: true };
  },
  adhan(name) {
    const o = this.opts();
    if (o.adhan) {
      speak(`اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ. حان الآن وقت صلاة ${name}`);
      try {
        const A = new (window.AudioContext || window.webkitAudioContext)();
        [0, .5, 1].forEach((d, i) => {
          const osc = A.createOscillator(), g = A.createGain();
          osc.frequency.value = [523, 659, 784][i]; osc.type = "sine";
          g.gain.setValueAtTime(0.0001, A.currentTime + d);
          g.gain.exponentialRampToValueAtTime(0.25, A.currentTime + d + 0.05);
          g.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d + 0.45);
          osc.connect(g); g.connect(A.destination);
          osc.start(A.currentTime + d); osc.stop(A.currentTime + d + 0.5);
        });
      } catch (e) { }
    }
    if (navigator.vibrate) navigator.vibrate([300, 120, 300, 120, 300]);
  },
  check() {
    const o = this.opts(); if (!o.on) return;
    const now = new Date(), t = this.times(now);
    const h = now.getHours() + now.getMinutes() / 60;
    for (const k of ["fajr", "dhuhr", "asr", "maghrib", "isha"]) {
      if (t[k] === null) continue;
      if (Math.abs(h - t[k]) < 0.6 / 60) {
        const key = "pr_" + today() + "_" + k;
        if (DB.get(key, false)) continue; DB.set(key, true);
        notify("حان وقت صلاة " + PRAYER_NAMES[k], "تقبل الله منك");
        this.adhan(PRAYER_NAMES[k]);
      }
    }
    /* السحور والفطر في رمضان */
    const hj = toHijri(now, DB.get("hoff", 0));
    if (hj.m === 9 && t.fajr !== null) {
      for (const mins of [30, 10]) {
        const at = t.fajr - mins / 60;
        if (Math.abs(h - at) < 0.6 / 60) {
          const key = "sh_" + today() + "_" + mins;
          if (!DB.get(key, false)) { DB.set(key, true); notify(`بقي ${AR(mins)} دقيقة على انتهاء السحور`, "تسحّروا فإن في السحور بركة"); }
        }
      }
    }
  },
  strip() {
    const s = document.getElementById("pstrip"); if (!s) return;
    const n = this.next(), mins = Math.max(0, Math.round(n.in * 60));
    const hh = Math.floor(mins / 60), mm = mins % 60;
    const hj = toHijri(new Date(), DB.get("hoff", 0));
    s.textContent = `${AR(hj.d)} ${hj.name} ${AR(hj.y)}هـ · ${PRAYER_NAMES[n.k]} ${hhmm(n.at)} · بعد ${hh ? AR(hh) + " س " : ""}${AR(mm)} د`;
  }
};

/* ============ جدولة تنبيه الصلاة في تطبيق الهاتف ============
   داخل تطبيق الجوال (Capacitor) تُجدول التنبيهات في النظام فتصل والتطبيق مغلق.
   في المتصفح تبقى التنبيهات أثناء فتح التطبيق فقط. */
const NATIVE = () => window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
const LN = () => (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications) || null;
async function schedulePrayerNotifications() {
  const ln = LN(); if (!ln || !PRAY.opts().on) return;
  try {
    const perm = await ln.checkPermissions();
    if (perm.display !== "granted") { const r = await ln.requestPermissions(); if (r.display !== "granted") return; }
    if (ln.createChannel) {
      try {
        await ln.createChannel({ id: "prayer", name: "أوقات الصلاة", description: "تنبيه عند دخول وقت الصلاة", importance: 5, visibility: 1 });
        await ln.createChannel({ id: "fasting", name: "السحور والفطور", description: "تنبيه السحور والإفطار في رمضان", importance: 4, visibility: 1 });
      } catch (e) { }
    }
    const pending = await ln.getPending();
    if (pending.notifications.length) await ln.cancel({ notifications: pending.notifications });
    const list = [], now = new Date();
    for (let day = 0; day < 7; day++) {
      const d = new Date(now.getTime() + day * 86400000);
      const t = PRAY.times(d);
      ["fajr", "dhuhr", "asr", "maghrib", "isha"].forEach((k, i) => {
        if (t[k] === null) return;
        const at = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(t[k]), Math.round((t[k] % 1) * 60), 0);
        if (at <= now) return;
        list.push({
          id: day * 10 + i + 1,
          title: "حان وقت صلاة " + PRAYER_NAMES[k],
          body: "تقبل الله منك — الوقت محسوب فلكياً، والمعتمد إعلان المسجد في بلدك.",
          schedule: { at, allowWhileIdle: true },
          smallIcon: "ic_stat_zad",
          channelId: "prayer"
        });
      });
      const hj = toHijri(d, DB.get("hoff", 0));
      if (hj.m === 9 && t.fajr !== null && t.maghrib !== null) {
        const mk = (v, off) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(v), Math.round((v % 1) * 60) + off, 0);
        const sah = mk(t.fajr, -30), ift = mk(t.maghrib, 0);
        if (sah > now) list.push({ id: 900 + day, title: "بقي 30 دقيقة على الفجر", body: "وقت السحور يوشك أن ينتهي — والمعتمد إمساك بلدك.", schedule: { at: sah, allowWhileIdle: true }, smallIcon: "ic_stat_zad", channelId: "fasting" });
        if (ift > now) list.push({ id: 950 + day, title: "أذان المغرب — وقت الإفطار", body: "ذهب الظمأ وابتلّت العروق وثبت الأجر إن شاء الله (أبو داود).", schedule: { at: ift, allowWhileIdle: true }, smallIcon: "ic_stat_zad", channelId: "fasting" });
      }
    }
    if (list.length) await ln.schedule({ notifications: list });
  } catch (e) { }
}

/* ============ تبويب الأوقات: الصلاة، التقويم، القمر، الصيام، الطقس ============ */
function fastDB() { return DB.get("fasts", {}); }
function renderTime(tab) {
  const v = document.getElementById("v-time");
  const k = tab || DB.get("ttab", "salah"); DB.set("ttab", k);
  const tabs = [["salah", "أوقات الصلاة"], ["hijri", "التقويم والصيام"], ["moon", "القمر ومنازله"], ["wx", "الطقس والطوارئ"]];
  let body = "";
  const o = PRAY.opts(), t = PRAY.times(), n = PRAY.next();
  const hj = toHijri(new Date(), DB.get("hoff", 0));

  if (k === "salah") {
    const rows = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"].map(x =>
      `<div class="count" style="${x === n.k ? "background:var(--bg2);border-radius:10px;padding:4px 8px" : ""}"><span>${PRAYER_NAMES[x]}</span><b>${hhmm(t[x])}</b></div>`).join("");
    body = `<div class="card"><div class="mid">الصلاة القادمة</div><div class="big">${PRAYER_NAMES[n.k]} — ${hhmm(n.at)}</div>
      <div class="mid">بعد ${AR(Math.max(0, Math.round(n.in * 60)))} دقيقة</div></div>
      <div class="card">${rows}</div>
      <div class="card"><h3>الإعدادات</h3>
        <label>طريقة الحساب</label>
        <select id="pm">${Object.entries(PRAYER_METHODS).map(([id, m]) => `<option value="${id}" ${o.method === id ? "selected" : ""}>${esc(m.name)}</option>`).join("")}</select>
        <label>العصر</label>
        <select id="pa"><option value="shafii" ${o.asr === "shafii" ? "selected" : ""}>الجمهور (مثل الظل)</option><option value="hanafi" ${o.asr === "hanafi" ? "selected" : ""}>الحنفية (مِثلَا الظل)</option></select>
        <button class="btn ${o.on ? "sec" : ""}" id="pon">${o.on ? "إيقاف تنبيه الصلاة" : "تفعيل تنبيه الصلاة"}</button>
        <button class="btn sec sm" id="pad">${o.adhan ? "✔ نداء صوتي عند الأذان" : "✖ النداء الصوتي مُطفأ"}</button>
        <button class="btn sec sm" id="ploc">📍 تحديث موقعي</button>
      </div>
      <div class="note">حساب فلكي محلي يعمل بدون إنترنت ويتبع موقعك أينما سافرت. وهو للاستئناس، والمرجع المعتمد تقويم الجهة الرسمية في بلدك (الأوقاف/الإفتاء) والمسجد الذي تصلي فيه.</div>`;
  }

  if (k === "hijri") {
    const fs = fastStatusFor(new Date());
    const qada = DB.get("qada", 0), log = fastDB();
    const upcoming = OCCASIONS.map(x => {
      let d = hijriToDate(hj.y, x.hm, x.hd);
      if (d < new Date(Date.now() - 86400000)) d = hijriToDate(hj.y + 1, x.hm, x.hd);
      return { ...x, d, days: Math.round((d - new Date()) / 86400000) };
    }).sort((a, b) => a.days - b.days);
    const days = [];
    for (let i = -2; i < 12; i++) {
      const d = new Date(Date.now() + i * 86400000), key = d.toISOString().slice(0, 10);
      const st = fastStatusFor(d), rec = log[key];
      days.push(`<div class="count" style="gap:8px">
        <span style="flex:1">${AR(st.hijri.d)} ${st.hijri.name} — ${["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"][d.getDay()]}
        ${st.tags.map(x => `<span class="tag ${x.k === "haram" ? "d" : "s"}">${esc(x.t)}</span>`).join("")}</span>
        ${["qada", "nadhr", "nafl"].map(kind => `<button class="cbtn" data-f="${key}" data-k="${kind}" style="${rec === kind ? "background:var(--brand);color:#04251c" : ""}">${FAST_KINDS[kind]}</button>`).join("")}
        <button class="cbtn" data-f="${key}" data-k="">✖</button></div>`);
    }
    const counts = Object.values(log).reduce((a, x) => (a[x] = (a[x] || 0) + 1, a), {});
    body = `<div class="card"><div class="mid">التاريخ الهجري</div><div class="big">${AR(hj.d)} ${hj.name} ${AR(hj.y)}هـ</div>
      <div class="count"><span>ضبط يدوي ±يوم</span>
        <button class="cbtn" id="ho-">−</button><b>${AR(DB.get("hoff", 0))}</b><button class="cbtn" id="ho+">+</button></div>
      <div class="note">التقويم هنا حسابي تقريبي، وثبوت الشهر والعيد بالرؤية الشرعية وإعلان الجهة الرسمية في بلدك.</div></div>
      <div class="card"><h3>القادم</h3>${upcoming.slice(0, 5).map(x => `<div class="count"><span>${esc(x.label)}</span><b>${x.days <= 0 ? "اليوم" : "بعد " + AR(x.days) + " يوم"}</b></div><div class="note">${esc(x.note)}</div>`).join("")}</div>
      <div class="card"><h3>صيام القضاء</h3>
        <div class="count"><span>أيام واجبة عليك</span>
          <button class="cbtn" id="q-">−</button><b style="font-size:20px">${AR(qada)}</b><button class="cbtn" id="q+">+</button></div>
        <div class="count"><span>صُمتَ قضاءً</span><b>${AR(counts.qada || 0)}</b></div>
        <div class="count"><span>نذر</span><b>${AR(counts.nadhr || 0)}</b></div>
        <div class="count"><span>نافلة</span><b>${AR(counts.nafl || 0)}</b></div>
        <div class="note">القضاء واجب ومقدَّم على النافلة عند جمهور أهل العلم، ويُبادَر به قبل رمضان القادم.</div></div>
      <div class="card"><h3>تقويم الصيام</h3>${days.join("")}</div>
      <div class="card"><h3>الصيام المستحب</h3>${SUNNAH_FASTS.map(x => `<div class="count"><span>${esc(x.label)}</span><b>${esc(x.rule)}</b></div><div class="src"><span class="tag s">سنة</span> ${esc(x.src)}${x.note ? " — " + esc(x.note) : ""}</div>`).join("")}</div>
      <div class="card"><h3>السحور والفطر</h3>
        <div class="count"><span>ينتهي السحور (الفجر)</span><b>${hhmm(t.fajr)}</b></div>
        <div class="count"><span>الفطر (المغرب)</span><b>${hhmm(t.maghrib)}</b></div>
        ${FAST_DUA.map(x => `<div class="dua">${esc(x.t)}</div><div class="src"><span class="tag ${x.tag === "س" ? "s" : "d"}">${x.tag === "س" ? "سنة صحيحة" : "دعاء مباح"}</span> ${esc(x.s)}</div>${x.note ? `<div class="note">${esc(x.note)}</div>` : ""}`).join("")}</div>`;
  }

  if (k === "moon") {
    const p = SKY.pos(), m = moonInfo(new Date(), p.lat, p.lng), ec = eclipseWatch(new Date());
    body = `<div class="card"><div class="mid">القمر الآن</div><div class="big">${esc(m.phase)}</div>
      <div class="bar"><i style="width:${Math.round(m.illum * 100)}%"></i></div>
      <div class="count"><span>نسبة الإضاءة</span><b>${AR(Math.round(m.illum * 100))}٪</b></div>
      <div class="count"><span>عمر القمر</span><b>${AR(m.age.toFixed(1))} يوم</b></div>
      <div class="count"><span>المنزلة</span><b>${esc(m.mansion)} (${AR(m.mansionIdx + 1)} من 28)</b></div>
      <div class="count"><span>الاتجاه</span><b>${m.waxing ? "متزايد — يمينه المضيء" : "متناقص — يساره المضيء"}</b></div>
      <div class="note">شكل القمر وميلانه في خلفية التطبيق يتغيّران فعلياً بحسب اليوم وخط عرض موقعك؛ في الإمارات ومكة يميل الهلال أفقياً أكثر منه في خطوط العرض الشمالية.</div></div>
      ${ec ? `<div class="card"><h3>${esc(ec.type)}</h3><div class="note">${esc(ec.note)} — والمرجع في الإعلان الجهات الفلكية الرسمية.</div>
        ${EVENTS.find(e => e.id === "eclipse").items.map(x => `<div class="dua">${esc(x.t)}</div><div class="src"><span class="tag s">سنة صحيحة</span> ${esc(x.s)}</div>`).join("")}</div>` : ""}
      <div class="card"><h3>منازل القمر الثمانية والعشرون</h3>
        <div class="note">أسماء عربية قديمة لمواضع القمر في فلكه، يُستأنس بها في معرفة الوقت والفصول. ولا يجوز اعتقاد أن المنازل تؤثر بذاتها في نزول المطر أو الحظ، ومن قال «مُطرنا بنَوْء كذا» معتقداً تأثيره فقد وقع في محذور عظيم (البخاري ومسلم).</div>
        <div class="chips">${MOON_MANSIONS.map((x, i) => `<span class="chip ${i === m.mansionIdx ? "on" : ""}">${AR(i + 1)}. ${esc(x)}</span>`).join("")}</div></div>
      <div class="card"><h3>دعاء رؤية الهلال</h3>
        ${EVENTS.find(e => e.id === "crescent").items.map(x => `<div class="dua">${esc(x.t)}</div><div class="src"><span class="tag s">سنة صحيحة</span> ${esc(x.s)}</div>`).join("")}</div>`;
  }

  if (k === "wx") {
    const d = WX.data(), s = WX.state(d), qk = DB.get("quakes", []);
    body = `<div class="card"><div class="mid">حالة الجو في موقعك</div>
      <div class="big">${d ? esc((s && s.label) || "—") + " · " + AR(Math.round(d.t)) + "°" : "لم تُحدَّث بعد"}</div>
      ${d ? `<div class="count"><span>الرياح</span><b>${AR(Math.round(d.wind))} كم/س${d.gust ? " (هبّات " + AR(Math.round(d.gust)) + ")" : ""}</b></div>
      <div class="count"><span>آخر تحديث</span><b>${new Date(d.at).toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}</b></div>` : ""}
      <button class="btn sec sm" id="wxr">تحديث الآن</button>
      <div class="note">حالة الطقس تحتاج إنترنت لحظة التحديث فقط، ثم تبقى محفوظة. وأي إنذار رسمي المرجع فيه الجهات الرسمية في دولتك، لا هذا التطبيق.</div></div>
      ${qk.length ? `<div class="card"><h3>هزات أرضية قريبة (800 كم)</h3>${qk.slice(0, 4).map(x => `<div class="count"><span>${esc(x.place)}</span><b>${AR(x.m)} · ${AR(x.km)} كم</b></div>`).join("")}</div>` : ""}
      ${EVENTS.map(e => `<details><summary>${e.icon} ${esc(e.label)}</summary><div>
        <div class="note">${esc(e.when)}</div>
        ${e.items.map(x => `<div class="card"><div class="dua">${esc(x.t)}</div>
          ${x.n > 1 ? `<div class="count"><span>التكرار</span><b>${AR(x.n)}</b></div>${tasbih(e.id + x.t, x.n)}` : ""}
          ${x.note ? `<div class="note">${esc(x.note)}</div>` : ""}
          <div class="src"><span class="tag ${x.tag === "ق" ? "q" : x.tag === "س" ? "s" : "d"}">${x.tag === "ق" ? "قرآن" : x.tag === "س" ? "سنة صحيحة" : "دعاء مباح"}</span> ${esc(x.s)}</div></div>`).join("")}
      </div></details>`).join("")}`;
  }

  v.innerHTML = `<div class="chips">${tabs.map(([id, t2]) => `<button class="chip ${id === k ? "on" : ""}" data-t="${id}">${t2}</button>`).join("")}</div>${body}`;
  v.querySelectorAll("[data-t]").forEach(b => b.onclick = () => { renderTime(b.dataset.t); window.scrollTo(0, 0); });
  bindCounters(v);
  const q = id => document.getElementById(id);
  if (q("pm")) q("pm").onchange = e => { PRAY.set({ method: e.target.value }); renderTime(k); PRAY.strip(); schedulePrayerNotifications(); };
  if (q("pa")) q("pa").onchange = e => { PRAY.set({ asr: e.target.value }); renderTime(k); schedulePrayerNotifications(); };
  if (q("pon")) q("pon").onclick = async () => {
    const on = !PRAY.opts().on;
    if (on && "Notification" in window && Notification.permission !== "granted") { try { await Notification.requestPermission(); } catch (e) { } }
    PRAY.set({ on }); renderTime(k);
    if (on) schedulePrayerNotifications(); else { const ln = LN(); if (ln) ln.getPending().then(p => p.notifications.length && ln.cancel(p)).catch(() => { }); }
  };
  if (q("pad")) q("pad").onclick = () => { PRAY.set({ adhan: !PRAY.opts().adhan }); renderTime(k); };
  if (q("ploc")) q("ploc").onclick = () => navigator.geolocation.getCurrentPosition(p => {
    DB.set("lastpos", { lat: p.coords.latitude, lng: p.coords.longitude });
    SKY.apply(); MOON.draw(); WX.refresh(true); renderTime(k); PRAY.strip();
    notify("تم تحديث موقعك", "أوقات الصلاة والقمر والطقس تتبع موقعك الجديد");
  }, () => notify("تعذّر تحديد الموقع", "فعّل إذن الموقع من إعدادات المتصفح"));
  if (q("ho-")) q("ho-").onclick = () => { DB.set("hoff", DB.get("hoff", 0) - 1); renderTime(k); PRAY.strip(); };
  if (q("ho+")) q("ho+").onclick = () => { DB.set("hoff", DB.get("hoff", 0) + 1); renderTime(k); PRAY.strip(); };
  if (q("q-")) q("q-").onclick = () => { DB.set("qada", Math.max(0, DB.get("qada", 0) - 1)); renderTime(k); };
  if (q("q+")) q("q+").onclick = () => { DB.set("qada", DB.get("qada", 0) + 1); renderTime(k); };
  if (q("wxr")) q("wxr").onclick = async () => { await WX.refresh(true); await WX.quakes(); renderTime(k); };
  v.querySelectorAll("[data-f]").forEach(b => b.onclick = () => {
    const log = fastDB(), key = b.dataset.f, kind = b.dataset.k;
    const was = log[key];
    if (!kind) delete log[key]; else log[key] = kind;
    DB.set("fasts", log);
    if (kind === "qada" && was !== "qada") DB.set("qada", Math.max(0, DB.get("qada", 0) - 1));
    if (was === "qada" && kind !== "qada") DB.set("qada", DB.get("qada", 0) + 1);
    renderTime(k);
  });
}

/* ============ بطاقة الملخص: الوقت والقبلة والصلاة القادمة وإنجاز اليوم ============ */
const KAABA = { lat: 21.422487, lng: 39.826206 };
function qiblaBearing(lat, lng) {
  const R = Math.PI / 180, dL = (KAABA.lng - lng) * R;
  const y = Math.sin(dL) * Math.cos(KAABA.lat * R);
  const x = Math.cos(lat * R) * Math.sin(KAABA.lat * R) - Math.sin(lat * R) * Math.cos(KAABA.lat * R) * Math.cos(dL);
  return (Math.atan2(y, x) / R + 360) % 360;
}
const SUM = {
  heading: null, listening: false, open: DB.get("sumopen", true),
  progress() {
    const d = today(), w = wird();
    let wd = 0, wt = 0;
    w.forEach((x, i) => { wd += Math.min(DB.get("w_" + i + "_" + d, 0), x.n); wt += x.n; });
    const pl = Q.plan, pages = pl.log[d] || 0;
    let dh = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("zh_cnt_") && k.endsWith("_" + d)) dh += (JSON.parse(localStorage.getItem(k)) || 0);
      }
    } catch (e) { }
    const fasts = fastDB()[d];
    return { wd, wt, wpct: wt ? Math.round((wd / wt) * 100) : 0, pages, target: pl.pages, dh, streak: DB.get("streak", 0), fast: fasts };
  },
  render() {
    const el = document.getElementById("summary"); if (!el) return;
    const now = new Date(), p = SKY.pos(), n = PRAY.next();
    const hj = toHijri(now, DB.get("hoff", 0));
    const mins = Math.max(0, Math.round(n.in * 60)), hh = Math.floor(mins / 60), mm = mins % 60;
    const qb = qiblaBearing(p.lat, p.lng);
    const rot = this.heading === null ? qb : (qb - this.heading + 360) % 360;
    const g = this.progress();
    const clock = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    if (!this.open) {
      el.innerHTML = `<div class="card sum"><div class="sumtop"><div><b>${clock}</b> · ${PRAYER_NAMES[n.k]} بعد ${hh ? AR(hh) + " س " : ""}${AR(mm)} د · ورد ${AR(g.wpct)}٪</div>
        <button class="cbtn" id="sumtog">▾</button></div></div>`;
    } else {
      el.innerHTML = `<div class="card sum">
      <div class="sumtop"><div class="mid">${AR(hj.d)} ${hj.name} ${AR(hj.y)}هـ · ${now.toLocaleDateString("en-GB")}</div>
        <button class="cbtn" id="sumtog">▴</button></div>
      <div class="sumgrid">
        <div class="sumcell"><div class="mid">الوقت الآن</div><div class="big">${clock}</div></div>
        <div class="sumcell"><div class="mid">${PRAYER_NAMES[n.k]}${n.tomorrow ? " (غداً)" : ""} ${hhmm(n.at)}</div>
          <div class="big">${hh ? AR(hh) + ":" : ""}${hh ? String(mm).padStart(2, "0") : AR(mm)}</div>
          <div class="mid">${hh ? "س : د" : "دقيقة"} متبقية للصلاة</div></div>
        <div class="sumcell"><div class="mid">القبلة ${AR(Math.round(qb))}° من الشمال</div>
          <div class="qibla"><i style="transform:rotate(${rot}deg)">↑</i></div>
          <button class="btn sec sm" id="sumcomp">${this.listening ? "البوصلة تعمل" : "تفعيل البوصلة"}</button></div>
      </div>
      <div class="sumbars">
        <div><div class="mid">وردك اليوم — ${AR(g.wd)} من ${AR(g.wt)}</div><div class="bar"><i style="width:${g.wpct}%"></i></div></div>
        <div><div class="mid">قراءة المصحف — ${AR(g.pages)} من ${AR(g.target)} صفحات</div><div class="bar"><i style="width:${Math.min(100, g.target ? (g.pages / g.target) * 100 : 0)}%"></i></div></div>
        <div class="mid">تسبيح وأذكار اليوم: ${AR(g.dh)} · أيام متتابعة: ${AR(g.streak)}${g.fast ? " · صيام اليوم: " + (g.fast === "qada" ? "قضاء" : g.fast === "nadhr" ? "نذر" : "نافلة") : ""}</div>
      </div>
      <div class="note">اتجاه القبلة محسوب من موقعك تقريبياً؛ عند الاشتباه تحرَّ الاتجاه بمحراب مسجد أو بوصلة موثوقة.</div>
    </div>`;
      const c = document.getElementById("sumcomp");
      if (c) c.onclick = () => this.compass();
    }
    const t = document.getElementById("sumtog");
    if (t) t.onclick = () => { this.open = !this.open; DB.set("sumopen", this.open); this.render(); };
  },
  async compass() {
    if (this.listening) return;
    try {
      const D = window.DeviceOrientationEvent;
      if (D && typeof D.requestPermission === "function") {
        const r = await D.requestPermission();
        if (r !== "granted") { notify("البوصلة", "لم يُسمح باستخدام مستشعر الاتجاه"); return; }
      }
      const on = e => {
        const h = e.webkitCompassHeading !== undefined ? e.webkitCompassHeading : (e.alpha !== null ? 360 - e.alpha : null);
        if (h === null) return;
        this.heading = h;
      };
      addEventListener("deviceorientationabsolute", on, true);
      addEventListener("deviceorientation", on, true);
      this.listening = true; this.render();
    } catch (e) { notify("البوصلة", "جهازك لا يدعم مستشعر الاتجاه"); }
  }
};

/* ============ الشاشة الرئيسية: مدخل كل قسم ============ */
/* ============ السياسات وإخلاء المسؤولية ============ */
function policiesBlock() {
  const V = "1.0 — آخر تحديث: 2026/09";
  return `<div class="card"><h3>السياسات وإخلاء المسؤولية</h3>

  <details><summary>١) طبيعة التطبيق وإخلاء المسؤولية</summary>
    <ul>
      <li>«قانتون» تطبيق عبادة وتذكير فقط: مناسك وأذكار وأدعية ومصحف وأوقات.</li>
      <li>لا يجمع تبرعات ولا زكاة ولا أي مبالغ، ولا يحتوي روابط دفع ولا إعلانات ولا رعايات.</li>
      <li>لا ينشر أفكاراً ولا توجهات ولا انتماءات حزبية أو سياسية، ولا يدعو إلى جهة أو شخص.</li>
      <li>ما يُعرض فيه للاستئناس والتذكير، ولا يُعدّ فتوى ولا يُغني عن سؤال أهل العلم المختصين.</li>
      <li>حسابات أوقات الصلاة والقبلة والقمر والتقويم الهجري حسابات فلكية تقريبية قد تختلف دقائق عن التقويم الرسمي؛ والمعتمد إعلان الجهة الرسمية في بلدك ورؤية الهلال الشرعية.</li>
      <li>التنبيه بالموقع داخل الحرم وعدّ الأشواط مساعدة تقنية قد تخطئ بسبب ضعف إشارة GPS والازدحام؛ العدّ اليدوي متاح دائماً، وعليك التثبّت بنفسك، وصحة نسكك مسؤوليتك.</li>
      <li>تنبيهات الطقس والزلازل والطوارئ معلوماتية فقط؛ المرجع الأعلى دائماً هو الإنذارات الرسمية والدفاع المدني في دولتك.</li>
      <li>يُستخدم التطبيق على مسؤولية المستخدم، ولا يتحمّل المطوّر أو أي جهة أضراراً ناتجة عن خطأ في حساب أو تنبيه أو انقطاع خدمة.</li>
      <li>التطبيق غير معتمد رسمياً من أي جهة دينية أو حكومية حتى تاريخه، ولا يدّعي ذلك.</li>
    </ul>
  </details>

  <details><summary>٢) سياسة المصادر وصحة النصوص</summary>
    <ul>
      <li>كل نص في التطبيق موسوم بمصدره ودرجته: <b>قرآن</b> (باسم السورة ورقم الآية)، أو <b>حديث</b> مع تخريجه ودرجته (صحيح/حسن)، أو <b>أثر</b> عن صحابي، أو <b>دعاء مباح</b> لم يثبت رفعه.</li>
      <li>لا يُنسب نصٌّ إلى النبي صلى الله عليه وسلم إلا بتخريج؛ وما ضعُف إسناده يُذكر بوصفه دعاءً مباحاً حسن المعنى لا سنة.</li>
      <li>نص المصحف مأخوذ من نص القرآن الكريم برواية حفص عن عاصم، والأحاديث من كتب السنة المعتمدة (البخاري ومسلم والسنن)، والاختيارات الفقهية على ما عليه جمهور أهل السنة وفتاوى أئمة الحرم واللجنة الدائمة.</li>
      <li>الأعداد التي لم يرد فيها دليل تُوصف بأنها «مقترحة» لا سنة، ولا يُلتزم بهيئة أو وقت أو عدد بلا دليل.</li>
      <li>رغم العناية بالتحقق، يبقى احتمال الخطأ البشري أو المطبعي قائماً؛ والمصحف المطبوع وكتب السنة الأصلية هي المرجع عند الاختلاف.</li>
      <li>المحتوى لم تصدر بشأنه بعدُ شهادة مراجعة من جهة شرعية مختصة، وهو معروض للمراجعة قبل أي اعتماد رسمي. إن وجدتِ خطأ فأبلغينا ليُصحّح.</li>
    </ul>
  </details>

  <details><summary>٣) إفصاح عن استخدام الذكاء الاصطناعي</summary>
    <ul>
      <li>طُوِّر هذا التطبيق برمجياً بمساعدة الذكاء الاصطناعي، كما استُعين به في جمع النصوص وتنسيقها وتصنيفها.</li>
      <li>استخراج آيات الدعاء وتصنيف مكتبة الأدعية تمّ آلياً من نص المصحف داخل التطبيق، وقد يحتاج بعضه إلى تنقيح ومراجعة.</li>
      <li>«فاحص الدعاء» أداة آلية تنبّه على المخالفات الظاهرة فقط (كطلب الحاجة من غير الله)، وليست فتوى ولا تُغني عن سؤال أهل العلم، وقد تخطئ في القبول أو الرفض.</li>
      <li>لا يُنسب أي نص أنشأه المستخدم أو ولّدته أداة إلى النبي صلى الله عليه وسلم ولا يُجعل سنة؛ ويُعرض بوسم «دعاء مباح».</li>
      <li>الذكاء الاصطناعي لا يُستخدم في إصدار أحكام شرعية، والقرار النهائي في الصحة والدرجة لأهل العلم.</li>
    </ul>
  </details>

  <details><summary>٤) الخصوصية والبيانات</summary>
    <ul>
      <li>لا يُنشئ التطبيق حساباً ولا يجمع اسمك ولا بريدك ولا أي بيانات شخصية.</li>
      <li>تقدّمك (الأشواط، الورد، الصفحة، أدعيتك المختارة) محفوظ في جهازك فقط عبر التخزين المحلي، ولا يُرسل إلى أي خادم.</li>
      <li>يُستخدم إذن الموقع للحساب داخل الجهاز (القبلة والأوقات والتنبيه بالمواضع)، ولا يُخزَّن ولا يُشارك؛ ويمكنك رفضه والتطبيق يعمل يدوياً.</li>
      <li>عند تفعيل الطقس والهزّات يُرسَل طلب إلى خدمة بيانات عامة مع إحداثيات تقريبية فقط، ويمكنك العمل دون إنترنت بالكامل.</li>
      <li>لا توجد أدوات تتبّع ولا إعلانات ولا تحليلات في التطبيق.</li>
    </ul>
  </details>

  <div class="note">الإصدار ${esc(V)} — باستخدامك التطبيق فأنتِ موافقة على ما سبق. <a href="policy.html" target="_blank" rel="noopener">النص الكامل في صفحة مستقلة</a>.</div>
  </div>`;
}

function renderHome() {
  const v = document.getElementById("v-home"); if (!v) return;
  const g = SUM.progress(), st = STAGES[Math.min(S.stage, STAGES.length - 1)];
  const n = PRAY.next();
  const tiles = [
    { v: "umrah", icon: "🕋", t: "العمرة والحج", s: st.t, x: st.kind === "tawaf" ? "الطواف: " + AR(S.tawaf) + " من 7" : st.kind === "saee" ? "السعي: " + AR(S.saee) + " من 7" : "خطوة " + AR(Math.min(S.stage, STAGES.length - 1) + 1) + " من " + AR(STAGES.length) },
    { v: "quran", icon: "📖", t: "المصحف", s: "صفحة " + AR(Q.page) + " — " + surahOfPage(Q.page).split(" — ")[0], x: "اليوم: " + AR(g.pages) + " من " + AR(g.target) + " صفحات" },
    { v: "adhkar", icon: "📿", t: "الأذكار والأدعية", s: "أدبار الصلوات، الصباح والمساء، أدعية الأنبياء", x: "تسبيح اليوم: " + AR(g.dh) },
    { v: "wird", icon: "✅", t: "الورد اليومي", s: "متابعة إنجازك", x: AR(g.wpct) + "٪ — " + AR(g.wd) + " من " + AR(g.wt) },
    { v: "time", icon: "🕰️", t: "الأوقات والتقويم", s: "الصلاة والصيام والقمر والطقس", x: PRAYER_NAMES[n.k] + " " + hhmm(n.at) },
    { v: "ask", icon: "💬", t: "اسألني", s: "ذكرٌ لكل حال: همّ، خوف، رزق، تعلّم التسبيح", x: "بدون إنترنت" }
  ];
  v.innerHTML = `<div class="tiles">${tiles.map(x => `<button class="tile" data-go="${x.v}">
    <span class="ticon">${x.icon}</span>
    <span class="ttxt"><b>${esc(x.t)}</b><span class="mid">${esc(x.s)}</span><span class="tstate">${esc(x.x)}</span></span>
    <span class="tgo">‹</span></button>`).join("")}</div>
  <div class="note">الأرقام والحسابات (الصلاة والقبلة والقمر) تقريبية للاستئناس؛ والمعتمد إعلان الجهة الرسمية في بلدك.</div>
  ${policiesBlock()}`;
  v.querySelectorAll("[data-go]").forEach(b => b.onclick = () => go(b.dataset.go));
}

/* ============ تشغيل التطبيق ============ */
RENDER.time = () => renderTime();
TITLES.time = ["الأوقات والتقويم", "الصلاة والقمر والصيام والطقس"];
const HASH_V = location.hash.slice(1);
go(HASH_V && RENDER[HASH_V] ? HASH_V : DB.get("view", "home"));
if (DB.get("gps", false)) GPS.start();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => { });
MOON.draw();
LIFE.build(); LIFE.start();
PRAY.strip();
SUM.render();
setInterval(() => { SUM.render(); if (DB.get("view", "home") === "home") renderHome(); }, 20000);
WX.refresh(); WX.quakes();
schedulePrayerNotifications();
setInterval(() => { PRAY.check(); PRAY.strip(); }, 20000);
setInterval(() => MOON.draw(), 600000);
setInterval(() => { WX.refresh(); WX.quakes(); }, 1800000);
addEventListener("resize", () => { LIFE.build(); });
addEventListener("online", () => { WX.refresh(true); WX.quakes(); });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) LIFE.stop();
  else { LIFE.start(); MOON.draw(); PRAY.strip(); SUM.render(); }
});

/* إخفاء شاشة الافتتاح بعد ظهور الآية */
(() => {
  const sp = document.getElementById("splash"); if (!sp) return;
  const hide = () => { sp.classList.add("gone"); setTimeout(() => sp.remove(), 700); };
  const wait = matchMedia("(prefers-reduced-motion: reduce)").matches ? 900 : 3600;
  setTimeout(hide, wait);
  sp.addEventListener("click", hide);
})();
