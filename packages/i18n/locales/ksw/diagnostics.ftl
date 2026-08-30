# S'gaw Karen (ကညီကျိာ်) warnings and errors. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Variety, script and spacing** are as `chrome.ftl`'s header sets them out:
# S'gaw Karen in the S'gaw Karen script with the S'gaw signs ၢ ၣ ၤ, spaces between
# phrases, and no Pwo letters (ၦ, ၯ) anywhere in the file. ဢ and ၡ are S'gaw
# letters no word in this catalog needs.
#
# **Every DoenetML name stays in English exactly as written**: `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `selectFromSequence`, every
# tag and every attribute. They are part of the language rather than prose.
#
# **This file is a Karen frame around English technical nouns**, and it is the
# most heavily loaned of the four. A diagnostic names DoenetML objects almost
# every time it opens its mouth — component, attribute, function, sequence,
# variant, reference, index — and Karen has no established word for any of
# them, so they stay in Latin letters as the classroom leaves them. What is
# Karen is the sentence, built from a small fixed set of patterns used the
# same way throughout so that a corrector can fix one pattern in one place:
#
#   * «X တဘၣ်ဘၣ်» — X is invalid
#   * «တစူးကါဘၣ်» — ignored
#   * «တန့ၢ်ဘၣ်» — cannot
#   * «ကဘၣ်» — must
#   * «တမၤဒံးဘၣ်» — has not been implemented yet
#   * «တထံၣ်ဘၣ်» — cannot find
#   * «အဃိ» — because (postposed, after the reason)
#   * «ပာ်ပနီၣ်» — to specify; «လၢပာ်ပနီၣ်ဝဲ» — specified
#   * «လီၤ» — the declarative sentence-final particle
#
# The negative circumfix **တ…ဘၣ်** is the frame's most visible feature and the
# one a corrector must not break: the တ goes in front of the verb and the ဘၣ်
# at the end of the clause, and dropping either half leaves an affirmative
# sentence that reads as its own opposite.
#
# The Burmese loans, in Burmese spelling, are အမှတ် (point), စက်ဝိုင်း
# (circle), မျဉ်း (line), ဇယား (table) and သတိပေးချက်'s Karen counterpart
# တၢ်ဟ့ၣ်ပလီၢ်, which is Karen; everything else non-Karen is English in Latin
# letters.
#
# **What this catalog does not know.** Karen has no settled terminology for
# software diagnostics or for the higher-mathematics vocabulary these messages
# use, and this seed did not invent one. Where English says "prescribed",
# "overprescribed", "coprime", "eigenvalue" or "circular dependency", the
# Karen around the English term is a paraphrase of what the sentence means
# rather than a translation of the term. Those are the places a speaker with
# the mathematical register will want to rewrite, and they are marked by the
# English word standing bare in the sentence.
#
# **Counting.** CLDR has no plural data for `ksw`. Every count select English
# writes is collapsed to a single `*[other]`, because Karen leaves a noun
# unmarked after a numeral and a category branch here would be text chosen by
# English's rules. No `[zero]`, `[one]`, `[two]`, `[few]` or `[many]` branch
# appears anywhere in these four files.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] endpoint ခံခါ ပာ်ပနီၣ်ဝဲအခါ { $attributes } တစူးကါဘၣ်
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] endpoint ဒီး midpoint ခံခါလိာ် ပာ်ပနီၣ်ဝဲအခါ { $attributes } တစူးကါဘၣ်
    }

line-segment-midpoint-offset-without-midpoint = midpoint တအိၣ်ဘၣ်န့ၣ် midpointOffset တမၤတၢ်နီတမံၤဘၣ်

## `<line>`

line-points-undetermined-dimensions = မျဉ်း လဲၤခီဖျိ အမှတ် လၢအ dimension တပာ်ပနီၣ်ဘၣ်ဝဲ လီၤ။

line-points-too-few-dimensions = မျဉ်း ကဘၣ်လဲၤခီဖျိ အမှတ် လၢအအိၣ်ဒီး dimension အစှၤကတၢၢ် ခံခါ လီၤ။

line-points-depend-on-variables = မျဉ်း လဲၤခီဖျိ အမှတ် လၢအဘၣ်ထွဲဒီး variable: { $variables }။

line-equation-invalid-format = variable { $variable1 } ဒီး { $variable2 } အပူၤ မျဉ်း အ equation အကျဲ တဘၣ်ဘၣ်။

## `<ray>`

ray-overprescribed-through = ray န့ၣ် through, endpoint ဒီး direction သၢခါလိာ် ပာ်ပနီၣ်ဝဲ လီၤ။ through လၢပာ်ပနီၣ်ဝဲန့ၣ် တစူးကါဘၣ်။

ray-dimension-mismatch = ray အပူၤ numDimensions တဘၣ်လိာ်ဘၣ်။

## `<vector>`

vector-overprescribed-head = vector န့ၣ် head, tail ဒီး displacement သၢခါလိာ် ပာ်ပနီၣ်ဝဲ လီၤ။ head လၢပာ်ပနီၣ်ဝဲန့ၣ် တစူးကါဘၣ်။

vector-dimension-mismatch = vector အပူၤ numDimensions တဘၣ်လိာ်ဘၣ်။

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` န့ၣ် state variable nearestPoint တအိၣ်ဘၣ်အဃိ attract တန့ၢ်ဘၣ်။

constrain-to-without-nearest-point = `<{ $component }>` န့ၣ် state variable nearestPoint တအိၣ်ဘၣ်အဃိ constrain တန့ၢ်ဘၣ်။

constrain-to-interior-without-nearest-point = `<{ $component }>` န့ၣ် state variable nearestPoint တအိၣ်ဘၣ်အဃိ အပူၤ ဆူ constrain တန့ၢ်ဘၣ်။

## `<choiceInput>`

choice-input-label-position-ignored = inline တမ့ၢ်ဘၣ်သော choiceInput အဂီၢ် labelPosition တစူးကါဘၣ်

## Ordering children by index

choice-input-indices-count-mismatch = indices အနီၣ်ဂံၢ် ဒီး choice ဖိ အနီၣ်ဂံၢ် တဘၣ်လိာ်ဘၣ်အဃိ choiceInput အဂီၢ် indices လၢပာ်ပနီၣ်ဝဲန့ၣ် တစူးကါဘၣ်။

pretzel-indices-count-mismatch = indices အနီၣ်ဂံၢ် ဒီး problem ဖိ အနီၣ်ဂံၢ် တဘၣ်လိာ်ဘၣ်အဃိ problem အဂီၢ် indices လၢပာ်ပနီၣ်ဝဲန့ၣ် တစူးကါဘၣ်။

shuffle-indices-count-mismatch = indices အနီၣ်ဂံၢ် ဒီး component အနီၣ်ဂံၢ် တဘၣ်လိာ်ဘၣ်အဃိ shuffle အဂီၢ် indices လၢပာ်ပနီၣ်ဝဲန့ၣ် တစူးကါဘၣ်။

indices-ignored-out-of-range = index တနီၤ လဲၤကပာ်ကွံာ်အဆူၣ်အဃိ { $component } အဂီၢ် indices လၢပာ်ပနီၣ်ဝဲန့ၣ် တစူးကါဘၣ်။

pretzel-indices-repeated = index တနီၤ ဟဲက့ၤအါဘျီအဃိ pretzel အဂီၢ် indices လၢပာ်ပနီၣ်ဝဲန့ၣ် တစူးကါဘၣ်။

pretzel-circuit-first-index = index အခီၣ်ထံး ကဘၣ်မ့ၢ် 1 အဃိ circuit mode အပူၤ pretzel အဂီၢ် indices လၢပာ်ပနီၣ်ဝဲန့ၣ် တစူးကါဘၣ်။

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` န့ၣ် string ဖိ ဒီး မၤတၢ်ကန့ၢ်အဂီၢ် attribute `type` ကဘၣ်ပာ်ပနီၣ်ဝဲ လီၤ။

invalid-type-defaulting-to-math = component { $component } အဂီၢ် type { $type } တဘၣ်ဘၣ်။ ကဘၣ်မ့ၢ် math, text, number မ့တမ့ၢ် boolean လီၤ။ math န့ၣ် default ဒ်အသိး စူးကါဝဲ လီၤ။

string-not-valid-component-to-arrange = string "{ $value }" န့ၣ် { $component } မၤအဂီၢ် component လၢအဘၣ် တမ့ၢ်ဘၣ်။ တစူးကါဘၣ်။

## Types and variables

invalid-type-defaulting-to-number = type { $type } တဘၣ်ဘၣ်၊ type န့ၣ် number ပာ်ဝဲ လီၤ။

invalid-variable-value = variable အတၢ်လုၢ်ပှ့ၤ တဘၣ်ဘၣ်: `{ $value }`

## Variants

variant-index-must-be-number = variant index { $index } ကဘၣ်မ့ၢ် number

variant-index-must-be-integer = variant index { $index } ကဘၣ်မ့ၢ် integer

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` န့ၣ် တၢ်ထိၣ်လၢအလီၢ်ဂၢၢ် အဂီၢ် တမၤဒံးဘၣ်။ width န့ၣ် relative ပာ်ဝဲ လီၤ။

side-by-side-absolute-margins = `<{ $component }>` န့ၣ် တၢ်ထိၣ်လၢအလီၢ်ဂၢၢ် အဂီၢ် တမၤဒံးဘၣ်။ margin န့ၣ် relative ပာ်ဝဲ လီၤ။

side-by-side-no-block-child = `<{ $component }>` တဘၣ်ဘၣ်: block ဖိ အစှၤကတၢၢ် တခါ ကဘၣ်အိၣ် လီၤ။

## `<label>`

label-for-ignored-on-graphical = တၢ်ဂီၤ `<label>` အလိၤ attribute `for` န့ၣ် တစူးကါဘၣ်။

label-for-must-resolve-to-one = `<label>` အလိၤ attribute `for` န့ၣ် component တခါဧိၤ ကဘၣ်ဒုးနဲၣ် လီၤ။

label-for-unresolved = `<label>` အလိၤ attribute `for` န့ၣ် component တဒုးနဲၣ်န့ၢ်ဘၣ်။

label-for-answer-with-authored-inputs = `<label>` အလိၤ attribute `for` န့ၣ် input လၢပှၤကွဲးတၢ်ပာ်ဝဲအိၣ်သော `<answer>` ဆူညါ ဒုးနဲၣ်ဝဲ လီၤ; input န့ၣ် လိၤလိၤ ဒုးနဲၣ်တက့ၢ်။

label-for-answer-without-input = `<label>` အလိၤ attribute `for` န့ၣ် label အဂီၢ် input တအိၣ်ဘၣ်သော `<answer>` ဆူညါ ဒုးနဲၣ်ဝဲ လီၤ။

label-for-must-reference-input-or-answer = `<label>` အလိၤ attribute `for` န့ၣ် input မ့တမ့ၢ် answer ကဘၣ်ဒုးနဲၣ် လီၤ။

## Accessibility

accessibility-short-description-or-decorative = accessibility အဂီၢ် `<{ $component }>` န့ၣ် တၢ်ကတိၤဖုၣ်ကိာ်တခါ ကဘၣ်အိၣ် မ့တမ့ၢ် decorative ကဘၣ်ပာ်ပနီၣ် လီၤ။

accessibility-video-short-description = accessibility အဂီၢ် `<video>` န့ၣ် တၢ်ကတိၤဖုၣ်ကိာ်တခါ ကဘၣ်အိၣ် လီၤ။

accessibility-input-short-description-or-label = accessibility အဂီၢ် `<{ $component }>` န့ၣ် တၢ်ကတိၤဖုၣ်ကိာ် မ့တမ့ၢ် label ကဘၣ်အိၣ် လီၤ။

accessibility-answer-input-short-description-or-label = accessibility အဂီၢ် input ဒုးအိၣ်ထီၣ်သော `<answer>` န့ၣ် တၢ်ကတိၤဖုၣ်ကိာ် မ့တမ့ၢ် label ကဘၣ်အိၣ် လီၤ။

accessibility-short-description-contains-math = တၢ်ကတိၤဖုၣ်ကိာ် အပူၤ `<{ $component }>` ဒ်သိးသော math component တဘၣ်အိၣ်ဘၣ်။ math န့ၣ် တၢ်ကတိၤ လၢကွဲးဖျါထီၣ်တက့ၢ်။

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } န့ၣ် တၢ်ကူာ် ခိၣ်တီ text အဂီၢ် contrast တလၢဘၣ် (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; အစှၤကတၢၢ် { $threshold }:1 ကဘၣ်အိၣ်)။
       *[other] { $colorName } န့ၣ် တၢ်ကူာ် ခိၣ်တီ text အဂီၢ် contrast တလၢဘၣ် ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; အစှၤကတၢၢ် { $threshold }:1 ကဘၣ်အိၣ်)။
    }

## `<circle>`

circle-through-points-non-numerical = အမှတ် တအိၣ်ဒီး နီၣ်ဂံၢ်တၢ်လုၢ်ပှ့ၤဘၣ်အခါ အမှတ် { $count } ခါ လဲၤခီဖျိသော `<circle>` န့ၣ် တမၤဒံးဘၣ်။

circle-too-many-through-points = အမှတ် အါန့ၢ် 3 ခါ လဲၤခီဖျိသော စက်ဝိုင်း န့ၣ် ဂံၢ်ထုးထီၣ် တန့ၢ်ဘၣ်။

circle-overprescribed-radius-center-points = radius, center ဒီး through point သၢခါလိာ် ပာ်ပနီၣ်ဝဲသော စက်ဝိုင်း န့ၣ် ဂံၢ်ထုးထီၣ် တန့ၢ်ဘၣ်။

circle-center-with-multiple-points = center ပာ်ပနီၣ်ဝဲဒီး အမှတ် အါန့ၢ် 1 ခါ လဲၤခီဖျိသော စက်ဝိုင်း န့ၣ် ဂံၢ်ထုးထီၣ် တန့ၢ်ဘၣ်။

circle-radius-too-small = စက်ဝိုင်း ဂံၢ်ထုးထီၣ် တန့ၢ်ဘၣ်: အမှတ် ခံခါအဘၢၣ်စၢၤ အယံၤ မ့ၢ် { $distance } အဃိ radius လၢပာ်ပနီၣ်ဝဲ { $radius } န့ၣ် ဆံးကဲၣ်ဆိး လီၤ။

circle-radius-with-many-points = radius ပာ်ပနီၣ်ဝဲဒီး အမှတ် အါန့ၢ် ခံခါ လဲၤခီဖျိသော စက်ဝိုင်း န့ၣ် ဒုးအိၣ်ထီၣ် တန့ၢ်ဘၣ်။

circle-invalid-center-or-through-points = စက်ဝိုင်း အ center မ့တမ့ၢ် through point တဘၣ်ဘၣ်။

circle-radius-center-with-multiple-points = center ပာ်ပနီၣ်ဝဲဒီး အမှတ် အါန့ၢ် 1 ခါ လဲၤခီဖျိသော စက်ဝိုင်း အ radius န့ၣ် ဂံၢ်ထုးထီၣ် တန့ၢ်ဘၣ်။

circle-change-radius-non-numerical = through point တအိၣ်ဒီး နီၣ်ဂံၢ်တၢ်လုၢ်ပှ့ၤဘၣ်သော စက်ဝိုင်း အ radius န့ၣ် ဆီတလဲ တန့ၢ်ဘၣ်

circle-radius-with-points-non-numerical = နီၣ်ဂံၢ်တၢ်လုၢ်ပှ့ၤ တအိၣ်ဘၣ်အခါ radius ပာ်ပနီၣ်ဝဲဒီး အမှတ် အါန့ၢ် တခါ လဲၤခီဖျိသော စက်ဝိုင်း န့ၣ် ဒုးအိၣ်ထီၣ် တန့ၢ်ဘၣ်။

circle-change-center-non-numerical = နီၣ်ဂံၢ်တၢ်လုၢ်ပှ့ၤ တအိၣ်ဘၣ်သော အမှတ် လဲၤခီဖျိသော စက်ဝိုင်း အ center ဆီတလဲ န့ၣ် တမၤဒံးဘၣ်။

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] function အဂီၢ် domain အ dimension တလၢဘၣ်။ domain န့ၣ် interval { $intervals } ခါ အိၣ်ဘၣ်ဆၣ် function န့ၣ် input { $inputs } ခါ အိၣ်ဝဲ လီၤ။
    }

function-domain-invalid-format = function အဂီၢ် domain အကျဲ တဘၣ်ဘၣ်။

function-ignoring-non-numerical =
    { $type ->
        [maximum] function အ maximum လၢအတမ့ၢ်နီၣ်ဂံၢ်န့ၣ် တစူးကါဘၣ်။
        [minimum] function အ minimum လၢအတမ့ၢ်နီၣ်ဂံၢ်န့ၣ် တစူးကါဘၣ်။
        [extremum] function အ extremum လၢအတမ့ၢ်နီၣ်ဂံၢ်န့ၣ် တစူးကါဘၣ်။
        [point] function အ အမှတ် လၢအတမ့ၢ်နီၣ်ဂံၢ်န့ၣ် တစူးကါဘၣ်။
        [slope] function အ slope လၢအတမ့ၢ်နီၣ်ဂံၢ်န့ၣ် တစူးကါဘၣ်။
       *[other] function အ { $type } လၢအတမ့ၢ်နီၣ်ဂံၢ်န့ၣ် တစူးကါဘၣ်။
    }

function-ignoring-empty =
    { $type ->
        [maximum] function အ maximum လၢအအိၣ်ကလီန့ၣ် တစူးကါဘၣ်။
        [minimum] function အ minimum လၢအအိၣ်ကလီန့ၣ် တစူးကါဘၣ်။
        [extremum] function အ extremum လၢအအိၣ်ကလီန့ၣ် တစူးကါဘၣ်။
        [point] function အ အမှတ် လၢအအိၣ်ကလီန့ၣ် တစူးကါဘၣ်။
       *[other] function အ { $type } လၢအအိၣ်ကလီန့ၣ် တစူးကါဘၣ်။
    }

function-points-too-close = function အပူၤ အမှတ် ခံခါ အလီၢ် ဘူးကဲၣ်ဆိး လီၤ။ function ပာ်ပနီၣ် တန့ၢ်ဘၣ်။

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] function iterate န့ၣ် function အ input အနီၣ်ဂံၢ် ဒီး output အနီၣ်ဂံၢ် ဘၣ်လိာ်မှ ကဲထီၣ်သ့ လီၤ။ function အံၤ န့ၣ် input { $inputs } ခါ ဒီး output { $outputs } ခါ အိၣ်ဝဲ လီၤ။
    }

## `<sequence>`

sequence-invalid-length = sequence အ length တဘၣ်ဘၣ်။ ကဘၣ်မ့ၢ် integer လၢအတဆံးန့ၢ် သုည လီၤ။

sequence-invalid-step = sequence အ step တဘၣ်ဘၣ်။ sequence type { $type } အဂီၢ် ကဘၣ်မ့ၢ် number လီၤ။

sequence-invalid-endpoint-number = number sequence အ "{ $attribute }" တဘၣ်ဘၣ်။ ကဘၣ်မ့ၢ် number လီၤ။

sequence-invalid-endpoint-letters = letters sequence အ "{ $attribute }" တဘၣ်ဘၣ်။ ကဘၣ်မ့ၢ် လံာ်မဲာ်ဖျၢၣ် လၢအဘၣ်ဟူးဘၣ်ဂဲၤ လီၤ။

sequence-invalid-endpoint = sequence အ "{ $attribute }" တဘၣ်ဘၣ်။

select-from-sequence-coprime-not-numbers = number တဃုထၢဘၣ်အဃိ coprime တစူးကါဘၣ်

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations ပာ်ပနီၣ်ဝဲအဃိ coprime တစူးကါဘၣ်

## Resolving a `target`

target-not-found = `<{ $source }>` အဂီၢ် target တဘၣ်ဘၣ်: target တထံၣ်ဘၣ်။

target-state-variable-not-found = `<{ $source }>` အဂီၢ် target တဘၣ်ဘၣ်: `<{ $component }>` အလိၤ state variable အမံၤ "{ $property }" တထံၣ်ဘၣ်။

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` အ variable န့ၣ် independent variable ဒီး ကဘၣ်လီၤဆီ လီၤ။

ode-system-duplicate-variable-names = dependent variable အမံၤ ဒ်သိးသိး အိၣ်ဝဲန့ၣ် ODE RHS function ပာ်ပနီၣ် တန့ၢ်ဘၣ်။

ode-system-rhs-function-error = ODE RHS function ပာ်ပနီၣ် တန့ၢ်ဘၣ်။ mathjs function ဒုးအိၣ်ထီၣ်အခါ တၢ်ကမၣ် အိၣ်ထီၣ်ဝဲ လီၤ။

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = မျဉ်း { $count } ဘိ အဘၢၣ်စၢၤ ထောင့် ပာ်ပနီၣ် တန့ၢ်ဘၣ်

angle-invalid-through-point = `<angle>` အ through အပူၤ အမှတ် တဘၣ်ဘၣ်

parabola-vertex-too-many-points = vertex အိၣ်ဒီး အမှတ် အါန့ၢ် 1 ခါ လဲၤခီဖျိသော parabola န့ၣ် တမၤဒံးဘၣ်။

parabola-too-many-points = အမှတ် အါန့ၢ် 3 ခါ လဲၤခီဖျိသော parabola န့ၣ် တမၤဒံးဘၣ်။

intersection-too-many-items = တၢ်ဂ့ၢ် အါန့ၢ် ခံခါ အဂီၢ် intersection န့ၣ် တမၤဒံးဘၣ်

## Other math components

ionic-compound-not-two-ions = ion ခံခါ အဂၤ အဂီၢ် ionic compound န့ၣ် တမၤဒံးဘၣ်။

ionic-compound-needs-cation-and-anion = ionic compound န့ၣ် cation တခါ ဒီး anion တခါ အဂီၢ်ဧိၤ မၤဝဲ လီၤ။

solve-equations-cannot-evaluate = equation ဂံၢ်ထုးထီၣ် တန့ၢ်ဘၣ်အဃိ equation ဖးဆၢ တန့ၢ်ဘၣ်: { $equation }

math-operators-operand-number-required = math operand ထုးထီၣ်အခါ operandNumber ကဘၣ်ပာ်ပနီၣ် လီၤ။

eigen-decomposition-failed = matrix အ eigenvalue ဂံၢ်ထုးထီၣ် တန့ၢ်ဘၣ်

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: parameter { $parameters } န့ၣ် pattern အပူၤ တအိၣ်ဘၣ်အဃိ လီၢ်အိၣ်ကလီ ဒီး ထီဘိ ဘၣ်လိာ်ကွာ်ဒီး လီၤ။
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" န့ၣ် နၢ်ပၢၢ် တန့ၢ်ဘၣ်။ ကဘၣ်မ့ၢ် none, medium, dense မ့တမ့ၢ် number လၢအအါန့ၢ်သုည ခံခါ လၢအိၣ်ဒီးလီၢ်လၢအကျါ ဒ်သိး grid="1 0.5" လီၤ။ grid တဒုးအိၣ်ထီၣ်ဘၣ်။

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` န့ၣ် { $expected ->
        [1] output တခါ, အမှတ် ကိးခါ အလိၤ slope y', ဒ်သိး `y - x`
       *[other] output ခံခါ, အမှတ် ကိးခါ အလိၤ vector, ဒ်သိး `(y, -x)`
    } အိၣ်သော function လိၣ်ဘၣ်ဝဲ, ဘၣ်ဆၣ် function လၢဟ့ၣ်လီၤဝဲန့ၣ် output { $found } ခါ အိၣ်ဝဲ လီၤ။ { $alternative ->
        [none] တၢ်နီတမံၤ တဒုးအိၣ်ထီၣ်ဘၣ်။
       *[other] function န့ၣ်အဂီၢ် `<{ $alternative }>` မ့ၢ် component လီၤ။ တၢ်နီတမံၤ တဒုးအိၣ်ထီၣ်ဘၣ်။
    }

field-function-attribute-ignored-with-child = function န့ၣ် component အပူၤစ့ၢ်ကီး ဟ့ၣ်လီၤဝဲအဃိ attribute `function` တစူးကါဘၣ်; အပူၤအဝဲန့ၣ် စူးကါဝဲ လီၤ။ function န့ၣ် ကျဲတဘိဧိၤ ဟ့ၣ်လီၤတက့ၢ်။

field-variables-ignored =
    `<{ $component }>`: attribute `variables` န့ၣ် component အပူၤ လိၤလိၤ ကွဲးဝဲသော expression အ variable ဒုးနဲၣ်ဝဲ လီၤ။ { $reason ->
        [function-child] လၢအံၤ function န့ၣ် `<function>` ဖိ ဒ်အသိး ဟ့ၣ်လီၤဝဲ ဒီး အဝဲန့ၣ် အ variable ဒၣ်ဝဲ ဒုးနဲၣ်ဝဲအဃိ `variables` တစူးကါဘၣ်။
       *[no-expression] လၢအံၤ expression ဒ်သိးအံၤ တအိၣ်ဘၣ်အဃိ `variables` တစူးကါဘၣ်။
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure renderer အပူၤ xLabelPosition="left" စူးကါ တန့ၢ်ဘၣ်; right-position အကျဲ စူးကါဝဲ လီၤ။

prefigure-y-label-position-unsupported = `<graph>`: prefigure renderer အပူၤ yLabelPosition="bottom" စူးကါ တန့ၢ်ဘၣ်; top-position အကျဲ စူးကါဝဲ လီၤ။

prefigure-invalid-axis-bounds = `<graph>`: prefigure အဂီၢ် axis bound တဘၣ်ဘၣ်; default bbox (-10,-10,10,10) စူးကါဝဲ လီၤ။

prefigure-invalid-width = `<graph>`: prefigure အဂီၢ် width တဘၣ်ဘၣ်; default width 425 စူးကါဝဲ လီၤ။

prefigure-invalid-aspect-ratio = `<graph>`: prefigure အဂီၢ် aspectRatio တဘၣ်ဘၣ်; default aspect ratio 1 စူးကါဝဲ လီၤ။

prefigure-grid-spacing-too-fine = `<graph>`: axis အဆၢ အဂီၢ် grid အဘၢၣ်စၢၤ ဆံးကဲၣ်ဆိး; prefigure renderer အပူၤ grid တဒုးအိၣ်ထီၣ်ဘၣ်။

prefigure-annotations-not-rendered = `<graph>`: PreFigure renderer တစူးကါဘၣ်အခါ annotation တဒုးအိၣ်ထီၣ်ဘၣ်။

multiple-annotations-children = `<graph>` အပူၤ `<annotations>` ဖိ အါခါ ထံၣ်န့ၢ်ဝဲ; လၢခံကတၢၢ်တခါဧိၤ စူးကါဝဲ လီၤ။

## Referring to other components

copy-unrecognized-component-type = component type လၢတသ့ၣ်ညါဘၣ်န့ၣ် extend မ့တမ့ၢ် copy တန့ၢ်ဘၣ်: { $type }။

copy-prop-not-found = component type { $component } အလိၤ prop { $property } တထံၣ်ဘၣ်

collect-no-source = collect အဂီၢ် source တထံၣ်ဘၣ်။

collect-invalid-component-type = component type `<{ $component }>` န့ၣ် တဘၣ်ဘၣ်အဃိ collect တန့ၢ်ဘၣ်။

reference-index-unavailable = index `{ $reference }` ဒုးနဲၣ် တန့ၢ်ဘၣ်

## `<callAction>`

component-action-unavailable = component `{ $reference }` အလိၤ { $action } ကိး တန့ၢ်ဘၣ်

## `<dataFrame>`

data-frame-inconsistent-row-lengths = data အကျဲ တဘၣ်ဘၣ်။ row အထီ တဒ်သိးလိာ်ဘၣ်။ componentIdx :{ $componentIdx } အပူၤ ထံၣ်န့ၢ်ဝဲ

data-frame-duplicate-column-names = data အပူၤ column အမံၤ ဒ်သိးသိး အိၣ်ဝဲ။ componentIdx :{ $componentIdx } အပူၤ ထံၣ်န့ၢ်ဝဲ

data-frame-missing-column-name = data အပူၤ column အမံၤ တခါ တအိၣ်ဘၣ်။ componentIdx :{ $componentIdx } အပူၤ ထံၣ်န့ၢ်ဝဲ

## `<answer>` and scoring

answer-award-depends-on-own-response = answer အံၤအ award န့ၣ် answer tag ဒၣ်ဝဲ အတၢ်စံးဆၢ လၢဆှၢထီၣ်ဝဲအလိၤ ဒိးသန့ၤထီၣ်အသးအဃိ တၢ်လၢတမုၢ်လၢ်ဘၣ် ကကဲထီၣ် လီၤ။

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` အိၣ်သော container အပူၤ `<answer>` အလိၤ `maxNumAttempts` ပာ်ဝဲန့ၣ် တမၤတၢ်နီတမံၤဘၣ်၊ ဘျီအနီၣ်ဂံၢ်န့ၣ် container ဟံးဃာ်ဝဲအဃိ လီၤ။ `maxNumAttempts` န့ၣ် container အလိၤ ပာ်တက့ၢ်။

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` အိၣ်သော container အဂၤအပူၤ အိၣ်သော `sectionWideCheckWork` container အလိၤ `maxNumAttempts` ပာ်ဝဲန့ၣ် တမၤတၢ်နီတမံၤဘၣ်၊ ဘျီအနီၣ်ဂံၢ်န့ၣ် ချၢတခီ container ဟံးဃာ်ဝဲအဃိ လီၤ။ `maxNumAttempts` န့ၣ် ချၢတခီ container အလိၤ ပာ်တက့ၢ်။

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] symbolicEquality တပာ်ဘၣ်န့ၣ် attribute { $attributes } တမၤတၢ်နီတမံၤဘၣ်။
    }

answer-invalid-type = answer အဂီၢ် type တဘၣ်ဘၣ်: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = component `<{ $component }>` န့ၣ် အမံၤ တအိၣ်ဘၣ်အဃိ module အ attribute ဒ်အသိး စူးကါ တန့ၢ်ဘၣ်

module-attribute-name-already-defined = component type `<module>` န့ၣ် attribute "{ $name }" ပာ်ပနီၣ်ဝဲလံအဃိ component `<{ $component } name="{ $name }">` န့ၣ် module အ attribute ဒ်အသိး စူးကါ တန့ၢ်ဘၣ်။

conditional-content-condition-ignored = case မ့တမ့ၢ် else ဖိ အိၣ်သော `<conditionalContent>` အလိၤ attribute `condition` တစူးကါဘၣ်။

slider-markers-type-mismatch = marker အ type ဒီး slider အ type တဘၣ်လိာ်ဘၣ်။

pretzel-problem-needs-statement-and-answer = pretzel တဘၣ်ဘၣ်: `<problem>` ကိးခါ န့ၣ် `<statement>` တခါ ဒီး `<answer>` တခါ ကဘၣ်အိၣ် လီၤ။

pretzel-circuit-first-problem-distractor = pretzel တဘၣ်ဘၣ်: mode="circuit" အပူၤ `<problem>` အခီၣ်ထံး န့ၣ် distractor ကဲ တန့ၢ်ဘၣ်။

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] attribute `{ $attribute }` အဂီၢ် တၢ်လုၢ်ပှ့ၤ { $values } တဘၣ်ဘၣ်; တစူးကါဘၣ်။
    }

attribute-must-be-references = attribute `{ $attribute }` အဂီၢ် တၢ်လုၢ်ပှ့ၤ `{ $value }` တဘၣ်ဘၣ်။ attribute န့ၣ် `$` ဒီးစးထီၣ်သော reference တဖၣ် ကဘၣ်မ့ၢ် လီၤ။

math-input-invalid-function-names = <mathInput>: { $attribute } အပူၤ function အမံၤ လၢအတဘၣ်ဘၣ်န့ၣ် တစူးကါဘၣ်: { $names }။ မံၤကိးခါ အဒုးနဲၣ်အကူာ် န့ၣ် အစှၤကတၢၢ် 2 ဖျၢၣ် (လံာ်မဲာ်ဖျၢၣ် မ့တမ့ၢ် ဘီၣ်ထူၣ်) ကဘၣ်အိၣ်; လၢခံ `|<mathspeak alternative>` န့ၣ် ပာ်ဂ့ၤ တပာ်ဂ့ၤ လီၤ။

## Building components from the source

component-type-invalid = component type တဘၣ်ဘၣ်: `<{ $componentType }>`

attribute-repeated = attribute { $attribute } ကွဲးကဒီးတဘျီ တန့ၢ်ဘၣ်။

attribute-invalid-for-component = component type `<{ $componentType }>` အဂီၢ် attribute "{ $attribute }" တဘၣ်ဘၣ်။

## Style definition contrast

style-definition-insufficient-contrast =
    style definition { $styleNumber } န့ၣ် { $context ->
        [text-on-background] background အလွဲၢ် ဒီး text အလွဲၢ်
        [high-contrast] canvas ဒီး high-contrast အလွဲၢ်
        [line] canvas ဒီး မျဉ်း အလွဲၢ်
        [marker] canvas ဒီး marker အလွဲၢ်
       *[text-on-canvas] canvas ဒီး text အလွဲၢ်
    } အဂီၢ် contrast တလၢဘၣ်{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; အစှၤကတၢၢ် { $threshold }:1 ကဘၣ်အိၣ်)။

style-definition-dark-mode-text-background-contrast =
    style definition { $styleNumber } န့ၣ် light mode အဂီၢ် contrast လၢဝဲသော အလွဲၢ် ပာ်ပနီၣ်ဝဲဘၣ်ဆၣ်, အဝဲန့ၣ်အပူၤ ဟဲထီၣ်သော dark mode အလွဲၢ် န့ၣ် background အလွဲၢ် ဒီး text အလွဲၢ် အဂီၢ် contrast တလၢဘၣ် ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; အစှၤကတၢၢ် { $threshold }:1 ကဘၣ်အိၣ်)။ { $suggestion ->
        [available] dark mode အပူၤ contrast လၢဝဲအဂီၢ် light mode အ contrast အါထီၣ်တက့ၢ် (ဒ်သိး { $lightAttribute }="{ $lightColor }" ပာ်) မ့တမ့ၢ် dark mode အလွဲၢ် ဆီတလဲပာ်တက့ၢ် (ဒ်သိး { $darkAttribute }="{ $darkColor }" ပာ်)။
       *[none] dark mode အပူၤ contrast လၢဝဲအဂီၢ် light mode အ contrast အါထီၣ်တက့ၢ် မ့တမ့ၢ် ဟဲထီၣ်သော အလွဲၢ် န့ၣ် textColorDarkMode ဒီး/မ့တမ့ၢ် backgroundColorDarkMode ဒီး ဆီတလဲပာ်တက့ၢ်။
    }

style-definition-dark-mode-text-canvas-contrast =
    style definition { $styleNumber } န့ၣ် light mode အဂီၢ် contrast လၢဝဲသော text အလွဲၢ် ပာ်ပနီၣ်ဝဲဘၣ်ဆၣ်, အဝဲန့ၣ်အပူၤ ဟဲထီၣ်သော dark mode text အလွဲၢ် န့ၣ် canvas ဒီး contrast တလၢဘၣ် ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; အစှၤကတၢၢ် { $threshold }:1 ကဘၣ်အိၣ်)။ { $suggestion ->
        [available] dark mode အပူၤ contrast လၢဝဲအဂီၢ် light mode အ contrast အါထီၣ်တက့ၢ် (ဒ်သိး textColor="{ $lightColor }" ပာ်) မ့တမ့ၢ် dark mode အလွဲၢ် ဆီတလဲပာ်တက့ၢ် (ဒ်သိး textColorDarkMode="{ $darkColor }" ပာ်)။
       *[none] dark mode အပူၤ contrast လၢဝဲအဂီၢ် light mode အ contrast အါထီၣ်တက့ၢ် မ့တမ့ၢ် ဟဲထီၣ်သော အလွဲၢ် န့ၣ် textColorDarkMode ဒီး ဆီတလဲပာ်တက့ၢ်။
    }

section-multiple-style-palettes = တၢ်ကူာ်တခါ န့ၣ် <stylePalette> တခါဧိၤ ဃုထၢသ့; လၢခံကတၢၢ်တခါ စူးကါဝဲ လီၤ။

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect န့ၣ် integer လၢအတဆံးန့ၢ်သုည တမ့ၢ်ဘၣ်အဃိ { $component } အ unique variant ပာ်ပနီၣ် တန့ၢ်ဘၣ်။

variant-num-to-select-not-constant-number = numToSelect န့ၣ် number လၢအလီၢ်ဂၢၢ် တမ့ၢ်ဘၣ်အဃိ { $component } အ unique variant ပာ်ပနီၣ် တန့ၢ်ဘၣ်။

variant-with-replacement-not-constant-boolean = withReplacement န့ၣ် boolean လၢအလီၢ်ဂၢၢ် တမ့ၢ်ဘၣ်အဃိ { $component } အ unique variant ပာ်ပနီၣ် တန့ၢ်ဘၣ်။

variant-select-weight-disables-unique = selectWeight မ့တမ့ၢ် selectForVariants ပာ်ပနီၣ်ဝဲသော option အိၣ်န့ၣ် select အဂီၢ် unique variant တဖၣ် ကးတံာ်ဃာ်ဝဲ လီၤ

variant-coprime-undetermined = coprime န့ၣ် ထီဘိ တမ့ၢ်ဘၣ် လၢပာ်ပနီၣ် တန့ၢ်ဘၣ်အဃိ { $component } အ unique variant ပာ်ပနီၣ် တန့ၢ်ဘၣ်။

variant-attribute-not-constant = { $attribute } န့ၣ် အလီၢ်ဂၢၢ် တမ့ၢ်ဘၣ်အဃိ { $component } အ unique variant ပာ်ပနီၣ် တန့ၢ်ဘၣ်။

variant-attribute-not-number = { $attribute } န့ၣ် number တမ့ၢ်ဘၣ်အဃိ { $component } အ unique variant ပာ်ပနီၣ် တန့ၢ်ဘၣ်။

variant-attribute-wrong-type-for-sequence =
    { $attribute } န့ၣ် { $expected ->
        [letters-combination] လံာ်မဲာ်ဖျၢၣ် လၢအဘၣ်ဟူးဘၣ်ဂဲၤ
        [math-expression] math expression လၢအဘၣ်
        [integer] integer
       *[number] number
    } တမ့ၢ်ဘၣ်အဃိ type { $type } အိၣ်သော { $component } အ unique variant ပာ်ပနီၣ် တန့ၢ်ဘၣ်။

variant-length-not-integer = length န့ၣ် integer တမ့ၢ်ဘၣ်အဃိ { $component } အ unique variant ပာ်ပနီၣ် တန့ၢ်ဘၣ်။

variant-sort-not-implemented = sort အိၣ်သော { $component } အ unique variant န့ၣ် တမၤဒံးဘၣ်

variant-exclude-combinations-not-implemented = excludeCombinations အိၣ်သော { $component } အ unique variant န့ၣ် တမၤဒံးဘၣ်

variant-math-exclude-not-implemented = exclude အိၣ်သော type math { $component } အ unique variant န့ၣ် တမၤဒံးဘၣ်

variant-non-constant-exclude-not-implemented = အလီၢ်ဂၢၢ်တမ့ၢ်ဘၣ်သော exclude အိၣ်သော { $component } အ unique variant န့ၣ် တမၤဒံးဘၣ်

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure renderer အပူၤ စူးကါ တန့ၢ်ဘၣ်; အစၢၤ ကပာ်ကွံာ်ဝဲ လီၤ။

prefigure-descendant-invalid-geometry = { $subject }: တၢ်ဒိအကျဲ တလၢဘၣ် မ့တမ့ၢ် တဘၣ်ဘၣ်; အစၢၤ ကပာ်ကွံာ်ဝဲ လီၤ။

prefigure-curve-label-omitted = { $subject }: လဲလိာ်ဝဲသော curve အလိၤ label စူးကါ တန့ၢ်ဘၣ်; label ကပာ်ကွံာ်ဝဲ လီၤ။

prefigure-curve-unsupported-definition-type = { $subject }: curve function definition type '{ $definitionType }' စူးကါ တန့ၢ်ဘၣ်; အစၢၤ ကပာ်ကွံာ်ဝဲ လီၤ။

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves အလိၤ attribute flipFunctions စူးကါ တန့ၢ်ဘၣ်; အစၢၤ ကပာ်ကွံာ်ဝဲ လီၤ။

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves အလိၤ formula type function ဖိဧိၤ စူးကါသ့; အစၢၤ ကပာ်ကွံာ်ဝဲ လီၤ။

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] line family အ label
       *[point] အမှတ် အ label
    } အဂီၢ် labelPosition '{ $labelPosition }' စူးကါ တန့ၢ်ဘၣ်; default PreFigure alignment စူးကါဝဲ လီၤ။

prefigure-fill-style-unsupported = { $subject }: fill style '{ $fillStyle }' န့ၣ် PreFigure စူးကါ တန့ၢ်ဘၣ်; fill လၢအပှဲၤ ဆူ က့ၤစူးကါဝဲ လီၤ။

prefigure-line-style-unknown = { $subject }: တသ့ၣ်ညါဘၣ်သော line style '{ $lineStyle }' န့ၣ် PreFigure output အပူၤ တပာ်ဃုာ်ဘၣ်။

prefigure-marker-style-mapped-to-diamond = { $subject }: marker style '{ $markerStyle }' န့ၣ် PreFigure style 'diamond' ဆူ လဲလိာ်ဝဲ လီၤ။

prefigure-marker-style-unsupported = { $subject }: marker style '{ $markerStyle }' န့ၣ် PreFigure စူးကါ တန့ၢ်ဘၣ်; default style စူးကါဝဲ လီၤ။

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` တဘၣ်ဘၣ်; target ဒုးနဲၣ် တန့ၢ်ဘၣ်။ annotation ကပာ်ကွံာ်ဝဲ လီၤ။

annotation-ref-multiple-targets = `<annotation>`: `ref` န့ၣ် target အါခါ ဒုးနဲၣ်ဝဲ; target အခီၣ်ထံး စူးကါဝဲ လီၤ။

annotation-ref-outside-graph = `<annotation>`: `ref` တဘၣ်ဘၣ်; target န့ၣ် graph အချၢ အိၣ်ဝဲ လီၤ။ annotation ကပာ်ကွံာ်ဝဲ လီၤ။

annotation-ref-unsupported-target = `<annotation>`: `ref` တဘၣ်ဘၣ်; target န့ၣ် prefigure အပူၤ စူးကါသ့သော တၢ်ဂီၤ တမ့ၢ်ဘၣ်။ annotation ကပာ်ကွံာ်ဝဲ လီၤ။

annotation-text-missing = `<annotation>`: `text` တအိၣ်ဘၣ် မ့တမ့ၢ် အိၣ်ကလီ; text အိၣ်ကလီ ထုးထီၣ်ဝဲ လီၤ။

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] circular dependency ထံၣ်န့ၢ်ဝဲ လီၤ။
       *[other] component `<{ $componentType }>` ဒီး ဘၣ်ထွဲသော circular dependency ထံၣ်န့ၢ်ဝဲ လီၤ။
    }

reference-no-referent = reference အဂီၢ် တၢ်လၢအဘၣ်ထွဲ တထံၣ်ဘၣ်: `{ $reference }`

reference-multiple-referents = reference အဂီၢ် တၢ်လၢအဘၣ်ထွဲ အါခါ ထံၣ်န့ၢ်ဝဲ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` အ attribute { $attribute } အကျဲ တဘၣ်ဘၣ်။

children-invalid = `<{ $componentType }>` အဂီၢ် ဖိ တဘၣ်ဘၣ်: ဖိ လၢအတဘၣ်ဘၣ် ထံၣ်န့ၢ်ဝဲ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = attribute `{ $attribute }` အဂီၢ် တၢ်လုၢ်ပှ့ၤ `{ $value }` တဘၣ်ဘၣ်၊ တၢ်လုၢ်ပှ့ၤ `{ $default }` စူးကါဝဲ လီၤ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML version { $version } တထံၣ်ဘၣ်။
       *[other] DoenetML version { $version } တထံၣ်ဘၣ်။ version { $fallback } ဆူ က့ၤစူးကါဝဲ လီၤ
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML တဘၣ်ဘၣ်: { $content }

parse-tag-missing-close-tag = DoenetML တဘၣ်ဘၣ်: tag `{ $tag }` န့ၣ် ကးတံာ် tag တအိၣ်ဘၣ်။ ကဘၣ်မ့ၢ် tag လၢအကးတံာ်လီၤအသး မ့တမ့ၢ် `</{ $tagName }>` tag လီၤ။

parse-tag-error = DoenetML တဘၣ်ဘၣ်: tag `<{ $tagName }>` အပူၤ တၢ်ကမၣ်

parse-attribute-missing-value = DoenetML တဘၣ်ဘၣ်: attribute `{ $attribute }` လၢအတဘၣ်ဘၣ်န့ၣ် တၢ်လုၢ်ပှ့ၤ တအိၣ်ဘၣ် လီၤ။

parse-attribute-invalid = DoenetML တဘၣ်ဘၣ်: attribute `{ $attribute }` တဘၣ်ဘၣ်

parse-attribute-value-invalid = DoenetML တဘၣ်ဘၣ်: attribute အတၢ်လုၢ်ပှ့ၤ `{ $value }` တဘၣ်ဘၣ်

parse-attribute-value-quote-mismatch = DoenetML တဘၣ်ဘၣ်: attribute အတၢ်လုၢ်ပှ့ၤ `{ $value }` တဘၣ်ဘၣ်။ တၢ်ကတိၤပနီၣ် တဘၣ်လိာ်ဘၣ်။ `{ $quote }` တအိၣ်ဘၣ် လီၤ

parse-open-tag-name-missing = DoenetML တဘၣ်ဘၣ်: tag အမံၤ တအိၣ်ဘၣ်သော tag ထံၣ်န့ၢ်ဝဲ, ဒ်သိး `<`

parse-tag-not-closed = DoenetML တဘၣ်ဘၣ်: tag `{ $tag }` တကးတံာ်ဘၣ် (`>` တအိၣ်ဘၣ်)။

parse-self-closing-tag-name-missing = DoenetML တဘၣ်ဘၣ်: tag အမံၤ တအိၣ်ဘၣ်သော tag ထံၣ်န့ၢ်ဝဲ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML တဘၣ်ဘၣ်: tag `{ $tag }` တကးတံာ်ဘၣ် (`/>` တအိၣ်ဘၣ်)။

parse-tag-invalid-attributes = DoenetML တဘၣ်ဘၣ်: tag `{ $tag }` တဘၣ်ဘၣ်။ attribute ကမၣ်ဝဲ ဘၣ်သ့ၣ်သ့ၣ် လီၤ။

parse-close-tag-name-missing = DoenetML တဘၣ်ဘၣ်: tag အမံၤ တအိၣ်ဘၣ်သော ကးတံာ် tag ထံၣ်န့ၢ်ဝဲ, ဒ်သိး `</`

parse-attribute-value-unquoted = attribute အတၢ်လုၢ်ပှ့ၤ န့ၣ် တၢ်ကတိၤပနီၣ် အပူၤ ကဘၣ်ပာ်: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML တဘၣ်ဘၣ်: ကးတံာ် tag `{ $tag }` ထံၣ်န့ၢ်ဝဲဘၣ်ဆၣ် အိးထီၣ် tag လၢအဘၣ်ထွဲ တအိၣ်ဘၣ်

parse-close-tag-mismatched = DoenetML တဘၣ်ဘၣ်: ကးတံာ် tag တဘၣ်လိာ်ဘၣ်။ ကဘၣ်မ့ၢ် `</{ $expected }>` လီၤ။ `{ $found }` ထံၣ်န့ၢ်ဝဲ

parser-node-unconvertible = node { $node } န့ၣ် Dast node ဆူ လဲလိာ် တန့ၢ်ဘၣ်။

## Names

name-attribute-invalid =
    attribute name='{ $name }' တဘၣ်ဘၣ်။ { $reason ->
        [characters] မံၤ န့ၣ် လံာ်မဲာ်ဖျၢၣ်, နီၣ်ဂံၢ်, ဘီၣ်ထူၣ်ဖီလာ် မ့တမ့ၢ် ဘီၣ်ထူၣ်ဧိၤ ပာ်ဃုာ်သ့ လီၤ။
       *[start] မံၤ န့ၣ် လံာ်မဲာ်ဖျၢၣ် ဒီး ကဘၣ်စးထီၣ် လီၤ။
    }

component-name-invalid-start = component အမံၤ "{ $name }" တဘၣ်ဘၣ်။ မံၤ န့ၣ် လံာ်မဲာ်ဖျၢၣ် ဒီး ကဘၣ်စးထီၣ် လီၤ။

## `<answer>` sugar

answer-video-watched-missing-video = type videoWatched အိၣ်သော answer န့ၣ် attribute video ကဘၣ်အိၣ်

answer-video-watched-video-not-reference = type videoWatched အိၣ်သော answer န့ၣ် reference မ့ၢ်သော attribute video ကဘၣ်အိၣ်

answer-name-not-single-text = answer အ attribute name န့ၣ် text ဖိ တခါဧိၤ ကဘၣ်အိၣ်

## Referencing another document

external-doenetml-recursion-limit = recursion အတီၤ အါကဲၣ်ဆိးအဃိ ချၢတခီ DoenetML ဟံးန့ၢ် တန့ၢ်ဘၣ်။ circular reference အိၣ်ဧါ။

external-doenetml-unavailable = { $attribute }="{ $uri }" အပူၤ DoenetML ဟံးန့ၢ် တန့ၢ်ဘၣ်

external-doenetml-type-mismatch = { $attribute }="{ $uri }" အပူၤ ဟံးန့ၢ်ဝဲသော DoenetML တဘၣ်ဘၣ်: component type "{ $componentType }" ဒီး တဘၣ်လိာ်ဘၣ်

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] attribute `{ $from }` န့ၣ် တစူးကါလၢၤဘၣ်; `{ $to }` စူးကါတက့ၢ်။
       *[other] [deprecation] `<{ $component }>` အလိၤ attribute `{ $from }` န့ၣ် တစူးကါလၢၤဘၣ်; `{ $to }` စူးကါတက့ၢ်။
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` စ့ၢ်ကီး ပာ်ပနီၣ်ဝဲအဃိ attribute `{ $from }` န့ၣ် တစူးကါလၢၤဘၣ် ဒီး တစူးကါဘၣ်။
       *[other] [deprecation] `{ $to }` စ့ၢ်ကီး ပာ်ပနီၣ်ဝဲအဃိ `<{ $component }>` အလိၤ attribute `{ $from }` န့ၣ် တစူးကါလၢၤဘၣ် ဒီး တစူးကါဘၣ်။
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` အလိၤ attribute `{ $attribute }` န့ၣ် တစူးကါလၢၤဘၣ် ဒီး တစူးကါဘၣ်။

deprecated-attribute-to-child = [deprecation] `<{ $component }>` အလိၤ attribute `{ $attribute }` န့ၣ် တစူးကါလၢၤဘၣ်; `<{ $child }>` ဖိ စူးကါတက့ၢ်။

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` အလိၤ attribute `{ $attribute }` အ တၢ်လုၢ်ပှ့ၤ `{ $value }` န့ၣ် တစူးကါလၢၤဘၣ်; `{ $to }` စူးကါတက့ၢ်။


## Language coverage

pluralize-english-only = `<pluralize>` န့ၣ် အဲကလံးကျိာ်ဧိၤ နီၣ်ဂံၢ်အါ မၤသ့အဃိ { $locale } ဒီး ကွဲးဝဲသော document အပူၤ အ text န့ၣ် ဒ်အအိၣ်အသိး အိၣ်တ့ၢ်ဝဲ လီၤ။ နီၣ်ဂံၢ်အါအကျဲ လိၤလိၤ ကွဲးတက့ၢ်, မ့တမ့ၢ် attribute `pluralForm` ဒီး ပာ်တက့ၢ်။


## Checking against the schema

schema-element-unrecognized = element `<{ $tag }>` န့ၣ် Doenet element လၢအသ့ၣ်ညါဝဲ တမ့ၢ်ဘၣ်။

schema-element-not-allowed-at-root = element `<{ $tag }>` န့ၣ် document အ root အလိၤ ပာ် တန့ၢ်ဘၣ်။

schema-element-not-allowed-inside = element `<{ $tag }>` န့ၣ် `<{ $parent }>` အပူၤ ပာ် တန့ၢ်ဘၣ်။

schema-attribute-unrecognized = element `<{ $tag }>` န့ၣ် `{ $attribute }` အမံၤ အိၣ်သော attribute တအိၣ်ဘၣ်။

schema-attribute-value-not-allowed =
    { $isList ->
        [true] element `<{ $tag }>` အ attribute `{ $attribute }` န့ၣ် အကူာ်ကိးခါ အံၤအကျါ တခါ မ့ၢ်သော list ကဘၣ်မ့ၢ်: { $allowed }
       *[other] element `<{ $tag }>` အ attribute `{ $attribute }` န့ၣ် အံၤအကျါ တခါ ကဘၣ်မ့ၢ်: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select အဂီၢ် variant name တဘၣ်ဘၣ်။ variant name { $variantName } န့ၣ် option { $numOptions } ခါအပူၤ အိၣ်ဘၣ်ဆၣ် ဃုထၢအနီၣ်ဂံၢ် န့ၣ် { $numToSelect } လီၤ။

select-variant-name-without-options = select အဂီၢ် variant တနီၤ ပာ်ပနီၣ်ဝဲဘၣ်ဆၣ် ကဲထီၣ်သ့သော variant name အဂီၢ် option တအိၣ်ဘၣ်: { $variantName }။

select-variant-name-not-possible = select အဂီၢ် ပာ်ပနီၣ်ဝဲသော variant name { $variantName } န့ၣ် ကဲထီၣ်သ့သော variant name တမ့ၢ်ဘၣ်။

select-too-few-options = { $numOptions } ဧိၤအကျါ component { $numToSelect } ခါ ဃုထၢ တန့ၢ်ဘၣ်။

select-from-sequence-too-few-values = အထီ { $length } အိၣ်သော sequence အကျါ တၢ်လုၢ်ပှ့ၤ { $numToSelect } ခါ ဃုထၢ တန့ၢ်ဘၣ်။

select-from-sequence-indices-count-mismatch = select အဂီၢ် ပာ်ပနီၣ်ဝဲသော indices အနီၣ်ဂံၢ် န့ၣ် ဃုထၢအနီၣ်ဂံၢ် ဒီး ကဘၣ်ဘၣ်လိာ်

select-from-sequence-indices-not-integers = select အဂီၢ် ပာ်ပနီၣ်ဝဲသော indices ခဲလၢာ် ကဘၣ်မ့ၢ် integer

select-from-sequence-index-excluded = selectfromsequence အ ပာ်ပနီၣ်ဝဲသော index န့ၣ် ထုးထီၣ်ကွံာ်ဃာ်ဝဲ လီၤ

select-from-sequence-indices-excluded-combination = selectfromsequence အ ပာ်ပနီၣ်ဝဲသော indices န့ၣ် ထုးထီၣ်ကွံာ်ဃာ်ဝဲသော combination လီၤ

select-from-sequence-coprime-not-positive-integers = သုညအါန့ၢ်သော integer တဃုထၢဘၣ်အဃိ coprime combination ဃုထၢ တန့ၢ်ဘၣ်။

select-from-sequence-coprime-common-factor = coprime number ဃုထၢ တန့ၢ်ဘၣ်။ ကဲထီၣ်သ့သော တၢ်လုၢ်ပှ့ၤ ခဲလၢာ် န့ၣ် factor ဒ်သိးသိး အိၣ်ဝဲ လီၤ။ ("from" မ့တမ့ၢ် "to" လၢပာ်ပနီၣ်ဝဲန့ၣ် "step" ဒီး coprime ကဘၣ်မ့ၢ်။)

select-from-sequence-coprime-single-number = 1 တမ့ၢ်ဘၣ်သော number တခါဧိၤအကျါ coprime combination ဃုထၢ တန့ၢ်ဘၣ်။

select-from-sequence-excluded-too-many-combinations = selectFromSequence အပူၤ combination 70% အါန့ၢ် ထုးထီၣ်ကွံာ်ဃာ်ဝဲ လီၤ

select-from-sequence-coprime-none-found = coprime number ဃုထၢ တန့ၢ်ဘၣ်။ ကဲထီၣ်သ့သော တၢ်လုၢ်ပှ့ၤ ခဲလၢာ် န့ၣ် factor ဒ်သိးသိး အိၣ်ဝဲ လီၤ။

select-from-sequence-too-few-unique-values = အထီ { $numPossibleValues } အိၣ်သော sequence အကျါ unique တၢ်လုၢ်ပှ့ၤ { $numToSelect } ခါ ဃုထၢ တန့ၢ်ဘၣ်

select-prime-numbers-too-few-values = အထီ { $numValues } အိၣ်သော prime စရီ အကျါ တၢ်လုၢ်ပှ့ၤ { $numToSelect } ခါ ဃုထၢ တန့ၢ်ဘၣ်

select-prime-numbers-values-count-mismatch = select အဂီၢ် ပာ်ပနီၣ်ဝဲသော တၢ်လုၢ်ပှ့ၤ အနီၣ်ဂံၢ် န့ၣ် ဃုထၢအနီၣ်ဂံၢ် ဒီး ကဘၣ်ဘၣ်လိာ်

select-prime-numbers-values-not-prime = select prime number အဂီၢ် ပာ်ပနီၣ်ဝဲသော တၢ်လုၢ်ပှ့ၤ ခဲလၢာ် န့ၣ် prime စရီ အပူၤ ကဘၣ်အိၣ်

select-prime-numbers-values-excluded-combination = selectPrimeNumbers အ ပာ်ပနီၣ်ဝဲသော တၢ်လုၢ်ပှ့ၤ န့ၣ် ထုးထီၣ်ကွံာ်ဃာ်ဝဲသော combination လီၤ

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers အပူၤ combination 70% အါန့ၢ် ထုးထီၣ်ကွံာ်ဃာ်ဝဲ လီၤ

select-random-combination-fluke = ကဲထီၣ်တသ့သးဖှံသးညီ random တၢ်လုၢ်ပှ့ၤ အ combination ဃုထၢ တန့ၢ်ဘၣ်

select-random-value-fluke = ကဲထီၣ်တသ့သးဖှံသးညီ random တၢ်လုၢ်ပှ့ၤ ဃုထၢ တန့ၢ်ဘၣ်

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] `<{ $component }>` အံၤ တဒုးနဲၣ်ဘၣ်, math အပူၤ အိၣ်ဘၣ်ဆၣ် `inline` တမ့ၢ်ဘၣ်အဃိ လီၤ။ `inline` ပာ်ဖှိၣ်တက့ၢ်, စံးအသိး expression အပူၤ လုၢ်သ့သော drop-down list ကကဲထီၣ် လီၤ။
        [expanded] `<{ $component }>` အံၤ တဒုးနဲၣ်ဘၣ်, math အပူၤ အိၣ်ဒီး `expanded` မ့ၢ်ဝဲအဃိ လီၤ။ `expanded` ထုးထီၣ်ကွံာ်တက့ၢ်; ကျိၤအါဘိအိၣ်သော တလါ န့ၣ် expression အပူၤ တလုၢ်ဘၣ်။
        [on-graph] `<{ $component }>` အံၤ တဒုးနဲၣ်ဘၣ်, graph အလိၤ ဒုးအိၣ်ထီၣ်ဝဲသော math အပူၤ အိၣ်ဒီး input အဂီၢ် လီၢ် တအိၣ်ဘၣ်အဃိ လီၤ။
       *[relative-width] `<{ $component }>` အံၤ တဒုးနဲၣ်ဘၣ်, math အပူၤ အိၣ်ဒီး relative width အိၣ်ဝဲအဃိ လီၤ။ width န့ၣ် `px` ဒ်သိးသော တၢ်ထိၣ်လၢအလီၢ်ဂၢၢ် ဒီး ဟ့ၣ်လီၤတက့ၢ်။
    }
