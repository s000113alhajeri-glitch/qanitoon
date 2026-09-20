/* Qanitoon — English edition: meaning-based UI translation layer.
   Quran, hadith and du'a texts (.dua) stay in Arabic; Quran gets Saheeh International meanings. */
const LANG = { cur: localStorage.getItem("qn_lang") || "en" };
const EN = {
  /* nav & titles */
  "قانتون": "Qanitoon", "الرئيسية": "Home", "العمرة": "Umrah", "الحج": "Hajj", "المصحف": "Quran", "الأذكار": "Adhkar",
  "التدبّر": "Reflect", "رمضان": "Ramadan", "جدول رمضان": "Ramadan", "ملفي والإعدادات": "Profile & Settings",
  "ملخص يومك": "Your day at a glance", "مناسك العمرة خطوة بخطوة": "Umrah rites, step by step",
  "مناسك الحج يوماً بيوم": "Hajj rites, day by day", "القراءة والورد والختمة": "Reading, daily portion and completion",
  "الصباح والمساء وبعد الصلاة": "Morning, evening and after prayer", "أسماء الله والأدعية واسألني": "Names of Allah, supplications, Ask me",
  "سنة النبي ﷺ في رمضان والصيام المستحب": "The Prophet's ﷺ way in Ramadan and voluntary fasting",
  "الحساب والموقع والخصوصية": "Account, location and privacy", "يعمل بدون إنترنت": "Works offline",
  "ملفي والإعدادات": "Profile & settings", "مساعدة": "Help",
  /* common buttons */
  "→ رجوع": "← Back", "→ السابق": "← Previous", "التالي ←": "Next →", "حفظ": "Save", "إغلاق": "Close", "المزيد ▾": "More ▾", "أقل ▴": "Less ▴",
  "الصفحة التالية": "Next page", "الصفحة السابقة": "Previous page", "إلغاء الجميع": "Clear all", "ابدأ القراءة": "Start reading",
  "+ شوط": "+ Lap", "+ حصاة": "+ Pebble", "الآن": "Now", "الوقت:": "Time:", "التكرار": "Count", "التكرار المطلوب": "Required count",
  "التكرار المقترح": "Suggested count", "المعنى": "Meaning", "اسم الله": "Name of Allah", "لا نتيجة.": "No results.",
  /* badges */
  "قرآن": "Quran", "سنة": "Sunnah", "صحيح": "Authentic", "سنة صحيحة": "Authentic Sunnah", "حسن": "Good (hasan)", "مباح": "Permissible",
  "دعاء مباح": "Permissible du'a", "أهل العلم": "Scholars", "من القرآن": "From the Quran", "من السنة الصحيحة": "From authentic Sunnah",
  "ذُكر في القرآن": "Mentioned in the Quran", "ورد الاسم نفسه في القرآن": "This very name occurs in the Quran",
  "ورد الاسم نفسه في السنة الصحيحة": "This very name occurs in authentic Sunnah",
  "لم يرد بهذا اللفظ في القرآن ولا في حديث صحيح؛ من التعداد المشهور": "Not found with this exact wording in the Quran or an authentic hadith; from the well-known list",
  "استشعار الاسم": "Living the name", "توجيه تربوي": "Guidance", "مادة تعليمية": "Educational", "ليس حديثاً.": "Not a hadith.",
  "فيه خلاف / ضعيف": "Disputed / weak", "مسألة فيها خلاف": "A matter of scholarly difference",
  "حديث للتذكّر والعمل — ليس ذكراً يُعدّ.": "A hadith to reflect and act upon; not a counted dhikr.",
  "دعاء مباح — لم يثبت رفعه": "Permissible du'a; not authentically attributed to the Prophet ﷺ",
  "دعاء مباح — ليست سنة مخصوصة": "Permissible du'a; not a specific Sunnah",
  "ثابت عن النبي ﷺ،": "Authentically reported from the Prophet ﷺ,",
  /* home */
  "ملخص يومي": "Daily summary", "حالتي": "How I feel", "اكتب حالتي": "Tell me how you feel", "اقتراحات:": "Suggestions:",
  "كيف حالك الآن؟ مثلاً: أنا بخير، فرحان/ة، زعلان/ة، حزين/ة…": "How are you right now? e.g. I'm fine, happy, upset, sad, anxious…",
  "اختر حالة أو اكتبها: هم، رزق، خصومة…": "Pick a situation or type it: worry, provision, a quarrel…",
  "لم أتبيّن الحالة — اختر من القائمة.": "I couldn't recognise that. Please pick from the list.",
  "ذكر ودعاء فقط — بلا نصائح ولا مناقشة تصرفات.": "Dhikr and du'a only; no advice and no discussion of conduct.",
  "الصلاة": "Prayer", "الوقت الآن": "Current time", "التاريخ الهجري": "Hijri date", "ضبط يدوي ±يوم": "Manual adjust ± day",
  "فضل اليوم": "Virtue of the day", "ساعة الإجابة": "Hour of acceptance", "سورة الكهف": "Surah Al-Kahf", "افتح سورة الكهف": "Open Surah Al-Kahf",
  /* umrah / hajj */
  "تعرّف على العمرة": "Learn about Umrah", "تعرّف على الحج": "Learn about Hajj", "ابدأ": "Start",
  "أركانها:": "Pillars:", "واجباتها:": "Obligations:", "خطواتها:": "Steps:", "أركانه:": "Pillars:", "واجباته:": "Obligations:", "أنواعه:": "Types:", "أيامه:": "Days:",
  "ما يُفسد العمرة": "What invalidates Umrah", "ما يُفسد الحج": "What invalidates Hajj", "ما يُبطل الطواف": "What invalidates Tawaf", "ما يُبطل السعي": "What invalidates Sa'i",
  "المباحات في الإحرام": "Permitted while in Ihram", "محظورات الإحرام (تُوجب الفدية ولا تُفسد النسك)": "Prohibitions of Ihram (require expiation; do not invalidate the rite)",
  "المُفسد الوحيد:": "The only invalidator:", "الثابت في الطواف": "Authentic in Tawaf", "الثابت في السعي": "Authentic in Sa'i", "الثابت في كل شوط:": "Authentic in every lap:",
  "بعد الشوط السابع": "After the seventh lap", "نهاية السعي": "End of Sa'i", "على الصفا والمروة": "At Safa and Marwah",
  "تعرّف على المواضع بالصورة": "See the locations on the diagram", "مخطط الكعبة من الأعلى": "Kaaba, top view", "أين هو؟": "Where is it?",
  "حصيات الرمي": "Stoning pebbles", "التحلل الأول": "First release (tahallul)", "التحلل الثاني": "Second release", "عرفات": "Arafat",
  "الإفراد": "Ifrad", "القِران": "Qiran", "التمتّع": "Tamattu'", "أنواع الحج الثلاثة:": "The three types of Hajj:",
  "الجمهور": "Majority of scholars", "الحنفية": "Hanafi school", "برنامج الحاجّ بعرفة": "Pilgrim's programme at Arafat", "برنامج غير الحاجّ": "Programme for non-pilgrims",
  "＋ اختر أدعيتك من المكتبة": "＋ Choose your du'as from the library", "اختيار من المكتبة": "Choose from the library",
  "ما اخترتِ أدعية لهذا الشوط بعد.": "You haven't chosen du'as for this lap yet.", "أدعية إضافية من الكتيّب": "Additional du'as from the booklet",
  "عدّ الأشواط بالموقع مساعدة تقنية قد تخطئ؛ صحة النسك مسؤوليتك.": "Location-based lap counting is a technical aid and may err; the validity of your rite is your responsibility.",
  "الموقع": "Location", "دقة GPS": "GPS accuracy",
  /* quran */
  "وردي والختمة": "My portion & completion", "وردي اليومي من القرآن": "My daily Quran portion", "اقرأ ورد اليوم": "Read today's portion",
  "عدد الصفحات يومياً": "Pages per day", "قرأت هذه الصفحة اليوم": "I read this page today", "علامات المصحف": "Bookmarks", "الباقي": "Remaining",
  "اذهب إلى سورة": "Go to surah", "اكتب اسم السورة… مثال: الكهف": "Type a surah name… e.g. Al-Kahf", "لا توجد سورة بهذا الاسم": "No surah with that name",
  "ابحث في القرآن… مثال: الصفا والمروة": "Search the Quran… e.g. Safa and Marwah", "بحث في القرآن": "Search the Quran",
  "لا نتائج — جرّب كلمة أقصر أو موضوعاً (السكينة، الصبر، الرزق…)": "No results. Try a shorter word or a theme (tranquillity, patience, provision…)",
  "آداب التلاوة": "Etiquette of recitation", "الطهارة والقراءة": "Purity and reading", "الاستعاذة والبسملة": "Isti'adhah and Basmalah",
  "قبل التلاوة": "Before recitation", "دعاء ختم القرآن": "Du'a on completing the Quran", "أتممتِ الختمة — تقبّل الله منك.": "You completed the Quran. May Allah accept it from you.",
  "يظهر دعاء ختم القرآن هنا عند إتمام الختمة.": "The completion du'a appears here when you finish the Quran.",
  "دعاء يُقال قبل التلاوة أو بعدها": "A du'a said before or after recitation", "الاستخدام الصحيح للمصحف": "Using the Quran correctly",
  "البسملة: أول السورة أم وسطها؟": "Basmalah: at the start of a surah or mid-surah?", "البدء من أول السورة:": "Starting at the beginning of a surah:",
  "البدء من وسط السورة:": "Starting mid-surah:", "مسّ المصحف المطبوع:": "Touching a printed Quran:", "الحائض والنُّفَساء:": "Menstruating and postnatal women:",
  "الجُنب:": "In a state of major impurity:", "القراءة من الهاتف أو حفظاً:": "Reading from a phone or from memory:", "الغُسل": "Ghusl",
  "سورة الأنفال إلى التوبة:": "From Al-Anfal into At-Tawbah:", "عند نسيان آية": "When forgetting a verse", "النص الكامل": "Full text", "آية،": "verse,",
  /* adhkar */
  "أذكار الصباح": "Morning adhkar", "أذكار المساء": "Evening adhkar", "بعد كل صلاة": "After every prayer", "أذكار النوم": "Before sleep",
  "الاستيقاظ من النوم": "On waking up", "الأدعية النبوية": "Prophetic du'as", "الأدعية المصنّفة": "Du'as by topic", "الأدعية القرآنية": "Quranic du'as",
  "جوامع الدعاء": "Comprehensive du'as", "أذكار الأحوال": "Adhkar for occasions", "أدعية الأنبياء": "Du'as of the Prophets", "السفر": "Travel", "يوم عرفة": "Day of Arafah",
  "الصلاة على النبي ﷺ": "Salawat upon the Prophet ﷺ", "استغفار": "Seeking forgiveness", "في كل صلاة": "In every prayer",
  /* tadabbur */
  "التسبيح": "Tasbih", "جدولي": "My schedule", "اسألني": "Ask me", "مكتبة الأدعية": "Du'a library",
  "التسبيح بأسماء الله الحسنى": "Glorifying Allah by His beautiful names", "تسابيح وفضلها": "Tasbih and its virtue",
  "لماذا التسبيح بالأسماء؟": "Why glorify Allah by His names?", "أوقات التسبيح في القرآن": "Times of tasbih in the Quran",
  "افتح «تعلّم التسبيح بأسماء الله» ←": "Open “Learn tasbih by Allah's names” →", "أريد أتعلّم التسبيح بأسماء الله": "I want to learn tasbih by Allah's names",
  "الثابت في هذا الوقت": "Authentic for this time", "أدعيتي في هذا الوقت": "My du'as for this time", "ذكر ودعاء اليوم": "Today's dhikr and du'a",
  "لا عناصر — أضيفي ما تريدين متابعته.": "Nothing here yet. Add what you'd like to follow.",
  "لم تختاري شيئاً بعد — وتدعين بما شئتِ.": "Nothing chosen yet; you may supplicate as you wish.",
  "افتحي العنوان وعلّمي ✓ ما تريدين ثم «حفظ».": "Open a heading, tick ✓ what you want, then “Save”.",
  "مكتبة الأدعية: كل الأدعية ببحث وفلتر ←": "Du'a library: all du'as with search and filters →", "كل الأدعية": "All du'as",
  "ابحث: الرزق، الزواج، الوالدين…": "Search: provision, marriage, parents…", "ابحث بالمعنى: الرزق، الهمّ، الوالدين…": "Search by meaning: provision, worry, parents…",
  "حفظ في مكتبتي": "Save to my library", "أكتب دعائي": "Write my own du'a", "فحص الدعاء": "Check a du'a", "اكتبي دعاءك": "Write your du'a",
  "اكتبي الدعاء أولاً.": "Write the du'a first.", "اكتبي دعاءك بلفظك… مثال: اللهم ارزقني واشف أمي": "Write your du'a in your own words… e.g. O Allah, provide for me and heal my mother",
  "لا يُحفظ هذا الدعاء ولا يُضاف لأشواطك حتى تُعدّلي صياغته.": "This du'a won't be saved or added to your laps until you reword it.",
  "— للمراجعة": "— for review", "قبل أن تدعو": "Before you supplicate", "الكل": "All",
  "أوقات الدعاء الواردة عن النبي ﷺ فقط، كلٌّ بحديثه ودرجته. يظهر أعلى القائمة ما أنتِ فيه الآن، ويُنبَّه لما فعّلتِه. اختيارك للأدعية تسهيلٌ للتذكير، ويجوز لك أن تدعي بما شئتِ.": "Only the times of supplication reported from the Prophet ﷺ, each with its hadith and grading. What applies to you right now appears at the top of the list, and you are reminded of what you have switched on. Choosing du'as here is only an aid to remembering; you may supplicate with whatever you wish.",
  "«ما من مسلم يدعو بدعوة ليس فيها إثم ولا قطيعة رحم إلا أعطاه الله بها إحدى ثلاث: إمّا أن تُعجَّل له دعوته، وإمّا أن يدّخرها له في الآخرة، وإمّا أن يصرف عنه من السوء مثلها»": "“There is no Muslim who makes a supplication containing no sin or severing of kinship but that Allah gives him one of three things by it: either his request is granted quickly, or it is stored up for him in the Hereafter, or an equivalent harm is turned away from him.”",
  "«ادعوا الله وأنتم موقنون بالإجابة»": "“Call upon Allah while being certain of a response.”", "تنبيهات أهل العلم": "Scholars' cautions", "الحديث:": "Hadith:",
  "المصدر: مأثور عن القرّاء والسلف — ليس حديثاً": "Source: transmitted from reciters and early generations; not a hadith",
  /* situations */
  "خصومة / زعل / سوء تفاهم": "Quarrel / upset / misunderstanding", "ظلمتُ أحداً / أخطأت في حقّ أحد": "I wronged someone", "ظلمني أحد / أُخذ حقّي": "Someone wronged me / my right was taken",
  "غضب / عصبية": "Anger", "همّ / ضيق / حزن": "Worry / distress / sadness", "خوف من المستقبل / قلق": "Fear of the future / anxiety", "مرض / وجع": "Illness / pain",
  "ذنب / أريد التوبة": "Sin / I want to repent", "دَين / ضيق مالي / رزق": "Debt / financial hardship / provision", "زواج / ذرية": "Marriage / children",
  "فقد عزيز / وفاة": "Loss of a loved one", "حسد / عين / وسوسة": "Envy / evil eye / whispers", "نعمة / شكر / فرح": "Blessing / gratitude / joy",
  "امتحان / قرار / حاجة": "Exam / decision / need", "الوالدان": "Parents", "قبل النوم / قيام الليل": "Before sleep / night prayer",
  "إن كان في خاطرك إيذاء نفسك أو أحد — تواصل الآن": "If you are thinking of harming yourself or anyone, reach out now",
  /* dua categories */
  "للنفس: الهداية والثبات وصلاح القلب": "For oneself: guidance, steadfastness and a sound heart", "للرزق والعمل وقضاء الدَّين": "Provision, work and settling debt",
  "للعبادة وحسن العمل": "Worship and good deeds", "للعلم والفهم والتوفيق": "Knowledge, understanding and success", "للدنيا والحياة والعافية": "This life and well-being",
  "للآخرة وحسن الخاتمة": "The Hereafter and a good end", "للوالدين": "For parents", "للإخوة والأخوات والأهل والذرية": "Siblings, family and children",
  "للأجداد والجدّات ومن سبقنا بالإيمان": "Grandparents and those who preceded us in faith", "لكل من كان له فضل عليّ": "Everyone who has done me a kindness",
  "لغير المسلم: أن يشرح الله صدره": "For a non-Muslim: that Allah opens their heart", "للعاصي: أن يرده الله رداً جميلاً": "For a sinner: that Allah brings them back gently",
  "على الظالم ومن سلب حقي": "Against an oppressor and whoever took my right", "النصر والتمكين ونصرة المستضعفين": "Victory, empowerment and aid for the oppressed",
  "آيات تثبيت عند الشدة (قرآن — تُقرأ للتثبيت لا كدعاء)": "Verses of steadfastness in hardship (recited for strength, not as du'a)",
  /* jadwal times */
  "ثلث الليل الآخر": "Last third of the night", "بين الأذان والإقامة": "Between adhan and iqamah", "دبر الصلوات المكتوبة": "After the obligatory prayers",
  "في السجود": "In prostration", "ساعة الجمعة": "Friday's special hour", "عند الإفطار": "At breaking the fast", "العشر الأواخر من رمضان": "Last ten nights of Ramadan",
  "عند نزول المطر": "When rain falls", "في السفر": "While travelling",
  /* ramadan */
  "الإمساكية والسحور والإفطار وليالي العشر مع أدعيتها.": "Timetable, suhoor, iftar and the last ten nights with their du'as.",
  "ينتهي السحور (الفجر)": "Suhoor ends (Fajr)", "الإفطار (المغرب)": "Iftar (Maghrib)", "القضاء": "Make-up fasts", "أيام أفطرتها": "Days missed", "أيام أفطرتها في رمضان": "Days missed in Ramadan",
  "قضيتُ منها": "Days made up", "الصيام المستحب": "Voluntary fasting", "أدعية الصائم والإفطار": "Du'as for fasting and iftar", "أدعية القيام": "Night prayer du'as",
  "سنة النبي عليه الصلاة والسلام في رمضان": "The Prophet's ﷺ practice in Ramadan", "برنامج اليوم بالترتيب": "Today's programme in order", "طريقة الحساب": "Calculation method",
  /* settings */
  "الاسم": "Name", "البريد الإلكتروني": "Email", "رقم الهاتف بمفتاح الدولة": "Phone with country code", "الدولة": "Country", "الحساب": "Account",
  "التنبيهات": "Notifications", "إذن التنبيهات على الجهاز": "Device notification permission", "إذن الموقع (القبلة، الأوقات، التنبيه بالمواضع)": "Location permission (qibla, times, place alerts)",
  "الخصوصية وإخلاء المسؤولية": "Privacy & disclaimer", "الإصدار": "Version", "مشكلة في التطبيق؟": "Problem with the app?", "سؤال شرعي أو فتوى؟": "A religious question or fatwa?",
  "نسخة للمراجعة الشرعية، غير معتمدة رسمياً من أي جهة.": "A version for scholarly review; not officially endorsed by any body.",
  "مفتاح تنبيه الصلاة في قسم «التنبيهات» أعلاه.": "The prayer alert switch is in “Notifications” above.",
  "كيف أستعمل هذا القسم؟": "How do I use this section?",
  /* umrah steps */
  "عند الخروج من المنزل": "Leaving home", "عند الركوب": "Boarding the vehicle", "عند رؤية بيوت مكة المكرمة": "On seeing the houses of Makkah",
  "عند رؤية المسجد الحرام": "On seeing the Sacred Mosque", "عند رؤية الكعبة المشرفة": "On seeing the Kaaba", "عند دخول المسجد الحرام": "Entering the Sacred Mosque",
  "نية الطواف وما يقال في بداية كل شوط": "Intention for Tawaf and what to say at each lap", "دعاء مقام إبراهيم (بعد ركعتي الطواف)": "Du'a at Maqam Ibrahim (after the two rak'ahs)",
  "دعاء حجر إسماعيل": "Du'a at Hijr Ismail", "دعاء الملتزم": "Du'a at Al-Multazam", "دعاء شرب ماء زمزم": "Du'a when drinking Zamzam",
  "نية السعي وما يقال عند بداية كل شوط": "Intention for Sa'i and what to say at each lap", "دعاء ختام السعي عند المروة": "Closing du'a of Sa'i at Marwah",
  "الشوط الأول من الطواف": "Tawaf, lap 1", "الشوط الثاني من الطواف": "Tawaf, lap 2", "الشوط الثالث من الطواف": "Tawaf, lap 3", "الشوط الرابع من الطواف": "Tawaf, lap 4",
  "الشوط الخامس من الطواف": "Tawaf, lap 5", "الشوط السادس من الطواف": "Tawaf, lap 6", "الشوط السابع من الطواف": "Tawaf, lap 7",
  "الشوط الأول من السعي": "Sa'i, lap 1", "الشوط الثاني من السعي": "Sa'i, lap 2", "الشوط الثالث من السعي": "Sa'i, lap 3", "الشوط الرابع من السعي": "Sa'i, lap 4",
  "الشوط الخامس من السعي": "Sa'i, lap 5", "الشوط السادس من السعي": "Sa'i, lap 6", "الشوط السابع من السعي": "Sa'i, lap 7",
  "٨ ذو الحجة — يوم التروية": "8 Dhul-Hijjah — Day of Tarwiyah", "٩ ذو الحجة — يوم عرفة": "9 Dhul-Hijjah — Day of Arafah", "١٠ ذو الحجة — يوم النحر": "10 Dhul-Hijjah — Day of Sacrifice",
  "١١–١٣ ذو الحجة — أيام التشريق": "11–13 Dhul-Hijjah — Days of Tashreeq", "الوداع": "Farewell",
  /* tasbih times */
  "قبل طلوع الشمس وقبل غروبها": "Before sunrise and before sunset", "آناء الليل وأطراف النهار": "Through the night and at the edges of the day",
  "أدبار السجود": "After prostrations", "إدبار النجوم": "As the stars fade", "حين تقوم": "When you rise", "حين تمسون وحين تصبحون": "Evening and morning",
  "بكرةً وأصيلاً": "Early morning and late afternoon", "بالعشيّ والإبكار": "Evening and early morning",
  /* misc */
  "الفجر": "Fajr", "الظهر": "Dhuhr", "العصر": "Asr", "المغرب": "Maghrib", "العشاء": "Isha", "الشروق": "Sunrise", "القبلة": "Qibla",
  "البقرة ١١٦": "Al-Baqarah 116", "﴿كُلٌّ لَّهُ قَانِتُونَ﴾": "﴿كُلٌّ لَّهُ قَانِتُونَ﴾ “All are devoutly obedient to Him”",
  "القانتون: الخاضعون الخاشعون لله المطيعون له، وقيل: المصلّون — تفسير ابن كثير والطبري": "Al-Qanitoon: those humbly and devoutly obedient to Allah; some said: those who pray — Ibn Kathir, At-Tabari"
};

const SURAH_EN = ["Al-Fatihah","Al-Baqarah","Aal Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha","Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum","Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir","Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf","Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadilah","Al-Hashr","Al-Mumtahanah","As-Saff","Al-Jumu'ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij","Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","Abasa","At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad","Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-Adiyat","Al-Qari'ah","At-Takathur","Al-Asr","Al-Humazah","Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"];
const SURAH_AR = ["الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"];
const BOOKS = [["البخاري ومسلم","Al-Bukhari & Muslim"],["البخاري","Al-Bukhari"],["مسلم","Muslim"],["أبو داود","Abu Dawud"],["الترمذي","At-Tirmidhi"],["النسائي في الكبرى","An-Nasa'i (Al-Kubra)"],["النسائي","An-Nasa'i"],["ابن ماجه","Ibn Majah"],["أحمد","Ahmad"],["الحاكم","Al-Hakim"],["البزار","Al-Bazzar"],["الطبراني في الكبير","At-Tabarani (Al-Kabir)"],["الطبراني","At-Tabarani"],["ابن حبان","Ibn Hibban"],["ابن السني","Ibn As-Sunni"],["ابن خزيمة","Ibn Khuzaymah"],["الدارمي","Ad-Darimi"],["المستدرك","Al-Mustadrak"],["الصحيحة للألباني","As-Sahihah (Al-Albani)"],["وصححه الألباني","graded authentic by Al-Albani"],["صحيح","authentic"],["حسن","good (hasan)"],["ضعيف","weak"],["حصن المسلم","Hisn al-Muslim"],["موقوفاً","mawquf"],["قرآن","Quran"],["سورة","Surah"],["دعاء مباح","permissible du'a"],["ليس حديثاً","not a hadith"],["ابن كثير","Ibn Kathir"],["السعدي","As-Sa'di"],["ابن القيم","Ibn al-Qayyim"],["ابن تيمية","Ibn Taymiyyah"],["الخطابي","Al-Khattabi"],["تفسير","Tafsir"],["بدائع الفوائد","Bada'i' al-Fawa'id"],["شأن الدعاء","Sha'n ad-Du'a"],["اجتماع الجيوش","Ijtima' al-Juyush"],["إبراهيم وإسماعيل","Ibrahim and Isma'il"],["إبراهيم ومن معه","Ibrahim and those with him"],["أصحاب الكهف","the people of the cave"],["آدم وحواء","Adam and Hawwa"],["إبراهيم","Ibrahim"],["موسى","Musa"],["عيسى","Isa"],["نوح","Nuh"],["يوسف","Yusuf"],["يونس","Yunus"],["أيوب","Ayyub"],["زكريا","Zakariyya"],["سليمان","Sulayman"],["شعيب","Shu'ayb"],["لوط","Lut"],["هود","Hud"],["محمد","Muhammad"],["عن عائشة رضي الله عنها","from Aishah, may Allah be pleased with her"],["دعاء الميت","du'a for the deceased"],["بعد الأذان","after the adhan"],["بعد الفجر","after Fajr"],["بعد المغرب","after Maghrib"],["عند الأرق","for insomnia"],["عند الفزع","when frightened"],["سيد الاستغفار","the master supplication for forgiveness"],["الصلاة الإبراهيمية","the Ibrahimi salawat"],["يُقال ثلاثاً","said three times"],["جويرية","Juwayriyah"],["تمام المئة","completing one hundred"],["مبني على","based on"],["من هدي السلف","from the practice of the early generations"],["الآية:","the verse:"],["تفسير أسماء الله الحسنى","Tafsir of the Names of Allah"],["أسماء الله الحسنى","the Names of Allah"],["لمن أهمّه أمر","for whoever is troubled by a matter"],["عند لقاء العدو","when facing the enemy"],["عن أبيّ بن كعب","from Ubayy ibn Ka'b"],["خزينة التمر","the date store"],["وصية معاذ","advice to Mu'adh"],["فعله ﷺ","his ﷺ practice"],["والعدد:","and the count:"],["عليه السلام","peace be upon him"],["دعاء","du'a of"],["قالها","said by"],["حين ألقي في النار","when he was thrown into the fire"],["وأصحابه","and his companions"]];
const AD = s => String(s).replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
const RULES = [
  [/^(مكية|مدنية) — (\d+) آية$/, (m) => `${m[1] === "مكية" ? "Makkan" : "Madinan"} — ${m[2]} verses`],
  [/^(\d+)\. (.+)$/, (m) => SURAH_EN[+m[1] - 1] ? `${m[1]}. ${SURAH_EN[+m[1] - 1]}` : null],
  [/^سُورَةُ (.+)$/, (m) => { const i = QURAN.surahs.findIndex(x => x.name === m[1]); return i >= 0 ? `Surah ${SURAH_EN[i]}` : null; }],
  [/^صفحة (\d+) من (\d+)$/, (m) => `Page ${m[1]} of ${m[2]}`],
  [/^الجزء (\d+)$/, (m) => `Juz ${m[1]}`],
  [/^المصدر: (.+)$/, (m) => "Source: " + books(m[1])],
  [/^(.*)(الإفراد|القِران|التمتّع)(.*)$/, () => null],
  [/^الفضل: (.+)$/, (m) => "Virtue: " + m[1]],
  [/^(.+) \((\d+)\)$/, (m) => EN[m[1]] ? `${EN[m[1]]} (${m[2]})` : null],
  [/^ذُكر في القرآن \((\d+)\)$/, (m) => `Mentioned in the Quran (${m[1]})`],
  [/^بعد (\d+) س (\d+) د$/, (m) => `in ${m[1]} h ${m[2]} min`],
  [/^(\d+) س (\d+) د$/, (m) => `${m[1]} h ${m[2]} min`],
  [/^الفجر \(غداً\) (.+)$/, (m) => `Fajr (tomorrow) ${m[1]}`],
  [/^(الفجر|الشروق|الظهر|العصر|المغرب|العشاء) \(غداً\) (.+)$/, (m) => `${EN[m[1]]} (tomorrow) ${m[2]}`],
  [/^(الفجر|الشروق|الظهر|العصر|المغرب|العشاء) (\d\d:\d\d)$/, (m) => `${EN[m[1]]} ${m[2]}`],
  [/^القبلة (\d+)°$/, (m) => `Qibla ${m[1]}°`],
  [/^(\d+) (ربيع الآخر|محرم|صفر|ربيع الأول|جمادى الأولى|جمادى الآخرة|رجب|شعبان|رمضان|شوال|ذو القعدة|ذو الحجة) (\d+)هـ(.*)$/, (m) => `${m[1]} ${HIJRI_EN[m[2]]} ${m[3]} AH${m[4]}`],
  [/^الختمة في (\d+) يوماً — قرأت اليوم (\d+) من (\d+) صفحات\.$/, (m) => `Completion in ${m[1]} days — today you read ${m[2]} of ${m[3]} pages.`],
  [/^أيام الالتزام: (\d+) · وصلت إلى صفحة (\d+) — (\d+)٪ من الختمة$/, (m) => `Streak: ${m[1]} days · reached page ${m[2]} — ${m[3]}% complete`],
  [/^(\d+)٪$/, (m) => `${m[1]}%`],
  [/^ابدأ (العمرة|الحج) ←$/, (m) => `Start ${EN[m[1]]} →`],
  [/^(العمرة|الحج) — الخطوة الحالية$/, (m) => `${EN[m[1]]} — current step`],
  [/^＋ (العمرة|الحج) — الخطوة الحالية$/, (m) => `＋ ${EN[m[1]]} — current step`],
  [/^لم يرد اسم (.+) بهذا اللفظ في القرآن\.$/, (m) => `The name ${m[1]} does not occur with this exact wording in the Quran.`],
  [/^(\d+) دعاء( — تظهر أول (\d+)، ضيّقي البحث)?$/, (m) => `${m[1]} du'as${m[2] ? ` — showing the first ${m[3]}; narrow your search` : ""}`],
  [/^(· )?من (\d\d:\d\d) إلى (\d\d:\d\d)$/, (m) => `${m[1] || ""}from ${m[2]} to ${m[3]}`],
];
const HIJRI_EN = { "محرم": "Muharram", "صفر": "Safar", "ربيع الأول": "Rabi' al-Awwal", "ربيع الآخر": "Rabi' al-Thani", "جمادى الأولى": "Jumada al-Ula", "جمادى الآخرة": "Jumada al-Akhirah", "رجب": "Rajab", "شعبان": "Sha'ban", "رمضان": "Ramadan", "شوال": "Shawwal", "ذو القعدة": "Dhul-Qa'dah", "ذو الحجة": "Dhul-Hijjah" };
const AR_L = "[\\u0621-\\u064A\\u0660-\\u0669]";
function books(s) {
  let t = AD(s).replace(/،/g, ",").replace(/[\u064B-\u065F\u0670]/g, "");
  const rep = (a, e) => { t = t.replace(new RegExp("(^|[^\\u0621-\\u064A])(و?)" + a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=$|[^\\u0621-\\u064A])", "g"), "$1$2" + e); };
  SURAH_AR.map((a, i) => [a, SURAH_EN[i]]).sort((x, y) => y[0].length - x[0].length).forEach(([a, e]) => rep(a, e));
  BOOKS.map(([a, e]) => [a.replace(/[\u064B-\u065F\u0670]/g, ""), e]).sort((x, y) => y[0].length - x[0].length).forEach(([a, e]) => rep(a, e));
  t = t.replace(/(^|\s|\()و([A-Za-z])/g, "$1and $2");
  return t;
}
Object.assign(EN, {
  "أهلاً بك في قانتون": "Welcome to Qanitoon", "أدخلي اسمك ورقم هاتفك ثم «حفظ» للدخول": "Enter your name and phone number, then “Save” to continue",
  "ادعي": "Show du'a", "من الشمال": "from North", "ملفي": "My profile", "عربي": "عربي", "القراءة": "Read", "الورد اليومي": "Daily portion", "الورد اليومي من القرآن": "Daily Quran portion",
  "ضع علامة المصحف هنا": "Place bookmark here", "التسبيح اليوم": "Today's tasbih", "أذكار الصباح والمساء": "Morning & evening adhkar",
  "أوقات الدعاء النبوية (جدولي)": "Prophetic times of du'a (My schedule)", "الذكر والأدعية القرآنية": "Dhikr and Quranic du'as", "＋ الصيام والقضاء": "＋ Fasting & make-up days",
  "الصلاة (دخول الوقت)": "Prayer (start of time)", "المناسك: الأشواط والمواضع بالموقع": "Rites: laps and places by location", "المواسم: رمضان، عرفة، الجمعة": "Seasons: Ramadan, Arafah, Friday",
  "الطقس والطوارئ (مطر، عاصفة، هزّة)": "Weather & emergencies (rain, storm, quake)", "تفعيل": "Enable", "مفعّل": "Enabled", "السماح": "Allow", "سماء الليل": "Night sky", "سفر": "Travel",
  "تُحفظ البيانات على جهازك فقط. مفتاح الدولة يحدّد الأدعية الخاصة ببلدك.": "Your data is stored on your device only. The country code selects du'as specific to your country.",
  "تعمل التنبيهات داخل التطبيق دائماً؛ وعلى الجهاز عند السماح بها. تنبيهات الطقس والطوارئ تظهر وحدها عند وقوعها بموقعك.": "Alerts always work inside the app, and on the device once allowed. Weather and emergency alerts appear on their own when they happen at your location.",
  "يعمل تلقائياً بعد التفعيل مرة واحدة. تنبيهات الجو والمناسبات تظهر وحدها عند وقوعها.": "Works automatically after enabling once. Weather and seasonal alerts appear on their own.",
  "الحسابات الفلكية (الصلاة، القبلة، الهجري) تقريبية؛ المعتمد إعلان الجهة الرسمية في بلدك.": "Astronomical calculations (prayer, qibla, Hijri) are approximate; the official announcement in your country is authoritative.",
  "كل نص موسوم بمصدره: قرآن، سنة بتخريجها، أو دعاء مباح. ليس فتوى ولا يُغني عن أهل العلم.": "Every text is labelled with its source: Quran, Sunnah with reference, or permissible du'a. Not a fatwa and no substitute for scholars.",
  "أم القرى (مكة)": "Umm al-Qura (Makkah)", "هيئة الإمارات للأوقاف": "UAE Awqaf", "رابطة العالم الإسلامي": "Muslim World League", "الهيئة المصرية العامة للمساحة": "Egyptian General Authority of Survey",
  "جامعة العلوم الإسلامية — كراتشي": "University of Islamic Sciences, Karachi", "ISNA (أمريكا الشمالية)": "ISNA (North America)",
  "أركانها:": "Pillars:", "الإحرام، الطواف، السعي.": "Ihram, Tawaf, Sa'i.", "الإحرام من الميقات، والحلق أو التقصير.": "Ihram from the miqat, and shaving or trimming the hair.",
  "الإحرام، الوقوف بعرفة، طواف الإفاضة، السعي.": "Ihram, standing at Arafat, Tawaf al-Ifadah, Sa'i.",
  "الإحرام من الميقات، الوقوف بعرفة إلى الغروب، المبيت بمزدلفة، المبيت بمنى ليالي التشريق، رمي الجمار، الحلق أو التقصير، طواف الوداع.": "Ihram from the miqat, standing at Arafat until sunset, the night at Muzdalifah, nights at Mina during Tashreeq, stoning the Jamarat, shaving or trimming, Farewell Tawaf.",
  "تمتّع (عمرة ثم حج، وعليه هدي)، قِران (عمرة وحج بإحرام واحد، وعليه هدي)، إفراد (حج فقط).": "Tamattu' (Umrah then Hajj, with a sacrifice), Qiran (Umrah and Hajj in one ihram, with a sacrifice), Ifrad (Hajj only).",
  "٨ التروية بمنى ← ٩ عرفة ثم مزدلفة ← ١٠ رمي العقبة والهدي والحلق وطواف الإفاضة والسعي ← ١١–١٣ الرمي والمبيت بمنى ← طواف الوداع.": "8th: Tarwiyah at Mina → 9th: Arafat then Muzdalifah → 10th: stoning Al-Aqabah, sacrifice, shaving, Tawaf al-Ifadah and Sa'i → 11–13th: stoning and nights at Mina → Farewell Tawaf.",
  "المُفسد الوحيد:": "The only invalidator:", "قبل الفراغ من السعي؛ تفسد بها العمرة، ويلزم إتمامها ثم قضاؤها، وذبح شاة لفقراء الحرم.": "Before finishing Sa'i, it invalidates the Umrah; it must be completed, then repeated, with a sheep sacrificed for the poor of the Haram.",
  "ما عدا ذلك من المحظورات يوجب الفدية والعمرة صحيحة.": "All other prohibitions require expiation, and the Umrah remains valid.",
  "قبل التحلل الأول تُفسد الحج، ويلزم إتمامه وقضاؤه من قابل وذبح بدنة. وبعد التحلل الأول لا تفسده وفيها فدية.": "Before the first release, it invalidates the Hajj; it must be completed, repeated the next year, and a camel sacrificed. After the first release it does not invalidate it, but requires expiation.",
  "فوات الوقوف بعرفة: فات الحج، ويتحلل بعمرة ويقضي.": "Missing the standing at Arafat: the Hajj is missed; one exits with an Umrah and repeats it.",
  "ترك ركن (الطواف أو السعي): لا تفسد لكن لا تتمّ، ويبقى محرِماً حتى يعود فيأتي به.": "Omitting a pillar (Tawaf or Sa'i): not invalidated but incomplete; one remains in ihram until returning to perform it.",
  "ترك واجب: يُجبر بدم، والحج صحيح.": "Omitting an obligation: compensated by a sacrifice; the Hajj is valid.",
  "الطيب في البدن أو الثياب بعد الإحرام.": "Perfume on the body or clothes after entering ihram.", "حلق الشعر أو قصّه، وتقليم الأظافر.": "Shaving or cutting hair, and trimming nails.",
  "للرجل: لبس المخيط المحيط بالبدن (القميص، السراويل، الجوارب) وتغطية الرأس بملاصق.": "Men: wearing fitted stitched garments (shirt, trousers, socks) and covering the head with anything touching it.",
  "للمرأة: النقاب والقفازان.": "Women: the niqab and gloves.", "عقد النكاح أو الخِطبة، والمباشرة بشهوة.": "Marriage contract or proposal, and intimate contact with desire.",
  "قتل الصيد البرّي أو الإعانة عليه.": "Killing land game or assisting in it.", "الاغتسال وتغيير ملابس الإحرام وغسلها.": "Bathing, and changing or washing ihram garments.",
  "الاستظلال بالمظلّة أو السقف أو الخيمة.": "Shade from an umbrella, roof or tent.", "لبس الساعة والنظارة والخاتم والحزام والنعال.": "Wearing a watch, glasses, ring, belt and sandals.",
  "الحجامة وعصب الجرح، وحكّ الرأس والجسد برفق.": "Cupping, bandaging a wound, and gently scratching the head and body.",
  "الأكل والشرب والتحدّث والبيع والشراء دون رفع صوت أو خصام.": "Eating, drinking, talking, buying and selling, without raised voices or quarrelling.",
  "للمرأة: لبس ما شاءت من الثياب المعتادة بلا زينة ظاهرة، وتغطية الوجه عن الرجال الأجانب بلا نقاب مخصوص.": "Women: any ordinary clothing without visible adornment, covering the face from unrelated men without a fitted niqab.",
  "جعل الكعبة عن اليمين (الطواف مع عقارب الساعة).": "Keeping the Kaaba on your right (circling clockwise).",
  "المرور من داخل حِجر إسماعيل، فهو من البيت؛ يُعاد ذلك الشوط.": "Passing through Hijr Ismail, which is part of the House; that lap is repeated.",
  "نقص شوط أو جزء منه؛ ومن شكّ بنى على الأقلّ.": "Missing a lap or part of one; if in doubt, assume the lower count.",
  "النجاسة على البدن أو الثوب عند الجمهور.": "Impurity on the body or clothes, according to the majority.",
  "قطع الموالاة بفاصل طويل بلا عذر؛ أما قطعه لصلاة الفريضة أو الجنازة فيُكمل من حيث توقّف.": "Breaking continuity with a long unexcused pause; if interrupted for an obligatory or funeral prayer, resume where you stopped.",
  "البدء بالمروة قبل الصفا؛ لا يُحسب ذلك الشوط.": "Starting at Marwah before Safa; that lap does not count.", "نقص شوط أو الالتفاف قبل نهاية الممر.": "Missing a lap or turning before the end of the course.",
  "السعي قبل طواف صحيح.": "Sa'i before a valid Tawaf.", "من شكّ في العدد بنى على الأقلّ.": "If in doubt about the count, assume the lower number.",
  "لا تُشترط الطهارة للسعي، فإن انتقض الوضوء أثناءه أكمله وسعيه صحيح.": "Purity is not required for Sa'i; if wudu breaks during it, continue, and the Sa'i is valid.",
  "الفاصل اليسير للراحة والشرب لا يضرّ؛ والانقطاع الطويل بلا عذر يبطله عند بعض أهل العلم.": "A short pause to rest or drink is fine; a long unexcused break invalidates it according to some scholars.",
  "هذا تعريفٌ مختصر من كلام أهل العلم، ما اتُّفق عليه ذُكر جزماً وما فيه خلاف نُبّه عليه. ولمسألتك الخاصة اسألي جهة الإفتاء في بلدك.": "A brief summary from scholars: agreed matters are stated plainly, disputed ones are flagged. For your own case, ask the fatwa authority in your country.",
  "تعريفٌ مختصر من كلام أهل العلم، وما فيه خلاف نُبّه عليه. ولمسألتك الخاصة اسألي جهة الإفتاء في بلدك.": "A brief summary from scholars; disputed matters are flagged. For your own case, ask the fatwa authority in your country.",
  "هذه خلاصة مذاهب أهل العلم لا فتوى؛ وعند الحاجة يُسأل مفتي معتمد في بلدك.": "A summary of scholarly positions, not a fatwa; when needed, ask an accredited mufti in your country.",
  "الترتيل والتدبر: ﴿وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا﴾ (المزمل ٤) — قليلٌ بتدبر خير من كثير بلا فهم.": "Measured recitation and reflection: ﴿وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا﴾ “recite the Quran with measured recitation” (Al-Muzzammil 4). A little with reflection is better than much without understanding.",
  "تعاهُد الحفظ: «تعاهدوا هذا القرآن، فوالذي نفسي بيده لهو أشدُّ تفلُّتاً من الإبل في عُقُلها» (البخاري ومسلم).": "Keep reviewing what you memorise: “Keep up this Quran, for by the One in Whose hand is my soul, it slips away faster than a tethered camel” (Al-Bukhari & Muslim).",
  "إذا شككت في ضبط كلمة فارجع إلى مصحف مطبوع معتمد أو أهل العلم بالقراءات.": "If unsure about a word's vowelling, refer to an approved printed Quran or scholars of recitation.",
  "النص: الرسم العثماني من مشروع تنزيل (Tanzil.net) — 114 سورة، 6236 آية، 604 صفحات. عند أي اشتباه في ضبط كلمة فالمرجع مصحف المدينة المطبوع.": "Text: Uthmani script from the Tanzil project (Tanzil.net) — 114 surahs, 6236 verses, 604 pages. English meanings: Saheeh International. For any doubt about a word, the printed Madinah Mushaf is the reference.",
  "البحث بالكلمة أو الموضوع في القرآن: من باب التدبّر ← بحث في القرآن.": "Search the Quran by word or theme: Reflect → Search the Quran.",
  "يستعيذ ثم يبسمل ﴿بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ﴾ — إلا سورة التوبة (براءة) فلا بسملة في أولها، ويكفي التعوّذ.": "Say the isti'adhah then the basmalah ﴿بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ﴾, except Surah At-Tawbah, which has no basmalah at its start; the isti'adhah suffices.",
  "من وصل بينهما لا يبسمل، وله السكت أو الوصل أو الوقف.": "Whoever joins them does not say the basmalah; one may pause briefly, join, or stop.",
  "النحل ٩٨ — هذا هو الثابت المشروع قبل القراءة.": "An-Nahl 98 — this is what is authentically prescribed before reading.",
  "النحل ٩٨؛ كتب التجويد المعتمدة (المقدمة الجزرية وشروحها)؛ فتاوى اللجنة الدائمة.": "An-Nahl 98; standard tajweed works (Al-Jazariyyah and its commentaries); Permanent Committee fatwas.",
  "تجوز بلا وضوء؛ فالهاتف ليس مصحفاً، والنبي ﷺ كان يذكر الله على كل أحيانه (مسلم). والأفضل والأكمل أن تكون على طهارة.": "Allowed without wudu; a phone is not a mushaf, and the Prophet ﷺ remembered Allah at all times (Muslim). Being in a state of purity is better and more complete.",
  "لا يقرأ القرآن حتى يغتسل عند جمهور العلماء؛ لحديث عليّ: «كان ﷺ لا يحجبه عن القرآن شيء ليس الجنابة» (أبو داود والترمذي، وفي إسناده كلام).": "Should not recite the Quran until performing ghusl, according to most scholars, based on Ali's report: “Nothing kept him ﷺ from the Quran except janabah” (Abu Dawud, At-Tirmidhi; its chain is questioned).",
  "(كآية الكرسي، والمعوذات، والأذكار) تجوز في كل حال على وجه الذكر لا التلاوة.": "(such as Ayat al-Kursi, the Mu'awwidhat and adhkar) are allowed in every state as remembrance, not as recitation.",
  "المغني لابن قدامة، المجموع للنووي، مجموع فتاوى ابن تيمية، فتاوى اللجنة الدائمة (باب الطهارة).": "Al-Mughni (Ibn Qudamah), Al-Majmu' (An-Nawawi), Majmu' al-Fatawa (Ibn Taymiyyah), Permanent Committee fatwas (purity).",
  "بعد الفجر قبل الشروق، وبعد العصر قبل المغرب.": "After Fajr before sunrise, and after Asr before Maghrib.", "ساعات الليل، وأول النهار وآخره.": "The hours of the night, and the beginning and end of the day.",
  "عقب الصلوات المكتوبة (وقيل: الركعتان بعد المغرب).": "After the obligatory prayers (some said: the two rak'ahs after Maghrib).",
  "آخر الليل حين تختفي النجوم قبيل الفجر، وفُسِّرت بركعتي الفجر (سنّة الفجر).": "The end of the night as the stars fade before Fajr; also interpreted as the two rak'ahs before Fajr.",
  "عند القيام من النوم، ومن أي مجلس.": "When rising from sleep, or from any gathering.", "المغرب، والفجر، والعصر، والظهر — أربعة أوقات في الآية.": "Maghrib, Fajr, Asr and Dhuhr — four times in the verse.",
  "أول النهار وآخره.": "Beginning and end of the day.", "آخر النهار وأوله.": "End and beginning of the day.",
  "بين الأذان والإقامة (الدعاء لا يُردّ)": "Between adhan and iqamah (du'a is not rejected)",
  "وقت النزول الإلهي: «ينزل ربنا إلى السماء الدنيا حين يبقى ثلث الليل الآخر» (البخاري ومسلم)": "The time of divine descent: “Our Lord descends to the lowest heaven when the last third of the night remains” (Al-Bukhari & Muslim)",
  "وقتها من بعد الفجر إلى طلوع الشمس، ومن فاته فلا حرج أن يقولها إلى الزوال. الترتيب على حصن المسلم.": "Its time is from Fajr until sunrise; whoever misses it may say it until midday. Order follows Hisn al-Muslim.",
  "العدّاد يُحفظ لليوم ويعود للصفر تلقائياً مع اليوم الجديد. التصنيف:": "The counter is saved for the day and resets automatically with the new day. Labels:",
  "مسلم: «إني لأستغفر الله وأتوب إليه في اليوم مائة مرة»": "Muslim: “I seek Allah's forgiveness and repent to Him a hundred times a day”",
  "مسلم: «من قال سبحان الله وبحمده مائة مرة حُطّت خطاياه»": "Muslim: “Whoever says Subhan Allah wa bihamdihi a hundred times, his sins are wiped away”",
  "البخاري ومسلم: كلمتان خفيفتان على اللسان ثقيلتان في الميزان": "Al-Bukhari & Muslim: two phrases light on the tongue, heavy on the scale",
  "البخاري ومسلم: «كانت له عدل عشر رقاب… وكانت له حرزاً من الشيطان يومه ذلك»": "Al-Bukhari & Muslim: “equal to freeing ten slaves… and a protection from Satan that day”",
  "الترمذي (صحيح) — كفّارة المجلس": "At-Tirmidhi (authentic) — expiation of the gathering", "مسلم — حديث جويرية رضي الله عنها": "Muslim — hadith of Juwayriyah, may Allah be pleased with her",
  "البخاري ومسلم": "Al-Bukhari & Muslim", "مسلم": "Muslim", "البخاري ٢٧٣٦، مسلم ٢٦٧٧": "Al-Bukhari 2736, Muslim 2677", "السعدي، تفسير أسماء الله الحسنى": "As-Sa'di, Tafsir of the Names of Allah",
  "قال ابن القيم: إحصاؤها ثلاث مراتب: إحصاء ألفاظها وعددها، وفهم معانيها ومدلولها، ودعاء الله بها؛ دعاء ثناء وعبادة، ودعاء طلب ومسألة.": "Ibn al-Qayyim: knowing the names has three levels: knowing their wording and number, understanding their meanings, and calling on Allah by them, in praise and worship and in asking.",
  "قال ابن تيمية: كمالُ العبد في تحقيق معاني الأسماء الحسنى: أن يعبد الله بكل اسم بما يقتضيه ذلك الاسم من العبودية.": "Ibn Taymiyyah: the servant's perfection lies in realising the meanings of the beautiful names: worshipping Allah through each name with the devotion it calls for.",
  "— بدائع الفوائد ١/١٦٤": "— Bada'i' al-Fawa'id 1/164", "— مجموع الفتاوى ١/٦٨": "— Majmu' al-Fatawa 1/68", "— التوضيح والبيان لشجرة الإيمان": "— At-Tawdih wal-Bayan li-Shajarat al-Iman",
  "الأعراف ١٨٠": "Al-A'raf 180", "الأحزاب ٤١–٤٢": "Al-Ahzab 41–42", "آل عمران ٤١": "Aal Imran 41", "الروم ١٧–١٨": "Ar-Rum 17–18", "الطور ٤٨": "At-Tur 48", "الطور ٤٩": "At-Tur 49", "طه ١٣٠": "Ta-Ha 130", "ق ٤٠": "Qaf 40",
  "العلاقة الزوجية": "Marital relations"
});
Object.assign(EN, {"اللَّهُ": "اللَّهُ · Allah", "الرَّحْمَنُ": "الرَّحْمَنُ · The Most Merciful", "الرَّحِيمُ": "الرَّحِيمُ · The Bestower of Mercy", "الْمَلِكُ": "الْمَلِكُ · The King", "الْقُدُّوسُ": "الْقُدُّوسُ · The Most Holy", "السَّلَامُ": "السَّلَامُ · The Source of Peace", "الْمُؤْمِنُ": "الْمُؤْمِنُ · The Giver of Security", "الْمُهَيْمِنُ": "الْمُهَيْمِنُ · The Guardian", "الْعَزِيزُ": "الْعَزِيزُ · The Almighty", "الْجَبَّارُ": "الْجَبَّارُ · The Compeller", "الْمُتَكَبِّرُ": "الْمُتَكَبِّرُ · The Supreme", "الْخَالِقُ": "الْخَالِقُ · The Creator", "الْبَارِئُ": "الْبَارِئُ · The Originator", "الْمُصَوِّرُ": "الْمُصَوِّرُ · The Fashioner", "الْغَفَّارُ": "الْغَفَّارُ · The Ever-Forgiving", "الْقَهَّارُ": "الْقَهَّارُ · The Subduer", "الْوَهَّابُ": "الْوَهَّابُ · The Bestower", "الرَّزَّاقُ": "الرَّزَّاقُ · The Provider", "الْفَتَّاحُ": "الْفَتَّاحُ · The Opener", "الْعَلِيمُ": "الْعَلِيمُ · The All-Knowing", "الْقَابِضُ": "الْقَابِضُ · The Withholder", "الْبَاسِطُ": "الْبَاسِطُ · The Extender", "الْخَافِضُ": "الْخَافِضُ · The Abaser", "الرَّافِعُ": "الرَّافِعُ · The Exalter", "الْمُعِزُّ": "الْمُعِزُّ · The Honourer", "الْمُذِلُّ": "الْمُذِلُّ · The Humiliator", "السَّمِيعُ": "السَّمِيعُ · The All-Hearing", "الْبَصِيرُ": "الْبَصِيرُ · The All-Seeing", "الْحَكَمُ": "الْحَكَمُ · The Judge", "الْعَدْلُ": "الْعَدْلُ · The Just", "اللَّطِيفُ": "اللَّطِيفُ · The Most Subtle", "الْخَبِيرُ": "الْخَبِيرُ · The All-Aware", "الْحَلِيمُ": "الْحَلِيمُ · The Forbearing", "الْعَظِيمُ": "الْعَظِيمُ · The Magnificent", "الْغَفُورُ": "الْغَفُورُ · The Forgiving", "الشَّكُورُ": "الشَّكُورُ · The Appreciative", "الْعَلِيُّ": "الْعَلِيُّ · The Most High", "الْكَبِيرُ": "الْكَبِيرُ · The Most Great", "الْحَفِيظُ": "الْحَفِيظُ · The Preserver", "الْمُقِيتُ": "الْمُقِيتُ · The Sustainer", "الْحَسِيبُ": "الْحَسِيبُ · The Reckoner", "الْجَلِيلُ": "الْجَلِيلُ · The Majestic", "الْكَرِيمُ": "الْكَرِيمُ · The Generous", "الرَّقِيبُ": "الرَّقِيبُ · The Watchful", "الْمُجِيبُ": "الْمُجِيبُ · The Responsive", "الْوَاسِعُ": "الْوَاسِعُ · The All-Encompassing", "الْحَكِيمُ": "الْحَكِيمُ · The All-Wise", "الْوَدُودُ": "الْوَدُودُ · The Most Loving", "الْمَجِيدُ": "الْمَجِيدُ · The Most Glorious", "الْبَاعِثُ": "الْبَاعِثُ · The Resurrector", "الشَّهِيدُ": "الشَّهِيدُ · The Witness", "الْحَقُّ": "الْحَقُّ · The Truth", "الْوَكِيلُ": "الْوَكِيلُ · The Trustee", "الْقَوِيُّ": "الْقَوِيُّ · The Most Strong", "الْمَتِينُ": "الْمَتِينُ · The Firm", "الْوَلِيُّ": "الْوَلِيُّ · The Protector", "الْحَمِيدُ": "الْحَمِيدُ · The Praiseworthy", "الْمُحْصِي": "الْمُحْصِي · The Enumerator", "الْمُبْدِئُ": "الْمُبْدِئُ · The Originator", "الْمُعِيدُ": "الْمُعِيدُ · The Restorer", "الْمُحْيِي": "الْمُحْيِي · The Giver of Life", "الْمُمِيتُ": "الْمُمِيتُ · The Taker of Life", "الْحَيُّ": "الْحَيُّ · The Ever-Living", "الْقَيُّومُ": "الْقَيُّومُ · The Self-Subsisting", "الْوَاجِدُ": "الْوَاجِدُ · The Perceiver", "الْمَاجِدُ": "الْمَاجِدُ · The Illustrious", "الْوَاحِدُ": "الْوَاحِدُ · The One", "الصَّمَدُ": "الصَّمَدُ · The Eternal Refuge", "الْقَادِرُ": "الْقَادِرُ · The All-Powerful", "الْمُقْتَدِرُ": "الْمُقْتَدِرُ · The Omnipotent", "الْمُقَدِّمُ": "الْمُقَدِّمُ · The Expediter", "الْمُؤَخِّرُ": "الْمُؤَخِّرُ · The Delayer", "الْأَوَّلُ": "الْأَوَّلُ · The First", "الْآخِرُ": "الْآخِرُ · The Last", "الظَّاهِرُ": "الظَّاهِرُ · The Manifest", "الْبَاطِنُ": "الْبَاطِنُ · The Hidden", "الْوَالِي": "الْوَالِي · The Governor", "الْمُتَعَالِي": "الْمُتَعَالِي · The Most Exalted", "الْبَرُّ": "الْبَرُّ · The Source of Goodness", "التَّوَّابُ": "التَّوَّابُ · The Accepter of Repentance", "الْمُنْتَقِمُ": "الْمُنْتَقِمُ · The Avenger", "الْعَفُوُّ": "الْعَفُوُّ · The Pardoner", "الرَّؤُوفُ": "الرَّؤُوفُ · The Most Kind", "مَالِكُ الْمُلْكِ": "مَالِكُ الْمُلْكِ · Owner of Sovereignty", "ذُو الْجَلَالِ وَالْإِكْرَامِ": "ذُو الْجَلَالِ وَالْإِكْرَامِ · Lord of Majesty and Honour", "الْمُقْسِطُ": "الْمُقْسِطُ · The Equitable", "الْجَامِعُ": "الْجَامِعُ · The Gatherer", "الْغَنِيُّ": "الْغَنِيُّ · The Self-Sufficient", "الْمُغْنِي": "الْمُغْنِي · The Enricher", "الْمَانِعُ": "الْمَانِعُ · The Preventer", "الضَّارُّ": "الضَّارُّ · The Distresser", "النَّافِعُ": "النَّافِعُ · The Benefactor", "النُّورُ": "النُّورُ · The Light", "الْهَادِي": "الْهَادِي · The Guide", "الْبَدِيعُ": "الْبَدِيعُ · The Incomparable", "الْبَاقِي": "الْبَاقِي · The Everlasting", "الْوَارِثُ": "الْوَارِثُ · The Inheritor", "الرَّشِيدُ": "الرَّشِيدُ · The Guide to the Right Path", "الصَّبُورُ": "الصَّبُورُ · The Most Patient"});
Object.assign(EN, {
  "بعد": "in", "أتممت العدد": "Count complete", "بارك الله فيك": "May Allah bless you", "تم الحفظ": "Saved", "متوقف": "Off", "النيّة": "Intention",
  "قبل أن تبدأ الورد": "Before you begin your portion", "تمّ ورد اليوم — بارك الله فيك": "Today's portion is done — may Allah bless you",
  "تعرّف على العمرة: المباحات والمحظورات والمبطلات": "Learn about Umrah: permitted acts, prohibitions and invalidators",
  "تعرّف على الحج: المباحات والمحظورات والمبطلات": "Learn about Hajj: permitted acts, prohibitions and invalidators",
  "مناسك العمرة": "Umrah rites", "مناسك الحج": "Hajj rites", "الحج — الخطوة الحالية": "Hajj — current step",
  "حان وقت الصلاة": "Prayer time", "وقت الإفطار": "Time to break the fast"
});
RULES.push([/^مناسك (العمرة|الحج) — الخطوة (\d+) من (\d+)$/, (m) => `${EN[m[1]]} rites — step ${m[2]} of ${m[3]}`]);
RULES.push([/^حان وقت صلاة (.+)$/, (m) => `Time for ${EN[m[1]] || m[1]} prayer`]);
const PRAYER_EN = { "الفجر": "Fajr", "الشروق": "Sunrise", "الظهر": "Dhuhr", "العصر": "Asr", "المغرب": "Maghrib", "العشاء": "Isha" };
RULES.unshift([/^(.+?هـ) · (\S+) (\d\d:\d\d) · بعد (?:(\d+) س )?(\d+) د$/, (m) => `${trRules(m[1]) || m[1]} · ${PRAYER_EN[m[2]] || m[2]} ${m[3]} · in ${m[4] ? m[4] + "h " : ""}${m[5]}m`]);
RULES.unshift([/^(\S+) بعد (.+?) · الأذكار (\d+)\/(\d+)$/, (m) => `${PRAYER_EN[m[1]] || m[1]} in ${m[2].replace(" س", "h").replace(" د", "m")} · Adhkar ${m[3]}/${m[4]}`]);
function trRules(k) { k = AD(k); for (const [re, fn] of RULES) { const m = k.match(re); if (m) { const r = fn(m); if (r) return r; } } return null; }

const ARABIC_RE = /[\u0600-\u06FF]/;
function tr(s) { if (LANG.cur !== "en") return s; const k = String(s).trim(); return EN[k] || trRules(k) || s; }
function translateNode(root) {
  if (LANG.cur !== "en" || !root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: n => {
      if (!ARABIC_RE.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
      const p = n.parentElement; if (!p || p.closest(".dua,script,style,textarea")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(n => { const k = n.nodeValue.trim(); const t = EN[k] || trRules(k); if (t) n.nodeValue = n.nodeValue.replace(k, t); });
  root.querySelectorAll("[placeholder],[aria-label],[title]").forEach(e => ["placeholder", "aria-label", "title"].forEach(a => {
    const v = e.getAttribute(a); if (v && EN[v.trim()]) e.setAttribute(a, EN[v.trim()]);
  }));
}
function applyLang() {
  const en = LANG.cur === "en";
  document.documentElement.lang = en ? "en" : "ar";
  document.documentElement.dir = en ? "ltr" : "rtl";
  document.body.classList.toggle("en", en);
  const b = document.getElementById("langBtn"); if (b) b.textContent = en ? "عربي" : "English";
  if (en) { translateNode(document.body); annotateMeanings(document.body); }
}
function setLang(l) { LANG.cur = l; localStorage.setItem("qn_lang", l); location.reload(); }
document.addEventListener("DOMContentLoaded", () => {
  const b = document.getElementById("langBtn"); if (b) b.onclick = () => setLang(LANG.cur === "en" ? "ar" : "en");
  applyLang();
  new MutationObserver(ms => { if (LANG.cur !== "en") return; ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) { translateNode(n); annotateMeanings(n); } else if (n.nodeType === 3 && n.parentElement) translateNode(n.parentElement); })); })
    .observe(document.body, { childList: true, subtree: true });
});

/* ---- Meanings under Arabic religious texts (Quran auto-lookup + TR_EN map) ---- */
let QIDX = null;
const qnorm = s => String(s).replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "").replace(/[ٱآأإ]/g, "ا").replace(/[^\u0621-\u064A ]/g, " ").replace(/\s+/g, " ").trim();
const qskel = s => qnorm(s).replace(/[اويىءه]/g, "").replace(/\s+/g, " ").trim();
function buildQ() { QIDX = []; QURAN.surahs.forEach(s => s.a.forEach(a => QIDX.push({ k: s.n + ":" + a[1], n: qnorm(a[0]), sk: qskel(a[0]) }))); }
function quranMeaning(text) {
  if (typeof QURAN === "undefined" || typeof QURAN_EN === "undefined") return null;
  if (!QIDX) buildQ();
  const f = qnorm(text); if (f.split(" ").length < 3) return null;
  const fs = qskel(text);
  let hits = QIDX.filter(v => v.n.includes(f)); if (!hits.length) hits = QIDX.filter(v => v.sk.includes(fs));
  if (hits.length) return QURAN_EN[hits[0].k];
  const head = fs.split(" ").slice(0, 3).join(" "); if (head.length < 6) return null;
  for (let i = 0; i < QIDX.length; i++) {
    const p = QIDX[i].sk.indexOf(head); if (p < 0 || (p > 0 && QIDX[i].sk[p - 1] !== " ")) continue;
    let out = [], cur = fs, j = i, seg = QIDX[i].sk.slice(p);
    while (j < QIDX.length && cur && cur.startsWith(seg)) { out.push(QURAN_EN[QIDX[j].k]); cur = cur.slice(seg.length).trim(); j++; seg = j < QIDX.length ? QIDX[j].sk : ""; }
    if (out.length && (cur.length < 8 || (j < QIDX.length && QIDX[j - 1] && QIDX[j].sk.startsWith(cur)))) { if (cur.length >= 8) out.push(QURAN_EN[QIDX[j].k]); return out.join(" "); }
  }
  return null;
}
const TR_KEY = s => qnorm(s).replace(/ /g, "");
function textMeaning(t) {
  const known = s => (typeof TR_EN !== "undefined" && TR_EN[TR_KEY(s)]) || EN[s.trim()] || null;
  const m0 = known(t); if (m0) return m0;
  const q = t.match(/[﴿«"“]([^﴾»"”]{12,})[﴾»"”]/g);
  if (q) { const parts = q.map(x => known(x) || known(x.slice(1, -1)) || quranMeaning(x)).filter(Boolean); if (parts.length) return parts.join(" · "); }
  return quranMeaning(t);
}
function annotateMeanings(root) {
  if (LANG.cur !== "en" || !root || root.nodeType !== 1) return;
  const els = root.matches(".dua,.q,li,p,.note,.mid,.hd,b,.src,.card>div") ? [root] : [];
  els.push(...root.querySelectorAll(".dua,.q,li,p,.note,.mid,.hd,.src,.card>div"));
  els.forEach(el => {
    if (el.dataset.tr || el.closest("#v-quran .page,#qpage,.ayTr,textarea,button")) return;
    const t = el.textContent.trim();
    if (!/[\u0621-\u064A]{2}/.test(qnorm(t)) || t.length < 12) return;
    if ([...el.children].some(c => /[\u0621-\u064A]{2}.*[\u0621-\u064A]{2}/.test(c.textContent) && c.textContent.trim().length > 12 && !c.matches("span,b,i,em"))) return;
    el.dataset.tr = "1";
    const m = textMeaning(t); if (!m) return;
    const d = document.createElement("div"); d.className = "ayTr"; d.textContent = m; el.insertAdjacentElement("afterend", d);
  });
}
