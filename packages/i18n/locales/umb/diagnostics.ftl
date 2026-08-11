# Umbundu diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] { $attributes } yi yepiwa eci olonelo vivali vya tukuiwa
       *[other] { $attributes } vi yepiwa eci olonelo vivali vya tukuiwa
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } yi yepiwa eci onelo lokati vya tukuiwa viosi
       *[other] { $attributes } vi yepiwa eci onelo lokati vya tukuiwa viosi
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ka yi talavaya nda okati ka ku li

## `<line>`

line-points-undetermined-dimensions = Ongoli yi pita polondimbu vina ovinene vyavyo ka vya kũlĩhĩwile.

line-points-too-few-dimensions = Ongoli yi sukila oku pita polondimbu vi kwete ovinene vivali ale valua.

line-points-depend-on-variables = Ongoli yi pita polondimbu vi kolela kolopongoloso: { $variables }.

line-equation-invalid-format = Ocituwa cekwasõla lyongoli ka ca sungulukile vu { $variable1 } la { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ondavululu ya tukuiwa la through, endpoint la direction.  Through ya tukuiwa yi yepiwa.

ray-dimension-mismatch = numDimensions ka yi likwatisa vondavululu.

## `<vector>`

vector-overprescribed-head = Vetoru ya tukuiwa la head, tail la displacement.  Head ya tukuiwa yi yepiwa.

vector-dimension-mismatch = numDimensions ka yi likwatisa vovetoru.

## Attracting and constraining

attract-to-without-nearest-point = Ka ci tẽliwa oku kokela ku `<{ $component }>` momo ka ci kwete opongoloso nearestPoint.

constrain-to-without-nearest-point = Ka ci tẽliwa oku kutika ku `<{ $component }>` momo ka ci kwete opongoloso nearestPoint.

constrain-to-interior-without-nearest-point = Ka ci tẽliwa oku kutika vokati ka `<{ $component }>` momo ka ci kwete opongoloso nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition yi yepiwa ku choiceInput ka yi kasi inline

## Ordering children by index

choice-input-indices-count-mismatch = Indices vya tukuiwa ku choiceInput vi yepiwa momo ocitalatu cindices ka ci likwatisa locitalatu comãla a choice.

pretzel-indices-count-mismatch = Indices vya tukuiwa ku problem vi yepiwa momo ocitalatu cindices ka ci likwatisa locitalatu comãla a problem.

shuffle-indices-count-mismatch = Indices vya tukuiwa ku shuffle vi yepiwa momo ocitalatu cindices ka ci likwatisa locitalatu covina.

indices-ignored-out-of-range = Indices vya tukuiwa ku { $component } vi yepiwa momo vimwe vi kasi kovilu.

pretzel-indices-repeated = Indices vya tukuiwa ku pretzel vi yepiwa momo vimwe vya lilwilwa.

pretzel-circuit-first-index = Indices vya tukuiwa ku pretzel vo mode="circuit" vi yepiwa momo index yatete yi sukila oku kala 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Oco `<{ $component }>` ci talavaye lomãla a string, `type` attribute yi sukila oku tukuiwa.

invalid-type-defaulting-to-math = Type { $type } ka ya sungulukile kocina { $component }. Yi sukila oku kala math, text, number ale boolean. Ku talavaiwa math.

string-not-valid-component-to-arrange = String "{ $value }" ka ci cina cimwe ciwa ku { $component }. Ci yepiwa.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } ka ya sungulukile, type ya tumbikiwa ku number.

invalid-variable-value = Ocina copongoloso ka ca sungulukile: `{ $value }`

## Variants

variant-index-must-be-number = Ocituwa index { $index } ci sukila oku kala ocitalatu

variant-index-must-be-integer = Ocituwa index { $index } ci sukila oku kala ocitalatu ciosi

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ka ca lingiwile kovisokiso viosi. Ovinene vya tumbikiwa kovisokiso vikwavo.

side-by-side-absolute-margins = `<{ $component }>` ka ca lingiwile kovisokiso viosi. Olonele vya tumbikiwa kovisokiso vikwavo.

side-by-side-no-block-child = `<{ $component }>` ka ca sungulukile: ci sukila oku kwata omõla umwe wa block ale valua.

## `<label>`

label-for-ignored-on-graphical = `for` attribute kocifwa `<label>` yi yepiwa.

label-for-must-resolve-to-one = `for` attribute ku `<label>` yi sukila oku enda kocina cimwe lika.

label-for-unresolved = `for` attribute ku `<label>` ka ya tẽlele oku enda kocina cimwe.

label-for-answer-with-authored-inputs = `for` attribute ku `<label>` yi popia `<answer>` yi kwete inputs vya sonehiwa; popia input muẽle.

label-for-answer-without-input = `for` attribute ku `<label>` yi popia `<answer>` ka yi kwete input.

label-for-must-reference-input-or-answer = `for` attribute ku `<label>` yi sukila oku popia input ale answer.

## Accessibility

accessibility-short-description-or-decorative = Kokupitĩla, `<{ $component }>` ci sukila oku kwata elomboloko lisukiwa ale ci tukuiwe ndeci decorative.

accessibility-video-short-description = Kokupitĩla, `<video>` ci sukila oku kwata elomboloko lisukiwa.

accessibility-input-short-description-or-label = Kokupitĩla, `<{ $component }>` ci sukila oku kwata elomboloko lisukiwa ale onduko.

accessibility-answer-input-short-description-or-label = Kokupitĩla, `<answer>` yi linga input yi sukila oku kwata elomboloko lisukiwa ale onduko.

accessibility-short-description-contains-math = Alomboloko asukiwa ka a sukila oku kwata ovina vyomatematika ndeci `<{ $component }>`. Soneha omatematika lolondaka.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ka yi kwete elitepiso lya sukila kolondaka vyosapi yonepa (mode yelaike) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ci sukila { $threshold }:1 ale valua).
       *[other] { $colorName } ka yi kwete elitepiso lya sukila kolondaka vyosapi yonepa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ci sukila { $threshold }:1 ale valua).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` yi pita polondimbu { $count } ka ya lingiwile eci olondimbu ka vi kwete ovitalatu.

circle-too-many-through-points = Ka ci tẽliwa oku sokisa ocilinganya ci pita polondimbu vya piti 3.

circle-overprescribed-radius-center-points = Ka ci tẽliwa oku sokisa ocilinganya la radius, okati kuenda olondimbu viosi.

circle-center-with-multiple-points = Ka ci tẽliwa oku sokisa ocilinganya lokati ci pita pondimbu ya piti 1.

circle-radius-too-small = Ka ci tẽliwa oku sokisa ocilinganya: momo ocitumãlo pokati kolondimbu vivali ci kasi { $distance }, radius { $radius } ya tukuiwa yi tito calua.

circle-radius-with-many-points = Ka ci tẽliwa oku linga ocilinganya ci pita polondimbu vya piti vivali la radius ya tukuiwa.

circle-invalid-center-or-through-points = Okati ale olondimbu vyocilinganya ka vya sungulukile.

circle-radius-center-with-multiple-points = Ka ci tẽliwa oku sokisa radius yocilinganya lokati ci pita pondimbu ya piti 1.

circle-change-radius-non-numerical = Ka ci tẽliwa oku pongolola radius yocilinganya lolondimbu ka vi kwete ovitalatu

circle-radius-with-points-non-numerical = Ka ci tẽliwa oku linga ocilinganya ci pita pondimbu ya piti yimwe la radius eci ovitalatu ka vi kasi.

circle-change-center-non-numerical = Epongoloko lyokati kocilinganya ci pita polondimbu ka vi kwete ovitalatu ka lya lingiwile.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ovinene vi tito calua kodomain yofunsão. Domain yi kwete otembo { $intervals } pole funsão yi kwete { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        }.
       *[other] Ovinene vi tito calua kodomain yofunsão. Domain yi kwete olotembo { $intervals } pole funsão yi kwete { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        }.
    }

function-domain-invalid-format = Ocituwa cadomain yofunsão ka ca sungulukile.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ci yepiwa ocinene cofunsão ka ci kwete ocitalatu.
        [minimum] Ci yepiwa ocitito cofunsão ka ci kwete ocitalatu.
        [extremum] Ci yepiwa onelo yofunsão ka yi kwete ocitalatu.
        [point] Ci yepiwa ondimbu yofunsão ka yi kwete ocitalatu.
        [slope] Ci yepiwa okupengula kwofunsão ka ku kwete ocitalatu.
       *[other] Ci yepiwa { $type } yofunsão ka yi kwete ocitalatu.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ci yepiwa ocinene cofunsão ka ci kwete cimwe.
        [minimum] Ci yepiwa ocitito cofunsão ka ci kwete cimwe.
        [extremum] Ci yepiwa onelo yofunsão ka yi kwete cimwe.
        [point] Ci yepiwa ondimbu yofunsão ka yi kwete cimwe.
       *[other] Ci yepiwa { $type } yofunsão ka yi kwete cimwe.
    }

function-points-too-close = Funsão yi kwete olondimbu vivali vi likwatele calua. Ka ci tẽliwa oku lomboloka funsão.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Elilwilo lyofunsão li tẽliwa lika nda ocitalatu cinputs ci likwatisa locitalatu coutputs. Funsão eyi yi kwete input { $inputs } la { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        }.
       *[other] Elilwilo lyofunsão li tẽliwa lika nda ocitalatu cinputs ci likwatisa locitalatu coutputs. Funsão eyi yi kwete inputs { $inputs } la { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Ocilamba cosequence ka ca sungulukile.  Ci sukila oku kala ocitalatu ciosi ka ci kasi kemehi lya ziro.

sequence-invalid-step = Step yosequence ka ya sungulukile.  Yi sukila oku kala ocitalatu kosequence ya type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" yosequence ya number ka ya sungulukile.  Yi sukila oku kala ocitalatu.

sequence-invalid-endpoint-letters = "{ $attribute }" yosequence ya letters ka ya sungulukile.  Yi sukila oku kala elikongelo lyovisonehua.

sequence-invalid-endpoint = "{ $attribute }" yosequence ka ya sungulukile.

select-from-sequence-coprime-not-numbers = coprime yi yepiwa momo ka ku nõliwa ovitalatu

select-from-sequence-coprime-with-exclude-combinations = coprime yi yepiwa momo excludeCombinations ya tukuiwa

## Resolving a `target`

target-not-found = Target ya `<{ $source }>` ka ya sungulukile: ka ci tẽliwa oku sanga target.

target-state-variable-not-found = Target ya `<{ $source }>` ka ya sungulukile: ka ci tẽliwa oku sanga opongoloso yonduko "{ $property }" ku `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Olopongoloso vya `<odeSystem>` vi sukila oku litepa lopongoloso ka yi kolela kucikwavo.

ode-system-duplicate-variable-names = Ka ci tẽliwa oku lomboloka ofunsão vya ODE RHS lolonduko vyolopongoloso vya lilwilwa.

ode-system-rhs-function-error = Ka ci tẽliwa oku lomboloka ofunsão ya ODE RHS.  Eviho vokulinga ofunsão ya mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ka ci tẽliwa oku lomboloka okangulu pokati kolongoli { $count }

angle-invalid-through-point = Ondimbu ka ya sungulukile vo through ya `<angle>`

parabola-vertex-too-many-points = Parabola la vertex yi pita pondimbu ya piti 1 ka ya lingiwile.

parabola-too-many-points = Parabola yi pita polondimbu vya piti 3 ka ya lingiwile.

intersection-too-many-items = Elilwatelo lyovina vya piti vivali ka lya lingiwile

## Other math components

ionic-compound-not-two-ions = Elikongelo lya ioni kovina vikwavo ka vya kala ioni vivali ka lya lingiwile.

ionic-compound-needs-cation-and-anion = Elikongelo lya ioni lya lingiwa lika ku kationi yimwe la anioni yimwe.

solve-equations-cannot-evaluate = Ka ci tẽliwa oku tetulula ekwasõla momo ka ci tẽlele oku li sokisa: { $equation }

math-operators-operand-number-required = operandNumber yi sukila oku tukuiwa eci ku pindiwa operand yomatematika.

eigen-decomposition-failed = Ka ci tẽlele oku sokisa oloeigenvalue vyomatrisi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } ka yi kasi vocifwa, kuenje yi likwatisa olonjanja viosi lokahandeleko.
       *[other] `<matchesPattern>`: parameters { $parameters } ka vi kasi vocifwa, kuenje vi likwatisa olonjanja viosi lokahandeleko.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ka ci tẽliwa oku kũlĩhĩsa grid="{ $grid }". Yi sukila oku kala none, medium, dense, ale ovitalatu vivali vi kasi kilu lya ziro vya tepiwa locitumãlo, ndeci grid="1 0.5". Ka ku lingiwa grid.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ka yi talavaya vulekisi prefigure; ku talavaiwa onele yondio.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ka yi talavaya vulekisi prefigure; ku talavaiwa onele yokilu.

prefigure-invalid-axis-bounds = `<graph>`: olonele vyaksi ka vya sungulukile ku prefigure; ku talavaiwa bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ocinene ka ca sungulukile ku prefigure; ku talavaiwa ocinene 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ka ya sungulukile ku prefigure; ku talavaiwa aspekt rasiu 1.

prefigure-grid-spacing-too-fine = `<graph>`: ocitumãlo cagrid ci tito calua kolonele vyaksi; grid yi pindiwa vulekisi prefigure.

prefigure-annotations-not-rendered = `<graph>`: annotations ka vi lekisiwa nda ka ku talavaiwa ulekisi PreFigure.

multiple-annotations-children = Kwa sangiwa omãla valua va `<annotations>` vu `<graph>`; vosi va yepiwa puãi wasulako.

## Referring to other components

copy-unrecognized-component-type = Ka ci tẽliwa oku vokiya ale oku sokisa ocituwa cocina ka ca kũlĩhĩwile: { $type }.

copy-prop-not-found = Ka ci tẽlele oku sanga prop { $property } kocina cocituwa { $component }

collect-no-source = Ka kwa sangiwile onene ku collect.

collect-invalid-component-type = Ka ci tẽliwa oku ongoluila ovina vyocituwa `<{ $component }>` momo ocituwa ka ca sungulukile.

reference-index-unavailable = Ka ci tẽliwa oku popia index `{ $reference }`

## `<callAction>`

component-action-unavailable = Ka ci tẽliwa oku vilikiya { $action } kocina `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Ocituwa covilongua ka ca sungulukile.  Olongoli vi kwete ovilamba vya litepa. Vya sangiwa ku componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Ovilongua vi kwete olonduko vyolokoluna vya lilwilwa.  Vya sangiwa ku componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ovilongua ka vi kwete onduko yokoluna.  Vya sangiwa ku componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award yetambululo eli yi kolela ketambululo lya answer tag muẽle, kuenje ci nena ovina ka vya lavuiwile.

answer-max-num-attempts-in-section-wide-check-work = Oku tumbika `maxNumAttempts` ku `<answer>` yi kasi vokati kocina ci kwete `sectionWideCheckWork` ka ci talavaya, momo ocina caco ci tenda ocitalatu calilongiso. Tumbika `maxNumAttempts` kocina caco.

nested-section-wide-check-work-max-num-attempts = Oku tumbika `maxNumAttempts` kocina ci kwete `sectionWideCheckWork` kuenda ci kasi vokati kocina cikwavo ci kwete `sectionWideCheckWork` ka ci talavaya, momo ocina cokwenda ci tenda ocitalatu calilongiso. Tumbika `maxNumAttempts` kocina cokwenda.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] { $attributes } attribute ka yi talavaya nda symbolicEquality ka ya tumbikiwile.
       *[other] { $attributes } attributes ka vi talavaya nda symbolicEquality ka ya tumbikiwile.
    }

answer-invalid-type = Type yetambululo ka ya sungulukile: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Momo ocina `<{ $component }>` ka ci kwete onduko, ka ci tẽliwa oku ci talavaya ndeci module attribute

module-attribute-name-already-defined = Ka ci tẽliwa oku talavaya ocina `<{ $component } name="{ $name }">` ndeci attribute ya module momo `<module>` yi kwete ale "{ $name }" attribute.

conditional-content-condition-ignored = `condition` attribute yi yepiwa ku `<conditionalContent>` yi kwete omãla a case ale else.

slider-markers-type-mismatch = Type ya markers ka yi likwatisa la type ya slider.

pretzel-problem-needs-statement-and-answer = Pretzel ka ya sungulukile: `<problem>` yosi yi sukila oku kwata `<statement>` yimwe la `<answer>` yimwe.

pretzel-circuit-first-problem-distractor = Pretzel ka ya sungulukile: vo mode="circuit", `<problem>` yatete ka yi tẽliwa oku kala distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ocina { $values } ka ca sungulukile ku attribute `{ $attribute }`; ci yepiwa.
       *[other] Ovina { $values } ka vya sungulukile ku attribute `{ $attribute }`; vi yepiwa.
    }

attribute-must-be-references = Ocina `{ $value }` ka ca sungulukile ku attribute `{ $attribute }`. Attribute yi sukila oku kala olondaka vi fetika la `$`.

math-input-invalid-function-names = <mathInput>: olonduko vyofunsão ka vya sungulukile vi yepiwa vu { $attribute }: { $names }. Onduko yosi onepa yayo yokulekisa yi sukila ovisonehua vivali ale valua (ovisonehua ale olofeni); `|<mathspeak alternative>` yi pondola oku kwãma.

## Building components from the source

component-type-invalid = Ocituwa cocina ka ca sungulukile: `<{ $componentType }>`

attribute-repeated = Ka ci tẽliwa oku lilwila attribute { $attribute }.

attribute-invalid-for-component = Attribute "{ $attribute }" ka ya sungulukile kocina cocituwa `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Elomboloko lyocituwa { $styleNumber } ka li kwete elitepiso lya sukila ku { $context ->
        [text-on-background] osoka yolondaka konyima yosoka yokonyima
        [high-contrast] osoka yelitepiso linene kokanvasi
        [line] osoka yongoli kokanvasi
        [marker] osoka yondimbu kokanvasi
       *[text-on-canvas] osoka yolondaka kokanvasi
    }{ $mode ->
        [dark] { " (mode yelaike)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ci sukila { $threshold }:1 ale valua).

style-definition-dark-mode-text-background-contrast =
    Ndaño okuti elomboloko lyocituwa { $styleNumber } li kwete olosoka vi kwete elitepiso lya sukila ku mode yocinyi, olosoka vya mode yelaike vya tundila kokwavo ka vi kwete elitepiso lya sukila pokati kosoka yolondaka losoka yokonyima ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ci sukila { $threshold }:1 ale valua). { $suggestion ->
        [available] Oco ku kale elitepiso lya sukila ku mode yelaike, vokiya elitepiso lya mode yocinyi (ndeci, tumbika { $lightAttribute }="{ $lightColor }") ale pongolola osoka ya mode yelaike (ndeci, tumbika { $darkAttribute }="{ $darkColor }").
       *[none] Oco ku kale elitepiso lya sukila ku mode yelaike, vokiya elitepiso lya mode yocinyi ale pongolola olosoka la textColorDarkMode ale backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ndaño okuti elomboloko lyocituwa { $styleNumber } li kwete osoka yolondaka yi kwete elitepiso lya sukila ku mode yocinyi, osoka yolondaka ya mode yelaike ya tundila kokwayo ka yi kwete elitepiso lya sukila kokanvasi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ci sukila { $threshold }:1 ale valua). { $suggestion ->
        [available] Oco ku kale elitepiso lya sukila ku mode yelaike, vokiya elitepiso lya mode yocinyi (ndeci, tumbika textColor="{ $lightColor }") ale pongolola osoka ya mode yelaike (ndeci, tumbika textColorDarkMode="{ $darkColor }").
       *[none] Oco ku kale elitepiso lya sukila ku mode yelaike, vokiya elitepiso lya mode yocinyi ale pongolola osoka la textColorDarkMode.
    }

section-multiple-style-palettes = Onepa yi pondola oku nõla lika <stylePalette> yimwe; ku talavaiwa yasulako.

## Unique variants

variant-num-to-select-not-non-negative-integer = ka ci tẽliwa oku kũlĩhĩsa ovituwa vya litepa vya { $component } momo numToSelect ka ci citalatu ciosi ka ci kasi kemehi lya ziro.

variant-num-to-select-not-constant-number = ka ci tẽliwa oku kũlĩhĩsa ovituwa vya litepa vya { $component } momo numToSelect ka ci citalatu ka ci pongoloka.

variant-with-replacement-not-constant-boolean = ka ci tẽliwa oku kũlĩhĩsa ovituwa vya litepa vya { $component } momo withReplacement ka ya boolean ka yi pongoloka.

variant-select-weight-disables-unique = Ovituwa vya litepa vya select vi yikiwa nda option yimwe yi kwete selectWeight ale selectForVariants

variant-coprime-undetermined = ka ci tẽliwa oku kũlĩhĩsa ovituwa vya litepa vya { $component } momo ka ci tẽliwa oku kũlĩhĩsa nda coprime yi kala uhembi olonjanja viosi.

variant-attribute-not-constant = ka ci tẽliwa oku kũlĩhĩsa ovituwa vya litepa vya { $component } momo { $attribute } yi pongoloka.

variant-attribute-not-number = ka ci tẽliwa oku kũlĩhĩsa ovituwa vya litepa vya { $component } momo { $attribute } ka ci citalatu.

variant-attribute-wrong-type-for-sequence =
    ka ci tẽliwa oku kũlĩhĩsa ovituwa vya litepa vya { $component } yocituwa { $type } momo { $attribute } ka ya { $expected ->
        [letters-combination] elikongelo lyovisonehua
        [math-expression] ondaka yomatematika ya sunguluka
        [integer] ocitalatu ciosi
       *[number] ocitalatu
    }.

variant-length-not-integer = ka ci tẽliwa oku kũlĩhĩsa ovituwa vya litepa vya { $component } momo length ka ci citalatu ciosi.

variant-sort-not-implemented = ovituwa vya litepa vya { $component } la sort ka vya lingiwile

variant-exclude-combinations-not-implemented = ovituwa vya litepa vya { $component } la excludeCombinations ka vya lingiwile

variant-math-exclude-not-implemented = ovituwa vya litepa vya { $component } yotype math la exclude ka vya lingiwile

variant-non-constant-exclude-not-implemented = ovituwa vya litepa vya { $component } la exclude yi pongoloka ka vya lingiwile

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ka ci talavaya vulekisi prefigure wograph; omõla wa yepiwa.

prefigure-descendant-invalid-geometry = { $subject }: jiometria ka ya sungulukile ale ka ya tẽlisiwile; omõla wa yepiwa.

prefigure-curve-label-omitted = { $subject }: olonduko ka vi talavaya kovina vya curve vya pongololwa; onduko ya pindiwa.

prefigure-curve-unsupported-definition-type = { $subject }: ocituwa celomboloko lyofunsão ya curve '{ $definitionType }' ka ci talavaya; omõla wa yepiwa.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions attribute ku regionBetweenCurves ka yi talavaya; omõla wa yepiwa.

prefigure-region-non-formula-child = { $subject }: omãla ofunsão vyocituwa formula lika va talavaya ku regionBetweenCurves; omõla wa yepiwa.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ka yi talavaya ku { $labelKind ->
        [line-family] onduko yepata lyolongoli
       *[point] onduko yondimbu
    }; ku talavaiwa esokiso lya PreFigure.

prefigure-fill-style-unsupported = { $subject }: PreFigure ka yi kũlĩhĩle ocituwa cokuyukisa '{ $fillStyle }'; ku talavaiwa okuyukisa kwosi.

prefigure-line-style-unknown = { $subject }: ocituwa congoli '{ $lineStyle }' ka ca kũlĩhĩwile, kuenje ca pindiwa ku PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: ocituwa condimbu '{ $markerStyle }' ca pongololwa kocituwa 'diamond' ca PreFigure.

prefigure-marker-style-unsupported = { $subject }: PreFigure ka yi kũlĩhĩle ocituwa condimbu '{ $markerStyle }'; ku talavaiwa ocituwa ci kasi tete.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ka ya sungulukile; ka ci tẽliwa oku sanga target. Annotation ya pindiwa.

annotation-ref-multiple-targets = `<annotation>`: `ref` ya sanga ovitarjeti vyalua; ku talavaiwa catete.

annotation-ref-outside-graph = `<annotation>`: `ref` ka ya sungulukile; target yi kasi kovilu ka graph. Annotation ya pindiwa.

annotation-ref-unsupported-target = `<annotation>`: `ref` ka ya sungulukile; target ka ci cina cocifwa ci talavaya vo prefigure. Annotation ya pindiwa.

annotation-text-missing = `<annotation>`: `text` ka yi kasi ale ka yi kwete cimwe; ku sonehiwa olondaka ka vi kwete cimwe.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kwa sangiwa elikolelo lyocilinganya.
       *[other] Kwa sangiwa elikolelo lyocilinganya locina `<{ $componentType }>`.
    }

reference-no-referent = Ka kwa sangiwile cimwe kondaka: `{ $reference }`

reference-multiple-referents = Kwa sangiwa ovina vyalua kondaka: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ocituwa ca attribute { $attribute } ya `<{ $componentType }>` ka ca sungulukile.

children-invalid = Omãla va `<{ $componentType }>` ka va sungulukile: Kwa sangiwa omãla ka va sungulukile: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ocina `{ $value }` ka ca sungulukile ku attribute `{ $attribute }`, ku talavaiwa `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ka kwa sangiwile ocitumbu ca DoenetML { $version }.
       *[other] Ka kwa sangiwile ocitumbu ca DoenetML { $version }. Ku talavaiwa ocitumbu { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ka ya sungulukile: { $content }

parse-tag-missing-close-tag = DoenetML ka ya sungulukile: Tag `{ $tag }` ka yi kwete tag yokuyika. Ku lavuiwile tag yi liyika muẽle ale tag `</{ $tagName }>`.

parse-tag-error = DoenetML ka ya sungulukile: Eviho vu tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ka ya sungulukile: Attribute `{ $attribute }` ka ya sungulukile, yi molẽha ndeci ka yi kwete ocina.

parse-attribute-invalid = DoenetML ka ya sungulukile: Attribute `{ $attribute }` ka ya sungulukile

parse-attribute-value-invalid = DoenetML ka ya sungulukile: Ocina ca attribute `{ $value }` ka ca sungulukile

parse-attribute-value-quote-mismatch = DoenetML ka ya sungulukile: Ocina ca attribute `{ $value }` ka ca sungulukile. Olondimbu vyokupopia ka vi likwatisa. Ci molẽha ndeci `{ $quote }` ka yi kasi

parse-open-tag-name-missing = DoenetML ka ya sungulukile: Kwa sangiwa tag ka yi kwete onduko, ndeci `<`

parse-tag-not-closed = DoenetML ka ya sungulukile: Tag `{ $tag }` ka ya yikiwile (ci molẽha ndeci `>` ka yi kasi).

parse-self-closing-tag-name-missing = DoenetML ka ya sungulukile: Kwa sangiwa tag ka yi kwete onduko `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ka ya sungulukile: Tag `{ $tag }` ka ya yikiwile (ci molẽha ndeci `/>` ka yi kasi).

parse-tag-invalid-attributes = DoenetML ka ya sungulukile: Tag `{ $tag }` ka ya sungulukile. Yi pondola oku kwata attributes ka vya sungulukile.

parse-close-tag-name-missing = DoenetML ka ya sungulukile: Kwa sangiwa tag yokuyika ka yi kwete onduko, ndeci `</`

parse-attribute-value-unquoted = Ovina vya attribute vi sukila oku kala pokati kolondimbu vyokupopia: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ka ya sungulukile: Kwa sangiwa tag yokuyika `{ $tag }`, pole tag yokuyulula ka yi kasi

parse-close-tag-mismatched = DoenetML ka ya sungulukile: Tag yokuyika ka yi likwatisa. Ku lavuiwile `</{ $expected }>`. Kwa sangiwa `{ $found }`

parser-node-unconvertible = Ka ci tẽliwa oku pongolola node { $node } ku node ya Dast.

## Names

name-attribute-invalid =
    Onduko name='{ $name }' ka ya sungulukile. { $reason ->
        [characters] Olonduko vi pondola oku kwata lika ovisonehua, ovitalatu, olongoli vyemehi ale olofeni.
       *[start] Olonduko vi sukila oku fetika locisonehua.
    }

component-name-invalid-start = Onduko yocina "{ $name }" ka ya sungulukile. Olonduko vi sukila oku fetika locisonehua.

## `<answer>` sugar

answer-video-watched-missing-video = Answer yotype videoWatched yi sukila oku kwata video attribute

answer-video-watched-video-not-reference = Answer yotype videoWatched yi sukila oku kwata video attribute yi kala ondaka

answer-name-not-single-text = Answer name attribute yi sukila oku kwata omõla umwe lika wa text

## Referencing another document

external-doenetml-recursion-limit = Ka ci tẽlele oku sanga DoenetML yokovilu momo elilwilo lyalua. Ondaka yocilinganya yi kasi?

external-doenetml-unavailable = Ka ci tẽlele oku sanga DoenetML ku { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ya sangiwa ku { $attribute }="{ $uri }" ka ya sungulukile: ka ya likwatisa locituwa cocina "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` ya kukuluka; talavaya `{ $to }`.
       *[other] [deprecation] Attribute `{ $from }` ku `<{ $component }>` ya kukuluka; talavaya `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` ya kukuluka kuenje ya yepiwa momo `{ $to }` ya tukuiwa vali.
       *[other] [deprecation] Attribute `{ $from }` ku `<{ $component }>` ya kukuluka kuenje ya yepiwa momo `{ $to }` ya tukuiwa vali.
    }

deprecated-attribute-ignored = [deprecation] Attribute `{ $attribute }` ku `<{ $component }>` ya kukuluka kuenje ya yepiwa.

deprecated-attribute-to-child = [deprecation] Attribute `{ $attribute }` ku `<{ $component }>` ya kukuluka; talavaya omõla `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Ocina `{ $value }` ca attribute `{ $attribute }` ku `<{ $component }>` ca kukuluka; talavaya `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` yi pondola lika oku lingisa Ingelesi valua, kuenje olondaka vyayo vi sialele ndeci wa soneha velivulu lya sonehiwa vu { $locale }. Soneha ocituwa cavalua muẽle, ale ci tumbika la `pluralForm` attribute.


## Checking against the schema

schema-element-unrecognized = Ocina `<{ $tag }>` ka ci cina ca Doenet ca kũlĩhĩwa.

schema-element-not-allowed-at-root = Ocina `<{ $tag }>` ka ci ecelelwa kilu lyelivulu.

schema-element-not-allowed-inside = Ocina `<{ $tag }>` ka ci ecelelwa vokati ka `<{ $parent }>`.

schema-attribute-unrecognized = Ocina `<{ $tag }>` ka ci kwete attribute yonduko `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attribute `{ $attribute }` yocina `<{ $tag }>` yi sukila oku kala elisitu li kwete ovina vyosi vi kala cimwe pokati ka: { $allowed }
       *[other] Attribute `{ $attribute }` yocina `<{ $tag }>` yi sukila oku kala cimwe pokati ka: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Onduko yocituwa ya select ka ya sungulukile.  Onduko yocituwa { $variantName } yi molẽha vu options { $numOptions } pole ocitalatu cokunõla ci kasi { $numToSelect }.

select-variant-name-without-options = Ovituwa vimwe vya tukuiwa ku select pole ka mwa tukuiwile options konduko yocituwa yi tẽliwa: { $variantName }.

select-variant-name-not-possible = Onduko yocituwa { $variantName } ya tukuiwa ku select ka ya nduko yocituwa yi tẽliwa.

select-too-few-options = Ka ci tẽliwa oku nõla ovina { $numToSelect } vu { $numOptions } lika.

select-from-sequence-too-few-values = Ka ci tẽliwa oku nõla ovina { $numToSelect } vosequence yocilamba { $length }.

select-from-sequence-indices-count-mismatch = Ocitalatu cindices vya tukuiwa ku select ci sukila oku likwatisa locitalatu cokunõla

select-from-sequence-indices-not-integers = Indices vyosi vya tukuiwa ku select vi sukila oku kala ovitalatu vyosi

select-from-sequence-index-excluded = Kwa tukuiwa index ya selectfromsequence ya pindiwa

select-from-sequence-indices-excluded-combination = Kwa tukuiwa indices vya selectfromsequence vya kala elikongelo lya pindiwa

select-from-sequence-coprime-not-positive-integers = Ka ci tẽliwa oku nõla alikongelo a coprime momo ka ku nõliwa ovitalatu vyosi vi kasi kilu lya ziro.

select-from-sequence-coprime-common-factor = Ka ci tẽliwa oku nõla ovitalatu vya coprime. Ovina vyosi vi tẽliwa vi kwete ofatoru yimosi. (Ovina vya tukuiwa vya "from" ale "to" vi sukila oku kala coprime la "step".)

select-from-sequence-coprime-single-number = Ka ci tẽliwa oku nõla alikongelo a coprime kocitalatu cimosi ka ci kasi 1.

select-from-sequence-excluded-too-many-combinations = Kwa pindiwa alikongelo a piti 70% vo selectFromSequence

select-from-sequence-coprime-none-found = Ka ci tẽlele oku nõla ovitalatu vya coprime. Ovina vyosi vi tẽliwa vi kwete ofatoru yimosi.

select-from-sequence-too-few-unique-values = Ka ci tẽliwa oku nõla ovina vya litepa { $numToSelect } vosequence yocilamba { $numPossibleValues }

select-prime-numbers-too-few-values = Ka ci tẽliwa oku nõla ovina { $numToSelect } velisitu lyovitalatu vya prime lyocilamba { $numValues }

select-prime-numbers-values-count-mismatch = Ocitalatu covina vya tukuiwa ku select ci sukila oku likwatisa locitalatu cokunõla

select-prime-numbers-values-not-prime = Ovina vyosi vya tukuiwa ku select prime number vi sukila oku kala velisitu lyovitalatu vya prime

select-prime-numbers-values-excluded-combination = Ovina vya tukuiwa vya selectPrimeNumbers vya kala elikongelo lya pindiwa

select-prime-numbers-excluded-too-many-combinations = Kwa pindiwa alikongelo a piti 70% vo selectPrimeNumbers

select-random-combination-fluke = Locina ka ci lavukiwile, ka ci tẽlele oku nõla elikongelo lyovina vyokuyapula

select-random-value-fluke = Locina ka ci lavukiwile, ka ci tẽlele oku nõla ocina cokuyapula
