# Hazaragi (هزارگی / آزرگی) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in, not the reader's interface language.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Perso-Arabic, right to left, following Kabul
# Dari: `ی` and `ک` in their Persian shapes, final `ه`, and `هٔ` for the
# written ezafe after a vowel. Hazaragi's vowel system is not Kabul's, but
# there is no accepted way of spelling the difference and this file does not
# invent one. Digits are Latin, per the README. See `chrome.ftl` for the full
# statement, including the fact that **CLDR has no name for `haz` at all**.
#
# **What is Hazaragi here and what is Dari.** Most of this vocabulary is shared
# with Dari word for word, and the Dari word is written rather than a
# manufactured difference — a Dari word in this file is not an oversight. The
# two places Hazaragi's own usage does show are **«قد» for *with*** (Dari
# «با»), which is what `style-filled`, `style-border-clause` and `style-text`
# are built on, and **«بلدِ» for *for***.
#
# **Word order: the noun comes first and its modifiers follow it, joined by the
# ezafe** — the Persian arrangement, since Hazaragi is a Persian variety.
# «خطِ سرخ» is *a red line*. After a consonant the ezafe is an **unwritten
# vowel**, so `style-with-noun` reverses the two halves of the English and lets
# the space between them carry the link; after a word ending in a vowel it *is*
# written — «حاشیهٔ», «پس‌منظرهٔ» — which is why the nouns this file spells out
# carry it and the ones arriving through `$noun` cannot. **Nothing is welded
# onto a placeable**: a placeable is not a word, and the ezafe on an unknown
# noun cannot be predicted. The known cost is an author's own
# `markerStyleWord`, which reaches the reader with no link at all; that is a
# real gap and the first thing to check if a description reads wrong.
#
# **Gender: none**, as in Persian. `noun-gender` answers a single token,
# defined on purpose rather than left to fall back, and no adjective forks on
# `$gender` or on `$role`.
#
# **Number.** A noun after a numeral stays unmarked, so nothing here selects on
# a count. See the plural note in `chrome.ftl`.
#
# **The chemistry tables are deliberately absent**, and this is the one
# decision in the file that deserves an argument rather than a sentence.
# `element-name` and `element-anion-name` are the only English keys not covered
# here. Hazaragi is not a medium of instruction: schooling in Afghanistan is in
# Dari and Pashto, and the periodic table a Hazara pupil meets is the Dari one.
# There is no Hazaragi list of the hundred and eighteen elements to check a
# translation against, and the list that would go here is not Hazaragi's — it
# is Dari's, which differs from the Iranian Persian of `locales/fa` in a
# scatter of names and belongs in a `prs` catalog that does not exist yet. So
# these keys fall back to English today. Writing the Iranian names here and
# calling them Hazaragi would report a fact about Tehran; writing a
# transliteration of the Dari ones from memory would be inventing a
# nomenclature. `lint:i18n` reports the two as missing coverage, and that
# report is correct. `ion-name-oxidation-state` and the two invalid-symbol
# messages **are** covered: they are frames and punctuation, not vocabulary.
#
# **Loans kept:** the geometry and style words are the Perso-Arabic
# mathematical vocabulary of Afghan schooling — `فنکشن`, `ویکتور`, `سهمی`,
# `مستطیل`, `مثلث`, `ساحه`, `افقی`, `عمودی`, `مایل`, `آیونی`, `ترکیب`.


## Style vocabulary

color =
    .black = سیاه
    .white = سفید
    .gray = خاکستری
    .red = سرخ
    .orange = نارنجی
    .yellow = زرد
    .green = سبز
    .cyan = فیروزه‌ای
    .blue = آبی
    .purple = بنفش
    .pink = گلابی
    .brown = نصواری
line-width =
    .thick = ستبر
    .thin = باریک
line-style =
    .dashed = خط‌خط
    .dotted = نقطه‌نقطه
# Noun phrases rather than adjectives: all four uses stand behind «قد», so
# these are written as they are wanted there.
fill-style =
    .horizontal = خط‌های افقی
    .vertical = خط‌های عمودی
    .diagonal = خط‌های مایل
    .backdiagonal = خط‌های مایلِ برعکس
    .dots = نقطه‌ها
    .diamonds = الماس‌ها
noun =
    .line = خط
    .line-segment = پارچه‌خط
    .ray = نیم‌خط
    .vector = ویکتور
    .curve = منحنی
    .function = فنکشن
    .slope-field = ساحهٔ میلان
    .vector-field = ساحهٔ ویکتور
    .parabola = سهمی
    .polyline = چندخط
    .polygon = چندضلعی
    .triangle = مثلث
    .rectangle = مستطیل
    .circle = دایره
    .region = ساحه
    .point = نقطه
    .square = مربع
    .diamond = الماس
    .cross = چلیپا
    .plus = نشانِ جمع
# The side count follows the modifiers rather than sitting inside the noun, so
# that they stay beside the word they describe: «چندضلعیِ منظمِ سرخِ ستبر قد 5
# ضلع». Hazaragi counts with an unmarked noun, so nothing agrees here.
noun-regular-polygon =
    { $part ->
        [tail] قد { $numSides } ضلع
       *[head] چندضلعیِ منظم
    }
# Hazaragi, like Persian, has no grammatical gender. The token is defined
# anyway rather than left to fall back, so that this catalog says so on
# purpose.
noun-gender = neuter


## Style composition
##
## The mirror of the English order, so that the modifier English puts nearest
## the noun is the one Hazaragi puts nearest it.

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
# «پُر» — full — against «خالی» below, which is how a shape is said to be
# filled rather than hollow.
style-filled-word = پُر
style-filled =
    { $parts ->
        [pattern] { $color } { $filled } قد { $pattern }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } قد { $pattern }
        [plain-tail] { $noun } { $color } { $filled } { $nounTail }
        [pattern-tail] { $noun } { $color } { $filled } { $nounTail } قد { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }
# There is no indefinite article, so the two `-article` branches say what their
# plain counterparts do. They are kept apart because the distinction belongs to
# the English message rather than to this one. «حاشیهٔ» ends in a vowel, so its
# ezafe is written — and it is written here, on a word this catalog owns,
# rather than onto the placeable beside it.
style-border-clause =
    { $parts ->
        [with-article] قد حاشیهٔ { $border }
        [and] و حاشیهٔ { $border }
        [and-article] و حاشیهٔ { $border }
       *[with] قد حاشیهٔ { $border }
    }
# «به رنگِ» — "in the colour of" — rather than an adjective placed against the
# pattern: the ezafe linking a plural noun to its adjective is written, and it
# cannot be written onto a placeable.
style-fill =
    { $parts ->
        [pattern] { $pattern } به رنگِ { $color }
       *[plain] { $color }
    }
style-unfilled = خالی
style-text =
    { $parts ->
        [background] { $color } قد پس‌منظرهٔ { $background }
       *[plain] { $color }
    }
style-background-none = هیچ


## Boolean words
##
## What a `<boolean>` displays. `true` and `false` as an author writes them in
## the source stay English; only these two move.

boolean-true = درست
boolean-false = نادرست


## Answer buttons

answer-submit-label = چک کدونِ کار
answer-submit-label-no-correctness = روان کدونِ جواب


## Sectional blocks

section-name =
    .activity = فعالیت
    .aside = حاشیه
    .cascade = زنجیره
    .definition = تعریف
    .example = مثال
    .exercise = تمرین
    .exercises = تمرین‌ها
    .given-answer = جواب
    .note = یادداشت
    .objectives = مقصدها
    .paragraphs = پاراگراف‌ها
    .part = بخش
    .problem = مسئله
    .problems = مسئله‌ها
    .proof = اثبات
    .question = پرسان
    .section = فصل
    .solution = حل
    .task = کار
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
hint-title = رهنمایی


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

paginator-previous = پیشتر
paginator-next = بعدی
paginator-page = صفحه
paginator-page-status = { $pageLabel } { $currentPage } از { $numPages }


## Piecewise functions

piecewise-condition-or = یا
piecewise-condition-if = اگه
piecewise-condition-otherwise = در غیر او صورت


## Chemistry
##
## The element tables are absent on purpose; see the header. What is here is
## the frames around a name, which need no nomenclature.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = نشانِ کیمیاویِ نادرست
chemistry-invalid-ionic-compound = ترکیبِ آیونیِ نادرست


## Inputs embedded in math

math-embedded-input-blank = خالی
math-embedded-input-blank-ordinal = خالیِ { $ordinal } از { $total }
