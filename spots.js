/* رسوم توضيحية لمواضع الطواف والسعي — رسم هندسي بدون صور ذوات أرواح، يعمل بدون إنترنت */

const KAABA_PLAN = `
<svg viewBox="0 0 320 300" width="100%" role="img" aria-label="مخطط الكعبة من الأعلى مع مواضع الطواف">
  <rect x="0" y="0" width="320" height="300" fill="none"/>
  <!-- مسار الطواف -->
  <ellipse cx="160" cy="150" rx="140" ry="122" fill="none" stroke="#cfd9e2" stroke-width="2" stroke-dasharray="6 6"/>
  <!-- الحِجر (حِجر إسماعيل) -->
  <path d="M110 92 A 62 62 0 0 0 110 208" fill="#eef4f8" stroke="#9db6c8" stroke-width="3"/>
  <text x="74" y="154" font-size="11" fill="#245a83" text-anchor="middle">الحِجر</text>
  <!-- الكعبة -->
  <rect x="110" y="92" width="116" height="116" rx="4" fill="#2b2b2b" stroke="#1c1c1c" stroke-width="2"/>
  <rect x="110" y="120" width="116" height="16" fill="#c9a227" opacity=".85"/>
  <text x="168" y="158" font-size="13" fill="#e9d7a1" text-anchor="middle">الكعبة</text>
  <!-- الباب والملتزم -->
  <rect x="196" y="186" width="26" height="20" fill="#c9a227"/>
  <text x="243" y="200" font-size="10" fill="#245a83" text-anchor="middle">الباب</text>
  <text x="176" y="224" font-size="10" fill="#245a83" text-anchor="middle">المُلتزم</text>
  <!-- الحجر الأسود -->
  <circle cx="226" cy="208" r="9" fill="#3a3a3a" stroke="#c9a227" stroke-width="3"/>
  <text x="272" y="232" font-size="11" fill="#245a83" text-anchor="middle">الحجر الأسود</text>
  <line x1="226" y1="217" x2="226" y2="272" stroke="#2f6f9e" stroke-width="3"/>
  <text x="226" y="286" font-size="10" fill="#2f6f9e" text-anchor="middle">خط بداية الشوط ونهايته</text>
  <!-- الركن اليماني -->
  <circle cx="110" cy="208" r="7" fill="none" stroke="#2f6f9e" stroke-width="3"/>
  <text x="66" y="228" font-size="11" fill="#245a83" text-anchor="middle">الركن اليماني</text>
  <!-- مقام إبراهيم -->
  <circle cx="262" cy="120" r="12" fill="#dcb75a" stroke="#8a6d1f" stroke-width="2"/>
  <text x="288" y="100" font-size="10" fill="#245a83" text-anchor="middle">مقام إبراهيم</text>
  <!-- اتجاه الطواف -->
  <path d="M40 60 A 130 130 0 0 1 96 30" fill="none" stroke="#2f6f9e" stroke-width="2"/>
  <path d="M96 30 l -12 -2 l 6 9 z" fill="#2f6f9e"/>
  <text x="70" y="22" font-size="10" fill="#2f6f9e" text-anchor="middle">اتجاه الطواف</text>
</svg>`;

const SPOT_ART = [
  {
    k: "hajar", name: "الحجر الأسود", where: "في الركن الشرقي للكعبة، على يمينك عند بداية الطواف — يعرفه الناس بالإطار الفضي البيضاوي.",
    what: "حجر أسود مثبّت في زاوية الكعبة داخل إطار من الفضة. يبدأ منه الشوط وينتهي عنده. والثابت: استلامه وتقبيله إن تيسّر بلا مزاحمة، وإلا أشار إليه بيده وكبّر «الله أكبر» ولا يقبّل يده.",
    art: `<svg viewBox="0 0 200 150" width="100%" role="img" aria-label="رسم الحجر الأسود في إطاره الفضي">
      <rect x="10" y="10" width="180" height="130" rx="6" fill="#2b2b2b"/>
      <ellipse cx="100" cy="75" rx="52" ry="44" fill="#d9dde1" stroke="#a9b2ba" stroke-width="4"/>
      <ellipse cx="100" cy="75" rx="34" ry="28" fill="#1e1e1e"/>
      <ellipse cx="90" cy="66" rx="9" ry="7" fill="#3a3a3a"/>
      <text x="100" y="136" font-size="11" fill="#e9d7a1" text-anchor="middle">الإطار الفضي المحيط بالحجر</text>
    </svg>`
  },
  {
    k: "yamani", name: "الركن اليماني", where: "الركن الذي قبل الحجر الأسود مباشرة وأنت تطوف (جهة اليمن).",
    what: "ركن من أركان الكعبة بلا إطار ولا علامة لامعة. السنة استلامه باليد فقط إن تيسّر بلا تقبيل ولا إشارة إن لم يتيسّر، ويقول بينه وبين الحجر: ﴿رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً…﴾.",
    art: `<svg viewBox="0 0 200 150" width="100%" role="img" aria-label="رسم الركن اليماني">
      <path d="M20 140 L20 30 L110 10 L110 140 Z" fill="#2b2b2b"/>
      <path d="M110 10 L180 30 L180 140 L110 140 Z" fill="#242424"/>
      <line x1="110" y1="10" x2="110" y2="140" stroke="#4a4a4a" stroke-width="3"/>
      <rect x="20" y="58" width="160" height="12" fill="#c9a227" opacity=".8"/>
      <text x="100" y="134" font-size="11" fill="#e9d7a1" text-anchor="middle">ركن بلا إطار — يُستلم باليد فقط</text>
    </svg>`
  },
  {
    k: "maqam", name: "مقام إبراهيم", where: "أمام باب الكعبة على بُعد أمتار، وهو القبة الزجاجية النحاسية الصغيرة.",
    what: "حجر قام عليه إبراهيم عليه السلام حين بنى البيت، وفيه أثر القدمين، وعليه غطاء نحاسي وزجاج. بعد الطواف تُصلّى ركعتان خلفه إن تيسّر، وإلا ففي أي مكان من المسجد.",
    art: `<svg viewBox="0 0 200 150" width="100%" role="img" aria-label="رسم مقام إبراهيم بقبته النحاسية">
      <rect x="40" y="110" width="120" height="16" rx="4" fill="#b9a06a"/>
      <path d="M50 110 L50 74 A 50 46 0 0 1 150 74 L150 110 Z" fill="#cfe3ef" opacity=".65" stroke="#8a6d1f" stroke-width="3"/>
      <path d="M60 74 A 40 40 0 0 1 140 74 Z" fill="#d7b256" stroke="#8a6d1f" stroke-width="2"/>
      <circle cx="100" cy="30" r="5" fill="#d7b256"/>
      <ellipse cx="100" cy="102" rx="22" ry="8" fill="#8f8f8f"/>
      <text x="100" y="142" font-size="11" fill="#245a83" text-anchor="middle">قبة زجاجية بغطاء نحاسي ذهبي</text>
    </svg>`
  },
  {
    k: "hijr", name: "حِجر إسماعيل (الحطيم)", where: "القوس المنخفض الملاصق للكعبة من الجهة الشمالية.",
    what: "جزء من الكعبة؛ فمن دخله وصلّى فيه فكأنه صلّى داخل الكعبة، ولا يصحّ الطواف من داخله بل يجب الطواف من خارجه.",
    art: `<svg viewBox="0 0 200 150" width="100%" role="img" aria-label="رسم حجر إسماعيل">
      <rect x="110" y="20" width="80" height="110" fill="#2b2b2b"/>
      <path d="M110 20 A 58 55 0 0 0 110 130" fill="#eef4f8" stroke="#9db6c8" stroke-width="5"/>
      <text x="72" y="80" font-size="12" fill="#245a83" text-anchor="middle">الحِجر</text>
      <text x="150" y="80" font-size="12" fill="#e9d7a1" text-anchor="middle">الكعبة</text>
      <path d="M40 140 A 90 90 0 0 1 40 18" fill="none" stroke="#2f6f9e" stroke-width="3" stroke-dasharray="6 5"/>
      <text x="26" y="80" font-size="9" fill="#2f6f9e" text-anchor="middle" transform="rotate(-90 26 80)">مسار الطواف من خارجه</text>
    </svg>`
  },
  {
    k: "multazam", name: "المُلتزم", where: "ما بين الحجر الأسود وباب الكعبة، طوله نحو مترين.",
    what: "موضع يُستحب عند بعض أهل العلم إلصاق الصدر والوجه والذراعين به والدعاء، وثبت ذلك عن ابن عباس وجماعة من السلف. ولا يُزاحم عليه ولا يُترك الطواف لأجله.",
    art: `<svg viewBox="0 0 200 150" width="100%" role="img" aria-label="رسم الملتزم بين الحجر الأسود والباب">
      <rect x="20" y="20" width="160" height="110" fill="#2b2b2b"/>
      <rect x="112" y="46" width="42" height="72" rx="3" fill="#c9a227"/>
      <text x="133" y="88" font-size="10" fill="#3b2f06" text-anchor="middle">الباب</text>
      <circle cx="46" cy="112" r="10" fill="#3a3a3a" stroke="#d9dde1" stroke-width="4"/>
      <line x1="58" y1="118" x2="108" y2="118" stroke="#8fc4e8" stroke-width="5"/>
      <text x="82" y="138" font-size="11" fill="#245a83" text-anchor="middle">المُلتزم</text>
    </svg>`
  },
  {
    k: "safa", name: "الصفا والمروة", where: "طرفا المسعى داخل المسجد الحرام؛ الصفا أقرب إلى الكعبة.",
    what: "جبلان صغيران صارا اليوم مرتفعين مكسوّين بالرخام في طرفي المسعى. يبدأ السعي من الصفا وينتهي الشوط السابع عند المروة. وبين العلمين الأخضرين يُسرع الرجل (الهرولة) دون المرأة.",
    art: `<svg viewBox="0 0 260 150" width="100%" role="img" aria-label="رسم المسعى بين الصفا والمروة">
      <rect x="10" y="60" width="240" height="46" rx="8" fill="#f2f5f7" stroke="#cfd9e2" stroke-width="2"/>
      <path d="M10 106 L10 74 A 34 34 0 0 1 58 74 L58 106 Z" fill="#c9cfd4"/>
      <text x="34" y="122" font-size="11" fill="#245a83" text-anchor="middle">الصفا</text>
      <path d="M202 106 L202 74 A 34 34 0 0 1 250 74 L250 106 Z" fill="#c9cfd4"/>
      <text x="226" y="122" font-size="11" fill="#245a83" text-anchor="middle">المروة</text>
      <rect x="104" y="56" width="6" height="54" fill="#2e8b57"/>
      <rect x="156" y="56" width="6" height="54" fill="#2e8b57"/>
      <text x="132" y="48" font-size="10" fill="#2e8b57" text-anchor="middle">العلمان الأخضران (موضع الهرولة للرجال)</text>
      <path d="M64 92 L196 92" stroke="#2f6f9e" stroke-width="2" stroke-dasharray="6 5"/>
      <path d="M196 92 l -10 -4 l 0 8 z" fill="#2f6f9e"/>
    </svg>`
  }
];
