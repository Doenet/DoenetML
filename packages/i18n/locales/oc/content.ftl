# Occitan content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Languedocian reference variety, in classical orthography.
#
# Occitan has two genders and its adjectives **follow** the noun, so the
# composition messages at the foot of the file invert the English order and
# every describing word selects on `$gender`. Nothing selects on `$role`: a
# clause position is carried by a preposition and never by the adjective, so
# «amb una bordadura espessa» has the same word the standalone phrase does.
#
# Three colour words are invariable loans — «irange», «cian», «marron» — and
# are cited in one shape. That the table is uneven is a fact about which
# colours Occitan inherited and which it borrowed, not an unfinished branch.
#
# `noun-regular-polygon` is the case the `$part` split exists for: the side
# count follows the adjectives rather than sitting in front of the noun, so the
# head is «poligòn regular» and the tail «amb N costats», and
# `style-with-noun` places the two around the description.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] negra
           *[m] negre
        }
    .white =
        { $gender ->
            [f] blanca
           *[m] blanc
        }
    .gray =
        { $gender ->
            [f] grisa
           *[m] gris
        }
    .red =
        { $gender ->
            [f] roja
           *[m] roge
        }
    .orange = irange
    .yellow =
        { $gender ->
            [f] jauna
           *[m] jaune
        }
    .green =
        { $gender ->
            [f] verda
           *[m] verd
        }
    .cyan = cian
    .blue =
        { $gender ->
            [f] blava
           *[m] blau
        }
    .purple =
        { $gender ->
            [f] violeta
           *[m] violet
        }
    .pink =
        { $gender ->
            [f] ròsa
           *[m] ròse
        }
    .brown = marron

line-width =
    .thick =
        { $gender ->
            [f] espessa
           *[m] espès
        }
    .thin =
        { $gender ->
            [f] prima
           *[m] prim
        }

line-style =
    .dashed =
        { $gender ->
            [f] discontinua
           *[m] discontinu
        }
    .dotted =
        { $gender ->
            [f] puntejada
           *[m] puntejat
        }

# Plural noun phrases, which is what follows «amb» in `style-filled`. They
# agree with nothing.
fill-style =
    .horizontal = linhas orizontalas
    .vertical = linhas verticalas
    .diagonal = linhas diagonalas
    .backdiagonal = linhas diagonalas inversas
    .dots = punts
    .diamonds = lausanjas

noun =
    .line = linha
    .line-segment = segment
    .ray = semidrecha
    .vector = vector
    .curve = corba
    .function = foncion
    .parabola = parabòla
    .polyline = linha brisada
    .polygon = poligòn
    .triangle = triangle
    .rectangle = rectangle
    .circle = cercle
    .region = region
    .point = punt
    .square = carrat
    .diamond = lausanja
    .cross = crotz
    .plus = mai

noun-regular-polygon =
    { $part ->
        [tail] amb { $numSides } costats
       *[head] poligòn regular
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (poligòn, m) or the
# head of a phrase the description never names: `border` (bordadura, f), `fill`
# (emplenatge, m), `text` (tèxte, m), `background` (fons, m).
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [region] f
        [diamond] f
        [cross] f
        [border] f
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
        [f] emplenada
       *[m] emplenat
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } amb { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } amb { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } amb { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «bordadura» is feminine, so the border's adjectives agree with it rather than
# with the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] amb una bordadura { $border }
        [and] e bordadura { $border }
        [and-article] e una bordadura { $border }
       *[with] amb bordadura { $border }
    }

# The fill-pattern words are plural nouns, because their other use is the
# «amb { $pattern }» clause in `style-filled`. So this message supplies a noun
# for them to hang off — «emplenatge», masculine, which is the gender
# `noun-gender` already answers for `fill`, so the colour agrees with it in
# both variants.
style-fill =
    { $parts ->
        [pattern] emplenatge { $color } amb { $pattern }
       *[plain] emplenatge { $color }
    }

style-unfilled = pas emplenat

style-text =
    { $parts ->
        [background] { $color } sus un fons { $background }
       *[plain] { $color }
    }

style-background-none = cap


## Boolean words

boolean-true = verai
boolean-false = fals


## Answer buttons

answer-submit-label = Verificar
answer-submit-label-no-correctness = Mandar la responsa


## Sectional blocks

section-name =
    .activity = Activitat
    .aside = Nòta a despart
    .cascade = Cascada
    .definition = Definicion
    .example = Exemple
    .exercise = Exercici
    .exercises = Exercicis
    .given-answer = Responsa
    .note = Nòta
    .objectives = Objectius
    .paragraphs = Paragrafes
    .part = Partida
    .problem = Problèma
    .problems = Problèmas
    .proof = Demostracion
    .question = Question
    .section = Seccion
    .solution = Solucion
    .task = Prètzfach
    .theorem = Teorèma

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Indici


## Tables and figures

table-name =
    { $parts ->
        [numbered] Taula { $enumeration }
        [numbered-title] Taula { $enumeration }{ ". " }
        [unnumbered-title] Taula{ ". " }
       *[unnumbered] Taula
    }

figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ". " }
        [unnumbered-caption] Figura{ ". " }
       *[unnumbered] Figura
    }


## Paginator controls

paginator-previous = Precedenta
paginator-next = Seguenta
paginator-page = Pagina

paginator-page-status = { $pageLabel } { $currentPage } sus { $numPages }


## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = se
piecewise-condition-otherwise = siquenon


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Secondary science in Occitania is taught in French, out of French
## textbooks, so the chemical vocabulary a pupil meets is `locales/fr`'s rather
## than an Occitan table — there is nothing settled here for a seed to
## reproduce.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Simbòl quimic invalid
chemistry-invalid-ionic-compound = Compausat ionic invalid
