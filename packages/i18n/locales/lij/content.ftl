# Ligurian (ligure) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The grafîa ofiçiâ; see `chrome.ftl` for the note on «ç», the
# circumflex, «ñ» and «eu».
#
# Ligurian inflects for gender and the adjective follows its noun, so every
# adjective below selects on `$gender` and the composition messages put the
# noun first — the shape `locales/it` uses and the four other Romance catalogs
# of this batch share.
#
# `$role` goes unused: Ligurian marks no case on an adjective, and the three
# clause positions differ from `standalone` only in the preposition in front of
# the phrase, which is written in the composition message rather than in the
# word.
#
# **The periodic table is left to fall back to English.** Secondary science in
# Liguria is taught in Italian out of Italian textbooks, so the table a
# Ligurian speaker meets is `locales/it`'s. That is a fact about a school
# system rather than about the language.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] neigra
           *[m] neigro
        }
    .white =
        { $gender ->
            [f] gianca
           *[m] gianco
        }
    .gray =
        { $gender ->
            [f] grixa
           *[m] grixo
        }
    .red =
        { $gender ->
            [f] rossa
           *[m] rosso
        }
    .orange = naranson
    .yellow =
        { $gender ->
            [f] gianna
           *[m] gianno
        }
    .green = verde
    .cyan = çian
    .blue = bleu
    .purple = viòla
    .pink = reusa
    .brown = maron
line-width =
    .thick =
        { $gender ->
            [f] gròssa
           *[m] gròsso
        }
    .thin =
        { $gender ->
            [f] sutîa
           *[m] sutî
        }
line-style =
    .dashed =
        { $gender ->
            [f] trattezâ
           *[m] trattezòu
        }
    .dotted =
        { $gender ->
            [f] pontinâ
           *[m] pontinòu
        }
fill-style =
    .horizontal = righe orizontæ
    .vertical = righe verticæ
    .diagonal = righe diagonæ
    .backdiagonal = righe diagonæ a l'incontraio
    .dots = ponti
    .diamonds = rombi
noun =
    .line = linia
    .line-segment = segmento
    .ray = semiretta
    .vector = vettô
    .curve = curva
    .function = fonçión
    .slope-field = campo de pendençe
    .vector-field = campo vettoriale
    .parabola = paràbola
    .polyline = polilinia
    .polygon = polìgono
    .triangle = triàngolo
    .rectangle = rettàngolo
    .circle = çèrcio
    .region = region
    .point = ponto
    .square = quadròu
    .diamond = rombo
    .cross = croxe
    .plus = ciù
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they agree with.
noun-regular-polygon =
    { $part ->
        [tail] de { $numSides } lati
       *[head] polìgono regolare
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (polìgono, m) or
# the head of a phrase the description never names: `border` (bòrdo, m),
# `fill` (rempimento, m), `text` (testo, m), `background` (fondo, m).
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
# The noun leads and its adjectives follow: «linia gròssa rossa».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [f] pinn-a
       *[m] pin
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
# «bòrdo» is masculine, so the border's adjectives agree with it and not with
# the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] con un bòrdo { $border }
        [and] e bòrdo { $border }
        [and-article] e un bòrdo { $border }
       *[with] con bòrdo { $border }
    }
# «de coô» keeps the colour from having to agree with a plural pattern noun.
style-fill =
    { $parts ->
        [pattern] { $pattern } de coô { $color }
       *[plain] { $color }
    }
style-unfilled = no pin
style-text =
    { $parts ->
        [background] { $color } in sce fondo { $background }
       *[plain] { $color }
    }
style-background-none = nisciun

## Boolean words

boolean-true = veo
boolean-false = faso

## Answer buttons

answer-submit-label = Contròlla o travaggio
answer-submit-label-no-correctness = Manda a risposta

## Sectional blocks

section-name =
    .activity = Attivitæ
    .aside = Nòtta a parte
    .cascade = Cascâta
    .definition = Definiçión
    .example = Exempio
    .exercise = Exerciçio
    .exercises = Exerciçi
    .given-answer = Risposta
    .note = Nòtta
    .objectives = Obiettivi
    .paragraphs = Paragrafi
    .part = Parte
    .problem = Problema
    .problems = Problemi
    .proof = Preuva
    .question = Domanda
    .section = Seçión
    .solution = Soluçión
    .task = Compito
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
hint-title = Conseggio

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
        [numbered] Figûa { $enumeration }
        [numbered-caption] Figûa { $enumeration }{ ": " }
        [unnumbered-caption] Figûa{ ": " }
       *[unnumbered] Figûa
    }

## Paginator controls

paginator-previous = Precedente
paginator-next = Pròscimo
paginator-page = Pagina
paginator-page-status = { $pageLabel } { $currentPage } de { $numPages }

## Piecewise functions

piecewise-condition-or = ò
piecewise-condition-if = se
piecewise-condition-otherwise = sedonca

## Chemistry
##
## The 118 element names and the 12 anion names fall back to English.
## Secondary science in Liguria is taught in Italian out of Italian textbooks,
## so the periodic table a Ligurian speaker meets is `locales/it`'s. That is a
## fact about a school system rather than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Scimbolo chimico no vallido
chemistry-invalid-ionic-compound = Composto ionico no vallido

## Inputs embedded in math

# Read aloud inside the mathematics and never shown on screen, so it stays to
# one word.
math-embedded-input-blank = veuo
math-embedded-input-blank-ordinal = veuo { $ordinal } de { $total }
