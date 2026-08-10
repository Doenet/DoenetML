# Fula diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] { $attributes } ina yaltinee si toɓɓe ɗiɗi cakkitiiɗe kaɓɓaama
       *[other] { $attributes } ina njaltinee si toɓɓe ɗiɗi cakkitiiɗe kaɓɓaama
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ina yaltinee si toɓɓere cakkitiinde e toɓɓere hakkunde fof kaɓɓaama
       *[other] { $attributes } ina njaltinee si toɓɓere cakkitiinde e toɓɓere hakkunde fof kaɓɓaama
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset alaa nafoore si toɓɓere hakkunde alaa

## `<line>`

line-points-undetermined-dimensions = Diidol rewoowol e toɓɓe njaajeendi mum anndaaka.

line-points-too-few-dimensions = Diidol ina foti rewde e toɓɓe njaajeendi ɗiɗi walla ɓuri.

line-points-depend-on-variables = Diidol ina rewa e toɓɓe tiiɗtinooje e waylotooɗe: { $variables }.

line-equation-invalid-format = Mbaydi ekwaasiyoŋ diidol moƴƴaani e waylotooɗe { $variable1 } e { $variable2 }.

## `<ray>`

ray-overprescribed-through = Leyol kaɓɓaama e through, endpoint e direction.  Through kaɓɓaango ina yaltinee.

ray-dimension-mismatch = numDimensions fotaani e leyol.

## `<vector>`

vector-overprescribed-head = Wektoor kaɓɓaama e head, tail e displacement.  Head kaɓɓaango ina yaltinee.

vector-dimension-mismatch = numDimensions fotaani e wektoor.

## Attracting and constraining

attract-to-without-nearest-point = Horiima foolde e `<{ $component }>` sabu alaa waylotooɗo ngonka nearestPoint.

constrain-to-without-nearest-point = Horiima haɗde e `<{ $component }>` sabu alaa waylotooɗo ngonka nearestPoint.

constrain-to-interior-without-nearest-point = Horiima haɗde nder `<{ $component }>` sabu alaa waylotooɗo ngonka nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ina yaltinee e choiceInput mo wonaa inline

## Ordering children by index

choice-input-indices-count-mismatch = Limce kaɓɓaaɗe e choiceInput ina njaltinee sabu limoore limce fotaani e limoore ɓiɓɓe cuɓoowe.

pretzel-indices-count-mismatch = Limce kaɓɓaaɗe e problem ina njaltinee sabu limoore limce fotaani e limoore ɓiɓɓe problem.

shuffle-indices-count-mismatch = Limce kaɓɓaaɗe e shuffle ina njaltinee sabu limoore limce fotaani e limoore geɗe.

indices-ignored-out-of-range = Limce kaɓɓaaɗe e { $component } ina njaltinee sabu goɗɗe ina caggal keerol.

pretzel-indices-repeated = Limce kaɓɓaaɗe e pretzel ina njaltinee sabu goɗɗe ndeeɗtaama.

pretzel-circuit-first-index = Limce kaɓɓaaɗe e pretzel e mode circuit ina njaltinee sabu limre adannde ina foti wonde 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ngam `<{ $component }>` gollira e ɓiɓɓe kelme, sifa `type` ina foti kaɓɓeede.

invalid-type-defaulting-to-math = Sifaa { $type } moƴƴaani e geɗal { $component }. Ina foti wonde gooto e math, text, number walla boolean. math ina waɗee wano ko woowaa.

string-not-valid-component-to-arrange = Konngol "{ $value }" wonaa geɗal jaɓaangal e { $component }. Ina yaltinee.

## Types and variables

invalid-type-defaulting-to-number = Sifaa { $type } moƴƴaani, sifaa waɗaama number.

invalid-variable-value = Keewal waylotooɗo moƴƴaani: `{ $value }`

## Variants

variant-index-must-be-number = Limre sifaa { $index } ina foti wonde limoore

variant-index-must-be-integer = Limre sifaa { $index } ina foti wonde limoore timmunde

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` waɗanaaka betirɗe timmuɗe. Njaajeendi waɗaama ndi ƴeeworaandi.

side-by-side-absolute-margins = `<{ $component }>` waɗanaaka betirɗe timmuɗe. Keeri kaɗaama ɗi ƴeeworaaɗi.

side-by-side-no-block-child = `<{ $component }>` moƴƴaani: ina foti jogaade ɓiɗɗo gooto bloku walla ɓuri.

## `<label>`

label-for-ignored-on-graphical = Sifa `for` e `<label>` natal ina yaltinee.

label-for-must-resolve-to-one = Sifa `for` e `<label>` ina foti hollude geɗal gootal tan.

label-for-unresolved = Sifa `for` e `<label>` horiima hollude geɗal.

label-for-answer-with-authored-inputs = Sifa `for` e `<label>` ina hollira `<answer>` jogiiɗo naatnugol ngol binndoowo winndi; hollu naatnugol tigi.

label-for-answer-without-input = Sifa `for` e `<label>` ina hollira `<answer>` mo alaa naatnugol keɓoowo innde.

label-for-must-reference-input-or-answer = Sifa `for` e `<label>` ina foti hollude naatnugol walla jaabawol.

## Accessibility

accessibility-short-description-or-decorative = Ngam yettagol, `<{ $component }>` ina foti jogaade firo raɓɓiɗngo walla kaɓɓeede wano decorative.

accessibility-video-short-description = Ngam yettagol, `<video>` ina foti jogaade firo raɓɓiɗngo.

accessibility-input-short-description-or-label = Ngam yettagol, `<{ $component }>` ina foti jogaade firo raɓɓiɗngo walla innde.

accessibility-answer-input-short-description-or-label = Ngam yettagol, `<answer>` sosoowo naatnugol ina foti jogaade firo raɓɓiɗngo walla innde.

accessibility-short-description-contains-math = Piiji raɓɓiɗɗi kaa foti jogaade geɗe limtorɗe wano `<{ $component }>`. Winndu limtorɗe e kelme.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } alaa seerndugol fotoowol e ɗeri tiitoonde geɗal (laawol ɓaleewol) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ina naamnii { $threshold }:1 walla ɓuri).
       *[other] { $colorName } alaa seerndugol fotoowol e ɗeri tiitoonde geɗal ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ina naamnii { $threshold }:1 walla ɓuri).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` rewoowo e toɓɓe { $count } waɗaaka to toɓɓe njogaaki keeweeje limoore.

circle-too-many-through-points = Horiima limtude sirkul rewoowo e toɓɓe ɓurɗe tati.

circle-overprescribed-radius-center-points = Horiima limtude sirkul e rayoŋ, hakkunde e toɓɓe kaɓɓaaɗe.

circle-center-with-multiple-points = Horiima limtude sirkul e hakkunde kaɓɓaango rewoowo e toɓɓere ɓurnde wootere.

circle-radius-too-small = Horiima limtude sirkul: sabu goɗɗeendi hakkunde toɓɓe ɗiɗi ko { $distance }, rayoŋ { $radius } kaɓɓaango ina famɗi sanne.

circle-radius-with-many-points = Horiima sosde sirkul rewoowo e toɓɓe ɓurɗe ɗiɗi e rayoŋ kaɓɓaango.

circle-invalid-center-or-through-points = Hakkunde walla toɓɓe sirkul moƴƴaani.

circle-radius-center-with-multiple-points = Horiima limtude rayoŋ sirkul e hakkunde kaɓɓaango rewoowo e toɓɓere ɓurnde wootere.

circle-change-radius-non-numerical = Horiima waylude rayoŋ sirkul rewoowo e toɓɓe ɗe alaa limoore

circle-radius-with-points-non-numerical = Horiima sosde sirkul rewoowo e toɓɓere ɓurnde wootere e rayoŋ kaɓɓaango si keeweeje limoore ngalaa.

circle-change-center-non-numerical = Waylugol hakkunde sirkul rewoowo e toɓɓe ɗe alaa keeweeje limoore waɗaaka.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Njaajeendi fotaani e nokku golle. Nokku ina jogii sahaa { $intervals } kono golle ina jogii { $inputs ->
            [one] naatnugol { $inputs }
           *[other] naatnugol { $inputs }
        }.
       *[other] Njaajeendi fotaani e nokku golle. Nokku ina jogii sahaaji { $intervals } kono golle ina jogii { $inputs ->
            [one] naatnugol { $inputs }
           *[other] naatnugol { $inputs }
        }.
    }

function-domain-invalid-format = Mbaydi nokku golle moƴƴaani.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Keewal mawnungal ngal wonaa limoore e golle ina yaltinee.
        [minimum] Keewal famɗungal ngal wonaa limoore e golle ina yaltinee.
        [extremum] Keewal cakkitiingal ngal wonaa limoore e golle ina yaltinee.
        [point] Toɓɓere nde wonaa limoore e golle ina yaltinee.
        [slope] Ooñagol ngol wonaa limoore e golle ina yaltinee.
       *[other] { $type } mo wonaa limoore e golle ina yaltinee.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Keewal mawnungal meho e golle ina yaltinee.
        [minimum] Keewal famɗungal meho e golle ina yaltinee.
        [extremum] Keewal cakkitiingal meho e golle ina yaltinee.
        [point] Toɓɓere meere e golle ina yaltinee.
       *[other] { $type } meho e golle ina yaltinee.
    }

function-points-too-close = Golle ina jogii toɓɓe ɗiɗi ɓadiiɗe sanne. Horiima firde golle.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Ndeeɗtagol golle ina waawi tan si limoore naatnugol foti e limoore yaltingol. Ndee golle ina jogii naatnugol { $inputs } e { $outputs ->
            [one] yaltingol { $outputs }
           *[other] yaltingol { $outputs }
        }.
       *[other] Ndeeɗtagol golle ina waawi tan si limoore naatnugol foti e limoore yaltingol. Ndee golle ina jogii naatnugol { $inputs } e { $outputs ->
            [one] yaltingol { $outputs }
           *[other] yaltingol { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Njuutendi njuɓɓudi moƴƴaani.  Ina foti wonde limoore timmunde nde wonaa ley meere.

sequence-invalid-step = Taƴre njuɓɓudi moƴƴaani.  Ina foti wonde limoore e njuɓɓudi sifaa { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" njuɓɓudi limooje moƴƴaani.  Ina foti wonde limoore.

sequence-invalid-endpoint-letters = "{ $attribute }" njuɓɓudi alkulal moƴƴaani.  Ina foti wonde dental alkulal.

sequence-invalid-endpoint = "{ $attribute }" njuɓɓudi moƴƴaani.

select-from-sequence-coprime-not-numbers = coprime yaltinaama sabu limooje cuɓaaka

select-from-sequence-coprime-with-exclude-combinations = coprime yaltinaama sabu excludeCombinations kaɓɓaama

## Resolving a `target`

target-not-found = Payndaale `<{ $source }>` moƴƴaani: payndaale njiyaaka.

target-state-variable-not-found = Payndaale `<{ $source }>` moƴƴaani: waylotooɗo ngonka biyeteeɗo "{ $property }" yiyaaka e `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Waylotooɗe `<odeSystem>` ina poti seerde e waylotooɗo daroriiɗo hoore mum.

ode-system-duplicate-variable-names = Horiima firde golle ODE RHS e inɗe waylotooɗe ndeeɗtaaɗe.

ode-system-rhs-function-error = Horiima firde golle ODE RHS.  Juumre e sosgol golle mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Horiima firde aŋgal hakkunde diide { $count }

angle-invalid-through-point = Toɓɓere moƴƴaani e through `<angle>`

parabola-vertex-too-many-points = Parabool e hoore mum rewoowo e toɓɓere ɓurnde wootere waɗaaka.

parabola-too-many-points = Parabool rewoowo e toɓɓe ɓurɗe tati waɗaaka.

intersection-too-many-items = Fottugol piiji ɓurɗi ɗiɗi waɗaaka

## Other math components

ionic-compound-not-two-ions = Denndaangal iyoŋ ngal wonaa e iyoŋaaji ɗiɗi waɗaaka.

ionic-compound-needs-cation-and-anion = Denndaangal iyoŋ waɗaama tan ngam katiyoŋ wooto e aniyoŋ wooto.

solve-equations-cannot-evaluate = Horiima firtude ekwaasiyoŋ sabu horiima ƴeewtaade nde: { $equation }

math-operators-operand-number-required = Ina foti kaɓɓeede operandNumber si aɗa yaltina operand limtorɗe.

eigen-decomposition-failed = Horiima limtude keeweeje eigen matiriis

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameetar { $parameters } alaa e mbaydi, ko waɗi si o fottay e nokku meho sahaa kala.
       *[other] `<matchesPattern>`: parameetaruuji { $parameters } ngalaa e mbaydi, ko waɗi si ɗi pottay e nokku meho sahaa kala.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: horiima faamde grid="{ $grid }". Ina foti wonde none, medium, dense, walla limooje ɗiɗi ɓurɗe meere ceerndaaɗe e nokku, wano grid="1 0.5". Girid winndaaka.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" walaa ballal e kollirgal prefigure; laawol right ina huutoree.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" walaa ballal e kollirgal prefigure; laawol top ina huutoree.

prefigure-invalid-axis-bounds = `<graph>`: keeri aksi moƴƴaani ngam waylugol prefigure; bbox ko woowaa ina huutoree (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: njaajeendi moƴƴaani ngam waylugol prefigure; njaajeendi ko woowaa 425 ina huutoree.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio moƴƴaani ngam waylugol prefigure; betirgal ko woowaa 1 ina huutoree.

prefigure-grid-spacing-too-fine = `<graph>`: nokku hakkunde girid ina famɗi sanne e keeri aksi; girid accaama e kollirgal prefigure.

prefigure-annotations-not-rendered = `<graph>`: firooji kollirtaake si kollirgal PreFigure huutoraaka.

multiple-annotations-children = Ɓiɓɓe keewɓe `<annotations>` njiyaama e `<graph>`; fof so wonaa cakkitiiɗo ina njaltinee.

## Referring to other components

copy-unrecognized-component-type = Horiima ɓeydude walla natde sifaa geɗal mo anndaaka: { $type }.

copy-prop-not-found = Sifa { $property } yiyaaka e geɗal sifaa { $component }

collect-no-source = Ɓure collect njiyaaka.

collect-invalid-component-type = Horiima dentinde geɗe sifaa `<{ $component }>` sabu ko sifaa geɗal moƴƴaani.

reference-index-unavailable = Horiima hollude limre `{ $reference }`

## `<callAction>`

component-action-unavailable = Horiima noddude { $action } e geɗal `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Datta ina jogii mbaydi moƴƴaani.  Diide ina njogii njuutendi ceertunde. Yiyaama e componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Datta ina jogii inɗe kolom ndeeɗtaaɗe.  Yiyaama e componentIdx :{ $componentIdx }

data-frame-missing-column-name = Datta alaa innde kolom.  Yiyaama e componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award ngoo jaabawol ina tiiɗtinii e jaabawol tag answer hoore mum, ɗum addata ngonka ka tijjaaka.

answer-max-num-attempts-in-section-wide-check-work = Waɗde `maxNumAttempts` e `<answer>` nder mooftirgal jogiingal `sectionWideCheckWork` alaa nafoore, sabu limoore etagol ina toppitee e mooftirgal. Waɗ `maxNumAttempts` e mooftirgal.

nested-section-wide-check-work-max-num-attempts = Waɗde `maxNumAttempts` e mooftirgal jogiingal `sectionWideCheckWork` ngal woni nder goɗɗal jogiingal `sectionWideCheckWork` alaa nafoore, sabu limoore etagol ina toppitee e mooftirgal caggal. Waɗ `maxNumAttempts` e mooftirgal caggal.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Sifa { $attributes } waawaa jogaade nafoore si symbolicEquality alaa.
       *[other] Sifaaji { $attributes } mbaawaa jogaade nafoore si symbolicEquality alaa.
    }

answer-invalid-type = Sifaa jaabawol moƴƴaani: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sabu geɗal `<{ $component }>` alaa innde, waawaa huutoreede wano sifa module

module-attribute-name-already-defined = Geɗal `<{ $component } name="{ $name }">` waawaa huutoreede wano sifa module sabu sifaa geɗal `<module>` ina jogii sifa "{ $name }" e ɗum.

conditional-content-condition-ignored = Sifa `condition` ina yaltinee e geɗal `<conditionalContent>` jogiingal ɓiɓɓe case walla else.

slider-markers-type-mismatch = Sifaa maandeeji fotaani e sifaa slider.

pretzel-problem-needs-statement-and-answer = pretzel moƴƴaani: kala `<problem>` ina foti jogaade `<statement>` gooto e `<answer>` gooto.

pretzel-circuit-first-problem-distractor = pretzel moƴƴaani: e mode="circuit", `<problem>` adannde waawaa wonde majjinoore.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Keewal moƴƴaani { $values } e sifa `{ $attribute }`; ina yaltinee.
       *[other] Keeweeje moƴƴaani { $values } e sifa `{ $attribute }`; ina njaltinee.
    }

attribute-must-be-references = Keewal moƴƴaani `{ $value }` e sifa `{ $attribute }`. Sifa ina foti sosreede joopagol ngol fuɗɗortoo `$`.

math-input-invalid-function-names = <mathInput>: inɗe golle moƴƴaa njaltinaama e { $attribute }: { $names }. Geɗal kollirgol innde kala ina foti jogaade alkule ɗiɗi walla ɓuri (alkule walla taƴe); `<mathspeak alternative>` e `|` ina waawi rewde.

## Building components from the source

component-type-invalid = Sifaa geɗal moƴƴaani: `<{ $componentType }>`

attribute-repeated = Horiima ndeeɗtude sifa { $attribute }.

attribute-invalid-for-component = Sifa "{ $attribute }" moƴƴaani e geɗal sifaa `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Firo sifa { $styleNumber } alaa seerndugol fotoowol e { $context ->
        [text-on-background] noorde ɗeri e noorde ɓaawo
        [high-contrast] noorde seerndugol mawnungol e kanwaa
        [line] noorde diidol e kanwaa
        [marker] noorde maandeeji e kanwaa
       *[text-on-canvas] noorde ɗeri e kanwaa
    }{ $mode ->
        [dark] { " (laawol ɓaleewol)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ina naamnii { $threshold }:1 walla ɓuri).

style-definition-dark-mode-text-background-contrast =
    Hay so firo sifa { $styleNumber } kaɓɓii noore jogiiɗe seerndugol fotoowol e laawol ndaneewol, noore laawol ɓaleewol ɗe njaltirta e keeweeje ɗee ngalaa seerndugol fotoowol hakkunde noorde ɗeri e noorde ɓaawo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ina naamnii { $threshold }:1 walla ɓuri). { $suggestion ->
        [available] Ngam seerndugol fota e laawol ɓaleewol, ɓeydu seerndugol laawol ndaneewol (misaal, waɗ { $lightAttribute }="{ $lightColor }") walla waylu noorde laawol ɓaleewol (misaal, waɗ { $darkAttribute }="{ $darkColor }").
       *[none] Ngam seerndugol fota e laawol ɓaleewol, ɓeydu seerndugol laawol ndaneewol walla waylu noore ɗee e textColorDarkMode e/walla backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hay so firo sifa { $styleNumber } kaɓɓii noorde ɗeri jogiinde seerndugol fotoowol e laawol ndaneewol, noorde ɗeri laawol ɓaleewol nde yaltirta e keewal ngal alaa seerndugol fotoowol e kanwaa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ina naamnii { $threshold }:1 walla ɓuri). { $suggestion ->
        [available] Ngam seerndugol fota e laawol ɓaleewol, ɓeydu seerndugol laawol ndaneewol (misaal, waɗ textColor="{ $lightColor }") walla waylu noorde laawol ɓaleewol (misaal, waɗ textColorDarkMode="{ $darkColor }").
       *[none] Ngam seerndugol fota e laawol ɓaleewol, ɓeydu seerndugol laawol ndaneewol walla waylu noorde nde e textColorDarkMode.
    }

section-multiple-style-palettes = Geɗal ina waawi suɓaade <stylePalette> gootal tan; cakkitiingal ina huutoree.

## Unique variants

variant-num-to-select-not-non-negative-integer = horiima anndude sifaaji ceertuɗi { $component } sabu numToSelect wonaa limoore timmunde nde wonaa ley meere.

variant-num-to-select-not-constant-number = horiima anndude sifaaji ceertuɗi { $component } sabu numToSelect wonaa limoore ndeggotoonde.

variant-with-replacement-not-constant-boolean = horiima anndude sifaaji ceertuɗi { $component } sabu withReplacement wonaa boolean ndeggotooɗo.

variant-select-weight-disables-unique = Sifaaji ceertuɗi select ina njaltinee si cuɓoowo jogiiɗo selectWeight walla selectForVariants woodi

variant-coprime-undetermined = horiima anndude sifaaji ceertuɗi { $component } sabu horiima anndude si coprime ko fenaande sahaa kala.

variant-attribute-not-constant = horiima anndude sifaaji ceertuɗi { $component } sabu { $attribute } ndeggotaako.

variant-attribute-not-number = horiima anndude sifaaji ceertuɗi { $component } sabu { $attribute } wonaa limoore.

variant-attribute-wrong-type-for-sequence =
    horiima anndude sifaaji ceertuɗi { $component } sifaa { $type } sabu { $attribute } wonaa { $expected ->
        [letters-combination] dental alkulal
        [math-expression] konngol limtorgal jaɓaango
        [integer] limoore timmunde
       *[number] limoore
    }.

variant-length-not-integer = horiima anndude sifaaji ceertuɗi { $component } sabu length wonaa limoore timmunde.

variant-sort-not-implemented = sifaaji ceertuɗi { $component } jogiiɗo sort waɗaaka

variant-exclude-combinations-not-implemented = sifaaji ceertuɗi { $component } jogiiɗo excludeCombinations waɗaaka

variant-math-exclude-not-implemented = sifaaji ceertuɗi { $component } sifaa math jogiiɗo exclude waɗaaka

variant-non-constant-exclude-not-implemented = sifaaji ceertuɗi { $component } jogiiɗo exclude baylotooɗo waɗaaka

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: walaa ballal e kollirgal graph prefigure; taanum accaama.

prefigure-descendant-invalid-geometry = { $subject }: seometeri nde joofaani walla nde timmaani; taanum accaama.

prefigure-curve-label-omitted = { $subject }: inɗe ngalaa ballal e geɗe diidol ooñiingol baylaaɗe; innde accaama.

prefigure-curve-unsupported-definition-type = { $subject }: sifaa firo golle diidol ooñiingol '{ $definitionType }' walaa ballal; taanum accaama.

prefigure-region-flip-functions-unsupported = { $subject }: sifa flipFunctions e regionBetweenCurves walaa ballal; taanum accaama.

prefigure-region-non-formula-child = { $subject }: ko golle ɓiɓɓe sifaa formula tan njogii ballal e regionBetweenCurves; taanum accaama.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' walaa ballal e { $labelKind ->
        [line-family] innde ɓeynguure diide
       *[point] innde toɓɓere
    }; fotondiral ko woowaa PreFigure ina huutoree.

prefigure-fill-style-unsupported = { $subject }: sifa heewgol '{ $fillStyle }' walaa ballal PreFigure; ina artee e heewgol tiiɗngol.

prefigure-line-style-unknown = { $subject }: sifa diidol mo anndaaka '{ $lineStyle }' accaama e yaltingol PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: sifa maandeeji '{ $markerStyle }' waylaama e sifa PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: sifa maandeeji '{ $markerStyle }' walaa ballal PreFigure; sifa ko woowaa ina huutoree.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` moƴƴaani; horiima yiyde payndaale. Firo accaama.

annotation-ref-multiple-targets = `<annotation>`: `ref` hollii payndaale keewɗe; adannde ina huutoree.

annotation-ref-outside-graph = `<annotation>`: `ref` moƴƴaani; payndaale ina caggal graph joginooɗo ɗe. Firo accaama.

annotation-ref-unsupported-target = `<annotation>`: `ref` moƴƴaani; payndaale wonaa huunde natal jogiinde ballal e waylugol prefigure. Firo accaama.

annotation-text-missing = `<annotation>`: `text` alaa walla ko meho; ɗeri meho ina yaltinee.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Tiiɗtinagol ruttotoongol yiyaama.
       *[other] Tiiɗtinagol ruttotoongol jogiingol geɗal `<{ $componentType }>` yiyaama.
    }

reference-no-referent = Hay huunde yiyaaka e joopagol: `{ $reference }`

reference-multiple-referents = Piiji keewɗi njiyaama e joopagol: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Mbaydi sifa { $attribute } e `<{ $componentType }>` moƴƴaani.

children-invalid = Ɓiɓɓe moƴƴaa e `<{ $componentType }>`: Ɓiɓɓe moƴƴaa njiyaama: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Keewal moƴƴaani `{ $value }` e sifa `{ $attribute }`, keewal `{ $default }` ina huutoree

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Sifaa DoenetML { $version } yiyaaka.
       *[other] Sifaa DoenetML { $version } yiyaaka. Ina artee e sifaa { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML moƴƴaani: { $content }

parse-tag-missing-close-tag = DoenetML moƴƴaani: Tag `{ $tag }` alaa tag uddoowo. Tag uddotooɗo hoore mum walla tag `</{ $tagName }>` tijjanoo.

parse-tag-error = DoenetML moƴƴaani: Juumre e tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML moƴƴaani: Sifa moƴƴaani `{ $attribute }` ina wa'i wano alaa keewal.

parse-attribute-invalid = DoenetML moƴƴaani: Sifa moƴƴaani `{ $attribute }`

parse-attribute-value-invalid = DoenetML moƴƴaani: Keewal sifa moƴƴaani `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML moƴƴaani: Keewal sifa moƴƴaani `{ $value }`. Maandeeji jantogol potaani. Ina wa'i wano `{ $quote }` alaa

parse-open-tag-name-missing = DoenetML moƴƴaani: Tag mo alaa innde yiyaama, misaal `<`

parse-tag-not-closed = DoenetML moƴƴaani: Tag `{ $tag }` udditaaka (ina wa'i wano `>` alaa).

parse-self-closing-tag-name-missing = DoenetML moƴƴaani: Tag mo alaa innde yiyaama `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML moƴƴaani: Tag `{ $tag }` udditaaka (ina wa'i wano `/>` alaa).

parse-tag-invalid-attributes = DoenetML moƴƴaani: Tag `{ $tag }` jaɓaaka. Ina waawi jogaade sifaaji moƴƴaa.

parse-close-tag-name-missing = DoenetML moƴƴaani: Tag uddoowo mo alaa innde yiyaama, misaal `</`

parse-attribute-value-unquoted = Keeweeje sifaaji ina poti wonde nder maandeeji jantogol: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML moƴƴaani: Tag uddoowo `{ $tag }` yiyaama, kono tag udditoowo fotoowo alaa

parse-close-tag-mismatched = DoenetML moƴƴaani: Tag uddoowo fotaani. `</{ $expected }>` tijjanoo. `{ $found }` yiyaama

parser-node-unconvertible = Horiima waylude nod { $node } e nod Dast.

## Names

name-attribute-invalid =
    Innde sifa moƴƴaani name='{ $name }'. { $reason ->
        [characters] Inɗe ina mbaawi jogaade alkule, limce, diide ley walla taƴe tan.
       *[start] Inɗe ina poti fuɗɗoraade alkulal.
    }

component-name-invalid-start = Innde geɗal moƴƴaani "{ $name }". Inɗe ina poti fuɗɗoraade alkulal.

## `<answer>` sugar

answer-video-watched-missing-video = Jaabawol sifaa videoWatched ina foti jogaade sifa video

answer-video-watched-video-not-reference = Jaabawol sifaa videoWatched ina foti jogaade sifa video mo woni joopagol

answer-name-not-single-text = Sifa name jaabawol ina foti jogaade ɓiɗɗo gooto ɗeri

## Referencing another document

external-doenetml-recursion-limit = Horiima heɓde DoenetML caggal sabu daraɗe ndeeɗtagol keewɗe sanne. Hara joopagol ruttotoongol ina woodi?

external-doenetml-unavailable = Horiima heɓde DoenetML e { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML keɓaaɗo e { $attribute }="{ $uri }" moƴƴaani: fotaani e sifaa geɗal "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Sifa `{ $from }` huutortaake kadi; huutoro `{ $to }` e nokku mum.
       *[other] [deprecation] Sifa `{ $from }` e `<{ $component }>` huutortaake kadi; huutoro `{ $to }` e nokku mum.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Sifa `{ $from }` huutortaake kadi ina yaltinee sabu `{ $to }` kaɓɓaama kadi.
       *[other] [deprecation] Sifa `{ $from }` e `<{ $component }>` huutortaake kadi ina yaltinee sabu `{ $to }` kaɓɓaama kadi.
    }

deprecated-attribute-ignored = [deprecation] Sifa `{ $attribute }` e `<{ $component }>` huutortaake kadi ina yaltinee.

deprecated-attribute-to-child = [deprecation] Sifa `{ $attribute }` e `<{ $component }>` huutortaake kadi; huutoro ɓiɗɗo `<{ $child }>` e nokku mum.

deprecated-attribute-value-renamed = [deprecation] Keewal `{ $value }` e sifa `{ $attribute }` e `<{ $component }>` huutortaake kadi; huutoro `{ $to }` e nokku mum.


## Language coverage

pluralize-english-only = `<pluralize>` ina waawi waɗde keewgol Engeleere tan, ko waɗi si ɗeri mum accitaama no ngoni e ɗeri winndaango e { $locale }. Winndu mbaydi keewgol tigi, walla waɗ nde e sifa `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Geɗal `<{ $tag }>` wonaa geɗal Doenet anndaangal.

schema-element-not-allowed-at-root = Geɗal `<{ $tag }>` jaɓaaka e ɓure ɗeri.

schema-element-not-allowed-inside = Geɗal `<{ $tag }>` jaɓaaka nder `<{ $parent }>`.

schema-attribute-unrecognized = Geɗal `<{ $tag }>` alaa sifa biyeteeɗo `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Sifa `{ $attribute }` geɗal `<{ $tag }>` ina foti wonde njuɓɓudi ndi piiji mum kala ngoni gooto e: { $allowed }
       *[other] Sifa `{ $attribute }` geɗal `<{ $tag }>` ina foti wonde gooto e: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Innde sifaa moƴƴaani e select.  Innde sifaa { $variantName } ina yalta e cuɓooje { $numOptions } kono limoore cuɓagol ko { $numToSelect }.

select-variant-name-without-options = Sifaaji goɗɗi kaɓɓaama e select kono cuɓooje kaɓɓaaɗe ngalaa e innde sifaa waawnde wonde: { $variantName }.

select-variant-name-not-possible = Innde sifaa { $variantName } kaɓɓaande e select wonaa innde sifaa waawnde wonde.

select-too-few-options = Horiima suɓaade geɗe { $numToSelect } e { $numOptions } tan.

select-from-sequence-too-few-values = Horiima suɓaade keeweeje { $numToSelect } e njuɓɓudi njuutendi { $length }.

select-from-sequence-indices-count-mismatch = Limoore limce kaɓɓaaɗe e select ina foti fotde e limoore cuɓagol

select-from-sequence-indices-not-integers = Limce fof kaɓɓaaɗe e select ina poti wonde limooje timmuɗe

select-from-sequence-index-excluded = Limre kaɓɓaande selectfromsequence yaltinanoo

select-from-sequence-indices-excluded-combination = Limce kaɓɓaaɗe selectfromsequence ngonnoo dental yaltinaangal

select-from-sequence-coprime-not-positive-integers = Horiima suɓaade dental coprime sabu limooje timmuɗe ɓurɗe meere cuɓaaka.

select-from-sequence-coprime-common-factor = Horiima suɓaade limooje coprime. Keeweeje fof mbaawɗe ina njogii fakteer gooto. (Keeweeje kaɓɓaaɗe "from" walla "to" ina poti wonde coprime e "step".)

select-from-sequence-coprime-single-number = Horiima suɓaade dental coprime e limoore wootere nde wonaa 1.

select-from-sequence-excluded-too-many-combinations = Ɓuri 70% dental yaltinaama e selectFromSequence

select-from-sequence-coprime-none-found = Horiima suɓaade limooje coprime. Keeweeje fof mbaawɗe ina njogii fakteer gooto.

select-from-sequence-too-few-unique-values = Horiima suɓaade keeweeje ceertuɗe { $numToSelect } e njuɓɓudi njuutendi { $numPossibleValues }

select-prime-numbers-too-few-values = Horiima suɓaade keeweeje { $numToSelect } e njuɓɓudi limooje prime njuutendi { $numValues }

select-prime-numbers-values-count-mismatch = Limoore keeweeje kaɓɓaaɗe e select ina foti fotde e limoore cuɓagol

select-prime-numbers-values-not-prime = Keeweeje fof kaɓɓaaɗe e select prime number ina poti wonde e njuɓɓudi limooje prime

select-prime-numbers-values-excluded-combination = Keeweeje kaɓɓaaɗe selectPrimeNumbers ngonnoo dental yaltinaangal

select-prime-numbers-excluded-too-many-combinations = Ɓuri 70% dental yaltinaama e selectPrimeNumbers

select-random-combination-fluke = E ko tijjanoaka sanne, horiima suɓaade dental keeweeje cuɓaaɗe e meere

select-random-value-fluke = E ko tijjanoaka sanne, horiima suɓaade keewal cuɓaangal e meere
