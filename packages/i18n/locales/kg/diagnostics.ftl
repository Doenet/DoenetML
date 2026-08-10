# Kongo diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] { $attributes } yivezwanga kana nsuka zole zatelwa
       *[other] { $attributes } byivezwanga kana nsuka zole zatelwa
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } yivezwanga kana nsuka ye kati byatelwa byonso
       *[other] { $attributes } byivezwanga kana nsuka ye kati byatelwa byonso
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset kena mfunu ve kana kati kena ve

## `<line>`

line-points-undetermined-dimensions = Nsinga wa matona mana nene yawu kazabakene ko.

line-points-too-few-dimensions = Nsinga fweti vyoka matona ma nene zole na kunsi.

line-points-depend-on-variables = Nsinga wa matona mana kwendaka na bina bisobanga: { $variables }.

line-equation-invalid-format = Mpila yambi ya kifwanisu kya nsinga mu { $variable1 } ye { $variable2 }.

## `<ray>`

ray-overprescribed-through = Nsemo yatelwa kwa through, endpoint ye direction.  Through yatelwa yivezwanga.

ray-dimension-mismatch = numDimensions kafwanani ve mu nsemo.

## `<vector>`

vector-overprescribed-head = Vektele yatelwa kwa head, tail ye displacement.  Head yatelwa yivezwanga.

vector-dimension-mismatch = numDimensions kafwanani ve mu vektele.

## Attracting and constraining

attract-to-without-nearest-point = Kilendi benda na `<{ $component }>` ko kadi kena ye nearestPoint ve.

constrain-to-without-nearest-point = Kilendi kanga na `<{ $component }>` ko kadi kena ye nearestPoint ve.

constrain-to-interior-without-nearest-point = Kilendi kanga na kati kwa `<{ $component }>` ko kadi kena ye nearestPoint ve.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition yivezwanga mu choiceInput yina ya inline ve

## Ordering children by index

choice-input-indices-count-mismatch = Indices zatelwa mu choiceInput zivezwanga kadi ntalu ya indices kafwanani ve ye ntalu ya bana ba choice.

pretzel-indices-count-mismatch = Indices zatelwa mu problem zivezwanga kadi ntalu ya indices kafwanani ve ye ntalu ya bana ba problem.

shuffle-indices-count-mismatch = Indices zatelwa mu shuffle zivezwanga kadi ntalu ya indices kafwanani ve ye ntalu ya bima.

indices-ignored-out-of-range = Indices zatelwa mu { $component } zivezwanga kadi zankaka zina ku nganda ya nzila.

pretzel-indices-repeated = Indices zatelwa mu pretzel zivezwanga kadi zankaka zavutukila.

pretzel-circuit-first-index = Indices zatelwa mu pretzel mu mode="circuit" zivezwanga kadi index yantete fweti vwanda 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Sambu `<{ $component }>` yisala ye bana ba string, attribute `type` fweti telwa.

invalid-type-defaulting-to-math = Type yambi { $type } mu kima { $component }. Fweti vwanda mosi mu math, text, number, to boolean. Kwenda na math.

string-not-valid-component-to-arrange = String "{ $value }" kena kima kyambote ve sambu na { $component }. Yivezwanga.

## Types and variables

invalid-type-defaulting-to-number = Type yambi { $type }, type yitulwa na number.

invalid-variable-value = Ntalu yambi ya kima kisobanga: `{ $value }`

## Variants

variant-index-must-be-number = Index ya mpila { $index } fweti vwanda ntalu

variant-index-must-be-integer = Index ya mpila { $index } fweti vwanda ntalu yamvimba

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` yasalwa ve mu bitezo bya kimosi. Bunene bwatulwa na kifwani.

side-by-side-absolute-margins = `<{ $component }>` yasalwa ve mu bitezo bya kimosi. Ndilu zatulwa na kifwani.

side-by-side-no-block-child = `<{ $component }>` yambi: yifweti vwanda ti mwana mosi ya block na kunsi.

## `<label>`

label-for-ignored-on-graphical = Attribute `for` va `<label>` ya kifwanisu yivezwanga.

label-for-must-resolve-to-one = Attribute `for` va `<label>` fweti kwenda na kima kimosi kaka.

label-for-unresolved = Attribute `for` va `<label>` kalendi kwenda na kima ko.

label-for-answer-with-authored-inputs = Attribute `for` va `<label>` yitubila `<answer>` yina ye inputs zasonikwa; tubila input kibeni.

label-for-answer-without-input = Attribute `for` va `<label>` yitubila `<answer>` yina kena ye input ya kutula nkumbu ve.

label-for-must-reference-input-or-answer = Attribute `for` va `<label>` fweti tubila input to answer.

## Accessibility

accessibility-short-description-or-decorative = Sambu na nswalu, `<{ $component }>` fweti vwanda ye nsasa yankufi to yatelwa bonso decorative.

accessibility-video-short-description = Sambu na nswalu, `<video>` fweti vwanda ye nsasa yankufi.

accessibility-input-short-description-or-label = Sambu na nswalu, `<{ $component }>` fweti vwanda ye nsasa yankufi to nkumbu.

accessibility-answer-input-short-description-or-label = Sambu na nswalu, `<answer>` yina yisalanga input fweti vwanda ye nsasa yankufi to nkumbu.

accessibility-short-description-contains-math = Nsasa zankufi kafweti vwanda ye bima bya mitangu bonso `<{ $component }>` ve. Sonika mitangu mu mambu.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kena ye luswaswanu lwafwana ve mu mambu ma ntu wa kitini (mode ya mpimpa) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; yifweti { $threshold }:1 na kunsi).
       *[other] { $colorName } kena ye luswaswanu lwafwana ve mu mambu ma ntu wa kitini ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; yifweti { $threshold }:1 na kunsi).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` yavyoka matona { $count } yasalwa ve kana matona mena ye mitangu ve.

circle-too-many-through-points = Kilendi tanga kizunga kyavyoka matona kuluta 3 ko.

circle-overprescribed-radius-center-points = Kilendi tanga kizunga ye radius, kati ye matona byonso byatelwa ko.

circle-center-with-multiple-points = Kilendi tanga kizunga ye kati kyatelwa kyavyoka tona kuluta 1 ko.

circle-radius-too-small = Kilendi tanga kizunga ko: ntama ya kati kwa matona zole kele { $distance }, radius yatelwa { $radius } kele yafyoti kibeni.

circle-radius-with-many-points = Kilendi sala kizunga kyavyoka matona kuluta zole ye radius yatelwa ko.

circle-invalid-center-or-through-points = Kati to matona ma kizunga mambi.

circle-radius-center-with-multiple-points = Kilendi tanga radius ya kizunga ye kati kyatelwa kyavyoka tona kuluta 1 ko.

circle-change-radius-non-numerical = Kilendi soba radius ya kizunga ye matona mana ye mitangu ve ko

circle-radius-with-points-non-numerical = Kilendi sala kizunga kyavyoka tona kuluta mosi ye radius yatelwa kana mitangu kena ve ko.

circle-change-center-non-numerical = Kusoba kati kya kizunga kyavyoka matona mana ye mitangu ve yasalwa ve.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Bunene bwafwana ve mu domain ya fonksio. Domain yina ye ntangu { $intervals } kansi fonksio yina ye { $inputs ->
            [one] input { $inputs }
           *[other] inputs { $inputs }
        }.
       *[other] Bunene bwafwana ve mu domain ya fonksio. Domain yina ye bintangu { $intervals } kansi fonksio yina ye { $inputs ->
            [one] input { $inputs }
           *[other] inputs { $inputs }
        }.
    }

function-domain-invalid-format = Mpila yambi ya domain ya fonksio.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Kuveza bunene bwa fonksio bwina ye ntalu ve.
        [minimum] Kuveza bufyoti bwa fonksio bwina ye ntalu ve.
        [extremum] Kuveza nsuka ya fonksio yina ye ntalu ve.
        [point] Kuveza tona kya fonksio kyina ye ntalu ve.
        [slope] Kuveza nsengoloko ya fonksio yina ye ntalu ve.
       *[other] Kuveza { $type } ya fonksio yina ye ntalu ve.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Kuveza bunene bwa fonksio bwina bwampamba.
        [minimum] Kuveza bufyoti bwa fonksio bwina bwampamba.
        [extremum] Kuveza nsuka ya fonksio yina yampamba.
        [point] Kuveza tona kya fonksio kyina kyampamba.
       *[other] Kuveza { $type } ya fonksio yina yampamba.
    }

function-points-too-close = Fonksio yina ye matona zole mana pene-pene kibeni. Kilendi tela fonksio ko.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Mavutukilu ma fonksio malenda kaka kana ntalu ya inputs yifwanana ye ntalu ya outputs. Fonksio yayi yina ye input { $inputs } ye { $outputs ->
            [one] output { $outputs }
           *[other] outputs { $outputs }
        }.
       *[other] Mavutukilu ma fonksio malenda kaka kana ntalu ya inputs yifwanana ye ntalu ya outputs. Fonksio yayi yina ye inputs { $inputs } ye { $outputs ->
            [one] output { $outputs }
           *[other] outputs { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Bunda bwambi bwa sequence.  Fweti vwanda ntalu yamvimba yina ya nsi ya nulu ve.

sequence-invalid-step = Step yambi ya sequence.  Fweti vwanda ntalu mu sequence ya type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" yambi ya sequence ya number.  Fweti vwanda ntalu.

sequence-invalid-endpoint-letters = "{ $attribute }" yambi ya sequence ya letters.  Fweti vwanda ndonga ya bisono.

sequence-invalid-endpoint = "{ $attribute }" yambi ya sequence.

select-from-sequence-coprime-not-numbers = coprime yivezwanga kadi mitangu misolwanga ve

select-from-sequence-coprime-with-exclude-combinations = coprime yivezwanga kadi excludeCombinations yatelwa

## Resolving a `target`

target-not-found = Target yambi mu `<{ $source }>`: kilendi mona target ko.

target-state-variable-not-found = Target yambi mu `<{ $source }>`: kilendi mona kitini kya nkumbu "{ $property }" va `<{ $component }>` ko.

## `<odeSystem>`

ode-system-variables-match-independent = Bisobanga bya `<odeSystem>` fweti swaswana ye kisobanga kya kimpwanza.

ode-system-duplicate-variable-names = Kilendi tela fonksio za RHS za ODE ye nkumbu zavutukila ko.

ode-system-rhs-function-error = Kilendi tela fonksio ya RHS ya ODE ko.  Mbi mu kusala fonksio ya mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Kilendi tela kona kati kwa nsinga { $count } ko

angle-invalid-through-point = Tona kyambi mu through ya `<angle>`

parabola-vertex-too-many-points = Palabole ye vertex yavyoka tona kuluta 1 yasalwa ve.

parabola-too-many-points = Palabole yavyoka matona kuluta 3 yasalwa ve.

intersection-too-many-items = Ndwakanu ya bima kuluta zole yasalwa ve

## Other math components

ionic-compound-not-two-ions = Kivukanu kya ioni kya bima yankaka ke ioni zole yasalwa ve.

ionic-compound-needs-cation-and-anion = Kivukanu kya ioni kyasalwa kaka mu cation mosi ye anion mosi.

solve-equations-cannot-evaluate = Kilendi sukisa kifwanisu ko kadi kilendi tanga kifwanisu ko: { $equation }

math-operators-operand-number-required = Fweti tela operandNumber kana yikatula operand ya mitangu.

eigen-decomposition-failed = Kilendi tanga bitangu bya kimeneka bya matelese ko

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } kena mu kifwani ve, yo yifwanana ntangu yonso ye kima kyampamba.
       *[other] `<matchesPattern>`: parameters { $parameters } byena mu kifwani ve, byo bifwanana ntangu yonso ye kima kyampamba.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: kilendi bakisa grid="{ $grid }" ko. Fweti vwanda none, medium, dense, to mitangu zole ya nene yakabulwa na fulu, bonso grid="1 0.5". Grid yisonwa ve.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" yatambulwa ve mu nsongi prefigure; kifwani kya lweke lwa kimalata kyisadilwa.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" yatambulwa ve mu nsongi prefigure; kifwani kya zulu kyisadilwa.

prefigure-invalid-axis-bounds = `<graph>`: ndilu zambi za axis mu prefigure; bbox ya kimenga (-10,-10,10,10) yisadilwa.

prefigure-invalid-width = `<graph>`: bunene bwambi mu prefigure; bunene bwa kimenga 425 bwisadilwa.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio yambi mu prefigure; aspect ratio ya kimenga 1 yisadilwa.

prefigure-grid-spacing-too-fine = `<graph>`: mpasukusu ya grid kele yafyoti kibeni mu ndilu za axis; grid yikatulwa mu nsongi prefigure.

prefigure-annotations-not-rendered = `<graph>`: mansonokono kasonwa ve kana nsongi PreFigure kasadilwa ve.

multiple-annotations-children = Bana ba `<annotations>` bawombo bamonana mu `<graph>`; bonso ke yandi ya nsuka bivezwanga.

## Referring to other components

copy-unrecognized-component-type = Kilendi yikula to kopiya mpila ya kima yizabakene ko: { $type }.

copy-prop-not-found = Kilendi mona prop { $property } va kima kya mpila { $component } ko

collect-no-source = Nto yamonana ve mu collect.

collect-invalid-component-type = Kilendi vukisa bima bya mpila `<{ $component }>` ko kadi kele mpila yambi.

reference-index-unavailable = Kilendi tubila index `{ $reference }` ko

## `<callAction>`

component-action-unavailable = Kilendi bokila { $action } va kima `{ $reference }` ko

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Nsangu zina ye mpila yambi.  Nkonso zina ye bunda bwaswaswana. Byamonana mu componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Nsangu zina ye nkumbu za ntandu zavutukila.  Byamonana mu componentIdx :{ $componentIdx }

data-frame-missing-column-name = Nsangu zikonda nkumbu ya ntandu.  Byamonana mu componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award ya mvutu yayi yina yatulama va mvutu ya answer tag yandi kibeni, yo yitwala mambu makaka.

answer-max-num-attempts-in-section-wide-check-work = Kutula `maxNumAttempts` va `<answer>` na kati kwa kima ye `sectionWideCheckWork` kena mfunu ve, kadi ntalu ya bintonta yitwadiswa kwa kima kina. Tula `maxNumAttempts` va kima kina.

nested-section-wide-check-work-max-num-attempts = Kutula `maxNumAttempts` va kima ye `sectionWideCheckWork` kina na kati kwa kima kyankaka ye `sectionWideCheckWork` kena mfunu ve, kadi ntalu ya bintonta yitwadiswa kwa kima kya nganda. Tula `maxNumAttempts` va kima kya nganda.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attribute { $attributes } kena ye mfunu ve kana symbolicEquality yatulwa ve.
       *[other] Attributes { $attributes } byena ye mfunu ve kana symbolicEquality yatulwa ve.
    }

answer-invalid-type = Type yambi mu mvutu: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Kadi kima `<{ $component }>` kena ye nkumbu ve, kilendi sadilwa bonso attribute ya module ko

module-attribute-name-already-defined = Kima `<{ $component } name="{ $name }">` kilendi sadilwa bonso attribute ya module ko kadi mpila `<module>` yina ntete ye attribute "{ $name }".

conditional-content-condition-ignored = Attribute `condition` yivezwanga va `<conditionalContent>` yina ye bana ba case to else.

slider-markers-type-mismatch = Type ya markers kafwanani ve ye type ya slider.

pretzel-problem-needs-statement-and-answer = Pretzel yambi: konso `<problem>` fweti vwanda ye `<statement>` mosi ye `<answer>` mosi.

pretzel-circuit-first-problem-distractor = Pretzel yambi: mu mode="circuit", `<problem>` yantete kalendi vwanda distractor ve.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ntalu yambi { $values } mu attribute `{ $attribute }`; yivezwanga.
       *[other] Ntalu zambi { $values } mu attribute `{ $attribute }`; zivezwanga.
    }

attribute-must-be-references = Ntalu yambi `{ $value }` mu attribute `{ $attribute }`. Attribute fweti vwanda ye bantinu bina biyantika ye `$`.

math-input-invalid-function-names = <mathInput>: nkumbu zambi za fonksio zivezwanga mu { $attribute }: { $names }. Konso nkumbu fweti vwanda ye bisono 2 na kunsi (bisono to bindilu); `|<mathspeak alternative>` yilenda landa.

## Building components from the source

component-type-invalid = Mpila yambi ya kima: `<{ $componentType }>`

attribute-repeated = Kilendi vutukila attribute { $attribute } ko.

attribute-invalid-for-component = Attribute yambi "{ $attribute }" mu kima kya mpila `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Nsasa ya mpila { $styleNumber } yina ye luswaswanu lwafwana ve mu { $context ->
        [text-on-background] mbala ya mambu va mbala ya nima
        [high-contrast] mbala ya luswaswanu lwanene va kanevasi
        [line] mbala ya nsinga va kanevasi
        [marker] mbala ya sinsu va kanevasi
       *[text-on-canvas] mbala ya mambu va kanevasi
    }{ $mode ->
        [dark] { " (mode ya mpimpa)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; yifweti { $threshold }:1 na kunsi).

style-definition-dark-mode-text-background-contrast =
    Ata nsasa ya mpila { $styleNumber } yina ye mbala zina ye luswaswanu lwafwana mu mode ya mwinda, mbala za mode ya mpimpa zabakwa na zawu zina ye luswaswanu lwafwana ve kati kwa mbala ya mambu ye mbala ya nima ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; yifweti { $threshold }:1 na kunsi). { $suggestion ->
        [available] Sambu na luswaswanu lwafwana mu mode ya mpimpa, yikula luswaswanu lwa mode ya mwinda (mu kifwani, tula { $lightAttribute }="{ $lightColor }") to soba mbala ya mode ya mpimpa (mu kifwani, tula { $darkAttribute }="{ $darkColor }").
       *[none] Sambu na luswaswanu lwafwana mu mode ya mpimpa, yikula luswaswanu lwa mode ya mwinda to soba mbala zabakwa ye textColorDarkMode to backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ata nsasa ya mpila { $styleNumber } yina ye mbala ya mambu yina ye luswaswanu lwafwana mu mode ya mwinda, mbala ya mambu ya mode ya mpimpa yabakwa na yawu yina ye luswaswanu lwafwana ve va kanevasi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; yifweti { $threshold }:1 na kunsi). { $suggestion ->
        [available] Sambu na luswaswanu lwafwana mu mode ya mpimpa, yikula luswaswanu lwa mode ya mwinda (mu kifwani, tula textColor="{ $lightColor }") to soba mbala ya mode ya mpimpa (mu kifwani, tula textColorDarkMode="{ $darkColor }").
       *[none] Sambu na luswaswanu lwafwana mu mode ya mpimpa, yikula luswaswanu lwa mode ya mwinda to soba mbala yabakwa ye textColorDarkMode.
    }

section-multiple-style-palettes = Kitini kilenda sola kaka <stylePalette> mosi; yandi ya nsuka yisadilwa.

## Unique variants

variant-num-to-select-not-non-negative-integer = kilendi zaba mpila zaswaswana za { $component } ko kadi numToSelect kena ntalu yamvimba yina ya nsi ya nulu ve ko.

variant-num-to-select-not-constant-number = kilendi zaba mpila zaswaswana za { $component } ko kadi numToSelect kena ntalu yasoba ve ko.

variant-with-replacement-not-constant-boolean = kilendi zaba mpila zaswaswana za { $component } ko kadi withReplacement kena boolean yasoba ve ko.

variant-select-weight-disables-unique = Mpila zaswaswana za select zikangwa kana option yina ye selectWeight to selectForVariants yatelwa

variant-coprime-undetermined = kilendi zaba mpila zaswaswana za { $component } ko kadi kilendi zaba nde coprime kele luvunu ntangu yonso ko.

variant-attribute-not-constant = kilendi zaba mpila zaswaswana za { $component } ko kadi { $attribute } kasobaka ve ko.

variant-attribute-not-number = kilendi zaba mpila zaswaswana za { $component } ko kadi { $attribute } kena ntalu ve.

variant-attribute-wrong-type-for-sequence =
    kilendi zaba mpila zaswaswana za { $component } ya type { $type } ko kadi { $attribute } kena { $expected ->
        [letters-combination] ndonga ya bisono
        [math-expression] mvovo wambote wa mitangu
        [integer] ntalu yamvimba
       *[number] ntalu
    } ve.

variant-length-not-integer = kilendi zaba mpila zaswaswana za { $component } ko kadi length kena ntalu yamvimba ve.

variant-sort-not-implemented = mpila zaswaswana za { $component } ye sort zasalwa ve

variant-exclude-combinations-not-implemented = mpila zaswaswana za { $component } ye excludeCombinations zasalwa ve

variant-math-exclude-not-implemented = mpila zaswaswana za { $component } ya type math ye exclude zasalwa ve

variant-non-constant-exclude-not-implemented = mpila zaswaswana za { $component } ye exclude yasobanga zasalwa ve

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: yatambulwa ve mu nsongi prefigure ya graph; mwana yavyokwa.

prefigure-descendant-invalid-geometry = { $subject }: mpila ya kimalata yina yampamba to yalunga ve; mwana yavyokwa.

prefigure-curve-label-omitted = { $subject }: nkumbu zatambulwa ve va bima bya curve byasobwa; nkumbu yavyokwa.

prefigure-curve-unsupported-definition-type = { $subject }: mpila ya nsasa ya curve '{ $definitionType }' yatambulwa ve; mwana yavyokwa.

prefigure-region-flip-functions-unsupported = { $subject }: attribute flipFunctions va regionBetweenCurves yatambulwa ve; mwana yavyokwa.

prefigure-region-non-formula-child = { $subject }: kaka bana ba fonksio ya formula batambulwanga va regionBetweenCurves; mwana yavyokwa.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' yatambulwa ve mu { $labelKind ->
        [line-family] nkumbu ya dibuta dya nsinga
       *[point] nkumbu ya tona
    }; ndwelolo ya kimenga ya PreFigure yisadilwa.

prefigure-fill-style-unsupported = { $subject }: mpila ya nzadisa '{ $fillStyle }' yatambulwa ve kwa PreFigure; nzadisa ya kimosi yisadilwa.

prefigure-line-style-unknown = { $subject }: mpila ya nsinga '{ $lineStyle }' yizabakene ko yakatulwa mu PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: mpila ya sinsu '{ $markerStyle }' yasobwa na mpila 'diamond' ya PreFigure.

prefigure-marker-style-unsupported = { $subject }: mpila ya sinsu '{ $markerStyle }' yatambulwa ve kwa PreFigure; mpila ya kimenga yisadilwa.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` yambi; kilendi mona target ko. Nsonokono yavyokwa.

annotation-ref-multiple-targets = `<annotation>`: `ref` yamonana ye ba target bawombo; ya ntete yisadilwa.

annotation-ref-outside-graph = `<annotation>`: `ref` yambi; target kena ku nganda ya graph. Nsonokono yavyokwa.

annotation-ref-unsupported-target = `<annotation>`: `ref` yambi; target kena kima kyatambulwa mu prefigure ve. Nsonokono yavyokwa.

annotation-text-missing = `<annotation>`: `text` yikonda to yampamba; mambu mampamba masonwa.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ndiakana ya kizunga yamonana.
       *[other] Ndiakana ya kizunga yamonana ye kima `<{ $componentType }>`.
    }

reference-no-referent = Kima ve kyamonana mu ntinu: `{ $reference }`

reference-multiple-referents = Bima biwombo byamonana mu ntinu: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Mpila yambi ya attribute { $attribute } ya `<{ $componentType }>`.

children-invalid = Bana bambi mu `<{ $componentType }>`: Bana bambi bamonana: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ntalu yambi `{ $value }` mu attribute `{ $attribute }`, ntalu `{ $default }` yisadilwa

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Mpila ya DoenetML { $version } yamonana ve.
       *[other] Mpila ya DoenetML { $version } yamonana ve. Kukwenda na mpila { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML yambi: { $content }

parse-tag-missing-close-tag = DoenetML yambi: Tag `{ $tag }` kena ye tag ya kukanga ve. Tag yakukanga yandi kibeni to tag `</{ $tagName }>` yifwana.

parse-tag-error = DoenetML yambi: Mbi mu tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML yambi: Attribute yambi `{ $attribute }` yimonikina bonso yikonda ntalu.

parse-attribute-invalid = DoenetML yambi: Attribute yambi `{ $attribute }`

parse-attribute-value-invalid = DoenetML yambi: Ntalu yambi ya attribute `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML yambi: Ntalu yambi ya attribute `{ $value }`. Bisinsu bya kutanga bifwanani ve. Yimonikina nde `{ $quote }` yikonda

parse-open-tag-name-missing = DoenetML yambi: Tag yikonda nkumbu yamonana, bonso `<`

parse-tag-not-closed = DoenetML yambi: Tag `{ $tag }` yakangwa ve (`>` yimonikina bonso yikonda).

parse-self-closing-tag-name-missing = DoenetML yambi: Tag yikonda nkumbu yamonana `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML yambi: Tag `{ $tag }` yakangwa ve (`/>` yimonikina bonso yikonda).

parse-tag-invalid-attributes = DoenetML yambi: Tag `{ $tag }` kele yambote ve. Yilenda vwanda ye attributes zambi.

parse-close-tag-name-missing = DoenetML yambi: Tag ya kukanga yikonda nkumbu yamonana, bonso `</`

parse-attribute-value-unquoted = Ntalu za attribute fweti vwanda na kati kwa bisinsu bya kutanga: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML yambi: Tag ya kukanga `{ $tag }` yamonana, kansi tag ya kuzibula yamonana ve

parse-close-tag-mismatched = DoenetML yambi: Tag ya kukanga yifwanani ve. `</{ $expected }>` yavingilwa. `{ $found }` yamonana

parser-node-unconvertible = Kilendi soba node { $node } na node ya Dast ko.

## Names

name-attribute-invalid =
    Nkumbu yambi name='{ $name }'. { $reason ->
        [characters] Nkumbu zilenda vwanda kaka ye bisono, mitangu, bindilu bya nsi to bindilu.
       *[start] Nkumbu fweti yantika ye kisono.
    }

component-name-invalid-start = Nkumbu yambi ya kima "{ $name }". Nkumbu fweti yantika ye kisono.

## `<answer>` sugar

answer-video-watched-missing-video = Answer ya type videoWatched fweti vwanda ye attribute video

answer-video-watched-video-not-reference = Answer ya type videoWatched fweti vwanda ye attribute video yina ntinu

answer-name-not-single-text = Attribute name ya answer fweti vwanda ye mwana mosi ya text

## Referencing another document

external-doenetml-recursion-limit = Kilendi baka DoenetML ya nganda ko kadi mavutukilu mena mawombo kibeni. Ntinu wa kizunga wina?

external-doenetml-unavailable = Kilendi baka DoenetML na { $attribute }="{ $uri }" ko

external-doenetml-type-mismatch = DoenetML yambi yabakwa na { $attribute }="{ $uri }": yifwanani ve ye mpila ya kima "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` yavezwa; sadila `{ $to }`.
       *[other] [deprecation] Attribute `{ $from }` va `<{ $component }>` yavezwa; sadila `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` yavezwa ye yivezwanga kadi `{ $to }` yatelwa mpi.
       *[other] [deprecation] Attribute `{ $from }` va `<{ $component }>` yavezwa ye yivezwanga kadi `{ $to }` yatelwa mpi.
    }

deprecated-attribute-ignored = [deprecation] Attribute `{ $attribute }` va `<{ $component }>` yavezwa ye yivezwanga.

deprecated-attribute-to-child = [deprecation] Attribute `{ $attribute }` va `<{ $component }>` yavezwa; sadila mwana `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Ntalu `{ $value }` ya attribute `{ $attribute }` va `<{ $component }>` yavezwa; sadila `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` yilenda kaka kitula mambu ma Kingelesi mu buwombo, yo yina mambu mandi mabikala bonso mu mukanda wasonikwa mu { $locale }. Sonika mpila ya buwombo kibeni, to tula yo ye attribute `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Kima `<{ $tag }>` kena kima kya Doenet kizabakene ko.

schema-element-not-allowed-at-root = Kima `<{ $tag }>` kitambulwanga ve va zulu kya mukanda.

schema-element-not-allowed-inside = Kima `<{ $tag }>` kitambulwanga ve na kati kwa `<{ $parent }>`.

schema-attribute-unrecognized = Kima `<{ $tag }>` kena ye attribute ya nkumbu `{ $attribute }` ve.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attribute `{ $attribute }` ya kima `<{ $tag }>` fweti vwanda nkanda ya bitini bina konso kimosi mu: { $allowed }
       *[other] Attribute `{ $attribute }` ya kima `<{ $tag }>` fweti vwanda mosi mu: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nkumbu yambi ya mpila mu select.  Nkumbu ya mpila { $variantName } yimonana mu options { $numOptions } kansi ntalu ya kusola kele { $numToSelect }.

select-variant-name-without-options = Mpila zankaka zatelwa mu select kansi options zatelwa ve mu nkumbu ya mpila: { $variantName }.

select-variant-name-not-possible = Nkumbu ya mpila { $variantName } yatelwa mu select kena nkumbu yalenda vwanda ve.

select-too-few-options = Kilendi sola bima { $numToSelect } mu { $numOptions } kaka ko.

select-from-sequence-too-few-values = Kilendi sola ntalu { $numToSelect } mu sequence ya bunda { $length } ko.

select-from-sequence-indices-count-mismatch = Ntalu ya indices zatelwa mu select fweti fwanana ye ntalu ya kusola

select-from-sequence-indices-not-integers = Indices zonso zatelwa mu select fweti vwanda mitangu myamvimba

select-from-sequence-index-excluded = Index yatelwa ya selectfromsequence yina yakatulwa

select-from-sequence-indices-excluded-combination = Indices zatelwa za selectfromsequence zina ndonga yakatulwa

select-from-sequence-coprime-not-positive-integers = Kilendi sola ndonga za coprime ko kadi mitangu myamvimba mya zulu ya nulu misolwanga ve.

select-from-sequence-coprime-common-factor = Kilendi sola mitangu mya coprime ko. Mitangu myonso myalenda vwanda mina ye kifwani kya kimosi. (Ntalu zatelwa za "from" to "to" fweti vwanda coprime ye "step".)

select-from-sequence-coprime-single-number = Kilendi sola ndonga za coprime mu ntalu mosi yina kele 1 ve ko.

select-from-sequence-excluded-too-many-combinations = Kuluta 70% ya ndonga yakatulwa mu selectFromSequence

select-from-sequence-coprime-none-found = Kilendi sola mitangu mya coprime ko. Mitangu myonso myalenda vwanda mina ye kifwani kya kimosi.

select-from-sequence-too-few-unique-values = Kilendi sola ntalu { $numToSelect } zaswaswana mu sequence ya bunda { $numPossibleValues } ko

select-prime-numbers-too-few-values = Kilendi sola ntalu { $numToSelect } mu nkanda wa mitangu mya prime wa bunda { $numValues } ko

select-prime-numbers-values-count-mismatch = Ntalu ya bitangu byatelwa mu select fweti fwanana ye ntalu ya kusola

select-prime-numbers-values-not-prime = Bitangu byonso byatelwa mu select prime number fweti vwanda mu nkanda wa mitangu mya prime

select-prime-numbers-values-excluded-combination = Bitangu byatelwa bya selectPrimeNumbers byina ndonga yakatulwa

select-prime-numbers-excluded-too-many-combinations = Kuluta 70% ya ndonga yakatulwa mu selectPrimeNumbers

select-random-combination-fluke = Mu diambu dyalenda bwa ve, kilendi sola ndonga ya bitangu bya kimpwanza ko

select-random-value-fluke = Mu diambu dyalenda bwa ve, kilendi sola kitangu kya kimpwanza ko
