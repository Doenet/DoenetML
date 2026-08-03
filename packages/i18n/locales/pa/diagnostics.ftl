# Punjabi diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] ਦੋ ਸਿਰੇ ਦੇ ਬਿੰਦੂ ਦਿੱਤੇ ਹੋਣ ’ਤੇ { $attributes } ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ
       *[other] ਦੋ ਸਿਰੇ ਦੇ ਬਿੰਦੂ ਦਿੱਤੇ ਹੋਣ ’ਤੇ { $attributes } ਅਣਡਿੱਠੇ ਕੀਤੇ ਜਾਂਦੇ ਹਨ
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] ਇੱਕ ਸਿਰੇ ਦਾ ਬਿੰਦੂ ਅਤੇ ਇੱਕ ਮੱਧ ਬਿੰਦੂ ਦੋਵੇਂ ਦਿੱਤੇ ਹੋਣ ’ਤੇ { $attributes } ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ
       *[other] ਇੱਕ ਸਿਰੇ ਦਾ ਬਿੰਦੂ ਅਤੇ ਇੱਕ ਮੱਧ ਬਿੰਦੂ ਦੋਵੇਂ ਦਿੱਤੇ ਹੋਣ ’ਤੇ { $attributes } ਅਣਡਿੱਠੇ ਕੀਤੇ ਜਾਂਦੇ ਹਨ
    }

line-segment-midpoint-offset-without-midpoint = ਮੱਧ ਬਿੰਦੂ ਤੋਂ ਬਿਨਾਂ midpointOffset ਦਾ ਕੋਈ ਅਸਰ ਨਹੀਂ ਹੁੰਦਾ

## `<line>`

line-points-undetermined-dimensions = ਅਣਨਿਰਧਾਰਿਤ ਪਸਾਰਾਂ ਵਾਲੇ ਬਿੰਦੂਆਂ ਵਿੱਚੋਂ ਲੰਘਦੀ ਰੇਖਾ।

line-points-too-few-dimensions = ਰੇਖਾ ਘੱਟੋ-ਘੱਟ ਦੋ ਪਸਾਰਾਂ ਵਾਲੇ ਬਿੰਦੂਆਂ ਵਿੱਚੋਂ ਲੰਘਣੀ ਚਾਹੀਦੀ ਹੈ।

line-points-depend-on-variables = ਰੇਖਾ ਚਲਾਂ ਉੱਤੇ ਨਿਰਭਰ ਬਿੰਦੂਆਂ ਵਿੱਚੋਂ ਲੰਘਦੀ ਹੈ: { $variables }।

line-equation-invalid-format = ਚਲ { $variable1 } ਅਤੇ { $variable2 } ਵਿੱਚ ਰੇਖਾ ਦੀ ਸਮੀਕਰਨ ਲਈ ਗਲਤ ਰੂਪ।

## `<ray>`

ray-overprescribed-through = ਕਿਰਨ through, endpoint ਅਤੇ direction ਤਿੰਨਾਂ ਨਾਲ ਨਿਰਧਾਰਿਤ ਹੈ। ਦਿੱਤਾ through ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।

ray-dimension-mismatch = ਕਿਰਨ ਵਿੱਚ numDimensions ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ।

## `<vector>`

vector-overprescribed-head = ਸਦਿਸ਼ head, tail ਅਤੇ displacement ਤਿੰਨਾਂ ਨਾਲ ਨਿਰਧਾਰਿਤ ਹੈ। ਦਿੱਤਾ head ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।

vector-dimension-mismatch = ਸਦਿਸ਼ ਵਿੱਚ numDimensions ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ਕੋਲ nearestPoint ਅਵਸਥਾ ਚਲ ਨਾ ਹੋਣ ਕਰਕੇ ਉਸ ਵੱਲ ਖਿੱਚਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ।

constrain-to-without-nearest-point = `<{ $component }>` ਕੋਲ nearestPoint ਅਵਸਥਾ ਚਲ ਨਾ ਹੋਣ ਕਰਕੇ ਉਸ ਉੱਤੇ ਸੀਮਿਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।

constrain-to-interior-without-nearest-point = `<{ $component }>` ਕੋਲ nearestPoint ਅਵਸਥਾ ਚਲ ਨਾ ਹੋਣ ਕਰਕੇ ਉਸ ਦੇ ਅੰਦਰਲੇ ਹਿੱਸੇ ਉੱਤੇ ਸੀਮਿਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।

## `<choiceInput>`

choice-input-label-position-ignored = ਇਨਲਾਈਨ ਨਾ ਹੋਣ ਵਾਲੇ choiceInput ਲਈ labelPosition ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ

## Ordering children by index

choice-input-indices-count-mismatch = ਸੂਚਕਾਂਕਾਂ ਦੀ ਗਿਣਤੀ choice ਬਾਲ-ਹਿੱਸਿਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਮੇਲ ਨਾ ਖਾਣ ਕਰਕੇ choiceInput ਲਈ ਦਿੱਤੇ ਸੂਚਕਾਂਕ ਅਣਡਿੱਠੇ ਕੀਤੇ ਜਾਂਦੇ ਹਨ।

pretzel-indices-count-mismatch = ਸੂਚਕਾਂਕਾਂ ਦੀ ਗਿਣਤੀ problem ਬਾਲ-ਹਿੱਸਿਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਮੇਲ ਨਾ ਖਾਣ ਕਰਕੇ problem ਲਈ ਦਿੱਤੇ ਸੂਚਕਾਂਕ ਅਣਡਿੱਠੇ ਕੀਤੇ ਜਾਂਦੇ ਹਨ।

shuffle-indices-count-mismatch = ਸੂਚਕਾਂਕਾਂ ਦੀ ਗਿਣਤੀ ਹਿੱਸਿਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਮੇਲ ਨਾ ਖਾਣ ਕਰਕੇ shuffle ਲਈ ਦਿੱਤੇ ਸੂਚਕਾਂਕ ਅਣਡਿੱਠੇ ਕੀਤੇ ਜਾਂਦੇ ਹਨ।

indices-ignored-out-of-range = ਕੁਝ ਸੂਚਕਾਂਕ ਹੱਦ ਤੋਂ ਬਾਹਰ ਹੋਣ ਕਰਕੇ { $component } ਲਈ ਦਿੱਤੇ ਸੂਚਕਾਂਕ ਅਣਡਿੱਠੇ ਕੀਤੇ ਜਾਂਦੇ ਹਨ।

pretzel-indices-repeated = ਕੁਝ ਸੂਚਕਾਂਕ ਦੁਹਰਾਏ ਹੋਣ ਕਰਕੇ pretzel ਲਈ ਦਿੱਤੇ ਸੂਚਕਾਂਕ ਅਣਡਿੱਠੇ ਕੀਤੇ ਜਾਂਦੇ ਹਨ।

pretzel-circuit-first-index = circuit ਢੰਗ ਵਿੱਚ ਪਹਿਲਾ ਸੂਚਕਾਂਕ 1 ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ਇਸ ਲਈ pretzel ਲਈ ਦਿੱਤੇ ਸੂਚਕਾਂਕ ਅਣਡਿੱਠੇ ਕੀਤੇ ਜਾਂਦੇ ਹਨ।

## `<shuffle>` and `<sort>`

string-children-need-type = ਸਟ੍ਰਿੰਗ ਬਾਲ-ਹਿੱਸਿਆਂ ਨਾਲ `<{ $component }>` ਕੰਮ ਕਰੇ, ਇਸ ਲਈ `type` ਗੁਣ ਦੇਣਾ ਜ਼ਰੂਰੀ ਹੈ।

invalid-type-defaulting-to-math = { $component } ਹਿੱਸੇ ਲਈ { $type } ਗਲਤ type ਹੈ। ਇਹ math, text, number ਜਾਂ boolean ਵਿੱਚੋਂ ਇੱਕ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ। math ਉੱਤੇ ਸੈੱਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ।

string-not-valid-component-to-arrange = "{ $value }" ਸਟ੍ਰਿੰਗ { $component } ਕਰਨ ਲਈ ਢੁੱਕਵਾਂ ਹਿੱਸਾ ਨਹੀਂ। ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।

## Types and variables

invalid-type-defaulting-to-number = { $type } ਗਲਤ type ਹੈ, type ਨੂੰ number ਉੱਤੇ ਸੈੱਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ।

invalid-variable-value = ਚਲ ਦਾ ਗਲਤ ਮੁੱਲ: `{ $value }`

## Variants

variant-index-must-be-number = ਰੂਪ ਸੂਚਕਾਂਕ { $index } ਇੱਕ ਸੰਖਿਆ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ

variant-index-must-be-integer = ਰੂਪ ਸੂਚਕਾਂਕ { $index } ਇੱਕ ਪੂਰਨ ਅੰਕ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ਨਿਰਪੇਖ ਮਾਪਾਂ ਲਈ ਲਾਗੂ ਨਹੀਂ ਹੈ। ਚੌੜਾਈਆਂ ਸਾਪੇਖ ਉੱਤੇ ਸੈੱਟ ਕੀਤੀਆਂ ਜਾ ਰਹੀਆਂ ਹਨ।

side-by-side-absolute-margins = `<{ $component }>` ਨਿਰਪੇਖ ਮਾਪਾਂ ਲਈ ਲਾਗੂ ਨਹੀਂ ਹੈ। ਹਾਸ਼ੀਏ ਸਾਪੇਖ ਉੱਤੇ ਸੈੱਟ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ।

side-by-side-no-block-child = ਗਲਤ `<{ $component }>`: ਇਸ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਬਲਾਕ ਬਾਲ-ਹਿੱਸਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।

## `<label>`

label-for-ignored-on-graphical = ਗਰਾਫ਼ੀ `<label>` ਉੱਤੇ `for` ਗੁਣ ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।

label-for-must-resolve-to-one = `<label>` ਉੱਤੇ `for` ਗੁਣ ਠੀਕ ਇੱਕ ਹਿੱਸੇ ਉੱਤੇ ਹੱਲ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।

label-for-unresolved = `<label>` ਉੱਤੇ `for` ਗੁਣ ਕਿਸੇ ਹਿੱਸੇ ਉੱਤੇ ਹੱਲ ਨਹੀਂ ਹੋ ਸਕਿਆ।

label-for-answer-with-authored-inputs = `<label>` ਉੱਤੇ `for` ਗੁਣ ਸਪਸ਼ਟ ਲਿਖੇ ਇਨਪੁਟਾਂ ਵਾਲੇ `<answer>` ਦਾ ਹਵਾਲਾ ਦਿੰਦਾ ਹੈ; ਇਨਪੁਟ ਦਾ ਸਿੱਧਾ ਹਵਾਲਾ ਦਿਓ।

label-for-answer-without-input = `<label>` ਉੱਤੇ `for` ਗੁਣ ਨਾਂ ਦੇਣ ਲਈ ਇਨਪੁਟ ਤੋਂ ਬਿਨਾਂ `<answer>` ਦਾ ਹਵਾਲਾ ਦਿੰਦਾ ਹੈ।

label-for-must-reference-input-or-answer = `<label>` ਉੱਤੇ `for` ਗੁਣ ਕਿਸੇ ਇਨਪੁਟ ਜਾਂ ਜਵਾਬ ਦਾ ਹਵਾਲਾ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।

## Accessibility

accessibility-short-description-or-decorative = ਪਹੁੰਚਯੋਗਤਾ ਲਈ `<{ $component }>` ਕੋਲ ਛੋਟਾ ਵਰਣਨ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ ਜਾਂ ਇਸਨੂੰ ਸਜਾਵਟੀ ਦੱਸਿਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ।

accessibility-video-short-description = ਪਹੁੰਚਯੋਗਤਾ ਲਈ `<video>` ਕੋਲ ਛੋਟਾ ਵਰਣਨ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।

accessibility-input-short-description-or-label = ਪਹੁੰਚਯੋਗਤਾ ਲਈ `<{ $component }>` ਕੋਲ ਛੋਟਾ ਵਰਣਨ ਜਾਂ ਨਾਂ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।

accessibility-answer-input-short-description-or-label = ਪਹੁੰਚਯੋਗਤਾ ਲਈ, ਇਨਪੁਟ ਬਣਾਉਣ ਵਾਲੇ `<answer>` ਕੋਲ ਛੋਟਾ ਵਰਣਨ ਜਾਂ ਨਾਂ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।

accessibility-short-description-contains-math = ਛੋਟੇ ਵਰਣਨਾਂ ਵਿੱਚ `<{ $component }>` ਵਰਗੇ ਗਣਿਤ ਹਿੱਸੇ ਨਹੀਂ ਹੋਣੇ ਚਾਹੀਦੇ। ਗਣਿਤ ਨੂੰ ਸ਼ਬਦਾਂ ਵਿੱਚ ਲਿਖੋ।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] ਖੰਡ ਸਿਰਲੇਖ ਦੀ ਲਿਖਤ ਲਈ { $colorName } ਦਾ ਵਖਰੇਵਾਂ ਕਾਫ਼ੀ ਨਹੀਂ (ਗੂੜ੍ਹਾ ਢੰਗ) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ਘੱਟੋ-ਘੱਟ { $threshold }:1 ਚਾਹੀਦਾ)।
       *[other] ਖੰਡ ਸਿਰਲੇਖ ਦੀ ਲਿਖਤ ਲਈ { $colorName } ਦਾ ਵਖਰੇਵਾਂ ਕਾਫ਼ੀ ਨਹੀਂ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ਘੱਟੋ-ਘੱਟ { $threshold }:1 ਚਾਹੀਦਾ)।
    }

## `<circle>`

circle-through-points-non-numerical = ਬਿੰਦੂਆਂ ਦੇ ਸੰਖਿਆਤਮਕ ਮੁੱਲ ਨਾ ਹੋਣ ਦੀ ਸੂਰਤ ਵਿੱਚ { $count } ਬਿੰਦੂਆਂ ਵਿੱਚੋਂ ਲੰਘਦਾ `<circle>` ਲਾਗੂ ਨਹੀਂ ਹੈ।

circle-too-many-through-points = 3 ਤੋਂ ਵੱਧ ਬਿੰਦੂਆਂ ਵਿੱਚੋਂ ਲੰਘਦਾ ਚੱਕਰ ਕੱਢਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ।

circle-overprescribed-radius-center-points = ਅਰਧ-ਵਿਆਸ, ਕੇਂਦਰ ਅਤੇ ਲੰਘਦੇ ਬਿੰਦੂ ਤਿੰਨੇ ਦਿੱਤੇ ਚੱਕਰ ਨੂੰ ਕੱਢਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ।

circle-center-with-multiple-points = ਦਿੱਤੇ ਕੇਂਦਰ ਨਾਲ 1 ਤੋਂ ਵੱਧ ਬਿੰਦੂ ਵਿੱਚੋਂ ਲੰਘਦਾ ਚੱਕਰ ਕੱਢਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ।

circle-radius-too-small = ਚੱਕਰ ਕੱਢਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ: ਦੋ ਬਿੰਦੂਆਂ ਵਿਚਲੀ ਦੂਰੀ { $distance } ਹੋਣ ਕਰਕੇ, ਦਿੱਤਾ ਅਰਧ-ਵਿਆਸ { $radius } ਬਹੁਤ ਛੋਟਾ ਹੈ।

circle-radius-with-many-points = ਦਿੱਤੇ ਅਰਧ-ਵਿਆਸ ਨਾਲ ਦੋ ਤੋਂ ਵੱਧ ਬਿੰਦੂਆਂ ਵਿੱਚੋਂ ਲੰਘਦਾ ਚੱਕਰ ਨਹੀਂ ਬਣਾਇਆ ਜਾ ਸਕਦਾ।

circle-invalid-center-or-through-points = ਚੱਕਰ ਦਾ ਕੇਂਦਰ ਜਾਂ ਲੰਘਦੇ ਬਿੰਦੂ ਗਲਤ ਹਨ।

circle-radius-center-with-multiple-points = ਦਿੱਤੇ ਕੇਂਦਰ ਨਾਲ 1 ਤੋਂ ਵੱਧ ਬਿੰਦੂ ਵਿੱਚੋਂ ਲੰਘਦੇ ਚੱਕਰ ਦਾ ਅਰਧ-ਵਿਆਸ ਕੱਢਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ।

circle-change-radius-non-numerical = ਸੰਖਿਆਤਮਕ ਮੁੱਲ ਤੋਂ ਬਿਨਾਂ ਬਿੰਦੂਆਂ ਵਿੱਚੋਂ ਲੰਘਦੇ ਚੱਕਰ ਦਾ ਅਰਧ-ਵਿਆਸ ਬਦਲਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ

circle-radius-with-points-non-numerical = ਸੰਖਿਆਤਮਕ ਮੁੱਲ ਨਾ ਹੋਣ ’ਤੇ, ਦਿੱਤੇ ਅਰਧ-ਵਿਆਸ ਨਾਲ ਇੱਕ ਤੋਂ ਵੱਧ ਬਿੰਦੂ ਵਿੱਚੋਂ ਲੰਘਦਾ ਚੱਕਰ ਨਹੀਂ ਬਣਾਇਆ ਜਾ ਸਕਦਾ।

circle-change-center-non-numerical = ਸੰਖਿਆਤਮਕ ਮੁੱਲ ਤੋਂ ਬਿਨਾਂ ਬਿੰਦੂਆਂ ਵਿੱਚੋਂ ਲੰਘਦੇ ਚੱਕਰ ਦਾ ਕੇਂਦਰ ਬਦਲਣਾ ਲਾਗੂ ਨਹੀਂ ਹੈ।

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] ਫਲਨ ਦੇ ਖੇਤਰ ਲਈ ਕਾਫ਼ੀ ਪਸਾਰ ਨਹੀਂ। ਖੇਤਰ ਵਿੱਚ { $intervals } ਅੰਤਰਾਲ ਹੈ, ਪਰ ਫਲਨ ਦੇ { $inputs ->
            [one] { $inputs } ਇਨਪੁਟ
           *[other] { $inputs } ਇਨਪੁਟ
        } ਹਨ।
       *[other] ਫਲਨ ਦੇ ਖੇਤਰ ਲਈ ਕਾਫ਼ੀ ਪਸਾਰ ਨਹੀਂ। ਖੇਤਰ ਵਿੱਚ { $intervals } ਅੰਤਰਾਲ ਹਨ, ਪਰ ਫਲਨ ਦੇ { $inputs ->
            [one] { $inputs } ਇਨਪੁਟ
           *[other] { $inputs } ਇਨਪੁਟ
        } ਹਨ।
    }

function-domain-invalid-format = ਫਲਨ ਦੇ ਖੇਤਰ ਲਈ ਗਲਤ ਰੂਪ।

function-ignoring-non-numerical =
    { $type ->
        [maximum] ਫਲਨ ਦਾ ਗੈਰ-ਸੰਖਿਆਤਮਕ ਵੱਧ ਤੋਂ ਵੱਧ ਮੁੱਲ ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।
        [minimum] ਫਲਨ ਦਾ ਗੈਰ-ਸੰਖਿਆਤਮਕ ਘੱਟੋ-ਘੱਟ ਮੁੱਲ ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।
        [extremum] ਫਲਨ ਦਾ ਗੈਰ-ਸੰਖਿਆਤਮਕ ਸਿਰੇ ਦਾ ਮੁੱਲ ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।
        [point] ਫਲਨ ਦਾ ਗੈਰ-ਸੰਖਿਆਤਮਕ ਬਿੰਦੂ ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।
        [slope] ਫਲਨ ਦੀ ਗੈਰ-ਸੰਖਿਆਤਮਕ ਢਲਾਣ ਅਣਡਿੱਠੀ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।
       *[other] ਫਲਨ ਦਾ ਗੈਰ-ਸੰਖਿਆਤਮਕ { $type } ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।
    }

function-ignoring-empty =
    { $type ->
        [maximum] ਫਲਨ ਦਾ ਖਾਲੀ ਵੱਧ ਤੋਂ ਵੱਧ ਮੁੱਲ ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।
        [minimum] ਫਲਨ ਦਾ ਖਾਲੀ ਘੱਟੋ-ਘੱਟ ਮੁੱਲ ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।
        [extremum] ਫਲਨ ਦਾ ਖਾਲੀ ਸਿਰੇ ਦਾ ਮੁੱਲ ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।
        [point] ਫਲਨ ਦਾ ਖਾਲੀ ਬਿੰਦੂ ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।
       *[other] ਫਲਨ ਦਾ ਖਾਲੀ { $type } ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।
    }

function-points-too-close = ਫਲਨ ਵਿੱਚ ਬਹੁਤ ਨੇੜੇ-ਨੇੜੇ ਦੋ ਬਿੰਦੂ ਹਨ। ਫਲਨ ਪਰਿਭਾਸ਼ਿਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] ਫਲਨ ਦੇ ਇਨਪੁਟਾਂ ਦੀ ਗਿਣਤੀ ਆਉਟਪੁਟਾਂ ਦੀ ਗਿਣਤੀ ਬਰਾਬਰ ਹੋਵੇ ਤਾਂ ਹੀ ਫਲਨ ਦੁਹਰਾਓ ਸੰਭਵ ਹਨ। ਇਸ ਫਲਨ ਦੇ { $inputs } ਇਨਪੁਟ ਅਤੇ { $outputs ->
            [one] { $outputs } ਆਉਟਪੁਟ
           *[other] { $outputs } ਆਉਟਪੁਟ
        } ਹਨ।
       *[other] ਫਲਨ ਦੇ ਇਨਪੁਟਾਂ ਦੀ ਗਿਣਤੀ ਆਉਟਪੁਟਾਂ ਦੀ ਗਿਣਤੀ ਬਰਾਬਰ ਹੋਵੇ ਤਾਂ ਹੀ ਫਲਨ ਦੁਹਰਾਓ ਸੰਭਵ ਹਨ। ਇਸ ਫਲਨ ਦੇ { $inputs } ਇਨਪੁਟ ਅਤੇ { $outputs ->
            [one] { $outputs } ਆਉਟਪੁਟ
           *[other] { $outputs } ਆਉਟਪੁਟ
        } ਹਨ।
    }

## `<sequence>`

sequence-invalid-length = ਲੜੀ ਦੀ ਲੰਬਾਈ ਗਲਤ ਹੈ। ਇਹ ਗੈਰ-ਰਿਣਾਤਮਕ ਪੂਰਨ ਅੰਕ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।

sequence-invalid-step = ਲੜੀ ਦਾ ਕਦਮ ਗਲਤ ਹੈ। { $type } ਕਿਸਮ ਦੀ ਲੜੀ ਲਈ ਇਹ ਸੰਖਿਆ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।

sequence-invalid-endpoint-number = ਸੰਖਿਆ ਲੜੀ ਦਾ "{ $attribute }" ਗਲਤ ਹੈ। ਇਹ ਸੰਖਿਆ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।

sequence-invalid-endpoint-letters = ਅੱਖਰ ਲੜੀ ਦਾ "{ $attribute }" ਗਲਤ ਹੈ। ਇਹ ਅੱਖਰਾਂ ਦਾ ਜੋੜ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।

sequence-invalid-endpoint = ਲੜੀ ਦਾ "{ $attribute }" ਗਲਤ ਹੈ।

select-from-sequence-coprime-not-numbers = ਸੰਖਿਆਵਾਂ ਨਾ ਚੁਣੇ ਜਾਣ ਕਰਕੇ coprime ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations ਦਿੱਤਾ ਹੋਣ ਕਰਕੇ coprime ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ

## Resolving a `target`

target-not-found = `<{ $source }>` ਲਈ ਗਲਤ target: ਨਿਸ਼ਾਨਾ ਨਹੀਂ ਲੱਭਿਆ।

target-state-variable-not-found = `<{ $source }>` ਲਈ ਗਲਤ target: `<{ $component }>` ਉੱਤੇ "{ $property }" ਨਾਂ ਦਾ ਅਵਸਥਾ ਚਲ ਨਹੀਂ ਲੱਭਿਆ।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` ਦੇ ਚਲ ਸੁਤੰਤਰ ਚਲ ਤੋਂ ਵੱਖਰੇ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।

ode-system-duplicate-variable-names = ਇੱਕੋ ਜਿਹੇ ਨਿਰਭਰ ਚਲ ਨਾਵਾਂ ਨਾਲ ODE RHS ਫਲਨ ਪਰਿਭਾਸ਼ਿਤ ਨਹੀਂ ਕੀਤੇ ਜਾ ਸਕਦੇ।

ode-system-rhs-function-error = ODE RHS ਫਲਨ ਪਰਿਭਾਸ਼ਿਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ। mathjs ਫਲਨ ਬਣਾਉਣ ਵਿੱਚ ਗਲਤੀ।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } ਰੇਖਾਵਾਂ ਵਿਚਲਾ ਕੋਣ ਪਰਿਭਾਸ਼ਿਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ

angle-invalid-through-point = `<angle>` ਦੇ through ਵਿੱਚ ਗਲਤ ਬਿੰਦੂ

parabola-vertex-too-many-points = ਸਿਖਰ ਨਾਲ 1 ਤੋਂ ਵੱਧ ਬਿੰਦੂ ਵਿੱਚੋਂ ਲੰਘਦਾ ਪਰਵਲਯ ਲਾਗੂ ਨਹੀਂ ਹੈ।

parabola-too-many-points = 3 ਤੋਂ ਵੱਧ ਬਿੰਦੂਆਂ ਵਿੱਚੋਂ ਲੰਘਦਾ ਪਰਵਲਯ ਲਾਗੂ ਨਹੀਂ ਹੈ।

intersection-too-many-items = ਦੋ ਤੋਂ ਵੱਧ ਚੀਜ਼ਾਂ ਲਈ ਕਾਟ ਲਾਗੂ ਨਹੀਂ ਹੈ

## Other math components

ionic-compound-not-two-ions = ਦੋ ਆਇਨਾਂ ਤੋਂ ਬਿਨਾਂ ਹੋਰ ਕਿਸੇ ਲਈ ਆਇਓਨਿਕ ਯੌਗਿਕ ਲਾਗੂ ਨਹੀਂ ਹੈ।

ionic-compound-needs-cation-and-anion = ਇੱਕ ਧਨ-ਆਇਨ ਅਤੇ ਇੱਕ ਰਿਣ-ਆਇਨ ਲਈ ਹੀ ਆਇਓਨਿਕ ਯੌਗਿਕ ਲਾਗੂ ਹੈ।

solve-equations-cannot-evaluate = ਸਮੀਕਰਨ ਦਾ ਮੁੱਲਾਂਕਣ ਨਾ ਹੋ ਸਕਣ ਕਰਕੇ ਇਸਨੂੰ ਹੱਲ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ: { $equation }

math-operators-operand-number-required = ਗਣਿਤ ਦਾ ਅੰਗ ਕੱਢਦੇ ਸਮੇਂ operandNumber ਦੇਣਾ ਜ਼ਰੂਰੀ ਹੈ।

eigen-decomposition-failed = ਮੈਟਰਿਕਸ ਦੇ ਆਈਗਨ ਮੁੱਲ ਨਹੀਂ ਕੱਢੇ ਜਾ ਸਕੇ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } ਪੈਰਾਮੀਟਰ ਨਮੂਨੇ ਵਿੱਚ ਨਾ ਆਉਣ ਕਰਕੇ ਇਹ ਹਮੇਸ਼ਾ ਖਾਲੀ ਥਾਂ ਨਾਲ ਮੇਲ ਖਾਵੇਗਾ।
       *[other] `<matchesPattern>`: { $parameters } ਪੈਰਾਮੀਟਰ ਨਮੂਨੇ ਵਿੱਚ ਨਾ ਆਉਣ ਕਰਕੇ ਇਹ ਹਮੇਸ਼ਾ ਖਾਲੀ ਥਾਂ ਨਾਲ ਮੇਲ ਖਾਣਗੇ।
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ਸਮਝਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ। ਇਹ none, medium, dense ਜਾਂ ਖਾਲੀ ਥਾਂ ਨਾਲ ਵੱਖ ਕੀਤੀਆਂ ਦੋ ਧਨ ਸੰਖਿਆਵਾਂ — ਜਿਵੇਂ grid="1 0.5" — ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ। ਕੋਈ ਜਾਲੀ ਨਹੀਂ ਵਾਹੀ ਗਈ।

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure ਰੈਂਡਰਰ ਵਿੱਚ xLabelPosition="left" ਸਮਰਥਿਤ ਨਹੀਂ; ਸੱਜੇ ਪਾਸੇ ਦਾ ਵਿਹਾਰ ਵਰਤਿਆ ਜਾ ਰਿਹਾ ਹੈ।

prefigure-y-label-position-unsupported = `<graph>`: prefigure ਰੈਂਡਰਰ ਵਿੱਚ yLabelPosition="bottom" ਸਮਰਥਿਤ ਨਹੀਂ; ਉੱਪਰਲੇ ਪਾਸੇ ਦਾ ਵਿਹਾਰ ਵਰਤਿਆ ਜਾ ਰਿਹਾ ਹੈ।

prefigure-invalid-axis-bounds = `<graph>`: prefigure ਬਦਲਾਅ ਲਈ ਧੁਰੇ ਦੀਆਂ ਹੱਦਾਂ ਗਲਤ ਹਨ; ਮੂਲ bbox (-10,-10,10,10) ਵਰਤਿਆ ਜਾ ਰਿਹਾ ਹੈ।

prefigure-invalid-width = `<graph>`: prefigure ਬਦਲਾਅ ਲਈ ਚੌੜਾਈ ਗਲਤ ਹੈ; ਮੂਲ ਚਿੱਤਰ ਚੌੜਾਈ 425 ਵਰਤੀ ਜਾ ਰਹੀ ਹੈ।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ਬਦਲਾਅ ਲਈ aspectRatio ਗਲਤ ਹੈ; ਮੂਲ ਅਨੁਪਾਤ 1 ਵਰਤਿਆ ਜਾ ਰਿਹਾ ਹੈ।

prefigure-grid-spacing-too-fine = `<graph>`: ਧੁਰੇ ਦੀਆਂ ਹੱਦਾਂ ਲਈ ਜਾਲੀ ਦਾ ਵਿੱਥ ਬਹੁਤ ਬਾਰੀਕ ਹੈ; prefigure ਰੈਂਡਰਰ ਵਿੱਚ ਜਾਲੀ ਛੱਡੀ ਜਾ ਰਹੀ ਹੈ।

prefigure-annotations-not-rendered = `<graph>`: PreFigure ਰੈਂਡਰਰ ਨਾ ਵਰਤਣ ’ਤੇ ਟਿੱਪਣੀਆਂ ਨਹੀਂ ਵਿਖਾਈਆਂ ਜਾਣਗੀਆਂ।

multiple-annotations-children = `<graph>` ਵਿੱਚ ਕਈ `<annotations>` ਬਾਲ-ਹਿੱਸੇ ਮਿਲੇ; ਆਖ਼ਰੀ ਤੋਂ ਬਿਨਾਂ ਬਾਕੀ ਸਭ ਅਣਡਿੱਠੇ ਕੀਤੇ ਜਾਂਦੇ ਹਨ।

## Referring to other components

copy-unrecognized-component-type = ਅਣਪਛਾਤੀ ਹਿੱਸਾ ਕਿਸਮ ਨੂੰ ਵਧਾਇਆ ਜਾਂ ਨਕਲ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ: { $type }।

copy-prop-not-found = { $component } ਕਿਸਮ ਦੇ ਹਿੱਸੇ ਉੱਤੇ { $property } ਗੁਣ ਨਹੀਂ ਲੱਭਿਆ

collect-no-source = collect ਲਈ ਕੋਈ ਸਰੋਤ ਨਹੀਂ ਲੱਭਿਆ।

collect-invalid-component-type = `<{ $component }>` ਗਲਤ ਹਿੱਸਾ ਕਿਸਮ ਹੋਣ ਕਰਕੇ ਉਸ ਕਿਸਮ ਦੇ ਹਿੱਸੇ ਇਕੱਠੇ ਨਹੀਂ ਕੀਤੇ ਜਾ ਸਕਦੇ।

reference-index-unavailable = `{ $reference }` ਸੂਚਕਾਂਕ ਦਾ ਹਵਾਲਾ ਨਹੀਂ ਦਿੱਤਾ ਜਾ ਸਕਦਾ

## `<callAction>`

component-action-unavailable = `{ $reference }` ਹਿੱਸੇ ਉੱਤੇ { $action } ਨਹੀਂ ਬੁਲਾਇਆ ਜਾ ਸਕਦਾ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ਡਾਟੇ ਦਾ ਰੂਪ ਗਲਤ ਹੈ। ਕਤਾਰਾਂ ਦੀਆਂ ਲੰਬਾਈਆਂ ਬੇਮੇਲ ਹਨ। componentIdx :{ $componentIdx } ਵਿੱਚ ਮਿਲਿਆ

data-frame-duplicate-column-names = ਡਾਟੇ ਵਿੱਚ ਕਾਲਮਾਂ ਦੇ ਨਾਂ ਦੁਹਰਾਏ ਗਏ ਹਨ। componentIdx :{ $componentIdx } ਵਿੱਚ ਮਿਲਿਆ

data-frame-missing-column-name = ਡਾਟੇ ਵਿੱਚ ਇੱਕ ਕਾਲਮ ਦਾ ਨਾਂ ਗੁੰਮ ਹੈ। componentIdx :{ $componentIdx } ਵਿੱਚ ਮਿਲਿਆ

## `<answer>` and scoring

answer-award-depends-on-own-response = ਇਸ ਜਵਾਬ ਦਾ ਇੱਕ award, ਉਸੇ answer ਟੈਗ ਦੇ ਭੇਜੇ ਜਵਾਬ ਉੱਤੇ ਹੀ ਆਧਾਰਿਤ ਹੈ; ਇਸ ਨਾਲ ਅਣਕਿਆਸਿਆ ਵਿਹਾਰ ਹੋਵੇਗਾ।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` ਵਾਲੇ ਡੱਬੇ ਦੇ ਅੰਦਰਲੇ `<answer>` ਉੱਤੇ `maxNumAttempts` ਸੈੱਟ ਕਰਨ ਦਾ ਕੋਈ ਅਸਰ ਨਹੀਂ; ਕੋਸ਼ਿਸ਼ਾਂ ਦੀ ਗਿਣਤੀ ਉਹ ਡੱਬਾ ਹੀ ਕਾਬੂ ਕਰਦਾ ਹੈ। `maxNumAttempts` ਡੱਬੇ ਉੱਤੇ ਸੈੱਟ ਕਰੋ।

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` ਵਾਲੇ ਦੂਜੇ ਡੱਬੇ ਦੇ ਅੰਦਰਲੇ, `sectionWideCheckWork` ਵਾਲੇ ਡੱਬੇ ਉੱਤੇ `maxNumAttempts` ਸੈੱਟ ਕਰਨ ਦਾ ਕੋਈ ਅਸਰ ਨਹੀਂ; ਕੋਸ਼ਿਸ਼ਾਂ ਦੀ ਗਿਣਤੀ ਬਾਹਰਲਾ ਡੱਬਾ ਹੀ ਕਾਬੂ ਕਰਦਾ ਹੈ। `maxNumAttempts` ਬਾਹਰਲੇ ਡੱਬੇ ਉੱਤੇ ਸੈੱਟ ਕਰੋ।

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality ਸੈੱਟ ਕੀਤੇ ਬਿਨਾਂ { $attributes } ਗੁਣ ਦਾ ਕੋਈ ਅਸਰ ਨਹੀਂ ਹੋਵੇਗਾ।
       *[other] symbolicEquality ਸੈੱਟ ਕੀਤੇ ਬਿਨਾਂ { $attributes } ਗੁਣਾਂ ਦਾ ਕੋਈ ਅਸਰ ਨਹੀਂ ਹੋਵੇਗਾ।
    }

answer-invalid-type = ਜਵਾਬ ਲਈ ਗਲਤ ਕਿਸਮ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` ਹਿੱਸੇ ਦਾ ਕੋਈ ਨਾਂ ਨਾ ਹੋਣ ਕਰਕੇ, ਇਸਨੂੰ module ਗੁਣ ਵਜੋਂ ਨਹੀਂ ਵਰਤਿਆ ਜਾ ਸਕਦਾ

module-attribute-name-already-defined = `<module>` ਹਿੱਸਾ ਕਿਸਮ ਵਿੱਚ "{ $name }" ਗੁਣ ਪਹਿਲਾਂ ਹੀ ਪਰਿਭਾਸ਼ਿਤ ਹੋਣ ਕਰਕੇ, `<{ $component } name="{ $name }">` ਹਿੱਸੇ ਨੂੰ module ਦੇ ਗੁਣ ਵਜੋਂ ਨਹੀਂ ਵਰਤਿਆ ਜਾ ਸਕਦਾ।

conditional-content-condition-ignored = case ਜਾਂ else ਬਾਲ-ਹਿੱਸਿਆਂ ਵਾਲੇ `<conditionalContent>` ਹਿੱਸੇ ਉੱਤੇ `condition` ਗੁਣ ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।

slider-markers-type-mismatch = ਨਿਸ਼ਾਨਾਂ ਦੀ ਕਿਸਮ slider ਦੀ ਕਿਸਮ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦੀ।

pretzel-problem-needs-statement-and-answer = ਗਲਤ pretzel: ਹਰ `<problem>` ਵਿੱਚ ਇੱਕ `<statement>` ਅਤੇ ਇੱਕ `<answer>` ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।

pretzel-circuit-first-problem-distractor = ਗਲਤ pretzel: mode="circuit" ਵਿੱਚ ਪਹਿਲਾ `<problem>` ਧਿਆਨ ਭਟਕਾਉਣ ਵਾਲਾ ਨਹੀਂ ਹੋ ਸਕਦਾ।

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` ਗੁਣ ਲਈ ਗਲਤ ਮੁੱਲ { $values }; ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।
       *[other] `{ $attribute }` ਗੁਣ ਲਈ ਗਲਤ ਮੁੱਲ { $values }; ਅਣਡਿੱਠੇ ਕੀਤੇ ਜਾਂਦੇ ਹਨ।
    }

attribute-must-be-references = `{ $attribute }` ਗੁਣ ਲਈ `{ $value }` ਗਲਤ ਮੁੱਲ ਹੈ। ਇਹ ਗੁਣ `$` ਨਾਲ ਸ਼ੁਰੂ ਹੋਣ ਵਾਲੇ ਹਵਾਲਿਆਂ ਦਾ ਬਣਿਆ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।

math-input-invalid-function-names = <mathInput>: { $attribute } ਵਿਚਲੇ ਗਲਤ ਫਲਨ ਨਾਂ ਅਣਡਿੱਠੇ ਕੀਤੇ: { $names }। ਹਰ ਨਾਂ ਦਾ ਵਿਖਾਵਾ ਹਿੱਸਾ ਘੱਟੋ-ਘੱਟ 2 ਅੱਖਰਾਂ (ਅੱਖਰ ਜਾਂ ਡੈਸ਼) ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ; ਮਗਰੋਂ ਮਰਜ਼ੀ ਨਾਲ `|<mathspeak alternative>` ਪਿਛੇਤਰ ਆ ਸਕਦਾ ਹੈ।

## Building components from the source

component-type-invalid = ਗਲਤ ਹਿੱਸਾ ਕਿਸਮ: `<{ $componentType }>`

attribute-repeated = { $attribute } ਗੁਣ ਦੁਹਰਾਇਆ ਨਹੀਂ ਜਾ ਸਕਦਾ।

attribute-invalid-for-component = `<{ $componentType }>` ਕਿਸਮ ਦੇ ਹਿੱਸੇ ਲਈ "{ $attribute }" ਗਲਤ ਗੁਣ ਹੈ।

## Style definition contrast

style-definition-insufficient-contrast =
    ਸ਼ੈਲੀ ਪਰਿਭਾਸ਼ਾ { $styleNumber } ਵਿੱਚ { $context ->
        [text-on-background] ਪਿਛੋਕੜ ਰੰਗ ਦੇ ਮੁਕਾਬਲੇ ਲਿਖਤ ਦੇ ਰੰਗ ਦਾ
        [high-contrast] ਕੈਨਵਸ ਦੇ ਮੁਕਾਬਲੇ ਉੱਚ-ਵਖਰੇਵੇਂ ਵਾਲੇ ਰੰਗ ਦਾ
        [line] ਕੈਨਵਸ ਦੇ ਮੁਕਾਬਲੇ ਰੇਖਾ ਦੇ ਰੰਗ ਦਾ
        [marker] ਕੈਨਵਸ ਦੇ ਮੁਕਾਬਲੇ ਨਿਸ਼ਾਨ ਦੇ ਰੰਗ ਦਾ
       *[text-on-canvas] ਕੈਨਵਸ ਦੇ ਮੁਕਾਬਲੇ ਲਿਖਤ ਦੇ ਰੰਗ ਦਾ
    } ਵਖਰੇਵਾਂ ਕਾਫ਼ੀ ਨਹੀਂ{ $mode ->
        [dark] { " (ਗੂੜ੍ਹਾ ਢੰਗ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ਘੱਟੋ-ਘੱਟ { $threshold }:1 ਚਾਹੀਦਾ)।

style-definition-dark-mode-text-background-contrast =
    ਸ਼ੈਲੀ ਪਰਿਭਾਸ਼ਾ { $styleNumber } ਨੇ ਹਲਕੇ ਢੰਗ ਲਈ ਕਾਫ਼ੀ ਵਖਰੇਵਾਂ ਦੇਣ ਵਾਲੇ ਰੰਗ ਦਿੱਤੇ ਹੋਣ ਦੇ ਬਾਵਜੂਦ, ਉਹਨਾਂ ਤੋਂ ਕੱਢੇ ਗੂੜ੍ਹੇ ਢੰਗ ਦੇ ਰੰਗਾਂ ਵਿੱਚ ਪਿਛੋਕੜ ਰੰਗ ਦੇ ਮੁਕਾਬਲੇ ਲਿਖਤ ਦੇ ਰੰਗ ਦਾ ਵਖਰੇਵਾਂ ਕਾਫ਼ੀ ਨਹੀਂ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ਘੱਟੋ-ਘੱਟ { $threshold }:1 ਚਾਹੀਦਾ)। { $suggestion ->
        [available] ਗੂੜ੍ਹੇ ਢੰਗ ਵਿੱਚ ਕਾਫ਼ੀ ਵਖਰੇਵਾਂ ਯਕੀਨੀ ਬਣਾਉਣ ਲਈ, ਹਲਕੇ ਢੰਗ ਦਾ ਵਖਰੇਵਾਂ ਵਧਾਓ (ਜਿਵੇਂ { $lightAttribute }="{ $lightColor }" ਸੈੱਟ ਕਰੋ) ਜਾਂ ਗੂੜ੍ਹੇ ਢੰਗ ਦਾ ਰੰਗ ਬਦਲੋ (ਜਿਵੇਂ { $darkAttribute }="{ $darkColor }" ਸੈੱਟ ਕਰੋ)।
       *[none] ਗੂੜ੍ਹੇ ਢੰਗ ਵਿੱਚ ਕਾਫ਼ੀ ਵਖਰੇਵਾਂ ਯਕੀਨੀ ਬਣਾਉਣ ਲਈ, ਹਲਕੇ ਢੰਗ ਦਾ ਵਖਰੇਵਾਂ ਵਧਾਓ ਜਾਂ ਕੱਢੇ ਰੰਗਾਂ ਨੂੰ textColorDarkMode ਅਤੇ/ਜਾਂ backgroundColorDarkMode ਨਾਲ ਬਦਲੋ।
    }

style-definition-dark-mode-text-canvas-contrast =
    ਸ਼ੈਲੀ ਪਰਿਭਾਸ਼ਾ { $styleNumber } ਨੇ ਹਲਕੇ ਢੰਗ ਲਈ ਕਾਫ਼ੀ ਵਖਰੇਵਾਂ ਦੇਣ ਵਾਲਾ ਲਿਖਤ ਰੰਗ ਦਿੱਤਾ ਹੋਣ ਦੇ ਬਾਵਜੂਦ, ਉਸ ਤੋਂ ਕੱਢੇ ਗੂੜ੍ਹੇ ਢੰਗ ਦੇ ਲਿਖਤ ਰੰਗ ਦਾ ਕੈਨਵਸ ਦੇ ਮੁਕਾਬਲੇ ਵਖਰੇਵਾਂ ਕਾਫ਼ੀ ਨਹੀਂ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ਘੱਟੋ-ਘੱਟ { $threshold }:1 ਚਾਹੀਦਾ)। { $suggestion ->
        [available] ਗੂੜ੍ਹੇ ਢੰਗ ਵਿੱਚ ਕਾਫ਼ੀ ਵਖਰੇਵਾਂ ਯਕੀਨੀ ਬਣਾਉਣ ਲਈ, ਹਲਕੇ ਢੰਗ ਦਾ ਵਖਰੇਵਾਂ ਵਧਾਓ (ਜਿਵੇਂ textColor="{ $lightColor }" ਸੈੱਟ ਕਰੋ) ਜਾਂ ਗੂੜ੍ਹੇ ਢੰਗ ਦਾ ਰੰਗ ਬਦਲੋ (ਜਿਵੇਂ textColorDarkMode="{ $darkColor }" ਸੈੱਟ ਕਰੋ)।
       *[none] ਗੂੜ੍ਹੇ ਢੰਗ ਵਿੱਚ ਕਾਫ਼ੀ ਵਖਰੇਵਾਂ ਯਕੀਨੀ ਬਣਾਉਣ ਲਈ, ਹਲਕੇ ਢੰਗ ਦਾ ਵਖਰੇਵਾਂ ਵਧਾਓ ਜਾਂ ਕੱਢੇ ਰੰਗ ਨੂੰ textColorDarkMode ਨਾਲ ਬਦਲੋ।
    }

section-multiple-style-palettes = ਇੱਕ ਖੰਡ ਸਿਰਫ਼ ਇੱਕ <stylePalette> ਚੁਣ ਸਕਦਾ ਹੈ; ਆਖ਼ਰੀ ਵਰਤਿਆ ਜਾ ਰਿਹਾ ਹੈ।

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect ਗੈਰ-ਰਿਣਾਤਮਕ ਪੂਰਨ ਅੰਕ ਨਾ ਹੋਣ ਕਰਕੇ { $component } ਦੇ ਵਿਲੱਖਣ ਰੂਪ ਤੈਅ ਨਹੀਂ ਕੀਤੇ ਜਾ ਸਕਦੇ।

variant-num-to-select-not-constant-number = numToSelect ਅਟੱਲ ਸੰਖਿਆ ਨਾ ਹੋਣ ਕਰਕੇ { $component } ਦੇ ਵਿਲੱਖਣ ਰੂਪ ਤੈਅ ਨਹੀਂ ਕੀਤੇ ਜਾ ਸਕਦੇ।

variant-with-replacement-not-constant-boolean = withReplacement ਅਟੱਲ boolean ਨਾ ਹੋਣ ਕਰਕੇ { $component } ਦੇ ਵਿਲੱਖਣ ਰੂਪ ਤੈਅ ਨਹੀਂ ਕੀਤੇ ਜਾ ਸਕਦੇ।

variant-select-weight-disables-unique = selectWeight ਜਾਂ selectForVariants ਦਿੱਤਾ ਕੋਈ ਵਿਕਲਪ ਹੋਵੇ ਤਾਂ select ਲਈ ਵਿਲੱਖਣ ਰੂਪ ਬੰਦ ਹੋ ਜਾਂਦੇ ਹਨ

variant-coprime-undetermined = coprime ਹਮੇਸ਼ਾ ਗਲਤ ਹੈ, ਇਹ ਤੈਅ ਨਾ ਹੋ ਸਕਣ ਕਰਕੇ { $component } ਦੇ ਵਿਲੱਖਣ ਰੂਪ ਤੈਅ ਨਹੀਂ ਕੀਤੇ ਜਾ ਸਕਦੇ।

variant-attribute-not-constant = { $attribute } ਅਟੱਲ ਨਾ ਹੋਣ ਕਰਕੇ { $component } ਦੇ ਵਿਲੱਖਣ ਰੂਪ ਤੈਅ ਨਹੀਂ ਕੀਤੇ ਜਾ ਸਕਦੇ।

variant-attribute-not-number = { $attribute } ਸੰਖਿਆ ਨਾ ਹੋਣ ਕਰਕੇ { $component } ਦੇ ਵਿਲੱਖਣ ਰੂਪ ਤੈਅ ਨਹੀਂ ਕੀਤੇ ਜਾ ਸਕਦੇ।

variant-attribute-wrong-type-for-sequence =
    { $attribute } { $expected ->
        [letters-combination] ਅੱਖਰਾਂ ਦਾ ਜੋੜ
        [math-expression] ਸਹੀ ਗਣਿਤ ਸਮੀਕਰਨ
        [integer] ਪੂਰਨ ਅੰਕ
       *[number] ਸੰਖਿਆ
    } ਨਾ ਹੋਣ ਕਰਕੇ { $type } ਕਿਸਮ ਦੇ { $component } ਦੇ ਵਿਲੱਖਣ ਰੂਪ ਤੈਅ ਨਹੀਂ ਕੀਤੇ ਜਾ ਸਕਦੇ।

variant-length-not-integer = length ਪੂਰਨ ਅੰਕ ਨਾ ਹੋਣ ਕਰਕੇ { $component } ਦੇ ਵਿਲੱਖਣ ਰੂਪ ਤੈਅ ਨਹੀਂ ਕੀਤੇ ਜਾ ਸਕਦੇ।

variant-sort-not-implemented = sort ਵਾਲੇ { $component } ਦੇ ਵਿਲੱਖਣ ਰੂਪ ਲਾਗੂ ਨਹੀਂ ਹਨ

variant-exclude-combinations-not-implemented = excludeCombinations ਵਾਲੇ { $component } ਦੇ ਵਿਲੱਖਣ ਰੂਪ ਲਾਗੂ ਨਹੀਂ ਹਨ

variant-math-exclude-not-implemented = exclude ਵਾਲੇ math ਕਿਸਮ ਦੇ { $component } ਦੇ ਵਿਲੱਖਣ ਰੂਪ ਲਾਗੂ ਨਹੀਂ ਹਨ

variant-non-constant-exclude-not-implemented = ਅਟੱਲ ਨਾ ਹੋਣ ਵਾਲੇ exclude ਵਾਲੇ { $component } ਦੇ ਵਿਲੱਖਣ ਰੂਪ ਲਾਗੂ ਨਹੀਂ ਹਨ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure ਰੈਂਡਰਰ ਵਿੱਚ ਸਮਰਥਿਤ ਨਹੀਂ; ਵੰਸ਼ਜ ਛੱਡਿਆ ਗਿਆ।

prefigure-descendant-invalid-geometry = { $subject }: ਅਸੀਮ ਜਾਂ ਅਧੂਰੀ ਰੇਖਾ-ਗਣਿਤ; ਵੰਸ਼ਜ ਛੱਡਿਆ ਗਿਆ।

prefigure-curve-label-omitted = { $subject }: ਬਦਲੇ ਵਕਰਰੇਖਾ ਤੱਤਾਂ ਉੱਤੇ ਨਾਂ ਸਮਰਥਿਤ ਨਹੀਂ; ਨਾਂ ਛੱਡਿਆ ਗਿਆ।

prefigure-curve-unsupported-definition-type = { $subject }: ਅਸਮਰਥਿਤ ਵਕਰਰੇਖਾ ਫਲਨ ਪਰਿਭਾਸ਼ਾ ਕਿਸਮ '{ $definitionType }'; ਵੰਸ਼ਜ ਛੱਡਿਆ ਗਿਆ।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves ਉੱਤੇ ਅਸਮਰਥਿਤ flipFunctions ਗੁਣ; ਵੰਸ਼ਜ ਛੱਡਿਆ ਗਿਆ।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves ਉੱਤੇ ਸਿਰਫ਼ ਸੂਤਰ ਕਿਸਮ ਦੇ ਬਾਲ ਫਲਨ ਸਮਰਥਿਤ ਹਨ; ਵੰਸ਼ਜ ਛੱਡਿਆ ਗਿਆ।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] ਰੇਖਾ ਪਰਿਵਾਰ ਦੇ ਨਾਂ ਲਈ
       *[point] ਬਿੰਦੂ ਦੇ ਨਾਂ ਲਈ
    } ਅਸਮਰਥਿਤ labelPosition '{ $labelPosition }'; ਮੂਲ PreFigure ਤਰਤੀਬ ਵਰਤੀ ਗਈ।

prefigure-fill-style-unsupported = { $subject }: ਭਰਾਈ ਸ਼ੈਲੀ '{ $fillStyle }' ਨੂੰ PreFigure ਸਮਰਥਨ ਨਹੀਂ ਦਿੰਦਾ; ਠੋਸ ਭਰਾਈ ਉੱਤੇ ਵਾਪਸ ਜਾ ਰਿਹਾ ਹੈ।

prefigure-line-style-unknown = { $subject }: ਅਣਜਾਣ ਰੇਖਾ ਸ਼ੈਲੀ '{ $lineStyle }' PreFigure ਆਉਟਪੁਟ ਵਿੱਚੋਂ ਛੱਡੀ ਗਈ।

prefigure-marker-style-mapped-to-diamond = { $subject }: ਨਿਸ਼ਾਨ ਸ਼ੈਲੀ '{ $markerStyle }' PreFigure ਸ਼ੈਲੀ 'diamond' ਉੱਤੇ ਮੈਪ ਕੀਤੀ ਗਈ।

prefigure-marker-style-unsupported = { $subject }: ਨਿਸ਼ਾਨ ਸ਼ੈਲੀ '{ $markerStyle }' ਨੂੰ PreFigure ਸਮਰਥਨ ਨਹੀਂ ਦਿੰਦਾ; ਮੂਲ ਸ਼ੈਲੀ ਵਰਤੀ ਗਈ।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ਗਲਤ `ref`; ਨਿਸ਼ਾਨਾ ਹੱਲ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਟਿੱਪਣੀ ਛੱਡੀ ਗਈ।

annotation-ref-multiple-targets = `<annotation>`: `ref` ਕਈ ਨਿਸ਼ਾਨਿਆਂ ਉੱਤੇ ਹੱਲ ਹੋਇਆ; ਪਹਿਲਾ ਨਿਸ਼ਾਨਾ ਵਰਤਿਆ ਜਾ ਰਿਹਾ ਹੈ।

annotation-ref-outside-graph = `<annotation>`: ਗਲਤ `ref`; ਨਿਸ਼ਾਨਾ ਇਸਨੂੰ ਰੱਖਣ ਵਾਲੇ ਗ੍ਰਾਫ਼ ਤੋਂ ਬਾਹਰ ਹੈ। ਟਿੱਪਣੀ ਛੱਡੀ ਗਈ।

annotation-ref-unsupported-target = `<annotation>`: ਗਲਤ `ref`; prefigure ਬਦਲਾਅ ਵਿੱਚ ਨਿਸ਼ਾਨਾ ਸਮਰਥਿਤ ਗਰਾਫ਼ੀ ਵਸਤੂ ਨਹੀਂ। ਟਿੱਪਣੀ ਛੱਡੀ ਗਈ।

annotation-text-missing = `<annotation>`: `text` ਗੁੰਮ ਜਾਂ ਖਾਲੀ ਹੈ; ਖਾਲੀ ਲਿਖਤ ਦਿੱਤੀ ਜਾ ਰਹੀ ਹੈ।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] ਚੱਕਰੀ ਨਿਰਭਰਤਾ ਮਿਲੀ।
       *[other] `<{ $componentType }>` ਹਿੱਸੇ ਨਾਲ ਜੁੜੀ ਚੱਕਰੀ ਨਿਰਭਰਤਾ ਮਿਲੀ।
    }

reference-no-referent = ਇਸ ਹਵਾਲੇ ਲਈ ਕੁਝ ਨਹੀਂ ਮਿਲਿਆ: `{ $reference }`

reference-multiple-referents = ਇਸ ਹਵਾਲੇ ਲਈ ਕਈ ਨਿਸ਼ਾਨੇ ਮਿਲੇ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` ਦੇ { $attribute } ਗੁਣ ਲਈ ਗਲਤ ਰੂਪ।

children-invalid = `<{ $componentType }>` ਲਈ ਗਲਤ ਬਾਲ-ਹਿੱਸੇ: ਗਲਤ ਬਾਲ-ਹਿੱਸੇ ਮਿਲੇ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` ਗੁਣ ਲਈ `{ $value }` ਗਲਤ ਮੁੱਲ ਹੈ, `{ $default }` ਮੁੱਲ ਵਰਤਿਆ ਜਾ ਰਿਹਾ ਹੈ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML ਵਰਜਨ { $version } ਨਹੀਂ ਮਿਲਿਆ।
       *[other] DoenetML ਵਰਜਨ { $version } ਨਹੀਂ ਮਿਲਿਆ। ਵਰਜਨ { $fallback } ਵਰਤਿਆ ਜਾ ਰਿਹਾ ਹੈ
    }

## Reading the DoenetML

parse-invalid-doenetml = ਗਲਤ DoenetML: { $content }

parse-tag-missing-close-tag = ਗਲਤ DoenetML: `{ $tag }` ਟੈਗ ਦਾ ਬੰਦ ਕਰਨ ਵਾਲਾ ਟੈਗ ਨਹੀਂ ਹੈ। ਆਪਣੇ-ਆਪ ਬੰਦ ਹੋਣ ਵਾਲਾ ਟੈਗ ਜਾਂ `</{ $tagName }>` ਟੈਗ ਦੀ ਉਮੀਦ ਸੀ।

parse-tag-error = ਗਲਤ DoenetML: `<{ $tagName }>` ਟੈਗ ਵਿੱਚ ਗਲਤੀ

parse-attribute-missing-value = ਗਲਤ DoenetML: `{ $attribute }` ਗਲਤ ਗੁਣ ਦਾ ਮੁੱਲ ਗੁੰਮ ਲੱਗਦਾ ਹੈ।

parse-attribute-invalid = ਗਲਤ DoenetML: ਗਲਤ ਗੁਣ `{ $attribute }`

parse-attribute-value-invalid = ਗਲਤ DoenetML: ਗਲਤ ਗੁਣ ਮੁੱਲ `{ $value }`

parse-attribute-value-quote-mismatch = ਗਲਤ DoenetML: ਗਲਤ ਗੁਣ ਮੁੱਲ `{ $value }`। ਹਵਾਲਾ ਚਿੰਨ੍ਹ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ। `{ $quote }` ਗੁੰਮ ਲੱਗਦਾ ਹੈ

parse-open-tag-name-missing = ਗਲਤ DoenetML: ਨਾਂ ਤੋਂ ਬਿਨਾਂ ਟੈਗ ਮਿਲਿਆ, ਜਿਵੇਂ `<`

parse-tag-not-closed = ਗਲਤ DoenetML: `{ $tag }` ਟੈਗ ਬੰਦ ਨਹੀਂ ਹੋਇਆ (`>` ਗੁੰਮ ਲੱਗਦਾ ਹੈ)।

parse-self-closing-tag-name-missing = ਗਲਤ DoenetML: ਨਾਂ ਤੋਂ ਬਿਨਾਂ ਟੈਗ ਮਿਲਿਆ `<{ $content }>`

parse-self-closing-tag-not-closed = ਗਲਤ DoenetML: `{ $tag }` ਟੈਗ ਬੰਦ ਨਹੀਂ ਹੋਇਆ (`/>` ਗੁੰਮ ਲੱਗਦਾ ਹੈ)।

parse-tag-invalid-attributes = ਗਲਤ DoenetML: `{ $tag }` ਟੈਗ ਸਹੀ ਨਹੀਂ। ਇਸ ਦੇ ਗੁਣ ਗਲਤ ਹੋ ਸਕਦੇ ਹਨ।

parse-close-tag-name-missing = ਗਲਤ DoenetML: ਨਾਂ ਤੋਂ ਬਿਨਾਂ ਬੰਦ ਕਰਨ ਵਾਲਾ ਟੈਗ ਮਿਲਿਆ, ਜਿਵੇਂ `</`

parse-attribute-value-unquoted = ਗੁਣ ਮੁੱਲ ਹਵਾਲਾ ਚਿੰਨ੍ਹਾਂ ਵਿੱਚ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = ਗਲਤ DoenetML: `{ $tag }` ਬੰਦ ਕਰਨ ਵਾਲਾ ਟੈਗ ਮਿਲਿਆ, ਪਰ ਇਸ ਦਾ ਖੋਲ੍ਹਣ ਵਾਲਾ ਟੈਗ ਨਹੀਂ

parse-close-tag-mismatched = ਗਲਤ DoenetML: ਬੰਦ ਕਰਨ ਵਾਲਾ ਟੈਗ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ। `</{ $expected }>` ਦੀ ਉਮੀਦ ਸੀ। `{ $found }` ਮਿਲਿਆ

parser-node-unconvertible = { $node } ਨੋਡ ਨੂੰ Dast ਨੋਡ ਵਿੱਚ ਨਹੀਂ ਬਦਲਿਆ ਜਾ ਸਕਿਆ।

## Names

name-attribute-invalid =
    ਗਲਤ ਗੁਣ name='{ $name }'। { $reason ->
        [characters] ਨਾਵਾਂ ਵਿੱਚ ਸਿਰਫ਼ ਅੱਖਰ, ਅੰਕ, ਅੰਡਰਸਕੋਰ ਜਾਂ ਡੈਸ਼ ਹੋ ਸਕਦੇ ਹਨ।
       *[start] ਨਾਂ ਅੱਖਰ ਨਾਲ ਸ਼ੁਰੂ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।
    }

component-name-invalid-start = ਗਲਤ ਹਿੱਸਾ ਨਾਂ "{ $name }"। ਨਾਂ ਅੱਖਰ ਨਾਲ ਸ਼ੁਰੂ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched ਕਿਸਮ ਦੇ ਜਵਾਬ ਕੋਲ video ਗੁਣ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ

answer-video-watched-video-not-reference = videoWatched ਕਿਸਮ ਦੇ ਜਵਾਬ ਦਾ video ਗੁਣ ਹਵਾਲਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ

answer-name-not-single-text = ਜਵਾਬ ਦੇ name ਗੁਣ ਵਿੱਚ ਇੱਕੋ text ਬਾਲ-ਹਿੱਸਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ

## Referencing another document

external-doenetml-recursion-limit = ਬਹੁਤ ਸਾਰੇ ਪੱਧਰਾਂ ਦੇ ਦੁਹਰਾਓ ਕਰਕੇ ਬਾਹਰੀ DoenetML ਨਹੀਂ ਲਿਆਂਦਾ ਜਾ ਸਕਿਆ। ਕੀ ਕੋਈ ਚੱਕਰੀ ਹਵਾਲਾ ਹੈ?

external-doenetml-unavailable = { $attribute }="{ $uri }" ਤੋਂ DoenetML ਨਹੀਂ ਲਿਆਂਦਾ ਜਾ ਸਕਿਆ

external-doenetml-type-mismatch = { $attribute }="{ $uri }" ਤੋਂ ਮਿਲਿਆ DoenetML ਗਲਤ ਹੈ: ਇਹ "{ $componentType }" ਹਿੱਸਾ ਕਿਸਮ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` ਗੁਣ ਬੰਦ ਹੋ ਰਿਹਾ ਹੈ; ਇਸ ਦੀ ਥਾਂ `{ $to }` ਵਰਤੋ।
       *[other] [deprecation] `<{ $component }>` ਉੱਤੇ `{ $from }` ਗੁਣ ਬੰਦ ਹੋ ਰਿਹਾ ਹੈ; ਇਸ ਦੀ ਥਾਂ `{ $to }` ਵਰਤੋ।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` ਵੀ ਦਿੱਤਾ ਹੋਣ ਕਰਕੇ `{ $from }` ਗੁਣ ਬੰਦ ਹੋ ਰਿਹਾ ਹੈ ਅਤੇ ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।
       *[other] [deprecation] `{ $to }` ਵੀ ਦਿੱਤਾ ਹੋਣ ਕਰਕੇ `<{ $component }>` ਉੱਤੇ `{ $from }` ਗੁਣ ਬੰਦ ਹੋ ਰਿਹਾ ਹੈ ਅਤੇ ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` ਉੱਤੇ `{ $attribute }` ਗੁਣ ਬੰਦ ਹੋ ਰਿਹਾ ਹੈ ਅਤੇ ਅਣਡਿੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।


## Language coverage

pluralize-english-only = `<pluralize>` ਸਿਰਫ਼ ਅੰਗਰੇਜ਼ੀ ਦਾ ਬਹੁਵਚਨ ਬਣਾ ਸਕਦਾ ਹੈ, ਇਸ ਲਈ { $locale } ਵਿੱਚ ਲਿਖੇ ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਇਸ ਦੀ ਲਿਖਤ ਉਵੇਂ ਹੀ ਰਹਿੰਦੀ ਹੈ। ਬਹੁਵਚਨ ਰੂਪ ਸਿੱਧਾ ਲਿਖੋ, ਜਾਂ `pluralForm` ਗੁਣ ਨਾਲ ਸੈੱਟ ਕਰੋ।


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` ਪਛਾਣਿਆ ਗਿਆ Doenet ਤੱਤ ਨਹੀਂ ਹੈ।

schema-element-not-allowed-at-root = ਦਸਤਾਵੇਜ਼ ਦੀ ਜੜ੍ਹ ਉੱਤੇ `<{ $tag }>` ਤੱਤ ਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ।

schema-element-not-allowed-inside = `<{ $parent }>` ਦੇ ਅੰਦਰ `<{ $tag }>` ਤੱਤ ਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ।

schema-attribute-unrecognized = `<{ $tag }>` ਤੱਤ ਕੋਲ `{ $attribute }` ਨਾਂ ਦਾ ਗੁਣ ਨਹੀਂ ਹੈ।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` ਤੱਤ ਦਾ `{ $attribute }` ਗੁਣ ਅਜਿਹੀ ਸੂਚੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ ਜਿਸ ਦਾ ਹਰ ਇੰਦਰਾਜ ਇਹਨਾਂ ਵਿੱਚੋਂ ਇੱਕ ਹੋਵੇ: { $allowed }
       *[other] `<{ $tag }>` ਤੱਤ ਦਾ `{ $attribute }` ਗੁਣ ਇਹਨਾਂ ਵਿੱਚੋਂ ਇੱਕ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select ਲਈ ਗਲਤ ਰੂਪ ਨਾਂ। ਰੂਪ ਨਾਂ { $variantName } { $numOptions } ਵਿਕਲਪਾਂ ਵਿੱਚ ਆਉਂਦਾ ਹੈ, ਪਰ ਚੁਣਨ ਦੀ ਗਿਣਤੀ { $numToSelect } ਹੈ।

select-variant-name-without-options = select ਲਈ ਕੁਝ ਰੂਪ ਦਿੱਤੇ ਹਨ, ਪਰ ਸੰਭਵ ਰੂਪ ਨਾਂ ਲਈ ਕੋਈ ਵਿਕਲਪ ਨਹੀਂ ਦਿੱਤਾ: { $variantName }।

select-variant-name-not-possible = select ਲਈ ਦਿੱਤਾ ਰੂਪ ਨਾਂ { $variantName } ਸੰਭਵ ਰੂਪ ਨਾਂ ਨਹੀਂ ਹੈ।

select-too-few-options = ਸਿਰਫ਼ { $numOptions } ਵਿੱਚੋਂ { $numToSelect } ਹਿੱਸੇ ਨਹੀਂ ਚੁਣੇ ਜਾ ਸਕਦੇ।

select-from-sequence-too-few-values = { $length } ਲੰਬਾਈ ਦੀ ਲੜੀ ਵਿੱਚੋਂ { $numToSelect } ਮੁੱਲ ਨਹੀਂ ਚੁਣੇ ਜਾ ਸਕਦੇ।

select-from-sequence-indices-count-mismatch = select ਲਈ ਦਿੱਤੇ ਸੂਚਕਾਂਕਾਂ ਦੀ ਗਿਣਤੀ ਚੁਣਨ ਦੀ ਗਿਣਤੀ ਨਾਲ ਮੇਲ ਖਾਣੀ ਚਾਹੀਦੀ ਹੈ

select-from-sequence-indices-not-integers = select ਲਈ ਦਿੱਤੇ ਸਾਰੇ ਸੂਚਕਾਂਕ ਪੂਰਨ ਅੰਕ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ

select-from-sequence-index-excluded = ਬਾਹਰ ਰੱਖਿਆ selectfromsequence ਸੂਚਕਾਂਕ ਦਿੱਤਾ ਗਿਆ ਹੈ

select-from-sequence-indices-excluded-combination = ਬਾਹਰ ਰੱਖਿਆ ਜੋੜ ਹੋਣ ਵਾਲੇ selectfromsequence ਸੂਚਕਾਂਕ ਦਿੱਤੇ ਗਏ ਹਨ

select-from-sequence-coprime-not-positive-integers = ਧਨ ਪੂਰਨ ਅੰਕ ਨਾ ਚੁਣੇ ਜਾਣ ਕਰਕੇ ਸਹਿ-ਅਭਾਜ ਜੋੜ ਨਹੀਂ ਚੁਣੇ ਜਾ ਸਕਦੇ।

select-from-sequence-coprime-common-factor = ਸਹਿ-ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਨਹੀਂ ਚੁਣੀਆਂ ਜਾ ਸਕਦੀਆਂ। ਸਾਰੇ ਸੰਭਵ ਮੁੱਲਾਂ ਦਾ ਇੱਕ ਸਾਂਝਾ ਗੁਣਨਖੰਡ ਹੈ। ("from" ਜਾਂ "to" ਦੇ ਦਿੱਤੇ ਮੁੱਲ "step" ਨਾਲ ਸਹਿ-ਅਭਾਜ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।)

select-from-sequence-coprime-single-number = 1 ਤੋਂ ਬਿਨਾਂ ਇੱਕੋ ਸੰਖਿਆ ਵਿੱਚੋਂ ਸਹਿ-ਅਭਾਜ ਜੋੜ ਨਹੀਂ ਚੁਣੇ ਜਾ ਸਕਦੇ।

select-from-sequence-excluded-too-many-combinations = selectFromSequence ਵਿੱਚ 70% ਤੋਂ ਵੱਧ ਜੋੜ ਬਾਹਰ ਰੱਖੇ ਗਏ ਹਨ

select-from-sequence-coprime-none-found = ਸਹਿ-ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਨਹੀਂ ਚੁਣੀਆਂ ਜਾ ਸਕੀਆਂ। ਸਾਰੇ ਸੰਭਵ ਮੁੱਲਾਂ ਦਾ ਇੱਕ ਸਾਂਝਾ ਗੁਣਨਖੰਡ ਹੈ।

select-from-sequence-too-few-unique-values = { $numPossibleValues } ਲੰਬਾਈ ਦੀ ਲੜੀ ਵਿੱਚੋਂ { $numToSelect } ਵਿਲੱਖਣ ਮੁੱਲ ਨਹੀਂ ਚੁਣੇ ਜਾ ਸਕਦੇ

select-prime-numbers-too-few-values = { $numValues } ਲੰਬਾਈ ਦੀ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਦੀ ਸੂਚੀ ਵਿੱਚੋਂ { $numToSelect } ਮੁੱਲ ਨਹੀਂ ਚੁਣੇ ਜਾ ਸਕਦੇ

select-prime-numbers-values-count-mismatch = select ਲਈ ਦਿੱਤੇ ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਚੁਣਨ ਦੀ ਗਿਣਤੀ ਨਾਲ ਮੇਲ ਖਾਣੀ ਚਾਹੀਦੀ ਹੈ

select-prime-numbers-values-not-prime = select prime number ਲਈ ਦਿੱਤੇ ਸਾਰੇ ਮੁੱਲ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਦੀ ਸੂਚੀ ਵਿੱਚ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ

select-prime-numbers-values-excluded-combination = selectPrimeNumbers ਲਈ ਦਿੱਤੇ ਮੁੱਲ ਬਾਹਰ ਰੱਖਿਆ ਜੋੜ ਸਨ

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ਵਿੱਚ 70% ਤੋਂ ਵੱਧ ਜੋੜ ਬਾਹਰ ਰੱਖੇ ਗਏ ਹਨ

select-random-combination-fluke = ਬੇਹੱਦ ਅਣਹੋਣੇ ਇਤਫ਼ਾਕ ਕਰਕੇ, ਬੇਤਰਤੀਬ ਮੁੱਲਾਂ ਦਾ ਜੋੜ ਨਹੀਂ ਚੁਣਿਆ ਜਾ ਸਕਿਆ

select-random-value-fluke = ਬੇਹੱਦ ਅਣਹੋਣੇ ਇਤਫ਼ਾਕ ਕਰਕੇ, ਬੇਤਰਤੀਬ ਮੁੱਲ ਨਹੀਂ ਚੁਣਿਆ ਜਾ ਸਕਿਆ
