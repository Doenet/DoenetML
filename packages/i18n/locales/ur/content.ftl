# Urdu content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written right to left, and the only catalog here whose grammar is Hindi's:
# `locales/hi` is the closest thing to a parallel text for this file, and a
# correction to one is usually a correction to both.
#
# Urdu adjectives fall into two classes. *Marked* ones end in ا and inflect —
# کالا / کالی / کالے — while *unmarked* ones never change: سرخ، سفید، سرمئی،
# نارنجی، گلابی، بینگنی، فیروزی. Only the marked ones select below.
#
# A marked adjective takes the oblique ے before a noun governed by a
# postposition, which is why `$role` matters here:
#
#   standalone          direct, agreeing with the noun described
#   border-clause       oblique, before «کنارے کے ساتھ»
#   background-clause   oblique, before «پس منظر پر»
#   text-clause         direct masculine, agreeing with متن
#
# The middle two coincide, because both nouns are masculine and both sit under
# a postposition. They are written out separately anyway: which case a position
# governs is this catalog's business, and a later rewording may separate them.
#
# Numbers render as 1,234.5 rather than in Eastern Arabic numerals, which is
# the repository-wide policy under "Digits are Latin, separators are not".
#
# Sentences end in «۔», Urdu's own full stop, and separate with «،».


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] کالے
            [background-clause] کالے
            [text-clause] کالا
           *[standalone]
                { $gender ->
                    [f] کالی
                   *[m] کالا
                }
        }
    .white = سفید
    .gray = سرمئی
    .red = سرخ
    .orange = نارنجی
    .yellow =
        { $role ->
            [border-clause] پیلے
            [background-clause] پیلے
            [text-clause] پیلا
           *[standalone]
                { $gender ->
                    [f] پیلی
                   *[m] پیلا
                }
        }
    .green =
        { $role ->
            [border-clause] ہرے
            [background-clause] ہرے
            [text-clause] ہرا
           *[standalone]
                { $gender ->
                    [f] ہری
                   *[m] ہرا
                }
        }
    .cyan = فیروزی
    .blue =
        { $role ->
            [border-clause] نیلے
            [background-clause] نیلے
            [text-clause] نیلا
           *[standalone]
                { $gender ->
                    [f] نیلی
                   *[m] نیلا
                }
        }
    .purple = بینگنی
    .pink = گلابی
    .brown =
        { $role ->
            [border-clause] بھورے
            [background-clause] بھورے
            [text-clause] بھورا
           *[standalone]
                { $gender ->
                    [f] بھوری
                   *[m] بھورا
                }
        }

line-width =
    .thick =
        { $role ->
            [border-clause] موٹے
            [background-clause] موٹے
            [text-clause] موٹا
           *[standalone]
                { $gender ->
                    [f] موٹی
                   *[m] موٹا
                }
        }
    .thin =
        { $role ->
            [border-clause] پتلے
            [background-clause] پتلے
            [text-clause] پتلا
           *[standalone]
                { $gender ->
                    [f] پتلی
                   *[m] پتلا
                }
        }

# Both are unmarked, so neither inflects.
line-style =
    .dashed = منقطع
    .dotted = نقطہ دار

# Noun phrases in the oblique plural, because their other use is in front of
# «والا» — a postposition, which puts what precedes it in the oblique. They
# agree with nothing, so `style-fill` has to give them something to hang off
# rather than print them bare.
fill-style =
    .horizontal = افقی لکیروں
    .vertical = عمودی لکیروں
    .diagonal = ترچھی لکیروں
    .backdiagonal = مخالف ترچھی لکیروں
    .dots = نقطوں
    .diamonds = معینوں

noun =
    .line = لکیر
    .line-segment = قطعہ خط
    .ray = شعاع
    .vector = سمتیہ
    .curve = منحنی
    .function = دالہ
    .parabola = قطع مکافی
    .polyline = کثیر لکیر
    .polygon = کثیر الاضلاع
    .triangle = مثلث
    .rectangle = مستطیل
    .circle = دائرہ
    .region = خطہ
    .point = نقطہ
    .square = مربع
    .diamond = معین
    .cross = کراس
    .plus = جمع کا نشان

# Urdu keeps the side count in front of the noun, so the whole thing is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } اضلاع والا باقاعدہ کثیر الاضلاع
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (کثیر الاضلاع, m)
# or the head of a phrase the description never names: `border` (کنارہ, m),
# `fill` (بھراؤ, m), `text` (متن, m), `background` (پس منظر, m). Urdu parts
# company with Hindi on the last of those — پس منظر is masculine where
# पृष्ठभूमि is feminine — which is why the `background-clause` branches above
# read as they do.
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [polyline] f
       *[other] m
    }


## Style composition

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

# Adjectives precede the noun, as in English.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

# Only ever said of the shape itself, so it is standalone in every description
# and takes no `$role` branch.
style-filled-word =
    { $gender ->
        [f] بھری ہوئی
       *[m] بھرا ہوا
    }

style-filled =
    { $parts ->
        [pattern] { $pattern } والا { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } والا { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } والا { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «کے ساتھ» is a postposition, so «کنارہ» takes the oblique «کنارے» and so do
# its adjectives — which is what the `border-clause` branch supplies. Urdu has
# no article, so the `-article` branches read the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } کنارے کے ساتھ
        [and] اور { $border } کنارے کے ساتھ
        [and-article] اور { $border } کنارے کے ساتھ
       *[with] { $border } کنارے کے ساتھ
    }

# The fill-pattern words are oblique plurals, so this message supplies a noun
# for them to hang off — «بھراؤ», masculine, which is the gender `noun-gender`
# already answers for `fill`, so the colour agrees with it in both variants.
style-fill =
    { $parts ->
        [pattern] { $pattern } والا { $color } بھراؤ
       *[plain] { $color } بھراؤ
    }

style-unfilled = بغیر بھراؤ

style-text =
    { $parts ->
        [background] { $background } پس منظر پر { $color }
       *[plain] { $color }
    }

style-background-none = کوئی نہیں


## Boolean words

boolean-true = صحیح
boolean-false = غلط


## Answer buttons

answer-submit-label = جواب جانچیں
answer-submit-label-no-correctness = جواب بھیجیں


## Sectional blocks

section-name =
    .activity = سرگرمی
    .aside = حاشیہ
    .cascade = سلسلہ
    .definition = تعریف
    .example = مثال
    .exercise = مشق
    .exercises = مشقیں
    .given-answer = جواب
    .note = نوٹ
    .objectives = مقاصد
    .paragraphs = پیراگراف
    .part = حصہ
    .problem = مسئلہ
    .problems = مسائل
    .proof = ثبوت
    .question = سوال
    .section = باب
    .solution = حل
    .task = کام
    .theorem = نظریہ

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ "۔ " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = اشارہ


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

paginator-previous = پچھلا
paginator-next = اگلا
paginator-page = صفحہ

paginator-page-status = { $numPages } میں سے { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = یا

piecewise-condition-if = اگر

piecewise-condition-otherwise = بصورت دیگر


## Chemistry

element-name =
    .h = ہائیڈروجن
    .he = ہیلیم
    .li = لیتھیم
    .be = بیریلیم
    .b = بورون
    .c = کاربن
    .n = نائٹروجن
    .o = آکسیجن
    .f = فلورین
    .ne = نیون
    .na = سوڈیم
    .mg = میگنیشیم
    .al = ایلومینیم
    .si = سلیکون
    .p = فاسفورس
    .s = سلفر
    .cl = کلورین
    .ar = آرگن
    .k = پوٹاشیم
    .ca = کیلشیم
    .sc = اسکینڈیم
    .ti = ٹائٹینیم
    .v = وینیڈیم
    .cr = کرومیم
    .mn = مینگنیز
    .fe = لوہا
    .co = کوبالٹ
    .ni = نکل
    .cu = تانبا
    .zn = جست
    .ga = گیلیم
    .ge = جرمینیم
    .as = آرسینک
    .se = سیلینیم
    .br = برومین
    .kr = کرپٹون
    .rb = روبیڈیم
    .sr = اسٹرانشیم
    .y = اٹریم
    .zr = زرکونیم
    .nb = نیوبیم
    .mo = مولبڈینم
    .tc = ٹیکنیشیم
    .ru = روتھینیم
    .rh = روڈیم
    .pd = پلیڈیم
    .ag = چاندی
    .cd = کیڈمیم
    .in = انڈیم
    .sn = ٹن
    .sb = اینٹیمنی
    .te = ٹیلوریم
    .i = آیوڈین
    .xe = زینون
    .cs = سیزیم
    .ba = بیریم
    .la = لینتھنم
    .ce = سیریم
    .pr = پریزیوڈیمیم
    .nd = نیوڈیمیم
    .pm = پرومیتھیم
    .sm = سماریم
    .eu = یوروپیم
    .gd = گیڈولینیم
    .tb = ٹربیم
    .dy = ڈسپروسیم
    .ho = ہولمیم
    .er = اربیم
    .tm = تھولیم
    .yb = اٹربیم
    .lu = لیوٹیشیم
    .hf = ہافنیم
    .ta = ٹینٹلم
    .w = ٹنگسٹن
    .re = رینیم
    .os = اوسمیم
    .ir = ایریڈیم
    .pt = پلاٹینم
    .au = سونا
    .hg = پارہ
    .tl = تھیلیم
    .pb = سیسہ
    .bi = بسمتھ
    .po = پولونیم
    .at = ایسٹاٹین
    .rn = ریڈون
    .fr = فرانشیم
    .ra = ریڈیم
    .ac = ایکٹینیم
    .th = تھوریم
    .pa = پروٹیکٹینیم
    .u = یورینیم
    .np = نیپٹونیم
    .pu = پلوٹونیم
    .am = امریشیم
    .cm = کیوریم
    .bk = برکیلیم
    .cf = کیلیفورنیم
    .es = آئن سٹائنیم
    .fm = فرمیم
    .md = مینڈلیویم
    .no = نوبیلیم
    .lr = لارنشیم
    .rf = ردرفورڈیم
    .db = ڈبنیم
    .sg = سیبورجیم
    .bh = بوہریم
    .hs = ہاسیم
    .mt = مائٹنیریم
    .ds = ڈارمسٹیڈیم
    .rg = رونٹجینیم
    .cn = کوپرنیشیم
    .nh = نیہونیم
    .fl = فلیرویم
    .mc = ماسکوویم
    .lv = لیورموریم
    .ts = ٹینیسین
    .og = اوگنیسون

element-anion-name =
    .h = ہائیڈرائیڈ
    .c = کاربائیڈ
    .n = نائٹرائیڈ
    .o = آکسائیڈ
    .f = فلورائیڈ
    .p = فاسفائیڈ
    .s = سلفائیڈ
    .cl = کلورائیڈ
    .br = برومائیڈ
    .i = آیوڈائیڈ
    .at = ایسٹاٹائیڈ
    .ts = ٹینیسائیڈ

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = نامعتبر کیمیائی علامت
chemistry-invalid-ionic-compound = نامعتبر آئنی مرکب
