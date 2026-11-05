# Friulian (furlan) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The official spelling; see `chrome.ftl` for the note on the
# circumflex, «ç», «cj» and «gj».
#
# Friulian inflects for gender and the adjective follows its noun, so every
# adjective below selects on `$gender` and the composition messages put the
# noun first — the shape `locales/it` uses, and the shape the four other
# Romance catalogs of this batch share.
#
# `$role` goes unused: Friulian marks no case on an adjective, and the three
# clause positions differ from `standalone` only in the preposition in front of
# the phrase, which is written in the composition message rather than in the
# word.
#
# **Feminine plural is `-is`, not `-es`**, and that is the loudest place this
# file parts company with `locales/it` in print: «liniis», «rispuestis»,
# «peraulis». The masculine plural is `-s`.
#
# **The periodic table is left to fall back to English.** Friulian is a
# recognized language of the Region and is taught as a subject, but secondary
# science in Friuli is taught in Italian out of Italian textbooks, so the table
# a Friulian pupil meets is `locales/it`'s. That is a fact about a school
# system rather than about the language, and a reviewer who wants the names
# here should copy `locales/it`'s deliberately rather than have this seed guess
# at Friulian ones.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] nere
           *[m] neri
        }
    .white =
        { $gender ->
            [f] blancje
           *[m] blanc
        }
    .gray =
        { $gender ->
            [f] grise
           *[m] grîs
        }
    .red =
        { $gender ->
            [f] rosse
           *[m] ros
        }
    .orange = naranç
    .yellow =
        { $gender ->
            [f] zale
           *[m] zâl
        }
    .green =
        { $gender ->
            [f] verde
           *[m] vert
        }
    .cyan = cian
    .blue = blu
    .purple =
        { $gender ->
            [f] purpurine
           *[m] purpurin
        }
    .pink = rose
    .brown =
        { $gender ->
            [f] marone
           *[m] maron
        }
line-width =
    .thick =
        { $gender ->
            [f] grosse
           *[m] gruès
        }
    .thin =
        { $gender ->
            [f] sutile
           *[m] sutîl
        }
line-style =
    .dashed =
        { $gender ->
            [f] trateade
           *[m] trateât
        }
    .dotted =
        { $gender ->
            [f] pontinade
           *[m] pontinât
        }
# The feminine plural in `-is`, which is where Friulian is most visibly not
# Italian.
fill-style =
    .horizontal = liniis orizontâls
    .vertical = liniis verticâls
    .diagonal = liniis diagonâls
    .backdiagonal = liniis diagonâls contrariis
    .dots = ponts
    .diamonds = rombis
noun =
    .line = linie
    .line-segment = segment
    .ray = semirete
    .vector = vetôr
    .curve = curve
    .function = funzion
    .slope-field = cjamp des pendencis
    .vector-field = cjamp vetoriâl
    .parabola = parabule
    .polyline = poligonâl
    .polygon = poligon
    .triangle = triangul
    .rectangle = retangul
    .circle = cercli
    .region = regjon
    .point = pont
    .square = cuadrât
    .diamond = rombo
    .cross = crôs
    .plus = plui
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they agree with — the Romance shape `locales/es` and
# `locales/it` already have.
noun-regular-polygon =
    { $part ->
        [tail] di { $numSides } bandis
       *[head] poligon regolâr
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (poligon, m) or the
# head of a phrase the description never names: `border` (ôr, m), `fill`
# (jemplament, m), `text` (test, m), `background` (fonts, m).
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [region] f
        [cross] f
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
# The noun leads and its adjectives follow: «linie grosse rosse». A noun with a
# complement keeps it beside itself.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [f] plene
       *[m] plen
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } cun { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } cun { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } cun { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «ôr» is masculine, so the border's adjectives agree with it and not with the
# shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] cuntun ôr { $border }
        [and] e ôr { $border }
        [and-article] e cuntun ôr { $border }
       *[with] cun ôr { $border }
    }
# «di colôr» keeps the colour from having to agree with a plural pattern noun.
style-fill =
    { $parts ->
        [pattern] { $pattern } di colôr { $color }
       *[plain] { $color }
    }
style-unfilled = no plen
style-text =
    { $parts ->
        [background] { $color } su fonts { $background }
       *[plain] { $color }
    }
style-background-none = nissun

## Boolean words

boolean-true = vêr
boolean-false = fals

## Answer buttons

answer-submit-label = Controle il lavôr
answer-submit-label-no-correctness = Mande la rispueste

## Sectional blocks

section-name =
    .activity = Ativitât
    .aside = Note a bande
    .cascade = Cascade
    .definition = Definizion
    .example = Esempli
    .exercise = Esercizi
    .exercises = Esercizis
    .given-answer = Rispueste
    .note = Note
    .objectives = Obietîfs
    .paragraphs = Paragrafs
    .part = Part
    .problem = Probleme
    .problems = Problemis
    .proof = Prove
    .question = Domande
    .section = Sezion
    .solution = Soluzion
    .task = Compit
    .theorem = Teoreme
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Sugjeriment

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabele { $enumeration }
        [numbered-title] Tabele { $enumeration }{ ": " }
        [unnumbered-title] Tabele{ ": " }
       *[unnumbered] Tabele
    }
figure-name =
    { $parts ->
        [numbered] Figure { $enumeration }
        [numbered-caption] Figure { $enumeration }{ ": " }
        [unnumbered-caption] Figure{ ": " }
       *[unnumbered] Figure
    }

## Paginator controls

paginator-previous = Precedent
paginator-next = Prossim
paginator-page = Pagjine
paginator-page-status = { $pageLabel } { $currentPage } di { $numPages }

## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = se
piecewise-condition-otherwise = se no

## Chemistry
##
## The 118 element names and the 12 anion names fall back to English.
## Secondary science in Friuli is taught in Italian out of Italian textbooks,
## so the periodic table a Friulian pupil meets is `locales/it`'s. That is a
## fact about a school system rather than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbul chimic no valit
chemistry-invalid-ionic-compound = Compost ionic no valit

## Inputs embedded in math

# Read aloud inside the mathematics and never shown on screen, so it stays to
# one word.
math-embedded-input-blank = vueit
math-embedded-input-blank-ordinal = vueit { $ordinal } di { $total }
