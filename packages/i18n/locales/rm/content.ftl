# Romansh content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Rumantsch Grischun, the common written standard and what CLDR
# fills a bare `rm` in as. The five idioms — Sursilvan, Sutsilvan, Surmiran,
# Puter and Vallader — differ from it in exactly the places a description like
# «ina lingia grassa cotschna» would show, so a deployment that wants one
# supplies its own catalog as `localeResources`; that is not a correction to
# this file.
#
# Romansh adjectives **follow** the noun and agree with it, so the composition
# messages invert the English order and every describing word that inflects
# selects on `$gender`. Nothing selects on `$role`: a clause position is
# carried by a preposition and never by the adjective.
#
# «oransch», «cian» and «rosa» are borrowed whole and have one form.
#
# `noun-regular-polygon` splits: the side count follows the adjectives rather
# than sitting in front of the noun, so the head is «poligon regular» and the
# tail «da N lats».


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] naira
           *[m] nair
        }
    .white =
        { $gender ->
            [f] alva
           *[m] alv
        }
    .gray =
        { $gender ->
            [f] grischa
           *[m] grisch
        }
    .red =
        { $gender ->
            [f] cotschna
           *[m] cotschen
        }
    .orange = oransch
    .yellow =
        { $gender ->
            [f] mellna
           *[m] mellen
        }
    .green =
        { $gender ->
            [f] verda
           *[m] verd
        }
    .cyan = cian
    .blue =
        { $gender ->
            [f] blaua
           *[m] blau
        }
    .purple =
        { $gender ->
            [f] violetta
           *[m] violet
        }
    .pink = rosa
    .brown =
        { $gender ->
            [f] bruna
           *[m] brun
        }
line-width =
    .thick =
        { $gender ->
            [f] grassa
           *[m] grass
        }
    .thin =
        { $gender ->
            [f] fina
           *[m] fin
        }
line-style =
    .dashed =
        { $gender ->
            [f] stritgada
           *[m] stritgà
        }
    .dotted =
        { $gender ->
            [f] puntinada
           *[m] puntinà
        }
# Plural noun phrases, which is what follows «cun» in `style-filled`. They
# agree with nothing.
fill-style =
    .horizontal = lingias orizontalas
    .vertical = lingias verticalas
    .diagonal = lingias diagonalas
    .backdiagonal = lingias diagonalas invertidas
    .dots = puncts
    .diamonds = rombs
noun =
    .line = retta
    .line-segment = segment
    .ray = semiretta
    .vector = vectur
    .curve = curva
    .function = funcziun
    .parabola = parabola
    .polyline = lingia rutta
    .polygon = poligon
    .triangle = triangul
    .rectangle = rectangul
    .circle = circul
    .region = regiun
    .point = punct
    .square = quadrat
    .diamond = romb
    .cross = crusch
    .plus = plus
noun-regular-polygon =
    { $part ->
        [tail] da { $numSides } lats
       *[head] poligon regular
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (poligon, m) or the
# head of a phrase the description never names: `border` (urlet, m), `fill`
# (emplenida, f), `text` (text, m), `background` (fund, m).
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
        [f] emplenida
       *[m] emplenì
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
# «urlet» is masculine, so the border's adjectives agree with it rather than
# with the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] cun in urlet { $border }
        [and] ed urlet { $border }
        [and-article] ed in urlet { $border }
       *[with] cun urlet { $border }
    }
# The fill-pattern words are plural nouns, because their other use is the
# «cun { $pattern }» clause in `style-filled`. So this message supplies a noun
# for them to hang off — «emplenida», feminine, which is the gender
# `noun-gender` already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] emplenida { $color } cun { $pattern }
       *[plain] emplenida { $color }
    }
style-unfilled = betg emplenì
style-text =
    { $parts ->
        [background] { $color } sin in fund { $background }
       *[plain] { $color }
    }
style-background-none = nagin

## Boolean words

boolean-true = ver
boolean-false = fauss

## Answer buttons

answer-submit-label = Controllar
answer-submit-label-no-correctness = Trametter la resposta

## Sectional blocks

section-name =
    .activity = Activitad
    .aside = Nota al marfin
    .cascade = Cascada
    .definition = Definiziun
    .example = Exempel
    .exercise = Exercizi
    .exercises = Exercizis
    .given-answer = Resposta
    .note = Nota
    .objectives = Objectivs
    .paragraphs = Paragrafs
    .part = Part
    .problem = Problem
    .problems = Problems
    .proof = Cumprova
    .question = Dumonda
    .section = Secziun
    .solution = Soluziun
    .task = Incaric
    .theorem = Teorem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Indicaziun

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

paginator-previous = Precedent
paginator-next = Proxim
paginator-page = Pagina
paginator-page-status = { $pageLabel } { $currentPage } da { $numPages }

## Piecewise functions

piecewise-condition-or = u
piecewise-condition-if = sche
piecewise-condition-otherwise = uschiglio

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Romansh-medium schooling in Grisons reaches primary and lower
## secondary; the upper grades where the periodic table is taught are German,
## so the chemical vocabulary a pupil meets is `locales/de`'s rather than a
## Romansh table — there is nothing settled here for a seed to reproduce.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbol chemic nunvalid
chemistry-invalid-ionic-compound = Colliaziun ionica nunvalida
