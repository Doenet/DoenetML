# Persian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written right to left, in the Arabic script but not in Arabic: Persian has no
# grammatical gender and only two plural categories, so almost none of what
# `ar/content.ftl` does for agreement is needed here. See the Direction section
# of the README for what a right-to-left catalog does and does not change.
#
# Numbers reach the reader in Latin digits, which is the repository-wide policy
# under "Digits are Latin, separators are not" in the README. Persian pairs its
# own separators with its own digits and Latin separators with Latin digits, so
# pinning the digits pins the separators with them.
#
# Adjectives follow their noun, joined by the ezāfe. After a consonant it is an
# unwritten vowel, so `style-with-noun` reverses the two halves and the space
# between them carries the link. After a word ending in a vowel it *is* written
# — «حاشیهٔ», «پس‌زمینهٔ» — which is why the nouns this file spells out carry it
# and the ones handed in through `$noun` cannot: a placeable is not a word, and
# nothing can be attached to it. See the note on `style-fill` below.


## Style vocabulary

color =
    .black = سیاه
    .white = سفید
    .gray = خاکستری
    .red = قرمز
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
fill-style =
    .horizontal = خطوط افقی
    .vertical = خطوط عمودی
    .diagonal = خطوط مورب
    .backdiagonal = خطوط مورب معکوس
    .dots = نقطه‌ها
    .diamonds = لوزی‌ها
noun =
    .line = خط
    .line-segment = پاره‌خط
    .ray = نیم‌خط
    .vector = بردار
    .curve = منحنی
    .function = تابع
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
# The side count follows the adjectives rather than preceding the noun, so that
# the adjectives stay against the word they describe: «چندضلعی منتظم قرمز ضخیم
# با 5 ضلع». Persian counts with a singular noun, so there is nothing here for
# the count to agree with.
noun-regular-polygon =
    { $part ->
        [tail] با { $numSides } ضلع
       *[head] چندضلعی منتظم
    }
# Persian has no grammatical gender. The token is defined anyway rather than
# left to fall back, so that this catalog says so on purpose and none of the
# adjectives above has to carry a branch nothing reads.
noun-gender = neuter

## Style composition

# The mirror of the English order, so the adjective English puts nearest the
# noun is the one Persian puts nearest it: "thick dashed red line" becomes
# «خط قرمز خط‌چین ضخیم».
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
# «توپر» — solid — against «توخالی» below, which is how Persian says a shape is
# filled rather than hollow.
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
# Persian has no indefinite article, so the two `-article` branches say what
# their plain counterparts do. They are kept apart because the distinction
# belongs to the English message rather than to this one.
style-border-clause =
    { $parts ->
        [with-article] با حاشیهٔ { $border }
        [and] و حاشیهٔ { $border }
        [and-article] و حاشیهٔ { $border }
       *[with] با حاشیهٔ { $border }
    }
# «به رنگ» — "in the color of" — rather than an adjective against the pattern:
# the ezāfe linking a plural noun to its adjective is written, and it cannot be
# written onto a placeable.
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
    .exercises = تمرین‌ها
    .given-answer = پاسخ
    .note = یادداشت
    .objectives = اهداف
    .paragraphs = بندها
    .part = قسمت
    .problem = مسئله
    .problems = مسائل
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
piecewise-condition-if = اگر
piecewise-condition-otherwise = در غیر این صورت

## Chemistry

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
