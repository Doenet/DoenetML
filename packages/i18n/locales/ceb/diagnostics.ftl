# Cebuano diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# A Cebuano numeral joins what it counts with the invariable «ka», so the
# counted messages here need no selection even though CLDR gives the language
# two plural categories — see the header of `chrome.ftl`.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = Wala tagda ang { $attributes } kon gitino na ang duha ka tumoy

line-segment-attributes-ignored-with-endpoint-and-midpoint = Wala tagda ang { $attributes } kon gitino na ang tumoy ug ang tunga-tunga nga punto

line-segment-midpoint-offset-without-midpoint = Walay epekto ang midpointOffset kon walay tunga-tunga nga punto

## `<line>`

line-points-undetermined-dimensions = Linya nga moagi sa mga punto nga wala matino ang gidak-on sa dimensyon.

line-points-too-few-dimensions = Ang linya kinahanglang moagi sa mga punto nga adunay labing menos duha ka dimensyon.

line-points-depend-on-variables = Ang linya moagi sa mga punto nga nagsalig sa mga baryable: { $variables }.

line-equation-invalid-format = Dili balido nga porma sa ekwasyon sa linya sa mga baryable nga { $variable1 } ug { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ang sinag gitino pinaagi sa through, endpoint ug direction. Wala tagda ang gitino nga through.

ray-dimension-mismatch = Wala magtakdo ang numDimensions sa sinag.

## `<vector>`

vector-overprescribed-head = Ang bektor gitino pinaagi sa head, tail ug displacement. Wala tagda ang gitino nga head.

vector-dimension-mismatch = Wala magtakdo ang numDimensions sa bektor.

## Attracting and constraining

attract-to-without-nearest-point = Dili makadani ngadto sa `<{ $component }>` kay wala kini nearestPoint nga baryable sa kahimtang.

constrain-to-without-nearest-point = Dili makapugong ngadto sa `<{ $component }>` kay wala kini nearestPoint nga baryable sa kahimtang.

constrain-to-interior-without-nearest-point = Dili makapugong sulod sa `<{ $component }>` kay wala kini nearestPoint nga baryable sa kahimtang.

## `<choiceInput>`

choice-input-label-position-ignored = Wala tagda ang labelPosition alang sa choiceInput nga dili inline

## Ordering children by index

choice-input-indices-count-mismatch = Wala tagda ang mga indices nga gitino alang sa choiceInput kay ang gidaghanon sa indices wala magtakdo sa gidaghanon sa mga anak nga choice.

pretzel-indices-count-mismatch = Wala tagda ang mga indices nga gitino alang sa problem kay ang gidaghanon sa indices wala magtakdo sa gidaghanon sa mga anak nga problem.

shuffle-indices-count-mismatch = Wala tagda ang mga indices nga gitino alang sa shuffle kay ang gidaghanon sa indices wala magtakdo sa gidaghanon sa mga sangkap.

indices-ignored-out-of-range = Wala tagda ang mga indices nga gitino alang sa { $component } kay adunay mga indices nga gawas sa gilay-on.

pretzel-indices-repeated = Wala tagda ang mga indices nga gitino alang sa pretzel kay adunay mga indices nga gibalikbalik.

pretzel-circuit-first-index = Wala tagda ang mga indices nga gitino alang sa pretzel sa mode nga circuit kay ang unang index kinahanglang 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Aron molihok ang `<{ $component }>` uban ang mga anak nga teksto, kinahanglang itino ang atributo nga `type`.

invalid-type-defaulting-to-math = Dili balido nga type { $type } alang sa sangkap nga { $component }. Kinahanglan usa sa math, text, number o boolean. Mogamit ug math.

string-not-valid-component-to-arrange = Ang teksto nga "{ $value }" dili balido nga sangkap alang sa { $component }. Wala kini tagda.

## Types and variables

invalid-type-defaulting-to-number = Dili balido nga type { $type }, itakda ang type nga number.

invalid-variable-value = Dili balido nga bili sa baryable: `{ $value }`

## Variants

variant-index-must-be-number = Ang index sa variant nga { $index } kinahanglang numero

variant-index-must-be-integer = Ang index sa variant nga { $index } kinahanglang integer

## `<sideBySide>`

side-by-side-absolute-widths = Wala pa gihimo ang `<{ $component }>` alang sa absolute nga sukod. Itakda ang gilapdon nga relatibo.

side-by-side-absolute-margins = Wala pa gihimo ang `<{ $component }>` alang sa absolute nga sukod. Itakda ang mga margin nga relatibo.

side-by-side-no-block-child = Dili balido nga `<{ $component }>`: kinahanglan kini adunay labing menos usa ka anak nga block.

## `<label>`

label-for-ignored-on-graphical = Wala tagda ang atributo nga `for` sa graphical nga `<label>`.

label-for-must-resolve-to-one = Ang atributo nga `for` sa `<label>` kinahanglang motudlo sa usa lamang ka sangkap.

label-for-unresolved = Ang atributo nga `for` sa `<label>` wala makatudlo sa bisan unsang sangkap.

label-for-answer-with-authored-inputs = Ang atributo nga `for` sa `<label>` nagtudlo sa `<answer>` nga adunay mga input nga gisulat sa awtor; tudloa ang input direkta.

label-for-answer-without-input = Ang atributo nga `for` sa `<label>` nagtudlo sa `<answer>` nga walay input nga malabelan.

label-for-must-reference-input-or-answer = Ang atributo nga `for` sa `<label>` kinahanglang motudlo sa usa ka input o answer.

## Accessibility

accessibility-short-description-or-decorative = Alang sa aksesibilidad, ang `<{ $component }>` kinahanglang adunay mubo nga paghulagway o itino nga dekorasyon.

accessibility-video-short-description = Alang sa aksesibilidad, ang `<video>` kinahanglang adunay mubo nga paghulagway.

accessibility-input-short-description-or-label = Alang sa aksesibilidad, ang `<{ $component }>` kinahanglang adunay mubo nga paghulagway o label.

accessibility-answer-input-short-description-or-label = Alang sa aksesibilidad, ang `<answer>` nga naghimo ug input kinahanglang adunay mubo nga paghulagway o label.

accessibility-short-description-contains-math = Ang mubo nga paghulagway dili angay maglakip ug mga sangkap sa matematika sama sa `<{ $component }>`. Isulat ang matematika sa mga pulong.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Kulang ang kontraste sa { $colorName } alang sa teksto sa ulohan sa seksyon (ngitngit nga mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nagkinahanglan ug labing menos { $threshold }:1).
       *[other] Kulang ang kontraste sa { $colorName } alang sa teksto sa ulohan sa seksyon ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nagkinahanglan ug labing menos { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Wala pa gihimo ang `<circle>` nga moagi sa { $count } ka punto kon ang mga punto walay numero nga bili.

circle-too-many-through-points = Dili makakwenta ug sirkulo nga moagi sa kapin sa 3 ka punto.

circle-overprescribed-radius-center-points = Dili makakwenta ug sirkulo nga gitino ang radius, sentro ug mga punto nga agian.

circle-center-with-multiple-points = Dili makakwenta ug sirkulo nga gitino ang sentro ug moagi sa kapin sa 1 ka punto.

circle-radius-too-small = Dili makakwenta ug sirkulo: tungod kay ang gilay-on tali sa duha ka punto mao ang { $distance }, gamay ra kaayo ang gitino nga radius nga { $radius }.

circle-radius-with-many-points = Dili makahimo ug sirkulo nga moagi sa kapin sa duha ka punto uban ang gitino nga radius.

circle-invalid-center-or-through-points = Dili balido ang sentro o ang mga punto nga agian sa sirkulo.

circle-radius-center-with-multiple-points = Dili makakwenta sa radius sa sirkulo nga gitino ang sentro ug moagi sa kapin sa 1 ka punto.

circle-change-radius-non-numerical = Dili mausab ang radius sa sirkulo nga ang mga punto dili numero

circle-radius-with-points-non-numerical = Dili makahimo ug sirkulo nga moagi sa kapin sa usa ka punto uban ang gitino nga radius kon walay numero nga bili.

circle-change-center-non-numerical = Wala pa gihimo ang pag-usab sa sentro sa sirkulo nga moagi sa mga punto nga dili numero.

## `<function>`

function-domain-insufficient-dimensions = Kulang ang dimensyon sa domain alang sa punsyon. Ang domain adunay { $intervals } ka interbalo apan ang punsyon adunay { $inputs } ka input.

function-domain-invalid-format = Dili balido nga porma sa domain alang sa punsyon.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Wala tagda ang dili-numero nga maksimum sa punsyon.
        [minimum] Wala tagda ang dili-numero nga minimum sa punsyon.
        [extremum] Wala tagda ang dili-numero nga ekstremum sa punsyon.
        [point] Wala tagda ang dili-numero nga punto sa punsyon.
        [slope] Wala tagda ang dili-numero nga slope sa punsyon.
       *[other] Wala tagda ang dili-numero nga { $type } sa punsyon.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Wala tagda ang walay sulod nga maksimum sa punsyon.
        [minimum] Wala tagda ang walay sulod nga minimum sa punsyon.
        [extremum] Wala tagda ang walay sulod nga ekstremum sa punsyon.
        [point] Wala tagda ang walay sulod nga punto sa punsyon.
       *[other] Wala tagda ang walay sulod nga { $type } sa punsyon.
    }

function-points-too-close = Ang punsyon adunay duha ka punto nga duol ra kaayo. Dili matino ang punsyon.

function-iterates-input-output-mismatch = Ang pag-usab-usab sa punsyon posible lamang kon ang gidaghanon sa input katumbas sa gidaghanon sa output. Kini nga punsyon adunay { $inputs } ka input ug { $outputs } ka output.

## `<sequence>`

sequence-invalid-length = Dili balido ang gitas-on sa sunodsunod. Kinahanglan integer nga dili negatibo.

sequence-invalid-step = Dili balido ang lakang sa sunodsunod. Kinahanglan numero alang sa sunodsunod nga matang { $type }.

sequence-invalid-endpoint-number = Dili balido ang "{ $attribute }" sa sunodsunod sa numero. Kinahanglan numero.

sequence-invalid-endpoint-letters = Dili balido ang "{ $attribute }" sa sunodsunod sa mga letra. Kinahanglan kombinasyon sa mga letra.

sequence-invalid-endpoint = Dili balido ang "{ $attribute }" sa sunodsunod.

select-from-sequence-coprime-not-numbers = Wala tagda ang coprime kay dili mga numero ang gipili

select-from-sequence-coprime-with-exclude-combinations = Wala tagda ang coprime kay gitino ang excludeCombinations

## Resolving a `target`

target-not-found = Dili balido nga target alang sa `<{ $source }>`: wala makit-i ang target.

target-state-variable-not-found = Dili balido nga target alang sa `<{ $source }>`: wala makit-i ang baryable sa kahimtang nga ginganlag "{ $property }" sa `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Ang mga baryable sa `<odeSystem>` kinahanglang lahi sa independent nga baryable.

ode-system-duplicate-variable-names = Dili matino ang mga punsyon sa tuo nga bahin sa ODE nga adunay managsamang ngalan sa dependent nga baryable.

ode-system-rhs-function-error = Dili matino ang punsyon sa tuo nga bahin sa ODE. Adunay sayop sa paghimo sa punsyon nga mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Dili matino ang anggulo tali sa { $count } ka linya

angle-invalid-through-point = Dili balido nga punto sa through sa `<angle>`

parabola-vertex-too-many-points = Wala pa gihimo ang parabola nga adunay bertise ug moagi sa kapin sa 1 ka punto.

parabola-too-many-points = Wala pa gihimo ang parabola nga moagi sa kapin sa 3 ka punto.

intersection-too-many-items = Wala pa gihimo ang intersection alang sa kapin sa duha ka butang

## Other math components

ionic-compound-not-two-ions = Wala pa gihimo ang ionic nga compound alang sa lain gawas sa duha ka ion.

ionic-compound-needs-cation-and-anion = Ang ionic nga compound gihimo lamang alang sa usa ka cation ug usa ka anion.

solve-equations-cannot-evaluate = Dili masulbad ang ekwasyon kay dili kini maevalwar: { $equation }

math-operators-operand-number-required = Kinahanglang itino ang operandNumber kon mokuha ug operand sa matematika.

eigen-decomposition-failed = Dili makakwenta sa mga eigenvalue sa matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: ang parametro nga { $parameters } wala makita sa sumbanan, busa kanunay kining motakdo sa walay sulod.

## `<graph>`

graph-grid-invalid = `<graph>`: dili masabot ang grid="{ $grid }". Kinahanglan kini none, medium, dense, o duha ka positibo nga numero nga gilain sa espasyo, sama sa grid="1 0.5". Walay grid nga gidrowing.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: dili suportado ang xLabelPosition="left" sa prefigure nga renderer; mogamit sa paggawi sa tuo nga posisyon.

prefigure-y-label-position-unsupported = `<graph>`: dili suportado ang yLabelPosition="bottom" sa prefigure nga renderer; mogamit sa paggawi sa ibabaw nga posisyon.

prefigure-invalid-axis-bounds = `<graph>`: dili balido ang mga utlanan sa aksis alang sa pagkabig ngadto sa prefigure; mogamit sa default nga bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: dili balido ang gilapdon alang sa pagkabig ngadto sa prefigure; mogamit sa default nga gilapdon sa diagram nga 425.

prefigure-invalid-aspect-ratio = `<graph>`: dili balido ang aspectRatio alang sa pagkabig ngadto sa prefigure; mogamit sa default nga ratio nga 1.

prefigure-grid-spacing-too-fine = `<graph>`: hilabihan ka pig-ot ang espasyo sa grid alang sa mga utlanan sa aksis; wala iapil ang grid sa prefigure nga renderer.

prefigure-annotations-not-rendered = `<graph>`: dili irender ang mga anotasyon kon dili gamiton ang PreFigure nga renderer.

multiple-annotations-children = Daghang anak nga `<annotations>` ang nakit-an sa `<graph>`; tanan gawas sa kataposan wala tagda.

## Referring to other components

copy-unrecognized-component-type = Dili maextend o makopya ang wala mailhi nga matang sa sangkap: { $type }.

copy-prop-not-found = Wala makit-i ang prop nga { $property } sa sangkap nga matang { $component }

collect-no-source = Walay tinubdan nga nakit-an alang sa collect.

collect-invalid-component-type = Dili matigom ang mga sangkap nga matang `<{ $component }>` kay dili kini balido nga matang sa sangkap.

reference-index-unavailable = Dili matudlo ang index nga `{ $reference }`

## `<callAction>`

component-action-unavailable = Dili matawag ang { $action } sa sangkap nga `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Dili balido ang porma sa datos. Wala magkatakdo ang gitas-on sa mga laray. Nakit-an sa componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Ang datos adunay managsamang ngalan sa kolum. Nakit-an sa componentIdx :{ $componentIdx }

data-frame-missing-column-name = Kulang ang datos ug ngalan sa kolum. Nakit-an sa componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ang award alang niini nga tubag nagsukad sa tubag nga gipadala mismo sa answer, nga mosangpot sa dili gilauman nga paggawi.

answer-max-num-attempts-in-section-wide-check-work = Walay epekto ang pagtakda sa `maxNumAttempts` sa `<answer>` sulod sa sudlanan nga adunay `sectionWideCheckWork`, kay ang gidaghanon sa higayon gikontrol sa sudlanan. Itakda hinuon ang `maxNumAttempts` sa sudlanan.

nested-section-wide-check-work-max-num-attempts = Walay epekto ang pagtakda sa `maxNumAttempts` sa sudlanan nga adunay `sectionWideCheckWork` nga anaa sulod sa laing sudlanan nga adunay `sectionWideCheckWork`, kay ang gidaghanon sa higayon gikontrol sa gawas nga sudlanan. Itakda hinuon ang `maxNumAttempts` sa gawas nga sudlanan.

answer-attributes-need-symbolic-equality = Walay epekto ang atributo nga { $attributes } kon wala matakda ang symbolicEquality.

answer-invalid-type = Dili balido nga matang alang sa answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Tungod kay ang sangkap nga `<{ $component }>` walay ngalan, dili kini magamit isip atributo sa module

module-attribute-name-already-defined = Ang sangkap nga `<{ $component } name="{ $name }">` dili magamit isip atributo sa module kay ang matang nga `<module>` aduna nay atributo nga "{ $name }".

conditional-content-condition-ignored = Wala tagda ang atributo nga `condition` sa sangkap nga `<conditionalContent>` nga adunay mga anak nga case o else.

slider-markers-type-mismatch = Wala magtakdo ang matang sa mga marka sa matang sa slider.

pretzel-problem-needs-statement-and-answer = Dili balido nga pretzel: matag `<problem>` kinahanglang adunay usa ka `<statement>` ug usa ka `<answer>`.

pretzel-circuit-first-problem-distractor = Dili balido nga pretzel: sa mode="circuit", ang unang `<problem>` dili mahimong distractor.

## Attribute values

attribute-invalid-values = Dili balido nga bili { $values } alang sa atributo nga `{ $attribute }`; wala kini tagda.

attribute-must-be-references = Dili balido nga bili `{ $value }` alang sa atributo nga `{ $attribute }`. Ang atributo kinahanglang gilangkoban sa mga reperensiya nga magsugod sa `$`.

math-input-invalid-function-names = <mathInput>: wala tagda ang dili balido nga mga ngalan sa punsyon sa { $attribute }: { $names }. Ang bahin nga makita sa matag ngalan kinahanglang labing menos 2 ka karakter (mga letra o gitlang); mahimong sundan sa `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Dili balido nga matang sa sangkap: `<{ $componentType }>`

attribute-repeated = Dili mabalikbalik ang atributo nga { $attribute }.

attribute-invalid-for-component = Dili balido ang atributo nga "{ $attribute }" alang sa sangkap nga matang `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Kulang ang kontraste sa depinisyon sa estilo nga { $styleNumber } alang sa { $context ->
        [text-on-background] kolor sa teksto batok sa kolor sa luyo
        [high-contrast] kolor nga taas ug kontraste batok sa kanbas
        [line] kolor sa linya batok sa kanbas
        [marker] kolor sa marka batok sa kanbas
       *[text-on-canvas] kolor sa teksto batok sa kanbas
    }{ $mode ->
        [dark] { " (ngitngit nga mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nagkinahanglan ug labing menos { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Bisan tuod ang depinisyon sa estilo nga { $styleNumber } nagtino ug mga kolor nga igo ang kontraste alang sa hayag nga mode, ang mga kolor alang sa ngitngit nga mode nga nakuha gikan niini kulang ang kontraste alang sa kolor sa teksto batok sa kolor sa luyo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nagkinahanglan ug labing menos { $threshold }:1). { $suggestion ->
        [available] Aron masiguro ang igo nga kontraste sa ngitngit nga mode, dugangi ang kontraste sa hayag nga mode (pananglitan, itakda ang { $lightAttribute }="{ $lightColor }") o ilisi ang kolor sa ngitngit nga mode (pananglitan, itakda ang { $darkAttribute }="{ $darkColor }").
       *[none] Aron masiguro ang igo nga kontraste sa ngitngit nga mode, dugangi ang kontraste sa hayag nga mode o ilisi ang nakuha nga mga kolor pinaagi sa textColorDarkMode ug/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Bisan tuod ang depinisyon sa estilo nga { $styleNumber } nagtino ug kolor sa teksto nga igo ang kontraste alang sa hayag nga mode, ang kolor sa teksto alang sa ngitngit nga mode nga nakuha gikan niini kulang ang kontraste batok sa kanbas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nagkinahanglan ug labing menos { $threshold }:1). { $suggestion ->
        [available] Aron masiguro ang igo nga kontraste sa ngitngit nga mode, dugangi ang kontraste sa hayag nga mode (pananglitan, itakda ang textColor="{ $lightColor }") o ilisi ang kolor sa ngitngit nga mode (pananglitan, itakda ang textColorDarkMode="{ $darkColor }").
       *[none] Aron masiguro ang igo nga kontraste sa ngitngit nga mode, dugangi ang kontraste sa hayag nga mode o ilisi ang nakuha nga kolor pinaagi sa textColorDarkMode.
    }

section-multiple-style-palettes = Usa ra ka <stylePalette> ang mapili sa usa ka seksyon; ang kataposan ang gamiton.

## Unique variants

variant-num-to-select-not-non-negative-integer = dili matino ang talagsaon nga mga variant sa { $component } kay ang numToSelect dili integer nga dili negatibo.

variant-num-to-select-not-constant-number = dili matino ang talagsaon nga mga variant sa { $component } kay ang numToSelect dili kanunay nga numero.

variant-with-replacement-not-constant-boolean = dili matino ang talagsaon nga mga variant sa { $component } kay ang withReplacement dili kanunay nga boolean.

variant-select-weight-disables-unique = Gipugngan ang talagsaon nga mga variant alang sa select kon adunay option nga nagtino ug selectWeight o selectForVariants

variant-coprime-undetermined = dili matino ang talagsaon nga mga variant sa { $component } kay dili matino nga ang coprime kanunayng bakak.

variant-attribute-not-constant = dili matino ang talagsaon nga mga variant sa { $component } kay ang { $attribute } dili kanunay nga bili.

variant-attribute-not-number = dili matino ang talagsaon nga mga variant sa { $component } kay ang { $attribute } dili numero.

variant-attribute-wrong-type-for-sequence =
    dili matino ang talagsaon nga mga variant sa { $component } nga matang { $type } kay ang { $attribute } dili { $expected ->
        [letters-combination] kombinasyon sa mga letra
        [math-expression] balido nga ekspresyon sa matematika
        [integer] integer
       *[number] numero
    }.

variant-length-not-integer = dili matino ang talagsaon nga mga variant sa { $component } kay ang length dili integer.

variant-sort-not-implemented = wala pa gihimo ang talagsaon nga mga variant sa { $component } nga adunay sort

variant-exclude-combinations-not-implemented = wala pa gihimo ang talagsaon nga mga variant sa { $component } nga adunay excludeCombinations

variant-math-exclude-not-implemented = wala pa gihimo ang talagsaon nga mga variant sa { $component } nga matang math nga adunay exclude

variant-non-constant-exclude-not-implemented = wala pa gihimo ang talagsaon nga mga variant sa { $component } nga adunay exclude nga dili kanunay

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: dili suportado sa prefigure nga renderer sa graph; gilaktawan ang kaliwat.

prefigure-descendant-invalid-geometry = { $subject }: dili finite o kulang ang geometriya; gilaktawan ang kaliwat.

prefigure-curve-label-omitted = { $subject }: dili suportado ang mga label sa nakabig nga mga elemento sa kurba; wala iapil ang label.

prefigure-curve-unsupported-definition-type = { $subject }: dili suportado ang matang sa depinisyon sa punsyon sa kurba nga '{ $definitionType }'; gilaktawan ang kaliwat.

prefigure-region-flip-functions-unsupported = { $subject }: dili suportado ang atributo nga flipFunctions sa regionBetweenCurves; gilaktawan ang kaliwat.

prefigure-region-non-formula-child = { $subject }: mga anak nga punsyon lamang nga matang pormula ang suportado sa regionBetweenCurves; gilaktawan ang kaliwat.

prefigure-label-position-unsupported =
    { $subject }: dili suportado ang labelPosition nga '{ $labelPosition }' alang sa { $labelKind ->
        [line-family] label sa pamilya sa linya
       *[point] label sa punto
    }; gamiton ang default nga paghan-ay sa PreFigure.

prefigure-fill-style-unsupported = { $subject }: dili suportado sa PreFigure ang estilo sa sulod nga '{ $fillStyle }'; mobalik sa solidong sulod.

prefigure-line-style-unknown = { $subject }: wala mailhi ang estilo sa linya nga '{ $lineStyle }', wala kini iapil sa output sa PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: ang estilo sa marka nga '{ $markerStyle }' gimapa ngadto sa estilo nga 'diamond' sa PreFigure.

prefigure-marker-style-unsupported = { $subject }: dili suportado sa PreFigure ang estilo sa marka nga '{ $markerStyle }'; gamiton ang default nga estilo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: dili balido ang `ref`; dili makit-an ang target. Wala iapil ang anotasyon.

annotation-ref-multiple-targets = `<annotation>`: ang `ref` nagtudlo sa daghang target; gamiton ang unang target.

annotation-ref-outside-graph = `<annotation>`: dili balido ang `ref`; ang target anaa sa gawas sa graph nga nagsulod niini. Wala iapil ang anotasyon.

annotation-ref-unsupported-target = `<annotation>`: dili balido ang `ref`; ang target dili suportado nga graphical nga butang sa pagkabig ngadto sa prefigure. Wala iapil ang anotasyon.

annotation-text-missing = `<annotation>`: kulang o walay sulod ang `text`; magpagawas ug walay sulod nga teksto.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Nakit-an ang lingin nga pagsalig.
       *[other] Nakit-an ang lingin nga pagsalig nga naglakip sa sangkap nga `<{ $componentType }>`.
    }

reference-no-referent = Walay nakit-an nga gitudlo sa reperensiya: `{ $reference }`

reference-multiple-referents = Daghan ang nakit-an nga gitudlo sa reperensiya: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Dili balido ang porma sa atributo nga { $attribute } sa `<{ $componentType }>`.

children-invalid = Dili balido nga mga anak alang sa `<{ $componentType }>`: nakit-an ang dili balido nga mga anak: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Dili balido nga bili `{ $value }` alang sa atributo nga `{ $attribute }`, gamiton ang bili nga `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Wala makit-i ang DoenetML nga bersyon { $version }.
       *[other] Wala makit-i ang DoenetML nga bersyon { $version }. Mobalik sa bersyon { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Dili balido nga DoenetML: { $content }

parse-tag-missing-close-tag = Dili balido nga DoenetML: Ang tag nga `{ $tag }` walay pangsirang tag. Gilauman ang tag nga mosira sa kaugalingon o tag nga `</{ $tagName }>`.

parse-tag-error = Dili balido nga DoenetML: Adunay sayop sa tag nga `<{ $tagName }>`

parse-attribute-missing-value = Dili balido nga DoenetML: Ang dili balido nga atributo nga `{ $attribute }` daw kulang ug bili.

parse-attribute-invalid = Dili balido nga DoenetML: Dili balido nga atributo nga `{ $attribute }`

parse-attribute-value-invalid = Dili balido nga DoenetML: Dili balido nga bili sa atributo nga `{ $value }`

parse-attribute-value-quote-mismatch = Dili balido nga DoenetML: Dili balido nga bili sa atributo nga `{ $value }`. Wala magtakdo ang mga kudlit. Daw kulang ka ug `{ $quote }`

parse-open-tag-name-missing = Dili balido nga DoenetML: Nakit-an ang tag nga walay ngalan, pananglitan `<`

parse-tag-not-closed = Dili balido nga DoenetML: Wala masira ang tag nga `{ $tag }` (daw kulang ang `>`).

parse-self-closing-tag-name-missing = Dili balido nga DoenetML: Nakit-an ang tag nga walay ngalan `<{ $content }>`

parse-self-closing-tag-not-closed = Dili balido nga DoenetML: Wala masira ang tag nga `{ $tag }` (daw kulang ang `/>`).

parse-tag-invalid-attributes = Dili balido nga DoenetML: Dili balido ang tag nga `{ $tag }`. Mahimong sayop ang mga atributo niini.

parse-close-tag-name-missing = Dili balido nga DoenetML: Nakit-an ang pangsirang tag nga walay ngalan, pananglitan `</`

parse-attribute-value-unquoted = Ang mga bili sa atributo kinahanglang nasulod sa mga kudlit: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Dili balido nga DoenetML: Nakit-an ang pangsirang tag nga `{ $tag }`, apan walay katugbang nga pangbukas nga tag

parse-close-tag-mismatched = Dili balido nga DoenetML: Wala magtakdo ang pangsirang tag. Gilauman ang `</{ $expected }>`. Nakit-an ang `{ $found }`

parser-node-unconvertible = Dili makabig ang node nga { $node } ngadto sa Dast nga node.

## Names

name-attribute-invalid =
    Dili balido nga atributo nga name='{ $name }'. { $reason ->
        [characters] Ang mga ngalan mahimong adunay mga letra, numero, underscore o gitlang lamang.
       *[start] Ang mga ngalan kinahanglang magsugod sa letra.
    }

component-name-invalid-start = Dili balido nga ngalan sa sangkap nga "{ $name }". Ang mga ngalan kinahanglang magsugod sa letra.

## `<answer>` sugar

answer-video-watched-missing-video = Ang answer nga matang videoWatched kinahanglang adunay atributo nga video

answer-video-watched-video-not-reference = Ang answer nga matang videoWatched kinahanglang adunay atributo nga video nga usa ka reperensiya

answer-name-not-single-text = Ang atributo nga name sa answer kinahanglang adunay usa lamang ka anak nga teksto

## Referencing another document

external-doenetml-recursion-limit = Dili makuha ang gawas nga DoenetML tungod sa sobra ka daghang lebel sa pagbalikbalik. Aduna bay lingin nga reperensiya?

external-doenetml-unavailable = Dili makuha ang DoenetML gikan sa { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Dili balido ang DoenetML nga nakuha gikan sa { $attribute }="{ $uri }": wala kini magtakdo sa matang sa sangkap nga "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Wala na gamita ang atributo nga `{ $from }`; gamita hinuon ang `{ $to }`.
       *[other] [deprecation] Wala na gamita ang atributo nga `{ $from }` sa `<{ $component }>`; gamita hinuon ang `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Wala na gamita ang atributo nga `{ $from }` ug wala kini tagda kay gitino usab ang `{ $to }`.
       *[other] [deprecation] Wala na gamita ang atributo nga `{ $from }` sa `<{ $component }>` ug wala kini tagda kay gitino usab ang `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Wala na gamita ang atributo nga `{ $attribute }` sa `<{ $component }>` ug wala kini tagda.


## Language coverage

pluralize-english-only = Ang `<pluralize>` makahimo lamang ug plural sa Iningles, busa ang teksto niini gibiyaan nga wala mausab sa dokumento nga gisulat sa { $locale }. Isulat ang plural nga porma direkta, o itakda kini pinaagi sa atributo nga `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ang elemento nga `<{ $tag }>` dili mailhi nga elemento sa Doenet.

schema-element-not-allowed-at-root = Ang elemento nga `<{ $tag }>` dili tugotan sa gamot sa dokumento.

schema-element-not-allowed-inside = Ang elemento nga `<{ $tag }>` dili tugotan sulod sa `<{ $parent }>`.

schema-attribute-unrecognized = Ang elemento nga `<{ $tag }>` walay atributo nga ginganlag `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ang atributo nga `{ $attribute }` sa elemento nga `<{ $tag }>` kinahanglang usa ka lista nga ang matag butang niini usa sa: { $allowed }
       *[other] Ang atributo nga `{ $attribute }` sa elemento nga `<{ $tag }>` kinahanglang usa sa: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Dili balido nga ngalan sa variant alang sa select. Ang ngalan sa variant nga { $variantName } makita sa { $numOptions } ka option apan ang gidaghanon nga pilion mao ang { $numToSelect }.

select-variant-name-without-options = Adunay mga variant nga gitino alang sa select apan walay option nga gitino alang sa posibleng ngalan sa variant: { $variantName }.

select-variant-name-not-possible = Ang ngalan sa variant nga { $variantName } nga gitino alang sa select dili posible nga ngalan sa variant.

select-too-few-options = Dili makapili ug { $numToSelect } ka sangkap gikan sa { $numOptions } lamang.

select-from-sequence-too-few-values = Dili makapili ug { $numToSelect } ka bili gikan sa sunodsunod nga adunay gitas-on nga { $length }.

select-from-sequence-indices-count-mismatch = Ang gidaghanon sa indices nga gitino alang sa select kinahanglang motakdo sa gidaghanon nga pilion

select-from-sequence-indices-not-integers = Ang tanang indices nga gitino alang sa select kinahanglang mga integer

select-from-sequence-index-excluded = Ang gitino nga index sa selectfromsequence gilikayan

select-from-sequence-indices-excluded-combination = Ang gitino nga indices sa selectfromsequence usa ka gilikayan nga kombinasyon

select-from-sequence-coprime-not-positive-integers = Dili makapili ug coprime nga mga kombinasyon kay dili positibo nga mga integer ang gipili.

select-from-sequence-coprime-common-factor = Dili makapili ug coprime nga mga numero. Ang tanang posibleng bili adunay komon nga factor. (Ang gitino nga bili sa "from" o "to" kinahanglang coprime sa "step".)

select-from-sequence-coprime-single-number = Dili makapili ug coprime nga mga kombinasyon gikan sa usa lamang ka numero nga dili 1.

select-from-sequence-excluded-too-many-combinations = Kapin sa 70% sa mga kombinasyon sa selectFromSequence ang gilikayan

select-from-sequence-coprime-none-found = Dili makapili ug coprime nga mga numero. Ang tanang posibleng bili adunay komon nga factor.

select-from-sequence-too-few-unique-values = Dili makapili ug { $numToSelect } ka talagsaon nga bili gikan sa sunodsunod nga adunay gitas-on nga { $numPossibleValues }

select-prime-numbers-too-few-values = Dili makapili ug { $numToSelect } ka bili gikan sa lista sa mga prime nga adunay gitas-on nga { $numValues }

select-prime-numbers-values-count-mismatch = Ang gidaghanon sa mga bili nga gitino alang sa select kinahanglang motakdo sa gidaghanon nga pilion

select-prime-numbers-values-not-prime = Ang tanang bili nga gitino alang sa select nga prime kinahanglang anaa sa lista sa mga prime

select-prime-numbers-values-excluded-combination = Ang gitino nga mga bili sa selectPrimeNumbers usa ka gilikayan nga kombinasyon

select-prime-numbers-excluded-too-many-combinations = Kapin sa 70% sa mga kombinasyon sa selectPrimeNumbers ang gilikayan

select-random-combination-fluke = Tungod sa hilabihan ka talagsaon nga sulagma, wala makapili ug kombinasyon sa random nga mga bili

select-random-value-fluke = Tungod sa hilabihan ka talagsaon nga sulagma, wala makapili ug random nga bili
