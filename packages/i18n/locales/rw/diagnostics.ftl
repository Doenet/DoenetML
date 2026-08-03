# Kinyarwanda diagnostics. Translated from `locales/en/diagnostics.ftl`, which
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
# Where English separates a singular from a plural only in the verb, the
# Kinyarwanda verb takes its subject concord from the noun class rather than
# from the count, so those selects are dropped and the count argument goes
# unused.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } birirengagizwa iyo ududomo tubiri tw'impera twatanzwe

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } birirengagizwa iyo akadomo k'impera n'ako hagati byombi byatanzwe

line-segment-midpoint-offset-without-midpoint = midpointOffset nta cyo ivuze nta kadomo ko hagati

## `<line>`

line-points-undetermined-dimensions = Umurongo unyura ku dudomo tudafite ingano izwi.

line-points-too-few-dimensions = Umurongo ugomba kunyura ku dudomo tufite nibura ingano ebyiri.

line-points-depend-on-variables = Umurongo unyura ku dudomo tuterwa n'impinduka: { $variables }.

line-equation-invalid-format = Imiterere itemewe y'ingereka y'umurongo mu mpinduka { $variable1 } na { $variable2 }.

## `<ray>`

ray-overprescribed-through = Umurasire wasobanuwe na through, endpoint na direction icyarimwe. through yatanzwe irirengagizwa.

ray-dimension-mismatch = numDimensions ntihuye mu murasire.

## `<vector>`

vector-overprescribed-head = Vegiteri yasobanuwe na head, tail na displacement icyarimwe. head yatanzwe irirengagizwa.

vector-dimension-mismatch = numDimensions ntihuye muri vegiteri.

## Attracting and constraining

attract-to-without-nearest-point = Ntibishoboka gukurura kuri `<{ $component }>` kuko idafite impinduka y'imiterere yitwa nearestPoint.

constrain-to-without-nearest-point = Ntibishoboka guhambira kuri `<{ $component }>` kuko idafite impinduka y'imiterere yitwa nearestPoint.

constrain-to-interior-without-nearest-point = Ntibishoboka guhambira imbere muri `<{ $component }>` kuko idafite impinduka y'imiterere yitwa nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition irirengagizwa kuri choiceInput itari ku murongo umwe

## Ordering children by index

choice-input-indices-count-mismatch = Imibare y'inyandiko yatanzwe kuri choiceInput irirengagizwa kuko umubare wayo utahuye n'umubare w'abana choice.

pretzel-indices-count-mismatch = Imibare y'inyandiko yatanzwe kuri problem irirengagizwa kuko umubare wayo utahuye n'umubare w'abana problem.

shuffle-indices-count-mismatch = Imibare y'inyandiko yatanzwe kuri shuffle irirengagizwa kuko umubare wayo utahuye n'umubare w'ibice.

indices-ignored-out-of-range = Imibare y'inyandiko yatanzwe kuri { $component } irirengagizwa kuko imwe iri hanze y'urwego.

pretzel-indices-repeated = Imibare y'inyandiko yatanzwe kuri pretzel irirengagizwa kuko imwe yisubiyemo.

pretzel-circuit-first-index = Imibare y'inyandiko yatanzwe kuri pretzel muri mode circuit irirengagizwa kuko iya mbere igomba kuba 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Kugira ngo `<{ $component }>` ikorane n'abana b'ubwoko string, ikiranga `type` kigomba gutangwa.

invalid-type-defaulting-to-math = type { $type } ntiyemewe ku gice { $component }. Igomba kuba imwe muri math, text, number cyangwa boolean. Ishyizwe kuri math.

string-not-valid-component-to-arrange = String "{ $value }" si igice cyemewe cya { $component }. Iririrengagizwa.

## Types and variables

invalid-type-defaulting-to-number = type { $type } ntiyemewe, type ishyizwe kuri number.

invalid-variable-value = Agaciro k'impinduka ntikemewe: `{ $value }`

## Variants

variant-index-must-be-number = Umubare w'ubwoko { $index } ugomba kuba umubare

variant-index-must-be-integer = Umubare w'ubwoko { $index } ugomba kuba umubare wuzuye

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ntiyakozwe ku bipimo byuzuye. Ubugari bushyizwe ku bigereranyo.

side-by-side-absolute-margins = `<{ $component }>` ntiyakozwe ku bipimo byuzuye. Imipaka ishyizwe ku bigereranyo.

side-by-side-no-block-child = `<{ $component }>` ntiyemewe: igomba kugira nibura umwana umwe w'ubwoko bwa bloke.

## `<label>`

label-for-ignored-on-graphical = Ikiranga `for` kuri `<label>` y'igishushanyo kirirengagizwa.

label-for-must-resolve-to-one = Ikiranga `for` kuri `<label>` kigomba kwerekeza ku gice kimwe gusa.

label-for-unresolved = Ikiranga `for` kuri `<label>` ntikishoboye kwerekeza ku gice.

label-for-answer-with-authored-inputs = Ikiranga `for` kuri `<label>` cyerekeza kuri `<answer>` ifite injizwa zanditswe ku buryo bugaragara; erekeza kuri iyo njizwa ubwayo.

label-for-answer-without-input = Ikiranga `for` kuri `<label>` cyerekeza kuri `<answer>` idafite injizwa yo kwitirirwa.

label-for-must-reference-input-or-answer = Ikiranga `for` kuri `<label>` kigomba kwerekeza ku njizwa cyangwa ku gisubizo.

## Accessibility

accessibility-short-description-or-decorative = Ku bw'ukugerwaho, `<{ $component }>` igomba kugira ubusobanuro bugufi cyangwa igasobanurwa nk'iy'imitako.

accessibility-video-short-description = Ku bw'ukugerwaho, `<video>` igomba kugira ubusobanuro bugufi.

accessibility-input-short-description-or-label = Ku bw'ukugerwaho, `<{ $component }>` igomba kugira ubusobanuro bugufi cyangwa akarango.

accessibility-answer-input-short-description-or-label = Ku bw'ukugerwaho, `<answer>` irema injizwa igomba kugira ubusobanuro bugufi cyangwa akarango.

accessibility-short-description-contains-math = Ubusobanuro bugufi ntibugomba kuba burimo ibice by'imibare nka `<{ $component }>`. Sobanura imibare yose mu magambo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ifite itandukaniro ridahagije ku nyandiko y'umutwe w'igika (uburyo bwijimye) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bisaba nibura { $threshold }:1).
       *[other] { $colorName } ifite itandukaniro ridahagije ku nyandiko y'umutwe w'igika ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bisaba nibura { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` inyura ku dudomo { $count } ntiyakozwe igihe utwo dudomo tudafite indangagaciro z'imibare.

circle-too-many-through-points = Ntibishoboka kubara uruziga runyura ku dudomo turenze 3.

circle-overprescribed-radius-center-points = Ntibishoboka kubara uruziga rufite radiyusi, ikigo n'ududomo bwose byatanzwe.

circle-center-with-multiple-points = Ntibishoboka kubara uruziga rufite ikigo cyatanzwe runyura ku kadomo karenze kamwe.

circle-radius-too-small = Ntibishoboka kubara uruziga: kubera ko intera hagati y'utwo dudomo tubiri ari { $distance }, radiyusi { $radius } yatanzwe ni nto cyane.

circle-radius-with-many-points = Ntibishoboka kurema uruziga runyura ku dudomo turenze tubiri rufite radiyusi yatanzwe.

circle-invalid-center-or-through-points = Ikigo cyangwa ududomo tunyurwaho by'uruziga ntibyemewe.

circle-radius-center-with-multiple-points = Ntibishoboka kubara radiyusi y'uruziga rufite ikigo cyatanzwe runyura ku kadomo karenze kamwe.

circle-change-radius-non-numerical = Ntibishoboka guhindura radiyusi y'uruziga runyura ku dudomo tudafite indangagaciro z'imibare

circle-radius-with-points-non-numerical = Ntibishoboka kurema uruziga runyura ku kadomo karenze kamwe rufite radiyusi yatanzwe igihe nta ndangagaciro z'imibare zihari.

circle-change-center-non-numerical = Guhindura ikigo cy'uruziga runyura ku dudomo tudafite indangagaciro z'imibare ntibyakozwe.

## `<function>`

function-domain-insufficient-dimensions = Ingano y'ikibanza cya fonksiyo ntihagije. Ikibanza gifite intera { $intervals } ariko fonksiyo ifite injizwa { $inputs }.

function-domain-invalid-format = Imiterere y'ikibanza cya fonksiyo ntiyemewe.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Hirengagijwe agaciro ntarengwa ka fonksiyo katari umubare.
        [minimum] Hirengagijwe agaciro gato ka fonksiyo katari umubare.
        [extremum] Hirengagijwe agaciro k'impera ka fonksiyo katari umubare.
        [point] Hirengagijwe akadomo ka fonksiyo katari umubare.
        [slope] Hirengagijwe umuhengeri wa fonksiyo utari umubare.
       *[other] Hirengagijwe { $type } ya fonksiyo itari umubare.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Hirengagijwe agaciro ntarengwa ka fonksiyo karimo ubusa.
        [minimum] Hirengagijwe agaciro gato ka fonksiyo karimo ubusa.
        [extremum] Hirengagijwe agaciro k'impera ka fonksiyo karimo ubusa.
        [point] Hirengagijwe akadomo ka fonksiyo karimo ubusa.
       *[other] Hirengagijwe { $type } ya fonksiyo irimo ubusa.
    }

function-points-too-close = Fonksiyo irimo ududomo tubiri turi hafi cyane. Fonksiyo ntishobora gusobanurwa.

function-iterates-input-output-mismatch = Gusubiramo fonksiyo bishoboka gusa iyo umubare w'injizwa ungana n'umubare w'ibisohoka. Iyi fonksiyo ifite injizwa { $inputs } n'ibisohoka { $outputs }.

## `<sequence>`

sequence-invalid-length = Uburebure bw'urukurikirane ntibwemewe. Bugomba kuba umubare wuzuye utari munsi ya zeru.

sequence-invalid-step = Intambwe y'urukurikirane ntiyemewe. Igomba kuba umubare ku rukurikirane rw'ubwoko { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" y'urukurikirane rw'imibare ntiyemewe. Igomba kuba umubare.

sequence-invalid-endpoint-letters = "{ $attribute }" y'urukurikirane rw'inyuguti ntiyemewe. Igomba kuba ihuriro ry'inyuguti.

sequence-invalid-endpoint = "{ $attribute }" y'urukurikirane ntiyemewe.

select-from-sequence-coprime-not-numbers = coprime irirengagizwa kuko atari imibare ihitwamo

select-from-sequence-coprime-with-exclude-combinations = coprime irirengagizwa kuko excludeCombinations yatanzwe

## Resolving a `target`

target-not-found = target ntiyemewe kuri `<{ $source }>`: intego ntibonetse.

target-state-variable-not-found = target ntiyemewe kuri `<{ $source }>`: impinduka y'imiterere yitwa "{ $property }" ntibonetse kuri `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Impinduka za `<odeSystem>` zigomba gutandukana n'impinduka yigenga.

ode-system-duplicate-variable-names = Ntibishoboka gusobanura fonksiyo za ODE RHS zifite amazina y'impinduka ziterwa yisubiyemo.

ode-system-rhs-function-error = Ntibishoboka gusobanura fonksiyo ya ODE RHS. Habaye ikosa mu kurema fonksiyo ya mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ntibishoboka gusobanura inguni hagati y'imirongo { $count }

angle-invalid-through-point = Akadomo katemewe muri through ya `<angle>`

parabola-vertex-too-many-points = Parabola ifite impinamurongo inyura ku kadomo karenze kamwe ntiyakozwe.

parabola-too-many-points = Parabola inyura ku dudomo turenze 3 ntiyakozwe.

intersection-too-many-items = Guhurira kw'ibintu birenze bibiri ntibyakozwe

## Other math components

ionic-compound-not-two-ions = Umuvange wa ayoni w'ikindi kitari ayoni ebyiri ntiwakozwe.

ionic-compound-needs-cation-and-anion = Umuvange wa ayoni wakozwe gusa kuri cation imwe na anion imwe.

solve-equations-cannot-evaluate = Ntibishoboka gukemura ingereka kuko itashoboye gusuzumwa: { $equation }

math-operators-operand-number-required = operandNumber igomba gutangwa mu gukura operand y'imibare.

eigen-decomposition-failed = Ntibyashobotse kubara eigenvalue za matrisi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } ntibigaragara mu miterere, bityo bizahora bihura n'ubusa.

## `<graph>`

graph-grid-invalid = `<graph>`: ntibishoboka gusobanura grid="{ $grid }". Igomba kuba none, medium, dense, cyangwa imibare ibiri myiza itandukanyijwe n'umwanya, nka grid="1 0.5". Nta gitereko gishushanyijwe.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ntishyigikiwe mu igaragaza rya prefigure; hakoreshejwe imyitwarire y'umwanya w'iburyo.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ntishyigikiwe mu igaragaza rya prefigure; hakoreshejwe imyitwarire y'umwanya wo hejuru.

prefigure-invalid-axis-bounds = `<graph>`: imipaka y'umurongo w'ishingiro ntiyemewe mu ihinduka rya prefigure; hakoreshejwe bbox isanzwe (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ubugari ntibwemewe mu ihinduka rya prefigure; hakoreshejwe ubugari busanzwe bw'igishushanyo 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ntiyemewe mu ihinduka rya prefigure; hakoreshejwe igipimo gisanzwe 1.

prefigure-grid-spacing-too-fine = `<graph>`: intera y'igitereko ni nto cyane ku mipaka y'umurongo w'ishingiro; igitereko cyasibwe mu igaragaza rya prefigure.

prefigure-annotations-not-rendered = `<graph>`: ibisobanuro ntibizagaragazwa igihe igaragaza rya PreFigure ritakoreshejwe.

multiple-annotations-children = Habonetse abana `<annotations>` benshi muri `<graph>`; bose birirengagijwe uretse uwa nyuma.

## Referring to other components

copy-unrecognized-component-type = Ntibishoboka kwagura cyangwa kwandukura ubwoko bw'igice butazwi: { $type }.

copy-prop-not-found = Ikiranga { $property } ntikibonetse ku gice cy'ubwoko { $component }

collect-no-source = Nta soko ribonetse rya collect.

collect-invalid-component-type = Ntibishoboka gukusanya ibice by'ubwoko `<{ $component }>` kuko ari ubwoko bw'igice butemewe.

reference-index-unavailable = Ntibishoboka kwerekeza ku mubare `{ $reference }`

## `<callAction>`

component-action-unavailable = Ntibishoboka guhamagara { $action } ku gice `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Imiterere y'amakuru ntiyemewe. Imirongo ifite uburebure butandukanye. Byabonetse muri componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Amakuru afite amazina y'inkingi yisubiyemo. Byabonetse muri componentIdx :{ $componentIdx }

data-frame-missing-column-name = Amakuru abura izina ry'inkingi. Byabonetse muri componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award y'iki gisubizo ishingiye ku gisubizo cyoherejwe na tagi answer ubwayo, ibyo bizatera imyitwarire itateganyijwe.

answer-max-num-attempts-in-section-wide-check-work = Gushyira `maxNumAttempts` kuri `<answer>` iri mu kirimo gifite `sectionWideCheckWork` nta cyo bimara, kuko umubare w'amagerageza ugenzurwa n'icyo kirimo. Shyira `maxNumAttempts` ku kirimo ahubwo.

nested-section-wide-check-work-max-num-attempts = Gushyira `maxNumAttempts` ku kirimo gifite `sectionWideCheckWork` kiri mu kindi kirimo gifite `sectionWideCheckWork` nta cyo bimara, kuko umubare w'amagerageza ugenzurwa n'ikirimo cyo hanze. Shyira `maxNumAttempts` ku kirimo cyo hanze ahubwo.

answer-attributes-need-symbolic-equality = Ibiranga { $attributes } nta cyo bizamara nta symbolicEquality yashyizweho.

answer-invalid-type = Ubwoko ntibwemewe ku gisubizo: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Kubera ko igice `<{ $component }>` kidafite izina, ntigishobora gukoreshwa nk'ikiranga cya module

module-attribute-name-already-defined = Igice `<{ $component } name="{ $name }">` ntigishobora gukoreshwa nk'ikiranga cya module kuko ubwoko bw'igice `<module>` busanzwe bufite ikiranga cyitwa "{ $name }".

conditional-content-condition-ignored = Ikiranga `condition` kirirengagizwa ku gice `<conditionalContent>` gifite abana case cyangwa else.

slider-markers-type-mismatch = Ubwoko bw'ibimenyetso ntibuhuye n'ubwoko bwa slider.

pretzel-problem-needs-statement-and-answer = pretzel ntiyemewe: buri `<problem>` igomba kuba irimo `<statement>` imwe na `<answer>` imwe.

pretzel-circuit-first-problem-distractor = pretzel ntiyemewe: muri mode="circuit", `<problem>` ya mbere ntishobora kuba iyo kuyobya.

## Attribute values

attribute-invalid-values = Agaciro { $values } ntikemewe ku kiranga `{ $attribute }`; karirengagizwa.

attribute-must-be-references = Agaciro `{ $value }` ntikemewe ku kiranga `{ $attribute }`. Ikiranga kigomba kuba kigizwe n'ibyerekezo bitangira na `$`.

math-input-invalid-function-names = <mathInput>: hirengagijwe amazina ya fonksiyo atemewe muri { $attribute }: { $names }. Igice kigaragara cya buri zina kigomba kugira nibura inyuguti 2 (inyuguti cyangwa udukoni); umugereka `|<mathspeak alternative>` ushobora gukurikira.

## Building components from the source

component-type-invalid = Ubwoko bw'igice ntibwemewe: `<{ $componentType }>`

attribute-repeated = Ikiranga { $attribute } ntigishobora kwisubiramo.

attribute-invalid-for-component = Ikiranga "{ $attribute }" ntikemewe ku gice cy'ubwoko `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Ubusobanuro bw'imisusire { $styleNumber } bufite itandukaniro ridahagije kuri { $context ->
        [text-on-background] ibara ry'inyandiko ku ibara ry'imbuganyuma
        [high-contrast] ibara ry'itandukaniro rikomeye ku rupapuro
        [line] ibara ry'umurongo ku rupapuro
        [marker] ibara ry'ikimenyetso ku rupapuro
       *[text-on-canvas] ibara ry'inyandiko ku rupapuro
    }{ $mode ->
        [dark] { " (uburyo bwijimye)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bisaba nibura { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Nubwo ubusobanuro bw'imisusire { $styleNumber } bwatanze amabara afite itandukaniro rihagije ku buryo bumurika, amabara y'uburyo bwijimye akomoka kuri yo afite itandukaniro ridahagije hagati y'ibara ry'inyandiko n'iry'imbuganyuma ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bisaba nibura { $threshold }:1). { $suggestion ->
        [available] Kugira ngo itandukaniro rihagije ribeho mu buryo bwijimye, ongera itandukaniro ry'uburyo bumurika (urugero shyiraho { $lightAttribute }="{ $lightColor }") cyangwa uhindure ibara ry'uburyo bwijimye (urugero shyiraho { $darkAttribute }="{ $darkColor }").
       *[none] Kugira ngo itandukaniro rihagije ribeho mu buryo bwijimye, ongera itandukaniro ry'uburyo bumurika cyangwa uhindure amabara akomoka kuri yo ukoresheje textColorDarkMode na/cyangwa backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Nubwo ubusobanuro bw'imisusire { $styleNumber } bwatanze ibara ry'inyandiko rifite itandukaniro rihagije ku buryo bumurika, ibara ry'inyandiko ry'uburyo bwijimye rikomoka kuri ryo rifite itandukaniro ridahagije ku rupapuro ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bisaba nibura { $threshold }:1). { $suggestion ->
        [available] Kugira ngo itandukaniro rihagije ribeho mu buryo bwijimye, ongera itandukaniro ry'uburyo bumurika (urugero shyiraho textColor="{ $lightColor }") cyangwa uhindure ibara ry'uburyo bwijimye (urugero shyiraho textColorDarkMode="{ $darkColor }").
       *[none] Kugira ngo itandukaniro rihagije ribeho mu buryo bwijimye, ongera itandukaniro ry'uburyo bumurika cyangwa uhindure ibara rikomoka kuri ryo ukoresheje textColorDarkMode.
    }

section-multiple-style-palettes = Igika gishobora guhitamo <stylePalette> imwe gusa; hakoreshejwe iya nyuma.

## Unique variants

variant-num-to-select-not-non-negative-integer = ntibishoboka kumenya ubwoko bwihariye bwa { $component } kuko numToSelect atari umubare wuzuye utari munsi ya zeru.

variant-num-to-select-not-constant-number = ntibishoboka kumenya ubwoko bwihariye bwa { $component } kuko numToSelect atari umubare uhoraho.

variant-with-replacement-not-constant-boolean = ntibishoboka kumenya ubwoko bwihariye bwa { $component } kuko withReplacement atari boolean ihoraho.

variant-select-weight-disables-unique = Ubwoko bwihariye bwa select burahagarikwa iyo hari ihitamo rifite selectWeight cyangwa selectForVariants

variant-coprime-undetermined = ntibishoboka kumenya ubwoko bwihariye bwa { $component } kuko bidashoboka kumenya ko coprime ihora ari ibinyoma.

variant-attribute-not-constant = ntibishoboka kumenya ubwoko bwihariye bwa { $component } kuko { $attribute } atari ikintu gihoraho.

variant-attribute-not-number = ntibishoboka kumenya ubwoko bwihariye bwa { $component } kuko { $attribute } atari umubare.

variant-attribute-wrong-type-for-sequence =
    ntibishoboka kumenya ubwoko bwihariye bwa { $component } bw'ubwoko { $type } kuko { $attribute } atari { $expected ->
        [letters-combination] ihuriro ry'inyuguti
        [math-expression] imvugo y'imibare yemewe
        [integer] umubare wuzuye
       *[number] umubare
    }.

variant-length-not-integer = ntibishoboka kumenya ubwoko bwihariye bwa { $component } kuko length atari umubare wuzuye.

variant-sort-not-implemented = ubwoko bwihariye bwa { $component } bufite sort ntibwakozwe

variant-exclude-combinations-not-implemented = ubwoko bwihariye bwa { $component } bufite excludeCombinations ntibwakozwe

variant-math-exclude-not-implemented = ubwoko bwihariye bwa { $component } bw'ubwoko math bufite exclude ntibwakozwe

variant-non-constant-exclude-not-implemented = ubwoko bwihariye bwa { $component } bufite exclude itahoraho ntibwakozwe

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ntibishyigikiwe mu igaragaza rya graph prefigure; urubyaro rwasimbutswe.

prefigure-descendant-invalid-geometry = { $subject }: jewometeri idashira cyangwa idashyitse; urubyaro rwasimbutswe.

prefigure-curve-label-omitted = { $subject }: udukarango ntidushyigikiwe ku bice by'umuzingo byahinduwe; akarango kasibwe.

prefigure-curve-unsupported-definition-type = { $subject }: ubwoko bw'ubusobanuro bwa fonksiyo y'umuzingo '{ $definitionType }' ntibushyigikiwe; urubyaro rwasimbutswe.

prefigure-region-flip-functions-unsupported = { $subject }: ikiranga flipFunctions kuri regionBetweenCurves ntigishyigikiwe; urubyaro rwasimbutswe.

prefigure-region-non-formula-child = { $subject }: hashyigikiwe gusa fonksiyo z'abana z'ubwoko formula kuri regionBetweenCurves; urubyaro rwasimbutswe.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ntishyigikiwe ku { $labelKind ->
        [line-family] karango k'umuryango w'umurongo
       *[point] karango k'akadomo
    }; hakoreshejwe itondekanya risanzwe rya PreFigure.

prefigure-fill-style-unsupported = { $subject }: imisusire yo kuzuza '{ $fillStyle }' ntishyigikiwe na PreFigure; hasubiwe ku kuzuza gukomeye.

prefigure-line-style-unknown = { $subject }: imisusire y'umurongo itazwi '{ $lineStyle }' yasibwe mu bisohoka bya PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: imisusire y'ikimenyetso '{ $markerStyle }' yahinduwe imisusire ya PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: imisusire y'ikimenyetso '{ $markerStyle }' ntishyigikiwe na PreFigure; hakoreshejwe imisusire isanzwe.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ntiyemewe; intego ntishobora kumenyekana. Ibisobanuro byasibwe.

annotation-ref-multiple-targets = `<annotation>`: `ref` yerekeje ku ntego nyinshi; hakoreshejwe iya mbere.

annotation-ref-outside-graph = `<annotation>`: `ref` ntiyemewe; intego iri hanze ya grafike ikubiyemo. Ibisobanuro byasibwe.

annotation-ref-unsupported-target = `<annotation>`: `ref` ntiyemewe; intego si ikintu cy'igishushanyo gishyigikiwe mu ihinduka rya prefigure. Ibisobanuro byasibwe.

annotation-text-missing = `<annotation>`: `text` ibuze cyangwa irimo ubusa; hasohotse inyandiko irimo ubusa.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Habonetse ubwitange buzengurutse.
       *[other] Habonetse ubwitange buzengurutse burimo igice `<{ $componentType }>`.
    }

reference-no-referent = Nta cyerekezweho cyabonetse kuri: `{ $reference }`

reference-multiple-referents = Habonetse ibyerekezweho byinshi kuri: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Imiterere ntiyemewe ku kiranga { $attribute } cya `<{ $componentType }>`.

children-invalid = Abana batemewe ba `<{ $componentType }>`: habonetse abana batemewe: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Agaciro `{ $value }` ntikemewe ku kiranga `{ $attribute }`; hakoreshejwe agaciro `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Verisiyo ya DoenetML { $version } ntibonetse.
       *[other] Verisiyo ya DoenetML { $version } ntibonetse. Hasubiwe kuri verisiyo { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ntiyemewe: { $content }

parse-tag-missing-close-tag = DoenetML ntiyemewe: Tagi `{ $tag }` ntifite tagi ifunga. Hategerejwe tagi yifunga cyangwa tagi `</{ $tagName }>`.

parse-tag-error = DoenetML ntiyemewe: Ikosa muri tagi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ntiyemewe: Ikiranga kitemewe `{ $attribute }` gisa n'ikibuze agaciro.

parse-attribute-invalid = DoenetML ntiyemewe: Ikiranga `{ $attribute }` ntikemewe

parse-attribute-value-invalid = DoenetML ntiyemewe: Agaciro k'ikiranga `{ $value }` ntikemewe

parse-attribute-value-quote-mismatch = DoenetML ntiyemewe: Agaciro k'ikiranga `{ $value }` ntikemewe. Utumenyetso two guhera ntituhuye. Bisa n'aho `{ $quote }` ibuze

parse-open-tag-name-missing = DoenetML ntiyemewe: Habonetse tagi idafite izina rya tagi, urugero `<`

parse-tag-not-closed = DoenetML ntiyemewe: Tagi `{ $tag }` ntiyafunzwe (bisa n'aho `>` ibuze).

parse-self-closing-tag-name-missing = DoenetML ntiyemewe: Habonetse tagi idafite izina rya tagi `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ntiyemewe: Tagi `{ $tag }` ntiyafunzwe (bisa n'aho `/>` ibuze).

parse-tag-invalid-attributes = DoenetML ntiyemewe: Tagi `{ $tag }` ntiyemewe. Ishobora kuba ifite ibiranga bitari byo.

parse-close-tag-name-missing = DoenetML ntiyemewe: Habonetse tagi ifunga idafite izina rya tagi, urugero `</`

parse-attribute-value-unquoted = Indangagaciro z'ibiranga zigomba gushyirwa mu tumenyetso two guhera: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ntiyemewe: Habonetse tagi ifunga `{ $tag }`, ariko nta tagi ifungura ihuye na yo

parse-close-tag-mismatched = DoenetML ntiyemewe: Tagi ifunga ntihuye. Hategerejwe `</{ $expected }>`. Habonetse `{ $found }`

parser-node-unconvertible = Ntibyashobotse guhindura node { $node } ngo ibe node ya Dast.

## Names

name-attribute-invalid =
    Ikiranga name='{ $name }' ntikemewe. { $reason ->
        [characters] Amazina ashobora kugira inyuguti, imibare, udukoni two hasi cyangwa udukoni gusa.
       *[start] Amazina agomba gutangirira ku nyuguti.
    }

component-name-invalid-start = Izina ry'igice "{ $name }" ntiryemewe. Amazina agomba gutangirira ku nyuguti.

## `<answer>` sugar

answer-video-watched-missing-video = Igisubizo cy'ubwoko videoWatched kigomba kugira ikiranga video

answer-video-watched-video-not-reference = Igisubizo cy'ubwoko videoWatched kigomba kugira ikiranga video ari icyerekezo

answer-name-not-single-text = Ikiranga name cy'igisubizo kigomba kugira umwana text umwe gusa

## Referencing another document

external-doenetml-recursion-limit = Ntibishoboka kubona DoenetML yo hanze kubera inzego nyinshi z'isubiramo. Ese hari icyerekezo kizengurutse?

external-doenetml-unavailable = Ntibishoboka kubona DoenetML kuri { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML yavuye kuri { $attribute }="{ $uri }" ntiyemewe: ntihuye n'ubwoko bw'igice "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ikiranga `{ $from }` ntigikoreshwa ukundi; koresha `{ $to }` ahubwo.
       *[other] [deprecation] Ikiranga `{ $from }` kuri `<{ $component }>` ntigikoreshwa ukundi; koresha `{ $to }` ahubwo.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ikiranga `{ $from }` ntigikoreshwa ukundi kandi kirirengagizwa kuko na `{ $to }` yatanzwe.
       *[other] [deprecation] Ikiranga `{ $from }` kuri `<{ $component }>` ntigikoreshwa ukundi kandi kirirengagizwa kuko na `{ $to }` yatanzwe.
    }

deprecated-attribute-ignored = [deprecation] Ikiranga `{ $attribute }` kuri `<{ $component }>` ntigikoreshwa ukundi kandi kirirengagizwa.


## Language coverage

pluralize-english-only = `<pluralize>` ishobora gushyira mu bwinshi Icyongereza gusa, bityo inyandiko yayo isigara uko iri mu nyandiko yanditse mu { $locale }. Andika ubwinshi ubwabwo, cyangwa ubushyireho ukoresheje ikiranga `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Igice `<{ $tag }>` si igice cya Doenet kizwi.

schema-element-not-allowed-at-root = Igice `<{ $tag }>` ntikemewe ku muzi w'inyandiko.

schema-element-not-allowed-inside = Igice `<{ $tag }>` ntikemewe imbere muri `<{ $parent }>`.

schema-attribute-unrecognized = Igice `<{ $tag }>` ntigifite ikiranga cyitwa `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ikiranga `{ $attribute }` cy'igice `<{ $tag }>` kigomba kuba urutonde aho buri kintu ari kimwe muri: { $allowed }
       *[other] Ikiranga `{ $attribute }` cy'igice `<{ $tag }>` kigomba kuba kimwe muri: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Izina ry'ubwoko ntiryemewe kuri select. Izina ry'ubwoko { $variantName } rigaragara mu mahitamo { $numOptions } ariko umubare wo guhitamo ni { $numToSelect }.

select-variant-name-without-options = Ubwoko bumwe bwatanzwe kuri select ariko nta mahitamo yatanzwe ku izina ry'ubwoko rishoboka: { $variantName }.

select-variant-name-not-possible = Izina ry'ubwoko { $variantName } ryatanzwe kuri select si izina ry'ubwoko rishoboka.

select-too-few-options = Ntibishoboka guhitamo ibice { $numToSelect } muri { $numOptions } gusa.

select-from-sequence-too-few-values = Ntibishoboka guhitamo indangagaciro { $numToSelect } mu rukurikirane rufite uburebure { $length }.

select-from-sequence-indices-count-mismatch = Umubare w'inyandiko zatanzwe kuri select ugomba guhura n'umubare wo guhitamo

select-from-sequence-indices-not-integers = Imibare yose y'inyandiko yatanzwe kuri select igomba kuba imibare yuzuye

select-from-sequence-index-excluded = Hatanzwe umubare w'inyandiko wa selectfromsequence wari waravanywemo

select-from-sequence-indices-excluded-combination = Hatanzwe imibare y'inyandiko ya selectfromsequence yari ihuriro ryavanywemo

select-from-sequence-coprime-not-positive-integers = Ntibishoboka guhitamo amahuriro ya coprime kuko atari imibare yuzuye myiza ihitwamo.

select-from-sequence-coprime-common-factor = Ntibishoboka guhitamo imibare ya coprime. Indangagaciro zose zishoboka zisangiye igabanyo kimwe. (Indangagaciro zatanzwe za "from" cyangwa "to" zigomba kuba coprime na "step".)

select-from-sequence-coprime-single-number = Ntibishoboka guhitamo amahuriro ya coprime ku mubare umwe utari 1.

select-from-sequence-excluded-too-many-combinations = Hejuru ya 70% by'amahuriro yavanywemo muri selectFromSequence

select-from-sequence-coprime-none-found = Ntibyashobotse guhitamo imibare ya coprime. Indangagaciro zose zishoboka zisangiye igabanyo kimwe.

select-from-sequence-too-few-unique-values = Ntibishoboka guhitamo indangagaciro zihariye { $numToSelect } mu rukurikirane rufite uburebure { $numPossibleValues }

select-prime-numbers-too-few-values = Ntibishoboka guhitamo indangagaciro { $numToSelect } ku rutonde rw'imibare ibanze rufite uburebure { $numValues }

select-prime-numbers-values-count-mismatch = Umubare w'indangagaciro zatanzwe kuri select ugomba guhura n'umubare wo guhitamo

select-prime-numbers-values-not-prime = Indangagaciro zose zatanzwe kuri select prime number zigomba kuba ziri ku rutonde rw'imibare ibanze

select-prime-numbers-values-excluded-combination = Indangagaciro zatanzwe za selectPrimeNumbers zari ihuriro ryavanywemo

select-prime-numbers-excluded-too-many-combinations = Hejuru ya 70% by'amahuriro yavanywemo muri selectPrimeNumbers

select-random-combination-fluke = Ku bw'amahirwe adasanzwe cyane, ntibyashobotse guhitamo ihuriro ry'indangagaciro zitunguranye

select-random-value-fluke = Ku bw'amahirwe adasanzwe cyane, ntibyashobotse guhitamo agaciro gatunguranye
