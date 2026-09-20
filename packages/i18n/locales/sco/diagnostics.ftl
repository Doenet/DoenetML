# Scots diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Scots looks like the source**, and this file is where that matters most,
# because a diagnostic is a whole sentence and a whole sentence is where a seed
# with nothing to say slides into English unnoticed. See `chrome.ftl`. The
# things this file does consistently and that a reviewer can check quickly are
# the negated auxiliaries — «canna», «disna», «isna», «haesna», «couldna»,
# «winna» — and «gin» for *if*, «whaur» for *where*, «ilka» for *each*, «mony»
# for *many*, «aa» for *all*, «o» for *of*, «wi» for *with*, «tae» for *to* and
# «nae» for *no*. Where those are absent from a sentence, the sentence is very
# likely still English.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own source, and so do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names.
#
# **Number.** CLDR has no plural rules for `sco`, so no `zero`, `two`, `few` or
# `many` branch appears anywhere. Every **symbolic** selector — `$type`,
# `$mode`, `$reason`, `$context`, `$suggestion`, `$alternative`, `$fallback`,
# `$expected`, `$labelKind`, `$isList`, `$componentType` — is kept byte for
# byte from English, keys included.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } is lat be whan twa endpynts are gien
       *[other] { $attributes } are lat be whan twa endpynts are gien
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } is lat be whan an endpynt an a midpynt are baith gien
       *[other] { $attributes } are lat be whan an endpynt an a midpynt are baith gien
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset disna dae onythin wioot a midpynt

## `<line>`

line-points-undetermined-dimensions = Line throu pynts o undeemed dimensions.

line-points-too-few-dimensions = A line maun gang throu pynts o at least twa dimensions.

line-points-depend-on-variables = The line gangs throu pynts that hing on the variables: { $variables }.

line-equation-invalid-format = The format o the line equation in the variables { $variable1 } an { $variable2 } isna valid.

## `<ray>`

ray-overprescribed-through = The ray is set by through, endpoint an direction.  Lattin the gien through be.

ray-dimension-mismatch = numDimensions disna gree in the ray.

## `<vector>`

vector-overprescribed-head = The vector is set by head, tail an displacement.  Lattin the gien head be.

vector-dimension-mismatch = numDimensions disna gree in the vector.

## Attracting and constraining

attract-to-without-nearest-point = Canna draw tae a `<{ $component }>`, sin it haesna a nearestPoint state variable.

constrain-to-without-nearest-point = Canna haud tae a `<{ $component }>`, sin it haesna a nearestPoint state variable.

constrain-to-interior-without-nearest-point = Canna haud tae the inby o a `<{ $component }>`, sin it haesna a nearestPoint state variable.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition is lat be for a choiceInput that isna inline

## Ordering children by index

choice-input-indices-count-mismatch = Lattin the indices gien for choiceInput be, sin the nummer o indices disna match the nummer o choice bairns.

pretzel-indices-count-mismatch = Lattin the indices gien for problem be, sin the nummer o indices disna match the nummer o problem bairns.

shuffle-indices-count-mismatch = Lattin the indices gien for shuffle be, sin the nummer o indices disna match the nummer o components.

indices-ignored-out-of-range = Lattin the indices gien for { $component } be, sin some indices are oot o range.

pretzel-indices-repeated = Lattin the indices gien for pretzel be, sin some indices are said twice.

pretzel-circuit-first-index = Lattin the indices gien for pretzel in circuit mode be, sin the first index maun be 1.

## `<shuffle>` and `<sort>`

string-children-need-type = For `<{ $component }>` tae wirk wi string bairns, a `type` attribute maun be gien.

invalid-type-defaulting-to-math = The type { $type } isna valid for a { $component } component. It maun be ane o math, text, number or boolean. Gaun wi math.

string-not-valid-component-to-arrange = The string "{ $value }" isna a valid component tae { $component }. Lattin it be.

## Types and variables

invalid-type-defaulting-to-number = The type { $type } isna valid, settin type tae number.

invalid-variable-value = The value o a variable isna valid: `{ $value }`

## Variants

variant-index-must-be-number = The variant index { $index } maun be a nummer

variant-index-must-be-integer = The variant index { $index } maun be a hail nummer

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` isna made for absolute measurements. Settin the widths tae relative.

side-by-side-absolute-margins = `<{ $component }>` isna made for absolute measurements. Settin the margins tae relative.

side-by-side-no-block-child = This `<{ $component }>` isna valid: it maun hae at least ae block bairn.

## `<label>`

label-for-ignored-on-graphical = The `for` attribute on a graphical `<label>` is lat be.

label-for-must-resolve-to-one = The `for` attribute on `<label>` maun come tae exactly ae component.

label-for-unresolved = The `for` attribute on `<label>` couldna be wrocht oot tae a component.

label-for-answer-with-authored-inputs = The `for` attribute on `<label>` pynts at an `<answer>` wi inputs written oot; pynt at the input itsel.

label-for-answer-without-input = The `for` attribute on `<label>` pynts at an `<answer>` wi nae input tae label.

label-for-must-reference-input-or-answer = The `for` attribute on `<label>` maun pynt at an input or an answer.

## Accessibility

accessibility-short-description-or-decorative = For accessibility, `<{ $component }>` maun either hae a short description or be merkit as decorative.

accessibility-video-short-description = For accessibility, `<video>` maun hae a short description.

accessibility-input-short-description-or-label = For accessibility, `<{ $component }>` maun hae a short description or a label.

accessibility-answer-input-short-description-or-label = For accessibility, an `<answer>` that maks an input maun hae a short description or a label.

accessibility-short-description-contains-math = Short descriptions shouldna haud math components sic as `<{ $component }>`. Spell oot ony math wi words.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } haesna eneuch contrast for the section heidin text (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; needs at least { $threshold }:1).
       *[other] { $colorName } haesna eneuch contrast for the section heidin text ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; needs at least { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = A `<circle>` throu { $count } pynts isna made for the case whaur the pynts haena numerical values.

circle-too-many-through-points = Canna wirk oot a circle throu mair nor 3 pynts.

circle-overprescribed-radius-center-points = Canna wirk oot a circle wi a gien radius, centre an throu pynts.

circle-center-with-multiple-points = Canna wirk oot a circle wi a gien centre throu mair nor 1 pynt.

circle-radius-too-small = Canna wirk oot the circle: gien that the distance atween the twa pynts is { $distance }, the gien radius { $radius } is ower wee.

circle-radius-with-many-points = Canna mak a circle throu mair nor twa pynts wi a gien radius.

circle-invalid-center-or-through-points = The centre or the throu pynts o the circle arena valid.

circle-radius-center-with-multiple-points = Canna wirk oot the radius o a circle wi a gien centre throu mair nor 1 pynt.

circle-change-radius-non-numerical = Canna chynge the radius o a circle wi throu pynts that arena numerical

circle-radius-with-points-non-numerical = Canna mak a circle throu mair nor ae pynt wi a gien radius whan the values arena numerical.

circle-change-center-non-numerical = Chyngin the centre o a circle throu pynts wi nae numerical values isna made yet.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] No eneuch dimensions for the domain o the function. The domain haes { $intervals } interval but the function haes { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } inputs
        }.
       *[other] No eneuch dimensions for the domain o the function. The domain haes { $intervals } intervals but the function haes { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } inputs
        }.
    }

function-domain-invalid-format = The format for the domain o the function isna valid.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Lattin be a maximum o the function that isna numerical.
        [minimum] Lattin be a minimum o the function that isna numerical.
        [extremum] Lattin be an extremum o the function that isna numerical.
        [point] Lattin be a pynt o the function that isna numerical.
        [slope] Lattin be a slope o the function that isna numerical.
       *[other] Lattin be a { $type } o the function that isna numerical.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Lattin be a tuim maximum o the function.
        [minimum] Lattin be a tuim minimum o the function.
        [extremum] Lattin be a tuim extremum o the function.
        [point] Lattin be a tuim pynt o the function.
       *[other] Lattin be a tuim { $type } o the function.
    }

function-points-too-close = The function haes twa pynts sittin ower close thegither. Canna define the function.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Function iterates are ainly possible gin the nummer o inputs o the function is the same as the nummer o outputs. This function haes { $inputs } input an { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } outputs
        }.
       *[other] Function iterates are ainly possible gin the nummer o inputs o the function is the same as the nummer o outputs. This function haes { $inputs } inputs an { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } outputs
        }.
    }

## `<sequence>`

sequence-invalid-length = The length o the sequence isna valid.  It maun be a hail nummer that isna negative.

sequence-invalid-step = The step o the sequence isna valid.  It maun be a nummer for a sequence o type { $type }.

sequence-invalid-endpoint-number = The "{ $attribute }" o a nummer sequence isna valid.  It maun be a nummer.

sequence-invalid-endpoint-letters = The "{ $attribute }" o a letters sequence isna valid.  It maun be a letter combination.

sequence-invalid-endpoint = The "{ $attribute }" o the sequence isna valid.

select-from-sequence-coprime-not-numbers = coprime is lat be, sin it isna nummers that are bein waled

select-from-sequence-coprime-with-exclude-combinations = coprime is lat be, sin excludeCombinations is gien

## Resolving a `target`

target-not-found = The target for `<{ $source }>` isna valid: canna find the target.

target-state-variable-not-found = The target for `<{ $source }>` isna valid: canna find a state variable cried "{ $property }" on a `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = The variables o `<odeSystem>` maun be ither nor the independent variable.

ode-system-duplicate-variable-names = Canna define ODE RHS functions wi twa dependent variables o the same name.

ode-system-rhs-function-error = Canna define the ODE RHS function.  Mistak makkin the mathjs function.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Canna define an angle atween { $count } lines

angle-invalid-through-point = The pynt in through o `<angle>` isna valid

parabola-vertex-too-many-points = A parabola wi a vertex throu mair nor 1 pynt isna made yet.

parabola-too-many-points = A parabola throu mair nor 3 pynts isna made yet.

intersection-too-many-items = An intersection o mair nor twa items isna made yet

## Other math components

ionic-compound-not-two-ions = An ionic compound o onythin ither nor twa ions isna made yet.

ionic-compound-needs-cation-and-anion = An ionic compound is made ainly for ae cation an ae anion.

solve-equations-cannot-evaluate = Canna solve the equation, sin the equation couldna be wrocht oot: { $equation }

math-operators-operand-number-required = Ye maun gie an operandNumber whan ye tak oot a math operand.

eigen-decomposition-failed = Couldna wirk oot the eigenvalues o the matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: the parameter { $parameters } disna kythe in the pattern, sae it will aye match a blank.
       *[other] `<matchesPattern>`: the parameters { $parameters } dinna kythe in the pattern, sae they will aye match a blank.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: canna mak oot grid="{ $grid }". It maun be none, medium, dense, or twa positive nummers pairtit by a space, sic as grid="1 0.5". Nae grid is drawn.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` needs a function wi { $expected ->
        [one] ae output, the slope y' at ilka pynt, sic as `y - x`
       *[other] twa outputs, the vector at ilka pynt, sic as `(y, -x)`
    }, but the function it wis gien haes { $found ->
        [one] { $found } output
       *[other] { $found } outputs
    }. { $alternative ->
        [none] Naethin is drawn.
       *[other] `<{ $alternative }>` is the component for that function. Naethin is drawn.
    }

field-function-attribute-ignored-with-child = The `function` attribute is lat be acause the function is gien inby the component an aa; the ane inby is uised. Gie the function ainly ae wey o the twa.

field-variables-ignored =
    `<{ $component }>`: the `variables` attribute names the variables o an expression written richt inby the component. { $reason ->
        [function-child] The function here is gien as a `<function>` bairn, whilk names its ain variables, sae `variables` is lat be.
       *[no-expression] There is nae sic expression here, sae `variables` is lat be.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" isna uphaudit in the prefigure renderer; uisin the richt-position behaviour.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" isna uphaudit in the prefigure renderer; uisin the tap-position behaviour.

prefigure-invalid-axis-bounds = `<graph>`: the axis bounds for the prefigure conversion arena valid; uisin the default bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: the width for the prefigure conversion isna valid; uisin the default diagram width 425.

prefigure-invalid-aspect-ratio = `<graph>`: the aspectRatio for the prefigure conversion isna valid; uisin the default aspect ratio 1.

prefigure-grid-spacing-too-fine = `<graph>`: the grid spacin is ower fine for the axis limits; the grid is left oot in the prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: annotations winna be drawn whan the PreFigure renderer isna in uise.

multiple-annotations-children = Mony `<annotations>` bairns fund in `<graph>`; aa but the hindmaist ane are lat be.

## Referring to other components

copy-unrecognized-component-type = Canna extend or copy a component type that isna kent: { $type }.

copy-prop-not-found = Couldna find the prop { $property } on a component o type { $component }

collect-no-source = Nae source fund for collect.

collect-invalid-component-type = Canna collect components o type `<{ $component }>`, sin that isna a valid component type.

reference-index-unavailable = Canna reference the index `{ $reference }`

## `<callAction>`

component-action-unavailable = Canna cry { $action } on the component `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = The data haes an invalid shape.  The raws are o unlike lengths. Fund in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = The data haes twa columns o the same name.  Fund in componentIdx :{ $componentIdx }

data-frame-missing-column-name = The data is wantin a column name.  Fund in componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = An award for this answer is biggit on the answer tag's ain sent repone, whilk will lead tae behaviour ye didna luik for.

answer-max-num-attempts-in-section-wide-check-work = Settin `maxNumAttempts` on an `<answer>` inby a haudder wi `sectionWideCheckWork` disna dae onythin, sin the nummer o attempts is ruled by the haudder. Set `maxNumAttempts` on the haudder insteid.

nested-section-wide-check-work-max-num-attempts = Settin `maxNumAttempts` on a haudder wi `sectionWideCheckWork` that sits inby anither haudder wi `sectionWideCheckWork` disna dae onythin, sin the nummer o attempts is ruled by the ooter haudder. Set `maxNumAttempts` on the ooter haudder insteid.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] The { $attributes } attribute winna dae onythin wioot symbolicEquality set.
       *[other] The { $attributes } attributes winna dae onythin wioot symbolicEquality set.
    }

answer-invalid-type = The type for the answer isna valid: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sin the component `<{ $component }>` haesna a name, it canna be uised for a module attribute

module-attribute-name-already-defined = The component `<{ $component } name="{ $name }">` canna be uised as an attribute for a module acause the `<module>` component type haes a "{ $name }" attribute defined areddies.

conditional-content-condition-ignored = The `condition` attribute is lat be on a `<conditionalContent>` component wi case or else bairns.

slider-markers-type-mismatch = The markers type disna match the slider type.

pretzel-problem-needs-statement-and-answer = This pretzel isna valid: ilka `<problem>` maun haud ae `<statement>` an ae `<answer>`.

pretzel-circuit-first-problem-distractor = This pretzel isna valid: in mode="circuit", the first `<problem>` canna be a distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] The value { $values } for the attribute `{ $attribute }` isna valid; lattin it be.
       *[other] The values { $values } for the attribute `{ $attribute }` arena valid; lattin them be.
    }

attribute-must-be-references = The value `{ $value }` for the attribute `{ $attribute }` isna valid. The attribute maun be made o references that stert wi a `$`.

math-input-invalid-function-names = <mathInput>: lat be function name(s) that arena valid in { $attribute }: { $names }. Ilka name's display segment maun be at least 2 characters (letters or dashes); an optional `|<mathspeak alternative>` suffix can come efter.

## Building components from the source

component-type-invalid = The component type isna valid: `<{ $componentType }>`

attribute-repeated = Canna say the attribute { $attribute } twice.

attribute-invalid-for-component = The attribute "{ $attribute }" isna valid for a component o type `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Style definition { $styleNumber } haesna eneuch contrast for { $context ->
        [text-on-background] the text colour agin the backgrund colour
        [high-contrast] the heich-contrast colour agin the canvas
        [line] the line colour agin the canvas
        [marker] the marker colour agin the canvas
       *[text-on-canvas] the text colour agin the canvas
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; needs at least { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Tho style definition { $styleNumber } haes colours that gie eneuch contrast for licht mode, the dark-mode colours wrocht frae thae values haena eneuch contrast for the text colour agin the backgrund colour ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; needs at least { $threshold }:1). { $suggestion ->
        [available] Tae mak siccar o eneuch contrast in dark mode, either heize the licht-mode contrast (e.g. set { $lightAttribute }="{ $lightColor }") or owergang the dark-mode colour (e.g. set { $darkAttribute }="{ $darkColor }").
       *[none] Tae mak siccar o eneuch contrast in dark mode, heize the licht-mode contrast or owergang the wrocht colours wi textColorDarkMode an/or backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Tho style definition { $styleNumber } haes a text colour that gies eneuch contrast for licht mode, the dark-mode text colour wrocht frae that value haesna eneuch contrast agin the canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; needs at least { $threshold }:1). { $suggestion ->
        [available] Tae mak siccar o eneuch contrast in dark mode, either heize the licht-mode contrast (e.g. set textColor="{ $lightColor }") or owergang the dark-mode colour (e.g. set textColorDarkMode="{ $darkColor }").
       *[none] Tae mak siccar o eneuch contrast in dark mode, heize the licht-mode contrast or owergang the wrocht colour wi textColorDarkMode.
    }

section-multiple-style-palettes = A section can wale ainly ae <stylePalette>; uisin the hindmaist ane.

## Unique variants

variant-num-to-select-not-non-negative-integer = canna sattle the unique variants o { $component }, sin numToSelect isna a hail nummer that isna negative.

variant-num-to-select-not-constant-number = canna sattle the unique variants o { $component }, sin numToSelect isna a constant nummer.

variant-with-replacement-not-constant-boolean = canna sattle the unique variants o { $component }, sin withReplacement isna a constant boolean.

variant-select-weight-disables-unique = Unique variants for select are aff gin ony option haes selectWeight or selectForVariants gien

variant-coprime-undetermined = canna sattle the unique variants o { $component }, sin it canna be sattelt that coprime is aye fause.

variant-attribute-not-constant = canna sattle the unique variants o { $component }, sin { $attribute } isna a constant.

variant-attribute-not-number = canna sattle the unique variants o { $component }, sin { $attribute } isna a nummer.

variant-attribute-wrong-type-for-sequence =
    canna sattle the unique variants o { $component } o { $type } type, sin { $attribute } isna { $expected ->
        [letters-combination] a combination o letters
        [math-expression] a valid math expression
        [integer] a hail nummer
       *[number] a nummer
    }.

variant-length-not-integer = canna sattle the unique variants o { $component }, sin length isna a hail nummer.

variant-sort-not-implemented = unique variants o a { $component } wi sort arena made yet

variant-exclude-combinations-not-implemented = unique variants o a { $component } wi excludeCombinations arena made yet

variant-math-exclude-not-implemented = unique variants o a { $component } o type math wi exclude arena made yet

variant-non-constant-exclude-not-implemented = unique variants o a { $component } wi an exclude that isna constant arena made yet

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: no uphaudit in the graph prefigure renderer; the descendant is jumpit.

prefigure-descendant-invalid-geometry = { $subject }: the geometry isna finite or is nae complete; the descendant is jumpit.

prefigure-curve-label-omitted = { $subject }: labels arena uphaudit on convertit curve elements; the label is left oot.

prefigure-curve-unsupported-definition-type = { $subject }: the curve function definition type '{ $definitionType }' isna uphaudit; the descendant is jumpit.

prefigure-region-flip-functions-unsupported = { $subject }: the flipFunctions attribute on regionBetweenCurves isna uphaudit; the descendant is jumpit.

prefigure-region-non-formula-child = { $subject }: ainly formula-typit bairn functions are uphaudit on regionBetweenCurves; the descendant is jumpit.

prefigure-label-position-unsupported =
    { $subject }: the labelPosition '{ $labelPosition }' isna uphaudit for a { $labelKind ->
        [line-family] line-faimily label
       *[point] pynt label
    }; the default PreFigure alignment is uised.

prefigure-fill-style-unsupported = { $subject }: the fill style '{ $fillStyle }' isna uphaudit by PreFigure; fawin back tae a solid fill.

prefigure-line-style-unknown = { $subject }: the unkent line style '{ $lineStyle }' is left oot o the PreFigure output.

prefigure-marker-style-mapped-to-diamond = { $subject }: the marker style '{ $markerStyle }' is turnt intae the PreFigure style 'diamond'.

prefigure-marker-style-unsupported = { $subject }: the marker style '{ $markerStyle }' isna uphaudit by PreFigure; the default style is uised.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: the `ref` isna valid; canna wirk oot the target. The annotation is left oot.

annotation-ref-multiple-targets = `<annotation>`: the `ref` cam tae mony targets; uisin the first ane.

annotation-ref-outside-graph = `<annotation>`: the `ref` isna valid; the target is ootby the graph roond aboot it. The annotation is left oot.

annotation-ref-unsupported-target = `<annotation>`: the `ref` isna valid; the target isna a graphical object the prefigure conversion uphauds. The annotation is left oot.

annotation-text-missing = `<annotation>`: the `text` is missin or tuim; sendin oot tuim text.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] A circular dependency wis fund.
       *[other] A circular dependency wis fund that taks in a `<{ $componentType }>` component.
    }

reference-no-referent = Nae referent fund for the reference: `{ $reference }`

reference-multiple-referents = Mony referents fund for the reference: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = The format for the attribute { $attribute } o `<{ $componentType }>` isna valid.

children-invalid = Bairns that arena valid for `<{ $componentType }>`: fund invalid bairns: { $children }

## Falling back to a default

attribute-value-invalid-using-default = The value `{ $value }` for the attribute `{ $attribute }` isna valid, uisin the value `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML version { $version } wisna fund.
       *[other] DoenetML version { $version } wisna fund. Fawin back tae version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Invalid DoenetML: { $content }

parse-tag-missing-close-tag = Invalid DoenetML: The tag `{ $tag }` haes nae steekin tag. Luikit for a sel-steekin tag or a `</{ $tagName }>` tag.

parse-tag-error = Invalid DoenetML: Mistak in the tag `<{ $tagName }>`

parse-attribute-missing-value = Invalid DoenetML: The invalid attribute `{ $attribute }` luiks tae be wantin a value.

parse-attribute-invalid = Invalid DoenetML: Invalid attribute `{ $attribute }`

parse-attribute-value-invalid = Invalid DoenetML: Invalid attribute value `{ $value }`

parse-attribute-value-quote-mismatch = Invalid DoenetML: Invalid attribute value `{ $value }`. The quote merks dinna match. Ye luik tae be wantin a `{ $quote }`

parse-open-tag-name-missing = Invalid DoenetML: Fund a tag wioot a tag name, e.g. `<`

parse-tag-not-closed = Invalid DoenetML: The tag `{ $tag }` wisna steekit (a `>` luiks tae be missin).

parse-self-closing-tag-name-missing = Invalid DoenetML: Fund a tag wioot a tag name `<{ $content }>`

parse-self-closing-tag-not-closed = Invalid DoenetML: The tag `{ $tag }` wisna steekit (`/>` luiks tae be missin).

parse-tag-invalid-attributes = Invalid DoenetML: The tag `{ $tag }` isna valid. It micht hae wrang attributes.

parse-close-tag-name-missing = Invalid DoenetML: Fund a steekin tag wioot a tag name, e.g. `</`

parse-attribute-value-unquoted = Attribute values maun be inside quotes: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Invalid DoenetML: Fund the steekin tag `{ $tag }`, but nae openin tag tae gang wi it

parse-close-tag-mismatched = Invalid DoenetML: The steekin tag disna match. Luikit for `</{ $expected }>`. Fund `{ $found }`

parser-node-unconvertible = Couldna turn the node { $node } intae a Dast node.

## Names

name-attribute-invalid =
    Invalid attribute name='{ $name }'. { $reason ->
        [characters] Names can haud ainly letters, nummers, unnerscores or hyphens.
       *[start] Names maun stert wi a letter.
    }

component-name-invalid-start = Invalid component name "{ $name }". Names maun stert wi a letter.

## `<answer>` sugar

answer-video-watched-missing-video = An answer o type videoWatched maun hae a video attribute

answer-video-watched-video-not-reference = An answer o type videoWatched maun hae a video attribute that is a reference

answer-name-not-single-text = The answer's name attribute maun hae a single text bairn

## Referencing another document

external-doenetml-recursion-limit = Canna get the ootside DoenetML acause there are ower mony levels o recursion. Is there a circular reference?

external-doenetml-unavailable = Canna get the DoenetML frae { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Invalid DoenetML gotten frae { $attribute }="{ $uri }": it didna match the component type "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] The attribute `{ $from }` is auld-farrant; uise `{ $to }` insteid.
       *[other] [deprecation] The attribute `{ $from }` on `<{ $component }>` is auld-farrant; uise `{ $to }` insteid.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] The attribute `{ $from }` is auld-farrant an is lat be acause `{ $to }` is gien an aa.
       *[other] [deprecation] The attribute `{ $from }` on `<{ $component }>` is auld-farrant an is lat be acause `{ $to }` is gien an aa.
    }

deprecated-attribute-ignored = [deprecation] The attribute `{ $attribute }` on `<{ $component }>` is auld-farrant an is lat be.

deprecated-attribute-to-child = [deprecation] The attribute `{ $attribute }` on `<{ $component }>` is auld-farrant; uise a `<{ $child }>` bairn insteid.

deprecated-attribute-value-renamed = [deprecation] The value `{ $value }` o the attribute `{ $attribute }` on `<{ $component }>` is auld-farrant; uise `{ $to }` insteid.


## Language coverage

pluralize-english-only = `<pluralize>` can ainly pluralise English, sae its text is left as it wis in a document written in { $locale }. Write the plural form richt oot, or set it wi the `pluralForm` attribute.


## Checking against the schema

schema-element-unrecognized = The element `<{ $tag }>` isna a Doenet element that is kent.

schema-element-not-allowed-at-root = The element `<{ $tag }>` isna alloued at the ruit o the document.

schema-element-not-allowed-inside = The element `<{ $tag }>` isna alloued inby `<{ $parent }>`.

schema-attribute-unrecognized = The element `<{ $tag }>` haesna an attribute cried `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] The attribute `{ $attribute }` o the element `<{ $tag }>` maun be a list whase items are ilka ane o: { $allowed }
       *[other] The attribute `{ $attribute }` o the element `<{ $tag }>` maun be ane o: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Invalid variant name for select.  The variant name { $variantName } kythes in { $numOptions } options but the nummer tae wale is { $numToSelect }.

select-variant-name-without-options = Some variants are gien for select but nae options are gien for the possible variant name: { $variantName }.

select-variant-name-not-possible = The variant name { $variantName } that is gien for select isna a possible variant name.

select-too-few-options = Canna wale { $numToSelect } components frae ainly { $numOptions }.

select-from-sequence-too-few-values = Canna wale { $numToSelect } values frae a sequence o length { $length }.

select-from-sequence-indices-count-mismatch = The nummer o indices gien for select maun match the nummer tae wale

select-from-sequence-indices-not-integers = Aa the indices gien for select maun be hail nummers

select-from-sequence-index-excluded = The gien index o selectfromsequence wis ane that wis left oot

select-from-sequence-indices-excluded-combination = The gien indices o selectfromsequence war a combination that wis left oot

select-from-sequence-coprime-not-positive-integers = Canna wale coprime combinations, sin it isna positive hail nummers that are bein waled.

select-from-sequence-coprime-common-factor = Canna wale coprime nummers. Aa the possible values share a common factor. (The gien values o "from" or "to" maun be coprime wi "step".)

select-from-sequence-coprime-single-number = Canna wale coprime combinations frae a single nummer that isna 1.

select-from-sequence-excluded-too-many-combinations = Ower 70% o the combinations in selectFromSequence war left oot

select-from-sequence-coprime-none-found = Couldna wale coprime nummers. Aa the possible values share a common factor.

select-from-sequence-too-few-unique-values = Canna wale { $numToSelect } unique values frae a sequence o length { $numPossibleValues }

select-prime-numbers-too-few-values = Canna wale { $numToSelect } values frae a list o primes o length { $numValues }

select-prime-numbers-values-count-mismatch = The nummer o values gien for select maun match the nummer tae wale

select-prime-numbers-values-not-prime = Aa the values gien for select prime number maun be in the list o primes

select-prime-numbers-values-excluded-combination = The gien values o selectPrimeNumbers war a combination that wis left oot

select-prime-numbers-excluded-too-many-combinations = Ower 70% o the combinations in selectPrimeNumbers war left oot

select-random-combination-fluke = By a byordinar unlikely fluke, couldna wale a combination o random values

select-random-value-fluke = By a byordinar unlikely fluke, couldna wale a random value

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` isna drawn inby the math; the expression is set the wey it wis afore inputs could be pit inby it. { $reason ->
        [not-inline] Ainly an `inline` choice input fits inby an expression; wioot `inline` it is a block o buttons.
        [expanded] An `expanded` text input is a mony-line box, whilk is ower muckle tae sit inby an expression.
        [on-graph] On a graph the expression is drawn as ae picter, whilk haes nae room for a control.
       *[relative-width] Its `width` is relative (a percentage or `em`), whilk haes naethin tae meisur agin inby an expression. Gie the width in absolute units, sic as `px`, insteid.
    }
