# Filipino diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# own source.
#
# The plural of a noun is the separate word «mga» rather than an ending, so a
# select is written out only where the two branches genuinely differ.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = Binabalewala ang { $attributes } kapag tinukoy ang dalawang dulong punto

line-segment-attributes-ignored-with-endpoint-and-midpoint = Binabalewala ang { $attributes } kapag parehong tinukoy ang dulong punto at ang gitnang punto

line-segment-midpoint-offset-without-midpoint = Walang epekto ang midpointOffset kung walang gitnang punto

## `<line>`

line-points-undetermined-dimensions = Guhit na dumaraan sa mga puntong hindi tiyak ang dimensiyon.

line-points-too-few-dimensions = Dapat dumaan ang guhit sa mga puntong may hindi bababa sa dalawang dimensiyon.

line-points-depend-on-variables = Dumaraan ang guhit sa mga puntong nakadepende sa mga baryabol: { $variables }.

line-equation-invalid-format = Di-wastong format para sa ekwasyon ng guhit sa mga baryabol na { $variable1 } at { $variable2 }.

## `<ray>`

ray-overprescribed-through = Tinutukoy ang sinag ng through, endpoint, at direction nang sabay. Binabalewala ang tinukoy na through.

ray-dimension-mismatch = Hindi magkatugma ang numDimensions sa sinag.

## `<vector>`

vector-overprescribed-head = Tinutukoy ang bektor ng head, tail, at displacement nang sabay. Binabalewala ang tinukoy na head.

vector-dimension-mismatch = Hindi magkatugma ang numDimensions sa bektor.

## Attracting and constraining

attract-to-without-nearest-point = Hindi maaaring maakit sa `<{ $component }>` dahil wala itong baryabol ng estado na nearestPoint.

constrain-to-without-nearest-point = Hindi maaaring ikulong sa `<{ $component }>` dahil wala itong baryabol ng estado na nearestPoint.

constrain-to-interior-without-nearest-point = Hindi maaaring ikulong sa loob ng `<{ $component }>` dahil wala itong baryabol ng estado na nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = Binabalewala ang labelPosition para sa choiceInput na hindi inline

## Ordering children by index

choice-input-indices-count-mismatch = Binabalewala ang mga indeks na tinukoy para sa choiceInput dahil hindi tugma ang bilang ng indeks sa bilang ng mga anak na choice.

pretzel-indices-count-mismatch = Binabalewala ang mga indeks na tinukoy para sa problem dahil hindi tugma ang bilang ng indeks sa bilang ng mga anak na problem.

shuffle-indices-count-mismatch = Binabalewala ang mga indeks na tinukoy para sa shuffle dahil hindi tugma ang bilang ng indeks sa bilang ng mga bahagi.

indices-ignored-out-of-range = Binabalewala ang mga indeks na tinukoy para sa { $component } dahil may mga indeks na wala sa saklaw.

pretzel-indices-repeated = Binabalewala ang mga indeks na tinukoy para sa pretzel dahil may mga indeks na inulit.

pretzel-circuit-first-index = Binabalewala ang mga indeks na tinukoy para sa pretzel sa mode na circuit dahil dapat 1 ang unang indeks.

## `<shuffle>` and `<sort>`

string-children-need-type = Para gumana ang `<{ $component }>` sa mga anak na string, dapat tukuyin ang attribute na `type`.

invalid-type-defaulting-to-math = Di-wastong type na { $type } para sa bahaging { $component }. Dapat ito ay isa sa math, text, number, o boolean. Itinatakda sa math.

string-not-valid-component-to-arrange = Ang string na "{ $value }" ay hindi wastong bahagi para { $component }. Binabalewala.

## Types and variables

invalid-type-defaulting-to-number = Di-wastong type na { $type }, itinatakda ang type sa number.

invalid-variable-value = Di-wastong halaga ng baryabol: `{ $value }`

## Variants

variant-index-must-be-number = Ang indeks ng baryante na { $index } ay dapat isang numero

variant-index-must-be-integer = Ang indeks ng baryante na { $index } ay dapat isang integer

## `<sideBySide>`

side-by-side-absolute-widths = Hindi pa naipapatupad ang `<{ $component }>` para sa absolutong sukat. Itinatakda ang mga lapad sa relatibo.

side-by-side-absolute-margins = Hindi pa naipapatupad ang `<{ $component }>` para sa absolutong sukat. Itinatakda ang mga margin sa relatibo.

side-by-side-no-block-child = Di-wastong `<{ $component }>`: dapat itong magkaroon ng hindi bababa sa isang anak na block.

## `<label>`

label-for-ignored-on-graphical = Binabalewala ang attribute na `for` sa graphical na `<label>`.

label-for-must-resolve-to-one = Ang attribute na `for` sa `<label>` ay dapat tumukoy sa eksaktong isang bahagi.

label-for-unresolved = Hindi matukoy ang attribute na `for` sa `<label>` sa anumang bahagi.

label-for-answer-with-authored-inputs = Ang attribute na `for` sa `<label>` ay tumutukoy sa `<answer>` na may tahasang isinulat na mga input; tukuyin nang tuwiran ang input.

label-for-answer-without-input = Ang attribute na `for` sa `<label>` ay tumutukoy sa `<answer>` na walang input na malalagyan ng label.

label-for-must-reference-input-or-answer = Ang attribute na `for` sa `<label>` ay dapat tumukoy sa isang input o sa isang sagot.

## Accessibility

accessibility-short-description-or-decorative = Para sa accessibility, dapat may maikling paglalarawan ang `<{ $component }>` o tukuyin itong pampalamuti.

accessibility-video-short-description = Para sa accessibility, dapat may maikling paglalarawan ang `<video>`.

accessibility-input-short-description-or-label = Para sa accessibility, dapat may maikling paglalarawan o label ang `<{ $component }>`.

accessibility-answer-input-short-description-or-label = Para sa accessibility, dapat may maikling paglalarawan o label ang `<answer>` na lumilikha ng input.

accessibility-short-description-contains-math = Hindi dapat maglaman ng mga bahaging matematikal tulad ng `<{ $component }>` ang maikling paglalarawan. Isulat sa salita ang anumang matematika.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Kulang ang kontrast ng { $colorName } para sa tekstong pamagat ng seksiyon (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kailangan ng hindi bababa sa { $threshold }:1).
       *[other] Kulang ang kontrast ng { $colorName } para sa tekstong pamagat ng seksiyon ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kailangan ng hindi bababa sa { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Hindi pa naipapatupad ang `<circle>` na dumaraan sa { $count } punto kapag walang bilang na halaga ang mga punto.

circle-too-many-through-points = Hindi makalkula ang bilog na dumaraan sa higit sa 3 punto.

circle-overprescribed-radius-center-points = Hindi makalkula ang bilog na may sabay na tinukoy na radius, sentro, at mga puntong dinaraanan.

circle-center-with-multiple-points = Hindi makalkula ang bilog na may tinukoy na sentro at dumaraan sa higit sa 1 punto.

circle-radius-too-small = Hindi makalkula ang bilog: dahil ang layo sa pagitan ng dalawang punto ay { $distance }, masyadong maliit ang tinukoy na radius na { $radius }.

circle-radius-with-many-points = Hindi makalikha ng bilog na dumaraan sa higit sa dalawang punto na may tinukoy na radius.

circle-invalid-center-or-through-points = Di-wasto ang sentro o ang mga puntong dinaraanan ng bilog.

circle-radius-center-with-multiple-points = Hindi makalkula ang radius ng bilog na may tinukoy na sentro at dumaraan sa higit sa 1 punto.

circle-change-radius-non-numerical = Hindi mababago ang radius ng bilog na dumaraan sa mga puntong walang bilang na halaga

circle-radius-with-points-non-numerical = Hindi makalikha ng bilog na dumaraan sa higit sa isang punto na may tinukoy na radius kapag walang bilang na halaga.

circle-change-center-non-numerical = Hindi pa naipapatupad ang pagbabago ng sentro ng bilog na dumaraan sa mga puntong walang bilang na halaga.

## `<function>`

function-domain-insufficient-dimensions = Kulang ang dimensiyon ng domain ng punsiyon. May { $intervals } agwat ang domain ngunit may { $inputs } input ang punsiyon.

function-domain-invalid-format = Di-wastong format para sa domain ng punsiyon.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Binabalewala ang hindi bilang na maximum ng punsiyon.
        [minimum] Binabalewala ang hindi bilang na minimum ng punsiyon.
        [extremum] Binabalewala ang hindi bilang na extremum ng punsiyon.
        [point] Binabalewala ang hindi bilang na punto ng punsiyon.
        [slope] Binabalewala ang hindi bilang na slope ng punsiyon.
       *[other] Binabalewala ang hindi bilang na { $type } ng punsiyon.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Binabalewala ang walang lamang maximum ng punsiyon.
        [minimum] Binabalewala ang walang lamang minimum ng punsiyon.
        [extremum] Binabalewala ang walang lamang extremum ng punsiyon.
        [point] Binabalewala ang walang lamang punto ng punsiyon.
       *[other] Binabalewala ang walang lamang { $type } ng punsiyon.
    }

function-points-too-close = May dalawang puntong masyadong magkalapit ang punsiyon. Hindi matukoy ang punsiyon.

function-iterates-input-output-mismatch = Posible lamang ang mga pag-ulit ng punsiyon kung katumbas ng bilang ng output ang bilang ng input. May { $inputs } input at { $outputs } output ang punsiyong ito.

## `<sequence>`

sequence-invalid-length = Di-wastong haba ng sunuran. Dapat itong hindi negatibong integer.

sequence-invalid-step = Di-wastong hakbang ng sunuran. Para sa sunurang uri { $type }, dapat itong isang numero.

sequence-invalid-endpoint-number = Di-wasto ang "{ $attribute }" ng sunuran ng mga numero. Dapat itong isang numero.

sequence-invalid-endpoint-letters = Di-wasto ang "{ $attribute }" ng sunuran ng mga titik. Dapat itong kombinasyon ng mga titik.

sequence-invalid-endpoint = Di-wasto ang "{ $attribute }" ng sunuran.

select-from-sequence-coprime-not-numbers = Binabalewala ang coprime dahil hindi mga numero ang pinipili

select-from-sequence-coprime-with-exclude-combinations = Binabalewala ang coprime dahil tinukoy ang excludeCombinations

## Resolving a `target`

target-not-found = Di-wastong target para sa `<{ $source }>`: hindi matagpuan ang target.

target-state-variable-not-found = Di-wastong target para sa `<{ $source }>`: hindi matagpuan ang baryabol ng estado na "{ $property }" sa `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Dapat magkaiba ang mga baryabol ng `<odeSystem>` sa malayang baryabol.

ode-system-duplicate-variable-names = Hindi matukoy ang mga punsiyong ODE RHS na may paulit-ulit na pangalan ng dependenteng baryabol.

ode-system-rhs-function-error = Hindi matukoy ang punsiyong ODE RHS. May error sa paglikha ng punsiyong mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Hindi matukoy ang anggulo sa pagitan ng { $count } guhit

angle-invalid-through-point = Di-wastong punto sa through ng `<angle>`

parabola-vertex-too-many-points = Hindi pa naipapatupad ang parabola na may vertex at dumaraan sa higit sa 1 punto.

parabola-too-many-points = Hindi pa naipapatupad ang parabola na dumaraan sa higit sa 3 punto.

intersection-too-many-items = Hindi pa naipapatupad ang interseksiyon para sa higit sa dalawang aytem

## Other math components

ionic-compound-not-two-ions = Hindi pa naipapatupad ang ionic compound para sa anumang bagay maliban sa dalawang ion.

ionic-compound-needs-cation-and-anion = Naipatupad lamang ang ionic compound para sa isang cation at isang anion.

solve-equations-cannot-evaluate = Hindi malutas ang ekwasyon dahil hindi ito maeebalweyt: { $equation }

math-operators-operand-number-required = Dapat tukuyin ang operandNumber kapag kumukuha ng operand na matematikal.

eigen-decomposition-failed = Hindi makalkula ang mga eigenvalue ng matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: hindi lumilitaw sa padron ang parameter na { $parameters }, kaya lagi itong tutugma sa isang blangko.

## `<graph>`

graph-grid-invalid = `<graph>`: hindi mabasa ang grid="{ $grid }". Dapat itong none, medium, dense, o dalawang positibong numero na pinaghihiwalay ng espasyo, tulad ng grid="1 0.5". Walang iginuhit na grid.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: hindi suportado ang xLabelPosition="left" sa renderer na prefigure; ginagamit ang kilos ng posisyong kanan.

prefigure-y-label-position-unsupported = `<graph>`: hindi suportado ang yLabelPosition="bottom" sa renderer na prefigure; ginagamit ang kilos ng posisyong itaas.

prefigure-invalid-axis-bounds = `<graph>`: di-wastong hangganan ng aksis para sa pagpapalit sa prefigure; ginagamit ang default na bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: di-wastong lapad para sa pagpapalit sa prefigure; ginagamit ang default na lapad ng diagram na 425.

prefigure-invalid-aspect-ratio = `<graph>`: di-wastong aspectRatio para sa pagpapalit sa prefigure; ginagamit ang default na ratio na 1.

prefigure-grid-spacing-too-fine = `<graph>`: masyadong pino ang agwat ng grid para sa mga hangganan ng aksis; inaalis ang grid sa renderer na prefigure.

prefigure-annotations-not-rendered = `<graph>`: hindi ipapakita ang mga anotasyon kapag hindi ginagamit ang renderer na PreFigure.

multiple-annotations-children = Maraming anak na `<annotations>` ang natagpuan sa `<graph>`; binabalewala ang lahat maliban sa huli.

## Referring to other components

copy-unrecognized-component-type = Hindi maaaring palawakin o kopyahin ang di-kilalang uri ng bahagi: { $type }.

copy-prop-not-found = Hindi matagpuan ang katangiang { $property } sa bahaging uri { $component }

collect-no-source = Walang natagpuang pinagmulan para sa collect.

collect-invalid-component-type = Hindi matipon ang mga bahaging uri `<{ $component }>` dahil di-wastong uri ito ng bahagi.

reference-index-unavailable = Hindi matukoy ang indeks na `{ $reference }`

## `<callAction>`

component-action-unavailable = Hindi matawag ang { $action } sa bahaging `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Di-wastong hugis ng datos. Hindi pare-pareho ang haba ng mga hanay. Natagpuan sa componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = May paulit-ulit na pangalan ng kolum ang datos. Natagpuan sa componentIdx :{ $componentIdx }

data-frame-missing-column-name = May kulang na pangalan ng kolum ang datos. Natagpuan sa componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ang isang award para sa sagot na ito ay nakabatay sa sagot na ipinasa mismo ng tag na answer, na magdudulot ng hindi inaasahang kilos.

answer-max-num-attempts-in-section-wide-check-work = Walang epekto ang pagtatakda ng `maxNumAttempts` sa `<answer>` na nasa loob ng lalagyang may `sectionWideCheckWork`, dahil ang lalagyan ang kumokontrol sa bilang ng pagsubok. Itakda ang `maxNumAttempts` sa lalagyan.

nested-section-wide-check-work-max-num-attempts = Walang epekto ang pagtatakda ng `maxNumAttempts` sa lalagyang may `sectionWideCheckWork` na nasa loob ng ibang lalagyang may `sectionWideCheckWork`, dahil ang panlabas na lalagyan ang kumokontrol sa bilang ng pagsubok. Itakda ang `maxNumAttempts` sa panlabas na lalagyan.

answer-attributes-need-symbolic-equality = Walang magiging epekto ang attribute na { $attributes } kung hindi nakatakda ang symbolicEquality.

answer-invalid-type = Di-wastong uri para sa sagot: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Dahil walang pangalan ang bahaging `<{ $component }>`, hindi ito magagamit bilang attribute ng module

module-attribute-name-already-defined = Hindi magagamit ang bahaging `<{ $component } name="{ $name }">` bilang attribute ng module dahil may attribute nang "{ $name }" ang uri ng bahaging `<module>`.

conditional-content-condition-ignored = Binabalewala ang attribute na `condition` sa bahaging `<conditionalContent>` na may anak na case o else.

slider-markers-type-mismatch = Hindi tugma ang uri ng mga marker sa uri ng slider.

pretzel-problem-needs-statement-and-answer = Di-wastong pretzel: dapat maglaman ang bawat `<problem>` ng isang `<statement>` at isang `<answer>`.

pretzel-circuit-first-problem-distractor = Di-wastong pretzel: sa mode="circuit", hindi maaaring maging distractor ang unang `<problem>`.

## Attribute values

attribute-invalid-values = Di-wastong halagang { $values } para sa attribute na `{ $attribute }`; binabalewala.

attribute-must-be-references = Di-wastong halagang `{ $value }` para sa attribute na `{ $attribute }`. Dapat binubuo ang attribute ng mga sanggunian na nagsisimula sa `$`.

math-input-invalid-function-names = <mathInput>: binalewala ang di-wastong pangalan ng punsiyon sa { $attribute }: { $names }. Dapat may hindi bababa sa 2 karakter (mga titik o gitling) ang bahaging ipinapakita ng bawat pangalan; maaaring sundan ito ng opsiyonal na `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Di-wastong uri ng bahagi: `<{ $componentType }>`

attribute-repeated = Hindi maaaring ulitin ang attribute na { $attribute }.

attribute-invalid-for-component = Di-wastong attribute na "{ $attribute }" para sa bahaging uri `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Kulang ang kontrast ng depinisyon ng estilong { $styleNumber } para sa { $context ->
        [text-on-background] kulay ng teksto laban sa kulay ng bakgrawnd
        [high-contrast] kulay na mataas ang kontrast laban sa kanbas
        [line] kulay ng guhit laban sa kanbas
        [marker] kulay ng marker laban sa kanbas
       *[text-on-canvas] kulay ng teksto laban sa kanbas
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kailangan ng hindi bababa sa { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Bagaman tumukoy ang depinisyon ng estilong { $styleNumber } ng mga kulay na sapat ang kontrast para sa light mode, kulang ang kontrast ng kulay ng teksto laban sa kulay ng bakgrawnd sa mga kulay ng dark mode na hinango mula rito ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kailangan ng hindi bababa sa { $threshold }:1). { $suggestion ->
        [available] Para matiyak ang sapat na kontrast sa dark mode, taasan ang kontrast sa light mode (halimbawa, itakda ang { $lightAttribute }="{ $lightColor }") o palitan ang kulay ng dark mode (halimbawa, itakda ang { $darkAttribute }="{ $darkColor }").
       *[none] Para matiyak ang sapat na kontrast sa dark mode, taasan ang kontrast sa light mode o palitan ang mga hinangong kulay gamit ang textColorDarkMode at/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Bagaman tumukoy ang depinisyon ng estilong { $styleNumber } ng kulay ng teksto na sapat ang kontrast para sa light mode, kulang ang kontrast laban sa kanbas ng kulay ng teksto sa dark mode na hinango mula rito ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kailangan ng hindi bababa sa { $threshold }:1). { $suggestion ->
        [available] Para matiyak ang sapat na kontrast sa dark mode, taasan ang kontrast sa light mode (halimbawa, itakda ang textColor="{ $lightColor }") o palitan ang kulay ng dark mode (halimbawa, itakda ang textColorDarkMode="{ $darkColor }").
       *[none] Para matiyak ang sapat na kontrast sa dark mode, taasan ang kontrast sa light mode o palitan ang hinangong kulay gamit ang textColorDarkMode.
    }

section-multiple-style-palettes = Isang <stylePalette> lamang ang maaaring piliin ng isang seksiyon; ginagamit ang huli.

## Unique variants

variant-num-to-select-not-non-negative-integer = hindi matukoy ang natatanging mga baryante ng { $component } dahil hindi hindi-negatibong integer ang numToSelect.

variant-num-to-select-not-constant-number = hindi matukoy ang natatanging mga baryante ng { $component } dahil hindi konstanteng numero ang numToSelect.

variant-with-replacement-not-constant-boolean = hindi matukoy ang natatanging mga baryante ng { $component } dahil hindi konstanteng boolean ang withReplacement.

variant-select-weight-disables-unique = Hindi pinagagana ang natatanging mga baryante para sa select kung may opsiyong tinukuyan ng selectWeight o selectForVariants

variant-coprime-undetermined = hindi matukoy ang natatanging mga baryante ng { $component } dahil hindi matiyak na laging mali ang coprime.

variant-attribute-not-constant = hindi matukoy ang natatanging mga baryante ng { $component } dahil hindi konstante ang { $attribute }.

variant-attribute-not-number = hindi matukoy ang natatanging mga baryante ng { $component } dahil hindi numero ang { $attribute }.

variant-attribute-wrong-type-for-sequence =
    hindi matukoy ang natatanging mga baryante ng { $component } na uri { $type } dahil ang { $attribute } ay hindi { $expected ->
        [letters-combination] kombinasyon ng mga titik
        [math-expression] wastong ekspresyong matematikal
        [integer] integer
       *[number] numero
    }.

variant-length-not-integer = hindi matukoy ang natatanging mga baryante ng { $component } dahil hindi integer ang length.

variant-sort-not-implemented = hindi pa naipapatupad ang natatanging mga baryante ng { $component } na may sort

variant-exclude-combinations-not-implemented = hindi pa naipapatupad ang natatanging mga baryante ng { $component } na may excludeCombinations

variant-math-exclude-not-implemented = hindi pa naipapatupad ang natatanging mga baryante ng { $component } na uri math na may exclude

variant-non-constant-exclude-not-implemented = hindi pa naipapatupad ang natatanging mga baryante ng { $component } na may hindi konstanteng exclude

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: hindi suportado sa renderer na graph prefigure; nilaktawan ang inapo.

prefigure-descendant-invalid-geometry = { $subject }: hindi may hangganan o hindi kumpletong heometriya; nilaktawan ang inapo.

prefigure-curve-label-omitted = { $subject }: hindi suportado ang mga label sa mga elementong kurba na na-convert; inalis ang label.

prefigure-curve-unsupported-definition-type = { $subject }: hindi suportadong uri ng depinisyon ng punsiyong kurba na '{ $definitionType }'; nilaktawan ang inapo.

prefigure-region-flip-functions-unsupported = { $subject }: hindi suportadong attribute na flipFunctions sa regionBetweenCurves; nilaktawan ang inapo.

prefigure-region-non-formula-child = { $subject }: mga anak na punsiyong uri formula lamang ang suportado sa regionBetweenCurves; nilaktawan ang inapo.

prefigure-label-position-unsupported =
    { $subject }: hindi suportadong labelPosition na '{ $labelPosition }' para sa { $labelKind ->
        [line-family] label ng pamilya ng guhit
       *[point] label ng punto
    }; ginamit ang default na pagkakahanay ng PreFigure.

prefigure-fill-style-unsupported = { $subject }: hindi suportado ng PreFigure ang estilo ng laman na '{ $fillStyle }'; bumabalik sa buong laman.

prefigure-line-style-unknown = { $subject }: inalis sa output ng PreFigure ang di-kilalang estilo ng guhit na '{ $lineStyle }'.

prefigure-marker-style-mapped-to-diamond = { $subject }: itinugma ang estilo ng marker na '{ $markerStyle }' sa estilong 'diamond' ng PreFigure.

prefigure-marker-style-unsupported = { $subject }: hindi suportado ng PreFigure ang estilo ng marker na '{ $markerStyle }'; ginamit ang default na estilo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: di-wastong `ref`; hindi matukoy ang target. Inalis ang anotasyon.

annotation-ref-multiple-targets = `<annotation>`: maraming target ang natukoy ng `ref`; ginagamit ang unang target.

annotation-ref-outside-graph = `<annotation>`: di-wastong `ref`; nasa labas ng naglalamang grap ang target. Inalis ang anotasyon.

annotation-ref-unsupported-target = `<annotation>`: di-wastong `ref`; hindi suportadong bagay na graphical ang target sa pagpapalit sa prefigure. Inalis ang anotasyon.

annotation-text-missing = `<annotation>`: kulang o walang laman ang `text`; naglalabas ng walang lamang teksto.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] May natukoy na paikot na dependensiya.
       *[other] May natukoy na paikot na dependensiya na kinasasangkutan ng bahaging `<{ $componentType }>`.
    }

reference-no-referent = Walang natagpuang tinutukoy ng sanggunian: `{ $reference }`

reference-multiple-referents = Maraming natagpuang tinutukoy ng sanggunian: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Di-wastong format para sa attribute na { $attribute } ng `<{ $componentType }>`.

children-invalid = Di-wastong mga anak para sa `<{ $componentType }>`: May natagpuang di-wastong mga anak: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Di-wastong halagang `{ $value }` para sa attribute na `{ $attribute }`, ginagamit ang halagang `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Hindi matagpuan ang DoenetML bersyon { $version }.
       *[other] Hindi matagpuan ang DoenetML bersyon { $version }. Babalik sa bersyon { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Di-wastong DoenetML: { $content }

parse-tag-missing-close-tag = Di-wastong DoenetML: Walang pansarang tag ang tag na `{ $tag }`. Inaasahan ang tag na nagsasara sa sarili o isang tag na `</{ $tagName }>`.

parse-tag-error = Di-wastong DoenetML: May error sa tag na `<{ $tagName }>`

parse-attribute-missing-value = Di-wastong DoenetML: Mukhang walang halaga ang di-wastong attribute na `{ $attribute }`.

parse-attribute-invalid = Di-wastong DoenetML: Di-wastong attribute na `{ $attribute }`

parse-attribute-value-invalid = Di-wastong DoenetML: Di-wastong halaga ng attribute na `{ $value }`

parse-attribute-value-quote-mismatch = Di-wastong DoenetML: Di-wastong halaga ng attribute na `{ $value }`. Hindi magkatugma ang mga panipi. Mukhang kulang ang `{ $quote }`

parse-open-tag-name-missing = Di-wastong DoenetML: May natagpuang tag na walang pangalan, halimbawa `<`

parse-tag-not-closed = Di-wastong DoenetML: Hindi naisara ang tag na `{ $tag }` (mukhang kulang ang `>`).

parse-self-closing-tag-name-missing = Di-wastong DoenetML: May natagpuang tag na walang pangalan `<{ $content }>`

parse-self-closing-tag-not-closed = Di-wastong DoenetML: Hindi naisara ang tag na `{ $tag }` (mukhang kulang ang `/>`).

parse-tag-invalid-attributes = Di-wastong DoenetML: Di-wasto ang tag na `{ $tag }`. Maaaring mali ang mga attribute nito.

parse-close-tag-name-missing = Di-wastong DoenetML: May natagpuang pansarang tag na walang pangalan, halimbawa `</`

parse-attribute-value-unquoted = Dapat nakapaloob sa panipi ang mga halaga ng attribute: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Di-wastong DoenetML: May natagpuang pansarang tag na `{ $tag }`, ngunit walang katugmang pambukas na tag

parse-close-tag-mismatched = Di-wastong DoenetML: Hindi magkatugma ang pansarang tag. Inaasahan ang `</{ $expected }>`. Natagpuan ang `{ $found }`

parser-node-unconvertible = Hindi ma-convert ang node na { $node } sa node na Dast.

## Names

name-attribute-invalid =
    Di-wastong attribute na name='{ $name }'. { $reason ->
        [characters] Maaari lamang maglaman ng mga titik, numero, underscore, o gitling ang mga pangalan.
       *[start] Dapat magsimula sa titik ang mga pangalan.
    }

component-name-invalid-start = Di-wastong pangalan ng bahagi na "{ $name }". Dapat magsimula sa titik ang mga pangalan.

## `<answer>` sugar

answer-video-watched-missing-video = Dapat may attribute na video ang sagot na uri videoWatched

answer-video-watched-video-not-reference = Dapat sanggunian ang attribute na video ng sagot na uri videoWatched

answer-name-not-single-text = Dapat may iisang anak na text ang attribute na name ng sagot

## Referencing another document

external-doenetml-recursion-limit = Hindi makuha ang panlabas na DoenetML dahil sa napakaraming antas ng rekursiyon. May paikot na sanggunian ba?

external-doenetml-unavailable = Hindi makuha ang DoenetML mula sa { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Di-wasto ang DoenetML na nakuha mula sa { $attribute }="{ $uri }": hindi ito tugma sa uri ng bahaging "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ititigil na ang attribute na `{ $from }`; gamitin ang `{ $to }` sa halip.
       *[other] [deprecation] Ititigil na ang attribute na `{ $from }` sa `<{ $component }>`; gamitin ang `{ $to }` sa halip.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ititigil na at binabalewala ang attribute na `{ $from }` dahil tinukoy din ang `{ $to }`.
       *[other] [deprecation] Ititigil na at binabalewala ang attribute na `{ $from }` sa `<{ $component }>` dahil tinukoy din ang `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Ititigil na at binabalewala ang attribute na `{ $attribute }` sa `<{ $component }>`.


## Language coverage

pluralize-english-only = Ingles lamang ang kayang pluralin ng `<pluralize>`, kaya hindi binabago ang teksto nito sa dokumentong nakasulat sa { $locale }. Isulat nang tuwiran ang anyong pangmaramihan, o itakda ito sa pamamagitan ng attribute na `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Hindi kilalang elemento ng Doenet ang `<{ $tag }>`.

schema-element-not-allowed-at-root = Hindi pinapayagan ang elementong `<{ $tag }>` sa ugat ng dokumento.

schema-element-not-allowed-inside = Hindi pinapayagan ang elementong `<{ $tag }>` sa loob ng `<{ $parent }>`.

schema-attribute-unrecognized = Walang attribute na `{ $attribute }` ang elementong `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Dapat listahan ang attribute na `{ $attribute }` ng elementong `<{ $tag }>` na ang bawat aytem ay isa sa: { $allowed }
       *[other] Dapat isa sa mga sumusunod ang attribute na `{ $attribute }` ng elementong `<{ $tag }>`: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Di-wastong pangalan ng baryante para sa select. Lumilitaw ang pangalang { $variantName } sa { $numOptions } opsiyon ngunit { $numToSelect } ang bilang na pipiliin.

select-variant-name-without-options = May mga baryanteng tinukoy para sa select ngunit walang opsiyong tinukoy para sa posibleng pangalan ng baryante: { $variantName }.

select-variant-name-not-possible = Ang pangalan ng baryante na { $variantName } na tinukoy para sa select ay hindi posibleng pangalan ng baryante.

select-too-few-options = Hindi makapili ng { $numToSelect } bahagi mula sa { $numOptions } lamang.

select-from-sequence-too-few-values = Hindi makapili ng { $numToSelect } halaga mula sa sunuran na may habang { $length }.

select-from-sequence-indices-count-mismatch = Dapat tumugma ang bilang ng mga indeks na tinukoy para sa select sa bilang na pipiliin

select-from-sequence-indices-not-integers = Dapat integer ang lahat ng indeks na tinukoy para sa select

select-from-sequence-index-excluded = Tinukoy ang indeks ng selectfromsequence na ibinukod

select-from-sequence-indices-excluded-combination = Tinukoy ang mga indeks ng selectfromsequence na isang ibinukod na kombinasyon

select-from-sequence-coprime-not-positive-integers = Hindi makapili ng mga kombinasyong coprime dahil hindi positibong integer ang pinipili.

select-from-sequence-coprime-common-factor = Hindi makapili ng mga numerong coprime. May iisang salik na magkatulad ang lahat ng posibleng halaga. (Dapat coprime sa "step" ang tinukoy na halaga ng "from" o "to".)

select-from-sequence-coprime-single-number = Hindi makapili ng mga kombinasyong coprime mula sa iisang numerong hindi 1.

select-from-sequence-excluded-too-many-combinations = Mahigit 70% ng mga kombinasyon ang ibinukod sa selectFromSequence

select-from-sequence-coprime-none-found = Hindi makapili ng mga numerong coprime. May iisang salik na magkatulad ang lahat ng posibleng halaga.

select-from-sequence-too-few-unique-values = Hindi makapili ng { $numToSelect } natatanging halaga mula sa sunuran na may habang { $numPossibleValues }

select-prime-numbers-too-few-values = Hindi makapili ng { $numToSelect } halaga mula sa listahan ng mga primo na may habang { $numValues }

select-prime-numbers-values-count-mismatch = Dapat tumugma ang bilang ng mga halagang tinukoy para sa select sa bilang na pipiliin

select-prime-numbers-values-not-prime = Dapat nasa listahan ng mga primo ang lahat ng halagang tinukoy para sa select prime number

select-prime-numbers-values-excluded-combination = Isang ibinukod na kombinasyon ang mga halagang tinukoy para sa selectPrimeNumbers

select-prime-numbers-excluded-too-many-combinations = Mahigit 70% ng mga kombinasyon ang ibinukod sa selectPrimeNumbers

select-random-combination-fluke = Dahil sa isang halos imposibleng pagkakataon, hindi makapili ng kombinasyon ng mga random na halaga

select-random-value-fluke = Dahil sa isang halos imposibleng pagkakataon, hindi makapili ng random na halaga
