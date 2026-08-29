# Khanty diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# The technical nouns are the Russian ones, which is what written Khanty uses
# for them: «компонент», «атрибут», «функция», «индекс», «документ».
#
# `kca` is Khanty (хӑнты ясӑӈ), Ob-Ugric, Kazym norm. This is the largest file
# in the locale and the least attested: no published Khanty text contains a
# parser error, a schema error or an attribute name, so **most of the wording
# below is coined**, on the pattern `content.ftl`'s header sets out — «ӑнт
# ўԓа» "is not taken" for *is ignored*, «ӑнт рӑхӑԓ» "is not permitted" for
# *cannot*, «вөты мосӑԓ» "must be", «сир» for *type*, «арат» for *number*,
# «вєр» for *value*, «нӑврєм» "child" for an element's children. A speaker's
# review is worth more here than anywhere else in the locale.
#
# A limit worth recording: Khanty's causal postposition follows the clause it
# governs, so an English "X is ignored because Y" cannot be written as one
# Khanty sentence with the placeables in the order the renderer supplies them.
# Where English subordinates a reason, this catalog writes two sentences
# instead — an honest loss of connective force, not a translation of it.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] кӑт эԓты пас мийӑм ки, { $attributes } ӑнт ўԓа
       *[other] кӑт эԓты пас мийӑм ки, { $attributes } ӑнт ўԓа
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] эԓты пас па кўтӑп пас кӑтӈӑн мийӑм ки, { $attributes } ӑнт ўԓа
       *[other] эԓты пас па кўтӑп пас кӑтӈӑн мийӑм ки, { $attributes } ӑнт ўԓа
    }

line-segment-midpoint-offset-without-midpoint = кўтӑп пас ӑнтөм ки, midpointOffset нємӑԓты ӑнт вєрӑԓ

## `<line>`

line-points-undetermined-dimensions = Мєта арат ӑнт пасӑтса пасӑт хуват мӑнты веськат хӑнши.

line-points-too-few-dimensions = Веськат хӑнши мєт ай кӑт мєтаӈ пас хуват мӑнты мосӑԓ.

line-points-depend-on-variables = Веськат хӑнши вєԓщӑты вєрӑт эвӑԓт ԓоњщты пасӑт хуват мӑнԓ: { $variables }.

line-equation-invalid-format = { $variable1 } па { $variable2 } вєԓщӑты вєрӑп веськат хӑнши уравнение форма ям ӑнтөм.

## `<ray>`

ray-overprescribed-through = Луч through, endpoint па direction хуват мийӑм. Мийӑм through ӑнт ўԓа.

ray-dimension-mismatch = луч хуща numDimensions ӑнт ит сир.

## `<vector>`

vector-overprescribed-head = Вектор head, tail па displacement хуват мийӑм. Мийӑм head ӑнт ўԓа.

vector-dimension-mismatch = вектор хуща numDimensions ӑнт ит сир.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элемент хуща тӑԓты ӑнт рӑхӑԓ. Ԓўв nearestPoint вєԓщӑты вєрӑԓ ӑнтөм.

constrain-to-without-nearest-point = `<{ $component }>` элемент пиԓа ԓавӑԓты ӑнт рӑхӑԓ. Ԓўв nearestPoint вєԓщӑты вєрӑԓ ӑнтөм.

constrain-to-interior-without-nearest-point = `<{ $component }>` элемент ԓыпи пиԓа ԓавӑԓты ӑнт рӑхӑԓ. Ԓўв nearestPoint вєԓщӑты вєрӑԓ ӑнтөм.

## `<choiceInput>`

choice-input-label-position-ignored = строка ԓыпийн ӑнтөм choiceInput хуща labelPosition ӑнт ўԓа

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput хуща мийӑм индексӑт ӑнт ўԓа. Ԓыв аратӑԓ choice нӑврємӑт аратԓаԓ пиԓа ӑнт ит сир.

pretzel-indices-count-mismatch = problem хуща мийӑм индексӑт ӑнт ўԓа. Ԓыв аратӑԓ problem нӑврємӑт аратԓаԓ пиԓа ӑнт ит сир.

shuffle-indices-count-mismatch = shuffle хуща мийӑм индексӑт ӑнт ўԓа. Ԓыв аратӑԓ компонентӑт аратԓаԓ пиԓа ӑнт ит сир.

indices-ignored-out-of-range = { $component } хуща мийӑм индексӑт ӑнт ўԓа. Муԓтыԓаԓ кўт эвӑԓт ким этԓӑт.

pretzel-indices-repeated = pretzel хуща мийӑм индексӑт ӑнт ўԓа. Муԓтыԓаԓ па пўш вөйӑтԓайӑт.

pretzel-circuit-first-index = circuit сирӑн pretzel хуща мийӑм индексӑт ӑнт ўԓа. Оԓӑӈ индекс 1 вөты мосӑԓ.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текст нӑврємӑт пиԓа рупитты пата `type` атрибут мӑты мосӑԓ.

invalid-type-defaulting-to-math = { $component } компонент пата ям ӑнтөм сир { $type }. Ԓўв math, text, number муй boolean вөты мосӑԓ. math ўԓа.

string-not-valid-component-to-arrange = «{ $value }» строка { $component } хуща рӑхты компонент ӑнтөм. Ӑнт ўԓа.

## Types and variables

invalid-type-defaulting-to-number = Ям ӑнтөм сир { $type }, сирӑԓ number йиԓ.

invalid-variable-value = Вєԓщӑты вєр ям ӑнтөм: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариант индекс арат вөты мосӑԓ

variant-index-must-be-integer = { $index } вариант индекс тэԓ арат вөты мосӑԓ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолютной мєтаӑт пата ӑнт вєрса. Кўԓӑтԓаԓ пиԓа пиԓа вөты мосӑԓ.

side-by-side-absolute-margins = `<{ $component }>` абсолютной мєтаӑт пата ӑнт вєрса. Эԓтыԓаԓ пиԓа пиԓа вөты мосӑԓ.

side-by-side-no-block-child = Ям ӑнтөм `<{ $component }>`: ԓўв мєт ай ит блок нӑврємӑԓ вөты мосӑԓ.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элемент `for` атрибут ӑнт ўԓа.

label-for-must-resolve-to-one = `<label>` элемент `for` атрибут ит компонент хуща вантӑԓты мосӑԓ.

label-for-unresolved = `<label>` элемент `for` атрибут компонент пиԓа ӑнт кӑтԓӑса.

label-for-answer-with-authored-inputs = `<label>` элемент `for` атрибут хӑншты хө пунӑм пунты пєлӑкӑп `<answer>` хуща вантӑԓ; пунты пєлӑк хуща веськат вантӑԓта.

label-for-answer-without-input = `<label>` элемент `for` атрибут пунты пєлӑк ӑнтөм `<answer>` хуща вантӑԓ.

label-for-must-reference-input-or-answer = `<label>` элемент `for` атрибут пунты пєлӑк муй вошты ясӑӈ хуща вантӑԓты мосӑԓ.

## Accessibility

accessibility-short-description-or-decorative = Юхӑтты рӑхты вєр пата `<{ $component }>` вўԓы ясӑӈӑп вөты мосӑԓ, муй сӑмԓӑты вєр сирӑн пасӑтты мосӑԓ.

accessibility-video-short-description = Юхӑтты рӑхты вєр пата `<video>` вўԓы ясӑӈӑп вөты мосӑԓ.

accessibility-input-short-description-or-label = Юхӑтты рӑхты вєр пата `<{ $component }>` вўԓы ясӑӈӑп муй нємӑп вөты мосӑԓ.

accessibility-answer-input-short-description-or-label = Юхӑтты рӑхты вєр пата пунты пєлӑк вєрты `<answer>` вўԓы ясӑӈӑп муй нємӑп вөты мосӑԓ.

accessibility-short-description-contains-math = Вўԓы ясӑӈӑт ԓыпийн `<{ $component }>` сир математика компонентӑт вөты ӑнт мосӑԓ. Математика ясӑӈӑн хӑнша.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ух пєлӑк ух текстӑԓ пата ситы контраст ӑнт мӑԓ (питы сир) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; мєт ай { $threshold }:1 мосӑԓ).
       *[other] { $colorName } ух пєлӑк ух текстӑԓ пата ситы контраст ӑнт мӑԓ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; мєт ай { $threshold }:1 мосӑԓ).
    }

## `<circle>`

circle-through-points-non-numerical = Пасӑт арат вєрԓаԓ ӑнтөм ки, { $count } пас хуват мӑнты `<circle>` ӑнт вєрса.

circle-too-many-through-points = 3 эвӑԓт ар пас хуват мӑнты круг ԓўӈӑтты ӑнт рӑхӑԓ.

circle-overprescribed-radius-center-points = Мийӑм радиус, кўтӑп па пасӑт пиԓа круг ԓўӈӑтты ӑнт рӑхӑԓ.

circle-center-with-multiple-points = Мийӑм кўтӑп пиԓа 1 эвӑԓт ар пас хуват мӑнты круг ԓўӈӑтты ӑнт рӑхӑԓ.

circle-radius-too-small = Круг ԓўӈӑтты ӑнт рӑхӑԓ: кӑт пас кўтн хўвӑт { $distance }, мийӑм радиус { $radius } шєӈк ай.

circle-radius-with-many-points = Мийӑм радиус пиԓа кӑт эвӑԓт ар пас хуват мӑнты круг вєрты ӑнт рӑхӑԓ.

circle-invalid-center-or-through-points = Круг кўтӑпӑԓ муй пасӑԓ ям ӑнтөм.

circle-radius-center-with-multiple-points = Мийӑм кўтӑп пиԓа 1 эвӑԓт ар пас хуват мӑнты круг радиусӑԓ ԓўӈӑтты ӑнт рӑхӑԓ.

circle-change-radius-non-numerical = Аратӑӈ ӑнтөм пасӑп круг радиусӑԓ вєԓщӑты ӑнт рӑхӑԓ

circle-radius-with-points-non-numerical = Арат вєрӑт ӑнтөм ки, мийӑм радиус пиԓа ит эвӑԓт ар пас хуват мӑнты круг вєрты ӑнт рӑхӑԓ.

circle-change-center-non-numerical = Аратӑӈ ӑнтөм пасӑт хуват мӑнты круг кўтӑпӑԓ вєԓщӑты ӑнт вєрса.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функция пасӑтӑм мўвӑԓ мєтаԓ ӑнт ситы. Мўв хуща { $intervals } кўт вөԓ, функция хуща { $inputs ->
            [one] { $inputs } пунты вєр
           *[other] { $inputs } пунты вєр
        } вөԓ.
       *[other] Функция пасӑтӑм мўвӑԓ мєтаԓ ӑнт ситы. Мўв хуща { $intervals } кўт вөԓ, функция хуща { $inputs ->
            [one] { $inputs } пунты вєр
           *[other] { $inputs } пунты вєр
        } вөԓ.
    }

function-domain-invalid-format = Функция пасӑтӑм мўв форма ям ӑнтөм.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функция аратӑӈ ӑнтөм максимумӑԓ ӑнт ўԓа.
        [minimum] Функция аратӑӈ ӑнтөм минимумӑԓ ӑнт ўԓа.
        [extremum] Функция аратӑӈ ӑнтөм экстремумӑԓ ӑнт ўԓа.
        [point] Функция аратӑӈ ӑнтөм пасӑԓ ӑнт ўԓа.
        [slope] Функция аратӑӈ ӑнтөм сўӈӑԓ ӑнт ўԓа.
       *[other] Функция аратӑӈ ӑнтөм { $type } вєрӑԓ ӑнт ўԓа.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функция тэԓ ӑнтөм максимумӑԓ ӑнт ўԓа.
        [minimum] Функция тэԓ ӑнтөм минимумӑԓ ӑнт ўԓа.
        [extremum] Функция тэԓ ӑнтөм экстремумӑԓ ӑнт ўԓа.
        [point] Функция тэԓ ӑнтөм пасӑԓ ӑнт ўԓа.
       *[other] Функция тэԓ ӑнтөм { $type } вєрӑԓ ӑнт ўԓа.
    }

function-points-too-close = Функция хуща ит-ит хуща шєӈк матта кӑт пас вөԓ. Функция пасӑтты ӑнт рӑхӑԓ.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функция итерацияԓ пунты вєрӑт арат па ким этты вєрӑт арат ит сир вөԓ ки, вєрса. Тӑм функция хуща { $inputs } пунты вєр па { $outputs ->
            [one] { $outputs } ким этты вєр
           *[other] { $outputs } ким этты вєр
        } вөԓ.
       *[other] Функция итерацияԓ пунты вєрӑт арат па ким этты вєрӑт арат ит сир вөԓ ки, вєрса. Тӑм функция хуща { $inputs } пунты вєр па { $outputs ->
            [one] { $outputs } ким этты вєр
           *[other] { $outputs } ким этты вєр
        } вөԓ.
    }

## `<sequence>`

sequence-invalid-length = Рӑт хўвӑт ям ӑнтөм. Ԓўв минус ӑнтөм тэԓ арат вөты мосӑԓ.

sequence-invalid-step = Рӑт ԓәхӑԓ ям ӑнтөм. { $type } сирӑп рӑт пата ԓўв арат вөты мосӑԓ.

sequence-invalid-endpoint-number = Аратӑӈ рӑт «{ $attribute }» вєрӑԓ ям ӑнтөм. Ԓўв арат вөты мосӑԓ.

sequence-invalid-endpoint-letters = Буквайӑӈ рӑт «{ $attribute }» вєрӑԓ ям ӑнтөм. Ԓўв буквайӑт акӑтман вөты мосӑԓ.

sequence-invalid-endpoint = Рӑт «{ $attribute }» вєрӑԓ ям ӑнтөм.

select-from-sequence-coprime-not-numbers = аратӑт ӑнт вўштаса. coprime ӑнт ўԓа

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations мийӑм. coprime ӑнт ўԓа

## Resolving a `target`

target-not-found = `<{ $source }>` хуща ям ӑнтөм target: цель ӑнт вөйӑтса.

target-state-variable-not-found = `<{ $source }>` хуща ям ӑнтөм target: `<{ $component }>` элемент хуща «{ $property }» нємӑп вєԓщӑты вєр ӑнт вөйӑтса.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` вєԓщӑты вєрԓаԓ тӑнти вєԓщӑты вєр эвӑԓт па сир вөты мосӑԓ.

ode-system-duplicate-variable-names = Ԓоњщты вєԓщӑты вєрӑт нємԓаԓ па пўш вөйӑтԓайӑт ки, ДТ каттӑӈ пєлӑк функцияԓ пасӑтты ӑнт рӑхӑԓ.

ode-system-rhs-function-error = ДТ каттӑӈ пєлӑк функцияԓ пасӑтты ӑнт рӑхӑԓ. mathjs функция вєрты кўтн ошибка.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } веськат хӑнши кўтн сўӈ пасӑтты ӑнт рӑхӑԓ

angle-invalid-through-point = `<angle>` элемент through вєрӑԓ хуща ям ӑнтөм пас

parabola-vertex-too-many-points = Мийӑм ух пиԓа 1 эвӑԓт ар пас хуват мӑнты парабола ӑнт вєрса.

parabola-too-many-points = 3 эвӑԓт ар пас хуват мӑнты парабола ӑнт вєрса.

intersection-too-many-items = Кӑт эвӑԓт ар вєр сєвӑрты вєр ӑнт вєрса

## Other math components

ionic-compound-not-two-ions = Кӑт ион эвӑԓт па ион акӑтман ӑнт вєрса.

ionic-compound-needs-cation-and-anion = Ион акӑтман ит катион па ит анион пата ԓапӑт вєрса.

solve-equations-cannot-evaluate = Уравнение вєрты ӑнт рӑхӑԓ. Ԓўвеԓ ԓўӈӑтты ӑнт рӑхӑс: { $equation }

math-operators-operand-number-required = Математика операнд вўштаты пата operandNumber мӑты мосӑԓ.

eigen-decomposition-failed = Матрица тӑнти вєрԓаԓ ԓўӈӑтты ӑнт рӑхӑс

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр образец ԓыпийн ӑнт вөйӑтԓа. Ԓўв мосты хӑтԓ тэԓ ӑнтөм вєр пиԓа ит сир.
       *[other] `<matchesPattern>`: { $parameters } параметрӑт образец ԓыпийн ӑнт вөйӑтԓайӑт. Ԓыв мосты хӑтԓ тэԓ ӑнтөм вєр пиԓа ит сир.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" вєр уша верты ӑнт рӑхӑԓ. Ԓўв none, medium, dense муй тэԓ ӑнтөм пєлӑкӑн вўштаӑм кӑт плюс арат вөты мосӑԓ, паста grid="1 0.5". Сетка ӑнт хӑншӑԓа.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` пата { $expected ->
        [one] ит ким этты вєрӑп функция мосӑԓ — хуԓы пас хуща y' сўӈ, паста `y - x`
       *[other] кӑт ким этты вєрӑп функция мосӑԓ — хуԓы пас хуща вектор, паста `(y, -x)`
    }, мийӑм функция хуща { $found ->
        [one] { $found } ким этты вєр
       *[other] { $found } ким этты вєр
    } вөԓ. { $alternative ->
        [none] Нємӑԓты ӑнт хӑншӑԓа.
       *[other] Щи функция пата `<{ $alternative }>` компонент рӑхӑԓ. Нємӑԓты ӑнт хӑншӑԓа.
    }

field-function-attribute-ignored-with-child = `function` атрибут ӑнт ўԓа. Функция компонент ԓыпийн па мийӑм; ԓыпи функция ўԓа. Функция кӑт вєр эвӑԓт ит вєрӑн ԓапӑт мийа.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибут компонент ԓыпийн веськат хӑншӑм ясӑӈ вєԓщӑты вєрԓаԓ нємӑтԓӑԓԓе. { $reason ->
        [function-child] Тӑта функция `<function>` нӑврєм сирӑн мийӑм, ԓўв тӑнти вєԓщӑты вєрԓаԓ нємӑтԓӑԓԓе, щи ԓуват `variables` ӑнт ўԓа.
       *[no-expression] Тӑта щи сир ясӑӈ ӑнт мийӑм, щи ԓуват `variables` ӑнт ўԓа.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure хӑншты вєр хуща xLabelPosition="left" ӑнт вєрса; каттӑӈ пєлӑк пунӑпса ўԓа.

prefigure-y-label-position-unsupported = `<graph>`: prefigure хӑншты вєр хуща yLabelPosition="bottom" ӑнт вєрса; нўм пєлӑк пунӑпса ўԓа.

prefigure-invalid-axis-bounds = `<graph>`: prefigure нух-мӑнӑпса пата осьӑт кўтԓаԓ ям ӑнтөм; оԓӑӈ bbox (-10,-10,10,10) ўԓа.

prefigure-invalid-width = `<graph>`: prefigure нух-мӑнӑпса пата кўԓӑт ям ӑнтөм; диаграмма оԓӑӈ кўԓӑтӑԓ 425 ўԓа.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure нух-мӑнӑпса пата aspectRatio ям ӑнтөм; оԓӑӈ пєлӑкӑт кӑтԓӑпсаԓ 1 ўԓа.

prefigure-grid-spacing-too-fine = `<graph>`: сетка ԓәхӑԓ осьӑт кўтԓаԓ пата шєӈк ай; prefigure хӑншты вєр хуща сетка ӑнт этԓ.

prefigure-annotations-not-rendered = `<graph>`: PreFigure хӑншты вєр ӑнт ўԓа ки, пасӑт ӑнт хӑншӑԓайӑт.

multiple-annotations-children = `<graph>` ԓыпийн ар `<annotations>` нӑврєм вөйӑтса; мєт кимет эвӑԓт па вєрӑт ӑнт ўԓайӑт.

## Referring to other components

copy-unrecognized-component-type = Ӑнт уша вєрӑм компонент сир шаншты муй копироватты ӑнт рӑхӑԓ: { $type }.

copy-prop-not-found = { $component } сирӑп компонент хуща { $property } вєр ӑнт вөйӑтса

collect-no-source = collect хуща оԓӑӈ вєр ӑнт вөйӑтса.

collect-invalid-component-type = `<{ $component }>` сирӑп компонентӑт акӑтты ӑнт рӑхӑԓ. Тӑми рӑхты компонент сир ӑнтөм.

reference-index-unavailable = `{ $reference }` индекс хуща кӑтԓӑпса вєрты ӑнт рӑхӑԓ

## `<callAction>`

component-action-unavailable = `{ $reference }` компонент хуща { $action } ўвӑтты ӑнт рӑхӑԓ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Данныйӑт сирӑԓ ям ӑнтөм. Строкаӑт хўвӑтԓаԓ па сир. Вөйӑтса componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Данныйӑт хуща столбец нєм па пўш вөйӑтԓа. Вөйӑтса componentIdx :{ $componentIdx }

data-frame-missing-column-name = Данныйӑт хуща столбец нєм ӑнт ситы. Вөйӑтса componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Тӑм вошты ясӑӈ award вєрӑԓ answer тег тӑнти китӑм вошты ясӑӈӑԓ хуща ԓоњщӑԓ, щи ԓуват ӑнт нөмӑсԓӑм вєр этԓ.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` пиԓа контейнер ԓыпийн вөԓты `<answer>` хуща `maxNumAttempts` пунӑпса нємӑԓты ӑнт вєрӑԓ. Пўшӑт арат контейнер пасӑтԓӑԓԓе. `maxNumAttempts` вєр контейнер хуща пуна.

nested-section-wide-check-work-max-num-attempts = Па `sectionWideCheckWork` контейнер ԓыпийн вөԓты `sectionWideCheckWork` контейнер хуща `maxNumAttempts` пунӑпса нємӑԓты ӑнт вєрӑԓ. Пўшӑт арат ким контейнер пасӑтԓӑԓԓе. `maxNumAttempts` вєр ким контейнер хуща пуна.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality ӑнт пунса ки, { $attributes } атрибут нємӑԓты ӑнт вєрӑԓ.
       *[other] symbolicEquality ӑнт пунса ки, { $attributes } атрибутӑт нємӑԓты ӑнт вєрԓӑт.
    }

answer-invalid-type = answer хуща ям ӑнтөм сир: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонент нємӑԓ ӑнтөм. Ԓўвеԓ модуль атрибут сирӑн ўты ӑнт рӑхӑԓ

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонент модуль атрибут сирӑн ўты ӑнт рӑхӑԓ. `<module>` компонент сир хуща «{ $name }» атрибут вөԓ ин пасӑтӑм.

conditional-content-condition-ignored = case муй else нӑврємӑп `<conditionalContent>` компонент хуща `condition` атрибут ӑнт ўԓа.

slider-markers-type-mismatch = Маркерӑт сирԓаԓ ползунок сирӑԓ пиԓа ӑнт ит сир.

pretzel-problem-needs-statement-and-answer = Ям ӑнтөм pretzel: хуԓы `<problem>` ит `<statement>` па ит `<answer>` ԓыпеԓн тӑйты мосӑԓ.

pretzel-circuit-first-problem-distractor = Ям ӑнтөм pretzel: mode="circuit" сирӑн оԓӑӈ `<problem>` нөмӑс па пєлӑка мӑнтты вєр вөты ӑнт мосӑԓ.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибут пата ям ӑнтөм вєр { $values }; ӑнт ўԓа.
       *[other] `{ $attribute }` атрибут пата ям ӑнтөм вєрӑт { $values }; ӑнт ўԓайӑт.
    }

attribute-must-be-references = `{ $attribute }` атрибут пата ям ӑнтөм вєр `{ $value }`. Атрибут `$` пас эвӑԓт этты кӑтԓӑпсаӑт эвӑԓт вөты мосӑԓ.

math-input-invalid-function-names = <mathInput>: { $attribute } ԓыпийн ям ӑнтөм функция нємӑт ӑнт ўса: { $names }. Хуԓы нєм вантты пєлӑкӑԓ мєт ай 2 пас вөты мосӑԓ (буквайӑт муй кўтӑп кӑтԓӑпса); ԓўв юԓӑԓн мосты ӑнтөм `|<mathspeak па сир>` па вєр юхӑтты рӑхӑԓ.

## Building components from the source

component-type-invalid = Ям ӑнтөм компонент сир: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибут па пўш вєрты ӑнт рӑхӑԓ.

attribute-invalid-for-component = `<{ $componentType }>` сирӑп компонент пата ям ӑнтөм атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль пасӑтӑпса хуща { $context ->
        [text-on-background] текст сир па ԓыпӑс сир
        [high-contrast] вөн контрастӑп сир па хӑншты мўв
        [line] хӑнши сир па хӑншты мўв
        [marker] маркер сир па хӑншты мўв
       *[text-on-canvas] текст сир па хӑншты мўв
    } кўтн контраст ӑнт ситы{ $mode ->
        [dark] { " (питы сир)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; мєт ай { $threshold }:1 мосӑԓ).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль пасӑтӑпса хуща мийӑм сирӑт нови сир пата ситы контраст мӑсӑт, щиты па ԓыв эвӑԓтԓаԓ этты питы сирӑт текст па ԓыпӑс кўтн ситы контраст ӑнт мӑԓӑт ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; мєт ай { $threshold }:1 мосӑԓ). { $suggestion ->
        [available] Питы сир хуща ситы контраст пата нови сир контрастӑԓ вөна вєра (паста { $lightAttribute }="{ $lightColor }"), муй питы сир сирӑԓ вєԓщӑта (паста { $darkAttribute }="{ $darkColor }").
       *[none] Питы сир хуща ситы контраст пата нови сир контрастӑԓ вөна вєра муй этты сирӑт textColorDarkMode па/муй backgroundColorDarkMode хуват вєԓщӑта.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль пасӑтӑпса хуща мийӑм текст сир нови сир пата ситы контраст мӑс, щиты па ԓўв эвӑԓтӑԓ этты питы сир текст сир хӑншты мўв пиԓа ситы контраст ӑнт мӑԓ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; мєт ай { $threshold }:1 мосӑԓ). { $suggestion ->
        [available] Питы сир хуща ситы контраст пата нови сир контрастӑԓ вөна вєра (паста textColor="{ $lightColor }"), муй питы сир сирӑԓ вєԓщӑта (паста textColorDarkMode="{ $darkColor }").
       *[none] Питы сир хуща ситы контраст пата нови сир контрастӑԓ вөна вєра муй этты сир textColorDarkMode хуват вєԓщӑта.
    }

section-multiple-style-palettes = Ух пєлӑк ит <stylePalette> ԓапӑт вўштаты вєрӑԓ; мєт кимет ўԓа.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } хуща па пўш ӑнт вөԓты вариантӑт пасӑтты ӑнт рӑхӑԓ. numToSelect минус ӑнтөм тэԓ арат ӑнтөм.

variant-num-to-select-not-constant-number = { $component } хуща па пўш ӑнт вөԓты вариантӑт пасӑтты ӑнт рӑхӑԓ. numToSelect вєԓщӑты ӑнтөм арат ӑнтөм.

variant-with-replacement-not-constant-boolean = { $component } хуща па пўш ӑнт вөԓты вариантӑт пасӑтты ӑнт рӑхӑԓ. withReplacement вєԓщӑты ӑнтөм логика вєр ӑнтөм.

variant-select-weight-disables-unique = муԓты вўштаӑпса хуща selectWeight муй selectForVariants мийӑм ки, select хуща па пўш ӑнт вөԓты вариантӑт ԓәщӑтԓайӑт

variant-coprime-undetermined = { $component } хуща па пўш ӑнт вөԓты вариантӑт пасӑтты ӑнт рӑхӑԓ. coprime мосты хӑтԓ ям вөԓ муй ӑнтөм — тӑми пасӑтты ӑнт рӑхӑԓ.

variant-attribute-not-constant = { $component } хуща па пўш ӑнт вөԓты вариантӑт пасӑтты ӑнт рӑхӑԓ. { $attribute } вєԓщӑты ӑнтөм ӑнтөм.

variant-attribute-not-number = { $component } хуща па пўш ӑнт вөԓты вариантӑт пасӑтты ӑнт рӑхӑԓ. { $attribute } арат ӑнтөм.

variant-attribute-wrong-type-for-sequence =
    { $type } сирӑп { $component } хуща па пўш ӑнт вөԓты вариантӑт пасӑтты ӑнт рӑхӑԓ. { $attribute } { $expected ->
        [letters-combination] буквайӑт акӑтман
        [math-expression] рӑхты математика ясӑӈ
        [integer] тэԓ арат
       *[number] арат
    } ӑнтөм.

variant-length-not-integer = { $component } хуща па пўш ӑнт вөԓты вариантӑт пасӑтты ӑнт рӑхӑԓ. length тэԓ арат ӑнтөм.

variant-sort-not-implemented = sort пиԓа { $component } хуща па пўш ӑнт вөԓты вариантӑт ӑнт вєрсайӑт

variant-exclude-combinations-not-implemented = excludeCombinations пиԓа { $component } хуща па пўш ӑнт вөԓты вариантӑт ӑнт вєрсайӑт

variant-math-exclude-not-implemented = exclude пиԓа math сирӑп { $component } хуща па пўш ӑнт вөԓты вариантӑт ӑнт вєрсайӑт

variant-non-constant-exclude-not-implemented = вєԓщӑты exclude пиԓа { $component } хуща па пўш ӑнт вөԓты вариантӑт ӑнт вєрсайӑт

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: график prefigure хӑншты вєрӑԓ хуща ӑнт вєрса; нӑврємԓаԓ хӑйса.

prefigure-descendant-invalid-geometry = { $subject }: эԓты пас ӑнтөм муй тэԓ ӑнтөм геометрия; нӑврємԓаԓ хӑйса.

prefigure-curve-label-omitted = { $subject }: нух-мӑнӑм кєрԓӑм элементӑт хуща нємӑт ӑнт вєрсайӑт; нєм хӑйса.

prefigure-curve-unsupported-definition-type = { $subject }: ӑнт вєрса кєрԓӑм функция пасӑтӑпса сир «{ $definitionType }»; нӑврємԓаԓ хӑйса.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элемент flipFunctions атрибутӑԓ ӑнт вєрса; нӑврємԓаԓ хӑйса.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формула пиԓа мийӑм нӑврєм функцияӑт ԓапӑт ўԓ; нӑврємԓаԓ хӑйса.

prefigure-label-position-unsupported =
    { $subject }: ӑнт вєрса labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] хӑнши сєм нєм пата
       *[point] пас нєм пата
    }; PreFigure оԓӑӈ кӑтԓӑпсаԓ ўԓа.

prefigure-fill-style-unsupported = { $subject }: тэԓ вєрты стиль «{ $fillStyle }» PreFigure хуща ӑнт вєрса; тэԓ вєрты вєра мӑнԓ.

prefigure-line-style-unknown = { $subject }: ӑнт уша вєрӑм хӑнши стиль «{ $lineStyle }» PreFigure этӑпса эвӑԓт ким ўса.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер стиль «{ $markerStyle }» PreFigure «diamond» стиль пиԓа кӑтԓӑса.

prefigure-marker-style-unsupported = { $subject }: маркер стиль «{ $markerStyle }» PreFigure хуща ӑнт вєрса; оԓӑӈ стиль ўԓа.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ям ӑнтөм `ref`; цель кӑтԓӑты ӑнт рӑхӑԓ. Пас ким ўса.

annotation-ref-multiple-targets = `<annotation>`: `ref` ар цель пиԓа кӑтԓӑса; оԓӑӈмет ўԓа.

annotation-ref-outside-graph = `<annotation>`: ям ӑнтөм `ref`; цель ԓўвеԓ тӑйты график эвӑԓт ким. Пас ким ўса.

annotation-ref-unsupported-target = `<annotation>`: ям ӑнтөм `ref`; цель prefigure нух-мӑнӑпса хуща вєрты график вєр ӑнтөм. Пас ким ўса.

annotation-text-missing = `<annotation>`: `text` ӑнтөм муй тэԓ ӑнтөм; тэԓ ӑнтөм текст этԓ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Кєрԓӑм ԓоњщӑпса вөйӑтса.
       *[other] `<{ $componentType }>` компонент тӑйты кєрԓӑм ԓоњщӑпса вөйӑтса.
    }

reference-no-referent = Кӑтԓӑпса пата вєр ӑнт вөйӑтса: `{ $reference }`

reference-multiple-referents = Кӑтԓӑпса пата ар вєр вөйӑтса: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элемент { $attribute } атрибут формаԓ ям ӑнтөм.

children-invalid = `<{ $componentType }>` хуща ям ӑнтөм нӑврємӑт: ям ӑнтөм нӑврємӑт вөйӑтсайӑт: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибут пата ям ӑнтөм вєр `{ $value }`; `{ $default }` вєр ўԓа

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версия ӑнт вөйӑтса.
       *[other] DoenetML { $version } версия ӑнт вөйӑтса. { $fallback } версия ўԓа
    }

## Reading the DoenetML

parse-invalid-doenetml = Ям ӑнтөм DoenetML: { $content }

parse-tag-missing-close-tag = Ям ӑнтөм DoenetML: `{ $tag }` тег пєнтты тегӑԓ ӑнтөм. Тӑнти пєнтты тег муй `</{ $tagName }>` тег ԓавӑԓса.

parse-tag-error = Ям ӑнтөм DoenetML: `<{ $tagName }>` тег хуща ошибка

parse-attribute-missing-value = Ям ӑнтөм DoenetML: `{ $attribute }` атрибут хуща вєр ӑнт ситы сир.

parse-attribute-invalid = Ям ӑнтөм DoenetML: ям ӑнтөм атрибут `{ $attribute }`

parse-attribute-value-invalid = Ям ӑнтөм DoenetML: атрибут ям ӑнтөм вєрӑԓ `{ $value }`

parse-attribute-value-quote-mismatch = Ям ӑнтөм DoenetML: атрибут ям ӑнтөм вєрӑԓ `{ $value }`. Кавычкаӑт ӑнт ит сир. `{ $quote }` ӑнт ситы сир

parse-open-tag-name-missing = Ям ӑнтөм DoenetML: нємӑԓ ӑнтөм тег вөйӑтса, паста `<`

parse-tag-not-closed = Ям ӑнтөм DoenetML: `{ $tag }` тег ӑнт пєнтса (`>` ӑнт ситы сир).

parse-self-closing-tag-name-missing = Ям ӑнтөм DoenetML: нємӑԓ ӑнтөм тег вөйӑтса `<{ $content }>`

parse-self-closing-tag-not-closed = Ям ӑнтөм DoenetML: `{ $tag }` тег ӑнт пєнтса (`/>` ӑнт ситы сир).

parse-tag-invalid-attributes = Ям ӑнтөм DoenetML: `{ $tag }` тег ям ӑнтөм. Ԓўв атрибутԓаԓ ям ӑнтөм вөты рӑхԓӑт.

parse-close-tag-name-missing = Ям ӑнтөм DoenetML: нємӑԓ ӑнтөм пєнтты тег вөйӑтса, паста `</`

parse-attribute-value-unquoted = Атрибут вєрԓаԓ кавычкаӑт ԓыпийн вөты мосӑԓ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ям ӑнтөм DoenetML: `{ $tag }` пєнтты тег вөйӑтса, ԓўв пата рӑхты пўншты тег ӑнтөм

parse-close-tag-mismatched = Ям ӑнтөм DoenetML: ит сир ӑнтөм пєнтты тег. `</{ $expected }>` ԓавӑԓса. `{ $found }` вөйӑтса

parser-node-unconvertible = { $node } узел Dast узела вєԓщӑты ӑнт рӑхӑс.

## Names

name-attribute-invalid =
    Ям ӑнтөм атрибут name='{ $name }'. { $reason ->
        [characters] Нємӑт ԓыпийн буквайӑт, аратӑт, иԓпи кӑтԓӑпса муй кӑтԓӑпса ԓапӑт вөты рӑхԓӑт.
       *[start] Нємӑт буква эвӑԓт этты мосԓӑт.
    }

component-name-invalid-start = Ям ӑнтөм компонент нєм «{ $name }». Нємӑт буква эвӑԓт этты мосԓӑт.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched сирӑп answer video атрибутӑп вөты мосӑԓ

answer-video-watched-video-not-reference = videoWatched сирӑп answer video атрибутӑԓ кӑтԓӑпса вөты мосӑԓ

answer-name-not-single-text = answer name атрибутӑԓ хуща ит текст нӑврєм вөты мосӑԓ

## Referencing another document

external-doenetml-recursion-limit = Рекурсия нўмпиԓаԓ шєӈк ар, щи ԓуват ким DoenetML ўты ӑнт рӑхӑс. Кєрԓӑм кӑтԓӑпса ӑнтөм?

external-doenetml-unavailable = { $attribute }="{ $uri }" адрес эвӑԓт DoenetML ўты ӑнт рӑхӑс

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адрес эвӑԓт ям ӑнтөм DoenetML ўса: ԓўв «{ $componentType }» компонент сир пиԓа ӑнт ит сир

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут пирщ йис; ԓўв кўтӑԓн `{ $to }` ўва.
       *[other] [deprecation] `<{ $component }>` элемент `{ $from }` атрибутӑԓ пирщ йис; ԓўв кўтӑԓн `{ $to }` ўва.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут пирщ йис па ӑнт ўԓа. `{ $to }` па мийӑм.
       *[other] [deprecation] `<{ $component }>` элемент `{ $from }` атрибутӑԓ пирщ йис па ӑнт ўԓа. `{ $to }` па мийӑм.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элемент `{ $attribute }` атрибутӑԓ пирщ йис па ӑнт ўԓа.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элемент `{ $attribute }` атрибутӑԓ пирщ йис; ԓўв кўтӑԓн `<{ $child }>` нӑврєм ўва.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элемент `{ $attribute }` атрибут `{ $value }` вєрӑԓ пирщ йис; ԓўв кўтӑԓн `{ $to }` ўва.


## Language coverage

pluralize-english-only = `<pluralize>` ар арат ԓапӑт ӑӈгԓись ясӑӈӑн вєрты вєрӑԓ, щи ԓуват { $locale } ясӑӈӑн хӑншӑм документ хуща ԓўв текстӑԓ вєԓщӑтман ӑнтөм хӑщӑԓ. Ар арат форма тӑнти хӑнша муй ԓўвеԓ `pluralForm` атрибут пиԓа мийа.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент уша вєрӑм Doenet элемент ӑнтөм.

schema-element-not-allowed-at-root = `<{ $tag }>` элемент документ ԓыв хуща ӑнт рӑхӑԓ.

schema-element-not-allowed-inside = `<{ $tag }>` элемент `<{ $parent }>` ԓыпийн ӑнт рӑхӑԓ.

schema-attribute-unrecognized = `<{ $tag }>` элемент хуща `{ $attribute }` нємӑп атрибут ӑнтөм.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элемент `{ $attribute }` атрибутӑԓ хуԓы элементӑԓ ԓыв эвӑԓтԓаԓ ит вөԓты списка вөты мосӑԓ: { $allowed }
       *[other] `<{ $tag }>` элемент `{ $attribute }` атрибутӑԓ ԓыв эвӑԓтԓаԓ ит вөты мосӑԓ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select хуща ям ӑнтөм вариант нєм. { $variantName } вариант нєм { $numOptions } вўштаӑпса хуща вөйӑтԓа, вўштаты арат { $numToSelect }.

select-variant-name-without-options = select хуща вариантӑт мийӑм, вөты рӑхты вариант нєм пата ит вўштаӑпса ӑнтөм: { $variantName }.

select-variant-name-not-possible = select хуща мийӑм { $variantName } вариант нєм вөты рӑхты вариант нєм ӑнтөм.

select-too-few-options = Хуԓыева { $numOptions } эвӑԓт { $numToSelect } компонент вўштаты ӑнт рӑхӑԓ.

select-from-sequence-too-few-values = Хўвӑтӑԓ { $length } рӑт эвӑԓт { $numToSelect } вєр вўштаты ӑнт рӑхӑԓ.

select-from-sequence-indices-count-mismatch = select хуща мийӑм индексӑт арат вўштаты арат пиԓа ит сир вөты мосӑԓ

select-from-sequence-indices-not-integers = select хуща мийӑм хуԓыева индексӑт тэԓ арат вөты мосԓӑт

select-from-sequence-index-excluded = selectfromsequence хуща мийӑм индекс ким ўса вөс

select-from-sequence-indices-excluded-combination = selectfromsequence хуща мийӑм индексӑт ким ўса акӑтман вөс

select-from-sequence-coprime-not-positive-integers = Плюс тэԓ аратӑт ӑнт вўштаса, щи ԓуват ит-ит пата проста акӑтманӑт вўштаты ӑнт рӑхӑԓ.

select-from-sequence-coprime-common-factor = Ит-ит пата проста аратӑт вўштаты ӑнт рӑхӑԓ. Хуԓыева вөты рӑхты вєрӑт ит сир пєԓӑтӑп тӑйԓӑт. (Мийӑм "from" муй "to" вєрӑт "step" пиԓа ит-ит пата проста вөты мосԓӑт.)

select-from-sequence-coprime-single-number = 1 ӑнтөм ит арат эвӑԓт ит-ит пата проста акӑтманӑт вўштаты ӑнт рӑхӑԓ.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ԓыпийн акӑтманӑт 70% эвӑԓт арԓаԓ ким ўса

select-from-sequence-coprime-none-found = Ит-ит пата проста аратӑт вўштаты ӑнт рӑхӑс. Хуԓыева вөты рӑхты вєрӑт ит сир пєԓӑтӑп тӑйԓӑт.

select-from-sequence-too-few-unique-values = Хўвӑтӑԓ { $numPossibleValues } рӑт эвӑԓт { $numToSelect } па сир вєр вўштаты ӑнт рӑхӑԓ

select-prime-numbers-too-few-values = Хўвӑтӑԓ { $numValues } проста арат списка эвӑԓт { $numToSelect } вєр вўштаты ӑнт рӑхӑԓ

select-prime-numbers-values-count-mismatch = select хуща мийӑм вєрӑт арат вўштаты арат пиԓа ит сир вөты мосӑԓ

select-prime-numbers-values-not-prime = select prime number хуща мийӑм хуԓыева вєрӑт проста арат списка хуща вөты мосԓӑт

select-prime-numbers-values-excluded-combination = selectPrimeNumbers хуща мийӑм вєрӑт ким ўса акӑтман вөс

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ԓыпийн акӑтманӑт 70% эвӑԓт арԓаԓ ким ўса

select-random-combination-fluke = Шєӈк вөты рӑхты ӑнтөм вєр пиԓа кўт эвӑԓт ўвӑм вєрӑт акӑтман вўштаты ӑнт рӑхӑс

select-random-value-fluke = Шєӈк вөты рӑхты ӑнтөм вєр пиԓа кўт эвӑԓт ўвӑм вєр вўштаты ӑнт рӑхӑс
