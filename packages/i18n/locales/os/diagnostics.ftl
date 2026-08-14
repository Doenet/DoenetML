# Ossetian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# The technical nouns are the Russian ones, which is what written Ossetian
# uses for them: «компонент», «атрибут», «функци», «индекс».


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] дыууæ кæроны стъæлф амынд куы уой, уæд { $attributes } нымад нæ цæуы
       *[other] дыууæ кæроны стъæлф амынд куы уой, уæд { $attributes } нымад нæ цæуы
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] кæроны стъæлф æмæ астæуккаг стъæлф дæр амынд куы уой, уæд { $attributes } нымад нæ цæуы
       *[other] кæроны стъæлф æмæ астæуккаг стъæлф дæр амынд куы уой, уæд { $attributes } нымад нæ цæуы
    }

line-segment-midpoint-offset-without-midpoint = астæуккаг стъæлфæй дарддæр midpointOffset ницæуыл ахады

## `<line>`

line-points-undetermined-dimensions = Бæрцæй бæрæг нæ стъæлфтыл цæуæг раст хахх.

line-points-too-few-dimensions = Раст хахх иу æмæ дыууæ бæрцы стъæлфтыл хъуамæ цæуа.

line-points-depend-on-variables = Раст хахх ивгæ бæрцтæй æмбæрст стъæлфтыл цæуы: { $variables }.

line-equation-invalid-format = { $variable1 } æмæ { $variable2 } ивгæ бæрцтимæ раст хаххы æмхуызоны формат раст нæу.

## `<ray>`

ray-overprescribed-through = Луч through, endpoint æмæ direction-æй лæвæрд у. Лæвæрд through нымад нæ цæуы.

ray-dimension-mismatch = лучы numDimensions нæ фидауы.

## `<vector>`

vector-overprescribed-head = Вектор head, tail æмæ displacement-æй лæвæрд у. Лæвæрд head нымад нæ цæуы.

vector-dimension-mismatch = векторы numDimensions нæ фидауы.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элементмæ ласæн нæй, уымæн æмæ йæм nearestPoint уавæры ивгæ бæрц нæй.

constrain-to-without-nearest-point = `<{ $component }>` элементæй æфсæрæн нæй, уымæн æмæ йæм nearestPoint уавæры ивгæ бæрц нæй.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементы мидæгæй æфсæрæн нæй, уымæн æмæ йæм nearestPoint уавæры ивгæ бæрц нæй.

## `<choiceInput>`

choice-input-label-position-ignored = рæнхъы мидæг нæ чи у, ахæм choiceInput-мæ labelPosition нымад нæ цæуы

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-мæ лæвæрд индекстæ нымад нæ цæуынц, уымæн æмæ сæ нымæц choice сывæллæтты нымæцимæ нæ фидауы.

pretzel-indices-count-mismatch = problem-мæ лæвæрд индекстæ нымад нæ цæуынц, уымæн æмæ сæ нымæц problem сывæллæтты нымæцимæ нæ фидауы.

shuffle-indices-count-mismatch = shuffle-мæ лæвæрд индекстæ нымад нæ цæуынц, уымæн æмæ сæ нымæц компонентты нымæцимæ нæ фидауы.

indices-ignored-out-of-range = { $component }-мæ лæвæрд индекстæ нымад нæ цæуынц, уымæн æмæ сæ иуæй-иутæ къæйттæй ахизынц.

pretzel-indices-repeated = pretzel-мæ лæвæрд индекстæ нымад нæ цæуынц, уымæн æмæ сæ иуæй-иутæ фæзминаг сты.

pretzel-circuit-first-index = circuit уагы pretzel-мæ лæвæрд индекстæ нымад нæ цæуынц, уымæн æмæ фыццаг индекс хъуамæ 1 уа.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текстон сывæллæттимæ куыст кæнынæн `type` атрибут хъуамæ лæвæрд уа.

invalid-type-defaulting-to-math = { $component } компонентмæ раст нæу хуыз { $type }. Уый хъуамæ уа math, text, number кæнæ boolean. math пайдагонд цæуы.

string-not-valid-component-to-arrange = «{ $value }» рæнхъ { $component }-мæ æмбæлон компонент нæу. Нымад нæ цæуы.

## Types and variables

invalid-type-defaulting-to-number = Раст нæу хуыз { $type }, йæ хуыз number сысти.

invalid-variable-value = Ивгæ бæрцы раст нæ аргъ: `{ $value }`

## Variants

variant-index-must-be-number = { $index } варианты индекс хъуамæ нымæц уа

variant-index-must-be-integer = { $index } варианты индекс хъуамæ æнæхъæн нымæц уа

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолютон бæрцтæм арæзт нæу. Йæ уæрхтæ баргæ сты.

side-by-side-absolute-margins = `<{ $component }>` абсолютон бæрцтæм арæзт нæу. Йæ кæрæттæ баргæ сты.

side-by-side-no-block-child = Раст нæу `<{ $component }>`: йæм хъуамæ иу блок сывæллон уæддæр уа.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элементы `for` атрибут нымад нæ цæуы.

label-for-must-resolve-to-one = `<label>` элементы `for` атрибут хъуамæ æрмæст иу компонентмæ амона.

label-for-unresolved = `<label>` элементы `for` атрибут компонентимæ баст кæнын нæ бантыст.

label-for-answer-with-authored-inputs = `<label>` элементы `for` атрибут автор фыст бахæссæн быдыртимæ `<answer>`-мæ амоны; быдырмæ комкоммæ амон.

label-for-answer-without-input = `<label>` элементы `for` атрибут нысангонд бахæссæн быдыр кæмæ нæй, ахæм `<answer>`-мæ амоны.

label-for-must-reference-input-or-answer = `<label>` элементы `for` атрибут хъуамæ бахæссæн быдырмæ кæнæ дзуаппмæ амона.

## Accessibility

accessibility-short-description-or-decorative = Бахæццæйы тыххæй `<{ $component }>` хъуамæ цыбыр æрфыстимæ уа, кæнæ фæлыст хуызы нысангонд æрцæуа.

accessibility-video-short-description = Бахæццæйы тыххæй `<video>` хъуамæ цыбыр æрфыстимæ уа.

accessibility-input-short-description-or-label = Бахæццæйы тыххæй `<{ $component }>` хъуамæ цыбыр æрфыстимæ кæнæ нысанимæ уа.

accessibility-answer-input-short-description-or-label = Бахæццæйы тыххæй бахæссæн быдыр аразæг `<answer>` хъуамæ цыбыр æрфыстимæ кæнæ нысанимæ уа.

accessibility-short-description-contains-math = Цыбыр æрфысты `<{ $component }>` хуызæн математикон компоненттæ хъуамæ ма уой. Математикæ дзырдтæй ныффысс.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } хайы сæргонды текстмæ фаг контраст нæ дæтты (тар хуыз) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; уæддæр { $threshold }:1 хъæуы).
       *[other] { $colorName } хайы сæргонды текстмæ фаг контраст нæ дæтты ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; уæддæр { $threshold }:1 хъæуы).
    }

## `<circle>`

circle-through-points-non-numerical = Стъæлфтæн нымæцон аргъ куы нæ уа, уæд { $count } стъæлфыл цæуæг `<circle>` арæзт нæу.

circle-too-many-through-points = 3-æй фылдæр стъæлфыл цæуæг тымбыл банымайæн нæй.

circle-overprescribed-radius-center-points = Лæвæрд радиус, астæу æмæ стъæлфтимæ тымбыл банымайæн нæй.

circle-center-with-multiple-points = Лæвæрд астæуимæ 1-æй фылдæр стъæлфыл цæуæг тымбыл банымайæн нæй.

circle-radius-too-small = Тымбыл банымайæн нæй: дыууæ стъæлфы астæу { $distance } куы уа, уæд лæвæрд радиус { $radius } тынг гыццыл у.

circle-radius-with-many-points = Лæвæрд радиусимæ дыууæйæ фылдæр стъæлфыл цæуæг тымбыл саразæн нæй.

circle-invalid-center-or-through-points = Тымбылы астæу кæнæ стъæлфтæ раст не сты.

circle-radius-center-with-multiple-points = Лæвæрд астæуимæ 1-æй фылдæр стъæлфыл цæуæг тымбылы радиус банымайæн нæй.

circle-change-radius-non-numerical = Нымæцон нæ стъæлфтимæ тымбылы радиус аивæн нæй

circle-radius-with-points-non-numerical = Нымæцон аргъытæ куы нæ уой, уæд лæвæрд радиусимæ иуæй фылдæр стъæлфыл цæуæг тымбыл саразæн нæй.

circle-change-center-non-numerical = Нымæцон нæ стъæлфтыл цæуæг тымбылы астæу ивын арæзт нæу.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцийы бæрæггонд бынаты бæрц нæ фаг кæны. Бынаты { $intervals } интервал ис, функцийы та { $inputs ->
            [one] { $inputs } бахæссæн
           *[other] { $inputs } бахæссæн
        } ис.
       *[other] Функцийы бæрæггонд бынаты бæрц нæ фаг кæны. Бынаты { $intervals } интервал ис, функцийы та { $inputs ->
            [one] { $inputs } бахæссæн
           *[other] { $inputs } бахæссæн
        } ис.
    }

function-domain-invalid-format = Функцийы бæрæггонд бынаты формат раст нæу.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцийы нымæцон нæ максимум нымад нæ цæуы.
        [minimum] Функцийы нымæцон нæ минимум нымад нæ цæуы.
        [extremum] Функцийы нымæцон нæ экстремум нымад нæ цæуы.
        [point] Функцийы нымæцон нæ стъæлф нымад нæ цæуы.
        [slope] Функцийы нымæцон нæ фæлдæхт нымад нæ цæуы.
       *[other] Функцийы нымæцон нæ { $type } аргъ нымад нæ цæуы.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцийы афтид максимум нымад нæ цæуы.
        [minimum] Функцийы афтид минимум нымад нæ цæуы.
        [extremum] Функцийы афтид экстремум нымад нæ цæуы.
        [point] Функцийы афтид стъæлф нымад нæ цæуы.
       *[other] Функцийы афтид { $type } аргъ нымад нæ цæуы.
    }

function-points-too-close = Функцийы кæрæдзимæ тынг хæстæг дыууæ стъæлфы ис. Функци бæрæг кæнæн нæй.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функцийы итерацитæ гæнæн ис æрмæст бахæссæнты нымæц рахæссæнты нымæцимæ æмхуызон куы уа. Ацы функцийы { $inputs } бахæссæн æмæ { $outputs ->
            [one] { $outputs } рахæссæн
           *[other] { $outputs } рахæссæн
        } ис.
       *[other] Функцийы итерацитæ гæнæн ис æрмæст бахæссæнты нымæц рахæссæнты нымæцимæ æмхуызон куы уа. Ацы функцийы { $inputs } бахæссæн æмæ { $outputs ->
            [one] { $outputs } рахæссæн
           *[other] { $outputs } рахæссæн
        } ис.
    }

## `<sequence>`

sequence-invalid-length = Рæнхъæгты даргъдзинад раст нæу. Уый хъуамæ минусон нæ æнæхъæн нымæц уа.

sequence-invalid-step = Рæнхъæгты къахдзæф раст нæу. { $type } хуызы рæнхъæгтæм уый хъуамæ нымæц уа.

sequence-invalid-endpoint-number = Нымæцон рæнхъæгты «{ $attribute }» аргъ раст нæу. Уый хъуамæ нымæц уа.

sequence-invalid-endpoint-letters = Дамгъæйы рæнхъæгты «{ $attribute }» аргъ раст нæу. Уый хъуамæ дамгъæты бастдзинад уа.

sequence-invalid-endpoint = Рæнхъæгты «{ $attribute }» аргъ раст нæу.

select-from-sequence-coprime-not-numbers = нымæцтæ æвзæрст не сты, уымæ гæсгæ coprime нымад нæ цæуы

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations лæвæрд у, уымæ гæсгæ coprime нымад нæ цæуы

## Resolving a `target`

target-not-found = `<{ $source }>`-мæ раст нæу target: нысан нæ ссардæуыд.

target-state-variable-not-found = `<{ $source }>`-мæ раст нæу target: `<{ $component }>` элементы «{ $property }» номимæ уавæры ивгæ бæрц нæ ссардæуыд.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-ы ивгæ бæрцтæ хъуамæ æнæаходгæ бæрцæй хицæн уой.

ode-system-duplicate-variable-names = Аходгæ бæрцты нæмттæ фæзминаг куы уой, уæд ДУ рахиз фарсы функцитæ бæрæг кæнæн нæй.

ode-system-rhs-function-error = ДУ рахиз фарсы функци бæрæг кæнæн нæй. mathjs функци аразгæйæ рæдыд.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } раст хаххы астæу къуым бæрæг кæнæн нæй

angle-invalid-through-point = `<angle>` элементы through аргъы раст нæу стъæлф

parabola-vertex-too-many-points = Лæвæрд сæримæ 1-æй фылдæр стъæлфыл цæуæг параболæ арæзт нæу.

parabola-too-many-points = 3-æй фылдæр стъæлфыл цæуæг параболæ арæзт нæу.

intersection-too-many-items = Дыууæйæ фылдæр объекты кæрæдзииуварс арæзт нæу

## Other math components

ionic-compound-not-two-ions = Дыууæ ионæй æндæр ионон баиутæ арæзт не сты.

ionic-compound-needs-cation-and-anion = Ионон баиу æрмæст иу катион æмæ иу анионмæ арæзт у.

solve-equations-cannot-evaluate = Æмхуызон аразæн нæй, уымæн æмæ йæ банымайын нæ бантыст: { $equation }

math-operators-operand-number-required = Математикон операнд иртасынæн operandNumber хъуамæ лæвæрд уа.

eigen-decomposition-failed = Матрицæйы йæхи аргъытæ банымайын нæ бантыст

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр фæлгæцы нæ æмбæлы, уымæ гæсгæ уый алы хатт афтидимæ фидауы.
       *[other] `<matchesPattern>`: { $parameters } параметртæ фæлгæцы нæ æмбæлынц, уымæ гæсгæ уыдон алы хатт афтидимæ фидауынц.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" аргъ бамбарæн нæй. Уый хъуамæ уа none, medium, dense кæнæ афтид бынатæй хицæнгонд дыууæ плюсон нымæц, зæгъæм grid="1 0.5". Сеткæ нæ ныффыссы.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure нывгæнæджы xLabelPosition="left" арæзт нæу; рахизфарсы уаг пайдагонд цæуы.

prefigure-y-label-position-unsupported = `<graph>`: prefigure нывгæнæджы yLabelPosition="bottom" арæзт нæу; уæллаг уаг пайдагонд цæуы.

prefigure-invalid-axis-bounds = `<graph>`: prefigure ивдмæ тæгты кæрæттæ раст не сты; бындурон bbox (-10,-10,10,10) пайдагонд цæуы.

prefigure-invalid-width = `<graph>`: prefigure ивдмæ уæрх раст нæу; диаграммæйы бындурон уæрх 425 пайдагонд цæуы.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ивдмæ aspectRatio раст нæу; бындурон фæрсты бастдзинад 1 пайдагонд цæуы.

prefigure-grid-spacing-too-fine = `<graph>`: сеткæйы къахдзæф тæгты кæрæттæм тынг гыццыл у; prefigure нывгæнæджы сеткæ нæ рацæуы.

prefigure-annotations-not-rendered = `<graph>`: PreFigure нывгæнæг куы нæ пайдагонд цæуа, уæд фиппаинæгтæ нæ фыссынц.

multiple-annotations-children = `<graph>` мидæг бирæ `<annotations>` сывæллон ссардæуыд; фæстагæй дарддæр иннæтæ нымад нæ цæуынц.

## Referring to other components

copy-unrecognized-component-type = Æнæзонгæ компоненты хуыз ивазæн кæнæ копи кæнæн нæй: { $type }.

copy-prop-not-found = { $component } хуызы компоненты { $property } миниуæг нæ ссардæуыд

collect-no-source = collect-мæ суадон нæ ссардæуыд.

collect-invalid-component-type = `<{ $component }>` хуызы компоненттæ æмбырд кæнæн нæй, уымæн æмæ уый раст нæу компоненты хуыз.

reference-index-unavailable = `{ $reference }` индексмæ бастдзинад саразæн нæй

## `<callAction>`

component-action-unavailable = `{ $reference }` компоненты { $action } сидæн нæй

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Бæрæггæнæнты хуыз раст нæу. Рæнхъыты даргъдзинад хицæн у. Ссардæуыд componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Бæрæггæнæнты цæджындзы нæмттæ фæзминаг сты. Ссардæуыд componentIdx :{ $componentIdx }

data-frame-missing-column-name = Бæрæггæнæнты цæджындзы ном нæ фаг кæны. Ссардæуыд componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ацы дзуаппы award аргъ answer тегы йæхи арвыст дзуаппыл æнцой кæны, уый æнæнхъæлæджы уавæрмæ хæццæ кæны.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` кæмæ ис, ахæм контейнеры мидæг `<answer>`-мæ `maxNumAttempts` æвæрын ницы ахады, уымæн æмæ фæлварæнты нымæц контейнер бæрæг кæны. `maxNumAttempts` аргъ контейнермæ сæвæр.

nested-section-wide-check-work-max-num-attempts = Æндæр `sectionWideCheckWork` контейнеры мидæг лæууæг `sectionWideCheckWork` контейнермæ `maxNumAttempts` æвæрын ницы ахады, уымæн æмæ фæлварæнты нымæц æддаг контейнер бæрæг кæны. `maxNumAttempts` аргъ æддаг контейнермæ сæвæр.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality æвæрд куы нæ уа, уæд { $attributes } атрибут ницы бакæндзæн.
       *[other] symbolicEquality æвæрд куы нæ уа, уæд { $attributes } атрибуттæ ницы бакæндзысты.
    }

answer-invalid-type = answer-мæ раст нæу хуыз: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентмæ ном нæй, уымæ гæсгæ йæ модулы атрибут хуызы пайда кæнæн нæй

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентæй модулы атрибут хуызы пайда кæнæн нæй, уымæн æмæ `<module>` компоненты хуызы «{ $name }» атрибут раджы бæрæггонд æрцыд.

conditional-content-condition-ignored = case кæнæ else сывæллæттимæ `<conditionalContent>` компоненты `condition` атрибут нымад нæ цæуы.

slider-markers-type-mismatch = Маркерты хуыз ползунокы хуызимæ нæ фидауы.

pretzel-problem-needs-statement-and-answer = Раст нæу pretzel: алы `<problem>` хъуамæ иу `<statement>` æмæ иу `<answer>` йæхимæ иса.

pretzel-circuit-first-problem-distractor = Раст нæу pretzel: mode="circuit" уаджы фыццаг `<problem>` хъуамæ хъус иуварсмæ ласæг ма уа.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибутмæ раст нæу аргъ { $values }; нымад нæ цæуы.
       *[other] `{ $attribute }` атрибутмæ раст нæу аргъытæ { $values }; нымад нæ цæуынц.
    }

attribute-must-be-references = `{ $attribute }` атрибутмæ раст нæу аргъ `{ $value }`. Атрибут хъуамæ `$` нысанæй райдайæг бастдзинæдтæй арæзт уа.

math-input-invalid-function-names = <mathInput>: { $attribute } мидæг раст нæу функцийы нæмттæ нымад не ’рцыдысты: { $names }. Алы номы зынгæ хай хъуамæ уæддæр 2 нысаны уа (дамгъæтæ кæнæ хæххытæ); йæ фæстæ хъæугæ нæу `|<mathspeak альтернативæ>` бафтауæн æрцæуа.

## Building components from the source

component-type-invalid = Раст нæу компоненты хуыз: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибут фæзминаг кæнæн нæй.

attribute-invalid-for-component = `<{ $componentType }>` хуызы компонентмæ раст нæу атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стилы бæрæггæнæны { $context ->
        [text-on-background] тексты хуыз æмæ фоны хуыз
        [high-contrast] бæрзонд контрастимæ хуыз æмæ нывы бынат
        [line] хаххы хуыз æмæ нывы бынат
        [marker] маркеры хуыз æмæ нывы бынат
       *[text-on-canvas] тексты хуыз æмæ нывы бынат
    } æхсæн контраст нæ фаг кæны{ $mode ->
        [dark] { " (тар хуыз)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; уæддæр { $threshold }:1 хъæуы).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стилы бæрæггæнæны лæвæрд хуызтæ рухс хуызмæ фаг контраст куыд радтой, афтæ уыдонæй рацыд тар хуызы хуызтæ текст æмæ фоны æхсæн фаг контраст нæ дæттынц ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; уæддæр { $threshold }:1 хъæуы). { $suggestion ->
        [available] Тар хуызы фаг контрастмæ кæнæ рухс хуызы контраст фæфылдæр кæн (зæгъæм { $lightAttribute }="{ $lightColor }"), кæнæ тар хуызы хуыз аив (зæгъæм { $darkAttribute }="{ $darkColor }").
       *[none] Тар хуызы фаг контрастмæ рухс хуызы контраст фæфылдæр кæн кæнæ рацыд хуызтæ textColorDarkMode æмæ/кæнæ backgroundColorDarkMode-æй аив.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стилы бæрæггæнæны лæвæрд тексты хуыз рухс хуызмæ фаг контраст куыд радта, афтæ дзы рацыд тар хуызы тексты хуыз нывы бынатимæ фаг контраст нæ дæтты ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; уæддæр { $threshold }:1 хъæуы). { $suggestion ->
        [available] Тар хуызы фаг контрастмæ кæнæ рухс хуызы контраст фæфылдæр кæн (зæгъæм textColor="{ $lightColor }"), кæнæ тар хуызы хуыз аив (зæгъæм textColorDarkMode="{ $darkColor }").
       *[none] Тар хуызы фаг контрастмæ рухс хуызы контраст фæфылдæр кæн кæнæ рацыд хуыз textColorDarkMode-æй аив.
    }

section-multiple-style-palettes = Хай æрмæст иу <stylePalette> равзарын йæ бон у; фæстаг пайдагонд цæуы.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component }-мæ фæзминаг нæ варианттæ бæрæг кæнæн нæй, уымæн æмæ numToSelect минусон нæ æнæхъæн нымæц нæу.

variant-num-to-select-not-constant-number = { $component }-мæ фæзминаг нæ варианттæ бæрæг кæнæн нæй, уымæн æмæ numToSelect æнæивгæ нымæц нæу.

variant-with-replacement-not-constant-boolean = { $component }-мæ фæзминаг нæ варианттæ бæрæг кæнæн нæй, уымæн æмæ withReplacement æнæивгæ логикон аргъ нæу.

variant-select-weight-disables-unique = искæцы æвзарæны selectWeight кæнæ selectForVariants лæвæрд куы уа, уæд select-мæ фæзминаг нæ варианттæ ахгæд цæуынц

variant-coprime-undetermined = { $component }-мæ фæзминаг нæ варианттæ бæрæг кæнæн нæй, уымæн æмæ coprime алы хатт мæнг у æви нæ, уый бæрæг кæнæн нæй.

variant-attribute-not-constant = { $component }-мæ фæзминаг нæ варианттæ бæрæг кæнæн нæй, уымæн æмæ { $attribute } æнæивгæ нæу.

variant-attribute-not-number = { $component }-мæ фæзминаг нæ варианттæ бæрæг кæнæн нæй, уымæн æмæ { $attribute } нымæц нæу.

variant-attribute-wrong-type-for-sequence =
    { $type } хуызы { $component }-мæ фæзминаг нæ варианттæ бæрæг кæнæн нæй, уымæн æмæ { $attribute } { $expected ->
        [letters-combination] дамгъæты бастдзинад
        [math-expression] æмбæлон математикон æвдисæн
        [integer] æнæхъæн нымæц
       *[number] нымæц
    } нæу.

variant-length-not-integer = { $component }-мæ фæзминаг нæ варианттæ бæрæг кæнæн нæй, уымæн æмæ length æнæхъæн нымæц нæу.

variant-sort-not-implemented = sort кæмæ ис, ахæм { $component }-мæ фæзминаг нæ варианттæ арæзт не сты

variant-exclude-combinations-not-implemented = excludeCombinations кæмæ ис, ахæм { $component }-мæ фæзминаг нæ варианттæ арæзт не сты

variant-math-exclude-not-implemented = exclude кæмæ ис, ахæм math хуызы { $component }-мæ фæзминаг нæ варианттæ арæзт не сты

variant-non-constant-exclude-not-implemented = æнæивгæ нæ exclude кæмæ ис, ахæм { $component }-мæ фæзминаг нæ варианттæ арæзт не сты

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графикы prefigure нывгæнæджы арæзт нæу; йæ байзæддаг ныууагътам.

prefigure-descendant-invalid-geometry = { $subject }: æнæкæрон кæнæ æнæххæст геометри; йæ байзæддаг ныууагътам.

prefigure-curve-label-omitted = { $subject }: ивд къæдз элементты нысæнттæ арæзт не сты; нысан ныууагътам.

prefigure-curve-unsupported-definition-type = { $subject }: арæзт нæ къæдз функцийы бæрæггæнæны хуыз «{ $definitionType }»; йæ байзæддаг ныууагътам.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементы flipFunctions атрибут арæзт нæу; йæ байзæддаг ныууагътам.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves æрмæст формулæйæ лæвæрд сывæллон функцитæ исы; йæ байзæддаг ныууагътам.

prefigure-label-position-unsupported =
    { $subject }: арæзт нæ labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] хæххыты бинонты нысанмæ
       *[point] стъæлфы нысанмæ
    }; PreFigure-йы бындурон бартæ пайдагонд цæуынц.

prefigure-fill-style-unsupported = { $subject }: байдзаг кæныны стиль «{ $fillStyle }» PreFigure-мæ арæзт нæу; æххæст байдзаг кæнынмæ ахизы.

prefigure-line-style-unknown = { $subject }: æнæзонгæ хаххы стиль «{ $lineStyle }» PreFigure-йы рахæссæнæй аппæрст æрцыд.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркеры стиль «{ $markerStyle }» PreFigure-йы «diamond» стилимæ баст æрцыд.

prefigure-marker-style-unsupported = { $subject }: маркеры стиль «{ $markerStyle }» PreFigure-мæ арæзт нæу; бындурон стиль пайдагонд цæуы.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: раст нæу `ref`; нысан баст кæнæн нæй. Фиппаинаг аппæрст æрцыд.

annotation-ref-multiple-targets = `<annotation>`: `ref` бирæ нысæнттимæ баст æрцыд; фыццаг пайдагонд цæуы.

annotation-ref-outside-graph = `<annotation>`: раст нæу `ref`; нысан æй кæцы график хæссы, уымæй æддæмæ у. Фиппаинаг аппæрст æрцыд.

annotation-ref-unsupported-target = `<annotation>`: раст нæу `ref`; нысан prefigure ивды арæзт график объект нæу. Фиппаинаг аппæрст æрцыд.

annotation-text-missing = `<annotation>`: `text` нæй кæнæ афтид у; афтид текст рацæуы.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Тымбыл бастдзинад ссардæуыд.
       *[other] `<{ $componentType }>` компонент хæссæг тымбыл бастдзинад ссардæуыд.
    }

reference-no-referent = Бастдзинадæн объект нæ ссардæуыд: `{ $reference }`

reference-multiple-referents = Бастдзинадæн бирæ объекттæ ссардæуыд: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементы { $attribute } атрибуты формат раст нæу.

children-invalid = `<{ $componentType }>`-мæ раст нæ сывæллæттæ: раст нæ сывæллæттæ ссардæуыд: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибутмæ раст нæу аргъ `{ $value }`; `{ $default }` аргъ пайдагонд цæуы

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } верси нæ ссардæуыд.
       *[other] DoenetML { $version } верси нæ ссардæуыд. { $fallback } верси пайдагонд цæуы
    }

## Reading the DoenetML

parse-invalid-doenetml = Раст нæу DoenetML: { $content }

parse-tag-missing-close-tag = Раст нæу DoenetML: `{ $tag }` тегмæ æхгæнæг тег нæй. Йæхи æхгæнæг тег кæнæ `</{ $tagName }>` тег æнхъæлмæ каст.

parse-tag-error = Раст нæу DoenetML: `<{ $tagName }>` тегы рæдыд

parse-attribute-missing-value = Раст нæу DoenetML: `{ $attribute }` атрибутмæ аргъ нæ фаг кæны, афтæ зыны.

parse-attribute-invalid = Раст нæу DoenetML: раст нæу атрибут `{ $attribute }`

parse-attribute-value-invalid = Раст нæу DoenetML: атрибуты раст нæ аргъ `{ $value }`

parse-attribute-value-quote-mismatch = Раст нæу DoenetML: атрибуты раст нæ аргъ `{ $value }`. Дæндæгтæ нæ фидауынц. `{ $quote }` нæ фаг кæны, афтæ зыны

parse-open-tag-name-missing = Раст нæу DoenetML: æнæном тег ссардæуыд, зæгъæм `<`

parse-tag-not-closed = Раст нæу DoenetML: `{ $tag }` тег æхгæд нæу (`>` нæ фаг кæны, афтæ зыны).

parse-self-closing-tag-name-missing = Раст нæу DoenetML: æнæном тег ссардæуыд `<{ $content }>`

parse-self-closing-tag-not-closed = Раст нæу DoenetML: `{ $tag }` тег æхгæд нæу (`/>` нæ фаг кæны, афтæ зыны).

parse-tag-invalid-attributes = Раст нæу DoenetML: `{ $tag }` тег æмбæлон нæу. Йæ атрибуттæ раст нæ уой, гæнæн ис.

parse-close-tag-name-missing = Раст нæу DoenetML: æнæном æхгæнæг тег ссардæуыд, зæгъæм `</`

parse-attribute-value-unquoted = Атрибуты аргъытæ хъуамæ дæндæгты мидæг уой: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Раст нæу DoenetML: `{ $tag }` æхгæнæг тег ссардæуыд, фæлæ йæм æмбæлон гом кæнæг тег нæй

parse-close-tag-mismatched = Раст нæу DoenetML: нæ фидауæг æхгæнæг тег. `</{ $expected }>` æнхъæлмæ каст. `{ $found }` ссардæуыд

parser-node-unconvertible = { $node } узел Dast узелмæ ивын нæ бантыст.

## Names

name-attribute-invalid =
    Раст нæу атрибут name='{ $name }'. { $reason ->
        [characters] Нæмтты æрмæст дамгъæтæ, нымæцтæ, дæллаг хæххытæ кæнæ хæххытæ уæвæн ис.
       *[start] Нæмттæ хъуамæ дамгъæйæ райдайой.
    }

component-name-invalid-start = Раст нæу компоненты ном «{ $name }». Нæмттæ хъуамæ дамгъæйæ райдайой.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched хуызы answer-мæ хъуамæ video атрибут уа

answer-video-watched-video-not-reference = videoWatched хуызы answer-ы video атрибут хъуамæ бастдзинад уа

answer-name-not-single-text = answer-ы name атрибутмæ хъуамæ æрмæст иу текстон сывæллон уа

## Referencing another document

external-doenetml-recursion-limit = Рекурсийы уæлæнгæйтты нымæц тынг бирæ у, уымæ гæсгæ æддагон DoenetML райсын нæ бантыст. Тымбыл бастдзинад нæй?

external-doenetml-unavailable = { $attribute }="{ $uri }" адисæй DoenetML райсын нæ бантыст

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адисæй раст нæу DoenetML райстæуыд: уый «{ $componentType }» компоненты хуызимæ нæ бафидыдта

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут зæронд сси; йæ бæсты `{ $to }` пайда кæн.
       *[other] [deprecation] `<{ $component }>` элементы `{ $from }` атрибут зæронд сси; йæ бæсты `{ $to }` пайда кæн.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут зæронд сси æмæ нымад нæ цæуы, уымæн æмæ `{ $to }` дæр лæвæрд у.
       *[other] [deprecation] `<{ $component }>` элементы `{ $from }` атрибут зæронд сси æмæ нымад нæ цæуы, уымæн æмæ `{ $to }` дæр лæвæрд у.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементы `{ $attribute }` атрибут зæронд сси æмæ нымад нæ цæуы.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элементы `{ $attribute }` атрибут зæронд сси; йæ бæсты `<{ $child }>` сывæллонæй пайда кæн.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элементы `{ $attribute }` атрибуты `{ $value }` аргъ зæронд сси; йæ бæсты `{ $to }` пайда кæн.


## Language coverage

pluralize-english-only = `<pluralize>` бирæон нымæц æрмæст англисаг æвзагыл аразын йæ бон у, уымæ гæсгæ { $locale } æвзагыл фыст документы йæ текст æнæивгæ баззайы. Бирæон формæ дæхæдæг ныффысс кæнæ йæ `pluralForm` атрибутæй радт.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент зонгæ Doenet элемент нæу.

schema-element-not-allowed-at-root = `<{ $tag }>` элементæн документы уидагыл бар нæ дæттынц.

schema-element-not-allowed-inside = `<{ $tag }>` элементæн `<{ $parent }>` мидæг бар нæ дæттынц.

schema-attribute-unrecognized = `<{ $tag }>` элементмæ `{ $attribute }` номимæ атрибут нæй.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементы `{ $attribute }` атрибут хъуамæ ахæм номхыгъд уа, кæцы алы элемент дæр уыдонæй иу уа: { $allowed }
       *[other] `<{ $tag }>` элементы `{ $attribute }` атрибут хъуамæ уыдонæй иу уа: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select-мæ раст нæу варианты ном. { $variantName } варианты ном { $numOptions } æвзарæны æмбæлы, æвзарæн нымæц та { $numToSelect }.

select-variant-name-without-options = select-мæ варианттæ лæвæрд сты, фæлæ гæнæн варианты номмæ иу æвзарæн дæр нæй: { $variantName }.

select-variant-name-not-possible = select-мæ лæвæрд { $variantName } варианты ном гæнæн варианты ном нæу.

select-too-few-options = Æппæт { $numOptions }-æй { $numToSelect } компонент равзарæн нæй.

select-from-sequence-too-few-values = Даргъдзинад { $length } рæнхъæгтæй { $numToSelect } аргъ равзарæн нæй.

select-from-sequence-indices-count-mismatch = select-мæ лæвæрд индексты нымæц хъуамæ æвзарæн нымæцимæ фидауа

select-from-sequence-indices-not-integers = select-мæ лæвæрд æппæт индекстæ хъуамæ æнæхъæн нымæц уой

select-from-sequence-index-excluded = selectfromsequence-мæ лæвæрд индекс аппæрст уыд

select-from-sequence-indices-excluded-combination = selectfromsequence-мæ лæвæрд индекстæ аппæрст бастдзинад уыдысты

select-from-sequence-coprime-not-positive-integers = Плюсон æнæхъæн нымæцтæ æвзæрст не сты, уымæ гæсгæ кæрæдзимæ хуымæтæг бастдзинæдтæ равзарæн нæй.

select-from-sequence-coprime-common-factor = Кæрæдзимæ хуымæтæг нымæцтæ равзарæн нæй. Æппæт гæнæн аргъытæн иумæйаг дихгæнæг ис. (Лæвæрд "from" кæнæ "to" аргъытæ хъуамæ "step"-имæ кæрæдзимæ хуымæтæг уой.)

select-from-sequence-coprime-single-number = 1 нæ чи у, ахæм иунæг нымæцæй кæрæдзимæ хуымæтæг бастдзинæдтæ равзарæн нæй.

select-from-sequence-excluded-too-many-combinations = selectFromSequence мидæг бастдзинæдты 70%-æй фылдæр аппæрст æрцыд

select-from-sequence-coprime-none-found = Кæрæдзимæ хуымæтæг нымæцтæ равзарын нæ бантыст. Æппæт гæнæн аргъытæн иумæйаг дихгæнæг ис.

select-from-sequence-too-few-unique-values = Даргъдзинад { $numPossibleValues } рæнхъæгтæй { $numToSelect } хицæн аргъ равзарæн нæй

select-prime-numbers-too-few-values = Даргъдзинад { $numValues } хуымæтæг нымæцты номхыгъдæй { $numToSelect } аргъ равзарæн нæй

select-prime-numbers-values-count-mismatch = select-мæ лæвæрд аргъыты нымæц хъуамæ æвзарæн нымæцимæ фидауа

select-prime-numbers-values-not-prime = select prime number-мæ лæвæрд æппæт аргъытæ хъуамæ хуымæтæг нымæцты номхыгъды уой

select-prime-numbers-values-excluded-combination = selectPrimeNumbers-мæ лæвæрд аргъытæ аппæрст бастдзинад уыдысты

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers мидæг бастдзинæдты 70%-æй фылдæр аппæрст æрцыд

select-random-combination-fluke = Тынг æнæгæнæн хабары фæрцы æнæбæрæг аргъыты бастдзинад равзарын нæ бантыст

select-random-value-fluke = Тынг æнæгæнæн хабары фæрцы æнæбæрæг аргъ равзарын нæ бантыст
