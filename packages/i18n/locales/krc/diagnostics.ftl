# Karachay-Balkar diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Cyrillic orthography of Karachay-Cherkessia and
# Kabardino-Balkaria, in the Karachay literary norm (дж- rather than Balkar
# ж-); see `content.ftl`'s header for what that choice covers.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back out of the author's
# own source.
#
# The technical register is largely Russian, which is what written
# Karachay-Balkar itself reaches for: «компонент», «атрибут», «функция»,
# «индекс», «формат». What is Karachay-Balkar is the grammar around them and
# the everyday words — «табылмады», «эсге алынмайды», «болургъа керекди».
#
# Karachay-Balkar counts in the same two categories English does, so every
# selection below keeps both branches — but a noun after a numeral stays
# singular, so the two usually differ only in the number they print.
#
# Nothing here agrees with a gender or a noun class: the language has neither.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] эки уч нокъта берилгенде { $attributes } эсге алынмайды
       *[other] эки уч нокъта берилгенде { $attributes } эсге алынмайды
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] уч нокъта бла орта нокъта экиси да берилгенде { $attributes } эсге алынмайды
       *[other] уч нокъта бла орта нокъта экиси да берилгенде { $attributes } эсге алынмайды
    }

line-segment-midpoint-offset-without-midpoint = орта нокъта болмаса, midpointOffset бир затха да себеб этмейди

## `<line>`

line-points-undetermined-dimensions = Ёлчеми белгисиз нокъталадан ётген тюз сызыкъ.

line-points-too-few-dimensions = Тюз сызыкъ эм аз да эки ёлчемли нокъталадан ётерге керекди.

line-points-depend-on-variables = Тюз сызыкъ тюрлениучюлеге кёре болгъан нокъталадан ётеди: { $variables }.

line-equation-invalid-format = { $variable1 } бла { $variable2 } тюрлениучюледеги тюз сызыкъны тенглигини форматы тюз тюйюлдю.

## `<ray>`

ray-overprescribed-through = Нур through, endpoint эм direction бла берилгенди. Берилген through эсге алынмайды.

ray-dimension-mismatch = нурда numDimensions келишмейди.

## `<vector>`

vector-overprescribed-head = Вектор head, tail эм displacement бла берилгенди. Берилген head эсге алынмайды.

vector-dimension-mismatch = векторда numDimensions келишмейди.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элементге тартыргъа болмайды, нек десенг аны nearestPoint хал тюрлениучюсю джокъду.

constrain-to-without-nearest-point = `<{ $component }>` элемент бла чекленирге болмайды, нек десенг аны nearestPoint хал тюрлениучюсю джокъду.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементни ичи бла чекленирге болмайды, нек десенг аны nearestPoint хал тюрлениучюсю джокъду.

## `<choiceInput>`

choice-input-label-position-ignored = тизгин ичинде болмагъан choiceInput ючюн labelPosition эсге алынмайды

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput ючюн берилген индексле эсге алынмайдыла, нек десенг аланы саны choice балаланы санына келишмейди.

pretzel-indices-count-mismatch = problem ючюн берилген индексле эсге алынмайдыла, нек десенг аланы саны problem балаланы санына келишмейди.

shuffle-indices-count-mismatch = shuffle ючюн берилген индексле эсге алынмайдыла, нек десенг аланы саны компонентлени санына келишмейди.

indices-ignored-out-of-range = { $component } ючюн берилген индексле эсге алынмайдыла, нек десенг бир къаууму чекден чыгъады.

pretzel-indices-repeated = pretzel ючюн берилген индексле эсге алынмайдыла, нек десенг бир къаууму къайтарылады.

pretzel-circuit-first-index = circuit халда pretzel ючюн берилген индексле эсге алынмайдыла, нек десенг биринчи индекс 1 болургъа керекди.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текст балала бла ишлер ючюн `type` атрибут берилирге керекди.

invalid-type-defaulting-to-math = { $component } компонент ючюн { $type } тюр тюз тюйюлдю. Ол math, text, number неда boolean болургъа керекди. math къолланылады.

string-not-valid-component-to-arrange = «{ $value }» тизгин { $component } ючюн джарарыкъ компонент тюйюлдю. Эсге алынмайды.

## Types and variables

invalid-type-defaulting-to-number = { $type } тюр тюз тюйюлдю, тюр number этилди.

invalid-variable-value = Тюрлениучюню тюз болмагъан къыйматы: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариант индекс сан болургъа керекди

variant-index-must-be-integer = { $index } вариант индекс бютеу сан болургъа керекди

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют ёлчемле ючюн этилмегенди. Кенгликле салыштырмалы этиледиле.

side-by-side-absolute-margins = `<{ $component }>` абсолют ёлчемле ючюн этилмегенди. Джанларындагъы аралыкъла салыштырмалы этиледиле.

side-by-side-no-block-child = Тюз болмагъан `<{ $component }>`: аны эм аз да бир блок баласы болургъа керекди.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элементдеги `for` атрибут эсге алынмайды.

label-for-must-resolve-to-one = `<label>` элементдеги `for` атрибут тюп-тюз бир компонентге кёргюзюрге керекди.

label-for-unresolved = `<label>` элементдеги `for` атрибутну компонент бла байларгъа болмады.

label-for-answer-with-authored-inputs = `<label>` элементдеги `for` атрибут автор кеси джазгъан кириу къырлары болгъан `<answer>` элементге кёргюзеди; къыргъа тюзюнлей кёргюзюгюз.

label-for-answer-without-input = `<label>` элементдеги `for` атрибут белгилерик кириу къыры болмагъан `<answer>` элементге кёргюзеди.

label-for-must-reference-input-or-answer = `<label>` элементдеги `for` атрибут кириу къыргъа неда джууапха кёргюзюрге керекди.

## Accessibility

accessibility-short-description-or-decorative = Джетимлилик ючюн `<{ $component }>` я къысха ангылатыугъа ие болургъа, я оюу халда белгиленирге керекди.

accessibility-video-short-description = Джетимлилик ючюн `<video>` къысха ангылатыугъа ие болургъа керекди.

accessibility-input-short-description-or-label = Джетимлилик ючюн `<{ $component }>` къысха ангылатыугъа неда белгиге ие болургъа керекди.

accessibility-answer-input-short-description-or-label = Джетимлилик ючюн кириу къыр къурагъан `<answer>` къысха ангылатыугъа неда белгиге ие болургъа керекди.

accessibility-short-description-contains-math = Къысха ангылатыулада `<{ $component }>` кибик математика компонентле болургъа керек тюйюлдюле. Математиканы сёзле бла джазыгъыз.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } бёлюмню башламыны текстине джетерик контраст бермейди (къарангы тема) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эм аз да { $threshold }:1 керекди).
       *[other] { $colorName } бёлюмню башламыны текстине джетерик контраст бермейди ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эм аз да { $threshold }:1 керекди).
    }

## `<circle>`

circle-through-points-non-numerical = Нокъталаны сан къыйматлары болмагъан халда { $count } нокътадан ётген `<circle>` этилмегенди.

circle-too-many-through-points = 3 нокътадан кёбюреги бла ётген тёгерекни санаргъа болмайды.

circle-overprescribed-radius-center-points = Радиусу, ара нокътасы эм ётген нокъталары бирден берилген тёгерекни санаргъа болмайды.

circle-center-with-multiple-points = Ара нокъталы тёгерекни 1 нокътадан кёбюреги бла ётдюрюп санаргъа болмайды.

circle-radius-too-small = Тёгерекни санаргъа болмайды: эки нокътаны арасы { $distance } болгъанда, берилген { $radius } радиус бек гитчеди.

circle-radius-with-many-points = Радиусу берилген тёгерекни эки нокътадан кёбюреги бла ётдюрюрге болмайды.

circle-invalid-center-or-through-points = Тёгерекни ара нокътасы неда ётген нокъталары тюз тюйюлдюле.

circle-radius-center-with-multiple-points = Ара нокъталы тёгерекни радиусун 1 нокътадан кёбюреги бла ётдюрюп санаргъа болмайды.

circle-change-radius-non-numerical = Сан къыйматлары болмагъан нокъталадан ётген тёгерекни радиусун тюрлендирирге болмайды

circle-radius-with-points-non-numerical = Сан къыйматла болмагъанда, радиусу берилген тёгерекни бир нокътадан кёбюреги бла ётдюрюрге болмайды.

circle-change-center-non-numerical = Сан къыйматлары болмагъан нокъталадан ётген тёгерекни ара нокътасын тюрлендириу этилмегенди.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцияны белгилениу тийресини ёлчеми джетишмейди. Тийреде { $intervals } аралыкъ барды, функцияда уа { $inputs ->
            [one] { $inputs } кириу
           *[other] { $inputs } кириу
        }.
       *[other] Функцияны белгилениу тийресини ёлчеми джетишмейди. Тийреде { $intervals } аралыкъ барды, функцияда уа { $inputs ->
            [one] { $inputs } кириу
           *[other] { $inputs } кириу
        }.
    }

function-domain-invalid-format = Функцияны белгилениу тийресини форматы тюз тюйюлдю.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцияны сан болмагъан эм уллу къыйматы эсге алынмайды.
        [minimum] Функцияны сан болмагъан эм гитче къыйматы эсге алынмайды.
        [extremum] Функцияны сан болмагъан экстремуму эсге алынмайды.
        [point] Функцияны сан болмагъан нокътасы эсге алынмайды.
        [slope] Функцияны сан болмагъан джантайыуу эсге алынмайды.
       *[other] Функцияны сан болмагъан { $type } къыйматы эсге алынмайды.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцияны бош эм уллу къыйматы эсге алынмайды.
        [minimum] Функцияны бош эм гитче къыйматы эсге алынмайды.
        [extremum] Функцияны бош экстремуму эсге алынмайды.
        [point] Функцияны бош нокътасы эсге алынмайды.
       *[other] Функцияны бош { $type } къыйматы эсге алынмайды.
    }

function-points-too-close = Функцияда орунлары бир бирине бек джууукъ эки нокъта барды. Функцияны белгилерге болмайды.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функцияны итерациялары кириулени саны чыгъыуланы санына тенг болгъанда къуру бола эдиле. Бу функцияда { $inputs } кириу бла { $outputs ->
            [one] { $outputs } чыгъыу барды
           *[other] { $outputs } чыгъыу барды
        }.
       *[other] Функцияны итерациялары кириулени саны чыгъыуланы санына тенг болгъанда къуру бола эдиле. Бу функцияда { $inputs } кириу бла { $outputs ->
            [one] { $outputs } чыгъыу барды
           *[other] { $outputs } чыгъыу барды
        }.
    }

## `<sequence>`

sequence-invalid-length = Тизмени узунлугъу тюз тюйюлдю. Ол терс болмагъан бютеу сан болургъа керекди.

sequence-invalid-step = Тизмени атламы тюз тюйюлдю. { $type } тюрлю тизме ючюн ол сан болургъа керекди.

sequence-invalid-endpoint-number = Сан тизмени «{ $attribute }» къыйматы тюз тюйюлдю. Ол сан болургъа керекди.

sequence-invalid-endpoint-letters = Харф тизмени «{ $attribute }» къыйматы тюз тюйюлдю. Ол харфланы къошулууу болургъа керекди.

sequence-invalid-endpoint = Тизмени «{ $attribute }» къыйматы тюз тюйюлдю.

select-from-sequence-coprime-not-numbers = санла сайланмагъаны себебли coprime эсге алынмайды

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations берилгени себебли coprime эсге алынмайды

## Resolving a `target`

target-not-found = `<{ $source }>` ючюн нишан тюз тюйюлдю: нишан табылмайды.

target-state-variable-not-found = `<{ $source }>` ючюн нишан тюз тюйюлдю: `<{ $component }>` элементде «{ $property }» атлы хал тюрлениучю табылмайды.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` элементни тюрлениучюлери кесиалдына тюрлениучюден башха болургъа керекдиле.

ode-system-duplicate-variable-names = Кёре тюрлениучюлени атлары къайтарылгъан ODE онг джанындагъы функцияланы белгилерге болмайды.

ode-system-rhs-function-error = ODE онг джанындагъы функцияны белгилерге болмайды. mathjs функцияны къурауда халат.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } сызыкъны арасында мюйюшню белгилерге болмайды

angle-invalid-through-point = `<angle>` элементни through къыйматында нокъта тюз тюйюлдю

parabola-vertex-too-many-points = Тёбеси берилген параболаны 1 нокътадан кёбюреги бла ётдюрюу этилмегенди.

parabola-too-many-points = 3 нокътадан кёбюреги бла ётген парабола этилмегенди.

intersection-too-many-items = Экиден кёб затны кесишиую этилмегенди

## Other math components

ionic-compound-not-two-ions = Эки иондан башха ион къошулуу этилмегенди.

ionic-compound-needs-cation-and-anion = Ион къошулуу къуру бир катион бла бир анион ючюн этилгенди.

solve-equations-cannot-evaluate = Тенгликни санаргъа болмагъаны себебли аны чечерге болмайды: { $equation }

math-operators-operand-number-required = Математика операндны чыгъаргъанда operandNumber берилирге керекди.

eigen-decomposition-failed = Матрицаны кесиалдына къыйматларын санаргъа болмады

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр оюуда тюбемейди, аны себебли ол хар заманда бош орунну табады.
       *[other] `<matchesPattern>`: { $parameters } параметрле оюуда тюбемейдиле, аны себебли ала хар заманда бош орунну табадыла.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ангылашынмайды. Ол none, medium, dense неда бош орун бла айырылгъан эки терс болмагъан сан болургъа керекди, сёз ючюн grid="1 0.5". Тор сызылмайды.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` ючюн { $expected ->
        [one] бир чыгъыуу — хар нокътада y' джантайыуу — болгъан функция керекди, сёз ючюн `y - x`
       *[other] эки чыгъыуу — хар нокътада вектор — болгъан функция керекди, сёз ючюн `(y, -x)`
    }, алай берилген функцияда { $found ->
        [one] { $found } чыгъыу барды
       *[other] { $found } чыгъыу барды
    }. { $alternative ->
        [none] Бир зат да сызылмайды.
       *[other] Ол функция ючюн `<{ $alternative }>` компонент джарайды. Бир зат да сызылмайды.
    }

field-function-attribute-ignored-with-child = `function` атрибут эсге алынмайды, нек десенг функция компонентни ичинде да берилгенди; ичиндеги къолланылады. Функцияны экисинден къуру биринде бериги.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибут компонентни ичинде тюзюнлей джазылгъан ангылатманы тюрлениучюлерин атайды. { $reason ->
        [function-child] Мында функция `<function>` бала халда берилгенди, ол а кеси тюрлениучюлерин атайды, аны себебли `variables` эсге алынмайды.
       *[no-expression] Мында алай джазылгъан ангылатма джокъду, аны себебли `variables` эсге алынмайды.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure кёргюзтюучюде xLabelPosition="left" джюрютюлмейди; онг джанындача этиледи.

prefigure-y-label-position-unsupported = `<graph>`: prefigure кёргюзтюучюде yLabelPosition="bottom" джюрютюлмейди; ёр джанындача этиледи.

prefigure-invalid-axis-bounds = `<graph>`: prefigure кёчюрюу ючюн осьланы чеклери тюз тюйюлдюле; сынгар bbox (-10,-10,10,10) къолланылады.

prefigure-invalid-width = `<graph>`: prefigure кёчюрюу ючюн кенглик тюз тюйюлдю; сынгар кенглик 425 къолланылады.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure кёчюрюу ючюн aspectRatio тюз тюйюлдю; сынгар джанлыкъ 1 къолланылады.

prefigure-grid-spacing-too-fine = `<graph>`: осьланы чеклерине кёре торну аралыкълары бек джукъадыла; prefigure кёргюзтюучюде тор сызылмайды.

prefigure-annotations-not-rendered = `<graph>`: PreFigure кёргюзтюучю къолланылмаса, эсгертиуле сызылмайдыла.

multiple-annotations-children = `<graph>` ичинде бир къауум `<annotations>` бала табылгъанды; ахыргъысындан къалгъанла эсге алынмайдыла.

## Referring to other components

copy-unrecognized-component-type = Танылмагъан компонент тюрню узайтыргъа неда кёчюрюрге болмайды: { $type }.

copy-prop-not-found = { $component } тюрлю компонентде { $property } проп табылмады

collect-no-source = collect ючюн къайнакъ табылмады.

collect-invalid-component-type = `<{ $component }>` тюрлю компонентлени джыяргъа болмайды, нек десенг ол тюз болмагъан компонент тюрдю.

reference-index-unavailable = `{ $reference }` индексге ссылка этерге болмайды

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентде { $action } чакъырыргъа болмайды

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Берилиулени формасы тюз тюйюлдю. Тизгинлени узунлукълары бирча тюйюлдюле. Табылгъан джери componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Берилиуледе багъаналаны атлары къайтарыладыла. Табылгъан джери componentIdx :{ $componentIdx }

data-frame-missing-column-name = Берилиуледе багъананы аты джокъду. Табылгъан джери componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Бу джууапны бир багъалауу answer тегни кеси джиберген джууабына таянады, ол а сакъланмагъан ишлеге келтирликди.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` болгъан контейнерни ичиндеги `<answer>` элементде `maxNumAttempts` салыуну хайыры джокъду, нек десенг сынауланы саны контейнерден белгиленеди. `maxNumAttempts` контейнерде салыгъыз.

nested-section-wide-check-work-max-num-attempts = Башха `sectionWideCheckWork` контейнерни ичинде тургъан `sectionWideCheckWork` контейнерде `maxNumAttempts` салыуну хайыры джокъду, нек десенг сынауланы саны тышындагъы контейнерден белгиленеди. `maxNumAttempts` тышындагъы контейнерде салыгъыз.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality салынмаса, { $attributes } атрибутну хайыры болмазлыкъды.
       *[other] symbolicEquality салынмаса, { $attributes } атрибутланы хайыры болмазлыкъды.
    }

answer-invalid-type = Джууапны тюрю тюз тюйюлдю: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентни аты болмагъаны себебли аны module атрибут ючюн къолланыргъа болмайды

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентни module ючюн атрибут халда къолланыргъа болмайды, нек десенг `<module>` компонент тюрде «{ $name }» атрибут алгъадан белгиленнгенди.

conditional-content-condition-ignored = case неда else балалары болгъан `<conditionalContent>` компонентде `condition` атрибут эсге алынмайды.

slider-markers-type-mismatch = Маркерлени тюрю слайдерни тюрюне келишмейди.

pretzel-problem-needs-statement-and-answer = Тюз болмагъан pretzel: хар `<problem>` ичинде бир `<statement>` бла бир `<answer>` болургъа керекди.

pretzel-circuit-first-problem-distractor = Тюз болмагъан pretzel: mode="circuit" болгъанда биринчи `<problem>` дистрактор болургъа болмайды.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибут ючюн { $values } къыймат тюз тюйюлдю; эсге алынмайды.
       *[other] `{ $attribute }` атрибут ючюн { $values } къыйматла тюз тюйюлдюле; эсге алынмайдыла.
    }

attribute-must-be-references = `{ $attribute }` атрибут ючюн `{ $value }` къыймат тюз тюйюлдю. Атрибут `$` бла башланнган ссылкаладан къуралыргъа керекди.

math-input-invalid-function-names = <mathInput>: { $attribute } ичинде тюз болмагъан функция атла эсге алынмадыла: { $names }. Хар атны кёргюзюлген кесеги эм аз да 2 белгиден (харфла неда тире) къуралыргъа керекди; ызындан `|<mathspeak alternative>` къошулургъа болады.

## Building components from the source

component-type-invalid = Тюз болмагъан компонент тюр: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутну къайтарыргъа болмайды.

attribute-invalid-for-component = `<{ $componentType }>` тюрлю компонент ючюн «{ $attribute }» атрибут тюз тюйюлдю.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль белгилеуде { $context ->
        [text-on-background] текстни тюрсюню бла фонну тюрсюню
        [high-contrast] бийик контрастлы тюрсюн бла сурат майдан
        [line] сызыкъны тюрсюню бла сурат майдан
        [marker] маркерни тюрсюню бла сурат майдан
       *[text-on-canvas] текстни тюрсюню бла сурат майдан
    } арасында контраст джетишмейди{ $mode ->
        [dark] { " (къарангы тема)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эм аз да { $threshold }:1 керекди).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль белгилеуде джарыкъ тема ючюн джетерик контраст берген тюрсюнле берилген эселе да, ол къыйматладан чыгъарылгъан къарангы тема тюрсюнледе текстни тюрсюню бла фонну тюрсюнюню арасында контраст джетишмейди ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эм аз да { $threshold }:1 керекди). { $suggestion ->
        [available] Къарангы темада контраст джетерик болур ючюн, я джарыкъ теманы контрастын кёбейтигиз (сёз ючюн { $lightAttribute }="{ $lightColor }" салыгъыз), я къарангы теманы тюрсюнюн кесигиз белгилегиз (сёз ючюн { $darkAttribute }="{ $darkColor }" салыгъыз).
       *[none] Къарангы темада контраст джетерик болур ючюн, джарыкъ теманы контрастын кёбейтигиз неда чыгъарылгъан тюрсюнлени textColorDarkMode эмда/неда backgroundColorDarkMode бла алмаштырыгъыз.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль белгилеуде джарыкъ тема ючюн джетерик контраст берген текст тюрсюн берилген эсе да, ол къыйматдан чыгъарылгъан къарангы тема текст тюрсюню сурат майдан бла джетерик контраст бермейди ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эм аз да { $threshold }:1 керекди). { $suggestion ->
        [available] Къарангы темада контраст джетерик болур ючюн, я джарыкъ теманы контрастын кёбейтигиз (сёз ючюн textColor="{ $lightColor }" салыгъыз), я къарангы теманы тюрсюнюн кесигиз белгилегиз (сёз ючюн textColorDarkMode="{ $darkColor }" салыгъыз).
       *[none] Къарангы темада контраст джетерик болур ючюн, джарыкъ теманы контрастын кёбейтигиз неда чыгъарылгъан тюрсюнню textColorDarkMode бла алмаштырыгъыз.
    }

section-multiple-style-palettes = Бир бёлюм къуру бир <stylePalette> сайларгъа болады; ахыргъысы къолланылады.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } компонентни энчи вариантларын белгилерге болмайды, нек десенг numToSelect терс болмагъан бютеу сан тюйюлдю.

variant-num-to-select-not-constant-number = { $component } компонентни энчи вариантларын белгилерге болмайды, нек десенг numToSelect тохташхан сан тюйюлдю.

variant-with-replacement-not-constant-boolean = { $component } компонентни энчи вариантларын белгилерге болмайды, нек десенг withReplacement тохташхан boolean тюйюлдю.

variant-select-weight-disables-unique = selectWeight неда selectForVariants берилген вариант болса, select ючюн энчи вариантла джабыладыла

variant-coprime-undetermined = { $component } компонентни энчи вариантларын белгилерге болмайды, нек десенг coprime хар заманда терс болгъанын белгилерге болмайды.

variant-attribute-not-constant = { $component } компонентни энчи вариантларын белгилерге болмайды, нек десенг { $attribute } тохташхан тюйюлдю.

variant-attribute-not-number = { $component } компонентни энчи вариантларын белгилерге болмайды, нек десенг { $attribute } сан тюйюлдю.

variant-attribute-wrong-type-for-sequence =
    { $type } тюрлю { $component } компонентни энчи вариантларын белгилерге болмайды, нек десенг { $attribute } { $expected ->
        [letters-combination] харфланы къошулуулары
        [math-expression] тюз математика ангылатма
        [integer] бютеу сан
       *[number] сан
    } тюйюлдю.

variant-length-not-integer = { $component } компонентни энчи вариантларын белгилерге болмайды, нек десенг length бютеу сан тюйюлдю.

variant-sort-not-implemented = sort болгъан { $component } компонентни энчи вариантлары этилмегендиле

variant-exclude-combinations-not-implemented = excludeCombinations болгъан { $component } компонентни энчи вариантлары этилмегендиле

variant-math-exclude-not-implemented = exclude болгъан math тюрлю { $component } компонентни энчи вариантлары этилмегендиле

variant-non-constant-exclude-not-implemented = тохташмагъан exclude болгъан { $component } компонентни энчи вариантлары этилмегендиле

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure кёргюзтюучюде джюрютюлмейди; туудукъ элемент кетерилди.

prefigure-descendant-invalid-geometry = { $subject }: геометриясы толу тюйюлдю неда чекленмегенди; туудукъ элемент кетерилди.

prefigure-curve-label-omitted = { $subject }: кёчюрюлген къынгыр сызыкъ элементледе белгиле джюрютюлмейдиле; белги кетерилди.

prefigure-curve-unsupported-definition-type = { $subject }: къынгыр сызыкъ функцияны белгилеу тюрю «{ $definitionType }» джюрютюлмейди; туудукъ элемент кетерилди.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементде flipFunctions атрибут джюрютюлмейди; туудукъ элемент кетерилди.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves элементде къуру формула тюрлю бала функцияла джюрютюледиле; туудукъ элемент кетерилди.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] сызыкъ къауумну белгиси
       *[point] нокътаны белгиси
    } ючюн labelPosition «{ $labelPosition }» джюрютюлмейди; PreFigure кесини сынгар тюзетиую къолланылады.

prefigure-fill-style-unsupported = { $subject }: PreFigure «{ $fillStyle }» боялыу тюрню джюрютмейди; толу боялыу къолланылады.

prefigure-line-style-unknown = { $subject }: танылмагъан «{ $lineStyle }» сызыкъ тюр PreFigure чыгъарыудан кетерилди.

prefigure-marker-style-mapped-to-diamond = { $subject }: «{ $markerStyle }» маркер тюр PreFigure «diamond» тюрюне кёчюрюлдю.

prefigure-marker-style-unsupported = { $subject }: PreFigure «{ $markerStyle }» маркер тюрню джюрютмейди; сынгар тюр къолланылады.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` тюз тюйюлдю; нишан табылмайды. Эсгертиу кетерилди.

annotation-ref-multiple-targets = `<annotation>`: `ref` бир къауум нишан тапды; биринчиси къолланылады.

annotation-ref-outside-graph = `<annotation>`: `ref` тюз тюйюлдю; нишан кесин тутхан graph элементни тышындады. Эсгертиу кетерилди.

annotation-ref-unsupported-target = `<annotation>`: `ref` тюз тюйюлдю; нишан prefigure кёчюрюуде джюрютюлген график зат тюйюлдю. Эсгертиу кетерилди.

annotation-text-missing = `<annotation>`: `text` джокъду неда бошду; бош текст чыгъарылады.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Тёгерек байламлыкъ табылды.
       *[other] `<{ $componentType }>` компонент къошулгъан тёгерек байламлыкъ табылды.
    }

reference-no-referent = Ссылка ючюн зат табылмады: `{ $reference }`

reference-multiple-referents = Ссылка ючюн бир къауум зат табылды: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементни { $attribute } атрибутуну форматы тюз тюйюлдю.

children-invalid = `<{ $componentType }>` ючюн балала тюз тюйюлдюле: тюз болмагъан балала табылдыла: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибут ючюн `{ $value }` къыймат тюз тюйюлдю, `{ $default }` къыймат къолланылады

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версия табылмады.
       *[other] DoenetML { $version } версия табылмады. { $fallback } версиягъа кёчюледи
    }

## Reading the DoenetML

parse-invalid-doenetml = Тюз болмагъан DoenetML: { $content }

parse-tag-missing-close-tag = Тюз болмагъан DoenetML: `{ $tag }` тегни джабыучу теги джокъду. Кесин джабхан тег неда `</{ $tagName }>` тег керек эди.

parse-tag-error = Тюз болмагъан DoenetML: `<{ $tagName }>` тегде халат

parse-attribute-missing-value = Тюз болмагъан DoenetML: `{ $attribute }` атрибут тюз тюйюлдю, къыйматы джокъгъа ушайды.

parse-attribute-invalid = Тюз болмагъан DoenetML: `{ $attribute }` атрибут тюз тюйюлдю

parse-attribute-value-invalid = Тюз болмагъан DoenetML: `{ $value }` атрибут къыймат тюз тюйюлдю

parse-attribute-value-quote-mismatch = Тюз болмагъан DoenetML: `{ $value }` атрибут къыймат тюз тюйюлдю. Тырнакъла келишмейдиле. Бир `{ $quote }` джетишмегенге ушайды

parse-open-tag-name-missing = Тюз болмагъан DoenetML: аты болмагъан тег табылды, сёз ючюн `<`

parse-tag-not-closed = Тюз болмагъан DoenetML: `{ $tag }` тег джабылмагъанды (бир `>` джетишмегенге ушайды).

parse-self-closing-tag-name-missing = Тюз болмагъан DoenetML: аты болмагъан тег табылды `<{ $content }>`

parse-self-closing-tag-not-closed = Тюз болмагъан DoenetML: `{ $tag }` тег джабылмагъанды (`/>` джетишмегенге ушайды).

parse-tag-invalid-attributes = Тюз болмагъан DoenetML: `{ $tag }` тег тюз тюйюлдю. Атрибутлары терс болургъа боладыла.

parse-close-tag-name-missing = Тюз болмагъан DoenetML: аты болмагъан джабыучу тег табылды, сёз ючюн `</`

parse-attribute-value-unquoted = Атрибутланы къыйматлары тырнакъланы ичине алыныргъа керекдиле: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Тюз болмагъан DoenetML: `{ $tag }` джабыучу тег табылды, алай ачыучу теги джокъду

parse-close-tag-mismatched = Тюз болмагъан DoenetML: джабыучу тег келишмейди. `</{ $expected }>` керек эди. `{ $found }` табылды

parser-node-unconvertible = { $node } тюйюмню Dast тюйюмге кёчюрюрге болмады.

## Names

name-attribute-invalid =
    Тюз болмагъан атрибут name='{ $name }'. { $reason ->
        [characters] Атлада къуру харфла, санла, тюб тирела неда тирела болургъа боладыла.
       *[start] Атла харф бла башланыргъа керекдиле.
    }

component-name-invalid-start = «{ $name }» компонент ат тюз тюйюлдю. Атла харф бла башланыргъа керекдиле.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched тюрлю джууапны video атрибуту болургъа керекди

answer-video-watched-video-not-reference = videoWatched тюрлю джууапны video атрибуту ссылка болургъа керекди

answer-name-not-single-text = Джууапны name атрибутуну бир текст баласы болургъа керекди

## Referencing another document

external-doenetml-recursion-limit = Тышындагъы DoenetML алыныргъа болмады, рекурсияны къатлары бек кёбдюле. Тёгерек ссылка бармыды?

external-doenetml-unavailable = { $attribute }="{ $uri }" джерден DoenetML алыныргъа болмады

external-doenetml-type-mismatch = { $attribute }="{ $uri }" джерден алыннган DoenetML тюз тюйюлдю: ол «{ $componentType }» компонент тюрге келишмеди

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут эскиргенди; аны орнуна `{ $to }` къолланыгъыз.
       *[other] [deprecation] `<{ $component }>` элементде `{ $from }` атрибут эскиргенди; аны орнуна `{ $to }` къолланыгъыз.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут эскиргенди эм эсге алынмайды, нек десенг `{ $to }` да берилгенди.
       *[other] [deprecation] `<{ $component }>` элементде `{ $from }` атрибут эскиргенди эм эсге алынмайды, нек десенг `{ $to }` да берилгенди.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементде `{ $attribute }` атрибут эскиргенди эм эсге алынмайды.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элементде `{ $attribute }` атрибут эскиргенди; аны орнуна `<{ $child }>` бала къолланыгъыз.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элементде `{ $attribute }` атрибутну `{ $value }` къыйматы эскиргенди; аны орнуна `{ $to }` къолланыгъыз.


## Language coverage

pluralize-english-only = `<pluralize>` къуру ингилиз сёзлени кёблюк санына кёчюрюрге болады, аны себебли { $locale } тилде джазылгъан документде аны тексти тюрленмей къалады. Кёблюк формасын кесигиз джазыгъыз неда `pluralForm` атрибут бла белгилегиз.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент танылгъан Doenet элемент тюйюлдю.

schema-element-not-allowed-at-root = `<{ $tag }>` элементге документни тамырында эркинлик джокъду.

schema-element-not-allowed-inside = `<{ $tag }>` элементге `<{ $parent }>` ичинде эркинлик джокъду.

schema-attribute-unrecognized = `<{ $tag }>` элементни `{ $attribute }` атлы атрибуту джокъду.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементни `{ $attribute }` атрибуту тизме болургъа керекди, аны хар кесеги уа буладан бири: { $allowed }
       *[other] `<{ $tag }>` элементни `{ $attribute }` атрибуту буладан бири болургъа керекди: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select ючюн вариантны аты тюз тюйюлдю. { $variantName } вариант ат { $numOptions } вариантда тюбейди, сайланырыкъны саны уа { $numToSelect }.

select-variant-name-without-options = select ючюн бир къауум вариант берилгенди, алай { $variantName } боллукъ вариант ат ючюн вариантла берилмегендиле.

select-variant-name-not-possible = select ючюн берилген { $variantName } вариант ат боллукъ вариант ат тюйюлдю.

select-too-few-options = { $numOptions } компонентден { $numToSelect } компонент сайларгъа болмайды.

select-from-sequence-too-few-values = Узунлугъу { $length } болгъан тизмеден { $numToSelect } къыймат сайларгъа болмайды.

select-from-sequence-indices-count-mismatch = select ючюн берилген индекслени саны сайланырыкъны санына келиширге керекди

select-from-sequence-indices-not-integers = select ючюн берилген индекслени барысы да бютеу санла болургъа керекдиле

select-from-sequence-index-excluded = selectfromsequence ючюн берилген индекс тышында къалдырылгъанды

select-from-sequence-indices-excluded-combination = selectfromsequence ючюн берилген индексле тышында къалдырылгъан къошулуу эдиле

select-from-sequence-coprime-not-positive-integers = терс болмагъан бютеу санла сайланмагъаны себебли ортакъ бёлюучюсю болмагъан къошулууланы сайларгъа болмайды.

select-from-sequence-coprime-common-factor = Ортакъ бёлюучюсю болмагъан санланы сайларгъа болмайды. Боллукъ къыйматланы барысыны да ортакъ бёлюучюсю барды. (Берилген "from" неда "to" къыйматланы "step" бла ортакъ бёлюучюлери болмазгъа керекди.)

select-from-sequence-coprime-single-number = 1 болмагъан джангыз сандан ортакъ бёлюучюсю болмагъан къошулууланы сайларгъа болмайды.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ичинде къошулууланы 70%-ден кёбюрегин тышында къалдыргъанды

select-from-sequence-coprime-none-found = Ортакъ бёлюучюсю болмагъан санла сайланмадыла. Боллукъ къыйматланы барысыны да ортакъ бёлюучюсю барды.

select-from-sequence-too-few-unique-values = Узунлугъу { $numPossibleValues } болгъан тизмеден { $numToSelect } энчи къыймат сайларгъа болмайды

select-prime-numbers-too-few-values = Узунлугъу { $numValues } болгъан баш санланы тизмесинден { $numToSelect } къыймат сайларгъа болмайды

select-prime-numbers-values-count-mismatch = select ючюн берилген къыйматланы саны сайланырыкъны санына келиширге керекди

select-prime-numbers-values-not-prime = select ючюн берилген баш санланы барысы да баш санланы тизмесинде болургъа керекдиле

select-prime-numbers-values-excluded-combination = selectPrimeNumbers ючюн берилген къыйматла тышында къалдырылгъан къошулуу эдиле

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ичинде къошулууланы 70%-ден кёбюрегин тышында къалдыргъанды

select-random-combination-fluke = Бек аз тюбеген иш болуб, эркин къыйматланы къошулууу сайланмады

select-random-value-fluke = Бек аз тюбеген иш болуб, эркин къыймат сайланмады
