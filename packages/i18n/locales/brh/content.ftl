# Brahui (براہوئی) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in, not the reader's interface language.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and direction: Perso-Arabic, right to left**, on the Urdu letter
# inventory as Brahui is printed in Quetta. `chrome.ftl` states the convention
# in full, including why the case clitics are written as separate words in all
# four files of this locale. Nothing about the file format changes for a
# right-to-left catalog: logical order, no hand-placed bidi controls, Latin
# digits.
#
# ## Word order
#
# **Every modifier comes before the noun**, in English's own order: «دبیز سرخ
# خط» is *thick red line*, width first, then the dash pattern, then the colour.
# Brahui is Dravidian and rigidly head-final, so `style-stroke`,
# `style-with-noun` and `style-filled-with-noun` all keep English's sequence of
# placeables rather than reversing it. What does move is everything English
# puts *in front* of a value: Brahui has no prepositions at all, only case
# clitics and postpositions, so «تون» (*with*) and «ٹی» (*in, on*) follow the
# value they govern and the composition messages below put them after the
# placeable.
#
# **`[noun-tail]` is unused.** `noun-regular-polygon` fills `head` with
# «{ $numSides } ضلعی باقاعدہ کثیر الاضلاع» and leaves `tail` empty, as English
# does: a numeral and its classifier-like modifier stand in front of the noun
# in Brahui, so nothing has to be split around the adjectives. The `-tail`
# variants of the two composition messages are still written out, because that
# is what a partly-translated locale falls back to.
#
# ## Gender, role and number
#
# **No `$gender` fork and no `$role` fork, and neither is a gap.** Brahui has
# **no grammatical gender** — this is a Dravidian language, and it does not
# even have the animate/inanimate concord some of its relatives do in the
# plural — and an attributive modifier in front of a noun is **completely
# invariable**: it takes no ending for gender, for number or for the case of
# the phrase it sits in, because the case clitic lands on the last word of the
# whole noun phrase rather than on each modifier. So `noun-gender` answers the
# single token `neuter`, no adjective selects on anything, and the four `$role`
# positions render identically.
#
# That is worth saying beside `locales/skr`, which is seeded in the same batch,
# in the same script, in the same direction, in a district next door — and
# which *does* inflect its adjectives for gender and records not forking as a
# gap. Two right-to-left Perso-Arabic catalogs from neighbouring valleys, one
# with a recorded gap and one with a genuine answer. **Direction is not a
# language family, and neither is a region.**
#
# It also disposes of the affix problem without any work. A Brahui case ending
# would land on the *noun*, which arrives as `{ $noun }` — but nothing here
# needs one: every position these phrases go into is one this catalog writes
# the frame for, and the frames use the free-standing «تون» and «ٹی» rather
# than a bound ending. Nothing in this file is welded to a placeable.
#
# **Nothing selects on a count.** A Brahui noun after a numeral stays unmarked,
# and CLDR has no plural data for `brh` in any case.
#
# ## The chemistry tables are deliberately absent
#
# `element-name` and `element-anion-name` are the only English keys this file
# does not cover. Brahui is not a medium of instruction for science anywhere —
# chemistry in Balochistan is taught in Urdu and English — so a Brahui-speaking
# pupil meets the periodic table in one of those two, and there is no settled
# Brahui list of the hundred and eighteen elements to check a translation
# against. Recording that is the honest answer; transliterating Urdu into
# Brahui spelling and calling it a nomenclature is not. `lint:i18n` reports the
# two keys as missing coverage and that report is correct.
# `ion-name-oxidation-state` and the two invalid-symbol messages **are**
# covered: they are frames and punctuation, not vocabulary.
#
# ## Where this seed leans on Balochi and Urdu
#
# Hard, and the header of `chrome.ftl` says so at length. The colour words and
# the whole geometry vocabulary below — مثلث، مستطیل، مربع، دائرہ، شعاع،
# منحنی، معین، کثیر الاضلاع — are Balochi and Urdu loans, which is what a
# Brahui-speaking pupil reads, and Brahui's own colour terms are the first
# thing a speaker should restore here. What is genuinely Brahui in this file is
# its **shape**: the head-final order, the invariable modifier, the case
# clitics «نا», «ٹی», «آن», «کے» and the comitative «تون», the copula «اے» and
# its negative «اف», and a handful of everyday words — «اسٹ» for *one*, «ایرا»
# for *two*, «کار» for a task, «راست» and «دروگ» for the boolean pair.


## Style vocabulary
##
## Every word here is invariable, and that is a fact about Brahui rather than a
## choice about which words to write: a Brahui attributive modifier does not
## inflect for anything.

color =
    .black = سیاہ
    .white = سفید
    .gray = خاکی
    .red = سرخ
    .orange = نارنجی
    .yellow = زرد
    .green = سبز
    .cyan = فیروزی
    .blue = کبود
    .purple = بنفشی
    .pink = گلابی
    .brown = خرمائی
line-width =
    .thick = دبیز
    .thin = باریک
line-style =
    .dashed = خط چین
    .dotted = نقطہ چین
# Noun phrases rather than modifiers: every place a fill pattern is put, it
# stands in front of the comitative «تون», so these are written as they are
# wanted there.
fill-style =
    .horizontal = افقی خط
    .vertical = عمودی خط
    .diagonal = مائل خط
    .backdiagonal = برعکس مائل خط
    .dots = نقطہ
    .diamonds = معین
noun =
    .line = خط
    .line-segment = قطعہ خط
    .ray = شعاع
    .vector = ویکٹر
    .curve = منحنی
    .function = فنکشن
    .slope-field = میلان نا میدان
    .vector-field = ویکٹر نا میدان
    .parabola = پیرابولا
    .polyline = چند خط
    .polygon = کثیر الاضلاع
    .triangle = مثلث
    .rectangle = مستطیل
    .circle = دائرہ
    .region = علاقہ
    .point = نقطہ
    .square = مربع
    .diamond = معین
    .cross = کراس
    .plus = جمع نا نشان
# «ضلعی» is invariable, like everything else in front of a Brahui noun, so the
# side count stands with the other modifiers and there is nothing to split off
# into a tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } ضلعی باقاعدہ کثیر الاضلاع
    }
# Brahui has no grammatical gender. The token is defined anyway rather than
# left to fall back, so that this catalog says so on purpose.
noun-gender = neuter


## Style composition
##
## English's own order of placeables, kept rather than reversed — Brahui is
## head-final and puts its modifiers in front of the noun as well. What moves
## is everything English writes in front of a value: Brahui has no
## prepositions, so «تون» and «ٹی» follow what they govern.

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
# «پر» — full — against «تہی» below, which is how a filled shape is set against
# a hollow one here. Invariable, so it takes no branch.
style-filled-word = پر
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern } تون
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern } تون
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern } تون
       *[plain] { $filled } { $color } { $noun }
    }
# «تون» is the comitative clitic and follows what it governs, so the border and
# its modifiers come first. Brahui has no article, so the two `-article`
# branches read as their plain counterparts do; they are kept apart because the
# distinction belongs to the English message rather than to this one.
style-border-clause =
    { $parts ->
        [with-article] { $border } کنارہ تون
        [and] او { $border } کنارہ تون
        [and-article] او { $border } کنارہ تون
       *[with] { $border } کنارہ تون
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = تہی
style-text =
    { $parts ->
        [background] { $background } پشت زمین ٹی { $color }
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

answer-submit-label = کار نا چک کننگ
answer-submit-label-no-correctness = جواب نا دیہنگ


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
##
## «آن» is the ablative clitic — *out of* — and follows what it governs, so the
## total comes first and the page label and its number follow. That is the
## reverse of English's order and a fact about Brahui rather than a slip.

paginator-previous = پیشی
paginator-next = رندی
paginator-page = صفحہ
paginator-page-status = { $numPages } آن { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = یا
piecewise-condition-if = اگر
piecewise-condition-otherwise = ورنہ


## Chemistry
##
## The element tables are absent on purpose; see the header. What is here is
## the frames around a name, which need no nomenclature.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = غلط کیمیائی نشان
chemistry-invalid-ionic-compound = غلط آئونی ترکیب


## Inputs embedded in math

math-embedded-input-blank = تہی
math-embedded-input-blank-ordinal = { $total } آن تہی { $ordinal }
