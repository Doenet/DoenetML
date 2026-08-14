# Santali diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Written in Ol Chiki. Every message whose wording depends on a count writes a
# `[two]` branch as well as `[one]` and `[other]`; see `content.ftl`'s header
# on the dual. The two `line-segment-attributes-ignored-*` messages are written
# flat instead, because the count they carry never reaches a noun in the
# Santali wording and three identical branches would say nothing.
#
# DoenetML element, attribute and value names stay in English exactly as
# written, and so does the `[deprecation]` marker.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = ᱵᱟᱨᱭᱟᱱ ᱢᱩᱪᱟᱹᱫ ᱴᱩᱰᱟᱹᱜ ᱮᱢ ᱟᱠᱟᱱ ᱠᱷᱟᱱ { $attributes } ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ

line-segment-attributes-ignored-with-endpoint-and-midpoint = ᱢᱩᱪᱟᱹᱫ ᱴᱩᱰᱟᱹᱜ ᱟᱨ ᱛᱟᱞᱟ ᱴᱩᱰᱟᱹᱜ ᱵᱟᱨᱭᱟᱱ ᱮᱢ ᱟᱠᱟᱱ ᱠᱷᱟᱱ { $attributes } ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ

line-segment-midpoint-offset-without-midpoint = ᱛᱟᱞᱟ ᱴᱩᱰᱟᱹᱜ ᱵᱟᱹᱱᱩᱜ ᱠᱷᱟᱱ midpointOffset ᱨᱮᱱ ᱡᱟᱦᱟᱸ ᱠᱟᱹᱢᱤ ᱵᱟᱹᱱᱩᱜᱼᱟ

## `<line>`

line-points-undetermined-dimensions = ᱵᱟᱝ ᱴᱷᱟᱹᱣᱠᱟᱹ ᱟᱠᱟᱱ ᱟᱭᱟᱛᱱ ᱨᱮᱱ ᱴᱩᱰᱟᱹᱜ ᱠᱷᱚᱱ ᱪᱟᱞᱟᱜ ᱜᱟᱨ।

line-points-too-few-dimensions = ᱜᱟᱨ ᱫᱚ ᱠᱚᱢ ᱛᱮ ᱠᱚᱢ ᱵᱟᱨᱭᱟ ᱟᱭᱟᱛᱱ ᱨᱮᱱ ᱴᱩᱰᱟᱹᱜ ᱠᱷᱚᱱ ᱪᱟᱞᱟᱜ ᱞᱟᱹᱠᱛᱤᱭᱟ।

line-points-depend-on-variables = ᱜᱟᱨ ᱫᱚ ᱚᱱᱟ ᱴᱩᱰᱟᱹᱜ ᱠᱷᱚᱱ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ ᱡᱟᱦᱟᱸ ᱵᱚᱫᱚᱞᱤᱡ ᱨᱮ ᱦᱟᱛᱟᱣ ᱟᱠᱟᱱᱟ: { $variables }।

line-equation-invalid-format = ᱵᱚᱫᱚᱞᱤᱡ { $variable1 } ᱟᱨ { $variable2 } ᱨᱮᱱ ᱜᱟᱨ ᱥᱚᱢᱤᱠᱚᱨᱚᱬ ᱨᱮᱱ ᱵᱟᱝ ᱴᱷᱤᱠ ᱨᱩᱯ।

## `<ray>`

ray-overprescribed-through = ᱠᱤᱨᱚᱬ ᱫᱚ through, endpoint ᱟᱨ direction — ᱯᱮᱭᱟᱛᱮ ᱛᱮ ᱴᱷᱟᱹᱣᱠᱟᱹ ᱟᱠᱟᱱᱟ। ᱮᱢ ᱟᱠᱟᱱ through ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।

ray-dimension-mismatch = ᱠᱤᱨᱚᱬ ᱨᱮ numDimensions ᱵᱟᱭ ᱢᱤᱞᱟᱹᱣᱟ।

## `<vector>`

vector-overprescribed-head = ᱥᱚᱫᱤᱥ ᱫᱚ head, tail ᱟᱨ displacement — ᱯᱮᱭᱟᱛᱮ ᱛᱮ ᱴᱷᱟᱹᱣᱠᱟᱹ ᱟᱠᱟᱱᱟ। ᱮᱢ ᱟᱠᱟᱱ head ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।

vector-dimension-mismatch = ᱥᱚᱫᱤᱥ ᱨᱮ numDimensions ᱵᱟᱭ ᱢᱤᱞᱟᱹᱣᱟ।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ᱨᱮ nearestPoint ᱧᱩᱛᱩᱢᱟᱱ ᱛᱷᱟᱨ ᱵᱚᱫᱚᱞᱤᱡ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱚᱱᱟᱛᱮ ᱚᱱᱟ ᱥᱮᱫ ᱛᱟᱱᱟᱣ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ।

constrain-to-without-nearest-point = `<{ $component }>` ᱨᱮ nearestPoint ᱧᱩᱛᱩᱢᱟᱱ ᱛᱷᱟᱨ ᱵᱚᱫᱚᱞᱤᱡ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱚᱱᱟᱛᱮ ᱚᱱᱟ ᱨᱮ ᱨᱚᱠᱟᱣ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ।

constrain-to-interior-without-nearest-point = `<{ $component }>` ᱨᱮ nearestPoint ᱧᱩᱛᱩᱢᱟᱱ ᱛᱷᱟᱨ ᱵᱚᱫᱚᱞᱤᱡ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱚᱱᱟᱛᱮ ᱚᱱᱟ ᱨᱮᱱ ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱨᱚᱠᱟᱣ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ।

## `<choiceInput>`

choice-input-label-position-ignored = ᱵᱟᱝ ᱤᱱᱞᱟᱭᱤᱱ choiceInput ᱞᱟᱹᱜᱤᱫ labelPosition ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput ᱞᱟᱹᱜᱤᱫ ᱮᱢ ᱟᱠᱟᱱ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱫᱚ ᱵᱟᱪᱷᱟᱣ ᱦᱚᱯᱚᱱᱠᱚ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱥᱟᱶ ᱵᱟᱭ ᱢᱤᱞᱟᱹᱣᱟ।

pretzel-indices-count-mismatch = problem ᱞᱟᱹᱜᱤᱫ ᱮᱢ ᱟᱠᱟᱱ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱫᱚ problem ᱦᱚᱯᱚᱱᱠᱚ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱥᱟᱶ ᱵᱟᱭ ᱢᱤᱞᱟᱹᱣᱟ।

shuffle-indices-count-mismatch = shuffle ᱞᱟᱹᱜᱤᱫ ᱮᱢ ᱟᱠᱟᱱ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱫᱚ ᱦᱟᱹᱴᱤᱧᱠᱚ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱥᱟᱶ ᱵᱟᱭ ᱢᱤᱞᱟᱹᱣᱟ।

indices-ignored-out-of-range = { $component } ᱞᱟᱹᱜᱤᱫ ᱮᱢ ᱟᱠᱟᱱ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ ᱛᱤᱱᱟᱹᱜ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ ᱥᱤᱢᱟ ᱵᱟᱦᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ।

pretzel-indices-repeated = pretzel ᱞᱟᱹᱜᱤᱫ ᱮᱢ ᱟᱠᱟᱱ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ ᱛᱤᱱᱟᱹᱜ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ ᱫᱚᱦᱲᱟ ᱦᱩᱭ ᱟᱠᱟᱱᱟ।

pretzel-circuit-first-index = circuit ᱢᱚᱰ ᱨᱮ pretzel ᱞᱟᱹᱜᱤᱫ ᱮᱢ ᱟᱠᱟᱱ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ ᱯᱩᱭᱞᱩ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ ᱫᱚ 1 ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` ᱫᱚ ᱥᱴᱨᱤᱝ ᱦᱚᱯᱚᱱᱠᱚ ᱥᱟᱶ ᱠᱟᱹᱢᱤ ᱞᱟᱹᱜᱤᱫ `type` ᱜᱩᱬ ᱮᱢ ᱞᱟᱹᱠᱛᱤᱭᱟ।

invalid-type-defaulting-to-math = { $component } ᱦᱟᱹᱴᱤᱧ ᱞᱟᱹᱜᱤᱫ { $type } ᱨᱚᱠᱚᱢ ᱵᱟᱝ ᱴᱷᱤᱠ ᱠᱟᱱᱟ। math, text, number ᱥᱮ boolean ᱠᱷᱚᱱ ᱢᱤᱫ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ। ᱢᱩᱞ ᱛᱮ math ᱦᱟᱛᱟᱣᱚᱜᱼᱟ।

string-not-valid-component-to-arrange = ᱥᱴᱨᱤᱝ "{ $value }" ᱫᱚ { $component } ᱞᱟᱹᱜᱤᱫ ᱴᱷᱤᱠ ᱦᱟᱹᱴᱤᱧ ᱵᱟᱝ ᱠᱟᱱᱟ। ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।

## Types and variables

invalid-type-defaulting-to-number = { $type } ᱨᱚᱠᱚᱢ ᱵᱟᱝ ᱴᱷᱤᱠ ᱠᱟᱱᱟ, ᱨᱚᱠᱚᱢ ᱫᱚ number ᱦᱩᱭᱩᱜᱼᱟ।

invalid-variable-value = ᱵᱚᱫᱚᱞᱤᱡ ᱨᱮᱱ ᱵᱟᱝ ᱴᱷᱤᱠ ᱜᱚᱱᱚᱝ: `{ $value }`

## Variants

variant-index-must-be-number = ᱨᱚᱠᱚᱢ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ { $index } ᱢᱤᱫ ᱞᱮᱠᱷᱟ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ

variant-index-must-be-integer = ᱨᱚᱠᱚᱢ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ { $index } ᱢᱤᱫ ᱯᱩᱨᱟᱹᱱᱟᱝᱠᱚ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ᱫᱚ ᱱᱤᱨᱚᱯᱮᱠᱷᱚ ᱢᱟᱯ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱᱟ। ᱚᱥᱟᱨ ᱫᱚ ᱥᱟᱯᱮᱠᱷᱚ ᱦᱩᱭᱩᱜᱼᱟ।

side-by-side-absolute-margins = `<{ $component }>` ᱫᱚ ᱱᱤᱨᱚᱯᱮᱠᱷᱚ ᱢᱟᱯ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱᱟ। ᱠᱤᱱᱟᱨ ᱫᱚ ᱥᱟᱯᱮᱠᱷᱚ ᱦᱩᱭᱩᱜᱼᱟ।

side-by-side-no-block-child = ᱵᱟᱝ ᱴᱷᱤᱠ `<{ $component }>`: ᱱᱚᱶᱟ ᱨᱮ ᱠᱚᱢ ᱛᱮ ᱠᱚᱢ ᱢᱤᱫ ᱵᱞᱚᱠ ᱦᱚᱯᱚᱱ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ।

## `<label>`

label-for-ignored-on-graphical = ᱟᱞᱮᱠᱷᱤ `<label>` ᱨᱮ `for` ᱜᱩᱬ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।

label-for-must-resolve-to-one = `<label>` ᱨᱮ `for` ᱜᱩᱬ ᱫᱚ ᱴᱷᱤᱠ ᱢᱤᱫ ᱦᱟᱹᱴᱤᱧ ᱩᱫᱩᱜ ᱞᱟᱹᱠᱛᱤᱭᱟ।

label-for-unresolved = `<label>` ᱨᱮ `for` ᱜᱩᱬ ᱫᱚ ᱡᱟᱦᱟᱸ ᱦᱟᱹᱴᱤᱧ ᱵᱟᱭ ᱩᱫᱩᱜ ᱠᱮᱫᱼᱟ।

label-for-answer-with-authored-inputs = `<label>` ᱨᱮ `for` ᱜᱩᱬ ᱫᱚ ᱚᱱᱟ `<answer>` ᱩᱫᱩᱜ ᱠᱟᱱᱟ ᱡᱟᱦᱟᱸ ᱨᱮ ᱚᱞᱚᱜᱤᱡ ᱟᱡ ᱛᱮ ᱵᱚᱞᱚᱱᱠᱚ ᱚᱞ ᱟᱠᱟᱫᱼᱟᱭ; ᱵᱚᱞᱚᱱ ᱥᱟᱡᱟᱣ ᱛᱮ ᱩᱫᱩᱜ ᱢᱮ।

label-for-answer-without-input = `<label>` ᱨᱮ `for` ᱜᱩᱬ ᱫᱚ ᱚᱱᱟ `<answer>` ᱩᱫᱩᱜ ᱠᱟᱱᱟ ᱡᱟᱦᱟᱸ ᱨᱮ ᱧᱩᱛᱩᱢ ᱮᱢ ᱦᱩᱭᱩᱜ ᱠᱟᱱ ᱵᱚᱞᱚᱱ ᱵᱟᱹᱱᱩᱜᱼᱟ।

label-for-must-reference-input-or-answer = `<label>` ᱨᱮ `for` ᱜᱩᱬ ᱫᱚ ᱢᱤᱫ ᱵᱚᱞᱚᱱ ᱥᱮ ᱛᱮᱞᱟ ᱩᱫᱩᱜ ᱞᱟᱹᱠᱛᱤᱭᱟ।

## Accessibility

accessibility-short-description-or-decorative = ᱥᱩᱜᱚᱢ ᱞᱟᱹᱜᱤᱫ `<{ $component }>` ᱨᱮ ᱦᱩᱰᱤᱧ ᱵᱟᱛᱟᱣ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ ᱥᱮ ᱚᱱᱟ ᱫᱚ decorative ᱢᱮᱱ ᱞᱟᱹᱠᱛᱤᱭᱟ।

accessibility-video-short-description = ᱥᱩᱜᱚᱢ ᱞᱟᱹᱜᱤᱫ `<video>` ᱨᱮ ᱦᱩᱰᱤᱧ ᱵᱟᱛᱟᱣ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ।

accessibility-input-short-description-or-label = ᱥᱩᱜᱚᱢ ᱞᱟᱹᱜᱤᱫ `<{ $component }>` ᱨᱮ ᱦᱩᱰᱤᱧ ᱵᱟᱛᱟᱣ ᱥᱮ ᱧᱩᱛᱩᱢ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ।

accessibility-answer-input-short-description-or-label = ᱥᱩᱜᱚᱢ ᱞᱟᱹᱜᱤᱫ ᱵᱚᱞᱚᱱ ᱛᱮᱭᱟᱨᱚᱜ ᱠᱟᱱ `<answer>` ᱨᱮ ᱦᱩᱰᱤᱧ ᱵᱟᱛᱟᱣ ᱥᱮ ᱧᱩᱛᱩᱢ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ।

accessibility-short-description-contains-math = ᱦᱩᱰᱤᱧ ᱵᱟᱛᱟᱣ ᱨᱮ `<{ $component }>` ᱞᱮᱠᱟᱱ ᱜᱟᱱᱤᱛ ᱦᱟᱹᱴᱤᱧ ᱵᱟᱝ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤᱭᱟ। ᱜᱟᱱᱤᱛ ᱫᱚ ᱠᱟᱛᱷᱟ ᱛᱮ ᱚᱞ ᱢᱮ।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] ᱠᱷᱚᱸᱰ ᱧᱩᱛᱩᱢ ᱨᱮᱱ ᱚᱞ ᱞᱟᱹᱜᱤᱫ { $colorName } ᱨᱮᱱ ᱛᱮᱥᱟᱨ ᱠᱚᱢᱟ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ᱠᱚᱢ ᱛᱮ ᱠᱚᱢ { $threshold }:1 ᱞᱟᱹᱠᱛᱤ) (ᱦᱮᱸᱫᱮ ᱢᱚᱰ)।
       *[other] ᱠᱷᱚᱸᱰ ᱧᱩᱛᱩᱢ ᱨᱮᱱ ᱚᱞ ᱞᱟᱹᱜᱤᱫ { $colorName } ᱨᱮᱱ ᱛᱮᱥᱟᱨ ᱠᱚᱢᱟ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ᱠᱚᱢ ᱛᱮ ᱠᱚᱢ { $threshold }:1 ᱞᱟᱹᱠᱛᱤ)।
    }

## `<circle>`

circle-through-points-non-numerical = ᱡᱟᱦᱟᱸ ᱨᱮ ᱴᱩᱰᱟᱹᱜ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱜᱚᱱᱚᱝ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱚᱱᱰᱮ { $count } ᱴᱩᱰᱟᱹᱜ ᱠᱷᱚᱱ ᱪᱟᱞᱟᱜ `<circle>` ᱱᱤᱛ ᱦᱟᱹᱵᱤᱡ ᱵᱟᱝ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱᱟ।

circle-too-many-through-points = ᱯᱮ ᱠᱷᱚᱱ ᱟᱭᱢᱟ ᱴᱩᱰᱟᱹᱜ ᱠᱷᱚᱱ ᱪᱟᱞᱟᱜ ᱜᱚᱞ ᱵᱟᱭ ᱞᱮᱠᱷᱟᱭᱚᱜᱼᱟ।

circle-overprescribed-radius-center-points = ᱮᱢ ᱟᱠᱟᱱ ᱛᱨᱤᱡᱭᱟ, ᱛᱟᱞᱟ ᱟᱨ ᱴᱩᱰᱟᱹᱜ — ᱯᱮᱭᱟᱛᱮ ᱥᱟᱶ ᱜᱚᱞ ᱵᱟᱭ ᱞᱮᱠᱷᱟᱭᱚᱜᱼᱟ।

circle-center-with-multiple-points = ᱮᱢ ᱟᱠᱟᱱ ᱛᱟᱞᱟ ᱥᱟᱶ ᱢᱤᱫ ᱠᱷᱚᱱ ᱟᱭᱢᱟ ᱴᱩᱰᱟᱹᱜ ᱠᱷᱚᱱ ᱪᱟᱞᱟᱜ ᱜᱚᱞ ᱵᱟᱭ ᱞᱮᱠᱷᱟᱭᱚᱜᱼᱟ।

circle-radius-too-small = ᱜᱚᱞ ᱵᱟᱭ ᱞᱮᱠᱷᱟᱭᱚᱜᱼᱟ: ᱵᱟᱨᱭᱟ ᱴᱩᱰᱟᱹᱜ ᱛᱟᱞᱟ ᱨᱮᱱ ᱥᱟᱸᱜᱤᱧ { $distance } ᱛᱟᱦᱮᱸᱱ ᱠᱷᱟᱱ ᱮᱢ ᱟᱠᱟᱱ ᱛᱨᱤᱡᱭᱟ { $radius } ᱫᱚ ᱟᱹᱰᱤ ᱦᱩᱰᱤᱧ।

circle-radius-with-many-points = ᱮᱢ ᱟᱠᱟᱱ ᱛᱨᱤᱡᱭᱟ ᱥᱟᱶ ᱵᱟᱨᱭᱟ ᱠᱷᱚᱱ ᱟᱭᱢᱟ ᱴᱩᱰᱟᱹᱜ ᱠᱷᱚᱱ ᱪᱟᱞᱟᱜ ᱜᱚᱞ ᱵᱟᱭ ᱛᱮᱭᱟᱨᱚᱜᱼᱟ।

circle-invalid-center-or-through-points = ᱜᱚᱞ ᱨᱮᱱ ᱵᱟᱝ ᱴᱷᱤᱠ ᱛᱟᱞᱟ ᱥᱮ ᱴᱩᱰᱟᱹᱜ।

circle-radius-center-with-multiple-points = ᱮᱢ ᱟᱠᱟᱱ ᱛᱟᱞᱟ ᱥᱟᱶ ᱢᱤᱫ ᱠᱷᱚᱱ ᱟᱭᱢᱟ ᱴᱩᱰᱟᱹᱜ ᱠᱷᱚᱱ ᱪᱟᱞᱟᱜ ᱜᱚᱞ ᱨᱮᱱ ᱛᱨᱤᱡᱭᱟ ᱵᱟᱭ ᱞᱮᱠᱷᱟᱭᱚᱜᱼᱟ।

circle-change-radius-non-numerical = ᱵᱟᱝ ᱞᱮᱠᱷᱟ ᱴᱩᱰᱟᱹᱜ ᱠᱷᱚᱱ ᱪᱟᱞᱟᱜ ᱜᱚᱞ ᱨᱮᱱ ᱛᱨᱤᱡᱭᱟ ᱵᱟᱭ ᱵᱚᱫᱚᱞᱚᱜᱼᱟ

circle-radius-with-points-non-numerical = ᱞᱮᱠᱷᱟ ᱜᱚᱱᱚᱝ ᱵᱟᱹᱱᱩᱜ ᱠᱷᱟᱱ, ᱮᱢ ᱟᱠᱟᱱ ᱛᱨᱤᱡᱭᱟ ᱥᱟᱶ ᱢᱤᱫ ᱠᱷᱚᱱ ᱟᱭᱢᱟ ᱴᱩᱰᱟᱹᱜ ᱠᱷᱚᱱ ᱪᱟᱞᱟᱜ ᱜᱚᱞ ᱵᱟᱭ ᱛᱮᱭᱟᱨᱚᱜᱼᱟ।

circle-change-center-non-numerical = ᱵᱟᱝ ᱞᱮᱠᱷᱟ ᱜᱚᱱᱚᱝ ᱨᱮᱱ ᱴᱩᱰᱟᱹᱜ ᱠᱷᱚᱱ ᱪᱟᱞᱟᱜ ᱜᱚᱞ ᱨᱮᱱ ᱛᱟᱞᱟ ᱵᱚᱫᱚᱞ ᱱᱤᱛ ᱦᱟᱹᱵᱤᱡ ᱵᱟᱝ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱᱟ।

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱡᱟᱭᱜᱟ ᱞᱟᱹᱜᱤᱫ ᱟᱭᱟᱛᱱ ᱠᱚᱢᱟ। ᱡᱟᱭᱜᱟ ᱨᱮ { $intervals } ᱟᱸᱛᱚᱨᱟᱞ ᱢᱮᱱᱟᱜᱼᱟ ᱢᱮᱱᱠᱷᱟᱱ ᱯᱷᱚᱞᱚᱱ ᱨᱮ { $inputs ->
            [one] { $inputs } ᱵᱚᱞᱚᱱ
            [two] { $inputs } ᱵᱚᱞᱚᱱᱠᱤᱱ
           *[other] { $inputs } ᱵᱚᱞᱚᱱᱠᱚ
        } ᱢᱮᱱᱟᱜᱼᱟ।
        [two] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱡᱟᱭᱜᱟ ᱞᱟᱹᱜᱤᱫ ᱟᱭᱟᱛᱱ ᱠᱚᱢᱟ। ᱡᱟᱭᱜᱟ ᱨᱮ { $intervals } ᱟᱸᱛᱚᱨᱟᱞᱠᱤᱱ ᱢᱮᱱᱟᱜᱼᱟ ᱢᱮᱱᱠᱷᱟᱱ ᱯᱷᱚᱞᱚᱱ ᱨᱮ { $inputs ->
            [one] { $inputs } ᱵᱚᱞᱚᱱ
            [two] { $inputs } ᱵᱚᱞᱚᱱᱠᱤᱱ
           *[other] { $inputs } ᱵᱚᱞᱚᱱᱠᱚ
        } ᱢᱮᱱᱟᱜᱼᱟ।
       *[other] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱡᱟᱭᱜᱟ ᱞᱟᱹᱜᱤᱫ ᱟᱭᱟᱛᱱ ᱠᱚᱢᱟ। ᱡᱟᱭᱜᱟ ᱨᱮ { $intervals } ᱟᱸᱛᱚᱨᱟᱞᱠᱚ ᱢᱮᱱᱟᱜᱼᱟ ᱢᱮᱱᱠᱷᱟᱱ ᱯᱷᱚᱞᱚᱱ ᱨᱮ { $inputs ->
            [one] { $inputs } ᱵᱚᱞᱚᱱ
            [two] { $inputs } ᱵᱚᱞᱚᱱᱠᱤᱱ
           *[other] { $inputs } ᱵᱚᱞᱚᱱᱠᱚ
        } ᱢᱮᱱᱟᱜᱼᱟ।
    }

function-domain-invalid-format = ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱡᱟᱭᱜᱟ ᱨᱮᱱ ᱵᱟᱝ ᱴᱷᱤᱠ ᱨᱩᱯ।

function-ignoring-non-numerical =
    { $type ->
        [maximum] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱵᱟᱝ ᱞᱮᱠᱷᱟ ᱢᱟᱨᱟᱝ ᱜᱚᱱᱚᱝ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।
        [minimum] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱵᱟᱝ ᱞᱮᱠᱷᱟ ᱦᱩᱰᱤᱧ ᱜᱚᱱᱚᱝ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।
        [extremum] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱵᱟᱝ ᱞᱮᱠᱷᱟ ᱢᱩᱪᱟᱹᱫ ᱜᱚᱱᱚᱝ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।
        [point] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱵᱟᱝ ᱞᱮᱠᱷᱟ ᱴᱩᱰᱟᱹᱜ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।
        [slope] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱵᱟᱝ ᱞᱮᱠᱷᱟ ᱰᱷᱟᱞ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।
       *[other] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱵᱟᱝ ᱞᱮᱠᱷᱟ { $type } ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।
    }

function-ignoring-empty =
    { $type ->
        [maximum] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱠᱷᱟᱹᱞᱤ ᱢᱟᱨᱟᱝ ᱜᱚᱱᱚᱝ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।
        [minimum] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱠᱷᱟᱹᱞᱤ ᱦᱩᱰᱤᱧ ᱜᱚᱱᱚᱝ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।
        [extremum] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱠᱷᱟᱹᱞᱤ ᱢᱩᱪᱟᱹᱫ ᱜᱚᱱᱚᱝ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।
        [point] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱠᱷᱟᱹᱞᱤ ᱴᱩᱰᱟᱹᱜ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।
       *[other] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱠᱷᱟᱹᱞᱤ { $type } ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।
    }

function-points-too-close = ᱯᱷᱚᱞᱚᱱ ᱨᱮ ᱵᱟᱨᱭᱟ ᱴᱩᱰᱟᱹᱜ ᱟᱹᱰᱤ ᱡᱟᱦᱟᱸᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ। ᱯᱷᱚᱞᱚᱱ ᱵᱟᱭ ᱴᱷᱟᱹᱣᱠᱟᱹᱭᱚᱜᱼᱟ।

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱟᱵᱨᱩᱛᱛᱤ ᱫᱚ ᱚᱱᱟ ᱡᱚᱠᱷᱚᱡ ᱦᱩᱭᱩᱜᱼᱟ ᱡᱟᱦᱟᱸ ᱡᱚᱠᱷᱚᱡ ᱵᱚᱞᱚᱱ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱟᱨ ᱚᱰᱚᱠ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱥᱚᱢᱟᱱ ᱦᱩᱭᱩᱜᱼᱟ। ᱱᱚᱶᱟ ᱯᱷᱚᱞᱚᱱ ᱨᱮ { $inputs } ᱵᱚᱞᱚᱱ ᱟᱨ { $outputs ->
            [one] { $outputs } ᱚᱰᱚᱠ
            [two] { $outputs } ᱚᱰᱚᱠᱠᱤᱱ
           *[other] { $outputs } ᱚᱰᱚᱠᱠᱚ
        } ᱢᱮᱱᱟᱜᱼᱟ।
        [two] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱟᱵᱨᱩᱛᱛᱤ ᱫᱚ ᱚᱱᱟ ᱡᱚᱠᱷᱚᱡ ᱦᱩᱭᱩᱜᱼᱟ ᱡᱟᱦᱟᱸ ᱡᱚᱠᱷᱚᱡ ᱵᱚᱞᱚᱱ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱟᱨ ᱚᱰᱚᱠ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱥᱚᱢᱟᱱ ᱦᱩᱭᱩᱜᱼᱟ। ᱱᱚᱶᱟ ᱯᱷᱚᱞᱚᱱ ᱨᱮ { $inputs } ᱵᱚᱞᱚᱱᱠᱤᱱ ᱟᱨ { $outputs ->
            [one] { $outputs } ᱚᱰᱚᱠ
            [two] { $outputs } ᱚᱰᱚᱠᱠᱤᱱ
           *[other] { $outputs } ᱚᱰᱚᱠᱠᱚ
        } ᱢᱮᱱᱟᱜᱼᱟ।
       *[other] ᱯᱷᱚᱞᱚᱱ ᱨᱮᱱ ᱟᱵᱨᱩᱛᱛᱤ ᱫᱚ ᱚᱱᱟ ᱡᱚᱠᱷᱚᱡ ᱦᱩᱭᱩᱜᱼᱟ ᱡᱟᱦᱟᱸ ᱡᱚᱠᱷᱚᱡ ᱵᱚᱞᱚᱱ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱟᱨ ᱚᱰᱚᱠ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱥᱚᱢᱟᱱ ᱦᱩᱭᱩᱜᱼᱟ। ᱱᱚᱶᱟ ᱯᱷᱚᱞᱚᱱ ᱨᱮ { $inputs } ᱵᱚᱞᱚᱱᱠᱚ ᱟᱨ { $outputs ->
            [one] { $outputs } ᱚᱰᱚᱠ
            [two] { $outputs } ᱚᱰᱚᱠᱠᱤᱱ
           *[other] { $outputs } ᱚᱰᱚᱠᱠᱚ
        } ᱢᱮᱱᱟᱜᱼᱟ।
    }

## `<sequence>`

sequence-invalid-length = ᱚᱱᱩᱠᱨᱚᱢ ᱨᱮᱱ ᱵᱟᱝ ᱴᱷᱤᱠ ᱡᱷᱟᱸᱡ। ᱢᱤᱫ ᱵᱟᱝ ᱨᱤᱬᱟᱹᱛᱢᱚᱠ ᱯᱩᱨᱟᱹᱱᱟᱝᱠᱚ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ।

sequence-invalid-step = ᱚᱱᱩᱠᱨᱚᱢ ᱨᱮᱱ ᱵᱟᱝ ᱴᱷᱤᱠ ᱛᱟᱲᱟᱢ। { $type } ᱨᱚᱠᱚᱢ ᱨᱮᱱ ᱚᱱᱩᱠᱨᱚᱢ ᱞᱟᱹᱜᱤᱫ ᱢᱤᱫ ᱞᱮᱠᱷᱟ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ।

sequence-invalid-endpoint-number = ᱞᱮᱠᱷᱟ ᱚᱱᱩᱠᱨᱚᱢ ᱨᱮᱱ ᱵᱟᱝ ᱴᱷᱤᱠ "{ $attribute }"। ᱢᱤᱫ ᱞᱮᱠᱷᱟ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ।

sequence-invalid-endpoint-letters = ᱟᱠᱷᱚᱨ ᱚᱱᱩᱠᱨᱚᱢ ᱨᱮᱱ ᱵᱟᱝ ᱴᱷᱤᱠ "{ $attribute }"। ᱟᱠᱷᱚᱨ ᱡᱚᱛᱚ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ।

sequence-invalid-endpoint = ᱚᱱᱩᱠᱨᱚᱢ ᱨᱮᱱ ᱵᱟᱝ ᱴᱷᱤᱠ "{ $attribute }"।

select-from-sequence-coprime-not-numbers = ᱞᱮᱠᱷᱟ ᱵᱟᱝ ᱵᱟᱪᱷᱟᱣᱚᱜ ᱠᱟᱱᱟ, ᱚᱱᱟᱛᱮ coprime ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations ᱮᱢ ᱟᱠᱟᱱᱟ, ᱚᱱᱟᱛᱮ coprime ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ

## Resolving a `target`

target-not-found = `<{ $source }>` ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝ ᱴᱷᱤᱠ ᱞᱟᱠᱷᱟᱹᱭ: ᱞᱟᱠᱷᱟᱹᱭ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ।

target-state-variable-not-found = `<{ $source }>` ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝ ᱴᱷᱤᱠ ᱞᱟᱠᱷᱟᱹᱭ: `<{ $component }>` ᱨᱮ "{ $property }" ᱧᱩᱛᱩᱢᱟᱱ ᱛᱷᱟᱨ ᱵᱚᱫᱚᱞᱤᱡ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` ᱨᱮᱱ ᱵᱚᱫᱚᱞᱤᱡ ᱫᱚ ᱟᱡ ᱛᱮ ᱛᱮᱸᱜᱚᱱ ᱵᱚᱫᱚᱞᱤᱡ ᱠᱷᱚᱱ ᱮᱴᱟᱜ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ।

ode-system-duplicate-variable-names = ᱫᱚᱦᱲᱟ ᱟᱠᱟᱱ ᱵᱚᱫᱚᱞᱤᱡ ᱧᱩᱛᱩᱢ ᱥᱟᱶ ODE RHS ᱯᱷᱚᱞᱚᱱ ᱵᱟᱭ ᱴᱷᱟᱹᱣᱠᱟᱹᱭᱚᱜᱼᱟ।

ode-system-rhs-function-error = ODE RHS ᱯᱷᱚᱞᱚᱱ ᱵᱟᱭ ᱴᱷᱟᱹᱣᱠᱟᱹᱭᱚᱜᱼᱟ। mathjs ᱯᱷᱚᱞᱚᱱ ᱛᱮᱭᱟᱨ ᱨᱮ ᱵᱷᱩᱞ।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } ᱜᱟᱨ ᱛᱟᱞᱟ ᱨᱮᱱ ᱠᱚᱬ ᱵᱟᱭ ᱴᱷᱟᱹᱣᱠᱟᱹᱭᱚᱜᱼᱟ

angle-invalid-through-point = `<angle>` ᱨᱮᱱ through ᱨᱮ ᱵᱟᱝ ᱴᱷᱤᱠ ᱴᱩᱰᱟᱹᱜ

parabola-vertex-too-many-points = ᱪᱩᱰᱟᱹ ᱥᱟᱶ ᱢᱤᱫ ᱠᱷᱚᱱ ᱟᱭᱢᱟ ᱴᱩᱰᱟᱹᱜ ᱠᱷᱚᱱ ᱪᱟᱞᱟᱜ ᱯᱚᱨᱚᱵᱚᱞᱚᱭ ᱱᱤᱛ ᱦᱟᱹᱵᱤᱡ ᱵᱟᱝ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱᱟ।

parabola-too-many-points = ᱯᱮ ᱠᱷᱚᱱ ᱟᱭᱢᱟ ᱴᱩᱰᱟᱹᱜ ᱠᱷᱚᱱ ᱪᱟᱞᱟᱜ ᱯᱚᱨᱚᱵᱚᱞᱚᱭ ᱱᱤᱛ ᱦᱟᱹᱵᱤᱡ ᱵᱟᱝ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱᱟ।

intersection-too-many-items = ᱵᱟᱨᱭᱟ ᱠᱷᱚᱱ ᱟᱭᱢᱟ ᱡᱤᱱᱤᱥ ᱨᱮᱱ ᱠᱟᱴᱟᱣ ᱱᱤᱛ ᱦᱟᱹᱵᱤᱡ ᱵᱟᱝ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱᱟ

## Other math components

ionic-compound-not-two-ions = ᱵᱟᱨᱭᱟ ᱟᱭᱚᱱ ᱵᱟᱝ ᱛᱟᱦᱮᱸᱱ ᱠᱷᱟᱱ ᱟᱭᱚᱱᱤᱠ ᱡᱚᱛᱚ ᱱᱤᱛ ᱦᱟᱹᱵᱤᱡ ᱵᱟᱝ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱᱟ।

ionic-compound-needs-cation-and-anion = ᱟᱭᱚᱱᱤᱠ ᱡᱚᱛᱚ ᱫᱚ ᱢᱤᱫ ᱫᱷᱟᱱᱟᱭᱚᱱ ᱟᱨ ᱢᱤᱫ ᱨᱤᱬᱟᱹᱭᱚᱱ ᱞᱟᱹᱜᱤᱫ ᱮᱠᱮᱱ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱᱟ।

solve-equations-cannot-evaluate = ᱥᱚᱢᱤᱠᱚᱨᱚᱬ ᱨᱮᱱ ᱜᱚᱱᱚᱝ ᱵᱟᱭ ᱞᱮᱠᱷᱟᱭ ᱠᱮᱫᱼᱟ, ᱚᱱᱟᱛᱮ ᱚᱱᱟ ᱵᱟᱭ ᱛᱮᱭᱟᱨᱚᱜᱼᱟ: { $equation }

math-operators-operand-number-required = ᱜᱟᱱᱤᱛ ᱠᱟᱹᱢᱤ ᱚᱰᱚᱠ ᱞᱟᱹᱜᱤᱫ operandNumber ᱮᱢ ᱞᱟᱹᱠᱛᱤᱭᱟ।

eigen-decomposition-failed = ᱟᱵᱭᱩᱦᱚ ᱨᱮᱱ ᱟᱭᱜᱮᱱ ᱜᱚᱱᱚᱝ ᱵᱟᱭ ᱞᱮᱠᱷᱟᱭ ᱠᱮᱫᱼᱟ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: ᱯᱨᱟᱪᱚᱞ { $parameters } ᱫᱚ ᱱᱚᱢᱩᱱᱟ ᱨᱮ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱚᱱᱟᱛᱮ ᱚᱱᱟ ᱫᱚ ᱡᱟᱦᱟᱸ ᱡᱚᱠᱷᱚᱡ ᱠᱷᱟᱹᱞᱤ ᱥᱟᱶ ᱢᱤᱞᱟᱹᱣᱟ।
        [two] `<matchesPattern>`: ᱯᱨᱟᱪᱚᱞ { $parameters } ᱫᱚ ᱱᱚᱢᱩᱱᱟ ᱨᱮ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱚᱱᱟᱛᱮ ᱚᱱᱟᱠᱤᱱ ᱫᱚ ᱡᱟᱦᱟᱸ ᱡᱚᱠᱷᱚᱡ ᱠᱷᱟᱹᱞᱤ ᱥᱟᱶ ᱢᱤᱞᱟᱹᱣᱟ।
       *[other] `<matchesPattern>`: ᱯᱨᱟᱪᱚᱞ { $parameters } ᱫᱚ ᱱᱚᱢᱩᱱᱟ ᱨᱮ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱚᱱᱟᱛᱮ ᱚᱱᱟᱠᱚ ᱫᱚ ᱡᱟᱦᱟᱸ ᱡᱚᱠᱷᱚᱡ ᱠᱷᱟᱹᱞᱤ ᱥᱟᱶ ᱢᱤᱞᱟᱹᱣᱟ।
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ᱵᱟᱭ ᱵᱩᱡᱷᱟᱹᱣ ᱞᱮᱱᱟ। ᱱᱚᱶᱟ ᱫᱚ none, medium, dense, ᱥᱮ ᱠᱷᱟᱹᱞᱤ ᱡᱟᱭᱜᱟ ᱛᱮ ᱟᱞᱜᱟᱣ ᱟᱠᱟᱱ ᱵᱟᱨᱭᱟ ᱫᱷᱟᱱᱟᱛᱢᱚᱠ ᱞᱮᱠᱷᱟ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ, ᱡᱮᱞᱮᱠᱟ grid="1 0.5"। ᱡᱟᱦᱟᱸ ᱡᱟᱞ ᱵᱟᱝ ᱟᱹᱠᱨᱤᱧ ᱞᱮᱱᱟ।

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure ᱩᱫᱩᱜᱤᱡ ᱨᱮ xLabelPosition="left" ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ; right ᱨᱮᱱ ᱪᱟᱞᱟᱠ ᱦᱟᱛᱟᱣᱚᱜᱼᱟ।

prefigure-y-label-position-unsupported = `<graph>`: prefigure ᱩᱫᱩᱜᱤᱡ ᱨᱮ yLabelPosition="bottom" ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ; top ᱨᱮᱱ ᱪᱟᱞᱟᱠ ᱦᱟᱛᱟᱣᱚᱜᱼᱟ।

prefigure-invalid-axis-bounds = `<graph>`: prefigure ᱵᱚᱫᱚᱞ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝ ᱴᱷᱤᱠ ᱟᱠᱷᱚᱨ ᱥᱤᱢᱟ; ᱢᱩᱞ bbox (-10,-10,10,10) ᱦᱟᱛᱟᱣᱚᱜᱼᱟ।

prefigure-invalid-width = `<graph>`: prefigure ᱵᱚᱫᱚᱞ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝ ᱴᱷᱤᱠ ᱚᱥᱟᱨ; ᱢᱩᱞ ᱪᱤᱛᱟᱹᱨ ᱚᱥᱟᱨ 425 ᱦᱟᱛᱟᱣᱚᱜᱼᱟ।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ᱵᱚᱫᱚᱞ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝ ᱴᱷᱤᱠ aspectRatio; ᱢᱩᱞ ᱟᱱᱩᱯᱟᱛ 1 ᱦᱟᱛᱟᱣᱚᱜᱼᱟ।

prefigure-grid-spacing-too-fine = `<graph>`: ᱟᱠᱷᱚᱨ ᱥᱤᱢᱟ ᱞᱟᱹᱜᱤᱫ ᱡᱟᱞ ᱨᱮᱱ ᱛᱟᱞᱟ ᱟᱹᱰᱤ ᱦᱩᱰᱤᱧ; prefigure ᱩᱫᱩᱜᱤᱡ ᱨᱮ ᱡᱟᱞ ᱵᱟᱰᱟᱭᱚᱜᱼᱟ।

prefigure-annotations-not-rendered = `<graph>`: PreFigure ᱩᱫᱩᱜᱤᱡ ᱵᱟᱝ ᱵᱮᱵᱷᱟᱨ ᱠᱷᱟᱱ ᱴᱤᱯᱚᱱᱠᱚ ᱵᱟᱝ ᱟᱹᱠᱨᱤᱧᱚᱜᱼᱟ।

multiple-annotations-children = `<graph>` ᱨᱮ ᱟᱭᱢᱟ `<annotations>` ᱦᱚᱯᱚᱱ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ; ᱢᱩᱪᱟᱹᱫᱟᱜ ᱵᱟᱜᱮ ᱠᱟᱛᱮ ᱡᱚᱛᱚ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।

## Referring to other components

copy-unrecognized-component-type = ᱵᱟᱝ ᱵᱟᱰᱟᱭ ᱦᱟᱹᱴᱤᱧ ᱨᱚᱠᱚᱢ ᱵᱟᱝ ᱯᱟᱥᱱᱟᱣ ᱥᱮ ᱱᱚᱠᱚᱞ ᱦᱩᱭᱩᱜᱼᱟ: { $type }।

copy-prop-not-found = { $component } ᱨᱚᱠᱚᱢ ᱨᱮᱱ ᱦᱟᱹᱴᱤᱧ ᱨᱮ { $property } ᱜᱩᱬ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ

collect-no-source = collect ᱞᱟᱹᱜᱤᱫ ᱡᱟᱦᱟᱸ ᱡᱟᱨᱤ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ।

collect-invalid-component-type = `<{ $component }>` ᱨᱚᱠᱚᱢ ᱨᱮᱱ ᱦᱟᱹᱴᱤᱧ ᱡᱟᱨᱣᱟᱭ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ, ᱪᱮᱫᱟᱜ ᱱᱚᱶᱟ ᱵᱟᱝ ᱴᱷᱤᱠ ᱦᱟᱹᱴᱤᱧ ᱨᱚᱠᱚᱢ ᱠᱟᱱᱟ।

reference-index-unavailable = ᱥᱩᱪᱚᱠᱟᱝᱠᱚ `{ $reference }` ᱩᱫᱩᱜ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ

## `<callAction>`

component-action-unavailable = ᱦᱟᱹᱴᱤᱧ `{ $reference }` ᱨᱮ { $action } ᱵᱟᱝ ᱠᱟᱹᱢᱤᱭᱚᱜᱼᱟ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ᱰᱟᱴᱟ ᱨᱮᱱ ᱨᱩᱯ ᱵᱟᱝ ᱴᱷᱤᱠ ᱠᱟᱱᱟ। ᱥᱟᱨᱤᱠᱚ ᱨᱮᱱ ᱡᱷᱟᱸᱡ ᱵᱟᱭ ᱢᱤᱞᱟᱹᱣᱟ। componentIdx :{ $componentIdx } ᱨᱮ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ

data-frame-duplicate-column-names = ᱰᱟᱴᱟ ᱨᱮ ᱫᱚᱦᱲᱟ ᱟᱠᱟᱱ ᱠᱷᱟᱸᱴ ᱧᱩᱛᱩᱢ ᱢᱮᱱᱟᱜᱼᱟ। componentIdx :{ $componentIdx } ᱨᱮ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ

data-frame-missing-column-name = ᱰᱟᱴᱟ ᱨᱮ ᱢᱤᱫ ᱠᱷᱟᱸᱴ ᱧᱩᱛᱩᱢ ᱵᱟᱹᱱᱩᱜᱼᱟ। componentIdx :{ $componentIdx } ᱨᱮ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ

## `<answer>` and scoring

answer-award-depends-on-own-response = ᱱᱚᱶᱟ ᱛᱮᱞᱟ ᱨᱮᱱ ᱢᱤᱫ award ᱫᱚ ᱱᱚᱶᱟ answer ᱴᱮᱜ ᱨᱮᱱ ᱟᱡ ᱛᱮ ᱠᱩᱞ ᱟᱠᱟᱱ ᱛᱮᱞᱟ ᱨᱮ ᱦᱟᱛᱟᱣ ᱟᱠᱟᱱᱟ, ᱚᱱᱟᱛᱮ ᱵᱟᱝ ᱟᱹᱥᱟ ᱟᱠᱟᱱ ᱪᱟᱞᱟᱠ ᱦᱩᱭᱩᱜᱼᱟ।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` ᱢᱮᱱᱟᱜ ᱠᱚᱴᱷᱟ ᱵᱷᱤᱛᱨᱤ ᱨᱮᱱ `<answer>` ᱨᱮ `maxNumAttempts` ᱮᱢ ᱛᱮ ᱡᱟᱦᱟᱸ ᱠᱟᱹᱢᱤ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ, ᱪᱮᱫᱟᱜ ᱠᱩᱨᱩᱢᱩᱴᱩ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱫᱚ ᱠᱚᱴᱷᱟ ᱴᱷᱟᱹᱣᱠᱟᱹᱭᱮᱫᱼᱟ। `maxNumAttempts` ᱫᱚ ᱠᱚᱴᱷᱟ ᱨᱮ ᱮᱢ ᱢᱮ।

nested-section-wide-check-work-max-num-attempts = ᱮᱴᱟᱜ `sectionWideCheckWork` ᱠᱚᱴᱷᱟ ᱵᱷᱤᱛᱨᱤ ᱨᱮᱱ `sectionWideCheckWork` ᱠᱚᱴᱷᱟ ᱨᱮ `maxNumAttempts` ᱮᱢ ᱛᱮ ᱡᱟᱦᱟᱸ ᱠᱟᱹᱢᱤ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ, ᱪᱮᱫᱟᱜ ᱠᱩᱨᱩᱢᱩᱴᱩ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱫᱚ ᱵᱟᱦᱨᱮᱱ ᱠᱚᱴᱷᱟ ᱴᱷᱟᱹᱣᱠᱟᱹᱭᱮᱫᱼᱟ। `maxNumAttempts` ᱫᱚ ᱵᱟᱦᱨᱮᱱ ᱠᱚᱴᱷᱟ ᱨᱮ ᱮᱢ ᱢᱮ।

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality ᱵᱟᱹᱱᱩᱜ ᱠᱷᱟᱱ { $attributes } ᱜᱩᱬ ᱨᱮᱱ ᱡᱟᱦᱟᱸ ᱠᱟᱹᱢᱤ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ।
        [two] symbolicEquality ᱵᱟᱹᱱᱩᱜ ᱠᱷᱟᱱ { $attributes } ᱜᱩᱬᱠᱤᱱ ᱨᱮᱱ ᱡᱟᱦᱟᱸ ᱠᱟᱹᱢᱤ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ।
       *[other] symbolicEquality ᱵᱟᱹᱱᱩᱜ ᱠᱷᱟᱱ { $attributes } ᱜᱩᱬᱠᱚ ᱨᱮᱱ ᱡᱟᱦᱟᱸ ᱠᱟᱹᱢᱤ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ।
    }

answer-invalid-type = ᱛᱮᱞᱟ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝ ᱴᱷᱤᱠ ᱨᱚᱠᱚᱢ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` ᱦᱟᱹᱴᱤᱧ ᱨᱮᱱ ᱧᱩᱛᱩᱢ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱚᱱᱟᱛᱮ ᱚᱱᱟ ᱫᱚ module ᱜᱩᱬ ᱞᱮᱠᱟᱛᱮ ᱵᱟᱝ ᱵᱮᱵᱷᱟᱨᱚᱜᱼᱟ

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` ᱦᱟᱹᱴᱤᱧ ᱫᱚ module ᱨᱮᱱ ᱜᱩᱬ ᱞᱮᱠᱟᱛᱮ ᱵᱟᱝ ᱵᱮᱵᱷᱟᱨᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ `<module>` ᱦᱟᱹᱴᱤᱧ ᱨᱚᱠᱚᱢ ᱨᱮ "{ $name }" ᱜᱩᱬ ᱢᱟᱲᱟᱝ ᱠᱷᱚᱱᱟᱜ ᱴᱷᱟᱹᱣᱠᱟᱹ ᱟᱠᱟᱱᱟ।

conditional-content-condition-ignored = case ᱥᱮ else ᱦᱚᱯᱚᱱ ᱢᱮᱱᱟᱜ `<conditionalContent>` ᱦᱟᱹᱴᱤᱧ ᱨᱮ `condition` ᱜᱩᱬ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।

slider-markers-type-mismatch = ᱪᱤᱱᱦᱟᱹ ᱨᱮᱱ ᱨᱚᱠᱚᱢ ᱫᱚ slider ᱨᱮᱱ ᱨᱚᱠᱚᱢ ᱥᱟᱶ ᱵᱟᱭ ᱢᱤᱞᱟᱹᱣᱟ।

pretzel-problem-needs-statement-and-answer = ᱵᱟᱝ ᱴᱷᱤᱠ pretzel: ᱢᱤᱫ ᱢᱤᱫ `<problem>` ᱨᱮ ᱢᱤᱫ `<statement>` ᱟᱨ ᱢᱤᱫ `<answer>` ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ।

pretzel-circuit-first-problem-distractor = ᱵᱟᱝ ᱴᱷᱤᱠ pretzel: mode="circuit" ᱨᱮ ᱯᱩᱭᱞᱩ `<problem>` ᱫᱚ ᱵᱷᱩᱞ ᱟᱹᱠᱩᱭᱤᱡ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ।

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` ᱜᱩᱬ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝ ᱴᱷᱤᱠ ᱜᱚᱱᱚᱝ { $values }; ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।
        [two] `{ $attribute }` ᱜᱩᱬ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝ ᱴᱷᱤᱠ ᱜᱚᱱᱚᱝᱠᱤᱱ { $values }; ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।
       *[other] `{ $attribute }` ᱜᱩᱬ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝ ᱴᱷᱤᱠ ᱜᱚᱱᱚᱝᱠᱚ { $values }; ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।
    }

attribute-must-be-references = `{ $attribute }` ᱜᱩᱬ ᱞᱟᱹᱜᱤᱫ `{ $value }` ᱫᱚ ᱵᱟᱝ ᱴᱷᱤᱠ ᱜᱚᱱᱚᱝ ᱠᱟᱱᱟ। ᱜᱩᱬ ᱫᱚ `$` ᱛᱮ ᱮᱛᱦᱚᱵ ᱟᱠᱟᱱ ᱛᱟᱞᱟ ᱛᱮ ᱛᱮᱭᱟᱨ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ।

math-input-invalid-function-names = <mathInput>: { $attribute } ᱨᱮ ᱵᱟᱝ ᱴᱷᱤᱠ ᱯᱷᱚᱞᱚᱱ ᱧᱩᱛᱩᱢ ᱵᱟᱝ ᱧᱮᱞ ᱞᱮᱱᱟ: { $names }। ᱢᱤᱫ ᱢᱤᱫ ᱧᱩᱛᱩᱢ ᱨᱮᱱ ᱩᱫᱩᱜ ᱦᱟᱹᱴᱤᱧ ᱨᱮ ᱠᱚᱢ ᱛᱮ ᱠᱚᱢ ᱵᱟᱨᱭᱟ ᱟᱠᱷᱚᱨ (ᱟᱠᱷᱚᱨ ᱥᱮ ᱡᱚᱲᱟᱣ ᱪᱤᱱᱦᱟᱹ) ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ; ᱚᱱᱟ ᱛᱟᱭᱚᱢ `|<mathspeak alternative>` ᱥᱮᱞᱮᱫ ᱦᱩᱭᱩᱜᱼᱟ।

## Building components from the source

component-type-invalid = ᱵᱟᱝ ᱴᱷᱤᱠ ᱦᱟᱹᱴᱤᱧ ᱨᱚᱠᱚᱢ: `<{ $componentType }>`

attribute-repeated = { $attribute } ᱜᱩᱬ ᱫᱚᱦᱲᱟ ᱵᱟᱝ ᱮᱢᱚᱜᱼᱟ।

attribute-invalid-for-component = `<{ $componentType }>` ᱨᱚᱠᱚᱢ ᱨᱮᱱ ᱦᱟᱹᱴᱤᱧ ᱞᱟᱹᱜᱤᱫ "{ $attribute }" ᱜᱩᱬ ᱵᱟᱝ ᱴᱷᱤᱠ ᱠᱟᱱᱟ।

## Style definition contrast

style-definition-insufficient-contrast =
    ᱥᱟᱡᱟᱣ ᱵᱟᱛᱟᱣ { $styleNumber } ᱨᱮ { $context ->
        [text-on-background] ᱛᱟᱭᱚᱢ ᱨᱚᱝ ᱥᱟᱢᱟᱝ ᱨᱮ ᱚᱞ ᱨᱚᱝ
        [high-contrast] ᱠᱮᱱᱵᱷᱟᱥ ᱥᱟᱢᱟᱝ ᱨᱮ ᱢᱟᱨᱟᱝ ᱛᱮᱥᱟᱨ ᱨᱚᱝ
        [line] ᱠᱮᱱᱵᱷᱟᱥ ᱥᱟᱢᱟᱝ ᱨᱮ ᱜᱟᱨ ᱨᱚᱝ
        [marker] ᱠᱮᱱᱵᱷᱟᱥ ᱥᱟᱢᱟᱝ ᱨᱮ ᱪᱤᱱᱦᱟᱹ ᱨᱚᱝ
       *[text-on-canvas] ᱠᱮᱱᱵᱷᱟᱥ ᱥᱟᱢᱟᱝ ᱨᱮ ᱚᱞ ᱨᱚᱝ
    } ᱞᱟᱹᱜᱤᱫ ᱛᱮᱥᱟᱨ ᱠᱚᱢᱟ{ $mode ->
        [dark] { " (ᱦᱮᱸᱫᱮ ᱢᱚᱰ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ᱠᱚᱢ ᱛᱮ ᱠᱚᱢ { $threshold }:1 ᱞᱟᱹᱠᱛᱤ)।

style-definition-dark-mode-text-background-contrast =
    ᱥᱟᱡᱟᱣ ᱵᱟᱛᱟᱣ { $styleNumber } ᱨᱮᱱ ᱮᱢ ᱟᱠᱟᱱ ᱨᱚᱝᱠᱚ ᱫᱚ ᱯᱩᱸᱰ ᱢᱚᱰ ᱞᱟᱹᱜᱤᱫ ᱛᱮᱥᱟᱨ ᱵᱟᱰᱟᱭ ᱮᱢᱮᱫᱼᱟ ᱨᱮᱦᱚᱸ, ᱚᱱᱟ ᱠᱷᱚᱱ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱ ᱦᱮᱸᱫᱮ ᱢᱚᱰ ᱨᱚᱝ ᱨᱮ ᱛᱟᱭᱚᱢ ᱨᱚᱝ ᱥᱟᱢᱟᱝ ᱨᱮ ᱚᱞ ᱨᱚᱝ ᱨᱮᱱ ᱛᱮᱥᱟᱨ ᱠᱚᱢᱟ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ᱠᱚᱢ ᱛᱮ ᱠᱚᱢ { $threshold }:1 ᱞᱟᱹᱠᱛᱤ)। { $suggestion ->
        [available] ᱦᱮᱸᱫᱮ ᱢᱚᱰ ᱨᱮ ᱛᱮᱥᱟᱨ ᱵᱟᱰᱟᱭ ᱞᱟᱹᱜᱤᱫ ᱥᱮ ᱯᱩᱸᱰ ᱢᱚᱰ ᱨᱮᱱ ᱛᱮᱥᱟᱨ ᱵᱟᱲᱦᱟᱣ ᱢᱮ (ᱡᱮᱞᱮᱠᱟ { $lightAttribute }="{ $lightColor }"), ᱥᱮ ᱦᱮᱸᱫᱮ ᱢᱚᱰ ᱨᱮᱱ ᱨᱚᱝ ᱟᱢᱟᱜ ᱛᱮ ᱮᱢ ᱢᱮ (ᱡᱮᱞᱮᱠᱟ { $darkAttribute }="{ $darkColor }")।
       *[none] ᱦᱮᱸᱫᱮ ᱢᱚᱰ ᱨᱮ ᱛᱮᱥᱟᱨ ᱵᱟᱰᱟᱭ ᱞᱟᱹᱜᱤᱫ ᱯᱩᱸᱰ ᱢᱚᱰ ᱨᱮᱱ ᱛᱮᱥᱟᱨ ᱵᱟᱲᱦᱟᱣ ᱢᱮ, ᱥᱮ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱ ᱨᱚᱝᱠᱚ ᱫᱚ textColorDarkMode ᱟᱨ/ᱥᱮ backgroundColorDarkMode ᱛᱮ ᱟᱢᱟᱜ ᱛᱮ ᱮᱢ ᱢᱮ।
    }

style-definition-dark-mode-text-canvas-contrast =
    ᱥᱟᱡᱟᱣ ᱵᱟᱛᱟᱣ { $styleNumber } ᱨᱮᱱ ᱮᱢ ᱟᱠᱟᱱ ᱚᱞ ᱨᱚᱝ ᱫᱚ ᱯᱩᱸᱰ ᱢᱚᱰ ᱞᱟᱹᱜᱤᱫ ᱛᱮᱥᱟᱨ ᱵᱟᱰᱟᱭ ᱮᱢᱮᱫᱼᱟ ᱨᱮᱦᱚᱸ, ᱚᱱᱟ ᱠᱷᱚᱱ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱ ᱦᱮᱸᱫᱮ ᱢᱚᱰ ᱚᱞ ᱨᱚᱝ ᱨᱮᱱ ᱠᱮᱱᱵᱷᱟᱥ ᱥᱟᱢᱟᱝ ᱨᱮᱱ ᱛᱮᱥᱟᱨ ᱠᱚᱢᱟ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ᱠᱚᱢ ᱛᱮ ᱠᱚᱢ { $threshold }:1 ᱞᱟᱹᱠᱛᱤ)। { $suggestion ->
        [available] ᱦᱮᱸᱫᱮ ᱢᱚᱰ ᱨᱮ ᱛᱮᱥᱟᱨ ᱵᱟᱰᱟᱭ ᱞᱟᱹᱜᱤᱫ ᱥᱮ ᱯᱩᱸᱰ ᱢᱚᱰ ᱨᱮᱱ ᱛᱮᱥᱟᱨ ᱵᱟᱲᱦᱟᱣ ᱢᱮ (ᱡᱮᱞᱮᱠᱟ textColor="{ $lightColor }"), ᱥᱮ ᱦᱮᱸᱫᱮ ᱢᱚᱰ ᱨᱮᱱ ᱨᱚᱝ ᱟᱢᱟᱜ ᱛᱮ ᱮᱢ ᱢᱮ (ᱡᱮᱞᱮᱠᱟ textColorDarkMode="{ $darkColor }")।
       *[none] ᱦᱮᱸᱫᱮ ᱢᱚᱰ ᱨᱮ ᱛᱮᱥᱟᱨ ᱵᱟᱰᱟᱭ ᱞᱟᱹᱜᱤᱫ ᱯᱩᱸᱰ ᱢᱚᱰ ᱨᱮᱱ ᱛᱮᱥᱟᱨ ᱵᱟᱲᱦᱟᱣ ᱢᱮ, ᱥᱮ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱ ᱨᱚᱝ ᱫᱚ textColorDarkMode ᱛᱮ ᱟᱢᱟᱜ ᱛᱮ ᱮᱢ ᱢᱮ।
    }

section-multiple-style-palettes = ᱢᱤᱫ ᱠᱷᱚᱸᱰ ᱫᱚ ᱢᱤᱫ ᱮᱠᱮᱱ <stylePalette> ᱵᱟᱪᱷᱟᱣ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ; ᱢᱩᱪᱟᱹᱫᱟᱜ ᱦᱟᱛᱟᱣᱚᱜᱼᱟ।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } ᱨᱮᱱ ᱮᱠᱮᱱᱟᱜ ᱨᱚᱠᱚᱢ ᱵᱟᱭ ᱴᱷᱟᱹᱣᱠᱟᱹᱭᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ numToSelect ᱫᱚ ᱵᱟᱝ ᱨᱤᱬᱟᱹᱛᱢᱚᱠ ᱯᱩᱨᱟᱹᱱᱟᱝᱠᱚ ᱵᱟᱝ ᱠᱟᱱᱟ।

variant-num-to-select-not-constant-number = { $component } ᱨᱮᱱ ᱮᱠᱮᱱᱟᱜ ᱨᱚᱠᱚᱢ ᱵᱟᱭ ᱴᱷᱟᱹᱣᱠᱟᱹᱭᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ numToSelect ᱫᱚ ᱛᱷᱤᱨ ᱞᱮᱠᱷᱟ ᱵᱟᱝ ᱠᱟᱱᱟ।

variant-with-replacement-not-constant-boolean = { $component } ᱨᱮᱱ ᱮᱠᱮᱱᱟᱜ ᱨᱚᱠᱚᱢ ᱵᱟᱭ ᱴᱷᱟᱹᱣᱠᱟᱹᱭᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ withReplacement ᱫᱚ ᱛᱷᱤᱨ ᱵᱩᱞᱤᱭᱟᱱ ᱵᱟᱝ ᱠᱟᱱᱟ।

variant-select-weight-disables-unique = ᱡᱩᱫᱤ ᱡᱟᱦᱟᱸ ᱵᱟᱪᱷᱟᱣ ᱨᱮ selectWeight ᱥᱮ selectForVariants ᱮᱢ ᱟᱠᱟᱱᱟ ᱠᱷᱟᱱ select ᱨᱮᱱ ᱮᱠᱮᱱᱟᱜ ᱨᱚᱠᱚᱢ ᱵᱚᱸᱫ ᱦᱩᱭᱩᱜᱼᱟ

variant-coprime-undetermined = { $component } ᱨᱮᱱ ᱮᱠᱮᱱᱟᱜ ᱨᱚᱠᱚᱢ ᱵᱟᱭ ᱴᱷᱟᱹᱣᱠᱟᱹᱭᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ coprime ᱫᱚ ᱡᱟᱦᱟᱸ ᱡᱚᱠᱷᱚᱡ ᱵᱟᱝ ᱥᱟᱨᱤ ᱠᱟᱱᱟ ᱚᱱᱟ ᱵᱟᱭ ᱴᱷᱟᱹᱣᱠᱟᱹᱭ ᱞᱮᱱᱟ।

variant-attribute-not-constant = { $component } ᱨᱮᱱ ᱮᱠᱮᱱᱟᱜ ᱨᱚᱠᱚᱢ ᱵᱟᱭ ᱴᱷᱟᱹᱣᱠᱟᱹᱭᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ { $attribute } ᱫᱚ ᱛᱷᱤᱨ ᱵᱟᱝ ᱠᱟᱱᱟ।

variant-attribute-not-number = { $component } ᱨᱮᱱ ᱮᱠᱮᱱᱟᱜ ᱨᱚᱠᱚᱢ ᱵᱟᱭ ᱴᱷᱟᱹᱣᱠᱟᱹᱭᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ { $attribute } ᱫᱚ ᱞᱮᱠᱷᱟ ᱵᱟᱝ ᱠᱟᱱᱟ।

variant-attribute-wrong-type-for-sequence =
    { $type } ᱨᱚᱠᱚᱢ ᱨᱮᱱ { $component } ᱨᱮᱱ ᱮᱠᱮᱱᱟᱜ ᱨᱚᱠᱚᱢ ᱵᱟᱭ ᱴᱷᱟᱹᱣᱠᱟᱹᱭᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ { $attribute } ᱫᱚ { $expected ->
        [letters-combination] ᱟᱠᱷᱚᱨ ᱡᱚᱛᱚ
        [math-expression] ᱴᱷᱤᱠ ᱜᱟᱱᱤᱛ ᱠᱟᱛᱷᱟ
        [integer] ᱯᱩᱨᱟᱹᱱᱟᱝᱠᱚ
       *[number] ᱞᱮᱠᱷᱟ
    } ᱵᱟᱝ ᱠᱟᱱᱟ।

variant-length-not-integer = { $component } ᱨᱮᱱ ᱮᱠᱮᱱᱟᱜ ᱨᱚᱠᱚᱢ ᱵᱟᱭ ᱴᱷᱟᱹᱣᱠᱟᱹᱭᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ length ᱫᱚ ᱯᱩᱨᱟᱹᱱᱟᱝᱠᱚ ᱵᱟᱝ ᱠᱟᱱᱟ।

variant-sort-not-implemented = sort ᱢᱮᱱᱟᱜ { $component } ᱨᱮᱱ ᱮᱠᱮᱱᱟᱜ ᱨᱚᱠᱚᱢ ᱱᱤᱛ ᱦᱟᱹᱵᱤᱡ ᱵᱟᱝ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱᱟ

variant-exclude-combinations-not-implemented = excludeCombinations ᱢᱮᱱᱟᱜ { $component } ᱨᱮᱱ ᱮᱠᱮᱱᱟᱜ ᱨᱚᱠᱚᱢ ᱱᱤᱛ ᱦᱟᱹᱵᱤᱡ ᱵᱟᱝ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱᱟ

variant-math-exclude-not-implemented = exclude ᱢᱮᱱᱟᱜ math ᱨᱚᱠᱚᱢ ᱨᱮᱱ { $component } ᱨᱮᱱ ᱮᱠᱮᱱᱟᱜ ᱨᱚᱠᱚᱢ ᱱᱤᱛ ᱦᱟᱹᱵᱤᱡ ᱵᱟᱝ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱᱟ

variant-non-constant-exclude-not-implemented = ᱵᱟᱝ ᱛᱷᱤᱨ exclude ᱢᱮᱱᱟᱜ { $component } ᱨᱮᱱ ᱮᱠᱮᱱᱟᱜ ᱨᱚᱠᱚᱢ ᱱᱤᱛ ᱦᱟᱹᱵᱤᱡ ᱵᱟᱝ ᱛᱮᱭᱟᱨ ᱟᱠᱟᱱᱟ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure ᱩᱫᱩᱜᱤᱡ ᱨᱮ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ; ᱦᱚᱯᱚᱱ ᱵᱟᱜᱮᱱᱟ।

prefigure-descendant-invalid-geometry = { $subject }: ᱵᱟᱝ ᱥᱤᱢᱟᱱᱟᱜ ᱥᱮ ᱵᱟᱝ ᱯᱩᱨᱟᱹᱣ ᱡᱟᱭᱢᱤᱛᱤ; ᱦᱚᱯᱚᱱ ᱵᱟᱜᱮᱱᱟ।

prefigure-curve-label-omitted = { $subject }: ᱵᱚᱫᱚᱞ ᱟᱠᱟᱱ ᱠᱚᱸᱰᱚᱲ ᱦᱟᱹᱴᱤᱧ ᱨᱮ ᱧᱩᱛᱩᱢ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ; ᱧᱩᱛᱩᱢ ᱵᱟᱜᱮᱱᱟ।

prefigure-curve-unsupported-definition-type = { $subject }: ᱠᱚᱸᱰᱚᱲ ᱯᱷᱚᱞᱚᱱ ᱵᱟᱛᱟᱣ ᱨᱚᱠᱚᱢ '{ $definitionType }' ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ; ᱦᱚᱯᱚᱱ ᱵᱟᱜᱮᱱᱟ।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves ᱨᱮ flipFunctions ᱜᱩᱬ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ; ᱦᱚᱯᱚᱱ ᱵᱟᱜᱮᱱᱟ।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves ᱨᱮ ᱮᱠᱮᱱ formula ᱨᱚᱠᱚᱢ ᱨᱮᱱ ᱦᱚᱯᱚᱱ ᱯᱷᱚᱞᱚᱱ ᱦᱩᱭᱩᱜᱼᱟ; ᱦᱚᱯᱚᱱ ᱵᱟᱜᱮᱱᱟ।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] ᱜᱟᱨ ᱜᱷᱟᱨᱚᱸᱡ ᱨᱮᱱ ᱧᱩᱛᱩᱢ
       *[point] ᱴᱩᱰᱟᱹᱜ ᱧᱩᱛᱩᱢ
    } ᱞᱟᱹᱜᱤᱫ labelPosition '{ $labelPosition }' ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ; ᱢᱩᱞ PreFigure ᱥᱟᱡᱟᱣ ᱦᱟᱛᱟᱣᱮᱱᱟ।

prefigure-fill-style-unsupported = { $subject }: ᱯᱮᱨᱮᱡ ᱥᱟᱡᱟᱣ '{ $fillStyle }' ᱫᱚ PreFigure ᱨᱮ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ; ᱴᱷᱚᱥ ᱯᱮᱨᱮᱡ ᱦᱟᱛᱟᱣᱮᱱᱟ।

prefigure-line-style-unknown = { $subject }: ᱵᱟᱝ ᱵᱟᱰᱟᱭ ᱜᱟᱨ ᱥᱟᱡᱟᱣ '{ $lineStyle }' PreFigure ᱚᱰᱚᱠ ᱠᱷᱚᱱ ᱵᱟᱜᱮᱱᱟ।

prefigure-marker-style-mapped-to-diamond = { $subject }: ᱪᱤᱱᱦᱟᱹ ᱥᱟᱡᱟᱣ '{ $markerStyle }' PreFigure ᱨᱮᱱ 'diamond' ᱥᱟᱡᱟᱣ ᱨᱮ ᱵᱚᱫᱚᱞᱮᱱᱟ।

prefigure-marker-style-unsupported = { $subject }: ᱪᱤᱱᱦᱟᱹ ᱥᱟᱡᱟᱣ '{ $markerStyle }' ᱫᱚ PreFigure ᱨᱮ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ; ᱢᱩᱞ ᱥᱟᱡᱟᱣ ᱦᱟᱛᱟᱣᱮᱱᱟ।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ᱵᱟᱝ ᱴᱷᱤᱠ `ref`; ᱞᱟᱠᱷᱟᱹᱭ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ। ᱴᱤᱯᱚᱱ ᱵᱟᱜᱮᱱᱟ।

annotation-ref-multiple-targets = `<annotation>`: `ref` ᱠᱷᱚᱱ ᱟᱭᱢᱟ ᱞᱟᱠᱷᱟᱹᱭ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ; ᱯᱩᱭᱞᱩ ᱞᱟᱠᱷᱟᱹᱭ ᱦᱟᱛᱟᱣᱮᱱᱟ।

annotation-ref-outside-graph = `<annotation>`: ᱵᱟᱝ ᱴᱷᱤᱠ `ref`; ᱞᱟᱠᱷᱟᱹᱭ ᱫᱚ ᱚᱱᱟ graph ᱵᱟᱦᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ। ᱴᱤᱯᱚᱱ ᱵᱟᱜᱮᱱᱟ।

annotation-ref-unsupported-target = `<annotation>`: ᱵᱟᱝ ᱴᱷᱤᱠ `ref`; prefigure ᱵᱚᱫᱚᱞ ᱨᱮ ᱞᱟᱠᱷᱟᱹᱭ ᱫᱚ ᱦᱩᱭᱩᱜ ᱠᱟᱱ ᱟᱞᱮᱠᱷᱤ ᱡᱤᱱᱤᱥ ᱵᱟᱝ ᱠᱟᱱᱟ। ᱴᱤᱯᱚᱱ ᱵᱟᱜᱮᱱᱟ।

annotation-text-missing = `<annotation>`: `text` ᱵᱟᱹᱱᱩᱜᱼᱟ ᱥᱮ ᱠᱷᱟᱹᱞᱤ ᱠᱟᱱᱟ; ᱠᱷᱟᱹᱞᱤ ᱚᱞ ᱮᱢᱮᱱᱟ।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] ᱜᱚᱞ ᱟᱠᱟᱱ ᱦᱟᱛᱟᱣ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ।
       *[other] `<{ $componentType }>` ᱦᱟᱹᱴᱤᱧ ᱥᱟᱶ ᱜᱚᱞ ᱟᱠᱟᱱ ᱦᱟᱛᱟᱣ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ।
    }

reference-no-referent = ᱛᱟᱞᱟ ᱨᱮᱱ ᱡᱟᱦᱟᱸ ᱞᱟᱠᱷᱟᱹᱭ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ: `{ $reference }`

reference-multiple-referents = ᱛᱟᱞᱟ ᱨᱮᱱ ᱟᱭᱢᱟ ᱞᱟᱠᱷᱟᱹᱭ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` ᱨᱮᱱ { $attribute } ᱜᱩᱬ ᱨᱮᱱ ᱵᱟᱝ ᱴᱷᱤᱠ ᱨᱩᱯ।

children-invalid = `<{ $componentType }>` ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝ ᱴᱷᱤᱠ ᱦᱚᱯᱚᱱ: ᱵᱟᱝ ᱴᱷᱤᱠ ᱦᱚᱯᱚᱱ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` ᱜᱩᱬ ᱞᱟᱹᱜᱤᱫ `{ $value }` ᱵᱟᱝ ᱴᱷᱤᱠ ᱜᱚᱱᱚᱝ ᱠᱟᱱᱟ, `{ $default }` ᱜᱚᱱᱚᱝ ᱦᱟᱛᱟᱣᱚᱜᱼᱟ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML ᱵᱷᱟᱨᱥᱚᱱ { $version } ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ।
       *[other] DoenetML ᱵᱷᱟᱨᱥᱚᱱ { $version } ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ। ᱵᱷᱟᱨᱥᱚᱱ { $fallback } ᱦᱟᱛᱟᱣᱚᱜᱼᱟ
    }

## Reading the DoenetML

parse-invalid-doenetml = ᱵᱟᱝ ᱴᱷᱤᱠ DoenetML: { $content }

parse-tag-missing-close-tag = ᱵᱟᱝ ᱴᱷᱤᱠ DoenetML: ᱴᱮᱜ `{ $tag }` ᱨᱮᱱ ᱡᱟᱦᱟᱸ ᱵᱚᱸᱫ ᱴᱮᱜ ᱵᱟᱹᱱᱩᱜᱼᱟ। ᱟᱡ ᱛᱮ ᱵᱚᱸᱫᱚᱜ ᱴᱮᱜ ᱥᱮ `</{ $tagName }>` ᱴᱮᱜ ᱞᱟᱹᱠᱛᱤᱭᱟ।

parse-tag-error = ᱵᱟᱝ ᱴᱷᱤᱠ DoenetML: ᱴᱮᱜ `<{ $tagName }>` ᱨᱮ ᱵᱷᱩᱞ

parse-attribute-missing-value = ᱵᱟᱝ ᱴᱷᱤᱠ DoenetML: ᱵᱟᱝ ᱴᱷᱤᱠ ᱜᱩᱬ `{ $attribute }` ᱨᱮ ᱜᱚᱱᱚᱝ ᱵᱟᱹᱱᱩᱜ ᱞᱮᱠᱟ ᱧᱮᱞᱚᱜ ᱠᱟᱱᱟ।

parse-attribute-invalid = ᱵᱟᱝ ᱴᱷᱤᱠ DoenetML: ᱵᱟᱝ ᱴᱷᱤᱠ ᱜᱩᱬ `{ $attribute }`

parse-attribute-value-invalid = ᱵᱟᱝ ᱴᱷᱤᱠ DoenetML: ᱵᱟᱝ ᱴᱷᱤᱠ ᱜᱩᱬ ᱜᱚᱱᱚᱝ `{ $value }`

parse-attribute-value-quote-mismatch = ᱵᱟᱝ ᱴᱷᱤᱠ DoenetML: ᱵᱟᱝ ᱴᱷᱤᱠ ᱜᱩᱬ ᱜᱚᱱᱚᱝ `{ $value }`। ᱩᱫᱚᱨᱚᱬ ᱪᱤᱱᱦᱟᱹ ᱵᱟᱭ ᱢᱤᱞᱟᱹᱣᱟ। `{ $quote }` ᱵᱟᱹᱱᱩᱜ ᱞᱮᱠᱟ ᱧᱮᱞᱚᱜ ᱠᱟᱱᱟ

parse-open-tag-name-missing = ᱵᱟᱝ ᱴᱷᱤᱠ DoenetML: ᱴᱮᱜ ᱧᱩᱛᱩᱢ ᱵᱟᱝ ᱛᱟᱦᱮᱸᱱ ᱠᱟᱛᱮ ᱴᱮᱜ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ, ᱡᱮᱞᱮᱠᱟ `<`

parse-tag-not-closed = ᱵᱟᱝ ᱴᱷᱤᱠ DoenetML: ᱴᱮᱜ `{ $tag }` ᱵᱟᱝ ᱵᱚᱸᱫ ᱞᱮᱱᱟ (`>` ᱵᱟᱹᱱᱩᱜ ᱞᱮᱠᱟ ᱧᱮᱞᱚᱜ ᱠᱟᱱᱟ)।

parse-self-closing-tag-name-missing = ᱵᱟᱝ ᱴᱷᱤᱠ DoenetML: ᱴᱮᱜ ᱧᱩᱛᱩᱢ ᱵᱟᱝ ᱛᱟᱦᱮᱸᱱ ᱠᱟᱛᱮ ᱴᱮᱜ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ `<{ $content }>`

parse-self-closing-tag-not-closed = ᱵᱟᱝ ᱴᱷᱤᱠ DoenetML: ᱴᱮᱜ `{ $tag }` ᱵᱟᱝ ᱵᱚᱸᱫ ᱞᱮᱱᱟ (`/>` ᱵᱟᱹᱱᱩᱜ ᱞᱮᱠᱟ ᱧᱮᱞᱚᱜ ᱠᱟᱱᱟ)।

parse-tag-invalid-attributes = ᱵᱟᱝ ᱴᱷᱤᱠ DoenetML: ᱴᱮᱜ `{ $tag }` ᱵᱟᱝ ᱴᱷᱤᱠ ᱠᱟᱱᱟ। ᱚᱱᱟ ᱨᱮᱱ ᱜᱩᱬᱠᱚ ᱵᱷᱩᱞ ᱛᱟᱦᱮᱸᱱ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ।

parse-close-tag-name-missing = ᱵᱟᱝ ᱴᱷᱤᱠ DoenetML: ᱴᱮᱜ ᱧᱩᱛᱩᱢ ᱵᱟᱝ ᱛᱟᱦᱮᱸᱱ ᱠᱟᱛᱮ ᱵᱚᱸᱫ ᱴᱮᱜ ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ, ᱡᱮᱞᱮᱠᱟ `</`

parse-attribute-value-unquoted = ᱜᱩᱬ ᱨᱮᱱ ᱜᱚᱱᱚᱝ ᱩᱫᱚᱨᱚᱬ ᱪᱤᱱᱦᱟᱹ ᱛᱟᱞᱟ ᱨᱮ ᱫᱚᱦᱚ ᱞᱟᱹᱠᱛᱤᱭᱟ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = ᱵᱟᱝ ᱴᱷᱤᱠ DoenetML: ᱵᱚᱸᱫ ᱴᱮᱜ `{ $tag }` ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ, ᱢᱮᱱᱠᱷᱟᱱ ᱚᱱᱟ ᱨᱮᱱ ᱡᱟᱦᱟᱸ ᱮᱛᱦᱚᱵ ᱴᱮᱜ ᱵᱟᱹᱱᱩᱜᱼᱟ

parse-close-tag-mismatched = ᱵᱟᱝ ᱴᱷᱤᱠ DoenetML: ᱵᱚᱸᱫ ᱴᱮᱜ ᱵᱟᱭ ᱢᱤᱞᱟᱹᱣᱟ। `</{ $expected }>` ᱞᱟᱹᱠᱛᱤ ᱛᱟᱦᱮᱸᱱ ᱠᱟᱱᱟ। `{ $found }` ᱧᱟᱢ ᱦᱩᱭᱮᱱᱟ

parser-node-unconvertible = ᱱᱚᱰ { $node } ᱫᱚ Dast ᱱᱚᱰ ᱨᱮ ᱵᱟᱭ ᱵᱚᱫᱚᱞ ᱞᱮᱱᱟ।

## Names

name-attribute-invalid =
    ᱵᱟᱝ ᱴᱷᱤᱠ ᱜᱩᱬ name='{ $name }'। { $reason ->
        [characters] ᱧᱩᱛᱩᱢ ᱨᱮ ᱮᱠᱮᱱ ᱟᱠᱷᱚᱨ, ᱞᱮᱠᱷᱟ, ᱞᱟᱛᱟᱨ ᱜᱟᱨ ᱥᱮ ᱡᱚᱲᱟᱣ ᱪᱤᱱᱦᱟᱹ ᱛᱟᱦᱮᱸᱱ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ।
       *[start] ᱧᱩᱛᱩᱢ ᱫᱚ ᱟᱠᱷᱚᱨ ᱛᱮ ᱮᱛᱦᱚᱵ ᱞᱟᱹᱠᱛᱤᱭᱟ।
    }

component-name-invalid-start = ᱵᱟᱝ ᱴᱷᱤᱠ ᱦᱟᱹᱴᱤᱧ ᱧᱩᱛᱩᱢ "{ $name }"। ᱧᱩᱛᱩᱢ ᱫᱚ ᱟᱠᱷᱚᱨ ᱛᱮ ᱮᱛᱦᱚᱵ ᱞᱟᱹᱠᱛᱤᱭᱟ।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched ᱨᱚᱠᱚᱢ ᱨᱮᱱ ᱛᱮᱞᱟ ᱨᱮ video ᱜᱩᱬ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ

answer-video-watched-video-not-reference = videoWatched ᱨᱚᱠᱚᱢ ᱨᱮᱱ ᱛᱮᱞᱟ ᱨᱮᱱ video ᱜᱩᱬ ᱫᱚ ᱢᱤᱫ ᱛᱟᱞᱟ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ

answer-name-not-single-text = ᱛᱮᱞᱟ ᱨᱮᱱ name ᱜᱩᱬ ᱨᱮ ᱮᱠᱮᱱ ᱢᱤᱫ ᱚᱞ ᱦᱚᱯᱚᱱ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ

## Referencing another document

external-doenetml-recursion-limit = ᱟᱹᱰᱤ ᱟᱭᱢᱟ ᱛᱷᱟᱠ ᱨᱮᱱ ᱫᱚᱦᱲᱟ ᱛᱮ ᱵᱟᱦᱨᱮᱱ DoenetML ᱵᱟᱭ ᱟᱜᱩ ᱞᱮᱱᱟ। ᱚᱠᱟ ᱦᱚᱸ ᱜᱚᱞ ᱟᱠᱟᱱ ᱛᱟᱞᱟ ᱢᱮᱱᱟᱜᱼᱟ ᱥᱮ?

external-doenetml-unavailable = { $attribute }="{ $uri }" ᱠᱷᱚᱱ DoenetML ᱵᱟᱭ ᱟᱜᱩ ᱞᱮᱱᱟ

external-doenetml-type-mismatch = { $attribute }="{ $uri }" ᱠᱷᱚᱱ ᱟᱜᱩ ᱟᱠᱟᱱ DoenetML ᱵᱟᱝ ᱴᱷᱤᱠ ᱠᱟᱱᱟ: ᱱᱚᱶᱟ ᱫᱚ "{ $componentType }" ᱦᱟᱹᱴᱤᱧ ᱨᱚᱠᱚᱢ ᱥᱟᱶ ᱵᱟᱭ ᱢᱤᱞᱟᱹᱣ ᱞᱮᱱᱟ

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] ᱜᱩᱬ `{ $from }` ᱵᱟᱜᱤ ᱟᱠᱟᱱᱟ; ᱚᱱᱟ ᱵᱚᱫᱚᱞ ᱨᱮ `{ $to }` ᱵᱮᱵᱷᱟᱨ ᱢᱮ।
       *[other] [deprecation] `<{ $component }>` ᱨᱮ ᱜᱩᱬ `{ $from }` ᱵᱟᱜᱤ ᱟᱠᱟᱱᱟ; ᱚᱱᱟ ᱵᱚᱫᱚᱞ ᱨᱮ `{ $to }` ᱵᱮᱵᱷᱟᱨ ᱢᱮ।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] ᱜᱩᱬ `{ $from }` ᱵᱟᱜᱤ ᱟᱠᱟᱱᱟ ᱟᱨ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ `{ $to }` ᱦᱚᱸ ᱮᱢ ᱟᱠᱟᱱᱟ।
       *[other] [deprecation] `<{ $component }>` ᱨᱮ ᱜᱩᱬ `{ $from }` ᱵᱟᱜᱤ ᱟᱠᱟᱱᱟ ᱟᱨ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ, ᱪᱮᱫᱟᱜ `{ $to }` ᱦᱚᱸ ᱮᱢ ᱟᱠᱟᱱᱟ।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` ᱨᱮ ᱜᱩᱬ `{ $attribute }` ᱵᱟᱜᱤ ᱟᱠᱟᱱᱟ ᱟᱨ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ।

deprecated-attribute-to-child = [deprecation] `<{ $component }>` ᱨᱮ ᱜᱩᱬ `{ $attribute }` ᱵᱟᱜᱤ ᱟᱠᱟᱱᱟ; ᱚᱱᱟ ᱵᱚᱫᱚᱞ ᱨᱮ `<{ $child }>` ᱦᱚᱯᱚᱱ ᱵᱮᱵᱷᱟᱨ ᱢᱮ।

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` ᱨᱮ ᱜᱩᱬ `{ $attribute }` ᱨᱮᱱ ᱜᱚᱱᱚᱝ `{ $value }` ᱵᱟᱜᱤ ᱟᱠᱟᱱᱟ; ᱚᱱᱟ ᱵᱚᱫᱚᱞ ᱨᱮ `{ $to }` ᱵᱮᱵᱷᱟᱨ ᱢᱮ।


## Language coverage

pluralize-english-only = `<pluralize>` ᱫᱚ ᱮᱠᱮᱱ ᱤᱝᱜᱨᱟᱡᱤ ᱨᱮᱱ ᱟᱭᱢᱟ ᱨᱩᱯ ᱛᱮᱭᱟᱨ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ, ᱚᱱᱟᱛᱮ { $locale } ᱨᱮ ᱚᱞ ᱟᱠᱟᱱ ᱫᱟᱞᱤᱞ ᱨᱮ ᱚᱱᱟ ᱨᱮᱱ ᱚᱞ ᱵᱟᱝ ᱵᱚᱫᱚᱞᱚᱜᱼᱟ। ᱟᱭᱢᱟ ᱨᱩᱯ ᱥᱟᱡᱟᱣ ᱛᱮ ᱚᱞ ᱢᱮ, ᱥᱮ `pluralForm` ᱜᱩᱬ ᱛᱮ ᱮᱢ ᱢᱮ।


## Checking against the schema

schema-element-unrecognized = ᱦᱟᱹᱴᱤᱧ `<{ $tag }>` ᱫᱚ ᱵᱟᱰᱟᱭ ᱟᱠᱟᱱ Doenet ᱦᱟᱹᱴᱤᱧ ᱵᱟᱝ ᱠᱟᱱᱟ।

schema-element-not-allowed-at-root = ᱦᱟᱹᱴᱤᱧ `<{ $tag }>` ᱫᱚ ᱫᱟᱞᱤᱞ ᱨᱮᱱ ᱢᱩᱲ ᱨᱮ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ।

schema-element-not-allowed-inside = ᱦᱟᱹᱴᱤᱧ `<{ $tag }>` ᱫᱚ `<{ $parent }>` ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ।

schema-attribute-unrecognized = ᱦᱟᱹᱴᱤᱧ `<{ $tag }>` ᱨᱮ `{ $attribute }` ᱧᱩᱛᱩᱢᱟᱱ ᱡᱟᱦᱟᱸ ᱜᱩᱬ ᱵᱟᱹᱱᱩᱜᱼᱟ।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] ᱦᱟᱹᱴᱤᱧ `<{ $tag }>` ᱨᱮᱱ `{ $attribute }` ᱜᱩᱬ ᱫᱚ ᱚᱱᱟ ᱞᱤᱥᱴᱤ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ ᱡᱟᱦᱟᱸ ᱨᱮᱱ ᱢᱤᱫ ᱢᱤᱫ ᱡᱤᱱᱤᱥ ᱱᱚᱶᱟᱠᱚ ᱠᱷᱚᱱ ᱢᱤᱫ ᱠᱟᱱᱟ: { $allowed }
       *[other] ᱦᱟᱹᱴᱤᱧ `<{ $tag }>` ᱨᱮᱱ `{ $attribute }` ᱜᱩᱬ ᱫᱚ ᱱᱚᱶᱟᱠᱚ ᱠᱷᱚᱱ ᱢᱤᱫ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝ ᱴᱷᱤᱠ ᱨᱚᱠᱚᱢ ᱧᱩᱛᱩᱢ। ᱨᱚᱠᱚᱢ ᱧᱩᱛᱩᱢ { $variantName } ᱫᱚ { $numOptions } ᱵᱟᱪᱷᱟᱣ ᱨᱮ ᱦᱮᱡ ᱠᱟᱱᱟ ᱢᱮᱱᱠᱷᱟᱱ ᱵᱟᱪᱷᱟᱣ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱫᱚ { $numToSelect } ᱠᱟᱱᱟ।

select-variant-name-without-options = select ᱞᱟᱹᱜᱤᱫ ᱛᱤᱱᱟᱹᱜ ᱨᱚᱠᱚᱢ ᱮᱢ ᱟᱠᱟᱱᱟ ᱢᱮᱱᱠᱷᱟᱱ ᱦᱩᱭᱩᱜ ᱠᱟᱱ ᱨᱚᱠᱚᱢ ᱧᱩᱛᱩᱢ { $variantName } ᱞᱟᱹᱜᱤᱫ ᱡᱟᱦᱟᱸ ᱵᱟᱪᱷᱟᱣ ᱵᱟᱝ ᱮᱢ ᱟᱠᱟᱱᱟ।

select-variant-name-not-possible = select ᱞᱟᱹᱜᱤᱫ ᱮᱢ ᱟᱠᱟᱱ ᱨᱚᱠᱚᱢ ᱧᱩᱛᱩᱢ { $variantName } ᱫᱚ ᱦᱩᱭᱩᱜ ᱠᱟᱱ ᱨᱚᱠᱚᱢ ᱧᱩᱛᱩᱢ ᱵᱟᱝ ᱠᱟᱱᱟ।

select-too-few-options = ᱮᱠᱮᱱ { $numOptions } ᱠᱷᱚᱱ { $numToSelect } ᱦᱟᱹᱴᱤᱧ ᱵᱟᱝ ᱵᱟᱪᱷᱟᱣᱚᱜᱼᱟ।

select-from-sequence-too-few-values = { $length } ᱡᱷᱟᱸᱡ ᱨᱮᱱ ᱚᱱᱩᱠᱨᱚᱢ ᱠᱷᱚᱱ { $numToSelect } ᱜᱚᱱᱚᱝ ᱵᱟᱝ ᱵᱟᱪᱷᱟᱣᱚᱜᱼᱟ।

select-from-sequence-indices-count-mismatch = select ᱞᱟᱹᱜᱤᱫ ᱮᱢ ᱟᱠᱟᱱ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱫᱚ ᱵᱟᱪᱷᱟᱣ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱥᱟᱶ ᱢᱤᱞᱟᱹᱣ ᱞᱟᱹᱠᱛᱤᱭᱟ

select-from-sequence-indices-not-integers = select ᱞᱟᱹᱜᱤᱫ ᱮᱢ ᱟᱠᱟᱱ ᱡᱚᱛᱚ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ ᱫᱚ ᱯᱩᱨᱟᱹᱱᱟᱝᱠᱚ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ

select-from-sequence-index-excluded = selectfromsequence ᱨᱮᱱ ᱮᱢ ᱟᱠᱟᱱ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ ᱫᱚ ᱵᱟᱜᱤ ᱟᱠᱟᱱ ᱛᱟᱦᱮᱸᱱ ᱠᱟᱱᱟ

select-from-sequence-indices-excluded-combination = selectfromsequence ᱨᱮᱱ ᱮᱢ ᱟᱠᱟᱱ ᱥᱩᱪᱚᱠᱟᱝᱠᱚ ᱫᱚ ᱵᱟᱜᱤ ᱟᱠᱟᱱ ᱡᱚᱛᱚ ᱛᱟᱦᱮᱸᱱ ᱠᱟᱱᱟ

select-from-sequence-coprime-not-positive-integers = ᱫᱷᱟᱱᱟᱛᱢᱚᱠ ᱯᱩᱨᱟᱹᱱᱟᱝᱠᱚ ᱵᱟᱝ ᱵᱟᱪᱷᱟᱣᱚᱜ ᱠᱟᱱᱟ, ᱚᱱᱟᱛᱮ ᱥᱚᱦ-ᱚᱵᱷᱟᱡᱭᱚ ᱡᱚᱛᱚ ᱵᱟᱝ ᱵᱟᱪᱷᱟᱣᱚᱜᱼᱟ।

select-from-sequence-coprime-common-factor = ᱥᱚᱦ-ᱚᱵᱷᱟᱡᱭᱚ ᱞᱮᱠᱷᱟ ᱵᱟᱝ ᱵᱟᱪᱷᱟᱣᱚᱜᱼᱟ। ᱡᱚᱛᱚ ᱦᱩᱭᱩᱜ ᱠᱟᱱ ᱜᱚᱱᱚᱝ ᱨᱮᱱ ᱢᱤᱫ ᱥᱟᱸᱡᱟ ᱜᱩᱬᱚᱱᱠᱷᱚᱸᱰ ᱢᱮᱱᱟᱜᱼᱟ। ("from" ᱥᱮ "to" ᱨᱮᱱ ᱮᱢ ᱟᱠᱟᱱ ᱜᱚᱱᱚᱝ ᱫᱚ "step" ᱥᱟᱶ ᱥᱚᱦ-ᱚᱵᱷᱟᱡᱭᱚ ᱦᱩᱭ ᱞᱟᱹᱠᱛᱤᱭᱟ।)

select-from-sequence-coprime-single-number = 1 ᱵᱟᱝ ᱛᱟᱦᱮᱸᱱ ᱠᱟᱱ ᱢᱤᱫ ᱮᱠᱞᱟ ᱞᱮᱠᱷᱟ ᱠᱷᱚᱱ ᱥᱚᱦ-ᱚᱵᱷᱟᱡᱭᱚ ᱡᱚᱛᱚ ᱵᱟᱝ ᱵᱟᱪᱷᱟᱣᱚᱜᱼᱟ।

select-from-sequence-excluded-too-many-combinations = selectFromSequence ᱨᱮ 70% ᱠᱷᱚᱱ ᱟᱭᱢᱟ ᱡᱚᱛᱚ ᱵᱟᱜᱤ ᱟᱠᱟᱱᱟ

select-from-sequence-coprime-none-found = ᱥᱚᱦ-ᱚᱵᱷᱟᱡᱭᱚ ᱞᱮᱠᱷᱟ ᱵᱟᱝ ᱵᱟᱪᱷᱟᱣ ᱞᱮᱱᱟ। ᱡᱚᱛᱚ ᱦᱩᱭᱩᱜ ᱠᱟᱱ ᱜᱚᱱᱚᱝ ᱨᱮᱱ ᱢᱤᱫ ᱥᱟᱸᱡᱟ ᱜᱩᱬᱚᱱᱠᱷᱚᱸᱰ ᱢᱮᱱᱟᱜᱼᱟ।

select-from-sequence-too-few-unique-values = { $numPossibleValues } ᱡᱷᱟᱸᱡ ᱨᱮᱱ ᱚᱱᱩᱠᱨᱚᱢ ᱠᱷᱚᱱ { $numToSelect } ᱮᱠᱮᱱᱟᱜ ᱜᱚᱱᱚᱝ ᱵᱟᱝ ᱵᱟᱪᱷᱟᱣᱚᱜᱼᱟ

select-prime-numbers-too-few-values = { $numValues } ᱡᱷᱟᱸᱡ ᱨᱮᱱ ᱚᱵᱷᱟᱡᱭᱚ ᱞᱮᱠᱷᱟ ᱞᱤᱥᱴᱤ ᱠᱷᱚᱱ { $numToSelect } ᱜᱚᱱᱚᱝ ᱵᱟᱝ ᱵᱟᱪᱷᱟᱣᱚᱜᱼᱟ

select-prime-numbers-values-count-mismatch = select ᱞᱟᱹᱜᱤᱫ ᱮᱢ ᱟᱠᱟᱱ ᱜᱚᱱᱚᱝ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱫᱚ ᱵᱟᱪᱷᱟᱣ ᱨᱮᱱ ᱞᱮᱠᱷᱟ ᱥᱟᱶ ᱢᱤᱞᱟᱹᱣ ᱞᱟᱹᱠᱛᱤᱭᱟ

select-prime-numbers-values-not-prime = select prime number ᱞᱟᱹᱜᱤᱫ ᱮᱢ ᱟᱠᱟᱱ ᱡᱚᱛᱚ ᱜᱚᱱᱚᱝ ᱫᱚ ᱚᱵᱷᱟᱡᱭᱚ ᱞᱮᱠᱷᱟ ᱞᱤᱥᱴᱤ ᱨᱮ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤᱭᱟ

select-prime-numbers-values-excluded-combination = selectPrimeNumbers ᱨᱮᱱ ᱮᱢ ᱟᱠᱟᱱ ᱜᱚᱱᱚᱝ ᱫᱚ ᱵᱟᱜᱤ ᱟᱠᱟᱱ ᱡᱚᱛᱚ ᱛᱟᱦᱮᱸᱱ ᱠᱟᱱᱟ

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ᱨᱮ 70% ᱠᱷᱚᱱ ᱟᱭᱢᱟ ᱡᱚᱛᱚ ᱵᱟᱜᱤ ᱟᱠᱟᱱᱟ

select-random-combination-fluke = ᱟᱹᱰᱤ ᱵᱟᱝ ᱦᱩᱭᱩᱜ ᱞᱮᱠᱟᱱ ᱟᱠᱚᱥᱢᱤᱠ ᱛᱮ ᱡᱟᱦᱟᱸᱱᱟᱜ ᱜᱚᱱᱚᱝ ᱨᱮᱱ ᱡᱚᱛᱚ ᱵᱟᱭ ᱵᱟᱪᱷᱟᱣ ᱞᱮᱱᱟ

select-random-value-fluke = ᱟᱹᱰᱤ ᱵᱟᱝ ᱦᱩᱭᱩᱜ ᱞᱮᱠᱟᱱ ᱟᱠᱚᱥᱢᱤᱠ ᱛᱮ ᱡᱟᱦᱟᱸᱱᱟᱜ ᱜᱚᱱᱚᱝ ᱵᱟᱭ ᱵᱟᱪᱷᱟᱣ ᱞᱮᱱᱟ
