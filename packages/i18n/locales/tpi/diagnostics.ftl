# Tok Pisin diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source. That line matters more here than in any other catalog in this
# batch, because Tok Pisin's own words look like English ones: «lain» is a
# translated word and `line` in a tag name is not.
#
# Tok Pisin marks no number on the noun, so a counted message whose only English
# difference is the noun's number renders one string here and the select is
# dropped. The count still arrives and is still formatted.


## `<lineSegment>`

# No select: «i no bihainim» does not agree with what is ignored, and the list
# carries no number of its own.
line-segment-attributes-ignored-with-endpoints = i no bihainim { $attributes } taim tupela arere i makim pinis

line-segment-attributes-ignored-with-endpoint-and-midpoint = i no bihainim { $attributes } taim wanpela arere na namel i makim pinis

line-segment-midpoint-offset-without-midpoint = midpointOffset i no gat wok sapos i no gat namel

## `<line>`

line-points-undetermined-dimensions = Lain i go long ol poin we ol i no save long ol dimensen bilong en.

line-points-too-few-dimensions = Lain i mas go long ol poin i gat tupela o moa dimensen.

line-points-depend-on-variables = Lain i go long ol poin i sanap long ol veriebol: { $variables }.

line-equation-invalid-format = Fomat bilong ikuesen bilong lain i no stret long ol veriebol { $variable1 } na { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ret i kam long through, endpoint na direction.  I no bihainim through ol i makim.

ray-dimension-mismatch = numDimensions i no wankain insait long ret.

## `<vector>`

vector-overprescribed-head = Vekta i kam long head, tail na displacement.  I no bihainim head ol i makim.

vector-dimension-mismatch = numDimensions i no wankain insait long vekta.

## Attracting and constraining

attract-to-without-nearest-point = I no inap pulim i go long `<{ $component }>`, long wanem em i no gat veriebol nearestPoint.

constrain-to-without-nearest-point = I no inap pasim i go long `<{ $component }>`, long wanem em i no gat veriebol nearestPoint.

constrain-to-interior-without-nearest-point = I no inap pasim i go insait long `<{ $component }>`, long wanem em i no gat veriebol nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = i no bihainim labelPosition long choiceInput i no inline

## Ordering children by index

choice-input-indices-count-mismatch = I no bihainim ol indeks ol i makim long choiceInput, long wanem namba bilong ol indeks i no wankain wantaim namba bilong ol pikinini bilong makim.

pretzel-indices-count-mismatch = I no bihainim ol indeks ol i makim long problem, long wanem namba bilong ol indeks i no wankain wantaim namba bilong ol pikinini problem.

shuffle-indices-count-mismatch = I no bihainim ol indeks ol i makim long shuffle, long wanem namba bilong ol indeks i no wankain wantaim namba bilong ol hap.

indices-ignored-out-of-range = I no bihainim ol indeks ol i makim long { $component }, long wanem sampela indeks i go ausait long mak.

pretzel-indices-repeated = I no bihainim ol indeks ol i makim long pretzel, long wanem sampela indeks i kamap tupela taim.

pretzel-circuit-first-index = I no bihainim ol indeks ol i makim long pretzel long mode circuit, long wanem namba wan indeks i mas 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Bilong `<{ $component }>` i ken wok wantaim ol pikinini string, ol i mas makim atribiut `type`.

invalid-type-defaulting-to-math = type { $type } i no stret long hap { $component }. Em i mas wanpela bilong math, text, number, o boolean. Yusim math.

string-not-valid-component-to-arrange = String "{ $value }" i no stretpela hap long { $component }. I no bihainim.

## Types and variables

invalid-type-defaulting-to-number = type { $type } i no stret, ol i putim type long number.

invalid-variable-value = Valiu bilong wanpela veriebol i no stret: `{ $value }`

## Variants

variant-index-must-be-number = Indeks bilong kain { $index } i mas stap namba

variant-index-must-be-integer = Indeks bilong kain { $index } i mas stap namba i no gat hap

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` i no wok yet long ol mak i stap strong. Ol brait i kamap relatiu.

side-by-side-absolute-margins = `<{ $component }>` i no wok yet long ol mak i stap strong. Ol majin i kamap relatiu.

side-by-side-no-block-child = `<{ $component }>` i no stret: em i mas gat wanpela pikinini block.

## `<label>`

label-for-ignored-on-graphical = I no bihainim atribiut `for` long `<label>` bilong piksa.

label-for-must-resolve-to-one = Atribiut `for` long `<label>` i mas makim wanpela hap tasol.

label-for-unresolved = Atribiut `for` long `<label>` i no inap makim wanpela hap.

label-for-answer-with-authored-inputs = Atribiut `for` long `<label>` i makim wanpela `<answer>` i gat ol input man i raitim; makim input stret.

label-for-answer-without-input = Atribiut `for` long `<label>` i makim wanpela `<answer>` i no gat input bilong putim nem.

label-for-must-reference-input-or-answer = Atribiut `for` long `<label>` i mas makim wanpela input o wanpela answer.

## Accessibility

accessibility-short-description-or-decorative = Bilong akses, `<{ $component }>` i mas gat sotpela tok save o ol i makim olsem bilas tasol.

accessibility-video-short-description = Bilong akses, `<video>` i mas gat sotpela tok save.

accessibility-input-short-description-or-label = Bilong akses, `<{ $component }>` i mas gat sotpela tok save o nem.

accessibility-answer-input-short-description-or-label = Bilong akses, wanpela `<answer>` i wokim input i mas gat sotpela tok save o nem.

accessibility-short-description-contains-math = Ol sotpela tok save i no ken gat ol hap matematik olsem `<{ $component }>`. Raitim matematik long ol tok.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Kontras bilong { $colorName } i sot long tok bilong het bilong seksen (mode tudak) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i nidim { $threshold }:1 o moa).
       *[other] Kontras bilong { $colorName } i sot long tok bilong het bilong seksen ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i nidim { $threshold }:1 o moa).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` i go long { $count } poin i no wok yet sapos ol poin i no gat valiu namba.

circle-too-many-through-points = I no inap kaunim raunpela i go long moa long 3 poin.

circle-overprescribed-radius-center-points = I no inap kaunim raunpela we ol i makim redias, namel na ol poin em i go long en.

circle-center-with-multiple-points = I no inap kaunim raunpela we ol i makim namel bilong en na em i go long moa long 1 poin.

circle-radius-too-small = I no inap kaunim raunpela: long wanem spes namel long tupela poin em { $distance }, na redias { $radius } ol i makim em i liklik tumas.

circle-radius-with-many-points = I no inap wokim raunpela i go long moa long tupela poin wantaim redias ol i makim.

circle-invalid-center-or-through-points = Namel o ol poin raunpela i go long en i no stret.

circle-radius-center-with-multiple-points = I no inap kaunim redias bilong raunpela we ol i makim namel bilong en na em i go long moa long 1 poin.

circle-change-radius-non-numerical = I no inap senisim redias bilong raunpela i go long ol poin i no gat namba

circle-radius-with-points-non-numerical = I no inap wokim raunpela i go long moa long wanpela poin wantaim redias ol i makim sapos i no gat valiu namba.

circle-change-center-non-numerical = Senisim namel bilong raunpela i go long ol poin i no gat valiu namba i no wok yet.

## `<function>`

# English's two counts multiply out to four sentences; Tok Pisin has one,
# because «namel» and «input» do not change for number. Both selects are dropped
# and both counts still arrive.
function-domain-insufficient-dimensions = Ol dimensen bilong domain i sot long pankisen. Domain i gat { $intervals } namel tasol pankisen i gat { $inputs } input.

function-domain-invalid-format = Fomat bilong domain long pankisen i no stret.

function-ignoring-non-numerical =
    { $type ->
        [maximum] I no bihainim bikpela mak bilong pankisen we i no namba.
        [minimum] I no bihainim liklik mak bilong pankisen we i no namba.
        [extremum] I no bihainim las mak bilong pankisen we i no namba.
        [point] I no bihainim poin bilong pankisen we i no namba.
        [slope] I no bihainim slop bilong pankisen we i no namba.
       *[other] I no bihainim { $type } bilong pankisen we i no namba.
    }

function-ignoring-empty =
    { $type ->
        [maximum] I no bihainim bikpela mak bilong pankisen we i emti.
        [minimum] I no bihainim liklik mak bilong pankisen we i emti.
        [extremum] I no bihainim las mak bilong pankisen we i emti.
        [point] I no bihainim poin bilong pankisen we i emti.
       *[other] I no bihainim { $type } bilong pankisen we i emti.
    }

function-points-too-close = Pankisen i gat tupela poin i stap klostu tumas. I no inap makim pankisen.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Ol iteret bilong pankisen inap kamap tasol sapos namba bilong ol input i wankain wantaim namba bilong ol autput. Dispela pankisen i gat { $inputs } input na { $outputs } autput.

## `<sequence>`

sequence-invalid-length = Longpela bilong sequence i no stret.  Em i mas namba i no gat hap na i no daunbilo long zero.

sequence-invalid-step = step bilong sequence i no stret.  Em i mas namba long sequence type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" bilong sequence namba i no stret.  Em i mas namba.

sequence-invalid-endpoint-letters = "{ $attribute }" bilong sequence leta i no stret.  Em i mas bung bilong ol leta.

sequence-invalid-endpoint = "{ $attribute }" bilong sequence i no stret.

select-from-sequence-coprime-not-numbers = i no bihainim coprime long wanem samting ol i makim i no namba

select-from-sequence-coprime-with-exclude-combinations = i no bihainim coprime long wanem ol i makim excludeCombinations

## Resolving a `target`

target-not-found = target i no stret long `<{ $source }>`: i no painim target.

target-state-variable-not-found = target i no stret long `<{ $source }>`: i no painim veriebol i gat nem "{ $property }" long wanpela `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Ol veriebol bilong `<odeSystem>` i mas narapela long veriebol i stap fri.

ode-system-duplicate-variable-names = I no inap makim ol pankisen RHS bilong ODE we ol nem veriebol i wankain.

ode-system-rhs-function-error = I no inap makim pankisen RHS bilong ODE.  I gat asua long wokim pankisen mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = I no inap makim wanpela kona namel long { $count } lain

angle-invalid-through-point = Poin i no stret long through bilong `<angle>`

parabola-vertex-too-many-points = Parabola i gat het na i go long moa long 1 poin i no wok yet.

parabola-too-many-points = Parabola i go long moa long 3 poin i no wok yet.

intersection-too-many-items = Bung bilong moa long tupela samting i no wok yet

## Other math components

ionic-compound-not-two-ions = Kompaun aionik long narapela samting i no tupela aion i no wok yet.

ionic-compound-needs-cation-and-anion = Kompaun aionik i wok tasol long wanpela katiaon na wanpela aniaon.

solve-equations-cannot-evaluate = I no inap stretim ikuesen long wanem i no inap skelim ikuesen: { $equation }

math-operators-operand-number-required = Ol i mas makim operandNumber taim ol i kisim wanpela operand matematik.

eigen-decomposition-failed = I no inap kaunim ol eigenvalue bilong matriks

## `<matchesPattern>`

# No select: the parameter list carries no number that the noun would show.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameta { $parameters } i no kamap insait long pattern, olsem na em bai wankain wantaim emti samting oltaim.

## `<graph>`

graph-grid-invalid = `<graph>`: i no save long grid="{ $grid }". Em i mas none, medium, dense, o tupela gutpela namba i gat spes namel, olsem grid="1 0.5". I no gat grid ol i draim.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" i no wok long renderer prefigure; yusim pasin bilong ples long raitsait.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" i no wok long renderer prefigure; yusim pasin bilong ples long antap.

prefigure-invalid-axis-bounds = `<graph>`: ol arere bilong akses i no stret long senis prefigure; yusim nomol bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: brait i no stret long senis prefigure; yusim nomol brait bilong daiagram 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio i no stret long senis prefigure; yusim nomol aspect ratio 1.

prefigure-grid-spacing-too-fine = `<graph>`: spes bilong grid i liklik tumas long ol arere bilong akses; i no draim grid long renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: i no draim ol annotation sapos i no yusim renderer PreFigure.

multiple-annotations-children = Painim planti pikinini `<annotations>` insait long `<graph>`; i no bihainim olgeta, las wan tasol.

## Referring to other components

copy-unrecognized-component-type = I no inap kopim o skruim kain hap ol i no save long en: { $type }.

copy-prop-not-found = I no painim prop { $property } long hap kain { $component }

collect-no-source = I no painim source long collect.

collect-invalid-component-type = I no inap bungim ol hap kain `<{ $component }>` long wanem kain hap i no stret.

reference-index-unavailable = I no inap makim indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = I no inap singautim { $action } long hap `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Sep bilong deta i no stret.  Longpela bilong ol lain i no wankain. Painim long componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Deta i gat ol nem kolam i wankain.  Painim long componentIdx :{ $componentIdx }

data-frame-missing-column-name = Deta i no gat nem bilong wanpela kolam.  Painim long componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award bilong dispela bekim i sanap long bekim answer tag yet i salim, na dispela bai kamapim pasin yumi no wetim.

answer-max-num-attempts-in-section-wide-check-work = Putim `maxNumAttempts` long wanpela `<answer>` insait long wanpela bokis i gat `sectionWideCheckWork` i no gat wok, long wanem bokis i bosim namba bilong ol traim. Putim `maxNumAttempts` long bokis.

nested-section-wide-check-work-max-num-attempts = Putim `maxNumAttempts` long wanpela bokis i gat `sectionWideCheckWork` we em i stap insait long narapela bokis i gat `sectionWideCheckWork` i no gat wok, long wanem bokis ausait i bosim namba bilong ol traim. Putim `maxNumAttempts` long bokis ausait.

# No select: «atribiut» is the same word for one and for many.
answer-attributes-need-symbolic-equality = Atribiut { $attributes } bai i no gat wok sapos symbolicEquality i no stap.

answer-invalid-type = Kain i no stret long bekim: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Long wanem hap `<{ $component }>` i no gat nem, em i no inap wok olsem atribiut bilong module

module-attribute-name-already-defined = Hap `<{ $component } name="{ $name }">` i no inap wok olsem atribiut bilong module long wanem kain hap `<module>` i gat atribiut "{ $name }" pinis.

conditional-content-condition-ignored = I no bihainim atribiut `condition` long hap `<conditionalContent>` i gat ol pikinini case o else.

slider-markers-type-mismatch = Kain bilong ol marker i no wankain wantaim kain bilong slider.

pretzel-problem-needs-statement-and-answer = Pretzel i no stret: olgeta `<problem>` i mas gat wanpela `<statement>` na wanpela `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel i no stret: long mode="circuit", namba wan `<problem>` i no ken stap distractor.

## Attribute values

# No select: «valiu» is the same word for one and for many.
attribute-invalid-values = Valiu { $values } i no stret long atribiut `{ $attribute }`; i no bihainim.

attribute-must-be-references = Valiu `{ $value }` i no stret long atribiut `{ $attribute }`. Atribiut i mas kamap long ol refrens i kirap wantaim `$`.

math-input-invalid-function-names = <mathInput>: i no bihainim ol nem pankisen i no stret long { $attribute }: { $names }. Olgeta nem i mas gat 2 o moa leta (leta o haipen); wanpela sufiks `|<mathspeak alternative>` inap bihainim.

## Building components from the source

component-type-invalid = Kain hap i no stret: `<{ $componentType }>`

attribute-repeated = I no inap raitim atribiut { $attribute } tupela taim.

attribute-invalid-for-component = Atribiut "{ $attribute }" i no stret long hap kain `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Kontras bilong stail { $styleNumber } i sot long { $context ->
        [text-on-background] kala bilong tok i birua long kala bilong baksait
        [high-contrast] kala i gat bikpela kontras i birua long kanvas
        [line] kala bilong lain i birua long kanvas
        [marker] kala bilong marker i birua long kanvas
       *[text-on-canvas] kala bilong tok i birua long kanvas
    }{ $mode ->
        [dark] { " (mode tudak)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i nidim { $threshold }:1 o moa).

style-definition-dark-mode-text-background-contrast =
    Maski stail { $styleNumber } i gat ol kala ol i makim na kontras bilong ol i inap long mode lait, kontras bilong kala bilong tok i birua long kala bilong baksait i sot insait long ol kala ol i kisim long mode tudak ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i nidim { $threshold }:1 o moa). { $suggestion ->
        [available] Bilong kontras i inap long mode tudak, apim kontras bilong mode lait (olsem, putim { $lightAttribute }="{ $lightColor }") o senisim kala bilong mode tudak (olsem, putim { $darkAttribute }="{ $darkColor }").
       *[none] Bilong kontras i inap long mode tudak, apim kontras bilong mode lait o senisim ol kala ol i kisim wantaim textColorDarkMode na/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Maski stail { $styleNumber } i gat kala bilong tok ol i makim na kontras bilong en i inap long mode lait, kontras bilong kala bilong tok ol i kisim long mode tudak i sot i birua long kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i nidim { $threshold }:1 o moa). { $suggestion ->
        [available] Bilong kontras i inap long mode tudak, apim kontras bilong mode lait (olsem, putim textColor="{ $lightColor }") o senisim kala bilong mode tudak (olsem, putim textColorDarkMode="{ $darkColor }").
       *[none] Bilong kontras i inap long mode tudak, apim kontras bilong mode lait o senisim kala ol i kisim wantaim textColorDarkMode.
    }

section-multiple-style-palettes = Wanpela seksen inap makim wanpela <stylePalette> tasol; yusim las wan.

## Unique variants

variant-num-to-select-not-non-negative-integer = i no inap save long ol kain i narapela bilong { $component } long wanem numToSelect i no namba i no gat hap na i no daunbilo long zero.

variant-num-to-select-not-constant-number = i no inap save long ol kain i narapela bilong { $component } long wanem numToSelect i no namba i stap strong.

variant-with-replacement-not-constant-boolean = i no inap save long ol kain i narapela bilong { $component } long wanem withReplacement i no boolean i stap strong.

variant-select-weight-disables-unique = Ol kain i narapela bilong select i dai sapos i gat wanpela opsen i gat selectWeight o selectForVariants

variant-coprime-undetermined = i no inap save long ol kain i narapela bilong { $component } long wanem i no inap save olsem coprime i false oltaim.

variant-attribute-not-constant = i no inap save long ol kain i narapela bilong { $component } long wanem { $attribute } i no stap strong.

variant-attribute-not-number = i no inap save long ol kain i narapela bilong { $component } long wanem { $attribute } i no namba.

variant-attribute-wrong-type-for-sequence =
    i no inap save long ol kain i narapela bilong { $component } kain { $type } long wanem { $attribute } i no { $expected ->
        [letters-combination] bung bilong ol leta
        [math-expression] stretpela tok matematik
        [integer] namba i no gat hap
       *[number] namba
    }.

variant-length-not-integer = i no inap save long ol kain i narapela bilong { $component } long wanem length i no namba i no gat hap.

variant-sort-not-implemented = ol kain i narapela bilong wanpela { $component } i gat sort i no wok yet

variant-exclude-combinations-not-implemented = ol kain i narapela bilong wanpela { $component } i gat excludeCombinations i no wok yet

variant-math-exclude-not-implemented = ol kain i narapela bilong wanpela { $component } kain math i gat exclude i no wok yet

variant-non-constant-exclude-not-implemented = ol kain i narapela bilong wanpela { $component } i gat exclude i no stap strong i no wok yet

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: i no wok long renderer prefigure bilong graph; kalapim dispela pikinini.

prefigure-descendant-invalid-geometry = { $subject }: jiometri i no pinis o i no gat arere; kalapim dispela pikinini.

prefigure-curve-label-omitted = { $subject }: ol nem i no wok long ol kurup ol i senisim; i no bihainim nem.

prefigure-curve-unsupported-definition-type = { $subject }: kain mining bilong pankisen kurup '{ $definitionType }' i no wok; kalapim dispela pikinini.

prefigure-region-flip-functions-unsupported = { $subject }: atribiut flipFunctions long regionBetweenCurves i no wok; kalapim dispela pikinini.

prefigure-region-non-formula-child = { $subject }: ol pikinini pankisen kain formula tasol i wok long regionBetweenCurves; kalapim dispela pikinini.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' i no wok long { $labelKind ->
        [line-family] nem bilong famili bilong lain
       *[point] nem bilong poin
    }; yusim nomol pasin bilong stretim bilong PreFigure.

prefigure-fill-style-unsupported = { $subject }: stail bilong pulapim '{ $fillStyle }' i no wok long PreFigure; go bek long pulap i strong.

prefigure-line-style-unknown = { $subject }: stail bilong lain '{ $lineStyle }' ol i no save long en, i no bihainim long autput bilong PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: stail bilong marker '{ $markerStyle }' i go long stail 'diamond' bilong PreFigure.

prefigure-marker-style-unsupported = { $subject }: stail bilong marker '{ $markerStyle }' i no wok long PreFigure; yusim nomol stail.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` i no stret; i no inap makim target. I no bihainim annotation.

annotation-ref-multiple-targets = `<annotation>`: `ref` i makim planti target; yusim namba wan target.

annotation-ref-outside-graph = `<annotation>`: `ref` i no stret; target i stap ausait long graph i holim em. I no bihainim annotation.

annotation-ref-unsupported-target = `<annotation>`: `ref` i no stret; target i no wanpela samting bilong piksa i wok long senis prefigure. I no bihainim annotation.

annotation-text-missing = `<annotation>`: `text` i no stap o i emti; i givim emti tok.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Painim wanpela raunwara sanap.
       *[other] Painim wanpela raunwara sanap i kisim hap `<{ $componentType }>` insait.
    }

reference-no-referent = I no gat samting ol i painim we refrens i makim: `{ $reference }`

reference-multiple-referents = Planti samting ol i painim we refrens i makim: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Fomat bilong atribiut { $attribute } bilong `<{ $componentType }>` i no stret.

children-invalid = Ol pikinini bilong `<{ $componentType }>` i no stret: painim ol pikinini i no stret: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valiu `{ $value }` i no stret long atribiut `{ $attribute }`, yusim valiu `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] I no painim vesen DoenetML { $version }.
       *[other] I no painim vesen DoenetML { $version }. Go bek long vesen { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML i no stret: { $content }

parse-tag-missing-close-tag = DoenetML i no stret: Tag `{ $tag }` i no gat tag bilong pasim. Yumi wet long tag i pasim em yet o tag `</{ $tagName }>`.

parse-tag-error = DoenetML i no stret: I gat asua long tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML i no stret: I luk olsem atribiut `{ $attribute }` i no gat valiu.

parse-attribute-invalid = DoenetML i no stret: Atribiut `{ $attribute }` i no stret

parse-attribute-value-invalid = DoenetML i no stret: Valiu bilong atribiut `{ $value }` i no stret

parse-attribute-value-quote-mismatch = DoenetML i no stret: Valiu bilong atribiut `{ $value }` i no stret. Ol mak bilong kot i no wankain. I luk olsem i sot wanpela `{ $quote }`

parse-open-tag-name-missing = DoenetML i no stret: Painim wanpela tag i no gat nem, olsem `<`

parse-tag-not-closed = DoenetML i no stret: Tag `{ $tag }` i no pas (i luk olsem i sot `>`).

parse-self-closing-tag-name-missing = DoenetML i no stret: Painim wanpela tag i no gat nem `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML i no stret: Tag `{ $tag }` i no pas (i luk olsem i sot `/>`).

parse-tag-invalid-attributes = DoenetML i no stret: Tag `{ $tag }` i no stret. Ating ol atribiut bilong en i no stret.

parse-close-tag-name-missing = DoenetML i no stret: Painim wanpela tag bilong pasim i no gat nem, olsem `</`

parse-attribute-value-unquoted = Ol valiu bilong atribiut i mas stap insait long ol mak bilong kot: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML i no stret: Painim tag bilong pasim `{ $tag }`, tasol i no gat tag bilong opim i wankain

parse-close-tag-mismatched = DoenetML i no stret: Tag bilong pasim i no wankain. Yumi wet long `</{ $expected }>`. Painim `{ $found }`

parser-node-unconvertible = I no inap senisim node { $node } i go long node Dast.

## Names

name-attribute-invalid =
    Atribiut name='{ $name }' i no stret. { $reason ->
        [characters] Ol nem inap gat ol leta, ol namba, andaskoa o haipen tasol.
       *[start] Ol nem i mas kirap long wanpela leta.
    }

component-name-invalid-start = Nem bilong hap "{ $name }" i no stret. Ol nem i mas kirap long wanpela leta.

## `<answer>` sugar

answer-video-watched-missing-video = Answer i gat type videoWatched i mas gat atribiut video

answer-video-watched-video-not-reference = Atribiut video bilong answer i gat type videoWatched i mas stap wanpela refrens

answer-name-not-single-text = Atribiut name bilong answer i mas gat wanpela pikinini text tasol

## Referencing another document

external-doenetml-recursion-limit = I no inap kisim DoenetML long ausait, long wanem i gat planti tumas lain bilong ripit. Ating i gat wanpela refrens i raunim em yet?

external-doenetml-unavailable = I no inap kisim DoenetML long { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ol i kisim long { $attribute }="{ $uri }" i no stret: em i no wankain wantaim kain hap "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribiut `{ $from }` i no wok moa; yusim `{ $to }`.
       *[other] [deprecation] Atribiut `{ $from }` long `<{ $component }>` i no wok moa; yusim `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribiut `{ $from }` i no wok moa na i no bihainim long wanem ol i makim `{ $to }` tu.
       *[other] [deprecation] Atribiut `{ $from }` long `<{ $component }>` i no wok moa na i no bihainim long wanem ol i makim `{ $to }` tu.
    }

deprecated-attribute-ignored = [deprecation] Atribiut `{ $attribute }` long `<{ $component }>` i no wok moa na i no bihainim.

deprecated-attribute-to-child = [deprecation] Atribiut `{ $attribute }` long `<{ $component }>` i no wok moa; yusim wanpela pikinini `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Valiu `{ $value }` bilong atribiut `{ $attribute }` long `<{ $component }>` i no wok moa; yusim `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` inap mekim planti long tok Inglis tasol, olsem na tok bilong en i no senis insait long dokumen ol i raitim long { $locale }. Raitim stret fom bilong planti, o putim wantaim atribiut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemen `<{ $tag }>` i no wanpela elemen bilong Doenet ol i save long en.

schema-element-not-allowed-at-root = Elemen `<{ $tag }>` i no ken stap long as bilong dokumen.

schema-element-not-allowed-inside = Elemen `<{ $tag }>` i no ken stap insait long `<{ $parent }>`.

schema-attribute-unrecognized = Elemen `<{ $tag }>` i no gat atribiut i gat nem `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribiut `{ $attribute }` bilong elemen `<{ $tag }>` i mas stap wanpela lista we olgeta samting insait em wanpela bilong: { $allowed }
       *[other] Atribiut `{ $attribute }` bilong elemen `<{ $tag }>` i mas stap wanpela bilong: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nem bilong kain i no stret long select.  Nem bilong kain { $variantName } i kamap long { $numOptions } opsen tasol namba bilong makim em { $numToSelect }.

select-variant-name-without-options = Ol i makim sampela kain long select tasol i no gat opsen ol i makim long nem bilong kain: { $variantName }.

select-variant-name-not-possible = Nem bilong kain { $variantName } ol i makim long select i no wanpela nem bilong kain i ken kamap.

select-too-few-options = I no inap makim { $numToSelect } hap long { $numOptions } tasol.

select-from-sequence-too-few-values = I no inap makim { $numToSelect } valiu long wanpela sequence i gat longpela { $length }.

select-from-sequence-indices-count-mismatch = Namba bilong ol indeks ol i makim long select i mas wankain wantaim namba bilong makim

select-from-sequence-indices-not-integers = Olgeta indeks ol i makim long select i mas namba i no gat hap

select-from-sequence-index-excluded = Indeks bilong selectfromsequence ol i makim em ol i rausim

select-from-sequence-indices-excluded-combination = Ol indeks bilong selectfromsequence ol i makim em wanpela bung ol i rausim

select-from-sequence-coprime-not-positive-integers = I no inap makim ol bung coprime long wanem samting ol i makim i no namba i no gat hap na i antap long zero.

select-from-sequence-coprime-common-factor = I no inap makim ol namba coprime. Olgeta valiu i gat wankain faktor. (Valiu bilong "from" o "to" ol i makim i mas coprime wantaim "step".)

select-from-sequence-coprime-single-number = I no inap makim ol bung coprime long wanpela namba tasol i no 1.

select-from-sequence-excluded-too-many-combinations = Ol i rausim moa long 70% bilong ol bung long selectFromSequence

select-from-sequence-coprime-none-found = I no inap makim ol namba coprime. Olgeta valiu i gat wankain faktor.

select-from-sequence-too-few-unique-values = I no inap makim { $numToSelect } valiu i narapela long wanpela sequence i gat longpela { $numPossibleValues }

select-prime-numbers-too-few-values = I no inap makim { $numToSelect } valiu long wanpela lista prima i gat longpela { $numValues }

select-prime-numbers-values-count-mismatch = Namba bilong ol valiu ol i makim long select i mas wankain wantaim namba bilong makim

select-prime-numbers-values-not-prime = Olgeta valiu ol i makim long select prime number i mas stap long lista prima

select-prime-numbers-values-excluded-combination = Ol valiu bilong selectPrimeNumbers ol i makim em wanpela bung ol i rausim

select-prime-numbers-excluded-too-many-combinations = Ol i rausim moa long 70% bilong ol bung long selectPrimeNumbers

select-random-combination-fluke = Long wanpela samting i no save kamap, i no inap makim wanpela bung bilong ol namba i kamap nating

select-random-value-fluke = Long wanpela samting i no save kamap, i no inap makim wanpela namba i kamap nating
