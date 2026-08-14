# Chechen diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# The palochka Ӏ is a letter, not a Latin I and not a digit 1.
#
# Chechen's class agreement does not reach this file: nothing here describes a
# noun the catalog itself supplies, so no message forks on a class. The fork
# lives in `content.ftl`, and the reason it lives only there is written out in
# that file's header.
#
# The technical nouns are the Russian ones, which is what written Chechen uses
# for them: «компонент», «атрибут», «функци», «индекс».


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] шиъ йистан тӀадам билгалбахча { $attributes } хьесапе ца оьцу
       *[other] шиъ йистан тӀадам билгалбахча { $attributes } хьесапе ца оьцу
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] йистан тӀадам а, юккъера тӀадам а билгалбахча { $attributes } хьесапе ца оьцу
       *[other] йистан тӀадам а, юккъера тӀадам а билгалбахча { $attributes } хьесапе ца оьцу
    }

line-segment-midpoint-offset-without-midpoint = юккъера тӀадам боцуш midpointOffset хӀуманна тӀе ца кхочу

## `<line>`

line-points-undetermined-dimensions = Барам ца бевзаш болчу тӀадамашкахула долу нийса сиз.

line-points-too-few-dimensions = Нийса сиз кӀеззиг делахь шиъ барам болчу тӀадамашкахула дала деза.

line-points-depend-on-variables = Нийса сиз хийцалун барамашка хьаьжначу тӀадамашкахула долу: { $variables }.

line-equation-invalid-format = { $variable1 } а, { $variable2 } а хийцалун барамашца долчу нийсачу сизан уравненин формат нийса яц.

## `<ray>`

ray-overprescribed-through = Луч through, endpoint а, direction а тӀехула делла. Делла through хьесапе ца оьцу.

ray-dimension-mismatch = лучехь numDimensions ца богӀу.

## `<vector>`

vector-overprescribed-head = Вектор head, tail а, displacement а тӀехула делла. Делла head хьесапе ца оьцу.

vector-dimension-mismatch = векторехь numDimensions ца богӀу.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элементе таса ца лой, хӀунда аьлча цуьнан nearestPoint хьолан хийцалун барам бац.

constrain-to-without-nearest-point = `<{ $component }>` элементца дозалуш дан ца лой, хӀунда аьлча цуьнан nearestPoint хьолан хийцалун барам бац.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементан чоьхьарчуьнца дозалуш дан ца лой, хӀунда аьлча цуьнан nearestPoint хьолан хийцалун барам бац.

## `<choiceInput>`

choice-input-label-position-ignored = могӀанан чохь доцчу choiceInput тӀе labelPosition хьесапе ца оьцу

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput тӀе делла индексаш хьесапе ца оьцу, хӀунда аьлча царан дукхалла choice берийн дукхаллина ца тоьи.

pretzel-indices-count-mismatch = problem тӀе делла индексаш хьесапе ца оьцу, хӀунда аьлча царан дукхалла problem берийн дукхаллина ца тоьи.

shuffle-indices-count-mismatch = shuffle тӀе делла индексаш хьесапе ца оьцу, хӀунда аьлча царан дукхалла компоненташан дукхаллина ца тоьи.

indices-ignored-out-of-range = { $component } тӀе делла индексаш хьесапе ца оьцу, хӀунда аьлча цхьаберш доза тӀера аравуьйлу.

pretzel-indices-repeated = pretzel тӀе делла индексаш хьесапе ца оьцу, хӀунда аьлча цхьаберш карладуьйлу.

pretzel-circuit-first-index = circuit режимехь pretzel тӀе делла индексаш хьесапе ца оьцу, хӀунда аьлча хьалхара индекс 1 хила еза.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текстан берашца болх бархьама `type` атрибут яла еза.

invalid-type-defaulting-to-math = { $component } компонентана нийса доцу тайпа { $type }. Иза math, text, number я boolean хила деза. math пайдаэцу.

string-not-valid-component-to-arrange = «{ $value }» могӀа { $component } тӀе тоьшалун компонент бац. Хьесапе ца оьцу.

## Types and variables

invalid-type-defaulting-to-number = Нийса доцу тайпа { $type }, тайпа number хуьлу.

invalid-variable-value = Хийцалун барамийн нийса доцу мах: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариантан индекс терахь хила деза

variant-index-must-be-integer = { $index } вариантан индекс дийна терахь хила деза

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолютни барамашна дина дац. Церан шоралла юстаран хуьлу.

side-by-side-absolute-margins = `<{ $component }>` абсолютни барамашна дина дац. Церан йистош юстаран хуьлу.

side-by-side-no-block-child = Нийса доцу `<{ $component }>`: цуьнан кӀеззиг делахь цхьа блок бер хила деза.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элементан `for` атрибут хьесапе ца оьцу.

label-for-must-resolve-to-one = `<label>` элементан `for` атрибуто цхьана компонента тӀе бен ца хьожуш хила деза.

label-for-unresolved = `<label>` элементан `for` атрибут компонентца хьаьрчош ца делира.

label-for-answer-with-authored-inputs = `<label>` элементан `for` атрибут авторо яздина чуялоран меттигаш йолчу `<answer>` тӀе хьожу; меттиге нийсса хьажайе.

label-for-answer-without-input = `<label>` элементан `for` атрибут билгалйоран чуялоран меттиг йоцчу `<answer>` тӀе хьожу.

label-for-must-reference-input-or-answer = `<label>` элементан `for` атрибут чуялоран меттиге я жопе хьожуш хила деза.

## Accessibility

accessibility-short-description-or-decorative = Кхачарна `<{ $component }>` йоцца цуьнан билгалдаккхарца хила деза, я хазйийриг санна билгалдан деза.

accessibility-video-short-description = Кхачарна `<video>` йоцца билгалдаккхарца хила деза.

accessibility-input-short-description-or-label = Кхачарна `<{ $component }>` йоцца билгалдаккхарца я хьаьркаца хила деза.

accessibility-answer-input-short-description-or-label = Кхачарна чуялоран меттиг кхуллуш болу `<answer>` йоцца билгалдаккхарца я хьаьркаца хила беза.

accessibility-short-description-contains-math = Йоццачу билгалдаккхаршкахь `<{ $component }>` санна математически компоненташ хила ца еза. Математика дешнашца язъе.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } дакъойн коьртан текстана тоьаш контраст ца ло (Ӏаьржа тайпа) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кӀеззиг делахь { $threshold }:1 оьшу).
       *[other] { $colorName } дакъойн коьртан текстана тоьаш контраст ца ло ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кӀеззиг делахь { $threshold }:1 оьшу).
    }

## `<circle>`

circle-through-points-non-numerical = ТӀадамийн терахьан мехаш ца хилча { $count } тӀадамехула долу `<circle>` дина дац.

circle-too-many-through-points = 3-нал дукха тӀадамехула долу гуо хьесапе дан ца лой.

circle-overprescribed-radius-center-points = Делла радиус, юкъ а, тӀадамаш а болуш гуо хьесапе дан ца лой.

circle-center-with-multiple-points = Делла юкъаца 1-нал дукха тӀадамехула долу гуо хьесапе дан ца лой.

circle-radius-too-small = Гуо хьесапе дан ца лой: шина тӀадаман юкъара гена { $distance } хилча, делла радиус { $radius } тӀех жима бу.

circle-radius-with-many-points = Делла радиусца шиннал дукха тӀадамехула долу гуо кхолла ца лой.

circle-invalid-center-or-through-points = Гуонан юкъ я тӀадамаш нийса дац.

circle-radius-center-with-multiple-points = Делла юкъаца 1-нал дукха тӀадамехула долчу гуонан радиус хьесапе дан ца лой.

circle-change-radius-non-numerical = Терахьан доцчу тӀадамашца долчу гуонан радиус хийца ца лой

circle-radius-with-points-non-numerical = Терахьан мехаш ца хилча делла радиусца цхьаннал дукха тӀадамехула долу гуо кхолла ца лой.

circle-change-center-non-numerical = Терахьан доцчу тӀадамашкахула долчу гуонан юкъ хийцар дина дац.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцин билгалйинчу меттиган барам ца тоьу. Меттигехь { $intervals } юкъ ю, функцехь ткъа { $inputs ->
            [one] { $inputs } чуялор
           *[other] { $inputs } чуялор
        } ю.
       *[other] Функцин билгалйинчу меттиган барам ца тоьу. Меттигехь { $intervals } юкъ ю, функцехь ткъа { $inputs ->
            [one] { $inputs } чуялор
           *[other] { $inputs } чуялор
        } ю.
    }

function-domain-invalid-format = Функцин билгалйинчу меттиган формат нийса яц.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцин терахьан доцу максимум хьесапе ца оьцу.
        [minimum] Функцин терахьан доцу минимум хьесапе ца оьцу.
        [extremum] Функцин терахьан доцу экстремум хьесапе ца оьцу.
        [point] Функцин терахьан боцу тӀадам хьесапе ца оьцу.
        [slope] Функцин терахьан доцу дуьхьалхилар хьесапе ца оьцу.
       *[other] Функцин терахьан доцу { $type } мах хьесапе ца оьцу.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцин ерриг йоцу максимум хьесапе ца оьцу.
        [minimum] Функцин ерриг йоцу минимум хьесапе ца оьцу.
        [extremum] Функцин ерриг йоцу экстремум хьесапе ца оьцу.
        [point] Функцин баьржина боцу тӀадам хьесапе ца оьцу.
       *[other] Функцин баьржина доцу { $type } мах хьесапе ца оьцу.
    }

function-points-too-close = Функцехь вовшашка тӀех гергара шиъ тӀадам бу. Функци билгалъян ца лой.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функцин итерацеш хуьлу чуялорийн дукхалла аракхетарийн дукхаллица цхьатерра хилча бен. ХӀокху функцехь { $inputs } чуялор а, { $outputs ->
            [one] { $outputs } аракхетар
           *[other] { $outputs } аракхетар
        } а ю.
       *[other] Функцин итерацеш хуьлу чуялорийн дукхалла аракхетарийн дукхаллица цхьатерра хилча бен. ХӀокху функцехь { $inputs } чуялор а, { $outputs ->
            [one] { $outputs } аракхетар
           *[other] { $outputs } аракхетар
        } а ю.
    }

## `<sequence>`

sequence-invalid-length = Тайпанан дохалла нийса яц. Иза минус йоцу дийна терахь хила деза.

sequence-invalid-step = Тайпанан гӀулч нийса яц. { $type } тайпан тайпанна иза терахь хила деза.

sequence-invalid-endpoint-number = Терахьан тайпанан «{ $attribute }» мах нийса бац. Иза терахь хила деза.

sequence-invalid-endpoint-letters = Элпан тайпанан «{ $attribute }» мах нийса бац. Иза элпийн цхьаьнакхетар хила деза.

sequence-invalid-endpoint = Тайпанан «{ $attribute }» мах нийса бац.

select-from-sequence-coprime-not-numbers = терахьаш ца хаьржина, цундела coprime хьесапе ца оьцу

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations делла, цундела coprime хьесапе ца оьцу

## Resolving a `target`

target-not-found = `<{ $source }>` тӀе нийса доцу target: Ӏалашо ца карийна.

target-state-variable-not-found = `<{ $source }>` тӀе нийса доцу target: `<{ $component }>` элементехь «{ $property }» цӀе йолу хьолан хийцалун барам ца карийна.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` хийцалун барамаш шаьш-шайн долчу барамах къаьста деза.

ode-system-duplicate-variable-names = Хьаьжначу хийцалун барамийн цӀераш карладийлахь ДУ аьтту агӀон функцеш билгалъян ца лой.

ode-system-rhs-function-error = ДУ аьтту агӀон функци билгалъян ца лой. mathjs функци кхуллуш гӀалат.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } нийсачу сизан юкъара сонера билгалбан ца лой

angle-invalid-through-point = `<angle>` элементан through махехь нийса боцу тӀадам

parabola-vertex-too-many-points = Делла корта болуш 1-нал дукха тӀадамехула йолу парабола йина яц.

parabola-too-many-points = 3-нал дукха тӀадамехула йолу парабола йина яц.

intersection-too-many-items = Шиннал дукха объектийн вовшахкхетар дина дац

## Other math components

ionic-compound-not-two-ions = Шина ионах кхин ионан цхьаьнакхетарш дина дац.

ionic-compound-needs-cation-and-anion = Ионан цхьаьнакхетар цхьана катионна а, цхьана анионна а бен дина дац.

solve-equations-cannot-evaluate = Уравнени ярза ца лой, хӀунда аьлча иза хьесапе ян ца делира: { $equation }

math-operators-operand-number-required = Математически операнд къасторхьама operandNumber яла еза.

eigen-decomposition-failed = Матрицин шен мехаш хьесапе дан ца делира

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр кепехь ца карайо, цундела иза даима а ерриг йоцчуьнца богӀу.
       *[other] `<matchesPattern>`: { $parameters } параметраш кепехь ца карайо, цундела уьш даима а ерриг йоцчуьнца богӀу.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" мах кхета ца лой. Иза none, medium, dense я ерриг йоцчу меттигаца къаьстина шиъ плюсан терахь хила деза, масала grid="1 0.5". Сеть ца юзу.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure сурт диллархочуьнгахь xLabelPosition="left" дина дац; аьтту агӀон хӀоттам пайдаоьцу.

prefigure-y-label-position-unsupported = `<graph>`: prefigure сурт диллархочуьнгахь yLabelPosition="bottom" дина дац; лакхара хӀоттам пайдаоьцу.

prefigure-invalid-axis-bounds = `<graph>`: prefigure дерзорна доза нийса дац; бух болу bbox (-10,-10,10,10) пайдаоьцу.

prefigure-invalid-width = `<graph>`: prefigure дерзорна шоралла нийса яц; диаграммин бух болу шоралла 425 пайдаоьцу.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure дерзорна aspectRatio нийса дац; бух болу агӀонийн барам 1 пайдаоьцу.

prefigure-grid-spacing-too-fine = `<graph>`: сетан гӀулч дозанашна тӀех жима ю; prefigure сурт диллархочуьнгахь сеть ца юьйлайо.

prefigure-annotations-not-rendered = `<graph>`: PreFigure сурт диллархо ца пайдаоьцуш билгалдарш ца дуьйлайо.

multiple-annotations-children = `<graph>` чохь дукха `<annotations>` бер карийна; тӀаьххьарчух дӀаьнд кхин уьш хьесапе ца оьцу.

## Referring to other components

copy-unrecognized-component-type = Ца бевзаш болу компонентан тайпа шордан я копи ян ца лой: { $type }.

copy-prop-not-found = { $component } тайпанан компонентехь { $property } башхалла ца карийна

collect-no-source = collect тӀе хьост ца карийна.

collect-invalid-component-type = `<{ $component }>` тайпанан компонентеш гулъян ца лой, хӀунда аьлча иза нийса доцу компонентан тайпа ду.

reference-index-unavailable = `{ $reference }` индексе хьажор кхолла ца лой

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентехь { $action } кхайкха ца лой

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Хаамийн кеп нийса яц. МогӀанийн дохалла тайп-тайпана ю. Карийна componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Хаамашкахь баганин цӀераш карладуьйлу. Карийна componentIdx :{ $componentIdx }

data-frame-missing-column-name = Хаамашкахь баганин цӀе ца тоьу. Карийна componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = ХӀокху жопан award мах answer тегаца шен дӀадахьийтинчу жопе хьоьжу, оцо ца хьоьхучу хьоле дало тарло.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` йолчу контейнеран чуьра `<answer>` тӀе `maxNumAttempts` хӀоттор хӀуманна тӀе ца кхочу, хӀунда аьлча гӀорташан дукхалла контейнеро билгалйо. `maxNumAttempts` мах контейнер тӀе хӀотта.

nested-section-wide-check-work-max-num-attempts = Кхечу `sectionWideCheckWork` контейнеран чохь лаьттачу `sectionWideCheckWork` контейнер тӀе `maxNumAttempts` хӀоттор хӀуманна тӀе ца кхочу, хӀунда аьлча гӀорташан дукхалла арахьарчу контейнеро билгалйо. `maxNumAttempts` мах арахьарчу контейнер тӀе хӀотта.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality хӀоттийна ца хилча { $attributes } атрибут хӀуманна тӀе ца кхочур ду.
       *[other] symbolicEquality хӀоттийна ца хилча { $attributes } атрибуташ хӀуманна тӀе ца кхочур ду.
    }

answer-invalid-type = answer тӀе нийса доцу тайпа: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентан цӀе яц, цундела иза модулан атрибут санна пайдаэца ца лой

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонент модулан атрибут санна пайдаэца ца лой, хӀунда аьлча `<module>` компонентан тайпанехь «{ $name }» атрибут хӀинццехь билгалйина.

conditional-content-condition-ignored = case я else бераш долчу `<conditionalContent>` компонентехь `condition` атрибут хьесапе ца оьцу.

slider-markers-type-mismatch = Маркерийн тайпа ползунокан тайпанна ца тоьи.

pretzel-problem-needs-statement-and-answer = Нийса доцу pretzel: хӀор `<problem>` чохь цхьа `<statement>` а, цхьа `<answer>` а хила деза.

pretzel-circuit-first-problem-distractor = Нийса доцу pretzel: mode="circuit" режимехь хьалхара `<problem>` тидам дӀабоккхург хила ца еза.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибутана нийса боцу мах { $values }; хьесапе ца оьцу.
       *[other] `{ $attribute }` атрибутана нийса доцу мехаш { $values }; хьесапе ца оьцу.
    }

attribute-must-be-references = `{ $attribute }` атрибутана нийса боцу мах `{ $value }`. Атрибут `$` хьаьркаца долалун хьажорех лаьтташ хила деза.

math-input-invalid-function-names = <mathInput>: { $attribute } чуьра нийса доцу функцийн цӀераш хьесапе ца эцна: { $names }. ХӀор цӀеран гуш йолу дакъа кӀеззиг делахь 2 хьаьрк хила еза (элпаш я сизаш); цул тӀаьхьа оьшуш йоцу `|<mathspeak альтернатива>` тӀетохар кхача тарло.

## Building components from the source

component-type-invalid = Нийса доцу компонентан тайпа: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибут карлаяккха ца лой.

attribute-invalid-for-component = `<{ $componentType }>` тайпанан компонентана нийса доцу атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стилан билгалдаккхарехь { $context ->
        [text-on-background] текстан бос а, фонан бос а
        [high-contrast] лекха контраст болу бос а, суртан меттиг а
        [line] сизан бос а, суртан меттиг а
        [marker] маркеран бос а, суртан меттиг а
       *[text-on-canvas] текстан бос а, суртан меттиг а
    } юкъара контраст ца тоьу{ $mode ->
        [dark] { " (Ӏаьржа тайпа)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кӀеззиг делахь { $threshold }:1 оьшу).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стилан билгалдаккхарехь делла бесаш сирлачу тайпанна тоьаш контраст делча а, царах даьлла Ӏаьржачу тайпанан бесаш текст а, фон а юкъахь тоьаш контраст ца ло ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кӀеззиг делахь { $threshold }:1 оьшу). { $suggestion ->
        [available] Ӏаьржачу тайпанехь тоьаш контраст хилийтархьама я сирлачу тайпанан контраст алсамъяккха (масала { $lightAttribute }="{ $lightColor }"), я Ӏаьржачу тайпанан бос хийца (масала { $darkAttribute }="{ $darkColor }").
       *[none] Ӏаьржачу тайпанехь тоьаш контраст хилийтархьама сирлачу тайпанан контраст алсамъяккха я даьлла бесаш textColorDarkMode а/я backgroundColorDarkMode а тӀехула хийца.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стилан билгалдаккхарехь делла текстан бос сирлачу тайпанна тоьаш контраст белча а, цунах баьлла Ӏаьржачу тайпанан текстан бос суртан меттигаца тоьаш контраст ца ло ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кӀеззиг делахь { $threshold }:1 оьшу). { $suggestion ->
        [available] Ӏаьржачу тайпанехь тоьаш контраст хилийтархьама я сирлачу тайпанан контраст алсамъяккха (масала textColor="{ $lightColor }"), я Ӏаьржачу тайпанан бос хийца (масала textColorDarkMode="{ $darkColor }").
       *[none] Ӏаьржачу тайпанехь тоьаш контраст хилийтархьама сирлачу тайпанан контраст алсамъяккха я баьлла бос textColorDarkMode тӀехула хийца.
    }

section-multiple-style-palettes = Корто цхьа <stylePalette> бен харжа ца лой; тӀаьххьарниг пайдаоьцу.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } тӀе карлайовлуш йоцу варианташ билгалъян ца лой, хӀунда аьлча numToSelect минус йоцу дийна терахь яц.

variant-num-to-select-not-constant-number = { $component } тӀе карлайовлуш йоцу варианташ билгалъян ца лой, хӀунда аьлча numToSelect хийцалуш йоцу терахь яц.

variant-with-replacement-not-constant-boolean = { $component } тӀе карлайовлуш йоцу варианташ билгалъян ца лой, хӀунда аьлча withReplacement хийцалуш боцу логически мах бац.

variant-select-weight-disables-unique = цхьана харжамехь selectWeight я selectForVariants делча, select тӀе карлайовлуш йоцу варианташ дӀаяйо

variant-coprime-undetermined = { $component } тӀе карлайовлуш йоцу варианташ билгалъян ца лой, хӀунда аьлча coprime даима а харц ю я яц, иза билгалдан ца лой.

variant-attribute-not-constant = { $component } тӀе карлайовлуш йоцу варианташ билгалъян ца лой, хӀунда аьлча { $attribute } хийцалуш йоцург яц.

variant-attribute-not-number = { $component } тӀе карлайовлуш йоцу варианташ билгалъян ца лой, хӀунда аьлча { $attribute } терахь яц.

variant-attribute-wrong-type-for-sequence =
    { $type } тайпанан { $component } тӀе карлайовлуш йоцу варианташ билгалъян ца лой, хӀунда аьлча { $attribute } { $expected ->
        [letters-combination] элпийн цхьаьнакхетар
        [math-expression] тоьшалун математически билгалдаккхар
        [integer] дийна терахь
       *[number] терахь
    } яц.

variant-length-not-integer = { $component } тӀе карлайовлуш йоцу варианташ билгалъян ца лой, хӀунда аьлча length дийна терахь яц.

variant-sort-not-implemented = sort йолчу { $component } тӀе карлайовлуш йоцу варианташ йина яц

variant-exclude-combinations-not-implemented = excludeCombinations йолчу { $component } тӀе карлайовлуш йоцу варианташ йина яц

variant-math-exclude-not-implemented = exclude йолчу math тайпанан { $component } тӀе карлайовлуш йоцу варианташ йина яц

variant-non-constant-exclude-not-implemented = хийцалуш йоцург йоцу exclude йолчу { $component } тӀе карлайовлуш йоцу варианташ йина яц

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графикан prefigure сурт диллархочуьнгахь дина дац; тӀаьхье дӀатесна.

prefigure-descendant-invalid-geometry = { $subject }: чаккхе йоцу я кхачаза геометри; тӀаьхье дӀатесна.

prefigure-curve-label-omitted = { $subject }: дерзийначу къевлинчу элементашкахь хьаьркаш йина яц; хьаьрк дӀатесна.

prefigure-curve-unsupported-definition-type = { $subject }: йина йоцу къевлинчу функцин билгалдаккхаран тайпа «{ $definitionType }»; тӀаьхье дӀатесна.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементан flipFunctions атрибут йина яц; тӀаьхье дӀатесна.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формулица делла бераша функцеш бен ца оьцу; тӀаьхье дӀатесна.

prefigure-label-position-unsupported =
    { $subject }: йина йоцу labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] сизийн доьзалан хьаьркана
       *[point] тӀадаман хьаьркана
    }; PreFigure-н бух болу нисдар пайдаоьцу.

prefigure-fill-style-unsupported = { $subject }: дузоран стиль «{ $fillStyle }» PreFigure тӀе йина яц; ерриг дузоре доьрзу.

prefigure-line-style-unknown = { $subject }: ца бевзаш болу сизан стиль «{ $lineStyle }» PreFigure аракхетарера дӀабаьккхина.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркеран стиль «{ $markerStyle }» PreFigure «diamond» стилца нисбина.

prefigure-marker-style-unsupported = { $subject }: маркеран стиль «{ $markerStyle }» PreFigure тӀе йина яц; бух болу стиль пайдаоьцу.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: нийса доцу `ref`; Ӏалашо хьаьрчош ца лой. Билгалдар дӀадаьккхина.

annotation-ref-multiple-targets = `<annotation>`: `ref` дукхачу Ӏалашонашца хьаьрчина; хьалхарниг пайдаоьцу.

annotation-ref-outside-graph = `<annotation>`: нийса доцу `ref`; Ӏалашо иза чохь болчу графикех арахьа ю. Билгалдар дӀадаьккхина.

annotation-ref-unsupported-target = `<annotation>`: нийса доцу `ref`; Ӏалашо prefigure дерзорехь йина график объект яц. Билгалдар дӀадаьккхина.

annotation-text-missing = `<annotation>`: `text` яц я ерриг яц; ерриг йоцу текст аракхуьйсу.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Гуонан хьажар карийна.
       *[other] `<{ $componentType }>` компонент чохь болу гуонан хьажар карийна.
    }

reference-no-referent = Хьажоранна объект ца карийна: `{ $reference }`

reference-multiple-referents = Хьажоранна дукха объекташ карийна: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементан { $attribute } атрибутан формат нийса яц.

children-invalid = `<{ $componentType }>` тӀе нийса доцу бераш: нийса доцу бераш карийна: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибутана нийса боцу мах `{ $value }`; `{ $default }` мах пайдаоьцу

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } верси ца карийна.
       *[other] DoenetML { $version } верси ца карийна. { $fallback } верси пайдаоьцу
    }

## Reading the DoenetML

parse-invalid-doenetml = Нийса доцу DoenetML: { $content }

parse-tag-missing-close-tag = Нийса доцу DoenetML: `{ $tag }` теган дӀакъовлу тег яц. Ша дӀакъовлу тег я `</{ $tagName }>` тег хьоьхуш яра.

parse-tag-error = Нийса доцу DoenetML: `<{ $tagName }>` тегехь гӀалат

parse-attribute-missing-value = Нийса доцу DoenetML: `{ $attribute }` атрибутехь мах ца тоьуш санна бу.

parse-attribute-invalid = Нийса доцу DoenetML: нийса йоцу атрибут `{ $attribute }`

parse-attribute-value-invalid = Нийса доцу DoenetML: атрибутан нийса боцу мах `{ $value }`

parse-attribute-value-quote-mismatch = Нийса доцу DoenetML: атрибутан нийса боцу мах `{ $value }`. Кавычкаш ца богӀу. `{ $quote }` ца тоьуш санна ю

parse-open-tag-name-missing = Нийса доцу DoenetML: цӀе йоцу тег карийна, масала `<`

parse-tag-not-closed = Нийса доцу DoenetML: `{ $tag }` тег дӀакъевлина яц (`>` ца тоьуш санна ю).

parse-self-closing-tag-name-missing = Нийса доцу DoenetML: цӀе йоцу тег карийна `<{ $content }>`

parse-self-closing-tag-not-closed = Нийса доцу DoenetML: `{ $tag }` тег дӀакъевлина яц (`/>` ца тоьуш санна ю).

parse-tag-invalid-attributes = Нийса доцу DoenetML: `{ $tag }` тег тоьшалуш яц. Цуьнан атрибуташ нийса ца хила тарло.

parse-close-tag-name-missing = Нийса доцу DoenetML: цӀе йоцу дӀакъовлу тег карийна, масала `</`

parse-attribute-value-unquoted = Атрибутан мехаш кавычкийн чохь хила деза: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Нийса доцу DoenetML: `{ $tag }` дӀакъовлу тег карийна, амма цунна тоьшалу йоллу тег яц

parse-close-tag-mismatched = Нийса доцу DoenetML: ца богӀу дӀакъовлу тег. `</{ $expected }>` хьоьхуш яра. `{ $found }` карийна

parser-node-unconvertible = { $node } узел Dast узеле дерза ца делира.

## Names

name-attribute-invalid =
    Нийса йоцу атрибут name='{ $name }'. { $reason ->
        [characters] ЦӀерашкахь элпаш, терахьаш, кӀелхьара сизаш я сизаш бен хила ца тарло.
       *[start] ЦӀераш элпаца йолалуш хила еза.
    }

component-name-invalid-start = Нийса йоцу компонентан цӀе «{ $name }». ЦӀераш элпаца йолалуш хила еза.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched тайпанан answer video атрибутца хила беза

answer-video-watched-video-not-reference = videoWatched тайпанан answer-н video атрибут хьажор хила еза

answer-name-not-single-text = answer-н name атрибутехь цхьа текстан бер бен хила ца деза

## Referencing another document

external-doenetml-recursion-limit = Рекурсин тӀегӀанаш тӀех дукха ду, цундела арахьара DoenetML эца ца делира. Гуонан хьажор яц те?

external-doenetml-unavailable = { $attribute }="{ $uri }" адресера DoenetML эца ца делира

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адресера нийса доцу DoenetML эцна: иза «{ $componentType }» компонентан тайпанна ца тоьира

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут йоьхна; цуьнан метта `{ $to }` пайдаэца.
       *[other] [deprecation] `<{ $component }>` элементан `{ $from }` атрибут йоьхна; цуьнан метта `{ $to }` пайдаэца.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут йоьхна а, хьесапе ца оьцу а, хӀунда аьлча `{ $to }` а елла.
       *[other] [deprecation] `<{ $component }>` элементан `{ $from }` атрибут йоьхна а, хьесапе ца оьцу а, хӀунда аьлча `{ $to }` а елла.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементан `{ $attribute }` атрибут йоьхна а, хьесапе ца оьцу а.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элементан `{ $attribute }` атрибут йоьхна; цуьнан метта `<{ $child }>` бер пайдаэца.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элементан `{ $attribute }` атрибутан `{ $value }` мах бухбаьлла; цуьнан метта `{ $to }` пайдаэца.


## Language coverage

pluralize-english-only = `<pluralize>` дукхаллин терахь ингалсан маттахь бен дан ца лой, цундела { $locale } маттахь язйинчу документехь цуьнан текст ца хийцалуш йисна. Дукхаллин кеп ахьа язъе я иза `pluralForm` атрибутца ло.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент бевзаш болу Doenet элемент бац.

schema-element-not-allowed-at-root = `<{ $tag }>` элементана документан орамехь бакъо ца ло.

schema-element-not-allowed-inside = `<{ $tag }>` элементана `<{ $parent }>` чохь бакъо ца ло.

schema-attribute-unrecognized = `<{ $tag }>` элементехь `{ $attribute }` цӀе йолу атрибут яц.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементан `{ $attribute }` атрибут хӀор элемент хӀокхарех цхьаъ болу список хила еза: { $allowed }
       *[other] `<{ $tag }>` элементан `{ $attribute }` атрибут хӀокхарех цхьаъ хила еза: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select тӀе нийса йоцу вариантан цӀе. { $variantName } вариантан цӀе { $numOptions } харжамехь карайо, харжа езаш ерг ткъа { $numToSelect } ю.

select-variant-name-without-options = select тӀе варианташ елла, амма хила тарлучу вариантан цӀарна цхьа харжам а бац: { $variantName }.

select-variant-name-not-possible = select тӀе делла { $variantName } вариантан цӀе хила тарлун вариантан цӀе яц.

select-too-few-options = Дерриг { $numOptions } юкъара { $numToSelect } компонент харжа ца лой.

select-from-sequence-too-few-values = Дохалла { $length } йолчу тайпанах { $numToSelect } мах харжа ца лой.

select-from-sequence-indices-count-mismatch = select тӀе делла индексийн дукхалла харжа езачу дукхаллина тоьа еза

select-from-sequence-indices-not-integers = select тӀе делла массо индексаш дийна терахь хила еза

select-from-sequence-index-excluded = selectfromsequence тӀе делла индекс дӀаяьккхина яра

select-from-sequence-indices-excluded-combination = selectfromsequence тӀе делла индексаш дӀаяьккхина цхьаьнакхетар дара

select-from-sequence-coprime-not-positive-integers = Плюсан дийна терахьаш ца хаьржина, цундела вовшашна хьалха доцу цхьаьнакхетарш харжа ца лой.

select-from-sequence-coprime-common-factor = Вовшашна хьалха доцу терахьаш харжа ца лой. Массо хила тарлучу механ цхьаьнан декъархо бу. (Делла "from" я "to" мехаш "step"-ца вовшашна хьалха доцуш хила деза.)

select-from-sequence-coprime-single-number = 1 йоцчу цхьана терахьах вовшашна хьалха доцу цхьаьнакхетарш харжа ца лой.

select-from-sequence-excluded-too-many-combinations = selectFromSequence чохь цхьаьнакхетарийн 70%-нал дукхачарех дӀадаьхна

select-from-sequence-coprime-none-found = Вовшашна хьалха доцу терахьаш харжа ца делира. Массо хила тарлучу механ цхьаьнан декъархо бу.

select-from-sequence-too-few-unique-values = Дохалла { $numPossibleValues } йолчу тайпанах { $numToSelect } башха мах харжа ца лой

select-prime-numbers-too-few-values = Дохалла { $numValues } йолчу хьалхарчу терахьийн спискех { $numToSelect } мах харжа ца лой

select-prime-numbers-values-count-mismatch = select тӀе делла мехийн дукхалла харжа езачу дукхаллина тоьа еза

select-prime-numbers-values-not-prime = select prime number тӀе делла массо мехаш хьалхарчу терахьийн спискехь хила деза

select-prime-numbers-values-excluded-combination = selectPrimeNumbers тӀе делла мехаш дӀаяьккхина цхьаьнакхетар дара

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers чохь цхьаьнакхетарийн 70%-нал дукхачарех дӀадаьхна

select-random-combination-fluke = ТӀех хила ца тарлучу хӀуманца ца хууш болчу мехийн цхьаьнакхетар харжа ца делира

select-random-value-fluke = ТӀех хила ца тарлучу хӀуманца ца хууш болу мах харжа ца делира
