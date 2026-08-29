# Mansi diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# The technical nouns are the Russian ones, which is what written Mansi uses
# for them: «компонент», «атрибут», «функция», «индекс», «документ».
#
# `mns` is Mansi (мāньси лāтыӈ), Ob-Ugric, Sosva norm. This is the largest file
# in the locale and the least attested: no published Mansi text contains a
# parser error, a schema error or an attribute name, so **most of the wording
# below is coined**, on the pattern `content.ftl`'s header sets out — «ат
# ловиньтавē» "is not counted" for *is ignored*, «ат рōви» "is not permitted"
# for *cannot*, «ōлуӈкве ēри» "must be", «сыр» for *type*, «савит» for
# *number*, «вāрмаль» for *value*, «няврам» "child" for an element's children.
# A speaker's review is worth more here than anywhere else in the locale.
#
# A limit worth recording, shared with `locales/kca`: Mansi's causal
# postposition follows the clause it governs, so an English "X is ignored
# because Y" cannot be written as one Mansi sentence with the placeables in the
# order the renderer supplies them. Where English subordinates a reason, this
# catalog writes two sentences instead — an honest loss of connective force,
# not a translation of it.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] китыг ōвыл пāс мивēс ке, { $attributes } ат ловиньтавē
       *[other] китыг ōвыл пāс мивēс ке, { $attributes } ат ловиньтавē
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] ōвыл пāс ос кӯтюв пāс китыг мивēс ке, { $attributes } ат ловиньтавē
       *[other] ōвыл пāс ос кӯтюв пāс китыг мивēс ке, { $attributes } ат ловиньтавē
    }

line-segment-midpoint-offset-without-midpoint = кӯтюв пāс ат ōлы ке, midpointOffset нēматыр ат вāры

## `<line>`

line-points-undetermined-dimensions = Савит ат пāсыстувēс пāсыт хосыт минан линия.

line-points-too-few-dimensions = Линия сяр мāнь китыг савитыӈ пāс хосыт минуӈкве ēри.

line-points-depend-on-variables = Линия вēлтнэ вāрмалит ныл нōмтхатнэ пāсыт хосыт мины: { $variables }.

line-equation-invalid-format = { $variable1 } ос { $variable2 } вēлтнэ вāрмальпыг линия уравнение форма ат ёмас.

## `<ray>`

ray-overprescribed-through = Луч through, endpoint ос direction хосыт мивēс. Мим through ат ловиньтавē.

ray-dimension-mismatch = луч палт numDimensions ат аквсыр.

## `<vector>`

vector-overprescribed-head = Вектор head, tail ос displacement хосыт мивēс. Мим head ат ловиньтавē.

vector-dimension-mismatch = вектор палт numDimensions ат аквсыр.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элемент палт таӈхуӈкве ат рōви. Тав nearestPoint вēлтнэ вāрмалѐ ат ōлы.

constrain-to-without-nearest-point = `<{ $component }>` элемент ёт ӯргалаӈкве ат рōви. Тав nearestPoint вēлтнэ вāрмалѐ ат ōлы.

constrain-to-interior-without-nearest-point = `<{ $component }>` элемент кӣвыр ёт ӯргалаӈкве ат рōви. Тав nearestPoint вēлтнэ вāрмалѐ ат ōлы.

## `<choiceInput>`

choice-input-label-position-ignored = строка кӣвырт ат ōлнэ choiceInput палт labelPosition ат ловиньтавē

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput палт мим индексыт ат ловиньтавēт. Тāн савитаныл choice няврамыт савитаныл ёт ат аквсыр.

pretzel-indices-count-mismatch = problem палт мим индексыт ат ловиньтавēт. Тāн савитаныл problem няврамыт савитаныл ёт ат аквсыр.

shuffle-indices-count-mismatch = shuffle палт мим индексыт ат ловиньтавēт. Тāн савитаныл компонентыт савитаныл ёт ат аквсыр.

indices-ignored-out-of-range = { $component } палт мим индексыт ат ловиньтавēт. Матыраныл кӯтюв ныл кон нēглēгыт.

pretzel-indices-repeated = pretzel палт мим индексыт ат ловиньтавēт. Матыраныл мōт щёс хōнтвēсыт.

pretzel-circuit-first-index = circuit сырыл pretzel палт мим индексыт ат ловиньтавēт. Овыл индекс 1 ōлуӈкве ēри.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текст няврамыт ёт рӯпитаӈкве мāгыс `type` атрибут муӈкве ēри.

invalid-type-defaulting-to-math = { $component } компонент мāгыс ат ёмас сыр { $type }. Тав math, text, number манос boolean ōлуӈкве ēри. math вāравē.

string-not-valid-component-to-arrange = «{ $value }» строка { $component } палт рōвнэ компонент ат ōлы. Ат ловиньтавē.

## Types and variables

invalid-type-defaulting-to-number = Ат ёмас сыр { $type }, сырэ number ēмты.

invalid-variable-value = Вēлтнэ вāрмаль ат ёмас: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариант индекс савит ōлуӈкве ēри

variant-index-must-be-integer = { $index } вариант индекс тēлыг савит ōлуӈкве ēри

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолютный савитыт мāгыс ат вāрвēс. Хосаныл ёт-ёт вāруӈкве ēри.

side-by-side-absolute-margins = `<{ $component }>` абсолютный савитыт мāгыс ат вāрвēс. Вāтаныл ёт-ёт вāруӈкве ēри.

side-by-side-no-block-child = Ат ёмас `<{ $component }>`: тав сяр мāнь аква блок няврамыӈ ōлуӈкве ēри.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элемент `for` атрибут ат ловиньтавē.

label-for-must-resolve-to-one = `<label>` элемент `for` атрибут аква компонент палт нāӈктаӈкве ēри.

label-for-unresolved = `<label>` элемент `for` атрибут компонент ёт ат паттувēс.

label-for-answer-with-authored-inputs = `<label>` элемент `for` атрибут хансын хум пинум пинэ пēлыпыг `<answer>` палт нāӈкти; пинэ пēлы палт вāтгыл нāӈктэн.

label-for-answer-without-input = `<label>` элемент `for` атрибут пинэ пēлы ат ōлнэ `<answer>` палт нāӈкти.

label-for-must-reference-input-or-answer = `<label>` элемент `for` атрибут пинэ пēлы манос ювле лāтыӈ палт нāӈктаӈкве ēри.

## Accessibility

accessibility-short-description-or-decorative = Ёхтуӈкве рōвнэ вāрмаль мāгыс `<{ $component }>` вāт лāтыӈыӈ ōлуӈкве ēри, манос хӯрыӈ вāрмаль сырыл пāсыстаӈкве ēри.

accessibility-video-short-description = Ёхтуӈкве рōвнэ вāрмаль мāгыс `<video>` вāт лāтыӈыӈ ōлуӈкве ēри.

accessibility-input-short-description-or-label = Ёхтуӈкве рōвнэ вāрмаль мāгыс `<{ $component }>` вāт лāтыӈыӈ манос намыӈ ōлуӈкве ēри.

accessibility-answer-input-short-description-or-label = Ёхтуӈкве рōвнэ вāрмаль мāгыс пинэ пēлы вāрнэ `<answer>` вāт лāтыӈыӈ манос намыӈ ōлуӈкве ēри.

accessibility-short-description-contains-math = Вāт лāтыӈыт кӣвырт `<{ $component }>` сыр математика компонентыт ōлуӈкве ат ēри. Математика лāтыӈыл хансэн.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } яныг пēлы нуми текстэ мāгыс ēрын контраст ат ми (сэмыл сыр) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сяр мāнь { $threshold }:1 ēри).
       *[other] { $colorName } яныг пēлы нуми текстэ мāгыс ēрын контраст ат ми ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сяр мāнь { $threshold }:1 ēри).
    }

## `<circle>`

circle-through-points-non-numerical = Пāсыт савит вāрмаляныл ат ōлы ке, { $count } пāс хосыт минан `<circle>` ат вāрвēс.

circle-too-many-through-points = 3 ныл сав пāс хосыт минан круг ловиньтаӈкве ат рōви.

circle-overprescribed-radius-center-points = Мим радиус, кӯтюв ос пāсыт ёт круг ловиньтаӈкве ат рōви.

circle-center-with-multiple-points = Мим кӯтюв ёт 1 ныл сав пāс хосыт минан круг ловиньтаӈкве ат рōви.

circle-radius-too-small = Круг ловиньтаӈкве ат рōви: китыг пāс халт хоса { $distance }, мим радиус { $radius } сяр мāнь.

circle-radius-with-many-points = Мим радиус ёт китыг ныл сав пāс хосыт минан круг вāруӈкве ат рōви.

circle-invalid-center-or-through-points = Круг кӯтювэ манос пāсанэ ат ёмас.

circle-radius-center-with-multiple-points = Мим кӯтюв ёт 1 ныл сав пāс хосыт минан круг радиусэ ловиньтаӈкве ат рōви.

circle-change-radius-non-numerical = Савитыӈ ат ōлнэ пāсыӈ круг радиусэ вēлтуӈкве ат рōви

circle-radius-with-points-non-numerical = Савит вāрмалит ат ōлēгыт ке, мим радиус ёт аква ныл сав пāс хосыт минан круг вāруӈкве ат рōви.

circle-change-center-non-numerical = Савитыӈ ат ōлнэ пāсыт хосыт минан круг кӯтювэ вēлтнэ вāрмаль ат вāрвēс.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функция пāсыстам мāтэ савитэ ат ēри. Мā палт { $intervals } кӯтюв ōлы, функция палт { $inputs ->
            [one] { $inputs } пинэ вāрмаль
           *[other] { $inputs } пинэ вāрмаль
        } ōлы.
       *[other] Функция пāсыстам мāтэ савитэ ат ēри. Мā палт { $intervals } кӯтюв ōлы, функция палт { $inputs ->
            [one] { $inputs } пинэ вāрмаль
           *[other] { $inputs } пинэ вāрмаль
        } ōлы.
    }

function-domain-invalid-format = Функция пāсыстам мā форма ат ёмас.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функция савитыӈ ат ōлнэ максимумэ ат ловиньтавē.
        [minimum] Функция савитыӈ ат ōлнэ минимумэ ат ловиньтавē.
        [extremum] Функция савитыӈ ат ōлнэ экстремумэ ат ловиньтавē.
        [point] Функция савитыӈ ат ōлнэ пāсэ ат ловиньтавē.
        [slope] Функция савитыӈ ат ōлнэ сӯӈэ ат ловиньтавē.
       *[other] Функция савитыӈ ат ōлнэ { $type } вāрмалѐ ат ловиньтавē.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функция тагыл ат ōлнэ максимумэ ат ловиньтавē.
        [minimum] Функция тагыл ат ōлнэ минимумэ ат ловиньтавē.
        [extremum] Функция тагыл ат ōлнэ экстремумэ ат ловиньтавē.
        [point] Функция тагыл ат ōлнэ пāсэ ат ловиньтавē.
       *[other] Функция тагыл ат ōлнэ { $type } вāрмалѐ ат ловиньтавē.
    }

function-points-too-close = Функция палт аква-аква палт сяр мāтыт китыг пāс ōлы. Функция пāсыстаӈкве ат рōви.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функция итерацияте пинэ вāрмалит савит ос кон нēглын вāрмалит савит аквсыр ōлы ке, вāравē. Ты функция палт { $inputs } пинэ вāрмаль ос { $outputs ->
            [one] { $outputs } кон нēглын вāрмаль
           *[other] { $outputs } кон нēглын вāрмаль
        } ōлы.
       *[other] Функция итерацияте пинэ вāрмалит савит ос кон нēглын вāрмалит савит аквсыр ōлы ке, вāравē. Ты функция палт { $inputs } пинэ вāрмаль ос { $outputs ->
            [one] { $outputs } кон нēглын вāрмаль
           *[other] { $outputs } кон нēглын вāрмаль
        } ōлы.
    }

## `<sequence>`

sequence-invalid-length = Рāд хосатэ ат ёмас. Тав минус ат ōлнэ тēлыг савит ōлуӈкве ēри.

sequence-invalid-step = Рāд лēхэ ат ёмас. { $type } сырыӈ рāд мāгыс тав савит ōлуӈкве ēри.

sequence-invalid-endpoint-number = Савитыӈ рāд «{ $attribute }» вāрмалѐ ат ёмас. Тав савит ōлуӈкве ēри.

sequence-invalid-endpoint-letters = Буквайыӈ рāд «{ $attribute }» вāрмалѐ ат ёмас. Тав буквайыт акван-паттым ōлуӈкве ēри.

sequence-invalid-endpoint = Рāд «{ $attribute }» вāрмалѐ ат ёмас.

select-from-sequence-coprime-not-numbers = савитыт ат уртвēсыт. coprime ат ловиньтавē

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations мивēс. coprime ат ловиньтавē

## Resolving a `target`

target-not-found = `<{ $source }>` палт ат ёмас target: цель ат хōнтвēс.

target-state-variable-not-found = `<{ $source }>` палт ат ёмас target: `<{ $component }>` элемент палт «{ $property }» намыӈ вēлтнэ вāрмаль ат хōнтвēс.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` вēлтнэ вāрмаланэ тāнти вēлтнэ вāрмаль ныл мōт сыр ōлуӈкве ēри.

ode-system-duplicate-variable-names = Нōмтхатнэ вēлтнэ вāрмалит наманыл мōт щёс хōнтвēсыт ке, ДТ кāтпāл функцияте пāсыстаӈкве ат рōви.

ode-system-rhs-function-error = ДТ кāтпāл функцияте пāсыстаӈкве ат рōви. mathjs функция вāрнэ порат ошибка.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } линия халт сӯӈ пāсыстаӈкве ат рōви

angle-invalid-through-point = `<angle>` элемент through вāрмалѐ палт ат ёмас пāс

parabola-vertex-too-many-points = Мим нуми пāс ёт 1 ныл сав пāс хосыт минан парабола ат вāрвēс.

parabola-too-many-points = 3 ныл сав пāс хосыт минан парабола ат вāрвēс.

intersection-too-many-items = Китыг ныл сав вāрмаль сагрым мā ат вāрвēс

## Other math components

ionic-compound-not-two-ions = Китыг ион ныл мōт ион акван-паттым ат вāрвēс.

ionic-compound-needs-cation-and-anion = Ион акван-паттым аква катион ос аква анион мāгыс ӯнлы вāрвēс.

solve-equations-cannot-evaluate = Уравнение вāруӈкве ат рōви. Тав ловиньтаӈкве ат рōвыс: { $equation }

math-operators-operand-number-required = Математика операнд уртуӈкве мāгыс operandNumber муӈкве ēри.

eigen-decomposition-failed = Матрица тāнти вāрмаланэ ловиньтаӈкве ат рōвыс

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр образец кӣвырт ат хōнтхаты. Тав хōталь-ке тагыл ат ōлнэ вāрмаль ёт аквсыр.
       *[other] `<matchesPattern>`: { $parameters } параметрыт образец кӣвырт ат хōнтхатēгыт. Тāн хōталь-ке тагыл ат ōлнэ вāрмаль ёт аквсыр.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" вāрмаль ханисьтахтуӈкве ат рōви. Тав none, medium, dense манос тагыл ат ōлнэ пēлыл уртым китыг плюс савит ōлуӈкве ēри, хольт grid="1 0.5". Сетка ат хансавē.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` мāгыс { $expected ->
        [one] аква кон нēглын вāрмальпыг функция ēри — касыӈ пāс палт y' сӯӈ, хольт `y - x`
       *[other] китыг кон нēглын вāрмальпыг функция ēри — касыӈ пāс палт вектор, хольт `(y, -x)`
    }, мим функция палт { $found ->
        [one] { $found } кон нēглын вāрмаль
       *[other] { $found } кон нēглын вāрмаль
    } ōлы. { $alternative ->
        [none] Нēматыр ат хансавē.
       *[other] Ты функция мāгыс `<{ $alternative }>` компонент рōви. Нēматыр ат хансавē.
    }

field-function-attribute-ignored-with-child = `function` атрибут ат ловиньтавē. Функция компонент кӣвырт ос мивēс; кӣвыр функция вāравē. Функция китыг лēх ныл ӯнлы аква лēхыл мēн.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибут компонент кӣвырт вāтгыл хансым лāтыӈ вēлтнэ вāрмаланэ намтытэ. { $reason ->
        [function-child] Тыт функция `<function>` няврам сырыл мивēс, тав тāнти вēлтнэ вāрмаланэ намтытэ, ос `variables` ат ловиньтавē.
       *[no-expression] Тыт ты сыр лāтыӈ ат мивēс, ос `variables` ат ловиньтавē.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure хансын вāрмаль палт xLabelPosition="left" ат вāрвēс; кāтпāл пинэ вāрмаль вāравē.

prefigure-y-label-position-unsupported = `<graph>`: prefigure хансын вāрмаль палт yLabelPosition="bottom" ат вāрвēс; нуми пēлы пинэ вāрмаль вāравē.

prefigure-invalid-axis-bounds = `<graph>`: prefigure вēлтнэ вāрмаль мāгыс осьыт кӯтюваныл ат ёмас; овыл bbox (-10,-10,10,10) вāравē.

prefigure-invalid-width = `<graph>`: prefigure вēлтнэ вāрмаль мāгыс хоса ат ёмас; диаграмма овыл хосатэ 425 вāравē.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure вēлтнэ вāрмаль мāгыс aspectRatio ат ёмас; овыл пēлыт ёт-паттымыт 1 вāравē.

prefigure-grid-spacing-too-fine = `<graph>`: сетка лēхэ осьыт кӯтюваныл мāгыс сяр мāнь; prefigure хансын вāрмаль палт сетка ат нēглы.

prefigure-annotations-not-rendered = `<graph>`: PreFigure хансын вāрмаль ат вāравē ке, пāсыт ат хансавēт.

multiple-annotations-children = `<graph>` кӣвырт сав `<annotations>` няврам хōнтвēс; сяр ōвыл ныл мōт вāрмалит ат ловиньтавēт.

## Referring to other components

copy-unrecognized-component-type = Ат ханисьтам компонент сыр таӈхуӈкве манос копироватаӈкве ат рōви: { $type }.

copy-prop-not-found = { $component } сырыӈ компонент палт { $property } вāрмаль ат хōнтвēс

collect-no-source = collect палт овыл вāрмаль ат хōнтвēс.

collect-invalid-component-type = `<{ $component }>` сырыӈ компонентыт акван-атуӈкве ат рōви. Ты рōвнэ компонент сыр ат ōлы.

reference-index-unavailable = `{ $reference }` индекс палт ёт-паттым вāрмаль вāруӈкве ат рōви

## `<callAction>`

component-action-unavailable = `{ $reference }` компонент палт { $action } ӯвтуӈкве ат рōви

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Данныит сыраныл ат ёмас. Строкат хосаныл мōт сыр. Хōнтвēс componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Данныит палт столбец нам мōт щёс хōнтхаты. Хōнтвēс componentIdx :{ $componentIdx }

data-frame-missing-column-name = Данныит палт столбец нам ат ēри. Хōнтвēс componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ты ювле лāтыӈ award вāрмалѐ answer тег тāнти кēтум ювле лāтыӈе палт нōмтхаты, ос ат нōмтым вāрмаль нēглы.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` ёт контейнер кӣвырт ōлнэ `<answer>` палт `maxNumAttempts` пинэ вāрмаль нēматыр ат вāры. Щёсыт савит контейнер пāсысты. `maxNumAttempts` вāрмаль контейнер палт пинэн.

nested-section-wide-check-work-max-num-attempts = Мōт `sectionWideCheckWork` контейнер кӣвырт ōлнэ `sectionWideCheckWork` контейнер палт `maxNumAttempts` пинэ вāрмаль нēматыр ат вāры. Щёсыт савит кон контейнер пāсысты. `maxNumAttempts` вāрмаль кон контейнер палт пинэн.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality ат пинвēс ке, { $attributes } атрибут нēматыр ат вāры.
       *[other] symbolicEquality ат пинвēс ке, { $attributes } атрибутыт нēматыр ат вāрēгыт.
    }

answer-invalid-type = answer палт ат ёмас сыр: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонент наме ат ōлы. Тав модуль атрибут сырыл вāруӈкве ат рōви

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонент модуль атрибут сырыл вāруӈкве ат рōви. `<module>` компонент сыр палт «{ $name }» атрибут ань пāсыстым ōлы.

conditional-content-condition-ignored = case манос else няврамыӈ `<conditionalContent>` компонент палт `condition` атрибут ат ловиньтавē.

slider-markers-type-mismatch = Маркерыт сыраныл ползунок сырэ ёт ат аквсыр.

pretzel-problem-needs-statement-and-answer = Ат ёмас pretzel: касыӈ `<problem>` аква `<statement>` ос аква `<answer>` кӣвырт ōньсюӈкве ēри.

pretzel-circuit-first-problem-distractor = Ат ёмас pretzel: mode="circuit" сырыл овыл `<problem>` нōмт мōт мāн тотнэ вāрмаль ōлуӈкве ат ēри.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибут мāгыс ат ёмас вāрмаль { $values }; ат ловиньтавē.
       *[other] `{ $attribute }` атрибут мāгыс ат ёмас вāрмалит { $values }; ат ловиньтавēт.
    }

attribute-must-be-references = `{ $attribute }` атрибут мāгыс ат ёмас вāрмаль `{ $value }`. Атрибут `$` пāс ныл нēглын ёт-паттым вāрмалит ныл ōлуӈкве ēри.

math-input-invalid-function-names = <mathInput>: { $attribute } кӣвырт ат ёмас функция намыт ат вувēсыт: { $names }. Касыӈ нам сунсын пēлые сяр мāнь 2 пāс ōлуӈкве ēри (буквайыт манос кӯтюв ёт-паттым); тав юи-пāлт ат ēрнэ `|<mathspeak мōт сыр>` мōт вāрмаль ёхтуӈкве рōви.

## Building components from the source

component-type-invalid = Ат ёмас компонент сыр: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибут мōт щёс вāруӈкве ат рōви.

attribute-invalid-for-component = `<{ $componentType }>` сырыӈ компонент мāгыс ат ёмас атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль пāсыстан вāрмаль палт { $context ->
        [text-on-background] текст сыр ос кӣвыр сыр
        [high-contrast] яныг контрастыӈ сыр ос хансын мā
        [line] линия сыр ос хансын мā
        [marker] маркер сыр ос хансын мā
       *[text-on-canvas] текст сыр ос хансын мā
    } халт контраст ат ēри{ $mode ->
        [dark] { " (сэмыл сыр)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сяр мāнь { $threshold }:1 ēри).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль пāсыстан вāрмаль палт мим сырыт яӈк сыр мāгыс ēрын контраст мисыт, но тāн ныланыл нēглын сэмыл сырыт текст ос кӣвыр халт ēрын контраст ат мēгыт ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сяр мāнь { $threshold }:1 ēри). { $suggestion ->
        [available] Сэмыл сыр палт ēрын контраст мāгыс яӈк сыр контрастэ яныгыг вāрен (хольт { $lightAttribute }="{ $lightColor }"), манос сэмыл сыр сырэ вēлтэн (хольт { $darkAttribute }="{ $darkColor }").
       *[none] Сэмыл сыр палт ēрын контраст мāгыс яӈк сыр контрастэ яныгыг вāрен манос нēглын сырыт textColorDarkMode ос/манос backgroundColorDarkMode хосыт вēлтэн.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль пāсыстан вāрмаль палт мим текст сыр яӈк сыр мāгыс ēрын контраст мис, но тав ныле нēглын сэмыл сыр текст сыр хансын мā ёт ēрын контраст ат ми ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сяр мāнь { $threshold }:1 ēри). { $suggestion ->
        [available] Сэмыл сыр палт ēрын контраст мāгыс яӈк сыр контрастэ яныгыг вāрен (хольт textColor="{ $lightColor }"), манос сэмыл сыр сырэ вēлтэн (хольт textColorDarkMode="{ $darkColor }").
       *[none] Сэмыл сыр палт ēрын контраст мāгыс яӈк сыр контрастэ яныгыг вāрен манос нēглын сыр textColorDarkMode хосыт вēлтэн.
    }

section-multiple-style-palettes = Яныг пēлы аква <stylePalette> ӯнлы уртуӈкве вāры; сяр ōвыл вāравē.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } палт мōт щёс ат ōлнэ вариантыт пāсыстаӈкве ат рōви. numToSelect минус ат ōлнэ тēлыг савит ат ōлы.

variant-num-to-select-not-constant-number = { $component } палт мōт щёс ат ōлнэ вариантыт пāсыстаӈкве ат рōви. numToSelect ат вēлтнэ савит ат ōлы.

variant-with-replacement-not-constant-boolean = { $component } палт мōт щёс ат ōлнэ вариантыт пāсыстаӈкве ат рōви. withReplacement ат вēлтнэ логика вāрмаль ат ōлы.

variant-select-weight-disables-unique = матыр уртнэ вāрмаль палт selectWeight манос selectForVariants мивēс ке, select палт мōт щёс ат ōлнэ вариантыт лēщатавēт

variant-coprime-undetermined = { $component } палт мōт щёс ат ōлнэ вариантыт пāсыстаӈкве ат рōви. coprime хōталь-ке ёмас ōлы манос ат ōлы — ты пāсыстаӈкве ат рōви.

variant-attribute-not-constant = { $component } палт мōт щёс ат ōлнэ вариантыт пāсыстаӈкве ат рōви. { $attribute } ат вēлтнэ ат ōлы.

variant-attribute-not-number = { $component } палт мōт щёс ат ōлнэ вариантыт пāсыстаӈкве ат рōви. { $attribute } савит ат ōлы.

variant-attribute-wrong-type-for-sequence =
    { $type } сырыӈ { $component } палт мōт щёс ат ōлнэ вариантыт пāсыстаӈкве ат рōви. { $attribute } { $expected ->
        [letters-combination] буквайыт акван-паттым
        [math-expression] рōвнэ математика лāтыӈ
        [integer] тēлыг савит
       *[number] савит
    } ат ōлы.

variant-length-not-integer = { $component } палт мōт щёс ат ōлнэ вариантыт пāсыстаӈкве ат рōви. length тēлыг савит ат ōлы.

variant-sort-not-implemented = sort ёт { $component } палт мōт щёс ат ōлнэ вариантыт ат вāрвēсыт

variant-exclude-combinations-not-implemented = excludeCombinations ёт { $component } палт мōт щёс ат ōлнэ вариантыт ат вāрвēсыт

variant-math-exclude-not-implemented = exclude ёт math сырыӈ { $component } палт мōт щёс ат ōлнэ вариантыт ат вāрвēсыт

variant-non-constant-exclude-not-implemented = вēлтнэ exclude ёт { $component } палт мōт щёс ат ōлнэ вариантыт ат вāрвēсыт

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: график prefigure хансын вāрмалѐ палт ат вāрвēс; нявраманэ хӯльтвēсыт.

prefigure-descendant-invalid-geometry = { $subject }: ōвыл пāс ат ōлнэ манос тагыл ат ōлнэ геометрия; нявраманэ хӯльтвēсыт.

prefigure-curve-label-omitted = { $subject }: вēлтым кривая элементыт палт намыт ат вāрвēсыт; нам хӯльтвēс.

prefigure-curve-unsupported-definition-type = { $subject }: ат вāрвēс кривая функция пāсыстан сыр «{ $definitionType }»; нявраманэ хӯльтвēсыт.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элемент flipFunctions атрибутэ ат вāрвēс; нявраманэ хӯльтвēсыт.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формула ёт мим няврам функциит ӯнлы вуйтэ; нявраманэ хӯльтвēсыт.

prefigure-label-position-unsupported =
    { $subject }: ат вāрвēс labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] линия сым нам мāгыс
       *[point] пāс нам мāгыс
    }; PreFigure овыл ёт-паттымэ вāравē.

prefigure-fill-style-unsupported = { $subject }: тагыл вāрнэ стиль «{ $fillStyle }» PreFigure палт ат вāрвēс; тагыл вāрнэ вāрмаля мины.

prefigure-line-style-unknown = { $subject }: ат ханисьтам линия стиль «{ $lineStyle }» PreFigure нēглан вāрмаль ныл кон вувēс.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер стиль «{ $markerStyle }» PreFigure «diamond» стиль ёт паттувēс.

prefigure-marker-style-unsupported = { $subject }: маркер стиль «{ $markerStyle }» PreFigure палт ат вāрвēс; овыл стиль вāравē.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ат ёмас `ref`; цель паттуӈкве ат рōви. Пāс кон вувēс.

annotation-ref-multiple-targets = `<annotation>`: `ref` сав цель ёт паттувēс; овыл вāравē.

annotation-ref-outside-graph = `<annotation>`: ат ёмас `ref`; цель тав ōньсюӈкве график ныл кон. Пāс кон вувēс.

annotation-ref-unsupported-target = `<annotation>`: ат ёмас `ref`; цель prefigure вēлтнэ вāрмаль палт вāрнэ график вāрмаль ат ōлы. Пāс кон вувēс.

annotation-text-missing = `<annotation>`: `text` ат ōлы манос тагыл ат ōлы; тагыл ат ōлнэ текст нēглы.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Кēрыӈ нōмтхатнэ вāрмаль хōнтвēс.
       *[other] `<{ $componentType }>` компонент ōньсюӈкве кēрыӈ нōмтхатнэ вāрмаль хōнтвēс.
    }

reference-no-referent = Ёт-паттым вāрмаль ат хōнтвēс: `{ $reference }`

reference-multiple-referents = Ёт-паттым сав вāрмаль хōнтвēс: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элемент { $attribute } атрибут формате ат ёмас.

children-invalid = `<{ $componentType }>` палт ат ёмас няврамыт: ат ёмас няврамыт хōнтвēсыт: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибут мāгыс ат ёмас вāрмаль `{ $value }`; `{ $default }` вāрмаль вāравē

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версия ат хōнтвēс.
       *[other] DoenetML { $version } версия ат хōнтвēс. { $fallback } версия вāравē
    }

## Reading the DoenetML

parse-invalid-doenetml = Ат ёмас DoenetML: { $content }

parse-tag-missing-close-tag = Ат ёмас DoenetML: `{ $tag }` тег пантнэ теге ат ōлы. Тāнти пантнэ тег манос `</{ $tagName }>` тег ӯргаласы.

parse-tag-error = Ат ёмас DoenetML: `<{ $tagName }>` тег палт ошибка

parse-attribute-missing-value = Ат ёмас DoenetML: `{ $attribute }` атрибут палт вāрмаль ат ēри хольт.

parse-attribute-invalid = Ат ёмас DoenetML: ат ёмас атрибут `{ $attribute }`

parse-attribute-value-invalid = Ат ёмас DoenetML: атрибут ат ёмас вāрмалѐ `{ $value }`

parse-attribute-value-quote-mismatch = Ат ёмас DoenetML: атрибут ат ёмас вāрмалѐ `{ $value }`. Кавычкат ат аквсыр. `{ $quote }` ат ēри хольт

parse-open-tag-name-missing = Ат ёмас DoenetML: наме ат ōлнэ тег хōнтвēс, хольт `<`

parse-tag-not-closed = Ат ёмас DoenetML: `{ $tag }` тег ат пантвēс (`>` ат ēри хольт).

parse-self-closing-tag-name-missing = Ат ёмас DoenetML: наме ат ōлнэ тег хōнтвēс `<{ $content }>`

parse-self-closing-tag-not-closed = Ат ёмас DoenetML: `{ $tag }` тег ат пантвēс (`/>` ат ēри хольт).

parse-tag-invalid-attributes = Ат ёмас DoenetML: `{ $tag }` тег ат ёмас. Тав атрибутанэ ат ёмасыг ōлуӈкве рōвēгыт.

parse-close-tag-name-missing = Ат ёмас DoenetML: наме ат ōлнэ пантнэ тег хōнтвēс, хольт `</`

parse-attribute-value-unquoted = Атрибут вāрмаланэ кавычкат кӣвырт ōлуӈкве ēри: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ат ёмас DoenetML: `{ $tag }` пантнэ тег хōнтвēс, тав мāгсылэ рōвнэ пӯнсын тег ат ōлы

parse-close-tag-mismatched = Ат ёмас DoenetML: аквсыр ат ōлнэ пантнэ тег. `</{ $expected }>` ӯргалавēс. `{ $found }` хōнтвēс

parser-node-unconvertible = { $node } узел Dast узела вēлтуӈкве ат рōвыс.

## Names

name-attribute-invalid =
    Ат ёмас атрибут name='{ $name }'. { $reason ->
        [characters] Намыт кӣвырт буквайыт, савитыт, ёлы ёт-паттым манос ёт-паттым ӯнлы ōлуӈкве рōвēгыт.
       *[start] Намыт буква ныл нēглуӈкве ēрēгыт.
    }

component-name-invalid-start = Ат ёмас компонент нам «{ $name }». Намыт буква ныл нēглуӈкве ēрēгыт.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched сырыӈ answer video атрибутыӈ ōлуӈкве ēри

answer-video-watched-video-not-reference = videoWatched сырыӈ answer video атрибутэ ёт-паттым вāрмаль ōлуӈкве ēри

answer-name-not-single-text = answer name атрибутэ палт аква текст няврам ōлуӈкве ēри

## Referencing another document

external-doenetml-recursion-limit = Рекурсия нумиянэ сяр сав, ос кон DoenetML вуӈкве ат рōвыс. Кēрыӈ ёт-паттым вāрмаль ат ōлы?

external-doenetml-unavailable = { $attribute }="{ $uri }" адрес ныл DoenetML вуӈкве ат рōвыс

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адрес ныл ат ёмас DoenetML вувēс: тав «{ $componentType }» компонент сыр ёт ат аквсыр

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут пēсыг ēмтыс; тав тāримт `{ $to }` вāрен.
       *[other] [deprecation] `<{ $component }>` элемент `{ $from }` атрибутэ пēсыг ēмтыс; тав тāримт `{ $to }` вāрен.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут пēсыг ēмтыс ос ат ловиньтавē. `{ $to }` ос мивēс.
       *[other] [deprecation] `<{ $component }>` элемент `{ $from }` атрибутэ пēсыг ēмтыс ос ат ловиньтавē. `{ $to }` ос мивēс.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элемент `{ $attribute }` атрибутэ пēсыг ēмтыс ос ат ловиньтавē.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элемент `{ $attribute }` атрибутэ пēсыг ēмтыс; тав тāримт `<{ $child }>` няврам вāрен.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элемент `{ $attribute }` атрибут `{ $value }` вāрмалѐ пēсыг ēмтыс; тав тāримт `{ $to }` вāрен.


## Language coverage

pluralize-english-only = `<pluralize>` сав савит ӯнлы аӈглийский лāтыӈыл вāруӈкве вāры, ос { $locale } лāтыӈыл хансым документ палт тав тексте ат вēлтым хӯльты. Сав савит форма тāнти хансэн манос тав `pluralForm` атрибут ёт мēн.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент ханисьтам Doenet элемент ат ōлы.

schema-element-not-allowed-at-root = `<{ $tag }>` элемент документ тāл палт ат рōви.

schema-element-not-allowed-inside = `<{ $tag }>` элемент `<{ $parent }>` кӣвырт ат рōви.

schema-attribute-unrecognized = `<{ $tag }>` элемент палт `{ $attribute }` намыӈ атрибут ат ōлы.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элемент `{ $attribute }` атрибутэ касыӈ элементэ тāн ныланыл аква ōлнэ списка ōлуӈкве ēри: { $allowed }
       *[other] `<{ $tag }>` элемент `{ $attribute }` атрибутэ тāн ныланыл аква ōлуӈкве ēри: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select палт ат ёмас вариант нам. { $variantName } вариант нам { $numOptions } уртнэ вāрмаль палт хōнтхаты, уртнэ савит { $numToSelect }.

select-variant-name-without-options = select палт вариантыт мивēсыт, но ōлуӈкве рōвнэ вариант нам мāгыс аква уртнэ вāрмаль ат ōлы: { $variantName }.

select-variant-name-not-possible = select палт мим { $variantName } вариант нам ōлуӈкве рōвнэ вариант нам ат ōлы.

select-too-few-options = Пуссын { $numOptions } ныл { $numToSelect } компонент уртуӈкве ат рōви.

select-from-sequence-too-few-values = Хосатэ { $length } рāд ныл { $numToSelect } вāрмаль уртуӈкве ат рōви.

select-from-sequence-indices-count-mismatch = select палт мим индексыт савит уртнэ савит ёт аквсыр ōлуӈкве ēри

select-from-sequence-indices-not-integers = select палт мим пуссын индексыт тēлыг савит ōлуӈкве ēрēгыт

select-from-sequence-index-excluded = selectfromsequence палт мим индекс кон вувēс ōлыс

select-from-sequence-indices-excluded-combination = selectfromsequence палт мим индексыт кон вувēс акван-паттым ōлыс

select-from-sequence-coprime-not-positive-integers = Плюс тēлыг савитыт ат уртвēсыт, ос аква-аква мāгыс проста акван-паттымыт уртуӈкве ат рōви.

select-from-sequence-coprime-common-factor = Аква-аква мāгыс проста савитыт уртуӈкве ат рōви. Пуссын ōлуӈкве рōвнэ вāрмалит аквсыр уртнэ савитыӈ ōлēгыт. (Мим "from" манос "to" вāрмалит "step" ёт аква-аква мāгыс проста ōлуӈкве ēрēгыт.)

select-from-sequence-coprime-single-number = 1 ат ōлнэ аква савит ныл аква-аква мāгыс проста акван-паттымыт уртуӈкве ат рōви.

select-from-sequence-excluded-too-many-combinations = selectFromSequence кӣвырт акван-паттымыт 70% ныл саваныл кон вувēсыт

select-from-sequence-coprime-none-found = Аква-аква мāгыс проста савитыт уртуӈкве ат рōвыс. Пуссын ōлуӈкве рōвнэ вāрмалит аквсыр уртнэ савитыӈ ōлēгыт.

select-from-sequence-too-few-unique-values = Хосатэ { $numPossibleValues } рāд ныл { $numToSelect } мōт сыр вāрмаль уртуӈкве ат рōви

select-prime-numbers-too-few-values = Хосатэ { $numValues } проста савит списка ныл { $numToSelect } вāрмаль уртуӈкве ат рōви

select-prime-numbers-values-count-mismatch = select палт мим вāрмалит савит уртнэ савит ёт аквсыр ōлуӈкве ēри

select-prime-numbers-values-not-prime = select prime number палт мим пуссын вāрмалит проста савит списка палт ōлуӈкве ēрēгыт

select-prime-numbers-values-excluded-combination = selectPrimeNumbers палт мим вāрмалит кон вувēс акван-паттым ōлыс

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers кӣвырт акван-паттымыт 70% ныл саваныл кон вувēсыт

select-random-combination-fluke = Сяр ōлуӈкве рōвнэ ат ōлнэ вāрмаль ёт кӯтюв ныл вуим вāрмалит акван-паттым уртуӈкве ат рōвыс

select-random-value-fluke = Сяр ōлуӈкве рōвнэ ат ōлнэ вāрмаль ёт кӯтюв ныл вуим вāрмаль уртуӈкве ат рōвыс
