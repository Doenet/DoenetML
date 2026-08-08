# Kʼicheʼ diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Written in the ALMG orthography; see `chrome.ftl`'s header for the alphabet, the
# register, and the possessive-prefix constraint.
#
# Every "the X of Y" here is written with «rech», never with «u-»/«r-» on a value.
#
# Inanimate nouns take no plural and the verb does not agree with an inanimate
# subject's number, so a counted message whose only English difference is number
# renders one string here and the select is dropped. A comment marks each site.


## `<lineSegment>`

# No select: these nouns are inanimate and take no plural, and the verb does not
# agree with the number of what is ignored, so one string covers both English
# categories. The count still arrives.
line-segment-attributes-ignored-with-endpoints = man kakoj taj { $attributes } are kʼo kebʼ kʼisbʼal yaʼom

line-segment-attributes-ignored-with-endpoint-and-midpoint = man kakoj taj { $attributes } are kʼo jun kʼisbʼal xuqujeʼ jun nikʼajibʼal yaʼom

line-segment-midpoint-offset-without-midpoint = midpointOffset maj kubʼan we maj nikʼajibʼal

## `<line>`

line-points-undetermined-dimensions = Juchʼ kikʼow pa tzʼubʼ ri man qʼalaj taj ri knajtiil.

line-points-too-few-dimensions = Ri juchʼ rajawaxik kikʼow pa tzʼubʼ ri kʼo kebʼ o kʼi na knajtiil.

line-points-depend-on-variables = Ri juchʼ kikʼow pa tzʼubʼ ri kʼo kikʼexbʼal: { $variables }.

line-equation-invalid-format = Man utz taj ri ubʼanik rech ri junamil rech juchʼ pa ri kʼexbʼal { $variable1 } xuqujeʼ { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ri juchʼ junwiʼ yaʼom rukʼ through, endpoint xuqujeʼ direction.  Man kakoj taj ri through yaʼom.

ray-dimension-mismatch = numDimensions man junam taj pa ri juchʼ junwiʼ.

## `<vector>`

vector-overprescribed-head = Ri bektor yaʼom rukʼ head, tail xuqujeʼ displacement.  Man kakoj taj ri head yaʼom.

vector-dimension-mismatch = numDimensions man junam taj pa ri bektor.

## Attracting and constraining

attract-to-without-nearest-point = Man kakowin taj kajuruxik che jun `<{ $component }>`, rumal man kʼo taj nearestPoint.

constrain-to-without-nearest-point = Man kakowin taj katzʼapix che jun `<{ $component }>`, rumal man kʼo taj nearestPoint.

constrain-to-interior-without-nearest-point = Man kakowin taj katzʼapix chupam jun `<{ $component }>`, rumal man kʼo taj nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = man kakoj taj labelPosition rech jun choiceInput ri man inline taj

## Ordering children by index

choice-input-indices-count-mismatch = Man kakoj taj ri indices yaʼom rech choiceInput, rumal ri ajilanik man junam taj rukʼ ri kajilabʼal choice.

pretzel-indices-count-mismatch = Man kakoj taj ri indices yaʼom rech problem, rumal ri ajilanik man junam taj rukʼ ri kajilabʼal problem.

shuffle-indices-count-mismatch = Man kakoj taj ri indices yaʼom rech shuffle, rumal ri ajilanik man junam taj rukʼ ri kajilabʼal wokaj.

indices-ignored-out-of-range = Man kakoj taj ri indices yaʼom rech { $component }, rumal kʼo indices keʼel bʼi che ri kʼolibʼal.

pretzel-indices-repeated = Man kakoj taj ri indices yaʼom rech pretzel, rumal kʼo indices kamul.

pretzel-circuit-first-index = Man kakoj taj ri indices yaʼom rech pretzel pa circuit, rumal ri nabʼe index rajawaxik are 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Rech `<{ $component }>` kachakun rukʼ tzʼibʼ kajilabʼal, rajawaxik kaya jun `type` retal.

invalid-type-defaulting-to-math = Man utz taj ri ubʼanik { $type } rech ri wokaj { $component }. Rajawaxik are math, text, number o boolean. Kakoj math.

string-not-valid-component-to-arrange = Ri tzʼibʼ "{ $value }" man utz taj wokaj rech { $component }. Man kakoj taj.

## Types and variables

invalid-type-defaulting-to-number = Man utz taj ri ubʼanik { $type }, kakoj number.

invalid-variable-value = Man utz taj rajil jun kʼexbʼal: `{ $value }`

## Variants

variant-index-must-be-number = Ri index rech ubʼanik { $index } rajawaxik are ajilabʼal

variant-index-must-be-integer = Ri index rech ubʼanik { $index } rajawaxik are tzʼaqat ajilabʼal

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` man bʼanom taj rech tzʼaqat etabʼal. Kakoj junamibʼal pa ri unimal.

side-by-side-absolute-margins = `<{ $component }>` man bʼanom taj rech tzʼaqat etabʼal. Kakoj junamibʼal pa ri utzʼapibʼal.

side-by-side-no-block-child = Man utz taj `<{ $component }>`: rajawaxik kʼo jun ral bloke.

## `<label>`

label-for-ignored-on-graphical = Man kakoj taj ri retal `for` pa jun `<label>` wachibʼalil.

label-for-must-resolve-to-one = Ri retal `for` pa `<label>` rajawaxik kukʼam xa jun wokaj.

label-for-unresolved = Ri retal `for` pa `<label>` man xkowin taj kukʼam jun wokaj.

label-for-answer-with-authored-inputs = Ri retal `for` pa `<label>` kukʼam jun `<answer>` ri kʼo okibʼal tzʼibʼam rumal ri tzʼibʼanel; chakʼama ri okibʼal.

label-for-answer-without-input = Ri retal `for` pa `<label>` kukʼam jun `<answer>` ri maj okibʼal rech kaya ubʼiʼ.

label-for-must-reference-input-or-answer = Ri retal `for` pa `<label>` rajawaxik kukʼam jun okibʼal o jun tzalijisabʼal.

## Accessibility

accessibility-short-description-or-decorative = Rech okibʼal, `<{ $component }>` rajawaxik kʼo jun chʼutin bʼixibʼal o kabʼix chi are wikibʼal.

accessibility-video-short-description = Rech okibʼal, `<video>` rajawaxik kʼo jun chʼutin bʼixibʼal.

accessibility-input-short-description-or-label = Rech okibʼal, `<{ $component }>` rajawaxik kʼo jun chʼutin bʼixibʼal o jun ubʼiʼ.

accessibility-answer-input-short-description-or-label = Rech okibʼal, jun `<answer>` ri kubʼan jun okibʼal rajawaxik kʼo jun chʼutin bʼixibʼal o jun ubʼiʼ.

accessibility-short-description-contains-math = Ri chʼutin bʼixibʼal man rajawaxik taj kʼo ajilanik wokaj jetaq `<{ $component }>` chupam. Chatzʼibʼaj ri ajilanik rukʼ tzij.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } maj utz uwachibʼal rech ri tzʼibʼ rech ubʼiʼ ri tanajil (qʼeq ubʼanik) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; rajawaxik xa { $threshold }:1).
       *[other] { $colorName } maj utz uwachibʼal rech ri tzʼibʼ rech ubʼiʼ ri tanajil ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; rajawaxik xa { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Majaʼ bʼanom `<circle>` ri kikʼow pa { $count } tzʼubʼ are ri tzʼubʼ maj rajil ajilabʼal.

circle-too-many-through-points = Man kakowin taj kajilax jun setesik ri kikʼow pa kʼi na che 3 tzʼubʼ.

circle-overprescribed-radius-center-points = Man kakowin taj kajilax jun setesik rukʼ unajtiil, unikʼajal xuqujeʼ tzʼubʼ yaʼom junam.

circle-center-with-multiple-points = Man kakowin taj kajilax jun setesik rukʼ unikʼajal yaʼom ri kikʼow pa kʼi na che 1 tzʼubʼ.

circle-radius-too-small = Man kakowin taj kajilax ri setesik: rumal ri unajtiil chikixoʼl ri kebʼ tzʼubʼ are { $distance }, ri unajtiil { $radius } yaʼom sibʼalaj chʼutin.

circle-radius-with-many-points = Man kakowin taj kabʼan jun setesik ri kikʼow pa kʼi na che kebʼ tzʼubʼ rukʼ unajtiil yaʼom.

circle-invalid-center-or-through-points = Man utz taj ri unikʼajal o ri utzʼubʼ ri setesik.

circle-radius-center-with-multiple-points = Man kakowin taj kajilax ri unajtiil ri setesik rukʼ unikʼajal yaʼom ri kikʼow pa kʼi na che 1 tzʼubʼ.

circle-change-radius-non-numerical = Man kakowin taj kakʼex ri unajtiil ri setesik are ri tzʼubʼ man ajilabʼal taj

circle-radius-with-points-non-numerical = Man kakowin taj kabʼan jun setesik ri kikʼow pa kʼi na che jun tzʼubʼ rukʼ unajtiil yaʼom, are maj rajil ajilabʼal.

circle-change-center-non-numerical = Majaʼ bʼanom kakʼex ri unikʼajal jun setesik ri kikʼow pa tzʼubʼ ri maj rajil ajilabʼal.

## `<function>`

# Both selects dropped: these nouns are inanimate and take no plural, so English's
# four sentences are one here. Both counts still arrive and are still formatted.
function-domain-insufficient-dimensions = Maj utz unajtiil ri kʼolibʼal rech ri funsyon. Ri kʼolibʼal kʼo { $intervals } nikʼajibʼal are kʼu ri funsyon kʼo { $inputs } okibʼal.

function-domain-invalid-format = Man utz taj ri ubʼanik rech ri kʼolibʼal rech ri funsyon.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Man kakoj taj ri nimalaj rech ri funsyon ri man ajilabʼal taj.
        [minimum] Man kakoj taj ri chʼutin rech ri funsyon ri man ajilabʼal taj.
        [extremum] Man kakoj taj ri kʼisbʼal rech ri funsyon ri man ajilabʼal taj.
        [point] Man kakoj taj ri tzʼubʼ rech ri funsyon ri man ajilabʼal taj.
        [slope] Man kakoj taj ri qʼeyexik rech ri funsyon ri man ajilabʼal taj.
       *[other] Man kakoj taj ri { $type } rech ri funsyon ri man ajilabʼal taj.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Man kakoj taj ri nimalaj rech ri funsyon ri maj chupam.
        [minimum] Man kakoj taj ri chʼutin rech ri funsyon ri maj chupam.
        [extremum] Man kakoj taj ri kʼisbʼal rech ri funsyon ri maj chupam.
        [point] Man kakoj taj ri tzʼubʼ rech ri funsyon ri maj chupam.
       *[other] Man kakoj taj ri { $type } rech ri funsyon ri maj chupam.
    }

function-points-too-close = Ri funsyon kʼo kebʼ tzʼubʼ ri sibʼalaj naqaj kʼo wi. Man kakowin taj kabʼix ri funsyon.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Ri kamulinem rech funsyon xa kakowinik are ri ajilanik rech okibʼal junam rukʼ ri ajilanik rech elibʼal. Wa funsyon kʼo { $inputs } okibʼal xuqujeʼ { $outputs } elibʼal.

## `<sequence>`

sequence-invalid-length = Man utz taj ri unajtiil ri cholaj.  Rajawaxik are tzʼaqat ajilabʼal ri man chʼutin taj che 0.

sequence-invalid-step = Man utz taj ri uxaqʼabʼ ri cholaj.  Rajawaxik are ajilabʼal rech jun cholaj rech ubʼanik { $type }.

sequence-invalid-endpoint-number = Man utz taj ri "{ $attribute }" rech jun cholaj ajilabʼal.  Rajawaxik are ajilabʼal.

sequence-invalid-endpoint-letters = Man utz taj ri "{ $attribute }" rech jun cholaj tzʼibʼ.  Rajawaxik are riqoj tzʼibʼ.

sequence-invalid-endpoint = Man utz taj ri "{ $attribute }" rech ri cholaj.

select-from-sequence-coprime-not-numbers = man kakoj taj coprime rumal man ajilabʼal taj kachaʼik

select-from-sequence-coprime-with-exclude-combinations = man kakoj taj coprime rumal excludeCombinations yaʼom

## Resolving a `target`

target-not-found = Man utz taj ri target rech `<{ $source }>`: man kariqitaj taj.

target-state-variable-not-found = Man utz taj ri target rech `<{ $source }>`: man kariqitaj taj jun kʼolibʼal ri ubʼiʼ "{ $property }" pa jun `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Ri kikʼexbʼal ri `<odeSystem>` rajawaxik jun wi che ri kʼexbʼal utukel.

ode-system-duplicate-variable-names = Man kakowin taj kabʼix ri funsyon ODE RHS rukʼ ubʼiʼ kʼexbʼal kamul.

ode-system-rhs-function-error = Man kakowin taj kabʼix ri funsyon ODE RHS.  Sachbʼal are kabʼan ri funsyon mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Man kakowin taj kabʼix jun xukut chikixoʼl { $count } juchʼ

angle-invalid-through-point = Man utz taj ri tzʼubʼ pa ri through rech `<angle>`

parabola-vertex-too-many-points = Majaʼ bʼanom jun parabola rukʼ uxukut ri kikʼow pa kʼi na che 1 tzʼubʼ.

parabola-too-many-points = Majaʼ bʼanom jun parabola ri kikʼow pa kʼi na che 3 tzʼubʼ.

intersection-too-many-items = Majaʼ bʼanom ri riqbʼal rech kʼi na che kebʼ wokaj

## Other math components

ionic-compound-not-two-ions = Majaʼ bʼanom ri riqoj ioniko rech jun wi che kebʼ ion.

ionic-compound-needs-cation-and-anion = Ri riqoj ioniko xa bʼanom rech jun kation xuqujeʼ jun anion.

solve-equations-cannot-evaluate = Man kakowin taj kasol ri junamil, rumal man xkowin taj kajilax: { $equation }

math-operators-operand-number-required = Rajawaxik kaya jun operandNumber are kesax jun operando rech ajilanik.

eigen-decomposition-failed = Man xkowin taj kajilax ri rajil utukel ri matris

## `<matchesPattern>`

# No select: these nouns are inanimate and take no plural, and the verb does not
# agree, so both English categories are one string.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: ri etabʼal { $parameters } man kʼo taj pa ri wachibʼal, rumal riʼ amaqʼel kariq jun maj chupam.

## `<graph>`

graph-grid-invalid = `<graph>`: man kakowin taj kabʼix grid="{ $grid }". Rajawaxik are none, medium, dense, o kebʼ ajilabʼal ri man chʼutin taj che 0 jachom rukʼ jun kʼolibʼal, jetaq grid="1 0.5". Maj wokaj juchʼ kabʼanik.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" man kakoj taj pa ri kʼutunel prefigure; kakoj ri ubʼanik rech wiqiqʼabʼ.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" man kakoj taj pa ri kʼutunel prefigure; kakoj ri ubʼanik rech akʼanibʼal.

prefigure-invalid-axis-bounds = `<graph>`: man utz taj ri utzʼapibʼal ri sutbʼal rech ri kʼexbʼal prefigure; kakoj ri bbox nabʼe (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: man utz taj ri unimal rech ri kʼexbʼal prefigure; kakoj ri unimal nabʼe 425.

prefigure-invalid-aspect-ratio = `<graph>`: man utz taj ri aspectRatio rech ri kʼexbʼal prefigure; kakoj ri junamil nabʼe 1.

prefigure-grid-spacing-too-fine = `<graph>`: ri kʼolibʼal chikixoʼl ri wokaj juchʼ sibʼalaj xax rech ri utzʼapibʼal ri sutbʼal; man kakoj taj ri wokaj juchʼ pa ri kʼutunel prefigure.

prefigure-annotations-not-rendered = `<graph>`: man kekʼut taj ri tzʼibʼanik are man kakoj taj ri kʼutunel PreFigure.

multiple-annotations-children = Kʼi `<annotations>` kajilabʼal xeriqitaj pa `<graph>`; man kakoj taj ronojel, xa ri kʼisbʼal.

## Referring to other components

copy-unrecognized-component-type = Man kakowin taj kanimarisax o kawachibʼex jun ubʼanik wokaj ri man qʼalaj taj: { $type }.

copy-prop-not-found = Man xriqitaj taj ri prop { $property } pa jun wokaj rech ubʼanik { $component }

collect-no-source = Maj utikaribʼal xriqitaj rech collect.

collect-invalid-component-type = Man kakowin taj kemol wokaj rech ubʼanik `<{ $component }>`, rumal man utz taj ubʼanik.

reference-index-unavailable = Man kakowin taj kukʼam ri index `{ $reference }`

## `<callAction>`

component-action-unavailable = Man kakowin taj kasikʼix { $action } pa ri wokaj `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Man utz taj ri ubʼanik ri etamabʼal.  Ri unajtiil ri wokaj man junam taj. Xriqitaj pa componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Ri etamabʼal kʼo ubʼiʼ tikbʼal kamul.  Xriqitaj pa componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ri etamabʼal maj jun ubʼiʼ tikbʼal.  Xriqitaj pa componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Jun award rech wa tzalijisabʼal kʼo pa ri tzalijisabʼal taqom rumal ri tag rech tzalijisabʼal, xuqujeʼ kʼa te kukʼam bʼi jun ubʼanik ri man kʼo taj pa qakʼuʼx.

answer-max-num-attempts-in-section-wide-check-work = We kaya `maxNumAttempts` pa jun `<answer>` chupam jun kʼolibʼal ri kʼo `sectionWideCheckWork`, maj kubʼan, rumal ri kʼolibʼal kuchajij ri ajilanik rech tijonik. Chaya `maxNumAttempts` pa ri kʼolibʼal.

nested-section-wide-check-work-max-num-attempts = We kaya `maxNumAttempts` pa jun kʼolibʼal ri kʼo `sectionWideCheckWork` ri kʼo chupam jun chik kʼolibʼal rukʼ `sectionWideCheckWork`, maj kubʼan, rumal ri kʼolibʼal chirij kuchajij ri ajilanik rech tijonik. Chaya `maxNumAttempts` pa ri kʼolibʼal chirij.

# No select: «retal» is inanimate and takes no plural.
answer-attributes-need-symbolic-equality = Ri retal { $attributes } maj kubʼan we man kaya taj symbolicEquality.

answer-invalid-type = Man utz taj ri ubʼanik rech ri tzalijisabʼal: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Rumal ri wokaj `<{ $component }>` maj ubʼiʼ, man kakowin taj kakoj rech jun retal rech module

module-attribute-name-already-defined = Ri wokaj `<{ $component } name="{ $name }">` man kakowin taj kakoj jetaq jun retal rech jun module, rumal ri ubʼanik wokaj `<module>` kʼo chi jun retal "{ $name }".

conditional-content-condition-ignored = Man kakoj taj ri retal `condition` pa jun wokaj `<conditionalContent>` ri kʼo case o else kajilabʼal.

slider-markers-type-mismatch = Ri ubʼanik ri retal man junam taj rukʼ ri ubʼanik ri slider.

pretzel-problem-needs-statement-and-answer = Man utz taj pretzel: ronojel `<problem>` rajawaxik kʼo jun `<statement>` xuqujeʼ jun `<answer>`.

pretzel-circuit-first-problem-distractor = Man utz taj pretzel: pa mode="circuit", ri nabʼe `<problem>` man kakowin taj are jun sachbʼal kʼamalbʼe.

## Attribute values

# No select: «rajil» is inanimate and takes no plural.
attribute-invalid-values = Man utz taj rajil { $values } rech ri retal `{ $attribute }`; man kakoj taj.

attribute-must-be-references = Man utz taj rajil `{ $value }` rech ri retal `{ $attribute }`. Ri retal rajawaxik bʼanom rukʼ kʼamalbʼe ri kechaplebʼex rukʼ jun `$`.

math-input-invalid-function-names = <mathInput>: man kakoj taj ubʼiʼ funsyon ri man utz taj pa { $attribute }: { $names }. Ri utanaj kʼutunik rech ronojel bʼiʼaj rajawaxik kʼo xa 2 tzʼibʼ (tzʼibʼ o juchʼ); kakowinik kape jun `|<mathspeak alternative>` chirij.

## Building components from the source

component-type-invalid = Man utz taj ri ubʼanik wokaj: `<{ $componentType }>`

attribute-repeated = Man kakowin taj kamul ri retal { $attribute }.

attribute-invalid-for-component = Man utz taj ri retal "{ $attribute }" rech jun wokaj rech ubʼanik `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Ri ubʼixik ubʼanik { $styleNumber } maj utz uwachibʼal rech { $context ->
        [text-on-background] ri kabʼal rech tzʼibʼ chuwach ri kabʼal rech uwach
        [high-contrast] ri kabʼal nim uwachibʼal chuwach ri kʼolibʼal
        [line] ri kabʼal rech juchʼ chuwach ri kʼolibʼal
        [marker] ri kabʼal rech retal chuwach ri kʼolibʼal
       *[text-on-canvas] ri kabʼal rech tzʼibʼ chuwach ri kʼolibʼal
    }{ $mode ->
        [dark] { " (qʼeq ubʼanik)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; rajawaxik xa { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Pune ri ubʼixik ubʼanik { $styleNumber } xuya kabʼal ri kʼo utz uwachibʼal rech ri saq ubʼanik, ri qʼeq kabʼal ri kelik che wa rajil maj utz uwachibʼal rech ri kabʼal rech tzʼibʼ chuwach ri kabʼal rech uwach ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; rajawaxik xa { $threshold }:1). { $suggestion ->
        [available] Rech kʼo utz uwachibʼal pa ri qʼeq ubʼanik, chanimarisaj ri uwachibʼal rech ri saq (jetaq, chaya { $lightAttribute }="{ $lightColor }") o chakʼexa ri qʼeq kabʼal (jetaq, chaya { $darkAttribute }="{ $darkColor }").
       *[none] Rech kʼo utz uwachibʼal pa ri qʼeq ubʼanik, chanimarisaj ri uwachibʼal rech ri saq o chakʼexa ri kabʼal ri kelik rukʼ textColorDarkMode xuqujeʼ/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Pune ri ubʼixik ubʼanik { $styleNumber } xuya jun kabʼal rech tzʼibʼ ri kʼo utz uwachibʼal rech ri saq ubʼanik, ri qʼeq kabʼal rech tzʼibʼ ri kelik che wa rajil maj utz uwachibʼal chuwach ri kʼolibʼal ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; rajawaxik xa { $threshold }:1). { $suggestion ->
        [available] Rech kʼo utz uwachibʼal pa ri qʼeq ubʼanik, chanimarisaj ri uwachibʼal rech ri saq (jetaq, chaya textColor="{ $lightColor }") o chakʼexa ri qʼeq kabʼal (jetaq, chaya textColorDarkMode="{ $darkColor }").
       *[none] Rech kʼo utz uwachibʼal pa ri qʼeq ubʼanik, chanimarisaj ri uwachibʼal rech ri saq o chakʼexa ri kabʼal ri kelik rukʼ textColorDarkMode.
    }

section-multiple-style-palettes = Jun tanajil xa kakowinik kucha jun <stylePalette>; kakoj ri kʼisbʼal.

## Unique variants

variant-num-to-select-not-non-negative-integer = man kakowin taj kariqitaj ri utukel ubʼanik { $component }, rumal numToSelect man tzʼaqat ajilabʼal taj ri man chʼutin taj che 0.

variant-num-to-select-not-constant-number = man kakowin taj kariqitaj ri utukel ubʼanik { $component }, rumal numToSelect man ajilabʼal jikilik taj.

variant-with-replacement-not-constant-boolean = man kakowin taj kariqitaj ri utukel ubʼanik { $component }, rumal withReplacement man boolean jikilik taj.

variant-select-weight-disables-unique = Ri utukel ubʼanik rech select katzʼapix we kʼo jun chaʼoj rukʼ selectWeight o selectForVariants yaʼom

variant-coprime-undetermined = man kakowin taj kariqitaj ri utukel ubʼanik { $component }, rumal man kakowin taj kariqitaj we coprime amaqʼel man qas taj.

variant-attribute-not-constant = man kakowin taj kariqitaj ri utukel ubʼanik { $component }, rumal { $attribute } man jikilik taj.

variant-attribute-not-number = man kakowin taj kariqitaj ri utukel ubʼanik { $component }, rumal { $attribute } man ajilabʼal taj.

variant-attribute-wrong-type-for-sequence =
    man kakowin taj kariqitaj ri utukel ubʼanik { $component } rech ubʼanik { $type }, rumal { $attribute } man { $expected ->
        [letters-combination] jun riqoj tzʼibʼ
        [math-expression] jun utz tzij rech ajilanik
        [integer] jun tzʼaqat ajilabʼal
       *[number] jun ajilabʼal
    } taj.

variant-length-not-integer = man kakowin taj kariqitaj ri utukel ubʼanik { $component }, rumal length man tzʼaqat ajilabʼal taj.

variant-sort-not-implemented = majaʼ bʼanom ri utukel ubʼanik jun { $component } rukʼ sort

variant-exclude-combinations-not-implemented = majaʼ bʼanom ri utukel ubʼanik jun { $component } rukʼ excludeCombinations

variant-math-exclude-not-implemented = majaʼ bʼanom ri utukel ubʼanik jun { $component } rech ubʼanik math rukʼ exclude

variant-non-constant-exclude-not-implemented = majaʼ bʼanom ri utukel ubʼanik jun { $component } rukʼ jun exclude ri man jikilik taj

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: man kakoj taj pa ri kʼutunel graph prefigure; kakanaj kan ri ral.

prefigure-descendant-invalid-geometry = { $subject }: ri etabʼal man kʼisbʼal taj o man tzʼaqat taj; kakanaj kan ri ral.

prefigure-curve-label-omitted = { $subject }: man kakoj taj ubʼiʼ pa ri kotokik wokaj kʼexom; kakanaj kan ri ubʼiʼ.

prefigure-curve-unsupported-definition-type = { $subject }: man kakoj taj ri ubʼanik ubʼixik funsyon kotokik '{ $definitionType }'; kakanaj kan ri ral.

prefigure-region-flip-functions-unsupported = { $subject }: man kakoj taj ri retal flipFunctions pa regionBetweenCurves; kakanaj kan ri ral.

prefigure-region-non-formula-child = { $subject }: xa ri ral funsyon rech ubʼanik formula kakoj pa regionBetweenCurves; kakanaj kan ri ral.

prefigure-label-position-unsupported =
    { $subject }: man kakoj taj labelPosition '{ $labelPosition }' rech { $labelKind ->
        [line-family] jun ubʼiʼ rech riqoj juchʼ
       *[point] jun ubʼiʼ rech tzʼubʼ
    }; kakoj ri junamibʼal PreFigure nabʼe.

prefigure-fill-style-unsupported = { $subject }: PreFigure man kukoj taj ri ubʼanik nojisanik '{ $fillStyle }'; katzalij che jun nojisanik tzʼaqat.

prefigure-line-style-unknown = { $subject }: ri ubʼanik juchʼ '{ $lineStyle }' ri man qʼalaj taj kakanaj kan che ri elibʼal PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: ri ubʼanik retal '{ $markerStyle }' xkoj jetaq ri ubʼanik PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: PreFigure man kukoj taj ri ubʼanik retal '{ $markerStyle }'; kakoj ri ubʼanik nabʼe.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: man utz taj ri `ref`; man kakowin taj kariqitaj ri kʼamalbʼe. Kakanaj kan ri tzʼibʼanik.

annotation-ref-multiple-targets = `<annotation>`: ri `ref` xoponik pa kʼi kʼamalbʼe; kakoj ri nabʼe.

annotation-ref-outside-graph = `<annotation>`: man utz taj ri `ref`; ri kʼamalbʼe kʼo chirij ri graph. Kakanaj kan ri tzʼibʼanik.

annotation-ref-unsupported-target = `<annotation>`: man utz taj ri `ref`; ri kʼamalbʼe man are taj jun wachibʼal wokaj ri kakoj pa ri kʼexbʼal prefigure. Kakanaj kan ri tzʼibʼanik.

annotation-text-missing = `<annotation>`: maj ri `text` o maj chupam; kakoj jun tzʼibʼ ri maj chupam.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Xriqitaj jun setesik kʼamalbʼe.
       *[other] Xriqitaj jun setesik kʼamalbʼe rukʼ jun wokaj `<{ $componentType }>`.
    }

reference-no-referent = Maj xriqitaj rech wa kʼamalbʼe: `{ $reference }`

reference-multiple-referents = Kʼi xeriqitaj rech wa kʼamalbʼe: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Man utz taj ri ubʼanik rech ri retal { $attribute } rech `<{ $componentType }>`.

children-invalid = Man utz taj kajilabʼal rech `<{ $componentType }>`: xeriqitaj kajilabʼal ri man utz taj: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Man utz taj rajil `{ $value }` rech ri retal `{ $attribute }`, kakoj rajil `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Man xriqitaj taj ri DoenetML ubʼanik { $version }.
       *[other] Man xriqitaj taj ri DoenetML ubʼanik { $version }. Katzalij che ri ubʼanik { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Man utz taj DoenetML: { $content }

parse-tag-missing-close-tag = Man utz taj DoenetML: Ri tag `{ $tag }` maj utag tzʼapibʼal. Rajawaxik jun tag ri kutzʼapij ribʼ o jun tag `</{ $tagName }>`.

parse-tag-error = Man utz taj DoenetML: Sachbʼal pa ri tag `<{ $tagName }>`

parse-attribute-missing-value = Man utz taj DoenetML: Ri retal `{ $attribute }` ri man utz taj kʼo laʼ maj rajil.

parse-attribute-invalid = Man utz taj DoenetML: Man utz taj ri retal `{ $attribute }`

parse-attribute-value-invalid = Man utz taj DoenetML: Man utz taj rajil retal `{ $value }`

parse-attribute-value-quote-mismatch = Man utz taj DoenetML: Man utz taj rajil retal `{ $value }`. Ri retal tzij man junam taj. Maj jun `{ $quote }`

parse-open-tag-name-missing = Man utz taj DoenetML: Xriqitaj jun tag ri maj ubʼiʼ, jetaq `<`

parse-tag-not-closed = Man utz taj DoenetML: Ri tag `{ $tag }` man xtzʼapix taj (maj jun `>`).

parse-self-closing-tag-name-missing = Man utz taj DoenetML: Xriqitaj jun tag ri maj ubʼiʼ `<{ $content }>`

parse-self-closing-tag-not-closed = Man utz taj DoenetML: Ri tag `{ $tag }` man xtzʼapix taj (maj `/>`).

parse-tag-invalid-attributes = Man utz taj DoenetML: Ri tag `{ $tag }` man utz taj. Kakowinik kʼo retal ri man utz taj.

parse-close-tag-name-missing = Man utz taj DoenetML: Xriqitaj jun tag tzʼapibʼal ri maj ubʼiʼ, jetaq `</`

parse-attribute-value-unquoted = Rajil retal rajawaxik kʼo chikixoʼl retal tzij: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Man utz taj DoenetML: Xriqitaj ri tag tzʼapibʼal `{ $tag }`, are kʼu maj ri tag jaqbʼal junam rukʼ

parse-close-tag-mismatched = Man utz taj DoenetML: Ri tag tzʼapibʼal man junam taj. Rajawaxik `</{ $expected }>`. Xriqitaj `{ $found }`

parser-node-unconvertible = Man xkowin taj kakʼexik ri node { $node } che jun node Dast.

## Names

name-attribute-invalid =
    Man utz taj ri retal name='{ $name }'. { $reason ->
        [characters] Ri bʼiʼaj xa kakowinik kʼo tzʼibʼ, ajilabʼal, juchʼ pa uxeʼ o juchʼ.
       *[start] Ri bʼiʼaj rajawaxik kachaplebʼex rukʼ jun tzʼibʼ.
    }

component-name-invalid-start = Man utz taj ubʼiʼ ri wokaj "{ $name }". Ri bʼiʼaj rajawaxik kachaplebʼex rukʼ jun tzʼibʼ.

## `<answer>` sugar

answer-video-watched-missing-video = Jun tzalijisabʼal rech ubʼanik videoWatched rajawaxik kʼo jun retal video

answer-video-watched-video-not-reference = Jun tzalijisabʼal rech ubʼanik videoWatched rajawaxik kʼo jun retal video ri are jun kʼamalbʼe

answer-name-not-single-text = Ri retal name rech ri tzalijisabʼal rajawaxik kʼo xa jun ral tzʼibʼ

## Referencing another document

external-doenetml-recursion-limit = Man xkowin taj kariqitaj ri DoenetML chirij, rumal kʼi na kamulinem. ¿Kʼo jun setesik kʼamalbʼe?

external-doenetml-unavailable = Man xkowin taj kariqitaj ri DoenetML che { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Man utz taj ri DoenetML xriqitaj che { $attribute }="{ $uri }": man junam taj rukʼ ri ubʼanik wokaj "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ri retal `{ $from }` xkanaj kanoq; chakoj `{ $to }`.
       *[other] [deprecation] Ri retal `{ $from }` pa `<{ $component }>` xkanaj kanoq; chakoj `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ri retal `{ $from }` xkanaj kanoq xuqujeʼ man kakoj taj, rumal `{ $to }` xuqujeʼ yaʼom.
       *[other] [deprecation] Ri retal `{ $from }` pa `<{ $component }>` xkanaj kanoq xuqujeʼ man kakoj taj, rumal `{ $to }` xuqujeʼ yaʼom.
    }

deprecated-attribute-ignored = [deprecation] Ri retal `{ $attribute }` pa `<{ $component }>` xkanaj kanoq xuqujeʼ man kakoj taj.

deprecated-attribute-to-child = [deprecation] Ri retal `{ $attribute }` pa `<{ $component }>` xkanaj kanoq; chakoj jun ral `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Rajil `{ $value }` rech ri retal `{ $attribute }` pa `<{ $component }>` xkanaj kanoq; chakoj `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` xa kakowinik kubʼan kʼi che ri tzij inglés, rumal riʼ ri utzʼibʼ kakanaj jetaq kʼo pa jun wuj tzʼibʼam pa { $locale }. Chatzʼibʼaj ri ubʼanik kʼi at, o chaya rukʼ ri retal `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ri wokaj `<{ $tag }>` man are taj jun wokaj Doenet ri qʼalaj.

schema-element-not-allowed-at-root = Ri wokaj `<{ $tag }>` man yaʼom taj pa ri uxeʼ ri wuj.

schema-element-not-allowed-inside = Ri wokaj `<{ $tag }>` man yaʼom taj chupam `<{ $parent }>`.

schema-attribute-unrecognized = Ri wokaj `<{ $tag }>` maj jun retal ri ubʼiʼ `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ri retal `{ $attribute }` rech ri wokaj `<{ $tag }>` rajawaxik are jun cholaj ri ronojel ral are jun che wa: { $allowed }
       *[other] Ri retal `{ $attribute }` rech ri wokaj `<{ $tag }>` rajawaxik are jun che wa: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Man utz taj ubʼiʼ ubʼanik rech select.  Ri ubʼiʼ ubʼanik { $variantName } kʼo pa { $numOptions } chaʼoj are kʼu ri ajilanik rech kachaʼik are { $numToSelect }.

select-variant-name-without-options = Kʼo jujun ubʼanik yaʼom rech select are kʼu maj chaʼoj yaʼom rech wa ubʼiʼ ubʼanik: { $variantName }.

select-variant-name-not-possible = Ri ubʼiʼ ubʼanik { $variantName } yaʼom rech select man are taj jun ubʼiʼ ubʼanik ri kakowinik.

select-too-few-options = Man kakowin taj kachaʼ { $numToSelect } wokaj xa che { $numOptions }.

select-from-sequence-too-few-values = Man kakowin taj kachaʼ { $numToSelect } rajil che jun cholaj ri unajtiil { $length }.

select-from-sequence-indices-count-mismatch = Ri ajilanik rech indices yaʼom rech select rajawaxik junam rukʼ ri ajilanik rech kachaʼik

select-from-sequence-indices-not-integers = Ronojel ri indices yaʼom rech select rajawaxik are tzʼaqat ajilabʼal

select-from-sequence-index-excluded = Ri index rech selectfromsequence yaʼom xesax bʼi

select-from-sequence-indices-excluded-combination = Ri indices rech selectfromsequence yaʼom are jun riqoj esam bʼi

select-from-sequence-coprime-not-positive-integers = Man kakowin taj kachaʼ riqoj coprime, rumal man kachaʼ taj tzʼaqat ajilabʼal ri man chʼutin taj che 0.

select-from-sequence-coprime-common-factor = Man kakowin taj kachaʼ ajilabʼal coprime. Ronojel rajil ri kakowinik kʼo jun ubʼanoꞌj junam. (Rajil "from" o "to" yaʼom rajawaxik coprime rukʼ "step".)

select-from-sequence-coprime-single-number = Man kakowin taj kachaʼ riqoj coprime che xa jun ajilabʼal ri man are taj 1.

select-from-sequence-excluded-too-many-combinations = Kʼi na che 70% rech ri riqoj xesax bʼi pa selectFromSequence

select-from-sequence-coprime-none-found = Man xkowin taj kachaʼ ajilabʼal coprime. Ronojel rajil ri kakowinik kʼo jun ubʼanoꞌj junam.

select-from-sequence-too-few-unique-values = Man kakowin taj kachaʼ { $numToSelect } rajil utukel che jun cholaj ri unajtiil { $numPossibleValues }

select-prime-numbers-too-few-values = Man kakowin taj kachaʼ { $numToSelect } rajil che jun cholaj rech ajilabʼal primo ri unajtiil { $numValues }

select-prime-numbers-values-count-mismatch = Ri ajilanik rech rajil yaʼom rech select rajawaxik junam rukʼ ri ajilanik rech kachaʼik

select-prime-numbers-values-not-prime = Ronojel rajil yaʼom rech select ajilabʼal primo rajawaxik kʼo pa ri cholaj rech ajilabʼal primo

select-prime-numbers-values-excluded-combination = Rajil rech selectPrimeNumbers yaʼom are jun riqoj esam bʼi

select-prime-numbers-excluded-too-many-combinations = Kʼi na che 70% rech ri riqoj xesax bʼi pa selectPrimeNumbers

select-random-combination-fluke = Rumal jun jastaq ri sibʼalaj man kakowin taj, man xkowin taj kachaʼ jun riqoj rajil chaʼom pa kʼayewal

select-random-value-fluke = Rumal jun jastaq ri sibʼalaj man kakowin taj, man xkowin taj kachaʼ jun rajil chaʼom pa kʼayewal
