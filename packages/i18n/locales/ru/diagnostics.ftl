# Russian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Russian counts in four plural categories, so every countable message selects
# on all of `one`, `few`, `many` and `other`.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } игнорируется, когда заданы обе конечные точки
       *[other] { $attributes } игнорируются, когда заданы обе конечные точки
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } игнорируется, когда заданы и конечная точка, и середина
       *[other] { $attributes } игнорируются, когда заданы и конечная точка, и середина
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset не действует без середины

## `<line>`

line-points-undetermined-dimensions = Прямая через точки неопределённой размерности.

line-points-too-few-dimensions = Прямая должна проходить через точки размерности не менее двух.

line-points-depend-on-variables = Прямая проходит через точки, зависящие от переменных: { $variables }.

line-equation-invalid-format = Недопустимый формат уравнения прямой в переменных { $variable1 } и { $variable2 }.

## `<ray>`

ray-overprescribed-through = Луч задан через through, endpoint и direction. Указанное through игнорируется.

ray-dimension-mismatch = Несоответствие numDimensions в луче.

## `<vector>`

vector-overprescribed-head = Вектор задан через head, tail и displacement. Указанное head игнорируется.

vector-dimension-mismatch = Несоответствие numDimensions в векторе.

## Attracting and constraining

attract-to-without-nearest-point = Невозможно притянуть к `<{ $component }>`: у него нет переменной состояния nearestPoint.

constrain-to-without-nearest-point = Невозможно ограничить `<{ $component }>`: у него нет переменной состояния nearestPoint.

constrain-to-interior-without-nearest-point = Невозможно ограничить внутренностью `<{ $component }>`: у него нет переменной состояния nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition игнорируется для не встроенного choiceInput

## Ordering children by index

choice-input-indices-count-mismatch = Индексы, заданные для choiceInput, игнорируются: их количество не совпадает с числом дочерних choice.

pretzel-indices-count-mismatch = Индексы, заданные для problem, игнорируются: их количество не совпадает с числом дочерних problem.

shuffle-indices-count-mismatch = Индексы, заданные для shuffle, игнорируются: их количество не совпадает с числом компонентов.

indices-ignored-out-of-range = Индексы, заданные для { $component }, игнорируются: некоторые выходят за границы.

pretzel-indices-repeated = Индексы, заданные для pretzel, игнорируются: некоторые повторяются.

pretzel-circuit-first-index = Индексы, заданные для pretzel в режиме circuit, игнорируются: первый индекс должен быть 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Чтобы `<{ $component }>` работал со строковыми дочерними элементами, нужно задать атрибут `type`.

invalid-type-defaulting-to-math = Недопустимый тип { $type } для компонента { $component }. Он должен быть math, text, number или boolean. Используется math.

string-not-valid-component-to-arrange = Строка «{ $value }» не является допустимым компонентом для { $component }. Она игнорируется.

## Types and variables

invalid-type-defaulting-to-number = Недопустимый тип { $type }; тип установлен в number.

invalid-variable-value = Недопустимое значение переменной: `{ $value }`

## Variants

variant-index-must-be-number = Индекс варианта { $index } должен быть числом

variant-index-must-be-integer = Индекс варианта { $index } должен быть целым числом

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` не реализован для абсолютных величин. Ширины становятся относительными.

side-by-side-absolute-margins = `<{ $component }>` не реализован для абсолютных величин. Отступы становятся относительными.

side-by-side-no-block-child = Недопустимый `<{ $component }>`: у него должен быть хотя бы один блочный дочерний элемент.

## `<label>`

label-for-ignored-on-graphical = Атрибут `for` у графического `<label>` игнорируется.

label-for-must-resolve-to-one = Атрибут `for` у `<label>` должен разрешаться ровно в один компонент.

label-for-unresolved = Атрибут `for` у `<label>` не удалось разрешить в компонент.

label-for-answer-with-authored-inputs = Атрибут `for` у `<label>` ссылается на `<answer>` с явно записанными полями ввода; ссылайтесь прямо на поле ввода.

label-for-answer-without-input = Атрибут `for` у `<label>` ссылается на `<answer>` без поля ввода, которое можно подписать.

label-for-must-reference-input-or-answer = Атрибут `for` у `<label>` должен ссылаться на поле ввода или на ответ.

## Accessibility

accessibility-short-description-or-decorative = Для доступности `<{ $component }>` должен иметь краткое описание или быть помечен как декоративный.

accessibility-video-short-description = Для доступности `<video>` должен иметь краткое описание.

accessibility-input-short-description-or-label = Для доступности `<{ $component }>` должен иметь краткое описание или подпись.

accessibility-answer-input-short-description-or-label = Для доступности `<answer>`, создающий поле ввода, должен иметь краткое описание или подпись.

accessibility-short-description-contains-math = Краткие описания не должны содержать математических компонентов вроде `<{ $component }>`. Запишите математику словами.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] У { $colorName } недостаточная контрастность для текста заголовка раздела (тёмная тема) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; требуется не менее { $threshold }:1).
       *[other] У { $colorName } недостаточная контрастность для текста заголовка раздела ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; требуется не менее { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` через { $count } точек не реализована, когда точки не имеют числовых значений.

circle-too-many-through-points = Невозможно вычислить окружность более чем через 3 точки.

circle-overprescribed-radius-center-points = Невозможно вычислить окружность с заданными радиусом, центром и точками.

circle-center-with-multiple-points = Невозможно вычислить окружность с заданным центром более чем через 1 точку.

circle-radius-too-small = Невозможно вычислить окружность: поскольку расстояние между двумя точками равно { $distance }, заданный радиус { $radius } слишком мал.

circle-radius-with-many-points = Невозможно построить окружность более чем через две точки с заданным радиусом.

circle-invalid-center-or-through-points = Недопустимый центр или точки окружности.

circle-radius-center-with-multiple-points = Невозможно вычислить радиус окружности с заданным центром более чем через 1 точку.

circle-change-radius-non-numerical = Невозможно изменить радиус окружности с нечисловыми точками

circle-radius-with-points-non-numerical = Невозможно построить окружность более чем через одну точку с заданным радиусом при отсутствии числовых значений.

circle-change-center-non-numerical = Изменение центра окружности, проходящей через нечисловые точки, не реализовано.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Недостаточно измерений для области определения функции. В области { $intervals } интервал, а у функции { $inputs ->
            [one] { $inputs } вход
            [few] { $inputs } входа
            [many] { $inputs } входов
           *[other] { $inputs } входа
        }.
        [few] Недостаточно измерений для области определения функции. В области { $intervals } интервала, а у функции { $inputs ->
            [one] { $inputs } вход
            [few] { $inputs } входа
            [many] { $inputs } входов
           *[other] { $inputs } входа
        }.
       *[other] Недостаточно измерений для области определения функции. В области { $intervals } интервалов, а у функции { $inputs ->
            [one] { $inputs } вход
            [few] { $inputs } входа
            [many] { $inputs } входов
           *[other] { $inputs } входа
        }.
    }

function-domain-invalid-format = Недопустимый формат области определения функции.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Нечисловой максимум функции игнорируется.
        [minimum] Нечисловой минимум функции игнорируется.
        [extremum] Нечисловой экстремум функции игнорируется.
        [point] Нечисловая точка функции игнорируется.
        [slope] Нечисловой наклон функции игнорируется.
       *[other] Нечисловое { $type } функции игнорируется.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Пустой максимум функции игнорируется.
        [minimum] Пустой минимум функции игнорируется.
        [extremum] Пустой экстремум функции игнорируется.
        [point] Пустая точка функции игнорируется.
       *[other] Пустое { $type } функции игнорируется.
    }

function-points-too-close = Функция содержит две точки, расположенные слишком близко. Невозможно определить функцию.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Итерации функции возможны, только если число входов равно числу выходов. У этой функции { $inputs } вход и { $outputs ->
            [one] { $outputs } выход
            [few] { $outputs } выхода
            [many] { $outputs } выходов
           *[other] { $outputs } выхода
        }.
        [few] Итерации функции возможны, только если число входов равно числу выходов. У этой функции { $inputs } входа и { $outputs ->
            [one] { $outputs } выход
            [few] { $outputs } выхода
            [many] { $outputs } выходов
           *[other] { $outputs } выхода
        }.
       *[other] Итерации функции возможны, только если число входов равно числу выходов. У этой функции { $inputs } входов и { $outputs ->
            [one] { $outputs } выход
            [few] { $outputs } выхода
            [many] { $outputs } выходов
           *[other] { $outputs } выхода
        }.
    }

## `<sequence>`

sequence-invalid-length = Недопустимая длина последовательности. Она должна быть неотрицательным целым числом.

sequence-invalid-step = Недопустимый шаг последовательности. Для последовательности типа { $type } он должен быть числом.

sequence-invalid-endpoint-number = Недопустимое «{ $attribute }» числовой последовательности. Оно должно быть числом.

sequence-invalid-endpoint-letters = Недопустимое «{ $attribute }» буквенной последовательности. Оно должно быть сочетанием букв.

sequence-invalid-endpoint = Недопустимое «{ $attribute }» последовательности.

select-from-sequence-coprime-not-numbers = coprime игнорируется, так как выбираются не числа

select-from-sequence-coprime-with-exclude-combinations = coprime игнорируется, так как задан excludeCombinations

## Resolving a `target`

target-not-found = Недопустимый target для `<{ $source }>`: цель не найдена.

target-state-variable-not-found = Недопустимый target для `<{ $source }>`: у `<{ $component }>` нет переменной состояния с именем «{ $property }».

## `<odeSystem>`

ode-system-variables-match-independent = Переменные `<odeSystem>` должны отличаться от независимой переменной.

ode-system-duplicate-variable-names = Невозможно определить правые части ОДУ с повторяющимися именами зависимых переменных.

ode-system-rhs-function-error = Невозможно определить правую часть ОДУ. Ошибка при создании функции mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Невозможно определить угол между { $count } прямыми

angle-invalid-through-point = Недопустимая точка в through у `<angle>`

parabola-vertex-too-many-points = Парабола с заданной вершиной более чем через 1 точку не реализована.

parabola-too-many-points = Парабола более чем через 3 точки не реализована.

intersection-too-many-items = Пересечение более чем двух объектов не реализовано

## Other math components

ionic-compound-not-two-ions = Ионные соединения, кроме соединений из двух ионов, не реализованы.

ionic-compound-needs-cation-and-anion = Ионные соединения реализованы только для одного катиона и одного аниона.

solve-equations-cannot-evaluate = Невозможно решить уравнение, так как его не удалось вычислить: { $equation }

math-operators-operand-number-required = Для извлечения математического операнда нужно указать operandNumber.

eigen-decomposition-failed = Не удалось вычислить собственные значения матрицы

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: параметр { $parameters } не встречается в шаблоне, поэтому он всегда будет совпадать с пропуском.
       *[other] `<matchesPattern>`: параметры { $parameters } не встречаются в шаблоне, поэтому они всегда будут совпадать с пропуском.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: не удалось разобрать grid="{ $grid }". Значение должно быть none, medium, dense либо два положительных числа через пробел, например grid="1 0.5". Сетка не рисуется.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" не поддерживается в отрисовщике prefigure; используется поведение правой позиции.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" не поддерживается в отрисовщике prefigure; используется поведение верхней позиции.

prefigure-invalid-axis-bounds = `<graph>`: недопустимые границы осей для преобразования prefigure; используется bbox по умолчанию (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: недопустимая ширина для преобразования prefigure; используется ширина диаграммы по умолчанию 425.

prefigure-invalid-aspect-ratio = `<graph>`: недопустимое aspectRatio для преобразования prefigure; используется соотношение сторон по умолчанию 1.

prefigure-grid-spacing-too-fine = `<graph>`: шаг сетки слишком мелкий для границ осей; в отрисовщике prefigure сетка опускается.

prefigure-annotations-not-rendered = `<graph>`: вне отрисовщика PreFigure аннотации не выводятся.

multiple-annotations-children = В `<graph>` найдено несколько дочерних `<annotations>`; все, кроме последнего, игнорируются.

## Referring to other components

copy-unrecognized-component-type = Невозможно расширить или скопировать нераспознанный тип компонента: { $type }.

copy-prop-not-found = Свойство { $property } не найдено у компонента типа { $component }

collect-no-source = Для collect не найден источник.

collect-invalid-component-type = Невозможно собрать компоненты типа `<{ $component }>`: это недопустимый тип компонента.

reference-index-unavailable = Невозможно сослаться на индекс `{ $reference }`

## `<callAction>`

component-action-unavailable = Невозможно вызвать { $action } у компонента `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = У данных недопустимая форма. Строки имеют разную длину. Найдено в componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = В данных есть повторяющиеся имена столбцов. Найдено в componentIdx :{ $componentIdx }

data-frame-missing-column-name = В данных отсутствует имя столбца. Найдено в componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award этого ответа опирается на отправленный ответ самого тега answer, что приведёт к неожиданному поведению.

answer-max-num-attempts-in-section-wide-check-work = Установка `maxNumAttempts` у `<answer>` внутри контейнера с `sectionWideCheckWork` не действует: число попыток определяется контейнером. Задайте `maxNumAttempts` у контейнера.

nested-section-wide-check-work-max-num-attempts = Установка `maxNumAttempts` у контейнера с `sectionWideCheckWork`, который сам находится внутри другого контейнера с `sectionWideCheckWork`, не действует: число попыток определяется внешним контейнером. Задайте `maxNumAttempts` у внешнего контейнера.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Атрибут { $attributes } не будет действовать без symbolicEquality.
       *[other] Атрибуты { $attributes } не будут действовать без symbolicEquality.
    }

answer-invalid-type = Недопустимый тип для answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Компонент `<{ $component }>` не имеет имени, поэтому его нельзя использовать как атрибут модуля

module-attribute-name-already-defined = Компонент `<{ $component } name="{ $name }">` нельзя использовать как атрибут модуля, так как у типа компонента `<module>` уже определён атрибут «{ $name }».

conditional-content-condition-ignored = Атрибут `condition` игнорируется у компонента `<conditionalContent>` с дочерними case или else.

slider-markers-type-mismatch = Тип маркеров не совпадает с типом ползунка.

pretzel-problem-needs-statement-and-answer = Недопустимый pretzel: каждый `<problem>` должен содержать один `<statement>` и один `<answer>`.

pretzel-circuit-first-problem-distractor = Недопустимый pretzel: при mode="circuit" первый `<problem>` не может быть отвлекающим.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Недопустимое значение { $values } для атрибута `{ $attribute }`; оно игнорируется.
       *[other] Недопустимые значения { $values } для атрибута `{ $attribute }`; они игнорируются.
    }

attribute-must-be-references = Недопустимое значение `{ $value }` для атрибута `{ $attribute }`. Атрибут должен состоять из ссылок, начинающихся с `$`.

math-input-invalid-function-names = <mathInput>: недопустимые имена функций в { $attribute } проигнорированы: { $names }. Отображаемая часть каждого имени должна быть не короче 2 символов (буквы или дефисы); за ней может следовать необязательный суффикс `|<альтернатива mathspeak>`.

## Building components from the source

component-type-invalid = Недопустимый тип компонента: `<{ $componentType }>`

attribute-repeated = Атрибут { $attribute } нельзя повторять.

attribute-invalid-for-component = Недопустимый атрибут «{ $attribute }» для компонента типа `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    У определения стиля { $styleNumber } недостаточная контрастность для { $context ->
        [text-on-background] цвета текста на цвете фона
        [high-contrast] высококонтрастного цвета на холсте
        [line] цвета линий на холсте
        [marker] цвета маркеров на холсте
       *[text-on-canvas] цвета текста на холсте
    }{ $mode ->
        [dark] { " (тёмная тема)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; требуется не менее { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Хотя в определении стиля { $styleNumber } заданы цвета с достаточной контрастностью для светлой темы, производные от них цвета тёмной темы дают недостаточную контрастность текста на фоне ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; требуется не менее { $threshold }:1). { $suggestion ->
        [available] Чтобы обеспечить достаточную контрастность в тёмной теме, либо увеличьте контрастность светлой темы (например, { $lightAttribute }="{ $lightColor }"), либо переопределите цвет тёмной темы (например, { $darkAttribute }="{ $darkColor }").
       *[none] Чтобы обеспечить достаточную контрастность в тёмной теме, увеличьте контрастность светлой темы или переопределите производные цвета через textColorDarkMode и/или backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Хотя в определении стиля { $styleNumber } задан цвет текста с достаточной контрастностью для светлой темы, производный от него цвет текста тёмной темы даёт недостаточную контрастность на холсте ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; требуется не менее { $threshold }:1). { $suggestion ->
        [available] Чтобы обеспечить достаточную контрастность в тёмной теме, либо увеличьте контрастность светлой темы (например, textColor="{ $lightColor }"), либо переопределите цвет тёмной темы (например, textColorDarkMode="{ $darkColor }").
       *[none] Чтобы обеспечить достаточную контрастность в тёмной теме, увеличьте контрастность светлой темы или переопределите производный цвет через textColorDarkMode.
    }

section-multiple-style-palettes = Раздел может выбрать только одну <stylePalette>; используется последняя.

## Unique variants

variant-num-to-select-not-non-negative-integer = невозможно определить уникальные варианты { $component }, так как numToSelect не является неотрицательным целым числом.

variant-num-to-select-not-constant-number = невозможно определить уникальные варианты { $component }, так как numToSelect не является постоянным числом.

variant-with-replacement-not-constant-boolean = невозможно определить уникальные варианты { $component }, так как withReplacement не является постоянным логическим значением.

variant-select-weight-disables-unique = Уникальные варианты для select отключены, если у какого-либо варианта задан selectWeight или selectForVariants

variant-coprime-undetermined = невозможно определить уникальные варианты { $component }, так как нельзя установить, что coprime всегда ложно.

variant-attribute-not-constant = невозможно определить уникальные варианты { $component }, так как { $attribute } не является константой.

variant-attribute-not-number = невозможно определить уникальные варианты { $component }, так как { $attribute } не является числом.

variant-attribute-wrong-type-for-sequence =
    невозможно определить уникальные варианты { $component } типа { $type }, так как { $attribute } не является { $expected ->
        [letters-combination] сочетанием букв
        [math-expression] допустимым математическим выражением
        [integer] целым числом
       *[number] числом
    }.

variant-length-not-integer = невозможно определить уникальные варианты { $component }, так как length не является целым числом.

variant-sort-not-implemented = уникальные варианты { $component } с sort не реализованы

variant-exclude-combinations-not-implemented = уникальные варианты { $component } с excludeCombinations не реализованы

variant-math-exclude-not-implemented = уникальные варианты { $component } типа math с exclude не реализованы

variant-non-constant-exclude-not-implemented = уникальные варианты { $component } с непостоянным exclude не реализованы

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: не поддерживается в отрисовщике prefigure для графика; потомок пропущен.

prefigure-descendant-invalid-geometry = { $subject }: неконечная или неполная геометрия; потомок пропущен.

prefigure-curve-label-omitted = { $subject }: подписи не поддерживаются у преобразованных элементов кривых; подпись опущена.

prefigure-curve-unsupported-definition-type = { $subject }: неподдерживаемый тип определения функции кривой «{ $definitionType }»; потомок пропущен.

prefigure-region-flip-functions-unsupported = { $subject }: атрибут flipFunctions у regionBetweenCurves не поддерживается; потомок пропущен.

prefigure-region-non-formula-child = { $subject }: у regionBetweenCurves поддерживаются только дочерние функции, заданные формулой; потомок пропущен.

prefigure-label-position-unsupported =
    { $subject }: неподдерживаемое labelPosition «{ $labelPosition }» для { $labelKind ->
        [line-family] подписи семейства прямых
       *[point] подписи точки
    }; используется выравнивание PreFigure по умолчанию.

prefigure-fill-style-unsupported = { $subject }: стиль заливки «{ $fillStyle }» не поддерживается PreFigure; используется сплошная заливка.

prefigure-line-style-unknown = { $subject }: неизвестный стиль линии «{ $lineStyle }» опущен в выводе PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: стиль маркера «{ $markerStyle }» сопоставлен со стилем PreFigure «diamond».

prefigure-marker-style-unsupported = { $subject }: стиль маркера «{ $markerStyle }» не поддерживается PreFigure; используется стиль по умолчанию.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: недопустимый `ref`; цель не разрешается. Аннотация опущена.

annotation-ref-multiple-targets = `<annotation>`: `ref` разрешился в несколько целей; используется первая.

annotation-ref-outside-graph = `<annotation>`: недопустимый `ref`; цель находится вне содержащего графика. Аннотация опущена.

annotation-ref-unsupported-target = `<annotation>`: недопустимый `ref`; цель не является поддерживаемым графическим объектом при преобразовании prefigure. Аннотация опущена.

annotation-text-missing = `<annotation>`: `text` отсутствует или пуст; выводится пустой текст.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Обнаружена циклическая зависимость.
       *[other] Обнаружена циклическая зависимость с участием компонента `<{ $componentType }>`.
    }

reference-no-referent = Не найден объект для ссылки: `{ $reference }`

reference-multiple-referents = Найдено несколько объектов для ссылки: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Недопустимый формат атрибута { $attribute } у `<{ $componentType }>`.

children-invalid = Недопустимые дочерние элементы у `<{ $componentType }>`: найдены недопустимые дочерние элементы: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Недопустимое значение `{ $value }` для атрибута `{ $attribute }`; используется значение `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Версия DoenetML { $version } не найдена.
       *[other] Версия DoenetML { $version } не найдена. Используется версия { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Недопустимый DoenetML: { $content }

parse-tag-missing-close-tag = Недопустимый DoenetML: у тега `{ $tag }` нет закрывающего тега. Ожидался самозакрывающийся тег или тег `</{ $tagName }>`.

parse-tag-error = Недопустимый DoenetML: ошибка в теге `<{ $tagName }>`

parse-attribute-missing-value = Недопустимый DoenetML: у атрибута `{ $attribute }`, по-видимому, отсутствует значение.

parse-attribute-invalid = Недопустимый DoenetML: недопустимый атрибут `{ $attribute }`

parse-attribute-value-invalid = Недопустимый DoenetML: недопустимое значение атрибута `{ $value }`

parse-attribute-value-quote-mismatch = Недопустимый DoenetML: недопустимое значение атрибута `{ $value }`. Кавычки не совпадают. По-видимому, не хватает `{ $quote }`

parse-open-tag-name-missing = Недопустимый DoenetML: найден тег без имени, например `<`

parse-tag-not-closed = Недопустимый DoenetML: тег `{ $tag }` не закрыт (по-видимому, не хватает `>`).

parse-self-closing-tag-name-missing = Недопустимый DoenetML: найден тег без имени `<{ $content }>`

parse-self-closing-tag-not-closed = Недопустимый DoenetML: тег `{ $tag }` не закрыт (по-видимому, не хватает `/>`).

parse-tag-invalid-attributes = Недопустимый DoenetML: тег `{ $tag }` недопустим. Возможно, у него неверные атрибуты.

parse-close-tag-name-missing = Недопустимый DoenetML: найден закрывающий тег без имени, например `</`

parse-attribute-value-unquoted = Значения атрибутов должны быть в кавычках: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Недопустимый DoenetML: найден закрывающий тег `{ $tag }`, но нет соответствующего открывающего

parse-close-tag-mismatched = Недопустимый DoenetML: несоответствующий закрывающий тег. Ожидался `</{ $expected }>`. Найден `{ $found }`

parser-node-unconvertible = Не удалось преобразовать узел { $node } в узел Dast.

## Names

name-attribute-invalid =
    Недопустимый атрибут name='{ $name }'. { $reason ->
        [characters] Имена могут содержать только буквы, цифры, подчёркивания и дефисы.
       *[start] Имена должны начинаться с буквы.
    }

component-name-invalid-start = Недопустимое имя компонента «{ $name }». Имена должны начинаться с буквы.

## `<answer>` sugar

answer-video-watched-missing-video = У answer с типом videoWatched должен быть атрибут video

answer-video-watched-video-not-reference = У answer с типом videoWatched атрибут video должен быть ссылкой

answer-name-not-single-text = У атрибута name компонента answer должен быть ровно один текстовый дочерний элемент

## Referencing another document

external-doenetml-recursion-limit = Не удалось получить внешний DoenetML из-за слишком большой глубины рекурсии. Нет ли циклической ссылки?

external-doenetml-unavailable = Не удалось получить DoenetML из { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Получен недопустимый DoenetML из { $attribute }="{ $uri }": он не соответствует типу компонента «{ $componentType }»

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Атрибут `{ $from }` устарел; используйте `{ $to }`.
       *[other] [deprecation] Атрибут `{ $from }` у `<{ $component }>` устарел; используйте `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Атрибут `{ $from }` устарел и игнорируется, так как задан также `{ $to }`.
       *[other] [deprecation] Атрибут `{ $from }` у `<{ $component }>` устарел и игнорируется, так как задан также `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Атрибут `{ $attribute }` у `<{ $component }>` устарел и игнорируется.


## Language coverage

pluralize-english-only = `<pluralize>` умеет образовывать множественное число только в английском, поэтому в документе на языке { $locale } его текст остаётся без изменений. Напишите форму множественного числа сами или задайте её атрибутом `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Элемент `<{ $tag }>` не является известным элементом Doenet.

schema-element-not-allowed-at-root = Элемент `<{ $tag }>` не допускается в корне документа.

schema-element-not-allowed-inside = Элемент `<{ $tag }>` не допускается внутри `<{ $parent }>`.

schema-attribute-unrecognized = У элемента `<{ $tag }>` нет атрибута с именем `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Атрибут `{ $attribute }` элемента `<{ $tag }>` должен быть списком, каждый элемент которого — одно из: { $allowed }
       *[other] Атрибут `{ $attribute }` элемента `<{ $tag }>` должен быть одним из: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Недопустимое имя варианта для select. Имя варианта { $variantName } встречается в { $numOptions } вариантах, а выбрать нужно { $numToSelect }.

select-variant-name-without-options = Для select заданы варианты, но не задано ни одного варианта для возможного имени варианта: { $variantName }.

select-variant-name-not-possible = Имя варианта { $variantName }, заданное для select, не является возможным именем варианта.

select-too-few-options = Невозможно выбрать { $numToSelect } компонентов всего из { $numOptions }.

select-from-sequence-too-few-values = Невозможно выбрать { $numToSelect } значений из последовательности длины { $length }.

select-from-sequence-indices-count-mismatch = Число индексов, заданных для select, должно совпадать с числом выбираемых

select-from-sequence-indices-not-integers = Все индексы, заданные для select, должны быть целыми числами

select-from-sequence-index-excluded = Заданный индекс selectfromsequence был исключён

select-from-sequence-indices-excluded-combination = Заданные индексы selectfromsequence образовали исключённое сочетание

select-from-sequence-coprime-not-positive-integers = Невозможно выбрать взаимно простые сочетания, так как выбираются не положительные целые числа.

select-from-sequence-coprime-common-factor = Невозможно выбрать взаимно простые числа. У всех возможных значений есть общий множитель. (Заданные значения "from" или "to" должны быть взаимно просты со "step".)

select-from-sequence-coprime-single-number = Невозможно выбрать взаимно простые сочетания из одного числа, отличного от 1.

select-from-sequence-excluded-too-many-combinations = В selectFromSequence исключено более 70 % сочетаний

select-from-sequence-coprime-none-found = Не удалось выбрать взаимно простые числа. У всех возможных значений есть общий множитель.

select-from-sequence-too-few-unique-values = Невозможно выбрать { $numToSelect } различных значений из последовательности длины { $numPossibleValues }

select-prime-numbers-too-few-values = Невозможно выбрать { $numToSelect } значений из списка простых чисел длины { $numValues }

select-prime-numbers-values-count-mismatch = Число значений, заданных для select, должно совпадать с числом выбираемых

select-prime-numbers-values-not-prime = Все значения, заданные для select prime number, должны входить в список простых чисел

select-prime-numbers-values-excluded-combination = Заданные значения selectPrimeNumbers образовали исключённое сочетание

select-prime-numbers-excluded-too-many-combinations = В selectPrimeNumbers исключено более 70 % сочетаний

select-random-combination-fluke = По крайне маловероятной случайности не удалось выбрать сочетание случайных значений

select-random-value-fluke = По крайне маловероятной случайности не удалось выбрать случайное значение
