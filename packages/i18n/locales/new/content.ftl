# Newar / Nepal Bhasa (नेपाल भाषा, नेवाः भाय्) content catalog: the prose the
# core computes into the document. Selected by `documentLocale` — the language
# the activity was written in, not the language of the reader's chrome.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Devanagari, not Ranjana**, for the reasons `chrome.ftl`'s header
# sets out in full — running Newar prose is published in Devanagari and has
# been for a century, Ranjana is a display script rather than a paragraph
# script, and its browser font coverage is thin. A conversion is a conversion
# of all four files at once, and a real conversion rather than a
# transliteration.
#
# ## Word order
#
# **Modifiers precede the noun and postpositions follow it.** Newar is
# verb-final and left-branching, so `style-with-noun` and
# `style-filled-with-noun` keep English's order of `{ $description }` before
# `{ $noun }`, and `style-stroke` keeps English's internal sequence of width,
# dash pattern, colour. What does move is every one of English's prepositions:
# `with` becomes the postposition नापं and `on`/`in` the locative -य्, so
# `style-border-clause`, `style-filled` and `style-text` all put the value in
# front of the word English puts it behind. That reordering is the whole of
# the difference between this file and a word-for-word rendering, and it is a
# fact about Newar rather than a liberty.
#
# **`[noun-tail]` is unused.** `noun-regular-polygon` fills `head` with
# «{ $numSides } पाखे दुगु नियमित बहुभुज» and leaves `tail` empty, exactly as
# English does: the side count is a modifier and modifiers go in front, so
# there is nothing to place after the adjectives and no reason to split the
# noun. The `[noun-tail]` branches in the two composition messages are kept
# because a partly-translated locale falls back through them, not because
# anything in this file selects them.
#
# ## Gender, role and number
#
# **Neither `$gender` nor `$role` is selected on.** Newar has no grammatical
# gender at all — it does not even have Nepali's animate -ी feminine — so
# `noun-gender` answers the single token `neuter` and every adjective is
# written once. And a Newar modifier does not change shape for the position
# its phrase is going into: the -गु attributive ending stands unaltered before
# a postposition, so बाक्लो ह्याउँ reads the same standing alone as it does
# behind नापं. Both are claims about the language, not gaps in the seed.
#
# **Nothing selects on a count.** A Newar noun is not marked for number after
# a numeral — «निगू रेखा», not a pluralized noun — and CLDR has no plural data
# for `new` in any case, so a `one` or `few` branch here would be text chosen
# by another language's rules. There are no plural branches anywhere in this
# catalog.
#
# ## Vocabulary, and what this file does not know
#
# **The geometry and style words are largely Nepali and Sanskrit, declared as
# such.** Newar-medium mathematics teaching does not run to the grades where
# these terms are needed, and रेखा, बिन्दु, वक्र, बहुभुज, सदिश, परवलय, फलन
# are the words a Newar reader has met — in Nepali. Inventing Newar
# equivalents would put words in front of a reader that no Newar reader has
# seen.
#
# **The colours are the one place this file is genuinely Newar, and only
# half of it.** हाकु, तुयु, ह्याउँ, म्हासु and वाउँ — black, white, red,
# yellow and green — are Newar words. The other seven (grey, orange, cyan,
# blue, purple, pink, brown) are Nepali or English loans, and cyan is a
# transliteration. वाउँ is the harder case and is flagged rather than hidden:
# it covers a green-and-blue range in Newar, so writing it for `green` and a
# loan for `blue` is the seed splitting a range it does not know how to split.
# A speaker should expect to correct that pair together.
#
# **`line-width` and `line-style` are Nepali loans throughout** — बाक्लो,
# पातलो, धर्के, थोप्ले — and so is every `fill-style` entry. The seed does not
# know the Newar words for thick and thin with enough confidence to write
# them, and guessing at a word that appears in every second style description
# would be worse than declaring the loan. This is the first thing in this file
# a speaker should replace.
#
# **What *is* Newar here is the grammar**: दु and मदु for the existential and
# its negation, ख: and मखु for the copula and its negation — which is why
# `boolean-true` and `boolean-false` are those two words and not a
# transliteration — जाःगु and मजाःगु for filled and unfilled, न्ह्यसः for a
# question, लिसः for an answer, and the -गु attributive throughout. A message
# where छ, छैन, हो or होइन has crept in is a Nepali leak and a defect.
#
# **The chemistry tables are absent.** `element-name` and `element-anion-name`
# are not translated here, and the reason is the school-system one: chemistry
# in Nepal is taught in Nepali and English, the periodic table a Newar pupil
# meets is one of those two, and there is no Newar nomenclature for 118
# elements to reproduce. Coining one would invent names no reader has met and
# would hide the fact that the reader already has a language for them. The
# three messages that are *frames* rather than names —
# `ion-name-oxidation-state`, `chemistry-invalid-symbol` and
# `chemistry-invalid-ionic-compound` — are translated, on the standing ground
# that a frame is the catalog's business whether or not the names in it are.
#
# **Numbers render in Latin digits** under Newar's own grouping, which is the
# digit policy in the package README (#1615).


## Style vocabulary

color =
    .black = हाकु
    .white = तुयु
    .gray = फुस्रो
    .red = ह्याउँ
    .orange = सुन्तला
    .yellow = म्हासु
    .green = वाउँ
    .cyan = सायन
    .blue = नील
    .purple = बैजनी
    .pink = गुलाबी
    .brown = खैरो
line-width =
    .thick = बाक्लो
    .thin = पातलो
line-style =
    .dashed = धर्के
    .dotted = थोप्ले
# Noun phrases rather than adjectives: they stand in front of the postposition
# नापं that the composition messages supply, and modify nothing.
fill-style =
    .horizontal = तेर्सा रेखा
    .vertical = ठाडा रेखा
    .diagonal = विकर्ण रेखा
    .backdiagonal = उल्टो विकर्ण रेखा
    .dots = थोप्ला
    .diamonds = समचतुर्भुज
noun =
    .line = रेखा
    .line-segment = रेखाखण्ड
    .ray = किरण
    .vector = सदिश
    .curve = वक्र
    .function = फलन
    .slope-field = ढलान क्षेत्र
    .vector-field = सदिश क्षेत्र
    .parabola = परवलय
    .polyline = बहुरेखा
    .polygon = बहुभुज
    .triangle = त्रिभुज
    .rectangle = आयत
    .circle = वृत्त
    .region = क्षेत्र
    .point = बिन्दु
    .square = वर्ग
    .diamond = समचतुर्भुज
    .cross = क्रस चिन्ह
    .plus = जोड चिन्ह
# दुगु ("having") attaches the side count to the noun that follows it, so the
# whole phrase is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } पाखे दुगु नियमित बहुभुज
    }
# Newar has no grammatical gender, so every noun answers the same and the
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
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
style-filled-word = जाःगु
# नापं is a postposition, so the pattern comes to the front of the clause
# English appends at the end.
style-filled =
    { $parts ->
        [pattern] { $pattern } नापं { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } नापं { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } नापं { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# नापं follows किनारा rather than preceding it as English's `with` does, and व
# opens the further clause. Newar has no article, which leaves the two
# `-article` branches reading exactly like the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } किनारा नापं
        [and] व { $border } किनारा नापं
        [and-article] व { $border } किनारा नापं
       *[with] { $border } किनारा नापं
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = मजाःगु
# The locative -य् marks पृष्ठभूमि, so the background leads and the text
# colour follows it.
style-text =
    { $parts ->
        [background] { $background } पृष्ठभूमिय् { $color }
       *[plain] { $color }
    }
style-background-none = मदु


## Boolean words

# ख: and मखु are Newar's own copula and its negation, which is exactly what a
# boolean displays. The DoenetML values `true` and `false` an author writes
# are untouched by this.
boolean-true = ख:
boolean-false = मखु


## Answer buttons

answer-submit-label = ज्या जाँच यानादिसँ
answer-submit-label-no-correctness = लिसः छ्वयादिसँ


## Sectional blocks

section-name =
    .activity = क्रियाकलाप
    .aside = पाखेटिप्पणी
    .cascade = क्यास्केड
    .definition = परिभाषा
    .example = उदाहरण
    .exercise = अभ्यास
    .exercises = अभ्यास
    .given-answer = लिसः
    .note = टिप्पणी
    .objectives = उद्देश्य
    .paragraphs = अनुच्छेद
    .part = भाग
    .problem = समस्या
    .problems = समस्या
    .proof = प्रमाण
    .question = न्ह्यसः
    .section = खण्ड
    .solution = समाधान
    .task = ज्या
    .theorem = प्रमेय
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = इशारा


## Tables and figures

table-name =
    { $parts ->
        [numbered] तालिका { $enumeration }
        [numbered-title] तालिका { $enumeration }{ ": " }
        [unnumbered-title] तालिका{ ": " }
       *[unnumbered] तालिका
    }
figure-name =
    { $parts ->
        [numbered] चित्र { $enumeration }
        [numbered-caption] चित्र { $enumeration }{ ": " }
        [unnumbered-caption] चित्र{ ": " }
       *[unnumbered] चित्र
    }


## Paginator controls

paginator-previous = न्ह्यःगु
paginator-next = लिपांगु
paginator-page = पेज
# «of» is not a word here: the total precedes and या links it, which is the
# genitive Newar builds this phrase with.
paginator-page-status = { $numPages } या { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = वा
# Newar's own conditional is clause-final (-सा), and the renderer places this
# word *before* the mathematics it introduces, so the native construction
# cannot be reached from inside the catalog. यदि is the Sanskrit-register
# clause-initial conditional, which is grammatical here and lands correctly.
piecewise-condition-if = यदि
piecewise-condition-otherwise = अन्यथा


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent; the header
## says why. Only the frames are here.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = अवैध रासायनिक चिन्ह
chemistry-invalid-ionic-compound = अवैध आयनिक यौगिक


## Inputs embedded in math

math-embedded-input-blank = खालि
math-embedded-input-blank-ordinal = { $total } मध्ये खालि { $ordinal }
