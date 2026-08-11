# Kabiyè diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] pakpaɣ { $attributes } falaa ye pɔyɔɔdɩ tɛmtʋ naalɛ yɔ
       *[other] pakpaɣ { $attributes } falaa ye pɔyɔɔdɩ tɛmtʋ naalɛ yɔ
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] pakpaɣ { $attributes } falaa ye pɔyɔɔdɩ tɛmtʋ nɛ hɛkʋ taa yɔ
       *[other] pakpaɣ { $attributes } falaa ye pɔyɔɔdɩ tɛmtʋ nɛ hɛkʋ taa yɔ
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ɛɛlakɩ tʋmɩyɛ ye hɛkʋ taa fɛyɩ yɔ

## `<line>`

line-points-undetermined-dimensions = Ñɔʋ ŋgʋ kɩɖɛɣ yʋsasɩ nzɩ sɩ-ɖaɣlɩkɩŋ patɩna yɔ sɩ-yɔɔ yɔ.

line-points-too-few-dimensions = Pɩwɛɛ se ñɔʋ ɛɖɛɛ yʋsasɩ nzɩ sɩwɛnɩ ɖaɣlɩkɩŋ naalɛ nɛ pɩɖɛɛnɩ ɛzɩma yɔ sɩ-yɔɔ.

line-points-depend-on-variables = Ñɔʋ ɖɛɣ yʋsasɩ nzɩ sɩñɔtɩnɩ lɛɣzɩtʋ yɔ sɩ-yɔɔ: { $variables }.

line-equation-invalid-format = Ñɔʋ ekwasɩyɔŋ wɛtʋ tɩtʋʋzɩ { $variable1 } nɛ { $variable2 } taa.

## `<ray>`

ray-overprescribed-through = Pɔyɔɔdɩ mintʋsʋʋ nɛ through, endpoint nɛ direction.  Pakpaɣ through weyi pɔyɔɔdaa yɔ falaa.

ray-dimension-mismatch = numDimensions tɩmaɣ mintʋsʋʋ taa.

## `<vector>`

vector-overprescribed-head = Pɔyɔɔdɩ vɛktɛɛrɩ nɛ head, tail nɛ displacement.  Pakpaɣ head weyi pɔyɔɔdaa yɔ falaa.

vector-dimension-mismatch = numDimensions tɩmaɣ vɛktɛɛrɩ taa.

## Attracting and constraining

attract-to-without-nearest-point = Paapɩzɩɣ pahɔɔ `<{ $component }>` yɔɔ mbʋ pʋyɔɔ yɔ ɛfɛyɩnɩ nearestPoint.

constrain-to-without-nearest-point = Paapɩzɩɣ pahɔkɩ `<{ $component }>` yɔɔ mbʋ pʋyɔɔ yɔ ɛfɛyɩnɩ nearestPoint.

constrain-to-interior-without-nearest-point = Paapɩzɩɣ pahɔkɩ `<{ $component }>` taa mbʋ pʋyɔɔ yɔ ɛfɛyɩnɩ nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = pakpaɣ labelPosition falaa choiceInput weyi ɛtɩkɛ inline yɔ ɛ-yɔɔ

## Ordering children by index

choice-input-indices-count-mismatch = Pakpaɣ indices wena pɔyɔɔdɩ choiceInput yɔɔ yɔ falaa mbʋ pʋyɔɔ yɔ indices ɖɔʋ tɩmaɣ nɛ choice piya ɖɔʋ.

pretzel-indices-count-mismatch = Pakpaɣ indices wena pɔyɔɔdɩ problem yɔɔ yɔ falaa mbʋ pʋyɔɔ yɔ indices ɖɔʋ tɩmaɣ nɛ problem piya ɖɔʋ.

shuffle-indices-count-mismatch = Pakpaɣ indices wena pɔyɔɔdɩ shuffle yɔɔ yɔ falaa mbʋ pʋyɔɔ yɔ indices ɖɔʋ tɩmaɣ nɛ pʋyʋ ɖɔʋ.

indices-ignored-out-of-range = Pakpaɣ indices wena pɔyɔɔdɩ { $component } yɔɔ yɔ falaa mbʋ pʋyɔɔ yɔ nasɩyɩ wɛ awayɩ.

pretzel-indices-repeated = Pakpaɣ indices wena pɔyɔɔdɩ pretzel yɔɔ yɔ falaa mbʋ pʋyɔɔ yɔ nasɩyɩ tasɩ.

pretzel-circuit-first-index = Pakpaɣ indices wena pɔyɔɔdɩ pretzel yɔɔ mode="circuit" taa yɔ falaa mbʋ pʋyɔɔ yɔ index kajalaɣ ñɩŋgʋ pɩwɛɛ se kɩkɛ 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Se `<{ $component }>` ɛla tʋmɩyɛ nɛ string piya lɛ, pɩwɛɛ se pɔyɔɔdɩ `type` attribute.

invalid-type-defaulting-to-math = Type { $type } tɩtʋʋzɩ { $component } yɔɔ. Pɩwɛɛ se kɩkɛ math, text, number yaa boolean. Paɖʋ math.

string-not-valid-component-to-arrange = String "{ $value }" tɩkɛ pʋyʋ kɩbaŋʋ { $component } yɔɔ. Pakpakɩ-kʋ falaa.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } tɩtʋʋzɩ, paɖʋ type number.

invalid-variable-value = Lɛɣzɩtʋ pʋyʋ tɩtʋʋzɩ: `{ $value }`

## Variants

variant-index-must-be-number = Wɛtʋ index { $index } pɩwɛɛ se kɩkɛ ɖɔʋ

variant-index-must-be-integer = Wɛtʋ index { $index } pɩwɛɛ se kɩkɛ ɖɔʋ kʋmʋʋ

## `<sideBySide>`

side-by-side-absolute-widths = Patɩla `<{ $component }>` maɣzɩm kʋmʋʋ yɔɔ. Paɖʋ walanzɩ ɛzɩ maɣzɩm lɛɛkʋ.

side-by-side-absolute-margins = Patɩla `<{ $component }>` maɣzɩm kʋmʋʋ yɔɔ. Paɖʋ kamasɩ ɛzɩ maɣzɩm lɛɛkʋ.

side-by-side-no-block-child = `<{ $component }>` tɩtʋʋzɩ: pɩwɛɛ se ɛwɛɛnɩ block pɩɣa kʋɖʋmaɣ nɛ pɩɖɛɛnɩ ɛzɩma.

## `<label>`

label-for-ignored-on-graphical = Pakpaɣ `for` attribute kɩlɛmʋʋ `<label>` yɔɔ yɔ falaa.

label-for-must-resolve-to-one = `for` attribute `<label>` yɔɔ pɩwɛɛ se kɩwolo pʋyʋ kʋɖʋm yɔɔ.

label-for-unresolved = `for` attribute `<label>` yɔɔ tɩpɩzɩ nɛ kɩwolo pʋyʋ nɔɔyʋ yɔɔ.

label-for-answer-with-authored-inputs = `for` attribute `<label>` yɔɔ yɔɔdʋʋ `<answer>` weyi ɛwɛnɩ input weyi pama yɔ; yɔɔdɩ input yɔɔ kpaagbaa.

label-for-answer-without-input = `for` attribute `<label>` yɔɔ yɔɔdʋʋ `<answer>` weyi ɛfɛyɩnɩ input yɔ.

label-for-must-reference-input-or-answer = `for` attribute `<label>` yɔɔ pɩwɛɛ se kɩyɔɔdɩ input yaa answer yɔɔ.

## Accessibility

accessibility-short-description-or-decorative = Talʋʋ yɔɔ lɛ, pɩwɛɛ se `<{ $component }>` ɛwɛɛnɩ tɔbʋʋ kɩcɛkʋʋ yaa se pɔyɔɔdɩ se ɛkɛ decorative.

accessibility-video-short-description = Talʋʋ yɔɔ lɛ, pɩwɛɛ se `<video>` ɛwɛɛnɩ tɔbʋʋ kɩcɛkʋʋ.

accessibility-input-short-description-or-label = Talʋʋ yɔɔ lɛ, pɩwɛɛ se `<{ $component }>` ɛwɛɛnɩ tɔbʋʋ kɩcɛkʋʋ yaa hɩɖɛ.

accessibility-answer-input-short-description-or-label = Talʋʋ yɔɔ lɛ, pɩwɛɛ se `<answer>` weyi ɛlakɩ input yɔ ɛwɛɛnɩ tɔbʋʋ kɩcɛkʋʋ yaa hɩɖɛ.

accessibility-short-description-contains-math = Tɔbʋʋ kɩcɛkʋʋ ɛtaawɛɛnɩ maɣzɩm pʋyʋ ɛzɩ `<{ $component }>`. Ma maɣzɩm nɛ tɔm.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } fɛyɩnɩ lɛɣzɩtʋ ndʋ tɩmaɣ yɔ hɔɔlʋʋ ñʋʋ tɔm yɔɔ (mode kɩlʋmʋʋ) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pɩpɔzʋʋ { $threshold }:1 nɛ pɩɖɛɛnɩ ɛzɩma).
       *[other] { $colorName } fɛyɩnɩ lɛɣzɩtʋ ndʋ tɩmaɣ yɔ hɔɔlʋʋ ñʋʋ tɔm yɔɔ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pɩpɔzʋʋ { $threshold }:1 nɛ pɩɖɛɛnɩ ɛzɩma).
    }

## `<circle>`

circle-through-points-non-numerical = Patɩla `<circle>` ŋgʋ kɩɖɛɣ yʋsasɩ { $count } yɔɔ yɔ alɩwaatʋ ndʋ yʋsasɩ sɩfɛyɩnɩ ɖɔʋ yɔ.

circle-too-many-through-points = Paapɩzɩɣ pamaɣzɩ kpelaɣ ŋga kaɖɛɣ yʋsasɩ 3 yɔɔ nɛ pɩɖɛɛnɩ ɛzɩma yɔ.

circle-overprescribed-radius-center-points = Paapɩzɩɣ pamaɣzɩ kpelaɣ nɛ radius, hɛkʋ taa nɛ yʋsasɩ tɩŋa.

circle-center-with-multiple-points = Paapɩzɩɣ pamaɣzɩ kpelaɣ nɛ hɛkʋ taa ŋga kaɖɛɣ yʋsaɣ 1 yɔɔ nɛ pɩɖɛɛnɩ ɛzɩma yɔ.

circle-radius-too-small = Paapɩzɩɣ pamaɣzɩ kpelaɣ: ɛzɩma poliŋ ŋgʋ kɩwɛ yʋsasɩ naalɛ hɛkʋ taa yɔ kɩkɛ { $distance } yɔ, radius { $radius } weyi pɔyɔɔdaa yɔ ɛpɩŋ pɩdɩɩfɛyɩ.

circle-radius-with-many-points = Paapɩzɩɣ pala kpelaɣ ŋga kaɖɛɣ yʋsasɩ naalɛ yɔɔ nɛ pɩɖɛɛnɩ ɛzɩma nɛ radius weyi pɔyɔɔdaa yɔ.

circle-invalid-center-or-through-points = Kpelaɣ hɛkʋ taa yaa ka-yʋsasɩ tɩtʋʋzɩ.

circle-radius-center-with-multiple-points = Paapɩzɩɣ pamaɣzɩ kpelaɣ radius nɛ hɛkʋ taa ŋga kaɖɛɣ yʋsaɣ 1 yɔɔ nɛ pɩɖɛɛnɩ ɛzɩma yɔ.

circle-change-radius-non-numerical = Paapɩzɩɣ palɛɣzɩ kpelaɣ radius nɛ yʋsasɩ nzɩ sɩfɛyɩnɩ ɖɔʋ yɔ

circle-radius-with-points-non-numerical = Paapɩzɩɣ pala kpelaɣ ŋga kaɖɛɣ yʋsaɣ kʋɖʋmaɣ yɔɔ nɛ pɩɖɛɛnɩ ɛzɩma nɛ radius alɩwaatʋ ndʋ ɖɔʋ fɛyɩ yɔ.

circle-change-center-non-numerical = Patɩla kpelaɣ hɛkʋ taa lɛɣzʋʋ ŋga kaɖɛɣ yʋsasɩ nzɩ sɩfɛyɩnɩ ɖɔʋ yɔ sɩ-yɔɔ yɔ.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ɖaɣlɩkɩŋ tɩmaɣ fɔŋksɩyɔŋ domain yɔɔ. Domain wɛnɩ alɩwaatʋ { $intervals } ɛlɛ fɔŋksɩyɔŋ wɛnɩ { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        }.
       *[other] Ɖaɣlɩkɩŋ tɩmaɣ fɔŋksɩyɔŋ domain yɔɔ. Domain wɛnɩ alɩwaatʋ { $intervals } ɛlɛ fɔŋksɩyɔŋ wɛnɩ { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        }.
    }

function-domain-invalid-format = Fɔŋksɩyɔŋ domain wɛtʋ tɩtʋʋzɩ.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Pakpakɩ fɔŋksɩyɔŋ sɔsɔʋ ŋgʋ kɩfɛyɩnɩ ɖɔʋ yɔ falaa.
        [minimum] Pakpakɩ fɔŋksɩyɔŋ pɩŋʋʋ ŋgʋ kɩfɛyɩnɩ ɖɔʋ yɔ falaa.
        [extremum] Pakpakɩ fɔŋksɩyɔŋ tɛmtʋ ndʋ tɩfɛyɩnɩ ɖɔʋ yɔ falaa.
        [point] Pakpakɩ fɔŋksɩyɔŋ yʋsaɣ ŋga kafɛyɩnɩ ɖɔʋ yɔ falaa.
        [slope] Pakpakɩ fɔŋksɩyɔŋ hɔɔlʋʋ ŋgʋ kɩfɛyɩnɩ ɖɔʋ yɔ falaa.
       *[other] Pakpakɩ fɔŋksɩyɔŋ { $type } ŋgʋ kɩfɛyɩnɩ ɖɔʋ yɔ falaa.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Pakpakɩ fɔŋksɩyɔŋ sɔsɔʋ ŋgʋ kɩfɛyɩ yɔ falaa.
        [minimum] Pakpakɩ fɔŋksɩyɔŋ pɩŋʋʋ ŋgʋ kɩfɛyɩ yɔ falaa.
        [extremum] Pakpakɩ fɔŋksɩyɔŋ tɛmtʋ ndʋ tɩfɛyɩ yɔ falaa.
        [point] Pakpakɩ fɔŋksɩyɔŋ yʋsaɣ ŋga kafɛyɩ yɔ falaa.
       *[other] Pakpakɩ fɔŋksɩyɔŋ { $type } ŋgʋ kɩfɛyɩ yɔ falaa.
    }

function-points-too-close = Fɔŋksɩyɔŋ wɛnɩ yʋsasɩ naalɛ nzɩ sɩñɔtɩnɩ ɖama pɩdɩɩfɛyɩ yɔ. Paapɩzɩɣ pɛcɛlɩ fɔŋksɩyɔŋ tɔbʋʋ.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Fɔŋksɩyɔŋ tasʋʋ pɩzɩɣ pɩla ɖeke ye input ɖɔʋ nɛ output ɖɔʋ pɛkɛ kʋɖʋm yɔ. Fɔŋksɩyɔŋ kʋnɛ kɩwɛnɩ input { $inputs } nɛ { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        }.
       *[other] Fɔŋksɩyɔŋ tasʋʋ pɩzɩɣ pɩla ɖeke ye input ɖɔʋ nɛ output ɖɔʋ pɛkɛ kʋɖʋm yɔ. Fɔŋksɩyɔŋ kʋnɛ kɩwɛnɩ input { $inputs } nɛ { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Sequence ɖaɣlɩkɩŋ tɩtʋʋzɩ.  Pɩwɛɛ se pɩkɛ ɖɔʋ kʋmʋʋ ŋgʋ kɩtɩpɩsɩ kɩtɛɛ ziro yɔ.

sequence-invalid-step = Sequence step tɩtʋʋzɩ.  Pɩwɛɛ se pɩkɛ ɖɔʋ sequence type { $type } yɔɔ.

sequence-invalid-endpoint-number = Number sequence "{ $attribute }" tɩtʋʋzɩ.  Pɩwɛɛ se pɩkɛ ɖɔʋ.

sequence-invalid-endpoint-letters = Letters sequence "{ $attribute }" tɩtʋʋzɩ.  Pɩwɛɛ se pɩkɛ masɩ kpɛndʋʋ.

sequence-invalid-endpoint = Sequence "{ $attribute }" tɩtʋʋzɩ.

select-from-sequence-coprime-not-numbers = pakpakɩ coprime falaa mbʋ pʋyɔɔ yɔ paalɩzɩɣ ɖɔʋ

select-from-sequence-coprime-with-exclude-combinations = pakpakɩ coprime falaa mbʋ pʋyɔɔ yɔ pɔyɔɔdɩ excludeCombinations

## Resolving a `target`

target-not-found = `<{ $source }>` target tɩtʋʋzɩ: paapɩzɩɣ pana target.

target-state-variable-not-found = `<{ $source }>` target tɩtʋʋzɩ: paapɩzɩɣ pana stet lɛɣzɩtʋ ndʋ tɩ-hɩɖɛ lɛ "{ $property }" yɔ `<{ $component }>` yɔɔ.

## `<odeSystem>`

ode-system-variables-match-independent = Pɩwɛɛ se `<odeSystem>` lɛɣzɩtʋ ɛtaakɛ lɛɣzɩtʋ ndʋ tɩwɛ tɩ-ɖeke yɔ.

ode-system-duplicate-variable-names = Paapɩzɩɣ pɛcɛlɩ ODE RHS fɔŋksɩyɔŋ tɔbʋʋ nɛ lɛɣzɩtʋ hɩla wena atasɩ yɔ.

ode-system-rhs-function-error = Paapɩzɩɣ pɛcɛlɩ ODE RHS fɔŋksɩyɔŋ tɔbʋʋ.  Kɩwɛɛkɩm wɛ mathjs fɔŋksɩyɔŋ labʋ taa.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Paapɩzɩɣ pɛcɛlɩ ñɔŋ { $count } hɛkʋ taa kɔɔnaɣ tɔbʋʋ

angle-invalid-through-point = Yʋsaɣ tɩtʋʋzɩ `<angle>` through taa

parabola-vertex-too-many-points = Patɩla parabolɩ nɛ vertex ŋgʋ kɩɖɛɣ yʋsaɣ 1 yɔɔ nɛ pɩɖɛɛnɩ ɛzɩma yɔ.

parabola-too-many-points = Patɩla parabolɩ ŋgʋ kɩɖɛɣ yʋsasɩ 3 yɔɔ nɛ pɩɖɛɛnɩ ɛzɩma yɔ.

intersection-too-many-items = Patɩla pʋyʋ naalɛ nɛ pɩɖɛɛnɩ ɛzɩma pɔ-kpɛndʋʋ

## Other math components

ionic-compound-not-two-ions = Patɩla iyɔŋ kpɛndʋʋ pʋyʋ lɛɛbʋ yɔɔ ye pɩtɩkɛ iyɔŋ naalɛ yɔ.

ionic-compound-needs-cation-and-anion = Pala iyɔŋ kpɛndʋʋ katiyɔŋ kʋɖʋm nɛ aniyɔŋ kʋɖʋm ɖeke pɔ-yɔɔ.

solve-equations-cannot-evaluate = Paapɩzɩɣ pɔcɔnɩ ekwasɩyɔŋ mbʋ pʋyɔɔ yɔ paapɩzɩɣ pamaɣzɩ-kʋ: { $equation }

math-operators-operand-number-required = Pɩwɛɛ se pɔyɔɔdɩ operandNumber alɩwaatʋ ndʋ palɩzɩɣ maɣzɩm operand yɔ.

eigen-decomposition-failed = Paapɩzɩɣ pamaɣzɩ matrisɩ aygɛnvaluu

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } fɛyɩ kɩɖaʋ taa, pʋyɔɔ ɛmaɣ nɛ falaa paa ɛzɩmtaa.
       *[other] `<matchesPattern>`: parameter { $parameters } fɛyɩ kɩɖaʋ taa, pʋyɔɔ pamaɣ nɛ falaa paa ɛzɩmtaa.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: paapɩzɩɣ pana grid="{ $grid }" tɔbʋʋ. Pɩwɛɛ se pɩkɛ none, medium, dense, yaa ɖɔʋ naalɛ sɔsɔŋ weyi lone kaɣ-wɛ yɔ, ɛzɩ grid="1 0.5". Paalakɩ grid nakʋyʋ.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ɛɛlakɩ tʋmɩyɛ prefigure wɩlɩyʋ taa; palakɩnɩ nɩwaŋ hɔɔlʋʋ.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ɛɛlakɩ tʋmɩyɛ prefigure wɩlɩyʋ taa; palakɩnɩ ɖoo hɔɔlʋʋ.

prefigure-invalid-axis-bounds = `<graph>`: aksɩ kamasɩ tɩtʋʋzɩ prefigure yɔɔ; palakɩnɩ bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: walanzɩ tɩtʋʋzɩ prefigure yɔɔ; palakɩnɩ walanzɩ 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio tɩtʋʋzɩ prefigure yɔɔ; palakɩnɩ aspɛkɩ 1.

prefigure-grid-spacing-too-fine = `<graph>`: grid hɛkʋ pɩŋ pɩdɩɩfɛyɩ aksɩ kamasɩ yɔɔ; palɩzɩ grid prefigure wɩlɩyʋ taa.

prefigure-annotations-not-rendered = `<graph>`: paawɩlɩɣ annotations ye paalakɩnɩ PreFigure wɩlɩyʋ yɔ.

multiple-annotations-children = Pana `<annotations>` piya sakɩyɛ `<graph>` taa; pakpakɩ tɩŋa falaa nɛ pɩtalɩ kɛdɛzaɣ ñɩŋga.

## Referring to other components

copy-unrecognized-component-type = Paapɩzɩɣ palɩzɩ yaa pama pʋyʋ wɛtʋ ndʋ patɩna yɔ: { $type }.

copy-prop-not-found = Paapɩzɩɣ pana prop { $property } pʋyʋ wɛtʋ { $component } yɔɔ

collect-no-source = Patɩna lɩʋ collect yɔɔ.

collect-invalid-component-type = Paapɩzɩɣ pakpɛndɩ pʋyʋ wɛtʋ `<{ $component }>` mbʋ pʋyɔɔ yɔ wɛtʋ tɩtʋʋzɩ.

reference-index-unavailable = Paapɩzɩɣ pɔyɔɔdɩ index `{ $reference }` yɔɔ

## `<callAction>`

component-action-unavailable = Paapɩzɩɣ payaa { $action } pʋyʋ `{ $reference }` yɔɔ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Data wɛtʋ tɩtʋʋzɩ.  Ñɔŋ wɛnɩ ɖaɣlɩkɩŋ ndɩ ndɩ. Pana-pʋ componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data wɛnɩ kolonjɩ hɩla wena atasɩ yɔ.  Pana-pʋ componentIdx :{ $componentIdx }

data-frame-missing-column-name = Kolonjɩ hɩɖɛ naɖɩyɛ fɛyɩ data taa.  Pana-pʋ componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Cosuu kʋnɛ kɩ-award sɩŋnɩ answer tag ɛ-maɣmaɣ ɛ-cosuu ŋgʋ patiyaa yɔ kɩ-yɔɔ, nɛ mbʋ kaɣnɩ kɔnʋʋ kʋñɔŋ ŋgʋ ŋtɩɖaŋ-kʋ yɔ.

answer-max-num-attempts-in-section-wide-check-work = Ye ŋɖʋ `maxNumAttempts` `<answer>` weyi ɛwɛ pʋyʋ ŋgʋ kɩwɛnɩ `sectionWideCheckWork` yɔ kɩ-taa yɔ ɛ-yɔɔ, ɛɛlakɩ tʋmɩyɛ, mbʋ pʋyɔɔ yɔ pʋyʋ ŋgʋ kɩ-tɩnɩ maɣzʋʋ ɖɔʋ. Ɖʋ `maxNumAttempts` pʋyʋ ŋgʋ kɩ-yɔɔ.

nested-section-wide-check-work-max-num-attempts = Ye ŋɖʋ `maxNumAttempts` pʋyʋ ŋgʋ kɩwɛnɩ `sectionWideCheckWork` nɛ kɩwɛ pʋyʋ lɛɛkʋ ŋgʋ kɩwɛnɩ `sectionWideCheckWork` yɔ kɩ-taa yɔ kɩ-yɔɔ, kɩɩlakɩ tʋmɩyɛ, mbʋ pʋyɔɔ yɔ awayɩ pʋyʋ tɩnɩ maɣzʋʋ ɖɔʋ. Ɖʋ `maxNumAttempts` awayɩ pʋyʋ yɔɔ.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] { $attributes } attribute ɛɛlakɩ tʋmɩyɛ ye patɩɖʋ symbolicEquality yɔ.
       *[other] { $attributes } attribute ɛɛlakɩ tʋmɩyɛ ye patɩɖʋ symbolicEquality yɔ.
    }

answer-invalid-type = Cosuu type tɩtʋʋzɩ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ɛzɩma pʋyʋ `<{ $component }>` fɛyɩnɩ hɩɖɛ yɔ, paapɩzɩɣ palakɩnɩ-kʋ module attribute

module-attribute-name-already-defined = Paapɩzɩɣ palakɩnɩ pʋyʋ `<{ $component } name="{ $name }">` module attribute mbʋ pʋyɔɔ yɔ `<module>` tɛm wɛnʋʋ "{ $name }" attribute.

conditional-content-condition-ignored = Pakpakɩ `condition` attribute falaa `<conditionalContent>` weyi ɛwɛnɩ case yaa else piya yɔ ɛ-yɔɔ.

slider-markers-type-mismatch = Markers type tɩmaɣ nɛ slider type.

pretzel-problem-needs-statement-and-answer = Pretzel tɩtʋʋzɩ: pɩwɛɛ se paa `<problem>` weyi lɛ ɛwɛɛnɩ `<statement>` kʋɖʋm nɛ `<answer>` kʋɖʋm.

pretzel-circuit-first-problem-distractor = Pretzel tɩtʋʋzɩ: mode="circuit" taa lɛ, kajalaɣ `<problem>` ɛɛpɩzɩɣ ɛkɛ distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Pʋyʋ { $values } tɩtʋʋzɩ attribute `{ $attribute }` yɔɔ; pakpakɩ-kʋ falaa.
       *[other] Pʋyʋ { $values } tɩtʋʋzɩ attribute `{ $attribute }` yɔɔ; pakpakɩ-wɛ falaa.
    }

attribute-must-be-references = Pʋyʋ `{ $value }` tɩtʋʋzɩ attribute `{ $attribute }` yɔɔ. Pɩwɛɛ se attribute ɛkɛ nʋmɔŋ weyi ɩpaɣzɩɣnɩ `$` yɔ.

math-input-invalid-function-names = <mathInput>: pakpaɣ fɔŋksɩyɔŋ hɩla wena atɩtʋʋzɩ yɔ falaa { $attribute } taa: { $names }. Pɩwɛɛ se paa hɩɖɛ nɖɩ ɖɩ-wɩlʋʋ hɔɔlʋʋ ɛwɛɛnɩ masɩ 2 nɛ pɩɖɛɛnɩ ɛzɩma (masɩ yaa kamasɩ); `|<mathspeak alternative>` pɩzɩɣ pɩtɩŋ pɩ-wayɩ.

## Building components from the source

component-type-invalid = Pʋyʋ wɛtʋ tɩtʋʋzɩ: `<{ $componentType }>`

attribute-repeated = Paapɩzɩɣ patasɩ attribute { $attribute }.

attribute-invalid-for-component = Attribute "{ $attribute }" tɩtʋʋzɩ pʋyʋ wɛtʋ `<{ $componentType }>` yɔɔ.

## Style definition contrast

style-definition-insufficient-contrast =
    Wɛtʋ tɔbʋʋ { $styleNumber } fɛyɩnɩ lɛɣzɩtʋ ndʋ tɩmaɣ yɔ { $context ->
        [text-on-background] tɔm tɔlɩm nɛ wayɩ tɔlɩm hɛkʋ taa
        [high-contrast] lɛɣzɩtʋ sɔsɔtʋ tɔlɩm nɛ kanvasɩ hɛkʋ taa
        [line] ñɔʋ tɔlɩm nɛ kanvasɩ hɛkʋ taa
        [marker] yʋsaɣ tɔlɩm nɛ kanvasɩ hɛkʋ taa
       *[text-on-canvas] tɔm tɔlɩm nɛ kanvasɩ hɛkʋ taa
    }{ $mode ->
        [dark] { " (mode kɩlʋmʋʋ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pɩpɔzʋʋ { $threshold }:1 nɛ pɩɖɛɛnɩ ɛzɩma).

style-definition-dark-mode-text-background-contrast =
    Paa wɛtʋ tɔbʋʋ { $styleNumber } ɛwɛnɩ tɔlɩm ndʋ tɩwɛnɩ lɛɣzɩtʋ kɩmaɣzʋʋ mode kɩñɩlɩsʋʋ taa yɔ, mode kɩlʋmʋʋ tɔlɩm ndʋ palɩzɩ tɩ-taa yɔ tɩfɛyɩnɩ lɛɣzɩtʋ kɩmaɣzʋʋ tɔm tɔlɩm nɛ wayɩ tɔlɩm hɛkʋ taa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pɩpɔzʋʋ { $threshold }:1 nɛ pɩɖɛɛnɩ ɛzɩma). { $suggestion ->
        [available] Se ŋhiɣ lɛɣzɩtʋ kɩmaɣzʋʋ mode kɩlʋmʋʋ taa lɛ, sɔsɔzɩ mode kɩñɩlɩsʋʋ lɛɣzɩtʋ (ɛzɩ, ɖʋ { $lightAttribute }="{ $lightColor }") yaa lɛɣzɩ mode kɩlʋmʋʋ tɔlɩm (ɛzɩ, ɖʋ { $darkAttribute }="{ $darkColor }").
       *[none] Se ŋhiɣ lɛɣzɩtʋ kɩmaɣzʋʋ mode kɩlʋmʋʋ taa lɛ, sɔsɔzɩ mode kɩñɩlɩsʋʋ lɛɣzɩtʋ yaa lɛɣzɩ tɔlɩm nɛ textColorDarkMode yaa backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Paa wɛtʋ tɔbʋʋ { $styleNumber } ɛwɛnɩ tɔm tɔlɩm ndʋ tɩwɛnɩ lɛɣzɩtʋ kɩmaɣzʋʋ mode kɩñɩlɩsʋʋ taa yɔ, mode kɩlʋmʋʋ tɔm tɔlɩm ndʋ palɩzɩ tɩ-taa yɔ tɩfɛyɩnɩ lɛɣzɩtʋ kɩmaɣzʋʋ kanvasɩ yɔɔ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pɩpɔzʋʋ { $threshold }:1 nɛ pɩɖɛɛnɩ ɛzɩma). { $suggestion ->
        [available] Se ŋhiɣ lɛɣzɩtʋ kɩmaɣzʋʋ mode kɩlʋmʋʋ taa lɛ, sɔsɔzɩ mode kɩñɩlɩsʋʋ lɛɣzɩtʋ (ɛzɩ, ɖʋ textColor="{ $lightColor }") yaa lɛɣzɩ mode kɩlʋmʋʋ tɔlɩm (ɛzɩ, ɖʋ textColorDarkMode="{ $darkColor }").
       *[none] Se ŋhiɣ lɛɣzɩtʋ kɩmaɣzʋʋ mode kɩlʋmʋʋ taa lɛ, sɔsɔzɩ mode kɩñɩlɩsʋʋ lɛɣzɩtʋ yaa lɛɣzɩ tɔlɩm nɛ textColorDarkMode.
    }

section-multiple-style-palettes = Hɔɔlʋʋ pɩzɩɣ kɩlɩzɩ <stylePalette> kʋɖʋm ɖeke; palakɩnɩ kɛdɛzaɣ ñɩŋgʋ.

## Unique variants

variant-num-to-select-not-non-negative-integer = paapɩzɩɣ pana { $component } wɛtʋ ndɩ ndɩ mbʋ pʋyɔɔ yɔ numToSelect tɩkɛ ɖɔʋ kʋmʋʋ ŋgʋ kɩtɩpɩsɩ kɩtɛɛ ziro yɔ.

variant-num-to-select-not-constant-number = paapɩzɩɣ pana { $component } wɛtʋ ndɩ ndɩ mbʋ pʋyɔɔ yɔ numToSelect tɩkɛ ɖɔʋ ŋgʋ kɩɩlɛɣzɩɣ yɔ.

variant-with-replacement-not-constant-boolean = paapɩzɩɣ pana { $component } wɛtʋ ndɩ ndɩ mbʋ pʋyɔɔ yɔ withReplacement tɩkɛ boolean ŋgʋ kɩɩlɛɣzɩɣ yɔ.

variant-select-weight-disables-unique = Pɔtɔkɩ select wɛtʋ ndɩ ndɩ ye option nakʋyʋ ɛwɛnɩ selectWeight yaa selectForVariants yɔ

variant-coprime-undetermined = paapɩzɩɣ pana { $component } wɛtʋ ndɩ ndɩ mbʋ pʋyɔɔ yɔ paapɩzɩɣ pana se coprime kɛ cɛtɩm paa ɛzɩmtaa.

variant-attribute-not-constant = paapɩzɩɣ pana { $component } wɛtʋ ndɩ ndɩ mbʋ pʋyɔɔ yɔ { $attribute } lɛɣzɩɣ.

variant-attribute-not-number = paapɩzɩɣ pana { $component } wɛtʋ ndɩ ndɩ mbʋ pʋyɔɔ yɔ { $attribute } tɩkɛ ɖɔʋ.

variant-attribute-wrong-type-for-sequence =
    paapɩzɩɣ pana { $component } { $type } wɛtʋ ndɩ ndɩ mbʋ pʋyɔɔ yɔ { $attribute } tɩkɛ { $expected ->
        [letters-combination] masɩ kpɛndʋʋ
        [math-expression] maɣzɩm tɔm kɩbandʋ
        [integer] ɖɔʋ kʋmʋʋ
       *[number] ɖɔʋ
    }.

variant-length-not-integer = paapɩzɩɣ pana { $component } wɛtʋ ndɩ ndɩ mbʋ pʋyɔɔ yɔ length tɩkɛ ɖɔʋ kʋmʋʋ.

variant-sort-not-implemented = patɩla { $component } nɛ sort pɔ-wɛtʋ ndɩ ndɩ

variant-exclude-combinations-not-implemented = patɩla { $component } nɛ excludeCombinations pɔ-wɛtʋ ndɩ ndɩ

variant-math-exclude-not-implemented = patɩla { $component } type math nɛ exclude pɔ-wɛtʋ ndɩ ndɩ

variant-non-constant-exclude-not-implemented = patɩla { $component } nɛ exclude ŋgʋ kɩlɛɣzɩɣ yɔ pɔ-wɛtʋ ndɩ ndɩ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ɛɛlakɩ tʋmɩyɛ graph prefigure wɩlɩyʋ taa; pɔɖɔ pɩɣa yɔɔ.

prefigure-descendant-invalid-geometry = { $subject }: jiyomɛtrii tɩtalɩ yaa tɩtʋʋzɩ; pɔɖɔ pɩɣa yɔɔ.

prefigure-curve-label-omitted = { $subject }: hɩla ɛɛlakɩ tʋmɩyɛ curve pʋyʋ weyi palɛɣzaa yɔ ɛ-yɔɔ; palɩzɩ hɩɖɛ.

prefigure-curve-unsupported-definition-type = { $subject }: curve fɔŋksɩyɔŋ tɔbʋʋ wɛtʋ '{ $definitionType }' ɛɛlakɩ tʋmɩyɛ; pɔɖɔ pɩɣa yɔɔ.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions attribute regionBetweenCurves yɔɔ ɛɛlakɩ tʋmɩyɛ; pɔɖɔ pɩɣa yɔɔ.

prefigure-region-non-formula-child = { $subject }: formula-wɛtʋ piya fɔŋksɩyɔŋ ɖeke lakɩnɩ tʋmɩyɛ regionBetweenCurves yɔɔ; pɔɖɔ pɩɣa yɔɔ.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ɛɛlakɩ tʋmɩyɛ { $labelKind ->
        [line-family] ñɔŋ hɔʋ hɩɖɛ
       *[point] yʋsaɣ hɩɖɛ
    } yɔɔ; palakɩnɩ PreFigure ñɔɔzʋʋ.

prefigure-fill-style-unsupported = { $subject }: PreFigure ɛɛsɩŋ sʋʋ wɛtʋ '{ $fillStyle }'; palakɩnɩ sʋʋ kʋmʋʋ.

prefigure-line-style-unknown = { $subject }: paasɩŋ ñɔʋ wɛtʋ '{ $lineStyle }', pʋyɔɔ palɩzɩ-tʋ PreFigure taa.

prefigure-marker-style-mapped-to-diamond = { $subject }: palɛɣzɩ yʋsaɣ wɛtʋ '{ $markerStyle }' nɛ pɩpɩsɩ PreFigure wɛtʋ 'diamond'.

prefigure-marker-style-unsupported = { $subject }: PreFigure ɛɛsɩŋ yʋsaɣ wɛtʋ '{ $markerStyle }'; palakɩnɩ wɛtʋ kɩcalɩtʋ.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` tɩtʋʋzɩ; paapɩzɩɣ pana target. Palɩzɩ annotation.

annotation-ref-multiple-targets = `<annotation>`: `ref` wolo target sakɩyɛ yɔɔ; palakɩnɩ kajalaɣ ñɩŋgʋ.

annotation-ref-outside-graph = `<annotation>`: `ref` tɩtʋʋzɩ; target wɛ graph awayɩ. Palɩzɩ annotation.

annotation-ref-unsupported-target = `<annotation>`: `ref` tɩtʋʋzɩ; target tɩkɛ kɩlɛmʋʋ pʋyʋ ŋgʋ prefigure sɩm-kʋ yɔ. Palɩzɩ annotation.

annotation-text-missing = `<annotation>`: `text` fɛyɩ yaa kɩfɛyɩnɩ pʋyʋ; pama tɔm falaa.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Pana kpelaɣ ñɔtʋʋ.
       *[other] Pana kpelaɣ ñɔtʋʋ nɛ pʋyʋ `<{ $componentType }>`.
    }

reference-no-referent = Patɩna pʋyʋ nʋmɔʋ yɔɔ: `{ $reference }`

reference-multiple-referents = Pana pʋyʋ sakɩyɛ nʋmɔʋ yɔɔ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` attribute { $attribute } wɛtʋ tɩtʋʋzɩ.

children-invalid = `<{ $componentType }>` piya tɩtʋʋzɩ: Pana piya nzɩ sɩtɩtʋʋzɩ yɔ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Pʋyʋ `{ $value }` tɩtʋʋzɩ attribute `{ $attribute }` yɔɔ, palakɩnɩ `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Patɩna DoenetML version { $version }.
       *[other] Patɩna DoenetML version { $version }. Palakɩnɩ version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML tɩtʋʋzɩ: { $content }

parse-tag-missing-close-tag = DoenetML tɩtʋʋzɩ: Tag `{ $tag }` fɛyɩnɩ tag ŋgʋ kɩtɔkɩ yɔ. Paɖaŋ tag ŋgʋ kɩtɔkɩ kɩ-tɩ yɔ yaa `</{ $tagName }>` tag.

parse-tag-error = DoenetML tɩtʋʋzɩ: Kɩwɛɛkɩm wɛ tag `<{ $tagName }>` taa

parse-attribute-missing-value = DoenetML tɩtʋʋzɩ: Attribute `{ $attribute }` tɩtʋʋzɩ, pɩwɛ ɛzɩ ɛfɛyɩnɩ pʋyʋ.

parse-attribute-invalid = DoenetML tɩtʋʋzɩ: Attribute `{ $attribute }` tɩtʋʋzɩ

parse-attribute-value-invalid = DoenetML tɩtʋʋzɩ: Attribute pʋyʋ `{ $value }` tɩtʋʋzɩ

parse-attribute-value-quote-mismatch = DoenetML tɩtʋʋzɩ: Attribute pʋyʋ `{ $value }` tɩtʋʋzɩ. Yɔɔdaɣ yʋsasɩ tɩmaɣ. Pɩwɛ ɛzɩ `{ $quote }` fɛyɩ

parse-open-tag-name-missing = DoenetML tɩtʋʋzɩ: Pana tag ŋgʋ kɩfɛyɩnɩ hɩɖɛ yɔ, ɛzɩ `<`

parse-tag-not-closed = DoenetML tɩtʋʋzɩ: Patɩtɔ tag `{ $tag }` (pɩwɛ ɛzɩ `>` fɛyɩ).

parse-self-closing-tag-name-missing = DoenetML tɩtʋʋzɩ: Pana tag ŋgʋ kɩfɛyɩnɩ hɩɖɛ yɔ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML tɩtʋʋzɩ: Patɩtɔ tag `{ $tag }` (pɩwɛ ɛzɩ `/>` fɛyɩ).

parse-tag-invalid-attributes = DoenetML tɩtʋʋzɩ: Tag `{ $tag }` tɩtʋʋzɩ. Pɩpɩzɩɣ ɛwɛɛnɩ attribute wena atɩtʋʋzɩ yɔ.

parse-close-tag-name-missing = DoenetML tɩtʋʋzɩ: Pana tag ŋgʋ kɩtɔkɩ nɛ kɩfɛyɩnɩ hɩɖɛ yɔ, ɛzɩ `</`

parse-attribute-value-unquoted = Pɩwɛɛ se attribute pʋyʋ ɛwɛɛ yɔɔdaɣ yʋsasɩ taa: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML tɩtʋʋzɩ: Pana tag ŋgʋ kɩtɔkɩ yɔ `{ $tag }`, ɛlɛ tag ŋgʋ kɩtʋlʋʋ yɔ fɛyɩ

parse-close-tag-mismatched = DoenetML tɩtʋʋzɩ: Tag ŋgʋ kɩtɔkɩ yɔ tɩmaɣ. Paɖaŋ `</{ $expected }>`. Pana `{ $found }`

parser-node-unconvertible = Paapɩzɩɣ palɛɣzɩ node { $node } nɛ pɩpɩsɩ Dast node.

## Names

name-attribute-invalid =
    Attribute name='{ $name }' tɩtʋʋzɩ. { $reason ->
        [characters] Hɩla pɩzɩɣ awɛɛnɩ masɩ, ɖɔʋ, tɛɛ kamaɣ yaa kamaɣ ɖeke.
       *[start] Pɩwɛɛ se hɩla ɩpaɣzɩnɩ mayaɣ.
    }

component-name-invalid-start = Pʋyʋ hɩɖɛ "{ $name }" tɩtʋʋzɩ. Pɩwɛɛ se hɩla ɩpaɣzɩnɩ mayaɣ.

## `<answer>` sugar

answer-video-watched-missing-video = Pɩwɛɛ se answer type videoWatched ɛwɛɛnɩ video attribute

answer-video-watched-video-not-reference = Pɩwɛɛ se answer type videoWatched ɛwɛɛnɩ video attribute weyi ɛkɛ nʋmɔʋ yɔ

answer-name-not-single-text = Pɩwɛɛ se answer name attribute ɛwɛɛnɩ text pɩɣa kʋɖʋmaɣ

## Referencing another document

external-doenetml-recursion-limit = Paapɩzɩɣ pahiɣ awayɩ DoenetML mbʋ pʋyɔɔ yɔ tasʋʋ ɖɔwa pɩdɩɩfɛyɩ. Kpelaɣ nʋmɔʋ wɛɛ?

external-doenetml-unavailable = Paapɩzɩɣ pahiɣ DoenetML { $attribute }="{ $uri }" taa

external-doenetml-type-mismatch = DoenetML ŋgʋ pahiɣ { $attribute }="{ $uri }" taa yɔ kɩtɩtʋʋzɩ: kɩtɩmaɣ nɛ pʋyʋ wɛtʋ "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` kpaɖɩ; labɩnɩ tʋmɩyɛ `{ $to }`.
       *[other] [deprecation] Attribute `{ $from }` `<{ $component }>` yɔɔ kpaɖɩ; labɩnɩ tʋmɩyɛ `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` kpaɖɩ nɛ pakpaɣ-kʋ falaa mbʋ pʋyɔɔ yɔ `{ $to }` ɖɔɖɔ wɛɛ.
       *[other] [deprecation] Attribute `{ $from }` `<{ $component }>` yɔɔ kpaɖɩ nɛ pakpaɣ-kʋ falaa mbʋ pʋyɔɔ yɔ `{ $to }` ɖɔɖɔ wɛɛ.
    }

deprecated-attribute-ignored = [deprecation] Attribute `{ $attribute }` `<{ $component }>` yɔɔ kpaɖɩ nɛ pakpaɣ-kʋ falaa.

deprecated-attribute-to-child = [deprecation] Attribute `{ $attribute }` `<{ $component }>` yɔɔ kpaɖɩ; labɩnɩ tʋmɩyɛ `<{ $child }>` pɩɣa.

deprecated-attribute-value-renamed = [deprecation] Pʋyʋ `{ $value }` attribute `{ $attribute }` `<{ $component }>` yɔɔ kpaɖɩ; labɩnɩ tʋmɩyɛ `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` pɩzɩɣ kɩla Anglɛɛ ɖeke sakɩyɛ, pʋyɔɔ kɩ-tɔm ɛɛlɛɣzɩɣ takayaɣ ŋga pamawa { $locale } taa yɔ ka-taa. Ma sakɩyɛ wɛtʋ kpaagbaa, yaa ɖʋ-tʋ nɛ `pluralForm` attribute.


## Checking against the schema

schema-element-unrecognized = Pʋyʋ `<{ $tag }>` tɩkɛ Doenet pʋyʋ ŋgʋ pasɩm-kʋ yɔ.

schema-element-not-allowed-at-root = Paahaɣ nʋmɔʋ pʋyʋ `<{ $tag }>` takayaɣ ñʋʋ taa.

schema-element-not-allowed-inside = Paahaɣ nʋmɔʋ pʋyʋ `<{ $tag }>` `<{ $parent }>` taa.

schema-attribute-unrecognized = Pʋyʋ `<{ $tag }>` fɛyɩnɩ attribute ŋgʋ payaɣ se `{ $attribute }` yɔ.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Pɩwɛɛ se pʋyʋ `<{ $tag }>` attribute `{ $attribute }` ɛkɛ lɩzʋʋ ŋgʋ kɩ-taa pʋyʋ kʋɖʋm kʋɖʋm kɛ kʋɖʋm ɛ-taa yɔ: { $allowed }
       *[other] Pɩwɛɛ se pʋyʋ `<{ $tag }>` attribute `{ $attribute }` ɛkɛ kʋɖʋm ɛ-taa: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Select wɛtʋ hɩɖɛ tɩtʋʋzɩ.  Wɛtʋ hɩɖɛ { $variantName } wɛ option { $numOptions } taa ɛlɛ ɖɔʋ ŋgʋ palɩzɩɣ yɔ kɩkɛ { $numToSelect }.

select-variant-name-without-options = Pɔyɔɔdɩ wɛtʋ natʋyʋ select yɔɔ ɛlɛ patɩyɔɔdɩ option nakʋyʋ wɛtʋ hɩɖɛ nɖɩ ɖɩpɩzɩɣ ɖɩwɛɛ yɔ ɖɩ-yɔɔ: { $variantName }.

select-variant-name-not-possible = Wɛtʋ hɩɖɛ { $variantName } nɖɩ pɔyɔɔdɩ select yɔɔ yɔ ɖɩtɩkɛ wɛtʋ hɩɖɛ nɖɩ ɖɩpɩzɩɣ ɖɩwɛɛ yɔ.

select-too-few-options = Paapɩzɩɣ palɩzɩ pʋyʋ { $numToSelect } { $numOptions } ɖeke taa.

select-from-sequence-too-few-values = Paapɩzɩɣ palɩzɩ pʋyʋ { $numToSelect } sequence ŋgʋ kɩ-ɖaɣlɩkɩŋ kɛ { $length } yɔ kɩ-taa.

select-from-sequence-indices-count-mismatch = Pɩwɛɛ se indices ɖɔʋ ŋgʋ pɔyɔɔdɩ select yɔɔ yɔ kɩmaɣ nɛ ɖɔʋ ŋgʋ palɩzɩɣ yɔ

select-from-sequence-indices-not-integers = Pɩwɛɛ se indices tɩŋa wena pɔyɔɔdɩ select yɔɔ yɔ akɛ ɖɔʋ kʋmʋʋ

select-from-sequence-index-excluded = Pɔyɔɔdɩ selectfromsequence index weyi palɩzɩ-ɩ yɔ

select-from-sequence-indices-excluded-combination = Pɔyɔɔdɩ selectfromsequence indices wena akɛ kpɛndʋʋ ŋgʋ palɩzaa yɔ

select-from-sequence-coprime-not-positive-integers = Paapɩzɩɣ palɩzɩ coprime kpɛndʋʋ mbʋ pʋyɔɔ yɔ paalɩzɩɣ ɖɔʋ kʋmʋʋ sɔsɔŋ.

select-from-sequence-coprime-common-factor = Paapɩzɩɣ palɩzɩ coprime ɖɔʋ. Ɖɔʋ ŋgʋ kɩpɩzɩɣ kɩwɛɛ yɔ kɩ-tɩŋa wɛnɩ faktɛɛrɩ kʋɖʋm. (Pɩwɛɛ se "from" yaa "to" pʋyʋ ŋgʋ pɔyɔɔdaa yɔ kɩkɛ coprime nɛ "step".)

select-from-sequence-coprime-single-number = Paapɩzɩɣ palɩzɩ coprime kpɛndʋʋ ɖɔʋ kʋɖʋm ŋgʋ kɩtɩkɛ 1 yɔ kɩ-taa.

select-from-sequence-excluded-too-many-combinations = Palɩzɩ kpɛndʋʋ 70% nɛ pɩɖɛɛnɩ ɛzɩma selectFromSequence taa

select-from-sequence-coprime-none-found = Paapɩzɩɣ palɩzɩ coprime ɖɔʋ. Ɖɔʋ ŋgʋ kɩpɩzɩɣ kɩwɛɛ yɔ kɩ-tɩŋa wɛnɩ faktɛɛrɩ kʋɖʋm.

select-from-sequence-too-few-unique-values = Paapɩzɩɣ palɩzɩ pʋyʋ ndɩ ndɩ { $numToSelect } sequence ŋgʋ kɩ-ɖaɣlɩkɩŋ kɛ { $numPossibleValues } yɔ kɩ-taa

select-prime-numbers-too-few-values = Paapɩzɩɣ palɩzɩ pʋyʋ { $numToSelect } praymɩ lɩzʋʋ ŋgʋ kɩ-ɖaɣlɩkɩŋ kɛ { $numValues } yɔ kɩ-taa

select-prime-numbers-values-count-mismatch = Pɩwɛɛ se pʋyʋ ɖɔʋ ŋgʋ pɔyɔɔdɩ select yɔɔ yɔ kɩmaɣ nɛ ɖɔʋ ŋgʋ palɩzɩɣ yɔ

select-prime-numbers-values-not-prime = Pɩwɛɛ se pʋyʋ tɩŋa mbʋ pɔyɔɔdɩ select prime number yɔɔ yɔ pɩwɛɛ praymɩ lɩzʋʋ taa

select-prime-numbers-values-excluded-combination = Pʋyʋ mbʋ pɔyɔɔdɩ selectPrimeNumbers yɔɔ yɔ pɩkɛ kpɛndʋʋ ŋgʋ palɩzaa yɔ

select-prime-numbers-excluded-too-many-combinations = Palɩzɩ kpɛndʋʋ 70% nɛ pɩɖɛɛnɩ ɛzɩma selectPrimeNumbers taa

select-random-combination-fluke = Ɛzɩ pɩɩpɩzɩɣ pɩla yɔ, paapɩzɩ palɩzɩ ɖɔʋ ndɩ ndɩ kpɛndʋʋ

select-random-value-fluke = Ɛzɩ pɩɩpɩzɩɣ pɩla yɔ, paapɩzɩ palɩzɩ ɖɔʋ ndɩ ndɩ nakʋyʋ
