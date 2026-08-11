# Bashkir diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# The technical vocabulary here is largely Russian, which is what written
# Bashkir itself uses for it: «компонент», «атрибут», «функция», «индекс».
# What is Bashkir is the grammar around them and the everyday words —
# «табылманы», «иҫәпкә алынмай», «булырға тейеш».
#
# Bashkir counts in the same two categories English does, so every selection
# below keeps both branches — but a noun after a numeral stays singular, so the
# two usually differ only in the number they print.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] ике осло нөктә лә бирелгәндә { $attributes } иҫәпкә алынмай
       *[other] ике осло нөктә лә бирелгәндә { $attributes } иҫәпкә алынмай
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] осло нөктә лә, урта нөктә лә бирелгәндә { $attributes } иҫәпкә алынмай
       *[other] осло нөктә лә, урта нөктә лә бирелгәндә { $attributes } иҫәпкә алынмай
    }

line-segment-midpoint-offset-without-midpoint = урта нөктәһеҙ midpointOffset бер нәмәгә лә тәьҫир итмәй

## `<line>`

line-points-undetermined-dimensions = Үлсәме билдәһеҙ нөктәләр аша үтеүсе тура һыҙыҡ.

line-points-too-few-dimensions = Тура һыҙыҡ кәм тигәндә ике үлсәмле нөктәләр аша үтергә тейеш.

line-points-depend-on-variables = Тура һыҙыҡ үҙгәреүсәндәргә бәйле нөктәләр аша үтә: { $variables }.

line-equation-invalid-format = { $variable1 } һәм { $variable2 } үҙгәреүсәндәрендәге тура һыҙыҡ тигеҙләмәһенең форматы дөрөҫ түгел.

## `<ray>`

ray-overprescribed-through = Нур through, endpoint һәм direction аша бирелгән. Бирелгән through иҫәпкә алынмай.

ray-dimension-mismatch = нурҙа numDimensions тап килмәй.

## `<vector>`

vector-overprescribed-head = Вектор head, tail һәм displacement аша бирелгән. Бирелгән head иҫәпкә алынмай.

vector-dimension-mismatch = векторҙа numDimensions тап килмәй.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элементына тартып булмай, сөнки уның nearestPoint хәл үҙгәреүсәне юҡ.

constrain-to-without-nearest-point = `<{ $component }>` элементы менән сикләп булмай, сөнки уның nearestPoint хәл үҙгәреүсәне юҡ.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементының эсе менән сикләп булмай, сөнки уның nearestPoint хәл үҙгәреүсәне юҡ.

## `<choiceInput>`

choice-input-label-position-ignored = юл эсендә булмаған choiceInput өсөн labelPosition иҫәпкә алынмай

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput өсөн бирелгән индекстар иҫәпкә алынмай, сөнки уларҙың һаны choice балаларының һанына тап килмәй.

pretzel-indices-count-mismatch = problem өсөн бирелгән индекстар иҫәпкә алынмай, сөнки уларҙың һаны problem балаларының һанына тап килмәй.

shuffle-indices-count-mismatch = shuffle өсөн бирелгән индекстар иҫәпкә алынмай, сөнки уларҙың һаны компоненттар һанына тап килмәй.

indices-ignored-out-of-range = { $component } өсөн бирелгән индекстар иҫәпкә алынмай, сөнки ҡайһы берҙәре сиктәрҙән сыға.

pretzel-indices-repeated = pretzel өсөн бирелгән индекстар иҫәпкә алынмай, сөнки ҡайһы берҙәре ҡабатлана.

pretzel-circuit-first-index = circuit режимында pretzel өсөн бирелгән индекстар иҫәпкә алынмай, сөнки беренсе индекс 1 булырға тейеш.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текст балалары менән эшләһен өсөн `type` атрибуты бирелергә тейеш.

invalid-type-defaulting-to-math = { $component } компоненты өсөн дөрөҫ булмаған төр { $type }. Ул math, text, number йәки boolean булырға тейеш. math ҡулланыла.

string-not-valid-component-to-arrange = «{ $value }» юлы { $component } өсөн яраҡлы компонент түгел. Иҫәпкә алынмай.

## Types and variables

invalid-type-defaulting-to-number = Дөрөҫ булмаған төр { $type }, төр number итеп ҡуйыла.

invalid-variable-value = Үҙгәреүсәндең дөрөҫ булмаған ҡиммәте: `{ $value }`

## Variants

variant-index-must-be-number = Вариант индексы { $index } һан булырға тейеш

variant-index-must-be-integer = Вариант индексы { $index } бөтөн һан булырға тейеш

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют үлсәмдәр өсөн ғәмәлгә ашырылмаған. Киңлектәр сағыштырмаса була.

side-by-side-absolute-margins = `<{ $component }>` абсолют үлсәмдәр өсөн ғәмәлгә ашырылмаған. Ҡыр буйҙары сағыштырмаса була.

side-by-side-no-block-child = Дөрөҫ булмаған `<{ $component }>`: уның кәм тигәндә бер блок балаһы булырға тейеш.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элементындағы `for` атрибуты иҫәпкә алынмай.

label-for-must-resolve-to-one = `<label>` элементындағы `for` атрибуты тап бер компонентҡа күрһәтергә тейеш.

label-for-unresolved = `<label>` элементындағы `for` атрибутын компонент менән бәйләп булманы.

label-for-answer-with-authored-inputs = `<label>` элементындағы `for` атрибуты автор яҙған керетеү ҡырҙары булған `<answer>` элементына күрһәтә; ҡырға тураға күрһәтегеҙ.

label-for-answer-without-input = `<label>` элементындағы `for` атрибуты билдәләнәсәк керетеү ҡыры булмаған `<answer>` элементына күрһәтә.

label-for-must-reference-input-or-answer = `<label>` элементындағы `for` атрибуты керетеү ҡырына йәки яуапҡа күрһәтергә тейеш.

## Accessibility

accessibility-short-description-or-decorative = Ҡулайлылыҡ өсөн `<{ $component }>` йә ҡыҫҡа тасуирламаға эйә булырға, йә биҙәк булараҡ билдәләнергә тейеш.

accessibility-video-short-description = Ҡулайлылыҡ өсөн `<video>` ҡыҫҡа тасуирламаға эйә булырға тейеш.

accessibility-input-short-description-or-label = Ҡулайлылыҡ өсөн `<{ $component }>` ҡыҫҡа тасуирламаға йәки билдәгә эйә булырға тейеш.

accessibility-answer-input-short-description-or-label = Ҡулайлылыҡ өсөн керетеү ҡыры булдырыусы `<answer>` ҡыҫҡа тасуирламаға йәки билдәгә эйә булырға тейеш.

accessibility-short-description-contains-math = Ҡыҫҡа тасуирламаларҙа `<{ $component }>` кеүек математик компоненттар булырға тейеш түгел. Математиканы һүҙҙәр менән яҙығыҙ.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } бүлек башламы тексы өсөн етерлек контраст бирмәй (ҡараңғы тема) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кәм тигәндә { $threshold }:1 кәрәк).
       *[other] { $colorName } бүлек башламы тексы өсөн етерлек контраст бирмәй ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кәм тигәндә { $threshold }:1 кәрәк).
    }

## `<circle>`

circle-through-points-non-numerical = Нөктәләрҙең һан ҡиммәттәре булмағанда { $count } нөктә аша үтеүсе `<circle>` ғәмәлгә ашырылмаған.

circle-too-many-through-points = 3-тән артыҡ нөктә аша үтеүсе әйләнәне иҫәпләп булмай.

circle-overprescribed-radius-center-points = Бирелгән радиус, үҙәк һәм нөктәләр менән әйләнәне иҫәпләп булмай.

circle-center-with-multiple-points = Бирелгән үҙәк менән 1-ҙән артыҡ нөктә аша үтеүсе әйләнәне иҫәпләп булмай.

circle-radius-too-small = Әйләнәне иҫәпләп булмай: ике нөктә араһындағы алыҫлыҡ { $distance } булғанға, бирелгән радиус { $radius } артыҡ бәләкәй.

circle-radius-with-many-points = Бирелгән радиус менән икенән артыҡ нөктә аша үтеүсе әйләнә төҙөп булмай.

circle-invalid-center-or-through-points = Әйләнәнең үҙәге йәки нөктәләре дөрөҫ түгел.

circle-radius-center-with-multiple-points = Бирелгән үҙәк менән 1-ҙән артыҡ нөктә аша үтеүсе әйләнәнең радиусын иҫәпләп булмай.

circle-change-radius-non-numerical = Һан булмаған нөктәле әйләнәнең радиусын үҙгәртеп булмай

circle-radius-with-points-non-numerical = Һан ҡиммәттәре булмағанда бирелгән радиус менән бертәнән артыҡ нөктә аша үтеүсе әйләнә төҙөп булмай.

circle-change-center-non-numerical = Һан булмаған нөктәләр аша үтеүсе әйләнәнең үҙәген үҙгәртеү ғәмәлгә ашырылмаған.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцияның билдәләнеү өлкәһенең үлсәме етерлек түгел. Өлкәлә { $intervals } аралыҡ бар, ә функцияла { $inputs ->
            [one] { $inputs } инеш
           *[other] { $inputs } инеш
        }.
       *[other] Функцияның билдәләнеү өлкәһенең үлсәме етерлек түгел. Өлкәлә { $intervals } аралыҡ бар, ә функцияла { $inputs ->
            [one] { $inputs } инеш
           *[other] { $inputs } инеш
        }.
    }

function-domain-invalid-format = Функцияның билдәләнеү өлкәһенең форматы дөрөҫ түгел.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцияның һан булмаған максимумы иҫәпкә алынмай.
        [minimum] Функцияның һан булмаған минимумы иҫәпкә алынмай.
        [extremum] Функцияның һан булмаған экстремумы иҫәпкә алынмай.
        [point] Функцияның һан булмаған нөктәһе иҫәпкә алынмай.
        [slope] Функцияның һан булмаған ауышлығы иҫәпкә алынмай.
       *[other] Функцияның һан булмаған { $type } ҡиммәте иҫәпкә алынмай.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцияның буш максимумы иҫәпкә алынмай.
        [minimum] Функцияның буш минимумы иҫәпкә алынмай.
        [extremum] Функцияның буш экстремумы иҫәпкә алынмай.
        [point] Функцияның буш нөктәһе иҫәпкә алынмай.
       *[other] Функцияның буш { $type } ҡиммәте иҫәпкә алынмай.
    }

function-points-too-close = Функцияла бер-береһенә артыҡ яҡын ике нөктә бар. Функцияны билдәләп булмай.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функция итерациялары инештәр һаны сығыштар һанына тигеҙ булғанда ғына мөмкин. Был функцияла { $inputs } инеш һәм { $outputs ->
            [one] { $outputs } сығыш
           *[other] { $outputs } сығыш
        } бар.
       *[other] Функция итерациялары инештәр һаны сығыштар һанына тигеҙ булғанда ғына мөмкин. Был функцияла { $inputs } инеш һәм { $outputs ->
            [one] { $outputs } сығыш
           *[other] { $outputs } сығыш
        } бар.
    }

## `<sequence>`

sequence-invalid-length = Эҙмә-эҙлектең оҙонлоғо дөрөҫ түгел. Ул кире булмаған бөтөн һан булырға тейеш.

sequence-invalid-step = Эҙмә-эҙлектең аҙымы дөрөҫ түгел. { $type } төрөндәге эҙмә-эҙлек өсөн ул һан булырға тейеш.

sequence-invalid-endpoint-number = Һан эҙмә-эҙлегенең «{ $attribute }» ҡиммәте дөрөҫ түгел. Ул һан булырға тейеш.

sequence-invalid-endpoint-letters = Хәреф эҙмә-эҙлегенең «{ $attribute }» ҡиммәте дөрөҫ түгел. Ул хәрефтәр комбинацияһы булырға тейеш.

sequence-invalid-endpoint = Эҙмә-эҙлектең «{ $attribute }» ҡиммәте дөрөҫ түгел.

select-from-sequence-coprime-not-numbers = һандар һайланмағанға coprime иҫәпкә алынмай

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations бирелгәнгә coprime иҫәпкә алынмай

## Resolving a `target`

target-not-found = `<{ $source }>` өсөн дөрөҫ булмаған target: маҡсат табылманы.

target-state-variable-not-found = `<{ $source }>` өсөн дөрөҫ булмаған target: `<{ $component }>` элементында «{ $property }» исемле хәл үҙгәреүсәне табылманы.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` үҙгәреүсәндәре бойондороҡһоҙ үҙгәреүсәндән айырылырға тейеш.

ode-system-duplicate-variable-names = Бәйле үҙгәреүсәндәрҙең ҡабатланыусы исемдәре менән ДТ уң яҡ функцияларын билдәләп булмай.

ode-system-rhs-function-error = ДТ уң яҡ функцияһын билдәләп булмай. mathjs функцияһын төҙөгәндә хата.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } тура һыҙыҡ араһындағы мөйөштө билдәләп булмай

angle-invalid-through-point = `<angle>` элементының through ҡиммәтендә дөрөҫ булмаған нөктә

parabola-vertex-too-many-points = Бирелгән түбә менән 1-ҙән артыҡ нөктә аша үтеүсе парабола ғәмәлгә ашырылмаған.

parabola-too-many-points = 3-тән артыҡ нөктә аша үтеүсе парабола ғәмәлгә ашырылмаған.

intersection-too-many-items = Икенән артыҡ объекттың киҫешеүе ғәмәлгә ашырылмаған

## Other math components

ionic-compound-not-two-ions = Ике иондан башҡа ион ҡушылмалары ғәмәлгә ашырылмаған.

ionic-compound-needs-cation-and-anion = Ион ҡушылмалары бер катион һәм бер анион өсөн генә ғәмәлгә ашырылған.

solve-equations-cannot-evaluate = Тигеҙләмәне сисеп булмай, сөнки уны иҫәпләп булманы: { $equation }

math-operators-operand-number-required = Математик операндты айырып алыу өсөн operandNumber бирелергә тейеш.

eigen-decomposition-failed = Матрицаның үҙ ҡиммәттәрен иҫәпләп булманы

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметры өлгөлә осрамай, шуға күрә ул һәр ваҡыт бушҡа тап килә.
       *[other] `<matchesPattern>`: { $parameters } параметрҙары өлгөлә осрамай, шуға күрә улар һәр ваҡыт бушҡа тап килә.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ҡиммәтен аңлатып булмай. Ул none, medium, dense йәки буш урын менән айырылған ике ыңғай һан булырға тейеш, мәҫәлән grid="1 0.5". Селтәр һыҙылмай.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure һүрәтләүсеһендә xLabelPosition="left" ҡаралмаған; уң урынлашыу тәртибе ҡулланыла.

prefigure-y-label-position-unsupported = `<graph>`: prefigure һүрәтләүсеһендә yLabelPosition="bottom" ҡаралмаған; өҫкө урынлашыу тәртибе ҡулланыла.

prefigure-invalid-axis-bounds = `<graph>`: prefigure әйләндереүе өсөн күсәрҙәр сиктәре дөрөҫ түгел; килешеү буйынса bbox (-10,-10,10,10) ҡулланыла.

prefigure-invalid-width = `<graph>`: prefigure әйләндереүе өсөн киңлек дөрөҫ түгел; диаграмманың килешеү буйынса киңлеге 425 ҡулланыла.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure әйләндереүе өсөн aspectRatio дөрөҫ түгел; килешеү буйынса яҡтар нисбәте 1 ҡулланыла.

prefigure-grid-spacing-too-fine = `<graph>`: селтәр аҙымы күсәрҙәр сиктәре өсөн артыҡ ваҡ; prefigure һүрәтләүсеһендә селтәр ҡалдырыла.

prefigure-annotations-not-rendered = `<graph>`: PreFigure һүрәтләүсеһе ҡулланылмағанда иҫкәрмәләр һыҙылмай.

multiple-annotations-children = `<graph>` эсендә бер нисә `<annotations>` балаһы табылды; һуңғыһынан башҡалары иҫәпкә алынмай.

## Referring to other components

copy-unrecognized-component-type = Танылмаған компонент төрөн киңәйтеп йәки күсереп булмай: { $type }.

copy-prop-not-found = { $component } төрөндәге компонентта { $property } үҙенсәлеге табылманы

collect-no-source = collect өсөн сығанаҡ табылманы.

collect-invalid-component-type = `<{ $component }>` төрөндәге компоненттарҙы йыйып булмай, сөнки был дөрөҫ булмаған компонент төрө.

reference-index-unavailable = `{ $reference }` индексына һылтанма яһап булмай

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентында { $action } саҡырып булмай

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Мәғлүмәттәрҙең формаһы дөрөҫ түгел. Юлдарҙың оҙонлоҡтары төрлө. Табылды componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Мәғлүмәттәрҙә ҡабатланыусы бағана исемдәре бар. Табылды componentIdx :{ $componentIdx }

data-frame-missing-column-name = Мәғлүмәттәрҙә бағана исеме етмәй. Табылды componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Был яуаптың award ҡиммәте answer тегының үҙ ебәрелгән яуабына нигеҙләнә, был көтөлмәгән тәртипкә килтерә.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` булған контейнер эсендәге `<answer>` элементына `maxNumAttempts` ҡуйыу тәьҫир итмәй, сөнки омтылыштар һанын контейнер билдәләй. `maxNumAttempts` ҡиммәтен контейнерға ҡуйығыҙ.

nested-section-wide-check-work-max-num-attempts = Башҡа `sectionWideCheckWork` контейнеры эсендә торған `sectionWideCheckWork` контейнерына `maxNumAttempts` ҡуйыу тәьҫир итмәй, сөнки омтылыштар һанын тышҡы контейнер билдәләй. `maxNumAttempts` ҡиммәтен тышҡы контейнерға ҡуйығыҙ.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality ҡуйылмаһа, { $attributes } атрибуты тәьҫир итмәйәсәк.
       *[other] symbolicEquality ҡуйылмаһа, { $attributes } атрибуттары тәьҫир итмәйәсәк.
    }

answer-invalid-type = answer өсөн дөрөҫ булмаған төр: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентының исеме булмағанға, уны модуль атрибуты итеп ҡулланып булмай

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентын модуль атрибуты итеп ҡулланып булмай, сөнки `<module>` компонент төрөндә «{ $name }» атрибуты инде билдәләнгән.

conditional-content-condition-ignored = case йәки else балалары булған `<conditionalContent>` компонентында `condition` атрибуты иҫәпкә алынмай.

slider-markers-type-mismatch = Маркерҙарҙың төрө шыуҙырғыстың төрөнә тап килмәй.

pretzel-problem-needs-statement-and-answer = Дөрөҫ булмаған pretzel: һәр `<problem>` бер `<statement>` һәм бер `<answer>` эсенә алырға тейеш.

pretzel-circuit-first-problem-distractor = Дөрөҫ булмаған pretzel: mode="circuit" режимында беренсе `<problem>` иғтибарҙы ситкә йүнәлтеүсе була алмай.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибуты өсөн дөрөҫ булмаған ҡиммәт { $values }; иҫәпкә алынмай.
       *[other] `{ $attribute }` атрибуты өсөн дөрөҫ булмаған ҡиммәттәр { $values }; иҫәпкә алынмай.
    }

attribute-must-be-references = `{ $attribute }` атрибуты өсөн дөрөҫ булмаған ҡиммәт `{ $value }`. Атрибут `$` менән башланыусы һылтанмаларҙан торорға тейеш.

math-input-invalid-function-names = <mathInput>: { $attribute } эсендәге дөрөҫ булмаған функция исемдәре иҫәпкә алынманы: { $names }. Һәр исемдең күрһәтелә торған өлөшө кәм тигәндә 2 билдә булырға тейеш (хәрефтәр йәки һыҙыҡсалар); унан һуң мәжбүри булмаған `|<mathspeak альтернатива>` ҡушымтаһы килеүе мөмкин.

## Building components from the source

component-type-invalid = Дөрөҫ булмаған компонент төрө: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутын ҡабатлап булмай.

attribute-invalid-for-component = `<{ $componentType }>` төрөндәге компонент өсөн дөрөҫ булмаған атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль билдәләмәһендә { $context ->
        [text-on-background] текст төҫө менән фон төҫө
        [high-contrast] юғары контраслы төҫ менән һүрәт майҙаны
        [line] һыҙыҡ төҫө менән һүрәт майҙаны
        [marker] маркер төҫө менән һүрәт майҙаны
       *[text-on-canvas] текст төҫө менән һүрәт майҙаны
    } араһындағы контраст етерлек түгел{ $mode ->
        [dark] { " (ҡараңғы тема)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кәм тигәндә { $threshold }:1 кәрәк).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль билдәләмәһендә бирелгән төҫтәр яҡты тема өсөн етерлек контраст бирһә лә, улардан алынған ҡараңғы тема төҫтәре текст менән фон араһында етерлек контраст бирмәй ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кәм тигәндә { $threshold }:1 кәрәк). { $suggestion ->
        [available] Ҡараңғы темала етерлек контраст өсөн йә яҡты темалағы контрасты арттырығыҙ (мәҫәлән { $lightAttribute }="{ $lightColor }"), йә ҡараңғы тема төҫөн алмаштырығыҙ (мәҫәлән { $darkAttribute }="{ $darkColor }").
       *[none] Ҡараңғы темала етерлек контраст өсөн яҡты темалағы контрасты арттырығыҙ йәки алынған төҫтәрҙе textColorDarkMode һәм/йәки backgroundColorDarkMode менән алмаштырығыҙ.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль билдәләмәһендә бирелгән текст төҫө яҡты тема өсөн етерлек контраст бирһә лә, унан алынған ҡараңғы тема текст төҫө һүрәт майҙаны менән етерлек контраст бирмәй ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кәм тигәндә { $threshold }:1 кәрәк). { $suggestion ->
        [available] Ҡараңғы темала етерлек контраст өсөн йә яҡты темалағы контрасты арттырығыҙ (мәҫәлән textColor="{ $lightColor }"), йә ҡараңғы тема төҫөн алмаштырығыҙ (мәҫәлән textColorDarkMode="{ $darkColor }").
       *[none] Ҡараңғы темала етерлек контраст өсөн яҡты темалағы контрасты арттырығыҙ йәки алынған төҫтө textColorDarkMode менән алмаштырығыҙ.
    }

section-multiple-style-palettes = Бүлек бер генә <stylePalette> һайлай ала; һуңғыһы ҡулланыла.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } өсөн ҡабатланмаҫ варианттарҙы билдәләп булмай, сөнки numToSelect кире булмаған бөтөн һан түгел.

variant-num-to-select-not-constant-number = { $component } өсөн ҡабатланмаҫ варианттарҙы билдәләп булмай, сөнки numToSelect даими һан түгел.

variant-with-replacement-not-constant-boolean = { $component } өсөн ҡабатланмаҫ варианттарҙы билдәләп булмай, сөнки withReplacement даими логик ҡиммәт түгел.

variant-select-weight-disables-unique = берәй һайлауҙа selectWeight йәки selectForVariants бирелгән булһа, select өсөн ҡабатланмаҫ варианттар һүндерелә

variant-coprime-undetermined = { $component } өсөн ҡабатланмаҫ варианттарҙы билдәләп булмай, сөнки coprime һәр ваҡыт яңылыш икәнен асыҡлап булмай.

variant-attribute-not-constant = { $component } өсөн ҡабатланмаҫ варианттарҙы билдәләп булмай, сөнки { $attribute } даими түгел.

variant-attribute-not-number = { $component } өсөн ҡабатланмаҫ варианттарҙы билдәләп булмай, сөнки { $attribute } һан түгел.

variant-attribute-wrong-type-for-sequence =
    { $type } төрөндәге { $component } өсөн ҡабатланмаҫ варианттарҙы билдәләп булмай, сөнки { $attribute } { $expected ->
        [letters-combination] хәрефтәр комбинацияһы
        [math-expression] яраҡлы математик аңлатма
        [integer] бөтөн һан
       *[number] һан
    } түгел.

variant-length-not-integer = { $component } өсөн ҡабатланмаҫ варианттарҙы билдәләп булмай, сөнки length бөтөн һан түгел.

variant-sort-not-implemented = sort булған { $component } өсөн ҡабатланмаҫ варианттар ғәмәлгә ашырылмаған

variant-exclude-combinations-not-implemented = excludeCombinations булған { $component } өсөн ҡабатланмаҫ варианттар ғәмәлгә ашырылмаған

variant-math-exclude-not-implemented = exclude булған math төрөндәге { $component } өсөн ҡабатланмаҫ варианттар ғәмәлгә ашырылмаған

variant-non-constant-exclude-not-implemented = даими булмаған exclude булған { $component } өсөн ҡабатланмаҫ варианттар ғәмәлгә ашырылмаған

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графиктың prefigure һүрәтләүсеһендә ҡаралмаған; вариҫ ҡалдырылды.

prefigure-descendant-invalid-geometry = { $subject }: сикһеҙ йәки тулы булмаған геометрия; вариҫ ҡалдырылды.

prefigure-curve-label-omitted = { $subject }: әйләндерелгән кәкре элементтарында билдәләр ҡаралмаған; билдә ҡалдырылды.

prefigure-curve-unsupported-definition-type = { $subject }: ҡаралмаған кәкре функция билдәләмәһе төрө «{ $definitionType }»; вариҫ ҡалдырылды.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементындағы flipFunctions атрибуты ҡаралмаған; вариҫ ҡалдырылды.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формула менән бирелгән бала функцияларҙы ғына ҡабул итә; вариҫ ҡалдырылды.

prefigure-label-position-unsupported =
    { $subject }: ҡаралмаған labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] тура һыҙыҡтар ғаиләһе билдәһе өсөн
       *[point] нөктә билдәһе өсөн
    }; PreFigure-ҙың килешеү буйынса тигеҙләүе ҡулланыла.

prefigure-fill-style-unsupported = { $subject }: тултырыу стиле «{ $fillStyle }» PreFigure тарафынан ҡаралмаған; бөтөн тултырыуға күселә.

prefigure-line-style-unknown = { $subject }: билдәһеҙ һыҙыҡ стиле «{ $lineStyle }» PreFigure сығышынан алып ташланды.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер стиле «{ $markerStyle }» PreFigure «diamond» стиленә тап килтерелде.

prefigure-marker-style-unsupported = { $subject }: маркер стиле «{ $markerStyle }» PreFigure тарафынан ҡаралмаған; килешеү буйынса стиль ҡулланыла.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: дөрөҫ булмаған `ref`; маҡсатты бәйләп булмай. Иҫкәрмә ҡалдырылды.

annotation-ref-multiple-targets = `<annotation>`: `ref` бер нисә маҡсат менән бәйләнде; беренсеһе ҡулланыла.

annotation-ref-outside-graph = `<annotation>`: дөрөҫ булмаған `ref`; маҡсат уны эсенә алған графиктан тыш. Иҫкәрмә ҡалдырылды.

annotation-ref-unsupported-target = `<annotation>`: дөрөҫ булмаған `ref`; маҡсат prefigure әйләндереүендә ҡаралған график объект түгел. Иҫкәрмә ҡалдырылды.

annotation-text-missing = `<annotation>`: `text` юҡ йәки буш; буш текст сығарыла.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Циклик бәйлелек асыҡланды.
       *[other] `<{ $componentType }>` компонентын эсенә алған циклик бәйлелек асыҡланды.
    }

reference-no-referent = Һылтанма өсөн объект табылманы: `{ $reference }`

reference-multiple-referents = Һылтанма өсөн бер нисә объект табылды: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементының { $attribute } атрибутының форматы дөрөҫ түгел.

children-invalid = `<{ $componentType }>` өсөн дөрөҫ булмаған балалар: дөрөҫ булмаған балалар табылды: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибуты өсөн дөрөҫ булмаған ҡиммәт `{ $value }`; `{ $default }` ҡиммәте ҡулланыла

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версияһы табылманы.
       *[other] DoenetML { $version } версияһы табылманы. { $fallback } версияһы ҡулланыла
    }

## Reading the DoenetML

parse-invalid-doenetml = Дөрөҫ булмаған DoenetML: { $content }

parse-tag-missing-close-tag = Дөрөҫ булмаған DoenetML: `{ $tag }` тегының ябыусы тегы юҡ. Үҙе ябылыусы тег йәки `</{ $tagName }>` тегы көтөлгәйне.

parse-tag-error = Дөрөҫ булмаған DoenetML: `<{ $tagName }>` тегында хата

parse-attribute-missing-value = Дөрөҫ булмаған DoenetML: `{ $attribute }` атрибутында ҡиммәт етмәгән кеүек.

parse-attribute-invalid = Дөрөҫ булмаған DoenetML: дөрөҫ булмаған атрибут `{ $attribute }`

parse-attribute-value-invalid = Дөрөҫ булмаған DoenetML: атрибуттың дөрөҫ булмаған ҡиммәте `{ $value }`

parse-attribute-value-quote-mismatch = Дөрөҫ булмаған DoenetML: атрибуттың дөрөҫ булмаған ҡиммәте `{ $value }`. Ҡуштырнаҡтар тап килмәй. `{ $quote }` етмәгән кеүек

parse-open-tag-name-missing = Дөрөҫ булмаған DoenetML: исемһеҙ тег табылды, мәҫәлән `<`

parse-tag-not-closed = Дөрөҫ булмаған DoenetML: `{ $tag }` тегы ябылмаған (`>` етмәгән кеүек).

parse-self-closing-tag-name-missing = Дөрөҫ булмаған DoenetML: исемһеҙ тег табылды `<{ $content }>`

parse-self-closing-tag-not-closed = Дөрөҫ булмаған DoenetML: `{ $tag }` тегы ябылмаған (`/>` етмәгән кеүек).

parse-tag-invalid-attributes = Дөрөҫ булмаған DoenetML: `{ $tag }` тегы яраҡлы түгел. Уның атрибуттары дөрөҫ булмауы мөмкин.

parse-close-tag-name-missing = Дөрөҫ булмаған DoenetML: исемһеҙ ябыусы тег табылды, мәҫәлән `</`

parse-attribute-value-unquoted = Атрибут ҡиммәттәре ҡуштырнаҡ эсендә булырға тейеш: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Дөрөҫ булмаған DoenetML: `{ $tag }` ябыусы тегы табылды, әммә уға тап килеүсе асыусы тег юҡ

parse-close-tag-mismatched = Дөрөҫ булмаған DoenetML: тап килмәүсе ябыусы тег. `</{ $expected }>` көтөлгәйне. `{ $found }` табылды

parser-node-unconvertible = { $node } төйөнөн Dast төйөнөнә әйләндереп булманы.

## Names

name-attribute-invalid =
    Дөрөҫ булмаған атрибут name='{ $name }'. { $reason ->
        [characters] Исемдәрҙә хәрефтәр, һандар, аҫҡы һыҙыҡтар йәки һыҙыҡсалар ғына булыуы мөмкин.
       *[start] Исемдәр хәрефтән башланырға тейеш.
    }

component-name-invalid-start = Дөрөҫ булмаған компонент исеме «{ $name }». Исемдәр хәрефтән башланырға тейеш.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched төрөндәге answer-ҙың video атрибуты булырға тейеш

answer-video-watched-video-not-reference = videoWatched төрөндәге answer-ҙың video атрибуты һылтанма булырға тейеш

answer-name-not-single-text = answer-ҙың name атрибутында тап бер текст балаһы булырға тейеш

## Referencing another document

external-doenetml-recursion-limit = Рекурсия кимәлдәре артыҡ күп булғанға тышҡы DoenetML алып булманы. Циклик һылтанма юҡмы?

external-doenetml-unavailable = { $attribute }="{ $uri }" адресынан DoenetML алып булманы

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адресынан дөрөҫ булмаған DoenetML алынды: ул «{ $componentType }» компонент төрөнә тап килмәне

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибуты иҫкергән; уның урынына `{ $to }` ҡулланығыҙ.
       *[other] [deprecation] `<{ $component }>` элементындағы `{ $from }` атрибуты иҫкергән; уның урынына `{ $to }` ҡулланығыҙ.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибуты иҫкергән һәм иҫәпкә алынмай, сөнки `{ $to }` ҙа бирелгән.
       *[other] [deprecation] `<{ $component }>` элементындағы `{ $from }` атрибуты иҫкергән һәм иҫәпкә алынмай, сөнки `{ $to }` ҙа бирелгән.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементындағы `{ $attribute }` атрибуты иҫкергән һәм иҫәпкә алынмай.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элементындағы `{ $attribute }` атрибуты иҫкергән; уның урынына `<{ $child }>` балаһын ҡулланығыҙ.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элементындағы `{ $attribute }` атрибутының `{ $value }` ҡиммәте иҫкергән; уның урынына `{ $to }` ҡулланығыҙ.


## Language coverage

pluralize-english-only = `<pluralize>` күплек һанды инглиз телендә генә яһай ала, шуға күрә { $locale } телендә яҙылған документта уның тексы үҙгәрешһеҙ ҡала. Күплек формаһын үҙегеҙ яҙығыҙ йәки уны `pluralForm` атрибуты менән бирегеҙ.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элементы танылған Doenet элементы түгел.

schema-element-not-allowed-at-root = `<{ $tag }>` элементына документтың тамырында рөхсәт ителмәй.

schema-element-not-allowed-inside = `<{ $tag }>` элементына `<{ $parent }>` эсендә рөхсәт ителмәй.

schema-attribute-unrecognized = `<{ $tag }>` элементында `{ $attribute }` исемле атрибут юҡ.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементының `{ $attribute }` атрибуты һәр элементы түбәндәгеләрҙең береһе булған исемлек булырға тейеш: { $allowed }
       *[other] `<{ $tag }>` элементының `{ $attribute }` атрибуты түбәндәгеләрҙең береһе булырға тейеш: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select өсөн дөрөҫ булмаған вариант исеме. { $variantName } вариант исеме { $numOptions } һайлауҙа осрай, ә һайланасаҡ һан { $numToSelect }.

select-variant-name-without-options = select өсөн варианттар бирелгән, әммә мөмкин булған вариант исеме өсөн бер һайлау ҙа юҡ: { $variantName }.

select-variant-name-not-possible = select өсөн бирелгән { $variantName } вариант исеме мөмкин булған вариант исеме түгел.

select-too-few-options = Бары { $numOptions } эсенән { $numToSelect } компонентты һайлап булмай.

select-from-sequence-too-few-values = Оҙонлоғо { $length } эҙмә-эҙлектән { $numToSelect } ҡиммәт һайлап булмай.

select-from-sequence-indices-count-mismatch = select өсөн бирелгән индекстар һаны һайланасаҡ һанға тап килергә тейеш

select-from-sequence-indices-not-integers = select өсөн бирелгән бөтә индекстар бөтөн һан булырға тейеш

select-from-sequence-index-excluded = selectfromsequence өсөн бирелгән индекс сығарылғайны

select-from-sequence-indices-excluded-combination = selectfromsequence өсөн бирелгән индекстар сығарылған комбинация ине

select-from-sequence-coprime-not-positive-integers = Ыңғай бөтөн һандар һайланмағанға үҙ-ара ябай комбинацияларҙы һайлап булмай.

select-from-sequence-coprime-common-factor = Үҙ-ара ябай һандарҙы һайлап булмай. Бөтә мөмкин ҡиммәттәрҙең уртаҡ бүлеүсеһе бар. (Бирелгән "from" йәки "to" ҡиммәттәре "step" менән үҙ-ара ябай булырға тейеш.)

select-from-sequence-coprime-single-number = 1 булмаған берҙән-бер һандан үҙ-ара ябай комбинацияларҙы һайлап булмай.

select-from-sequence-excluded-too-many-combinations = selectFromSequence эсендә комбинацияларҙың 70%-тан артығы сығарылған

select-from-sequence-coprime-none-found = Үҙ-ара ябай һандарҙы һайлап булманы. Бөтә мөмкин ҡиммәттәрҙең уртаҡ бүлеүсеһе бар.

select-from-sequence-too-few-unique-values = Оҙонлоғо { $numPossibleValues } эҙмә-эҙлектән { $numToSelect } төрлө ҡиммәт һайлап булмай

select-prime-numbers-too-few-values = Оҙонлоғо { $numValues } ябай һандар исемлегенән { $numToSelect } ҡиммәт һайлап булмай

select-prime-numbers-values-count-mismatch = select өсөн бирелгән ҡиммәттәр һаны һайланасаҡ һанға тап килергә тейеш

select-prime-numbers-values-not-prime = select prime number өсөн бирелгән бөтә ҡиммәттәр ябай һандар исемлегендә булырға тейеш

select-prime-numbers-values-excluded-combination = selectPrimeNumbers өсөн бирелгән ҡиммәттәр сығарылған комбинация ине

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers эсендә комбинацияларҙың 70%-тан артығы сығарылған

select-random-combination-fluke = Бик ихтималһыҙ осраҡлылыҡ арҡаһында осраҡлы ҡиммәттәр комбинацияһын һайлап булманы

select-random-value-fluke = Бик ихтималһыҙ осраҡлылыҡ арҡаһында осраҡлы ҡиммәтте һайлап булманы
