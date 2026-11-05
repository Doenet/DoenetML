# Southern Altai diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Cyrillic in the standard Altai alphabet, with **ј ҥ ӧ ӱ** as full letters —
# the same convention as the other three files of this locale.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# HOW THIN THIS IS. Altai has no written register for software diagnostics, so
# this file is a first attempt throughout, and the Russian words stand wherever
# nothing Altai could be established: `компонент`, `атрибут`, `функция`,
# `индекс`, `массив`, `матрица`, `параметр`, `формат`, `версия`, `рекурсия`,
# `строка`, `столбец`, `точка`, `координата`. Written Altai takes such a loan
# in its Russian spelling, so that is how they appear here.
#
# Altai puts its verb last and its modifiers in front of what they modify, so
# these sentences are reordered rather than substituted into an English frame.
# Every count selection is a single `*[other]`: Altai does not mark number
# after a numeral, and `Intl.PluralRules` has no data for `alt` with which a
# `[one]` branch could ever be selected.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] эки учы кӧргӱзилгенде { $attributes } тоого алылбайт
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] учы ла ортозы кожо кӧргӱзилгенде { $attributes } тоого алылбайт
    }

line-segment-midpoint-offset-without-midpoint = ортозы јогынаҥ midpointOffset неге де салтарын јетирбейт

## `<line>`

line-points-undetermined-dimensions = Кеми јартабаган точкалар ажыра ӧтӧтӧн тӱс сызык.

line-points-too-few-dimensions = Тӱс сызык эҥ ле ас эки кемдӱ точкалар ажыра ӧтӧр учурлу.

line-points-depend-on-variables = Тӱс сызык солынып турган немелерге бӱдӱмјилӱ точкалар ажыра ӧдӧт: { $variables }.

line-equation-invalid-format = { $variable1 } ла { $variable2 } немелерлӱ тӱс сызыктыҥ уравнениезиниҥ форматы јарабас.

## `<ray>`

ray-overprescribed-through = Луч through, endpoint ла direction ажыра берилген. Кӧргӱзилген through тоого алылбайт.

ray-dimension-mismatch = лучта numDimensions келишпейт.

## `<vector>`

vector-overprescribed-head = Вектор head, tail ла displacement ажыра берилген. Кӧргӱзилген head тоого алылбайт.

vector-dimension-mismatch = векторло numDimensions келишпейт.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элементке тартарга болбос, нениҥ учун дезе оныҥ nearestPoint турум немези јок.

constrain-to-without-nearest-point = `<{ $component }>` элементле кызырарга болбос, нениҥ учун дезе оныҥ nearestPoint турум немези јок.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементтиҥ ичиле кызырарга болбос, нениҥ учун дезе оныҥ nearestPoint турум немези јок.

## `<choiceInput>`

choice-input-label-position-ignored = inline эмес choiceInput учун labelPosition тоого алылбайт

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput учун кӧргӱзилген индекстер тоого алылбайт, нениҥ учун дезе индекстердиҥ тоозы талдама балдардыҥ тоозына келишпейт.

pretzel-indices-count-mismatch = problem учун кӧргӱзилген индекстер тоого алылбайт, нениҥ учун дезе индекстердиҥ тоозы problem балдардыҥ тоозына келишпейт.

shuffle-indices-count-mismatch = shuffle учун кӧргӱзилген индекстер тоого алылбайт, нениҥ учун дезе индекстердиҥ тоозы компоненттердиҥ тоозына келишпейт.

indices-ignored-out-of-range = { $component } учун кӧргӱзилген индекстер тоого алылбайт, нениҥ учун дезе кезик индекстер кемнеҥ тышкары.

pretzel-indices-repeated = pretzel учун кӧргӱзилген индекстер тоого алылбайт, нениҥ учун дезе кезик индекстер катап келет.

pretzel-circuit-first-index = circuit режимдӱ pretzel учун кӧргӱзилген индекстер тоого алылбайт, нениҥ учун дезе баштапкы индекс 1 болор учурлу.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` строка балдарла иштезин деп, `type` атрибут кӧргӱзилер учурлу.

invalid-type-defaulting-to-math = { $component } компонентке { $type } тӱри јарабас. Ол math, text, number эмезе boolean болор учурлу. math алынат.

string-not-valid-component-to-arrange = "{ $value }" строка { $component } учун јарамыкту компонент эмес. Тоого алылбайт.

## Types and variables

invalid-type-defaulting-to-number = { $type } тӱри јарабас, тӱри number эдип салынат.

invalid-variable-value = Солынып турган неменин учуры јарабас: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариант индекс тоо болор учурлу

variant-index-must-be-integer = { $index } вариант индекс бӱткӱл тоо болор учурлу

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют кемдерге эдилбеген. Кӧндӱзи тӱҥдештирӱлӱ эдип салынат.

side-by-side-absolute-margins = `<{ $component }>` абсолют кемдерге эдилбеген. Кыйулары тӱҥдештирӱлӱ эдип салынат.

side-by-side-no-block-child = Јарабас `<{ $component }>`: оныҥ эҥ ле ас бир блок балазы болор учурлу.

## `<label>`

label-for-ignored-on-graphical = График `<label>` ӱстиндеги `for` атрибут тоого алылбайт.

label-for-must-resolve-to-one = `<label>` ӱстиндеги `for` атрибут јаҥыс бир компонентке келижер учурлу.

label-for-unresolved = `<label>` ӱстиндеги `for` атрибутты компонентке келиштирерге болбоды.

label-for-answer-with-authored-inputs = `<label>` ӱстиндеги `for` атрибут авторы бойы бичиген киргизӱлерлӱ `<answer>` кӧргӱзет; киргизӱниҥ бойына шилтӱ эдигер.

label-for-answer-without-input = `<label>` ӱстиндеги `for` атрибут темдектеер киргизӱзи јок `<answer>` кӧргӱзет.

label-for-must-reference-input-or-answer = `<label>` ӱстиндеги `for` атрибут киргизӱге эмезе карууга шилтӱ эдер учурлу.

## Accessibility

accessibility-short-description-or-decorative = Тузаланар арга учун `<{ $component }>` эмезе кыска јартамалду болор учурлу, эмезе јаражыдар деп кӧргӱзилер учурлу.

accessibility-video-short-description = Тузаланар арга учун `<video>` кыска јартамалду болор учурлу.

accessibility-input-short-description-or-label = Тузаланар арга учун `<{ $component }>` кыска јартамалду эмезе темдектӱ болор учурлу.

accessibility-answer-input-short-description-or-label = Тузаланар арга учун киргизӱ эткен `<answer>` кыска јартамалду эмезе темдектӱ болор учурлу.

accessibility-short-description-contains-math = Кыска јартамалдарда `<{ $component }>` чылап математика компоненттери болбос учурлу. Математиканы сӧстӧрлӧ бичигер.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } бӧлӱктиҥ адыныҥ текстине једер контраст бербейт (караҥуй режим) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эҥ ле ас { $threshold }:1 керек).
       *[other] { $colorName } бӧлӱктиҥ адыныҥ текстине једер контраст бербейт ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эҥ ле ас { $threshold }:1 керек).
    }

## `<circle>`

circle-through-points-non-numerical = Точкалардыҥ тоо учуры јок тушта { $count } точка ажыра ӧтӧтӧн `<circle>` эдилбеген.

circle-too-many-through-points = 3-теҥ кӧп точка ажыра ӧтӧтӧн тегеректи бодоорго болбос.

circle-overprescribed-radius-center-points = Радиузы, ортозы ла точкалары кожо кӧргӱзилген тегеректи бодоорго болбос.

circle-center-with-multiple-points = Ортозы кӧргӱзилген тегеректи 1-деҥ кӧп точка ажыра бодоорго болбос.

circle-radius-too-small = Тегеректи бодоорго болбос: эки точканыҥ ортозындагы ыраак { $distance } болзо, кӧргӱзилген { $radius } радиус тыҥ кичӱ.

circle-radius-with-many-points = Радиузы кӧргӱзилген тегеректи экидеҥ кӧп точка ажыра эдерге болбос.

circle-invalid-center-or-through-points = Тегеректиҥ ортозы эмезе ӧтӧтӧн точкалары јарабас.

circle-radius-center-with-multiple-points = Ортозы кӧргӱзилген тегеректиҥ радиузын 1-деҥ кӧп точка ажыра бодоорго болбос.

circle-change-radius-non-numerical = Тоо эмес точкалар ажыра ӧтӧтӧн тегеректиҥ радиузын солыырга болбос

circle-radius-with-points-non-numerical = Тоо учурлары јок тушта радиузы кӧргӱзилген тегеректи бирдеҥ кӧп точка ажыра эдерге болбос.

circle-change-center-non-numerical = Тоо эмес точкалар ажыра ӧтӧтӧн тегеректиҥ ортозын солыырга эдилбеген.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] Функцияныҥ јартамал областыныҥ кеми једишпейт. Областта { $intervals } ара бар, је функцияда { $inputs ->
           *[other] { $inputs } киргизӱ
        } бар.
    }

function-domain-invalid-format = Функцияныҥ јартамал областыныҥ форматы јарабас.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцияныҥ тоо эмес максимумы тоого алылбайт.
        [minimum] Функцияныҥ тоо эмес минимумы тоого алылбайт.
        [extremum] Функцияныҥ тоо эмес экстремумы тоого алылбайт.
        [point] Функцияныҥ тоо эмес точказы тоого алылбайт.
        [slope] Функцияныҥ тоо эмес јатпаш коэффициенти тоого алылбайт.
       *[other] Функцияныҥ тоо эмес { $type } учуры тоого алылбайт.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцияныҥ куру максимумы тоого алылбайт.
        [minimum] Функцияныҥ куру минимумы тоого алылбайт.
        [extremum] Функцияныҥ куру экстремумы тоого алылбайт.
        [point] Функцияныҥ куру точказы тоого алылбайт.
       *[other] Функцияныҥ куру { $type } учуры тоого алылбайт.
    }

function-points-too-close = Функцияда орындары бой-бойына тыҥ јуук эки точка бар. Функцияны јартаарга болбос.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] Функция итерациялары киргизӱлердиҥ тоозы чыгарылардыҥ тоозына тӱҥей болзо ло болор. Бу функцияда { $inputs } киргизӱ ле { $outputs ->
           *[other] { $outputs } чыгарылар
        } бар.
    }

## `<sequence>`

sequence-invalid-length = Изӱниҥ узуны јарабас. Ол минус эмес бӱткӱл тоо болор учурлу.

sequence-invalid-step = Изӱниҥ адымы јарабас. { $type } тӱрлӱ изӱге ол тоо болор учурлу.

sequence-invalid-endpoint-number = Тоо изӱзиндеги "{ $attribute }" јарабас. Ол тоо болор учурлу.

sequence-invalid-endpoint-letters = Бичик изӱзиндеги "{ $attribute }" јарабас. Ол бичиктердиҥ кожулталары болор учурлу.

sequence-invalid-endpoint = Изӱдеги "{ $attribute }" јарабас.

select-from-sequence-coprime-not-numbers = тоо талдалбаганда coprime тоого алылбайт

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations кӧргӱзилгенде coprime тоого алылбайт

## Resolving a `target`

target-not-found = `<{ $source }>` учун target јарабас: некелген неме табылбаган.

target-state-variable-not-found = `<{ $source }>` учун target јарабас: `<{ $component }>` ӱстинде "{ $property }" деген турум немези табылбаган.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` солынып турган немелери камаанду эмес немедеҥ ӧскӧ болор учурлу.

ode-system-duplicate-variable-names = Катап келген аттарлу ODE RHS функцияларын јартаарга болбос.

ode-system-rhs-function-error = ODE RHS функцияны јартаарга болбос. mathjs функцияны эдерде јастыра.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } тӱс сызыктыҥ ортозындагы мӱйӱшти јартаарга болбос

angle-invalid-through-point = `<angle>` тиҥ through дегенинде точка јарабас

parabola-vertex-too-many-points = Тӧбӧзи берилген параболаны 1-деҥ кӧп точка ажыра ӧткӱрерге эдилбеген.

parabola-too-many-points = Параболаны 3-теҥ кӧп точка ажыра ӧткӱрерге эдилбеген.

intersection-too-many-items = Экидеҥ кӧп неменин кыйыжы эдилбеген

## Other math components

ionic-compound-not-two-ions = Эки иондоҥ ӧскӧ ион кожулта эдилбеген.

ionic-compound-needs-cation-and-anion = Ион кожулта јаҥыс бир катион ло бир анион учун эдилген.

solve-equations-cannot-evaluate = Уравнениени чечерге болбос, нениҥ учун дезе оны бодоорго болбоды: { $equation }

math-operators-operand-number-required = Математика операндты аларда operandNumber кӧргӱзилер учурлу.

eigen-decomposition-failed = Матрицаныҥ бойыныҥ учурларын бодоорго болбоды

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: { $parameters } параметрлер ӱлгерде јок, оныҥ учун олор качан да ак орынга келижер.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" оҥдолбойт. Ол none, medium, dense эмезе ак орынла айырылган эки плюс тоо болор учурлу, темдектезе grid="1 0.5". Тор тартылбайт.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` учун { $expected ->
        [1] ар бир точкада y' јатпаш коэффициентин берер бир чыгарылу, темдектезе `y - x` чылап
       *[other] ар бир точкада вектор берер эки чыгарылу, темдектезе `(y, -x)` чылап
    } функция керек, је берилген функцияда { $found ->
       *[other] { $found } чыгарылар
    } бар. { $alternative ->
        [none] Не де тартылбайт.
       *[other] Бу функцияга `<{ $alternative }>` компонент келижет. Не де тартылбайт.
    }

field-function-attribute-ignored-with-child = `function` атрибут тоого алылбайт, нениҥ учун дезе функция компоненттиҥ ичинде де берилген; ичиндегизи тузаланат. Функцияны јаҥыс бир јолло бергер.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибут компоненттиҥ ичинде тӱс бичилген выражениениҥ немелерин адайт. { $reason ->
        [function-child] Мындагы функция `<function>` бала чылап берилген, ол бойыныҥ немелерин бойы адайт, оныҥ учун `variables` тоого алылбайт.
       *[no-expression] Мында андый выражение берилбеген, оныҥ учун `variables` тоого алылбайт.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure кӧргӱзеринде xLabelPosition="left" болушпайт; оҥ јаныныҥ турумы тузаланат.

prefigure-y-label-position-unsupported = `<graph>`: prefigure кӧргӱзеринде yLabelPosition="bottom" болушпайт; ӱстиги јаныныҥ турумы тузаланат.

prefigure-invalid-axis-bounds = `<graph>`: prefigure кӧчӱрерге ось кемдери јарабас; тӧс bbox (-10,-10,10,10) тузаланат.

prefigure-invalid-width = `<graph>`: prefigure кӧчӱрерге кӧндӱзи јарабас; тӧс диаграмма кӧндӱзи 425 тузаланат.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure кӧчӱрерге aspectRatio јарабас; тӧс 1 катнаш тузаланат.

prefigure-grid-spacing-too-fine = `<graph>`: тордыҥ адымы ось кемдерине тыҥ кичӱ; prefigure кӧргӱзеринде тор тартылбайт.

prefigure-annotations-not-rendered = `<graph>`: PreFigure кӧргӱзери тузаланбаза, аннотациялар тартылбайт.

multiple-annotations-children = `<graph>` ичинде кӧп `<annotations>` бала табылган; калганчызынаҥ ӧскӧзи ончозы тоого алылбайт.

## Referring to other components

copy-unrecognized-component-type = Оҥдолбогон компонент тӱрин узадарга эмезе кӧчӱрерге болбос: { $type }.

copy-prop-not-found = { $component } тӱрлӱ компонентте { $property } prop табылбаган

collect-no-source = collect учун тӧс табылбаган.

collect-invalid-component-type = `<{ $component }>` тӱрлӱ компоненттерди јуурга болбос, нениҥ учун дезе бу јарабас компонент тӱри.

reference-index-unavailable = `{ $reference }` индекске шилтӱ эдерге болбос

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентте { $action } кыйгырарга болбос

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Јетирӱлердиҥ кӧрӱми јарабас. Строкалардыҥ узуны башка-башка. Табылган јери componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Јетирӱлерде катап келген столбец аттары бар. Табылган јери componentIdx :{ $componentIdx }

data-frame-missing-column-name = Јетирӱлерде столбецтиҥ ады једишпейт. Табылган јери componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Бу карууныҥ баазы каруу тегтиҥ бойы ийген карууына тӧзӧлӧт, ол сакыбаган турумга экелер.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` бар контейнердиҥ ичиндеги `<answer>` ге `maxNumAttempts` салганы неге де салтарын јетирбейт, нениҥ учун дезе шенелтелердиҥ тоозын контейнер тудат. `maxNumAttempts` ты контейнердиҥ бойына салыгар.

nested-section-wide-check-work-max-num-attempts = Ӧскӧ `sectionWideCheckWork` контейнердиҥ ичинде турган `sectionWideCheckWork` контейнерге `maxNumAttempts` салганы неге де салтарын јетирбейт, нениҥ учун дезе шенелтелердиҥ тоозын тыштагы контейнер тудат. `maxNumAttempts` ты тыштагы контейнерге салыгар.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] symbolicEquality салылбаза, { $attributes } атрибуттар неге де салтарын јетирбейт.
    }

answer-invalid-type = Карууга тӱри јарабас: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компоненттиҥ ады јок болгонынаҥ, оны модуль атрибут эдип тузаланарга болбос

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентти модульге атрибут эдип тузаланарга болбос, нениҥ учун дезе `<module>` компонент тӱринде "{ $name }" атрибут јартаган ла.

conditional-content-condition-ignored = case эмезе else балдарлу `<conditionalContent>` компонентте `condition` атрибут тоого алылбайт.

slider-markers-type-mismatch = Маркерлердиҥ тӱри slider тӱрине келишпейт.

pretzel-problem-needs-statement-and-answer = Јарабас pretzel: ар бир `<problem>` бир `<statement>` ле бир `<answer>` тудар учурлу.

pretzel-circuit-first-problem-distractor = Јарабас pretzel: mode="circuit" де баштапкы `<problem>` дистрактор болбос.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] `{ $attribute }` атрибутка { $values } учурлары јарабас; тоого алылбайт.
    }

attribute-must-be-references = `{ $attribute }` атрибутка `{ $value }` учуры јарабас. Атрибут `$` ла башталган шилтӱлердеҥ турар учурлу.

math-input-invalid-function-names = <mathInput>: { $attribute } дагы јарабас функция аттары тоого алылбады: { $names }. Ар бир аттыҥ кӧрӱнер кезеги эҥ ле ас 2 темдектеҥ (бичик эмезе сызык) турар учурлу; оныҥ кийнинде кӱӱнзезе `|<mathspeak alternative>` кожулта болор аргалу.

## Building components from the source

component-type-invalid = Компонент тӱри јарабас: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутты катап эдерге болбос.

attribute-invalid-for-component = `<{ $componentType }>` тӱрлӱ компонентке "{ $attribute }" атрибут јарабас.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль јартамал { $context ->
        [text-on-background] текст ӧҥи ле фон ӧҥиниҥ ортозында
        [high-contrast] бийик контрастту ӧҥ лӧ канвастыҥ ортозында
        [line] сызык ӧҥи ле канвастыҥ ортозында
        [marker] маркер ӧҥи ле канвастыҥ ортозында
       *[text-on-canvas] текст ӧҥи ле канвастыҥ ортозында
    } једер контраст бербейт{ $mode ->
        [dark] { " (караҥуй режим)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эҥ ле ас { $threshold }:1 керек).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль јартамалда кӧргӱзилген ӧҥдӧр јарык режимге једер контраст берип турза да, олордоҥ алынган караҥуй режимниҥ ӧҥдӧри текст ӧҥи ле фон ӧҥиниҥ ортозында једер контраст бербейт ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эҥ ле ас { $threshold }:1 керек). { $suggestion ->
        [available] Караҥуй режимде једер контраст болзын деп, эмезе јарык режимниҥ контрастын кӧдӱригер (темдектезе { $lightAttribute }="{ $lightColor }" салыгар), эмезе караҥуй режимниҥ ӧҥин бойыгар бергер (темдектезе { $darkAttribute }="{ $darkColor }" салыгар).
       *[none] Караҥуй режимде једер контраст болзын деп, јарык режимниҥ контрастын кӧдӱригер эмезе алынган ӧҥдӧрди textColorDarkMode ла/эмезе backgroundColorDarkMode ажыра бойыгар бергер.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль јартамалда кӧргӱзилген текст ӧҥи јарык режимге једер контраст берип турза да, оноҥ алынган караҥуй режимниҥ текст ӧҥи канваска једер контраст бербейт ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эҥ ле ас { $threshold }:1 керек). { $suggestion ->
        [available] Караҥуй режимде једер контраст болзын деп, эмезе јарык режимниҥ контрастын кӧдӱригер (темдектезе textColor="{ $lightColor }" салыгар), эмезе караҥуй режимниҥ ӧҥин бойыгар бергер (темдектезе textColorDarkMode="{ $darkColor }" салыгар).
       *[none] Караҥуй режимде једер контраст болзын деп, јарык режимниҥ контрастын кӧдӱригер эмезе алынган ӧҥди textColorDarkMode ажыра бойыгар бергер.
    }

section-multiple-style-palettes = Бир бӧлӱк јаҥыс бир <stylePalette> талдап алар; калганчызы тузаланат.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } ниҥ бойыныҥ вариантарын јартаарга болбос, нениҥ учун дезе numToSelect минус эмес бӱткӱл тоо эмес.

variant-num-to-select-not-constant-number = { $component } ниҥ бойыныҥ вариантарын јартаарга болбос, нениҥ учун дезе numToSelect турум тоо эмес.

variant-with-replacement-not-constant-boolean = { $component } ниҥ бойыныҥ вариантарын јартаарга болбос, нениҥ учун дезе withReplacement турум boolean эмес.

variant-select-weight-disables-unique = selectWeight эмезе selectForVariants кӧргӱзилген талдама бар болзо, select учун бойыныҥ вариантары јабылат

variant-coprime-undetermined = { $component } ниҥ бойыныҥ вариантарын јартаарга болбос, нениҥ учун дезе coprime качан да false болотонын јартаарга болбос.

variant-attribute-not-constant = { $component } ниҥ бойыныҥ вариантарын јартаарга болбос, нениҥ учун дезе { $attribute } турум эмес.

variant-attribute-not-number = { $component } ниҥ бойыныҥ вариантарын јартаарга болбос, нениҥ учун дезе { $attribute } тоо эмес.

variant-attribute-wrong-type-for-sequence =
    { $type } тӱрлӱ { $component } ниҥ бойыныҥ вариантарын јартаарга болбос, нениҥ учун дезе { $attribute } { $expected ->
        [letters-combination] бичиктердиҥ кожулталары
        [math-expression] јарамыкту математика выражение
        [integer] бӱткӱл тоо
       *[number] тоо
    } эмес.

variant-length-not-integer = { $component } ниҥ бойыныҥ вариантарын јартаарга болбос, нениҥ учун дезе length бӱткӱл тоо эмес.

variant-sort-not-implemented = sort бар { $component } ниҥ бойыныҥ вариантары эдилбеген

variant-exclude-combinations-not-implemented = excludeCombinations бар { $component } ниҥ бойыныҥ вариантары эдилбеген

variant-math-exclude-not-implemented = exclude бар math тӱрлӱ { $component } ниҥ бойыныҥ вариантары эдилбеген

variant-non-constant-exclude-not-implemented = турум эмес exclude бар { $component } ниҥ бойыныҥ вариантары эдилбеген

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure кӧргӱзеринде болушпайт; ӱйе ӧткӱрилген.

prefigure-descendant-invalid-geometry = { $subject }: тӱгенбес эмезе толтырылбаган геометрия; ӱйе ӧткӱрилген.

prefigure-curve-label-omitted = { $subject }: кӧчӱрилген ийилген элементтерде темдектер болушпайт; темдек албаган.

prefigure-curve-unsupported-definition-type = { $subject }: ийилген функцияныҥ '{ $definitionType }' јартамал тӱри болушпайт; ӱйе ӧткӱрилген.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves тегы flipFunctions атрибут болушпайт; ӱйе ӧткӱрилген.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves јаҥыс формула тӱрлӱ бала функцияларды болушат; ӱйе ӧткӱрилген.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] сызык бӱлениҥ темдегине
       *[point] точканыҥ темдегине
    } '{ $labelPosition }' labelPosition болушпайт; PreFigure ниҥ тӧс келиштирӱзи тузаланат.

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' будак стильди PreFigure болушпайт; толо будакла солынат.

prefigure-line-style-unknown = { $subject }: оҥдолбогон '{ $lineStyle }' сызык стиль PreFigure чыгарылынаҥ албаган.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' маркер стиль PreFigure ниҥ 'diamond' стилине келиштирилген.

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' маркер стильди PreFigure болушпайт; тӧс стиль тузаланат.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` јарабас; некелген немени табарга болбос. Аннотация албаган.

annotation-ref-multiple-targets = `<annotation>`: `ref` кӧп немеге келишкен; баштапкызы тузаланат.

annotation-ref-outside-graph = `<annotation>`: `ref` јарабас; некелген неме бойыныҥ графигинеҥ тышкары. Аннотация албаган.

annotation-ref-unsupported-target = `<annotation>`: `ref` јарабас; некелген неме prefigure кӧчӱреринде болужатан график неме эмес. Аннотация албаган.

annotation-text-missing = `<annotation>`: `text` јок эмезе куру; куру текст чыгарылат.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Тегерик бӱдӱмји табылган.
       *[other] `<{ $componentType }>` компонентле колбулу тегерик бӱдӱмји табылган.
    }

reference-no-referent = Шилтӱге не де табылбаган: `{ $reference }`

reference-multiple-referents = Шилтӱге кӧп неме табылган: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` ниҥ { $attribute } атрибудыныҥ форматы јарабас.

children-invalid = `<{ $componentType }>` учун балдары јарабас: јарабас балдар табылган: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибутка `{ $value }` учуры јарабас, `{ $default }` учуры тузаланат

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версиязы табылбаган.
       *[other] DoenetML { $version } версиязы табылбаган. { $fallback } версиязына кайра барат
    }

## Reading the DoenetML

parse-invalid-doenetml = Јарабас DoenetML: { $content }

parse-tag-missing-close-tag = Јарабас DoenetML: `{ $tag }` тегтиҥ јабар теги јок. Бойы јабылатан тег эмезе `</{ $tagName }>` тег сакылган.

parse-tag-error = Јарабас DoenetML: `<{ $tagName }>` тегте јастыра

parse-attribute-missing-value = Јарабас DoenetML: `{ $attribute }` атрибуттыҥ учуры једишпейт болор.

parse-attribute-invalid = Јарабас DoenetML: `{ $attribute }` атрибут јарабас

parse-attribute-value-invalid = Јарабас DoenetML: `{ $value }` атрибут учуры јарабас

parse-attribute-value-quote-mismatch = Јарабас DoenetML: `{ $value }` атрибут учуры јарабас. Кавычкалар келишпейт. `{ $quote }` једишпейт болор

parse-open-tag-name-missing = Јарабас DoenetML: Ады јок тег табылган, темдектезе `<`

parse-tag-not-closed = Јарабас DoenetML: `{ $tag }` тег јабылбаган (`>` једишпейт болор).

parse-self-closing-tag-name-missing = Јарабас DoenetML: Ады јок тег табылган `<{ $content }>`

parse-self-closing-tag-not-closed = Јарабас DoenetML: `{ $tag }` тег јабылбаган (`/>` једишпейт болор).

parse-tag-invalid-attributes = Јарабас DoenetML: `{ $tag }` тег јарабас. Оныҥ атрибуттары јастыра болор аргалу.

parse-close-tag-name-missing = Јарабас DoenetML: Ады јок јабар тег табылган, темдектезе `</`

parse-attribute-value-unquoted = Атрибут учурлары кавычкага алынар учурлу: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Јарабас DoenetML: `{ $tag }` јабар тег табылган, је ого келижер ачар тег јок

parse-close-tag-mismatched = Јарабас DoenetML: Јабар тег келишпейт. `</{ $expected }>` сакылган. `{ $found }` табылган

parser-node-unconvertible = { $node } тӱгӱнди Dast тӱгӱнине кӧчӱрерге болбоды.

## Names

name-attribute-invalid =
    name='{ $name }' атрибут јарабас. { $reason ->
        [characters] Аттарда јаҥыс бичиктер, тоолор, алдындагы сызык эмезе сызык болор аргалу.
       *[start] Аттар бичиктеҥ башталар учурлу.
    }

component-name-invalid-start = "{ $name }" компоненттиҥ ады јарабас. Аттар бичиктеҥ башталар учурлу.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched тӱрлӱ карууныҥ video атрибуды болор учурлу

answer-video-watched-video-not-reference = videoWatched тӱрлӱ карууныҥ video атрибуды шилтӱ болор учурлу

answer-name-not-single-text = Карууныҥ name атрибудыныҥ јаҥыс бир текст балазы болор учурлу

## Referencing another document

external-doenetml-recursion-limit = Рекурсияныҥ кеми тыҥ кӧп болгонынаҥ тыштагы DoenetML алынбайт. Тегерик шилтӱ бар эмеш пе?

external-doenetml-unavailable = { $attribute }="{ $uri }" деҥ DoenetML алынбайт

external-doenetml-type-mismatch = { $attribute }="{ $uri }" деҥ алынган DoenetML јарабас: ол "{ $componentType }" компонент тӱрине келишпеди

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут эскирген; оныҥ ордына `{ $to }` тузаланыгар.
       *[other] [deprecation] `<{ $component }>` тегтеги `{ $from }` атрибут эскирген; оныҥ ордына `{ $to }` тузаланыгар.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут эскирген ле `{ $to }` де кӧргӱзилгенинеҥ тоого алылбайт.
       *[other] [deprecation] `<{ $component }>` тегтеги `{ $from }` атрибут эскирген ле `{ $to }` де кӧргӱзилгенинеҥ тоого алылбайт.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` тегтеги `{ $attribute }` атрибут эскирген ле тоого алылбайт.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` тегтеги `{ $attribute }` атрибут эскирген; оныҥ ордына `<{ $child }>` бала тузаланыгар.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` тегтеги `{ $attribute }` атрибуттыҥ `{ $value }` учуры эскирген; оныҥ ордына `{ $to }` тузаланыгар.


## Language coverage

pluralize-english-only = `<pluralize>` јаҥыс англис тилдиҥ сӧзин кӧп тоого кӧчӱрер аргалу, оныҥ учун { $locale } тилле бичилген документте оныҥ тексти солынбай артат. Кӧп тоо тӱрин тӱс бичигер эмезе оны `pluralForm` атрибутла бергер.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент Doenet билер элемент эмес.

schema-element-not-allowed-at-root = `<{ $tag }>` элементке документтиҥ тӧзинде јарабайт.

schema-element-not-allowed-inside = `<{ $tag }>` элементке `<{ $parent }>` ичинде јарабайт.

schema-attribute-unrecognized = `<{ $tag }>` элементтиҥ `{ $attribute }` деген атрибуды јок.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементтиҥ `{ $attribute }` атрибуды ар бир агазы мыналардыҥ бирӱзи болотон список болор учурлу: { $allowed }
       *[other] `<{ $tag }>` элементтиҥ `{ $attribute }` атрибуды мыналардыҥ бирӱзи болор учурлу: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select учун вариант ады јарабас. { $variantName } вариант ады { $numOptions } вариантта туштайт, је талданар тоозы { $numToSelect }.

select-variant-name-without-options = select учун кезик вариантар кӧргӱзилген, је болор аргалу { $variantName } вариант адына не де вариант кӧргӱзилбеген.

select-variant-name-not-possible = select учун кӧргӱзилген { $variantName } вариант ады болор аргалу вариант ады эмес.

select-too-few-options = Бар болгон { $numOptions } компоненттеҥ { $numToSelect } талдаарга болбос.

select-from-sequence-too-few-values = Узуны { $length } болгон изӱдеҥ { $numToSelect } учур талдаарга болбос.

select-from-sequence-indices-count-mismatch = select учун кӧргӱзилген индекстердиҥ тоозы талданар тоого келижер учурлу

select-from-sequence-indices-not-integers = select учун кӧргӱзилген ончо индекстер бӱткӱл тоо болор учурлу

select-from-sequence-index-excluded = selectfromsequence учун чыгарылган индекс кӧргӱзилген

select-from-sequence-indices-excluded-combination = selectfromsequence учун чыгарылган кожулта кӧргӱзилген

select-from-sequence-coprime-not-positive-integers = Плюс бӱткӱл тоолор талдалбаганда бой-бойына башка кожулталарды талдаарга болбос.

select-from-sequence-coprime-common-factor = Бой-бойына башка тоолорды талдаарга болбос. Болор аргалу ончо учурлардыҥ ортодогы бӧлӱгези бар. ("from" эмезе "to" ныҥ кӧргӱзилген учурлары "step" ле бой-бойына башка болор учурлу.)

select-from-sequence-coprime-single-number = 1-деҥ ӧскӧ јаҥыс тоодоҥ бой-бойына башка кожулталарды талдаарга болбос.

select-from-sequence-excluded-too-many-combinations = selectFromSequence те кожулталардыҥ 70% -теҥ кӧби чыгарылган

select-from-sequence-coprime-none-found = Бой-бойына башка тоолорды талдаарга болбоды. Болор аргалу ончо учурлардыҥ ортодогы бӧлӱгези бар.

select-from-sequence-too-few-unique-values = Узуны { $numPossibleValues } болгон изӱдеҥ { $numToSelect } бойыныҥ учурын талдаарга болбос

select-prime-numbers-too-few-values = Узуны { $numValues } болгон тӧс тоолордыҥ спискозынаҥ { $numToSelect } учур талдаарга болбос

select-prime-numbers-values-count-mismatch = select учун кӧргӱзилген учурлардыҥ тоозы талданар тоого келижер учурлу

select-prime-numbers-values-not-prime = select prime number учун кӧргӱзилген ончо учурлар тӧс тоолордыҥ спискозында болор учурлу

select-prime-numbers-values-excluded-combination = selectPrimeNumbers учун кӧргӱзилген учурлар чыгарылган кожулта болгон

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers те кожулталардыҥ 70% -теҥ кӧби чыгарылган

select-random-combination-fluke = Тыҥ сирекке туштаар керек болуп, туштаган учурлардыҥ кожултазын талдаарга болбоды

select-random-value-fluke = Тыҥ сирекке туштаар керек болуп, туштаган учурды талдаарга болбоды

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` математиканыҥ ичинде тартылбайт; выражение киргизӱлер ичине салынбаган ӧйдӧгизи чылап терилет. { $reason ->
        [not-inline] Выражениениҥ ичине јаҥыс `inline` талдама киргизӱ сыйат; `inline` јок болзо, ол кнопкалардыҥ блогы болот.
        [expanded] `expanded` текст киргизӱ кӧп строкалу ящик, ол выражениениҥ ичинде турарга тыҥ јаан.
        [on-graph] Графикте выражение бир бӱткӱл јурук чылап тартылат, анда тудунар немеге орын јок.
       *[relative-width] Оныҥ `width` и тӱҥдештирӱлӱ (процент эмезе `em`), је выражениениҥ ичинде оны тӱҥдештирер неме јок. Кӧндӱзин `px` чылап абсолют кемле бергер.
    }
