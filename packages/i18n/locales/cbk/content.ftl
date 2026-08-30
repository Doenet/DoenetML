# Chavacano (Chabacano de Zamboanga) content catalog: the prose the core
# computes into the document. Selected by `documentLocale` — the language the
# activity was written in. `locales/en/content.ftl` is the source of truth, and
# message ids, placeables and variant keys are never translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Zamboangueño, and a creole rather than a variety of Spanish.**
# `chrome.ftl`'s header sets out the grammar in full: preverbal «ya», «ta» and
# «ay» for aspect, «hende» and «no hay» for negation, «el», «maga», «con» and
# «na» for the noun phrase. Caviteño and Ternateño readers will differ from
# these files, and that is a difference between varieties rather than an error
# in this one.
#
# **Orthography: the traditional Spanish-based spelling, with no accent
# marks.** The phonemic orthography promoted in Zamboanga City is the
# competing one; respell rather than retranslate, and respell all four files
# at once.
#
# ## Word order — the thing this file is most likely to be "corrected" wrongly
#
# **The describing word comes first and the noun after it**: «grueso rojo
# linea» is *thick red line*, and «lleno azul circulo» is *filled blue
# circle*. A reader who takes the vocabulary for Spanish will expect «linea
# roja» and be wrong: Zamboangueño puts the modifier in front, as Cebuano and
# Tagalog do, and this catalog holds to that everywhere. So `style-stroke`,
# `style-with-noun` and `style-filled-with-noun` keep English's sequence of
# placeables — which is a fact about Zamboangueño's syntax and not a failure
# to translate.
#
# **There is no linker.** This is where these files diverge sharply from the
# other Philippine catalogs in the roster: Tagalog's «na»/«-ng», Cebuano's
# «nga», Ilocano's «a»/«nga» and Pangasinan's «a»/«-n» all have to be placed
# and all have two shapes, and Zamboangueño simply juxtaposes — the Spanish
# lexicon came without a ligature and the creole did not build one. Nothing in
# this file is at risk from the problem
# [A ligature is an affix too](../../README.md#a-ligature-is-an-affix-too)
# describes.
#
# **Number.** The noun is unmarked; «maga» is the plural word and is written
# only where the sense is genuinely plural — the four `fill-style` patterns,
# which are patterns of many marks — and left off elsewhere, so «linea» covers
# one line and many alike.
#
# ## Vocabulary
#
# Everything below is Spanish-lexifier because the language is. The
# derivational shape worth naming is **«-ao»**, Chavacano's reflex of Spanish
# «-ado»: «lleno» has no need of it but «cortao» (cut) and «puntiao» (dotted)
# do, and a reviewer should read those as ordinary Chavacano rather than as
# clipped Spanish. `.slope-field` and `.vector-field` are written «campo de
# pendiente» and «campo de vector»; if the classroom in Zamboanga says
# "slope field" in English, that is what should replace them.
#
# Chavacano has no grammatical gender agreement of the Spanish kind — the
# adjective does not move for a feminine noun — so `noun-gender` answers one
# token for every noun and nothing here selects on `$gender` or `$role`.
#
# **The two chemistry tables — `element-name` and `element-anion-name` — are
# omitted.** Secondary science in Zamboanga is taught in English, so the
# English fallback is the language of the classroom, and filling those 130 keys
# would claim a translation that had not happened. `ion-name-oxidation-state`
# and the two `chemistry-invalid-` messages are prose and are translated.


## Style vocabulary

color =
    .black = negro
    .white = blanco
    .gray = gris
    .red = rojo
    .orange = anaranjado
    .yellow = amarillo
    .green = verde
    .cyan = cian
    .blue = azul
    .purple = morado
    .pink = rosado
    .brown = marron

line-width =
    .thick = grueso
    .thin = delgado

# «-ao» is Chavacano's form of Spanish «-ado»; these are not clipped Spanish.
line-style =
    .dashed = cortao
    .dotted = puntiao

# The one place «maga» is written: a fill pattern is genuinely many marks.
fill-style =
    .horizontal = maga horizontal linea
    .vertical = maga vertical linea
    .diagonal = maga diagonal linea
    .backdiagonal = maga contrario diagonal linea
    .dots = maga punto
    .diamonds = maga diamante

noun =
    .line = linea
    .line-segment = segmento de linea
    .ray = rayo
    .vector = vector
    .curve = curva
    .function = funcion
    .slope-field = campo de pendiente
    .vector-field = campo de vector
    .parabola = parabola
    .polyline = polilinea
    .polygon = poligono
    .triangle = triangulo
    .rectangle = rectangulo
    .circle = circulo
    .region = region
    .point = punto
    .square = cuadrado
    .diamond = diamante
    .cross = cruz
    .plus = mas

# The side count follows the adjectives as a complement, so that they stay in
# front of the noun where Zamboangueño wants them.
noun-regular-polygon =
    { $part ->
        [tail] que tiene { $numSides } lado
       *[head] regular poligono
    }

# One answer for every noun: Chavacano's adjectives do not agree, so nothing
# downstream has anything to agree with.
noun-gender = neuter


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

style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

style-filled-word = lleno

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } con { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } con { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } con { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «un» is Chavacano's indefinite article, so the two `-article` branches carry
# it and the other two do not — the same distinction English makes. What
# separates a first clause from a further one is «con» against «y».
style-border-clause =
    { $parts ->
        [with-article] con un { $border } orilla
        [and] y { $border } orilla
        [and-article] y un { $border } orilla
       *[with] con { $border } orilla
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = hende lleno

style-text =
    { $parts ->
        [background] { $color } con un { $background } fondo
       *[plain] { $color }
    }

style-background-none = no hay


## Boolean words

boolean-true = verdad
boolean-false = falso


## Answer buttons

answer-submit-label = Revisa el Trabajo
answer-submit-label-no-correctness = Manda el Respuesta


## Sectional blocks

section-name =
    .activity = Actividad
    .aside = Aparte
    .cascade = Cascada
    .definition = Definicion
    .example = Ejemplo
    .exercise = Ejercicio
    .exercises = Maga Ejercicio
    .given-answer = Respuesta
    .note = Nota
    .objectives = Maga Objetivo
    .paragraphs = Maga Parrafo
    .part = Parte
    .problem = Problema
    .problems = Maga Problema
    .proof = Prueba
    .question = Pregunta
    .section = Seccion
    .solution = Solucion
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

hint-title = Consejo


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

paginator-previous = Antes
paginator-next = Siguiente
paginator-page = Pagina

paginator-page-status = { $pageLabel } { $currentPage } de { $numPages }


## Piecewise functions

piecewise-condition-or = o

piecewise-condition-if = si

piecewise-condition-otherwise = si hende


## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Invalido Simbolo Quimico
chemistry-invalid-ionic-compound = Invalido Compuesto Ionico

## Inputs embedded in math

math-embedded-input-blank = blanco

math-embedded-input-blank-ordinal = blanco { $ordinal } de { $total }
