# Filipino content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The directory is named `fil` rather than `tl`: `tl` is the deprecated code
# that `Intl.Locale` canonicalizes to `fil`, so `<document lang="tl">` reaches
# this catalog through `normalizeLocaleTag` and needs no alias of its own.
# `negotiate.test.ts` holds that.
#
# Filipino has no grammatical gender and no adjective agreement, so `$gender`
# and `$role` go unused here exactly as they do in English. Adjectives precede
# their noun, as in English.
#
# What Filipino adds is the **linker**, which joins an adjective to whatever
# follows it: `-ng` after a vowel and the separate word `na` after a consonant.
# Which of the two applies depends on the last letter of the word in front of
# it, and that word arrives as an argument this catalog never sees — so every
# join below is written as the separate `na`. That is grammatical after a
# consonant and merely uncontracted after a vowel: «pula na guhit» where a
# speaker would write «pulang guhit». It is the one place this seed is stiff on
# purpose rather than by oversight, and a speaker correcting it is correcting
# spelling and not structure.
#
# The element names are deliberately absent; see the note above the chemistry
# section.


## Style vocabulary

color =
    .black = itim
    .white = puti
    .gray = abo
    .red = pula
    .orange = kahel
    .yellow = dilaw
    .green = berde
    .cyan = asul-berde
    .blue = asul
    .purple = lila
    .pink = rosas
    .brown = kayumanggi

line-width =
    .thick = makapal
    .thin = manipis

line-style =
    .dashed = putol-putol
    .dotted = tuldok-tuldok

# Noun phrases: they follow «may» and modify nothing.
fill-style =
    .horizontal = pahigang mga guhit
    .vertical = patayong mga guhit
    .diagonal = pahilis na mga guhit
    .backdiagonal = kabaligtarang pahilis na mga guhit
    .dots = mga tuldok
    .diamonds = mga rombo

noun =
    .line = guhit
    .line-segment = segment ng guhit
    .ray = sinag
    .vector = bektor
    .curve = kurba
    .function = punsiyon
    .parabola = parabola
    .polyline = maraming-guhit
    .polygon = polygon
    .triangle = tatsulok
    .rectangle = parihaba
    .circle = bilog
    .region = rehiyon
    .point = punto
    .square = parisukat
    .diamond = rombo
    .cross = ekis
    .plus = tandang plus

# The side count is carried by a `may` phrase that belongs to the noun, so it
# folds into the head and there is no tail. Putting it after the adjectives
# would separate «gilid» from the number counting it.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regular na polygon na may { $numSides } gilid
    }

# Filipino has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English.
noun-gender = neuter


## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width } na { $lineStyle } na { $color }
        [width-color] { $width } na { $color }
        [style-color] { $lineStyle } na { $color }
        [width-style] { $width } na { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

# The linker joins the whole description to the noun it describes.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } na { $noun } { $nounTail }
       *[noun] { $description } na { $noun }
    }

style-filled-word = puno

style-filled =
    { $parts ->
        [pattern] { $filled } na { $color } na may { $pattern }
       *[plain] { $filled } na { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } na { $color } na { $noun } na may { $pattern }
        [plain-tail] { $filled } na { $color } na { $noun } { $nounTail }
        [pattern-tail] { $filled } na { $color } na { $noun } { $nounTail } na may { $pattern }
       *[plain] { $filled } na { $color } na { $noun }
    }

# «may» is what Filipino uses where English uses "with a", so the two
# `-article` branches read like the ones without.
style-border-clause =
    { $parts ->
        [with-article] na may { $border } na hangganan
        [and] at { $border } na hangganan
        [and-article] at { $border } na hangganan
       *[with] na may { $border } na hangganan
    }

style-fill =
    { $parts ->
        [pattern] { $color } na { $pattern }
       *[plain] { $color }
    }

style-unfilled = hindi puno

style-text =
    { $parts ->
        [background] { $color } na may { $background } na bakgrawnd
       *[plain] { $color }
    }

style-background-none = wala


## Boolean words

boolean-true = totoo
boolean-false = mali


## Answer buttons

answer-submit-label = Suriin
answer-submit-label-no-correctness = Ipasa ang Sagot


## Sectional blocks

section-name =
    .activity = Gawain
    .aside = Panggilid na Tala
    .cascade = Sunod-sunod
    .definition = Kahulugan
    .example = Halimbawa
    .exercise = Pagsasanay
    .exercises = Mga Pagsasanay
    .given-answer = Sagot
    .note = Tala
    .objectives = Mga Layunin
    .paragraphs = Mga Talata
    .part = Bahagi
    .problem = Suliranin
    .problems = Mga Suliranin
    .proof = Patunay
    .question = Tanong
    .section = Seksiyon
    .solution = Solusyon
    .task = Tungkulin
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

hint-title = Pahiwatig


## Tables and figures

table-name =
    { $parts ->
        [numbered] Talahanayan { $enumeration }
        [numbered-title] Talahanayan { $enumeration }{ ": " }
        [unnumbered-title] Talahanayan{ ": " }
       *[unnumbered] Talahanayan
    }

figure-name =
    { $parts ->
        [numbered] Larawan { $enumeration }
        [numbered-caption] Larawan { $enumeration }{ ": " }
        [unnumbered-caption] Larawan{ ": " }
       *[unnumbered] Larawan
    }


## Paginator controls

paginator-previous = Nakaraan
paginator-next = Susunod
paginator-page = Pahina

paginator-page-status = { $pageLabel } { $currentPage } ng { $numPages }


## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = kung
piecewise-condition-otherwise = kung hindi


## Chemistry

# `element-name` and `element-anion-name` are deliberately omitted, and the 130
# keys fall back to English.
#
# Not for want of a nomenclature but because the one Philippine science
# classrooms use is English: science and mathematics are taught in English from
# the start of the intermediate grades under the mother-tongue policy, so the
# periodic table a student meets is already spelled the way `locales/en` spells
# it. Seeding Filipino respellings would teach a set of names no textbook
# prints. A speaker who wants them in a document can add these keys, and
# `lint:i18n` reports the gap until then. This is the reasoning Vietnamese
# already carries, arrived at from the other direction.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Di-wastong Simbolong Kemikal
chemistry-invalid-ionic-compound = Di-wastong Ionic Compound
