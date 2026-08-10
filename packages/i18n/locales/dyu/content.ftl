# Dyula content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `dyu` is Julakan, the trade language of northern Côte d'Ivoire and western
# Burkina Faso, and it sits beside `locales/bm` and `locales/mnk` as one of
# three catalogs for members of the same ISO 639-3 macrolanguage, `man`. That
# is a first for this repository, and `negotiate.ts` records what it costs; see
# its `MACROLANGUAGE_MEMBERS` docstring.
#
# **The `hr`/`sr` rule is under more strain here than anywhere else it has been
# applied, and this header says so rather than leaving a reader to discover
# it.** Bambara and Dyula are mutually intelligible to a degree Croatian and
# Serbian are not: a Bamako reader can read this file. What separates them is
# an orthography — Côte d'Ivoire and Burkina Faso spell «gwɛ» where Mali spells
# «jɛ» — and a scatter of lexical choices, not two vocabularies. They are two
# directories because ISO 639-3 gives them two codes and CLDR resolves them to
# two countries, which is a published fact rather than a judgement made here,
# and because a seed that folded one onto the other would be asserting the
# opposite fact just as loudly. A speaker who finds the difference too thin to
# keep should say so in #1521; that is a decision for someone who reads both.
#
# Dyula has no grammatical gender, no article and no case, so `$gender` and
# `$role` go unused exactly as they do in English.
#
# What it has is the **qualifier suffix** `locales/bm`'s header describes: an
# adjective following a noun takes `-man`, and the same stem standing alone as
# a noun does not. Every adjective here is written in the qualifier form,
# because every one of them is said of something, and `style-background-none`
# is the one string that is not a qualifier and so has no suffix.
#
# Adjectives follow the noun, so the composition messages put the noun first.
#
# The mathematical nouns lean on the French loans Ivorian and Burkinabè
# schooling supplies, spelled the way Dyula writes them. Where Dyula has its
# own word it is used: «yɔrɔ» a region, «kuruwa» a cross.


## Style vocabulary

color =
    .black = finman
    .white = gwɛman
    .gray = buguriman
    .red = bilenman
    .orange = lenburuman
    .yellow = nɛrɛmuguman
    .green = binkɛnɛman
    .cyan = siyanman
    .blue = buleman
    .purple = wulenfinman
    .pink = wulenɲɛman
    .brown = bɔgɔman

line-width =
    .thick = bonman
    .thin = misɛnman

# Written as «ni …» phrases rather than as qualifiers, so that they take no
# `-man` and can close the description. `style-stroke` puts them last.
line-style =
    .dashed = ni tirɛw ye
    .dotted = ni pɔnw ye

fill-style =
    .horizontal = layini dalenw
    .vertical = layini lɔlenw
    .diagonal = layini jɛngɛlenw
    .backdiagonal = layini jɛngɛlen kɔfɛtaw
    .dots = pɔnw
    .diamonds = losanziw

noun =
    .line = layini
    .line-segment = layini tilayɔrɔ
    .ray = reyɔn
    .vector = wɛkitɛri
    .curve = kurubu
    .function = fɔnksiyɔn
    .parabola = parabɔli
    .polyline = layini kuruma
    .polygon = poligɔni
    .triangle = tiriyanguli
    .rectangle = rɛktangili
    .circle = serekili
    .region = yɔrɔ
    .point = pɔn
    .square = kare
    .diamond = losanzi
    .cross = kuruwa
    .plus = fara-taamasere

# The side count follows the qualifiers, behind «min kɛrɛ … ye», because Dyula
# closes a noun phrase with a relative rather than opening one.
noun-regular-polygon =
    { $part ->
        [tail] min kɛrɛ { $numSides } ye
       *[head] poligɔni bɛnnen
    }

# No grammatical gender, so this answers one token for every noun and the
# answer goes unused — the shape `locales/en` has.
noun-gender = kelen


## Style composition

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

style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = falenman

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ni { $pattern } ye
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ni { $pattern } ye
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } ni { $pattern } ye
       *[plain] { $noun } { $filled } { $color }
    }

# Dyula has no article, and joins this clause with «ni … ye» whatever came
# before it, so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] ni dankan { $border } ye
        [and] ni dankan { $border } ye
        [and-article] ni dankan { $border } ye
       *[with] ni dankan { $border } ye
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = falenbali

style-text =
    { $parts ->
        [background] { $color } ni kɔfɛla { $background } ye
       *[plain] { $color }
    }

style-background-none = foyi tɛ yen


## Boolean words

boolean-true = tiɲɛ
boolean-false = nkalon


## Answer buttons

answer-submit-label = Baara Lajɛ
answer-submit-label-no-correctness = Jaabi Ci


## Sectional blocks

section-name =
    .activity = Baara
    .aside = Faralen
    .cascade = Tulon
    .definition = Kɔrɔɲɔgɔn
    .example = Misali
    .exercise = Dege
    .exercises = Degew
    .given-answer = Jaabi
    .note = Hakilinata
    .objectives = Laɲiniw
    .paragraphs = Kumasenw
    .part = Yɔrɔ
    .problem = Gɛlɛya
    .problems = Gɛlɛyaw
    .proof = Daliluw
    .question = Ɲininkali
    .section = Tila
    .solution = Fura
    .task = Baara
    .theorem = Teyorɛmu

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Nɔnabɔli


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabalo { $enumeration }
        [numbered-title] Tabalo { $enumeration }{ ": " }
        [unnumbered-title] Tabalo{ ": " }
       *[unnumbered] Tabalo
    }

figure-name =
    { $parts ->
        [numbered] Ja { $enumeration }
        [numbered-caption] Ja { $enumeration }{ ": " }
        [unnumbered-caption] Ja{ ": " }
       *[unnumbered] Ja
    }


## Paginator controls

paginator-previous = Tɛmɛnen
paginator-next = Nata
paginator-page = Ɲɛ

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = walima

piecewise-condition-if = ni

piecewise-condition-otherwise = yɔrɔ tɔw bɛɛ la


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Côte d'Ivoire and Burkina Faso teach secondary
## science in French, so a Dyula speaker meets the periodic table there and the
## fallback *is* the curriculum — the same answer `locales/bm` gives one
## border away and `locales/mos` gives inside one of the same two countries.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Simi Taamasere Jugu
chemistry-invalid-ionic-compound = Ayɔn Ɲagaminen Jugu
