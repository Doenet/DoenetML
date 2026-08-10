# Tiv diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] I vende { $attributes } shighe u i wa upoyint uhar mba ken mkur yô
       *[other] I vende { $attributes } shighe u i wa upoyint uhar mba ken mkur yô
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] I vende { $attributes } shighe u i wa poyint u mkur man u atô cii yô
       *[other] I vende { $attributes } shighe u i wa poyint u mkur man u atô cii yô
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset eren tom ga aluer poyint u atô ngu ga

## `<line>`

line-points-undetermined-dimensions = Layin la kar sha upoyint mba i fa vesen ve ga yô.

line-points-too-few-dimensions = Layin gba u una kar sha upoyint mba vesen ve lu uhar shin a hemba nahan.

line-points-depend-on-variables = Layin la kar sha upoyint mba ve tile sha akaa a a gem yô: { $variables }.

line-equation-invalid-format = Ieren i ikwasion i layin i doo ga ken akaa a a gem { $variable1 } man { $variable2 }.

## `<ray>`

ray-overprescribed-through = I wa rei la a through, endpoint man direction.  Se vende through u i wa la.

ray-dimension-mismatch = numDimensions zough ga ken rei.

## `<vector>`

vector-overprescribed-head = I wa vekto la a head, tail man displacement.  Se vende head u i wa la.

vector-dimension-mismatch = numDimensions zough ga ken vekto.

## Attracting and constraining

attract-to-without-nearest-point = Se fatyô u uran sha `<{ $component }>` ga, sha ci u ngu a ikyav nearestPoint ga.

constrain-to-without-nearest-point = Se fatyô u kôron sha `<{ $component }>` ga, sha ci u ngu a ikyav nearestPoint ga.

constrain-to-interior-without-nearest-point = Se fatyô u kôron ken `<{ $component }>` ga, sha ci u ngu a ikyav nearestPoint ga.

## `<choiceInput>`

choice-input-label-position-ignored = I vende labelPosition sha choiceInput u u lu ken layin ga yô

## Ordering children by index

choice-input-indices-count-mismatch = Se vende indices mba i wa sha choiceInput sha ci u kôr u indices zough a kôr u ônov mba choice ga.

pretzel-indices-count-mismatch = Se vende indices mba i wa sha problem sha ci u kôr u indices zough a kôr u ônov mba problem ga.

shuffle-indices-count-mismatch = Se vende indices mba i wa sha shuffle sha ci u kôr u indices zough a kôr u akyar ga.

indices-ignored-out-of-range = Se vende indices mba i wa sha { $component } sha ci u agen due ken ijiir la.

pretzel-indices-repeated = Se vende indices mba i wa sha pretzel sha ci u i hide a agen kwa uhar.

pretzel-circuit-first-index = Se vende indices mba i wa sha pretzel ken mode="circuit" sha ci u u hiihii la gba u una lu 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Sha er `<{ $component }>` una er tom a ônov mba akaa yô, gba u i wa ikyav `type`.

invalid-type-defaulting-to-math = Ieren { $type } doo sha { $component } ga. Gba u i lu math, text, number shin boolean. Se hide sha math.

string-not-valid-component-to-arrange = Kwaghôron "{ $value }" ka ikyar i dedoo sha { $component } ga. Se vende un.

## Types and variables

invalid-type-defaulting-to-number = Ieren { $type } doo ga, se wa ieren la sha number.

invalid-variable-value = Aeren a kwagh u a gem la doo ga: `{ $value }`

## Variants

variant-index-must-be-number = Ikyav i ieren { $index } gba u i lu kôr

variant-index-must-be-integer = Ikyav i ieren { $index } gba u i lu kôr u u kuma

## `<sideBySide>`

side-by-side-absolute-widths = I er `<{ $component }>` a mbamkaren mba ve gem ga la ga. Se wa vesen la sha mkaren.

side-by-side-absolute-margins = I er `<{ $component }>` a mbamkaren mba ve gem ga la ga. Se wa mkur la sha mkaren.

side-by-side-no-block-child = `<{ $component }>` doo ga: gba u una lu a wan u ikyar môm tseegh.

## `<label>`

label-for-ignored-on-graphical = I vende ikyav `for` sha ikyav `<label>`.

label-for-must-resolve-to-one = Ikyav `for` sha `<label>` gba u una tese ikyar i môm tseegh.

label-for-unresolved = Ikyav `for` sha `<label>` fatyô u teseen ikyar ga.

label-for-answer-with-authored-inputs = Ikyav `for` sha `<label>` tese `<answer>` u u lu a mnyor mba orngeren nger ve la; tese mnyor la iyol na.

label-for-answer-without-input = Ikyav `for` sha `<label>` tese `<answer>` u u lu a mnyor u i na un iti ga yô.

label-for-must-reference-input-or-answer = Ikyav `for` sha `<label>` gba u una tese mnyor shin mlumun.

## Accessibility

accessibility-short-description-or-decorative = Sha ci u mzough, `<{ $component }>` gba u una lu a mpase u kiryan shin i wa un er kwagh u doon ashe nahan.

accessibility-video-short-description = Sha ci u mzough, `<video>` gba u una lu a mpase u kiryan.

accessibility-input-short-description-or-label = Sha ci u mzough, `<{ $component }>` gba u una lu a mpase u kiryan shin iti.

accessibility-answer-input-short-description-or-label = Sha ci u mzough, `<answer>` u u eren mnyor la gba u una lu a mpase u kiryan shin iti.

accessibility-short-description-contains-math = Mpase mba kiryan gba u vea lu a akyar a mbamsen er `<{ $component }>` nahan ga. Nger mbamsen cii a akaaôron.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ngu a mkposo u u kuma sha akaaôron a ityough i ikyar ga (ken ime) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i gba { $threshold }:1 shin a hemba).
       *[other] { $colorName } ngu a mkposo u u kuma sha akaaôron a ityough i ikyar ga ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i gba { $threshold }:1 shin a hemba).
    }

## `<circle>`

circle-through-points-non-numerical = Se er `<circle>` u u kar sha upoyint { $count } la ga zum u upoyint mba a akôr ga yô.

circle-too-many-through-points = Se fatyô u ôron sekul u u kar sha upoyint mba ve hemba 3 ga.

circle-overprescribed-radius-center-points = Se fatyô u ôron sekul u u lu a rediyus, ijiir i atô man upoyint cii ga.

circle-center-with-multiple-points = Se fatyô u ôron sekul u u lu a ijiir i atô u u kar sha poyint u u hemba 1 ga.

circle-radius-too-small = Se fatyô u ôron sekul la ga: er ijiir i hen atô u upoyint uhar la lu { $distance } yô, rediyus { $radius } u i wa la kiryan tsung.

circle-radius-with-many-points = Se fatyô u eren sekul u u kar sha upoyint mba ve hemba uhar a rediyus u i wa la ga.

circle-invalid-center-or-through-points = Ijiir i atô i sekul shin upoyint mba u doo ga.

circle-radius-center-with-multiple-points = Se fatyô u ôron rediyus u sekul u u lu a ijiir i atô u u kar sha poyint u u hemba 1 ga.

circle-change-radius-non-numerical = Se fatyô u geman rediyus u sekul u u lu a upoyint mba ve lu a akôr ga yô ga

circle-radius-with-points-non-numerical = Se fatyô u eren sekul u u kar sha poyint u u hemba môm a rediyus u i wa la zum u akôr nga ga yô ga.

circle-change-center-non-numerical = Se er mgem u ijiir i atô i sekul u u kar sha upoyint mba ve lu a akôr ga la ga.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Vesen kuma ijiir i fungshon ga. Ijiir ngu a ikyar { $intervals } kpa fungshon ngu a { $inputs ->
            [one] mnyor { $inputs }
           *[other] mnyor { $inputs }
        }.
       *[other] Vesen kuma ijiir i fungshon ga. Ijiir ngu a akyar { $intervals } kpa fungshon ngu a { $inputs ->
            [one] mnyor { $inputs }
           *[other] mnyor { $inputs }
        }.
    }

function-domain-invalid-format = Ieren i ijiir i fungshon doo ga.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Se vende u sha tswen u fungshon u u lu a kôr ga.
        [minimum] Se vende u sha inya u fungshon u u lu a kôr ga.
        [extremum] Se vende mkur u fungshon u u lu a kôr ga.
        [point] Se vende poyint u fungshon u u lu a kôr ga.
        [slope] Se vende mgbenden u fungshon u u lu a kôr ga.
       *[other] Se vende { $type } u fungshon u u lu a kôr ga.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Se vende u sha tswen u fungshon u u lu gbilin.
        [minimum] Se vende u sha inya u fungshon u u lu gbilin.
        [extremum] Se vende mkur u fungshon u u lu gbilin.
        [point] Se vende poyint u fungshon u u lu gbilin.
       *[other] Se vende { $type } u fungshon u u lu gbilin.
    }

function-points-too-close = Fungshon ngu a upoyint uhar mba ve kporom a ayol a ve tsung. Se fatyô u wan fungshon ga.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Mhidi u fungshon una fatyô saa er kôr u mnyor zough a kôr u mdugh yô. Fungshon ne ngu a mnyor { $inputs } man { $outputs ->
            [one] mdugh { $outputs }
           *[other] mdugh { $outputs }
        }.
       *[other] Mhidi u fungshon una fatyô saa er kôr u mnyor zough a kôr u mdugh yô. Fungshon ne ngu a mnyor { $inputs } man { $outputs ->
            [one] mdugh { $outputs }
           *[other] mdugh { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Gbedu u mkuraiyol doo ga.  Gba u una lu kôr u u kuma u u lu inya i zero ga.

sequence-invalid-step = Mnyam u mkuraiyol doo ga.  Gba u una lu kôr sha mkuraiyol u ieren na i lu { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" u mkuraiyol u akôr doo ga.  Gba u una lu kôr.

sequence-invalid-endpoint-letters = "{ $attribute }" u mkuraiyol u ityenge doo ga.  Gba u una lu mkohol u ityenge.

sequence-invalid-endpoint = "{ $attribute }" u mkuraiyol doo ga.

select-from-sequence-coprime-not-numbers = I vende coprime sha ci u i tsua akôr ga

select-from-sequence-coprime-with-exclude-combinations = I vende coprime sha ci u i wa excludeCombinations

## Resolving a `target`

target-not-found = target doo ga sha `<{ $source }>`: se zua a target ga.

target-state-variable-not-found = target doo ga sha `<{ $source }>`: se zua a ikyav i i yila i ér "{ $property }" sha `<{ $component }>` ga.

## `<odeSystem>`

ode-system-variables-match-independent = Akaa a a gem a `<odeSystem>` gba u vea kposo a kwagh u a gem u u tile sha iyol na la.

ode-system-duplicate-variable-names = Se fatyô u wan ufungshon mba ODE RHS mba ve lu a ati a akaa a a gem a i hide a mi kwa uhar ga.

ode-system-rhs-function-error = Se fatyô u wan fungshon u ODE RHS ga.  Mtev ken meren u fungshon u mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Se fatyô u wan konga hen atô u ulayin { $count } ga

angle-invalid-through-point = Poyint u u doo ga ken through u `<angle>`

parabola-vertex-too-many-points = Se er parabola u u lu a konga u u kar sha poyint u u hemba 1 la ga.

parabola-too-many-points = Se er parabola u u kar sha upoyint mba ve hemba 3 la ga.

intersection-too-many-items = Se er mzough sha akaa a a hemba ahar la ga

## Other math components

ionic-compound-not-two-ions = Se er mkohol u ayon sha kwagh u u lu ayon ahar ga la ga.

ionic-compound-needs-cation-and-anion = I er mkohol u ayon sha katiyon môm man aniyon môm tseegh.

solve-equations-cannot-evaluate = Se fatyô u sôron ikwasion la ga sha ci u se fatyô u ôron un ga: { $equation }

math-operators-operand-number-required = Gba u u wa operandNumber zum u ú dugh operand u mbamsen yô.

eigen-decomposition-failed = Se fatyô u ôron eigenvalues mba matriks ga

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameta { $parameters } ngu ken pattern ga, nahan una zough a gbilin hanma shighe.
       *[other] `<matchesPattern>`: uparameta { $parameters } mba ken pattern ga, nahan vea zough a gbilin hanma shighe.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: se fatyô u kaven grid="{ $grid }" ga. Gba u una lu none, medium, dense, shin akôr ahar a dedoo a i kposo a a ijiir, er grid="1 0.5" nahan. I er ma grid ga.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: i lumun a xLabelPosition="left" ken ortesen prefigure ga; se eren tom er sha ityô i uyanya nahan.

prefigure-y-label-position-unsupported = `<graph>`: i lumun a yLabelPosition="bottom" ken ortesen prefigure ga; se eren tom er sha tswen nahan.

prefigure-invalid-axis-bounds = `<graph>`: mkur u aksis doo ga sha mgem u prefigure; se eren tom a bbox u u lu tsee (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: vesen doo ga sha mgem u prefigure; se eren tom a vesen u ikyav u u lu tsee 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio doo ga sha mgem u prefigure; se eren tom a mkaren u u lu tsee 1.

prefigure-grid-spacing-too-fine = `<graph>`: ijiir i hen atô u grid kiryan tsung sha mkur u aksis; i er grid ken ortesen prefigure ga.

prefigure-annotations-not-rendered = `<graph>`: i er mbampase ga aluer ortesen PreFigure ngu eren tom ga.

multiple-annotations-children = Se zua a ônov mba `<annotations>` kpishi ken `<graph>`; i vende cii saa u masetyô la.

## Referring to other components

copy-unrecognized-component-type = Se fatyô u seeren shin kopin ieren i ikyar i i fa i ga: { $type }.

copy-prop-not-found = Se zua a prop { $property } sha ikyar i ieren na i lu { $component } ga

collect-no-source = Se zua a imbor i collect ga.

collect-invalid-component-type = Se fatyô u kohol akyar a ieren a a lu `<{ $component }>` ga sha ci u ka ieren i i doo ga.

reference-index-unavailable = Se fatyô u teseen ikyav `{ $reference }` ga

## `<callAction>`

component-action-unavailable = Se fatyô u yôôn { $action } sha ikyar `{ $reference }` ga

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Ieren i akaaôron doo ga.  Ulayin mba a agbedu a a zough a ayol a ga. Se zua a mi ken componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Akaaôron ngu a ati a ukolum a i hide a mi kwa uhar.  Se zua a mi ken componentIdx :{ $componentIdx }

data-frame-missing-column-name = Iti i kolum ngu ken akaaôron ga.  Se zua a mi ken componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Upoyint mba mlumun ne tile sha mlumun u tagi la iyol na tindi la, man kwagh la una va a kwagh u i vande fan un ga.

answer-max-num-attempts-in-section-wide-check-work = U wan `maxNumAttempts` sha `<answer>` u u lu ken ikyar i i lu a `sectionWideCheckWork` la eren ma kwagh ga, sha ci u ka ikyar la i kuran kôr u amtsen ye. Wa `maxNumAttempts` sha ikyar la.

nested-section-wide-check-work-max-num-attempts = U wan `maxNumAttempts` sha ikyar i i lu a `sectionWideCheckWork` i i lu ken ikyar igen i i lu a `sectionWideCheckWork` la eren ma kwagh ga, sha ci u ka ikyar i won la i kuran kôr u amtsen ye. Wa `maxNumAttempts` sha ikyar i won la.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Ikyav { $attributes } ia er ma kwagh ga aluer i wa symbolicEquality ga.
       *[other] Akyav { $attributes } aa er ma kwagh ga aluer i wa symbolicEquality ga.
    }

answer-invalid-type = Ieren i mlumun i i doo ga: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Er ikyar `<{ $component }>` i lu a iti ga yô, i fatyô u eren tom a mi er ikyav i module nahan ga

module-attribute-name-already-defined = Ikyar `<{ $component } name="{ $name }">` i fatyô u eren tom a mi er ikyav i module nahan ga sha ci u ieren `<module>` ngu a ikyav "{ $name }" hegen.

conditional-content-condition-ignored = I vende ikyav `condition` sha `<conditionalContent>` u u lu a ônov mba case shin else.

slider-markers-type-mismatch = Ieren i akyav zough a ieren i slider ga.

pretzel-problem-needs-statement-and-answer = pretzel doo ga: hanma `<problem>` gba u una lu a `<statement>` môm man `<answer>` môm.

pretzel-circuit-first-problem-distractor = pretzel doo ga: ken mode="circuit", `<problem>` u hiihii la una lu distractor ga.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Aeren a a doo ga { $values } sha ikyav `{ $attribute }`; se vende un.
       *[other] Aeren a a doo ga { $values } sha ikyav `{ $attribute }`; se vende a.
    }

attribute-must-be-references = Aeren `{ $value }` doo ga sha ikyav `{ $attribute }`. Gba u i er ikyav la a mbamtesen mba ve hii a `$`.

math-input-invalid-function-names = <mathInput>: se vende ati a fungshon a a doo ga ken { $attribute }: { $names }. Ikyar i mtesen i hanma iti gba u i lu a ityenge 2 shin a hemba (ityenge shin ubaajir); u fatyô u seer `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Ieren i ikyar i i doo ga: `<{ $componentType }>`

attribute-repeated = Se fatyô u hiden a ikyav { $attribute } kwa uhar ga.

attribute-invalid-for-component = Ikyav "{ $attribute }" doo sha ikyar i ieren na i lu `<{ $componentType }>` ga.

## Style definition contrast

style-definition-insufficient-contrast =
    Mpase u ieren { $styleNumber } ngu a mkposo u u kuma sha { $context ->
        [text-on-background] ini i akaaôron sha ini i ijime
        [high-contrast] ini i mkposo u vesen sha ikyav
        [line] ini i layin sha ikyav
        [marker] ini i ikyav sha ikyav
       *[text-on-canvas] ini i akaaôron sha ikyav
    } ga{ $mode ->
        [dark] { " (ken ime)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i gba { $threshold }:1 shin a hemba).

style-definition-dark-mode-text-background-contrast =
    Shin er mpase u ieren { $styleNumber } ngu a ini mba ve ne mkposo u u kuma ken iwanger nahan kpa, ini mba ken ime mba ve due ken a la mba a mkposo u u kuma hen atô u ini i akaaôron man ini i ijime ga ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i gba { $threshold }:1 shin a hemba). { $suggestion ->
        [available] Sha er mkposo la ua kuma ken ime yô, seer mkposo u iwanger (ikyav, wa { $lightAttribute }="{ $lightColor }") shin gema ini i ken ime la (ikyav, wa { $darkAttribute }="{ $darkColor }").
       *[none] Sha er mkposo la ua kuma ken ime yô, seer mkposo u iwanger shin gema ini mba ve due ken a la a textColorDarkMode shin backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Shin er mpase u ieren { $styleNumber } ngu a ini i akaaôron i i ne mkposo u u kuma ken iwanger nahan kpa, ini i akaaôron i ken ime i i due ken i la ngu a mkposo u u kuma sha ikyav ga ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i gba { $threshold }:1 shin a hemba). { $suggestion ->
        [available] Sha er mkposo la ua kuma ken ime yô, seer mkposo u iwanger (ikyav, wa textColor="{ $lightColor }") shin gema ini i ken ime la (ikyav, wa textColorDarkMode="{ $darkColor }").
       *[none] Sha er mkposo la ua kuma ken ime yô, seer mkposo u iwanger shin gema ini i i due ken i la a textColorDarkMode.
    }

section-multiple-style-palettes = Ikyar ia fatyô u tsuan <stylePalette> môm tseegh; se eren tom a u masetyô la.

## Unique variants

variant-num-to-select-not-non-negative-integer = se fatyô u fan aeren a { $component } a a hide a mi ga la ga sha ci u numToSelect ngu kôr u u kuma u u lu inya i zero ga la ga.

variant-num-to-select-not-constant-number = se fatyô u fan aeren a { $component } a a hide a mi ga la ga sha ci u numToSelect ngu kôr u u gem ga la ga.

variant-with-replacement-not-constant-boolean = se fatyô u fan aeren a { $component } a a hide a mi ga la ga sha ci u withReplacement ngu boolean u u gem ga la ga.

variant-select-weight-disables-unique = I kôr aeren a select a a hide a mi ga la aluer mtsuan ngu a selectWeight shin selectForVariants

variant-coprime-undetermined = se fatyô u fan aeren a { $component } a a hide a mi ga la ga sha ci u se fatyô u fan ér coprime ngu false hanma shighe ga.

variant-attribute-not-constant = se fatyô u fan aeren a { $component } a a hide a mi ga la ga sha ci u { $attribute } ngu geman.

variant-attribute-not-number = se fatyô u fan aeren a { $component } a a hide a mi ga la ga sha ci u { $attribute } ngu kôr ga.

variant-attribute-wrong-type-for-sequence =
    se fatyô u fan aeren a { $component } u ieren na i lu { $type } a a hide a mi ga la ga sha ci u { $attribute } ngu { $expected ->
        [letters-combination] mkohol u ityenge
        [math-expression] mkaanem ma mbamsen ma i lumun a mi
        [integer] kôr u u kuma
       *[number] kôr
    } ga.

variant-length-not-integer = se fatyô u fan aeren a { $component } a a hide a mi ga la ga sha ci u length ngu kôr u u kuma ga.

variant-sort-not-implemented = se er aeren a { $component } u u lu a sort a a hide a mi ga la ga

variant-exclude-combinations-not-implemented = se er aeren a { $component } u u lu a excludeCombinations a a hide a mi ga la ga

variant-math-exclude-not-implemented = se er aeren a { $component } u ieren na i lu math u u lu a exclude a a hide a mi ga la ga

variant-non-constant-exclude-not-implemented = se er aeren a { $component } u u lu a exclude u u gem a a hide a mi ga la ga

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: i lumun a mi ken ortesen prefigure u graph ga; i vende wan u due ken a mi la.

prefigure-descendant-invalid-geometry = { $subject }: ieren i ijiir ngu a mkur ga shin i kuma ga; i vende wan u due ken a mi la.

prefigure-curve-label-omitted = { $subject }: i lumun a ati sha ulayin mba gbenden mba i gem ve la ga; i dugh iti la.

prefigure-curve-unsupported-definition-type = { $subject }: ieren i mpase u layin u gbenden '{ $definitionType }' i lumun a mi ga; i vende wan u due ken a mi la.

prefigure-region-flip-functions-unsupported = { $subject }: i lumun a ikyav flipFunctions sha regionBetweenCurves ga; i vende wan u due ken a mi la.

prefigure-region-non-formula-child = { $subject }: ka ufungshon mba ônov mba ieren ve i lu formula tseegh i lumun a ve sha regionBetweenCurves; i vende wan u due ken a mi la.

prefigure-label-position-unsupported =
    { $subject }: i lumun a labelPosition '{ $labelPosition }' sha { $labelKind ->
        [line-family] iti i tsombor u ulayin
       *[point] iti i poyint
    } ga; se eren tom a mzough u PreFigure u u lu tsee.

prefigure-fill-style-unsupported = { $subject }: ieren i mngu '{ $fillStyle }' i lumun a mi ken PreFigure ga; se hide sha mngu u taver.

prefigure-line-style-unknown = { $subject }: ieren i layin i i fa i ga '{ $lineStyle }' i dugh un ken mdugh u PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: i gema ieren i ikyav '{ $markerStyle }' i hingir ieren i PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: ieren i ikyav '{ $markerStyle }' i lumun a mi ken PreFigure ga; se eren tom a ieren i i lu tsee.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` doo ga; se zua a kwagh u a tese la ga. I dugh mpase la.

annotation-ref-multiple-targets = `<annotation>`: `ref` tese akaa kpishi; se eren tom a u hiihii la.

annotation-ref-outside-graph = `<annotation>`: `ref` doo ga; kwagh u a tese la ngu ken won u graph la. I dugh mpase la.

annotation-ref-unsupported-target = `<annotation>`: `ref` doo ga; kwagh u a tese la ngu ikyav i i lumun a mi ken mgem u prefigure ga. I dugh mpase la.

annotation-text-missing = `<annotation>`: `text` ngu ga shin ngu gbilin; se dugh akaaôron gbilin.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Se nenge mtile u u kondo iyol na.
       *[other] Se nenge mtile u u kondo iyol na u u lu a ikyar `<{ $componentType }>`.
    }

reference-no-referent = Se zua a ma kwagh sha mtesen ga: `{ $reference }`

reference-multiple-referents = Se zua a akaa kpishi sha mtesen: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ieren i ikyav { $attribute } i `<{ $componentType }>` doo ga.

children-invalid = Ônov mba `<{ $componentType }>` doo ga: Se nenge ônov mba ve doo ga: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Aeren `{ $value }` doo ga sha ikyav `{ $attribute }`, se eren tom a aeren `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Se zua a DoenetML ieren { $version } ga.
       *[other] Se zua a DoenetML ieren { $version } ga. Se hide sha ieren { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML u u doo ga: { $content }

parse-tag-missing-close-tag = DoenetML u u doo ga: Tagi `{ $tag }` ngu a tagi u kuran ga. Se lu keghen tagi u u kure iyol na shin tagi `</{ $tagName }>`.

parse-tag-error = DoenetML u u doo ga: Mtev ken tagi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML u u doo ga: Ikyav `{ $attribute }` i i doo ga la nenge er ngu a aeren ga nahan.

parse-attribute-invalid = DoenetML u u doo ga: Ikyav `{ $attribute }` doo ga

parse-attribute-value-invalid = DoenetML u u doo ga: Aeren a ikyav `{ $value }` doo ga

parse-attribute-value-quote-mismatch = DoenetML u u doo ga: Aeren a ikyav `{ $value }` doo ga. Akyav a akaaôron zough a ayol a ga. I nenge er `{ $quote }` ngu a we ga nahan

parse-open-tag-name-missing = DoenetML u u doo ga: Se nenge tagi u u lu a iti ga, er `<` nahan

parse-tag-not-closed = DoenetML u u doo ga: I kure tagi `{ $tag }` ga (i nenge er `>` ngu ga nahan).

parse-self-closing-tag-name-missing = DoenetML u u doo ga: Se nenge tagi u u lu a iti ga `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML u u doo ga: I kure tagi `{ $tag }` ga (i nenge er `/>` ngu ga nahan).

parse-tag-invalid-attributes = DoenetML u u doo ga: Tagi `{ $tag }` doo ga. Alaghga ngu a akyav a a doo ga.

parse-close-tag-name-missing = DoenetML u u doo ga: Se nenge tagi u kuran u u lu a iti ga, er `</` nahan

parse-attribute-value-unquoted = Gba u i wa aeren a akyav ken akyav a akaaôron: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML u u doo ga: Se nenge tagi u kuran `{ $tag }`, kpa tagi u bughun u u zough a mi ngu ga

parse-close-tag-mismatched = DoenetML u u doo ga: Tagi u kuran zough ga. Se lu keghen `</{ $expected }>`. Se nenge `{ $found }`

parser-node-unconvertible = Se fatyô u geman node { $node } i hingir node u Dast ga.

## Names

name-attribute-invalid =
    Iti name='{ $name }' doo ga. { $reason ->
        [characters] Ati aa fatyô u lun a ityenge, akôr, ubaajir mba inya shin ubaajir tseegh.
       *[start] Gba u ati aa hii a ityenge.
    }

component-name-invalid-start = Iti i ikyar "{ $name }" doo ga. Gba u ati aa hii a ityenge.

## `<answer>` sugar

answer-video-watched-missing-video = Mlumun u ieren na i lu videoWatched gba u una lu a ikyav video

answer-video-watched-video-not-reference = Mlumun u ieren na i lu videoWatched gba u una lu a ikyav video i i lu mtesen

answer-name-not-single-text = Ikyav name i mlumun gba u i lu a wan u akaaôron môm tseegh

## Referencing another document

external-doenetml-recursion-limit = Se fatyô u zuan a DoenetML u won la ga sha ci u mhidi hemba kpishi. Alaghga mtesen ugen ngu kondon iyol na?

external-doenetml-unavailable = Se fatyô u zuan a DoenetML sha { $attribute }="{ $uri }" ga

external-doenetml-type-mismatch = DoenetML u i zua a mi sha { $attribute }="{ $uri }" la doo ga: i zough a ieren i ikyar "{ $componentType }" ga

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] I kera eren tom a ikyav `{ $from }` ga; er tom a `{ $to }`.
       *[other] [deprecation] I kera eren tom a ikyav `{ $from }` sha `<{ $component }>` ga; er tom a `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] I kera eren tom a ikyav `{ $from }` ga shi i vende un sha ci u i wa `{ $to }` kpaa.
       *[other] [deprecation] I kera eren tom a ikyav `{ $from }` sha `<{ $component }>` ga shi i vende un sha ci u i wa `{ $to }` kpaa.
    }

deprecated-attribute-ignored = [deprecation] I kera eren tom a ikyav `{ $attribute }` sha `<{ $component }>` ga shi i vende un.

deprecated-attribute-to-child = [deprecation] I kera eren tom a ikyav `{ $attribute }` sha `<{ $component }>` ga; er tom a wan `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] I kera eren tom a aeren `{ $value }` a ikyav `{ $attribute }` sha `<{ $component }>` ga; er tom a `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` ua fatyô u eren mkpeyol ken zwa Buter tseegh, nahan akaaôron a nan aa lu er orngeren nger a nahan ken takerada i i nger ken { $locale } la. Nger mkpeyol la iyol ou, shin wa un a ikyav `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ikyar `<{ $tag }>` ka ikyar i Doenet i i fa i ga.

schema-element-not-allowed-at-root = I lumun a ikyar `<{ $tag }>` sha imbor i takerada ga.

schema-element-not-allowed-inside = I lumun a ikyar `<{ $tag }>` ken `<{ $parent }>` ga.

schema-attribute-unrecognized = Ikyar `<{ $tag }>` ngu a ikyav i i yila i ér `{ $attribute }` ga.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ikyav `{ $attribute }` i ikyar `<{ $tag }>` gba u i lu mkuraiyol u hanma kwagh ken u a lu môm ken mba: { $allowed }
       *[other] Ikyav `{ $attribute }` i ikyar `<{ $tag }>` gba u i lu môm ken mba: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Iti i ieren doo ga sha select.  Iti i ieren { $variantName } ngu ken mbamtsuan { $numOptions } kpa kôr u mtsuan lu { $numToSelect }.

select-variant-name-without-options = I wa aeren agen sha select kpa i wa mtsuan sha iti i ieren i i fatyô u lun la ga: { $variantName }.

select-variant-name-not-possible = Iti i ieren { $variantName } i i wa sha select la ka iti i ieren i i fatyô u lun ga.

select-too-few-options = Se fatyô u tsuan akyar { $numToSelect } ken akyar { $numOptions } tseegh ga.

select-from-sequence-too-few-values = Se fatyô u tsuan aeren { $numToSelect } ken mkuraiyol u gbedu na lu { $length } ga.

select-from-sequence-indices-count-mismatch = Kôr u indices mba i wa sha select gba u una zough a kôr u mtsuan

select-from-sequence-indices-not-integers = Indices cii mba i wa sha select gba u vea lu akôr a a kuma

select-from-sequence-index-excluded = Ikyav i i wa sha selectfromsequence la lu i i dugh un

select-from-sequence-indices-excluded-combination = Indices mba i wa sha selectfromsequence la lu mkohol u i dugh un

select-from-sequence-coprime-not-positive-integers = Se fatyô u tsuan mkohol u coprime ga sha ci u i tsua akôr a dedoo a a kuma ga.

select-from-sequence-coprime-common-factor = Se fatyô u tsuan akôr a coprime ga. Aeren cii a a fatyô u lun la nga a fakta môm. (Aeren a i wa a "from" shin "to" gba u aa lu coprime a "step".)

select-from-sequence-coprime-single-number = Se fatyô u tsuan mkohol u coprime ken kôr môm u u lu 1 ga la ga.

select-from-sequence-excluded-too-many-combinations = I dugh mkohol u u hemba 70% ken selectFromSequence

select-from-sequence-coprime-none-found = Se fatyô u tsuan akôr a coprime ga. Aeren cii a a fatyô u lun la nga a fakta môm.

select-from-sequence-too-few-unique-values = Se fatyô u tsuan aeren { $numToSelect } mba ve hide a mi ga ken mkuraiyol u gbedu na lu { $numPossibleValues } ga

select-prime-numbers-too-few-values = Se fatyô u tsuan aeren { $numToSelect } ken mkuraiyol u akôr a prime u gbedu na lu { $numValues } ga

select-prime-numbers-values-count-mismatch = Kôr u aeren a i wa sha select gba u una zough a kôr u mtsuan

select-prime-numbers-values-not-prime = Aeren cii a i wa sha select prime number gba u aa lu ken mkuraiyol u akôr a prime

select-prime-numbers-values-excluded-combination = Aeren a i wa sha selectPrimeNumbers la lu mkohol u i dugh un

select-prime-numbers-excluded-too-many-combinations = I dugh mkohol u u hemba 70% ken selectPrimeNumbers

select-random-combination-fluke = Sha kwagh u u fatyô u eren ga tsung yô, se fatyô u tsuan mkohol u aeren a gbilin ga

select-random-value-fluke = Sha kwagh u u fatyô u eren ga tsung yô, se fatyô u tsuan aeren a gbilin ga
