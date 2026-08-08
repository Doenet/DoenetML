# Waray diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Waray marks no number on the noun, so a counted message whose only English
# difference is the noun's number renders one string here and the select is
# dropped. The count still arrives and is still formatted.
#
# The linker is written as the free «nga» throughout; see `content.ftl`.


## `<lineSegment>`

# No select: «ginsasalikway» does not agree with what is ignored, and the list
# carries no number of its own.
line-segment-attributes-ignored-with-endpoints = ginsasalikway an { $attributes } kon gintakda an duha nga punta

line-segment-attributes-ignored-with-endpoint-and-midpoint = ginsasalikway an { $attributes } kon gintakda an usa nga punta ngan an butnga

line-segment-midpoint-offset-without-midpoint = waray epekto an midpointOffset kon waray butnga

## `<line>`

line-points-undetermined-dimensions = Linya nga naagi ha mga punto nga diri natukoy an dimensyon.

line-points-too-few-dimensions = Kinahanglan naagi an linya ha mga punto nga may-ada diri maminos ha duha nga dimensyon.

line-points-depend-on-variables = An linya naagi ha mga punto nga nasarig ha mga baryable: { $variables }.

line-equation-invalid-format = Imbalido nga pormat han ekwasyon han linya ha mga baryable nga { $variable1 } ngan { $variable2 }.

## `<ray>`

ray-overprescribed-through = An sinag gintakda pinaagi han through, endpoint ngan direction.  Ginsasalikway an gintakda nga through.

ray-dimension-mismatch = diri nagkakaurusa an numDimensions ha sinag.

## `<vector>`

vector-overprescribed-head = An bektor gintakda pinaagi han head, tail ngan displacement.  Ginsasalikway an gintakda nga head.

vector-dimension-mismatch = diri nagkakaurusa an numDimensions ha bektor.

## Attracting and constraining

attract-to-without-nearest-point = Diri mahimo mag-aghat ngadto ha `<{ $component }>` kay waray ini baryable nga estado nga nearestPoint.

constrain-to-without-nearest-point = Diri mahimo magpugong ngadto ha `<{ $component }>` kay waray ini baryable nga estado nga nearestPoint.

constrain-to-interior-without-nearest-point = Diri mahimo magpugong ngadto ha sulod han `<{ $component }>` kay waray ini baryable nga estado nga nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = ginsasalikway an labelPosition para ha choiceInput nga diri inline

## Ordering children by index

choice-input-indices-count-mismatch = Ginsasalikway an mga indise nga gintakda para ha choiceInput kay diri nagkakaurusa an kadamu han mga indise ngan an kadamu han mga anak nga pilianan.

pretzel-indices-count-mismatch = Ginsasalikway an mga indise nga gintakda para ha problem kay diri nagkakaurusa an kadamu han mga indise ngan an kadamu han mga anak nga problem.

shuffle-indices-count-mismatch = Ginsasalikway an mga indise nga gintakda para ha shuffle kay diri nagkakaurusa an kadamu han mga indise ngan an kadamu han mga komponente.

indices-ignored-out-of-range = Ginsasalikway an mga indise nga gintakda para ha { $component } kay may-ada indise nga labaw ha sakop.

pretzel-indices-repeated = Ginsasalikway an mga indise nga gintakda para ha pretzel kay may-ada indise nga nauulit.

pretzel-circuit-first-index = Ginsasalikway an mga indise nga gintakda para ha pretzel ha mode nga circuit kay kinahanglan 1 an siyahan nga indise.

## `<shuffle>` and `<sort>`

string-children-need-type = Basi gumana an `<{ $component }>` ha mga anak nga string, kinahanglan itakda an atributo nga `type`.

invalid-type-defaulting-to-math = Imbalido nga type { $type } para ha komponente nga { $component }. Kinahanglan usa ha math, text, number, o boolean. Ginagamit an math.

string-not-valid-component-to-arrange = An string nga "{ $value }" diri balido nga komponente para ha { $component }. Ginsasalikway.

## Types and variables

invalid-type-defaulting-to-number = Imbalido nga type { $type }, ginbubutang an type ha number.

invalid-variable-value = Imbalido nga bili han usa nga baryable: `{ $value }`

## Variants

variant-index-must-be-number = Kinahanglan numero an indise han baryante nga { $index }

variant-index-must-be-integer = Kinahanglan integer an indise han baryante nga { $index }

## `<sideBySide>`

side-by-side-absolute-widths = Waray pa ipatuman an `<{ $component }>` para ha absoluto nga sukol. Ginbubutang an mga kahaluag nga relatibo.

side-by-side-absolute-margins = Waray pa ipatuman an `<{ $component }>` para ha absoluto nga sukol. Ginbubutang an mga margin nga relatibo.

side-by-side-no-block-child = Imbalido nga `<{ $component }>`: kinahanglan may-ada ini diri maminos ha usa nga anak nga block.

## `<label>`

label-for-ignored-on-graphical = Ginsasalikway an atributo nga `for` ha grapikal nga `<label>`.

label-for-must-resolve-to-one = Kinahanglan matudlok an atributo nga `for` ha `<label>` ngadto ha eksakto nga usa nga komponente.

label-for-unresolved = Diri natudlok an atributo nga `for` ha `<label>` ngadto ha usa nga komponente.

label-for-answer-with-authored-inputs = An atributo nga `for` ha `<label>` natudlok ha usa nga `<answer>` nga may-ada mga input nga ginsurat han awtor; tudloka an input mismo.

label-for-answer-without-input = An atributo nga `for` ha `<label>` natudlok ha usa nga `<answer>` nga waray input nga eetiketahan.

label-for-must-reference-input-or-answer = Kinahanglan natudlok an atributo nga `for` ha `<label>` ngadto ha usa nga input o usa nga answer.

## Accessibility

accessibility-short-description-or-decorative = Para ha aksesibilidad, kinahanglan may-ada an `<{ $component }>` halipot nga deskripsyon o gintakda nga dekoratibo.

accessibility-video-short-description = Para ha aksesibilidad, kinahanglan may-ada an `<video>` halipot nga deskripsyon.

accessibility-input-short-description-or-label = Para ha aksesibilidad, kinahanglan may-ada an `<{ $component }>` halipot nga deskripsyon o etiketa.

accessibility-answer-input-short-description-or-label = Para ha aksesibilidad, kinahanglan may-ada halipot nga deskripsyon o etiketa an usa nga `<answer>` nga naghihimo hin input.

accessibility-short-description-contains-math = Diri unta nagsusulod an mga halipot nga deskripsyon hin mga komponente nga matematika sugad han `<{ $component }>`. Isurat ha mga pulong an bisan ano nga matematika.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Kulang an kontraste han { $colorName } para ha teksto han ulohan han seksyon (madulom nga mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ginkikinahanglan an diri maminos ha { $threshold }:1).
       *[other] Kulang an kontraste han { $colorName } para ha teksto han ulohan han seksyon ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ginkikinahanglan an diri maminos ha { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Waray pa ipatuman an `<circle>` nga naagi ha { $count } nga punto kon waray numeriko nga bili an mga punto.

circle-too-many-through-points = Diri mahimo kwentahon an sirkulo nga naagi ha sobra ha 3 nga punto.

circle-overprescribed-radius-center-points = Diri mahimo kwentahon an sirkulo nga may gintakda nga radyus, sentro ngan mga punto nga aagian.

circle-center-with-multiple-points = Diri mahimo kwentahon an sirkulo nga may gintakda nga sentro nga naagi ha sobra ha 1 nga punto.

circle-radius-too-small = Diri mahimo kwentahon an sirkulo: tungod kay an distansya han duha nga punto amo an { $distance }, gutiay hinduro an gintakda nga radyus nga { $radius }.

circle-radius-with-many-points = Diri mahimo maghimo hin sirkulo nga naagi ha sobra ha duha nga punto nga may gintakda nga radyus.

circle-invalid-center-or-through-points = Imbalido an sentro o an mga punto nga aagian han sirkulo.

circle-radius-center-with-multiple-points = Diri mahimo kwentahon an radyus han sirkulo nga may gintakda nga sentro nga naagi ha sobra ha 1 nga punto.

circle-change-radius-non-numerical = Diri mahimo baynon an radyus han sirkulo nga naagi ha mga punto nga diri numeriko

circle-radius-with-points-non-numerical = Diri mahimo maghimo hin sirkulo nga naagi ha sobra ha usa nga punto nga may gintakda nga radyus kon waray numeriko nga bili.

circle-change-center-non-numerical = Waray pa ipatuman an pagbag-o han sentro han sirkulo nga naagi ha mga punto nga waray numeriko nga bili.

## `<function>`

# English's two counts multiply out to four sentences; Waray has one, because
# «interbalo» and «input» do not change for number. Both selects are dropped
# and both counts still arrive.
function-domain-insufficient-dimensions = Kulang an dimensyon han domain para ha punsyon. An domain may-ada { $intervals } nga interbalo kondi an punsyon may-ada { $inputs } nga input.

function-domain-invalid-format = Imbalido nga pormat han domain para ha punsyon.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ginsasalikway an diri numeriko nga pinakahitaas han punsyon.
        [minimum] Ginsasalikway an diri numeriko nga pinakahamubo han punsyon.
        [extremum] Ginsasalikway an diri numeriko nga ekstremum han punsyon.
        [point] Ginsasalikway an diri numeriko nga punto han punsyon.
        [slope] Ginsasalikway an diri numeriko nga hilis han punsyon.
       *[other] Ginsasalikway an diri numeriko nga { $type } han punsyon.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ginsasalikway an waray sulod nga pinakahitaas han punsyon.
        [minimum] Ginsasalikway an waray sulod nga pinakahamubo han punsyon.
        [extremum] Ginsasalikway an waray sulod nga ekstremum han punsyon.
        [point] Ginsasalikway an waray sulod nga punto han punsyon.
       *[other] Ginsasalikway an waray sulod nga { $type } han punsyon.
    }

function-points-too-close = May-ada an punsyon duha nga punto nga hirani hinduro. Diri madepinar an punsyon.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Posible la an mga iterasyon han punsyon kon parehas an kadamu han mga input ngan an kadamu han mga output. Ini nga punsyon may-ada { $inputs } nga input ngan { $outputs } nga output.

## `<sequence>`

sequence-invalid-length = Imbalido an kahilaba han sequence.  Kinahanglan diri negatibo nga integer.

sequence-invalid-step = Imbalido an step han sequence.  Kinahanglan numero para ha sequence nga type { $type }.

sequence-invalid-endpoint-number = Imbalido nga "{ $attribute }" han sequence nga numero.  Kinahanglan numero.

sequence-invalid-endpoint-letters = Imbalido nga "{ $attribute }" han sequence nga letra.  Kinahanglan kombinasyon han mga letra.

sequence-invalid-endpoint = Imbalido nga "{ $attribute }" han sequence.

select-from-sequence-coprime-not-numbers = ginsasalikway an coprime kay diri numero an ginpipili

select-from-sequence-coprime-with-exclude-combinations = ginsasalikway an coprime kay gintakda an excludeCombinations

## Resolving a `target`

target-not-found = Imbalido nga target para ha `<{ $source }>`: diri makit-an an target.

target-state-variable-not-found = Imbalido nga target para ha `<{ $source }>`: diri makit-an an baryable nga estado nga ginngangaranan hin "{ $property }" ha usa nga `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Kinahanglan lain an mga baryable han `<odeSystem>` ha independente nga baryable.

ode-system-duplicate-variable-names = Diri madepinar an mga punsyon nga RHS han ODE nga parehas an ngaran han mga baryable nga nasarig.

ode-system-rhs-function-error = Diri madepinar an punsyon nga RHS han ODE.  May sayop ha paghimo han punsyon nga mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Diri madepinar an anggulo ha butnga han { $count } nga linya

angle-invalid-through-point = Imbalido nga punto ha through han `<angle>`

parabola-vertex-too-many-points = Waray pa ipatuman an parabola nga may bertise nga naagi ha sobra ha 1 nga punto.

parabola-too-many-points = Waray pa ipatuman an parabola nga naagi ha sobra ha 3 nga punto.

intersection-too-many-items = Waray pa ipatuman an intersection para ha sobra ha duha nga butang

## Other math components

ionic-compound-not-two-ions = Waray pa ipatuman an kompuwesto nga ioniko para ha lain kondi duha nga ion.

ionic-compound-needs-cation-and-anion = Ginpatuman an kompuwesto nga ioniko para la ha usa nga cation ngan usa nga anion.

solve-equations-cannot-evaluate = Diri masulbad an ekwasyon kay diri natimbang an ekwasyon: { $equation }

math-operators-operand-number-required = Kinahanglan itakda an operandNumber kon nagkukuha hin operand nga matematika.

eigen-decomposition-failed = Diri nakwenta an mga eigenvalue han matris

## `<matchesPattern>`

# No select: the parameter list carries no number that the noun would show.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: an parametro nga { $parameters } waray maagi ha pattern, salit pirmi ini natutugbang ha blangko.

## `<graph>`

graph-grid-invalid = `<graph>`: diri masabtan an grid="{ $grid }". Kinahanglan none, medium, dense, o duha nga positibo nga numero nga ginbulag hin espasyo, sugad han grid="1 0.5". Waray grid nga gindrodrowing.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: waray suporta an xLabelPosition="left" ha renderer nga prefigure; ginagamit an paggawi han tuo nga posisyon.

prefigure-y-label-position-unsupported = `<graph>`: waray suporta an yLabelPosition="bottom" ha renderer nga prefigure; ginagamit an paggawi han igbaw nga posisyon.

prefigure-invalid-axis-bounds = `<graph>`: imbalido an mga utlanan han aksis para ha konbersyon nga prefigure; ginagamit an nakagawian nga bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: imbalido an kahaluag para ha konbersyon nga prefigure; ginagamit an nakagawian nga kahaluag han diagram nga 425.

prefigure-invalid-aspect-ratio = `<graph>`: imbalido an aspectRatio para ha konbersyon nga prefigure; ginagamit an nakagawian nga aspect ratio nga 1.

prefigure-grid-spacing-too-fine = `<graph>`: gutiay hinduro an butnga han grid para ha mga utlanan han aksis; ginsasalikway an grid ha renderer nga prefigure.

prefigure-annotations-not-rendered = `<graph>`: diri marerender an mga annotation kon diri an renderer nga PreFigure an ginagamit.

multiple-annotations-children = Damo nga anak nga `<annotations>` an nakit-an ha `<graph>`; ginsasalikway an ngatanan gawas ha ultimo.

## Referring to other components

copy-unrecognized-component-type = Diri mahimo i-extend o kopyahon an diri kilala nga klase han komponente: { $type }.

copy-prop-not-found = Diri nakit-an an prop nga { $property } ha komponente nga klase { $component }

collect-no-source = Waray nakit-an nga source para ha collect.

collect-invalid-component-type = Diri mahimo tirukon an mga komponente nga klase `<{ $component }>` kay imbalido nga klase han komponente.

reference-index-unavailable = Diri matudlok an indise nga `{ $reference }`

## `<callAction>`

component-action-unavailable = Diri matawag an { $action } ha komponente nga `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Imbalido an porma han datos.  Diri parehas an kahilaba han mga linya. Nakit-an ha componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = May parehas nga ngaran han kolum an datos.  Nakit-an ha componentIdx :{ $componentIdx }

data-frame-missing-column-name = Waray ngaran an usa nga kolum han datos.  Nakit-an ha componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = An award hini nga baton nabase ha mismo nga ginpadara nga baton han answer tag, ngan magdadara ini hin diri ginlalaoman nga paggawi.

answer-max-num-attempts-in-section-wide-check-work = Waray epekto an pagbutang hin `maxNumAttempts` ha usa nga `<answer>` ha sulod han kontenedor nga may `sectionWideCheckWork`, kay an kontenedor an nagkokontrol han kadamu han mga pagsari. Ibutang an `maxNumAttempts` ha kontenedor.

nested-section-wide-check-work-max-num-attempts = Waray epekto an pagbutang hin `maxNumAttempts` ha kontenedor nga may `sectionWideCheckWork` nga aada ha sulod hin lain nga kontenedor nga may `sectionWideCheckWork`, kay an gawas nga kontenedor an nagkokontrol han kadamu han mga pagsari. Ibutang an `maxNumAttempts` ha gawas nga kontenedor.

# No select: «atributo» is the same word for one and for many.
answer-attributes-need-symbolic-equality = Waray epekto an atributo nga { $attributes } kon waray ibutang an symbolicEquality.

answer-invalid-type = Imbalido nga klase para ha baton: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Tungod kay waray ngaran an komponente nga `<{ $component }>`, diri ini magagamit para ha atributo han module

module-attribute-name-already-defined = Diri magagamit an komponente nga `<{ $component } name="{ $name }">` sugad nga atributo han module kay an klase han komponente nga `<module>` may-ada na atributo nga "{ $name }".

conditional-content-condition-ignored = Ginsasalikway an atributo nga `condition` ha komponente nga `<conditionalContent>` nga may mga anak nga case o else.

slider-markers-type-mismatch = Diri nagkakaurusa an klase han mga marker ngan an klase han slider.

pretzel-problem-needs-statement-and-answer = Imbalido nga pretzel: kinahanglan may sulod an kada `<problem>` nga usa nga `<statement>` ngan usa nga `<answer>`.

pretzel-circuit-first-problem-distractor = Imbalido nga pretzel: ha mode="circuit", diri mahimo distractor an siyahan nga `<problem>`.

## Attribute values

# No select: «bili» is the same word for one and for many.
attribute-invalid-values = Imbalido nga bili nga { $values } para ha atributo nga `{ $attribute }`; ginsasalikway.

attribute-must-be-references = Imbalido nga bili nga `{ $value }` para ha atributo nga `{ $attribute }`. Kinahanglan binubuo an atributo hin mga reperensya nga natikang ha `$`.

math-input-invalid-function-names = <mathInput>: ginsalikway an mga imbalido nga ngaran han punsyon ha { $attribute }: { $names }. Kinahanglan may-ada an kada ngaran diri maminos ha 2 nga karakter (letra o gitlo); mahimo sumunod an usa nga suffix nga `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Imbalido nga klase han komponente: `<{ $componentType }>`

attribute-repeated = Diri mahimo ulitón an atributo nga { $attribute }.

attribute-invalid-for-component = Imbalido nga atributo nga "{ $attribute }" para ha komponente nga klase `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Kulang an kontraste han depinisyon han estilo nga { $styleNumber } para ha { $context ->
        [text-on-background] kolor han teksto kontra ha kolor han background
        [high-contrast] kolor nga hitaas an kontraste kontra ha kanbas
        [line] kolor han linya kontra ha kanbas
        [marker] kolor han marker kontra ha kanbas
       *[text-on-canvas] kolor han teksto kontra ha kanbas
    }{ $mode ->
        [dark] { " (madulom nga mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ginkikinahanglan an diri maminos ha { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Bisan kon an depinisyon han estilo nga { $styleNumber } may-ada gintakda nga mga kolor nga igo an kontraste para ha maliwanag nga mode, kulang an kontraste han kolor han teksto kontra ha kolor han background ha mga kolor nga ginkuha para ha madulom nga mode ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ginkikinahanglan an diri maminos ha { $threshold }:1). { $suggestion ->
        [available] Basi igo an kontraste ha madulom nga mode, dugangi an kontraste han maliwanag nga mode (pananglitan, ibutang an { $lightAttribute }="{ $lightColor }") o palitan an kolor han madulom nga mode (pananglitan, ibutang an { $darkAttribute }="{ $darkColor }").
       *[none] Basi igo an kontraste ha madulom nga mode, dugangi an kontraste han maliwanag nga mode o palitan an mga ginkuha nga kolor pinaagi han textColorDarkMode ngan/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Bisan kon an depinisyon han estilo nga { $styleNumber } may-ada gintakda nga kolor han teksto nga igo an kontraste para ha maliwanag nga mode, kulang an kontraste han kolor han teksto nga ginkuha para ha madulom nga mode kontra ha kanbas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ginkikinahanglan an diri maminos ha { $threshold }:1). { $suggestion ->
        [available] Basi igo an kontraste ha madulom nga mode, dugangi an kontraste han maliwanag nga mode (pananglitan, ibutang an textColor="{ $lightColor }") o palitan an kolor han madulom nga mode (pananglitan, ibutang an textColorDarkMode="{ $darkColor }").
       *[none] Basi igo an kontraste ha madulom nga mode, dugangi an kontraste han maliwanag nga mode o palitan an ginkuha nga kolor pinaagi han textColorDarkMode.
    }

section-multiple-style-palettes = Usa la nga <stylePalette> an mahimo pilion han usa nga seksyon; ginagamit an ultimo.

## Unique variants

variant-num-to-select-not-non-negative-integer = diri matukoy an mga naurusahan nga baryante han { $component } kay an numToSelect diri integer nga diri negatibo.

variant-num-to-select-not-constant-number = diri matukoy an mga naurusahan nga baryante han { $component } kay an numToSelect diri konstante nga numero.

variant-with-replacement-not-constant-boolean = diri matukoy an mga naurusahan nga baryante han { $component } kay an withReplacement diri konstante nga boolean.

variant-select-weight-disables-unique = Ginpapara an mga naurusahan nga baryante para ha select kon may opsyon nga gintakdaan hin selectWeight o selectForVariants

variant-coprime-undetermined = diri matukoy an mga naurusahan nga baryante han { $component } kay diri matukoy kon pirmi false an coprime.

variant-attribute-not-constant = diri matukoy an mga naurusahan nga baryante han { $component } kay diri konstante an { $attribute }.

variant-attribute-not-number = diri matukoy an mga naurusahan nga baryante han { $component } kay diri numero an { $attribute }.

variant-attribute-wrong-type-for-sequence =
    diri matukoy an mga naurusahan nga baryante han { $component } nga klase { $type } kay an { $attribute } diri { $expected ->
        [letters-combination] kombinasyon han mga letra
        [math-expression] balido nga ekspresyon nga matematika
        [integer] integer
       *[number] numero
    }.

variant-length-not-integer = diri matukoy an mga naurusahan nga baryante han { $component } kay diri integer an length.

variant-sort-not-implemented = waray pa ipatuman an mga naurusahan nga baryante han usa nga { $component } nga may sort

variant-exclude-combinations-not-implemented = waray pa ipatuman an mga naurusahan nga baryante han usa nga { $component } nga may excludeCombinations

variant-math-exclude-not-implemented = waray pa ipatuman an mga naurusahan nga baryante han usa nga { $component } nga klase math nga may exclude

variant-non-constant-exclude-not-implemented = waray pa ipatuman an mga naurusahan nga baryante han usa nga { $component } nga may diri konstante nga exclude

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: waray suporta ha renderer nga prefigure han graph; ginlaktawan an kaliwatan.

prefigure-descendant-invalid-geometry = { $subject }: diri limitado o diri kompleto an heometriya; ginlaktawan an kaliwatan.

prefigure-curve-label-omitted = { $subject }: waray suporta an mga etiketa ha mga nakonberte nga kurba; ginsalikway an etiketa.

prefigure-curve-unsupported-definition-type = { $subject }: waray suporta nga klase han depinisyon han punsyon nga kurba nga '{ $definitionType }'; ginlaktawan an kaliwatan.

prefigure-region-flip-functions-unsupported = { $subject }: waray suporta nga atributo nga flipFunctions ha regionBetweenCurves; ginlaktawan an kaliwatan.

prefigure-region-non-formula-child = { $subject }: an mga anak nga punsyon nga klase formula la an may suporta ha regionBetweenCurves; ginlaktawan an kaliwatan.

prefigure-label-position-unsupported =
    { $subject }: waray suporta nga labelPosition '{ $labelPosition }' para ha { $labelKind ->
        [line-family] etiketa han pamilya han linya
       *[point] etiketa han punto
    }; ginagamit an nakagawian nga pagpahiuyon han PreFigure.

prefigure-fill-style-unsupported = { $subject }: waray suporta an PreFigure ha estilo han sulod nga '{ $fillStyle }'; nabalik ha solido nga sulod.

prefigure-line-style-unknown = { $subject }: diri kilala nga estilo han linya nga '{ $lineStyle }', ginsalikway ha output han PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: ginsumpay an estilo han marker nga '{ $markerStyle }' ha estilo nga 'diamond' han PreFigure.

prefigure-marker-style-unsupported = { $subject }: waray suporta an PreFigure ha estilo han marker nga '{ $markerStyle }'; ginagamit an nakagawian nga estilo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: imbalido nga `ref`; diri matudlok an target. Ginsalikway an annotation.

annotation-ref-multiple-targets = `<annotation>`: natudlok an `ref` ha damo nga target; ginagamit an siyahan nga target.

annotation-ref-outside-graph = `<annotation>`: imbalido nga `ref`; aada an target ha gawas han graph nga nagsusulod hini. Ginsalikway an annotation.

annotation-ref-unsupported-target = `<annotation>`: imbalido nga `ref`; an target diri suportado nga grapikal nga butang ha konbersyon nga prefigure. Ginsalikway an annotation.

annotation-text-missing = `<annotation>`: waray o blangko an `text`; nagpapagawas hin blangko nga teksto.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] May nakit-an nga sirkular nga pagsarig.
       *[other] May nakit-an nga sirkular nga pagsarig nga naglalakip han komponente nga `<{ $componentType }>`.
    }

reference-no-referent = Waray nakit-an nga gintutudlok han reperensya: `{ $reference }`

reference-multiple-referents = Damo an nakit-an nga gintutudlok han reperensya: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Imbalido nga pormat han atributo nga { $attribute } han `<{ $componentType }>`.

children-invalid = Imbalido an mga anak han `<{ $componentType }>`: nakit-an an mga imbalido nga anak: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Imbalido nga bili nga `{ $value }` para ha atributo nga `{ $attribute }`, ginagamit an bili nga `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Waray makit-an an bersyon han DoenetML nga { $version }.
       *[other] Waray makit-an an bersyon han DoenetML nga { $version }. Nabalik ha bersyon nga { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Imbalido nga DoenetML: { $content }

parse-tag-missing-close-tag = Imbalido nga DoenetML: Waray pangsarhan nga tag an tag nga `{ $tag }`. Ginlalaoman an tag nga nagsasarhan ha kalugaringon o tag nga `</{ $tagName }>`.

parse-tag-error = Imbalido nga DoenetML: May sayop ha tag nga `<{ $tagName }>`

parse-attribute-missing-value = Imbalido nga DoenetML: Baga waray bili an imbalido nga atributo nga `{ $attribute }`.

parse-attribute-invalid = Imbalido nga DoenetML: Imbalido nga atributo nga `{ $attribute }`

parse-attribute-value-invalid = Imbalido nga DoenetML: Imbalido nga bili han atributo nga `{ $value }`

parse-attribute-value-quote-mismatch = Imbalido nga DoenetML: Imbalido nga bili han atributo nga `{ $value }`. Diri nagkakaurusa an mga marka han sipi. Baga waray usa nga `{ $quote }`

parse-open-tag-name-missing = Imbalido nga DoenetML: May nakit-an nga tag nga waray ngaran, pananglitan `<`

parse-tag-not-closed = Imbalido nga DoenetML: Waray masarhan an tag nga `{ $tag }` (baga waray `>`).

parse-self-closing-tag-name-missing = Imbalido nga DoenetML: May nakit-an nga tag nga waray ngaran `<{ $content }>`

parse-self-closing-tag-not-closed = Imbalido nga DoenetML: Waray masarhan an tag nga `{ $tag }` (baga waray `/>`).

parse-tag-invalid-attributes = Imbalido nga DoenetML: Diri balido an tag nga `{ $tag }`. Bangin may diri husto nga mga atributo.

parse-close-tag-name-missing = Imbalido nga DoenetML: May nakit-an nga pangsarhan nga tag nga waray ngaran, pananglitan `</`

parse-attribute-value-unquoted = Kinahanglan nakabutang ha sulod han mga marka han sipi an mga bili han atributo: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Imbalido nga DoenetML: May nakit-an nga pangsarhan nga tag nga `{ $tag }`, kondi waray katugbang nga pangabri nga tag

parse-close-tag-mismatched = Imbalido nga DoenetML: Diri magkatugbang an pangsarhan nga tag. Ginlalaoman an `</{ $expected }>`. Nakit-an an `{ $found }`

parser-node-unconvertible = Diri nakonberte an node nga { $node } ngadto ha node nga Dast.

## Names

name-attribute-invalid =
    Imbalido nga atributo nga name='{ $name }'. { $reason ->
        [characters] Mahimo la magsulod an mga ngaran hin mga letra, numero, underscore o gitlo.
       *[start] Kinahanglan natikang an mga ngaran ha letra.
    }

component-name-invalid-start = Imbalido nga ngaran han komponente nga "{ $name }". Kinahanglan natikang an mga ngaran ha letra.

## `<answer>` sugar

answer-video-watched-missing-video = Kinahanglan may-ada atributo nga video an answer nga type videoWatched

answer-video-watched-video-not-reference = Kinahanglan reperensya an atributo nga video han answer nga type videoWatched

answer-name-not-single-text = Kinahanglan may-ada usa la nga anak nga text an atributo nga name han answer

## Referencing another document

external-doenetml-recursion-limit = Diri nakuha an gawas nga DoenetML tungod ha sobra kadamu nga lebel han pag-ulit-ulit. May sirkular ba nga reperensya?

external-doenetml-unavailable = Diri nakuha an DoenetML tikang ha { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Imbalido nga DoenetML an nakuha tikang ha { $attribute }="{ $uri }": diri ini natugbang ha klase han komponente nga "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Diri na ginagamit an atributo nga `{ $from }`; gamita an `{ $to }`.
       *[other] [deprecation] Diri na ginagamit an atributo nga `{ $from }` ha `<{ $component }>`; gamita an `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Diri na ginagamit an atributo nga `{ $from }` ngan ginsasalikway kay gintakda liwat an `{ $to }`.
       *[other] [deprecation] Diri na ginagamit an atributo nga `{ $from }` ha `<{ $component }>` ngan ginsasalikway kay gintakda liwat an `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Diri na ginagamit an atributo nga `{ $attribute }` ha `<{ $component }>` ngan ginsasalikway.

deprecated-attribute-to-child = [deprecation] Diri na ginagamit an atributo nga `{ $attribute }` ha `<{ $component }>`; gamita an anak nga `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Diri na ginagamit an bili nga `{ $value }` han atributo nga `{ $attribute }` ha `<{ $component }>`; gamita an `{ $to }`.


## Language coverage

pluralize-english-only = An `<pluralize>` mahimo la magpadamu hin Iningles, salit diri nababag-o an teksto hini ha dokumento nga ginsurat ha { $locale }. Isurat mismo an porma nga damo, o ibutang ini pinaagi han atributo nga `pluralForm`.


## Checking against the schema

schema-element-unrecognized = An elemento nga `<{ $tag }>` diri kilala nga elemento han Doenet.

schema-element-not-allowed-at-root = Diri gintutugotan an elemento nga `<{ $tag }>` ha gamot han dokumento.

schema-element-not-allowed-inside = Diri gintutugotan an elemento nga `<{ $tag }>` ha sulod han `<{ $parent }>`.

schema-attribute-unrecognized = Waray atributo nga ginngangaranan hin `{ $attribute }` an elemento nga `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Kinahanglan lista an atributo nga `{ $attribute }` han elemento nga `<{ $tag }>` nga an kada butang usa ha: { $allowed }
       *[other] Kinahanglan usa ha mga ini an atributo nga `{ $attribute }` han elemento nga `<{ $tag }>`: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Imbalido nga ngaran han baryante para ha select.  An ngaran han baryante nga { $variantName } naagi ha { $numOptions } nga opsyon kondi { $numToSelect } an kadamu nga pipilion.

select-variant-name-without-options = May gintakda nga mga baryante para ha select kondi waray gintakda nga opsyon para ha posible nga ngaran han baryante: { $variantName }.

select-variant-name-not-possible = An ngaran han baryante nga { $variantName } nga gintakda para ha select diri posible nga ngaran han baryante.

select-too-few-options = Diri mahimo magpili hin { $numToSelect } nga komponente tikang ha { $numOptions } la.

select-from-sequence-too-few-values = Diri mahimo magpili hin { $numToSelect } nga bili tikang ha sequence nga { $length } an kahilaba.

select-from-sequence-indices-count-mismatch = Kinahanglan magkatugbang an kadamu han mga indise nga gintakda para ha select ngan an kadamu nga pipilion

select-from-sequence-indices-not-integers = Kinahanglan integer an ngatanan nga indise nga gintakda para ha select

select-from-sequence-index-excluded = Gintakda an indise han selectfromsequence nga ginsalikway

select-from-sequence-indices-excluded-combination = Gintakda an mga indise han selectfromsequence nga usa nga ginsalikway nga kombinasyon

select-from-sequence-coprime-not-positive-integers = Diri mahimo magpili hin mga kombinasyon nga coprime kay diri positibo nga integer an ginpipili.

select-from-sequence-coprime-common-factor = Diri mahimo magpili hin mga numero nga coprime. May-ada usa nga paktor nga pareho han ngatanan nga posible nga bili. (Kinahanglan coprime an gintakda nga bili han "from" o "to" ha "step".)

select-from-sequence-coprime-single-number = Diri mahimo magpili hin mga kombinasyon nga coprime tikang ha usa la nga numero nga diri 1.

select-from-sequence-excluded-too-many-combinations = Ginsalikway an sobra ha 70% han mga kombinasyon ha selectFromSequence

select-from-sequence-coprime-none-found = Diri nakapili hin mga numero nga coprime. May-ada usa nga paktor nga pareho han ngatanan nga posible nga bili.

select-from-sequence-too-few-unique-values = Diri mahimo magpili hin { $numToSelect } nga naurusahan nga bili tikang ha sequence nga { $numPossibleValues } an kahilaba

select-prime-numbers-too-few-values = Diri mahimo magpili hin { $numToSelect } nga bili tikang ha lista han mga prime nga { $numValues } an kahilaba

select-prime-numbers-values-count-mismatch = Kinahanglan magkatugbang an kadamu han mga bili nga gintakda para ha select ngan an kadamu nga pipilion

select-prime-numbers-values-not-prime = Kinahanglan aada ha lista han mga prime an ngatanan nga bili nga gintakda para ha select prime number

select-prime-numbers-values-excluded-combination = An gintakda nga mga bili han selectPrimeNumbers usa nga ginsalikway nga kombinasyon

select-prime-numbers-excluded-too-many-combinations = Ginsalikway an sobra ha 70% han mga kombinasyon ha selectPrimeNumbers

select-random-combination-fluke = Tungod ha urusahon nga swerte, waray makapili hin kombinasyon han mga random nga bili

select-random-value-fluke = Tungod ha urusahon nga swerte, waray makapili hin random nga bili
