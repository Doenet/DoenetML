# Pohnpeian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
# Latin script, standard Pohnpeian orthography.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# ORTHOGRAPHY. Standard Pohnpeian spelling throughout, digraphs included:
# `ng`, `oa`, `mw` and `pw` are single letters and must not be broken up, and a
# following `h` marks a long vowel («mehlel», «pwuhk», «kohdi») rather than
# being a consonant of its own. `b`, `c`, `f`, `g`, `j`, `q`, `v`, `x` and `z`
# do not occur in Pohnpeian, so every loan below is respelled into the
# alphabet the language has.
#
# REGISTER. Common, non-honorific speech everywhere. Pohnpeian's *meing*
# vocabulary belongs to address between a speaker and a title-holder; a
# document addressing a student uses the ordinary words, and this file does.
#
# NO GENDER. Pohnpeian has no grammatical gender. `noun-gender` therefore
# answers one token for every noun, no adjective in this file forks on
# `$gender`, and none forks on `$role` either: a Pohnpeian describing word does
# not change shape between standing on its own and standing inside a clause, so
# the four positions would render four copies of one string. This is
# `locales/sm`'s and `locales/tpi`'s answer, and it is expected to be the
# answer in the sibling Micronesian catalogs of this batch — `mh`, `chk`, `kos`
# and `gil`.
#
# WORD ORDER, AND WHERE IT DIFFERS FROM ENGLISH. Pohnpeian is head-initial: the
# describing word **follows** the noun — «lain weitahta» (a red line), «kapil
# audaud pluh» (a filled blue circle). So the composition messages at the foot
# of this file put the noun first and keep the English order among the
# describing words themselves, exactly as `locales/sm` does.
#
# THE SIDE COUNT IS A TAIL. `noun-regular-polygon` splits: the head is
# «poliken pahrek» and the count is a relative clause, «me pali { $numSides }»,
# which has to follow the whole phrase rather than sit inside it. That is the
# `[noun-tail]` shape the Austronesian batch established, and it is why
# `style-with-noun` and `style-filled-with-noun` place the tail last.
#
# THE CLASSIFIER THAT CANNOT BE WRITTEN. Pohnpeian counts with numeral
# classifiers fused into the numeral itself — «ehu», «riau», «siluh» general;
# «apali», «riapali» for sides; «apwoat» for long things. `{ $numSides }` is a
# placeable, so there is no numeral for a classifier to fuse with and none can
# be written. «me pali { $numSides }» leaves the count bare, which is what
# Pohnpeian writing does with digits. Recorded here rather than hidden: it is
# the "affix cannot be welded to a placeable" rule reached through a
# classifier.
#
# COLOURS. Only «toantoal» (black), «pwetepwet» (white), «weitahta» (red) and
# «oangoahng» (yellow, the colour of turmeric) are native Pohnpeian words this
# seed is reasonably sure of. The other eight are **English loans respelled**
# — «kire», «orens», «kirihn», «saian», «pluh», «perpel», «pihngk», «praun» —
# because this seed could not establish native terms for them and would rather
# be visibly borrowing than quietly inventing. Pohnpeian does borrow colour
# words in ordinary speech, so these are not absurd; they are simply
# unverified. A speaker should start here.
#
# COINAGES AND LOANS IN THE MATHEMATICAL VOCABULARY, all of which need
# confirming. School mathematics on Pohnpei is taught largely in English, so
# there is no settled Pohnpeian list to copy. Built from Pohnpeian roots:
# «lepin lain» (line segment, from «lep», a piece); «silikeimw» (triangle) and
# «pahkeimw» (quadrilateral), from «keimw», a corner, with «pahkeimw pahrek»
# for a square and «pahkeimw reirei» for a rectangle; «kapil» (circle, from
# «kapil», to encircle); «wasa» (region, an ordinary word for an area);
# «mwoat» (a garden plot) for a mathematical *field*, which is the same move
# `locales/sma` makes with its word for a meadow; «kamwotomwot» (summary, from
# «mwotomwot», short); «kapwung» (solution, from «kapwungala», to put right);
# «audaud» (filled) and «sohte audaud» (unfilled). Respelled loans: «rei»
# (ray), «pekter» (vector), «kurp» (curve), «pwuhnksin» (function), «parapola»,
# «polilain», «poliken» (polygon), «taimen» (diamond), «pluhs», «sloap»
# (slope), «interwal», «teorem», «parakrap», «tehpel» (table), «statistik»,
# «mahd» (mathematics), «koordineit». «lohpwu» (cross) is a real Pohnpeian word
# and is used here for the marker shape.
#
# THE TWO DIAGONALS ARE LOANS ON PURPOSE. «lain taiakonal» and «lain taiakonal
# sapahl» keep an English word where a coinage would have been a guess; the
# other four fill patterns are ordinary Pohnpeian — «lain pahrek» (level
# lines), «lain uhda» (standing lines), «kisin poahn» (little points) and
# «taimen».
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

color =
    .black = toantoal
    .white = pwetepwet
    .gray = kire
    .red = weitahta
    .orange = orens
    .yellow = oangoahng
    .green = kirihn
    .cyan = saian
    .blue = pluh
    .purple = perpel
    .pink = pihngk
    .brown = praun
line-width =
    .thick = mosul
    .thin = menipinip
line-style =
    .dashed = lepilep
    .dotted = kisin poahn
# Noun phrases: they follow «iangahki» and modify nothing.
fill-style =
    .horizontal = lain pahrek
    .vertical = lain uhda
    .diagonal = lain taiakonal
    .backdiagonal = lain taiakonal sapahl
    .dots = kisin poahn
    .diamonds = taimen
noun =
    .line = lain
    .line-segment = lepin lain
    .ray = rei
    .vector = pekter
    .curve = kurp
    .function = pwuhnksin
    .slope-field = mwoat en sloap
    .vector-field = mwoat en pekter
    .parabola = parapola
    .polyline = polilain
    .polygon = poliken
    .triangle = silikeimw
    .rectangle = pahkeimw reirei
    .circle = kapil
    .region = wasa
    .point = poahn
    .square = pahkeimw pahrek
    .diamond = taimen
    .cross = lohpwu
    .plus = pluhs
# The side count is a relative clause and has to follow the whole phrase, so
# it goes in the tail rather than folding into the head. The numeral stands
# bare: a Pohnpeian classifier fuses with the numeral, and this one is a
# placeable.
noun-regular-polygon =
    { $part ->
        [tail] me pali { $numSides }
       *[head] poliken pahrek
    }
# Pohnpeian has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English.
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
# The noun leads and its describing words follow: «lain mosul lepilep
# weitahta». The tail closes the phrase.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = audaud
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } iangahki { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } iangahki { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } iangahki { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Pohnpeian has no article, so the two `-article` branches read like the ones
# without them; «oh» is the conjunction and «iangahki» the accompaniment word.
style-border-clause =
    { $parts ->
        [with-article] iangahki keil { $border }
        [and] oh keil { $border }
        [and-article] oh keil { $border }
       *[with] iangahki keil { $border }
    }
# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = sohte audaud
style-text =
    { $parts ->
        [background] { $color } iangahki wasa mwuri { $background }
       *[plain] { $color }
    }
style-background-none = sohte

## Boolean words

boolean-true = mehlel
boolean-false = likamw

## Answer buttons

answer-submit-label = Kasawih doadoahk
answer-submit-label-no-correctness = Kadarala sapeng

## Sectional blocks

section-name =
    .activity = Wiewia
    .aside = Kisin koasoi
    .cascade = Pwilipwil
    .definition = Kawehwe
    .example = Karasaras
    .exercise = Kaiahn
    .exercises = Kaiahn
    .given-answer = Pasapeng
    .note = Kataman
    .objectives = Akadei
    .paragraphs = Parakrap
    .part = Kis
    .problem = Kahpwal
    .problems = Kahpwal
    .proof = Kadehde
    .question = Peidek
    .section = Pwihn
    .solution = Kapwung
    .task = Pwukoa
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
hint-title = Kisin kaweid

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tehpel { $enumeration }
        [numbered-title] Tehpel { $enumeration }{ ": " }
        [unnumbered-title] Tehpel{ ": " }
       *[unnumbered] Tehpel
    }
figure-name =
    { $parts ->
        [numbered] Kilel { $enumeration }
        [numbered-caption] Kilel { $enumeration }{ ": " }
        [unnumbered-caption] Kilel{ ": " }
       *[unnumbered] Kilel
    }

## Paginator controls

paginator-previous = Mwohn
paginator-next = Mwuri
paginator-page = Pali
paginator-page-status = { $pageLabel } { $currentPage } sang { $numPages }

## Piecewise functions
##
## «ma» and «ma soh» open their clauses, so the renderer's placement — the word
## first and the mathematics after it — lands correctly in Pohnpeian. This is
## not the `locales/dv` limit that the clause-final catalogs of the Uralic
## batch had to record.

piecewise-condition-or = de
piecewise-condition-if = ma
piecewise-condition-otherwise = ma soh

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## There is no settled Pohnpeian list of the 118 element names to seed from —
## secondary science on Pohnpei is taught in English — so naming them here
## would report a fact about a curriculum rather than about the language, and
## the fallback gives a student the vocabulary they actually meet in class.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Kilel en kemikol sapwung
chemistry-invalid-ionic-compound = Kapatapat aionik sapwung

## Inputs embedded in math

# «wasa mwahl» is an empty place. Kept to two words, since it is read aloud
# inside an expression.
math-embedded-input-blank = wasa mwahl
math-embedded-input-blank-ordinal = wasa mwahl { $ordinal } sang { $total }
