# Sylheti (ছিলটি) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in, not the language of the reader's chrome.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: the Bengali script, as Sylheti is normally printed today, not
# Sylheti Nagri** (ꠍꠤꠟꠐꠤ ꠘꠣꠉꠞꠤ). `chrome.ftl`'s header sets out the three
# reasons in full — what a Sylheti reader actually reads, browser font
# coverage, and Nagri's smaller inventory, which would collapse distinctions
# this seed cannot restore. A conversion is a conversion of all four files at
# once, and a real conversion rather than a transliteration.
#
# ## Word order
#
# **Modifiers precede the noun and postpositions follow it.** Sylheti is
# verb-final and left-branching like Bengali, so `style-with-noun` and
# `style-filled-with-noun` keep English's order of `{ $description }` before
# `{ $noun }`, and `style-stroke` keeps English's internal sequence of width,
# dash pattern, colour. What moves is every one of English's prepositions:
# `with` becomes the postposition দিয়া or লগে and `on`/`in` the locative -ও,
# so `style-border-clause`, `style-filled` and `style-text` all put the value
# in front of the word English puts it behind. That reordering is the whole of
# the difference between this file and a word-for-word rendering.
#
# **`[noun-tail]` is unused.** `noun-regular-polygon` fills `head` with
# «{ $numSides } বাউয়ালা সমবহুভুজ» and leaves `tail` empty, exactly as English
# does: the side count is a modifier and modifiers go in front, so there is
# nothing to place after the adjectives and no reason to split the noun. The
# `[noun-tail]` branch of `style-with-noun`, and the `[plain-tail]` and
# `[pattern-tail]` branches `style-filled-with-noun` uses in its place, are
# kept because a
# partly-translated locale falls back through them, not because anything here
# selects them.
#
# ## Gender, role and number
#
# **Neither `$gender` nor `$role` is selected on.** Sylheti has no
# grammatical gender — an adjective does not agree with anything — so
# `noun-gender` answers the single token `neuter` and every style word is
# written once. Nor does a Sylheti modifier change shape for the position its
# phrase is going into: the case marking a clause position wants lands on the
# *noun* at the end of the phrase, never on the adjective in front of it, so
# মোটা লাল reads the same standing alone as it does before দিয়া. Both are
# claims about the language, not gaps in the seed. That is the same reason
# `locales/eu` gives from a completely different family.
#
# **Nothing selects on a count.** A Sylheti noun is not marked for number
# after a numeral — «দুই রেখা», not a pluralized noun — and CLDR has no plural
# data for `syl` in any case, so a `one` branch here would be text selected by
# Bengali's rules. There are no plural branches anywhere in this catalog.
#
# ## Vocabulary, and what this file does not know
#
# **The geometry and style words are Bengali, declared as such.** There is no
# Sylheti-medium schooling, so রেখা, বিন্দু, বক্ররেখা, বহুভুজ, ভেক্টর,
# পরাবৃত্ত and ফাংশন are the words a Sylheti reader has met — in Bengali —
# and coining Sylheti equivalents would put unfamiliar words in front of a
# reader who already has familiar ones. This file is a **Sylheti frame around
# a declared Bengali technical register**, which is the honest description of
# it.
#
# **The colours are where Sylheti shows.** কালা, ধলা and অইল্দা — black,
# white and yellow — are Sylheti rather than Bengali (কালো, সাদা, হলুদ), and
# লাল is shared. The remaining eight are Bengali or English loans, and সায়ান
# is a transliteration. That four-to-eight split is a fact about the seed's
# knowledge, not about the language: Sylheti certainly has more of its own
# colour words than four, and supplying them is a bigger improvement to this
# file than anything else in it.
#
# **The grammar is where the rest of the Sylheti is**: নায় for verbal
# negation, নাই for absence, আছে for presence, অউ and ইতা for the
# demonstratives, লাগি, দিয়া and লগে for the postpositions, and মিছা for
# *false* — which is why `boolean-false` is that word and not Bengali's
# মিথ্যা. A message where বাংলা's নেই, এই, এগুলি or জন্য has crept back in is
# a defect.
#
# **The chemistry tables are absent.** `element-name` and `element-anion-name`
# are not translated here, and the reason is the school-system one: chemistry
# in Sylhet is taught in Bengali and English, the periodic table a Sylheti
# pupil meets is one of those two, and there is no Sylheti nomenclature for
# 118 elements to reproduce. Coining one would invent names no reader has met
# and would hide the fact that the reader already has a language for them.
# `locales/bn` carries the Bengali names for anyone who wants that list. The
# three messages that are *frames* rather than names —
# `ion-name-oxidation-state`, `chemistry-invalid-symbol` and
# `chemistry-invalid-ionic-compound` — are translated, on the standing ground
# that a frame is the catalog's business whether or not the names in it are.
#
# **Numbers render in Latin digits** under the locale's own grouping, which is
# the digit policy in the package README (#1615). A side count reads `1,234`
# here, not `১,২৩৪`.


## Style vocabulary

color =
    .black = কালা
    .white = ধলা
    .gray = ধূসর
    .red = লাল
    .orange = কমলা
    .yellow = অইল্দা
    .green = সবুজ
    .cyan = সায়ান
    .blue = নীল
    .purple = বেগুনি
    .pink = গুলাপি
    .brown = বাদামি
line-width =
    .thick = মোটা
    .thin = চিকন
line-style =
    .dashed = দাগ-দাগ
    .dotted = ফুটকি-ফুটকি
# Noun phrases rather than adjectives: they stand in front of the postposition
# দিয়া that the composition messages supply, and modify nothing.
fill-style =
    .horizontal = আড়াআড়ি রেখা
    .vertical = খাড়া রেখা
    .diagonal = কর্ণ রেখা
    .backdiagonal = উল্টা কর্ণ রেখা
    .dots = ফুটকি
    .diamonds = রম্বস
noun =
    .line = রেখা
    .line-segment = রেখাংশ
    .ray = রশ্মি
    .vector = ভেক্টর
    .curve = বক্ররেখা
    .function = ফাংশন
    .slope-field = ঢাল ক্ষেত্র
    .vector-field = ভেক্টর ক্ষেত্র
    .parabola = পরাবৃত্ত
    .polyline = বহুরেখা
    .polygon = বহুভুজ
    .triangle = তিনকোণা
    .rectangle = আয়তক্ষেত্র
    .circle = বৃত্ত
    .region = অঞ্চল
    .point = বিন্দু
    .square = চতুষ্কোণ
    .diamond = রম্বস
    .cross = আড়ি চিহ্ন
    .plus = যোগ চিহ্ন
# বাউয়ালা ("having sides") attaches the count to the noun that follows it, so
# the whole phrase is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } বাউয়ালা সমবহুভুজ
    }
# Sylheti has no grammatical gender, so every noun answers the same and the
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
style-filled-word = ভরা
# দিয়া is a postposition, so the pattern comes to the front of the clause
# English appends at the end.
style-filled =
    { $parts ->
        [pattern] { $pattern } দিয়া { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } দিয়া { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } দিয়া { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# লগে follows কিনার rather than preceding it as English's `with` does, and আর
# opens the further clause. Sylheti has no article, which leaves the two
# `-article` branches reading exactly like the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } কিনার লগে
        [and] আর { $border } কিনার লগে
        [and-article] আর { $border } কিনার লগে
       *[with] { $border } কিনার লগে
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = ভরা নায়
# The locative -ও marks পটভূমি, so the background leads and the text colour
# follows it.
style-text =
    { $parts ->
        [background] { $background } পটভূমিও { $color }
       *[plain] { $color }
    }
style-background-none = নাই


## Boolean words

# মিছা is Sylheti's own word for what is not so, where Bengali writes মিথ্যা.
# The DoenetML values `true` and `false` an author writes are untouched by
# this.
boolean-true = সত্য
boolean-false = মিছা


## Answer buttons

answer-submit-label = কাম দেখইন
answer-submit-label-no-correctness = জুয়াপ পাঠাইন


## Sectional blocks

section-name =
    .activity = কাম
    .aside = পাশটীকা
    .cascade = ক্যাসকেড
    .definition = সংজ্ঞা
    .example = উদাহরণ
    .exercise = অনুশীলন
    .exercises = অনুশীলন
    .given-answer = জুয়াপ
    .note = টীকা
    .objectives = উদ্দেশ্য
    .paragraphs = অনুচ্ছেদ
    .part = অংশ
    .problem = সমস্যা
    .problems = সমস্যা
    .proof = প্রমাণ
    .question = প্রশ্ন
    .section = বিভাগ
    .solution = সমাধান
    .task = কাজ
    .theorem = উপপাদ্য
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = ইশারা


## Tables and figures

table-name =
    { $parts ->
        [numbered] সারণি { $enumeration }
        [numbered-title] সারণি { $enumeration }{ ": " }
        [unnumbered-title] সারণি{ ": " }
       *[unnumbered] সারণি
    }
figure-name =
    { $parts ->
        [numbered] ছবি { $enumeration }
        [numbered-caption] ছবি { $enumeration }{ ": " }
        [unnumbered-caption] ছবি{ ": " }
       *[unnumbered] ছবি
    }


## Paginator controls

paginator-previous = আগের
paginator-next = পরের
paginator-page = পাতা
# «of» is not a word here: the total precedes and the genitive -র links it,
# which is how Sylheti builds this phrase.
paginator-page-status = { $numPages }-র মাঝে { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = বা
# Sylheti's own conditional is a clause-final -লে, and the renderer places
# this word *before* the mathematics it introduces, so the native
# construction cannot be reached from inside the catalog. যদি is the
# clause-initial conditional, which is grammatical here and lands correctly.
piecewise-condition-if = যদি
piecewise-condition-otherwise = নাইলে


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent; the header
## says why. Only the frames are here.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = ভুল রাসায়নিক চিহ্ন
chemistry-invalid-ionic-compound = ভুল আয়নিক যৌগ


## Inputs embedded in math

math-embedded-input-blank = খালি
math-embedded-input-blank-ordinal = { $total }-র মাঝে { $ordinal } নম্বর খালি
