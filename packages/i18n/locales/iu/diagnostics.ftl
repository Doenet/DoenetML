# Inuktitut (ᐃᓄᒃᑎᑐᑦ) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Canadian Aboriginal syllabics, the Nunavut standard. The
# Latin qaliujaaqpait orthography is not mixed in: every Inuktitut word below
# is in syllabics. ᙱ (U+1671) is the doubled *nng* and is not ᖏ (U+158F); ᕼ
# (U+157C) is the Inuktitut *h* and is not the Cree final ᐦ (U+1426), which
# appears nowhere in this file. `chrome.ftl` sets the series and the finals
# out in full.
#
# **Number.** `iu` selects **one**, **two** and **other** — Inuktitut has a
# real dual, with an ending of its own. Every count select below writes all
# three branches. No `few`, `many` or `zero` branch appears; the locale cannot
# select one. `chrome.ftl` explains the dual at length.
#
# **Suffixes and placeables.** An Inuktitut case ending cannot be welded onto
# a placeable whose final sound this catalog never sees, so no `{ $x }`-ᒥ
# appears anywhere below. Every sentence is built around its arguments with
# separate words, which is why several of them read as two short clauses where
# English reads as one long one.
#
# **A loan register with a syllabic frame.** The sentences here are ordinary
# sentences — something was not found, something is ignored, something must be
# a whole number, something is not yet built — and Inuktitut says all of them.
# The *nouns* inside them are another matter: *matrix*, *eigenvalue*,
# *coprime*, *domain*, *interval*, *variant*, *index*, *radius*, *option*
# have no settled Inuktitut word and no settled syllabic transliteration
# either, so they are written **in roman letters, as loans**, inside a
# syllabic sentence. That is the same decision `locales/sgh` records for its
# Tajik and Russian loans, and it is deliberate: an invented syllabic spelling
# would be harder for a speaker to repair than a visible loan.
#
# What is still **left out** is the handful of messages whose whole content is
# such vocabulary — the three `style-definition-*` contrast messages, the
# `<dataFrame>` shape messages beyond the three below, and
# `math-input-invalid-function-names`, whose talk of a display segment and a
# mathspeak alternative has no Inuktitut equivalent at any level. Those fall
# back to English, and they are the first thing a speaker with a
# mathematics-teaching background could repay.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } ᐊᑐᖅᑕᐅᙱᑦᑐᖅ, endpoint ᒪᕐᕉᒃ ᓇᓗᓇᐃᖅᑕᐅᒻᒪᑎᒃ
        [two] { $attributes } ᐊᑐᖅᑕᐅᙱᑦᑑᒃ, endpoint ᒪᕐᕉᒃ ᓇᓗᓇᐃᖅᑕᐅᒻᒪᑎᒃ
       *[other] { $attributes } ᐊᑐᖅᑕᐅᙱᑦᑐᑦ, endpoint ᒪᕐᕉᒃ ᓇᓗᓇᐃᖅᑕᐅᒻᒪᑎᒃ
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ᐊᑐᖅᑕᐅᙱᑦᑐᖅ, endpoint ᐊᒻᒪ midpoint ᑕᒪᕐᒥᒃ ᓇᓗᓇᐃᖅᑕᐅᒻᒪᑎᒃ
        [two] { $attributes } ᐊᑐᖅᑕᐅᙱᑦᑑᒃ, endpoint ᐊᒻᒪ midpoint ᑕᒪᕐᒥᒃ ᓇᓗᓇᐃᖅᑕᐅᒻᒪᑎᒃ
       *[other] { $attributes } ᐊᑐᖅᑕᐅᙱᑦᑐᑦ, endpoint ᐊᒻᒪ midpoint ᑕᒪᕐᒥᒃ ᓇᓗᓇᐃᖅᑕᐅᒻᒪᑎᒃ
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ᐊᑐᕐᓂᖃᙱᑦᑐᖅ midpoint ᐱᖃᙱᑉᐸᑦ

## `<ray>`

ray-overprescribed-through = through, endpoint ᐊᒻᒪ direction ᐱᖓᓲᓪᓗᑎᒃ ᓇᓗᓇᐃᖅᑕᐅᔪᑦ. through ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.

## `<vector>`

vector-overprescribed-head = head, tail ᐊᒻᒪ displacement ᐱᖓᓲᓪᓗᑎᒃ ᓇᓗᓇᐃᖅᑕᐅᔪᑦ. head ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ, nearestPoint ᐱᖃᙱᒻᒪᑦ.

constrain-to-without-nearest-point = `<{ $component }>` ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ, nearestPoint ᐱᖃᙱᒻᒪᑦ.

constrain-to-interior-without-nearest-point = `<{ $component }>` ᐃᓗᐊ ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ, nearestPoint ᐱᖃᙱᒻᒪᑦ.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ᐊᑐᖅᑕᐅᙱᑦᑐᖅ inline-ᒥᐅᙱᑦᑐᒥ choiceInput

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` ᐊᑐᖅᑕᐅᔪᒪᒃᐸᑦ `type` ᓇᓗᓇᐃᖅᑕᐅᔭᕆᐊᖃᖅᑐᖅ.

string-not-valid-component-to-arrange = "{ $value }" { $component }-ᒧᑦ ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ. ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.

## Types and variables

invalid-variable-value = ᑕᒻᒪᖅᓯᒪᔪᖅ: `{ $value }`

## `<sideBySide>`

side-by-side-no-block-child = `<{ $component }>` ᑕᒻᒪᖅᓯᒪᔪᖅ: ᐊᑕᐅᓯᖅ ᐊᒥᓲᓂᖅᓴᓪᓘᓐᓃᑦ block ᐱᖃᖅᑕᕆᐊᓕᒃ.

## `<label>`

label-for-ignored-on-graphical = `<label>` ᑎᑎᖅᑐᒐᐅᑉ ᐃᓗᐊᓂ `for` ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.

label-for-must-resolve-to-one = `<label>` `for` ᐊᑕᐅᓯᕐᒧᑦ ᑐᕌᖅᑕᕆᐊᓕᒃ.

label-for-unresolved = `<label>` `for` ᓇᓂᔭᐅᔪᓐᓇᙱᑦᑐᖅ.

label-for-answer-without-input = `<label>` `for` `<answer>`-ᒧᑦ ᑐᕌᖅᑐᖅ, ᑭᓯᐊᓂ ᑖᓐᓇ ᑎᑎᕋᖅᑕᐅᕕᖃᙱᑦᑐᖅ.

label-for-must-reference-input-or-answer = `<label>` `for` ᑎᑎᕋᖅᑕᐅᕕᖕᒧᑦ ᐅᕝᕙᓘᓐᓃᑦ `<answer>`-ᒧᑦ ᑐᕌᖅᑕᕆᐊᓕᒃ.

## Accessibility

accessibility-short-description-or-decorative = ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ `<{ $component }>` ᐅᓂᒃᑳᕐᔪᐊᖃᕆᐊᓕᒃ ᐅᕝᕙᓘᓐᓃᑦ decorative-ᒧᑦ ᓇᓗᓇᐃᖅᑕᐅᔭᕆᐊᓕᒃ.

accessibility-video-short-description = ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ `<video>` ᐅᓂᒃᑳᕐᔪᐊᖃᕆᐊᓕᒃ.

accessibility-input-short-description-or-label = ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ `<{ $component }>` ᐅᓂᒃᑳᕐᔪᐊᖃᕆᐊᓕᒃ ᐅᕝᕙᓘᓐᓃᑦ label-ᖃᕆᐊᓕᒃ.

accessibility-answer-input-short-description-or-label = ᐊᑐᕈᓐᓇᕐᓂᕐᒧᑦ `<answer>` ᑎᑎᕋᖅᑕᐅᕕᖃᖅᑎᑦᑎᔪᖅ ᐅᓂᒃᑳᕐᔪᐊᖃᕆᐊᓕᒃ ᐅᕝᕙᓘᓐᓃᑦ label-ᖃᕆᐊᓕᒃ.

accessibility-short-description-contains-math = ᐅᓂᒃᑳᕐᔪᐊᑦ ᓈᓴᐅᓯᕆᓂᕐᒧᑦ `<{ $component }>`-ᒥᒃ ᐱᖃᖅᑐᒃᓴᐅᙱᑦᑐᑦ. ᓈᓴᐅᓯᕆᓂᖅ ᐅᖃᐅᓯᕐᓂᒃ ᑎᑎᕋᕐᓗᒍ.

## `<circle>`

circle-too-many-through-points = ᐊᒥᓲᓂᖅᓴᐃᑦ ᐱᖓᓱᓂᑦ ᐊᖅᑯᑎᒋᓪᓗᒋᑦ ᐊᔪᕐᓇᖅᑐᖅ.

circle-overprescribed-radius-center-points = radius, center ᐊᒻᒪ ᐊᖅᑯᑎᖏᑦ ᑕᒪᕐᒥᒃ ᓇᓗᓇᐃᖅᑕᐅᒻᒪᑕ ᐊᔪᕐᓇᖅᑐᖅ.

circle-invalid-center-or-through-points = center ᐅᕝᕙᓘᓐᓃᑦ ᐊᖅᑯᑎᖏᑦ ᑕᒻᒪᖅᓯᒪᔪᑦ.

## `<function>`

function-domain-invalid-format = ᑕᒻᒪᖅᓯᒪᔪᖅ.

function-ignoring-non-numerical =
    { $type ->
        [maximum] maximum ᑭᓯᑦᓯᐅᑎᐅᙱᒻᒪᑦ ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.
        [minimum] minimum ᑭᓯᑦᓯᐅᑎᐅᙱᒻᒪᑦ ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.
        [extremum] extremum ᑭᓯᑦᓯᐅᑎᐅᙱᒻᒪᑦ ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.
        [point] ᑭᓯᑦᓯᐅᑎᐅᙱᒻᒪᑦ ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.
        [slope] slope ᑭᓯᑦᓯᐅᑎᐅᙱᒻᒪᑦ ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.
       *[other] { $type } ᑭᓯᑦᓯᐅᑎᐅᙱᒻᒪᑦ ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] maximum ᐃᒪᖃᙱᒻᒪᑦ ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.
        [minimum] minimum ᐃᒪᖃᙱᒻᒪᑦ ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.
        [extremum] extremum ᐃᒪᖃᙱᒻᒪᑦ ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.
        [point] ᐃᒪᖃᙱᒻᒪᑦ ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.
       *[other] { $type } ᐃᒪᖃᙱᒻᒪᑦ ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.
    }

## `<sequence>`

sequence-invalid-endpoint = "{ $attribute }" ᑕᒻᒪᖅᓯᒪᔪᖅ.

sequence-invalid-endpoint-number = "{ $attribute }" ᑕᒻᒪᖅᓯᒪᔪᖅ. ᑭᓯᑦᓯᐅᑎᐅᔭᕆᐊᓕᒃ.

## Resolving a `target`

target-not-found = `<{ $source }>` target ᓇᓂᔭᐅᙱᑦᑐᖅ.

target-state-variable-not-found = `<{ $source }>` target ᑕᒻᒪᖅᓯᒪᔪᖅ: `<{ $component }>` "{ $property }"-ᒥᒃ ᐱᖃᙱᑦᑐᖅ.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines =
    { $count ->
        [one] ᐊᖅᑯᑎ { $count } ᐊᑯᓐᓂᖓᓂ angle ᐊᔪᕐᓇᖅᑐᖅ
        [two] ᐊᖅᑯᑏᒃ { $count } ᐊᑯᓐᓂᖓᓂ angle ᐊᔪᕐᓇᖅᑐᖅ
       *[other] ᐊᖅᑯᑏᑦ { $count } ᐊᑯᓐᓂᖓᓂ angle ᐊᔪᕐᓇᖅᑐᖅ
    }

angle-invalid-through-point = `<angle>` through ᑕᒻᒪᖅᓯᒪᔪᖅ

parabola-vertex-too-many-points = ᓱᓕ ᐋᖅᑭᒃᑕᐅᓯᒪᙱᑦᑐᖅ: vertex ᐊᒻᒪ ᐊᑕᐅᓯᕐᒥᑦ ᐊᒥᓲᓂᖅᓴᑦ.

parabola-too-many-points = ᓱᓕ ᐋᖅᑭᒃᑕᐅᓯᒪᙱᑦᑐᖅ: ᐱᖓᓱᓂᑦ ᐊᒥᓲᓂᖅᓴᑦ.

intersection-too-many-items = ᓱᓕ ᐋᖅᑭᒃᑕᐅᓯᒪᙱᑦᑐᖅ: ᒪᕐᕉᓐᓂᑦ ᐊᒥᓲᓂᖅᓴᑦ

## Other math components

solve-equations-cannot-evaluate = ᐊᔪᕐᓇᖅᑐᖅ: { $equation }

math-operators-operand-number-required = operandNumber ᓇᓗᓇᐃᖅᑕᐅᔭᕆᐊᓕᒃ.

## `<graph>`

prefigure-annotations-not-rendered = `<graph>`: PreFigure ᐊᑐᙱᑉᐸᑦ `<annotations>` ᑕᑯᒃᓴᐅᔾᔮᙱᑦᑐᑦ.

multiple-annotations-children = `<graph>`-ᒥ `<annotations>` ᐊᒥᓱᑦ ᓇᓂᔭᐅᔪᑦ; ᑭᖑᓪᓕᖅᐹᖅ ᑭᓯᐊᓂ ᐊᑐᖅᑕᐅᔪᖅ.

## Referring to other components

copy-prop-not-found = { $component }-ᒥ { $property } ᓇᓂᔭᐅᙱᑦᑐᖅ

collect-no-source = collect-ᒧᑦ source ᓇᓂᔭᐅᙱᑦᑐᖅ.

collect-invalid-component-type = `<{ $component }>` collect-ᑕᐅᔪᓐᓇᙱᑦᑐᖅ, ᑕᒻᒪᖅᓯᒪᒻᒪᑦ.

## `<callAction>`

component-action-unavailable = `{ $reference }`-ᒥ { $action } ᐊᔪᕐᓇᖅᑐᖅ

## `<answer>` and scoring

answer-invalid-type = ᑭᐅᔾᔪᑎᐅᑉ type ᑕᒻᒪᖅᓯᒪᔪᖅ: { $type }

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] { $attributes } ᐊᑐᕐᓂᖃᙱᑦᑐᖅ symbolicEquality ᓇᓗᓇᐃᖅᑕᐅᙱᑉᐸᑦ.
        [two] { $attributes } ᐊᑐᕐᓂᖃᙱᑦᑑᒃ symbolicEquality ᓇᓗᓇᐃᖅᑕᐅᙱᑉᐸᑦ.
       *[other] { $attributes } ᐊᑐᕐᓂᖃᙱᑦᑐᑦ symbolicEquality ᓇᓗᓇᐃᖅᑕᐅᙱᑉᐸᑦ.
    }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` ᐊᑎᖃᙱᒻᒪᑦ `<module>`-ᒧᑦ ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ

conditional-content-condition-ignored = `<conditionalContent>` case ᐅᕝᕙᓘᓐᓃᑦ else ᐱᖃᖅᐸᑦ `condition` ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.

pretzel-problem-needs-statement-and-answer = `<problem>` ᐊᑕᐅᓯᕐᒥᒃ `<statement>`-ᖃᕆᐊᓕᒃ ᐊᑕᐅᓯᕐᒥᒡᓗ `<answer>`-ᖃᕆᐊᓕᒃ.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }`-ᒧᑦ { $values } ᑕᒻᒪᖅᓯᒪᔪᖅ; ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.
        [two] `{ $attribute }`-ᒧᑦ { $values } ᑕᒻᒪᖅᓯᒪᔫᒃ; ᐊᑐᖅᑕᐅᙱᑦᑑᒃ.
       *[other] `{ $attribute }`-ᒧᑦ { $values } ᑕᒻᒪᖅᓯᒪᔪᑦ; ᐊᑐᖅᑕᐅᙱᑦᑐᑦ.
    }

attribute-must-be-references = `{ $attribute }`-ᒧᑦ `{ $value }` ᑕᒻᒪᖅᓯᒪᔪᖅ. `$`-ᒥᒃ ᐱᒋᐊᖅᑐᖃᕆᐊᓕᒃ.

## Building components from the source

component-type-invalid = ᑕᒻᒪᖅᓯᒪᔪᖅ: `<{ $componentType }>`

attribute-repeated = { $attribute } ᖁᓕᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ.

attribute-invalid-for-component = `<{ $componentType }>`-ᒧᑦ "{ $attribute }" ᑕᒻᒪᖅᓯᒪᔪᖅ.

section-multiple-style-palettes = ᐃᓚᖓ <stylePalette>-ᒥᒃ ᐊᑕᐅᓯᕐᒥᒃ ᑭᓯᐊᓂ ᓂᕈᐊᕈᓐᓇᖅᑐᖅ; ᑭᖑᓪᓕᖅᐹᖅ ᐊᑐᖅᑕᐅᔪᖅ.

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: PreFigure-ᒥ ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ; ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.

prefigure-curve-label-omitted = { $subject }: label ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ; ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ᑕᒻᒪᖅᓯᒪᔪᖅ; ᓇᓂᔭᐅᔪᓐᓇᙱᑦᑐᖅ. ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.

annotation-ref-multiple-targets = `<annotation>`: `ref` ᐊᒥᓱᓄᑦ ᑐᕌᖅᑐᖅ; ᓯᕗᓪᓕᖅ ᐊᑐᖅᑕᐅᔪᖅ.

annotation-ref-outside-graph = `<annotation>`: `ref` `<graph>`-ᐅᑉ ᓯᓚᑖᓃᑦᑐᖅ. ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.

annotation-ref-unsupported-target = `<annotation>`: `ref` ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᒧᑦ ᑐᕌᖅᑐᖅ. ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.

annotation-text-missing = `<annotation>`: `text` ᐊᒥᒐᖅᑐᖅ.

## Composites and references

reference-no-referent = ᓇᓂᔭᐅᙱᑦᑐᖅ: `{ $reference }`

reference-multiple-referents = ᐊᒥᓱᑦ ᓇᓂᔭᐅᔪᑦ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>`-ᒧᑦ { $attribute } ᑕᒻᒪᖅᓯᒪᔪᖅ.

children-invalid = `<{ $componentType }>`-ᒧᑦ ᑕᒻᒪᖅᓯᒪᔪᑦ ᓇᓂᔭᐅᔪᑦ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }`-ᒧᑦ `{ $value }` ᑕᒻᒪᖅᓯᒪᔪᖅ, `{ $default }` ᐊᑐᖅᑕᐅᔪᖅ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } ᓇᓂᔭᐅᙱᑦᑐᖅ.
       *[other] DoenetML { $version } ᓇᓂᔭᐅᙱᑦᑐᖅ. { $fallback } ᐊᑐᖅᑕᐅᔪᖅ
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ᑕᒻᒪᖅᓯᒪᔪᖅ: { $content }

parse-tag-missing-close-tag = DoenetML ᑕᒻᒪᖅᓯᒪᔪᖅ: `{ $tag }` ᒪᑐᐃᖅᑕᐅᙱᑦᑐᖅ. `</{ $tagName }>` ᐱᔭᕆᐊᖃᖅᑐᖅ.

parse-tag-error = DoenetML ᑕᒻᒪᖅᓯᒪᔪᖅ: `<{ $tagName }>`-ᒥ ᑕᒻᒪᕐᓂᖅ

parse-attribute-missing-value = DoenetML ᑕᒻᒪᖅᓯᒪᔪᖅ: `{ $attribute }` ᐊᒥᒐᖅᑐᖅ.

parse-attribute-invalid = DoenetML ᑕᒻᒪᖅᓯᒪᔪᖅ: `{ $attribute }` ᑕᒻᒪᖅᓯᒪᔪᖅ

parse-attribute-value-invalid = DoenetML ᑕᒻᒪᖅᓯᒪᔪᖅ: `{ $value }` ᑕᒻᒪᖅᓯᒪᔪᖅ

parse-attribute-value-quote-mismatch = DoenetML ᑕᒻᒪᖅᓯᒪᔪᖅ: `{ $value }` ᑕᒻᒪᖅᓯᒪᔪᖅ. `{ $quote }` ᐊᒥᒐᖅᑐᖅ

parse-open-tag-name-missing = DoenetML ᑕᒻᒪᖅᓯᒪᔪᖅ: ᐊᑎᖃᙱᑦᑐᖅ ᓇᓂᔭᐅᔪᖅ, ᓲᕐᓗ `<`

parse-tag-not-closed = DoenetML ᑕᒻᒪᖅᓯᒪᔪᖅ: `{ $tag }` ᒪᑐᐃᖅᑕᐅᙱᑦᑐᖅ (`>` ᐊᒥᒐᖅᑐᖅ).

parse-self-closing-tag-name-missing = DoenetML ᑕᒻᒪᖅᓯᒪᔪᖅ: ᐊᑎᖃᙱᑦᑐᖅ ᓇᓂᔭᐅᔪᖅ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ᑕᒻᒪᖅᓯᒪᔪᖅ: `{ $tag }` ᒪᑐᐃᖅᑕᐅᙱᑦᑐᖅ (`/>` ᐊᒥᒐᖅᑐᖅ).

parse-tag-invalid-attributes = DoenetML ᑕᒻᒪᖅᓯᒪᔪᖅ: `{ $tag }` ᑕᒻᒪᖅᓯᒪᔪᖅ.

parse-close-tag-name-missing = DoenetML ᑕᒻᒪᖅᓯᒪᔪᖅ: ᐊᑎᖃᙱᑦᑐᖅ ᓇᓂᔭᐅᔪᖅ, ᓲᕐᓗ `</`

parse-close-tag-without-open-tag = DoenetML ᑕᒻᒪᖅᓯᒪᔪᖅ: `{ $tag }` ᓇᓂᔭᐅᔪᖅ, ᑭᓯᐊᓂ ᐅᒃᑯᐃᖅᓯᔪᖃᙱᑦᑐᖅ

parse-close-tag-mismatched = DoenetML ᑕᒻᒪᖅᓯᒪᔪᖅ: `</{ $expected }>` ᐱᔭᕆᐊᖃᖅᑐᖅ. `{ $found }` ᓇᓂᔭᐅᔪᖅ

## Names

name-attribute-invalid =
    name='{ $name }' ᑕᒻᒪᖅᓯᒪᔪᖅ. { $reason ->
        [characters] ᐊᑏᑦ ᑎᑎᕋᐅᓯᕐᓂᒃ, ᑭᓯᑦᓯᐅᑎᓂᒃ, underscore-ᓂᒃ ᐅᕝᕙᓘᓐᓃᑦ hyphen-ᓂᒃ ᑭᓯᐊᓂ ᐱᖃᕈᓐᓇᖅᑐᑦ.
       *[start] ᐊᑏᑦ ᑎᑎᕋᐅᓯᕐᒥᒃ ᐱᒋᐊᕆᐊᓖᑦ.
    }

component-name-invalid-start = ᐊᑎᖓ "{ $name }" ᑕᒻᒪᖅᓯᒪᔪᖅ. ᐊᑏᑦ ᑎᑎᕋᐅᓯᕐᒥᒃ ᐱᒋᐊᕆᐊᓖᑦ.

## `<answer>` sugar

answer-video-watched-missing-video = type videoWatched video-ᖃᕆᐊᓕᒃ

answer-name-not-single-text = name ᐊᑕᐅᓯᕐᒥᒃ ᑎᑎᕋᖅᓯᒪᔪᖃᕆᐊᓕᒃ

## Referencing another document

external-doenetml-unavailable = { $attribute }="{ $uri }" ᐱᔭᐅᔪᓐᓇᙱᑦᑐᖅ

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` ᐊᑐᕈᓐᓃᖅᑐᖅ; `{ $to }` ᐊᑐᕐᓗᒍ.
       *[other] [deprecation] `<{ $component }>`-ᒥ `{ $from }` ᐊᑐᕈᓐᓃᖅᑐᖅ; `{ $to }` ᐊᑐᕐᓗᒍ.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` ᐊᑐᕈᓐᓃᖅᑐᖅ ᐊᑐᖅᑕᐅᙱᑦᑐᕐᓗ, `{ $to }` ᐊᒻᒪᓗ ᓇᓗᓇᐃᖅᑕᐅᒻᒪᑦ.
       *[other] [deprecation] `<{ $component }>`-ᒥ `{ $from }` ᐊᑐᕈᓐᓃᖅᑐᖅ ᐊᑐᖅᑕᐅᙱᑦᑐᕐᓗ, `{ $to }` ᐊᒻᒪᓗ ᓇᓗᓇᐃᖅᑕᐅᒻᒪᑦ.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`-ᒥ `{ $attribute }` ᐊᑐᕈᓐᓃᖅᑐᖅ ᐊᑐᖅᑕᐅᙱᑦᑐᕐᓗ.

deprecated-attribute-to-child = [deprecation] `<{ $component }>`-ᒥ `{ $attribute }` ᐊᑐᕈᓐᓃᖅᑐᖅ; `<{ $child }>` ᐊᑐᕐᓗᒍ.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>`-ᒥ `{ $attribute }`-ᒧᑦ `{ $value }` ᐊᑐᕈᓐᓃᖅᑐᖅ; `{ $to }` ᐊᑐᕐᓗᒍ.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` Doenet-ᒧᑦ ᐃᓕᓴᕆᔭᐅᙱᑦᑐᖅ.

schema-element-not-allowed-at-root = `<{ $tag }>` ᑎᑎᖅᑲᐅᑉ ᐱᒋᐊᕐᕕᖓᓂ ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ.

schema-element-not-allowed-inside = `<{ $tag }>` `<{ $parent }>`-ᐅᑉ ᐃᓗᐊᓂ ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ.

schema-attribute-unrecognized = `<{ $tag }>` `{ $attribute }`-ᒥᒃ ᐱᖃᙱᑦᑐᖅ.


## The `<select>` family's error boxes

select-from-sequence-indices-not-integers = select-ᒧᑦ ᑕᒪᕐᒥᒃ ᑭᓯᑦᓯᐅᑎᐅᔭᕆᐊᓖᑦ

select-random-combination-fluke = ᐊᔪᕐᓇᖅᑐᖅ

select-random-value-fluke = ᐊᔪᕐᓇᖅᑐᖅ

## Further messages
##
## From here on the sentences lean on the loan convention the header sets
## out: the frame is Inuktitut and the technical noun that has no settled
## syllabic form stays in roman letters, as `matrix`, `interval`, `domain`,
## `variant`, `index` and `coprime` do below.

line-points-undetermined-dimensions = ᐊᖅᑯᑎᖏᑦ dimension-ᖏᑦ ᓇᓗᓇᖅᑐᑦ.

line-points-too-few-dimensions = ᐊᖅᑯᑎᖏᑦ ᒪᕐᕉᓐᓂᒃ dimension-ᖃᕆᐊᓖᑦ.

line-points-depend-on-variables = ᐊᖅᑯᑎᖏᑦ variable-ᓄᑦ ᑐᙵᕗᑦ: { $variables }.

line-equation-invalid-format = variable-ᐃᑦ { $variable1 } ᐊᒻᒪ { $variable2 } ᑕᒻᒪᖅᓯᒪᔪᑦ.

ray-dimension-mismatch = numDimensions ᓈᒻᒪᙱᑦᑐᖅ.

vector-dimension-mismatch = numDimensions ᓈᒻᒪᙱᑦᑐᖅ.

choice-input-indices-count-mismatch = choiceInput-ᒧᑦ index-ᖏᑦ ᐊᑐᖅᑕᐅᙱᑦᑐᑦ, ᐊᒥᓲᓂᖏᑦ ᓈᒻᒪᙱᒻᒪᑕ.

pretzel-indices-count-mismatch = problem-ᒧᑦ index-ᖏᑦ ᐊᑐᖅᑕᐅᙱᑦᑐᑦ, ᐊᒥᓲᓂᖏᑦ ᓈᒻᒪᙱᒻᒪᑕ.

shuffle-indices-count-mismatch = shuffle-ᒧᑦ index-ᖏᑦ ᐊᑐᖅᑕᐅᙱᑦᑐᑦ, ᐊᒥᓲᓂᖏᑦ ᓈᒻᒪᙱᒻᒪᑕ.

indices-ignored-out-of-range = { $component }-ᒧᑦ index-ᖏᑦ ᐊᑐᖅᑕᐅᙱᑦᑐᑦ, ᐃᓚᖏᑦ ᓯᓚᑖᓃᒻᒪᑕ.

pretzel-indices-repeated = pretzel-ᒧᑦ index-ᖏᑦ ᐊᑐᖅᑕᐅᙱᑦᑐᑦ, ᐃᓚᖏᑦ ᖁᓕᖅᑕᐅᒻᒪᑕ.

pretzel-circuit-first-index = pretzel-ᒧᑦ circuit-ᒥ index ᓯᕗᓪᓕᖅ 1-ᐅᔭᕆᐊᓕᒃ; ᐊᑐᖅᑕᐅᙱᑦᑐᑦ.

invalid-type-defaulting-to-math = { $component }-ᒧᑦ type { $type } ᑕᒻᒪᖅᓯᒪᔪᖅ. math, text, number ᐅᕝᕙᓘᓐᓃᑦ boolean-ᐅᔭᕆᐊᓕᒃ. math ᐊᑐᖅᑕᐅᔪᖅ.

invalid-type-defaulting-to-number = type { $type } ᑕᒻᒪᖅᓯᒪᔪᖅ, number ᐊᑐᖅᑕᐅᔪᖅ.

variant-index-must-be-number = variant-ᐅᑉ index-ᖓ { $index } ᑭᓯᑦᓯᐅᑎᐅᔭᕆᐊᓕᒃ

variant-index-must-be-integer = variant-ᐅᑉ index-ᖓ { $index } ᑭᓯᑦᓯᐅᑎᑦᓯᐊᕙᐅᔭᕆᐊᓕᒃ

side-by-side-absolute-widths = `<{ $component }>` ᓱᓕ ᐋᖅᑭᒃᑕᐅᓯᒪᙱᑦᑐᖅ; ᓯᓕᓐᓂᖏᑦ ᐊᔾᔨᒌᒃᑎᑕᐅᔪᑦ.

side-by-side-absolute-margins = `<{ $component }>` ᓱᓕ ᐋᖅᑭᒃᑕᐅᓯᒪᙱᑦᑐᖅ; ᓯᓈᖏᑦ ᐊᔾᔨᒌᒃᑎᑕᐅᔪᑦ.

label-for-answer-with-authored-inputs = `<label>` `for` `<answer>`-ᒧᑦ ᑐᕌᖅᑐᖅ, ᑭᓯᐊᓂ ᑖᓐᓇ ᑎᑎᕋᖅᑕᐅᕕᖃᖅᑐᖅ; ᑎᑎᕋᖅᑕᐅᕕᖓᓄᑦ ᑐᕌᕐᓗᑎᑦ.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ᐃᓚᖓᑕ ᓂᕈᐊᖓᓄᑦ ᓈᒻᒪᙱᑦᑐᖅ (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 ᐱᔭᕆᐊᖃᖅᑐᖅ).
       *[other] { $colorName } ᐃᓚᖓᑕ ᓂᕈᐊᖓᓄᑦ ᓈᒻᒪᙱᑦᑐᖅ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 ᐱᔭᕆᐊᖃᖅᑐᖅ).
    }

circle-through-points-non-numerical =
    { $count ->
        [one] ᓱᓕ ᐋᖅᑭᒃᑕᐅᓯᒪᙱᑦᑐᖅ: ᐊᖅᑯᑎ { $count } ᑭᓯᑦᓯᐅᑎᖃᙱᒻᒪᑦ.
        [two] ᓱᓕ ᐋᖅᑭᒃᑕᐅᓯᒪᙱᑦᑐᖅ: ᐊᖅᑯᑏᒃ { $count } ᑭᓯᑦᓯᐅᑎᖃᙱᒻᒪᑎᒃ.
       *[other] ᓱᓕ ᐋᖅᑭᒃᑕᐅᓯᒪᙱᑦᑐᖅ: ᐊᖅᑯᑏᑦ { $count } ᑭᓯᑦᓯᐅᑎᖃᙱᒻᒪᑕ.
    }

circle-center-with-multiple-points = center ᓇᓗᓇᐃᖅᑕᐅᒻᒪᑦ ᐊᑕᐅᓯᕐᒥᑦ ᐊᒥᓲᓂᖅᓴᑦ ᐊᔪᕐᓇᖅᑐᑦ.

circle-radius-too-small = ᐊᔪᕐᓇᖅᑐᖅ: ᐊᖅᑯᑏᒃ ᐅᖓᓯᓐᓂᖓ { $distance }, radius { $radius } ᒥᑭᓗᐊᖅᑐᖅ.

circle-radius-with-many-points = radius ᓇᓗᓇᐃᖅᑕᐅᒻᒪᑦ ᒪᕐᕉᓐᓂᑦ ᐊᒥᓲᓂᖅᓴᑦ ᐊᔪᕐᓇᖅᑐᑦ.

circle-radius-center-with-multiple-points = center ᓇᓗᓇᐃᖅᑕᐅᒻᒪᑦ ᐊᑕᐅᓯᕐᒥᑦ ᐊᒥᓲᓂᖅᓴᑦ ᐊᔪᕐᓇᖅᑐᑦ.

circle-change-radius-non-numerical = ᑭᓯᑦᓯᐅᑎᖃᙱᒻᒪᑕ radius ᐊᓯᔾᔨᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ

circle-radius-with-points-non-numerical = ᑭᓯᑦᓯᐅᑎᖃᙱᒻᒪᑕ ᐊᔪᕐᓇᖅᑐᖅ.

circle-change-center-non-numerical = ᓱᓕ ᐋᖅᑭᒃᑕᐅᓯᒪᙱᑦᑐᖅ: ᑭᓯᑦᓯᐅᑎᖃᙱᒻᒪᑕ center ᐊᓯᔾᔨᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ.

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] domain-ᒥ interval { $intervals }, ᑭᓯᐊᓂ input { $inputs }. ᓈᒻᒪᙱᑦᑐᖅ.
        [two] domain-ᒥ interval { $intervals }, ᑭᓯᐊᓂ input { $inputs }. ᓈᒻᒪᙱᑦᑐᖅ.
       *[other] domain-ᒥ interval { $intervals }, ᑭᓯᐊᓂ input { $inputs }. ᓈᒻᒪᙱᑦᑐᖅ.
    }

function-points-too-close = ᐊᖅᑯᑏᒃ ᖃᓂᓗᐊᖅᑑᒃ. ᐊᔪᕐᓇᖅᑐᖅ.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] input { $inputs } ᐊᒻᒪ output { $outputs } ᐊᔾᔨᒌᙱᒻᒪᑎᒃ ᐊᔪᕐᓇᖅᑐᖅ.
        [two] input { $inputs } ᐊᒻᒪ output { $outputs } ᐊᔾᔨᒌᙱᒻᒪᑎᒃ ᐊᔪᕐᓇᖅᑐᖅ.
       *[other] input { $inputs } ᐊᒻᒪ output { $outputs } ᐊᔾᔨᒌᙱᒻᒪᑎᒃ ᐊᔪᕐᓇᖅᑐᖅ.
    }

sequence-invalid-length = ᑕᑭᓂᖓ ᑕᒻᒪᖅᓯᒪᔪᖅ. ᑭᓯᑦᓯᐅᑎᑦᓯᐊᕙᐅᔭᕆᐊᓕᒃ.

sequence-invalid-step = step ᑕᒻᒪᖅᓯᒪᔪᖅ. type { $type }-ᒧᑦ ᑭᓯᑦᓯᐅᑎᐅᔭᕆᐊᓕᒃ.

sequence-invalid-endpoint-letters = "{ $attribute }" ᑕᒻᒪᖅᓯᒪᔪᖅ. ᑎᑎᕋᐅᓯᕐᓂᒃ ᐱᖃᕆᐊᓕᒃ.

select-from-sequence-coprime-not-numbers = coprime ᐊᑐᖅᑕᐅᙱᑦᑐᖅ, ᑭᓯᑦᓯᐅᑏᑦ ᓂᕈᐊᖅᑕᐅᙱᒻᒪᑕ

select-from-sequence-coprime-with-exclude-combinations = coprime ᐊᑐᖅᑕᐅᙱᑦᑐᖅ, excludeCombinations ᓇᓗᓇᐃᖅᑕᐅᒻᒪᑦ

ode-system-variables-match-independent = `<odeSystem>` variable-ᖏᑦ independent variable-ᒥᒃ ᐊᔾᔨᒌᙱᑦᑐᒃᓴᐅᔪᑦ.

ode-system-duplicate-variable-names = variable-ᐃᑦ ᐊᑏᑦ ᖁᓕᖅᑕᐅᔪᑦ. ᐊᔪᕐᓇᖅᑐᖅ.

ode-system-rhs-function-error = ᐊᔪᕐᓇᖅᑐᖅ. mathjs ᑕᒻᒪᖅᓯᒪᔪᖅ.

ionic-compound-not-two-ions = ᓱᓕ ᐋᖅᑭᒃᑕᐅᓯᒪᙱᑦᑐᖅ: ion ᒪᕐᕉᒃ ᑭᓯᐊᓂ.

ionic-compound-needs-cation-and-anion = cation ᐊᑕᐅᓯᖅ ᐊᒻᒪ anion ᐊᑕᐅᓯᖅ ᑭᓯᐊᓂ.

eigen-decomposition-failed = matrix-ᐅᑉ eigenvalue-ᖏᑦ ᐊᔪᕐᓇᖅᑐᑦ

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } pattern-ᒥ ᐱᖃᙱᑦᑐᖅ.
        [two] `<matchesPattern>`: parameter { $parameters } pattern-ᒥ ᐱᖃᙱᑦᑑᒃ.
       *[other] `<matchesPattern>`: parameter { $parameters } pattern-ᒥ ᐱᖃᙱᑦᑐᑦ.
    }

graph-grid-invalid = `<graph>`: grid="{ $grid }" ᑐᑭᓯᔭᐅᔪᓐᓇᙱᑦᑐᖅ. none, medium, dense ᐅᕝᕙᓘᓐᓃᑦ ᑭᓯᑦᓯᐅᑏᒃ ᒪᕐᕉᒃ, ᓲᕐᓗ grid="1 0.5". grid ᑎᑎᖅᑐᖅᑕᐅᙱᑦᑐᖅ.

field-function-attribute-ignored-with-child = `function` ᐊᑐᖅᑕᐅᙱᑦᑐᖅ, ᐃᓗᐊᓃᑦᑐᖅ ᐊᑐᖅᑕᐅᒻᒪᑦ. ᐊᑕᐅᓯᐊᕐᓗᒍ ᑎᑎᕋᕐᓗᒍ.

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" PreFigure-ᒥ ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" PreFigure-ᒥ ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ.

prefigure-invalid-axis-bounds = `<graph>`: PreFigure-ᒧᑦ ᑕᒻᒪᖅᓯᒪᔪᖅ; (-10,-10,10,10) ᐊᑐᖅᑕᐅᔪᖅ.

prefigure-invalid-width = `<graph>`: ᓯᓕᓐᓂᖓ ᑕᒻᒪᖅᓯᒪᔪᖅ; 425 ᐊᑐᖅᑕᐅᔪᖅ.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ᑕᒻᒪᖅᓯᒪᔪᖅ; 1 ᐊᑐᖅᑕᐅᔪᖅ.

prefigure-grid-spacing-too-fine = `<graph>`: grid ᐊᑯᓐᓂᖏᑦ ᒥᑭᓗᐊᖅᑐᑦ; grid ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.

prefigure-descendant-invalid-geometry = { $subject }: ᑕᒻᒪᖅᓯᒪᔪᖅ; ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.

prefigure-curve-unsupported-definition-type = { $subject }: '{ $definitionType }' ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ; ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ; ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.

prefigure-region-non-formula-child = { $subject }: formula-ᖃᖅᑐᑦ ᑭᓯᐊᓂ ᐊᑐᖅᑕᐅᔪᓐᓇᖅᑐᑦ; ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' PreFigure-ᒥ ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ.

prefigure-line-style-unknown = { $subject }: '{ $lineStyle }' ᐃᓕᓴᕆᔭᐅᙱᑦᑐᖅ; ᐊᑐᖅᑕᐅᙱᑦᑐᖅ.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' PreFigure-ᒥ 'diamond'-ᒧᑦ ᐊᓯᔾᔨᖅᑕᐅᔪᖅ.

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' PreFigure-ᒥ ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ.

copy-unrecognized-component-type = ᐃᓕᓴᕆᔭᐅᙱᑦᑐᖅ: { $type }.

reference-index-unavailable = index `{ $reference }` ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ

data-frame-inconsistent-row-lengths = ᑕᒻᒪᖅᓯᒪᔪᖅ. ᑕᑭᓂᖏᑦ ᐊᔾᔨᒌᙱᑦᑐᑦ. componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = ᐊᑏᑦ ᖁᓕᖅᑕᐅᔪᑦ. componentIdx :{ $componentIdx }

data-frame-missing-column-name = ᐊᑎᖃᙱᑦᑐᖅ. componentIdx :{ $componentIdx }

answer-award-depends-on-own-response = ᑖᓐᓇ award ᑭᐅᔾᔪᑎᒥᓄᑦ ᑐᙵᕗᖅ, ᑕᒻᒪᖅᓯᒪᔪᒃᓴᐅᔪᖅ.

answer-max-num-attempts-in-section-wide-check-work = sectionWideCheckWork-ᒥ `maxNumAttempts` ᐊᑐᕐᓂᖃᙱᑦᑐᖅ. ᓯᓚᑖᓄᑦ ᑎᑎᕋᕐᓗᒍ.

nested-section-wide-check-work-max-num-attempts = sectionWideCheckWork ᐃᓗᐊᓂ `maxNumAttempts` ᐊᑐᕐᓂᖃᙱᑦᑐᖅ. ᓯᓚᑖᓄᑦ ᑎᑎᕋᕐᓗᒍ.

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ, `<module>` "{ $name }"-ᒥᒃ ᐱᖃᕋᒥ.

slider-markers-type-mismatch = marker-ᐃᑦ type-ᖓ slider-ᐅᑉ type-ᖓᓄᑦ ᓈᒻᒪᙱᑦᑐᖅ.

pretzel-circuit-first-problem-distractor = mode="circuit"-ᒥ `<problem>` ᓯᕗᓪᓕᖅ distractor-ᐅᔪᓐᓇᙱᑦᑐᖅ.

variant-num-to-select-not-non-negative-integer = { $component }-ᒧᑦ ᐊᔪᕐᓇᖅᑐᖅ, numToSelect ᑭᓯᑦᓯᐅᑎᑦᓯᐊᕙᐅᙱᒻᒪᑦ.

variant-num-to-select-not-constant-number = { $component }-ᒧᑦ ᐊᔪᕐᓇᖅᑐᖅ, numToSelect ᐊᓯᔾᔨᖅᐸᒻᒪᑦ.

variant-with-replacement-not-constant-boolean = { $component }-ᒧᑦ ᐊᔪᕐᓇᖅᑐᖅ, withReplacement ᐊᓯᔾᔨᖅᐸᒻᒪᑦ.

variant-select-weight-disables-unique = selectWeight ᐅᕝᕙᓘᓐᓃᑦ selectForVariants ᐱᖃᖅᐸᑦ ᐊᔪᕐᓇᖅᑐᖅ

variant-coprime-undetermined = { $component }-ᒧᑦ ᐊᔪᕐᓇᖅᑐᖅ, coprime ᓇᓗᓇᖅᑐᖅ.

variant-attribute-not-constant = { $component }-ᒧᑦ ᐊᔪᕐᓇᖅᑐᖅ, { $attribute } ᐊᓯᔾᔨᖅᐸᒻᒪᑦ.

variant-attribute-not-number = { $component }-ᒧᑦ ᐊᔪᕐᓇᖅᑐᖅ, { $attribute } ᑭᓯᑦᓯᐅᑎᐅᙱᒻᒪᑦ.

variant-attribute-wrong-type-for-sequence =
    { $component } { $type }-ᒧᑦ ᐊᔪᕐᓇᖅᑐᖅ, { $attribute } { $expected ->
        [letters-combination] ᑎᑎᕋᐅᓯᕐᓂᒃ
        [math-expression] ᓈᓴᐅᓯᕆᓂᕐᒥᒃ
        [integer] ᑭᓯᑦᓯᐅᑎᑦᓯᐊᕙᖕᒥᒃ
       *[number] ᑭᓯᑦᓯᐅᑎᒥᒃ
    } ᐱᖃᙱᒻᒪᑦ.

variant-length-not-integer = { $component }-ᒧᑦ ᐊᔪᕐᓇᖅᑐᖅ, length ᑭᓯᑦᓯᐅᑎᑦᓯᐊᕙᐅᙱᒻᒪᑦ.

variant-sort-not-implemented = { $component } sort-ᖃᖅᑐᖅ ᓱᓕ ᐋᖅᑭᒃᑕᐅᓯᒪᙱᑦᑐᖅ

variant-exclude-combinations-not-implemented = { $component } excludeCombinations-ᖃᖅᑐᖅ ᓱᓕ ᐋᖅᑭᒃᑕᐅᓯᒪᙱᑦᑐᖅ

variant-math-exclude-not-implemented = { $component } math-ᒥᒃ exclude-ᖃᖅᑐᖅ ᓱᓕ ᐋᖅᑭᒃᑕᐅᓯᒪᙱᑦᑐᖅ

variant-non-constant-exclude-not-implemented = { $component } exclude ᐊᓯᔾᔨᖅᐸᒃᑐᖅ ᓱᓕ ᐋᖅᑭᒃᑕᐅᓯᒪᙱᑦᑐᖅ

composite-circular-dependency =
    { $componentType ->
        [none] ᐊᒻᒪᓗᒃᑑᔪᖅ ᓇᓂᔭᐅᔪᖅ.
       *[other] `<{ $componentType }>`-ᒥ ᐊᒻᒪᓗᒃᑑᔪᖅ ᓇᓂᔭᐅᔪᖅ.
    }

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>`-ᒥ `{ $attribute }` ᐅᑯᓇᙵᑦ ᐱᖃᕆᐊᓕᒃ: { $allowed }
       *[other] `<{ $tag }>`-ᒥ `{ $attribute }` ᐅᑯᓇᙵᑦ ᐊᑕᐅᓯᖅ: { $allowed }
    }

external-doenetml-recursion-limit = ᐊᔪᕐᓇᖅᑐᖅ, ᐅᑎᖅᑕᖅᑐᖅ. ᐊᒻᒪᓗᒃᑑᔪᖃᖅᐸ?

external-doenetml-type-mismatch = { $attribute }="{ $uri }" "{ $componentType }"-ᒧᑦ ᓈᒻᒪᙱᑦᑐᖅ

pluralize-english-only = `<pluralize>` ᖃᓪᓗᓈᑎᑐᑦ ᑭᓯᐊᓂ ᐊᑐᖅᑕᐅᔪᓐᓇᖅᑐᖅ, ᑕᐃᒫᒃ { $locale }-ᒥ ᐊᓯᔾᔨᖅᑕᐅᙱᑦᑐᖅ. `pluralForm` ᐊᑐᕐᓗᒍ.

answer-video-watched-video-not-reference = type videoWatched video-ᖓ ᑐᕌᕈᑕᐅᔭᕆᐊᓕᒃ

parser-node-unconvertible = { $node } ᐊᓯᔾᔨᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ.

parse-attribute-value-unquoted = ᐅᔾᔨᖅᓱᖅᑐᓕᒫᖅ: `{ $attribute }="{ $value }"`

select-variant-name-option-count-mismatch = variant { $variantName } option { $numOptions }-ᓂ ᓇᓂᔭᐅᔪᖅ, ᓂᕈᐊᒐᒃᓴᐃᑦ { $numToSelect }. ᓈᒻᒪᙱᑦᑐᖅ.

select-variant-name-without-options = variant { $variantName }-ᒧᑦ option-ᖃᙱᑦᑐᖅ.

select-variant-name-not-possible = variant { $variantName } ᐊᑐᖅᑕᐅᔪᓐᓇᙱᑦᑐᖅ.

select-too-few-options = { $numOptions }-ᓂᑦ { $numToSelect } ᓂᕈᐊᖅᑕᐅᔪᓐᓇᙱᑦᑐᑦ.

select-from-sequence-too-few-values = ᑕᑭᓂᖓ { $length }-ᒥᑦ { $numToSelect } ᓂᕈᐊᖅᑕᐅᔪᓐᓇᙱᑦᑐᑦ.

select-from-sequence-indices-count-mismatch = index-ᐃᑦ ᐊᒥᓲᓂᖏᑦ ᓂᕈᐊᒐᒃᓴᐃᑦ ᐊᒥᓲᓂᖏᓐᓄᑦ ᓈᒻᒪᒋᐊᓖᑦ

select-from-sequence-index-excluded = index ᐊᓯᐅᔨᔭᐅᓯᒪᔪᖅ

select-from-sequence-indices-excluded-combination = index-ᐃᑦ ᐊᓯᐅᔨᔭᐅᓯᒪᔪᑦ

select-from-sequence-coprime-not-positive-integers = coprime ᐊᔪᕐᓇᖅᑐᖅ, ᑭᓯᑦᓯᐅᑏᑦ ᓈᒻᒪᙱᒻᒪᑕ.

select-from-sequence-coprime-single-number = coprime ᐊᑕᐅᓯᕐᒥᑦ ᐊᔪᕐᓇᖅᑐᖅ.

select-from-sequence-excluded-too-many-combinations = selectFromSequence-ᒥ 70%-ᖏᑦ ᐅᖓᑖᓄᑦ ᐊᓯᐅᔨᔭᐅᓯᒪᔪᑦ

select-from-sequence-too-few-unique-values = ᑕᑭᓂᖓ { $numPossibleValues }-ᒥᑦ { $numToSelect } ᐊᔪᕐᓇᖅᑐᑦ

select-prime-numbers-too-few-values = { $numValues }-ᒥᑦ { $numToSelect } ᐊᔪᕐᓇᖅᑐᑦ

select-prime-numbers-values-count-mismatch = ᐊᒥᓲᓂᖏᑦ ᓂᕈᐊᒐᒃᓴᐃᑦ ᐊᒥᓲᓂᖏᓐᓄᑦ ᓈᒻᒪᒋᐊᓖᑦ

select-prime-numbers-values-excluded-combination = selectPrimeNumbers ᐊᓯᐅᔨᔭᐅᓯᒪᔪᖅ

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-ᒥ 70%-ᖏᑦ ᐅᖓᑖᓄᑦ ᐊᓯᐅᔨᔭᐅᓯᒪᔪᑦ

math-embedded-input-shape-unsuitable =
    `<{ $component }>` ᓈᓴᐅᓯᕆᓂᐅᑉ ᐃᓗᐊᓂ ᑎᑎᖅᑐᖅᑕᐅᙱᑦᑐᖅ. { $reason ->
        [not-inline] `inline` ᑭᓯᐊᓂ ᐃᓗᐊᓄᑦ ᓈᒻᒪᒃᑐᖅ.
        [expanded] `expanded` ᐊᖏᔪᐊᓘᒻᒪᑦ ᐃᓗᐊᓄᑦ ᓈᒻᒪᙱᑦᑐᖅ.
        [on-graph] `<graph>`-ᒥ ᐊᔾᔨᖑᐊᑐᐊᖑᒻᒪᑦ ᐃᓂᖃᙱᑦᑐᖅ.
       *[relative-width] `width` ᐊᔾᔨᒌᙱᒻᒪᑦ; `px`-ᒥᒃ ᑎᑎᕋᕐᓗᒍ.
    }
