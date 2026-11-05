# Mende content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `men` is Mende, a Mande language of southern and eastern Sierra Leone and one
# of the country's two large regional languages. It is the third Sierra Leonean
# catalog here, after `locales/kri` and `locales/tem` in #1686, and the three
# together are that country's usual three-way answer: a creole everyone shares
# and two regional languages that share almost nothing with it or each other.
#
# **This catalog is the clearest instance of the affix rule in the tree, and it
# is the reason to read it.** Mende's definite marker is a suffix «-i» that
# fuses with the final vowel of the word it lands on, and it attaches not to the
# noun but to **whichever word ends the noun phrase**:
#
#   pɛlɛ           a house          pɛlɛi          the house
#   pɛlɛ wa        a big house      pɛlɛ wai       the big house
#   pɛlɛ wa teli   a big black one  pɛlɛ wa telii  the big black one
#
# A describing word follows its noun here, so a style description *ends* in a
# describing word — and in this catalog that word is almost always a placeable.
# «{ $color }i» is exactly what
# [An affix cannot be welded to a placeable](../../README.md) forbids: Fluent
# would render the suffix as literal text against whatever the argument
# happened to be, and the argument is a whole phrase in most branches anyway.
#
# **So every describing word here is indefinite**, which is the README's
# "choose the words that land there" way out, taken at the level of the whole
# file rather than of one message: no description ends in the suffix, and the
# suffix is never written against a placeable. That is not a workaround dressed
# up as a decision: a style description is read out of context — "thick red
# line", not "the thick red line" — and the indefinite is what Mende uses
# there. A speaker who thinks a particular message wants the definite should
# say so on #1521 rather than adding the suffix here, because the message that
# wants it is the one whose final word is an argument.
#
# The rule is about where the suffix *lands*, not about the letter: a few fixed
# vocabulary items carry it lexically — «tɔkpɔi» a mark, «laingi ti lɔ va» the
# horizontal fill — and they are safe because the suffix sits inside a phrase
# this file writes out, never at the boundary of an argument. A speaker
# deciding «tɔkpɔ» is wanted there instead should say so on #1521.
#
# **`$gender` goes unused.** Mande languages have no noun class, and Mende is
# no exception — which is worth saying explicitly, because `locales/mnk`,
# `locales/bm` and `locales/dyu` are the other three Mande catalogs here and
# none of them forks either. Four Mande catalogs, four flat `noun-gender`
# messages: that is a family predicting something about agreement for once,
# and it is the only family in this repository that does.
#
# `$role` goes unused too: Mende marks no case.
#
# The geometry leans on the English loans Sierra Leonean schooling supplies —
# the same ministry `locales/kri` and `locales/tem` record — with Mende words
# where they are solid: «ndɔlɔ» a place, «tɔkpɔi» a mark. They are the first
# thing to check.


## Style vocabulary

color =
    .black = teli
    .white = kɔlɛ
    .gray = ndabu
    .red = kpou
    .orange = ɔrenji
    .yellow = yɛlo
    .green = grin
    .cyan = sayan
    .blue = blu
    .purple = pɔpul
    .pink = pink
    .brown = braun
line-width =
    .thick = wa
    .thin = kulɔ
# Written as «kɛ …» phrases rather than as bare qualifiers, so that they close
# the description. `style-stroke` puts them last.
line-style =
    .dashed = kɛ ngeya-ngeya
    .dotted = kɛ tɔkpɔ-tɔkpɔ
fill-style =
    .horizontal = laingi ti lɔ va
    .vertical = laingi ti lɔ lɔlɔ
    .diagonal = laingi ti lɔ kpandi
    .backdiagonal = laingi ti lɔ kpandi na gbe wu
    .dots = tɔkpɔ
    .diamonds = dayamɔn
noun =
    .line = laing
    .line-segment = laing gbua
    .ray = re
    .vector = vɛkta
    .curve = laing kpandi
    .function = fɔnkshɔn
    .parabola = parabola
    .polyline = laing gbua gbotoma
    .polygon = pɔligɔn
    .triangle = trayangul
    .rectangle = rɛktangul
    .circle = kolɔ
    .region = ndɔlɔ
    .point = tɔkpɔi
    .square = skwea
    .diamond = dayamɔn
    .cross = krɔs
    .plus = plɔs tɔkpɔi
# The side count is a relative and closes the noun phrase behind the describing
# words, so it goes in the tail. It is also the one place the definite would
# have been least awkward — the tail ends in a numeral rather than in a
# describing word — and it is still left indefinite, so that the file has one
# rule rather than an exception a reader has to learn.
noun-regular-polygon =
    { $part ->
        [tail] na kɛ gbua { $numSides }
       *[head] pɔligɔn yekpe
    }
# Mende has no noun class and no gender, so every noun answers the same and the
# answer goes unused — the shape `locales/mnk`, `locales/bm` and `locales/dyu`
# have, and for the same reason.
noun-gender = yila

## Style composition

# The dash pattern is a «kɛ …» phrase and closes the description, so it moves
# behind the colour rather than sitting between the width and it.
style-stroke =
    { $parts ->
        [width-style-color] { $width } { $color } { $lineStyle }
        [width-color] { $width } { $color }
        [style-color] { $color } { $lineStyle }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
# The noun leads and the describing words follow, which is what puts a
# placeable at the end of the phrase and keeps the definite suffix out of this
# file. See the header.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = gbuani
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } kɛ { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } kɛ { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } kɛ { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «ngɔwu» is the border and leads its own describing words. Mende has no
# article and joins this clause with the invariable «kɛ», so all four branches
# read alike.
style-border-clause =
    { $parts ->
        [with-article] kɛ ngɔwu { $border }
        [and] kɛ ngɔwu { $border }
        [and-article] kɛ ngɔwu { $border }
       *[with] kɛ ngɔwu { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = ii gbuani
style-text =
    { $parts ->
        [background] { $color } kɛ woma { $background }
       *[plain] { $color }
    }
style-background-none = hama gbi ii lɔ

## Boolean words

boolean-true = tonya
boolean-false = ngunya

## Answer buttons

answer-submit-label = Gbɔɔ Yenge
answer-submit-label-no-correctness = Ve Njepei

## Sectional blocks

section-name =
    .activity = Yenge
    .aside = Njepe gbe
    .cascade = Kasked
    .definition = Hugɔɔla
    .example = Kɛlɛma
    .exercise = Yenge hu gɔɔla
    .exercises = Yenge hu gɔɔla nasia
    .given-answer = Njepei
    .note = Nyɛingɔ
    .objectives = Hindeisia ti wote
    .paragraphs = Njepe gbuasia
    .part = Gbua
    .problem = Hinda
    .problems = Hindeisia
    .proof = Gɔɔla
    .question = Mɔli
    .section = Gbua
    .solution = Hinda gulɔla
    .task = Yenge
    .theorem = Tiɔrɛm
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Ngiti

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tebul { $enumeration }
        [numbered-title] Tebul { $enumeration }{ ": " }
        [unnumbered-title] Tebul{ ": " }
       *[unnumbered] Tebul
    }
figure-name =
    { $parts ->
        [numbered] Kɛlɛma { $enumeration }
        [numbered-caption] Kɛlɛma { $enumeration }{ ": " }
        [unnumbered-caption] Kɛlɛma{ ": " }
       *[unnumbered] Kɛlɛma
    }

## Paginator controls

paginator-previous = Na wa ma
paginator-next = Na wa woma
paginator-page = Pej
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = ɔɔ
piecewise-condition-if = ina
piecewise-condition-otherwise = hinda gbi hu na

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Sierra Leone teaches secondary science in English,
## so a Mende speaker meets the periodic table there and the fallback *is* the
## curriculum — the same answer `locales/kri` and `locales/tem` give from the
## same ministry.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Kɛmistri Tɔkpɔi Ii Tonya
chemistry-invalid-ionic-compound = Ayɔn Gbɔɔla Ii Tonya
