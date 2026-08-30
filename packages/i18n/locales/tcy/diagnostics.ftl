# Tulu (ತುಳು) diagnostics: the warnings and errors the worker raises and the
# reader is shown. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth. Selected by `uiLocale`, not by the language the document
# was written in.
#
# Message ids are never translated — only the text to the right of `=`.
# Neither are the DoenetML identifiers quoted inside these sentences:
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `maxNumAttempts`,
# `selectFromSequence`, `styleNumber` and every tag and attribute name like
# them are part of the language an author writes, not prose, and stay in
# English exactly as written. So does the `[deprecation]` marker, which is a
# label rather than a word, and so do `WCAG AA` and `PreFigure`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script** is `chrome.ftl`'s: Kannada rather than Tigalari, for the three
# reasons that file's header gives in full.
#
# **The technical vocabulary is Kannada, declared as such** — ದೋಷ, ಎಚ್ಚರಿಕೆ,
# ಘಟಕ, ಗುಣ, ಚರ, ಆಯಾಮ, ಉಲ್ಲೇಖ, ಅನುಕ್ರಮ, ಸಂಯೋಜನೆ. Tulu readers meet these
# words in Kannada schooling; coining Tulu equivalents would put unfamiliar
# words in front of a reader who already has familiar ones. What is Tulu is
# the frame around them: ಇಜ್ಜಿ for negation and absence, ಉಂಡು for presence,
# the negative verb in -ಜಿ (ಆಪುಜಿ, ತಿಕ್ಕುಜಿ), ಆವೊಡು for *must*, ಬೊಕ್ಕ for
# *and*, ಅತ್ತ್ಂಡ for *or*, ಒಟ್ಟುಗು for *with*, ದಾಯೆಗ್ಂಡ for *because*, and
# the honorific imperative in -ಲೆ.
#
# **One paraphrase is declared and used everywhere so that one search replaces
# it.** English's *is ignored* is written «ಪರಿಗಣನೆ ಆಪುಜಿ» throughout —
# literally *is not considered*. It is Kannada-register rather than Tulu, and
# it appears in something like thirty messages, so it is the first thing a
# speaker should replace, and replacing it is a single search. **ತಪ್ಪು** for
# English's *invalid* is the second such choice: it means *wrong* rather than
# *not permitted*, which is slightly weaker than the English, and it is used
# in every one of the `parse-` and `schema-` messages a beginner meets first.
#
# **No plural branches anywhere.** CLDR has no plural data for `tcy`, so
# `line-segment-attributes-ignored-with-endpoints` and its relatives write a
# single `*[other]` where English writes `[one]` and `[other]`. The one
# numeric literal that survives is `[1]` in
# `field-function-wrong-num-outputs`, which forks on how many outputs a
# component *needs* rather than on a count the reader is looking at; Fluent
# matches it against the number itself before any plural rule is consulted.
#
# **Numbers render in Latin digits** rather than in Kannada numerals (#1615).

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] ರಡ್ಡ್ endpoint ಕೊರ್ತ್ಂಡ { $attributes } ಪರಿಗಣನೆ ಆಪುಜಿ
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] endpoint ಬೊಕ್ಕ midpoint ರಡ್ಡ್‌ಲಾ ಕೊರ್ತ್ಂಡ { $attributes } ಪರಿಗಣನೆ ಆಪುಜಿ
    }

line-segment-midpoint-offset-without-midpoint = midpoint ಇಜ್ಜಂದೆ midpointOffset‌ದ ಒವ್ವೇ ಪರಿಣಾಮ ಇಜ್ಜಿ

## `<line>`

line-points-undetermined-dimensions = ಆಯಾಮ ಗೊತ್ತಾವಂದಿನ ಬಿಂದುಲೆ ಮುಖಾಂತರ ಗೆರೆ.

line-points-too-few-dimensions = ಗೆರೆ ಪೋಪುನ ಬಿಂದುಲೆಗ್ ಕಡಿಮೆ ಪಂಡ ರಡ್ಡ್ ಆಯಾಮ ಆವೊಡು.

line-points-depend-on-variables = ಗೆರೆ ಪೋಪುನ ಬಿಂದುಲು ಚರೊಲೆ ಮಿತ್ತ್ ನಿಂದ್‌ದ: { $variables }.

line-equation-invalid-format = { $variable1 } ಬೊಕ್ಕ { $variable2 } ಚರೊಲೆಡ್ ಗೆರೆದ ಸಮೀಕರಣೊದ ತಪ್ಪು ರೂಪ.

## `<ray>`

ray-overprescribed-through = ಕಿರಣ through, endpoint ಬೊಕ್ಕ direction ಮೂಜಿಲಾ ಮುಖಾಂತರ ಗೊತ್ತು ಮಲ್ತ್‌ದ್ಂಡ್.  ಕೊರ್ತಿನ through ಪರಿಗಣನೆ ಆಪುಜಿ.

ray-dimension-mismatch = ಕಿರಣೊಡು numDimensions ಸರಿ ಬರ್ಪುಜಿ.

## `<vector>`

vector-overprescribed-head = ಸದಿಶ head, tail ಬೊಕ್ಕ displacement ಮೂಜಿಲಾ ಮುಖಾಂತರ ಗೊತ್ತು ಮಲ್ತ್‌ದ್ಂಡ್.  ಕೊರ್ತಿನ head ಪರಿಗಣನೆ ಆಪುಜಿ.

vector-dimension-mismatch = ಸದಿಶೊಡು numDimensions ಸರಿ ಬರ್ಪುಜಿ.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>`ಗ್ nearestPoint ಸ್ಥಿತಿ ಚರ ಇಜ್ಜಿ, ಅಂಚಾದ್ ಅವೆಟ್ಟ್ ಸೆಳೆಯೆರೆ ಆಪುಜಿ.

constrain-to-without-nearest-point = `<{ $component }>`ಗ್ nearestPoint ಸ್ಥಿತಿ ಚರ ಇಜ್ಜಿ, ಅಂಚಾದ್ ಅವೆಗ್ ಕಟ್ಟ್ ಪಾಡೆರೆ ಆಪುಜಿ.

constrain-to-interior-without-nearest-point = `<{ $component }>`ಗ್ nearestPoint ಸ್ಥಿತಿ ಚರ ಇಜ್ಜಿ, ಅಂಚಾದ್ ಅವೆತ ಒಳಯಿಗ್ ಕಟ್ಟ್ ಪಾಡೆರೆ ಆಪುಜಿ.

## `<choiceInput>`

choice-input-label-position-ignored = inline ಅತ್ತಿನ choiceInput‌ಗ್ labelPosition ಪರಿಗಣನೆ ಆಪುಜಿ

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput‌ಗ್ ಕೊರ್ತಿನ indices‌ದ ಸಂಖ್ಯೆ choice ಮಗೆಲೆ ಸಂಖ್ಯೆಗ್ ಸರಿ ಬರ್ಪುಜಿ, ಅಂಚಾದ್ ಅವು ಪರಿಗಣನೆ ಆಪುಜಿ.

pretzel-indices-count-mismatch = problem‌ಗ್ ಕೊರ್ತಿನ indices‌ದ ಸಂಖ್ಯೆ problem ಮಗೆಲೆ ಸಂಖ್ಯೆಗ್ ಸರಿ ಬರ್ಪುಜಿ, ಅಂಚಾದ್ ಅವು ಪರಿಗಣನೆ ಆಪುಜಿ.

shuffle-indices-count-mismatch = shuffle‌ಗ್ ಕೊರ್ತಿನ indices‌ದ ಸಂಖ್ಯೆ ಘಟಕೊಲೆ ಸಂಖ್ಯೆಗ್ ಸರಿ ಬರ್ಪುಜಿ, ಅಂಚಾದ್ ಅವು ಪರಿಗಣನೆ ಆಪುಜಿ.

indices-ignored-out-of-range = { $component }ಗ್ ಕೊರ್ತಿನ ಕೆಲವು indices ಮಿತಿದ ಪಿದಯಿ ಉಂಡು, ಅಂಚಾದ್ ಅವು ಪರಿಗಣನೆ ಆಪುಜಿ.

pretzel-indices-repeated = pretzel‌ಗ್ ಕೊರ್ತಿನ ಕೆಲವು indices ರಡ್ಡ್ ಸರ್ತಿ ಬತ್ತ್‌ದ್ಂಡ್, ಅಂಚಾದ್ ಅವು ಪರಿಗಣನೆ ಆಪುಜಿ.

pretzel-circuit-first-index = circuit ಮೋಡ್‌ಡ್ pretzel‌ದ ಸುರುತ index 1 ಆವೊಡು, ಅಂಚಾದ್ ಕೊರ್ತಿನ indices ಪರಿಗಣನೆ ಆಪುಜಿ.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` ಸ್ಟ್ರಿಂಗ್ ಮಗೆಲೆ ಒಟ್ಟುಗು ಕೆಲಸ ಮಲ್ಪೆರೆ ಒಂಜಿ `type` ಗುಣ ಕೊರೊಡು.

invalid-type-defaulting-to-math = { $component } ಘಟಕೊಗು ತಪ್ಪು type { $type }. math, text, number ಅತ್ತ್ಂಡ boolean‌ಡ್ ಒಂಜಿ ಆವೊಡು. math ಪಂಡ್‌ದ್ ದೀತ್‌ದ್ಂಡ್.

string-not-valid-component-to-arrange = ಸ್ಟ್ರಿಂಗ್ "{ $value }" { $component } ಮಲ್ಪೆರೆ ಸರಿಯಾಯಿನ ಘಟಕ ಅತ್ತ್. ಪರಿಗಣನೆ ಆಪುಜಿ.

## Types and variables

invalid-type-defaulting-to-number = ತಪ್ಪು type { $type }, type number ಪಂಡ್‌ದ್ ದೀತ್‌ದ್ಂಡ್.

invalid-variable-value = ಚರೊದ ತಪ್ಪು ಮೌಲ್ಯ: `{ $value }`

## Variants

variant-index-must-be-number = Variant index { $index } ಸಂಖ್ಯೆ ಆವೊಡು

variant-index-must-be-integer = Variant index { $index } ಪೂರ್ಣಾಂಕ ಆವೊಡು

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ನಿರಪೇಕ್ಷ ಅಳತೆಗ್ ಮಲ್ತಿಜ್ಜಿ. ಅಗಲೊಲು ಸಾಪೇಕ್ಷ ಪಂಡ್‌ದ್ ದೀತ್‌ದ್ಂಡ್.

side-by-side-absolute-margins = `<{ $component }>` ನಿರಪೇಕ್ಷ ಅಳತೆಗ್ ಮಲ್ತಿಜ್ಜಿ. ಅಂಚಿಲು ಸಾಪೇಕ್ಷ ಪಂಡ್‌ದ್ ದೀತ್‌ದ್ಂಡ್.

side-by-side-no-block-child = ತಪ್ಪು `<{ $component }>`: ಅವೆಟ್ ಕಡಿಮೆ ಪಂಡ ಒಂಜಿ ಬ್ಲಾಕ್ ಮಗೆ ಇಪ್ಪೊಡು.

## `<label>`

label-for-ignored-on-graphical = ಚಿತ್ರೊದ `<label>`ದ ಮಿತ್ತ್‌ದ `for` ಗುಣ ಪರಿಗಣನೆ ಆಪುಜಿ.

label-for-must-resolve-to-one = `<label>`ದ `for` ಗುಣ ಸರಿಯಾದ್ ಒಂಜೇ ಘಟಕೊಗು ಸೇರೊಡು.

label-for-unresolved = `<label>`ದ `for` ಗುಣೊನು ಒವ್ವೇ ಘಟಕೊಗು ಸೇರಾಯೆರೆ ಆತಿಜ್ಜಿ.

label-for-answer-with-authored-inputs = `<label>`ದ `for` ಗುಣ, ಬರೆಪುನಾಯೆ ತಾನೇ ಕೊರ್ತಿನ input ಇತ್ತಿನ `<answer>`ನ್ ತೋಜಾವೊಂದುಂಡು; input‌ನೇ ನೇರವಾದ್ ತೋಜಾಲೆ.

label-for-answer-without-input = `<label>`ದ `for` ಗುಣ, label ಕೊರೆರೆ ಒವ್ವೇ input ಇಜ್ಜಂದಿನ `<answer>`ನ್ ತೋಜಾವೊಂದುಂಡು.

label-for-must-reference-input-or-answer = `<label>`ದ `for` ಗುಣ ಒಂಜಿ input ಅತ್ತ್ಂಡ ಒಂಜಿ answer‌ನ್ ತೋಜಾವೊಡು.

## Accessibility

accessibility-short-description-or-decorative = ಸೌಲಭ್ಯೊಗಾದ್ `<{ $component }>`ಗ್ ಒಂಜಿ ಎಲ್ಯ ವಿವರ ಇಪ್ಪೊಡು, ಅತ್ತ್ಂಡ ಅವೆನ್ decorative ಪಂಡ್‌ದ್ ಗೊತ್ತು ಮಲ್ಪೊಡು.

accessibility-video-short-description = ಸೌಲಭ್ಯೊಗಾದ್ `<video>`ಗ್ ಒಂಜಿ ಎಲ್ಯ ವಿವರ ಇಪ್ಪೊಡು.

accessibility-input-short-description-or-label = ಸೌಲಭ್ಯೊಗಾದ್ `<{ $component }>`ಗ್ ಒಂಜಿ ಎಲ್ಯ ವಿವರ ಅತ್ತ್ಂಡ ಒಂಜಿ label ಇಪ್ಪೊಡು.

accessibility-answer-input-short-description-or-label = ಸೌಲಭ್ಯೊಗಾದ್, input ಮಲ್ಪುನ `<answer>`ಗ್ ಒಂಜಿ ಎಲ್ಯ ವಿವರ ಅತ್ತ್ಂಡ ಒಂಜಿ label ಇಪ್ಪೊಡು.

accessibility-short-description-contains-math = ಎಲ್ಯ ವಿವರೊಡು `<{ $component }>`ದ ಲೆಕ್ಕದ ಗಣಿತ ಘಟಕೊಲು ಇಪ್ಪೆರೆ ಬಲ್ಲಿ. ಗಣಿತೊನು ಪದೊಕುಲೆಡೇ ಬರೆಪುಲೆ.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] ವಿಭಾಗದ ಶೀರ್ಷಿಕೆದ ಬರವುಗು { $colorName }ದ ವ್ಯತ್ಯಾಸ ಸಾಲುಜಿ (ಕಪ್ಪು ಮೋಡ್) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ಕಡಿಮೆ ಪಂಡ { $threshold }:1 ಬೋಡು).
       *[other] ವಿಭಾಗದ ಶೀರ್ಷಿಕೆದ ಬರವುಗು { $colorName }ದ ವ್ಯತ್ಯಾಸ ಸಾಲುಜಿ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ಕಡಿಮೆ ಪಂಡ { $threshold }:1 ಬೋಡು).
    }

## `<circle>`

circle-through-points-non-numerical = ಬಿಂದುಲೆಗ್ ಸಂಖ್ಯೆದ ಮೌಲ್ಯ ಇಜ್ಜಂದಿನ ಸಂದರ್ಭೊಡು { $count } ಬಿಂದುಲೆ ಮುಖಾಂತರ `<circle>` ಇನಿ ಮುಟ್ಟ ಮಲ್ತಿಜ್ಜಿ.

circle-too-many-through-points = ಮೂಜಿಡ್ದ್ ಜಾಸ್ತಿ ಬಿಂದುಲೆ ಮುಖಾಂತರ ವೃತ್ತ ಲೆಕ್ಕ ಮಲ್ಪೆರೆ ಆಪುಜಿ.

circle-overprescribed-radius-center-points = ಕೊರ್ತಿನ radius, center ಬೊಕ್ಕ through ಬಿಂದುಲು ಮೂಜಿಲಾ ಇತ್ತ್ಂಡ ವೃತ್ತ ಲೆಕ್ಕ ಮಲ್ಪೆರೆ ಆಪುಜಿ.

circle-center-with-multiple-points = ಕೊರ್ತಿನ center‌ದ ಒಟ್ಟುಗು ಒಂಜಿಡ್ದ್ ಜಾಸ್ತಿ ಬಿಂದು ಮುಖಾಂತರ ವೃತ್ತ ಲೆಕ್ಕ ಮಲ್ಪೆರೆ ಆಪುಜಿ.

circle-radius-too-small = ವೃತ್ತ ಲೆಕ್ಕ ಮಲ್ಪೆರೆ ಆಪುಜಿ: ರಡ್ಡ್ ಬಿಂದುಲೆ ನಡುತ ದೂರ { $distance }, ಅಂಚಾದ್ ಕೊರ್ತಿನ radius { $radius } ಮಸ್ತ್ ಎಲ್ಯ.

circle-radius-with-many-points = ಕೊರ್ತಿನ radius‌ದ ಒಟ್ಟುಗು ರಡ್ಡ್‌ಡ್ದ್ ಜಾಸ್ತಿ ಬಿಂದುಲೆ ಮುಖಾಂತರ ವೃತ್ತ ಮಲ್ಪೆರೆ ಆಪುಜಿ.

circle-invalid-center-or-through-points = ವೃತ್ತೊದ ತಪ್ಪು center ಅತ್ತ್ಂಡ through ಬಿಂದುಲು.

circle-radius-center-with-multiple-points = ಕೊರ್ತಿನ center‌ದ ಒಟ್ಟುಗು ಒಂಜಿಡ್ದ್ ಜಾಸ್ತಿ ಬಿಂದು ಮುಖಾಂತರ ವೃತ್ತೊದ radius ಲೆಕ್ಕ ಮಲ್ಪೆರೆ ಆಪುಜಿ.

circle-change-radius-non-numerical = ಸಂಖ್ಯೆದ ಮೌಲ್ಯ ಇಜ್ಜಂದಿನ through ಬಿಂದುಲು ಇತ್ತಿನ ವೃತ್ತೊದ radius ಬದಲ್ ಮಲ್ಪೆರೆ ಆಪುಜಿ

circle-radius-with-points-non-numerical = ಸಂಖ್ಯೆದ ಮೌಲ್ಯ ಇಜ್ಜಂದಿನ ಸಂದರ್ಭೊಡು ಕೊರ್ತಿನ radius‌ದ ಒಟ್ಟುಗು ಒಂಜಿಡ್ದ್ ಜಾಸ್ತಿ ಬಿಂದು ಮುಖಾಂತರ ವೃತ್ತ ಮಲ್ಪೆರೆ ಆಪುಜಿ.

circle-change-center-non-numerical = ಸಂಖ್ಯೆದ ಮೌಲ್ಯ ಇಜ್ಜಂದಿನ ಬಿಂದುಲೆ ಮುಖಾಂತರ ಮಲ್ತಿನ ವೃತ್ತೊದ center ಬದಲ್ ಮಲ್ಪುನೆನ್ ಇನಿ ಮುಟ್ಟ ಮಲ್ತಿಜ್ಜಿ.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] ಉತ್ಪನ್ನೊದ domain‌ಗ್ ಆಯಾಮ ಸಾಲುಜಿ. domain‌ಡ್ { $intervals } ಅಂತರ ಉಂಡು ಆಂಡ ಉತ್ಪನ್ನೊಡು { $inputs ->
           *[other] { $inputs } input
        } ಉಂಡು.
    }

function-domain-invalid-format = ಉತ್ಪನ್ನೊದ domain‌ದ ತಪ್ಪು ರೂಪ.

function-ignoring-non-numerical =
    { $type ->
        [maximum] ಉತ್ಪನ್ನೊದ ಸಂಖ್ಯೆ ಅತ್ತಿನ ಗರಿಷ್ಠ ಮೌಲ್ಯ ಪರಿಗಣನೆ ಆಪುಜಿ.
        [minimum] ಉತ್ಪನ್ನೊದ ಸಂಖ್ಯೆ ಅತ್ತಿನ ಕನಿಷ್ಠ ಮೌಲ್ಯ ಪರಿಗಣನೆ ಆಪುಜಿ.
        [extremum] ಉತ್ಪನ್ನೊದ ಸಂಖ್ಯೆ ಅತ್ತಿನ ಚರಮ ಮೌಲ್ಯ ಪರಿಗಣನೆ ಆಪುಜಿ.
        [point] ಉತ್ಪನ್ನೊದ ಸಂಖ್ಯೆ ಅತ್ತಿನ ಬಿಂದು ಪರಿಗಣನೆ ಆಪುಜಿ.
        [slope] ಉತ್ಪನ್ನೊದ ಸಂಖ್ಯೆ ಅತ್ತಿನ ಇಳಿಜಾರು ಪರಿಗಣನೆ ಆಪುಜಿ.
       *[other] ಉತ್ಪನ್ನೊದ ಸಂಖ್ಯೆ ಅತ್ತಿನ { $type } ಪರಿಗಣನೆ ಆಪುಜಿ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] ಉತ್ಪನ್ನೊದ ಖಾಲಿ ಗರಿಷ್ಠ ಮೌಲ್ಯ ಪರಿಗಣನೆ ಆಪುಜಿ.
        [minimum] ಉತ್ಪನ್ನೊದ ಖಾಲಿ ಕನಿಷ್ಠ ಮೌಲ್ಯ ಪರಿಗಣನೆ ಆಪುಜಿ.
        [extremum] ಉತ್ಪನ್ನೊದ ಖಾಲಿ ಚರಮ ಮೌಲ್ಯ ಪರಿಗಣನೆ ಆಪುಜಿ.
        [point] ಉತ್ಪನ್ನೊದ ಖಾಲಿ ಬಿಂದು ಪರಿಗಣನೆ ಆಪುಜಿ.
       *[other] ಉತ್ಪನ್ನೊದ ಖಾಲಿ { $type } ಪರಿಗಣನೆ ಆಪುಜಿ.
    }

function-points-too-close = ಉತ್ಪನ್ನೊಡು ಮಸ್ತ್ ಕೈತಲ್ ಇತ್ತಿನ ರಡ್ಡ್ ಬಿಂದುಲು ಉಂಡು. ಉತ್ಪನ್ನ ಗೊತ್ತು ಮಲ್ಪೆರೆ ಆಪುಜಿ.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] ಉತ್ಪನ್ನೊದ input‌ದ ಸಂಖ್ಯೆ ಬೊಕ್ಕ output‌ದ ಸಂಖ್ಯೆ ಸಮ ಆಂಡ ಮಾತ್ರ ಉತ್ಪನ್ನೊದ ಪುನರಾವರ್ತನೆ ಸಾಧ್ಯ. ಈ ಉತ್ಪನ್ನೊಡು { $inputs } input ಬೊಕ್ಕ { $outputs ->
           *[other] { $outputs } output
        } ಉಂಡು.
    }

## `<sequence>`

sequence-invalid-length = ಅನುಕ್ರಮೊದ ತಪ್ಪು ಉದ್ದ.  ಋಣಾತ್ಮಕ ಅತ್ತಿನ ಪೂರ್ಣಾಂಕ ಆವೊಡು.

sequence-invalid-step = ಅನುಕ್ರಮೊದ ತಪ್ಪು step.  { $type } ತರೊತ ಅನುಕ್ರಮೊಗು ಒಂಜಿ ಸಂಖ್ಯೆ ಆವೊಡು.

sequence-invalid-endpoint-number = number ಅನುಕ್ರಮೊದ ತಪ್ಪು "{ $attribute }".  ಒಂಜಿ ಸಂಖ್ಯೆ ಆವೊಡು.

sequence-invalid-endpoint-letters = letters ಅನುಕ್ರಮೊದ ತಪ್ಪು "{ $attribute }".  ಅಕ್ಷರೊಲೆ ಸಂಯೋಜನೆ ಆವೊಡು.

sequence-invalid-endpoint = ಅನುಕ್ರಮೊದ ತಪ್ಪು "{ $attribute }".

select-from-sequence-coprime-not-numbers = ಸಂಖ್ಯೆಲೆನ್ ಆಯ್ಕೆ ಮಲ್ಪುಜಿ, ಅಂಚಾದ್ coprime ಪರಿಗಣನೆ ಆಪುಜಿ

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations ಕೊರ್ತ್‌ದ್ಂಡ್, ಅಂಚಾದ್ coprime ಪರಿಗಣನೆ ಆಪುಜಿ

## Resolving a `target`

target-not-found = `<{ $source }>`ಗ್ ತಪ್ಪು target: target ತಿಕ್ಕುಜಿ.

target-state-variable-not-found = `<{ $source }>`ಗ್ ತಪ್ಪು target: `<{ $component }>`ಡ್ "{ $property }" ಪುದರ್‌ದ ಸ್ಥಿತಿ ಚರ ತಿಕ್ಕುಜಿ.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`ದ ಚರೊಲು ಸ್ವತಂತ್ರ ಚರೊಡ್ದ್ ಬೇತೆ ಆವೊಡು.

ode-system-duplicate-variable-names = ಒಂಜೇ ಪುದರ್‌ದ ಅವಲಂಬಿತ ಚರೊಲೆ ಒಟ್ಟುಗು ODE RHS ಉತ್ಪನ್ನ ಗೊತ್ತು ಮಲ್ಪೆರೆ ಆಪುಜಿ.

ode-system-rhs-function-error = ODE RHS ಉತ್ಪನ್ನ ಗೊತ್ತು ಮಲ್ಪೆರೆ ಆಪುಜಿ.  mathjs ಉತ್ಪನ್ನ ಮಲ್ಪುನೆಡ್ ದೋಷ.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } ಗೆರೆಲೆ ನಡುತ ಕೋನ ಗೊತ್ತು ಮಲ್ಪೆರೆ ಆಪುಜಿ

angle-invalid-through-point = `<angle>`ದ through‌ಡ್ ತಪ್ಪು ಬಿಂದು

parabola-vertex-too-many-points = vertex‌ದ ಒಟ್ಟುಗು ಒಂಜಿಡ್ದ್ ಜಾಸ್ತಿ ಬಿಂದು ಮುಖಾಂತರ ಪರವಲಯ ಇನಿ ಮುಟ್ಟ ಮಲ್ತಿಜ್ಜಿ.

parabola-too-many-points = ಮೂಜಿಡ್ದ್ ಜಾಸ್ತಿ ಬಿಂದುಲೆ ಮುಖಾಂತರ ಪರವಲಯ ಇನಿ ಮುಟ್ಟ ಮಲ್ತಿಜ್ಜಿ.

intersection-too-many-items = ರಡ್ಡ್‌ಡ್ದ್ ಜಾಸ್ತಿ ವಸ್ತುಲೆ ಛೇದನ ಇನಿ ಮುಟ್ಟ ಮಲ್ತಿಜ್ಜಿ

## Other math components

ionic-compound-not-two-ions = ರಡ್ಡ್ ಅಯಾನ್ ಬುಡ್‌ದ್ ಬೇತೆ ಒವ್ವೆಗ್ಲಾ ಅಯಾನಿಕ ಸಂಯುಕ್ತ ಇನಿ ಮುಟ್ಟ ಮಲ್ತಿಜ್ಜಿ.

ionic-compound-needs-cation-and-anion = ಅಯಾನಿಕ ಸಂಯುಕ್ತ ಒಂಜಿ ಕ್ಯಾಟಯಾನ್ ಬೊಕ್ಕ ಒಂಜಿ ಅಯಾನ್‌ಗ್ ಮಾತ್ರ ಮಲ್ತ್‌ದ್ಂಡ್.

solve-equations-cannot-evaluate = ಸಮೀಕರಣೊದ ಮೌಲ್ಯ ಕಂಡುಪತ್ತೆರೆ ಆತಿಜ್ಜಿ, ಅಂಚಾದ್ ಅವೆನ್ ಬಗೆಹರಿಪೆರೆ ಆಪುಜಿ: { $equation }

math-operators-operand-number-required = ಗಣಿತೊದ operand ದೆಪ್ಪುನಗ ಒಂಜಿ operandNumber ಕೊರೊಡು.

eigen-decomposition-failed = ಮ್ಯಾಟ್ರಿಕ್ಸ್‌ದ eigenvalue ಲೆಕ್ಕ ಮಲ್ಪೆರೆ ಆತಿಜ್ಜಿ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: { $parameters } parameter pattern‌ಡ್ ಇಜ್ಜಿ, ಅಂಚಾದ್ ಅವು ಪೂರ ಸರ್ತಿಲಾ ಖಾಲಿನೇ ಸರಿ ಬರ್ಪುಂಡು.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ಅರ್ಥ ಆಪುಜಿ. ಅವು none, medium, dense, ಅತ್ತ್ಂಡ ಖಾಲಿ ಜಾಗೆಡ್ ಬೇತೆ ಮಲ್ತಿನ ರಡ್ಡ್ ಧನಾತ್ಮಕ ಸಂಖ್ಯೆ ಆವೊಡು, ಉದಾ. grid="1 0.5". ಒವ್ವೇ grid ಬರೆತಿಜ್ಜಿ.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>`ಗ್ { $expected ->
        [1] ಒಂಜಿ output ಇತ್ತಿನ ಉತ್ಪನ್ನ ಬೋಡು, ಪಂಡ ಪ್ರತಿ ಬಿಂದುಡ್ದ ಇಳಿಜಾರು y', ಉದಾ. `y - x`
       *[other] ರಡ್ಡ್ output ಇತ್ತಿನ ಉತ್ಪನ್ನ ಬೋಡು, ಪಂಡ ಪ್ರತಿ ಬಿಂದುಡ್ದ ಸದಿಶ, ಉದಾ. `(y, -x)`
    }, ಆಂಡ ಕೊರ್ತಿನ ಉತ್ಪನ್ನೊಡು { $found ->
       *[other] { $found } output
    } ಉಂಡು. { $alternative ->
        [none] ಒವ್ವೂ ಬರೆತಿಜ್ಜಿ.
       *[other] ಆ ಉತ್ಪನ್ನೊಗು `<{ $alternative }>` ಘಟಕನೇ ಸರಿ. ಒವ್ವೂ ಬರೆತಿಜ್ಜಿ.
    }

field-function-attribute-ignored-with-child = ಉತ್ಪನ್ನೊನು ಘಟಕೊದ ಒಳಯಿಲಾ ಕೊರ್ತ್‌ದ್ಂಡ್, ಅಂಚಾದ್ `function` ಗುಣ ಪರಿಗಣನೆ ಆಪುಜಿ; ಒಳಯಿದನೇ ಬಳಕೆ ಆಪುಂಡು. ಉತ್ಪನ್ನೊನು ರಡ್ಡ್ ದಾರಿಡ್ ಒಂಜಿಡ್ ಮಾತ್ರ ಕೊರ್ಲೆ.

field-variables-ignored =
    `<{ $component }>`: `variables` ಗುಣ ಘಟಕೊದ ಒಳಯಿ ನೇರವಾದ್ ಬರೆತಿನ ಸೂತ್ರೊದ ಚರೊಲೆ ಪುದರ್ ಪಂಡುಂಡು. { $reason ->
        [function-child] ಇಂಚಿ ಉತ್ಪನ್ನ ಒಂಜಿ `<function>` ಮಗೆ ಆದ್ ಕೊರ್ತ್‌ದ್ಂಡ್, ಅವು ತನ್ನ ಚರೊಲೆನ್ ತಾನೇ ಪಂಡುಂಡು, ಅಂಚಾದ್ `variables` ಪರಿಗಣನೆ ಆಪುಜಿ.
       *[no-expression] ಇಂಚಿ ಅಂಚಿನ ಒವ್ವೇ ಸೂತ್ರ ಕೊರ್ತಿಜ್ಜಿ, ಅಂಚಾದ್ `variables` ಪರಿಗಣನೆ ಆಪುಜಿ.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure ರೆಂಡರರ್‌ಡ್ xLabelPosition="left" ನಡೆಪುಜಿ; right-position‌ದ ವರ್ತನೆ ಬಳಕೆ ಆಂಡ್.

prefigure-y-label-position-unsupported = `<graph>`: prefigure ರೆಂಡರರ್‌ಡ್ yLabelPosition="bottom" ನಡೆಪುಜಿ; top-position‌ದ ವರ್ತನೆ ಬಳಕೆ ಆಂಡ್.

prefigure-invalid-axis-bounds = `<graph>`: prefigure ಪರಿವರ್ತನೆಗ್ ತಪ್ಪು ಅಕ್ಷದ ಮಿತಿ; ದುಂಬೇ ಗೊತ್ತು ಮಲ್ತಿನ bbox (-10,-10,10,10) ಬಳಕೆ ಆಂಡ್.

prefigure-invalid-width = `<graph>`: prefigure ಪರಿವರ್ತನೆಗ್ ತಪ್ಪು ಅಗಲ; ದುಂಬೇ ಗೊತ್ತು ಮಲ್ತಿನ ಚಿತ್ರೊದ ಅಗಲ 425 ಬಳಕೆ ಆಂಡ್.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ಪರಿವರ್ತನೆಗ್ ತಪ್ಪು aspectRatio; ದುಂಬೇ ಗೊತ್ತು ಮಲ್ತಿನ ಅನುಪಾತ 1 ಬಳಕೆ ಆಂಡ್.

prefigure-grid-spacing-too-fine = `<graph>`: ಅಕ್ಷದ ಮಿತಿಗ್ ಹೋಲಿಸ್‌ದ್ grid‌ದ ಅಂತರ ಮಸ್ತ್ ಎಲ್ಯ; prefigure ರೆಂಡರರ್‌ಡ್ grid ಬುಡ್‌ದ್ಂಡ್.

prefigure-annotations-not-rendered = `<graph>`: PreFigure ರೆಂಡರರ್ ಬಳಕೆ ಮಲ್ತಿಜ್ಜಂಡ ಟಿಪ್ಪಣಿಲು ಬರೆಪುಜಿ.

multiple-annotations-children = `<graph>`ಡ್ ಒಂಜಿಡ್ದ್ ಜಾಸ್ತಿ `<annotations>` ಮಗೆಲು ತಿಕ್ಕ್‌ಂಡ್; ಕಡೆತ ಒಂಜಿ ಬುಡ್‌ದ್ ಬಾಕಿ ಮಾತ ಪರಿಗಣನೆ ಆಪುಜಿ.

## Referring to other components

copy-unrecognized-component-type = ಗೊತ್ತಾವಂದಿನ ಘಟಕೊದ ತರೊನು ವಿಸ್ತರಿಸೆರೆ ಅತ್ತ್ಂಡ ನಕಲ್ ಮಲ್ಪೆರೆ ಆಪುಜಿ: { $type }.

copy-prop-not-found = { $component } ತರೊತ ಘಟಕೊಡು { $property } prop ತಿಕ್ಕುಜಿ

collect-no-source = collect‌ಗ್ ಒವ್ವೇ ಮೂಲ ತಿಕ್ಕುಜಿ.

collect-invalid-component-type = `<{ $component }>` ಸರಿಯಾಯಿನ ಘಟಕೊದ ತರ ಅತ್ತ್, ಅಂಚಾದ್ ಆ ತರೊತ ಘಟಕೊಲೆನ್ collect ಮಲ್ಪೆರೆ ಆಪುಜಿ.

reference-index-unavailable = index `{ $reference }`ನ್ ತೋಜಾಯೆರೆ ಆಪುಜಿ

## `<callAction>`

component-action-unavailable = `{ $reference }` ಘಟಕೊಡು { $action } ಲೆಪ್ಪೆರೆ ಆಪುಜಿ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ದತ್ತಾಂಶೊದ ಆಕಾರ ತಪ್ಪು.  ಸಾಲುಲೆ ಉದ್ದ ಒಂಜೇ ಲೆಕ್ಕ ಇಜ್ಜಿ. componentIdx :{ $componentIdx }ಡ್ ತಿಕ್ಕ್‌ಂಡ್

data-frame-duplicate-column-names = ದತ್ತಾಂಶೊಡು ಒಂಜೇ ಕಂಬೊದ ಪುದರ್ ರಡ್ಡ್ ಸರ್ತಿ ಉಂಡು.  componentIdx :{ $componentIdx }ಡ್ ತಿಕ್ಕ್‌ಂಡ್

data-frame-missing-column-name = ದತ್ತಾಂಶೊಡು ಒಂಜಿ ಕಂಬೊದ ಪುದರ್ ಇಜ್ಜಿ.  componentIdx :{ $componentIdx }ಡ್ ತಿಕ್ಕ್‌ಂಡ್

## `<answer>` and scoring

answer-award-depends-on-own-response = ಈ ಉತ್ತರೊದ ಒಂಜಿ award ಈ answer ಟ್ಯಾಗ್ ತಾನೇ ಕಡಪುಡಿನ ಉತ್ತರೊದ ಮಿತ್ತ್ ನಿಂದ್‌ದ, ಅವೆಟ್ಟ್ ನಿರೀಕ್ಷೆ ಮಲ್ತಿಜ್ಜಂದಿನ ವರ್ತನೆ ಬರ್ಪುಂಡು.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` ಇತ್ತಿನ ಪಾತ್ರೆದ ಒಳಯಿದ `<answer>`ಡ್ `maxNumAttempts` ದೀತ್ಂಡ ಒವ್ವೇ ಪ್ರಯೋಜನ ಇಜ್ಜಿ, ದಾಯೆಗ್ಂಡ ಪ್ರಯತ್ನೊದ ಸಂಖ್ಯೆನ್ ಪಾತ್ರೆನೇ ನಿಯಂತ್ರಣ ಮಲ್ಪುಂಡು. `maxNumAttempts`ನ್ ಪಾತ್ರೆದ ಮಿತ್ತೇ ದೀಲೆ.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` ಇತ್ತಿನ ಬೇತೆ ಒಂಜಿ ಪಾತ್ರೆದ ಒಳಯಿದ `sectionWideCheckWork` ಪಾತ್ರೆಡ್ `maxNumAttempts` ದೀತ್ಂಡ ಒವ್ವೇ ಪ್ರಯೋಜನ ಇಜ್ಜಿ, ದಾಯೆಗ್ಂಡ ಪ್ರಯತ್ನೊದ ಸಂಖ್ಯೆನ್ ಪಿದಯಿದ ಪಾತ್ರೆನೇ ನಿಯಂತ್ರಣ ಮಲ್ಪುಂಡು. `maxNumAttempts`ನ್ ಪಿದಯಿದ ಪಾತ್ರೆದ ಮಿತ್ತೇ ದೀಲೆ.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] symbolicEquality ದೀತಿಜ್ಜಂಡ { $attributes } ಗುಣೊಗು ಒವ್ವೇ ಪ್ರಯೋಜನ ಇಜ್ಜಿ.
    }

answer-invalid-type = ಉತ್ತರೊಗು ತಪ್ಪು type: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` ಘಟಕೊಗು ಪುದರ್ ಇಜ್ಜಿ, ಅಂಚಾದ್ ಅವೆನ್ module‌ದ ಗುಣ ಆದ್ ಬಳಸೆರೆ ಆಪುಜಿ

module-attribute-name-already-defined = `<module>` ಘಟಕೊದ ತರೊಡು "{ $name }" ಪುದರ್‌ದ ಗುಣ ದುಂಬೇ ಗೊತ್ತು ಮಲ್ತ್‌ದ್ಂಡ್, ಅಂಚಾದ್ `<{ $component } name="{ $name }">` ಘಟಕೊನು module‌ದ ಗುಣ ಆದ್ ಬಳಸೆರೆ ಆಪುಜಿ.

conditional-content-condition-ignored = case ಅತ್ತ್ಂಡ else ಮಗೆಲು ಇತ್ತಿನ `<conditionalContent>` ಘಟಕೊಡು `condition` ಗುಣ ಪರಿಗಣನೆ ಆಪುಜಿ.

slider-markers-type-mismatch = Marker‌ದ ತರ slider‌ದ ತರೊಗು ಸರಿ ಬರ್ಪುಜಿ.

pretzel-problem-needs-statement-and-answer = ತಪ್ಪು pretzel: ಪ್ರತಿ `<problem>`ಡ್ ಒಂಜಿ `<statement>` ಬೊಕ್ಕ ಒಂಜಿ `<answer>` ಇಪ್ಪೊಡು.

pretzel-circuit-first-problem-distractor = ತಪ್ಪು pretzel: mode="circuit"ಡ್ ಸುರುತ `<problem>` distractor ಆಯೆರೆ ಆಪುಜಿ.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] `{ $attribute }` ಗುಣೊಗು ತಪ್ಪು ಮೌಲ್ಯ { $values }; ಪರಿಗಣನೆ ಆಪುಜಿ.
    }

attribute-must-be-references = `{ $attribute }` ಗುಣೊಗು ತಪ್ಪು ಮೌಲ್ಯ `{ $value }`. ಗುಣೊನು `$`ಡ್ ಸುರುವಾಪುನ ಉಲ್ಲೇಖೊಲೆಡ್ ಮಲ್ಪೊಡು.

math-input-invalid-function-names = <mathInput>: { $attribute }ಡ್ ಇತ್ತಿನ ತಪ್ಪು ಉತ್ಪನ್ನೊದ ಪುದರ್ ಪರಿಗಣನೆ ಆಪುಜಿ: { $names }. ಪ್ರತಿ ಪುದರ್‌ದ ತೋಜಾವುನ ಭಾಗ ಕಡಿಮೆ ಪಂಡ 2 ಅಕ್ಷರ (ಅಕ್ಷರ ಅತ್ತ್ಂಡ ಡ್ಯಾಶ್) ಆವೊಡು; ಬುಕ್ಕ ಒಂಜಿ `|<mathspeak alternative>` ಸೇರಾವೊಲಿ.

## Building components from the source

component-type-invalid = ತಪ್ಪು ಘಟಕೊದ ತರ: `<{ $componentType }>`

attribute-repeated = { $attribute } ಗುಣೊನು ರಡ್ಡ್ ಸರ್ತಿ ಕೊರೆರೆ ಆಪುಜಿ.

attribute-invalid-for-component = `<{ $componentType }>` ತರೊತ ಘಟಕೊಗು ತಪ್ಪು ಗುಣ "{ $attribute }".

## Style definition contrast

style-definition-insufficient-contrast =
    ಶೈಲಿ ವ್ಯಾಖ್ಯೆ { $styleNumber }ಡ್ { $context ->
        [text-on-background] ಹಿನ್ನೆಲೆದ ಬಣ್ಣೊಗು ಎದುರು ಬರವುದ ಬಣ್ಣೊದ
        [high-contrast] ಕ್ಯಾನ್ವಾಸ್‌ಗ್ ಎದುರು ಹೆಚ್ಚು-ವ್ಯತ್ಯಾಸೊದ ಬಣ್ಣೊದ
        [line] ಕ್ಯಾನ್ವಾಸ್‌ಗ್ ಎದುರು ಗೆರೆದ ಬಣ್ಣೊದ
        [marker] ಕ್ಯಾನ್ವಾಸ್‌ಗ್ ಎದುರು marker‌ದ ಬಣ್ಣೊದ
       *[text-on-canvas] ಕ್ಯಾನ್ವಾಸ್‌ಗ್ ಎದುರು ಬರವುದ ಬಣ್ಣೊದ
    } ವ್ಯತ್ಯಾಸ ಸಾಲುಜಿ{ $mode ->
        [dark] { " (ಕಪ್ಪು ಮೋಡ್)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ಕಡಿಮೆ ಪಂಡ { $threshold }:1 ಬೋಡು).

style-definition-dark-mode-text-background-contrast =
    ಶೈಲಿ ವ್ಯಾಖ್ಯೆ { $styleNumber }ಡ್ ಕೊರ್ತಿನ ಬಣ್ಣೊಲು ಬೊಲ್ದು ಮೋಡ್‌ಗ್ ಸಾಕಾಪುನಷ್ಟು ವ್ಯತ್ಯಾಸ ಕೊರ್ಪುಂಡು ಆಂಡ, ಆ ಮೌಲ್ಯೊಡ್ದ್ ಮಲ್ತಿನ ಕಪ್ಪು ಮೋಡ್‌ದ ಬಣ್ಣೊಲೆಡ್ ಹಿನ್ನೆಲೆದ ಬಣ್ಣೊಗು ಎದುರು ಬರವುದ ಬಣ್ಣೊದ ವ್ಯತ್ಯಾಸ ಸಾಲುಜಿ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ಕಡಿಮೆ ಪಂಡ { $threshold }:1 ಬೋಡು). { $suggestion ->
        [available] ಕಪ್ಪು ಮೋಡ್‌ಡ್ ಸಾಕಾಪುನಷ್ಟು ವ್ಯತ್ಯಾಸ ತಿಕ್ಕೆರೆ ಬೊಲ್ದು ಮೋಡ್‌ದ ವ್ಯತ್ಯಾಸೊನು ಜಾಸ್ತಿ ಮಲ್ಪುಲೆ (ಉದಾ. { $lightAttribute }="{ $lightColor }" ದೀಲೆ), ಅತ್ತ್ಂಡ ಕಪ್ಪು ಮೋಡ್‌ದ ಬಣ್ಣೊನು ಈರೇ ಗೊತ್ತು ಮಲ್ಪುಲೆ (ಉದಾ. { $darkAttribute }="{ $darkColor }").
       *[none] ಕಪ್ಪು ಮೋಡ್‌ಡ್ ಸಾಕಾಪುನಷ್ಟು ವ್ಯತ್ಯಾಸ ತಿಕ್ಕೆರೆ ಬೊಲ್ದು ಮೋಡ್‌ದ ವ್ಯತ್ಯಾಸೊನು ಜಾಸ್ತಿ ಮಲ್ಪುಲೆ, ಅತ್ತ್ಂಡ textColorDarkMode ಬೊಕ್ಕ/ಅತ್ತ್ಂಡ backgroundColorDarkMode ಮುಖಾಂತರ ಮಲ್ತಿನ ಬಣ್ಣೊಲೆನ್ ಈರೇ ಗೊತ್ತು ಮಲ್ಪುಲೆ.
    }

style-definition-dark-mode-text-canvas-contrast =
    ಶೈಲಿ ವ್ಯಾಖ್ಯೆ { $styleNumber }ಡ್ ಕೊರ್ತಿನ ಬರವುದ ಬಣ್ಣ ಬೊಲ್ದು ಮೋಡ್‌ಗ್ ಸಾಕಾಪುನಷ್ಟು ವ್ಯತ್ಯಾಸ ಕೊರ್ಪುಂಡು ಆಂಡ, ಆ ಮೌಲ್ಯೊಡ್ದ್ ಮಲ್ತಿನ ಕಪ್ಪು ಮೋಡ್‌ದ ಬರವುದ ಬಣ್ಣೊಗು ಕ್ಯಾನ್ವಾಸ್‌ಗ್ ಎದುರು ವ್ಯತ್ಯಾಸ ಸಾಲುಜಿ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ಕಡಿಮೆ ಪಂಡ { $threshold }:1 ಬೋಡು). { $suggestion ->
        [available] ಕಪ್ಪು ಮೋಡ್‌ಡ್ ಸಾಕಾಪುನಷ್ಟು ವ್ಯತ್ಯಾಸ ತಿಕ್ಕೆರೆ ಬೊಲ್ದು ಮೋಡ್‌ದ ವ್ಯತ್ಯಾಸೊನು ಜಾಸ್ತಿ ಮಲ್ಪುಲೆ (ಉದಾ. textColor="{ $lightColor }" ದೀಲೆ), ಅತ್ತ್ಂಡ ಕಪ್ಪು ಮೋಡ್‌ದ ಬಣ್ಣೊನು ಈರೇ ಗೊತ್ತು ಮಲ್ಪುಲೆ (ಉದಾ. textColorDarkMode="{ $darkColor }").
       *[none] ಕಪ್ಪು ಮೋಡ್‌ಡ್ ಸಾಕಾಪುನಷ್ಟು ವ್ಯತ್ಯಾಸ ತಿಕ್ಕೆರೆ ಬೊಲ್ದು ಮೋಡ್‌ದ ವ್ಯತ್ಯಾಸೊನು ಜಾಸ್ತಿ ಮಲ್ಪುಲೆ, ಅತ್ತ್ಂಡ textColorDarkMode ಮುಖಾಂತರ ಮಲ್ತಿನ ಬಣ್ಣೊನು ಈರೇ ಗೊತ್ತು ಮಲ್ಪುಲೆ.
    }

section-multiple-style-palettes = ಒಂಜಿ ವಿಭಾಗ ಒಂಜೇ <stylePalette>ನ್ ಆಯ್ಕೆ ಮಲ್ಪೊಲಿ; ಕಡೆತ ಒಂಜಿ ಬಳಕೆ ಆಂಡ್.

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect ಋಣಾತ್ಮಕ ಅತ್ತಿನ ಪೂರ್ಣಾಂಕ ಅತ್ತ್, ಅಂಚಾದ್ { $component }ದ ವಿಶಿಷ್ಟ variant ಗೊತ್ತು ಮಲ್ಪೆರೆ ಆಪುಜಿ.

variant-num-to-select-not-constant-number = numToSelect ಸ್ಥಿರ ಸಂಖ್ಯೆ ಅತ್ತ್, ಅಂಚಾದ್ { $component }ದ ವಿಶಿಷ್ಟ variant ಗೊತ್ತು ಮಲ್ಪೆರೆ ಆಪುಜಿ.

variant-with-replacement-not-constant-boolean = withReplacement ಸ್ಥಿರ boolean ಅತ್ತ್, ಅಂಚಾದ್ { $component }ದ ವಿಶಿಷ್ಟ variant ಗೊತ್ತು ಮಲ್ಪೆರೆ ಆಪುಜಿ.

variant-select-weight-disables-unique = selectWeight ಅತ್ತ್ಂಡ selectForVariants ಕೊರ್ತಿನ option ಇತ್ತ್ಂಡ select‌ದ ವಿಶಿಷ್ಟ variant ನಿಲ್ಲುಂಡು

variant-coprime-undetermined = coprime ಪೂರ ಸರ್ತಿಲಾ ಸುಳ್ಳು ಪಂಡ್‌ದ್ ಗೊತ್ತು ಮಲ್ಪೆರೆ ಆಪುಜಿ, ಅಂಚಾದ್ { $component }ದ ವಿಶಿಷ್ಟ variant ಗೊತ್ತು ಮಲ್ಪೆರೆ ಆಪುಜಿ.

variant-attribute-not-constant = { $attribute } ಸ್ಥಿರ ಅತ್ತ್, ಅಂಚಾದ್ { $component }ದ ವಿಶಿಷ್ಟ variant ಗೊತ್ತು ಮಲ್ಪೆರೆ ಆಪುಜಿ.

variant-attribute-not-number = { $attribute } ಸಂಖ್ಯೆ ಅತ್ತ್, ಅಂಚಾದ್ { $component }ದ ವಿಶಿಷ್ಟ variant ಗೊತ್ತು ಮಲ್ಪೆರೆ ಆಪುಜಿ.

variant-attribute-wrong-type-for-sequence =
    { $attribute } { $expected ->
        [letters-combination] ಅಕ್ಷರೊಲೆ ಸಂಯೋಜನೆ
        [math-expression] ಸರಿಯಾಯಿನ ಗಣಿತ ಸೂತ್ರ
        [integer] ಪೂರ್ಣಾಂಕ
       *[number] ಸಂಖ್ಯೆ
    } ಅತ್ತ್, ಅಂಚಾದ್ { $type } ತರೊತ { $component }ದ ವಿಶಿಷ್ಟ variant ಗೊತ್ತು ಮಲ್ಪೆರೆ ಆಪುಜಿ.

variant-length-not-integer = length ಪೂರ್ಣಾಂಕ ಅತ್ತ್, ಅಂಚಾದ್ { $component }ದ ವಿಶಿಷ್ಟ variant ಗೊತ್ತು ಮಲ್ಪೆರೆ ಆಪುಜಿ.

variant-sort-not-implemented = sort ಇತ್ತಿನ { $component }ದ ವಿಶಿಷ್ಟ variant ಇನಿ ಮುಟ್ಟ ಮಲ್ತಿಜ್ಜಿ

variant-exclude-combinations-not-implemented = excludeCombinations ಇತ್ತಿನ { $component }ದ ವಿಶಿಷ್ಟ variant ಇನಿ ಮುಟ್ಟ ಮಲ್ತಿಜ್ಜಿ

variant-math-exclude-not-implemented = exclude ಇತ್ತಿನ math ತರೊತ { $component }ದ ವಿಶಿಷ್ಟ variant ಇನಿ ಮುಟ್ಟ ಮಲ್ತಿಜ್ಜಿ

variant-non-constant-exclude-not-implemented = ಸ್ಥಿರ ಅತ್ತಿನ exclude ಇತ್ತಿನ { $component }ದ ವಿಶಿಷ್ಟ variant ಇನಿ ಮುಟ್ಟ ಮಲ್ತಿಜ್ಜಿ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure ರೆಂಡರರ್‌ಡ್ ನಡೆಪುಜಿ; ವಂಶಜೆ ಬುಡ್‌ದ್ಂಡ್.

prefigure-descendant-invalid-geometry = { $subject }: ಅಪೂರ್ಣ ಅತ್ತ್ಂಡ ಮಿತಿ ಇಜ್ಜಂದಿನ ರೇಖಾಗಣಿತ; ವಂಶಜೆ ಬುಡ್‌ದ್ಂಡ್.

prefigure-curve-label-omitted = { $subject }: ಪರಿವರ್ತನೆ ಆಯಿನ ವಕ್ರ ಘಟಕೊಲೆಡ್ label ನಡೆಪುಜಿ; label ಬುಡ್‌ದ್ಂಡ್.

prefigure-curve-unsupported-definition-type = { $subject }: ನಡೆಪಂದಿನ ವಕ್ರ ಉತ್ಪನ್ನೊದ ವ್ಯಾಖ್ಯೆದ ತರ '{ $definitionType }'; ವಂಶಜೆ ಬುಡ್‌ದ್ಂಡ್.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves‌ಡ್ ನಡೆಪಂದಿನ flipFunctions ಗುಣ; ವಂಶಜೆ ಬುಡ್‌ದ್ಂಡ್.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves‌ಡ್ formula ತರೊತ ಮಗೆ ಉತ್ಪನ್ನೊಲು ಮಾತ್ರ ನಡೆಪುಂಡು; ವಂಶಜೆ ಬುಡ್‌ದ್ಂಡ್.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] ಗೆರೆ-ಕುಟುಮೊದ label
       *[point] ಬಿಂದುದ label
    }ಗ್ ನಡೆಪಂದಿನ labelPosition '{ $labelPosition }'; ದುಂಬೇ ಗೊತ್ತು ಮಲ್ತಿನ PreFigure ಜೋಡಣೆ ಬಳಕೆ ಆಂಡ್.

prefigure-fill-style-unsupported = { $subject }: ತುಂಬಾವುನ ಶೈಲಿ '{ $fillStyle }' PreFigure‌ಡ್ ನಡೆಪುಜಿ; ಗಟ್ಟಿ ತುಂಬಾವುನ ಬಳಕೆ ಆಂಡ್.

prefigure-line-style-unknown = { $subject }: ಗೊತ್ತಿಜ್ಜಂದಿನ ಗೆರೆದ ಶೈಲಿ '{ $lineStyle }' PreFigure‌ದ ಫಲಿತಾಂಶೊಡ್ದ್ ಬುಡ್‌ದ್ಂಡ್.

prefigure-marker-style-mapped-to-diamond = { $subject }: marker ಶೈಲಿ '{ $markerStyle }' PreFigure‌ದ 'diamond' ಶೈಲಿಗ್ ಬದಲಾಂಡ್.

prefigure-marker-style-unsupported = { $subject }: marker ಶೈಲಿ '{ $markerStyle }' PreFigure‌ಡ್ ನಡೆಪುಜಿ; ದುಂಬೇ ಗೊತ್ತು ಮಲ್ತಿನ ಶೈಲಿ ಬಳಕೆ ಆಂಡ್.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ತಪ್ಪು `ref`; target ಗೊತ್ತು ಮಲ್ಪೆರೆ ಆಪುಜಿ. ಟಿಪ್ಪಣಿ ಬುಡ್‌ದ್ಂಡ್.

annotation-ref-multiple-targets = `<annotation>`: `ref` ಒಂಜಿಡ್ದ್ ಜಾಸ್ತಿ target‌ಗ್ ಸೇರ್‌ದ್ಂಡ್; ಸುರುತ target ಬಳಕೆ ಆಂಡ್.

annotation-ref-outside-graph = `<annotation>`: ತಪ್ಪು `ref`; target ಸುತ್ತುದ graph‌ದ ಪಿದಯಿ ಉಂಡು. ಟಿಪ್ಪಣಿ ಬುಡ್‌ದ್ಂಡ್.

annotation-ref-unsupported-target = `<annotation>`: ತಪ್ಪು `ref`; prefigure ಪರಿವರ್ತನೆಡ್ target ನಡೆಪುನ ಚಿತ್ರೊದ ವಸ್ತು ಅತ್ತ್. ಟಿಪ್ಪಣಿ ಬುಡ್‌ದ್ಂಡ್.

annotation-text-missing = `<annotation>`: `text` ಇಜ್ಜಿ ಅತ್ತ್ಂಡ ಖಾಲಿ ಉಂಡು; ಖಾಲಿ ಬರವು ಕೊರ್ತ್‌ದ್ಂಡ್.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] ಸುತ್ತು ಅವಲಂಬನೆ ತಿಕ್ಕ್‌ಂಡ್.
       *[other] `<{ $componentType }>` ಘಟಕೊಗು ಸಂಬಂಧಪಟ್ಟಿನ ಸುತ್ತು ಅವಲಂಬನೆ ತಿಕ್ಕ್‌ಂಡ್.
    }

reference-no-referent = ಉಲ್ಲೇಖೊಗು ಒವ್ವೇ ಗುರಿ ತಿಕ್ಕುಜಿ: `{ $reference }`

reference-multiple-referents = ಉಲ್ಲೇಖೊಗು ಒಂಜಿಡ್ದ್ ಜಾಸ್ತಿ ಗುರಿ ತಿಕ್ಕ್‌ಂಡ್: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>`ದ { $attribute } ಗುಣೊದ ತಪ್ಪು ರೂಪ.

children-invalid = `<{ $componentType }>`ಗ್ ತಪ್ಪು ಮಗೆಲು: ತಪ್ಪು ಮಗೆಲು ತಿಕ್ಕ್‌ಂಡ್: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` ಗುಣೊಗು ತಪ್ಪು ಮೌಲ್ಯ `{ $value }`, `{ $default }` ಮೌಲ್ಯ ಬಳಕೆ ಆಂಡ್

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML ಆವೃತ್ತಿ { $version } ತಿಕ್ಕುಜಿ.
       *[other] DoenetML ಆವೃತ್ತಿ { $version } ತಿಕ್ಕುಜಿ. ಆವೃತ್ತಿ { $fallback }ಗ್ ಪಿರ ಪೋತ್‌ದ್ಂಡ್
    }

## Reading the DoenetML

parse-invalid-doenetml = ತಪ್ಪು DoenetML: { $content }

parse-tag-missing-close-tag = ತಪ್ಪು DoenetML: `{ $tag }` ಟ್ಯಾಗ್‌ಗ್ ಮುಚ್ಚುನ ಟ್ಯಾಗ್ ಇಜ್ಜಿ. ತನ್ನಂತಾನೇ ಮುಚ್ಚುನ ಟ್ಯಾಗ್ ಅತ್ತ್ಂಡ ಒಂಜಿ `</{ $tagName }>` ಟ್ಯಾಗ್ ಬೋಡು.

parse-tag-error = ತಪ್ಪು DoenetML: `<{ $tagName }>` ಟ್ಯಾಗ್‌ಡ್ ದೋಷ

parse-attribute-missing-value = ತಪ್ಪು DoenetML: ತಪ್ಪು ಗುಣ `{ $attribute }`ಗ್ ಮೌಲ್ಯ ಇಜ್ಜಿ ಪಂಡ್‌ದ್ ತೋಜುಂಡು.

parse-attribute-invalid = ತಪ್ಪು DoenetML: ತಪ್ಪು ಗುಣ `{ $attribute }`

parse-attribute-value-invalid = ತಪ್ಪು DoenetML: ತಪ್ಪು ಗುಣೊದ ಮೌಲ್ಯ `{ $value }`

parse-attribute-value-quote-mismatch = ತಪ್ಪು DoenetML: ತಪ್ಪು ಗುಣೊದ ಮೌಲ್ಯ `{ $value }`. ಉದ್ಧರಣ ಚಿಹ್ನೆಲು ಸರಿ ಬರ್ಪುಜಿ. ಒಂಜಿ `{ $quote }` ಇಜ್ಜಿ ಪಂಡ್‌ದ್ ತೋಜುಂಡು

parse-open-tag-name-missing = ತಪ್ಪು DoenetML: ಪುದರ್ ಇಜ್ಜಂದಿನ ಒಂಜಿ ಟ್ಯಾಗ್ ತಿಕ್ಕ್‌ಂಡ್, ಉದಾ. `<`

parse-tag-not-closed = ತಪ್ಪು DoenetML: `{ $tag }` ಟ್ಯಾಗ್ ಮುಚ್ಚಿಜ್ಜಿ (ಒಂಜಿ `>` ಇಜ್ಜಿ ಪಂಡ್‌ದ್ ತೋಜುಂಡು).

parse-self-closing-tag-name-missing = ತಪ್ಪು DoenetML: ಪುದರ್ ಇಜ್ಜಂದಿನ ಒಂಜಿ ಟ್ಯಾಗ್ ತಿಕ್ಕ್‌ಂಡ್ `<{ $content }>`

parse-self-closing-tag-not-closed = ತಪ್ಪು DoenetML: `{ $tag }` ಟ್ಯಾಗ್ ಮುಚ್ಚಿಜ್ಜಿ (`/>` ಇಜ್ಜಿ ಪಂಡ್‌ದ್ ತೋಜುಂಡು).

parse-tag-invalid-attributes = ತಪ್ಪು DoenetML: `{ $tag }` ಟ್ಯಾಗ್ ಸರಿ ಅತ್ತ್. ಅವೆತ ಗುಣೊಲು ತಪ್ಪಾದಿಪ್ಪೊಲಿ.

parse-close-tag-name-missing = ತಪ್ಪು DoenetML: ಪುದರ್ ಇಜ್ಜಂದಿನ ಒಂಜಿ ಮುಚ್ಚುನ ಟ್ಯಾಗ್ ತಿಕ್ಕ್‌ಂಡ್, ಉದಾ. `</`

parse-attribute-value-unquoted = ಗುಣೊದ ಮೌಲ್ಯೊಲೆನ್ ಉದ್ಧರಣ ಚಿಹ್ನೆದ ಒಳಯಿ ದೀಯೊಡು: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = ತಪ್ಪು DoenetML: `{ $tag }` ಮುಚ್ಚುನ ಟ್ಯಾಗ್ ತಿಕ್ಕ್‌ಂಡ್, ಆಂಡ ಅವೆಗ್ ಸರಿಯಾಯಿನ ದೆಪ್ಪುನ ಟ್ಯಾಗ್ ಇಜ್ಜಿ

parse-close-tag-mismatched = ತಪ್ಪು DoenetML: ಮುಚ್ಚುನ ಟ್ಯಾಗ್ ಸರಿ ಬರ್ಪುಜಿ. `</{ $expected }>` ಬೋಡು. `{ $found }` ತಿಕ್ಕ್‌ಂಡ್

parser-node-unconvertible = { $node } ನೋಡ್‌ನ್ Dast ನೋಡ್‌ಗ್ ಬದಲಾಯೆರೆ ಆತಿಜ್ಜಿ.

## Names

name-attribute-invalid =
    ತಪ್ಪು ಗುಣ name='{ $name }'. { $reason ->
        [characters] ಪುದರುಲೆಡ್ ಅಕ್ಷರ, ಸಂಖ್ಯೆ, ಅಂಡರ್‌ಸ್ಕೋರ್ ಅತ್ತ್ಂಡ ಹೈಫನ್ ಮಾತ್ರ ಇಪ್ಪೊಲಿ.
       *[start] ಪುದರ್ ಒಂಜಿ ಅಕ್ಷರೊಡ್ದ್ ಸುರುವಾವೊಡು.
    }

component-name-invalid-start = ತಪ್ಪು ಘಟಕೊದ ಪುದರ್ "{ $name }". ಪುದರ್ ಒಂಜಿ ಅಕ್ಷರೊಡ್ದ್ ಸುರುವಾವೊಡು.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched ತರೊತ answer‌ಗ್ ಒಂಜಿ video ಗುಣ ಇಪ್ಪೊಡು

answer-video-watched-video-not-reference = videoWatched ತರೊತ answer‌ದ video ಗುಣ ಒಂಜಿ ಉಲ್ಲೇಖ ಆವೊಡು

answer-name-not-single-text = Answer‌ದ name ಗುಣೊಡು ಒಂಜೇ text ಮಗೆ ಇಪ್ಪೊಡು

## Referencing another document

external-doenetml-recursion-limit = ಮಸ್ತ್ ಹಂತೊಲೆ ಪುನರಾವರ್ತನೆದ ಕಾರಣ ಪಿದಯಿದ DoenetML ದೆತೊನ್ಯೆರೆ ಆತಿಜ್ಜಿ. ಒವ್ವಾಂಡಲಾ ಸುತ್ತು ಉಲ್ಲೇಖ ಉಂಡಾ?

external-doenetml-unavailable = { $attribute }="{ $uri }"ಡ್ದ್ DoenetML ದೆತೊನ್ಯೆರೆ ಆತಿಜ್ಜಿ

external-doenetml-type-mismatch = { $attribute }="{ $uri }"ಡ್ದ್ ದೆತೊಂಡಿನ DoenetML ತಪ್ಪು: ಅವು "{ $componentType }" ಘಟಕೊದ ತರೊಗು ಸರಿ ಬರ್ಪುಜಿ

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` ಗುಣ ಪರ್ತ್‌ದ್ಂಡ್; ಅವೆತ ಬದಲ್ `{ $to }` ಬಳಸುಲೆ.
       *[other] [deprecation] `<{ $component }>`ದ `{ $from }` ಗುಣ ಪರ್ತ್‌ದ್ಂಡ್; ಅವೆತ ಬದಲ್ `{ $to }` ಬಳಸುಲೆ.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }`ಲಾ ಕೊರ್ತ್‌ದ್ಂಡ್, ಅಂಚಾದ್ `{ $from }` ಗುಣ ಪರ್ತ್‌ದ್ಂಡ್ ಬೊಕ್ಕ ಪರಿಗಣನೆ ಆಪುಜಿ.
       *[other] [deprecation] `<{ $component }>`ದ `{ $from }` ಗುಣ ಪರ್ತ್‌ದ್ಂಡ್ ಬೊಕ್ಕ `{ $to }`ಲಾ ಕೊರ್ತಿನೆಡ್ದ್ ಪರಿಗಣನೆ ಆಪುಜಿ.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`ದ `{ $attribute }` ಗುಣ ಪರ್ತ್‌ದ್ಂಡ್ ಬೊಕ್ಕ ಪರಿಗಣನೆ ಆಪುಜಿ.

deprecated-attribute-to-child = [deprecation] `<{ $component }>`ದ `{ $attribute }` ಗುಣ ಪರ್ತ್‌ದ್ಂಡ್; ಅವೆತ ಬದಲ್ ಒಂಜಿ `<{ $child }>` ಮಗೆನ್ ಬಳಸುಲೆ.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>`ದ `{ $attribute }` ಗುಣೊದ `{ $value }` ಮೌಲ್ಯ ಪರ್ತ್‌ದ್ಂಡ್; ಅವೆತ ಬದಲ್ `{ $to }` ಬಳಸುಲೆ.


## Language coverage

pluralize-english-only = `<pluralize>` ಇಂಗ್ಲಿಷ್‌ದ ಬಹುವಚನೊನು ಮಾತ್ರ ಮಲ್ಪೊಲಿ, ಅಂಚಾದ್ { $locale } ಭಾಷೆಡ್ ಬರೆತಿನ ದಾಖಲೆಡ್ ಅವೆತ ಬರವು ಇತ್ತಿನಂಚನೇ ಒರಿಪುಂಡು. ಬಹುವಚನೊದ ರೂಪೊನು ನೇರವಾದ್ ಬರೆಪುಲೆ, ಅತ್ತ್ಂಡ `pluralForm` ಗುಣೊಡು ಕೊರ್ಲೆ.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` ಘಟಕ Doenet‌ದ ಗೊತ್ತಿತ್ತಿನ ಘಟಕ ಅತ್ತ್.

schema-element-not-allowed-at-root = `<{ $tag }>` ಘಟಕೊನು ದಾಖಲೆದ ಬುಡೊಡು ದೀಯೆರೆ ಆಪುಜಿ.

schema-element-not-allowed-inside = `<{ $tag }>` ಘಟಕೊನು `<{ $parent }>`ದ ಒಳಯಿ ದೀಯೆರೆ ಆಪುಜಿ.

schema-attribute-unrecognized = `<{ $tag }>` ಘಟಕೊಗು `{ $attribute }` ಪುದರ್‌ದ ಒವ್ವೇ ಗುಣ ಇಜ್ಜಿ.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` ಘಟಕೊದ `{ $attribute }` ಗುಣ ಒಂಜಿ ಪಟ್ಟಿ ಆವೊಡು, ಅವೆತ ಪ್ರತಿ ವಸ್ತುಲಾ ಇಂದೆಟ್ಟ್ ಒಂಜಿ ಆವೊಡು: { $allowed }
       *[other] `<{ $tag }>` ಘಟಕೊದ `{ $attribute }` ಗುಣ ಇಂದೆಟ್ಟ್ ಒಂಜಿ ಆವೊಡು: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select‌ಗ್ ತಪ್ಪು variant ಪುದರ್.  Variant ಪುದರ್ { $variantName } { $numOptions } option‌ಡ್ ಬರ್ಪುಂಡು ಆಂಡ ಆಯ್ಕೆ ಮಲ್ಪುನ ಸಂಖ್ಯೆ { $numToSelect }.

select-variant-name-without-options = select‌ಗ್ ಕೆಲವು variant ಕೊರ್ತ್‌ದ್ಂಡ್ ಆಂಡ ಸಾಧ್ಯ ಇತ್ತಿನ variant ಪುದರ್ { $variantName }ಗ್ ಒವ್ವೇ option ಕೊರ್ತಿಜ್ಜಿ.

select-variant-name-not-possible = select‌ಗ್ ಕೊರ್ತಿನ variant ಪುದರ್ { $variantName } ಸಾಧ್ಯ ಇತ್ತಿನ variant ಪುದರ್ ಅತ್ತ್.

select-too-few-options = { $numOptions } ಮಾತ್ರ ಇತ್ತ್ಂಡ { $numToSelect } ಘಟಕೊಲೆನ್ ಆಯ್ಕೆ ಮಲ್ಪೆರೆ ಆಪುಜಿ.

select-from-sequence-too-few-values = { $length } ಉದ್ದೊದ ಅನುಕ್ರಮೊಡ್ದ್ { $numToSelect } ಮೌಲ್ಯೊಲೆನ್ ಆಯ್ಕೆ ಮಲ್ಪೆರೆ ಆಪುಜಿ.

select-from-sequence-indices-count-mismatch = select‌ಗ್ ಕೊರ್ತಿನ indices‌ದ ಸಂಖ್ಯೆ ಆಯ್ಕೆ ಮಲ್ಪುನ ಸಂಖ್ಯೆಗ್ ಸರಿ ಬರೊಡು

select-from-sequence-indices-not-integers = select‌ಗ್ ಕೊರ್ತಿನ ಮಾತ indices ಪೂರ್ಣಾಂಕ ಆವೊಡು

select-from-sequence-index-excluded = selectfromsequence‌ದ ಕೊರ್ತಿನ index ಬುಡ್‌ದಿನವು ಆದಿತ್ತ್ಂಡ್

select-from-sequence-indices-excluded-combination = selectfromsequence‌ದ ಕೊರ್ತಿನ indices ಬುಡ್‌ದಿನ ಸಂಯೋಜನೆ ಆದಿತ್ತ್ಂಡ್

select-from-sequence-coprime-not-positive-integers = ಧನಾತ್ಮಕ ಪೂರ್ಣಾಂಕೊಲೆನ್ ಆಯ್ಕೆ ಮಲ್ಪುಜಿ, ಅಂಚಾದ್ coprime ಸಂಯೋಜನೆ ಆಯ್ಕೆ ಮಲ್ಪೆರೆ ಆಪುಜಿ.

select-from-sequence-coprime-common-factor = Coprime ಸಂಖ್ಯೆಲೆನ್ ಆಯ್ಕೆ ಮಲ್ಪೆರೆ ಆಪುಜಿ. ಮಾತ ಸಾಧ್ಯ ಮೌಲ್ಯೊಲೆಗ್ ಒಂಜಿ ಸಾಮಾನ್ಯ ಅಪವರ್ತನ ಉಂಡು. ("from" ಅತ್ತ್ಂಡ "to"ದ ಕೊರ್ತಿನ ಮೌಲ್ಯೊಲು "step"ಗ್ coprime ಆವೊಡು.)

select-from-sequence-coprime-single-number = 1 ಅತ್ತಿನ ಒಂಜೇ ಸಂಖ್ಯೆಡ್ದ್ coprime ಸಂಯೋಜನೆ ಆಯ್ಕೆ ಮಲ್ಪೆರೆ ಆಪುಜಿ.

select-from-sequence-excluded-too-many-combinations = selectFromSequence‌ಡ್ ಸಂಯೋಜನೆಲೆಡ್ 70%ಡ್ದ್ ಜಾಸ್ತಿ ಬುಡ್‌ದ್ಂಡ್

select-from-sequence-coprime-none-found = Coprime ಸಂಖ್ಯೆಲೆನ್ ಆಯ್ಕೆ ಮಲ್ಪೆರೆ ಆತಿಜ್ಜಿ. ಮಾತ ಸಾಧ್ಯ ಮೌಲ್ಯೊಲೆಗ್ ಒಂಜಿ ಸಾಮಾನ್ಯ ಅಪವರ್ತನ ಉಂಡು.

select-from-sequence-too-few-unique-values = { $numPossibleValues } ಉದ್ದೊದ ಅನುಕ್ರಮೊಡ್ದ್ { $numToSelect } ವಿಶಿಷ್ಟ ಮೌಲ್ಯೊಲೆನ್ ಆಯ್ಕೆ ಮಲ್ಪೆರೆ ಆಪುಜಿ

select-prime-numbers-too-few-values = { $numValues } ಉದ್ದೊದ ಅವಿಭಾಜ್ಯ ಸಂಖ್ಯೆಲೆ ಪಟ್ಟಿಡ್ದ್ { $numToSelect } ಮೌಲ್ಯೊಲೆನ್ ಆಯ್ಕೆ ಮಲ್ಪೆರೆ ಆಪುಜಿ

select-prime-numbers-values-count-mismatch = select‌ಗ್ ಕೊರ್ತಿನ ಮೌಲ್ಯೊಲೆ ಸಂಖ್ಯೆ ಆಯ್ಕೆ ಮಲ್ಪುನ ಸಂಖ್ಯೆಗ್ ಸರಿ ಬರೊಡು

select-prime-numbers-values-not-prime = select prime number‌ಗ್ ಕೊರ್ತಿನ ಮಾತ ಮೌಲ್ಯೊಲು ಅವಿಭಾಜ್ಯ ಸಂಖ್ಯೆಲೆ ಪಟ್ಟಿಡ್ ಇಪ್ಪೊಡು

select-prime-numbers-values-excluded-combination = selectPrimeNumbers‌ದ ಕೊರ್ತಿನ ಮೌಲ್ಯೊಲು ಬುಡ್‌ದಿನ ಸಂಯೋಜನೆ ಆದಿತ್ತ್ಂಡ್

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers‌ಡ್ ಸಂಯೋಜನೆಲೆಡ್ 70%ಡ್ದ್ ಜಾಸ್ತಿ ಬುಡ್‌ದ್ಂಡ್

select-random-combination-fluke = ಮಸ್ತ್ ಅಪರೂಪದ ಆಕಸ್ಮಿಕೊಡು, ಯಾದೃಚ್ಛಿಕ ಮೌಲ್ಯೊಲೆ ಸಂಯೋಜನೆ ಆಯ್ಕೆ ಮಲ್ಪೆರೆ ಆತಿಜ್ಜಿ

select-random-value-fluke = ಮಸ್ತ್ ಅಪರೂಪದ ಆಕಸ್ಮಿಕೊಡು, ಯಾದೃಚ್ಛಿಕ ಮೌಲ್ಯ ಆಯ್ಕೆ ಮಲ್ಪೆರೆ ಆತಿಜ್ಜಿ

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] ಈ `<{ $component }>` ಗಣಿತೊದ ಒಳಯಿ ಉಂಡು ಆಂಡ `inline` ಅತ್ತ್, ಅಂಚಾದ್ ಅವು ತೋಜುಜಿ. `inline` ಸೇರಾಲೆ, ಅಂಚಾಂಡ ಅವು ಡ್ರಾಪ್-ಡೌನ್ ಪಟ್ಟಿ ಆಪುಂಡು, ಅವು ಸೂತ್ರೊದ ಒಳಯಿ ಸರಿಯಾಪುಂಡು.
        [expanded] ಈ `<{ $component }>` ಗಣಿತೊದ ಒಳಯಿ ಉಂಡು ಬೊಕ್ಕ `expanded` ಆದುಂಡು, ಅಂಚಾದ್ ಅವು ತೋಜುಜಿ. `expanded` ದೆತ್ತ್ ಪಾಡ್ಲೆ; ಮಸ್ತ್ ಸಾಲುದ ಪೆಟ್ಟಿಗೆ ಸೂತ್ರೊದ ಒಳಯಿ ಸರಿಯಾಪುಜಿ.
        [on-graph] ಈ `<{ $component }>` graph‌ದ ಮಿತ್ತ್ ಬರೆತಿನ ಗಣಿತೊದ ಒಳಯಿ ಉಂಡು, ಅವೆಟ್ input‌ಗ್ ಜಾಗೆ ಇಜ್ಜಿ, ಅಂಚಾದ್ ಅವು ತೋಜುಜಿ.
       *[relative-width] ಈ `<{ $component }>` ಗಣಿತೊದ ಒಳಯಿ ಉಂಡು ಬೊಕ್ಕ ಅವೆತ ಅಗಲ ಸಾಪೇಕ್ಷ ಆದುಂಡು, ಅಂಚಾದ್ ಅವು ತೋಜುಜಿ. ಅಗಲೊನು `px` ಲೆಕ್ಕದ ನಿರಪೇಕ್ಷ ಏಕಮಾನೊಡು ಕೊರ್ಲೆ.
    }
