# West Frisian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Frisian has two genders — common («de line») and neuter («it punt») — and an
# attributive adjective agrees with them in exactly one place: it takes `-e`
# everywhere except before an indefinite neuter singular, where it is the bare
# stem. «in reade line» against «in read punt». So every describing word below
# selects on `$gender` with two branches and no more.
#
# Nothing selects on `$role`. Frisian marks a clause position with a
# preposition rather than on the adjective, so «mei in tsjokke râne» and «in
# tsjokke râne» carry the same word, and a fork would write it twice.
#
# Adjectives precede the noun, so the composition messages keep the English
# order.
#
# The two dash words are past participles that already end in `-e`, which is
# why `dotted` writes no select: «stippele» is «stippele» in both genders, and
# a `[n]` branch would repeat its default. `dashed` does inflect, so it keeps
# one.


## Style vocabulary

color =
    .black =
        { $gender ->
            [n] swart
           *[c] swarte
        }
    .white =
        { $gender ->
            [n] wyt
           *[c] wite
        }
    .gray =
        { $gender ->
            [n] griis
           *[c] grize
        }
    .red =
        { $gender ->
            [n] read
           *[c] reade
        }
    .orange = oranje
    .yellow =
        { $gender ->
            [n] giel
           *[c] giele
        }
    .green =
        { $gender ->
            [n] grien
           *[c] griene
        }
    .cyan =
        { $gender ->
            [n] turkoais
           *[c] turkoaze
        }
    .blue =
        { $gender ->
            [n] blau
           *[c] blauwe
        }
    .purple =
        { $gender ->
            [n] pears
           *[c] pearse
        }
    .pink = roze
    .brown =
        { $gender ->
            [n] brún
           *[c] brune
        }

line-width =
    .thick =
        { $gender ->
            [n] tsjok
           *[c] tsjokke
        }
    .thin =
        { $gender ->
            [n] tin
           *[c] tinne
        }

line-style =
    .dashed =
        { $gender ->
            [n] streept
           *[c] streepte
        }
    .dotted = stippele

# Plural noun phrases, which is what follows «mei» in `style-filled`. A plural
# adjective always takes `-e`, so these agree with nothing.
fill-style =
    .horizontal = horizontale linen
    .vertical = fertikale linen
    .diagonal = diagonale linen
    .backdiagonal = omkearde diagonale linen
    .dots = stippen
    .diamonds = ruten

noun =
    .line = line
    .line-segment = linestik
    .ray = healline
    .vector = fektor
    .curve = kromme
    .function = funksje
    .parabola = parabool
    .polyline = brutsen line
    .polygon = polygoan
    .triangle = trijehoek
    .rectangle = rjochthoek
    .circle = sirkel
    .region = gebiet
    .point = punt
    .square = fjouwerkant
    .diamond = ruut
    .cross = krús
    .plus = plus

noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regelmjittige { $numSides }-hoek
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (polygoan, common)
# or the head of a phrase the description never names: `border` (râne, common),
# `fill` (folling, common), `text` (tekst, common), `background` (eftergrûn,
# common).
noun-gender =
    { $noun ->
        [line-segment] n
        [region] n
        [point] n
        [square] n
        [cross] n
       *[other] c
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

style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

style-filled-word =
    { $gender ->
        [n] follet
       *[c] follete
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } mei { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } mei { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } mei { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «râne» is common, so the border's adjectives agree with it rather than with
# the shape it surrounds. Frisian has an indefinite article, «in», so the two
# `-article` branches really do differ from the two without.
style-border-clause =
    { $parts ->
        [with-article] mei in { $border } râne
        [and] en { $border } râne
        [and-article] en in { $border } râne
       *[with] mei { $border } râne
    }

style-fill =
    { $parts ->
        [pattern] { $color } folling mei { $pattern }
       *[plain] { $color } folling
    }

style-unfilled = net follet

style-text =
    { $parts ->
        [background] { $color } op in { $background } eftergrûn
       *[plain] { $color }
    }

style-background-none = gjin


## Boolean words

boolean-true = wier
boolean-false = falsk


## Answer buttons

answer-submit-label = Kontrolearje
answer-submit-label-no-correctness = Antwurd ynstjoere


## Sectional blocks

section-name =
    .activity = Aktiviteit
    .aside = Terside
    .cascade = Kaskade
    .definition = Definysje
    .example = Foarbyld
    .exercise = Oefening
    .exercises = Oefeningen
    .given-answer = Antwurd
    .note = Notysje
    .objectives = Doelen
    .paragraphs = Alinea's
    .part = Diel
    .problem = Opjefte
    .problems = Opjeften
    .proof = Bewiis
    .question = Fraach
    .section = Haadstik
    .solution = Oplossing
    .task = Taak
    .theorem = Stelling

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Oanwizing


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabel { $enumeration }
        [numbered-title] Tabel { $enumeration }{ ": " }
        [unnumbered-title] Tabel{ ": " }
       *[unnumbered] Tabel
    }

figure-name =
    { $parts ->
        [numbered] Figuer { $enumeration }
        [numbered-caption] Figuer { $enumeration }{ ": " }
        [unnumbered-caption] Figuer{ ": " }
       *[unnumbered] Figuer
    }


## Paginator controls

paginator-previous = Foarige
paginator-next = Folgjende
paginator-page = Side

paginator-page-status = { $pageLabel } { $currentPage } fan { $numPages }


## Piecewise functions

piecewise-condition-or = of
piecewise-condition-if = as
piecewise-condition-otherwise = oars


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Secondary science in Fryslân is taught in Dutch, out of Dutch
## textbooks, so the chemical vocabulary a pupil meets is `locales/nl`'s rather
## than a Frisian table — there is nothing settled here for a seed to
## reproduce.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Unjildich chemysk symboal
chemistry-invalid-ionic-compound = Unjildige ioanyske ferbining
