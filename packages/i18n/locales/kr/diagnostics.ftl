# Kanuri diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] { $attributes } burcin poyintwa kǝska ndi lawanzǝna-ga
       *[other] { $attributes } burcin poyintwa kǝska ndi lawanzǝna-ga
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } burcin poyint kǝskabe be poyint kǝlaben kambe lawanzǝna-ga
       *[other] { $attributes } burcin poyint kǝskabe be poyint kǝlaben kambe lawanzǝna-ga
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset jiliwuni poyint kǝlaben bago-ga

## `<line>`

line-points-undetermined-dimensions = Layin poyintwa kura sǝnǝni-ben cauwin.

line-points-too-few-dimensions = Layin poyintwa kura ndi ya kurabe-ben cauwuwu gǝnzǝ.

line-points-depend-on-variables = Layin poyintwa nduwa gǝrǝginzǝ-ro dǝganzǝ-ben cauwin: { $variables }.

line-equation-invalid-format = Layin-be ekwashan suratu ngǝlani nduwa gǝrǝginzǝ { $variable1 } be { $variable2 }-ben.

## `<ray>`

ray-overprescribed-through = Rei through, endpoint be direction-a lawanzǝna.  through lawanzǝnaga burcǝye.

ray-dimension-mismatch = numDimensions rei-ben zǝmani.

## `<vector>`

vector-overprescribed-head = Bekta head, tail be displacement-a lawanzǝna.  head lawanzǝnaga burcǝye.

vector-dimension-mismatch = numDimensions bekta-ben zǝmani.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>`-ro jǝlawu gǝni, nearestPoint alama bago-ga.

constrain-to-without-nearest-point = `<{ $component }>`-ro dǝgawu gǝni, nearestPoint alama bago-ga.

constrain-to-interior-without-nearest-point = `<{ $component }>`-ben dǝgawu gǝni, nearestPoint alama bago-ga.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition burcin choiceInput layin-ben bago-ro

## Ordering children by index

choice-input-indices-count-mismatch = indices choiceInput-ro lawanzǝnaga burcǝye, indices-be kǝlkǝl choice-be tadawa-be kǝlkǝl-a zǝmani-ga.

pretzel-indices-count-mismatch = indices problem-ro lawanzǝnaga burcǝye, indices-be kǝlkǝl problem-be tadawa-be kǝlkǝl-a zǝmani-ga.

shuffle-indices-count-mismatch = indices shuffle-ro lawanzǝnaga burcǝye, indices-be kǝlkǝl fartuwa-be kǝlkǝl-a zǝmani-ga.

indices-ignored-out-of-range = indices { $component }-ro lawanzǝnaga burcǝye, gadewa kǝskalan iscǝna-ga.

pretzel-indices-repeated = indices pretzel-ro lawanzǝnaga burcǝye, gadewa ndi-ye ruwucǝna-ga.

pretzel-circuit-first-index = indices pretzel-ro mode="circuit"-ben lawanzǝnaga burcǝye, kǝntǝwube 1 gǝnzǝ-ga.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` kalam tadawa-a jiliwunzǝ-ro, `type` alamaga lawuwu gǝni.

invalid-type-defaulting-to-math = Suratu { $type } { $component }-ro ngǝlani. math, text, number ya boolean gǝnzǝ. math-ro gǝrǝcǝye.

string-not-valid-component-to-arrange = Kalam "{ $value }" { $component }-ro fartu ngǝla bago. Burcǝye.

## Types and variables

invalid-type-defaulting-to-number = Suratu { $type } ngǝlani, suratuga number-ro lawucǝye.

invalid-variable-value = Ndu gǝrǝginzǝ-be kǝlkǝl ngǝlani: `{ $value }`

## Variants

variant-index-must-be-number = Suratu alama { $index } kǝlkǝl gǝnzǝ

variant-index-must-be-integer = Suratu alama { $index } kǝlkǝl kambe gǝnzǝ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` kǝlkǝlwa gǝrǝginzǝni-a ruwucǝni. Kuraga kǝlkǝl-ro lawucǝye.

side-by-side-absolute-margins = `<{ $component }>` kǝlkǝlwa gǝrǝginzǝni-a ruwucǝni. Kǝskawaga kǝlkǝl-ro lawucǝye.

side-by-side-no-block-child = `<{ $component }>` ngǝlani: tada fartube tilo gǝnzǝ.

## `<label>`

label-for-ignored-on-graphical = `for` alama suratu `<label>`-ro burcin.

label-for-must-resolve-to-one = `for` alama `<label>`-ro fartu tilo cirǝgǝnzǝ.

label-for-unresolved = `for` alama `<label>`-ro fartuga cirǝgǝ gǝni.

label-for-answer-with-authored-inputs = `for` alama `<label>`-ro `<answer>` lawuwa ruwumaye ruwucǝnaga cirǝgin; lawuga tilo cirǝge.

label-for-answer-without-input = `for` alama `<label>`-ro `<answer>` lawu cin lawuwube bago-ga cirǝgin.

label-for-must-reference-input-or-answer = `for` alama `<label>`-ro lawu ya jawabga cirǝgǝnzǝ.

## Accessibility

accessibility-short-description-or-decorative = Jǝm-ro, `<{ $component }>` fasar dibi gǝnzǝ ya ngǝla-ro lawanzǝnzǝ.

accessibility-video-short-description = Jǝm-ro, `<video>` fasar dibi gǝnzǝ.

accessibility-input-short-description-or-label = Jǝm-ro, `<{ $component }>` fasar dibi ya cin gǝnzǝ.

accessibility-answer-input-short-description-or-label = Jǝm-ro, `<answer>` lawuga ruwucin fasar dibi ya cin gǝnzǝ.

accessibility-short-description-contains-math = Fasar dibiwa kǝlkǝl fartuwa `<{ $component }>`-a gǝnzǝni. Kǝlkǝlwa kambe kalamwa-a ruwuge.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } fartu-be cin kalam-ro gǝrǝwu ngǝla bago (kǝlaben) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 ya kurabe gǝnzǝ).
       *[other] { $colorName } fartu-be cin kalam-ro gǝrǝwu ngǝla bago ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 ya kurabe gǝnzǝ).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` poyintwa { $count }-ben cauwinzǝ ruwucǝni poyintwa kǝlkǝl bago-ga.

circle-too-many-through-points = Sekul poyintwa 3 ya kurabe-ben cauwinzǝ kǝlkǝlwu gǝni.

circle-overprescribed-radius-center-points = Sekul rediyus, kǝla kǝlaben be poyintwa kambe lawanzǝna kǝlkǝlwu gǝni.

circle-center-with-multiple-points = Sekul kǝla kǝlaben-a poyint 1 ya kurabe-ben cauwinzǝ kǝlkǝlwu gǝni.

circle-radius-too-small = Sekulga kǝlkǝlwu gǝni: poyintwa ndi-be kǝska { $distance } gǝnzǝ-ga, rediyus { $radius } lawanzǝna dibi kura.

circle-radius-with-many-points = Sekul poyintwa ndi ya kurabe-ben cauwinzǝ rediyus lawanzǝna-a ruwuwu gǝni.

circle-invalid-center-or-through-points = Sekul-be kǝla kǝlaben ya poyintwanzǝ ngǝlani.

circle-radius-center-with-multiple-points = Sekul kǝla kǝlaben-a poyint 1 ya kurabe-ben cauwinzǝ-be rediyusga kǝlkǝlwu gǝni.

circle-change-radius-non-numerical = Sekul poyintwa kǝlkǝl bago-a-be rediyusga gǝrǝwu gǝni

circle-radius-with-points-non-numerical = Sekul poyint tilo ya kurabe-ben cauwinzǝ rediyus lawanzǝna-a ruwuwu gǝni kǝlkǝlwa bago-ga.

circle-change-center-non-numerical = Sekul poyintwa kǝlkǝl bago-ben cauwinzǝ-be kǝla kǝlaben gǝrǝwuga ruwucǝni.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Kura fankshan-be kǝla-ro ngǝlani. Kǝla fartu { $intervals } jinzǝ amma fankshan { $inputs ->
            [one] lawu { $inputs }
           *[other] lawuwa { $inputs }
        } jinzǝ.
       *[other] Kura fankshan-be kǝla-ro ngǝlani. Kǝla fartuwa { $intervals } jinzǝ amma fankshan { $inputs ->
            [one] lawu { $inputs }
           *[other] lawuwa { $inputs }
        } jinzǝ.
    }

function-domain-invalid-format = Fankshan-be kǝla-be suratu ngǝlani.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Fankshan-be kǝlabe kǝlkǝl bago-ga burcǝye.
        [minimum] Fankshan-be kǝskabe kǝlkǝl bago-ga burcǝye.
        [extremum] Fankshan-be kǝska kǝlkǝl bago-ga burcǝye.
        [point] Fankshan-be poyint kǝlkǝl bago-ga burcǝye.
        [slope] Fankshan-be gǝnyi kǝlkǝl bago-ga burcǝye.
       *[other] Fankshan-be { $type } kǝlkǝl bago-ga burcǝye.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Fankshan-be kǝlabe bagoga burcǝye.
        [minimum] Fankshan-be kǝskabe bagoga burcǝye.
        [extremum] Fankshan-be kǝska bagoga burcǝye.
        [point] Fankshan-be poyint bagoga burcǝye.
       *[other] Fankshan-be { $type } bagoga burcǝye.
    }

function-points-too-close = Fankshan poyintwa ndi kǝskan jinzǝ. Fankshanga lawuwu gǝni.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Fankshan-be gǝrǝwu lawuwa-be kǝlkǝl iswuwa-be kǝlkǝl-a zǝmanzǝ-ga sǝye ruwucin. Fankshan adǝ lawu { $inputs } be { $outputs ->
            [one] iswu { $outputs }
           *[other] iswuwa { $outputs }
        } jinzǝ.
       *[other] Fankshan-be gǝrǝwu lawuwa-be kǝlkǝl iswuwa-be kǝlkǝl-a zǝmanzǝ-ga sǝye ruwucin. Fankshan adǝ lawuwa { $inputs } be { $outputs ->
            [one] iswu { $outputs }
           *[other] iswuwa { $outputs }
        } jinzǝ.
    }

## `<sequence>`

sequence-invalid-length = Tǝrtiwu-be kura ngǝlani.  Kǝlkǝl kambe zero-lan kǝskan bago gǝnzǝ.

sequence-invalid-step = Tǝrtiwu-be kǝnyi ngǝlani.  Tǝrtiwu suratu { $type }-ro kǝlkǝl gǝnzǝ.

sequence-invalid-endpoint-number = Kǝlkǝl tǝrtiwu-be "{ $attribute }" ngǝlani.  Kǝlkǝl gǝnzǝ.

sequence-invalid-endpoint-letters = Ruwuwu tǝrtiwu-be "{ $attribute }" ngǝlani.  Ruwuwuwa-be kǝlanzǝ gǝnzǝ.

sequence-invalid-endpoint = Tǝrtiwu-be "{ $attribute }" ngǝlani.

select-from-sequence-coprime-not-numbers = coprime burcǝna kǝlkǝlwa sanawunzǝni-ga

select-from-sequence-coprime-with-exclude-combinations = coprime burcǝna excludeCombinations lawanzǝna-ga

## Resolving a `target`

target-not-found = target `<{ $source }>`-ro ngǝlani: targetga rukcǝye.

target-state-variable-not-found = target `<{ $source }>`-ro ngǝlani: alama cinzǝ "{ $property }" `<{ $component }>`-ro rukcǝye.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-be nduwa gǝrǝginzǝ ndu gǝrǝginzǝ tiloben-a gǝrǝnzǝ.

ode-system-duplicate-variable-names = ODE RHS fankshanwa nduwa gǝrǝginzǝ-be cinwa ndi-ye ruwucǝna-a lawuwu gǝni.

ode-system-rhs-function-error = ODE RHS fankshanga lawuwu gǝni.  Karsa mathjs fankshan ruwuwuben.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Layinwa { $count }-be kǝlan kǝnyiga lawuwu gǝni

angle-invalid-through-point = Poyint ngǝlani `<angle>`-be through-ben

parabola-vertex-too-many-points = Parabola kǝnyi-a poyint 1 ya kurabe-ben cauwinzǝ ruwucǝni.

parabola-too-many-points = Parabola poyintwa 3 ya kurabe-ben cauwinzǝ ruwucǝni.

intersection-too-many-items = Nduwa ndi ya kurabe-ro zǝmawuga ruwucǝni

## Other math components

ionic-compound-not-two-ions = Ayon kǝlanzǝga ayon ndi bago-ro ruwucǝni.

ionic-compound-needs-cation-and-anion = Ayon kǝlanzǝ katiyon tilo be aniyon tilo-ro sǝye ruwucǝna.

solve-equations-cannot-evaluate = Ekwashanga kǝlanzǝwu gǝni, kǝlkǝlwu gǝni-ga: { $equation }

math-operators-operand-number-required = operandNumberga lawuwu gǝnzǝ kǝlkǝl operandga burcinzǝ-ga.

eigen-decomposition-failed = Matriks-be eigenvalues kǝlkǝlwu gǝni

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameta { $parameters } pattern-ben bago, adǝ-ro kǝnowu kambe bago-a zǝmanzǝ.
       *[other] `<matchesPattern>`: parametawa { $parameters } pattern-ben bago, adǝ-ro kǝnowu kambe bago-a zǝmanzǝ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }"-ga sǝnǝye gǝni. none, medium, dense, ya kǝlkǝlwa ngǝla ndi kǝska-a kǝlanzǝna gǝnzǝ, grid="1 0.5"-ga. Grid ruwucǝni.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" prefigure cirǝgema-ben lawanzǝni; kǝska ngǝlabe-ga jiliwucǝye.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" prefigure cirǝgema-ben lawanzǝni; kǝlabe-ga jiliwucǝye.

prefigure-invalid-axis-bounds = `<graph>`: aksis-be kǝskawa prefigure gǝrǝwu-ro ngǝlani; bbox kǝnowube-a jiliwucǝye (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: kura prefigure gǝrǝwu-ro ngǝlani; suratu-be kura kǝnowube-a jiliwucǝye 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio prefigure gǝrǝwu-ro ngǝlani; kǝlkǝl kǝnowube-a jiliwucǝye 1.

prefigure-grid-spacing-too-fine = `<graph>`: grid-be kǝska dibi kura aksis-be kǝskawa-ro; grid prefigure cirǝgema-ben ruwucǝni.

prefigure-annotations-not-rendered = `<graph>`: fasarwa ruwucǝni PreFigure cirǝgema jiliwuni-ga.

multiple-annotations-children = `<annotations>` tadawa kura `<graph>`-ben rukcǝna; kambe burcǝna kǝskabe bago.

## Referring to other components

copy-unrecognized-component-type = Fartu suratu sǝnǝnzǝni-ga zawuwu ya kopiwu gǝni: { $type }.

copy-prop-not-found = prop { $property } fartu suratu { $component }-ro rukcǝye

collect-no-source = collect-be kǝla rukcǝni.

collect-invalid-component-type = Fartuwa suratu `<{ $component }>`-ga kǝlanzǝwu gǝni, suratu ngǝlani-ga.

reference-index-unavailable = Alama `{ $reference }`-ga cirǝgǝwu gǝni

## `<callAction>`

component-action-unavailable = { $action }-ga fartu `{ $reference }`-ro yiwu gǝni

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Kalamwa-be suratu ngǝlani.  Layinwa-be kura zǝmani. componentIdx :{ $componentIdx }-ben rukcǝna

data-frame-duplicate-column-names = Kalamwa kolom cinwa ndi-ye ruwucǝna jinzǝ.  componentIdx :{ $componentIdx }-ben rukcǝna

data-frame-missing-column-name = Kalamwa-ben kolom cin bago.  componentIdx :{ $componentIdx }-ben rukcǝna

## `<answer>` and scoring

answer-award-depends-on-own-response = Jawab adǝ-be poyintwa tagi tilo sadinzǝna jawab-ro dǝganzǝ, adǝ ndu sǝnǝnzǝni-ga iswuwu.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts`-ga `<answer>` fartu `sectionWideCheckWork`-a-ben lawuwu ndu ruwuni, fartu karangiwa-be kǝlkǝlga ngǝwucin-ga. `maxNumAttempts`-ga fartu-ro lawuge.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts`-ga fartu `sectionWideCheckWork`-a fartu gade `sectionWideCheckWork`-a-ben lawuwu ndu ruwuni, fartu kǝskabe karangiwa-be kǝlkǝlga ngǝwucin-ga. `maxNumAttempts`-ga fartu kǝskabe-ro lawuge.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Alama { $attributes } ndu ruwuni symbolicEquality lawanzǝni-ga.
       *[other] Alamawa { $attributes } ndu ruwuni symbolicEquality lawanzǝni-ga.
    }

answer-invalid-type = Jawab suratu ngǝlani: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Fartu `<{ $component }>` cin bago-ga, module alama-ga jiliwuwu gǝni

module-attribute-name-already-defined = Fartu `<{ $component } name="{ $name }">` module alama-ga jiliwuwu gǝni, suratu `<module>` alama "{ $name }" jinzǝ-ga.

conditional-content-condition-ignored = `condition` alama `<conditionalContent>` case ya else tadawa-a-ro burcin.

slider-markers-type-mismatch = Alamawa-be suratu slider-be suratu-a zǝmani.

pretzel-problem-needs-statement-and-answer = pretzel ngǝlani: `<problem>` kambe `<statement>` tilo be `<answer>` tilo gǝnzǝ.

pretzel-circuit-first-problem-distractor = pretzel ngǝlani: mode="circuit"-ben, `<problem>` kǝntǝwube distractor gǝnzǝni.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Kǝlkǝl ngǝlani { $values } alama `{ $attribute }`-ro; burcǝye.
       *[other] Kǝlkǝlwa ngǝlani { $values } alama `{ $attribute }`-ro; burcǝye.
    }

attribute-must-be-references = Kǝlkǝl `{ $value }` alama `{ $attribute }`-ro ngǝlani. Alama cirǝwuwa `$`-a kǝntǝginzǝ-a ruwanzǝnzǝ.

math-input-invalid-function-names = <mathInput>: fankshan cinwa ngǝlani { $attribute }-ben burcǝye: { $names }. Cin kambe-be cirǝwu fartu ruwuwuwa 2 ya kurabe gǝnzǝ (ruwuwuwa ya kǝskawa); `|<mathspeak alternative>`-ga zawuwu gǝnzǝ.

## Building components from the source

component-type-invalid = Fartu suratu ngǝlani: `<{ $componentType }>`

attribute-repeated = Alama { $attribute }-ga ndi-ye ruwuwu gǝni.

attribute-invalid-for-component = Alama "{ $attribute }" fartu suratu `<{ $componentType }>`-ro ngǝlani.

## Style definition contrast

style-definition-insufficient-contrast =
    Suratu { $styleNumber }-be fasar gǝrǝwu ngǝla bago { $context ->
        [text-on-background] kalam-be cin kǝska-be cin-ro
        [high-contrast] gǝrǝwu kurabe-be cin alama-ro
        [line] layin-be cin alama-ro
        [marker] alama-be cin alama-ro
       *[text-on-canvas] kalam-be cin alama-ro
    }{ $mode ->
        [dark] { " (kǝlaben)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 ya kurabe gǝnzǝ).

style-definition-dark-mode-text-background-contrast =
    Suratu { $styleNumber }-be fasar cinwa gǝrǝwu ngǝla ncawuben jinzǝ amma, kǝlaben cinwa lan iscǝna kalam-be cin be kǝska-be cin-be kǝlan gǝrǝwu ngǝla bago ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 ya kurabe gǝnzǝ). { $suggestion ->
        [available] Kǝlaben gǝrǝwu ngǝla gǝnzǝ-ro, ncawuben gǝrǝwuga zawuge (misal, { $lightAttribute }="{ $lightColor }" lawuge) ya kǝlaben cinga gǝrǝge (misal, { $darkAttribute }="{ $darkColor }" lawuge).
       *[none] Kǝlaben gǝrǝwu ngǝla gǝnzǝ-ro, ncawuben gǝrǝwuga zawuge ya cinwa lan iscǝna-ga textColorDarkMode ya backgroundColorDarkMode-a gǝrǝge.
    }

style-definition-dark-mode-text-canvas-contrast =
    Suratu { $styleNumber }-be fasar kalam-be cin gǝrǝwu ngǝla ncawuben jinzǝ amma, kǝlaben kalam-be cin lan iscǝna alama-ro gǝrǝwu ngǝla bago ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 ya kurabe gǝnzǝ). { $suggestion ->
        [available] Kǝlaben gǝrǝwu ngǝla gǝnzǝ-ro, ncawuben gǝrǝwuga zawuge (misal, textColor="{ $lightColor }" lawuge) ya kǝlaben cinga gǝrǝge (misal, textColorDarkMode="{ $darkColor }" lawuge).
       *[none] Kǝlaben gǝrǝwu ngǝla gǝnzǝ-ro, ncawuben gǝrǝwuga zawuge ya cin lan iscǝna-ga textColorDarkMode-a gǝrǝge.
    }

section-multiple-style-palettes = Fartu <stylePalette> tilo sanawunzǝ; kǝskabe-a jiliwucǝye.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component }-be suratuwa ndi-ye ruwucǝni-ga sǝnǝwu gǝni, numToSelect kǝlkǝl kambe zero-lan kǝskan bago gǝni-ga.

variant-num-to-select-not-constant-number = { $component }-be suratuwa ndi-ye ruwucǝni-ga sǝnǝwu gǝni, numToSelect kǝlkǝl gǝrǝginzǝni gǝni-ga.

variant-with-replacement-not-constant-boolean = { $component }-be suratuwa ndi-ye ruwucǝni-ga sǝnǝwu gǝni, withReplacement boolean gǝrǝginzǝni gǝni-ga.

variant-select-weight-disables-unique = select-be suratuwa ndi-ye ruwucǝni-ga dǝgacin sanawu selectWeight ya selectForVariants jinzǝ-ga

variant-coprime-undetermined = { $component }-be suratuwa ndi-ye ruwucǝni-ga sǝnǝwu gǝni, coprime kǝnowu kambe false gǝnzǝ-ga sǝnǝwu gǝni-ga.

variant-attribute-not-constant = { $component }-be suratuwa ndi-ye ruwucǝni-ga sǝnǝwu gǝni, { $attribute } gǝrǝgin-ga.

variant-attribute-not-number = { $component }-be suratuwa ndi-ye ruwucǝni-ga sǝnǝwu gǝni, { $attribute } kǝlkǝl gǝni-ga.

variant-attribute-wrong-type-for-sequence =
    { $component } suratu { $type }-be suratuwa ndi-ye ruwucǝni-ga sǝnǝwu gǝni, { $attribute } { $expected ->
        [letters-combination] ruwuwuwa-be kǝlanzǝ
        [math-expression] kǝlkǝl kalam lawanzǝna
        [integer] kǝlkǝl kambe
       *[number] kǝlkǝl
    } gǝni-ga.

variant-length-not-integer = { $component }-be suratuwa ndi-ye ruwucǝni-ga sǝnǝwu gǝni, length kǝlkǝl kambe gǝni-ga.

variant-sort-not-implemented = { $component } sort-a-be suratuwa ndi-ye ruwucǝni-ga ruwucǝni

variant-exclude-combinations-not-implemented = { $component } excludeCombinations-a-be suratuwa ndi-ye ruwucǝni-ga ruwucǝni

variant-math-exclude-not-implemented = { $component } suratu math exclude-a-be suratuwa ndi-ye ruwucǝni-ga ruwucǝni

variant-non-constant-exclude-not-implemented = { $component } exclude gǝrǝginzǝ-a-be suratuwa ndi-ye ruwucǝni-ga ruwucǝni

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure cirǝgema-ben lawanzǝni; tadaga burcǝna.

prefigure-descendant-invalid-geometry = { $subject }: kǝla-be suratu kǝska bago ya kambe bago; tadaga burcǝna.

prefigure-curve-label-omitted = { $subject }: cinwa layinwa gǝnyinzǝ gǝrǝcǝna-ro lawanzǝni; cinga burcǝna.

prefigure-curve-unsupported-definition-type = { $subject }: layin gǝnyinzǝ-be fasar suratu '{ $definitionType }' lawanzǝni; tadaga burcǝna.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions alama regionBetweenCurves-ro lawanzǝni; tadaga burcǝna.

prefigure-region-non-formula-child = { $subject }: tada fankshanwa suratu formula sǝye regionBetweenCurves-ro lawanzǝna; tadaga burcǝna.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' { $labelKind ->
        [line-family] layinwa-be cin
       *[point] poyint-be cin
    }-ro lawanzǝni; PreFigure-be kǝlanzǝ kǝnowube-a jiliwucǝye.

prefigure-fill-style-unsupported = { $subject }: din-be suratu '{ $fillStyle }' PreFigure-ro lawanzǝni; din kurabe-ro gǝrǝcǝye.

prefigure-line-style-unknown = { $subject }: layin suratu sǝnǝnzǝni '{ $lineStyle }' PreFigure-be iswuben burcǝna.

prefigure-marker-style-mapped-to-diamond = { $subject }: alama suratu '{ $markerStyle }' PreFigure suratu 'diamond'-ro gǝrǝcǝna.

prefigure-marker-style-unsupported = { $subject }: alama suratu '{ $markerStyle }' PreFigure-ro lawanzǝni; suratu kǝnowube-a jiliwucǝye.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ngǝlani; cirǝginzǝga rukcǝye. Fasarga burcǝna.

annotation-ref-multiple-targets = `<annotation>`: `ref` nduwa kura cirǝgin; kǝntǝwube-a jiliwucǝye.

annotation-ref-outside-graph = `<annotation>`: `ref` ngǝlani; cirǝginzǝ graph-be kǝskalan. Fasarga burcǝna.

annotation-ref-unsupported-target = `<annotation>`: `ref` ngǝlani; cirǝginzǝ prefigure gǝrǝwuben lawanzǝna suratu ndu gǝni. Fasarga burcǝna.

annotation-text-missing = `<annotation>`: `text` bago ya bagoga; kalam bagoga iswucǝye.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Dǝgawu kǝlanzǝ rukcǝye.
       *[other] Dǝgawu kǝlanzǝ fartu `<{ $componentType }>`-a rukcǝye.
    }

reference-no-referent = Cirǝwu-ro ndu rukcǝni: `{ $reference }`

reference-multiple-referents = Cirǝwu-ro nduwa kura rukcǝna: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>`-be alama { $attribute }-be suratu ngǝlani.

children-invalid = `<{ $componentType }>`-be tadawa ngǝlani: Tadawa ngǝlani rukcǝye: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Kǝlkǝl `{ $value }` alama `{ $attribute }`-ro ngǝlani, kǝlkǝl `{ $default }`-a jiliwucǝye

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML suratu { $version } rukcǝni.
       *[other] DoenetML suratu { $version } rukcǝni. Suratu { $fallback }-ro gǝrǝcǝye
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ngǝlani: { $content }

parse-tag-missing-close-tag = DoenetML ngǝlani: Tagi `{ $tag }` tagi tǝwuwube bago. Tagi tilo tǝwuginzǝ ya tagi `</{ $tagName }>`-ga ngǝwucǝye.

parse-tag-error = DoenetML ngǝlani: Karsa tagi `<{ $tagName }>`-ben

parse-attribute-missing-value = DoenetML ngǝlani: Alama `{ $attribute }` ngǝlani kǝlkǝl bago-ga cirǝgin.

parse-attribute-invalid = DoenetML ngǝlani: Alama `{ $attribute }` ngǝlani

parse-attribute-value-invalid = DoenetML ngǝlani: Alama-be kǝlkǝl `{ $value }` ngǝlani

parse-attribute-value-quote-mismatch = DoenetML ngǝlani: Alama-be kǝlkǝl `{ $value }` ngǝlani. Kalam alamawa zǝmani. `{ $quote }` bago-ga cirǝgin

parse-open-tag-name-missing = DoenetML ngǝlani: Tagi cin bago rukcǝye, `<`-ga

parse-tag-not-closed = DoenetML ngǝlani: Tagi `{ $tag }` tǝwucǝni (`>` bago-ga cirǝgin).

parse-self-closing-tag-name-missing = DoenetML ngǝlani: Tagi cin bago rukcǝye `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ngǝlani: Tagi `{ $tag }` tǝwucǝni (`/>` bago-ga cirǝgin).

parse-tag-invalid-attributes = DoenetML ngǝlani: Tagi `{ $tag }` ngǝlani. Alamawa ngǝlani jinzǝ.

parse-close-tag-name-missing = DoenetML ngǝlani: Tagi tǝwuwube cin bago rukcǝye, `</`-ga

parse-attribute-value-unquoted = Alama kǝlkǝlwa kalam alamawa-ben lawanzǝnzǝ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ngǝlani: Tagi tǝwuwube `{ $tag }` rukcǝye, amma tagi kǝntǝwube zǝmanzǝ bago

parse-close-tag-mismatched = DoenetML ngǝlani: Tagi tǝwuwube zǝmani. `</{ $expected }>`-ga ngǝwucǝye. `{ $found }` rukcǝye

parser-node-unconvertible = node { $node }-ga Dast node-ro gǝrǝwu gǝni.

## Names

name-attribute-invalid =
    Cin name='{ $name }' ngǝlani. { $reason ->
        [characters] Cinwa ruwuwuwa, kǝlkǝlwa, kǝska-be kǝskawa ya kǝskawa sǝye jinzǝ.
       *[start] Cinwa ruwuwu-a kǝntǝginzǝ.
    }

component-name-invalid-start = Fartu cin "{ $name }" ngǝlani. Cinwa ruwuwu-a kǝntǝginzǝ.

## `<answer>` sugar

answer-video-watched-missing-video = Jawab suratu videoWatched video alama gǝnzǝ

answer-video-watched-video-not-reference = Jawab suratu videoWatched video alama cirǝwu gǝnzǝ-a gǝnzǝ

answer-name-not-single-text = Jawab-be name alama kalam tada tilo gǝnzǝ

## Referencing another document

external-doenetml-recursion-limit = Kǝskalan DoenetML-ga rukwu gǝni, gǝrǝwu kura-ga. Cirǝwu kǝlanzǝ jinzǝ?

external-doenetml-unavailable = DoenetML-ga { $attribute }="{ $uri }"-lan rukwu gǝni

external-doenetml-type-mismatch = DoenetML { $attribute }="{ $uri }"-lan rukcǝna ngǝlani: fartu suratu "{ $componentType }"-a zǝmani

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Alama `{ $from }` jiliwuni; `{ $to }`-ga jiliwuge.
       *[other] [deprecation] Alama `{ $from }` `<{ $component }>`-ro jiliwuni; `{ $to }`-ga jiliwuge.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Alama `{ $from }` jiliwuni be burcǝna, `{ $to }` kǝlan lawanzǝna-ga.
       *[other] [deprecation] Alama `{ $from }` `<{ $component }>`-ro jiliwuni be burcǝna, `{ $to }` kǝlan lawanzǝna-ga.
    }

deprecated-attribute-ignored = [deprecation] Alama `{ $attribute }` `<{ $component }>`-ro jiliwuni be burcǝna.

deprecated-attribute-to-child = [deprecation] Alama `{ $attribute }` `<{ $component }>`-ro jiliwuni; tada `<{ $child }>`-ga jiliwuge.

deprecated-attribute-value-renamed = [deprecation] Alama `{ $attribute }`-be kǝlkǝl `{ $value }` `<{ $component }>`-ro jiliwuni; `{ $to }`-ga jiliwuge.


## Language coverage

pluralize-english-only = `<pluralize>` Ingilishi sǝye kurawuga ruwucin, adǝ-ro kalamnzǝ ruwumaye ruwucǝna-ga kitabu { $locale }-ben ruwucǝna-ben dǝgacin. Kurawuga tilo ruwuge, ya `pluralForm` alama-a lawuge.


## Checking against the schema

schema-element-unrecognized = Fartu `<{ $tag }>` Doenet fartu sǝnǝnzǝna gǝni.

schema-element-not-allowed-at-root = Fartu `<{ $tag }>` kitabu-be kǝla-ro lawanzǝni.

schema-element-not-allowed-inside = Fartu `<{ $tag }>` `<{ $parent }>`-ben lawanzǝni.

schema-attribute-unrecognized = Fartu `<{ $tag }>` alama cinzǝ `{ $attribute }` bago.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Fartu `<{ $tag }>`-be alama `{ $attribute }` tǝrtiwu nduwanzǝ kambe adǝwa-ben tilo gǝnzǝ: { $allowed }
       *[other] Fartu `<{ $tag }>`-be alama `{ $attribute }` adǝwa-ben tilo gǝnzǝ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Select-be suratu cin ngǝlani.  Suratu cin { $variantName } sanawuwa { $numOptions }-ben jinzǝ amma sanawu-be kǝlkǝl { $numToSelect }.

select-variant-name-without-options = Suratuwa gade select-ro lawanzǝna amma sanawu suratu cin ruwuwunzǝ-ro lawanzǝni: { $variantName }.

select-variant-name-not-possible = Suratu cin { $variantName } select-ro lawanzǝna suratu cin ruwuwunzǝ gǝni.

select-too-few-options = Fartuwa { $numToSelect }-ga fartuwa { $numOptions } sǝye-ben sanawu gǝni.

select-from-sequence-too-few-values = Kǝlkǝlwa { $numToSelect }-ga tǝrtiwu kura { $length }-ben sanawu gǝni.

select-from-sequence-indices-count-mismatch = indices select-ro lawanzǝna-be kǝlkǝl sanawu-be kǝlkǝl-a zǝmanzǝ

select-from-sequence-indices-not-integers = indices kambe select-ro lawanzǝna kǝlkǝlwa kambe gǝnzǝ

select-from-sequence-index-excluded = selectfromsequence-be alama lawanzǝna burcǝna gǝnzǝ

select-from-sequence-indices-excluded-combination = selectfromsequence-be indices lawanzǝna kǝlanzǝ burcǝna gǝnzǝ

select-from-sequence-coprime-not-positive-integers = coprime kǝlanzǝwaga sanawu gǝni, kǝlkǝlwa ngǝla kambe sanawunzǝni-ga.

select-from-sequence-coprime-common-factor = coprime kǝlkǝlwaga sanawu gǝni. Kǝlkǝlwa kambe ruwuwunzǝ fakta tilo jinzǝ. ("from" ya "to"-be kǝlkǝlwa lawanzǝna "step"-a coprime gǝnzǝ.)

select-from-sequence-coprime-single-number = coprime kǝlanzǝwaga kǝlkǝl tilo 1 gǝni-ben sanawu gǝni.

select-from-sequence-excluded-too-many-combinations = Kǝlanzǝwa 70% ya kurabe selectFromSequence-ben burcǝna

select-from-sequence-coprime-none-found = coprime kǝlkǝlwaga sanawu gǝni. Kǝlkǝlwa kambe ruwuwunzǝ fakta tilo jinzǝ.

select-from-sequence-too-few-unique-values = Kǝlkǝlwa { $numToSelect } ndi-ye ruwucǝni-ga tǝrtiwu kura { $numPossibleValues }-ben sanawu gǝni

select-prime-numbers-too-few-values = Kǝlkǝlwa { $numToSelect }-ga prime kǝlkǝlwa-be tǝrtiwu kura { $numValues }-ben sanawu gǝni

select-prime-numbers-values-count-mismatch = Kǝlkǝlwa select-ro lawanzǝna-be kǝlkǝl sanawu-be kǝlkǝl-a zǝmanzǝ

select-prime-numbers-values-not-prime = Kǝlkǝlwa kambe select prime number-ro lawanzǝna prime kǝlkǝlwa-be tǝrtiwuben gǝnzǝ

select-prime-numbers-values-excluded-combination = selectPrimeNumbers-be kǝlkǝlwa lawanzǝna kǝlanzǝ burcǝna gǝnzǝ

select-prime-numbers-excluded-too-many-combinations = Kǝlanzǝwa 70% ya kurabe selectPrimeNumbers-ben burcǝna

select-random-combination-fluke = Ndu ruwuwunzǝni kura-ga, kǝlkǝlwa bagobe-be kǝlanzǝga sanawu gǝni

select-random-value-fluke = Ndu ruwuwunzǝni kura-ga, kǝlkǝl bagobega sanawu gǝni
