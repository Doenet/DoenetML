# Bini diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# See `content.ftl`'s header for the family classification (Edoid,
# Niger-Congo, Volta-Niger), the no-agreement finding, and the loanword
# strategy for technical vocabulary that this batch has no settled Bini
# coinage for.
#
# Intl.PluralRules('bin') gives `one` and `other`, unlike Yoruba's single
# category, so a countable message here keeps both branches — see
# `line-segment-attributes-ignored-with-endpoints` and
# `matches-pattern-parameter-not-in-pattern` below, which fork on
# `$attributesCount`/`$parametersCount` where Yoruba's counterpart collapsed
# to one line.

## `<lineSegment>`

# $attributes is a list of attribute names; $attributesCount is its length.
line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] A i ru { $attributes } vbe ẹghẹ ne akoto ẹfẹ eva rre
       *[other] A i ru { $attributes } vbe ẹghẹ ne akoto ẹfẹ eva rre
    }

# $attributes is a list of attribute names; $attributesCount is its length.
line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] A i ru { $attributes } vbe ẹghẹ ne akoto ẹfẹ kevbe akoto etẹẹ rre
       *[other] A i ru { $attributes } vbe ẹghẹ ne akoto ẹfẹ kevbe akoto etẹẹ rre
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset i vbe emwin sẹ vbe akoto etẹẹ i rre

## `<line>`

line-points-undetermined-dimensions = Ẹfẹ nọ gbayie vbe akoto nọ i rẹnrẹn oghẹ nian.

line-points-too-few-dimensions = Ẹfẹ khẹke ne ọ gha gbayie vbe akoto nọ ni oghẹ eva ye odukhunmwu.

# $variables is a bare enumeration of variable names, not an "and" list.
line-points-depend-on-variables = Ẹfẹ nọ gbayie vbe akoto ni gbaroko vbe emwin nọ ru: { $variables }.

line-equation-invalid-format = Odẹ nọ i maan ne ẹkuẹsan ti ẹfẹ vbe emwin { $variable1 } kevbe { $variable2 }.

## `<ray>`

ray-overprescribed-through = A ye ọfa ye through, endpoint kevbe direction hia. A i ru through nọ ru ẹre.

ray-dimension-mismatch = numDimensions i danmwẹhọ vbe ọfa.

## `<vector>`

vector-overprescribed-head = A ye fẹkto ye head, tail kevbe displacement hia. A i ru head nọ ru ẹre.

vector-dimension-mismatch = numDimensions i danmwẹhọ vbe fẹkto.

## Attracting and constraining

attract-to-without-nearest-point = A i sẹtin gie ọre gele `<{ $component }>` rhunmwuda ọ i vbe nearestPoint.

constrain-to-without-nearest-point = A i sẹtin ye `<{ $component }>` gele rhunmwuda ọ i vbe nearestPoint.

constrain-to-interior-without-nearest-point = A i sẹtin ye evbare `<{ $component }>` gele rhunmwuda ọ i vbe nearestPoint.

## `<choiceInput>`

# Translators: `labelPosition` is an attribute name and stays in English.
choice-input-label-position-ignored = A i ru labelPosition vbe choiceInput nọ i rre vbe ẹfẹ ọkpa

## Ordering children by index

choice-input-indices-count-mismatch = A i ru akoto ni ru choiceInput rhunmwuda kuan wọn i danmwẹhọ vbe kuan ọmọ choice.

pretzel-indices-count-mismatch = A i ru akoto ni ru problem rhunmwuda kuan wọn i danmwẹhọ vbe kuan ọmọ problem.

shuffle-indices-count-mismatch = A i ru akoto ni ru shuffle rhunmwuda kuan wọn i danmwẹhọ vbe kuan owa.

# $component is `choiceInput`, `pretzel` or `shuffle` — a DoenetML component
# name, so it stays in English.
indices-ignored-out-of-range = A i ru akoto ni ru { $component } rhunmwuda eso rre ke odaro.

pretzel-indices-repeated = A i ru akoto ni ru pretzel rhunmwuda eso ru vbe ọni.

pretzel-circuit-first-index = A i ru akoto ni ru pretzel vbe circuit rhunmwuda akoto nọkiekie khẹke ne ọ rrọọ 1.

## `<shuffle>` and `<sort>`

# $component is `shuffle` or `sort`.
string-children-need-type = Ne `<{ $component }>` gha sẹtin ru vbe ọmọ string, ànímọ́ `type` khẹke ne a ye.

# $type is what the author wrote; math, text, number and boolean are attribute
# values and stay in English.
invalid-type-defaulting-to-math = type { $type } i maan ne { $component }. Ọ khẹke ne ọ rrọọ ọkpa vbe math, text, number, yana boolean. A gha ye math.

# $value is the string child that could not be used.
string-not-valid-component-to-arrange = String "{ $value }" i maan ne { $component }. A i ru ẹre.

## Types and variables

invalid-type-defaulting-to-number = type { $type } i maan, a gha ye type ye number.

invalid-variable-value = Ẹkuẹsan nọ i maan ne emwin nọ ru: `{ $value }`

## Variants

# $index is what the author wrote, reproduced verbatim rather than as a number.
variant-index-must-be-number = Kuan ti irẹnkẹn { $index } khẹke ne ọ rrọọ kuan

variant-index-must-be-integer = Kuan ti irẹnkẹn { $index } khẹke ne ọ rrọọ kuan gbaroko

## `<sideBySide>`

# $component is `sideBySide` or `sbsGroup`.
side-by-side-absolute-widths = A i ke ru `<{ $component }>` ne oghẹ nọ gbaroko. A gha ye ẹkiọ ye ọre nọ danmwẹhọ.

side-by-side-absolute-margins = A i ke ru `<{ $component }>` ne oghẹ nọ gbaroko. A gha ye orhue ye ọre nọ danmwẹhọ.

side-by-side-no-block-child = `<{ $component }>` i maan: ọ khẹke ne ọ ni ọmọ ọkpa ye odukhunmwu nọ rrọọ blọki.

## `<label>`

# Translators: `for` is an attribute name and stays in English.
label-for-ignored-on-graphical = A i ru ànímọ́ `for` vbe `<label>` owanrẹn.

label-for-must-resolve-to-one = Ànímọ́ `for` vbe `<label>` khẹke ne ọ ye owa ọkpa.

label-for-unresolved = A i sẹtin ye ànímọ́ `for` vbe `<label>` ye owa nọ hia.

label-for-answer-with-authored-inputs = Ànímọ́ `for` vbe `<label>` ye `<answer>` nọ ni ighiẹnrhan nọ rrọọ egbe rẹn; ye ighiẹnrhan ẹre nan.

label-for-answer-without-input = Ànímọ́ `for` vbe `<label>` ye `<answer>` nọ i vbe ighiẹnrhan nọ ọ khian uni.

label-for-must-reference-input-or-answer = Ànímọ́ `for` vbe `<label>` khẹke ne ọ ye ighiẹnrhan yana ọre.

## Accessibility

# $component is a DoenetML tag, e.g. "graph" or "image".
accessibility-short-description-or-decorative = Rhunmwuda oghẹ nọ khẹke sẹ, `<{ $component }>` khẹke ne ọ ni ẹmwẹ okpiẹ yana ne a kha ọ rrọọ ọya ọdanmwẹ.

accessibility-video-short-description = Rhunmwuda oghẹ nọ khẹke sẹ, `<video>` khẹke ne ọ ni ẹmwẹ okpiẹ.

accessibility-input-short-description-or-label = Rhunmwuda oghẹ nọ khẹke sẹ, `<{ $component }>` khẹke ne ọ ni ẹmwẹ okpiẹ yana uni.

accessibility-answer-input-short-description-or-label = Rhunmwuda oghẹ nọ khẹke sẹ, `<answer>` nọ ru ighiẹnrhan khẹke ne ọ ni ẹmwẹ okpiẹ yana uni.

accessibility-short-description-contains-math = Ẹmwẹ okpiẹ i khẹke ne ọ ni ọsẹ math bii `<{ $component }>` evbare. Kha math nọkhuo vbe ẹmwẹ.

# $colorName is an attribute name and stays in English. $ratio and $threshold
# are contrast ratios; $mode says which theme the shortfall was measured in.
accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } i vbe ọya nọ khẹke ne ẹmwẹ owa (ẹghẹ dudu) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ọ khẹke ne ọ rrọọ { $threshold }:1 ye odukhunmwu).
       *[other] { $colorName } i vbe ọya nọ khẹke ne ẹmwẹ owa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ọ khẹke ne ọ rrọọ { $threshold }:1 ye odukhunmwu).
    }

## `<circle>`

# $count is the number of through points.
circle-through-points-non-numerical = A i ke ru `<circle>` nọ gbayie vbe akoto { $count } vbe ẹghẹ ne akoto na i vbe kuan.

circle-too-many-through-points = A i sẹtin ru obiribiti nọ gbayie vbe akoto nọ hin 3.

circle-overprescribed-radius-center-points = A i sẹtin ru obiribiti nọ ni rediọsi, etẹẹ kevbe akoto ẹgbaroko nọ ye hia.

circle-center-with-multiple-points = A i sẹtin ru obiribiti nọ ni etẹẹ nọ gbayie vbe akoto nọ hin 1.

# $distance and $radius arrive as strings, not numbers.
circle-radius-too-small = A i sẹtin ru obiribiti: rhunmwuda ẹkiọ ye akoto eva na rrọọ { $distance }, rediọsi { $radius } nọ ye i khẹke.

circle-radius-with-many-points = A i sẹtin ru obiribiti nọ gbayie vbe akoto nọ hin eva ye rediọsi nọ ye.

circle-invalid-center-or-through-points = Etẹẹ yana akoto ẹgbaroko ti obiribiti i maan.

circle-radius-center-with-multiple-points = A i sẹtin ru rediọsi obiribiti nọ ni etẹẹ nọ gbayie vbe akoto nọ hin 1.

circle-change-radius-non-numerical = A i sẹtin gele rediọsi obiribiti nọ gbayie vbe akoto ni i vbe kuan

circle-radius-with-points-non-numerical = A i sẹtin ru obiribiti nọ gbayie vbe akoto nọ hin ọkpa ye rediọsi nọ ye vbe ẹghẹ ne kuan i rre.

circle-change-center-non-numerical = A i ke gele etẹẹ ti obiribiti nọ gbayie vbe akoto ni i vbe kuan.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Oghẹ i khẹke sẹ ne domain ti ọsẹ. Domain ni ẹvba { $intervals } sokẹ ọsẹ ni ighiẹnrhan { $inputs ->
            [one] { $inputs } ighiẹnrhan
           *[other] { $inputs } ighiẹnrhan
        }.
       *[other] Oghẹ i khẹke sẹ ne domain ti ọsẹ. Domain ni ẹvba { $intervals } sokẹ ọsẹ ni ighiẹnrhan { $inputs ->
            [one] { $inputs } ighiẹnrhan
           *[other] { $inputs } ighiẹnrhan
        }.
    }

function-domain-invalid-format = Odẹ domain ti ọsẹ i maan.

# $type is which reading off the point was ignored; it selects the wording.
function-ignoring-non-numerical =
    { $type ->
        [maximum] A i ru kuan nọ hin hia ti ọsẹ nọ i vbe kuan.
        [minimum] A i ru kuan nọ kpọkpọ hia ti ọsẹ nọ i vbe kuan.
        [extremum] A i ru kuan nọ hin ọtẹrẹn ti ọsẹ nọ i vbe kuan.
        [point] A i ru akoto ti ọsẹ nọ i vbe kuan.
        [slope] A i ru gbayie ti ọsẹ nọ i vbe kuan.
       *[other] A i ru { $type } ti ọsẹ nọ i vbe kuan.
    }

function-ignoring-empty =
    { $type ->
        [maximum] A i ru kuan nọ hin hia ti ọsẹ nọ i vbe emwin.
        [minimum] A i ru kuan nọ kpọkpọ hia ti ọsẹ nọ i vbe emwin.
        [extremum] A i ru kuan nọ hin ọtẹrẹn ti ọsẹ nọ i vbe emwin.
        [point] A i ru akoto ti ọsẹ nọ i vbe emwin.
       *[other] A i ru { $type } ti ọsẹ nọ i vbe emwin.
    }

function-points-too-close = Ọsẹ ni akoto eva ni sẹ ọdiọn keke. A i sẹtin ye ọsẹ nan.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Ọsẹ nọ gha ghi ye emwin rre ọkpa deghẹ kuan ighiẹnrhan danmwẹhọ vbe kuan output. Ọsẹ nan ni ighiẹnrhan { $inputs } kevbe output { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } output
        }.
       *[other] Ọsẹ nọ gha ghi ye emwin rre ọkpa deghẹ kuan ighiẹnrhan danmwẹhọ vbe kuan output. Ọsẹ nan ni ighiẹnrhan { $inputs } kevbe output { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } output
        }.
    }

## `<sequence>`

sequence-invalid-length = Oghẹ ti sequence i maan. Ọ khẹke ne ọ rrọọ kuan gbaroko nọ i kpọkpọ sẹ noughts.

# $type is a sequence type: number, letters, or math.
sequence-invalid-step = Ẹkiọ ti sequence i maan. Ọ khẹke ne ọ rrọọ kuan ne sequence irẹnkẹn { $type }.

# $attribute is `from` or `to` — an attribute name, so it stays in English.
sequence-invalid-endpoint-number = "{ $attribute }" ti sequence kuan i maan. Ọ khẹke ne ọ rrọọ kuan.

sequence-invalid-endpoint-letters = "{ $attribute }" ti sequence akhirikhiri i maan. Ọ khẹke ne ọ rrọọ akoto akhirikhiri.

sequence-invalid-endpoint = "{ $attribute }" ti sequence i maan.

select-from-sequence-coprime-not-numbers = A i ru coprime rhunmwuda kuan i rre gha ru

select-from-sequence-coprime-with-exclude-combinations = A i ru coprime rhunmwuda excludeCombinations ye

## Resolving a `target`

target-not-found = target i maan ne `<{ $source }>`: A i miẹn emwin nọ hia.

# $property is the state variable that was looked for; $component is the tag
# it was looked for on.
target-state-variable-not-found = target i maan ne `<{ $source }>`: A i miẹn emwin nọ rrọọ "{ $property }" vbe `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Emwin ni ru `<odeSystem>` khẹke ne ọ hoẹmwẹ ye emwin nọ ọre nọkiekie.

ode-system-duplicate-variable-names = A i sẹtin ye ọsẹ ODE RHS nọ ni uni emwin nọ hoẹmwẹ nọ ru vbe ọni.

ode-system-rhs-function-error = A i sẹtin ye ọsẹ ODE RHS. Efian rre vbe ẹghẹ na gha ru ọsẹ mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

# $count is how many line children were found.
angle-too-many-lines = A i sẹtin ye ekpogho vbe efe { $count }

angle-invalid-through-point = Akoto i maan vbe through ti `<angle>`

parabola-vertex-too-many-points = A i ke ru parabola nọ ni odukhunmwu nọ gbayie vbe akoto nọ hin 1.

parabola-too-many-points = A i ke ru parabola nọ gbayie vbe akoto nọ hin 3.

intersection-too-many-items = A i ke ru intersection ne emwin nọ hin eva

## Other math components

ionic-compound-not-two-ions = A i ke ru emwin ayọni ne emwin ọvbehe vbe ayọni eva.

ionic-compound-needs-cation-and-anion = A ru emwin ayọni ne cation ọkpa kevbe anion ọkpa gbọ.

# $equation is the equation as the author wrote it.
solve-equations-cannot-evaluate = A i sẹtin gbaroko ẹkuẹsan rhunmwuda A i sẹtin miẹn ẹre: { $equation }

# Translators: `operandNumber` is an attribute name and stays in English.
math-operators-operand-number-required = A khẹke ne a ye operandNumber vbe ẹghẹ ne a gha rhie operand math.

eigen-decomposition-failed = A i sẹtin gbaroko eigenvalue ti matrix

## `<matchesPattern>`

# $parameters lists the parameters as the author wrote them; $parametersCount
# is how many there were.
matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } i rre vbe uhunmwu nan, sokẹ ọ gha danmwẹhọ ye emwin ọfuọn ẹghẹ hia.
       *[other] `<matchesPattern>`: parameter { $parameters } i rre vbe uhunmwu nan, sokẹ iran gha danmwẹhọ ye emwin ọfuọn ẹghẹ hia.
    }

## `<graph>`

# Translators: grid is an attribute name; none, medium and dense are its
# values; all four stay in English.
graph-grid-invalid = `<graph>`: A i sẹtin miẹn grid="{ $grid }". Ọ khẹke ne ọ rrọọ none, medium, dense, yana kuan eva nọ ọfuọn ye ẹkiọ danmwẹhọ, bii grid="1 0.5". A i wa grid ọkpa.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: A i ru xLabelPosition="left" vbe prefigure; a gha ru oghẹ ọwagbe.

prefigure-y-label-position-unsupported = `<graph>`: A i ru yLabelPosition="bottom" vbe prefigure; a gha ru oghẹ odukhunmwu.

prefigure-invalid-axis-bounds = `<graph>`: ẹkiọ axis i maan ne ẹghẹ prefigure; a gha ru bbox nọkiekie (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ẹkiọ i maan ne ẹghẹ prefigure; a gha ru ẹkiọ owanrẹn nọkiekie 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio i maan ne ẹghẹ prefigure; a gha ru ọya nọkiekie 1.

prefigure-grid-spacing-too-fine = `<graph>`: ẹvba grid kpọkpọ hia ne ẹkiọ axis; a i wa grid vbe prefigure.

prefigure-annotations-not-rendered = `<graph>`: A i gha rhie annotation ye miẹn vbe ẹghẹ ne PreFigure i rre.

multiple-annotations-children = A miẹn ọmọ `<annotations>` nọ hin ọkpa vbe `<graph>`; a i ru hia kokosa ọni ẹkẹtin.

## Referring to other components

copy-unrecognized-component-type = A i sẹtin fẹ yana ye irẹnkẹn owa nọ i rẹn: { $type }.

copy-prop-not-found = A i miẹn ànímọ́ { $property } vbe owa irẹnkẹn { $component }

collect-no-source = A i miẹn ehe ọkpa ne collect.

collect-invalid-component-type = A i sẹtin kokosa owa irẹnkẹn `<{ $component }>` rhunmwuda ọ rrọọ irẹnkẹn owa nọ i maan.

# $reference is quoted back exactly as the author wrote it, `$` and all.
reference-index-unavailable = A i sẹtin ye kuan `{ $reference }` gbaroko

## `<callAction>`

component-action-unavailable = A i sẹtin ye { $action } vbe owa `{ $reference }` gbaroko

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Oghẹ dàta i maan. Efe ni oghẹ nọ i danmwẹhọ. A miẹn ẹre vbe componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Dàta ni uni ọwagbe nọ ru vbe ọni. A miẹn ẹre vbe componentIdx :{ $componentIdx }

data-frame-missing-column-name = Dàta i vbe uni ọwagbe. A miẹn ẹre vbe componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award ne ọre nan gbaroko vbe ọre nọ answer ẹre rhie, nọ gha ye emwin nọ i ke hia gha rre.

# Translators: maxNumAttempts and sectionWideCheckWork are attribute names.
answer-max-num-attempts-in-section-wide-check-work = Ye `maxNumAttempts` vbe `<answer>` nọ rre vbe owa nọ ni `sectionWideCheckWork` i vbe emwin sẹ, rhunmwuda owa ẹre ni ru ighiẹnrhan gele. Ye `maxNumAttempts` vbe owa nan nan.

nested-section-wide-check-work-max-num-attempts = Ye `maxNumAttempts` vbe owa nọ ni `sectionWideCheckWork` nọ rre vbe owa ọvbehe nọ ni `sectionWideCheckWork` i vbe emwin sẹ, rhunmwuda owa nọ hin gbaroko ni ru ighiẹnrhan gele. Ye `maxNumAttempts` vbe owa nọ hin gbaroko nan.

# $attributes is a list of attribute names; $attributesCount is its length.
answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Ànímọ́ { $attributes } i vbe emwin sẹ deghẹ symbolicEquality i ye.
       *[other] Ànímọ́ { $attributes } i vbe emwin sẹ deghẹ symbolicEquality i ye.
    }

answer-invalid-type = Irẹnkẹn i maan ne answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Rhunmwuda owa `<{ $component }>` i vbe uni, A i sẹtin ru ẹre ne ànímọ́ module

module-attribute-name-already-defined = A i sẹtin ru owa `<{ $component } name="{ $name }">` ye ànímọ́ ne module rhunmwuda irẹnkẹn owa `<module>` ni vbe ànímọ́ nọ rrọọ "{ $name }" ke nian.

conditional-content-condition-ignored = A i ru ànímọ́ `condition` vbe owa `<conditionalContent>` nọ ni ọmọ case yana else.

slider-markers-type-mismatch = Irẹnkẹn markers i danmwẹhọ ye irẹnkẹn slider.

pretzel-problem-needs-statement-and-answer = pretzel i maan: `<problem>` kevbekevbe khẹke ne ọ ni `<statement>` ọkpa kevbe `<answer>` ọkpa.

pretzel-circuit-first-problem-distractor = pretzel i maan: vbe mode="circuit", `<problem>` nọkiekie i sẹtin rrọọ ọya nọ hia rẹn.

## Attribute values

# $values is a list of the values that were rejected; $valuesCount is how
# many there were.
attribute-invalid-values =
    { $valuesCount ->
        [one] Iye { $values } i maan ne ànímọ́ `{ $attribute }`; a i ru ẹre.
       *[other] Iye { $values } i maan ne ànímọ́ `{ $attribute }`; a i ru ẹre.
    }

attribute-must-be-references = Iye `{ $value }` i maan ne ànímọ́ `{ $attribute }`. Ànímọ́ khẹke ne ọ ni emwin nọ gha bẹrẹ ye `$`.

# $names is a list of the rejected names, each already in single quotes.
math-input-invalid-function-names = <mathInput>: A i ru uni ọsẹ nọ i maan vbe { $attribute }: { $names }. Ọya odaro ti uni kevbekevbe khẹke ne ọ ni akoto akhirikhiri eva ye odukhunmwu (uni yana ẹmiẹmi); `|<mathspeak alternative>` sẹ vbe otọ.

## Building components from the source

component-type-invalid = Irẹnkẹn owa i maan: `<{ $componentType }>`

attribute-repeated = A i sẹtin ye ànímọ́ { $attribute } ru vbe ọni.

attribute-invalid-for-component = Ànímọ́ "{ $attribute }" i maan ne owa irẹnkẹn `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Ẹmwẹ style { $styleNumber } i vbe ọya nọ khẹke ne { $context ->
        [text-on-background] ọya ẹmwẹ ye ọya ugbo
        [high-contrast] ọya nọ hin gbaroko ye ọya owanrẹn
        [line] ọya ẹfẹ ye ọya owanrẹn
        [marker] ọya akoto ye ọya owanrẹn
       *[text-on-canvas] ọya ẹmwẹ ye ọya owanrẹn
    }{ $mode ->
        [dark] { " (ẹghẹ dudu)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ọ khẹke ne ọ rrọọ { $threshold }:1 ye odukhunmwu).

# $suggestion says whether a concrete replacement colour could be computed.
style-definition-dark-mode-text-background-contrast =
    Deghẹ style { $styleNumber } ye ọya nọ khẹke sẹ ne ẹghẹ light, ọya ẹghẹ dudu na gha ke iran rre i vbe ọya nọ khẹke sẹ ye ọya ẹmwẹ kevbe ọya ugbo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ọ khẹke ne ọ rrọọ { $threshold }:1 ye odukhunmwu). { $suggestion ->
        [available] Ne ọya khẹke rrọọ vbe ẹghẹ dudu, gele ọya ẹghẹ light (bii ye { $lightAttribute }="{ $lightColor }") yana gele ọya ẹghẹ dudu (bii ye { $darkAttribute }="{ $darkColor }").
       *[none] Ne ọya khẹke rrọọ vbe ẹghẹ dudu, gele ọya ẹghẹ light yana gele ọya nọ ke rre nan ye textColorDarkMode kevbe/yana backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Deghẹ style { $styleNumber } ye ọya ẹmwẹ nọ khẹke sẹ ne ẹghẹ light, ọya ẹmwẹ ẹghẹ dudu na gha ke rre i vbe ọya nọ khẹke sẹ ye ọya owanrẹn ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ọ khẹke ne ọ rrọọ { $threshold }:1 ye odukhunmwu). { $suggestion ->
        [available] Ne ọya khẹke rrọọ vbe ẹghẹ dudu, gele ọya ẹghẹ light (bii ye textColor="{ $lightColor }") yana gele ọya ẹghẹ dudu (bii ye textColorDarkMode="{ $darkColor }").
       *[none] Ne ọya khẹke rrọọ vbe ẹghẹ dudu, gele ọya ẹghẹ light yana gele ọya nọ ke rre nan ye textColorDarkMode.
    }

section-multiple-style-palettes = Owa ọkpa i sẹtin ye <stylePalette> ọkpa gbọ; a gha ru ọni ẹkẹtin.

## Unique variants

variant-num-to-select-not-non-negative-integer = A i sẹtin gbaroko irẹnkẹn ẹrẹnkẹn ti { $component } rhunmwuda numToSelect i rrọọ kuan gbaroko nọ i kpọkpọ sẹ noughts.

variant-num-to-select-not-constant-number = A i sẹtin gbaroko irẹnkẹn ẹrẹnkẹn ti { $component } rhunmwuda numToSelect i rrọọ kuan nọ i gha danmwẹ.

variant-with-replacement-not-constant-boolean = A i sẹtin gbaroko irẹnkẹn ẹrẹnkẹn ti { $component } rhunmwuda withReplacement i rrọọ boolean nọ i gha danmwẹ.

variant-select-weight-disables-unique = A gha fian irẹnkẹn ẹrẹnkẹn ti select vbe ẹghẹ ne ọya ọkpa ni selectWeight yana selectForVariants

variant-coprime-undetermined = A i sẹtin gbaroko irẹnkẹn ẹrẹnkẹn ti { $component } rhunmwuda A i sẹtin gbaroko deghẹ coprime rrọọ irọ ẹghẹ hia.

# $attribute is an attribute name (`from`, `to`, `step`, `sort`, `length`) and
# stays as written.
variant-attribute-not-constant = A i sẹtin gbaroko irẹnkẹn ẹrẹnkẹn ti { $component } rhunmwuda { $attribute } i rrọọ emwin nọ i gha danmwẹ.

variant-attribute-not-number = A i sẹtin gbaroko irẹnkẹn ẹrẹnkẹn ti { $component } rhunmwuda { $attribute } i rrọọ kuan.

variant-attribute-wrong-type-for-sequence =
    A i sẹtin gbaroko irẹnkẹn ẹrẹnkẹn ti { $component } irẹnkẹn { $type } rhunmwuda { $attribute } i rrọọ { $expected ->
        [letters-combination] uni akhirikhiri nọ danmwẹhọ
        [math-expression] ọfoworhọ math nọ maan
        [integer] kuan gbaroko
       *[number] kuan
    }.

variant-length-not-integer = A i sẹtin gbaroko irẹnkẹn ẹrẹnkẹn ti { $component } rhunmwuda length i rrọọ kuan gbaroko.

variant-sort-not-implemented = A i ke ru irẹnkẹn ẹrẹnkẹn ti { $component } ye sort

variant-exclude-combinations-not-implemented = A i ke ru irẹnkẹn ẹrẹnkẹn ti { $component } ye excludeCombinations

variant-math-exclude-not-implemented = A i ke ru irẹnkẹn ẹrẹnkẹn ti { $component } irẹnkẹn math ye exclude

variant-non-constant-exclude-not-implemented = A i ke ru irẹnkẹn ẹrẹnkẹn ti { $component } ye exclude nọ gha danmwẹ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: A i ru vbe prefigure graph; a fian ọmọ nan.

prefigure-descendant-invalid-geometry = { $subject }: oghẹ nọ i vbe okiekie yana nọ i danmwẹ; a fian ọmọ nan.

prefigure-curve-label-omitted = { $subject }: A i ru uni vbe emwin curve na gele; a fian uni nan.

prefigure-curve-unsupported-definition-type = { $subject }: A i ru irẹnkẹn ẹmwẹ ọsẹ curve '{ $definitionType }'; a fian ọmọ nan.

prefigure-region-flip-functions-unsupported = { $subject }: A i ru ànímọ́ flipFunctions vbe regionBetweenCurves; a fian ọmọ nan.

prefigure-region-non-formula-child = { $subject }: A ru ọsẹ ọmọ irẹnkẹn formula gbọ vbe regionBetweenCurves; a fian ọmọ nan.

# $labelKind says which family of object carried the label.
prefigure-label-position-unsupported =
    { $subject }: A i ru labelPosition '{ $labelPosition }' ne { $labelKind ->
        [line-family] uni ti irẹnkẹn ẹfẹ
       *[point] uni ti akoto
    }; a gha ru ọya PreFigure nọkiekie.

prefigure-fill-style-unsupported = { $subject }: ọya nọ vbe ẹgua '{ $fillStyle }' i vbe emwin PreFigure ru; a gha ru ẹgua gbaroko.

prefigure-line-style-unknown = { $subject }: a fian ọya ẹfẹ nọ i rẹn '{ $lineStyle }' ke output PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: a gele ọya akoto '{ $markerStyle }' ye ọya PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: A i ru ọya akoto '{ $markerStyle }' vbe PreFigure; a gha ru ọya nọkiekie.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` i maan; A i sẹtin gbaroko emwin nọ hia. A fian annotation nan.

annotation-ref-multiple-targets = `<annotation>`: `ref` ye emwin nọ hin ọkpa gbaroko; a gha ru nọkiekie.

annotation-ref-outside-graph = `<annotation>`: `ref` i maan; emwin nọ hia rre ke odaro graph nọ ye ẹre. A fian annotation nan.

annotation-ref-unsupported-target = `<annotation>`: `ref` i maan; emwin nọ hia i rrọọ emwin owanrẹn nọ a ru vbe prefigure. A fian annotation nan.

annotation-text-missing = `<annotation>`: `text` i rre yana ọ i vbe emwin; a gha rhie ẹmwẹ nọ i vbe emwin.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] A miẹn emwin nọ gbaroko vbe iyeke.
       *[other] A miẹn emwin nọ gbaroko vbe iyeke nọ danmwẹhọ ye owa `<{ $componentType }>`.
    }

reference-no-referent = A i miẹn emwin nọ hia ne emwin nọ ru: `{ $reference }`

reference-multiple-referents = A miẹn emwin nọ hin ọkpa nọ hia ne emwin nọ ru: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Odẹ i maan ne ànímọ́ { $attribute } ti `<{ $componentType }>`.

# $children is the list of child types that did not match, already joined.
children-invalid = Ọmọ i maan ne `<{ $componentType }>`: A miẹn ọmọ nọ i maan: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Iye `{ $value }` i maan ne ànímọ́ `{ $attribute }`, a gha ru iye `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] A i miẹn ẹdẹ DoenetML { $version }.
       *[other] A i miẹn ẹdẹ DoenetML { $version }. A gha ru ẹdẹ { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML i maan: { $content }

parse-tag-missing-close-tag = DoenetML i maan: Uni `{ $tag }` i vbe uni nọ mudia ẹre. A gele uni nọ gha mudia ẹre yana uni `</{ $tagName }>`.

parse-tag-error = DoenetML i maan: Efian rre vbe uni `<{ $tagName }>`

parse-attribute-missing-value = DoenetML i maan: Ànímọ́ `{ $attribute }` i maan i vbe iye.

parse-attribute-invalid = DoenetML i maan: Ànímọ́ `{ $attribute }` i maan

parse-attribute-value-invalid = DoenetML i maan: Iye ànímọ́ `{ $value }` i maan

# $quote is the quote character that would balance the pair.
parse-attribute-value-quote-mismatch = DoenetML i maan: Iye ànímọ́ `{ $value }` i maan. Uni ọfoworhọ i danmwẹhọ. A miẹn wẹẹ `{ $quote }` i rre

parse-open-tag-name-missing = DoenetML i maan: A miẹn uni nọ i vbe uni ọre, bii `<`

parse-tag-not-closed = DoenetML i maan: A i mudia uni `{ $tag }` (a miẹn wẹẹ `>` i rre).

parse-self-closing-tag-name-missing = DoenetML i maan: A miẹn uni nọ i vbe uni ọre `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML i maan: A i mudia uni `{ $tag }` (a miẹn wẹẹ `/>` i rre).

parse-tag-invalid-attributes = DoenetML i maan: Uni `{ $tag }` i maan. Ọ sẹ ni ànímọ́ nọ i maan.

parse-close-tag-name-missing = DoenetML i maan: A miẹn uni mudia nọ i vbe uni ọre, bii `</`

# $attribute is the attribute name and $value the unquoted token that
# followed it.
parse-attribute-value-unquoted = Iye ànímọ́ khẹke ne a ye vbe uni ọfoworhọ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML i maan: A miẹn uni mudia `{ $tag }`, sokẹ uni ne a ghi wa ẹre i rre

parse-close-tag-mismatched = DoenetML i maan: Uni mudia i danmwẹhọ. A gele `</{ $expected }>`. A miẹn `{ $found }`

parser-node-unconvertible = A i sẹtin gele node { $node } ye node Dast.

## Names

name-attribute-invalid =
    Ànímọ́ name='{ $name }' i maan. { $reason ->
        [characters] Uni khẹke ne ọ ni akoto akhirikhiri, kuan, ẹmiẹmi otọ yana ẹmiẹmi gbọ.
       *[start] Uni khẹke ne ọ bẹrẹ vbe akoto akhirikhiri.
    }

component-name-invalid-start = Uni owa "{ $name }" i maan. Uni khẹke ne ọ bẹrẹ vbe akoto akhirikhiri.

## `<answer>` sugar

answer-video-watched-missing-video = Answer irẹnkẹn videoWatched khẹke ne ọ ni ànímọ́ video

answer-video-watched-video-not-reference = Answer irẹnkẹn videoWatched khẹke ne ànímọ́ video ẹre rrọọ emwin nọ ru

answer-name-not-single-text = Ànímọ́ name ti answer khẹke ne ọ ni ọmọ text ọkpa gbọ

## Referencing another document

external-doenetml-recursion-limit = A i sẹtin miẹn DoenetML ke odaro rhunmwuda ọ hin hia gha kokosa. Ẹmwẹ nọ gha danmwẹhọ ye egbe ẹre rre?

external-doenetml-unavailable = A i sẹtin miẹn DoenetML ke { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML nọ a miẹn ke { $attribute }="{ $uri }" i maan: ọ i danmwẹhọ ye irẹnkẹn owa "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] A i ke ru ànímọ́ `{ $from }` mọ́; ru `{ $to }` nan.
       *[other] [deprecation] A i ke ru ànímọ́ `{ $from }` vbe `<{ $component }>` mọ́; ru `{ $to }` nan.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] A i ke ru ànímọ́ `{ $from }` mọ́ rhunmwuda `{ $to }` ye kevbe.
       *[other] [deprecation] A i ke ru ànímọ́ `{ $from }` vbe `<{ $component }>` mọ́ rhunmwuda `{ $to }` ye kevbe.
    }

deprecated-attribute-ignored = [deprecation] A i ke ru ànímọ́ `{ $attribute }` vbe `<{ $component }>` mọ́.

deprecated-attribute-to-child = [deprecation] Ànímọ́ `{ $attribute }` vbe `<{ $component }>` i ke ru mọ́; ru ọmọ `<{ $child }>` nan.

deprecated-attribute-value-renamed = [deprecation] Iye `{ $value }` ti ànímọ́ `{ $attribute }` vbe `<{ $component }>` i ke ru mọ́; ru `{ $to }` nan.


## Language coverage

# $locale is the document's language tag, as declared.
pluralize-english-only = `<pluralize>` i sẹtin ru English gbọ, sokẹ ẹmwẹ ẹre i gele vbe akọsile nọ rre vbe { $locale }. Kha uni ni hin ọkpa nan, yana ye ẹre ye ànímọ́ `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Owa `<{ $tag }>` i rrọọ owa Doenet nọ a rẹn.

schema-element-not-allowed-at-root = A i ru owa `<{ $tag }>` vbe ẹfẹnrẹn akọsile.

schema-element-not-allowed-inside = A i ru owa `<{ $tag }>` vbe evbare `<{ $parent }>`.

schema-attribute-unrecognized = Owa `<{ $tag }>` i vbe ànímọ́ nọ rrọọ `{ $attribute }`.

# $allowed is the attribute's permitted values, joined for the reader's
# language. $isList says whether the attribute takes several at once.
schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ànímọ́ `{ $attribute }` ti owa `<{ $tag }>` khẹke ne ọ rrọọ uni ne emwin kevbekevbe rrọọ ọkpa vbe: { $allowed }
       *[other] Ànímọ́ `{ $attribute }` ti owa `<{ $tag }>` khẹke ne ọ rrọọ ọkpa vbe: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Uni irẹnkẹn i maan ne select. Uni irẹnkẹn { $variantName } rre vbe ọya { $numOptions } sokẹ kuan nọ khian a rhie rrọọ { $numToSelect }.

select-variant-name-without-options = A ye irẹnkẹn eso ne select sokẹ ọya i rre ne uni irẹnkẹn nọ sẹtin rrọọ: { $variantName }.

select-variant-name-not-possible = Uni irẹnkẹn { $variantName } nọ a ye ne select i rrọọ uni irẹnkẹn nọ sẹtin rrọọ.

select-too-few-options = A i sẹtin rhie owa { $numToSelect } ke { $numOptions } gbọ.

select-from-sequence-too-few-values = A i sẹtin rhie kuan { $numToSelect } ke sequence nọ ni oghẹ { $length }.

select-from-sequence-indices-count-mismatch = Kuan akoto ni ru select khẹke ne ọ danmwẹhọ ye kuan nọ khian a rhie

select-from-sequence-indices-not-integers = Akoto hia ni ru select khẹke ne ọ rrọọ kuan gbaroko

select-from-sequence-index-excluded = A ye akoto selectfromsequence nọ a fian

select-from-sequence-indices-excluded-combination = A ye akoto selectfromsequence nọ rrọọ uni nọ a fian

select-from-sequence-coprime-not-positive-integers = A i sẹtin rhie uni coprime rhunmwuda kuan gbaroko nọ hin noughts i rre ẹre gha rhie.

# Translators: from, to and step are attribute names.
select-from-sequence-coprime-common-factor = A i sẹtin rhie kuan coprime. Kuan hia nọ sẹtin rrọọ ni ọya danmwẹhọ ọkpa. (Iye "from" yana "to" nọ ye khẹke ne ọ rrọọ coprime ye "step".)

select-from-sequence-coprime-single-number = A i sẹtin rhie uni coprime ke kuan ọkpa nọ i rrọọ 1.

select-from-sequence-excluded-too-many-combinations = A fian ẹkẹtin 70% ti uni ke selectFromSequence

select-from-sequence-coprime-none-found = A i sẹtin rhie kuan coprime. Kuan hia nọ sẹtin rrọọ ni ọya danmwẹhọ ọkpa.

select-from-sequence-too-few-unique-values = A i sẹtin rhie kuan ẹrẹnkẹn { $numToSelect } ke sequence nọ ni oghẹ { $numPossibleValues }

select-prime-numbers-too-few-values = A i sẹtin rhie kuan { $numToSelect } ke uni kuan prime nọ ni oghẹ { $numValues }

select-prime-numbers-values-count-mismatch = Kuan iye ni ru select khẹke ne ọ danmwẹhọ ye kuan nọ khian a rhie

select-prime-numbers-values-not-prime = Iye hia ni ru select prime number khẹke ne ọ rre vbe uni kuan prime

select-prime-numbers-values-excluded-combination = Iye selectPrimeNumbers nọ a ye rrọọ uni nọ a fian

select-prime-numbers-excluded-too-many-combinations = A fian ẹkẹtin 70% ti uni ke selectPrimeNumbers

select-random-combination-fluke = Ye emwin nọ i ke ke sẹtin rrọọ, A i sẹtin rhie uni kuan nọ i danmwẹ

select-random-value-fluke = Ye emwin nọ i ke ke sẹtin rrọọ, A i sẹtin rhie kuan nọ i danmwẹ
