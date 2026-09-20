# Mazanderani (مازِرونی) content catalog: the prose the core computes into the
# document — style descriptions, boolean words, section names, chemistry.
# Selected by `documentLocale`, the language the activity was written in,
# rather than by the reader's own interface language.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Ordinary Persian letters and nothing else. No «ؤ» and no
# «ۊ» — those are the vowel letters Gilaki and Luri writers use, and mixing
# them into a Mazanderani catalog would make it look like neither language.
# Diacritics appear only where a word cannot be read without one («سِرخ»,
# «سِوز», «اِسپه», «مازِرونی»). A corrector who prefers a fully pointed text
# should convert all four files at once.
#
# **How much of this is actually Mazanderani.** Five things, and they are
# applied without exception:
#
#   * the copula — «هسه» for *is* and «نیه» for *is not*, never Persian «است»
#     or «نیست»; «بونه» for *becomes* and for the passive;
#   * the plural suffix «-ون» — «نقطه‌ون», «خطون», «رنگون» — never «-ها» or
#     «-ان»;
#   * the numeral classifier «تا» with a **singular** noun after it;
#   * head-final word order (below);
#   * a short list of everyday words, of which the colours are most of it.
#
# Everything else is Persian, deliberately and openly: «چندضلعی», «مستطیل»,
# «قضیه», «پس‌زمینه», «مؤلفه». Mazanderani has no register of its own for
# geometry or for software, and inventing one would be worse than borrowing
# the words its speakers actually use. A reviewer should expect to rewrite
# sentences, not to fix typos.
#
# **Word order, and how a modifier attaches.** This is where Mazanderani parts
# company with Persian, and it is the reason this file looks nothing like
# `fa/content.ftl`. A Mazanderani noun phrase is **head-final**: the adjective
# comes *before* the noun («گت دار» — a big tree), and the possessor comes
# before the possessed («ونه اسم» — his name). Persian does the opposite and
# links the two with the ezafe. So:
#
#   * `style-with-noun` reads `{ $description } { $noun }` — modifiers first,
#     the noun last. That is the English order, arrived at from the other
#     direction, and the exact reverse of what `fa` writes.
#   * `style-filled-with-noun` puts «توپر» and the colour ahead of `{ $noun }`
#     for the same reason.
#   * `style-border-clause` reads «با { $border } حاشیه» — the modifier
#     precedes «حاشیه», so **no ezafe is needed at all**, and the «ٔ» that `fa`
#     has to write on «حاشیهٔ» does not arise here.
#   * `style-fill`'s pattern branch is `{ $color } { $pattern }`, and its
#     `with` clause is «با { $pattern } نقش» — the placeable modifies the noun
#     that follows it.
#
# The consequence is a guarantee worth stating outright: **nothing in this file
# is welded onto a placeable.** No ezafe vowel, no «ٔ», no suffix is attached
# to `{ $noun }`, `{ $color }`, `{ $border }` or `{ $pattern }`. Every
# placeable is bounded by spaces or by punctuation, and a reviewer can lift any
# one of them out of its sentence, or move it, without having to unpick a
# letter from the end of it.
#
# **Gender and number.** Mazanderani has no grammatical gender. `noun-gender`
# is nevertheless defined as `neuter` on purpose, so that this catalog says so
# rather than falling silently back to English, and so that none of the
# adjectives above has to carry a `$gender` branch nothing would ever read.
# Number is marked with «-ون», but never after a numeral: «5 تا ضلع», not
# «5 تا ضلعون». `noun-regular-polygon` therefore folds the side count into its
# `[head]` branch and leaves `[tail]` empty, as English does — the count sits
# in front of the noun where a modifier belongs, so nothing has to follow the
# adjectives to keep them beside their head.
#
# **Chemistry — the element tables are included, and they are Persian.**
# `element-name` and `element-anion-name` below are, character for character,
# the table in `fa/content.ftl`. That is a decision, not an oversight.
# Chemistry in Māzandarān is taught, examined and printed in Persian: the
# settled, checkable list of all 118 element names that a Mazanderani speaker
# actually reads and writes **is** the Persian one. It is a loan the language
# genuinely uses, in the way this batch's rules mean by "keep the loan the
# language actually uses" — not an invented nomenclature. Including it serves a
# reader better than falling back to English would, because «آهن» and «گوگرد»
# are the words they know and "Iron" and "Sulfur" are not. A corrector must
# **not** "Mazanderanise" these names: there is no Mazanderani chemical
# nomenclature to correct them towards, and respelling them would produce a
# vocabulary nobody uses. `ion-name-oxidation-state` and the two invalid-symbol
# messages are frames rather than vocabulary, and are ordinary prose.
#
# **Loans kept as they stand:** the whole element table; «WCAG», «DoenetML» and
# the DoenetML identifiers elsewhere in this locale; and the Persian technical
# vocabulary named above, which is most of the nouns in this file.
#
# **Thinner than `fa` nowhere; thinner than `en` in two places.** Like `fa`,
# this file omits `noun.slope-field` and `noun.vector-field` — Mazanderani has
# no phrase for either that is not a transparent calque of the English, and a
# calque nobody uses is worth less than the English fallback.


## Style vocabulary

color =
    .black = سیو
    .white = اِسپه
    .gray = خاکستری
    .red = سِرخ
    .orange = نارنجی
    .yellow = زرد
    .green = سِوز
    .cyan = فیروزه‌ای
    .blue = آبی
    .purple = بنفش
    .pink = صورتی
    .brown = قهوه‌ای
line-width =
    .thick = کُلفت
    .thin = نازک
line-style =
    .dashed = خط‌چین
    .dotted = نقطه‌چین
fill-style =
    .horizontal = افقی خطون
    .vertical = عمودی خطون
    .diagonal = مورب خطون
    .backdiagonal = معکوس مورب خطون
    .dots = نقطه‌ون
    .diamonds = لوزی‌ون
noun =
    .line = خط
    .line-segment = پاره‌خط
    .ray = نیم‌خط
    .vector = بردار
    .curve = منحنی
    .function = تابع
    .parabola = سهمی
    .polyline = بشکسته خط
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
# The side count is a modifier, and a modifier precedes its noun, so it sits in
# the head and `[tail]` stays empty — the shape English has.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } ضلعی منتظم
    }
noun-gender = neuter


## Style composition

# Adjectives precede the noun and keep the order English gives them, since
# nothing here governs a different one.
style-stroke =
    { $parts ->
        [width-style-color] { $width } { $lineStyle } { $color }
        [width-color] { $width } { $color }
        [style-color] { $lineStyle } { $color }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
# «توپر» — solid — against «توخالی» below, the pair Mazanderani uses for a
# shape that is filled rather than hollow. Both are Persian words in ordinary
# Mazanderani use.
style-filled-word = توپر
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } با { $pattern } نقش
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } با { $pattern } نقش
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } با { $pattern } نقش
       *[plain] { $filled } { $color } { $noun }
    }
# Mazanderani has no indefinite article, so the two `-article` branches say
# what their plain counterparts do. They are kept apart because the distinction
# belongs to the English message rather than to this one.
style-border-clause =
    { $parts ->
        [with-article] با { $border } حاشیه
        [and] و { $border } حاشیه
        [and-article] و { $border } حاشیه
       *[with] با { $border } حاشیه
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = توخالی
style-text =
    { $parts ->
        [background] { $color } با { $background } پس‌زمینه
       *[plain] { $color }
    }
style-background-none = هیچی


## Boolean words

boolean-true = دِرِست
boolean-false = نادرست


## Answer buttons

answer-submit-label = جواب ره وارسی هاکن
answer-submit-label-no-correctness = جواب ره اِرسال هاکن


## Sectional blocks

section-name =
    .activity = فعالیت
    .aside = حاشیه
    .cascade = زنجیره
    .definition = تعریف
    .example = مثال
    .exercise = تمرین
    .exercises = تمرینون
    .given-answer = جواب
    .note = یادداشت
    .objectives = هدفون
    .paragraphs = بندون
    .part = قسمت
    .problem = مسئله
    .problems = مسئله‌ون
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

paginator-previous = قبلی
paginator-next = بعدی
paginator-page = صفحه
paginator-page-status = { $pageLabel } { $currentPage } از { $numPages }


## Piecewise functions

piecewise-condition-or = یا
piecewise-condition-if = اگه
piecewise-condition-otherwise = وگرنه


## Chemistry
##
## Character for character the Persian table. See the header: this is the list
## Mazanderani speakers actually use, because chemistry here is done in
## Persian. Do not respell these names.

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
chemistry-invalid-symbol = شیمیایی نماد نامعتبر هسه
chemistry-invalid-ionic-compound = یونی ترکیب نامعتبر هسه


## Inputs embedded in math

math-embedded-input-blank = خالی
math-embedded-input-blank-ordinal = { $ordinal } اومین خالی‌جا از { $total } تا
