# Balochi (بلوچی) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in, not the reader's interface language.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Which Balochi, and in what letters.** Southern Balochi as written in
# Pakistan, in the Perso-Arabic script on the Urdu letter inventory — `ٹ ڈ ڑ`
# for the retroflexes, `ے` for final *ē*, `ہ` rather than `ه`. Right to left.
# The Iranian Balochi orthography is a different convention and must not be
# mixed into these files. See `chrome.ftl` for the full statement, and the
# Direction section of the README for what a right-to-left catalog does and
# does not change: nothing about the file format, and digits stay Latin.
#
# **Word order: the modifier comes FIRST, and it carries the attributive
# `-ēn`.** «سہریں خط» is *a red line*; «ستبریں سہریں خط» is *a thick red line*.
# This is where Balochi parts company with the Persian beside it, and it is the
# single most important thing in this file: Balochi does not build these
# phrases with an ezafe on the noun the way `locales/fa`, `locales/haz` and
# `locales/ckb` do. A Persian-style ezafe construction does exist in Balochi —
# it is commonest in the Eastern varieties and in a literary register — but the
# native attributive order is prenominal, and this catalog writes only that.
# **A corrector who prefers the ezafe must convert the whole file, not one
# message.**
#
# That decision also disposes of the problem every ezafe catalog in the roster
# has to work around. The `-ēn` suffix sits on the **adjective**, which this
# catalog writes out itself, never on the noun, which arrives as `{ $noun }` —
# a value the catalog never sees. So **nothing here is welded to a placeable**,
# and the composition messages below keep English's own order rather than
# reversing it. The one thing an author's own `markerStyleWord` loses is the
# suffix on *itself*, which it would lose in any arrangement.
#
# **Gender: none.** Balochi has no grammatical gender. `noun-gender` answers a
# single token, defined on purpose so that this catalog says so rather than
# falling back, and no adjective forks on `$gender`. `$role` goes unused as
# well: `-ēn` does not change shape by position, and every preposition these
# phrases sit behind — «گون» — is one this catalog writes itself.
#
# **Number.** A Balochi noun after a numeral stays unmarked, so no message
# here selects on a count. See the plural note in `chrome.ftl` for what CLDR
# does and does not give this tag.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the only English keys this file does not cover.
# Balochi is not a medium of instruction for science: chemistry in Pakistan is
# taught in Urdu and English, and in Iran in Persian, so a Balochi-speaking
# pupil meets the periodic table in one of those three and not in Balochi.
# There is no settled Balochi list of the hundred and eighteen elements to
# check a translation against, and the sensible answer is to record that rather
# than to transliterate Urdu into Balochi spelling and call it a nomenclature.
# `lint:i18n` reports the two keys as missing coverage, and that report is
# correct. `ion-name-oxidation-state` and the two invalid-symbol messages
# **are** covered: they are frames and punctuation, not vocabulary.
#
# **Loans kept.** The geometry and style vocabulary here is the Perso-Arabic
# mathematical vocabulary Balochi shares with Urdu and Persian — `مثلث`,
# `مستطیل`, `مربع`, `دائرہ`, `شعاع`, `فنکشن`, `ویکٹر`, `پیرابولا`, `افقی`,
# `عمودی`, `آئیونی`, `ترکیب` — which is what a Balochi-speaking pupil actually
# reads. Where a genuinely Balochi word exists this file uses it: «رہشون» for
# *hint*, «بہر» for *section*, «پرس» for *question*, «کار» for *task*,
# «راست»/«دروگ» for the boolean words.


## Style vocabulary
##
## Every word here is written in its attributive form, with `-ēن` on it,
## because every position it lands in is prenominal. Nothing forks.

# Balochi shares its colour words with Persian and Urdu above the basic set.
# Cyan has no settled word, so «فیروزی» — turquoise — stands for it; that is a
# colour boundary the style pipeline draws where the language does not.
color =
    .black = سیاہیں
    .white = سپیتیں
    .gray = خاکیں
    .red = سہریں
    .orange = نارنجیں
    .yellow = زردیں
    .green = سبزیں
    .cyan = فیروزیں
    .blue = کبودیں
    .purple = بنفشیں
    .pink = گلابیں
    .brown = خرمائیں
line-width =
    .thick = ستبریں
    .thin = باریکیں
line-style =
    .dashed = خط چینیں
    .dotted = نقطہ چینیں
# Noun phrases rather than adjectives: all four uses stand behind «گون», so
# these are written as they are wanted there.
fill-style =
    .horizontal = افقی خط
    .vertical = عمودی خط
    .diagonal = مائلیں خط
    .backdiagonal = برعکسیں مائلیں خط
    .dots = نقطہ
    .diamonds = الماس
noun =
    .line = خط
    .line-segment = قطعہ خط
    .ray = شعاع
    .vector = ویکٹر
    .curve = خم
    .function = فنکشن
    .slope-field = میلان ءِ میدان
    .vector-field = ویکٹر ءِ میدان
    .parabola = پیرابولا
    .polyline = چند خط
    .polygon = چند پہلو
    .triangle = مثلث
    .rectangle = مستطیل
    .circle = دائرہ
    .region = علاقہ
    .point = نقطہ
    .square = مربع
    .diamond = الماس
    .cross = کراس
    .plus = جمع ءِ نشان
# The side count follows the whole phrase rather than sitting inside the noun,
# so that the prenominal modifiers stay against the word they describe:
# «ستبریں سہریں باقاعدہ چند پہلو گون 5 پہلوان». Balochi counts with an
# unmarked noun, so nothing here agrees with the count.
noun-regular-polygon =
    { $part ->
        [tail] گون { $numSides } پہلوان
       *[head] باقاعدہ چند پہلو
    }
# Balochi has no grammatical gender. The token is defined anyway rather than
# left to fall back, so that this catalog says so on purpose.
noun-gender = neuter


## Style composition
##
## English's own order, kept rather than reversed: Balochi puts its modifiers
## in front of the noun too, and the `-ēن` they carry was written into the
## words above.

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
# «پُریں» — full — against «تہی» below, which is how Balochi says a shape is
# filled rather than hollow.
style-filled-word = پُریں
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } گون { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } گون { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } گون { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# Balochi has no indefinite article, and the indefinite `-ē` on «کنارے» does
# the work English's "a" does. The two `-article` branches therefore say what
# their plain counterparts do; they are kept apart because the distinction
# belongs to the English message rather than to this one.
style-border-clause =
    { $parts ->
        [with-article] گون { $border } کنارے
        [and] ءُ { $border } کنار
        [and-article] ءُ { $border } کنارے
       *[with] گون { $border } کنار
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = تہی
style-text =
    { $parts ->
        [background] { $color } گون { $background } پشت زمینے
       *[plain] { $color }
    }
style-background-none = ہچ


## Boolean words
##
## What a `<boolean>` displays. `true` and `false` as an author writes them in
## the source stay English; only these two move.

boolean-true = راست
boolean-false = دروگ


## Answer buttons

answer-submit-label = کار ءَ چک کن
answer-submit-label-no-correctness = جواب ءَ روان کن


## Sectional blocks

section-name =
    .activity = سرگرمی
    .aside = حاشیہ
    .cascade = سلسلہ
    .definition = تعریف
    .example = مثال
    .exercise = مشق
    .exercises = مشق
    .given-answer = جواب
    .note = نوٹ
    .objectives = مقصد
    .paragraphs = پیراگراف
    .part = حصہ
    .problem = مسئلہ
    .problems = مسئلہ
    .proof = ثبوت
    .question = پرس
    .section = بہر
    .solution = حل
    .task = کار
    .theorem = قضیہ
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = رہشون


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
##
## The status is written with a slash rather than a word: `$pageLabel` may be
## the author's own word, and the Balochi «چه … ءَ» frame would have to sit on
## both sides of a value this catalog never sees.

paginator-previous = پیسری
paginator-next = رندی
paginator-page = صفحہ
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = یا
piecewise-condition-if = اگاں
piecewise-condition-otherwise = دگہ صورت ءَ


## Chemistry
##
## The element tables are absent on purpose; see the header. What is here is
## the frames around a name, which need no nomenclature.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = غلطیں کیمیائی نشان
chemistry-invalid-ionic-compound = غلطیں آئیونی ترکیب


## Inputs embedded in math

math-embedded-input-blank = خالی
math-embedded-input-blank-ordinal = چه { $total } ءَ خالی { $ordinal }
