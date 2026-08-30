# Shan (လိၵ်ႈတႆး) warnings and errors. Translated from
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
# modern reformed Shan orthography with the Shan letters ၵ ၶ ၸ ၺ ၼ ပ ၽ ၾ ႁ ဢ,
# the Shan vowels ႃ ႄ ႅ ႆ ွ ႂ and the Shan tone marks ႇ ႈ း ႉ ႊ — never their
# Burmese look-alikes — and spaces between words.
#
# **Every DoenetML name stays in English exactly as written**: `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `selectFromSequence`, every
# tag and every attribute. They are part of the language rather than prose.
#
# **This file is a Shan frame around English technical nouns**, and it is the
# most heavily loaned of the four. A diagnostic names DoenetML objects almost
# every time it opens its mouth — component, attribute, function, sequence,
# variant, reference, index — and Shan has no established word for any of
# them, so they stay in Latin letters as the classroom leaves them. What is
# Shan is the sentence: the verb-first predicate, the postposed relative ဢၼ်,
# and a small fixed set of phrases used the same way throughout, so that a
# corrector can fix one pattern in one place:
#
#   * «X ဢမ်ႇထုၵ်ႇမႅၼ်ႈ» — X is invalid
#   * «ဢမ်ႇဢဝ်ၸႂ်ႉ» — ignored
#   * «ဢမ်ႇလႆႈ» — cannot
#   * «လူဝ်ႇ» — must
#   * «ပႆႇႁဵတ်းဝႆႉ» — has not been implemented
#   * «ႁႃဢမ်ႇႁၼ်» — cannot find
#   * «ယွၼ်ႉဝႃႈ» — because
#   * «မၵ်းမၼ်ႈ» — to specify
#   * «ဢၼ်မၵ်းမၼ်ႈဝႆႉ» — specified
#
# The Burmese loans, in Burmese spelling, are သတိပေးချက် (warning),
# အချက်အလက် (information), အမှတ် (point) and ဇယား (table); everything else
# non-Shan is English in Latin letters.
#
# **What this catalog does not know.** Shan has no settled terminology for
# software diagnostics, and this seed did not invent one. Where English says
# "prescribed", "overprescribed", "coprime", "eigenvalue" or "circular
# dependency", the Shan around the English term is a paraphrase of what the
# sentence means rather than a translation of the term, and a speaker with the
# mathematical register will want to rewrite those. They are marked by the
# English word standing bare in the sentence.
#
# **Counting.** CLDR has no plural data for `shn`. Every count select English
# writes is collapsed to a single `*[other]`, because Shan leaves a noun
# unmarked after a numeral and a category branch here would be text chosen by
# English's rules. No `[zero]`, `[one]`, `[two]`, `[few]` or `[many]` branch
# appears anywhere in these four files.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] { $attributes } ဢမ်ႇဢဝ်ၸႂ်ႉ မိူဝ်ႈမၵ်းမၼ်ႈ endpoint သွင်ဢၼ်
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] { $attributes } ဢမ်ႇဢဝ်ၸႂ်ႉ မိူဝ်ႈမၵ်းမၼ်ႈ endpoint လႄႈ midpoint ႁူမ်ႈၵၼ်
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ဢမ်ႇမီးၽွၼ်းလီ သင်ဢမ်ႇမီး midpoint

## `<line>`

line-points-undetermined-dimensions = သဵၼ်ႈ ဢၼ်လတ်းၽၢၼ်ႇ အမှတ် ဢၼ်ဢမ်ႇမၵ်းမၼ်ႈ dimension ဝႆႉ။

line-points-too-few-dimensions = သဵၼ်ႈ လူဝ်ႇလတ်းၽၢၼ်ႇ အမှတ် ဢၼ်မီး dimension ဢမ်ႇယွမ်းသွင်ဢၼ်။

line-points-depend-on-variables = သဵၼ်ႈ လတ်းၽၢၼ်ႇ အမှတ် ဢၼ်ၶိုၼ်းၸွမ်း variable: { $variables }။

line-equation-invalid-format = ႁၢင်ႈႁႅၼ်း ၶွင် equation ၶွင်သဵၼ်ႈ ၼႂ်း variable { $variable1 } လႄႈ { $variable2 } ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။

## `<ray>`

ray-overprescribed-through = ray ၺႃးမၵ်းမၼ်ႈ လူၺ်ႈ through, endpoint လႄႈ direction ႁူမ်ႈၵၼ်။ through ဢၼ်မၵ်းမၼ်ႈဝႆႉ ဢမ်ႇဢဝ်ၸႂ်ႉ။

ray-dimension-mismatch = numDimensions ၼႂ်း ray ဢမ်ႇမႅၼ်ႈၵၼ်။

## `<vector>`

vector-overprescribed-head = vector ၺႃးမၵ်းမၼ်ႈ လူၺ်ႈ head, tail လႄႈ displacement ႁူမ်ႈၵၼ်။ head ဢၼ်မၵ်းမၼ်ႈဝႆႉ ဢမ်ႇဢဝ်ၸႂ်ႉ။

vector-dimension-mismatch = numDimensions ၼႂ်း vector ဢမ်ႇမႅၼ်ႈၵၼ်။

## Attracting and constraining

attract-to-without-nearest-point = ဢမ်ႇလႆႈ attract ၸူး `<{ $component }>` ယွၼ်ႉဝႃႈ မၼ်းဢမ်ႇမီး state variable nearestPoint။

constrain-to-without-nearest-point = ဢမ်ႇလႆႈ constrain ၸူး `<{ $component }>` ယွၼ်ႉဝႃႈ မၼ်းဢမ်ႇမီး state variable nearestPoint။

constrain-to-interior-without-nearest-point = ဢမ်ႇလႆႈ constrain ၸူး ၼႂ်း `<{ $component }>` ယွၼ်ႉဝႃႈ မၼ်းဢမ်ႇမီး state variable nearestPoint။

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ဢမ်ႇဢဝ်ၸႂ်ႉ တႃႇ choiceInput ဢၼ်ဢမ်ႇပဵၼ် inline

## Ordering children by index

choice-input-indices-count-mismatch = indices ဢၼ်မၵ်းမၼ်ႈဝႆႉ တႃႇ choiceInput ဢမ်ႇဢဝ်ၸႂ်ႉ ယွၼ်ႉဝႃႈ ႁူဝ်ၼပ်ႉ indices ဢမ်ႇမႅၼ်ႈၵၼ်တင်း ႁူဝ်ၼပ်ႉ choice လုၵ်ႈဢွၼ်ႇ။

pretzel-indices-count-mismatch = indices ဢၼ်မၵ်းမၼ်ႈဝႆႉ တႃႇ problem ဢမ်ႇဢဝ်ၸႂ်ႉ ယွၼ်ႉဝႃႈ ႁူဝ်ၼပ်ႉ indices ဢမ်ႇမႅၼ်ႈၵၼ်တင်း ႁူဝ်ၼပ်ႉ problem လုၵ်ႈဢွၼ်ႇ။

shuffle-indices-count-mismatch = indices ဢၼ်မၵ်းမၼ်ႈဝႆႉ တႃႇ shuffle ဢမ်ႇဢဝ်ၸႂ်ႉ ယွၼ်ႉဝႃႈ ႁူဝ်ၼပ်ႉ indices ဢမ်ႇမႅၼ်ႈၵၼ်တင်း ႁူဝ်ၼပ်ႉ component။

indices-ignored-out-of-range = indices ဢၼ်မၵ်းမၼ်ႈဝႆႉ တႃႇ { $component } ဢမ်ႇဢဝ်ၸႂ်ႉ ယွၼ်ႉဝႃႈ index လၢႆဢၼ် ပူၼ်ႉၶွပ်ႇ။

pretzel-indices-repeated = indices ဢၼ်မၵ်းမၼ်ႈဝႆႉ တႃႇ pretzel ဢမ်ႇဢဝ်ၸႂ်ႉ ယွၼ်ႉဝႃႈ index လၢႆဢၼ် သမ်ႉၶႃႈသွၼ်ႉၵၼ်။

pretzel-circuit-first-index = indices ဢၼ်မၵ်းမၼ်ႈဝႆႉ တႃႇ pretzel ၼႂ်း circuit mode ဢမ်ႇဢဝ်ၸႂ်ႉ ယွၼ်ႉဝႃႈ index ဢွၼ်တၢင်းသုတ်း လူဝ်ႇပဵၼ် 1။

## `<shuffle>` and `<sort>`

string-children-need-type = တႃႇ `<{ $component }>` ႁဵတ်းၵၢၼ်လႆႈ လူၺ်ႈ string လုၵ်ႈဢွၼ်ႇ လူဝ်ႇမၵ်းမၼ်ႈ attribute `type`။

invalid-type-defaulting-to-math = type { $type } ဢမ်ႇထုၵ်ႇမႅၼ်ႈ တႃႇ component { $component }။ လူဝ်ႇပဵၼ် math, text, number ဢမ်ႇၼၼ် boolean။ ၸႂ်ႉ math ပဵၼ် default။

string-not-valid-component-to-arrange = string "{ $value }" ဢမ်ႇပဵၼ် component ဢၼ်ႁဵတ်း { $component } လႆႈ။ ဢမ်ႇဢဝ်ၸႂ်ႉ။

## Types and variables

invalid-type-defaulting-to-number = type { $type } ဢမ်ႇထုၵ်ႇမႅၼ်ႈ၊ တင်ႈ type ပဵၼ် number။

invalid-variable-value = တူဝ်ၵႃႈ ၶွင် variable ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: `{ $value }`

## Variants

variant-index-must-be-number = variant index { $index } လူဝ်ႇပဵၼ် number

variant-index-must-be-integer = variant index { $index } လူဝ်ႇပဵၼ် integer

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ပႆႇႁဵတ်းဝႆႉ တႃႇ ၶၼႃးဢၼ်တၢႆတူဝ်။ တင်ႈ width ပဵၼ် relative။

side-by-side-absolute-margins = `<{ $component }>` ပႆႇႁဵတ်းဝႆႉ တႃႇ ၶၼႃးဢၼ်တၢႆတူဝ်။ တင်ႈ margin ပဵၼ် relative။

side-by-side-no-block-child = `<{ $component }>` ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: လူဝ်ႇမီး block လုၵ်ႈဢွၼ်ႇ ဢမ်ႇယွမ်းၼိုင်ႈဢၼ်။

## `<label>`

label-for-ignored-on-graphical = attribute `for` ၼိူဝ် `<label>` ဢၼ်ပဵၼ်ႁၢင်ႈ ဢမ်ႇဢဝ်ၸႂ်ႉ။

label-for-must-resolve-to-one = attribute `for` ၼိူဝ် `<label>` လူဝ်ႇၸီႉၼႄ component ဢၼ်ၼိုင်ႈလဵဝ်။

label-for-unresolved = attribute `for` ၼိူဝ် `<label>` ၸီႉၼႄ component ဢမ်ႇလႆႈ။

label-for-answer-with-authored-inputs = attribute `for` ၼိူဝ် `<label>` ၸီႉၼႄ `<answer>` ဢၼ်မီး input ဢၼ်ၽူႈတႅမ်ႈသႂ်ႇဝႆႉ၊ ၸီႉၼႄ input ၼၼ်ႉ သိုဝ်ႈသိုဝ်ႈ။

label-for-answer-without-input = attribute `for` ၼိူဝ် `<label>` ၸီႉၼႄ `<answer>` ဢၼ်ဢမ်ႇမီး input တႃႇ label။

label-for-must-reference-input-or-answer = attribute `for` ၼိူဝ် `<label>` လူဝ်ႇၸီႉၼႄ input ဢမ်ႇၼၼ် answer။

## Accessibility

accessibility-short-description-or-decorative = တႃႇ accessibility, `<{ $component }>` လူဝ်ႇမီး ၶေႃႈပွင်ႇပွတ်း ဢမ်ႇၼၼ် လူဝ်ႇမၵ်းမၼ်ႈပဵၼ် decorative။

accessibility-video-short-description = တႃႇ accessibility, `<video>` လူဝ်ႇမီး ၶေႃႈပွင်ႇပွတ်း။

accessibility-input-short-description-or-label = တႃႇ accessibility, `<{ $component }>` လူဝ်ႇမီး ၶေႃႈပွင်ႇပွတ်း ဢမ်ႇၼၼ် label။

accessibility-answer-input-short-description-or-label = တႃႇ accessibility, `<answer>` ဢၼ်သၢင်ႈ input လူဝ်ႇမီး ၶေႃႈပွင်ႇပွတ်း ဢမ်ႇၼၼ် label။

accessibility-short-description-contains-math = ၶေႃႈပွင်ႇပွတ်း ဢမ်ႇထုၵ်ႇလီမီး math component ၸိူင်ႉၼင်ႇ `<{ $component }>`။ တႅမ်ႈ math လူၺ်ႈ ၵႂၢမ်း။

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } မီး contrast ဢမ်ႇၵုမ်ႇထူၼ်ႈ တႃႇ text ႁူဝ်ၶေႃႈ ၶွင် section (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; လူဝ်ႇမီး ဢမ်ႇယွမ်း { $threshold }:1)။
       *[other] { $colorName } မီး contrast ဢမ်ႇၵုမ်ႇထူၼ်ႈ တႃႇ text ႁူဝ်ၶေႃႈ ၶွင် section ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; လူဝ်ႇမီး ဢမ်ႇယွမ်း { $threshold }:1)။
    }

## `<circle>`

circle-through-points-non-numerical = ပႆႇႁဵတ်းဝႆႉ `<circle>` ဢၼ်လတ်းၽၢၼ်ႇ အမှတ် { $count } ဢၼ် မိူဝ်ႈ အမှတ် ဢမ်ႇမီးတူဝ်ၵႃႈ ဢၼ်ပဵၼ်ၼပ်ႉ။

circle-too-many-through-points = ၼပ်ႉဢမ်ႇလႆႈ စက်ဝိုင်း ဢၼ်လတ်းၽၢၼ်ႇ အမှတ် ၼမ်လိူဝ် 3 ဢၼ်။

circle-overprescribed-radius-center-points = ၼပ်ႉဢမ်ႇလႆႈ စက်ဝိုင်း ဢၼ်မၵ်းမၼ်ႈ radius, center လႄႈ through point ႁူမ်ႈၵၼ်။

circle-center-with-multiple-points = ၼပ်ႉဢမ်ႇလႆႈ စက်ဝိုင်း ဢၼ်မီး center မၵ်းမၼ်ႈဝႆႉ သေလတ်းၽၢၼ်ႇ အမှတ် ၼမ်လိူဝ် 1 ဢၼ်။

circle-radius-too-small = ၼပ်ႉဢမ်ႇလႆႈ စက်ဝိုင်း: ၶၢဝ်းတၢင်း ၼႂ်းၵႄႈ အမှတ် သွင်ဢၼ် ပဵၼ် { $distance } လႄႈ radius { $radius } ဢၼ်မၵ်းမၼ်ႈဝႆႉ ၼၼ်ႉ ဢွၼ်ႇလူင်း။

circle-radius-with-many-points = သၢင်ႈဢမ်ႇလႆႈ စက်ဝိုင်း ဢၼ်လတ်းၽၢၼ်ႇ အမှတ် ၼမ်လိူဝ်သွင်ဢၼ် လူၺ်ႈ radius ဢၼ်မၵ်းမၼ်ႈဝႆႉ။

circle-invalid-center-or-through-points = center ဢမ်ႇၼၼ် through point ၶွင် စက်ဝိုင်း ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။

circle-radius-center-with-multiple-points = ၼပ်ႉဢမ်ႇလႆႈ radius ၶွင် စက်ဝိုင်း ဢၼ်မီး center မၵ်းမၼ်ႈဝႆႉ သေလတ်းၽၢၼ်ႇ အမှတ် ၼမ်လိူဝ် 1 ဢၼ်။

circle-change-radius-non-numerical = လႅၵ်ႈဢမ်ႇလႆႈ radius ၶွင် စက်ဝိုင်း ဢၼ်မီး through point ဢမ်ႇပဵၼ်ၼပ်ႉ

circle-radius-with-points-non-numerical = သၢင်ႈဢမ်ႇလႆႈ စက်ဝိုင်း ဢၼ်လတ်းၽၢၼ်ႇ အမှတ် ၼမ်လိူဝ်ၼိုင်ႈဢၼ် လူၺ်ႈ radius ဢၼ်မၵ်းမၼ်ႈဝႆႉ မိူဝ်ႈဢမ်ႇမီးတူဝ်ၵႃႈ ဢၼ်ပဵၼ်ၼပ်ႉ။

circle-change-center-non-numerical = ပႆႇႁဵတ်းဝႆႉ ၵၢၼ်လႅၵ်ႈ center ၶွင် စက်ဝိုင်း ဢၼ်လတ်းၽၢၼ်ႇ အမှတ် ဢၼ်ဢမ်ႇပဵၼ်ၼပ်ႉ။

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] dimension ၶွင် domain တႃႇ function ဢမ်ႇၵုမ်ႇထူၼ်ႈ။ domain မီး interval { $intervals } ဢၼ် သေတႃႉ function မီး input { $inputs } ဢၼ်။
    }

function-domain-invalid-format = ႁၢင်ႈႁႅၼ်း ၶွင် domain တႃႇ function ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။

function-ignoring-non-numerical =
    { $type ->
        [maximum] maximum ၶွင် function ဢၼ်ဢမ်ႇပဵၼ်ၼပ်ႉ ဢမ်ႇဢဝ်ၸႂ်ႉ။
        [minimum] minimum ၶွင် function ဢၼ်ဢမ်ႇပဵၼ်ၼပ်ႉ ဢမ်ႇဢဝ်ၸႂ်ႉ။
        [extremum] extremum ၶွင် function ဢၼ်ဢမ်ႇပဵၼ်ၼပ်ႉ ဢမ်ႇဢဝ်ၸႂ်ႉ။
        [point] အမှတ် ၶွင် function ဢၼ်ဢမ်ႇပဵၼ်ၼပ်ႉ ဢမ်ႇဢဝ်ၸႂ်ႉ။
        [slope] slope ၶွင် function ဢၼ်ဢမ်ႇပဵၼ်ၼပ်ႉ ဢမ်ႇဢဝ်ၸႂ်ႉ။
       *[other] { $type } ၶွင် function ဢၼ်ဢမ်ႇပဵၼ်ၼပ်ႉ ဢမ်ႇဢဝ်ၸႂ်ႉ။
    }

function-ignoring-empty =
    { $type ->
        [maximum] maximum ၶွင် function ဢၼ်ပဝ်ႇ ဢမ်ႇဢဝ်ၸႂ်ႉ။
        [minimum] minimum ၶွင် function ဢၼ်ပဝ်ႇ ဢမ်ႇဢဝ်ၸႂ်ႉ။
        [extremum] extremum ၶွင် function ဢၼ်ပဝ်ႇ ဢမ်ႇဢဝ်ၸႂ်ႉ။
        [point] အမှတ် ၶွင် function ဢၼ်ပဝ်ႇ ဢမ်ႇဢဝ်ၸႂ်ႉ။
       *[other] { $type } ၶွင် function ဢၼ်ပဝ်ႇ ဢမ်ႇဢဝ်ၸႂ်ႉ။
    }

function-points-too-close = function မီး အမှတ် သွင်ဢၼ် ဢၼ်တီႈယူႇၸမ်ၵၼ်ပူၼ်ႉတီႈ။ မၵ်းမၼ်ႈ function ဢမ်ႇလႆႈ။

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] function iterate ပဵၼ်လႆႈ ၵူၺ်းမိူဝ်ႈ ႁူဝ်ၼပ်ႉ input ၶွင် function မႅၼ်ႈၵၼ်တင်း ႁူဝ်ၼပ်ႉ output။ function ဢၼ်ၼႆႉ မီး input { $inputs } ဢၼ် လႄႈ output { $outputs } ဢၼ်။
    }

## `<sequence>`

sequence-invalid-length = length ၶွင် sequence ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။ လူဝ်ႇပဵၼ် integer ဢၼ်ဢမ်ႇလူင်းတႂ်ႈသုၼ်။

sequence-invalid-step = step ၶွင် sequence ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။ တႃႇ sequence type { $type } လူဝ်ႇပဵၼ် number။

sequence-invalid-endpoint-number = "{ $attribute }" ၶွင် number sequence ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။ လူဝ်ႇပဵၼ် number။

sequence-invalid-endpoint-letters = "{ $attribute }" ၶွင် letters sequence ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။ လူဝ်ႇပဵၼ် တူဝ်လိၵ်ႈ ႁူမ်ႈၵၼ်။

sequence-invalid-endpoint = "{ $attribute }" ၶွင် sequence ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။

select-from-sequence-coprime-not-numbers = coprime ဢမ်ႇဢဝ်ၸႂ်ႉ ယွၼ်ႉဝႃႈ ဢမ်ႇလိူၵ်ႈ number

select-from-sequence-coprime-with-exclude-combinations = coprime ဢမ်ႇဢဝ်ၸႂ်ႉ ယွၼ်ႉဝႃႈ မီး excludeCombinations မၵ်းမၼ်ႈဝႆႉ

## Resolving a `target`

target-not-found = target တႃႇ `<{ $source }>` ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: ႁႃဢမ်ႇႁၼ် target။

target-state-variable-not-found = target တႃႇ `<{ $source }>` ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: ႁႃဢမ်ႇႁၼ် state variable ၸိုဝ်ႈ "{ $property }" ၼိူဝ် `<{ $component }>`။

## `<odeSystem>`

ode-system-variables-match-independent = variable ၶွင် `<odeSystem>` လူဝ်ႇပႅၵ်ႈၵၼ်တင်း independent variable။

ode-system-duplicate-variable-names = မၵ်းမၼ်ႈဢမ်ႇလႆႈ ODE RHS function ဢၼ်မီး ၸိုဝ်ႈ dependent variable ၶႃႈသွၼ်ႉၵၼ်။

ode-system-rhs-function-error = မၵ်းမၼ်ႈဢမ်ႇလႆႈ ODE RHS function။ ၽိတ်းပိူင်ႈ မိူဝ်ႈသၢင်ႈ mathjs function။

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = မၵ်းမၼ်ႈဢမ်ႇလႆႈ ၸဵင်ႇ ၼႂ်းၵႄႈ သဵၼ်ႈ { $count } သဵၼ်ႈ

angle-invalid-through-point = အမှတ် ၼႂ်း through ၶွင် `<angle>` ဢမ်ႇထုၵ်ႇမႅၼ်ႈ

parabola-vertex-too-many-points = ပႆႇႁဵတ်းဝႆႉ parabola ဢၼ်မီး vertex သေလတ်းၽၢၼ်ႇ အမှတ် ၼမ်လိူဝ် 1 ဢၼ်။

parabola-too-many-points = ပႆႇႁဵတ်းဝႆႉ parabola ဢၼ်လတ်းၽၢၼ်ႇ အမှတ် ၼမ်လိူဝ် 3 ဢၼ်။

intersection-too-many-items = ပႆႇႁဵတ်းဝႆႉ intersection တႃႇ ဢၼ်ၼမ်လိူဝ်သွင်ဢၼ်

## Other math components

ionic-compound-not-two-ions = ပႆႇႁဵတ်းဝႆႉ ionic compound တႃႇ ဢၼ်ပႅၵ်ႈသေ ion သွင်ဢၼ်။

ionic-compound-needs-cation-and-anion = ionic compound ႁဵတ်းဝႆႉ တႃႇ cation ဢၼ်ၼိုင်ႈလႄႈ anion ဢၼ်ၼိုင်ႈ ၵူၺ်း။

solve-equations-cannot-evaluate = ၵႄႈဢမ်ႇလႆႈ equation ယွၼ်ႉဝႃႈ ၼပ်ႉဢမ်ႇလႆႈ equation: { $equation }

math-operators-operand-number-required = လူဝ်ႇမၵ်းမၼ်ႈ operandNumber မိူဝ်ႈဢဝ်ဢွၵ်ႇ math operand။

eigen-decomposition-failed = ၼပ်ႉဢမ်ႇလႆႈ eigenvalue ၶွင် matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: parameter { $parameters } ဢမ်ႇမီးၼႂ်း pattern လႄႈ တေမႅၼ်ႈၵၼ်တင်း ဢၼ်ပဝ်ႇ ၵူႈပွၵ်ႈ။
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ဢဝ်ပွင်ႇဢမ်ႇလႆႈ grid="{ $grid }"။ လူဝ်ႇပဵၼ် none, medium, dense ဢမ်ႇၼၼ် number ဢၼ်လိူဝ်သုၼ် သွင်ဢၼ် ဢၼ်မီးၶၢဝ်ႇဝႆႉ ၸိူင်ႉၼင်ႇ grid="1 0.5"။ ဢမ်ႇတမ်း grid သင်။

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` လူဝ်ႇ function ဢၼ်မီး { $expected ->
        [1] output ဢၼ်ၼိုင်ႈ၊ slope y' တီႈၵူႈ အမှတ်၊ ၸိူင်ႉၼင်ႇ `y - x`
       *[other] output သွင်ဢၼ်၊ vector တီႈၵူႈ အမှတ်၊ ၸိူင်ႉၼင်ႇ `(y, -x)`
    }၊ ၵူၺ်းၵႃႈ function ဢၼ်ပၼ်မႃးၼၼ်ႉ မီး output { $found } ဢၼ်။ { $alternative ->
        [none] ဢမ်ႇတမ်းသင်။
       *[other] `<{ $alternative }>` ပဵၼ် component တႃႇ function ၼၼ်ႉ။ ဢမ်ႇတမ်းသင်။
    }

field-function-attribute-ignored-with-child = attribute `function` ဢမ်ႇဢဝ်ၸႂ်ႉ ယွၼ်ႉဝႃႈ function ၺႃးပၼ်ဝႆႉ ၼႂ်း component ၸွမ်း၊ ဢၼ်ၼႂ်းၼၼ်ႉ ၺႃးဢဝ်ၸႂ်ႉ။ ပၼ် function ၼိုင်ႈတၢင်းၵူၺ်း။

field-variables-ignored =
    `<{ $component }>`: attribute `variables` ၸီႉၼႄ variable ၶွင် expression ဢၼ်တႅမ်ႈဝႆႉ ၼႂ်း component သိုဝ်ႈသိုဝ်ႈ။ { $reason ->
        [function-child] function တီႈၼႆႈ ၺႃးပၼ်ပဵၼ် `<function>` လုၵ်ႈဢွၼ်ႇ ဢၼ်ၸီႉၼႄ variable ႁင်းၵူၺ်း လႄႈ `variables` ဢမ်ႇဢဝ်ၸႂ်ႉ။
       *[no-expression] ဢမ်ႇမီး expression ၸိူင်ႉၼၼ်တီႈၼႆႈ လႄႈ `variables` ဢမ်ႇဢဝ်ၸႂ်ႉ။
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ၸႂ်ႉဢမ်ႇလႆႈ ၼႂ်း prefigure renderer; ၸႂ်ႉပိူင် right-position။

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ၸႂ်ႉဢမ်ႇလႆႈ ၼႂ်း prefigure renderer; ၸႂ်ႉပိူင် top-position။

prefigure-invalid-axis-bounds = `<graph>`: axis bound တႃႇ prefigure ဢမ်ႇထုၵ်ႇမႅၼ်ႈ; ၸႂ်ႉ bbox default (-10,-10,10,10)။

prefigure-invalid-width = `<graph>`: width တႃႇ prefigure ဢမ်ႇထုၵ်ႇမႅၼ်ႈ; ၸႂ်ႉ width default 425။

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio တႃႇ prefigure ဢမ်ႇထုၵ်ႇမႅၼ်ႈ; ၸႂ်ႉ aspect ratio default 1။

prefigure-grid-spacing-too-fine = `<graph>`: ၶၢဝ်ႇ ၶွင် grid ဢွၼ်ႇပူၼ်ႉတီႈ တႃႇ ၶွပ်ႇ axis; ဢမ်ႇတမ်း grid ၼႂ်း prefigure renderer။

prefigure-annotations-not-rendered = `<graph>`: annotation တေဢမ်ႇၺႃးတမ်း မိူဝ်ႈဢမ်ႇၸႂ်ႉ PreFigure renderer။

multiple-annotations-children = ႁၼ် `<annotations>` လုၵ်ႈဢွၼ်ႇ လၢႆဢၼ် ၼႂ်း `<graph>`; ဢၼ်လိုၼ်းသုတ်း ၵူၺ်းၺႃးဢဝ်ၸႂ်ႉ။

## Referring to other components

copy-unrecognized-component-type = extend ဢမ်ႇၼၼ် copy ဢမ်ႇလႆႈ component type ဢၼ်ဢမ်ႇႁူႉၸၵ်း: { $type }။

copy-prop-not-found = ႁႃဢမ်ႇႁၼ် prop { $property } ၼိူဝ် component type { $component }

collect-no-source = ႁႃဢမ်ႇႁၼ် source တႃႇ collect။

collect-invalid-component-type = collect ဢမ်ႇလႆႈ component type `<{ $component }>` ယွၼ်ႉဝႃႈ ပဵၼ် component type ဢၼ်ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။

reference-index-unavailable = ၸီႉၼႄ index `{ $reference }` ဢမ်ႇလႆႈ

## `<callAction>`

component-action-unavailable = ႁွင်ႉ { $action } ၼိူဝ် component `{ $reference }` ဢမ်ႇလႆႈ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ႁၢင်ႈႁႅၼ်း ၶွင် data ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။ row မီးလွင်ႈယၢဝ်း ဢမ်ႇမႅၼ်ႈၵၼ်။ ႁၼ်တီႈ componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = data မီး ၸိုဝ်ႈ column ၶႃႈသွၼ်ႉၵၼ်။ ႁၼ်တီႈ componentIdx :{ $componentIdx }

data-frame-missing-column-name = data ဢမ်ႇမီး ၸိုဝ်ႈ column ဢၼ်ၼိုင်ႈ။ ႁၼ်တီႈ componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award ၶွင် answer ဢၼ်ၼႆႉ ဢိင်ၼိူဝ် ၶေႃႈတွပ်ႇ ၶွင် answer tag ႁင်းၵူၺ်း၊ ၼၼ်ႉတေႁဵတ်းႁႂ်ႈပဵၼ် လွင်ႈဢၼ်ဢမ်ႇထၢင်ႇ။

answer-max-num-attempts-in-section-wide-check-work = ၵၢၼ်တင်ႈ `maxNumAttempts` ၼိူဝ် `<answer>` ဢၼ်ယူႇၼႂ်း container ဢၼ်မီး `sectionWideCheckWork` ဢမ်ႇမီးၽွၼ်းလီ ယွၼ်ႉဝႃႈ ႁူဝ်ၼပ်ႉ ပွၵ်ႈ ၺႃးၵုမ်းလူၺ်ႈ container။ တင်ႈ `maxNumAttempts` ၼိူဝ် container ၼၼ်ႉ။

nested-section-wide-check-work-max-num-attempts = ၵၢၼ်တင်ႈ `maxNumAttempts` ၼိူဝ် container ဢၼ်မီး `sectionWideCheckWork` ဢၼ်ယူႇၼႂ်း container တၢင်ႇဢၼ် ဢၼ်မီး `sectionWideCheckWork` ၼၼ်ႉ ဢမ်ႇမီးၽွၼ်းလီ ယွၼ်ႉဝႃႈ ႁူဝ်ၼပ်ႉ ပွၵ်ႈ ၺႃးၵုမ်းလူၺ်ႈ container ဢၼ်ၼွၵ်ႈ။ တင်ႈ `maxNumAttempts` ၼိူဝ် container ဢၼ်ၼွၵ်ႈ။

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] attribute { $attributes } တေဢမ်ႇမီးၽွၼ်းလီ သင်ဢမ်ႇတင်ႈ symbolicEquality။
    }

answer-invalid-type = type တႃႇ answer ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = ယွၼ်ႉဝႃႈ component `<{ $component }>` ဢမ်ႇမီးၸိုဝ်ႈ လႄႈ ဢဝ်ၸႂ်ႉပဵၼ် attribute ၶွင် module ဢမ်ႇလႆႈ

module-attribute-name-already-defined = component `<{ $component } name="{ $name }">` ဢဝ်ၸႂ်ႉပဵၼ် attribute ၶွင် module ဢမ်ႇလႆႈ ယွၼ်ႉဝႃႈ component type `<module>` မီး attribute "{ $name }" ဝႆႉယဝ်ႉ။

conditional-content-condition-ignored = attribute `condition` ဢမ်ႇဢဝ်ၸႂ်ႉ ၼိူဝ် `<conditionalContent>` ဢၼ်မီး case ဢမ်ႇၼၼ် else လုၵ်ႈဢွၼ်ႇ။

slider-markers-type-mismatch = type ၶွင် marker ဢမ်ႇမႅၼ်ႈၵၼ်တင်း type ၶွင် slider။

pretzel-problem-needs-statement-and-answer = pretzel ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: `<problem>` ၵူႈဢၼ် လူဝ်ႇမီး `<statement>` ဢၼ်ၼိုင်ႈလႄႈ `<answer>` ဢၼ်ၼိုင်ႈ။

pretzel-circuit-first-problem-distractor = pretzel ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: ၼႂ်း mode="circuit" `<problem>` ဢွၼ်တၢင်းသုတ်း ပဵၼ် distractor ဢမ်ႇလႆႈ။

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] တူဝ်ၵႃႈ { $values } ဢမ်ႇထုၵ်ႇမႅၼ်ႈ တႃႇ attribute `{ $attribute }`; ဢမ်ႇဢဝ်ၸႂ်ႉ။
    }

attribute-must-be-references = တူဝ်ၵႃႈ `{ $value }` ဢမ်ႇထုၵ်ႇမႅၼ်ႈ တႃႇ attribute `{ $attribute }`။ attribute လူဝ်ႇမီးၽၢင်ႁၢင်ႈ ပဵၼ် reference ဢၼ်တႄႇလူၺ်ႈ `$`။

math-input-invalid-function-names = <mathInput>: ၸိုဝ်ႈ function ဢၼ်ဢမ်ႇထုၵ်ႇမႅၼ်ႈ ၼႂ်း { $attribute } ဢမ်ႇဢဝ်ၸႂ်ႉ: { $names }။ တွၼ်ႈဢၼ်ၼႄ ၶွင် ၸိုဝ်ႈၵူႈဢၼ် လူဝ်ႇမီး ဢမ်ႇယွမ်း 2 တူဝ် (တူဝ်လိၵ်ႈ ဢမ်ႇၼၼ် ဢွၼ်ႇသဵၼ်ႈ); ဢၼ်လိုၼ်း `|<mathspeak alternative>` သႂ်ႇလႆႈ ဢမ်ႇသႂ်ႇၵေႃႈလႆႈ။

## Building components from the source

component-type-invalid = component type ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: `<{ $componentType }>`

attribute-repeated = attribute { $attribute } တႅမ်ႈသွၼ်ႉၵၼ် ဢမ်ႇလႆႈ။

attribute-invalid-for-component = attribute "{ $attribute }" ဢမ်ႇထုၵ်ႇမႅၼ်ႈ တႃႇ component type `<{ $componentType }>`။

## Style definition contrast

style-definition-insufficient-contrast =
    style definition { $styleNumber } မီး contrast ဢမ်ႇၵုမ်ႇထူၼ်ႈ တႃႇ { $context ->
        [text-on-background] သီၶွင် text ၽႃႇၼင်ႇ သီၶွင် background
        [high-contrast] သီ high-contrast ၽႃႇၼင်ႇ canvas
        [line] သီၶွင် သဵၼ်ႈ ၽႃႇၼင်ႇ canvas
        [marker] သီၶွင် marker ၽႃႇၼင်ႇ canvas
       *[text-on-canvas] သီၶွင် text ၽႃႇၼင်ႇ canvas
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; လူဝ်ႇမီး ဢမ်ႇယွမ်း { $threshold }:1)။

style-definition-dark-mode-text-background-contrast =
    style definition { $styleNumber } မၵ်းမၼ်ႈ သီ ဢၼ်မီး contrast ၵုမ်ႇထူၼ်ႈ တႃႇ light mode သေတႃႉ သီ dark mode ဢၼ်ဢွၵ်ႇမႃးၼၼ်ႉ မီး contrast ဢမ်ႇၵုမ်ႇထူၼ်ႈ တႃႇ သီၶွင် text ၽႃႇၼင်ႇ သီၶွင် background ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; လူဝ်ႇမီး ဢမ်ႇယွမ်း { $threshold }:1)။ { $suggestion ->
        [available] တႃႇႁႂ်ႈ contrast ၼႂ်း dark mode ၵုမ်ႇထူၼ်ႈ ႁဵတ်းႁႂ်ႈ contrast ၶွင် light mode ၼမ်ၶိုၼ်ႈ (ၸိူင်ႉၼင်ႇ တင်ႈ { $lightAttribute }="{ $lightColor }") ဢမ်ႇၼၼ် လႅၵ်ႈသီ dark mode (ၸိူင်ႉၼင်ႇ တင်ႈ { $darkAttribute }="{ $darkColor }")။
       *[none] တႃႇႁႂ်ႈ contrast ၼႂ်း dark mode ၵုမ်ႇထူၼ်ႈ ႁဵတ်းႁႂ်ႈ contrast ၶွင် light mode ၼမ်ၶိုၼ်ႈ ဢမ်ႇၼၼ် လႅၵ်ႈသီ ဢၼ်ဢွၵ်ႇမႃးၼၼ်ႉ လူၺ်ႈ textColorDarkMode လႄႈ/ဢမ်ႇၼၼ် backgroundColorDarkMode။
    }

style-definition-dark-mode-text-canvas-contrast =
    style definition { $styleNumber } မၵ်းမၼ်ႈ သီၶွင် text ဢၼ်မီး contrast ၵုမ်ႇထူၼ်ႈ တႃႇ light mode သေတႃႉ သီၶွင် text ၼႂ်း dark mode ဢၼ်ဢွၵ်ႇမႃးၼၼ်ႉ မီး contrast ဢမ်ႇၵုမ်ႇထူၼ်ႈ ၽႃႇၼင်ႇ canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; လူဝ်ႇမီး ဢမ်ႇယွမ်း { $threshold }:1)။ { $suggestion ->
        [available] တႃႇႁႂ်ႈ contrast ၼႂ်း dark mode ၵုမ်ႇထူၼ်ႈ ႁဵတ်းႁႂ်ႈ contrast ၶွင် light mode ၼမ်ၶိုၼ်ႈ (ၸိူင်ႉၼင်ႇ တင်ႈ textColor="{ $lightColor }") ဢမ်ႇၼၼ် လႅၵ်ႈသီ dark mode (ၸိူင်ႉၼင်ႇ တင်ႈ textColorDarkMode="{ $darkColor }")။
       *[none] တႃႇႁႂ်ႈ contrast ၼႂ်း dark mode ၵုမ်ႇထူၼ်ႈ ႁဵတ်းႁႂ်ႈ contrast ၶွင် light mode ၼမ်ၶိုၼ်ႈ ဢမ်ႇၼၼ် လႅၵ်ႈသီ ဢၼ်ဢွၵ်ႇမႃးၼၼ်ႉ လူၺ်ႈ textColorDarkMode။
    }

section-multiple-style-palettes = section လိူၵ်ႈလႆႈ <stylePalette> ဢၼ်ၼိုင်ႈလဵဝ်; ဢဝ်ၸႂ်ႉ ဢၼ်လိုၼ်းသုတ်း။

## Unique variants

variant-num-to-select-not-non-negative-integer = မၵ်းမၼ်ႈဢမ်ႇလႆႈ unique variant ၶွင် { $component } ယွၼ်ႉဝႃႈ numToSelect ဢမ်ႇပဵၼ် integer ဢၼ်ဢမ်ႇလူင်းတႂ်ႈသုၼ်။

variant-num-to-select-not-constant-number = မၵ်းမၼ်ႈဢမ်ႇလႆႈ unique variant ၶွင် { $component } ယွၼ်ႉဝႃႈ numToSelect ဢမ်ႇပဵၼ် number ဢၼ်တၢႆတူဝ်။

variant-with-replacement-not-constant-boolean = မၵ်းမၼ်ႈဢမ်ႇလႆႈ unique variant ၶွင် { $component } ယွၼ်ႉဝႃႈ withReplacement ဢမ်ႇပဵၼ် boolean ဢၼ်တၢႆတူဝ်။

variant-select-weight-disables-unique = unique variant တႃႇ select ၺႃးပိၵ်ႉ သင်မီး option ဢၼ်မၵ်းမၼ်ႈ selectWeight ဢမ်ႇၼၼ် selectForVariants

variant-coprime-undetermined = မၵ်းမၼ်ႈဢမ်ႇလႆႈ unique variant ၶွင် { $component } ယွၼ်ႉဝႃႈ မၵ်းမၼ်ႈဢမ်ႇလႆႈဝႃႈ coprime ပဵၼ်ဢၼ်ဢမ်ႇမၢၼ်ႇ ၵူႈပွၵ်ႈ။

variant-attribute-not-constant = မၵ်းမၼ်ႈဢမ်ႇလႆႈ unique variant ၶွင် { $component } ယွၼ်ႉဝႃႈ { $attribute } ဢမ်ႇတၢႆတူဝ်။

variant-attribute-not-number = မၵ်းမၼ်ႈဢမ်ႇလႆႈ unique variant ၶွင် { $component } ယွၼ်ႉဝႃႈ { $attribute } ဢမ်ႇပဵၼ် number။

variant-attribute-wrong-type-for-sequence =
    မၵ်းမၼ်ႈဢမ်ႇလႆႈ unique variant ၶွင် { $component } type { $type } ယွၼ်ႉဝႃႈ { $attribute } ဢမ်ႇပဵၼ် { $expected ->
        [letters-combination] တူဝ်လိၵ်ႈ ႁူမ်ႈၵၼ်
        [math-expression] math expression ဢၼ်ထုၵ်ႇမႅၼ်ႈ
        [integer] integer
       *[number] number
    }။

variant-length-not-integer = မၵ်းမၼ်ႈဢမ်ႇလႆႈ unique variant ၶွင် { $component } ယွၼ်ႉဝႃႈ length ဢမ်ႇပဵၼ် integer။

variant-sort-not-implemented = ပႆႇႁဵတ်းဝႆႉ unique variant ၶွင် { $component } ဢၼ်မီး sort

variant-exclude-combinations-not-implemented = ပႆႇႁဵတ်းဝႆႉ unique variant ၶွင် { $component } ဢၼ်မီး excludeCombinations

variant-math-exclude-not-implemented = ပႆႇႁဵတ်းဝႆႉ unique variant ၶွင် { $component } type math ဢၼ်မီး exclude

variant-non-constant-exclude-not-implemented = ပႆႇႁဵတ်းဝႆႉ unique variant ၶွင် { $component } ဢၼ်မီး exclude ဢၼ်ဢမ်ႇတၢႆတူဝ်

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ၸႂ်ႉဢမ်ႇလႆႈ ၼႂ်း graph prefigure renderer; ၶၢမ်ႈပႅတ်ႈ ဢၼ်ယူႇတႂ်ႈ။

prefigure-descendant-invalid-geometry = { $subject }: ႁၢင်ႈႁႅၼ်း ဢမ်ႇတဵမ် ဢမ်ႇၼၼ် ဢမ်ႇမီးၶွပ်ႇ; ၶၢမ်ႈပႅတ်ႈ ဢၼ်ယူႇတႂ်ႈ။

prefigure-curve-label-omitted = { $subject }: label ၸႂ်ႉဢမ်ႇလႆႈ ၼိူဝ် curve ဢၼ်လႅၵ်ႈမႃး; ၶၢမ်ႈပႅတ်ႈ label။

prefigure-curve-unsupported-definition-type = { $subject }: curve function definition type '{ $definitionType }' ၸႂ်ႉဢမ်ႇလႆႈ; ၶၢမ်ႈပႅတ်ႈ ဢၼ်ယူႇတႂ်ႈ။

prefigure-region-flip-functions-unsupported = { $subject }: attribute flipFunctions ၼိူဝ် regionBetweenCurves ၸႂ်ႉဢမ်ႇလႆႈ; ၶၢမ်ႈပႅတ်ႈ ဢၼ်ယူႇတႂ်ႈ။

prefigure-region-non-formula-child = { $subject }: ၼိူဝ် regionBetweenCurves ၸႂ်ႉလႆႈ ၵူၺ်း function လုၵ်ႈဢွၼ်ႇ ဢၼ်ပဵၼ် formula type; ၶၢမ်ႈပႅတ်ႈ ဢၼ်ယူႇတႂ်ႈ။

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ၸႂ်ႉဢမ်ႇလႆႈ တႃႇ { $labelKind ->
        [line-family] label ၶွင် line family
       *[point] label ၶွင် အမှတ်
    }; ၸႂ်ႉ PreFigure alignment default။

prefigure-fill-style-unsupported = { $subject }: fill style '{ $fillStyle }' PreFigure ၸႂ်ႉဢမ်ႇလႆႈ; ဢဝ်ၸႂ်ႉ fill ဢၼ်တဵမ်။

prefigure-line-style-unknown = { $subject }: line style '{ $lineStyle }' ဢၼ်ဢမ်ႇႁူႉၸၵ်း ဢမ်ႇသႂ်ႇၼႂ်း PreFigure output။

prefigure-marker-style-mapped-to-diamond = { $subject }: marker style '{ $markerStyle }' လႅၵ်ႈပဵၼ် PreFigure style 'diamond'။

prefigure-marker-style-unsupported = { $subject }: marker style '{ $markerStyle }' PreFigure ၸႂ်ႉဢမ်ႇလႆႈ; ၸႂ်ႉ style default။

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ဢမ်ႇထုၵ်ႇမႅၼ်ႈ; ႁႃဢမ်ႇႁၼ် target။ ၶၢမ်ႈပႅတ်ႈ annotation။

annotation-ref-multiple-targets = `<annotation>`: `ref` ၸီႉၼႄ target လၢႆဢၼ်; ဢဝ်ၸႂ်ႉ target ဢွၼ်တၢင်းသုတ်း။

annotation-ref-outside-graph = `<annotation>`: `ref` ဢမ်ႇထုၵ်ႇမႅၼ်ႈ; target ယူႇၼွၵ်ႈ graph ဢၼ်ဢုမ်ႈဝႆႉ။ ၶၢမ်ႈပႅတ်ႈ annotation။

annotation-ref-unsupported-target = `<annotation>`: `ref` ဢမ်ႇထုၵ်ႇမႅၼ်ႈ; target ဢမ်ႇပဵၼ် ႁၢင်ႈ ဢၼ်ၸႂ်ႉလႆႈ ၼႂ်း prefigure။ ၶၢမ်ႈပႅတ်ႈ annotation။

annotation-text-missing = `<annotation>`: `text` ဢမ်ႇမီး ဢမ်ႇၼၼ် ပဝ်ႇ; ဢွၵ်ႇပၼ် text ပဝ်ႇ။

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] ႁၼ် circular dependency။
       *[other] ႁၼ် circular dependency ဢၼ်ၵဵဝ်ႇလူၺ်ႈ component `<{ $componentType }>`။
    }

reference-no-referent = ႁႃဢမ်ႇႁၼ် တီႈဢၼ် reference ၼႄ: `{ $reference }`

reference-multiple-referents = ႁၼ် တီႈဢၼ် reference ၼႄ လၢႆဢၼ်: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = ႁၢင်ႈႁႅၼ်း ၶွင် attribute { $attribute } ၶွင် `<{ $componentType }>` ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။

children-invalid = လုၵ်ႈဢွၼ်ႇ ၶွင် `<{ $componentType }>` ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: ႁၼ်လုၵ်ႈဢွၼ်ႇ ဢၼ်ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = တူဝ်ၵႃႈ `{ $value }` ဢမ်ႇထုၵ်ႇမႅၼ်ႈ တႃႇ attribute `{ $attribute }`၊ ဢဝ်ၸႂ်ႉတူဝ်ၵႃႈ `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] ႁႃဢမ်ႇႁၼ် DoenetML version { $version }။
       *[other] ႁႃဢမ်ႇႁၼ် DoenetML version { $version }။ ဢဝ်ၸႂ်ႉ version { $fallback } တႅၼ်း
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: { $content }

parse-tag-missing-close-tag = DoenetML ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: tag `{ $tag }` ဢမ်ႇမီး tag ပိၵ်ႉ။ လူဝ်ႇပဵၼ် tag ဢၼ်ပိၵ်ႉႁင်းၵူၺ်း ဢမ်ႇၼၼ် tag `</{ $tagName }>`။

parse-tag-error = DoenetML ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: ၽိတ်းပိူင်ႈ ၼႂ်း tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: attribute `{ $attribute }` ဢမ်ႇထုၵ်ႇမႅၼ်ႈ၊ ႁၼ်ဝႃႈ ဢမ်ႇမီးတူဝ်ၵႃႈ။

parse-attribute-invalid = DoenetML ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: attribute `{ $attribute }` ဢမ်ႇထုၵ်ႇမႅၼ်ႈ

parse-attribute-value-invalid = DoenetML ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: တူဝ်ၵႃႈ ၶွင် attribute `{ $value }` ဢမ်ႇထုၵ်ႇမႅၼ်ႈ

parse-attribute-value-quote-mismatch = DoenetML ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: တူဝ်ၵႃႈ ၶွင် attribute `{ $value }` ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။ ၶိူင်ႈမၢႆၶူႈ ဢမ်ႇမႅၼ်ႈၵၼ်။ ႁၼ်ဝႃႈ ဢမ်ႇမီး `{ $quote }`

parse-open-tag-name-missing = DoenetML ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: ႁၼ် tag ဢၼ်ဢမ်ႇမီးၸိုဝ်ႈ tag ၸိူင်ႉၼင်ႇ `<`

parse-tag-not-closed = DoenetML ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: tag `{ $tag }` ဢမ်ႇၺႃးပိၵ်ႉ (ႁၼ်ဝႃႈ ဢမ်ႇမီး `>`)။

parse-self-closing-tag-name-missing = DoenetML ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: ႁၼ် tag ဢၼ်ဢမ်ႇမီးၸိုဝ်ႈ tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: tag `{ $tag }` ဢမ်ႇၺႃးပိၵ်ႉ (ႁၼ်ဝႃႈ ဢမ်ႇမီး `/>`)။

parse-tag-invalid-attributes = DoenetML ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: tag `{ $tag }` ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။ ၸၢင်ႈပဵၼ် attribute ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။

parse-close-tag-name-missing = DoenetML ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: ႁၼ် tag ပိၵ်ႉ ဢၼ်ဢမ်ႇမီးၸိုဝ်ႈ tag ၸိူင်ႉၼင်ႇ `</`

parse-attribute-value-unquoted = တူဝ်ၵႃႈ ၶွင် attribute လူဝ်ႇသႂ်ႇၼႂ်း ၶိူင်ႈမၢႆၶူႈ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: ႁၼ် tag ပိၵ်ႉ `{ $tag }` သေတႃႉ ဢမ်ႇမီး tag ပိုတ်ႇ ဢၼ်မႅၼ်ႈၵၼ်

parse-close-tag-mismatched = DoenetML ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: tag ပိၵ်ႉ ဢမ်ႇမႅၼ်ႈၵၼ်။ လူဝ်ႇပဵၼ် `</{ $expected }>`။ ႁၼ် `{ $found }`

parser-node-unconvertible = လႅၵ်ႈ node { $node } ပဵၼ် Dast node ဢမ်ႇလႆႈ။

## Names

name-attribute-invalid =
    attribute name='{ $name }' ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။ { $reason ->
        [characters] ၸိုဝ်ႈ သႂ်ႇလႆႈ ၵူၺ်း တူဝ်လိၵ်ႈ, ၼပ်ႉ, ဢွၼ်ႇသဵၼ်ႈတႂ်ႈ ဢမ်ႇၼၼ် ဢွၼ်ႇသဵၼ်ႈ။
       *[start] ၸိုဝ်ႈ လူဝ်ႇတႄႇလူၺ်ႈ တူဝ်လိၵ်ႈ။
    }

component-name-invalid-start = ၸိုဝ်ႈ component "{ $name }" ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။ ၸိုဝ်ႈ လူဝ်ႇတႄႇလူၺ်ႈ တူဝ်လိၵ်ႈ။

## `<answer>` sugar

answer-video-watched-missing-video = answer type videoWatched လူဝ်ႇမီး attribute video

answer-video-watched-video-not-reference = answer type videoWatched လူဝ်ႇမီး attribute video ဢၼ်ပဵၼ် reference

answer-name-not-single-text = attribute name ၶွင် answer လူဝ်ႇမီး text လုၵ်ႈဢွၼ်ႇ ဢၼ်ၼိုင်ႈလဵဝ်

## Referencing another document

external-doenetml-recursion-limit = ဢဝ် DoenetML ၼွၵ်ႈ ဢမ်ႇလႆႈ ယွၼ်ႉဝႃႈ recursion ၼမ်ပူၼ်ႉတီႈ။ မီး circular reference ႁိုဝ်?

external-doenetml-unavailable = ဢဝ် DoenetML ဢမ်ႇလႆႈ တီႈ { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ဢၼ်ဢဝ်မႃးတီႈ { $attribute }="{ $uri }" ဢမ်ႇထုၵ်ႇမႅၼ်ႈ: မၼ်းဢမ်ႇမႅၼ်ႈၵၼ်တင်း component type "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] attribute `{ $from }` ဢမ်ႇၸႂ်ႉယဝ်ႉ; ၸႂ်ႉ `{ $to }` တႅၼ်း။
       *[other] [deprecation] attribute `{ $from }` ၼိူဝ် `<{ $component }>` ဢမ်ႇၸႂ်ႉယဝ်ႉ; ၸႂ်ႉ `{ $to }` တႅၼ်း။
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] attribute `{ $from }` ဢမ်ႇၸႂ်ႉယဝ်ႉ လႄႈ ဢမ်ႇဢဝ်ၸႂ်ႉ ယွၼ်ႉဝႃႈ မီး `{ $to }` မၵ်းမၼ်ႈဝႆႉၸွမ်း။
       *[other] [deprecation] attribute `{ $from }` ၼိူဝ် `<{ $component }>` ဢမ်ႇၸႂ်ႉယဝ်ႉ လႄႈ ဢမ်ႇဢဝ်ၸႂ်ႉ ယွၼ်ႉဝႃႈ မီး `{ $to }` မၵ်းမၼ်ႈဝႆႉၸွမ်း။
    }

deprecated-attribute-ignored = [deprecation] attribute `{ $attribute }` ၼိူဝ် `<{ $component }>` ဢမ်ႇၸႂ်ႉယဝ်ႉ လႄႈ ဢမ်ႇဢဝ်ၸႂ်ႉ။

deprecated-attribute-to-child = [deprecation] attribute `{ $attribute }` ၼိူဝ် `<{ $component }>` ဢမ်ႇၸႂ်ႉယဝ်ႉ; ၸႂ်ႉ `<{ $child }>` လုၵ်ႈဢွၼ်ႇ တႅၼ်း။

deprecated-attribute-value-renamed = [deprecation] တူဝ်ၵႃႈ `{ $value }` ၶွင် attribute `{ $attribute }` ၼိူဝ် `<{ $component }>` ဢမ်ႇၸႂ်ႉယဝ်ႉ; ၸႂ်ႉ `{ $to }` တႅၼ်း။


## Language coverage

pluralize-english-only = `<pluralize>` ႁဵတ်းလႆႈ ၵူၺ်း ၽႃႇသႃႇဢိင်းၵလဵတ်ႈ လႄႈ ၼႂ်း document ဢၼ်တႅမ်ႈလူၺ်ႈ { $locale } ၼၼ်ႉ text ၶွင်မၼ်း ယူႇၸိူင်ႉၼင်ႇၵဝ်ႇ။ တႅမ်ႈ ႁၢင်ႈၼမ် သိုဝ်ႈသိုဝ်ႈ ဢမ်ႇၼၼ် တင်ႈလူၺ်ႈ attribute `pluralForm`။


## Checking against the schema

schema-element-unrecognized = element `<{ $tag }>` ဢမ်ႇပဵၼ် element ၶွင် Doenet ဢၼ်ႁူႉၸၵ်း။

schema-element-not-allowed-at-root = element `<{ $tag }>` သႂ်ႇဢမ်ႇလႆႈ တီႈ root ၶွင် document။

schema-element-not-allowed-inside = element `<{ $tag }>` သႂ်ႇဢမ်ႇလႆႈ ၼႂ်း `<{ $parent }>`။

schema-attribute-unrecognized = element `<{ $tag }>` ဢမ်ႇမီး attribute ၸိုဝ်ႈ `{ $attribute }`။

schema-attribute-value-not-allowed =
    { $isList ->
        [true] attribute `{ $attribute }` ၶွင် element `<{ $tag }>` လူဝ်ႇပဵၼ် list ဢၼ်ဢၼ်ၼိုင်ႈလႄႈဢၼ်ၼိုင်ႈ ပဵၼ်ဢၼ်ၼိုင်ႈၼႂ်း: { $allowed }
       *[other] attribute `{ $attribute }` ၶွင် element `<{ $tag }>` လူဝ်ႇပဵၼ်ဢၼ်ၼိုင်ႈၼႂ်း: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = variant name တႃႇ select ဢမ်ႇထုၵ်ႇမႅၼ်ႈ။ variant name { $variantName } မီးၼႂ်း option { $numOptions } ဢၼ် သေတႃႉ ႁူဝ်ၼပ်ႉဢၼ်လိူၵ်ႈ ပဵၼ် { $numToSelect }။

select-variant-name-without-options = မီး variant မၵ်းမၼ်ႈဝႆႉ တႃႇ select သေတႃႉ ဢမ်ႇမီး option တႃႇ variant name ဢၼ်ပဵၼ်လႆႈ: { $variantName }။

select-variant-name-not-possible = variant name { $variantName } ဢၼ်မၵ်းမၼ်ႈဝႆႉ တႃႇ select ၼၼ်ႉ ဢမ်ႇပဵၼ် variant name ဢၼ်ပဵၼ်လႆႈ။

select-too-few-options = လိူၵ်ႈဢမ်ႇလႆႈ component { $numToSelect } ဢၼ် ၼႂ်း { $numOptions } ဢၼ်ၵူၺ်း။

select-from-sequence-too-few-values = လိူၵ်ႈဢမ်ႇလႆႈ တူဝ်ၵႃႈ { $numToSelect } ဢၼ် ၼႂ်း sequence ဢၼ်ယၢဝ်း { $length }။

select-from-sequence-indices-count-mismatch = ႁူဝ်ၼပ်ႉ indices ဢၼ်မၵ်းမၼ်ႈဝႆႉ တႃႇ select လူဝ်ႇမႅၼ်ႈၵၼ်တင်း ႁူဝ်ၼပ်ႉဢၼ်လိူၵ်ႈ

select-from-sequence-indices-not-integers = indices ဢၼ်မၵ်းမၼ်ႈဝႆႉ တႃႇ select ၵူႈဢၼ် လူဝ်ႇပဵၼ် integer

select-from-sequence-index-excluded = index ၶွင် selectfromsequence ဢၼ်မၵ်းမၼ်ႈဝႆႉၼၼ်ႉ ၺႃးဢဝ်ဢွၵ်ႇဝႆႉ

select-from-sequence-indices-excluded-combination = indices ၶွင် selectfromsequence ဢၼ်မၵ်းမၼ်ႈဝႆႉၼၼ်ႉ ပဵၼ် combination ဢၼ်ဢဝ်ဢွၵ်ႇဝႆႉ

select-from-sequence-coprime-not-positive-integers = လိူၵ်ႈဢမ်ႇလႆႈ coprime combination ယွၼ်ႉဝႃႈ ဢမ်ႇလိူၵ်ႈ integer ဢၼ်လိူဝ်သုၼ်။

select-from-sequence-coprime-common-factor = လိူၵ်ႈဢမ်ႇလႆႈ coprime number။ တူဝ်ၵႃႈ ဢၼ်ပဵၼ်လႆႈၵူႈဢၼ် မီး factor ႁူမ်ႈၵၼ်။ (တူဝ်ၵႃႈ "from" ဢမ်ႇၼၼ် "to" ဢၼ်မၵ်းမၼ်ႈဝႆႉ လူဝ်ႇပဵၼ် coprime တင်း "step"။)

select-from-sequence-coprime-single-number = လိူၵ်ႈဢမ်ႇလႆႈ coprime combination ၼႂ်း number ဢၼ်ၼိုင်ႈလဵဝ် ဢၼ်ဢမ်ႇၸႂ်ႈ 1။

select-from-sequence-excluded-too-many-combinations = ဢဝ်ဢွၵ်ႇဝႆႉ combination ၼမ်လိူဝ် 70% ၼႂ်း selectFromSequence

select-from-sequence-coprime-none-found = လိူၵ်ႈဢမ်ႇလႆႈ coprime number။ တူဝ်ၵႃႈ ဢၼ်ပဵၼ်လႆႈၵူႈဢၼ် မီး factor ႁူမ်ႈၵၼ်။

select-from-sequence-too-few-unique-values = လိူၵ်ႈဢမ်ႇလႆႈ တူဝ်ၵႃႈ unique { $numToSelect } ဢၼ် ၼႂ်း sequence ဢၼ်ယၢဝ်း { $numPossibleValues }

select-prime-numbers-too-few-values = လိူၵ်ႈဢမ်ႇလႆႈ တူဝ်ၵႃႈ { $numToSelect } ဢၼ် ၼႂ်းသဵၼ်ႈမၢႆ prime ဢၼ်ယၢဝ်း { $numValues }

select-prime-numbers-values-count-mismatch = ႁူဝ်ၼပ်ႉ တူဝ်ၵႃႈ ဢၼ်မၵ်းမၼ်ႈဝႆႉ တႃႇ select လူဝ်ႇမႅၼ်ႈၵၼ်တင်း ႁူဝ်ၼပ်ႉဢၼ်လိူၵ်ႈ

select-prime-numbers-values-not-prime = တူဝ်ၵႃႈ ဢၼ်မၵ်းမၼ်ႈဝႆႉ တႃႇ select prime number ၵူႈဢၼ် လူဝ်ႇမီးၼႂ်း သဵၼ်ႈမၢႆ prime

select-prime-numbers-values-excluded-combination = တူဝ်ၵႃႈ ၶွင် selectPrimeNumbers ဢၼ်မၵ်းမၼ်ႈဝႆႉၼၼ်ႉ ပဵၼ် combination ဢၼ်ဢဝ်ဢွၵ်ႇဝႆႉ

select-prime-numbers-excluded-too-many-combinations = ဢဝ်ဢွၵ်ႇဝႆႉ combination ၼမ်လိူဝ် 70% ၼႂ်း selectPrimeNumbers

select-random-combination-fluke = ယွၼ်ႉၶၢင်ႈပဵၼ်ယၢပ်ႇတႄႉတႄႉ လိူၵ်ႈဢမ်ႇလႆႈ combination ၶွင် တူဝ်ၵႃႈ random

select-random-value-fluke = ယွၼ်ႉၶၢင်ႈပဵၼ်ယၢပ်ႇတႄႉတႄႉ လိူၵ်ႈဢမ်ႇလႆႈ တူဝ်ၵႃႈ random

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] `<{ $component }>` ဢၼ်ၼႆႉ ဢမ်ႇၼႄ ယွၼ်ႉဝႃႈ မၼ်းယူႇၼႂ်း math သေတႃႉ ဢမ်ႇပဵၼ် `inline`။ သႂ်ႇ `inline` ႁႂ်ႈမၼ်းပဵၼ် drop-down list ဢၼ်လုၵ်ႈၼႂ်း expression။
        [expanded] `<{ $component }>` ဢၼ်ၼႆႉ ဢမ်ႇၼႄ ယွၼ်ႉဝႃႈ မၼ်းယူႇၼႂ်း math သေ ပဵၼ် `expanded`။ ဢဝ် `expanded` ဢွၵ်ႇ; ႁွင်ႈ ဢၼ်မီးလၢႆထႅဝ် ဢမ်ႇလုၵ်ႈၼႂ်း expression။
        [on-graph] `<{ $component }>` ဢၼ်ၼႆႉ ဢမ်ႇၼႄ ယွၼ်ႉဝႃႈ မၼ်းယူႇၼႂ်း math ဢၼ်တမ်းဝႆႉၼိူဝ် graph ဢၼ်ဢမ်ႇမီးတီႈတႃႇ input။
       *[relative-width] `<{ $component }>` ဢၼ်ၼႆႉ ဢမ်ႇၼႄ ယွၼ်ႉဝႃႈ မၼ်းယူႇၼႂ်း math သေ မီး width ဢၼ်ပဵၼ် relative။ ပၼ် width လူၺ်ႈ ၶၼႃးဢၼ်တၢႆတူဝ် ၸိူင်ႉၼင်ႇ `px` တႅၼ်း။
    }
