# Nauruan (dorerin Naoero) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This file writes the **1938 reformed spelling** — the one
# the Nauruan orthography committee settled, which carries the tilde vowels
# «ã», «ẽ», «ĩ», «õ», «ũ» and the letter «ñ», and which spells the island
# «Naoero». The older missionary spelling used by Delaporte's dictionary and
# Kayser's grammar writes several of the same sounds differently, and printed
# Nauruan today is inconsistent between the two — much of it drops the
# diacritics altogether. A reviewer who prefers the older spelling should
# convert the whole file rather than mix the two systems; a diacritic is part
# of the spelling here, not decoration.
#
# **What this seed could not establish, said plainly once.** Nauruan is
# Micronesian, and it is the family's most divergent member: a large part of
# its lexicon has no transparent cognate in Marshallese, Chuukese, Pohnpeian,
# Kosraean or Gilbertese, and published Nauruan lexical material is thin and
# hard to reach. So this seed **did not derive its vocabulary from the other
# Micronesian catalogs of this batch** (`mh`, `chk`, `pon`, `kos`, `gil`) the
# way `locales/sms` derived its from Northern Sami — a regular correspondence
# is what makes that sound, and Nauruan does not offer one. It agrees with
# those five about *structure* and disagrees with them about *method*.
#
# What it does instead: **every technical term is kept as the English word, in
# English spelling, and is marked as a loan rather than dressed up as
# Nauruan.** That is a real fact about Nauru — schooling and mathematics
# teaching there are in English, and the language already takes institutional
# loans («Repubrikin Naoero») — but it is also a confession: this seed could
# not find the Nauruan words, and respelling English by an invented loan
# phonology would have presented a guess as a fact. The **frame** is this
# file's contribution — word order, the linker, the absence of gender and
# number agreement, the variant keys — and the **lexicon** is the debt. A
# speaker replacing the nouns and verbs below is doing the work this file was
# written to make easy, and needs no permission for any of it.
#
# The only Nauruan words this seed commits to are:
#   «Naoero»      Nauru, the island and the language's home
#   «dorer»       word, speech, language («dorerin Naoero», the Nauruan
#                 language) — the source of the linker below
#   «-n» / «-in»  the construct linker joining a head noun to what follows
#                 it, as in «Repubrikin Naoero» and «dorerin Naoero». This is
#                 the one productive rule the seed applies, and it applies it
#                 only where a genitive is plainly wanted.
#   «ma»          and, with. Supported by the national anthem's «ngabena ma
#                 auwe» and by Gilbertese «ma», Nauruan's nearest neighbour —
#                 a comparative inference, not an attestation. Check it first.
#
# **Two colour words are now added to that list, and they are the only ones.**
# The `color`, `line-width`, `line-style`, `fill-style` and `noun` tables are
# basic vocabulary rather than technical jargon, and they are the most audible
# strings in the package — they compose into the shape descriptions a
# screen-reader speaks — so this seed went looking for Nauruan words for them
# rather than leaving the whole of «thick dashed red line» in English. **It
# found almost nothing.** Nauruan has no digitised dictionary: Kayser's 1936
# grammar survives online only as a three-page orthography note, and
# Delaporte's 1907 Nauruan–German dictionary is not available as text at all.
# What could be established:
#
#   «etangang»    black. English Wiktionary carries it as a Nauruan adjective,
#                 and the Austronesian Basic Vocabulary Database's Nauru list
#                 (compiled from Kayser) has the same word for *black*.
#   «ebabobo»     yellow. Wiktionary again, corroborated by the same ABVD list;
#                 «bababo» is an attested variant.
#
# The `e-` on both is very likely the stative prefix, which is a pattern and
# not an attestation — a reviewer should confirm the bare stems.
#
# **Everything else in the style tables is still the English loan**, and the
# reasons are worth recording so the search is not repeated. *White* and *red*
# are attested in ABVD as «bərəbər» and «ȯmwirara», but in a transcription
# using a schwa and a dotted `o` that **are not letters of either Nauruan
# spelling system**; converting them is a guess about which reformed vowel is
# meant, so they were left alone. *Grey*, *blue*, *green*, *orange*, *purple*
# and *pink* appear only in a user-edited travel phrasebook with no citation,
# which is not a source this batch will spell a word from. *Brown* and *cyan*
# have no attestation anywhere. **Every geometry noun, every line and fill
# style, and both width words are unattested** in anything this seed could
# reach — so `line`, `point`, `circle`, `square`, `triangle`, `thick`, `thin`
# and the rest stand in English exactly as before.
#
# **This means no Nauruan colour-system mismatch is recorded** — not because
# Nauruan's colour system matches English's, which nothing here shows, but
# because two words are too few to see the shape of a system at all. A reviewer
# who knows the language should expect to find one.
#
# **A question about this file's declared orthography, raised here because the
# two new words bear on it.** The note above calls the tilde vowels and «ñ» the
# 1938 reform. Descriptions of that reform say the reverse — that the 1938
# committee *replaced* «ñ» with «ng» and «ã» with «e» — which would make the
# tilde set the older Delaporte/Kayser convention that modern printed Nauruan
# has largely gone back to. Both words added above are spelled with «ng»,
# following their sources. If the header's account is the right one they should
# be «etañañ» and unchanged respectively. This seed could not settle which
# system the file means to be in, and a reviewer should settle it before
# converting anything, because it decides the spelling of every «ng» here.
#
# Everything else below is a loan.
#
# **No grammatical gender**, so `noun-gender` answers one token and no
# adjective in these files forks on `$gender`. **No `$role` fork** either:
# nothing here changes shape between a standalone position and a clause.
#
# **Number.** A Nauruan noun is not marked for number by a numeral in front of
# it, so a count changes nothing about the word beside it. `Intl.PluralRules`
# has no CLDR data for `na` and resolves against the runtime's default locale,
# so a `[two]`, `[few]` or `[many]` branch here would be text nothing could
# select. Where a message merely prints a count this file writes **one
# unselected form**, as `locales/sm` does; where English's two branches differ
# in something other than the noun's number, `one` and `*[other]` are kept so
# that no branch goes missing.
#
# **Word order: the describing word follows the noun** — «Nauru Bwiema» is the
# shape — and all five of the batch's other Micronesian catalogs put it there
# too: `mh`, `chk`, `pon`, `kos` and `gil` all write `{ $noun }` ahead of
# `{ $description }`, as `ch`, `sm` and `to` already did. That is the batch
# agreement this catalog joins, and it is the one thing here that was checked
# against the siblings rather than inferred. Gilbertese writes a linker «ae»
# between the two; this file writes none, because nothing establishes that
# Nauruan wants one — a reviewer who knows otherwise should add it in
# `style-with-noun`, `style-filled-with-noun` and `style-fill` together.
#
# **Where this catalog deliberately parts company with its five siblings.**
# Those five write their own lexicons — «Ejim̧we», «Pwaye», «Te kairua» — and
# this one does not, and the difference is evidence rather than effort.
# Marshallese, Chuukese, Pohnpeian, Kosraean and Gilbertese each have a
# published dictionary this seed could lean on; Nauruan's are a 1907
# Nauruan-German dictionary and a 1936 grammar, and what this seed could
# actually reach of them is a handful of words. A file that matched the
# siblings word for word would be matching their *appearance*. So the divide
# runs down the middle of this batch on purpose, and it is a divide about what
# was knowable.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are not written here. Chemistry in Nauru's schools is
# taught in English, and the periodic table is read in English there; a
# Nauruan column of element names would report a fact about a curriculum that
# does not exist rather than a fact about the language. Every other key in
# `locales/en/content.ftl` is covered, including the two new
# `math-embedded-input-blank` keys.
#
# **The composition messages at the foot of this file are where the frame
# shows.** English writes «thick red line»; this file writes the noun first
# and its describing words behind it, and `style-fill` puts the pattern ahead
# of its colour for the same reason. That reordering is the part of this
# catalog a speaker is most likely to keep.
#
# `noun-regular-polygon` folds the side count into the head and leaves
# `[tail]` empty. That is a guess about Nauruan and is worth a reviewer's
# attention: every catalog of the Austronesian batch reaches `[noun-tail]`
# instead, because a side count is a relative clause in those languages and a
# relative clause follows the whole phrase. If Nauruan counts the same way,
# the tail is where «5» belongs and this message is wrong as written.

## Style vocabulary

color =
    .black = etangang
    .white = white
    .gray = gray
    .red = red
    .orange = orange
    .yellow = ebabobo
    .green = green
    .cyan = cyan
    .blue = blue
    .purple = purple
    .pink = pink
    .brown = brown
line-width =
    .thick = thick
    .thin = thin
line-style =
    .dashed = dashed
    .dotted = dotted
fill-style =
    .horizontal = horizontal lines
    .vertical = vertical lines
    .diagonal = diagonal lines
    .backdiagonal = reverse diagonal lines
    .dots = dots
    .diamonds = diamonds
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
    .triangle = triangle
    .rectangle = rectangle
    .circle = circle
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
# English and is the shape «Nauru Bwiema» has.
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
# Nauruan has no indefinite article, so the two `-article` branches say what
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
piecewise-condition-if = if
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
