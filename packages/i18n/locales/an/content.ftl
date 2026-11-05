# Aragonese (aragonés) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in. `locales/en/content.ftl` is the source of truth and message ids
# are never translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script in the Academia de l'Aragonés / EFA
# *Propuesta ortografica* (2010) — ⟨ny⟩ not ⟨ñ⟩, etymological ⟨v⟩, articles
# «o / a / os / as». See `chrome.ftl` for the whole note. Numbers render in
# Latin digits.
#
# **Word order and agreement.** Aragonese adjectives **follow** the noun and
# **agree** with it in gender, so the composition messages invert the English
# order and every describing word that inflects selects on `$gender`. "thick
# dashed red line" comes out as «linia gorda discontinua roya». Nothing selects
# on `$role`: a clause position is carried by a preposition here, never by the
# adjective, so «con un borde gordo» has the same word the standalone phrase
# does. The agreement is real, not an invariant form: the two-way `[f]`/`*[m]`
# select is written out for every adjective that has two shapes.
#
# Seven colour words are invariable in Aragonese — «gris», «naranja»,
# «verde», «cian», «azul», «rosa», «marrón» — and are cited once rather than
# as a select. That is Aragonese morphology, not an untranslated string.
#
# **What is Aragonese and what is borrowed.** «royo» (red), «amariello»
# (yellow), «morau» (purple), «gordo», «cerclo», «cuadrau», «ringlera», the
# **-au / -ada** participles, «u» for *or*, «si non» for *otherwise* and
# «denguno» are Aragonese. The geometry and typography nouns — «segmento»,
# «vector», «parabola», «poligono», «rectangulo», «tabla», «figura» — are the
# learned Romance layer a speaker meets through **Spanish**, which is the
# language of schooling in Aragón, and are borrowed openly.
#
# **Counts.** CLDR has plural rules for `an` (`one`, `other`), but nothing in
# this file is counted, so no plural select appears here.
#
# `noun-regular-polygon` splits: the side count follows the adjectives rather
# than sitting in front of the noun, so the head is «poligono regular» and the
# tail «de N costaus».
#
# **Weakest first.** «replenau» for *filled* and «replén» for *fill* are the
# least certain choices; so is «poligonal» for *polyline*.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] negra
           *[m] negro
        }
    .white =
        { $gender ->
            [f] blanca
           *[m] blanco
        }
    .gray = gris
    .red =
        { $gender ->
            [f] roya
           *[m] royo
        }
    .orange = naranja
    .yellow =
        { $gender ->
            [f] amariella
           *[m] amariello
        }
    .green = verde
    .cyan = cian
    .blue = azul
    .purple =
        { $gender ->
            [f] morada
           *[m] morau
        }
    .pink = rosa
    .brown = marrón
line-width =
    .thick =
        { $gender ->
            [f] gorda
           *[m] gordo
        }
    .thin =
        { $gender ->
            [f] fina
           *[m] fino
        }
line-style =
    .dashed =
        { $gender ->
            [f] discontinua
           *[m] discontinuo
        }
    .dotted =
        { $gender ->
            [f] puntiada
           *[m] puntiau
        }
# Plural noun phrases, which is what follows «con» in `style-filled`. They
# agree with nothing.
fill-style =
    .horizontal = linias horizontals
    .vertical = linias verticals
    .diagonal = linias diagonals
    .backdiagonal = linias diagonals inversas
    .dots = puntos
    .diamonds = rombos
noun =
    .line = linia
    .line-segment = segmento
    .ray = semirrecta
    .vector = vector
    .curve = curva
    .function = función
    .slope-field = campo de pendients
    .vector-field = campo vectorial
    .parabola = parabola
    .polyline = poligonal
    .polygon = poligono
    .triangle = triangulo
    .rectangle = rectangulo
    .circle = cerclo
    .region = rechión
    .point = punto
    .square = cuadrau
    .diamond = rombo
    .cross = cruz
    .plus = mas
# The side count follows the style adjectives so that they stay beside the noun
# they agree with.
noun-regular-polygon =
    { $part ->
        [tail] de { $numSides } costaus
       *[head] poligono regular
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (poligono, m) or
# the head of a phrase the description never names: `border` (borde, m), `fill`
# (replén, m), `text` (texto, m), `background` (fondo, m).
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
        [f] replenada
       *[m] replenau
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } con { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } con { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } con { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «borde» is masculine, so the border's adjectives agree with it rather than
# with the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] con un borde { $border }
        [and] y borde { $border }
        [and-article] y un borde { $border }
       *[with] con borde { $border }
    }
# The fill-pattern words are plural noun phrases, because their other use is
# the «con { $pattern }» clause in `style-filled`. So this message supplies a
# noun for them to hang off — «replén», masculine, the gender `noun-gender`
# already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] replén { $color } con { $pattern }
       *[plain] replén { $color }
    }
style-unfilled = sin replenar
style-text =
    { $parts ->
        [background] { $color } sobre un fondo { $background }
       *[plain] { $color }
    }
style-background-none = denguno

## Boolean words

boolean-true = verdadero
boolean-false = falso

## Answer buttons

answer-submit-label = Comprebar
answer-submit-label-no-correctness = Ninviar a respuesta

## Sectional blocks

section-name =
    .activity = Actividat
    .aside = Nota a lo marguin
    .cascade = Cascada
    .definition = Definición
    .example = Exemplo
    .exercise = Exercicio
    .exercises = Exercicios
    .given-answer = Respuesta
    .note = Nota
    .objectives = Obchectivos
    .paragraphs = Paragrafos
    .part = Parte
    .problem = Problema
    .problems = Problemas
    .proof = Demostración
    .question = Pregunta
    .section = Sección
    .solution = Solución
    .task = Fayena
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
paginator-next = Siguient
paginator-page = Pachina
paginator-page-status = { $pageLabel } { $currentPage } de { $numPages }

## Piecewise functions

piecewise-condition-or = u
piecewise-condition-if = si
piecewise-condition-otherwise = si non

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. There is no settled published Aragonese list of the elements for a
## seed to reproduce: science in Aragón is taught in **Spanish**, out of
## Spanish textbooks, so the periodic table a pupil actually meets is
## `locales/es`'s. Inventing an Aragonese one here would be a coinage, not a
## translation.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbolo quimico no valido
chemistry-invalid-ionic-compound = Compuesto ionico no valido

## Inputs embedded in math

math-embedded-input-blank = buedo
math-embedded-input-blank-ordinal = buedo { $ordinal } de { $total }
