# Bini content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Bini/Edo (Edoid, Niger-Congo, Volta-Niger) sits beside Yoruba (Defoid) under
# the same Volta-Niger branch, but is a distinct primary branch from it, not a
# close relative. Like Yoruba, Edo has no grammatical gender and no noun-class
# agreement: its handful of true adjectives, and the stative verbs that do most
# of the describing work («ọ maan» — "it is good" — rather than an agreeing
# word), never change shape for the noun beside them. `$gender` and `$role`
# therefore go unused here exactly as they do in Yoruba's catalog and in
# English — every noun answers the same way and nothing selects on it.
#
# `noun-gender = neuter` below is the concrete instance: it is the value every
# noun in this style pipeline receives, and it is never branched on because
# there is nothing in Edo grammar it could feed.
#
# Adjectives *follow* the noun they modify, as in Yoruba: «ẹfẹ ọbara nọ
# gbanhọn» reads roughly "line red that-is-thick" rather than English's
# "thick red line", so the composition messages below put the noun first.
#
# Intl.PluralRules('bin') reports two categories, `one` and `other` — unlike
# Yoruba, which has a single category and can drop `[one]` selection
# entirely. Most plural forks in this file are style-composition messages
# that do not count anything and so stay unforked either way, but any
# countable message elsewhere in the catalogs (see `attempts-remaining` in
# `chrome.ftl`) genuinely needs both branches here. A bare Edo noun itself is
# still not inflected for number next to a numeral — «akoto { $count } }» —
# only the surrounding wording forks.
#
# Chemistry: this catalog leaves `element-name` and `element-anion-name` out,
# so those 130 keys fall back to English, following the same precedent as
# Hausa's and Yoruba's headers in this batch (`locales/ha/content.ftl`,
# `locales/yo/content.ftl`). Secondary-school science in Edo State, as
# elsewhere in Nigeria, is taught in English, and Edo terminology work has not
# settled a classroom list of element names — the English a student meets in
# their own textbook is what the fallback already gives them.
#
# Bini has no settled digital/UI vocabulary this seed can draw on for newer
# technical nouns (a "variant", "credit", "accessibility report" and the
# like). Where no confident native word is available, this catalog uses an
# English loanword written in ordinary Latin spelling, as such words are
# actually said in Benin City speech, rather than inventing a coinage a
# fluent speaker did not choose. A reviewer is expected to replace many of
# these with a settled native term.


## Style vocabulary

color =
    .black = ọbibi
    .white = ọfuan
    .gray = ọsalọ
    .red = ọbara
    .orange = orenji
    .yellow = yẹlo
    .green = girini
    .cyan = sayan
    .blue = bulu
    .purple = papulu
    .pink = pinki
    .brown = braun
line-width =
    .thick = gbanhọn
    .thin = fiofio
line-style =
    .dashed = ni ẹmiẹmi
    .dotted = ni akoto akoto
# Noun phrases: they follow the shape being described and modify nothing.
fill-style =
    .horizontal = efe nọ dẹbeghe
    .vertical = efe nọ dowẹẹ
    .diagonal = efe nọ gbayie
    .backdiagonal = efe nọ gbayie fiegbe
    .dots = akoto
    .diamonds = ayamọni
noun =
    .line = ẹfẹ
    .line-segment = ọya ẹfẹ
    .ray = ọfa
    .vector = fẹkto
    .curve = ẹfẹ nọ gbayie
    .function = ọsẹ
    .parabola = parabola
    .polyline = ẹfẹ ọbọkiọkiọ
    .polygon = ọtọ ọbọkiọkiọ
    .triangle = ọtọ ọsan
    .rectangle = ọtọ ọna nẹẹn
    .circle = obiribiti
    .region = ẹkiọ
    .point = akoto
    .square = ọtọ ọnẹnẹn dọgbanhi
    .diamond = ayamọni
    .cross = ekpogho
    .plus = ọfa ẹkọ
# The side count follows in the tail, behind the description, as Yoruba does:
# «ọtọ ọbọkiọkiọ dọgbanhi ọtọ 5», keeping «ọtọ» beside the numeral counting it
# rather than separating them to hold a fixed English word order.
noun-regular-polygon =
    { $part ->
        [tail] ọtọ { $numSides }
       *[head] ọtọ ọbọkiọkiọ dọgbanhi
    }
# Edo has no grammatical gender, so every noun answers the same way and the
# answer goes unused — as in English and Yoruba.
noun-gender = neuter

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
# The noun leads and its description follows: «ẹfẹ gbanhọn ni ẹmiẹmi ọbara».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = nọ vbe ẹgua
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } kevbe { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } kevbe { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } kevbe { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «kevbe ọya ẹfẹ ọbara nọ gbanhọn» — "and a thick red border".
style-border-clause =
    { $parts ->
        [with-article] kevbe ọya ẹfẹ { $border }
        [and] kevbe ọya ẹfẹ { $border }
        [and-article] kevbe ọya ẹfẹ { $border }
       *[with] kevbe ọya ẹfẹ { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = nọ i vbe ẹgua
style-text =
    { $parts ->
        [background] { $color } vbe ugbo { $background }
       *[plain] { $color }
    }
style-background-none = i rre

## Boolean words

boolean-true = true
boolean-false = false

## Answer buttons

answer-submit-label = Miẹn Ọsẹ
answer-submit-label-no-correctness = Rhie Ọre

## Sectional blocks

section-name =
    .activity = Ọsẹ
    .aside = Ọya Odaro
    .cascade = Ẹsẹsẹbe
    .definition = Ẹmwẹ
    .example = Ẹfẹnkọ
    .exercise = Ẹkoẹkoẹko
    .exercises = Ẹkoẹkoẹko
    .given-answer = Ọre
    .note = Ọtọ
    .objectives = Emwin nọ gha ye ọna
    .paragraphs = Igbe Ẹmwẹ
    .part = Owa
    .problem = Ekhọe
    .problems = Ekhọe
    .proof = Igiemwi
    .question = Odee
    .section = Owa
    .solution = Ọre nọ Gbaroko
    .task = Ọsẹ
    .theorem = Emwẹ nọ Gbaroko
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Ọtọ

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tebulu { $enumeration }
        [numbered-title] Tebulu { $enumeration }{ ": " }
        [unnumbered-title] Tebulu{ ": " }
       *[unnumbered] Tebulu
    }
figure-name =
    { $parts ->
        [numbered] Owanrẹn { $enumeration }
        [numbered-caption] Owanrẹn { $enumeration }{ ": " }
        [unnumbered-caption] Owanrẹn{ ": " }
       *[unnumbered] Owanrẹn
    }

## Paginator controls

paginator-previous = Ọni
paginator-next = Ọvbehe
paginator-page = Ọwagbe
paginator-page-status = { $pageLabel } { $currentPage } vbe { $numPages }

## Piecewise functions

piecewise-condition-or = yana
piecewise-condition-if = deghẹ
piecewise-condition-otherwise = deghẹ ọvbehe

## Chemistry


#
# Bini leaves `element-name` and `element-anion-name` out, following the same
# Nigerian-education reasoning `locales/ha` and `locales/yo` document: see this
# file's header.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Uni Kemisiti nọ i maan
chemistry-invalid-ionic-compound = Emwin Ayọni nọ i maan
