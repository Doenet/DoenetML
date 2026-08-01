# Burmese content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Burmese has no grammatical gender and does not inflect an adjective for
# anything, so both `$gender` and `$role` go unused exactly as they do in
# English. An adjective attaches with -သော and stands in front of its noun, so
# the composition messages keep the English order; what moves is the
# postposition, since ဖြင့် and ပေါ်တွင် follow their noun where English's
# `with` and `on` precede it.
#
# CLDR gives Burmese a single plural category, so a plural selector is written
# with its default variant alone: `one` can never be chosen, and a branch that
# cannot be reached is worse than no branch. An explicit `[0]` is a numeric
# match rather than a category and still selects.
#
# This file is **Unicode**, not Zawgyi. The two encodings share code points and
# render each other as nonsense, so a correction pasted in from a Zawgyi source
# will look right in one font and be wrong everywhere else.
#
# The element names are deliberately absent; see the note above `element-name`.
#
# CLDR counts Burmese in Myanmar digits, and DoenetML does not: every number
# renders in Latin digits (#1615), which is what the mathematics beside it is
# written in.


## Style vocabulary

color =
    .black = အနက်ရောင်
    .white = အဖြူရောင်
    .gray = မီးခိုးရောင်
    .red = အနီရောင်
    .orange = လိမ္မော်ရောင်
    .yellow = အဝါရောင်
    .green = အစိမ်းရောင်
    .cyan = စိမ်းပြာရောင်
    .blue = အပြာရောင်
    .purple = ခရမ်းရောင်
    .pink = ပန်းရောင်
    .brown = အညိုရောင်

line-width =
    .thick = ထူသော
    .thin = ပါးသော

line-style =
    .dashed = မျဉ်းပြတ်
    .dotted = အစက်ချ

# Noun phrases rather than adjectives: ဖြင့် ("with") takes them bare.
fill-style =
    .horizontal = အလျားလိုက်မျဉ်းများ
    .vertical = ဒေါင်လိုက်မျဉ်းများ
    .diagonal = ထောင့်ဖြတ်မျဉ်းများ
    .backdiagonal = ပြောင်းပြန်ထောင့်ဖြတ်မျဉ်းများ
    .dots = အစက်များ
    .diamonds = စိန်ပုံများ

noun =
    .line = မျဉ်း
    .line-segment = မျဉ်းပိုင်း
    .ray = မျဉ်းခြမ်း
    .vector = ဗက်တာ
    .curve = မျဉ်းကွေး
    .function = ဖန်ရှင်
    .parabola = ပါရာဘိုလာ
    .polyline = မျဉ်းစုံ
    .polygon = ဗဟုဂံ
    .triangle = တြိဂံ
    .rectangle = စတုဂံ
    .circle = စက်ဝိုင်း
    .region = ဒေသ
    .point = အမှတ်
    .square = စတုရန်း
    .diamond = စိန်ပုံ
    .cross = ကြက်ခြေခတ်
    .plus = အပေါင်းလက္ခဏာ

# The side count attaches to the noun that follows, so the whole phrase is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] အနား { $numSides } ခုပါ ပုံမှန်ဗဟုဂံ
    }

# Burmese has no grammatical gender, so every noun answers the same and the
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

style-filled-word = ဖြည့်ထားသော

# ဖြင့် ("with") follows the pattern it applies to, so the clause English
# appends comes to the front here.
style-filled =
    { $parts ->
        [pattern] { $pattern }ဖြင့် { $filled } { $color }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern }ဖြင့် { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern }ဖြင့် { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }

# ဖြင့် is a postposition, so it follows ဘောင် rather than preceding it as
# English's `with` does. Burmese has no article, which leaves the `-article`
# branches reading like the others.
style-border-clause =
    { $parts ->
        [with-article] { $border } ဘောင်ဖြင့်
        [and] နှင့် { $border } ဘောင်ဖြင့်
        [and-article] နှင့် { $border } ဘောင်ဖြင့်
       *[with] { $border } ဘောင်ဖြင့်
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = အဖြည့်မရှိသော

# ပေါ်တွင် ("on") follows နောက်ခံ, and the colour word in front of it is
# untouched by that.
style-text =
    { $parts ->
        [background] { $background } နောက်ခံပေါ်တွင် { $color }
       *[plain] { $color }
    }

style-background-none = မရှိပါ


## Boolean words

boolean-true = မှန်
boolean-false = မှား


## Answer buttons

answer-submit-label = စစ်ဆေးရန်
answer-submit-label-no-correctness = အဖြေ တင်သွင်းရန်


## Sectional blocks

section-name =
    .activity = လှုပ်ရှားမှု
    .aside = ဘေးမှတ်စု
    .cascade = ကက်စကိတ်
    .definition = အဓိပ္ပာယ်ဖွင့်ဆိုချက်
    .example = ဥပမာ
    .exercise = လေ့ကျင့်ခန်း
    .exercises = လေ့ကျင့်ခန်းများ
    .given-answer = အဖြေ
    .note = မှတ်ချက်
    .objectives = ရည်ရွယ်ချက်များ
    .paragraphs = စာပိုဒ်များ
    .part = အပိုင်း
    .problem = ပုစ္ဆာ
    .problems = ပုစ္ဆာများ
    .proof = သက်သေပြချက်
    .question = မေးခွန်း
    .section = ကဏ္ဍ
    .solution = အဖြေရှာနည်း
    .task = လုပ်ငန်းတာဝန်
    .theorem = သီအိုရမ်

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = အရိပ်အမြွက်


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
        [numbered] ပုံ { $enumeration }
        [numbered-caption] ပုံ { $enumeration }{ ": " }
        [unnumbered-caption] ပုံ{ ": " }
       *[unnumbered] ပုံ
    }


## Paginator controls

paginator-previous = ယခင်
paginator-next = နောက်
paginator-page = စာမျက်နှာ

# «X ထဲမှ Y» — "Y out of X" — puts the total first, so the two counts change
# places.
paginator-page-status = { $numPages } ထဲမှ { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = သို့မဟုတ်

piecewise-condition-if = အကယ်၍

piecewise-condition-otherwise = ထိုမှတပါး


## Chemistry

# `element-name` and `element-anion-name` are deliberately omitted, and those
# 130 keys fall back to English.
#
# Burmese has no settled chemical nomenclature to seed from: the
# transliterations that circulate in Myanmar textbooks are not standardised,
# and several elements are named in English outright. Inventing a set would be
# worse than the English fallback, which is what a student meets in a textbook
# anyway. `lint:i18n` reports the gap until a chemist who writes Burmese
# supplies them. This is the choice Somali, Hmong Njua, Amharic, Assamese and
# Nepali already make, and for the same reason.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = မမှန်ကန်သော ဓာတုသင်္ကေတ
chemistry-invalid-ionic-compound = မမှန်ကန်သော အိုင်သွန်ဒြပ်ပေါင်း
