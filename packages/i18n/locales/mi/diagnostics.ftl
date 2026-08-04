# Māori diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Māori marks number on the article rather than on the noun, so the counted
# messages here need no selection — see the header of `chrome.ftl`.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = Ka warewaretia { $attributes } ina tautuhia ngā pito e rua

line-segment-attributes-ignored-with-endpoint-and-midpoint = Ka warewaretia { $attributes } ina tautuhia te pito me te ira waenga

line-segment-midpoint-offset-without-midpoint = Kāore he pānga o midpointOffset ki te kore he ira waenga

## `<line>`

line-points-undetermined-dimensions = He rārangi mā ngā ira kāore anō kia mōhiotia ō rātou āhuatanga.

line-points-too-few-dimensions = Me haere te rārangi mā ngā ira e rua neke atu ō rātou āhuatanga.

line-points-depend-on-variables = Ka haere te rārangi mā ngā ira e whakawhirinaki ana ki ngā taurangi: { $variables }.

line-equation-invalid-format = He muhu te hōputu o te whārite rārangi i ngā taurangi { $variable1 } me { $variable2 }.

## `<ray>`

ray-overprescribed-through = Kua tautuhia te hihi mā through, endpoint me direction. Ka warewaretia te through i tautuhia.

ray-dimension-mismatch = Kāore i te ōrite te numDimensions i te hihi.

## `<vector>`

vector-overprescribed-head = Kua tautuhia te kōpapa mā head, tail me displacement. Ka warewaretia te head i tautuhia.

vector-dimension-mismatch = Kāore i te ōrite te numDimensions i te kōpapa.

## Attracting and constraining

attract-to-without-nearest-point = Kāore e taea te kukume ki `<{ $component }>` nā te mea kāore he taurangi āhua nearestPoint.

constrain-to-without-nearest-point = Kāore e taea te here ki `<{ $component }>` nā te mea kāore he taurangi āhua nearestPoint.

constrain-to-interior-without-nearest-point = Kāore e taea te here ki roto i `<{ $component }>` nā te mea kāore he taurangi āhua nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = Ka warewaretia te labelPosition mō te choiceInput ehara i te inline

## Ordering children by index

choice-input-indices-count-mismatch = Ka warewaretia ngā indices i tautuhia mō choiceInput nā te mea kāore te maha o ngā indices e ōrite ana ki te maha o ngā tamariki choice.

pretzel-indices-count-mismatch = Ka warewaretia ngā indices i tautuhia mō problem nā te mea kāore te maha o ngā indices e ōrite ana ki te maha o ngā tamariki problem.

shuffle-indices-count-mismatch = Ka warewaretia ngā indices i tautuhia mō shuffle nā te mea kāore te maha o ngā indices e ōrite ana ki te maha o ngā wāhanga.

indices-ignored-out-of-range = Ka warewaretia ngā indices i tautuhia mō { $component } nā te mea kei waho ētahi indices i te awhe.

pretzel-indices-repeated = Ka warewaretia ngā indices i tautuhia mō pretzel nā te mea kua tuaruatia ētahi indices.

pretzel-circuit-first-index = Ka warewaretia ngā indices i tautuhia mō pretzel i te aratau circuit nā te mea me 1 te index tuatahi.

## `<shuffle>` and `<sort>`

string-children-need-type = Kia mahi ai a `<{ $component }>` me ngā tamariki kupu, me tautuhi te huanga `type`.

invalid-type-defaulting-to-math = He muhu te type { $type } mō te wāhanga { $component }. Me math, text, number, boolean rānei. Ka whakamahia a math.

string-not-valid-component-to-arrange = Ehara te kupu "{ $value }" i te wāhanga tika mō { $component }. Ka warewaretia.

## Types and variables

invalid-type-defaulting-to-number = He muhu te type { $type }, ka whakatauria te type ki number.

invalid-variable-value = He uara taurangi muhu: `{ $value }`

## Variants

variant-index-must-be-number = Me tau te index variant { $index }

variant-index-must-be-integer = Me tau tōpū te index variant { $index }

## `<sideBySide>`

side-by-side-absolute-widths = Kāore anō `<{ $component }>` kia hangaia mō ngā inenga tūturu. Ka whakatauria ngā whānui hei mea whakarite.

side-by-side-absolute-margins = Kāore anō `<{ $component }>` kia hangaia mō ngā inenga tūturu. Ka whakatauria ngā tapa hei mea whakarite.

side-by-side-no-block-child = He muhu `<{ $component }>`: me whai kotahi te tamaiti poraka.

## `<label>`

label-for-ignored-on-graphical = Ka warewaretia te huanga `for` i runga i te `<label>` whakairoiro.

label-for-must-resolve-to-one = Me tohu te huanga `for` i runga i te `<label>` ki te wāhanga kotahi anake.

label-for-unresolved = Kāore i taea e te huanga `for` i runga i te `<label>` te tohu ki tētahi wāhanga.

label-for-answer-with-authored-inputs = Ka tohu te huanga `for` i runga i te `<label>` ki tētahi `<answer>` kua tuhia ōna urunga e te kaituhi; tohua tōtika te urunga.

label-for-answer-without-input = Ka tohu te huanga `for` i runga i te `<label>` ki tētahi `<answer>` kāore ōna urunga hei tapanga.

label-for-must-reference-input-or-answer = Me tohu te huanga `for` i runga i te `<label>` ki tētahi urunga, ki tētahi answer rānei.

## Accessibility

accessibility-short-description-or-decorative = Mō te urunga, me whai whakaahuatanga poto a `<{ $component }>`, me tautuhi rānei hei whakapaipai.

accessibility-video-short-description = Mō te urunga, me whai whakaahuatanga poto a `<video>`.

accessibility-input-short-description-or-label = Mō te urunga, me whai whakaahuatanga poto, tapanga rānei a `<{ $component }>`.

accessibility-answer-input-short-description-or-label = Mō te urunga, me whai whakaahuatanga poto, tapanga rānei te `<answer>` e hanga ana i tētahi urunga.

accessibility-short-description-contains-math = Kaua ngā whakaahuatanga poto e whai wāhanga pāngarau pēnei i `<{ $component }>`. Tuhia te pāngarau ki ngā kupu.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Kāore i te rawaka te rerekētanga o { $colorName } mō te kupu pane wāhanga (aratau pōuri) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; me { $threshold }:1 te iti rawa).
       *[other] Kāore i te rawaka te rerekētanga o { $colorName } mō te kupu pane wāhanga ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; me { $threshold }:1 te iti rawa).
    }

## `<circle>`

circle-through-points-non-numerical = Kāore anō te `<circle>` mā ngā ira { $count } kia hangaia mō te wā kāore he uara tau o ngā ira.

circle-too-many-through-points = Kāore e taea te tātai porowhita mā ngā ira neke atu i te 3.

circle-overprescribed-radius-center-points = Kāore e taea te tātai porowhita kua tautuhia te pūtoro, te pokapū me ngā ira.

circle-center-with-multiple-points = Kāore e taea te tātai porowhita kua tautuhia te pokapū mā ngā ira neke atu i te 1.

circle-radius-too-small = Kāore e taea te tātai porowhita: nā te mea ko { $distance } te tawhiti i waenga i ngā ira e rua, he iti rawa te pūtoro { $radius } i tautuhia.

circle-radius-with-many-points = Kāore e taea te hanga porowhita mā ngā ira neke atu i te rua me te pūtoro kua tautuhia.

circle-invalid-center-or-through-points = He muhu te pokapū, ngā ira rānei o te porowhita.

circle-radius-center-with-multiple-points = Kāore e taea te tātai i te pūtoro o te porowhita kua tautuhia te pokapū mā ngā ira neke atu i te 1.

circle-change-radius-non-numerical = Kāore e taea te whakarerekē i te pūtoro o te porowhita kāore ōna ira tau

circle-radius-with-points-non-numerical = Kāore e taea te hanga porowhita mā ngā ira neke atu i te kotahi me te pūtoro kua tautuhia ina kāore he uara tau.

circle-change-center-non-numerical = Kāore anō kia hangaia te whakarerekē i te pokapū o te porowhita mā ngā ira ehara i te tau.

## `<function>`

function-domain-insufficient-dimensions = Kāore i te rawaka ngā āhuatanga o te rohe mō te taumahi. E { $intervals } ngā wāhanga o te rohe engari e { $inputs } ngā urunga o te taumahi.

function-domain-invalid-format = He muhu te hōputu o te rohe mō te taumahi.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ka warewaretia te mōrahi ehara i te tau o te taumahi.
        [minimum] Ka warewaretia te mōkito ehara i te tau o te taumahi.
        [extremum] Ka warewaretia te taumata ehara i te tau o te taumahi.
        [point] Ka warewaretia te ira ehara i te tau o te taumahi.
        [slope] Ka warewaretia te paheketanga ehara i te tau o te taumahi.
       *[other] Ka warewaretia te { $type } ehara i te tau o te taumahi.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ka warewaretia te mōrahi tuhe o te taumahi.
        [minimum] Ka warewaretia te mōkito tuhe o te taumahi.
        [extremum] Ka warewaretia te taumata tuhe o te taumahi.
        [point] Ka warewaretia te ira tuhe o te taumahi.
       *[other] Ka warewaretia te { $type } tuhe o te taumahi.
    }

function-points-too-close = E rua ngā ira o te taumahi e tata rawa ana. Kāore e taea te tautuhi i te taumahi.

function-iterates-input-output-mismatch = Ka taea ngā tukurua taumahi mēnā he ōrite te maha o ngā urunga ki te maha o ngā putanga. E { $inputs } ngā urunga me { $outputs } ngā putanga o tēnei taumahi.

## `<sequence>`

sequence-invalid-length = He muhu te roa o te raupapa. Me tau tōpū kore-tōraro.

sequence-invalid-step = He muhu te takahanga o te raupapa. Me tau mō te raupapa momo { $type }.

sequence-invalid-endpoint-number = He muhu te "{ $attribute }" o te raupapa tau. Me tau.

sequence-invalid-endpoint-letters = He muhu te "{ $attribute }" o te raupapa pū. Me huinga pū.

sequence-invalid-endpoint = He muhu te "{ $attribute }" o te raupapa.

select-from-sequence-coprime-not-numbers = Ka warewaretia te coprime nā te mea ehara i te tau e kōwhirihia ana

select-from-sequence-coprime-with-exclude-combinations = Ka warewaretia te coprime nā te mea kua tautuhia te excludeCombinations

## Resolving a `target`

target-not-found = He target muhu mō `<{ $source }>`: kāore i kitea te target.

target-state-variable-not-found = He target muhu mō `<{ $source }>`: kāore i kitea te taurangi āhua ko "{ $property }" te ingoa i runga i `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Me rerekē ngā taurangi o `<odeSystem>` i te taurangi motuhake.

ode-system-duplicate-variable-names = Kāore e taea te tautuhi i ngā taumahi taha matau o te ODE me ngā ingoa taurangi whakawhirinaki kua tuaruatia.

ode-system-rhs-function-error = Kāore e taea te tautuhi i te taumahi taha matau o te ODE. He hapa i te hanga taumahi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Kāore e taea te tautuhi koki i waenga i ngā rārangi { $count }

angle-invalid-through-point = He ira muhu i te through o `<angle>`

parabola-vertex-too-many-points = Kāore anō kia hangaia te parapora me te tihi mā ngā ira neke atu i te 1.

parabola-too-many-points = Kāore anō kia hangaia te parapora mā ngā ira neke atu i te 3.

intersection-too-many-items = Kāore anō kia hangaia te whakawhitinga mō ngā mea neke atu i te rua

## Other math components

ionic-compound-not-two-ions = Kāore anō te ranunga kationga kia hangaia mō tētahi atu i ngā kationga e rua.

ionic-compound-needs-cation-and-anion = Kua hangaia te ranunga kationga mō te kationga kotahi me te anionga kotahi anake.

solve-equations-cannot-evaluate = Kāore e taea te whakaoti i te whārite nā te mea kāore i taea te aromatawai: { $equation }

math-operators-operand-number-required = Me tautuhi he operandNumber ina tangohia he mea pāngarau.

eigen-decomposition-failed = Kāore i taea te tātai i ngā uara eigen o te matirikiha

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: kāore te tawhā { $parameters } i te tauira, nō reira ka ōrite tonu ki te wāhi tuhe.

## `<graph>`

graph-grid-invalid = `<graph>`: kāore e taea te whakamāori i te grid="{ $grid }". Me none, medium, dense, e rua rānei ngā tau tōraro-kore kua wehea e te mokowā, pēnei i te grid="1 0.5". Kāore he mātiti e tuhia ana.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: kāore te xLabelPosition="left" e tautokona i te kaiwhakaatu prefigure; ka whakamahia te āhua o te tūnga matau.

prefigure-y-label-position-unsupported = `<graph>`: kāore te yLabelPosition="bottom" e tautokona i te kaiwhakaatu prefigure; ka whakamahia te āhua o te tūnga runga.

prefigure-invalid-axis-bounds = `<graph>`: he muhu ngā rohe tuaka mō te hurihanga prefigure; ka whakamahia te bbox taunoa (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: he muhu te whānui mō te hurihanga prefigure; ka whakamahia te whānui hoahoa taunoa 425.

prefigure-invalid-aspect-ratio = `<graph>`: he muhu te aspectRatio mō te hurihanga prefigure; ka whakamahia te ōwehenga taunoa 1.

prefigure-grid-spacing-too-fine = `<graph>`: he iti rawa te tawhiti o te mātiti mō ngā rohe tuaka; ka mahue te mātiti i te kaiwhakaatu prefigure.

prefigure-annotations-not-rendered = `<graph>`: kāore ngā tuhipoka e whakaaturia ina kāore e whakamahia ana te kaiwhakaatu PreFigure.

multiple-annotations-children = He maha ngā tamariki `<annotations>` i kitea i roto i `<graph>`; ka warewaretia katoa engari ko te mea whakamutunga.

## Referring to other components

copy-unrecognized-component-type = Kāore e taea te whakaroa, te tārua rānei i tētahi momo wāhanga kāore i te mōhiotia: { $type }.

copy-prop-not-found = Kāore i kitea te prop { $property } i runga i te wāhanga momo { $component }

collect-no-source = Kāore i kitea he pūtake mō collect.

collect-invalid-component-type = Kāore e taea te kohi wāhanga momo `<{ $component }>` nā te mea he momo wāhanga muhu.

reference-index-unavailable = Kāore e taea te tohu i te index `{ $reference }`

## `<callAction>`

component-action-unavailable = Kāore e taea te karanga i te { $action } i runga i te wāhanga `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = He muhu te āhua o ngā raraunga. Kāore ngā rārangi i te ōrite te roa. I kitea i te componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = He rite ngā ingoa tīwae o ngā raraunga. I kitea i te componentIdx :{ $componentIdx }

data-frame-missing-column-name = Kāore he ingoa tīwae o ngā raraunga. I kitea i te componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Kei runga te award mō tēnei whakautu i te whakautu i tukuna e te answer anō, ā, ka puta he āhua ohorere.

answer-max-num-attempts-in-section-wide-check-work = Kāore he pānga o te whakatau i te `maxNumAttempts` i runga i te `<answer>` kei roto i tētahi ipu me te `sectionWideCheckWork`, nā te mea kei te ipu te mana ki te maha o ngā ngana. Whakatauria kētia te `maxNumAttempts` i runga i te ipu.

nested-section-wide-check-work-max-num-attempts = Kāore he pānga o te whakatau i te `maxNumAttempts` i runga i tētahi ipu me te `sectionWideCheckWork` kei roto i tētahi atu ipu me te `sectionWideCheckWork`, nā te mea kei te ipu o waho te mana ki te maha o ngā ngana. Whakatauria kētia te `maxNumAttempts` i runga i te ipu o waho.

answer-attributes-need-symbolic-equality = Kāore he pānga o te huanga { $attributes } ki te kore e whakatauria te symbolicEquality.

answer-invalid-type = He momo muhu mō te answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Nā te mea kāore he ingoa o te wāhanga `<{ $component }>`, kāore e taea te whakamahi hei huanga module

module-attribute-name-already-defined = Kāore e taea te whakamahi i te wāhanga `<{ $component } name="{ $name }">` hei huanga module nā te mea kua whai kē te momo `<module>` i te huanga "{ $name }".

conditional-content-condition-ignored = Ka warewaretia te huanga `condition` i runga i te wāhanga `<conditionalContent>` he tamariki case, else rānei ōna.

slider-markers-type-mismatch = Kāore te momo tohu e ōrite ana ki te momo slider.

pretzel-problem-needs-statement-and-answer = He muhu te pretzel: me whai ia `<problem>` i te `<statement>` kotahi me te `<answer>` kotahi.

pretzel-circuit-first-problem-distractor = He muhu te pretzel: i te mode="circuit", kāore e taea e te `<problem>` tuatahi te noho hei distractor.

## Attribute values

attribute-invalid-values = He uara muhu { $values } mō te huanga `{ $attribute }`; ka warewaretia.

attribute-must-be-references = He uara muhu `{ $value }` mō te huanga `{ $attribute }`. Me hangaia te huanga ki ngā tohutoro ka tīmata ki te `$`.

math-input-invalid-function-names = <mathInput>: i warewaretia ngā ingoa taumahi muhu i roto i { $attribute }: { $names }. Me 2 neke atu ngā pū o te wāhanga whakaatu o ia ingoa (ngā pū, ngā tohu tāwae rānei); ka taea te tāpiri i te kūmuri `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = He momo wāhanga muhu: `<{ $componentType }>`

attribute-repeated = Kāore e taea te tuarua i te huanga { $attribute }.

attribute-invalid-for-component = He muhu te huanga "{ $attribute }" mō te wāhanga momo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Kāore i te rawaka te rerekētanga o te whakamāramatanga tāera { $styleNumber } mō { $context ->
        [text-on-background] te tae kupu ki te tae papamuri
        [high-contrast] te tae rerekē nui ki te papa
        [line] te tae rārangi ki te papa
        [marker] te tae tohu ki te papa
       *[text-on-canvas] te tae kupu ki te papa
    }{ $mode ->
        [dark] { " (aratau pōuri)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; me { $threshold }:1 te iti rawa).

style-definition-dark-mode-text-background-contrast =
    Ahakoa kua tautuhia e te whakamāramatanga tāera { $styleNumber } ngā tae he rawaka te rerekētanga mō te aratau mārama, kāore i te rawaka te rerekētanga o ngā tae aratau pōuri i ahu mai i aua uara mō te tae kupu ki te tae papamuri ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; me { $threshold }:1 te iti rawa). { $suggestion ->
        [available] Kia rawaka ai te rerekētanga i te aratau pōuri, whakanuia te rerekētanga o te aratau mārama (hei tauira, whakatauria { $lightAttribute }="{ $lightColor }") whakakapia rānei te tae aratau pōuri (hei tauira, whakatauria { $darkAttribute }="{ $darkColor }").
       *[none] Kia rawaka ai te rerekētanga i te aratau pōuri, whakanuia te rerekētanga o te aratau mārama, whakakapia rānei ngā tae i ahu mai ki te textColorDarkMode me/rānei te backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ahakoa kua tautuhia e te whakamāramatanga tāera { $styleNumber } he tae kupu he rawaka te rerekētanga mō te aratau mārama, kāore i te rawaka te rerekētanga o te tae kupu aratau pōuri i ahu mai i taua uara ki te papa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; me { $threshold }:1 te iti rawa). { $suggestion ->
        [available] Kia rawaka ai te rerekētanga i te aratau pōuri, whakanuia te rerekētanga o te aratau mārama (hei tauira, whakatauria textColor="{ $lightColor }") whakakapia rānei te tae aratau pōuri (hei tauira, whakatauria textColorDarkMode="{ $darkColor }").
       *[none] Kia rawaka ai te rerekētanga i te aratau pōuri, whakanuia te rerekētanga o te aratau mārama, whakakapia rānei te tae i ahu mai ki te textColorDarkMode.
    }

section-multiple-style-palettes = Kotahi anake te <stylePalette> ka taea e te wāhanga te kōwhiri; ka whakamahia te mea whakamutunga.

## Unique variants

variant-num-to-select-not-non-negative-integer = kāore e taea te tautuhi i ngā variant motuhake o { $component } nā te mea ehara te numToSelect i te tau tōpū kore-tōraro.

variant-num-to-select-not-constant-number = kāore e taea te tautuhi i ngā variant motuhake o { $component } nā te mea ehara te numToSelect i te tau pūmau.

variant-with-replacement-not-constant-boolean = kāore e taea te tautuhi i ngā variant motuhake o { $component } nā te mea ehara te withReplacement i te boolean pūmau.

variant-select-weight-disables-unique = Ka monokia ngā variant motuhake mō select mēnā he option kua tautuhia te selectWeight, te selectForVariants rānei

variant-coprime-undetermined = kāore e taea te tautuhi i ngā variant motuhake o { $component } nā te mea kāore e taea te tautuhi he hē tonu te coprime.

variant-attribute-not-constant = kāore e taea te tautuhi i ngā variant motuhake o { $component } nā te mea ehara te { $attribute } i te mea pūmau.

variant-attribute-not-number = kāore e taea te tautuhi i ngā variant motuhake o { $component } nā te mea ehara te { $attribute } i te tau.

variant-attribute-wrong-type-for-sequence =
    kāore e taea te tautuhi i ngā variant motuhake o { $component } momo { $type } nā te mea ehara te { $attribute } i { $expected ->
        [letters-combination] te huinga pū
        [math-expression] te whārite pāngarau tika
        [integer] te tau tōpū
       *[number] te tau
    }.

variant-length-not-integer = kāore e taea te tautuhi i ngā variant motuhake o { $component } nā te mea ehara te length i te tau tōpū.

variant-sort-not-implemented = kāore anō kia hangaia ngā variant motuhake o tētahi { $component } me te sort

variant-exclude-combinations-not-implemented = kāore anō kia hangaia ngā variant motuhake o tētahi { $component } me te excludeCombinations

variant-math-exclude-not-implemented = kāore anō kia hangaia ngā variant motuhake o tētahi { $component } momo math me te exclude

variant-non-constant-exclude-not-implemented = kāore anō kia hangaia ngā variant motuhake o tētahi { $component } me te exclude kore-pūmau

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: kāore e tautokona i te kaiwhakaatu prefigure o te kauwhata; ka peke te uri.

prefigure-descendant-invalid-geometry = { $subject }: he āhuahanga mutunga-kore, tōhenga-kore rānei; ka peke te uri.

prefigure-curve-label-omitted = { $subject }: kāore ngā tapanga e tautokona i runga i ngā wāhanga ānau kua hurihia; ka mahue te tapanga.

prefigure-curve-unsupported-definition-type = { $subject }: kāore te momo whakamāramatanga taumahi ānau '{ $definitionType }' e tautokona; ka peke te uri.

prefigure-region-flip-functions-unsupported = { $subject }: kāore te huanga flipFunctions i runga i te regionBetweenCurves e tautokona; ka peke te uri.

prefigure-region-non-formula-child = { $subject }: ko ngā taumahi tamariki momo tauira anake e tautokona ana i runga i te regionBetweenCurves; ka peke te uri.

prefigure-label-position-unsupported =
    { $subject }: kāore te labelPosition '{ $labelPosition }' e tautokona mō { $labelKind ->
        [line-family] te tapanga whānau rārangi
       *[point] te tapanga ira
    }; ka whakamahia te whakahāngai taunoa a PreFigure.

prefigure-fill-style-unsupported = { $subject }: kāore te tāera whakakī '{ $fillStyle }' e tautokona e PreFigure; ka hoki ki te whakakī tōpū.

prefigure-line-style-unknown = { $subject }: kāore te tāera rārangi '{ $lineStyle }' i te mōhiotia, ka mahue i te putanga PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: kua hurihia te tāera tohu '{ $markerStyle }' ki te tāera 'diamond' a PreFigure.

prefigure-marker-style-unsupported = { $subject }: kāore te tāera tohu '{ $markerStyle }' e tautokona e PreFigure; ka whakamahia te tāera taunoa.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: he `ref` muhu; kāore e taea te kimi i te whāinga. Ka mahue te tuhipoka.

annotation-ref-multiple-targets = `<annotation>`: he maha ngā whāinga i tohua e te `ref`; ka whakamahia te whāinga tuatahi.

annotation-ref-outside-graph = `<annotation>`: he `ref` muhu; kei waho te whāinga i te kauwhata. Ka mahue te tuhipoka.

annotation-ref-unsupported-target = `<annotation>`: he `ref` muhu; ehara te whāinga i te ahanoa whakairoiro e tautokona ana i te hurihanga prefigure. Ka mahue te tuhipoka.

annotation-text-missing = `<annotation>`: kua ngaro, kua tuhe rānei te `text`; ka puta he kupu tuhe.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kua kitea he whakawhirinakitanga porowhita.
       *[other] Kua kitea he whakawhirinakitanga porowhita e pā ana ki te wāhanga `<{ $componentType }>`.
    }

reference-no-referent = Kāore i kitea he mea e tohua ana e te tohutoro: `{ $reference }`

reference-multiple-referents = He maha ngā mea i kitea e tohua ana e te tohutoro: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = He muhu te hōputu o te huanga { $attribute } o `<{ $componentType }>`.

children-invalid = He tamariki muhu mō `<{ $componentType }>`: i kitea ngā tamariki muhu: { $children }

## Falling back to a default

attribute-value-invalid-using-default = He uara muhu `{ $value }` mō te huanga `{ $attribute }`, ka whakamahia te uara `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Kāore i kitea te putanga DoenetML { $version }.
       *[other] Kāore i kitea te putanga DoenetML { $version }. Ka hoki ki te putanga { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML muhu: { $content }

parse-tag-missing-close-tag = DoenetML muhu: Kāore he tūtohu katinga o te tūtohu `{ $tag }`. E tūmanakohia ana he tūtohu kati-whaiaro, he tūtohu `</{ $tagName }>` rānei.

parse-tag-error = DoenetML muhu: He hapa i te tūtohu `<{ $tagName }>`

parse-attribute-missing-value = DoenetML muhu: Te āhua nei kāore he uara o te huanga muhu `{ $attribute }`.

parse-attribute-invalid = DoenetML muhu: He huanga muhu `{ $attribute }`

parse-attribute-value-invalid = DoenetML muhu: He uara huanga muhu `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML muhu: He uara huanga muhu `{ $value }`. Kāore ngā tohu kōrero e ōrite ana. Te āhua nei kua ngaro he `{ $quote }`

parse-open-tag-name-missing = DoenetML muhu: I kitea he tūtohu kāore he ingoa, hei tauira `<`

parse-tag-not-closed = DoenetML muhu: Kāore i katia te tūtohu `{ $tag }` (te āhua nei kua ngaro he `>`).

parse-self-closing-tag-name-missing = DoenetML muhu: I kitea he tūtohu kāore he ingoa `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML muhu: Kāore i katia te tūtohu `{ $tag }` (te āhua nei kua ngaro he `/>`).

parse-tag-invalid-attributes = DoenetML muhu: He muhu te tūtohu `{ $tag }`. Kei te hē pea ōna huanga.

parse-close-tag-name-missing = DoenetML muhu: I kitea he tūtohu katinga kāore he ingoa, hei tauira `</`

parse-attribute-value-unquoted = Me noho ngā uara huanga i roto i ngā tohu kōrero: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML muhu: I kitea te tūtohu katinga `{ $tag }`, engari kāore he tūtohu tuwhera e hāngai ana

parse-close-tag-mismatched = DoenetML muhu: Kāore te tūtohu katinga e ōrite ana. I tūmanakohia `</{ $expected }>`. I kitea `{ $found }`

parser-node-unconvertible = Kāore i taea te huri i te node { $node } hei node Dast.

## Names

name-attribute-invalid =
    He huanga muhu name='{ $name }'. { $reason ->
        [characters] Ko ngā pū, ngā tau, ngā tohu-raro me ngā tohu tāwae anake ka taea e ngā ingoa.
       *[start] Me tīmata ngā ingoa ki te pū.
    }

component-name-invalid-start = He ingoa wāhanga muhu "{ $name }". Me tīmata ngā ingoa ki te pū.

## `<answer>` sugar

answer-video-watched-missing-video = Me whai huanga video te answer momo videoWatched

answer-video-watched-video-not-reference = Me whai huanga video he tohutoro te answer momo videoWatched

answer-name-not-single-text = Me whai tamaiti kupu kotahi te huanga name o te answer

## Referencing another document

external-doenetml-recursion-limit = Kāore i taea te tiki i te DoenetML o waho nā te maha rawa o ngā taumata tukurua. He tohutoro porowhita rānei kei reira?

external-doenetml-unavailable = Kāore i taea te tiki DoenetML mai i { $attribute }="{ $uri }"

external-doenetml-type-mismatch = He muhu te DoenetML i tikina mai i { $attribute }="{ $uri }": kāore i ōrite ki te momo wāhanga "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Kua whakarērea te huanga `{ $from }`; whakamahia kētia `{ $to }`.
       *[other] [deprecation] Kua whakarērea te huanga `{ $from }` i runga i `<{ $component }>`; whakamahia kētia `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Kua whakarērea, kua warewaretia hoki te huanga `{ $from }` nā te mea kua tautuhia anō hoki te `{ $to }`.
       *[other] [deprecation] Kua whakarērea, kua warewaretia hoki te huanga `{ $from }` i runga i `<{ $component }>` nā te mea kua tautuhia anō hoki te `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Kua whakarērea, kua warewaretia hoki te huanga `{ $attribute }` i runga i `<{ $component }>`.


## Language coverage

pluralize-english-only = Ko te reo Pākehā anake ka taea e `<pluralize>` te whakamaha, nō reira ka waiho tōna kupu kia rite tonu i roto i te tuhinga i tuhia ki te { $locale }. Tuhia tōtika te āhua maha, whakatauria rānei ki te huanga `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ehara te wāhanga `<{ $tag }>` i te wāhanga Doenet e mōhiotia ana.

schema-element-not-allowed-at-root = Kāore te wāhanga `<{ $tag }>` e whakaaetia i te pūtake o te tuhinga.

schema-element-not-allowed-inside = Kāore te wāhanga `<{ $tag }>` e whakaaetia i roto i `<{ $parent }>`.

schema-attribute-unrecognized = Kāore he huanga ko `{ $attribute }` te ingoa o te wāhanga `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Me rārangi te huanga `{ $attribute }` o te wāhanga `<{ $tag }>`, ā, me noho ia mea hei tētahi o: { $allowed }
       *[other] Me noho te huanga `{ $attribute }` o te wāhanga `<{ $tag }>` hei tētahi o: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = He ingoa variant muhu mō select. Kei roto te ingoa variant { $variantName } i ngā option { $numOptions } engari ko { $numToSelect } te maha hei kōwhiri.

select-variant-name-without-options = Kua tautuhia ētahi variant mō select engari kāore he option mō te ingoa variant ka taea: { $variantName }.

select-variant-name-not-possible = Ehara te ingoa variant { $variantName } i tautuhia mō select i te ingoa variant ka taea.

select-too-few-options = Kāore e taea te kōwhiri i ngā wāhanga { $numToSelect } mai i te { $numOptions } anake.

select-from-sequence-too-few-values = Kāore e taea te kōwhiri i ngā uara { $numToSelect } mai i te raupapa roa { $length }.

select-from-sequence-indices-count-mismatch = Me ōrite te maha o ngā indices i tautuhia mō select ki te maha hei kōwhiri

select-from-sequence-indices-not-integers = Me tau tōpū ngā indices katoa i tautuhia mō select

select-from-sequence-index-excluded = Kua whakakorea te index i tautuhia mō selectfromsequence

select-from-sequence-indices-excluded-combination = He huinga kua whakakorea ngā indices i tautuhia mō selectfromsequence

select-from-sequence-coprime-not-positive-integers = Kāore e taea te kōwhiri huinga coprime nā te mea ehara i ngā tau tōpū tōraro-kore e kōwhirihia ana.

select-from-sequence-coprime-common-factor = Kāore e taea te kōwhiri tau coprime. He tauwehe ōrite tō ngā uara katoa ka taea. (Me coprime ngā uara "from", "to" rānei ki te "step".)

select-from-sequence-coprime-single-number = Kāore e taea te kōwhiri huinga coprime mai i te tau kotahi ehara i te 1.

select-from-sequence-excluded-too-many-combinations = Neke atu i te 70% o ngā huinga i whakakorea i roto i selectFromSequence

select-from-sequence-coprime-none-found = Kāore i taea te kōwhiri tau coprime. He tauwehe ōrite tō ngā uara katoa ka taea.

select-from-sequence-too-few-unique-values = Kāore e taea te kōwhiri i ngā uara motuhake { $numToSelect } mai i te raupapa roa { $numPossibleValues }

select-prime-numbers-too-few-values = Kāore e taea te kōwhiri i ngā uara { $numToSelect } mai i te rārangi tau mātāmua roa { $numValues }

select-prime-numbers-values-count-mismatch = Me ōrite te maha o ngā uara i tautuhia mō select ki te maha hei kōwhiri

select-prime-numbers-values-not-prime = Me noho ngā uara katoa i tautuhia mō select tau mātāmua i roto i te rārangi tau mātāmua

select-prime-numbers-values-excluded-combination = He huinga kua whakakorea ngā uara i tautuhia mō selectPrimeNumbers

select-prime-numbers-excluded-too-many-combinations = Neke atu i te 70% o ngā huinga i whakakorea i roto i selectPrimeNumbers

select-random-combination-fluke = Nā te tupono tino onge, kāore i taea te kōwhiri huinga uara matapōkere

select-random-value-fluke = Nā te tupono tino onge, kāore i taea te kōwhiri uara matapōkere
