# Inari Sami content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
# Latin script, Inari Sami orthography.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Inari Sami shares `č`, `š`, `ž`, `đ` and `ŋ` with Northern Sami, but it also
# writes `â` and `ä`, which Northern Sami does not have at all, and `â` is not
# a variant spelling of `á`: «čáhpis» and «nommâ» carry two different vowels
# and swapping them is an error. The colour table below is where a reader will
# see the difference first — «ruopsis», «ruonâs», «ruškâd», «vielgâd» against
# Northern «rukses», «ruoná», «ruškes», «vilges».
#
# This catalog selects on neither `$gender` nor `$role`. Inari Sami has no
# grammatical gender, and an adjective standing in front of a noun takes a
# special **attributive** form that agrees with nothing at all: not with the
# noun's case, not with its number. So «ruopsis» is the word in every
# position, and a `$role` fork would write four copies of one string.
#
# The attributive is not the same word as the predicative — «ruopsâd» is what
# a line *is*, «ruopsis» is what goes in front of a noun — and the two
# positions these words are rendered in want different ones. Every composed
# description puts the adjective in front of a noun and wants the attributive;
# only `backgroundColor` and `textColor` standing alone, reported as bare
# state variables, would want the predicative. This catalog writes the
# attributive throughout, so those two read as the front half of a phrase
# whose noun has not arrived. That is the same trade `locales/se` makes, and
# for the same reason: `$role` cannot tell the two positions apart, because
# `standalone` is both of them.
#
# Adjectives precede the noun, as in English, so the composition messages at
# the foot of the file keep the English order.
#
# The colours borrowed whole — «oránži», «turkos», «violetti», «roosâ» — have
# no attributive of their own and are cited in one shape. Inari Sami borrows
# from Finnish where the other Sami languages borrow from Norwegian or
# Swedish, which is why these four do not look like their Northern Sami
# counterparts even where the two languages borrowed the same colour.
#
# The words this seed had to build rather than find, and so the first things
# to check: «sárgálâš» and «čuoggálâš» for the two dash patterns, on the
# productive `-lâš` suffix from «sárgi» and «čuoggá»; «tevdimettum» for
# unfilled, on the caritive `-mettum`; and «Čuolmâ» for a problem, the
# cognate of Northern «čuolbma». The two field nouns «luoitâmkietti» and
# «vektorkietti» are built on «kietti», a meadow — Inari Sami has no
# established term for a mathematical field, and this is the word the other
# Sami languages reach for.


# **This is the most internally consistent of the five Sami catalogs**, and
# the source line / geometric line split declared below is honoured in every
# one of its ten messages. One inconsistency was found and fixed:
# `editor-accessibility-title` called the accessibility advisories
# «lasetiäđuh», "additional information", where
# `editor-accessibility-label` beside it counts «lasi juksâmvuođâ ravvim» —
# English writes "additional accessibility recommendations" in both, and
# `locales/sma` and `locales/smj` use one word in both. It is «ravvim» in
# both now, which does not collide with `hint-title = Räävi`.
#
# The renderer and parse-tree-node collisions `locales/sma`'s header records
# are here too, inherited from `locales/se`. «saargâ» being both a matrix
# column and the stroke of a hatch pattern is left alone: it is used
# consistently in each sense, and `locales/sma` and `locales/smj` borrowed
# («kolovne», «kolonna») where this one did not.


## Style vocabulary

color =
    .black = čáhpis
    .white = vielgâd
    .gray = ránis
    .red = ruopsis
    .orange = oránži
    .yellow = fiskes
    .green = ruonâs
    .cyan = turkos
    .blue = alle
    .purple = violetti
    .pink = roosâ
    .brown = ruškâd
line-width =
    .thick = assâd
    .thin = seggi
line-style =
    .dashed = sárgálâš
    .dotted = čuoggálâš
# Comitative plurals. The `-guin` ending is Inari Sami's own word for "with",
# which is why `style-filled` below places these straight after the colour and
# writes no preposition of its own: the ending already said it.
fill-style =
    .horizontal = horisontaal sárgáiguin
    .vertical = vertikaal sárgáiguin
    .diagonal = diagonaal sárgáiguin
    .backdiagonal = nuubi kuávlun diagonaal sárgáiguin
    .dots = čuoggáiguin
    .diamonds = rombâiguin
noun =
    .line = linjá
    .line-segment = linjáuási
    .ray = peelilinjá
    .vector = vektor
    .curve = kurva
    .function = funktio
    .slope-field = luoitâmkietti
    .vector-field = vektorkietti
    .parabola = parabel
    .polyline = maaŋgâlinjá
    .polygon = polygon
    .triangle = kuulmâčiegâ
    .rectangle = rektangel
    .circle = sirkkeel
    .region = kuávlu
    .point = čuoggá
    .square = kvadraat
    .diamond = romb
    .cross = ruossâ
    .plus = plus
# Inari Sami keeps the side count in front of the noun, so the whole of it is
# one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] täsimiärusâš { $numSides }-peleliš polygon
    }
# Inari Sami has no grammatical gender, so nothing above reads this and every
# noun answers alike. It is here because the argument is passed to every
# adjective and a message that resolves to nothing would render
# `{noun-gender}`.
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
style-filled-word = tevdum
# The pattern words carry their own «with» in their comitative ending, so
# nothing is written between them and what they follow.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «raajáin» is «raajâ», a border, in the comitative — the case that carries
# "with" — so the clause needs no preposition either. Inari Sami has no
# article, so the two `-article` branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] { $border } raajáin
        [and] já { $border } raajáin
        [and-article] já { $border } raajáin
       *[with] { $border } raajáin
    }
style-fill =
    { $parts ->
        [pattern] { $color } tevdim { $pattern }
       *[plain] { $color } tevdim
    }
style-unfilled = tevdimettum
style-text =
    { $parts ->
        [background] { $color } { $background } tuogážáin
       *[plain] { $color }
    }
style-background-none = ij maidnii

## Boolean words

boolean-true = tuotâ
boolean-false = epituotâ

## Answer buttons

answer-submit-label = Tärkkist pargo
answer-submit-label-no-correctness = Vuolgât västidâs

## Sectional blocks

section-name =
    .activity = Toimâ
    .aside = Lasetekstâ
    .cascade = Kaskaad
    .definition = Miäruštâllâm
    .example = Ovdâmerkkâ
    .exercise = Hárjuttâs
    .exercises = Hárjuttâsah
    .given-answer = Västidâs
    .note = Merkkâšume
    .objectives = Ulmeh
    .paragraphs = Tekstâuásih
    .part = Uási
    .problem = Čuolmâ
    .problems = Čuolmah
    .proof = Tuođâštus
    .question = Koččâmuš
    .section = Kapittâl
    .solution = Čuávdus
    .task = Pargo
    .theorem = Teoreem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Räävi

## Tables and figures

table-name =
    { $parts ->
        [numbered] Taavlâ { $enumeration }
        [numbered-title] Taavlâ { $enumeration }{ ": " }
        [unnumbered-title] Taavlâ{ ": " }
       *[unnumbered] Taavlâ
    }
figure-name =
    { $parts ->
        [numbered] Kove { $enumeration }
        [numbered-caption] Kove { $enumeration }{ ": " }
        [unnumbered-caption] Kove{ ": " }
       *[unnumbered] Kove
    }

## Paginator controls

paginator-previous = Ovdeb
paginator-next = Puátteem
paginator-page = Sijđo
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = teikkâ
piecewise-condition-if = jis
piecewise-condition-otherwise = muđoi

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Inari Sami schooling in Finland does not reach secondary chemistry
## in the language: that subject is taught in Finnish, and the element names
## an Inari Sami pupil meets are the Finnish ones. The English fallback is
## closer to the student's own textbook than 118 invented coinages would be,
## and a coined table would report a fact about this seed rather than about
## the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Kelbottes kemiallâš symbol
chemistry-invalid-ionic-compound = Kelbottes ionlâš oovtâstâs
