# Kpelle content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `chrome.ftl`'s header for the family (Southwestern/South Mande, distinct
# from `bm`/`dyu`/`mnk`'s Manding/Central Mande), the agreement finding
# (`$gender` and `$role` both go unused — no adjective agreement, though South
# Mande does carry a definiteness/specificity suffix elsewhere in its grammar,
# on the noun and its pronominal system, not on a following adjective), and
# the confidence caveat (Kpelle is essentially unattested in MT training data,
# so this seed keeps more English loanwords, especially for technical
# vocabulary, than the Manding catalogs do).
#
# Adjectives follow the noun uninflected, so the composition messages here put
# the noun first, matching `bm`/`dyu`/`mnk`.
#
# The mathematical and chemistry nouns are the first thing to check — see the
# chemistry note at the foot of this file.


## Style vocabulary
##
## The words the style pipeline derives from a component's numeric and
## enumerated style values. A word an author writes directly — `lineColorWord`,
## `markerStyleWord`, and their siblings — passes through untranslated: the
## author chose those words, and rewriting them would be a surprise. So does a
## CSS named color asked for by name ("rebeccapurple"), which
## `resolveColorWord` deliberately preserves.
##
## Every adjective here is handed `$gender`, the grammatical gender of the noun
## it describes (see `noun-gender`), and `$role`, the syntactic position the
## phrase it belongs to is going into. English has no agreement and ignores
## both; a language that inflects selects on them.
##
## `$role` is one of:
##
##   standalone          the phrase stands on its own, which is where all but
##                       the three below are
##   border-clause       inside `style-border-clause`, behind its preposition
##   background-clause   the background colour inside `style-text`, behind its
##                       preposition
##   text-clause         the text colour beside it, inside `style-text`
##
## The last three exist because those words are rendered in two places each —
## once alone, as `borderStyleDescription`, `backgroundColor` and `textColor`
## report them, and once embedded in a clause. A language that inflects for
## case needs a different form in each, and no amount of `$gender` can say
## which is wanted. Which case a position governs is the catalog's business:
## `border-clause` is a dative in German, an instrumental in Russian and
## Polish, and nothing at all in a language that does not inflect.

# The canonical color families a color value resolves to.
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

# Stroke widths. Only the extremes are named — a middling width is described by
# its color alone.
line-width =
    .thick = thick
    .thin = thin

# Dash patterns. A solid stroke is described by its color alone.
line-style =
    .dashed = dashed
    .dotted = dotted

# Patterns a shape's interior can be filled with. A solid fill is described by
# its color alone.
fill-style =
    .horizontal = horizontal lines
    .vertical = vertical lines
    .diagonal = diagonal lines
    .backdiagonal = reverse diagonal lines
    .dots = dots
    .diamonds = diamonds

# The things being described. The shapes a point can be drawn as ("square",
# "cross") are nouns too: a point's description names its marker shape rather
# than always saying "point".
noun =
    .line = line
    .line-segment = line segment
    .ray = ray
    .vector = vector
    .curve = curve
    .function = function
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

# A regular polygon names its side count, so it is a message of its own rather
# than one of `noun`'s attributes.
#
# `$part` splits the noun where a language needs it split: `head` is the word
# the adjectives attach to, `tail` a complement that follows them. English
# folds the side count into the head and has no tail; Spanish says "polígono
# regular" and puts "de 5 lados" after the adjectives, so that they stay beside
# the noun they agree with. `style-with-noun` and `style-filled-with-noun`
# place the two halves.
#
# `$numSides` is a real number, so it is formatted by the locale's own rules —
# a 1000-gon reads "1,000-sided" here and "de 1000 lados" in Spanish. That is
# the number-formatting policy in the README, and the one place a description
# is not character-for-character what the pre-catalog code produced.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides }-sided regular polygon
    }

# The grammatical gender of the noun being described, passed to every adjective
# describing it so that translations can agree. English has no grammatical
# gender, so every noun answers the same and the answer goes unused.
#
# `$noun` is one of `noun`'s attribute names, `regular-polygon` for the shape
# `noun-regular-polygon` names, or the head of a phrase the description builds
# without naming it as a noun: `border`, `fill`, `text`, or `background`. A
# word this message does not list falls to its default gender — which is also
# what an author's own `markerStyleWord` gets, since the catalog has never seen
# it.
noun-gender = neuter


## Style composition
##
## `$parts` names which pieces the style actually supplies, so that a
## translation can order and inflect each combination on its own terms instead
## of substituting into a fixed English frame. An absent piece is a different
## branch, never an empty placeable.

# The adjectives describing a stroke: its width, its dash pattern, and its
# color. Also describes a shape's border, where the color is dropped when it
# matches the fill it surrounds.
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

# A style description followed by what it describes: "thick red line".
#
# `$nounTail` is the noun's trailing complement, for the nouns whose
# translation splits around the adjectives (see `noun-regular-polygon`).
# English has none today, so it only ever selects `noun` for itself — the other
# variant is still what a partly-translated locale falls back to, and dropping
# it would drop that locale's side count.
#
# The phrase it builds is never governed by anything, so its `$role` is always
# `standalone`.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

# The word marking a shape as filled.
#
# A key of its own, looked up by the code and handed to the messages below as
# `$filled`, rather than literal text inside them: a language that inflects it
# has to agree it with the shape. Referencing it from those messages would not
# do — a term reference (`{ -filled }`) gets an empty scope and never sees
# `$gender`, and a message reference resolves only inside its own bundle, so a
# locale that translated `style-filled` but not this word would render the
# reference literally instead of falling back to English.
#
# Said only of the shape itself, so its `$role` is always `standalone`.
style-filled-word = filled

# A filled shape, and the pattern its interior is drawn with, if any.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } with { $pattern }
       *[plain] { $filled } { $color }
    }

# The same, naming the shape: "filled blue circle with diamonds".
#
# The `-tail` variants carry the noun's trailing complement, as
# `style-with-noun` does.
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } with { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } with { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# The border clause appended to a filled shape: "with a thick red border".
#
# `$parts` carries two distinctions English cares about: whether a fill pattern
# was already mentioned, which makes this a further clause ("and") rather than
# the first ("with"), and whether the surrounding description named the shape,
# which is where English wants an article.
style-border-clause =
    { $parts ->
        [with-article] with a { $border } border
        [and] and { $border } border
        [and-article] and a { $border } border
       *[with] with { $border } border
    }

# How a shape's interior is filled, on its own: "blue diamonds".
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = unfilled

# How a piece of text is styled: its color, and the background behind it.
#
# The only composition message with no `$role`: its two words sit in two
# different positions, so they arrive already inflected for `text-clause` and
# `background-clause` respectively and no one token would describe them both.
style-text =
    { $parts ->
        [background] { $color } with a { $background } background
       *[plain] { $color }
    }

# What `backgroundColor` answers when nothing is drawn behind the text.
style-background-none = none


## Boolean words
##
## What a `<boolean>` or `<booleanInput>` *displays*.
##
## Not what it parses or serializes. `true` and `false` are DoenetML syntax —
## an author writes them in the source, `<award>` compares against them, and
## saved state stores them — so they stay English everywhere, in every
## language, exactly as `<` stays `<`. Only the word the reader sees moves.
##
## The consequence is that a value has two spellings in a translated document,
## and both have to be accepted where one is read back in: see
## `booleanFromWord` in the worker.

boolean-true = true
boolean-false = false


## Answer buttons
##
## The default text on an answer's submit button. Only the *default* is
## translated: an author who writes `submitLabel="Ready?"` gets "Ready?" in
## every locale, because they chose those words for their document and a
## translation of it is not Doenet's to make.

# Shown when the answer will report whether the response was right.
answer-submit-label = Check Work

# Shown when it will not — the reader submits, and is told nothing more.
answer-submit-label-no-correctness = Submit Response


## Sectional blocks
##
## The word a sectional block calls itself, which the reader sees in its
## heading and on a `<solution>`'s reveal control. Keyed by the element the
## author writes, so `<subsection>` and `<subsubsection>` share `.section` —
## they are all called a section.
##
## An author who writes `renameTo` has named the block themselves, and that
## name passes through in every language.

section-name =
    .activity = Activity
    .aside = Aside
    .cascade = Cascade
    .definition = Definition
    .example = Example
    .exercise = Exercise
    .exercises = Exercises
    .given-answer = Answer
    .note = Note
    .objectives = Objectives
    .paragraphs = Paragraphs
    .part = Part
    .problem = Problem
    .problems = Problems
    .proof = Proof
    .question = Question
    .section = Section
    .solution = Solution
    .task = Task
    .theorem = Theorem

# The heading a section builds for itself: "Example 2", "Section 1.3: Limits".
#
# `$parts` names which pieces are present and whether a `<title>` follows, so
# that a translation orders and punctuates each combination on its own terms
# rather than substituting into an English frame. English puts the word first
# and separates a title with a colon — or with a period when the heading is a
# bare number — and none of that is a given.
#
# The `-title` variants end in the separator, because what follows them is the
# title child, rendered separately. Fluent trims trailing whitespace, so the
# separator is written as a string literal to keep its space.
#
# `$sectionNumber` arrives as text ("2", "1.3") rather than as a number: it is
# an identifier made of counters, and it is not the catalog's to reformat.
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

# The heading a `<hint>` shows when the author gave it no `<title>`.
hint-title = Hint


## Tables and figures
##
## The name a `<table>` or `<figure>` gives itself, which the renderer sets in
## bold at the head of the title or caption: "Table 2", "Figure 3". An
## unnumbered one is named by the bare word.
##
## The word and the number are one message rather than a word the code
## concatenates a number onto, so that a language which orders or punctuates
## them differently can say so.
##
## `$enumeration` arrives as text rather than as a number: it identifies the
## table, so the thousandth one is "Table 1000" and not "Table 1,000".
##
## The `-title` and `-caption` branches end in the separator joining the name
## to the authored title or caption, which the renderer used to write as a
## literal `": "` of its own. That child is arbitrary marked-up content
## rendered after this string rather than an argument passed into it, so where
## it sits is the one thing a translation cannot reorder — the same shape
## `section-title-prefix` has.

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
##
## The strip of controls that steps through a `<paginator>`'s pages. All three
## words are author-overridable attributes, so only the default is translated.

paginator-previous = Previous
paginator-next = Next
paginator-page = Page

# The status between the two buttons: "Page 3 of 5".
#
# Composed in the worker rather than in the renderer so that the whole of it is
# in one language: `$pageLabel` is the `pageLabel` attribute, which an author
# may have written themselves, and the words joining it to the counts have to
# sit beside it in the same tongue.
#
# The two counts arrive as text, for the same reason `$enumeration` does above.
paginator-page-status = { $pageLabel } { $currentPage } of { $numPages }


## Piecewise functions
##
## `<piecewiseFunction>` renders each branch's domain as mathematics and writes
## these three words around it: "if 1 < x < 2 or 4 < x < 5", and "otherwise"
## for the branch that catches what the others leave. The inequalities are
## notation and stay as they are; these are prose, and are read aloud as prose.
##
## `or` is the only conjunction the core composes into content. Everything else
## that reads as "a, b, and c" is a diagnostic, and those are joined by
## `Intl.ListFormat` at the moment the reader's language is known rather than
## by a catalog word (see `DiagnosticListArg`).

piecewise-condition-or = or

# Introduces the domain a branch applies on; the mathematics follows it.
piecewise-condition-if = if

# The last branch, which applies wherever none of the earlier ones do.
piecewise-condition-otherwise = otherwise


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Liberia — home to the large majority of Kpelle
## speakers — teaches secondary science in English, its sole official
## language, so a Kpelle speaker meets the periodic table there and the
## fallback *is* the curriculum. Guinea, where the rest of Kpelle is spoken,
## teaches in French instead, but Liberia's Kpelle-speaking population
## dwarfs Guinea's, so the majority case is what this omission follows —
## the same reasoning `locales/dyu` and `locales/mnk` give for the opposite
## conclusion, one border away.

# A transition metal's ion, named with its oxidation state: "Iron (II)".
#
# The Roman numeral is IUPAC notation and is the same in every language. Where
# it sits and how it is punctuated is not, which is why this is a message and
# not a suffix the code appends.
ion-name-oxidation-state = { $name } ({ $numeral })

# Shown in place of a chemical symbol or formula that names nothing. Rendered
# into mathematics as well as into text, so the brackets around it are added by
# the code — inside `\text{}` for the LaTeX form — and are not part of the
# message.
chemistry-invalid-symbol = Invalid Chemical Symbol
chemistry-invalid-ionic-compound = Invalid Ionic Compound
