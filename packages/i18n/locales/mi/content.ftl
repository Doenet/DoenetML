# Māori content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Māori has no grammatical gender, no adjective agreement, no case and no
# indefinite/definite distinction that a description like these has to make, so
# `$gender` and `$role` go unused here exactly as they do in English, and the
# two `-article` branches read like the ones without.
#
# Adjectives *follow* the noun they modify — «rārangi mātotoru whero» — so the
# composition messages put the noun first and keep the English order among the
# adjectives themselves.
#
# THE MATHEMATICAL NOUNS are the part of this seed most in need of a speaker:
# te reo Māori has a settled mathematics vocabulary taught in kura, and where
# this catalog has reached for a familiar word rather than that vocabulary's
# own term, the term should replace it. `noun` and `fill-style` are where to
# look first.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

color =
    .black = pango
    .white = mā
    .gray = kiwikiwi
    .red = whero
    .orange = karaka
    .yellow = kōwhai
    .green = kākāriki
    .cyan = kākāriki kikorangi
    .blue = kikorangi
    .purple = waiporoporo
    .pink = māwhero
    .brown = parauri
line-width =
    .thick = mātotoru
    .thin = angiangi
line-style =
    .dashed = motumotu
    .dotted = ira
# Noun phrases: they follow «me» and modify nothing.
fill-style =
    .horizontal = rārangi whakapae
    .vertical = rārangi whakatū
    .diagonal = rārangi hauroki
    .backdiagonal = rārangi hauroki whakamuri
    .dots = ira
    .diamonds = taimana
noun =
    .line = rārangi
    .line-segment = wāhanga rārangi
    .ray = hihi
    .vector = kōpapa
    .curve = ānau
    .function = taumahi
    .parabola = parapora
    .polyline = rārangi maha
    .polygon = tapamaha
    .triangle = tapatoru
    .rectangle = tapawhā hāngai
    .circle = porowhita
    .region = rohe
    .point = ira
    .square = tapawhā rite
    .diamond = taimana
    .cross = ripeka
    .plus = tohu tāpiri
# The side count follows the noun and precedes its adjectives, so it folds into
# the head and there is no tail: «tapamaha ōrite { $numSides } taha».
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] tapamaha ōrite { $numSides } taha
    }
# Māori has no grammatical gender, so every noun answers the same and the
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
# The noun leads and its adjectives follow: «rārangi mātotoru motumotu whero».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = kī
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } me { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } me { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } me { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
style-border-clause =
    { $parts ->
        [with-article] me te tapa { $border }
        [and] me te tapa { $border }
        [and-article] me te tapa { $border }
       *[with] me te tapa { $border }
    }
# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = kore kī
style-text =
    { $parts ->
        [background] { $color } i runga i te papamuri { $background }
       *[plain] { $color }
    }
style-background-none = kāore

## Boolean words

boolean-true = pono
boolean-false = hē

## Answer buttons

answer-submit-label = Tirohia te mahi
answer-submit-label-no-correctness = Tukuna te whakautu

## Sectional blocks

section-name =
    .activity = Ngohe
    .aside = Kōrero taha
    .cascade = Raupapa
    .definition = Whakamāramatanga
    .example = Tauira
    .exercise = Mahi whakaharatau
    .exercises = Mahi whakaharatau
    .given-answer = Whakautu
    .note = Tuhipoka
    .objectives = Whāinga
    .paragraphs = Kōwae
    .part = Wāhanga
    .problem = Rapanga
    .problems = Rapanga
    .proof = Whakaūnga
    .question = Pātai
    .section = Wāhanga
    .solution = Otinga
    .task = Mahi
    .theorem = Kaupapa
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Tohutohu

## Tables and figures

table-name =
    { $parts ->
        [numbered] Ripanga { $enumeration }
        [numbered-title] Ripanga { $enumeration }{ ": " }
        [unnumbered-title] Ripanga{ ": " }
       *[unnumbered] Ripanga
    }
figure-name =
    { $parts ->
        [numbered] Whakaahua { $enumeration }
        [numbered-caption] Whakaahua { $enumeration }{ ": " }
        [unnumbered-caption] Whakaahua{ ": " }
       *[unnumbered] Whakaahua
    }

## Paginator controls

paginator-previous = Mua
paginator-next = Muri
paginator-page = Whārangi
paginator-page-status = { $pageLabel } { $currentPage } o { $numPages }

## Piecewise functions

# «rānei» is Māori's word for "or", and it properly *follows* each alternative
# rather than standing between them. The core writes this word between two
# domains and cannot repeat it after each, so what it renders is the word in a
# position Māori does not normally put it. It is the right word and the wrong
# place, which is worth a speaker's attention.
piecewise-condition-or = rānei
piecewise-condition-if = mēnā
piecewise-condition-otherwise = ki te kore

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Te reo Māori science teaching does coin terms, but there is no settled list
## of all 118 element names to seed from, and inventing one would put invented
## words in front of a student instead of the English their textbook also
## prints. A Māori-medium chemistry list is exactly the kind of thing a speaker
## should add here, and adding it needs no permission.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Tohu matū muhu
chemistry-invalid-ionic-compound = Pūhui iona muhu
