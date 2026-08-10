# Kituba diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] { $attributes } ke tadila ve kana bapwente zole ya nsuka me tulama
       *[other] { $attributes } ke tadila ve kana bapwente zole ya nsuka me tulama
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ke tadila ve kana pwente ya nsuka ti ya kati yonso zole me tulama
       *[other] { $attributes } ke tadila ve kana pwente ya nsuka ti ya kati yonso zole me tulama
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ke sala ve kana pwente ya kati kele ve

## `<line>`

line-points-undetermined-dimensions = Linya ke luta na bapwente ya bunene ya me zabana ve.

line-points-too-few-dimensions = Linya fwete luta na bapwente ya bunene zole to kuluta.

line-points-depend-on-variables = Linya ke luta na bapwente yina ke tadila bima ya ke soba: { $variables }.

line-equation-invalid-format = Mutindu ya mbi ya kiteso ya linya na bima ya ke soba { $variable1 } ti { $variable2 }.

## `<ray>`

ray-overprescribed-through = Leyo me tulama na through, endpoint ti direction.  Beto ke tadila ve through ya me tulama.

ray-dimension-mismatch = numDimensions ke wakana ve na leyo.

## `<vector>`

vector-overprescribed-head = Vekitere me tulama na head, tail ti displacement.  Beto ke tadila ve head ya me tulama.

vector-dimension-mismatch = numDimensions ke wakana ve na vekitere.

## Attracting and constraining

attract-to-without-nearest-point = Beto lenda benda na `<{ $component }>` ve sambu yo kele ti kidimbu nearestPoint ve.

constrain-to-without-nearest-point = Beto lenda kanga na `<{ $component }>` ve sambu yo kele ti kidimbu nearestPoint ve.

constrain-to-interior-without-nearest-point = Beto lenda kanga na kati ya `<{ $component }>` ve sambu yo kele ti kidimbu nearestPoint ve.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ke tadila ve na choiceInput yina kele ya linya ve

## Ordering children by index

choice-input-indices-count-mismatch = Beto ke tadila ve indices ya me tulama na choiceInput sambu ntalu ya indices ke wakana ve ti ntalu ya bana ya choice.

pretzel-indices-count-mismatch = Beto ke tadila ve indices ya me tulama na problem sambu ntalu ya indices ke wakana ve ti ntalu ya bana ya problem.

shuffle-indices-count-mismatch = Beto ke tadila ve indices ya me tulama na shuffle sambu ntalu ya indices ke wakana ve ti ntalu ya bitini.

indices-ignored-out-of-range = Beto ke tadila ve indices ya me tulama na { $component } sambu yankaka kele na nganda ya kiteso.

pretzel-indices-repeated = Beto ke tadila ve indices ya me tulama na pretzel sambu yankaka me vutukila.

pretzel-circuit-first-index = Beto ke tadila ve indices ya me tulama na pretzel na mode="circuit" sambu ya ntete fwete vanda 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Sambu `<{ $component }>` kusala ti bana ya bangogo, kidimbu `type` fwete tulama.

invalid-type-defaulting-to-math = Mutindu { $type } kele mbi sambu na { $component }. Yo fwete vanda math, text, number to boolean. Beto ke vutuka na math.

string-not-valid-component-to-arrange = Ngogo "{ $value }" kele kitini ya mbote ve sambu na { $component }. Beto ke tadila yo ve.

## Types and variables

invalid-type-defaulting-to-number = Mutindu { $type } kele mbi, beto ke tula mutindu na number.

invalid-variable-value = Talu ya kima ya ke soba kele mbi: `{ $value }`

## Variants

variant-index-must-be-number = Kidimbu ya mutindu { $index } fwete vanda ntalu

variant-index-must-be-integer = Kidimbu ya mutindu { $index } fwete vanda ntalu ya mvimba

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` me salama ve na biteso ya ke soba ve. Beto ke tula bunene na kiteso ya kufwanana.

side-by-side-absolute-margins = `<{ $component }>` me salama ve na biteso ya ke soba ve. Beto ke tula bansuki na kiteso ya kufwanana.

side-by-side-no-block-child = `<{ $component }>` kele mbi: yo fwete vanda ti mwana mosi ya kitini.

## `<label>`

label-for-ignored-on-graphical = Kidimbu `for` na `<label>` ya kifwani ke tadila ve.

label-for-must-resolve-to-one = Kidimbu `for` na `<label>` fwete songa kitini mosi kaka.

label-for-unresolved = Kidimbu `for` na `<label>` me kuka ve kusonga kitini.

label-for-answer-with-authored-inputs = Kidimbu `for` na `<label>` ke songa `<answer>` yina kele ti bakukotisa ya me sonikama na kisoneki; songa kukotisa yo mosi.

label-for-answer-without-input = Kidimbu `for` na `<label>` ke songa `<answer>` yina kele ti kukotisa ve sambu na kupesa zina.

label-for-must-reference-input-or-answer = Kidimbu `for` na `<label>` fwete songa kukotisa to mvutu.

## Accessibility

accessibility-short-description-or-decorative = Sambu na kukuma, `<{ $component }>` fwete vanda ti ntendula ya nkufi to kutulama bonso kima ya kitoko.

accessibility-video-short-description = Sambu na kukuma, `<video>` fwete vanda ti ntendula ya nkufi.

accessibility-input-short-description-or-label = Sambu na kukuma, `<{ $component }>` fwete vanda ti ntendula ya nkufi to zina.

accessibility-answer-input-short-description-or-label = Sambu na kukuma, `<answer>` yina ke sala kukotisa fwete vanda ti ntendula ya nkufi to zina.

accessibility-short-description-contains-math = Bantendula ya nkufi fwete vanda ti bitini ya batalu ve bonso `<{ $component }>`. Sonika batalu yonso na bangogo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kele ti luswaswanu ya kufwana ve sambu na bangogo ya ntu ya kitini (na mudidi) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; yo ke lomba na nsi ve ya { $threshold }:1).
       *[other] { $colorName } kele ti luswaswanu ya kufwana ve sambu na bangogo ya ntu ya kitini ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; yo ke lomba na nsi ve ya { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Beto me sala ntete ve `<circle>` yina ke luta na bapwente { $count } kana bapwente kele ti batalu ya ntalu ve.

circle-too-many-through-points = Beto lenda tanga ve ndilu yina ke luta na bapwente kuluta 3.

circle-overprescribed-radius-center-points = Beto lenda tanga ve ndilu yina kele ti leyo, kisika ya kati ti bapwente yonso me tulama.

circle-center-with-multiple-points = Beto lenda tanga ve ndilu yina kele ti kisika ya kati ke luta na pwente kuluta 1.

circle-radius-too-small = Beto lenda tanga ve ndilu: sambu ntama na kati ya bapwente zole kele { $distance }, leyo { $radius } ya me tulama kele fioti mingi.

circle-radius-with-many-points = Beto lenda sala ve ndilu yina ke luta na bapwente kuluta zole ti leyo ya me tulama.

circle-invalid-center-or-through-points = Kisika ya kati to bapwente ya ndilu kele mbi.

circle-radius-center-with-multiple-points = Beto lenda tanga ve leyo ya ndilu yina kele ti kisika ya kati ke luta na pwente kuluta 1.

circle-change-radius-non-numerical = Beto lenda soba ve leyo ya ndilu yina kele ti bapwente ya ntalu ve

circle-radius-with-points-non-numerical = Beto lenda sala ve ndilu yina ke luta na pwente kuluta mosi ti leyo ya me tulama kana batalu ya ntalu kele ve.

circle-change-center-non-numerical = Beto me sala ntete ve kusoba kisika ya kati ya ndilu yina ke luta na bapwente ya ntalu ve.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Bunene ke fwana ve sambu na kitini ya fonksio. Kitini kele ti kiteso { $intervals } kansi fonksio kele ti { $inputs ->
            [one] kukotisa { $inputs }
           *[other] bakukotisa { $inputs }
        }.
       *[other] Bunene ke fwana ve sambu na kitini ya fonksio. Kitini kele ti biteso { $intervals } kansi fonksio kele ti { $inputs ->
            [one] kukotisa { $inputs }
           *[other] bakukotisa { $inputs }
        }.
    }

function-domain-invalid-format = Mutindu ya mbi ya kitini ya fonksio.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Beto ke tadila ve ya zulu ya ntalu ve ya fonksio.
        [minimum] Beto ke tadila ve ya nsi ya ntalu ve ya fonksio.
        [extremum] Beto ke tadila ve nsuka ya ntalu ve ya fonksio.
        [point] Beto ke tadila ve pwente ya ntalu ve ya fonksio.
        [slope] Beto ke tadila ve kubenda ya ntalu ve ya fonksio.
       *[other] Beto ke tadila ve { $type } ya ntalu ve ya fonksio.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Beto ke tadila ve ya zulu ya mpamba ya fonksio.
        [minimum] Beto ke tadila ve ya nsi ya mpamba ya fonksio.
        [extremum] Beto ke tadila ve nsuka ya mpamba ya fonksio.
        [point] Beto ke tadila ve pwente ya mpamba ya fonksio.
       *[other] Beto ke tadila ve { $type } ya mpamba ya fonksio.
    }

function-points-too-close = Fonksio kele ti bapwente zole yina kele penepene mingi. Beto lenda tula ve fonksio.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Kuvutukila ya fonksio ke salama kaka kana ntalu ya bakukotisa ke wakana ti ntalu ya bakubasika. Fonksio yai kele ti kukotisa { $inputs } ti { $outputs ->
            [one] kubasika { $outputs }
           *[other] bakubasika { $outputs }
        }.
       *[other] Kuvutukila ya fonksio ke salama kaka kana ntalu ya bakukotisa ke wakana ti ntalu ya bakubasika. Fonksio yai kele ti bakukotisa { $inputs } ti { $outputs ->
            [one] kubasika { $outputs }
           *[other] bakubasika { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Bunda ya molongo kele mbi.  Yo fwete vanda ntalu ya mvimba yina kele na nsi ya zero ve.

sequence-invalid-step = Ntambi ya molongo kele mbi.  Yo fwete vanda ntalu na molongo ya mutindu { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ya molongo ya bantalu kele mbi.  Yo fwete vanda ntalu.

sequence-invalid-endpoint-letters = "{ $attribute }" ya molongo ya bansonika kele mbi.  Yo fwete vanda kuvukisa ya bansonika.

sequence-invalid-endpoint = "{ $attribute }" ya molongo kele mbi.

select-from-sequence-coprime-not-numbers = coprime me tadila ve sambu bantalu ke solama ve

select-from-sequence-coprime-with-exclude-combinations = coprime me tadila ve sambu excludeCombinations me tulama

## Resolving a `target`

target-not-found = target kele mbi sambu na `<{ $source }>`: beto me mona target ve.

target-state-variable-not-found = target kele mbi sambu na `<{ $source }>`: beto me mona ve kidimbu ya zina "{ $property }" na `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Bima ya ke soba ya `<odeSystem>` fwete swaswana ti kima ya ke soba ya kimpwanza.

ode-system-duplicate-variable-names = Beto lenda tula ve bafonksio ya ODE RHS yina kele ti bazina ya bima ya ke soba ya me vutukila.

ode-system-rhs-function-error = Beto lenda tula ve fonksio ya ODE RHS.  Mbi na kusala fonksio ya mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Beto lenda tula ve kona na kati ya balinya { $count }

angle-invalid-through-point = Pwente ya mbi na through ya `<angle>`

parabola-vertex-too-many-points = Beto me sala ntete ve parabole yina kele ti kona ke luta na pwente kuluta 1.

parabola-too-many-points = Beto me sala ntete ve parabole yina ke luta na bapwente kuluta 3.

intersection-too-many-items = Beto me sala ntete ve kukutana sambu na bima kuluta zole

## Other math components

ionic-compound-not-two-ions = Beto me sala ntete ve kuvukisa ya bayoni sambu na kima yina kele bayoni zole ve.

ionic-compound-needs-cation-and-anion = Kuvukisa ya bayoni me salama kaka sambu na katio mosi ti anio mosi.

solve-equations-cannot-evaluate = Beto lenda katula ve kiteso sambu yo lendaka tangama ve: { $equation }

math-operators-operand-number-required = Nge fwete tula operandNumber kana nge ke katula operand ya batalu.

eigen-decomposition-failed = Beto me kuka ve kutanga eigenvalues ya matrisi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametre { $parameters } ke monana ve na pattern, yo yina yo ta wakana ntangu yonso ti mpamba.
       *[other] `<matchesPattern>`: baparametre { $parameters } ke monana ve na pattern, yo yina yo ta wakana ntangu yonso ti mpamba.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: beto lenda bakisa ve grid="{ $grid }". Yo fwete vanda none, medium, dense, to bantalu zole ya mbote ya me kabwana na kisika, bonso grid="1 0.5". Ata kileso ke salama ve.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" me ndimama ve na kisongi prefigure; beto ke sala bonso na lweka ya kibakala.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" me ndimama ve na kisongi prefigure; beto ke sala bonso na zulu.

prefigure-invalid-axis-bounds = `<graph>`: bansuki ya linya ya nene kele mbi sambu na kusoba ya prefigure; beto ke sala ti bbox ya ntangu yonso (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: bunene kele mbi sambu na kusoba ya prefigure; beto ke sala ti bunene ya kifwani ya ntangu yonso 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio kele mbi sambu na kusoba ya prefigure; beto ke sala ti kiteso ya ntangu yonso 1.

prefigure-grid-spacing-too-fine = `<graph>`: kisika ya kileso kele fioti mingi sambu na bansuki ya linya ya nene; kileso ke salama ve na kisongi prefigure.

prefigure-annotations-not-rendered = `<graph>`: bantendula ke salama ve kana kisongi PreFigure ke sala ve.

multiple-annotations-children = Bana `<annotations>` mingi me monana na `<graph>`; yonso katula ya nsuka me tadila ve.

## Referring to other components

copy-unrecognized-component-type = Beto lenda yikisa to kopi ve mutindu ya kitini yina me zabana ve: { $type }.

copy-prop-not-found = Beto me mona ve prop { $property } na kitini ya mutindu { $component }

collect-no-source = Ata nto me monana ve ya collect.

collect-invalid-component-type = Beto lenda vukisa ve bitini ya mutindu `<{ $component }>` sambu yo kele mutindu ya mbi.

reference-index-unavailable = Beto lenda songa ve kidimbu `{ $reference }`

## `<callAction>`

component-action-unavailable = Beto lenda binga ve { $action } na kitini `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bansangu kele ti mutindu ya mbi.  Balinya kele ti bunda yina ke wakana ve. Yo me monana na componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Bansangu kele ti bazina ya bakolone ya me vutukila.  Yo me monana na componentIdx :{ $componentIdx }

data-frame-missing-column-name = Bansangu kele ti zina ya kolone ve.  Yo me monana na componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Bapwe ya mvutu yai ke tadila mvutu yina tagi yo mosi me tinda, mpi yo ta natisa mambu ya ke vandaka ve na ngindu.

answer-max-num-attempts-in-section-wide-check-work = Kutula `maxNumAttempts` na `<answer>` yina kele na kati ya kitini ti `sectionWideCheckWork` ke sala ata kima ve, sambu ntalu ya bakumeka ke yalama na kitini. Tula `maxNumAttempts` na kitini.

nested-section-wide-check-work-max-num-attempts = Kutula `maxNumAttempts` na kitini ti `sectionWideCheckWork` yina kele na kati ya kitini ya nkaka ti `sectionWideCheckWork` ke sala ata kima ve, sambu ntalu ya bakumeka ke yalama na kitini ya nganda. Tula `maxNumAttempts` na kitini ya nganda.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Kidimbu { $attributes } ta sala ata kima ve kana symbolicEquality me tulama ve.
       *[other] Bidimbu { $attributes } ta sala ata kima ve kana symbolicEquality me tulama ve.
    }

answer-invalid-type = Mutindu ya mbi ya mvutu: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sambu kitini `<{ $component }>` kele ti zina ve, yo lenda sadila ve bonso kidimbu ya module

module-attribute-name-already-defined = Kitini `<{ $component } name="{ $name }">` lenda sadila ve bonso kidimbu ya module sambu mutindu `<module>` kele ntete ti kidimbu "{ $name }".

conditional-content-condition-ignored = Kidimbu `condition` ke tadila ve na `<conditionalContent>` yina kele ti bana ya case to else.

slider-markers-type-mismatch = Mutindu ya bidimbu ke wakana ve ti mutindu ya slider.

pretzel-problem-needs-statement-and-answer = pretzel kele mbi: konso `<problem>` fwete vanda ti `<statement>` mosi ti `<answer>` mosi.

pretzel-circuit-first-problem-distractor = pretzel kele mbi: na mode="circuit", `<problem>` ya ntete lenda vanda distractor ve.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Talu ya mbi { $values } sambu na kidimbu `{ $attribute }`; beto ke tadila yo ve.
       *[other] Batalu ya mbi { $values } sambu na kidimbu `{ $attribute }`; beto ke tadila yo ve.
    }

attribute-must-be-references = Talu `{ $value }` kele mbi sambu na kidimbu `{ $attribute }`. Kidimbu fwete vanda ya me salama ti bisonga yina ke yantika ti `$`.

math-input-invalid-function-names = <mathInput>: beto me tadila ve bazina ya fonksio ya mbi na { $attribute }: { $names }. Kitini ya kusonga ya konso zina fwete vanda ti bansonika 2 to kuluta (bansonika to bakisonga); nge lenda yika `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Mutindu ya kitini kele mbi: `<{ $componentType }>`

attribute-repeated = Beto lenda vutukila ve kidimbu { $attribute }.

attribute-invalid-for-component = Kidimbu "{ $attribute }" kele ya kitini ya mutindu `<{ $componentType }>` ve.

## Style definition contrast

style-definition-insufficient-contrast =
    Ntendula ya mutindu { $styleNumber } kele ti luswaswanu ya kufwana ve sambu na { $context ->
        [text-on-background] langi ya bangogo na langi ya nima
        [high-contrast] langi ya luswaswanu ya ngolo na kibaya
        [line] langi ya linya na kibaya
        [marker] langi ya kidimbu na kibaya
       *[text-on-canvas] langi ya bangogo na kibaya
    }{ $mode ->
        [dark] { " (na mudidi)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; yo ke lomba na nsi ve ya { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Ata ntendula ya mutindu { $styleNumber } kele ti balangi yina ke pesa luswaswanu ya kufwana na nsemo, balangi ya mudidi yina me katuka na yo kele ti luswaswanu ya kufwana ve na kati ya langi ya bangogo ti langi ya nima ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; yo ke lomba na nsi ve ya { $threshold }:1). { $suggestion ->
        [available] Sambu luswaswanu kuvanda ya kufwana na mudidi, yikisa luswaswanu ya nsemo (mbandu, tula { $lightAttribute }="{ $lightColor }") to soba langi ya mudidi (mbandu, tula { $darkAttribute }="{ $darkColor }").
       *[none] Sambu luswaswanu kuvanda ya kufwana na mudidi, yikisa luswaswanu ya nsemo to soba balangi yina me katuka na yo ti textColorDarkMode to backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ata ntendula ya mutindu { $styleNumber } kele ti langi ya bangogo yina ke pesa luswaswanu ya kufwana na nsemo, langi ya bangogo ya mudidi yina me katuka na yo kele ti luswaswanu ya kufwana ve na kibaya ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; yo ke lomba na nsi ve ya { $threshold }:1). { $suggestion ->
        [available] Sambu luswaswanu kuvanda ya kufwana na mudidi, yikisa luswaswanu ya nsemo (mbandu, tula textColor="{ $lightColor }") to soba langi ya mudidi (mbandu, tula textColorDarkMode="{ $darkColor }").
       *[none] Sambu luswaswanu kuvanda ya kufwana na mudidi, yikisa luswaswanu ya nsemo to soba langi yina me katuka na yo ti textColorDarkMode.
    }

section-multiple-style-palettes = Kitini lenda sola <stylePalette> mosi kaka; beto ke sala ti ya nsuka.

## Unique variants

variant-num-to-select-not-non-negative-integer = beto lenda zaba ve bamutindu ya ke vutukila ve ya { $component } sambu numToSelect kele ntalu ya mvimba yina kele na nsi ya zero ve.

variant-num-to-select-not-constant-number = beto lenda zaba ve bamutindu ya ke vutukila ve ya { $component } sambu numToSelect kele ntalu ya ke soba ve.

variant-with-replacement-not-constant-boolean = beto lenda zaba ve bamutindu ya ke vutukila ve ya { $component } sambu withReplacement kele boolean ya ke soba ve.

variant-select-weight-disables-unique = Bamutindu ya ke vutukila ve ya select ke kangama kana kusola kele ti selectWeight to selectForVariants

variant-coprime-undetermined = beto lenda zaba ve bamutindu ya ke vutukila ve ya { $component } sambu beto lenda zaba ve kana coprime kele ntangu yonso false.

variant-attribute-not-constant = beto lenda zaba ve bamutindu ya ke vutukila ve ya { $component } sambu { $attribute } ke soba.

variant-attribute-not-number = beto lenda zaba ve bamutindu ya ke vutukila ve ya { $component } sambu { $attribute } kele ntalu ve.

variant-attribute-wrong-type-for-sequence =
    beto lenda zaba ve bamutindu ya ke vutukila ve ya { $component } ya mutindu { $type } sambu { $attribute } kele ve { $expected ->
        [letters-combination] kuvukisa ya bansonika
        [math-expression] mbikudulu ya batalu ya me ndimama
        [integer] ntalu ya mvimba
       *[number] ntalu
    }.

variant-length-not-integer = beto lenda zaba ve bamutindu ya ke vutukila ve ya { $component } sambu length kele ntalu ya mvimba ve.

variant-sort-not-implemented = beto me sala ntete ve bamutindu ya ke vutukila ve ya { $component } yina kele ti sort

variant-exclude-combinations-not-implemented = beto me sala ntete ve bamutindu ya ke vutukila ve ya { $component } yina kele ti excludeCombinations

variant-math-exclude-not-implemented = beto me sala ntete ve bamutindu ya ke vutukila ve ya { $component } ya mutindu math yina kele ti exclude

variant-non-constant-exclude-not-implemented = beto me sala ntete ve bamutindu ya ke vutukila ve ya { $component } yina kele ti exclude ya ke soba

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: me ndimama ve na kisongi prefigure ya graph; mwana me tadila ve.

prefigure-descendant-invalid-geometry = { $subject }: mutindu ya kisika kele ti nsuka ve to kele ya mvimba ve; mwana me tadila ve.

prefigure-curve-label-omitted = { $subject }: bazina me ndimama ve na balinya ya kubenda ya me sobama; zina me katuka.

prefigure-curve-unsupported-definition-type = { $subject }: mutindu ya ntendula ya linya ya kubenda '{ $definitionType }' me ndimama ve; mwana me tadila ve.

prefigure-region-flip-functions-unsupported = { $subject }: kidimbu flipFunctions me ndimama ve na regionBetweenCurves; mwana me tadila ve.

prefigure-region-non-formula-child = { $subject }: kaka bafonksio ya bana ya mutindu formula me ndimama na regionBetweenCurves; mwana me tadila ve.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' me ndimama ve sambu na { $labelKind ->
        [line-family] zina ya dibuta ya balinya
       *[point] zina ya pwente
    }; beto ke sala ti kuvukisa ya PreFigure ya ntangu yonso.

prefigure-fill-style-unsupported = { $subject }: mutindu ya kufuluka '{ $fillStyle }' me ndimama ve na PreFigure; beto ke vutuka na kufuluka ya ngolo.

prefigure-line-style-unknown = { $subject }: mutindu ya linya ya me zabana ve '{ $lineStyle }' me katuka na bakubasika ya PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: mutindu ya kidimbu '{ $markerStyle }' me sobama mutindu ya PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: mutindu ya kidimbu '{ $markerStyle }' me ndimama ve na PreFigure; beto ke sala ti mutindu ya ntangu yonso.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` kele mbi; beto me mona ve kima yina yo ke songa. Ntendula me katuka.

annotation-ref-multiple-targets = `<annotation>`: `ref` me songa bima mingi; beto ke sala ti ya ntete.

annotation-ref-outside-graph = `<annotation>`: `ref` kele mbi; kima yina yo ke songa kele na nganda ya graph yina kele na yo. Ntendula me katuka.

annotation-ref-unsupported-target = `<annotation>`: `ref` kele mbi; kima yina yo ke songa kele kima ya kifwani ya me ndimama ve na kusoba ya prefigure. Ntendula me katuka.

annotation-text-missing = `<annotation>`: `text` kele ve to kele mpamba; beto ke basisa bangogo ya mpamba.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Beto me mona kutadila yina ke zunga.
       *[other] Beto me mona kutadila yina ke zunga ti kitini `<{ $componentType }>`.
    }

reference-no-referent = Ata kima me monana ve sambu na kisonga: `{ $reference }`

reference-multiple-referents = Bima mingi me monana sambu na kisonga: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Mutindu ya mbi ya kidimbu { $attribute } ya `<{ $componentType }>`.

children-invalid = Bana ya mbi ya `<{ $componentType }>`: Beto me mona bana ya mbi: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Talu `{ $value }` kele mbi sambu na kidimbu `{ $attribute }`, beto ke sala ti talu `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versio ya DoenetML { $version } me monana ve.
       *[other] Versio ya DoenetML { $version } me monana ve. Beto ke vutuka na versio { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ya mbi: { $content }

parse-tag-missing-close-tag = DoenetML ya mbi: Tagi `{ $tag }` kele ti tagi ya kukanga ve. Beto vingilaka tagi yina ke kudikanga to tagi `</{ $tagName }>`.

parse-tag-error = DoenetML ya mbi: Mbi na tagi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ya mbi: Kidimbu `{ $attribute }` ya mbi ke monana bonso yo kele ti talu ve.

parse-attribute-invalid = DoenetML ya mbi: Kidimbu `{ $attribute }` kele mbi

parse-attribute-value-invalid = DoenetML ya mbi: Talu ya kidimbu `{ $value }` kele mbi

parse-attribute-value-quote-mismatch = DoenetML ya mbi: Talu ya kidimbu `{ $value }` kele mbi. Bidimbu ya bangogo ke wakana ve. Yo ke monana bonso nge kele ti `{ $quote }` ve

parse-open-tag-name-missing = DoenetML ya mbi: Beto me mona tagi yina kele ti zina ve, bonso `<`

parse-tag-not-closed = DoenetML ya mbi: Tagi `{ $tag }` me kangama ve (yo ke monana bonso `>` kele ve).

parse-self-closing-tag-name-missing = DoenetML ya mbi: Beto me mona tagi yina kele ti zina ve `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ya mbi: Tagi `{ $tag }` me kangama ve (yo ke monana bonso `/>` kele ve).

parse-tag-invalid-attributes = DoenetML ya mbi: Tagi `{ $tag }` kele mbi. Yo lenda vanda ti bidimbu ya mbi.

parse-close-tag-name-missing = DoenetML ya mbi: Beto me mona tagi ya kukanga yina kele ti zina ve, bonso `</`

parse-attribute-value-unquoted = Batalu ya bidimbu fwete vanda na kati ya bidimbu ya bangogo: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ya mbi: Beto me mona tagi ya kukanga `{ $tag }`, kansi tagi ya kukangula ya ke wakana kele ve

parse-close-tag-mismatched = DoenetML ya mbi: Tagi ya kukanga ke wakana ve. Beto vingilaka `</{ $expected }>`. Beto me mona `{ $found }`

parser-node-unconvertible = Beto me kuka ve kusoba node { $node } na node ya Dast.

## Names

name-attribute-invalid =
    Zina name='{ $name }' kele mbi. { $reason ->
        [characters] Bazina lenda vanda ti bansonika, bantalu, bakisonga ya nsi to bakisonga kaka.
       *[start] Bazina fwete yantika ti nsonika.
    }

component-name-invalid-start = Zina ya kitini "{ $name }" kele mbi. Bazina fwete yantika ti nsonika.

## `<answer>` sugar

answer-video-watched-missing-video = Mvutu ya mutindu videoWatched fwete vanda ti kidimbu video

answer-video-watched-video-not-reference = Mvutu ya mutindu videoWatched fwete vanda ti kidimbu video yina kele kisonga

answer-name-not-single-text = Kidimbu name ya mvutu fwete vanda ti mwana mosi ya bangogo

## Referencing another document

external-doenetml-recursion-limit = Beto me kuka ve kubaka DoenetML ya nganda sambu na bavutukila mingi mingi. Kisonga yina ke zunga kele?

external-doenetml-unavailable = Beto me kuka ve kubaka DoenetML na { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ya me bakama na { $attribute }="{ $uri }" kele mbi: yo wakanaka ve ti mutindu ya kitini "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Kidimbu `{ $from }` ke sadila diaka ve; sadila `{ $to }`.
       *[other] [deprecation] Kidimbu `{ $from }` na `<{ $component }>` ke sadila diaka ve; sadila `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Kidimbu `{ $from }` ke sadila diaka ve mpi yo ke tadila ve sambu `{ $to }` mpi me tulama.
       *[other] [deprecation] Kidimbu `{ $from }` na `<{ $component }>` ke sadila diaka ve mpi yo ke tadila ve sambu `{ $to }` mpi me tulama.
    }

deprecated-attribute-ignored = [deprecation] Kidimbu `{ $attribute }` na `<{ $component }>` ke sadila diaka ve mpi yo ke tadila ve.

deprecated-attribute-to-child = [deprecation] Kidimbu `{ $attribute }` na `<{ $component }>` ke sadila diaka ve; sadila mwana `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Talu `{ $value }` ya kidimbu `{ $attribute }` na `<{ $component }>` ke sadila diaka ve; sadila `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` lenda sala buwingi na Kingelezi kaka, yo yina bangogo na yo ke bikala bonso kisoneki me sonika yo na mukanda ya me sonikama na { $locale }. Sonika buwingi na nge mosi, to tula yo ti kidimbu `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Kitini `<{ $tag }>` kele kitini ya Doenet ya me zabana ve.

schema-element-not-allowed-at-root = Kitini `<{ $tag }>` me ndimama ve na nsina ya mukanda.

schema-element-not-allowed-inside = Kitini `<{ $tag }>` me ndimama ve na kati ya `<{ $parent }>`.

schema-attribute-unrecognized = Kitini `<{ $tag }>` kele ti kidimbu ya zina `{ $attribute }` ve.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Kidimbu `{ $attribute }` ya kitini `<{ $tag }>` fwete vanda molongo yina bima na yo konso mosi kele mosi na kati ya: { $allowed }
       *[other] Kidimbu `{ $attribute }` ya kitini `<{ $tag }>` fwete vanda mosi na kati ya: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Zina ya mutindu kele mbi sambu na select.  Zina ya mutindu { $variantName } ke monana na basola { $numOptions } kansi ntalu ya kusola kele { $numToSelect }.

select-variant-name-without-options = Bamutindu yankaka me tulama sambu na select kansi ata kusola me tulama ve sambu na zina ya mutindu yina lenda vanda: { $variantName }.

select-variant-name-not-possible = Zina ya mutindu { $variantName } yina me tulama sambu na select kele zina ya mutindu yina lenda vanda ve.

select-too-few-options = Beto lenda sola ve bitini { $numToSelect } na kati ya bitini { $numOptions } kaka.

select-from-sequence-too-few-values = Beto lenda sola ve batalu { $numToSelect } na molongo ya bunda { $length }.

select-from-sequence-indices-count-mismatch = Ntalu ya indices ya me tulama sambu na select fwete wakana ti ntalu ya kusola

select-from-sequence-indices-not-integers = Indices yonso ya me tulama sambu na select fwete vanda bantalu ya mvimba

select-from-sequence-index-excluded = Kidimbu ya me tulama ya selectfromsequence vandaka ya me katuka

select-from-sequence-indices-excluded-combination = Indices ya me tulama ya selectfromsequence vandaka kuvukisa ya me katuka

select-from-sequence-coprime-not-positive-integers = Beto lenda sola ve bakuvukisa ya coprime sambu bantalu ya mbote ya mvimba ke solama ve.

select-from-sequence-coprime-common-factor = Beto lenda sola ve bantalu ya coprime. Batalu yonso yina lenda vanda kele ti kitangi mosi. (Batalu ya me tulama ya "from" to "to" fwete vanda coprime ti "step".)

select-from-sequence-coprime-single-number = Beto lenda sola ve bakuvukisa ya coprime na ntalu mosi yina kele 1 ve.

select-from-sequence-excluded-too-many-combinations = Beto me katula bakuvukisa kuluta 70% na selectFromSequence

select-from-sequence-coprime-none-found = Beto me kuka ve kusola bantalu ya coprime. Batalu yonso yina lenda vanda kele ti kitangi mosi.

select-from-sequence-too-few-unique-values = Beto lenda sola ve batalu { $numToSelect } ya ke vutukila ve na molongo ya bunda { $numPossibleValues }

select-prime-numbers-too-few-values = Beto lenda sola ve batalu { $numToSelect } na molongo ya bantalu ya prime ya bunda { $numValues }

select-prime-numbers-values-count-mismatch = Ntalu ya batalu ya me tulama sambu na select fwete wakana ti ntalu ya kusola

select-prime-numbers-values-not-prime = Batalu yonso ya me tulama sambu na select prime number fwete vanda na molongo ya bantalu ya prime

select-prime-numbers-values-excluded-combination = Batalu ya me tulama ya selectPrimeNumbers vandaka kuvukisa ya me katuka

select-prime-numbers-excluded-too-many-combinations = Beto me katula bakuvukisa kuluta 70% na selectPrimeNumbers

select-random-combination-fluke = Na diambu yina lenda salama ve mpenza, beto me kuka ve kusola kuvukisa ya batalu ya mpamba

select-random-value-fluke = Na diambu yina lenda salama ve mpenza, beto me kuka ve kusola talu ya mpamba
