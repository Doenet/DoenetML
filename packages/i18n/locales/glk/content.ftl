# Gilaki (گیلکی) content catalog: the prose the core computes into the
# document — style descriptions, boolean words, section names, chemistry.
# Selected by `documentLocale`, the language the activity itself was written
# in. Translated from `locales/en/content.ftl`, the source of truth.
#
# Message ids and attribute names are never translated — only the text to the
# right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Perso-Arabic script, right to left. The Gilaki Wikipedia
# writes «ؤ» for /o/ and «ۊ» for /u/ — «خؤب», «بۊشؤ». **This seed does not use
# either letter.** Applying that convention evenly across a catalog this size
# would mean guessing the vowel of every borrowed technical term, and half an
# orthography is worse than none. Everything here uses the plain Persian
# letters «و», «ا», «ی»: «سورخ», not «سۊرخ». A corrector who prefers the
# Wikipedia spelling should convert **all four files at once** rather than mix
# the two systems inside one catalog.
# (One caveat, so nobody "fixes" it: «ؤ» also occurs inside the Persian
# loanwords «مؤلفه» and «مؤلفه‌ان», where it is the ordinary Arabic hamza
# carrier of the standard Persian spelling, not the Gilaki /o/ letter. Those
# stay as they are.)
#
# **What is Gilaki here and what is not.** Gilaki has no vocabulary of its own
# for «چندضلعی», «کنتراست», «مؤلفه» or «ویژگی»: mathematics, chemistry and
# computing are done in Persian in Gilan, and a Gilaki-looking respelling of a
# Persian technical word would be a word no reader has ever met. So the content
# vocabulary of this file is Persian on purpose. What is Gilaki throughout is
# the grammar around it — the copula «ایسه»/«نیه», the plural «-ان», the
# numeral classifier «تا», the verbs «کودن»/«بوستن»/«واکودن»/«دوستن», the
# postpositions «مئن» and «ره», and a few everyday words: «ای» (this), «ویشتر»
# (more), «اگه» (if), «سیا» (black), «سیفید» (white), «سورخ» (red), «جور»
# (up), «جیر» (down). A reviewer should expect to be **rewriting sentences,
# not correcting typos**.
#
# **Word order, and how a modifier attaches.** This is where Gilaki parts
# company with Persian, and it is the reason this file is not a transliterated
# `fa`. The Gilaki noun phrase is **head-final**: an attributive adjective
# comes **before** its noun («پیله دار» — big tree), and a possessor comes
# before the possessed. Gilaki therefore has no work for the Persian ezafe to
# do here.
#
# The practical consequence, and the one a reviewer should check first:
# **nothing is ever welded onto a placeable in this file.** No ezafe vowel and
# no «ٔ» ends up written against `{ $noun }`, `{ $color }` or `{ $border }`,
# because every modifier stands in front of its head with a plain space
# between. Compare `fa/content.ftl`, which has to write «حاشیهٔ { $border }»
# and «پس‌زمینهٔ { $background }» — a spelled-out noun carrying the ezafe —
# precisely because Persian modifiers follow. Where this file wants a
# comitative phrase it uses the postposition «همراه» **after** the placeable
# («{ $pattern } همراه»), never a proclitic before it. Every placeable can be
# lifted out of its message whole.
#
# So: `style-with-noun` is `{ $description } { $noun }`, adjectives first —
# which is English's order and the reverse of Persian's, and arrived at for a
# Gilaki reason rather than by copying English. `noun-regular-polygon` folds
# the side count into the `[head]` branch and leaves `[tail]` empty, as English
# does, because the adjectives are already in front of the noun and nothing has
# to be pushed past them.
#
# **Gender.** Gilaki has no grammatical gender. `noun-gender` is defined here
# anyway, as `neuter`, so that the catalog says so deliberately instead of
# falling through to English, and so no adjective above has to carry a branch
# nothing will ever read.
#
# **Number.** The plural suffix is «-ان» — «نقطه‌ان», «لوزی‌ان», «خطان» — never
# Persian «-ها». After a numeral the noun stays **singular** and takes the
# classifier «تا»: «3 تا نقطه». `Intl.PluralRules` has no data for `glk`, so
# only `[one]` and `*[other]` could ever be selected in any case; since a
# counted noun does not change shape, every count select in this locale is
# collapsed to a single `*[other]`. Explicit numeric branches like `[0]` are
# matched against the number itself and are kept.
#
# **Chemistry — the tables are included, and they are the Persian ones.**
# `element-name` and `element-anion-name` below are **character for character
# the table in `fa/content.ftl`**. That is a deliberate decision, not an
# oversight. Chemistry in Gilan is taught, examined and printed in Persian;
# the settled, checkable list of all 118 element names that a Gilaki speaker
# actually uses *is* the Persian list, and it is a loan the language really
# makes rather than a nomenclature invented here. Falling back to English
# would put «Hydrogen» in front of a reader who says «هیدروژن», which serves
# them worse. A corrector must **not** "Gilakise" these names: there is
# nothing to Gilakise them into. `ion-name-oxidation-state` and the two
# invalid-symbol messages are frames rather than vocabulary and are written as
# ordinary prose.
#
# **Loans kept.** Beyond the element tables: every technical noun in the file
# — «ویژگی», «مؤلفه», «تابع», «منحنی», «سهمی», «چندضلعی», «مستطیل», «ناحیه»,
# «بردار», «قضیه», «اثبات» — and the colour words Gilaki itself borrows:
# «نارنجی», «زرد», «سبز», «آبی», «بنفش», «صورتی», «قهوه‌ای», «خاکستری»,
# «فیروزه‌ای». Only «سیا», «سیفید» and «سورخ» are Gilaki's own.
#
# **Coverage.** This file covers every key in `locales/en/content.ftl`,
# including the two field nouns (`.slope-field`, `.vector-field`) and the two
# embedded-input messages that `fa` leaves to fall back.


## Style vocabulary

color =
    .black = سیا
    .white = سیفید
    .gray = خاکستری
    .red = سورخ
    .orange = نارنجی
    .yellow = زرد
    .green = سبز
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
# Adjective before noun, plural in «-ان»: «افقی خطان», not «خطوط افقی».
fill-style =
    .horizontal = افقی خطان
    .vertical = عمودی خطان
    .diagonal = مورب خطان
    .backdiagonal = برعکس مورب خطان
    .dots = نقطه‌ان
    .diamonds = لوزی‌ان
noun =
    .line = خط
    .line-segment = پاره‌خط
    .ray = نیم‌خط
    .vector = بردار
    .curve = منحنی
    .function = تابع
    .slope-field = شیب میدان
    .vector-field = بردار میدان
    .parabola = سهمی
    .polyline = شکسته خط
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
# The side count is a modifier and so goes in front, inside the head, where
# the other adjectives already are. Nothing needs a tail, so `[tail]` is empty
# exactly as in English.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } ضلعی منتظم
    }
# Defined on purpose: Gilaki has no grammatical gender, and saying so here
# keeps every adjective above from carrying a branch nothing reads.
noun-gender = neuter

## Style composition

# Modifiers stack in front of the head they will attach to, so the order
# within the string is the English one. It is reached from Gilaki's head-final
# noun phrase, not copied.
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
# Adjectives first, noun last — and so nothing is attached to `$noun`.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
style-filled-word = توپر
# «همراه» — *along with* — is a postposition and follows the pattern name, so
# the placeable stays free at its left edge as well as its right.
style-filled =
    { $parts ->
        [pattern] { $pattern } همراه { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } همراه { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } همراه { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# Gilaki has no indefinite article, so the two `-article` branches say what
# their plain counterparts say. They are kept apart because the distinction
# belongs to the English message, not to this one. «حاشیه» follows the
# placeable describing it, so no ezafe is written against `$border`.
style-border-clause =
    { $parts ->
        [with-article] { $border } حاشیه همراه
        [and] و { $border } حاشیه
        [and-article] و { $border } حاشیه
       *[with] { $border } حاشیه همراه
    }
# Where Persian must write «به رنگ» to hang the colour off the pattern, Gilaki
# just puts the colour in front of it.
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = توخالی
style-text =
    { $parts ->
        [background] { $background } پس‌زمینه همراه { $color }
       *[plain] { $color }
    }
style-background-none = هیچی

## Boolean words

boolean-true = درست
boolean-false = نادرست

## Answer buttons

answer-submit-label = کار بررسی کودن
answer-submit-label-no-correctness = پاسخ ارسال کودن

## Sectional blocks

section-name =
    .activity = فعالیت
    .aside = حاشیه
    .cascade = زنجیره
    .definition = تعریف
    .example = مثال
    .exercise = تمرین
    .exercises = تمرینان
    .given-answer = پاسخ
    .note = یادداشت
    .objectives = هدفان
    .paragraphs = بندان
    .part = قسمت
    .problem = مسئله
    .problems = مسئله‌ان
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
## The two tables below are the Persian ones, character for character. See the
## header: chemistry in Gilan is done in Persian, so this is the list a Gilaki
## reader actually uses, and there is nothing to Gilakise it into.

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
chemistry-invalid-symbol = نامعتبر شیمیایی نماد
chemistry-invalid-ionic-compound = نامعتبر یونی ترکیب

## Inputs embedded in math

math-embedded-input-blank = خالی جا
math-embedded-input-blank-ordinal = { $total } تا خالی جا از شماره { $ordinal }

