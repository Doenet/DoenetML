# Chuvash diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# CONFIDENCE. This is the file in the Chuvash catalog a speaker should read
# first. Chuvash has no settled computing vocabulary, so the technical nouns
# below are the Russian ones written in Chuvash spelling — «компонент»,
# «атрибут», «функци», «индекс» — which is what written Chuvash does with them
# in practice, and what a Chuvash-language coinage would have to be checked
# against rather than replaced by unread.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] икӗ вӗҫ пӑнчине те кӑтартнӑ чухне { $attributes } шута илмест
       *[other] икӗ вӗҫ пӑнчине те кӑтартнӑ чухне { $attributes } шута илмест
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] вӗҫ пӑнчипе варри пӑнчине те кӑтартнӑ чухне { $attributes } шута илмест
       *[other] вӗҫ пӑнчипе варри пӑнчине те кӑтартнӑ чухне { $attributes } шута илмест
    }

line-segment-midpoint-offset-without-midpoint = варри пӑнчисӗр midpointOffset нимӗне те витӗм кӳмест

## `<line>`

line-points-undetermined-dimensions = Виҫи паллӑ мар пӑнчӑсем витӗр тухакан тӳрӗ йӗр.

line-points-too-few-dimensions = Тӳрӗ йӗр чи сахалран икӗ виҫеллӗ пӑнчӑсем витӗр тухмалла.

line-points-depend-on-variables = Тӳрӗ йӗр улшӑнакансенчен килекен пӑнчӑсем витӗр тухать: { $variables }.

line-equation-invalid-format = { $variable1 } тата { $variable2 } улшӑнаканӗсенчи тӳрӗ йӗр танлӑхӗн форматне йышӑнмасть.

## `<ray>`

ray-overprescribed-through = Пайӑркана through, endpoint тата direction урлӑ панӑ. Панӑ through шута илмест.

ray-dimension-mismatch = пайӑркара numDimensions килӗшмест.

## `<vector>`

vector-overprescribed-head = Вектора head, tail тата displacement урлӑ панӑ. Панӑ head шута илмест.

vector-dimension-mismatch = векторта numDimensions килӗшмест.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элемент патне туртма пулмасть, мӗншӗн тесен унӑн nearestPoint статус улшӑнаканӗ ҫук.

constrain-to-without-nearest-point = `<{ $component }>` элементпа чарса тӑма пулмасть, мӗншӗн тесен унӑн nearestPoint статус улшӑнаканӗ ҫук.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементӑн шалӗпе чарса тӑма пулмасть, мӗншӗн тесен унӑн nearestPoint статус улшӑнаканӗ ҫук.

## `<choiceInput>`

choice-input-label-position-ignored = йӗрке ӑшӗнче мар choiceInput валли labelPosition шута илмест

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput валли панӑ индекссем шута илмеҫҫӗ, мӗншӗн тесен вӗсен йышӗ choice ачисен йышӗпе килӗшмест.

pretzel-indices-count-mismatch = problem валли панӑ индекссем шута илмеҫҫӗ, мӗншӗн тесен вӗсен йышӗ problem ачисен йышӗпе килӗшмест.

shuffle-indices-count-mismatch = shuffle валли панӑ индекссем шута илмеҫҫӗ, мӗншӗн тесен вӗсен йышӗ компонентсен йышӗпе килӗшмест.

indices-ignored-out-of-range = { $component } валли панӑ индекссем шута илмеҫҫӗ, мӗншӗн тесен хӑшӗсем чикӗрен тухаҫҫӗ.

pretzel-indices-repeated = pretzel валли панӑ индекссем шута илмеҫҫӗ, мӗншӗн тесен хӑшӗсем тепӗр хут тӗл пулаҫҫӗ.

pretzel-circuit-first-index = circuit режимӗнче pretzel валли панӑ индекссем шута илмеҫҫӗ, мӗншӗн тесен пӗрремӗш индекс 1 пулмалла.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текст ачисемпе ӗҫлетӗр тесен `type` атрибут памалла.

invalid-type-defaulting-to-math = { $component } компонент валли тӗрӗс мар тӗс { $type }. Вӑл math, text, number е boolean пулмалла. math усӑ курать.

string-not-valid-component-to-arrange = «{ $value }» йӗрки { $component } валли юрӑхлӑ компонент мар. Шута илмест.

## Types and variables

invalid-type-defaulting-to-number = Тӗрӗс мар тӗс { $type }, тӗсне number тӑваҫҫӗ.

invalid-variable-value = Улшӑнаканӑн тӗрӗс мар хакӗ: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариант индексӗ хисеп пулмалла

variant-index-must-be-integer = { $index } вариант индексӗ тулли хисеп пулмалла

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют виҫесем валли пурнӑҫламан. Сарлакӑшсене танлаштаруллӑ тӑваҫҫӗ.

side-by-side-absolute-margins = `<{ $component }>` абсолют виҫесем валли пурнӑҫламан. Хӗррисене танлаштаруллӑ тӑваҫҫӗ.

side-by-side-no-block-child = Тӗрӗс мар `<{ $component }>`: унӑн чи сахалран пӗр блок ачи пулмалла.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элементри `for` атрибут шута илмест.

label-for-must-resolve-to-one = `<label>` элементри `for` атрибут шӑп пӗр компонент ҫине кӑтартмалла.

label-for-unresolved = `<label>` элементри `for` атрибута компонентпа ҫыхӑнтарма пулмарӗ.

label-for-answer-with-authored-inputs = `<label>` элементри `for` атрибут автор ҫырнӑ кӗртӳ хирӗсем пур `<answer>` ҫине кӑтартать; хир ҫине тӳрремӗн кӑтартӑр.

label-for-answer-without-input = `<label>` элементри `for` атрибут паллӑ тумалли кӗртӳ хирӗ ҫук `<answer>` ҫине кӑтартать.

label-for-must-reference-input-or-answer = `<label>` элементри `for` атрибут кӗртӳ хирӗ е хурав ҫине кӑтартмалла.

## Accessibility

accessibility-short-description-or-decorative = Майлӑх валли `<{ $component }>` е кӗске ӑнлантару пулмалла, е эреш тесе палӑртмалла.

accessibility-video-short-description = Майлӑх валли `<video>` кӗске ӑнлантаруллӑ пулмалла.

accessibility-input-short-description-or-label = Майлӑх валли `<{ $component }>` кӗске ӑнлантаруллӑ е паллӑллӑ пулмалла.

accessibility-answer-input-short-description-or-label = Майлӑх валли кӗртӳ хирӗ тӑвакан `<answer>` кӗске ӑнлантаруллӑ е паллӑллӑ пулмалла.

accessibility-short-description-contains-math = Кӗске ӑнлантарусенче `<{ $component }>` пек математика компоненчӗсем пулмалла мар. Математикӑна сӑмахпа ҫырӑр.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } пай пуҫламӑшӗн тексчӗ валли ҫителӗклӗ контраст памасть (тӗттӗм тӗс) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; чи сахалран { $threshold }:1 кирлӗ).
       *[other] { $colorName } пай пуҫламӑшӗн тексчӗ валли ҫителӗклӗ контраст памасть ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; чи сахалран { $threshold }:1 кирлӗ).
    }

## `<circle>`

circle-through-points-non-numerical = Пӑнчӑсен хисеп хакӗсем ҫук чухне { $count } пӑнчӑ витӗр тухакан `<circle>` пурнӑҫламан.

circle-too-many-through-points = 3-рен ытла пӑнчӑ витӗр тухакан ҫаврашкана шутлама пулмасть.

circle-overprescribed-radius-center-points = Панӑ радиуспа, варрипе тата пӑнчӑсемпе ҫаврашкана шутлама пулмасть.

circle-center-with-multiple-points = Панӑ варрипе 1-рен ытла пӑнчӑ витӗр тухакан ҫаврашкана шутлама пулмасть.

circle-radius-too-small = Ҫаврашкана шутлама пулмасть: икӗ пӑнчӑ хушши { $distance } пулнипе панӑ радиус { $radius } ытла пӗчӗк.

circle-radius-with-many-points = Панӑ радиуспа иккӗрен ытла пӑнчӑ витӗр тухакан ҫаврашка тума пулмасть.

circle-invalid-center-or-through-points = Ҫаврашкан варри е пӑнчисем тӗрӗс мар.

circle-radius-center-with-multiple-points = Панӑ варрипе 1-рен ытла пӑнчӑ витӗр тухакан ҫаврашкан радиусне шутлама пулмасть.

circle-change-radius-non-numerical = Хисеп мар пӑнчӑллӑ ҫаврашкан радиусне улӑштарма пулмасть

circle-radius-with-points-non-numerical = Хисеп хакӗсем ҫук чухне панӑ радиуспа пӗрререн ытла пӑнчӑ витӗр тухакан ҫаврашка тума пулмасть.

circle-change-center-non-numerical = Хисеп мар пӑнчӑсем витӗр тухакан ҫаврашкан варрине улӑштарассине пурнӑҫламан.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцин палӑртнӑ лаптӑкӗн виҫи ҫителӗксӗр. Лаптӑкра { $intervals } хушӑк пур, функцире вара { $inputs ->
            [one] { $inputs } кӗрӳ
           *[other] { $inputs } кӗрӳ
        }.
       *[other] Функцин палӑртнӑ лаптӑкӗн виҫи ҫителӗксӗр. Лаптӑкра { $intervals } хушӑк пур, функцире вара { $inputs ->
            [one] { $inputs } кӗрӳ
           *[other] { $inputs } кӗрӳ
        }.
    }

function-domain-invalid-format = Функцин палӑртнӑ лаптӑкӗн форматне йышӑнмасть.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцин хисеп мар максимумне шута илмест.
        [minimum] Функцин хисеп мар минимумне шута илмест.
        [extremum] Функцин хисеп мар экстремумне шута илмест.
        [point] Функцин хисеп мар пӑнчине шута илмест.
        [slope] Функцин хисеп мар чалӑшлӑхне шута илмест.
       *[other] Функцин хисеп мар { $type } хакне шута илмест.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцин пушӑ максимумне шута илмест.
        [minimum] Функцин пушӑ минимумне шута илмест.
        [extremum] Функцин пушӑ экстремумне шута илмест.
        [point] Функцин пушӑ пӑнчине шута илмест.
       *[other] Функцин пушӑ { $type } хакне шута илмест.
    }

function-points-too-close = Функцире пӗр-пӗрне ытла ҫывӑх икӗ пӑнчӑ пур. Функцие палӑртма пулмасть.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функци итерацийӗсем кӗрӳсен йышӗ тухӑҫсен йышӗпе тан пулсан кӑна пулаҫҫӗ. Ку функцире { $inputs } кӗрӳ тата { $outputs ->
            [one] { $outputs } тухӑҫ
           *[other] { $outputs } тухӑҫ
        } пур.
       *[other] Функци итерацийӗсем кӗрӳсен йышӗ тухӑҫсен йышӗпе тан пулсан кӑна пулаҫҫӗ. Ку функцире { $inputs } кӗрӳ тата { $outputs ->
            [one] { $outputs } тухӑҫ
           *[other] { $outputs } тухӑҫ
        } пур.
    }

## `<sequence>`

sequence-invalid-length = Йӗркелӗх вӑрӑмӑшӗ тӗрӗс мар. Вӑл негативлӑ мар тулли хисеп пулмалла.

sequence-invalid-step = Йӗркелӗх утӑмӗ тӗрӗс мар. { $type } тӗслӗ йӗркелӗх валли вӑл хисеп пулмалла.

sequence-invalid-endpoint-number = Хисеп йӗркелӗхӗн «{ $attribute }» хакӗ тӗрӗс мар. Вӑл хисеп пулмалла.

sequence-invalid-endpoint-letters = Сас палли йӗркелӗхӗн «{ $attribute }» хакӗ тӗрӗс мар. Вӑл сас паллисен пӗрлешӗвӗ пулмалла.

sequence-invalid-endpoint = Йӗркелӗхӗн «{ $attribute }» хакӗ тӗрӗс мар.

select-from-sequence-coprime-not-numbers = хисепсем суйламаннипе coprime шута илмест

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations панипе coprime шута илмест

## Resolving a `target`

target-not-found = `<{ $source }>` валли тӗрӗс мар target: тӗллев тупӑнмарӗ.

target-state-variable-not-found = `<{ $source }>` валли тӗрӗс мар target: `<{ $component }>` элементра «{ $property }» ятлӑ статус улшӑнаканӗ тупӑнмарӗ.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` улшӑнаканӗсем ирӗклӗ улшӑнаканран уйрӑлса тӑмалла.

ode-system-duplicate-variable-names = Ҫыхӑнуллӑ улшӑнакансен ячӗсем пӗр пекки чухне ДТ сылтӑм енӗн функцийӗсене палӑртма пулмасть.

ode-system-rhs-function-error = ДТ сылтӑм енӗн функцине палӑртма пулмасть. mathjs функцине тунӑ чухне йӑнӑш.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } тӳрӗ йӗр хушшинчи кӗтесе палӑртма пулмасть

angle-invalid-through-point = `<angle>` элементӑн through хакӗнче тӗрӗс мар пӑнчӑ

parabola-vertex-too-many-points = Панӑ тӑрӑпа 1-рен ытла пӑнчӑ витӗр тухакан парабола пурнӑҫламан.

parabola-too-many-points = 3-рен ытла пӑнчӑ витӗр тухакан парабола пурнӑҫламан.

intersection-too-many-items = Иккӗрен ытла объект хӗресленнине пурнӑҫламан

## Other math components

ionic-compound-not-two-ions = Икӗ иона пӑхмасӑр ион пӗрлешӗвӗсене пурнӑҫламан.

ionic-compound-needs-cation-and-anion = Ион пӗрлешӗвӗсене пӗр катионпа пӗр анион валли кӑна пурнӑҫланӑ.

solve-equations-cannot-evaluate = Танлӑха татса пама пулмасть, мӗншӗн тесен ӑна шутлама пулмарӗ: { $equation }

math-operators-operand-number-required = Математика операндне уйӑрса илме operandNumber памалла.

eigen-decomposition-failed = Матрицӑн хӑй хакӗсене шутлама пулмарӗ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр тӗслӗхре тӗл пулмасть, ҫавӑнпа вӑл яланах пушша килӗшет.
       *[other] `<matchesPattern>`: { $parameters } параметрсем тӗслӗхре тӗл пулмаҫҫӗ, ҫавӑнпа вӗсем яланах пушша килӗшеҫҫӗ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" хакне ӑнланма пулмасть. Вӑл none, medium, dense е пушӑ вырӑнпа уйӑрнӑ икӗ позитивлӑ хисеп пулмалла, тӗслӗхрен grid="1 0.5". Тор ӳкермест.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure ӳкерекенӗнче xLabelPosition="left" пурнӑҫламан; сылтӑм вырнаҫу йӗрки усӑ курать.

prefigure-y-label-position-unsupported = `<graph>`: prefigure ӳкерекенӗнче yLabelPosition="bottom" пурнӑҫламан; ҫӳлти вырнаҫу йӗрки усӑ курать.

prefigure-invalid-axis-bounds = `<graph>`: prefigure куҫарӑвӗ валли тӗнӗл чикӗсем тӗрӗс мар; тӗп bbox (-10,-10,10,10) усӑ курать.

prefigure-invalid-width = `<graph>`: prefigure куҫарӑвӗ валли сарлакӑш тӗрӗс мар; диаграммӑн тӗп сарлакӑшӗ 425 усӑ курать.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure куҫарӑвӗ валли aspectRatio тӗрӗс мар; тӗп енсен танлӑхӗ 1 усӑ курать.

prefigure-grid-spacing-too-fine = `<graph>`: тор утӑмӗ тӗнӗл чикӗсем валли ытла вӗтӗ; prefigure ӳкерекенӗнче тора кӑлараҫҫӗ.

prefigure-annotations-not-rendered = `<graph>`: PreFigure ӳкерекенӗпе усӑ курман чухне асӑрхаттарусем ӳкермеҫҫӗ.

multiple-annotations-children = `<graph>` ӑшӗнче темиҫе `<annotations>` ачи тупӑнчӗ; юлашкинчен пуҫне ыттисене шута илмеҫҫӗ.

## Referring to other components

copy-unrecognized-component-type = Палламан компонент тӗсне сарма е куҫарма пулмасть: { $type }.

copy-prop-not-found = { $component } тӗслӗ компонентра { $property } уйрӑмлӑхӗ тупӑнмарӗ

collect-no-source = collect валли ҫӑлкуҫ тупӑнмарӗ.

collect-invalid-component-type = `<{ $component }>` тӗслӗ компонентсене пуҫтарма пулмасть, мӗншӗн тесен ку тӗрӗс мар компонент тӗсӗ.

reference-index-unavailable = `{ $reference }` индекс ҫине каҫӑ тума пулмасть

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентра { $action } чӗнме пулмасть

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Даннӑйсен формийӗ тӗрӗс мар. Йӗркесен вӑрӑмӑшӗсем тӗрлӗ. Тупӑнчӗ componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Даннӑйсенче юпа ячӗсем пӗр пекех. Тупӑнчӗ componentIdx :{ $componentIdx }

data-frame-missing-column-name = Даннӑйсенче юпа ячӗ ҫитмест. Тупӑнчӗ componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ку хуравӑн award хакӗ answer тегӑн хӑйӗн янӑ хуравӗ ҫине таянать, ку кӗтмен ӗҫ-пуҫа илсе пырать.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` пур контейнер ӑшӗнчи `<answer>` ҫине `maxNumAttempts` лартни витӗм кӳмест, мӗншӗн тесен хӑтланусен йышне контейнер палӑртать. `maxNumAttempts` хакне контейнер ҫине лартӑр.

nested-section-wide-check-work-max-num-attempts = Тепӗр `sectionWideCheckWork` контейнерӗ ӑшӗнчи `sectionWideCheckWork` контейнерӗ ҫине `maxNumAttempts` лартни витӗм кӳмест, мӗншӗн тесен хӑтланусен йышне тулашри контейнер палӑртать. `maxNumAttempts` хакне тулашри контейнер ҫине лартӑр.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality лартмасан { $attributes } атрибут витӗм кӳмӗ.
       *[other] symbolicEquality лартмасан { $attributes } атрибутсем витӗм кӳмӗҫ.
    }

answer-invalid-type = answer валли тӗрӗс мар тӗс: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентӑн ячӗ ҫуккипе ӑна модуль атрибучӗ пек усӑ курма пулмасть

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонента модуль атрибучӗ пек усӑ курма пулмасть, мӗншӗн тесен `<module>` компонент тӗсӗнче «{ $name }» атрибут ӗнтӗ палӑртнӑ.

conditional-content-condition-ignored = case е else ачисем пур `<conditionalContent>` компонентра `condition` атрибут шута илмест.

slider-markers-type-mismatch = Маркерсен тӗсӗ шуҫтармӑш тӗсӗпе килӗшмест.

pretzel-problem-needs-statement-and-answer = Тӗрӗс мар pretzel: кашни `<problem>` пӗр `<statement>` тата пӗр `<answer>` тытмалла.

pretzel-circuit-first-problem-distractor = Тӗрӗс мар pretzel: mode="circuit" режимӗнче пӗрремӗш `<problem>` тимлӗхе аяккалла пӑракан пулма пултараймасть.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибут валли тӗрӗс мар хак { $values }; шута илмест.
       *[other] `{ $attribute }` атрибут валли тӗрӗс мар хаксем { $values }; шута илмеҫҫӗ.
    }

attribute-must-be-references = `{ $attribute }` атрибут валли тӗрӗс мар хак `{ $value }`. Атрибут `$` палӑртупа пуҫланакан каҫӑсенчен тӑмалла.

math-input-invalid-function-names = <mathInput>: { $attribute } ӑшӗнчи тӗрӗс мар функци ячӗсене шута илмерӗ: { $names }. Кашни ятӑн курӑнакан пайӗ чи сахалран 2 палӑрту пулмалла (сас паллисем е тире); ун хыҫҫӑн кирлӗ мар `|<mathspeak альтернатива>` хушӑмӗ пыма пултарать.

## Building components from the source

component-type-invalid = Тӗрӗс мар компонент тӗсӗ: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибута тепӗр хут пама пулмасть.

attribute-invalid-for-component = `<{ $componentType }>` тӗслӗ компонент валли тӗрӗс мар атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль палӑртӑвӗнче { $context ->
        [text-on-background] текст тӗсӗпе фон тӗсӗ
        [high-contrast] пысӑк контрастлӑ тӗспе ӳкерӳ лаптӑкӗ
        [line] йӗр тӗсӗпе ӳкерӳ лаптӑкӗ
        [marker] маркер тӗсӗпе ӳкерӳ лаптӑкӗ
       *[text-on-canvas] текст тӗсӗпе ӳкерӳ лаптӑкӗ
    } хушшинчи контраст ҫителӗксӗр{ $mode ->
        [dark] { " (тӗттӗм тӗс)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; чи сахалран { $threshold }:1 кирлӗ).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль палӑртӑвӗнче панӑ тӗссем ҫутӑ тӗс валли ҫителӗклӗ контраст парсан та, вӗсенчен тухнӑ тӗттӗм тӗс тӗсӗсем текстпа фон хушшинче ҫителӗклӗ контраст памаҫҫӗ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; чи сахалран { $threshold }:1 кирлӗ). { $suggestion ->
        [available] Тӗттӗм тӗсре ҫителӗклӗ контраст тӑвас тесен е ҫутӑ тӗсри контраста ӳстерӗр (тӗслӗхрен { $lightAttribute }="{ $lightColor }"), е тӗттӗм тӗс тӗсне улӑштарӑр (тӗслӗхрен { $darkAttribute }="{ $darkColor }").
       *[none] Тӗттӗм тӗсре ҫителӗклӗ контраст тӑвас тесен ҫутӑ тӗсри контраста ӳстерӗр е тухнӑ тӗссене textColorDarkMode тата/е backgroundColorDarkMode урлӑ улӑштарӑр.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль палӑртӑвӗнче панӑ текст тӗсӗ ҫутӑ тӗс валли ҫителӗклӗ контраст парсан та, унран тухнӑ тӗттӗм тӗс текст тӗсӗ ӳкерӳ лаптӑкӗпе ҫителӗклӗ контраст памасть ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; чи сахалран { $threshold }:1 кирлӗ). { $suggestion ->
        [available] Тӗттӗм тӗсре ҫителӗклӗ контраст тӑвас тесен е ҫутӑ тӗсри контраста ӳстерӗр (тӗслӗхрен textColor="{ $lightColor }"), е тӗттӗм тӗс тӗсне улӑштарӑр (тӗслӗхрен textColorDarkMode="{ $darkColor }").
       *[none] Тӗттӗм тӗсре ҫителӗклӗ контраст тӑвас тесен ҫутӑ тӗсри контраста ӳстерӗр е тухнӑ тӗсе textColorDarkMode урлӑ улӑштарӑр.
    }

section-multiple-style-palettes = Пай пӗр <stylePalette> кӑна суйлама пултарать; юлашкипе усӑ курать.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } валли пӗр пек мар вариантсене палӑртма пулмасть, мӗншӗн тесен numToSelect негативлӑ мар тулли хисеп мар.

variant-num-to-select-not-constant-number = { $component } валли пӗр пек мар вариантсене палӑртма пулмасть, мӗншӗн тесен numToSelect тӑтӑш хисеп мар.

variant-with-replacement-not-constant-boolean = { $component } валли пӗр пек мар вариантсене палӑртма пулмасть, мӗншӗн тесен withReplacement тӑтӑш логика хакӗ мар.

variant-select-weight-disables-unique = хӑш те пулин суйлавра selectWeight е selectForVariants панӑ пулсан, select валли пӗр пек мар вариантсем сӳнеҫҫӗ

variant-coprime-undetermined = { $component } валли пӗр пек мар вариантсене палӑртма пулмасть, мӗншӗн тесен coprime яланах суя-и, ҫавна тупма пулмасть.

variant-attribute-not-constant = { $component } валли пӗр пек мар вариантсене палӑртма пулмасть, мӗншӗн тесен { $attribute } тӑтӑш мар.

variant-attribute-not-number = { $component } валли пӗр пек мар вариантсене палӑртма пулмасть, мӗншӗн тесен { $attribute } хисеп мар.

variant-attribute-wrong-type-for-sequence =
    { $type } тӗслӗ { $component } валли пӗр пек мар вариантсене палӑртма пулмасть, мӗншӗн тесен { $attribute } { $expected ->
        [letters-combination] сас паллисен пӗрлешӗвӗ
        [math-expression] юрӑхлӑ математика палӑртӑвӗ
        [integer] тулли хисеп
       *[number] хисеп
    } мар.

variant-length-not-integer = { $component } валли пӗр пек мар вариантсене палӑртма пулмасть, мӗншӗн тесен length тулли хисеп мар.

variant-sort-not-implemented = sort пур { $component } валли пӗр пек мар вариантсене пурнӑҫламан

variant-exclude-combinations-not-implemented = excludeCombinations пур { $component } валли пӗр пек мар вариантсене пурнӑҫламан

variant-math-exclude-not-implemented = exclude пур math тӗслӗ { $component } валли пӗр пек мар вариантсене пурнӑҫламан

variant-non-constant-exclude-not-implemented = тӑтӑш мар exclude пур { $component } валли пӗр пек мар вариантсене пурнӑҫламан

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графикӑн prefigure ӳкерекенӗнче пурнӑҫламан; тӑхӑмне сиктерсе хӑварнӑ.

prefigure-descendant-invalid-geometry = { $subject }: вӗҫсӗр е тулли мар геометри; тӑхӑмне сиктерсе хӑварнӑ.

prefigure-curve-label-omitted = { $subject }: куҫарнӑ кукӑр элеменчӗсенче паллӑсем пурнӑҫламан; паллӑна сиктерсе хӑварнӑ.

prefigure-curve-unsupported-definition-type = { $subject }: пурнӑҫламан кукӑр функци палӑртӑвӗн тӗсӗ «{ $definitionType }»; тӑхӑмне сиктерсе хӑварнӑ.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементри flipFunctions атрибут пурнӑҫламан; тӑхӑмне сиктерсе хӑварнӑ.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формулӑпа панӑ ача функцисене кӑна йышӑнать; тӑхӑмне сиктерсе хӑварнӑ.

prefigure-label-position-unsupported =
    { $subject }: пурнӑҫламан labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] тӳрӗ йӗрсен йышӗн палли валли
       *[point] пӑнчӑ палли валли
    }; PreFigure-ӑн тӗп танлаштарӑвӗ усӑ курать.

prefigure-fill-style-unsupported = { $subject }: тултару стилӗ «{ $fillStyle }» PreFigure валли пурнӑҫламан; тулли тултарӑва куҫать.

prefigure-line-style-unknown = { $subject }: паллӑ мар йӗр стилӗ «{ $lineStyle }» PreFigure тухӑҫӗнчен кӑларнӑ.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер стилӗ «{ $markerStyle }» PreFigure «diamond» стилӗпе танлаштарнӑ.

prefigure-marker-style-unsupported = { $subject }: маркер стилӗ «{ $markerStyle }» PreFigure валли пурнӑҫламан; тӗп стиль усӑ курать.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: тӗрӗс мар `ref`; тӗллеве ҫыхӑнтарма пулмасть. Асӑрхаттарӑва кӑларнӑ.

annotation-ref-multiple-targets = `<annotation>`: `ref` темиҫе тӗллевпе ҫыхӑнчӗ; пӗрремӗшӗпе усӑ курать.

annotation-ref-outside-graph = `<annotation>`: тӗрӗс мар `ref`; тӗллев ӑна тытакан графикран тулашра. Асӑрхаттарӑва кӑларнӑ.

annotation-ref-unsupported-target = `<annotation>`: тӗрӗс мар `ref`; тӗллев prefigure куҫарӑвӗнче пурнӑҫланӑ график объект мар. Асӑрхаттарӑва кӑларнӑ.

annotation-text-missing = `<annotation>`: `text` ҫук е пушӑ; пушӑ текст кӑларать.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ҫавра ҫыхӑну тупӑнчӗ.
       *[other] `<{ $componentType }>` компонента тытакан ҫавра ҫыхӑну тупӑнчӗ.
    }

reference-no-referent = Каҫӑ валли объект тупӑнмарӗ: `{ $reference }`

reference-multiple-referents = Каҫӑ валли темиҫе объект тупӑнчӗ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементӑн { $attribute } атрибучӗн форматне йышӑнмасть.

children-invalid = `<{ $componentType }>` валли тӗрӗс мар ачасем: тӗрӗс мар ачасем тупӑнчӗҫ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибут валли тӗрӗс мар хак `{ $value }`; `{ $default }` хакӗ усӑ курать

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версийӗ тупӑнмарӗ.
       *[other] DoenetML { $version } версийӗ тупӑнмарӗ. { $fallback } версийӗ усӑ курать
    }

## Reading the DoenetML

parse-invalid-doenetml = Тӗрӗс мар DoenetML: { $content }

parse-tag-missing-close-tag = Тӗрӗс мар DoenetML: `{ $tag }` тегӑн хупакан тегӗ ҫук. Хӑйне хӑй хупакан тег е `</{ $tagName }>` тег кӗтнӗччӗ.

parse-tag-error = Тӗрӗс мар DoenetML: `<{ $tagName }>` тегра йӑнӑш

parse-attribute-missing-value = Тӗрӗс мар DoenetML: `{ $attribute }` атрибутра хак ҫитмен пек.

parse-attribute-invalid = Тӗрӗс мар DoenetML: тӗрӗс мар атрибут `{ $attribute }`

parse-attribute-value-invalid = Тӗрӗс мар DoenetML: атрибутӑн тӗрӗс мар хакӗ `{ $value }`

parse-attribute-value-quote-mismatch = Тӗрӗс мар DoenetML: атрибутӑн тӗрӗс мар хакӗ `{ $value }`. Чӗрнесем килӗшмеҫҫӗ. `{ $quote }` ҫитмен пек

parse-open-tag-name-missing = Тӗрӗс мар DoenetML: ятсӑр тег тупӑнчӗ, тӗслӗхрен `<`

parse-tag-not-closed = Тӗрӗс мар DoenetML: `{ $tag }` тега хупман (`>` ҫитмен пек).

parse-self-closing-tag-name-missing = Тӗрӗс мар DoenetML: ятсӑр тег тупӑнчӗ `<{ $content }>`

parse-self-closing-tag-not-closed = Тӗрӗс мар DoenetML: `{ $tag }` тега хупман (`/>` ҫитмен пек).

parse-tag-invalid-attributes = Тӗрӗс мар DoenetML: `{ $tag }` тег юрӑхлӑ мар. Унӑн атрибучӗсем тӗрӗс мар пулма пултараҫҫӗ.

parse-close-tag-name-missing = Тӗрӗс мар DoenetML: ятсӑр хупакан тег тупӑнчӗ, тӗслӗхрен `</`

parse-attribute-value-unquoted = Атрибут хакӗсем чӗрне ӑшӗнче пулмалла: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Тӗрӗс мар DoenetML: `{ $tag }` хупакан тег тупӑнчӗ, анчах ӑна тивӗҫекен уҫакан тег ҫук

parse-close-tag-mismatched = Тӗрӗс мар DoenetML: килӗшмен хупакан тег. `</{ $expected }>` кӗтнӗччӗ. `{ $found }` тупӑнчӗ

parser-node-unconvertible = { $node } тӗввине Dast тӗввине куҫарма пулмарӗ.

## Names

name-attribute-invalid =
    Тӗрӗс мар атрибут name='{ $name }'. { $reason ->
        [characters] Ятсенче сас паллисем, хисепсем, аялти тире е тире кӑна пулма пултараҫҫӗ.
       *[start] Ятсем сас палли-ран пуҫланмалла.
    }

component-name-invalid-start = Тӗрӗс мар компонент ячӗ «{ $name }». Ятсем сас палли-ран пуҫланмалла.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched тӗслӗ answer-ӑн video атрибучӗ пулмалла

answer-video-watched-video-not-reference = videoWatched тӗслӗ answer-ӑн video атрибучӗ каҫӑ пулмалла

answer-name-not-single-text = answer-ӑн name атрибучӗн шӑп пӗр текст ачи пулмалла

## Referencing another document

external-doenetml-recursion-limit = Рекурси шайӗсем ытла нумай пулнипе тулашри DoenetML-а илме пулмарӗ. Ҫавра каҫӑ ҫук-и?

external-doenetml-unavailable = { $attribute }="{ $uri }" адресран DoenetML илме пулмарӗ

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адресран тӗрӗс мар DoenetML илнӗ: вӑл «{ $componentType }» компонент тӗсӗпе килӗшмерӗ

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут кивелнӗ; ун вырӑнне `{ $to }` усӑ курӑр.
       *[other] [deprecation] `<{ $component }>` элементри `{ $from }` атрибут кивелнӗ; ун вырӑнне `{ $to }` усӑ курӑр.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут кивелнӗ тата шута илмест, мӗншӗн тесен `{ $to }` та панӑ.
       *[other] [deprecation] `<{ $component }>` элементри `{ $from }` атрибут кивелнӗ тата шута илмест, мӗншӗн тесен `{ $to }` та панӑ.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементри `{ $attribute }` атрибут кивелнӗ тата шута илмест.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элементри `{ $attribute }` атрибут кивелнӗ; ун вырӑнне `<{ $child }>` ачипе усӑ курӑр.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элементри `{ $attribute }` атрибутӑн `{ $value }` хакӗ кивелнӗ; ун вырӑнне `{ $to }` усӑ курӑр.


## Language coverage

pluralize-english-only = `<pluralize>` нумайлӑ хисепе акӑлчанла кӑна тӑвать, ҫавӑнпа { $locale } чӗлхипе ҫырнӑ документра унӑн тексчӗ улшӑнмасӑр юлать. Нумайлӑ формине хӑвӑр ҫырӑр е ӑна `pluralForm` атрибутпа парӑр.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент палланӑ Doenet элеменчӗ мар.

schema-element-not-allowed-at-root = `<{ $tag }>` элемента документӑн тымарӗнче ирӗк памаҫҫӗ.

schema-element-not-allowed-inside = `<{ $tag }>` элемента `<{ $parent }>` ӑшӗнче ирӗк памаҫҫӗ.

schema-attribute-unrecognized = `<{ $tag }>` элементра `{ $attribute }` ятлӑ атрибут ҫук.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементӑн `{ $attribute }` атрибучӗ кашни элеменчӗ ҫаксенчен пӗри пулакан список пулмалла: { $allowed }
       *[other] `<{ $tag }>` элементӑн `{ $attribute }` атрибучӗ ҫаксенчен пӗри пулмалла: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select валли тӗрӗс мар вариант ячӗ. { $variantName } вариант ячӗ { $numOptions } суйлавра тӗл пулать, суйламалли йышӗ вара { $numToSelect }.

select-variant-name-without-options = select валли вариантсем панӑ, анчах пулма пултаракан вариант ячӗ валли пӗр суйлав та ҫук: { $variantName }.

select-variant-name-not-possible = select валли панӑ { $variantName } вариант ячӗ пулма пултаракан вариант ячӗ мар.

select-too-few-options = Пурӗ { $numOptions } шутӗнчен { $numToSelect } компонент суйлама пулмасть.

select-from-sequence-too-few-values = Вӑрӑмӑшӗ { $length } йӗркелӗхрен { $numToSelect } хак суйлама пулмасть.

select-from-sequence-indices-count-mismatch = select валли панӑ индекссен йышӗ суйламалли йышпа килӗшмелле

select-from-sequence-indices-not-integers = select валли панӑ пур индекс та тулли хисеп пулмалла

select-from-sequence-index-excluded = selectfromsequence валли панӑ индекса кӑларнӑччӗ

select-from-sequence-indices-excluded-combination = selectfromsequence валли панӑ индекссем кӑларнӑ пӗрлешӳ пулнӑ

select-from-sequence-coprime-not-positive-integers = Позитивлӑ тулли хисепсем суйламаннипе хӑйсем хушшинче ансат пӗрлешӳсене суйлама пулмасть.

select-from-sequence-coprime-common-factor = Хӑйсем хушшинче ансат хисепсене суйлама пулмасть. Пулма пултаракан пур хакӑн та пӗрлехи пайлаканӗ пур. (Панӑ "from" е "to" хакӗсем "step"-па хӑйсем хушшинче ансат пулмалла.)

select-from-sequence-coprime-single-number = 1 мар пӗртен-пӗр хисепрен хӑйсем хушшинче ансат пӗрлешӳсене суйлама пулмасть.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ӑшӗнче пӗрлешӳсен 70%-ран ытлашшине кӑларнӑ

select-from-sequence-coprime-none-found = Хӑйсем хушшинче ансат хисепсене суйлама пулмарӗ. Пулма пултаракан пур хакӑн та пӗрлехи пайлаканӗ пур.

select-from-sequence-too-few-unique-values = Вӑрӑмӑшӗ { $numPossibleValues } йӗркелӗхрен { $numToSelect } тӗрлӗ хак суйлама пулмасть

select-prime-numbers-too-few-values = Вӑрӑмӑшӗ { $numValues } ансат хисепсен спискинчен { $numToSelect } хак суйлама пулмасть

select-prime-numbers-values-count-mismatch = select валли панӑ хаксен йышӗ суйламалли йышпа килӗшмелле

select-prime-numbers-values-not-prime = select prime number валли панӑ пур хак та ансат хисепсен спискинче пулмалла

select-prime-numbers-values-excluded-combination = selectPrimeNumbers валли панӑ хаксем кӑларнӑ пӗрлешӳ пулнӑ

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ӑшӗнче пӗрлешӳсен 70%-ран ытлашшине кӑларнӑ

select-random-combination-fluke = Питӗ пулма пултарайман ӑнсӑртлӑх пирки ӑнсӑрт хаксен пӗрлешӗвне суйлама пулмарӗ

select-random-value-fluke = Питӗ пулма пултарайман ӑнсӑртлӑх пирки ӑнсӑрт хака суйлама пулмарӗ
