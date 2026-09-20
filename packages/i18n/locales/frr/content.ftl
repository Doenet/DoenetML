# Northern Frisian (Nordfriisk) content catalog, in the **Mooring** variety
# (Frasch, Bökingharde): the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script. **`frr` is a tag over a cluster of
# dialects, not one language with one spelling**: Mooring, Fering, Öömrang,
# Sölring, Halligfrasch and the Wiedingharder and Karrharder varieties each
# have their own orthography. This file is **Mooring** throughout, following
# the *Frasch-Tjüsch Uurdebök* (Sjölin, Århammar & Wilts, Nordfriisk Instituut)
# and the Mooring school grammar, because that is the variety with the fullest
# published dictionary and grammar. See `chrome.ftl` for the full note.
#
# **What is the language's own**: the copula «as» / «san», the negator «ai»,
# «nian» for *none*, «än» for *and*, «of» for *or*, «wan» for *if*, «oners»
# for *otherwise*, «wåår» / «falsch» for *true* / *false*, and the colour words
# — «suart», «wit», «gries», «rüüdj», «gääl», «green», «blä», «brün».
#
# **What is borrowed**: the geometry — «wektoor», «funktjoon», «parabel»,
# «sirkel», «kwadraat», «interwaal» — is German, respelled to Mooring, because
# German is the language a North Frisian pupil meets mathematics in. «struket»
# for *dashed* is a coinage on the Mooring noun «struk» (a stroke) and is the
# word a reviewer should check first.
#
# **Counts.** CLDR has **no plural data for `frr`**, so no plural category can
# be selected: there is **no** `[zero]`, `[one]`, `[two]`, `[few]` or `[many]`
# branch anywhere in this file. Nothing here counts, so nothing is lost.
#
# **Digits.** Every number renders in Latin digits.
#
# **Adjective order and agreement.** The attributive adjective goes **before**
# the noun, as in German and English: «en dik struket rüüdj line». **The
# adjectives in this catalog are invariant** — one form each, with no `$gender`
# and no `$role` branch — and that is a real fact about Mooring rather than a
# gap in the seed: in the indefinite singular, which is the shape every one of
# these descriptions has, the Mooring attributive adjective carries no ending
# at all, for either gender. Where Mooring *does* inflect is the definite and
# the plural («da rüüdje linen»), and no description built here is in either.
# `noun-gender` below therefore reports the real two-gender system — `c`
# (common, «di») and `n` (neuter, «dåt») — but nothing in this file currently
# selects on it. A reviewer who wants to add definite or plural forms has the
# mapping ready; do not delete it.
#
# Mooring has no case endings on adjectives either, so the four `$role`
# positions English distinguishes — standalone, border-clause,
# background-clause, text-clause — are all the same word here, and the `$role`
# argument goes unused exactly as it does in `locales/en`.
#
# **The periodic table is left to fall back to English.** `element-name` and
# `element-anion-name` are deliberately absent. There is no published Northern
# Frisian list of the 118 elements in any of its varieties, and there will not
# be one: chemistry in Nordfriesland is taught in Standard German out of
# Standard German textbooks, so the table a North Frisian pupil actually meets
# is `locales/de`'s, which is the parallel text a reviewer should copy from
# rather than have this seed invent Frisian element names nobody writes.


## Style vocabulary

color =
    .black = suart
    .white = wit
    .gray = gries
    .red = rüüdj
    .orange = oransch
    .yellow = gääl
    .green = green
    .cyan = sian
    .blue = blä
    .purple = püürpel
    .pink = roosa
    .brown = brün
line-width =
    .thick = dik
    .thin = dan
line-style =
    .dashed = struket
    .dotted = punktet
# Noun phrases following «ma», in the plural, which agree with nothing.
fill-style =
    .horizontal = woonrachte linen
    .vertical = loodrachte linen
    .diagonal = diagonaale linen
    .backdiagonal = juunsis diagonaale linen
    .dots = punkte
    .diamonds = ruude
noun =
    .line = line
    .line-segment = streek
    .ray = strool
    .vector = wektoor
    .curve = kurve
    .function = funktjoon
    .slope-field = stiginge-fialt
    .vector-field = wektoorfialt
    .parabola = parabel
    .polyline = streekentooch
    .polygon = föölkaant
    .triangle = träkaant
    .rectangle = rachtkaant
    .circle = sirkel
    .region = gebiit
    .point = punkt
    .square = kwadraat
    .diamond = ruude
    .cross = krüs
    .plus = plustiiken
# Like German, Mooring keeps the side count in front of the noun, so the whole
# thing is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regelmäisi { $numSides }-kaant
    }
# Mooring has two genders: common («di»), written `c`, and neuter («dåt»),
# written `n`. Nothing in this file selects on it today — the attributive
# adjectives above are invariant in the indefinite singular, which is the only
# shape these descriptions take — but the mapping is real and is here for the
# reviewer who adds definite or plural forms. Of the four heads the
# description never names, «kaant» (border), «fülang» (fill), «täkst» (text)
# and «aftergrünj» (background) are all common, which is what the default
# answers.
noun-gender =
    { $noun ->
        [slope-field] n
        [vector-field] n
        [region] n
        [square] n
        [cross] n
        [plus] n
       *[other] c
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
# The adjectives lead and the noun closes the phrase: «dik struket rüüdj line».
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
style-filled-word = füld
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ma { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } ma { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } ma { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «kaant» is the border. Mooring puts no case ending on an adjective, so the
# border's words are the same forms as everywhere else; only the article and
# the conjunction change between the four variants, which is exactly the
# distinction English draws.
style-border-clause =
    { $parts ->
        [with-article] ma en { $border } kaant
        [and] än { $border } kaant
        [and-article] än en { $border } kaant
       *[with] ma { $border } kaant
    }
# The fill-pattern words are plurals, because their other use is the
# «ma { $pattern }» clause in `style-filled`, so this message supplies
# «fülang» for the colour to hang off.
style-fill =
    { $parts ->
        [pattern] { $color } fülang ma { $pattern }
       *[plain] { $color } fülang
    }
style-unfilled = ai füld
style-text =
    { $parts ->
        [background] { $color } üüb en { $background } aftergrünj
       *[plain] { $color }
    }
style-background-none = nian

## Boolean words

boolean-true = wåår
boolean-false = falsch

## Answer buttons

answer-submit-label = Nååkiike
answer-submit-label-no-correctness = Aantwurd stjüüre

## Sectional blocks

section-name =
    .activity = Aktiwitäät
    .aside = Randbeemerking
    .cascade = Kaskade
    .definition = Definitjoon
    .example = Biispal
    .exercise = Üüwing
    .exercises = Üüwinge
    .given-answer = Aantwurd
    .note = Beemerking
    .objectives = Leermäler
    .paragraphs = Afsätse
    .part = Dial
    .problem = Apgoow
    .problems = Apgoowe
    .proof = Beewis
    .question = Frååge
    .section = Afsnit
    .solution = Lösang
    .task = Apgoow
    .theorem = Seets
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Tip

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabel { $enumeration }
        [numbered-title] Tabel { $enumeration }{ ": " }
        [unnumbered-title] Tabel{ ": " }
       *[unnumbered] Tabel
    }
figure-name =
    { $parts ->
        [numbered] Figuur { $enumeration }
        [numbered-caption] Figuur { $enumeration }{ ": " }
        [unnumbered-caption] Figuur{ ": " }
       *[unnumbered] Figuur
    }

## Paginator controls

paginator-previous = Tobääg
paginator-next = Widere
paginator-page = Sidj
paginator-page-status = { $pageLabel } { $currentPage } foon { $numPages }

## Piecewise functions

piecewise-condition-or = of
piecewise-condition-if = wan
piecewise-condition-otherwise = oners

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent: they fall
## back to English, and `locales/de` is the parallel text a reviewer should
## copy from. See the header.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Ai jülti chemisch symboul
chemistry-invalid-ionic-compound = Ai jülti ioonferbining

## Inputs embedded in math

math-embedded-input-blank = lek
math-embedded-input-blank-ordinal = lek { $ordinal } foon { $total }
