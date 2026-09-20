# Ladino / Judeo-Spanish (djudeoespanyol) content catalog: the prose the core
# computes into the document. Selected by `documentLocale` — the language the
# activity was written in. `locales/en/content.ftl` is the source of truth and
# message ids are never translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script.** Latin script in the **Aki Yerushalayim** orthography. Ladino was
# written in Hebrew (Rashi and solitreo) letters for four centuries, but the
# Latin Aki Yerushalayim spelling is what a reader meets today, so the catalog
# lays out **left to right**. See `chrome.ftl` for the whole note. Numbers
# render in Latin digits.
#
# **Word order and agreement.** Ladino adjectives **follow** the noun and
# **agree** with it in gender, so the composition messages invert the English
# order and every describing word that inflects selects on `$gender`. "thick
# dashed red line" comes out as «linya gruesa deskontinua kolorada». The
# agreement is real, not an invariant form: the two-way `[f]` / `*[m]` select
# is written out for every adjective that has two shapes.
#
# Nothing selects on `$role`: a clause position is carried by a preposition
# here, never by the adjective, so «kon un bodre grueso» has the same word the
# standalone phrase does.
#
# Six colour words are cited in one shape rather than as a select — «gris»,
# «naranja», «vedre», «sian», «azul», «roza», «marron». For «gris», «azul» and
# «vedre» that is Ladino morphology; for «naranja» and «roza» it is the usual
# treatment of a fruit or flower name used as a colour. None of them is an
# untranslated string.
#
# **What is Ladino and what is borrowed.** «kolorado» (red), «amariyo»
# (yellow, with the ⟨y⟩ that Aki Yerushalayim writes for Spanish ⟨ll⟩),
# «preto» (black), «vedre», «bodre» (border, with the old metathesis),
# «reyeno», «inchido» for *filled*, «linya», «kuadrado», «sirkolo» and «syempre
# ke» are the language's own. The geometry and typography nouns — «segmento»,
# «vektor», «parabola», «poligono», «rektangolo», «tabla», «figura» — have no
# Ladino attestation in a mathematical register and are taken from the
# **Spanish** learned Romance layer, respelt into Aki Yerushalayim. That
# borrowing is open: the mathematics a Ladino speaker was actually schooled in
# is Hebrew, Turkish or French, none of which could be spliced into a Romance
# noun phrase.
#
# **Counts.** CLDR has **no plural data for `lad`**, so no `[one]`, `[zero]`,
# `[two]`, `[few]` or `[many]` branch is written anywhere in this catalog.
# Nothing in this file is counted, so the question does not arise here at all.
#
# `noun-regular-polygon` splits: the side count follows the adjectives rather
# than sitting in front of the noun, so the head is «poligono regolar» and the
# tail «de N lados».
#
# **Weakest first.** «poligonal» for *polyline*, «kampo de pendientes» for
# *slope field*, and whether a speaker prefers «vedre» or «verde».


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] preta
           *[m] preto
        }
    .white =
        { $gender ->
            [f] blanka
           *[m] blanko
        }
    .gray = gris
    .red =
        { $gender ->
            [f] kolorada
           *[m] kolorado
        }
    .orange = naranja
    .yellow =
        { $gender ->
            [f] amariya
           *[m] amariyo
        }
    .green = vedre
    .cyan = sian
    .blue = azul
    .purple =
        { $gender ->
            [f] morada
           *[m] morado
        }
    .pink = roza
    .brown = marron
line-width =
    .thick =
        { $gender ->
            [f] gruesa
           *[m] grueso
        }
    .thin =
        { $gender ->
            [f] fina
           *[m] fino
        }
line-style =
    .dashed =
        { $gender ->
            [f] deskontinua
           *[m] deskontinuo
        }
    .dotted =
        { $gender ->
            [f] puntuada
           *[m] puntuado
        }
# Plural noun phrases, which is what follows «kon» in `style-filled`. They
# agree with nothing.
fill-style =
    .horizontal = linyas orizontalas
    .vertical = linyas vertikalas
    .diagonal = linyas diagonalas
    .backdiagonal = linyas diagonalas inversas
    .dots = puntos
    .diamonds = rombos
noun =
    .line = linya
    .line-segment = segmento
    .ray = semirekta
    .vector = vektor
    .curve = kurva
    .function = funksion
    .slope-field = kampo de pendientes
    .vector-field = kampo vektorial
    .parabola = parabola
    .polyline = poligonal
    .polygon = poligono
    .triangle = triangolo
    .rectangle = rektangolo
    .circle = sirkolo
    .region = rejion
    .point = punto
    .square = kuadrado
    .diamond = rombo
    .cross = kruz
    .plus = mas
# The side count follows the style adjectives so that they stay beside the noun
# they agree with.
noun-regular-polygon =
    { $part ->
        [tail] de { $numSides } lados
       *[head] poligono regolar
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (poligono, m) or
# the head of a phrase the description never names: `border` (bodre, m), `fill`
# (reyeno, m), `text` (teksto, m), `background` (fondo, m).
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
# The noun comes first and the adjectives after it, the opposite of English. A
# noun that splits — the regular polygon — puts its complement after the
# adjectives that agree with its head.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [f] inchida
       *[m] inchido
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } kon { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } kon { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } kon { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «bodre» is masculine, so the border's adjectives agree with it rather than
# with the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] kon un bodre { $border }
        [and] i bodre { $border }
        [and-article] i un bodre { $border }
       *[with] kon bodre { $border }
    }
# The fill-pattern words are plural noun phrases, because their other use is
# the «kon { $pattern }» clause in `style-filled`. So this message supplies a
# noun for them to hang off — «reyeno», masculine, the gender `noun-gender`
# already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] reyeno { $color } kon { $pattern }
       *[plain] reyeno { $color }
    }
style-unfilled = sin inchir
style-text =
    { $parts ->
        [background] { $color } sovre un fondo { $background }
       *[plain] { $color }
    }
style-background-none = dinguno

## Boolean words

boolean-true = verdadero
boolean-false = falso

## Answer buttons

answer-submit-label = Kontrolar
answer-submit-label-no-correctness = Mandar la repuesta

## Sectional blocks

section-name =
    .activity = Aktividad
    .aside = Nota al kanto
    .cascade = Kaskada
    .definition = Definision
    .example = Egzemplo
    .exercise = Ejersisio
    .exercises = Ejersisios
    .given-answer = Repuesta
    .note = Nota
    .objectives = Objektivos
    .paragraphs = Paragrafos
    .part = Parte
    .problem = Problema
    .problems = Problemas
    .proof = Demostrasion
    .question = Pregunta
    .section = Seksion
    .solution = Solusion
    .task = Tarea
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
hint-title = Pista

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabla { $enumeration }
        [numbered-title] Tabla { $enumeration }{ ": " }
        [unnumbered-title] Tabla{ ": " }
       *[unnumbered] Tabla
    }
figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ": " }
        [unnumbered-caption] Figura{ ": " }
       *[unnumbered] Figura
    }

## Paginator controls

paginator-previous = Anterior
paginator-next = Sigiente
paginator-page = Pajina
paginator-page-status = { $pageLabel } { $currentPage } de { $numPages }

## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = si
piecewise-condition-otherwise = si no

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. There is no published Ladino list of the elements for a seed to
## reproduce, and there could hardly be one: a Ladino speaker met the periodic
## table at school in **Hebrew** in Israel, in **Turkish** in Turkey, or in
## **French** in the Alliance Israélite schools, and never in Ladino. Respelling
## the Spanish table into Aki Yerushalayim would be coinage, not translation.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbolo kimiko no valido
chemistry-invalid-ionic-compound = Kompuesto ioniko no valido

## Inputs embedded in math

math-embedded-input-blank = vaziyo
math-embedded-input-blank-ordinal = vaziyo { $ordinal } de { $total }
