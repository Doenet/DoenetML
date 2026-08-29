# Yapese (thin nu Waqab) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# **The two chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are not written here, so their 130 keys fall back to
# English and `lint:i18n` reports the gap. Chemistry in Yap State's schools is
# taught in English out of English textbooks, so the fallback *is* the
# curriculum; seeding a Yapese periodic table would report a fact about a
# course of study rather than about the language, and would report it wrongly.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This file writes the **standard Yapese orthography** — the
# one settled in Jensen's grammar and Yapese–English dictionary (1977) and used
# by the Yap State Department of Education since. Two of its conventions are
# spelling and not decoration:
#
#   * the **glottal stop is the letter «q»**, which is why the island and the
#     people are «Waqab» and not «Wa'ab». It is a consonant of the language and
#     is written everywhere it is heard, including word-initially.
#   * the **underlined series «ḏ», «ḻ», «ṉ», «ṟ»** (Jensen prints a bar under
#     the letter) are letters of their own, distinct from plain «d», «l», «n»,
#     «r», and «th» and «ch» are single letters too.
#
# Printed Yapese today is inconsistent about both: much of it substitutes an
# apostrophe for «q» and drops the underlines altogether. A reviewer who
# prefers that spelling should convert the whole file rather than mix the two
# systems. Few of the words this seed commits to happen to contain an
# underlined letter — that is a fact about how little vocabulary is here, not a
# claim that the series is rare, and a reviewer replacing the loans below will
# need all four.
#
# **Yapese is Oceanic but it is not Micronesian in the narrow sense.** Yap is a
# state of the Federated States of Micronesia, and this batch seeds catalogs
# for its neighbours — `mh`, `chk`, `pon`, `kos`, `gil` — but Yapese is not a
# Nuclear Micronesian language: its position inside Oceanic is disputed and it
# is best treated as an isolate branch, and its lexicon is unlike its
# neighbours' word for word. **So no form here was borrowed from those
# catalogs**, and none should be. Sharing a flag is not a sound correspondence.
# That is the method `locales/sms` used from Northern Sami running the other
# way, and it is the same refusal `locales/na` makes for Nauruan — this file
# agrees with `locales/na` about method and shares none of its vocabulary.
#
# **What this seed could not establish, said plainly once.** Published Yapese
# lexical material is thin and hard to reach, and this seed could not find
# Yapese words for the technical vocabulary these catalogs are made of. So
# **every technical term below is kept as the English word, in English
# spelling, and is a loan rather than a translation** — with the style tables
# excepted, which are basic vocabulary rather than technical and which a later
# pass did establish; see the list further down. That is a real fact
# about Yap — schooling, and mathematics teaching in particular, are in
# English — but it is also a confession, and respelling English by an invented
# loan phonology would have presented a guess as a fact. The **frame** is this
# file's contribution — word order, the linker, the absence of gender and of
# number agreement, the variant keys — and the **lexicon** is the debt. A
# speaker replacing the nouns and verbs below is doing the work this file was
# written to make easy, and needs no permission for any of it.
#
# The only Yapese words this seed commits to are:
#   «Waqab»    Yap, the island group and the language's home
#   «thin»     word, speech, language — «thin nu Waqab», the Yapese language
#   «nu»       of, from (as in «thin nu Waqab»)
#   «e»        the common-noun determiner, the commonest word in Yapese text
#   «ni»       the linker that joins a head noun to the modifier or relative
#              clause following it. This is the one productive rule the seed
#              applies, and it applies it only where a modifier plainly
#              follows a noun.
#   «nge»      and, with — joining nouns and joining a phrase to what
#              accompanies it.
# Check «e» and «nge» first: both are frequent enough that a wrong choice is
# wrong in many places at once.
#
# **The style tables are the exception, and they are no longer a loan.** The
# colour words and the two width words are basic vocabulary rather than
# technical jargon, they are well attested, and they are the most audible
# strings in the package — they compose into the shape descriptions a
# screen-reader speaks. Rendering «thick dashed red line» wholly in English for
# a Yapese reader was a worse outcome than the loan convention intends, so this
# seed looked them up and committed to them. **Source for every one of them:**
# John T. Jensen's *Yapese–English Dictionary* (PALI, 1977), in the author's own
# web edition at `trussel2.com/YAP/`, with Jensen's *Yapese Reference Grammar*
# (1977) as a cross-check. Each word below is quoted from a dictionary entry:
#
#   colour   «rungduq» black · «weachweach» white · «qawatwaat» grey ·
#            «roowroow» red · «rangreang» orange · «maaguchoel» yellow ·
#            «warraq» green · «yarraq» blue · «but'buut'» brown
#   width    «dibqag» thick (variant «dubqag») · «gilgith» thin, glossed
#            "thin in thickness, not width", which is a stroke exactly
#   nouns    «luulubuuy» round, circular, for `circle` · «tam'ing» corner,
#            joint, curve, for `curve`
#
# **A warning about the underlined series, and it is the serious one.** The
# orthography note above says «ḏ», «ḻ», «ṉ» and «ṟ» are letters of their own.
# **The web edition of Jensen prints none of them** — its headwords carry plain
# `d`, `l`, `n`, `r` throughout, with no underline anywhere in the source. So
# for every word here containing one of those four letters — «rungduq»,
# «roowroow», «rangreang», «maaguchoel», «warraq», «yarraq», «dibqag»,
# «gilgith», «luulubuuy» — **this file cannot say whether the letter is the
# plain one or the underlined one**, and has written the plain one by default.
# That is a known, systematic and findable error rather than a claim, and it is
# the first thing a reviewer with the printed dictionary should fix. Note also
# that the apostrophe in «but'buut'» and «tam'ing» is Jensen's glottalized
# consonant, a different thing from «q» — both occur in the same edition and
# neither may be substituted for the other.
#
# **Where the Yapese colour system does not match English's, recorded rather
# than split silently**, on the model `locales/gil` sets for «mawaawa»:
# **«yarraq» is blue, cyan, purple and violet in one word** — Jensen glosses it
# "The color blue, blue-green, purple, violet." Yapese does not supply the
# three-way distinction English asks for here. This file assigns it to *blue*
# and **leaves `cyan` and `purple` as English loans** so the keys do not
# collapse onto one word. A second overlap: **«rangreang» is orange and
# reddish-brown both** ("orange, deep orange, orange brown, reddish brown"), so
# it and «but'buut'» share a boundary English draws elsewhere. And «warraq»
# green sits beside the transparent loan «giriin», which is itself evidence
# that the native term's boundary is not the English one.
#
# **What stayed English in the style tables, and why.** `pink` — no entry.
# `line` — Jensen's «fach»/«fachfach» is a *line or row of people or things*,
# not a drawn mark, so `line` and the whole `fill-style` table stay English;
# this is the biggest single gap left here. `point` — «m'uuth» is a physical
# sharp tip and «boon» a navigational marker; neither is a geometric point.
# `square` — «malaal» is a village square, a place. `cross` — «kuruuth» is a
# crucifix. `diamond` — «bireel» is the card suit, a candidate a reviewer might
# well take but not the same claim as the shape. `triangle`, `rectangle`,
# `ray`, `vector`, `polygon`, `parabola`, `angle`, `plus`, `dashed`, `dotted`,
# `diagonal` and the orientation words — no entry; Jensen 1977 is an everyday
# and ethnographic vocabulary with no mathematical register, and the modern
# school wordlist that would have them is not published anywhere this seed
# could reach. Each is a near miss recorded so the search is not repeated.
#
# Everything else below is still a loan, and the lexicon is still the debt.
#
# **Word order: the modifier follows the noun**, linked by «ni». So a style
# description is built as noun + «ni» + description — the opposite of English's
# order, and the opposite of every catalog in the Uralic batch. The `content`
# file is where that shows.
#
# **No grammatical gender.** Yapese has none, so `noun-gender` answers one
# token, and no adjective in these files forks on `$gender`. **No `$role` fork**
# either: nothing here changes shape between a standalone position and a
# clause.
#
# **Counting, and how this seed avoided it.** Yapese counts with an obligatory
# **numeral-classifier** system: a numeral is compounded with a classifier
# chosen by what is being counted (humans, long things, flat things, general
# things), and possession is marked by a second, separate set of **possessive
# classifiers**. A spelled-out Yapese numeral therefore cannot be written
# without deciding what kind of thing follows it. This seed never spells a
# numeral: every count reaches the reader as the `{ $count }` placeable, which
# Fluent renders in digits, so no classifier is ever forced and none is
# invented. A reviewer who wants spelled numerals has to supply the classifier
# with them — and cannot do it inside a placeable, which is the affix rule in
# the README.
#
# **Number.** A Yapese noun is not marked for number by a numeral in front of
# it, so a count changes nothing about the word beside it, and a single
# unselected form is right wherever English forks. `Intl.PluralRules` has no
# CLDR data for `yap` and resolves against the runtime's default locale, so a
# `[two]`, `[few]` or `[many]` branch here would be text nothing could select.
# Only `one`, `other` and explicit digit literals appear, and where English
# forks on number for grammar this file keeps the fork only because the
# English words in the branches differ.
#
# **A named debt.** The piecewise connectives — `piecewise-condition-if`,
# `-or`, `-otherwise` — are basic grammar rather than technical vocabulary, and
# are exactly where a frame contribution belongs; this seed still left them in
# English because it could not establish the Yapese conditional and
# disjunctive particles with any confidence. They are the first three lines a
# speaker should fix, and fixing them costs three lines.


color =
    .black = rungduq
    .white = weachweach
    .gray = qawatwaat
    .red = roowroow
    .orange = rangreang
    .yellow = maaguchoel
    .green = warraq
    .cyan = cyan
    .blue = yarraq
    .purple = purple
    .pink = pink
    .brown = but'buut'

line-width =
    .thick = dibqag
    .thin = gilgith

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
    .curve = tam'ing
    .function = function
    .slope-field = slope field
    .vector-field = vector field
    .parabola = parabola
    .polyline = polyline
    .polygon = polygon
    .triangle = triangle
    .rectangle = rectangle
    .circle = luulubuuy
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
        [noun-tail] { $noun } { $nounTail } ni { $description }
       *[noun] { $noun } ni { $description }
    }

style-filled-word = filled

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } nge { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } ni { $filled } { $color } nge { $pattern }
        [plain-tail] { $noun } { $nounTail } ni { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } ni { $filled } { $color } nge { $pattern }
       *[plain] { $noun } ni { $filled } { $color }
    }

style-border-clause =
    { $parts ->
        [with-article] nge border ni { $border }
        [and] nge border ni { $border }
        [and-article] nge border ni { $border }
       *[with] nge border ni { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = unfilled

style-text =
    { $parts ->
        [background] { $color } nge background ni { $background }
       *[plain] { $color }
    }

style-background-none = none


boolean-true = true
boolean-false = false


answer-submit-label = Check Work

answer-submit-label-no-correctness = Submit Response


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


paginator-previous = Previous
paginator-next = Next
paginator-page = Page

paginator-page-status = { $pageLabel } { $currentPage } of { $numPages }


piecewise-condition-or = or

piecewise-condition-if = if

piecewise-condition-otherwise = otherwise




ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Invalid Chemical Symbol
chemistry-invalid-ionic-compound = Invalid Ionic Compound


math-embedded-input-blank = blank

math-embedded-input-blank-ordinal = blank { $ordinal } of { $total }
