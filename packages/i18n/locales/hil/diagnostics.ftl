# Hiligaynon diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Hiligaynon marks no number on the noun, so a counted message whose only
# English difference is the noun's number renders one string here and the
# select is dropped. The count still arrives and is still formatted.
#
# The linker is written as the free «nga» throughout; see `content.ftl`.


## `<lineSegment>`

# No select: «ginabaliwala» does not agree with what is ignored, and the list
# carries no number of its own.
line-segment-attributes-ignored-with-endpoints = ginabaliwala ang { $attributes } kon gintakda ang duha ka punta

line-segment-attributes-ignored-with-endpoint-and-midpoint = ginabaliwala ang { $attributes } kon gintakda ang isa ka punta kag ang tunga

line-segment-midpoint-offset-without-midpoint = wala sing epekto ang midpointOffset kon wala sing tunga

## `<line>`

line-points-undetermined-dimensions = Linya nga nagaagi sa mga punto nga wala matukoy ang dimensyon.

line-points-too-few-dimensions = Kinahanglan nagaagi ang linya sa mga punto nga may indi kubos sa duha ka dimensyon.

line-points-depend-on-variables = Ang linya nagaagi sa mga punto nga nagasandig sa mga baryable: { $variables }.

line-equation-invalid-format = Indi balido nga pormat sang ekwasyon sang linya sa mga baryable nga { $variable1 } kag { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ang silak gintakda paagi sa through, endpoint kag direction.  Ginabaliwala ang gintakda nga through.

ray-dimension-mismatch = indi nagakadungan ang numDimensions sa silak.

## `<vector>`

vector-overprescribed-head = Ang bektor gintakda paagi sa head, tail kag displacement.  Ginabaliwala ang gintakda nga head.

vector-dimension-mismatch = indi nagakadungan ang numDimensions sa bektor.

## Attracting and constraining

attract-to-without-nearest-point = Indi mahimo mag-agda pakadto sa `<{ $component }>` kay wala ini sing baryable nga estado nga nearestPoint.

constrain-to-without-nearest-point = Indi mahimo magpugong pakadto sa `<{ $component }>` kay wala ini sing baryable nga estado nga nearestPoint.

constrain-to-interior-without-nearest-point = Indi mahimo magpugong sa sulod sang `<{ $component }>` kay wala ini sing baryable nga estado nga nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = ginabaliwala ang labelPosition para sa choiceInput nga indi inline

## Ordering children by index

choice-input-indices-count-mismatch = Ginabaliwala ang mga indise nga gintakda para sa choiceInput kay indi nagakadungan ang kadamuon sang mga indise kag ang kadamuon sang mga bata nga pilianan.

pretzel-indices-count-mismatch = Ginabaliwala ang mga indise nga gintakda para sa problem kay indi nagakadungan ang kadamuon sang mga indise kag ang kadamuon sang mga bata nga problem.

shuffle-indices-count-mismatch = Ginabaliwala ang mga indise nga gintakda para sa shuffle kay indi nagakadungan ang kadamuon sang mga indise kag ang kadamuon sang mga komponente.

indices-ignored-out-of-range = Ginabaliwala ang mga indise nga gintakda para sa { $component } kay may indise nga labaw sa sakop.

pretzel-indices-repeated = Ginabaliwala ang mga indise nga gintakda para sa pretzel kay may indise nga ginsulit.

pretzel-circuit-first-index = Ginabaliwala ang mga indise nga gintakda para sa pretzel sa mode nga circuit kay kinahanglan 1 ang una nga indise.

## `<shuffle>` and `<sort>`

string-children-need-type = Agod mag-obra ang `<{ $component }>` sa mga bata nga string, kinahanglan itakda ang atributo nga `type`.

invalid-type-defaulting-to-math = Indi balido nga type { $type } para sa komponente nga { $component }. Kinahanglan isa sa math, text, number, ukon boolean. Ginagamit ang math.

string-not-valid-component-to-arrange = Ang string nga "{ $value }" indi balido nga komponente para sa { $component }. Ginabaliwala.

## Types and variables

invalid-type-defaulting-to-number = Indi balido nga type { $type }, ginabutang ang type sa number.

invalid-variable-value = Indi balido nga balor sang isa ka baryable: `{ $value }`

## Variants

variant-index-must-be-number = Kinahanglan numero ang indise sang baryante nga { $index }

variant-index-must-be-integer = Kinahanglan integer ang indise sang baryante nga { $index }

## `<sideBySide>`

side-by-side-absolute-widths = Wala pa maipatuman ang `<{ $component }>` para sa absoluto nga sukat. Ginabutang nga relatibo ang mga kasangkaron.

side-by-side-absolute-margins = Wala pa maipatuman ang `<{ $component }>` para sa absoluto nga sukat. Ginabutang nga relatibo ang mga margin.

side-by-side-no-block-child = Indi balido nga `<{ $component }>`: kinahanglan may isa man lang ini ka bata nga block.

## `<label>`

label-for-ignored-on-graphical = Ginabaliwala ang atributo nga `for` sa grapikal nga `<label>`.

label-for-must-resolve-to-one = Kinahanglan magtudlo ang atributo nga `for` sa `<label>` sa eksakto nga isa ka komponente.

label-for-unresolved = Wala nakatudlo ang atributo nga `for` sa `<label>` sa isa ka komponente.

label-for-answer-with-authored-inputs = Ang atributo nga `for` sa `<label>` nagatudlo sa isa ka `<answer>` nga may mga input nga ginsulat sang awtor; tudlua ang input mismo.

label-for-answer-without-input = Ang atributo nga `for` sa `<label>` nagatudlo sa isa ka `<answer>` nga wala sing input nga etiketahan.

label-for-must-reference-input-or-answer = Kinahanglan nagatudlo ang atributo nga `for` sa `<label>` sa isa ka input ukon isa ka answer.

## Accessibility

accessibility-short-description-or-decorative = Para sa aksesibilidad, kinahanglan may malip-ot nga deskripsyon ang `<{ $component }>` ukon gintakda nga dekoratibo.

accessibility-video-short-description = Para sa aksesibilidad, kinahanglan may malip-ot nga deskripsyon ang `<video>`.

accessibility-input-short-description-or-label = Para sa aksesibilidad, kinahanglan may malip-ot nga deskripsyon ukon etiketa ang `<{ $component }>`.

accessibility-answer-input-short-description-or-label = Para sa aksesibilidad, kinahanglan may malip-ot nga deskripsyon ukon etiketa ang isa ka `<answer>` nga nagahimo sing input.

accessibility-short-description-contains-math = Indi dapat magsulod ang mga malip-ot nga deskripsyon sing mga komponente nga matematika subong sang `<{ $component }>`. Isulat sa mga tinaga ang bisan ano nga matematika.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Kulang ang kontraste sang { $colorName } para sa teksto sang ulohan sang seksyon (madulom nga mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ginakinahanglan ang indi kubos sa { $threshold }:1).
       *[other] Kulang ang kontraste sang { $colorName } para sa teksto sang ulohan sang seksyon ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ginakinahanglan ang indi kubos sa { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Wala pa maipatuman ang `<circle>` nga nagaagi sa { $count } ka punto kon wala sing numeriko nga balor ang mga punto.

circle-too-many-through-points = Indi mahimo kwentahon ang sirkulo nga nagaagi sa sobra sa 3 ka punto.

circle-overprescribed-radius-center-points = Indi mahimo kwentahon ang sirkulo nga may gintakda nga radyus, sentro kag mga punto nga agyan.

circle-center-with-multiple-points = Indi mahimo kwentahon ang sirkulo nga may gintakda nga sentro nga nagaagi sa sobra sa 1 ka punto.

circle-radius-too-small = Indi mahimo kwentahon ang sirkulo: tungod nga ang distansya sang duha ka punto amo ang { $distance }, gamay gid ang gintakda nga radyus nga { $radius }.

circle-radius-with-many-points = Indi mahimo maghimo sing sirkulo nga nagaagi sa sobra sa duha ka punto nga may gintakda nga radyus.

circle-invalid-center-or-through-points = Indi balido ang sentro ukon ang mga punto nga agyan sang sirkulo.

circle-radius-center-with-multiple-points = Indi mahimo kwentahon ang radyus sang sirkulo nga may gintakda nga sentro nga nagaagi sa sobra sa 1 ka punto.

circle-change-radius-non-numerical = Indi mahimo baylohan ang radyus sang sirkulo nga nagaagi sa mga punto nga indi numeriko

circle-radius-with-points-non-numerical = Indi mahimo maghimo sing sirkulo nga nagaagi sa sobra sa isa ka punto nga may gintakda nga radyus kon wala sing numeriko nga balor.

circle-change-center-non-numerical = Wala pa maipatuman ang pagbag-o sang sentro sang sirkulo nga nagaagi sa mga punto nga wala sing numeriko nga balor.

## `<function>`

# English's two counts multiply out to four sentences; Hiligaynon has one,
# because «interbalo» and «input» do not change for number. Both selects are
# dropped and both counts still arrive.
function-domain-insufficient-dimensions = Kulang ang dimensyon sang domain para sa punsyon. Ang domain may { $intervals } nga interbalo pero ang punsyon may { $inputs } nga input.

function-domain-invalid-format = Indi balido nga pormat sang domain para sa punsyon.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ginabaliwala ang indi numeriko nga pinakamataas sang punsyon.
        [minimum] Ginabaliwala ang indi numeriko nga pinakamanubo sang punsyon.
        [extremum] Ginabaliwala ang indi numeriko nga ekstremum sang punsyon.
        [point] Ginabaliwala ang indi numeriko nga punto sang punsyon.
        [slope] Ginabaliwala ang indi numeriko nga halihad sang punsyon.
       *[other] Ginabaliwala ang indi numeriko nga { $type } sang punsyon.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ginabaliwala ang wala sing unod nga pinakamataas sang punsyon.
        [minimum] Ginabaliwala ang wala sing unod nga pinakamanubo sang punsyon.
        [extremum] Ginabaliwala ang wala sing unod nga ekstremum sang punsyon.
        [point] Ginabaliwala ang wala sing unod nga punto sang punsyon.
       *[other] Ginabaliwala ang wala sing unod nga { $type } sang punsyon.
    }

function-points-too-close = May duha ka punto ang punsyon nga tama kalapit. Indi mahimo depinaron ang punsyon.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Posible lamang ang mga iterasyon sang punsyon kon palareho ang kadamuon sang mga input kag ang kadamuon sang mga output. Ini nga punsyon may { $inputs } nga input kag { $outputs } nga output.

## `<sequence>`

sequence-invalid-length = Indi balido ang kalabaon sang sequence.  Kinahanglan indi negatibo nga integer.

sequence-invalid-step = Indi balido ang step sang sequence.  Kinahanglan numero para sa sequence nga type { $type }.

sequence-invalid-endpoint-number = Indi balido nga "{ $attribute }" sang sequence nga numero.  Kinahanglan numero.

sequence-invalid-endpoint-letters = Indi balido nga "{ $attribute }" sang sequence nga letra.  Kinahanglan kombinasyon sang mga letra.

sequence-invalid-endpoint = Indi balido nga "{ $attribute }" sang sequence.

select-from-sequence-coprime-not-numbers = ginabaliwala ang coprime kay indi numero ang ginapili

select-from-sequence-coprime-with-exclude-combinations = ginabaliwala ang coprime kay gintakda ang excludeCombinations

## Resolving a `target`

target-not-found = Indi balido nga target para sa `<{ $source }>`: indi makita ang target.

target-state-variable-not-found = Indi balido nga target para sa `<{ $source }>`: indi makita ang baryable nga estado nga ginhingalanan nga "{ $property }" sa isa ka `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Kinahanglan tuhay ang mga baryable sang `<odeSystem>` sa independente nga baryable.

ode-system-duplicate-variable-names = Indi mahimo depinaron ang mga punsyon nga RHS sang ODE nga palareho ang ngalan sang mga baryable nga nagasandig.

ode-system-rhs-function-error = Indi mahimo depinaron ang punsyon nga RHS sang ODE.  May sayop sa paghimo sang punsyon nga mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Indi mahimo depinaron ang anggulo sa tunga sang { $count } ka linya

angle-invalid-through-point = Indi balido nga punto sa through sang `<angle>`

parabola-vertex-too-many-points = Wala pa maipatuman ang parabola nga may bertise nga nagaagi sa sobra sa 1 ka punto.

parabola-too-many-points = Wala pa maipatuman ang parabola nga nagaagi sa sobra sa 3 ka punto.

intersection-too-many-items = Wala pa maipatuman ang intersection para sa sobra sa duha ka butang

## Other math components

ionic-compound-not-two-ions = Wala pa maipatuman ang kompuwesto nga ioniko para sa iban luwas sa duha ka ion.

ionic-compound-needs-cation-and-anion = Ginpatuman ang kompuwesto nga ioniko para lamang sa isa ka cation kag isa ka anion.

solve-equations-cannot-evaluate = Indi masulbad ang ekwasyon kay indi matimbang ang ekwasyon: { $equation }

math-operators-operand-number-required = Kinahanglan itakda ang operandNumber kon nagakuha sing operand nga matematika.

eigen-decomposition-failed = Wala makwenta ang mga eigenvalue sang matris

## `<matchesPattern>`

# No select: the parameter list carries no number that the noun would show.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: ang parametro nga { $parameters } wala nagaagi sa pattern, gani permi ini magatugbang sa blangko.

## `<graph>`

graph-grid-invalid = `<graph>`: indi mahangpan ang grid="{ $grid }". Kinahanglan none, medium, dense, ukon duha ka positibo nga numero nga ginbulag sing espasyo, subong sang grid="1 0.5". Wala sing grid nga ginadrowing.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: wala sing suporta ang xLabelPosition="left" sa renderer nga prefigure; ginagamit ang paggawi sang tuo nga posisyon.

prefigure-y-label-position-unsupported = `<graph>`: wala sing suporta ang yLabelPosition="bottom" sa renderer nga prefigure; ginagamit ang paggawi sang ibabaw nga posisyon.

prefigure-invalid-axis-bounds = `<graph>`: indi balido ang mga dulunan sang aksis para sa konbersyon nga prefigure; ginagamit ang naandan nga bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: indi balido ang kasangkaron para sa konbersyon nga prefigure; ginagamit ang naandan nga kasangkaron sang diagram nga 425.

prefigure-invalid-aspect-ratio = `<graph>`: indi balido ang aspectRatio para sa konbersyon nga prefigure; ginagamit ang naandan nga aspect ratio nga 1.

prefigure-grid-spacing-too-fine = `<graph>`: tama kagamay ang tunga sang grid para sa mga dulunan sang aksis; ginabaliwala ang grid sa renderer nga prefigure.

prefigure-annotations-not-rendered = `<graph>`: indi ma-render ang mga annotation kon indi ang renderer nga PreFigure ang ginagamit.

multiple-annotations-children = Madamo nga bata nga `<annotations>` ang nakita sa `<graph>`; ginabaliwala ang tanan luwas sa ulihi.

## Referring to other components

copy-unrecognized-component-type = Indi mahimo i-extend ukon kopyahon ang indi kilala nga klase sang komponente: { $type }.

copy-prop-not-found = Wala makita ang prop nga { $property } sa komponente nga klase { $component }

collect-no-source = Wala sing nakita nga source para sa collect.

collect-invalid-component-type = Indi mahimo tipunon ang mga komponente nga klase `<{ $component }>` kay indi balido nga klase sang komponente.

reference-index-unavailable = Indi matudlo ang indise nga `{ $reference }`

## `<callAction>`

component-action-unavailable = Indi matawag ang { $action } sa komponente nga `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Indi balido ang porma sang datos.  Indi palareho ang kalabaon sang mga lakan. Nakita sa componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = May palareho nga ngalan sang kolum ang datos.  Nakita sa componentIdx :{ $componentIdx }

data-frame-missing-column-name = Wala sing ngalan ang isa ka kolum sang datos.  Nakita sa componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ang award sini nga sabat nabase sa mismo nga ginpadala nga sabat sang answer tag, kag magadala ini sing indi ginapaabot nga paggawi.

answer-max-num-attempts-in-section-wide-check-work = Wala sing epekto ang pagbutang sing `maxNumAttempts` sa isa ka `<answer>` sa sulod sang kontenedor nga may `sectionWideCheckWork`, kay ang kontenedor ang nagakontrol sang kadamuon sang mga tilaw. Ibutang ang `maxNumAttempts` sa kontenedor.

nested-section-wide-check-work-max-num-attempts = Wala sing epekto ang pagbutang sing `maxNumAttempts` sa kontenedor nga may `sectionWideCheckWork` nga yara sa sulod sang isa pa ka kontenedor nga may `sectionWideCheckWork`, kay ang gwa nga kontenedor ang nagakontrol sang kadamuon sang mga tilaw. Ibutang ang `maxNumAttempts` sa gwa nga kontenedor.

# No select: «atributo» is the same word for one and for many.
answer-attributes-need-symbolic-equality = Wala sing epekto ang atributo nga { $attributes } kon wala mabutang ang symbolicEquality.

answer-invalid-type = Indi balido nga klase para sa sabat: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Tungod nga wala sing ngalan ang komponente nga `<{ $component }>`, indi ini magamit para sa atributo sang module

module-attribute-name-already-defined = Indi magamit ang komponente nga `<{ $component } name="{ $name }">` subong atributo sang module kay ang klase sang komponente nga `<module>` may atributo na nga "{ $name }".

conditional-content-condition-ignored = Ginabaliwala ang atributo nga `condition` sa komponente nga `<conditionalContent>` nga may mga bata nga case ukon else.

slider-markers-type-mismatch = Indi nagakadungan ang klase sang mga marker kag ang klase sang slider.

pretzel-problem-needs-statement-and-answer = Indi balido nga pretzel: kinahanglan may unod ang kada `<problem>` nga isa ka `<statement>` kag isa ka `<answer>`.

pretzel-circuit-first-problem-distractor = Indi balido nga pretzel: sa mode="circuit", indi mahimo distractor ang una nga `<problem>`.

## Attribute values

# No select: «balor» is the same word for one and for many.
attribute-invalid-values = Indi balido nga balor nga { $values } para sa atributo nga `{ $attribute }`; ginabaliwala.

attribute-must-be-references = Indi balido nga balor nga `{ $value }` para sa atributo nga `{ $attribute }`. Kinahanglan ginabuo ang atributo sang mga reperensya nga nagasugod sa `$`.

math-input-invalid-function-names = <mathInput>: ginbaliwala ang mga indi balido nga ngalan sang punsyon sa { $attribute }: { $names }. Kinahanglan may indi kubos sa 2 ka karakter ang kada ngalan (letra ukon gitlo); mahimo magsunod ang isa ka suffix nga `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Indi balido nga klase sang komponente: `<{ $componentType }>`

attribute-repeated = Indi mahimo suliton ang atributo nga { $attribute }.

attribute-invalid-for-component = Indi balido nga atributo nga "{ $attribute }" para sa komponente nga klase `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Kulang ang kontraste sang depinisyon sang estilo nga { $styleNumber } para sa { $context ->
        [text-on-background] kolor sang teksto kontra sa kolor sang background
        [high-contrast] kolor nga mataas ang kontraste kontra sa kanbas
        [line] kolor sang linya kontra sa kanbas
        [marker] kolor sang marker kontra sa kanbas
       *[text-on-canvas] kolor sang teksto kontra sa kanbas
    }{ $mode ->
        [dark] { " (madulom nga mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ginakinahanglan ang indi kubos sa { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Bisan kon ang depinisyon sang estilo nga { $styleNumber } may gintakda nga mga kolor nga bastante ang kontraste para sa masanag nga mode, kulang ang kontraste sang kolor sang teksto kontra sa kolor sang background sa mga kolor nga ginkuha para sa madulom nga mode ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ginakinahanglan ang indi kubos sa { $threshold }:1). { $suggestion ->
        [available] Agod bastante ang kontraste sa madulom nga mode, dugangi ang kontraste sang masanag nga mode (halimbawa, ibutang ang { $lightAttribute }="{ $lightColor }") ukon ilisan ang kolor sang madulom nga mode (halimbawa, ibutang ang { $darkAttribute }="{ $darkColor }").
       *[none] Agod bastante ang kontraste sa madulom nga mode, dugangi ang kontraste sang masanag nga mode ukon ilisan ang mga ginkuha nga kolor paagi sa textColorDarkMode kag/ukon backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Bisan kon ang depinisyon sang estilo nga { $styleNumber } may gintakda nga kolor sang teksto nga bastante ang kontraste para sa masanag nga mode, kulang ang kontraste sang kolor sang teksto nga ginkuha para sa madulom nga mode kontra sa kanbas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ginakinahanglan ang indi kubos sa { $threshold }:1). { $suggestion ->
        [available] Agod bastante ang kontraste sa madulom nga mode, dugangi ang kontraste sang masanag nga mode (halimbawa, ibutang ang textColor="{ $lightColor }") ukon ilisan ang kolor sang madulom nga mode (halimbawa, ibutang ang textColorDarkMode="{ $darkColor }").
       *[none] Agod bastante ang kontraste sa madulom nga mode, dugangi ang kontraste sang masanag nga mode ukon ilisan ang ginkuha nga kolor paagi sa textColorDarkMode.
    }

section-multiple-style-palettes = Isa lang ka <stylePalette> ang mahimo pilion sang isa ka seksyon; ginagamit ang ulihi.

## Unique variants

variant-num-to-select-not-non-negative-integer = indi matukoy ang mga talagsahon nga baryante sang { $component } kay ang numToSelect indi integer nga indi negatibo.

variant-num-to-select-not-constant-number = indi matukoy ang mga talagsahon nga baryante sang { $component } kay ang numToSelect indi konstante nga numero.

variant-with-replacement-not-constant-boolean = indi matukoy ang mga talagsahon nga baryante sang { $component } kay ang withReplacement indi konstante nga boolean.

variant-select-weight-disables-unique = Ginapatay ang mga talagsahon nga baryante para sa select kon may opsyon nga gintakdaan sing selectWeight ukon selectForVariants

variant-coprime-undetermined = indi matukoy ang mga talagsahon nga baryante sang { $component } kay indi matukoy kon permi false ang coprime.

variant-attribute-not-constant = indi matukoy ang mga talagsahon nga baryante sang { $component } kay indi konstante ang { $attribute }.

variant-attribute-not-number = indi matukoy ang mga talagsahon nga baryante sang { $component } kay indi numero ang { $attribute }.

variant-attribute-wrong-type-for-sequence =
    indi matukoy ang mga talagsahon nga baryante sang { $component } nga klase { $type } kay ang { $attribute } indi { $expected ->
        [letters-combination] kombinasyon sang mga letra
        [math-expression] balido nga ekspresyon nga matematika
        [integer] integer
       *[number] numero
    }.

variant-length-not-integer = indi matukoy ang mga talagsahon nga baryante sang { $component } kay indi integer ang length.

variant-sort-not-implemented = wala pa maipatuman ang mga talagsahon nga baryante sang isa ka { $component } nga may sort

variant-exclude-combinations-not-implemented = wala pa maipatuman ang mga talagsahon nga baryante sang isa ka { $component } nga may excludeCombinations

variant-math-exclude-not-implemented = wala pa maipatuman ang mga talagsahon nga baryante sang isa ka { $component } nga klase math nga may exclude

variant-non-constant-exclude-not-implemented = wala pa maipatuman ang mga talagsahon nga baryante sang isa ka { $component } nga may indi konstante nga exclude

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: wala sing suporta sa renderer nga prefigure sang graph; ginlaktawan ang kaliwat.

prefigure-descendant-invalid-geometry = { $subject }: indi limitado ukon indi kompleto ang heometriya; ginlaktawan ang kaliwat.

prefigure-curve-label-omitted = { $subject }: wala sing suporta ang mga etiketa sa mga nakonberte nga kurba; ginbaliwala ang etiketa.

prefigure-curve-unsupported-definition-type = { $subject }: wala sing suporta nga klase sang depinisyon sang punsyon nga kurba nga '{ $definitionType }'; ginlaktawan ang kaliwat.

prefigure-region-flip-functions-unsupported = { $subject }: wala sing suporta nga atributo nga flipFunctions sa regionBetweenCurves; ginlaktawan ang kaliwat.

prefigure-region-non-formula-child = { $subject }: ang mga bata nga punsyon nga klase formula lang ang may suporta sa regionBetweenCurves; ginlaktawan ang kaliwat.

prefigure-label-position-unsupported =
    { $subject }: wala sing suporta nga labelPosition '{ $labelPosition }' para sa { $labelKind ->
        [line-family] etiketa sang pamilya sang linya
       *[point] etiketa sang punto
    }; ginagamit ang naandan nga pagpahiuyon sang PreFigure.

prefigure-fill-style-unsupported = { $subject }: wala sing suporta ang PreFigure sa estilo sang unod nga '{ $fillStyle }'; nagabalik sa solido nga unod.

prefigure-line-style-unknown = { $subject }: indi kilala nga estilo sang linya nga '{ $lineStyle }', ginbaliwala sa output sang PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gin-angot ang estilo sang marker nga '{ $markerStyle }' sa estilo nga 'diamond' sang PreFigure.

prefigure-marker-style-unsupported = { $subject }: wala sing suporta ang PreFigure sa estilo sang marker nga '{ $markerStyle }'; ginagamit ang naandan nga estilo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: indi balido nga `ref`; indi matudlo ang target. Ginbaliwala ang annotation.

annotation-ref-multiple-targets = `<annotation>`: nagatudlo ang `ref` sa madamo nga target; ginagamit ang una nga target.

annotation-ref-outside-graph = `<annotation>`: indi balido nga `ref`; yara ang target sa gwa sang graph nga nagaunod sini. Ginbaliwala ang annotation.

annotation-ref-unsupported-target = `<annotation>`: indi balido nga `ref`; ang target indi suportado nga grapikal nga butang sa konbersyon nga prefigure. Ginbaliwala ang annotation.

annotation-text-missing = `<annotation>`: wala ukon blangko ang `text`; nagapagwa sing blangko nga teksto.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] May nakita nga sirkular nga pagsandig.
       *[other] May nakita nga sirkular nga pagsandig nga nagalakip sang komponente nga `<{ $componentType }>`.
    }

reference-no-referent = Wala sing nakita nga ginatudlo sang reperensya: `{ $reference }`

reference-multiple-referents = Madamo ang nakita nga ginatudlo sang reperensya: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Indi balido nga pormat sang atributo nga { $attribute } sang `<{ $componentType }>`.

children-invalid = Indi balido ang mga bata sang `<{ $componentType }>`: nakita ang mga indi balido nga bata: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Indi balido nga balor nga `{ $value }` para sa atributo nga `{ $attribute }`, ginagamit ang balor nga `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Wala makita ang bersyon sang DoenetML nga { $version }.
       *[other] Wala makita ang bersyon sang DoenetML nga { $version }. Nagabalik sa bersyon nga { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Indi balido nga DoenetML: { $content }

parse-tag-missing-close-tag = Indi balido nga DoenetML: Wala sing pangsira nga tag ang tag nga `{ $tag }`. Ginapaabot ang tag nga nagasira sa kaugalingon ukon tag nga `</{ $tagName }>`.

parse-tag-error = Indi balido nga DoenetML: May sayop sa tag nga `<{ $tagName }>`

parse-attribute-missing-value = Indi balido nga DoenetML: Daw wala sing balor ang indi balido nga atributo nga `{ $attribute }`.

parse-attribute-invalid = Indi balido nga DoenetML: Indi balido nga atributo nga `{ $attribute }`

parse-attribute-value-invalid = Indi balido nga DoenetML: Indi balido nga balor sang atributo nga `{ $value }`

parse-attribute-value-quote-mismatch = Indi balido nga DoenetML: Indi balido nga balor sang atributo nga `{ $value }`. Indi nagakadungan ang mga marka sang sipi. Daw wala sing isa ka `{ $quote }`

parse-open-tag-name-missing = Indi balido nga DoenetML: May nakita nga tag nga wala sing ngalan, halimbawa `<`

parse-tag-not-closed = Indi balido nga DoenetML: Wala nasira ang tag nga `{ $tag }` (daw wala sing `>`).

parse-self-closing-tag-name-missing = Indi balido nga DoenetML: May nakita nga tag nga wala sing ngalan `<{ $content }>`

parse-self-closing-tag-not-closed = Indi balido nga DoenetML: Wala nasira ang tag nga `{ $tag }` (daw wala sing `/>`).

parse-tag-invalid-attributes = Indi balido nga DoenetML: Indi balido ang tag nga `{ $tag }`. Basi may indi husto nga mga atributo.

parse-close-tag-name-missing = Indi balido nga DoenetML: May nakita nga pangsira nga tag nga wala sing ngalan, halimbawa `</`

parse-attribute-value-unquoted = Kinahanglan nakabutang sa sulod sang mga marka sang sipi ang mga balor sang atributo: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Indi balido nga DoenetML: May nakita nga pangsira nga tag nga `{ $tag }`, pero wala sing katugbang nga pangbukas nga tag

parse-close-tag-mismatched = Indi balido nga DoenetML: Indi magkatugbang ang pangsira nga tag. Ginapaabot ang `</{ $expected }>`. Nakita ang `{ $found }`

parser-node-unconvertible = Wala nakonberte ang node nga { $node } pakadto sa node nga Dast.

## Names

name-attribute-invalid =
    Indi balido nga atributo nga name='{ $name }'. { $reason ->
        [characters] Mahimo lang magsulod ang mga ngalan sing mga letra, numero, underscore ukon gitlo.
       *[start] Kinahanglan nagasugod ang mga ngalan sa letra.
    }

component-name-invalid-start = Indi balido nga ngalan sang komponente nga "{ $name }". Kinahanglan nagasugod ang mga ngalan sa letra.

## `<answer>` sugar

answer-video-watched-missing-video = Kinahanglan may atributo nga video ang answer nga type videoWatched

answer-video-watched-video-not-reference = Kinahanglan reperensya ang atributo nga video sang answer nga type videoWatched

answer-name-not-single-text = Kinahanglan may isa lang ka bata nga text ang atributo nga name sang answer

## Referencing another document

external-doenetml-recursion-limit = Wala makuha ang gwa nga DoenetML tungod sa sobra kadamo nga lebel sang pagsulit-sulit. May sirkular bala nga reperensya?

external-doenetml-unavailable = Wala makuha ang DoenetML halin sa { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Indi balido nga DoenetML ang nakuha halin sa { $attribute }="{ $uri }": wala ini nagatugbang sa klase sang komponente nga "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Indi na ginagamit ang atributo nga `{ $from }`; gamita ang `{ $to }`.
       *[other] [deprecation] Indi na ginagamit ang atributo nga `{ $from }` sa `<{ $component }>`; gamita ang `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Indi na ginagamit ang atributo nga `{ $from }` kag ginabaliwala kay gintakda man ang `{ $to }`.
       *[other] [deprecation] Indi na ginagamit ang atributo nga `{ $from }` sa `<{ $component }>` kag ginabaliwala kay gintakda man ang `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Indi na ginagamit ang atributo nga `{ $attribute }` sa `<{ $component }>` kag ginabaliwala.

deprecated-attribute-to-child = [deprecation] Indi na ginagamit ang atributo nga `{ $attribute }` sa `<{ $component }>`; gamita ang bata nga `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Indi na ginagamit ang balor nga `{ $value }` sang atributo nga `{ $attribute }` sa `<{ $component }>`; gamita ang `{ $to }`.


## Language coverage

pluralize-english-only = Ang `<pluralize>` makahimo lang magpadamo sing Ingles, gani wala nabag-o ang teksto sini sa dokumento nga ginsulat sa { $locale }. Isulat mismo ang porma nga damo, ukon ibutang ini paagi sa atributo nga `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ang elemento nga `<{ $tag }>` indi kilala nga elemento sang Doenet.

schema-element-not-allowed-at-root = Indi ginatugutan ang elemento nga `<{ $tag }>` sa gamot sang dokumento.

schema-element-not-allowed-inside = Indi ginatugutan ang elemento nga `<{ $tag }>` sa sulod sang `<{ $parent }>`.

schema-attribute-unrecognized = Wala sing atributo nga ginhingalanan nga `{ $attribute }` ang elemento nga `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Kinahanglan lista ang atributo nga `{ $attribute }` sang elemento nga `<{ $tag }>` nga ang kada butang isa sa: { $allowed }
       *[other] Kinahanglan isa sa mga ini ang atributo nga `{ $attribute }` sang elemento nga `<{ $tag }>`: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Indi balido nga ngalan sang baryante para sa select.  Ang ngalan sang baryante nga { $variantName } nagaagi sa { $numOptions } nga opsyon pero { $numToSelect } ang kadamuon nga pilion.

select-variant-name-without-options = May gintakda nga mga baryante para sa select pero wala sing gintakda nga opsyon para sa posible nga ngalan sang baryante: { $variantName }.

select-variant-name-not-possible = Ang ngalan sang baryante nga { $variantName } nga gintakda para sa select indi posible nga ngalan sang baryante.

select-too-few-options = Indi mahimo magpili sing { $numToSelect } nga komponente halin sa { $numOptions } lang.

select-from-sequence-too-few-values = Indi mahimo magpili sing { $numToSelect } nga balor halin sa sequence nga { $length } ang kalabaon.

select-from-sequence-indices-count-mismatch = Kinahanglan magkatugbang ang kadamuon sang mga indise nga gintakda para sa select kag ang kadamuon nga pilion

select-from-sequence-indices-not-integers = Kinahanglan integer ang tanan nga indise nga gintakda para sa select

select-from-sequence-index-excluded = Gintakda ang indise sang selectfromsequence nga ginbaliwala

select-from-sequence-indices-excluded-combination = Gintakda ang mga indise sang selectfromsequence nga isa ka ginbaliwala nga kombinasyon

select-from-sequence-coprime-not-positive-integers = Indi mahimo magpili sing mga kombinasyon nga coprime kay indi positibo nga integer ang ginapili.

select-from-sequence-coprime-common-factor = Indi mahimo magpili sing mga numero nga coprime. May isa ka paktor nga palareho ang tanan nga posible nga balor. (Kinahanglan coprime ang gintakda nga balor sang "from" ukon "to" sa "step".)

select-from-sequence-coprime-single-number = Indi mahimo magpili sing mga kombinasyon nga coprime halin sa isa lang ka numero nga indi 1.

select-from-sequence-excluded-too-many-combinations = Ginbaliwala ang sobra sa 70% sang mga kombinasyon sa selectFromSequence

select-from-sequence-coprime-none-found = Wala makapili sing mga numero nga coprime. May isa ka paktor nga palareho ang tanan nga posible nga balor.

select-from-sequence-too-few-unique-values = Indi mahimo magpili sing { $numToSelect } nga talagsahon nga balor halin sa sequence nga { $numPossibleValues } ang kalabaon

select-prime-numbers-too-few-values = Indi mahimo magpili sing { $numToSelect } nga balor halin sa lista sang mga prime nga { $numValues } ang kalabaon

select-prime-numbers-values-count-mismatch = Kinahanglan magkatugbang ang kadamuon sang mga balor nga gintakda para sa select kag ang kadamuon nga pilion

select-prime-numbers-values-not-prime = Kinahanglan yara sa lista sang mga prime ang tanan nga balor nga gintakda para sa select prime number

select-prime-numbers-values-excluded-combination = Ang gintakda nga mga balor sang selectPrimeNumbers isa ka ginbaliwala nga kombinasyon

select-prime-numbers-excluded-too-many-combinations = Ginbaliwala ang sobra sa 70% sang mga kombinasyon sa selectPrimeNumbers

select-random-combination-fluke = Tungod sa talagsahon gid nga swerte, wala makapili sing kombinasyon sang mga random nga balor

select-random-value-fluke = Tungod sa talagsahon gid nga swerte, wala makapili sing random nga balor
