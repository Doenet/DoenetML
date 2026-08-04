# Wolof diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Where English separates a singular from a plural only in the verb — "is
# ignored" against "are ignored" — Wolof does not separate them at all: the
# verb takes no number from its subject, and the argument is a list either way.
# So those selects are dropped and the count argument goes unused.
#
# The technical vocabulary is the French-derived one Senegalese schooling uses
# — «fonksiyoŋ», «endeks», «wariyaabal» — beside the Wolof words for the things
# that are not technical: «rëdd» a line, «poñ» a point, «nattu» a value.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = Dees na bàyyi { $attributes } bu ñu wóorale ñaari poñ yu mujj yi

line-segment-attributes-ignored-with-endpoint-and-midpoint = Dees na bàyyi { $attributes } bu ñu wóorale poñ bu mujj bi ak poñ bu digg bi ñoom ñaar

line-segment-midpoint-offset-without-midpoint = midpointOffset amul njariñ bu amul poñ bu digg

## `<line>`

line-points-undetermined-dimensions = Rëdd bi day jaar ci ay poñ yu amul dimãsiyoŋ yu wóor.

line-points-too-few-dimensions = Rëdd bi war na jaar ci ay poñ yu am lu néew ñaari dimãsiyoŋ.

line-points-depend-on-variables = Rëdd bi day jaar ci ay poñ yu sukkandiku ci wariyaabal yi: { $variables }.

line-equation-invalid-format = Tegtal bi baaxul ngir ekuwasiyoŋu rëdd ci wariyaabal { $variable1 } ak { $variable2 }.

## `<ray>`

ray-overprescribed-through = Reyoŋ bi ñu ko wóorale through, endpoint ak direction ñoom ñett. Dees na bàyyi through bi ñu wóoral.

ray-dimension-mismatch = numDimensions mengoowul ci reyoŋ bi.

## `<vector>`

vector-overprescribed-head = Wektëer bi ñu ko wóorale head, tail ak displacement ñoom ñett. Dees na bàyyi head bi ñu wóoral.

vector-dimension-mismatch = numDimensions mengoowul ci wektëer bi.

## Attracting and constraining

attract-to-without-nearest-point = Mënul jubbanti ci `<{ $component }>` ndaxte amul wariyaabalu doxin nearestPoint.

constrain-to-without-nearest-point = Mënul tënk ci `<{ $component }>` ndaxte amul wariyaabalu doxin nearestPoint.

constrain-to-interior-without-nearest-point = Mënul tënk ci biir `<{ $component }>` ndaxte amul wariyaabalu doxin nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = Dees na bàyyi labelPosition ci choiceInput bu nekkul ci benn rëdd

## Ordering children by index

choice-input-indices-count-mismatch = Dees na bàyyi endeks yi ñu wóoral ci choiceInput ndaxte limu endeks yi mengoowul ak limu doom yu choice yi.

pretzel-indices-count-mismatch = Dees na bàyyi endeks yi ñu wóoral ci problem ndaxte limu endeks yi mengoowul ak limu doom yu problem yi.

shuffle-indices-count-mismatch = Dees na bàyyi endeks yi ñu wóoral ci shuffle ndaxte limu endeks yi mengoowul ak limu elemaa yi.

indices-ignored-out-of-range = Dees na bàyyi endeks yi ñu wóoral ci { $component } ndaxte am na ay endeks yu génn diggante bi.

pretzel-indices-repeated = Dees na bàyyi endeks yi ñu wóoral ci pretzel ndaxte am na ay endeks yu ñu waxaat.

pretzel-circuit-first-index = Dees na bàyyi endeks yi ñu wóoral ci pretzel ci mood circuit ndaxte endeks bu njëkk bi war na doon 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ngir `<{ $component }>` liggéey ak ay doom yu xeetu mbind, sifaa `type` war na ñu ko wóoral.

invalid-type-defaulting-to-math = type { $type } baaxul ngir elemaa { $component }. War na doon kenn ci math, text, number walla boolean. Dees na ko def math.

string-not-valid-component-to-arrange = Mbind "{ $value }" du elemaa bu baax ci { $component }. Dees na ko bàyyi.

## Types and variables

invalid-type-defaulting-to-number = type { $type } baaxul, dees na def type number.

invalid-variable-value = Nattu wariyaabal bi baaxul: `{ $value }`

## Variants

variant-index-must-be-number = Endeksu sukkandiku { $index } war na doon nombar

variant-index-must-be-integer = Endeksu sukkandiku { $index } war na doon nombar bu mat

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` defaruñu ko ak natt yu wóoraale. Dees na def yaatuwaay yi ci wàll.

side-by-side-absolute-margins = `<{ $component }>` defaruñu ko ak natt yu wóoraale. Dees na def wet yi ci wàll.

side-by-side-no-block-child = `<{ $component }>` baaxul: war na am lu néew benn doom bu xeetu blook.

## `<label>`

label-for-ignored-on-graphical = Dees na bàyyi sifaa `for` ci `<label>` bu grafik.

label-for-must-resolve-to-one = Sifaa `for` ci `<label>` war na wóoral benn elemaa rekk.

label-for-unresolved = Sifaa `for` ci `<label>` mënul wóoral benn elemaa.

label-for-answer-with-authored-inputs = Sifaa `for` ci `<label>` day joxe ci `<answer>` bu am ay duggu yu ñu bind; joxeel ci duggu bi ci boppam.

label-for-answer-without-input = Sifaa `for` ci `<label>` day joxe ci `<answer>` bu amul duggu bu ñu war a tudde.

label-for-must-reference-input-or-answer = Sifaa `for` ci `<label>` war na joxe ci ab duggu walla ab tontu.

## Accessibility

accessibility-short-description-or-decorative = Ngir jotewaay, `<{ $component }>` war na am ab leeral bu gàtt walla ñu wóoral ne ab taaral la.

accessibility-video-short-description = Ngir jotewaay, `<video>` war na am ab leeral bu gàtt.

accessibility-input-short-description-or-label = Ngir jotewaay, `<{ $component }>` war na am ab leeral bu gàtt walla ab tur.

accessibility-answer-input-short-description-or-label = Ngir jotewaay, `<answer>` bu di sos ab duggu war na am ab leeral bu gàtt walla ab tur.

accessibility-short-description-contains-math = Leeral bu gàtt bi warul am ay elemaa yu matematik ni `<{ $component }>`. Leeralal matematik bi ak baat.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } amul wutewaay bu doy ngir mbindu boppu xaaj (mood bu lëndëm) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; laaj na lu néew { $threshold }:1).
       *[other] { $colorName } amul wutewaay bu doy ngir mbindu boppu xaaj ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; laaj na lu néew { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Defaruñu ba tey `<circle>` bu jaar ci { $count } poñ bu poñ yooyu amul nattu yu nombar.

circle-too-many-through-points = Mënul waññ serkal bu jaar ci lu ëpp 3 poñ.

circle-overprescribed-radius-center-points = Mënul waññ serkal bu am rayoŋ, digg ak poñ yu jaar ñoom ñépp ñu leen wóoral.

circle-center-with-multiple-points = Mënul waññ serkal bu am digg bu ñu wóoral te di jaar ci lu ëpp 1 poñ.

circle-radius-too-small = Mënul waññ serkal: ndaxte sori bi ci diggante ñaari poñ yooyu mooy { $distance }, rayoŋ { $radius } bi ñu wóoral dafa tuuti lool.

circle-radius-with-many-points = Mënul sos serkal bu jaar ci lu ëpp ñaari poñ te am rayoŋ bu ñu wóoral.

circle-invalid-center-or-through-points = Diggu serkal bi walla poñ yu mu jaar baaxul.

circle-radius-center-with-multiple-points = Mënul waññ rayoŋu serkal bu am digg bu ñu wóoral te di jaar ci lu ëpp 1 poñ.

circle-change-radius-non-numerical = Mënul soppi rayoŋu serkal bu jaar ci ay poñ yu amul nattu yu nombar

circle-radius-with-points-non-numerical = Mënul sos serkal bu jaar ci lu ëpp benn poñ te am rayoŋ bu ñu wóoral bu amul nattu yu nombar.

circle-change-center-non-numerical = Defaruñu ba tey soppi diggu serkal bu jaar ci ay poñ yu amul nattu yu nombar.

## `<function>`

function-domain-insufficient-dimensions = Dimãsiyoŋ yu domeenu fonksiyoŋ bi doyuñu. Domeen bi am na { $intervals } enterwal waaye fonksiyoŋ bi am na { $inputs } duggu.

function-domain-invalid-format = Tegtalu domeenu fonksiyoŋ bi baaxul.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Dees na bàyyi kaw bu mag bu fonksiyoŋ bi bu nekkul nombar.
        [minimum] Dees na bàyyi suuf bu mag bu fonksiyoŋ bi bu nekkul nombar.
        [extremum] Dees na bàyyi jubluwaayu fonksiyoŋ bi bu nekkul nombar.
        [point] Dees na bàyyi poñu fonksiyoŋ bi bu nekkul nombar.
        [slope] Dees na bàyyi jengu fonksiyoŋ bi bu nekkul nombar.
       *[other] Dees na bàyyi { $type } bu fonksiyoŋ bi bu nekkul nombar.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Dees na bàyyi kaw bu mag bu fonksiyoŋ bi bu neen.
        [minimum] Dees na bàyyi suuf bu mag bu fonksiyoŋ bi bu neen.
        [extremum] Dees na bàyyi jubluwaayu fonksiyoŋ bi bu neen.
        [point] Dees na bàyyi poñu fonksiyoŋ bi bu neen.
       *[other] Dees na bàyyi { $type } bu fonksiyoŋ bi bu neen.
    }

function-points-too-close = Fonksiyoŋ bi am na ñaari poñ yu jege lool. Mënuñu ko wóoral.

function-iterates-input-output-mismatch = Delluwaatu fonksiyoŋ mën na am rekk su limu duggu yi tolloo ak limu génnu yi. Fonksiyoŋ bii am na { $inputs } duggu ak { $outputs } génn.

## `<sequence>`

sequence-invalid-length = Guddaayu ordër bi baaxul. War na doon nombar bu mat bu dul neexu.

sequence-invalid-step = Jéegoy ordër bi baaxul. Ci ordëru xeetu { $type } war na doon nombar.

sequence-invalid-endpoint-number = "{ $attribute }" bu ordëru nombar baaxul. War na doon nombar.

sequence-invalid-endpoint-letters = "{ $attribute }" bu ordëru araf baaxul. War na doon xeeti araf.

sequence-invalid-endpoint = "{ $attribute }" bu ordër bi baaxul.

select-from-sequence-coprime-not-numbers = Dees na bàyyi coprime ndaxte du ay nombar lañuy tànn

select-from-sequence-coprime-with-exclude-combinations = Dees na bàyyi coprime ndaxte ñu wóoral na excludeCombinations

## Resolving a `target`

target-not-found = target baaxul ci `<{ $source }>`: gisuñu jubluwaay bi.

target-state-variable-not-found = target baaxul ci `<{ $source }>`: gisuñu wariyaabalu doxin bu tudd "{ $property }" ci `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Wariyaabal yu `<odeSystem>` war nañu wute ak wariyaabal bu temb bi.

ode-system-duplicate-variable-names = Mënul wóoral fonksiyoŋ yu ODE RHS yu am turu wariyaabal yu ñu waxaat.

ode-system-rhs-function-error = Mënul wóoral fonksiyoŋu ODE RHS. Njumte am na ci sosum fonksiyoŋu mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Mënul wóoral kornea ci { $count } rëdd

angle-invalid-through-point = Poñ bi baaxul ci through bu `<angle>`

parabola-vertex-too-many-points = Defaruñu ba tey parabol bu am kaw bu jaar ci lu ëpp 1 poñ.

parabola-too-many-points = Defaruñu ba tey parabol bu jaar ci lu ëpp 3 poñ.

intersection-too-many-items = Defaruñu ba tey jaxasoo bu lu ëpp ñaari mbir

## Other math components

ionic-compound-not-two-ions = Defaruñu ba tey konpose iyonik bu lu ëpp ñaari iyon.

ionic-compound-needs-cation-and-anion = Konpose iyonik defaru nañu ko ngir benn katiyon ak benn aniyon rekk.

solve-equations-cannot-evaluate = Mënul saafara ekuwasiyoŋ bi ndaxte mënuñu ko natt: { $equation }

math-operators-operand-number-required = operandNumber war na ñu ko wóoral bu ñuy génne operãd bu matematik.

eigen-decomposition-failed = Mënul waññ nattu yu eigen yu matriis bi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: paramet { $parameters } feeñuñu ci tegtal bi, kon dinañu mengoo ak neen saa su nekk.

## `<graph>`

graph-grid-invalid = `<graph>`: mënul firi grid="{ $grid }". War na doon none, medium, dense, walla ñaari nombar yu jub yu ñu xaajale ak ab bàyyi, ni grid="1 0.5". Dees na natt genn griy.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" jàppaguñu ko ci wonekaayu prefigure; doxinu wet gu ndeyjoor lees jëfandikoo.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" jàppaguñu ko ci wonekaayu prefigure; doxinu wet gu kaw lees jëfandikoo.

prefigure-invalid-axis-bounds = `<graph>`: dig yu aks bi baaxuñu ngir soppim prefigure; bbox bu ndogal (-10,-10,10,10) lees jëfandikoo.

prefigure-invalid-width = `<graph>`: yaatuwaay bi baaxul ngir soppim prefigure; yaatuwaayu nataal bu ndogal 425 lees jëfandikoo.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio baaxul ngir soppim prefigure; rapoor bu ndogal 1 lees jëfandikoo.

prefigure-grid-spacing-too-fine = `<graph>`: diggante griy yi dafa xat lool ngir dig yu aks bi; bàyyi nañu griy bi ci wonekaayu prefigure.

prefigure-annotations-not-rendered = `<graph>`: dees na wone ay xamle bu wonekaayu PreFigure jariñuwul.

multiple-annotations-children = Gis nañu ay doom `<annotations>` yu bare ci `<graph>`; dees na leen bàyyi ñépp ba mu des bu mujj bi.

## Referring to other components

copy-unrecognized-component-type = Mënul yaatal walla nataal xeetu elemaa bu ñu xamul: { $type }.

copy-prop-not-found = Gisuñu sifaa { $property } ci elemaa bu xeetu { $component }

collect-no-source = Gisuñu benn sos ngir collect.

collect-invalid-component-type = Mënul dajale elemaa yu xeetu `<{ $component }>` ndaxte xeetu elemaa bu baaxul la.

reference-index-unavailable = Mënul joxe ci endeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Mënul woo { $action } ci elemaa `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Melokaanu daata bi baaxul. Rëdd yi amuñu guddaay gu mengoo. Gis nañu ko ci componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Daata bi am na turu poto yu ñu waxaat. Gis nañu ko ci componentIdx :{ $componentIdx }

data-frame-missing-column-name = Daata bi amul turu poto. Gis nañu ko ci componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Benn award bu tontu bii day sukkandiku ci tontu bi tagi answer bi moom ci boppam yónnee, te loolu day indi doxin bu ñu séentuwul.

answer-max-num-attempts-in-section-wide-check-work = Teg `maxNumAttempts` ci `<answer>` bu nekk ci biir dénkaan bu am `sectionWideCheckWork` amul njariñ, ndaxte dénkaan boobu moo yor limu jéego yi. Tegal `maxNumAttempts` ci dénkaan bi.

nested-section-wide-check-work-max-num-attempts = Teg `maxNumAttempts` ci dénkaan bu am `sectionWideCheckWork` bu nekk ci biir beneen dénkaan bu am `sectionWideCheckWork` amul njariñ, ndaxte dénkaan bu biti bi moo yor limu jéego yi. Tegal `maxNumAttempts` ci dénkaan bu biti bi.

answer-attributes-need-symbolic-equality = Sifaa { $attributes } dinañu amul njariñ bu symbolicEquality tegewul.

answer-invalid-type = Xeet bi baaxul ngir tontu bi: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ndaxte elemaa `<{ $component }>` amul tur, mënuñu ko jëfandikoo ni sifaa bu module

module-attribute-name-already-defined = Elemaa `<{ $component } name="{ $name }">` mënuñu ko jëfandikoo ni sifaa bu module ndaxte xeetu elemaa `<module>` am na ba noppi sifaa bu tudd "{ $name }".

conditional-content-condition-ignored = Dees na bàyyi sifaa `condition` ci elemaa `<conditionalContent>` bu am ay doom case walla else.

slider-markers-type-mismatch = Xeetu màndarga yi mengoowul ak xeetu slider bi.

pretzel-problem-needs-statement-and-answer = pretzel baaxul: `<problem>` bu nekk war na am benn `<statement>` ak benn `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel baaxul: ci mode="circuit", `<problem>` bu njëkk bi mënul doon bu jaay-doole.

## Attribute values

attribute-invalid-values = Nattu { $values } baaxul ngir sifaa `{ $attribute }`; dees na leen bàyyi.

attribute-must-be-references = Nattu `{ $value }` baaxul ngir sifaa `{ $attribute }`. Sifaa bi war na doon ay reyfeerãs yu tàmbalee ak `$`.

math-input-invalid-function-names = <mathInput>: dees na bàyyi turu fonksiyoŋ yu baaxul ci { $attribute }: { $names }. Wàllu wone bu tur bu nekk war na am lu néew 2 araf (araf walla rëdd); tegtal `|<mathspeak alternative>` bu ñuy tànn mën na topp.

## Building components from the source

component-type-invalid = Xeetu elemaa bi baaxul: `<{ $componentType }>`

attribute-repeated = Sifaa { $attribute } mënuñu koy waxaat.

attribute-invalid-for-component = Sifaa "{ $attribute }" baaxul ngir elemaa bu xeetu `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Wóoralu estil { $styleNumber } amul wutewaay bu doy ngir { $context ->
        [text-on-background] melokaanu mbind ci kanamu melokaanu ginnaaw
        [high-contrast] melokaan bu am wutewaay bu kawe ci kanamu toileñ
        [line] melokaanu rëdd ci kanamu toileñ
        [marker] melokaanu màndarga ci kanamu toileñ
       *[text-on-canvas] melokaanu mbind ci kanamu toileñ
    }{ $mode ->
        [dark] { " (mood bu lëndëm)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; laaj na lu néew { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Su fekkee ne wóoralu estil { $styleNumber } wóoral na ay melokaan yu jox wutewaay bu doy ci mood bu leer, melokaan yu mood bu lëndëm yi mu jur amuñu wutewaay bu doy ci melokaanu mbind ci kanamu melokaanu ginnaaw ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; laaj na lu néew { $threshold }:1). { $suggestion ->
        [available] Ngir wóoral wutewaay bu doy ci mood bu lëndëm, yokkal wutewaayu mood bu leer (misaal tegal { $lightAttribute }="{ $lightColor }") walla soppil melokaanu mood bu lëndëm bi (misaal tegal { $darkAttribute }="{ $darkColor }").
       *[none] Ngir wóoral wutewaay bu doy ci mood bu lëndëm, yokkal wutewaayu mood bu leer walla soppil melokaan yi mu jur ak textColorDarkMode ak/walla backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Su fekkee ne wóoralu estil { $styleNumber } wóoral na melokaanu mbind bu jox wutewaay bu doy ci mood bu leer, melokaanu mbind bu mood bu lëndëm bi mu jur amul wutewaay bu doy ci kanamu toileñ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; laaj na lu néew { $threshold }:1). { $suggestion ->
        [available] Ngir wóoral wutewaay bu doy ci mood bu lëndëm, yokkal wutewaayu mood bu leer (misaal tegal textColor="{ $lightColor }") walla soppil melokaanu mood bu lëndëm bi (misaal tegal textColorDarkMode="{ $darkColor }").
       *[none] Ngir wóoral wutewaay bu doy ci mood bu lëndëm, yokkal wutewaayu mood bu leer walla soppil melokaan bi mu jur ak textColorDarkMode.
    }

section-multiple-style-palettes = Xaaj bi mën na tànn benn <stylePalette> rekk; bu mujj bi lees jëfandikoo.

## Unique variants

variant-num-to-select-not-non-negative-integer = mënul wóoral sukkandiku yu wuute yu { $component } ndaxte numToSelect du nombar bu mat bu dul neexu.

variant-num-to-select-not-constant-number = mënul wóoral sukkandiku yu wuute yu { $component } ndaxte numToSelect du nombar bu sax.

variant-with-replacement-not-constant-boolean = mënul wóoral sukkandiku yu wuute yu { $component } ndaxte withReplacement du buleyaŋ bu sax.

variant-select-weight-disables-unique = Sukkandiku yu wuute yu select dees na leen tëj su amee tànneef bu am selectWeight walla selectForVariants bu ñu wóoral

variant-coprime-undetermined = mënul wóoral sukkandiku yu wuute yu { $component } ndaxte mënul wóoral ne coprime fen na saa su nekk.

variant-attribute-not-constant = mënul wóoral sukkandiku yu wuute yu { $component } ndaxte { $attribute } saxul.

variant-attribute-not-number = mënul wóoral sukkandiku yu wuute yu { $component } ndaxte { $attribute } du nombar.

variant-attribute-wrong-type-for-sequence =
    mënul wóoral sukkandiku yu wuute yu { $component } yu xeetu { $type } ndaxte { $attribute } du { $expected ->
        [letters-combination] xeeti araf
        [math-expression] ekspresiyoŋu matematik bu baax
        [integer] nombar bu mat
       *[number] nombar
    }.

variant-length-not-integer = mënul wóoral sukkandiku yu wuute yu { $component } ndaxte length du nombar bu mat.

variant-sort-not-implemented = defaruñu ba tey sukkandiku yu wuute yu { $component } yu am sort

variant-exclude-combinations-not-implemented = defaruñu ba tey sukkandiku yu wuute yu { $component } yu am excludeCombinations

variant-math-exclude-not-implemented = defaruñu ba tey sukkandiku yu wuute yu { $component } yu xeetu math yu am exclude

variant-non-constant-exclude-not-implemented = defaruñu ba tey sukkandiku yu wuute yu { $component } yu am exclude bu saxul

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: jàppaguñu ko ci wonekaayu graph prefigure; dees na tëb sët bi.

prefigure-descendant-invalid-geometry = { $subject }: seometri bu amul àpp walla bu matul; dees na tëb sët bi.

prefigure-curve-label-omitted = { $subject }: jàppaguñu ay tur ci elemaa yu kurb yi ñu soppi; bàyyi nañu turu bi.

prefigure-curve-unsupported-definition-type = { $subject }: xeetu wóoralu fonksiyoŋu kurb '{ $definitionType }' jàppaguñu ko; dees na tëb sët bi.

prefigure-region-flip-functions-unsupported = { $subject }: sifaa flipFunctions ci regionBetweenCurves jàppaguñu ko; dees na tëb sët bi.

prefigure-region-non-formula-child = { $subject }: fonksiyoŋ yu doom yu xeetu formula rekk lañuy jàpp ci regionBetweenCurves; dees na tëb sët bi.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' jàppaguñu ko ngir { $labelKind ->
        [line-family] turu mbootaayu rëdd
       *[point] turu poñ
    }; tegtal bu ndogal bu PreFigure lees jëfandikoo.

prefigure-fill-style-unsupported = { $subject }: estilu feesal '{ $fillStyle }' PreFigure jàppul ko; dees na dellu ci feesal ak benn melokaan.

prefigure-line-style-unknown = { $subject }: estilu rëdd '{ $lineStyle }' xamuñu ko te bàyyi nañu ko ci génnu PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: estilu màndarga '{ $markerStyle }' mengale nañu ko ak estilu PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: estilu màndarga '{ $markerStyle }' PreFigure jàppul ko; estil bu ndogal lees jëfandikoo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` baaxul; mënul wóoral jubluwaay bi. Bàyyi nañu xamle bi.

annotation-ref-multiple-targets = `<annotation>`: `ref` wóoral na ay jubluwaay yu bare; jubluwaay bu njëkk bi lees jëfandikoo.

annotation-ref-outside-graph = `<annotation>`: `ref` baaxul; jubluwaay bi génn na graf bi ko ëmb. Bàyyi nañu xamle bi.

annotation-ref-unsupported-target = `<annotation>`: `ref` baaxul; jubluwaay bi du mbir mu grafik mu ñu jàpp ci soppim prefigure. Bàyyi nañu xamle bi.

annotation-text-missing = `<annotation>`: `text` amul walla neen na; mbind mu neen lees génne.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Gis nañu sukkandiku bu wëng.
       *[other] Gis nañu sukkandiku bu wëng bu jëmale ci elemaa `<{ $componentType }>`.
    }

reference-no-referent = Gisuñu dara ci reyfeerãs bi: `{ $reference }`

reference-multiple-referents = Gis nañu ay lu bare ci reyfeerãs bi: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Tegtal bi baaxul ngir sifaa { $attribute } bu `<{ $componentType }>`.

children-invalid = Doom yi baaxuñu ngir `<{ $componentType }>`: Gis nañu ay doom yu baaxul: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nattu `{ $value }` baaxul ngir sifaa `{ $attribute }`, nattu `{ $default }` lees jëfandikoo

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Gisuñu DoenetML wersiyoŋ { $version }.
       *[other] Gisuñu DoenetML wersiyoŋ { $version }. Dees na dellu ci wersiyoŋ { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML baaxul: { $content }

parse-tag-missing-close-tag = DoenetML baaxul: Tagi `{ $tag }` amul tagi bu tëj. Séentu nañu tagi bu tëju boppam walla tagi `</{ $tagName }>`.

parse-tag-error = DoenetML baaxul: Njumte ci tagi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML baaxul: Sifaa `{ $attribute }` bu baaxul mel na ni amul nattu.

parse-attribute-invalid = DoenetML baaxul: Sifaa `{ $attribute }` baaxul

parse-attribute-value-invalid = DoenetML baaxul: Nattu sifaa `{ $value }` baaxul

parse-attribute-value-quote-mismatch = DoenetML baaxul: Nattu sifaa `{ $value }` baaxul. Màndarga yu wax yi mengoowuñu. Mel na ni `{ $quote }` ñàkk na

parse-open-tag-name-missing = DoenetML baaxul: Gis nañu tagi bu amul turu tagi, misaal `<`

parse-tag-not-closed = DoenetML baaxul: Tëjuñu tagi `{ $tag }` (mel na ni `>` ñàkk na).

parse-self-closing-tag-name-missing = DoenetML baaxul: Gis nañu tagi bu amul turu tagi `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML baaxul: Tëjuñu tagi `{ $tag }` (mel na ni `/>` ñàkk na).

parse-tag-invalid-attributes = DoenetML baaxul: Tagi `{ $tag }` baaxul. Mën na am ay sifaa yu baaxul.

parse-close-tag-name-missing = DoenetML baaxul: Gis nañu tagi bu tëj bu amul turu tagi, misaal `</`

parse-attribute-value-unquoted = Nattu sifaa yi war nañu nekk ci biir màndarga yu wax: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML baaxul: Gis nañu tagi bu tëj `{ $tag }`, waaye amul tagi bu ubbi bu ko mengoo

parse-close-tag-mismatched = DoenetML baaxul: Tagi bu tëj bi mengoowul. Séentu nañu `</{ $expected }>`. Gis nañu `{ $found }`

parser-node-unconvertible = Mënuñu soppi nod { $node } ci nodu Dast.

## Names

name-attribute-invalid =
    Sifaa name='{ $name }' baaxul. { $reason ->
        [characters] Tur yi mën nañu am araf, nombar, rëdd yu suuf walla rëdd rekk.
       *[start] Tur yi war nañu tàmbalee ak araf.
    }

component-name-invalid-start = Turu elemaa "{ $name }" baaxul. Tur yi war nañu tàmbalee ak araf.

## `<answer>` sugar

answer-video-watched-missing-video = Tontu bu xeetu videoWatched war na am sifaa video

answer-video-watched-video-not-reference = Tontu bu xeetu videoWatched war na am sifaa video bu di reyfeerãs

answer-name-not-single-text = Sifaa name bu tontu bi war na am benn doom text rekk

## Referencing another document

external-doenetml-recursion-limit = Mënul am DoenetML bu biti ndaxte dellu yi dañoo bare lool. Ndax am na reyfeerãs bu wëng?

external-doenetml-unavailable = Mënul am DoenetML bu jóge ci { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML bi ñu jële ci { $attribute }="{ $uri }" baaxul: mengoowul ak xeetu elemaa "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Sifaa `{ $from }` jeex na jamono; jëfandikool `{ $to }`.
       *[other] [deprecation] Sifaa `{ $from }` ci `<{ $component }>` jeex na jamono; jëfandikool `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Sifaa `{ $from }` jeex na jamono te dees na ko bàyyi ndaxte `{ $to }` itam ñu wóoral na ko.
       *[other] [deprecation] Sifaa `{ $from }` ci `<{ $component }>` jeex na jamono te dees na ko bàyyi ndaxte `{ $to }` itam ñu wóoral na ko.
    }

deprecated-attribute-ignored = [deprecation] Sifaa `{ $attribute }` ci `<{ $component }>` jeex na jamono te dees na ko bàyyi.

deprecated-attribute-to-child = [deprecation] Sifaa `{ $attribute }` ci `<{ $component }>` jeex na jamono; jëfandikool doom bu `<{ $child }>`.


## Language coverage

pluralize-english-only = `<pluralize>` mën na def bare ci Angale rekk, kon mbindam mi des na ni mu mel ci dokimaan bu ñu bind ci { $locale }. Bindal melokaanu bare bi walla tegal ko ci sifaa `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemaa `<{ $tag }>` du elemaa bu Doenet xam.

schema-element-not-allowed-at-root = Mayuñu elemaa `<{ $tag }>` ci reenu dokimaan bi.

schema-element-not-allowed-inside = Mayuñu elemaa `<{ $tag }>` ci biir `<{ $parent }>`.

schema-attribute-unrecognized = Elemaa `<{ $tag }>` amul sifaa bu tudd `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Sifaa `{ $attribute }` bu elemaa `<{ $tag }>` war na doon lim bu kenn ku ci nekk di kenn ci: { $allowed }
       *[other] Sifaa `{ $attribute }` bu elemaa `<{ $tag }>` war na doon kenn ci: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Turu sukkandiku bi baaxul ngir select. Turu sukkandiku { $variantName } feeñ na ci { $numOptions } tànneef waaye limu tànn bi mooy { $numToSelect }.

select-variant-name-without-options = Ñu wóoral na ay sukkandiku ngir select waaye wóoraluñu benn tànneef ngir turu sukkandiku bu mën a am: { $variantName }.

select-variant-name-not-possible = Turu sukkandiku { $variantName } bi ñu wóoral ngir select du turu sukkandiku bu mën a am.

select-too-few-options = Mënul tànn { $numToSelect } elemaa ci { $numOptions } rekk.

select-from-sequence-too-few-values = Mënul tànn { $numToSelect } nattu ci ordër bu guddaayam di { $length }.

select-from-sequence-indices-count-mismatch = Limu endeks yi ñu wóoral ngir select war na mengoo ak limu tànn bi

select-from-sequence-indices-not-integers = Endeks yépp yi ñu wóoral ngir select war nañu doon nombar yu mat

select-from-sequence-index-excluded = Ñu wóoral na endeksu selectfromsequence bu ñu génne

select-from-sequence-indices-excluded-combination = Ñu wóoral na ay endeksu selectfromsequence yu nekkoon xeetu boole bu ñu génne

select-from-sequence-coprime-not-positive-integers = Mënul tànn boole yu nombar yu bokk ndaxte du nombar yu mat yu jub lañuy tànn.

select-from-sequence-coprime-common-factor = Mënul tànn nombar yu bokk. Nattu yépp yu mën a am dañoo bokk benn kalaam. (Nattu yi ñu wóoral ci "from" walla "to" war nañu bokk ak "step".)

select-from-sequence-coprime-single-number = Mënul tànn boole yu nombar yu bokk ci benn nombar bu dul 1.

select-from-sequence-excluded-too-many-combinations = Lu ëpp 70% ci boole yi génne nañu leen ci selectFromSequence

select-from-sequence-coprime-none-found = Mënuñu tànn nombar yu bokk. Nattu yépp yu mën a am dañoo bokk benn kalaam.

select-from-sequence-too-few-unique-values = Mënul tànn { $numToSelect } nattu yu wuute ci ordër bu guddaayam di { $numPossibleValues }

select-prime-numbers-too-few-values = Mënul tànn { $numToSelect } nattu ci limu nombar yu tasaaroo bu guddaayam di { $numValues }

select-prime-numbers-values-count-mismatch = Limu nattu yi ñu wóoral ngir select war na mengoo ak limu tànn bi

select-prime-numbers-values-not-prime = Nattu yépp yi ñu wóoral ngir select prime number war nañu nekk ci limu nombar yu tasaaroo

select-prime-numbers-values-excluded-combination = Nattu yu selectPrimeNumbers yi ñu wóoral nekkoon nañu xeetu boole bu ñu génne

select-prime-numbers-excluded-too-many-combinations = Lu ëpp 70% ci boole yi génne nañu leen ci selectPrimeNumbers

select-random-combination-fluke = Ci lu jekkadi lool, mënuñu tànn boole bu nattu yu tegtalul

select-random-value-fluke = Ci lu jekkadi lool, mënuñu tànn nattu bu tegtalul
