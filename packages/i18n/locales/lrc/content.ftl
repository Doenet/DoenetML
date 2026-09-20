# Northern Luri (لری شمالی) content catalog: the prose the core computes into
# the document — style descriptions, boolean words, section words, the
# chemistry names. Selected by `documentLocale`, the language the activity was
# written in, rather than by the reader's UI language.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Perso-Arabic script, right to left. The Luri Wikipedia
# spells the language «لۊری شومالی», using «ؤ» for /o/ and «ۊ» for /u/. **This
# catalog does not use those two letters**: the convention needs a speaker's
# ear on every vowel, and applying it to only some words would leave a reader
# unable to tell a long vowel from an unedited line. Everything here is written
# with plain Persian letters — و, ا, ی — so red is «سور» and not «سۊر». A
# corrector who wants the Wikipedia orthography must convert **all four files
# at once**; the one thing that must not happen is the two systems mixed inside
# one catalog.
#
# One caveat about that rule: «ؤ» also occurs inside ordinary Persian
# loanwords spelled the Persian way — «مؤلفه» throughout these files — where
# it is a hamza on a wāw and not the Luri /o/ vowel. Those are not
# violations of the decision above, and should be left alone.
#
# **What is Luri here and what is not.** Apart from the copula «هه»/«نیه», the
# «-یل» plural, the numeral classifier «تا», and a short list of everyday words
# («سیا», «اسپی», «سور», «سوز», «هار», «سی»), the vocabulary in this file is
# **Persian**. Lorestan does its schooling in Persian, and Luri has no register
# of its own for «چندضلعی», «کنتراست» or «بردار». Luri's word order also agrees
# with Persian's — see the ezafe note below — so the *shape* of these messages
# is close to `locales/fa`'s on purpose. The difference between this catalog
# and the Persian one is morphological, not syntactic. A reviewer should expect
# to be **rewriting sentences**, not correcting typos.
#
# **Word order, and how a modifier attaches.** Luri is head-initial: the noun
# comes first and its modifiers follow, linked by the ezafe. That is the
# mirror of English, so:
#
#   * `style-with-noun` is `{ $noun } { $description }` — the noun leads and
#     the adjectives trail it;
#   * `style-stroke` reverses English's adjective order for the same reason, so
#     that the adjective English puts nearest the noun is the one Luri puts
#     nearest it: "thick dashed red line" comes out «خط سور خط‌چین ضخیم».
#
# **The ezafe is never welded onto a placeable.** After a consonant the ezafe
# is an unwritten vowel, so the space between `{ $noun }` and `{ $description }`
# carries the link and nothing is attached to the placeable itself. After a
# vowel the ezafe *is* written — «حاشیهٔ», «پس‌زمینهٔ» — and in every one of
# those places this catalog **spells the noun out in the message** and puts the
# placeable after a plain space («با حاشیهٔ { $border }»), rather than trying to
# hang a «ٔ» on the end of `{ $border }`. A placeable is not a word, and nothing
# can be attached to one. The consequence is a guarantee a reviewer can check:
# **every placeable in this file can be lifted out of its message cleanly** —
# no message glues a letter, an ezafe or a suffix onto one.
#
# **Gender and number.** Luri has no grammatical gender, so `noun-gender` is
# `neuter` for everything. It is defined here on purpose rather than left to
# fall back to English, so that the catalog says so deliberately and no
# adjective has to carry a branch nothing will ever read. Number is marked with
# **«-یل»** — «نقطه‌یل», «خطیل», «مؤلفه‌یل» — and never with Persian «-ها» or
# «-ان»; but after a numeral the noun stays **singular** and takes the
# classifier «تا» («5 تا ضلع»), so nothing in this file agrees with a count.
#
# **Chemistry: the element tables are included, and they are the Persian ones.**
# `element-name` and `element-anion-name` below are, character for character,
# the table in `locales/fa/content.ftl`. Chemistry in Lorestan is taught,
# examined and printed in Persian; the settled, checkable list of 118 element
# names a Luri speaker actually uses **is** the Persian list. That makes it a
# loan the language really uses rather than an invented nomenclature, which is
# the only kind of table this seed is allowed to ship. Including it serves a
# reader better than falling back to English, which is neither their school
# language nor their own. A corrector must **not** re-spell these names with
# Luri vowels or attach «-یل» to them: they are the names on the periodic table
# in the classroom, and changing them would make an author's `<award>` and a
# student's answer disagree.
#
# **Loans kept as they are.** Persian supplies every technical noun here —
# «مؤلفه», «بردار», «سهمی», «چندضلعی», «منحنی», «تابع», «ماتریس», «قضیه»,
# «اثبات», the section words, and the whole chemistry table. `true` and `false`
# stay English wherever they are DoenetML syntax; only the displayed word moves.
#
# **Coverage.** This file is thinner than `locales/fa/content.ftl` in no place;
# it is in fact slightly wider, since it supplies `noun.slope-field`,
# `noun.vector-field`, `math-embedded-input-blank` and
# `math-embedded-input-blank-ordinal`, which the Persian catalog has not caught
# up with yet. Nothing from `locales/en/content.ftl` is omitted.


## Style vocabulary

# «سیا», «اسپی», «سور», «سوز» are the Luri words. The rest are the Persian
# colour names, which is what Luri actually says for them.
color =
    .black = سیا
    .white = اسپی
    .gray = خاکستری
    .red = سور
    .orange = نارنجی
    .yellow = زرد
    .green = سوز
    .cyan = فیروزه‌ای
    .blue = آبی
    .purple = بنفش
    .pink = صورتی
    .brown = قهوه‌ای
line-width =
    .thick = ضخیم
    .thin = نازک
line-style =
    .dashed = خط‌چین
    .dotted = نقطه‌چین
fill-style =
    .horizontal = خطیل افقی
    .vertical = خطیل عمودی
    .diagonal = خطیل مورب
    .backdiagonal = خطیل مورب معکوس
    .dots = نقطه‌یل
    .diamonds = لوزی‌یل
noun =
    .line = خط
    .line-segment = پاره‌خط
    .ray = نیم‌خط
    .vector = بردار
    .curve = منحنی
    .function = تابع
    .slope-field = میدان شیب
    .vector-field = میدان برداری
    .parabola = سهمی
    .polyline = خط شکسته
    .polygon = چندضلعی
    .triangle = مثلث
    .rectangle = مستطیل
    .circle = دایره
    .region = ناحیه
    .point = نقطه
    .square = مربع
    .diamond = لوزی
    .cross = ضربدر
    .plus = به‌علاوه
# The side count follows the adjectives rather than preceding the noun, so the
# adjectives stay against the word they describe: «چندضلعی منتظم سور ضخیم با 5
# تا ضلع». The numeral takes «تا» and «ضلع» stays singular, so there is nothing
# here for the count to agree with.
noun-regular-polygon =
    { $part ->
        [tail] با { $numSides } تا ضلع
       *[head] چندضلعی منتظم
    }
# Luri has no grammatical gender. Defined on purpose — see the header.
noun-gender = neuter


## Style composition

# The mirror of the English order, so the adjective English puts nearest the
# noun is the one Luri puts nearest it.
style-stroke =
    { $parts ->
        [width-style-color] { $color } { $lineStyle } { $width }
        [width-color] { $color } { $width }
        [style-color] { $color } { $lineStyle }
        [width-style] { $lineStyle } { $width }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
# «توپر» — solid — against «توخالی» below.
style-filled-word = توپر
style-filled =
    { $parts ->
        [pattern] { $color } { $filled } با نقش { $pattern }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } با نقش { $pattern }
        [plain-tail] { $noun } { $color } { $filled } { $nounTail }
        [pattern-tail] { $noun } { $color } { $filled } { $nounTail } با نقش { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }
# Luri has no indefinite article, so the two `-article` branches say what their
# plain counterparts do. They are kept apart because the distinction belongs to
# the English message rather than to this one. «حاشیهٔ» ends in a vowel and so
# carries a written ezafe — which is why the word is spelled out here and
# `{ $border }` follows it after a plain space.
style-border-clause =
    { $parts ->
        [with-article] با حاشیهٔ { $border }
        [and] و حاشیهٔ { $border }
        [and-article] و حاشیهٔ { $border }
       *[with] با حاشیهٔ { $border }
    }
# «به رنگ» — "in the colour of" — rather than an adjective set against the
# pattern: the ezafe linking a plural noun to its adjective is written, and a
# written ezafe cannot be put on a placeable.
style-fill =
    { $parts ->
        [pattern] { $pattern } به رنگ { $color }
       *[plain] { $color }
    }
style-unfilled = توخالی
style-text =
    { $parts ->
        [background] { $color } با پس‌زمینهٔ { $background }
       *[plain] { $color }
    }
style-background-none = هیچ


## Boolean words

boolean-true = درست
boolean-false = نادرست


## Answer buttons

answer-submit-label = بررسی پاسخ
answer-submit-label-no-correctness = ارسال پاسخ


## Sectional blocks

section-name =
    .activity = فعالیت
    .aside = حاشیه
    .cascade = زنجیره
    .definition = تعریف
    .example = مثال
    .exercise = تمرین
    .exercises = تمرینیل
    .given-answer = پاسخ
    .note = یادداشت
    .objectives = هدفیل
    .paragraphs = بندیل
    .part = قسمت
    .problem = مسئله
    .problems = مسئله‌یل
    .proof = اثبات
    .question = پرسش
    .section = بخش
    .solution = راه‌حل
    .task = تکلیف
    .theorem = قضیه
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = راهنمایی


## Tables and figures

table-name =
    { $parts ->
        [numbered] جدول { $enumeration }
        [numbered-title] جدول { $enumeration }{ ": " }
        [unnumbered-title] جدول{ ": " }
       *[unnumbered] جدول
    }
figure-name =
    { $parts ->
        [numbered] شکل { $enumeration }
        [numbered-caption] شکل { $enumeration }{ ": " }
        [unnumbered-caption] شکل{ ": " }
       *[unnumbered] شکل
    }


## Paginator controls

paginator-previous = پیشین
paginator-next = پسین
paginator-page = صفحه
paginator-page-status = { $pageLabel } { $currentPage } از { $numPages }


## Piecewise functions

piecewise-condition-or = یا
piecewise-condition-if = اگه
piecewise-condition-otherwise = وگرنه


## Chemistry
##
## Character for character the Persian table — see the header for why.

element-name =
    .h = هیدروژن
    .he = هلیم
    .li = لیتیم
    .be = بریلیم
    .b = بور
    .c = کربن
    .n = نیتروژن
    .o = اکسیژن
    .f = فلوئور
    .ne = نئون
    .na = سدیم
    .mg = منیزیم
    .al = آلومینیم
    .si = سیلیسیم
    .p = فسفر
    .s = گوگرد
    .cl = کلر
    .ar = آرگون
    .k = پتاسیم
    .ca = کلسیم
    .sc = اسکاندیم
    .ti = تیتانیم
    .v = وانادیم
    .cr = کروم
    .mn = منگنز
    .fe = آهن
    .co = کبالت
    .ni = نیکل
    .cu = مس
    .zn = روی
    .ga = گالیم
    .ge = ژرمانیم
    .as = آرسنیک
    .se = سلنیم
    .br = برم
    .kr = کریپتون
    .rb = روبیدیم
    .sr = استرانسیم
    .y = ایتریم
    .zr = زیرکونیم
    .nb = نیوبیم
    .mo = مولیبدن
    .tc = تکنسیم
    .ru = روتنیم
    .rh = رودیم
    .pd = پالادیم
    .ag = نقره
    .cd = کادمیم
    .in = ایندیم
    .sn = قلع
    .sb = آنتیموان
    .te = تلوریم
    .i = ید
    .xe = زنون
    .cs = سزیم
    .ba = باریم
    .la = لانتان
    .ce = سریم
    .pr = پرازئودیم
    .nd = نئودیم
    .pm = پرومتیم
    .sm = ساماریم
    .eu = اروپیم
    .gd = گادولینیم
    .tb = تربیم
    .dy = دیسپروزیم
    .ho = هولمیم
    .er = اربیم
    .tm = تولیم
    .yb = ایتربیم
    .lu = لوتسیم
    .hf = هافنیم
    .ta = تانتال
    .w = تنگستن
    .re = رنیم
    .os = اسمیم
    .ir = ایریدیم
    .pt = پلاتین
    .au = طلا
    .hg = جیوه
    .tl = تالیم
    .pb = سرب
    .bi = بیسموت
    .po = پولونیم
    .at = آستاتین
    .rn = رادون
    .fr = فرانسیم
    .ra = رادیم
    .ac = اکتینیم
    .th = توریم
    .pa = پروتاکتینیم
    .u = اورانیم
    .np = نپتونیم
    .pu = پلوتونیم
    .am = آمریسیم
    .cm = کوریم
    .bk = برکلیم
    .cf = کالیفرنیم
    .es = اینشتینیم
    .fm = فرمیم
    .md = مندلیفیم
    .no = نوبلیم
    .lr = لارنسیم
    .rf = رادرفوردیم
    .db = دوبنیم
    .sg = سیبورگیم
    .bh = بوریم
    .hs = هاسیم
    .mt = مایتنریم
    .ds = دارمشتادیم
    .rg = رونتگنیم
    .cn = کوپرنیسیم
    .nh = نیهونیم
    .fl = فلروویم
    .mc = مسکوویم
    .lv = لیورموریم
    .ts = تنسین
    .og = اوگانسون
element-anion-name =
    .h = هیدرید
    .c = کربید
    .n = نیترید
    .o = اکسید
    .f = فلوئورید
    .p = فسفید
    .s = سولفید
    .cl = کلرید
    .br = برمید
    .i = یدید
    .at = آستاتید
    .ts = تنسید
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = نماد شیمیایی نامعتبر
chemistry-invalid-ionic-compound = ترکیب یونی نامعتبر


## Inputs embedded in math

math-embedded-input-blank = جای خالی
math-embedded-input-blank-ordinal = جای خالی { $ordinal } از { $total }
