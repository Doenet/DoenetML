# Bikol diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Bikol marks no number on the noun, so a counted message whose only English
# difference is the noun's number renders one string here and the select is
# dropped. The count still arrives and is still formatted.
#
# A value quoted back from the author's source is reached through «an» or «sa»
# rather than through a linker, so that no «na»/«-ng» choice depends on a word
# this catalog has never seen. See `content.ftl`.


## `<lineSegment>`

# No select: «dai pinapansin» does not agree with what is ignored, and the list
# carries no number of its own.
line-segment-attributes-ignored-with-endpoints = dai pinapansin an { $attributes } kun itinakda an duwang punta

line-segment-attributes-ignored-with-endpoint-and-midpoint = dai pinapansin an { $attributes } kun itinakda an sarong punta asin an tanga

line-segment-midpoint-offset-without-midpoint = mayong epekto an midpointOffset kun mayong tanga

## `<line>`

line-points-undetermined-dimensions = Linyang minaagi sa mga puntong dai natukdoan an dimensyon.

line-points-too-few-dimensions = Kaipuhan na minaagi an linya sa mga puntong igwang dai kulang sa duwang dimensyon.

line-points-depend-on-variables = An linya minaagi sa mga puntong nakadepende sa mga baryable: { $variables }.

line-equation-invalid-format = Bakong balidong pormat kan ekwasyon kan linya sa mga baryable na { $variable1 } asin { $variable2 }.

## `<ray>`

ray-overprescribed-through = An sinag itinakda paagi sa through, endpoint asin direction.  Dai pinapansin an itinakdang through.

ray-dimension-mismatch = dai nagkakauyon an numDimensions sa sinag.

## `<vector>`

vector-overprescribed-head = An bektor itinakda paagi sa head, tail asin displacement.  Dai pinapansin an itinakdang head.

vector-dimension-mismatch = dai nagkakauyon an numDimensions sa bektor.

## Attracting and constraining

attract-to-without-nearest-point = Dai puwedeng mag-agyat sa `<{ $component }>` ta mayo iyan nin baryableng estado na nearestPoint.

constrain-to-without-nearest-point = Dai puwedeng magpugol sa `<{ $component }>` ta mayo iyan nin baryableng estado na nearestPoint.

constrain-to-interior-without-nearest-point = Dai puwedeng magpugol sa laog kan `<{ $component }>` ta mayo iyan nin baryableng estado na nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = dai pinapansin an labelPosition para sa choiceInput na bakong inline

## Ordering children by index

choice-input-indices-count-mismatch = Dai pinapansin an mga indise na itinakda para sa choiceInput ta dai nagkakauyon an bilang kan mga indise asin an bilang kan mga akeng pipilian.

pretzel-indices-count-mismatch = Dai pinapansin an mga indise na itinakda para sa problem ta dai nagkakauyon an bilang kan mga indise asin an bilang kan mga akeng problem.

shuffle-indices-count-mismatch = Dai pinapansin an mga indise na itinakda para sa shuffle ta dai nagkakauyon an bilang kan mga indise asin an bilang kan mga komponente.

indices-ignored-out-of-range = Dai pinapansin an mga indise na itinakda para sa { $component } ta igwang indise na labi sa sakop.

pretzel-indices-repeated = Dai pinapansin an mga indise na itinakda para sa pretzel ta igwang indise na inulit.

pretzel-circuit-first-index = Dai pinapansin an mga indise na itinakda para sa pretzel sa mode na circuit ta kaipuhan na 1 an enot na indise.

## `<shuffle>` and `<sort>`

string-children-need-type = Tanganing maggana an `<{ $component }>` sa mga akeng string, kaipuhan na itakda an atributong `type`.

invalid-type-defaulting-to-math = Bakong balidong type { $type } para sa komponenteng { $component }. Kaipuhan na saro sa math, text, number, o boolean. Ginagamit an math.

string-not-valid-component-to-arrange = An string na "{ $value }" bakong balidong komponente para sa { $component }. Dai pinapansin.

## Types and variables

invalid-type-defaulting-to-number = Bakong balidong type { $type }, ibinubutang an type sa number.

invalid-variable-value = Bakong balidong balor kan sarong baryable: `{ $value }`

## Variants

variant-index-must-be-number = Kaipuhan na numero an indise kan baryanteng { $index }

variant-index-must-be-integer = Kaipuhan na integer an indise kan baryanteng { $index }

## `<sideBySide>`

side-by-side-absolute-widths = Dai pa naipapatupad an `<{ $component }>` para sa absolutong sukol. Ibinubutang na relatibo an mga lakbang.

side-by-side-absolute-margins = Dai pa naipapatupad an `<{ $component }>` para sa absolutong sukol. Ibinubutang na relatibo an mga margin.

side-by-side-no-block-child = Bakong balidong `<{ $component }>`: kaipuhan na igwa iyan nin dai kulang sa sarong akeng block.

## `<label>`

label-for-ignored-on-graphical = Dai pinapansin an atributong `for` sa grapikal na `<label>`.

label-for-must-resolve-to-one = Kaipuhan na minatukdo an atributong `for` sa `<label>` sa eksaktong sarong komponente.

label-for-unresolved = Dai natukdo an atributong `for` sa `<label>` sa sarong komponente.

label-for-answer-with-authored-inputs = An atributong `for` sa `<label>` minatukdo sa sarong `<answer>` na igwang mga input na sinurat kan autor; tukdoon an input mismo.

label-for-answer-without-input = An atributong `for` sa `<label>` minatukdo sa sarong `<answer>` na mayong input na eetiketahan.

label-for-must-reference-input-or-answer = Kaipuhan na minatukdo an atributong `for` sa `<label>` sa sarong input o sarong answer.

## Accessibility

accessibility-short-description-or-decorative = Para sa aksesibilidad, kaipuhan na igwa an `<{ $component }>` nin halipot na deskripsyon o itinakdang dekoratibo.

accessibility-video-short-description = Para sa aksesibilidad, kaipuhan na igwa an `<video>` nin halipot na deskripsyon.

accessibility-input-short-description-or-label = Para sa aksesibilidad, kaipuhan na igwa an `<{ $component }>` nin halipot na deskripsyon o etiketa.

accessibility-answer-input-short-description-or-label = Para sa aksesibilidad, kaipuhan na igwang halipot na deskripsyon o etiketa an sarong `<answer>` na naggigibo nin input.

accessibility-short-description-contains-math = Dai dapat naglalaog sa mga halipot na deskripsyon an mga komponenteng matematika arog kan `<{ $component }>`. Isurat sa mga tataramon an ano man na matematika.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Kulang an kontraste kan { $colorName } para sa teksto kan ulo kan seksyon (madiklom na mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kaipuhan an dai kulang sa { $threshold }:1).
       *[other] Kulang an kontraste kan { $colorName } para sa teksto kan ulo kan seksyon ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kaipuhan an dai kulang sa { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Dai pa naipapatupad an `<circle>` na minaagi sa { $count } na punto kun mayong numerikong balor an mga punto.

circle-too-many-through-points = Dai puwedeng kuwentahon an sirkulong minaagi sa labi sa 3 na punto.

circle-overprescribed-radius-center-points = Dai puwedeng kuwentahon an sirkulong igwang itinakdang radyus, sentro asin mga puntong aagihan.

circle-center-with-multiple-points = Dai puwedeng kuwentahon an sirkulong igwang itinakdang sentro na minaagi sa labi sa 1 na punto.

circle-radius-too-small = Dai puwedeng kuwentahon an sirkulo: huli ta an distansya kan duwang punto iyo an { $distance }, sadit na marhay an itinakdang radyus na { $radius }.

circle-radius-with-many-points = Dai puwedeng maggibo nin sirkulong minaagi sa labi sa duwang punto na igwang itinakdang radyus.

circle-invalid-center-or-through-points = Bakong balido an sentro o an mga puntong aagihan kan sirkulo.

circle-radius-center-with-multiple-points = Dai puwedeng kuwentahon an radyus kan sirkulong igwang itinakdang sentro na minaagi sa labi sa 1 na punto.

circle-change-radius-non-numerical = Dai puwedeng baguhon an radyus kan sirkulong minaagi sa mga puntong bakong numeriko

circle-radius-with-points-non-numerical = Dai puwedeng maggibo nin sirkulong minaagi sa labi sa sarong punto na igwang itinakdang radyus kun mayong numerikong balor.

circle-change-center-non-numerical = Dai pa naipapatupad an pagbago kan sentro kan sirkulong minaagi sa mga puntong mayong numerikong balor.

## `<function>`

# English's two counts multiply out to four sentences; Bikol has one, because
# «interbalo» and «input» do not change for number. Both selects are dropped
# and both counts still arrive.
function-domain-insufficient-dimensions = Kulang an dimensyon kan domain para sa punsyon. An domain igwang { $intervals } na interbalo alagad an punsyon igwang { $inputs } na input.

function-domain-invalid-format = Bakong balidong pormat kan domain para sa punsyon.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Dai pinapansin an bakong numerikong pinakahalangkaw kan punsyon.
        [minimum] Dai pinapansin an bakong numerikong pinakahababa kan punsyon.
        [extremum] Dai pinapansin an bakong numerikong ekstremum kan punsyon.
        [point] Dai pinapansin an bakong numerikong punto kan punsyon.
        [slope] Dai pinapansin an bakong numerikong hilig kan punsyon.
       *[other] Dai pinapansin an bakong numerikong { $type } kan punsyon.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Dai pinapansin an mayong laog na pinakahalangkaw kan punsyon.
        [minimum] Dai pinapansin an mayong laog na pinakahababa kan punsyon.
        [extremum] Dai pinapansin an mayong laog na ekstremum kan punsyon.
        [point] Dai pinapansin an mayong laog na punto kan punsyon.
       *[other] Dai pinapansin an mayong laog na { $type } kan punsyon.
    }

function-points-too-close = Igwang duwang punto an punsyon na sobrang rani. Dai madepinaran an punsyon.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Posible sana an mga iterasyon kan punsyon kun pareho an bilang kan mga input asin an bilang kan mga output. Ining punsyon igwang { $inputs } na input asin { $outputs } na output.

## `<sequence>`

sequence-invalid-length = Bakong balido an lawig kan sequence.  Kaipuhan na bakong negatibong integer.

sequence-invalid-step = Bakong balido an step kan sequence.  Kaipuhan na numero para sa sequence na type { $type }.

sequence-invalid-endpoint-number = Bakong balidong "{ $attribute }" kan sequence na numero.  Kaipuhan na numero.

sequence-invalid-endpoint-letters = Bakong balidong "{ $attribute }" kan sequence na letra.  Kaipuhan na kombinasyon kan mga letra.

sequence-invalid-endpoint = Bakong balidong "{ $attribute }" kan sequence.

select-from-sequence-coprime-not-numbers = dai pinapansin an coprime ta bakong numero an pinipili

select-from-sequence-coprime-with-exclude-combinations = dai pinapansin an coprime ta itinakda an excludeCombinations

## Resolving a `target`

target-not-found = Bakong balidong target para sa `<{ $source }>`: dai makua an target.

target-state-variable-not-found = Bakong balidong target para sa `<{ $source }>`: dai makua an baryableng estado na inaapod na "{ $property }" sa sarong `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Kaipuhan na iba an mga baryable kan `<odeSystem>` sa independienteng baryable.

ode-system-duplicate-variable-names = Dai madepinaran an mga punsyon na RHS kan ODE na pareho an ngaran kan mga baryableng nakadepende.

ode-system-rhs-function-error = Dai madepinaran an punsyon na RHS kan ODE.  Igwang sala sa paggibo kan punsyon na mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Dai madepinaran an anggulo sa tanga kan { $count } na linya

angle-invalid-through-point = Bakong balidong punto sa through kan `<angle>`

parabola-vertex-too-many-points = Dai pa naipapatupad an parabolang igwang bertise na minaagi sa labi sa 1 na punto.

parabola-too-many-points = Dai pa naipapatupad an parabolang minaagi sa labi sa 3 na punto.

intersection-too-many-items = Dai pa naipapatupad an intersection para sa labi sa duwang bagay

## Other math components

ionic-compound-not-two-ions = Dai pa naipapatupad an kompuwestong ioniko para sa iba apuwera sa duwang ion.

ionic-compound-needs-cation-and-anion = Naipatupad an kompuwestong ioniko para sana sa sarong cation asin sarong anion.

solve-equations-cannot-evaluate = Dai masolusyonan an ekwasyon ta dai natimbang an ekwasyon: { $equation }

math-operators-operand-number-required = Kaipuhan na itakda an operandNumber kun nagkukua nin operand na matematika.

eigen-decomposition-failed = Dai nakuwenta an mga eigenvalue kan matris

## `<matchesPattern>`

# No select: the parameter list carries no number that the noun would show.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: an parametrong { $parameters } dai nagluluwas sa pattern, kaya danay iyan na natutugma sa blangko.

## `<graph>`

graph-grid-invalid = `<graph>`: dai nasasabotan an grid="{ $grid }". Kaipuhan na none, medium, dense, o duwang positibong numerong pinagsuway nin espasyo, arog kan grid="1 0.5". Mayong grid na iginuguhit.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: mayong suporta an xLabelPosition="left" sa renderer na prefigure; ginagamit an ugali kan tuong posisyon.

prefigure-y-label-position-unsupported = `<graph>`: mayong suporta an yLabelPosition="bottom" sa renderer na prefigure; ginagamit an ugali kan itaas na posisyon.

prefigure-invalid-axis-bounds = `<graph>`: bakong balido an mga sagkodan kan aksis para sa konbersyon na prefigure; ginagamit an nakaugalian na bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: bakong balido an lakbang para sa konbersyon na prefigure; ginagamit an nakaugalian na lakbang kan diagram na 425.

prefigure-invalid-aspect-ratio = `<graph>`: bakong balido an aspectRatio para sa konbersyon na prefigure; ginagamit an nakaugalian na aspect ratio na 1.

prefigure-grid-spacing-too-fine = `<graph>`: sobrang rani an pagkasuway kan grid para sa mga sagkodan kan aksis; dai ilinalaog an grid sa renderer na prefigure.

prefigure-annotations-not-rendered = `<graph>`: dai mare-render an mga annotation kun bakong an renderer na PreFigure an ginagamit.

multiple-annotations-children = Dakol na akeng `<annotations>` an nakua sa `<graph>`: dai pinapansin an gabos apuwera sa huri.

## Referring to other components

copy-unrecognized-component-type = Dai puwedeng i-extend o kopyahon an bakong midbid na klase kan komponente: { $type }.

copy-prop-not-found = Dai nakua an prop na { $property } sa komponenteng klase { $component }

collect-no-source = Mayong nakuang source para sa collect.

collect-invalid-component-type = Dai puwedeng tiponon an mga komponenteng klase `<{ $component }>` ta bakong balidong klase kan komponente.

reference-index-unavailable = Dai matukdo an indise na `{ $reference }`

## `<callAction>`

component-action-unavailable = Dai maapod an { $action } sa komponenteng `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bakong balido an porma kan datos.  Dai pareho an lawig kan mga linya. Nakua sa componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Igwang parehong ngaran kan kolum an datos.  Nakua sa componentIdx :{ $componentIdx }

data-frame-missing-column-name = Mayong ngaran an sarong kolum kan datos.  Nakua sa componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = An award kan simbag na ini nakabase sa mismong ipinadarang simbag kan answer tag, asin madara ini nin bakong linalaom na ugali.

answer-max-num-attempts-in-section-wide-check-work = Mayong epekto an pagbutang nin `maxNumAttempts` sa sarong `<answer>` sa laog kan kontenedor na igwang `sectionWideCheckWork`, ta an kontenedor an nagkokontrol kan bilang kan mga purbar. Ibutang an `maxNumAttempts` sa kontenedor.

nested-section-wide-check-work-max-num-attempts = Mayong epekto an pagbutang nin `maxNumAttempts` sa kontenedor na igwang `sectionWideCheckWork` na nasa laog kan ibang kontenedor na igwang `sectionWideCheckWork`, ta an luwas na kontenedor an nagkokontrol kan bilang kan mga purbar. Ibutang an `maxNumAttempts` sa luwas na kontenedor.

# No select: «atributo» is the same word for one and for many.
answer-attributes-need-symbolic-equality = Mayong epekto an atributong { $attributes } kun dai naibutang an symbolicEquality.

answer-invalid-type = Bakong balidong klase para sa simbag: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Huli ta mayong ngaran an komponenteng `<{ $component }>`, dai iyan magagamit para sa atributo kan module

module-attribute-name-already-defined = Dai magagamit an komponenteng `<{ $component } name="{ $name }">` bilang atributo kan module ta an klase kan komponenteng `<module>` igwa nang atributong "{ $name }".

conditional-content-condition-ignored = Dai pinapansin an atributong `condition` sa komponenteng `<conditionalContent>` na igwang mga akeng case o else.

slider-markers-type-mismatch = Dai nagkakauyon an klase kan mga marker asin an klase kan slider.

pretzel-problem-needs-statement-and-answer = Bakong balidong pretzel: kaipuhan na igwang laog an lambang `<problem>` na sarong `<statement>` asin sarong `<answer>`.

pretzel-circuit-first-problem-distractor = Bakong balidong pretzel: sa mode="circuit", dai puwedeng distractor an enot na `<problem>`.

## Attribute values

# No select: «balor» is the same word for one and for many.
attribute-invalid-values = Bakong balidong balor na { $values } para sa atributong `{ $attribute }`; dai pinapansin.

attribute-must-be-references = Bakong balidong balor na `{ $value }` para sa atributong `{ $attribute }`. Kaipuhan na binubuo an atributo kan mga reperensiyang nagpopoon sa `$`.

math-input-invalid-function-names = <mathInput>: dai pinansin an mga bakong balidong ngaran kan punsyon sa { $attribute }: { $names }. Kaipuhan na igwa an lambang ngaran nin dai kulang sa 2 na karakter (letra o gitlo); puwedeng magsunod an sarong suffix na `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Bakong balidong klase kan komponente: `<{ $componentType }>`

attribute-repeated = Dai puwedeng uliton an atributong { $attribute }.

attribute-invalid-for-component = Bakong balidong atributong "{ $attribute }" para sa komponenteng klase `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Kulang an kontraste kan depinisyon kan estilong { $styleNumber } para sa { $context ->
        [text-on-background] kolor kan teksto tumang sa kolor kan background
        [high-contrast] kolor na halangkaw an kontraste tumang sa kanbas
        [line] kolor kan linya tumang sa kanbas
        [marker] kolor kan marker tumang sa kanbas
       *[text-on-canvas] kolor kan teksto tumang sa kanbas
    }{ $mode ->
        [dark] { " (madiklom na mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kaipuhan an dai kulang sa { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Minsan ngani igwa an depinisyon kan estilong { $styleNumber } nin itinakdang mga kolor na igo an kontraste para sa maliwanag na mode, kulang an kontraste kan kolor kan teksto tumang sa kolor kan background sa mga kolor na kinua para sa madiklom na mode ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kaipuhan an dai kulang sa { $threshold }:1). { $suggestion ->
        [available] Tanganing igo an kontraste sa madiklom na mode, dagdagan an kontraste kan maliwanag na mode (halimbawa, ibutang an { $lightAttribute }="{ $lightColor }") o salidahan an kolor kan madiklom na mode (halimbawa, ibutang an { $darkAttribute }="{ $darkColor }").
       *[none] Tanganing igo an kontraste sa madiklom na mode, dagdagan an kontraste kan maliwanag na mode o salidahan an mga kinuang kolor paagi sa textColorDarkMode asin/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Minsan ngani igwa an depinisyon kan estilong { $styleNumber } nin itinakdang kolor kan teksto na igo an kontraste para sa maliwanag na mode, kulang an kontraste kan kolor kan teksto na kinua para sa madiklom na mode tumang sa kanbas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kaipuhan an dai kulang sa { $threshold }:1). { $suggestion ->
        [available] Tanganing igo an kontraste sa madiklom na mode, dagdagan an kontraste kan maliwanag na mode (halimbawa, ibutang an textColor="{ $lightColor }") o salidahan an kolor kan madiklom na mode (halimbawa, ibutang an textColorDarkMode="{ $darkColor }").
       *[none] Tanganing igo an kontraste sa madiklom na mode, dagdagan an kontraste kan maliwanag na mode o salidahan an kinuang kolor paagi sa textColorDarkMode.
    }

section-multiple-style-palettes = Saro sana na <stylePalette> an puwedeng pilion kan sarong seksyon; ginagamit an huri.

## Unique variants

variant-num-to-select-not-non-negative-integer = dai matukdoan an mga natatanging baryante kan { $component } ta an numToSelect bakong integer na dai negatibo.

variant-num-to-select-not-constant-number = dai matukdoan an mga natatanging baryante kan { $component } ta an numToSelect bakong konstanteng numero.

variant-with-replacement-not-constant-boolean = dai matukdoan an mga natatanging baryante kan { $component } ta an withReplacement bakong konstanteng boolean.

variant-select-weight-disables-unique = Pinapunduhan an mga natatanging baryante para sa select kun igwang opsyon na itinakdaan nin selectWeight o selectForVariants

variant-coprime-undetermined = dai matukdoan an mga natatanging baryante kan { $component } ta dai matukdoan kun danay na false an coprime.

variant-attribute-not-constant = dai matukdoan an mga natatanging baryante kan { $component } ta bakong konstante an { $attribute }.

variant-attribute-not-number = dai matukdoan an mga natatanging baryante kan { $component } ta bakong numero an { $attribute }.

variant-attribute-wrong-type-for-sequence =
    dai matukdoan an mga natatanging baryante kan { $component } na klase { $type } ta an { $attribute } bakong { $expected ->
        [letters-combination] kombinasyon kan mga letra
        [math-expression] balidong ekspresyon na matematika
        [integer] integer
       *[number] numero
    }.

variant-length-not-integer = dai matukdoan an mga natatanging baryante kan { $component } ta bakong integer an length.

variant-sort-not-implemented = dai pa naipapatupad an mga natatanging baryante kan sarong { $component } na igwang sort

variant-exclude-combinations-not-implemented = dai pa naipapatupad an mga natatanging baryante kan sarong { $component } na igwang excludeCombinations

variant-math-exclude-not-implemented = dai pa naipapatupad an mga natatanging baryante kan sarong { $component } na klase math na igwang exclude

variant-non-constant-exclude-not-implemented = dai pa naipapatupad an mga natatanging baryante kan sarong { $component } na igwang bakong konstanteng exclude

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: mayong suporta sa renderer na prefigure kan graph; linaktawan an kaapo-apohan.

prefigure-descendant-invalid-geometry = { $subject }: bakong sagkodan o bakong kompleto an heometriya; linaktawan an kaapo-apohan.

prefigure-curve-label-omitted = { $subject }: mayong suporta an mga etiketa sa mga na-konberteng kurba; dai pinansin an etiketa.

prefigure-curve-unsupported-definition-type = { $subject }: mayong suportang klase kan depinisyon kan punsyon na kurba na '{ $definitionType }'; linaktawan an kaapo-apohan.

prefigure-region-flip-functions-unsupported = { $subject }: mayong suportang atributong flipFunctions sa regionBetweenCurves; linaktawan an kaapo-apohan.

prefigure-region-non-formula-child = { $subject }: an mga akeng punsyon na klase formula sana an igwang suporta sa regionBetweenCurves; linaktawan an kaapo-apohan.

prefigure-label-position-unsupported =
    { $subject }: mayong suportang labelPosition '{ $labelPosition }' para sa { $labelKind ->
        [line-family] etiketa kan pamilya kan linya
       *[point] etiketa kan punto
    }; ginagamit an nakaugalian na pagpantay kan PreFigure.

prefigure-fill-style-unsupported = { $subject }: mayong suporta an PreFigure sa estilo kan laog na '{ $fillStyle }'; nagbabalik sa solidong laog.

prefigure-line-style-unknown = { $subject }: bakong midbid na estilo kan linya na '{ $lineStyle }', dai inilaog sa output kan PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: isinugpon an estilo kan marker na '{ $markerStyle }' sa estilong 'diamond' kan PreFigure.

prefigure-marker-style-unsupported = { $subject }: mayong suporta an PreFigure sa estilo kan marker na '{ $markerStyle }'; ginagamit an nakaugalian na estilo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: bakong balidong `ref`; dai matukdo an target. Dai inilaog an annotation.

annotation-ref-multiple-targets = `<annotation>`: minatukdo an `ref` sa dakol na target; ginagamit an enot na target.

annotation-ref-outside-graph = `<annotation>`: bakong balidong `ref`; nasa luwas an target kan graph na naglalaom kaini. Dai inilaog an annotation.

annotation-ref-unsupported-target = `<annotation>`: bakong balidong `ref`; an target bakong suportadong grapikal na bagay sa konbersyon na prefigure. Dai inilaog an annotation.

annotation-text-missing = `<annotation>`: mayo o blangko an `text`; nagluluwas nin blangkong teksto.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Igwang nakuang sirkular na pagdepende.
       *[other] Igwang nakuang sirkular na pagdepende na kaiba an komponenteng `<{ $componentType }>`.
    }

reference-no-referent = Mayong nakuang tinutukdo kan reperensiya: `{ $reference }`

reference-multiple-referents = Dakol an nakuang tinutukdo kan reperensiya: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Bakong balidong pormat kan atributong { $attribute } kan `<{ $componentType }>`.

children-invalid = Bakong balido an mga ake kan `<{ $componentType }>`: nakua an mga bakong balidong ake: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Bakong balidong balor na `{ $value }` para sa atributong `{ $attribute }`, ginagamit an balor na `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Dai nakua an bersyon kan DoenetML na { $version }.
       *[other] Dai nakua an bersyon kan DoenetML na { $version }. Nagbabalik sa bersyon na { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Bakong balidong DoenetML: { $content }

parse-tag-missing-close-tag = Bakong balidong DoenetML: Mayong pansarang tag an tag na `{ $tag }`. Linalaom an tag na nagsasara sa sadiri o tag na `</{ $tagName }>`.

parse-tag-error = Bakong balidong DoenetML: Igwang sala sa tag na `<{ $tagName }>`

parse-attribute-missing-value = Bakong balidong DoenetML: Garo mayong balor an bakong balidong atributong `{ $attribute }`.

parse-attribute-invalid = Bakong balidong DoenetML: Bakong balidong atributong `{ $attribute }`

parse-attribute-value-invalid = Bakong balidong DoenetML: Bakong balidong balor kan atributong `{ $value }`

parse-attribute-value-quote-mismatch = Bakong balidong DoenetML: Bakong balidong balor kan atributong `{ $value }`. Dai nagkakauyon an mga marka kan sipi. Garo mayong sarong `{ $quote }`

parse-open-tag-name-missing = Bakong balidong DoenetML: Igwang nakuang tag na mayong ngaran, halimbawa `<`

parse-tag-not-closed = Bakong balidong DoenetML: Dai nasara an tag na `{ $tag }` (garo mayong `>`).

parse-self-closing-tag-name-missing = Bakong balidong DoenetML: Igwang nakuang tag na mayong ngaran `<{ $content }>`

parse-self-closing-tag-not-closed = Bakong balidong DoenetML: Dai nasara an tag na `{ $tag }` (garo mayong `/>`).

parse-tag-invalid-attributes = Bakong balidong DoenetML: Bakong balido an tag na `{ $tag }`. Tibaad igwang bakong tamang mga atributo.

parse-close-tag-name-missing = Bakong balidong DoenetML: Igwang nakuang pansarang tag na mayong ngaran, halimbawa `</`

parse-attribute-value-unquoted = Kaipuhan na nasa laog kan mga marka kan sipi an mga balor kan atributo: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Bakong balidong DoenetML: Igwang nakuang pansarang tag na `{ $tag }`, alagad mayong katumbas na pambukas na tag

parse-close-tag-mismatched = Bakong balidong DoenetML: Dai nagkakatugma an pansarang tag. Linalaom an `</{ $expected }>`. Nakua an `{ $found }`

parser-node-unconvertible = Dai na-konberte an node na { $node } sa node na Dast.

## Names

name-attribute-invalid =
    Bakong balidong atributong name='{ $name }'. { $reason ->
        [characters] Puwede sanang maglaom an mga ngaran nin mga letra, numero, underscore o gitlo.
       *[start] Kaipuhan na nagpopoon an mga ngaran sa letra.
    }

component-name-invalid-start = Bakong balidong ngaran kan komponenteng "{ $name }". Kaipuhan na nagpopoon an mga ngaran sa letra.

## `<answer>` sugar

answer-video-watched-missing-video = Kaipuhan na igwang atributong video an answer na type videoWatched

answer-video-watched-video-not-reference = Kaipuhan na reperensiya an atributong video kan answer na type videoWatched

answer-name-not-single-text = Kaipuhan na igwang sarong akeng text sana an atributong name kan answer

## Referencing another document

external-doenetml-recursion-limit = Dai nakua an luwas na DoenetML huli sa sobrang dakol na lebel kan pag-uulit. Igwa daw na sirkular na reperensiya?

external-doenetml-unavailable = Dai nakua an DoenetML hali sa { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Bakong balidong DoenetML an nakua hali sa { $attribute }="{ $uri }": dai iyan nagtutugma sa klase kan komponenteng "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Dai na ginagamit an atributong `{ $from }`; gamiton an `{ $to }`.
       *[other] [deprecation] Dai na ginagamit an atributong `{ $from }` sa `<{ $component }>`; gamiton an `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Dai na ginagamit an atributong `{ $from }` asin dai pinapansin ta itinakda man an `{ $to }`.
       *[other] [deprecation] Dai na ginagamit an atributong `{ $from }` sa `<{ $component }>` asin dai pinapansin ta itinakda man an `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Dai na ginagamit an atributong `{ $attribute }` sa `<{ $component }>` asin dai pinapansin.

deprecated-attribute-to-child = [deprecation] Dai na ginagamit an atributong `{ $attribute }` sa `<{ $component }>`; gamiton an akeng `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Dai na ginagamit an balor na `{ $value }` kan atributong `{ $attribute }` sa `<{ $component }>`; gamiton an `{ $to }`.


## Language coverage

pluralize-english-only = An `<pluralize>` makakapadakol sana nin Ingles, kaya dai nababago an teksto kaini sa dokumentong sinurat sa { $locale }. Isurat mismo an pormang dakol, o ibutang ini paagi sa atributong `pluralForm`.


## Checking against the schema

schema-element-unrecognized = An elementong `<{ $tag }>` bakong midbid na elemento kan Doenet.

schema-element-not-allowed-at-root = Dai tinutugotan an elementong `<{ $tag }>` sa gamot kan dokumento.

schema-element-not-allowed-inside = Dai tinutugotan an elementong `<{ $tag }>` sa laog kan `<{ $parent }>`.

schema-attribute-unrecognized = Mayong atributong inaapod na `{ $attribute }` an elementong `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Kaipuhan na lista an atributong `{ $attribute }` kan elementong `<{ $tag }>` na an lambang bagay saro sa: { $allowed }
       *[other] Kaipuhan na saro sa mga ini an atributong `{ $attribute }` kan elementong `<{ $tag }>`: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Bakong balidong ngaran kan baryante para sa select.  An ngaran kan baryanteng { $variantName } nagluluwas sa { $numOptions } na opsyon alagad { $numToSelect } an bilang na pipilion.

select-variant-name-without-options = Igwang itinakdang mga baryante para sa select alagad mayong itinakdang opsyon para sa posibleng ngaran kan baryante: { $variantName }.

select-variant-name-not-possible = An ngaran kan baryanteng { $variantName } na itinakda para sa select bakong posibleng ngaran kan baryante.

select-too-few-options = Dai puwedeng mamili nin { $numToSelect } na komponente hali sa { $numOptions } sana.

select-from-sequence-too-few-values = Dai puwedeng mamili nin { $numToSelect } na balor hali sa sequence na { $length } an lawig.

select-from-sequence-indices-count-mismatch = Kaipuhan na magtugma an bilang kan mga indise na itinakda para sa select asin an bilang na pipilion

select-from-sequence-indices-not-integers = Kaipuhan na integer an gabos na indise na itinakda para sa select

select-from-sequence-index-excluded = Itinakda an indise kan selectfromsequence na dai inilaog

select-from-sequence-indices-excluded-combination = Itinakda an mga indise kan selectfromsequence na sarong dai inilaog na kombinasyon

select-from-sequence-coprime-not-positive-integers = Dai puwedeng mamili nin mga kombinasyon na coprime ta bakong positibong integer an pinipili.

select-from-sequence-coprime-common-factor = Dai puwedeng mamili nin mga numerong coprime. Igwang sarong paktor na pareho an gabos na posibleng balor. (Kaipuhan na coprime an itinakdang balor kan "from" o "to" sa "step".)

select-from-sequence-coprime-single-number = Dai puwedeng mamili nin mga kombinasyon na coprime hali sa sarong numero sana na bakong 1.

select-from-sequence-excluded-too-many-combinations = Dai inilaog an labi sa 70% kan mga kombinasyon sa selectFromSequence

select-from-sequence-coprime-none-found = Dai nakapamili nin mga numerong coprime. Igwang sarong paktor na pareho an gabos na posibleng balor.

select-from-sequence-too-few-unique-values = Dai puwedeng mamili nin { $numToSelect } na natatanging balor hali sa sequence na { $numPossibleValues } an lawig

select-prime-numbers-too-few-values = Dai puwedeng mamili nin { $numToSelect } na balor hali sa listang prime na { $numValues } an lawig

select-prime-numbers-values-count-mismatch = Kaipuhan na magtugma an bilang kan mga balor na itinakda para sa select asin an bilang na pipilion

select-prime-numbers-values-not-prime = Kaipuhan na nasa listang prime an gabos na balor na itinakda para sa select prime number

select-prime-numbers-values-excluded-combination = An itinakdang mga balor kan selectPrimeNumbers sarong dai inilaog na kombinasyon

select-prime-numbers-excluded-too-many-combinations = Dai inilaog an labi sa 70% kan mga kombinasyon sa selectPrimeNumbers

select-random-combination-fluke = Huli sa bihirang marhay na kapaladan, dai nakapamili nin kombinasyon kan mga random na balor

select-random-value-fluke = Huli sa bihirang marhay na kapaladan, dai nakapamili nin random na balor
