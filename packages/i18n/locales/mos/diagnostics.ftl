# Mooré diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] B basda { $attributes } b sã n ning noy poẽ a yiib
       *[other] B basda { $attributes } b sã n ning noy poẽ a yiib
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] B basda { $attributes } b sã n ning noor poẽ ne sʋk poẽ fãa
       *[other] B basda { $attributes } b sã n ning noor poẽ ne sʋk poẽ fãa
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ka tʋmd sʋk poẽ sã n ka be ye

## `<line>`

line-points-undetermined-dimensions = Sõorã pʋgda poẽ rãmb sẽn tar zãbr b sẽn pa bãng ye.

line-points-too-few-dimensions = Sõorã segd n pʋgda poẽ rãmb sẽn tar zãbr a yiib walla n yɩɩda.

line-points-depend-on-variables = Sõorã pʋgda poẽ rãmb sẽn tik bũmb sẽn tekd zug: { $variables }.

line-equation-invalid-format = Sõor ekwasiõ manesem sẽn pa zems bũmb sẽn tekd { $variable1 } ne { $variable2 } pʋgẽ.

## `<ray>`

ray-overprescribed-through = Rayõ wã ningame ne through, endpoint la direction.  D basda through ning-kãnga.

ray-dimension-mismatch = numDimensions ka zems rayõ wã pʋgẽ ye.

## `<vector>`

vector-overprescribed-head = Vɛktɛɛr ningame ne head, tail la displacement.  D basda head ning-kãnga.

vector-dimension-mismatch = numDimensions ka zems vɛktɛɛr pʋgẽ ye.

## Attracting and constraining

attract-to-without-nearest-point = D pa tõe n tak `<{ $component }>` ye, bala a ka tar nearestPoint bãnd ye.

constrain-to-without-nearest-point = D pa tõe n pag `<{ $component }>` ye, bala a ka tar nearestPoint bãnd ye.

constrain-to-interior-without-nearest-point = D pa tõe n pag `<{ $component }>` pʋgẽ ye, bala a ka tar nearestPoint bãnd ye.

## `<choiceInput>`

choice-input-label-position-ignored = B basda labelPosition choiceInput sẽn pa be sõorã pʋgẽ zug

## Ordering children by index

choice-input-indices-count-mismatch = D basda indices ning-kãens choiceInput zug bala indices sõor ka zems ne choice kamb sõor ye.

pretzel-indices-count-mismatch = D basda indices ning-kãens problem zug bala indices sõor ka zems ne problem kamb sõor ye.

shuffle-indices-count-mismatch = D basda indices ning-kãens shuffle zug bala indices sõor ka zems ne babs sõor ye.

indices-ignored-out-of-range = D basda indices ning-kãens { $component } zug bala kẽer yita zĩigã pʋgẽ.

pretzel-indices-repeated = D basda indices ning-kãens pretzel zug bala kẽer lebg n wa naoor a yiibu.

pretzel-circuit-first-index = D basda indices ning-kãens pretzel zug mode="circuit" pʋgẽ bala pipi wã segd n yɩɩ 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Sẽn na yɩl tɩ `<{ $component }>` tʋm ne goam kamba, b segd n ninga `type` bãndã.

invalid-type-defaulting-to-math = Buud { $type } ka zems ne { $component } ye. A segd n yɩɩ math, text, number walla boolean. D lebgda math.

string-not-valid-component-to-arrange = Goam "{ $value }" ka babg sẽn zems ne { $component } ye. D basda a soaba.

## Types and variables

invalid-type-defaulting-to-number = Buud { $type } ka zems ye, d ningda buudã number.

invalid-variable-value = Bũmb sẽn tekd sõor ka zems ye: `{ $value }`

## Variants

variant-index-must-be-number = Manesem bãnd { $index } segd n yɩɩ sõore

variant-index-must-be-integer = Manesem bãnd { $index } segd n yɩɩ sõor sẽn zems

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ka maan ne makr sẽn pa tekd ye. D ningda yalengã makr zug.

side-by-side-absolute-margins = `<{ $component }>` ka maan ne makr sẽn pa tekd ye. D ningda noyã makr zug.

side-by-side-no-block-child = `<{ $component }>` ka zems ye: a segd n tara bilf a ye biig fãa.

## `<label>`

label-for-ignored-on-graphical = B basda `for` bãndã fiigɩɩr `<label>` zug.

label-for-must-resolve-to-one = `for` bãndã `<label>` zug segd n wilga babg a ye bala.

label-for-unresolved = `for` bãndã `<label>` zug pa tõe n wilg babg ye.

label-for-answer-with-authored-inputs = `for` bãndã `<label>` zug wilgda `<answer>` sẽn tar kẽesg gʋlsdã meng sẽn gʋls; wilg kẽesgã meng.

label-for-answer-without-input = `for` bãndã `<label>` zug wilgda `<answer>` sẽn ka tar kẽesg n na n pʋd a yʋʋre.

label-for-must-reference-input-or-answer = `for` bãndã `<label>` zug segd n wilga kẽesg walla leoore.

## Accessibility

accessibility-short-description-or-decorative = Tõog-paoodg yĩnga, `<{ $component }>` segd n tara bilgr bilf walla b ning-a wa neerlem bũmbu.

accessibility-video-short-description = Tõog-paoodg yĩnga, `<video>` segd n tara bilgr bilfu.

accessibility-input-short-description-or-label = Tõog-paoodg yĩnga, `<{ $component }>` segd n tara bilgr bilf walla yʋʋre.

accessibility-answer-input-short-description-or-label = Tõog-paoodg yĩnga, `<answer>` sẽn maand kẽesg segd n tara bilgr bilf walla yʋʋre.

accessibility-short-description-contains-math = Bilgr bilf ka segd n tar sõdb babs wa `<{ $component }>` ye. Gʋls sõdbã fãa ne goama.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ka tar welsg sẽn zems babgã zug-gomd goam yĩng ye (lik pʋgẽ) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a baool { $threshold }:1).
       *[other] { $colorName } ka tar welsg sẽn zems babgã zug-gomd goam yĩng ye ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a baool { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = D nan pa maan `<circle>` sẽn pʋgd poẽ { $count } poẽ rãmbã sã n ka tar sõd-bila ye.

circle-too-many-through-points = D pa tõe n sõd gilg sẽn pʋgd poẽ n yɩɩd a 3 ye.

circle-overprescribed-radius-center-points = D pa tõe n sõd gilg sẽn tar rayõ, sʋk zĩig la poẽ rãmb fãa ning-kãense.

circle-center-with-multiple-points = D pa tõe n sõd gilg sẽn tar sʋk zĩig n pʋgd poẽ n yɩɩd a 1 ye.

circle-radius-too-small = D pa tõe n sõd gilgã: poẽ a yiibã sʋk zãrlem yaa { $distance }, tɩ rayõ { $radius } ning-kãng yaa bilf wʋsgo.

circle-radius-with-many-points = D pa tõe n maan gilg sẽn pʋgd poẽ n yɩɩd a yiib ne rayõ ning-kãng ye.

circle-invalid-center-or-through-points = Gilgã sʋk zĩig walla a poẽ rãmb ka zems ye.

circle-radius-center-with-multiple-points = D pa tõe n sõd gilg sẽn tar sʋk zĩig rayõ n pʋgd poẽ n yɩɩd a 1 ye.

circle-change-radius-non-numerical = D pa tõe n tek gilg sẽn tar poẽ rãmb sẽn ka tar sõor rayõ ye

circle-radius-with-points-non-numerical = D pa tõe n maan gilg sẽn pʋgd poẽ n yɩɩd a ye ne rayõ ning-kãng sõd-bil sã n ka be ye.

circle-change-center-non-numerical = D nan pa maan gilg sẽn pʋgd poẽ rãmb sẽn ka tar sõor sʋk zĩig tekre.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Zãbrã ka sek fõksiõ wã zĩig yĩng ye. Zĩigã tara babg { $intervals } la fõksiõ wã tara { $inputs ->
            [one] kẽesg { $inputs }
           *[other] kẽesg { $inputs }
        }.
       *[other] Zãbrã ka sek fõksiõ wã zĩig yĩng ye. Zĩigã tara babs { $intervals } la fõksiõ wã tara { $inputs ->
            [one] kẽesg { $inputs }
           *[other] kẽesg { $inputs }
        }.
    }

function-domain-invalid-format = Fõksiõ zĩig manesem ka zems ye.

function-ignoring-non-numerical =
    { $type ->
        [maximum] D basda fõksiõ wã zug-zãrg sẽn ka tar sõore.
        [minimum] D basda fõksiõ wã tẽngr-zãrg sẽn ka tar sõore.
        [extremum] D basda fõksiõ wã noor sẽn ka tar sõore.
        [point] D basda fõksiõ wã poẽ sẽn ka tar sõore.
        [slope] D basda fõksiõ wã gobd sẽn ka tar sõore.
       *[other] D basda fõksiõ wã { $type } sẽn ka tar sõore.
    }

function-ignoring-empty =
    { $type ->
        [maximum] D basda fõksiõ wã zug-zãrg sẽn yaa zaalem.
        [minimum] D basda fõksiõ wã tẽngr-zãrg sẽn yaa zaalem.
        [extremum] D basda fõksiõ wã noor sẽn yaa zaalem.
        [point] D basda fõksiõ wã poẽ sẽn yaa zaalem.
       *[other] D basda fõksiõ wã { $type } sẽn yaa zaalem.
    }

function-points-too-close = Fõksiõ wã tara poẽ a yiib sẽn kolg taab wʋsgo. D pa tõe n ning fõksiõ ye.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Fõksiõ lebs-lebsg tõogda kẽesg sõor sã n zems ne yiisg sõore. Fõksiõ kãngã tara kẽesg { $inputs } la { $outputs ->
            [one] yiisg { $outputs }
           *[other] yiisg { $outputs }
        }.
       *[other] Fõksiõ lebs-lebsg tõogda kẽesg sõor sã n zems ne yiisg sõore. Fõksiõ kãngã tara kẽesg { $inputs } la { $outputs ->
            [one] yiisg { $outputs }
           *[other] yiisg { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Toolgã woglem ka zems ye.  A segd n yɩɩ sõor sẽn zems sẽn pa yɩɩd zeero tẽngre.

sequence-invalid-step = Toolgã kẽng-kẽngr ka zems ye.  A segd n yɩɩ sõor toolg sẽn yaa buud { $type } yĩnga.

sequence-invalid-endpoint-number = Sõor toolg "{ $attribute }" ka zems ye.  A segd n yɩɩ sõore.

sequence-invalid-endpoint-letters = Gʋls-bi toolg "{ $attribute }" ka zems ye.  A segd n yɩɩ gʋls-bi lagengre.

sequence-invalid-endpoint = Toolgã "{ $attribute }" ka zems ye.

select-from-sequence-coprime-not-numbers = B basa coprime bala b ka yãkd sõdb ye

select-from-sequence-coprime-with-exclude-combinations = B basa coprime bala b ninga excludeCombinations

## Resolving a `target`

target-not-found = target ka zems `<{ $source }>` yĩng ye: d pa yã target ye.

target-state-variable-not-found = target ka zems `<{ $source }>` yĩng ye: d pa yã bãnd b sẽn boond tɩ "{ $property }" `<{ $component }>` zug ye.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` bũmb sẽn tekdã segd n welga ne bũmb sẽn tekd sẽn ka tik-a ye.

ode-system-duplicate-variable-names = D pa tõe n ning ODE RHS fõksiõ rãmb sẽn tar bũmb sẽn tekd yʋy sẽn lebg n wa ye.

ode-system-rhs-function-error = D pa tõe n ning ODE RHS fõksiõ ye.  Kongr mathjs fõksiõ maanego pʋgẽ.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = D pa tõe n ning kãnd sõoy { $count } sʋk ye

angle-invalid-through-point = Poẽ sẽn pa zems `<angle>` through pʋgẽ

parabola-vertex-too-many-points = D nan pa maan parabol sẽn tar kãnd n pʋgd poẽ n yɩɩd a 1 ye.

parabola-too-many-points = D nan pa maan parabol sẽn pʋgd poẽ n yɩɩd a 3 ye.

intersection-too-many-items = D nan pa maan seglg bũmb n yɩɩd a yiib yĩng ye

## Other math components

ionic-compound-not-two-ions = D nan pa maan ayõ lagengr bũmb sẽn ka ayõ a yiib yĩng ye.

ionic-compound-needs-cation-and-anion = Ayõ lagengr maana katiyõ a ye ne aniyõ a ye bal yĩnga.

solve-equations-cannot-evaluate = D pa tõe n welg ekwasiõ wã bala d pa tõe n sõd-a: { $equation }

math-operators-operand-number-required = Y segd n ninga operandNumber y sã n yiisd sõdb operand.

eigen-decomposition-failed = D pa tõog n sõd matris eigenvalues ye

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametr { $parameters } ka be pattern pʋgẽ ye, dẽ a na n zemsa ne zaalem wakat fãa.
       *[other] `<matchesPattern>`: parametr rãmb { $parameters } ka be pattern pʋgẽ ye, dẽ b na n zemsa ne zaalem wakat fãa.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: d pa tõe n wʋm grid="{ $grid }" võor ye. A segd n yɩɩ none, medium, dense, walla sõd sõma a yiib sẽn welg ne zĩig, wa grid="1 0.5". Sõor-kãnd pa maan ye.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ka sak prefigure wilgd pʋgẽ ye; d tʋmda wa rɩtg goabg zug.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ka sak prefigure wilgd pʋgẽ ye; d tʋmda wa zug zug.

prefigure-invalid-axis-bounds = `<graph>`: sõor-kãseng noy ka zems prefigure tekr yĩng ye; d tʋmda ne bbox sẽn zems fãa (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: yalengã ka zems prefigure tekr yĩng ye; d tʋmda ne fiigɩɩr yaleng sẽn zems fãa 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ka zems prefigure tekr yĩng ye; d tʋmda ne makr sẽn zems fãa 1.

prefigure-grid-spacing-too-fine = `<graph>`: sõor-kãndã zĩig-zĩig yaa bilf wʋsg sõor-kãseng noy yĩnga; sõor-kãndã ka maan prefigure wilgd pʋgẽ ye.

prefigure-annotations-not-rendered = `<graph>`: bilgr rãmb ka maan PreFigure wilgd sã n ka tʋmd ye.

multiple-annotations-children = B yãa `<annotations>` kamb wʋsg `<graph>` pʋgẽ; b basa fãa n bas yaoolgã.

## Referring to other components

copy-unrecognized-component-type = D pa tõe n paas walla n koop babg buud b sẽn pa mi ye: { $type }.

copy-prop-not-found = D pa yã prop { $property } babg sẽn yaa buud { $component } zug ye

collect-no-source = B pa yã collect yẽesg ye.

collect-invalid-component-type = D pa tõe n tigim babs sẽn yaa buud `<{ $component }>` ye bala a yaa buud sẽn pa zems.

reference-index-unavailable = D pa tõe n wilg bãnd `{ $reference }` ye

## `<callAction>`

component-action-unavailable = D pa tõe n bool { $action } babg `{ $reference }` zug ye

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Kibayã manesem ka zems ye.  Sõoyã tara woglem sẽn pa zems taab ye. B yãa componentIdx :{ $componentIdx } pʋgẽ

data-frame-duplicate-column-names = Kibayã tara kolon yʋy sẽn lebg n wa.  B yãa componentIdx :{ $componentIdx } pʋgẽ

data-frame-missing-column-name = Kibayã ka tar kolon yʋʋr ye.  B yãa componentIdx :{ $componentIdx } pʋgẽ

## `<answer>` and scoring

answer-award-depends-on-own-response = Leoor kãngã poẽ tikda tag mengã sẽn tʋm leoorã zug, la dẽ na n waa ne bũmb sẽn pa gũusd ye.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` ningr `<answer>` sẽn be babg sẽn tar `sectionWideCheckWork` pʋgẽ ka tʋmd baa fʋɩ ye, bala babgã n gũud makr sõorã. Ning `maxNumAttempts` babgã zug.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` ningr babg sẽn tar `sectionWideCheckWork` sẽn be babg a to sẽn tar `sectionWideCheckWork` pʋgẽ ka tʋmd baa fʋɩ ye, bala yɩngr babgã n gũud makr sõorã. Ning `maxNumAttempts` yɩngr babgã zug.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] { $attributes } bãndã ka na n tʋm baa fʋɩ symbolicEquality sã n ka ning ye.
       *[other] { $attributes } bãnd rãmbã ka na n tʋm baa fʋɩ symbolicEquality sã n ka ning ye.
    }

answer-invalid-type = Leoor buud sẽn pa zems: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Babg `<{ $component }>` sẽn ka tar yʋʋrã, a pa tõe n tʋm wa module bãnd ye

module-attribute-name-already-defined = Babg `<{ $component } name="{ $name }">` pa tõe n tʋm wa module bãnd ye bala `<module>` buudã zoe n tara bãnd "{ $name }".

conditional-content-condition-ignored = B basda `condition` bãndã `<conditionalContent>` sẽn tar case walla else kamb zug.

slider-markers-type-mismatch = Bãnd rãmbã buud ka zems ne slider buudã ye.

pretzel-problem-needs-statement-and-answer = pretzel ka zems ye: `<problem>` fãa segd n tara `<statement>` a ye ne `<answer>` a ye.

pretzel-circuit-first-problem-distractor = pretzel ka zems ye: mode="circuit" pʋgẽ, pipi `<problem>` pa tõe n yɩ distractor ye.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Sõor sẽn pa zems { $values } bãnd `{ $attribute }` yĩnga; d basda a soaba.
       *[other] Sõdb sẽn pa zems { $values } bãnd `{ $attribute }` yĩnga; d basda b soaba.
    }

attribute-must-be-references = Sõor `{ $value }` ka zems bãnd `{ $attribute }` yĩng ye. Bãndã segd n maana ne wilgr rãmb sẽn sɩngd ne `$`.

math-input-invalid-function-names = <mathInput>: d basa fõksiõ yʋy sẽn pa zems { $attribute } pʋgẽ: { $names }. Yʋʋr fãa wilgr babg segd n tara gʋls-bi a yiib walla n yɩɩda (gʋls-bi walla tirɛ); y tõe n paasa `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Babg buud ka zems ye: `<{ $componentType }>`

attribute-repeated = D pa tõe n lebs bãnd { $attribute } ye.

attribute-invalid-for-component = Bãnd "{ $attribute }" ka zems babg sẽn yaa buud `<{ $componentType }>` yĩng ye.

## Style definition contrast

style-definition-insufficient-contrast =
    Manesem { $styleNumber } bilgrã ka tar welsg sẽn zems { $context ->
        [text-on-background] goam kulɛɛr poorẽ kulɛɛr zug
        [high-contrast] welsg-kãseng kulɛɛr gãagã zug
        [line] sõor kulɛɛr gãagã zug
        [marker] bãnd kulɛɛr gãagã zug
       *[text-on-canvas] goam kulɛɛr gãagã zug
    } yĩng ye{ $mode ->
        [dark] { " (lik pʋgẽ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a baool { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Baa manesem { $styleNumber } bilgrã sẽn tar kulɛɛr rãmb sẽn kõt welsg sẽn zems vẽenem pʋgẽ, lik kulɛɛr rãmb sẽn yit b nengẽ wã ka tar welsg sẽn zems goam kulɛɛr ne poorẽ kulɛɛr sʋk ye ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a baool { $threshold }:1). { $suggestion ->
        [available] Sẽn na yɩl tɩ welsgã zems lik pʋgẽ, paas vẽenem welsgã (makre, ning { $lightAttribute }="{ $lightColor }") walla tek lik kulɛɛrã (makre, ning { $darkAttribute }="{ $darkColor }").
       *[none] Sẽn na yɩl tɩ welsgã zems lik pʋgẽ, paas vẽenem welsgã walla tek kulɛɛr rãmb sẽn yit b nengẽ wã ne textColorDarkMode walla backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Baa manesem { $styleNumber } bilgrã sẽn tar goam kulɛɛr sẽn kõt welsg sẽn zems vẽenem pʋgẽ, lik goam kulɛɛr sẽn yit a nengẽ wã ka tar welsg sẽn zems gãagã zug ye ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a baool { $threshold }:1). { $suggestion ->
        [available] Sẽn na yɩl tɩ welsgã zems lik pʋgẽ, paas vẽenem welsgã (makre, ning textColor="{ $lightColor }") walla tek lik kulɛɛrã (makre, ning textColorDarkMode="{ $darkColor }").
       *[none] Sẽn na yɩl tɩ welsgã zems lik pʋgẽ, paas vẽenem welsgã walla tek kulɛɛr sẽn yit a nengẽ wã ne textColorDarkMode.
    }

section-multiple-style-palettes = Babg tõe n yãka <stylePalette> a ye bala; d tʋmda ne yaoolgã.

## Unique variants

variant-num-to-select-not-non-negative-integer = d pa tõe n bãng { $component } manesem sẽn pa lebg n wa ye bala numToSelect ka sõor sẽn zems sẽn pa yɩɩd zeero tẽngr ye.

variant-num-to-select-not-constant-number = d pa tõe n bãng { $component } manesem sẽn pa lebg n wa ye bala numToSelect ka sõor sẽn pa tekd ye.

variant-with-replacement-not-constant-boolean = d pa tõe n bãng { $component } manesem sẽn pa lebg n wa ye bala withReplacement ka boolean sẽn pa tekd ye.

variant-select-weight-disables-unique = Select manesem sẽn pa lebg n wa pagda yãkr sã n tar selectWeight walla selectForVariants

variant-coprime-undetermined = d pa tõe n bãng { $component } manesem sẽn pa lebg n wa ye bala d pa tõe n bãng tɩ coprime yaa false wakat fãa ye.

variant-attribute-not-constant = d pa tõe n bãng { $component } manesem sẽn pa lebg n wa ye bala { $attribute } tekdame.

variant-attribute-not-number = d pa tõe n bãng { $component } manesem sẽn pa lebg n wa ye bala { $attribute } ka sõor ye.

variant-attribute-wrong-type-for-sequence =
    d pa tõe n bãng { $component } sẽn yaa buud { $type } manesem sẽn pa lebg n wa ye bala { $attribute } ka { $expected ->
        [letters-combination] gʋls-bi lagengre
        [math-expression] sõdb goam sẽn zems
        [integer] sõor sẽn zems
       *[number] sõore
    } ye.

variant-length-not-integer = d pa tõe n bãng { $component } manesem sẽn pa lebg n wa ye bala length ka sõor sẽn zems ye.

variant-sort-not-implemented = d nan pa maan { $component } sẽn tar sort manesem sẽn pa lebg n wa ye

variant-exclude-combinations-not-implemented = d nan pa maan { $component } sẽn tar excludeCombinations manesem sẽn pa lebg n wa ye

variant-math-exclude-not-implemented = d nan pa maan { $component } sẽn yaa buud math sẽn tar exclude manesem sẽn pa lebg n wa ye

variant-non-constant-exclude-not-implemented = d nan pa maan { $component } sẽn tar exclude sẽn tekd manesem sẽn pa lebg n wa ye

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ka sak graph prefigure wilgd pʋgẽ ye; b basa yagengã.

prefigure-descendant-invalid-geometry = { $subject }: zĩig manesem ka tar noor walla a ka zems ye; b basa yagengã.

prefigure-curve-label-omitted = { $subject }: yʋy ka sak sõoy sẽn gob b sẽn tek zug ye; b basa yʋʋrã.

prefigure-curve-unsupported-definition-type = { $subject }: sõor sẽn gob bilgr buud '{ $definitionType }' ka sak ye; b basa yagengã.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions bãndã ka sak regionBetweenCurves zug ye; b basa yagengã.

prefigure-region-non-formula-child = { $subject }: yaa kamb fõksiõ sẽn yaa buud formula bal n sak regionBetweenCurves zug; b basa yagengã.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ka sak { $labelKind ->
        [line-family] sõoy buud yʋʋr
       *[point] poẽ yʋʋr
    } yĩng ye; d tʋmda ne PreFigure seglg sẽn zems fãa.

prefigure-fill-style-unsupported = { $subject }: pidsg manesem '{ $fillStyle }' ka sak PreFigure zug ye; d lebgda pidsg sẽn kãn.

prefigure-line-style-unknown = { $subject }: sõor manesem b sẽn pa mi '{ $lineStyle }' yiisa PreFigure yiisgã pʋgẽ.

prefigure-marker-style-mapped-to-diamond = { $subject }: bãnd manesem '{ $markerStyle }' tekame n lebg PreFigure manesem 'diamond'.

prefigure-marker-style-unsupported = { $subject }: bãnd manesem '{ $markerStyle }' ka sak PreFigure zug ye; d tʋmda ne manesem sẽn zems fãa.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ka zems ye; d pa yã a sẽn wilgdã ye. B basa bilgrã.

annotation-ref-multiple-targets = `<annotation>`: `ref` wilgda bũmb wʋsgo; d tʋmda ne pipi wã.

annotation-ref-outside-graph = `<annotation>`: `ref` ka zems ye; a sẽn wilgdã bee graph sẽn tar-a wã yĩngre. B basa bilgrã.

annotation-ref-unsupported-target = `<annotation>`: `ref` ka zems ye; a sẽn wilgdã ka fiigɩɩr bũmb sẽn sak prefigure tekr pʋgẽ ye. B basa bilgrã.

annotation-text-missing = `<annotation>`: `text` ka be walla a yaa zaalem; d yiisda goam zaalem.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] D yãa tikr sẽn gilg n lebg n wa.
       *[other] D yãa tikr sẽn gilg n lebg n wa ne babg `<{ $componentType }>`.
    }

reference-no-referent = B pa yã baa fʋɩ wilgr yĩng ye: `{ $reference }`

reference-multiple-referents = B yãa bũmb wʋsg wilgr yĩnga: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` bãnd { $attribute } manesem ka zems ye.

children-invalid = `<{ $componentType }>` kamb ka zems ye: D yãa kamb sẽn pa zems: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Sõor `{ $value }` ka zems bãnd `{ $attribute }` yĩng ye, d tʋmda ne sõor `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] B pa yã DoenetML vɛrsiõ { $version } ye.
       *[other] B pa yã DoenetML vɛrsiõ { $version } ye. D lebgda vɛrsiõ { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML sẽn pa zems: { $content }

parse-tag-missing-close-tag = DoenetML sẽn pa zems: Tag `{ $tag }` ka tar pagr tag ye. D gũu tag sẽn pagd a meng walla tag `</{ $tagName }>`.

parse-tag-error = DoenetML sẽn pa zems: Kongr tag `<{ $tagName }>` pʋgẽ

parse-attribute-missing-value = DoenetML sẽn pa zems: Bãnd `{ $attribute }` sẽn pa zems yaa wa a ka tar sõor ye.

parse-attribute-invalid = DoenetML sẽn pa zems: Bãnd `{ $attribute }` ka zems ye

parse-attribute-value-invalid = DoenetML sẽn pa zems: Bãnd sõor `{ $value }` ka zems ye

parse-attribute-value-quote-mismatch = DoenetML sẽn pa zems: Bãnd sõor `{ $value }` ka zems ye. Goam bãnd rãmbã ka zems taab ye. Yaa wa `{ $quote }` n paoode

parse-open-tag-name-missing = DoenetML sẽn pa zems: D yãa tag sẽn ka tar yʋʋre, wa `<`

parse-tag-not-closed = DoenetML sẽn pa zems: Tag `{ $tag }` ka pag ye (yaa wa `>` n paoode).

parse-self-closing-tag-name-missing = DoenetML sẽn pa zems: D yãa tag sẽn ka tar yʋʋr `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML sẽn pa zems: Tag `{ $tag }` ka pag ye (yaa wa `/>` n paoode).

parse-tag-invalid-attributes = DoenetML sẽn pa zems: Tag `{ $tag }` ka zems ye. Tõe t'a tara bãnd sẽn pa zemse.

parse-close-tag-name-missing = DoenetML sẽn pa zems: D yãa pagr tag sẽn ka tar yʋʋre, wa `</`

parse-attribute-value-unquoted = Bãnd sõdb segd n bee goam bãnd rãmb sʋka: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML sẽn pa zems: D yãa pagr tag `{ $tag }`, la pakr tag sẽn zems ne-a ka be ye

parse-close-tag-mismatched = DoenetML sẽn pa zems: Pagr tagã ka zems ye. D gũu `</{ $expected }>`. D yãa `{ $found }`

parser-node-unconvertible = D pa tõog n tek node { $node } n lebg Dast node ye.

## Names

name-attribute-invalid =
    Yʋʋr name='{ $name }' ka zems ye. { $reason ->
        [characters] Yʋy tõe n tara gʋls-bi, sõdb, tẽngr tirɛ walla tirɛ bala.
       *[start] Yʋy segd n sɩnga ne gʋls-bila.
    }

component-name-invalid-start = Babg yʋʋr "{ $name }" ka zems ye. Yʋy segd n sɩnga ne gʋls-bila.

## `<answer>` sugar

answer-video-watched-missing-video = Leoor sẽn yaa buud videoWatched segd n tara video bãnde

answer-video-watched-video-not-reference = Leoor sẽn yaa buud videoWatched segd n tara video bãnd sẽn yaa wilgri

answer-name-not-single-text = Leoorã name bãnd segd n tara goam biig a ye

## Referencing another document

external-doenetml-recursion-limit = D pa tõog n paam yĩngr DoenetML ye, bala lebs-lebsgã yɩɩda. Wilgr n gilgd n lebgd n wa bɩ?

external-doenetml-unavailable = D pa tõog n paam DoenetML { $attribute }="{ $uri }" nengẽ ye

external-doenetml-type-mismatch = DoenetML b sẽn paam { $attribute }="{ $uri }" nengẽ ka zems ye: a ka zems ne babg buud "{ $componentType }" ye

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Bãnd `{ $from }` ka tʋmd le ye; tʋm ne `{ $to }`.
       *[other] [deprecation] Bãnd `{ $from }` `<{ $component }>` zug ka tʋmd le ye; tʋm ne `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Bãnd `{ $from }` ka tʋmd le ye la b basd-a lame bala `{ $to }` me ningame.
       *[other] [deprecation] Bãnd `{ $from }` `<{ $component }>` zug ka tʋmd le ye la b basd-a lame bala `{ $to }` me ningame.
    }

deprecated-attribute-ignored = [deprecation] Bãnd `{ $attribute }` `<{ $component }>` zug ka tʋmd le ye la b basd-a lame.

deprecated-attribute-to-child = [deprecation] Bãnd `{ $attribute }` `<{ $component }>` zug ka tʋmd le ye; tʋm ne biig `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Bãnd `{ $attribute }` sõor `{ $value }` `<{ $component }>` zug ka tʋmd le ye; tʋm ne `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` tõe n maana wʋsg-yʋʋr Angilind pʋgẽ bala, dẽ a goamã ket wa gʋlsdã sẽn gʋls-a to-to sebr sẽn gʋls { $locale } pʋgẽ. Gʋls wʋsg-yʋʋrã y meng, walla y ning-a ne `pluralForm` bãndã.


## Checking against the schema

schema-element-unrecognized = Babg `<{ $tag }>` ka Doenet babg b sẽn mi ye.

schema-element-not-allowed-at-root = Babg `<{ $tag }>` ka sak sebrã yẽg zug ye.

schema-element-not-allowed-inside = Babg `<{ $tag }>` ka sak `<{ $parent }>` pʋgẽ ye.

schema-attribute-unrecognized = Babg `<{ $tag }>` ka tar bãnd b sẽn boond tɩ `{ $attribute }` ye.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Babg `<{ $tag }>` bãnd `{ $attribute }` segd n yɩɩ toolg tɩ bũmb fãa yɩ a ye a woto sʋka: { $allowed }
       *[other] Babg `<{ $tag }>` bãnd `{ $attribute }` segd n yɩɩ a ye a woto sʋka: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Select manesem yʋʋr ka zems ye.  Manesem yʋʋr { $variantName } bee yãkr { $numOptions } pʋgẽ la yãkr sõor yaa { $numToSelect }.

select-variant-name-without-options = B ninga manesem kẽer select yĩnga la b pa ning yãkr manesem yʋʋr sẽn tõe n zĩnd yĩng ye: { $variantName }.

select-variant-name-not-possible = Manesem yʋʋr { $variantName } b sẽn ning select yĩngã ka manesem yʋʋr sẽn tõe n zĩnd ye.

select-too-few-options = D pa tõe n yãk babs { $numToSelect } babs { $numOptions } bal sʋk ye.

select-from-sequence-too-few-values = D pa tõe n yãk sõdb { $numToSelect } toolg sẽn tar woglem { $length } pʋgẽ ye.

select-from-sequence-indices-count-mismatch = Indices sõor b sẽn ning select yĩngã segd n zemsa ne yãkr sõorã

select-from-sequence-indices-not-integers = Indices fãa b sẽn ning select yĩngã segd n yɩɩ sõdb sẽn zemse

select-from-sequence-index-excluded = B ninga selectfromsequence bãnd b sẽn yiisi

select-from-sequence-indices-excluded-combination = B ninga selectfromsequence indices sẽn yaa lagengr b sẽn yiisi

select-from-sequence-coprime-not-positive-integers = D pa tõe n yãk coprime lagengr ye bala b ka yãkd sõd sõma sẽn zems ye.

select-from-sequence-coprime-common-factor = D pa tõe n yãk coprime sõdb ye. Sõdb fãa sẽn tõe n zĩnd tara faktɛɛr a ye. ("from" walla "to" sõdb b sẽn ning segd n yɩɩ coprime ne "step".)

select-from-sequence-coprime-single-number = D pa tõe n yãk coprime lagengr sõor a ye sẽn ka 1 pʋgẽ ye.

select-from-sequence-excluded-too-many-combinations = B yiisa lagengr sẽn yɩɩd 70% selectFromSequence pʋgẽ

select-from-sequence-coprime-none-found = D pa tõog n yãk coprime sõdb ye. Sõdb fãa sẽn tõe n zĩnd tara faktɛɛr a ye.

select-from-sequence-too-few-unique-values = D pa tõe n yãk sõdb { $numToSelect } sẽn pa lebg n wa toolg sẽn tar woglem { $numPossibleValues } pʋgẽ ye

select-prime-numbers-too-few-values = D pa tõe n yãk sõdb { $numToSelect } prime sõdb toolg sẽn tar woglem { $numValues } pʋgẽ ye

select-prime-numbers-values-count-mismatch = Sõdb sõor b sẽn ning select yĩngã segd n zemsa ne yãkr sõorã

select-prime-numbers-values-not-prime = Sõdb fãa b sẽn ning select prime number yĩngã segd n bee prime sõdb toolgã pʋgẽ

select-prime-numbers-values-excluded-combination = Sõdb b sẽn ning selectPrimeNumbers yĩngã yɩɩ lagengr b sẽn yiisi

select-prime-numbers-excluded-too-many-combinations = B yiisa lagengr sẽn yɩɩd 70% selectPrimeNumbers pʋgẽ

select-random-combination-fluke = Ne bũmb sẽn pa tõe n zĩnd wʋsgo, d pa tõog n yãk sõdb zaal-zaal lagengr ye

select-random-value-fluke = Ne bũmb sẽn pa tõe n zĩnd wʋsgo, d pa tõog n yãk sõor zaal-zaal ye
