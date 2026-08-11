# Udmurt diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# The technical nouns are the Russian ones, which is what written Udmurt uses
# for them: «компонент», «атрибут», «функция», «индекс».


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] кык пум пус возьматэмын ке, { $attributes } лыдэ уг басьтӥськы
       *[other] кык пум пус возьматэмын ке, { $attributes } лыдэ уг басьтӥськы
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] пум пус но шор пус кыксы возьматэмын ке, { $attributes } лыдэ уг басьтӥськы
       *[other] пум пус но шор пус кыксы возьматэмын ке, { $attributes } лыдэ уг басьтӥськы
    }

line-segment-midpoint-offset-without-midpoint = шор пустэк midpointOffset номырлы уг йӧты

## `<line>`

line-points-undetermined-dimensions = Мертанэз тодмотэм пусъёс пыр ортчись шонер чур.

line-points-too-few-dimensions = Шонер чур ичиез ке кык мертанэн пусъёс пыр ортчоно.

line-points-depend-on-variables = Шонер чур воштӥськись мертанъёслэсь дуно пусъёс пыр ортче: { $variables }.

line-equation-invalid-format = { $variable1 } но { $variable2 } воштӥськись мертанъёсын шонер чурлэн уравнениезлэн форматэз янгыш.

## `<ray>`

ray-overprescribed-through = Луч through, endpoint но direction пыр сётэмын. Сётэм through лыдэ уг басьтӥськы.

ray-dimension-mismatch = лучын numDimensions уг тупа.

## `<vector>`

vector-overprescribed-head = Вектор head, tail но displacement пыр сётэмын. Сётэм head лыдэ уг басьтӥськы.

vector-dimension-mismatch = векторын numDimensions уг тупа.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элемент доры кыскыны уг луы, малы ке шуоно солэн nearestPoint статус воштӥськисез ӧвӧл.

constrain-to-without-nearest-point = `<{ $component }>` элементэн ӵектыны уг луы, малы ке шуоно солэн nearestPoint статус воштӥськисез ӧвӧл.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементлэн пушкыныз ӵектыны уг луы, малы ке шуоно солэн nearestPoint статус воштӥськисез ӧвӧл.

## `<choiceInput>`

choice-input-label-position-ignored = чур пушкын ӧвӧл choiceInput понна labelPosition лыдэ уг басьтӥськы

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput понна сётэм индексъёс лыдэ уг басьтӥсько, малы ке шуоно соослэн лыдзы choice нылпиослэн лыдзылы уг тупа.

pretzel-indices-count-mismatch = problem понна сётэм индексъёс лыдэ уг басьтӥсько, малы ке шуоно соослэн лыдзы problem нылпиослэн лыдзылы уг тупа.

shuffle-indices-count-mismatch = shuffle понна сётэм индексъёс лыдэ уг басьтӥсько, малы ке шуоно соослэн лыдзы компонентъёслэн лыдзылы уг тупа.

indices-ignored-out-of-range = { $component } понна сётэм индексъёс лыдэ уг басьтӥсько, малы ке шуоно кудъёсыз пумысь потэмын.

pretzel-indices-repeated = pretzel понна сётэм индексъёс лыдэ уг басьтӥсько, малы ке шуоно кудъёсыз берыктӥсько.

pretzel-circuit-first-index = circuit режимын pretzel понна сётэм индексъёс лыдэ уг басьтӥсько, малы ке шуоно нырысетӥ индекс 1 луыны кулэ.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текст нылпиосын ужаны понна `type` атрибут сётоно.

invalid-type-defaulting-to-math = { $component } компонентлы янгыш пӧртэмлык { $type }. Со math, text, number яке boolean луыны кулэ. math кутӥське.

string-not-valid-component-to-arrange = «{ $value }» чур { $component } понна тупась компонент ӧвӧл. Лыдэ уг басьтӥськы.

## Types and variables

invalid-type-defaulting-to-number = Янгыш пӧртэмлык { $type }, пӧртэмлыкез number луэ.

invalid-variable-value = Воштӥськисьлэн янгыш дунэз: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариант индекс лыд луыны кулэ

variant-index-must-be-integer = { $index } вариант индекс тыр лыд луыны кулэ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют мертанъёслы лэсьтымтэ. Пасьталаосыз ӵошатон луо.

side-by-side-absolute-margins = `<{ $component }>` абсолют мертанъёслы лэсьтымтэ. Дуръёсыз ӵошатон луо.

side-by-side-no-block-child = Янгыш `<{ $component }>`: солэн ичиез ке одӥг блок нылпиез луыны кулэ.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элементысь `for` атрибут лыдэ уг басьтӥськы.

label-for-must-resolve-to-one = `<label>` элементысь `for` атрибут тупак одӥг компонент вылэ возьматоно.

label-for-unresolved = `<label>` элементысь `for` атрибутэз компонентэн герӟаны ӧз луы.

label-for-answer-with-authored-inputs = `<label>` элементысь `for` атрибут автор гожтэм пыртон бусыосын `<answer>` вылэ возьматэ; бусы вылэ шонерак возьматэ.

label-for-answer-without-input = `<label>` элементысь `for` атрибут пусъяно пыртон бусытэк `<answer>` вылэ возьматэ.

label-for-must-reference-input-or-answer = `<label>` элементысь `for` атрибут пыртон бусы яке ответ вылэ возьматоно.

## Accessibility

accessibility-short-description-or-decorative = Вуонлык понна `<{ $component }>` яке вакчи валэктонэн луыны кулэ, яке чеберъян сямен пусъяно.

accessibility-video-short-description = Вуонлык понна `<video>` вакчи валэктонэн луыны кулэ.

accessibility-input-short-description-or-label = Вуонлык понна `<{ $component }>` вакчи валэктонэн яке пусэн луыны кулэ.

accessibility-answer-input-short-description-or-label = Вуонлык понна пыртон бусы кылдытӥсь `<answer>` вакчи валэктонэн яке пусэн луыны кулэ.

accessibility-short-description-contains-math = Вакчи валэктонъёсын `<{ $component }>` кадь математической компонентъёс луыны уг яра. Математикаез кылъёсын гожтэ.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ёзэтлэн йырозэзлэн текстэзлы тырмыт контраст уг сёты (пеймыт бамал) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ичиез ке { $threshold }:1 кулэ).
       *[other] { $colorName } ёзэтлэн йырозэзлэн текстэзлы тырмыт контраст уг сёты ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ичиез ке { $threshold }:1 кулэ).
    }

## `<circle>`

circle-through-points-non-numerical = Пусъёслэн лыд дунъёссы ӧвӧл ке, { $count } пус пыр ортчись `<circle>` лэсьтымтэ.

circle-too-many-through-points = 3-лэсь трос пус пыр ортчись котыресэз лыдъяны уг луы.

circle-overprescribed-radius-center-points = Сётэм радиусэн, шорен но пусъёсын котыресэз лыдъяны уг луы.

circle-center-with-multiple-points = Сётэм шорен 1-лэсь трос пус пыр ортчись котыресэз лыдъяны уг луы.

circle-radius-too-small = Котыресэз лыдъяны уг луы: кык пус куспын кузьда { $distance } луэ, сётэм радиус { $radius } туж покчи.

circle-radius-with-many-points = Сётэм радиусэн кыклэсь трос пус пыр ортчись котырес лэсьтыны уг луы.

circle-invalid-center-or-through-points = Котыреслэн шорез яке пусъёсыз янгыш.

circle-radius-center-with-multiple-points = Сётэм шорен 1-лэсь трос пус пыр ортчись котыреслэсь радиуссэ лыдъяны уг луы.

circle-change-radius-non-numerical = Лыд ӧвӧл пусъёсын котыреслэсь радиуссэ воштыны уг луы

circle-radius-with-points-non-numerical = Лыд дунъёс ӧвӧл ке, сётэм радиусэн одӥглэсь трос пус пыр ортчись котырес лэсьтыны уг луы.

circle-change-center-non-numerical = Лыд ӧвӧл пусъёс пыр ортчись котыреслэсь шорзэ воштон лэсьтымтэ.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцилэн тодмам интыезлэн мертанэз тырмыт ӧвӧл. Интыын { $intervals } кусып вань, нош функциын { $inputs ->
            [one] { $inputs } пыртон
           *[other] { $inputs } пыртон
        } вань.
       *[other] Функцилэн тодмам интыезлэн мертанэз тырмыт ӧвӧл. Интыын { $intervals } кусып вань, нош функциын { $inputs ->
            [one] { $inputs } пыртон
           *[other] { $inputs } пыртон
        } вань.
    }

function-domain-invalid-format = Функцилэн тодмам интыезлэн форматэз янгыш.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцилэн лыд ӧвӧл максимумез лыдэ уг басьтӥськы.
        [minimum] Функцилэн лыд ӧвӧл минимумез лыдэ уг басьтӥськы.
        [extremum] Функцилэн лыд ӧвӧл экстремумез лыдэ уг басьтӥськы.
        [point] Функцилэн лыд ӧвӧл пусэз лыдэ уг басьтӥськы.
        [slope] Функцилэн лыд ӧвӧл мыкыртэмез лыдэ уг басьтӥськы.
       *[other] Функцилэн лыд ӧвӧл { $type } дунэз лыдэ уг басьтӥськы.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцилэн буш максимумез лыдэ уг басьтӥськы.
        [minimum] Функцилэн буш минимумез лыдэ уг басьтӥськы.
        [extremum] Функцилэн буш экстремумез лыдэ уг басьтӥськы.
        [point] Функцилэн буш пусэз лыдэ уг басьтӥськы.
       *[other] Функцилэн буш { $type } дунэз лыдэ уг басьтӥськы.
    }

function-points-too-close = Функциын огзылы огзы туж матын кык пус вань. Функциез тодманы уг луы.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функцилэн итерациосыз пыртонъёслэн лыдзы потонъёслэн лыдзылы тупа ке гинэ луо. Та функциын { $inputs } пыртон но { $outputs ->
            [one] { $outputs } потон
           *[other] { $outputs } потон
        } вань.
       *[other] Функцилэн итерациосыз пыртонъёслэн лыдзы потонъёслэн лыдзылы тупа ке гинэ луо. Та функциын { $inputs } пыртон но { $outputs ->
            [one] { $outputs } потон
           *[other] { $outputs } потон
        } вань.
    }

## `<sequence>`

sequence-invalid-length = Радъетлэн кузьдалаез янгыш. Со минус ӧвӧл тыр лыд луыны кулэ.

sequence-invalid-step = Радъетлэн вамышез янгыш. { $type } пӧртэмлыко радъетлы со лыд луыны кулэ.

sequence-invalid-endpoint-number = Лыд радъетлэн «{ $attribute }» дунэз янгыш. Со лыд луыны кулэ.

sequence-invalid-endpoint-letters = Букваос радъетлэн «{ $attribute }» дунэз янгыш. Со буквалэн герӟетэз луыны кулэ.

sequence-invalid-endpoint = Радъетлэн «{ $attribute }» дунэз янгыш.

select-from-sequence-coprime-not-numbers = лыдъёс быръемын ӧвӧл, соин coprime лыдэ уг басьтӥськы

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations сётэмын, соин coprime лыдэ уг басьтӥськы

## Resolving a `target`

target-not-found = `<{ $source }>` понна янгыш target: ужпум ӧз шедьтӥськы.

target-state-variable-not-found = `<{ $source }>` понна янгыш target: `<{ $component }>` элементын «{ $property }» нимо статус воштӥськись ӧз шедьтӥськы.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` воштӥськисьёсыз асэсьтэм воштӥськисьлэсь пӧртэм луыны кулэ.

ode-system-duplicate-variable-names = Дуно воштӥськисьёслэн нимъёссы берыктӥсько ке, ДТ бур палысь функциосты тодманы уг луы.

ode-system-rhs-function-error = ДТ бур палысь функциез тодманы уг луы. mathjs функциез кылдытыкы янгыш.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } шонер чур куспын сэрегез тодманы уг луы

angle-invalid-through-point = `<angle>` элементлэн through дуназ янгыш пус

parabola-vertex-too-many-points = Сётэм йылын 1-лэсь трос пус пыр ортчись парабола лэсьтымтэ.

parabola-too-many-points = 3-лэсь трос пус пыр ортчись парабола лэсьтымтэ.

intersection-too-many-items = Кыклэсь трос объектлэн вамен потэмез лэсьтымтэ

## Other math components

ionic-compound-not-two-ions = Кык ионлэсь мукет ион герӟетъёс лэсьтымтэ.

ionic-compound-needs-cation-and-anion = Ион герӟет одӥг катионлы но одӥг анионлы гинэ лэсьтэмын.

solve-equations-cannot-evaluate = Уравнениез быдэстыны уг луы, малы ке шуоно сое лыдъяны ӧз луы: { $equation }

math-operators-operand-number-required = Математической операндэз висъян понна operandNumber сётоно.

eigen-decomposition-failed = Матрицалэсь ас дунъёссэ лыдъяны ӧз луы

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр образецын уг пумиськы, соин со котьку бушлы тупа.
       *[other] `<matchesPattern>`: { $parameters } параметръёс образецын уг пумисько, соин соос котьку бушлы тупало.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" дунэз валаны уг луы. Со none, medium, dense яке буш интыен висъям кык плюс лыд луыны кулэ, кылсярысь grid="1 0.5". Сетка уг суредаськы.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure суредасьын xLabelPosition="left" лэсьтымтэ; бур пала пуктон кутӥське.

prefigure-y-label-position-unsupported = `<graph>`: prefigure суредасьын yLabelPosition="bottom" лэсьтымтэ; вылӥ пала пуктон кутӥське.

prefigure-invalid-axis-bounds = `<graph>`: prefigure выжтонлы тэльёслэн пумъёссы янгыш; инъет bbox (-10,-10,10,10) кутӥське.

prefigure-invalid-width = `<graph>`: prefigure выжтонлы пасьтала янгыш; диаграммалэн инъет пасьталаез 425 кутӥське.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure выжтонлы aspectRatio янгыш; инъет палъёслэн герӟетсы 1 кутӥське.

prefigure-grid-spacing-too-fine = `<graph>`: сеткалэн вамышез тэльёслэн пумъёссылы туж вакчи; prefigure суредасьын сетка уг поттӥськы.

prefigure-annotations-not-rendered = `<graph>`: PreFigure суредась уг кутӥськы ке, пусъёнъёс уг суредасько.

multiple-annotations-children = `<graph>` пушкын трос `<annotations>` нылпи шедьтэмын; берпуметӥезлэсь мукетъёсыз лыдэ уг басьтӥсько.

## Referring to other components

copy-unrecognized-component-type = Тодмотэм компонент пӧртэмлыкез паськытатыны яке копировать карыны уг луы: { $type }.

copy-prop-not-found = { $component } пӧртэмлыко компонентын { $property } тодмет ӧз шедьтӥськы

collect-no-source = collect понна инъет ӧз шедьтӥськы.

collect-invalid-component-type = `<{ $component }>` пӧртэмлыко компонентъёсты люканы уг луы, малы ке шуоно та янгыш компонент пӧртэмлык.

reference-index-unavailable = `{ $reference }` индекс вылэ герӟет лэсьтыны уг луы

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентын { $action } ӧтьыны уг луы

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Даннойёслэн тусзы янгыш. Чуръёслэн кузьдалазы пӧртэм. Шедьтэмын componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Даннойёсын юболэн нимъёсыз берыктӥсько. Шедьтэмын componentIdx :{ $componentIdx }

data-frame-missing-column-name = Даннойёсын юбо ним уг тырмы. Шедьтэмын componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Та ответлэн award дунэз answer тегъяслэн ас ыстэм ответсы вылэ пыкиське, со витёнтэм ужпумъёсы вуттэ.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` вань контейнер пушкысь `<answer>` вылэ `maxNumAttempts` пуктон уг йӧты, малы ке шуоно выремлыкъёслэсь лыдзэс контейнер тодма. `maxNumAttempts` дунэз контейнер вылэ пукты.

nested-section-wide-check-work-max-num-attempts = Мукет `sectionWideCheckWork` контейнер пушкын сылӥсь `sectionWideCheckWork` контейнер вылэ `maxNumAttempts` пуктон уг йӧты, малы ке шуоно выремлыкъёслэсь лыдзэс кузя контейнер тодма. `maxNumAttempts` дунэз кузя контейнер вылэ пукты.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality пуктымтэ ке, { $attributes } атрибут уз йӧты.
       *[other] symbolicEquality пуктымтэ ке, { $attributes } атрибутъёс уз йӧто.
    }

answer-invalid-type = answer понна янгыш пӧртэмлык: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентлэн нимыз ӧвӧл, соин сое модуль атрибут сямен кутыны уг луы

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентэз модуль атрибут сямен кутыны уг луы, малы ке шуоно `<module>` компонент пӧртэмлыкын «{ $name }» атрибут ини тодмамын.

conditional-content-condition-ignored = case яке else нылпиосын `<conditionalContent>` компонентын `condition` атрибут лыдэ уг басьтӥськы.

slider-markers-type-mismatch = Маркеръёслэн пӧртэмлыксы ползунокалэн пӧртэмлыкезлы уг тупа.

pretzel-problem-needs-statement-and-answer = Янгыш pretzel: котькуд `<problem>` одӥг `<statement>` но одӥг `<answer>` пушказ басьтоно.

pretzel-circuit-first-problem-distractor = Янгыш pretzel: mode="circuit" режимын нырысетӥ `<problem>` саклыкез палэнтӥсь луыны уг быгаты.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибутлы янгыш дун { $values }; лыдэ уг басьтӥськы.
       *[other] `{ $attribute }` атрибутлы янгыш дунъёс { $values }; лыдэ уг басьтӥсько.
    }

attribute-must-be-references = `{ $attribute }` атрибутлы янгыш дун `{ $value }`. Атрибут `$` пусэн кутскись герӟетъёслэсь луыны кулэ.

math-input-invalid-function-names = <mathInput>: { $attribute } пушкысь янгыш функци нимъёс лыдэ ӧз басьтӥськы: { $names }. Котькуд нимлэн адӟиськись люкетэз ичиез ке 2 пус луыны кулэ (буквалъёс яке черточкаос); со бере кулэтэм `|<mathspeak альтернатива>` ватсэт лыктыны быгатэ.

## Building components from the source

component-type-invalid = Янгыш компонент пӧртэмлык: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутэз берыктыны уг луы.

attribute-invalid-for-component = `<{ $componentType }>` пӧртэмлыко компонентлы янгыш атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль валэктонын { $context ->
        [text-on-background] текстлэн буёлэз но фонлэн буёлэз
        [high-contrast] бадӟым контрастэн буёл но суредан инты
        [line] чурлэн буёлэз но суредан инты
        [marker] маркерлэн буёлэз но суредан инты
       *[text-on-canvas] текстлэн буёлэз но суредан инты
    } куспын контраст тырмыт ӧвӧл{ $mode ->
        [dark] { " (пеймыт бамал)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ичиез ке { $threshold }:1 кулэ).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль валэктонын сётэм буёлъёс югыт бамаллы тырмыт контраст сётӥзы ке но, соослэсь потэм пеймыт бамал буёлъёс текст но фон куспын тырмыт контраст уг сёто ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ичиез ке { $threshold }:1 кулэ). { $suggestion ->
        [available] Пеймыт бамалын тырмыт контраст понна яке югыт бамаллэсь контрастсэ будэтэ (кылсярысь { $lightAttribute }="{ $lightColor }"), яке пеймыт бамал буёлэз воштэ (кылсярысь { $darkAttribute }="{ $darkColor }").
       *[none] Пеймыт бамалын тырмыт контраст понна югыт бамаллэсь контрастсэ будэтэ яке потэм буёлъёсты textColorDarkMode но/яке backgroundColorDarkMode пыр воштэ.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль валэктонын сётэм текст буёл югыт бамаллы тырмыт контраст сётӥз ке но, солэсь потэм пеймыт бамал текст буёл суредан интыен тырмыт контраст уг сёты ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ичиез ке { $threshold }:1 кулэ). { $suggestion ->
        [available] Пеймыт бамалын тырмыт контраст понна яке югыт бамаллэсь контрастсэ будэтэ (кылсярысь textColor="{ $lightColor }"), яке пеймыт бамал буёлэз воштэ (кылсярысь textColorDarkMode="{ $darkColor }").
       *[none] Пеймыт бамалын тырмыт контраст понна югыт бамаллэсь контрастсэ будэтэ яке потэм буёлэз textColorDarkMode пыр воштэ.
    }

section-multiple-style-palettes = Ёзэт одӥг гинэ <stylePalette> быръыны быгатэ; берпуметӥез кутӥське.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } понна берыктымтэ вариантъёсты тодманы уг луы, малы ке шуоно numToSelect минус ӧвӧл тыр лыд ӧвӧл.

variant-num-to-select-not-constant-number = { $component } понна берыктымтэ вариантъёсты тодманы уг луы, малы ке шуоно numToSelect воштӥськисьтэм лыд ӧвӧл.

variant-with-replacement-not-constant-boolean = { $component } понна берыктымтэ вариантъёсты тодманы уг луы, малы ке шуоно withReplacement воштӥськисьтэм логической дун ӧвӧл.

variant-select-weight-disables-unique = кыӵе ке быръёнын selectWeight яке selectForVariants сётэмын ке, select понна берыктымтэ вариантъёс кысо

variant-coprime-undetermined = { $component } понна берыктымтэ вариантъёсты тодманы уг луы, малы ке шуоно coprime котьку янгыш-а, сое тодманы уг луы.

variant-attribute-not-constant = { $component } понна берыктымтэ вариантъёсты тодманы уг луы, малы ке шуоно { $attribute } воштӥськисьтэм ӧвӧл.

variant-attribute-not-number = { $component } понна берыктымтэ вариантъёсты тодманы уг луы, малы ке шуоно { $attribute } лыд ӧвӧл.

variant-attribute-wrong-type-for-sequence =
    { $type } пӧртэмлыко { $component } понна берыктымтэ вариантъёсты тодманы уг луы, малы ке шуоно { $attribute } { $expected ->
        [letters-combination] буквалъёслэн герӟетсы
        [math-expression] тупась математической валэктон
        [integer] тыр лыд
       *[number] лыд
    } ӧвӧл.

variant-length-not-integer = { $component } понна берыктымтэ вариантъёсты тодманы уг луы, малы ке шуоно length тыр лыд ӧвӧл.

variant-sort-not-implemented = sort вань { $component } понна берыктымтэ вариантъёс лэсьтымтэ

variant-exclude-combinations-not-implemented = excludeCombinations вань { $component } понна берыктымтэ вариантъёс лэсьтымтэ

variant-math-exclude-not-implemented = exclude вань math пӧртэмлыко { $component } понна берыктымтэ вариантъёс лэсьтымтэ

variant-non-constant-exclude-not-implemented = воштӥськисьтэм ӧвӧл exclude вань { $component } понна берыктымтэ вариантъёс лэсьтымтэ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графиклэн prefigure суредасяз лэсьтымтэ; выжыез кельтэмын.

prefigure-descendant-invalid-geometry = { $subject }: пумтэм яке тырмымтэ геометрия; выжыез кельтэмын.

prefigure-curve-label-omitted = { $subject }: выжтэм кожась элементъёсын пусъёс лэсьтымтэ; пус кельтэмын.

prefigure-curve-unsupported-definition-type = { $subject }: лэсьтымтэ кожась функци валэктонлэн пӧртэмлыкез «{ $definitionType }»; выжыез кельтэмын.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементысь flipFunctions атрибут лэсьтымтэ; выжыез кельтэмын.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формулаен сётэм нылпи функциосты гинэ басьтэ; выжыез кельтэмын.

prefigure-label-position-unsupported =
    { $subject }: лэсьтымтэ labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] чуръёслэн семьязылэн пусэзлы
       *[point] пуслэн пусэзлы
    }; PreFigure-лэн инъет ӵошатэмез кутӥське.

prefigure-fill-style-unsupported = { $subject }: тырон стиль «{ $fillStyle }» PreFigure понна лэсьтымтэ; тыр тыронэ выже.

prefigure-line-style-unknown = { $subject }: тодмотэм чур стиль «{ $lineStyle }» PreFigure потонысь палэнтэмын.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер стиль «{ $markerStyle }» PreFigure «diamond» стилен тупатэмын.

prefigure-marker-style-unsupported = { $subject }: маркер стиль «{ $markerStyle }» PreFigure понна лэсьтымтэ; инъет стиль кутӥське.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: янгыш `ref`; ужпумез герӟаны уг луы. Пусъён палэнтэмын.

annotation-ref-multiple-targets = `<annotation>`: `ref` трос ужпумен герӟаськиз; нырысетӥез кутӥське.

annotation-ref-outside-graph = `<annotation>`: янгыш `ref`; ужпум сое пушказ басьтӥсь графиклэсь палэнын. Пусъён палэнтэмын.

annotation-ref-unsupported-target = `<annotation>`: янгыш `ref`; ужпум prefigure выжтонын лэсьтэм график объект ӧвӧл. Пусъён палэнтэмын.

annotation-text-missing = `<annotation>`: `text` ӧвӧл яке буш; буш текст поттӥське.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Котыртэм герӟаськон шедьтэмын.
       *[other] `<{ $componentType }>` компонентэз пушказ басьтӥсь котыртэм герӟаськон шедьтэмын.
    }

reference-no-referent = Герӟетлы объект ӧз шедьтӥськы: `{ $reference }`

reference-multiple-referents = Герӟетлы трос объект шедьтэмын: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементлэн { $attribute } атрибутэзлэн форматэз янгыш.

children-invalid = `<{ $componentType }>` понна янгыш нылпиос: янгыш нылпиос шедьтэмын: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибутлы янгыш дун `{ $value }`; `{ $default }` дун кутӥське

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версия ӧз шедьтӥськы.
       *[other] DoenetML { $version } версия ӧз шедьтӥськы. { $fallback } версия кутӥське
    }

## Reading the DoenetML

parse-invalid-doenetml = Янгыш DoenetML: { $content }

parse-tag-missing-close-tag = Янгыш DoenetML: `{ $tag }` теглэн ворсась тегез ӧвӧл. Ачиз ворсаськись тег яке `</{ $tagName }>` тег витиськиз.

parse-tag-error = Янгыш DoenetML: `<{ $tagName }>` тегын янгыш

parse-attribute-missing-value = Янгыш DoenetML: `{ $attribute }` атрибутын дун уг тырмы кадь.

parse-attribute-invalid = Янгыш DoenetML: янгыш атрибут `{ $attribute }`

parse-attribute-value-invalid = Янгыш DoenetML: атрибутлэн янгыш дунэз `{ $value }`

parse-attribute-value-quote-mismatch = Янгыш DoenetML: атрибутлэн янгыш дунэз `{ $value }`. Кавычкаос уг тупало. `{ $quote }` уг тырмы кадь

parse-open-tag-name-missing = Янгыш DoenetML: нимтэк тег шедьтэмын, кылсярысь `<`

parse-tag-not-closed = Янгыш DoenetML: `{ $tag }` тег ворсамтэ (`>` уг тырмы кадь).

parse-self-closing-tag-name-missing = Янгыш DoenetML: нимтэк тег шедьтэмын `<{ $content }>`

parse-self-closing-tag-not-closed = Янгыш DoenetML: `{ $tag }` тег ворсамтэ (`/>` уг тырмы кадь).

parse-tag-invalid-attributes = Янгыш DoenetML: `{ $tag }` тег тупась ӧвӧл. Солэн атрибутъёсыз янгыш луыны быгато.

parse-close-tag-name-missing = Янгыш DoenetML: нимтэк ворсась тег шедьтэмын, кылсярысь `</`

parse-attribute-value-unquoted = Атрибутлэн дунъёсыз кавычка пушкын луыны кулэ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Янгыш DoenetML: `{ $tag }` ворсась тег шедьтэмын, нош солы тупась усьтӥсь тег ӧвӧл

parse-close-tag-mismatched = Янгыш DoenetML: тупамтэ ворсась тег. `</{ $expected }>` витиськиз. `{ $found }` шедьтэмын

parser-node-unconvertible = { $node } узелэз Dast узеле выжтыны ӧз луы.

## Names

name-attribute-invalid =
    Янгыш атрибут name='{ $name }'. { $reason ->
        [characters] Нимъёсын буквалъёс, лыдъёс, улӥ черточкаос яке черточкаос гинэ луыны быгато.
       *[start] Нимъёс буквалэсь кутсконо.
    }

component-name-invalid-start = Янгыш компонент ним «{ $name }». Нимъёс буквалэсь кутсконо.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched пӧртэмлыко answer-лэн video атрибутэз луыны кулэ

answer-video-watched-video-not-reference = videoWatched пӧртэмлыко answer-лэн video атрибутэз герӟет луыны кулэ

answer-name-not-single-text = answer-лэн name атрибутаз тупак одӥг текст нылпи луыны кулэ

## Referencing another document

external-doenetml-recursion-limit = Рекурсилэн ёзъёсыз туж трос, соин палэнысь DoenetML басьтыны ӧз луы. Котыртэм герӟет ӧвӧл-а?

external-doenetml-unavailable = { $attribute }="{ $uri }" адресысь DoenetML басьтыны ӧз луы

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адресысь янгыш DoenetML басьтэмын: со «{ $componentType }» компонент пӧртэмлыклы ӧз тупа

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут вужмиз; со интые `{ $to }` куты.
       *[other] [deprecation] `<{ $component }>` элементысь `{ $from }` атрибут вужмиз; со интые `{ $to }` куты.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут вужмиз но лыдэ уг басьтӥськы, малы ке шуоно `{ $to }` но сётэмын.
       *[other] [deprecation] `<{ $component }>` элементысь `{ $from }` атрибут вужмиз но лыдэ уг басьтӥськы, малы ке шуоно `{ $to }` но сётэмын.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементысь `{ $attribute }` атрибут вужмиз но лыдэ уг басьтӥськы.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элементысь `{ $attribute }` атрибут вужмиз; со интые `<{ $child }>` нылпиез куты.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элементысь `{ $attribute }` атрибутлэн `{ $value }` дунэз вужмиз; со интые `{ $to }` куты.


## Language coverage

pluralize-english-only = `<pluralize>` трослыко лыдэз англи кылын гинэ лэсьтыны быгатэ, соин { $locale } кылын гожтэм документын солэн текстэз воштӥськытэк кыле. Трослыко формазэ ачид гожты яке сое `pluralForm` атрибутэн сёт.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент тодмо Doenet элемент ӧвӧл.

schema-element-not-allowed-at-root = `<{ $tag }>` элементлы документлэн выжыяз лэзьымтэ.

schema-element-not-allowed-inside = `<{ $tag }>` элементлы `<{ $parent }>` пушкын лэзьымтэ.

schema-attribute-unrecognized = `<{ $tag }>` элементын `{ $attribute }` нимо атрибут ӧвӧл.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементлэн `{ $attribute }` атрибутэз котькуд элементэз таослэн огез луись список луыны кулэ: { $allowed }
       *[other] `<{ $tag }>` элементлэн `{ $attribute }` атрибутэз таослэн огез луыны кулэ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select понна янгыш вариант ним. { $variantName } вариант ним { $numOptions } быръёнын пумиське, нош быръёно лыд { $numToSelect }.

select-variant-name-without-options = select понна вариантъёс сётэмын, нош луонлыко вариант нимлы одӥг быръён но ӧвӧл: { $variantName }.

select-variant-name-not-possible = select понна сётэм { $variantName } вариант ним луонлыко вариант ним ӧвӧл.

select-too-few-options = Ваньмыз { $numOptions } пӧлысь { $numToSelect } компонентэз быръыны уг луы.

select-from-sequence-too-few-values = Кузьдалаез { $length } радъетысь { $numToSelect } дунэз быръыны уг луы.

select-from-sequence-indices-count-mismatch = select понна сётэм индексъёслэн лыдзы быръёно лыдлы тупано

select-from-sequence-indices-not-integers = select понна сётэм ваньмыз индексъёс тыр лыд луыны кулэ

select-from-sequence-index-excluded = selectfromsequence понна сётэм индекс палэнтэмын вал

select-from-sequence-indices-excluded-combination = selectfromsequence понна сётэм индексъёс палэнтэм герӟет вал

select-from-sequence-coprime-not-positive-integers = Плюс тыр лыдъёс быръемын ӧвӧл, соин ог-огзылы простой герӟетъёсты быръыны уг луы.

select-from-sequence-coprime-common-factor = Ог-огзылы простой лыдъёсты быръыны уг луы. Ваньмыз луонлыко дунъёслэн огъя люкисьсы вань. (Сётэм "from" яке "to" дунъёс "step"-эн ог-огзылы простой луыны кулэ.)

select-from-sequence-coprime-single-number = 1 ӧвӧл одӥг лыдысь ог-огзылы простой герӟетъёсты быръыны уг луы.

select-from-sequence-excluded-too-many-combinations = selectFromSequence пушкын герӟетъёслэн 70%-лэсь тросэз палэнтэмын

select-from-sequence-coprime-none-found = Ог-огзылы простой лыдъёсты быръыны ӧз луы. Ваньмыз луонлыко дунъёслэн огъя люкисьсы вань.

select-from-sequence-too-few-unique-values = Кузьдалаез { $numPossibleValues } радъетысь { $numToSelect } пӧртэм дунэз быръыны уг луы

select-prime-numbers-too-few-values = Кузьдалаез { $numValues } простой лыдъёслэн списокысьтызы { $numToSelect } дунэз быръыны уг луы

select-prime-numbers-values-count-mismatch = select понна сётэм дунъёслэн лыдзы быръёно лыдлы тупано

select-prime-numbers-values-not-prime = select prime number понна сётэм ваньмыз дунъёс простой лыдъёслэн списказы луыны кулэ

select-prime-numbers-values-excluded-combination = selectPrimeNumbers понна сётэм дунъёс палэнтэм герӟет вал

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers пушкын герӟетъёслэн 70%-лэсь тросэз палэнтэмын

select-random-combination-fluke = Туж луонтэм учыр сэрен шаплы дунъёслэсь герӟетсэс быръыны ӧз луы

select-random-value-fluke = Туж луонтэм учыр сэрен шаплы дунэз быръыны ӧз луы
