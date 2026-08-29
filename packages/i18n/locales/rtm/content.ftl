# Rotuman (Fäeag Rotuạm) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Where Rotuman sits.** Rotuman is **Oceanic, and an isolate within
# Oceanic**: it is not Polynesian, and it is not Fijian. Centuries of contact
# with Tonga, Sāmoa and Futuna have left a heavy Polynesian layer on top of it,
# which is exactly what makes it dangerous to seed — a word that looks
# Polynesian may be a loan, a chance resemblance, or nothing at all. So this
# file **does not assume cognates with the Polynesian catalogs of this batch**
# (`sm`, `to`, `niu`, `tkl`, `tvl`, `wls`, `rar`, `ty`, `mi`, `haw`): where it
# writes a Rotuman word it writes one it could support on its own, and where it
# could not it writes the English word and says so below.
#
# `locales/fj` (Fijian) is the **nearest existing catalog geographically** —
# Rotuma is part of Fiji, and Rotuman children meet Fijian in school — but
# Fijian is a different branch of Oceanic. Anything this file has in common
# with `locales/fj` is typological or areal, never inherited, and no word here
# was taken from it.
#
# **Orthography.** This file writes the **Churchward orthography**, the one
# used by the 1940 grammar and dictionary and by printed Rotuman since: the
# diacritic letters «ä», «å», «ạ», «ẹ», «ọ» and «ụ» are **part of the
# spelling**, not decoration, and the glottal stop is written with an
# apostrophe («noa'ia», «Rotuạm»). A reviewer who strips the diacritics is
# writing a different orthography, not a simplified one, and should convert the
# whole catalog rather than one message.
#
# **Metathesis: the one thing this seed is most likely to have got wrong.**
# Nearly every Rotuman word has two phases — a **complete** phase and an
# **incomplete** phase formed from it by metathesis and vowel change («hosa» /
# «hoas», «fupa» / «fuap») — and which of the two appears is **grammatically
# determined**, not stylistic: broadly, the complete phase stands before the
# definite article and before what is suffixed to it, and the incomplete phase
# stands where the word is indefinite or ends its phrase.
#
# **This file writes the complete (citation) phase in every position**, because
# that is the form a dictionary gives and the only one this seed could derive
# reliably. That is certainly wrong in some of these positions — a bare button
# label naming an indefinite thing wants the incomplete phase — and a reviewer
# should check the phase of **every Rotuman word below before checking anything
# else about it**. The choice is uniform on purpose: one systematic error is
# findable where a scatter of guesses is not.
#
# **Two words break that uniformity, and they break it on the source's
# authority rather than this seed's.** The compounds «sah kạlkạlu» (circle) and
# «perper mi'a» (orange) are printed in the wordlist with their **first element
# in the incomplete phase** — «saha» → «sah», «perpero» → «perper» — because
# that is what a Rotuman compound requires of its head. They are quoted as
# printed. So the rule for reading this file is: single words are complete
# phase, and those two compounds are as the dictionary has them.
#
# **Lexicon: what this seed commits to, and what it does not.** Rotuman's
# published lexical material is a single grammar-and-dictionary tradition, and
# it has no settled vocabulary for graphs, functions, or the DoenetML machinery
# these files talk about. Rather than dress English up in Rotuman shape, this
# catalog **keeps the technical vocabulary as the English word** and marks it
# as a loan — the `locales/na` method, for the same reason: the frame is this
# file's contribution and the lexicon is its debt. The grammatical words it
# commits to are:
#
#   «Rotuạm»      Rotuma; «Fäeag Rotuạm» the Rotuman language
#   «fäeag»       word, speech, language; to speak
#   «ma»          and, with — the one connective used below
#   «'e»          at, in, on
#   «ne»          of; that (the linker/relative)
#   «kepoi ka»    if — used once, in `piecewise-condition-if`, and the least
#                 certain item on this list. Check it first.
#
# **The style tables are the exception, and they are no longer a loan.** The
# colour words, the two width words and a few of the shape nouns are basic
# vocabulary rather than technical jargon, they are well attested, and they are
# the most audible strings in the package — they compose into the shape
# descriptions a screen-reader speaks. Rendering «thick dashed red line» wholly
# in English was a worse outcome than the loan convention intends, so this seed
# looked them up and committed to them. **Source for every one of them:** the
# English–Rotuman wordlist derived from C. Maxwell Churchward's *Rotuman
# Grammar and Dictionary* (1940), published at
# `http://www.rotuma.net/os/English-Rotuman_wordlist.pdf`. That wordlist prints
# each word twice, once stripped for searching and once with Churchward's
# diacritics; **the diacritic column is the one quoted here**, respelled with
# this file's ASCII apostrophe for the glottal stop. Churchward 1940 itself was
# not consulted directly, so every word below is at one remove from the
# dictionary and a reviewer with the book should check it against the book.
#
#   colour   «kele» black · «fisi» white · «rạhrạhu» grey · «mi'a» red ·
#            «perper mi'a» orange · «perpero» yellow · «jarava» green ·
#            «fakfīnefe'ata» purple · «harmimi'a» pink
#   width    «mafolu» thick · «teaptepa» thin
#   nouns    «saha» line · «sah kạlkạlu» circle (literally *round line*) ·
#            «tusi» dot, for the dotted fill
#
# **«fakfīnefe'ata» carries a macron**, which the orthography note above does
# not list among this file's letters. It is Churchward's spelling and it is
# kept; the note is what is incomplete, not the word.
#
# **Where the Rotuman colour system does not match English's, recorded rather
# than split silently.** Two overlaps, on the model `locales/gil` sets for
# «mawaawa»:
#
#   * **«jarava» is green and blue both.** The wordlist glosses it for each,
#     and «a'jarava» is *to make blue-green*. This file assigns it to *green*
#     and **leaves `blue` as the English loan**, so that the two keys do not
#     collapse onto one word. A reviewer may prefer the reverse assignment;
#     what matters is that they stay distinct.
#   * **«rạhrạhu» is grey and brown both.** It is assigned to *grey* here and
#     `brown` is **left as the English loan** for the same reason. The wordlist
#     does offer «mia' rahrahu» as a general term for brown, and a reviewer who
#     wants brown in Rotuman should start there — this seed did not take it
#     because that entry's diacritics are printed inconsistently in the source.
#
# **What stayed English in the style tables, and why.** `cyan` — no entry.
# `dashed` and `dotted` as line styles — no entry; «tustusi» is *spotted*, of a
# surface, not of a line. `horizontal` and `vertical` — **the wordlist gives
# «nojo» for both**, along with *straight*, *upright* and *level*: it means
# aligned, not an axis, so it cannot tell the two keys apart and neither key
# takes it. `diagonal` — no entry. `point` — «isu» and «kō» are a tip and *to
# point at*, not a geometric point. `square` — «läe» is a square on a
# checkerboard, not the figure. `cross` — «'ại fakrava» is a physical crossed
# stick. `angle` — «majaga» is the fork between two branches. Each of those is
# a near miss recorded so that a reviewer need not re-do the search.
#
# Everything else in these files is English. Replacing any of it is the work
# this catalog was written to make easy, and needs no permission.
#
# **No grammatical gender.** `noun-gender` answers one token and no adjective
# in these files forks on `$gender`. **No `$role` fork** either: nothing here
# changes shape between a standalone position and a clause.
#
# **Number.** A Rotuman noun is not marked for number by a numeral in front of
# it, so a count changes nothing about the word beside it. `Intl.PluralRules`
# has no CLDR data for `rtm` and resolves against the runtime's default locale,
# so a `[two]`, `[few]` or `[many]` branch here would be text nothing could
# select — only `one`, `other` and explicit numeric literals are written.
#
# **Word order: the describing word follows the noun**, which is what «Fäeag
# Rotuạm» itself shows. `locales/fj` and the batch's Polynesian catalogs put it
# there too; that agreement is areal and typological rather than inherited, and
# it is recorded here as agreement about *shape*, not about descent.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are not written here. Chemistry on Rotuma and in the
# Fijian schools Rotuman students go on to is taught in English; a Rotuman
# column of element names would report a fact about a curriculum that does not
# exist rather than a fact about the language. Every other key in
# `locales/en/content.ftl` is covered, including the two new
# `math-embedded-input-blank` keys.
#
# **The composition messages are where the frame shows**, and they are the part
# of this catalog a speaker is most likely to keep. English writes «thick red
# line»; this file puts the noun first and its describing words behind it, and
# `style-fill` puts the pattern ahead of its colour for the same reason. The
# four branches of `style-border-clause` all open with «ma», the one connective
# this seed commits to, and they no longer differ: Rotuman has no indefinite
# article, so English's `-article` distinction has nothing to spend itself on.
#
# **The phase warning above bites hardest here.** These are the messages whose
# words end a phrase or stand indefinite, which is exactly where the incomplete
# phase belongs. Every word in them is written in the complete phase.
#
# **`piecewise-condition-if` lands correctly.** The renderer places the word
# *before* the mathematics it introduces, and Rotuman «kepoi ka» opens its
# clause, so this catalog is on the side of the line `locales/mdf` and the Sami
# catalogs are on rather than the side `locales/kv` and `locales/kca` are. What
# is uncertain here is the word, not its position.
#
# `noun-regular-polygon` folds the side count into the head and leaves `[tail]`
# empty. That is a guess and deserves a reviewer's attention: a side count is
# naturally a relative clause in Oceanic, and a relative clause follows the
# whole phrase — if Rotuman counts that way, «5» belongs in `[tail]` and this
# message is wrong as written.

color =
    .black = kele
    .white = fisi
    .gray = rạhrạhu
    .red = mi'a
    .orange = perper mi'a
    .yellow = perpero
    .green = jarava
    .cyan = cyan
    .blue = blue
    .purple = fakfīnefe'ata
    .pink = harmimi'a
    .brown = brown

line-width =
    .thick = mafolu
    .thin = teaptepa

line-style =
    .dashed = dashed
    .dotted = dotted

# «saha» is the noun and the English pattern word follows it, which is this
# file's order everywhere. «nojo» is not usable for `horizontal`/`vertical`:
# see the header.
fill-style =
    .horizontal = saha horizontal
    .vertical = saha vertical
    .diagonal = saha diagonal
    .backdiagonal = saha reverse diagonal
    .dots = tusi
    .diamonds = diamond

noun =
    .line = saha
    .line-segment = saha segment
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
    .circle = sah kạlkạlu
    .region = region
    .point = point
    .square = square
    .diamond = diamond
    .cross = cross
    .plus = plus

noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides }-sided regular polygon
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

# The noun leads and its describing words follow it, which is the opposite of
# English and is the shape «Fäeag Rotuạm» itself has.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = filled

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ma { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ma { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } ma { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# Rotuman has no indefinite article, so the two `-article` branches say what
# their siblings say. All four open with «ma», the one connective this seed
# commits to.
style-border-clause =
    { $parts ->
        [with-article] ma border { $border }
        [and] ma border { $border }
        [and-article] ma border { $border }
       *[with] ma border { $border }
    }

# The pattern is the noun and its colour follows it, as everywhere else here.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = unfilled

style-text =
    { $parts ->
        [background] { $color } ma background { $background }
       *[plain] { $color }
    }

style-background-none = none

## Boolean words

boolean-true = true
boolean-false = false

## Answer buttons

answer-submit-label = Check Work

answer-submit-label-no-correctness = Submit Response

## Sectional blocks

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

paginator-previous = Previous
paginator-next = Next
paginator-page = Page

paginator-page-status = { $pageLabel } { $currentPage } of { $numPages }

## Piecewise functions

piecewise-condition-or = or

piecewise-condition-if = kepoi ka

piecewise-condition-otherwise = otherwise

## Chemistry

# `element-name` and `element-anion-name` are deliberately not written here;
# the file header says why. The three keys below are prose rather than a
# periodic table, so they are covered.
ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Invalid Chemical Symbol
chemistry-invalid-ionic-compound = Invalid Ionic Compound

## Inputs embedded in math

math-embedded-input-blank = blank

math-embedded-input-blank-ordinal = blank { $ordinal } of { $total }
