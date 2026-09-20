/* رسوم توضيحية لمواضع الطواف والسعي — رسم هندسي بدون صور ذوات أرواح، يعمل بدون إنترنت */

const KAABA_PLAN = `
<svg viewBox="0 0 360 330" width="100%" role="img" aria-label="مخطط الكعبة من الأعلى مع مواضع الطواف" style="font-family:inherit">
  <!-- الشمال أعلى؛ الحجر الأسود شرقاً (يمين)، اليماني جنوباً (أسفل)، الشامي غرباً (يسار)، العراقي شمالاً (أعلى) -->
  <text x="180" y="18" font-size="13" fill="#cfd9e2" text-anchor="middle" font-weight="700">شمال ↑</text>
  <circle cx="180" cy="170" r="120" fill="none" stroke="#cfd9e2" stroke-width="2" stroke-dasharray="7 7"/>
  <path d="M298 214 A 120 120 0 0 0 122 66" fill="none" stroke="#6fb1e0" stroke-width="4"/>
  <path d="M122 66 L138 66 L131 53 Z" fill="#6fb1e0"/>
  <!-- حِجر إسماعيل -->
  <path d="M180 116 A 38 38 0 0 0 126 170 Z" fill="#eef4f8" stroke="#9db6c8" stroke-width="3"/>
  <!-- الكعبة -->
  <polygon points="180,116 234,170 180,224 126,170" fill="#2b2b2b" stroke="#1c1c1c" stroke-width="2"/>
  <polygon points="180,129 221,170 180,211 139,170" fill="none" stroke="#c9a227" stroke-width="5" opacity=".85"/>
  <text x="180" y="175" font-size="14" fill="#e9d7a1" text-anchor="middle" font-weight="700">الكعبة</text>
  <!-- خط البداية -->
  <line x1="243" y1="170" x2="330" y2="170" stroke="#6fb1e0" stroke-width="4"/>
  <!-- الحجر الأسود -->
  <circle cx="234" cy="170" r="10" fill="#3a3a3a" stroke="#c9a227" stroke-width="3"/>
  <!-- الباب -->
  <rect x="207" y="135" width="15" height="15" fill="#c9a227" transform="rotate(45 214.5 142.5)"/>
  <!-- الملتزم -->
  <line x1="226" y1="152" x2="233" y2="163" stroke="#dcb75a" stroke-width="5"/>
  <!-- مقام إبراهيم -->
  <circle cx="276" cy="100" r="11" fill="#dcb75a" stroke="#8a6d1f" stroke-width="2"/>
  <!-- الركن اليماني -->
  <circle cx="180" cy="224" r="8" fill="none" stroke="#6fb1e0" stroke-width="3"/>
  <!-- أرقام -->
  <g font-size="13" font-weight="700" text-anchor="middle">
    <circle cx="258" cy="186" r="11" fill="#c9a227"/><text x="258" y="191" fill="#1a1a1a">١</text>
    <circle cx="180" cy="248" r="11" fill="#6fb1e0"/><text x="180" y="253" fill="#1a1a1a">٢</text>
    <circle cx="226" cy="118" r="11" fill="#c9a227"/><text x="226" y="123" fill="#1a1a1a">٣</text>
    <circle cx="252" cy="150" r="11" fill="#dcb75a"/><text x="252" y="155" fill="#1a1a1a">٤</text>
    <circle cx="300" cy="86" r="11" fill="#dcb75a"/><text x="300" y="91" fill="#1a1a1a">٥</text>
    <circle cx="118" cy="122" r="11" fill="#eef4f8"/><text x="118" y="127" fill="#1a1a1a">٦</text>
    <circle cx="300" cy="196" r="11" fill="#6fb1e0"/><text x="300" y="201" fill="#1a1a1a">٧</text>
    <circle cx="100" cy="190" r="11" fill="#8a97a3"/><text x="100" y="195" fill="#1a1a1a">٨</text>
    <circle cx="218" cy="92" r="11" fill="#8a97a3"/><text x="218" y="97" fill="#1a1a1a">٩</text>
  </g>
  <text x="180" y="316" font-size="13" fill="#cfd9e2" text-anchor="middle">اتجاه الطواف: عكس عقارب الساعة والكعبة عن يسارك</text>
</svg>
<ol class="planlegend">
  <li><b>١ الحجر الأسود</b> — الركن الشرقي؛ منه يبدأ الشوط وعنده ينتهي</li>
  <li><b>٢ الركن اليماني</b> — مقابل الحجر؛ بينه وبين الحجر: «ربنا آتنا في الدنيا حسنة…»</li>
  <li><b>٣ الباب</b> — بين الحجر الأسود والركن العراقي</li>
  <li><b>٤ الملتزم</b> — ما بين الباب والحجر الأسود</li>
  <li><b>٥ مقام إبراهيم</b> — قبالة الباب، تصلي خلفه ركعتي الطواف</li>
  <li><b>٦ حِجر إسماعيل</b> — يُطاف من خارجه</li>
  <li><b>٧ خط البداية</b> — الخط الممتد من الحجر الأسود</li>
  <li><b>٨ الركن الشامي</b> · <b>٩ الركن العراقي</b></li>
</ol>`;

const SPOT_ART = [
  {
    k: "hajar", name: "الحجر الأسود", where: "في الركن الشرقي للكعبة، بجوار الباب (بينهما الملتزم)؛ تجعل الكعبة عن يسارك وتبدأ منه — يُعرف بالإطار الفضي البيضاوي.",
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
    k: "yamani", name: "الركن اليماني", where: "الركن الجنوبي المقابل للحجر الأسود، تمرّ به قبل الحجر مباشرة وأنت تطوف (جهة اليمن).",
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
