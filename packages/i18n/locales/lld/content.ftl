# Ladin (ladin) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and standard.** Latin script, Ladin Dolomitan (the SPELL standard);
# see `chrome.ftl` for the note on «ë», «z» and «j», and on the valley
# varieties — Gherdëina, Badiot, Fascian — that this koine stands over.
#
# **Adjectives follow the noun**, as in every Romance language of the batch,
# and this catalog **really agrees them for gender**: the feminine is a live
# ending here, not a copy of the masculine. Masculine `-` / feminine `-a`
# («gros» / «grossa», «vërt» / «vërda»), and the past participles that serve
# as adjectives take masculine `-à` / feminine `-ada` («tratejà» /
# «tratejada», «puntinà» / «puntinada»). The composition messages therefore
# put the noun first: «linia grossa tratejada cuecia».
#
# The Ladin plural is the other place this file is visibly not Italian:
# feminine `-es` («linies», «respostes», «figures») and masculine `-s` with
# palatalization before it («pont» → «ponc», «document» → «documenc»). No
# plural is selected in this file, but the fill patterns are written in it.
#
# `$role` goes unused: Ladin marks no case on an adjective, and the three
# clause positions differ from `standalone` only in the preposition in front of
# the phrase, which is written in the composition message rather than in the
# word.
#
# **The periodic table is left to fall back to English.** Ladin does have a
# real terminology tradition — SPELL's dictionary and grammar, and the
# administrative and school terminology the Province publishes — which is why
# the school vocabulary elsewhere in these files is Ladin's own. A settled
# published list of all 118 element names is **not** part of it. Secondary
# science in the Ladin valleys is taught in Italian or in German out of Italian
# or German textbooks, so the periodic table a Ladin pupil actually meets is
# `locales/it`'s or `locales/de`'s. That is a fact about a school system rather
# than about the language, and a reviewer who wants the names here should copy
# one of those deliberately rather than have this seed guess at Ladin ones.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] nëigra
           *[m] nëigher
        }
    .white =
        { $gender ->
            [f] blancia
           *[m] blanch
        }
    .gray =
        { $gender ->
            [f] grisa
           *[m] gris
        }
    .red =
        { $gender ->
            [f] cuecia
           *[m] cueci
        }
    .orange = naranc
    .yellow =
        { $gender ->
            [f] ghiela
           *[m] ghiel
        }
    .green =
        { $gender ->
            [f] vërda
           *[m] vërt
        }
    .cyan = cian
    .blue = blé
    .purple = viola
    .pink = rosa
    .brown = maron
line-width =
    .thick =
        { $gender ->
            [f] grossa
           *[m] gros
        }
    .thin =
        { $gender ->
            [f] sutila
           *[m] sutil
        }
line-style =
    .dashed =
        { $gender ->
            [f] tratejada
           *[m] tratejà
        }
    .dotted =
        { $gender ->
            [f] puntinada
           *[m] puntinà
        }
# The feminine plural in `-es`, which is where Ladin is most visibly not
# Italian.
fill-style =
    .horizontal = linies orizontales
    .vertical = linies verticales
    .diagonal = linies diagonales
    .backdiagonal = linies diagonales al inrevers
    .dots = ponc
    .diamonds = rombi
noun =
    .line = linia
    .line-segment = segment
    .ray = semireta
    .vector = vetor
    .curve = curva
    .function = funzion
    .slope-field = ciamp dles pendënzes
    .vector-field = ciamp vetorial
    .parabola = parabola
    .polyline = poligonala
    .polygon = poligon
    .triangle = triangul
    .rectangle = retangul
    .circle = zircul
    .region = region
    .point = pont
    .square = cuadrat
    .diamond = rombo
    .cross = crousc
    .plus = plu
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they agree with — the Romance shape `locales/es`,
# `locales/it` and `locales/fur` already have.
noun-regular-polygon =
    { $part ->
        [tail] con { $numSides } bandes
       *[head] poligon regolar
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (poligon, m) or the
# head of a phrase the description never names: `border` (ur, m), `fill`
# (empimënt, m), `text` (test, m), `background` (fond, m).
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
# The noun leads and its adjectives follow: «linia grossa cuecia». A noun with
# a complement keeps it beside itself.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [f] plena
       *[m] plen
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } con { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } con { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } con { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «ur» (edge, border) is masculine, so the border's adjectives agree with it
# and not with the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] con n ur { $border }
        [and] y ur { $border }
        [and-article] y con n ur { $border }
       *[with] con ur { $border }
    }
# «de colour» keeps the colour from having to agree with a plural pattern noun.
style-fill =
    { $parts ->
        [pattern] { $pattern } de colour { $color }
       *[plain] { $color }
    }
style-unfilled = nia plen
style-text =
    { $parts ->
        [background] { $color } sun n fond { $background }
       *[plain] { $color }
    }
style-background-none = degun

## Boolean words

boolean-true = vëi
boolean-false = fauz

## Answer buttons

answer-submit-label = Controlé l lëur
answer-submit-label-no-correctness = Mané la resposta

## Sectional blocks

section-name =
    .activity = Ativité
    .aside = Nota a pert
    .cascade = Cascada
    .definition = Definizion
    .example = Ejëmpl
    .exercise = Esercizi
    .exercises = Esercizies
    .given-answer = Resposta
    .note = Nota
    .objectives = Obietifs
    .paragraphs = Paragrafs
    .part = Pert
    .problem = Problem
    .problems = Problems
    .proof = Proa
    .question = Domanda
    .section = Sezion
    .solution = Soluzion
    .task = Compit
    .theorem = Teorema
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Consei

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabela { $enumeration }
        [numbered-title] Tabela { $enumeration }{ ": " }
        [unnumbered-title] Tabela{ ": " }
       *[unnumbered] Tabela
    }
figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ": " }
        [unnumbered-caption] Figura{ ": " }
       *[unnumbered] Figura
    }

## Paginator controls

paginator-previous = Precedënt
paginator-next = Prosim
paginator-page = Plata
paginator-page-status = { $pageLabel } { $currentPage } de { $numPages }

## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = sce
piecewise-condition-otherwise = sce no

## Chemistry
##
## The 118 element names and the 12 anion names fall back to English.
## Secondary science in the Ladin valleys is taught in Italian or in German out
## of Italian or German textbooks, so the periodic table a Ladin pupil meets is
## `locales/it`'s or `locales/de`'s. That is a fact about a school system
## rather than about the language, and it is the one place where Ladin's own
## terminology tradition does not reach.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbol chimich nia valid
chemistry-invalid-ionic-compound = Compost ionich nia valid

## Inputs embedded in math

# Read aloud inside the mathematics and never shown on screen, so it stays to
# one word.
math-embedded-input-blank = vuet
math-embedded-input-blank-ordinal = vuet { $ordinal } de { $total }
