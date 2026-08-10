# Tachelhit diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# **The counted messages here write `one`, `few` and `other`**, because
# `Intl.PluralRules("shi")` reports three categories; see `content.ftl`'s
# header. Where English separates a singular from a plural only in the verb and
# Tachelhit covers both with one form, the select is dropped rather than
# written out three times identically.
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`
# and the rest — are part of the language rather than prose, and stay in
# English and in Latin letters exactly as written. So does the `[deprecation]`
# marker, and so do the digits.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } ⵜⵜⵓⵣⴳⴰⵍⵏ ⵎⴽ ⵜⵜⵓⵙⵜⴰⵢⵏⵜ ⵙⵏⴰⵜ ⵏ ⵜⵏⵇⵉⴹⵉⵏ ⵏ ⵜⴳⵉⵔⴰ

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } ⵜⵜⵓⵣⴳⴰⵍⵏ ⵎⴽ ⵜⵜⵓⵙⵜⴰⵢⵏⵜ ⵜⴰⵏⵇⵉⴹⵜ ⵏ ⵜⴳⵉⵔⴰ ⴷ ⵜⵏⵇⵉⴹⵜ ⵜⴰⵎⵎⴰⵙⵜ

line-segment-midpoint-offset-without-midpoint = midpointOffset ⵓⵔ ⴷⴰⵔⵙ ⴰⵣⴰⵍ ⴱⵍⴰ ⵜⴰⵏⵇⵉⴹⵜ ⵜⴰⵎⵎⴰⵙⵜ

## `<line>`

line-points-undetermined-dimensions = ⵉⵣⵉⵔⵉⴳ ⵉⵣⵔⵉⵏ ⵅⴼ ⵜⵏⵇⵉⴹⵉⵏ ⵏ ⵜⵙⴽⴽⵉⵔⵉⵏ ⵓⵔ ⵉⵜⵜⵓⵙⵙⴰⵏⵏ.

line-points-too-few-dimensions = ⵉⵣⵉⵔⵉⴳ ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⵣⵔⵉ ⵅⴼ ⵜⵏⵇⵉⴹⵉⵏ ⵏ ⵙⵏⴰⵜ ⵏ ⵜⵙⴽⴽⵉⵔⵉⵏ ⵏⵖ ⵓⴳⴳⴰⵔ.

line-points-depend-on-variables = ⵉⵣⵉⵔⵉⴳ ⵉⵣⵔⵉ ⵅⴼ ⵜⵏⵇⵉⴹⵉⵏ ⵉⵙⵜⵄⵎⵉⵍⵏⵉⵏ ⵉⵎⵓⵜⵉⵜⵏ: { $variables }.

line-equation-invalid-format = ⴰⵎⴰⵙⴰⵍ ⴰⵔⴰⵎⵖⵜⵓ ⵏ ⵜⴳⴷⴰ ⵏ ⵢⵉⵣⵉⵔⵉⴳ ⴳ ⵢⵉⵎⵓⵜⵉⵜⵏ { $variable1 } ⴷ { $variable2 }.

## `<ray>`

ray-overprescribed-through = ⴰⵣⵔⴰⵔ ⵢⵜⵜⵓⵙⴱⴷⴷⴰ ⵙ through, endpoint ⴷ direction.  through ⵢⵜⵜⵓⵣⴳⴰⵍ.

ray-dimension-mismatch = numDimensions ⵓⵔ ⵜⵎⵙⴰⵙⴰ ⴳ ⵓⵣⵔⴰⵔ.

## `<vector>`

vector-overprescribed-head = ⴰⴼⵉⴽⵜⵓⵔ ⵢⵜⵜⵓⵙⴱⴷⴷⴰ ⵙ head, tail ⴷ displacement.  head ⵢⵜⵜⵓⵣⴳⴰⵍ.

vector-dimension-mismatch = numDimensions ⵓⵔ ⵜⵎⵙⴰⵙⴰ ⴳ ⵓⴼⵉⴽⵜⵓⵔ.

## Attracting and constraining

attract-to-without-nearest-point = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵣⵣⵓⵖⵔ ⵖⵔ `<{ $component }>` ⴰⵛⴽⵓ ⵓⵔ ⴷⴰⵔⵙ ⴰⵎⵓⵜⵉ ⵏ ⵡⴰⴷⴷⴰⴷ nearestPoint.

constrain-to-without-nearest-point = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵃⴱⵓ ⵖⵔ `<{ $component }>` ⴰⵛⴽⵓ ⵓⵔ ⴷⴰⵔⵙ ⴰⵎⵓⵜⵉ ⵏ ⵡⴰⴷⴷⴰⴷ nearestPoint.

constrain-to-interior-without-nearest-point = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵃⴱⵓ ⴳ ⵓⴳⵏⵙⵓ ⵏ `<{ $component }>` ⴰⵛⴽⵓ ⵓⵔ ⴷⴰⵔⵙ ⴰⵎⵓⵜⵉ ⵏ ⵡⴰⴷⴷⴰⴷ nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ⵜⵜⵓⵣⴳⴰⵍ ⵉ choiceInput ⵓⵔ ⵉⴳⵉⵏ inline

## Ordering children by index

choice-input-indices-count-mismatch = ⵉⵎⴹⴰⵏⵏ ⵢⵜⵜⵓⵙⵜⴰⵢⵏ ⵉ choiceInput ⵜⵜⵓⵣⴳⴰⵍⵏ ⴰⵛⴽⵓ ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵎⴹⴰⵏⵏ ⵓⵔ ⵉⵎⵙⴰⵙⴰ ⴷ ⵓⵎⴹⴰⵏ ⵏ ⵡⴰⵔⵔⴰⵡ ⵏ ⵓⵙⵜⴰⵢ.

pretzel-indices-count-mismatch = ⵉⵎⴹⴰⵏⵏ ⵢⵜⵜⵓⵙⵜⴰⵢⵏ ⵉ problem ⵜⵜⵓⵣⴳⴰⵍⵏ ⴰⵛⴽⵓ ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵎⴹⴰⵏⵏ ⵓⵔ ⵉⵎⵙⴰⵙⴰ ⴷ ⵓⵎⴹⴰⵏ ⵏ ⵡⴰⵔⵔⴰⵡ ⵏ problem.

shuffle-indices-count-mismatch = ⵉⵎⴹⴰⵏⵏ ⵢⵜⵜⵓⵙⵜⴰⵢⵏ ⵉ shuffle ⵜⵜⵓⵣⴳⴰⵍⵏ ⴰⵛⴽⵓ ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵎⴹⴰⵏⵏ ⵓⵔ ⵉⵎⵙⴰⵙⴰ ⴷ ⵓⵎⴹⴰⵏ ⵏ ⵢⵉⴼⵔⴷⵉⵙⵏ.

indices-ignored-out-of-range = ⵉⵎⴹⴰⵏⵏ ⵢⵜⵜⵓⵙⵜⴰⵢⵏ ⵉ { $component } ⵜⵜⵓⵣⴳⴰⵍⵏ ⴰⵛⴽⵓ ⴽⵔⴰ ⴳⵉⵙⵏ ⴼⴼⵖⵏ ⵉ ⵜⵓⴳⵜ.

pretzel-indices-repeated = ⵉⵎⴹⴰⵏⵏ ⵢⵜⵜⵓⵙⵜⴰⵢⵏ ⵉ pretzel ⵜⵜⵓⵣⴳⴰⵍⵏ ⴰⵛⴽⵓ ⴽⵔⴰ ⴳⵉⵙⵏ ⵜⵜⵓⵙⵎⴽⵜⴰⵢⵏ.

pretzel-circuit-first-index = ⵉⵎⴹⴰⵏⵏ ⵢⵜⵜⵓⵙⵜⴰⵢⵏ ⵉ pretzel ⴳ mode circuit ⵜⵜⵓⵣⴳⴰⵍⵏ ⴰⵛⴽⵓ ⴰⵎⴹⴰⵏ ⴰⵎⵣⵡⴰⵔⵓ ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⴳ 1.

## `<shuffle>` and `<sort>`

string-children-need-type = ⴰⴼⴰⴷ `<{ $component }>` ⴰⴷ ⵜⵙⵡⵓⵔⵉ ⴷ ⵡⴰⵔⵔⴰⵡ ⵏ ⵡⴰⵡⴰⵍⵏ, ⴰⵎⵙⵍⴰⵢ `type` ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⵜⵜⵓⵙⵜⴰⵢ.

invalid-type-defaulting-to-math = ⴰⵏⴰⵡ { $type } ⴷ ⴰⵔⴰⵎⵖⵜⵓ ⵉ ⵓⴼⵔⴷⵉⵙ { $component }. ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⴳ ⵢⴰⵏ ⵣⴳ math, text, number ⵏⵖ boolean. ⵢⵜⵜⵓⵔⴰⵔ ⵖⵔ math.

string-not-valid-component-to-arrange = ⴰⵡⴰⵍ "{ $value }" ⵓⵔ ⵉⴳⵉ ⴰⴼⵔⴷⵉⵙ ⵢⵜⵜⵓⵙⵉⵔⴳⵏ ⵉ { $component }. ⵢⵜⵜⵓⵣⴳⴰⵍ.

## Types and variables

invalid-type-defaulting-to-number = ⴰⵏⴰⵡ { $type } ⴷ ⴰⵔⴰⵎⵖⵜⵓ, ⴰⵏⴰⵡ ⵢⵜⵜⵓⵔⴰⵔ ⵖⵔ number.

invalid-variable-value = ⴰⵣⴰⵍ ⴰⵔⴰⵎⵖⵜⵓ ⵏ ⵓⵎⵓⵜⵉ: `{ $value }`

## Variants

variant-index-must-be-number = ⴰⵎⴹⴰⵏ ⵏ ⵜⵍⵖⴰ { $index } ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⴳ ⴰⵎⴹⴰⵏ

variant-index-must-be-integer = ⴰⵎⴹⴰⵏ ⵏ ⵜⵍⵖⴰ { $index } ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⴳ ⴰⵎⴹⴰⵏ ⵓⵎⵎⵉⴷ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ⵓⵔ ⵢⵜⵜⵓⵙⴽⴰⵔ ⵉ ⵓⵙⴽⴰⵏ ⵓⵙⴷⵉⴷ. ⵜⴰⵀⵔⵉ ⵜⵜⵓⵔⴰⵔ ⴷ ⵜⴰⵎⵙⴰⵙⴰⵜ.

side-by-side-absolute-margins = `<{ $component }>` ⵓⵔ ⵢⵜⵜⵓⵙⴽⴰⵔ ⵉ ⵓⵙⴽⴰⵏ ⵓⵙⴷⵉⴷ. ⵜⵉⵡⵏⵏⴰⴹⵉⵏ ⵜⵜⵓⵔⴰⵔⵏⵜ ⴷ ⵜⵉⵎⵙⴰⵙⴰⵜⵉⵏ.

side-by-side-no-block-child = `<{ $component }>` ⴰⵔⴰⵎⵖⵜⵓ: ⵉⵇⵇⴰⵏ ⴰⴷ ⴷⴰⵔⵙ ⵢⵉⵍⵉ ⵢⴰⵏ ⵡⴰⵔⵔⴰⵡ ⵏ ⵓⴱⵍⵓⵔ.

## `<label>`

label-for-ignored-on-graphical = ⴰⵎⵙⵍⴰⵢ `for` ⴳ `<label>` ⵏ ⵜⵓⴳⵏⴰ ⵢⵜⵜⵓⵣⴳⴰⵍ.

label-for-must-resolve-to-one = ⴰⵎⵙⵍⴰⵢ `for` ⴳ `<label>` ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⵎⵎⵍ ⵢⴰⵏ ⵓⴼⵔⴷⵉⵙ ⵖⴰⵙ.

label-for-unresolved = ⴰⵎⵙⵍⴰⵢ `for` ⴳ `<label>` ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵎⵎⵍ ⴰⴼⵔⴷⵉⵙ.

label-for-answer-with-authored-inputs = ⴰⵎⵙⵍⴰⵢ `for` ⴳ `<label>` ⵉⵜⵜⵎⵓⵇⵇⵓⵍ ⵖⵔ `<answer>` ⵉⵍⴰⵏ ⵉⵏⴽⵛⴰⵎⵏ ⵢⵓⵔⴰ ⵓⵎⵙⴽⴰⵔ; ⵎⵎⵍ ⴰⵏⴽⵛⵓⵎ ⵙ ⵉⵅⴼ ⵏⵏⵙ.

label-for-answer-without-input = ⴰⵎⵙⵍⴰⵢ `for` ⴳ `<label>` ⵉⵜⵜⵎⵓⵇⵇⵓⵍ ⵖⵔ `<answer>` ⵓⵔ ⵉⵍⵉⵏ ⴰⵏⴽⵛⵓⵎ.

label-for-must-reference-input-or-answer = ⴰⵎⵙⵍⴰⵢ `for` ⴳ `<label>` ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⵎⵎⵍ ⴰⵏⴽⵛⵓⵎ ⵏⵖ ⵜⵉⵔⵉⵔⵉⵜ.

## Accessibility

accessibility-short-description-or-decorative = ⵉ ⵡⴰⵏⴽⵛⵓⵎ, `<{ $component }>` ⵉⵇⵇⴰⵏ ⴰⴷ ⴷⴰⵔⵙ ⵢⵉⵍⵉ ⵓⴳⵍⴰⵎ ⴰⵡⵣⵍⴰⵏ ⵏⵖ ⴰⴷ ⵉⵜⵜⵓⵙⵜⴰⵢ ⴷ decorative.

accessibility-video-short-description = ⵉ ⵡⴰⵏⴽⵛⵓⵎ, `<video>` ⵉⵇⵇⴰⵏ ⴰⴷ ⴷⴰⵔⵙ ⵢⵉⵍⵉ ⵓⴳⵍⴰⵎ ⴰⵡⵣⵍⴰⵏ.

accessibility-input-short-description-or-label = ⵉ ⵡⴰⵏⴽⵛⵓⵎ, `<{ $component }>` ⵉⵇⵇⴰⵏ ⴰⴷ ⴷⴰⵔⵙ ⵢⵉⵍⵉ ⵓⴳⵍⴰⵎ ⴰⵡⵣⵍⴰⵏ ⵏⵖ ⵜⴰⴱⵣⵉⵎⵜ.

accessibility-answer-input-short-description-or-label = ⵉ ⵡⴰⵏⴽⵛⵓⵎ, `<answer>` ⵉⵙⴽⴰⵔⵏ ⴰⵏⴽⵛⵓⵎ ⵉⵇⵇⴰⵏ ⴰⴷ ⴷⴰⵔⵙ ⵢⵉⵍⵉ ⵓⴳⵍⴰⵎ ⴰⵡⵣⵍⴰⵏ ⵏⵖ ⵜⴰⴱⵣⵉⵎⵜ.

accessibility-short-description-contains-math = ⵉⴳⵍⴰⵎⵏ ⵉⵡⵣⵍⴰⵏⵏ ⵓⵔ ⵉⵇⵇⴰⵏ ⴰⴷ ⴷⴰⵔⵙⵏ ⵉⵍⵉⵏ ⵉⴼⵔⴷⵉⵙⵏ ⵓⵙⵏⴰⵏⵏ ⴰⵎ `<{ $component }>`. ⴰⵔⵉ ⵜⵓⵙⵏⴰⴽⵜ ⵙ ⵡⴰⵡⴰⵍⵏ.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ⵓⵔ ⴷⴰⵔⵙ ⴰⵎⴳⵉⵔⵔⴷ ⵉⵎⵢⴰⵔⵏ ⵉ ⵓⴹⵔⵉⵙ ⵏ ⵓⵣⵡⵍ ⵏ ⵜⴳⵣⵎⵉ (ⴰⵙⴽⴰⵔ ⴰⵙⴳⴳⴰⵏ) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ⵉⵇⵇⴰⵏ { $threshold }:1 ⵏⵖ ⵓⴳⴳⴰⵔ).
       *[other] { $colorName } ⵓⵔ ⴷⴰⵔⵙ ⴰⵎⴳⵉⵔⵔⴷ ⵉⵎⵢⴰⵔⵏ ⵉ ⵓⴹⵔⵉⵙ ⵏ ⵓⵣⵡⵍ ⵏ ⵜⴳⵣⵎⵉ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ⵉⵇⵇⴰⵏ { $threshold }:1 ⵏⵖ ⵓⴳⴳⴰⵔ).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` ⵉⵣⵔⵉⵏ ⵅⴼ { $count } ⵏ ⵜⵏⵇⵉⴹⵉⵏ ⵓⵔ ⵢⵜⵜⵓⵙⴽⴰⵔ ⵎⴽ ⵜⵏⵇⵉⴹⵉⵏ ⵓⵔ ⴷⴰⵔⵙⵏⵜ ⴰⵣⴰⵍⵏ ⵓⵎⴹⵉⵏⵏ.

circle-too-many-through-points = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵉⴹⵏ ⵜⴰⵡⵉⵏⵙⵜ ⵉⵣⵔⵉⵏ ⵅⴼ ⵓⴳⴳⴰⵔ ⵏ ⴽⵔⴰⴹ ⵏ ⵜⵏⵇⵉⴹⵉⵏ.

circle-overprescribed-radius-center-points = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵉⴹⵏ ⵜⴰⵡⵉⵏⵙⵜ ⵙ ⵓⵣⴰⴳⵓⵔ, ⵜⴰⵎⵎⴰⵙⵜ ⴷ ⵜⵏⵇⵉⴹⵉⵏ.

circle-center-with-multiple-points = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵉⴹⵏ ⵜⴰⵡⵉⵏⵙⵜ ⵙ ⵜⵎⵎⴰⵙⵜ ⵉⵣⵔⵉⵏ ⵅⴼ ⵓⴳⴳⴰⵔ ⵏ ⵢⴰⵜ ⵜⵏⵇⵉⴹⵜ.

circle-radius-too-small = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵉⴹⵏ ⵜⴰⵡⵉⵏⵙⵜ: ⴰⵛⴽⵓ ⵜⴰⵍⵍⵓⵏⵜ ⴳⵔ ⵙⵏⴰⵜ ⵜⵏⵇⵉⴹⵉⵏ ⴷ { $distance }, ⴰⵣⴰⴳⵓⵔ { $radius } ⴷ ⴰⵎⵥⵥⵢⴰⵏ ⴱⴰⵀⵔⴰ.

circle-radius-with-many-points = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⴽⵔ ⵜⴰⵡⵉⵏⵙⵜ ⵉⵣⵔⵉⵏ ⵅⴼ ⵓⴳⴳⴰⵔ ⵏ ⵙⵏⴰⵜ ⵜⵏⵇⵉⴹⵉⵏ ⵙ ⵓⵣⴰⴳⵓⵔ.

circle-invalid-center-or-through-points = ⵜⴰⵎⵎⴰⵙⵜ ⵏⵖ ⵜⵉⵏⵇⵉⴹⵉⵏ ⵏ ⵜⵡⵉⵏⵙⵜ ⴷ ⵜⵉⵔⴰⵎⵖⵜⵓⵢⵉⵏ.

circle-radius-center-with-multiple-points = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵉⴹⵏ ⴰⵣⴰⴳⵓⵔ ⵏ ⵜⵡⵉⵏⵙⵜ ⵙ ⵜⵎⵎⴰⵙⵜ ⵉⵣⵔⵉⵏ ⵅⴼ ⵓⴳⴳⴰⵔ ⵏ ⵢⴰⵜ ⵜⵏⵇⵉⴹⵜ.

circle-change-radius-non-numerical = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵏⴼⵍ ⴰⵣⴰⴳⵓⵔ ⵏ ⵜⵡⵉⵏⵙⵜ ⵉⵣⵔⵉⵏ ⵅⴼ ⵜⵏⵇⵉⴹⵉⵏ ⴱⵍⴰ ⵉⵎⴹⴰⵏⵏ

circle-radius-with-points-non-numerical = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⴽⵔ ⵜⴰⵡⵉⵏⵙⵜ ⵉⵣⵔⵉⵏ ⵅⴼ ⵓⴳⴳⴰⵔ ⵏ ⵢⴰⵜ ⵜⵏⵇⵉⴹⵜ ⵙ ⵓⵣⴰⴳⵓⵔ ⵎⴽ ⵓⵔ ⵍⵍⵉⵏ ⵡⴰⵣⴰⵍⵏ ⵓⵎⴹⵉⵏⵏ.

circle-change-center-non-numerical = ⴰⵙⵏⴼⵍ ⵏ ⵜⵎⵎⴰⵙⵜ ⵏ ⵜⵡⵉⵏⵙⵜ ⵉⵣⵔⵉⵏ ⵅⴼ ⵜⵏⵇⵉⴹⵉⵏ ⴱⵍⴰ ⴰⵣⴰⵍⵏ ⵓⵎⴹⵉⵏⵏ ⵓⵔ ⵢⵜⵜⵓⵙⴽⴰⵔ.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] ⵜⵉⵙⴽⴽⵉⵔⵉⵏ ⴷⵔⵓⵙⵏⵜ ⵉ ⵜⵖⵓⵍⵜ ⵏ ⵜⵡⵓⵔⵉ. ⵜⴰⵖⵓⵍⵜ ⴷⴰⵔⵙ { $intervals } ⵏ ⵡⴰⴽⵓⴷ ⵎⴰⵛⴰ ⵜⴰⵡⵓⵔⵉ ⴷⴰⵔⵙ { $inputs } ⵏ ⵢⵉⵏⴽⵛⴰⵎⵏ.
        [few] ⵜⵉⵙⴽⴽⵉⵔⵉⵏ ⴷⵔⵓⵙⵏⵜ ⵉ ⵜⵖⵓⵍⵜ ⵏ ⵜⵡⵓⵔⵉ. ⵜⴰⵖⵓⵍⵜ ⴷⴰⵔⵙ { $intervals } ⵏ ⵡⴰⴽⵓⴷⵏ ⵎⴰⵛⴰ ⵜⴰⵡⵓⵔⵉ ⴷⴰⵔⵙ { $inputs } ⵏ ⵢⵉⵏⴽⵛⴰⵎⵏ.
       *[other] ⵜⵉⵙⴽⴽⵉⵔⵉⵏ ⴷⵔⵓⵙⵏⵜ ⵉ ⵜⵖⵓⵍⵜ ⵏ ⵜⵡⵓⵔⵉ. ⵜⴰⵖⵓⵍⵜ ⴷⴰⵔⵙ { $intervals } ⵏ ⵡⴰⴽⵓⴷⵏ ⵎⴰⵛⴰ ⵜⴰⵡⵓⵔⵉ ⴷⴰⵔⵙ { $inputs } ⵏ ⵢⵉⵏⴽⵛⴰⵎⵏ.
    }

function-domain-invalid-format = ⴰⵎⴰⵙⴰⵍ ⴰⵔⴰⵎⵖⵜⵓ ⵏ ⵜⵖⵓⵍⵜ ⵏ ⵜⵡⵓⵔⵉ.

function-ignoring-non-numerical =
    { $type ->
        [maximum] ⴰⵣⴰⵍ ⴰⴼⵍⵍⴰⵢ ⵓⵔ ⵉⴳⵉⵏ ⴰⵎⴹⵉⵏ ⵏ ⵜⵡⵓⵔⵉ ⵢⵜⵜⵓⵣⴳⴰⵍ.
        [minimum] ⴰⵣⴰⵍ ⴰⴷⴷⴰⵢ ⵓⵔ ⵉⴳⵉⵏ ⴰⵎⴹⵉⵏ ⵏ ⵜⵡⵓⵔⵉ ⵢⵜⵜⵓⵣⴳⴰⵍ.
        [extremum] ⴰⵣⴰⵍ ⴰⵏⴳⴳⴰⵔⵓ ⵓⵔ ⵉⴳⵉⵏ ⴰⵎⴹⵉⵏ ⵏ ⵜⵡⵓⵔⵉ ⵢⵜⵜⵓⵣⴳⴰⵍ.
        [point] ⵜⴰⵏⵇⵉⴹⵜ ⵓⵔ ⵉⴳⵉⵏ ⵜⴰⵎⴹⵉⵏⵜ ⵏ ⵜⵡⵓⵔⵉ ⵜⵜⵓⵣⴳⴰⵍ.
        [slope] ⴰⵙⵓⴷⴷⵎ ⵓⵔ ⵉⴳⵉⵏ ⴰⵎⴹⵉⵏ ⵏ ⵜⵡⵓⵔⵉ ⵢⵜⵜⵓⵣⴳⴰⵍ.
       *[other] { $type } ⵓⵔ ⵉⴳⵉⵏ ⴰⵎⴹⵉⵏ ⵏ ⵜⵡⵓⵔⵉ ⵢⵜⵜⵓⵣⴳⴰⵍ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] ⴰⵣⴰⵍ ⴰⴼⵍⵍⴰⵢ ⵉⵍⵎ ⵏ ⵜⵡⵓⵔⵉ ⵢⵜⵜⵓⵣⴳⴰⵍ.
        [minimum] ⴰⵣⴰⵍ ⴰⴷⴷⴰⵢ ⵉⵍⵎ ⵏ ⵜⵡⵓⵔⵉ ⵢⵜⵜⵓⵣⴳⴰⵍ.
        [extremum] ⴰⵣⴰⵍ ⴰⵏⴳⴳⴰⵔⵓ ⵉⵍⵎ ⵏ ⵜⵡⵓⵔⵉ ⵢⵜⵜⵓⵣⴳⴰⵍ.
        [point] ⵜⴰⵏⵇⵉⴹⵜ ⵜⵉⵍⵎⵜ ⵏ ⵜⵡⵓⵔⵉ ⵜⵜⵓⵣⴳⴰⵍ.
       *[other] { $type } ⵉⵍⵎ ⵏ ⵜⵡⵓⵔⵉ ⵢⵜⵜⵓⵣⴳⴰⵍ.
    }

function-points-too-close = ⵜⴰⵡⵓⵔⵉ ⴷⴰⵔⵙ ⵙⵏⴰⵜ ⵜⵏⵇⵉⴹⵉⵏ ⵇⵔⴱⵏⵜ ⴱⴰⵀⵔⴰ. ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⴱⴷⴷⵉ ⵜⴰⵡⵓⵔⵉ.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] ⴰⵍⵍⵓⵙ ⵏ ⵜⵡⵓⵔⵉ ⵉⵣⴹⴰⵕ ⵖⴰⵙ ⵎⴽ ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵏⴽⵛⴰⵎⵏ ⵉⵎⵙⴰⵙⴰ ⴷ ⵓⵎⴹⴰⵏ ⵏ ⵜⵓⴼⴼⵖⵉⵡⵉⵏ. ⵜⴰⵡⵓⵔⵉ ⴰⴷ ⴷⴰⵔⵙ { $inputs } ⵏ ⵓⵏⴽⵛⵓⵎ ⴷ { $outputs } ⵏ ⵜⵓⴼⴼⵖⵉⵡⵉⵏ.
        [few] ⴰⵍⵍⵓⵙ ⵏ ⵜⵡⵓⵔⵉ ⵉⵣⴹⴰⵕ ⵖⴰⵙ ⵎⴽ ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵏⴽⵛⴰⵎⵏ ⵉⵎⵙⴰⵙⴰ ⴷ ⵓⵎⴹⴰⵏ ⵏ ⵜⵓⴼⴼⵖⵉⵡⵉⵏ. ⵜⴰⵡⵓⵔⵉ ⴰⴷ ⴷⴰⵔⵙ { $inputs } ⵏ ⵢⵉⵏⴽⵛⴰⵎⵏ ⴷ { $outputs } ⵏ ⵜⵓⴼⴼⵖⵉⵡⵉⵏ.
       *[other] ⴰⵍⵍⵓⵙ ⵏ ⵜⵡⵓⵔⵉ ⵉⵣⴹⴰⵕ ⵖⴰⵙ ⵎⴽ ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵏⴽⵛⴰⵎⵏ ⵉⵎⵙⴰⵙⴰ ⴷ ⵓⵎⴹⴰⵏ ⵏ ⵜⵓⴼⴼⵖⵉⵡⵉⵏ. ⵜⴰⵡⵓⵔⵉ ⴰⴷ ⴷⴰⵔⵙ { $inputs } ⵏ ⵢⵉⵏⴽⵛⴰⵎⵏ ⴷ { $outputs } ⵏ ⵜⵓⴼⴼⵖⵉⵡⵉⵏ.
    }

## `<sequence>`

sequence-invalid-length = ⵜⴰⵖⵣⵉ ⵜⴰⵔⴰⵎⵖⵜⵓⵜ ⵏ ⵓⵙⴷⴷⵉ.  ⵉⵇⵇⴰⵏ ⴰⴷ ⵜⴳ ⴰⵎⴹⴰⵏ ⵓⵎⵎⵉⴷ ⵓⵔ ⵉⴳⵉⵏ ⴷⴷⴰⵡ ⵏ ⵡⴰⵎⴷⵓⵏ.

sequence-invalid-step = ⴰⵙⵓⵔⵉⴼ ⴰⵔⴰⵎⵖⵜⵓ ⵏ ⵓⵙⴷⴷⵉ.  ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⴳ ⴰⵎⴹⴰⵏ ⵉ ⵓⵙⴷⴷⵉ ⵏ ⵓⵏⴰⵡ { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ⵜⴰⵔⴰⵎⵖⵜⵓⵜ ⵏ ⵓⵙⴷⴷⵉ ⵏ ⵢⵉⵎⴹⴰⵏⵏ.  ⵉⵇⵇⴰⵏ ⴰⴷ ⵜⴳ ⴰⵎⴹⴰⵏ.

sequence-invalid-endpoint-letters = "{ $attribute }" ⵜⴰⵔⴰⵎⵖⵜⵓⵜ ⵏ ⵓⵙⴷⴷⵉ ⵏ ⵢⵉⵙⴽⴽⵉⵍⵏ.  ⵉⵇⵇⴰⵏ ⴰⴷ ⵜⴳ ⴰⵙⴷⵓⴽⴽⵍ ⵏ ⵢⵉⵙⴽⴽⵉⵍⵏ.

sequence-invalid-endpoint = "{ $attribute }" ⵜⴰⵔⴰⵎⵖⵜⵓⵜ ⵏ ⵓⵙⴷⴷⵉ.

select-from-sequence-coprime-not-numbers = coprime ⵢⵜⵜⵓⵣⴳⴰⵍ ⴰⵛⴽⵓ ⵓⵔ ⵜⵜⵓⵙⵜⴰⵢⵏ ⵢⵉⵎⴹⴰⵏⵏ

select-from-sequence-coprime-with-exclude-combinations = coprime ⵢⵜⵜⵓⵣⴳⴰⵍ ⴰⵛⴽⵓ excludeCombinations ⵜⵜⵓⵙⵜⴰⵢ

## Resolving a `target`

target-not-found = ⵉⵙⵡⵉ ⴰⵔⴰⵎⵖⵜⵓ ⵏ `<{ $source }>`: ⵉⵙⵡⵉ ⵓⵔ ⵢⵜⵜⵓⴼ.

target-state-variable-not-found = ⵉⵙⵡⵉ ⴰⵔⴰⵎⵖⵜⵓ ⵏ `<{ $source }>`: ⵓⵔ ⵢⵜⵜⵓⴼ ⵓⵎⵓⵜⵉ ⵏ ⵡⴰⴷⴷⴰⴷ ⵢⵜⵜⵓⵙⵎⵎⴰⵏ "{ $property }" ⴳ `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = ⵉⵎⵓⵜⵉⵜⵏ ⵏ `<odeSystem>` ⵉⵇⵇⴰⵏ ⴰⴷ ⵎⴳⴰⵔⴰⴷⵏ ⴷ ⵓⵎⵓⵜⵉ ⵉⵍⵍⵉⵏ ⵙ ⵉⵅⴼ ⵏⵏⵙ.

ode-system-duplicate-variable-names = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⴱⴷⴷⵉ ⵜⵉⵡⵓⵔⵉⵡⵉⵏ ODE RHS ⵙ ⵢⵉⵙⵎⴰⵡⵏ ⵏ ⵢⵉⵎⵓⵜⵉⵜⵏ ⵢⵜⵜⵓⵙⵎⴽⵜⴰⵢⵏ.

ode-system-rhs-function-error = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⴱⴷⴷⵉ ⵜⴰⵡⵓⵔⵉ ODE RHS.  ⵜⴰⵣⴳⴰⵍⵜ ⴳ ⵓⵙⴽⴰⵔ ⵏ ⵜⵡⵓⵔⵉ mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⴱⴷⴷⵉ ⵜⵉⵖⵎⵔⵜ ⴳⵔ { $count } ⵏ ⵢⵉⵣⵉⵔⵉⴳⵏ

angle-invalid-through-point = ⵜⴰⵏⵇⵉⴹⵜ ⵜⴰⵔⴰⵎⵖⵜⵓⵜ ⴳ through ⵏ `<angle>`

parabola-vertex-too-many-points = ⵜⴰⴱⴰⵔⴰⴱⵓⵍⵜ ⵙ ⵓⵇⵔⵔⵓ ⵉⵣⵔⵉⵏ ⵅⴼ ⵓⴳⴳⴰⵔ ⵏ ⵢⴰⵜ ⵜⵏⵇⵉⴹⵜ ⵓⵔ ⵜⵜⵓⵙⴽⴰⵔ.

parabola-too-many-points = ⵜⴰⴱⴰⵔⴰⴱⵓⵍⵜ ⵉⵣⵔⵉⵏ ⵅⴼ ⵓⴳⴳⴰⵔ ⵏ ⴽⵔⴰⴹ ⵜⵏⵇⵉⴹⵉⵏ ⵓⵔ ⵜⵜⵓⵙⴽⴰⵔ.

intersection-too-many-items = ⴰⵎⴳⴰⴷⴰⵍ ⵏ ⵓⴳⴳⴰⵔ ⵏ ⵙⵏⴰⵜ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ ⵓⵔ ⵢⵜⵜⵓⵙⴽⴰⵔ

## Other math components

ionic-compound-not-two-ions = ⴰⵙⴷⵓⴽⴽⵍ ⴰⵢⵓⵏⴰⵏ ⵓⵔ ⵉⴳⵉⵏ ⵏ ⵙⵉⵏ ⵢⵉⵢⵓⵏⵏ ⵓⵔ ⵢⵜⵜⵓⵙⴽⴰⵔ.

ionic-compound-needs-cation-and-anion = ⴰⵙⴷⵓⴽⴽⵍ ⴰⵢⵓⵏⴰⵏ ⵢⵜⵜⵓⵙⴽⴰⵔ ⵖⴰⵙ ⵉ ⵢⴰⵏ ⵓⴽⴰⵜⵢⵓⵏ ⴷ ⵢⴰⵏ ⵓⵏⵢⵓⵏ.

solve-equations-cannot-evaluate = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⴼⵔⵓ ⵜⴰⴳⴷⴰ ⴰⵛⴽⵓ ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵜⵜ ⵉⵙⴽⵢⴷ: { $equation }

math-operators-operand-number-required = ⵉⵇⵇⴰⵏ ⴰⴷ ⵜⵙⵜⵉⵜ operandNumber ⵎⴽ ⵜⴽⴽⵙⵜ operand ⵜⵓⵙⵏⴰⴽⵜ.

eigen-decomposition-failed = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵉⴹⵏ ⴰⵣⴰⵍⵏ eigen ⵏ ⵜⴳⵔⵓⵔⵜ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: ⴰⵖⵡⵡⴰⵔ { $parameters } ⵓⵔ ⵉⵍⵍⵉ ⴳ ⵓⵎⴰⵙⴰⵍ, ⵖⵉⴽⴰⵏ ⵔⴰⴷ ⵉⵎⵙⴰⵙⴰ ⴽⵓ ⵜⵉⴽⴽⵍⵜ ⴷ ⵡⴰⴷⴳ ⵉⵍⵎ.
        [few] `<matchesPattern>`: ⵉⵖⵡⵡⴰⵔⵏ { $parameters } ⵓⵔ ⵍⵍⵉⵏ ⴳ ⵓⵎⴰⵙⴰⵍ, ⵖⵉⴽⴰⵏ ⵔⴰⴷ ⵎⵙⴰⵙⴰⵏ ⴽⵓ ⵜⵉⴽⴽⵍⵜ ⴷ ⵡⴰⴷⴳ ⵉⵍⵎ.
       *[other] `<matchesPattern>`: ⵉⵖⵡⵡⴰⵔⵏ { $parameters } ⵓⵔ ⵍⵍⵉⵏ ⴳ ⵓⵎⴰⵙⴰⵍ, ⵖⵉⴽⴰⵏ ⵔⴰⴷ ⵎⵙⴰⵙⴰⵏ ⴽⵓ ⵜⵉⴽⴽⵍⵜ ⴷ ⵡⴰⴷⴳ ⵉⵍⵎ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⴳⵣⵓ grid="{ $grid }". ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⴳ none, medium, dense, ⵏⵖ ⵙⵉⵏ ⵢⵉⵎⴹⴰⵏⵏ ⵓⴼⵔⵉⵏⵏ ⵢⵜⵜⵡⴰⴱⴹⴰⵏ ⵙ ⵜⴰⵍⵍⵓⵏⵜ, ⴰⵎ grid="1 0.5". ⵓⵔ ⵜⵍⵍⵉ ⵜⵔⴰⴽⵏⴰ.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ⵓⵔ ⵜⵜⵓⵙⴼⵔⴰⴽ ⴳ ⵓⵎⵙⴽⵏ prefigure; ⵢⵜⵜⵓⵙⵎⵔⴰⵙ ⵓⵙⴽⴰⵔ right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ⵓⵔ ⵜⵜⵓⵙⴼⵔⴰⴽ ⴳ ⵓⵎⵙⴽⵏ prefigure; ⵢⵜⵜⵓⵙⵎⵔⴰⵙ ⵓⵙⴽⴰⵔ top.

prefigure-invalid-axis-bounds = `<graph>`: ⵜⵉⵍⵉⵙⴰ ⵏ ⵜⴳⵔⴰⵔⵉⵏ ⴷ ⵜⵉⵔⴰⵎⵖⵜⵓⵢⵉⵏ ⵉ ⵓⵙⵏⴼⵍ prefigure; ⵢⵜⵜⵓⵙⵎⵔⴰⵙ bbox ⴰⵎⵣⵡⴰⵔⵓ (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ⵜⴰⵀⵔⵉ ⵜⴰⵔⴰⵎⵖⵜⵓⵜ ⵉ ⵓⵙⵏⴼⵍ prefigure; ⵜⵜⵓⵙⵎⵔⴰⵙ ⵜⵀⵔⵉ ⵜⴰⵎⵣⵡⴰⵔⵓⵜ 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ⴰⵔⴰⵎⵖⵜⵓ ⵉ ⵓⵙⵏⴼⵍ prefigure; ⵢⵜⵜⵓⵙⵎⵔⴰⵙ ⵓⵙⴽⴰⵏ ⴰⵎⵣⵡⴰⵔⵓ 1.

prefigure-grid-spacing-too-fine = `<graph>`: ⵜⴰⵍⵍⵓⵏⵜ ⵏ ⵜⵔⴰⴽⵏⴰ ⴷ ⵜⴰⵎⵥⵥⵢⴰⵏⵜ ⴱⴰⵀⵔⴰ ⵉ ⵜⵍⵉⵙⴰ ⵏ ⵜⴳⵔⴰⵔⵉⵏ; ⵜⴰⵔⴰⴽⵏⴰ ⵜⵜⵓⵊⵊⴰ ⴳ ⵓⵎⵙⴽⵏ prefigure.

prefigure-annotations-not-rendered = `<graph>`: ⵜⵉⵣⵎⵉⵍⵉⵏ ⵓⵔ ⵜⵜⵓⵙⴽⴰⵏⵏⵜ ⵎⴽ ⵓⵔ ⵢⵜⵜⵓⵙⵎⵔⴰⵙ ⵓⵎⵙⴽⵏ PreFigure.

multiple-annotations-children = ⵜⵜⵓⴼⵏ ⴰⵟⵟⴰⵙ ⵏ ⵡⴰⵔⵔⴰⵡ `<annotations>` ⴳ `<graph>`; ⴰⴽⴽⵯ ⴱⵍⴰ ⴰⵏⴳⴳⴰⵔⵓ ⵜⵜⵓⵣⴳⴰⵍⵏ.

## Referring to other components

copy-unrecognized-component-type = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵖⵣⴼ ⵏⵖ ⴰⴷ ⵉⵏⵖⵍ ⴰⵏⴰⵡ ⵏ ⵓⴼⵔⴷⵉⵙ ⵓⵔ ⵉⵜⵜⵓⵙⵙⴰⵏⵏ: { $type }.

copy-prop-not-found = ⵓⵔ ⵢⵜⵜⵓⴼ ⵓⵎⵙⵍⴰⵢ { $property } ⴳ ⵓⴼⵔⴷⵉⵙ ⵏ ⵓⵏⴰⵡ { $component }

collect-no-source = ⵓⵔ ⵢⵜⵜⵓⴼ ⵓⵖⴱⴰⵍⵓ ⵉ collect.

collect-invalid-component-type = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⴷⵓⴽⴽⵍ ⵉⴼⵔⴷⵉⵙⵏ ⵏ ⵓⵏⴰⵡ `<{ $component }>` ⴰⵛⴽⵓ ⴷ ⴰⵏⴰⵡ ⵏ ⵓⴼⵔⴷⵉⵙ ⴰⵔⴰⵎⵖⵜⵓ.

reference-index-unavailable = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵎⵎⵍ ⴰⵎⴹⴰⵏ `{ $reference }`

## `<callAction>`

component-action-unavailable = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵖⵔ { $action } ⴳ ⵓⴼⵔⴷⵉⵙ `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ⵉⵙⴼⴽⴰ ⴷⴰⵔⵙⵏ ⴰⵎⴰⵙⴰⵍ ⴰⵔⴰⵎⵖⵜⵓ.  ⵉⵣⵉⵔⵉⴳⵏ ⴷⴰⵔⵙⵏ ⵜⴰⵖⵣⵉ ⵓⵔ ⵉⵎⵙⴰⵙⴰⵏ. ⵢⵜⵜⵓⴼ ⴳ componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = ⵉⵙⴼⴽⴰ ⴷⴰⵔⵙⵏ ⵉⵙⵎⴰⵡⵏ ⵏ ⵜⴳⵊⴷⴰ ⵢⵜⵜⵓⵙⵎⴽⵜⴰⵢⵏ.  ⵢⵜⵜⵓⴼ ⴳ componentIdx :{ $componentIdx }

data-frame-missing-column-name = ⵉⵙⴼⴽⴰ ⵓⵔ ⴷⴰⵔⵙⵏ ⵉⵙⵎ ⵏ ⵜⴳⵊⴷⵉⵜ.  ⵢⵜⵜⵓⴼ ⴳ componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award ⵏ ⵜⵉⵔⵉⵔⵉⵜ ⴰⴷ ⵉⴱⴷⴷⴰ ⵅⴼ ⵜⵉⵔⵉⵔⵉⵜ ⵏ ⵜⴱⵣⵉⵎⵜ answer ⵙ ⵉⵅⴼ ⵏⵏⵙ, ⵎⴰⵢⴰⴷ ⵔⴰⴷ ⴷ ⵢⴰⵡⵉ ⵜⵉⴽⵍⵉ ⵓⵔ ⵉⵜⵜⵓⵔⴰⵊⴰⵏ.

answer-max-num-attempts-in-section-wide-check-work = ⴰⵙⵔⵙ ⵏ `maxNumAttempts` ⴳ `<answer>` ⵉⵍⵍⴰⵏ ⴳ ⵓⵎⴰⵜⴰⵔ ⵉⵍⴰⵏ `sectionWideCheckWork` ⵓⵔ ⴷⴰⵔⵙ ⴰⵣⴰⵍ, ⴰⵛⴽⵓ ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵄⵔⴰⴹⵏ ⵉⵜⵜⵓⵙⵢⵢⴰⵔ ⵙ ⵓⵎⴰⵜⴰⵔ. ⵙⵔⵙ `maxNumAttempts` ⴳ ⵓⵎⴰⵜⴰⵔ.

nested-section-wide-check-work-max-num-attempts = ⴰⵙⵔⵙ ⵏ `maxNumAttempts` ⴳ ⵓⵎⴰⵜⴰⵔ ⵉⵍⴰⵏ `sectionWideCheckWork` ⵉⵍⵍⴰⵏ ⴳ ⵡⴰⵢⵢⴰⴹ ⵉⵍⴰⵏ `sectionWideCheckWork` ⵓⵔ ⴷⴰⵔⵙ ⴰⵣⴰⵍ, ⴰⵛⴽⵓ ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵄⵔⴰⴹⵏ ⵉⵜⵜⵓⵙⵢⵢⴰⵔ ⵙ ⵓⵎⴰⵜⴰⵔ ⵏ ⴱⵔⵔⴰ. ⵙⵔⵙ `maxNumAttempts` ⴳ ⵓⵎⴰⵜⴰⵔ ⵏ ⴱⵔⵔⴰ.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] ⴰⵎⵙⵍⴰⵢ { $attributes } ⵓⵔ ⴷⴰⵔⵙ ⴰⵣⴰⵍ ⴱⵍⴰ symbolicEquality.
        [few] ⵉⵎⵙⵍⴰⵢⵏ { $attributes } ⵓⵔ ⴷⴰⵔⵙⵏ ⴰⵣⴰⵍ ⴱⵍⴰ symbolicEquality.
       *[other] ⵉⵎⵙⵍⴰⵢⵏ { $attributes } ⵓⵔ ⴷⴰⵔⵙⵏ ⴰⵣⴰⵍ ⴱⵍⴰ symbolicEquality.
    }

answer-invalid-type = ⴰⵏⴰⵡ ⴰⵔⴰⵎⵖⵜⵓ ⵏ ⵜⵉⵔⵉⵔⵉⵜ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = ⴰⵛⴽⵓ ⴰⴼⵔⴷⵉⵙ `<{ $component }>` ⵓⵔ ⴷⴰⵔⵙ ⵉⵙⵎ, ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵜⵜⵓⵙⵎⵔⴰⵙ ⴷ ⴰⵎⵙⵍⴰⵢ ⵏ module

module-attribute-name-already-defined = ⴰⴼⵔⴷⵉⵙ `<{ $component } name="{ $name }">` ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵜⵜⵓⵙⵎⵔⴰⵙ ⴷ ⴰⵎⵙⵍⴰⵢ ⵏ module ⴰⵛⴽⵓ ⴰⵏⴰⵡ ⵏ ⵓⴼⵔⴷⵉⵙ `<module>` ⴷⴰⵔⵙ ⵢⴰⴷ ⴰⵎⵙⵍⴰⵢ "{ $name }".

conditional-content-condition-ignored = ⴰⵎⵙⵍⴰⵢ `condition` ⵢⵜⵜⵓⵣⴳⴰⵍ ⴳ ⵓⴼⵔⴷⵉⵙ `<conditionalContent>` ⵉⵍⴰⵏ ⴰⵔⵔⴰⵡ case ⵏⵖ else.

slider-markers-type-mismatch = ⴰⵏⴰⵡ ⵏ ⵢⵉⵣⴰⵎⵓⵍⵏ ⵓⵔ ⵉⵎⵙⴰⵙⴰ ⴷ ⵓⵏⴰⵡ ⵏ slider.

pretzel-problem-needs-statement-and-answer = pretzel ⴰⵔⴰⵎⵖⵜⵓ: ⴽⵓ `<problem>` ⵉⵇⵇⴰⵏ ⴰⴷ ⴷⴰⵔⵙ ⵢⵉⵍⵉ ⵢⴰⵏ `<statement>` ⴷ ⵢⴰⵏ `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel ⴰⵔⴰⵎⵖⵜⵓ: ⴳ mode="circuit", `<problem>` ⴰⵎⵣⵡⴰⵔⵓ ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⴳ ⴰⵙⵅⵙⵔ.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] ⴰⵣⴰⵍ ⴰⵔⴰⵎⵖⵜⵓ { $values } ⵏ ⵓⵎⵙⵍⴰⵢ `{ $attribute }`; ⵢⵜⵜⵓⵣⴳⴰⵍ.
        [few] ⴰⵣⴰⵍⵏ ⵉⵔⴰⵎⵖⵜⵓⵢⵏ { $values } ⵏ ⵓⵎⵙⵍⴰⵢ `{ $attribute }`; ⵜⵜⵓⵣⴳⴰⵍⵏ.
       *[other] ⴰⵣⴰⵍⵏ ⵉⵔⴰⵎⵖⵜⵓⵢⵏ { $values } ⵏ ⵓⵎⵙⵍⴰⵢ `{ $attribute }`; ⵜⵜⵓⵣⴳⴰⵍⵏ.
    }

attribute-must-be-references = ⴰⵣⴰⵍ ⴰⵔⴰⵎⵖⵜⵓ `{ $value }` ⵏ ⵓⵎⵙⵍⴰⵢ `{ $attribute }`. ⴰⵎⵙⵍⴰⵢ ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⴱⵏⵓ ⵅⴼ ⵜⵎⵖⵕⵉⵡⵉⵏ ⵉⴱⴷⴰⵏ ⵙ `$`.

math-input-invalid-function-names = <mathInput>: ⵉⵙⵎⴰⵡⵏ ⵏ ⵜⵡⵓⵔⵉⵡⵉⵏ ⵉⵔⴰⵎⵖⵜⵓⵢⵏ ⵜⵜⵓⵣⴳⴰⵍⵏ ⴳ { $attribute }: { $names }. ⴰⵃⵔⵉⵛ ⵏ ⵓⵙⴽⴰⵏ ⵏ ⴽⵓ ⵉⵙⵎ ⵉⵇⵇⴰⵏ ⴰⴷ ⴷⴰⵔⵙ ⵉⵍⵉⵏ ⵙⵉⵏ ⵢⵉⵙⴽⴽⵉⵍⵏ; `|<mathspeak alternative>` ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⴹⴼⵓⵕ.

## Building components from the source

component-type-invalid = ⴰⵏⴰⵡ ⴰⵔⴰⵎⵖⵜⵓ ⵏ ⵓⴼⵔⴷⵉⵙ: `<{ $componentType }>`

attribute-repeated = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵎⴽⵜⵉ ⴰⵎⵙⵍⴰⵢ { $attribute }.

attribute-invalid-for-component = ⴰⵎⵙⵍⴰⵢ ⴰⵔⴰⵎⵖⵜⵓ "{ $attribute }" ⵉ ⵓⴼⵔⴷⵉⵙ ⵏ ⵓⵏⴰⵡ `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    ⵜⴰⴱⴰⴷⵓⵜ ⵏ ⵓⵖⴰⵏⵉⴱ { $styleNumber } ⵓⵔ ⴷⴰⵔⵙ ⴰⵎⴳⵉⵔⵔⴷ ⵉⵎⵢⴰⵔⵏ ⵏ { $context ->
        [text-on-background] ⵉⵏⵉⵜⵏ ⵏ ⵓⴹⵔⵉⵙ ⵅⴼ ⵢⵉⵏⵉⵜⵏ ⵏ ⵓⴳⵉⵍⴰⵍ
        [high-contrast] ⵉⵏⵉⵜⵏ ⵏ ⵓⵎⴳⵉⵔⵔⴷ ⴰⵎⵇⵇⵔⴰⵏ ⵅⴼ ⵜⴼⵍⵡⵉⵜ
        [line] ⵉⵏⵉⵜⵏ ⵏ ⵢⵉⵣⵉⵔⵉⴳ ⵅⴼ ⵜⴼⵍⵡⵉⵜ
        [marker] ⵉⵏⵉⵜⵏ ⵏ ⵓⵣⴰⵎⵓⵍ ⵅⴼ ⵜⴼⵍⵡⵉⵜ
       *[text-on-canvas] ⵉⵏⵉⵜⵏ ⵏ ⵓⴹⵔⵉⵙ ⵅⴼ ⵜⴼⵍⵡⵉⵜ
    }{ $mode ->
        [dark] { " (ⴰⵙⴽⴰⵔ ⴰⵙⴳⴳⴰⵏ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ⵉⵇⵇⴰⵏ { $threshold }:1 ⵏⵖ ⵓⴳⴳⴰⵔ).

style-definition-dark-mode-text-background-contrast =
    ⵡⴰⵅⵅⴰ ⵜⴰⴱⴰⴷⵓⵜ ⵏ ⵓⵖⴰⵏⵉⴱ { $styleNumber } ⵜⵙⵜⵉ ⵉⵏⵉⵜⵏ ⵉⵍⴰⵏ ⴰⵎⴳⵉⵔⵔⴷ ⵉⵎⵢⴰⵔⵏ ⵉ ⵓⵙⴽⴰⵔ ⵓⵎⵍⵉⵍ, ⵉⵏⵉⵜⵏ ⵏ ⵓⵙⴽⴰⵔ ⴰⵙⴳⴳⴰⵏ ⵉⴷ ⵢⵓⵛⴽⴰⵏ ⵣⴳ ⵡⴰⵣⴰⵍⵏ ⴰⴷ ⵓⵔ ⴷⴰⵔⵙⵏ ⴰⵎⴳⵉⵔⵔⴷ ⵉⵎⵢⴰⵔⵏ ⴳⵔ ⵢⵉⵏⵉⵜⵏ ⵏ ⵓⴹⵔⵉⵙ ⴷ ⵢⵉⵏⵉⵜⵏ ⵏ ⵓⴳⵉⵍⴰⵍ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ⵉⵇⵇⴰⵏ { $threshold }:1 ⵏⵖ ⵓⴳⴳⴰⵔ). { $suggestion ->
        [available] ⴰⴼⴰⴷ ⴰⴷ ⵉⵎⵢⴰⵔ ⵓⵎⴳⵉⵔⵔⴷ ⴳ ⵓⵙⴽⴰⵔ ⴰⵙⴳⴳⴰⵏ, ⵙⵎⵖⵔ ⴰⵎⴳⵉⵔⵔⴷ ⵏ ⵓⵙⴽⴰⵔ ⵓⵎⵍⵉⵍ (ⴰⵎⴷⵢⴰ, ⵙⵔⵙ { $lightAttribute }="{ $lightColor }") ⵏⵖ ⵙⵏⴼⵍ ⵉⵏⵉⵜⵏ ⵏ ⵓⵙⴽⴰⵔ ⴰⵙⴳⴳⴰⵏ (ⴰⵎⴷⵢⴰ, ⵙⵔⵙ { $darkAttribute }="{ $darkColor }").
       *[none] ⴰⴼⴰⴷ ⴰⴷ ⵉⵎⵢⴰⵔ ⵓⵎⴳⵉⵔⵔⴷ ⴳ ⵓⵙⴽⴰⵔ ⴰⵙⴳⴳⴰⵏ, ⵙⵎⵖⵔ ⴰⵎⴳⵉⵔⵔⴷ ⵏ ⵓⵙⴽⴰⵔ ⵓⵎⵍⵉⵍ ⵏⵖ ⵙⵏⴼⵍ ⵉⵏⵉⵜⵏ ⵙ textColorDarkMode ⴷ/ⵏⵖ backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    ⵡⴰⵅⵅⴰ ⵜⴰⴱⴰⴷⵓⵜ ⵏ ⵓⵖⴰⵏⵉⴱ { $styleNumber } ⵜⵙⵜⵉ ⵉⵏⵉⵜⵏ ⵏ ⵓⴹⵔⵉⵙ ⵉⵍⴰⵏ ⴰⵎⴳⵉⵔⵔⴷ ⵉⵎⵢⴰⵔⵏ ⵉ ⵓⵙⴽⴰⵔ ⵓⵎⵍⵉⵍ, ⵉⵏⵉⵜⵏ ⵏ ⵓⴹⵔⵉⵙ ⵏ ⵓⵙⴽⴰⵔ ⴰⵙⴳⴳⴰⵏ ⵉⴷ ⵢⵓⵛⴽⴰⵏ ⵣⴳ ⵡⴰⵣⴰⵍ ⴰⴷ ⵓⵔ ⴷⴰⵔⵙⵏ ⴰⵎⴳⵉⵔⵔⴷ ⵉⵎⵢⴰⵔⵏ ⵅⴼ ⵜⴼⵍⵡⵉⵜ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ⵉⵇⵇⴰⵏ { $threshold }:1 ⵏⵖ ⵓⴳⴳⴰⵔ). { $suggestion ->
        [available] ⴰⴼⴰⴷ ⴰⴷ ⵉⵎⵢⴰⵔ ⵓⵎⴳⵉⵔⵔⴷ ⴳ ⵓⵙⴽⴰⵔ ⴰⵙⴳⴳⴰⵏ, ⵙⵎⵖⵔ ⴰⵎⴳⵉⵔⵔⴷ ⵏ ⵓⵙⴽⴰⵔ ⵓⵎⵍⵉⵍ (ⴰⵎⴷⵢⴰ, ⵙⵔⵙ textColor="{ $lightColor }") ⵏⵖ ⵙⵏⴼⵍ ⵉⵏⵉⵜⵏ ⵏ ⵓⵙⴽⴰⵔ ⴰⵙⴳⴳⴰⵏ (ⴰⵎⴷⵢⴰ, ⵙⵔⵙ textColorDarkMode="{ $darkColor }").
       *[none] ⴰⴼⴰⴷ ⴰⴷ ⵉⵎⵢⴰⵔ ⵓⵎⴳⵉⵔⵔⴷ ⴳ ⵓⵙⴽⴰⵔ ⴰⵙⴳⴳⴰⵏ, ⵙⵎⵖⵔ ⴰⵎⴳⵉⵔⵔⴷ ⵏ ⵓⵙⴽⴰⵔ ⵓⵎⵍⵉⵍ ⵏⵖ ⵙⵏⴼⵍ ⵉⵏⵉⵜⵏ ⵙ textColorDarkMode.
    }

section-multiple-style-palettes = ⵜⵉⴳⵣⵎⵉ ⵜⵣⴹⴰⵕ ⴰⴷ ⵜⵙⵜⵉ ⵢⴰⵏ `<stylePalette>` ⵖⴰⵙ; ⵢⵜⵜⵓⵙⵎⵔⴰⵙ ⴰⵏⴳⴳⴰⵔⵓ.

## Unique variants

variant-num-to-select-not-non-negative-integer = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵙⴰⵏ ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⴰⵛⴽⵓ numToSelect ⵓⵔ ⵉⴳⵉ ⴰⵎⴹⴰⵏ ⵓⵎⵎⵉⴷ ⵓⵔ ⵉⴳⵉⵏ ⴷⴷⴰⵡ ⵏ ⵡⴰⵎⴷⵓⵏ.

variant-num-to-select-not-constant-number = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵙⴰⵏ ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⴰⵛⴽⵓ numToSelect ⵓⵔ ⵉⴳⵉ ⴰⵎⴹⴰⵏ ⵓⴱⴷⵉⴷ.

variant-with-replacement-not-constant-boolean = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵙⴰⵏ ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⴰⵛⴽⵓ withReplacement ⵓⵔ ⵉⴳⵉ boolean ⵓⴱⴷⵉⴷ.

variant-select-weight-disables-unique = ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ select ⵜⵜⵓⵙⵏⵙⵏⵜ ⵎⴽ ⵉⵍⵍⴰ ⵓⵙⵜⴰⵢ ⵉⵍⴰⵏ selectWeight ⵏⵖ selectForVariants

variant-coprime-undetermined = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵙⴰⵏ ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⴰⵛⴽⵓ ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵙⴰⵏ ⵎⴽ coprime ⴷ ⵜⴰⴽⵔⴹⵉⵜ ⴽⵓ ⵜⵉⴽⴽⵍⵜ.

variant-attribute-not-constant = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵙⴰⵏ ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⴰⵛⴽⵓ { $attribute } ⵓⵔ ⵉⵇⵇⵉⵎ ⴰⵎ ⴰⵢⴰⴷ.

variant-attribute-not-number = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵙⴰⵏ ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⴰⵛⴽⵓ { $attribute } ⵓⵔ ⵉⴳⵉ ⴰⵎⴹⴰⵏ.

variant-attribute-wrong-type-for-sequence =
    ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵙⴰⵏ ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⵏ ⵓⵏⴰⵡ { $type } ⴰⵛⴽⵓ { $attribute } ⵓⵔ ⵉⴳⵉ { $expected ->
        [letters-combination] ⴰⵙⴷⵓⴽⴽⵍ ⵏ ⵢⵉⵙⴽⴽⵉⵍⵏ
        [math-expression] ⵜⴰⵏⴼⴰⵍⵉⵜ ⵜⵓⵙⵏⴰⴽⵜ ⵢⵜⵜⵓⵙⵉⵔⴳⵏ
        [integer] ⴰⵎⴹⴰⵏ ⵓⵎⵎⵉⴷ
       *[number] ⴰⵎⴹⴰⵏ
    }.

variant-length-not-integer = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵙⴰⵏ ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⴰⵛⴽⵓ length ⵓⵔ ⵉⴳⵉ ⴰⵎⴹⴰⵏ ⵓⵎⵎⵉⴷ.

variant-sort-not-implemented = ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⵉⵍⴰⵏ sort ⵓⵔ ⵜⵜⵓⵙⴽⴰⵔⵏⵜ

variant-exclude-combinations-not-implemented = ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⵉⵍⴰⵏ excludeCombinations ⵓⵔ ⵜⵜⵓⵙⴽⴰⵔⵏⵜ

variant-math-exclude-not-implemented = ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⵏ ⵓⵏⴰⵡ math ⵉⵍⴰⵏ exclude ⵓⵔ ⵜⵜⵓⵙⴽⴰⵔⵏⵜ

variant-non-constant-exclude-not-implemented = ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⵉⵍⴰⵏ exclude ⵓⴱⴷⴷⴰⵍ ⵓⵔ ⵜⵜⵓⵙⴽⴰⵔⵏⵜ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ⵓⵔ ⵢⵜⵜⵓⵙⴼⵔⴰⴽ ⴳ ⵓⵎⵙⴽⵏ graph prefigure; ⴰⵎⴷⵓⵔ ⵢⵜⵜⵓⵊⵊⴰ.

prefigure-descendant-invalid-geometry = { $subject }: ⵜⴰⵏⵣⴳⴳⵉⵜ ⵓⵔ ⵉⴽⵎⵎⵍⵏ; ⴰⵎⴷⵓⵔ ⵢⵜⵜⵓⵊⵊⴰ.

prefigure-curve-label-omitted = { $subject }: ⵜⵉⴱⵣⵉⵎⵉⵏ ⵓⵔ ⵜⵜⵓⵙⴼⵔⴰⴽⵏⵜ ⴳ ⵢⵉⴼⵔⴷⵉⵙⵏ ⵏ ⵓⴽⵏⴰⵏ ⵢⵜⵜⵓⵙⵏⴼⵍⵏ; ⵜⴰⴱⵣⵉⵎⵜ ⵜⵜⵓⵊⵊⴰ.

prefigure-curve-unsupported-definition-type = { $subject }: ⴰⵏⴰⵡ ⵏ ⵜⴱⴰⴷⵓⵜ ⵏ ⵜⵡⵓⵔⵉ ⵏ ⵓⴽⵏⴰⵏ '{ $definitionType }' ⵓⵔ ⵢⵜⵜⵓⵙⴼⵔⴰⴽ; ⴰⵎⴷⵓⵔ ⵢⵜⵜⵓⵊⵊⴰ.

prefigure-region-flip-functions-unsupported = { $subject }: ⴰⵎⵙⵍⴰⵢ flipFunctions ⴳ regionBetweenCurves ⵓⵔ ⵢⵜⵜⵓⵙⴼⵔⴰⴽ; ⴰⵎⴷⵓⵔ ⵢⵜⵜⵓⵊⵊⴰ.

prefigure-region-non-formula-child = { $subject }: ⴷ ⵜⵉⵡⵓⵔⵉⵡⵉⵏ ⵏ ⵡⴰⵔⵔⴰⵡ ⵏ ⵓⵏⴰⵡ formula ⵖⴰⵙ ⵜⵜⵓⵙⴼⵔⴰⴽⵏⵜ ⴳ regionBetweenCurves; ⴰⵎⴷⵓⵔ ⵢⵜⵜⵓⵊⵊⴰ.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ⵓⵔ ⵜⵜⵓⵙⴼⵔⴰⴽ ⵉ { $labelKind ->
        [line-family] ⵜⴰⴱⵣⵉⵎⵜ ⵏ ⵜⵡⴰⵛⵓⵍⵜ ⵏ ⵢⵉⵣⵉⵔⵉⴳⵏ
       *[point] ⵜⴰⴱⵣⵉⵎⵜ ⵏ ⵜⵏⵇⵉⴹⵜ
    }; ⵢⵜⵜⵓⵙⵎⵔⴰⵙ ⵓⵎⵙⴰⵙⴰ ⴰⵎⵣⵡⴰⵔⵓ ⵏ PreFigure.

prefigure-fill-style-unsupported = { $subject }: ⴰⵖⴰⵏⵉⴱ ⵏ ⵓⵛⵛⴰⵔ '{ $fillStyle }' ⵓⵔ ⵢⵜⵜⵓⵙⴼⵔⴰⴽ ⵙ PreFigure; ⵢⵜⵜⵓⵔⴰⵔ ⵖⵔ ⵓⵛⵛⴰⵔ ⴰⵇⵇⵓⵔ.

prefigure-line-style-unknown = { $subject }: ⴰⵖⴰⵏⵉⴱ ⵏ ⵢⵉⵣⵉⵔⵉⴳ ⵓⵔ ⵉⵜⵜⵓⵙⵙⴰⵏⵏ '{ $lineStyle }' ⵢⵜⵜⵓⵊⵊⴰ ⴳ ⵜⵓⴼⴼⵖⴰ ⵏ PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: ⴰⵖⴰⵏⵉⴱ ⵏ ⵓⵣⴰⵎⵓⵍ '{ $markerStyle }' ⵢⵜⵜⵓⵙⵏⴼⵍ ⵖⵔ ⵓⵖⴰⵏⵉⴱ PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: ⴰⵖⴰⵏⵉⴱ ⵏ ⵓⵣⴰⵎⵓⵍ '{ $markerStyle }' ⵓⵔ ⵢⵜⵜⵓⵙⴼⵔⴰⴽ ⵙ PreFigure; ⵢⵜⵜⵓⵙⵎⵔⴰⵙ ⵓⵖⴰⵏⵉⴱ ⴰⵎⵣⵡⴰⵔⵓ.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ⴰⵔⴰⵎⵖⵜⵓ; ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵢⴰⴼ ⵉⵙⵡⵉ. ⵜⴰⵣⵎⵉⵍⵜ ⵜⵜⵓⵊⵊⴰ.

annotation-ref-multiple-targets = `<annotation>`: `ref` ⵉⵎⵎⵍ ⴰⵟⵟⴰⵙ ⵏ ⵢⵉⵙⵡⵉⵜⵏ; ⵢⵜⵜⵓⵙⵎⵔⴰⵙ ⴰⵎⵣⵡⴰⵔⵓ.

annotation-ref-outside-graph = `<annotation>`: `ref` ⴰⵔⴰⵎⵖⵜⵓ; ⵉⵙⵡⵉ ⵉⵍⵍⴰ ⴱⵔⵔⴰ ⵏ graph ⵉⵜ ⵢⵓⵎⵥⵏ. ⵜⴰⵣⵎⵉⵍⵜ ⵜⵜⵓⵊⵊⴰ.

annotation-ref-unsupported-target = `<annotation>`: `ref` ⴰⵔⴰⵎⵖⵜⵓ; ⵉⵙⵡⵉ ⵓⵔ ⵉⴳⵉ ⵜⴰⵖⴰⵡⵙⴰ ⵏ ⵜⵓⴳⵏⴰ ⵜⵜⵓⵙⴼⵔⴰⴽⵏ ⴳ ⵓⵙⵏⴼⵍ prefigure. ⵜⴰⵣⵎⵉⵍⵜ ⵜⵜⵓⵊⵊⴰ.

annotation-text-missing = `<annotation>`: `text` ⵓⵔ ⵉⵍⵍⵉ ⵏⵖ ⴷ ⵉⵍⵎ; ⵜⵜⵓⵙⵓⴼⴼⵖ ⴰⴹⵔⵉⵙ ⵉⵍⵎ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] ⵢⵜⵜⵓⴼ ⵓⵙⵜⵄⵎⵍ ⴰⵡⵉⵏⵙⴰⵏ.
       *[other] ⵢⵜⵜⵓⴼ ⵓⵙⵜⵄⵎⵍ ⴰⵡⵉⵏⵙⴰⵏ ⵉⵍⴰⵏ ⴰⴼⵔⴷⵉⵙ `<{ $componentType }>`.
    }

reference-no-referent = ⵓⵔ ⵢⵜⵜⵓⴼ ⵢⴰⵜ ⵉ ⵜⵎⵖⵕⵉⵜ: `{ $reference }`

reference-multiple-referents = ⵜⵜⵓⴼⵏ ⴰⵟⵟⴰⵙ ⵏ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ ⵉ ⵜⵎⵖⵕⵉⵜ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = ⴰⵎⴰⵙⴰⵍ ⴰⵔⴰⵎⵖⵜⵓ ⵏ ⵓⵎⵙⵍⴰⵢ { $attribute } ⵏ `<{ $componentType }>`.

children-invalid = ⴰⵔⵔⴰⵡ ⵉⵔⴰⵎⵖⵜⵓⵢⵏ ⵏ `<{ $componentType }>`: ⵜⵜⵓⴼⵏ ⵡⴰⵔⵔⴰⵡ ⵉⵔⴰⵎⵖⵜⵓⵢⵏ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = ⴰⵣⴰⵍ ⴰⵔⴰⵎⵖⵜⵓ `{ $value }` ⵏ ⵓⵎⵙⵍⴰⵢ `{ $attribute }`, ⵢⵜⵜⵓⵙⵎⵔⴰⵙ ⵡⴰⵣⴰⵍ `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] ⵍⵇⵎ DoenetML { $version } ⵓⵔ ⵢⵜⵜⵓⴼ.
       *[other] ⵍⵇⵎ DoenetML { $version } ⵓⵔ ⵢⵜⵜⵓⴼ. ⵢⵜⵜⵓⵔⴰⵔ ⵖⵔ ⵍⵇⵎ { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ⴰⵔⴰⵎⵖⵜⵓ: { $content }

parse-tag-missing-close-tag = DoenetML ⴰⵔⴰⵎⵖⵜⵓ: ⵜⴰⴱⵣⵉⵎⵜ `{ $tag }` ⵓⵔ ⴷⴰⵔⵙ ⵜⴰⴱⵣⵉⵎⵜ ⵏ ⵓⵎⴷⴰⵍ. ⵢⵜⵜⵓⵔⴰⵊⴰ ⵓⴱⵣⵉⵎ ⵉⵜⵜⵇⵇⵏⵏ ⵙ ⵉⵅⴼ ⵏⵏⵙ ⵏⵖ ⵜⴰⴱⵣⵉⵎⵜ `</{ $tagName }>`.

parse-tag-error = DoenetML ⴰⵔⴰⵎⵖⵜⵓ: ⵜⴰⵣⴳⴰⵍⵜ ⴳ ⵜⴱⵣⵉⵎⵜ `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ⴰⵔⴰⵎⵖⵜⵓ: ⴰⵎⵙⵍⴰⵢ ⴰⵔⴰⵎⵖⵜⵓ `{ $attribute }` ⵉⵜⵜⴱⴰⵏ ⴰⵎ ⵓⵔ ⴷⴰⵔⵙ ⴰⵣⴰⵍ.

parse-attribute-invalid = DoenetML ⴰⵔⴰⵎⵖⵜⵓ: ⴰⵎⵙⵍⴰⵢ ⴰⵔⴰⵎⵖⵜⵓ `{ $attribute }`

parse-attribute-value-invalid = DoenetML ⴰⵔⴰⵎⵖⵜⵓ: ⴰⵣⴰⵍ ⵏ ⵓⵎⵙⵍⴰⵢ ⴰⵔⴰⵎⵖⵜⵓ `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML ⴰⵔⴰⵎⵖⵜⵓ: ⴰⵣⴰⵍ ⵏ ⵓⵎⵙⵍⴰⵢ ⴰⵔⴰⵎⵖⵜⵓ `{ $value }`. ⵜⵉⵛⵔⴰⴹ ⵏ ⵜⴱⴷⵔⵜ ⵓⵔ ⵎⵙⴰⵙⴰⵏⵜ. ⵉⵜⵜⴱⴰⵏ ⴰⵎ ⵉⵅⵚⵕ `{ $quote }`

parse-open-tag-name-missing = DoenetML ⴰⵔⴰⵎⵖⵜⵓ: ⵜⵜⵓⴼ ⵜⴱⵣⵉⵎⵜ ⴱⵍⴰ ⵉⵙⵎ, ⴰⵎⴷⵢⴰ `<`

parse-tag-not-closed = DoenetML ⴰⵔⴰⵎⵖⵜⵓ: ⵜⴰⴱⵣⵉⵎⵜ `{ $tag }` ⵓⵔ ⵜⵜⵓⵇⵇⵏ (ⵉⵜⵜⴱⴰⵏ ⴰⵎ ⵉⵅⵚⵕ `>`).

parse-self-closing-tag-name-missing = DoenetML ⴰⵔⴰⵎⵖⵜⵓ: ⵜⵜⵓⴼ ⵜⴱⵣⵉⵎⵜ ⴱⵍⴰ ⵉⵙⵎ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ⴰⵔⴰⵎⵖⵜⵓ: ⵜⴰⴱⵣⵉⵎⵜ `{ $tag }` ⵓⵔ ⵜⵜⵓⵇⵇⵏ (ⵉⵜⵜⴱⴰⵏ ⴰⵎ ⵉⵅⵚⵕ `/>`).

parse-tag-invalid-attributes = DoenetML ⴰⵔⴰⵎⵖⵜⵓ: ⵜⴰⴱⵣⵉⵎⵜ `{ $tag }` ⵓⵔ ⵜⵜⵓⵙⵉⵔⴳ. ⵜⵣⴹⴰⵕ ⴰⴷ ⴷⴰⵔⵙ ⵉⵍⵉⵏ ⵉⵎⵙⵍⴰⵢⵏ ⵉⵔⴰⵎⵖⵜⵓⵢⵏ.

parse-close-tag-name-missing = DoenetML ⴰⵔⴰⵎⵖⵜⵓ: ⵜⵜⵓⴼ ⵜⴱⵣⵉⵎⵜ ⵏ ⵓⵎⴷⴰⵍ ⴱⵍⴰ ⵉⵙⵎ, ⴰⵎⴷⵢⴰ `</`

parse-attribute-value-unquoted = ⴰⵣⴰⵍⵏ ⵏ ⵢⵉⵎⵙⵍⴰⵢⵏ ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⵍⵉⵏ ⴳⵔ ⵜⵉⵛⵔⴰⴹ ⵏ ⵜⴱⴷⵔⵜ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ⴰⵔⴰⵎⵖⵜⵓ: ⵜⵜⵓⴼ ⵜⴱⵣⵉⵎⵜ ⵏ ⵓⵎⴷⴰⵍ `{ $tag }`, ⵎⴰⵛⴰ ⵓⵔ ⵜⵍⵍⵉ ⵜⴱⵣⵉⵎⵜ ⵏ ⵓⵔⵣⵎ ⵜⵜ ⵉⵎⵙⴰⵙⴰⵏ

parse-close-tag-mismatched = DoenetML ⴰⵔⴰⵎⵖⵜⵓ: ⵜⴰⴱⵣⵉⵎⵜ ⵏ ⵓⵎⴷⴰⵍ ⵓⵔ ⵜⵎⵙⴰⵙⴰ. ⵢⵜⵜⵓⵔⴰⵊⴰ `</{ $expected }>`. ⵢⵜⵜⵓⴼ `{ $found }`

parser-node-unconvertible = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵏⴼⵍ ⴰⵏⴰⴳⵔⴰⵡ { $node } ⵖⵔ ⵓⵏⴰⴳⵔⴰⵡ Dast.

## Names

name-attribute-invalid =
    ⵉⵙⵎ ⵏ ⵓⵎⵙⵍⴰⵢ ⴷ ⴰⵔⴰⵎⵖⵜⵓ name='{ $name }'. { $reason ->
        [characters] ⵉⵙⵎⴰⵡⵏ ⵣⴹⴰⵕⵏ ⴰⴷ ⴷⴰⵔⵙⵏ ⵉⵍⵉⵏ ⵖⴰⵙ ⵉⵙⴽⴽⵉⵍⵏ, ⵉⵎⴹⴰⵏⵏ, ⵉⵊⵔⵔⵉⴷⵏ ⵏ ⵡⴰⴷⴷⴰ ⵏⵖ ⵉⵊⵔⵔⵉⴷⵏ.
       *[start] ⵉⵙⵎⴰⵡⵏ ⵉⵇⵇⴰⵏ ⴰⴷ ⴱⴷⵓⵏ ⵙ ⵓⵙⴽⴽⵉⵍ.
    }

component-name-invalid-start = ⵉⵙⵎ ⵏ ⵓⴼⵔⴷⵉⵙ ⴷ ⴰⵔⴰⵎⵖⵜⵓ "{ $name }". ⵉⵙⵎⴰⵡⵏ ⵉⵇⵇⴰⵏ ⴰⴷ ⴱⴷⵓⵏ ⵙ ⵓⵙⴽⴽⵉⵍ.

## `<answer>` sugar

answer-video-watched-missing-video = ⵜⵉⵔⵉⵔⵉⵜ ⵏ ⵓⵏⴰⵡ videoWatched ⵉⵇⵇⴰⵏ ⴰⴷ ⴷⴰⵔⵙ ⵢⵉⵍⵉ ⵓⵎⵙⵍⴰⵢ video

answer-video-watched-video-not-reference = ⵜⵉⵔⵉⵔⵉⵜ ⵏ ⵓⵏⴰⵡ videoWatched ⵉⵇⵇⴰⵏ ⴰⴷ ⴷⴰⵔⵙ ⵢⵉⵍⵉ ⵓⵎⵙⵍⴰⵢ video ⵉⴳⴰⵏ ⵜⴰⵎⵖⵕⵉⵜ

answer-name-not-single-text = ⴰⵎⵙⵍⴰⵢ name ⵏ ⵜⵉⵔⵉⵔⵉⵜ ⵉⵇⵇⴰⵏ ⴰⴷ ⴷⴰⵔⵙ ⵢⵉⵍⵉ ⵢⴰⵏ ⵡⴰⵔⵔⴰⵡ ⵏ ⵓⴹⵔⵉⵙ

## Referencing another document

external-doenetml-recursion-limit = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⴷ ⵢⴰⵡⵉ DoenetML ⵏ ⴱⵔⵔⴰ ⴰⵛⴽⵓ ⴰⵟⵟⴰⵙ ⵏ ⵢⵉⵙⵡⵉⵔⵏ ⵏ ⵡⴰⵍⵍⵓⵙ. ⵉⵍⵍⴰ ⵓⴳⴳⴰⵔ ⵏ ⵜⵎⵖⵕⵉⵜ ⵜⴰⵡⵉⵏⵙⴰⵏⵜ?

external-doenetml-unavailable = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⴷ ⵢⴰⵡⵉ DoenetML ⵣⴳ { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ⵉⴷ ⵢⵜⵜⵓⵡⵉⵏ ⵣⴳ { $attribute }="{ $uri }" ⴷ ⴰⵔⴰⵎⵖⵜⵓ: ⵓⵔ ⵉⵎⵙⴰⵙⴰ ⴷ ⵓⵏⴰⵡ ⵏ ⵓⴼⵔⴷⵉⵙ "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] ⴰⵎⵙⵍⴰⵢ `{ $from }` ⵓⵔ ⵢⵜⵜⵓⵙⵎⵔⴰⵙ; ⵙⵎⵔⵙ `{ $to }` ⴳ ⵓⵎⴽⴰⵏ ⵏⵏⵙ.
       *[other] [deprecation] ⴰⵎⵙⵍⴰⵢ `{ $from }` ⴳ `<{ $component }>` ⵓⵔ ⵢⵜⵜⵓⵙⵎⵔⴰⵙ; ⵙⵎⵔⵙ `{ $to }` ⴳ ⵓⵎⴽⴰⵏ ⵏⵏⵙ.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] ⴰⵎⵙⵍⴰⵢ `{ $from }` ⵓⵔ ⵢⵜⵜⵓⵙⵎⵔⴰⵙ ⴷ ⵢⵜⵜⵓⵣⴳⴰⵍ ⴰⵛⴽⵓ `{ $to }` ⵜⵜⵓⵙⵜⴰⵢ ⵓⵍⴰ ⵏⵜⵜⴰⵜ.
       *[other] [deprecation] ⴰⵎⵙⵍⴰⵢ `{ $from }` ⴳ `<{ $component }>` ⵓⵔ ⵢⵜⵜⵓⵙⵎⵔⴰⵙ ⴷ ⵢⵜⵜⵓⵣⴳⴰⵍ ⴰⵛⴽⵓ `{ $to }` ⵜⵜⵓⵙⵜⴰⵢ ⵓⵍⴰ ⵏⵜⵜⴰⵜ.
    }

deprecated-attribute-ignored = [deprecation] ⴰⵎⵙⵍⴰⵢ `{ $attribute }` ⴳ `<{ $component }>` ⵓⵔ ⵢⵜⵜⵓⵙⵎⵔⴰⵙ ⴷ ⵢⵜⵜⵓⵣⴳⴰⵍ.

deprecated-attribute-to-child = [deprecation] ⴰⵎⵙⵍⴰⵢ `{ $attribute }` ⴳ `<{ $component }>` ⵓⵔ ⵢⵜⵜⵓⵙⵎⵔⴰⵙ; ⵙⵎⵔⵙ ⴰⵔⵔⴰⵡ `<{ $child }>` ⴳ ⵓⵎⴽⴰⵏ ⵏⵏⵙ.

deprecated-attribute-value-renamed = [deprecation] ⴰⵣⴰⵍ `{ $value }` ⵏ ⵓⵎⵙⵍⴰⵢ `{ $attribute }` ⴳ `<{ $component }>` ⵓⵔ ⵢⵜⵜⵓⵙⵎⵔⴰⵙ; ⵙⵎⵔⵙ `{ $to }` ⴳ ⵓⵎⴽⴰⵏ ⵏⵏⵙ.


## Language coverage

pluralize-english-only = `<pluralize>` ⵜⵣⴹⴰⵕ ⵖⴰⵙ ⴰⴷ ⵜⵙⴽⵔ ⴰⵙⴳⵜ ⵏ ⵜⴳⵍⵉⵣⵉⵜ, ⵖⵉⴽⴰⵏ ⴰⴹⵔⵉⵙ ⵏⵏⵙ ⵢⵜⵜⵓⵊⵊⴰ ⴰⵎ ⵎⴰⵢⴰⴷ ⴳ ⵓⵙⵎⵍⵉ ⵢⵓⵔⴰⵏ ⵙ { $locale }. ⴰⵔⵉ ⵜⴰⵍⵖⴰ ⵏ ⵓⵙⴳⵜ ⵙ ⵉⵅⴼ ⵏⵏⴽ, ⵏⵖ ⵙⵔⵙ ⵜⵜ ⵙ ⵓⵎⵙⵍⴰⵢ `pluralForm`.


## Checking against the schema

schema-element-unrecognized = ⴰⴼⵔⴷⵉⵙ `<{ $tag }>` ⵓⵔ ⵉⴳⵉ ⴰⴼⵔⴷⵉⵙ Doenet ⵢⵜⵜⵓⵙⵙⴰⵏⵏ.

schema-element-not-allowed-at-root = ⴰⴼⵔⴷⵉⵙ `<{ $tag }>` ⵓⵔ ⵢⵜⵜⵓⵙⵉⵔⴳ ⴳ ⵓⵥⴰⵔ ⵏ ⵓⵙⵎⵍⵉ.

schema-element-not-allowed-inside = ⴰⴼⵔⴷⵉⵙ `<{ $tag }>` ⵓⵔ ⵢⵜⵜⵓⵙⵉⵔⴳ ⴳ `<{ $parent }>`.

schema-attribute-unrecognized = ⴰⴼⵔⴷⵉⵙ `<{ $tag }>` ⵓⵔ ⴷⴰⵔⵙ ⴰⵎⵙⵍⴰⵢ ⵢⵜⵜⵓⵙⵎⵎⴰⵏ `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] ⴰⵎⵙⵍⴰⵢ `{ $attribute }` ⵏ ⵓⴼⵔⴷⵉⵙ `<{ $tag }>` ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⴳ ⴰⵎⵓⵖ ⵍⵍⵉ ⴳ ⴽⵓ ⵜⴰⵖⴰⵡⵙⴰ ⴷ ⵢⴰⵜ ⵣⴳ: { $allowed }
       *[other] ⴰⵎⵙⵍⴰⵢ `{ $attribute }` ⵏ ⵓⴼⵔⴷⵉⵙ `<{ $tag }>` ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⴳ ⵢⴰⵏ ⵣⴳ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = ⵉⵙⵎ ⵏ ⵜⵍⵖⴰ ⴷ ⴰⵔⴰⵎⵖⵜⵓ ⵉ select.  ⵉⵙⵎ ⵏ ⵜⵍⵖⴰ { $variantName } ⵉⵜⵜⴱⴰⵏ ⴳ { $numOptions } ⵏ ⵢⵉⵙⵜⴰⵢⵏ ⵎⴰⵛⴰ ⴰⵎⴹⴰⵏ ⵏ ⵓⵙⵜⴰⵢ ⴷ { $numToSelect }.

select-variant-name-without-options = ⴽⵔⴰ ⵏ ⵜⵍⵖⴰ ⵜⵜⵓⵙⵜⴰⵢⵏⵜ ⵉ select ⵎⴰⵛⴰ ⵓⵔ ⵍⵍⵉⵏ ⵢⵉⵙⵜⴰⵢⵏ ⵉ ⵢⵉⵙⵎ ⵏ ⵜⵍⵖⴰ ⵉⵣⴹⴰⵕⵏ: { $variantName }.

select-variant-name-not-possible = ⵉⵙⵎ ⵏ ⵜⵍⵖⴰ { $variantName } ⵢⵜⵜⵓⵙⵜⴰⵢⵏ ⵉ select ⵓⵔ ⵉⴳⵉ ⵉⵙⵎ ⵏ ⵜⵍⵖⴰ ⵉⵣⴹⴰⵕⵏ.

select-too-few-options = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵜⵉ { $numToSelect } ⵏ ⵢⵉⴼⵔⴷⵉⵙⵏ ⵣⴳ { $numOptions } ⵖⴰⵙ.

select-from-sequence-too-few-values = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵜⵉ { $numToSelect } ⵏ ⵡⴰⵣⴰⵍⵏ ⵣⴳ ⵓⵙⴷⴷⵉ ⵏ ⵜⵖⵣⵉ { $length }.

select-from-sequence-indices-count-mismatch = ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵎⴹⴰⵏⵏ ⵢⵜⵜⵓⵙⵜⴰⵢⵏ ⵉ select ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⵎⵙⴰⵙⴰ ⴷ ⵓⵎⴹⴰⵏ ⵏ ⵓⵙⵜⴰⵢ

select-from-sequence-indices-not-integers = ⴰⴽⴽⵯ ⵉⵎⴹⴰⵏⵏ ⵢⵜⵜⵓⵙⵜⴰⵢⵏ ⵉ select ⵉⵇⵇⴰⵏ ⴰⴷ ⴳⵏ ⵉⵎⴹⴰⵏⵏ ⵓⵎⵎⵉⴷⵏ

select-from-sequence-index-excluded = ⴰⵎⴹⴰⵏ ⵢⵜⵜⵓⵙⵜⴰⵢⵏ ⵏ selectfromsequence ⵢⵜⵜⵓⴽⴽⵙ

select-from-sequence-indices-excluded-combination = ⵉⵎⴹⴰⵏⵏ ⵢⵜⵜⵓⵙⵜⴰⵢⵏ ⵏ selectfromsequence ⴳⴰⵏ ⴰⵙⴷⵓⴽⴽⵍ ⵢⵜⵜⵓⴽⴽⵙⵏ

select-from-sequence-coprime-not-positive-integers = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵜⵉ ⵉⵙⴷⵓⴽⴽⴰⵍ coprime ⴰⵛⴽⵓ ⵓⵔ ⵜⵜⵓⵙⵜⴰⵢⵏ ⵢⵉⵎⴹⴰⵏⵏ ⵓⵎⵎⵉⴷⵏ ⵓⴼⵔⵉⵏⵏ.

select-from-sequence-coprime-common-factor = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵜⵉ ⵉⵎⴹⴰⵏⵏ coprime. ⴰⴽⴽⵯ ⴰⵣⴰⵍⵏ ⵉⵣⴹⴰⵕⵏⵉⵏ ⴷⴰⵔⵙⵏ ⵢⴰⵏ ⵓⴼⴰⴽⵜⵓⵔ. (ⴰⵣⴰⵍⵏ ⵏ "from" ⵏⵖ "to" ⵉⵇⵇⴰⵏ ⴰⴷ ⴳⵏ coprime ⴷ "step".)

select-from-sequence-coprime-single-number = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵜⵉ ⵉⵙⴷⵓⴽⴽⴰⵍ coprime ⵣⴳ ⵢⴰⵏ ⵓⵎⴹⴰⵏ ⵓⵔ ⵉⴳⵉⵏ 1.

select-from-sequence-excluded-too-many-combinations = ⵜⵜⵓⴽⴽⵙⵏ ⵓⴳⴳⴰⵔ ⵏ 70% ⵏ ⵢⵉⵙⴷⵓⴽⴽⴰⵍ ⴳ selectFromSequence

select-from-sequence-coprime-none-found = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵜⵉ ⵉⵎⴹⴰⵏⵏ coprime. ⴰⴽⴽⵯ ⴰⵣⴰⵍⵏ ⵉⵣⴹⴰⵕⵏⵉⵏ ⴷⴰⵔⵙⵏ ⵢⴰⵏ ⵓⴼⴰⴽⵜⵓⵔ.

select-from-sequence-too-few-unique-values = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵜⵉ { $numToSelect } ⵏ ⵡⴰⵣⴰⵍⵏ ⵓⵎⵎⵉⴷⵏ ⵣⴳ ⵓⵙⴷⴷⵉ ⵏ ⵜⵖⵣⵉ { $numPossibleValues }

select-prime-numbers-too-few-values = ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵜⵉ { $numToSelect } ⵏ ⵡⴰⵣⴰⵍⵏ ⵣⴳ ⵓⵎⵓⵖ ⵏ ⵢⵉⵎⴹⴰⵏⵏ prime ⵏ ⵜⵖⵣⵉ { $numValues }

select-prime-numbers-values-count-mismatch = ⴰⵎⴹⴰⵏ ⵏ ⵡⴰⵣⴰⵍⵏ ⵢⵜⵜⵓⵙⵜⴰⵢⵏ ⵉ select ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⵎⵙⴰⵙⴰ ⴷ ⵓⵎⴹⴰⵏ ⵏ ⵓⵙⵜⴰⵢ

select-prime-numbers-values-not-prime = ⴰⴽⴽⵯ ⴰⵣⴰⵍⵏ ⵢⵜⵜⵓⵙⵜⴰⵢⵏ ⵉ select prime number ⵉⵇⵇⴰⵏ ⴰⴷ ⵉⵍⵉⵏ ⴳ ⵓⵎⵓⵖ ⵏ ⵢⵉⵎⴹⴰⵏⵏ prime

select-prime-numbers-values-excluded-combination = ⴰⵣⴰⵍⵏ ⵢⵜⵜⵓⵙⵜⴰⵢⵏ ⵏ selectPrimeNumbers ⴳⴰⵏ ⴰⵙⴷⵓⴽⴽⵍ ⵢⵜⵜⵓⴽⴽⵙⵏ

select-prime-numbers-excluded-too-many-combinations = ⵜⵜⵓⴽⴽⵙⵏ ⵓⴳⴳⴰⵔ ⵏ 70% ⵏ ⵢⵉⵙⴷⵓⴽⴽⴰⵍ ⴳ selectPrimeNumbers

select-random-combination-fluke = ⵙ ⵎⴰ ⵓⵔ ⵉⵜⵜⵓⵔⴰⵊⴰⵏ ⴱⴰⵀⵔⴰ, ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵜⵉ ⴰⵙⴷⵓⴽⴽⵍ ⵏ ⵡⴰⵣⴰⵍⵏ ⴱⵍⴰ ⴰⵙⵜⴰⵢ

select-random-value-fluke = ⵙ ⵎⴰ ⵓⵔ ⵉⵜⵜⵓⵔⴰⵊⴰⵏ ⴱⴰⵀⵔⴰ, ⵓⵔ ⵉⵣⴹⴰⵕ ⴰⴷ ⵉⵙⵜⵉ ⴰⵣⴰⵍ ⴱⵍⴰ ⴰⵙⵜⴰⵢ
