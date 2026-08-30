# Khakas diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Cyrillic in the standard Khakas alphabet, with **і ғ ң ӧ ӱ ӌ** as full
# letters — the same convention as the other three files of this locale.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# HOW THIN THIS IS. Khakas has no written register for software diagnostics at
# all, so this file is a first attempt throughout, and the Russian words stand
# wherever nothing Khakas could be established: `компонент`, `атрибут`,
# `функция`, `индекс`, `массив`, `матрица`, `параметр`, `формат`, `версия`,
# `рекурсия`, `строка`, `столбец`, `точка`, `координата`. Written Khakas takes
# such a loan in its Russian spelling, so that is how they appear.
#
# Khakas puts its verb last and its modifiers in front of what they modify, so
# these sentences are reordered rather than substituted into an English frame.
# Every count selection is a single `*[other]`: Khakas does not mark number
# after a numeral, and `Intl.PluralRules` has no data for `kjh` with which a
# `[one]` branch could ever be selected.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] ікі учы кӧзіділгенде { $attributes } санға алылбинча
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] учы паза ортызы хада кӧзіділгенде { $attributes } санға алылбинча
    }

line-segment-midpoint-offset-without-midpoint = ортызы чох midpointOffset ноға да салтар итпинче

## `<line>`

line-points-undetermined-dimensions = Кӧрімі таныхталбаан точкалар пастыра иртчеткен тӱс сызых.

line-points-too-few-dimensions = Тӱс сызых ин азында ікі кӧрімніг точкалар пастыра иртерге кирек.

line-points-depend-on-variables = Тӱс сызых пасхаланчатхан нимелернең хабынған точкалар пастыра иртче: { $variables }.

line-equation-invalid-format = { $variable1 } паза { $variable2 } нимелернең пазылған тӱс сызых уравнениезінің форматы чарабас.

## `<ray>`

ray-overprescribed-through = Луч through, endpoint паза direction пастыра пирілген. Кӧзіділген through санға алылбинча.

ray-dimension-mismatch = лучта numDimensions чарасчабинча.

## `<vector>`

vector-overprescribed-head = Вектор head, tail паза displacement пастыра пирілген. Кӧзіділген head санға алылбинча.

vector-dimension-mismatch = векторда numDimensions чарасчабинча.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элементке тартып полбинча, нооға тізе аның nearestPoint турыс нимезі чох.

constrain-to-without-nearest-point = `<{ $component }>` элементнең кізектеп полбинча, нооға тізе аның nearestPoint турыс нимезі чох.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементтің істінең кізектеп полбинча, нооға тізе аның nearestPoint турыс нимезі чох.

## `<choiceInput>`

choice-input-label-position-ignored = inline нимес choiceInput ӱчӱн labelPosition санға алылбинча

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput ӱчӱн кӧзіділген индекстер санға алылбинча, нооға тізе индекстер саны таллағ палаларының санына чарасчабинча.

pretzel-indices-count-mismatch = problem ӱчӱн кӧзіділген индекстер санға алылбинча, нооға тізе индекстер саны problem палаларының санына чарасчабинча.

shuffle-indices-count-mismatch = shuffle ӱчӱн кӧзіділген индекстер санға алылбинча, нооға тізе индекстер саны компоненттер санына чарасчабинча.

indices-ignored-out-of-range = { $component } ӱчӱн кӧзіділген индекстер санға алылбинча, нооға тізе пірее индекстер кізек тыстында.

pretzel-indices-repeated = pretzel ӱчӱн кӧзіділген индекстер санға алылбинча, нооға тізе пірее индекстер хатапталча.

pretzel-circuit-first-index = circuit режимдегі pretzel ӱчӱн кӧзіділген индекстер санға алылбинча, нооға тізе пастағы индекс 1 полар кирек.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` строка палаларынаң тоғынары ӱчӱн `type` атрибут кӧзіділер кирек.

invalid-type-defaulting-to-math = { $component } компонентке { $type } пӱдізі чарабас. Ол math, text, number алай boolean полар кирек. math алылча.

string-not-valid-component-to-arrange = "{ $value }" строказы { $component } ӱчӱн чарирған компонент нимес. Санға алылбинча.

## Types and variables

invalid-type-defaulting-to-number = { $type } пӱдізі чарабас, пӱдіс number идіп салылча.

invalid-variable-value = Пасхаланчатхан нименің утхазы чарабас: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариант индексі сан полар кирек

variant-index-must-be-integer = { $index } вариант индексі тооза сан полар кирек

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют кӧрімнерге иділбеен. Кӧнділері салыстырығлығ идіп салылча.

side-by-side-absolute-margins = `<{ $component }>` абсолют кӧрімнерге иділбеен. Хыриндағылары салыстырығлығ идіп салылча.

side-by-side-no-block-child = Чарабас `<{ $component }>`: аның ин азында пір блок палазы полар кирек.

## `<label>`

label-for-ignored-on-graphical = График `<label>` ӱстӱндегі `for` атрибут санға алылбинча.

label-for-must-resolve-to-one = `<label>` ӱстӱндегі `for` атрибут ноға да пір компонентке чарасар кирек.

label-for-unresolved = `<label>` ӱстӱндегі `for` атрибутты компонентке чарастырып полбаан.

label-for-answer-with-authored-inputs = `<label>` ӱстӱндегі `for` атрибут аптор позы пасхан кирҷеңнері пар `<answer>` че сілтепче; кирҷеңніг позына сілтеңер.

label-for-answer-without-input = `<label>` ӱстӱндегі `for` атрибут белгіліг кирҷеңі чох `<answer>` че сілтепче.

label-for-must-reference-input-or-answer = `<label>` ӱстӱндегі `for` атрибут кирҷеңге алай харииға сілтеер кирек.

## Accessibility

accessibility-short-description-or-decorative = Тузаланҷаң арға ӱчӱн `<{ $component }>` алай хысха искірііг алар кирек, алай чазандыра итче тіп кӧзіділер кирек.

accessibility-video-short-description = Тузаланҷаң арға ӱчӱн `<video>` хысха искірііг алар кирек.

accessibility-input-short-description-or-label = Тузаланҷаң арға ӱчӱн `<{ $component }>` хысха искірііг алай белгі алар кирек.

accessibility-answer-input-short-description-or-label = Тузаланҷаң арға ӱчӱн кирҷең иткен `<answer>` хысха искірііг алай белгі алар кирек.

accessibility-short-description-contains-math = Хысха искіріглерде `<{ $component }>` чіли математика компоненттері полбас кирек. Математиканы сӧстернең пазыңар.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } пӧлік адының текстіне читкен контраст пирбинче (харағӌы режим) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ин азында { $threshold }:1 кирек).
       *[other] { $colorName } пӧлік адының текстіне читкен контраст пирбинче ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ин азында { $threshold }:1 кирек).
    }

## `<circle>`

circle-through-points-non-numerical = Точкаларның сан утхазы чох туста { $count } точка пастыра иртчеткен `<circle>` иділбеен.

circle-too-many-through-points = 3-тең кӧп точка пастыра иртчеткен тегілекті санап полбинча.

circle-overprescribed-radius-center-points = Радиузы, ортызы паза точкалары хада кӧзіділген тегілекті санап полбинча.

circle-center-with-multiple-points = Ортызы кӧзіділген тегілекті 1-дең кӧп точка пастыра санап полбинча.

circle-radius-too-small = Тегілекті санап полбинча: ікі точка аразындағы ырах { $distance } полғанда, кӧзіділген { $radius } радиус тың кічіг.

circle-radius-with-many-points = Радиузы кӧзіділген тегілекті ікідең кӧп точка пастыра идіп полбинча.

circle-invalid-center-or-through-points = Тегілектің ортызы алай иртчеткен точкалары чарабас.

circle-radius-center-with-multiple-points = Ортызы кӧзіділген тегілектің радиузын 1-дең кӧп точка пастыра санап полбинча.

circle-change-radius-non-numerical = Сан нимес точкалар пастыра иртчеткен тегілектің радиузын пасхалап полбинча

circle-radius-with-points-non-numerical = Сан утхалары чох туста радиузы кӧзіділген тегілекті пірдең кӧп точка пастыра идіп полбинча.

circle-change-center-non-numerical = Сан нимес точкалар пастыра иртчеткен тегілектің ортызын пасхалирға иділбеен.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] Функцияның таныхталчатхан областының кӧрімнері читпинче. Областта { $intervals } ара пар, че функцияда { $inputs ->
           *[other] { $inputs } кирҷең
        } пар.
    }

function-domain-invalid-format = Функцияның таныхталчатхан областының форматы чарабас.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцияның сан нимес максимумы санға алылбинча.
        [minimum] Функцияның сан нимес минимумы санға алылбинча.
        [extremum] Функцияның сан нимес экстремумы санға алылбинча.
        [point] Функцияның сан нимес точказы санға алылбинча.
        [slope] Функцияның сан нимес чатхан коэффициенты санға алылбинча.
       *[other] Функцияның сан нимес { $type } утхазы санға алылбинча.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцияның хуруғ максимумы санға алылбинча.
        [minimum] Функцияның хуруғ минимумы санға алылбинча.
        [extremum] Функцияның хуруғ экстремумы санға алылбинча.
        [point] Функцияның хуруғ точказы санға алылбинча.
       *[other] Функцияның хуруғ { $type } утхазы санға алылбинча.
    }

function-points-too-close = Функцияда орыннары пір-пірінзер тың чағын ікі точка пар. Функцияны таныхтап полбинча.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] Функция итерациялары кирҷеңнер саны сығҷаңнар санына тиң полған туста ла чарир. Пу функцияда { $inputs } кирҷең паза { $outputs ->
           *[other] { $outputs } сығҷаң
        } пар.
    }

## `<sequence>`

sequence-invalid-length = Изеріг узуны чарабас. Ол тискер нимес тооза сан полар кирек.

sequence-invalid-step = Изерігнің адымы чарабас. { $type } пӱдістіг изеріг ӱчӱн ол сан полар кирек.

sequence-invalid-endpoint-number = Сан изерігіндегі "{ $attribute }" чарабас. Ол сан полар кирек.

sequence-invalid-endpoint-letters = Пасчаң паза изерігіндегі "{ $attribute }" чарабас. Ол пасчаң паза холбазы полар кирек.

sequence-invalid-endpoint = Изерігдегі "{ $attribute }" чарабас.

select-from-sequence-coprime-not-numbers = сан талланмаанда coprime санға алылбинча

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations кӧзіділгенде coprime санға алылбинча

## Resolving a `target`

target-not-found = `<{ $source }>` ӱчӱн target чарабас: сағыс ниме табылбаан.

target-state-variable-not-found = `<{ $source }>` ӱчӱн target чарабас: `<{ $component }>` ӱстӱнде "{ $property }" аттығ турыс нимезі табылбаан.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` ниң пасхаланчатхан нимелері пос ниместең пасха полар кирек.

ode-system-duplicate-variable-names = Хатапталған аттығ ODE RHS функциялары таныхталып полбинча.

ode-system-rhs-function-error = ODE RHS функциязы таныхталып полбинча. mathjs функциязын идерде чазығ.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } тӱс сызых аразындағы пулуңны таныхтап полбинча

angle-invalid-through-point = `<angle>` ниң through даңы точказы чарабас

parabola-vertex-too-many-points = Тӧбезі пирілген параболаны 1-дең кӧп точка пастыра иртірерге иділбеен.

parabola-too-many-points = Параболаны 3-тең кӧп точка пастыра иртірерге иділбеен.

intersection-too-many-items = Ікідең кӧп ниме кистілізі иділбеен

## Other math components

ionic-compound-not-two-ions = Ікі иондаң пасха ион холбазы иділбеен.

ionic-compound-needs-cation-and-anion = Ион холбазы пір катион паза пір анион ӱчӱн ле иділген.

solve-equations-cannot-evaluate = Уравнениені тоозып полбинча, нооға тізе аны санап полбаан: { $equation }

math-operators-operand-number-required = Математика операндын алчатханда operandNumber кӧзіділер кирек.

eigen-decomposition-failed = Матрицаның позының утхаларын санап полбаан

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: { $parameters } параметрлері ӱлгӱде чоғыл, аның ӱчӱн олар хаӌан да хуруғ орынға чарасчалар.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" пілдірбинче. Ол none, medium, dense алай хуруғ орыннаң айырылған ікі тик сан полар кирек, тізең grid="1 0.5". Тор сызылбинча.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` ӱчӱн { $expected ->
        [1] хай ла точкада y' чатхан коэффициентын пирчеткен пір сығҷаңнығ, тізең `y - x` чіли
       *[other] хай ла точкада вектор пирчеткен ікі сығҷаңнығ, тізең `(y, -x)` чіли
    } функция кирек, че пирілген функцияда { $found ->
       *[other] { $found } сығҷаң
    } пар. { $alternative ->
        [none] Ноо да ниме сызылбинча.
       *[other] Пу функцияға `<{ $alternative }>` компонент чарасча. Ноо да ниме сызылбинча.
    }

field-function-attribute-ignored-with-child = `function` атрибут санға алылбинча, нооға тізе функция компоненттің істінде дее пирілген; істіндегізі тузаланча. Функцияны пір ле чолнаң пиріңер.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибут компоненттің істінде турадаң пазылған выражениенің нимелерін адапча. { $reason ->
        [function-child] Мындағы функция `<function>` пала чіли пирілген, ол позының нимелерін позы адапча, аның ӱчӱн `variables` санға алылбинча.
       *[no-expression] Мында андағ выражение пирілбеен, аның ӱчӱн `variables` санға алылбинча.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure кӧзідҷеңінде xLabelPosition="left" полыстырылбинча; оң хыринзар турыс тузаланча.

prefigure-y-label-position-unsupported = `<graph>`: prefigure кӧзідҷеңінде yLabelPosition="bottom" полыстырылбинча; ӱстӱнзер турыс тузаланча.

prefigure-invalid-axis-bounds = `<graph>`: prefigure зер кӧстіріг ӱчӱн ось кізектері чарабас; тӧстеғ bbox (-10,-10,10,10) тузаланча.

prefigure-invalid-width = `<graph>`: prefigure зер кӧстіріг ӱчӱн кӧнділе чарабас; тӧстеғ диаграмма кӧнділезі 425 тузаланча.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure зер кӧстіріг ӱчӱн aspectRatio чарабас; тӧстеғ 1 хатнас тузаланча.

prefigure-grid-spacing-too-fine = `<graph>`: тор адымы ось кізектеріне тың кічіг; prefigure кӧзідҷеңінде тор сызылбинча.

prefigure-annotations-not-rendered = `<graph>`: PreFigure кӧзідҷеңі тузаланмаанда аннотациялар сызылбинча.

multiple-annotations-children = `<graph>` істінде кӧп `<annotations>` палазы табылған; соонҷызынаң пасхазының прайзы санға алылбинча.

## Referring to other components

copy-unrecognized-component-type = Пілдірбеен компонент пӱдізін узадып алай кӧчірип полбинча: { $type }.

copy-prop-not-found = { $component } пӱдістіг компонентте { $property } prop табылбаан

collect-no-source = collect ӱчӱн тӧс табылбаан.

collect-invalid-component-type = `<{ $component }>` пӱдістіг компоненттерні чыып полбинча, нооға тізе пу чарабас компонент пӱдізі.

reference-index-unavailable = `{ $reference }` индекске сілтеп полбинча

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентте { $action } хығырып полбинча

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Пірікчеткен нимелердің кӧрімі чарабас. Строкаларның узуны пасха-пасха. Табылған орны componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Пірікчеткен нимелерде хатапталған столбец аттары пар. Табылған орны componentIdx :{ $componentIdx }

data-frame-missing-column-name = Пірікчеткен нимелерде столбец ады читпинче. Табылған орны componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Пу харииның паллазы харии тегінің позы ысхан хариизына тӧстенче, ол сағынмаан турысха апарар.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` пар контейнер істіндегі `<answer>` ге `maxNumAttempts` салғаны ноға да салтар итпинче, нооға тізе сынағлар санын контейнер тудынча. `maxNumAttempts` ты контейнер позына салыңар.

nested-section-wide-check-work-max-num-attempts = Пасха `sectionWideCheckWork` контейнер істінде турчатхан `sectionWideCheckWork` контейнерге `maxNumAttempts` салғаны ноға да салтар итпинче, нооға тізе сынағлар санын тыстағы контейнер тудынча. `maxNumAttempts` ты тыстағы контейнерге салыңар.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] symbolicEquality салылбаанда { $attributes } атрибуттар ноға да салтар итпинче.
    }

answer-invalid-type = Харииға пӱдіс чарабас: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компоненттің ады чох полғаннаң, аны модуль атрибуды чіли тузаланып полбинча

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентті модульге атрибут чіли тузаланып полбинча, нооға тізе `<module>` компонент пӱдізінде "{ $name }" атрибут парох таныхталған.

conditional-content-condition-ignored = case алай else палалары пар `<conditionalContent>` компонентте `condition` атрибут санға алылбинча.

slider-markers-type-mismatch = Маркерлер пӱдізі slider пӱдізіне чарасчабинча.

pretzel-problem-needs-statement-and-answer = Чарабас pretzel: хай ла `<problem>` пір `<statement>` паза пір `<answer>` тудар кирек.

pretzel-circuit-first-problem-distractor = Чарабас pretzel: mode="circuit" де пастағы `<problem>` дистрактор пол полбас.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] `{ $attribute }` атрибутха { $values } утхалары чарабас; санға алылбинча.
    }

attribute-must-be-references = `{ $attribute }` атрибутха `{ $value }` утхазы чарабас. Атрибут `$` наң пасталчатхан сілтеглернең пӱдер кирек.

math-input-invalid-function-names = <mathInput>: { $attribute } дағы чарабас функция аттары санға алылбаан: { $names }. Хай ла аттың кӧрінчеткен ӱлӱзі ин азында 2 пасчаң паза (пасчаң паза алай сызых) полар кирек; аннаң андар хынған туста `|<mathspeak alternative>` хозымы полар чарир.

## Building components from the source

component-type-invalid = Компонент пӱдізі чарабас: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутты хатаплап полбинча.

attribute-invalid-for-component = `<{ $componentType }>` пӱдістіг компонентке "{ $attribute }" атрибут чарабас.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль таныхтағы { $context ->
        [text-on-background] текст ӧңі паза фон ӧңі аразында
        [high-contrast] пӧзік контрастығ ӧң паза канвас аразында
        [line] сызых ӧңі паза канвас аразында
        [marker] маркер ӧңі паза канвас аразында
       *[text-on-canvas] текст ӧңі паза канвас аразында
    } читкен контраст пирбинче{ $mode ->
        [dark] { " (харағӌы режим)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ин азында { $threshold }:1 кирек).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль таныхтағында кӧзіділген ӧңнер чарых режимге читкен контраст пирчеткен де полза, оларданъ алылған харағӌы режим ӧңнері текст ӧңі паза фон ӧңі аразында читкен контраст пирбинче ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ин азында { $threshold }:1 кирек). { $suggestion ->
        [available] Харағӌы режимде читкен контраст ползын тіп, алай чарых режим контрастын кӧдіріңер (тізең { $lightAttribute }="{ $lightColor }" салыңар), алай харағӌы режим ӧңін позыңар пиріңер (тізең { $darkAttribute }="{ $darkColor }" салыңар).
       *[none] Харағӌы режимде читкен контраст ползын тіп, чарых режим контрастын кӧдіріңер алай алылған ӧңнерні textColorDarkMode паза/алай backgroundColorDarkMode пастыра позыңар пиріңер.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль таныхтағында кӧзіділген текст ӧңі чарых режимге читкен контраст пирчеткен де полза, аннаң алылған харағӌы режим текст ӧңі канвасха читкен контраст пирбинче ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ин азында { $threshold }:1 кирек). { $suggestion ->
        [available] Харағӌы режимде читкен контраст ползын тіп, алай чарых режим контрастын кӧдіріңер (тізең textColor="{ $lightColor }" салыңар), алай харағӌы режим ӧңін позыңар пиріңер (тізең textColorDarkMode="{ $darkColor }" салыңар).
       *[none] Харағӌы режимде читкен контраст ползын тіп, чарых режим контрастын кӧдіріңер алай алылған ӧңні textColorDarkMode пастыра позыңар пиріңер.
    }

section-multiple-style-palettes = Пір пӧлік пір ле <stylePalette> таллап алар; соонҷызы тузаланча.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } ниң пос вариантарын таныхтап полбинча, нооға тізе numToSelect тискер нимес тооза сан нимес.

variant-num-to-select-not-constant-number = { $component } ниң пос вариантарын таныхтап полбинча, нооға тізе numToSelect турғлах сан нимес.

variant-with-replacement-not-constant-boolean = { $component } ниң пос вариантарын таныхтап полбинча, нооға тізе withReplacement турғлах boolean нимес.

variant-select-weight-disables-unique = selectWeight алай selectForVariants кӧзіділген таллағ пар полза, select ӱчӱн пос вариантар чабылча

variant-coprime-undetermined = { $component } ниң пос вариантарын таныхтап полбинча, нооға тізе coprime хаӌан да false полчатханын таныхтап полбинча.

variant-attribute-not-constant = { $component } ниң пос вариантарын таныхтап полбинча, нооға тізе { $attribute } турғлах нимес.

variant-attribute-not-number = { $component } ниң пос вариантарын таныхтап полбинча, нооға тізе { $attribute } сан нимес.

variant-attribute-wrong-type-for-sequence =
    { $type } пӱдістіг { $component } ниң пос вариантарын таныхтап полбинча, нооға тізе { $attribute } { $expected ->
        [letters-combination] пасчаң паза холбазы
        [math-expression] чарирған математика выражениезі
        [integer] тооза сан
       *[number] сан
    } нимес.

variant-length-not-integer = { $component } ниң пос вариантарын таныхтап полбинча, нооға тізе length тооза сан нимес.

variant-sort-not-implemented = sort пар { $component } ниң пос вариантары иділбеен

variant-exclude-combinations-not-implemented = excludeCombinations пар { $component } ниң пос вариантары иділбеен

variant-math-exclude-not-implemented = exclude пар math пӱдістіг { $component } ниң пос вариантары иділбеен

variant-non-constant-exclude-not-implemented = турғлах нимес exclude пар { $component } ниң пос вариантары иділбеен

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure кӧзідҷеңінде полыстырылбинча; тӧл алнында ирттірілген.

prefigure-descendant-invalid-geometry = { $subject }: тоозылбас алай толдырылбаан геометрия; тӧл алнында ирттірілген.

prefigure-curve-label-omitted = { $subject }: кӧстірілген иліг элементтерде белгілер полыстырылбинча; белгі хабылбаан.

prefigure-curve-unsupported-definition-type = { $subject }: иліг функциязының '{ $definitionType }' таныхтағ пӱдізі полыстырылбинча; тӧл алнында ирттірілген.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves тегі flipFunctions атрибут полыстырылбинча; тӧл алнында ирттірілген.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формула пӱдістіг пала функциялар ла полыстырча; тӧл алнында ирттірілген.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] сызых сӧбіріниң белгізіне
       *[point] точка белгізіне
    } '{ $labelPosition }' labelPosition полыстырылбинча; PreFigure ниң тӧстеғ чарастырығы тузаланча.

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' будағ стилін PreFigure полыстырбинча; толдыра будағнаң алыстырылча.

prefigure-line-style-unknown = { $subject }: пілдірбеен '{ $lineStyle }' сызых стилі PreFigure сығҷаңынаң хабылбаан.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' маркер стилі PreFigure ниң 'diamond' стиліне чарастырылған.

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' маркер стилін PreFigure полыстырбинча; тӧстеғ стиль тузаланча.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` чарабас; сағыс нимені таап полбинча. Аннотация хабылбаан.

annotation-ref-multiple-targets = `<annotation>`: `ref` кӧп сағыс нимее чарасхан; пастағызы тузаланча.

annotation-ref-outside-graph = `<annotation>`: `ref` чарабас; сағыс ниме позының графигі тыстында. Аннотация хабылбаан.

annotation-ref-unsupported-target = `<annotation>`: `ref` чарабас; сағыс ниме prefigure зер кӧстірігде полыстырылчатхан график ниме нимес. Аннотация хабылбаан.

annotation-text-missing = `<annotation>`: `text` чох алай хуруғ; хуруғ текст сығарылча.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Тегілек хабыныс табылған.
       *[other] `<{ $componentType }>` компонентнең хабынған тегілек хабыныс табылған.
    }

reference-no-referent = Сілтегге ниме табылбаан: `{ $reference }`

reference-multiple-referents = Сілтегге кӧп ниме табылған: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` ниң { $attribute } атрибудының форматы чарабас.

children-invalid = `<{ $componentType }>` ӱчӱн палалары чарабас: чарабас палалар табылған: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибутха `{ $value }` утхазы чарабас, `{ $default }` утхазы тузаланча

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версиязы табылбаан.
       *[other] DoenetML { $version } версиязы табылбаан. { $fallback } версиязына нандыра парылча
    }

## Reading the DoenetML

parse-invalid-doenetml = Чарабас DoenetML: { $content }

parse-tag-missing-close-tag = Чарабас DoenetML: `{ $tag }` тегтің чапчаң тегі чох. Позы чабылчатхан тег алай `</{ $tagName }>` тег сағынылған.

parse-tag-error = Чарабас DoenetML: `<{ $tagName }>` тегте чазығ

parse-attribute-missing-value = Чарабас DoenetML: `{ $attribute }` атрибуттың утхазы читпинче полар.

parse-attribute-invalid = Чарабас DoenetML: `{ $attribute }` атрибут чарабас

parse-attribute-value-invalid = Чарабас DoenetML: `{ $value }` атрибут утхазы чарабас

parse-attribute-value-quote-mismatch = Чарабас DoenetML: `{ $value }` атрибут утхазы чарабас. Кавычкалар чарасчабинча. `{ $quote }` читпинче полар

parse-open-tag-name-missing = Чарабас DoenetML: Ады чох тег табылған, тізең `<`

parse-tag-not-closed = Чарабас DoenetML: `{ $tag }` тег чабылбаан (`>` читпинче полар).

parse-self-closing-tag-name-missing = Чарабас DoenetML: Ады чох тег табылған `<{ $content }>`

parse-self-closing-tag-not-closed = Чарабас DoenetML: `{ $tag }` тег чабылбаан (`/>` читпинче полар).

parse-tag-invalid-attributes = Чарабас DoenetML: `{ $tag }` тег чарабас. Аның атрибуттары тоғыр полар.

parse-close-tag-name-missing = Чарабас DoenetML: Ады чох чапчаң тег табылған, тізең `</`

parse-attribute-value-unquoted = Атрибут утхалары кавычкаға алылар кирек: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Чарабас DoenetML: `{ $tag }` чапчаң тег табылған, че аға чарасчатхан асчаң тег чох

parse-close-tag-mismatched = Чарабас DoenetML: Чапчаң тег чарасчабинча. `</{ $expected }>` сағынылған. `{ $found }` табылған

parser-node-unconvertible = { $node } тӱгӱнні Dast тӱгӱнінзер кӧстіріп полбаан.

## Names

name-attribute-invalid =
    name='{ $name }' атрибут чарабас. { $reason ->
        [characters] Аттарда пасчаң паза, сан, алтындағы сызых алай сызых ла полар чарир.
       *[start] Аттар пасчаң пазанаң пасталар кирек.
    }

component-name-invalid-start = "{ $name }" компонент ады чарабас. Аттар пасчаң пазанаң пасталар кирек.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched пӱдістіг харииның video атрибуды полар кирек

answer-video-watched-video-not-reference = videoWatched пӱдістіг харииның video атрибуды сілтег полар кирек

answer-name-not-single-text = Харииның name атрибудының пір ле текст палазы полар кирек

## Referencing another document

external-doenetml-recursion-limit = Рекурсия тӱзеглері тың кӧп полғаннаң тыстағы DoenetML алылып полбинча. Тегілек сілтег парба?

external-doenetml-unavailable = { $attribute }="{ $uri }" наң DoenetML алылып полбинча

external-doenetml-type-mismatch = { $attribute }="{ $uri }" наң алылған DoenetML чарабас: ол "{ $componentType }" компонент пӱдізіне чарасчабаан

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут искірген; аның орнына `{ $to }` тузаланыңар.
       *[other] [deprecation] `<{ $component }>` тегі `{ $from }` атрибут искірген; аның орнына `{ $to }` тузаланыңар.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут искірген паза `{ $to }` дее кӧзіділгеннең санға алылбинча.
       *[other] [deprecation] `<{ $component }>` тегі `{ $from }` атрибут искірген паза `{ $to }` дее кӧзіділгеннең санға алылбинча.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` тегі `{ $attribute }` атрибут искірген паза санға алылбинча.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` тегі `{ $attribute }` атрибут искірген; аның орнына `<{ $child }>` пала тузаланыңар.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` тегі `{ $attribute }` атрибуттың `{ $value }` утхазы искірген; аның орнына `{ $to }` тузаланыңар.


## Language coverage

pluralize-english-only = `<pluralize>` англия тілінің сӧзін ле кӧп саннаң идіп полча, аның ӱчӱн { $locale } тілінде пазылған документте аның тексті пасхаланминча. Кӧп сан пӱдізін турадаң пазыңар алай аны `pluralForm` атрибутнаң пиріңер.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент Doenet пілчеткен элемент нимес.

schema-element-not-allowed-at-root = `<{ $tag }>` элементке документтің тӧзінде чарабинча.

schema-element-not-allowed-inside = `<{ $tag }>` элементке `<{ $parent }>` істінде чарабинча.

schema-attribute-unrecognized = `<{ $tag }>` элементтің `{ $attribute }` аттығ атрибуды чох.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементтің `{ $attribute }` атрибуды хай ла ағазы пуларның пірізі полчатхан список полар кирек: { $allowed }
       *[other] `<{ $tag }>` элементтің `{ $attribute }` атрибуды пуларның пірізі полар кирек: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select ӱчӱн вариант ады чарабас. { $variantName } вариант ады { $numOptions } вариантта туста, че талланар саны { $numToSelect }.

select-variant-name-without-options = select ӱчӱн пірее вариантар кӧзіділген, че полар чарирған { $variantName } вариант адына ноо да вариант кӧзіділбеен.

select-variant-name-not-possible = select ӱчӱн кӧзіділген { $variantName } вариант ады полар чарирған вариант ады нимес.

select-too-few-options = Пар полған { $numOptions } компоненттең { $numToSelect } таллап полбинча.

select-from-sequence-too-few-values = Узуны { $length } полған изерігдең { $numToSelect } утха таллап полбинча.

select-from-sequence-indices-count-mismatch = select ӱчӱн кӧзіділген индекстер саны талланар санға чарасар кирек

select-from-sequence-indices-not-integers = select ӱчӱн кӧзіділген прай индекстер тооза сан полар кирек

select-from-sequence-index-excluded = selectfromsequence ӱчӱн сығарылған индекс кӧзіділген

select-from-sequence-indices-excluded-combination = selectfromsequence ӱчӱн сығарылған холбас кӧзіділген

select-from-sequence-coprime-not-positive-integers = Тик тооза саннар талланмаанда пос-позына аймах холбастарны таллап полбинча.

select-from-sequence-coprime-common-factor = Пос-позына аймах саннарны таллап полбинча. Прай полар чарирған утхаларның ортах пӧлҷеңі пар. ("from" алай "to" ның кӧзіділген утхалары "step" нең пос-позына аймах полар кирек.)

select-from-sequence-coprime-single-number = 1-дең пасха чалғыс саннаң пос-позына аймах холбастарны таллап полбинча.

select-from-sequence-excluded-too-many-combinations = selectFromSequence те холбастарның 70% -тең кӧбі сығарылған

select-from-sequence-coprime-none-found = Пос-позына аймах саннарны таллап полбаан. Прай полар чарирған утхаларның ортах пӧлҷеңі пар.

select-from-sequence-too-few-unique-values = Узуны { $numPossibleValues } полған изерігдең { $numToSelect } пос утха таллап полбинча

select-prime-numbers-too-few-values = Узуны { $numValues } полған тӧстеғ саннар списогынаң { $numToSelect } утха таллап полбинча

select-prime-numbers-values-count-mismatch = select ӱчӱн кӧзіділген утхалар саны талланар санға чарасар кирек

select-prime-numbers-values-not-prime = select prime number ӱчӱн кӧзіділген прай утхалар тӧстеғ саннар списогында полар кирек

select-prime-numbers-values-excluded-combination = selectPrimeNumbers ӱчӱн кӧзіділген утхалар сығарылған холбас полған

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers те холбастарның 70% -тең кӧбі сығарылған

select-random-combination-fluke = Тың сирек полчатхан таварылған туста таварылған утхалар холбазын таллап полбаан

select-random-value-fluke = Тың сирек полчатхан таварылған туста таварылған утханы таллап полбаан

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` математика істінде сызылбинча; выражение кирҷеңнер істіне салылбаан туста чіли терілче. { $reason ->
        [not-inline] Выражение істіне `inline` таллағ кирҷеңі ле сыйча; `inline` чох полза, ол кнопкалар блогы полча.
        [expanded] `expanded` текст кирҷеңі кӧп строкалығ ящик, ол выражение істінде турарға тың улуғ.
        [on-graph] Графикте выражение пір бӱтӱн чуртағ чіли сызылча, анда тудынҷаң нимее орын чох.
       *[relative-width] Аның `width` і салыстырығлығ (процент алай `em`), че выражение істінде аны салыстырар ниме чох. Кӧнділені `px` чіли абсолют кірімнең пиріңер.
    }
