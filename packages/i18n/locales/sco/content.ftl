# Scots content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Scots looks like the source**, which is this catalog's whole difficulty;
# `chrome.ftl` carries the note and the word list. Nothing here is written in
# English because English would do — it is written in English only where a
# Scots dictionary gives the same word, which for the technical nouns of a
# geometry description is most of them.
#
# **No grammatical gender and no case**, so `noun-gender` answers one token for
# every noun and **nothing in these four files forks on `$gender` or `$role`**,
# in the shape `locales/en`, `locales/tpi` and `locales/bi` already use.
# Adjectives precede the noun, as in English.
#
# **The periodic table is left to fall back to English.** Secondary science in
# Scotland is taught in English, out of English textbooks, so the table a Scots
# speaker meets in the classroom is the English one and the fallback *is* the
# curriculum. That is the sentence thirteen other catalogs of this batch record,
# and it is the plainest case of it: here the fallback language is the reader's
# own school language rather than a neighbouring state's.


## Style vocabulary

color =
    .black = black
    .white = white
    .gray = gray
    .red = reid
    .orange = orange
    .yellow = yella
    .green = green
    .cyan = cyan
    .blue = blae
    .purple = purpie
    .pink = pink
    .brown = broun
line-width =
    .thick = thick
    .thin = thin
line-style =
    .dashed = strokit
    .dotted = dottit
fill-style =
    .horizontal = level lines
    .vertical = upricht lines
    .diagonal = squint lines
    .backdiagonal = backwart squint lines
    .dots = dots
    .diamonds = diamonds
noun =
    .line = line
    .line-segment = line segment
    .ray = ray
    .vector = vector
    .curve = curve
    .function = function
    .slope-field = brae field
    .vector-field = vector field
    .parabola = parabola
    .polyline = polyline
    .polygon = polygon
    .triangle = triangle
    .rectangle = rectangle
    .circle = circle
    .region = region
    .point = pynt
    .square = squar
    .diamond = diamond
    .cross = corss
    .plus = plus
# Scots folds the side count into the head, as English does, so there is no
# tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regular { $numSides }-sidit polygon
    }
# One answer for every noun: Scots has no grammatical gender.
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
style-filled-word = fillt
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } wi { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } wi { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } wi { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
style-border-clause =
    { $parts ->
        [with-article] wi a { $border } mairch
        [and] an { $border } mairch
        [and-article] an a { $border } mairch
       *[with] wi { $border } mairch
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = no fillt
style-text =
    { $parts ->
        [background] { $color } on a { $background } backgrund
       *[plain] { $color }
    }
style-background-none = nane

## Boolean words

boolean-true = true
boolean-false = fause

## Answer buttons

answer-submit-label = Check the Darg
answer-submit-label-no-correctness = Send the Repone

## Sectional blocks

section-name =
    .activity = Activity
    .aside = Aside
    .cascade = Cascade
    .definition = Definition
    .example = Exemple
    .exercise = Exercise
    .exercises = Exercises
    .given-answer = Answer
    .note = Note
    .objectives = Ettles
    .paragraphs = Paragraphs
    .part = Pairt
    .problem = Problem
    .problems = Problems
    .proof = Pruif
    .question = Quaisten
    .section = Section
    .solution = Solution
    .task = Darg
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

paginator-previous = Afore
paginator-next = Neist
paginator-page = Page
paginator-page-status = { $pageLabel } { $currentPage } o { $numPages }

## Piecewise functions

piecewise-condition-or = or
piecewise-condition-if = gin
piecewise-condition-otherwise = itherwise

## Chemistry
##
## The 118 element names and the 12 anion names fall back to English, and here
## that is the reader's own school language: secondary science in Scotland is
## taught in English out of English textbooks, so the fallback *is* the
## curriculum. Scots has its own words for the metals it knew long before the
## table — «airn», «siller», «lead», «brass» — but no settled list of all 118,
## and coining one would report a machine's guess as a classroom word.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = The chemical symbol isna valid
chemistry-invalid-ionic-compound = The ionic compound isna valid

## Inputs embedded in math

# Read aloud inside the mathematics and never shown on screen, so it stays to
# one word.
math-embedded-input-blank = blank
math-embedded-input-blank-ordinal = blank { $ordinal } o { $total }
