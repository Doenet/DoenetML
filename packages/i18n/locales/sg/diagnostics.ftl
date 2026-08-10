# Sango diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# **Every counted message here is flat.** Sango has exactly one plural
# category, so a `{ $count -> … }` select could only ever write one branch, and
# the select is dropped rather than written out twice identically. The count
# argument then goes unused, which is harmless: it stays in the English message
# for the languages that need it.
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`
# and the rest — are part of the language rather than prose, and stay in
# English exactly as written. So does the `[deprecation]` marker.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = A bâa { $attributes } pëpe tônde a fa apoin ûse tî ndâ

line-segment-attributes-ignored-with-endpoint-and-midpoint = A bâa { $attributes } pëpe tônde a fa poin tî ndâ na poin tî bê kûê

line-segment-midpoint-offset-without-midpoint = midpointOffset ayeke na ngangü pëpe tônde poin tî bê ayeke dâ pëpe

## `<line>`

line-points-undetermined-dimensions = Lignë so ahön na apoin so kötä nî ahînga pëpe.

line-points-too-few-dimensions = Lignë alîngbi tî hön na apoin so kötä nî ayeke ûse wala ahön.

line-points-depend-on-variables = Lignë ahön na apoin so aluti na ndö tî agbïänngö-ye: { $variables }.

line-equation-invalid-format = Sarangö tî ekuasïon tî lignë na yâ tî agbïänngö-ye { $variable1 } na { $variable2 } ayeke tâ pëpe.

## `<ray>`

ray-overprescribed-through = A fa rêyon na through, endpoint na direction.  A bâa through so a fa pëpe.

ray-dimension-mismatch = numDimensions alîngbi na yâ tî rêyon pëpe.

## `<vector>`

vector-overprescribed-head = A fa vektëre na head, tail na displacement.  A bâa head so a fa pëpe.

vector-dimension-mismatch = numDimensions alîngbi na yâ tî vektëre pëpe.

## Attracting and constraining

attract-to-without-nearest-point = A lîngbi tî gbôto na `<{ $component }>` pëpe ndâli tî sô ayeke na gbïänngö-ye tî dutï nearestPoint pëpe.

constrain-to-without-nearest-point = A lîngbi tî kânga na `<{ $component }>` pëpe ndâli tî sô ayeke na gbïänngö-ye tî dutï nearestPoint pëpe.

constrain-to-interior-without-nearest-point = A lîngbi tî kânga na yâ tî `<{ $component }>` pëpe ndâli tî sô ayeke na gbïänngö-ye tî dutï nearestPoint pëpe.

## `<choiceInput>`

choice-input-label-position-ignored = A bâa labelPosition pëpe na choiceInput so ayeke tî inline pëpe

## Ordering children by index

choice-input-indices-count-mismatch = A bâa anömbre so a fa na choiceInput pëpe ndâli tî sô wüngö tî anömbre alîngbi na wüngö tî amôlengê tî sorongö pëpe.

pretzel-indices-count-mismatch = A bâa anömbre so a fa na problem pëpe ndâli tî sô wüngö tî anömbre alîngbi na wüngö tî amôlengê tî problem pëpe.

shuffle-indices-count-mismatch = A bâa anömbre so a fa na shuffle pëpe ndâli tî sô wüngö tî anömbre alîngbi na wüngö tî ambâgë pëpe.

indices-ignored-out-of-range = A bâa anömbre so a fa na { $component } pëpe ndâli tî sô ambênî ayeke na gîgî tî ndängö.

pretzel-indices-repeated = A bâa anömbre so a fa na pretzel pëpe ndâli tî sô a kîri na ambênî.

pretzel-circuit-first-index = A bâa anömbre so a fa na pretzel na yâ tî mode circuit pëpe ndâli tî sô kôzo nömbre alîngbi tî dutï 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Tîtene `<{ $component }>` asâra kua na amôlengê tî atënë, a lîngbi tî fa atribïi `type`.

invalid-type-defaulting-to-math = Marä { $type } ayeke tâ pëpe na mbâgë tî { $component }. A lîngbi tî dutï ôko tî math, text, number wala boolean. A zîa math tongana tî gîgî.

string-not-valid-component-to-arrange = Tënë "{ $value }" ayeke mbâgë so ayeke nzönî na { $component } pëpe. A bâa nî pëpe.

## Types and variables

invalid-type-defaulting-to-number = Marä { $type } ayeke tâ pëpe, a zîa marä na number.

invalid-variable-value = Wüngö tî gbïänngö-ye so ayeke tâ pëpe: `{ $value }`

## Variants

variant-index-must-be-number = Nömbre tî marä { $index } alîngbi tî dutï wüngö

variant-index-must-be-integer = Nömbre tî marä { $index } alîngbi tî dutï wüngö so akîri na ndâ

## `<sideBySide>`

side-by-side-absolute-widths = A leke `<{ $component }>` ndâli tî andängö so akîri na ndâ pëpe. A zîa alêgë na tî bängö.

side-by-side-absolute-margins = A leke `<{ $component }>` ndâli tî andängö so akîri na ndâ pëpe. A zîa ambâgë na tî bängö.

side-by-side-no-block-child = `<{ $component }>` so ayeke tâ pëpe: a lîngbi tî dutï na môlengê ôko tî bloko wala ahön.

## `<label>`

label-for-ignored-on-graphical = A bâa atribïi `for` na `<label>` tî fôto pëpe.

label-for-must-resolve-to-one = Atribïi `for` na `<label>` alîngbi tî fa gï mbâgë ôko.

label-for-unresolved = Atribïi `for` na `<label>` alîngbi tî fa mbâgë pëpe.

label-for-answer-with-authored-inputs = Atribïi `for` na `<label>` afa `<answer>` so ayeke na alïngö so wasûngö-mbëtï asû; fa lïngö nî mvenî.

label-for-answer-without-input = Atribïi `for` na `<label>` afa `<answer>` so ayeke na lïngö so a lîngbi tî zîa îri na nî pëpe.

label-for-must-reference-input-or-answer = Atribïi `for` na `<label>` alîngbi tî fa lïngö wala kîri-tënë.

## Accessibility

accessibility-short-description-or-decorative = Ndâli tî sïngö, `<{ $component }>` alîngbi tî dutï na kete fängö-ndâ wala a fa nî tongana decorative.

accessibility-video-short-description = Ndâli tî sïngö, `<video>` alîngbi tî dutï na kete fängö-ndâ.

accessibility-input-short-description-or-label = Ndâli tî sïngö, `<{ $component }>` alîngbi tî dutï na kete fängö-ndâ wala îri.

accessibility-answer-input-short-description-or-label = Ndâli tî sïngö, `<answer>` so aleke lïngö alîngbi tî dutï na kete fängö-ndâ wala îri.

accessibility-short-description-contains-math = Akete fängö-ndâ alîngbi tî dutï na ambâgë tî nömbre tongana `<{ $component }>` pëpe. Sû anömbre na atënë.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ayeke na kangbïngö so alîngbi ndâli tî mbëtï tî li tî mbâgë pëpe (lêgë tî vukö) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a hûnda { $threshold }:1 wala ahön).
       *[other] { $colorName } ayeke na kangbïngö so alîngbi ndâli tî mbëtï tî li tî mbâgë pëpe ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a hûnda { $threshold }:1 wala ahön).
    }

## `<circle>`

circle-through-points-non-numerical = A leke `<circle>` so ahön na apoin { $count } pëpe na ndo so apoin ayeke na awüngö tî nömbre pëpe.

circle-too-many-through-points = A lîngbi tî diko serkle so ahön na apoin so ahön otâ pëpe.

circle-overprescribed-radius-center-points = A lîngbi tî diko serkle na radiüs, bê na apoin so a fa pëpe.

circle-center-with-multiple-points = A lîngbi tî diko serkle na bê so a fa so ahön na poin so ahön ôko pëpe.

circle-radius-too-small = A lîngbi tî diko serkle pëpe: ndâli tî sô yöngö na pöpö tî apoin ûse ayeke { $distance }, radiüs { $radius } so a fa ayeke kete mîngi.

circle-radius-with-many-points = A lîngbi tî leke serkle so ahön na apoin so ahön ûse na radiüs so a fa pëpe.

circle-invalid-center-or-through-points = Bê wala apoin tî serkle ayeke tâ pëpe.

circle-radius-center-with-multiple-points = A lîngbi tî diko radiüs tî serkle na bê so a fa so ahön na poin so ahön ôko pëpe.

circle-change-radius-non-numerical = A lîngbi tî gbîan radiüs tî serkle so ahön na apoin so ayeke na anömbre pëpe

circle-radius-with-points-non-numerical = A lîngbi tî leke serkle so ahön na poin so ahön ôko na radiüs so a fa pëpe tônde awüngö tî nömbre ayeke dâ pëpe.

circle-change-center-non-numerical = A leke gbïänngö tî bê tî serkle so ahön na apoin so ayeke na awüngö tî nömbre pëpe.

## `<function>`

function-domain-insufficient-dimensions = Akötä ayeke na wüngö pëpe ndâli tî ndo tî kua. Ndo ayeke na angoi { $intervals } me kua ayeke na alïngö { $inputs }.

function-domain-invalid-format = Sarangö tî ndo tî kua ayeke tâ pëpe.

function-ignoring-non-numerical =
    { $type ->
        [maximum] A bâa kötä wüngö so ayeke tî nömbre pëpe tî kua pëpe.
        [minimum] A bâa kete wüngö so ayeke tî nömbre pëpe tî kua pëpe.
        [extremum] A bâa wüngö tî ndâ so ayeke tî nömbre pëpe tî kua pëpe.
        [point] A bâa poin so ayeke tî nömbre pëpe tî kua pëpe.
        [slope] A bâa vëkëngö so ayeke tî nömbre pëpe tî kua pëpe.
       *[other] A bâa { $type } so ayeke tî nömbre pëpe tî kua pëpe.
    }

function-ignoring-empty =
    { $type ->
        [maximum] A bâa kötä wüngö so ayeke sênge tî kua pëpe.
        [minimum] A bâa kete wüngö so ayeke sênge tî kua pëpe.
        [extremum] A bâa wüngö tî ndâ so ayeke sênge tî kua pëpe.
        [point] A bâa poin so ayeke sênge tî kua pëpe.
       *[other] A bâa { $type } so ayeke sênge tî kua pëpe.
    }

function-points-too-close = Kua ayeke na apoin ûse so ayeke ndurü mîngi. A lîngbi tî fa ndâ tî kua pëpe.

function-iterates-input-output-mismatch = A lîngbi tî kîri na kua gï tônde wüngö tî alïngö alîngbi na wüngö tî asïgïngö. Kua sô ayeke na alïngö { $inputs } na asïgïngö { $outputs }.

## `<sequence>`

sequence-invalid-length = Yöngö tî mölöngö ayeke tâ pëpe.  A lîngbi tî dutï wüngö so akîri na ndâ na so ayeke na gbe tî sênge pëpe.

sequence-invalid-step = Dutï tî mölöngö ayeke tâ pëpe.  A lîngbi tî dutï wüngö ndâli tî mölöngö tî marä { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" tî mölöngö tî awüngö ayeke tâ pëpe.  A lîngbi tî dutï wüngö.

sequence-invalid-endpoint-letters = "{ $attribute }" tî mölöngö tî alëtre ayeke tâ pëpe.  A lîngbi tî dutï bûngbïngö tî alëtre.

sequence-invalid-endpoint = "{ $attribute }" tî mölöngö ayeke tâ pëpe.

select-from-sequence-coprime-not-numbers = A bâa coprime pëpe ndâli tî sô a soro awüngö pëpe

select-from-sequence-coprime-with-exclude-combinations = A bâa coprime pëpe ndâli tî sô a fa excludeCombinations

## Resolving a `target`

target-not-found = Ndo so a gi ayeke tâ pëpe ndâli tî `<{ $source }>`: a wara ndo so a gi pëpe.

target-state-variable-not-found = Ndo so a gi ayeke tâ pëpe ndâli tî `<{ $source }>`: a wara gbïänngö-ye tî dutï so îri nî ayeke "{ $property }" na `<{ $component }>` pëpe.

## `<odeSystem>`

ode-system-variables-match-independent = Agbïänngö-ye tî `<odeSystem>` alîngbi tî dutï ndê na gbïänngö-ye so aluti mvenî.

ode-system-duplicate-variable-names = A lîngbi tî fa ndâ tî akua tî ODE RHS na aîri tî agbïänngö-ye so a kîri na nî pëpe.

ode-system-rhs-function-error = A lîngbi tî fa ndâ tî kua tî ODE RHS pëpe.  Fîon na lekengö kua tî mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = A lîngbi tî fa ndâ tî ängle na pöpö tî alignë { $count } pëpe

angle-invalid-through-point = Poin so ayeke tâ pëpe na through tî `<angle>`

parabola-vertex-too-many-points = A leke parabôle na li nî so ahön na poin so ahön ôko pëpe.

parabola-too-many-points = A leke parabôle so ahön na apoin so ahön otâ pëpe.

intersection-too-many-items = A leke bûngbïngö tî aye so ahön ûse pëpe

## Other math components

ionic-compound-not-two-ions = A leke bûngbïngö tî iôni so ayeke tî aiôni ûse pëpe pëpe.

ionic-compound-needs-cation-and-anion = A leke bûngbïngö tî iôni gï ndâli tî katiôni ôko na aniôni ôko.

solve-equations-cannot-evaluate = A lîngbi tî kîri na ndâ tî ekuasïon pëpe ndâli tî sô a lîngbi tî bâa nî pëpe: { $equation }

math-operators-operand-number-required = A lîngbi tî fa operandNumber tônde mo yeke zî operand tî nömbre.

eigen-decomposition-failed = A lîngbi tî diko awüngö tî eigen tî matrîs pëpe

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: aparamêtre { $parameters } ayeke na yâ tî sarangö nî pëpe, tîdâ ala yeke lîngbi lâkûê na ndo so ayeke sênge.

## `<graph>`

graph-grid-invalid = `<graph>`: a lîngbi tî mä yâ tî grid="{ $grid }" pëpe. A lîngbi tî dutï none, medium, dense, wala awüngö ûse so ahön sênge so ndo akângbi ala, tongana grid="1 0.5". A sâra grîye pëpe.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ayeke na mängö-maboko na wafängö-ye tî prefigure pëpe; a sâra kua na lêgë tî right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ayeke na mängö-maboko na wafängö-ye tî prefigure pëpe; a sâra kua na lêgë tî top.

prefigure-invalid-axis-bounds = `<graph>`: andâ tî aksi ayeke tâ pëpe ndâli tî gbïänngö tî prefigure; a sâra kua na bbox tî gîgî (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lêgë ayeke tâ pëpe ndâli tî gbïänngö tî prefigure; a sâra kua na lêgë tî gîgî 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ayeke tâ pëpe ndâli tî gbïänngö tî prefigure; a sâra kua na ndängö tî gîgî 1.

prefigure-grid-spacing-too-fine = `<graph>`: ndo na pöpö tî grîye ayeke kete mîngi ndâli tî andâ tî aksi; a zîa grîye na wafängö-ye tî prefigure pëpe.

prefigure-annotations-not-rendered = `<graph>`: a fa afängö-ndâ pëpe tônde a sâra kua na wafängö-ye tî PreFigure pëpe.

multiple-annotations-children = A wara amôlengê mîngi tî `<annotations>` na yâ tî `<graph>`; a bâa ala kûê pëpe, gï tî ndâ nî.

## Referring to other components

copy-unrecognized-component-type = A lîngbi tî gbâ wala tî kîri na marä tî mbâgë so a hînga pëpe: { $type }.

copy-prop-not-found = A wara atribïi { $property } na mbâgë tî marä { $component } pëpe

collect-no-source = A wara gündâ tî collect pëpe.

collect-invalid-component-type = A lîngbi tî bûngbi ambâgë tî marä `<{ $component }>` pëpe ndâli tî sô ayeke marä tî mbâgë so ayeke tâ pëpe.

reference-index-unavailable = A lîngbi tî fa nömbre `{ $reference }` pëpe

## `<callAction>`

component-action-unavailable = A lîngbi tî îri { $action } na mbâgë `{ $reference }` pëpe

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Datäa ayeke na sarangö so ayeke tâ pëpe.  Alignë ayeke na ayöngö so alîngbi pëpe. A wara nî na componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Datäa ayeke na aîri tî akolöne so a kîri na nî.  A wara nî na componentIdx :{ $componentIdx }

data-frame-missing-column-name = Datäa ayeke na îri tî kolöne pëpe.  A wara nî na componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award tî kîri-tënë sô aluti na ndö tî kîri-tënë tî tâge answer mvenî, sô ayeke ga na sarangö-ye so a kü nî pëpe.

answer-max-num-attempts-in-section-wide-check-work = Zïängö `maxNumAttempts` na `<answer>` so ayeke na yâ tî kubu so ayeke na `sectionWideCheckWork` ayeke na ngangü pëpe, ndâli tî sô kubu akomandê wüngö tî atarä. Zîa `maxNumAttempts` na kubu.

nested-section-wide-check-work-max-num-attempts = Zïängö `maxNumAttempts` na kubu so ayeke na `sectionWideCheckWork` so ayeke na yâ tî mbênî so ayeke na `sectionWideCheckWork` ayeke na ngangü pëpe, ndâli tî sô kubu tî gîgî akomandê wüngö tî atarä. Zîa `maxNumAttempts` na kubu tî gîgî.

answer-attributes-need-symbolic-equality = Atribïi { $attributes } ayeke na ngangü pëpe tônde symbolicEquality ayeke dâ pëpe.

answer-invalid-type = Marä tî kîri-tënë so ayeke tâ pëpe: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ndâli tî sô mbâgë `<{ $component }>` ayeke na îri pëpe, a lîngbi tî sâra kua na nî tongana atribïi tî module pëpe

module-attribute-name-already-defined = A lîngbi tî sâra kua na mbâgë `<{ $component } name="{ $name }">` tongana atribïi tî module pëpe ndâli tî sô marä tî mbâgë `<module>` ayeke na atribïi "{ $name }" awe.

conditional-content-condition-ignored = A bâa atribïi `condition` pëpe na mbâgë `<conditionalContent>` so ayeke na amôlengê tî case wala tî else.

slider-markers-type-mismatch = Marä tî afä alîngbi na marä tî slider pëpe.

pretzel-problem-needs-statement-and-answer = pretzel so ayeke tâ pëpe: `<problem>` ôko ôko alîngbi tî dutï na `<statement>` ôko na `<answer>` ôko.

pretzel-circuit-first-problem-distractor = pretzel so ayeke tâ pëpe: na mode="circuit", kôzo `<problem>` alîngbi tî dutï wagbïängö-li pëpe.

## Attribute values

attribute-invalid-values = Awüngö so ayeke tâ pëpe { $values } tî atribïi `{ $attribute }`; a bâa nî pëpe.

attribute-must-be-references = Wüngö so ayeke tâ pëpe `{ $value }` tî atribïi `{ $attribute }`. A lîngbi tî leke atribïi na afängö-ndo so atö ndâ na `$`.

math-input-invalid-function-names = <mathInput>: a bâa aîri tî kua so ayeke tâ pëpe na { $attribute } pëpe: { $names }. Mbâgë tî fängö tî îri ôko ôko alîngbi tî dutï na alëtre ûse wala ahön (alëtre wala akete lignë); `|<mathspeak alternative>` alîngbi tî ga na pekô.

## Building components from the source

component-type-invalid = Marä tî mbâgë so ayeke tâ pëpe: `<{ $componentType }>`

attribute-repeated = A lîngbi tî kîri na atribïi { $attribute } pëpe.

attribute-invalid-for-component = Atribïi "{ $attribute }" ayeke tâ pëpe ndâli tî mbâgë tî marä `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Fängö-ndâ tî stîle { $styleNumber } ayeke na kangbïngö so alîngbi pëpe ndâli tî { $context ->
        [text-on-background] küä tî mbëtï na ndö tî küä tî pekô
        [high-contrast] küä tî kötä kangbïngö na ndö tî kanvâ
        [line] küä tî lignë na ndö tî kanvâ
        [marker] küä tî fä na ndö tî kanvâ
       *[text-on-canvas] küä tî mbëtï na ndö tî kanvâ
    }{ $mode ->
        [dark] { " (lêgë tî vukö)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a hûnda { $threshold }:1 wala ahön).

style-definition-dark-mode-text-background-contrast =
    Atâa sô fängö-ndâ tî stîle { $styleNumber } afa aküä so ayeke na kangbïngö so alîngbi ndâli tî lêgë tî wâlâ, aküä tî lêgë tî vukö so ague na ndö tî awüngö sô ayeke na kangbïngö so alîngbi pëpe na pöpö tî küä tî mbëtï na küä tî pekô ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a hûnda { $threshold }:1 wala ahön). { $suggestion ->
        [available] Tîtene kangbïngö alîngbi na lêgë tî vukö, kîri kötä kangbïngö tî lêgë tî wâlâ (tapandë, zîa { $lightAttribute }="{ $lightColor }") wala gbîan küä tî lêgë tî vukö (tapandë, zîa { $darkAttribute }="{ $darkColor }").
       *[none] Tîtene kangbïngö alîngbi na lêgë tî vukö, kîri kötä kangbïngö tî lêgë tî wâlâ wala gbîan aküä sô na textColorDarkMode na/wala backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Atâa sô fängö-ndâ tî stîle { $styleNumber } afa küä tî mbëtï so ayeke na kangbïngö so alîngbi ndâli tî lêgë tî wâlâ, küä tî mbëtï tî lêgë tî vukö so ague na ndö tî wüngö sô ayeke na kangbïngö so alîngbi pëpe na ndö tî kanvâ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a hûnda { $threshold }:1 wala ahön). { $suggestion ->
        [available] Tîtene kangbïngö alîngbi na lêgë tî vukö, kîri kötä kangbïngö tî lêgë tî wâlâ (tapandë, zîa textColor="{ $lightColor }") wala gbîan küä tî lêgë tî vukö (tapandë, zîa textColorDarkMode="{ $darkColor }").
       *[none] Tîtene kangbïngö alîngbi na lêgë tî vukö, kîri kötä kangbïngö tî lêgë tî wâlâ wala gbîan küä sô na textColorDarkMode.
    }

section-multiple-style-palettes = Mbâgë alîngbi tî soro gï <stylePalette> ôko; a sâra kua na tî ndâ nî.

## Unique variants

variant-num-to-select-not-non-negative-integer = a lîngbi tî hînga amarä ndê tî { $component } pëpe ndâli tî sô numToSelect ayeke wüngö so akîri na ndâ na so ayeke na gbe tî sênge pëpe pëpe.

variant-num-to-select-not-constant-number = a lîngbi tî hînga amarä ndê tî { $component } pëpe ndâli tî sô numToSelect ayeke wüngö so agbîan pëpe pëpe.

variant-with-replacement-not-constant-boolean = a lîngbi tî hînga amarä ndê tî { $component } pëpe ndâli tî sô withReplacement ayeke boolean so agbîan pëpe pëpe.

variant-select-weight-disables-unique = A kânga amarä ndê tî select tônde mbênî sorongö ayeke na selectWeight wala selectForVariants

variant-coprime-undetermined = a lîngbi tî hînga amarä ndê tî { $component } pëpe ndâli tî sô a lîngbi tî hînga pëpe atâa coprime ayeke mvene lâkûê.

variant-attribute-not-constant = a lîngbi tî hînga amarä ndê tî { $component } pëpe ndâli tî sô { $attribute } angbâ ôko pëpe.

variant-attribute-not-number = a lîngbi tî hînga amarä ndê tî { $component } pëpe ndâli tî sô { $attribute } ayeke wüngö pëpe.

variant-attribute-wrong-type-for-sequence =
    a lîngbi tî hînga amarä ndê tî { $component } tî marä { $type } pëpe ndâli tî sô { $attribute } ayeke { $expected ->
        [letters-combination] bûngbïngö tî alëtre
        [math-expression] tënë tî nömbre so ayeke nzönî
        [integer] wüngö so akîri na ndâ
       *[number] wüngö
    } pëpe.

variant-length-not-integer = a lîngbi tî hînga amarä ndê tî { $component } pëpe ndâli tî sô length ayeke wüngö so akîri na ndâ pëpe.

variant-sort-not-implemented = a leke amarä ndê tî { $component } so ayeke na sort pëpe

variant-exclude-combinations-not-implemented = a leke amarä ndê tî { $component } so ayeke na excludeCombinations pëpe

variant-math-exclude-not-implemented = a leke amarä ndê tî { $component } tî marä math so ayeke na exclude pëpe

variant-non-constant-exclude-not-implemented = a leke amarä ndê tî { $component } so ayeke na exclude so agbîan pëpe

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ayeke na mängö-maboko na wafängö-ye tî graph prefigure pëpe; a zîa hâlëzo na pekô.

prefigure-descendant-invalid-geometry = { $subject }: zeometrïi so ahûnzi pëpe wala so alîngbi pëpe; a zîa hâlëzo na pekô.

prefigure-curve-label-omitted = { $subject }: aîri ayeke na mängö-maboko na ambâgë tî lignë so agbian so a gbîan pëpe; a zîa îri na pekô.

prefigure-curve-unsupported-definition-type = { $subject }: marä tî fängö-ndâ tî kua tî lignë so agbian '{ $definitionType }' ayeke na mängö-maboko pëpe; a zîa hâlëzo na pekô.

prefigure-region-flip-functions-unsupported = { $subject }: atribïi flipFunctions na regionBetweenCurves ayeke na mängö-maboko pëpe; a zîa hâlëzo na pekô.

prefigure-region-non-formula-child = { $subject }: gï akua tî amôlengê tî marä formula ayeke na mängö-maboko na regionBetweenCurves; a zîa hâlëzo na pekô.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ayeke na mängö-maboko pëpe ndâli tî { $labelKind ->
        [line-family] îri tî sëwä tî alignë
       *[point] îri tî poin
    }; a sâra kua na lïngbïngö tî gîgî tî PreFigure.

prefigure-fill-style-unsupported = { $subject }: stîle tî sïngö '{ $fillStyle }' ayeke na mängö-maboko tî PreFigure pëpe; a kîri na sïngö so angbâ ôko.

prefigure-line-style-unknown = { $subject }: stîle tî lignë so a hînga pëpe '{ $lineStyle }' a zîa nî na pekô na sïgïngö tî PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: a gbîan stîle tî fä '{ $markerStyle }' na stîle tî PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: stîle tî fä '{ $markerStyle }' ayeke na mängö-maboko tî PreFigure pëpe; a sâra kua na stîle tî gîgî.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ayeke tâ pëpe; a lîngbi tî wara ndo so a gi pëpe. A zîa fängö-ndâ na pekô.

annotation-ref-multiple-targets = `<annotation>`: `ref` afa ando mîngi; a sâra kua na kôzo ôko.

annotation-ref-outside-graph = `<annotation>`: `ref` ayeke tâ pëpe; ndo so a gi ayeke na gîgî tî graph so agbû nî. A zîa fängö-ndâ na pekô.

annotation-ref-unsupported-target = `<annotation>`: `ref` ayeke tâ pëpe; ndo so a gi ayeke ye tî fôto so ayeke na mängö-maboko na gbïänngö tî prefigure pëpe. A zîa fängö-ndâ na pekô.

annotation-text-missing = `<annotation>`: `text` ayeke dâ pëpe wala ayeke sênge; a sîgîgî na mbëtï so ayeke sênge.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] A wara lutïngö so akîri na tërê nî.
       *[other] A wara lutïngö so akîri na tërê nî so ayeke na mbâgë `<{ $componentType }>`.
    }

reference-no-referent = A wara mbênî ye pëpe na ndö tî fängö-ndo: `{ $reference }`

reference-multiple-referents = A wara aye mîngi na ndö tî fängö-ndo: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Sarangö tî atribïi { $attribute } tî `<{ $componentType }>` ayeke tâ pëpe.

children-invalid = Amôlengê so ayeke tâ pëpe tî `<{ $componentType }>`: A wara amôlengê so ayeke tâ pëpe: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Wüngö so ayeke tâ pëpe `{ $value }` tî atribïi `{ $attribute }`, a sâra kua na wüngö `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] A wara vêrsïon tî DoenetML { $version } pëpe.
       *[other] A wara vêrsïon tî DoenetML { $version } pëpe. A kîri na vêrsïon { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML so ayeke tâ pëpe: { $content }

parse-tag-missing-close-tag = DoenetML so ayeke tâ pëpe: Tâge `{ $tag }` ayeke na tâge tî kângängö pëpe. A kü tâge so akânga tërê nî wala tâge `</{ $tagName }>`.

parse-tag-error = DoenetML so ayeke tâ pëpe: Fîon na tâge `<{ $tagName }>`

parse-attribute-missing-value = DoenetML so ayeke tâ pëpe: Atribïi so ayeke tâ pëpe `{ $attribute }` abâa tongana ayeke na wüngö pëpe.

parse-attribute-invalid = DoenetML so ayeke tâ pëpe: Atribïi so ayeke tâ pëpe `{ $attribute }`

parse-attribute-value-invalid = DoenetML so ayeke tâ pëpe: Wüngö tî atribïi so ayeke tâ pëpe `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML so ayeke tâ pëpe: Wüngö tî atribïi so ayeke tâ pëpe `{ $value }`. Afä tî kïtëngö alîngbi pëpe. Abâa tongana `{ $quote }` ayeke dâ pëpe

parse-open-tag-name-missing = DoenetML so ayeke tâ pëpe: A wara tâge so ayeke na îri pëpe, tapandë `<`

parse-tag-not-closed = DoenetML so ayeke tâ pëpe: A kânga tâge `{ $tag }` pëpe (abâa tongana `>` ayeke dâ pëpe).

parse-self-closing-tag-name-missing = DoenetML so ayeke tâ pëpe: A wara tâge so ayeke na îri pëpe `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML so ayeke tâ pëpe: A kânga tâge `{ $tag }` pëpe (abâa tongana `/>` ayeke dâ pëpe).

parse-tag-invalid-attributes = DoenetML so ayeke tâ pëpe: Tâge `{ $tag }` ayeke nzönî pëpe. Alîngbi tî dutï na atribïi so ayeke tâ pëpe.

parse-close-tag-name-missing = DoenetML so ayeke tâ pëpe: A wara tâge tî kângängö so ayeke na îri pëpe, tapandë `</`

parse-attribute-value-unquoted = Awüngö tî atribïi alîngbi tî dutï na pöpö tî afä tî kïtëngö: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML so ayeke tâ pëpe: A wara tâge tî kângängö `{ $tag }`, me tâge tî zïngö so alîngbi na nî ayeke dâ pëpe

parse-close-tag-mismatched = DoenetML so ayeke tâ pëpe: Tâge tî kângängö alîngbi pëpe. A kü `</{ $expected }>`. A wara `{ $found }`

parser-node-unconvertible = A lîngbi tî gbîan nôde { $node } na nôde tî Dast pëpe.

## Names

name-attribute-invalid =
    Îri tî atribïi ayeke tâ pëpe name='{ $name }'. { $reason ->
        [characters] Aîri alîngbi tî dutï gï na alëtre, anömbre, alignë tî gbe wala akete lignë.
       *[start] Aîri alîngbi tî tö ndâ na lëtre.
    }

component-name-invalid-start = Îri tî mbâgë ayeke tâ pëpe "{ $name }". Aîri alîngbi tî tö ndâ na lëtre.

## `<answer>` sugar

answer-video-watched-missing-video = Kîri-tënë tî marä videoWatched alîngbi tî dutï na atribïi video

answer-video-watched-video-not-reference = Kîri-tënë tî marä videoWatched alîngbi tî dutï na atribïi video so ayeke fängö-ndo

answer-name-not-single-text = Atribïi name tî kîri-tënë alîngbi tî dutï na môlengê ôko tî mbëtï

## Referencing another document

external-doenetml-recursion-limit = A lîngbi tî gä na DoenetML tî gîgî pëpe ndâli tî akûngbi mîngi tî kîrïngö. Mbênî fängö-ndo so akîri na tërê nî ayeke dâ?

external-doenetml-unavailable = A lîngbi tî gä na DoenetML tî { $attribute }="{ $uri }" pëpe

external-doenetml-type-mismatch = DoenetML so a gä na nî tî { $attribute }="{ $uri }" ayeke tâ pëpe: alîngbi na marä tî mbâgë "{ $componentType }" pëpe

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] A sâra kua na atribïi `{ $from }` mbênî pëpe; sâra kua na `{ $to }` na ndo nî.
       *[other] [deprecation] A sâra kua na atribïi `{ $from }` na `<{ $component }>` mbênî pëpe; sâra kua na `{ $to }` na ndo nî.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] A sâra kua na atribïi `{ $from }` mbênî pëpe na a bâa nî pëpe ndâli tî sô a fa `{ $to }` nga.
       *[other] [deprecation] A sâra kua na atribïi `{ $from }` na `<{ $component }>` mbênî pëpe na a bâa nî pëpe ndâli tî sô a fa `{ $to }` nga.
    }

deprecated-attribute-ignored = [deprecation] A sâra kua na atribïi `{ $attribute }` na `<{ $component }>` mbênî pëpe na a bâa nî pëpe.

deprecated-attribute-to-child = [deprecation] A sâra kua na atribïi `{ $attribute }` na `<{ $component }>` mbênî pëpe; sâra kua na môlengê `<{ $child }>` na ndo nî.

deprecated-attribute-value-renamed = [deprecation] A sâra kua na wüngö `{ $value }` tî atribïi `{ $attribute }` na `<{ $component }>` mbênî pëpe; sâra kua na `{ $to }` na ndo nî.


## Language coverage

pluralize-english-only = `<pluralize>` alîngbi tî sâra gbâ gï na Angelëe, tîdâ a zîa mbëtï tî nî tongana sô na yâ tî mbëtï so a sû na { $locale }. Sû sarangö tî gbâ mvenî, wala zîa nî na atribïi `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Mbâgë `<{ $tag }>` ayeke mbâgë tî Doenet so a hînga nî pëpe.

schema-element-not-allowed-at-root = A yêda na mbâgë `<{ $tag }>` na gündâ tî mbëtï pëpe.

schema-element-not-allowed-inside = A yêda na mbâgë `<{ $tag }>` na yâ tî `<{ $parent }>` pëpe.

schema-attribute-unrecognized = Mbâgë `<{ $tag }>` ayeke na atribïi so îri nî ayeke `{ $attribute }` pëpe.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribïi `{ $attribute }` tî mbâgë `<{ $tag }>` alîngbi tî dutï mölöngö so aye tî nî ôko ôko ayeke ôko tî: { $allowed }
       *[other] Atribïi `{ $attribute }` tî mbâgë `<{ $tag }>` alîngbi tî dutï ôko tî: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Îri tî marä ayeke tâ pëpe na select.  Îri tî marä { $variantName } asîgîgî na asorongö { $numOptions } me wüngö tî sorongö ayeke { $numToSelect }.

select-variant-name-without-options = A fa ambênî marä na select me a fa asorongö ndâli tî îri tî marä so alîngbi tî dutï pëpe: { $variantName }.

select-variant-name-not-possible = Îri tî marä { $variantName } so a fa na select ayeke îri tî marä so alîngbi tî dutï pëpe.

select-too-few-options = A lîngbi tî soro ambâgë { $numToSelect } na yâ tî gï { $numOptions } pëpe.

select-from-sequence-too-few-values = A lîngbi tî soro awüngö { $numToSelect } na yâ tî mölöngö tî yöngö { $length } pëpe.

select-from-sequence-indices-count-mismatch = Wüngö tî anömbre so a fa na select alîngbi tî lîngbi na wüngö tî sorongö

select-from-sequence-indices-not-integers = Anömbre kûê so a fa na select alîngbi tî dutï awüngö so akîri na ndâ

select-from-sequence-index-excluded = A zî nömbre so a fa tî selectfromsequence na pekô

select-from-sequence-indices-excluded-combination = Anömbre so a fa tî selectfromsequence ayeke bûngbïngö so a zî na pekô

select-from-sequence-coprime-not-positive-integers = A lîngbi tî soro abûngbïngö tî coprime pëpe ndâli tî sô a soro awüngö so akîri na ndâ na so ahön sênge pëpe.

select-from-sequence-coprime-common-factor = A lîngbi tî soro awüngö tî coprime pëpe. Awüngö kûê so alîngbi ayeke na fakitëre ôko. (Awüngö so a fa tî "from" wala "to" alîngbi tî dutï coprime na "step".)

select-from-sequence-coprime-single-number = A lîngbi tî soro abûngbïngö tî coprime na wüngö ôko so ayeke 1 pëpe pëpe.

select-from-sequence-excluded-too-many-combinations = A zî ahön 70% tî abûngbïngö na pekô na selectFromSequence

select-from-sequence-coprime-none-found = A lîngbi tî soro awüngö tî coprime pëpe. Awüngö kûê so alîngbi ayeke na fakitëre ôko.

select-from-sequence-too-few-unique-values = A lîngbi tî soro awüngö ndê { $numToSelect } na yâ tî mölöngö tî yöngö { $numPossibleValues } pëpe

select-prime-numbers-too-few-values = A lîngbi tî soro awüngö { $numToSelect } na yâ tî mölöngö tî anömbre prime tî yöngö { $numValues } pëpe

select-prime-numbers-values-count-mismatch = Wüngö tî awüngö so a fa na select alîngbi tî lîngbi na wüngö tî sorongö

select-prime-numbers-values-not-prime = Awüngö kûê so a fa na select prime number alîngbi tî dutï na yâ tî mölöngö tî anömbre prime

select-prime-numbers-values-excluded-combination = Awüngö so a fa tî selectPrimeNumbers ayeke bûngbïngö so a zî na pekô

select-prime-numbers-excluded-too-many-combinations = A zî ahön 70% tî abûngbïngö na pekô na selectPrimeNumbers

select-random-combination-fluke = Na mbênî ye so a kü nî pëpe mîngi, a lîngbi tî soro bûngbïngö tî awüngö tî sênge pëpe

select-random-value-fluke = Na mbênî ye so a kü nî pëpe mîngi, a lîngbi tî soro wüngö tî sênge pëpe
