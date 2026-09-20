# Chichewa content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Chichewa reads `$gender` as the noun **class**, as the other Bantu catalogs
# in this repository do. `noun-gender` answers `c3`, `c5`, `c6`, `c7` or `c9`.
#
# Where Zulu, Xhosa and Kinyarwanda need two concord sets, Chichewa needs one:
# almost every describing word here is built from a noun with the associative
# `-a`, and the associative takes the class prefix. So the whole table is one
# column of prefixes applied to one stem apiece:
#
#   c3 w-   c5 l-   c6 a-   c7 ch-   c9 y-
#
# — «wofiira», «lofiira», «ofiira», «chofiira», «yofiira». The `-a` fuses with
# the vowel of the stem, which is why «-a kuda» is «wakuda» and «-a ofiira» is
# «wofiira»; both shapes are written out rather than derived.
#
# `c9` is the default and the class a loanword joins. Describing words follow
# the noun, and `$role` goes unused: Chichewa marks no case.
#
# The language is Chichewa and the catalog is `ny`, which is the code for it;
# CLDR renders that code "Nyanja", so that is the name the roster and
# `<document lang>`'s autocomplete show. Chewa, Chichewa and Nyanja are one
# language, and this file is all three.


## Style vocabulary

color =
    .black =
        { $gender ->
            [c3] wakuda
            [c5] lakuda
            [c6] akuda
            [c7] chakuda
           *[c9] yakuda
        }
    .white =
        { $gender ->
            [c3] woyera
            [c5] loyera
            [c6] oyera
            [c7] choyera
           *[c9] yoyera
        }
    .gray =
        { $gender ->
            [c3] wa imvi
            [c5] la imvi
            [c6] a imvi
            [c7] cha imvi
           *[c9] ya imvi
        }
    .red =
        { $gender ->
            [c3] wofiira
            [c5] lofiira
            [c6] ofiira
            [c7] chofiira
           *[c9] yofiira
        }
    .orange =
        { $gender ->
            [c3] wa lalanje
            [c5] la lalanje
            [c6] a lalanje
            [c7] cha lalanje
           *[c9] ya lalanje
        }
    .yellow =
        { $gender ->
            [c3] wachikasu
            [c5] lachikasu
            [c6] achikasu
            [c7] chachikasu
           *[c9] yachikasu
        }
    .green =
        { $gender ->
            [c3] wobiriwira
            [c5] lobiriwira
            [c6] obiriwira
            [c7] chobiriwira
           *[c9] yobiriwira
        }
    .cyan =
        { $gender ->
            [c3] wa buluu wobiriwira
            [c5] la buluu wobiriwira
            [c6] a buluu wobiriwira
            [c7] cha buluu wobiriwira
           *[c9] ya buluu wobiriwira
        }
    .blue =
        { $gender ->
            [c3] wa buluu
            [c5] la buluu
            [c6] a buluu
            [c7] cha buluu
           *[c9] ya buluu
        }
    .purple =
        { $gender ->
            [c3] wa pepo
            [c5] la pepo
            [c6] a pepo
            [c7] cha pepo
           *[c9] ya pepo
        }
    .pink =
        { $gender ->
            [c3] wa pinki
            [c5] la pinki
            [c6] a pinki
            [c7] cha pinki
           *[c9] ya pinki
        }
    .brown =
        { $gender ->
            [c3] wa bulawuni
            [c5] la bulawuni
            [c6] a bulawuni
            [c7] cha bulawuni
           *[c9] ya bulawuni
        }
line-width =
    .thick =
        { $gender ->
            [c3] wokhuthala
            [c5] lokhuthala
            [c6] okhuthala
            [c7] chokhuthala
           *[c9] yokhuthala
        }
    .thin =
        { $gender ->
            [c3] wowonda
            [c5] lowonda
            [c6] owonda
            [c7] chowonda
           *[c9] yowonda
        }
# An invariable «wokhala ndi …» would concord too, so the dash pattern is
# written as a bare «ndi …» phrase — "with …" — which agrees with nothing and
# closes the description. `style-stroke` puts it last for that reason.
line-style =
    .dashed = ndi zigamba
    .dotted = ndi timadontho
fill-style =
    .horizontal = mizere yopingasa
    .vertical = mizere yoyima
    .diagonal = mizere yopendama
    .backdiagonal = mizere yopendama mbali ina
    .dots = timadontho
    .diamonds = ma daimondi
noun =
    .line = mzere
    .line-segment = chigawo cha mzere
    .ray = cheza
    .vector = vekitala
    .curve = mzere wopindika
    .function = ntchito
    .parabola = parabola
    .polyline = mzere wa zigawo
    .polygon = chithunzi cha mbali zambiri
    .triangle = katatu
    .rectangle = chinayi cholunjika
    .circle = bwalo
    .region = dera
    .point = mfundo
    .square = chinayi cholingana
    .diamond = daimondi
    .cross = mtanda
    .plus = chizindikiro chowonjezera
# The side count goes in the tail, behind the describing words: Chichewa closes
# a noun phrase with a «cha …» complement rather than opening one with it.
noun-regular-polygon =
    { $part ->
        [tail] cha mbali { $numSides }
       *[head] chithunzi cholingana
    }
noun-gender =
    { $noun ->
        [line] c3
        [curve] c3
        [polyline] c3
        [cross] c3
        [border] c6
        [line-segment] c7
        [polygon] c7
        [square] c7
        [rectangle] c7
        [plus] c7
        [ray] c7
        [circle] c5
        [region] c5
        [text] c6
       *[other] c9
    }

## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width } { $color } { $lineStyle }
        [width-color] { $width } { $color }
        [style-color] { $color } { $lineStyle }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [c3] wodzazidwa
        [c5] lodzazidwa
        [c6] odzazidwa
        [c7] chodzazidwa
       *[c9] yodzazidwa
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ndi { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ndi { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } ndi { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «malire» is class 6, so the border's words agree with it and not with the
# shape it surrounds. Chichewa has no article and joins a complement with the
# invariable «ndi», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] ndi malire { $border }
        [and] ndi malire { $border }
        [and-article] ndi malire { $border }
       *[with] ndi malire { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = osadzazidwa
style-text =
    { $parts ->
        [background] { $color } pa mbuyo { $background }
       *[plain] { $color }
    }
style-background-none = palibe

## Boolean words

boolean-true = zoona
boolean-false = zabodza

## Answer buttons

answer-submit-label = Yang'anani Ntchito
answer-submit-label-no-correctness = Tumizani Yankho

## Sectional blocks

section-name =
    .activity = Ntchito
    .aside = Chowonjezera
    .cascade = Kutsatizana
    .definition = Tanthauzo
    .example = Chitsanzo
    .exercise = Chochita
    .exercises = Zochita
    .given-answer = Yankho
    .note = Chidziwitso
    .objectives = Zolinga
    .paragraphs = Ndime
    .part = Gawo
    .problem = Vuto
    .problems = Mavuto
    .proof = Umboni
    .question = Funso
    .section = Chigawo
    .solution = Yankho
    .task = Ntchito
    .theorem = Chiphunzitso
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Chithandizo

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tebulo { $enumeration }
        [numbered-title] Tebulo { $enumeration }{ ": " }
        [unnumbered-title] Tebulo{ ": " }
       *[unnumbered] Tebulo
    }
figure-name =
    { $parts ->
        [numbered] Chithunzi { $enumeration }
        [numbered-caption] Chithunzi { $enumeration }{ ": " }
        [unnumbered-caption] Chithunzi{ ": " }
       *[unnumbered] Chithunzi
    }

## Paginator controls

paginator-previous = Zapitazo
paginator-next = Zotsatira
paginator-page = Tsamba
paginator-page-status = { $pageLabel } { $currentPage } mwa { $numPages }

## Piecewise functions

piecewise-condition-or = kapena
piecewise-condition-if = ngati
piecewise-condition-otherwise = kupanda kutero

## Chemistry


# Chichewa is one of the catalogs that leaves `element-name` and
# `element-anion-name` out, so those 130 keys fall back to English. Malawian
# secondary science is taught in English, and there is no settled Chichewa list
# of the elements to seed from — the fallback is what a learner meets in their
# own textbook.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Chizindikiro cha Mankhwala Cholakwika
chemistry-invalid-ionic-compound = Chophatikiza cha Ayoni Cholakwika
