# Mon (ဘာသာမန်) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in. `locales/en/content.ftl` is the source of truth, and message ids
# and attribute names are never translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Variety, script and spacing** are as `chrome.ftl`'s header sets them out:
# Mon of Mon State and the Thai Mon communities, in the Mon-Burmese script
# with the Mon letters ၚ ၜ and the Mon medials ၞ ၟ ၠ — never Burmese င
# for Mon ၚ — and Burmese spacing, a space at a phrase boundary rather than
# between words.
#
# ## Word order: the noun comes first
#
# **Mon puts the head noun first and every modifier after it**, as its
# Austroasiatic relatives do. So `style-with-noun` places `{ $noun }` in front
# of `{ $description }`, and inside the description the order is fixed as
# **colour, then dash pattern, then thickness** — "line red dashed thick"
# rather than English's "thick dashed red line". That order is consistent
# across every message in this file and it is what the style-description tests
# pin.
#
# **`[noun-tail]` is unused.** Modifiers follow the head, so a regular
# polygon's side count can sit after the noun without splitting it, and
# `noun-regular-polygon` fills `head` and leaves `tail` empty as English does.
#
# ## No gender fork and no `$role` fork
#
# Mon has no grammatical gender and no case inflection on a modifier, so
# `noun-gender` answers the single token `neuter` and nothing forks on
# `$gender` or `$role`. What Mon would want and this frame cannot give it is a
# **classifier** between a numeral and a noun, and no message here counts a
# noun.
#
# ## What this catalog does not know, stated plainly
#
# **This is the thinnest of the three Myanmar-script catalogs in its own
# content words, and the colour list is where that shows.** The seed could not
# establish Mon's own basic colour terms with any confidence, so **all twelve
# colours below are Burmese loans in Burmese spelling** — အနက်, အဖြူ,
# မီးခိုး, အနီ, လိမ္မော်, အဝါ, အစိမ်း, စိမ်းပြာ, အပြာ, ခရမ်း, ပန်း, အညို.
# Mon certainly has its own words for at least black, white and red; they are
# not here because this seed does not know them, not because they do not
# exist. **This is the first place a speaker should look**, and correcting the
# twelve is a bigger improvement to this catalog than correcting anything
# else in it.
#
# The geometric nouns are the same case one step further out: `<circle>`,
# `<triangle>` and `<point>` are written with the Burmese school words
# စက်ဝိုင်း, တြိဂံ and အမှတ်, which is what a Mon pupil meets in a Burmese
# maths lesson, and everything from `line segment` outwards is left in English
# in Latin letters. What is Mon here is the frame around them.
#
# ## The conditional, and a limit the catalog cannot fix from inside
#
# **Mon marks a conditional clause-finally**, with မ္ဂး after the condition,
# where English writes "if" in front of it. `piecewise-condition-if` is
# rendered before the mathematics by the core, so the word cannot be moved
# from inside this catalog. It is written as မ္ဂး anyway, in the position the
# core gives it, and this is recorded rather than papered over: a Mon reader
# will see the marker on the wrong side of its clause, and fixing it means
# changing what the composition message is handed, not changing this string.
#
# ## Chemistry: both element tables are deliberately absent
#
# `element-name` and `element-anion-name` are the **only English keys this
# file does not cover**, 130 of them, and the reason is a fact about a school
# system rather than about Mon. Secondary science in Mon State is taught in
# **Burmese**, out of the national curriculum's textbooks; Mon national
# schools and the Mon literature programme teach the language and the primary
# grades, and do not run to the grades where the periodic table is taught. So
# there is no settled, checkable Mon list of the 118 elements to seed from,
# and coining one would invent a nomenclature no reader has met. The 130 keys
# fall back to English. `ion-name-oxidation-state` and the two invalid-symbol
# messages are frames rather than vocabulary and are covered below.


## Style vocabulary

# All twelve are Burmese loans in Burmese spelling. See the header: this is
# the least confident line in the catalog and the first a speaker should fix.
color =
    .black = အနက်
    .white = အဖြူ
    .gray = မီးခိုး
    .red = အနီ
    .orange = လိမ္မော်
    .yellow = အဝါ
    .green = အစိမ်း
    .cyan = စိမ်းပြာ
    .blue = အပြာ
    .purple = ခရမ်း
    .pink = ပန်း
    .brown = အညို

# Both are Burmese loans: ထူ (thick) and ပါး (thin). The seed could not
# establish Mon's own pair, and says so rather than guessing at one.
line-width =
    .thick = ထူ
    .thin = ပါး

line-style =
    .dashed = အပြတ်
    .dotted = အစက်

fill-style =
    .horizontal = မျဉ်း အလျားလိုက်
    .vertical = မျဉ်း ဒေါင်လိုက်
    .diagonal = မျဉ်း ထောင့်ဖြတ်
    .backdiagonal = မျဉ်း ထောင့်ဖြတ် ပြောင်းပြန်
    .dots = အစက်
    .diamonds = စိန်ပုံ

noun =
    .line = မျဉ်း
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
    .triangle = တြိဂံ
    .rectangle = rectangle
    .circle = စက်ဝိုင်း
    .region = ဒေသ
    .point = အမှတ်
    .square = square
    .diamond = စိန်ပုံ
    .cross = ကြက်ခြေခတ်
    .plus = အပေါင်း

# Modifiers follow the head noun in Mon, so the side count sits after the
# noun and `tail` stays empty, as it does in English.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regular polygon { $numSides } ထောင့်
    }

# One token for everything: Mon has no grammatical gender, so nothing below
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

style-filled-word = ပေၚ်

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } နကဵု { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } နကဵု { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } နကဵု { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

# Mon has no article, so the two `-article` branches say what the two without
# it say. What survives is နကဵု ('with') against တုဲ ('and then') — a first
# clause against a further one.
style-border-clause =
    { $parts ->
        [with-article] နကဵု border { $border }
        [and] တုဲ border { $border }
        [and-article] တုဲ border { $border }
       *[with] နကဵု border { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = ဟွံပေၚ်

style-text =
    { $parts ->
        [background] { $color } နကဵု background { $background }
       *[plain] { $color }
    }

style-background-none = ဟွံမွဲ


## Boolean words

boolean-true = ဒှ်
boolean-false = ဟွံဒှ်


## Answer buttons

answer-submit-label = စၟဳစၟတ် ကမၠောန်
answer-submit-label-no-correctness = ပ္တိုန် သွဟ်


## Sectional blocks

section-name =
    .activity = ကမၠောန်
    .aside = aside
    .cascade = cascade
    .definition = တၚ်အဓိပ္ပါယ်
    .example = ဥပမာ
    .exercise = လေ့ကျင့်ခန်း
    .exercises = လေ့ကျင့်ခန်း
    .given-answer = သွဟ်
    .note = စၟတ်သမ္တီ
    .objectives = ရန်တၟံ
    .paragraphs = paragraph
    .part = အပိုင်း
    .problem = ပြသၞာ
    .problems = ပြသၞာ
    .proof = သက်သေပြချက်
    .question = သၟာန်
    .section = ကဏ္ဍ
    .solution = နဲသွဟ်
    .task = လုပ်ငန်း
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

hint-title = ကသပ်


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
        [numbered] ဗီု { $enumeration }
        [numbered-caption] ဗီု { $enumeration }{ ": " }
        [unnumbered-caption] ဗီု{ ": " }
       *[unnumbered] ဗီု
    }


## Paginator controls

paginator-previous = ကၠာ
paginator-next = လက္ကရဴ
paginator-page = မုက်လိက်

paginator-page-status = { $pageLabel } { $currentPage } နူ { $numPages }


## Piecewise functions

piecewise-condition-or = ဟွံသေၚ်
# Mon marks a conditional clause-finally; the core renders this word in front
# of the mathematics, which is the wrong side for Mon. See the header: it
# cannot be fixed from inside this catalog.
piecewise-condition-if = မ္ဂး
piecewise-condition-otherwise = ဟွံသေၚ်မ္ဂး


## Chemistry
##
## `element-name` and `element-anion-name` are absent on purpose; the header
## says why. What is here is the frames, which are not vocabulary.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = symbol ဟွံဒးရး
chemistry-invalid-ionic-compound = ionic compound ဟွံဒးရး


## Inputs embedded in math

math-embedded-input-blank = ကွက်လပ်
math-embedded-input-blank-ordinal = ကွက်လပ် { $ordinal } နူ { $total }
