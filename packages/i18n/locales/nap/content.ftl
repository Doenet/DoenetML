# Neapolitan (napulitano) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography and metaphony.** See `chrome.ftl`. The `$gender` forks below
# are where metaphony shows: «gruosso»/«grossa», «russo»/«rossa»,
# «niro»/«nera». Those pairs are not typos and must not be regularized.
#
# Neapolitan inflects for gender and the adjective follows its noun, so every
# adjective below selects on `$gender` and the composition messages put the
# noun first — the shape `locales/it` uses and the four other Romance catalogs
# of this batch share.
#
# `$role` goes unused: Neapolitan marks no case on an adjective, and the three
# clause positions differ from `standalone` only in the preposition in front of
# the phrase, which is written in the composition message rather than in the
# word.
#
# **The periodic table is left to fall back to English.** Secondary science in
# Campania is taught in Italian out of Italian textbooks, so the table a
# Neapolitan speaker meets is `locales/it`'s. That is a fact about a school
# system rather than about the language.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] nera
           *[m] niro
        }
    .white =
        { $gender ->
            [f] janca
           *[m] janco
        }
    .gray =
        { $gender ->
            [f] grigia
           *[m] grigio
        }
    .red =
        { $gender ->
            [f] rossa
           *[m] russo
        }
    .orange = aranciato
    .yellow =
        { $gender ->
            [f] gialla
           *[m] giallo
        }
    .green = verde
    .cyan = cian
    .blue = blu
    .purple = viola
    .pink = rosa
    .brown = marrone
line-width =
    .thick =
        { $gender ->
            [f] grossa
           *[m] gruosso
        }
    .thin =
        { $gender ->
            [f] sottile
           *[m] sottile
        }
line-style =
    .dashed =
        { $gender ->
            [f] trattiata
           *[m] trattiato
        }
    .dotted =
        { $gender ->
            [f] appuntinata
           *[m] appuntinato
        }
fill-style =
    .horizontal = righe orizzontale
    .vertical = righe verticale
    .diagonal = righe 'e sbieco
    .backdiagonal = righe 'e sbieco a ll'ancontrario
    .dots = punte
    .diamonds = rumme
noun =
    .line = linea
    .line-segment = segmento
    .ray = semiretta
    .vector = vettore
    .curve = curva
    .function = funzione
    .slope-field = campo 'e pennenze
    .vector-field = campo vettoriale
    .parabola = paràbbola
    .polyline = polilinea
    .polygon = polìgono
    .triangle = triàngulo
    .rectangle = rettàngulo
    .circle = cerchio
    .region = riggione
    .point = punto
    .square = quatrato
    .diamond = rummo
    .cross = croce
    .plus = cchiù
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they agree with.
noun-regular-polygon =
    { $part ->
        [tail] 'e { $numSides } late
       *[head] polìgono regolare
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (polìgono, m) or
# the head of a phrase the description never names: `border` (uorlo, m),
# `fill` (chinatura, f), `text` (testo, m), `background` (fondo, m).
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
# The noun leads and its adjectives follow: «linea grossa rossa».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [f] chiena
       *[m] chino
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } cu { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } cu { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } cu { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «uorlo» is masculine, so the border's adjectives agree with it and not with
# the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] cu nu uorlo { $border }
        [and] e uorlo { $border }
        [and-article] e nu uorlo { $border }
       *[with] cu uorlo { $border }
    }
# «'e culore» keeps the colour from having to agree with a plural pattern noun.
style-fill =
    { $parts ->
        [pattern] { $pattern } 'e culore { $color }
       *[plain] { $color }
    }
style-unfilled = nun chino
style-text =
    { $parts ->
        [background] { $color } ncopp'a fondo { $background }
       *[plain] { $color }
    }
style-background-none = nisciuno

## Boolean words

boolean-true = overo
boolean-false = fauzo

## Answer buttons

answer-submit-label = Cuntrolla 'o llavoro
answer-submit-label-no-correctness = Manna 'a risposta

## Sectional blocks

section-name =
    .activity = Attività
    .aside = Nota 'a parte
    .cascade = Cascata
    .definition = Definizione
    .example = Asempio
    .exercise = Esercizio
    .exercises = Esercizie
    .given-answer = Risposta
    .note = Nota
    .objectives = Obbiettive
    .paragraphs = Paragrafe
    .part = Parte
    .problem = Prubblema
    .problems = Prubbleme
    .proof = Prova
    .question = Addimanna
    .section = Sezione
    .solution = Soluzione
    .task = Cómpeto
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
hint-title = Cunziglio

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tavula { $enumeration }
        [numbered-title] Tavula { $enumeration }{ ": " }
        [unnumbered-title] Tavula{ ": " }
       *[unnumbered] Tavula
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
paginator-next = Prossimo
paginator-page = Pàggena
paginator-page-status = { $pageLabel } { $currentPage } 'e { $numPages }

## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = si
piecewise-condition-otherwise = si no

## Chemistry
##
## The 118 element names and the 12 anion names fall back to English.
## Secondary science in Campania is taught in Italian out of Italian textbooks,
## so the periodic table a Neapolitan speaker meets is `locales/it`'s. That is
## a fact about a school system rather than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Sìmbolo chìmmeco ca nun va bbuono
chemistry-invalid-ionic-compound = Cumposto ionico ca nun va bbuono

## Inputs embedded in math

# Read aloud inside the mathematics and never shown on screen, so it stays to
# one word.
math-embedded-input-blank = vacante
math-embedded-input-blank-ordinal = vacante { $ordinal } 'e { $total }
