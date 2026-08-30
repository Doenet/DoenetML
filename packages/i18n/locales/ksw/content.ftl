# S'gaw Karen (ကညီကျိာ်) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in. `locales/en/content.ftl` is the source of truth, and message ids
# and attribute names are never translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Variety, script and spacing** are as `chrome.ftl`'s header sets them out:
# S'gaw Karen of Kayin State and the diaspora, in the S'gaw Karen script with
# the S'gaw signs ၢ ၣ ၤ — never Burmese ာ for ၢ or န for ၣ — and spaces
# between phrases. ဢ and ၡ are S'gaw letters no word in this catalog needs. The Pwo letters ၦ and ၯ
# are not used anywhere in this catalog.
#
# ## Word order: the noun comes first
#
# **Karen puts the head noun first and every modifier after it.** So
# `style-with-noun` places `{ $noun }` in front of `{ $description }`, and
# inside the description the order is fixed as **colour, then dash pattern,
# then thickness** — "line red dashed thick" rather than English's "thick
# dashed red line". That order is consistent across every message in this file
# and it is what the style-description tests pin.
#
# **`[noun-tail]` is unused.** Modifiers follow the head, so a regular
# polygon's side count sits after the noun without splitting it, and
# `noun-regular-polygon` fills `head` and leaves `tail` empty as English does.
#
# ## No gender fork and no `$role` fork
#
# Karen has no grammatical gender and no case inflection on a modifier, so
# `noun-gender` answers the single token `neuter` and nothing forks on
# `$gender` or `$role`. What Karen would want and this frame cannot give it is
# a **classifier** between a numeral and a noun; no message here counts a
# noun, so nothing is lost.
#
# ## What this catalog does not know, stated plainly
#
# **Five of the twelve colours are Karen and seven are Burmese loans**, and
# the seven are named so nobody mistakes them for Karen: မီးခိုး (gray),
# လိမ္မော် (orange), စိမ်းပြာ (cyan), အပြာ (blue), ခရမ်း (purple), ပန်း
# (pink), အညို (brown). The five that are Karen are ဝါ (white), သူ (black),
# ဂီၤ (red), ဘီ (yellow) and လါ (green). Karen very likely has words for more
# of the seven — blue especially — and they are absent because this seed does
# not know them, not because they do not exist. **This is the first place a
# speaker should look.**
#
# The geometric nouns are the same case one step further out: `<circle>` and
# `<triangle>` are written with the Burmese school words စက်ဝိုင်း and
# တြိဂံ, which is what a Karen pupil meets in a Burmese maths lesson, and
# everything from `line segment` outwards is left in English in Latin letters.
# What is Karen here is the frame around them — the noun-first order, the
# nominalizing တၢ်, and the negative circumfix တ…ဘၣ်.
#
# ## Chemistry: both element tables are deliberately absent
#
# `element-name` and `element-anion-name` are the **only English keys this
# file does not cover**, 130 of them, and the reason is two school systems
# rather than a fact about Karen. In Myanmar, secondary science in Kayin State
# is taught in **Burmese** out of the national curriculum's textbooks; the
# Karen Education Department schools and the refugee-camp schools teach in
# Karen but stop below, or teach science out of English-language materials. In
# the diaspora a Karen pupil meets the table in **English** or in **Thai**. So
# there is no settled, checkable Karen list of the 118 elements to seed from
# and no single fallback either, and coining 118 names would invent a
# nomenclature no reader has met while hiding that split. The 130 keys fall
# back to English, which is at least what part of the readership's schooling
# uses. `ion-name-oxidation-state` and the two invalid-symbol messages are
# frames rather than vocabulary and are covered below.


## Style vocabulary

# Five Karen colour words and seven Burmese loans; see the header.
color =
    .black = သူ
    .white = ဝါ
    .gray = မီးခိုး
    .red = ဂီၤ
    .orange = လိမ္မော်
    .yellow = ဘီ
    .green = လါ
    .cyan = စိမ်းပြာ
    .blue = အပြာ
    .purple = ခရမ်း
    .pink = ပန်း
    .brown = အညို

line-width =
    .thick = ဖးထီၣ်
    .thin = ဘၢၣ်

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
    .region = လီၢ်ကဝီၤ
    .point = အမှတ်
    .square = square
    .diamond = စိန်ပုံ
    .cross = ကြက်ခြေခတ်
    .plus = အပေါင်း

# Modifiers follow the head noun in Karen, so the side count sits after the
# noun and `tail` stays empty, as it does in English.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regular polygon လၢအအိၣ်ဒီး { $numSides } ထောင့်
    }

# One token for everything: Karen has no grammatical gender, so nothing below
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

style-filled-word = ပှဲၤ

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } ဒီး { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } ဒီး { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } ဒီး { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

# Karen has no article, so the two `-article` branches say what the two
# without them say. What survives is အိၣ်ဒီး ('having') against ဒီးစ့ၢ်ကီး
# ('and also') — a first clause against a further one.
style-border-clause =
    { $parts ->
        [with-article] အိၣ်ဒီး border { $border }
        [and] ဒီးစ့ၢ်ကီး border { $border }
        [and-article] ဒီးစ့ၢ်ကီး border { $border }
       *[with] အိၣ်ဒီး border { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = တပှဲၤဘၣ်

style-text =
    { $parts ->
        [background] { $color } အိၣ်ဒီး background { $background }
       *[plain] { $color }
    }

style-background-none = တအိၣ်ဘၣ်


## Boolean words

boolean-true = မ့ၢ်
boolean-false = တမ့ၢ်ဘၣ်


## Answer buttons

answer-submit-label = သမံသမိး တၢ်မၤ
answer-submit-label-no-correctness = ဆှၢထီၣ် တၢ်စံးဆၢ


## Sectional blocks

section-name =
    .activity = တၢ်ဖံးတၢ်မၤ
    .aside = aside
    .cascade = cascade
    .definition = တၢ်အခီပညီ
    .example = တၢ်ဒိ
    .exercise = တၢ်မၤလိ
    .exercises = တၢ်မၤလိ
    .given-answer = တၢ်စံးဆၢ
    .note = တၢ်မၤနီၣ်
    .objectives = တၢ်ပညိၣ်
    .paragraphs = paragraph
    .part = တၢ်တကူာ်
    .problem = တၢ်ဂ့ၢ်ကီ
    .problems = တၢ်ဂ့ၢ်ကီ
    .proof = သက်သေပြချက်
    .question = တၢ်သံကွၢ်
    .section = တၢ်ကူာ်
    .solution = တၢ်ဒုးန့ၢ်တၢ်စံးဆၢ
    .task = တၢ်ဖံးတၢ်မၤအမူ
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

hint-title = တၢ်ဟ့ၣ်ကူၣ်


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
        [numbered] တၢ်ဂီၤ { $enumeration }
        [numbered-caption] တၢ်ဂီၤ { $enumeration }{ ": " }
        [unnumbered-caption] တၢ်ဂီၤ{ ": " }
       *[unnumbered] တၢ်ဂီၤ
    }


## Paginator controls

paginator-previous = လၢညါ
paginator-next = လၢခံ
paginator-page = ကဘျံးပၤ

paginator-page-status = { $pageLabel } { $currentPage } လၢ { $numPages } အကျါ


## Piecewise functions

piecewise-condition-or = မ့တမ့ၢ်
piecewise-condition-if = မ့ၢ်
piecewise-condition-otherwise = မ့တမ့ၢ်ဘၣ်န့ၣ်


## Chemistry
##
## `element-name` and `element-anion-name` are absent on purpose; the header
## says why. What is here is the frames, which are not vocabulary.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = symbol တဘၣ်ဘၣ်
chemistry-invalid-ionic-compound = ionic compound တဘၣ်ဘၣ်


## Inputs embedded in math

math-embedded-input-blank = လီၢ်အိၣ်ကလီ
math-embedded-input-blank-ordinal = လီၢ်အိၣ်ကလီ { $ordinal } လၢ { $total } အကျါ
