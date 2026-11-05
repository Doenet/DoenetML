# Kildin Sami diagnostics. Translated from `locales/en/diagnostics.ftl`, which
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
# Kildin Sami is a Sami language written in Cyrillic; `chrome.ftl` sets out
# what that means, why this is the least certain catalog of its group, and what
# its Cyrillic letters are.
#
# The technical nouns here are the **Russian** ones — «компонент», «атрибут»,
# «функция», «индекс», «точка», «линия», «значение» — which is what written
# Kildin uses for them and what the neighbouring Cyrillic Uralic catalogs
# `locales/myv` and `locales/kpv` already do. That is a heavier Russian layer
# than `locales/se` carries in Norwegian, and it is a fact about where Kildin
# is written rather than a shortcut this seed took.
#
# Kildin resolves only `one` and `other` — no dual, whatever the language
# itself does — so every selection below writes two branches. A noun after a
# numeral stays in one form, so where English separates a singular from a
# plural in the verb alone the two Kildin branches often read alike; they are
# written out anyway rather than collapsed.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } ей лоагк, кōhт куххьт кēцц точка ля мēрртэм
       *[other] { $attributes } ей лоагк, кōhт куххьт кēцц точка ля мēрртэм
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ей лоагк, кōhт кēцц точка я коскточка ля мēрртэм
       *[other] { $attributes } ей лоагк, кōhт кēцц точка я коскточка ля мēрртэм
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ей рāботта коскточка та̄ггэ

## `<line>`

line-points-undetermined-dimensions = Линия мēрртэгуэдтҍ размерность точкаhь чēресь.

line-points-too-few-dimensions = Линия ā мāнне точкаhь чēресь, кēнн ля унн куххьт размерность.

line-points-depend-on-variables = Линия мāнн точкаhь чēресь, кēнн ля переменнаhь а̄лл: { $variables }.

line-equation-invalid-format = Пāстэй форма линия уравнения та̄ррьм { $variable1 } я { $variable2 } переменнаhь сӣзьн.

## `<ray>`

ray-overprescribed-through = Луч ля мēрртэм through, endpoint я direction кāвьт. Мēрртэм through ей лоагк.

ray-dimension-mismatch = numDimensions ей соабэ ray сӣзьн.

## `<vector>`

vector-overprescribed-head = Вектор ля мēрртэм head, tail я displacement кāвьт. Мēрртэм head ей лоагк.

vector-dimension-mismatch = numDimensions ей соабэ vector сӣзьн.

## Attracting and constraining

attract-to-without-nearest-point = Элль вуэйй кēсстэ та̄ррьм `<{ $component }>`, тэнн диеhт што сōнэсьт ей ля nearestPoint переменн.

constrain-to-without-nearest-point = Элль вуэйй мēрртэ та̄ррьм `<{ $component }>`, тэнн диеhт што сōнэсьт ей ля nearestPoint переменн.

constrain-to-interior-without-nearest-point = Элль вуэйй мēрртэ тэнн сӣзе `<{ $component }>`, тэнн диеhт што сōнэсьт ей ля nearestPoint переменн.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ей лоагк choiceInput сӣзьн, кӯhтт ей ля inline

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput та̄ррьм мēрртэм индексэ ей лоагк, тэнн диеhт што индексэ лōhк ей соабэ choice-па̄ррнэ лōhка.

pretzel-indices-count-mismatch = problem та̄ррьм мēрртэм индексэ ей лоагк, тэнн диеhт што индексэ лōhк ей соабэ problem-па̄ррнэ лōhка.

shuffle-indices-count-mismatch = shuffle та̄ррьм мēрртэм индексэ ей лоагк, тэнн диеhт што индексэ лōhк ей соабэ компонентэ лōhка.

indices-ignored-out-of-range = { $component } та̄ррьм мēрртэм индексэ ей лоагк, тэнн диеhт што кōhт индексэ ля мēрр ӯльнэ.

pretzel-indices-repeated = pretzel та̄ррьм мēрртэм индексэ ей лоагк, тэнн диеhт што кōhт индексэ мāhцэ.

pretzel-circuit-first-index = pretzel та̄ррьм mode="circuit" сӣзьн мēрртэм индексэ ей лоагк, тэнн диеhт што выйтэ индекс ā ля 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Штоб `<{ $component }>` рāботта тēкстпа̄ррнэгуэйм, атрибут `type` ā ля мēрртэм.

invalid-type-defaulting-to-math = Пāстэй type { $type } компонент { $component } та̄ррьм. Ā ля math, text, number елле boolean. Пыййем math.

string-not-valid-component-to-arrange = Тēкст «{ $value }» ей ля вӯййкесь компонент та̄ррьм { $component }. Ей лоагк.

## Types and variables

invalid-type-defaulting-to-number = Пāстэй type { $type }, type пыййем number.

invalid-variable-value = Пāстэй переменн значения: `{ $value }`

## Variants

variant-index-must-be-number = Вариант индекс { $index } ā ля лōhк

variant-index-must-be-integer = Вариант индекс { $index } ā ля тēвдтэм лōhк

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ей ля тōhкма абсолютнэ мēррэ та̄ррьм. Кēвьрре пыййем относительнэ на̄лле.

side-by-side-absolute-margins = `<{ $component }>` ей ля тōhкма абсолютнэ мēррэ та̄ррьм. Рāввтэ пыййем относительнэ на̄лле.

side-by-side-no-block-child = Пāстэй `<{ $component }>`: сōнэсьт ā ля унн ыhт блок-па̄ррьн.

## `<label>`

label-for-ignored-on-graphical = Графическэ `<label>` атрибут `for` ей лоагк.

label-for-must-resolve-to-one = `<label>` атрибут `for` ā вуэссьт вӯййкесь ыhт компонент а̄лл.

label-for-unresolved = `<label>` атрибут `for` элль вуэйй компонентэнҍ соабтэ.

label-for-answer-with-authored-inputs = `<label>` атрибут `for` вуэссьт `<answer>` а̄лл, кēнн ля ӣжесь кыррьтма полеhь; вуэссьте поля а̄лл вӯййкесь.

label-for-answer-without-input = `<label>` атрибут `for` вуэссьт `<answer>` а̄лл, кēнн ей ля поля, кōн мērрктэ.

label-for-must-reference-input-or-answer = `<label>` атрибут `for` ā вуэссьт поля елле вāсьт а̄лл.

## Accessibility

accessibility-short-description-or-decorative = Доступность диеhт `<{ $component }>` та̄ррьм ā ля вуэйнас мēрртэм елле сōн ā ля мērрктэм декоративнэ на̄лле.

accessibility-video-short-description = Доступность диеhт `<video>` та̄ррьм ā ля вуэйнас мēрртэм.

accessibility-input-short-description-or-label = Доступность диеhт `<{ $component }>` та̄ррьм ā ля вуэйнас мēрртэм елле нэ̄ммп.

accessibility-answer-input-short-description-or-label = Доступность диеhт `<answer>` та̄ррьм, кӯhтт тōhк поля, ā ля вуэйнас мēрртэм елле нэ̄ммп.

accessibility-short-description-contains-math = Вуэйнас мēрртэмэсьт ей ā ля математическэ компонентэ, кӯhт `<{ $component }>`. Кыррьте математик сāhьенҍ.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } контраст ей ля тēвдтэ ча̄зь нэ̄ммп тēкст диеhт (сēвьнесь режим) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ā ля унн { $threshold }:1).
       *[other] { $colorName } контраст ей ля тēвдтэ ча̄зь нэ̄ммп тēкст диеhт ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ā ля унн { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` { $count } точка чēресь ей ля тōhкма, кōhт точкаhь ей ля числэ значения.

circle-too-many-through-points = Элль вуэйй лоагктэ окружность 3 точка ēнас чēресь.

circle-overprescribed-radius-center-points = Элль вуэйй лоагктэ окружность мēрртэм радиусэнҍ, коскэнҍ я точкагуэйм.

circle-center-with-multiple-points = Элль вуэйй лоагктэ окружность мēрртэм коскэнҍ 1 точка ēнас чēресь.

circle-radius-too-small = Элль вуэйй лоагктэ окружность: кōhт куххьт точка коск ля { $distance }, мēрртэм радиус { $radius } ля ва̄ннҍса.

circle-radius-with-many-points = Элль вуэйй тōhкэ окружность куххьт точка ēнас чēресь мēрртэм радиусэнҍ.

circle-invalid-center-or-through-points = Пāстэй коск елле пāстэй точкаhь окружность сӣзьн.

circle-radius-center-with-multiple-points = Элль вуэйй лоагктэ окружность радиус мēрртэм коскэнҍ 1 точка ēнас чēресь.

circle-change-radius-non-numerical = Элль вуэйй мōлльстэ окружность радиус, кōhт точкаhь ей ля числэ

circle-radius-with-points-non-numerical = Элль вуэйй тōhкэ окружность ыhт точка ēнас чēресь мēрртэм радиусэнҍ, кōhт числэ значения ей ля.

circle-change-center-non-numerical = Окружность коск мōлльстэм точкаhь чēресь, кēнн ей ля числэ значения, ей ля тōhкма.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функция область диеhт размерность ля ва̄ннҍса. Областьэсьт ля { $intervals } интервал, а функциесьт ля { $inputs ->
            [one] { $inputs } вход
           *[other] { $inputs } вход
        }.
       *[other] Функция область диеhт размерность ля ва̄ннҍса. Областьэсьт ля { $intervals } интервал, а функциесьт ля { $inputs ->
            [one] { $inputs } вход
           *[other] { $inputs } вход
        }.
    }

function-domain-invalid-format = Пāстэй форма функция область та̄ррьм.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функция числэгуэдтҍ максимум ей лоагк.
        [minimum] Функция числэгуэдтҍ минимум ей лоагк.
        [extremum] Функция числэгуэдтҍ экстремум ей лоагк.
        [point] Функция числэгуэдтҍ точка ей лоагк.
        [slope] Функция числэгуэдтҍ наклон ей лоагк.
       *[other] Функция числэгуэдтҍ { $type } ей лоагк.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функция пуhь максимум ей лоагк.
        [minimum] Функция пуhь минимум ей лоагк.
        [extremum] Функция пуhь экстремум ей лоагк.
        [point] Функция пуhь точка ей лоагк.
       *[other] Функция пуhь { $type } ей лоагк.
    }

function-points-too-close = Функциесьт ля куххьт точка, кӯhтт ля лӣххк ла̄hк. Функция элль вуэйй мēрртэ.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функция итерация вуэйй ля тōллка кōhт входэ лōhк соабб выходэ лōhкэнҍ. Тэнн функциесьт ля { $inputs } вход я { $outputs ->
            [one] { $outputs } выход
           *[other] { $outputs } выход
        }.
       *[other] Функция итерация вуэйй ля тōллка кōhт входэ лōhк соабб выходэ лōhкэнҍ. Тэнн функциесьт ля { $inputs } вход я { $outputs ->
            [one] { $outputs } выход
           *[other] { $outputs } выход
        }.
    }

## `<sequence>`

sequence-invalid-length = Пāстэй последовательность кӯhкесвудт. Ā ля отрицательнэгуэдтҍ тēвдтэм лōhк.

sequence-invalid-step = Пāстэй последовательность шāгк. Ā ля лōhк { $type } тип последовательность диеhт.

sequence-invalid-endpoint-number = Пāстэй «{ $attribute }» лōhк последовательность сӣзьн. Ā ля лōhк.

sequence-invalid-endpoint-letters = Пāстэй «{ $attribute }» букв последовательность сӣзьн. Ā ля буквэ комбинация.

sequence-invalid-endpoint = Пāстэй «{ $attribute }» последовательность сӣзьн.

select-from-sequence-coprime-not-numbers = coprime ей лоагк, тэнн диеhт што лōhкэ ей вāльт

select-from-sequence-coprime-with-exclude-combinations = coprime ей лоагк, тэнн диеhт што excludeCombinations ля мēрртэм

## Resolving a `target`

target-not-found = Пāстэй target та̄ррьм `<{ $source }>`: цēль элль кāвн.

target-state-variable-not-found = Пāстэй target та̄ррьм `<{ $source }>`: `<{ $component }>` а̄лл элль кāвн переменн нэ̄ммэнҍ «{ $property }».

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` переменнаhь ā ля нӯббь, кӯhт независимэ переменн.

ode-system-duplicate-variable-names = Элль вуэйй мēрртэ ОДУ вуэлльк пēлль функцияhь, кōhт зависимэ переменнаhь нэ̄ммэ мāhцэ.

ode-system-rhs-function-error = Элль вуэйй мēрртэ ОДУ вуэлльк пēлль функция. Пāстэй mathjs-функция тōhкэмэсьт.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Элль вуэйй мēрртэ чēгк { $count } линия коскэсьт

angle-invalid-through-point = Пāстэй точка `<angle>` through сӣзьн

parabola-vertex-too-many-points = Парабола мēрртэм вершинэнҍ 1 точка ēнас чēресь ей ля тōhкма.

parabola-too-many-points = Парабола 3 точка ēнас чēресь ей ля тōhкма.

intersection-too-many-items = Куххьт объект ēнас пересечения ей ля тōhкма

## Other math components

ionic-compound-not-two-ions = Ионнэ соединения ей ля тōhкма нӯббь на̄лле, кӯhт куххьт ион.

ionic-compound-needs-cation-and-anion = Ионнэ соединения ля тōhкма тōллка ыhт катион я ыhт анион диеhт.

solve-equations-cannot-evaluate = Элль вуэйй чōввтэ уравнения, тэнн диеhт што элль вуэйй лоагктэ: { $equation }

math-operators-operand-number-required = Ā ля мēрртэм operandNumber, кōhт вāльт математическэ операнд.

eigen-decomposition-failed = Элль вуэйй лоагктэ матриц ӣжесь значенияhь

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: параметр { $parameters } ей ля шаблонэсьт, тэнн диеhт сōнн āйй соабб пуhьенҍ.
       *[other] `<matchesPattern>`: параметрэ { $parameters } ей ля шаблонэсьт, тэнн диеhт сӣйй āйй соабэ пуhьенҍ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: элль вуэйй лоагктэ grid="{ $grid }". Ā ля none, medium, dense елле куххьт положительнэ лōhк коск кāвьт, оудтэм на̄лле grid="1 0.5". Сēтт ей са̄ррк.

## Vector and slope fields

field-function-wrong-num-outputs =
    `<{ $component }>` та̄ррьм ā ля функция, кēнн ля { $expected ->
        [one] ыhт выход, наклон y' юhке точкасьт, оудтэм на̄лле `y - x`
       *[other] куххьт выход, вектор юhке точкасьт, оудтэм на̄лле `(y, -x)`
    }, но мēрртэм функциесьт ля { $found ->
        [one] { $found } выход
       *[other] { $found } выход
    }. { $alternative ->
        [none] Мӣ-ля ей са̄ррк.
       *[other] `<{ $alternative }>` ля компонент тэнн функция диеhт. Мӣ-ля ей са̄ррк.
    }

field-function-attribute-ignored-with-child = Атрибут `function` ей лоагк, тэнн диеhт што функция ля мēрртэм компонент сӣзьн; тэдт кӯhтт ля сӣзьн, вāльтэм. Мēррте функция тōллка ыhт на̄лле.

field-variables-ignored =
    `<{ $component }>`: атрибут `variables` нэ̄мтэ выражения переменнаhь, кӯhтт ля кыррьтма компонент сӣзьн. { $reason ->
        [function-child] Функция ля тāсьт мēрртэм `<function>`-па̄ррьн на̄лле, кӯhтт нэ̄мт ӣжесь переменнаhь, тэнн диеhт `variables` ей лоагк.
       *[no-expression] Тэнн выражения ей ля тāсьт мēрртэм, тэнн диеhт `variables` ей лоагк.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ей ля prefigure-вуэссьтэйесьт; вāльтэм вуэлльк пēлль сāйй.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ей ля prefigure-вуэссьтэйесьт; вāльтэм па̄йй сāйй.

prefigure-invalid-axis-bounds = `<graph>`: пāстэй ось мēрр prefigure-мōлльстэм диеhт; вāльтэм оудмēрр bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: пāстэй кēвьр prefigure-мōлльстэм диеhт; вāльтэм оудмēрр кēвьр 425.

prefigure-invalid-aspect-ratio = `<graph>`: пāстэй aspectRatio prefigure-мōлльстэм диеhт; вāльтэм оудмēрр соотношения 1.

prefigure-grid-spacing-too-fine = `<graph>`: сēтт коск ля лӣххк ва̄ннҍса ось мēрр диеhт; сēтт кāhт ēлль prefigure-вуэссьтэйесьт.

prefigure-annotations-not-rendered = `<graph>`: аннотацияhь ей вуэссьт, кōhт PreFigure-вуэссьтэй ей вāльт.

multiple-annotations-children = `<graph>` сӣзьн кāввнма мāҏhа `<annotations>`-па̄ррьн; пугk, кӯhт маhемусс, ей лоагк.

## Referring to other components

copy-unrecognized-component-type = Элль вуэйй кыррьтэ елле копироваййтэ тōбдтэгуэдтҍ компонент тип: { $type }.

copy-prop-not-found = Свойства { $property } элль кāвн { $component } тип компонентэсьт

collect-no-source = collect та̄ррьм источник элль кāвн.

collect-invalid-component-type = Элль вуэйй чōаггэ `<{ $component }>` тип компонентэ, тэнн диеhт што тэдт ля пāстэй компонент тип.

reference-index-unavailable = Элль вуэйй вуэссьтэ индекс а̄лл `{ $reference }`

## `<callAction>`

component-action-unavailable = Элль вуэйй кōhтэ { $action } компонентэсьт `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Тēдт форма ля пāстэй. Ридтэ кӯhкесвуд ей соабэ. Кāввнма тāсьт: componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Тēдтэсьт ля мāhцма столбец нэ̄ммэ. Кāввнма тāсьт: componentIdx :{ $componentIdx }

data-frame-missing-column-name = Тēдтэсьт ей ля столбец нэ̄мм. Кāввнма тāсьт: componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Тэнн вāсьт award вуэлльк ля answer-тег ӣжесь вӯлльктэм вāсьт а̄лл, тэдт тōhк вуэрдтэгуэдтҍ рāботт.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` пыййем `<answer>` а̄лл, кӯhтт ля `sectionWideCheckWork` контейнер сӣзьн, ей рāботта, тэнн диеhт што пробаhь лōhк мēррт контейнер. Пыййе `maxNumAttempts` контейнер а̄лл.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` пыййем `sectionWideCheckWork` контейнер а̄лл, кӯhтт ӣжесь ля нӯббь `sectionWideCheckWork` контейнер сӣзьн, ей рāботта, тэнн диеhт што пробаhь лōhк мēррт ӯльнэ контейнер. Пыййе `maxNumAttempts` ӯльнэ контейнер а̄лл.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Атрибут { $attributes } ей рāботта, кōhт symbolicEquality ей ля мēрртэм.
       *[other] Атрибутэ { $attributes } ей рāботта, кōhт symbolicEquality ей ля мēрртэм.
    }

answer-invalid-type = Пāстэй тип вāсьт диеhт: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Компонентэсьт `<{ $component }>` ей ля нэ̄мм, тэнн диеhт сōн элль вуэйй вāльтэ модуль атрибут на̄лле

module-attribute-name-already-defined = Компонент `<{ $component } name="{ $name }">` элль вуэйй вāльтэ модуль атрибут на̄лле, тэнн диеhт што `<module>` компонент типэсьт ля уж атрибут «{ $name }».

conditional-content-condition-ignored = Атрибут `condition` ей лоагк `<conditionalContent>` компонентэсьт, кēнн ля case- елле else-па̄ррнэ.

slider-markers-type-mismatch = Мērкаhь тип ей соабэ slider типэнҍ.

pretzel-problem-needs-statement-and-answer = Пāстэй pretzel: юhке `<problem>` сӣзьн ā ля ыhт `<statement>` я ыhт `<answer>`.

pretzel-circuit-first-problem-distractor = Пāстэй pretzel: mode="circuit" сӣзьн выйтэ `<problem>` элль вуэйй ля пēттэй.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Пāстэй значения { $values } атрибут `{ $attribute }` та̄ррьм; ей лоагк.
       *[other] Пāстэй значенияhь { $values } атрибут `{ $attribute }` та̄ррьм; ей лоагк.
    }

attribute-must-be-references = Пāстэй значения `{ $value }` атрибут `{ $attribute }` та̄ррьм. Атрибут ā ля чōаггма ссылкаhь, кӯhтт а̄лльк `$` мērкэнҍ.

math-input-invalid-function-names = <mathInput>: пāстэй функция нэ̄ммэ { $attribute } сӣзьн элль лоагк: { $names }. Юhке нэ̄мм вуэссьтэм ча̄ссҍ ā ля унн 2 мērка (буквэ елле са̄ррк); сōн мāҏҏа вуэйй пуэдтҍе `|<mathspeak альтернатив>`.

## Building components from the source

component-type-invalid = Пāстэй компонент тип: `<{ $componentType }>`

attribute-repeated = Элль вуэйй мāhцхэ атрибут { $attribute }.

attribute-invalid-for-component = Пāстэй атрибут «{ $attribute }» `<{ $componentType }>` тип компонент диеhт.

## Style definition contrast

style-definition-insufficient-contrast =
    Стиль мēрртэмэсьт { $styleNumber } ей ля тēвдтэ контраст та̄ррьм { $context ->
        [text-on-background] тēкст кӯлльм фон кӯлльм а̄лл
        [high-contrast] па̄йй контраст кӯлльм холст а̄лл
        [line] линия кӯлльм холст а̄лл
        [marker] мērка кӯлльм холст а̄лл
       *[text-on-canvas] тēкст кӯлльм холст а̄лл
    }{ $mode ->
        [dark] { " (сēвьнесь режим)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ā ля унн { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Ва̄йк стиль мēрртэмэсьт { $styleNumber } ля кӯлльмэ, кēнн ля тēвдтэ контраст чуввесь режим диеhт, сēвьнесь режим кӯлльмэ, кӯhтт тэнн лоагктэнҍ, ей вуэдтҍ тēвдтэ контраст тēкст кӯлльм я фон кӯлльм коскэсьт ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ā ля унн { $threshold }:1). { $suggestion ->
        [available] Штоб сēвьнесь режимэсьт ля тēвдтэ контраст, елле лāссьте чуввесь режим контраст (оудтэм на̄лле пыййе { $lightAttribute }="{ $lightColor }") елле мōлльсте сēвьнесь режим кӯлльм (оудтэм на̄лле пыййе { $darkAttribute }="{ $darkColor }").
       *[none] Штоб сēвьнесь режимэсьт ля тēвдтэ контраст, лāссьте чуввесь режим контраст елле мōлльсте лоагктэм кӯлльмэ textColorDarkMode я/елле backgroundColorDarkMode кāвьт.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ва̄йк стиль мēрртэмэсьт { $styleNumber } ля тēкст кӯлльм, кēнн ля тēвдтэ контраст чуввесь режим диеhт, сēвьнесь режим тēкст кӯлльм, кӯhтт тэнн лоагктэв, ей вуэдтҍ тēвдтэ контраст холст а̄лл ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ā ля унн { $threshold }:1). { $suggestion ->
        [available] Штоб сēвьнесь режимэсьт ля тēвдтэ контраст, елле лāссьте чуввесь режим контраст (оудтэм на̄лле пыййе textColor="{ $lightColor }") елле мōлльсте сēвьнесь режим кӯлльм (оудтэм на̄лле пыййе textColorDarkMode="{ $darkColor }").
       *[none] Штоб сēвьнесь режимэсьт ля тēвдтэ контраст, лāссьте чуввесь режим контраст елле мōлльсте лоагктэм кӯлльм textColorDarkMode кāвьт.
    }

section-multiple-style-palettes = Ча̄ссҍ вуэйй вāльтэ тōллка ыhт <stylePalette>; вāльтэм маhемусс.

## Unique variants

variant-num-to-select-not-non-negative-integer = элль вуэйй мēрртэ { $component } ыhтнэсс вариантэ, тэнн диеhт што numToSelect ей ля отрицательнэгуэдтҍ тēвдтэм лōhк.

variant-num-to-select-not-constant-number = элль вуэйй мēрртэ { $component } ыhтнэсс вариантэ, тэнн диеhт што numToSelect ей ля мōлльстэгуэдтҍ лōhк.

variant-with-replacement-not-constant-boolean = элль вуэйй мēрртэ { $component } ыhтнэсс вариантэ, тэнн диеhт што withReplacement ей ля мōлльстэгуэдтҍ boolean.

variant-select-weight-disables-unique = select ыhтнэсс вариантэ ля кӣдтма, кōhт кōhт вариантэсьт ля мēрртэм selectWeight елле selectForVariants

variant-coprime-undetermined = элль вуэйй мēрртэ { $component } ыhтнэсс вариантэ, тэнн диеhт што элль вуэйй тēдтэ, ля-ль coprime āйй пāстэй.

variant-attribute-not-constant = элль вуэйй мēрртэ { $component } ыhтнэсс вариантэ, тэнн диеhт што { $attribute } ей ля константа.

variant-attribute-not-number = элль вуэйй мēрртэ { $component } ыhтнэсс вариантэ, тэнн диеhт што { $attribute } ей ля лōhк.

variant-attribute-wrong-type-for-sequence =
    элль вуэйй мēрртэ { $type } тип { $component } ыhтнэсс вариантэ, тэнн диеhт што { $attribute } ей ля { $expected ->
        [letters-combination] буквэ комбинация
        [math-expression] вӯййкесь математическэ выражения
        [integer] тēвдтэм лōhк
       *[number] лōhк
    }.

variant-length-not-integer = элль вуэйй мēрртэ { $component } ыhтнэсс вариантэ, тэнн диеhт што length ей ля тēвдтэм лōhк.

variant-sort-not-implemented = { $component } ыhтнэсс вариантэ sort гуэйм ей ля тōhкма

variant-exclude-combinations-not-implemented = { $component } ыhтнэсс вариантэ excludeCombinations гуэйм ей ля тōhкма

variant-math-exclude-not-implemented = math тип { $component } ыhтнэсс вариантэ exclude гуэйм ей ля тōhкма

variant-non-constant-exclude-not-implemented = { $component } ыhтнэсс вариантэ мōлльстэй exclude гуэйм ей ля тōhкма

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ей ля график prefigure-вуэссьтэйесьт; па̄ррьн кāhт ēлль.

prefigure-descendant-invalid-geometry = { $subject }: кēцьтэгуэдтҍ елле тēвдтэгуэдтҍ геометрия; па̄ррьн кāhт ēлль.

prefigure-curve-label-omitted = { $subject }: нэ̄ммпэ ей ля мōлльстэм кривая элементэсьт; нэ̄ммп кāhт ēлль.

prefigure-curve-unsupported-definition-type = { $subject }: кривая функция мēрртэм тип «{ $definitionType }» ей ля; па̄ррьн кāhт ēлль.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves атрибут flipFunctions ей ля; па̄ррьн кāhт ēлль.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves сӣзьн ля тōллка формулэнҍ мēрртэм па̄ррьн функцияhь; па̄ррьн кāhт ēлль.

prefigure-label-position-unsupported =
    { $subject }: labelPosition «{ $labelPosition }» ей ля { $labelKind ->
        [line-family] линия семья нэ̄ммп диеhт
       *[point] точка нэ̄ммп диеhт
    }; вāльтэм PreFigure оудмēрр сāйй.

prefigure-fill-style-unsupported = { $subject }: тēвдэм стиль «{ $fillStyle }» ей ля PreFigure сӣзьн; вāльтэм тēвдтэм тēвдэм.

prefigure-line-style-unknown = { $subject }: тōбдтэгуэдтҍ линия стиль «{ $lineStyle }» кāhт ēлль PreFigure выходэсьт.

prefigure-marker-style-mapped-to-diamond = { $subject }: мērка стиль «{ $markerStyle }» соабтэм PreFigure стиль «diamond» а̄лл.

prefigure-marker-style-unsupported = { $subject }: мērка стиль «{ $markerStyle }» ей ля PreFigure сӣзьн; вāльтэм оудмēрр стиль.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: пāстэй `ref`; цēль элль вуэйй кāввнэ. Аннотация кāhт ēлль.

annotation-ref-multiple-targets = `<annotation>`: `ref` соабтэ мāҏhа цēль а̄лл; вāльтэм выйтэ.

annotation-ref-outside-graph = `<annotation>`: пāстэй `ref`; цēль ля график ӯльнэ. Аннотация кāhт ēлль.

annotation-ref-unsupported-target = `<annotation>`: пāстэй `ref`; цēль ей ля вуэйнас графическэ объект prefigure-мōлльстэмэсьт. Аннотация кāhт ēлль.

annotation-text-missing = `<annotation>`: `text` ей ля елле ля пуhь; тōhкэм пуhь тēкст.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Кāввнма кōшк зависимость.
       *[other] Кāввнма кōшк зависимость, кēнн сӣзьн ля `<{ $componentType }>` компонент.
    }

reference-no-referent = Ссылка объект элль кāвн: `{ $reference }`

reference-multiple-referents = Ссылка мāҏhа объект кāввнма: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Пāстэй форма `<{ $componentType }>` атрибут { $attribute } та̄ррьм.

children-invalid = Пāстэй па̄ррнэ `<{ $componentType }>` диеhт: кāввнма пāстэй па̄ррнэ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Пāстэй значения `{ $value }` атрибут `{ $attribute }` та̄ррьм; вāльтэм значения `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML версия { $version } элль кāвн.
       *[other] DoenetML версия { $version } элль кāвн. Вāльтэм версия { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Пāстэй DoenetML: { $content }

parse-tag-missing-close-tag = Пāстэй DoenetML: тег `{ $tag }` та̄ррьм ей ля кӣдтэм тег. Вуэрртэм ӣжесь кӣдтэй тег елле `</{ $tagName }>` тег.

parse-tag-error = Пāстэй DoenetML: пāстэй тег `<{ $tagName }>` сӣзьн

parse-attribute-missing-value = Пāстэй DoenetML: атрибут `{ $attribute }` та̄ррьм, вуэйнэв, ей ля значения.

parse-attribute-invalid = Пāстэй DoenetML: пāстэй атрибут `{ $attribute }`

parse-attribute-value-invalid = Пāстэй DoenetML: пāстэй атрибут значения `{ $value }`

parse-attribute-value-quote-mismatch = Пāстэй DoenetML: пāстэй атрибут значения `{ $value }`. Кавычкаhь ей соабэ. Вуэйнэв, ей ля `{ $quote }`

parse-open-tag-name-missing = Пāстэй DoenetML: кāввнма тег нэ̄мм та̄ггэ, оудтэм на̄лле `<`

parse-tag-not-closed = Пāстэй DoenetML: тег `{ $tag }` ей ля кӣдтма (вуэйнэв, ей ля `>`).

parse-self-closing-tag-name-missing = Пāстэй DoenetML: кāввнма тег нэ̄мм та̄ггэ `<{ $content }>`

parse-self-closing-tag-not-closed = Пāстэй DoenetML: тег `{ $tag }` ей ля кӣдтма (вуэйнэв, ей ля `/>`).

parse-tag-invalid-attributes = Пāстэй DoenetML: тег `{ $tag }` ей ля вӯййкесь. Сōнэсьт вуэйй ля пāстэй атрибутэ.

parse-close-tag-name-missing = Пāстэй DoenetML: кāввнма кӣдтэм тег нэ̄мм та̄ггэ, оудтэм на̄лле `</`

parse-attribute-value-unquoted = Атрибут значенияhь ā ля кавычкаhь сӣзьн: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Пāстэй DoenetML: кāввнма кӣдтэм тег `{ $tag }`, но соабтэй ва̄лльтэм тег ей ля

parse-close-tag-mismatched = Пāстэй DoenetML: кӣдтэм тег ей соабэ. Вуэрртэм `</{ $expected }>`. Кāввнма `{ $found }`

parser-node-unconvertible = Элль вуэйй мōлльстэ узел { $node } Dast-узел на̄лле.

## Names

name-attribute-invalid =
    Пāстэй атрибут name='{ $name }'. { $reason ->
        [characters] Нэ̄ммэсьт вуэйй ля тōллка буквэ, лōhкэ, вӯлльсэ са̄ррк елле са̄ррк.
       *[start] Нэ̄ммэ ā а̄лльк буквэнҍ.
    }

component-name-invalid-start = Пāстэй компонент нэ̄мм «{ $name }». Нэ̄ммэ ā а̄лльк буквэнҍ.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched тип answer та̄ррьм ā ля атрибут video

answer-video-watched-video-not-reference = videoWatched тип answer атрибут video ā ля ссылка

answer-name-not-single-text = answer атрибут name та̄ррьм ā ля ыhт тēкстпа̄ррьн

## Referencing another document

external-doenetml-recursion-limit = Элль вуэйй вāльтэ ӯльнэ DoenetML, тэнн диеhт што рекурсия уровеньэ ля лӣххк мāҏhа. Ей-ль ля тāсьт кōшк ссылка?

external-doenetml-unavailable = Элль вуэйй вāльтэ DoenetML тāсьт { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Пāстэй DoenetML вāльтма тāсьт { $attribute }="{ $uri }": сōнн элль соабэ «{ $componentType }» компонент типэнҍ

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Атрибут `{ $from }` ля пуэррсэ; вāльтэ `{ $to }` сōн са̄йя.
       *[other] [deprecation] `<{ $component }>` атрибут `{ $from }` ля пуэррсэ; вāльтэ `{ $to }` сōн са̄йя.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Атрибут `{ $from }` ля пуэррсэ я ей лоагк, тэнн диеhт што `{ $to }` мēрртэм ня.
       *[other] [deprecation] `<{ $component }>` атрибут `{ $from }` ля пуэррсэ я ей лоагк, тэнн диеhт што `{ $to }` мēрртэм ня.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` атрибут `{ $attribute }` ля пуэррсэ я ей лоагк.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` атрибут `{ $attribute }` ля пуэррсэ; вāльтэ `<{ $child }>`-па̄ррьн сōн са̄йя.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` атрибут `{ $attribute }` значения `{ $value }` ля пуэррсэ; вāльтэ `{ $to }` сōн са̄йя.


## Language coverage

pluralize-english-only = `<pluralize>` вуэйй тōhкэ мāҏhа лōhк тōллка англьск кӣлльт, тэнн диеhт сōн тēкст па̄дэ мōлльстэгуэдтҍ документэсьт, кӯhтт ля кыррьтма тэнн кӣлльт: { $locale }. Кыррьте мāҏhа лōhк форма ӣжесь, елле мēррте сōн `pluralForm` атрибутэнҍ.


## Checking against the schema

schema-element-unrecognized = Элемент `<{ $tag }>` ей ля тōбдтма Doenet элемент.

schema-element-not-allowed-at-root = Элемент `<{ $tag }>` ей вуэйй ля документ вӯррьтэсьт.

schema-element-not-allowed-inside = Элемент `<{ $tag }>` ей вуэйй ля `<{ $parent }>` сӣзьн.

schema-attribute-unrecognized = Элементэсьт `<{ $tag }>` ей ля атрибут нэ̄ммэнҍ `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Элемент `<{ $tag }>` атрибут `{ $attribute }` ā ля лӣстт, кēнн юhке ча̄ссҍ ля ыhт тэнн: { $allowed }
       *[other] Элемент `<{ $tag }>` атрибут `{ $attribute }` ā ля ыhт тэнн: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Пāстэй вариант нэ̄мм select диеhт. Вариант нэ̄мм { $variantName } ля { $numOptions } вариантэсьт, но вāльтэм лōhк ля { $numToSelect }.

select-variant-name-without-options = select диеhт ля мēрртэм вариантэ, но вариант нэ̄мм { $variantName } диеhт ей ля мēрртэм вариантэ.

select-variant-name-not-possible = Вариант нэ̄мм { $variantName }, кӯhтт ля мēрртэм select диеhт, ей ля вуэйнас вариант нэ̄мм.

select-too-few-options = Элль вуэйй вāльтэ { $numToSelect } компонент тōллка { $numOptions } сӣзьт.

select-from-sequence-too-few-values = Элль вуэйй вāльтэ { $numToSelect } значения последовательностьэсьт, кēнн кӯhкесвудт ля { $length }.

select-from-sequence-indices-count-mismatch = select диеhт мēрртэм индексэ лōhк ā соабб вāльтэм лōhкэнҍ

select-from-sequence-indices-not-integers = Пугk индексэ, кӯhтт ля мēрртэм select диеhт, ā ля тēвдтэм лōhкэ

select-from-sequence-index-excluded = Мēрртэм selectfromsequence индекс ля кāhтма

select-from-sequence-indices-excluded-combination = Мēрртэм selectfromsequence индексэ ля кāhтма комбинация

select-from-sequence-coprime-not-positive-integers = Элль вуэйй вāльтэ взаимнэ простэ комбинацияhь, тэнн диеhт што положительнэ тēвдтэм лōhкэ ей вāльт.

select-from-sequence-coprime-common-factor = Элль вуэйй вāльтэ взаимнэ простэ лōhкэ. Пугk вуэйнас значенияhь ля ыhт множитель. («from» елле «to» мēрртэм значенияhь ā ля взаимнэ простэ «step» гуэйм.)

select-from-sequence-coprime-single-number = Элль вуэйй вāльтэ взаимнэ простэ комбинацияhь ыhт лōhкэсьт, кӯhтт ей ля 1.

select-from-sequence-excluded-too-many-combinations = selectFromSequence сӣзьн кāhтма 70% ēнас комбинацияhь

select-from-sequence-coprime-none-found = Элль вуэйй вāльтэ взаимнэ простэ лōhкэ. Пугk вуэйнас значенияhь ля ыhт множитель.

select-from-sequence-too-few-unique-values = Элль вуэйй вāльтэ { $numToSelect } ыhтнэсс значения последовательностьэсьт, кēнн кӯhкесвудт ля { $numPossibleValues }

select-prime-numbers-too-few-values = Элль вуэйй вāльтэ { $numToSelect } значения простэ лōhкэ лӣстэсьт, кēнн кӯhкесвудт ля { $numValues }

select-prime-numbers-values-count-mismatch = select диеhт мēрртэм значенияhь лōhк ā соабб вāльтэм лōhкэнҍ

select-prime-numbers-values-not-prime = Пугk значенияhь, кӯhтт ля мēрртэм простэ лōhк вāльтэм диеhт, ā ля простэ лōhкэ лӣстэсьт

select-prime-numbers-values-excluded-combination = Мēрртэм selectPrimeNumbers значенияhь ля кāhтма комбинация

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers сӣзьн кāhтма 70% ēнас комбинацияhь

select-random-combination-fluke = Лӣххк ва̄ннҍса вуэйнасвудт диеhт элль вуэйй вāльтэ случайнэ значенияhь комбинация

select-random-value-fluke = Лӣххк ва̄ннҍса вуэйнасвудт диеhт элль вуэйй вāльтэ случайнэ значения
