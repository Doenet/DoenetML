# Tatar diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Tatar counts in the same two categories English does, so every selection below
# keeps both branches — but a noun after a numeral stays singular, so the two
# usually differ only in the number they print.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] ике очлык нокта да бирелгәндә { $attributes } исәпкә алынмый
       *[other] ике очлык нокта да бирелгәндә { $attributes } исәпкә алынмый
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] очлык нокта да, урта нокта да бирелгәндә { $attributes } исәпкә алынмый
       *[other] очлык нокта да, урта нокта да бирелгәндә { $attributes } исәпкә алынмый
    }

line-segment-midpoint-offset-without-midpoint = урта ноктасыз midpointOffset бернәрсәгә дә тәэсир итми

## `<line>`

line-points-undetermined-dimensions = Үлчәме билгесез нокталар аша үтүче туры сызык.

line-points-too-few-dimensions = Туры сызык ким дигәндә ике үлчәмле нокталар аша үтәргә тиеш.

line-points-depend-on-variables = Туры сызык үзгәрешлеләргә бәйле нокталар аша үтә: { $variables }.

line-equation-invalid-format = { $variable1 } һәм { $variable2 } үзгәрешлеләрендәге туры сызык тигезләмәсенең форматы дөрес түгел.

## `<ray>`

ray-overprescribed-through = Нур through, endpoint һәм direction аша бирелгән. Бирелгән through исәпкә алынмый.

ray-dimension-mismatch = нурда numDimensions туры килми.

## `<vector>`

vector-overprescribed-head = Вектор head, tail һәм displacement аша бирелгән. Бирелгән head исәпкә алынмый.

vector-dimension-mismatch = векторда numDimensions туры килми.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элементына тартып булмый, чөнки аның nearestPoint халәт үзгәрешлесе юк.

constrain-to-without-nearest-point = `<{ $component }>` элементы белән чикләп булмый, чөнки аның nearestPoint халәт үзгәрешлесе юк.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементының эче белән чикләп булмый, чөнки аның nearestPoint халәт үзгәрешлесе юк.

## `<choiceInput>`

choice-input-label-position-ignored = юл эчендә булмаган choiceInput өчен labelPosition исәпкә алынмый

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput өчен бирелгән индекслар исәпкә алынмый, чөнки аларның саны choice балаларының санына туры килми.

pretzel-indices-count-mismatch = problem өчен бирелгән индекслар исәпкә алынмый, чөнки аларның саны problem балаларының санына туры килми.

shuffle-indices-count-mismatch = shuffle өчен бирелгән индекслар исәпкә алынмый, чөнки аларның саны компонентлар санына туры килми.

indices-ignored-out-of-range = { $component } өчен бирелгән индекслар исәпкә алынмый, чөнки кайберләре чиктән тыш.

pretzel-indices-repeated = pretzel өчен бирелгән индекслар исәпкә алынмый, чөнки кайберләре кабатлана.

pretzel-circuit-first-index = circuit режимында pretzel өчен бирелгән индекслар исәпкә алынмый, чөнки беренче индекс 1 булырга тиеш.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текст балалары белән эшләсен өчен `type` атрибуты бирелергә тиеш.

invalid-type-defaulting-to-math = { $component } компоненты өчен дөрес булмаган төр { $type }. Ул math, text, number яки boolean булырга тиеш. math кулланыла.

string-not-valid-component-to-arrange = «{ $value }» юлы { $component } өчен яраклы компонент түгел. Исәпкә алынмый.

## Types and variables

invalid-type-defaulting-to-number = Дөрес булмаган төр { $type }, төр number итеп куела.

invalid-variable-value = Үзгәрешленең дөрес булмаган кыйммәте: `{ $value }`

## Variants

variant-index-must-be-number = Вариант индексы { $index } сан булырга тиеш

variant-index-must-be-integer = Вариант индексы { $index } бөтен сан булырга тиеш

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют үлчәмнәр өчен гамәлгә ашырылмаган. Киңлекләр чагыштырмалы була.

side-by-side-absolute-margins = `<{ $component }>` абсолют үлчәмнәр өчен гамәлгә ашырылмаган. Кыр буйлары чагыштырмалы була.

side-by-side-no-block-child = Дөрес булмаган `<{ $component }>`: аның ким дигәндә бер блок баласы булырга тиеш.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элементындагы `for` атрибуты исәпкә алынмый.

label-for-must-resolve-to-one = `<label>` элементындагы `for` атрибуты нәкъ бер компонентка күрсәтергә тиеш.

label-for-unresolved = `<label>` элементындагы `for` атрибутын компонент белән бәйләп булмады.

label-for-answer-with-authored-inputs = `<label>` элементындагы `for` атрибуты автор язган кертү кырлары булган `<answer>` элементына күрсәтә; кырга турыдан-туры күрсәтегез.

label-for-answer-without-input = `<label>` элементындагы `for` атрибуты билгеләнәчәк кертү кыры булмаган `<answer>` элементына күрсәтә.

label-for-must-reference-input-or-answer = `<label>` элементындагы `for` атрибуты кертү кырына яки җавапка күрсәтергә тиеш.

## Accessibility

accessibility-short-description-or-decorative = Үтемлелек өчен `<{ $component }>` я кыска тасвирламага ия булырга, я бизәк буларак билгеләнергә тиеш.

accessibility-video-short-description = Үтемлелек өчен `<video>` кыска тасвирламага ия булырга тиеш.

accessibility-input-short-description-or-label = Үтемлелек өчен `<{ $component }>` кыска тасвирламага яки тамгага ия булырга тиеш.

accessibility-answer-input-short-description-or-label = Үтемлелек өчен кертү кыры булдыручы `<answer>` кыска тасвирламага яки тамгага ия булырга тиеш.

accessibility-short-description-contains-math = Кыска тасвирламаларда `<{ $component }>` кебек математик компонентлар булырга тиеш түгел. Математиканы сүзләр белән языгыз.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } бүлек башламы тексты өчен җитәрлек контраст бирми (караңгы тема) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ким дигәндә { $threshold }:1 кирәк).
       *[other] { $colorName } бүлек башламы тексты өчен җитәрлек контраст бирми ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ким дигәндә { $threshold }:1 кирәк).
    }

## `<circle>`

circle-through-points-non-numerical = Нокталарның сан кыйммәтләре булмаганда { $count } нокта аша үтүче `<circle>` гамәлгә ашырылмаган.

circle-too-many-through-points = 3-тән артык нокта аша үтүче әйләнәне исәпләп булмый.

circle-overprescribed-radius-center-points = Бирелгән радиус, үзәк һәм нокталар белән әйләнәне исәпләп булмый.

circle-center-with-multiple-points = Бирелгән үзәк белән 1-дән артык нокта аша үтүче әйләнәне исәпләп булмый.

circle-radius-too-small = Әйләнәне исәпләп булмый: ике нокта арасындагы ераклык { $distance } булганга, бирелгән радиус { $radius } артык кечкенә.

circle-radius-with-many-points = Бирелгән радиус белән икедән артык нокта аша үтүче әйләнә төзеп булмый.

circle-invalid-center-or-through-points = Әйләнәнең үзәге яки нокталары дөрес түгел.

circle-radius-center-with-multiple-points = Бирелгән үзәк белән 1-дән артык нокта аша үтүче әйләнәнең радиусын исәпләп булмый.

circle-change-radius-non-numerical = Сан булмаган нокталы әйләнәнең радиусын үзгәртеп булмый

circle-radius-with-points-non-numerical = Сан кыйммәтләре булмаганда бирелгән радиус белән бердән артык нокта аша үтүче әйләнә төзеп булмый.

circle-change-center-non-numerical = Сан булмаган нокталар аша үтүче әйләнәнең үзәген үзгәртү гамәлгә ашырылмаган.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функциянең билгеләнү өлкәсенең үлчәме җитәрлек түгел. Өлкәдә { $intervals } аралык бар, ә функциядә { $inputs ->
            [one] { $inputs } керем
           *[other] { $inputs } керем
        }.
       *[other] Функциянең билгеләнү өлкәсенең үлчәме җитәрлек түгел. Өлкәдә { $intervals } аралык бар, ә функциядә { $inputs ->
            [one] { $inputs } керем
           *[other] { $inputs } керем
        }.
    }

function-domain-invalid-format = Функциянең билгеләнү өлкәсенең форматы дөрес түгел.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функциянең сан булмаган максимумы исәпкә алынмый.
        [minimum] Функциянең сан булмаган минимумы исәпкә алынмый.
        [extremum] Функциянең сан булмаган экстремумы исәпкә алынмый.
        [point] Функциянең сан булмаган ноктасы исәпкә алынмый.
        [slope] Функциянең сан булмаган авышлыгы исәпкә алынмый.
       *[other] Функциянең сан булмаган { $type } кыйммәте исәпкә алынмый.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функциянең буш максимумы исәпкә алынмый.
        [minimum] Функциянең буш минимумы исәпкә алынмый.
        [extremum] Функциянең буш экстремумы исәпкә алынмый.
        [point] Функциянең буш ноктасы исәпкә алынмый.
       *[other] Функциянең буш { $type } кыйммәте исәпкә алынмый.
    }

function-points-too-close = Функциядә бер-берсенә артык якын ике нокта бар. Функцияне билгеләп булмый.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функция итерацияләре кеременнәр саны чыгарылышлар санына тигез булганда гына мөмкин. Бу функциядә { $inputs } керем һәм { $outputs ->
            [one] { $outputs } чыгарылыш
           *[other] { $outputs } чыгарылыш
        } бар.
       *[other] Функция итерацияләре кеременнәр саны чыгарылышлар санына тигез булганда гына мөмкин. Бу функциядә { $inputs } керем һәм { $outputs ->
            [one] { $outputs } чыгарылыш
           *[other] { $outputs } чыгарылыш
        } бар.
    }

## `<sequence>`

sequence-invalid-length = Эзлеклелекнең озынлыгы дөрес түгел. Ул тискәре булмаган бөтен сан булырга тиеш.

sequence-invalid-step = Эзлеклелекнең адымы дөрес түгел. { $type } төрендәге эзлеклелек өчен ул сан булырга тиеш.

sequence-invalid-endpoint-number = Сан эзлеклелегенең «{ $attribute }» кыйммәте дөрес түгел. Ул сан булырга тиеш.

sequence-invalid-endpoint-letters = Хәреф эзлеклелегенең «{ $attribute }» кыйммәте дөрес түгел. Ул хәрефләр кушылмасы булырга тиеш.

sequence-invalid-endpoint = Эзлеклелекнең «{ $attribute }» кыйммәте дөрес түгел.

select-from-sequence-coprime-not-numbers = саннар сайланмаганга coprime исәпкә алынмый

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations бирелгәнгә coprime исәпкә алынмый

## Resolving a `target`

target-not-found = `<{ $source }>` өчен дөрес булмаган target: максат табылмады.

target-state-variable-not-found = `<{ $source }>` өчен дөрес булмаган target: `<{ $component }>` элементында «{ $property }» исемле халәт үзгәрешлесе табылмады.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` үзгәрешлеләре бәйсез үзгәрешледән аерылырга тиеш.

ode-system-duplicate-variable-names = Бәйле үзгәрешлеләрнең кабатланучы исемнәре белән ДТ уң як функцияләрен билгеләп булмый.

ode-system-rhs-function-error = ДТ уң як функциясен билгеләп булмый. mathjs функциясен төзегәндә хата.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } туры сызык арасындагы почмакны билгеләп булмый

angle-invalid-through-point = `<angle>` элементының through кыйммәтендә дөрес булмаган нокта

parabola-vertex-too-many-points = Бирелгән түбә белән 1-дән артык нокта аша үтүче парабола гамәлгә ашырылмаган.

parabola-too-many-points = 3-тән артык нокта аша үтүче парабола гамәлгә ашырылмаган.

intersection-too-many-items = Икедән артык объектның кисешүе гамәлгә ашырылмаган

## Other math components

ionic-compound-not-two-ions = Ике иондан башка ион кушылмалары гамәлгә ашырылмаган.

ionic-compound-needs-cation-and-anion = Ион кушылмалары бер катион һәм бер анион өчен генә гамәлгә ашырылган.

solve-equations-cannot-evaluate = Тигезләмәне чишеп булмый, чөнки аны исәпләп булмады: { $equation }

math-operators-operand-number-required = Математик операндны аерып алу өчен operandNumber бирелергә тиеш.

eigen-decomposition-failed = Матрицаның үз кыйммәтләрен исәпләп булмады

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметры үрнәктә очрамый, шуңа күрә ул һәрвакыт бушка туры килә.
       *[other] `<matchesPattern>`: { $parameters } параметрлары үрнәктә очрамый, шуңа күрә алар һәрвакыт бушка туры килә.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" кыйммәтен аңлатып булмый. Ул none, medium, dense яки буш урын белән аерылган ике уңай сан булырга тиеш, мәсәлән grid="1 0.5". Челтәр сызылмый.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure сурәтләүчесендә xLabelPosition="left" каралмаган; уң урнашу тәртибе кулланыла.

prefigure-y-label-position-unsupported = `<graph>`: prefigure сурәтләүчесендә yLabelPosition="bottom" каралмаган; өске урнашу тәртибе кулланыла.

prefigure-invalid-axis-bounds = `<graph>`: prefigure әйләндерүе өчен күчәрләр чикләре дөрес түгел; килешү буенча bbox (-10,-10,10,10) кулланыла.

prefigure-invalid-width = `<graph>`: prefigure әйләндерүе өчен киңлек дөрес түгел; диаграмманың килешү буенча киңлеге 425 кулланыла.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure әйләндерүе өчен aspectRatio дөрес түгел; килешү буенча яклар нисбәте 1 кулланыла.

prefigure-grid-spacing-too-fine = `<graph>`: челтәр адымы күчәрләр чикләре өчен артык вак; prefigure сурәтләүчесендә челтәр калдырыла.

prefigure-annotations-not-rendered = `<graph>`: PreFigure сурәтләүчесе кулланылмаганда искәрмәләр сызылмый.

multiple-annotations-children = `<graph>` эчендә берничә `<annotations>` баласы табылды; соңгысыннан башкалары исәпкә алынмый.

## Referring to other components

copy-unrecognized-component-type = Танылмаган компонент төрен киңәйтеп яки күчереп булмый: { $type }.

copy-prop-not-found = { $component } төрендәге компонентта { $property } үзлеге табылмады

collect-no-source = collect өчен чыганак табылмады.

collect-invalid-component-type = `<{ $component }>` төрендәге компонентларны җыеп булмый, чөнки бу дөрес булмаган компонент төре.

reference-index-unavailable = `{ $reference }` индексына сылтама ясап булмый

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентында { $action } чакырып булмый

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Мәгълүматларның формасы дөрес түгел. Юлларның озынлыклары төрле. Табылды componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Мәгълүматларда кабатланучы баган исемнәре бар. Табылды componentIdx :{ $componentIdx }

data-frame-missing-column-name = Мәгълүматларда баган исеме җитми. Табылды componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Бу җавапның award кыйммәте answer тегының үз җибәрелгән җавабына нигезләнә, бу көтелмәгән тәртипкә китерә.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` булган контейнер эчендәге `<answer>` элементына `maxNumAttempts` кую тәэсир итми, чөнки омтылышлар санын контейнер билгели. `maxNumAttempts` кыйммәтен контейнерга куегыз.

nested-section-wide-check-work-max-num-attempts = Башка `sectionWideCheckWork` контейнеры эчендә торган `sectionWideCheckWork` контейнерына `maxNumAttempts` кую тәэсир итми, чөнки омтылышлар санын тышкы контейнер билгели. `maxNumAttempts` кыйммәтен тышкы контейнерга куегыз.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality куелмаса, { $attributes } атрибуты тәэсир итмәячәк.
       *[other] symbolicEquality куелмаса, { $attributes } атрибутлары тәэсир итмәячәк.
    }

answer-invalid-type = answer өчен дөрес булмаган төр: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентының исеме булмаганга, аны модуль атрибуты итеп кулланып булмый

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентын модуль атрибуты итеп кулланып булмый, чөнки `<module>` компонент төрендә «{ $name }» атрибуты инде билгеләнгән.

conditional-content-condition-ignored = case яки else балалары булган `<conditionalContent>` компонентында `condition` атрибуты исәпкә алынмый.

slider-markers-type-mismatch = Маркерларның төре шудыргычның төренә туры килми.

pretzel-problem-needs-statement-and-answer = Дөрес булмаган pretzel: һәр `<problem>` бер `<statement>` һәм бер `<answer>` үз эченә алырга тиеш.

pretzel-circuit-first-problem-distractor = Дөрес булмаган pretzel: mode="circuit" режимында беренче `<problem>` игътибарны читкә юнәлтүче була алмый.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибуты өчен дөрес булмаган кыйммәт { $values }; исәпкә алынмый.
       *[other] `{ $attribute }` атрибуты өчен дөрес булмаган кыйммәтләр { $values }; исәпкә алынмый.
    }

attribute-must-be-references = `{ $attribute }` атрибуты өчен дөрес булмаган кыйммәт `{ $value }`. Атрибут `$` белән башланучы сылтамалардан торырга тиеш.

math-input-invalid-function-names = <mathInput>: { $attribute } эчендәге дөрес булмаган функция исемнәре исәпкә алынмады: { $names }. Һәр исемнең күрсәтелә торган өлеше ким дигәндә 2 билге булырга тиеш (хәрефләр яки сызыкчалар); аннан соң мәҗбүри булмаган `|<mathspeak альтернатива>` кушымчасы килергә мөмкин.

## Building components from the source

component-type-invalid = Дөрес булмаган компонент төре: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутын кабатлап булмый.

attribute-invalid-for-component = `<{ $componentType }>` төрендәге компонент өчен дөрес булмаган атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль билгеләмәсендә { $context ->
        [text-on-background] текст төсе белән фон төсе
        [high-contrast] югары контрастлы төс белән рәсем мәйданы
        [line] сызык төсе белән рәсем мәйданы
        [marker] маркер төсе белән рәсем мәйданы
       *[text-on-canvas] текст төсе белән рәсем мәйданы
    } арасындагы контраст җитәрлек түгел{ $mode ->
        [dark] { " (караңгы тема)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ким дигәндә { $threshold }:1 кирәк).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль билгеләмәсендә бирелгән төсләр якты тема өчен җитәрлек контраст бирсә дә, алардан алынган караңгы тема төсләре текст белән фон арасында җитәрлек контраст бирми ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ким дигәндә { $threshold }:1 кирәк). { $suggestion ->
        [available] Караңгы темада җитәрлек контраст өчен я якты темадагы контрастны арттырыгыз (мәсәлән { $lightAttribute }="{ $lightColor }"), я караңгы тема төсен алыштырыгыз (мәсәлән { $darkAttribute }="{ $darkColor }").
       *[none] Караңгы темада җитәрлек контраст өчен якты темадагы контрастны арттырыгыз яки алынган төсләрне textColorDarkMode һәм/яки backgroundColorDarkMode белән алыштырыгыз.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль билгеләмәсендә бирелгән текст төсе якты тема өчен җитәрлек контраст бирсә дә, аннан алынган караңгы тема текст төсе рәсем мәйданы белән җитәрлек контраст бирми ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ким дигәндә { $threshold }:1 кирәк). { $suggestion ->
        [available] Караңгы темада җитәрлек контраст өчен я якты темадагы контрастны арттырыгыз (мәсәлән textColor="{ $lightColor }"), я караңгы тема төсен алыштырыгыз (мәсәлән textColorDarkMode="{ $darkColor }").
       *[none] Караңгы темада җитәрлек контраст өчен якты темадагы контрастны арттырыгыз яки алынган төсне textColorDarkMode белән алыштырыгыз.
    }

section-multiple-style-palettes = Бүлек бер генә <stylePalette> сайлый ала; соңгысы кулланыла.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } өчен кабатланмас вариантларны билгеләп булмый, чөнки numToSelect тискәре булмаган бөтен сан түгел.

variant-num-to-select-not-constant-number = { $component } өчен кабатланмас вариантларны билгеләп булмый, чөнки numToSelect даими сан түгел.

variant-with-replacement-not-constant-boolean = { $component } өчен кабатланмас вариантларны билгеләп булмый, чөнки withReplacement даими логик кыйммәт түгел.

variant-select-weight-disables-unique = берәр сайлауда selectWeight яки selectForVariants бирелгән булса, select өчен кабатланмас вариантлар сүндерелә

variant-coprime-undetermined = { $component } өчен кабатланмас вариантларны билгеләп булмый, чөнки coprime һәрвакыт ялгыш икәнен ачыклап булмый.

variant-attribute-not-constant = { $component } өчен кабатланмас вариантларны билгеләп булмый, чөнки { $attribute } даими түгел.

variant-attribute-not-number = { $component } өчен кабатланмас вариантларны билгеләп булмый, чөнки { $attribute } сан түгел.

variant-attribute-wrong-type-for-sequence =
    { $type } төрендәге { $component } өчен кабатланмас вариантларны билгеләп булмый, чөнки { $attribute } { $expected ->
        [letters-combination] хәрефләр кушылмасы
        [math-expression] яраклы математик аңлатма
        [integer] бөтен сан
       *[number] сан
    } түгел.

variant-length-not-integer = { $component } өчен кабатланмас вариантларны билгеләп булмый, чөнки length бөтен сан түгел.

variant-sort-not-implemented = sort булган { $component } өчен кабатланмас вариантлар гамәлгә ашырылмаган

variant-exclude-combinations-not-implemented = excludeCombinations булган { $component } өчен кабатланмас вариантлар гамәлгә ашырылмаган

variant-math-exclude-not-implemented = exclude булган math төрендәге { $component } өчен кабатланмас вариантлар гамәлгә ашырылмаган

variant-non-constant-exclude-not-implemented = даими булмаган exclude булган { $component } өчен кабатланмас вариантлар гамәлгә ашырылмаган

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графикның prefigure сурәтләүчесендә каралмаган; варис калдырылды.

prefigure-descendant-invalid-geometry = { $subject }: чиксез яки тулы булмаган геометрия; варис калдырылды.

prefigure-curve-label-omitted = { $subject }: әйләндерелгән кәкре элементларында тамгалар каралмаган; тамга калдырылды.

prefigure-curve-unsupported-definition-type = { $subject }: каралмаган кәкре функция билгеләмәсе төре «{ $definitionType }»; варис калдырылды.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементындагы flipFunctions атрибуты каралмаган; варис калдырылды.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формула белән бирелгән бала функцияләрне генә кабул итә; варис калдырылды.

prefigure-label-position-unsupported =
    { $subject }: каралмаган labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] туры сызыклар гаиләсе тамгасы өчен
       *[point] нокта тамгасы өчен
    }; PreFigure-ның килешү буенча тигезләве кулланыла.

prefigure-fill-style-unsupported = { $subject }: тутыру стиле «{ $fillStyle }» PreFigure тарафыннан каралмаган; бөтен тутыруга күчелә.

prefigure-line-style-unknown = { $subject }: билгесез сызык стиле «{ $lineStyle }» PreFigure чыгарылышыннан алып ташланды.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер стиле «{ $markerStyle }» PreFigure «diamond» стиленә туры китерелде.

prefigure-marker-style-unsupported = { $subject }: маркер стиле «{ $markerStyle }» PreFigure тарафыннан каралмаган; килешү буенча стиль кулланыла.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: дөрес булмаган `ref`; максатны бәйләп булмый. Искәрмә калдырылды.

annotation-ref-multiple-targets = `<annotation>`: `ref` берничә максат белән бәйләнде; беренчесе кулланыла.

annotation-ref-outside-graph = `<annotation>`: дөрес булмаган `ref`; максат аны эченә алган графиктан тыш. Искәрмә калдырылды.

annotation-ref-unsupported-target = `<annotation>`: дөрес булмаган `ref`; максат prefigure әйләндерүендә каралган график объект түгел. Искәрмә калдырылды.

annotation-text-missing = `<annotation>`: `text` юк яки буш; буш текст чыгарыла.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Циклик бәйлелек ачыкланды.
       *[other] `<{ $componentType }>` компонентын үз эченә алган циклик бәйлелек ачыкланды.
    }

reference-no-referent = Сылтама өчен объект табылмады: `{ $reference }`

reference-multiple-referents = Сылтама өчен берничә объект табылды: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементының { $attribute } атрибутының форматы дөрес түгел.

children-invalid = `<{ $componentType }>` өчен дөрес булмаган балалар: дөрес булмаган балалар табылды: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибуты өчен дөрес булмаган кыйммәт `{ $value }`; `{ $default }` кыйммәте кулланыла

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версиясе табылмады.
       *[other] DoenetML { $version } версиясе табылмады. { $fallback } версиясе кулланыла
    }

## Reading the DoenetML

parse-invalid-doenetml = Дөрес булмаган DoenetML: { $content }

parse-tag-missing-close-tag = Дөрес булмаган DoenetML: `{ $tag }` тегының ябучы тегы юк. Үзе ябылучы тег яки `</{ $tagName }>` тегы көтелгән иде.

parse-tag-error = Дөрес булмаган DoenetML: `<{ $tagName }>` тегында хата

parse-attribute-missing-value = Дөрес булмаган DoenetML: `{ $attribute }` атрибутында кыйммәт җитмәгән кебек.

parse-attribute-invalid = Дөрес булмаган DoenetML: дөрес булмаган атрибут `{ $attribute }`

parse-attribute-value-invalid = Дөрес булмаган DoenetML: атрибутның дөрес булмаган кыйммәте `{ $value }`

parse-attribute-value-quote-mismatch = Дөрес булмаган DoenetML: атрибутның дөрес булмаган кыйммәте `{ $value }`. Куштырнаклар туры килми. `{ $quote }` җитмәгән кебек

parse-open-tag-name-missing = Дөрес булмаган DoenetML: исемсез тег табылды, мәсәлән `<`

parse-tag-not-closed = Дөрес булмаган DoenetML: `{ $tag }` тегы ябылмаган (`>` җитмәгән кебек).

parse-self-closing-tag-name-missing = Дөрес булмаган DoenetML: исемсез тег табылды `<{ $content }>`

parse-self-closing-tag-not-closed = Дөрес булмаган DoenetML: `{ $tag }` тегы ябылмаган (`/>` җитмәгән кебек).

parse-tag-invalid-attributes = Дөрес булмаган DoenetML: `{ $tag }` тегы яраклы түгел. Аның атрибутлары дөрес булмаска мөмкин.

parse-close-tag-name-missing = Дөрес булмаган DoenetML: исемсез ябучы тег табылды, мәсәлән `</`

parse-attribute-value-unquoted = Атрибут кыйммәтләре куштырнак эчендә булырга тиеш: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Дөрес булмаган DoenetML: `{ $tag }` ябучы тегы табылды, ләкин аңа туры килүче ачучы тег юк

parse-close-tag-mismatched = Дөрес булмаган DoenetML: туры килмәүче ябучы тег. `</{ $expected }>` көтелгән иде. `{ $found }` табылды

parser-node-unconvertible = { $node } төенен Dast төененә әйләндереп булмады.

## Names

name-attribute-invalid =
    Дөрес булмаган атрибут name='{ $name }'. { $reason ->
        [characters] Исемнәрдә хәрефләр, саннар, аскы сызыклар яки сызыкчалар гына булырга мөмкин.
       *[start] Исемнәр хәрефтән башланырга тиеш.
    }

component-name-invalid-start = Дөрес булмаган компонент исеме «{ $name }». Исемнәр хәрефтән башланырга тиеш.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched төрендәге answer-ның video атрибуты булырга тиеш

answer-video-watched-video-not-reference = videoWatched төрендәге answer-ның video атрибуты сылтама булырга тиеш

answer-name-not-single-text = answer-ның name атрибутында нәкъ бер текст баласы булырга тиеш

## Referencing another document

external-doenetml-recursion-limit = Рекурсия дәрәҗәләре артык күп булганга тышкы DoenetML алып булмады. Циклик сылтама юкмы?

external-doenetml-unavailable = { $attribute }="{ $uri }" адресыннан DoenetML алып булмады

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адресыннан дөрес булмаган DoenetML алынды: ул «{ $componentType }» компонент төренә туры килмәде

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибуты искергән; аның урынына `{ $to }` кулланыгыз.
       *[other] [deprecation] `<{ $component }>` элементындагы `{ $from }` атрибуты искергән; аның урынына `{ $to }` кулланыгыз.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибуты искергән һәм исәпкә алынмый, чөнки `{ $to }` да бирелгән.
       *[other] [deprecation] `<{ $component }>` элементындагы `{ $from }` атрибуты искергән һәм исәпкә алынмый, чөнки `{ $to }` да бирелгән.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементындагы `{ $attribute }` атрибуты искергән һәм исәпкә алынмый.


## Language coverage

pluralize-english-only = `<pluralize>` күплек санны инглиз телендә генә ясый ала, шуңа күрә { $locale } телендә язылган документта аның тексты үзгәрешсез кала. Күплек формасын үзегез языгыз яки аны `pluralForm` атрибуты белән бирегез.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элементы танылган Doenet элементы түгел.

schema-element-not-allowed-at-root = `<{ $tag }>` элементына документның тамырында рөхсәт ителми.

schema-element-not-allowed-inside = `<{ $tag }>` элементына `<{ $parent }>` эчендә рөхсәт ителми.

schema-attribute-unrecognized = `<{ $tag }>` элементында `{ $attribute }` исемле атрибут юк.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементының `{ $attribute }` атрибуты һәр элементы түбәндәгеләрнең берсе булган исемлек булырга тиеш: { $allowed }
       *[other] `<{ $tag }>` элементының `{ $attribute }` атрибуты түбәндәгеләрнең берсе булырга тиеш: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select өчен дөрес булмаган вариант исеме. { $variantName } вариант исеме { $numOptions } сайлауда очрый, ә сайланасы сан { $numToSelect }.

select-variant-name-without-options = select өчен вариантлар бирелгән, ләкин мөмкин булган вариант исеме өчен бер сайлау да юк: { $variantName }.

select-variant-name-not-possible = select өчен бирелгән { $variantName } вариант исеме мөмкин булган вариант исеме түгел.

select-too-few-options = Бары { $numOptions } эченнән { $numToSelect } компонентны сайлап булмый.

select-from-sequence-too-few-values = Озынлыгы { $length } эзлеклелектән { $numToSelect } кыйммәт сайлап булмый.

select-from-sequence-indices-count-mismatch = select өчен бирелгән индекслар саны сайланасы санга туры килергә тиеш

select-from-sequence-indices-not-integers = select өчен бирелгән барлык индекслар бөтен сан булырга тиеш

select-from-sequence-index-excluded = selectfromsequence өчен бирелгән индекс чыгарылган иде

select-from-sequence-indices-excluded-combination = selectfromsequence өчен бирелгән индекслар чыгарылган кушылма иде

select-from-sequence-coprime-not-positive-integers = Уңай бөтен саннар сайланмаганга үзара гади кушылмаларны сайлап булмый.

select-from-sequence-coprime-common-factor = Үзара гади саннарны сайлап булмый. Барлык мөмкин кыйммәтләрнең уртак бүлүчесе бар. (Бирелгән "from" яки "to" кыйммәтләре "step" белән үзара гади булырга тиеш.)

select-from-sequence-coprime-single-number = 1 булмаган бердәнбер саннан үзара гади кушылмаларны сайлап булмый.

select-from-sequence-excluded-too-many-combinations = selectFromSequence эчендә кушылмаларның 70%-тан артыгы чыгарылган

select-from-sequence-coprime-none-found = Үзара гади саннарны сайлап булмады. Барлык мөмкин кыйммәтләрнең уртак бүлүчесе бар.

select-from-sequence-too-few-unique-values = Озынлыгы { $numPossibleValues } эзлеклелектән { $numToSelect } төрле кыйммәт сайлап булмый

select-prime-numbers-too-few-values = Озынлыгы { $numValues } гади саннар исемлегеннән { $numToSelect } кыйммәт сайлап булмый

select-prime-numbers-values-count-mismatch = select өчен бирелгән кыйммәтләр саны сайланасы санга туры килергә тиеш

select-prime-numbers-values-not-prime = select prime number өчен бирелгән барлык кыйммәтләр гади саннар исемлегендә булырга тиеш

select-prime-numbers-values-excluded-combination = selectPrimeNumbers өчен бирелгән кыйммәтләр чыгарылган кушылма иде

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers эчендә кушылмаларның 70%-тан артыгы чыгарылган

select-random-combination-fluke = Гаять ихтималсыз очраклылык аркасында очраклы кыйммәтләр кушылмасын сайлап булмады

select-random-value-fluke = Гаять ихтималсыз очраклылык аркасында очраклы кыйммәтне сайлап булмады
