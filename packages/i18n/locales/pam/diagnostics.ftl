# Kapampangan diagnostics. Translated from `locales/en/diagnostics.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
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
# Kapampangan marks no number on the noun, so a counted message whose only
# English difference is the noun's number renders one string here and the
# select is dropped. The count still arrives and is still formatted.
#
# A value quoted back from the author's source is reached through «ing» or
# «king» rather than through a linker, so that no «a»/«-ng» choice depends on a
# word this catalog has never seen. See `content.ftl`'s header for where that
# could not be avoided.


## `<lineSegment>`

# No select: «ali papansinan» does not agree with what is ignored, and the list
# carries no number of its own.
line-segment-attributes-ignored-with-endpoints = ali papansinan ing { $attributes } nung mitakda la reng adwang sepu

line-segment-attributes-ignored-with-endpoint-and-midpoint = ali papansinan ing { $attributes } nung mitakda ing metung a sepu at ing kalibutad

line-segment-midpoint-offset-without-midpoint = alang epektu ing midpointOffset nung alang kalibutad

## `<line>`

line-points-undetermined-dimensions = Linyang dumalan karing puntong ali me-alaman ing dimensyon da.

line-points-too-few-dimensions = Dapat dumalan ing linya karing puntong atin ali kulang king adwang dimensyon.

line-points-depend-on-variables = Ing linya dumalan ya karing puntong manalig karing baryable: { $variables }.

line-equation-invalid-format = Ali balido a pormat ning ekwasyon ning linya karing baryable a { $variable1 } at { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ing sinag metakda ya king through, endpoint at direction.  Ali papansinan ing metakdang through.

ray-dimension-mismatch = ali mitutugma ing numDimensions king sinag.

## `<vector>`

vector-overprescribed-head = Ing bektor metakda ya king head, tail at displacement.  Ali papansinan ing metakdang head.

vector-dimension-mismatch = ali mitutugma ing numDimensions king bektor.

## Attracting and constraining

attract-to-without-nearest-point = Ali malyaring makanyaya king `<{ $component }>` uling alang baryable a estadu a nearestPoint.

constrain-to-without-nearest-point = Ali malyaring pigilan king `<{ $component }>` uling alang baryable a estadu a nearestPoint.

constrain-to-interior-without-nearest-point = Ali malyaring pigilan kilub ning `<{ $component }>` uling alang baryable a estadu a nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = ali papansinan ing labelPosition para king choiceInput a ali inline

## Ordering children by index

choice-input-indices-count-mismatch = Ali papansinan la reng indise a metakda para king choiceInput uling ali mitutugma ing bilang da reng indise at ing bilang da reng anak a pipamilian.

pretzel-indices-count-mismatch = Ali papansinan la reng indise a metakda para king problem uling ali mitutugma ing bilang da reng indise at ing bilang da reng anak a problem.

shuffle-indices-count-mismatch = Ali papansinan la reng indise a metakda para king shuffle uling ali mitutugma ing bilang da reng indise at ing bilang da reng komponente.

indices-ignored-out-of-range = Ali papansinan la reng indise a metakda para king { $component } uling atin indise a labis king sakup.

pretzel-indices-repeated = Ali papansinan la reng indise a metakda para king pretzel uling atin indise a meulit.

pretzel-circuit-first-index = Ali papansinan la reng indise a metakda para king pretzel king mode a circuit uling dapat 1 ing mumunang indise.

## `<shuffle>` and `<sort>`

string-children-need-type = Ban gumana ing `<{ $component }>` karing anak a string, dapat matakda ing atributo a `type`.

invalid-type-defaulting-to-math = Ali balido a type { $type } para king komponente a { $component }. Dapat metung king math, text, number, o boolean. Gagamitan ing math.

string-not-valid-component-to-arrange = Ing string a "{ $value }" ali ya balidung komponente para king { $component }. Ali papansinan.

## Types and variables

invalid-type-defaulting-to-number = Ali balido a type { $type }, ilalage ing type king number.

invalid-variable-value = Ali balido a alaga ning metung a baryable: `{ $value }`

## Variants

variant-index-must-be-number = Dapat numero ing indise ning baryante a { $index }

variant-index-must-be-integer = Dapat integer ing indise ning baryante a { $index }

## `<sideBySide>`

side-by-side-absolute-widths = Ala pang mapatupad ing `<{ $component }>` para karing absolutong sukat. Ilalage lang relatibo reng lapad.

side-by-side-absolute-margins = Ala pang mapatupad ing `<{ $component }>` para karing absolutong sukat. Ilalage lang relatibo reng margin.

side-by-side-no-block-child = Ali balido a `<{ $component }>`: dapat atin yang ali kulang king metung a anak a block.

## `<label>`

label-for-ignored-on-graphical = Ali papansinan ing atributo a `for` king grapikal a `<label>`.

label-for-must-resolve-to-one = Dapat manuru ing atributo a `for` king `<label>` king eksaktung metung a komponente.

label-for-unresolved = Ali me-turu ing atributo a `for` king `<label>` king metung a komponente.

label-for-answer-with-authored-inputs = Ing atributo a `for` king `<label>` manuru ya king metung a `<answer>` a atin input a sinulat ning autor; ituru ing input a mismu.

label-for-answer-without-input = Ing atributo a `for` king `<label>` manuru ya king metung a `<answer>` a alang input a etiketan.

label-for-must-reference-input-or-answer = Dapat manuru ing atributo a `for` king `<label>` king metung a input o metung a answer.

## Accessibility

accessibility-short-description-or-decorative = Para king aksesibilidad, dapat atin ing `<{ $component }>` makuyad a deskripsyon o metakdang dekoratibo.

accessibility-video-short-description = Para king aksesibilidad, dapat atin ing `<video>` makuyad a deskripsyon.

accessibility-input-short-description-or-label = Para king aksesibilidad, dapat atin ing `<{ $component }>` makuyad a deskripsyon o etiketa.

accessibility-answer-input-short-description-or-label = Para king aksesibilidad, dapat atin makuyad a deskripsyon o etiketa ing metung a `<answer>` a gagawang input.

accessibility-short-description-contains-math = Ali dapat maglaman deng makuyad a deskripsyon karing komponenteng matematika anti ing `<{ $component }>`. Isulat king amanu ing nanumang matematika.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Kulang ing kontraste ning { $colorName } para king teksto ning pamagat ning seksyon (madalumdum a mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kailangan ing ali kulang king { $threshold }:1).
       *[other] Kulang ing kontraste ning { $colorName } para king teksto ning pamagat ning seksyon ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kailangan ing ali kulang king { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Ala pang mapatupad ing `<circle>` a dumalan karing { $count } a punto nung alang numerikung alaga reng punto.

circle-too-many-through-points = Ali malyaring kwentan ing sirkulong dumalan karing labis king 3 a punto.

circle-overprescribed-radius-center-points = Ali malyaring kwentan ing sirkulong atin metakdang radyus, sentro at puntong daralanan.

circle-center-with-multiple-points = Ali malyaring kwentan ing sirkulong atin metakdang sentro a dumalan king labis king 1 a punto.

circle-radius-too-small = Ali malyaring kwentan ing sirkulo: uling ing distansya da reng adwang punto { $distance } ya, malati ya masyadu ing metakdang radyus a { $radius }.

circle-radius-with-many-points = Ali malyaring gumawa sirkulong dumalan king labis king adwang punto a atin metakdang radyus.

circle-invalid-center-or-through-points = Ali balido ing sentro o deng puntong daralanan ning sirkulo.

circle-radius-center-with-multiple-points = Ali malyaring kwentan ing radyus ning sirkulong atin metakdang sentro a dumalan king labis king 1 a punto.

circle-change-radius-non-numerical = Ali malyaring baltan ing radyus ning sirkulong dumalan karing puntong ali numeriku

circle-radius-with-points-non-numerical = Ali malyaring gumawa sirkulong dumalan king labis king metung a punto a atin metakdang radyus nung alang numerikung alaga.

circle-change-center-non-numerical = Ala pang mapatupad ing pamagbayu king sentro ning sirkulong dumalan karing puntong alang numerikung alaga.

## `<function>`

# English's two counts multiply out to four sentences; Kapampangan has one,
# because «interbalo» and «input» do not change for number. Both selects are
# dropped and both counts still arrive.
function-domain-insufficient-dimensions = Kulang ing dimensyon ning domain para king punsyon. Ing domain atin yang { $intervals } a interbalo oneng ing punsyon atin yang { $inputs } a input.

function-domain-invalid-format = Ali balido a pormat ning domain para king punsyon.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ali papansinan ing ali numerikung kamaragulan ning punsyon.
        [minimum] Ali papansinan ing ali numerikung kaditakan ning punsyon.
        [extremum] Ali papansinan ing ali numerikung ekstremum ning punsyon.
        [point] Ali papansinan ing ali numerikung punto ning punsyon.
        [slope] Ali papansinan ing ali numerikung hilis ning punsyon.
       *[other] Ali papansinan ing ali numerikung { $type } ning punsyon.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ali papansinan ing alang lamang kamaragulan ning punsyon.
        [minimum] Ali papansinan ing alang lamang kaditakan ning punsyon.
        [extremum] Ali papansinan ing alang lamang ekstremum ning punsyon.
        [point] Ali papansinan ing alang lamang punto ning punsyon.
       *[other] Ali papansinan ing alang lamang { $type } ning punsyon.
    }

function-points-too-close = Atin adwang punto ing punsyon a masyadung malapit. Ali malyaring depinisyunan ing punsyon.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Malyari mu reng iterasyon ning punsyon nung pareu ing bilang da reng input at ing bilang da reng output. Ining punsyon atin yang { $inputs } a input at { $outputs } a output.

## `<sequence>`

sequence-invalid-length = Ali balido ing kaba ning sequence.  Dapat ali negatibong integer.

sequence-invalid-step = Ali balido ing step ning sequence.  Dapat numero para king sequence a type { $type }.

sequence-invalid-endpoint-number = Ali balido a "{ $attribute }" ning sequence a numero.  Dapat numero.

sequence-invalid-endpoint-letters = Ali balido a "{ $attribute }" ning sequence a letra.  Dapat kombinasyon da reng letra.

sequence-invalid-endpoint = Ali balido a "{ $attribute }" ning sequence.

select-from-sequence-coprime-not-numbers = ali papansinan ing coprime uling ali numero ing pipilinan

select-from-sequence-coprime-with-exclude-combinations = ali papansinan ing coprime uling metakda ing excludeCombinations

## Resolving a `target`

target-not-found = Ali balido a target para king `<{ $source }>`: ali akit ing target.

target-state-variable-not-found = Ali balido a target para king `<{ $source }>`: ali akit ing baryable a estadu a milagyuang "{ $property }" king metung a `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Dapat aliwa la reng baryable ning `<odeSystem>` king independienteng baryable.

ode-system-duplicate-variable-names = Ali malyaring depinisyunan deng punsyon a RHS ning ODE a pareu ing lagyu da reng baryable a manalig.

ode-system-rhs-function-error = Ali malyaring depinisyunan ing punsyon a RHS ning ODE.  Atin kamalian king pamagawa king punsyon a mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ali malyaring depinisyunan ing anggulo king libutad da reng { $count } a linya

angle-invalid-through-point = Ali balido a punto king through ning `<angle>`

parabola-vertex-too-many-points = Ala pang mapatupad ing parabolang atin bertise a dumalan king labis king 1 a punto.

parabola-too-many-points = Ala pang mapatupad ing parabolang dumalan king labis king 3 a punto.

intersection-too-many-items = Ala pang mapatupad ing intersection para king labis king adwang bage

## Other math components

ionic-compound-not-two-ions = Ala pang mapatupad ing kompuwestong ioniko para king aliwa liban king adwang ion.

ionic-compound-needs-cation-and-anion = Mepatupad ing kompuwestong ioniko para mu king metung a cation at metung a anion.

solve-equations-cannot-evaluate = Ali malutas ing ekwasyon uling ali me-timbang ing ekwasyon: { $equation }

math-operators-operand-number-required = Dapat matakda ing operandNumber nung kukwa kang operand a matematika.

eigen-decomposition-failed = Ali mekwenta reng eigenvalue ning matris

## `<matchesPattern>`

# No select: the parameter list carries no number that the noun would show.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: ing parametro a { $parameters } ali ya lalto king pattern, inya lagi yang mitutugma king blangko.

## `<graph>`

graph-grid-invalid = `<graph>`: ali maintindian ing grid="{ $grid }". Dapat none, medium, dense, o adwang positibong numerung mibulag king espasyo, anti ing grid="1 0.5". Alang grid a igugulis.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: alang suporta ing xLabelPosition="left" king renderer a prefigure; gagamitan ing ugali ning wanan a posisyon.

prefigure-y-label-position-unsupported = `<graph>`: alang suporta ing yLabelPosition="bottom" king renderer a prefigure; gagamitan ing ugali ning babo a posisyon.

prefigure-invalid-axis-bounds = `<graph>`: ali balido reng angganan ning aksis para king konbersyon a prefigure; gagamitan ing karaniwan a bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ali balido ing lapad para king konbersyon a prefigure; gagamitan ing karaniwan a lapad ning diagram a 425.

prefigure-invalid-aspect-ratio = `<graph>`: ali balido ing aspectRatio para king konbersyon a prefigure; gagamitan ing karaniwan a aspect ratio a 1.

prefigure-grid-spacing-too-fine = `<graph>`: masyadung malapit ing libutad ning grid para karing angganan ning aksis; ali ilalage ing grid king renderer a prefigure.

prefigure-annotations-not-rendered = `<graph>`: ali ma-render deng annotation nung ali ing renderer a PreFigure ing gagamitan.

multiple-annotations-children = Dakal a anak a `<annotations>` ing mekit king `<graph>`; ali papansinan la ngan liban king tauli.

## Referring to other components

copy-unrecognized-component-type = Ali malyaring i-extend o kopyan ing ali kilalang klase ning komponente: { $type }.

copy-prop-not-found = Ali akit ing prop a { $property } king komponenteng klase { $component }

collect-no-source = Alang mekit a source para king collect.

collect-invalid-component-type = Ali malyaring tipunan deng komponenteng klase `<{ $component }>` uling ali balidung klase ning komponente.

reference-index-unavailable = Ali maturu ing indise a `{ $reference }`

## `<callAction>`

component-action-unavailable = Ali matawag ing { $action } king komponente a `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Ali balido ing porma ning datos.  Ali pareu ing kaba da reng gulis. Mekit king componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Atin pareung lagyu ning haligi ing datos.  Mekit king componentIdx :{ $componentIdx }

data-frame-missing-column-name = Alang lagyu ing metung a haligi ning datos.  Mekit king componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ing award ning pakibat a ini mibase ya king mismung mipadalang pakibat ning answer tag, at magdala ya ining ali inaasahan a ugali.

answer-max-num-attempts-in-section-wide-check-work = Alang epektu ing pamaglage `maxNumAttempts` king metung a `<answer>` kilub ning kontenedor a atin `sectionWideCheckWork`, uling ing kontenedor ing manibala king bilang da reng subuk. Ilage ing `maxNumAttempts` king kontenedor.

nested-section-wide-check-work-max-num-attempts = Alang epektu ing pamaglage `maxNumAttempts` king kontenedor a atin `sectionWideCheckWork` a atiu kilub ning aliwang kontenedor a atin `sectionWideCheckWork`, uling ing kilwal a kontenedor ing manibala king bilang da reng subuk. Ilage ing `maxNumAttempts` king kilwal a kontenedor.

# No select: «atributo» is the same word for one and for many.
answer-attributes-need-symbolic-equality = Alang epektu ing atributo a { $attributes } nung ali melage ing symbolicEquality.

answer-invalid-type = Ali balido a klase para king pakibat: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Uling alang lagyu ing komponente a `<{ $component }>`, ali ya magamit para king atributo ning module

module-attribute-name-already-defined = Ali magamit ing komponente a `<{ $component } name="{ $name }">` antimong atributo ning module uling ing klase ning komponente a `<module>` atin neng atributo a "{ $name }".

conditional-content-condition-ignored = Ali papansinan ing atributo a `condition` king komponente a `<conditionalContent>` a atin anak a case o else.

slider-markers-type-mismatch = Ali mitutugma ing klase da reng marker at ing klase ning slider.

pretzel-problem-needs-statement-and-answer = Ali balido a pretzel: dapat atin lamang metung a `<statement>` at metung a `<answer>` ing balang `<problem>`.

pretzel-circuit-first-problem-distractor = Ali balido a pretzel: king mode="circuit", ali malyaring distractor ing mumunang `<problem>`.

## Attribute values

# No select: «alaga» is the same word for one and for many.
attribute-invalid-values = Ali balido a alaga a { $values } para king atributo a `{ $attribute }`; ali papansinan.

attribute-must-be-references = Ali balido a alaga a `{ $value }` para king atributo a `{ $attribute }`. Dapat mibuu ing atributo karing referensiang mangumpisa king `$`.

math-input-invalid-function-names = <mathInput>: ali pepansinan deng ali balidung lagyu ning punsyon king { $attribute }: { $names }. Dapat atin ing balang lagyu ali kulang king 2 a karakter (letra o gitlo); malyaring tuki ing metung a suffix a `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Ali balido a klase ning komponente: `<{ $componentType }>`

attribute-repeated = Ali malyaring uliten ing atributo a { $attribute }.

attribute-invalid-for-component = Ali balido a atributo a "{ $attribute }" para king komponenteng klase `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Kulang ing kontraste ning depinisyon ning estilo a { $styleNumber } para king { $context ->
        [text-on-background] kule ning teksto laban king kule ning background
        [high-contrast] kuleng matas ing kontraste laban king kanbas
        [line] kule ning linya laban king kanbas
        [marker] kule ning marker laban king kanbas
       *[text-on-canvas] kule ning teksto laban king kanbas
    }{ $mode ->
        [dark] { " (madalumdum a mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kailangan ing ali kulang king { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Agyang atin ing depinisyon ning estilo a { $styleNumber } metakdang kule a sapat ing kontraste para king malino a mode, kulang ing kontraste ning kule ning teksto laban king kule ning background karing kuleng mekuha para king madalumdum a mode ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kailangan ing ali kulang king { $threshold }:1). { $suggestion ->
        [available] Ban sapat ing kontraste king madalumdum a mode, dagdagan ing kontraste ning malino a mode (alimbawa, ilage ing { $lightAttribute }="{ $lightColor }") o salinan ing kule ning madalumdum a mode (alimbawa, ilage ing { $darkAttribute }="{ $darkColor }").
       *[none] Ban sapat ing kontraste king madalumdum a mode, dagdagan ing kontraste ning malino a mode o salinan deng mekuhang kule king textColorDarkMode at/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Agyang atin ing depinisyon ning estilo a { $styleNumber } metakdang kule ning teksto a sapat ing kontraste para king malino a mode, kulang ing kontraste ning kule ning teksto a mekuha para king madalumdum a mode laban king kanbas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kailangan ing ali kulang king { $threshold }:1). { $suggestion ->
        [available] Ban sapat ing kontraste king madalumdum a mode, dagdagan ing kontraste ning malino a mode (alimbawa, ilage ing textColor="{ $lightColor }") o salinan ing kule ning madalumdum a mode (alimbawa, ilage ing textColorDarkMode="{ $darkColor }").
       *[none] Ban sapat ing kontraste king madalumdum a mode, dagdagan ing kontraste ning malino a mode o salinan ing mekuhang kule king textColorDarkMode.
    }

section-multiple-style-palettes = Metung mu a <stylePalette> ing malyaring piliin ning metung a seksyon; gagamitan ing tauli.

## Unique variants

variant-num-to-select-not-non-negative-integer = ali me-alaman deng bukod tanging baryante ning { $component } uling ing numToSelect ali yang integer a ali negatibo.

variant-num-to-select-not-constant-number = ali me-alaman deng bukod tanging baryante ning { $component } uling ing numToSelect ali yang konstanteng numero.

variant-with-replacement-not-constant-boolean = ali me-alaman deng bukod tanging baryante ning { $component } uling ing withReplacement ali yang konstanteng boolean.

variant-select-weight-disables-unique = Mipapatda reng bukod tanging baryante para king select nung atin opsyon a metakdaan king selectWeight o selectForVariants

variant-coprime-undetermined = ali me-alaman deng bukod tanging baryante ning { $component } uling ali me-alaman nung lagi yang false ing coprime.

variant-attribute-not-constant = ali me-alaman deng bukod tanging baryante ning { $component } uling ali konstante ing { $attribute }.

variant-attribute-not-number = ali me-alaman deng bukod tanging baryante ning { $component } uling ali numero ing { $attribute }.

variant-attribute-wrong-type-for-sequence =
    ali me-alaman deng bukod tanging baryante ning { $component } a klase { $type } uling ing { $attribute } ali ya { $expected ->
        [letters-combination] kombinasyon da reng letra
        [math-expression] balidung ekspresyon a matematika
        [integer] integer
       *[number] numero
    }.

variant-length-not-integer = ali me-alaman deng bukod tanging baryante ning { $component } uling ali integer ing length.

variant-sort-not-implemented = ala pang mapatupad deng bukod tanging baryante ning metung a { $component } a atin sort

variant-exclude-combinations-not-implemented = ala pang mapatupad deng bukod tanging baryante ning metung a { $component } a atin excludeCombinations

variant-math-exclude-not-implemented = ala pang mapatupad deng bukod tanging baryante ning metung a { $component } a klase math a atin exclude

variant-non-constant-exclude-not-implemented = ala pang mapatupad deng bukod tanging baryante ning metung a { $component } a atin ali konstanteng exclude

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: alang suporta king renderer a prefigure ning graph; melaktawan ing kaladwan.

prefigure-descendant-invalid-geometry = { $subject }: ali angganan o ali kumpletu ing heometriya; melaktawan ing kaladwan.

prefigure-curve-label-omitted = { $subject }: alang suporta deng etiketa karing mekonberteng kurba; ali pepansinan ing etiketa.

prefigure-curve-unsupported-definition-type = { $subject }: alang suporta a klase ning depinisyon ning punsyon a kurba a '{ $definitionType }'; melaktawan ing kaladwan.

prefigure-region-flip-functions-unsupported = { $subject }: alang suporta a atributo a flipFunctions king regionBetweenCurves; melaktawan ing kaladwan.

prefigure-region-non-formula-child = { $subject }: deng anak a punsyon a klase formula mu ing atin suporta king regionBetweenCurves; melaktawan ing kaladwan.

prefigure-label-position-unsupported =
    { $subject }: alang suporta a labelPosition '{ $labelPosition }' para king { $labelKind ->
        [line-family] etiketa ning pamilya ning linya
       *[point] etiketa ning punto
    }; gagamitan ing karaniwan a pamagpantay ning PreFigure.

prefigure-fill-style-unsupported = { $subject }: alang suporta ing PreFigure king estilo ning laman a '{ $fillStyle }'; mibalik king solidung laman.

prefigure-line-style-unknown = { $subject }: ali kilalang estilo ning linya a '{ $lineStyle }', ali melage king output ning PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: mesugpung ing estilo ning marker a '{ $markerStyle }' king estilo a 'diamond' ning PreFigure.

prefigure-marker-style-unsupported = { $subject }: alang suporta ing PreFigure king estilo ning marker a '{ $markerStyle }'; gagamitan ing karaniwan a estilo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ali balido a `ref`; ali maturu ing target. Ali melage ing annotation.

annotation-ref-multiple-targets = `<annotation>`: minuru ya ing `ref` karing dakal a target; gagamitan ing mumunang target.

annotation-ref-outside-graph = `<annotation>`: ali balido a `ref`; atiu ing target kilwal ning graph a maglaman kaniti. Ali melage ing annotation.

annotation-ref-unsupported-target = `<annotation>`: ali balido a `ref`; ing target ali yang suportadung grapikal a bage king konbersyon a prefigure. Ali melage ing annotation.

annotation-text-missing = `<annotation>`: ala o blangko ing `text`; maglalabas blangkung teksto.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Atin mekit a sirkular a pamanalig.
       *[other] Atin mekit a sirkular a pamanalig a kayabe ne ing komponente a `<{ $componentType }>`.
    }

reference-no-referent = Alang mekit a tinuturu ning referensia: `{ $reference }`

reference-multiple-referents = Dakal a mekit a tinuturu ning referensia: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ali balido a pormat ning atributo a { $attribute } ning `<{ $componentType }>`.

children-invalid = Ali balido la reng anak ning `<{ $componentType }>`: mekit la reng ali balidung anak: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ali balido a alaga a `{ $value }` para king atributo a `{ $attribute }`, gagamitan ing alaga a `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ali akit ing bersyon ning DoenetML a { $version }.
       *[other] Ali akit ing bersyon ning DoenetML a { $version }. Mibalik king bersyon a { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Ali balido a DoenetML: { $content }

parse-tag-missing-close-tag = Ali balido a DoenetML: Alang pamanyarang tag ing tag a `{ $tag }`. Aasahan ing tag a sasara king sarili o tag a `</{ $tagName }>`.

parse-tag-error = Ali balido a DoenetML: Atin kamalian king tag a `<{ $tagName }>`

parse-attribute-missing-value = Ali balido a DoenetML: Anti mo alang alaga ing ali balidung atributo a `{ $attribute }`.

parse-attribute-invalid = Ali balido a DoenetML: Ali balido a atributo a `{ $attribute }`

parse-attribute-value-invalid = Ali balido a DoenetML: Ali balido a alaga ning atributo a `{ $value }`

parse-attribute-value-quote-mismatch = Ali balido a DoenetML: Ali balido a alaga ning atributo a `{ $value }`. Ali mitutugma reng marka ning sipi. Anti mo alang metung a `{ $quote }`

parse-open-tag-name-missing = Ali balido a DoenetML: Atin mekit a tag a alang lagyu, alimbawa `<`

parse-tag-not-closed = Ali balido a DoenetML: Ali mesara ing tag a `{ $tag }` (anti mo alang `>`).

parse-self-closing-tag-name-missing = Ali balido a DoenetML: Atin mekit a tag a alang lagyu `<{ $content }>`

parse-self-closing-tag-not-closed = Ali balido a DoenetML: Ali mesara ing tag a `{ $tag }` (anti mo alang `/>`).

parse-tag-invalid-attributes = Ali balido a DoenetML: Ali balido ing tag a `{ $tag }`. Baka atin ali tamang atributo.

parse-close-tag-name-missing = Ali balido a DoenetML: Atin mekit a pamanyarang tag a alang lagyu, alimbawa `</`

parse-attribute-value-unquoted = Dapat atiu kilub da reng marka ning sipi deng alaga ning atributo: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ali balido a DoenetML: Atin mekit a pamanyarang tag a `{ $tag }`, oneng alang katumbas a pamagbuklat a tag

parse-close-tag-mismatched = Ali balido a DoenetML: Ali mitutugma ing pamanyarang tag. Aasahan ing `</{ $expected }>`. Mekit ing `{ $found }`

parser-node-unconvertible = Ali mekonberte ing node a { $node } king node a Dast.

## Names

name-attribute-invalid =
    Ali balido a atributo a name='{ $name }'. { $reason ->
        [characters] Malyari mung maglaman deng lagyu karing letra, numero, underscore o gitlo.
       *[start] Dapat mangumpisa reng lagyu king letra.
    }

component-name-invalid-start = Ali balido a lagyu ning komponente a "{ $name }". Dapat mangumpisa reng lagyu king letra.

## `<answer>` sugar

answer-video-watched-missing-video = Dapat atin atributo a video ing answer a type videoWatched

answer-video-watched-video-not-reference = Dapat referensia ing atributo a video ning answer a type videoWatched

answer-name-not-single-text = Dapat atin metung mu a anak a text ing atributo a name ning answer

## Referencing another document

external-doenetml-recursion-limit = Ali mekua ing kilwal a DoenetML uling masyadung dakal a lebel ning pamanulit. Atin wari sirkular a referensia?

external-doenetml-unavailable = Ali mekua ing DoenetML manibat king { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Ali balido a DoenetML ing mekua manibat king { $attribute }="{ $uri }": ali ya mitugma king klase ning komponente a "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ali na gagamitan ing atributo a `{ $from }`; gamitan ing `{ $to }`.
       *[other] [deprecation] Ali na gagamitan ing atributo a `{ $from }` king `<{ $component }>`; gamitan ing `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ali na gagamitan ing atributo a `{ $from }` at ali papansinan uling metakda mu naman ing `{ $to }`.
       *[other] [deprecation] Ali na gagamitan ing atributo a `{ $from }` king `<{ $component }>` at ali papansinan uling metakda mu naman ing `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Ali na gagamitan ing atributo a `{ $attribute }` king `<{ $component }>` at ali papansinan.

deprecated-attribute-to-child = [deprecation] Ali na gagamitan ing atributo a `{ $attribute }` king `<{ $component }>`; gamitan ing anak a `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Ali na gagamitan ing alaga a `{ $value }` ning atributo a `{ $attribute }` king `<{ $component }>`; gamitan ing `{ $to }`.


## Language coverage

pluralize-english-only = Ing `<pluralize>` malyari na mung padakalan ing Ingles, inya ali mibayu ing teksto na king dokumentung mesulat king { $locale }. Isulat a mismu ing pormang dakal, o ilage ya king atributo a `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ing elemento a `<{ $tag }>` ali yang kilalang elemento ning Doenet.

schema-element-not-allowed-at-root = Ali mipapayntulut ing elemento a `<{ $tag }>` king ugat ning dokumento.

schema-element-not-allowed-inside = Ali mipapayntulut ing elemento a `<{ $tag }>` kilub ning `<{ $parent }>`.

schema-attribute-unrecognized = Alang atributo a milagyuang `{ $attribute }` ing elemento a `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Dapat lista ing atributo a `{ $attribute }` ning elemento a `<{ $tag }>` a ing balang bage na metung karing: { $allowed }
       *[other] Dapat metung karing reti ing atributo a `{ $attribute }` ning elemento a `<{ $tag }>`: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ali balido a lagyu ning baryante para king select.  Ing lagyu ning baryante a { $variantName } lalto ya king { $numOptions } a opsyon oneng { $numToSelect } ing bilang a pipilinan.

select-variant-name-without-options = Atin metakdang baryante para king select oneng alang metakdang opsyon para king malyaring lagyu ning baryante: { $variantName }.

select-variant-name-not-possible = Ing lagyu ning baryante a { $variantName } a metakda para king select ali yang malyaring lagyu ning baryante.

select-too-few-options = Ali malyaring mamili { $numToSelect } a komponente manibat king { $numOptions } mu.

select-from-sequence-too-few-values = Ali malyaring mamili { $numToSelect } a alaga manibat king sequence a { $length } ing kaba.

select-from-sequence-indices-count-mismatch = Dapat mitugma ing bilang da reng indise a metakda para king select at ing bilang a pipilinan

select-from-sequence-indices-not-integers = Dapat integer la ngan deng indise a metakda para king select

select-from-sequence-index-excluded = Metakda ing indise ning selectfromsequence a ali melage

select-from-sequence-indices-excluded-combination = Metakda reng indise ning selectfromsequence a metung a ali melageng kombinasyon

select-from-sequence-coprime-not-positive-integers = Ali malyaring mamili kombinasyon a coprime uling ali positibong integer ing pipilinan.

select-from-sequence-coprime-common-factor = Ali malyaring mamili numerong coprime. Atin metung a paktor a pareu la ngan deng malyaring alaga. (Dapat coprime ing metakdang alaga ning "from" o "to" king "step".)

select-from-sequence-coprime-single-number = Ali malyaring mamili kombinasyon a coprime manibat king metung mung numerung ali 1.

select-from-sequence-excluded-too-many-combinations = Ali melage ing labis king 70% da reng kombinasyon king selectFromSequence

select-from-sequence-coprime-none-found = Ali mekapamili numerong coprime. Atin metung a paktor a pareu la ngan deng malyaring alaga.

select-from-sequence-too-few-unique-values = Ali malyaring mamili { $numToSelect } a bukod tanging alaga manibat king sequence a { $numPossibleValues } ing kaba

select-prime-numbers-too-few-values = Ali malyaring mamili { $numToSelect } a alaga manibat king listang prime a { $numValues } ing kaba

select-prime-numbers-values-count-mismatch = Dapat mitugma ing bilang da reng alaga a metakda para king select at ing bilang a pipilinan

select-prime-numbers-values-not-prime = Dapat atiu king listang prime la ngan deng alaga a metakda para king select prime number

select-prime-numbers-values-excluded-combination = Deng metakdang alaga ning selectPrimeNumbers metung lang ali melageng kombinasyon

select-prime-numbers-excluded-too-many-combinations = Ali melage ing labis king 70% da reng kombinasyon king selectPrimeNumbers

select-random-combination-fluke = Uling king pambihirang swerte, ali mekapamili kombinasyon da reng random a alaga

select-random-value-fluke = Uling king pambihirang swerte, ali mekapamili random a alaga
