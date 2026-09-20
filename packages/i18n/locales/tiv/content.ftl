# Tiv content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `tiv` is Tiv, of the Benue valley in central Nigeria.
#
# **`$gender` is a noun class again, and the concord lands on a word of its
# own.** Tiv has very few true adjectives: what English writes as one is a verb
# of quality here, and a verb of quality modifies a noun through a relative
# particle — «u», «i» or «a» — chosen by the noun's class. So the class is
# spelled neither as a prefix on the describing word, the way the nineteen Bantu
# catalogs spell it, nor as a suffix, the way `locales/ff`, `locales/mos` and
# `locales/dag` do, but as a separate word standing in front of it:
#
#            c1 (u)     c2 (i)     c3 (a)
#   ii        u ii       i ii       a ii
#   pupu      u pupu     i pupu     a pupu
#   nyian     u nyian    i nyian    a nyian
#   vesen     u vesen    i vesen    a vesen
#   kiryan    u kiryan   i kiryan   a kiryan
#   iv        u iv       i iv       a iv
#
# That is the third place agreement can be written, and it arrives with the
# same argument and no change to anything outside this file — which is the
# whole of what `$gender` was for.
#
# **Only the words with a Tiv verb of quality take it.** The other colours are
# nouns, written bare, and they are the majority: this catalog forks on six
# words — three colours, both widths and the filled word — and leaves nine
# alone, which is `locales/ts`'s shape rather than `locales/zu`'s, Zulu forking
# all fifteen. A language with few adjectives has few places for agreement
# to land, and that is not less agreement — it is agreement landing on fewer
# words.
#
# `locales/tlh` reached a relative clause from the other end, having no
# adjectives at all and chaining «-bogh»; Tiv has the same shortage and a
# particle rather than a suffix, so its clauses chain by juxtaposition and need
# no conjunction.
#
# `$role` goes unused: Tiv marks no case.
#
# The mathematical nouns lean on the English loans Nigerian schooling supplies;
# where Tiv has its own word it is used — «ijiir» a place, «ikyav» a sign.
# They are the first thing to check.


## Style vocabulary

# Only the three with a Tiv verb of quality take the relative particle.
color =
    .black =
        { $gender ->
            [c1] u ii
            [c2] i ii
           *[c3] a ii
        }
    .white =
        { $gender ->
            [c1] u pupu
            [c2] i pupu
           *[c3] a pupu
        }
    .gray = ivu
    .red =
        { $gender ->
            [c1] u nyian
            [c2] i nyian
           *[c3] a nyian
        }
    .orange = alaje
    .yellow = yelo
    .green = girin
    .cyan = sayan
    .blue = bulu
    .purple = papul
    .pink = pinki
    .brown = buraun
line-width =
    .thick =
        { $gender ->
            [c1] u vesen
            [c2] i vesen
           *[c3] a vesen
        }
    .thin =
        { $gender ->
            [c1] u kiryan
            [c2] i kiryan
           *[c3] a kiryan
        }
# Written as invariable «man …» phrases rather than as quality verbs, so that
# they take no particle and can close the description. `style-stroke` puts them
# last.
line-style =
    .dashed = man ubaajir
    .dotted = man utindi
fill-style =
    .horizontal = ulayin mba ve tsa
    .vertical = ulayin mba ve tile
    .diagonal = ulayin mba ve gbe ken ijime
    .backdiagonal = ulayin mba ve gbe ken ijime i ugen
    .dots = utindi
    .diamonds = udayamon
noun =
    .line = layin
    .line-segment = ikyar i layin
    .ray = rei
    .vector = vekto
    .curve = layin u gbenden
    .function = fungshon
    .parabola = parabola
    .polyline = layin u akyar
    .polygon = poligon
    .triangle = trayangul
    .rectangle = rektangul
    .circle = sekul
    .region = ijiir
    .point = poyint
    .square = sikwe
    .diamond = dayamon
    .cross = korosu
    .plus = ikyav i seer
# The side count is a relative and closes the noun phrase behind the describing
# words rather than opening it, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] i a lu a atser { $numSides }
       *[head] poligon i a kuma
    }
# The noun class. `c3` is the default and the class a loanword joins, which is
# what an author's own `markerStyleWord` is as far as this catalog is
# concerned.
noun-gender =
    { $noun ->
        [line] c1
        [curve] c1
        [polyline] c1
        [ray] c1
        [border] c1
        [line-segment] c2
        [region] c2
        [polygon] c2
        [regular-polygon] c2
        [triangle] c2
        [rectangle] c2
        [square] c2
        [circle] c2
        [plus] c2
        [text] c2
        [fill] c2
       *[other] c3
    }

## Style composition

# The dash pattern is a «man …» phrase and closes the description, so it moves
# behind the colour rather than sitting between the width and it. Two quality
# clauses in a row simply stand side by side; Tiv needs no conjunction between
# them.
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
        [c1] u iv
        [c2] i iv
       *[c3] a iv
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } man { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } man { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } man { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «igbenda» is the border and leads its own describing words, so they agree
# with it rather than with the shape it surrounds. Tiv has no article and joins
# this clause with the invariable «man», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] man igbenda { $border }
        [and] man igbenda { $border }
        [and-article] man igbenda { $border }
       *[with] man igbenda { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = i iv ga
style-text =
    { $parts ->
        [background] { $color } sha ijime { $background }
       *[plain] { $color }
    }
style-background-none = ma kwagh ngu ga

## Boolean words

boolean-true = mimi
boolean-false = aie

## Answer buttons

answer-submit-label = Tôô Tom
answer-submit-label-no-correctness = Tindi Mlumun

## Sectional blocks

section-name =
    .activity = Tom
    .aside = Mseer
    .cascade = Mkuraiyol
    .definition = Mpase
    .example = Ikyav
    .exercise = Mtsen
    .exercises = Amtsen
    .given-answer = Mlumun
    .note = Mngerem
    .objectives = Mbaawashima
    .paragraphs = Akaa
    .part = Ikyar
    .problem = Zayol
    .problems = Azayol
    .proof = Ikyav i mimi
    .question = Mpin
    .section = Ikyar
    .solution = Mbem
    .task = Tom
    .theorem = Tiyorem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Mtesen

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tebur { $enumeration }
        [numbered-title] Tebur { $enumeration }{ ": " }
        [unnumbered-title] Tebur{ ": " }
       *[unnumbered] Tebur
    }
figure-name =
    { $parts ->
        [numbered] Ikyav { $enumeration }
        [numbered-caption] Ikyav { $enumeration }{ ": " }
        [unnumbered-caption] Ikyav{ ": " }
       *[unnumbered] Ikyav
    }

## Paginator controls

paginator-previous = U karen
paginator-next = U dondon
paginator-page = Peji
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = shin
piecewise-condition-if = aluer
piecewise-condition-otherwise = hen ajiir agen cii

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Nigeria teaches secondary science in English, so a
## Tiv speaker meets the periodic table there and the fallback *is* the
## curriculum — the same answer `locales/ha`, `locales/yo` and `locales/ig`
## give from the same ministry.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Ikyav i Kemistiri i i Doo Ga
chemistry-invalid-ionic-compound = Mkohol u Ayon u u Doo Ga
