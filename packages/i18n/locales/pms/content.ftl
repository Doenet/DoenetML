# Piedmontese (piemontèis) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The grafìa piemontèisa; see `chrome.ftl` for the note on
# «ë», «ò», «ù», «n-» and «eu».
#
# Piedmontese inflects for gender and the adjective follows its noun, so every
# adjective below selects on `$gender` and the composition messages put the
# noun first — the shape `locales/it` uses and the four other Romance catalogs
# of this batch share.
#
# `$role` goes unused: Piedmontese marks no case on an adjective, and the three
# clause positions differ from `standalone` only in the preposition in front of
# the phrase, which is written in the composition message rather than in the
# word.
#
# **The periodic table is left to fall back to English.** Secondary science in
# Piedmont is taught in Italian out of Italian textbooks, so the table a
# Piedmontese speaker meets is `locales/it`'s. That is a fact about a school
# system rather than about the language.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] nèira
           *[m] nèir
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
    .orange = aranson
    .yellow =
        { $gender ->
            [f] giàuna
           *[m] giàun
        }
    .green =
        { $gender ->
            [f] verda
           *[m] verd
        }
    .cyan = sian
    .blue = bleu
    .purple =
        { $gender ->
            [f] violëtta
           *[m] violèt
        }
    .pink = ròsa
    .brown = maron
line-width =
    .thick =
        { $gender ->
            [f] gròssa
           *[m] gròss
        }
    .thin =
        { $gender ->
            [f] sutila
           *[m] sutil
        }
line-style =
    .dashed =
        { $gender ->
            [f] trategià
           *[m] trategià
        }
    .dotted =
        { $gender ->
            [f] puntinà
           *[m] puntinà
        }
fill-style =
    .horizontal = righe orisontaj
    .vertical = righe verticaj
    .diagonal = righe diagonaj
    .backdiagonal = righe diagonaj al contrari
    .dots = pont
    .diamonds = romb
noun =
    .line = linia
    .line-segment = segment
    .ray = semirëtta
    .vector = vetor
    .curve = curva
    .function = fonsion
    .slope-field = camp ëd pendense
    .vector-field = camp vetorial
    .parabola = paràbola
    .polyline = polilinia
    .polygon = polìgon
    .triangle = triàngol
    .rectangle = retàngol
    .circle = sercc
    .region = region
    .point = pont
    .square = quadrà
    .diamond = romb
    .cross = cros
    .plus = pi
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they agree with.
noun-regular-polygon =
    { $part ->
        [tail] ëd { $numSides } lati
       *[head] polìgon regolar
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (polìgon, m) or the
# head of a phrase the description never names: `border` (bòrd, m), `fill`
# (pien-a, f), `text` (test, m), `background` (fond, m).
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
        [fill] f
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
# The noun leads and its adjectives follow: «linia gròssa rossa».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [f] pien-a
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
# «bòrd» is masculine, so the border's adjectives agree with it and not with
# the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] con un bòrd { $border }
        [and] e bòrd { $border }
        [and-article] e un bòrd { $border }
       *[with] con bòrd { $border }
    }
# «ëd color» keeps the colour from having to agree with a plural pattern noun.
style-fill =
    { $parts ->
        [pattern] { $pattern } ëd color { $color }
       *[plain] { $color }
    }
style-unfilled = nen pien
style-text =
    { $parts ->
        [background] { $color } an sël fond { $background }
       *[plain] { $color }
    }
style-background-none = gnun

## Boolean words

boolean-true = ver
boolean-false = fàuss

## Answer buttons

answer-submit-label = Contròla ël travaj
answer-submit-label-no-correctness = Manda la rispòsta

## Sectional blocks

# **The plural pairs below look like copies and are not.** Piedmontese leaves
# most masculine nouns invariable in the plural, so `.exercise`/`.exercises`
# («esercissi»), `.problem`/`.problems` («problema»), `.objectives`
# («obietiv») and `.paragraphs` («paràgraf») are spelled the way the singular
# is. The other four Romance catalogs in this batch mark the plural — «problemi»
# in `locales/vec` and `locales/lij`, «problemis» in `locales/fur`,
# «prubbleme» in `locales/nap` — and a corrector reading one of those should
# not carry its ending back here.
section-name =
    .activity = Atività
    .aside = Nòta a part
    .cascade = Cascada
    .definition = Definission
    .example = Esempi
    .exercise = Esercissi
    .exercises = Esercissi
    .given-answer = Rispòsta
    .note = Nòta
    .objectives = Obietiv
    .paragraphs = Paràgraf
    .part = Part
    .problem = Problema
    .problems = Problema
    .proof = Preuva
    .question = Domanda
    .section = Session
    .solution = Solussion
    .task = Còmpit
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
hint-title = Consej

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tàula { $enumeration }
        [numbered-title] Tàula { $enumeration }{ ": " }
        [unnumbered-title] Tàula{ ": " }
       *[unnumbered] Tàula
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
paginator-next = Pròssim
paginator-page = Pàgina
paginator-page-status = { $pageLabel } { $currentPage } ëd { $numPages }

## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = se
piecewise-condition-otherwise = dësnò

## Chemistry
##
## The 118 element names and the 12 anion names fall back to English.
## Secondary science in Piedmont is taught in Italian out of Italian textbooks,
## so the periodic table a Piedmontese speaker meets is `locales/it`'s. That is
## a fact about a school system rather than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Sìmbol chìmich nen bon
chemistry-invalid-ionic-compound = Compòst iònich nen bon

## Inputs embedded in math

# Read aloud inside the mathematics and never shown on screen, so it stays to
# one word.
math-embedded-input-blank = veuid
math-embedded-input-blank-ordinal = veuid { $ordinal } ëd { $total }
