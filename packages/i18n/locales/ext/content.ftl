# Extremaduran (estremeñu) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in. `locales/en/content.ftl` is the source of truth and message ids
# are never translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script in the OSCEC standard: final -o → -u
# and -e → -i, infinitives in -l, participles -áu / -á, «i» for *and*. See
# `chrome.ftl` for the whole note. Numbers render in Latin digits.
#
# **Word order and agreement.** Extremaduran adjectives **follow** the noun and
# **agree** with it in gender, so the composition messages invert the English
# order and every describing word that inflects selects on `$gender`. "thick
# dashed red line" comes out as «linia gorda descontinua colorá». The agreement
# is real, not an invariant form: the two-way `[f]` / `*[m]` select is written
# out for every adjective that has two shapes, and the feminine of an -áu
# participle is -á, which is the shape that makes the file Extremaduran rather
# than Spanish — «puntiáu» / «puntiá», «coloráu» / «colorá».
#
# Nothing selects on `$role`: a clause position is carried by a preposition
# here, never by the adjective, so «con un bordi gordu» has the same word the
# standalone phrase does.
#
# Six colour words are invariable — «gris», «naranja», «verdi», «cian»,
# «azul», «rosa», «marrón» — and are cited once rather than as a select. That
# is Extremaduran morphology, not an untranslated string. Note «verdi», not
# «verde»: the -e → -i raising applies to the colour words too.
#
# **What is Extremaduran and what is borrowed.** «coloráu» (red), «gordu»,
# «hila» (row), «caha», «rellenu», «esti», «sin rellenal», «pos» and the whole
# -u / -i / -l shape of the words are Extremaduran. The geometry and
# typography nouns — «segmentu», «vector», «parábola», «polígonu»,
# «rectángulu», «tabla», «figura» — are the learned Romance layer a speaker
# meets through **Spanish**, the language of schooling in Extremadura, and are
# borrowed openly.
#
# **Counts.** CLDR has **no plural data for `ext`**, so no `[one]`, `[zero]`,
# `[two]`, `[few]` or `[many]` branch is written anywhere in this catalog.
# Nothing in this file is counted, so the question does not arise here at all.
#
# `noun-regular-polygon` splits: the side count follows the adjectives rather
# than sitting in front of the noun, so the head is «polígonu regulal» and the
# tail «de N laus».
#
# **Weakest first.** «poligonal» for *polyline* and «campu de pendientis» for
# *slope field* are guesses; so is whether a speaker would say «rellenu» or
# «henchíu» for a filled shape.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] negra
           *[m] negru
        }
    .white =
        { $gender ->
            [f] blanca
           *[m] blancu
        }
    .gray = gris
    .red =
        { $gender ->
            [f] colorá
           *[m] coloráu
        }
    .orange = naranja
    .yellow =
        { $gender ->
            [f] amarilla
           *[m] amarillu
        }
    .green = verdi
    .cyan = cian
    .blue = azul
    .purple =
        { $gender ->
            [f] morá
           *[m] moráu
        }
    .pink = rosa
    .brown = marrón
line-width =
    .thick =
        { $gender ->
            [f] gorda
           *[m] gordu
        }
    .thin =
        { $gender ->
            [f] fina
           *[m] finu
        }
line-style =
    .dashed =
        { $gender ->
            [f] descontinua
           *[m] descontinuu
        }
    .dotted =
        { $gender ->
            [f] puntiá
           *[m] puntiáu
        }
# Plural noun phrases, which is what follows «con» in `style-filled`. They
# agree with nothing.
fill-style =
    .horizontal = linias horizontalis
    .vertical = linias verticalis
    .diagonal = linias diagonalis
    .backdiagonal = linias diagonalis inversas
    .dots = puntus
    .diamonds = rombus
noun =
    .line = linia
    .line-segment = segmentu
    .ray = semirrecta
    .vector = vector
    .curve = curva
    .function = funcion
    .slope-field = campu de pendientis
    .vector-field = campu vectorial
    .parabola = parábola
    .polyline = poligonal
    .polygon = polígonu
    .triangle = triángulu
    .rectangle = rectángulu
    .circle = círculu
    .region = rehion
    .point = puntu
    .square = cuadráu
    .diamond = rombu
    .cross = cruz
    .plus = mas
# The side count follows the style adjectives so that they stay beside the noun
# they agree with.
noun-regular-polygon =
    { $part ->
        [tail] de { $numSides } laus
       *[head] polígonu regulal
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (polígonu, m) or
# the head of a phrase the description never names: `border` (bordi, m), `fill`
# (rellenu, m), `text` (textu, m), `background` (fondu, m).
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
# «bordi» is masculine, so the border's adjectives agree with it rather than
# with the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] con un bordi { $border }
        [and] i bordi { $border }
        [and-article] i un bordi { $border }
       *[with] con bordi { $border }
    }
# The fill-pattern words are plural noun phrases, because their other use is
# the «con { $pattern }» clause in `style-filled`. So this message supplies a
# noun for them to hang off — «rellenu», masculine, the gender `noun-gender`
# already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] rellenu { $color } con { $pattern }
       *[plain] rellenu { $color }
    }
style-unfilled = sin rellenal
style-text =
    { $parts ->
        [background] { $color } sobri un fondu { $background }
       *[plain] { $color }
    }
style-background-none = dengunu

## Boolean words

boolean-true = verdaeru
boolean-false = falsu

## Answer buttons

answer-submit-label = Comprebal
answer-submit-label-no-correctness = Mandal la respuesta

## Sectional blocks

section-name =
    .activity = Autividá
    .aside = Nota al margi
    .cascade = Cascá
    .definition = Definicion
    .example = Ehemplu
    .exercise = Ehercíciu
    .exercises = Ehercícius
    .given-answer = Respuesta
    .note = Nota
    .objectives = Ohetivus
    .paragraphs = Párrafus
    .part = Parti
    .problem = Prubrema
    .problems = Prubremas
    .proof = Demostracion
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

paginator-previous = Anteriol
paginator-next = Siguienti
paginator-page = Páhina
paginator-page-status = { $pageLabel } { $currentPage } de { $numPages }

## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = si
piecewise-condition-otherwise = si no

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. There is no published Extremaduran list of the elements for a seed
## to reproduce: science in Extremadura is taught in **Spanish**, out of
## Spanish textbooks, so the periodic table a pupil actually meets is
## `locales/es`'s. Writing an Extremaduran one here would be coinage, not
## translation.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Símbulu químicu no válidu
chemistry-invalid-ionic-compound = Compuestu iónicu no válidu

## Inputs embedded in math

math-embedded-input-blank = güecu
math-embedded-input-blank-ordinal = güecu { $ordinal } de { $total }
