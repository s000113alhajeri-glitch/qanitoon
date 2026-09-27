#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
يبني app/duadb.js: قاعدة أدعية وأذكار مأخوذة نصاً من متون الكتب الستة وموطأ مالك
(بيانات sunnah.com عبر fawazahmed0/hadith-api) بلا تأليف، مع الدرجة والمُخرِّج،
مع إزالة التكرار بتطبيع النص وجمع الروايات، وتصنيف الوقت/الحالة/القائل بقواعد لغوية.
"""
import json, re, sys, os, unicodedata, collections

RAW = os.path.expanduser("~/duadb/raw")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app", "duadb.js")

BOOKS = [
    ("bukhari", "البخاري", 1), ("muslim", "مسلم", 2), ("abudawud", "أبو داود", 3),
    ("tirmidhi", "الترمذي", 4), ("nasai", "النسائي", 5), ("ibnmajah", "ابن ماجه", 6),
    ("malik", "مالك في الموطأ", 7),
]
GRADER_AR = {
    "Al-Albani": "الألباني", "Shuaib Al Arnaut": "شعيب الأرنؤوط", "Zubair Ali Zai": "زبير علي زئي",
    "Muhammad Muhyi Al-Din Abdul Hamid": "محيي الدين عبد الحميد", "Ahmad Muhammad Shakir": "أحمد شاكر",
    "Bashar Awad Maarouf": "بشار عواد معروف", "Abu Ghuddah": "أبو غدة",
    "Muhammad Fouad Abd al-Baqi": "محمد فؤاد عبد الباقي", "Salim al-Hilali": "سليم الهلالي",
}
GRADER_PREF = ["Al-Albani", "Shuaib Al Arnaut", "Ahmad Muhammad Shakir", "Zubair Ali Zai", "Bashar Awad Maarouf",
               "Abu Ghuddah", "Muhammad Fouad Abd al-Baqi", "Muhammad Muhyi Al-Din Abdul Hamid", "Salim al-Hilali"]

QUOTE = "\u200f\"\u200f"
RLM = "\u200f"

def grade_ar(g):
    g0 = g.lower()
    if "mawdu" in g0 or "munkar" in g0 or "shadh" in g0 or "daif" in g0 or "very" in g0:
        return None
    mauquf = "muquf" in g0 or "mauquf" in g0
    maqtu = "maqtu" in g0
    if "hasan sahih" in g0: base = "حسن صحيح"
    elif "lighairihi" in g0 and "sahih" in g0: base = "صحيح لغيره"
    elif "lighairihi" in g0 and "hasan" in g0: base = "حسن لغيره"
    elif "sahih" in g0: base = "صحيح"
    elif "hasan" in g0: base = "حسن"
    else: return None
    if "isnaad" in g0 or "isnad" in g0 or "sanad" in g0: base += " الإسناد"
    return base, mauquf, maqtu

def best_grade(x, book):
    if book in ("bukhari", "muslim"):
        return "صحيح", "", False, False
    gs = {g["name"]: g["grade"] for g in x.get("grades", [])}
    for name in GRADER_PREF:
        if name in gs:
            r = grade_ar(gs[name])
            if r is None:
                return None
            return r[0], GRADER_AR[name], r[1], r[2]
    return None

# ---------- تطبيع ----------
TASHKEEL = re.compile(r"[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640\u200f\u200e]")
def norm(s):
    s = TASHKEEL.sub("", s)
    s = re.sub(r"[إأآا]", "ا", s)
    s = s.replace("ى", "ي").replace("ة", "ه").replace("ؤ", "و").replace("ئ", "ي")
    s = re.sub(r"[^\u0621-\u064A ]", " ", s)
    return re.sub(r"\s+", " ", s).strip()

# ---------- علامات الدعاء ----------
DUA_START = re.compile(
    r"^(?:قل\s+|قولوا\s+|قولي\s+|فقل\s+|فليقل\s+|ليقل\s+|يقول\s+|فيقول\s+|قال\s+)?"
    r"(?:اللهم|رب|ربنا|ربي|أعوذ|أستغفر|سبحان|الحمد لله|لا إله إلا|بسم الله|باسمك|"
    r"حسبي|توكلت|أسألك|غفرانك|رضيت|الله أكبر|أمسينا|أصبحنا|أعوذ|أعذت|وجهت|أمنت|"
    r"سبحانك|لبيك|إنا لله|آمنت|يا حي|يا حى|سبوح|يا رب|أعيذك|أعيذكما|لا حول|بارك|بسمك|ربنا|وجهت|"
    r"أسأل الله|إن لله|صيبا|ذهب الظمأ|السلام عليكم أهل|السلام على أهل|يا مقلب|أستودع|تبارك الله|"
    r"اللهم|لك الحمد|الله الله ربي|حسبنا الله|إني أسألك)\b")
DUA_MARK = re.compile(DUA_START.pattern.lstrip("^").replace("(?:قل\\s+|", "(?:", 1))
INTRO = re.compile(r"(?:^|\s)(?:ثم\s+)?(?:يقول|يقل|قل|قال|قولوا|قولي|تقول|فقال|فليقل|فتقول|ليقل|فقل|فيقول|قالت|فقالت|قائلا|ويقول|وقال|وقولوا|وليقل|قلت|أقول)\s+(?:\S+\s+){0,3}?(?=(?:اللهم|رب |ربنا|ربي|أعوذ|أستغفر|سبحان|الحمد لله|لا إله إلا|بسم الله|باسمك|حسبي|توكلت|غفرانك|رضيت|الله أكبر|أمسينا|أصبحنا|أعذت|وجهت|سبحانك|لبيك|إنا لله|آمنت|يا حي|يا حى|يا رب|أعيذك|لا حول|بارك الله|أسأل الله|إن لله|صيبا|ذهب الظمأ|السلام عليكم أهل|يا مقلب|أستودع|لك الحمد|حسبنا الله))")
DUA_ANY = re.compile(r"اللهم|أعوذ ب|أستغفر الله|رب اغفر|ربنا|أسألك|لا إله إلا الله|سبحان الله|بسم الله")
BAD = re.compile(r"من قال|أفضل الذكر|إذا قال العبد|فإن|كفارة")
NOT_DUA = re.compile(r"الرحيم من محمد|إلى هرقل|إلى كسرى|وأن محمدا رسول الله|وأني رسول الله|وإقام الصلاة|وأن محمدا عبده ورسوله، ثم|^شهادة أن لا|، شهادة أن لا|^أفلح|قال ثم يوحي|ترفع بها صوتك|^الله أكبر الله أكبر الله أكبر الله أكبر|^اللهم قد بلغت|^اللهم هل بلغت|^اللهم اشهد")

def strip_map(text):
    """نص بلا تشكيل + خريطة مواضع إلى النص الأصلي."""
    plain, idx = [], []
    for i, ch in enumerate(text):
        if TASHKEEL.match(ch): continue
        plain.append(ch); idx.append(i)
    return "".join(plain), idx

def slice_orig(text, idx, a, b):
    if a >= b: return ""
    end = idx[b - 1] + 1
    while end < len(text) and TASHKEEL.match(text[end]): end += 1
    return text[idx[a]: end]

LEAD = re.compile(r"^(?:قل|قولوا|قولي|فقل|فليقل|ليقل|يقول|فيقول|قال)\s+")

def junk_tasbih(core):
    """«سبحان الله» تعجباً لا ذكراً."""
    return core.startswith("سبحان الله") and not re.search(r"^سبحان الله[،,]? (?:وبحمده|العظيم|بكرة|والحمد لله|عدد|ملء|رب|ذي|تطهري|كثيرا|حين|عشرا|ثلاثا|مائة|والله أكبر|ولا إله)", core[:40])

def dua_spans(text):
    """يستخرج المقاطع المنطوقة (بين علامتي التنصيص) التي تبدأ بعلامة دعاء، ويعيدها بنص الأصل المشكول."""
    plain, idx = strip_map(text)
    spans = []
    qpos = [m.start() for m in re.finditer('"', plain)]
    if len(qpos) >= 2:
        for i in range(0, len(qpos) - 1, 2):
            a, b = qpos[i] + 1, qpos[i + 1]
            sp = plain[a:b]
            st = sp.strip(" .،,")
            if len(st) < 5: continue
            lead = a + (len(sp) - len(sp.lstrip(" .،,")))
            m = LEAD.match(st)
            if m: lead += m.end()
            core = st[m.end():] if m else st
            if not DUA_START.match(core):
                im = INTRO.search(core)
                if im:
                    lead += im.end(); core = core[im.end():]
            if len(core) < 12 and not (len(core) >= 5 and DUA_START.match(core)): continue
            if NOT_DUA.search(core[:120]): continue
            if junk_tasbih(core): continue
            mk = re.match(r"^(.{0,80}?)\bاللهم\b", core)
            if DUA_START.match(core) or (mk and not BAD.search(core[:40])):
                if not DUA_START.match(core) and mk: lead += len(mk.group(1))
                end = a + len(sp.rstrip(" .،,"))
                cut = re.search(r"\s(?:فقال|قال|قالت|فقالت|ثم قال)\s(?:النبي|رسول الله|له|لها|لي|أبو|ابن|عمر|عائشة)"
                                r"|\s-\s(?:ثلاث|ثلاثا|مرتين|سبع)[^-]{0,12}-\s"
                                r"|\s(?:ثلاث مرات|ثلاثا|مرتين|سبع مرات)\s+(?:إنه|ألا|إن|أيها|يا|فإذا|ثم|فإن|ألم|أما|إنما|إني|إنك)\b"
                                r"|\s(?:ألا وإني|إنه لم يبق|فإذا ركعتم|فإذا سجدتم|أيها الناس|يا أيها الناس|فإن العبد|فإنه من|ثم التفت|ثم أقبل|ثم انصرف|فمن قال|من قال ذلك|فمن قالها)\b", core[max(0, lead - a):])
                if cut and cut.start() > 10: end = lead + cut.start()
                spans.append((lead, end))
    if not spans:
        m = re.search(r"(اللهم|أعوذ بالله|أستغفر الله|لا إله إلا الله|رب اغفر|ربنا آتنا|سبحان الله|الحمد لله الذي)", plain)
        if m:
            e = re.search(r"\.\s|\.$", plain[m.start():])
            end = m.start() + (e.start() if e else len(plain) - m.start())
            core = plain[m.start():end].strip(" .")
            before = plain[max(0, m.start() - 30):m.start()]
            if len(core) >= 20 and not junk_tasbih(core) and not BAD.search(core[:40]) and not NOT_DUA.search(core[:120]) and not re.search(r"شهادة|يشهد|أشهد|شهد", before):
                spans.append((m.start(), end))
    out = []
    for a, b in spans:
        sp = slice_orig(text, idx, a, b)
        sp = re.sub(r"\s+", " ", sp).strip(" .\u200f،,\"")
        pre = plain[max(0, a - 260):a]
        sent = re.split(r"\.\s", pre)[-1]
        if len(sent) < 40: sent = pre[-160:]
        by_prophet = bool(re.search(r"صلى الله عليه وسلم|النبي|رسول الله", sent))
        if sp: out.append((sp, by_prophet, plain[max(0, a - 260):a] + " " + plain[b:b + 80]))
    return out

def matn(text):
    """يحذف الإسناد تقريباً: يبدأ من الراوي الأعلى (آخر فاصلتين قبل أول ذكر للنبي ﷺ)."""
    plain, idx = strip_map(text)
    cands = [i for i in (plain.find("صلى الله عليه وسلم"), plain.find("النبي"), plain.find("رسول الله")) if i >= 0]
    cut = min(cands) if cands else 0
    pre = plain[:cut]
    commas = [m.start() for m in re.finditer("،", pre)]
    start = commas[-2] + 1 if len(commas) >= 2 else (commas[-1] + 1 if commas else 0)
    t = text[idx[start]:] if start < len(idx) else text
    parts = t.split('"')
    if len(parts) > 1:
        t = parts[0]
        for i, p in enumerate(parts[1:]):
            t += ("«" if i % 2 == 0 else "»") + p
    t = t.replace(RLM, "")
    t = re.sub(r"\s+\.", ".", t)
    return re.sub(r"\s+", " ", t).strip(" ،.")

# ---------- التصنيف ----------
TAGS = [
    ("sabah", "الصباح", r"إذا أصبح|أصبحنا|حين يصبح|إذا أصبحت|بالغداة|صلاة الصبح|صلاة الفجر|حين تصبح|أصبحنا وأصبح الملك"),
    ("masa", "المساء", r"إذا أمسى|أمسينا|حين يمسي|إذا أمسيت|بالعشي|حين تمسي|أمسينا وأمسى الملك"),
    ("nawm", "عند النوم", r"إذا أخذ مضجعه|إذا أوى إلى فراشه|أتيت مضجعك|إذا اضطجع|عند منامه|إذا نام|أراد أن ينام|أتى فراشه|باسمك ربي وضعت جنبي|بك وضعت جنبي|باسمك أموت وأحيا"),
    ("wake", "عند الاستيقاظ", r"إذا استيقظ|تعار من الليل|إذا قام من الليل|إذا انتبه|أحيانا بعد ما أماتنا|بعثنا بعد ما أماتنا"),
    ("salah_after", "بعد الصلاة", r"إذا سلم|دبر كل صلاة|دبر كل صلاة|إذا انصرف من صلاته|إذا فرغ من صلاته|إذا قضى صلاته|في دبر|إثر كل صلاة|بعد التسليم"),
    ("istiftah", "استفتاح الصلاة", r"إذا استفتح|إذا افتتح الصلاة|إذا قام إلى الصلاة|إذا كبر في الصلاة|بين التكبير والقراءة|إذا قام يصلي"),
    ("ruku", "الركوع والسجود", r"في ركوعه|في سجوده|إذا ركع|إذا سجد|إذا رفع رأسه من الركوع|بين السجدتين|سجد وجهي"),
    ("tashahhud", "التشهد وقبل السلام", r"في التشهد|بعد التشهد|قبل أن يسلم|إذا فرغ من التشهد|آخر صلاته|في صلاته ثم ليتخير|من عذاب القبر"),
    ("witr", "القنوت والوتر", r"في الوتر|قنوت|في قنوته|إذا فرغ من الوتر|سبحان الملك القدوس|أعوذ برضاك من سخطك|آخر وتره"),
    ("qiyam", "قيام الليل", r"إذا قام من الليل يتهجد|قام من الليل|صلاة الليل|من جوف الليل|ينزل ربنا|ثلث الليل"),
    ("wudu", "الوضوء", r"إذا توضأ|بعد الوضوء|فرغ من وضوئه|يسبغ الوضوء"),
    ("khala", "دخول الخلاء والخروج منه", r"الخلاء|الغائط|الكنيف|إذا دخل المرفق|الخبث والخبائث|غفرانك"),
    ("masjid", "المسجد", r"إذا دخل المسجد|إذا خرج من المسجد|أبواب رحمتك|أعوذ بالله العظيم وبوجهه الكريم|بعد الأذان|إذا سمع النداء|حين يسمع النداء|إذا سمعتم المؤذن|رب هذه الدعوة التامة"),
    ("home", "دخول المنزل والخروج منه", r"إذا خرج من بيته|إذا خرج الرجل من بيته|إذا دخل بيته|إذا دخل الرجل بيته|بسم الله توكلت على الله|خير المولج"),
    ("food", "الطعام والشراب", r"إذا أكل|إذا طعم|إذا فرغ من طعامه|إذا رفعت مائدته|أطعمنا وسقانا|إذا شرب|أكل طعاما|إذا أفطر|أفطر عند|ذهب الظمأ|إذا أتى بباكورة|الثمر"),
    ("libas", "اللباس", r"إذا لبس|ثوبا جديدا|إذا استجد ثوبا|تبلي ويخلف"),
    ("safar", "السفر", r"إذا سافر|إذا أراد سفرا|في سفر|أراد أن يسافر|إذا ركب|استوى على بعيره|هذا السفر|وعثاء السفر|إذا قفل|آيبون تائبون|إذا رجع من سفره|إذا نزل منزلا|رب السموات السبع وما أظللن|أستودع الله|أشرف على|على قرية|إذا علوا الثنايا|إذا ودع"),
    ("weather", "المطر والريح والرعد", r"إذا رأى المطر|صيبا نافعا|إذا هاجت الريح|إذا عصفت الريح|الريح|سمع الرعد|إذا سمع صوت الرعد|مطرنا بفضل الله|حوالينا ولا علينا|استسقى|الاستسقاء|أغثنا|اسقنا|غيثا مغيثا"),
    ("moon", "رؤية الهلال والكسوف", r"إذا رأى الهلال|الهلال|كسفت الشمس|انكسفت|الكسوف|إذا رأيتم ذلك فادعوا"),
    ("karb", "الكرب والهم والحزن", r"الكرب|إذا كربه أمر|إذا حزبه أمر|إذا أحزنه أمر|أصابه هم|هم ولا حزن|الهم والحزن|المكروب|ذا النون|أعوذ بك من الهم|أشكو|رحمتك أرجو|إذا اشتد|شديد"),
    ("dayn", "الدين والفقر", r"الدين|ديني|دينا|من المغرم|المغرم والمأثم|أعوذ بك من الفقر|الفقر|غلبة الدين|من الفاقة|أغنني بحلالك|أغنني بفضلك"),
    ("marad", "المرض والعيادة", r"إذا عاد مريضا|عاد مريضا|مريضا|إذا اشتكى|اشتكى|إذا مرض|المريض|أذهب الباس|اشفه|رب الناس|أشف|أرقيك|الرقية|رقاه|إذا اشتكى شيئا|وجعا|ألما|الحمى|المبتلى|من رأى مبتلى"),
    ("mawt", "الموت والجنازة والتعزية", r"الجنازة|جنازة|على الميت|إذا صلى على الميت|إذا مات|إذا أدخل القبر|المقابر|أهل الديار|إذا حضر الميت|إذا خرجت الروح|أغمض|عزى|يعزي|المصيبة|إنا لله وإنا إليه راجعون|أجرني في مصيبتي|إذا أصيب|إذا أغمض|الموتى|اغفر له وارحمه|أبدله دارا|إن لله ما أخذ|فلتصبر ولتحتسب"),
    ("nikah", "الزواج والمولود", r"إذا تزوج|إذا زوج|العروس|إذا رفأ|بارك الله لك وبارك عليك|إذا أتى أهله|إذا أراد أن يأتي أهله|جنبنا الشيطان|إذا ولد|المولود|الغلام|حنكه|أعيذكما|أعيذك بكلمات الله التامة"),
    ("istikhara", "الاستخارة", r"الاستخارة|إذا هم أحدكم بالأمر|أستخيرك بعلمك"),
    ("ghadab", "الغضب", r"إذا غضب|الغضب|غضب|أعوذ بالله من الشيطان الرجيم"),
    ("khawf", "الخوف والعدو والظلم", r"إذا خاف قوما|خاف|نجعلك في نحورهم|أعوذ بك من شرورهم|العدو|إذا لقي العدو|إذا غزا|الأحزاب|منزل الكتاب|السلطان|إذا خاف السلطان|المظلوم|ظلم|ظلم|أن أظلم أو أظلم|أن أضل أو أضل|غلبة الرجال|قهر الرجال|اشدد وطأتك"),
    ("hajj", "الحج والعمرة", r"لبيك اللهم لبيك|التلبية|لبيك|الطواف|بين الركنين|إذا استلم|على الصفا|على المروة|يوم عرفة|المشعر|الجمرة|إذا رأى البيت|زد هذا البيت|إذا رمى الجمرة|طاف بالبيت|يطوف"),
    ("ramadan", "رمضان والصيام", r"رمضان|الصائم|إذا أفطر|إذا أفطر عند|إني صائم|أفطر عندكم الصائمون|ليلة القدر|إنك عفو تحب العفو|إذا صمت|الصيام"),
    ("jumua", "الجمعة", r"يوم الجمعة|الجمعة|ليلة الجمعة|أكثروا على من الصلاة"),
    ("salawat", "الصلاة على النبي ﷺ", r"صل على محمد|كيف نصلي عليك|الصلاة على|صلى على|من صلى على|صلوا على"),
    ("istighfar", "الاستغفار والتوبة", r"أستغفر الله|سيد الاستغفار|اغفر لي|تب على|إني ظلمت نفسي|رب اغفر لي|ذنوبي|ظلما كثيرا|خطيئتي|التوبة|يتوب|تاب"),
    ("rizq", "الرزق والبركة", r"ارزقني|رزقي|ارزقنا|رزقا|وبارك|بارك لنا|بارك لي|البركة|وسع|واسعا|أكثر ماله|كثر"),
    ("ilm", "العلم والحفظ", r"علما نافعا|زدني علما|علمني|فقهه|علم لا ينفع|العلم|علمه الكتاب|الحكمة|رزقا طيبا وعملا متقبلا"),
    ("thabat", "ثبات القلب والهداية", r"ثبت قلبي|مقلب القلوب|مصرف القلوب|اهدني|هداك|اهدنا|الهدى والتقى|ألف بين قلوبنا|اجعل في قلبي نورا|حبك|أسألك حبك|قلبا سليما|قلب لا يخشع|رشدي|أرشدني|سددني|اجعلني هاديا مهديا|أعني على ذكرك|حسن عبادتك"),
    ("afiya", "العافية والحفظ", r"العافية|عافني|العفو والعافية|احفظني|من بين يدى ومن خلفي|أن أغتال|من تحتي|سمعي|بصري|السوء والفحشاء|في بدني|من شر ما خلق|بكلمات الله التامات|من زوال نعمتك|فجاءة نقمتك|جميع سخطك|لا يضر مع اسمه شيء|أستر عوراتي|آمن روعاتي|كافيا|بسم الله الذي لا يضر"),
    ("isti3adha", "الاستعاذة من الشرور", r"أعوذ بك من|أعوذ بالله من|نعوذ بك|أعيذك|من شر|عذاب جهنم|عذاب القبر|فتنة المسيح الدجال|فتنة المحيا والممات|العجز والكسل|الجبن والبخل|الهرم|أرذل العمر|البرص والجنون|سيئ الأسقام|منكرات الأخلاق|الهدم|التردي|الغرق|الحرق|شر نفسي|جهد البلاء|درك الشقاء|سوء القضاء|شماتة الأعداء"),
    ("jannah", "سؤال الجنة والنجاة من النار", r"أسألك الجنة|الجنة وأعوذ بك من النار|أجرني من النار|قنا عذاب النار|رضوانك والجنة|أسألك الرضا بعد القضاء|لذة النظر إلى وجهك|الشوق إلى لقائك|برد العيش بعد الموت|حسن الخاتمة|موجبات رحمتك|الفوز بالجنة|فادخلي|ثم الجنة|رضاك"),
    ("majlis", "المجلس وكفارته", r"كفارة المجلس|إذا قام من مجلسه|سبحانك اللهم وبحمدك أشهد أن لا إله إلا أنت أستغفرك|في مجلس|مجلسا|اللغط"),
    ("atas", "العطاس والتثاؤب", r"إذا عطس|عطس|يرحمك الله|يهديكم الله|تثاوب"),
    ("hamd", "الحمد والشكر والثناء", r"الحمد لله الذي|أحمد|اللهم لك الحمد|لك الحمد كله|ربنا لك الحمد|أنت الحمد|أعني على شكرك|حمدا كثيرا|بنعمتك|تتم الصالحات|أثنى"),
    ("tasbih", "التسبيح والتهليل والذكر المطلق", r"سبحان الله وبحمده|سبحان الله العظيم|سبحان الله والحمد لله ولا إله إلا الله والله أكبر|لا حول ولا قوة إلا بالله|لا إله إلا الله وحده لا شريك له|الباقيات الصالحات|بكرة وأصيلا|ثلاثا وثلاثين|الكنز|سبحان الله عدد|أحب الكلام|أفضل الذكر|أحب إلى مما طلعت عليه الشمس"),
    ("ahl", "الأهل والولد والوالدين", r"ولوالدى|لوالديه|والدى|أهلي|أهله|ذريتي|أولادي|ولدي|زوجي|زوجتي|أزواجنا|أمي|أبي|بارك له في أهله|بارك فيما رزقته|أحيني ما كانت الحياة خيرا"),
    ("nas", "الدعاء للناس والضيف والمحسن", r"إذا صنع إليك|جزاك الله خيرا|من صنع إليه معروف|إذا أفطر عند قوم|أكل طعامكم الأبرار|بارك الله فيكم|أحسن إليك|فإذا أتاه صاحبه|إذا سأل رجلا|أحبك الذي أحببتني له|إني أحبك|أن يدعو له|بظهر الغيب|لأخيه"),
    ("umum", "أدعية جامعة", r"خير ما سألك|من شر ما استعاذ|الخير كله عاجله وآجله|في الدنيا حسنة|في أمورنا كلها|جوامع الدعاء|أصلح لي ديني|في الدنيا حسنة وفي الآخرة حسنة|أسألك من الخير كله|أحسن الدعاء|أى الدعاء أسمع|أفضل الدعاء"),
]
TAG_RE = [(k, n, re.compile(rx)) for k, n, rx in TAGS]

DUA_ONLY = {"ahl", "rizq", "hamd", "istighfar", "isti3adha", "ilm", "thabat", "afiya", "jannah", "tasbih", "dayn", "khawf", "umum", "nas", "salawat"}

def classify(context, dua):
    tags = []
    context, dua = TASHKEEL.sub("", context), TASHKEEL.sub("", dua)
    for k, n, rx in TAG_RE:
        if rx.search(dua) or (k not in DUA_ONLY and rx.search(context)):
            tags.append(k)
    return tags

def TASKHEEL_WORDS(s):
    return TASHKEEL.sub("", s).split()

def main():
    entries = []
    stats = collections.Counter()
    for book, name_ar, order in BOOKS:
        data = json.load(open(os.path.join(RAW, book + ".json")))
        for x in data["hadiths"]:
            text = x["text"]
            plain = TASHKEEL.sub("", text)
            if not DUA_ANY.search(plain) and not DUA_MARK.search(plain):
                continue
            spans = dua_spans(text)
            if not spans:
                stats["nospan"] += 1; continue
            g = best_grade(x, book)
            if g is None:
                stats["weak_or_ungraded"] += 1; continue
            grade, grader, mauquf, maqtu = g
            m = matn(text)
            num = str(x.get("arabicnumber") or x["hadithnumber"]).replace(".01", "أ").replace(".02", "ب").replace(".03", "ج").replace(".04", "د").replace(".05", "هـ").replace(".06", "و")
            num = re.sub(r"\.0$", "", num)
            # نوع القائل: أثر إن كان موقوفاً/مقطوعاً أو لم يُذكر النبي ﷺ في المتن
            if maqtu: speaker = "مقطوع (من كلام التابعي)"
            elif mauquf or ("صلى الله عليه وسلم" not in plain and "النبي" not in plain and "رسول الله" not in plain):
                speaker = "أثر (موقوف على صحابي)"
            else: speaker = "النبي ﷺ"
            for sp, by_prophet, ctx in spans:
                bare = TASKHEEL_WORDS(sp)
                if len(bare) < 3 and not re.match(r"^(?:غفرانك|صيبا|اللهم صيبا|لبيك|سبوح|آمين)", " ".join(bare)): continue
                who = speaker if speaker != "النبي ﷺ" or by_prophet else "ورد في الحديث (انظر السياق لمعرفة القائل)"
                entries.append({
                    "t": sp, "h": m, "b": name_ar, "n": num, "g": grade, "gr": grader, "who": who,
                    "tags": classify(ctx, sp), "book": book, "order": order, "hn": x["hadithnumber"], "nn": norm(sp),
                })
                stats[book] += 1
    print("extracted", len(entries), dict(stats), file=sys.stderr)
    json.dump(entries, open(os.path.expanduser("~/duadb/extracted.json"), "w"), ensure_ascii=False)
    groups = dedupe(entries)
    emit(groups)

GRADE_RANK = {"صحيح": 0, "حسن صحيح": 1, "صحيح الإسناد": 2, "صحيح لغيره": 3, "حسن": 4, "حسن الإسناد": 5, "حسن لغيره": 6}
def rank(e):
    return (GRADE_RANK.get(e["g"], 9), e["order"], -len(e["t"]))

def dedupe(entries):
    """يجمع الروايات المتقاربة لفظاً في مدخل واحد: مفتاح أول ٦ كلمات، ثم تشابه جاكار ≥ ٠٫٧٥ على الكلمات."""
    entries.sort(key=rank)
    groups = []
    by_key = collections.defaultdict(list)
    for e in entries:
        w = e["nn"].split()
        e["_w"] = set(w)
        key = " ".join(w[:8])
        placed = None
        for g in by_key.get(key, []):
            placed = g; break
        if placed is None:
            for g in groups:
                pw = g["main"]["_w"]
                inter = len(pw & e["_w"]); uni = len(pw | e["_w"]) or 1
                if inter / uni >= 0.7 or (min(len(pw), len(e["_w"])) >= 8 and inter / min(len(pw), len(e["_w"])) >= 0.92):
                    placed = g; break
        if placed is None:
            g = {"main": e, "refs": [], "_w": set(e["_w"]), "tags": set(e["tags"])}
            groups.append(g); by_key[key].append(g)
        else:
            placed["refs"].append(e); placed["tags"] |= set(e["tags"])
    print("groups", len(groups), file=sys.stderr)
    return groups

def emit(groups):
    out = []
    for i, g in enumerate(groups):
        m = g["main"]
        refs = []
        seen = set()
        for r in [m] + g["refs"]:
            k = (r["b"], r["n"])
            if k in seen: continue
            seen.add(k)
            refs.append({"b": r["b"], "n": r["n"], "g": r["g"], **({"gr": r["gr"]} if r["gr"] else {})})
        h = m["h"]
        if len(h) > 700:
            p = h.find("«")
            a = max(0, p - 250) if p > 250 else 0
            h = ("…" if a else "") + h[a:a + 700] + "…"
        rec = {"id": "hd_" + str(i), "t": m["t"], "h": h, "who": m["who"], "refs": refs, "tags": sorted(g["tags"], key=lambda k: [x[0] for x in TAGS].index(k))}
        variants = [r["t"] for r in g["refs"] if r["nn"] != m["nn"]]
        if variants:
            # نُبقي لفظاً مغايراً واحداً على الأكثر (الأطول) للدلالة على اختلاف الروايات
            v = max(variants, key=len)
            if len(set(v.split()) ^ set(m["t"].split())) > 3: rec["v"] = v
        out.append(rec)
    tags_meta = [{"k": k, "n": n} for k, n, _ in TAGS]
    js = "/* قاعدة الأدعية والأذكار من متون الكتب الستة وموطأ مالك (نص sunnah.com) — مولَّد آلياً من build_duadb.py، لا يُحرَّر يدوياً.\n"
    js += "   كل مدخل: t النص المنطوق كما في الكتاب، h المتن (بلا إسناد)، who القائل، refs الكتاب/الرقم/الدرجة/المُخرِّج، tags الوقت أو الحالة.\n"
    js += "   الدرجات: البخاري ومسلم بلا حكم (صحيح بالاتفاق)؛ السنن والموطأ بحكم الألباني ثم شعيب الأرنؤوط وغيرهما. لم يُدرج ضعيف ولا موضوع. */\n"
    js += "const DUADB_TAGS = " + json.dumps(tags_meta, ensure_ascii=False) + ";\n"
    js += "const DUADB = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n"
    open(OUT, "w").write(js)
    print("wrote", OUT, len(out), "entries", len(js) // 1024, "KB", file=sys.stderr)

if __name__ == "__main__":
    main()
