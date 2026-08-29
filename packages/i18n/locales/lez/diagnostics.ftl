# Lezgian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Cyrillic, the 1938 orthography Dagestan's schools, press and publishing use,
# and what CLDR fills a bare `lez` in as. The palochka Ӏ is a letter, not a
# Latin I and not a digit 1.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Lezgian has no noun classes and no grammatical gender, so nothing here forks
# on `$gender`; the reason that is worth saying out loud in a Northeast
# Caucasian catalog is written out in `content.ftl`. The plural categories are
# `one` and `other`, and a noun after a numeral stays singular, so the two
# branches of every count read alike apart from the number.
#
# Lezgian's case endings cannot be welded to a placeable, and this file needs
# one constantly: almost every message names a component, an attribute or a
# value that arrives as an argument and would want a genitive, a dative or one
# of the locatives on it. The way out throughout is the first one the README
# lists — **name what the value is** — so the ending falls on a noun this
# catalog writes: «`<{ $component }>` компонентдихъ …», «{ $column } тӀвар алай
# столбец», «{ $attribute } атрибутда», «{ $attribute }="{ $uri }" адресдай».
# A reviewer who deletes one of those nouns has to put the case somewhere else,
# not onto the placeable.
#
# The technical vocabulary is Russian, because that is what a Lezgian speaker
# who studied mathematics or computing studied it in: «компонент», «атрибут»,
# «функция», «индекс», «переменная», «последовательность», «матрица». Words
# that are ordinary prose are Lezgian. «велед» for a child component and
# «агакьунвал» for accessibility are this seed's own coinages, and are the two
# terms a speaker is most likely to want to replace.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] кьве кьилин нукьта къалурнавайла { $attributes } гьисаба кьазвач
       *[other] кьве кьилин нукьта къалурнавайла { $attributes } гьисаба кьазвач
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] кьилин нукьта ва юкьван нукьта кьведни къалурнавайла { $attributes } гьисаба кьазвач
       *[other] кьилин нукьта ва юкьван нукьта кьведни къалурнавайла { $attributes } гьисаба кьазвач
    }

line-segment-midpoint-offset-without-midpoint = юкьван нукьта авачиз midpointOffset кардик акатзавач

## `<line>`

line-points-undetermined-dimensions = Тайин тушир измерениер авай нукьтайрай физвай дуьз цӀар.

line-points-too-few-dimensions = Дуьз цӀар кьве ва я мадни гзаф измерение авай нукьтайрай фин лазим я.

line-points-depend-on-variables = Дуьз цӀар переменнайрилай аслу тир нукьтайрай физва: { $variables }.

line-equation-invalid-format = { $variable1 } ва { $variable2 } переменнаяр авай дуьз цӀарцӀин уравненидин формат дуьз туш.

## `<ray>`

ray-overprescribed-through = Луч through, endpoint ва direction атрибутри тайинарнава. Къалурнавай through гьисаба кьазвач.

ray-dimension-mismatch = Лучда numDimensions кьазвач.

## `<vector>`

vector-overprescribed-head = Вектор head, tail ва displacement атрибутри тайинарнава. Къалурнавай head гьисаба кьазвач.

vector-dimension-mismatch = Векторда numDimensions кьазвач.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` компонентдихъ nearestPoint статусдин переменная авачирвиляй, адаз ялиз жезвач.

constrain-to-without-nearest-point = `<{ $component }>` компонентдихъ nearestPoint статусдин переменная авачирвиляй, адал сергьятар эцигиз жезвач.

constrain-to-interior-without-nearest-point = `<{ $component }>` компонентдихъ nearestPoint статусдин переменная авачирвиляй, адан къенепатал сергьятар эцигиз жезвач.

## `<choiceInput>`

choice-input-label-position-ignored = inline тушир choiceInput патал labelPosition гьисаба кьазвач

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput патал къалурнавай indices гьисаба кьазвач: индексрин кьадар choice веледрин кьадардихъ галаз кьазвач.

pretzel-indices-count-mismatch = problem патал къалурнавай indices гьисаба кьазвач: индексрин кьадар problem веледрин кьадардихъ галаз кьазвач.

shuffle-indices-count-mismatch = shuffle патал къалурнавай indices гьисаба кьазвач: индексрин кьадар компонентрин кьадардихъ галаз кьазвач.

indices-ignored-out-of-range = { $component } патал къалурнавай indices гьисаба кьазвач: бязи индексар сергьятдилай элячӀнава.

pretzel-indices-repeated = pretzel патал къалурнавай indices гьисаба кьазвач: бязи индексар тикрар хьанва.

pretzel-circuit-first-index = circuit режимда авай pretzel патал къалурнавай indices гьисаба кьазвач: сифте индекс 1 хьун лазим я.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` строкадин веледрихъ галаз кӀвалахун патал `type` атрибут къалурун лазим я.

invalid-type-defaulting-to-math = { $component } компонент патал { $type } тип дуьз туш. Ам math, text, number ва я boolean тайпайрикай сад хьун лазим я. math ишлемишзава.

string-not-valid-component-to-arrange = "{ $value }" строка { $component } патал дуьз компонент туш. Гьисаба кьазвач.

## Types and variables

invalid-type-defaulting-to-number = { $type } тип дуьз туш, тип number яз эцигзава.

invalid-variable-value = Переменнадин дуьз тушир къимет: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариантдин индекс число хьун лазим я

variant-index-must-be-integer = { $index } вариантдин индекс тамам число хьун лазим я

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют алцумунар патал кьилиз акъуднавач. Гьяркьуьвилер нисбат яз эцигзава.

side-by-side-absolute-margins = `<{ $component }>` абсолют алцумунар патал кьилиз акъуднавач. Къерехар нисбат яз эцигзава.

side-by-side-no-block-child = Дуьз тушир `<{ $component }>`: адахъ са блокдин велед ятӀани хьун лазим я.

## `<label>`

label-for-ignored-on-graphical = Графикадин `<label>`-дал алай `for` атрибут гьисаба кьазвач.

label-for-must-resolve-to-one = `<label>`-дал алай `for` атрибут анжах са компонентдиз тайин хьун лазим я.

label-for-unresolved = `<label>`-дал алай `for` атрибут са компонентдизни тайинариз хьанач.

label-for-answer-with-authored-inputs = `<label>`-дал алай `for` атрибутди кхьенвай вводар авай `<answer>` компонентдиз къалурзава; вводдиз дуьм-дуьз къалура.

label-for-answer-without-input = `<label>`-дал алай `for` атрибутди тӀвар гудай ввод авачир `<answer>` компонентдиз къалурзава.

label-for-must-reference-input-or-answer = `<label>`-дал алай `for` атрибутди вводдиз ва я `<answer>` компонентдиз къалурун лазим я.

## Accessibility

accessibility-short-description-or-decorative = Агакьунвал патал `<{ $component }>` компонентдихъ куьруь баян хьун, ва я ам безекдин яз къалурун лазим я.

accessibility-video-short-description = Агакьунвал патал `<video>` компонентдихъ куьруь баян хьун лазим я.

accessibility-input-short-description-or-label = Агакьунвал патал `<{ $component }>` компонентдихъ куьруь баян ва я тӀвар хьун лазим я.

accessibility-answer-input-short-description-or-label = Агакьунвал патал ввод туькӀуьрзавай `<answer>` компонентдихъ куьруь баян ва я тӀвар хьун лазим я.

accessibility-short-description-contains-math = Куьруь баянра `<{ $component }>` хьтин математикадин компонентар хьун лазим туш. Математика гафаралди кхьихь.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } рангунин контраст кьилин тӀварцӀин текст патал бес туш (мичӀи режим) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; гьич хьайитӀани { $threshold }:1 лазим я).
       *[other] { $colorName } рангунин контраст кьилин тӀварцӀин текст патал бес туш ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; гьич хьайитӀани { $threshold }:1 лазим я).
    }

## `<circle>`

circle-through-points-non-numerical = Нукьтайрихъ числодин къиметар авачирла, { $count } нукьтадай физвай `<circle>` гьеле кьилиз акъуднавач.

circle-too-many-through-points = Пуд нукьтадилай гзаф нукьтадай физвай гьалкъа гьисабиз жезвач.

circle-overprescribed-radius-center-points = Радиус, юкь ва фидай нукьтаяр къалурнавай гьалкъа гьисабиз жезвач.

circle-center-with-multiple-points = Къалурнавай юкь аваз са нукьтадилай гзаф нукьтадай физвай гьалкъа гьисабиз жезвач.

circle-radius-too-small = Гьалкъа гьисабиз жезвач: кьве нукьтадин арада авай мензил { $distance } тирвиляй, къалурнавай { $radius } радиус лап гъвечӀи я.

circle-radius-with-many-points = Радиус къалурнаваз кьве нукьтадилай гзаф нукьтадай физвай гьалкъа туькӀуьриз жезвач.

circle-invalid-center-or-through-points = Гьалкъадин юкь ва я адай физвай нукьтаяр дуьз туш.

circle-radius-center-with-multiple-points = Къалурнавай юкь аваз са нукьтадилай гзаф нукьтадай физвай гьалкъадин радиус гьисабиз жезвач.

circle-change-radius-non-numerical = Числодин къиметар авачир нукьтадай физвай гьалкъадин радиус дегишиз жезвач

circle-radius-with-points-non-numerical = Числодин къиметар авачирла, радиус къалурнаваз са нукьтадилай гзаф нукьтадай физвай гьалкъа туькӀуьриз жезвач.

circle-change-center-non-numerical = Числодин къиметар авачир нукьтадай физвай гьалкъадин юкь дегишун гьеле кьилиз акъуднавач.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функциядин областдин измерениер бес туш. Областда { $intervals } интервал ава, амма функциядихъ { $inputs ->
            [one] { $inputs } ввод
           *[other] { $inputs } ввод
        } ава.
       *[other] Функциядин областдин измерениер бес туш. Областда { $intervals } интервал ава, амма функциядихъ { $inputs ->
            [one] { $inputs } ввод
           *[other] { $inputs } ввод
        } ава.
    }

function-domain-invalid-format = Функциядин областдин формат дуьз туш.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функциядин числодин тушир максимум гьисаба кьазвач.
        [minimum] Функциядин числодин тушир минимум гьисаба кьазвач.
        [extremum] Функциядин числодин тушир экстремум гьисаба кьазвач.
        [point] Функциядин числодин тушир нукьта гьисаба кьазвач.
        [slope] Функциядин числодин тушир наклон гьисаба кьазвач.
       *[other] Функциядин числодин тушир { $type } гьисаба кьазвач.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функциядин ичӀи максимум гьисаба кьазвач.
        [minimum] Функциядин ичӀи минимум гьисаба кьазвач.
        [extremum] Функциядин ичӀи экстремум гьисаба кьазвач.
        [point] Функциядин ичӀи нукьта гьисаба кьазвач.
       *[other] Функциядин ичӀи { $type } гьисаба кьазвач.
    }

function-points-too-close = Функцияда чкаяр сад-садаз лап мукьва тир кьве нукьта ава. Функция тайинариз жезвач.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функциядин итерацияр анжах функциядин вводрин кьадар выходрин кьадардихъ галаз сад тирла жеда. И функциядихъ { $inputs } ввод ва { $outputs ->
            [one] { $outputs } выход
           *[other] { $outputs } выход
        } ава.
       *[other] Функциядин итерацияр анжах функциядин вводрин кьадар выходрин кьадардихъ галаз сад тирла жеда. И функциядихъ { $inputs } ввод ва { $outputs ->
            [one] { $outputs } выход
           *[other] { $outputs } выход
        } ава.
    }

## `<sequence>`

sequence-invalid-length = Последовательностдин яргъивал дуьз туш. Ам манфи тушир тамам число хьун лазим я.

sequence-invalid-step = Последовательностдин кам дуьз туш. { $type } тип авай последовательность патал ам число хьун лазим я.

sequence-invalid-endpoint-number = number типдин последовательностдин "{ $attribute }" дуьз туш. Ам число хьун лазим я.

sequence-invalid-endpoint-letters = letters типдин последовательностдин "{ $attribute }" дуьз туш. Ам гьарфарин кутӀунвал хьун лазим я.

sequence-invalid-endpoint = Последовательностдин "{ $attribute }" дуьз туш.

select-from-sequence-coprime-not-numbers = числояр хкязвачирвиляй coprime гьисаба кьазвач

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations къалурнавайвиляй coprime гьисаба кьазвач

## Resolving a `target`

target-not-found = `<{ $source }>` патал дуьз тушир target: target жагъанач.

target-state-variable-not-found = `<{ $source }>` патал дуьз тушир target: `<{ $component }>` компонентдал "{ $property }" тӀвар алай статусдин переменная жагъанач.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` компонентдин переменнаяр аслу тушир переменнадивай тафаватлу хьун лазим я.

ode-system-duplicate-variable-names = Тикрар жезвай аслу переменнайрин тӀварар аваз ОДУ-дин эрчӀи патан функцияр тайинариз жезвач.

ode-system-rhs-function-error = ОДУ-дин эрчӀи патан функция тайинариз жезвач. mathjs функция туькӀуьрдайла гъалатӀ хьана.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } дуьз цӀарцӀин арада авай пипӀ тайинариз жезвач

angle-invalid-through-point = `<angle>` компонентдин through-да дуьз тушир нукьта ава

parabola-vertex-too-many-points = КӀукӀ аваз са нукьтадилай гзаф нукьтадай физвай парабола гьеле кьилиз акъуднавач.

parabola-too-many-points = Пуд нукьтадилай гзаф нукьтадай физвай парабола гьеле кьилиз акъуднавач.

intersection-too-many-items = Кьве затӀунилай гзаф затӀарин пересечение гьеле кьилиз акъуднавач

## Other math components

ionic-compound-not-two-ions = Кьве иондилай маса затӀарин иондин кутӀунвал гьеле кьилиз акъуднавач.

ionic-compound-needs-cation-and-anion = Иондин кутӀунвал анжах са катион ва са анион патал кьилиз акъуднава.

solve-equations-cannot-evaluate = Уравнение гьялиз жезвач, ам къиметламишиз хьаначирвиляй: { $equation }

math-operators-operand-number-required = Математикадин операнд къачудайла operandNumber къалурун лазим я.

eigen-decomposition-failed = Матрицадин собственный къиметар гьисабиз хьанач

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр шаблонда авач, гьавиляй ада гьамиша ичӀи чка кьада.
       *[other] `<matchesPattern>`: { $parameters } параметрар шаблонда авач, гьавиляй абуру гьамиша ичӀи чка кьада.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" гъавурда акьаз жезвач. Ам none, medium, dense ва я пробелди чара авунвай кьве позитив число хьун лазим я, месела grid="1 0.5". Сетка эцигзавач.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` компонентдиз { $expected ->
        [one] са выход авай — гьар са нукьтада авай y' наклон, месела `y - x` —
       *[other] кьве выход авай — гьар са нукьтада авай вектор, месела `(y, -x)` —
    } функция лазим я, амма ганвай функциядихъ { $found ->
        [one] { $found } выход
       *[other] { $found } выход
    } ава. { $alternative ->
        [none] ЗатӀни къалурзавач.
       *[other] А функция патал `<{ $alternative }>` компонент кутугнава. ЗатӀни къалурзавач.
    }

field-function-attribute-ignored-with-child = `function` атрибут гьисаба кьазвач, вучиз лагьайтӀа функция компонентдин къенени ганва; къенепатан функция ишлемишзава. Функция кьве рекьяй анжах садалди це.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибутди компонентдин къене дуьм-дуьз кхьенвай ибарадин переменнайриз тӀвар гузва. { $reason ->
        [function-child] Ина функция `<function>` велед яз ганва, ада вичин переменнайриз вичи тӀвар гузва, гьавиляй `variables` гьисаба кьазвач.
       *[no-expression] Ина ихьтин ибара ганвач, гьавиляй `variables` гьисаба кьазвач.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure къалурдайда xLabelPosition="left" хуьзвач; эрчӀи патан къайда ишлемишзава.

prefigure-y-label-position-unsupported = `<graph>`: prefigure къалурдайда yLabelPosition="bottom" хуьзвач; винел патан къайда ишлемишзава.

prefigure-invalid-axis-bounds = `<graph>`: prefigure-диз элкъуьрун патал осьрин сергьятар дуьз туш; асул bbox (-10,-10,10,10) ишлемишзава.

prefigure-invalid-width = `<graph>`: prefigure-диз элкъуьрун патал гьяркьуьвал дуьз туш; асул диаграммадин гьяркьуьвал 425 ишлемишзава.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure-диз элкъуьрун патал aspectRatio дуьз туш; асул нисбат 1 ишлемишзава.

prefigure-grid-spacing-too-fine = `<graph>`: осьрин сергьятар патал сеткадин арадин мензил лап гъвечӀи я; prefigure къалурдайда сетка эцигзавач.

prefigure-annotations-not-rendered = `<graph>`: PreFigure къалурдайди ишлемишзавачирла, аннотацияр къалурзавач.

multiple-annotations-children = `<graph>`-да гзаф `<annotations>` велед жагъана; эхиримжидилай гъейри вири гьисаба кьазвач.

## Referring to other components

copy-unrecognized-component-type = Чир тежезвай компонентдин тип артухариз ва я куьчуьриз жезвач: { $type }.

copy-prop-not-found = { $component } типдин компонентдал { $property } проп жагъанач

collect-no-source = collect патал source жагъанач.

collect-invalid-component-type = `<{ $component }>` типдин компонентар кӀватӀиз жезвач, им дуьз тушир компонентдин тип я.

reference-index-unavailable = `{ $reference }` индексдиз къалуриз жезвач

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентдиз { $action } эвериз жезвач

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Малуматрин форма дуьз туш. ЦӀарарин яргъивилер сад хьиз туш. Жагъай чка — componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Малуматра столбецрин тӀварар тикрар жезва. Жагъай чка — componentIdx :{ $componentIdx }

data-frame-missing-column-name = Малуматрихъ столбецдин тӀвар галач. Жагъай чка — componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = И жавабдин award вич жавабдин тегди ракъурай жавабдилай аслу я, им фикирдиз текъвей нетижайрал гъида.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` авай контейнердин къене авай `<answer>`-дал `maxNumAttempts` эцигуни са затӀни ийизвач, алахъунрин кьадар контейнерди идара ийизвайвиляй. `maxNumAttempts` контейнердал эциг.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` авай маса контейнердин къене авай, `sectionWideCheckWork` авай контейнердал `maxNumAttempts` эцигуни са затӀни ийизвач, алахъунрин кьадар къецепатан контейнерди идара ийизвайвиляй. `maxNumAttempts` къецепатан контейнердал эциг.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality эцигнавачиз { $attributes } атрибутди са затӀни ийидач.
       *[other] symbolicEquality эцигнавачиз { $attributes } атрибутри са затӀни ийидач.
    }

answer-invalid-type = Жаваб патал дуьз тушир тип: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентдихъ тӀвар галачирвиляй, ам модулдин атрибут яз ишлемишиз жезвач

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонент модулдин атрибут яз ишлемишиз жезвач, вучиз лагьайтӀа `<module>` типдин компонентдихъ "{ $name }" атрибут хьанвайди я.

conditional-content-condition-ignored = case ва я else веледар авай `<conditionalContent>` компонентдал `condition` атрибут гьисаба кьазвач.

slider-markers-type-mismatch = Маркеррин тип слайдердин типдихъ галаз кьазвач.

pretzel-problem-needs-statement-and-answer = Дуьз тушир pretzel: гьар са `<problem>`-да са `<statement>` ва са `<answer>` хьун лазим я.

pretzel-circuit-first-problem-distractor = Дуьз тушир pretzel: mode="circuit" тирла, сифте `<problem>` дистрактор хьун жедач.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибут патал { $values } къимет дуьз туш; гьисаба кьазвач.
       *[other] `{ $attribute }` атрибут патал { $values } къиметар дуьз туш; гьисаба кьазвач.
    }

attribute-must-be-references = `{ $attribute }` атрибут патал `{ $value }` къимет дуьз туш. Атрибут `$`-дилай эгечӀзавай къалурунрикай ибарат хьун лазим я.

math-input-invalid-function-names = <mathInput>: { $attribute } атрибутда авай дуьз тушир функциядин тӀварар гьисаба кьазвач: { $names }. Гьар са тӀварцӀин къалурдай пай гьич хьайитӀани 2 лишандикай (гьарфар ва я дефисар) ибарат хьун лазим я; адан гуьгъуьниз ихтиярдин `|<mathspeak alternative>` пай атуз жеда.

## Building components from the source

component-type-invalid = Дуьз тушир компонентдин тип: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибут тикрариз жезвач.

attribute-invalid-for-component = `<{ $componentType }>` типдин компонент патал "{ $attribute }" атрибут дуьз туш.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стилдин тайинарунин контраст { $context ->
        [text-on-background] текстдин ранг фондин рангунихъ галаз
        [high-contrast] кьакьан контрастдин ранг холстунихъ галаз
        [line] цӀарцӀин ранг холстунихъ галаз
        [marker] маркердин ранг холстунихъ галаз
       *[text-on-canvas] текстдин ранг холстунихъ галаз
    } гекъигайла бес туш{ $mode ->
        [dark] { " (мичӀи режим)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; гьич хьайитӀани { $threshold }:1 лазим я).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стилдин тайинаруни экуь режим патал бес тир контраст гузвай рангар къалурнаватӀани, а къиметрикай къачунвай мичӀи режимдин текстдин рангуни фондин рангунихъ галаз бес тир контраст гузвач ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; гьич хьайитӀани { $threshold }:1 лазим я). { $suggestion ->
        [available] МичӀи режимда бес тир контраст хьун патал я экуь режимдин контраст артух ая (месела, { $lightAttribute }="{ $lightColor }" эциг), я тахьайтӀа мичӀи режимдин ранг эвез ая (месела, { $darkAttribute }="{ $darkColor }" эциг).
       *[none] МичӀи режимда бес тир контраст хьун патал экуь режимдин контраст артух ая, я тахьайтӀа къачунвай рангар textColorDarkMode ва/ва я backgroundColorDarkMode атрибутралди эвез ая.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стилдин тайинаруни экуь режим патал бес тир контраст гузвай текстдин ранг къалурнаватӀани, а къиметдикай къачунвай мичӀи режимдин текстдин рангуни холстунихъ галаз бес тир контраст гузвач ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; гьич хьайитӀани { $threshold }:1 лазим я). { $suggestion ->
        [available] МичӀи режимда бес тир контраст хьун патал я экуь режимдин контраст артух ая (месела, textColor="{ $lightColor }" эциг), я тахьайтӀа мичӀи режимдин ранг эвез ая (месела, textColorDarkMode="{ $darkColor }" эциг).
       *[none] МичӀи режимда бес тир контраст хьун патал экуь режимдин контраст артух ая, я тахьайтӀа къачунвай ранг textColorDarkMode атрибутдалди эвез ая.
    }

section-multiple-style-palettes = Кьилиз анжах са <stylePalette> хкяз жеда; эхиримжиди ишлемишзава.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } компонентдин уникал вариантар тайинариз жезвач: numToSelect манфи тушир тамам число туш.

variant-num-to-select-not-constant-number = { $component } компонентдин уникал вариантар тайинариз жезвач: numToSelect даим число туш.

variant-with-replacement-not-constant-boolean = { $component } компонентдин уникал вариантар тайинариз жезвач: withReplacement даим boolean туш.

variant-select-weight-disables-unique = selectWeight ва я selectForVariants къалурнавай хкягъун авайла, select патал уникал вариантар кардай акъудзава

variant-coprime-undetermined = { $component } компонентдин уникал вариантар тайинариз жезвач: coprime гьамиша false ятӀа тайинариз жезвач.

variant-attribute-not-constant = { $component } компонентдин уникал вариантар тайинариз жезвач: { $attribute } даим туш.

variant-attribute-not-number = { $component } компонентдин уникал вариантар тайинариз жезвач: { $attribute } число туш.

variant-attribute-wrong-type-for-sequence =
    { $type } типдин { $component } компонентдин уникал вариантар тайинариз жезвач: { $attribute } { $expected ->
        [letters-combination] гьарфарин кутӀунвал
        [math-expression] дуьз математикадин ибара
        [integer] тамам число
       *[number] число
    } туш.

variant-length-not-integer = { $component } компонентдин уникал вариантар тайинариз жезвач: length тамам число туш.

variant-sort-not-implemented = sort авай { $component } компонентдин уникал вариантар гьеле кьилиз акъуднавач

variant-exclude-combinations-not-implemented = excludeCombinations авай { $component } компонентдин уникал вариантар гьеле кьилиз акъуднавач

variant-math-exclude-not-implemented = exclude авай math типдин { $component } компонентдин уникал вариантар гьеле кьилиз акъуднавач

variant-non-constant-exclude-not-implemented = даим тушир exclude авай { $component } компонентдин уникал вариантар гьеле кьилиз акъуднавач

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure къалурдайда хуьзвач; эвлед гьисаба кьазвач.

prefigure-descendant-invalid-geometry = { $subject }: геометрия эхир авачирди ва я тамам туш; эвлед гьисаба кьазвач.

prefigure-curve-label-omitted = { $subject }: элкъуьрнавай кривойрин элементрал тӀварар хуьзвач; тӀвар эцигзавач.

prefigure-curve-unsupported-definition-type = { $subject }: кривой тайинарунин '{ $definitionType }' тип хуьзвач; эвлед гьисаба кьазвач.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves-дал алай flipFunctions атрибут хуьзвач; эвлед гьисаба кьазвач.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves-дал анжах formula типдин функциядин веледар хуьзва; эвлед гьисаба кьазвач.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] цӀарцӀин хизандин тӀвар
       *[point] нукьтадин тӀвар
    } патал '{ $labelPosition }' labelPosition хуьзвач; PreFigure-дин асул дуьзарун ишлемишзава.

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' ацӀурунин стиль PreFigure-ди хуьзвач; кӀеви ацӀурунал элкъвезва.

prefigure-line-style-unknown = { $subject }: '{ $lineStyle }' чир тежезвай цӀарцӀин стиль PreFigure-дин нетижадай акъудзава.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' маркердин стиль PreFigure-дин 'diamond' стилдал элкъуьрнава.

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' маркердин стиль PreFigure-ди хуьзвач; асул стиль ишлемишзава.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: дуьз тушир `ref`; нишан тайинариз жезвач. Аннотация эцигзавач.

annotation-ref-multiple-targets = `<annotation>`: `ref`-ди гзаф нишандиз къалурзава; сифте нишан ишлемишзава.

annotation-ref-outside-graph = `<annotation>`: дуьз тушир `ref`; нишан вич авай graph-дилай къецел ама. Аннотация эцигзавач.

annotation-ref-unsupported-target = `<annotation>`: дуьз тушир `ref`; нишан prefigure-диз элкъуьрдайла хуьзвай графикадин объект туш. Аннотация эцигзавач.

annotation-text-missing = `<annotation>`: `text` авач ва я ичӀи я; ичӀи текст акъудзава.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Элкъвей аслувал жагъана.
       *[other] `<{ $componentType }>` компонент квай элкъвей аслувал жагъана.
    }

reference-no-referent = Къалурун патал объект жагъанач: `{ $reference }`

reference-multiple-referents = Къалурун патал гзаф объект жагъана: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` компонентдин { $attribute } атрибутдин формат дуьз туш.

children-invalid = `<{ $componentType }>` патал веледар дуьз туш: дуьз тушир веледар жагъана: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибут патал `{ $value }` къимет дуьз туш, `{ $default }` къимет ишлемишзава

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } верси жагъанач.
       *[other] DoenetML { $version } верси жагъанач. { $fallback } версидал элкъвезва
    }

## Reading the DoenetML

parse-invalid-doenetml = Дуьз тушир DoenetML: { $content }

parse-tag-missing-close-tag = Дуьз тушир DoenetML: `{ $tag }` тегдихъ агалдай тег галач. Вич-вичи агалзавай тег ва я `</{ $tagName }>` тег хьун лазим я.

parse-tag-error = Дуьз тушир DoenetML: `<{ $tagName }>` тегда гъалатӀ ава

parse-attribute-missing-value = Дуьз тушир DoenetML: `{ $attribute }` атрибут дуьз туш, адахъ къимет галачиз аквазва.

parse-attribute-invalid = Дуьз тушир DoenetML: `{ $attribute }` атрибут дуьз туш

parse-attribute-value-invalid = Дуьз тушир DoenetML: `{ $value }` атрибутдин къимет дуьз туш

parse-attribute-value-quote-mismatch = Дуьз тушир DoenetML: `{ $value }` атрибутдин къимет дуьз туш. Кавычкаяр сад-садаз кьазвач. Ваз `{ $quote }` кими яз аквазва

parse-open-tag-name-missing = Дуьз тушир DoenetML: тӀвар галачир тег жагъана, месела `<`

parse-tag-not-closed = Дуьз тушир DoenetML: `{ $tag }` тег агалнавач (`>` кими яз аквазва).

parse-self-closing-tag-name-missing = Дуьз тушир DoenetML: тӀвар галачир тег жагъана `<{ $content }>`

parse-self-closing-tag-not-closed = Дуьз тушир DoenetML: `{ $tag }` тег агалнавач (`/>` кими яз аквазва).

parse-tag-invalid-attributes = Дуьз тушир DoenetML: `{ $tag }` тег дуьз туш. Адан атрибутар дуьз тахьун мумкин я.

parse-close-tag-name-missing = Дуьз тушир DoenetML: тӀвар галачир агалдай тег жагъана, месела `</`

parse-attribute-value-unquoted = Атрибутдин къиметар кавычкайра тун лазим я: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Дуьз тушир DoenetML: `{ $tag }` агалдай тег жагъана, амма адаз кутугай ахъайдай тег авач

parse-close-tag-mismatched = Дуьз тушир DoenetML: агалдай тег кьазвач. `</{ $expected }>` хьун лазим тир. `{ $found }` жагъана

parser-node-unconvertible = { $node } узел Dast узелдиз элкъуьриз хьанач.

## Names

name-attribute-invalid =
    Дуьз тушир атрибут name='{ $name }'. { $reason ->
        [characters] ТӀварара анжах гьарфар, числояр, подчёркиваниер ва я дефисар хьун жеда.
       *[start] ТӀварар гьарфуналди эгечӀун лазим я.
    }

component-name-invalid-start = "{ $name }" компонентдин тӀвар дуьз туш. ТӀварар гьарфуналди эгечӀун лазим я.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched тип авай жавабдихъ video атрибут хьун лазим я

answer-video-watched-video-not-reference = videoWatched тип авай жавабдин video атрибут къалурун хьун лазим я

answer-name-not-single-text = Жавабдин name атрибутдихъ анжах са текстдин велед хьун лазим я

## Referencing another document

external-doenetml-recursion-limit = Къецепатан DoenetML къачуз жезвач: рекурсиядин дережаяр гзаф я. Элкъвей къалурун авани?

external-doenetml-unavailable = { $attribute }="{ $uri }" адресдай DoenetML къачуз жезвач

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адресдай къачунвай DoenetML дуьз туш: ам "{ $componentType }" компонентдин типдихъ галаз кьазвач

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут ишлемишунай акъуднава; адан чкадал `{ $to }` ишлемиша.
       *[other] [deprecation] `<{ $component }>`-дал алай `{ $from }` атрибут ишлемишунай акъуднава; адан чкадал `{ $to }` ишлемиша.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут ишлемишунай акъуднава ва гьисаба кьазвач, вучиз лагьайтӀа `{ $to }` атрибутни къалурнава.
       *[other] [deprecation] `<{ $component }>`-дал алай `{ $from }` атрибут ишлемишунай акъуднава ва гьисаба кьазвач, вучиз лагьайтӀа `{ $to }` атрибутни къалурнава.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`-дал алай `{ $attribute }` атрибут ишлемишунай акъуднава ва гьисаба кьазвач.

deprecated-attribute-to-child = [deprecation] `<{ $component }>`-дал алай `{ $attribute }` атрибут ишлемишунай акъуднава; адан чкадал `<{ $child }>` велед ишлемиша.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>`-дал алай `{ $attribute }` атрибутдин `{ $value }` къимет ишлемишунай акъуднава; адан чкадал `{ $to }` ишлемиша.


## Language coverage

pluralize-english-only = `<pluralize>` анжах ингилис чӀалан гафар гзафвилин кьадардиз элкъуьриз алакьдайвиляй, { $locale } чӀалал кхьенвай документда адан текст дегиш тавуна амукьзава. Гзафвилин форма вуна дуьм-дуьз кхьихь, ва я ам `pluralForm` атрибутдалди къалура.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент Doenet-дин чир жезвай элемент туш.

schema-element-not-allowed-at-root = `<{ $tag }>` элементдиз документдин дувулда ихтияр авач.

schema-element-not-allowed-inside = `<{ $tag }>` элементдиз `<{ $parent }>` компонентдин къене ихтияр авач.

schema-attribute-unrecognized = `<{ $tag }>` элементдихъ `{ $attribute }` тӀвар алай атрибут авач.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементдин `{ $attribute }` атрибут списокдикай ибарат хьун лазим я, ва адан гьар са элемент ибурукай сад: { $allowed }
       *[other] `<{ $tag }>` элементдин `{ $attribute }` атрибут ибурукай сад хьун лазим я: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select патал дуьз тушир вариантдин тӀвар. { $variantName } вариантдин тӀвар { $numOptions } хкягъунра ава, амма хкядай кьадар { $numToSelect } я.

select-variant-name-without-options = select патал бязи вариантар къалурнава, амма мумкин тир вариантдин тӀвар патал хкягъунар къалурнавач: { $variantName }.

select-variant-name-not-possible = select патал къалурнавай { $variantName } вариантдин тӀвар мумкин тир вариантдин тӀвар туш.

select-too-few-options = Анжах { $numOptions } хкягъундикай { $numToSelect } компонент хкяз жезвач.

select-from-sequence-too-few-values = { $length } яргъивал авай последовательностдикай { $numToSelect } къимет хкяз жезвач.

select-from-sequence-indices-count-mismatch = select патал къалурнавай индексрин кьадар хкядай кьадардихъ галаз кьун лазим я

select-from-sequence-indices-not-integers = select патал къалурнавай вири индексар тамам числояр хьун лазим я

select-from-sequence-index-excluded = selectfromsequence патал къалурнавай индекс акъуднавайдакай тир

select-from-sequence-indices-excluded-combination = selectfromsequence патал къалурнавай индексар акъуднавай кутӀунвал тир

select-from-sequence-coprime-not-positive-integers = Позитив тамам числояр хкязвачирвиляй, coprime кутӀунвалар хкяз жезвач.

select-from-sequence-coprime-common-factor = Coprime числояр хкяз жезвач. Мумкин тир вири къиметрихъ санлай са делил ава. ("from" ва я "to" атрибутрин къалурнавай къиметар "step" атрибутдихъ галаз coprime хьун лазим я.)

select-from-sequence-coprime-single-number = 1 тушир са числодикай coprime кутӀунвалар хкяз жезвач.

select-from-sequence-excluded-too-many-combinations = selectFromSequence-да кутӀунвилерин 70%-дилай гзафбур акъуднава

select-from-sequence-coprime-none-found = Coprime числояр хкяз хьанач. Мумкин тир вири къиметрихъ санлай са делил ава.

select-from-sequence-too-few-unique-values = { $numPossibleValues } яргъивал авай последовательностдикай { $numToSelect } уникал къимет хкяз жезвач

select-prime-numbers-too-few-values = { $numValues } яргъивал авай простой числойрин списокдикай { $numToSelect } къимет хкяз жезвач

select-prime-numbers-values-count-mismatch = select патал къалурнавай къиметрин кьадар хкядай кьадардихъ галаз кьун лазим я

select-prime-numbers-values-not-prime = select prime number патал къалурнавай вири къиметар простой числойрин списокда хьун лазим я

select-prime-numbers-values-excluded-combination = selectPrimeNumbers патал къалурнавай къиметар акъуднавай кутӀунвал тир

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-да кутӀунвилерин 70%-дилай гзафбур акъуднава

select-random-combination-fluke = Лап мумкин тушир дуьшуьшдалди, кьисметдин къиметрин кутӀунвал хкяз хьанач

select-random-value-fluke = Лап мумкин тушир дуьшуьшдалди, кьисметдин къимет хкяз хьанач
