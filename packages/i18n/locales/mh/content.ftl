# Marshallese (Kajin M̧ajeļ) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in. Latin script, standard "new" orthography.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# ## Orthography
#
# The cedilla and macron letters — `ļ`, `m̧`, `ņ`, `n̄`, `o̧` — are part of
# the spelling, not accents that may be dropped. «waļo̧k» and «walok» are not
# two spellings of one word in this orthography; the second is simply
# missing two letters. `ļ` and `ņ` are the precomposed U+013C and U+0146;
# `m̧`, `o̧` and `n̄` are a base letter plus a combining cedilla (U+0327) or
# macron (U+0304), because Unicode has no precomposed form for them. Keep the
# decomposed spelling if this file is ever normalized.
#
# ## Gender, number and word order — the three decisions this file makes
#
# **No gender.** Marshallese has no grammatical gender, so `noun-gender`
# returns one token and not one adjective below forks on `$gender`. The
# argument is still answered, because a message that resolved to nothing
# would render `{noun-gender}`.
#
# **No number on the noun.** A Marshallese noun does not change after a
# numeral, and there is no obligatory plural: «juon laain» and «jilu laain»
# have the same noun in them. Where a plural determiner is wanted — the fill
# patterns, which are genuinely several things — it is written as a separate
# word «ko» after the noun. `Intl.PluralRules("mh")` has no CLDR data either
# way, so no message in these four files writes anything but `one`, `other`
# or a digit.
#
# **The describing word follows the noun.** This is the decision that shapes
# the whole foot of the file. Marshallese is postnominal: «laain m̧ijel
# būrōrō» is *thick red line*, in that order, and the English order is
# ungrammatical rather than merely foreign. So `style-with-noun` and
# `style-filled-with-noun` put `{ $noun }` **first** and the description after
# it. Within the description the English order of width, dash pattern and
# colour is kept, because Marshallese stacks its own modifiers in that order
# too. The four sibling Micronesian catalogs of this batch — `chk`, `pon`,
# `kos` and `gil` — are expected to be postnominal for the same reason, and a
# reviewer who finds one of them prenominal should treat that as the thing to
# explain.
#
# `$role` is not forked on. Marshallese does not inflect a noun or a
# describing word for case: a word standing alone as a state variable reports
# it and the same word inside a border clause are the same word, and four
# copies of one string would be four places to make a typo.
#
# ## What is coined, what is borrowed, and what is left in English
#
# Marshallese schooling above the elementary grades is largely in English,
# and mathematics is one of the subjects that is. So the noun table below is
# uneven on purpose, in three layers, and every layer is something a reviewer
# should feel free to overturn:
#
#   * **Attested Marshallese**, used wherever it exists: «doulul» (circle),
#     «kona» (corner), «tōrerein» (its edge — the word this file uses for a
#     border), «meļaaj» (an open field), «jitpeeļ» (lying crosswise, hence
#     the diagonal fills), «debwāāl» (cross), «m̧ijel» (thick), «aidik»
#     (thin), «obrak» (full, hence *filled*), «būrōrō», «maroro», «iaļo»,
#     «kilmeej», «mouj».
#   * **Coined by Marshallese means**, and the first things to check:
#     «m̧ōttan laain» for a line segment (a piece of a line), «laain jeor»
#     for a curve (a turning line), «laain elōn̄ m̧ōttan» for a polyline,
#     «jilu kona» / «emān kona» for triangle and rectangle, «emān kona jejjet»
#     for a square (the regular four-cornered one), «meļaaj in jillo̧k» and
#     «meļaaj in pektōr» for the two fields, «poin̄poin̄» for a dotted stroke
#     and «m̧ōttanm̧ōttan» for a dashed one — both by reduplication, which is
#     the ordinary Marshallese way to make a word mean *scattered through* or
#     *in pieces*.
#   * **Borrowed**, written in Marshallese spelling: «pektōr», «poin̄»,
#     «taim̧ōn», «pilōj», «reey», «parapola», «teebōļ», «peij», «kōlōm»,
#     «intervōl», and the six colour words Marshallese did not inherit —
#     «kūrey», «orenj», «jaian», «pōpōļ», «piin», «būraun». The colour table
#     is the clearest case of the unevenness: the six basic colours are
#     Marshallese words and the six others are English ones, which is a fact
#     about which colours the language named for itself.
#
# **«maroro» covers a range English splits.** The traditional word spans
# green and blue-green, and «būļu» is the borrowing that took over blue. This
# file gives `green` to «maroro» and `blue` to «būļu», which is what a
# schoolbook does, but a speaker describing a lagoon would not draw the line
# there. `cyan` is the weakest entry in the table for exactly this reason.
#
# **Three words are left in English, and each is a term of art rather than a
# gap**: `function`, `polygon` and `parabola` reach a Marshallese student in
# English in the mathematics class itself, and a coinage here would name the
# shape in a word the student would then have to un-learn. `parabola` is
# written in Marshallese spelling as «parapola»; the other two are left as
# they stand.
#
# **«meļeļe» is doing three jobs across these four files** — *information* in
# `chrome.ftl`, *meaning* in the `section-name` table's «Meļeļein Naan», and
# the root of «kōmeļeļe», the word `diagnostics.ftl` uses for a *short
# description*. A speaker may well want three words rather than one root, and
# fixing it means one pass across all four files rather than a change here.


## Style vocabulary

color =
    .black = kilmeej
    .white = mouj
    .gray = kūrey
    .red = būrōrō
    .orange = orenj
    .yellow = iaļo
    .green = maroro
    .cyan = jaian
    .blue = būļu
    .purple = pōpōļ
    .pink = piin
    .brown = būraun
line-width =
    .thick = m̧ijel
    .thin = aidik
# Both by reduplication: «m̧ōttanm̧ōttan» is *in pieces*, «poin̄poin̄» is
# *dotted all over*. Neither is in the dictionary; both are formed the way
# the language forms this meaning.
line-style =
    .dashed = m̧ōttanm̧ōttan
    .dotted = poin̄poin̄
# «ko» is the plural determiner and is written as its own word, since the
# noun itself does not change. `style-filled` and `style-fill` below place
# these after the colour, which is where a Marshallese describing phrase puts
# the thing the shape is filled *with*.
fill-style =
    .horizontal = laain babu ko
    .vertical = laain jutak ko
    .diagonal = laain jitpeeļ ko
    .backdiagonal = laain jitpeeļ oktak ko
    .dots = poin̄ ko
    .diamonds = taim̧ōn ko
noun =
    .line = laain
    .line-segment = m̧ōttan laain
    .ray = reey
    .vector = pektōr
    .curve = laain jeor
    .function = function
    .slope-field = meļaaj in jillo̧k
    .vector-field = meļaaj in pektōr
    .parabola = parapola
    .polyline = laain elōn̄ m̧ōttan
    .polygon = polygon
    .triangle = jilu kona
    .rectangle = emān kona
    .circle = doulul
    .region = jikin
    .point = poin̄
    .square = emān kona jejjet
    .diamond = taim̧ōn
    .cross = debwāāl
    .plus = pilōj
# The side count stays inside the head. Marshallese counts in front of the
# noun it counts — «{ $numSides } kona» — and the whole of that phrase is the
# noun the describing words then follow, so there is nothing for a tail to
# carry. The count is still formatted by the locale's own rules.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] polygon jejjet { $numSides } kona
    }
# Marshallese has no grammatical gender, so nothing above reads this and
# every noun answers alike.
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
# The noun comes first: Marshallese puts every describing word after the
# thing described, so this is a reordering of the English rather than a
# translation of it in place.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = obrak
# «kōn» is the ordinary preposition for *with, by means of*, and it is what
# introduces the pattern a shape is filled with.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } kōn { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } kōn { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } kōn { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «tōrerein» is the edge of a thing, and it is a noun, so the describing
# words follow it here too. Marshallese has an indefinite article, «juon», so
# the two `-article` branches are a real distinction rather than a repeat of
# the two without.
style-border-clause =
    { $parts ->
        [with-article] kōn juon tōrerein { $border }
        [and] im tōrerein { $border }
        [and-article] im juon tōrerein { $border }
       *[with] kōn tōrerein { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = jab obrak
# «ālikin» is *behind*, and the background is named as what stands behind the
# text. The colour word for the text comes first because it describes the
# text itself.
style-text =
    { $parts ->
        [background] { $color } ippān ālikin { $background }
       *[plain] { $color }
    }
style-background-none = ejjeļo̧k

## Boolean words

boolean-true = m̧ool
boolean-false = riab

## Answer buttons

answer-submit-label = Lale Jerbal
answer-submit-label-no-correctness = Jilkinļo̧k Uwaak

## Sectional blocks

section-name =
    .activity = Ekkatak
    .aside = Naan Ijello̧kin
    .cascade = Kaskeed
    .definition = Meļeļein Naan
    .example = Waanjon̄ak
    .exercise = Katak
    .exercises = Katak ko
    .given-answer = Uwaak
    .note = Kakōļļe
    .objectives = Mejānkajjik ko
    .paragraphs = Pārakraap ko
    .part = M̧ōttan
    .problem = Poblōm
    .problems = Poblōm ko
    .proof = Kam̧ool
    .question = Kajjitōk
    .section = Jebta
    .solution = Wāween Uwaak
    .task = Jerbal
    .theorem = Teorem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Naan in Jipan̄

## Tables and figures

table-name =
    { $parts ->
        [numbered] Teebōļ { $enumeration }
        [numbered-title] Teebōļ { $enumeration }{ ": " }
        [unnumbered-title] Teebōļ{ ": " }
       *[unnumbered] Teebōļ
    }
figure-name =
    { $parts ->
        [numbered] Annan̄ { $enumeration }
        [numbered-caption] Annan̄ { $enumeration }{ ": " }
        [unnumbered-caption] Annan̄{ ": " }
       *[unnumbered] Annan̄
    }

## Paginator controls

paginator-previous = M̧okta
paginator-next = Ālik
paginator-page = Peij
paginator-page-status = { $pageLabel } { $currentPage } iaan { $numPages }

## Piecewise functions

piecewise-condition-or = ak
# «eļan̄n̄e» opens its clause, as English *if* does, so the renderer's placing
# of this word in front of the mathematics is right for Marshallese. That is
# not true of every catalog in the roster — the Permic and Ob-Ugric ones
# record the opposite — and it is worth saying which side this one is on.
piecewise-condition-if = eļan̄n̄e
piecewise-condition-otherwise = n̄e jab

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Secondary chemistry in the Marshall Islands is taught in English:
## the element names a Marshallese student meets in a laboratory, on a
## periodic table on the classroom wall, and in the examination they sit are
## the English ones. A table of 118 coinages here would report a fact about
## this seed rather than about the language, and would be further from the
## student's own textbook than the English fallback is. The same choice is
## expected in the four sibling Micronesian catalogs of this batch.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Kakōļļe in kemikōl ejjab jim̧we
chemistry-invalid-ionic-compound = Koba in ion ejjab jim̧we

## Inputs embedded in math

# Read aloud inside the mathematics, never seen: «jikin ejjeļo̧k» is *the
# empty place*, which is what a gap in an expression is. Kept to two words
# because a screen reader says it in the middle of an equation.
math-embedded-input-blank = jikin ejjeļo̧k
math-embedded-input-blank-ordinal = jikin ejjeļo̧k { $ordinal } iaan { $total }
