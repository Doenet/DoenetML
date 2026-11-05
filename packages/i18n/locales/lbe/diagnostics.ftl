# Lak diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Lak (лакку маз), Northeast Caucasian, written in Cyrillic with the palochka
# — the orthography of Dagestan's schools and of the Lak-language press, and
# what `lbe-Cyrl-RU` names. Ӏ is a letter, not a Latin I and not a digit 1.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language rather than prose and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Lak's four-class agreement does not reach this file: nothing here describes a
# noun this catalog itself supplies, so no message forks on a class. Lak's
# class system, and the reason `content.ftl` does not fork on it either, are
# written out in that file's header.
#
# Lak resolves two plural categories, `one` and `other`, and a noun after a
# numeral stays singular, so a counted message's two branches differ only in
# the number they print.
#
# The technical nouns are the Russian ones, which is what written Lak uses for
# mathematics and computing: «компонент», «атрибут», «функция», «индекс»,
# «строка», «последовательность». The case endings this catalog puts on them
# are the part of this file a speaker should check first.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] кӀива яржалул нукьта кӀицӀ бувну бухьурча, { $attributes } хӀисав къадуллай бур
       *[other] кӀива яржалул нукьта кӀицӀ бувну бухьурча, { $attributes } хӀисав къадуллай бур
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] яржалул нукьта ва дянивсса нукьта кӀицӀ бувну бухьурча, { $attributes } хӀисав къадуллай бур
       *[other] яржалул нукьта ва дянивсса нукьта кӀицӀ бувну бухьурча, { $attributes } хӀисав къадуллай бур
    }

line-segment-midpoint-offset-without-midpoint = дянивсса нукьта дакъасса midpointOffset хӀисаврайн ласлай бакъар

## `<line>`

line-points-undetermined-dimensions = Измерениярду кӀул къадурсса нукьтардайх бавчусса линия.

line-points-too-few-dimensions = Линия яла чӀивимур кӀива измерения дусса нукьтардайх бачин аьркинссар.

line-points-depend-on-variables = Линия переменнардайн лавхьхьусса нукьтардайх бачлай бур: { $variables }.

line-equation-invalid-format = { $variable1 } ва { $variable2 } переменнардаву линиялул уравнениялул формат къатӀайлассар.

## `<ray>`

ray-overprescribed-through = Луч through, endpoint ва direction тӀисса шамагу кӀицӀ бувну бур.  КӀицӀ бувсса through хӀисав къадуллай бур.

ray-dimension-mismatch = Лучраву numDimensions дархӀуну дакъар.

## `<vector>`

vector-overprescribed-head = Вектор head, tail ва displacement тӀисса шамагу кӀицӀ бувну бур.  КӀицӀ бувсса head хӀисав къадуллай бур.

vector-dimension-mismatch = Векторданува numDimensions дархӀуну дакъар.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` тӀисса кӀанттухун кӀункӀу бан къабюхъай, мунихь nearestPoint тӀисса шартӀирал переменная дакъа духьувкун.

constrain-to-without-nearest-point = `<{ $component }>` тӀисса кӀанттуцӀун дахьханнин дишин къабюхъай, мунихь nearestPoint тӀисса шартӀирал переменная дакъа духьувкун.

constrain-to-interior-without-nearest-point = `<{ $component }>` тӀисса кӀанттул бухсса кӀанттуцӀун дахьханнин дишин къабюхъай, мунихь nearestPoint тӀисса шартӀирал переменная дакъа духьувкун.

## `<choiceInput>`

choice-input-label-position-ignored = инлайн бакъасса choiceInput-рай labelPosition хӀисав къадуллай бур

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-рай кӀицӀ бувсса индексру хӀисав къадуллай бур, индексирттал хӀисав лувсса choice элементирттал хӀисаврацӀун къадархӀуну духьувкун.

pretzel-indices-count-mismatch = problem-лий кӀицӀ бувсса индексру хӀисав къадуллай бур, индексирттал хӀисав лувсса problem элементирттал хӀисаврацӀун къадархӀуну духьувкун.

shuffle-indices-count-mismatch = shuffle-рай кӀицӀ бувсса индексру хӀисав къадуллай бур, индексирттал хӀисав компонентирттал хӀисаврацӀун къадархӀуну духьувкун.

indices-ignored-out-of-range = { $component } тӀисса кӀанттай кӀицӀ бувсса индексру хӀисав къадуллай бур, цаппара индексру дазулия бувккуну духьувкун.

pretzel-indices-repeated = pretzel-рай кӀицӀ бувсса индексру хӀисав къадуллай бур, цаппара индексру кӀилцӀа кӀицӀ бувну бухьувкун.

pretzel-circuit-first-index = circuit режимрайсса pretzel-рай кӀицӀ бувсса индексру хӀисав къадуллай бур, цалчинмур индекс 1 бикӀан аьркинну духьувкун.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` лувсса строкардащал зузаваншиврул, type тӀисса атрибут кӀицӀ бан аьркинссар.

invalid-type-defaulting-to-math = { $component } компонентрал { $type } тӀисса тип къатӀайлассар. math, text, number я boolean тӀисса цамур бикӀан аьркинссар. math ласлай бур.

string-not-valid-component-to-arrange = "{ $value }" тӀисса строка { $component } баншиврул лархьхьусса компонент бакъассар. ХӀисав къадуллай бур.

## Types and variables

invalid-type-defaulting-to-number = { $type } тӀисса тип къатӀайлассар, тип number хӀисаврай бишлай бур.

invalid-variable-value = Переменнарал кьимат къатӀайлассар: `{ $value }`

## Variants

variant-index-must-be-number = { $index } тӀисса вариантрал индекс хӀисав бикӀан аьркинссар

variant-index-must-be-integer = { $index } тӀисса вариантрал индекс щалла хӀисав бикӀан аьркинссар

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолютсса ккаккиярттахлу щаллу дурну дакъар. Гьаннурду относительныйну бишлай бур.

side-by-side-absolute-margins = `<{ $component }>` абсолютсса ккаккиярттахлу щаллу дурну дакъар. Яржарду относительныйну бишлай бур.

side-by-side-no-block-child = `<{ $component }>` къатӀайлассар: мунихь яла чӀивимур ца блок элемент бикӀан аьркинссар.

## `<label>`

label-for-ignored-on-graphical = Графикалул `<label>`-рай `for` тӀисса атрибут хӀисав къадуллай бур.

label-for-must-resolve-to-one = `<label>`-рай `for` тӀисса атрибут щалва ца компонентрайн бачин аьркинссар.

label-for-unresolved = `<label>`-рай `for` тӀисса атрибут компонентрайн бачин къавхьунни.

label-for-answer-with-authored-inputs = `<label>`-рай `for` тӀисса атрибут авторнал цала чивчусса инпутру дусса `<answer>`-райн бачлай бур; инпутрайн цийнува ссылка бува.

label-for-answer-without-input = `<label>`-рай `for` тӀисса атрибут цӀа дишинсса инпут дакъасса `<answer>`-райн бачлай бур.

label-for-must-reference-input-or-answer = `<label>`-рай `for` тӀисса атрибут инпутрайн я жавабрайн (answer) бачин аьркинссар.

## Accessibility

accessibility-short-description-or-decorative = Бигьану ишла баншиврул, `<{ $component }>`-хь я кутӀасса баян бикӀан аьркинссар, я ва чӀюлушинна дур тӀий кӀицӀ бан аьркинссар.

accessibility-video-short-description = Бигьану ишла баншиврул, `<video>`-хь кутӀасса баян бикӀан аьркинссар.

accessibility-input-short-description-or-label = Бигьану ишла баншиврул, `<{ $component }>`-хь кутӀасса баян я цӀа бикӀан аьркинссар.

accessibility-answer-input-short-description-or-label = Бигьану ишла баншиврул, инпут буллалисса `<answer>`-хь кутӀасса баян я цӀа бикӀан аьркинссар.

accessibility-short-description-contains-math = КутӀасса баянну дянив `<{ $component }>` кунмасса математикалул компонентру бикӀан къааьркинссар. Математика мукъурттий чичара.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } разделданул бакӀлавсуйсса текстрахлу дурксса контраст дакъар (лухӀимур режим) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; яла чӀивимур { $threshold }:1 аьркинссар).
       *[other] { $colorName } разделданул бакӀлавсуйсса текстрахлу дурксса контраст дакъар ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; яла чӀивимур { $threshold }:1 аьркинссар).
    }

## `<circle>`

circle-through-points-non-numerical = Нукьтардахь хӀисаврал кьиматру дакъа духьурча, { $count } нукьтардайх бавчусса `<circle>` щаллу дурну дакъар.

circle-too-many-through-points = 3 нукьталияр чӀявусса нукьтардайх бавчусса круг хӀисав бан къабюхъай.

circle-overprescribed-radius-center-points = Радиус, центр ва нукьтарду цачӀу кӀицӀ бувсса круг хӀисав бан къабюхъай.

circle-center-with-multiple-points = КӀицӀ бувсса центр дусса круг ца нукьталияр чӀявусса нукьтардайх бачин къабюхъай.

circle-radius-too-small = Круг хӀисав бан къабюхъай: кӀива нукьталул дянивсса манзил { $distance } бухьувкун, кӀицӀ бувсса радиус { $radius } лап чӀивиссар.

circle-radius-with-many-points = КӀицӀ бувсса радиус дусса круг кӀива нукьталияр чӀявусса нукьтардайх бачин къабюхъай.

circle-invalid-center-or-through-points = Круграл центр я нукьтарду къатӀайлассар.

circle-radius-center-with-multiple-points = КӀицӀ бувсса центр дусса круграл радиус ца нукьталияр чӀявусса нукьтардайх хӀисав бан къабюхъай.

circle-change-radius-non-numerical = ХӀисаврал кьиматру дакъасса нукьтардайх бавчусса круграл радиус даххана бан къабюхъай

circle-radius-with-points-non-numerical = ХӀисаврал кьиматру дакъа духьурча, кӀицӀ бувсса радиус дусса круг ца нукьталияр чӀявусса нукьтардайх бачин къабюхъай.

circle-change-center-non-numerical = ХӀисаврал кьиматру дакъасса нукьтардайх бавчусса круграл центр даххана баву щаллу дурну дакъар.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функциялул областрал измерениярду дурксса дакъар. Областрахь { $intervals } интервал бур, амма функциялухь { $inputs ->
            [one] { $inputs } инпут
           *[other] { $inputs } инпут
        } бур.
       *[other] Функциялул областрал измерениярду дурксса дакъар. Областрахь { $intervals } интервал бур, амма функциялухь { $inputs ->
            [one] { $inputs } инпут
           *[other] { $inputs } инпут
        } бур.
    }

function-domain-invalid-format = Функциялул областрал формат къатӀайлассар.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функциялул хӀисаврал кьимат дакъасса максимум хӀисав къадуллай бур.
        [minimum] Функциялул хӀисаврал кьимат дакъасса минимум хӀисав къадуллай бур.
        [extremum] Функциялул хӀисаврал кьимат дакъасса экстремум хӀисав къадуллай бур.
        [point] Функциялул хӀисаврал кьимат дакъасса нукьта хӀисав къадуллай бур.
        [slope] Функциялул хӀисаврал кьимат дакъасса наклон хӀисав къадуллай бур.
       *[other] Функциялул хӀисаврал кьимат дакъасса { $type } хӀисав къадуллай бур.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функциялул бачӀисса максимум хӀисав къадуллай бур.
        [minimum] Функциялул бачӀисса минимум хӀисав къадуллай бур.
        [extremum] Функциялул бачӀисса экстремум хӀисав къадуллай бур.
        [point] Функциялул бачӀисса нукьта хӀисав къадуллай бур.
       *[other] Функциялул бачӀисса { $type } хӀисав къадуллай бур.
    }

function-points-too-close = Функциялуву цанналагу гъан-маччасса кӀива нукьта бур. Функция кӀул бан къабюхъай.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функциялул итерациярду функциялул инпутирттал хӀисав аутпутирттал хӀисавравун дархӀуну духьурчакьай хьун бюхъайссар. Ва функциялухь { $inputs } инпут ва { $outputs ->
            [one] { $outputs } аутпут
           *[other] { $outputs } аутпут
        } бур.
       *[other] Функциялул итерациярду функциялул инпутирттал хӀисав аутпутирттал хӀисавравун дархӀуну духьурчакьай хьун бюхъайссар. Ва функциялухь { $inputs } инпут ва { $outputs ->
            [one] { $outputs } аутпут
           *[other] { $outputs } аутпут
        } бур.
    }

## `<sequence>`

sequence-invalid-length = Последовательностьрал лахъишиву къатӀайлассар.  Минус бакъасса щалла хӀисав бикӀан аьркинссар.

sequence-invalid-step = Последовательностьрал шаттира къатӀайлассар.  { $type } тӀисса типрал последовательностьрахлу хӀисав бикӀан аьркинссар.

sequence-invalid-endpoint-number = ХӀисаврал последовательностьрал "{ $attribute }" къатӀайлассар.  ХӀисав бикӀан аьркинссар.

sequence-invalid-endpoint-letters = ХӀарпирттал последовательностьрал "{ $attribute }" къатӀайлассар.  ХӀарпирттал цачӀуншиву бикӀан аьркинссар.

sequence-invalid-endpoint = Последовательностьрал "{ $attribute }" къатӀайлассар.

select-from-sequence-coprime-not-numbers = хӀисаврду язи къадугьлай духьувкун, coprime хӀисав къадуллай бур

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations кӀицӀ бувну духьувкун, coprime хӀисав къадуллай бур

## Resolving a `target`

target-not-found = `<{ $source }>`-рал target къатӀайлассар: кӀанттул лякъин къавхьунни.

target-state-variable-not-found = `<{ $source }>`-рал target къатӀайлассар: `<{ $component }>`-рай "{ $property }" тӀисса шартӀирал переменная лякъин къавхьунни.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-рал переменнарду цала цурда дусса переменнаярая личӀисса бикӀан аьркинссар.

ode-system-duplicate-variable-names = КӀилцӀа кӀицӀ бувсса переменнардал цӀардащал ОДУ-рал ялувсса функциярду кӀул бан къабюхъай.

ode-system-rhs-function-error = ОДУ-рал ялувсса функция кӀул бан къабюхъай.  Mathjs функция буллалийни гъалатӀ хьунни.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } линиялул дянивсса кьутӀи кӀул бан къабюхъай

angle-invalid-through-point = `<angle>`-рал through-рай нукьта къатӀайлассар

parabola-vertex-too-many-points = Вершина дусса парабола ца нукьталияр чӀявусса нукьтардайх бачаву щаллу дурну дакъар.

parabola-too-many-points = 3 нукьталияр чӀявусса нукьтардайх бавчусса парабола щаллу дурну дакъар.

intersection-too-many-items = КӀива затраяр чӀявусса затирттал дянивсса кьутӀаву щаллу дурну дакъар

## Other math components

ionic-compound-not-two-ions = КӀива ионнаяр личӀисса затирттахлу ионнал цачӀуншиву щаллу дурну дакъар.

ionic-compound-needs-cation-and-anion = Ионнал цачӀуншиву щалва ца катионналлий ва ца анионналлий щаллу дурну дур.

solve-equations-cannot-evaluate = Уравнение кӀул бан къавхьуну духьувкун, ми щаллу бан къабюхъай: { $equation }

math-operators-operand-number-required = Математикалул операнд ласлайни operandNumber кӀицӀ бан аьркинссар.

eigen-decomposition-failed = Матрицалул цала кьиматру хӀисав бан къавхьунни

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } тӀисса параметр паттернраву дакъар, мунихлуну ва гьарзаманагу бачӀисса кӀанттуцӀун бавхӀуну бикӀанссар.
       *[other] `<matchesPattern>`: { $parameters } тӀисса параметрду паттернраву дакъар, мунихлуну ми гьарзаманагу бачӀисса кӀанттуцӀун бавхӀуну бикӀанссар.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" кӀул бан къабюхъай. Ва none, medium, dense я кӀива минус бакъасса хӀисав кӀива-кӀивалухун бивхьуну бикӀан аьркинссар, масала grid="1 0.5". Тор битлай бакъар.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>`-хьхьун { $expected ->
        [one] ца аутпут, гьарца нукьталий наклон y', масала `y - x`, дусса функция
       *[other] кӀива аутпут, гьарца нукьталий вектор, масала `(y, -x)`, дусса функция
    } аьркинссар, амма мунахьхьун дуллусса функциялухь { $found ->
        [one] { $found } аутпут
       *[other] { $found } аутпут
    } бур. { $alternative ->
        [none] ЦучӀав битлай бакъар.
       *[other] Му функциялухлу `<{ $alternative }>` бикӀан аьркинссар. ЦучӀав битлай бакъар.
    }

field-function-attribute-ignored-with-child = `function` тӀисса атрибут хӀисав къадуллай бур, функция компонентрал дянивгу дуллуну духьувкун; дянивмур ишла дуллай бур. Функция кӀивагу кьяйдалий дакъа, щалва ца кьяйдалий дула.

field-variables-ignored =
    `<{ $component }>`: `variables` тӀисса атрибутрал компонентрал дянив цийнува чивчусса выражениялул переменнардал цӀарду кӀицӀ буллай бур. { $reason ->
        [function-child] Шиккусса функция `<function>` лувсса элементну дуллуну дур, мунил цалва переменнардал цӀарду кӀицӀ буллай дур, мунихлуну `variables` хӀисав къадуллай бур.
       *[no-expression] Шикку мукунсса выражение дакъар, мунихлуну `variables` хӀисав къадуллай бур.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure рендерданий xLabelPosition="left" щаллу дурну дакъар; right кьяйда ишла дуллай бур.

prefigure-y-label-position-unsupported = `<graph>`: prefigure рендерданий yLabelPosition="bottom" щаллу дурну дакъар; top кьяйда ишла дуллай бур.

prefigure-invalid-axis-bounds = `<graph>`: prefigure-райнсса дахханашиннаву осирттал дазурду къатӀайлассар; дефолтсса bbox (-10,-10,10,10) ишла дуллай бур.

prefigure-invalid-width = `<graph>`: prefigure-райнсса дахханашиннаву гьанну къатӀайлассар; дефолтсса диаграммалул гьанну 425 ишла дуллай бур.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure-райнсса дахханашиннаву aspectRatio къатӀайлассар; дефолтсса 1 ишла дуллай бур.

prefigure-grid-spacing-too-fine = `<graph>`: осирттал дазурдахлу торданул дянивсса манзил лап чӀивиссар; prefigure рендерданий тор битлай бакъар.

prefigure-annotations-not-rendered = `<graph>`: PreFigure рендер ишла къадуллалийни аннотациярду ккаккан къадуллантӀиссар.

multiple-annotations-children = `<graph>`-раву чӀярусса `<annotations>` элементру лявкъунни; яла махъмур бакъа гьарцагу хӀисав къадуллай бур.

## Referring to other components

copy-unrecognized-component-type = КӀул къавхьусса компонентрал тип ласун я даххана дан къабюхъай: { $type }.

copy-prop-not-found = { $component } тӀисса типрал компонентрай { $property } тӀисса проп лякъин къавхьунни

collect-no-source = Collect баншиврул кӀану лявкъуну дакъар.

collect-invalid-component-type = `<{ $component }>` тӀисса типрал компонентру дуртӀун къабюхъай, ва тип къатӀайлану духьувкун.

reference-index-unavailable = `{ $reference }` тӀисса индексрайн ссылка бан къабюхъай

## `<callAction>`

component-action-unavailable = `{ $reference }` тӀисса компонентрай { $action } щаллу бан къабюхъай

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Даннайл куц къатӀайлассар.  Строкардал лахъишивурду цанналацӀун цанна къадархӀуссар. Лявкъунни componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Даннайл столбецирттал цӀарду кӀилцӀа кӀицӀ бувну бур.  Лявкъунни componentIdx :{ $componentIdx }

data-frame-missing-column-name = Даннайх столбецрал цӀа бакъар.  Лявкъунни componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ва жавабрал award му жавабрал цалва гьан дурсса жавабрайн лавхьхьуну бур, мунихлуну хӀасил дурчӀин къабюхъайсса бикӀантӀиссар.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` дусса контейнердануву бусса `<answer>`-рай `maxNumAttempts` бишаву хӀисаврайн ласлай бакъар, хӀарачатирттал хӀисав контейнерданул ялув бухьувкун. `maxNumAttempts` контейнерданий бишира.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` дусса цамур контейнердануву бусса, `sectionWideCheckWork` дусса контейнерданий `maxNumAttempts` бишаву хӀисаврайн ласлай бакъар, хӀарачатирттал хӀисав кьатӀувсса контейнерданул ялув бухьувкун. `maxNumAttempts` кьатӀувсса контейнерданий бишира.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality бивхьуну бакъа духьурча, { $attributes } тӀисса атрибут хӀисаврайн къаласлантӀиссар.
       *[other] symbolicEquality бивхьуну бакъа духьурча, { $attributes } тӀисса атрибутру хӀисаврайн къаласлантӀиссар.
    }

answer-invalid-type = Жавабрал тип къатӀайлассар: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` тӀисса компонентрахь цӀа дакъа духьувкун, ми модульданул атрибутну ишла бан къабюхъай

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` тӀисса компонент модульданул атрибутну ишла бан къабюхъай, `<module>` тӀисса компонентрал типрахь "{ $name }" тӀисса атрибут хьхьичӀавагу бухьувкун.

conditional-content-condition-ignored = case я else лувсса элементру дусса `<conditionalContent>` компонентрай `condition` тӀисса атрибут хӀисав къадуллай бур.

slider-markers-type-mismatch = Маркердал тип слайдердал типрацӀун къадархӀуссар.

pretzel-problem-needs-statement-and-answer = Pretzel къатӀайлассар: гьарца `<problem>`-раву ца `<statement>` ва ца `<answer>` бикӀан аьркинссар.

pretzel-circuit-first-problem-distractor = Pretzel къатӀайлассар: mode="circuit" бухьурча, цалчинмур `<problem>` дистрактор бикӀан къабюхъай.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` тӀисса атрибутрал { $values } тӀисса кьимат къатӀайлассар; хӀисав къадуллай бур.
       *[other] `{ $attribute }` тӀисса атрибутрал { $values } тӀисса кьиматру къатӀайлассар; хӀисав къадуллай бур.
    }

attribute-must-be-references = `{ $attribute }` тӀисса атрибутрал `{ $value }` тӀисса кьимат къатӀайлассар. Атрибут `$`-лия байбишлашисса ссылкардая сакин хьуну бикӀан аьркинссар.

math-input-invalid-function-names = <mathInput>: { $attribute }-раву къатӀайласса функциялул цӀарду хӀисав къадурунни: { $names }. Гьарца цӀалул ккаккан байсса бутӀраву яла чӀивимур 2 символ (хӀарпру я дефисру) бикӀан аьркинссар; мунихун `|<mathspeak alternative>` бишин бучӀиссар.

## Building components from the source

component-type-invalid = Компонентрал тип къатӀайлассар: `<{ $componentType }>`

attribute-repeated = { $attribute } тӀисса атрибут кӀилцӀа кӀицӀ бан къабюхъай.

attribute-invalid-for-component = `<{ $componentType }>` тӀисса типрал компонентрахлу "{ $attribute }" тӀисса атрибут къатӀайлассар.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } тӀисса стилданухь { $context ->
        [text-on-background] текстрал ранг фондалул рангирацӀун
        [high-contrast] лахъсса контрастрал ранг холстрацӀун
        [line] линиялул ранг холстрацӀун
        [marker] маркердал ранг холстрацӀун
       *[text-on-canvas] текстрал ранг холстрацӀун
    } дурксса контраст дакъар{ $mode ->
        [dark] { " (лухӀимур режим)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; яла чӀивимур { $threshold }:1 аьркинссар).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } тӀисса стилданухь кӀяламур режимрахлу дурксса контраст дусса рангру кӀицӀ бувну духьурчагу, ми кьиматирттая ласун дурсса лухӀимур режимрал рангирдахь текстрал ва фондалул дянив дурксса контраст дакъар ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; яла чӀивимур { $threshold }:1 аьркинссар). { $suggestion ->
        [available] ЛухӀимур режимрай контраст дуркссану бикӀаншиврул, я кӀяламур режимрал контраст гьаз бува (масала, { $lightAttribute }="{ $lightColor }" бишира), я лухӀимур режимрал ранг цамунищал даххана бува (масала, { $darkAttribute }="{ $darkColor }" бишира).
       *[none] ЛухӀимур режимрай контраст дуркссану бикӀаншиврул, кӀяламур режимрал контраст гьаз бува, я ласун дурсса рангру textColorDarkMode ва/я backgroundColorDarkMode-щал даххана бува.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } тӀисса стилданухь кӀяламур режимрахлу дурксса контраст дусса текстрал ранг кӀицӀ бувну духьурчагу, му кьиматрая ласун дурсса лухӀимур режимрал текстрал рангирахь холстрацӀун дурксса контраст дакъар ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; яла чӀивимур { $threshold }:1 аьркинссар). { $suggestion ->
        [available] ЛухӀимур режимрай контраст дуркссану бикӀаншиврул, я кӀяламур режимрал контраст гьаз бува (масала, textColor="{ $lightColor }" бишира), я лухӀимур режимрал ранг цамунищал даххана бува (масала, textColorDarkMode="{ $darkColor }" бишира).
       *[none] ЛухӀимур режимрай контраст дуркссану бикӀаншиврул, кӀяламур режимрал контраст гьаз бува, я ласун дурсса ранг textColorDarkMode-щал даххана бува.
    }

section-multiple-style-palettes = Разделданул щалва ца <stylePalette> язи бугьин бюхъайссар; яла махъмур ишла дуллай бур.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } тӀисса кӀанттул хасъсса вариантру кӀул бан къабюхъай, numToSelect минус бакъасса щалла хӀисав бакъа духьувкун.

variant-num-to-select-not-constant-number = { $component } тӀисса кӀанттул хасъсса вариантру кӀул бан къабюхъай, numToSelect даххана къашайсса хӀисав бакъа духьувкун.

variant-with-replacement-not-constant-boolean = { $component } тӀисса кӀанттул хасъсса вариантру кӀул бан къабюхъай, withReplacement даххана къашайсса булеан кьимат бакъа духьувкун.

variant-select-weight-disables-unique = selectWeight я selectForVariants кӀицӀ бувсса вариант бухьурча, select-рал хасъсса вариантру лещан дантӀиссар

variant-coprime-undetermined = { $component } тӀисса кӀанттул хасъсса вариантру кӀул бан къабюхъай, coprime гьарзаманагу къатӀайлассарив кӀул бан къахьувкун.

variant-attribute-not-constant = { $component } тӀисса кӀанттул хасъсса вариантру кӀул бан къабюхъай, { $attribute } даххана къашайсса кьимат бакъа духьувкун.

variant-attribute-not-number = { $component } тӀисса кӀанттул хасъсса вариантру кӀул бан къабюхъай, { $attribute } хӀисав бакъа духьувкун.

variant-attribute-wrong-type-for-sequence =
    { $type } тӀисса типрал { $component } тӀисса кӀанттул хасъсса вариантру кӀул бан къабюхъай, { $attribute } { $expected ->
        [letters-combination] хӀарпирттал цачӀуншиву
        [math-expression] тӀайласса математикалул выражение
        [integer] щалла хӀисав
       *[number] хӀисав
    } бакъа духьувкун.

variant-length-not-integer = { $component } тӀисса кӀанттул хасъсса вариантру кӀул бан къабюхъай, length щалла хӀисав бакъа духьувкун.

variant-sort-not-implemented = sort дусса { $component } тӀисса кӀанттул хасъсса вариантру щаллу дурну дакъар

variant-exclude-combinations-not-implemented = excludeCombinations дусса { $component } тӀисса кӀанттул хасъсса вариантру щаллу дурну дакъар

variant-math-exclude-not-implemented = exclude дусса math типрал { $component } тӀисса кӀанттул хасъсса вариантру щаллу дурну дакъар

variant-non-constant-exclude-not-implemented = даххана шайсса exclude дусса { $component } тӀисса кӀанттул хасъсса вариантру щаллу дурну дакъар

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: график prefigure рендерданий щаллу дурну дакъар; лувсса элемент кьабивтунни.

prefigure-descendant-invalid-geometry = { $subject }: геометрия дазу дакъасса я щаллу бакъасса дур; лувсса элемент кьабивтунни.

prefigure-curve-label-omitted = { $subject }: дахханну дурсса кривая элементирттай цӀарду щаллу дурну дакъар; цӀа кьабивтунни.

prefigure-curve-unsupported-definition-type = { $subject }: кривая кӀул баврил '{ $definitionType }' тӀисса тип щаллу дурну дакъар; лувсса элемент кьабивтунни.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves-рай flipFunctions тӀисса атрибут щаллу дурну дакъар; лувсса элемент кьабивтунни.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves-рай формулалул типрал лувсса функциярду бакъа щаллу дурну дакъар; лувсса элемент кьабивтунни.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] линиялул тайпалул цӀалухлу
       *[point] нукьталул цӀалухлу
    } '{ $labelPosition }' тӀисса labelPosition щаллу дурну дакъар; PreFigure-рал дефолтсса кьяйда ишла дурунни.

prefigure-fill-style-unsupported = { $subject }: PreFigure-рай '{ $fillStyle }' тӀисса дуцӀаврил стиль щаллу дурну дакъар; дурцӀусса рангирайн бувккунни.

prefigure-line-style-unknown = { $subject }: '{ $lineStyle }' тӀисса линиялул стиль кӀул бан къавхьуну, PreFigure-рал хӀасилрая кьабивтунни.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' тӀисса маркердал стиль PreFigure-рал 'diamond' стилданийн бувккунни.

prefigure-marker-style-unsupported = { $subject }: PreFigure-рай '{ $markerStyle }' тӀисса маркердал стиль щаллу дурну дакъар; дефолтсса стиль ишла дурунни.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` къатӀайлассар; кӀану лякъин къабюхълай бур. Аннотация кьабивтунни.

annotation-ref-multiple-targets = `<annotation>`: `ref` чӀярусса кӀанттурдайн бавчунни; цалчинмур кӀану ишла дуллай бур.

annotation-ref-outside-graph = `<annotation>`: `ref` къатӀайлассар; кӀану графикрал кьатӀув бур. Аннотация кьабивтунни.

annotation-ref-unsupported-target = `<annotation>`: `ref` къатӀайлассар; кӀану prefigure дахханашиннаву щаллу дурсса графикалул зат бакъар. Аннотация кьабивтунни.

annotation-text-missing = `<annotation>`: `text` дакъар я бачӀиссар; бачӀисса текст дуллай бур.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Гуртирал аьлакъа лявкъунни.
       *[other] `<{ $componentType }>` тӀисса компонент дусса гуртирал аьлакъа лявкъунни.
    }

reference-no-referent = `{ $reference }` тӀисса ссылкалун кӀану лявкъуну дакъар

reference-multiple-referents = `{ $reference }` тӀисса ссылкалун чӀярусса кӀанттурду лявкъунни

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` тӀисса кӀанттул { $attribute } тӀисса атрибутрал формат къатӀайлассар.

children-invalid = `<{ $componentType }>` тӀисса кӀанттул лувсса элементру къатӀайлассар: къатӀайласса элементру лявкъунни: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` тӀисса атрибутрал `{ $value }` тӀисса кьимат къатӀайлассар, `{ $default }` тӀисса кьимат ишла дуллай бур

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML-рал { $version } версия лявкъуну дакъар.
       *[other] DoenetML-рал { $version } версия лявкъуну дакъар. { $fallback } версиялийн бувккунни
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML къатӀайлассар: { $content }

parse-tag-missing-close-tag = DoenetML къатӀайлассар: `{ $tag }` тӀисса тегърахь лакьлакьисса тег дакъар. Цийнува лакьлакьисса тег я `</{ $tagName }>` тӀисса тег бикӀан аьркинссар.

parse-tag-error = DoenetML къатӀайлассар: `<{ $tagName }>` тӀисса тегъраву гъалатӀ бур

parse-attribute-missing-value = DoenetML къатӀайлассар: `{ $attribute }` тӀисса къатӀайласса атрибутрахь кьимат дакъасса кунма бур.

parse-attribute-invalid = DoenetML къатӀайлассар: `{ $attribute }` тӀисса атрибут къатӀайлассар

parse-attribute-value-invalid = DoenetML къатӀайлассар: `{ $value }` тӀисса атрибутрал кьимат къатӀайлассар

parse-attribute-value-quote-mismatch = DoenetML къатӀайлассар: `{ $value }` тӀисса атрибутрал кьимат къатӀайлассар. Кавычкарду цанналацӀун цанна къадархӀуссар. Вихь `{ $quote }` дакъасса кунма бур

parse-open-tag-name-missing = DoenetML къатӀайлассар: цӀа дакъасса тег лявкъунни, масала `<`

parse-tag-not-closed = DoenetML къатӀайлассар: `{ $tag }` тӀисса тег лавкьуну дакъар (`>` дакъасса кунма бур).

parse-self-closing-tag-name-missing = DoenetML къатӀайлассар: цӀа дакъасса тег лявкъунни `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML къатӀайлассар: `{ $tag }` тӀисса тег лавкьуну дакъар (`/>` дакъасса кунма бур).

parse-tag-invalid-attributes = DoenetML къатӀайлассар: `{ $tag }` тӀисса тег къатӀайлассар. Мунил атрибутру къатӀайлассарив ххал бува.

parse-close-tag-name-missing = DoenetML къатӀайлассар: цӀа дакъасса лакьлакьисса тег лявкъунни, масала `</`

parse-attribute-value-unquoted = Атрибутирттал кьиматру кавычкардаву бикӀан аьркинссар: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML къатӀайлассар: `{ $tag }` тӀисса лакьлакьисса тег лявкъунни, амма муницӀун бавхӀусса тӀитӀлатӀисса тег дакъар

parse-close-tag-mismatched = DoenetML къатӀайлассар: лакьлакьисса тег дархӀуну дакъар. `</{ $expected }>` бикӀан аьркинссия. `{ $found }` лявкъунни

parser-node-unconvertible = { $node } тӀисса узел Dast узелданийн дахханна бан къавхьунни.

## Names

name-attribute-invalid =
    name='{ $name }' тӀисса атрибут къатӀайлассар. { $reason ->
        [characters] ЦӀардаву хӀарпру, хӀисаврду, лувсса чӀапӀирду я дефисру бакъа бикӀан къабюхъай.
       *[start] ЦӀарду хӀарпирая байбишин аьркинссар.
    }

component-name-invalid-start = "{ $name }" тӀисса компонентрал цӀа къатӀайлассар. ЦӀарду хӀарпирая байбишин аьркинссар.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched типрал жавабрахь video тӀисса атрибут бикӀан аьркинссар

answer-video-watched-video-not-reference = videoWatched типрал жавабрал video тӀисса атрибут ссылка бикӀан аьркинссар

answer-name-not-single-text = Жавабрал name тӀисса атрибутрахь щалва ца лувсса текст бикӀан аьркинссар

## Referencing another document

external-doenetml-recursion-limit = КьатӀувсса DoenetML ласун къавхьунни, лап чӀявусса даражалул рекурсия духьувкун. Гуртирал ссылка дакъарив?

external-doenetml-unavailable = { $attribute }="{ $uri }" тӀисса кӀанттая DoenetML ласун къавхьунни

external-doenetml-type-mismatch = { $attribute }="{ $uri }" тӀисса кӀанттая ласурсса DoenetML къатӀайлассар: ми "{ $componentType }" тӀисса компонентрал типрацӀун къадархӀуссар

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` тӀисса атрибут ишла къадуллалиссар; мунил кӀанттай `{ $to }` бишира.
       *[other] [deprecation] `<{ $component }>`-рай `{ $from }` тӀисса атрибут ишла къадуллалиссар; мунил кӀанттай `{ $to }` бишира.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` тӀисса атрибут ишла къадуллалиссар ва хӀисав къадуллай бур, `{ $to }` цигу кӀицӀ бувну духьувкун.
       *[other] [deprecation] `<{ $component }>`-рай `{ $from }` тӀисса атрибут ишла къадуллалиссар ва хӀисав къадуллай бур, `{ $to }` цигу кӀицӀ бувну духьувкун.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`-рай `{ $attribute }` тӀисса атрибут ишла къадуллалиссар ва хӀисав къадуллай бур.

deprecated-attribute-to-child = [deprecation] `<{ $component }>`-рай `{ $attribute }` тӀисса атрибут ишла къадуллалиссар; мунил кӀанттай `<{ $child }>` тӀисса лувсса элемент бишира.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>`-рай `{ $attribute }` тӀисса атрибутрал `{ $value }` тӀисса кьимат ишла къадуллалиссар; мунил кӀанттай `{ $to }` бишира.


## Language coverage

pluralize-english-only = `<pluralize>`-хьхьун ингилис мазрайсса мукъурттил чӀявушиврул форма бакъа бан къабюхъай, мунихлуну { $locale } мазрай чивчусса документраву мунил текст даххана къадурну бур. ЧӀявушиврул форма цийнува чичара, я `pluralForm` тӀисса атрибутрай бишира.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` тӀисса элемент Doenet-рал кӀулсса элемент бакъассар.

schema-element-not-allowed-at-root = `<{ $tag }>` тӀисса элемент документрал ххяххиялий бикӀан бучӀи бакъассар.

schema-element-not-allowed-inside = `<{ $tag }>` тӀисса элемент `<{ $parent }>`-рал дянив бикӀан бучӀи бакъассар.

schema-attribute-unrecognized = `<{ $tag }>` тӀисса элементрахь `{ $attribute }` тӀисса атрибут дакъар.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` тӀисса элементрал `{ $attribute }` тӀисса атрибут список бикӀан аьркинссар, мунил гьарца бутӀа шивува кӀицӀ бувмуния ца бикӀан аьркинссар: { $allowed }
       *[other] `<{ $tag }>` тӀисса элементрал `{ $attribute }` тӀисса атрибут шивува кӀицӀ бувмуния ца бикӀан аьркинссар: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Select-рал вариантрал цӀа къатӀайлассар.  { $variantName } тӀисса вариантрал цӀа { $numOptions } вариантраву дур, амма язи бугьин аьркинмур хӀисав { $numToSelect } бур.

select-variant-name-without-options = Select-рахлу цаппара вариантру кӀицӀ бувну бур, амма { $variantName } тӀисса вариантрал цӀалухлу цукунчӀавсса вариант кӀицӀ бувну бакъар.

select-variant-name-not-possible = Select-рахлу кӀицӀ бувсса { $variantName } тӀисса вариантрал цӀа бикӀан бюхъайсса цӀа бакъассар.

select-too-few-options = Щалва { $numOptions } компонентрая { $numToSelect } компонент язи бугьин къабюхъай.

select-from-sequence-too-few-values = Лахъишиву { $length } дусса последовательностьрая { $numToSelect } кьимат язи бугьин къабюхъай.

select-from-sequence-indices-count-mismatch = Select-рахлу кӀицӀ бувсса индексирттал хӀисав язи бугьин аьркинсса хӀисаврацӀун дархӀуну бикӀан аьркинссар

select-from-sequence-indices-not-integers = Select-рахлу кӀицӀ бувсса гьарца индексру щалла хӀисаврду бикӀан аьркинссар

select-from-sequence-index-excluded = Selectfromsequence-рал кӀицӀ бувсса индекс кьабивтсса индекс бивкӀссар

select-from-sequence-indices-excluded-combination = Selectfromsequence-рал кӀицӀ бувсса индексру кьабивтсса цачӀуншиву бивкӀссар

select-from-sequence-coprime-not-positive-integers = Плюсрал щалла хӀисаврду язи къадугьлай духьувкун, coprime цачӀуншивурду язи бугьин къабюхъай.

select-from-sequence-coprime-common-factor = Coprime хӀисаврду язи бугьин къабюхъай. БикӀан бюхъайсса гьарца кьиматирттахь ца уртакьсса множитель бур. ("from" я "to" тӀисса кӀицӀ бувсса кьиматру "step"-рацӀун coprime бикӀан аьркинссар.)

select-from-sequence-coprime-single-number = 1 бакъасса ца хӀисаврая coprime цачӀуншивурду язи бугьин къабюхъай.

select-from-sequence-excluded-too-many-combinations = SelectFromSequence-рай цачӀуншивурттал 70%-я ххишала кьабивтунни

select-from-sequence-coprime-none-found = Coprime хӀисаврду язи бугьин къавхьунни. БикӀан бюхъайсса гьарца кьиматирттахь ца уртакьсса множитель бур.

select-from-sequence-too-few-unique-values = Лахъишиву { $numPossibleValues } дусса последовательностьрая { $numToSelect } хасъсса кьимат язи бугьин къабюхъай

select-prime-numbers-too-few-values = Лахъишиву { $numValues } дусса ца ялун къабячайсса хӀисаврдал спискалия { $numToSelect } кьимат язи бугьин къабюхъай

select-prime-numbers-values-count-mismatch = Select-рахлу кӀицӀ бувсса кьиматирттал хӀисав язи бугьин аьркинсса хӀисаврацӀун дархӀуну бикӀан аьркинссар

select-prime-numbers-values-not-prime = Select prime number-рахлу кӀицӀ бувсса гьарца кьиматру ца ялун къабячайсса хӀисаврдал спискалуву бикӀан аьркинссар

select-prime-numbers-values-excluded-combination = SelectPrimeNumbers-рал кӀицӀ бувсса кьиматру кьабивтсса цачӀуншиву бивкӀссар

select-prime-numbers-excluded-too-many-combinations = SelectPrimeNumbers-рай цачӀуншивурттал 70%-я ххишала кьабивтунни

select-random-combination-fluke = Лап чансса тӀайлабацӀулул сававрай, гьаксса кьиматирттал цачӀуншиву язи бугьин къавхьунни

select-random-value-fluke = Лап чансса тӀайлабацӀулул сававрай, гьаксса кьимат язи бугьин къавхьунни
