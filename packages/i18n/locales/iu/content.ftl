# Inuktitut (ᐃᓄᒃᑎᑐᑦ) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in. Translated from `locales/en/content.ftl`, which is the source of
# truth.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Canadian Aboriginal syllabics, the Nunavut standard. The
# **Latin qaliujaaqpait orthography is not mixed in**: every Inuktitut word
# below is in syllabics, and the roman letters that appear are DoenetML
# source. ᙱ (U+1671) is the doubled *nng* and is not ᖏ (U+158F); ᕼ (U+157C) is
# the Inuktitut *h* and is not the Cree final ᐦ (U+1426). `chrome.ftl` sets
# the series and the finals out in full.
#
# **Number.** `iu` selects **one**, **two** and **other** — Inuktitut has a
# real dual. Nothing in this file selects on a count, so no plural branch
# appears here; `chrome.ftl` and `editor.ftl` carry them, and `chrome.ftl`
# explains the dual.
#
# **Word order.** Inuktitut is the reverse of English here. A describing word
# is a verb — «ᐊᐅᐸᖅᑐᖅ» is *it is red*, not *red* — and it **follows** what it
# describes. So every composition message below puts `{ $noun }` first and the
# description after it, where English puts the description first.
#
# **What is left out, and why.**
#
#   * **`noun` is omitted entirely.** Inuktitut has no settled published set
#     of geometry names — line segment, ray, slope field, polyline, parabola —
#     and coining twenty of them in syllabics is exactly what this seed must
#     not do. The composition frames below are still translated, so a
#     partly-covered document reads in Inuktitut word order with the English
#     shape name in it.
#   * **`line-width`, `line-style`, `fill-style`** — same reason: no settled
#     words for thick against thin, dashed against dotted, or the six hatch
#     patterns.
#   * **`color` keeps five of twelve.** Inuktitut does not partition the
#     spectrum where English does, and «ᑐᖑᔪᖅᑐᖅ» covers what English splits
#     into blue and green. It is written here as `.blue` only, and `.green` is
#     **left out** rather than given a second guess at the same stem. `.gray`,
#     `.orange`, `.cyan`, `.purple` and `.pink` are left out for the same
#     reason: there is no settled term to reproduce.
#   * **`element-name` and `element-anion-name` are omitted entirely.**
#     Science is schooled in Nunavut in English, and there is no published
#     Inuktitut set of all 118 element names.
#   * **`table-name`** — the word for a data table is not settled; `<figure>`
#     is, and «ᑎᑎᖅᑐᒐᖅ» is written for it.
#   * **`piecewise-condition-if` and `-otherwise`** — Inuktitut marks a
#     condition with a verb mood, not with a word that stands alone in front
#     of an equation. «ᐅᕝᕙᓘᓐᓃᑦ» for *or* is a real word and is kept.


## Style vocabulary

color =
    .black = ᕿᕐᓂᖅᑐᖅ
    .white = ᖃᑯᖅᑕᖅ
    .red = ᐊᐅᐸᖅᑐᖅ
    .yellow = ᖁᖅᓲᖅᑐᖅ
    .blue = ᑐᖑᔪᖅᑐᖅ
    .brown = ᑲᔪᖅᑐᖅ

noun-gender = neuter


## Style composition
##
## `{ $noun }` leads and the description follows it, which is Inuktitut order
## and the reverse of English.

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
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }

style-filled-word = ᐃᒪᖃᖅᑐᖅ

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = ᐃᒪᖃᙱᑦᑐᖅ

style-background-none = ᐱᖃᙱᑦᑐᖅ


## Boolean words

boolean-true = ᓱᓕᔪᖅ
boolean-false = ᓱᓕᙱᑦᑐᖅ


## Answer buttons

answer-submit-label = ᖃᐅᔨᓴᕐᓗᒍ
answer-submit-label-no-correctness = ᑭᐅᔾᔪᑎ ᐊᐅᓪᓚᖅᑎᓪᓗᒍ


## Sectional blocks

section-name =
    .activity = ᐱᓕᕆᐊᖅ
    .definition = ᑐᑭᖓ
    .exercise = ᐆᒃᑐᕐᓂᖅ
    .exercises = ᐆᒃᑐᕐᓃᑦ
    .given-answer = ᑭᐅᔾᔪᑎ
    .objectives = ᑐᕌᒐᐃᑦ
    .problem = ᐊᒃᓱᕈᕐᓇᖅᑐᖅ
    .problems = ᐊᒃᓱᕈᕐᓇᖅᑐᑦ
    .question = ᐊᐱᖅᑯᑦ
    .section = ᐃᓚᖓ
    .task = ᐱᓕᕆᐊᒃᓴᖅ

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = ᐃᑲᔫᑦ


## Tables and figures

figure-name =
    { $parts ->
        [numbered] ᑎᑎᖅᑐᒐᖅ { $enumeration }
        [numbered-caption] ᑎᑎᖅᑐᒐᖅ { $enumeration }{ ": " }
        [unnumbered-caption] ᑎᑎᖅᑐᒐᖅ{ ": " }
       *[unnumbered] ᑎᑎᖅᑐᒐᖅ
    }


## Paginator controls
##
## "3 of 5" would be a case ending on `{ $numPages }` in Inuktitut, and an
## ending cannot be welded onto a placeable, so the status is written with a
## stroke between the two counts instead of with a word.

paginator-previous = ᓯᕗᓪᓕᖅ
paginator-next = ᑭᖑᓪᓕᖅ
paginator-page = ᒪᒃᐱᒐᖅ
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = ᐅᕝᕙᓘᓐᓃᑦ


## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })


## Inputs embedded in math

math-embedded-input-blank = ᐃᒪᖃᙱᑦᑐᖅ
math-embedded-input-blank-ordinal = ᐃᒪᖃᙱᑦᑐᖅ { $ordinal } / { $total }
