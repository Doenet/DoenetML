# Mapudungun content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Alfabeto Mapuche Unificado, which is the orthography most
# published Mapudungun uses. It is not the only one: Azümchefe and the Raguileo
# alphabet are both in use and both politically live, and choosing among them is
# not a neutral act. This catalog picks Unificado because more existing material
# is in it; a deployment that wants another supplies its own catalog as
# `localeResources`, which is the `locales/sc` arrangement.
#
# **This file is uneven on purpose, and the seam runs between the colours and the
# geometry.** The colour words, the width words and the everyday verbs are
# Mapudungun. The geometry nouns are largely Spanish, because Mapudungun-medium
# intercultural education in Chile and Argentina teaches mathematics out of
# Spanish materials and has no settled term for a ray or a parabola — there is
# nothing here for a seed to reproduce, and inventing eighteen geometric nouns
# would be a worse seed than a visible loan. Where that boundary should fall is
# the most useful thing a speaker could move in this catalog, and it is a
# judgement about language planning rather than a mistake to be fixed.
#
# Mapudungun has no grammatical gender and no adjective agreement, so
# `noun-gender` answers one token and nothing selects on it. Nothing selects on
# `$role`.
#
# The adjectives **precede** the noun, so `style-stroke` and `style-with-noun`
# are English's order, and `noun-regular-polygon` collapses to English's shape:
# the side count is a prenominal modifier, so the head holds it and the `[tail]`
# branch is empty.
#
# What English marks with a preposition Mapudungun marks with the postposition
# «mew», a free word, so nothing is welded to a placeable anywhere here.


## Style vocabulary

# All twelve inherited, and two of them are compounds the language itself
# builds: «kelü-chod» for orange between red and yellow, and «kallfü-karü» for
# cyan between blue and green. Mapudungun does distinguish «kallfü» from «karü»,
# which the other four Latin-American languages in this batch do not — it is the
# one colour table here that lines up with English's blue and green.
color =
    .black = kurü
    .white = lig
    .gray = kadü
    .red = kelü
    .orange = kelü-chod
    .yellow = chod
    .green = karü
    .cyan = kallfü-karü
    .blue = kallfü
    .purple = kelü-kallfü
    .pink = kelü-lig
    .brown = kolü

line-width =
    .thick = motrin
    .thin = trongli

line-style =
    .dashed = katrüntuku
    .dotted = pichike troykülen

# Noun phrases. Mapudungun marks the plural with the free word «pu» before the
# noun rather than with a suffix, and a bare noun already reads as a kind, so
# these carry nothing.
fill-style =
    .horizontal = wirin ütrüfkülen
    .vertical = wirin witrañpramün
    .diagonal = wirin aylla
    .backdiagonal = wirin aylla wüñotun
    .dots = troykülen
    .diamonds = rombo

# The geometry nouns, and the loan boundary this file's header describes. «wirin»
# (line), «wallke» (round), «troy» (point) and «meli» / «küla» (four, three) are
# Mapudungun; ray, vector, parabola and the rest are Spanish, because the
# language has no settled term and the mathematics is taught in Spanish.
noun =
    .line = wirin
    .line-segment = wirin katrüntukun
    .ray = rayu
    .vector = bektor
    .curve = wallke wirin
    .function = funsion
    .parabola = parabola
    .polyline = fentren wirin
    .polygon = poligono
    .triangle = küla xoy
    .rectangle = rektangulu
    .circle = wallke
    .region = mapu
    .point = troy
    .square = meli xoy
    .diamond = rombo
    .cross = kürus
    .plus = yomümün chillka

# The side count precedes the noun, so the head holds it and the tail is empty —
# English's shape.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } xoy poligono kiñewkülen
    }

# One answer for every noun: Mapudungun has no grammatical gender, so nothing
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
# branch is unreachable from Mapudungun's own `noun-regular-polygon`; it is kept
# because it is what a partly-corrected catalog falls back to.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

style-filled-word = apolen

# «mew» is a postposition and a free word, so it follows `$pattern` without
# touching it. Mapudungun needs none of the workarounds `locales/qu` and
# `locales/ay` needed for this same message, and the reason is only that its
# comitative is a word rather than a suffix.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color }, { $pattern } mew
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun }, { $pattern } mew
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail }, { $pattern } mew
       *[plain] { $filled } { $color } { $noun }
    }

# Mapudungun has no article, so English's four branches are two distinct strings;
# all four are written out because they are four positions and a later correction
# to one need not be a correction to the others.
style-border-clause =
    { $parts ->
        [with-article] { $border } inaltu mew
        [and] ka { $border } inaltu
        [and-article] ka { $border } inaltu
       *[with] { $border } inaltu mew
    }

# Here the pattern is the head noun — "blue diamonds" — and the colour precedes
# it, so the phrase needs nothing at all.
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = apolenolu

style-text =
    { $parts ->
        [background] { $color }, { $background } furi mew
       *[plain] { $color }
    }

style-background-none = chemnorume


## Boolean words

boolean-true = rüf
boolean-false = koyla


## Answer buttons

answer-submit-label = Adkintuge ti küdaw
answer-submit-label-no-correctness = Werküge ti llowdungun


## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are the same
# word: Mapudungun marks the plural with the free «pu» rather than with a suffix,
# and a heading does not carry it.
section-name =
    .activity = Küdaw
    .aside = Ka dungu
    .cascade = Traytrayko
    .definition = Adentun
    .example = Pengelün
    .exercise = Chillkatun
    .exercises = Chillkatun
    .given-answer = Llowdungun
    .note = Pichi wirin
    .objectives = Duamniekan
    .paragraphs = Wirintukun
    .part = Trokiñ
    .problem = Weda dungu
    .problems = Weda dungu
    .proof = Rüfngelu pengelün
    .question = Ramtun
    .section = Wichuntukun
    .solution = Nornentun
    .task = Elufe küdaw
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

hint-title = Kellun


## Tables and figures

table-name =
    { $parts ->
        [numbered] Wirin waria { $enumeration }
        [numbered-title] Wirin waria { $enumeration }{ ": " }
        [unnumbered-title] Wirin waria{ ": " }
       *[unnumbered] Wirin waria
    }

figure-name =
    { $parts ->
        [numbered] Adentun { $enumeration }
        [numbered-caption] Adentun { $enumeration }{ ": " }
        [unnumbered-caption] Adentun{ ": " }
       *[unnumbered] Adentun
    }


## Paginator controls

paginator-previous = Wüne
paginator-next = Inan
paginator-page = Chillka

# «mew» follows what it governs and is a free word, so the total can stand where
# English puts it.
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = kam
piecewise-condition-if = feyti
piecewise-condition-otherwise = ka mew


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Mapudungun-medium intercultural education in Chile and Argentina
## reaches the primary grades; secondary chemistry is taught in Spanish out of
## Spanish textbooks, so the periodic table a pupil meets is `locales/es`'s. There
## is no settled Mapudungun table for a seed to reproduce — which is the same
## reason the geometry nouns above are Spanish, and this file's header says where
## that boundary is and why it is worth moving.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Weda chillka kimika
chemistry-invalid-ionic-compound = Weda trawün ionika
