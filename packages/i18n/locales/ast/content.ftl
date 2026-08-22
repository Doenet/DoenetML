# Asturian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the standard of the Academia de la Llingua Asturiana.
#
# Asturian adjectives **follow** the noun and agree with it, so the composition
# messages invert the English order and every describing word that inflects
# selects on `$gender`. Nothing selects on `$role`: a clause position is
# carried by a preposition and never by the adjective, so «con un borde
# gruesu» has the same word the standalone phrase does.
#
# Asturian famously has a third form — the neuter of matter, «el pelo roxo» —
# but it is a fact about mass nouns rather than about these words, and nothing
# `noun-gender` can answer is one. So the table is two-way, as `locales/es`'s
# is.
#
# Six colour words are invariable — «naranxa», «verde», «cian», «azul»,
# «rosa», «marrón» — and are cited in one shape.
#
# `noun-regular-polygon` splits: the side count follows the adjectives rather
# than sitting in front of the noun, so the head is «polígonu regular» and the
# tail «de N llaos».


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] prieta
           *[m] prietu
        }
    .white =
        { $gender ->
            [f] blanca
           *[m] blancu
        }
    .gray =
        { $gender ->
            [f] buxa
           *[m] buxu
        }
    .red =
        { $gender ->
            [f] colorada
           *[m] coloráu
        }
    .orange = naranxa
    .yellow =
        { $gender ->
            [f] mariella
           *[m] mariellu
        }
    .green = verde
    .cyan = cian
    .blue = azul
    .purple =
        { $gender ->
            [f] morada
           *[m] moráu
        }
    .pink = rosa
    .brown = marrón
line-width =
    .thick =
        { $gender ->
            [f] gruesa
           *[m] gruesu
        }
    .thin =
        { $gender ->
            [f] fina
           *[m] finu
        }
line-style =
    .dashed =
        { $gender ->
            [f] discontinua
           *[m] discontinuu
        }
    .dotted =
        { $gender ->
            [f] puntiada
           *[m] puntiáu
        }
# Plural noun phrases, which is what follows «con» in `style-filled`. They
# agree with nothing.
fill-style =
    .horizontal = llinies horizontales
    .vertical = llinies verticales
    .diagonal = llinies diagonales
    .backdiagonal = llinies diagonales inverses
    .dots = puntos
    .diamonds = rombos
noun =
    .line = recta
    .line-segment = segmentu
    .ray = semirrecta
    .vector = vector
    .curve = curva
    .function = función
    .parabola = parábola
    .polyline = llinia quebrada
    .polygon = polígonu
    .triangle = triángulu
    .rectangle = rectángulu
    .circle = círculu
    .region = rexón
    .point = puntu
    .square = cuadráu
    .diamond = rombu
    .cross = cruz
    .plus = más
noun-regular-polygon =
    { $part ->
        [tail] de { $numSides } llaos
       *[head] polígonu regular
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (polígonu, m) or
# the head of a phrase the description never names: `border` (borde, m), `fill`
# (rellenu, m), `text` (testu, m), `background` (fondu, m).
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
# The noun comes first and the adjectives after it, which is the opposite of
# English. A noun that splits — the regular polygon — puts its complement after
# the adjectives that agree with its head.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [f] rellena
       *[m] rellenu
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
# The fill-pattern words are plural nouns, because their other use is the
# «con { $pattern }» clause in `style-filled`. So this message supplies a noun
# for them to hang off — «rellenu», masculine, which is the gender
# `noun-gender` already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] rellenu { $color } con { $pattern }
       *[plain] rellenu { $color }
    }
style-unfilled = ensin rellenar
style-text =
    { $parts ->
        [background] { $color } sobre un fondu { $background }
       *[plain] { $color }
    }
style-background-none = dengún

## Boolean words

boolean-true = verdaderu
boolean-false = falsu

## Answer buttons

answer-submit-label = Comprobar
answer-submit-label-no-correctness = Unviar la rempuesta

## Sectional blocks

section-name =
    .activity = Actividá
    .aside = Nota al marxe
    .cascade = Cascada
    .definition = Definición
    .example = Exemplu
    .exercise = Exerciciu
    .exercises = Exercicios
    .given-answer = Rempuesta
    .note = Nota
    .objectives = Oxetivos
    .paragraphs = Párrafos
    .part = Parte
    .problem = Problema
    .problems = Problemes
    .proof = Demostración
    .question = Entruga
    .section = Seición
    .solution = Solución
    .task = Xera
    .theorem = Teorema
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Pista

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabla { $enumeration }
        [numbered-title] Tabla { $enumeration }{ ". " }
        [unnumbered-title] Tabla{ ". " }
       *[unnumbered] Tabla
    }
figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ". " }
        [unnumbered-caption] Figura{ ". " }
       *[unnumbered] Figura
    }

## Paginator controls

paginator-previous = Anterior
paginator-next = Siguiente
paginator-page = Páxina
paginator-page-status = { $pageLabel } { $currentPage } de { $numPages }

## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = si
piecewise-condition-otherwise = si non

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Secondary science in Asturies is taught in Spanish, out of Spanish
## textbooks, so the chemical vocabulary a pupil meets is `locales/es`'s rather
## than an Asturian table — there is nothing settled here for a seed to
## reproduce.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Símbolu químicu inválidu
chemistry-invalid-ionic-compound = Compuestu iónicu inválidu
