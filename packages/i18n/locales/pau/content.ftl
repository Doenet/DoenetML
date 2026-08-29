# Palauan (a tekoi er a Belau) content catalog: the prose the core computes
# into the document. Selected by `documentLocale` — the language the activity
# was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Palauan is Austronesian but it is not Oceanic.** Every other catalog of
# this batch — `sm`, `to`, `fj`, `ch`, `mh`, `chk`, `pon`, `kos`, `gil`, `na`,
# `tpi` and the rest — sits inside the Oceanic subgroup or creolizes from it.
# Palauan does not: it hangs off a different primary branch of Malayo-Polynesian
# (Western Malayo-Polynesian in the older arrangement; a first-order branch of
# its own in the newer ones), and Palau is the batch's westernmost member. So
# **nothing here was inferred from the Micronesian catalogs.** A word that looks
# like Marshallese or Chuukese or Gilbertese would be a coincidence or a shared
# loan, not a cognate, and this seed refused to reason from one to the other.
# What Palauan shares with those files is the DoenetML frame, and nothing else.
#
# **Orthography.** This file writes the **modern standard Palauan
# orthography** — the spelling settled by the Palau Orthography Committee and
# used in Josephs's *Palauan–English Dictionary* and *New Palauan–English
# Dictionary*, in the Palauan Bible revisions and in official Palauan print.
# Its conventions that matter for reading this file:
#   «ch»   the glottal stop, not an affricate and not [tʃ] — «chad» is
#          [ʔað], "person"
#   «ng»   the velar nasal, one letter, and it occurs word-initially
#          («ngar», «ng») as freely as it does medially
#   «e»    both the full mid vowel and the reduced vowel [ə]; the spelling
#          does not distinguish them, and this file does not try to
#   «ei»    the long/diphthongal vowel, written as the digraph, never «ē»
# There are **no diacritics**: nothing in Palauan spelling is decoration that
# may be dropped, because there is nothing to drop. A reviewer who prefers the
# older missionary or Japanese-era spellings — which wrote the glottal stop
# with an apostrophe or left it out entirely — should convert a whole file
# rather than mix the two systems.
#
# **Word order, and the one place this catalog disagrees with the batch.**
# A Palauan modifier **precedes** the noun and is joined to it by the linker
# **«el»**: «a beches el mlai», a new car; «a klou el blai», a big house. Every
# Oceanic catalog of this batch puts the describing word *after* the noun and
# `sm`, `to`, `ch`, `mh`, `chk`, `pon`, `kos`, `gil` and `na` all write
# `{ $noun }` ahead of `{ $description }` on that ground. **This file writes
# the description first and links it with «el»**, and the disagreement is the
# point: it is the visible consequence of Palauan not being Oceanic. It is also
# the single change a reviewer is most likely to keep.
#
# **The noun marker «a» is deliberately absent, and that is a recorded gap.**
# Nearly every Palauan noun phrase in a running sentence is introduced by «a».
# The style pipeline does not hand this catalog whole sentences — it hands it
# fragments that the code composes, and a message here cannot see whether its
# fragment is about to land after another «a» or at the head of a clause. So
# no message below prefixes «a», and every noun in the `noun` table stands
# bare. A reviewer who decides the article belongs should add it in one place
# and in all of them together — `noun`, `style-with-noun`,
# `style-filled-with-noun`, `style-fill`, `style-border-clause` — rather than
# one message at a time.
#
# **Human versus non-human agreement, checked and found not to apply.**
# Palauan really does mark a human/non-human distinction: the plural prefix
# «re-» is for humans («rechad», people), the numeral series and the
# classifiers fork on it, and existential and possessive constructions choose
# «tir» over «ngii» for human referents. That is the nearest thing in this
# batch to a `$gender` agreement, so it was checked message by message rather
# than waved away. **No style adjective in `content.ftl` varies.** The things
# these adjectives describe are lines, rays, curves, polygons, points, markers,
# borders, fills, text and backgrounds; not one of them is ever a person, so
# the human branch of the distinction is unreachable from this catalog and a
# `$gender` select here would be a fork nothing could ever take. `noun-gender`
# therefore answers **one token, `non-human`** — informative rather than
# `neuter`, and safe because no select in these files matches on it. A reviewer
# who finds a message this seed misjudged should add the `human` token and the
# select together; adding either alone does nothing.
#
# **Numerals: two series and classifiers, and this catalog can use neither.**
# Palauan counts with two numeral series — a general one («tang, erung, edei,
# euang, eim, elolem, euid, eai, etiu, truich», as far as this seed can attest,
# which a reviewer should check spelling by spelling) and a human one built on
# «ta'r chad» — and chooses a classifier by the kind of thing being counted.
# A count reaches this catalog as `{ $count }`, already formatted by
# `Intl.NumberFormat` into digits, with nothing that says what is being counted
# and no way to select a series. So **every count below is left as a bare
# numeral with no counting word attached.** That is a gap this file is
# recording, not a claim about how Palauan counts; a reviewer restoring the
# counting words will have to do it per message, because only the message knows
# what its noun is.
#
# **Number.** A Palauan noun is not marked for number by a numeral in front of
# it, and «re-» marks human plurals only — none of which occur here. So a count
# changes nothing about the word beside it. `Intl.PluralRules` has no CLDR data
# for `pau` and resolves against the runtime's default locale, so a `[two]`,
# `[few]` or `[many]` branch would be text nothing could select; none is
# written. Where English's two branches differ only in the number of the noun,
# this file writes **one unselected form**, as `locales/sm` does. Where they
# differ in something else — a verb, a whole clause — `one` and `*[other]` are
# both kept so that no branch goes missing.
#
# **No `$role` fork.** Palauan does not inflect a word for case, and nothing
# here changes shape between a standalone position and a clause, so every
# `$role` value is answered by the same text.
#
# **The Palauan words this seed commits to.** Everything else below is an
# English loan, kept in English spelling and marked as a loan rather than
# dressed up as Palauan:
#   «a»       the noun marker — described above, and deliberately not written
#   «el»      the linker joining a modifier to the noun it describes, and the
#             backbone of this catalog's word order
#   «er»      the general oblique preposition: in, at, on, of, from
#   «me»      and; «me a» before a noun phrase, which is what the "with"
#             clauses below open with
#   «diak»    not, there is none — the negator, and the honest word for a
#             quantity that is absent
#   «tekoi»   word, speech, language («a tekoi er a Belau», the Palauan
#             language)
#   «Belau»   Palau
#   «chad», «rechad»   person, people — cited here for the «re-» prefix, not
#             used in any message
#   «klou»    big;  «kekere»  small
#   «beches»  new;  «ungil»  good;  «mekngit»  bad
# These are common, well attested words and the seed is confident of them.
#
# **The style tables are the exception, and they are no longer a loan.** The
# colour words, the two width words and several of the shape nouns are basic
# vocabulary rather than technical jargon, they are well attested, and they are
# the most audible strings in the package — they compose into the shape
# descriptions a screen-reader speaks. Rendering «thick dashed red line» wholly
# in English for a Palauan reader was a worse outcome than the loan convention
# intends, so this seed looked them up and committed to them. **Source for
# every one of them:** `tekinged.com`, the online Palauan–English dictionary
# built on Josephs's *New Palauan–English Dictionary* and McManus, and in
# particular its curated `color` and `shapes` word groups
# (`tekinged.com/show_words.php?lookup=color`, `…?lookup=shapes`). The colour
# and width words are **stative verbs** there — «bekerkard» is *be red*, not
# *redness* — which is exactly what a Palauan modifier is, so they sit in the
# «el» frame without change. Josephs's book was not consulted directly, so each
# word is at one remove from the dictionary; a reviewer with it should check.
#
#   colour   «chedelekelek» black · «becheleleu» white · «bekerkard» red ·
#            «bibrurek» yellow · «mellemau» green · «bengt» purple ·
#            «mengeriich» brown
#   width    «okrokr» thick (glossed *thick and flat*, which is what a stroke
#            on a page is) · «meliliut» thin (*thin and flat; slender*)
#   nouns    «lluches» line · «mengall» curve · «bouchelild» triangle ·
#            «kliuar» rectangle · «kiuar» square · «chaibibeob» circle ·
#            «delsemiich» diamond · «kerus» cross · «dimech» dot, for the
#            dotted fill
#
# **«mengeriich» is the weakest of these** — the dictionary hedges it, "sort of
# brown in color" — and it is the first word here a reviewer should overturn.
# The exact phrase for brown is «bedengel a chutem», *the colour of earth*, but
# it is an `expr.` built round the noun marker «a» and will not go in a
# modifier slot this file has deliberately left bare; see the note above.
#
# **Several of these words have attested rivals**, kept out only because a
# table needs one form: «bechachas» and «ngeduch» also gloss *black*, «mellil»
# also *yellow*, «derbesekosek» and «kliars» also *triangle*, «derabahol» also
# *rectangle*, «chetngaid» is *thin* of a person or a long object where
# «meliliut» is *thin and flat*, and «kerebai» is another *line* — this file
# took «lluches», *written mark; sign; line*, because a graph's line is a drawn
# mark rather than a cord. None of those choices is more than a preference.
#
# **Where the Palauan colour system does not match English's, recorded rather
# than split silently**, on the model `locales/gil` sets for «mawaawa»:
# **«mellemau» is blue and green both** — the dictionary glosses it "blue;
# green; black and blue; bruised", and «oumellemau» "bluish; greenish". Palauan
# has no separate basic term for the two. This file assigns it to *green* and
# **leaves `blue` as the English loan**, so the two keys do not collapse onto
# one word. Where Palauan needs to be precise it reaches for a comparison
# instead — «bedengel a daob» *the colour of the sea*, «bedengel a eanged» *the
# colour of the sky*, «bedengel a chudel» *the colour of grass* — and a
# reviewer who wants those must first settle the «a» question above.
#
# **What stayed English in the style tables, and why.** `gray` — no stative
# verb exists, only the expressions «bedengel a beab» and «bedengel a chab»,
# *the colour of a rat*, *of ash*. `orange` — no colour term at all; every hit
# is the fruit, and «bibrurek» already covers *yellow-orange*. `pink` and
# `cyan` — no entry. `dashed`, `dotted`, `horizontal`, `vertical`, `diagonal` —
# no entry; the orientation words in the dictionary are names of house beams.
# `point` — «mad» is the general eye/face/edge word and «dimech» is *dot; spot;
# period*, so neither is a geometric point, and `dimech` is used for the dotted
# fill only. `ray` — only «diich», a ray of light. `plus` — no entry for the
# sign. Each is a near miss recorded so a reviewer need not re-do the search.
#
# The seed is still **not** confident of a Palauan technical vocabulary — the
# words for a graph or a matrix or a function, a vector, a parabola, a polygon
# — and did not invent one. Respelling English by a guessed loan phonology would have
# presented a guess as a fact, which is the one thing this batch forbids. The
# **frame** is this file's contribution — the word order, the linker, the
# absent article, the agreement that was checked and found not to fire, the
# variant keys — and the **lexicon** is the debt. English is official in Palau
# and schooling and mathematics teaching there are in English, so a loan is not
# an absurd thing to see on a Palauan screen; it is still a debt. A speaker
# replacing the nouns and verbs below is doing the work this file was written
# to make easy, and needs no permission for any of it.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are not written here. Chemistry in Palau's schools is
# taught in English, and the periodic table is read in English there; a Palauan
# column of element names would report a fact about a curriculum that does not
# exist rather than a fact about the language. Every other key in
# `locales/en/content.ftl` is covered, including the two new
# `math-embedded-input-blank` keys.
#
# **This is the file where the frame actually shows**, and it is worth reading
# the composition messages at the foot of it before anything else. English
# writes «thick red line»; this file writes the describing words first and
# joins them to the noun with **«el»** — the Palauan shape, and the opposite of
# what every Oceanic catalog in this batch does. `style-fill` puts the colour
# ahead of the pattern for the same reason, which is again the opposite of
# `na`'s choice. The four `style-border-clause` branches all open with **«me
# a»**: Palauan has no indefinite article, so the two `-article` branches say
# exactly what their siblings say, and «me» covers both English's "with" and
# its "and" here. `style-background-none` answers **«diak»**, "there is none",
# which is the one message in this file where a real Palauan word does the
# whole job.
#
# `noun-regular-polygon` folds the side count into `[head]` and leaves
# `[tail]` empty, and that is a considered choice rather than a copy of
# English: a Palauan modifier precedes its noun, so a count of sides belongs in
# front of the head with everything else that describes it, and there is
# nothing for a tail to carry. Several Austronesian catalogs of this batch
# reach `[noun-tail]` instead because a side count is a following relative
# clause in those languages. Palauan's «el» linker is not that clause, so this
# file does not follow them. A reviewer who finds the count reads better as a
# «el» relative behind the noun should move it and fill `[tail]`.

## Style vocabulary

color =
    .black = chedelekelek
    .white = becheleleu
    .gray = gray
    .red = bekerkard
    .orange = orange
    .yellow = bibrurek
    .green = mellemau
    .cyan = cyan
    .blue = blue
    .purple = bengt
    .pink = pink
    .brown = mengeriich
line-width =
    .thick = okrokr
    .thin = meliliut
line-style =
    .dashed = dashed
    .dotted = dotted
# The pattern word describes «lluches» and so precedes it through «el», which
# is this file's order everywhere. The three orientation words are loans: the
# header says why.
fill-style =
    .horizontal = horizontal el lluches
    .vertical = vertical el lluches
    .diagonal = diagonal el lluches
    .backdiagonal = reverse diagonal el lluches
    .dots = dimech
    .diamonds = delsemiich
noun =
    .line = lluches
    .line-segment = lluches segment
    .ray = ray
    .vector = vector
    .curve = mengall
    .function = function
    .slope-field = slope field
    .vector-field = vector field
    .parabola = parabola
    .polyline = polyline
    .polygon = polygon
    .triangle = bouchelild
    .rectangle = kliuar
    .circle = chaibibeob
    .region = region
    .point = point
    .square = kiuar
    .diamond = delsemiich
    .cross = kerus
    .plus = plus
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides }-sided regular polygon
    }
# One token, and no adjective in this file forks on it. The header says why:
# the human/non-human distinction is real in Palauan and unreachable from a
# catalog that only ever describes lines, points and fills.
noun-gender = non-human

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
# The describing words lead and «el» links them to the noun: «a beches el
# mlai». This is the batch's one word-order disagreement, and it is deliberate.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } el { $noun } { $nounTail }
       *[noun] { $description } el { $noun }
    }
style-filled-word = filled
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } me a { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } el { $noun } me a { $pattern }
        [plain-tail] { $filled } { $color } el { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } el { $noun } { $nounTail } me a { $pattern }
       *[plain] { $filled } { $color } el { $noun }
    }
# Palauan has no indefinite article, so the two `-article` branches say what
# their siblings say, and «me» serves for both English's "with" and its "and".
# The border word is the noun and the description precedes it through «el».
style-border-clause =
    { $parts ->
        [with-article] me a { $border } el border
        [and] me a { $border } el border
        [and-article] me a { $border } el border
       *[with] me a { $border } el border
    }
# The colour describes the pattern, so it leads and «el» links it — the
# opposite of the order `locales/na` chose, for the reason in the header.
style-fill =
    { $parts ->
        [pattern] { $color } el { $pattern }
       *[plain] { $color }
    }
style-unfilled = unfilled
style-text =
    { $parts ->
        [background] { $color } me a { $background } el background
       *[plain] { $color }
    }
# «diak»: there is none. A real Palauan word doing the whole job.
style-background-none = diak

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

# «or» stays English. Palauan has words for it — a «lechub»-based
# construction — but this seed could not establish which of them fits a bare
# disjunction between two mathematical conditions, and guessing at a
# conjunction is the kind of guess that reads as fluent and is wrong.
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
