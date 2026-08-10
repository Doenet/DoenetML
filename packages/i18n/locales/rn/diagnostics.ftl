# Rundi diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`
# and the rest — are part of the language rather than prose, and stay in
# English exactly as written. So does the `[deprecation]` marker.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } irirengagizwa igihe utudomo tubiri tw'impera twashizweho
       *[other] { $attributes } birirengagizwa igihe utudomo tubiri tw'impera twashizweho
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } irirengagizwa igihe akadomo k'impera n'ak'hagati vyompi vyashizweho
       *[other] { $attributes } birirengagizwa igihe akadomo k'impera n'ak'hagati vyompi vyashizweho
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nta co ikora ata kadomo ko hagati

## `<line>`

line-points-undetermined-dimensions = Umurongo uca mu tudomo tw'ubugari butazwi.

line-points-too-few-dimensions = Umurongo utegerezwa guca mu tudomo tw'ubugari nibura bubiri.

line-points-depend-on-variables = Umurongo uca mu tudomo dushingiye ku bihinduka: { $variables }.

line-equation-invalid-format = Imero itari yo y'ingingano y'umurongo mu bihinduka { $variable1 } na { $variable2 }.

## `<ray>`

ray-overprescribed-through = Umurasire ushinzwe na through, endpoint na direction.  Turirengagije through yashizweho.

ray-dimension-mismatch = numDimensions ntihuye mu murasire.

## `<vector>`

vector-overprescribed-head = Vegiteri ishinzwe na head, tail na displacement.  Turirengagije head yashizweho.

vector-dimension-mismatch = numDimensions ntihuye muri vegiteri.

## Attracting and constraining

attract-to-without-nearest-point = Ntibishoboka gukwega kuri `<{ $component }>` kuko idafise ikiranga nearestPoint.

constrain-to-without-nearest-point = Ntibishoboka guhagarika kuri `<{ $component }>` kuko idafise ikiranga nearestPoint.

constrain-to-interior-without-nearest-point = Ntibishoboka guhagarika mu mutima wa `<{ $component }>` kuko idafise ikiranga nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition irirengagizwa kuri choiceInput itari mu murongo

## Ordering children by index

choice-input-indices-count-mismatch = Turirengagije indices zashizweho kuri choiceInput kuko igitigiri c'indices kidahuye n'igitigiri c'abana ba choice.

pretzel-indices-count-mismatch = Turirengagije indices zashizweho kuri problem kuko igitigiri c'indices kidahuye n'igitigiri c'abana ba problem.

shuffle-indices-count-mismatch = Turirengagije indices zashizweho kuri shuffle kuko igitigiri c'indices kidahuye n'igitigiri c'ibice.

indices-ignored-out-of-range = Turirengagije indices zashizweho kuri { $component } kuko zimwe zisohotse mu rugero.

pretzel-indices-repeated = Turirengagije indices zashizweho kuri pretzel kuko zimwe zisubiriwemwo.

pretzel-circuit-first-index = Turirengagije indices zashizweho kuri pretzel muri mode="circuit" kuko iya mbere itegerezwa kuba 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Kugira `<{ $component }>` ikorane n'abana b'imvugo, ikiranga `type` gitegerezwa gushirwaho.

invalid-type-defaulting-to-math = Ubwoko { $type } butari bwo kuri { $component }. Butegerezwa kuba math, text, number canke boolean. Turasubiye kuri math.

string-not-valid-component-to-arrange = Imvugo "{ $value }" si igice gishoboka kuri { $component }. Turayirengagije.

## Types and variables

invalid-type-defaulting-to-number = Ubwoko { $type } butari bwo, turashize ubwoko kuri number.

invalid-variable-value = Agaciro k'igihinduka katari ko: `{ $value }`

## Variants

variant-index-must-be-number = Indangahantu y'ubwoko { $index } itegerezwa kuba inomero

variant-index-must-be-integer = Indangahantu y'ubwoko { $index } itegerezwa kuba inomero yuzuye

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ntiyakozwe ku bipimo bitagenda. Turashize ubugari ku bugereranywa.

side-by-side-absolute-margins = `<{ $component }>` ntiyakozwe ku bipimo bitagenda. Turashize impera ku bugereranywa.

side-by-side-no-block-child = `<{ $component }>` itari yo: itegerezwa kugira nibura umwana umwe w'igihimba.

## `<label>`

label-for-ignored-on-graphical = Ikiranga `for` kuri `<label>` y'igishushanyo kirirengagizwa.

label-for-must-resolve-to-one = Ikiranga `for` kuri `<label>` gitegerezwa kwerekana igice kimwe gusa.

label-for-unresolved = Ikiranga `for` kuri `<label>` ntikishoboye kwerekana igice.

label-for-answer-with-authored-inputs = Ikiranga `for` kuri `<label>` cerekana `<answer>` ifise inzinjizo zanditswe n'umwanditsi; erekana inzinjizo ubwayo.

label-for-answer-without-input = Ikiranga `for` kuri `<label>` cerekana `<answer>` idafise inzinjizo yo kwita izina.

label-for-must-reference-input-or-answer = Ikiranga `for` kuri `<label>` gitegerezwa kwerekana inzinjizo canke inyishu.

## Accessibility

accessibility-short-description-or-decorative = Ku bw'ukugerwako, `<{ $component }>` itegerezwa kugira insobanuro ngufi canke gushirwa nk'urusharize.

accessibility-video-short-description = Ku bw'ukugerwako, `<video>` itegerezwa kugira insobanuro ngufi.

accessibility-input-short-description-or-label = Ku bw'ukugerwako, `<{ $component }>` itegerezwa kugira insobanuro ngufi canke izina.

accessibility-answer-input-short-description-or-label = Ku bw'ukugerwako, `<answer>` irema inzinjizo itegerezwa kugira insobanuro ngufi canke izina.

accessibility-short-description-contains-math = Insobanuro ngufi ntizikwiye kugira ibice vy'imibare nka `<{ $component }>`. Andika imibare yose mu majambo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ntifise ugutandukana guhagije ku majambo y'umutwe w'igika (mu mwijima) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bisaba nibura { $threshold }:1).
       *[other] { $colorName } ntifise ugutandukana guhagije ku majambo y'umutwe w'igika ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bisaba nibura { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Ntitwarakora `<circle>` iciye mu tudomo { $count } igihe utudomo tudafise agaciro k'inomero.

circle-too-many-through-points = Ntibishoboka kubara uruziga ruciye mu tudomo turenga 3.

circle-overprescribed-radius-center-points = Ntibishoboka kubara uruziga rufise radiyusi, ikibanza co hagati n'utudomo vyose vyashizweho.

circle-center-with-multiple-points = Ntibishoboka kubara uruziga rufise ikibanza co hagati ruca mu kadomo karenga 1.

circle-radius-too-small = Ntibishoboka kubara uruziga: kubera ko intera hagati y'utudomo tubiri ari { $distance }, radiyusi { $radius } yashizweho ni ntoya cane.

circle-radius-with-many-points = Ntibishoboka kurema uruziga ruca mu tudomo turenga tubiri rufise radiyusi yashizweho.

circle-invalid-center-or-through-points = Ikibanza co hagati canke utudomo tw'uruziga ntivyo.

circle-radius-center-with-multiple-points = Ntibishoboka kubara radiyusi y'uruziga rufise ikibanza co hagati ruca mu kadomo karenga 1.

circle-change-radius-non-numerical = Ntibishoboka guhindura radiyusi y'uruziga rufise utudomo tudafise inomero

circle-radius-with-points-non-numerical = Ntibishoboka kurema uruziga ruca mu kadomo karenga kamwe rufise radiyusi yashizweho igihe ata gaciro k'inomero kariho.

circle-change-center-non-numerical = Ntitwarakora guhindura ikibanza co hagati c'uruziga ruca mu tudomo tudafise inomero.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ubugari ntibuhagije ku cibare ca fonksiyo. Icibare gifise ikiringo { $intervals } mugabo fonksiyo ifise { $inputs ->
            [one] inzinjizo { $inputs }
           *[other] inzinjizo { $inputs }
        }.
       *[other] Ubugari ntibuhagije ku cibare ca fonksiyo. Icibare gifise ibiringo { $intervals } mugabo fonksiyo ifise { $inputs ->
            [one] inzinjizo { $inputs }
           *[other] inzinjizo { $inputs }
        }.
    }

function-domain-invalid-format = Imero itari yo y'icibare ca fonksiyo.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Turirengagije ubuhanuro budafise inomero bwa fonksiyo.
        [minimum] Turirengagije ubugufi budafise inomero bwa fonksiyo.
        [extremum] Turirengagije impera idafise inomero ya fonksiyo.
        [point] Turirengagije akadomo kadafise inomero ka fonksiyo.
        [slope] Turirengagije ubuherereze budafise inomero bwa fonksiyo.
       *[other] Turirengagije { $type } idafise inomero ya fonksiyo.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Turirengagije ubuhanuro bw'ubusa bwa fonksiyo.
        [minimum] Turirengagije ubugufi bw'ubusa bwa fonksiyo.
        [extremum] Turirengagije impera y'ubusa ya fonksiyo.
        [point] Turirengagije akadomo k'ubusa ka fonksiyo.
       *[other] Turirengagije { $type } y'ubusa ya fonksiyo.
    }

function-points-too-close = Fonksiyo irimwo utudomo tubiri turi hafi cane. Ntibishoboka gushinga fonksiyo.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Ugusubiramwo kwa fonksiyo gushoboka gusa igihe igitigiri c'inzinjizo gihuye n'igitigiri c'inyishu. Iyi fonksiyo ifise inzinjizo { $inputs } n' { $outputs ->
            [one] inyishu { $outputs }
           *[other] inyishu { $outputs }
        }.
       *[other] Ugusubiramwo kwa fonksiyo gushoboka gusa igihe igitigiri c'inzinjizo gihuye n'igitigiri c'inyishu. Iyi fonksiyo ifise inzinjizo { $inputs } n' { $outputs ->
            [one] inyishu { $outputs }
           *[other] inyishu { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Uburebure bw'urukurikirane ntibwo.  Butegerezwa kuba inomero yuzuye itari munsi ya zeru.

sequence-invalid-step = Intambwe y'urukurikirane ntiyo.  Itegerezwa kuba inomero ku rukurikirane rw'ubwoko { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" y'urukurikirane rw'inomero ntiyo.  Itegerezwa kuba inomero.

sequence-invalid-endpoint-letters = "{ $attribute }" y'urukurikirane rw'indome ntiyo.  Itegerezwa kuba ihuriro ry'indome.

sequence-invalid-endpoint = "{ $attribute }" y'urukurikirane ntiyo.

select-from-sequence-coprime-not-numbers = coprime yarirengagijwe kuko ata nomero zitorwa

select-from-sequence-coprime-with-exclude-combinations = coprime yarirengagijwe kuko excludeCombinations yashizweho

## Resolving a `target`

target-not-found = target itari yo kuri `<{ $source }>`: ntitwabonye target.

target-state-variable-not-found = target itari yo kuri `<{ $source }>`: ntitwabonye ikiranga citwa "{ $property }" kuri `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Ibihinduka vya `<odeSystem>` bitegerezwa gutandukana n'igihinduka cigenga.

ode-system-duplicate-variable-names = Ntibishoboka gushinga fonksiyo za ODE RHS zifise amazina y'ibihinduka asubiriwemwo.

ode-system-rhs-function-error = Ntibishoboka gushinga fonksiyo ya ODE RHS.  Ikosa mu kurema fonksiyo ya mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ntibishoboka gushinga inguni hagati y'imirongo { $count }

angle-invalid-through-point = Akadomo katari ko muri through ya `<angle>`

parabola-vertex-too-many-points = Ntitwarakora parabola ifise inguni iciye mu kadomo karenga 1.

parabola-too-many-points = Ntitwarakora parabola iciye mu tudomo turenga 3.

intersection-too-many-items = Ntitwarakora ihuriro ku bintu birenga bibiri

## Other math components

ionic-compound-not-two-ions = Ntitwarakora ivanga ry'ayoni ku kintu kitari ayoni zibiri.

ionic-compound-needs-cation-and-anion = Ivanga ry'ayoni ryakozwe gusa kuri katiyo imwe na aniyo imwe.

solve-equations-cannot-evaluate = Ntibishoboka gutorera umuti ingingano kuko itashoboye kubarwa: { $equation }

math-operators-operand-number-required = Utegerezwa gushiraho operandNumber igihe ukura operand y'imibare.

eigen-decomposition-failed = Ntitwashoboye kubara eigenvalues za matrisi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametre { $parameters } ntiboneka muri pattern, ku bw'ivyo izokwama ihuye n'ubusa.
       *[other] `<matchesPattern>`: parametre { $parameters } ntiziboneka muri pattern, ku bw'ivyo zizokwama zihuye n'ubusa.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ntibishoboka gusobanura grid="{ $grid }". Itegerezwa kuba none, medium, dense, canke inomero zibiri nziza zitandukanijwe n'ikibanza, nka grid="1 0.5". Nta rusenga rushushanijwe.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ntiyemewe mu mwerekanyi prefigure; turakoresha inyifato yo mu ruhande rw'iburyo.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ntiyemewe mu mwerekanyi prefigure; turakoresha inyifato yo hejuru.

prefigure-invalid-axis-bounds = `<graph>`: imipaka y'urutambi ntiyo ku guhindurwa kwa prefigure; turakoresha bbox isanzwe (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ubugari ntibwo ku guhindurwa kwa prefigure; turakoresha ubugari busanzwe bw'igishushanyo 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ntiyo ku guhindurwa kwa prefigure; turakoresha igipimo gisanzwe 1.

prefigure-grid-spacing-too-fine = `<graph>`: intera y'urusenga ni ntoya cane ku mipaka y'urutambi; urusenga ntiruzoshushanywa mu mwerekanyi prefigure.

prefigure-annotations-not-rendered = `<graph>`: ibisobanuro ntibizoshushanywa igihe udakoresheje umwerekanyi PreFigure.

multiple-annotations-children = Abana `<annotations>` benshi babonetse muri `<graph>`; bose usibye uwa nyuma barirengagijwe.

## Referring to other components

copy-unrecognized-component-type = Ntibishoboka kwagura canke gukoporora ubwoko bw'igice butazwi: { $type }.

copy-prop-not-found = Ntitwabonye prop { $property } ku gice c'ubwoko { $component }

collect-no-source = Nta soko ryabonetse rya collect.

collect-invalid-component-type = Ntibishoboka gukoranya ibice vy'ubwoko `<{ $component }>` kuko ari ubwoko butari bwo.

reference-index-unavailable = Ntibishoboka kwerekana indangahantu `{ $reference }`

## `<callAction>`

component-action-unavailable = Ntibishoboka guhamagara { $action } ku gice `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Ivyegeranyo bifise imero itari yo.  Imirongo ifise uburebure butandukanye. Vyabonetse muri componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Ivyegeranyo bifise amazina y'inkingi asubiriwemwo.  Vyabonetse muri componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ivyegeranyo bibuze izina ry'inkingi.  Vyabonetse muri componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Amanota y'iyi nyishu ashingiye ku nyishu tagi ubwayo yarungitse, ivyo bizotuma bigenda ukutari kwo.

answer-max-num-attempts-in-section-wide-check-work = Gushira `maxNumAttempts` kuri `<answer>` iri mu gice gifise `sectionWideCheckWork` nta co bimaze, kuko igitigiri c'ukugerageza kigenzurwa n'igice. Shira `maxNumAttempts` ku gice.

nested-section-wide-check-work-max-num-attempts = Gushira `maxNumAttempts` ku gice gifise `sectionWideCheckWork` kiri mu kindi gice gifise `sectionWideCheckWork` nta co bimaze, kuko igitigiri c'ukugerageza kigenzurwa n'igice co hanze. Shira `maxNumAttempts` ku gice co hanze.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Ikiranga { $attributes } nta co kizomara ata symbolicEquality yashizweho.
       *[other] Ibiranga { $attributes } nta co bizomara ata symbolicEquality yashizweho.
    }

answer-invalid-type = Ubwoko butari bwo bw'inyishu: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Kubera ko igice `<{ $component }>` kidafise izina, ntigishobora gukoreshwa nk'ikiranga ca module

module-attribute-name-already-defined = Igice `<{ $component } name="{ $name }">` ntigishobora gukoreshwa nk'ikiranga ca module kuko ubwoko `<module>` bufise ikiranga "{ $name }" gisanzwe.

conditional-content-condition-ignored = Ikiranga `condition` kirirengagizwa kuri `<conditionalContent>` ifise abana ba case canke else.

slider-markers-type-mismatch = Ubwoko bw'ibimenyetso ntibuhuye n'ubwoko bwa slider.

pretzel-problem-needs-statement-and-answer = pretzel itari yo: buri `<problem>` itegerezwa kugira `<statement>` imwe na `<answer>` imwe.

pretzel-circuit-first-problem-distractor = pretzel itari yo: muri mode="circuit", `<problem>` ya mbere ntishobora kuba distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Agaciro katari ko { $values } ku kiranga `{ $attribute }`; turakirengagije.
       *[other] Uduciro tutari two { $values } ku kiranga `{ $attribute }`; turadurengagije.
    }

attribute-must-be-references = Agaciro `{ $value }` katari ko ku kiranga `{ $attribute }`. Ikiranga gitegerezwa kuba kigizwe n'ivyerekana bitangura na `$`.

math-input-invalid-function-names = <mathInput>: twarirengagije amazina ya fonksiyo atari yo muri { $attribute }: { $names }. Igice cerekanwa ca buri zina gitegerezwa kugira nibura inyuguti 2 (indome canke udukoni); ushobora kongerako `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Ubwoko bw'igice butari bwo: `<{ $componentType }>`

attribute-repeated = Ntibishoboka gusubiramwo ikiranga { $attribute }.

attribute-invalid-for-component = Ikiranga "{ $attribute }" ntikibereye igice c'ubwoko `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Insobanuro y'imero { $styleNumber } ntifise ugutandukana guhagije kuri { $context ->
        [text-on-background] ibara ry'amajambo ku bara ryo mu nyuma
        [high-contrast] ibara ritandukanye cane ku rubaho
        [line] ibara ry'umurongo ku rubaho
        [marker] ibara ry'ikimenyetso ku rubaho
       *[text-on-canvas] ibara ry'amajambo ku rubaho
    }{ $mode ->
        [dark] { " (mu mwijima)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bisaba nibura { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Naho insobanuro y'imero { $styleNumber } ifise amabara atanga ugutandukana guhagije mu muco, amabara yo mu mwijima avuye kuri ayo ntafise ugutandukana guhagije hagati y'ibara ry'amajambo n'ibara ryo mu nyuma ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bisaba nibura { $threshold }:1). { $suggestion ->
        [available] Kugira ugutandukana kube guhagije mu mwijima, ongereza ugutandukana kwo mu muco (nk'akarorero, shira { $lightAttribute }="{ $lightColor }") canke uhindure ibara ryo mu mwijima (nk'akarorero, shira { $darkAttribute }="{ $darkColor }").
       *[none] Kugira ugutandukana kube guhagije mu mwijima, ongereza ugutandukana kwo mu muco canke uhindure amabara yavuyeko ukoresheje textColorDarkMode canke backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Naho insobanuro y'imero { $styleNumber } ifise ibara ry'amajambo ritanga ugutandukana guhagije mu muco, ibara ry'amajambo ryo mu mwijima ryavuye kuri iryo ntifise ugutandukana guhagije ku rubaho ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bisaba nibura { $threshold }:1). { $suggestion ->
        [available] Kugira ugutandukana kube guhagije mu mwijima, ongereza ugutandukana kwo mu muco (nk'akarorero, shira textColor="{ $lightColor }") canke uhindure ibara ryo mu mwijima (nk'akarorero, shira textColorDarkMode="{ $darkColor }").
       *[none] Kugira ugutandukana kube guhagije mu mwijima, ongereza ugutandukana kwo mu muco canke uhindure ibara ryavuyeko ukoresheje textColorDarkMode.
    }

section-multiple-style-palettes = Igika gishobora guhitamwo <stylePalette> imwe gusa; turakoresha iya nyuma.

## Unique variants

variant-num-to-select-not-non-negative-integer = ntibishoboka kumenya ubwoko budasubiriwemwo bwa { $component } kuko numToSelect atari inomero yuzuye itari munsi ya zeru.

variant-num-to-select-not-constant-number = ntibishoboka kumenya ubwoko budasubiriwemwo bwa { $component } kuko numToSelect atari inomero idahinduka.

variant-with-replacement-not-constant-boolean = ntibishoboka kumenya ubwoko budasubiriwemwo bwa { $component } kuko withReplacement atari boolean idahinduka.

variant-select-weight-disables-unique = Ubwoko budasubiriwemwo bwa select burahagaritswe igihe hariho ihitamwo rifise selectWeight canke selectForVariants

variant-coprime-undetermined = ntibishoboka kumenya ubwoko budasubiriwemwo bwa { $component } kuko ntitwamenya ko coprime ihora ari false.

variant-attribute-not-constant = ntibishoboka kumenya ubwoko budasubiriwemwo bwa { $component } kuko { $attribute } idahinduka.

variant-attribute-not-number = ntibishoboka kumenya ubwoko budasubiriwemwo bwa { $component } kuko { $attribute } atari inomero.

variant-attribute-wrong-type-for-sequence =
    ntibishoboka kumenya ubwoko budasubiriwemwo bwa { $component } bw'ubwoko { $type } kuko { $attribute } atari { $expected ->
        [letters-combination] ihuriro ry'indome
        [math-expression] imvugo y'imibare yemewe
        [integer] inomero yuzuye
       *[number] inomero
    }.

variant-length-not-integer = ntibishoboka kumenya ubwoko budasubiriwemwo bwa { $component } kuko length atari inomero yuzuye.

variant-sort-not-implemented = ntitwarakora ubwoko budasubiriwemwo bwa { $component } ifise sort

variant-exclude-combinations-not-implemented = ntitwarakora ubwoko budasubiriwemwo bwa { $component } ifise excludeCombinations

variant-math-exclude-not-implemented = ntitwarakora ubwoko budasubiriwemwo bwa { $component } y'ubwoko math ifise exclude

variant-non-constant-exclude-not-implemented = ntitwarakora ubwoko budasubiriwemwo bwa { $component } ifise exclude ihinduka

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ntiyemewe mu mwerekanyi prefigure wa graph; uwuvamwo yarasimbwe.

prefigure-descendant-invalid-geometry = { $subject }: imero y'ikibanza itagira urugero canke ituzuye; uwuvamwo yarasimbwe.

prefigure-curve-label-omitted = { $subject }: amazina ntiyemewe ku miguru yahinduwe; izina ryarasimbwe.

prefigure-curve-unsupported-definition-type = { $subject }: ubwoko bw'insobanuro y'umuguru '{ $definitionType }' ntibwemewe; uwuvamwo yarasimbwe.

prefigure-region-flip-functions-unsupported = { $subject }: ikiranga flipFunctions ntikiremewe kuri regionBetweenCurves; uwuvamwo yarasimbwe.

prefigure-region-non-formula-child = { $subject }: ni fonksiyo z'abana zifise ubwoko formula gusa zemewe kuri regionBetweenCurves; uwuvamwo yarasimbwe.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ntiyemewe ku { $labelKind ->
        [line-family] zina ry'umuryango w'imirongo
       *[point] zina ry'akadomo
    }; turakoresha ihuriro risanzwe rya PreFigure.

prefigure-fill-style-unsupported = { $subject }: imero y'ukwuzuza '{ $fillStyle }' ntiyemewe na PreFigure; turasubira ku kwuzuza gukomeye.

prefigure-line-style-unknown = { $subject }: imero y'umurongo itazwi '{ $lineStyle }' yarakuwe mu vyasohotse vya PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: imero y'ikimenyetso '{ $markerStyle }' yahinduwe imero ya PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: imero y'ikimenyetso '{ $markerStyle }' ntiyemewe na PreFigure; turakoresha imero isanzwe.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` itari yo; ntitwabonye ico yerekana. Insobanuro yarasimbwe.

annotation-ref-multiple-targets = `<annotation>`: `ref` yerekanye ibintu vyinshi; turakoresha ica mbere.

annotation-ref-outside-graph = `<annotation>`: `ref` itari yo; ico yerekana kiri hanze ya graph irimwo. Insobanuro yarasimbwe.

annotation-ref-unsupported-target = `<annotation>`: `ref` itari yo; ico yerekana si ikintu c'igishushanyo cemewe mu guhindurwa kwa prefigure. Insobanuro yarasimbwe.

annotation-text-missing = `<annotation>`: `text` ibuze canke y'ubusa; turasohora amajambo y'ubusa.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Twabonye ukwishingikiriza kuzunguruka.
       *[other] Twabonye ukwishingikiriza kuzunguruka kurimwo igice `<{ $componentType }>`.
    }

reference-no-referent = Nta kintu cabonetse ku cerekana: `{ $reference }`

reference-multiple-referents = Ibintu vyinshi vyabonetse ku cerekana: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Imero itari yo y'ikiranga { $attribute } ca `<{ $componentType }>`.

children-invalid = Abana batari bo ba `<{ $componentType }>`: Twabonye abana batari bo: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Agaciro `{ $value }` katari ko ku kiranga `{ $attribute }`, turakoresha agaciro `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Verisiyo ya DoenetML { $version } ntiyabonetse.
       *[other] Verisiyo ya DoenetML { $version } ntiyabonetse. Turasubira kuri verisiyo { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML itari yo: { $content }

parse-tag-missing-close-tag = DoenetML itari yo: Tagi `{ $tag }` ntifise tagi ifunga. Twari twiteze tagi yifunga canke tagi `</{ $tagName }>`.

parse-tag-error = DoenetML itari yo: Ikosa muri tagi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML itari yo: Ikiranga `{ $attribute }` kitari co gisa n'aho kibuze agaciro.

parse-attribute-invalid = DoenetML itari yo: Ikiranga `{ $attribute }` ntico

parse-attribute-value-invalid = DoenetML itari yo: Agaciro k'ikiranga `{ $value }` ntiko

parse-attribute-value-quote-mismatch = DoenetML itari yo: Agaciro k'ikiranga `{ $value }` ntiko. Utumenyetso tw'imvugo ntiduhuye. Bisa n'aho ubuze `{ $quote }`

parse-open-tag-name-missing = DoenetML itari yo: Twabonye tagi idafise izina, nka `<`

parse-tag-not-closed = DoenetML itari yo: Tagi `{ $tag }` ntiyafunzwe (bisa n'aho `>` ibuze).

parse-self-closing-tag-name-missing = DoenetML itari yo: Twabonye tagi idafise izina `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML itari yo: Tagi `{ $tag }` ntiyafunzwe (bisa n'aho `/>` ibuze).

parse-tag-invalid-attributes = DoenetML itari yo: Tagi `{ $tag }` ntiyo. Ishobora kuba ifise ibiranga bitari vyo.

parse-close-tag-name-missing = DoenetML itari yo: Twabonye tagi ifunga idafise izina, nka `</`

parse-attribute-value-unquoted = Uduciro tw'ibiranga dutegerezwa gushirwa mu tumenyetso tw'imvugo: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML itari yo: Twabonye tagi ifunga `{ $tag }`, mugabo nta tagi ifungura ihuye

parse-close-tag-mismatched = DoenetML itari yo: Tagi ifunga ntihuye. Twari twiteze `</{ $expected }>`. Twabonye `{ $found }`

parser-node-unconvertible = Ntitwashoboye guhindura node { $node } mu node ya Dast.

## Names

name-attribute-invalid =
    Izina name='{ $name }' ntiryo. { $reason ->
        [characters] Amazina ashobora kugira indome, inomero, udukoni two hasi canke udukoni gusa.
       *[start] Amazina ategerezwa gutangura n'indome.
    }

component-name-invalid-start = Izina ry'igice "{ $name }" ntiryo. Amazina ategerezwa gutangura n'indome.

## `<answer>` sugar

answer-video-watched-missing-video = Inyishu y'ubwoko videoWatched itegerezwa kugira ikiranga video

answer-video-watched-video-not-reference = Inyishu y'ubwoko videoWatched itegerezwa kugira ikiranga video ari icerekana

answer-name-not-single-text = Ikiranga name c'inyishu gitegerezwa kugira umwana umwe w'amajambo

## Referencing another document

external-doenetml-recursion-limit = Ntitwashoboye kuronka DoenetML yo hanze kubera urwego rw'ugusubiramwo rurenze. Hoba hariho icerekana kizunguruka?

external-doenetml-unavailable = Ntitwashoboye kuronka DoenetML kuri { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML yaronkejwe kuri { $attribute }="{ $uri }" ntiyo: ntiyahuye n'ubwoko bw'igice "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ikiranga `{ $from }` ntigikoreshwa; koresha `{ $to }`.
       *[other] [deprecation] Ikiranga `{ $from }` kuri `<{ $component }>` ntigikoreshwa; koresha `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ikiranga `{ $from }` ntigikoreshwa kandi kirirengagijwe kuko `{ $to }` na yo yashizweho.
       *[other] [deprecation] Ikiranga `{ $from }` kuri `<{ $component }>` ntigikoreshwa kandi kirirengagijwe kuko `{ $to }` na yo yashizweho.
    }

deprecated-attribute-ignored = [deprecation] Ikiranga `{ $attribute }` kuri `<{ $component }>` ntigikoreshwa kandi kirirengagijwe.

deprecated-attribute-to-child = [deprecation] Ikiranga `{ $attribute }` kuri `<{ $component }>` ntigikoreshwa; koresha umwana `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Agaciro `{ $value }` k'ikiranga `{ $attribute }` kuri `<{ $component }>` ntigakoreshwa; koresha `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` ishobora gukora ubwinshi mu congereza gusa, ku bw'ivyo amajambo yayo asigara uko umwanditsi yayanditse mu gitabu canditswe muri { $locale }. Andika ubwinshi ubwawe, canke ubushire n'ikiranga `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Igice `<{ $tag }>` si igice ca Doenet kizwi.

schema-element-not-allowed-at-root = Igice `<{ $tag }>` ntikiremewe ku muzi w'igitabu.

schema-element-not-allowed-inside = Igice `<{ $tag }>` ntikiremewe muri `<{ $parent }>`.

schema-attribute-unrecognized = Igice `<{ $tag }>` ntikifise ikiranga citwa `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ikiranga `{ $attribute }` c'igice `<{ $tag }>` gitegerezwa kuba urutonde rufise ibintu buri kimwe ari kimwe muri: { $allowed }
       *[other] Ikiranga `{ $attribute }` c'igice `<{ $tag }>` gitegerezwa kuba kimwe muri: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Izina ry'ubwoko ntiryo kuri select.  Izina ry'ubwoko { $variantName } riboneka mu mahitamwo { $numOptions } mugabo igitigiri co guhitamwo ni { $numToSelect }.

select-variant-name-without-options = Ubwoko bumwebumwe bwashizweho kuri select mugabo nta mahitamwo yashizweho ku zina ry'ubwoko bushoboka: { $variantName }.

select-variant-name-not-possible = Izina ry'ubwoko { $variantName } ryashizweho kuri select si izina ry'ubwoko bushoboka.

select-too-few-options = Ntibishoboka guhitamwo ibice { $numToSelect } mu bice { $numOptions } gusa.

select-from-sequence-too-few-values = Ntibishoboka guhitamwo uduciro { $numToSelect } mu rukurikirane rw'uburebure { $length }.

select-from-sequence-indices-count-mismatch = Igitigiri c'indices zashizweho kuri select gitegerezwa guhuya n'igitigiri co guhitamwo

select-from-sequence-indices-not-integers = Indices zose zashizweho kuri select zitegerezwa kuba inomero zuzuye

select-from-sequence-index-excluded = Indangahantu yashizweho ya selectfromsequence yari yavanyweko

select-from-sequence-indices-excluded-combination = Indices zashizweho za selectfromsequence zari ihuriro ryavanyweko

select-from-sequence-coprime-not-positive-integers = Ntibishoboka guhitamwo amahuriro ya coprime kuko atari inomero nziza zuzuye zitorwa.

select-from-sequence-coprime-common-factor = Ntibishoboka guhitamwo inomero za coprime. Uduciro twose dushoboka dusangiye igiharuro kimwe. (Uduciro twashizweho twa "from" canke "to" dutegerezwa kuba coprime na "step".)

select-from-sequence-coprime-single-number = Ntibishoboka guhitamwo amahuriro ya coprime mu nomero imwe itari 1.

select-from-sequence-excluded-too-many-combinations = Twavanyeko amahuriro arenga 70% muri selectFromSequence

select-from-sequence-coprime-none-found = Ntitwashoboye guhitamwo inomero za coprime. Uduciro twose dushoboka dusangiye igiharuro kimwe.

select-from-sequence-too-few-unique-values = Ntibishoboka guhitamwo uduciro { $numToSelect } dudasubiriwemwo mu rukurikirane rw'uburebure { $numPossibleValues }

select-prime-numbers-too-few-values = Ntibishoboka guhitamwo uduciro { $numToSelect } mu rutonde rw'inomero za prime rw'uburebure { $numValues }

select-prime-numbers-values-count-mismatch = Igitigiri c'uduciro twashizweho kuri select gitegerezwa guhuya n'igitigiri co guhitamwo

select-prime-numbers-values-not-prime = Uduciro twose twashizweho kuri select prime number dutegerezwa kuba mu rutonde rw'inomero za prime

select-prime-numbers-values-excluded-combination = Uduciro twashizweho twa selectPrimeNumbers twari ihuriro ryavanyweko

select-prime-numbers-excluded-too-many-combinations = Twavanyeko amahuriro arenga 70% muri selectPrimeNumbers

select-random-combination-fluke = Ku kuntu bidashoboka cane, ntitwashoboye guhitamwo ihuriro ry'uduciro tw'ubushakashatsi

select-random-value-fluke = Ku kuntu bidashoboka cane, ntitwashoboye guhitamwo agaciro k'ubushakashatsi
