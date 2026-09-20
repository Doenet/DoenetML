# Lule Sami content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
# Latin script, Lule Sami orthography.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Lule Sami keeps `á` and `ŋ` from the common Sami stock but writes `tj` and
# `sj` where Northern Sami writes `č` and `š`, plain `d` and `t` where
# Northern writes `đ` and `ŧ`, and it uses `å`, which Northern Sami does not.
# The colour words show it at a glance — «tjáhppis», «ruoppsis», «rusjkes»
# against Northern «čáhppes», «rukses», «ruškes» — and a `č` or `š` anywhere
# below is a bug rather than a variant.
#
# This catalog selects on neither `$gender` nor `$role`. Lule Sami has no
# grammatical gender, and an adjective standing in front of a noun takes a
# special **attributive** form that agrees with nothing at all: not with the
# noun's case, not with its number. So «ruoppsis» is the word in every
# position, and a `$role` fork would write four copies of one string.
#
# The attributive is not the same word as the predicative — «ruoppsat» is what
# a line *is*, «ruoppsis» is what goes in front of a noun — and the two
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
# The colours borrowed whole — «oránsja», «turkosa», «fiolehtta», «roasa» —
# have no attributive of their own and are cited in one shape. That the table
# is uneven is a fact about which colour words Lule Sami inherited and which
# it borrowed.
#
# Two things to check before anything else. «sárggålasj» and «tjuoggålasj»
# for the two dash patterns are built on the productive `-lasj` suffix from
# «sárggo» and «tjuoggá», and «devdedahtes» for unfilled is built the same
# way; they are the words here least likely to be what a speaker would have
# written. And `section-name.problem` and `.problems` carry the same string
# because Lule Sami's nominative plural of «bihtá» is «bihtá» — that is not a
# copy-paste slip, though a speaker may well prefer a different word for one
# of the two. The two field nouns «luojtemgiedde» and «vektorgiedde» are
# built the same way, on «giedde», a meadow: Lule Sami has no established
# term for a mathematical field, and this is the word the other Sami
# languages reach for.


# **`style-filled-word` is «devdum» and `style-fill` writes «devddo», and
# that is deliberate rather than a slip.** English has no word at all in
# `style-fill` — it renders a fill as the bare colour — so a catalog that
# puts one there is choosing its own noun, and the five Sami catalogs part
# company over it: `locales/sma` repeats its participle («deavhteme»),
# `locales/smn` derives a verbal noun beside its participle («tevdim» beside
# «tevdum»), and this file does the third thing. A reviewer should confirm
# «devddo» is the derivation Lule Sami wants; nothing here contradicts it.
#
# «tjielggidus» is *expression* in `chrome.ftl` and in the math diagnostics,
# and *description* in the five short-description ones. `locales/sma` and
# `locales/smn` separate the two; this file needs a speaker to. The renderer
# and parse-tree-node collisions `locales/sma`'s header records are here in
# the same shape and for the same reason. «tjuoggá» being both a geometric
# point and a credit point is *not* recorded as a defect — Norwegian and
# Swedish do the same and it is very likely idiomatic.


## Style vocabulary

color =
    .black = tjáhppis
    .white = vielgat
    .gray = ránes
    .red = ruoppsis
    .orange = oránsja
    .yellow = fiskes
    .green = ruodná
    .cyan = turkosa
    .blue = alek
    .purple = fiolehtta
    .pink = roasa
    .brown = rusjkes
line-width =
    .thick = assje
    .thin = sæggi
line-style =
    .dashed = sárggålasj
    .dotted = tjuoggålasj
# Comitative plurals. The `-jn` ending is Lule Sami's own word for "with",
# which is why `style-filled` below places these straight after the colour and
# writes no preposition of its own: the ending already said it.
fill-style =
    .horizontal = horisontála sárgujn
    .vertical = vertikála sárgujn
    .diagonal = diagonála sárgujn
    .backdiagonal = nubbe guvlluj diagonála sárgujn
    .dots = tjuoggåjn
    .diamonds = rombajn
noun =
    .line = linnjá
    .line-segment = linnjáoasse
    .ray = bielulinnjá
    .vector = vektor
    .curve = kurva
    .function = funksjuvna
    .slope-field = luojtemgiedde
    .vector-field = vektorgiedde
    .parabola = parabola
    .polyline = moattelinnjá
    .polygon = polygona
    .triangle = gålmmåtjiehka
    .rectangle = rektangel
    .circle = sirkkel
    .region = guovllo
    .point = tjuoggá
    .square = kvadráhta
    .diamond = romba
    .cross = ruossa
    .plus = plus
# Lule Sami keeps the side count in front of the noun, so the whole of it is
# one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] dássásasj { $numSides }-bielak polygona
    }
# Lule Sami has no grammatical gender, so nothing above reads this and every
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
style-filled-word = devdum
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
# «rævdájn» is «rævdda», a border, in the comitative — the case that carries
# "with" — so the clause needs no preposition either. Lule Sami has no
# article, so the two `-article` branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] { $border } rævdájn
        [and] ja { $border } rævdájn
        [and-article] ja { $border } rævdájn
       *[with] { $border } rævdájn
    }
style-fill =
    { $parts ->
        [pattern] { $color } devddo { $pattern }
       *[plain] { $color } devddo
    }
style-unfilled = devdedahtes
style-text =
    { $parts ->
        [background] { $color } { $background } duogásjin
       *[plain] { $color }
    }
style-background-none = ij maktik

## Boolean words

boolean-true = duohta
boolean-false = æhpeduohta

## Answer buttons

answer-submit-label = Gæhttja barggov
answer-submit-label-no-correctness = Sáddi vásstádusáv

## Sectional blocks

section-name =
    .activity = Doajmma
    .aside = Lassiteksta
    .cascade = Kaskáda
    .definition = Mierredibme
    .example = Åvdåmærkka
    .exercise = Hárjjidallam
    .exercises = Hárjjidallama
    .given-answer = Vásstádus
    .note = Merkadus
    .objectives = Ulme
    .paragraphs = Tekstaoase
    .part = Oasse
    .problem = Bargobihtá
    .problems = Bargobihtá
    .proof = Duodastus
    .question = Gatjálvis
    .section = Kapihttal
    .solution = Tjoavddus
    .task = Barggo
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
hint-title = Ráde

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabellá { $enumeration }
        [numbered-title] Tabellá { $enumeration }{ ": " }
        [unnumbered-title] Tabellá{ ": " }
       *[unnumbered] Tabellá
    }
figure-name =
    { $parts ->
        [numbered] Gåvvå { $enumeration }
        [numbered-caption] Gåvvå { $enumeration }{ ": " }
        [unnumbered-caption] Gåvvå{ ": " }
       *[unnumbered] Gåvvå
    }

## Paginator controls

paginator-previous = Åvddep
paginator-next = Boahtte
paginator-page = Sijdo
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = jali
piecewise-condition-if = jus
piecewise-condition-otherwise = eará láhkáj

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Lule Sami schooling in Norway and Sweden does not reach secondary
## chemistry in the language: that subject is taught in Norwegian or in
## Swedish, and the element names a Lule Sami pupil meets are the Norwegian or
## the Swedish ones — which differ from each other. There is no one Lule Sami
## table for a seed to reproduce, and choosing either state language's would
## report a fact about a border rather than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Gusstuhis kemijalasj symbola
chemistry-invalid-ionic-compound = Gusstuhis ijovnalasj tjadnalvis
