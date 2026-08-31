# Lombard (lombard) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Variety and orthography.** Western Lombard in its Milanese form, in the
# classical Milanese orthography; see `chrome.ftl` for the note on «oeu», on
# «o» = /u/ against «u» = /y/, and on why Eastern Lombard would differ.
#
# **Adjectives follow the noun**, as in every Romance language of this batch,
# and this catalog **really agrees them for gender**: the feminine is a live
# ending in Milanese, not a copy of the masculine. Masculine `-` / feminine
# `-a` («gross» / «grossa», «ross» / «rossa», «verd» / «verda»), and the past
# participles that serve as adjectives take masculine `-aa` / feminine `-ada`
# («trattegiaa» / «trattegiada», «pontinaa» / «pontinada»). That `-aa` / `-ada`
# pair is Milanese morphology and is the loudest place this file parts company
# with `locales/it` in print. The composition messages therefore put the noun
# first: «linea grossa trattegiada rossa».
#
# The Milanese plural is the other place this file is visibly not Italian, and
# it is why the counts in the other three files select the way they do:
# masculine nouns are largely **invariable** («el pont» → «i pont»), while the
# feminine drops its `-a` («la risposta» → «i rispost», «la riga» → «li
# righ»). «linea» is the exception the fill patterns are written in: a
# feminine noun ending in a vowel plus `-a` takes `-e` rather than losing it,
# so «la linea» → «i linee», which is also the Italian form and so the one
# line of this file a reviewer cannot tell apart from `locales/it`. No plural
# is selected in this file, but the fill patterns are written in it.
#
# `$role` goes unused: Milanese marks no case on an adjective, and the three
# clause positions differ from `standalone` only in the preposition in front of
# the phrase, which is written in the composition message rather than in the
# word.
#
# **The periodic table is left to fall back to English.** Lombard has no
# settled published list of the 118 elements, and no standardized technical
# terminology at all. Schooling in Lombardy is in **Italian**, out of Italian
# textbooks, so the periodic table a Lombard pupil actually meets is
# `locales/it`'s. That is a fact about a school system rather than about the
# language, and a reviewer who wants the names here should copy `locales/it`'s
# deliberately rather than have this seed guess at Lombard ones.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] negra
           *[m] negher
        }
    .white =
        { $gender ->
            [f] bianca
           *[m] bianch
        }
    .gray =
        { $gender ->
            [f] grisa
           *[m] gris
        }
    .red =
        { $gender ->
            [f] rossa
           *[m] ross
        }
    .orange = naranz
    .yellow =
        { $gender ->
            [f] gialda
           *[m] giald
        }
    .green =
        { $gender ->
            [f] verda
           *[m] verd
        }
    .cyan = cian
    .blue = bloeu
    .purple = viola
    .pink = rosa
    .brown = maron
line-width =
    .thick =
        { $gender ->
            [f] grossa
           *[m] gross
        }
    .thin =
        { $gender ->
            [f] sottila
           *[m] sottil
        }
line-style =
    .dashed =
        { $gender ->
            [f] trattegiada
           *[m] trattegiaa
        }
    .dotted =
        { $gender ->
            [f] pontinada
           *[m] pontinaa
        }
fill-style =
    .horizontal = linee orizzontal
    .vertical = linee vertical
    .diagonal = linee diagonal
    .backdiagonal = linee diagonal a l'inversa
    .dots = pont
    .diamonds = romb
noun =
    .line = linea
    .line-segment = segment
    .ray = semiretta
    .vector = vettor
    .curve = curva
    .function = funzion
    .slope-field = camp di pendenz
    .vector-field = camp vettorial
    .parabola = parabola
    .polyline = poligonal
    .polygon = poligon
    .triangle = triangol
    .rectangle = rettangol
    .circle = cerchi
    .region = region
    .point = pont
    .square = quader
    .diamond = romb
    .cross = cros
    .plus = pu
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they agree with — the Romance shape `locales/it` and
# `locales/fur` already have.
noun-regular-polygon =
    { $part ->
        [tail] de { $numSides } band
       *[head] poligon regolar
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (poligon, m) or the
# head of a phrase the description never names: `border` (or, m), `fill`
# (impienidura, f), `text` (test, m), `background` (fond, m). The default is
# masculine, which is also what an author's own `markerStyleWord` gets.
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
# The noun leads and its adjectives follow: «linea grossa rossa». A noun with a
# complement keeps it beside itself.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [f] piena
       *[m] pien
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
# «or» (edge, border) is masculine, so the border's adjectives agree with it
# and not with the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] con on or { $border }
        [and] e or { $border }
        [and-article] e con on or { $border }
       *[with] con or { $border }
    }
# «de color» keeps the colour from having to agree with a plural pattern noun.
style-fill =
    { $parts ->
        [pattern] { $pattern } de color { $color }
       *[plain] { $color }
    }
style-unfilled = minga pien
style-text =
    { $parts ->
        [background] { $color } su on fond { $background }
       *[plain] { $color }
    }
style-background-none = nissun

## Boolean words

boolean-true = ver
boolean-false = fals

## Answer buttons

answer-submit-label = Controlla el laurà
answer-submit-label-no-correctness = Manda la risposta

## Sectional blocks

section-name =
    .activity = Attivitaa
    .aside = Nota a part
    .cascade = Cascada
    .definition = Definizion
    .example = Esempi
    .exercise = Esercizi
    .exercises = Esercizi
    .given-answer = Risposta
    .note = Nota
    .objectives = Obiettiv
    .paragraphs = Paragraf
    .part = Part
    .problem = Problema
    .problems = Problem
    .proof = Prova
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
hint-title = Sugeriment

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabella { $enumeration }
        [numbered-title] Tabella { $enumeration }{ ": " }
        [unnumbered-title] Tabella{ ": " }
       *[unnumbered] Tabella
    }
figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ": " }
        [unnumbered-caption] Figura{ ": " }
       *[unnumbered] Figura
    }

## Paginator controls

paginator-previous = Precedent
paginator-next = Prossim
paginator-page = Pagina
paginator-page-status = { $pageLabel } { $currentPage } de { $numPages }

## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = se
piecewise-condition-otherwise = se de no

## Chemistry
##
## The 118 element names and the 12 anion names fall back to English.
## Schooling in Lombardy is in Italian, out of Italian textbooks, so the
## periodic table a Lombard pupil meets is `locales/it`'s. That is a fact
## about a school system rather than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbol chimich minga valid
chemistry-invalid-ionic-compound = Compost ionich minga valid

## Inputs embedded in math

# Read aloud inside the mathematics and never shown on screen, so it stays to
# one word.
math-embedded-input-blank = voeud
math-embedded-input-blank-ordinal = voeud { $ordinal } de { $total }
