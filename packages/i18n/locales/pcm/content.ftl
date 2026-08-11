# Nigerian Pidgin content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `pcm` is Nigerian Pidgin (Naijá), an English-lexifier creole and the most
# widely spoken language in Nigeria — a first language for millions and a
# second one for tens of millions more, spoken across the communities of every
# Nigerian language this repository already carries (`locales/ha`,
# `locales/ig`, `locales/yo`, `locales/tiv`).
#
# **The thing to be careful about in this catalog is that it looks like
# English.** The lexifier shows through in almost every word, so a reader
# skimming it can conclude that nothing has been translated and that the file
# is padding. It is not, and the places to look are the grammar rather than
# the vocabulary:
#
#   plural            no `-s`; number is carried by `dem` or by a numeral
#                     («two lain», not «two lines»)
#   tense and aspect  preverbal `don`, `dey`, `go` — «don full», not
#                     «is filled»
#   negation          `no bi` and `no`, never `-n't`
#   copula            `na` for identity, `dey` for location and state
#   possession        `of` and `fọ` both occur, and juxtaposition does a lot of
#                     the work («plọs mak», not «mark of a plus»)
#
# So `style-unfilled` is «e no full» rather than «unfilled», and
# `boolean-false` is «na lai» rather than «false». A speaker reviewing this
# should be reading for register — this is written Naijá, not English with the
# spelling roughened — and the fastest way to check a message is to read it
# aloud.
#
# **Read it beside `locales/kri`.** Krio has the same lexifier and a different
# answer, because Sierra Leone's written tradition is phonemic where Nigeria's
# stays close to English spelling: «blak» there, «black» here. The two files
# together are this repository's shortest argument that "English creole" names
# a family rather than a catalog.
#
# Nigerian Pidgin has no noun class, no gender and no case, so `$gender` and
# `$role` both go unused — the shape `locales/en` and `locales/ktu` have.
#
# The orthography is the one Naijá writing on the web actually uses, with the
# subdot vowels `ẹ` and `ọ` where a word needs them. It is not the harmonized
# NLC orthography, and that is the first thing a speaker should decide about.


## Style vocabulary

color =
    .black = black
    .white = white
    .gray = gray
    .red = red
    .orange = orange
    .yellow = yellow
    .green = green
    .cyan = cyan
    .blue = blue
    .purple = purple
    .pink = pink
    .brown = brown

line-width =
    .thick = thick
    .thin = thin

# Reduplication used attributively, which is how Naijá makes a modifier out of
# a verb without building a relative clause. A «wey dey brok-brok» clause would
# be the more literal rendering and is wrong here: the description is *followed*
# by the noun in this catalog, so a relative clause would sit in front of the
# thing it modifies and attach to nothing.
line-style =
    .dashed = brok-brok
    .dotted = dot-dot

fill-style =
    .horizontal = lain wey lie down
    .vertical = lain wey stand up
    .diagonal = lain wey slant
    .backdiagonal = lain wey slant di oda way
    .dots = dot dem
    .diamonds = daimon dem

noun =
    .line = lain
    .line-segment = pis of lain
    .ray = re
    .vector = vẹkta
    .curve = lain wey bend
    .function = fọnkshọn
    .parabola = parabola
    .polyline = lain wey gẹt many pis
    .polygon = poligọn
    .triangle = trayangul
    .rectangle = rẹktangul
    .circle = raun
    .region = eria
    .point = point
    .square = skwea
    .diamond = daimon
    .cross = kros
    .plus = plọs mak

# The side count is a relative clause and closes the noun phrase behind the
# describing words rather than opening it, so it goes in the tail — the same
# place `locales/tiv` puts its own.
noun-regular-polygon =
    { $part ->
        [tail] wey gẹt { $numSides } sait
       *[head] poligọn wey ẹvri sait dey di sem
    }

# Nigerian Pidgin has no noun class and no gender, so every noun answers the
# same and the answer goes unused.
noun-gender = wan


## Style composition

# Naijá stacks modifiers in front of the noun in the order English does, and
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

# «don full» — the completive `don` rather than an English passive. There is no
# adjective here to inflect; the whole word is a verb phrase.
style-filled-word = don full

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

# Naijá has no indefinite article where English wants one here, so the
# `-article` branches read the same as their bare counterparts. The distinction
# `$parts` carries is still a real one — «wit» opens a clause and «an» chains a
# further one — and that half of it survives.
style-border-clause =
    { $parts ->
        [with-article] wit { $border } bọda
        [and] an { $border } bọda
        [and-article] an { $border } bọda
       *[with] wit { $border } bọda
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = e no full

style-text =
    { $parts ->
        [background] { $color } wit { $background } bakgraun
       *[plain] { $color }
    }

style-background-none = nọtin


## Boolean words
##
## `true` and `false` stay English everywhere as DoenetML syntax; only what the
## reader sees moves. In Naijá the displayed words are the two verdicts a
## speaker actually gives, which are not the words the source uses.

boolean-true = na tru
boolean-false = na lai


## Answer buttons

answer-submit-label = Chẹk Wọk
answer-submit-label-no-correctness = Sẹnd Ansa


## Sectional blocks

section-name =
    .activity = Aktiviti
    .aside = Sait Tok
    .cascade = Kasked
    .definition = Meanin
    .example = Ẹgzampul
    .exercise = Ẹksasaiz
    .exercises = Ẹksasaiz dem
    .given-answer = Ansa
    .note = Not
    .objectives = Wetin Wi Wan Achiv
    .paragraphs = Paragraf dem
    .part = Pat
    .problem = Prọblẹm
    .problems = Prọblẹm dem
    .proof = Prọf
    .question = Kwẹstiọn
    .section = Sẹkshọn
    .solution = Solushọn
    .task = Task
    .theorem = Tiọrẹm

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Hint


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
        [numbered] Figọ { $enumeration }
        [numbered-caption] Figọ { $enumeration }{ ": " }
        [unnumbered-caption] Figọ{ ": " }
       *[unnumbered] Figọ
    }


## Paginator controls

paginator-previous = Wan Wey Pass
paginator-next = Nẹks

paginator-page = Pej

paginator-page-status = { $pageLabel } { $currentPage } fọ { $numPages }


## Piecewise functions

piecewise-condition-or = ọ

piecewise-condition-if = if

piecewise-condition-otherwise = if no bi so


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case, and the clearest one in the repository: Nigeria
## teaches secondary science in English, and Naijá's lexifier *is* English, so
## the fallback is both the curriculum and very nearly the language. Filling
## these in would produce 130 keys character-identical to `locales/en` and
## claim a translation that had not happened. `locales/ha`, `locales/ig`,
## `locales/yo` and `locales/tiv` leave the same gap for the same ministry.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Kẹmistri Simbọl Wey No Korẹkt
chemistry-invalid-ionic-compound = Ayọnik Kompaun Wey No Korẹkt
