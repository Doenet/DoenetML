# Standard Moroccan Tamazight diagnostics: errors and warnings surfaced to the
# reader or author. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`
# and the rest — are part of the language rather than prose, and stay in
# English and in Latin letters exactly as written. So does the `[deprecation]`
# marker, and so do the digits.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ ⵎⴽ ⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏⵜ ⵙⵏⴰⵜ ⵏ ⵜⴻⵏⵇⵉⴹⵉⵏ ⵏ ⵜⴰⴳⴰⵔⴰ
       *[other] { $attributes } ⵜⵜⵡⴰⵣⴳⵍⴻⵏ ⵎⴽ ⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏⵜ ⵙⵏⴰⵜ ⵏ ⵜⴻⵏⵇⵉⴹⵉⵏ ⵏ ⵜⴰⴳⴰⵔⴰ
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ ⵎⴽ ⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏⵜ ⵜⴰⵏⵇⵉⴹⵜ ⵏ ⵜⴰⴳⴰⵔⴰ ⴷ ⵜⴻⵏⵇⵉⴹⵜ ⵜⴰⵍⴻⵎⵎⴰⵙⵜ
       *[other] { $attributes } ⵜⵜⵡⴰⵣⴳⵍⴻⵏ ⵎⴽ ⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏⵜ ⵜⴰⵏⵇⵉⴹⵜ ⵏ ⵜⴰⴳⴰⵔⴰ ⴷ ⵜⴻⵏⵇⵉⴹⵜ ⵜⴰⵍⴻⵎⵎⴰⵙⵜ
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ⵓⵍⴰⵛ ⴼⴻⵍⵍ-ⴰⵙ ⴰⵣⴰⵍ ⵡⴰⵔ ⵜⴰⵏⵇⵉⴹⵜ ⵜⴰⵍⴻⵎⵎⴰⵙⵜ

## `<line>`

line-points-undetermined-dimensions = ⵉⵣⵉⵔⵉⴳ ⵢⴻⵜⵜⵄⴻⴷⴷⵉⵏ ⵅⴼ ⵜⴻⵏⵇⵉⴹⵉⵏ ⵏ ⵜⴻⵙⴻⴽⴽⵉⵔⵉⵏ ⵓⵔ ⵏⴻⵜⵜⵡⴰⵙⵙⴻⵏ ⴰⵔⴰ.

line-points-too-few-dimensions = ⵉⵣⵉⵔⵉⴳ ⵉⵍⴰⵇ ⴰⴷ ⵉⵄⴻⴷⴷⵉ ⵅⴼ ⵜⴻⵏⵇⵉⴹⵉⵏ ⵏ ⵙⵏⴰⵜ ⵏ ⵜⴻⵙⴻⴽⴽⵉⵔⵉⵏ ⴷ ⴰⵙⴰⵡⴻⵏ.

line-points-depend-on-variables = ⵉⵣⵉⵔⵉⴳ ⵢⴻⵜⵜⵄⴻⴷⴷⵉ ⵅⴼ ⵜⴻⵏⵇⵉⴹⵉⵏ ⵉ ⵢⴻⵙⵜⴻⵄⵎⵉⵍⴻⵏ ⵉⵎⵓⵜⵉⵢⴻⵏ: { $variables }.

line-equation-invalid-format = ⴰⵎⴰⵙⴰⵍ ⴰⵔⴰⵎⴻⵖⵜⵓ ⵏ ⵜⴻⴳⴷⴰ ⵏ ⵢⵉⵣⵉⵔⵉⴳ ⴷⴻⴳ ⵢⵉⵎⵓⵜⵉⵢⴻⵏ { $variable1 } ⴷ { $variable2 }.

## `<ray>`

ray-overprescribed-through = ⴰⵣⵔⴰⵔ ⵢⴻⵜⵜⵡⴰⵙⴱⴰⴷⵓ ⵙ through, endpoint ⴷ direction.  through ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ.

ray-dimension-mismatch = numDimensions ⵓⵔ ⵜⴻⵎⵚⴰⴷⴰ ⴰⵔⴰ ⴷⴻⴳ ⵓⵣⵔⴰⵔ.

## `<vector>`

vector-overprescribed-head = ⴰⴼⵉⴽⵜⵓⵔ ⵢⴻⵜⵜⵡⴰⵙⴱⴰⴷⵓ ⵙ head, tail ⴷ displacement.  head ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ.

vector-dimension-mismatch = numDimensions ⵓⵔ ⵜⴻⵎⵚⴰⴷⴰ ⴰⵔⴰ ⴷⴻⴳ ⵓⴼⵉⴽⵜⵓⵔ.

## Attracting and constraining

attract-to-without-nearest-point = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⴷ-ⵢⴻⵊⴱⴻⴷ ⵖⴻⵔ `<{ $component }>` ⴰⵛⴽⵓ ⵓⵍⴰⵛ ⵖⵓⵔ-ⵙ ⴰⵎⵓⵜⵉ ⵏ ⵡⴰⴷⴷⴰⴷ nearestPoint.

constrain-to-without-nearest-point = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵉⵃⴱⴻⵙ ⵖⴻⵔ `<{ $component }>` ⴰⵛⴽⵓ ⵓⵍⴰⵛ ⵖⵓⵔ-ⵙ ⴰⵎⵓⵜⵉ ⵏ ⵡⴰⴷⴷⴰⴷ nearestPoint.

constrain-to-interior-without-nearest-point = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵉⵃⴱⴻⵙ ⴷⴻⴳ ⵓⴳⴻⵏⵙⵓ ⵏ `<{ $component }>` ⴰⵛⴽⵓ ⵓⵍⴰⵛ ⵖⵓⵔ-ⵙ ⴰⵎⵓⵜⵉ ⵏ ⵡⴰⴷⴷⴰⴷ nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ ⵉ choiceInput ⵓⵔ ⵏⴻⵍⵍⵉ ⴷ inline

## Ordering children by index

choice-input-indices-count-mismatch = ⵉⵎⴹⴰⵏⴻⵏ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⵉ choiceInput ⵜⵜⵡⴰⵣⴳⵍⴻⵏ ⴰⵛⴽⵓ ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵎⴹⴰⵏⴻⵏ ⵓⵔ ⵢⴻⵎⵚⴰⴷⴰ ⴰⵔⴰ ⴷ ⵓⵎⴹⴰⵏ ⵏ ⵡⴰⵔⵔⴰⵡ ⵏ ⵓⴼⵔⴰⵏ.

pretzel-indices-count-mismatch = ⵉⵎⴹⴰⵏⴻⵏ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⵉ problem ⵜⵜⵡⴰⵣⴳⵍⴻⵏ ⴰⵛⴽⵓ ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵎⴹⴰⵏⴻⵏ ⵓⵔ ⵢⴻⵎⵚⴰⴷⴰ ⴰⵔⴰ ⴷ ⵓⵎⴹⴰⵏ ⵏ ⵡⴰⵔⵔⴰⵡ ⵏ problem.

shuffle-indices-count-mismatch = ⵉⵎⴹⴰⵏⴻⵏ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⵉ shuffle ⵜⵜⵡⴰⵣⴳⵍⴻⵏ ⴰⵛⴽⵓ ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵎⴹⴰⵏⴻⵏ ⵓⵔ ⵢⴻⵎⵚⴰⴷⴰ ⴰⵔⴰ ⴷ ⵓⵎⴹⴰⵏ ⵏ ⵢⵉⴼⴻⵔⴷⵉⵙⴻⵏ.

indices-ignored-out-of-range = ⵉⵎⴹⴰⵏⴻⵏ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⵉ { $component } ⵜⵜⵡⴰⵣⴳⵍⴻⵏ ⴰⵛⴽⵓ ⴽⵔⴰ ⴷⴻⴳ-ⵙⴻⵏ ⴼⴼⵖⴻⵏ ⵉ ⵜⵓⴳⴻⵜ.

pretzel-indices-repeated = ⵉⵎⴹⴰⵏⴻⵏ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⵉ pretzel ⵜⵜⵡⴰⵣⴳⵍⴻⵏ ⴰⵛⴽⵓ ⴽⵔⴰ ⴷⴻⴳ-ⵙⴻⵏ ⵜⵜⵡⴰⵍⵙⴻⵏ.

pretzel-circuit-first-index = ⵉⵎⴹⴰⵏⴻⵏ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⵉ pretzel ⴷⴻⴳ mode circuit ⵜⵜⵡⴰⵣⴳⵍⴻⵏ ⴰⵛⴽⵓ ⴰⵎⴹⴰⵏ ⴰⵎⴻⵣⵡⴰⵔⵓ ⵉⵍⴰⵇ ⴰⴷ ⵢⵉⵍⵉ ⴷ 1.

## `<shuffle>` and `<sort>`

string-children-need-type = ⴰⴽⴽⴻⵏ `<{ $component }>` ⴰⴷ ⵢⴻⴷⴷⵓ ⴷ ⵡⴰⵔⵔⴰⵡ ⵏ ⵡⴰⵡⴰⵍⴻⵏ, ⴰⵎⴻⵙⵍⴰⵢ `type` ⵉⵍⴰⵇ ⴰⴷ ⵢⴻⵜⵜⵡⴰⴼⵔⴻⵏ.

invalid-type-defaulting-to-math = ⴰⵏⴰⵡ { $type } ⴷ ⴰⵔⴰⵎⴻⵖⵜⵓ ⵉ ⵓⴼⴻⵔⴷⵉⵙ { $component }. ⵉⵍⴰⵇ ⴰⴷ ⵢⵉⵍⵉ ⴷ ⵢⵉⵡⴻⵏ ⵙⴻⴳ math, text, number ⵏⴻⵖ boolean. ⵢⴻⵜⵜⵡⴰⵔⵔⴰ ⵖⴻⵔ math ⵙ ⵡⵓⴷⴻⵎ ⴰⵎⴻⵣⵡⴻⵔ.

string-not-valid-component-to-arrange = ⴰⵡⴰⵍ "{ $value }" ⵎⴰⵛⵛⵉ ⴷ ⴰⴼⴻⵔⴷⵉⵙ ⵢⴻⵜⵜⵓⵙⵉⵔⴳⴻⵏ ⵉ { $component }. ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ.

## Types and variables

invalid-type-defaulting-to-number = ⴰⵏⴰⵡ { $type } ⴷ ⴰⵔⴰⵎⴻⵖⵜⵓ, ⴰⵏⴰⵡ ⵢⴻⵜⵜⵡⴰⵔⵔⴰ ⵖⴻⵔ number.

invalid-variable-value = ⴰⵣⴰⵍ ⴰⵔⴰⵎⴻⵖⵜⵓ ⵏ ⵓⵎⵓⵜⵉ: `{ $value }`

## Variants

variant-index-must-be-number = ⴰⵎⴹⴰⵏ ⵏ ⵜⴻⵍⵖⴰ { $index } ⵉⵍⴰⵇ ⴰⴷ ⵢⵉⵍⵉ ⴷ ⴰⵎⴹⴰⵏ

variant-index-must-be-integer = ⴰⵎⴹⴰⵏ ⵏ ⵜⴻⵍⵖⴰ { $index } ⵉⵍⴰⵇ ⴰⴷ ⵢⵉⵍⵉ ⴷ ⴰⵎⴹⴰⵏ ⵓⵎⵎⵉⴷ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ⵓⵔ ⵢⴻⵜⵜⵡⴰⵙⴻⴷⴷⵓ ⴰⵔⴰ ⵉ ⵓⵙⴽⴰⵏ ⵓⵙⴷⵉⴷ. ⵜⴻⵀⵔⵉ ⵜⴻⵜⵜⵡⴰⵔⵔⴰ ⴷ ⵜⴰⵎⵚⴰⴷⴰⵏⵜ.

side-by-side-absolute-margins = `<{ $component }>` ⵓⵔ ⵢⴻⵜⵜⵡⴰⵙⴻⴷⴷⵓ ⴰⵔⴰ ⵉ ⵓⵙⴽⴰⵏ ⵓⵙⴷⵉⴷ. ⵜⵉⵡⴻⵏⵏⴰⴹⵉⵏ ⵜⵜⵡⴰⵔⵔⴰⵏⵜ ⴷ ⵜⵉⵎⵚⴰⴷⴰⵏⵉⵏ.

side-by-side-no-block-child = `<{ $component }>` ⴰⵔⴰⵎⴻⵖⵜⵓ: ⵉⵍⴰⵇ ⴰⴷ ⵢⴻⵙⵄⵓ ⵎⴰ ⴷⵔⵓⵙ ⵢⵉⵡⴻⵏ ⵏ ⵡⴰⵔⵔⴰⵡ ⵏ ⵓⴱⵍⵓⵔ.

## `<label>`

label-for-ignored-on-graphical = ⴰⵎⴻⵙⵍⴰⵢ `for` ⴷⴻⴳ `<label>` ⵏ ⵜⵓⴳⵏⴰ ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ.

label-for-must-resolve-to-one = ⴰⵎⴻⵙⵍⴰⵢ `for` ⴷⴻⴳ `<label>` ⵉⵍⴰⵇ ⴰⴷ ⵢⴻⵎⵎⴻⵍ ⵢⵉⵡⴻⵏ ⵏ ⵓⴼⴻⵔⴷⵉⵙ ⴽⴰⵏ.

label-for-unresolved = ⴰⵎⴻⵙⵍⴰⵢ `for` ⴷⴻⴳ `<label>` ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⵎⵎⴻⵍ ⴰⴼⴻⵔⴷⵉⵙ.

label-for-answer-with-authored-inputs = ⴰⵎⴻⵙⵍⴰⵢ `for` ⴷⴻⴳ `<label>` ⵢⴻⵜⵜⵎⵓⵇⵓⵍ ⵖⴻⵔ `<answer>` ⵉ ⵢⴻⵙⵄⴰⵏ ⵉⵏⴻⴽⵛⴰⵎ ⵉ ⵢⵓⵔⴰ ⵓⵎⴻⵙⴽⴰⵔ; ⵎⵎⴻⵍ ⴰⵏⴻⴽⵛⵓⵎ ⵙ ⵜⵉⵎⵎⴰⴷ-ⵉⵙ.

label-for-answer-without-input = ⴰⵎⴻⵙⵍⴰⵢ `for` ⴷⴻⴳ `<label>` ⵢⴻⵜⵜⵎⵓⵇⵓⵍ ⵖⴻⵔ `<answer>` ⵡⴰⵔ ⴰⵏⴻⴽⵛⵓⵎ ⴰⵔⴰ ⵢⴻⵜⵜⵡⴰⴱⴻⴷⵔⴻⵏ.

label-for-must-reference-input-or-answer = ⴰⵎⴻⵙⵍⴰⵢ `for` ⴷⴻⴳ `<label>` ⵉⵍⴰⵇ ⴰⴷ ⵢⴻⵎⵎⴻⵍ ⴰⵏⴻⴽⵛⵓⵎ ⵏⴻⵖ ⵜⵉⵔⵉⵔⵉⵜ.

## Accessibility

accessibility-short-description-or-decorative = ⵉ ⵡⴰⵏⴻⴽⵛⵓⵎ, `<{ $component }>` ⵉⵍⴰⵇ ⴰⴷ ⵢⴻⵙⵄⵓ ⴰⴳⵍⴰⵎ ⴰⵡⴻⵣⵍⴰⵏ ⵏⴻⵖ ⴰⴷ ⵢⴻⵜⵜⵡⴰⴼⵔⴻⵏ ⴷ decorative.

accessibility-video-short-description = ⵉ ⵡⴰⵏⴻⴽⵛⵓⵎ, `<video>` ⵉⵍⴰⵇ ⴰⴷ ⵢⴻⵙⵄⵓ ⴰⴳⵍⴰⵎ ⴰⵡⴻⵣⵍⴰⵏ.

accessibility-input-short-description-or-label = ⵉ ⵡⴰⵏⴻⴽⵛⵓⵎ, `<{ $component }>` ⵉⵍⴰⵇ ⴰⴷ ⵢⴻⵙⵄⵓ ⴰⴳⵍⴰⵎ ⴰⵡⴻⵣⵍⴰⵏ ⵏⴻⵖ ⵜⴰⴱⵣⵉⵎⵜ.

accessibility-answer-input-short-description-or-label = ⵉ ⵡⴰⵏⴻⴽⵛⵓⵎ, `<answer>` ⵉ ⴷ-ⵢⴻⵙⵏⵓⵍⴼⵓⵢⴻⵏ ⴰⵏⴻⴽⵛⵓⵎ ⵉⵍⴰⵇ ⴰⴷ ⵢⴻⵙⵄⵓ ⴰⴳⵍⴰⵎ ⴰⵡⴻⵣⵍⴰⵏ ⵏⴻⵖ ⵜⴰⴱⵣⵉⵎⵜ.

accessibility-short-description-contains-math = ⵉⴳⵍⴰⵎⴻⵏ ⵉⵡⴻⵣⵍⴰⵏⴻⵏ ⵓⵔ ⵉⵍⴰⵇ ⴰⵔⴰ ⴰⴷ ⵙⵄⵓⵏ ⵉⴼⴻⵔⴷⵉⵙⴻⵏ ⵓⵙⵏⴰⵏⴻⵏ ⴰⵎ `<{ $component }>`. ⴰⵔⵓ ⵜⵓⵙⵏⴰⴽⵜ ⵙ ⵡⴰⵡⴰⵍⴻⵏ.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ⵓⵍⴰⵛ ⵖⵓⵔ-ⵙ ⴰⵎⴳⵉⵔⵔⴻⴷ ⵉⵏⴻⴹⵎⴻⵏ ⵉ ⵓⴹⵔⵉⵙ ⵏ ⵓⵣⵡⴻⵍ ⵏ ⵜⴻⴳⵣⵎⵉ (ⴰⵙⴽⴰⵔ ⴰⴱⴻⵔⴽⴰⵏ) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ⵉⵍⴰⵇ { $threshold }:1 ⵎⴰ ⴷⵔⵓⵙ).
       *[other] { $colorName } ⵓⵍⴰⵛ ⵖⵓⵔ-ⵙ ⴰⵎⴳⵉⵔⵔⴻⴷ ⵉⵏⴻⴹⵎⴻⵏ ⵉ ⵓⴹⵔⵉⵙ ⵏ ⵓⵣⵡⴻⵍ ⵏ ⵜⴻⴳⵣⵎⵉ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ⵉⵍⴰⵇ { $threshold }:1 ⵎⴰ ⴷⵔⵓⵙ).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` ⵉ ⵢⴻⵜⵜⵄⴻⴷⴷⵉⵏ ⵅⴼ { $count } ⵏ ⵜⴻⵏⵇⵉⴹⵉⵏ ⵓⵔ ⵢⴻⵜⵜⵡⴰⵅⴷⴻⵎ ⴰⵔⴰ ⵎⴽ ⵜⵉⵏⵇⵉⴹⵉⵏ ⵓⵔ ⵙⵄⵉⵏⵜ ⴰⵔⴰ ⴰⵣⴰⵍⴻⵏ ⵓⵎⴹⵉⵏⴻⵏ.

circle-too-many-through-points = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⵙⵉⴹⴻⵏ ⵜⴰⵡⵉⵏⴻⵙⵜ ⵉ ⵢⴻⵜⵜⵄⴻⴷⴷⵉⵏ ⵅⴼ ⵓⴳⴰⵔ ⵏ ⵜⵍⴰⵜⴰ ⵏ ⵜⴻⵏⵇⵉⴹⵉⵏ.

circle-overprescribed-radius-center-points = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⵙⵉⴹⴻⵏ ⵜⴰⵡⵉⵏⴻⵙⵜ ⵙ ⵓⵣⴰⴳⵓⵔ, ⵜⴰⵍⴻⵎⵎⴰⵙⵜ ⴷ ⵜⴻⵏⵇⵉⴹⵉⵏ.

circle-center-with-multiple-points = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⵙⵉⴹⴻⵏ ⵜⴰⵡⵉⵏⴻⵙⵜ ⵙ ⵜⵍⴻⵎⵎⴰⵙⵜ ⵉ ⵢⴻⵜⵜⵄⴻⴷⴷⵉⵏ ⵅⴼ ⵓⴳⴰⵔ ⵏ ⵢⵉⵡⴻⵜ ⵏ ⵜⴻⵏⵇⵉⴹⵜ.

circle-radius-too-small = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⵙⵉⴹⴻⵏ ⵜⴰⵡⵉⵏⴻⵙⵜ: ⴰⵛⴽⵓ ⵜⴰⵍⵍⵓⵏⵜ ⴳⴰⵔ ⵙⵏⴰⵜ ⵏ ⵜⴻⵏⵇⵉⴹⵉⵏ ⴷ { $distance }, ⴰⵣⴰⴳⵓⵔ { $radius } ⴷ ⴰⵎⴻⵛⵟⵓⵃ ⴰⵟⴰⵙ.

circle-radius-with-many-points = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⵙⵏⵓⵍⴼⵓ ⵜⴰⵡⵉⵏⴻⵙⵜ ⵉ ⵢⴻⵜⵜⵄⴻⴷⴷⵉⵏ ⵅⴼ ⵓⴳⴰⵔ ⵏ ⵙⵏⴰⵜ ⵏ ⵜⴻⵏⵇⵉⴹⵉⵏ ⵙ ⵓⵣⴰⴳⵓⵔ.

circle-invalid-center-or-through-points = ⵜⴰⵍⴻⵎⵎⴰⵙⵜ ⵏⴻⵖ ⵜⵉⵏⵇⵉⴹⵉⵏ ⵏ ⵜⵡⵉⵏⴻⵙⵜ ⴷ ⵜⵉⵔⴰⵎⴻⵖⵜⵓⵢⵉⵏ.

circle-radius-center-with-multiple-points = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⵙⵉⴹⴻⵏ ⴰⵣⴰⴳⵓⵔ ⵏ ⵜⵡⵉⵏⴻⵙⵜ ⵙ ⵜⵍⴻⵎⵎⴰⵙⵜ ⵉ ⵢⴻⵜⵜⵄⴻⴷⴷⵉⵏ ⵅⴼ ⵓⴳⴰⵔ ⵏ ⵢⵉⵡⴻⵜ ⵏ ⵜⴻⵏⵇⵉⴹⵜ.

circle-change-radius-non-numerical = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵉⴱⴻⴷⴷⴻⵍ ⴰⵣⴰⴳⵓⵔ ⵏ ⵜⵡⵉⵏⴻⵙⵜ ⵉ ⵢⴻⵜⵜⵄⴻⴷⴷⵉⵏ ⵅⴼ ⵜⴻⵏⵇⵉⴹⵉⵏ ⵡⴰⵔ ⵉⵎⴹⴰⵏⴻⵏ

circle-radius-with-points-non-numerical = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⵙⵏⵓⵍⴼⵓ ⵜⴰⵡⵉⵏⴻⵙⵜ ⵉ ⵢⴻⵜⵜⵄⴻⴷⴷⵉⵏ ⵅⴼ ⵓⴳⴰⵔ ⵏ ⵢⵉⵡⴻⵜ ⵏ ⵜⴻⵏⵇⵉⴹⵜ ⵙ ⵓⵣⴰⴳⵓⵔ ⵎⴽ ⵓⵍⴰⵛ ⴰⵣⴰⵍⴻⵏ ⵓⵎⴹⵉⵏⴻⵏ.

circle-change-center-non-numerical = ⴰⴱⴻⴷⴷⴻⵍ ⵏ ⵜⵍⴻⵎⵎⴰⵙⵜ ⵏ ⵜⵡⵉⵏⴻⵙⵜ ⵉ ⵢⴻⵜⵜⵄⴻⴷⴷⵉⵏ ⵅⴼ ⵜⴻⵏⵇⵉⴹⵉⵏ ⵡⴰⵔ ⴰⵣⴰⵍⴻⵏ ⵓⵎⴹⵉⵏⴻⵏ ⵓⵔ ⵢⴻⵜⵜⵡⴰⵅⴷⴻⵎ ⴰⵔⴰ.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] ⵜⵉⵙⴻⴽⴽⵉⵔⵉⵏ ⴷⵔⵓⵙⵉⵜ ⵉ ⵜⴰⵖⵓⵍⵜ ⵏ ⵜⵡⵓⵔⵉ. ⵜⴰⵖⵓⵍⵜ ⵜⴻⵙⵄⴰ { $intervals } ⵏ ⵡⴰⴽⵓⴷ ⵎⴰⵛⴰ ⵜⴰⵡⵓⵔⵉ ⵜⴻⵙⵄⴰ { $inputs ->
            [one] { $inputs } ⵏ ⵓⵏⴻⴽⵛⵓⵎ
           *[other] { $inputs } ⵏ ⵢⵉⵏⴻⴽⵛⴰⵎ
        }.
       *[other] ⵜⵉⵙⴻⴽⴽⵉⵔⵉⵏ ⴷⵔⵓⵙⵉⵜ ⵉ ⵜⴰⵖⵓⵍⵜ ⵏ ⵜⵡⵓⵔⵉ. ⵜⴰⵖⵓⵍⵜ ⵜⴻⵙⵄⴰ { $intervals } ⵏ ⵡⴰⴽⵓⴷⴻⵏ ⵎⴰⵛⴰ ⵜⴰⵡⵓⵔⵉ ⵜⴻⵙⵄⴰ { $inputs ->
            [one] { $inputs } ⵏ ⵓⵏⴻⴽⵛⵓⵎ
           *[other] { $inputs } ⵏ ⵢⵉⵏⴻⴽⵛⴰⵎ
        }.
    }

function-domain-invalid-format = ⴰⵎⴰⵙⴰⵍ ⴰⵔⴰⵎⴻⵖⵜⵓ ⵏ ⵜⴰⵖⵓⵍⵜ ⵏ ⵜⵡⵓⵔⵉ.

function-ignoring-non-numerical =
    { $type ->
        [maximum] ⴰⵣⴰⵍ ⴰⴼⴻⵍⵍⴰⵢ ⵓⵔ ⵏⴻⵍⵍⵉ ⴷ ⴰⵎⴹⵉⵏ ⵏ ⵜⵡⵓⵔⵉ ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ.
        [minimum] ⴰⵣⴰⵍ ⴰⴷⴷⴰⵢ ⵓⵔ ⵏⴻⵍⵍⵉ ⴷ ⴰⵎⴹⵉⵏ ⵏ ⵜⵡⵓⵔⵉ ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ.
        [extremum] ⴰⵣⴰⵍ ⴰⵏⴻⴳⴳⴰⵔⵓ ⵓⵔ ⵏⴻⵍⵍⵉ ⴷ ⴰⵎⴹⵉⵏ ⵏ ⵜⵡⵓⵔⵉ ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ.
        [point] ⵜⴰⵏⵇⵉⴹⵜ ⵓⵔ ⵏⴻⵍⵍⵉ ⴷ ⵜⴰⵎⴹⵉⵏⵜ ⵏ ⵜⵡⵓⵔⵉ ⵜⴻⵜⵜⵡⴰⵣⴳⴻⵍ.
        [slope] ⴰⵙⵓⴷⴷⴻⵎ ⵓⵔ ⵏⴻⵍⵍⵉ ⴷ ⴰⵎⴹⵉⵏ ⵏ ⵜⵡⵓⵔⵉ ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ.
       *[other] { $type } ⵓⵔ ⵏⴻⵍⵍⵉ ⴷ ⴰⵎⴹⵉⵏ ⵏ ⵜⵡⵓⵔⵉ ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] ⴰⵣⴰⵍ ⴰⴼⴻⵍⵍⴰⵢ ⵉⵍⴻⵎ ⵏ ⵜⵡⵓⵔⵉ ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ.
        [minimum] ⴰⵣⴰⵍ ⴰⴷⴷⴰⵢ ⵉⵍⴻⵎ ⵏ ⵜⵡⵓⵔⵉ ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ.
        [extremum] ⴰⵣⴰⵍ ⴰⵏⴻⴳⴳⴰⵔⵓ ⵉⵍⴻⵎ ⵏ ⵜⵡⵓⵔⵉ ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ.
        [point] ⵜⴰⵏⵇⵉⴹⵜ ⵜⵉⵍⴻⵎⵜ ⵏ ⵜⵡⵓⵔⵉ ⵜⴻⵜⵜⵡⴰⵣⴳⴻⵍ.
       *[other] { $type } ⵉⵍⴻⵎ ⵏ ⵜⵡⵓⵔⵉ ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ.
    }

function-points-too-close = ⵜⴰⵡⵓⵔⵉ ⵜⴻⵙⵄⴰ ⵙⵏⴰⵜ ⵏ ⵜⴻⵏⵇⵉⴹⵉⵏ ⵇⴻⵔⴱⴻⵏⵜ ⴰⵟⴰⵙ. ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⴷ-ⵢⴻⵙⴱⴰⴷⵓ ⵜⴰⵡⵓⵔⵉ.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] ⴰⵍⵍⵓⵙ ⵏ ⵜⵡⵓⵔⵉ ⵢⴻⵣⵎⴻⵔ ⴽⴰⵏ ⵎⴰ ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵏⴻⴽⵛⴰⵎ ⵢⴻⵎⵚⴰⴷⴰ ⴷ ⵓⵎⴹⴰⵏ ⵏ ⵜⵓⴼⴼⵖⵉⵡⵉⵏ. ⵜⴰⵡⵓⵔⵉ-ⴰ ⵜⴻⵙⵄⴰ { $inputs } ⵏ ⵓⵏⴻⴽⵛⵓⵎ ⴷ { $outputs ->
            [one] { $outputs } ⵏ ⵜⵓⴼⴼⵖⴰ
           *[other] { $outputs } ⵏ ⵜⵓⴼⴼⵖⵉⵡⵉⵏ
        }.
       *[other] ⴰⵍⵍⵓⵙ ⵏ ⵜⵡⵓⵔⵉ ⵢⴻⵣⵎⴻⵔ ⴽⴰⵏ ⵎⴰ ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵏⴻⴽⵛⴰⵎ ⵢⴻⵎⵚⴰⴷⴰ ⴷ ⵓⵎⴹⴰⵏ ⵏ ⵜⵓⴼⴼⵖⵉⵡⵉⵏ. ⵜⴰⵡⵓⵔⵉ-ⴰ ⵜⴻⵙⵄⴰ { $inputs } ⵏ ⵢⵉⵏⴻⴽⵛⴰⵎ ⴷ { $outputs ->
            [one] { $outputs } ⵏ ⵜⵓⴼⴼⵖⴰ
           *[other] { $outputs } ⵏ ⵜⵓⴼⴼⵖⵉⵡⵉⵏ
        }.
    }

## `<sequence>`

sequence-invalid-length = ⵜⴻⵖⵣⵉ ⵜⴰⵔⴰⵎⴻⵖⵜⵓⵜ ⵏ ⵓⵙⴻⴷⴷⵉ.  ⵉⵍⴰⵇ ⴰⴷ ⵜⵉⵍⵉ ⴷ ⴰⵎⴹⴰⵏ ⵓⵎⵎⵉⴷ ⵓⵔ ⵏⴻⵍⵍⵉ ⴷⴷⴰⵡ ⵏ ⵡⴰⵎⴷⵓⵏ.

sequence-invalid-step = ⴰⵙⵓⵔⵉⴼ ⴰⵔⴰⵎⴻⵖⵜⵓ ⵏ ⵓⵙⴻⴷⴷⵉ.  ⵉⵍⴰⵇ ⴰⴷ ⵢⵉⵍⵉ ⴷ ⴰⵎⴹⴰⵏ ⵉ ⵓⵙⴻⴷⴷⵉ ⵏ ⵓⵏⴰⵡ { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ⵜⴰⵔⴰⵎⴻⵖⵜⵓⵜ ⵏ ⵓⵙⴻⴷⴷⵉ ⵏ ⵢⵉⵎⴹⴰⵏⴻⵏ.  ⵉⵍⴰⵇ ⴰⴷ ⵜⵉⵍⵉ ⴷ ⴰⵎⴹⴰⵏ.

sequence-invalid-endpoint-letters = "{ $attribute }" ⵜⴰⵔⴰⵎⴻⵖⵜⵓⵜ ⵏ ⵓⵙⴻⴷⴷⵉ ⵏ ⵢⵉⵙⴻⴽⴽⵉⵍⴻⵏ.  ⵉⵍⴰⵇ ⴰⴷ ⵜⵉⵍⵉ ⴷ ⴰⵙⴷⵓⴽⴽⴻⵍ ⵏ ⵢⵉⵙⴻⴽⴽⵉⵍⴻⵏ.

sequence-invalid-endpoint = "{ $attribute }" ⵜⴰⵔⴰⵎⴻⵖⵜⵓⵜ ⵏ ⵓⵙⴻⴷⴷⵉ.

select-from-sequence-coprime-not-numbers = coprime ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ ⴰⵛⴽⵓ ⵓⵔ ⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⴰⵔⴰ ⵢⵉⵎⴹⴰⵏⴻⵏ

select-from-sequence-coprime-with-exclude-combinations = coprime ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ ⴰⵛⴽⵓ excludeCombinations ⵢⴻⵜⵜⵡⴰⴼⵔⴻⵏ

## Resolving a `target`

target-not-found = ⵉⵙⵡⵉ ⴰⵔⴰⵎⴻⵖⵜⵓ ⵏ `<{ $source }>`: ⵉⵙⵡⵉ ⵓⵔ ⵢⴻⵜⵜⵡⴰⴼ ⴰⵔⴰ.

target-state-variable-not-found = ⵉⵙⵡⵉ ⴰⵔⴰⵎⴻⵖⵜⵓ ⵏ `<{ $source }>`: ⵓⵔ ⵢⴻⵜⵜⵡⴰⴼ ⴰⵔⴰ ⵓⵎⵓⵜⵉ ⵏ ⵡⴰⴷⴷⴰⴷ ⵉ ⵢⴻⵜⵜⵓⵙⴻⵎⵎⴰⵏ "{ $property }" ⴷⴻⴳ `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = ⵉⵎⵓⵜⵉⵢⴻⵏ ⵏ `<odeSystem>` ⵉⵍⴰⵇ ⴰⴷ ⵎⴳⴰⵔⵔⴰⴷⴻⵏ ⴷ ⵓⵎⵓⵜⵉ ⵉⵍⴻⵍⵍⵉ.

ode-system-duplicate-variable-names = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⴷ-ⵢⴻⵙⴱⴰⴷⵓ ⵜⵉⵡⵓⵔⵉⵡⵉⵏ ODE RHS ⵙ ⵢⵉⵙⵎⴰⵡⴻⵏ ⵏ ⵢⵉⵎⵓⵜⵉⵢⴻⵏ ⵢⴻⵜⵜⵡⴰⵍⵙⴻⵏ.

ode-system-rhs-function-error = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⴷ-ⵢⴻⵙⴱⴰⴷⵓ ⵜⴰⵡⵓⵔⵉ ODE RHS.  ⵜⵓⵛⵛⴹⴰ ⴷⴻⴳ ⵓⵙⵏⵓⵍⴼⵓ ⵏ ⵜⵡⵓⵔⵉ mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⴷ-ⵢⴻⵙⴱⴰⴷⵓ ⵜⵉⵖⵎⴻⵔⵜ ⴳⴰⵔ { $count } ⵏ ⵢⵉⵣⵉⵔⵉⴳⴻⵏ

angle-invalid-through-point = ⵜⴰⵏⵇⵉⴹⵜ ⵜⴰⵔⴰⵎⴻⵖⵜⵓⵜ ⴷⴻⴳ through ⵏ `<angle>`

parabola-vertex-too-many-points = ⵜⴰⴱⴰⵔⴰⴱⵓⵍⵜ ⵙ ⵓⵇⴻⵔⵔⵓ ⵉ ⵢⴻⵜⵜⵄⴻⴷⴷⵉⵏ ⵅⴼ ⵓⴳⴰⵔ ⵏ ⵢⵉⵡⴻⵜ ⵏ ⵜⴻⵏⵇⵉⴹⵜ ⵓⵔ ⵜⴻⵜⵜⵡⴰⵅⴷⴻⵎ ⴰⵔⴰ.

parabola-too-many-points = ⵜⴰⴱⴰⵔⴰⴱⵓⵍⵜ ⵉ ⵢⴻⵜⵜⵄⴻⴷⴷⵉⵏ ⵅⴼ ⵓⴳⴰⵔ ⵏ ⵜⵍⴰⵜⴰ ⵏ ⵜⴻⵏⵇⵉⴹⵉⵏ ⵓⵔ ⵜⴻⵜⵜⵡⴰⵅⴷⴻⵎ ⴰⵔⴰ.

intersection-too-many-items = ⴰⵎⴳⴰⴷⴰⵍ ⵏ ⵓⴳⴰⵔ ⵏ ⵙⵏⴰⵜ ⵏ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ ⵓⵔ ⵢⴻⵜⵜⵡⴰⵅⴷⴻⵎ ⴰⵔⴰ

## Other math components

ionic-compound-not-two-ions = ⴰⵙⴷⵓⴽⴽⴻⵍ ⴰⵢⵓⵏⴰⵏ ⵓⵔ ⵏⴻⵍⵍⵉ ⵏ ⵙⵉⵏ ⵏ ⵢⵉⵢⵓⵏⴻⵏ ⵓⵔ ⵢⴻⵜⵜⵡⴰⵅⴷⴻⵎ ⴰⵔⴰ.

ionic-compound-needs-cation-and-anion = ⴰⵙⴷⵓⴽⴽⴻⵍ ⴰⵢⵓⵏⴰⵏ ⵢⴻⵜⵜⵡⴰⵅⴷⴻⵎ ⴽⴰⵏ ⵉ ⵢⵉⵡⴻⵏ ⵏ ⵓⴽⴰⵜⵢⵓⵏ ⴷ ⵢⵉⵡⴻⵏ ⵏ ⵓⵏⵢⵓⵏ.

solve-equations-cannot-evaluate = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⴼⵔⵓ ⵜⴰⴳⴷⴰ ⴰⵛⴽⵓ ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵜⵜ-ⵢⴻⵙⴽⵢⴻⴷ: { $equation }

math-operators-operand-number-required = ⵉⵍⴰⵇ ⴰⴷ ⵜⴼⴻⵔⵏⴻⴷ operandNumber ⵎⴽ ⵜⴻⴽⴽⵙⴻⴷ operand ⵜⵓⵙⵏⴰⴽⵜ.

eigen-decomposition-failed = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⵙⵉⴹⴻⵏ ⴰⵣⴰⵍⴻⵏ eigen ⵏ ⵜⴻⴳⵔⵓⵔⵜ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: ⴰⵖⴻⵡⵡⴰⵔ { $parameters } ⵓⵍⴰⵛ-ⵉⵜ ⴷⴻⴳ ⵓⵎⴰⵙⴰⵍ, ⵉⵀⵉ ⴰⴷ ⵢⴻⵎⵚⴰⴷⴰ ⵢⴰⵍ ⵜⵉⴽⴽⴻⵍⵜ ⴷ ⵡⴰⴷⴻⴳ ⵉⵍⴻⵎ.
       *[other] `<matchesPattern>`: ⵉⵖⴻⵡⵡⴰⵔⴻⵏ { $parameters } ⵓⵍⴰⵛ-ⵉⵜⴻⵏ ⴷⴻⴳ ⵓⵎⴰⵙⴰⵍ, ⵉⵀⵉ ⴰⴷ ⵎⵚⴰⴷⴰⵏ ⵢⴰⵍ ⵜⵉⴽⴽⴻⵍⵜ ⴷ ⵡⴰⴷⴻⴳ ⵉⵍⴻⵎ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⴳⵣⵓ grid="{ $grid }". ⵉⵍⴰⵇ ⴰⴷ ⵢⵉⵍⵉ ⴷ none, medium, dense, ⵏⴻⵖ ⵙⵉⵏ ⵏ ⵢⵉⵎⴹⴰⵏⴻⵏ ⵓⴼⵔⵉⵏⴻⵏ ⵢⴻⵜⵜⵡⴰⴱⴹⴰⵏ ⵙ ⵜⴰⵍⵍⵓⵏⵜ, ⴰⵎ grid="1 0.5". ⵓⵍⴰⵛ ⵜⴰⵔⴰⴽⵏⴰ.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ⵓⵔ ⵢⴻⵜⵜⵓⵙⴻⴼⵔⴰⴽ ⴰⵔⴰ ⴷⴻⴳ ⵓⵎⵙⴽⴻⵏ prefigure; ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴻⵛ ⵓⵙⴽⴰⵔ right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ⵓⵔ ⵢⴻⵜⵜⵓⵙⴻⴼⵔⴰⴽ ⴰⵔⴰ ⴷⴻⴳ ⵓⵎⵙⴽⴻⵏ prefigure; ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴻⵛ ⵓⵙⴽⴰⵔ top.

prefigure-invalid-axis-bounds = `<graph>`: ⵜⵉⵍⵉⵙⴰ ⵏ ⵜⴻⴳⵔⴰⵔⵉⵏ ⴷ ⵜⵉⵔⴰⵎⴻⵖⵜⵓⵢⵉⵏ ⵉ ⵓⵙⵏⵉⴼⴻⵍ prefigure; ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴻⵛ bbox ⴰⵎⴻⵣⵡⴻⵔ (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ⵜⴻⵀⵔⵉ ⵜⴰⵔⴰⵎⴻⵖⵜⵓⵜ ⵉ ⵓⵙⵏⵉⴼⴻⵍ prefigure; ⵜⴻⵜⵜⵡⴰⵙⴻⵇⴷⴻⵛ ⵜⴻⵀⵔⵉ ⵜⴰⵎⴻⵣⵡⴻⵔⵜ 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ⴰⵔⴰⵎⴻⵖⵜⵓ ⵉ ⵓⵙⵏⵉⴼⴻⵍ prefigure; ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴻⵛ ⵓⵙⴽⴰⵏ ⴰⵎⴻⵣⵡⴻⵔ 1.

prefigure-grid-spacing-too-fine = `<graph>`: ⵜⴰⵍⵍⵓⵏⵜ ⵏ ⵜⵔⴰⴽⵏⴰ ⴷ ⵜⴰⵎⴻⵛⵟⵓⵃⵜ ⴰⵟⴰⵙ ⵉ ⵜⵍⵉⵙⴰ ⵏ ⵜⴻⴳⵔⴰⵔⵉⵏ; ⵜⴰⵔⴰⴽⵏⴰ ⵜⴻⵜⵜⵡⴰⵊⵊⴰ ⴷⴻⴳ ⵓⵎⵙⴽⴻⵏ prefigure.

prefigure-annotations-not-rendered = `<graph>`: ⵜⵉⵣⵎⵉⵍⵉⵏ ⵓⵔ ⵜⵜⵡⴰⵙⴽⴰⵏⴻⵏⵜ ⴰⵔⴰ ⵎⴽ ⵓⵔ ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴻⵛ ⴰⵔⴰ ⵓⵎⵙⴽⴻⵏ PreFigure.

multiple-annotations-children = ⵜⵜⵡⴰⴼⴻⵏ ⵡⴰⵟⴰⵙ ⵏ ⵡⴰⵔⵔⴰⵡ `<annotations>` ⴷⴻⴳ `<graph>`; ⴰⴽⴽ ⵙⵍⵉⴷ ⴰⵏⴻⴳⴳⴰⵔⵓ ⵜⵜⵡⴰⵣⴳⵍⴻⵏ.

## Referring to other components

copy-unrecognized-component-type = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⵙⵉⵖⵣⴻⴼ ⵏⴻⵖ ⴰⴷ ⵢⴻⵏⵖⴻⵍ ⴰⵏⴰⵡ ⵏ ⵓⴼⴻⵔⴷⵉⵙ ⵓⵔ ⵏⴻⵜⵜⵡⴰⵙⵙⴻⵏ ⴰⵔⴰ: { $type }.

copy-prop-not-found = ⵓⵔ ⵢⴻⵜⵜⵡⴰⴼ ⴰⵔⴰ ⵓⵎⴻⵙⵍⴰⵢ { $property } ⴷⴻⴳ ⵓⴼⴻⵔⴷⵉⵙ ⵏ ⵓⵏⴰⵡ { $component }

collect-no-source = ⵓⵔ ⵢⴻⵜⵜⵡⴰⴼ ⴰⵔⴰ ⵓⵖⴱⴰⵍⵓ ⵉ collect.

collect-invalid-component-type = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⵙⴷⵓⴽⴽⴻⵍ ⵉⴼⴻⵔⴷⵉⵙⴻⵏ ⵏ ⵓⵏⴰⵡ `<{ $component }>` ⴰⵛⴽⵓ ⴷ ⴰⵏⴰⵡ ⵏ ⵓⴼⴻⵔⴷⵉⵙ ⴰⵔⴰⵎⴻⵖⵜⵓ.

reference-index-unavailable = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⵎⵎⴻⵍ ⴰⵎⴹⴰⵏ `{ $reference }`

## `<callAction>`

component-action-unavailable = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⴷ-ⵢⴻⵙⵙⵉⵡⴻⵍ { $action } ⴷⴻⴳ ⵓⴼⴻⵔⴷⵉⵙ `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ⵉⵙⴻⴼⴽⴰ ⵙⵄⴰⵏ ⴰⵎⴰⵙⴰⵍ ⴰⵔⴰⵎⴻⵖⵜⵓ.  ⵉⵣⵉⵔⵉⴳⴻⵏ ⵙⵄⴰⵏ ⵜⴻⵖⵣⵉ ⵓⵔ ⵏⴻⵎⵚⴰⴷⴰ ⴰⵔⴰ. ⵢⴻⵜⵜⵡⴰⴼ ⴷⴻⴳ componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = ⵉⵙⴻⴼⴽⴰ ⵙⵄⴰⵏ ⵉⵙⵎⴰⵡⴻⵏ ⵏ ⵜⴻⴳⵊⴷⴰ ⵢⴻⵜⵜⵡⴰⵍⵙⴻⵏ.  ⵢⴻⵜⵜⵡⴰⴼ ⴷⴻⴳ componentIdx :{ $componentIdx }

data-frame-missing-column-name = ⵉⵙⴻⴼⴽⴰ ⵓⵍⴰⵛ ⵖⵓⵔ-ⵙⴻⵏ ⵉⵙⴻⵎ ⵏ ⵜⴳⴻⵊⴷⵉⵜ.  ⵢⴻⵜⵜⵡⴰⴼ ⴷⴻⴳ componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award ⵏ ⵜⵉⵔⵉⵔⵉⵜ-ⴰ ⵢⴻⴱⵏⴰ ⵅⴼ ⵜⵉⵔⵉⵔⵉⵜ ⵏ ⵜⴻⴱⵣⵉⵎⵜ answer ⵙ ⵜⵉⵎⵎⴰⴷ-ⵉⵙ, ⴰⵢⴻⵏ ⴰⵔⴰ ⴷ-ⵢⴰⵡⵉⵏ ⵜⵉⴽⵍⵉ ⵓⵔ ⵏⴻⵜⵜⵡⴰⴳⴰⵏ ⴰⵔⴰ.

answer-max-num-attempts-in-section-wide-check-work = ⴰⵙⴻⵔⵙ ⵏ `maxNumAttempts` ⴷⴻⴳ `<answer>` ⵢⴻⵍⵍⴰⵏ ⴷⴻⴳ ⵓⵎⴰⵜⴰⵔ ⵉ ⵢⴻⵙⵄⴰⵏ `sectionWideCheckWork` ⵓⵍⴰⵛ ⴼⴻⵍⵍ-ⴰⵙ ⴰⵣⴰⵍ, ⴰⵛⴽⵓ ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵄⵔⴰⴹⴻⵏ ⵢⴻⵜⵜⵡⴰⵙⴻⵢⵢⴻⵔ ⵙ ⵓⵎⴰⵜⴰⵔ. ⵙⴻⵔⵙ `maxNumAttempts` ⴷⴻⴳ ⵓⵎⴰⵜⴰⵔ.

nested-section-wide-check-work-max-num-attempts = ⴰⵙⴻⵔⵙ ⵏ `maxNumAttempts` ⴷⴻⴳ ⵓⵎⴰⵜⴰⵔ ⵉ ⵢⴻⵙⵄⴰⵏ `sectionWideCheckWork` ⵢⴻⵍⵍⴰⵏ ⴷⴻⴳ ⵡⴰⵢⴻⴹ ⵉ ⵢⴻⵙⵄⴰⵏ `sectionWideCheckWork` ⵓⵍⴰⵛ ⴼⴻⵍⵍ-ⴰⵙ ⴰⵣⴰⵍ, ⴰⵛⴽⵓ ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵄⵔⴰⴹⴻⵏ ⵢⴻⵜⵜⵡⴰⵙⴻⵢⵢⴻⵔ ⵙ ⵓⵎⴰⵜⴰⵔ ⵏ ⴱⴻⵕⵕⴰ. ⵙⴻⵔⵙ `maxNumAttempts` ⴷⴻⴳ ⵓⵎⴰⵜⴰⵔ ⵏ ⴱⴻⵕⵕⴰ.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] ⴰⵎⴻⵙⵍⴰⵢ { $attributes } ⵓⵔ ⵢⴻⵙⵄⵉ ⴰⵔⴰ ⴰⵣⴰⵍ ⵡⴰⵔ symbolicEquality.
       *[other] ⵉⵎⴻⵙⵍⴰⵢⴻⵏ { $attributes } ⵓⵔ ⵙⵄⵉⵏ ⴰⵔⴰ ⴰⵣⴰⵍ ⵡⴰⵔ symbolicEquality.
    }

answer-invalid-type = ⴰⵏⴰⵡ ⴰⵔⴰⵎⴻⵖⵜⵓ ⵏ ⵜⵉⵔⵉⵔⵉⵜ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = ⵉⵎⵉ ⵓⴼⴻⵔⴷⵉⵙ `<{ $component }>` ⵓⵍⴰⵛ ⵖⵓⵔ-ⵙ ⵉⵙⴻⵎ, ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴻⵛ ⴷ ⴰⵎⴻⵙⵍⴰⵢ ⵏ module

module-attribute-name-already-defined = ⴰⴼⴻⵔⴷⵉⵙ `<{ $component } name="{ $name }">` ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴻⵛ ⴷ ⴰⵎⴻⵙⵍⴰⵢ ⵏ module ⴰⵛⴽⵓ ⴰⵏⴰⵡ ⵏ ⵓⴼⴻⵔⴷⵉⵙ `<module>` ⵢⴻⵙⵄⴰ ⵢⴰⴽⴰⵏ ⴰⵎⴻⵙⵍⴰⵢ "{ $name }".

conditional-content-condition-ignored = ⴰⵎⴻⵙⵍⴰⵢ `condition` ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ ⴷⴻⴳ ⵓⴼⴻⵔⴷⵉⵙ `<conditionalContent>` ⵉ ⵢⴻⵙⵄⴰⵏ ⴰⵔⵔⴰⵡ case ⵏⴻⵖ else.

slider-markers-type-mismatch = ⴰⵏⴰⵡ ⵏ ⵢⵉⵣⴰⵎⵓⵍⴻⵏ ⵓⵔ ⵢⴻⵎⵚⴰⴷⴰ ⴰⵔⴰ ⴷ ⵓⵏⴰⵡ ⵏ slider.

pretzel-problem-needs-statement-and-answer = pretzel ⴰⵔⴰⵎⴻⵖⵜⵓ: ⵢⴰⵍ `<problem>` ⵉⵍⴰⵇ ⴰⴷ ⵢⴻⵙⵄⵓ ⵢⵉⵡⴻⵏ `<statement>` ⴷ ⵢⵉⵡⴻⵏ `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel ⴰⵔⴰⵎⴻⵖⵜⵓ: ⴷⴻⴳ mode="circuit", `<problem>` ⴰⵎⴻⵣⵡⴰⵔⵓ ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⵉⵍⵉ ⴷ ⴰⵙⴻⵅⵙⴻⵔ.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] ⴰⵣⴰⵍ ⴰⵔⴰⵎⴻⵖⵜⵓ { $values } ⵏ ⵓⵎⴻⵙⵍⴰⵢ `{ $attribute }`; ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ.
       *[other] ⴰⵣⴰⵍⴻⵏ ⵉⵔⴰⵎⴻⵖⵜⵓⵢⴻⵏ { $values } ⵏ ⵓⵎⴻⵙⵍⴰⵢ `{ $attribute }`; ⵜⵜⵡⴰⵣⴳⵍⴻⵏ.
    }

attribute-must-be-references = ⴰⵣⴰⵍ ⴰⵔⴰⵎⴻⵖⵜⵓ `{ $value }` ⵏ ⵓⵎⴻⵙⵍⴰⵢ `{ $attribute }`. ⴰⵎⴻⵙⵍⴰⵢ ⵉⵍⴰⵇ ⴰⴷ ⵢⴻⴱⵏⵓ ⵅⴼ ⵜⵎⴻⵖⵕⵉⵡⵉⵏ ⵉ ⵢⴻⴱⴷⴰⵏ ⵙ `$`.

math-input-invalid-function-names = <mathInput>: ⵉⵙⵎⴰⵡⴻⵏ ⵏ ⵜⵡⵓⵔⵉⵡⵉⵏ ⵉⵔⴰⵎⴻⵖⵜⵓⵢⴻⵏ ⵜⵜⵡⴰⵣⴳⵍⴻⵏ ⴷⴻⴳ { $attribute }: { $names }. ⴰⵃⵔⵉⵛ ⵏ ⵓⵙⴽⴰⵏ ⵏ ⵢⴰⵍ ⵉⵙⴻⵎ ⵉⵍⴰⵇ ⴰⴷ ⵢⴻⵙⵄⵓ ⵎⴰ ⴷⵔⵓⵙ ⵙⵉⵏ ⵏ ⵢⵉⵙⴻⴽⴽⵉⵍⴻⵏ; `|<mathspeak alternative>` ⵢⴻⵣⵎⴻⵔ ⴰⴷ ⵢⴻⴹⴼⴻⵔ.

## Building components from the source

component-type-invalid = ⴰⵏⴰⵡ ⴰⵔⴰⵎⴻⵖⵜⵓ ⵏ ⵓⴼⴻⵔⴷⵉⵙ: `<{ $componentType }>`

attribute-repeated = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴰⵍⴻⵙ ⴰⵎⴻⵙⵍⴰⵢ { $attribute }.

attribute-invalid-for-component = ⴰⵎⴻⵙⵍⴰⵢ ⴰⵔⴰⵎⴻⵖⵜⵓ "{ $attribute }" ⵉ ⵓⴼⴻⵔⴷⵉⵙ ⵏ ⵓⵏⴰⵡ `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    ⵜⴰⴱⴰⴷⵓⵜ ⵏ ⵓⵖⴰⵏⵉⴱ { $styleNumber } ⵓⵍⴰⵛ ⵖⵓⵔ-ⵙ ⴰⵎⴳⵉⵔⵔⴻⴷ ⵉⵏⴻⴹⵎⴻⵏ ⵏ { $context ->
        [text-on-background] ⵉⵏⵉⵜⴻⵏ ⵏ ⵓⴹⵔⵉⵙ ⵅⴼ ⵢⵉⵏⵉⵜⴻⵏ ⵏ ⵓⴳⵉⵍⴰⵍ
        [high-contrast] ⵉⵏⵉⵜⴻⵏ ⵏ ⵓⵎⴳⵉⵔⵔⴻⴷ ⴰⵎⴻⵇⵇⵔⴰⵏ ⵅⴼ ⵜⴼⴻⵍⵡⵉⵜ
        [line] ⵉⵏⵉⵜⴻⵏ ⵏ ⵢⵉⵣⵉⵔⵉⴳ ⵅⴼ ⵜⴼⴻⵍⵡⵉⵜ
        [marker] ⵉⵏⵉⵜⴻⵏ ⵏ ⵓⵣⴰⵎⵓⵍ ⵅⴼ ⵜⴼⴻⵍⵡⵉⵜ
       *[text-on-canvas] ⵉⵏⵉⵜⴻⵏ ⵏ ⵓⴹⵔⵉⵙ ⵅⴼ ⵜⴼⴻⵍⵡⵉⵜ
    }{ $mode ->
        [dark] { " (ⴰⵙⴽⴰⵔ ⴰⴱⴻⵔⴽⴰⵏ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ⵉⵍⴰⵇ { $threshold }:1 ⵎⴰ ⴷⵔⵓⵙ).

style-definition-dark-mode-text-background-contrast =
    ⵖⴰⵙ ⴰⴽⴽⴻⵏ ⵜⴰⴱⴰⴷⵓⵜ ⵏ ⵓⵖⴰⵏⵉⴱ { $styleNumber } ⵜⴻⴼⵔⴻⵏ ⵉⵏⵉⵜⴻⵏ ⵉ ⵢⴻⵙⵄⴰⵏ ⴰⵎⴳⵉⵔⵔⴻⴷ ⵉⵏⴻⴹⵎⴻⵏ ⵉ ⵓⵙⴽⴰⵔ ⴰⵎⴻⵍⵍⴰⵍ, ⵉⵏⵉⵜⴻⵏ ⵏ ⵓⵙⴽⴰⵔ ⴰⴱⴻⵔⴽⴰⵏ ⵉ ⴷ-ⵢⴻⴽⴽⴰⵏ ⵙⴻⴳ ⵡⴰⵣⴰⵍⴻⵏ-ⴰ ⵓⵍⴰⵛ ⵖⵓⵔ-ⵙⴻⵏ ⴰⵎⴳⵉⵔⵔⴻⴷ ⵉⵏⴻⴹⵎⴻⵏ ⴳⴰⵔ ⵢⵉⵏⵉⵜⴻⵏ ⵏ ⵓⴹⵔⵉⵙ ⴷ ⵢⵉⵏⵉⵜⴻⵏ ⵏ ⵓⴳⵉⵍⴰⵍ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ⵉⵍⴰⵇ { $threshold }:1 ⵎⴰ ⴷⵔⵓⵙ). { $suggestion ->
        [available] ⴰⴽⴽⴻⵏ ⴰⵎⴳⵉⵔⵔⴻⴷ ⴰⴷ ⵢⵉⵏⴻⴹⵎ ⴷⴻⴳ ⵓⵙⴽⴰⵔ ⴰⴱⴻⵔⴽⴰⵏ, ⵙⴻⵎⵖⴻⵔ ⴰⵎⴳⵉⵔⵔⴻⴷ ⵏ ⵓⵙⴽⴰⵔ ⴰⵎⴻⵍⵍⴰⵍ (ⴰⵎⴻⴷⵢⴰ, ⵙⴻⵔⵙ { $lightAttribute }="{ $lightColor }") ⵏⴻⵖ ⴱⴻⴷⴷⴻⵍ ⵉⵏⵉⵜⴻⵏ ⵏ ⵓⵙⴽⴰⵔ ⴰⴱⴻⵔⴽⴰⵏ (ⴰⵎⴻⴷⵢⴰ, ⵙⴻⵔⵙ { $darkAttribute }="{ $darkColor }").
       *[none] ⴰⴽⴽⴻⵏ ⴰⵎⴳⵉⵔⵔⴻⴷ ⴰⴷ ⵢⵉⵏⴻⴹⵎ ⴷⴻⴳ ⵓⵙⴽⴰⵔ ⴰⴱⴻⵔⴽⴰⵏ, ⵙⴻⵎⵖⴻⵔ ⴰⵎⴳⵉⵔⵔⴻⴷ ⵏ ⵓⵙⴽⴰⵔ ⴰⵎⴻⵍⵍⴰⵍ ⵏⴻⵖ ⴱⴻⴷⴷⴻⵍ ⵉⵏⵉⵜⴻⵏ ⵙ textColorDarkMode ⴷ/ⵏⴻⵖ backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    ⵖⴰⵙ ⴰⴽⴽⴻⵏ ⵜⴰⴱⴰⴷⵓⵜ ⵏ ⵓⵖⴰⵏⵉⴱ { $styleNumber } ⵜⴻⴼⵔⴻⵏ ⵉⵏⵉⵜⴻⵏ ⵏ ⵓⴹⵔⵉⵙ ⵉ ⵢⴻⵙⵄⴰⵏ ⴰⵎⴳⵉⵔⵔⴻⴷ ⵉⵏⴻⴹⵎⴻⵏ ⵉ ⵓⵙⴽⴰⵔ ⴰⵎⴻⵍⵍⴰⵍ, ⵉⵏⵉⵜⴻⵏ ⵏ ⵓⴹⵔⵉⵙ ⵏ ⵓⵙⴽⴰⵔ ⴰⴱⴻⵔⴽⴰⵏ ⵉ ⴷ-ⵢⴻⴽⴽⴰⵏ ⵙⴻⴳ ⵡⴰⵣⴰⵍ-ⴰ ⵓⵍⴰⵛ ⵖⵓⵔ-ⵙⴻⵏ ⴰⵎⴳⵉⵔⵔⴻⴷ ⵉⵏⴻⴹⵎⴻⵏ ⵅⴼ ⵜⴼⴻⵍⵡⵉⵜ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ⵉⵍⴰⵇ { $threshold }:1 ⵎⴰ ⴷⵔⵓⵙ). { $suggestion ->
        [available] ⴰⴽⴽⴻⵏ ⴰⵎⴳⵉⵔⵔⴻⴷ ⴰⴷ ⵢⵉⵏⴻⴹⵎ ⴷⴻⴳ ⵓⵙⴽⴰⵔ ⴰⴱⴻⵔⴽⴰⵏ, ⵙⴻⵎⵖⴻⵔ ⴰⵎⴳⵉⵔⵔⴻⴷ ⵏ ⵓⵙⴽⴰⵔ ⴰⵎⴻⵍⵍⴰⵍ (ⴰⵎⴻⴷⵢⴰ, ⵙⴻⵔⵙ textColor="{ $lightColor }") ⵏⴻⵖ ⴱⴻⴷⴷⴻⵍ ⵉⵏⵉⵜⴻⵏ ⵏ ⵓⵙⴽⴰⵔ ⴰⴱⴻⵔⴽⴰⵏ (ⴰⵎⴻⴷⵢⴰ, ⵙⴻⵔⵙ textColorDarkMode="{ $darkColor }").
       *[none] ⴰⴽⴽⴻⵏ ⴰⵎⴳⵉⵔⵔⴻⴷ ⴰⴷ ⵢⵉⵏⴻⴹⵎ ⴷⴻⴳ ⵓⵙⴽⴰⵔ ⴰⴱⴻⵔⴽⴰⵏ, ⵙⴻⵎⵖⴻⵔ ⴰⵎⴳⵉⵔⵔⴻⴷ ⵏ ⵓⵙⴽⴰⵔ ⴰⵎⴻⵍⵍⴰⵍ ⵏⴻⵖ ⴱⴻⴷⴷⴻⵍ ⵉⵏⵉⵜⴻⵏ ⵙ textColorDarkMode.
    }

section-multiple-style-palettes = ⵜⵉⴳⴻⵣⵎⵉ ⵜⴻⵣⵎⴻⵔ ⴰⴷ ⵜⴻⴼⵔⴻⵏ ⵢⵉⵡⴻⵏ `<stylePalette>` ⴽⴰⵏ; ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴻⵛ ⴰⵏⴻⴳⴳⴰⵔⵓ.

## Unique variants

variant-num-to-select-not-non-negative-integer = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⵉⵙⵙⵉⵏ ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⴰⵛⴽⵓ numToSelect ⵎⴰⵛⵛⵉ ⴷ ⴰⵎⴹⴰⵏ ⵓⵎⵎⵉⴷ ⵓⵔ ⵏⴻⵍⵍⵉ ⴷⴷⴰⵡ ⵏ ⵡⴰⵎⴷⵓⵏ.

variant-num-to-select-not-constant-number = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⵉⵙⵙⵉⵏ ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⴰⵛⴽⵓ numToSelect ⵎⴰⵛⵛⵉ ⴷ ⴰⵎⴹⴰⵏ ⵓⴱⴷⵉⴷ.

variant-with-replacement-not-constant-boolean = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⵉⵙⵙⵉⵏ ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⴰⵛⴽⵓ withReplacement ⵎⴰⵛⵛⵉ ⴷ boolean ⵓⴱⴷⵉⴷ.

variant-select-weight-disables-unique = ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ select ⵜⵜⵡⴰⵙⴻⵏⵙⴻⵏⵜ ⵎⴰ ⵢⴻⵍⵍⴰ ⵓⴼⵔⴰⵏ ⵉ ⵢⴻⵙⵄⴰⵏ selectWeight ⵏⴻⵖ selectForVariants

variant-coprime-undetermined = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⵉⵙⵙⵉⵏ ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⴰⵛⴽⵓ ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⵉⵙⵙⵉⵏ ⵎⴰ coprime ⴷ ⵜⴰⴽⴻⵕⴹⵉⵜ ⵢⴰⵍ ⵜⵉⴽⴽⴻⵍⵜ.

variant-attribute-not-constant = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⵉⵙⵙⵉⵏ ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⴰⵛⴽⵓ { $attribute } ⵓⵔ ⵢⴻⵇⵇⵉⵎ ⴰⵔⴰ ⴰⵎ ⴰⴽⴽⴻⵏ.

variant-attribute-not-number = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⵉⵙⵙⵉⵏ ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⴰⵛⴽⵓ { $attribute } ⵎⴰⵛⵛⵉ ⴷ ⴰⵎⴹⴰⵏ.

variant-attribute-wrong-type-for-sequence =
    ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⵉⵙⵙⵉⵏ ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⵏ ⵓⵏⴰⵡ { $type } ⴰⵛⴽⵓ { $attribute } ⵎⴰⵛⵛⵉ ⴷ { $expected ->
        [letters-combination] ⴰⵙⴷⵓⴽⴽⴻⵍ ⵏ ⵢⵉⵙⴻⴽⴽⵉⵍⴻⵏ
        [math-expression] ⵜⴰⵏⴼⴰⵍⵉⵜ ⵜⵓⵙⵏⴰⴽⵜ ⵢⴻⵜⵜⵓⵙⵉⵔⴳⴻⵏ
        [integer] ⴰⵎⴹⴰⵏ ⵓⵎⵎⵉⴷ
       *[number] ⴰⵎⴹⴰⵏ
    }.

variant-length-not-integer = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⵉⵙⵙⵉⵏ ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⴰⵛⴽⵓ length ⵎⴰⵛⵛⵉ ⴷ ⴰⵎⴹⴰⵏ ⵓⵎⵎⵉⴷ.

variant-sort-not-implemented = ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⵉ ⵢⴻⵙⵄⴰⵏ sort ⵓⵔ ⵜⵜⵡⴰⵅⴻⴷⵎⴻⵏⵜ ⴰⵔⴰ

variant-exclude-combinations-not-implemented = ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⵉ ⵢⴻⵙⵄⴰⵏ excludeCombinations ⵓⵔ ⵜⵜⵡⴰⵅⴻⴷⵎⴻⵏⵜ ⴰⵔⴰ

variant-math-exclude-not-implemented = ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⵏ ⵓⵏⴰⵡ math ⵉ ⵢⴻⵙⵄⴰⵏ exclude ⵓⵔ ⵜⵜⵡⴰⵅⴻⴷⵎⴻⵏⵜ ⴰⵔⴰ

variant-non-constant-exclude-not-implemented = ⵜⵉⵍⵖⴰ ⵜⵓⵎⵎⵉⴹⵉⵏ ⵏ { $component } ⵉ ⵢⴻⵙⵄⴰⵏ exclude ⵓⴱⴻⴷⴷⴰⵍ ⵓⵔ ⵜⵜⵡⴰⵅⴻⴷⵎⴻⵏⵜ ⴰⵔⴰ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ⵓⵔ ⵢⴻⵜⵜⵓⵙⴻⴼⵔⴰⴽ ⴰⵔⴰ ⴷⴻⴳ ⵓⵎⵙⴽⴻⵏ graph prefigure; ⴰⵎⴷⵓⵔ ⵢⴻⵜⵜⵡⴰⵊⵊⴰ.

prefigure-descendant-invalid-geometry = { $subject }: ⵜⴰⵏⵣⴻⴳⴳⵉⵜ ⵓⵔ ⵏⴼⵓⴽⴽ ⵏⴻⵖ ⵓⵔ ⵏⴻⵎⵎⵉⴷ; ⴰⵎⴷⵓⵔ ⵢⴻⵜⵜⵡⴰⵊⵊⴰ.

prefigure-curve-label-omitted = { $subject }: ⵜⵉⴱⵣⵉⵎⵉⵏ ⵓⵔ ⵜⵜⵓⵙⴻⴼⵔⴰⴽⴻⵏⵜ ⴰⵔⴰ ⴷⴻⴳ ⵢⵉⴼⴻⵔⴷⵉⵙⴻⵏ ⵏ ⵓⴽⵏⴰⵏ ⵢⴻⵜⵜⵓⵙⵏⵉⴼⴻⵍ; ⵜⴰⴱⵣⵉⵎⵜ ⵜⴻⵜⵜⵡⴰⵊⵊⴰ.

prefigure-curve-unsupported-definition-type = { $subject }: ⴰⵏⴰⵡ ⵏ ⵜⴱⴰⴷⵓⵜ ⵏ ⵜⵡⵓⵔⵉ ⵏ ⵓⴽⵏⴰⵏ '{ $definitionType }' ⵓⵔ ⵢⴻⵜⵜⵓⵙⴻⴼⵔⴰⴽ ⴰⵔⴰ; ⴰⵎⴷⵓⵔ ⵢⴻⵜⵜⵡⴰⵊⵊⴰ.

prefigure-region-flip-functions-unsupported = { $subject }: ⴰⵎⴻⵙⵍⴰⵢ flipFunctions ⴷⴻⴳ regionBetweenCurves ⵓⵔ ⵢⴻⵜⵜⵓⵙⴻⴼⵔⴰⴽ ⴰⵔⴰ; ⴰⵎⴷⵓⵔ ⵢⴻⵜⵜⵡⴰⵊⵊⴰ.

prefigure-region-non-formula-child = { $subject }: ⴷ ⵜⵉⵡⵓⵔⵉⵡⵉⵏ ⵏ ⵡⴰⵔⵔⴰⵡ ⵏ ⵓⵏⴰⵡ formula ⴽⴰⵏ ⵉ ⵢⴻⵜⵜⵓⵙⴻⴼⵔⴰⴽⴻⵏ ⴷⴻⴳ regionBetweenCurves; ⴰⵎⴷⵓⵔ ⵢⴻⵜⵜⵡⴰⵊⵊⴰ.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ⵓⵔ ⵢⴻⵜⵜⵓⵙⴻⴼⵔⴰⴽ ⴰⵔⴰ ⵉ { $labelKind ->
        [line-family] ⵜⴰⴱⵣⵉⵎⵜ ⵏ ⵜⵡⴰⵛⵓⵍⵜ ⵏ ⵢⵉⵣⵉⵔⵉⴳⴻⵏ
       *[point] ⵜⴰⴱⵣⵉⵎⵜ ⵏ ⵜⴻⵏⵇⵉⴹⵜ
    }; ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴻⵛ ⵓⵎⵚⴰⴷⵉ ⴰⵎⴻⵣⵡⴻⵔ ⵏ PreFigure.

prefigure-fill-style-unsupported = { $subject }: ⴰⵖⴰⵏⵉⴱ ⵏ ⵓⵛⵛⴰⵔ '{ $fillStyle }' ⵓⵔ ⵢⴻⵜⵜⵓⵙⴻⴼⵔⴰⴽ ⴰⵔⴰ ⵙ PreFigure; ⵢⴻⵜⵜⵡⴰⵖⴰⵍ ⵖⴻⵔ ⵓⵛⵛⴰⵔ ⴰⵇⵇⵓⵔ.

prefigure-line-style-unknown = { $subject }: ⴰⵖⴰⵏⵉⴱ ⵏ ⵢⵉⵣⵉⵔⵉⴳ ⵓⵔ ⵏⴻⵜⵜⵡⴰⵙⵙⴻⵏ '{ $lineStyle }' ⵢⴻⵜⵜⵡⴰⵊⵊⴰ ⴷⴻⴳ ⵜⵓⴼⴼⵖⴰ ⵏ PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: ⴰⵖⴰⵏⵉⴱ ⵏ ⵓⵣⴰⵎⵓⵍ '{ $markerStyle }' ⵢⴻⵜⵜⵡⴰⵙⵏⵉⴼⴻⵍ ⵖⴻⵔ ⵓⵖⴰⵏⵉⴱ PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: ⴰⵖⴰⵏⵉⴱ ⵏ ⵓⵣⴰⵎⵓⵍ '{ $markerStyle }' ⵓⵔ ⵢⴻⵜⵜⵓⵙⴻⴼⵔⴰⴽ ⴰⵔⴰ ⵙ PreFigure; ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴻⵛ ⵓⵖⴰⵏⵉⴱ ⴰⵎⴻⵣⵡⴻⵔ.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ⴰⵔⴰⵎⴻⵖⵜⵓ; ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴰⴼ ⵉⵙⵡⵉ. ⵜⴰⵣⵎⵉⵍⵜ ⵜⴻⵜⵜⵡⴰⵊⵊⴰ.

annotation-ref-multiple-targets = `<annotation>`: `ref` ⵢⴻⵎⵎⴻⵍ ⵡⴰⵟⴰⵙ ⵏ ⵢⵉⵙⵡⵉⵢⴻⵏ; ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴻⵛ ⴰⵎⴻⵣⵡⴰⵔⵓ.

annotation-ref-outside-graph = `<annotation>`: `ref` ⴰⵔⴰⵎⴻⵖⵜⵓ; ⵉⵙⵡⵉ ⵢⴻⵍⵍⴰ ⴱⴻⵕⵕⴰ ⵏ graph ⵉ ⵜ-ⵢⴻⵟⵟⴼⴻⵏ. ⵜⴰⵣⵎⵉⵍⵜ ⵜⴻⵜⵜⵡⴰⵊⵊⴰ.

annotation-ref-unsupported-target = `<annotation>`: `ref` ⴰⵔⴰⵎⴻⵖⵜⵓ; ⵉⵙⵡⵉ ⵎⴰⵛⵛⵉ ⴷ ⵜⴰⵖⴰⵡⵙⴰ ⵏ ⵜⵓⴳⵏⴰ ⵢⴻⵜⵜⵓⵙⴻⴼⵔⴰⴽⴻⵏ ⴷⴻⴳ ⵓⵙⵏⵉⴼⴻⵍ prefigure. ⵜⴰⵣⵎⵉⵍⵜ ⵜⴻⵜⵜⵡⴰⵊⵊⴰ.

annotation-text-missing = `<annotation>`: `text` ⵓⵍⴰⵛ-ⵉⵜ ⵏⴻⵖ ⴷ ⵉⵍⴻⵎ; ⵜⴻⵜⵜⵡⴰⵙⵓⴼⴼⴻⵖ-ⴷ ⴰⴹⵔⵉⵙ ⵉⵍⴻⵎ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] ⵢⴻⵜⵜⵡⴰⴼ ⵓⵙⵜⴻⵄⵎⴻⵍ ⴰⵡⵉⵏⵙⴰⵏ.
       *[other] ⵢⴻⵜⵜⵡⴰⴼ ⵓⵙⵜⴻⵄⵎⴻⵍ ⴰⵡⵉⵏⵙⴰⵏ ⵉ ⵢⴻⵙⵄⴰⵏ ⴰⴼⴻⵔⴷⵉⵙ `<{ $componentType }>`.
    }

reference-no-referent = ⵓⵍⴰⵛ ⴰⵛⴻⵎⵎⴰ ⵢⴻⵜⵜⵡⴰⴼⴻⵏ ⵉ ⵜⵎⴻⵖⵕⵉⵜ: `{ $reference }`

reference-multiple-referents = ⵜⵜⵡⴰⴼⴻⵏ ⵡⴰⵟⴰⵙ ⵏ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ ⵉ ⵜⵎⴻⵖⵕⵉⵜ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = ⴰⵎⴰⵙⴰⵍ ⴰⵔⴰⵎⴻⵖⵜⵓ ⵏ ⵓⵎⴻⵙⵍⴰⵢ { $attribute } ⵏ `<{ $componentType }>`.

children-invalid = ⴰⵔⵔⴰⵡ ⵉⵔⴰⵎⴻⵖⵜⵓⵢⴻⵏ ⵏ `<{ $componentType }>`: ⵜⵜⵡⴰⴼⴻⵏ ⵡⴰⵔⵔⴰⵡ ⵉⵔⴰⵎⴻⵖⵜⵓⵢⴻⵏ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = ⴰⵣⴰⵍ ⴰⵔⴰⵎⴻⵖⵜⵓ `{ $value }` ⵏ ⵓⵎⴻⵙⵍⴰⵢ `{ $attribute }`, ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴻⵛ ⵡⴰⵣⴰⵍ `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] ⵍⵇⴻⵎ DoenetML { $version } ⵓⵔ ⵢⴻⵜⵜⵡⴰⴼ ⴰⵔⴰ.
       *[other] ⵍⵇⴻⵎ DoenetML { $version } ⵓⵔ ⵢⴻⵜⵜⵡⴰⴼ ⴰⵔⴰ. ⵢⴻⵜⵜⵡⴰⵖⴰⵍ ⵖⴻⵔ ⵍⵇⴻⵎ { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ⴰⵔⴰⵎⴻⵖⵜⵓ: { $content }

parse-tag-missing-close-tag = DoenetML ⴰⵔⴰⵎⴻⵖⵜⵓ: ⵜⴰⴱⵣⵉⵎⵜ `{ $tag }` ⵓⵍⴰⵛ ⵖⵓⵔ-ⵙ ⵜⴰⴱⵣⵉⵎⵜ ⵏ ⵓⵎⴷⴰⵍ. ⵢⴻⵜⵜⵡⴰⵕⵊⴰ ⵓⴱⵣⵉⵎ ⵉ ⵢⴻⵜⵜⵎⴻⴷⵍⴻⵏ ⵙ ⵜⵉⵎⵎⴰⴷ-ⵉⵙ ⵏⴻⵖ ⵜⴰⴱⵣⵉⵎⵜ `</{ $tagName }>`.

parse-tag-error = DoenetML ⴰⵔⴰⵎⴻⵖⵜⵓ: ⵜⵓⵛⵛⴹⴰ ⴷⴻⴳ ⵜⴻⴱⵣⵉⵎⵜ `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ⴰⵔⴰⵎⴻⵖⵜⵓ: ⴰⵎⴻⵙⵍⴰⵢ ⴰⵔⴰⵎⴻⵖⵜⵓ `{ $attribute }` ⵢⴻⵜⵜⴱⴰⵏ ⴰⵎ ⴰⴽⴽⴻⵏ ⵓⵍⴰⵛ ⵖⵓⵔ-ⵙ ⴰⵣⴰⵍ.

parse-attribute-invalid = DoenetML ⴰⵔⴰⵎⴻⵖⵜⵓ: ⴰⵎⴻⵙⵍⴰⵢ ⴰⵔⴰⵎⴻⵖⵜⵓ `{ $attribute }`

parse-attribute-value-invalid = DoenetML ⴰⵔⴰⵎⴻⵖⵜⵓ: ⴰⵣⴰⵍ ⵏ ⵓⵎⴻⵙⵍⴰⵢ ⴰⵔⴰⵎⴻⵖⵜⵓ `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML ⴰⵔⴰⵎⴻⵖⵜⵓ: ⴰⵣⴰⵍ ⵏ ⵓⵎⴻⵙⵍⴰⵢ ⴰⵔⴰⵎⴻⵖⵜⵓ `{ $value }`. ⵜⵉⵛⵔⴰⴹ ⵏ ⵜⴻⴱⴷⴻⵔⵜ ⵓⵔ ⵎⵚⴰⴷⴰⵏⵜ ⴰⵔⴰ. ⵢⴻⵜⵜⴱⴰⵏ ⴰⵎ ⴰⴽⴽⴻⵏ ⵢⴻⵅⵚⴻⵕ `{ $quote }`

parse-open-tag-name-missing = DoenetML ⴰⵔⴰⵎⴻⵖⵜⵓ: ⵜⴻⵜⵜⵡⴰⴼ ⵜⴻⴱⵣⵉⵎⵜ ⵡⴰⵔ ⵉⵙⴻⵎ, ⴰⵎⴻⴷⵢⴰ `<`

parse-tag-not-closed = DoenetML ⴰⵔⴰⵎⴻⵖⵜⵓ: ⵜⴰⴱⵣⵉⵎⵜ `{ $tag }` ⵓⵔ ⵜⴻⵜⵜⵡⴰⵎⴷⴻⵍ ⴰⵔⴰ (ⵢⴻⵜⵜⴱⴰⵏ ⴰⵎ ⴰⴽⴽⴻⵏ ⵢⴻⵅⵚⴻⵕ `>`).

parse-self-closing-tag-name-missing = DoenetML ⴰⵔⴰⵎⴻⵖⵜⵓ: ⵜⴻⵜⵜⵡⴰⴼ ⵜⴻⴱⵣⵉⵎⵜ ⵡⴰⵔ ⵉⵙⴻⵎ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ⴰⵔⴰⵎⴻⵖⵜⵓ: ⵜⴰⴱⵣⵉⵎⵜ `{ $tag }` ⵓⵔ ⵜⴻⵜⵜⵡⴰⵎⴷⴻⵍ ⴰⵔⴰ (ⵢⴻⵜⵜⴱⴰⵏ ⴰⵎ ⴰⴽⴽⴻⵏ ⵢⴻⵅⵚⴻⵕ `/>`).

parse-tag-invalid-attributes = DoenetML ⴰⵔⴰⵎⴻⵖⵜⵓ: ⵜⴰⴱⵣⵉⵎⵜ `{ $tag }` ⵓⵔ ⵜⴻⵜⵜⵓⵙⵉⵔⴻⴳ ⴰⵔⴰ. ⵜⴻⵣⵎⴻⵔ ⴰⴷ ⵜⴻⵙⵄⵓ ⵉⵎⴻⵙⵍⴰⵢⴻⵏ ⵉⵔⴰⵎⴻⵖⵜⵓⵢⴻⵏ.

parse-close-tag-name-missing = DoenetML ⴰⵔⴰⵎⴻⵖⵜⵓ: ⵜⴻⵜⵜⵡⴰⴼ ⵜⴻⴱⵣⵉⵎⵜ ⵏ ⵓⵎⴷⴰⵍ ⵡⴰⵔ ⵉⵙⴻⵎ, ⴰⵎⴻⴷⵢⴰ `</`

parse-attribute-value-unquoted = ⴰⵣⴰⵍⴻⵏ ⵏ ⵢⵉⵎⴻⵙⵍⴰⵢⴻⵏ ⵉⵍⴰⵇ ⴰⴷ ⵉⵍⵉⵏ ⴳⴰⵔ ⵜⵉⵛⵔⴰⴹ ⵏ ⵜⴻⴱⴷⴻⵔⵜ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ⴰⵔⴰⵎⴻⵖⵜⵓ: ⵜⴻⵜⵜⵡⴰⴼ ⵜⴻⴱⵣⵉⵎⵜ ⵏ ⵓⵎⴷⴰⵍ `{ $tag }`, ⵎⴰⵛⴰ ⵓⵍⴰⵛ ⵜⴰⴱⵣⵉⵎⵜ ⵏ ⵓⵍⴷⵉ ⵉ ⵜⵜ-ⵢⴻⵎⵚⴰⴷⴰⵏ

parse-close-tag-mismatched = DoenetML ⴰⵔⴰⵎⴻⵖⵜⵓ: ⵜⴰⴱⵣⵉⵎⵜ ⵏ ⵓⵎⴷⴰⵍ ⵓⵔ ⵜⴻⵎⵚⴰⴷⴰ ⴰⵔⴰ. ⵢⴻⵜⵜⵡⴰⵕⵊⴰ `</{ $expected }>`. ⵢⴻⵜⵜⵡⴰⴼ `{ $found }`

parser-node-unconvertible = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⵙⵏⵉⴼⴻⵍ ⴰⵏⴰⴳⵔⴰⵡ { $node } ⵖⴻⵔ ⵓⵏⴰⴳⵔⴰⵡ Dast.

## Names

name-attribute-invalid =
    ⵉⵙⴻⵎ ⵏ ⵓⵎⴻⵙⵍⴰⵢ ⴷ ⴰⵔⴰⵎⴻⵖⵜⵓ name='{ $name }'. { $reason ->
        [characters] ⵉⵙⵎⴰⵡⴻⵏ ⵣⴻⵎⵔⴻⵏ ⴰⴷ ⵙⵄⵓⵏ ⴽⴰⵏ ⵉⵙⴻⴽⴽⵉⵍⴻⵏ, ⵉⵎⴹⴰⵏⴻⵏ, ⵉⵊⴻⵔⵔⵉⴷⴻⵏ ⵏ ⵡⴰⴷⴷⴰ ⵏⴻⵖ ⵉⵊⴻⵔⵔⵉⴷⴻⵏ.
       *[start] ⵉⵙⵎⴰⵡⴻⵏ ⵉⵍⴰⵇ ⴰⴷ ⴱⴷⵓⵏ ⵙ ⵓⵙⴻⴽⴽⵉⵍ.
    }

component-name-invalid-start = ⵉⵙⴻⵎ ⵏ ⵓⴼⴻⵔⴷⵉⵙ ⴷ ⴰⵔⴰⵎⴻⵖⵜⵓ "{ $name }". ⵉⵙⵎⴰⵡⴻⵏ ⵉⵍⴰⵇ ⴰⴷ ⴱⴷⵓⵏ ⵙ ⵓⵙⴻⴽⴽⵉⵍ.

## `<answer>` sugar

answer-video-watched-missing-video = ⵜⵉⵔⵉⵔⵉⵜ ⵏ ⵓⵏⴰⵡ videoWatched ⵉⵍⴰⵇ ⴰⴷ ⵜⴻⵙⵄⵓ ⴰⵎⴻⵙⵍⴰⵢ video

answer-video-watched-video-not-reference = ⵜⵉⵔⵉⵔⵉⵜ ⵏ ⵓⵏⴰⵡ videoWatched ⵉⵍⴰⵇ ⴰⴷ ⵜⴻⵙⵄⵓ ⴰⵎⴻⵙⵍⴰⵢ video ⵉ ⵢⴻⵍⵍⴰⵏ ⴷ ⵜⴰⵎⴻⵖⵕⵉⵜ

answer-name-not-single-text = ⴰⵎⴻⵙⵍⴰⵢ name ⵏ ⵜⵉⵔⵉⵔⵉⵜ ⵉⵍⴰⵇ ⴰⴷ ⵢⴻⵙⵄⵓ ⵢⵉⵡⴻⵏ ⵏ ⵡⴰⵔⵔⴰⵡ ⵏ ⵓⴹⵔⵉⵙ

## Referencing another document

external-doenetml-recursion-limit = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⴷ-ⵢⴰⵡⵉ DoenetML ⵏ ⴱⴻⵕⵕⴰ ⴰⵛⴽⵓ ⴰⵟⴰⵙ ⵏ ⵢⵉⵙⵡⵉⵔⴻⵏ ⵏ ⵡⴰⵍⵍⵓⵙ. ⵢⴻⵍⵍⴰ ⵡⵓⴳⴰⵔ ⵏ ⵜⵎⴻⵖⵕⵉⵜ ⵜⴰⵡⵉⵏⵙⴰⵏⵜ?

external-doenetml-unavailable = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⴷ-ⵢⴰⵡⵉ DoenetML ⵙⴻⴳ { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ⵉ ⴷ-ⵢⴻⵜⵜⵡⴰⵡⵉⵏ ⵙⴻⴳ { $attribute }="{ $uri }" ⴷ ⴰⵔⴰⵎⴻⵖⵜⵓ: ⵓⵔ ⵢⴻⵎⵚⴰⴷⴰ ⴰⵔⴰ ⴷ ⵓⵏⴰⵡ ⵏ ⵓⴼⴻⵔⴷⵉⵙ "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] ⴰⵎⴻⵙⵍⴰⵢ `{ $from }` ⵓⵔ ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴰⵛ ⴰⵔⴰ; ⵙⴻⵇⴷⴻⵛ `{ $to }` ⴷⴻⴳ ⵓⵎⴽⴰⵏ-ⵉⵙ.
       *[other] [deprecation] ⴰⵎⴻⵙⵍⴰⵢ `{ $from }` ⴷⴻⴳ `<{ $component }>` ⵓⵔ ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴰⵛ ⴰⵔⴰ; ⵙⴻⵇⴷⴻⵛ `{ $to }` ⴷⴻⴳ ⵓⵎⴽⴰⵏ-ⵉⵙ.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] ⴰⵎⴻⵙⵍⴰⵢ `{ $from }` ⵓⵔ ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴰⵛ ⴰⵔⴰ ⵢⴻⵔⵏⴰ ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ ⴰⵛⴽⵓ `{ $to }` ⵢⴻⵜⵜⵡⴰⴼⵔⴻⵏ ⴷⴰⵖⴻⵏ.
       *[other] [deprecation] ⴰⵎⴻⵙⵍⴰⵢ `{ $from }` ⴷⴻⴳ `<{ $component }>` ⵓⵔ ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴰⵛ ⴰⵔⴰ ⵢⴻⵔⵏⴰ ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ ⴰⵛⴽⵓ `{ $to }` ⵢⴻⵜⵜⵡⴰⴼⵔⴻⵏ ⴷⴰⵖⴻⵏ.
    }

deprecated-attribute-ignored = [deprecation] ⴰⵎⴻⵙⵍⴰⵢ `{ $attribute }` ⴷⴻⴳ `<{ $component }>` ⵓⵔ ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴰⵛ ⴰⵔⴰ ⵢⴻⵔⵏⴰ ⵢⴻⵜⵜⵡⴰⵣⴳⴻⵍ.

deprecated-attribute-to-child = [deprecation] ⴰⵎⴻⵙⵍⴰⵢ `{ $attribute }` ⴷⴻⴳ `<{ $component }>` ⵓⵔ ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴰⵛ ⴰⵔⴰ; ⵙⴻⵇⴷⴻⵛ ⴰⵔⵔⴰⵡ `<{ $child }>` ⴷⴻⴳ ⵓⵎⴽⴰⵏ-ⵉⵙ.

deprecated-attribute-value-renamed = [deprecation] ⴰⵣⴰⵍ `{ $value }` ⵏ ⵓⵎⴻⵙⵍⴰⵢ `{ $attribute }` ⴷⴻⴳ `<{ $component }>` ⵓⵔ ⵢⴻⵜⵜⵡⴰⵙⴻⵇⴷⴰⵛ ⴰⵔⴰ; ⵙⴻⵇⴷⴻⵛ `{ $to }` ⴷⴻⴳ ⵓⵎⴽⴰⵏ-ⵉⵙ.


## Language coverage

pluralize-english-only = `<pluralize>` ⵜⴻⵣⵎⴻⵔ ⴽⴰⵏ ⴰⴷ ⵜⴻⵙⵏⵓⵍⴼⵓ ⴰⵙⴳⴻⵜ ⵏ ⵜⴻⴳⵍⵉⵣⵉⵜ, ⵉⵀⵉ ⴰⴹⵔⵉⵙ-ⵉⵙ ⵢⴻⵜⵜⵡⴰⵊⵊⴰ ⴰⴽⴽⴻⵏ ⵢⴻⵍⵍⴰ ⴷⴻⴳ ⵓⵙⴻⵎⵍⵉ ⵢⵓⵔⴰⵏ ⵙ { $locale }. ⴰⵔⵓ ⵜⴰⵍⵖⴰ ⵏ ⵓⵙⴳⴻⵜ ⵙ ⵜⵉⵎⵎⴰⴷ-ⵉⵙ, ⵏⴻⵖ ⵙⴻⵔⵙ-ⵉⵜⵜ ⵙ ⵓⵎⴻⵙⵍⴰⵢ `pluralForm`.


## Checking against the schema

schema-element-unrecognized = ⴰⴼⴻⵔⴷⵉⵙ `<{ $tag }>` ⵎⴰⵛⵛⵉ ⴷ ⴰⴼⴻⵔⴷⵉⵙ Doenet ⵢⴻⵜⵜⵡⴰⵙⵙⵏⴻⵏ.

schema-element-not-allowed-at-root = ⴰⴼⴻⵔⴷⵉⵙ `<{ $tag }>` ⵓⵔ ⵢⴻⵜⵜⵓⵙⵉⵔⴻⴳ ⴰⵔⴰ ⴷⴻⴳ ⵓⵥⴰⵔ ⵏ ⵓⵙⴻⵎⵍⵉ.

schema-element-not-allowed-inside = ⴰⴼⴻⵔⴷⵉⵙ `<{ $tag }>` ⵓⵔ ⵢⴻⵜⵜⵓⵙⵉⵔⴻⴳ ⴰⵔⴰ ⴷⴻⴳ `<{ $parent }>`.

schema-attribute-unrecognized = ⴰⴼⴻⵔⴷⵉⵙ `<{ $tag }>` ⵓⵍⴰⵛ ⵖⵓⵔ-ⵙ ⴰⵎⴻⵙⵍⴰⵢ ⵉ ⵢⴻⵜⵜⵓⵙⴻⵎⵎⴰⵏ `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] ⴰⵎⴻⵙⵍⴰⵢ `{ $attribute }` ⵏ ⵓⴼⴻⵔⴷⵉⵙ `<{ $tag }>` ⵉⵍⴰⵇ ⴰⴷ ⵢⵉⵍⵉ ⴷ ⴰⵎⵓⵖ ⴰⵏⴷⴰ ⵢⴰⵍ ⵜⴰⵖⴰⵡⵙⴰ ⴷ ⵢⵉⵡⴻⵜ ⵙⴻⴳ: { $allowed }
       *[other] ⴰⵎⴻⵙⵍⴰⵢ `{ $attribute }` ⵏ ⵓⴼⴻⵔⴷⵉⵙ `<{ $tag }>` ⵉⵍⴰⵇ ⴰⴷ ⵢⵉⵍⵉ ⴷ ⵢⵉⵡⴻⵏ ⵙⴻⴳ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = ⵉⵙⴻⵎ ⵏ ⵜⴻⵍⵖⴰ ⴷ ⴰⵔⴰⵎⴻⵖⵜⵓ ⵉ select.  ⵉⵙⴻⵎ ⵏ ⵜⴻⵍⵖⴰ { $variantName } ⵢⴻⵜⵜⴱⴰⵏ ⴷⴻⴳ { $numOptions } ⵏ ⵢⵉⴼⵔⴰⵏⴻⵏ ⵎⴰⵛⴰ ⴰⵎⴹⴰⵏ ⵉ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⴷ { $numToSelect }.

select-variant-name-without-options = ⴽⵔⴰ ⵏ ⵜⴻⵍⵖⴰ ⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⵉ select ⵎⴰⵛⴰ ⵓⵍⴰⵛ ⵉⴼⵔⴰⵏⴻⵏ ⵉ ⵢⵉⵙⴻⵎ ⵏ ⵜⴻⵍⵖⴰ ⵉ ⵢⴻⵣⵎⵔⴻⵏ: { $variantName }.

select-variant-name-not-possible = ⵉⵙⴻⵎ ⵏ ⵜⴻⵍⵖⴰ { $variantName } ⵉ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⵉ select ⵎⴰⵛⵛⵉ ⴷ ⵉⵙⴻⵎ ⵏ ⵜⴻⵍⵖⴰ ⵉ ⵢⴻⵣⵎⵔⴻⵏ.

select-too-few-options = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⴼⵔⴻⵏ { $numToSelect } ⵏ ⵢⵉⴼⴻⵔⴷⵉⵙⴻⵏ ⵙⴻⴳ { $numOptions } ⴽⴰⵏ.

select-from-sequence-too-few-values = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⴼⵔⴻⵏ { $numToSelect } ⵏ ⵡⴰⵣⴰⵍⴻⵏ ⵙⴻⴳ ⵓⵙⴻⴷⴷⵉ ⵏ ⵜⴻⵖⵣⵉ { $length }.

select-from-sequence-indices-count-mismatch = ⴰⵎⴹⴰⵏ ⵏ ⵢⵉⵎⴹⴰⵏⴻⵏ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⵉ select ⵉⵍⴰⵇ ⴰⴷ ⵢⴻⵎⵚⴰⴷⴰ ⴷ ⵓⵎⴹⴰⵏ ⵉ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ

select-from-sequence-indices-not-integers = ⴰⴽⴽ ⵉⵎⴹⴰⵏⴻⵏ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⵉ select ⵉⵍⴰⵇ ⴰⴷ ⵉⵍⵉⵏ ⴷ ⵉⵎⴹⴰⵏⴻⵏ ⵉⵎⵎⵉⴷⴻⵏ

select-from-sequence-index-excluded = ⴰⵎⴹⴰⵏ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⵏ selectfromsequence ⵢⴻⵜⵜⵡⴰⴽⴽⴻⵙ

select-from-sequence-indices-excluded-combination = ⵉⵎⴹⴰⵏⴻⵏ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⵏ selectfromsequence ⵍⵍⴰⵏ ⴷ ⴰⵙⴷⵓⴽⴽⴻⵍ ⵢⴻⵜⵜⵡⴰⴽⴽⵙⴻⵏ

select-from-sequence-coprime-not-positive-integers = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⴼⵔⴻⵏ ⵉⵙⴷⵓⴽⴽⴰⵍ coprime ⴰⵛⴽⵓ ⵓⵔ ⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⴰⵔⴰ ⵢⵉⵎⴹⴰⵏⴻⵏ ⵉⵎⵎⵉⴷⴻⵏ ⵓⴼⵔⵉⵏⴻⵏ.

select-from-sequence-coprime-common-factor = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⴼⵔⴻⵏ ⵉⵎⴹⴰⵏⴻⵏ coprime. ⴰⴽⴽ ⴰⵣⴰⵍⴻⵏ ⵉ ⵢⴻⵣⵎⵔⴻⵏ ⵙⵄⴰⵏ ⵢⵉⵡⴻⵏ ⵏ ⵓⴼⴰⴽⵜⴻⵓⵔ. (ⴰⵣⴰⵍⴻⵏ ⵏ "from" ⵏⴻⵖ "to" ⵉⵍⴰⵇ ⴰⴷ ⵉⵍⵉⵏ ⴷ coprime ⴷ "step".)

select-from-sequence-coprime-single-number = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⴼⵔⴻⵏ ⵉⵙⴷⵓⴽⴽⴰⵍ coprime ⵙⴻⴳ ⵢⵉⵡⴻⵏ ⵏ ⵓⵎⴹⴰⵏ ⵓⵔ ⵏⴻⵍⵍⵉ ⴷ 1.

select-from-sequence-excluded-too-many-combinations = ⵜⵜⵡⴰⴽⴽⵙⴻⵏ ⵓⴳⴰⵔ ⵏ 70% ⵏ ⵢⵉⵙⴷⵓⴽⴽⴰⵍ ⴷⴻⴳ selectFromSequence

select-from-sequence-coprime-none-found = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⴼⵔⴻⵏ ⵉⵎⴹⴰⵏⴻⵏ coprime. ⴰⴽⴽ ⴰⵣⴰⵍⴻⵏ ⵉ ⵢⴻⵣⵎⵔⴻⵏ ⵙⵄⴰⵏ ⵢⵉⵡⴻⵏ ⵏ ⵓⴼⴰⴽⵜⴻⵓⵔ.

select-from-sequence-too-few-unique-values = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⴼⵔⴻⵏ { $numToSelect } ⵏ ⵡⴰⵣⴰⵍⴻⵏ ⵓⵎⵎⵉⴷⴻⵏ ⵙⴻⴳ ⵓⵙⴻⴷⴷⵉ ⵏ ⵜⴻⵖⵣⵉ { $numPossibleValues }

select-prime-numbers-too-few-values = ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⴼⵔⴻⵏ { $numToSelect } ⵏ ⵡⴰⵣⴰⵍⴻⵏ ⵙⴻⴳ ⵓⵎⵓⵖ ⵏ ⵢⵉⵎⴹⴰⵏⴻⵏ prime ⵏ ⵜⴻⵖⵣⵉ { $numValues }

select-prime-numbers-values-count-mismatch = ⴰⵎⴹⴰⵏ ⵏ ⵡⴰⵣⴰⵍⴻⵏ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⵉ select ⵉⵍⴰⵇ ⴰⴷ ⵢⴻⵎⵚⴰⴷⴰ ⴷ ⵓⵎⴹⴰⵏ ⵉ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ

select-prime-numbers-values-not-prime = ⴰⴽⴽ ⴰⵣⴰⵍⴻⵏ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⵉ select prime number ⵉⵍⴰⵇ ⴰⴷ ⵉⵍⵉⵏ ⴷⴻⴳ ⵓⵎⵓⵖ ⵏ ⵢⵉⵎⴹⴰⵏⴻⵏ prime

select-prime-numbers-values-excluded-combination = ⴰⵣⴰⵍⴻⵏ ⵢⴻⵜⵜⵡⴰⴼⵔⴰⵏⴻⵏ ⵏ selectPrimeNumbers ⵍⵍⴰⵏ ⴷ ⴰⵙⴷⵓⴽⴽⴻⵍ ⵢⴻⵜⵜⵡⴰⴽⴽⵙⴻⵏ

select-prime-numbers-excluded-too-many-combinations = ⵜⵜⵡⴰⴽⴽⵙⴻⵏ ⵓⴳⴰⵔ ⵏ 70% ⵏ ⵢⵉⵙⴷⵓⴽⴽⴰⵍ ⴷⴻⴳ selectPrimeNumbers

select-random-combination-fluke = ⵙ ⵡⴰⵢⴻⵏ ⵓⵔ ⵏⴻⵜⵜⵡⴰⴳⴰⵏ ⴰⵔⴰ, ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⴼⵔⴻⵏ ⴰⵙⴷⵓⴽⴽⴻⵍ ⵏ ⵡⴰⵣⴰⵍⴻⵏ ⵡⴰⵔ ⴰⴼⵔⴰⵏ

select-random-value-fluke = ⵙ ⵡⴰⵢⴻⵏ ⵓⵔ ⵏⴻⵜⵜⵡⴰⴳⴰⵏ ⴰⵔⴰ, ⵓⵔ ⵢⴻⵣⵎⵉⵔ ⴰⵔⴰ ⴰⴷ ⵢⴻⴼⵔⴻⵏ ⴰⵣⴰⵍ ⵡⴰⵔ ⴰⴼⵔⴰⵏ
