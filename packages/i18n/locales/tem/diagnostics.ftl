# Temne diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element names, attribute names and attribute values — `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `math`, `text` and the rest —
# are part of the language rather than prose, and stay in English exactly as
# written.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] ma bɔth { $attributes } ma tʌtəp tʌrʌŋ ma sɔŋɔ
       *[other] ma bɔth { $attributes } ma tʌtəp tʌrʌŋ ma sɔŋɔ
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] ma bɔth { $attributes } ma kʌtəp na kʌkəri ma sɔŋɔ tʌpəŋ
       *[other] ma bɔth { $attributes } ma kʌtəp na kʌkəri ma sɔŋɔ tʌpəŋ
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset kʌ paŋth bɔm ma kʌkəri kʌ na bɔm

## `<line>`

line-points-undetermined-dimensions = Kʌlayn kʌ kəri tʌtoni tʌ ma bata tʌbana tʌ bɔm.

line-points-too-few-dimensions = Kʌlayn kʌ fɔ kəri tʌtoni tʌ na tʌbana tʌrʌŋ ɔ tʌbana.

line-points-depend-on-variables = Kʌlayn kʌ kəri tʌtoni tʌ nəŋ tʌfiri: { $variables }.

line-equation-invalid-format = Ʌŋbay ka ikweshɔn ka kʌlayn kʌ bana bɔm ka { $variable1 } na { $variable2 }.

## `<ray>`

ray-overprescribed-through = Kʌre kʌ sɔŋɔ na through, endpoint na direction.  Ma bɔth through kʌ ma sɔŋɔ.

ray-dimension-mismatch = numDimensions kʌ nɔŋ bɔm ka kʌre.

## `<vector>`

vector-overprescribed-head = Kʌvɛkta kʌ sɔŋɔ na head, tail na displacement.  Ma bɔth head kʌ ma sɔŋɔ.

vector-dimension-mismatch = numDimensions kʌ nɔŋ bɔm ka kʌvɛkta.

## Attracting and constraining

attract-to-without-nearest-point = Ma tɔŋ `<{ $component }>` bɔm bɛkɔs kʌ na nearestPoint bɔm.

constrain-to-without-nearest-point = Ma kanti `<{ $component }>` bɔm bɛkɔs kʌ na nearestPoint bɔm.

constrain-to-interior-without-nearest-point = Ma kanti ka rɔ `<{ $component }>` bɔm bɛkɔs kʌ na nearestPoint bɔm.

## `<choiceInput>`

choice-input-label-position-ignored = ma bɔth labelPosition ka choiceInput kʌ bana inline bɔm

## Ordering children by index

choice-input-indices-count-mismatch = Ma bɔth indices tʌ ma sɔŋɔ ka choiceInput bɛkɔs ʌŋnamba ka indices kʌ nɔŋ bɔm na ʌŋnamba ka tʌwan tʌ choice.

pretzel-indices-count-mismatch = Ma bɔth indices tʌ ma sɔŋɔ ka problem bɛkɔs ʌŋnamba ka indices kʌ nɔŋ bɔm na ʌŋnamba ka tʌwan tʌ problem.

shuffle-indices-count-mismatch = Ma bɔth indices tʌ ma sɔŋɔ ka shuffle bɛkɔs ʌŋnamba ka indices kʌ nɔŋ bɔm na ʌŋnamba ka tʌbʌŋ.

indices-ignored-out-of-range = Ma bɔth indices tʌ ma sɔŋɔ ka { $component } bɛkɔs tʌbʌŋ tʌ na ka kʌrɛnj kʌbʌŋ.

pretzel-indices-repeated = Ma bɔth indices tʌ ma sɔŋɔ ka pretzel bɛkɔs tʌbʌŋ tʌ ripit.

pretzel-circuit-first-index = Ma bɔth indices tʌ ma sɔŋɔ ka pretzel ka mode="circuit" bɛkɔs index kʌ təŋ kʌ fɔ bana 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Kʌ `<{ $component }>` kʌ paŋth na tʌwan tʌ string, `type` attribute kʌ fɔ sɔŋɔ.

invalid-type-defaulting-to-math = Type { $type } kʌ bana bɔm ka { $component }. Kʌ fɔ bana math, text, number ɔ boolean. Ma bay math.

string-not-valid-component-to-arrange = String "{ $value }" kʌ bana kʌbʌŋ kʌbana bɔm ka { $component }. Ma bɔth kʌ.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } kʌ bana bɔm, ma bay type number.

invalid-variable-value = Ʌŋbʌŋ ka kʌfiri kʌ bana bɔm: `{ $value }`

## Variants

variant-index-must-be-number = Kʌmʌŋ index { $index } kʌ fɔ bana ʌŋnamba

variant-index-must-be-integer = Kʌmʌŋ index { $index } kʌ fɔ bana ʌŋnamba kʌpəŋ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` kʌ bay bɔm ka tʌjɔth tʌpəŋ. Ma bay tʌbana kʌ tʌnəŋ.

side-by-side-absolute-margins = `<{ $component }>` kʌ bay bɔm ka tʌjɔth tʌpəŋ. Ma bay tʌbʌŋ kʌ tʌnəŋ.

side-by-side-no-block-child = `<{ $component }>` kʌ bana bɔm: kʌ fɔ na kʌwan kʌ block kʌrɔŋ ɔ kʌbana.

## `<label>`

label-for-ignored-on-graphical = Ma bɔth `for` attribute ka `<label>` ka kʌmisal.

label-for-must-resolve-to-one = `for` attribute ka `<label>` kʌ fɔ nəŋ kʌbʌŋ kʌrɔŋ dɔm.

label-for-unresolved = `for` attribute ka `<label>` kʌ nəŋ kʌbʌŋ bɔm.

label-for-answer-with-authored-inputs = `for` attribute ka `<label>` kʌ nəŋ `<answer>` kʌ na input tʌ ma sɔŋɔ; nəŋ input kʌ kʌpəŋ.

label-for-answer-without-input = `for` attribute ka `<label>` kʌ nəŋ `<answer>` kʌ na input bɔm.

label-for-must-reference-input-or-answer = `for` attribute ka `<label>` kʌ fɔ nəŋ input ɔ answer.

## Accessibility

accessibility-short-description-or-decorative = Ka kʌsɔth, `<{ $component }>` kʌ fɔ na ʌŋkəbath ka kʌbath ɔ kʌ fɔ sɔŋɔ kʌ decorative.

accessibility-video-short-description = Ka kʌsɔth, `<video>` kʌ fɔ na ʌŋkəbath ka kʌbath.

accessibility-input-short-description-or-label = Ka kʌsɔth, `<{ $component }>` kʌ fɔ na ʌŋkəbath ka kʌbath ɔ ʌŋes.

accessibility-answer-input-short-description-or-label = Ka kʌsɔth, `<answer>` kʌ bay input kʌ fɔ na ʌŋkəbath ka kʌbath ɔ ʌŋes.

accessibility-short-description-contains-math = Ʌŋkəbath ka kʌbath kʌ fɔ na tʌbʌŋ tʌ mat kʌ `<{ $component }>` bɔm. Sɔŋ mat na tʌkəre.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kʌ na kʌfiri kʌbana bɔm ka ʌŋkəre ka kʌtɔŋ ka kʌpath (mode kʌ fith) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kʌ fen { $threshold }:1 ɔ kʌbana).
       *[other] { $colorName } kʌ na kʌfiri kʌbana bɔm ka ʌŋkəre ka kʌtɔŋ ka kʌpath ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kʌ fen { $threshold }:1 ɔ kʌbana).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` kʌ kəri tʌtoni { $count } kʌ bay bɔm ma tʌtoni tʌ na tʌnamba bɔm.

circle-too-many-through-points = Ma jɔth tʌkərəŋ kʌ kəri tʌtoni tʌ pas 3 bɔm.

circle-overprescribed-radius-center-points = Ma jɔth tʌkərəŋ na radius, kʌkəri na tʌtoni tʌpəŋ bɔm.

circle-center-with-multiple-points = Ma jɔth tʌkərəŋ na kʌkəri kʌ kəri kʌtoni kʌ pas 1 bɔm.

circle-radius-too-small = Ma jɔth tʌkərəŋ bɔm: ʌŋtɔŋ ka tʌtoni tʌrʌŋ kʌ bana { $distance }, radius { $radius } kʌ ma sɔŋɔ kʌ kəni tʌbana.

circle-radius-with-many-points = Ma bay tʌkərəŋ kʌ kəri tʌtoni tʌ pas tʌrʌŋ na radius kʌ ma sɔŋɔ bɔm.

circle-invalid-center-or-through-points = Kʌkəri ɔ tʌtoni tʌ tʌkərəŋ tʌ bana bɔm.

circle-radius-center-with-multiple-points = Ma jɔth radius ka tʌkərəŋ na kʌkəri kʌ kəri kʌtoni kʌ pas 1 bɔm.

circle-change-radius-non-numerical = Ma firi radius ka tʌkərəŋ na tʌtoni tʌ na tʌnamba bɔm

circle-radius-with-points-non-numerical = Ma bay tʌkərəŋ kʌ kəri kʌtoni kʌ pas kʌrɔŋ na radius ma tʌnamba tʌ na bɔm.

circle-change-center-non-numerical = Kʌfiri kʌkəri ka tʌkərəŋ kʌ kəri tʌtoni tʌ na tʌnamba bɔm kʌ bay bɔm.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Tʌbana tʌ fen bɔm ka domain ka kʌfɔnkshɔn. Domain kʌ na intaval { $intervals } kɛrɛ kʌfɔnkshɔn kʌ na { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        }.
       *[other] Tʌbana tʌ fen bɔm ka domain ka kʌfɔnkshɔn. Domain kʌ na intaval { $intervals } kɛrɛ kʌfɔnkshɔn kʌ na { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        }.
    }

function-domain-invalid-format = Ʌŋbay ka domain ka kʌfɔnkshɔn kʌ bana bɔm.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ma bɔth kʌbana kʌ kʌfɔnkshɔn kʌ na ʌŋnamba bɔm.
        [minimum] Ma bɔth kʌkəni kʌ kʌfɔnkshɔn kʌ na ʌŋnamba bɔm.
        [extremum] Ma bɔth kʌtəp kʌ kʌfɔnkshɔn kʌ na ʌŋnamba bɔm.
        [point] Ma bɔth kʌtoni kʌ kʌfɔnkshɔn kʌ na ʌŋnamba bɔm.
        [slope] Ma bɔth kʌkəri kʌ kʌfɔnkshɔn kʌ na ʌŋnamba bɔm.
       *[other] Ma bɔth { $type } kʌ kʌfɔnkshɔn kʌ na ʌŋnamba bɔm.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ma bɔth kʌbana kʌ kʌfɔnkshɔn kʌ na kəm bɔm.
        [minimum] Ma bɔth kʌkəni kʌ kʌfɔnkshɔn kʌ na kəm bɔm.
        [extremum] Ma bɔth kʌtəp kʌ kʌfɔnkshɔn kʌ na kəm bɔm.
        [point] Ma bɔth kʌtoni kʌ kʌfɔnkshɔn kʌ na kəm bɔm.
       *[other] Ma bɔth { $type } kʌ kʌfɔnkshɔn kʌ na kəm bɔm.
    }

function-points-too-close = Kʌfɔnkshɔn kʌ na tʌtoni tʌrʌŋ tʌ nɔŋ tʌbana. Ma bath kʌfɔnkshɔn bɔm.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Tʌripit tʌ kʌfɔnkshɔn tʌ paŋth dɔm ma ʌŋnamba ka input kʌ nɔŋ na ʌŋnamba ka output. Kʌfɔnkshɔn kʌnɛ kʌ na input { $inputs } na { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        }.
       *[other] Tʌripit tʌ kʌfɔnkshɔn tʌ paŋth dɔm ma ʌŋnamba ka input kʌ nɔŋ na ʌŋnamba ka output. Kʌfɔnkshɔn kʌnɛ kʌ na input { $inputs } na { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Ʌŋtɔŋ ka sequence kʌ bana bɔm.  Kʌ fɔ bana ʌŋnamba kʌpəŋ kʌ təp ziro bɔm.

sequence-invalid-step = Step ka sequence kʌ bana bɔm.  Kʌ fɔ bana ʌŋnamba ka sequence ka type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ka number sequence kʌ bana bɔm.  Kʌ fɔ bana ʌŋnamba.

sequence-invalid-endpoint-letters = "{ $attribute }" ka letters sequence kʌ bana bɔm.  Kʌ fɔ bana tʌmark tʌ thɔfi.

sequence-invalid-endpoint = "{ $attribute }" ka sequence kʌ bana bɔm.

select-from-sequence-coprime-not-numbers = ma bɔth coprime bɛkɔs ma fen tʌnamba bɔm

select-from-sequence-coprime-with-exclude-combinations = ma bɔth coprime bɛkɔs excludeCombinations kʌ sɔŋɔ

## Resolving a `target`

target-not-found = Target ka `<{ $source }>` kʌ bana bɔm: ma bata target bɔm.

target-state-variable-not-found = Target ka `<{ $source }>` kʌ bana bɔm: ma bata kʌfiri kʌ na ʌŋes "{ $property }" ka `<{ $component }>` bɔm.

## `<odeSystem>`

ode-system-variables-match-independent = Tʌfiri tʌ `<odeSystem>` tʌ fɔ bana tʌbʌŋ ka kʌfiri kʌ na kʌtɔfɔ.

ode-system-duplicate-variable-names = Ma bath tʌfɔnkshɔn tʌ ODE RHS na ʌŋes ka tʌfiri tʌ ripit bɔm.

ode-system-rhs-function-error = Ma bath kʌfɔnkshɔn ka ODE RHS bɔm.  Kʌwuni ka kʌbay ka kʌfɔnkshɔn ka mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ma bath kʌangul ka tʌlayn { $count } bɔm

angle-invalid-through-point = Kʌtoni kʌ bana bɔm ka through ka `<angle>`

parabola-vertex-too-many-points = Kʌparabola na vertex kʌ kəri kʌtoni kʌ pas 1 kʌ bay bɔm.

parabola-too-many-points = Kʌparabola kʌ kəri tʌtoni tʌ pas 3 kʌ bay bɔm.

intersection-too-many-items = Kʌthɔfi ka tʌbʌŋ tʌ pas tʌrʌŋ kʌ bay bɔm

## Other math components

ionic-compound-not-two-ions = Kʌthɔfi ka ayɔn ka kʌbʌŋ kʌ bana tʌayɔn tʌrʌŋ bɔm kʌ bay bɔm.

ionic-compound-needs-cation-and-anion = Kʌthɔfi ka ayɔn kʌ bay ka katayɔn kʌrɔŋ na anayɔn kʌrɔŋ dɔm.

solve-equations-cannot-evaluate = Ma sɔlv ikweshɔn bɔm bɛkɔs ma jɔth kʌ bɔm: { $equation }

math-operators-operand-number-required = operandNumber kʌ fɔ sɔŋɔ ma ma bɔth operand ka mat.

eigen-decomposition-failed = Ma jɔth tʌaygɛnvalyu tʌ matriks bɔm

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } kʌ na ka kʌpatan bɔm, kʌ nɔŋ kəm bɔm dɔm.
       *[other] `<matchesPattern>`: parameter { $parameters } tʌ na ka kʌpatan bɔm, tʌ nɔŋ kəm bɔm dɔm.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ma bath grid="{ $grid }" bɔm. Kʌ fɔ bana none, medium, dense, ɔ tʌnamba tʌrʌŋ tʌbana tʌ na kʌro kʌ kanti tʌ, kʌ grid="1 0.5". Ma bay grid bɔm.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" kʌ paŋth bɔm ka kʌyiraŋ ka prefigure; ma bay kʌ kʌbʌŋ ka kʌgbɔn.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" kʌ paŋth bɔm ka kʌyiraŋ ka prefigure; ma bay kʌ kʌbʌŋ ka kʌtɔŋ.

prefigure-invalid-axis-bounds = `<graph>`: tʌbʌŋ tʌ aksis tʌ bana bɔm ka prefigure; ma bay bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ʌŋbana kʌ bana bɔm ka prefigure; ma bay ʌŋbana 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio kʌ bana bɔm ka prefigure; ma bay aspɛkt reshio 1.

prefigure-grid-spacing-too-fine = `<graph>`: kʌro ka grid kʌ kəni tʌbana ka tʌbʌŋ tʌ aksis; ma bɔth grid ka kʌyiraŋ ka prefigure.

prefigure-annotations-not-rendered = `<graph>`: annotations tʌ yira bɔm ma kʌyiraŋ ka PreFigure kʌ bay bɔm.

multiple-annotations-children = Ma bata tʌwan tʌ `<annotations>` tʌbana ka `<graph>`; ma bɔth tʌpəŋ nɛ kʌ tʌtəp.

## Referring to other components

copy-unrecognized-component-type = Ma fɔth ɔ ma kɔpi kʌmʌŋ ka kʌbʌŋ kʌ ma bata bɔm: { $type }.

copy-prop-not-found = Ma bata prop { $property } ka kʌbʌŋ ka kʌmʌŋ { $component } bɔm

collect-no-source = Ma bata kʌtəŋ ka collect bɔm.

collect-invalid-component-type = Ma thɔfi tʌbʌŋ tʌ kʌmʌŋ `<{ $component }>` bɔm bɛkɔs kʌmʌŋ kʌ bana bɔm.

reference-index-unavailable = Ma nəŋ index `{ $reference }` bɔm

## `<callAction>`

component-action-unavailable = Ma yira { $action } ka kʌbʌŋ `{ $reference }` bɔm

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Ʌŋbay ka data kʌ bana bɔm.  Tʌro tʌ na tʌtɔŋ tʌbʌŋ. Ma bata ka componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data kʌ na ʌŋes ka tʌkɔlum tʌ ripit.  Ma bata ka componentIdx :{ $componentIdx }

data-frame-missing-column-name = ʌŋes ka kʌkɔlum kʌ na bɔm ka data.  Ma bata ka componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award ka ʌŋlipi kʌnɛ kʌ nəŋ ʌŋlipi ka answer tag kʌpəŋ, na kʌ ba na tʌbʌŋ tʌ mʌ mɔŋ bɔm.

answer-max-num-attempts-in-section-wide-check-work = Ma mʌ bay `maxNumAttempts` ka `<answer>` kʌ na ka rɔ kʌbʌŋ kʌ na `sectionWideCheckWork`, kʌ paŋth bɔm, bɛkɔs kʌbʌŋ kʌ tɔŋ ʌŋnamba ka tʌtʌmpa. Bay `maxNumAttempts` ka kʌbʌŋ.

nested-section-wide-check-work-max-num-attempts = Ma mʌ bay `maxNumAttempts` ka kʌbʌŋ kʌ na `sectionWideCheckWork` na kʌ na ka rɔ kʌbʌŋ kʌbʌŋ kʌ na `sectionWideCheckWork`, kʌ paŋth bɔm, bɛkɔs kʌbʌŋ ka kʌgbɔn kʌ tɔŋ ʌŋnamba ka tʌtʌmpa. Bay `maxNumAttempts` ka kʌbʌŋ ka kʌgbɔn.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] { $attributes } attribute kʌ paŋth bɔm ma symbolicEquality kʌ bay bɔm.
       *[other] { $attributes } attribute tʌ paŋth bɔm ma symbolicEquality kʌ bay bɔm.
    }

answer-invalid-type = Type ka ʌŋlipi kʌ bana bɔm: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ma kʌbʌŋ `<{ $component }>` kʌ na ʌŋes bɔm, ma bay kʌ kʌ attribute ka module bɔm

module-attribute-name-already-defined = Ma bay kʌbʌŋ `<{ $component } name="{ $name }">` kʌ attribute ka module bɔm bɛkɔs `<module>` kʌ na "{ $name }" attribute nɛ.

conditional-content-condition-ignored = Ma bɔth `condition` attribute ka `<conditionalContent>` kʌ na tʌwan tʌ case ɔ else.

slider-markers-type-mismatch = Type ka markers kʌ nɔŋ bɔm na type ka slider.

pretzel-problem-needs-statement-and-answer = Pretzel kʌ bana bɔm: kʌ `<problem>` kʌrɔŋ kʌrɔŋ kʌ fɔ na `<statement>` kʌrɔŋ na `<answer>` kʌrɔŋ.

pretzel-circuit-first-problem-distractor = Pretzel kʌ bana bɔm: ka mode="circuit", `<problem>` kʌ təŋ kʌ bana distractor bɔm.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ʌŋbʌŋ { $values } kʌ bana bɔm ka attribute `{ $attribute }`; ma bɔth kʌ.
       *[other] Tʌbʌŋ { $values } tʌ bana bɔm ka attribute `{ $attribute }`; ma bɔth tʌ.
    }

attribute-must-be-references = Ʌŋbʌŋ `{ $value }` kʌ bana bɔm ka attribute `{ $attribute }`. Attribute kʌ fɔ bana tʌnəŋ tʌ təŋ na `$`.

math-input-invalid-function-names = <mathInput>: ma bɔth ʌŋes ka tʌfɔnkshɔn tʌ bana bɔm ka { $attribute }: { $names }. Kʌpath ka kʌyiraŋ ka ʌŋes kʌrɔŋ kʌrɔŋ kʌ fɔ na tʌmark tʌrʌŋ ɔ tʌbana (tʌmark ɔ tʌdash); `|<mathspeak alternative>` kʌ tʌŋ.

## Building components from the source

component-type-invalid = Kʌmʌŋ ka kʌbʌŋ kʌ bana bɔm: `<{ $componentType }>`

attribute-repeated = Ma ripit attribute { $attribute } bɔm.

attribute-invalid-for-component = Attribute "{ $attribute }" kʌ bana bɔm ka kʌbʌŋ ka kʌmʌŋ `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Ʌŋkəbath ka kʌmʌŋ { $styleNumber } kʌ na kʌfiri kʌbana bɔm ka { $context ->
        [text-on-background] ʌŋkəbaka ka ʌŋkəre ka ʌŋkəbaka ka kʌbaka
        [high-contrast] ʌŋkəbaka ka kʌfiri kʌbana ka kanvas
        [line] ʌŋkəbaka ka kʌlayn ka kanvas
        [marker] ʌŋkəbaka ka kʌmark ka kanvas
       *[text-on-canvas] ʌŋkəbaka ka ʌŋkəre ka kanvas
    }{ $mode ->
        [dark] { " (mode kʌ fith)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kʌ fen { $threshold }:1 ɔ kʌbana).

style-definition-dark-mode-text-background-contrast =
    Ma ʌŋkəbath ka kʌmʌŋ { $styleNumber } kʌ na tʌkəbaka tʌ na kʌfiri kʌbana ka mode kʌ fera, tʌkəbaka tʌ mode kʌ fith tʌ ma bɔth ka tʌ tʌ na kʌfiri kʌbana bɔm ka ʌŋkəbaka ka ʌŋkəre na ʌŋkəbaka ka kʌbaka ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kʌ fen { $threshold }:1 ɔ kʌbana). { $suggestion ->
        [available] Kʌ mʌ bata kʌfiri kʌbana ka mode kʌ fith, bana kʌfiri ka mode kʌ fera (kʌ kʌmisal, bay { $lightAttribute }="{ $lightColor }") ɔ firi ʌŋkəbaka ka mode kʌ fith (kʌ kʌmisal, bay { $darkAttribute }="{ $darkColor }").
       *[none] Kʌ mʌ bata kʌfiri kʌbana ka mode kʌ fith, bana kʌfiri ka mode kʌ fera ɔ firi tʌkəbaka na textColorDarkMode ɔ backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ma ʌŋkəbath ka kʌmʌŋ { $styleNumber } kʌ na ʌŋkəbaka ka ʌŋkəre kʌ na kʌfiri kʌbana ka mode kʌ fera, ʌŋkəbaka ka ʌŋkəre ka mode kʌ fith kʌ ma bɔth ka kʌ kʌ na kʌfiri kʌbana bɔm ka kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kʌ fen { $threshold }:1 ɔ kʌbana). { $suggestion ->
        [available] Kʌ mʌ bata kʌfiri kʌbana ka mode kʌ fith, bana kʌfiri ka mode kʌ fera (kʌ kʌmisal, bay textColor="{ $lightColor }") ɔ firi ʌŋkəbaka ka mode kʌ fith (kʌ kʌmisal, bay textColorDarkMode="{ $darkColor }").
       *[none] Kʌ mʌ bata kʌfiri kʌbana ka mode kʌ fith, bana kʌfiri ka mode kʌ fera ɔ firi ʌŋkəbaka na textColorDarkMode.
    }

section-multiple-style-palettes = Kʌpath kʌ fen <stylePalette> kʌrɔŋ dɔm; ma bay kʌ kʌtəp.

## Unique variants

variant-num-to-select-not-non-negative-integer = ma bata tʌmʌŋ tʌbʌŋ tʌ { $component } bɔm bɛkɔs numToSelect kʌ bana ʌŋnamba kʌpəŋ kʌ təp ziro bɔm bɔm.

variant-num-to-select-not-constant-number = ma bata tʌmʌŋ tʌbʌŋ tʌ { $component } bɔm bɛkɔs numToSelect kʌ bana ʌŋnamba kʌ firi bɔm bɔm.

variant-with-replacement-not-constant-boolean = ma bata tʌmʌŋ tʌbʌŋ tʌ { $component } bɔm bɛkɔs withReplacement kʌ bana boolean kʌ firi bɔm bɔm.

variant-select-weight-disables-unique = Tʌmʌŋ tʌbʌŋ tʌ select tʌ kanti ma option kʌbʌŋ kʌ na selectWeight ɔ selectForVariants

variant-coprime-undetermined = ma bata tʌmʌŋ tʌbʌŋ tʌ { $component } bɔm bɛkɔs ma bata kʌ coprime kʌ bana ʌŋgbɔl dɔm bɔm.

variant-attribute-not-constant = ma bata tʌmʌŋ tʌbʌŋ tʌ { $component } bɔm bɛkɔs { $attribute } kʌ firi.

variant-attribute-not-number = ma bata tʌmʌŋ tʌbʌŋ tʌ { $component } bɔm bɛkɔs { $attribute } kʌ bana ʌŋnamba bɔm.

variant-attribute-wrong-type-for-sequence =
    ma bata tʌmʌŋ tʌbʌŋ tʌ { $component } ka type { $type } bɔm bɛkɔs { $attribute } kʌ bana { $expected ->
        [letters-combination] tʌmark tʌ thɔfi
        [math-expression] ʌŋkəre ka mat kʌ bana
        [integer] ʌŋnamba kʌpəŋ
       *[number] ʌŋnamba
    } bɔm.

variant-length-not-integer = ma bata tʌmʌŋ tʌbʌŋ tʌ { $component } bɔm bɛkɔs length kʌ bana ʌŋnamba kʌpəŋ bɔm.

variant-sort-not-implemented = tʌmʌŋ tʌbʌŋ tʌ { $component } na sort tʌ bay bɔm

variant-exclude-combinations-not-implemented = tʌmʌŋ tʌbʌŋ tʌ { $component } na excludeCombinations tʌ bay bɔm

variant-math-exclude-not-implemented = tʌmʌŋ tʌbʌŋ tʌ { $component } ka type math na exclude tʌ bay bɔm

variant-non-constant-exclude-not-implemented = tʌmʌŋ tʌbʌŋ tʌ { $component } na exclude kʌ firi tʌ bay bɔm

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: kʌ paŋth bɔm ka kʌyiraŋ ka graph prefigure; ma bɔth kʌwan.

prefigure-descendant-invalid-geometry = { $subject }: jiɔmɛtri kʌ bana bɔm ɔ kʌ pəŋ bɔm; ma bɔth kʌwan.

prefigure-curve-label-omitted = { $subject }: ʌŋes kʌ paŋth bɔm ka tʌbʌŋ tʌ curve tʌ ma firi; ma bɔth ʌŋes.

prefigure-curve-unsupported-definition-type = { $subject }: kʌmʌŋ ka ʌŋkəbath ka kʌfɔnkshɔn ka curve '{ $definitionType }' kʌ paŋth bɔm; ma bɔth kʌwan.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions attribute ka regionBetweenCurves kʌ paŋth bɔm; ma bɔth kʌwan.

prefigure-region-non-formula-child = { $subject }: tʌfɔnkshɔn tʌwan tʌ formula dɔm tʌ paŋth ka regionBetweenCurves; ma bɔth kʌwan.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' kʌ paŋth bɔm ka { $labelKind ->
        [line-family] ʌŋes ka kʌthɔfi ka tʌlayn
       *[point] ʌŋes ka kʌtoni
    }; ma bay kʌbʌŋ ka PreFigure.

prefigure-fill-style-unsupported = { $subject }: PreFigure kʌ bata kʌmʌŋ ka kʌwuni '{ $fillStyle }' bɔm; ma bay kʌwuni kʌpəŋ.

prefigure-line-style-unknown = { $subject }: ma bata kʌmʌŋ ka kʌlayn '{ $lineStyle }' bɔm, ma bɔth kʌ ka PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: ma firi kʌmʌŋ ka kʌmark '{ $markerStyle }' kʌ kʌmʌŋ 'diamond' ka PreFigure.

prefigure-marker-style-unsupported = { $subject }: PreFigure kʌ bata kʌmʌŋ ka kʌmark '{ $markerStyle }' bɔm; ma bay kʌmʌŋ kʌ na pʌ.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` kʌ bana bɔm; ma bata target bɔm. Ma bɔth annotation.

annotation-ref-multiple-targets = `<annotation>`: `ref` kʌ nəŋ tʌtarget tʌbana; ma bay kʌ kʌtəŋ.

annotation-ref-outside-graph = `<annotation>`: `ref` kʌ bana bɔm; target kʌ na ka kʌgbɔn ka graph. Ma bɔth annotation.

annotation-ref-unsupported-target = `<annotation>`: `ref` kʌ bana bɔm; target kʌ bana kʌbʌŋ ka kʌmisal kʌ prefigure kʌ bata bɔm. Ma bɔth annotation.

annotation-text-missing = `<annotation>`: `text` kʌ na bɔm ɔ kʌ na kəm bɔm; ma sɔŋ ʌŋkəre ka kəm bɔm.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ma bata kʌnəŋ ka tʌkərəŋ.
       *[other] Ma bata kʌnəŋ ka tʌkərəŋ na kʌbʌŋ `<{ $componentType }>`.
    }

reference-no-referent = Ma bata kəm bɔm ka kʌnəŋ: `{ $reference }`

reference-multiple-referents = Ma bata tʌbʌŋ tʌbana ka kʌnəŋ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ʌŋbay ka attribute { $attribute } ka `<{ $componentType }>` kʌ bana bɔm.

children-invalid = Tʌwan tʌ `<{ $componentType }>` tʌ bana bɔm: Ma bata tʌwan tʌ bana bɔm: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ʌŋbʌŋ `{ $value }` kʌ bana bɔm ka attribute `{ $attribute }`, ma bay `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ma bata DoenetML version { $version } bɔm.
       *[other] Ma bata DoenetML version { $version } bɔm. Ma bay version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML kʌ bana bɔm: { $content }

parse-tag-missing-close-tag = DoenetML kʌ bana bɔm: Tag `{ $tag }` kʌ na tag ka kʌkanti bɔm. Ma mɔŋ tag kʌ kanti kʌpəŋ ɔ tag `</{ $tagName }>`.

parse-tag-error = DoenetML kʌ bana bɔm: Kʌwuni ka tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML kʌ bana bɔm: Attribute `{ $attribute }` kʌ bana bɔm, kʌ yira kʌ na ʌŋbʌŋ bɔm.

parse-attribute-invalid = DoenetML kʌ bana bɔm: Attribute `{ $attribute }` kʌ bana bɔm

parse-attribute-value-invalid = DoenetML kʌ bana bɔm: Ʌŋbʌŋ ka attribute `{ $value }` kʌ bana bɔm

parse-attribute-value-quote-mismatch = DoenetML kʌ bana bɔm: Ʌŋbʌŋ ka attribute `{ $value }` kʌ bana bɔm. Tʌmark tʌ kwot tʌ nɔŋ bɔm. Kʌ yira kʌ `{ $quote }` kʌ na bɔm

parse-open-tag-name-missing = DoenetML kʌ bana bɔm: Ma bata tag kʌ na ʌŋes bɔm, kʌ `<`

parse-tag-not-closed = DoenetML kʌ bana bɔm: Ma kanti tag `{ $tag }` bɔm (kʌ yira kʌ `>` kʌ na bɔm).

parse-self-closing-tag-name-missing = DoenetML kʌ bana bɔm: Ma bata tag kʌ na ʌŋes bɔm `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML kʌ bana bɔm: Ma kanti tag `{ $tag }` bɔm (kʌ yira kʌ `/>` kʌ na bɔm).

parse-tag-invalid-attributes = DoenetML kʌ bana bɔm: Tag `{ $tag }` kʌ bana bɔm. Kʌ na tʌattribute tʌ bana bɔm.

parse-close-tag-name-missing = DoenetML kʌ bana bɔm: Ma bata tag ka kʌkanti kʌ na ʌŋes bɔm, kʌ `</`

parse-attribute-value-unquoted = Tʌbʌŋ tʌ attribute tʌ fɔ na ka rɔ tʌkwot: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML kʌ bana bɔm: Ma bata tag ka kʌkanti `{ $tag }`, kɛrɛ tag ka kʌtuli kʌ na bɔm

parse-close-tag-mismatched = DoenetML kʌ bana bɔm: Tag ka kʌkanti kʌ nɔŋ bɔm. Ma mɔŋ `</{ $expected }>`. Ma bata `{ $found }`

parser-node-unconvertible = Ma firi node { $node } kʌ node ka Dast bɔm.

## Names

name-attribute-invalid =
    Attribute name='{ $name }' kʌ bana bɔm. { $reason ->
        [characters] Ʌŋes kʌ na tʌmark, tʌnamba, tʌandaskɔ ɔ tʌdash dɔm.
       *[start] Ʌŋes kʌ fɔ təŋ na kʌmark.
    }

component-name-invalid-start = Ʌŋes ka kʌbʌŋ "{ $name }" kʌ bana bɔm. Ʌŋes kʌ fɔ təŋ na kʌmark.

## `<answer>` sugar

answer-video-watched-missing-video = Answer ka type videoWatched kʌ fɔ na video attribute

answer-video-watched-video-not-reference = Answer ka type videoWatched kʌ fɔ na video attribute kʌ bana kʌnəŋ

answer-name-not-single-text = Answer name attribute kʌ fɔ na kʌwan ka text kʌrɔŋ dɔm

## Referencing another document

external-doenetml-recursion-limit = Ma bata DoenetML ka kʌgbɔn bɔm bɛkɔs tʌripit tʌ bana tʌbana. Kʌnəŋ ka tʌkərəŋ kʌ na?

external-doenetml-unavailable = Ma bata DoenetML ka { $attribute }="{ $uri }" bɔm

external-doenetml-type-mismatch = DoenetML kʌ ma bata ka { $attribute }="{ $uri }" kʌ bana bɔm: kʌ nɔŋ bɔm na kʌmʌŋ ka kʌbʌŋ "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` kʌ kɔmɔ; bay `{ $to }`.
       *[other] [deprecation] Attribute `{ $from }` ka `<{ $component }>` kʌ kɔmɔ; bay `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` kʌ kɔmɔ na ma bɔth kʌ bɛkɔs `{ $to }` kʌ na tʌpəŋ.
       *[other] [deprecation] Attribute `{ $from }` ka `<{ $component }>` kʌ kɔmɔ na ma bɔth kʌ bɛkɔs `{ $to }` kʌ na tʌpəŋ.
    }

deprecated-attribute-ignored = [deprecation] Attribute `{ $attribute }` ka `<{ $component }>` kʌ kɔmɔ na ma bɔth kʌ.

deprecated-attribute-to-child = [deprecation] Attribute `{ $attribute }` ka `<{ $component }>` kʌ kɔmɔ; bay kʌwan `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Ʌŋbʌŋ `{ $value }` ka attribute `{ $attribute }` ka `<{ $component }>` kʌ kɔmɔ; bay `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` kʌ bay Inglish tʌbana dɔm, kʌ dəni ʌŋkəre kʌ mʌ sɔŋ kʌ ka kʌbuk kʌ ma sɔŋ ka { $locale }. Sɔŋ ʌŋbay ka tʌbana kʌpəŋ, ɔ bay kʌ na `pluralForm` attribute.


## Checking against the schema

schema-element-unrecognized = Kʌbʌŋ `<{ $tag }>` kʌ bana kʌbʌŋ ka Doenet kʌ ma bata bɔm.

schema-element-not-allowed-at-root = Ma yifi kʌbʌŋ `<{ $tag }>` ka kʌtɔŋ ka kʌbuk bɔm.

schema-element-not-allowed-inside = Ma yifi kʌbʌŋ `<{ $tag }>` ka rɔ `<{ $parent }>` bɔm.

schema-attribute-unrecognized = Kʌbʌŋ `<{ $tag }>` kʌ na attribute kʌ na ʌŋes `{ $attribute }` bɔm.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attribute `{ $attribute }` ka kʌbʌŋ `<{ $tag }>` kʌ fɔ bana kʌlist kʌ tʌbʌŋ tʌ rɔ tʌ bana kʌrɔŋ ka: { $allowed }
       *[other] Attribute `{ $attribute }` ka kʌbʌŋ `<{ $tag }>` kʌ fɔ bana kʌrɔŋ ka: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ʌŋes ka kʌmʌŋ ka select kʌ bana bɔm.  Ʌŋes ka kʌmʌŋ { $variantName } kʌ yira ka option { $numOptions } kɛrɛ ʌŋnamba ka kʌfen kʌ bana { $numToSelect }.

select-variant-name-without-options = Tʌmʌŋ tʌbʌŋ tʌ sɔŋɔ ka select kɛrɛ option kʌ sɔŋɔ bɔm ka ʌŋes ka kʌmʌŋ: { $variantName }.

select-variant-name-not-possible = Ʌŋes ka kʌmʌŋ { $variantName } kʌ ma sɔŋɔ ka select kʌ bana ʌŋes ka kʌmʌŋ kʌ paŋth bɔm.

select-too-few-options = Ma fen tʌbʌŋ { $numToSelect } ka { $numOptions } dɔm bɔm.

select-from-sequence-too-few-values = Ma fen tʌbʌŋ { $numToSelect } ka sequence ka ʌŋtɔŋ { $length } bɔm.

select-from-sequence-indices-count-mismatch = Ʌŋnamba ka indices tʌ ma sɔŋɔ ka select kʌ fɔ nɔŋ na ʌŋnamba ka kʌfen

select-from-sequence-indices-not-integers = Indices tʌpəŋ tʌ ma sɔŋɔ ka select tʌ fɔ bana tʌnamba tʌpəŋ

select-from-sequence-index-excluded = Index ka selectfromsequence kʌ ma bɔth kʌ sɔŋɔ

select-from-sequence-indices-excluded-combination = Indices tʌ selectfromsequence tʌ bana kʌthɔfi kʌ ma bɔth tʌ sɔŋɔ

select-from-sequence-coprime-not-positive-integers = Ma fen tʌthɔfi tʌ coprime bɔm bɛkɔs ma fen tʌnamba tʌpəŋ tʌ pas ziro bɔm.

select-from-sequence-coprime-common-factor = Ma fen tʌnamba tʌ coprime bɔm. Tʌbʌŋ tʌpəŋ tʌ na faktɔ kʌrɔŋ. (Tʌbʌŋ tʌ "from" ɔ "to" tʌ fɔ bana coprime na "step".)

select-from-sequence-coprime-single-number = Ma fen tʌthɔfi tʌ coprime ka ʌŋnamba kʌrɔŋ kʌ bana 1 bɔm bɔm.

select-from-sequence-excluded-too-many-combinations = Ma bɔth tʌthɔfi tʌ pas 70% ka selectFromSequence

select-from-sequence-coprime-none-found = Ma fen tʌnamba tʌ coprime bɔm. Tʌbʌŋ tʌpəŋ tʌ na faktɔ kʌrɔŋ.

select-from-sequence-too-few-unique-values = Ma fen tʌbʌŋ tʌbʌŋ { $numToSelect } ka sequence ka ʌŋtɔŋ { $numPossibleValues } bɔm

select-prime-numbers-too-few-values = Ma fen tʌbʌŋ { $numToSelect } ka kʌlist ka tʌpraym ka ʌŋtɔŋ { $numValues } bɔm

select-prime-numbers-values-count-mismatch = Ʌŋnamba ka tʌbʌŋ tʌ ma sɔŋɔ ka select kʌ fɔ nɔŋ na ʌŋnamba ka kʌfen

select-prime-numbers-values-not-prime = Tʌbʌŋ tʌpəŋ tʌ ma sɔŋɔ ka select prime number tʌ fɔ na ka kʌlist ka tʌpraym

select-prime-numbers-values-excluded-combination = Tʌbʌŋ tʌ ma sɔŋɔ ka selectPrimeNumbers tʌ bana kʌthɔfi kʌ ma bɔth

select-prime-numbers-excluded-too-many-combinations = Ma bɔth tʌthɔfi tʌ pas 70% ka selectPrimeNumbers

select-random-combination-fluke = Ka kʌbʌŋ kʌ paŋth bɔm, ma fen kʌthɔfi ka tʌbʌŋ tʌbʌŋ bɔm

select-random-value-fluke = Ka kʌbʌŋ kʌ paŋth bɔm, ma fen ʌŋbʌŋ kʌbʌŋ bɔm
