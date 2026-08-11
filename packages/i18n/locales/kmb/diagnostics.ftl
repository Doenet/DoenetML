# Kimbundu diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element names, attribute names and attribute values — `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `math`, `text` and the rest —
# are part of the language rather than prose, and stay in English exactly as
# written.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } i xisiwa kyoso jimbandu jyadi ja tumbwa
       *[other] { $attributes } i xisiwa kyoso jimbandu jyadi ja tumbwa
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } i xisiwa kyoso o mbandu ni o kaxaxi ja tumbwa yoso
       *[other] { $attributes } i xisiwa kyoso o mbandu ni o kaxaxi ja tumbwa yoso
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ki i kalakala se o kaxaxi ki kyala ko

## `<line>`

line-points-undetermined-dimensions = Nlonji ya bhita mu jimbanza ji ki tu ijiya o udikota wa jo ko.

line-points-too-few-dimensions = O nlonji ya tokala kubhita mu jimbanza ja kala ni udikota wadi mba wavulu.

line-points-depend-on-variables = O nlonji ya bhita mu jimbanza ja kolela ku isokololwelu: { $variables }.

line-equation-invalid-format = O kifwa kya ikwasau ya nlonji ki kyabhonga ko mu { $variable1 } ni { $variable2 }.

## `<ray>`

ray-overprescribed-through = O mwenyu wa tumbwa ni through, endpoint ni direction.  O through ya tumbwa i xisiwa.

ray-dimension-mismatch = numDimensions ki i sokela mu mwenyu ko.

## `<vector>`

vector-overprescribed-head = O vetoru ya tumbwa ni head, tail ni displacement.  O head ya tumbwa i xisiwa.

vector-dimension-mismatch = numDimensions ki i sokela mu vetoru ko.

## Attracting and constraining

attract-to-without-nearest-point = Ki tu tena kukwata ku `<{ $component }>` mukonda ki kyala ni nearestPoint ko.

constrain-to-without-nearest-point = Ki tu tena kukangela ku `<{ $component }>` mukonda ki kyala ni nearestPoint ko.

constrain-to-interior-without-nearest-point = Ki tu tena kukangela mukwa `<{ $component }>` mukonda ki kyala ni nearestPoint ko.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition i xisiwa mu choiceInput ki yala inline ko

## Ordering children by index

choice-input-indices-count-mismatch = O indices ya tumbwa mu choiceInput i xisiwa mukonda o kitalu kya indices ki kya sokela ni kitalu kya an'a a choice ko.

pretzel-indices-count-mismatch = O indices ya tumbwa mu problem i xisiwa mukonda o kitalu kya indices ki kya sokela ni kitalu kya an'a a problem ko.

shuffle-indices-count-mismatch = O indices ya tumbwa mu shuffle i xisiwa mukonda o kitalu kya indices ki kya sokela ni kitalu kya ima ko.

indices-ignored-out-of-range = O indices ya tumbwa mu { $component } i xisiwa mukonda imoxi yala kanga dya njila.

pretzel-indices-repeated = O indices ya tumbwa mu pretzel i xisiwa mukonda imoxi ya vutuluka.

pretzel-circuit-first-index = O indices ya tumbwa mu pretzel mu mode="circuit" i xisiwa mukonda o index ya dyanga ya tokala kukala 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Phala `<{ $component }>` kukalakala ni an'a a string, o `type` attribute ya tokala kutumbwa.

invalid-type-defaulting-to-math = Type { $type } ki yabhonga ko mu { $component }. Ya tokala kukala math, text, number mba boolean. Tu kalakala ni math.

string-not-valid-component-to-arrange = String "{ $value }" ki kima kyambote ko mu { $component }. Kya xisiwa.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } ki yabhonga ko, o type ya bhakelwa ku number.

invalid-variable-value = Kima kya kisokololwelu ki kyabhonga ko: `{ $value }`

## Variants

variant-index-must-be-number = O kifwa index { $index } kya tokala kukala kitalu

variant-index-must-be-integer = O kifwa index { $index } kya tokala kukala kitalu kyoso

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ki kya bhangelwe mu isokelu yoso ko. O udikota wa bhakelwa ku isokelu ya mukwa.

side-by-side-absolute-margins = `<{ $component }>` ki kya bhangelwe mu isokelu yoso ko. O jimbandu ja bhakelwa ku isokelu ya mukwa.

side-by-side-no-block-child = `<{ $component }>` ki kyabhonga ko: kya tokala kukala ni mona umoxi mba avulu wa block.

## `<label>`

label-for-ignored-on-graphical = O `for` attribute mu `<label>` ya kifika i xisiwa.

label-for-must-resolve-to-one = O `for` attribute mu `<label>` ya tokala kuya ku kima kimoxi ngó.

label-for-unresolved = O `for` attribute mu `<label>` ki ya tenene kuya ku kima ko.

label-for-answer-with-authored-inputs = O `for` attribute mu `<label>` i zwela `<answer>` yala ni inputs ya sonekwa; zwela ku input muene.

label-for-answer-without-input = O `for` attribute mu `<label>` i zwela `<answer>` ki yala ni input ko.

label-for-must-reference-input-or-answer = O `for` attribute mu `<label>` ya tokala kuzwela input mba answer.

## Accessibility

accessibility-short-description-or-decorative = Phala kubhixila, `<{ $component }>` kya tokala kukala ni kijilu kya kufuka mba kutumbwa kála decorative.

accessibility-video-short-description = Phala kubhixila, `<video>` kya tokala kukala ni kijilu kya kufuka.

accessibility-input-short-description-or-label = Phala kubhixila, `<{ $component }>` kya tokala kukala ni kijilu kya kufuka mba dijina.

accessibility-answer-input-short-description-or-label = Phala kubhixila, `<answer>` i bhanga input ya tokala kukala ni kijilu kya kufuka mba dijina.

accessibility-short-description-contains-math = Ijilu ya kufuka ki ya tokala kukala ni ima ya matematika kála `<{ $component }>` ko. Soneka o matematika ni izwelu.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ki yala ni kutepa kwa tokala ko mu izwelu ya mutwe wa kitangana (mode ya kididima) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kwa bhinga { $threshold }:1 mba kwavulu).
       *[other] { $colorName } ki yala ni kutepa kwa tokala ko mu izwelu ya mutwe wa kitangana ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kwa bhinga { $threshold }:1 mba kwavulu).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` ya bhita mu jimbanza { $count } ki ya bhangelwe ko kyoso o jimbanza ki jala ni italu ko.

circle-too-many-through-points = Ki tu tena kusoka kizenge kya bhita mu jimbanza javulu ku 3.

circle-overprescribed-radius-center-points = Ki tu tena kusoka kizenge ni radius, kaxaxi ni jimbanza yoso.

circle-center-with-multiple-points = Ki tu tena kusoka kizenge ni kaxaxi kya bhita mu kimbanza kyavulu ku 1.

circle-radius-too-small = Ki tu tena kusoka o kizenge: mukonda o kididi kaxaxi ka jimbanza jyadi kyala { $distance }, o radius { $radius } ya tumbwa yala mutetuka kyavulu.

circle-radius-with-many-points = Ki tu tena kubhanga kizenge kya bhita mu jimbanza javulu ku jyadi ni radius ya tumbwa.

circle-invalid-center-or-through-points = O kaxaxi mba o jimbanza ja kizenge ki jabhonga ko.

circle-radius-center-with-multiple-points = Ki tu tena kusoka o radius ya kizenge ni kaxaxi kya bhita mu kimbanza kyavulu ku 1.

circle-change-radius-non-numerical = Ki tu tena kusokolola o radius ya kizenge ni jimbanza ki jala ni italu ko

circle-radius-with-points-non-numerical = Ki tu tena kubhanga kizenge kya bhita mu kimbanza kyavulu ku kimoxi ni radius kyoso o italu ki yala ko.

circle-change-center-non-numerical = O kusokolola o kaxaxi ka kizenge kya bhita mu jimbanza ki jala ni italu ko ki kya bhangelwe ko.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] O udikota ki wa tokala ko mu domain ya funsau. O domain yala ni kitembu { $intervals } maji o funsau yala ni { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        }.
       *[other] O udikota ki wa tokala ko mu domain ya funsau. O domain yala ni itembu { $intervals } maji o funsau yala ni { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        }.
    }

function-domain-invalid-format = O kifwa kya domain ya funsau ki kyabhonga ko.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Tu xisa o udikota wa funsau ki wala ni kitalu ko.
        [minimum] Tu xisa o utetuka wa funsau ki wala ni kitalu ko.
        [extremum] Tu xisa o mbandu ya funsau ki yala ni kitalu ko.
        [point] Tu xisa o kimbanza kya funsau ki kyala ni kitalu ko.
        [slope] Tu xisa o kubhinda kwa funsau ki kwala ni kitalu ko.
       *[other] Tu xisa o { $type } ya funsau ki yala ni kitalu ko.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Tu xisa o udikota wa funsau ki wala ni kima ko.
        [minimum] Tu xisa o utetuka wa funsau ki wala ni kima ko.
        [extremum] Tu xisa o mbandu ya funsau ki yala ni kima ko.
        [point] Tu xisa o kimbanza kya funsau ki kyala ni kima ko.
       *[other] Tu xisa o { $type } ya funsau ki yala ni kima ko.
    }

function-points-too-close = O funsau yala ni jimbanza jyadi ja kala kubhixila kyavulu. Ki tu tena kujijila o funsau.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] O kuvutuluka kwa funsau ku tena ngó se o kitalu kya inputs kya sokela ni kitalu kya outputs. O funsau yiyi yala ni input { $inputs } ni { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        }.
       *[other] O kuvutuluka kwa funsau ku tena ngó se o kitalu kya inputs kya sokela ni kitalu kya outputs. O funsau yiyi yala ni inputs { $inputs } ni { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = O ulephu wa sequence ki wabhonga ko.  Wa tokala kukala kitalu kyoso ki kyala boxi dya ziro ko.

sequence-invalid-step = O step ya sequence ki yabhonga ko.  Ya tokala kukala kitalu mu sequence ya type { $type }.

sequence-invalid-endpoint-number = O "{ $attribute }" ya sequence ya number ki yabhonga ko.  Ya tokala kukala kitalu.

sequence-invalid-endpoint-letters = O "{ $attribute }" ya sequence ya letters ki yabhonga ko.  Ya tokala kukala kibhungu kya jisonekenu.

sequence-invalid-endpoint = O "{ $attribute }" ya sequence ki yabhonga ko.

select-from-sequence-coprime-not-numbers = coprime i xisiwa mukonda ki tu sola italu ko

select-from-sequence-coprime-with-exclude-combinations = coprime i xisiwa mukonda excludeCombinations ya tumbwa

## Resolving a `target`

target-not-found = O target ya `<{ $source }>` ki yabhonga ko: ki tu tena kusanga o target.

target-state-variable-not-found = O target ya `<{ $source }>` ki yabhonga ko: ki tu tena kusanga o kisokololwelu kya dijina "{ $property }" mu `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = O isokololwelu ya `<odeSystem>` ya tokala kutepa ni kisokololwelu kya muene.

ode-system-duplicate-variable-names = Ki tu tena kujijila o funsau ja ODE RHS ni majina ma isokololwelu ma vutuluka.

ode-system-rhs-function-error = Ki tu tena kujijila o funsau ya ODE RHS.  Kibhengelu mu kubhanga o funsau ya mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ki tu tena kujijila o kanku kaxaxi ka jinlonji { $count }

angle-invalid-through-point = O kimbanza ki kyabhonga ko mu through ya `<angle>`

parabola-vertex-too-many-points = Parabola ni vertex ya bhita mu kimbanza kyavulu ku 1 ki ya bhangelwe ko.

parabola-too-many-points = Parabola ya bhita mu jimbanza javulu ku 3 ki ya bhangelwe ko.

intersection-too-many-items = O kudibhixila kwa ima yavulu ku yyadi ki kwa bhangelwe ko

## Other math components

ionic-compound-not-two-ions = O kibhungu kya ioni mu ima ya mukwa ki yala jioni jyadi ko ki kya bhangelwe ko.

ionic-compound-needs-cation-and-anion = O kibhungu kya ioni kya bhangelwa ngó mu katiau kamoxi ni aniau imoxi.

solve-equations-cannot-evaluate = Ki tu tena kusokolola o ikwasau mukonda ki tu tena kwi soka ko: { $equation }

math-operators-operand-number-required = O operandNumber ya tokala kutumbwa kyoso tu katula o operand ya matematika.

eigen-decomposition-failed = Ki tu tenene kusoka o jieigenvalue ja matrisi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: o parameter { $parameters } ki yala mu kifwa ko, kienyi i sokela ngó ni kima ki kyala ko.
       *[other] `<matchesPattern>`: o parameters { $parameters } ki yala mu kifwa ko, kienyi i sokela ngó ni kima ki kyala ko.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ki tu tena kwijiya grid="{ $grid }". Ya tokala kukala none, medium, dense, mba italu yyadi ya dikota ya tepwa ni kididi, kála grid="1 0.5". Ki tu bhanga grid ko.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ki i kalakala mu mulondekesi prefigure ko; tu kalakala ni mbandu ya kudilu.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ki i kalakala mu mulondekesi prefigure ko; tu kalakala ni mbandu ya bhulu.

prefigure-invalid-axis-bounds = `<graph>`: o jimbandu ja aksi ki jabhonga ko mu prefigure; tu kalakala ni bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: o udikota ki wabhonga ko mu prefigure; tu kalakala ni udikota 425.

prefigure-invalid-aspect-ratio = `<graph>`: o aspectRatio ki yabhonga ko mu prefigure; tu kalakala ni aspektu rasyu 1.

prefigure-grid-spacing-too-fine = `<graph>`: o kididi kya grid kyala kitetuka kyavulu mu jimbandu ja aksi; o grid i katulwa mu mulondekesi prefigure.

prefigure-annotations-not-rendered = `<graph>`: o annotations ki i londekeswa ko se ki tu kalakala ni mulondekesi PreFigure.

multiple-annotations-children = Kwa sangwa an'a avulu a `<annotations>` mu `<graph>`; oso a xisiwa maji o wa sukina.

## Referring to other components

copy-unrecognized-component-type = Ki tu tena kubhakela mba kusokolola o kifwa kya kima ki tu ijiya ko: { $type }.

copy-prop-not-found = Ki tu tenene kusanga o prop { $property } mu kima kya kifwa { $component }

collect-no-source = Ki kwa sangelwe o ditangi dya collect ko.

collect-invalid-component-type = Ki tu tena kubhungula o ima ya kifwa `<{ $component }>` mukonda o kifwa ki kyabhonga ko.

reference-index-unavailable = Ki tu tena kuzwela o index `{ $reference }`

## `<callAction>`

component-action-unavailable = Ki tu tena kwixana { $action } mu kima `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = O kifwa kya ijimbwete ki kyabhonga ko.  O jinlonji jala ni ulephu wa tepa. Kwa sangwa mu componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = O ijimbwete yala ni majina ma koluna ma vutuluka.  Kwa sangwa mu componentIdx :{ $componentIdx }

data-frame-missing-column-name = O ijimbwete ki yala ni dijina dya koluna ko.  Kwa sangwa mu componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = O award ya kitambwijilu kiki i kolela ku kitambwijilu kya answer tag muene, kienyi ki bhekela ima ki tu kingile ko.

answer-max-num-attempts-in-section-wide-check-work = Se u bhaka `maxNumAttempts` mu `<answer>` yala mukwa kima kyala ni `sectionWideCheckWork`, ki i kalakala ko, mukonda o kima kyene ki tala o kitalu kya ilongelu. Bhaka `maxNumAttempts` mu kima kyene.

nested-section-wide-check-work-max-num-attempts = Se u bhaka `maxNumAttempts` mu kima kyala ni `sectionWideCheckWork` kyala mukwa kima kya mukwa kyala ni `sectionWideCheckWork`, ki i kalakala ko, mukonda o kima kya kanga ki tala o kitalu kya ilongelu. Bhaka `maxNumAttempts` mu kima kya kanga.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] O { $attributes } attribute ki i kalakala se symbolicEquality ki ya bhakelwe ko.
       *[other] O { $attributes } attributes ki i kalakala se symbolicEquality ki ya bhakelwe ko.
    }

answer-invalid-type = O type ya kitambwijilu ki yabhonga ko: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Mukonda o kima `<{ $component }>` ki kyala ni dijina ko, ki tu tena kwi kalakalesa kála module attribute

module-attribute-name-already-defined = Ki tu tena kukalakalesa o kima `<{ $component } name="{ $name }">` kála attribute ya module mukonda `<module>` yala kya ni "{ $name }" attribute.

conditional-content-condition-ignored = O `condition` attribute i xisiwa mu `<conditionalContent>` yala ni an'a a case mba else.

slider-markers-type-mismatch = O type ya markers ki i sokela ni type ya slider ko.

pretzel-problem-needs-statement-and-answer = O pretzel ki yabhonga ko: `<problem>` yoso ya tokala kukala ni `<statement>` yimoxi ni `<answer>` yimoxi.

pretzel-circuit-first-problem-distractor = O pretzel ki yabhonga ko: mu mode="circuit", o `<problem>` ya dyanga ki i tena kukala distractor ko.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] O kima { $values } ki kyabhonga ko mu attribute `{ $attribute }`; kya xisiwa.
       *[other] O ima { $values } ki yabhonga ko mu attribute `{ $attribute }`; ya xisiwa.
    }

attribute-must-be-references = O kima `{ $value }` ki kyabhonga ko mu attribute `{ $attribute }`. O attribute ya tokala kukala izwelu i matekesa ni `$`.

math-input-invalid-function-names = <mathInput>: majina ma funsau ki mabhonga ko ma xisiwa mu { $attribute }: { $names }. Dijina dyoso o kitangana kya kulondekesa kya tokala kukala ni jisonekenu jyadi mba javulu (jisonekenu mba jimbandu); `|<mathspeak alternative>` i tena kukayela.

## Building components from the source

component-type-invalid = O kifwa kya kima ki kyabhonga ko: `<{ $componentType }>`

attribute-repeated = Ki tu tena kuvutulula o attribute { $attribute }.

attribute-invalid-for-component = O attribute "{ $attribute }" ki yabhonga ko mu kima kya kifwa `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    O kijilu kya kifwa { $styleNumber } ki kyala ni kutepa kwa tokala ko mu { $context ->
        [text-on-background] o mbeji ya izwelu ku mbeji ya kunima
        [high-contrast] o mbeji ya kutepa kwa dikota ku kanvasi
        [line] o mbeji ya nlonji ku kanvasi
        [marker] o mbeji ya kimbanza ku kanvasi
       *[text-on-canvas] o mbeji ya izwelu ku kanvasi
    }{ $mode ->
        [dark] { " (mode ya kididima)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kwa bhinga { $threshold }:1 mba kwavulu).

style-definition-dark-mode-text-background-contrast =
    Sumbala o kijilu kya kifwa { $styleNumber } kyala ni jimbeji jala ni kutepa kwa tokala mu mode ya kyeleka, o jimbeji ja mode ya kididima ja tundu mu jo ki jala ni kutepa kwa tokala ko kaxaxi ka mbeji ya izwelu ni mbeji ya kunima ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kwa bhinga { $threshold }:1 mba kwavulu). { $suggestion ->
        [available] Phala kukala ni kutepa kwa tokala mu mode ya kididima, bhakela o kutepa kwa mode ya kyeleka (kála, bhaka { $lightAttribute }="{ $lightColor }") mba sokolola o mbeji ya mode ya kididima (kála, bhaka { $darkAttribute }="{ $darkColor }").
       *[none] Phala kukala ni kutepa kwa tokala mu mode ya kididima, bhakela o kutepa kwa mode ya kyeleka mba sokolola o jimbeji ni textColorDarkMode mba backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Sumbala o kijilu kya kifwa { $styleNumber } kyala ni mbeji ya izwelu yala ni kutepa kwa tokala mu mode ya kyeleka, o mbeji ya izwelu ya mode ya kididima ya tundu mu yo ki yala ni kutepa kwa tokala ko ku kanvasi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kwa bhinga { $threshold }:1 mba kwavulu). { $suggestion ->
        [available] Phala kukala ni kutepa kwa tokala mu mode ya kididima, bhakela o kutepa kwa mode ya kyeleka (kála, bhaka textColor="{ $lightColor }") mba sokolola o mbeji ya mode ya kididima (kála, bhaka textColorDarkMode="{ $darkColor }").
       *[none] Phala kukala ni kutepa kwa tokala mu mode ya kididima, bhakela o kutepa kwa mode ya kyeleka mba sokolola o mbeji ni textColorDarkMode.
    }

section-multiple-style-palettes = O kitangana ki tena kusola ngó <stylePalette> yimoxi; tu kalakala ni ya sukina.

## Unique variants

variant-num-to-select-not-non-negative-integer = ki tu tena kwijiya o ifwa ya tepa ya { $component } mukonda numToSelect ki kitalu kyoso ki kyala boxi dya ziro ko.

variant-num-to-select-not-constant-number = ki tu tena kwijiya o ifwa ya tepa ya { $component } mukonda numToSelect ki kitalu ki ki sokolola ko.

variant-with-replacement-not-constant-boolean = ki tu tena kwijiya o ifwa ya tepa ya { $component } mukonda withReplacement ki boolean ki i sokolola ko.

variant-select-weight-disables-unique = O ifwa ya tepa ya select i jikwa se o option yimoxi yala ni selectWeight mba selectForVariants

variant-coprime-undetermined = ki tu tena kwijiya o ifwa ya tepa ya { $component } mukonda ki tu tena kwijiya se coprime yala makutu ithangana yoso ko.

variant-attribute-not-constant = ki tu tena kwijiya o ifwa ya tepa ya { $component } mukonda { $attribute } i sokolola.

variant-attribute-not-number = ki tu tena kwijiya o ifwa ya tepa ya { $component } mukonda { $attribute } ki kitalu ko.

variant-attribute-wrong-type-for-sequence =
    ki tu tena kwijiya o ifwa ya tepa ya { $component } ya type { $type } mukonda { $attribute } ki { $expected ->
        [letters-combination] kibhungu kya jisonekenu
        [math-expression] kizwelu kya matematika kyabhonga
        [integer] kitalu kyoso
       *[number] kitalu
    } ko.

variant-length-not-integer = ki tu tena kwijiya o ifwa ya tepa ya { $component } mukonda length ki kitalu kyoso ko.

variant-sort-not-implemented = o ifwa ya tepa ya { $component } ni sort ki ya bhangelwe ko

variant-exclude-combinations-not-implemented = o ifwa ya tepa ya { $component } ni excludeCombinations ki ya bhangelwe ko

variant-math-exclude-not-implemented = o ifwa ya tepa ya { $component } ya type math ni exclude ki ya bhangelwe ko

variant-non-constant-exclude-not-implemented = o ifwa ya tepa ya { $component } ni exclude i sokolola ki ya bhangelwe ko

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ki i kalakala mu mulondekesi prefigure wa graph ko; o mona wa xisiwa.

prefigure-descendant-invalid-geometry = { $subject }: o jiometria ki yabhonga ko mba ki ya zwe ko; o mona wa xisiwa.

prefigure-curve-label-omitted = { $subject }: o majina ki ma kalakala mu ima ya curve ya sokololwa ko; o dijina dya katulwa.

prefigure-curve-unsupported-definition-type = { $subject }: o kifwa kya kijilu kya funsau ya curve '{ $definitionType }' ki i kalakala ko; o mona wa xisiwa.

prefigure-region-flip-functions-unsupported = { $subject }: o flipFunctions attribute mu regionBetweenCurves ki i kalakala ko; o mona wa xisiwa.

prefigure-region-non-formula-child = { $subject }: an'a a funsau ya kifwa formula ngó a kalakala mu regionBetweenCurves; o mona wa xisiwa.

prefigure-label-position-unsupported =
    { $subject }: o labelPosition '{ $labelPosition }' ki i kalakala ko mu { $labelKind ->
        [line-family] dijina dya muxi wa jinlonji
       *[point] dijina dya kimbanza
    }; tu kalakala ni kisokelu kya PreFigure.

prefigure-fill-style-unsupported = { $subject }: PreFigure ki i ijiya o kifwa kya kuizala '{ $fillStyle }' ko; tu kalakala ni kuizala kwoso.

prefigure-line-style-unknown = { $subject }: o kifwa kya nlonji '{ $lineStyle }' ki tu kyijiya ko, kienyi kya katulwa mu PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: o kifwa kya kimbanza '{ $markerStyle }' kya sokololwa ku kifwa 'diamond' kya PreFigure.

prefigure-marker-style-unsupported = { $subject }: PreFigure ki i ijiya o kifwa kya kimbanza '{ $markerStyle }' ko; tu kalakala ni kifwa kyala dyanga.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: o `ref` ki yabhonga ko; ki tu tena kusanga o target. O annotation ya katulwa.

annotation-ref-multiple-targets = `<annotation>`: o `ref` ya sanga jitarjeti javulu; tu kalakala ni ya dyanga.

annotation-ref-outside-graph = `<annotation>`: o `ref` ki yabhonga ko; o target yala kanga dya graph. O annotation ya katulwa.

annotation-ref-unsupported-target = `<annotation>`: o `ref` ki yabhonga ko; o target ki kima kya kifika ki prefigure i ijiya ko. O annotation ya katulwa.

annotation-text-missing = `<annotation>`: o `text` ki yala ko mba ki yala ni kima ko; tu soneka izwelu ki yala ni kima ko.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kwa sangwa o kukolela kwa kizenge.
       *[other] Kwa sangwa o kukolela kwa kizenge ni kima `<{ $componentType }>`.
    }

reference-no-referent = Ki kwa sangelwe kima ko mu kizwelu: `{ $reference }`

reference-multiple-referents = Kwa sangwa ima yavulu mu kizwelu: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = O kifwa kya attribute { $attribute } ya `<{ $componentType }>` ki kyabhonga ko.

children-invalid = O an'a a `<{ $componentType }>` ki abhonga ko: Kwa sangwa an'a ki abhonga ko: { $children }

## Falling back to a default

attribute-value-invalid-using-default = O kima `{ $value }` ki kyabhonga ko mu attribute `{ $attribute }`, tu kalakala ni `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ki kwa sangelwe o kifwa kya DoenetML { $version } ko.
       *[other] Ki kwa sangelwe o kifwa kya DoenetML { $version } ko. Tu kalakala ni kifwa { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ki yabhonga ko: { $content }

parse-tag-missing-close-tag = DoenetML ki yabhonga ko: O tag `{ $tag }` ki yala ni tag ya kujika ko. Tu kingile tag i dijika muene mba tag `</{ $tagName }>`.

parse-tag-error = DoenetML ki yabhonga ko: Kibhengelu mu tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ki yabhonga ko: O attribute `{ $attribute }` ki yabhonga ko, i moneka kála ki yala ni kima ko.

parse-attribute-invalid = DoenetML ki yabhonga ko: O attribute `{ $attribute }` ki yabhonga ko

parse-attribute-value-invalid = DoenetML ki yabhonga ko: O kima kya attribute `{ $value }` ki kyabhonga ko

parse-attribute-value-quote-mismatch = DoenetML ki yabhonga ko: O kima kya attribute `{ $value }` ki kyabhonga ko. O jimbanza ja kuzwela ki ja sokela ko. I moneka kála `{ $quote }` ki yala ko

parse-open-tag-name-missing = DoenetML ki yabhonga ko: Kwa sangwa tag ki yala ni dijina ko, kála `<`

parse-tag-not-closed = DoenetML ki yabhonga ko: O tag `{ $tag }` ki ya jikilwe ko (i moneka kála `>` ki yala ko).

parse-self-closing-tag-name-missing = DoenetML ki yabhonga ko: Kwa sangwa tag ki yala ni dijina ko `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ki yabhonga ko: O tag `{ $tag }` ki ya jikilwe ko (i moneka kála `/>` ki yala ko).

parse-tag-invalid-attributes = DoenetML ki yabhonga ko: O tag `{ $tag }` ki yabhonga ko. I tena kukala ni attributes ki yabhonga ko.

parse-close-tag-name-missing = DoenetML ki yabhonga ko: Kwa sangwa tag ya kujika ki yala ni dijina ko, kála `</`

parse-attribute-value-unquoted = O ima ya attribute ya tokala kukala mukwa jimbanza ja kuzwela: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ki yabhonga ko: Kwa sangwa tag ya kujika `{ $tag }`, maji o tag ya kujikula ki yala ko

parse-close-tag-mismatched = DoenetML ki yabhonga ko: O tag ya kujika ki i sokela ko. Tu kingile `</{ $expected }>`. Kwa sangwa `{ $found }`

parser-node-unconvertible = Ki tu tena kusokolola o node { $node } ku node ya Dast.

## Names

name-attribute-invalid =
    O dijina name='{ $name }' ki dyabhonga ko. { $reason ->
        [characters] O majina ma tena kukala ngó ni jisonekenu, italu, jimbandu ja boxi mba jimbandu.
       *[start] O majina ma tokala kumatekesa ni disonekenu.
    }

component-name-invalid-start = O dijina dya kima "{ $name }" ki dyabhonga ko. O majina ma tokala kumatekesa ni disonekenu.

## `<answer>` sugar

answer-video-watched-missing-video = O answer ya type videoWatched ya tokala kukala ni video attribute

answer-video-watched-video-not-reference = O answer ya type videoWatched ya tokala kukala ni video attribute yala kizwelu

answer-name-not-single-text = O answer name attribute ya tokala kukala ni mona umoxi ngó wa text

## Referencing another document

external-doenetml-recursion-limit = Ki tu tenene kusanga o DoenetML ya kanga mukonda o kuvutuluka kwavulu. O kizwelu kya kizenge kyala?

external-doenetml-unavailable = Ki tu tenene kusanga o DoenetML mu { $attribute }="{ $uri }"

external-doenetml-type-mismatch = O DoenetML ya sangwa mu { $attribute }="{ $uri }" ki yabhonga ko: ki i sokela ni kifwa kya kima "{ $componentType }" ko

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] O attribute `{ $from }` ya kukuluka; kalakalesa `{ $to }`.
       *[other] [deprecation] O attribute `{ $from }` mu `<{ $component }>` ya kukuluka; kalakalesa `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] O attribute `{ $from }` ya kukuluka kienyi ya xisiwa mukonda `{ $to }` yala wó.
       *[other] [deprecation] O attribute `{ $from }` mu `<{ $component }>` ya kukuluka kienyi ya xisiwa mukonda `{ $to }` yala wó.
    }

deprecated-attribute-ignored = [deprecation] O attribute `{ $attribute }` mu `<{ $component }>` ya kukuluka kienyi ya xisiwa.

deprecated-attribute-to-child = [deprecation] O attribute `{ $attribute }` mu `<{ $component }>` ya kukuluka; kalakalesa o mona `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] O kima `{ $value }` kya attribute `{ $attribute }` mu `<{ $component }>` kya kukuluka; kalakalesa `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` i tena ngó kubhanga o Ingelezu yavulu, kienyi o izwelu ya i xisa kála wa i soneka mu divulu dya sonekwa mu { $locale }. Soneka o kifwa kyavulu muene, mba ki bhaka ni `pluralForm` attribute.


## Checking against the schema

schema-element-unrecognized = O kima `<{ $tag }>` ki kima kya Doenet tu ijiya ko.

schema-element-not-allowed-at-root = O kima `<{ $tag }>` ki kya tanwa ko ku bhulu dya divulu.

schema-element-not-allowed-inside = O kima `<{ $tag }>` ki kya tanwa ko mukwa `<{ $parent }>`.

schema-attribute-unrecognized = O kima `<{ $tag }>` ki kyala ni attribute ya dijina `{ $attribute }` ko.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] O attribute `{ $attribute }` ya kima `<{ $tag }>` ya tokala kukala kilundu kyala ni ima yoso yala kimoxi mu: { $allowed }
       *[other] O attribute `{ $attribute }` ya kima `<{ $tag }>` ya tokala kukala kimoxi mu: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = O dijina dya kifwa dya select ki dyabhonga ko.  O dijina dya kifwa { $variantName } di moneka mu options { $numOptions } maji o kitalu kya kusola kyala { $numToSelect }.

select-variant-name-without-options = Ifwa imoxi ya tumbwa mu select maji ki kwa tumbwile options mu dijina dya kifwa di tena kukala: { $variantName }.

select-variant-name-not-possible = O dijina dya kifwa { $variantName } dya tumbwa mu select ki dijina dya kifwa di tena kukala ko.

select-too-few-options = Ki tu tena kusola ima { $numToSelect } mu { $numOptions } ngó.

select-from-sequence-too-few-values = Ki tu tena kusola ima { $numToSelect } mu sequence ya ulephu { $length }.

select-from-sequence-indices-count-mismatch = O kitalu kya indices ya tumbwa mu select kya tokala kusokela ni kitalu kya kusola

select-from-sequence-indices-not-integers = O indices yoso ya tumbwa mu select ya tokala kukala italu yoso

select-from-sequence-index-excluded = Kwa tumbwa index ya selectfromsequence ya katulwa

select-from-sequence-indices-excluded-combination = Kwa tumbwa indices ya selectfromsequence yala kibhungu kya katulwa

select-from-sequence-coprime-not-positive-integers = Ki tu tena kusola ibhungu ya coprime mukonda ki tu sola italu yoso yala bhulu dya ziro ko.

select-from-sequence-coprime-common-factor = Ki tu tena kusola italu ya coprime. O ima yoso i tena yala ni fatoru yimoxi. (O ima ya tumbwa ya "from" mba "to" ya tokala kukala coprime ni "step".)

select-from-sequence-coprime-single-number = Ki tu tena kusola ibhungu ya coprime mu kitalu kimoxi ki kyala 1 ko.

select-from-sequence-excluded-too-many-combinations = Kwa katulwa ibhungu yavulu ku 70% mu selectFromSequence

select-from-sequence-coprime-none-found = Ki tu tenene kusola italu ya coprime. O ima yoso i tena yala ni fatoru yimoxi.

select-from-sequence-too-few-unique-values = Ki tu tena kusola ima ya tepa { $numToSelect } mu sequence ya ulephu { $numPossibleValues }

select-prime-numbers-too-few-values = Ki tu tena kusola ima { $numToSelect } mu kilundu kya italu ya prime kya ulephu { $numValues }

select-prime-numbers-values-count-mismatch = O kitalu kya ima ya tumbwa mu select kya tokala kusokela ni kitalu kya kusola

select-prime-numbers-values-not-prime = O ima yoso ya tumbwa mu select prime number ya tokala kukala mu kilundu kya italu ya prime

select-prime-numbers-values-excluded-combination = O ima ya tumbwa ya selectPrimeNumbers yala kibhungu kya katulwa

select-prime-numbers-excluded-too-many-combinations = Kwa katulwa ibhungu yavulu ku 70% mu selectPrimeNumbers

select-random-combination-fluke = Ni kima ki tu kingile ko, ki tu tenene kusola o kibhungu kya ima ya kuyapula

select-random-value-fluke = Ni kima ki tu kingile ko, ki tu tenene kusola o kima kya kuyapula
