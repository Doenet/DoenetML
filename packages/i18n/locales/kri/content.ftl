# Krio content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `kri` is Krio, the English-lexifier creole of Sierra Leone and the language
# very nearly everyone in the country shares, whatever they grew up speaking.
#
# **Read it beside `locales/pcm`, seeded in the same batch.** Nigerian Pidgin
# has the same lexifier and much of the same grammar — postposed plural, a
# preverbal completive, `na` for identity — and the two catalogs still do not
# look alike, because Sierra Leone settled on a phonemic orthography and
# Nigeria stayed close to English spelling. The two diverge wherever the
# spelling does, which is not everywhere:
#
#              kri          pcm
#   black      blak         black
#   white      wet          white
#   green      grin         green
#   answer     ansa         ansa
#   page       pej          pej
#
# So the seam between the two is orthographic where `locales/fon`'s internal
# seam is morphological, and neither is the same thing as a difference in
# grammar. A speaker reviewing this file should be checking that it stays in
# the Krio spelling throughout — the failure mode here is an English word
# slipping back in unspelt, and `color.black` is where it would show first.
#
# Krio writes `ɛ` and `ɔ` as full letters, and this catalog uses them. It is
# the orthography of the Krio Bible and the university's own materials, and it
# is the one decision in this file most likely to be contested.
#
# Krio has no noun class, no gender and no case, so `$gender` and `$role` both
# go unused. Number is `dɛn`, postposed and only where it is needed; the
# describing words do not carry it.


## Style vocabulary

color =
    .black = blak
    .white = wet
    .gray = gre
    .red = rɛd
    .orange = ɔrenj
    .yellow = yala
    .green = grin
    .cyan = sayan
    .blue = blu
    .purple = pɔpul
    .pink = pink
    .brown = braun

line-width =
    .thick = tik
    .thin = tin

# Reduplication used attributively, the same move `locales/pcm` makes. A «we de
# brok-brok» clause would be the more literal rendering and is wrong here: the
# description is *followed* by the noun, so a relative clause would sit in front
# of the thing it modifies and attach to nothing.
line-style =
    .dashed = brok-brok
    .dotted = dɔt-dɔt

fill-style =
    .horizontal = layn dɛn we lidɔm
    .vertical = layn dɛn we tinap
    .diagonal = layn dɛn we slant
    .backdiagonal = layn dɛn we slant di ɔda say
    .dots = dɔt dɛn
    .diamonds = dayamɔn dɛn

noun =
    .line = layn
    .line-segment = pis pan layn
    .ray = re
    .vector = vɛkta
    .curve = layn we bɛnd
    .function = fɔnkshɔn
    .parabola = parabola
    .polyline = layn we gɛt bɔku pis
    .polygon = pɔligɔn
    .triangle = trayangul
    .rectangle = rɛktangul
    .circle = raun
    .region = eria
    .point = pɔynt
    .square = skwea
    .diamond = dayamɔn
    .cross = krɔs
    .plus = plɔs mak

# The side count is a relative clause and closes the noun phrase behind the
# describing words, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] we gɛt { $numSides } say
       *[head] pɔligɔn we ɔl di say dɛn na wan
    }

# Krio has no noun class and no gender, so every noun answers the same and the
# answer goes unused.
noun-gender = wan


## Style composition

# Krio stacks modifiers in front of the noun in the order English does, and
# `line-style` is a bare modifier rather than a clause, so nothing needs to be
# moved to the end here.
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

# «dɔn ful» — the completive `dɔn` rather than an English passive. There is no
# adjective here to inflect; the whole word is a verb phrase, as it is in
# `locales/pcm`.
style-filled-word = dɔn ful

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } wit { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } wit { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } wit { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# Krio has no indefinite article where English wants one here, so the
# `-article` branches read the same as their bare counterparts. The «wit» /
# «ɛn» distinction — first clause against a further one — is real and survives.
style-border-clause =
    { $parts ->
        [with-article] wit { $border } bɔda
        [and] ɛn { $border } bɔda
        [and-article] ɛn { $border } bɔda
       *[with] wit { $border } bɔda
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = i nɔ ful

style-text =
    { $parts ->
        [background] { $color } wit { $background } bakgrɔn
       *[plain] { $color }
    }

style-background-none = natin


## Boolean words
##
## `true` and `false` stay English everywhere as DoenetML syntax; only what the
## reader sees moves.

boolean-true = na tru
boolean-false = na lay


## Answer buttons

answer-submit-label = Chɛk Wok
answer-submit-label-no-correctness = Sɛn Ansa


## Sectional blocks

section-name =
    .activity = Aktiviti
    .aside = Say Tɔk
    .cascade = Kasked
    .definition = Minin
    .example = Ɛgzampul
    .exercise = Ɛksasayz
    .exercises = Ɛksasayz dɛn
    .given-answer = Ansa
    .note = Not
    .objectives = Wetin wi want fɔ du
    .paragraphs = Paragraf dɛn
    .part = Pat
    .problem = Prɔblɛm
    .problems = Prɔblɛm dɛn
    .proof = Pruf
    .question = Kwɛstiɔn
    .section = Sɛkshɔn
    .solution = Ansa fɔ di prɔblɛm
    .task = Wok
    .theorem = Tiɔrɛm

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Klu


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tebul { $enumeration }
        [numbered-title] Tebul { $enumeration }{ ": " }
        [unnumbered-title] Tebul{ ": " }
       *[unnumbered] Tebul
    }

figure-name =
    { $parts ->
        [numbered] Piksho { $enumeration }
        [numbered-caption] Piksho { $enumeration }{ ": " }
        [unnumbered-caption] Piksho{ ": " }
       *[unnumbered] Piksho
    }


## Paginator controls

paginator-previous = Di wan we dɔn pas
paginator-next = Nɛks

paginator-page = Pej

paginator-page-status = { $pageLabel } { $currentPage } pan { $numPages }


## Piecewise functions

piecewise-condition-or = ɔ

piecewise-condition-if = if

piecewise-condition-otherwise = if i nɔ so


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Sierra Leone teaches secondary science in English,
## and Krio's lexifier is English, so the fallback is both the curriculum and
## very nearly the language — the same reasoning `locales/pcm` records for
## Nigeria, and the reason neither file spells out 130 keys that would come
## back all but identical to `locales/en`.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Kɛmistri Simbɔl We Nɔ Kɔrɛkt
chemistry-invalid-ionic-compound = Ayɔnik Kɔmpaun We Nɔ Kɔrɛkt
