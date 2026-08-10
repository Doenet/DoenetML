# Kikuyu diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`
# and the rest — are part of the language rather than prose, and stay in
# English exactly as written. So does the `[deprecation]` marker.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } nĩĩtiganagĩrio rĩrĩa ndoti igĩrĩ cia mũthia ciathuurwo
       *[other] { $attributes } nĩitiganagĩrio rĩrĩa ndoti igĩrĩ cia mũthia ciathuurwo
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } nĩĩtiganagĩrio rĩrĩa ndoti ya mũthia na ya gatagatĩ ciothe ciathuurwo
       *[other] { $attributes } nĩitiganagĩrio rĩrĩa ndoti ya mũthia na ya gatagatĩ ciothe ciathuurwo
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ndĩrĩ na kĩene hatarĩ ndoti ya gatagatĩ

## `<line>`

line-points-undetermined-dimensions = Mũhari ũrahĩtũka ndoti-inĩ cia ũnene ũtamenyekete.

line-points-too-few-dimensions = Mũhari nĩ mwagĩrĩru kũhĩtũka ndoti-inĩ cia ũnene wa igĩrĩ o na hanini.

line-points-depend-on-variables = Mũhari ũrahĩtũka ndoti-inĩ iria ihocaga ũgarũrũkanu: { $variables }.

line-equation-invalid-format = Mũthiĩre ũtarĩ mwega wa iganu rĩa mũhari harĩ ũgarũrũkanu { $variable1 } na { $variable2 }.

## `<ray>`

ray-overprescribed-through = Reyi nĩyathuurwo na through, endpoint na direction.  Nĩgũgũtiganĩrio through ĩrĩa yathuurwo.

ray-dimension-mismatch = numDimensions ndĩraiganana harĩ reyi.

## `<vector>`

vector-overprescribed-head = Vekita nĩyathuurwo na head, tail na displacement.  Nĩgũgũtiganĩrio head ĩrĩa yathuurwo.

vector-dimension-mismatch = numDimensions ndĩraiganana harĩ vekita.

## Attracting and constraining

attract-to-without-nearest-point = Ndũngĩguucĩrĩria harĩ `<{ $component }>` tondũ ndĩrĩ na ũgarũrũkanu wa mwĩkarĩre wa nearestPoint.

constrain-to-without-nearest-point = Ndũngĩhingĩrĩria harĩ `<{ $component }>` tondũ ndĩrĩ na ũgarũrũkanu wa mwĩkarĩre wa nearestPoint.

constrain-to-interior-without-nearest-point = Ndũngĩhingĩrĩria thĩinĩ wa `<{ $component }>` tondũ ndĩrĩ na ũgarũrũkanu wa mwĩkarĩre wa nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition nĩĩtiganagĩrio harĩ choiceInput ĩtarĩ ya inline

## Ordering children by index

choice-input-indices-count-mismatch = Nĩgũgũtiganĩrio namba iria ciathuurirwo harĩ choiceInput tondũ mũigana wa namba ndũiganaine na mũigana wa ciana cia gũthuura.

pretzel-indices-count-mismatch = Nĩgũgũtiganĩrio namba iria ciathuurirwo harĩ problem tondũ mũigana wa namba ndũiganaine na mũigana wa ciana cia problem.

shuffle-indices-count-mismatch = Nĩgũgũtiganĩrio namba iria ciathuurirwo harĩ shuffle tondũ mũigana wa namba ndũiganaine na mũigana wa icunjĩ.

indices-ignored-out-of-range = Nĩgũgũtiganĩrio namba iria ciathuurirwo harĩ { $component } tondũ imwe irĩ nja ya gĩthimo.

pretzel-indices-repeated = Nĩgũgũtiganĩrio namba iria ciathuurirwo harĩ pretzel tondũ imwe nĩ ciacokererio.

pretzel-circuit-first-index = Nĩgũgũtiganĩrio namba iria ciathuurirwo harĩ pretzel harĩ mode wa circuit tondũ namba ya mbere no mũhaka ĩkorwo ĩrĩ 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Nĩguo `<{ $component }>` ĩrute wĩra na ciana cia ciugo, kĩgeranio kĩa `type` no mũhaka gĩthuurwo.

invalid-type-defaulting-to-math = Mũthemba { $type } ndũrĩ mwega harĩ gĩcunjĩ kĩa { $component }. No mũhaka ũkorwo ũrĩ ũmwe wa math, text, number kana boolean. Nĩgũkũigwo math ta ya mũtugo.

string-not-valid-component-to-arrange = Kiugo "{ $value }" ti gĩcunjĩ kĩĩtĩkĩrĩtio harĩ { $component }. Nĩgũgũtiganĩrio.

## Types and variables

invalid-type-defaulting-to-number = Mũthemba { $type } ndũrĩ mwega, mũthemba nĩ ũkũigwo number.

invalid-variable-value = Mũigana ũtarĩ mwega wa ũgarũrũkanu: `{ $value }`

## Variants

variant-index-must-be-number = Namba ya mũthemba { $index } no mũhaka ĩkorwo ĩrĩ mũigana

variant-index-must-be-integer = Namba ya mũthemba { $index } no mũhaka ĩkorwo ĩrĩ mũigana mũkinyanĩru

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ndĩrĩ ya gĩthimo kĩrĩa gĩkinyanĩru. Wariĩ nĩ ũkũigwo wa ũiganaine.

side-by-side-absolute-margins = `<{ $component }>` ndĩrĩ ya gĩthimo kĩrĩa gĩkinyanĩru. Mĩhaka nĩ ĩkũigwo ya ũiganaine.

side-by-side-no-block-child = `<{ $component }>` ĩtarĩ njega: no mũhaka ĩkorwo ĩrĩ na kaana kamwe ka bulokũ o na hanini.

## `<label>`

label-for-ignored-on-graphical = Kĩgeranio kĩa `for` harĩ `<label>` ya mũhianano nĩgĩtiganagĩrio.

label-for-must-resolve-to-one = Kĩgeranio kĩa `for` harĩ `<label>` no mũhaka kĩonanie gĩcunjĩ kĩmwe kiiki.

label-for-unresolved = Kĩgeranio kĩa `for` harĩ `<label>` gĩtiaahotire kuonania gĩcunjĩ.

label-for-answer-with-authored-inputs = Kĩgeranio kĩa `for` harĩ `<label>` kĩonanagia `<answer>` ĩrĩa ĩrĩ na ũtoonyia ũrĩa mwandĩki aandĩkire; onania ũtoonyia wenyewe.

label-for-answer-without-input = Kĩgeranio kĩa `for` harĩ `<label>` kĩonanagia `<answer>` ĩtarĩ na ũtoonyia ũngĩheo rĩĩtwa.

label-for-must-reference-input-or-answer = Kĩgeranio kĩa `for` harĩ `<label>` no mũhaka kĩonanie ũtoonyia kana macookio.

## Accessibility

accessibility-short-description-or-decorative = Nĩ ũndũ wa ũkinyĩrĩri, `<{ $component }>` no mũhaka ĩkorwo ĩrĩ na gũtaarĩria kũnini kana ĩthuurwo ta decorative.

accessibility-video-short-description = Nĩ ũndũ wa ũkinyĩrĩri, `<video>` no mũhaka ĩkorwo ĩrĩ na gũtaarĩria kũnini.

accessibility-input-short-description-or-label = Nĩ ũndũ wa ũkinyĩrĩri, `<{ $component }>` no mũhaka ĩkorwo ĩrĩ na gũtaarĩria kũnini kana rĩĩtwa.

accessibility-answer-input-short-description-or-label = Nĩ ũndũ wa ũkinyĩrĩri, `<answer>` ĩrĩa ĩthondekaga ũtoonyia no mũhaka ĩkorwo ĩrĩ na gũtaarĩria kũnini kana rĩĩtwa.

accessibility-short-description-contains-math = Gũtaarĩria kũnini gũtiagĩrĩirwo gũkorwo na icunjĩ cia mĩigana ta `<{ $component }>`. Andĩka mĩigana na ciugo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ndĩrĩ na ngarũrũkano ĩiganĩte ya maandĩko ma kĩongo kĩa gĩcunjĩ (mũthiĩre mũirũ) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nĩ kwendekana { $threshold }:1 o na hanini).
       *[other] { $colorName } ndĩrĩ na ngarũrũkano ĩiganĩte ya maandĩko ma kĩongo kĩa gĩcunjĩ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nĩ kwendekana { $threshold }:1 o na hanini).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` ĩrĩa ĩhĩtũkaga ndoti-inĩ { $count } ndĩthondeketwo harĩa ndoti itarĩ na mĩigana ya namba.

circle-too-many-through-points = Ndũngĩtara gĩthiũrũrĩ kĩrĩa gĩhĩtũkaga ndoti-inĩ ikĩrĩte ithatũ.

circle-overprescribed-radius-center-points = Ndũngĩtara gĩthiũrũrĩ na redio, gatagatĩ na ndoti iria ciathuurirwo.

circle-center-with-multiple-points = Ndũngĩtara gĩthiũrũrĩ na gatagatĩ karĩa gathuurirwo kĩhĩtũkĩte ndoti ĩkĩrĩte ĩmwe.

circle-radius-too-small = Ndũngĩtara gĩthiũrũrĩ: tondũ ũraihu gatagatĩ ka ndoti igĩrĩ nĩ { $distance }, redio { $radius } ĩrĩa yathuurirwo nĩ nini mũno.

circle-radius-with-many-points = Ndũngĩthondeka gĩthiũrũrĩ kĩhĩtũkĩte ndoti ikĩrĩte igĩrĩ na redio ĩrĩa yathuurirwo.

circle-invalid-center-or-through-points = Gatagatĩ kana ndoti cia gĩthiũrũrĩ itirĩ njega.

circle-radius-center-with-multiple-points = Ndũngĩtara redio ya gĩthiũrũrĩ na gatagatĩ karĩa gathuurirwo kĩhĩtũkĩte ndoti ĩkĩrĩte ĩmwe.

circle-change-radius-non-numerical = Ndũngĩgarũra redio ya gĩthiũrũrĩ kĩrĩa gĩhĩtũkaga ndoti-inĩ itarĩ na namba

circle-radius-with-points-non-numerical = Ndũngĩthondeka gĩthiũrũrĩ kĩhĩtũkĩte ndoti ĩkĩrĩte ĩmwe na redio ĩrĩa yathuurirwo hatarĩ mĩigana ya namba.

circle-change-center-non-numerical = Kũgarũra gatagatĩ ka gĩthiũrũrĩ kĩrĩa gĩhĩtũkaga ndoti-inĩ itarĩ na mĩigana ya namba gũtithondeketwo.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ũnene ndũiganĩte harĩ gĩcigo kĩa wĩra. Gĩcigo kĩrĩ na ihinda { $intervals } no wĩra ũrĩ na { $inputs ->
            [one] ũtoonyia { $inputs }
           *[other] ũtoonyia { $inputs }
        }.
       *[other] Ũnene ndũiganĩte harĩ gĩcigo kĩa wĩra. Gĩcigo kĩrĩ na mahinda { $intervals } no wĩra ũrĩ na { $inputs ->
            [one] ũtoonyia { $inputs }
           *[other] ũtoonyia { $inputs }
        }.
    }

function-domain-invalid-format = Mũthiĩre ũtarĩ mwega wa gĩcigo kĩa wĩra.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Nĩgũgũtiganĩrio mũigana mũnene ũtarĩ wa namba wa wĩra.
        [minimum] Nĩgũgũtiganĩrio mũigana mũnini ũtarĩ wa namba wa wĩra.
        [extremum] Nĩgũgũtiganĩrio mũigana wa mũthia ũtarĩ wa namba wa wĩra.
        [point] Nĩgũgũtiganĩrio ndoti ĩtarĩ ya namba ya wĩra.
        [slope] Nĩgũgũtiganĩrio ũinamu ũtarĩ wa namba wa wĩra.
       *[other] Nĩgũgũtiganĩrio { $type } ĩtarĩ ya namba ya wĩra.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Nĩgũgũtiganĩrio mũigana mũnene ũtarĩ na kĩndũ wa wĩra.
        [minimum] Nĩgũgũtiganĩrio mũigana mũnini ũtarĩ na kĩndũ wa wĩra.
        [extremum] Nĩgũgũtiganĩrio mũigana wa mũthia ũtarĩ na kĩndũ wa wĩra.
        [point] Nĩgũgũtiganĩrio ndoti ĩtarĩ na kĩndũ ya wĩra.
       *[other] Nĩgũgũtiganĩrio { $type } ĩtarĩ na kĩndũ ya wĩra.
    }

function-points-too-close = Wĩra ũrĩ na ndoti igĩrĩ irĩ hakuhĩ mũno. Ndũngĩtaarĩria wĩra.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Kũrũmĩrĩra kwa wĩra kũhotekaga o rĩrĩa mũigana wa ũtoonyia waiganana na mũigana wa ũrutĩro. Wĩra ũyũ ũrĩ na ũtoonyia { $inputs } na { $outputs ->
            [one] ũrutĩro { $outputs }
           *[other] ũrutĩro { $outputs }
        }.
       *[other] Kũrũmĩrĩra kwa wĩra kũhotekaga o rĩrĩa mũigana wa ũtoonyia waiganana na mũigana wa ũrutĩro. Wĩra ũyũ ũrĩ na ũtoonyia { $inputs } na { $outputs ->
            [one] ũrutĩro { $outputs }
           *[other] ũrutĩro { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Ũraihu ũtarĩ mwega wa mũtaratara.  No mũhaka ũkorwo ũrĩ mũigana mũkinyanĩru ũtarĩ wa thĩ ya nyota.

sequence-invalid-step = Ikinya rĩtarĩ rĩega rĩa mũtaratara.  No mũhaka rĩkorwo rĩrĩ mũigana harĩ mũtaratara wa mũthemba wa { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ĩtarĩ njega ya mũtaratara wa mĩigana.  No mũhaka ĩkorwo ĩrĩ mũigana.

sequence-invalid-endpoint-letters = "{ $attribute }" ĩtarĩ njega ya mũtaratara wa ndemwa.  No mũhaka ĩkorwo ĩrĩ mũtukanio wa ndemwa.

sequence-invalid-endpoint = "{ $attribute }" ĩtarĩ njega ya mũtaratara.

select-from-sequence-coprime-not-numbers = coprime nĩyatiganĩrio tondũ gũtirathuurwo mĩigana

select-from-sequence-coprime-with-exclude-combinations = coprime nĩyatiganĩrio tondũ excludeCombinations nĩyathuurwo

## Resolving a `target`

target-not-found = Kĩrĩa gĩcũthĩrĩirio gĩtarĩ kĩega kĩa `<{ $source }>`: kĩrĩa gĩcũthĩrĩirio gĩtioneka.

target-state-variable-not-found = Kĩrĩa gĩcũthĩrĩirio gĩtarĩ kĩega kĩa `<{ $source }>`: gũtioneka ũgarũrũkanu wa mwĩkarĩre wĩtagwo "{ $property }" harĩ `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Ũgarũrũkanu wa `<odeSystem>` no mũhaka ũkorwo ũtiganĩte na ũgarũrũkanu wĩrũgamĩrĩire.

ode-system-duplicate-variable-names = Ndũngĩtaarĩria mawĩra ma ODE RHS na marĩĩtwa ma ũgarũrũkanu maacokereirio.

ode-system-rhs-function-error = Ndũngĩtaarĩria wĩra wa ODE RHS.  Ihĩtia harĩ gũthondeka wĩra wa mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ndũngĩtaarĩria koine gatagatĩ ka mĩhari { $count }

angle-invalid-through-point = Ndoti ĩtarĩ njega harĩ through ya `<angle>`

parabola-vertex-too-many-points = Parabola ĩrĩ na kĩongo ĩhĩtũkĩte ndoti ĩkĩrĩte ĩmwe ndĩthondeketwo.

parabola-too-many-points = Parabola ĩhĩtũkĩte ndoti ikĩrĩte ithatũ ndĩthondeketwo.

intersection-too-many-items = Gũtũkanĩra kwa indo ikĩrĩte igĩrĩ gũtithondeketwo

## Other math components

ionic-compound-not-two-ions = Mũtukanio wa ayoni ũtarĩ wa ayoni igĩrĩ ndũthondeketwo.

ionic-compound-needs-cation-and-anion = Mũtukanio wa ayoni ũthondeketwo o wa kathayoni ĩmwe na anayoni ĩmwe.

solve-equations-cannot-evaluate = Ndũngĩtatũra iganu tondũ ndũngĩrĩthima: { $equation }

math-operators-operand-number-required = No mũhaka ũthuure operandNumber rĩrĩa ũkũruta operand ya mĩigana.

eigen-decomposition-failed = Gũtiahotekire gũtara mĩigana ya eigen ya methiriki

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: paramita { $parameters } ndĩrĩ harĩ mũthiĩre, nĩ ũndũ ũcio ĩrĩiganaga na handũ hatarĩ kĩndũ hĩndĩ ciothe.
       *[other] `<matchesPattern>`: paramita { $parameters } itirĩ harĩ mũthiĩre, nĩ ũndũ ũcio irĩiganaga na handũ hatarĩ kĩndũ hĩndĩ ciothe.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ndũngĩtaũkĩrwo nĩ grid="{ $grid }". No mũhaka ĩkorwo ĩrĩ none, medium, dense, kana mĩigana ĩĩrĩ mĩnene gũkĩra nyota ĩgayanĩtio na kahaaro, ta grid="1 0.5". Gũtirĩ gĩtaruru gĩakwĩrwo.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ndĩteithĩrĩirio harĩ mũonania wa prefigure; nĩgũkũhũthĩrwo mũthiĩre wa right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ndĩteithĩrĩirio harĩ mũonania wa prefigure; nĩgũkũhũthĩrwo mũthiĩre wa top.

prefigure-invalid-axis-bounds = `<graph>`: mĩhaka ya akici ĩtarĩ njega ya kũgarũra kwa prefigure; nĩgũkũhũthĩrwo bbox ya mũtugo (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: wariĩ ũtarĩ mwega wa kũgarũra kwa prefigure; nĩgũkũhũthĩrwo wariĩ wa mũtugo wa 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ĩtarĩ njega ya kũgarũra kwa prefigure; nĩgũkũhũthĩrwo gĩthimo kĩa mũtugo kĩa 1.

prefigure-grid-spacing-too-fine = `<graph>`: kahaaro ka gĩtaruru nĩ kanini mũno harĩ mĩhaka ya akici; gĩtaruru nĩgĩgũtigwo harĩ mũonania wa prefigure.

prefigure-annotations-not-rendered = `<graph>`: maandĩko-marĩa-mataarĩirie matikuonanio hatarĩ mũonania wa PreFigure.

multiple-annotations-children = Nĩ kwoneka ciana nyingĩ cia `<annotations>` thĩinĩ wa `<graph>`; ciothe tiga ya mũthia nĩciatiganĩrio.

## Referring to other components

copy-unrecognized-component-type = Ndũngĩongerera kana gũkopi mũthemba wa gĩcunjĩ ũtoĩkaine: { $type }.

copy-prop-not-found = Gũtioneka kĩgeranio { $property } harĩ gĩcunjĩ kĩa mũthemba wa { $component }

collect-no-source = Gũtioneka gĩtũmi kĩa collect.

collect-invalid-component-type = Ndũngĩcookanĩrĩria icunjĩ cia mũthemba wa `<{ $component }>` tondũ nĩ mũthemba wa gĩcunjĩ ũtarĩ mwega.

reference-index-unavailable = Ndũngĩonania namba `{ $reference }`

## `<callAction>`

component-action-unavailable = Ndũngĩĩta { $action } harĩ gĩcunjĩ `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Data ĩrĩ na mũthiĩre ũtarĩ mwega.  Mĩhari ĩrĩ na ũraihu ũtaiganaine. Nĩyoneka harĩ componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data ĩrĩ na marĩĩtwa ma itugĩ macokereirio.  Nĩyoneka harĩ componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data ndĩrĩ na rĩĩtwa rĩa gĩtugĩ.  Nĩyoneka harĩ componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award ya macookio maya ĩhocaga macookio ma tagi ya answer yo yene, ũndũ ũcio ũkũrehe mĩtugo ĩtetereirwo.

answer-max-num-attempts-in-section-wide-check-work = Kũiga `maxNumAttempts` harĩ `<answer>` ĩrĩ thĩinĩ wa gĩkabu kĩrĩ na `sectionWideCheckWork` gũtirĩ na kĩene, tondũ mũigana wa kũgeria ũthimagwo nĩ gĩkabu. Iga `maxNumAttempts` gĩkabu-inĩ.

nested-section-wide-check-work-max-num-attempts = Kũiga `maxNumAttempts` harĩ gĩkabu kĩrĩ na `sectionWideCheckWork` kĩrĩ thĩinĩ wa kĩngĩ kĩrĩ na `sectionWideCheckWork` gũtirĩ na kĩene, tondũ mũigana wa kũgeria ũthimagwo nĩ gĩkabu kĩa nja. Iga `maxNumAttempts` gĩkabu-inĩ kĩa nja.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Kĩgeranio kĩa { $attributes } gĩtirĩ na kĩene hatarĩ symbolicEquality.
       *[other] Igeranio cia { $attributes } itirĩ na kĩene hatarĩ symbolicEquality.
    }

answer-invalid-type = Mũthemba ũtarĩ mwega wa macookio: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Tondũ gĩcunjĩ `<{ $component }>` gĩtirĩ na rĩĩtwa, gĩtingĩhũthĩrwo ta kĩgeranio kĩa module

module-attribute-name-already-defined = Gĩcunjĩ `<{ $component } name="{ $name }">` gĩtingĩhũthĩrwo ta kĩgeranio kĩa module tondũ mũthemba wa gĩcunjĩ wa `<module>` nĩ ũrĩkĩtie gũkorwo na kĩgeranio kĩa "{ $name }".

conditional-content-condition-ignored = Kĩgeranio kĩa `condition` nĩgĩtiganagĩrio harĩ gĩcunjĩ kĩa `<conditionalContent>` kĩrĩ na ciana cia case kana cia else.

slider-markers-type-mismatch = Mũthemba wa imenyithia ndũiganaine na mũthemba wa slider.

pretzel-problem-needs-statement-and-answer = pretzel ĩtarĩ njega: `<problem>` o yothe no mũhaka ĩkorwo ĩrĩ na `<statement>` ĩmwe na `<answer>` ĩmwe.

pretzel-circuit-first-problem-distractor = pretzel ĩtarĩ njega: harĩ mode="circuit", `<problem>` ya mbere ndĩngĩkorwo ĩrĩ ya kũhĩtithia.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Mũigana ũtarĩ mwega { $values } wa kĩgeranio `{ $attribute }`; nĩgũgũtiganĩrio.
       *[other] Mĩigana ĩtarĩ mĩega { $values } ya kĩgeranio `{ $attribute }`; nĩgũgũtiganĩrio.
    }

attribute-must-be-references = Mũigana ũtarĩ mwega `{ $value }` wa kĩgeranio `{ $attribute }`. Kĩgeranio no mũhaka gĩthondekwo na marũgamĩrĩri marĩa mambagĩrĩria na `$`.

math-input-invalid-function-names = <mathInput>: nĩgwatiganĩrio marĩĩtwa ma wĩra matarĩ mega harĩ { $attribute }: { $names }. Gĩcunjĩ kĩa kuonania kĩa rĩĩtwa o rĩothe no mũhaka gĩkorwo na ndemwa igĩrĩ o na hanini (ndemwa kana mĩhari); `|<mathspeak alternative>` no ĩrũmĩrĩre.

## Building components from the source

component-type-invalid = Mũthemba ũtarĩ mwega wa gĩcunjĩ: `<{ $componentType }>`

attribute-repeated = Ndũngĩcokereria kĩgeranio { $attribute }.

attribute-invalid-for-component = Kĩgeranio gĩtarĩ kĩega "{ $attribute }" kĩa gĩcunjĩ kĩa mũthemba wa `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Gũtaarĩria kwa mũthiĩre { $styleNumber } gũtirĩ na ngarũrũkano ĩiganĩte ya { $context ->
        [text-on-background] rangi wa maandĩko harĩ rangi wa kĩhumo
        [high-contrast] rangi wa ngarũrũkano nene harĩ kanvathi
        [line] rangi wa mũhari harĩ kanvathi
        [marker] rangi wa kĩmenyithia harĩ kanvathi
       *[text-on-canvas] rangi wa maandĩko harĩ kanvathi
    }{ $mode ->
        [dark] { " (mũthiĩre mũirũ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nĩ kwendekana { $threshold }:1 o na hanini).

style-definition-dark-mode-text-background-contrast =
    O na gũtuĩka gũtaarĩria kwa mũthiĩre { $styleNumber } nĩ gwathuurire rangi irĩ na ngarũrũkano ĩiganĩte ya mũthiĩre mũtheri, rangi cia mũthiĩre mũirũ iria ciumanĩte na mĩigana ĩyo itirĩ na ngarũrũkano ĩiganĩte ya rangi wa maandĩko harĩ rangi wa kĩhumo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nĩ kwendekana { $threshold }:1 o na hanini). { $suggestion ->
        [available] Nĩguo ngarũrũkano ĩigane harĩ mũthiĩre mũirũ, ongerera ngarũrũkano ya mũthiĩre mũtheri (ta, iga { $lightAttribute }="{ $lightColor }") kana ũgarũre rangi wa mũthiĩre mũirũ (ta, iga { $darkAttribute }="{ $darkColor }").
       *[none] Nĩguo ngarũrũkano ĩigane harĩ mũthiĩre mũirũ, ongerera ngarũrũkano ya mũthiĩre mũtheri kana ũgarũre rangi iria ciumanĩte na mĩigana ĩyo na textColorDarkMode na/kana backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    O na gũtuĩka gũtaarĩria kwa mũthiĩre { $styleNumber } nĩ gwathuurire rangi wa maandĩko ũrĩ na ngarũrũkano ĩiganĩte ya mũthiĩre mũtheri, rangi wa maandĩko wa mũthiĩre mũirũ ũrĩa ũrumanĩte na mũigana ũcio ndũrĩ na ngarũrũkano ĩiganĩte harĩ kanvathi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nĩ kwendekana { $threshold }:1 o na hanini). { $suggestion ->
        [available] Nĩguo ngarũrũkano ĩigane harĩ mũthiĩre mũirũ, ongerera ngarũrũkano ya mũthiĩre mũtheri (ta, iga textColor="{ $lightColor }") kana ũgarũre rangi wa mũthiĩre mũirũ (ta, iga textColorDarkMode="{ $darkColor }").
       *[none] Nĩguo ngarũrũkano ĩigane harĩ mũthiĩre mũirũ, ongerera ngarũrũkano ya mũthiĩre mũtheri kana ũgarũre rangi ũrĩa ũrumanĩte na mũigana ũcio na textColorDarkMode.
    }

section-multiple-style-palettes = Gĩcunjĩ no gĩthuure <stylePalette> ĩmwe kiiki; nĩgũkũhũthĩrwo ya mũthia.

## Unique variants

variant-num-to-select-not-non-negative-integer = ndũngĩmenya mĩthemba mĩamũre ya { $component } tondũ numToSelect ti mũigana mũkinyanĩru ũtarĩ wa thĩ ya nyota.

variant-num-to-select-not-constant-number = ndũngĩmenya mĩthemba mĩamũre ya { $component } tondũ numToSelect ti mũigana ũtagarũrũkaga.

variant-with-replacement-not-constant-boolean = ndũngĩmenya mĩthemba mĩamũre ya { $component } tondũ withReplacement ti boolean ĩtagarũrũkaga.

variant-select-weight-disables-unique = Mĩthemba mĩamũre ya select nĩĩhingagwo angĩkorwo nĩ kũrĩ ũthuuri ũrĩ na selectWeight kana selectForVariants

variant-coprime-undetermined = ndũngĩmenya mĩthemba mĩamũre ya { $component } tondũ ndũngĩmenya atĩ coprime nĩ maheeni hĩndĩ ciothe.

variant-attribute-not-constant = ndũngĩmenya mĩthemba mĩamũre ya { $component } tondũ { $attribute } ndĩtũũraga ĩrĩ o ũguo.

variant-attribute-not-number = ndũngĩmenya mĩthemba mĩamũre ya { $component } tondũ { $attribute } ti mũigana.

variant-attribute-wrong-type-for-sequence =
    ndũngĩmenya mĩthemba mĩamũre ya { $component } ya mũthemba wa { $type } tondũ { $attribute } ti { $expected ->
        [letters-combination] mũtukanio wa ndemwa
        [math-expression] mũhianĩre wa mĩigana ũtĩkĩrĩtio
        [integer] mũigana mũkinyanĩru
       *[number] mũigana
    }.

variant-length-not-integer = ndũngĩmenya mĩthemba mĩamũre ya { $component } tondũ length ti mũigana mũkinyanĩru.

variant-sort-not-implemented = mĩthemba mĩamũre ya { $component } ĩrĩ na sort ndĩthondeketwo

variant-exclude-combinations-not-implemented = mĩthemba mĩamũre ya { $component } ĩrĩ na excludeCombinations ndĩthondeketwo

variant-math-exclude-not-implemented = mĩthemba mĩamũre ya { $component } ya mũthemba wa math ĩrĩ na exclude ndĩthondeketwo

variant-non-constant-exclude-not-implemented = mĩthemba mĩamũre ya { $component } ĩrĩ na exclude ĩgarũrũkaga ndĩthondeketwo

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ndĩteithĩrĩirio harĩ mũonania wa graph prefigure; rũciaro nĩrwatigwo.

prefigure-descendant-invalid-geometry = { $subject }: jiomethiri ĩtathiraga kana ĩtakinyanĩire; rũciaro nĩrwatigwo.

prefigure-curve-label-omitted = { $subject }: marĩĩtwa matiteithĩrĩirio harĩ icunjĩ cia mũhari mũgothe iria cigarũrĩtwo; rĩĩtwa nĩrĩatigwo.

prefigure-curve-unsupported-definition-type = { $subject }: mũthemba wa gũtaarĩria wa wĩra wa mũhari mũgothe '{ $definitionType }' ndũteithĩrĩirio; rũciaro nĩrwatigwo.

prefigure-region-flip-functions-unsupported = { $subject }: kĩgeranio kĩa flipFunctions harĩ regionBetweenCurves gĩtiteithĩrĩirio; rũciaro nĩrwatigwo.

prefigure-region-non-formula-child = { $subject }: nĩ mawĩra ma ciana ma mũthemba wa formula moiki mateithĩrĩirio harĩ regionBetweenCurves; rũciaro nĩrwatigwo.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ndĩteithĩrĩirio harĩ { $labelKind ->
        [line-family] rĩĩtwa rĩa mũhĩrĩga wa mĩhari
       *[point] rĩĩtwa rĩa ndoti
    }; nĩgũkũhũthĩrwo ũiganu wa mũtugo wa PreFigure.

prefigure-fill-style-unsupported = { $subject }: mũthiĩre wa kũiyũria '{ $fillStyle }' ndũteithĩrĩirio nĩ PreFigure; nĩgũgũcokwo harĩ kũiyũria kũrĩa gũtarĩ mĩhari.

prefigure-line-style-unknown = { $subject }: mũthiĩre wa mũhari ũtoĩkaine '{ $lineStyle }' nĩwatigwo harĩ ũrutĩro wa PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: mũthiĩre wa kĩmenyithia '{ $markerStyle }' nĩwagarũrĩrwo harĩ mũthiĩre wa PreFigure wa 'diamond'.

prefigure-marker-style-unsupported = { $subject }: mũthiĩre wa kĩmenyithia '{ $markerStyle }' ndũteithĩrĩirio nĩ PreFigure; nĩgũkũhũthĩrwo mũthiĩre wa mũtugo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ĩtarĩ njega; ndũngĩona kĩrĩa gĩcũthĩrĩirio. Gũtaarĩria nĩgwatigwo.

annotation-ref-multiple-targets = `<annotation>`: `ref` nĩyonanirie indo nyingĩ; nĩgũkũhũthĩrwo ya mbere.

annotation-ref-outside-graph = `<annotation>`: `ref` ĩtarĩ njega; kĩrĩa gĩcũthĩrĩirio kĩrĩ nja ya graph ĩrĩa ĩkĩnyitĩte. Gũtaarĩria nĩgwatigwo.

annotation-ref-unsupported-target = `<annotation>`: `ref` ĩtarĩ njega; kĩrĩa gĩcũthĩrĩirio ti kĩndũ kĩa mũhianano kĩteithĩrĩirio harĩ kũgarũra kwa prefigure. Gũtaarĩria nĩgwatigwo.

annotation-text-missing = `<annotation>`: `text` ndĩrĩ ho kana ndĩrĩ na kĩndũ; nĩgũkũrutwo maandĩko matarĩ na kĩndũ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Nĩ kwoneka kwĩhoca kũrĩa gũthiũrũrũkĩte.
       *[other] Nĩ kwoneka kwĩhoca kũrĩa gũthiũrũrũkĩte kũrĩ na gĩcunjĩ kĩa `<{ $componentType }>`.
    }

reference-no-referent = Gũtirĩ kĩrĩa kĩoneka harĩ rũgamĩrĩri: `{ $reference }`

reference-multiple-referents = Nĩ kwoneka indo nyingĩ harĩ rũgamĩrĩri: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Mũthiĩre ũtarĩ mwega wa kĩgeranio { $attribute } kĩa `<{ $componentType }>`.

children-invalid = Ciana itarĩ njega cia `<{ $componentType }>`: Nĩ kwoneka ciana itarĩ njega: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Mũigana ũtarĩ mwega `{ $value }` wa kĩgeranio `{ $attribute }`, nĩgũkũhũthĩrwo mũigana `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Mũthemba wa DoenetML { $version } ndũroneka.
       *[other] Mũthemba wa DoenetML { $version } ndũroneka. Nĩgũgũcokwo harĩ mũthemba { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ĩtarĩ njega: { $content }

parse-tag-missing-close-tag = DoenetML ĩtarĩ njega: Tagi `{ $tag }` ndĩrĩ na tagi ya kũhinga. Kwerekagĩrwo tagi ĩĩhingaga kana tagi ya `</{ $tagName }>`.

parse-tag-error = DoenetML ĩtarĩ njega: Ihĩtia harĩ tagi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ĩtarĩ njega: Kĩgeranio gĩtarĩ kĩega `{ $attribute }` gĩkuoneka gĩtarĩ na mũigana.

parse-attribute-invalid = DoenetML ĩtarĩ njega: Kĩgeranio gĩtarĩ kĩega `{ $attribute }`

parse-attribute-value-invalid = DoenetML ĩtarĩ njega: Mũigana wa kĩgeranio ũtarĩ mwega `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML ĩtarĩ njega: Mũigana wa kĩgeranio ũtarĩ mwega `{ $value }`. Imenyithia cia kũgweta itiiganaine. Kũroneka kũrĩ kwaga `{ $quote }`

parse-open-tag-name-missing = DoenetML ĩtarĩ njega: Nĩ kwoneka tagi ĩtarĩ na rĩĩtwa, ta `<`

parse-tag-not-closed = DoenetML ĩtarĩ njega: Tagi `{ $tag }` ndĩhingĩtwo (kũroneka kũrĩ kwaga `>`).

parse-self-closing-tag-name-missing = DoenetML ĩtarĩ njega: Nĩ kwoneka tagi ĩtarĩ na rĩĩtwa `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ĩtarĩ njega: Tagi `{ $tag }` ndĩhingĩtwo (kũroneka kũrĩ kwaga `/>`).

parse-tag-invalid-attributes = DoenetML ĩtarĩ njega: Tagi `{ $tag }` ndĩtĩkĩrĩtio. No ĩkorwo ĩrĩ na igeranio itarĩ njega.

parse-close-tag-name-missing = DoenetML ĩtarĩ njega: Nĩ kwoneka tagi ya kũhinga ĩtarĩ na rĩĩtwa, ta `</`

parse-attribute-value-unquoted = Mĩigana ya igeranio no mũhaka ĩkorwo thĩinĩ wa imenyithia cia kũgweta: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ĩtarĩ njega: Nĩ kwoneka tagi ya kũhinga `{ $tag }`, no gũtirĩ tagi ya kũhingũra ĩiganaine

parse-close-tag-mismatched = DoenetML ĩtarĩ njega: Tagi ya kũhinga ndĩiganaine. Kwerekagĩrwo `</{ $expected }>`. Nĩ kwoneka `{ $found }`

parser-node-unconvertible = Gũtiahotekire kũgarũra nodi { $node } ĩtuĩke nodi ya Dast.

## Names

name-attribute-invalid =
    Rĩĩtwa rĩa kĩgeranio rĩtirĩ rĩega name='{ $name }'. { $reason ->
        [characters] Marĩĩtwa no makorwo na ndemwa, namba, mĩhari ya thĩ kana mĩhari kiiki.
       *[start] Marĩĩtwa no mũhaka mambĩrĩrie na ndemwa.
    }

component-name-invalid-start = Rĩĩtwa rĩa gĩcunjĩ rĩtirĩ rĩega "{ $name }". Marĩĩtwa no mũhaka mambĩrĩrie na ndemwa.

## `<answer>` sugar

answer-video-watched-missing-video = Macookio ma mũthemba wa videoWatched no mũhaka makorwo na kĩgeranio kĩa video

answer-video-watched-video-not-reference = Macookio ma mũthemba wa videoWatched no mũhaka makorwo na kĩgeranio kĩa video kĩrĩ rũgamĩrĩri

answer-name-not-single-text = Kĩgeranio kĩa name kĩa macookio no mũhaka gĩkorwo na kaana kamwe ka maandĩko

## Referencing another document

external-doenetml-recursion-limit = Gũtiahotekire kũrehe DoenetML ya nja nĩ ũndũ wa mĩrongo mĩingĩ mũno ya gũcokereria. Hĩndĩ ĩmwe nĩ kũrĩ rũgamĩrĩri rũthiũrũrũkĩte?

external-doenetml-unavailable = Gũtiahotekire kũrehe DoenetML kuuma { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ĩrĩa yarehirwo kuuma { $attribute }="{ $uri }" ndĩrĩ njega: ndĩiganaine na mũthemba wa gĩcunjĩ wa "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Kĩgeranio `{ $from }` gĩtirahũthĩrwo rĩngĩ; hũthĩra `{ $to }` handũ hakĩo.
       *[other] [deprecation] Kĩgeranio `{ $from }` harĩ `<{ $component }>` gĩtirahũthĩrwo rĩngĩ; hũthĩra `{ $to }` handũ hakĩo.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Kĩgeranio `{ $from }` gĩtirahũthĩrwo rĩngĩ na nĩgĩgũtiganĩrio tondũ o na `{ $to }` nĩyathuurwo.
       *[other] [deprecation] Kĩgeranio `{ $from }` harĩ `<{ $component }>` gĩtirahũthĩrwo rĩngĩ na nĩgĩgũtiganĩrio tondũ o na `{ $to }` nĩyathuurwo.
    }

deprecated-attribute-ignored = [deprecation] Kĩgeranio `{ $attribute }` harĩ `<{ $component }>` gĩtirahũthĩrwo rĩngĩ na nĩgĩgũtiganĩrio.

deprecated-attribute-to-child = [deprecation] Kĩgeranio `{ $attribute }` harĩ `<{ $component }>` gĩtirahũthĩrwo rĩngĩ; hũthĩra kaana ka `<{ $child }>` handũ hakĩo.

deprecated-attribute-value-renamed = [deprecation] Mũigana `{ $value }` wa kĩgeranio `{ $attribute }` harĩ `<{ $component }>` ndũrahũthĩrwo rĩngĩ; hũthĩra `{ $to }` handũ hakĩo.


## Language coverage

pluralize-english-only = `<pluralize>` no ĩhote kwongerera ũingĩ wa Gĩthũngũ kiiki, nĩ ũndũ ũcio maandĩko mayo nĩmatigagwo o ũguo ĩbuku-inĩ rĩandĩkĩtwo na { $locale }. Andĩka mũthiĩre wa ũingĩ wenyewe, kana ũũige na kĩgeranio kĩa `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Gĩcunjĩ `<{ $tag }>` ti gĩcunjĩ kĩa Doenet kĩũĩkaine.

schema-element-not-allowed-at-root = Gĩcunjĩ `<{ $tag }>` gĩtitĩkĩrĩtio mũri-inĩ wa ĩbuku.

schema-element-not-allowed-inside = Gĩcunjĩ `<{ $tag }>` gĩtitĩkĩrĩtio thĩinĩ wa `<{ $parent }>`.

schema-attribute-unrecognized = Gĩcunjĩ `<{ $tag }>` gĩtirĩ na kĩgeranio kĩĩtagwo `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Kĩgeranio `{ $attribute }` kĩa gĩcunjĩ `<{ $tag }>` no mũhaka gĩkorwo kĩrĩ mũtaratara ũrĩa indo ciaguo ikorwo o ĩmwe ĩrĩ ĩmwe ya: { $allowed }
       *[other] Kĩgeranio `{ $attribute }` kĩa gĩcunjĩ `<{ $tag }>` no mũhaka gĩkorwo kĩrĩ kĩmwe kĩa: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Rĩĩtwa rĩa mũthemba rĩtirĩ rĩega harĩ select.  Rĩĩtwa rĩa mũthemba { $variantName } rĩonekaga harĩ ũthuuri { $numOptions } no mũigana wa gũthuura nĩ { $numToSelect }.

select-variant-name-without-options = Mĩthemba ĩmwe nĩyathuurirwo harĩ select no gũtirĩ ũthuuri wathuurirwo wa rĩĩtwa rĩa mũthemba rĩngĩhoteka: { $variantName }.

select-variant-name-not-possible = Rĩĩtwa rĩa mũthemba { $variantName } rĩrĩa rĩathuurirwo harĩ select ti rĩĩtwa rĩa mũthemba rĩngĩhoteka.

select-too-few-options = Ndũngĩthuura icunjĩ { $numToSelect } kuuma harĩ { $numOptions } kiiki.

select-from-sequence-too-few-values = Ndũngĩthuura mĩigana { $numToSelect } kuuma mũtaratara-inĩ wa ũraihu wa { $length }.

select-from-sequence-indices-count-mismatch = Mũigana wa namba iria ciathuurirwo harĩ select no mũhaka ũiganane na mũigana wa gũthuura

select-from-sequence-indices-not-integers = Namba ciothe iria ciathuurirwo harĩ select no mũhaka ikorwo irĩ mĩigana mĩkinyanĩru

select-from-sequence-index-excluded = Namba ĩrĩa yathuurirwo ya selectfromsequence nĩyaeheririo

select-from-sequence-indices-excluded-combination = Namba iria ciathuurirwo cia selectfromsequence ciarĩ mũtukanio ũrĩa waeheririo

select-from-sequence-coprime-not-positive-integers = Ndũngĩthuura mĩtukanio ya coprime tondũ gũtirathuurwo mĩigana mĩkinyanĩru mĩnene gũkĩra nyota.

select-from-sequence-coprime-common-factor = Ndũngĩthuura mĩigana ya coprime. Mĩigana yothe ĩngĩhoteka ĩrĩ na kĩgayanĩri kĩmwe. (Mĩigana ĩrĩa yathuurirwo ya "from" kana "to" no mũhaka ĩkorwo ĩrĩ coprime na "step".)

select-from-sequence-coprime-single-number = Ndũngĩthuura mĩtukanio ya coprime kuuma mũigana ũmwe ũtarĩ 1.

select-from-sequence-excluded-too-many-combinations = Nĩ kwaeheririo gũkĩra 70% ya mĩtukanio harĩ selectFromSequence

select-from-sequence-coprime-none-found = Gũtiahotekire gũthuura mĩigana ya coprime. Mĩigana yothe ĩngĩhoteka ĩrĩ na kĩgayanĩri kĩmwe.

select-from-sequence-too-few-unique-values = Ndũngĩthuura mĩigana mĩamũre { $numToSelect } kuuma mũtaratara-inĩ wa ũraihu wa { $numPossibleValues }

select-prime-numbers-too-few-values = Ndũngĩthuura mĩigana { $numToSelect } kuuma mũtaratara-inĩ wa namba cia prime wa ũraihu wa { $numValues }

select-prime-numbers-values-count-mismatch = Mũigana wa mĩigana ĩrĩa yathuurirwo harĩ select no mũhaka ũiganane na mũigana wa gũthuura

select-prime-numbers-values-not-prime = Mĩigana yothe ĩrĩa yathuurirwo harĩ select prime number no mũhaka ĩkorwo ĩrĩ mũtaratara-inĩ wa namba cia prime

select-prime-numbers-values-excluded-combination = Mĩigana ĩrĩa yathuurirwo ya selectPrimeNumbers yarĩ mũtukanio ũrĩa waeheririo

select-prime-numbers-excluded-too-many-combinations = Nĩ kwaeheririo gũkĩra 70% ya mĩtukanio harĩ selectPrimeNumbers

select-random-combination-fluke = Nĩ ũndũ wa mũtino ũtetereirwo mũno, gũtiahotekire gũthuura mũtukanio wa mĩigana ĩtathuurĩtwo

select-random-value-fluke = Nĩ ũndũ wa mũtino ũtetereirwo mũno, gũtiahotekire gũthuura mũigana ũtathuurĩtwo
