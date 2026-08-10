# Manipuri (Meitei) content catalog: the prose the core computes into the
# document. Selected by `documentLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **This catalog is written in the Bengali script, and that is the decision in
# it most likely to be argued with.** The roster's rule is that a catalog is
# written in whatever CLDR fills a bare tag in as — the rule that makes `sr`
# Cyrillic, `az` Latin and `bs` Latin — and `mni` maximizes to `mni-Beng`.
# Meetei Mayek is Manipuri's own script, was readopted by the state in 2006 and
# is what Manipur's schools now teach; a reader arriving under `mni-Mtei`
# reaches this catalog and gets Bengali letters. That is the `pa`, `sr`, `jv`
# and `su` asymmetry, and here more than anywhere else in the roster the answer
# — **a second catalog, `mni-Mtei`, beside this one** — is owed rather than
# hypothetical. Nothing in this file should be transliterated in place: a
# catalog in two scripts is wrong in both.
#
# Meitei selects on neither argument. It has no grammatical gender and no
# adjective agreement, and — unlike every Indo-Aryan catalog in this batch —
# its **adjectives follow the noun**: «ফী অঙৌবা», a white cloth. So
# `style-with-noun` puts the description after the noun rather than before it,
# and this is the only catalog in the batch that does.
#
# **Two vocabulary decisions to check first.** Four colour words here are
# Meitei's own — অমুবা, অঙৌবা, অঙাংবা, অশাংবা — and the other eight are the
# Bengali-derived terms Manipuri prose already uses. অশাংবা covers a range
# English divides between green and blue; this seed writes it for green and the
# loan নীল for blue rather than collapsing the two keys, which is a choice a
# speaker should overrule if it is wrong. And Meitei's words for a stroke's
# width are guessed from its ordinary words for large and small, the same guess
# `locales/brx` makes.
#
# Numbers render in Latin digits under Indian grouping (#1615).


## Style vocabulary

color =
    .black = অমুবা
    .white = অঙৌবা
    .gray = ধূসর
    .red = অঙাংবা
    .orange = কমলা
    .yellow = হলুদ
    .green = অশাংবা
    .cyan = সায়ন
    .blue = নীল
    .purple = বেগুনী
    .pink = গোলাপী
    .brown = খয়েরী

line-width =
    .thick = অচৌবা
    .thin = অপীকপা

line-style =
    .dashed = তক্থোকপা
    .dotted = চেৎনবা

fill-style =
    .horizontal = পরিং পরেং
    .vertical = লেপপা পরেং
    .diagonal = তিংথোকপা পরেং
    .backdiagonal = ওন্থোকপা তিংথোকপা পরেং
    .dots = চেৎ
    .diamonds = সমচতুর্ভুজ

noun =
    .line = পরেং
    .line-segment = পরেং শরুক
    .ray = কিরণ
    .vector = সদিশ
    .curve = কোয়বা পরেং
    .function = ফলন
    .parabola = পরবলয়
    .polyline = পরেং কয়া
    .polygon = বহুভুজ
    .triangle = ত্রিভুজ
    .rectangle = আয়ত
    .circle = বৃত্ত
    .region = লমদম
    .point = চেৎ
    .square = বর্গ
    .diamond = সমচতুর্ভুজ
    .cross = গুণন খুদম
    .plus = পুনশিনবা খুদম

# The count follows the noun the way every other modifier does, so the head
# carries the noun alone and the tail carries the complement. Meitei is the one
# catalog in this batch that reaches `[tail]`.
noun-regular-polygon =
    { $part ->
        [tail] মায়কৈ { $numSides } লৈবা
       *[head] অচুম্বা বহুভুজ
    }

# Nothing selects on it: Meitei has no grammatical gender.
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

# The adjectives follow the noun, so the two halves change places against
# English. A noun with a tail puts the tail last, after the adjectives it
# qualifies.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = থল্লবা

# «-না» is the instrumental and has one shape whatever precedes it, so welding
# it onto a placeable is sound.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern }না
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } { $pattern }না
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } { $pattern }না
       *[plain] { $noun } { $filled } { $color }
    }

# «মপান» is the border and stands in front of its own adjective, so the
# comitative «-গা» welds onto the placeable rather than onto a word this
# catalog writes. Meitei has no article, so the `-article` branches read like
# their neighbours.
style-border-clause =
    { $parts ->
        [with-article] মপান { $border }গা লোয়ননা
        [and] অমসুং মপান { $border }গা লোয়ননা
        [and-article] অমসুং মপান { $border }গা লোয়ননা
       *[with] মপান { $border }গা লোয়ননা
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }না
       *[plain] { $color }
    }

style-unfilled = থল্লদবা

# «-দা» is the locative and has one shape too.
style-text =
    { $parts ->
        [background] মতুং { $background }দা { $color }
       *[plain] { $color }
    }

style-background-none = করিসু লৈতে


## Boolean words

boolean-true = অচুম্বা
boolean-false = অরানবা


## Answer buttons

answer-submit-label = য়েংশিল্লু
answer-submit-label-no-correctness = পাউখুম থাদোকউ


## Sectional blocks

section-name =
    .activity = থবক
    .aside = নাকল ৱারোল
    .cascade = কাসকেদ
    .definition = ৱাহন্থোক
    .example = খুদাম
    .exercise = অভ্যাস
    .exercises = অভ্যাস
    .given-answer = পাউখুম
    .note = ৱারোল
    .objectives = পান্দম
    .paragraphs = অনুচ্ছেদ
    .part = শরুক
    .problem = ৱাফম
    .problems = ৱাফম
    .proof = খংহন্নবা
    .question = ৱাহং
    .section = শরুক
    .solution = পাউখুম লম্বী
    .task = থবক
    .theorem = প্রমেয়

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = খুদম


## Tables and figures

table-name =
    { $parts ->
        [numbered] তেবল { $enumeration }
        [numbered-title] তেবল { $enumeration }{ ": " }
        [unnumbered-title] তেবল{ ": " }
       *[unnumbered] তেবল
    }

figure-name =
    { $parts ->
        [numbered] মমি { $enumeration }
        [numbered-caption] মমি { $enumeration }{ ": " }
        [unnumbered-caption] মমি{ ": " }
       *[unnumbered] মমি
    }


## Paginator controls

paginator-previous = মমাংগী
paginator-next = মথংগী
paginator-page = লামায়

# «X-দগী Y» — "Y out of X" — puts the total first, so the two counts change
# places. The ablative «-দগী» has one shape whatever precedes it.
paginator-page-status = { $numPages }-দগী { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = নত্ত্রগা

piecewise-condition-if = করিগুম্বা

piecewise-condition-otherwise = নত্ত্রবদি


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Manipuri is an official language of Manipur and is taught as a subject and
## as a medium in the earlier grades; the Board of Secondary Education's
## science papers are English-medium, so the periodic table reaches a Meitei
## student in English. That is the school-system case again, and the fallback
## is the curriculum.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = অরানবা রাসায়নিক খুদম
chemistry-invalid-ionic-compound = অরানবা আয়নিক যৌগিক
