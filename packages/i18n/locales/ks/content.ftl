# Kashmiri content catalog: the prose the core computes into the document.
# Selected by `documentLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Perso-Arabic** script, which is what CLDR fills a bare `ks`
# in as — `ks` maximizes to `ks-Arab-IN` — and what Kashmiri publishing and the
# Jammu and Kashmir Academy use. Kashmiri is also written in Devanagari and,
# historically, in Sharada; `ks-Deva` and `ks-Shrd` reach this catalog and get
# Perso-Arabic. The Devanagari orthography is in active use and a `ks-Deva`
# catalog beside this one is the right answer for it.
#
# **This is the roster's ninth right-to-left catalog.** Nothing about the file
# format changes: a pattern is a sequence of characters in *logical* order, and
# `dir` decides where each run is drawn, so nothing here is reordered by hand
# to look right in an editor. Brackets are written opening-first and the bidi
# algorithm turns them around at render time. Digits stay Latin, as everywhere
# in this repository. `directionOf` already answers `rtl` for `ks` from two
# directions at once — the Arabic script and the `RTL_LANGUAGES` entry — so
# `direction.ts` needed nothing.
#
# **The largest correction owed here is agreement, and this seed does not
# attempt it.** Kashmiri inflects an adjective for the noun's gender —
# «کرِہُن» against «کرٕہٕنؠ» — and every adjective below is written in the
# masculine citation form regardless of what it describes. `noun-gender` is
# filled in with the real genders even so, precisely so that a speaker adding
# the `$gender` fork has the table already and only has to write the feminine
# forms. That is a deliberate gap rather than a claim that Kashmiri does not
# agree.
#
# No `$role` fork: Kashmiri's clause positions here land on «کِنار» and
# «پؠٹھ بوٗن», words this catalog chooses, and the ergative and dative the
# language marks elsewhere are not reached by any of them.


## Style vocabulary

color =
    .black = کرِہُن
    .white = سفید
    .gray = خاکسٕتری
    .red = وۄزُل
    .orange = نارنٛجی
    .yellow = لؠدِر
    .green = سبز
    .cyan = آسمٲنی
    .blue = نیٖل
    .purple = بٲنٛگٕنی
    .pink = گُلٲبی
    .brown = بوٚر
line-width =
    .thick = تھۆل
    .thin = پتلٕ
line-style =
    .dashed = ٹوٗٹِتھ
    .dotted = نُختٕدار
fill-style =
    .horizontal = سیودٕ ریکھہ
    .vertical = کھڈٕ ریکھہ
    .diagonal = تِرچھہِ ریکھہ
    .backdiagonal = اُلٹہ تِرچھہِ ریکھہ
    .dots = نُختہٕ
    .diamonds = سمچتُربھُج
noun =
    .line = ریکھہ
    .line-segment = ریکھہ کھنٛڈ
    .ray = کِرَن
    .vector = سَدِش
    .curve = ژھۄکٕ ریکھہ
    .function = فَلَن
    .parabola = پَروَلَے
    .polyline = بہُریکھہ
    .polygon = بہُبھُج
    .triangle = ترِبھُج
    .rectangle = آیت
    .circle = دٲیرٕ
    .region = علاقہٕ
    .point = نُختہٕ
    .square = مُربہٕ
    .diamond = سمچتُربھُج
    .cross = ضَربُک نِشان
    .plus = جمٕعُک نِشان
# «-بھُجٕچ» is welded onto the count and has one shape whatever number lands in
# front of it, so the weld is sound in the way the affix rule allows. The
# adjectives precede the noun, so there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides }-بھُجٕچ باقاعدٕ بہُبھُج
    }
# Filled in for the sake of the `$gender` fork this catalog does not yet write;
# see the header. `$noun` may also be «regular-polygon» (بہُبھُج, m) or the head
# of a phrase the description does not name: «border» (کِنار, m), «fill»
# (بھرَن, m), «text» (مَتَن, m), «background» (پؠٹھ بوٗن, m).
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [polyline] f
        [curve] f
        [circle] f
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
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
style-filled-word = بھرِتھ
# «سٟتؠ» ("with") is a postposition and follows what it governs, so the pattern
# moves to the front of the phrase where English appends it.
style-filled =
    { $parts ->
        [pattern] { $pattern } سٟتؠ { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } سٟتؠ { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } سٟتؠ { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# Kashmiri has no article, so the two `-article` branches read like their
# neighbours; «تہٕ» is the conjunction and stands in front.
style-border-clause =
    { $parts ->
        [with-article] { $border } کِنار سٟتؠ
        [and] تہٕ { $border } کِنار سٟتؠ
        [and-article] تہٕ { $border } کِنار سٟتؠ
       *[with] { $border } کِنار سٟتؠ
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } سٟتؠ { $color } بھرَن
       *[plain] { $color } بھرَن
    }
style-unfilled = ناہ بھرِتھ
style-text =
    { $parts ->
        [background] { $background } پؠٹھ بوٗنس پؠٹھ { $color }
       *[plain] { $color }
    }
style-background-none = کہٕنٛہہ نہٕ

## Boolean words

boolean-true = سٔتؠ
boolean-false = ٲپُز

## Answer buttons

answer-submit-label = پرٛژھِو
answer-submit-label-no-correctness = جواب بیٖجِو

## Sectional blocks

section-name =
    .activity = کٲم
    .aside = کِنارُک نوٹ
    .cascade = سِلسِلہٕ
    .definition = تعریٖف
    .example = مِثال
    .exercise = مَشٕق
    .exercises = مَشٕق
    .given-answer = جواب
    .note = نوٹ
    .objectives = مقصد
    .paragraphs = پیراگراف
    .part = حِصہٕ
    .problem = مسٲلہٕ
    .problems = مسٲلہٕ
    .proof = ثبوٗت
    .question = سوال
    .section = حِصہٕ
    .solution = حَل
    .task = کٲم
    .theorem = مسٕلہٕ
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = اِشارٕ

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

paginator-previous = پَتٕم
paginator-next = بۆنٕم
paginator-page = صفحہٕ
# «X منٛز Y» — "Y of X" — puts the total first, so the two counts change
# places.
paginator-page-status = { $numPages } منٛز { $pageLabel } { $currentPage }

## Piecewise functions

piecewise-condition-or = یا
piecewise-condition-if = اگر
piecewise-condition-otherwise = نتہٕ

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Kashmiri is taught as a subject in Jammu and Kashmir and is the medium of
## nothing above the primary grades: secondary science is English- or
## Urdu-medium, so the periodic table reaches a Kashmiri-speaking student in
## one of those two. `locales/ur` carries the Urdu names, and it is the nearest
## parallel text for whoever fills this in — Kashmiri and Urdu share the script
## and much of the scientific vocabulary, and differ in the words for the
## substances known long before the elements were.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = غلط کیمیٲوی نِشان
chemistry-invalid-ionic-compound = غلط آیٕنِک مُرکب
