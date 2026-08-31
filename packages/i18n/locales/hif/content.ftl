# Fiji Hindi (Fiji Baat) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in, not the reader's interface language.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin, not the Devanagari ICU maximizes `hif` to.** `chrome.ftl`
# states the case in full — Fiji Hindi is written in the Latin alphabet by its
# own speakers, and Devanagari in Fiji is the script of Standard Hindi, which
# is a different language. Direction is unaffected: both scripts run left to
# right, so `directionOf("hif")` answers `ltr` through the maximization and
# answers it correctly, and `src/direction.ts` needs no entry.
#
# ## Word order
#
# **Every modifier comes before the noun**, in English's own order: «mota laal
# lakiir» is *thick red line*, width first, then the dash pattern, then the
# colour. Fiji Hindi is Indo-Aryan and head-final, so `style-stroke`,
# `style-with-noun` and `style-filled-with-noun` all keep English's sequence of
# placeables rather than reversing it. What does move is the preposition: Fiji
# Hindi is postpositional, so «ke saath» (*with*) and «pe» (*on*) follow their
# object and the composition messages below put them after the placeable.
#
# **`[noun-tail]` is unused.** `noun-regular-polygon` fills `head` with
# «{ $numSides } side waala regular polygon» and leaves `tail` empty, as
# English does: the side count sits in front of the noun here too. The `-tail`
# variants of the two composition messages are still written out, because that
# is what a partly-translated locale falls back to.
#
# ## Gender and role — neither forks, and that is the interesting part
#
# **Fiji Hindi has levelled away Standard Hindi's agreement, and this catalog
# records that rather than working around it.** In Standard Hindi «kaalaa»
# becomes «kaalii» before a feminine noun and «kaale» before a postposition;
# in Fiji Hindi the `-a` form stands in every position, for a noun of either
# gender, in the direct case and the oblique alike. Gender survives in the
# lexicon — a speaker still knows «lakiir» is the sort of word that would have
# been feminine — but it does not reach the adjective. So `noun-gender` answers
# the single token `neuter`, **no adjective selects on `$gender`**, and the
# four `$role` positions render identically because there is no oblique for a
# position to govern.
#
# That is worth reading beside the two catalogs seeded in the same batch.
# `locales/skr` is Indo-Aryan too, is a close relative, and **does** fork on
# both arguments, because Saraiki kept the marked/unmarked adjective classes
# whole. `locales/brh` is Dravidian and forks on neither because it never had
# gender at all. Fiji Hindi is the third answer: it *had* the agreement and
# lost it. Three catalogs, three routes to three different shapes, and the
# family tree predicts none of them.
#
# **Nothing selects on a count either.** A Fiji Hindi noun after a numeral
# stays unmarked — «tiin lakiir», not «tiin lakiiren» — and CLDR has no plural
# data for `hif` in any case, so a category branch would be one `lint:i18n`
# rejects.
#
# ## The chemistry tables are deliberately absent
#
# `element-name` and `element-anion-name` are the only English keys this file
# does not cover. **Fiji Hindi is nobody's medium of instruction**: schooling
# in Fiji is in English, and a Fiji Hindi speaker meets the periodic table in
# English and nowhere else. There is no settled Fiji Hindi list of the hundred
# and eighteen elements to check a translation against, and the two candidates
# — respelling the English names in this orthography, or importing Standard
# Hindi's Devanagari nomenclature in transliteration — would each produce a
# nomenclature nobody uses. Recording the gap is the honest answer.
# `lint:i18n` reports the two keys as missing coverage and that report is
# correct. `ion-name-oxidation-state` and the two invalid-symbol messages
# **are** covered: they are frames and punctuation, not vocabulary.
#
# ## What is English here, and why that is not a failure
#
# A great deal. `vector`, `function`, `parabola`, `polygon`, `polyline`,
# `curve`, `rectangle`, `diamond`, `cross`, `regular polygon`, `table`,
# `paragraph` and the six colour words `grey`, `orange`, `cyan`, `purple`,
# `pink`, `brown` are written as English, because Fiji Hindi genuinely borrows
# them: mathematics is learnt in English in Fiji, and an Indo-Fijian speaker
# describing a shape says «circle» as readily as «gol». Replacing them with
# Sanskritic coinages would produce Standard Hindi under this tag, which is
# precisely the failure this catalog is written to avoid. Where Fiji Hindi has
# its own word it is used and is Bhojpuri-derived rather than Khari Boli:
# «lakiir», «kiran», «tikon», «gol», «chaukor», «bindu», «hariyar» for green,
# «patar» for thin, «kaam» for a task, «sahi» and «galat» for the booleans,
# «nai to» for *otherwise*, «kaahe ki» for *because*.


## Style vocabulary
##
## Every word here is invariable, and that is a fact about Fiji Hindi rather
## than a choice about which words to write: its adjectives do not agree.

color =
    .black = kaala
    .white = safed
    .gray = grey
    .red = laal
    .orange = orange
    .yellow = piyar
    .green = hariyar
    .cyan = cyan
    .blue = niila
    .purple = purple
    .pink = pink
    .brown = brown
line-width =
    .thick = mota
    .thin = patar
line-style =
    .dashed = dash waala
    .dotted = dot waala
# Noun phrases rather than adjectives: every place a fill pattern is put, it
# stands in front of «ke saath», so these are written as they are wanted there.
fill-style =
    .horizontal = horizontal lakiir
    .vertical = vertical lakiir
    .diagonal = tirchha lakiir
    .backdiagonal = ulta tirchha lakiir
    .dots = dot
    .diamonds = diamond
noun =
    .line = lakiir
    .line-segment = lakiir ke tukra
    .ray = kiran
    .vector = vector
    .curve = curve
    .function = function
    .slope-field = slope field
    .vector-field = vector field
    .parabola = parabola
    .polyline = polyline
    .polygon = polygon
    .triangle = tikon
    .rectangle = rectangle
    .circle = gol
    .region = ilaaka
    .point = bindu
    .square = chaukor
    .diamond = diamond
    .cross = cross
    .plus = plus ke nishaan
# «side waala» is invariable, like everything else in front of a Fiji Hindi
# noun, so the side count stands with the other modifiers and there is nothing
# to split off into a tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } side waala regular polygon
    }
# Fiji Hindi does not agree an adjective for gender. The token is defined
# anyway rather than left to fall back, so that this catalog says so on
# purpose. See the header.
noun-gender = neuter


## Style composition
##
## English's own order of placeables, kept rather than reversed — Fiji Hindi
## puts its modifiers in front of the noun as well. What moves is the
## preposition: Fiji Hindi is postpositional, so «ke saath» and «pe» follow
## what they govern.

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
# Invariable in Fiji Hindi — in Standard Hindi this word would have to agree —
# so it is written once and takes no branch. Its opposite is `style-unfilled`
# below.
style-filled-word = bharaa
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern } ke saath
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern } ke saath
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern } ke saath
       *[plain] { $filled } { $color } { $noun }
    }
# «ke saath» follows what it governs, so the border and its modifiers come
# first. Fiji Hindi has no article, so the two `-article` branches read as
# their plain counterparts do; they are kept apart because the distinction
# belongs to the English message rather than to this one.
style-border-clause =
    { $parts ->
        [with-article] { $border } border ke saath
        [and] aur { $border } border ke saath
        [and-article] aur { $border } border ke saath
       *[with] { $border } border ke saath
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = khaali
style-text =
    { $parts ->
        [background] { $background } background pe { $color }
       *[plain] { $color }
    }
style-background-none = kuchhu nai


## Boolean words
##
## What a `<boolean>` displays. `true` and `false` as an author writes them in
## the source stay English; only these two move.

boolean-true = sahi
boolean-false = galat


## Answer buttons

answer-submit-label = Kaam jaancho
answer-submit-label-no-correctness = Jawaab bhejo


## Sectional blocks

section-name =
    .activity = Kaam-kaaj
    .aside = Alag baat
    .cascade = Cascade
    .definition = Paribhaasha
    .example = Misaal
    .exercise = Abhyaas
    .exercises = Abhyaas
    .given-answer = Jawaab
    .note = Note
    .objectives = Lakshya
    .paragraphs = Paragraph
    .part = Hissa
    .problem = Samasya
    .problems = Samasya
    .proof = Saboot
    .question = Sawaal
    .section = Bhaag
    .solution = Hal
    .task = Kaam
    .theorem = Siddhaant
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Ishaara


## Tables and figures

table-name =
    { $parts ->
        [numbered] Table { $enumeration }
        [numbered-title] Table { $enumeration }{ ": " }
        [unnumbered-title] Table{ ": " }
       *[unnumbered] Table
    }
figure-name =
    { $parts ->
        [numbered] Chitra { $enumeration }
        [numbered-caption] Chitra { $enumeration }{ ": " }
        [unnumbered-caption] Chitra{ ": " }
       *[unnumbered] Chitra
    }


## Paginator controls
##
## «me se» — *out of* — is a postposition, so the total comes first and the
## page label and its number follow. That is the reverse of English's order and
## a fact about Fiji Hindi rather than a slip.

paginator-previous = Pichhla
paginator-next = Agla
paginator-page = Panna
paginator-page-status = { $numPages } me se { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = ya
piecewise-condition-if = agar
piecewise-condition-otherwise = nai to


## Chemistry
##
## The element tables are absent on purpose; see the header. What is here is
## the frames around a name, which need no nomenclature.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Galat chemical symbol
chemistry-invalid-ionic-compound = Galat ionic compound


## Inputs embedded in math

math-embedded-input-blank = khaali
math-embedded-input-blank-ordinal = { $total } me se khaali { $ordinal }
