# Bulgarian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Bulgarian counts in the same two categories English does, so every selection
# below keeps both branches.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } се игнорира, когато са зададени двата края
       *[other] { $attributes } се игнорират, когато са зададени двата края
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } се игнорира, когато са зададени и край, и среда
       *[other] { $attributes } се игнорират, когато са зададени и край, и среда
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset няма ефект без зададена среда

## `<line>`

line-points-undetermined-dimensions = Права през точки с неопределена размерност.

line-points-too-few-dimensions = Правата трябва да минава през точки с размерност поне две.

line-points-depend-on-variables = Правата минава през точки, които зависят от променливи: { $variables }.

line-equation-invalid-format = Невалиден формат на уравнение на права в променливите { $variable1 } и { $variable2 }.

## `<ray>`

ray-overprescribed-through = Лъчът е зададен чрез through, endpoint и direction. Зададеното through се игнорира.

ray-dimension-mismatch = Несъответствие в numDimensions на лъча.

## `<vector>`

vector-overprescribed-head = Векторът е зададен чрез head, tail и displacement. Зададеното head се игнорира.

vector-dimension-mismatch = Несъответствие в numDimensions на вектора.

## Attracting and constraining

attract-to-without-nearest-point = Не може да се привлича към `<{ $component }>`: той няма променлива на състоянието nearestPoint.

constrain-to-without-nearest-point = Не може да се ограничава към `<{ $component }>`: той няма променлива на състоянието nearestPoint.

constrain-to-interior-without-nearest-point = Не може да се ограничава към вътрешността на `<{ $component }>`: той няма променлива на състоянието nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition се игнорира за невграден choiceInput

## Ordering children by index

choice-input-indices-count-mismatch = Зададените за choiceInput индекси се игнорират: броят им не съвпада с броя на дъщерните choice.

pretzel-indices-count-mismatch = Зададените за problem индекси се игнорират: броят им не съвпада с броя на дъщерните problem.

shuffle-indices-count-mismatch = Зададените за shuffle индекси се игнорират: броят им не съвпада с броя на компонентите.

indices-ignored-out-of-range = Зададените за { $component } индекси се игнорират: някои са извън допустимия обхват.

pretzel-indices-repeated = Зададените за pretzel индекси се игнорират: някои се повтарят.

pretzel-circuit-first-index = Зададените за pretzel в режим circuit индекси се игнорират: първият индекс трябва да е 1.

## `<shuffle>` and `<sort>`

string-children-need-type = За да работи `<{ $component }>` с текстови дъщерни елементи, трябва да е зададен атрибут `type`.

invalid-type-defaulting-to-math = Невалиден тип { $type } за компонент { $component }. Трябва да е math, text, number или boolean. Използва се math.

string-not-valid-component-to-arrange = Низът „{ $value }“ не е валиден компонент за { $component }. Игнорира се.

## Types and variables

invalid-type-defaulting-to-number = Невалиден тип { $type }; типът се задава на number.

invalid-variable-value = Невалидна стойност на променлива: `{ $value }`

## Variants

variant-index-must-be-number = Индексът на варианта { $index } трябва да е число

variant-index-must-be-integer = Индексът на варианта { $index } трябва да е цяло число

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` не е реализиран за абсолютни мерки. Ширините стават относителни.

side-by-side-absolute-margins = `<{ $component }>` не е реализиран за абсолютни мерки. Отстоянията стават относителни.

side-by-side-no-block-child = Невалиден `<{ $component }>`: той трябва да има поне един блоков дъщерен елемент.

## `<label>`

label-for-ignored-on-graphical = Атрибутът `for` на графичен `<label>` се игнорира.

label-for-must-resolve-to-one = Атрибутът `for` на `<label>` трябва да сочи точно към един компонент.

label-for-unresolved = Атрибутът `for` на `<label>` не можа да бъде разрешен до компонент.

label-for-answer-with-authored-inputs = Атрибутът `for` на `<label>` сочи към `<answer>` с изрично записани полета за въвеждане; сочете направо към полето.

label-for-answer-without-input = Атрибутът `for` на `<label>` сочи към `<answer>` без поле за въвеждане, което да бъде надписано.

label-for-must-reference-input-or-answer = Атрибутът `for` на `<label>` трябва да сочи към поле за въвеждане или към отговор.

## Accessibility

accessibility-short-description-or-decorative = За достъпност `<{ $component }>` трябва да има кратко описание или да е обозначен като декоративен.

accessibility-video-short-description = За достъпност `<video>` трябва да има кратко описание.

accessibility-input-short-description-or-label = За достъпност `<{ $component }>` трябва да има кратко описание или надпис.

accessibility-answer-input-short-description-or-label = За достъпност `<answer>`, който създава поле за въвеждане, трябва да има кратко описание или надпис.

accessibility-short-description-contains-math = Кратките описания не бива да съдържат математически компоненти като `<{ $component }>`. Запишете математиката с думи.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } има недостатъчен контраст за текста на заглавието на раздела (тъмна тема) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; изисква се поне { $threshold }:1).
       *[other] { $colorName } има недостатъчен контраст за текста на заглавието на раздела ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; изисква се поне { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` през { $count } точки не е реализирана, когато точките нямат числови стойности.

circle-too-many-through-points = Не може да се изчисли окръжност през повече от 3 точки.

circle-overprescribed-radius-center-points = Не може да се изчисли окръжност със зададени радиус, център и точки.

circle-center-with-multiple-points = Не може да се изчисли окръжност със зададен център през повече от 1 точка.

circle-radius-too-small = Не може да се изчисли окръжност: тъй като разстоянието между двете точки е { $distance }, зададеният радиус { $radius } е твърде малък.

circle-radius-with-many-points = Не може да се построи окръжност през повече от две точки със зададен радиус.

circle-invalid-center-or-through-points = Невалиден център или точки на окръжността.

circle-radius-center-with-multiple-points = Не може да се изчисли радиус на окръжност със зададен център през повече от 1 точка.

circle-change-radius-non-numerical = Не може да се промени радиусът на окръжност с нечислови точки

circle-radius-with-points-non-numerical = Не може да се построи окръжност през повече от една точка със зададен радиус, когато няма числови стойности.

circle-change-center-non-numerical = Промяната на центъра на окръжност през нечислови точки не е реализирана.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Недостатъчна размерност на дефиниционната област на функцията. Областта има { $intervals } интервал, а функцията има { $inputs ->
            [one] { $inputs } вход
           *[other] { $inputs } входа
        }.
       *[other] Недостатъчна размерност на дефиниционната област на функцията. Областта има { $intervals } интервала, а функцията има { $inputs ->
            [one] { $inputs } вход
           *[other] { $inputs } входа
        }.
    }

function-domain-invalid-format = Невалиден формат на дефиниционната област на функцията.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Нечисловият максимум на функцията се игнорира.
        [minimum] Нечисловият минимум на функцията се игнорира.
        [extremum] Нечисловият екстремум на функцията се игнорира.
        [point] Нечисловата точка на функцията се игнорира.
        [slope] Нечисловият наклон на функцията се игнорира.
       *[other] Нечисловото { $type } на функцията се игнорира.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Празният максимум на функцията се игнорира.
        [minimum] Празният минимум на функцията се игнорира.
        [extremum] Празният екстремум на функцията се игнорира.
        [point] Празната точка на функцията се игнорира.
       *[other] Празното { $type } на функцията се игнорира.
    }

function-points-too-close = Функцията съдържа две точки, разположени твърде близо. Функцията не може да бъде дефинирана.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Итерации на функция са възможни само ако броят на входовете е равен на броя на изходите. Тази функция има { $inputs } вход и { $outputs ->
            [one] { $outputs } изход
           *[other] { $outputs } изхода
        }.
       *[other] Итерации на функция са възможни само ако броят на входовете е равен на броя на изходите. Тази функция има { $inputs } входа и { $outputs ->
            [one] { $outputs } изход
           *[other] { $outputs } изхода
        }.
    }

## `<sequence>`

sequence-invalid-length = Невалидна дължина на редицата. Тя трябва да е неотрицателно цяло число.

sequence-invalid-step = Невалидна стъпка на редицата. За редица от тип { $type } тя трябва да е число.

sequence-invalid-endpoint-number = Невалидно „{ $attribute }“ на числова редица. То трябва да е число.

sequence-invalid-endpoint-letters = Невалидно „{ $attribute }“ на буквена редица. То трябва да е съчетание от букви.

sequence-invalid-endpoint = Невалидно „{ $attribute }“ на редицата.

select-from-sequence-coprime-not-numbers = coprime се игнорира, защото не се избират числа

select-from-sequence-coprime-with-exclude-combinations = coprime се игнорира, защото е зададено excludeCombinations

## Resolving a `target`

target-not-found = Невалиден target за `<{ $source }>`: целта не е намерена.

target-state-variable-not-found = Невалиден target за `<{ $source }>`: `<{ $component }>` няма променлива на състоянието с име „{ $property }“.

## `<odeSystem>`

ode-system-variables-match-independent = Променливите на `<odeSystem>` трябва да се различават от независимата променлива.

ode-system-duplicate-variable-names = Не може да се дефинират десните страни на ОДУ с повтарящи се имена на зависими променливи.

ode-system-rhs-function-error = Не може да се дефинира дясната страна на ОДУ. Грешка при създаване на функция на mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Не може да се дефинира ъгъл между { $count } прави

angle-invalid-through-point = Невалидна точка в through на `<angle>`

parabola-vertex-too-many-points = Парабола със зададен връх през повече от 1 точка не е реализирана.

parabola-too-many-points = Парабола през повече от 3 точки не е реализирана.

intersection-too-many-items = Сечение на повече от два обекта не е реализирано

## Other math components

ionic-compound-not-two-ions = Йонни съединения, различни от съединения на два йона, не са реализирани.

ionic-compound-needs-cation-and-anion = Йонните съединения са реализирани само за един катион и един анион.

solve-equations-cannot-evaluate = Уравнението не може да бъде решено, защото не можа да бъде изчислено: { $equation }

math-operators-operand-number-required = За извличане на математически операнд трябва да се зададе operandNumber.

eigen-decomposition-failed = Собствените стойности на матрицата не можаха да бъдат изчислени

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: параметърът { $parameters } не се среща в образеца, затова той винаги ще съвпада с празно място.
       *[other] `<matchesPattern>`: параметрите { $parameters } не се срещат в образеца, затова те винаги ще съвпадат с празно място.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" не може да бъде разчетено. Стойността трябва да е none, medium, dense или две положителни числа, разделени с интервал, например grid="1 0.5". Не се чертае мрежа.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" не се поддържа в изобразителя prefigure; използва се поведението за дясна позиция.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" не се поддържа в изобразителя prefigure; използва се поведението за горна позиция.

prefigure-invalid-axis-bounds = `<graph>`: невалидни граници на осите за преобразуване към prefigure; използва се bbox по подразбиране (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: невалидна ширина за преобразуване към prefigure; използва се ширина на диаграмата по подразбиране 425.

prefigure-invalid-aspect-ratio = `<graph>`: невалидно aspectRatio за преобразуване към prefigure; използва се съотношение на страните по подразбиране 1.

prefigure-grid-spacing-too-fine = `<graph>`: стъпката на мрежата е твърде ситна за границите на осите; в изобразителя prefigure мрежата се пропуска.

prefigure-annotations-not-rendered = `<graph>`: извън изобразителя PreFigure анотациите не се показват.

multiple-annotations-children = В `<graph>` са намерени няколко дъщерни `<annotations>`; всички освен последния се игнорират.

## Referring to other components

copy-unrecognized-component-type = Не може да се разшири или копира неразпознат тип компонент: { $type }.

copy-prop-not-found = Свойството { $property } не е намерено в компонент от тип { $component }

collect-no-source = За collect не е намерен източник.

collect-invalid-component-type = Не може да се събират компоненти от тип `<{ $component }>`: това е невалиден тип компонент.

reference-index-unavailable = Не може да се сочи индекс `{ $reference }`

## `<callAction>`

component-action-unavailable = Не може да се извика { $action } на компонент `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Данните имат невалидна форма. Редовете са с различна дължина. Намерено в componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Данните имат повтарящи се имена на стълбове. Намерено в componentIdx :{ $componentIdx }

data-frame-missing-column-name = В данните липсва име на стълб. Намерено в componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award на този отговор се основава на изпратения отговор на самия таг answer, което ще доведе до неочаквано поведение.

answer-max-num-attempts-in-section-wide-check-work = Задаването на `maxNumAttempts` на `<answer>` в контейнер със `sectionWideCheckWork` няма ефект, защото броят опити се определя от контейнера. Задайте `maxNumAttempts` на контейнера.

nested-section-wide-check-work-max-num-attempts = Задаването на `maxNumAttempts` на контейнер със `sectionWideCheckWork`, който сам е в друг контейнер със `sectionWideCheckWork`, няма ефект, защото броят опити се определя от външния контейнер. Задайте `maxNumAttempts` на външния контейнер.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Атрибутът { $attributes } няма да има ефект без зададено symbolicEquality.
       *[other] Атрибутите { $attributes } няма да имат ефект без зададено symbolicEquality.
    }

answer-invalid-type = Невалиден тип за answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Компонентът `<{ $component }>` няма име, затова не може да се използва като атрибут на модул

module-attribute-name-already-defined = Компонентът `<{ $component } name="{ $name }">` не може да се използва като атрибут на модул, защото типът компонент `<module>` вече има дефиниран атрибут „{ $name }“.

conditional-content-condition-ignored = Атрибутът `condition` се игнорира за компонент `<conditionalContent>` с дъщерни case или else.

slider-markers-type-mismatch = Типът на маркерите не съвпада с типа на плъзгача.

pretzel-problem-needs-statement-and-answer = Невалиден pretzel: всеки `<problem>` трябва да съдържа един `<statement>` и един `<answer>`.

pretzel-circuit-first-problem-distractor = Невалиден pretzel: при mode="circuit" първият `<problem>` не може да е разсейващ.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Невалидна стойност { $values } за атрибут `{ $attribute }`; игнорира се.
       *[other] Невалидни стойности { $values } за атрибут `{ $attribute }`; игнорират се.
    }

attribute-must-be-references = Невалидна стойност `{ $value }` за атрибут `{ $attribute }`. Атрибутът трябва да е съставен от препратки, започващи с `$`.

math-input-invalid-function-names = <mathInput>: невалидните имена на функции в { $attribute } бяха игнорирани: { $names }. Показваната част на всяко име трябва да е поне 2 знака (букви или тирета); след нея може да следва незадължителен суфикс `|<алтернатива за mathspeak>`.

## Building components from the source

component-type-invalid = Невалиден тип компонент: `<{ $componentType }>`

attribute-repeated = Атрибутът { $attribute } не може да се повтаря.

attribute-invalid-for-component = Невалиден атрибут „{ $attribute }“ за компонент от тип `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Дефиницията на стил { $styleNumber } има недостатъчен контраст за { $context ->
        [text-on-background] цвета на текста спрямо цвета на фона
        [high-contrast] висококонтрастния цвят спрямо платното
        [line] цвета на линиите спрямо платното
        [marker] цвета на маркерите спрямо платното
       *[text-on-canvas] цвета на текста спрямо платното
    }{ $mode ->
        [dark] { " (тъмна тема)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; изисква се поне { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Макар че в дефиницията на стил { $styleNumber } са зададени цветове с достатъчен контраст за светла тема, изведените от тях цветове за тъмна тема дават недостатъчен контраст на текста спрямо фона ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; изисква се поне { $threshold }:1). { $suggestion ->
        [available] За достатъчен контраст в тъмна тема или увеличете контраста в светла тема (например { $lightAttribute }="{ $lightColor }"), или заменете цвета за тъмна тема (например { $darkAttribute }="{ $darkColor }").
       *[none] За достатъчен контраст в тъмна тема увеличете контраста в светла тема или заменете изведените цветове чрез textColorDarkMode и/или backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Макар че в дефиницията на стил { $styleNumber } е зададен цвят на текста с достатъчен контраст за светла тема, изведеният от него цвят на текста за тъмна тема дава недостатъчен контраст спрямо платното ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; изисква се поне { $threshold }:1). { $suggestion ->
        [available] За достатъчен контраст в тъмна тема или увеличете контраста в светла тема (например textColor="{ $lightColor }"), или заменете цвета за тъмна тема (например textColorDarkMode="{ $darkColor }").
       *[none] За достатъчен контраст в тъмна тема увеличете контраста в светла тема или заменете изведения цвят чрез textColorDarkMode.
    }

section-multiple-style-palettes = Един раздел може да избере само една <stylePalette>; използва се последната.

## Unique variants

variant-num-to-select-not-non-negative-integer = не могат да се определят уникалните варианти на { $component }, защото numToSelect не е неотрицателно цяло число.

variant-num-to-select-not-constant-number = не могат да се определят уникалните варианти на { $component }, защото numToSelect не е постоянно число.

variant-with-replacement-not-constant-boolean = не могат да се определят уникалните варианти на { $component }, защото withReplacement не е постоянна логическа стойност.

variant-select-weight-disables-unique = Уникалните варианти за select са изключени, ако някоя възможност има зададено selectWeight или selectForVariants

variant-coprime-undetermined = не могат да се определят уникалните варианти на { $component }, защото не може да се установи, че coprime винаги е невярно.

variant-attribute-not-constant = не могат да се определят уникалните варианти на { $component }, защото { $attribute } не е константа.

variant-attribute-not-number = не могат да се определят уникалните варианти на { $component }, защото { $attribute } не е число.

variant-attribute-wrong-type-for-sequence =
    не могат да се определят уникалните варианти на { $component } от тип { $type }, защото { $attribute } не е { $expected ->
        [letters-combination] съчетание от букви
        [math-expression] валиден математически израз
        [integer] цяло число
       *[number] число
    }.

variant-length-not-integer = не могат да се определят уникалните варианти на { $component }, защото length не е цяло число.

variant-sort-not-implemented = уникалните варианти на { $component } със sort не са реализирани

variant-exclude-combinations-not-implemented = уникалните варианти на { $component } с excludeCombinations не са реализирани

variant-math-exclude-not-implemented = уникалните варианти на { $component } от тип math с exclude не са реализирани

variant-non-constant-exclude-not-implemented = уникалните варианти на { $component } с непостоянно exclude не са реализирани

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: не се поддържа в изобразителя prefigure за графики; наследникът е пропуснат.

prefigure-descendant-invalid-geometry = { $subject }: безкрайна или непълна геометрия; наследникът е пропуснат.

prefigure-curve-label-omitted = { $subject }: надписи не се поддържат върху преобразувани елементи на криви; надписът е пропуснат.

prefigure-curve-unsupported-definition-type = { $subject }: неподдържан тип дефиниция на функция на крива „{ $definitionType }“; наследникът е пропуснат.

prefigure-region-flip-functions-unsupported = { $subject }: атрибутът flipFunctions на regionBetweenCurves не се поддържа; наследникът е пропуснат.

prefigure-region-non-formula-child = { $subject }: при regionBetweenCurves се поддържат само дъщерни функции, зададени с формула; наследникът е пропуснат.

prefigure-label-position-unsupported =
    { $subject }: неподдържано labelPosition „{ $labelPosition }“ за { $labelKind ->
        [line-family] надпис от семейството на правите
       *[point] надпис на точка
    }; използва се подравняването на PreFigure по подразбиране.

prefigure-fill-style-unsupported = { $subject }: стилът на запълване „{ $fillStyle }“ не се поддържа от PreFigure; използва се плътно запълване.

prefigure-line-style-unknown = { $subject }: неизвестният стил на линия „{ $lineStyle }“ е пропуснат в изхода на PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: стилът на маркера „{ $markerStyle }“ е съпоставен със стила „diamond“ на PreFigure.

prefigure-marker-style-unsupported = { $subject }: стилът на маркера „{ $markerStyle }“ не се поддържа от PreFigure; използва се стилът по подразбиране.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: невалиден `ref`; целта не може да бъде разрешена. Анотацията е пропусната.

annotation-ref-multiple-targets = `<annotation>`: `ref` сочи към няколко цели; използва се първата.

annotation-ref-outside-graph = `<annotation>`: невалиден `ref`; целта е извън съдържащата графика. Анотацията е пропусната.

annotation-ref-unsupported-target = `<annotation>`: невалиден `ref`; целта не е поддържан графичен обект при преобразуване към prefigure. Анотацията е пропусната.

annotation-text-missing = `<annotation>`: `text` липсва или е празен; извежда се празен текст.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Открита е циклична зависимост.
       *[other] Открита е циклична зависимост, включваща компонент `<{ $componentType }>`.
    }

reference-no-referent = Не е намерен обект за препратката: `{ $reference }`

reference-multiple-referents = Намерени са няколко обекта за препратката: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Невалиден формат на атрибута { $attribute } на `<{ $componentType }>`.

children-invalid = Невалидни дъщерни елементи за `<{ $componentType }>`: намерени са невалидни дъщерни елементи: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Невалидна стойност `{ $value }` за атрибут `{ $attribute }`; използва се стойността `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Версия { $version } на DoenetML не е намерена.
       *[other] Версия { $version } на DoenetML не е намерена. Използва се версия { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Невалиден DoenetML: { $content }

parse-tag-missing-close-tag = Невалиден DoenetML: тагът `{ $tag }` няма затварящ таг. Очакваше се самозатварящ се таг или таг `</{ $tagName }>`.

parse-tag-error = Невалиден DoenetML: грешка в тага `<{ $tagName }>`

parse-attribute-missing-value = Невалиден DoenetML: на атрибута `{ $attribute }` изглежда му липсва стойност.

parse-attribute-invalid = Невалиден DoenetML: невалиден атрибут `{ $attribute }`

parse-attribute-value-invalid = Невалиден DoenetML: невалидна стойност на атрибут `{ $value }`

parse-attribute-value-quote-mismatch = Невалиден DoenetML: невалидна стойност на атрибут `{ $value }`. Кавичките не съвпадат. Изглежда липсва `{ $quote }`

parse-open-tag-name-missing = Невалиден DoenetML: намерен е таг без име, например `<`

parse-tag-not-closed = Невалиден DoenetML: тагът `{ $tag }` не е затворен (изглежда липсва `>`).

parse-self-closing-tag-name-missing = Невалиден DoenetML: намерен е таг без име `<{ $content }>`

parse-self-closing-tag-not-closed = Невалиден DoenetML: тагът `{ $tag }` не е затворен (изглежда липсва `/>`).

parse-tag-invalid-attributes = Невалиден DoenetML: тагът `{ $tag }` е невалиден. Възможно е да има неправилни атрибути.

parse-close-tag-name-missing = Невалиден DoenetML: намерен е затварящ таг без име, например `</`

parse-attribute-value-unquoted = Стойностите на атрибутите трябва да са в кавички: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Невалиден DoenetML: намерен е затварящ таг `{ $tag }`, но няма съответстващ отварящ

parse-close-tag-mismatched = Невалиден DoenetML: несъответстващ затварящ таг. Очакваше се `</{ $expected }>`. Намерен е `{ $found }`

parser-node-unconvertible = Възелът { $node } не можа да бъде преобразуван във възел на Dast.

## Names

name-attribute-invalid =
    Невалиден атрибут name='{ $name }'. { $reason ->
        [characters] Имената могат да съдържат само букви, цифри, долни черти и тирета.
       *[start] Имената трябва да започват с буква.
    }

component-name-invalid-start = Невалидно име на компонент „{ $name }“. Имената трябва да започват с буква.

## `<answer>` sugar

answer-video-watched-missing-video = answer от тип videoWatched трябва да има атрибут video

answer-video-watched-video-not-reference = При answer от тип videoWatched атрибутът video трябва да е препратка

answer-name-not-single-text = Атрибутът name на answer трябва да има точно един текстов дъщерен елемент

## Referencing another document

external-doenetml-recursion-limit = Външният DoenetML не можа да бъде получен поради твърде много нива на рекурсия. Няма ли циклична препратка?

external-doenetml-unavailable = DoenetML не можа да бъде получен от { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Получен е невалиден DoenetML от { $attribute }="{ $uri }": той не съответства на типа компонент „{ $componentType }“

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Атрибутът `{ $from }` е остарял; използвайте `{ $to }`.
       *[other] [deprecation] Атрибутът `{ $from }` на `<{ $component }>` е остарял; използвайте `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Атрибутът `{ $from }` е остарял и се игнорира, защото е зададено и `{ $to }`.
       *[other] [deprecation] Атрибутът `{ $from }` на `<{ $component }>` е остарял и се игнорира, защото е зададено и `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Атрибутът `{ $attribute }` на `<{ $component }>` е остарял и се игнорира.


## Language coverage

pluralize-english-only = `<pluralize>` може да образува множествено число само на английски, затова в документ на езика { $locale } текстът му остава непроменен. Напишете формата за множествено число сами или я задайте с атрибута `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Елементът `<{ $tag }>` не е разпознат елемент на Doenet.

schema-element-not-allowed-at-root = Елементът `<{ $tag }>` не е допустим в корена на документа.

schema-element-not-allowed-inside = Елементът `<{ $tag }>` не е допустим вътре в `<{ $parent }>`.

schema-attribute-unrecognized = Елементът `<{ $tag }>` няма атрибут с име `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Атрибутът `{ $attribute }` на елемента `<{ $tag }>` трябва да е списък, всеки елемент от който е едно от: { $allowed }
       *[other] Атрибутът `{ $attribute }` на елемента `<{ $tag }>` трябва да е едно от: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Невалидно име на вариант за select. Името на варианта { $variantName } се среща в { $numOptions } възможности, а трябва да бъдат избрани { $numToSelect }.

select-variant-name-without-options = За select са зададени варианти, но не е зададена нито една възможност за възможното име на вариант: { $variantName }.

select-variant-name-not-possible = Името на варианта { $variantName }, зададено за select, не е възможно име на вариант.

select-too-few-options = Не могат да се изберат { $numToSelect } компонента само от { $numOptions }.

select-from-sequence-too-few-values = Не могат да се изберат { $numToSelect } стойности от редица с дължина { $length }.

select-from-sequence-indices-count-mismatch = Броят на зададените за select индекси трябва да съвпада с броя за избиране

select-from-sequence-indices-not-integers = Всички зададени за select индекси трябва да са цели числа

select-from-sequence-index-excluded = Зададеният индекс на selectfromsequence беше изключен

select-from-sequence-indices-excluded-combination = Зададените индекси на selectfromsequence образуваха изключена комбинация

select-from-sequence-coprime-not-positive-integers = Не могат да се изберат взаимно прости комбинации, защото не се избират положителни цели числа.

select-from-sequence-coprime-common-factor = Не могат да се изберат взаимно прости числа. Всички възможни стойности имат общ делител. (Зададените стойности на "from" или "to" трябва да са взаимно прости със "step".)

select-from-sequence-coprime-single-number = Не могат да се изберат взаимно прости комбинации от едно число, различно от 1.

select-from-sequence-excluded-too-many-combinations = В selectFromSequence са изключени над 70 % от комбинациите

select-from-sequence-coprime-none-found = Не можаха да бъдат избрани взаимно прости числа. Всички възможни стойности имат общ делител.

select-from-sequence-too-few-unique-values = Не могат да се изберат { $numToSelect } различни стойности от редица с дължина { $numPossibleValues }

select-prime-numbers-too-few-values = Не могат да се изберат { $numToSelect } стойности от списък с прости числа с дължина { $numValues }

select-prime-numbers-values-count-mismatch = Броят на зададените за select стойности трябва да съвпада с броя за избиране

select-prime-numbers-values-not-prime = Всички зададени за select prime number стойности трябва да са в списъка с прости числа

select-prime-numbers-values-excluded-combination = Зададените стойности на selectPrimeNumbers образуваха изключена комбинация

select-prime-numbers-excluded-too-many-combinations = В selectPrimeNumbers са изключени над 70 % от комбинациите

select-random-combination-fluke = По крайно невероятна случайност не можа да бъде избрана комбинация от случайни стойности

select-random-value-fluke = По крайно невероятна случайност не можа да бъде избрана случайна стойност
