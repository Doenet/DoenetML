# Kannada diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
        [one] ಎರಡು ತುದಿಬಿಂದುಗಳನ್ನು ಸೂಚಿಸಿದಾಗ { $attributes } ಕಡೆಗಣಿಸಲಾಗುತ್ತದೆ
       *[other] ಎರಡು ತುದಿಬಿಂದುಗಳನ್ನು ಸೂಚಿಸಿದಾಗ { $attributes } ಕಡೆಗಣಿಸಲಾಗುತ್ತವೆ
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] ಒಂದು ತುದಿಬಿಂದು ಮತ್ತು ಒಂದು ಮಧ್ಯಬಿಂದು ಎರಡನ್ನೂ ಸೂಚಿಸಿದಾಗ { $attributes } ಕಡೆಗಣಿಸಲಾಗುತ್ತದೆ
       *[other] ಒಂದು ತುದಿಬಿಂದು ಮತ್ತು ಒಂದು ಮಧ್ಯಬಿಂದು ಎರಡನ್ನೂ ಸೂಚಿಸಿದಾಗ { $attributes } ಕಡೆಗಣಿಸಲಾಗುತ್ತವೆ
    }

line-segment-midpoint-offset-without-midpoint = ಮಧ್ಯಬಿಂದು ಇಲ್ಲದೆ midpointOffset ಗೆ ಯಾವುದೇ ಪರಿಣಾಮವಿಲ್ಲ

## `<line>`

line-points-undetermined-dimensions = ನಿರ್ಧರಿಸದ ಆಯಾಮಗಳ ಬಿಂದುಗಳ ಮೂಲಕ ಹಾದುಹೋಗುವ ಸರಳರೇಖೆ.

line-points-too-few-dimensions = ಸರಳರೇಖೆ ಕನಿಷ್ಠ ಎರಡು ಆಯಾಮಗಳ ಬಿಂದುಗಳ ಮೂಲಕ ಹಾದುಹೋಗಬೇಕು.

line-points-depend-on-variables = ಸರಳರೇಖೆ ಚರಗಳ ಮೇಲೆ ಅವಲಂಬಿತವಾದ ಬಿಂದುಗಳ ಮೂಲಕ ಹಾದುಹೋಗುತ್ತದೆ: { $variables }.

line-equation-invalid-format = { $variable1 } ಮತ್ತು { $variable2 } ಚರಗಳಲ್ಲಿ ಸರಳರೇಖೆಯ ಸಮೀಕರಣಕ್ಕೆ ಅಮಾನ್ಯ ರೂಪ.

## `<ray>`

ray-overprescribed-through = ಕಿರಣವನ್ನು through, endpoint ಮತ್ತು direction ಎಲ್ಲವೂ ನಿರ್ದೇಶಿಸುತ್ತಿವೆ. ಸೂಚಿಸಿದ through ಕಡೆಗಣಿಸಲಾಗಿದೆ.

ray-dimension-mismatch = ಕಿರಣದಲ್ಲಿ numDimensions ಹೊಂದಿಕೆಯಾಗಿಲ್ಲ.

## `<vector>`

vector-overprescribed-head = ಸದಿಶವನ್ನು head, tail ಮತ್ತು displacement ಎಲ್ಲವೂ ನಿರ್ದೇಶಿಸುತ್ತಿವೆ. ಸೂಚಿಸಿದ head ಕಡೆಗಣಿಸಲಾಗಿದೆ.

vector-dimension-mismatch = ಸದಿಶದಲ್ಲಿ numDimensions ಹೊಂದಿಕೆಯಾಗಿಲ್ಲ.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ಗೆ nearestPoint ಸ್ಥಿತಿ ಚರ ಇಲ್ಲದ ಕಾರಣ ಅದರತ್ತ ಸೆಳೆಯಲಾಗದು.

constrain-to-without-nearest-point = `<{ $component }>` ಗೆ nearestPoint ಸ್ಥಿತಿ ಚರ ಇಲ್ಲದ ಕಾರಣ ಅದಕ್ಕೆ ನಿರ್ಬಂಧಿಸಲಾಗದು.

constrain-to-interior-without-nearest-point = `<{ $component }>` ಗೆ nearestPoint ಸ್ಥಿತಿ ಚರ ಇಲ್ಲದ ಕಾರಣ ಅದರ ಒಳಭಾಗಕ್ಕೆ ನಿರ್ಬಂಧಿಸಲಾಗದು.

## `<choiceInput>`

choice-input-label-position-ignored = ಇನ್‌ಲೈನ್ ಅಲ್ಲದ choiceInput ಗೆ labelPosition ಕಡೆಗಣಿಸಲಾಗುತ್ತದೆ

## Ordering children by index

choice-input-indices-count-mismatch = ಸೂಚಿಗಳ ಸಂಖ್ಯೆ choice ಮಕ್ಕಳ ಸಂಖ್ಯೆಗೆ ಹೊಂದದ ಕಾರಣ choiceInput ಗೆ ಸೂಚಿಸಿದ ಸೂಚಿಗಳನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ.

pretzel-indices-count-mismatch = ಸೂಚಿಗಳ ಸಂಖ್ಯೆ problem ಮಕ್ಕಳ ಸಂಖ್ಯೆಗೆ ಹೊಂದದ ಕಾರಣ problem ಗೆ ಸೂಚಿಸಿದ ಸೂಚಿಗಳನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ.

shuffle-indices-count-mismatch = ಸೂಚಿಗಳ ಸಂಖ್ಯೆ ಘಟಕಗಳ ಸಂಖ್ಯೆಗೆ ಹೊಂದದ ಕಾರಣ shuffle ಗೆ ಸೂಚಿಸಿದ ಸೂಚಿಗಳನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ.

indices-ignored-out-of-range = ಕೆಲವು ಸೂಚಿಗಳು ವ್ಯಾಪ್ತಿಯ ಹೊರಗಿರುವ ಕಾರಣ { $component } ಗೆ ಸೂಚಿಸಿದ ಸೂಚಿಗಳನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ.

pretzel-indices-repeated = ಕೆಲವು ಸೂಚಿಗಳು ಪುನರಾವರ್ತನೆಯಾದ ಕಾರಣ pretzel ಗೆ ಸೂಚಿಸಿದ ಸೂಚಿಗಳನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ.

pretzel-circuit-first-index = circuit ಕ್ರಮದಲ್ಲಿ ಮೊದಲ ಸೂಚಿ 1 ಆಗಿರಬೇಕಾದ ಕಾರಣ pretzel ಗೆ ಸೂಚಿಸಿದ ಸೂಚಿಗಳನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ.

## `<shuffle>` and `<sort>`

string-children-need-type = ಸ್ಟ್ರಿಂಗ್ ಮಕ್ಕಳೊಂದಿಗೆ `<{ $component }>` ಕೆಲಸ ಮಾಡಬೇಕಾದರೆ `type` ಗುಣವನ್ನು ಸೂಚಿಸಬೇಕು.

invalid-type-defaulting-to-math = { $component } ಘಟಕಕ್ಕೆ { $type } ಎಂಬುದು ಅಮಾನ್ಯ type. ಅದು math, text, number ಅಥವಾ boolean ಗಳಲ್ಲಿ ಒಂದಾಗಿರಬೇಕು. math ಎಂದು ಹೊಂದಿಸಲಾಗುತ್ತಿದೆ.

string-not-valid-component-to-arrange = "{ $value }" ಎಂಬ ಸ್ಟ್ರಿಂಗ್ { $component } ಮಾಡಲು ತಕ್ಕ ಘಟಕವಲ್ಲ. ಕಡೆಗಣಿಸಲಾಗಿದೆ.

## Types and variables

invalid-type-defaulting-to-number = { $type } ಎಂಬುದು ಅಮಾನ್ಯ type, type ಅನ್ನು number ಎಂದು ಹೊಂದಿಸಲಾಗುತ್ತಿದೆ.

invalid-variable-value = ಚರಕ್ಕೆ ಅಮಾನ್ಯ ಮೌಲ್ಯ: `{ $value }`

## Variants

variant-index-must-be-number = ಪ್ರಭೇದ ಸೂಚಿ { $index } ಒಂದು ಸಂಖ್ಯೆಯಾಗಿರಬೇಕು

variant-index-must-be-integer = ಪ್ರಭೇದ ಸೂಚಿ { $index } ಒಂದು ಪೂರ್ಣಾಂಕವಾಗಿರಬೇಕು

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ನಿರಪೇಕ್ಷ ಅಳತೆಗಳಿಗೆ ಅನುಷ್ಠಾನಗೊಂಡಿಲ್ಲ. ಅಗಲಗಳನ್ನು ಸಾಪೇಕ್ಷವಾಗಿ ಹೊಂದಿಸಲಾಗುತ್ತಿದೆ.

side-by-side-absolute-margins = `<{ $component }>` ನಿರಪೇಕ್ಷ ಅಳತೆಗಳಿಗೆ ಅನುಷ್ಠಾನಗೊಂಡಿಲ್ಲ. ಅಂಚುಗಳನ್ನು ಸಾಪೇಕ್ಷವಾಗಿ ಹೊಂದಿಸಲಾಗುತ್ತಿದೆ.

side-by-side-no-block-child = ಅಮಾನ್ಯ `<{ $component }>`: ಅದಕ್ಕೆ ಕನಿಷ್ಠ ಒಂದು ಬ್ಲಾಕ್ ಮಗು ಇರಬೇಕು.

## `<label>`

label-for-ignored-on-graphical = ಚಿತ್ರಾತ್ಮಕ `<label>` ಮೇಲಿನ `for` ಗುಣವನ್ನು ಕಡೆಗಣಿಸಲಾಗುತ್ತದೆ.

label-for-must-resolve-to-one = `<label>` ಮೇಲಿನ `for` ಗುಣ ನಿಖರವಾಗಿ ಒಂದು ಘಟಕಕ್ಕೆ ನಿರ್ಧರಿತವಾಗಬೇಕು.

label-for-unresolved = `<label>` ಮೇಲಿನ `for` ಗುಣವನ್ನು ಒಂದು ಘಟಕಕ್ಕೆ ನಿರ್ಧರಿಸಲಾಗಲಿಲ್ಲ.

label-for-answer-with-authored-inputs = `<label>` ಮೇಲಿನ `for` ಗುಣ, ಸ್ಪಷ್ಟವಾಗಿ ಬರೆದ ಆದಾನಗಳಿರುವ `<answer>` ಅನ್ನು ಸೂಚಿಸುತ್ತದೆ; ಆದಾನವನ್ನು ನೇರವಾಗಿ ಉಲ್ಲೇಖಿಸಿ.

label-for-answer-without-input = `<label>` ಮೇಲಿನ `for` ಗುಣ, ಹೆಸರಿಸಲು ಆದಾನವಿಲ್ಲದ `<answer>` ಅನ್ನು ಸೂಚಿಸುತ್ತದೆ.

label-for-must-reference-input-or-answer = `<label>` ಮೇಲಿನ `for` ಗುಣ ಒಂದು ಆದಾನವನ್ನು ಅಥವಾ ಒಂದು ಉತ್ತರವನ್ನು ಉಲ್ಲೇಖಿಸಬೇಕು.

## Accessibility

accessibility-short-description-or-decorative = ಪ್ರವೇಶಸಾಧ್ಯತೆಗಾಗಿ `<{ $component }>` ಗೆ ಒಂದು ಸಣ್ಣ ವಿವರಣೆ ಇರಬೇಕು ಅಥವಾ ಅದನ್ನು ಅಲಂಕಾರಿಕ ಎಂದು ಸೂಚಿಸಬೇಕು.

accessibility-video-short-description = ಪ್ರವೇಶಸಾಧ್ಯತೆಗಾಗಿ `<video>` ಗೆ ಒಂದು ಸಣ್ಣ ವಿವರಣೆ ಇರಬೇಕು.

accessibility-input-short-description-or-label = ಪ್ರವೇಶಸಾಧ್ಯತೆಗಾಗಿ `<{ $component }>` ಗೆ ಒಂದು ಸಣ್ಣ ವಿವರಣೆ ಅಥವಾ ಒಂದು ಹೆಸರು ಇರಬೇಕು.

accessibility-answer-input-short-description-or-label = ಪ್ರವೇಶಸಾಧ್ಯತೆಗಾಗಿ, ಆದಾನವನ್ನು ಸೃಷ್ಟಿಸುವ `<answer>` ಗೆ ಒಂದು ಸಣ್ಣ ವಿವರಣೆ ಅಥವಾ ಒಂದು ಹೆಸರು ಇರಬೇಕು.

accessibility-short-description-contains-math = ಸಣ್ಣ ವಿವರಣೆಗಳಲ್ಲಿ `<{ $component }>` ನಂತಹ ಗಣಿತ ಘಟಕಗಳು ಇರಬಾರದು. ಗಣಿತವನ್ನು ಪದಗಳಲ್ಲಿ ಬರೆಯಿರಿ.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] ವಿಭಾಗ ಶೀರ್ಷಿಕೆ ಪಠ್ಯಕ್ಕೆ { $colorName } ನ ವೈದೃಶ್ಯ ಸಾಕಾಗುವುದಿಲ್ಲ (ಕತ್ತಲ ಶೈಲಿ) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ಕನಿಷ್ಠ { $threshold }:1 ಬೇಕು).
       *[other] ವಿಭಾಗ ಶೀರ್ಷಿಕೆ ಪಠ್ಯಕ್ಕೆ { $colorName } ನ ವೈದೃಶ್ಯ ಸಾಕಾಗುವುದಿಲ್ಲ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ಕನಿಷ್ಠ { $threshold }:1 ಬೇಕು).
    }

## `<circle>`

circle-through-points-non-numerical = ಬಿಂದುಗಳಿಗೆ ಸಂಖ್ಯಾ ಮೌಲ್ಯಗಳಿಲ್ಲದ ಸಂದರ್ಭದಲ್ಲಿ { $count } ಬಿಂದುಗಳ ಮೂಲಕ ಹಾದುಹೋಗುವ `<circle>` ಅನುಷ್ಠಾನಗೊಂಡಿಲ್ಲ.

circle-too-many-through-points = 3 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಬಿಂದುಗಳ ಮೂಲಕ ಹಾದುಹೋಗುವ ವೃತ್ತವನ್ನು ಲೆಕ್ಕಿಸಲಾಗದು.

circle-overprescribed-radius-center-points = ತ್ರಿಜ್ಯ, ಕೇಂದ್ರ ಮತ್ತು ಹಾದುಹೋಗುವ ಬಿಂದುಗಳು ಮೂರನ್ನೂ ಸೂಚಿಸಿದ ವೃತ್ತವನ್ನು ಲೆಕ್ಕಿಸಲಾಗದು.

circle-center-with-multiple-points = ಸೂಚಿಸಿದ ಕೇಂದ್ರದೊಂದಿಗೆ 1 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಬಿಂದುವಿನ ಮೂಲಕ ಹಾದುಹೋಗುವ ವೃತ್ತವನ್ನು ಲೆಕ್ಕಿಸಲಾಗದು.

circle-radius-too-small = ವೃತ್ತವನ್ನು ಲೆಕ್ಕಿಸಲಾಗದು: ಎರಡು ಬಿಂದುಗಳ ನಡುವಿನ ಅಂತರ { $distance } ಆಗಿರುವುದರಿಂದ, ಸೂಚಿಸಿದ ತ್ರಿಜ್ಯ { $radius } ತೀರಾ ಚಿಕ್ಕದು.

circle-radius-with-many-points = ಸೂಚಿಸಿದ ತ್ರಿಜ್ಯದೊಂದಿಗೆ ಎರಡಕ್ಕಿಂತ ಹೆಚ್ಚು ಬಿಂದುಗಳ ಮೂಲಕ ಹಾದುಹೋಗುವ ವೃತ್ತವನ್ನು ಸೃಷ್ಟಿಸಲಾಗದು.

circle-invalid-center-or-through-points = ವೃತ್ತದ ಕೇಂದ್ರ ಅಥವಾ ಹಾದುಹೋಗುವ ಬಿಂದುಗಳು ಅಮಾನ್ಯ.

circle-radius-center-with-multiple-points = ಸೂಚಿಸಿದ ಕೇಂದ್ರದೊಂದಿಗೆ 1 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಬಿಂದುವಿನ ಮೂಲಕ ಹಾದುಹೋಗುವ ವೃತ್ತದ ತ್ರಿಜ್ಯವನ್ನು ಲೆಕ್ಕಿಸಲಾಗದು.

circle-change-radius-non-numerical = ಸಂಖ್ಯಾ ಮೌಲ್ಯವಿಲ್ಲದ ಬಿಂದುಗಳ ಮೂಲಕ ಹಾದುಹೋಗುವ ವೃತ್ತದ ತ್ರಿಜ್ಯವನ್ನು ಬದಲಿಸಲಾಗದು

circle-radius-with-points-non-numerical = ಸಂಖ್ಯಾ ಮೌಲ್ಯಗಳಿಲ್ಲದಿದ್ದಾಗ, ಸೂಚಿಸಿದ ತ್ರಿಜ್ಯದೊಂದಿಗೆ ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು ಬಿಂದುವಿನ ಮೂಲಕ ಹಾದುಹೋಗುವ ವೃತ್ತವನ್ನು ಸೃಷ್ಟಿಸಲಾಗದು.

circle-change-center-non-numerical = ಸಂಖ್ಯಾ ಮೌಲ್ಯವಿಲ್ಲದ ಬಿಂದುಗಳ ಮೂಲಕ ಹಾದುಹೋಗುವ ವೃತ್ತದ ಕೇಂದ್ರವನ್ನು ಬದಲಿಸುವುದು ಅನುಷ್ಠಾನಗೊಂಡಿಲ್ಲ.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] ಉತ್ಪನ್ನದ ಪ್ರಾಂತಕ್ಕೆ ಸಾಕಷ್ಟು ಆಯಾಮಗಳಿಲ್ಲ. ಪ್ರಾಂತದಲ್ಲಿ { $intervals } ಅಂತರವಿದೆ, ಆದರೆ ಉತ್ಪನ್ನಕ್ಕೆ { $inputs ->
            [one] { $inputs } ಆದಾನ
           *[other] { $inputs } ಆದಾನಗಳು
        } ಇವೆ.
       *[other] ಉತ್ಪನ್ನದ ಪ್ರಾಂತಕ್ಕೆ ಸಾಕಷ್ಟು ಆಯಾಮಗಳಿಲ್ಲ. ಪ್ರಾಂತದಲ್ಲಿ { $intervals } ಅಂತರಗಳಿವೆ, ಆದರೆ ಉತ್ಪನ್ನಕ್ಕೆ { $inputs ->
            [one] { $inputs } ಆದಾನ
           *[other] { $inputs } ಆದಾನಗಳು
        } ಇವೆ.
    }

function-domain-invalid-format = ಉತ್ಪನ್ನದ ಪ್ರಾಂತಕ್ಕೆ ಅಮಾನ್ಯ ರೂಪ.

function-ignoring-non-numerical =
    { $type ->
        [maximum] ಉತ್ಪನ್ನದ ಸಂಖ್ಯೇತರ ಗರಿಷ್ಠವನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ.
        [minimum] ಉತ್ಪನ್ನದ ಸಂಖ್ಯೇತರ ಕನಿಷ್ಠವನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ.
        [extremum] ಉತ್ಪನ್ನದ ಸಂಖ್ಯೇತರ ಪರಮಾವಧಿಯನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ.
        [point] ಉತ್ಪನ್ನದ ಸಂಖ್ಯೇತರ ಬಿಂದುವನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ.
        [slope] ಉತ್ಪನ್ನದ ಸಂಖ್ಯೇತರ ಇಳಿಜಾರನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ.
       *[other] ಉತ್ಪನ್ನದ ಸಂಖ್ಯೇತರ { $type } ಕಡೆಗಣಿಸಲಾಗಿದೆ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] ಉತ್ಪನ್ನದ ಖಾಲಿ ಗರಿಷ್ಠವನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ.
        [minimum] ಉತ್ಪನ್ನದ ಖಾಲಿ ಕನಿಷ್ಠವನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ.
        [extremum] ಉತ್ಪನ್ನದ ಖಾಲಿ ಪರಮಾವಧಿಯನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ.
        [point] ಉತ್ಪನ್ನದ ಖಾಲಿ ಬಿಂದುವನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ.
       *[other] ಉತ್ಪನ್ನದ ಖಾಲಿ { $type } ಕಡೆಗಣಿಸಲಾಗಿದೆ.
    }

function-points-too-close = ಉತ್ಪನ್ನದಲ್ಲಿ ತೀರಾ ಹತ್ತಿರವಿರುವ ಎರಡು ಬಿಂದುಗಳಿವೆ. ಉತ್ಪನ್ನವನ್ನು ವ್ಯಾಖ್ಯಾನಿಸಲಾಗದು.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] ಉತ್ಪನ್ನದ ಆದಾನಗಳ ಸಂಖ್ಯೆ ಪ್ರದಾನಗಳ ಸಂಖ್ಯೆಗೆ ಸಮನಾಗಿದ್ದರೆ ಮಾತ್ರ ಉತ್ಪನ್ನದ ಪುನರಾವರ್ತನೆಗಳು ಸಾಧ್ಯ. ಈ ಉತ್ಪನ್ನಕ್ಕೆ { $inputs } ಆದಾನ ಮತ್ತು { $outputs ->
            [one] { $outputs } ಪ್ರದಾನ
           *[other] { $outputs } ಪ್ರದಾನಗಳು
        } ಇವೆ.
       *[other] ಉತ್ಪನ್ನದ ಆದಾನಗಳ ಸಂಖ್ಯೆ ಪ್ರದಾನಗಳ ಸಂಖ್ಯೆಗೆ ಸಮನಾಗಿದ್ದರೆ ಮಾತ್ರ ಉತ್ಪನ್ನದ ಪುನರಾವರ್ತನೆಗಳು ಸಾಧ್ಯ. ಈ ಉತ್ಪನ್ನಕ್ಕೆ { $inputs } ಆದಾನಗಳು ಮತ್ತು { $outputs ->
            [one] { $outputs } ಪ್ರದಾನ
           *[other] { $outputs } ಪ್ರದಾನಗಳು
        } ಇವೆ.
    }

## `<sequence>`

sequence-invalid-length = ಅನುಕ್ರಮದ ಉದ್ದ ಅಮಾನ್ಯ. ಅದು ಋಣಾತ್ಮಕವಲ್ಲದ ಪೂರ್ಣಾಂಕವಾಗಿರಬೇಕು.

sequence-invalid-step = ಅನುಕ್ರಮದ ಹೆಜ್ಜೆ ಅಮಾನ್ಯ. { $type } ಬಗೆಯ ಅನುಕ್ರಮಕ್ಕೆ ಅದು ಒಂದು ಸಂಖ್ಯೆಯಾಗಿರಬೇಕು.

sequence-invalid-endpoint-number = ಸಂಖ್ಯಾ ಅನುಕ್ರಮದ "{ $attribute }" ಅಮಾನ್ಯ. ಅದು ಒಂದು ಸಂಖ್ಯೆಯಾಗಿರಬೇಕು.

sequence-invalid-endpoint-letters = ಅಕ್ಷರ ಅನುಕ್ರಮದ "{ $attribute }" ಅಮಾನ್ಯ. ಅದು ಒಂದು ಅಕ್ಷರ ಸಂಯೋಜನೆಯಾಗಿರಬೇಕು.

sequence-invalid-endpoint = ಅನುಕ್ರಮದ "{ $attribute }" ಅಮಾನ್ಯ.

select-from-sequence-coprime-not-numbers = ಸಂಖ್ಯೆಗಳನ್ನು ಆರಿಸದ ಕಾರಣ coprime ಕಡೆಗಣಿಸಲಾಗಿದೆ

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations ಸೂಚಿಸಿದ ಕಾರಣ coprime ಕಡೆಗಣಿಸಲಾಗಿದೆ

## Resolving a `target`

target-not-found = `<{ $source }>` ಗೆ ಅಮಾನ್ಯ target: ಗುರಿಯನ್ನು ಕಂಡುಹಿಡಿಯಲಾಗಲಿಲ್ಲ.

target-state-variable-not-found = `<{ $source }>` ಗೆ ಅಮಾನ್ಯ target: `<{ $component }>` ಮೇಲೆ "{ $property }" ಎಂಬ ಹೆಸರಿನ ಸ್ಥಿತಿ ಚರವನ್ನು ಕಂಡುಹಿಡಿಯಲಾಗಲಿಲ್ಲ.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` ನ ಚರಗಳು ಸ್ವತಂತ್ರ ಚರಕ್ಕಿಂತ ಬೇರೆಯಾಗಿರಬೇಕು.

ode-system-duplicate-variable-names = ಒಂದೇ ಅವಲಂಬಿತ ಚರ ಹೆಸರುಗಳೊಂದಿಗೆ ODE RHS ಉತ್ಪನ್ನಗಳನ್ನು ವ್ಯಾಖ್ಯಾನಿಸಲಾಗದು.

ode-system-rhs-function-error = ODE RHS ಉತ್ಪನ್ನವನ್ನು ವ್ಯಾಖ್ಯಾನಿಸಲಾಗದು. mathjs ಉತ್ಪನ್ನವನ್ನು ಸೃಷ್ಟಿಸುವಲ್ಲಿ ದೋಷ.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } ಸರಳರೇಖೆಗಳ ನಡುವಿನ ಕೋನವನ್ನು ವ್ಯಾಖ್ಯಾನಿಸಲಾಗದು

angle-invalid-through-point = `<angle>` ನ through ನಲ್ಲಿ ಅಮಾನ್ಯ ಬಿಂದು

parabola-vertex-too-many-points = ಶೃಂಗದೊಂದಿಗೆ 1 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಬಿಂದುವಿನ ಮೂಲಕ ಹಾದುಹೋಗುವ ಪರವಲಯ ಅನುಷ್ಠಾನಗೊಂಡಿಲ್ಲ.

parabola-too-many-points = 3 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಬಿಂದುಗಳ ಮೂಲಕ ಹಾದುಹೋಗುವ ಪರವಲಯ ಅನುಷ್ಠಾನಗೊಂಡಿಲ್ಲ.

intersection-too-many-items = ಎರಡಕ್ಕಿಂತ ಹೆಚ್ಚು ಅಂಶಗಳಿಗೆ ಛೇದನ ಅನುಷ್ಠಾನಗೊಂಡಿಲ್ಲ

## Other math components

ionic-compound-not-two-ions = ಎರಡು ಅಯಾನುಗಳ ಹೊರತು ಬೇರಾವುದಕ್ಕೂ ಅಯಾನಿಕ ಸಂಯುಕ್ತ ಅನುಷ್ಠಾನಗೊಂಡಿಲ್ಲ.

ionic-compound-needs-cation-and-anion = ಒಂದು ಕ್ಯಾಟಯಾನು ಮತ್ತು ಒಂದು ಅನಯಾನಿಗೆ ಮಾತ್ರ ಅಯಾನಿಕ ಸಂಯುಕ್ತ ಅನುಷ್ಠಾನಗೊಂಡಿದೆ.

solve-equations-cannot-evaluate = ಸಮೀಕರಣವನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಾಗದ ಕಾರಣ ಅದನ್ನು ಬಿಡಿಸಲಾಗದು: { $equation }

math-operators-operand-number-required = ಗಣಿತ ಪರಿಕರ್ಮ್ಯವನ್ನು ಹೊರತೆಗೆಯುವಾಗ operandNumber ಸೂಚಿಸಬೇಕು.

eigen-decomposition-failed = ಮ್ಯಾಟ್ರಿಕ್ಸಿನ ಐಗನ್ ಮೌಲ್ಯಗಳನ್ನು ಲೆಕ್ಕಿಸಲಾಗಲಿಲ್ಲ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } ಎಂಬ ನಿಯತಾಂಕ ಮಾದರಿಯಲ್ಲಿ ಬರದ ಕಾರಣ ಅದು ಯಾವಾಗಲೂ ಖಾಲಿಯೊಂದಿಗೆ ಹೊಂದುತ್ತದೆ.
       *[other] `<matchesPattern>`: { $parameters } ಎಂಬ ನಿಯತಾಂಕಗಳು ಮಾದರಿಯಲ್ಲಿ ಬರದ ಕಾರಣ ಅವು ಯಾವಾಗಲೂ ಖಾಲಿಯೊಂದಿಗೆ ಹೊಂದುತ್ತವೆ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ಅನ್ನು ಅರ್ಥೈಸಲಾಗಲಿಲ್ಲ. ಅದು none, medium, dense ಅಥವಾ ಒಂದು ಸ್ಥಳಾವಕಾಶದಿಂದ ಬೇರ್ಪಟ್ಟ ಎರಡು ಧನ ಸಂಖ್ಯೆಗಳು — ಉದಾಹರಣೆಗೆ grid="1 0.5" — ಆಗಿರಬೇಕು. ಯಾವುದೇ ಜಾಲರಿ ಬರೆಯಲಾಗಿಲ್ಲ.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure ರೆಂಡರರ್‌ನಲ್ಲಿ xLabelPosition="left" ಬೆಂಬಲಿತವಲ್ಲ; ಬಲ-ಸ್ಥಾನದ ವರ್ತನೆ ಬಳಸಲಾಗುತ್ತಿದೆ.

prefigure-y-label-position-unsupported = `<graph>`: prefigure ರೆಂಡರರ್‌ನಲ್ಲಿ yLabelPosition="bottom" ಬೆಂಬಲಿತವಲ್ಲ; ಮೇಲ್-ಸ್ಥಾನದ ವರ್ತನೆ ಬಳಸಲಾಗುತ್ತಿದೆ.

prefigure-invalid-axis-bounds = `<graph>`: prefigure ಪರಿವರ್ತನೆಗೆ ಅಕ್ಷದ ಮಿತಿಗಳು ಅಮಾನ್ಯ; ಪೂರ್ವನಿಯೋಜಿತ bbox (-10,-10,10,10) ಬಳಸಲಾಗುತ್ತಿದೆ.

prefigure-invalid-width = `<graph>`: prefigure ಪರಿವರ್ತನೆಗೆ ಅಗಲ ಅಮಾನ್ಯ; ಪೂರ್ವನಿಯೋಜಿತ ರೇಖಾಚಿತ್ರ ಅಗಲ 425 ಬಳಸಲಾಗುತ್ತಿದೆ.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ಪರಿವರ್ತನೆಗೆ aspectRatio ಅಮಾನ್ಯ; ಪೂರ್ವನಿಯೋಜಿತ ಅನುಪಾತ 1 ಬಳಸಲಾಗುತ್ತಿದೆ.

prefigure-grid-spacing-too-fine = `<graph>`: ಅಕ್ಷದ ಮಿತಿಗಳಿಗೆ ಜಾಲರಿಯ ಅಂತರ ತೀರಾ ಸೂಕ್ಷ್ಮವಾಗಿದೆ; prefigure ರೆಂಡರರ್‌ನಲ್ಲಿ ಜಾಲರಿಯನ್ನು ಬಿಡಲಾಗಿದೆ.

prefigure-annotations-not-rendered = `<graph>`: PreFigure ರೆಂಡರರ್ ಬಳಸದಿದ್ದಾಗ ಟಿಪ್ಪಣಿಗಳನ್ನು ತೋರಿಸಲಾಗುವುದಿಲ್ಲ.

multiple-annotations-children = `<graph>` ನಲ್ಲಿ ಹಲವು `<annotations>` ಮಕ್ಕಳು ಕಂಡುಬಂದಿವೆ; ಕೊನೆಯದನ್ನು ಹೊರತುಪಡಿಸಿ ಉಳಿದವನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ.

## Referring to other components

copy-unrecognized-component-type = ಗುರುತಿಸದ ಘಟಕ ಬಗೆಯನ್ನು ವಿಸ್ತರಿಸಲಾಗದು ಅಥವಾ ನಕಲಿಸಲಾಗದು: { $type }.

copy-prop-not-found = { $component } ಬಗೆಯ ಘಟಕದ ಮೇಲೆ { $property } ಗುಣವನ್ನು ಕಂಡುಹಿಡಿಯಲಾಗಲಿಲ್ಲ

collect-no-source = collect ಗೆ ಯಾವುದೇ ಮೂಲ ಕಂಡುಬಂದಿಲ್ಲ.

collect-invalid-component-type = `<{ $component }>` ಅಮಾನ್ಯ ಘಟಕ ಬಗೆಯಾದ ಕಾರಣ ಆ ಬಗೆಯ ಘಟಕಗಳನ್ನು ಸಂಗ್ರಹಿಸಲಾಗದು.

reference-index-unavailable = `{ $reference }` ಎಂಬ ಸೂಚಿಯನ್ನು ಉಲ್ಲೇಖಿಸಲಾಗದು

## `<callAction>`

component-action-unavailable = `{ $reference }` ಘಟಕದ ಮೇಲೆ { $action } ಅನ್ನು ಕರೆಯಲಾಗದು

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ದತ್ತಾಂಶದ ಆಕಾರ ಅಮಾನ್ಯ. ಸಾಲುಗಳ ಉದ್ದಗಳು ಅಸಮಂಜಸ. componentIdx :{ $componentIdx } ನಲ್ಲಿ ಕಂಡುಬಂದಿದೆ

data-frame-duplicate-column-names = ದತ್ತಾಂಶದಲ್ಲಿ ಕಂಬಗಳ ಹೆಸರುಗಳು ಪುನರಾವರ್ತನೆಯಾಗಿವೆ. componentIdx :{ $componentIdx } ನಲ್ಲಿ ಕಂಡುಬಂದಿದೆ

data-frame-missing-column-name = ದತ್ತಾಂಶದಲ್ಲಿ ಒಂದು ಕಂಬದ ಹೆಸರು ಇಲ್ಲ. componentIdx :{ $componentIdx } ನಲ್ಲಿ ಕಂಡುಬಂದಿದೆ

## `<answer>` and scoring

answer-award-depends-on-own-response = ಈ ಉತ್ತರದ ಒಂದು award, ಅದೇ answer ಟ್ಯಾಗ್ ಸಲ್ಲಿಸಿದ ಉತ್ತರವನ್ನೇ ಆಧರಿಸಿದೆ; ಇದು ಅನಿರೀಕ್ಷಿತ ವರ್ತನೆಗೆ ಕಾರಣವಾಗುತ್ತದೆ.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` ಇರುವ ಧಾರಕದೊಳಗಿನ `<answer>` ಮೇಲೆ `maxNumAttempts` ಹೊಂದಿಸುವುದರಿಂದ ಯಾವುದೇ ಪರಿಣಾಮವಿಲ್ಲ; ಪ್ರಯತ್ನಗಳ ಸಂಖ್ಯೆಯನ್ನು ಆ ಧಾರಕವೇ ನಿಯಂತ್ರಿಸುತ್ತದೆ. `maxNumAttempts` ಅನ್ನು ಧಾರಕದ ಮೇಲೆ ಹೊಂದಿಸಿ.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` ಇರುವ ಇನ್ನೊಂದು ಧಾರಕದೊಳಗಿನ, `sectionWideCheckWork` ಇರುವ ಧಾರಕದ ಮೇಲೆ `maxNumAttempts` ಹೊಂದಿಸುವುದರಿಂದ ಯಾವುದೇ ಪರಿಣಾಮವಿಲ್ಲ; ಪ್ರಯತ್ನಗಳ ಸಂಖ್ಯೆಯನ್ನು ಹೊರಗಿನ ಧಾರಕವೇ ನಿಯಂತ್ರಿಸುತ್ತದೆ. `maxNumAttempts` ಅನ್ನು ಹೊರಗಿನ ಧಾರಕದ ಮೇಲೆ ಹೊಂದಿಸಿ.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality ಹೊಂದಿಸದೆ { $attributes } ಗುಣಕ್ಕೆ ಯಾವುದೇ ಪರಿಣಾಮವಿಲ್ಲ.
       *[other] symbolicEquality ಹೊಂದಿಸದೆ { $attributes } ಗುಣಗಳಿಗೆ ಯಾವುದೇ ಪರಿಣಾಮವಿಲ್ಲ.
    }

answer-invalid-type = ಉತ್ತರಕ್ಕೆ ಅಮಾನ್ಯ ಬಗೆ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` ಘಟಕಕ್ಕೆ ಹೆಸರಿಲ್ಲದ ಕಾರಣ, ಅದನ್ನು module ಗುಣವಾಗಿ ಬಳಸಲಾಗದು

module-attribute-name-already-defined = `<module>` ಘಟಕ ಬಗೆಯಲ್ಲಿ "{ $name }" ಎಂಬ ಗುಣ ಈಗಾಗಲೇ ವ್ಯಾಖ್ಯಾನಿತವಾದ ಕಾರಣ, `<{ $component } name="{ $name }">` ಎಂಬ ಘಟಕವನ್ನು module ಗೆ ಗುಣವಾಗಿ ಬಳಸಲಾಗದು.

conditional-content-condition-ignored = case ಅಥವಾ else ಮಕ್ಕಳಿರುವ `<conditionalContent>` ಘಟಕದ ಮೇಲೆ `condition` ಗುಣವನ್ನು ಕಡೆಗಣಿಸಲಾಗುತ್ತದೆ.

slider-markers-type-mismatch = ಗುರುತುಗಳ ಬಗೆ slider ನ ಬಗೆಗೆ ಹೊಂದುವುದಿಲ್ಲ.

pretzel-problem-needs-statement-and-answer = ಅಮಾನ್ಯ pretzel: ಪ್ರತಿ `<problem>` ನಲ್ಲಿ ಒಂದು `<statement>` ಮತ್ತು ಒಂದು `<answer>` ಇರಬೇಕು.

pretzel-circuit-first-problem-distractor = ಅಮಾನ್ಯ pretzel: mode="circuit" ನಲ್ಲಿ ಮೊದಲ `<problem>` ಗಮನ ಬೇರೆಡೆ ಸೆಳೆಯುವುದಾಗಿರಬಾರದು.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` ಗುಣಕ್ಕೆ ಅಮಾನ್ಯ ಮೌಲ್ಯ { $values }; ಕಡೆಗಣಿಸಲಾಗಿದೆ.
       *[other] `{ $attribute }` ಗುಣಕ್ಕೆ ಅಮಾನ್ಯ ಮೌಲ್ಯಗಳು { $values }; ಕಡೆಗಣಿಸಲಾಗಿದೆ.
    }

attribute-must-be-references = `{ $attribute }` ಗುಣಕ್ಕೆ `{ $value }` ಅಮಾನ್ಯ ಮೌಲ್ಯ. ಆ ಗುಣ `$` ನಿಂದ ಆರಂಭವಾಗುವ ಉಲ್ಲೇಖಗಳಿಂದ ಕೂಡಿರಬೇಕು.

math-input-invalid-function-names = <mathInput>: { $attribute } ನಲ್ಲಿನ ಅಮಾನ್ಯ ಉತ್ಪನ್ನ ಹೆಸರು(ಗಳ)ನ್ನು ಕಡೆಗಣಿಸಲಾಗಿದೆ: { $names }. ಪ್ರತಿ ಹೆಸರಿನ ಪ್ರದರ್ಶನ ಭಾಗ ಕನಿಷ್ಠ 2 ಅಕ್ಷರಗಳನ್ನು (ಅಕ್ಷರಗಳು ಅಥವಾ ಗೆರೆಗಳು) ಹೊಂದಿರಬೇಕು; ಆನಂತರ ಐಚ್ಛಿಕವಾಗಿ `|<mathspeak alternative>` ಪ್ರತ್ಯಯ ಬರಬಹುದು.

## Building components from the source

component-type-invalid = ಅಮಾನ್ಯ ಘಟಕ ಬಗೆ: `<{ $componentType }>`

attribute-repeated = { $attribute } ಗುಣವನ್ನು ಪುನರಾವರ್ತಿಸಲಾಗದು.

attribute-invalid-for-component = `<{ $componentType }>` ಬಗೆಯ ಘಟಕಕ್ಕೆ "{ $attribute }" ಅಮಾನ್ಯ ಗುಣ.

## Style definition contrast

style-definition-insufficient-contrast =
    ಶೈಲಿ ವ್ಯಾಖ್ಯೆ { $styleNumber } ರಲ್ಲಿ { $context ->
        [text-on-background] ಹಿನ್ನೆಲೆ ಬಣ್ಣದ ಮೇಲಿನ ಪಠ್ಯ ಬಣ್ಣದ
        [high-contrast] ಕ್ಯಾನ್ವಾಸಿನ ಮೇಲಿನ ಹೆಚ್ಚು-ವೈದೃಶ್ಯ ಬಣ್ಣದ
        [line] ಕ್ಯಾನ್ವಾಸಿನ ಮೇಲಿನ ರೇಖೆಯ ಬಣ್ಣದ
        [marker] ಕ್ಯಾನ್ವಾಸಿನ ಮೇಲಿನ ಗುರುತಿನ ಬಣ್ಣದ
       *[text-on-canvas] ಕ್ಯಾನ್ವಾಸಿನ ಮೇಲಿನ ಪಠ್ಯ ಬಣ್ಣದ
    } ವೈದೃಶ್ಯ ಸಾಕಾಗುವುದಿಲ್ಲ{ $mode ->
        [dark] { " (ಕತ್ತಲ ಶೈಲಿ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ಕನಿಷ್ಠ { $threshold }:1 ಬೇಕು).

style-definition-dark-mode-text-background-contrast =
    ಶೈಲಿ ವ್ಯಾಖ್ಯೆ { $styleNumber } ಬೆಳಕಿನ ಶೈಲಿಗೆ ಸಾಕಷ್ಟು ವೈದೃಶ್ಯ ನೀಡುವ ಬಣ್ಣಗಳನ್ನು ಸೂಚಿಸಿದ್ದರೂ, ಅವುಗಳಿಂದ ಪಡೆದ ಕತ್ತಲ ಶೈಲಿಯ ಬಣ್ಣಗಳಲ್ಲಿ ಹಿನ್ನೆಲೆ ಬಣ್ಣದ ಮೇಲಿನ ಪಠ್ಯ ಬಣ್ಣದ ವೈದೃಶ್ಯ ಸಾಕಾಗುವುದಿಲ್ಲ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ಕನಿಷ್ಠ { $threshold }:1 ಬೇಕು). { $suggestion ->
        [available] ಕತ್ತಲ ಶೈಲಿಯಲ್ಲಿ ಸಾಕಷ್ಟು ವೈದೃಶ್ಯಕ್ಕಾಗಿ, ಬೆಳಕಿನ ಶೈಲಿಯ ವೈದೃಶ್ಯವನ್ನು ಹೆಚ್ಚಿಸಿ (ಉದಾ. { $lightAttribute }="{ $lightColor }" ಹೊಂದಿಸಿ) ಅಥವಾ ಕತ್ತಲ ಶೈಲಿಯ ಬಣ್ಣವನ್ನು ಮೀರಿಸಿ (ಉದಾ. { $darkAttribute }="{ $darkColor }" ಹೊಂದಿಸಿ).
       *[none] ಕತ್ತಲ ಶೈಲಿಯಲ್ಲಿ ಸಾಕಷ್ಟು ವೈದೃಶ್ಯಕ್ಕಾಗಿ, ಬೆಳಕಿನ ಶೈಲಿಯ ವೈದೃಶ್ಯವನ್ನು ಹೆಚ್ಚಿಸಿ ಅಥವಾ ಪಡೆದ ಬಣ್ಣಗಳನ್ನು textColorDarkMode ಮತ್ತು/ಅಥವಾ backgroundColorDarkMode ನಿಂದ ಮೀರಿಸಿ.
    }

style-definition-dark-mode-text-canvas-contrast =
    ಶೈಲಿ ವ್ಯಾಖ್ಯೆ { $styleNumber } ಬೆಳಕಿನ ಶೈಲಿಗೆ ಸಾಕಷ್ಟು ವೈದೃಶ್ಯ ನೀಡುವ ಪಠ್ಯ ಬಣ್ಣವನ್ನು ಸೂಚಿಸಿದ್ದರೂ, ಅದರಿಂದ ಪಡೆದ ಕತ್ತಲ ಶೈಲಿಯ ಪಠ್ಯ ಬಣ್ಣಕ್ಕೆ ಕ್ಯಾನ್ವಾಸಿನ ಮೇಲಿನ ವೈದೃಶ್ಯ ಸಾಕಾಗುವುದಿಲ್ಲ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ಕನಿಷ್ಠ { $threshold }:1 ಬೇಕು). { $suggestion ->
        [available] ಕತ್ತಲ ಶೈಲಿಯಲ್ಲಿ ಸಾಕಷ್ಟು ವೈದೃಶ್ಯಕ್ಕಾಗಿ, ಬೆಳಕಿನ ಶೈಲಿಯ ವೈದೃಶ್ಯವನ್ನು ಹೆಚ್ಚಿಸಿ (ಉದಾ. textColor="{ $lightColor }" ಹೊಂದಿಸಿ) ಅಥವಾ ಕತ್ತಲ ಶೈಲಿಯ ಬಣ್ಣವನ್ನು ಮೀರಿಸಿ (ಉದಾ. textColorDarkMode="{ $darkColor }" ಹೊಂದಿಸಿ).
       *[none] ಕತ್ತಲ ಶೈಲಿಯಲ್ಲಿ ಸಾಕಷ್ಟು ವೈದೃಶ್ಯಕ್ಕಾಗಿ, ಬೆಳಕಿನ ಶೈಲಿಯ ವೈದೃಶ್ಯವನ್ನು ಹೆಚ್ಚಿಸಿ ಅಥವಾ ಪಡೆದ ಬಣ್ಣವನ್ನು textColorDarkMode ನಿಂದ ಮೀರಿಸಿ.
    }

section-multiple-style-palettes = ಒಂದು ವಿಭಾಗ ಒಂದೇ ಒಂದು <stylePalette> ಅನ್ನು ಆರಿಸಬಹುದು; ಕೊನೆಯದನ್ನು ಬಳಸಲಾಗುತ್ತಿದೆ.

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect ಋಣಾತ್ಮಕವಲ್ಲದ ಪೂರ್ಣಾಂಕವಾಗಿಲ್ಲದ ಕಾರಣ { $component } ನ ಅನನ್ಯ ಪ್ರಭೇದಗಳನ್ನು ನಿರ್ಧರಿಸಲಾಗದು.

variant-num-to-select-not-constant-number = numToSelect ಸ್ಥಿರ ಸಂಖ್ಯೆಯಾಗಿಲ್ಲದ ಕಾರಣ { $component } ನ ಅನನ್ಯ ಪ್ರಭೇದಗಳನ್ನು ನಿರ್ಧರಿಸಲಾಗದು.

variant-with-replacement-not-constant-boolean = withReplacement ಸ್ಥಿರ boolean ಆಗಿಲ್ಲದ ಕಾರಣ { $component } ನ ಅನನ್ಯ ಪ್ರಭೇದಗಳನ್ನು ನಿರ್ಧರಿಸಲಾಗದು.

variant-select-weight-disables-unique = selectWeight ಅಥವಾ selectForVariants ಸೂಚಿಸಿದ ಒಂದು ಆಯ್ಕೆ ಇದ್ದರೆ select ಗೆ ಅನನ್ಯ ಪ್ರಭೇದಗಳನ್ನು ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗುತ್ತದೆ

variant-coprime-undetermined = coprime ಯಾವಾಗಲೂ ಸುಳ್ಳು ಎಂದು ನಿರ್ಧರಿಸಲಾಗದ ಕಾರಣ { $component } ನ ಅನನ್ಯ ಪ್ರಭೇದಗಳನ್ನು ನಿರ್ಧರಿಸಲಾಗದು.

variant-attribute-not-constant = { $attribute } ಸ್ಥಿರಾಂಕವಾಗಿಲ್ಲದ ಕಾರಣ { $component } ನ ಅನನ್ಯ ಪ್ರಭೇದಗಳನ್ನು ನಿರ್ಧರಿಸಲಾಗದು.

variant-attribute-not-number = { $attribute } ಸಂಖ್ಯೆಯಾಗಿಲ್ಲದ ಕಾರಣ { $component } ನ ಅನನ್ಯ ಪ್ರಭೇದಗಳನ್ನು ನಿರ್ಧರಿಸಲಾಗದು.

variant-attribute-wrong-type-for-sequence =
    { $attribute } ಎಂಬುದು { $expected ->
        [letters-combination] ಒಂದು ಅಕ್ಷರ ಸಂಯೋಜನೆ
        [math-expression] ಒಂದು ಮಾನ್ಯ ಗಣಿತ ಅಭಿವ್ಯಕ್ತಿ
        [integer] ಒಂದು ಪೂರ್ಣಾಂಕ
       *[number] ಒಂದು ಸಂಖ್ಯೆ
    } ಆಗಿಲ್ಲದ ಕಾರಣ { $type } ಬಗೆಯ { $component } ನ ಅನನ್ಯ ಪ್ರಭೇದಗಳನ್ನು ನಿರ್ಧರಿಸಲಾಗದು.

variant-length-not-integer = length ಪೂರ್ಣಾಂಕವಾಗಿಲ್ಲದ ಕಾರಣ { $component } ನ ಅನನ್ಯ ಪ್ರಭೇದಗಳನ್ನು ನಿರ್ಧರಿಸಲಾಗದು.

variant-sort-not-implemented = sort ಇರುವ { $component } ನ ಅನನ್ಯ ಪ್ರಭೇದಗಳು ಅನುಷ್ಠಾನಗೊಂಡಿಲ್ಲ

variant-exclude-combinations-not-implemented = excludeCombinations ಇರುವ { $component } ನ ಅನನ್ಯ ಪ್ರಭೇದಗಳು ಅನುಷ್ಠಾನಗೊಂಡಿಲ್ಲ

variant-math-exclude-not-implemented = exclude ಇರುವ math ಬಗೆಯ { $component } ನ ಅನನ್ಯ ಪ್ರಭೇದಗಳು ಅನುಷ್ಠಾನಗೊಂಡಿಲ್ಲ

variant-non-constant-exclude-not-implemented = ಸ್ಥಿರವಲ್ಲದ exclude ಇರುವ { $component } ನ ಅನನ್ಯ ಪ್ರಭೇದಗಳು ಅನುಷ್ಠಾನಗೊಂಡಿಲ್ಲ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure ರೆಂಡರರ್‌ನಲ್ಲಿ ಬೆಂಬಲಿತವಲ್ಲ; ವಂಶಜನನ್ನು ಬಿಡಲಾಗಿದೆ.

prefigure-descendant-invalid-geometry = { $subject }: ಅಪರಿಮಿತ ಅಥವಾ ಅಪೂರ್ಣ ರೇಖಾಗಣಿತ; ವಂಶಜನನ್ನು ಬಿಡಲಾಗಿದೆ.

prefigure-curve-label-omitted = { $subject }: ಪರಿವರ್ತಿತ ವಕ್ರರೇಖೆ ಅಂಶಗಳ ಮೇಲೆ ಹೆಸರುಗಳು ಬೆಂಬಲಿತವಲ್ಲ; ಹೆಸರನ್ನು ಬಿಡಲಾಗಿದೆ.

prefigure-curve-unsupported-definition-type = { $subject }: ಬೆಂಬಲಿತವಲ್ಲದ ವಕ್ರರೇಖೆ ಉತ್ಪನ್ನ ವ್ಯಾಖ್ಯೆ ಬಗೆ '{ $definitionType }'; ವಂಶಜನನ್ನು ಬಿಡಲಾಗಿದೆ.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves ಮೇಲೆ ಬೆಂಬಲಿತವಲ್ಲದ flipFunctions ಗುಣ; ವಂಶಜನನ್ನು ಬಿಡಲಾಗಿದೆ.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves ಮೇಲೆ ಸೂತ್ರ ಬಗೆಯ ಮಗು ಉತ್ಪನ್ನಗಳಿಗೆ ಮಾತ್ರ ಬೆಂಬಲವಿದೆ; ವಂಶಜನನ್ನು ಬಿಡಲಾಗಿದೆ.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] ರೇಖಾ ಕುಟುಂಬದ ಹೆಸರಿಗೆ
       *[point] ಬಿಂದುವಿನ ಹೆಸರಿಗೆ
    } ಬೆಂಬಲಿತವಲ್ಲದ labelPosition '{ $labelPosition }'; ಪೂರ್ವನಿಯೋಜಿತ PreFigure ಜೋಡಣೆ ಬಳಸಲಾಗಿದೆ.

prefigure-fill-style-unsupported = { $subject }: ತುಂಬುವ ಶೈಲಿ '{ $fillStyle }' ಗೆ PreFigure ಬೆಂಬಲ ನೀಡುವುದಿಲ್ಲ; ಘನ ತುಂಬುವಿಕೆಗೆ ಮರಳಲಾಗುತ್ತಿದೆ.

prefigure-line-style-unknown = { $subject }: ಅಪರಿಚಿತ ರೇಖಾ ಶೈಲಿ '{ $lineStyle }' PreFigure ಪ್ರದಾನದಿಂದ ಬಿಡಲಾಗಿದೆ.

prefigure-marker-style-mapped-to-diamond = { $subject }: ಗುರುತಿನ ಶೈಲಿ '{ $markerStyle }' PreFigure ಶೈಲಿ 'diamond' ಗೆ ಹೊಂದಿಸಲಾಗಿದೆ.

prefigure-marker-style-unsupported = { $subject }: ಗುರುತಿನ ಶೈಲಿ '{ $markerStyle }' ಗೆ PreFigure ಬೆಂಬಲ ನೀಡುವುದಿಲ್ಲ; ಪೂರ್ವನಿಯೋಜಿತ ಶೈಲಿ ಬಳಸಲಾಗಿದೆ.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ಅಮಾನ್ಯ `ref`; ಗುರಿಯನ್ನು ನಿರ್ಧರಿಸಲಾಗಲಿಲ್ಲ. ಟಿಪ್ಪಣಿಯನ್ನು ಬಿಡಲಾಗಿದೆ.

annotation-ref-multiple-targets = `<annotation>`: `ref` ಹಲವು ಗುರಿಗಳಿಗೆ ನಿರ್ಧರಿತವಾಗಿದೆ; ಮೊದಲ ಗುರಿಯನ್ನು ಬಳಸಲಾಗುತ್ತಿದೆ.

annotation-ref-outside-graph = `<annotation>`: ಅಮಾನ್ಯ `ref`; ಗುರಿ ಅದನ್ನು ಒಳಗೊಂಡ ನಕ್ಷೆಯ ಹೊರಗಿದೆ. ಟಿಪ್ಪಣಿಯನ್ನು ಬಿಡಲಾಗಿದೆ.

annotation-ref-unsupported-target = `<annotation>`: ಅಮಾನ್ಯ `ref`; prefigure ಪರಿವರ್ತನೆಯಲ್ಲಿ ಗುರಿ ಬೆಂಬಲಿತ ಚಿತ್ರಾತ್ಮಕ ವಸ್ತುವಲ್ಲ. ಟಿಪ್ಪಣಿಯನ್ನು ಬಿಡಲಾಗಿದೆ.

annotation-text-missing = `<annotation>`: `text` ಇಲ್ಲ ಅಥವಾ ಖಾಲಿಯಾಗಿದೆ; ಖಾಲಿ ಪಠ್ಯವನ್ನು ನೀಡಲಾಗುತ್ತಿದೆ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] ವರ್ತುಲ ಅವಲಂಬನೆ ಕಂಡುಬಂದಿದೆ.
       *[other] `<{ $componentType }>` ಘಟಕವನ್ನು ಒಳಗೊಂಡ ವರ್ತುಲ ಅವಲಂಬನೆ ಕಂಡುಬಂದಿದೆ.
    }

reference-no-referent = ಈ ಉಲ್ಲೇಖಕ್ಕೆ ಯಾವುದೂ ಕಂಡುಬಂದಿಲ್ಲ: `{ $reference }`

reference-multiple-referents = ಈ ಉಲ್ಲೇಖಕ್ಕೆ ಹಲವು ಗುರಿಗಳು ಕಂಡುಬಂದಿವೆ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` ನ { $attribute } ಗುಣಕ್ಕೆ ಅಮಾನ್ಯ ರೂಪ.

children-invalid = `<{ $componentType }>` ಗೆ ಅಮಾನ್ಯ ಮಕ್ಕಳು: ಅಮಾನ್ಯ ಮಕ್ಕಳು ಕಂಡುಬಂದಿವೆ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` ಗುಣಕ್ಕೆ `{ $value }` ಅಮಾನ್ಯ ಮೌಲ್ಯ, `{ $default }` ಎಂಬ ಮೌಲ್ಯ ಬಳಸಲಾಗುತ್ತಿದೆ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML ಆವೃತ್ತಿ { $version } ಕಂಡುಬಂದಿಲ್ಲ.
       *[other] DoenetML ಆವೃತ್ತಿ { $version } ಕಂಡುಬಂದಿಲ್ಲ. ಆವೃತ್ತಿ { $fallback } ಬಳಸಲಾಗುತ್ತಿದೆ
    }

## Reading the DoenetML

parse-invalid-doenetml = ಅಮಾನ್ಯ DoenetML: { $content }

parse-tag-missing-close-tag = ಅಮಾನ್ಯ DoenetML: `{ $tag }` ಟ್ಯಾಗಿಗೆ ಮುಚ್ಚುವ ಟ್ಯಾಗ್ ಇಲ್ಲ. ಸ್ವಯಂ-ಮುಚ್ಚುವ ಟ್ಯಾಗ್ ಅಥವಾ `</{ $tagName }>` ಟ್ಯಾಗ್ ನಿರೀಕ್ಷಿಸಲಾಗಿತ್ತು.

parse-tag-error = ಅಮಾನ್ಯ DoenetML: `<{ $tagName }>` ಟ್ಯಾಗಿನಲ್ಲಿ ದೋಷ

parse-attribute-missing-value = ಅಮಾನ್ಯ DoenetML: `{ $attribute }` ಎಂಬ ಅಮಾನ್ಯ ಗುಣಕ್ಕೆ ಮೌಲ್ಯ ಇಲ್ಲದಂತೆ ಕಾಣುತ್ತದೆ.

parse-attribute-invalid = ಅಮಾನ್ಯ DoenetML: ಅಮಾನ್ಯ ಗುಣ `{ $attribute }`

parse-attribute-value-invalid = ಅಮಾನ್ಯ DoenetML: ಅಮಾನ್ಯ ಗುಣ ಮೌಲ್ಯ `{ $value }`

parse-attribute-value-quote-mismatch = ಅಮಾನ್ಯ DoenetML: ಅಮಾನ್ಯ ಗುಣ ಮೌಲ್ಯ `{ $value }`. ಉದ್ಧರಣ ಚಿಹ್ನೆಗಳು ಹೊಂದುವುದಿಲ್ಲ. `{ $quote }` ಇಲ್ಲದಂತೆ ಕಾಣುತ್ತದೆ

parse-open-tag-name-missing = ಅಮಾನ್ಯ DoenetML: ಹೆಸರಿಲ್ಲದ ಟ್ಯಾಗ್ ಕಂಡುಬಂದಿದೆ, ಉದಾ. `<`

parse-tag-not-closed = ಅಮಾನ್ಯ DoenetML: `{ $tag }` ಟ್ಯಾಗ್ ಮುಚ್ಚಿಲ್ಲ (`>` ಇಲ್ಲದಂತೆ ಕಾಣುತ್ತದೆ).

parse-self-closing-tag-name-missing = ಅಮಾನ್ಯ DoenetML: ಹೆಸರಿಲ್ಲದ ಟ್ಯಾಗ್ ಕಂಡುಬಂದಿದೆ `<{ $content }>`

parse-self-closing-tag-not-closed = ಅಮಾನ್ಯ DoenetML: `{ $tag }` ಟ್ಯಾಗ್ ಮುಚ್ಚಿಲ್ಲ (`/>` ಇಲ್ಲದಂತೆ ಕಾಣುತ್ತದೆ).

parse-tag-invalid-attributes = ಅಮಾನ್ಯ DoenetML: `{ $tag }` ಟ್ಯಾಗ್ ಮಾನ್ಯವಲ್ಲ. ಅದರ ಗುಣಗಳು ತಪ್ಪಾಗಿರಬಹುದು.

parse-close-tag-name-missing = ಅಮಾನ್ಯ DoenetML: ಹೆಸರಿಲ್ಲದ ಮುಚ್ಚುವ ಟ್ಯಾಗ್ ಕಂಡುಬಂದಿದೆ, ಉದಾ. `</`

parse-attribute-value-unquoted = ಗುಣ ಮೌಲ್ಯಗಳು ಉದ್ಧರಣ ಚಿಹ್ನೆಗಳ ಒಳಗಿರಬೇಕು: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = ಅಮಾನ್ಯ DoenetML: `{ $tag }` ಎಂಬ ಮುಚ್ಚುವ ಟ್ಯಾಗ್ ಕಂಡುಬಂದಿದೆ, ಆದರೆ ಅದಕ್ಕೆ ಹೊಂದುವ ತೆರೆಯುವ ಟ್ಯಾಗ್ ಇಲ್ಲ

parse-close-tag-mismatched = ಅಮಾನ್ಯ DoenetML: ಮುಚ್ಚುವ ಟ್ಯಾಗ್ ಹೊಂದುವುದಿಲ್ಲ. `</{ $expected }>` ನಿರೀಕ್ಷಿಸಲಾಗಿತ್ತು. `{ $found }` ಕಂಡುಬಂದಿದೆ

parser-node-unconvertible = { $node } ಎಂಬ ಗಂಟನ್ನು Dast ಗಂಟಾಗಿ ಪರಿವರ್ತಿಸಲಾಗಲಿಲ್ಲ.

## Names

name-attribute-invalid =
    ಅಮಾನ್ಯ ಗುಣ name='{ $name }'. { $reason ->
        [characters] ಹೆಸರುಗಳಲ್ಲಿ ಅಕ್ಷರಗಳು, ಅಂಕೆಗಳು, ಅಂಡರ್‌ಸ್ಕೋರ್‌ಗಳು ಅಥವಾ ಗೆರೆಗಳು ಮಾತ್ರ ಇರಬಹುದು.
       *[start] ಹೆಸರುಗಳು ಒಂದು ಅಕ್ಷರದಿಂದ ಆರಂಭವಾಗಬೇಕು.
    }

component-name-invalid-start = ಅಮಾನ್ಯ ಘಟಕ ಹೆಸರು "{ $name }". ಹೆಸರುಗಳು ಒಂದು ಅಕ್ಷರದಿಂದ ಆರಂಭವಾಗಬೇಕು.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched ಬಗೆಯ ಉತ್ತರಕ್ಕೆ ಒಂದು video ಗುಣ ಇರಬೇಕು

answer-video-watched-video-not-reference = videoWatched ಬಗೆಯ ಉತ್ತರದ video ಗುಣ ಒಂದು ಉಲ್ಲೇಖವಾಗಿರಬೇಕು

answer-name-not-single-text = ಉತ್ತರದ name ಗುಣಕ್ಕೆ ಒಂದೇ ಒಂದು text ಮಗು ಇರಬೇಕು

## Referencing another document

external-doenetml-recursion-limit = ಅತಿ ಹೆಚ್ಚು ಹಂತಗಳ ಪುನರಾವರ್ತನೆಯಿಂದಾಗಿ ಹೊರಗಿನ DoenetML ಅನ್ನು ಪಡೆಯಲಾಗಲಿಲ್ಲ. ವರ್ತುಲ ಉಲ್ಲೇಖ ಏನಾದರೂ ಇದೆಯೇ?

external-doenetml-unavailable = { $attribute }="{ $uri }" ನಿಂದ DoenetML ಅನ್ನು ಪಡೆಯಲಾಗಲಿಲ್ಲ

external-doenetml-type-mismatch = { $attribute }="{ $uri }" ನಿಂದ ಪಡೆದ DoenetML ಅಮಾನ್ಯ: ಅದು "{ $componentType }" ಎಂಬ ಘಟಕ ಬಗೆಗೆ ಹೊಂದಲಿಲ್ಲ

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` ಗುಣವನ್ನು ಕೈಬಿಡಲಾಗುತ್ತಿದೆ; ಬದಲಿಗೆ `{ $to }` ಬಳಸಿ.
       *[other] [deprecation] `<{ $component }>` ಮೇಲಿನ `{ $from }` ಗುಣವನ್ನು ಕೈಬಿಡಲಾಗುತ್ತಿದೆ; ಬದಲಿಗೆ `{ $to }` ಬಳಸಿ.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` ಅನ್ನೂ ಸೂಚಿಸಿದ ಕಾರಣ `{ $from }` ಗುಣವನ್ನು ಕೈಬಿಡಲಾಗುತ್ತಿದೆ, ಕಡೆಗಣಿಸಲಾಗಿದೆ.
       *[other] [deprecation] `{ $to }` ಅನ್ನೂ ಸೂಚಿಸಿದ ಕಾರಣ `<{ $component }>` ಮೇಲಿನ `{ $from }` ಗುಣವನ್ನು ಕೈಬಿಡಲಾಗುತ್ತಿದೆ, ಕಡೆಗಣಿಸಲಾಗಿದೆ.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` ಮೇಲಿನ `{ $attribute }` ಗುಣವನ್ನು ಕೈಬಿಡಲಾಗುತ್ತಿದೆ, ಕಡೆಗಣಿಸಲಾಗಿದೆ.


## Language coverage

pluralize-english-only = `<pluralize>` ಇಂಗ್ಲಿಷನ್ನು ಮಾತ್ರ ಬಹುವಚನಗೊಳಿಸಬಲ್ಲದು, ಆದ್ದರಿಂದ { $locale } ಭಾಷೆಯಲ್ಲಿ ಬರೆದ ದಸ್ತಾವೇಜಿನಲ್ಲಿ ಅದರ ಪಠ್ಯವನ್ನು ಬದಲಿಸದೆ ಬಿಡಲಾಗುತ್ತದೆ. ಬಹುವಚನ ರೂಪವನ್ನು ನೇರವಾಗಿ ಬರೆಯಿರಿ, ಅಥವಾ `pluralForm` ಗುಣದಿಂದ ಹೊಂದಿಸಿ.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` ಎಂಬುದು ಗುರುತಿಸಲಾದ Doenet ಅಂಶವಲ್ಲ.

schema-element-not-allowed-at-root = ದಸ್ತಾವೇಜಿನ ಬೇರಿನಲ್ಲಿ `<{ $tag }>` ಅಂಶಕ್ಕೆ ಅನುಮತಿಯಿಲ್ಲ.

schema-element-not-allowed-inside = `<{ $parent }>` ಒಳಗೆ `<{ $tag }>` ಅಂಶಕ್ಕೆ ಅನುಮತಿಯಿಲ್ಲ.

schema-attribute-unrecognized = `<{ $tag }>` ಅಂಶಕ್ಕೆ `{ $attribute }` ಎಂಬ ಗುಣ ಇಲ್ಲ.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` ಅಂಶದ `{ $attribute }` ಗುಣ, ಪ್ರತಿ ನಮೂದೂ ಇವುಗಳಲ್ಲಿ ಒಂದಾಗಿರುವ ಪಟ್ಟಿಯಾಗಿರಬೇಕು: { $allowed }
       *[other] `<{ $tag }>` ಅಂಶದ `{ $attribute }` ಗುಣ ಇವುಗಳಲ್ಲಿ ಒಂದಾಗಿರಬೇಕು: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select ಗೆ ಅಮಾನ್ಯ ಪ್ರಭೇದ ಹೆಸರು. ಪ್ರಭೇದ ಹೆಸರು { $variantName } ಎಂಬುದು { $numOptions } ಆಯ್ಕೆಗಳಲ್ಲಿ ಬರುತ್ತದೆ, ಆದರೆ ಆರಿಸಬೇಕಾದ ಸಂಖ್ಯೆ { $numToSelect }.

select-variant-name-without-options = select ಗೆ ಕೆಲವು ಪ್ರಭೇದಗಳನ್ನು ಸೂಚಿಸಲಾಗಿದೆ, ಆದರೆ ಸಂಭಾವ್ಯ ಪ್ರಭೇದ ಹೆಸರಿಗೆ ಯಾವುದೇ ಆಯ್ಕೆಗಳನ್ನು ಸೂಚಿಸಿಲ್ಲ: { $variantName }.

select-variant-name-not-possible = select ಗೆ ಸೂಚಿಸಿದ ಪ್ರಭೇದ ಹೆಸರು { $variantName } ಒಂದು ಸಂಭಾವ್ಯ ಪ್ರಭೇದ ಹೆಸರಲ್ಲ.

select-too-few-options = { $numOptions } ಘಟಕಗಳಿಂದ { $numToSelect } ಘಟಕಗಳನ್ನು ಆರಿಸಲಾಗದು.

select-from-sequence-too-few-values = { $length } ಉದ್ದದ ಅನುಕ್ರಮದಿಂದ { $numToSelect } ಮೌಲ್ಯಗಳನ್ನು ಆರಿಸಲಾಗದು.

select-from-sequence-indices-count-mismatch = select ಗೆ ಸೂಚಿಸಿದ ಸೂಚಿಗಳ ಸಂಖ್ಯೆ, ಆರಿಸಬೇಕಾದ ಸಂಖ್ಯೆಗೆ ಹೊಂದಬೇಕು

select-from-sequence-indices-not-integers = select ಗೆ ಸೂಚಿಸಿದ ಎಲ್ಲಾ ಸೂಚಿಗಳೂ ಪೂರ್ಣಾಂಕಗಳಾಗಿರಬೇಕು

select-from-sequence-index-excluded = ಹೊರಗಿಟ್ಟ ಒಂದು selectfromsequence ಸೂಚಿಯನ್ನು ಸೂಚಿಸಲಾಗಿದೆ

select-from-sequence-indices-excluded-combination = ಹೊರಗಿಟ್ಟ ಸಂಯೋಜನೆಯಾಗಿದ್ದ selectfromsequence ಸೂಚಿಗಳನ್ನು ಸೂಚಿಸಲಾಗಿದೆ

select-from-sequence-coprime-not-positive-integers = ಧನ ಪೂರ್ಣಾಂಕಗಳನ್ನು ಆರಿಸದ ಕಾರಣ ಸಹಅವಿಭಾಜ್ಯ ಸಂಯೋಜನೆಗಳನ್ನು ಆರಿಸಲಾಗದು.

select-from-sequence-coprime-common-factor = ಸಹಅವಿಭಾಜ್ಯ ಸಂಖ್ಯೆಗಳನ್ನು ಆರಿಸಲಾಗದು. ಸಂಭಾವ್ಯ ಎಲ್ಲಾ ಮೌಲ್ಯಗಳಿಗೂ ಒಂದು ಸಾಮಾನ್ಯ ಅಪವರ್ತನವಿದೆ. ("from" ಅಥವಾ "to" ನ ಸೂಚಿಸಿದ ಮೌಲ್ಯಗಳು "step" ಜೊತೆಗೆ ಸಹಅವಿಭಾಜ್ಯವಾಗಿರಬೇಕು.)

select-from-sequence-coprime-single-number = 1 ಅಲ್ಲದ ಒಂದೇ ಒಂದು ಸಂಖ್ಯೆಯಿಂದ ಸಹಅವಿಭಾಜ್ಯ ಸಂಯೋಜನೆಗಳನ್ನು ಆರಿಸಲಾಗದು.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ನಲ್ಲಿ 70% ಕ್ಕಿಂತ ಹೆಚ್ಚು ಸಂಯೋಜನೆಗಳನ್ನು ಹೊರಗಿಡಲಾಗಿದೆ

select-from-sequence-coprime-none-found = ಸಹಅವಿಭಾಜ್ಯ ಸಂಖ್ಯೆಗಳನ್ನು ಆರಿಸಲಾಗಲಿಲ್ಲ. ಸಂಭಾವ್ಯ ಎಲ್ಲಾ ಮೌಲ್ಯಗಳಿಗೂ ಒಂದು ಸಾಮಾನ್ಯ ಅಪವರ್ತನವಿದೆ.

select-from-sequence-too-few-unique-values = { $numPossibleValues } ಉದ್ದದ ಅನುಕ್ರಮದಿಂದ { $numToSelect } ಅನನ್ಯ ಮೌಲ್ಯಗಳನ್ನು ಆರಿಸಲಾಗದು

select-prime-numbers-too-few-values = { $numValues } ಉದ್ದದ ಅವಿಭಾಜ್ಯ ಸಂಖ್ಯೆಗಳ ಪಟ್ಟಿಯಿಂದ { $numToSelect } ಮೌಲ್ಯಗಳನ್ನು ಆರಿಸಲಾಗದು

select-prime-numbers-values-count-mismatch = select ಗೆ ಸೂಚಿಸಿದ ಮೌಲ್ಯಗಳ ಸಂಖ್ಯೆ, ಆರಿಸಬೇಕಾದ ಸಂಖ್ಯೆಗೆ ಹೊಂದಬೇಕು

select-prime-numbers-values-not-prime = select prime number ಗೆ ಸೂಚಿಸಿದ ಎಲ್ಲಾ ಮೌಲ್ಯಗಳೂ ಅವಿಭಾಜ್ಯ ಸಂಖ್ಯೆಗಳ ಪಟ್ಟಿಯಲ್ಲಿರಬೇಕು

select-prime-numbers-values-excluded-combination = selectPrimeNumbers ಗೆ ಸೂಚಿಸಿದ ಮೌಲ್ಯಗಳು ಹೊರಗಿಟ್ಟ ಸಂಯೋಜನೆಯಾಗಿದ್ದವು

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ನಲ್ಲಿ 70% ಕ್ಕಿಂತ ಹೆಚ್ಚು ಸಂಯೋಜನೆಗಳನ್ನು ಹೊರಗಿಡಲಾಗಿದೆ

select-random-combination-fluke = ಅತ್ಯಂತ ಅಪರೂಪದ ಆಕಸ್ಮಿಕದಿಂದಾಗಿ, ಯಾದೃಚ್ಛಿಕ ಮೌಲ್ಯಗಳ ಸಂಯೋಜನೆಯನ್ನು ಆರಿಸಲಾಗಲಿಲ್ಲ

select-random-value-fluke = ಅತ್ಯಂತ ಅಪರೂಪದ ಆಕಸ್ಮಿಕದಿಂದಾಗಿ, ಯಾದೃಚ್ಛಿಕ ಮೌಲ್ಯವನ್ನು ಆರಿಸಲಾಗಲಿಲ್ಲ
