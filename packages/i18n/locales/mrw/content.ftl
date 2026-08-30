# Maranao (Basa a Mëranaw) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in. `locales/en/content.ftl` is the source of truth, and message ids,
# placeables and variant keys are never translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **The schwa is written «ë» (U+00EB)** — «maitëm», «pëkhagamit», «galëbëk»,
# «madakël». Print also writes that vowel as a bare **e**, as **e'**, and in
# older material as **u**. Respell rather than retranslate, and respell all
# four files at once.
#
# ## Word order, and the linker
#
# **The describing word comes first, the noun after it, with the linker «a»
# between them**: «makapal a mariga a linya» is *thick red line*. That is
# English's order and Maranao's ordinary order for an attributive phrase, so
# `style-stroke`, `style-with-noun` and `style-filled-with-noun` keep English's
# sequence of placeables.
#
# **The linker is one shape.** Maranao writes «a» whatever stands on either
# side of it, so this catalog does not have the problem the other Philippine
# catalogs in the roster do — Tagalog's «na»/«-ng», Cebuano's «nga»/`-ng`,
# Ilocano's «a»/«nga», Pangasinan's «a»/«-n» — where a neighbouring word the
# catalog cannot see picks the form. Nothing here can misfire against an
# author's own `lineColorWord`. That is worth stating because it is the one
# place this thin catalog is on firmer ground than the fuller ones beside it.
#
# **«manga» is the plural word**, written only where the sense is genuinely
# plural — the fill patterns. The noun is otherwise unmarked, so «linya» is
# the word for one line and for many alike.
#
# ## Vocabulary — what is Maranao and what is a loan
#
# **Five colour words are Maranao**: «maitëm» (black), «mapoti» (white),
# «mariga» (red), «binaning» (yellow), «gadong» (green). **The other seven are
# the English words as they stand** — gray, orange, cyan, blue, purple, pink,
# brown — because the seed found no Maranao term for them it could vouch for
# and Lanao's classrooms say the English ones. That is the same shape
# `locales/fon` has, where three reduplicated colour statives sit beside nine
# French loans, and the seam is in the same place: a speaker correcting this
# should expect to *add* Maranao words to that table rather than to find the
# loans wrong as loans.
#
# «makapal» (thick) and «manipis» (thin) are Maranao. `line-style`'s two words
# and **the whole of the `noun` table are English**, for the same reason: the
# geometry vocabulary a Maranao speaker has is the English one they were
# taught in. Nothing was coined and nothing was respelled into an invented
# loan phonology.
#
# Maranao has no grammatical gender and no case, so `noun-gender` answers one
# token for every noun and nothing here selects on `$gender` or `$role`.
#
# **The two chemistry tables — `element-name` and `element-anion-name` — are
# omitted.** Secondary science in Lanao is taught in English, so the English
# fallback is the language of the classroom, and filling those 132 keys in
# would claim a translation that had not happened. `ion-name-oxidation-state`
# and the two `chemistry-invalid-` messages are prose and are translated.


## Style vocabulary

# Five Maranao words and seven English ones; see the header.
color =
    .black = maitëm
    .white = mapoti
    .gray = gray
    .red = mariga
    .orange = orange
    .yellow = binaning
    .green = gadong
    .cyan = cyan
    .blue = blue
    .purple = purple
    .pink = pink
    .brown = brown

line-width =
    .thick = makapal
    .thin = manipis

line-style =
    .dashed = dashed
    .dotted = dotted

# «manga» is written here because a fill pattern is genuinely many marks.
fill-style =
    .horizontal = horizontal a manga linya
    .vertical = vertical a manga linya
    .diagonal = diagonal a manga linya
    .backdiagonal = reverse diagonal a manga linya
    .dots = manga dot
    .diamonds = manga diamond

noun =
    .line = linya
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
    .triangle = triangle
    .rectangle = rectangle
    .circle = circle
    .region = region
    .point = point
    .square = square
    .diamond = diamond
    .cross = cross
    .plus = plus

# The side count follows the adjectives as a complement, so that they stay in
# front of the noun. «aden a» is 'there is', and «kilid» ('edge, side') is one
# of the few content words in this file that is not a loan.
noun-regular-polygon =
    { $part ->
        [tail] a aden a { $numSides } a kilid iyan
       *[head] regular polygon
    }

# One answer for every noun: Maranao has no grammatical gender, so nothing
# downstream has anything to agree with.
noun-gender = neuter


## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width } a { $lineStyle } a { $color }
        [width-color] { $width } a { $color }
        [style-color] { $lineStyle } a { $color }
        [width-style] { $width } a { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

style-with-noun =
    { $parts ->
        [noun-tail] { $description } a { $noun } { $nounTail }
       *[noun] { $description } a { $noun }
    }

style-filled-word = napno

style-filled =
    { $parts ->
        [pattern] { $filled } a { $color } a aden a { $pattern } iyan
       *[plain] { $filled } a { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } a { $color } a { $noun } a aden a { $pattern } iyan
        [plain-tail] { $filled } a { $color } a { $noun } { $nounTail }
        [pattern-tail] { $filled } a { $color } a { $noun } { $nounTail } a aden a { $pattern } iyan
       *[plain] { $filled } a { $color } a { $noun }
    }

# Maranao has no article, so the two `-article` branches say what the other two
# say. They are kept apart because English's distinction is between a first
# clause and a further one, and this file does mark that: «a aden a … iyan»
# against «go».
style-border-clause =
    { $parts ->
        [with-article] a aden a { $border } a border iyan
        [and] go { $border } a border
        [and-article] go { $border } a border
       *[with] a aden a { $border } a border iyan
    }

style-fill =
    { $parts ->
        [pattern] { $color } a { $pattern }
       *[plain] { $color }
    }

style-unfilled = di napno

style-text =
    { $parts ->
        [background] { $color } a aden a { $background } a background iyan
       *[plain] { $color }
    }

style-background-none = da


## Boolean words

boolean-true = bënar
boolean-false = di bënar


## Answer buttons

answer-submit-label = Ilayn so Galëbëk
answer-submit-label-no-correctness = Isogo so Sëmbag


## Sectional blocks
##
## Mostly English, for the reason the header gives. «Ma-ana» (meaning),
## «Ibarat» (example), «Bagi» (part), «Sëmbag» (answer) and «Galëbëk» (work)
## are Maranao; «Nota» is a Spanish loan carried in through Filipino.

section-name =
    .activity = Activity
    .aside = Aside
    .cascade = Cascade
    .definition = Ma-ana
    .example = Ibarat
    .exercise = Exercise
    .exercises = Manga Exercise
    .given-answer = Sëmbag
    .note = Nota
    .objectives = Manga Objective
    .paragraphs = Manga Paragraph
    .part = Bagi
    .problem = Problem
    .problems = Manga Problem
    .proof = Proof
    .question = Question
    .section = Section
    .solution = Solution
    .task = Galëbëk
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

hint-title = Hint


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
        [numbered] Figure { $enumeration }
        [numbered-caption] Figure { $enumeration }{ ": " }
        [unnumbered-caption] Figure{ ": " }
       *[unnumbered] Figure
    }


## Paginator controls

paginator-previous = Miyaona
paginator-next = Somonod
paginator-page = Page

paginator-page-status = { $pageLabel } { $currentPage } ko { $numPages }


## Piecewise functions

piecewise-condition-or = odi na

piecewise-condition-if = amay ka

piecewise-condition-otherwise = amay ka di


## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Di Ontol a Chemical Symbol
chemistry-invalid-ionic-compound = Di Ontol a Ionic Compound

## Inputs embedded in math

math-embedded-input-blank = blangko

math-embedded-input-blank-ordinal = blangko { $ordinal } ko { $total }
