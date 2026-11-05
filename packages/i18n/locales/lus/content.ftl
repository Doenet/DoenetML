# Mizo (Mizo ṭawng) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin**, in the Roman orthography the Welsh mission fixed in 1894.
# Mizo has never been written in anything else, so unlike `locales/mni` and
# `locales/brx` there is no script question here at all — only diacritics. The
# circumflex marks the long vowels (â ê î ô û) and **ṭ** is the subscript-dotted
# letter (U+1E6D), as `chrome.ftl`'s header sets out in full.
#
# ## Word order
#
# **The noun comes first and every modifier follows it.** A Mizo attributive
# adjective is postnominal — «lehkhabu sen» is *a red book*, never «sen
# lehkhabu» — so `style-with-noun` and `style-filled-with-noun` put
# `{ $noun }` in front of `{ $description }`, the reverse of English's
# sequence of placeables. `style-stroke` keeps English's internal order of the
# three adjectives, because that is Mizo's order too.
#
# **The three catalogs of this batch do not agree with each other about this,
# and the disagreement is real rather than an artefact of the seed.** Mizo and
# Khasi are postnominal and Garo is prenominal, following `locales/brx`, its
# closest relative in the roster — three languages of one region, two families
# between them, and the split does not follow the family line.
#
# **`[noun-tail]` is unused.** `noun-regular-polygon` fills `head` with
# «polygon kil { $numSides } nei» — *a polygon having N corners* — and leaves
# `tail` empty, as English does: the side count sits inside the noun phrase
# here as well, so nothing has to be split around the adjectives.
#
# ## Gender, role and number
#
# **No `$gender` fork and no `$role` fork.** Mizo has no grammatical gender, so
# `noun-gender` answers the single token `neuter` and no adjective selects on
# it; nor does Mizo inflect a modifier for the clause position its phrase is
# going into, so `standalone`, `border-clause`, `background-clause` and
# `text-clause` are written identically. Both are claims about the language
# rather than gaps in the seed. Where a relation has to be spelled at all it is
# spelled by a **postposition** — «nen» for accompaniment, «zînga» for
# partition — and both have one shape whatever precedes them, so putting one
# after a placeable is sound.
#
# **Nothing selects on a count.** A Mizo noun is unmarked after a numeral, and
# CLDR has no plural data for `lus` in any case.
#
# ## The one place the frame and the grammar disagree
#
# **`piecewise-condition-if` reads out of position, and a speaker should know
# that before reading it as a typo.** The renderer puts this word in front of
# the inequality it introduces; Mizo's conditional marker «a nih chuan» is
# **clause-final** — the mathematics comes first and the marker closes it. So
# «a nih chuan 1 < x < 2» is the right word in the wrong place. That is
# `locales/miq`'s defect rather than a new one: a fault in the composition, not
# in the vocabulary, and fixing it means changing what the piecewise renderer
# is handed rather than changing this string. `piecewise-condition-otherwise`
# («a nih loh chuan») stands alone and is unaffected.
#
# ## Vocabulary, and what this file does not know
#
# **The geometry is English, declared as such.** Mizoram teaches mathematics
# and science in English from the primary grades up, so «line», «ray»,
# «vector», «curve», «function», «polygon», «parabola», «rectangle», «square»,
# «point» and «diamond» are the words a Mizo student has met, and a coinage in
# their place would be a word no reader has read. Where Mizo has its own term
# the seed is confident of, it is used: «kilthum» for the triangle (*three
# corners*), «kualvêl» for the circle, «hmun» for a region, «milem» for a
# figure, «bung» for a section, «phêk» for a page, «zawhna» for a question,
# «chhânna» for an answer, «finfiahna» for a proof, «awmzia» for a definition,
# «entîrna» for an example, «dik» and «dik lo» for true and false, «emaw» for
# *or*.
#
# **The colours are the weakest part of this file and a reviewer should start
# there.** Five are Mizo — «dum», «var», «sen», «eng», «hring» — and the other
# seven are written as plain English loans, because the seed has no Mizo term
# for them that it trusts. Nothing was invented to fill the gap. `line-style`
# is the same admission: «dash-nei» and «dot-nei» are the Mizo possessive
# «-nei» on an English root, which is how Mizo does build such words, but they
# are a construction of this seed rather than a phrase anyone has verified.
#
# **`line-width` is a guess.** «lian» and «te» are Mizo's ordinary words for
# big and small pressed into service for thick and thin — the same guess
# `locales/brx` and `locales/mni` make — and a speaker may well have a proper
# pair for the width of a drawn stroke.
#
# ## Chemistry
#
# `element-name` and `element-anion-name` are **deliberately absent**, so those
# 130 keys fall back to English. Mizoram teaches secondary chemistry in
# English, out of English textbooks, so the element names a Mizo student meets
# are the English ones; a Mizo table would be a claim about spelling rather
# than about the language.
#
# Numbers render in Latin digits (#1615).


## Style vocabulary

color =
    .black = dum
    .white = var
    .gray = grey
    .red = sen
    .orange = orange
    .yellow = eng
    .green = hring
    .cyan = cyan
    .blue = blue
    .purple = purple
    .pink = pink
    .brown = brown

line-width =
    .thick = lian
    .thin = te

line-style =
    .dashed = dash-nei
    .dotted = dot-nei

fill-style =
    .horizontal = horizontal line
    .vertical = vertical line
    .diagonal = diagonal line
    .backdiagonal = diagonal line letling
    .dots = dot
    .diamonds = diamond

noun =
    .line = line
    .line-segment = line segment
    .ray = ray
    .vector = vector
    .curve = curve
    .function = function
    .slope-field = slope field
    .vector-field = vector field
    .parabola = parabola
    .polyline = polyline
    .polygon = polygon
    .triangle = kilthum
    .rectangle = rectangle
    .circle = kualvêl
    .region = hmun
    .point = point
    .square = square
    .diamond = diamond
    .cross = cross
    .plus = plus

noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] polygon kil { $numSides } nei
    }

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
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }

style-filled-word = khat

style-filled =
    { $parts ->
        [pattern] { $color } { $filled }, { $pattern } nen
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled }, { $pattern } nen
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled }, { $pattern } nen
       *[plain] { $noun } { $color } { $filled }
    }

style-border-clause =
    { $parts ->
        [with-article] border { $border } nen
        [and] leh border { $border }
        [and-article] leh border { $border }
       *[with] border { $border } nen
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = khat lo

style-text =
    { $parts ->
        [background] { $color }, background { $background } nen
       *[plain] { $color }
    }

style-background-none = engmah lo


## Boolean words

boolean-true = dik
boolean-false = dik lo


## Answer buttons

answer-submit-label = Enfiah Rawh
answer-submit-label-no-correctness = Chhânna Thawn

## Sectional blocks

section-name =
    .activity = Thiltih
    .aside = Belhchhah
    .cascade = Cascade
    .definition = Awmzia
    .example = Entîrna
    .exercise = Zirbing
    .exercises = Zirbing
    .given-answer = Chhânna
    .note = Hriattîrna
    .objectives = Thiltum
    .paragraphs = Paragraph
    .part = Ṭhen
    .problem = Zawhna
    .problems = Zawhna
    .proof = Finfiahna
    .question = Zawhna
    .section = Bung
    .solution = Chhânna
    .task = Hnathawh
    .theorem = Theorem

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Kaihhruaina


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
        [numbered] Milem { $enumeration }
        [numbered-caption] Milem { $enumeration }{ ": " }
        [unnumbered-caption] Milem{ ": " }
       *[unnumbered] Milem
    }


## Paginator controls

paginator-previous = Hmasa
paginator-next = Dawt
paginator-page = Phêk

paginator-page-status = { $pageLabel } { $numPages } zînga { $currentPage }-na


## Piecewise functions

piecewise-condition-or = emaw

piecewise-condition-if = a nih chuan

piecewise-condition-otherwise = a nih loh chuan


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so those
## 130 keys fall back to English. Mizoram teaches secondary chemistry in
## English, out of English textbooks, so the element names a Mizo student meets
## are the English ones and a Mizo table would be a claim about spelling rather
## than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Chemical Symbol Dik Lo
chemistry-invalid-ionic-compound = Ionic Compound Dik Lo


## Inputs embedded in math

math-embedded-input-blank = ruak

math-embedded-input-blank-ordinal = ruak { $total } zînga { $ordinal }-na
