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
        [one] икĕ вĕç пăнчине те кăтартнă чухне { $attributes } шута илмест
       *[other] икĕ вĕç пăнчине те кăтартнă чухне { $attributes } шута илмест
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] вĕç пăнчипе варри пăнчине те кăтартнă чухне { $attributes } шута илмест
       *[other] вĕç пăнчипе варри пăнчине те кăтартнă чухне { $attributes } шута илмест
    }

line-segment-midpoint-offset-without-midpoint = варри пăнчисĕр midpointOffset нимĕне те витĕм кӳмест

## `<line>`

line-points-undetermined-dimensions = Виçи паллă мар пăнчăсем витĕр тухакан тӳрĕ йĕр.

line-points-too-few-dimensions = Тӳрĕ йĕр чи сахалран икĕ виçеллĕ пăнчăсем витĕр тухмалла.

line-points-depend-on-variables = Тӳрĕ йĕр улшăнакансенчен килекен пăнчăсем витĕр тухать: { $variables }.

line-equation-invalid-format = { $variable1 } тата { $variable2 } улшăнаканĕсенчи тӳрĕ йĕр танлăхĕн форматне йышăнмасть.

## `<ray>`

ray-overprescribed-through = Пайăркана through, endpoint тата direction урлă панă. Панă through шута илмест.

ray-dimension-mismatch = пайăркара numDimensions килĕшмест.

## `<vector>`

vector-overprescribed-head = Вектора head, tail тата displacement урлă панă. Панă head шута илмест.

vector-dimension-mismatch = векторта numDimensions килĕшмест.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элемент патне туртма пулмасть, мĕншĕн тесен унăн nearestPoint статус улшăнаканĕ çук.

constrain-to-without-nearest-point = `<{ $component }>` элементпа чарса тăма пулмасть, мĕншĕн тесен унăн nearestPoint статус улшăнаканĕ çук.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементăн шалĕпе чарса тăма пулмасть, мĕншĕн тесен унăн nearestPoint статус улшăнаканĕ çук.

## `<choiceInput>`

choice-input-label-position-ignored = йĕрке ăшĕнче мар choiceInput валли labelPosition шута илмест

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput валли панă индекссем шута илмеççĕ, мĕншĕн тесен вĕсен йышĕ choice ачисен йышĕпе килĕшмест.

pretzel-indices-count-mismatch = problem валли панă индекссем шута илмеççĕ, мĕншĕн тесен вĕсен йышĕ problem ачисен йышĕпе килĕшмест.

shuffle-indices-count-mismatch = shuffle валли панă индекссем шута илмеççĕ, мĕншĕн тесен вĕсен йышĕ компонентсен йышĕпе килĕшмест.

indices-ignored-out-of-range = { $component } валли панă индекссем шута илмеççĕ, мĕншĕн тесен хăшĕсем чикĕрен тухаççĕ.

pretzel-indices-repeated = pretzel валли панă индекссем шута илмеççĕ, мĕншĕн тесен хăшĕсем тепĕр хут тĕл пулаççĕ.

pretzel-circuit-first-index = circuit режимĕнче pretzel валли панă индекссем шута илмеççĕ, мĕншĕн тесен пĕрремĕш индекс 1 пулмалла.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текст ачисемпе ĕçлетĕр тесен `type` атрибут памалла.

invalid-type-defaulting-to-math = { $component } компонент валли тĕрĕс мар тĕс { $type }. Вăл math, text, number е boolean пулмалла. math усă курать.

string-not-valid-component-to-arrange = «{ $value }» йĕрки { $component } валли юрăхлă компонент мар. Шута илмест.

## Types and variables

invalid-type-defaulting-to-number = Тĕрĕс мар тĕс { $type }, тĕсне number тăваççĕ.

invalid-variable-value = Улшăнаканăн тĕрĕс мар хакĕ: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариант индексĕ хисеп пулмалла

variant-index-must-be-integer = { $index } вариант индексĕ тулли хисеп пулмалла

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют виçесем валли пурнăçламан. Сарлакăшсене танлаштаруллă тăваççĕ.

side-by-side-absolute-margins = `<{ $component }>` абсолют виçесем валли пурнăçламан. Хĕррисене танлаштаруллă тăваççĕ.

side-by-side-no-block-child = Тĕрĕс мар `<{ $component }>`: унăн чи сахалран пĕр блок ачи пулмалла.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элементри `for` атрибут шута илмест.

label-for-must-resolve-to-one = `<label>` элементри `for` атрибут шăп пĕр компонент çине кăтартмалла.

label-for-unresolved = `<label>` элементри `for` атрибута компонентпа çыхăнтарма пулмарĕ.

label-for-answer-with-authored-inputs = `<label>` элементри `for` атрибут автор çырнă кĕртӳ хирĕсем пур `<answer>` çине кăтартать; хир çине тӳрремĕн кăтартăр.

label-for-answer-without-input = `<label>` элементри `for` атрибут паллă тумалли кĕртӳ хирĕ çук `<answer>` çине кăтартать.

label-for-must-reference-input-or-answer = `<label>` элементри `for` атрибут кĕртӳ хирĕ е хурав çине кăтартмалла.

## Accessibility

accessibility-short-description-or-decorative = Майлăх валли `<{ $component }>` е кĕске ăнлантару пулмалла, е эреш тесе палăртмалла.

accessibility-video-short-description = Майлăх валли `<video>` кĕске ăнлантаруллă пулмалла.

accessibility-input-short-description-or-label = Майлăх валли `<{ $component }>` кĕске ăнлантаруллă е паллăллă пулмалла.

accessibility-answer-input-short-description-or-label = Майлăх валли кĕртӳ хирĕ тăвакан `<answer>` кĕске ăнлантаруллă е паллăллă пулмалла.

accessibility-short-description-contains-math = Кĕске ăнлантарусенче `<{ $component }>` пек математика компоненчĕсем пулмалла мар. Математикăна сăмахпа çырăр.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } пай пуçламăшĕн тексчĕ валли çителĕклĕ контраст памасть (тĕттĕм тĕс) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; чи сахалран { $threshold }:1 кирлĕ).
       *[other] { $colorName } пай пуçламăшĕн тексчĕ валли çителĕклĕ контраст памасть ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; чи сахалран { $threshold }:1 кирлĕ).
    }

## `<circle>`

circle-through-points-non-numerical = Пăнчăсен хисеп хакĕсем çук чухне { $count } пăнчă витĕр тухакан `<circle>` пурнăçламан.

circle-too-many-through-points = 3-рен ытла пăнчă витĕр тухакан çаврашкана шутлама пулмасть.

circle-overprescribed-radius-center-points = Панă радиуспа, варрипе тата пăнчăсемпе çаврашкана шутлама пулмасть.

circle-center-with-multiple-points = Панă варрипе 1-рен ытла пăнчă витĕр тухакан çаврашкана шутлама пулмасть.

circle-radius-too-small = Çаврашкана шутлама пулмасть: икĕ пăнчă хушши { $distance } пулнипе панă радиус { $radius } ытла пĕчĕк.

circle-radius-with-many-points = Панă радиуспа иккĕрен ытла пăнчă витĕр тухакан çаврашка тума пулмасть.

circle-invalid-center-or-through-points = Çаврашкан варри е пăнчисем тĕрĕс мар.

circle-radius-center-with-multiple-points = Панă варрипе 1-рен ытла пăнчă витĕр тухакан çаврашкан радиусне шутлама пулмасть.

circle-change-radius-non-numerical = Хисеп мар пăнчăллă çаврашкан радиусне улăштарма пулмасть

circle-radius-with-points-non-numerical = Хисеп хакĕсем çук чухне панă радиуспа пĕрререн ытла пăнчă витĕр тухакан çаврашка тума пулмасть.

circle-change-center-non-numerical = Хисеп мар пăнчăсем витĕр тухакан çаврашкан варрине улăштарассине пурнăçламан.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцин палăртнă лаптăкĕн виçи çителĕксĕр. Лаптăкра { $intervals } хушăк пур, функцире вара { $inputs ->
            [one] { $inputs } кĕрӳ
           *[other] { $inputs } кĕрӳ
        }.
       *[other] Функцин палăртнă лаптăкĕн виçи çителĕксĕр. Лаптăкра { $intervals } хушăк пур, функцире вара { $inputs ->
            [one] { $inputs } кĕрӳ
           *[other] { $inputs } кĕрӳ
        }.
    }

function-domain-invalid-format = Функцин палăртнă лаптăкĕн форматне йышăнмасть.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцин хисеп мар максимумне шута илмест.
        [minimum] Функцин хисеп мар минимумне шута илмест.
        [extremum] Функцин хисеп мар экстремумне шута илмест.
        [point] Функцин хисеп мар пăнчине шута илмест.
        [slope] Функцин хисеп мар чалăшлăхне шута илмест.
       *[other] Функцин хисеп мар { $type } хакне шута илмест.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцин пушă максимумне шута илмест.
        [minimum] Функцин пушă минимумне шута илмест.
        [extremum] Функцин пушă экстремумне шута илмест.
        [point] Функцин пушă пăнчине шута илмест.
       *[other] Функцин пушă { $type } хакне шута илмест.
    }

function-points-too-close = Функцире пĕр-пĕрне ытла çывăх икĕ пăнчă пур. Функцие палăртма пулмасть.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функци итерацийĕсем кĕрӳсен йышĕ тухăçсен йышĕпе тан пулсан кăна пулаççĕ. Ку функцире { $inputs } кĕрӳ тата { $outputs ->
            [one] { $outputs } тухăç
           *[other] { $outputs } тухăç
        } пур.
       *[other] Функци итерацийĕсем кĕрӳсен йышĕ тухăçсен йышĕпе тан пулсан кăна пулаççĕ. Ку функцире { $inputs } кĕрӳ тата { $outputs ->
            [one] { $outputs } тухăç
           *[other] { $outputs } тухăç
        } пур.
    }

## `<sequence>`

sequence-invalid-length = Йĕркелĕх вăрăмăшĕ тĕрĕс мар. Вăл негативлă мар тулли хисеп пулмалла.

sequence-invalid-step = Йĕркелĕх утăмĕ тĕрĕс мар. { $type } тĕслĕ йĕркелĕх валли вăл хисеп пулмалла.

sequence-invalid-endpoint-number = Хисеп йĕркелĕхĕн «{ $attribute }» хакĕ тĕрĕс мар. Вăл хисеп пулмалла.

sequence-invalid-endpoint-letters = Сас палли йĕркелĕхĕн «{ $attribute }» хакĕ тĕрĕс мар. Вăл сас паллисен пĕрлешĕвĕ пулмалла.

sequence-invalid-endpoint = Йĕркелĕхĕн «{ $attribute }» хакĕ тĕрĕс мар.

select-from-sequence-coprime-not-numbers = хисепсем суйламаннипе coprime шута илмест

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations панипе coprime шута илмест

## Resolving a `target`

target-not-found = `<{ $source }>` валли тĕрĕс мар target: тĕллев тупăнмарĕ.

target-state-variable-not-found = `<{ $source }>` валли тĕрĕс мар target: `<{ $component }>` элементра «{ $property }» ятлă статус улшăнаканĕ тупăнмарĕ.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` улшăнаканĕсем ирĕклĕ улшăнаканран уйрăлса тăмалла.

ode-system-duplicate-variable-names = Çыхăнуллă улшăнакансен ячĕсем пĕр пекки чухне ДТ сылтăм енĕн функцийĕсене палăртма пулмасть.

ode-system-rhs-function-error = ДТ сылтăм енĕн функцине палăртма пулмасть. mathjs функцине тунă чухне йăнăш.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } тӳрĕ йĕр хушшинчи кĕтесе палăртма пулмасть

angle-invalid-through-point = `<angle>` элементăн through хакĕнче тĕрĕс мар пăнчă

parabola-vertex-too-many-points = Панă тăрăпа 1-рен ытла пăнчă витĕр тухакан парабола пурнăçламан.

parabola-too-many-points = 3-рен ытла пăнчă витĕр тухакан парабола пурнăçламан.

intersection-too-many-items = Иккĕрен ытла объект хĕресленнине пурнăçламан

## Other math components

ionic-compound-not-two-ions = Икĕ иона пăхмасăр ион пĕрлешĕвĕсене пурнăçламан.

ionic-compound-needs-cation-and-anion = Ион пĕрлешĕвĕсене пĕр катионпа пĕр анион валли кăна пурнăçланă.

solve-equations-cannot-evaluate = Танлăха татса пама пулмасть, мĕншĕн тесен ăна шутлама пулмарĕ: { $equation }

math-operators-operand-number-required = Математика операндне уйăрса илме operandNumber памалла.

eigen-decomposition-failed = Матрицăн хăй хакĕсене шутлама пулмарĕ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр тĕслĕхре тĕл пулмасть, çавăнпа вăл яланах пушша килĕшет.
       *[other] `<matchesPattern>`: { $parameters } параметрсем тĕслĕхре тĕл пулмаççĕ, çавăнпа вĕсем яланах пушша килĕшеççĕ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" хакне ăнланма пулмасть. Вăл none, medium, dense е пушă вырăнпа уйăрнă икĕ позитивлă хисеп пулмалла, тĕслĕхрен grid="1 0.5". Тор ӳкермест.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure ӳкерекенĕнче xLabelPosition="left" пурнăçламан; сылтăм вырнаçу йĕрки усă курать.

prefigure-y-label-position-unsupported = `<graph>`: prefigure ӳкерекенĕнче yLabelPosition="bottom" пурнăçламан; çӳлти вырнаçу йĕрки усă курать.

prefigure-invalid-axis-bounds = `<graph>`: prefigure куçарăвĕ валли тĕнĕл чикĕсем тĕрĕс мар; тĕп bbox (-10,-10,10,10) усă курать.

prefigure-invalid-width = `<graph>`: prefigure куçарăвĕ валли сарлакăш тĕрĕс мар; диаграммăн тĕп сарлакăшĕ 425 усă курать.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure куçарăвĕ валли aspectRatio тĕрĕс мар; тĕп енсен танлăхĕ 1 усă курать.

prefigure-grid-spacing-too-fine = `<graph>`: тор утăмĕ тĕнĕл чикĕсем валли ытла вĕтĕ; prefigure ӳкерекенĕнче тора кăлараççĕ.

prefigure-annotations-not-rendered = `<graph>`: PreFigure ӳкерекенĕпе усă курман чухне асăрхаттарусем ӳкермеççĕ.

multiple-annotations-children = `<graph>` ăшĕнче темиçе `<annotations>` ачи тупăнчĕ; юлашкинчен пуçне ыттисене шута илмеççĕ.

## Referring to other components

copy-unrecognized-component-type = Палламан компонент тĕсне сарма е куçарма пулмасть: { $type }.

copy-prop-not-found = { $component } тĕслĕ компонентра { $property } уйрăмлăхĕ тупăнмарĕ

collect-no-source = collect валли çăлкуç тупăнмарĕ.

collect-invalid-component-type = `<{ $component }>` тĕслĕ компонентсене пуçтарма пулмасть, мĕншĕн тесен ку тĕрĕс мар компонент тĕсĕ.

reference-index-unavailable = `{ $reference }` индекс çине каçă тума пулмасть

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентра { $action } чĕнме пулмасть

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Даннăйсен формийĕ тĕрĕс мар. Йĕркесен вăрăмăшĕсем тĕрлĕ. Тупăнчĕ componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Даннăйсенче юпа ячĕсем пĕр пекех. Тупăнчĕ componentIdx :{ $componentIdx }

data-frame-missing-column-name = Даннăйсенче юпа ячĕ çитмест. Тупăнчĕ componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ку хуравăн award хакĕ answer тегăн хăйĕн янă хуравĕ çине таянать, ку кĕтмен ĕç-пуçа илсе пырать.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` пур контейнер ăшĕнчи `<answer>` çине `maxNumAttempts` лартни витĕм кӳмест, мĕншĕн тесен хăтланусен йышне контейнер палăртать. `maxNumAttempts` хакне контейнер çине лартăр.

nested-section-wide-check-work-max-num-attempts = Тепĕр `sectionWideCheckWork` контейнерĕ ăшĕнчи `sectionWideCheckWork` контейнерĕ çине `maxNumAttempts` лартни витĕм кӳмест, мĕншĕн тесен хăтланусен йышне тулашри контейнер палăртать. `maxNumAttempts` хакне тулашри контейнер çине лартăр.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality лартмасан { $attributes } атрибут витĕм кӳмĕ.
       *[other] symbolicEquality лартмасан { $attributes } атрибутсем витĕм кӳмĕç.
    }

answer-invalid-type = answer валли тĕрĕс мар тĕс: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентăн ячĕ çуккипе ăна модуль атрибучĕ пек усă курма пулмасть

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонента модуль атрибучĕ пек усă курма пулмасть, мĕншĕн тесен `<module>` компонент тĕсĕнче «{ $name }» атрибут ĕнтĕ палăртнă.

conditional-content-condition-ignored = case е else ачисем пур `<conditionalContent>` компонентра `condition` атрибут шута илмест.

slider-markers-type-mismatch = Маркерсен тĕсĕ шуçтармăш тĕсĕпе килĕшмест.

pretzel-problem-needs-statement-and-answer = Тĕрĕс мар pretzel: кашни `<problem>` пĕр `<statement>` тата пĕр `<answer>` тытмалла.

pretzel-circuit-first-problem-distractor = Тĕрĕс мар pretzel: mode="circuit" режимĕнче пĕрремĕш `<problem>` тимлĕхе аяккалла пăракан пулма пултараймасть.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибут валли тĕрĕс мар хак { $values }; шута илмест.
       *[other] `{ $attribute }` атрибут валли тĕрĕс мар хаксем { $values }; шута илмеççĕ.
    }

attribute-must-be-references = `{ $attribute }` атрибут валли тĕрĕс мар хак `{ $value }`. Атрибут `$` палăртупа пуçланакан каçăсенчен тăмалла.

math-input-invalid-function-names = <mathInput>: { $attribute } ăшĕнчи тĕрĕс мар функци ячĕсене шута илмерĕ: { $names }. Кашни ятăн курăнакан пайĕ чи сахалран 2 палăрту пулмалла (сас паллисем е тире); ун хыççăн кирлĕ мар `|<mathspeak альтернатива>` хушăмĕ пыма пултарать.

## Building components from the source

component-type-invalid = Тĕрĕс мар компонент тĕсĕ: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибута тепĕр хут пама пулмасть.

attribute-invalid-for-component = `<{ $componentType }>` тĕслĕ компонент валли тĕрĕс мар атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль палăртăвĕнче { $context ->
        [text-on-background] текст тĕсĕпе фон тĕсĕ
        [high-contrast] пысăк контрастлă тĕспе ӳкерӳ лаптăкĕ
        [line] йĕр тĕсĕпе ӳкерӳ лаптăкĕ
        [marker] маркер тĕсĕпе ӳкерӳ лаптăкĕ
       *[text-on-canvas] текст тĕсĕпе ӳкерӳ лаптăкĕ
    } хушшинчи контраст çителĕксĕр{ $mode ->
        [dark] { " (тĕттĕм тĕс)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; чи сахалран { $threshold }:1 кирлĕ).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль палăртăвĕнче панă тĕссем çутă тĕс валли çителĕклĕ контраст парсан та, вĕсенчен тухнă тĕттĕм тĕс тĕсĕсем текстпа фон хушшинче çителĕклĕ контраст памаççĕ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; чи сахалран { $threshold }:1 кирлĕ). { $suggestion ->
        [available] Тĕттĕм тĕсре çителĕклĕ контраст тăвас тесен е çутă тĕсри контраста ӳстерĕр (тĕслĕхрен { $lightAttribute }="{ $lightColor }"), е тĕттĕм тĕс тĕсне улăштарăр (тĕслĕхрен { $darkAttribute }="{ $darkColor }").
       *[none] Тĕттĕм тĕсре çителĕклĕ контраст тăвас тесен çутă тĕсри контраста ӳстерĕр е тухнă тĕссене textColorDarkMode тата/е backgroundColorDarkMode урлă улăштарăр.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль палăртăвĕнче панă текст тĕсĕ çутă тĕс валли çителĕклĕ контраст парсан та, унран тухнă тĕттĕм тĕс текст тĕсĕ ӳкерӳ лаптăкĕпе çителĕклĕ контраст памасть ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; чи сахалран { $threshold }:1 кирлĕ). { $suggestion ->
        [available] Тĕттĕм тĕсре çителĕклĕ контраст тăвас тесен е çутă тĕсри контраста ӳстерĕр (тĕслĕхрен textColor="{ $lightColor }"), е тĕттĕм тĕс тĕсне улăштарăр (тĕслĕхрен textColorDarkMode="{ $darkColor }").
       *[none] Тĕттĕм тĕсре çителĕклĕ контраст тăвас тесен çутă тĕсри контраста ӳстерĕр е тухнă тĕсе textColorDarkMode урлă улăштарăр.
    }

section-multiple-style-palettes = Пай пĕр <stylePalette> кăна суйлама пултарать; юлашкипе усă курать.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } валли пĕр пек мар вариантсене палăртма пулмасть, мĕншĕн тесен numToSelect негативлă мар тулли хисеп мар.

variant-num-to-select-not-constant-number = { $component } валли пĕр пек мар вариантсене палăртма пулмасть, мĕншĕн тесен numToSelect тăтăш хисеп мар.

variant-with-replacement-not-constant-boolean = { $component } валли пĕр пек мар вариантсене палăртма пулмасть, мĕншĕн тесен withReplacement тăтăш логика хакĕ мар.

variant-select-weight-disables-unique = хăш те пулин суйлавра selectWeight е selectForVariants панă пулсан, select валли пĕр пек мар вариантсем сӳнеççĕ

variant-coprime-undetermined = { $component } валли пĕр пек мар вариантсене палăртма пулмасть, мĕншĕн тесен coprime яланах суя-и, çавна тупма пулмасть.

variant-attribute-not-constant = { $component } валли пĕр пек мар вариантсене палăртма пулмасть, мĕншĕн тесен { $attribute } тăтăш мар.

variant-attribute-not-number = { $component } валли пĕр пек мар вариантсене палăртма пулмасть, мĕншĕн тесен { $attribute } хисеп мар.

variant-attribute-wrong-type-for-sequence =
    { $type } тĕслĕ { $component } валли пĕр пек мар вариантсене палăртма пулмасть, мĕншĕн тесен { $attribute } { $expected ->
        [letters-combination] сас паллисен пĕрлешĕвĕ
        [math-expression] юрăхлă математика палăртăвĕ
        [integer] тулли хисеп
       *[number] хисеп
    } мар.

variant-length-not-integer = { $component } валли пĕр пек мар вариантсене палăртма пулмасть, мĕншĕн тесен length тулли хисеп мар.

variant-sort-not-implemented = sort пур { $component } валли пĕр пек мар вариантсене пурнăçламан

variant-exclude-combinations-not-implemented = excludeCombinations пур { $component } валли пĕр пек мар вариантсене пурнăçламан

variant-math-exclude-not-implemented = exclude пур math тĕслĕ { $component } валли пĕр пек мар вариантсене пурнăçламан

variant-non-constant-exclude-not-implemented = тăтăш мар exclude пур { $component } валли пĕр пек мар вариантсене пурнăçламан

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графикăн prefigure ӳкерекенĕнче пурнăçламан; тăхăмне сиктерсе хăварнă.

prefigure-descendant-invalid-geometry = { $subject }: вĕçсĕр е тулли мар геометри; тăхăмне сиктерсе хăварнă.

prefigure-curve-label-omitted = { $subject }: куçарнă кукăр элеменчĕсенче паллăсем пурнăçламан; паллăна сиктерсе хăварнă.

prefigure-curve-unsupported-definition-type = { $subject }: пурнăçламан кукăр функци палăртăвĕн тĕсĕ «{ $definitionType }»; тăхăмне сиктерсе хăварнă.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементри flipFunctions атрибут пурнăçламан; тăхăмне сиктерсе хăварнă.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формулăпа панă ача функцисене кăна йышăнать; тăхăмне сиктерсе хăварнă.

prefigure-label-position-unsupported =
    { $subject }: пурнăçламан labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] тӳрĕ йĕрсен йышĕн палли валли
       *[point] пăнчă палли валли
    }; PreFigure-ăн тĕп танлаштарăвĕ усă курать.

prefigure-fill-style-unsupported = { $subject }: тултару стилĕ «{ $fillStyle }» PreFigure валли пурнăçламан; тулли тултарăва куçать.

prefigure-line-style-unknown = { $subject }: паллă мар йĕр стилĕ «{ $lineStyle }» PreFigure тухăçĕнчен кăларнă.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер стилĕ «{ $markerStyle }» PreFigure «diamond» стилĕпе танлаштарнă.

prefigure-marker-style-unsupported = { $subject }: маркер стилĕ «{ $markerStyle }» PreFigure валли пурнăçламан; тĕп стиль усă курать.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: тĕрĕс мар `ref`; тĕллеве çыхăнтарма пулмасть. Асăрхаттарăва кăларнă.

annotation-ref-multiple-targets = `<annotation>`: `ref` темиçе тĕллевпе çыхăнчĕ; пĕрремĕшĕпе усă курать.

annotation-ref-outside-graph = `<annotation>`: тĕрĕс мар `ref`; тĕллев ăна тытакан графикран тулашра. Асăрхаттарăва кăларнă.

annotation-ref-unsupported-target = `<annotation>`: тĕрĕс мар `ref`; тĕллев prefigure куçарăвĕнче пурнăçланă график объект мар. Асăрхаттарăва кăларнă.

annotation-text-missing = `<annotation>`: `text` çук е пушă; пушă текст кăларать.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Çавра çыхăну тупăнчĕ.
       *[other] `<{ $componentType }>` компонента тытакан çавра çыхăну тупăнчĕ.
    }

reference-no-referent = Каçă валли объект тупăнмарĕ: `{ $reference }`

reference-multiple-referents = Каçă валли темиçе объект тупăнчĕ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементăн { $attribute } атрибучĕн форматне йышăнмасть.

children-invalid = `<{ $componentType }>` валли тĕрĕс мар ачасем: тĕрĕс мар ачасем тупăнчĕç: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибут валли тĕрĕс мар хак `{ $value }`; `{ $default }` хакĕ усă курать

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версийĕ тупăнмарĕ.
       *[other] DoenetML { $version } версийĕ тупăнмарĕ. { $fallback } версийĕ усă курать
    }

## Reading the DoenetML

parse-invalid-doenetml = Тĕрĕс мар DoenetML: { $content }

parse-tag-missing-close-tag = Тĕрĕс мар DoenetML: `{ $tag }` тегăн хупакан тегĕ çук. Хăйне хăй хупакан тег е `</{ $tagName }>` тег кĕтнĕччĕ.

parse-tag-error = Тĕрĕс мар DoenetML: `<{ $tagName }>` тегра йăнăш

parse-attribute-missing-value = Тĕрĕс мар DoenetML: `{ $attribute }` атрибутра хак çитмен пек.

parse-attribute-invalid = Тĕрĕс мар DoenetML: тĕрĕс мар атрибут `{ $attribute }`

parse-attribute-value-invalid = Тĕрĕс мар DoenetML: атрибутăн тĕрĕс мар хакĕ `{ $value }`

parse-attribute-value-quote-mismatch = Тĕрĕс мар DoenetML: атрибутăн тĕрĕс мар хакĕ `{ $value }`. Чĕрнесем килĕшмеççĕ. `{ $quote }` çитмен пек

parse-open-tag-name-missing = Тĕрĕс мар DoenetML: ятсăр тег тупăнчĕ, тĕслĕхрен `<`

parse-tag-not-closed = Тĕрĕс мар DoenetML: `{ $tag }` тега хупман (`>` çитмен пек).

parse-self-closing-tag-name-missing = Тĕрĕс мар DoenetML: ятсăр тег тупăнчĕ `<{ $content }>`

parse-self-closing-tag-not-closed = Тĕрĕс мар DoenetML: `{ $tag }` тега хупман (`/>` çитмен пек).

parse-tag-invalid-attributes = Тĕрĕс мар DoenetML: `{ $tag }` тег юрăхлă мар. Унăн атрибучĕсем тĕрĕс мар пулма пултараççĕ.

parse-close-tag-name-missing = Тĕрĕс мар DoenetML: ятсăр хупакан тег тупăнчĕ, тĕслĕхрен `</`

parse-attribute-value-unquoted = Атрибут хакĕсем чĕрне ăшĕнче пулмалла: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Тĕрĕс мар DoenetML: `{ $tag }` хупакан тег тупăнчĕ, анчах ăна тивĕçекен уçакан тег çук

parse-close-tag-mismatched = Тĕрĕс мар DoenetML: килĕшмен хупакан тег. `</{ $expected }>` кĕтнĕччĕ. `{ $found }` тупăнчĕ

parser-node-unconvertible = { $node } тĕввине Dast тĕввине куçарма пулмарĕ.

## Names

name-attribute-invalid =
    Тĕрĕс мар атрибут name='{ $name }'. { $reason ->
        [characters] Ятсенче сас паллисем, хисепсем, аялти тире е тире кăна пулма пултараççĕ.
       *[start] Ятсем сас палли-ран пуçланмалла.
    }

component-name-invalid-start = Тĕрĕс мар компонент ячĕ «{ $name }». Ятсем сас палли-ран пуçланмалла.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched тĕслĕ answer-ăн video атрибучĕ пулмалла

answer-video-watched-video-not-reference = videoWatched тĕслĕ answer-ăн video атрибучĕ каçă пулмалла

answer-name-not-single-text = answer-ăн name атрибучĕн шăп пĕр текст ачи пулмалла

## Referencing another document

external-doenetml-recursion-limit = Рекурси шайĕсем ытла нумай пулнипе тулашри DoenetML-а илме пулмарĕ. Çавра каçă çук-и?

external-doenetml-unavailable = { $attribute }="{ $uri }" адресран DoenetML илме пулмарĕ

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адресран тĕрĕс мар DoenetML илнĕ: вăл «{ $componentType }» компонент тĕсĕпе килĕшмерĕ

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут кивелнĕ; ун вырăнне `{ $to }` усă курăр.
       *[other] [deprecation] `<{ $component }>` элементри `{ $from }` атрибут кивелнĕ; ун вырăнне `{ $to }` усă курăр.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут кивелнĕ тата шута илмест, мĕншĕн тесен `{ $to }` та панă.
       *[other] [deprecation] `<{ $component }>` элементри `{ $from }` атрибут кивелнĕ тата шута илмест, мĕншĕн тесен `{ $to }` та панă.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементри `{ $attribute }` атрибут кивелнĕ тата шута илмест.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элементри `{ $attribute }` атрибут кивелнĕ; ун вырăнне `<{ $child }>` ачипе усă курăр.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элементри `{ $attribute }` атрибутăн `{ $value }` хакĕ кивелнĕ; ун вырăнне `{ $to }` усă курăр.


## Language coverage

pluralize-english-only = `<pluralize>` нумайлă хисепе акăлчанла кăна тăвать, çавăнпа { $locale } чĕлхипе çырнă документра унăн тексчĕ улшăнмасăр юлать. Нумайлă формине хăвăр çырăр е ăна `pluralForm` атрибутпа парăр.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент палланă Doenet элеменчĕ мар.

schema-element-not-allowed-at-root = `<{ $tag }>` элемента документăн тымарĕнче ирĕк памаççĕ.

schema-element-not-allowed-inside = `<{ $tag }>` элемента `<{ $parent }>` ăшĕнче ирĕк памаççĕ.

schema-attribute-unrecognized = `<{ $tag }>` элементра `{ $attribute }` ятлă атрибут çук.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементăн `{ $attribute }` атрибучĕ кашни элеменчĕ çаксенчен пĕри пулакан список пулмалла: { $allowed }
       *[other] `<{ $tag }>` элементăн `{ $attribute }` атрибучĕ çаксенчен пĕри пулмалла: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select валли тĕрĕс мар вариант ячĕ. { $variantName } вариант ячĕ { $numOptions } суйлавра тĕл пулать, суйламалли йышĕ вара { $numToSelect }.

select-variant-name-without-options = select валли вариантсем панă, анчах пулма пултаракан вариант ячĕ валли пĕр суйлав та çук: { $variantName }.

select-variant-name-not-possible = select валли панă { $variantName } вариант ячĕ пулма пултаракан вариант ячĕ мар.

select-too-few-options = Пурĕ { $numOptions } шутĕнчен { $numToSelect } компонент суйлама пулмасть.

select-from-sequence-too-few-values = Вăрăмăшĕ { $length } йĕркелĕхрен { $numToSelect } хак суйлама пулмасть.

select-from-sequence-indices-count-mismatch = select валли панă индекссен йышĕ суйламалли йышпа килĕшмелле

select-from-sequence-indices-not-integers = select валли панă пур индекс та тулли хисеп пулмалла

select-from-sequence-index-excluded = selectfromsequence валли панă индекса кăларнăччĕ

select-from-sequence-indices-excluded-combination = selectfromsequence валли панă индекссем кăларнă пĕрлешӳ пулнă

select-from-sequence-coprime-not-positive-integers = Позитивлă тулли хисепсем суйламаннипе хăйсем хушшинче ансат пĕрлешӳсене суйлама пулмасть.

select-from-sequence-coprime-common-factor = Хăйсем хушшинче ансат хисепсене суйлама пулмасть. Пулма пултаракан пур хакăн та пĕрлехи пайлаканĕ пур. (Панă "from" е "to" хакĕсем "step"-па хăйсем хушшинче ансат пулмалла.)

select-from-sequence-coprime-single-number = 1 мар пĕртен-пĕр хисепрен хăйсем хушшинче ансат пĕрлешӳсене суйлама пулмасть.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ăшĕнче пĕрлешӳсен 70%-ран ытлашшине кăларнă

select-from-sequence-coprime-none-found = Хăйсем хушшинче ансат хисепсене суйлама пулмарĕ. Пулма пултаракан пур хакăн та пĕрлехи пайлаканĕ пур.

select-from-sequence-too-few-unique-values = Вăрăмăшĕ { $numPossibleValues } йĕркелĕхрен { $numToSelect } тĕрлĕ хак суйлама пулмасть

select-prime-numbers-too-few-values = Вăрăмăшĕ { $numValues } ансат хисепсен спискинчен { $numToSelect } хак суйлама пулмасть

select-prime-numbers-values-count-mismatch = select валли панă хаксен йышĕ суйламалли йышпа килĕшмелле

select-prime-numbers-values-not-prime = select prime number валли панă пур хак та ансат хисепсен спискинче пулмалла

select-prime-numbers-values-excluded-combination = selectPrimeNumbers валли панă хаксем кăларнă пĕрлешӳ пулнă

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ăшĕнче пĕрлешӳсен 70%-ран ытлашшине кăларнă

select-random-combination-fluke = Питĕ пулма пултарайман ăнсăртлăх пирки ăнсăрт хаксен пĕрлешĕвне суйлама пулмарĕ

select-random-value-fluke = Питĕ пулма пултарайман ăнсăртлăх пирки ăнсăрт хака суйлама пулмарĕ
