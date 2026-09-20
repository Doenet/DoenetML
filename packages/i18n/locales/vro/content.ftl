# Võro content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Võro is a written standard of its own rather than an Estonian spelling — see
# `chrome.ftl` for what that means and for the three places it shows: the `q`
# glottal stop, the letter `y`, and Võro's own vocabulary. This file is where
# the vocabulary point is loudest: red is «verrev» and not «punanõ», green is
# «haljas» and not «rohilinõ», an angle is a «nulk» and not a «nurk», and the
# three piecewise words below are «vai», «ku» and «muido» rather than
# Estonian's «või», «kui» and «muul juhul». None of those is a misspelling of
# the Estonian word beside it in `locales/et`.
#
# Võro has no grammatical gender, so `$gender` goes unused and `noun-gender`
# below is flat — the answer every Uralic catalog in this repository gives.
#
# **`$role` is a recorded gap, not a claim that Võro does not need it.** Võro
# inflects for case exactly as Estonian does, and `locales/et` next door forks
# every describing word three ways for it: nominative standing alone, genitive
# before the comitative «äärisega», adessive before the adessive «taustal».
# This catalog writes the nominative throughout and forks on nothing, because
# the seed is not confident enough in the oblique forms of Võro adjectives to
# invent thirty-six of them, and a wrong genitive is harder for a reviewer to
# spot than an absent one. The consequence is visible: `style-border-clause`
# and `style-text` below read as a nominative in front of an inflected noun,
# which is not what a speaker would say. The shape to add is the one in
# `locales/et`, key for key.
#
# The fill patterns carry their own comitative `-ga`, as in Estonian, so the
# messages that place them supply no connective of their own.


## Style vocabulary

color =
    .black = must
    .white = valgõ
    .gray = hall
    .red = verrev
    .orange = oraanž
    .yellow = kõllanõ
    .green = haljas
    .cyan = tsüaan
    .blue = sinine
    .purple = lilla
    .pink = roosa
    .brown = pruun
line-width =
    .thick = paks
    .thin = peenükene
line-style =
    .dashed = katkõlinõ
    .dotted = punktiirlinõ
# Comitative plurals — the case that renders as "with" in English. The ending
# carries the sense, so nothing is written in front of them where they stand.
fill-style =
    .horizontal = rõhtjuunõga
    .vertical = pistüjuunõga
    .diagonal = diagonaaljuunõga
    .backdiagonal = vastapiten diagonaaljuunõga
    .dots = punktõga
    .diamonds = rombõga
noun =
    .line = sirgõ
    .line-segment = lõik
    .ray = kiir
    .vector = vektor
    .curve = kõvvõr
    .function = funktsioon
    .slope-field = tõsuvälli
    .vector-field = vektorivälli
    .parabola = parabuul
    .polyline = murdjuun
    .polygon = hulknulk
    .triangle = kolmnulk
    .rectangle = ristkülik
    .circle = ringjuun
    .region = piirkund
    .point = punkt
    .square = ruut
    .diamond = romb
    .cross = rist
    .plus = pluss
# Võro keeps the side count in front of the noun, so the whole of it is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] korrapäränõ { $numSides }-nulk
    }
# Võro has no grammatical gender, so every noun answers the same and the answer
# goes unused — the same thing `locales/en` and `locales/et` do, down to the
# constant they answer.
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
# A participle, which does not decline here, so it needs neither argument.
style-filled-word = täüdet
# `{ $pattern }` is already comitative, so no connective is written.
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
# «äärega» is the comitative of «äär», and it is the ending rather than a
# preposition that says "with" — so the clause opens on the border's own
# adjectives. Võro has no article, so the two `-article` branches read like the
# two without. The colour in front of «äärega» should be a genitive and is a
# nominative here; that is the `$role` gap the header records.
style-border-clause =
    { $parts ->
        [with-article] { $border } äärega
        [and] ja { $border } äärega
        [and-article] ja { $border } äärega
       *[with] { $border } äärega
    }
# The fill-pattern words are comitatives, so this message supplies «täüdüs» for
# the colour to stand with; the pattern follows it already inflected.
style-fill =
    { $parts ->
        [pattern] { $color } täüdüs { $pattern }
       *[plain] { $color } täüdüs
    }
style-unfilled = täütmäldäq
# «tagapõhja pääl» is where Estonian writes the adessive «taustal». The colour
# in front of it should agree with it and does not; see the header.
style-text =
    { $parts ->
        [background] { $color } { $background } tagapõhja pääl
       *[plain] { $color }
    }
style-background-none = ei olõq

## Boolean words

boolean-true = tõsi
boolean-false = vale

## Answer buttons

answer-submit-label = Kontrolliq
answer-submit-label-no-correctness = Saadaq vastus

## Sectional blocks

section-name =
    .activity = Tegevüs
    .aside = Kõrvalejutt
    .cascade = Kaskaat
    .definition = Määrätüs
    .example = Näüdüs
    .exercise = Harjotus
    .exercises = Harjotusõq
    .given-answer = Vastus
    .note = Märkmine
    .objectives = Sihiq
    .paragraphs = Lõiguq
    .part = Osa
    .problem = Ülesannõq
    .problems = Ülesandõq
    .proof = Tõõstus
    .question = Küsümüs
    .section = Jago
    .solution = Lahendus
    .task = Tüü
    .theorem = Teoreem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Vihjeq

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabõl { $enumeration }
        [numbered-title] Tabõl { $enumeration }{ ". " }
        [unnumbered-title] Tabõl{ ". " }
       *[unnumbered] Tabõl
    }
figure-name =
    { $parts ->
        [numbered] Joonis { $enumeration }
        [numbered-caption] Joonis { $enumeration }{ ". " }
        [unnumbered-caption] Joonis{ ". " }
       *[unnumbered] Joonis
    }

## Paginator controls

paginator-previous = Endine
paginator-next = Perämine
paginator-page = Lehekülg
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## All three are Võro's own words rather than the Estonian ones: «vai» for
## «või», «ku» for «kui», «muido» for «muul juhul». «ku» opens the clause it
## conditions and so places straight in front of the mathematics, which is
## where the renderer puts it — none of the trouble `locales/kpv` and
## `locales/udm` record with their clause-final particle arises here.

piecewise-condition-or = vai
piecewise-condition-if = ku
piecewise-condition-otherwise = muido

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Võrumaa is taught in
## Estonian, from Estonian textbooks, so the element names a Võro-speaking
## pupil meets are the Estonian ones in `locales/et` — and the English
## fallback stands nearer their own textbook than 118 invented Võro coinages
## would. Anyone who wants the Estonian table has it one directory away.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Vigalinõ keemiline sümbol
chemistry-invalid-ionic-compound = Vigalinõ iuunlinõ ütend
