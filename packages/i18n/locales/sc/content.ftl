# Sardinian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Limba Sarda Comuna, the written standard the Regione Autònoma
# de Sardigna publishes in. Campidanese and Logudorese readers arrive at this
# catalog under `sc` and get the common standard; a variety that wants its own
# spelling supplies a catalog of its own as `localeResources`.
#
# Sardinian adjectives **follow** the noun and agree with it, so the
# composition messages invert the English order and every describing word that
# inflects selects on `$gender`. Nothing selects on `$role`: a clause position
# is carried by a preposition and never by the adjective.
#
# Several colour words end in `-e` or are borrowed whole — «birde», «tzianu»,
# «viola», «rosa», «marrone», «aranzu» — and have one form for both genders,
# so they are cited in one shape.
#
# `noun-regular-polygon` splits: the side count follows the adjectives rather
# than sitting in front of the noun, so the head is «polìgonu regulare» and the
# tail «de N lados».


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] niedda
           *[m] nieddu
        }
    .white =
        { $gender ->
            [f] bianca
           *[m] biancu
        }
    .gray =
        { $gender ->
            [f] grisa
           *[m] grisu
        }
    .red =
        { $gender ->
            [f] ruja
           *[m] ruju
        }
    .orange = aranzu
    .yellow =
        { $gender ->
            [f] groga
           *[m] grogu
        }
    .green = birde
    .cyan = tzianu
    .blue =
        { $gender ->
            [f] asula
           *[m] asulu
        }
    .purple = viola
    .pink = rosa
    .brown = marrone

line-width =
    .thick =
        { $gender ->
            [f] grussa
           *[m] grussu
        }
    .thin =
        { $gender ->
            [f] fina
           *[m] finu
        }

line-style =
    .dashed =
        { $gender ->
            [f] tratzeggiada
           *[m] tratzeggiadu
        }
    .dotted =
        { $gender ->
            [f] puntinada
           *[m] puntinadu
        }

# Plural noun phrases, which is what follows «cun» in `style-filled`. They
# agree with nothing.
fill-style =
    .horizontal = lineas orizontales
    .vertical = lineas verticales
    .diagonal = lineas diagonales
    .backdiagonal = lineas diagonales imbersas
    .dots = puntos
    .diamonds = rombos

noun =
    .line = reta
    .line-segment = segmentu
    .ray = semireta
    .vector = vetore
    .curve = curva
    .function = funtzione
    .parabola = paràbola
    .polyline = linea segada
    .polygon = polìgonu
    .triangle = triàngulu
    .rectangle = retàngulu
    .circle = chircu
    .region = regione
    .point = puntu
    .square = cuadradu
    .diamond = rombu
    .cross = rughe
    .plus = prus

noun-regular-polygon =
    { $part ->
        [tail] de { $numSides } lados
       *[head] polìgonu regulare
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (polìgonu, m) or
# the head of a phrase the description never names: `border` (oru, m), `fill`
# (prenidura, f), `text` (testu, m), `background` (fundu, m).
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
        [f] prena
       *[m] prenu
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } cun { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } cun { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } cun { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «oru» is masculine, so the border's adjectives agree with it rather than with
# the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] cun unu oru { $border }
        [and] e oru { $border }
        [and-article] e unu oru { $border }
       *[with] cun oru { $border }
    }

# The fill-pattern words are plural nouns, because their other use is the
# «cun { $pattern }» clause in `style-filled`. So this message supplies a noun
# for them to hang off — «prenidura», feminine, which is the gender
# `noun-gender` already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] prenidura { $color } cun { $pattern }
       *[plain] prenidura { $color }
    }

style-unfilled = no prenu

style-text =
    { $parts ->
        [background] { $color } subra unu fundu { $background }
       *[plain] { $color }
    }

style-background-none = perunu


## Boolean words

boolean-true = beru
boolean-false = farsu


## Answer buttons

answer-submit-label = Controlla
answer-submit-label-no-correctness = Imbia sa risposta


## Sectional blocks

section-name =
    .activity = Atividade
    .aside = Nota a banda
    .cascade = Cascada
    .definition = Definitzione
    .example = Esèmpiu
    .exercise = Esertzìtziu
    .exercises = Esertzìtzios
    .given-answer = Risposta
    .note = Nota
    .objectives = Obietivos
    .paragraphs = Paràgrafos
    .part = Parte
    .problem = Problema
    .problems = Problemas
    .proof = Dimustratzione
    .question = Pregunta
    .section = Setzione
    .solution = Solutzione
    .task = Incàrrigu
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

hint-title = Cussìgiu


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabella { $enumeration }
        [numbered-title] Tabella { $enumeration }{ ". " }
        [unnumbered-title] Tabella{ ". " }
       *[unnumbered] Tabella
    }

figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ". " }
        [unnumbered-caption] Figura{ ". " }
       *[unnumbered] Figura
    }


## Paginator controls

paginator-previous = Pretzedente
paginator-next = Sighente
paginator-page = Pàgina

paginator-page-status = { $pageLabel } { $currentPage } de { $numPages }


## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = si
piecewise-condition-otherwise = si nono


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Secondary science in Sardinia is taught in Italian, out of Italian
## textbooks, so the chemical vocabulary a pupil meets is `locales/it`'s rather
## than a Sardinian table — there is nothing settled here for a seed to
## reproduce.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Sìmbulu chìmicu non vàlidu
chemistry-invalid-ionic-compound = Cumpostu iònicu non vàlidu
