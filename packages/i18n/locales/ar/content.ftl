# Arabic content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The first right-to-left catalog in this repository. Nothing about the file
# format changes for it: a `.ftl` pattern is a sequence of characters in
# *logical* order, so the text below reads in the order it is spoken and the
# renderer's `dir` decides where each run is drawn. See the Direction section
# of the README.
#
# Numbers reach the reader in Latin digits even though CLDR counts Egyptian
# Arabic in Eastern Arabic numerals — that is a repository-wide policy, written
# down under "Digits are Latin, separators are not" in the README, and this
# catalog does nothing to opt out of it.
#
# Arabic puts its adjectives *after* the noun and agrees them with it in
# gender, so `style-with-noun` reverses the two halves and every adjective
# below selects on `$gender`.
#
# None of them selects on `$role`. Arabic does inflect for case, but only in
# the vocalization, which is not written, so an indefinite adjective is
# spelled identically in all four positions `$role` distinguishes. A catalog
# that later writes vocalized text would need the branch; this one would only
# repeat itself four times.
#
# Register: impersonal throughout — verbal nouns and bare nouns rather than an
# imperative addressed to the reader, matching how the rest of these catalogs
# avoid choosing a formality the viewer cannot know.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] سوداء
           *[m] أسود
        }
    .white =
        { $gender ->
            [f] بيضاء
           *[m] أبيض
        }
    .gray =
        { $gender ->
            [f] رمادية
           *[m] رمادي
        }
    .red =
        { $gender ->
            [f] حمراء
           *[m] أحمر
        }
    .orange =
        { $gender ->
            [f] برتقالية
           *[m] برتقالي
        }
    .yellow =
        { $gender ->
            [f] صفراء
           *[m] أصفر
        }
    .green =
        { $gender ->
            [f] خضراء
           *[m] أخضر
        }
    .cyan =
        { $gender ->
            [f] سماوية
           *[m] سماوي
        }
    .blue =
        { $gender ->
            [f] زرقاء
           *[m] أزرق
        }
    .purple =
        { $gender ->
            [f] أرجوانية
           *[m] أرجواني
        }
    .pink =
        { $gender ->
            [f] وردية
           *[m] وردي
        }
    .brown =
        { $gender ->
            [f] بنية
           *[m] بني
        }

line-width =
    .thick =
        { $gender ->
            [f] سميكة
           *[m] سميك
        }
    .thin =
        { $gender ->
            [f] رفيعة
           *[m] رفيع
        }

line-style =
    .dashed =
        { $gender ->
            [f] متقطعة
           *[m] متقطع
        }
    .dotted =
        { $gender ->
            [f] منقطة
           *[m] منقط
        }

# Fill patterns are plural nouns rather than adjectives, so they do not agree
# with the shape and take no `$gender` branch. A colour word beside one agrees
# with it as a feminine singular, which is what Arabic does with a non-human
# plural — and which the colour already is, since `describeFill` looks it up
# under the gender of «تعبئة».
fill-style =
    .horizontal = خطوط أفقية
    .vertical = خطوط رأسية
    .diagonal = خطوط مائلة
    .backdiagonal = خطوط مائلة معاكسة
    .dots = نقاط
    .diamonds = معينات

# «علامة ضرب» and «علامة زائد» name the marker by the sign it is drawn as.
# «صليب» is the word for a cross as an object and carries a religious sense
# that a plotted point does not.
noun =
    .line = خط
    .line-segment = قطعة مستقيمة
    .ray = شعاع
    .vector = متجه
    .curve = منحنى
    .function = دالة
    .parabola = قطع مكافئ
    .polyline = خط منكسر
    .polygon = مضلع
    .triangle = مثلث
    .rectangle = مستطيل
    .circle = دائرة
    .region = منطقة
    .point = نقطة
    .square = مربع
    .diamond = معين
    .cross = علامة ضرب
    .plus = علامة زائد

# The side count is a complement rather than part of the head: «مضلع منتظم»
# takes its adjectives first and closes with «ذو 5 أضلاع», so that the
# adjectives stay beside the noun they agree with.
#
# The counted noun then has to agree with the count, which in Arabic means the
# plural for three to ten and the singular for eleven upwards — «ذو 5 أضلاع»
# but «ذو 12 ضلعًا». A polygon has at least three sides, so `zero` and `one`
# are unreachable; `two` is here because a Fluent select costs nothing for a
# branch it never takes, and a heptagon reading "7 ضلع" would be wrong in a way
# a reader notices immediately.
noun-regular-polygon =
    { $part ->
        [tail]
            { $numSides ->
                [two] ذو ضلعين
                [few] ذو { $numSides } أضلاع
                [many] ذو { $numSides } ضلعًا
               *[other] ذو { $numSides } ضلع
            }
       *[head] مضلع منتظم
    }

# Besides the nouns above, `$noun` may be «regular-polygon» (مضلع منتظم, m) or
# the head of a phrase the description never names: «border» (إطار, m), «fill»
# (ملء, m), «text» (نص, m), «background» (خلفية, f). Only the last is feminine
# and only it is listed; the other three take the default. «خلفية» has to be
# named because `style-text` writes it and its adjective would otherwise read
# «على خلفية أصفر».
noun-gender =
    { $noun ->
        [line-segment] f
        [function] f
        [circle] f
        [region] f
        [point] f
        [cross] f
        [plus] f
        [background] f
       *[other] m
    }


## Style composition

# The adjectives are listed in the mirror of the English order, so that the one
# English puts closest to the noun is the one Arabic puts closest to it too:
# "thick dashed red line" becomes «خط أحمر متقطع سميك».
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

# The noun leads and its adjectives follow: «خط أحمر سميك». A noun with a
# complement closes the phrase with it: «مضلع منتظم أحمر سميك ذو 5 أضلاع».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word =
    { $gender ->
        [f] مملوءة
       *[m] مملوء
    }

# «بنمط» — "with a pattern of" — rather than a bare preposition: Arabic
# attaches «بـ» directly to the word after it, and a placeable cannot be
# written against a prefix without a tatweel between them.
style-filled =
    { $parts ->
        [pattern] { $color } { $filled } بنمط { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } بنمط { $pattern }
        [plain-tail] { $noun } { $color } { $filled } { $nounTail }
        [pattern-tail] { $noun } { $color } { $filled } { $nounTail } بنمط { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

# Arabic has no indefinite article, so the two `-article` branches say exactly
# what their plain counterparts do. They are kept apart rather than folded
# together because the distinction is the English message's, not this one's,
# and a future rewording may want it. «إطار» is masculine, so the border's
# adjectives agree with it and not with the shape around it.
style-border-clause =
    { $parts ->
        [with-article] بإطار { $border }
        [and] وإطار { $border }
        [and-article] وإطار { $border }
       *[with] بإطار { $border }
    }

# «بلون» — "of the colour" — because the colour arrives agreed with «ملء»,
# which is masculine singular, while the pattern words are feminine plurals.
# The plain variant is the whole of what `fillColor` reports, so the gender the
# adjective takes there has to be the fill's own; hanging the pattern off a
# noun of its own is what lets both variants use the one form.
style-fill =
    { $parts ->
        [pattern] { $pattern } بلون { $color }
       *[plain] { $color }
    }

# Said of no particular shape — `describeFill` passes no gender — so it takes
# the masculine, which is also what an unnamed subject takes.
style-unfilled = غير مملوء

style-text =
    { $parts ->
        [background] { $color } على خلفية { $background }
       *[plain] { $color }
    }

style-background-none = لا شيء


## Boolean words

boolean-true = صواب
boolean-false = خطأ


## Answer buttons

answer-submit-label = تحقق من الإجابة
answer-submit-label-no-correctness = إرسال الإجابة


## Sectional blocks

section-name =
    .activity = نشاط
    .aside = استطراد
    .cascade = تسلسل
    .definition = تعريف
    .example = مثال
    .exercise = تمرين
    .exercises = تمارين
    .given-answer = إجابة
    .note = ملاحظة
    .objectives = أهداف
    .paragraphs = فقرات
    .part = جزء
    .problem = مسألة
    .problems = مسائل
    .proof = برهان
    .question = سؤال
    .section = قسم
    .solution = حل
    .task = مهمة
    .theorem = نظرية

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = تلميح


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
        [numbered] شكل { $enumeration }
        [numbered-caption] شكل { $enumeration }{ ": " }
        [unnumbered-caption] شكل{ ": " }
       *[unnumbered] شكل
    }


## Paginator controls

paginator-previous = السابق
paginator-next = التالي
paginator-page = صفحة

paginator-page-status = { $pageLabel } { $currentPage } من { $numPages }


## Piecewise functions

piecewise-condition-or = أو

piecewise-condition-if = إذا كان

piecewise-condition-otherwise = خلاف ذلك


## Chemistry

element-name =
    .h = هيدروجين
    .he = هيليوم
    .li = ليثيوم
    .be = بيريليوم
    .b = بورون
    .c = كربون
    .n = نيتروجين
    .o = أكسجين
    .f = فلور
    .ne = نيون
    .na = صوديوم
    .mg = مغنيسيوم
    .al = ألومنيوم
    .si = سيليكون
    .p = فوسفور
    .s = كبريت
    .cl = كلور
    .ar = أرجون
    .k = بوتاسيوم
    .ca = كالسيوم
    .sc = سكانديوم
    .ti = تيتانيوم
    .v = فاناديوم
    .cr = كروم
    .mn = منجنيز
    .fe = حديد
    .co = كوبالت
    .ni = نيكل
    .cu = نحاس
    .zn = زنك
    .ga = جاليوم
    .ge = جرمانيوم
    .as = زرنيخ
    .se = سيلينيوم
    .br = بروم
    .kr = كريبتون
    .rb = روبيديوم
    .sr = سترونشيوم
    .y = إتريوم
    .zr = زركونيوم
    .nb = نيوبيوم
    .mo = موليبدينوم
    .tc = تكنيشيوم
    .ru = روثينيوم
    .rh = روديوم
    .pd = بلاديوم
    .ag = فضة
    .cd = كادميوم
    .in = إنديوم
    .sn = قصدير
    .sb = أنتيمون
    .te = تيلوريوم
    .i = يود
    .xe = زينون
    .cs = سيزيوم
    .ba = باريوم
    .la = لانثانوم
    .ce = سيريوم
    .pr = براسيوديميوم
    .nd = نيوديميوم
    .pm = بروميثيوم
    .sm = ساماريوم
    .eu = يوروبيوم
    .gd = جادولينيوم
    .tb = تربيوم
    .dy = ديسبروسيوم
    .ho = هولميوم
    .er = إربيوم
    .tm = ثوليوم
    .yb = إتربيوم
    .lu = لوتيشيوم
    .hf = هافنيوم
    .ta = تانتالوم
    .w = تنجستن
    .re = رينيوم
    .os = أوزميوم
    .ir = إريديوم
    .pt = بلاتين
    .au = ذهب
    .hg = زئبق
    .tl = ثاليوم
    .pb = رصاص
    .bi = بزموت
    .po = بولونيوم
    .at = أستاتين
    .rn = رادون
    .fr = فرانسيوم
    .ra = راديوم
    .ac = أكتينيوم
    .th = ثوريوم
    .pa = بروتكتينيوم
    .u = يورانيوم
    .np = نبتونيوم
    .pu = بلوتونيوم
    .am = أمريسيوم
    .cm = كوريوم
    .bk = بركيليوم
    .cf = كاليفورنيوم
    .es = أينشتاينيوم
    .fm = فيرميوم
    .md = مندليفيوم
    .no = نوبليوم
    .lr = لورنسيوم
    .rf = رذرفورديوم
    .db = دوبنيوم
    .sg = سيبورجيوم
    .bh = بوريوم
    .hs = هاسيوم
    .mt = مايتنريوم
    .ds = دارمشتاتيوم
    .rg = رونتجينيوم
    .cn = كوبرنيسيوم
    .nh = نيهونيوم
    .fl = فليروفيوم
    .mc = موسكوفيوم
    .lv = ليفرموريوم
    .ts = تينيسين
    .og = أوجانيسون

element-anion-name =
    .h = هيدريد
    .c = كربيد
    .n = نيتريد
    .o = أكسيد
    .f = فلوريد
    .p = فوسفيد
    .s = كبريتيد
    .cl = كلوريد
    .br = بروميد
    .i = يوديد
    .at = أستاتيد
    .ts = تينيسيد

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = رمز كيميائي غير صالح
chemistry-invalid-ionic-compound = مركب أيوني غير صالح
