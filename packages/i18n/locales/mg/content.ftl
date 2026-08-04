# Malagasy content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Malagasy has no grammatical gender, no adjective agreement and no case, so
# `$gender` and `$role` go unused here exactly as they do in English.
#
# Adjectives *follow* the noun they modify — «tsipika matevina mena» — so the
# composition messages put the noun first, as the Austronesian languages of
# Indonesia in this same batch do, and keep the English order among the
# adjectives themselves.
#
# Malagasy has a definite article, «ny», but these descriptions are not
# definite: they say what a thing is like rather than pointing at a known one.
# So the two `-article` branches read like the ones without, and no «ny» is
# written into a description.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

color =
    .black = mainty
    .white = fotsy
    .gray = volondavenona
    .red = mena
    .orange = volomboasary
    .yellow = mavo
    .green = maitso
    .cyan = manga maitso
    .blue = manga
    .purple = volomparasy
    .pink = mavokely
    .brown = volontany

line-width =
    .thick = matevina
    .thin = manify

line-style =
    .dashed = tapatapaka
    .dotted = teboteboka

# Noun phrases: they follow «miaraka amin'ny» and modify nothing.
fill-style =
    .horizontal = tsipika mandry
    .vertical = tsipika mitsangana
    .diagonal = tsipika mihilana
    .backdiagonal = tsipika mihilana mifamadika
    .dots = teboka
    .diamonds = diamondra

noun =
    .line = tsipika
    .line-segment = sombin-tsipika
    .ray = taratra
    .vector = vektera
    .curve = tsipika miolaka
    .function = fiasa
    .parabola = parabola
    .polyline = tsipika misesy
    .polygon = polygonina
    .triangle = telozoro
    .rectangle = efamira
    .circle = faribolana
    .region = faritra
    .point = teboka
    .square = efajoro
    .diamond = diamondra
    .cross = lakroa
    .plus = marika fanampiana

# The side count follows the noun and precedes its adjectives, so it folds into
# the head and there is no tail: «polygonina ara-dalàna { $numSides } lafiny».
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] polygonina ara-dalàna { $numSides } lafiny
    }

# Malagasy has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English.
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

# The noun leads and its adjectives follow: «tsipika matevina tapatapaka mena».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = feno

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } miaraka amin'ny { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } miaraka amin'ny { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } miaraka amin'ny { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

style-border-clause =
    { $parts ->
        [with-article] miaraka amin'ny sisiny { $border }
        [and] ary sisiny { $border }
        [and-article] ary sisiny { $border }
       *[with] miaraka amin'ny sisiny { $border }
    }

# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = tsy feno

style-text =
    { $parts ->
        [background] { $color } amin'ny fotony { $background }
       *[plain] { $color }
    }

style-background-none = tsy misy


## Boolean words

boolean-true = marina
boolean-false = diso


## Answer buttons

answer-submit-label = Hamarino ny asa
answer-submit-label-no-correctness = Alefaso ny valiny


## Sectional blocks

section-name =
    .activity = Hetsika
    .aside = Fanamarihana anilany
    .cascade = Filaharana
    .definition = Famaritana
    .example = Ohatra
    .exercise = Fanazaran-tena
    .exercises = Fanazaran-tena
    .given-answer = Valiny
    .note = Fanamarihana
    .objectives = Tanjona
    .paragraphs = Andalana
    .part = Fizarana
    .problem = Olana
    .problems = Olana
    .proof = Porofo
    .question = Fanontaniana
    .section = Fizarana
    .solution = Vahaolana
    .task = Asa
    .theorem = Teôrema

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Toro-hevitra


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabilao { $enumeration }
        [numbered-title] Tabilao { $enumeration }{ ": " }
        [unnumbered-title] Tabilao{ ": " }
       *[unnumbered] Tabilao
    }

figure-name =
    { $parts ->
        [numbered] Sary { $enumeration }
        [numbered-caption] Sary { $enumeration }{ ": " }
        [unnumbered-caption] Sary{ ": " }
       *[unnumbered] Sary
    }


## Paginator controls

paginator-previous = Teo aloha
paginator-next = Manaraka
paginator-page = Pejy

paginator-page-status = { $pageLabel } { $currentPage } amin'ny { $numPages }


## Piecewise functions

piecewise-condition-or = na
piecewise-condition-if = raha
piecewise-condition-otherwise = raha tsy izany


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Secondary science in Madagascar is taught in French, so a Malagasy chemistry
## nomenclature is not something the school system settles — the same situation
## the sub-Saharan batch records for eight of its ten languages, and the reason
## it is a fact about a curriculum rather than about a language family.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Marika simika tsy mety
chemistry-invalid-ionic-compound = Fitambarana ionika tsy mety
