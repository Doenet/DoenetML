# Ukrainian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# ignored" against "are ignored" — Ukrainian covers both with the impersonal
# «ігнорується»/«ігноруються», which still agrees, so those selects are kept.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } ігнорується, коли задано дві кінцеві точки
       *[other] { $attributes } ігноруються, коли задано дві кінцеві точки
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ігнорується, коли задано і кінцеву точку, і середину
       *[other] { $attributes } ігноруються, коли задано і кінцеву точку, і середину
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset не діє без midpoint

## `<line>`

line-points-undetermined-dimensions = Пряма через точки з невизначеною розмірністю.

line-points-too-few-dimensions = Пряма має проходити через точки розмірності щонайменше два.

line-points-depend-on-variables = Пряма проходить через точки, що залежать від змінних: { $variables }.

line-equation-invalid-format = Некоректний формат рівняння прямої у змінних { $variable1 } і { $variable2 }.

## `<ray>`

ray-overprescribed-through = Промінь задано через through, endpoint і direction.  Задане through ігнорується.

ray-dimension-mismatch = Невідповідність numDimensions у промені.

## `<vector>`

vector-overprescribed-head = Вектор задано через head, tail і displacement.  Задане head ігнорується.

vector-dimension-mismatch = Невідповідність numDimensions у векторі.

## Attracting and constraining

attract-to-without-nearest-point = Неможливо притягувати до `<{ $component }>`, бо він не має змінної стану nearestPoint.

constrain-to-without-nearest-point = Неможливо обмежити до `<{ $component }>`, бо він не має змінної стану nearestPoint.

constrain-to-interior-without-nearest-point = Неможливо обмежити до внутрішньої області `<{ $component }>`, бо він не має змінної стану nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ігнорується для нерядкового choiceInput

## Ordering children by index

choice-input-indices-count-mismatch = Задані для choiceInput індекси ігноруються, бо їхня кількість не збігається з кількістю дочірніх choice.

pretzel-indices-count-mismatch = Задані для problem індекси ігноруються, бо їхня кількість не збігається з кількістю дочірніх problem.

shuffle-indices-count-mismatch = Задані для shuffle індекси ігноруються, бо їхня кількість не збігається з кількістю компонентів.

indices-ignored-out-of-range = Задані для { $component } індекси ігноруються, бо деякі з них поза межами діапазону.

pretzel-indices-repeated = Задані для pretzel індекси ігноруються, бо деякі з них повторюються.

pretzel-circuit-first-index = Задані для pretzel у режимі circuit індекси ігноруються, бо перший індекс має дорівнювати 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Щоб `<{ $component }>` працював із рядковими дочірніми елементами, потрібно задати атрибут `type`.

invalid-type-defaulting-to-math = Некоректний type { $type } для компонента { $component }. Має бути одне з math, text, number або boolean. Використовується math.

string-not-valid-component-to-arrange = Рядок «{ $value }» не є придатним компонентом для { $component }. Ігнорується.

## Types and variables

invalid-type-defaulting-to-number = Некоректний type { $type }, встановлено type number.

invalid-variable-value = Некоректне значення змінної: `{ $value }`

## Variants

variant-index-must-be-number = Індекс варіанта { $index } має бути числом

variant-index-must-be-integer = Індекс варіанта { $index } має бути цілим числом

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` не реалізовано для абсолютних мір. Ширини встановлено відносними.

side-by-side-absolute-margins = `<{ $component }>` не реалізовано для абсолютних мір. Поля встановлено відносними.

side-by-side-no-block-child = Некоректний `<{ $component }>`: він має містити щонайменше один блоковий дочірній елемент.

## `<label>`

label-for-ignored-on-graphical = Атрибут `for` на графічному `<label>` ігнорується.

label-for-must-resolve-to-one = Атрибут `for` на `<label>` має вказувати рівно на один компонент.

label-for-unresolved = Не вдалося зіставити атрибут `for` на `<label>` з жодним компонентом.

label-for-answer-with-authored-inputs = Атрибут `for` на `<label>` посилається на `<answer>` з явно заданими полями введення; посилайтеся безпосередньо на поле.

label-for-answer-without-input = Атрибут `for` на `<label>` посилається на `<answer>`, який не має поля введення для підпису.

label-for-must-reference-input-or-answer = Атрибут `for` на `<label>` має посилатися на поле введення або на answer.

## Accessibility

accessibility-short-description-or-decorative = Для доступності `<{ $component }>` має або мати короткий опис, або бути позначеним як декоративний.

accessibility-video-short-description = Для доступності `<video>` має мати короткий опис.

accessibility-input-short-description-or-label = Для доступності `<{ $component }>` має мати короткий опис або підпис.

accessibility-answer-input-short-description-or-label = Для доступності `<answer>`, що створює поле введення, має мати короткий опис або підпис.

accessibility-short-description-contains-math = Короткі описи не повинні містити математичних компонентів на кшталт `<{ $component }>`. Записуйте математику словами.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } має недостатній контраст для тексту заголовка розділу (темна тема) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; потрібно щонайменше { $threshold }:1).
       *[other] { $colorName } має недостатній контраст для тексту заголовка розділу ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; потрібно щонайменше { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` через { $count } точок не реалізовано для випадку, коли точки не мають числових значень.

circle-too-many-through-points = Неможливо обчислити коло більш ніж через 3 точки.

circle-overprescribed-radius-center-points = Неможливо обчислити коло із заданими радіусом, центром і точками.

circle-center-with-multiple-points = Неможливо обчислити коло із заданим центром більш ніж через 1 точку.

circle-radius-too-small = Неможливо обчислити коло: за відстані між двома точками { $distance } заданий радіус { $radius } замалий.

circle-radius-with-many-points = Неможливо створити коло більш ніж через дві точки із заданим радіусом.

circle-invalid-center-or-through-points = Некоректний центр або точки кола.

circle-radius-center-with-multiple-points = Неможливо обчислити радіус кола із заданим центром більш ніж через 1 точку.

circle-change-radius-non-numerical = Неможливо змінити радіус кола з нечисловими точками

circle-radius-with-points-non-numerical = Неможливо створити коло більш ніж через одну точку із заданим радіусом, коли немає числових значень.

circle-change-center-non-numerical = Зміну центра кола через точки з нечисловими значеннями не реалізовано.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Недостатня розмірність області визначення функції. Область має { $intervals } проміжок, а функція має { $inputs ->
            [one] { $inputs } вхід
            [few] { $inputs } входи
            [many] { $inputs } входів
           *[other] { $inputs } входи
        }.
        [few] Недостатня розмірність області визначення функції. Область має { $intervals } проміжки, а функція має { $inputs ->
            [one] { $inputs } вхід
            [few] { $inputs } входи
            [many] { $inputs } входів
           *[other] { $inputs } входи
        }.
       *[other] Недостатня розмірність області визначення функції. Область має { $intervals } проміжків, а функція має { $inputs ->
            [one] { $inputs } вхід
            [few] { $inputs } входи
            [many] { $inputs } входів
           *[other] { $inputs } входи
        }.
    }

function-domain-invalid-format = Некоректний формат області визначення функції.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Нечисловий максимум функції ігнорується.
        [minimum] Нечисловий мінімум функції ігнорується.
        [extremum] Нечисловий екстремум функції ігнорується.
        [point] Нечислова точка функції ігнорується.
        [slope] Нечисловий нахил функції ігнорується.
       *[other] Нечислове { $type } функції ігнорується.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Порожній максимум функції ігнорується.
        [minimum] Порожній мінімум функції ігнорується.
        [extremum] Порожній екстремум функції ігнорується.
        [point] Порожня точка функції ігнорується.
       *[other] Порожнє { $type } функції ігнорується.
    }

function-points-too-close = Функція містить дві точки, розташовані надто близько одна до одної. Неможливо визначити функцію.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Ітерації функції можливі, лише якщо кількість входів дорівнює кількості виходів. Ця функція має { $inputs } вхід і { $outputs ->
            [one] { $outputs } вихід
            [few] { $outputs } виходи
            [many] { $outputs } виходів
           *[other] { $outputs } виходи
        }.
        [few] Ітерації функції можливі, лише якщо кількість входів дорівнює кількості виходів. Ця функція має { $inputs } входи і { $outputs ->
            [one] { $outputs } вихід
            [few] { $outputs } виходи
            [many] { $outputs } виходів
           *[other] { $outputs } виходи
        }.
       *[other] Ітерації функції можливі, лише якщо кількість входів дорівнює кількості виходів. Ця функція має { $inputs } входів і { $outputs ->
            [one] { $outputs } вихід
            [few] { $outputs } виходи
            [many] { $outputs } виходів
           *[other] { $outputs } виходи
        }.
    }

## `<sequence>`

sequence-invalid-length = Некоректна довжина послідовності.  Має бути невід'ємним цілим числом.

sequence-invalid-step = Некоректний крок послідовності.  Для послідовності типу { $type } має бути числом.

sequence-invalid-endpoint-number = Некоректне «{ $attribute }» числової послідовності.  Має бути числом.

sequence-invalid-endpoint-letters = Некоректне «{ $attribute }» літерної послідовності.  Має бути комбінацією літер.

sequence-invalid-endpoint = Некоректне «{ $attribute }» послідовності.

select-from-sequence-coprime-not-numbers = coprime ігнорується, бо вибираються не числа

select-from-sequence-coprime-with-exclude-combinations = coprime ігнорується, бо задано excludeCombinations

## Resolving a `target`

target-not-found = Некоректний target для `<{ $source }>`: ціль не знайдено.

target-state-variable-not-found = Некоректний target для `<{ $source }>`: не знайдено змінної стану «{ $property }» на `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Змінні `<odeSystem>` мають відрізнятися від незалежної змінної.

ode-system-duplicate-variable-names = Неможливо визначити праві частини ОДР із однаковими назвами залежних змінних.

ode-system-rhs-function-error = Неможливо визначити праву частину ОДР.  Помилка створення функції mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Неможливо визначити кут між { $count } прямими

angle-invalid-through-point = Некоректна точка в through у `<angle>`

parabola-vertex-too-many-points = Параболу з вершиною більш ніж через 1 точку не реалізовано.

parabola-too-many-points = Параболу більш ніж через 3 точки не реалізовано.

intersection-too-many-items = Перетин більш ніж двох об'єктів не реалізовано

## Other math components

ionic-compound-not-two-ions = Йонну сполуку реалізовано лише для двох йонів.

ionic-compound-needs-cation-and-anion = Йонну сполуку реалізовано лише для одного катіона й одного аніона.

solve-equations-cannot-evaluate = Неможливо розв'язати рівняння, бо не вдалося його обчислити: { $equation }

math-operators-operand-number-required = Під час виділення математичного операнда потрібно задати operandNumber.

eigen-decomposition-failed = Не вдалося обчислити власні значення матриці

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: параметр { $parameters } не трапляється в шаблоні, тому завжди відповідатиме порожньому місцю.
       *[other] `<matchesPattern>`: параметри { $parameters } не трапляються в шаблоні, тому завжди відповідатимуть порожньому місцю.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: неможливо розпізнати grid="{ $grid }". Має бути none, medium, dense або два додатні числа, розділені пробілом, наприклад grid="1 0.5". Сітка не малюється.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" не підтримується в модулі відображення prefigure; використано поведінку для right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" не підтримується в модулі відображення prefigure; використано поведінку для top.

prefigure-invalid-axis-bounds = `<graph>`: некоректні межі осей для перетворення prefigure; використано типовий bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: некоректна ширина для перетворення prefigure; використано типову ширину діаграми 425.

prefigure-invalid-aspect-ratio = `<graph>`: некоректний aspectRatio для перетворення prefigure; використано типове співвідношення сторін 1.

prefigure-grid-spacing-too-fine = `<graph>`: крок сітки надто дрібний для меж осей; у модулі відображення prefigure сітку не намальовано.

prefigure-annotations-not-rendered = `<graph>`: анотації не відображаються, якщо не використовується модуль відображення PreFigure.

multiple-annotations-children = У `<graph>` знайдено кілька дочірніх `<annotations>`; усі, крім останнього, ігноруються.

## Referring to other components

copy-unrecognized-component-type = Неможливо розширити або скопіювати нерозпізнаний тип компонента: { $type }.

copy-prop-not-found = Не знайдено властивості { $property } на компоненті типу { $component }

collect-no-source = Для collect не знайдено джерела.

collect-invalid-component-type = Неможливо зібрати компоненти типу `<{ $component }>`, бо це некоректний тип компонента.

reference-index-unavailable = Неможливо звернутися до індексу `{ $reference }`

## `<callAction>`

component-action-unavailable = Неможливо викликати { $action } на компоненті `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Дані мають некоректну форму.  Рядки мають різну довжину. Виявлено в componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Дані містять однакові назви стовпців.  Виявлено в componentIdx :{ $componentIdx }

data-frame-missing-column-name = У даних бракує назви стовпця.  Виявлено в componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Нарахування балів для цієї відповіді спирається на надіслану відповідь самого тега answer, що призведе до неочікуваної поведінки.

answer-max-num-attempts-in-section-wide-check-work = Задавання `maxNumAttempts` на `<answer>` усередині контейнера з `sectionWideCheckWork` не діє, бо кількість спроб визначає контейнер. Задайте `maxNumAttempts` на контейнері.

nested-section-wide-check-work-max-num-attempts = Задавання `maxNumAttempts` на контейнері з `sectionWideCheckWork`, який міститься в іншому контейнері з `sectionWideCheckWork`, не діє, бо кількість спроб визначає зовнішній контейнер. Задайте `maxNumAttempts` на зовнішньому контейнері.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Атрибут { $attributes } не діятиме без заданого symbolicEquality.
       *[other] Атрибути { $attributes } не діятимуть без заданого symbolicEquality.
    }

answer-invalid-type = Некоректний тип для answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Оскільки компонент `<{ $component }>` не має імені, його не можна використати як атрибут модуля

module-attribute-name-already-defined = Компонент `<{ $component } name="{ $name }">` не можна використати як атрибут модуля, бо тип компонента `<module>` уже має атрибут «{ $name }».

conditional-content-condition-ignored = Атрибут `condition` ігнорується на компоненті `<conditionalContent>` з дочірніми case або else.

slider-markers-type-mismatch = Тип маркерів не збігається з типом повзунка.

pretzel-problem-needs-statement-and-answer = Некоректний pretzel: кожен `<problem>` має містити один `<statement>` і один `<answer>`.

pretzel-circuit-first-problem-distractor = Некоректний pretzel: у mode="circuit" перший `<problem>` не може бути відволікачем.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Некоректне значення { $values } для атрибута `{ $attribute }`; ігнорується.
       *[other] Некоректні значення { $values } для атрибута `{ $attribute }`; ігноруються.
    }

attribute-must-be-references = Некоректне значення `{ $value }` для атрибута `{ $attribute }`. Атрибут має складатися з посилань, що починаються з `$`.

math-input-invalid-function-names = <mathInput>: у { $attribute } проігноровано некоректні назви функцій: { $names }. Показова частина кожної назви має містити щонайменше 2 символи (літери або дефіси); після неї може стояти необов'язковий суфікс `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Некоректний тип компонента: `<{ $componentType }>`

attribute-repeated = Не можна повторювати атрибут { $attribute }.

attribute-invalid-for-component = Некоректний атрибут «{ $attribute }» для компонента типу `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Означення стилю { $styleNumber } має недостатній контраст { $context ->
        [text-on-background] кольору тексту щодо кольору тла
        [high-contrast] висококонтрастного кольору щодо полотна
        [line] кольору лінії щодо полотна
        [marker] кольору маркера щодо полотна
       *[text-on-canvas] кольору тексту щодо полотна
    }{ $mode ->
        [dark] { " (темна тема)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; потрібно щонайменше { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Хоча в означенні стилю { $styleNumber } задано кольори з достатнім контрастом для світлої теми, похідні від них кольори темної теми дають недостатній контраст кольору тексту щодо кольору тла ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; потрібно щонайменше { $threshold }:1). { $suggestion ->
        [available] Щоб забезпечити достатній контраст у темній темі, або збільште контраст у світлій темі (наприклад, задайте { $lightAttribute }="{ $lightColor }"), або перевизначте колір темної теми (наприклад, задайте { $darkAttribute }="{ $darkColor }").
       *[none] Щоб забезпечити достатній контраст у темній темі, збільште контраст у світлій темі або перевизначте похідні кольори через textColorDarkMode та/або backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Хоча в означенні стилю { $styleNumber } задано колір тексту з достатнім контрастом для світлої теми, похідний від нього колір тексту темної теми дає недостатній контраст щодо полотна ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; потрібно щонайменше { $threshold }:1). { $suggestion ->
        [available] Щоб забезпечити достатній контраст у темній темі, або збільште контраст у світлій темі (наприклад, задайте textColor="{ $lightColor }"), або перевизначте колір темної теми (наприклад, задайте textColorDarkMode="{ $darkColor }").
       *[none] Щоб забезпечити достатній контраст у темній темі, збільште контраст у світлій темі або перевизначте похідний колір через textColorDarkMode.
    }

section-multiple-style-palettes = Розділ може вибрати лише одну <stylePalette>; використано останню.

## Unique variants

variant-num-to-select-not-non-negative-integer = неможливо визначити унікальні варіанти { $component }, бо numToSelect не є невід'ємним цілим числом.

variant-num-to-select-not-constant-number = неможливо визначити унікальні варіанти { $component }, бо numToSelect не є сталим числом.

variant-with-replacement-not-constant-boolean = неможливо визначити унікальні варіанти { $component }, бо withReplacement не є сталим булевим значенням.

variant-select-weight-disables-unique = Унікальні варіанти для select вимкнено, якщо є опція із заданим selectWeight або selectForVariants

variant-coprime-undetermined = неможливо визначити унікальні варіанти { $component }, бо неможливо встановити, що coprime завжди хибне.

variant-attribute-not-constant = неможливо визначити унікальні варіанти { $component }, бо { $attribute } не є сталим.

variant-attribute-not-number = неможливо визначити унікальні варіанти { $component }, бо { $attribute } не є числом.

variant-attribute-wrong-type-for-sequence =
    неможливо визначити унікальні варіанти { $component } типу { $type }, бо { $attribute } не є { $expected ->
        [letters-combination] комбінацією літер
        [math-expression] коректним математичним виразом
        [integer] цілим числом
       *[number] числом
    }.

variant-length-not-integer = неможливо визначити унікальні варіанти { $component }, бо length не є цілим числом.

variant-sort-not-implemented = унікальні варіанти { $component } із sort не реалізовано

variant-exclude-combinations-not-implemented = унікальні варіанти { $component } із excludeCombinations не реалізовано

variant-math-exclude-not-implemented = унікальні варіанти { $component } типу math з exclude не реалізовано

variant-non-constant-exclude-not-implemented = унікальні варіанти { $component } з несталим exclude не реалізовано

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: не підтримується в модулі відображення graph prefigure; нащадка пропущено.

prefigure-descendant-invalid-geometry = { $subject }: нескінченна або неповна геометрія; нащадка пропущено.

prefigure-curve-label-omitted = { $subject }: підписи не підтримуються на перетворених елементах кривої; підпис пропущено.

prefigure-curve-unsupported-definition-type = { $subject }: непідтримуваний тип означення кривої «{ $definitionType }»; нащадка пропущено.

prefigure-region-flip-functions-unsupported = { $subject }: непідтримуваний атрибут flipFunctions на regionBetweenCurves; нащадка пропущено.

prefigure-region-non-formula-child = { $subject }: на regionBetweenCurves підтримуються лише дочірні функції, задані формулою; нащадка пропущено.

prefigure-label-position-unsupported =
    { $subject }: непідтримуваний labelPosition «{ $labelPosition }» для { $labelKind ->
        [line-family] підпису об'єкта родини прямих
       *[point] підпису точки
    }; використано типове вирівнювання PreFigure.

prefigure-fill-style-unsupported = { $subject }: стиль заповнення «{ $fillStyle }» не підтримується PreFigure; використано суцільне заповнення.

prefigure-line-style-unknown = { $subject }: невідомий стиль лінії «{ $lineStyle }» вилучено з виводу PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: стиль маркера «{ $markerStyle }» зіставлено зі стилем PreFigure «diamond».

prefigure-marker-style-unsupported = { $subject }: стиль маркера «{ $markerStyle }» не підтримується PreFigure; використано типовий стиль.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: некоректний `ref`; неможливо визначити ціль. Анотацію пропущено.

annotation-ref-multiple-targets = `<annotation>`: `ref` вказує на кілька цілей; використано першу.

annotation-ref-outside-graph = `<annotation>`: некоректний `ref`; ціль поза межами графіка, що її містить. Анотацію пропущено.

annotation-ref-unsupported-target = `<annotation>`: некоректний `ref`; ціль не є підтримуваним графічним об'єктом у перетворенні prefigure. Анотацію пропущено.

annotation-text-missing = `<annotation>`: бракує `text` або він порожній; виведено порожній текст.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Виявлено циклічну залежність.
       *[other] Виявлено циклічну залежність за участю компонента `<{ $componentType }>`.
    }

reference-no-referent = Не знайдено об'єкта для посилання: `{ $reference }`

reference-multiple-referents = Знайдено кілька об'єктів для посилання: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Некоректний формат атрибута { $attribute } у `<{ $componentType }>`.

children-invalid = Некоректні дочірні елементи для `<{ $componentType }>`: знайдено некоректні дочірні елементи: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Некоректне значення `{ $value }` для атрибута `{ $attribute }`, використано значення `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Версію DoenetML { $version } не знайдено.
       *[other] Версію DoenetML { $version } не знайдено. Використовується версія { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Некоректний DoenetML: { $content }

parse-tag-missing-close-tag = Некоректний DoenetML: тег `{ $tag }` не має закривального тега. Очікується самозакривний тег або тег `</{ $tagName }>`.

parse-tag-error = Некоректний DoenetML: помилка в тезі `<{ $tagName }>`

parse-attribute-missing-value = Некоректний DoenetML: у некоректного атрибута `{ $attribute }`, схоже, бракує значення.

parse-attribute-invalid = Некоректний DoenetML: некоректний атрибут `{ $attribute }`

parse-attribute-value-invalid = Некоректний DoenetML: некоректне значення атрибута `{ $value }`

parse-attribute-value-quote-mismatch = Некоректний DoenetML: некоректне значення атрибута `{ $value }`. Лапки не збігаються. Схоже, бракує `{ $quote }`

parse-open-tag-name-missing = Некоректний DoenetML: знайдено тег без назви, наприклад `<`

parse-tag-not-closed = Некоректний DoenetML: тег `{ $tag }` не закрито (схоже, бракує `>`).

parse-self-closing-tag-name-missing = Некоректний DoenetML: знайдено тег без назви `<{ $content }>`

parse-self-closing-tag-not-closed = Некоректний DoenetML: тег `{ $tag }` не закрито (схоже, бракує `/>`).

parse-tag-invalid-attributes = Некоректний DoenetML: тег `{ $tag }` некоректний. Можливо, у нього неправильні атрибути.

parse-close-tag-name-missing = Некоректний DoenetML: знайдено закривальний тег без назви, наприклад `</`

parse-attribute-value-unquoted = Значення атрибутів мають бути взяті в лапки: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Некоректний DoenetML: знайдено закривальний тег `{ $tag }`, але немає відповідного відкривального

parse-close-tag-mismatched = Некоректний DoenetML: невідповідний закривальний тег. Очікувався `</{ $expected }>`. Знайдено `{ $found }`

parser-node-unconvertible = Не вдалося перетворити вузол { $node } на вузол Dast.

## Names

name-attribute-invalid =
    Некоректний атрибут name='{ $name }'. { $reason ->
        [characters] Імена можуть містити лише літери, цифри, підкреслення або дефіси.
       *[start] Імена мають починатися з літери.
    }

component-name-invalid-start = Некоректне ім'я компонента «{ $name }». Імена мають починатися з літери.

## `<answer>` sugar

answer-video-watched-missing-video = answer з type videoWatched має мати атрибут video

answer-video-watched-video-not-reference = answer з type videoWatched має мати атрибут video, що є посиланням

answer-name-not-single-text = Атрибут name у answer має мати один дочірній текстовий елемент

## Referencing another document

external-doenetml-recursion-limit = Не вдалося отримати зовнішній DoenetML через надто багато рівнів рекурсії. Чи немає тут циклічного посилання?

external-doenetml-unavailable = Не вдалося отримати DoenetML з { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Отримано некоректний DoenetML з { $attribute }="{ $uri }": він не відповідає типу компонента «{ $componentType }»

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Атрибут `{ $from }` застарів; використовуйте натомість `{ $to }`.
       *[other] [deprecation] Атрибут `{ $from }` на `<{ $component }>` застарів; використовуйте натомість `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Атрибут `{ $from }` застарів і ігнорується, бо задано також `{ $to }`.
       *[other] [deprecation] Атрибут `{ $from }` на `<{ $component }>` застарів і ігнорується, бо задано також `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Атрибут `{ $attribute }` на `<{ $component }>` застарів і ігнорується.


## Language coverage

pluralize-english-only = `<pluralize>` уміє утворювати множину лише в англійській, тому в документі, написаному мовою { $locale }, його текст залишається незмінним. Запишіть форму множини безпосередньо або задайте її атрибутом `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Елемент `<{ $tag }>` не є розпізнаним елементом Doenet.

schema-element-not-allowed-at-root = Елемент `<{ $tag }>` не дозволено в корені документа.

schema-element-not-allowed-inside = Елемент `<{ $tag }>` не дозволено всередині `<{ $parent }>`.

schema-attribute-unrecognized = Елемент `<{ $tag }>` не має атрибута з назвою `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Атрибут `{ $attribute }` елемента `<{ $tag }>` має бути списком, кожен елемент якого є одним із: { $allowed }
       *[other] Атрибут `{ $attribute }` елемента `<{ $tag }>` має бути одним із: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Некоректна назва варіанта для select.  Назва варіанта { $variantName } трапляється в { $numOptions } опціях, а вибрати треба { $numToSelect }.

select-variant-name-without-options = Для select задано варіанти, але не задано опцій для можливої назви варіанта: { $variantName }.

select-variant-name-not-possible = Назва варіанта { $variantName }, задана для select, не є можливою назвою варіанта.

select-too-few-options = Неможливо вибрати { $numToSelect } компонентів лише з { $numOptions }.

select-from-sequence-too-few-values = Неможливо вибрати { $numToSelect } значень із послідовності довжини { $length }.

select-from-sequence-indices-count-mismatch = Кількість заданих для select індексів має збігатися з кількістю, яку треба вибрати

select-from-sequence-indices-not-integers = Усі задані для select індекси мають бути цілими числами

select-from-sequence-index-excluded = Заданий індекс selectfromsequence було виключено

select-from-sequence-indices-excluded-combination = Задані індекси selectfromsequence утворювали виключену комбінацію

select-from-sequence-coprime-not-positive-integers = Неможливо вибрати взаємно прості комбінації, бо вибираються не додатні цілі числа.

select-from-sequence-coprime-common-factor = Неможливо вибрати взаємно прості числа. Усі можливі значення мають спільний дільник. (Задані значення "from" або "to" мають бути взаємно простими зі "step".)

select-from-sequence-coprime-single-number = Неможливо вибрати взаємно прості комбінації з одного числа, відмінного від 1.

select-from-sequence-excluded-too-many-combinations = У selectFromSequence виключено понад 70% комбінацій

select-from-sequence-coprime-none-found = Не вдалося вибрати взаємно прості числа. Усі можливі значення мають спільний дільник.

select-from-sequence-too-few-unique-values = Неможливо вибрати { $numToSelect } унікальних значень із послідовності довжини { $numPossibleValues }

select-prime-numbers-too-few-values = Неможливо вибрати { $numToSelect } значень зі списку простих чисел довжини { $numValues }

select-prime-numbers-values-count-mismatch = Кількість заданих для select значень має збігатися з кількістю, яку треба вибрати

select-prime-numbers-values-not-prime = Усі значення, задані для вибору простого числа, мають бути у списку простих чисел

select-prime-numbers-values-excluded-combination = Задані значення selectPrimeNumbers утворювали виключену комбінацію

select-prime-numbers-excluded-too-many-combinations = У selectPrimeNumbers виключено понад 70% комбінацій

select-random-combination-fluke = За вкрай малоймовірним збігом не вдалося вибрати комбінацію випадкових значень

select-random-value-fluke = За вкрай малоймовірним збігом не вдалося вибрати випадкове значення
