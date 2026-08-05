# Quechua content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Southern Quechua (Cusco–Collao), trivocalic orthography.
#
# Quechua has no grammatical gender and no adjective agreement of any kind, so
# `noun-gender` answers one token and nothing selects on it. Nothing selects on
# `$role` either. What makes this catalog worth reading is not what it forks on
# but what it does **not**: its adjectives **precede** the noun, exactly as
# English's do, so `style-with-noun` and `style-stroke` are the English word
# order character for character. After six Romance catalogs that all had to
# invert it, one that does not is the useful contrast — the argument's shape was
# never about Romance.
#
# `noun-regular-polygon` collapses for the same reason. A Quechua side count is
# a prenominal modifier, «pichqa waqtayuq», so it sits in the head with the
# noun and the `[tail]` branch is empty — the one catalog in this batch where
# `$part` lands on English's answer rather than Spanish's.
#
# Every case relation is a **suffix**, and the constraint the README calls "an
# affix cannot be welded to a placeable" bites in exactly one message.
# `style-filled` wants the instrumental «-wan» on the fill pattern, which is a
# placeable; so the catalog names the value instead — «pallaynin { $pattern }»,
# "its design: diamonds", after the Andean word for a woven pattern. That is the
# README's first way out. Everywhere else the suffix lands on a word written
# here: «manyayuq» for the border, «qhipayuq» for the background,
# «p'anqamanta» for the page count.
#
# Three colour words are Spanish loans and are cited in one shape — «naranja»,
# «sian», «rombo» among the patterns. That the table mixes inherited and
# borrowed words is a fact about which colours Quechua names from its own stock,
# not an unfinished branch.


## Style vocabulary

color =
    .black = yana
    .white = yuraq
    .gray = uqi
    .red = puka
    .orange = naranja
    .yellow = q'illu
    .green = q'umir
    .cyan = sian
    .blue = anqas
    .purple = kulli
    .pink = panti
    .brown = ch'umpi

line-width =
    .thick = rakhu
    .thin = ñañu

line-style =
    .dashed = t'aqasqa
    .dotted = chiqchi

# Noun phrases, which is what the head of `style-fill` is. «-kuna» is written
# here because nothing precedes them to say how many.
fill-style =
    .horizontal = kinray siq'ikuna
    .vertical = sayaq siq'ikuna
    .diagonal = wingu siq'ikuna
    .backdiagonal = kutichisqa wingu siq'ikuna
    .dots = chiqchikuna
    .diamonds = rombokuna

noun =
    .line = siq'i
    .line-segment = siq'i phatma
    .ray = wach'i
    .vector = bektor
    .curve = q'iwi siq'i
    .function = funsyun
    .parabola = parabola
    .polyline = q'inqu siq'i
    .polygon = achka k'uchu
    .triangle = kinsa k'uchu
    .rectangle = suni tawa k'uchu
    .circle = muyu
    .region = k'iti
    .point = chimpu
    .square = tawa k'uchu
    .diamond = rombo
    .cross = chakana
    .plus = yapay unancha

# The side count is a prenominal modifier, so it stays in the head and the tail
# is empty — English's shape, reached by a different road. «-yuq» welds onto
# «waqta», which this catalog writes, not onto `$numSides`.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } waqtayuq kikin achka k'uchu
    }

# One answer for every noun: Quechua has no grammatical gender, so nothing
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

# The adjectives precede the noun, so this is English's order. The `[noun-tail]`
# branch is unreachable from Quechua's own `noun-regular-polygon`, which supplies
# no tail; it is kept because it is what a partly-corrected catalog falls back
# to, and dropping it would drop that catalog's side count.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

style-filled-word = hunt'asqa

# The pattern is a comitative complement, and Quechua's comitative is the suffix
# «-wan», which cannot be welded to `$pattern`. So the pattern is named rather
# than marked: «pallaynin { $pattern }» — "its design: diamonds".
style-filled =
    { $parts ->
        [pattern] { $filled } { $color }, pallaynin { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun }, pallaynin { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail }, pallaynin { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «-yuq», "having", lands on «manya» — the border — which this catalog writes,
# and the adjectives precede it. Quechua has no articles, so English's four
# branches collapse to two distinct strings; all four are written out because
# they are four positions and a later correction to one need not be a correction
# to the others.
style-border-clause =
    { $parts ->
        [with-article] { $border } manyayuq
        [and] hinaspa { $border } manyayuq
        [and-article] hinaspa { $border } manyayuq
       *[with] { $border } manyayuq
    }

# Here the pattern is the **head noun** — "blue diamonds" — so it needs no case
# suffix at all and the colour simply precedes it. The same value that had to be
# named in `style-filled` needs nothing here, which is what makes that message's
# workaround a fact about the position rather than about the word.
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = mana hunt'asqa

style-text =
    { $parts ->
        [background] { $background } qhipayuq { $color }
       *[plain] { $color }
    }

style-background-none = mana kanchu


## Boolean words

boolean-true = cheqaq
boolean-false = llulla


## Answer buttons

answer-submit-label = Llamk'ayta qhaway
answer-submit-label-no-correctness = Kutichiyta apachiy


## Sectional blocks

section-name =
    .activity = Ruray
    .aside = Yapa nisqa
    .cascade = Phaqcha
    .definition = Sut'ichay
    .example = Rikch'anachiy
    .exercise = Llamk'ana
    .exercises = Llamk'anakuna
    .given-answer = Kutichiy
    .note = Yuyachiy
    .objectives = Munasqakuna
    .paragraphs = Rakikuna
    .part = Phatma
    .problem = Sasachakuy
    .problems = Sasachakuykuna
    .proof = Rikuchiy
    .question = Tapuy
    .section = T'aqa
    .solution = Paskay
    .task = Ruranapaq
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

hint-title = Yanapay


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
        [numbered] Rikch'a { $enumeration }
        [numbered-caption] Rikch'a { $enumeration }{ ": " }
        [unnumbered-caption] Rikch'a{ ": " }
       *[unnumbered] Rikch'a
    }


## Paginator controls

paginator-previous = Ñawpaq
paginator-next = Qhipa
paginator-page = P'anqa

# The ablative «-manta» lands on «p'anqa», which this catalog writes, so the
# total precedes it and the whole reads "of N pages, Page 3".
paginator-page-status = { $numPages } p'anqamanta { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = icha
piecewise-condition-if = sichus
piecewise-condition-otherwise = mana chayqa


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Quechua-medium intercultural bilingual education reaches the primary
## grades and the early secondary ones; the periodic table is met in Spanish, out
## of Spanish textbooks, so the chemical vocabulary a pupil has is
## `locales/es`'s. There is no settled Quechua table for a seed to reproduce, and
## coining one over 118 entries would be worse than the English a student can at
## least check against their own book.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Mana allin unancha kimiku
chemistry-invalid-ionic-compound = Mana allin huñu iyoniku
