# Mon (ဘာသာမန်) warnings and errors. Translated from
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
# Mon in the Mon-Burmese script with the Mon letters ၚ ၜ and the medials
# ၞ ၟ ၠ — never Burmese င for Mon ၚ — and Burmese spacing.
#
# **Every DoenetML name stays in English exactly as written**: `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `selectFromSequence`, every
# tag and every attribute. They are part of the language rather than prose.
#
# **This file is a Mon frame around English technical nouns**, and it is the
# most heavily loaned of the four. A diagnostic names DoenetML objects almost
# every time it opens its mouth — component, attribute, function, sequence,
# variant, reference, index — and Mon has no established word for any of them,
# so they stay in Latin letters as the classroom leaves them. What is Mon is
# the sentence, built from a small fixed set of phrases used the same way
# throughout so that a corrector can fix one pattern in one place:
#
#   * «X ဟွံဒးရး» — X is invalid
#   * «ဟွံသုၚ်စောဲ» — ignored
#   * «ဟွံဂွံ» — cannot
#   * «ဒး» — must
#   * «ဟွံကၠောန်လဝ်ဏီ» — has not been implemented yet
#   * «ဟွံဆဵု» — cannot find
#   * «ဟိုတ်နူ» — because
#   * «စၟတ်သမ္တီ» — to specify; «မစၟတ်သမ္တီလဝ်» — specified
#   * «ဂၞန်» — number, count
#
# The Burmese loans, in Burmese spelling, are သတိပေးချက် (warning),
# အချက်အလက် (information), အမှတ် (point), စက်ဝိုင်း (circle), မျဉ်း (line)
# and ဇယား (table); everything else non-Mon is English in Latin letters.
#
# **What this catalog does not know.** Mon has no settled terminology for
# software diagnostics or for the higher-mathematics vocabulary these
# messages use, and this seed did not invent one. Where English says
# "prescribed", "overprescribed", "coprime", "eigenvalue" or "circular
# dependency", the Mon around the English term is a paraphrase of what the
# sentence means rather than a translation of the term. Those are the places a
# speaker with the mathematical register will want to rewrite, and they are
# marked by the English word standing bare in the sentence.
#
# **Counting.** CLDR has no plural data for `mnw`. Every count select English
# writes is collapsed to a single `*[other]`, because Mon leaves a noun
# unmarked after a numeral and a category branch here would be text chosen by
# English's rules. No `[zero]`, `[one]`, `[two]`, `[few]` or `[many]` branch
# appears anywhere in these four files.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] { $attributes } ဂှ် endpoint ၜါ မစၟတ်သမ္တီလဝ်မ္ဂး ဟွံသုၚ်စောဲ
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] { $attributes } ဂှ် endpoint ကဵု midpoint ၜါ မစၟတ်သမ္တီလဝ်မ္ဂး ဟွံသုၚ်စောဲ
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ဂှ် midpoint ဟွံမွဲမ္ဂး အကာဲအရာ ဟွံမွဲ

## `<line>`

line-points-undetermined-dimensions = မျဉ်း မလုပ်အာ ပ္ဍဲ အမှတ် မဒှ်တၚ် dimension ဟွံစၟတ်သမ္တီလဝ်။

line-points-too-few-dimensions = မျဉ်း ဒးလုပ်အာ ပ္ဍဲ အမှတ် မနွံကဵု dimension ဟွံအောန်နူ ၜါ။

line-points-depend-on-variables = မျဉ်း လုပ်အာ ပ္ဍဲ အမှတ် မဆေၚ်စပ် ကု variable: { $variables }။

line-equation-invalid-format = ဗီုပြၚ် equation နူ မျဉ်း ပ္ဍဲ variable { $variable1 } ကဵု { $variable2 } ဟွံဒးရး။

## `<ray>`

ray-overprescribed-through = ray ဂှ် through, endpoint ကဵု direction ပိ မွဲစွံ စၟတ်သမ္တီလဝ်ရ။ through မစၟတ်သမ္တီလဝ်ဂှ် ဟွံသုၚ်စောဲ။

ray-dimension-mismatch = numDimensions ပ္ဍဲ ray ဟွံဒးရး။

## `<vector>`

vector-overprescribed-head = vector ဂှ် head, tail ကဵု displacement ပိ မွဲစွံ စၟတ်သမ္တီလဝ်ရ။ head မစၟတ်သမ္တီလဝ်ဂှ် ဟွံသုၚ်စောဲ။

vector-dimension-mismatch = numDimensions ပ္ဍဲ vector ဟွံဒးရး။

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ကု attract ဟွံဂွံ ဟိုတ်နူ ညးဂှ် state variable nearestPoint ဟွံမွဲ။

constrain-to-without-nearest-point = `<{ $component }>` ကု constrain ဟွံဂွံ ဟိုတ်နူ ညးဂှ် state variable nearestPoint ဟွံမွဲ။

constrain-to-interior-without-nearest-point = ပ္ဍဲ `<{ $component }>` ကု constrain ဟွံဂွံ ဟိုတ်နူ ညးဂှ် state variable nearestPoint ဟွံမွဲ။

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ဂှ် choiceInput မဟွံဒှ် inline ကု ဟွံသုၚ်စောဲ

## Ordering children by index

choice-input-indices-count-mismatch = indices မစၟတ်သမ္တီလဝ် သွက် choiceInput ဂှ် ဟွံသုၚ်စောဲ ဟိုတ်နူ ဂၞန် indices ကဵု ဂၞန် choice ကောန်ဇာတ် ဟွံဒးရးရ။

pretzel-indices-count-mismatch = indices မစၟတ်သမ္တီလဝ် သွက် problem ဂှ် ဟွံသုၚ်စောဲ ဟိုတ်နူ ဂၞန် indices ကဵု ဂၞန် problem ကောန်ဇာတ် ဟွံဒးရးရ။

shuffle-indices-count-mismatch = indices မစၟတ်သမ္တီလဝ် သွက် shuffle ဂှ် ဟွံသုၚ်စောဲ ဟိုတ်နူ ဂၞန် indices ကဵု ဂၞန် component ဟွံဒးရးရ။

indices-ignored-out-of-range = indices မစၟတ်သမ္တီလဝ် သွက် { $component } ဂှ် ဟွံသုၚ်စောဲ ဟိုတ်နူ index လ္ၚဵု တိတ်နူ အကွက်။

pretzel-indices-repeated = indices မစၟတ်သမ္တီလဝ် သွက် pretzel ဂှ် ဟွံသုၚ်စောဲ ဟိုတ်နူ index လ္ၚဵု ကလေၚ်ပါလုပ်ဗွဲမဂၠိုၚ်။

pretzel-circuit-first-index = indices မစၟတ်သမ္တီလဝ် သွက် pretzel ပ္ဍဲ circuit mode ဂှ် ဟွံသုၚ်စောဲ ဟိုတ်နူ index ကၠာအိုတ် ဒးဒှ် 1။

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` ဂှ် string ကောန်ဇာတ် ကု ကၠောန်မာန်ဂွံဂှ် attribute `type` ဒးစၟတ်သမ္တီ။

invalid-type-defaulting-to-math = type { $type } ဂှ် component { $component } သွက် ဟွံဒးရး။ ဒးဒှ် math, text, number ဟွံသေၚ် boolean။ math ဂှ် default ဒှ်အာရ။

string-not-valid-component-to-arrange = string "{ $value }" ဂှ် { $component } ကၠောန်ဂွံ component ဟွံသေၚ်။ ဟွံသုၚ်စောဲ။

## Types and variables

invalid-type-defaulting-to-number = type { $type } ဟွံဒးရး၊ type ဂှ် number စွံရ။

invalid-variable-value = တန်ဖိုး နူ variable ဟွံဒးရး: `{ $value }`

## Variants

variant-index-must-be-number = variant index { $index } ဒးဒှ် number

variant-index-must-be-integer = variant index { $index } ဒးဒှ် integer

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ဂှ် ဗီုပြၚ်ခဏ်လၟိဟ်တၟေၚ် သွက် ဟွံကၠောန်လဝ်ဏီ။ width ဂှ် relative စွံရ။

side-by-side-absolute-margins = `<{ $component }>` ဂှ် ဗီုပြၚ်ခဏ်လၟိဟ်တၟေၚ် သွက် ဟွံကၠောန်လဝ်ဏီ။ margin ဂှ် relative စွံရ။

side-by-side-no-block-child = `<{ $component }>` ဟွံဒးရး - block ကောန်ဇာတ် ဟွံအောန်နူ မွဲ ဒးနွံ။

## `<label>`

label-for-ignored-on-graphical = attribute `for` ပ္ဍဲ `<label>` မဒှ်ဗီု ဂှ် ဟွံသုၚ်စောဲ။

label-for-must-resolve-to-one = attribute `for` ပ္ဍဲ `<label>` ဂှ် component မွဲဓဝ် ကု ဒးထ္ၜး။

label-for-unresolved = attribute `for` ပ္ဍဲ `<label>` ဂှ် component ကု ထ္ၜး ဟွံဂွံ။

label-for-answer-with-authored-inputs = attribute `for` ပ္ဍဲ `<label>` ဂှ် `<answer>` မနွံကဵု input မချူလဝ်ဂှ် ထ္ၜးမံၚ်ရ၊ input ဂှ်ကီု ဒးထ္ၜးဗွဲမ္ၚးဒမြိပ်။

label-for-answer-without-input = attribute `for` ပ္ဍဲ `<label>` ဂှ် `<answer>` မဟွံမွဲ input သွက် label ဂှ် ထ္ၜးမံၚ်ရ။

label-for-must-reference-input-or-answer = attribute `for` ပ္ဍဲ `<label>` ဂှ် input ဟွံသေၚ် answer ကု ဒးထ္ၜး။

## Accessibility

accessibility-short-description-or-decorative = accessibility သွက်ဂှ် `<{ $component }>` ဂှ် ကထ္ၜးဗွဲမဂတိုၚ် မွဲ ဒးနွံ ဟွံသေၚ် decorative ဒးစၟတ်သမ္တီ။

accessibility-video-short-description = accessibility သွက်ဂှ် `<video>` ဂှ် ကထ္ၜးဗွဲမဂတိုၚ် ဒးနွံ။

accessibility-input-short-description-or-label = accessibility သွက်ဂှ် `<{ $component }>` ဂှ် ကထ္ၜးဗွဲမဂတိုၚ် ဟွံသေၚ် label ဒးနွံ။

accessibility-answer-input-short-description-or-label = accessibility သွက်ဂှ် `<answer>` မဖန်ဗဒှ် input ဂှ် ကထ္ၜးဗွဲမဂတိုၚ် ဟွံသေၚ် label ဒးနွံ။

accessibility-short-description-contains-math = ကထ္ၜးဗွဲမဂတိုၚ် ဂှ် `<{ $component }>` ဗီု math component ဟွံဒးပါလုပ်။ math ဂှ် နကဵု စကာ ချူထ္ၜးညိ။

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ဂှ် ကဏ္ဍ ခေါၚ်ခဝ် text သွက် contrast ဟွံပေၚ် (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ဟွံအောန်နူ { $threshold }:1 ဒးနွံ)။
       *[other] { $colorName } ဂှ် ကဏ္ဍ ခေါၚ်ခဝ် text သွက် contrast ဟွံပေၚ် ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ဟွံအောန်နူ { $threshold }:1 ဒးနွံ)။
    }

## `<circle>`

circle-through-points-non-numerical = အမှတ် { $count } တၚ် မလုပ်အာ `<circle>` ဂှ် အမှတ် တန်ဖိုးဂၞန် ဟွံမွဲမ္ဂး ဟွံကၠောန်လဝ်ဏီ။

circle-too-many-through-points = အမှတ် ဂၠိုၚ်နူ ၃ တၚ် မလုပ်အာ စက်ဝိုင်း ဂှ် ချူဓဇက် ဟွံဂွံ။

circle-overprescribed-radius-center-points = radius, center ကဵု through point ပိ မွဲစွံ စၟတ်သမ္တီလဝ်မ္ဂး စက်ဝိုင်း ချူဓဇက် ဟွံဂွံ။

circle-center-with-multiple-points = center မစၟတ်သမ္တီလဝ် နွံတုဲ အမှတ် ဂၠိုၚ်နူ ၁ တၚ် မလုပ်အာ စက်ဝိုင်း ဂှ် ချူဓဇက် ဟွံဂွံ။

circle-radius-too-small = စက်ဝိုင်း ချူဓဇက် ဟွံဂွံ - အမှတ် ၜါ အကြာ ဇမၠိၚ်ဂှ် { $distance } ဒှ်တုဲ radius မစၟတ်သမ္တီလဝ် { $radius } ဂှ် ဍောတ်အာရ။

circle-radius-with-many-points = radius မစၟတ်သမ္တီလဝ် နွံတုဲ အမှတ် ဂၠိုၚ်နူ ၜါ တၚ် မလုပ်အာ စက်ဝိုင်း ဂှ် ဖန်ဗဒှ် ဟွံဂွံ။

circle-invalid-center-or-through-points = စက်ဝိုင်း နူ center ဟွံသေၚ် through point ဟွံဒးရး။

circle-radius-center-with-multiple-points = center မစၟတ်သမ္တီလဝ် နွံတုဲ အမှတ် ဂၠိုၚ်နူ ၁ တၚ် မလုပ်အာ စက်ဝိုင်း နူ radius ဂှ် ချူဓဇက် ဟွံဂွံ။

circle-change-radius-non-numerical = through point တန်ဖိုးဂၞန် ဟွံမွဲမ္ဂး စက်ဝိုင်း နူ radius ဂှ် ပြံၚ်လှာဲ ဟွံဂွံ

circle-radius-with-points-non-numerical = တန်ဖိုးဂၞန် ဟွံမွဲမ္ဂး radius မစၟတ်သမ္တီလဝ် နကဵု အမှတ် ဂၠိုၚ်နူ မွဲ တၚ် မလုပ်အာ စက်ဝိုင်း ဂှ် ဖန်ဗဒှ် ဟွံဂွံ။

circle-change-center-non-numerical = အမှတ် တန်ဖိုးဂၞန်ဟွံမွဲ မလုပ်အာ စက်ဝိုင်း နူ center ပြံၚ်လှာဲ ဂှ် ဟွံကၠောန်လဝ်ဏီ။

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] function သွက် domain နူ dimension ဟွံပေၚ်။ domain ဂှ် interval { $intervals } နွံတုဲ function ဂှ် input { $inputs } နွံရ။
    }

function-domain-invalid-format = function သွက် domain နူ ဗီုပြၚ် ဟွံဒးရး။

function-ignoring-non-numerical =
    { $type ->
        [maximum] function နူ maximum မဟွံဒှ်ဂၞန် ဂှ် ဟွံသုၚ်စောဲ။
        [minimum] function နူ minimum မဟွံဒှ်ဂၞန် ဂှ် ဟွံသုၚ်စောဲ။
        [extremum] function နူ extremum မဟွံဒှ်ဂၞန် ဂှ် ဟွံသုၚ်စောဲ။
        [point] function နူ အမှတ် မဟွံဒှ်ဂၞန် ဂှ် ဟွံသုၚ်စောဲ။
        [slope] function နူ slope မဟွံဒှ်ဂၞန် ဂှ် ဟွံသုၚ်စောဲ။
       *[other] function နူ { $type } မဟွံဒှ်ဂၞန် ဂှ် ဟွံသုၚ်စောဲ။
    }

function-ignoring-empty =
    { $type ->
        [maximum] function နူ maximum မလလေၚ် ဂှ် ဟွံသုၚ်စောဲ။
        [minimum] function နူ minimum မလလေၚ် ဂှ် ဟွံသုၚ်စောဲ။
        [extremum] function နူ extremum မလလေၚ် ဂှ် ဟွံသုၚ်စောဲ။
        [point] function နူ အမှတ် မလလေၚ် ဂှ် ဟွံသုၚ်စောဲ။
       *[other] function နူ { $type } မလလေၚ် ဂှ် ဟွံသုၚ်စောဲ။
    }

function-points-too-close = function ဂှ် အမှတ် ၜါ တၚ် ဒၞာဲဇၞော်ကဵုဒြဟတ် ဇရေၚ်လောန်အာရ။ function စၟတ်သမ္တီ ဟွံဂွံ။

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] function iterate ဂှ် function နူ input ဂၞန် ကဵု output ဂၞန် တုပ်မ္ဂးဟေၚ် ဒှ်မာန်။ function ဏအ် input { $inputs } ကဵု output { $outputs } နွံရ။
    }

## `<sequence>`

sequence-invalid-length = sequence နူ length ဟွံဒးရး။ ဂၞန်ဟွံစှေ်နူသုည integer ဒးဒှ်။

sequence-invalid-step = sequence နူ step ဟွံဒးရး။ sequence type { $type } သွက် number ဒးဒှ်။

sequence-invalid-endpoint-number = number sequence နူ "{ $attribute }" ဟွံဒးရး။ number ဒးဒှ်။

sequence-invalid-endpoint-letters = letters sequence နူ "{ $attribute }" ဟွံဒးရး။ အက္ခရ် မပံၚ်လဝ် ဒးဒှ်။

sequence-invalid-endpoint = sequence နူ "{ $attribute }" ဟွံဒးရး။

select-from-sequence-coprime-not-numbers = number ဟွံရုဲမ္ဂး coprime ဟွံသုၚ်စောဲ

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations စၟတ်သမ္တီလဝ်မ္ဂး coprime ဟွံသုၚ်စောဲ

## Resolving a `target`

target-not-found = `<{ $source }>` သွက် target ဟွံဒးရး - target ဟွံဆဵု။

target-state-variable-not-found = `<{ $source }>` သွက် target ဟွံဒးရး - `<{ $component }>` ပ္ဍဲ state variable ယၟု "{ $property }" ဟွံဆဵု။

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` နူ variable ဂှ် independent variable ကု ဒးတၞဟ်ခြာ။

ode-system-duplicate-variable-names = dependent variable ယၟု တုပ်ရဴသၟဟ်နွံမ္ဂး ODE RHS function စၟတ်သမ္တီ ဟွံဂွံ။

ode-system-rhs-function-error = ODE RHS function စၟတ်သမ္တီ ဟွံဂွံ။ mathjs function ဖန်ဗဒှ်ရိုက် တၚ်ဗၠေတ် ဒှ်အာရ။

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = မျဉ်း { $count } ကြပ် အကြာ ထောၚ် စၟတ်သမ္တီ ဟွံဂွံ

angle-invalid-through-point = `<angle>` နူ through ပ္ဍဲ အမှတ် ဟွံဒးရး

parabola-vertex-too-many-points = vertex နွံတုဲ အမှတ် ဂၠိုၚ်နူ ၁ တၚ် မလုပ်အာ parabola ဂှ် ဟွံကၠောန်လဝ်ဏီ။

parabola-too-many-points = အမှတ် ဂၠိုၚ်နူ ၃ တၚ် မလုပ်အာ parabola ဂှ် ဟွံကၠောန်လဝ်ဏီ။

intersection-too-many-items = အရာ ဂၠိုၚ်နူ ၜါ သွက် intersection ဂှ် ဟွံကၠောန်လဝ်ဏီ

## Other math components

ionic-compound-not-two-ions = ion ၜါ တၞဟ်နူဂှ် သွက် ionic compound ဟွံကၠောန်လဝ်ဏီ။

ionic-compound-needs-cation-and-anion = ionic compound ဂှ် cation မွဲ ကဵု anion မွဲ သွက်ဟေၚ် ကၠောန်လဝ်ရ။

solve-equations-cannot-evaluate = equation ဂၞန်ချူ ဟွံဂွံဟိုတ်နူ equation ဖျေံသွဟ် ဟွံဂွံ: { $equation }

math-operators-operand-number-required = math operand ပတိတ်မ္ဂး operandNumber ဒးစၟတ်သမ္တီ။

eigen-decomposition-failed = matrix နူ eigenvalue ဂၞန်ချူ ဟွံဂွံ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: parameter { $parameters } ဂှ် pattern ပ္ဍဲ ဟွံမွဲ၊ ကွက်လပ် ကု လၟိုန် match ဒှ်အာရ။
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ဂှ် အဓိပ္ပါယ် ဟွံဂွံကေတ်။ none, medium, dense ဟွံသေၚ် အကြာ ကွက် နွံကဵု number ဂၠိုၚ်နူသုည ၜါ ဗီုကဵု grid="1 0.5" ဒးဒှ်။ grid ဟွံဓဇက်။

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` ဂှ် { $expected ->
        [1] output မွဲ၊ အမှတ် နာနာ ပ္ဍဲ slope y'၊ ဗီုကဵု `y - x`
       *[other] output ၜါ၊ အမှတ် နာနာ ပ္ဍဲ vector၊ ဗီုကဵု `(y, -x)`
    } မနွံ function ဒးလိုၚ်၊ ဆဂး function မကဵုလဝ်ဂှ် output { $found } နွံရ။ { $alternative ->
        [none] မွဲမွဲ ဟွံဓဇက်။
       *[other] function ဂှ် သွက် `<{ $alternative }>` ဒှ် component ရ။ မွဲမွဲ ဟွံဓဇက်။
    }

field-function-attribute-ignored-with-child = function ဂှ် component ပ္ဍဲကီု ကဵုလဝ်ဟိုတ်နူ attribute `function` ဟွံသုၚ်စောဲ၊ ပ္ဍဲကဵုဂှ် သုၚ်စောဲရ။ function ဂှ် နဲမွဲဟေၚ် ကဵုညိ။

field-variables-ignored =
    `<{ $component }>`: attribute `variables` ဂှ် component ပ္ဍဲကဵု မချူလဝ်ဗွဲမ္ၚးဒမြိပ် expression နူ variable ဂှ် ထ္ၜးရ။ { $reason ->
        [function-child] ဏအ် function ဂှ် `<function>` ကောန်ဇာတ် နကဵု ကဵုလဝ်တုဲ ညးဂှ် variable ဇကုညး ထ္ၜးမံၚ်ဟိုတ်နူ `variables` ဟွံသုၚ်စောဲ။
       *[no-expression] ဏအ် expression ဗီုဂှ် ဟွံမွဲဟိုတ်နူ `variables` ဟွံသုၚ်စောဲ။
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ဂှ် prefigure renderer ပ္ဍဲ သုၚ်စောဲ ဟွံဂွံ; right-position ဗီု သုၚ်စောဲရ။

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ဂှ် prefigure renderer ပ္ဍဲ သုၚ်စောဲ ဟွံဂွံ; top-position ဗီု သုၚ်စောဲရ။

prefigure-invalid-axis-bounds = `<graph>`: prefigure သွက် axis bound ဟွံဒးရး; default bbox (-10,-10,10,10) သုၚ်စောဲရ။

prefigure-invalid-width = `<graph>`: prefigure သွက် width ဟွံဒးရး; default width 425 သုၚ်စောဲရ။

prefigure-invalid-aspect-ratio = `<graph>`: prefigure သွက် aspectRatio ဟွံဒးရး; default aspect ratio 1 သုၚ်စောဲရ။

prefigure-grid-spacing-too-fine = `<graph>`: axis အကွက် သွက် grid အကြာ ဂှ် ဍောတ်လောန်အာ; prefigure renderer ပ္ဍဲ grid ဂှ် ဟွံဓဇက်။

prefigure-annotations-not-rendered = `<graph>`: PreFigure renderer ဟွံသုၚ်စောဲမ္ဂး annotation ဟွံဓဇက်။

multiple-annotations-children = `<graph>` ပ္ဍဲ `<annotations>` ကောန်ဇာတ် ဂၠိုၚ်တၞး ဆဵုကေတ်; လက္ကရဴအိုတ် မွဲဟေၚ် သုၚ်စောဲရ။

## Referring to other components

copy-unrecognized-component-type = ဟွံတီကေတ် component type ကု extend ဟွံသေၚ် copy ဟွံဂွံ: { $type }။

copy-prop-not-found = component type { $component } ပ္ဍဲ prop { $property } ဟွံဆဵု

collect-no-source = collect သွက် source ဟွံဆဵု။

collect-invalid-component-type = component type `<{ $component }>` ဂှ် ဟွံဒးရး ဟိုတ်နူ collect ဟွံဂွံ။

reference-index-unavailable = index `{ $reference }` ကု ထ္ၜး ဟွံဂွံ

## `<callAction>`

component-action-unavailable = component `{ $reference }` ပ္ဍဲ { $action } ကော် ဟွံဂွံ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = data နူ ဗီုပြၚ် ဟွံဒးရး။ row နူ ဇမၠိၚ် ဟွံတုပ်ရ။ componentIdx :{ $componentIdx } ပ္ဍဲ ဆဵုကေတ်

data-frame-duplicate-column-names = data ဂှ် column ယၟု တုပ်ရဴသၟဟ် နွံရ။ componentIdx :{ $componentIdx } ပ္ဍဲ ဆဵုကေတ်

data-frame-missing-column-name = data ဂှ် column ယၟု မွဲ ဟွံမွဲ။ componentIdx :{ $componentIdx } ပ္ဍဲ ဆဵုကေတ်

## `<answer>` and scoring

answer-award-depends-on-own-response = answer ဏအ် နူ award ဂှ် answer tag ဇကုညး နူ သွဟ် မပ္တိုန်လဝ်ဂှ် ဇိုၚ်တဲစွံမံၚ်တုဲ၊ ဗွဲမဟွံရုဲစှ်မာန် ဒှ်အာရ။

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` မနွံ container ပ္ဍဲ `<answer>` ကု `maxNumAttempts` စွံဂှ် အကာဲအရာ ဟွံမွဲ ဟိုတ်နူ အလန် ဂၞန် ဂှ် container ဟေၚ် ကၠုၚ်ဒက်ဒဝ်ရ။ `maxNumAttempts` ဂှ် container ကု စွံညိ။

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` မနွံ container တၞဟ် ပ္ဍဲ `sectionWideCheckWork` မနွံ container ကု `maxNumAttempts` စွံဂှ် အကာဲအရာ ဟွံမွဲ ဟိုတ်နူ အလန် ဂၞန် ဂှ် ဗွဲမ္ၚး container ဟေၚ် ကၠုၚ်ဒက်ဒဝ်ရ။ `maxNumAttempts` ဂှ် ဗွဲမ္ၚး container ကု စွံညိ။

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] symbolicEquality ဟွံစွံမ္ဂး attribute { $attributes } ဂှ် အကာဲအရာ ဟွံမွဲ။
    }

answer-invalid-type = answer သွက် type ဟွံဒးရး: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = component `<{ $component }>` ဂှ် ယၟု ဟွံမွဲဟိုတ်နူ module နူ attribute ဒှ် သုၚ်စောဲ ဟွံဂွံ

module-attribute-name-already-defined = component type `<module>` ဂှ် attribute "{ $name }" စၟတ်သမ္တီလဝ်တုဲဟိုတ်နူ component `<{ $component } name="{ $name }">` ဂှ် module နူ attribute ဒှ် သုၚ်စောဲ ဟွံဂွံ။

conditional-content-condition-ignored = case ဟွံသေၚ် else ကောန်ဇာတ် မနွံ `<conditionalContent>` ပ္ဍဲ attribute `condition` ဟွံသုၚ်စောဲ။

slider-markers-type-mismatch = marker နူ type ကဵု slider နူ type ဟွံတုပ်။

pretzel-problem-needs-statement-and-answer = pretzel ဟွံဒးရး - `<problem>` နာနာ ဂှ် `<statement>` မွဲ ကဵု `<answer>` မွဲ ဒးနွံ။

pretzel-circuit-first-problem-distractor = pretzel ဟွံဒးရး - mode="circuit" ပ္ဍဲ `<problem>` ကၠာအိုတ် ဂှ် distractor ဒှ် ဟွံဂွံ။

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] attribute `{ $attribute }` သွက် တန်ဖိုး { $values } ဟွံဒးရး; ဟွံသုၚ်စောဲ။
    }

attribute-must-be-references = attribute `{ $attribute }` သွက် တန်ဖိုး `{ $value }` ဟွံဒးရး။ attribute ဂှ် `$` နကဵု မစတမ် reference နူ ဒးဒှ်။

math-input-invalid-function-names = <mathInput>: { $attribute } ပ္ဍဲ ဟွံဒးရး function ယၟု ဟွံသုၚ်စောဲ: { $names }။ ယၟု နာနာ နူ ကထ္ၜးအခန် ဂှ် အက္ခရ် ဟွံသေၚ် ဂၞိန် ဟွံအောန်နူ ၂ တၞး ဒးနွံ; လက္ကရဴ `|<mathspeak alternative>` ဂှ် စုတ်ကီု ဟွံစုတ်ကီု ဒှ်ဂွံ။

## Building components from the source

component-type-invalid = component type ဟွံဒးရး: `<{ $componentType }>`

attribute-repeated = attribute { $attribute } ကလေၚ်ချူ ဟွံဂွံ။

attribute-invalid-for-component = component type `<{ $componentType }>` သွက် attribute "{ $attribute }" ဟွံဒးရး။

## Style definition contrast

style-definition-insufficient-contrast =
    style definition { $styleNumber } ဂှ် { $context ->
        [text-on-background] background အဆံၚ်ဗီု ကု text အဆံၚ်ဗီု
        [high-contrast] canvas ကု high-contrast အဆံၚ်ဗီု
        [line] canvas ကု မျဉ်း အဆံၚ်ဗီု
        [marker] canvas ကု marker အဆံၚ်ဗီု
       *[text-on-canvas] canvas ကု text အဆံၚ်ဗီု
    } သွက် contrast ဟွံပေၚ်{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ဟွံအောန်နူ { $threshold }:1 ဒးနွံ)။

style-definition-dark-mode-text-background-contrast =
    style definition { $styleNumber } ဂှ် light mode သွက် contrast ပေၚ်မံၚ် အဆံၚ်ဗီု စၟတ်သမ္တီလဝ်ကီုလေဝ်၊ ဂှ်နူ တိတ်ကၠုၚ် dark mode အဆံၚ်ဗီု ဂှ် background အဆံၚ်ဗီု ကု text အဆံၚ်ဗီု သွက် contrast ဟွံပေၚ် ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ဟွံအောန်နူ { $threshold }:1 ဒးနွံ)။ { $suggestion ->
        [available] dark mode ပ္ဍဲ contrast ပေၚ်ဂွံဂှ် light mode နူ contrast ဂၠိုၚ်တိုန်ကဵုညိ (ဗီုကဵု { $lightAttribute }="{ $lightColor }" စွံ) ဟွံသေၚ် dark mode အဆံၚ်ဗီု ပြံၚ်စွံညိ (ဗီုကဵု { $darkAttribute }="{ $darkColor }" စွံ)။
       *[none] dark mode ပ္ဍဲ contrast ပေၚ်ဂွံဂှ် light mode နူ contrast ဂၠိုၚ်တိုန်ကဵုညိ ဟွံသေၚ် တိတ်ကၠုၚ် အဆံၚ်ဗီု ဂှ် textColorDarkMode ကဵု/ဟွံသေၚ် backgroundColorDarkMode နကဵု ပြံၚ်စွံညိ။
    }

style-definition-dark-mode-text-canvas-contrast =
    style definition { $styleNumber } ဂှ် light mode သွက် contrast ပေၚ်မံၚ် text အဆံၚ်ဗီု စၟတ်သမ္တီလဝ်ကီုလေဝ်၊ ဂှ်နူ တိတ်ကၠုၚ် dark mode text အဆံၚ်ဗီု ဂှ် canvas ကု contrast ဟွံပေၚ် ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ဟွံအောန်နူ { $threshold }:1 ဒးနွံ)။ { $suggestion ->
        [available] dark mode ပ္ဍဲ contrast ပေၚ်ဂွံဂှ် light mode နူ contrast ဂၠိုၚ်တိုန်ကဵုညိ (ဗီုကဵု textColor="{ $lightColor }" စွံ) ဟွံသေၚ် dark mode အဆံၚ်ဗီု ပြံၚ်စွံညိ (ဗီုကဵု textColorDarkMode="{ $darkColor }" စွံ)။
       *[none] dark mode ပ္ဍဲ contrast ပေၚ်ဂွံဂှ် light mode နူ contrast ဂၠိုၚ်တိုန်ကဵုညိ ဟွံသေၚ် တိတ်ကၠုၚ် အဆံၚ်ဗီု ဂှ် textColorDarkMode နကဵု ပြံၚ်စွံညိ။
    }

section-multiple-style-palettes = ကဏ္ဍ မွဲ ဂှ် <stylePalette> မွဲဓဝ် ရုဲဂွံ; လက္ကရဴအိုတ် သုၚ်စောဲရ။

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect ဂှ် ဂၞန်ဟွံစှေ်နူသုည integer ဟွံသေၚ်ဟိုတ်နူ { $component } နူ unique variant စၟတ်သမ္တီ ဟွံဂွံ။

variant-num-to-select-not-constant-number = numToSelect ဂှ် ဟွံပြံၚ်လှာဲ number ဟွံသေၚ်ဟိုတ်နူ { $component } နူ unique variant စၟတ်သမ္တီ ဟွံဂွံ။

variant-with-replacement-not-constant-boolean = withReplacement ဂှ် ဟွံပြံၚ်လှာဲ boolean ဟွံသေၚ်ဟိုတ်နူ { $component } နူ unique variant စၟတ်သမ္တီ ဟွံဂွံ။

variant-select-weight-disables-unique = selectWeight ဟွံသေၚ် selectForVariants မစၟတ်သမ္တီလဝ် option နွံမ္ဂး select သွက် unique variant ကၟာတ်လဝ်ရ

variant-coprime-undetermined = coprime ဂှ် လၟိုန် ဟွံဒှ် ဟီုစၟတ်သမ္တီ ဟွံဂွံဟိုတ်နူ { $component } နူ unique variant စၟတ်သမ္တီ ဟွံဂွံ။

variant-attribute-not-constant = { $attribute } ဂှ် ဟွံပြံၚ်လှာဲ ဟွံသေၚ်ဟိုတ်နူ { $component } နူ unique variant စၟတ်သမ္တီ ဟွံဂွံ။

variant-attribute-not-number = { $attribute } ဂှ် number ဟွံသေၚ်ဟိုတ်နူ { $component } နူ unique variant စၟတ်သမ္တီ ဟွံဂွံ။

variant-attribute-wrong-type-for-sequence =
    { $attribute } ဂှ် { $expected ->
        [letters-combination] အက္ခရ် မပံၚ်လဝ်
        [math-expression] မဒးရး math expression
        [integer] integer
       *[number] number
    } ဟွံသေၚ်ဟိုတ်နူ type { $type } နူ { $component } နူ unique variant စၟတ်သမ္တီ ဟွံဂွံ။

variant-length-not-integer = length ဂှ် integer ဟွံသေၚ်ဟိုတ်နူ { $component } နူ unique variant စၟတ်သမ္တီ ဟွံဂွံ။

variant-sort-not-implemented = sort မနွံ { $component } နူ unique variant ဂှ် ဟွံကၠောန်လဝ်ဏီ

variant-exclude-combinations-not-implemented = excludeCombinations မနွံ { $component } နူ unique variant ဂှ် ဟွံကၠောန်လဝ်ဏီ

variant-math-exclude-not-implemented = exclude မနွံ type math { $component } နူ unique variant ဂှ် ဟွံကၠောန်လဝ်ဏီ

variant-non-constant-exclude-not-implemented = ဟွံပြံၚ်လှာဲ ဟွံသေၚ် exclude မနွံ { $component } နူ unique variant ဂှ် ဟွံကၠောန်လဝ်ဏီ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure renderer ပ္ဍဲ သုၚ်စောဲ ဟွံဂွံ; ကောန်စဴ ကၠေံပလီုရ။

prefigure-descendant-invalid-geometry = { $subject }: ဗီုပြၚ် ဟွံပေၚ် ဟွံသေၚ် ဟွံဒှ်အကွက်; ကောန်စဴ ကၠေံပလီုရ။

prefigure-curve-label-omitted = { $subject }: မပြံၚ်လဝ် curve ပ္ဍဲ label သုၚ်စောဲ ဟွံဂွံ; label ကၠေံပလီုရ။

prefigure-curve-unsupported-definition-type = { $subject }: curve function definition type '{ $definitionType }' သုၚ်စောဲ ဟွံဂွံ; ကောန်စဴ ကၠေံပလီုရ။

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves ပ္ဍဲ attribute flipFunctions သုၚ်စောဲ ဟွံဂွံ; ကောန်စဴ ကၠေံပလီုရ။

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves ပ္ဍဲ formula type function ကောန်ဇာတ်ဟေၚ် သုၚ်စောဲဂွံ; ကောန်စဴ ကၠေံပလီုရ။

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] line family နူ label
       *[point] အမှတ် နူ label
    } သွက် labelPosition '{ $labelPosition }' သုၚ်စောဲ ဟွံဂွံ; default PreFigure alignment သုၚ်စောဲရ။

prefigure-fill-style-unsupported = { $subject }: fill style '{ $fillStyle }' ဂှ် PreFigure သုၚ်စောဲ ဟွံဂွံ; မပေၚ် fill ကု ကလေၚ်စှေ်ရ။

prefigure-line-style-unknown = { $subject }: ဟွံတီကေတ် line style '{ $lineStyle }' ဂှ် PreFigure output ပ္ဍဲ ဟွံပါလုပ်။

prefigure-marker-style-mapped-to-diamond = { $subject }: marker style '{ $markerStyle }' ဂှ် PreFigure style 'diamond' ကု ပြံၚ်စွံရ။

prefigure-marker-style-unsupported = { $subject }: marker style '{ $markerStyle }' ဂှ် PreFigure သုၚ်စောဲ ဟွံဂွံ; default style သုၚ်စောဲရ။

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ဟွံဒးရး; target ထ္ၜး ဟွံဂွံ။ annotation ကၠေံပလီုရ။

annotation-ref-multiple-targets = `<annotation>`: `ref` ဂှ် target ဂၠိုၚ်တၞး ထ္ၜးရ; ကၠာအိုတ် target သုၚ်စောဲရ။

annotation-ref-outside-graph = `<annotation>`: `ref` ဟွံဒးရး; target ဂှ် graph မဒုၚ်လဝ် ဗွဲမ္ၚး နွံရ။ annotation ကၠေံပလီုရ။

annotation-ref-unsupported-target = `<annotation>`: `ref` ဟွံဒးရး; target ဂှ် prefigure ပ္ဍဲ သုၚ်စောဲဂွံ ဗီု ဟွံသေၚ်။ annotation ကၠေံပလီုရ။

annotation-text-missing = `<annotation>`: `text` ဟွံမွဲ ဟွံသေၚ် လလေၚ်; လလေၚ် text ပတိတ်ရ။

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] circular dependency ဆဵုကေတ်ရ။
       *[other] component `<{ $componentType }>` ကု ဆေၚ်စပ် circular dependency ဆဵုကေတ်ရ။
    }

reference-no-referent = အရာ မဆေၚ်စပ် ကု reference ဟွံဆဵု: `{ $reference }`

reference-multiple-referents = အရာ မဆေၚ်စပ် ကု reference ဂၠိုၚ်တၞး ဆဵုကေတ်: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` နူ attribute { $attribute } နူ ဗီုပြၚ် ဟွံဒးရး။

children-invalid = `<{ $componentType }>` သွက် ကောန်ဇာတ် ဟွံဒးရး - ဟွံဒးရး ကောန်ဇာတ် ဆဵုကေတ်: { $children }

## Falling back to a default

attribute-value-invalid-using-default = attribute `{ $attribute }` သွက် တန်ဖိုး `{ $value }` ဟွံဒးရး၊ တန်ဖိုး `{ $default }` သုၚ်စောဲရ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML version { $version } ဟွံဆဵု။
       *[other] DoenetML version { $version } ဟွံဆဵု။ version { $fallback } ကု ကလေၚ်စှေ်ရ
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ဟွံဒးရး: { $content }

parse-tag-missing-close-tag = DoenetML ဟွံဒးရး: tag `{ $tag }` ဂှ် ကၟာတ် tag ဟွံမွဲ။ ဇကုညး မကၟာတ် tag ဟွံသေၚ် `</{ $tagName }>` tag ဒးဒှ်။

parse-tag-error = DoenetML ဟွံဒးရး: tag `<{ $tagName }>` ပ္ဍဲ တၚ်ဗၠေတ်

parse-attribute-missing-value = DoenetML ဟွံဒးရး: ဟွံဒးရး attribute `{ $attribute }` ဂှ် တန်ဖိုး ဟွံမွဲ ဗီုဒှ်ရ။

parse-attribute-invalid = DoenetML ဟွံဒးရး: attribute `{ $attribute }` ဟွံဒးရး

parse-attribute-value-invalid = DoenetML ဟွံဒးရး: attribute တန်ဖိုး `{ $value }` ဟွံဒးရး

parse-attribute-value-quote-mismatch = DoenetML ဟွံဒးရး: attribute တန်ဖိုး `{ $value }` ဟွံဒးရး။ ကွက်ဗ္စိုပ် ဟွံတုပ်။ `{ $quote }` ဟွံမွဲ ဗီုဒှ်ရ

parse-open-tag-name-missing = DoenetML ဟွံဒးရး: tag ယၟု ဟွံမွဲ tag ဆဵုကေတ်၊ ဗီုကဵု `<`

parse-tag-not-closed = DoenetML ဟွံဒးရး: tag `{ $tag }` ဟွံကၟာတ်လဝ် (`>` ဟွံမွဲ ဗီုဒှ်)။

parse-self-closing-tag-name-missing = DoenetML ဟွံဒးရး: tag ယၟု ဟွံမွဲ tag ဆဵုကေတ် `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ဟွံဒးရး: tag `{ $tag }` ဟွံကၟာတ်လဝ် (`/>` ဟွံမွဲ ဗီုဒှ်)။

parse-tag-invalid-attributes = DoenetML ဟွံဒးရး: tag `{ $tag }` ဟွံဒးရး။ attribute ဗၠေတ်မံၚ် ဒှ်မာန်။

parse-close-tag-name-missing = DoenetML ဟွံဒးရး: tag ယၟု ဟွံမွဲ ကၟာတ် tag ဆဵုကေတ်၊ ဗီုကဵု `</`

parse-attribute-value-unquoted = attribute တန်ဖိုး ဂှ် ကွက်ဗ္စိုပ် ပ္ဍဲ ဒးစုတ်: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ဟွံဒးရး: ကၟာတ် tag `{ $tag }` ဆဵုကေတ်ကီုလေဝ် မဒးရး ပံက် tag ဟွံမွဲ

parse-close-tag-mismatched = DoenetML ဟွံဒးရး: ကၟာတ် tag ဟွံတုပ်။ `</{ $expected }>` ဒးဒှ်။ `{ $found }` ဆဵုကေတ်

parser-node-unconvertible = node { $node } ဂှ် Dast node ကု ပြံၚ် ဟွံဂွံ။

## Names

name-attribute-invalid =
    attribute name='{ $name }' ဟွံဒးရး။ { $reason ->
        [characters] ယၟု ဂှ် အက္ခရ်, ဂၞန်, ကွက်သၟဝ် ဟွံသေၚ် ဂၞိန်ဟေၚ် ပါလုပ်ဂွံ။
       *[start] ယၟု ဂှ် အက္ခရ် နကဵု ဒးစတမ်။
    }

component-name-invalid-start = component ယၟု "{ $name }" ဟွံဒးရး။ ယၟု ဂှ် အက္ခရ် နကဵု ဒးစတမ်။

## `<answer>` sugar

answer-video-watched-missing-video = type videoWatched မနွံ answer ဂှ် attribute video ဒးနွံ

answer-video-watched-video-not-reference = type videoWatched မနွံ answer ဂှ် reference မဒှ် attribute video ဒးနွံ

answer-name-not-single-text = answer နူ attribute name ဂှ် text ကောန်ဇာတ် မွဲဓဝ် ဒးနွံ

## Referencing another document

external-doenetml-recursion-limit = recursion အဆံၚ် ဂၠိုၚ်လောန်အာဟိုတ်နူ ဗွဲမ္ၚး DoenetML ကေတ် ဟွံဂွံ။ circular reference နွံမံၚ်ဟာ?

external-doenetml-unavailable = { $attribute }="{ $uri }" နူ DoenetML ကေတ် ဟွံဂွံ

external-doenetml-type-mismatch = { $attribute }="{ $uri }" နူ ကေတ်လဝ် DoenetML ဟွံဒးရး - component type "{ $componentType }" ကု ဟွံတုပ်

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] attribute `{ $from }` ဂှ် ဟွံသုၚ်စောဲယျ; `{ $to }` သုၚ်စောဲညိ။
       *[other] [deprecation] `<{ $component }>` ပ္ဍဲ attribute `{ $from }` ဂှ် ဟွံသုၚ်စောဲယျ; `{ $to }` သုၚ်စောဲညိ။
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` ကီု စၟတ်သမ္တီလဝ်ဟိုတ်နူ attribute `{ $from }` ဂှ် ဟွံသုၚ်စောဲယျ တုဲ ဟွံသုၚ်စောဲ။
       *[other] [deprecation] `{ $to }` ကီု စၟတ်သမ္တီလဝ်ဟိုတ်နူ `<{ $component }>` ပ္ဍဲ attribute `{ $from }` ဂှ် ဟွံသုၚ်စောဲယျ တုဲ ဟွံသုၚ်စောဲ။
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` ပ္ဍဲ attribute `{ $attribute }` ဂှ် ဟွံသုၚ်စောဲယျ တုဲ ဟွံသုၚ်စောဲ။

deprecated-attribute-to-child = [deprecation] `<{ $component }>` ပ္ဍဲ attribute `{ $attribute }` ဂှ် ဟွံသုၚ်စောဲယျ; `<{ $child }>` ကောန်ဇာတ် သုၚ်စောဲညိ။

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` ပ္ဍဲ attribute `{ $attribute }` နူ တန်ဖိုး `{ $value }` ဂှ် ဟွံသုၚ်စောဲယျ; `{ $to }` သုၚ်စောဲညိ။


## Language coverage

pluralize-english-only = `<pluralize>` ဂှ် အၚ်္ဂလိက် ဘာသာဟေၚ် ဂၞန်ဂၠိုၚ် ကၠောန်မာန်တုဲ၊ { $locale } နကဵု မချူလဝ် document ပ္ဍဲ ဍေံနူ text ဂှ် ဟွံပြံၚ်လှာဲ။ ဂၞန်ဂၠိုၚ် ဗီုပြၚ် ဗွဲမ္ၚးဒမြိပ် ချူညိ ဟွံသေၚ် attribute `pluralForm` နကဵု စွံညိ။


## Checking against the schema

schema-element-unrecognized = element `<{ $tag }>` ဂှ် Doenet element မတီကေတ် ဟွံသေၚ်။

schema-element-not-allowed-at-root = element `<{ $tag }>` ဂှ် document နူ root ပ္ဍဲ စုတ် ဟွံဂွံ။

schema-element-not-allowed-inside = element `<{ $tag }>` ဂှ် `<{ $parent }>` ပ္ဍဲ စုတ် ဟွံဂွံ။

schema-attribute-unrecognized = element `<{ $tag }>` ဂှ် `{ $attribute }` ယၟု မနွံ attribute ဟွံမွဲ။

schema-attribute-value-not-allowed =
    { $isList ->
        [true] element `<{ $tag }>` နူ attribute `{ $attribute }` ဂှ် တၞး နာနာ ဏအ် နူ မွဲမွဲ မဒှ် list ဒးဒှ်: { $allowed }
       *[other] element `<{ $tag }>` နူ attribute `{ $attribute }` ဂှ် ဏအ် နူ မွဲမွဲ ဒးဒှ်: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select သွက် variant name ဟွံဒးရး။ variant name { $variantName } ဂှ် option { $numOptions } ပ္ဍဲ နွံကီုလေဝ် ရုဲဂၞန် ဂှ် { $numToSelect } ဒှ်ရ။

select-variant-name-without-options = select သွက် variant လ္ၚဵု စၟတ်သမ္တီလဝ်ကီုလေဝ် မဒှ်မာန် variant name သွက် option ဟွံမွဲ: { $variantName }။

select-variant-name-not-possible = select သွက် မစၟတ်သမ္တီလဝ် variant name { $variantName } ဂှ် မဒှ်မာန် variant name ဟွံသေၚ်။

select-too-few-options = { $numOptions } ဟေၚ် နူ component { $numToSelect } ရုဲ ဟွံဂွံ။

select-from-sequence-too-few-values = ဇမၠိၚ် { $length } မနွံ sequence နူ တန်ဖိုး { $numToSelect } ရုဲ ဟွံဂွံ။

select-from-sequence-indices-count-mismatch = select သွက် မစၟတ်သမ္တီလဝ် indices ဂၞန် ဂှ် ရုဲဂၞန် ကု ဒးတုပ်

select-from-sequence-indices-not-integers = select သွက် မစၟတ်သမ္တီလဝ် indices နာနာ ဂှ် integer ဒးဒှ်

select-from-sequence-index-excluded = selectfromsequence နူ မစၟတ်သမ္တီလဝ် index ဂှ် ပတိတ်လဝ်ရ

select-from-sequence-indices-excluded-combination = selectfromsequence နူ မစၟတ်သမ္တီလဝ် indices ဂှ် ပတိတ်လဝ် combination ဒှ်ရ

select-from-sequence-coprime-not-positive-integers = ဂၠိုၚ်နူသုည integer ဟွံရုဲဟိုတ်နူ coprime combination ရုဲ ဟွံဂွံ။

select-from-sequence-coprime-common-factor = coprime number ရုဲ ဟွံဂွံ။ မဒှ်မာန် တန်ဖိုး နာနာ ဂှ် ကောန်ဂၞန် တုပ် နွံရ။ (မစၟတ်သမ္တီလဝ် "from" ဟွံသေၚ် "to" ဂှ် "step" ကု coprime ဒးဒှ်။)

select-from-sequence-coprime-single-number = 1 ဟွံသေၚ် number မွဲဓဝ် နူ coprime combination ရုဲ ဟွံဂွံ။

select-from-sequence-excluded-too-many-combinations = selectFromSequence ပ္ဍဲ combination 70% ဂၠိုၚ်နူ ပတိတ်လဝ်ရ

select-from-sequence-coprime-none-found = coprime number ရုဲ ဟွံဂွံ။ မဒှ်မာန် တန်ဖိုး နာနာ ဂှ် ကောန်ဂၞန် တုပ် နွံရ။

select-from-sequence-too-few-unique-values = ဇမၠိၚ် { $numPossibleValues } မနွံ sequence နူ unique တန်ဖိုး { $numToSelect } ရုဲ ဟွံဂွံ

select-prime-numbers-too-few-values = ဇမၠိၚ် { $numValues } မနွံ prime စရၚ် နူ တန်ဖိုး { $numToSelect } ရုဲ ဟွံဂွံ

select-prime-numbers-values-count-mismatch = select သွက် မစၟတ်သမ္တီလဝ် တန်ဖိုး ဂၞန် ဂှ် ရုဲဂၞန် ကု ဒးတုပ်

select-prime-numbers-values-not-prime = select prime number သွက် မစၟတ်သမ္တီလဝ် တန်ဖိုး နာနာ ဂှ် prime စရၚ် ပ္ဍဲ ဒးနွံ

select-prime-numbers-values-excluded-combination = selectPrimeNumbers နူ မစၟတ်သမ္တီလဝ် တန်ဖိုး ဂှ် ပတိတ်လဝ် combination ဒှ်ရ

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ပ္ဍဲ combination 70% ဂၠိုၚ်နူ ပတိတ်လဝ်ရ

select-random-combination-fluke = ဗွဲမဟွံဒှ်မာန်ဂတိုၚ် random တန်ဖိုး နူ combination ရုဲ ဟွံဂွံ

select-random-value-fluke = ဗွဲမဟွံဒှ်မာန်ဂတိုၚ် random တန်ဖိုး ရုဲ ဟွံဂွံ

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] `<{ $component }>` ဏအ် ဟွံထ္ၜး၊ ဟိုတ်နူ math ပ္ဍဲ နွံကီုလေဝ် `inline` ဟွံသေၚ်။ `inline` စုတ်ညိ၊ ဂှ်မ္ဂး expression ပ္ဍဲ လုပ်ဂွံ drop-down list ဒှ်အာရ။
        [expanded] `<{ $component }>` ဏအ် ဟွံထ္ၜး၊ ဟိုတ်နူ math ပ္ဍဲ နွံတုဲ `expanded` ဒှ်မံၚ်။ `expanded` ပတိတ်ညိ; လ္တူဗွဲမဂၠိုၚ်တၞး ကွက် ဂှ် expression ပ္ဍဲ ဟွံလုပ်။
        [on-graph] `<{ $component }>` ဏအ် ဟွံထ္ၜး၊ ဟိုတ်နူ graph လ္တူ မဓဇက်လဝ် math ပ္ဍဲ နွံတုဲ input သွက် ဒၞာဲ ဟွံမွဲ။
       *[relative-width] `<{ $component }>` ဏအ် ဟွံထ္ၜး၊ ဟိုတ်နူ math ပ္ဍဲ နွံတုဲ relative width နွံ။ `px` ဗီု ခဏ်လၟိဟ်တၟေၚ် နကဵု width ကဵုညိ။
    }
