# Bislama content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The full orthographic, grammatical and Tok Pisin–comparison notes are in this
# locale's `chrome.ftl` header and are not repeated here. The four points that
# govern *this* file:
#
# **No grammatical gender and no case.** `noun-gender` answers one token for
# every noun, and no adjective below forks on `$gender` or on `$role`.
#
# **Bislama has no productive `-pela`.** Tok Pisin writes «retpela lain»;
# Bislama writes **«red laen»**, with the adjective bare. Its cognate «-fala»
# is a closed set — «bigfala», «smolfala», «nufala», «longfala», «sotfala»,
# «strongfala», «naerafala» — and this file uses it only on stems that carry it
# there. Every colour, width and dash pattern below therefore stands bare, and
# a corrector who adds «-fala» to «red» or «tik» is importing Tok Pisin. This
# is the single most visible difference between `locales/bi` and `locales/tpi`
# and the one a reviewer should check first.
#
# **Word order: the describing word comes before the noun**, which is where Tok
# Pisin, English and the five Philippine catalogs put it, and not where the
# Polynesian and Micronesian catalogs do. `style-with-noun` and
# `style-filled-with-noun` are written accordingly.
#
# **Number.** A noun is not marked for it; «ol» in front is the plural. So
# `noun` gives one form for one thing and for many, and `section-name`'s
# `.exercise`/`.exercises` and `.problem`/`.problems` pairs are one word each.
#
# **Vocabulary: English-looking words here are Bislama.** Bislama is an
# English-lexified creole, so «laen», «poen», «kolam», «saed», «namba» are its
# own words. The stray-English check that the other catalogs in this batch can
# run does not work on this one; what was checked instead is set out in
# `chrome.ftl`. The geometry vocabulary in particular is English-derived by
# nature, and Vanuatu teaches secondary mathematics in English and French,
# which is why it is.
#
# Words this seed is least sure of, listed so a speaker can go straight to
# them: «kurv» (curve), «sekel» (circle), «eria» (region), «polilaen»
# (polyline), «boda» (border), «emti spes» (the gap inside typeset math),
# «respons» (see `chrome.ftl`). None is attested to this seed as a settled
# mathematical term; each is either an English loan taken in through Bislama's
# ordinary loan phonology or, in the case of «polilaen», built from two words
# the language already has.


## Style vocabulary

color =
    .black = blak
    .white = waet
    .gray = gre
    .red = red
    .orange = oren
    .yellow = yelo
    .green = grin
    .cyan = saean
    .blue = blu
    .purple = pepol
    .pink = pink
    .brown = braon
line-width =
    .thick = tik
    .thin = tin
line-style =
    .dashed = brokbrok
    .dotted = dotdot
# Noun phrases. Bislama marks no plural on the noun; «ol» in front of it is the
# plural, and it belongs here because these name several lines rather than one.
# «narasaed» — the other side — is Bislama «nara», against Tok Pisin
# «narapela»: the `-pela` point again, in one word.
fill-style =
    .horizontal = ol laen we oli slip
    .vertical = ol laen we oli stanap
    .diagonal = ol laen we oli go kruked
    .backdiagonal = ol laen we oli go kruked long narasaed
    .dots = ol dot
    .diamonds = ol daemon
noun =
    .line = laen
    .line-segment = haf laen
    .ray = re
    .vector = vekta
    .curve = kurv
    .function = fanksen
    .slope-field = fil blong slop
    .vector-field = fil blong vekta
    .parabola = parabola
    .polyline = polilaen
    .polygon = poligon
    .triangle = traengel
    .rectangle = rektangel
    .circle = sekel
    .region = eria
    .point = poen
    .square = skwea
    .diamond = daemon
    .cross = kros
    .plus = plas
# The side count follows the noun as a relative clause introduced by «we»,
# because the adjectives sit directly in front of the noun and a counted phrase
# in front of them would be read as describing the sides rather than the shape.
noun-regular-polygon =
    { $part ->
        [tail] we i gat { $numSides } saed we oli sem mak
       *[head] poligon
    }
# One answer for every noun: Bislama has no grammatical gender.
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
style-filled-word = fulap
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } wetem { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } wetem { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } wetem { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# Bislama has no article, so the two `-article` branches say what the other two
# say. They are kept apart because the distinction English draws with them —
# a first clause against a further one — is one this file does mark, with
# «wetem» against «mo».
style-border-clause =
    { $parts ->
        [with-article] wetem { $border } boda
        [and] mo { $border } boda
        [and-article] mo { $border } boda
       *[with] wetem { $border } boda
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = i no fulap
style-text =
    { $parts ->
        [background] { $color } wetem { $background } baksaed
       *[plain] { $color }
    }
style-background-none = i no gat

## Boolean words

boolean-true = tru
boolean-false = giaman

## Answer buttons

answer-submit-label = Jekem wok
answer-submit-label-no-correctness = Sanem respons

## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Bislama marks number with «ol» in front of the noun rather than on it,
# and a heading does not carry it.
section-name =
    .activity = Wok
    .aside = Tok long saed
    .cascade = Kaskad
    .definition = Mining
    .example = Eksampol
    .exercise = Eksasaes
    .exercises = Eksasaes
    .given-answer = Ansa
    .note = Tok
    .objectives = Ol mak blong lanem
    .paragraphs = Ol paragraf
    .part = Haf
    .problem = Problem
    .problems = Problem
    .proof = Pruf
    .question = Kwestin
    .section = Seksen
    .solution = Rod blong ansa
    .task = Wok
    .theorem = Tiorem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Tok halpem

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tebol { $enumeration }
        [numbered-title] Tebol { $enumeration }{ ": " }
        [unnumbered-title] Tebol{ ": " }
       *[unnumbered] Tebol
    }
figure-name =
    { $parts ->
        [numbered] Piksa { $enumeration }
        [numbered-caption] Piksa { $enumeration }{ ": " }
        [unnumbered-caption] Piksa{ ": " }
       *[unnumbered] Piksa
    }

## Paginator controls

paginator-previous = Bifo
paginator-next = Nekis
paginator-page = Pej
paginator-page-status = { $pageLabel } { $currentPage } blong { $numPages }

## Piecewise functions

# «sipos» opens its clause, so the renderer's placement of this word in front
# of the mathematics is right for Bislama and nothing is lost here.
piecewise-condition-or = o
piecewise-condition-if = sipos
piecewise-condition-otherwise = sipos nogat

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Vanuatu teaches secondary science in English and in French, so the
## periodic table a pupil there meets is one of those two, and Bislama has no
## settled table of its own to seed from. Naming the elements here would report
## a fact about a curriculum rather than about the language.
##
## Bislama does have its own names for the substances known long before the
## elements were — «aean» for iron, «gol» for gold, «silva» for silver — and
## those handful, rather than the whole 118, are where a speaker should start.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbol kemikol i no stret
chemistry-invalid-ionic-compound = Aionik kompaon i no stret

## Inputs embedded in math

# Read aloud by a screen reader inside a typeset expression, so it is kept to
# two words. «emti spes» is a coinage of this seed and is flagged in the header.
math-embedded-input-blank = emti spes
math-embedded-input-blank-ordinal = emti spes { $ordinal } blong { $total }
