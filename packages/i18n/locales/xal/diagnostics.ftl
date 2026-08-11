# Kalmyk diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Read the confidence note at the top of `content.ftl` before this file: this
# is the least certain catalog in its batch, and this is its longest file.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# The technical nouns are the Russian ones, which is what written Kalmyk uses
# for them: «компонент», «атрибут», «функц», «индекс».


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] хойр үзүрин цег зааврлгдсн цагт { $attributes } тооллго уга
       *[other] хойр үзүрин цег зааврлгдсн цагт { $attributes } тооллго уга
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] үзүрин цег болн дунд цег хойрулн зааврлгдсн цагт { $attributes } тооллго уга
       *[other] үзүрин цег болн дунд цег хойрулн зааврлгдсн цагт { $attributes } тооллго уга
    }

line-segment-midpoint-offset-without-midpoint = дунд цег уга midpointOffset юмнд нөлөлхш

## `<line>`

line-points-undetermined-dimensions = Кемҗән медгддго цегүдәр һардг шулун зурас.

line-points-too-few-dimensions = Шулун зурас яһад чигн хойр кемҗәтә цегүдәр һарх зөвтә.

line-points-depend-on-variables = Шулун зурас хүврдг кемҗәс дүңгәдг цегүдәр һарна: { $variables }.

line-equation-invalid-format = { $variable1 } болн { $variable2 } хүврдг кемҗәстә шулун зурасин әдллтин формат буру.

## `<ray>`

ray-overprescribed-through = Сарул through, endpoint болн direction деегүр өггдв. Өггдсн through тооллго уга.

ray-dimension-mismatch = сарул деер numDimensions таарлго уга.

## `<vector>`

vector-overprescribed-head = Вектор head, tail болн displacement деегүр өггдв. Өггдсн head тооллго уга.

vector-dimension-mismatch = вектор деер numDimensions таарлго уга.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элемент тал татҗ чадшго, юңгад гихлә түүнд nearestPoint бәәдлин хүврдг кемҗән уга.

constrain-to-without-nearest-point = `<{ $component }>` элементәр хәәкрлҗ чадшго, юңгад гихлә түүнд nearestPoint бәәдлин хүврдг кемҗән уга.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементин дотркарнь хәәкрлҗ чадшго, юңгад гихлә түүнд nearestPoint бәәдлин хүврдг кемҗән уга.

## `<choiceInput>`

choice-input-label-position-ignored = мөр дотрк биш choiceInput деер labelPosition тооллго уга

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput деер өггдсн индексүд тооллго уга, юңгад гихлә теднә то choice үрдин тод таарлго уга.

pretzel-indices-count-mismatch = problem деер өггдсн индексүд тооллго уга, юңгад гихлә теднә то problem үрдин тод таарлго уга.

shuffle-indices-count-mismatch = shuffle деер өггдсн индексүд тооллго уга, юңгад гихлә теднә то компонентмүдин тод таарлго уга.

indices-ignored-out-of-range = { $component } деер өггдсн индексүд тооллго уга, юңгад гихлә зәрмнь кемҗәһәс һарна.

pretzel-indices-repeated = pretzel деер өггдсн индексүд тооллго уга, юңгад гихлә зәрмнь давтгдна.

pretzel-circuit-first-index = circuit бәәдлд pretzel деер өггдсн индексүд тооллго уга, юңгад гихлә түрүн индекс 1 болх зөвтә.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текстин үрдтә көдлхин төлә `type` атрибут өггдх зөвтә.

invalid-type-defaulting-to-math = { $component } компонентд буру зүсн { $type }. Тер math, text, number эсвл boolean болх зөвтә. math олзлгдна.

string-not-valid-component-to-arrange = «{ $value }» мөр { $component } деер таармҗта компонент биш. Тооллго уга.

## Types and variables

invalid-type-defaulting-to-number = Буру зүсн { $type }, зүснь number болһгдна.

invalid-variable-value = Хүврдг кемҗәнә буру утх: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариантин индекс то болх зөвтә

variant-index-must-be-integer = { $index } вариантин индекс бүклә то болх зөвтә

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют кемҗәст кегдсн уга. Өргнднь дүңцүлгч болна.

side-by-side-absolute-margins = `<{ $component }>` абсолют кемҗәст кегдсн уга. Кеҗгүднь дүңцүлгч болна.

side-by-side-no-block-child = Буру `<{ $component }>`: түүнд яһад чигн негн блок үрн бәәх зөвтә.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элемент деерк `for` атрибут тооллго уга.

label-for-must-resolve-to-one = `<label>` элемент деерк `for` атрибут яһ негн компонент деер заах зөвтә.

label-for-unresolved = `<label>` элемент деерк `for` атрибутиг компоненттә залһҗ чадсн уга.

label-for-answer-with-authored-inputs = `<label>` элемент деерк `for` атрибут автор бичсн орулһна һазрмудта `<answer>` деер заана; һазр деер шуд заатн.

label-for-answer-without-input = `<label>` элемент деерк `for` атрибут темдглх орулһна һазр уга `<answer>` деер заана.

label-for-must-reference-input-or-answer = `<label>` элемент деерк `for` атрибут орулһна һазр эсвл хәрү деер заах зөвтә.

## Accessibility

accessibility-short-description-or-decorative = Күрх аргин төлә `<{ $component }>` эсвл ахр тәәлвртә болх, эсвл кеермҗ гиҗ темдглгдх зөвтә.

accessibility-video-short-description = Күрх аргин төлә `<video>` ахр тәәлвртә болх зөвтә.

accessibility-input-short-description-or-label = Күрх аргин төлә `<{ $component }>` ахр тәәлвртә эсвл темдгтә болх зөвтә.

accessibility-answer-input-short-description-or-label = Күрх аргин төлә орулһна һазр кедг `<answer>` ахр тәәлвртә эсвл темдгтә болх зөвтә.

accessibility-short-description-contains-math = Ахр тәәлврмүдт `<{ $component }>` мет математическ компонентмүд бәәх зөв уга. Математикиг үгәр бичтн.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } бөлгин толһан текстд күрх контраст өгчәхш (харңһу зүсн) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; яһад чигн { $threshold }:1 кергтә).
       *[other] { $colorName } бөлгин толһан текстд күрх контраст өгчәхш ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; яһад чигн { $threshold }:1 кергтә).
    }

## `<circle>`

circle-through-points-non-numerical = Цегүдин тоота утх уга цагт { $count } цегәр һардг `<circle>` кегдсн уга.

circle-too-many-through-points = 3-ас олн цегәр һардг төөрг тоолҗ чадшго.

circle-overprescribed-radius-center-points = Өггдсн радиус, төв болн цегүдтә төөрг тоолҗ чадшго.

circle-center-with-multiple-points = Өггдсн төвтә 1-әс олн цегәр һардг төөрг тоолҗ чадшго.

circle-radius-too-small = Төөрг тоолҗ чадшго: хойр цегин хоорнд зәә { $distance } болхла, өггдсн радиус { $radius } үлү бичкн.

circle-radius-with-many-points = Өггдсн радиустта хойрас олн цегәр һардг төөрг кеҗ чадшго.

circle-invalid-center-or-through-points = Төөргин төв эсвл цегүднь буру.

circle-radius-center-with-multiple-points = Өггдсн төвтә 1-әс олн цегәр һардг төөргин радиус тоолҗ чадшго.

circle-change-radius-non-numerical = Тоота биш цегүдтә төөргин радиус хүврүлҗ чадшго

circle-radius-with-points-non-numerical = Тоота утх уга цагт өггдсн радиустта негәс олн цегәр һардг төөрг кеҗ чадшго.

circle-change-center-non-numerical = Тоота биш цегүдәр һардг төөргин төв хүврүлх кегдсн уга.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцин тодрхлгддг һазрин кемҗән күрчәхш. Һазрт { $intervals } зәә бәәнә, харм функцд { $inputs ->
            [one] { $inputs } орулт
           *[other] { $inputs } орулт
        } бәәнә.
       *[other] Функцин тодрхлгддг һазрин кемҗән күрчәхш. Һазрт { $intervals } зәә бәәнә, харм функцд { $inputs ->
            [one] { $inputs } орулт
           *[other] { $inputs } орулт
        } бәәнә.
    }

function-domain-invalid-format = Функцин тодрхлгддг һазрин формат буру.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцин тоота биш максимум тооллго уга.
        [minimum] Функцин тоота биш минимум тооллго уга.
        [extremum] Функцин тоота биш экстремум тооллго уга.
        [point] Функцин тоота биш цег тооллго уга.
        [slope] Функцин тоота биш хәләц тооллго уга.
       *[other] Функцин тоота биш { $type } утх тооллго уга.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцин хоосн максимум тооллго уга.
        [minimum] Функцин хоосн минимум тооллго уга.
        [extremum] Функцин хоосн экстремум тооллго уга.
        [point] Функцин хоосн цег тооллго уга.
       *[other] Функцин хоосн { $type } утх тооллго уга.
    }

function-points-too-close = Функцд эн-теркәһән үлү өөрхн хойр цег бәәнә. Функц тодрхлҗ чадшго.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функцин итерацс орултын то һарлтын тод әдл болхла болна. Эн функцд { $inputs } орулт болн { $outputs ->
            [one] { $outputs } һарлт
           *[other] { $outputs } һарлт
        } бәәнә.
       *[other] Функцин итерацс орултын то һарлтын тод әдл болхла болна. Эн функцд { $inputs } орулт болн { $outputs ->
            [one] { $outputs } һарлт
           *[other] { $outputs } һарлт
        } бәәнә.
    }

## `<sequence>`

sequence-invalid-length = Дарандын ут буру. Тер сөрг биш бүклә то болх зөвтә.

sequence-invalid-step = Дарандын ишк буру. { $type } зүстә дарандд тер то болх зөвтә.

sequence-invalid-endpoint-number = Тоота дарандын «{ $attribute }» утх буру. Тер то болх зөвтә.

sequence-invalid-endpoint-letters = Үзгин дарандын «{ $attribute }» утх буру. Тер үзгүдин ниилвр болх зөвтә.

sequence-invalid-endpoint = Дарандын «{ $attribute }» утх буру.

select-from-sequence-coprime-not-numbers = тос суңһгдсн угаһар coprime тооллго уга

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations өггдсн учрар coprime тооллго уга

## Resolving a `target`

target-not-found = `<{ $source }>` деер буру target: күсл олгдсн уга.

target-state-variable-not-found = `<{ $source }>` деер буру target: `<{ $component }>` элемент деер «{ $property }» нертә бәәдлин хүврдг кемҗән олгдсн уга.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` хүврдг кемҗәснь дүңгәлго кемҗәһәс талдан болх зөвтә.

ode-system-duplicate-variable-names = Дүңгәдг кемҗәсин нерд давтгдсн цагт ДТ барун талын функцс тодрхлҗ чадшго.

ode-system-rhs-function-error = ДТ барун талын функц тодрхлҗ чадшго. mathjs функц кехд эндү.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } шулун зурасин хоорнд булң тодрхлҗ чадшго

angle-invalid-through-point = `<angle>` элементин through утхд буру цег

parabola-vertex-too-many-points = Өггдсн орьятта 1-әс олн цегәр һардг парабол кегдсн уга.

parabola-too-many-points = 3-ас олн цегәр һардг парабол кегдсн уга.

intersection-too-many-items = Хойрас олн объектин хәрлцлһн кегдсн уга

## Other math components

ionic-compound-not-two-ions = Хойр ионас талдан ионы ниилвр кегдсн уга.

ionic-compound-needs-cation-and-anion = Ионы ниилвр негн катион болн негн анионд л кегдсн.

solve-equations-cannot-evaluate = Әдллт шиидҗ чадшго, юңгад гихлә түүг тоолҗ чадсн уга: { $equation }

math-operators-operand-number-required = Математическ операнд салһхин төлә operandNumber өггдх зөвтә.

eigen-decomposition-failed = Матрицин эврә утх тоолҗ чадсн уга

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр үлгүрт таарлго уга, тиигәд тер даңгин хоосн деер таарна.
       *[other] `<matchesPattern>`: { $parameters } параметрмүд үлгүрт таарлго уга, тиигәд тедн даңгин хоосн деер таарна.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" утх медҗ чадшго. Тер none, medium, dense эсвл хоосн зәәһәр салһгдсн хойр эерг то болх зөвтә, чиг grid="1 0.5". Тор зурлго уга.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure зурач деер xLabelPosition="left" кегдсн уга; барун талын бәәрллт олзлгдна.

prefigure-y-label-position-unsupported = `<graph>`: prefigure зурач деер yLabelPosition="bottom" кегдсн уга; деед талын бәәрллт олзлгдна.

prefigure-invalid-axis-bounds = `<graph>`: prefigure хүврлтд тэңгин кеҗгүд буру; ул bbox (-10,-10,10,10) олзлгдна.

prefigure-invalid-width = `<graph>`: prefigure хүврлтд өргн буру; диаграмин ул өргн 425 олзлгдна.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure хүврлтд aspectRatio буру; ул талсин харһлт 1 олзлгдна.

prefigure-grid-spacing-too-fine = `<graph>`: торин ишк тэңгин кеҗгүдт үлү нәрхн; prefigure зурач деер тор һарһгдхш.

prefigure-annotations-not-rendered = `<graph>`: PreFigure зурач олзлгдсн угаһар темдгүд зурлго уга.

multiple-annotations-children = `<graph>` дотр кесг `<annotations>` үрн олгдв; хөөтхәс талданнь тооллго уга.

## Referring to other components

copy-unrecognized-component-type = Таньгдсн уга компонентин зүсн өргҗүлҗ эсвл көчүлҗ чадшго: { $type }.

copy-prop-not-found = { $component } зүстә компонент деер { $property } чинр олгдсн уга

collect-no-source = collect деер уңг олгдсн уга.

collect-invalid-component-type = `<{ $component }>` зүстә компонентмүд цуглулҗ чадшго, юңгад гихлә эн буру компонентин зүсн.

reference-index-unavailable = `{ $reference }` индекс деер заавр кеҗ чадшго

## `<callAction>`

component-action-unavailable = `{ $reference }` компонент деер { $action } дуудҗ чадшго

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Медәлин хевнь буру. Мөрмүдин утнь ниг биш. Олгдв componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Медәлд баганан нерд давтгдна. Олгдв componentIdx :{ $componentIdx }

data-frame-missing-column-name = Медәлд баганан нерн дутна. Олгдв componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Эн хәрүһин award утх answer тегин эврә илгәгдсн хәрү деер тулна, эн күләгдсн уга бәәдлд күргнә.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` бәәх контейнер дотрк `<answer>` деер `maxNumAttempts` тәвлһн нөлөлхш, юңгад гихлә эрлһнә то контейнер тодрхлна. `maxNumAttempts` утх контейнер деер тәвтн.

nested-section-wide-check-work-max-num-attempts = Талдан `sectionWideCheckWork` контейнер дотр бәәх `sectionWideCheckWork` контейнер деер `maxNumAttempts` тәвлһн нөлөлхш, юңгад гихлә эрлһнә то һаза контейнер тодрхлна. `maxNumAttempts` утх һаза контейнер деер тәвтн.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality тәвгдсн угаһар { $attributes } атрибут нөлөлшго.
       *[other] symbolicEquality тәвгдсн угаһар { $attributes } атрибутмуд нөлөлшго.
    }

answer-invalid-type = answer деер буру зүсн: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентин нерн угаһар түүг модулин атрибут болһҗ олзлҗ чадшго

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонент модулин атрибут болһҗ олзлҗ чадшго, юңгад гихлә `<module>` компонентин зүснд «{ $name }» атрибут эрт тодрхлгдсн.

conditional-content-condition-ignored = case эсвл else үрдтә `<conditionalContent>` компонент деер `condition` атрибут тооллго уга.

slider-markers-type-mismatch = Маркермүдин зүсн гүлгүрин зүснд таарлго уга.

pretzel-problem-needs-statement-and-answer = Буру pretzel: `<problem>` болһн негн `<statement>` болн негн `<answer>` багтах зөвтә.

pretzel-circuit-first-problem-distractor = Буру pretzel: mode="circuit" бәәдлд түрүн `<problem>` оньгиг хаҗулгч болҗ чадшго.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибут деер буру утх { $values }; тооллго уга.
       *[other] `{ $attribute }` атрибут деер буру утхс { $values }; тооллго уга.
    }

attribute-must-be-references = `{ $attribute }` атрибут деер буру утх `{ $value }`. Атрибут `$` темдгәс эклдг зааврас тогтх зөвтә.

math-input-invalid-function-names = <mathInput>: { $attribute } дотрк буру функцин нерд тооллго уга: { $names }. Нерн болһна үзгддг хүвнь яһад чигн 2 темдг болх зөвтә (үзгүд эсвл зурас); терүнә хөөн кергтә биш `|<mathspeak альтернатив>` немлт ирҗ чадна.

## Building components from the source

component-type-invalid = Буру компонентин зүсн: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибут давтҗ чадшго.

attribute-invalid-for-component = `<{ $componentType }>` зүстә компонентд буру атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стилин тодрхлтд { $context ->
        [text-on-background] текстин өңг болн ора өңг
        [high-contrast] ик контрасттта өңг болн зургин һазр
        [line] зурасин өңг болн зургин һазр
        [marker] маркерин өңг болн зургин һазр
       *[text-on-canvas] текстин өңг болн зургин һазр
    } хоорндк контраст күрчәхш{ $mode ->
        [dark] { " (харңһу зүсн)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; яһад чигн { $threshold }:1 кергтә).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стилин тодрхлтд өггдсн өңгүд герлтә зүснд күрх контраст өгсн бийнь, теднәс һарсн харңһу зүснә өңгүд текст болн ора хоорнд күрх контраст өгчәхш ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; яһад чигн { $threshold }:1 кергтә). { $suggestion ->
        [available] Харңһу зүснд күрх контрастын төлә эсвл герлтә зүснә контраст икдүлтн (чиг { $lightAttribute }="{ $lightColor }"), эсвл харңһу зүснә өңг сольтн (чиг { $darkAttribute }="{ $darkColor }").
       *[none] Харңһу зүснд күрх контрастын төлә герлтә зүснә контраст икдүлтн эсвл һарсн өңгүдиг textColorDarkMode болн/эсвл backgroundColorDarkMode-ар сольтн.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стилин тодрхлтд өггдсн текстин өңг герлтә зүснд күрх контраст өгсн бийнь, түүнәс һарсн харңһу зүснә текстин өңг зургин һазрта күрх контраст өгчәхш ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; яһад чигн { $threshold }:1 кергтә). { $suggestion ->
        [available] Харңһу зүснд күрх контрастын төлә эсвл герлтә зүснә контраст икдүлтн (чиг textColor="{ $lightColor }"), эсвл харңһу зүснә өңг сольтн (чиг textColorDarkMode="{ $darkColor }").
       *[none] Харңһу зүснд күрх контрастын төлә герлтә зүснә контраст икдүлтн эсвл һарсн өңг textColorDarkMode-ар сольтн.
    }

section-multiple-style-palettes = Бөлг негн л <stylePalette> суңһҗ чадна; хөөтнь олзлгдна.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } деер давтгдшго вариантс тодрхлҗ чадшго, юңгад гихлә numToSelect сөрг биш бүклә то биш.

variant-num-to-select-not-constant-number = { $component } деер давтгдшго вариантс тодрхлҗ чадшго, юңгад гихлә numToSelect тогтмл то биш.

variant-with-replacement-not-constant-boolean = { $component } деер давтгдшго вариантс тодрхлҗ чадшго, юңгад гихлә withReplacement тогтмл логическ утх биш.

variant-select-weight-disables-unique = ямаран нег суңһврт selectWeight эсвл selectForVariants өггдсн болхла, select деер давтгдшго вариантс хаагдна

variant-coprime-undetermined = { $component } деер давтгдшго вариантс тодрхлҗ чадшго, юңгад гихлә coprime даңгин худл болҗахинь тодрхлҗ чадшго.

variant-attribute-not-constant = { $component } деер давтгдшго вариантс тодрхлҗ чадшго, юңгад гихлә { $attribute } тогтмл биш.

variant-attribute-not-number = { $component } деер давтгдшго вариантс тодрхлҗ чадшго, юңгад гихлә { $attribute } то биш.

variant-attribute-wrong-type-for-sequence =
    { $type } зүстә { $component } деер давтгдшго вариантс тодрхлҗ чадшго, юңгад гихлә { $attribute } { $expected ->
        [letters-combination] үзгүдин ниилвр
        [math-expression] таармҗта математическ илдквр
        [integer] бүклә то
       *[number] то
    } биш.

variant-length-not-integer = { $component } деер давтгдшго вариантс тодрхлҗ чадшго, юңгад гихлә length бүклә то биш.

variant-sort-not-implemented = sort бәәх { $component } деер давтгдшго вариантс кегдсн уга

variant-exclude-combinations-not-implemented = excludeCombinations бәәх { $component } деер давтгдшго вариантс кегдсн уга

variant-math-exclude-not-implemented = exclude бәәх math зүстә { $component } деер давтгдшго вариантс кегдсн уга

variant-non-constant-exclude-not-implemented = тогтмл биш exclude бәәх { $component } деер давтгдшго вариантс кегдсн уга

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графикин prefigure зурач деер кегдсн уга; үлдл хайгдв.

prefigure-descendant-invalid-geometry = { $subject }: төгсшго эсвл дүүрң биш геометр; үлдл хайгдв.

prefigure-curve-label-omitted = { $subject }: хүврүлгдсн мурул элементмүд деер темдгүд кегдсн уга; темдг хайгдв.

prefigure-curve-unsupported-definition-type = { $subject }: кегдсн уга мурул функцин тодрхлтын зүсн «{ $definitionType }»; үлдл хайгдв.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элемент деерк flipFunctions атрибут кегдсн уга; үлдл хайгдв.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формулар өггдсн үрн функцс л авна; үлдл хайгдв.

prefigure-label-position-unsupported =
    { $subject }: кегдсн уга labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] зурасин өрк-бүлин темдгт
       *[point] цегин темдгт
    }; PreFigure-ин ул әдллһн олзлгдна.

prefigure-fill-style-unsupported = { $subject }: дүүргһнә стиль «{ $fillStyle }» PreFigure деер кегдсн уга; дүүрң дүүргһн тал орна.

prefigure-line-style-unknown = { $subject }: медгддго зурасин стиль «{ $lineStyle }» PreFigure-ин һарлтас уга кегдв.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркерин стиль «{ $markerStyle }» PreFigure-ин «diamond» стильд таарулгдв.

prefigure-marker-style-unsupported = { $subject }: маркерин стиль «{ $markerStyle }» PreFigure деер кегдсн уга; ул стиль олзлгдна.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: буру `ref`; күсл залһҗ чадшго. Темдг уга кегдв.

annotation-ref-multiple-targets = `<annotation>`: `ref` кесг күслтә залһгдв; түрүннь олзлгдна.

annotation-ref-outside-graph = `<annotation>`: буру `ref`; күсл түүг багтадг графикас һаза. Темдг уга кегдв.

annotation-ref-unsupported-target = `<annotation>`: буру `ref`; күсл prefigure хүврлтд кегдсн график объект биш. Темдг уга кегдв.

annotation-text-missing = `<annotation>`: `text` уга эсвл хоосн; хоосн текст һарһгдна.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Төөргтә дүңгәлт олгдв.
       *[other] `<{ $componentType }>` компонент багтадг төөргтә дүңгәлт олгдв.
    }

reference-no-referent = Заавр деер объект олгдсн уга: `{ $reference }`

reference-multiple-referents = Заавр деер кесг объект олгдв: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементин { $attribute } атрибутын формат буру.

children-invalid = `<{ $componentType }>` деер буру үрд: буру үрд олгдв: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибут деер буру утх `{ $value }`; `{ $default }` утх олзлгдна

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } хүврлт олгдсн уга.
       *[other] DoenetML { $version } хүврлт олгдсн уга. { $fallback } хүврлт олзлгдна
    }

## Reading the DoenetML

parse-invalid-doenetml = Буру DoenetML: { $content }

parse-tag-missing-close-tag = Буру DoenetML: `{ $tag }` тегин хаадг тег уга. Эврән хаагддг тег эсвл `</{ $tagName }>` тег күләгдсн.

parse-tag-error = Буру DoenetML: `<{ $tagName }>` тегт эндү

parse-attribute-missing-value = Буру DoenetML: `{ $attribute }` атрибут деер утх дутҗахла әдл.

parse-attribute-invalid = Буру DoenetML: буру атрибут `{ $attribute }`

parse-attribute-value-invalid = Буру DoenetML: атрибутын буру утх `{ $value }`

parse-attribute-value-quote-mismatch = Буру DoenetML: атрибутын буру утх `{ $value }`. Хашлтс таарлго уга. `{ $quote }` дутҗахла әдл

parse-open-tag-name-missing = Буру DoenetML: нерн уга тег олгдв, чиг `<`

parse-tag-not-closed = Буру DoenetML: `{ $tag }` тег хаагдсн уга (`>` дутҗахла әдл).

parse-self-closing-tag-name-missing = Буру DoenetML: нерн уга тег олгдв `<{ $content }>`

parse-self-closing-tag-not-closed = Буру DoenetML: `{ $tag }` тег хаагдсн уга (`/>` дутҗахла әдл).

parse-tag-invalid-attributes = Буру DoenetML: `{ $tag }` тег таармҗта биш. Түүнә атрибутмуд буру болҗ чадна.

parse-close-tag-name-missing = Буру DoenetML: нерн уга хаадг тег олгдв, чиг `</`

parse-attribute-value-unquoted = Атрибутын утхс хашлт дотр болх зөвтә: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Буру DoenetML: `{ $tag }` хаадг тег олгдв, болв түүнд таарх секдг тег уга

parse-close-tag-mismatched = Буру DoenetML: таарлго уга хаадг тег. `</{ $expected }>` күләгдсн. `{ $found }` олгдв

parser-node-unconvertible = { $node } зангилаг Dast зангила болһҗ хүврүлҗ чадсн уга.

## Names

name-attribute-invalid =
    Буру атрибут name='{ $name }'. { $reason ->
        [characters] Нерднд үзгүд, тос, дор зурас эсвл зурас л бәәҗ чадна.
       *[start] Нерд үзгәс эклх зөвтә.
    }

component-name-invalid-start = Буру компонентин нерн «{ $name }». Нерд үзгәс эклх зөвтә.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched зүстә answer video атрибуттта болх зөвтә

answer-video-watched-video-not-reference = videoWatched зүстә answer-ин video атрибут заавр болх зөвтә

answer-name-not-single-text = answer-ин name атрибут яһ негн текстин үртә болх зөвтә

## Referencing another document

external-doenetml-recursion-limit = Рекурсин кемҗәс үлү олн болад һаза DoenetML авч чадсн уга. Төөргтә заавр угай?

external-doenetml-unavailable = { $attribute }="{ $uri }" адресәс DoenetML авч чадсн уга

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адресәс буру DoenetML авгдв: тер «{ $componentType }» компонентин зүснд таарсн уга

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут хуучрв; түүнә ормд `{ $to }` олзлтн.
       *[other] [deprecation] `<{ $component }>` элемент деерк `{ $from }` атрибут хуучрв; түүнә ормд `{ $to }` олзлтн.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут хуучрв болн тооллго уга, юңгад гихлә `{ $to }` чигн өггдсн.
       *[other] [deprecation] `<{ $component }>` элемент деерк `{ $from }` атрибут хуучрв болн тооллго уга, юңгад гихлә `{ $to }` чигн өггдсн.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элемент деерк `{ $attribute }` атрибут хуучрв болн тооллго уга.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элемент деерк `{ $attribute }` атрибут хуучрв; түүнә ормд `<{ $child }>` үрн олзлтн.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элемент деерк `{ $attribute }` атрибутын `{ $value }` утх хуучрв; түүнә ормд `{ $to }` олзлтн.


## Language coverage

pluralize-english-only = `<pluralize>` олн то англь келн деер л кеҗ чадна, тиигәд { $locale } келн деер бичгдсн бичгт түүнә текст хүврлго үлднә. Олн тон хевиг эврән бичтн эсвл түүг `pluralForm` атрибутар өгтн.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент таньгдсн Doenet элемент биш.

schema-element-not-allowed-at-root = `<{ $tag }>` элементд бичгин уңгд зөвшәрл өггдхш.

schema-element-not-allowed-inside = `<{ $tag }>` элементд `<{ $parent }>` дотр зөвшәрл өггдхш.

schema-attribute-unrecognized = `<{ $tag }>` элемент деер `{ $attribute }` нертә атрибут уга.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементин `{ $attribute }` атрибут элемент болһннь эднә негнь болдг списк болх зөвтә: { $allowed }
       *[other] `<{ $tag }>` элементин `{ $attribute }` атрибут эднә негнь болх зөвтә: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select деер буру вариантин нерн. { $variantName } вариантин нерн { $numOptions } суңһврт таарна, харм суңһх то { $numToSelect }.

select-variant-name-without-options = select деер вариантс өггдсн, болв болх вариантин нернд негн чигн суңһвр уга: { $variantName }.

select-variant-name-not-possible = select деер өггдсн { $variantName } вариантин нерн болх вариантин нерн биш.

select-too-few-options = Цугтан { $numOptions } дотрас { $numToSelect } компонент суңһҗ чадшго.

select-from-sequence-too-few-values = Утнь { $length } дарандас { $numToSelect } утх суңһҗ чадшго.

select-from-sequence-indices-count-mismatch = select деер өггдсн индексүдин то суңһх тод таарх зөвтә

select-from-sequence-indices-not-integers = select деер өггдсн цуг индексүд бүклә то болх зөвтә

select-from-sequence-index-excluded = selectfromsequence деер өггдсн индекс уга кегдсн бәәҗ

select-from-sequence-indices-excluded-combination = selectfromsequence деер өггдсн индексүд уга кегдсн ниилвр бәәҗ

select-from-sequence-coprime-not-positive-integers = Эерг бүклә тос суңһгдсн угаһар хоорндан әңгрхн ниилврмүд суңһҗ чадшго.

select-from-sequence-coprime-common-factor = Хоорндан әңгрхн тос суңһҗ чадшго. Цуг болх утхс негн әңглгчтә. (Өггдсн "from" эсвл "to" утхс "step"-тә хоорндан әңгрхн болх зөвтә.)

select-from-sequence-coprime-single-number = 1 биш негн л тоһас хоорндан әңгрхн ниилврмүд суңһҗ чадшго.

select-from-sequence-excluded-too-many-combinations = selectFromSequence дотр ниилврмүдин 70%-ас олнь уга кегдв

select-from-sequence-coprime-none-found = Хоорндан әңгрхн тос суңһҗ чадсн уга. Цуг болх утхс негн әңглгчтә.

select-from-sequence-too-few-unique-values = Утнь { $numPossibleValues } дарандас { $numToSelect } талдан утх суңһҗ чадшго

select-prime-numbers-too-few-values = Утнь { $numValues } әңгрхн тосин спискәс { $numToSelect } утх суңһҗ чадшго

select-prime-numbers-values-count-mismatch = select деер өггдсн утхсин то суңһх тод таарх зөвтә

select-prime-numbers-values-not-prime = select prime number деер өггдсн цуг утхс әңгрхн тосин списк дотр болх зөвтә

select-prime-numbers-values-excluded-combination = selectPrimeNumbers деер өггдсн утхс уга кегдсн ниилвр бәәҗ

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers дотр ниилврмүдин 70%-ас олнь уга кегдв

select-random-combination-fluke = Ик болшго учрар таварлта утхсин ниилвр суңһҗ чадсн уга

select-random-value-fluke = Ик болшго учрар таварлта утх суңһҗ чадсн уга
