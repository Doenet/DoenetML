# Shan (လိၵ်ႈတႆး) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in. `locales/en/content.ftl` is the source of truth, and message ids
# and attribute names are never translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Variety, script and spacing** are as `chrome.ftl`'s header sets them out:
# modern reformed Shan orthography, the Shan letters ၵ ၶ ၸ ၺ ၼ ပ ၽ ၾ ႁ ဢ with
# the Shan vowels ႃ ႄ ႅ ႆ ွ ႂ and the Shan tone marks ႇ ႈ း ႉ ႊ, never their
# Burmese look-alikes; and spaces between words, following Shan practice
# rather than the Burmese convention of running a clause together.
#
# ## Word order: the noun comes first
#
# **Shan puts the head noun first and every modifier after it**, which is the
# opposite of English. So this file writes «စက်ဝိုင်း သီၾႃႉ တဵမ်» where
# English writes "filled blue circle", and `style-with-noun` places
# `{ $noun }` in front of `{ $description }` rather than behind it. Inside the
# description the order is fixed as **colour, then dash pattern, then
# thickness** — «သဵၼ်ႈ သီလႅင် ၶၢတ်ႇ ၼႃ» for "thick dashed red line". That is
# the reverse of English's stacking, it is consistent across every message in
# this file, and it is what the style-description tests pin.
#
# **`[noun-tail]` is unused.** Because modifiers follow the head, the side
# count of a regular polygon can sit after the noun without splitting it, so
# `noun-regular-polygon` fills `head` and leaves `tail` empty as English does.
#
# ## No gender fork, and no `$role` fork
#
# Shan has no grammatical gender and no case inflection: an adjective is
# invariant, and a word standing alone is the same word inside a border or a
# background clause. `noun-gender` therefore answers the single token
# `neuter` for everything and nothing below selects on `$gender` or `$role`.
# That is a fact about the language rather than a limit of the seed — the one
# thing Shan would want that this frame cannot give it is a **classifier**
# before a counted noun, and no message here counts a noun.
#
# ## Register, and what is a loan
#
# The frame is Shan; the technical vocabulary is two declared loan sets, and
# neither is respelled into invented Shan syllables.
#
#   * **Burmese, in Burmese spelling**, for the school register Shan borrows:
#     the six colour words မီးခိုး (gray), လိမ္မော် (orange), စိမ်းပြာ
#     (cyan), ခရမ်း (purple), ပန်း (pink), အညို (brown); အလျားလိုက်
#     (horizontal), ဒေါင်လိုက် (vertical), ထောင့်ဖြတ် (diagonal), အစက်
#     (dot), စိန်ပုံ (diamond shape), ကြက်ခြေခတ် (cross), အပေါင်း (plus),
#     အမှတ် (point), စက်ဝိုင်း (circle), သက်သေပြချက် (proof), ဇယား (table).
#     They keep Burmese letters (က ခ စ ည န ဖ သ အ) and so are visible as loans.
#   * **English, in the Latin alphabet**, for the mathematics a Shan pupil
#     meets in English: `line segment`, `ray`, `vector`, `curve`, `function`,
#     `slope field`, `vector field`, `parabola`, `polyline`, `polygon`,
#     `regular polygon`, `rectangle`, `square`, `paragraph`, `section`,
#     `aside`, `cascade`, `theorem`, `symbol`, `ionic compound`. Leaving them
#     in Latin is what Myanmar-script technical writing does; transcribing
#     them into Shan letters would invent a spelling no reader has seen.
#
# **The six Shan colour terms are the file's most confident line and the
# other six its least.** လမ် (black), ၶၢဝ် (white), လႅင် (red), လိူင်
# (yellow), ၶဵဝ် (green) and ၾႃႉ (sky, hence blue) are Shan words; the other
# six are the Burmese words above, written because the seed could not
# establish a Shan term for them, not because Shan lacks one. This is the
# first place a speaker should look.
#
# ## Chemistry: both element tables are deliberately absent
#
# `element-name` and `element-anion-name` are the **only English keys this
# file does not cover**, 130 of them, and the reason is a fact about a school
# system rather than about Shan. Secondary science in Shan State is taught in
# **Burmese**, out of the national curriculum's textbooks, and above that in
# English; Shan-medium schooling — the Shan State monastic and community
# schools, and the Shan literature classes — does not run to the grades where
# the periodic table is taught. There is therefore no settled, checkable Shan
# list of the 118 elements to seed from, and coining one would invent a
# nomenclature no reader has met. The 130 keys fall back to English. A
# speaker who wants them filled should start from the Burmese names their own
# textbooks print rather than from this file. `ion-name-oxidation-state` and
# the two invalid-symbol messages are frames rather than vocabulary and are
# covered below.


## Style vocabulary

# Six Shan colour words and six Burmese loans; see the header. All twelve
# take the Shan frame word သီ ('colour') so that the phrase reads the same
# way whichever half a word comes from.
color =
    .black = သီလမ်
    .white = သီၶၢဝ်
    .gray = သီမီးခိုး
    .red = သီလႅင်
    .orange = သီလိမ္မော်
    .yellow = သီလိူင်
    .green = သီၶဵဝ်
    .cyan = သီစိမ်းပြာ
    .blue = သီၾႃႉ
    .purple = သီခရမ်း
    .pink = သီပန်း
    .brown = သီအညို

line-width =
    .thick = ၼႃ
    .thin = မၢင်

# ၶၢတ်ႇ is Shan 'cut, broken'; အစက် is the Burmese loan for a dot.
line-style =
    .dashed = ၶၢတ်ႇ
    .dotted = အစက်

fill-style =
    .horizontal = သဵၼ်ႈ အလျားလိုက်
    .vertical = သဵၼ်ႈ ဒေါင်လိုက်
    .diagonal = သဵၼ်ႈ ထောင့်ဖြတ်
    .backdiagonal = သဵၼ်ႈ ထောင့်ဖြတ် ပိၼ်ႈ
    .dots = အစက်
    .diamonds = စိန်ပုံ

noun =
    .line = သဵၼ်ႈ
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
    .triangle = သၢမ်ၸဵင်ႇ
    .rectangle = rectangle
    .circle = စက်ဝိုင်း
    .region = ဢွင်ႈတီႈ
    .point = အမှတ်
    .square = square
    .diamond = စိန်ပုံ
    .cross = ကြက်ခြေခတ်
    .plus = အပေါင်း

# Modifiers follow the head noun in Shan, so the side count sits after the
# noun and `tail` stays empty, as it does in English. ၸဵင်ႇ is Shan 'corner,
# angle'.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regular polygon { $numSides } ၸဵင်ႇ
    }

# One token for everything: Shan has no grammatical gender, so nothing below
# forks on `$gender`.
noun-gender = neuter


## Style composition

# Colour, then dash pattern, then thickness — the reverse of English's order.
style-stroke =
    { $parts ->
        [width-style-color] { $color } { $lineStyle } { $width }
        [width-color] { $color } { $width }
        [style-color] { $color } { $lineStyle }
        [width-style] { $lineStyle } { $width }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

# The noun comes first and the description follows it.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }

style-filled-word = တဵမ်

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } လူၺ်ႈ { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } လူၺ်ႈ { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } လူၺ်ႈ { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

# Shan has no article, so the two `-article` branches say what the two
# without it say. What survives is လူၺ်ႈ ('with') against လႄႈ ('and') — a
# first clause against a further one. The noun `border` precedes its
# description, as every noun in this file does.
style-border-clause =
    { $parts ->
        [with-article] လူၺ်ႈ border { $border }
        [and] လႄႈ border { $border }
        [and-article] လႄႈ border { $border }
       *[with] လူၺ်ႈ border { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = ဢမ်ႇတဵမ်

style-text =
    { $parts ->
        [background] { $color } လူၺ်ႈ background { $background }
       *[plain] { $color }
    }

style-background-none = ဢမ်ႇမီး


## Boolean words

boolean-true = မၢၼ်ႇ
boolean-false = ဢမ်ႇမၢၼ်ႇ


## Answer buttons

answer-submit-label = ၸႅတ်ႈတူၺ်း ၵၢၼ်
answer-submit-label-no-correctness = သူင်ႇ ၶေႃႈတွပ်ႇ


## Sectional blocks

section-name =
    .activity = ၵၢၼ်ႁဵတ်းသၢင်ႈ
    .aside = aside
    .cascade = cascade
    .definition = ၶေႃႈပွင်ႇ
    .example = တူဝ်ယၢင်ႇ
    .exercise = ၵၢၼ်ၾိုၵ်း
    .exercises = ၵၢၼ်ၾိုၵ်း
    .given-answer = ၶေႃႈတွပ်ႇ
    .note = မၢႆတွင်း
    .objectives = ပဝ်ႉမၢႆ
    .paragraphs = paragraph
    .part = ပွတ်း
    .problem = ပၼ်ႁႃ
    .problems = ပၼ်ႁႃ
    .proof = သက်သေပြချက်
    .question = ၶေႃႈထၢမ်
    .section = တွၼ်ႈ
    .solution = ၶေႃႈၵႄႈ
    .task = ၵၢၼ်
    .theorem = theorem

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = ၶေႃႈၸီႉၼႄ


## Tables and figures

table-name =
    { $parts ->
        [numbered] ဇယား { $enumeration }
        [numbered-title] ဇယား { $enumeration }{ ": " }
        [unnumbered-title] ဇယား{ ": " }
       *[unnumbered] ဇယား
    }

figure-name =
    { $parts ->
        [numbered] ႁၢင်ႈ { $enumeration }
        [numbered-caption] ႁၢင်ႈ { $enumeration }{ ": " }
        [unnumbered-caption] ႁၢင်ႈ{ ": " }
       *[unnumbered] ႁၢင်ႈ
    }


## Paginator controls

paginator-previous = ဢွၼ်တၢင်း
paginator-next = တေႃႇၼႃႈ
paginator-page = ၼႃႈလိၵ်ႈ

paginator-page-status = { $pageLabel } { $currentPage } ၼႂ်း { $numPages }


## Piecewise functions

piecewise-condition-or = ဢမ်ႇၼၼ်
piecewise-condition-if = သင်ဝႃႈ
piecewise-condition-otherwise = လိူဝ်သေၼၼ်ႉ


## Chemistry
##
## `element-name` and `element-anion-name` are absent on purpose; the header
## says why. What is here is the frames, which are not vocabulary.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = symbol ဢမ်ႇထုၵ်ႇမႅၼ်ႈ
chemistry-invalid-ionic-compound = ionic compound ဢမ်ႇထုၵ်ႇမႅၼ်ႈ


## Inputs embedded in math

math-embedded-input-blank = ပဝ်ႇ
math-embedded-input-blank-ordinal = ပဝ်ႇ { $ordinal } ၼႂ်း { $total }
