# Venetian (veneto) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The unified Venetian spelling, «x» for the voiced sibilant
# and **no «ł»**; see `chrome.ftl` for the whole note.
#
# Venetian inflects for gender and the adjective follows its noun, so every
# adjective below selects on `$gender` and the composition messages put the
# noun first — the shape `locales/it` uses and the four other Romance catalogs
# of this batch share.
#
# `$role` goes unused: Venetian marks no case on an adjective, and the three
# clause positions differ from `standalone` only in the preposition in front of
# the phrase, which is written in the composition message rather than in the
# word.
#
# **The periodic table is left to fall back to English.** Secondary science in
# the Veneto is taught in Italian out of Italian textbooks, so the table a
# Venetian speaker meets is `locales/it`'s and the fallback is one language
# further off than the classroom's. A reviewer who wants the names here should
# copy `locales/it`'s deliberately rather than have this seed guess at Venetian
# ones.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] negra
           *[m] negro
        }
    .white =
        { $gender ->
            [f] bianca
           *[m] bianco
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
            [f] zala
           *[m] zalo
        }
    .green = verde
    .cyan = cian
    .blue = blu
    .purple = viola
    .pink = rosa
    .brown = maron
line-width =
    .thick =
        { $gender ->
            [f] grossa
           *[m] grosso
        }
    .thin =
        { $gender ->
            [f] sotila
           *[m] sotil
        }
line-style =
    .dashed =
        { $gender ->
            [f] trateada
           *[m] trateà
        }
    .dotted =
        { $gender ->
            [f] puntinada
           *[m] puntinà
        }
fill-style =
    .horizontal = righe orixontali
    .vertical = righe verticali
    .diagonal = righe diagonali
    .backdiagonal = righe diagonali al contrario
    .dots = punti
    .diamonds = ronbi
noun =
    .line = linea
    .line-segment = segmento
    .ray = semireta
    .vector = vetor
    .curve = curva
    .function = funsion
    .slope-field = canpo de pendense
    .vector-field = canpo vetorial
    .parabola = parabola
    .polyline = polilinea
    .polygon = poligono
    .triangle = triangolo
    .rectangle = retangolo
    .circle = sercio
    .region = region
    .point = punto
    .square = cuadrato
    .diamond = ronbo
    .cross = croxe
    .plus = pi
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they agree with.
noun-regular-polygon =
    { $part ->
        [tail] de { $numSides } bande
       *[head] poligono regolar
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (poligono, m) or
# the head of a phrase the description never names: `border` (bordo, m),
# `fill` (inpienimento, m), `text` (testo, m), `background` (fondo, m).
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
# The noun leads and its adjectives follow: «linea grossa rossa».
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
        [pattern] { $filled } { $color } co { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } co { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } co { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «bordo» is masculine, so the border's adjectives agree with it and not with
# the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] co un bordo { $border }
        [and] e bordo { $border }
        [and-article] e un bordo { $border }
       *[with] co bordo { $border }
    }
# «de color» keeps the colour from having to agree with a plural pattern noun.
style-fill =
    { $parts ->
        [pattern] { $pattern } de color { $color }
       *[plain] { $color }
    }
style-unfilled = mia pien
style-text =
    { $parts ->
        [background] { $color } su fondo { $background }
       *[plain] { $color }
    }
style-background-none = nisun

## Boolean words

boolean-true = vero
boolean-false = falso

## Answer buttons

answer-submit-label = Controla el laoro
answer-submit-label-no-correctness = Manda la rispota

## Sectional blocks

section-name =
    .activity = Atività
    .aside = Nota a banda
    .cascade = Cascada
    .definition = Definision
    .example = Exenpio
    .exercise = Esersisio
    .exercises = Esersisi
    .given-answer = Rispota
    .note = Nota
    .objectives = Obietivi
    .paragraphs = Paragrafi
    .part = Parte
    .problem = Problema
    .problems = Problemi
    .proof = Prova
    .question = Domanda
    .section = Sesion
    .solution = Solusion
    .task = Conpito
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
hint-title = Sugerimento

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

paginator-previous = Precedente
paginator-next = Prosimo
paginator-page = Pagina
paginator-page-status = { $pageLabel } { $currentPage } de { $numPages }

## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = se
piecewise-condition-otherwise = senò

## Chemistry
##
## The 118 element names and the 12 anion names fall back to English.
## Secondary science in the Veneto is taught in Italian out of Italian
## textbooks, so the periodic table a Venetian speaker meets is `locales/it`'s.
## That is a fact about a school system rather than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Sinbolo chimico mia valido
chemistry-invalid-ionic-compound = Conposto ionico mia valido

## Inputs embedded in math

# Read aloud inside the mathematics and never shown on screen, so it stays to
# one word.
math-embedded-input-blank = vodo
math-embedded-input-blank-ordinal = vodo { $ordinal } de { $total }
