# Sakha (Yakut) diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
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
# Sakha resolves exactly one plural category, so every counted message here is
# written flat and the selections English uses for `one`/`other` collapse to a
# single branch — see the note at the top of `chrome.ftl`.
#
# The technical nouns are Russian written in Sakha spelling, which is what
# written Sakha does with them: «компонент», «атрибут», «функция», «индекс».


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = икки төбө туочуката ыйыллыбытына { $attributes } аахсыллыбат

line-segment-attributes-ignored-with-endpoint-and-midpoint = төбө туочуката уонна ортоку туочука иккиэн ыйыллыбыттарына { $attributes } аахсыллыбат

line-segment-midpoint-offset-without-midpoint = ортоку туочуката суох midpointOffset туохха да дьайбат

## `<line>`

line-points-undetermined-dimensions = Кээмэйэ биллибэт туочукалар нөҥүө ааһар көнө сурааһын.

line-points-too-few-dimensions = Көнө сурааһын аҕыйаҕа икки кээмэйдээх туочукалар нөҥүө ааһыахтаах.

line-points-depend-on-variables = Көнө сурааһын уларыйар кээмэйдэртэн тутулуктаах туочукалар нөҥүө ааһар: { $variables }.

line-equation-invalid-format = { $variable1 } уонна { $variable2 } уларыйар кээмэйдээх көнө сурааһын тэҥэ сыыһа форматтаах.

## `<ray>`

ray-overprescribed-through = Сардаҥа through, endpoint уонна direction нөҥүө ыйыллыбыт. Ыйыллыбыт through аахсыллыбат.

ray-dimension-mismatch = сардаҥаҕа numDimensions сөп түбэспэт.

## `<vector>`

vector-overprescribed-head = Вектор head, tail уонна displacement нөҥүө ыйыллыбыт. Ыйыллыбыт head аахсыллыбат.

vector-dimension-mismatch = векторга numDimensions сөп түбэспэт.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элеменҥэ тардар кыах суох, тоҕо диэтэххэ кини nearestPoint турук кээмэйэ суох.

constrain-to-without-nearest-point = `<{ $component }>` элеменинэн хааччахтыыр кыах суох, тоҕо диэтэххэ кини nearestPoint турук кээмэйэ суох.

constrain-to-interior-without-nearest-point = `<{ $component }>` элемен иһинэн хааччахтыыр кыах суох, тоҕо диэтэххэ кини nearestPoint турук кээмэйэ суох.

## `<choiceInput>`

choice-input-label-position-ignored = строка иһигэр суох choiceInput туһугар labelPosition аахсыллыбат

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput туһугар ыйыллыбыт индекстэр аахсыллыбаттар, тоҕо диэтэххэ ахсааннара choice оҕолорун ахсаанын кытта сөп түбэспэт.

pretzel-indices-count-mismatch = problem туһугар ыйыллыбыт индекстэр аахсыллыбаттар, тоҕо диэтэххэ ахсааннара problem оҕолорун ахсаанын кытта сөп түбэспэт.

shuffle-indices-count-mismatch = shuffle туһугар ыйыллыбыт индекстэр аахсыллыбаттар, тоҕо диэтэххэ ахсааннара компонент ахсаанын кытта сөп түбэспэт.

indices-ignored-out-of-range = { $component } туһугар ыйыллыбыт индекстэр аахсыллыбаттар, тоҕо диэтэххэ сорохторо кээмэйтэн тахсаллар.

pretzel-indices-repeated = pretzel туһугар ыйыллыбыт индекстэр аахсыллыбаттар, тоҕо диэтэххэ сорохторо хатыланаллар.

pretzel-circuit-first-index = circuit режимҥэ pretzel туһугар ыйыллыбыт индекстэр аахсыллыбаттар, тоҕо диэтэххэ бастакы индекс 1 буолуохтаах.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` тиэкис оҕолорун кытта үлэлиир туһугар `type` атрибут ыйыллыахтаах.

invalid-type-defaulting-to-math = { $component } компонеҥҥа сыыһа көрүҥ { $type }. Кини math, text, number эбэтэр boolean буолуохтаах. math туттуллар.

string-not-valid-component-to-arrange = «{ $value }» строка { $component } туһугар сөптөөх компонент буолбатах. Аахсыллыбат.

## Types and variables

invalid-type-defaulting-to-number = Сыыһа көрүҥ { $type }, көрүҥэ number буолар.

invalid-variable-value = Уларыйар кээмэй сыыһа суолтата: `{ $value }`

## Variants

variant-index-must-be-number = { $index } барыйаан индексэ ахсаан буолуохтаах

variant-index-must-be-integer = { $index } барыйаан индексэ бүтүн ахсаан буолуохтаах

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют кээмэйдэргэ оҥоһуллубатах. Кэтиттэрэ тэҥнээх буолаллар.

side-by-side-absolute-margins = `<{ $component }>` абсолют кээмэйдэргэ оҥоһуллубатах. Кыраныыстара тэҥнээх буолаллар.

side-by-side-no-block-child = Сыыһа `<{ $component }>`: кини аҕыйаҕа биир блок оҕолоох буолуохтаах.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элеменин `for` атрибута аахсыллыбат.

label-for-must-resolve-to-one = `<label>` элемен `for` атрибута биир эрэ компоненҥа ыйыахтаах.

label-for-unresolved = `<label>` элемен `for` атрибутун компонеҥҥа сибээстиир кыах суох.

label-for-answer-with-authored-inputs = `<label>` элемен `for` атрибута ааптар суруйбут киллэрии хонуулаах `<answer>` диэки ыйар; хонууну быһаччы ыйыҥ.

label-for-answer-without-input = `<label>` элемен `for` атрибута бэлиэтиир киллэрии хонуута суох `<answer>` диэки ыйар.

label-for-must-reference-input-or-answer = `<label>` элемен `for` атрибута киллэрии хонуутугар эбэтэр хоруйга ыйыахтаах.

## Accessibility

accessibility-short-description-or-decorative = Туттуллар кыах туһугар `<{ $component }>` кылгас быһаарыылаах буолуохтаах эбэтэр оҥоһуу быһыытынан бэлиэтэниэхтээх.

accessibility-video-short-description = Туттуллар кыах туһугар `<video>` кылгас быһаарыылаах буолуохтаах.

accessibility-input-short-description-or-label = Туттуллар кыах туһугар `<{ $component }>` кылгас быһаарыылаах эбэтэр бэлиэлээх буолуохтаах.

accessibility-answer-input-short-description-or-label = Туттуллар кыах туһугар киллэрии хонуутун оҥорор `<answer>` кылгас быһаарыылаах эбэтэр бэлиэлээх буолуохтаах.

accessibility-short-description-contains-math = Кылгас быһаарыыларга `<{ $component }>` курдук математика компонена буолуо суохтаах. Математиканы тылынан суруй.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } салаа баһын тиэкиһигэр тиийэр контраһы биэрбэт (хараҥа көрүҥ) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; аҕыйаҕа { $threshold }:1 наада).
       *[other] { $colorName } салаа баһын тиэкиһигэр тиийэр контраһы биэрбэт ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; аҕыйаҕа { $threshold }:1 наада).
    }

## `<circle>`

circle-through-points-non-numerical = Туочукалар ахсаан суолталара суох буоллахтарына { $count } туочука нөҥүө ааһар `<circle>` оҥоһуллубатах.

circle-too-many-through-points = 3-тэн ордук туочука нөҥүө ааһар түгэриги ааҕар кыах суох.

circle-overprescribed-radius-center-points = Ыйыллыбыт радиус, киин уонна туочукалар кытта түгэриги ааҕар кыах суох.

circle-center-with-multiple-points = Ыйыллыбыт кииннээх 1-тэн ордук туочука нөҥүө ааһар түгэриги ааҕар кыах суох.

circle-radius-too-small = Түгэриги ааҕар кыах суох: икки туочука икки ардыгар ыраах { $distance } буолан, ыйыллыбыт радиус { $radius } наһаа кыра.

circle-radius-with-many-points = Ыйыллыбыт радиустаах иккиттэн ордук туочука нөҥүө ааһар түгэриги оҥорор кыах суох.

circle-invalid-center-or-through-points = Түгэрик киинэ эбэтэр туочукалара сыыһалар.

circle-radius-center-with-multiple-points = Ыйыллыбыт кииннээх 1-тэн ордук туочука нөҥүө ааһар түгэрик радиуһун ааҕар кыах суох.

circle-change-radius-non-numerical = Ахсаана суох туочукалаах түгэрик радиуһун уларытар кыах суох

circle-radius-with-points-non-numerical = Ахсаан суолталара суох буоллахтарына ыйыллыбыт радиустаах биирдэн ордук туочука нөҥүө ааһар түгэриги оҥорор кыах суох.

circle-change-center-non-numerical = Ахсаана суох туочукалар нөҥүө ааһар түгэрик киинин уларытыы оҥоһуллубатах.

## `<function>`

function-domain-insufficient-dimensions = Функция быһаарыллар сирин кээмэйэ тиийбэт. Сиргэ { $intervals } кэрчик баар, функцияҕа { $inputs } киллэрии баар.

function-domain-invalid-format = Функция быһаарыллар сирэ сыыһа форматтаах.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функция ахсаана суох максимума аахсыллыбат.
        [minimum] Функция ахсаана суох минимума аахсыллыбат.
        [extremum] Функция ахсаана суох экстремума аахсыллыбат.
        [point] Функция ахсаана суох туочуката аахсыллыбат.
        [slope] Функция ахсаана суох таҥнарыыта аахсыллыбат.
       *[other] Функция ахсаана суох { $type } суолтата аахсыллыбат.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функция кураанах максимума аахсыллыбат.
        [minimum] Функция кураанах минимума аахсыллыбат.
        [extremum] Функция кураанах экстремума аахсыллыбат.
        [point] Функция кураанах туочуката аахсыллыбат.
       *[other] Функция кураанах { $type } суолтата аахсыллыбат.
    }

function-points-too-close = Функцияҕа биир биирдэригэр наһаа чугас икки туочука баар. Функцияны быһаарар кыах суох.

function-iterates-input-output-mismatch = Функция итерациялара киллэрии ахсаана таһаарыы ахсаанын кытта тэҥнэһэр эрэ түгэнигэр кыаллаллар. Бу функцияҕа { $inputs } киллэрии уонна { $outputs } таһаарыы баар.

## `<sequence>`

sequence-invalid-length = Кэккэ уһуна сыыһа. Кини минуһа суох бүтүн ахсаан буолуохтаах.

sequence-invalid-step = Кэккэ хаамыыта сыыһа. { $type } көрүҥнээх кэккэҕэ кини ахсаан буолуохтаах.

sequence-invalid-endpoint-number = Ахсаан кэккэтин «{ $attribute }» суолтата сыыһа. Кини ахсаан буолуохтаах.

sequence-invalid-endpoint-letters = Буукуба кэккэтин «{ $attribute }» суолтата сыыһа. Кини буукубалар холбоһуктара буолуохтаах.

sequence-invalid-endpoint = Кэккэ «{ $attribute }» суолтата сыыһа.

select-from-sequence-coprime-not-numbers = ахсааннар талыллыбатахтарынан coprime аахсыллыбат

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations ыйыллыбытынан coprime аахсыллыбат

## Resolving a `target`

target-not-found = `<{ $source }>` туһугар сыыһа target: сыал булуллубата.

target-state-variable-not-found = `<{ $source }>` туһугар сыыһа target: `<{ $component }>` элеменҥэ «{ $property }» диэн ааттаах турук кээмэйэ булуллубата.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` уларыйар кээмэйдэрэ тутулуга суох кээмэйтэн уратылаах буолуохтаахтар.

ode-system-duplicate-variable-names = Тутулуктаах кээмэйдэр ааттара хатыланар буоллахтарына ДТ уҥа өттүн функцияларын быһаарар кыах суох.

ode-system-rhs-function-error = ДТ уҥа өттүн функциятын быһаарар кыах суох. mathjs функциятын оҥорорго алҕас.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } көнө сурааһын икки ардыгар муннугу быһаарар кыах суох

angle-invalid-through-point = `<angle>` элемен through суолтатыгар сыыһа туочука

parabola-vertex-too-many-points = Ыйыллыбыт төбөлөөх 1-тэн ордук туочука нөҥүө ааһар парабола оҥоһуллубатах.

parabola-too-many-points = 3-тэн ордук туочука нөҥүө ааһар парабола оҥоһуллубатах.

intersection-too-many-items = Иккиттэн ордук объект кирилиэһэ оҥоһуллубатах

## Other math components

ionic-compound-not-two-ions = Икки иоҥҥа эрэ ион холбоһуга оҥоһуллубут.

ionic-compound-needs-cation-and-anion = Ион холбоһуга биир катиоҥҥа уонна биир аниоҥҥа эрэ оҥоһуллубут.

solve-equations-cannot-evaluate = Тэҥи быһаарар кыах суох, тоҕо диэтэххэ кинини ааҕар кыах суох этэ: { $equation }

math-operators-operand-number-required = Математика операнын араарарга operandNumber ыйыллыахтаах.

eigen-decomposition-failed = Матрица бэйэтин суолталарын ааҕар кыах суоҕа

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: { $parameters } параметр холобурга көстүбэт, онон кини куруук кураанаҕы кытта сөп түбэһэр.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" суолтатын өйдүүр кыах суох. Кини none, medium, dense эбэтэр кураанах миэстэнэн арахсыбыт икки плюстаах ахсаан буолуохтаах, холобур grid="1 0.5". Сиэккэ оҥоһуллубат.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure ойуулааччытыгар xLabelPosition="left" оҥоһуллубатах; уҥа туруу туттуллар.

prefigure-y-label-position-unsupported = `<graph>`: prefigure ойуулааччытыгар yLabelPosition="bottom" оҥоһуллубатах; үөһэ туруу туттуллар.

prefigure-invalid-axis-bounds = `<graph>`: prefigure көһөрүүтүгэр өҥүөс кыраныыстара сыыһалар; сүрүн bbox (-10,-10,10,10) туттуллар.

prefigure-invalid-width = `<graph>`: prefigure көһөрүүтүгэр кэтит сыыһа; диаграмма сүрүн кэтитэ 425 туттуллар.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure көһөрүүтүгэр aspectRatio сыыһа; сүрүн өттүлэр сыһыаннара 1 туттуллар.

prefigure-grid-spacing-too-fine = `<graph>`: сиэккэ хаамыыта өҥүөс кыраныыстарыгар наһаа кыра; prefigure ойуулааччытыгар сиэккэ таһаарыллыбат.

prefigure-annotations-not-rendered = `<graph>`: PreFigure ойуулааччыта туттуллубатаҕына бэлиэтээһиннэр оҥоһуллубаттар.

multiple-annotations-children = `<graph>` иһигэр хас да `<annotations>` оҕото булулунна; бүтэһигиттэн ураты бары аахсыллыбаттар.

## Referring to other components

copy-unrecognized-component-type = Биллибэт компонент көрүҥүн кэҥэтэр эбэтэр көһөрөр кыах суох: { $type }.

copy-prop-not-found = { $component } көрүҥнээх компонеҥҥа { $property } бэлиэтэ булуллубата

collect-no-source = collect туһугар төрүт булуллубата.

collect-invalid-component-type = `<{ $component }>` көрүҥнээх компоненнары хомуйар кыах суох, тоҕо диэтэххэ бу сыыһа компонент көрүҥэ.

reference-index-unavailable = `{ $reference }` индекскэ ыйыы оҥорор кыах суох

## `<callAction>`

component-action-unavailable = `{ $reference }` компонеҥҥа { $action } ыҥырар кыах суох

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Даннайдар форматтара сыыһа. Строкалар уһуннара атын-атын. Булулунна componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Даннайдарга колонка ааттара хатыланаллар. Булулунна componentIdx :{ $componentIdx }

data-frame-missing-column-name = Даннайдарга колонка аата тиийбэт. Булулунна componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Бу хоруй award суолтата answer тиэг бэйэтин ыытыллыбыт хоруйугар олоҕурар, бу күүппэтэх түмүккэ тиэрдэр.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` баар контейнер иһинээҕи `<answer>` диэки `maxNumAttempts` туруоруу дьайбат, тоҕо диэтэххэ боруобалыыр ахсааны контейнер быһаарар. `maxNumAttempts` суолтатын контейнерга туруор.

nested-section-wide-check-work-max-num-attempts = Атын `sectionWideCheckWork` контейнер иһинээҕи `sectionWideCheckWork` контейнерга `maxNumAttempts` туруоруу дьайбат, тоҕо диэтэххэ боруобалыыр ахсааны таһынааҕы контейнер быһаарар. `maxNumAttempts` суолтатын таһынааҕы контейнерга туруор.

answer-attributes-need-symbolic-equality = symbolicEquality туруорулла илигинэ { $attributes } атрибут туохха да дьайыа суоҕа.

answer-invalid-type = answer туһугар сыыһа көрүҥ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонент аата суоҕунан кинини модуль атрибутун быһыытынан туттар кыах суох

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонену модуль атрибутун быһыытынан туттар кыах суох, тоҕо диэтэххэ `<module>` компонент көрүҥэр «{ $name }» атрибут быһаарыллыбыт.

conditional-content-condition-ignored = case эбэтэр else оҕолордоох `<conditionalContent>` компонеҥҥа `condition` атрибут аахсыллыбат.

slider-markers-type-mismatch = Маркердар көрүҥнэрэ ползунок көрүҥүн кытта сөп түбэспэт.

pretzel-problem-needs-statement-and-answer = Сыыһа pretzel: хас `<problem>` барыта биир `<statement>` уонна биир `<answer>` иһиниэхтээх.

pretzel-circuit-first-problem-distractor = Сыыһа pretzel: mode="circuit" режимҥэ бастакы `<problem>` дистрактор буолуо суохтаах.

## Attribute values

attribute-invalid-values = `{ $attribute }` атрибукка сыыһа суолта { $values }; аахсыллыбат.

attribute-must-be-references = `{ $attribute }` атрибукка сыыһа суолта `{ $value }`. Атрибут `$` бэлиэттэн саҕаланар ыйыылартан турар буолуохтаах.

math-input-invalid-function-names = <mathInput>: { $attribute } иһинээҕи сыыһа функция ааттара аахсыллыбатылар: { $names }. Хас ааттан көстөр чааһа аҕыйаҕа 2 бэлиэ буолуохтаах (буукубалар эбэтэр тиирэ); кэнниттэн наадата суох `|<mathspeak альтернатива>` эбии кэлиэн сөп.

## Building components from the source

component-type-invalid = Сыыһа компонент көрүҥэ: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибуту хатылыыр кыах суох.

attribute-invalid-for-component = `<{ $componentType }>` көрүҥнээх компоненҥа сыыһа атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } истиил быһаарыытыгар { $context ->
        [text-on-background] тиэкис өҥө уонна фон өҥө
        [high-contrast] үрдүк контрастаах өҥ уонна ойуу сирэ
        [line] сурааһын өҥө уонна ойуу сирэ
        [marker] маркер өҥө уонна ойуу сирэ
       *[text-on-canvas] тиэкис өҥө уонна ойуу сирэ
    } икки ардыгар контрас тиийбэт{ $mode ->
        [dark] { " (хараҥа көрүҥ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; аҕыйаҕа { $threshold }:1 наада).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } истиил быһаарыытыгар ыйыллыбыт өҥнөр сырдык көрүҥҥэ тиийэр контраһы биэрбиттэрин үрдүнэн, кинилэртэн тахсыбыт хараҥа көрүҥ өҥнөрө тиэкис уонна фон икки ардыгар тиийэр контраһы биэрбэттэр ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; аҕыйаҕа { $threshold }:1 наада). { $suggestion ->
        [available] Хараҥа көрүҥҥэ тиийэр контраһы оҥорорго сырдык көрүҥ контраһын улаат (холобур { $lightAttribute }="{ $lightColor }") эбэтэр хараҥа көрүҥ өҥүн уларыт (холобур { $darkAttribute }="{ $darkColor }").
       *[none] Хараҥа көрүҥҥэ тиийэр контраһы оҥорорго сырдык көрүҥ контраһын улаат эбэтэр тахсыбыт өҥнөрү textColorDarkMode уонна/эбэтэр backgroundColorDarkMode нөҥүө уларыт.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } истиил быһаарыытыгар ыйыллыбыт тиэкис өҥө сырдык көрүҥҥэ тиийэр контраһы биэрбитин үрдүнэн, кинитээҕэр тахсыбыт хараҥа көрүҥ тиэкис өҥө ойуу сирин кытта тиийэр контраһы биэрбэт ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; аҕыйаҕа { $threshold }:1 наада). { $suggestion ->
        [available] Хараҥа көрүҥҥэ тиийэр контраһы оҥорорго сырдык көрүҥ контраһын улаат (холобур textColor="{ $lightColor }") эбэтэр хараҥа көрүҥ өҥүн уларыт (холобур textColorDarkMode="{ $darkColor }").
       *[none] Хараҥа көрүҥҥэ тиийэр контраһы оҥорорго сырдык көрүҥ контраһын улаат эбэтэр тахсыбыт өҥү textColorDarkMode нөҥүө уларыт.
    }

section-multiple-style-palettes = Салаа биир эрэ <stylePalette> талыан сөп; бүтэһигэ туттуллар.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } туһугар хатыламмат барыйааннары быһаарар кыах суох, тоҕо диэтэххэ numToSelect минуһа суох бүтүн ахсаан буолбатах.

variant-num-to-select-not-constant-number = { $component } туһугар хатыламмат барыйааннары быһаарар кыах суох, тоҕо диэтэххэ numToSelect уларыйбат ахсаан буолбатах.

variant-with-replacement-not-constant-boolean = { $component } туһугар хатыламмат барыйааннары быһаарар кыах суох, тоҕо диэтэххэ withReplacement уларыйбат логика суолтата буолбатах.

variant-select-weight-disables-unique = ханнык эмэ талыыга selectWeight эбэтэр selectForVariants ыйыллыбыт буоллаҕына, select туһугар хатыламмат барыйааннар араарыллаллар

variant-coprime-undetermined = { $component } туһугар хатыламмат барыйааннары быһаарар кыах суох, тоҕо диэтэххэ coprime куруук сыыһа дуо диэни быһаарар кыах суох.

variant-attribute-not-constant = { $component } туһугар хатыламмат барыйааннары быһаарар кыах суох, тоҕо диэтэххэ { $attribute } уларыйбат буолбатах.

variant-attribute-not-number = { $component } туһугар хатыламмат барыйааннары быһаарар кыах суох, тоҕо диэтэххэ { $attribute } ахсаан буолбатах.

variant-attribute-wrong-type-for-sequence =
    { $type } көрүҥнээх { $component } туһугар хатыламмат барыйааннары быһаарар кыах суох, тоҕо диэтэххэ { $attribute } { $expected ->
        [letters-combination] буукубалар холбоһуктара
        [math-expression] сөптөөх математика этиитэ
        [integer] бүтүн ахсаан
       *[number] ахсаан
    } буолбатах.

variant-length-not-integer = { $component } туһугар хатыламмат барыйааннары быһаарар кыах суох, тоҕо диэтэххэ length бүтүн ахсаан буолбатах.

variant-sort-not-implemented = sort баар { $component } туһугар хатыламмат барыйааннар оҥоһуллубатахтар

variant-exclude-combinations-not-implemented = excludeCombinations баар { $component } туһугар хатыламмат барыйааннар оҥоһуллубатахтар

variant-math-exclude-not-implemented = exclude баар math көрүҥнээх { $component } туһугар хатыламмат барыйааннар оҥоһуллубатахтар

variant-non-constant-exclude-not-implemented = уларыйар exclude баар { $component } туһугар хатыламмат барыйааннар оҥоһуллубатахтар

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: график prefigure ойуулааччытыгар оҥоһуллубатах; утума хаалларылынна.

prefigure-descendant-invalid-geometry = { $subject }: бүппэт эбэтэр толору буолбатах геометрия; утума хаалларылынна.

prefigure-curve-label-omitted = { $subject }: көһөрүллүбүт токур элеменнэргэ бэлиэлэр оҥоһуллубатахтар; бэлиэ хаалларылынна.

prefigure-curve-unsupported-definition-type = { $subject }: оҥоһуллубатах токур функция быһаарыытын көрүҥэ «{ $definitionType }»; утума хаалларылынна.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элеменин flipFunctions атрибута оҥоһуллубатах; утума хаалларылынна.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формулалаах оҕо функциялары эрэ ылынар; утума хаалларылынна.

prefigure-label-position-unsupported =
    { $subject }: оҥоһуллубатах labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] сурааһыннар ыаллара бэлиэлэригэр
       *[point] туочука бэлиэтигэр
    }; PreFigure сүрүн тэҥнээһинэ туттуллар.

prefigure-fill-style-unsupported = { $subject }: толоруу истиилэ «{ $fillStyle }» PreFigure-га оҥоһуллубатах; толору толорууга көһөр.

prefigure-line-style-unknown = { $subject }: биллибэт сурааһын истиилэ «{ $lineStyle }» PreFigure таһаарыытыттан соруллунна.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер истиилэ «{ $markerStyle }» PreFigure «diamond» истиилигэр сөп түбэһиннэрилиннэ.

prefigure-marker-style-unsupported = { $subject }: маркер истиилэ «{ $markerStyle }» PreFigure-га оҥоһуллубатах; сүрүн истиил туттуллар.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: сыыһа `ref`; сыалы сибээстиир кыах суох. Бэлиэтээһин соруллунна.

annotation-ref-multiple-targets = `<annotation>`: `ref` хас да сыалы кытта сибээстэстэ; бастакыта туттуллар.

annotation-ref-outside-graph = `<annotation>`: сыыһа `ref`; сыал кинини иһитиннэрэр графиктан тас өттүгэр. Бэлиэтээһин соруллунна.

annotation-ref-unsupported-target = `<annotation>`: сыыһа `ref`; сыал prefigure көһөрүүтүгэр оҥоһуллубут график объект буолбатах. Бэлиэтээһин соруллунна.

annotation-text-missing = `<annotation>`: `text` суох эбэтэр кураанах; кураанах тиэкис таһаарыллар.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Түгэрик тутулук булулунна.
       *[other] `<{ $componentType }>` компонену иһитиннэрэр түгэрик тутулук булулунна.
    }

reference-no-referent = Ыйыыга объект булуллубата: `{ $reference }`

reference-multiple-referents = Ыйыыга хас да объект булулунна: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элемен { $attribute } атрибута сыыһа форматтаах.

children-invalid = `<{ $componentType }>` туһугар сыыһа оҕолор: сыыһа оҕолор булуллулар: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибукка сыыһа суолта `{ $value }`; `{ $default }` суолта туттуллар

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } барыла булуллубата.
       *[other] DoenetML { $version } барыла булуллубата. { $fallback } барыла туттуллар
    }

## Reading the DoenetML

parse-invalid-doenetml = Сыыһа DoenetML: { $content }

parse-tag-missing-close-tag = Сыыһа DoenetML: `{ $tag }` тиэг сабар тиэгэ суох. Бэйэтэ сабыллар тиэг эбэтэр `</{ $tagName }>` тиэг күүтүллүбүтэ.

parse-tag-error = Сыыһа DoenetML: `<{ $tagName }>` тиэккэ алҕас

parse-attribute-missing-value = Сыыһа DoenetML: `{ $attribute }` атрибукка суолта тиийбэтэҕэ буолуо.

parse-attribute-invalid = Сыыһа DoenetML: сыыһа атрибут `{ $attribute }`

parse-attribute-value-invalid = Сыыһа DoenetML: атрибут сыыһа суолтата `{ $value }`

parse-attribute-value-quote-mismatch = Сыыһа DoenetML: атрибут сыыһа суолтата `{ $value }`. Тырнахтар сөп түбэспэттэр. `{ $quote }` тиийбэтэҕэ буолуо

parse-open-tag-name-missing = Сыыһа DoenetML: аата суох тиэг булулунна, холобур `<`

parse-tag-not-closed = Сыыһа DoenetML: `{ $tag }` тиэг сабыллыбатах (`>` тиийбэтэҕэ буолуо).

parse-self-closing-tag-name-missing = Сыыһа DoenetML: аата суох тиэг булулунна `<{ $content }>`

parse-self-closing-tag-not-closed = Сыыһа DoenetML: `{ $tag }` тиэг сабыллыбатах (`/>` тиийбэтэҕэ буолуо).

parse-tag-invalid-attributes = Сыыһа DoenetML: `{ $tag }` тиэг сөптөөх буолбатах. Атрибуттара сыыһа буолуохтарын сөп.

parse-close-tag-name-missing = Сыыһа DoenetML: аата суох сабар тиэг булулунна, холобур `</`

parse-attribute-value-unquoted = Атрибут суолталара тырнах иһигэр буолуохтаахтар: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Сыыһа DoenetML: `{ $tag }` сабар тиэг булулунна, ол эрээри кинини сөп түбэһэр аһар тиэг суох

parse-close-tag-mismatched = Сыыһа DoenetML: сөп түбэспэт сабар тиэг. `</{ $expected }>` күүтүллүбүтэ. `{ $found }` булулунна

parser-node-unconvertible = { $node } түмүгү Dast түмүгэр көһөрөр кыах суоҕа.

## Names

name-attribute-invalid =
    Сыыһа атрибут name='{ $name }'. { $reason ->
        [characters] Ааттарга буукубалар, ахсааннар, аллараа тиирэ эбэтэр тиирэ эрэ буолуохтарын сөп.
       *[start] Ааттар буукубаттан саҕаланыахтаахтар.
    }

component-name-invalid-start = Сыыһа компонент аата «{ $name }». Ааттар буукубаттан саҕаланыахтаахтар.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched көрүҥнээх answer video атрибуттаах буолуохтаах

answer-video-watched-video-not-reference = videoWatched көрүҥнээх answer video атрибута ыйыы буолуохтаах

answer-name-not-single-text = answer name атрибута биир эрэ тиэкис оҕолоох буолуохтаах

## Referencing another document

external-doenetml-recursion-limit = Рекурсия таһымнара наһаа элбэхтэринэн тас DoenetML-ы ылар кыах суоҕа. Түгэрик ыйыы суох дуо?

external-doenetml-unavailable = { $attribute }="{ $uri }" аадырыстан DoenetML ылар кыах суоҕа

external-doenetml-type-mismatch = { $attribute }="{ $uri }" аадырыстан сыыһа DoenetML ылылынна: кини «{ $componentType }» компонент көрүҥүн кытта сөп түбэспэтэ

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут эргэрбит; оннугар `{ $to }` тут.
       *[other] [deprecation] `<{ $component }>` элеменнээҕи `{ $from }` атрибут эргэрбит; оннугар `{ $to }` тут.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут эргэрбит уонна аахсыллыбат, тоҕо диэтэххэ `{ $to }` эмиэ ыйыллыбыт.
       *[other] [deprecation] `<{ $component }>` элеменнээҕи `{ $from }` атрибут эргэрбит уонна аахсыллыбат, тоҕо диэтэххэ `{ $to }` эмиэ ыйыллыбыт.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элеменнээҕи `{ $attribute }` атрибут эргэрбит уонна аахсыллыбат.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элеменнээҕи `{ $attribute }` атрибут эргэрбит; оннугар `<{ $child }>` оҕотун тут.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элеменнээҕи `{ $attribute }` атрибут `{ $value }` суолтата эргэрбит; оннугар `{ $to }` тут.


## Language coverage

pluralize-english-only = `<pluralize>` элбэх ахсааны английскай тылга эрэ оҥорор, онон { $locale } тылынан суруллубут дьокумуоҥҥа кини тиэкиһэ уларыйбакка хаалар. Элбэх ахсаан формата бэйэҥ суруй эбэтэр кинини `pluralForm` атрибутунан ыйан биэр.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемен биллэр Doenet элемена буолбатах.

schema-element-not-allowed-at-root = `<{ $tag }>` элеменҥэ дьокумуон силигэр көҥүл биэриллибэт.

schema-element-not-allowed-inside = `<{ $tag }>` элеменҥэ `<{ $parent }>` иһигэр көҥүл биэриллибэт.

schema-attribute-unrecognized = `<{ $tag }>` элеменҥэ `{ $attribute }` диэн ааттаах атрибут суох.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элемен `{ $attribute }` атрибута хас элемена барыта маннык буолар испииһэк буолуохтаах: { $allowed }
       *[other] `<{ $tag }>` элемен `{ $attribute }` атрибута маннык буолуохтаах: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select туһугар сыыһа барыйаан аата. { $variantName } барыйаан аата { $numOptions } талыыга көстөр, талыллыахтаах ахсаан эбэтэр { $numToSelect }.

select-variant-name-without-options = select туһугар барыйааннар ыйыллыбыттар, ол эрээри кыаллар барыйаан аатыгар биир да талыы суох: { $variantName }.

select-variant-name-not-possible = select туһугар ыйыллыбыт { $variantName } барыйаан аата кыаллар барыйаан аата буолбатах.

select-too-few-options = Барыта { $numOptions } иһиттэн { $numToSelect } компонену талар кыах суох.

select-from-sequence-too-few-values = Уһуна { $length } кэккэттэн { $numToSelect } суолтаны талар кыах суох.

select-from-sequence-indices-count-mismatch = select туһугар ыйыллыбыт индекстэр ахсааннара талыллыахтаах ахсааны кытта сөп түбэһиэхтээхтэр

select-from-sequence-indices-not-integers = select туһугар ыйыллыбыт бары индекстэр бүтүн ахсаан буолуохтаахтар

select-from-sequence-index-excluded = selectfromsequence туһугар ыйыллыбыт индекс соруллубута

select-from-sequence-indices-excluded-combination = selectfromsequence туһугар ыйыллыбыт индекстэр соруллубут холбоһук этилэр

select-from-sequence-coprime-not-positive-integers = Плюстаах бүтүн ахсааннар талыллыбатахтарынан бэйэ-бэйэлэригэр судургу холбоһуктары талар кыах суох.

select-from-sequence-coprime-common-factor = Бэйэ-бэйэлэригэр судургу ахсааннары талар кыах суох. Кыаллар бары суолталар биир үллэстээччилээхтэр. (Ыйыллыбыт "from" эбэтэр "to" суолталара "step" кытта бэйэ-бэйэлэригэр судургу буолуохтаахтар.)

select-from-sequence-coprime-single-number = 1 буолбатах биир эрэ ахсаантан бэйэ-бэйэлэригэр судургу холбоһуктары талар кыах суох.

select-from-sequence-excluded-too-many-combinations = selectFromSequence иһигэр холбоһуктар 70%-тан ордуга соруллубут

select-from-sequence-coprime-none-found = Бэйэ-бэйэлэригэр судургу ахсааннары талар кыах суоҕа. Кыаллар бары суолталар биир үллэстээччилээхтэр.

select-from-sequence-too-few-unique-values = Уһуна { $numPossibleValues } кэккэттэн { $numToSelect } атын-атын суолтаны талар кыах суох

select-prime-numbers-too-few-values = Уһуна { $numValues } судургу ахсааннар испииһэктэриттэн { $numToSelect } суолтаны талар кыах суох

select-prime-numbers-values-count-mismatch = select туһугар ыйыллыбыт суолталар ахсааннара талыллыахтаах ахсааны кытта сөп түбэһиэхтээхтэр

select-prime-numbers-values-not-prime = select prime number туһугар ыйыллыбыт бары суолталар судургу ахсааннар испииһэктэригэр буолуохтаахтар

select-prime-numbers-values-excluded-combination = selectPrimeNumbers туһугар ыйыллыбыт суолталар соруллубут холбоһук этилэр

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers иһигэр холбоһуктар 70%-тан ордуга соруллубут

select-random-combination-fluke = Олус кыаллыбат түбэлтэ түмүгэр түбэлтэлээх суолталар холбоһуктарын талар кыах суоҕа

select-random-value-fluke = Олус кыаллыбат түбэлтэ түмүгэр түбэлтэлээх суолтаны талар кыах суоҕа
