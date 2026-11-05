# Hill Mari diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# The technical nouns are the Russian ones, which is what written Hill Mari
# uses for them: «компонент», «атрибут», «функций», «индекс».
#
# `mrj` is Hill Mari (Western Mari, кырык мары йӹлмӹ). This is the largest of
# the four files and the one where the distance from `locales/mhr` is easiest
# to check: Meadow Mari's «огыл», «да», «деч», «дене», «-влак», «чын»,
# «ончаш», «икшыве», «мут», «сандене», «возаш» are Hill Mari's «агыл», «дӓ»,
# «гӹц», «доно», «-влӓ», «цын», «анжаш», «тетя», «шамак», «седӹндон», «сирӓш»,
# and every one of those words occurs on this page. See `content.ftl`'s header.
#
# **The passive participle is the fifteenth pair, and it was the last Meadow
# form left in the batch.** Hill Mari forms it in `-мы/-мӹ` by vowel harmony
# and has no `-мо/-ме/-мӧ`, which is Meadow's shape; the seed wrote the Meadow
# suffix in a dozen places — «анжыктымо», «айырымо», «ванжыктарыме»,
# «темыме», «келӹштарыме», «питӹрыме», «колтымо», and «Темлыме»,
# «пӧртӹлтымӧ» and «ешӓрыме» in `editor.ftl` — beside the eighty places it
# wrote the Hill one («ӹштӹмӹ», «сирӹмӹ», «пумы», «карангдымы»). All are
# `-мы/-мӹ` now; a reviewer should check the harmony class of each, which is
# the part a seed can get wrong even with the right suffix. «таҥастарымашыжӹ»
# went the same way, to «тӓнгӓстӓрӹмӓшӹжӹ», the stem `editor.ftl` already
# wrote.
#
# **«тӹс» carries both "colour" and "type", and one message reads "the
# colour's colour" because of it.** The header above declares the technical
# nouns as Russian, so *type* would be «тип»; it is «тӹс» throughout instead,
# and «тӹс» is also the word for a colour in the contrast diagnostics. The
# seed could establish no other Hill Mari word for either, so both stand and
# a reviewer should separate them.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] кок мычаш тӧчкӓ анжыктымы годым { $attributes } шотыш ак нӓл
       *[other] кок мычаш тӧчкӓ анжыктымы годым { $attributes } шотыш ак нӓл
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] мычаш тӧчкӓ дӓ покшал тӧчкӓ кокты анжыктымы годым { $attributes } шотыш ак нӓл
       *[other] мычаш тӧчкӓ дӓ покшал тӧчкӓ кокты анжыктымы годым { $attributes } шотыш ак нӓл
    }

line-segment-midpoint-offset-without-midpoint = покшал тӧчкӓ гӹц посна midpointOffset нималан ак логал

## `<line>`

line-points-undetermined-dimensions = Виса пӓлӹдӹмӹ тӧчкӓ-влӓ гач эртӹшӹ виквӓш линий.

line-points-too-few-dimensions = Виквӓш линий сек изи кок висӓн тӧчкӓ-влӓ гач эртӹшӓш.

line-points-depend-on-variables = Виквӓш линий вашталтшы виса-влӓ гӹц зависитлышӹ тӧчкӓ-влӓ гач эртӓ: { $variables }.

line-equation-invalid-format = { $variable1 } дӓ { $variable2 } вашталтшы висӓн виквӓш линийын уравненийжын форматшӹ цын агыл.

## `<ray>`

ray-overprescribed-through = Луч through, endpoint дӓ direction гач пумы. Пумы through шотыш ак нӓл.

ray-dimension-mismatch = лучышты numDimensions ак келшӹ.

## `<vector>`

vector-overprescribed-head = Вектор head, tail дӓ displacement гач пумы. Пумы head шотыш ак нӓл.

vector-dimension-mismatch = векторӹштӹ numDimensions ак келшӹ.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элемент деке шупшаш ак ли, вет тӹдӹн nearestPoint статус вашталтшыжӹ уке.

constrain-to-without-nearest-point = `<{ $component }>` элемент доно цӓрӓш ак ли, вет тӹдӹн nearestPoint статус вашталтшыжӹ уке.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементын кӧргӹж доно цӓрӓш ак ли, вет тӹдӹн nearestPoint статус вашталтшыжӹ уке.

## `<choiceInput>`

choice-input-label-position-ignored = рӓдӹ кӧргӹштӹ агыл choiceInput вӹкӹ labelPosition шотыш ак нӓл

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput вӹкӹ пумы индекс-влӓ шотыш ак нӓлеп, вет нӹнӹн цотӹшт choice тетя-влӓын цотӹштлан ак келшӹ.

pretzel-indices-count-mismatch = problem вӹкӹ пумы индекс-влӓ шотыш ак нӓлеп, вет нӹнӹн цотӹшт problem тетя-влӓын цотӹштлан ак келшӹ.

shuffle-indices-count-mismatch = shuffle вӹкӹ пумы индекс-влӓ шотыш ак нӓлеп, вет нӹнӹн цотӹшт компонент-влӓын цотӹштлан ак келшӹ.

indices-ignored-out-of-range = { $component } вӹкӹ пумы индекс-влӓ шотыш ак нӓлеп, вет южыжы цек гӹц лӓктӹт.

pretzel-indices-repeated = pretzel вӹкӹ пумы индекс-влӓ шотыш ак нӓлеп, вет южыжы угӹц вашлиялтыт.

pretzel-circuit-first-index = circuit режимӹште pretzel вӹкӹ пумы индекс-влӓ шотыш ак нӓлеп, вет икымшӹ индекс 1 лишӓш.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текст тетя-влӓ доно пӓшӓм ӹштӓш `type` атрибутым пуаш келеш.

invalid-type-defaulting-to-math = { $component } компонентлан цын агыл тӹс { $type }. Тӹдӹ math, text, number ӓли boolean лишӓш. math кычылталтеш.

string-not-valid-component-to-arrange = «{ $value }» рӓдӹ { $component } вӹкӹ келшӹшӹ компонент агыл. Шотыш ак нӓл.

## Types and variables

invalid-type-defaulting-to-number = Цын агыл тӹс { $type }, тӹсшӹ number лиэш.

invalid-variable-value = Вашталтшын цын агыл акшӹ: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариантын индексшӹ цот лишӓш

variant-index-must-be-integer = { $index } вариантын индексшӹ тӹчмӓш цот лишӓш

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолютный виса-влӓлан ӹштӹмӹ агыл. Кымдыкӹшт тӓнгӓстӓрӹмӹ лит.

side-by-side-absolute-margins = `<{ $component }>` абсолютный виса-влӓлан ӹштӹмӹ агыл. Тӹржӹ тӓнгӓстӓрӹмӹ лит.

side-by-side-no-block-child = Цын агыл `<{ $component }>`: тӹдӹн сек изи ик блок тетяыжӹ лишӓш.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элементын `for` атрибутшы шотыш ак нӓл.

label-for-must-resolve-to-one = `<label>` элементын `for` атрибутшы лач ик компонент вӹкӹ анжыкташ тӹнгӓлшӓш.

label-for-unresolved = `<label>` элементын `for` атрибутшым компонент доно кӹлдаш ӹш ли.

label-for-answer-with-authored-inputs = `<label>` элементын `for` атрибутшы автор сирӹмӹ пыртымы пасу-влӓан `<answer>` вӹкӹ анжыкта; пасу вӹкӹ вигак анжыкто.

label-for-answer-without-input = `<label>` элементын `for` атрибутшы пӓлемдӹмӹ пыртымы пасу гӹц посна `<answer>` вӹкӹ анжыкта.

label-for-must-reference-input-or-answer = `<label>` элементын `for` атрибутшы пыртымы пасу ӓли вашмут вӹкӹ анжыкташ тӹнгӓлшӓш.

## Accessibility

accessibility-short-description-or-decorative = Шон кердмӓшлан `<{ $component }>` ӓли кӹтӹк ынгылдарымашан лишӓш, ӓли сӧрастарымаш семӹнь пӓлемдӓлтшаш.

accessibility-video-short-description = Шон кердмӓшлан `<video>` кӹтӹк ынгылдарымашан лишӓш.

accessibility-input-short-description-or-label = Шон кердмӓшлан `<{ $component }>` кӹтӹк ынгылдарымашан ӓли пӓлӓн лишӓш.

accessibility-answer-input-short-description-or-label = Шон кердмӓшлан пыртымы пасум ӹштӹшӹ `<answer>` кӹтӹк ынгылдарымашан ӓли пӓлӓн лишӓш.

accessibility-short-description-contains-math = Кӹтӹк ынгылдарымаш-влӓӹште `<{ $component }>` гай математический компонент-влӓ лишӓш агылеп. Математикым шамак доно сирӹ.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ужашын вуй текстшылан ситӹшӹ контрастым ак пу (пӹцкемӹш тӹс) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сек изи { $threshold }:1 келеш).
       *[other] { $colorName } ужашын вуй текстшылан ситӹшӹ контрастым ак пу ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сек изи { $threshold }:1 келеш).
    }

## `<circle>`

circle-through-points-non-numerical = Тӧчкӓ-влӓын цот акӹшт уке годым { $count } тӧчкӓ гач эртӹшӹ `<circle>` ӹштӹмӹ агыл.

circle-too-many-through-points = 3 гӹц шукы тӧчкӓ гач эртӹшӹ йыргешкым шотлаш ак ли.

circle-overprescribed-radius-center-points = Пумы радиус, покшал дӓ тӧчкӓ-влӓ доно йыргешкым шотлаш ак ли.

circle-center-with-multiple-points = Пумы покшал доно 1 гӹц шукы тӧчкӓ гач эртӹшӹ йыргешкым шотлаш ак ли.

circle-radius-too-small = Йыргешкым шотлаш ак ли: кок тӧчкӓ коклаште кужыц { $distance } ылмы годым, пумы радиус { $radius } пиш изи.

circle-radius-with-many-points = Пумы радиус доно кок гӹц шукы тӧчкӓ гач эртӹшӹ йыргешкым ӹштӓш ак ли.

circle-invalid-center-or-through-points = Йыргешкын покшалжӹ ӓли тӧчкӓжӹ цын агылеп.

circle-radius-center-with-multiple-points = Пумы покшал доно 1 гӹц шукы тӧчкӓ гач эртӹшӹ йыргешкын радиусшым шотлаш ак ли.

circle-change-radius-non-numerical = Цот агыл тӧчкӓн йыргешкын радиусшым вашталташ ак ли

circle-radius-with-points-non-numerical = Цот ак-влӓ уке годым пумы радиус доно ик гӹц шукы тӧчкӓ гач эртӹшӹ йыргешкым ӹштӓш ак ли.

circle-change-center-non-numerical = Цот агыл тӧчкӓ-влӓ гач эртӹшӹ йыргешкын покшалжым вашталтымаш ӹштӹмӹ агыл.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцийын пӓлемдӹмӹ кындемжын висажӹ ак ситӹ. Кындемӹште { $intervals } кокла улы, а функцийӹште { $inputs ->
            [one] { $inputs } пыртымаш
           *[other] { $inputs } пыртымаш
        } улы.
       *[other] Функцийын пӓлемдӹмӹ кындемжын висажӹ ак ситӹ. Кындемӹште { $intervals } кокла улы, а функцийӹште { $inputs ->
            [one] { $inputs } пыртымаш
           *[other] { $inputs } пыртымаш
        } улы.
    }

function-domain-invalid-format = Функцийын пӓлемдӹмӹ кындемжын форматшӹ цын агыл.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцийын цот агыл максимумжы шотыш ак нӓл.
        [minimum] Функцийын цот агыл минимумжы шотыш ак нӓл.
        [extremum] Функцийын цот агыл экстремумжы шотыш ак нӓл.
        [point] Функцийын цот агыл тӧчкӓжӹ шотыш ак нӓл.
        [slope] Функцийын цот агыл важыкшы шотыш ак нӓл.
       *[other] Функцийын цот агыл { $type } акшӹ шотыш ак нӓл.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцийын йӓрӓ максимумжы шотыш ак нӓл.
        [minimum] Функцийын йӓрӓ минимумжы шотыш ак нӓл.
        [extremum] Функцийын йӓрӓ экстремумжы шотыш ак нӓл.
        [point] Функцийын йӓрӓ тӧчкӓжӹ шотыш ак нӓл.
       *[other] Функцийын йӓрӓ { $type } акшӹ шотыш ак нӓл.
    }

function-points-too-close = Функцийӹште икте-весылан пиш лишӹл кок тӧчкӓ улы. Функцийым пӓлемдӓш ак ли.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функцийын итерацийжӹ пыртымаш-влӓын цотӹшт лыкмаш-влӓын цотӹштлан икань ылмы годым веле лиэш. Тидӹ функцийӹште { $inputs } пыртымаш дӓ { $outputs ->
            [one] { $outputs } лыкмаш
           *[other] { $outputs } лыкмаш
        } улы.
       *[other] Функцийын итерацийжӹ пыртымаш-влӓын цотӹшт лыкмаш-влӓын цотӹштлан икань ылмы годым веле лиэш. Тидӹ функцийӹште { $inputs } пыртымаш дӓ { $outputs ->
            [one] { $outputs } лыкмаш
           *[other] { $outputs } лыкмаш
        } улы.
    }

## `<sequence>`

sequence-invalid-length = Рӓдӹн кужыцшы цын агыл. Тӹдӹ минус агыл тӹчмӓш цот лишӓш.

sequence-invalid-step = Рӓдӹн ошкӹлжы цын агыл. { $type } тӹсӓн рӓдӹлан тӹдӹ цот лишӓш.

sequence-invalid-endpoint-number = Цот рӓдӹн «{ $attribute }» акшӹ цын агыл. Тӹдӹ цот лишӓш.

sequence-invalid-endpoint-letters = Буква рӓдӹн «{ $attribute }» акшӹ цын агыл. Тӹдӹ буква-влӓын ушымашӹшт лишӓш.

sequence-invalid-endpoint = Рӓдӹн «{ $attribute }» акшӹ цын агыл.

select-from-sequence-coprime-not-numbers = цот-влӓ айырымы агылеп, седӹндон coprime шотыш ак нӓл

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations пумы, седӹндон coprime шотыш ак нӓл

## Resolving a `target`

target-not-found = `<{ $source }>` вӹкӹ цын агыл target: цель моалт агыл.

target-state-variable-not-found = `<{ $source }>` вӹкӹ цын агыл target: `<{ $component }>` элементӹштӹ «{ $property }» лӹман статус вашталтшы моалт агыл.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` вашталтшыжӹ-влӓ ӹшкешотан вашталтшы гӹц айыртемалтшаш.

ode-system-duplicate-variable-names = Зависитлышӹ вашталтшы-влӓын лӹмӹшт угӹц вашлиялтыт гӹнь, ДТ пурла велын функцийжым пӓлемдӓш ак ли.

ode-system-rhs-function-error = ДТ пурла велын функцийжым пӓлемдӓш ак ли. mathjs функцийым ӹштӹмӹ годым йоҥылыш.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } виквӓш линий коклаште лыкым пӓлемдӓш ак ли

angle-invalid-through-point = `<angle>` элементын through акӹштӹжӹ цын агыл тӧчкӓ

parabola-vertex-too-many-points = Пумы вуй доно 1 гӹц шукы тӧчкӓ гач эртӹшӹ парабола ӹштӹмӹ агыл.

parabola-too-many-points = 3 гӹц шукы тӧчкӓ гач эртӹшӹ парабола ӹштӹмӹ агыл.

intersection-too-many-items = Кок гӹц шукы объектын вашпӱчмашыжӹ ӹштӹмӹ агыл

## Other math components

ionic-compound-not-two-ions = Кок ион гӹц молы ион ушымаш ӹштӹмӹ агыл.

ionic-compound-needs-cation-and-anion = Ион ушымаш ик катионлан дӓ ик анионлан веле ӹштӹмӹ.

solve-equations-cannot-evaluate = Уравненийым ӹштӓш ак ли, вет тӹдӹм шотлаш ӹш ли: { $equation }

math-operators-operand-number-required = Математический операндым айыраш operandNumber пуаш келеш.

eigen-decomposition-failed = Матрицын ӹшке акшым шотлаш ӹш ли

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр образецӹште ак вашлиялт, седӹндон тӹдӹ со яралан келшӓ.
       *[other] `<matchesPattern>`: { $parameters } параметр-влӓ образецӹште ак вашлиялт, седӹндон нӹнӹ со яралан келшӓт.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" акым ынгылаш ак ли. Тӹдӹ none, medium, dense ӓли йӓрӓ вер доно айырымы кок плюс цот лишӓш, примерӹн grid="1 0.5". Сетке ак сӱретлалт.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` компонентлӓн { $expected ->
        [one] икӹ лыкмашан функций келеш — кажнӹ тӧчкӓштӹ y' важык, примерӹн `y - x`
       *[other] кок лыкмашан функций келеш — кажнӹ тӧчкӓштӹ вектор, примерӹн `(y, -x)`
    }, но пумы функцийӹштӹ { $found ->
        [one] { $found } лыкмаш
       *[other] { $found } лыкмаш
    } улы. { $alternative ->
        [none] Нимат ак сӱретлӓлт.
       *[other] Тӹгӹды функцилӓн `<{ $alternative }>` компонент яра. Нимат ак сӱретлӓлт.
    }

field-function-attribute-ignored-with-child = `function` атрибут шотыш ак нӓл, вет функций компонент кӧргӹштӓт пумы; кӧргӹштӹшӹжӹ кычылталтеш. Функцийым кок корны гӹц веле иктӹжӹ доно пу.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибут компонент кӧргӹштӹ вигак сирӹмӹ попымаш вашталтшывлӓм лӹмдӓ. { $reason ->
        [function-child] Тиштӹ функций `<function>` тетя семӹнь пумы, а тӹдӹ ӹшке вашталтшывлӓжӹм лӹмдӓ, седӹндон `variables` шотыш ак нӓл.
       *[no-expression] Тиштӹ тӹгӓй попымаш пумы агыл, седӹндон `variables` шотыш ак нӓл.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure сӱретӹзӹште xLabelPosition="left" ӹштӹмӹ агыл; пурла велын шӹндӹмашыжӹ кычылталтеш.

prefigure-y-label-position-unsupported = `<graph>`: prefigure сӱретӹзӹште yLabelPosition="bottom" ӹштӹмӹ агыл; кӱшыл велын шӹндӹмашыжӹ кычылталтеш.

prefigure-invalid-axis-bounds = `<graph>`: prefigure ванжыктарымашлан ось-влӓын цекӹшт цын агылеп; тӹнг bbox (-10,-10,10,10) кычылталтеш.

prefigure-invalid-width = `<graph>`: prefigure ванжыктарымашлан кымдык цын агыл; диаграммын тӹнг кымдыкшы 425 кычылталтеш.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ванжыктарымашлан aspectRatio цын агыл; тӹнг вел-влӓын кӹл-вашкӹлӹшт 1 кычылталтеш.

prefigure-grid-spacing-too-fine = `<graph>`: сеткын ошкӹлжы ось-влӓын цекӹштлан пиш изи; prefigure сӱретӹзӹште сетке ак лук.

prefigure-annotations-not-rendered = `<graph>`: PreFigure сӱретӹзе ак кычылталт гӹнь, пӓлемдӹмӓш-влӓ ак сӱретлалт.

multiple-annotations-children = `<graph>` кӧргӹштӹ шукы `<annotations>` тетя моалте; остаткаыж гӹц молы-влӓ шотыш ак нӓлеп.

## Referring to other components

copy-unrecognized-component-type = Пӓлӹдӹмӹ компонент тӹсым шараш ӓли копироватлаш ак ли: { $type }.

copy-prop-not-found = { $component } тӹсӓн компонентӹштӹ { $property } свойстве моалт агыл

collect-no-source = collect вӹкӹ источник моалт агыл.

collect-invalid-component-type = `<{ $component }>` тӹсӓн компонент-влӓм погаш ак ли, вет тидӹ цын агыл компонент тӹс.

reference-index-unavailable = `{ $reference }` индекс вӹкӹ кӹлверым ӹштӓш ак ли

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентӹштӹ { $action } ӱжаш ак ли

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Даннӧй-влӓын тӹсӹшт цын агыл. Рӓдӹ-влӓын кужыцӹшт тӹрлӹ. Моалте componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Даннӧй-влӓӹште меҥгын лӹмжӹ угӹц вашлиялтеш. Моалте componentIdx :{ $componentIdx }

data-frame-missing-column-name = Даннӧй-влӓӹште меҥге лӹм ак ситӹ. Моалте componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Тидӹ вашмутын award акшӹ answer тегын ӹшке колтымы вашмутшы вӹкӹ ӓнгӹртӓ, тидӹ вычыдымы пӓшӓлан канда.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` доно контейнер кӧргӹшӹ `<answer>` вӹкӹ `maxNumAttempts` шӹндӹмаш ак логал, вет цацымаш-влӓын цотӹштым контейнер пӓлемдӓ. `maxNumAttempts` акым контейнер вӹкӹ шӹндӹ.

nested-section-wide-check-work-max-num-attempts = Вес `sectionWideCheckWork` контейнер кӧргӹштӹ шогышы `sectionWideCheckWork` контейнер вӹкӹ `maxNumAttempts` шӹндӹмаш ак логал, вет цацымаш-влӓын цотӹштым тӱжвӓл контейнер пӓлемдӓ. `maxNumAttempts` акым тӱжвӓл контейнер вӹкӹ шӹндӹ.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality шӹндӹмӹ агыл гӹнь, { $attributes } атрибут ак логал.
       *[other] symbolicEquality шӹндӹмӹ агыл гӹнь, { $attributes } атрибут-влӓ ак логал.
    }

answer-invalid-type = answer вӹкӹ цын агыл тӹс: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентын лӹмжӹ уке, седӹндон тӹдӹм модуль атрибут семӹнь кычылташ ак ли

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентым модуль атрибут семӹнь кычылташ ак ли, вет `<module>` компонент тӹсӹштӹ «{ $name }» атрибут ӹнде пӓлемдӹмӹ.

conditional-content-condition-ignored = case ӓли else тетя-влӓан `<conditionalContent>` компонентӹштӹ `condition` атрибут шотыш ак нӓл.

slider-markers-type-mismatch = Маркер-влӓын тӹсӹшт ползунокын тӹсӹшлӓн ак келшӹ.

pretzel-problem-needs-statement-and-answer = Цын агыл pretzel: кажнӹ `<problem>` ик `<statement>` дӓ ик `<answer>` кӧргӹжеш нӓлшӓш.

pretzel-circuit-first-problem-distractor = Цын агыл pretzel: mode="circuit" режимӹште икымшӹ `<problem>` шанымашым ӧрдӹжкӹ наҥгайышӹ лишӓш агыл.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибутлан цын агыл ак { $values }; шотыш ак нӓл.
       *[other] `{ $attribute }` атрибутлан цын агыл ак-влӓ { $values }; шотыш ак нӓлеп.
    }

attribute-must-be-references = `{ $attribute }` атрибутлан цын агыл ак `{ $value }`. Атрибут `$` пӓлӹ доно тӹнгӓлшӹ кӹлвер-влӓ гӹц лишӓш.

math-input-invalid-function-names = <mathInput>: { $attribute } кӧргӹшӹ цын агыл функций лӹм-влӓ шотыш нӓлмӹ агылеп: { $names }. Кажнӹ лӹмын койшы ужашыжӹ сек изи 2 пӓлӹ лишӓш (буква-влӓ ӓли кыдалаш кӹл); тӹдӹн паштек келдӹмӹ `|<mathspeak альтернативе>` ешӓртыш толын кердеш.

## Building components from the source

component-type-invalid = Цын агыл компонент тӹс: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутым угӹц ӹштӓш ак ли.

attribute-invalid-for-component = `<{ $componentType }>` тӹсӓн компонентлан цын агыл атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль пӓлемдӹмӓште { $context ->
        [text-on-background] текстын тӹсшӹ дӓ фонын тӹсшӹ
        [high-contrast] кого контрастан тӹс дӓ сӱретлӹмӹ кындем
        [line] линийын тӹсшӹ дӓ сӱретлӹмӹ кындем
        [marker] маркерын тӹсшӹ дӓ сӱретлӹмӹ кындем
       *[text-on-canvas] текстын тӹсшӹ дӓ сӱретлӹмӹ кындем
    } коклаште контраст ак ситӹ{ $mode ->
        [dark] { " (пӹцкемӹш тӹс)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сек изи { $threshold }:1 келеш).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль пӓлемдӹмӓште пумы тӹс-влӓ соты тӹслан ситӹшӹ контрастым пуӹшт гӹнят, нӹнӹ гӹц лӓкшӹ пӹцкемӹш тӹсын тӹсшӹ-влӓ текст дӓ фон коклаште ситӹшӹ контрастым ак пу ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сек изи { $threshold }:1 келеш). { $suggestion ->
        [available] Пӹцкемӹш тӹсӹштӹ ситӹшӹ контрастлан ӓли соты тӹсын контрастшым когемде (примерӹн { $lightAttribute }="{ $lightColor }"), ӓли пӹцкемӹш тӹсын тӹсшым вашталте (примерӹн { $darkAttribute }="{ $darkColor }").
       *[none] Пӹцкемӹш тӹсӹштӹ ситӹшӹ контрастлан соты тӹсын контрастшым когемде ӓли лӓкшӹ тӹс-влӓм textColorDarkMode дӓ/ӓли backgroundColorDarkMode гач вашталте.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль пӓлемдӹмӓште пумы текст тӹс соты тӹслан ситӹшӹ контрастым пуыш гӹнят, тӹдӹн гӹц лӓкшӹ пӹцкемӹш тӹсын текст тӹсшӹ сӱретлӹмӹ кындем доно ситӹшӹ контрастым ак пу ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сек изи { $threshold }:1 келеш). { $suggestion ->
        [available] Пӹцкемӹш тӹсӹштӹ ситӹшӹ контрастлан ӓли соты тӹсын контрастшым когемде (примерӹн textColor="{ $lightColor }"), ӓли пӹцкемӹш тӹсын тӹсшым вашталте (примерӹн textColorDarkMode="{ $darkColor }").
       *[none] Пӹцкемӹш тӹсӹштӹ ситӹшӹ контрастлан соты тӹсын контрастшым когемде ӓли лӓкшӹ тӹсым textColorDarkMode гач вашталте.
    }

section-multiple-style-palettes = Ужаш ик <stylePalette> веле айырен кердеш; остаткаыжӹ кычылталтеш.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } вӹкӹ угӹц лидӹмӹ вариант-влӓм пӓлемдӓш ак ли, вет numToSelect минус агыл тӹчмӓш цот агыл.

variant-num-to-select-not-constant-number = { $component } вӹкӹ угӹц лидӹмӹ вариант-влӓм пӓлемдӓш ак ли, вет numToSelect вашталтдымы цот агыл.

variant-with-replacement-not-constant-boolean = { $component } вӹкӹ угӹц лидӹмӹ вариант-влӓм пӓлемдӓш ак ли, вет withReplacement вашталтдымы логический ак агыл.

variant-select-weight-disables-unique = махань-гӹнят айырымаште selectWeight ӓли selectForVariants пумы гӹнь, select вӹкӹ угӹц лидӹмӹ вариант-влӓ йӧрат

variant-coprime-undetermined = { $component } вӹкӹ угӹц лидӹмӹ вариант-влӓм пӓлемдӓш ак ли, вет coprime со цын агыл ма, тидӹм пӓлемдӓш ак ли.

variant-attribute-not-constant = { $component } вӹкӹ угӹц лидӹмӹ вариант-влӓм пӓлемдӓш ак ли, вет { $attribute } вашталтдымы агыл.

variant-attribute-not-number = { $component } вӹкӹ угӹц лидӹмӹ вариант-влӓм пӓлемдӓш ак ли, вет { $attribute } цот агыл.

variant-attribute-wrong-type-for-sequence =
    { $type } тӹсӓн { $component } вӹкӹ угӹц лидӹмӹ вариант-влӓм пӓлемдӓш ак ли, вет { $attribute } { $expected ->
        [letters-combination] буква-влӓын ушымашӹшт
        [math-expression] келшӹшӹ математический попымаш
        [integer] тӹчмӓш цот
       *[number] цот
    } агыл.

variant-length-not-integer = { $component } вӹкӹ угӹц лидӹмӹ вариант-влӓм пӓлемдӓш ак ли, вет length тӹчмӓш цот агыл.

variant-sort-not-implemented = sort доно { $component } вӹкӹ угӹц лидӹмӹ вариант-влӓ ӹштӹмӹ агылеп

variant-exclude-combinations-not-implemented = excludeCombinations доно { $component } вӹкӹ угӹц лидӹмӹ вариант-влӓ ӹштӹмӹ агылеп

variant-math-exclude-not-implemented = exclude доно math тӹсӓн { $component } вӹкӹ угӹц лидӹмӹ вариант-влӓ ӹштӹмӹ агылеп

variant-non-constant-exclude-not-implemented = вашталтдымы агыл exclude доно { $component } вӹкӹ угӹц лидӹмӹ вариант-влӓ ӹштӹмӹ агылеп

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графикын prefigure сӱретӹзӹштӹжӹ ӹштӹмӹ агыл; тукымжы кодалте.

prefigure-descendant-invalid-geometry = { $subject }: мычашдымы ӓли тӹчмӓш агыл геометрий; тукымжы кодалте.

prefigure-curve-label-omitted = { $subject }: ванжыктарымы кадыр элемент-влӓӹште пӓлӹ-влӓ ӹштӹмӹ агылеп; пӓлӹ кодалте.

prefigure-curve-unsupported-definition-type = { $subject }: ӹштӹмӹ агыл кадыр функций пӓлемдӹмӓшын тӹсшӹ «{ $definitionType }»; тукымжы кодалте.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементын flipFunctions атрибутшы ӹштӹмӹ агыл; тукымжы кодалте.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формула доно пумы тетя функций-влӓм веле налеш; тукымжы кодалте.

prefigure-label-position-unsupported =
    { $subject }: ӹштӹмӹ агыл labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] линий тукымын пӓлӹжлан
       *[point] тӧчкӓн пӓлӹжлан
    }; PreFigure-ын тӹнг тӓнгӓстӓрӹмӓшӹжӹ кычылталтеш.

prefigure-fill-style-unsupported = { $subject }: темӹмӹ стиль «{ $fillStyle }» PreFigure вӹкӹ ӹштӹмӹ агыл; тӹчмӓш темымӓшкӹ ванжа.

prefigure-line-style-unknown = { $subject }: пӓлӹдӹмӹ линий стиль «{ $lineStyle }» PreFigure лыкмаш гӹц карангдымы.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер стиль «{ $markerStyle }» PreFigure «diamond» стиль доно келӹштӓрӹмӹ.

prefigure-marker-style-unsupported = { $subject }: маркер стиль «{ $markerStyle }» PreFigure вӹкӹ ӹштӹмӹ агыл; тӹнг стиль кычылталтеш.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: цын агыл `ref`; цельым кӹлдаш ак ли. Пӓлемдӹмӓш карангдымы.

annotation-ref-multiple-targets = `<annotation>`: `ref` шукы цель доно кӹлдалте; икымшыжӹ кычылталтеш.

annotation-ref-outside-graph = `<annotation>`: цын агыл `ref`; цель тӹдӹм кӧргӹжеш налшӹ график гӹц тӱжвӓлне. Пӓлемдӹмӓш карангдымы.

annotation-ref-unsupported-target = `<annotation>`: цын агыл `ref`; цель prefigure ванжыктарымаште ӹштӹмӹ график объект агыл. Пӓлемдӹмӓш карангдымы.

annotation-text-missing = `<annotation>`: `text` уке ӓли йӓрӓ; йӓрӓ текст лыкталтеш.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Йыр зависимость моалте.
       *[other] `<{ $componentType }>` компонентым кӧргӹжеш налшӹ йыр зависимость моалте.
    }

reference-no-referent = Кӹлверлан объект моалт агыл: `{ $reference }`

reference-multiple-referents = Кӹлверлан шукы объект моалте: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементын { $attribute } атрибутшын форматшӹ цын агыл.

children-invalid = `<{ $componentType }>` вӹкӹ цын агыл тетя-влӓ: цын агыл тетя-влӓ моалтыч: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибутлан цын агыл ак `{ $value }`; `{ $default }` ак кычылталтеш

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версий моалт агыл.
       *[other] DoenetML { $version } версий моалт агыл. { $fallback } версий кычылталтеш
    }

## Reading the DoenetML

parse-invalid-doenetml = Цын агыл DoenetML: { $content }

parse-tag-missing-close-tag = Цын агыл DoenetML: `{ $tag }` тегын питӹрышӹ тегшӹ уке. Ӹшкенжым питӹрышӹ тег ӓли `</{ $tagName }>` тег вычалты.

parse-tag-error = Цын агыл DoenetML: `<{ $tagName }>` тегӹште йоҥылыш

parse-attribute-missing-value = Цын агыл DoenetML: `{ $attribute }` атрибутӹштӹ акшӹ ак ситӹ гай.

parse-attribute-invalid = Цын агыл DoenetML: цын агыл атрибут `{ $attribute }`

parse-attribute-value-invalid = Цын агыл DoenetML: атрибутын цын агыл акшӹ `{ $value }`

parse-attribute-value-quote-mismatch = Цын агыл DoenetML: атрибутын цын агыл акшӹ `{ $value }`. Кавычке-влӓ ак келшӹ. `{ $quote }` ак ситӹ гай

parse-open-tag-name-missing = Цын агыл DoenetML: лӹмдӹмӹ тег моалте, примерӹн `<`

parse-tag-not-closed = Цын агыл DoenetML: `{ $tag }` тег питӹрӹмӹ агыл (`>` ак ситӹ гай).

parse-self-closing-tag-name-missing = Цын агыл DoenetML: лӹмдӹмӹ тег моалте `<{ $content }>`

parse-self-closing-tag-not-closed = Цын агыл DoenetML: `{ $tag }` тег питӹрӹмӹ агыл (`/>` ак ситӹ гай).

parse-tag-invalid-attributes = Цын агыл DoenetML: `{ $tag }` тег келшӹшӹ агыл. Тӹдӹн атрибутшы-влӓ цын ак ли кердӹт.

parse-close-tag-name-missing = Цын агыл DoenetML: лӹмдӹмӹ питӹрышӹ тег моалте, примерӹн `</`

parse-attribute-value-unquoted = Атрибутын ак-влӓ кавычке кӧргӹштӹ лишӓш: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Цын агыл DoenetML: `{ $tag }` питӹрышӹ тег моалте, но тӹдӹлӓн келшӹшӹ пачшы тег уке

parse-close-tag-mismatched = Цын агыл DoenetML: келшӹдӹмӹ питӹрышӹ тег. `</{ $expected }>` вычалты. `{ $found }` моалте

parser-node-unconvertible = { $node } узелым Dast узелыш ванжыкташ ӹш ли.

## Names

name-attribute-invalid =
    Цын агыл атрибут name='{ $name }'. { $reason ->
        [characters] Лӹм-влӓӹште буква-влӓ, цот-влӓ, ӱлыл кӹл ӓли кӹл веле лин кердӹт.
       *[start] Лӹм-влӓ буква гӹц тӹнгӓлшӓш.
    }

component-name-invalid-start = Цын агыл компонент лӹм «{ $name }». Лӹм-влӓ буква гӹц тӹнгӓлшӓш.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched тӹсӓн answer-ын video атрибутшы лишӓш

answer-video-watched-video-not-reference = videoWatched тӹсӓн answer-ын video атрибутшы кӹлвер лишӓш

answer-name-not-single-text = answer-ын name атрибутӹштӹжӹ лач ик текст тетя лишӓш

## Referencing another document

external-doenetml-recursion-limit = Рекурсийын кӱкшытшӹ-влӓ пиш шукы, седӹндон тӱжвӓл DoenetML-ым нӓлӓш ӹш ли. Йыр кӹлвер уке ма?

external-doenetml-unavailable = { $attribute }="{ $uri }" адрес гӹц DoenetML-ым нӓлӓш ӹш ли

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адрес гӹц цын агыл DoenetML нӓлмӹ: тӹдӹ «{ $componentType }» компонент тӹслан ӹш келшӹ

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут тошты лин; тӹдӹн вӓреш `{ $to }` кычылт.
       *[other] [deprecation] `<{ $component }>` элементын `{ $from }` атрибутшы тошты лин; тӹдӹн вӓреш `{ $to }` кычылт.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут тошты лин дӓ шотыш ак нӓл, вет `{ $to }` тоже пумы.
       *[other] [deprecation] `<{ $component }>` элементын `{ $from }` атрибутшы тошты лин дӓ шотыш ак нӓл, вет `{ $to }` тоже пумы.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементын `{ $attribute }` атрибутшы тошты лин дӓ шотыш ак нӓл.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элементын `{ $attribute }` атрибутшы тошты лин; тӹдӹн вӓреш `<{ $child }>` тетям кычылт.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элементын `{ $attribute }` атрибутшын `{ $value }` акшӹ тошты лин; тӹдӹн вӓреш `{ $to }` кычылт.


## Language coverage

pluralize-english-only = `<pluralize>` шукы цотым англичан йӹлмӹ доно веле ӹштен кердеш, седӹндон { $locale } йӹлмӹ доно сирӹмӹ документӹштӹ тӹдӹн текстшӹ вашталтде кодеш. Шукы цот формым ӹшке сирӹ ӓли тӹдӹм `pluralForm` атрибут доно пу.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент пӓлӹмӹ Doenet элемент агыл.

schema-element-not-allowed-at-root = `<{ $tag }>` элементлан документын вожӹштыжы ак ли.

schema-element-not-allowed-inside = `<{ $tag }>` элементлан `<{ $parent }>` кӧргӹштӹ ак ли.

schema-attribute-unrecognized = `<{ $tag }>` элементӹштӹ `{ $attribute }` лӹман атрибут уке.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементын `{ $attribute }` атрибутшы кажнӹ элементшӹ нӹнӹн гӹц иктыжӹ лишӹ лӹмер лишӓш: { $allowed }
       *[other] `<{ $tag }>` элементын `{ $attribute }` атрибутшы нӹнӹн гӹц иктыжӹ лишӓш: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select вӹкӹ цын агыл вариант лӹм. { $variantName } вариант лӹм { $numOptions } айырымаште вашлиялтеш, а айырышаш цот { $numToSelect }.

select-variant-name-without-options = select вӹкӹ вариант-влӓ пумы, но линӓт кердшӹ вариант лӹмлан ик айырымашат уке: { $variantName }.

select-variant-name-not-possible = select вӹкӹ пумы { $variantName } вариант лӹм линӓт кердшӹ вариант лӹм агыл.

select-too-few-options = Цилӓжӹ { $numOptions } гӹц { $numToSelect } компонентым айыраш ак ли.

select-from-sequence-too-few-values = Кужыцшы { $length } рӓдӹ гӹц { $numToSelect } акым айыраш ак ли.

select-from-sequence-indices-count-mismatch = select вӹкӹ пумы индекс-влӓын цотӹшт айырышаш цотлан келшӹшӓш

select-from-sequence-indices-not-integers = select вӹкӹ пумы цилӓ индекс-влӓ тӹчмӓш цот лишӓш

select-from-sequence-index-excluded = selectfromsequence вӹкӹ пумы индекс карангдымы ыльы

select-from-sequence-indices-excluded-combination = selectfromsequence вӹкӹ пумы индекс-влӓ карангдымы ушымаш ыльы

select-from-sequence-coprime-not-positive-integers = Плюс тӹчмӓш цот-влӓ айырымы агылеп, седӹндон икте-весылан проста ушымаш-влӓм айыраш ак ли.

select-from-sequence-coprime-common-factor = Икте-весылан проста цот-влӓм айыраш ак ли. Цилӓ линӓт кердшӹ ак-влӓын икань шеледышӹшт улы. (Пумы "from" ӓли "to" ак-влӓ "step" доно икте-весылан проста лишӓш.)

select-from-sequence-coprime-single-number = 1 агыл ик цот гӹц икте-весылан проста ушымаш-влӓм айыраш ак ли.

select-from-sequence-excluded-too-many-combinations = selectFromSequence кӧргӹштӹ ушымаш-влӓын 70% гӹц шукыжы карангдымы

select-from-sequence-coprime-none-found = Икте-весылан проста цот-влӓм айыраш ӹш ли. Цилӓ линӓт кердшӹ ак-влӓын икань шеледышӹшт улы.

select-from-sequence-too-few-unique-values = Кужыцшы { $numPossibleValues } рӓдӹ гӹц { $numToSelect } тӹрлӹ акым айыраш ак ли

select-prime-numbers-too-few-values = Кужыцшы { $numValues } проста цот лӹмер гӹц { $numToSelect } акым айыраш ак ли

select-prime-numbers-values-count-mismatch = select вӹкӹ пумы ак-влӓын цотӹшт айырышаш цотлан келшӹшӓш

select-prime-numbers-values-not-prime = select prime number вӹкӹ пумы цилӓ ак-влӓ проста цот лӹмерӹште лишӓш

select-prime-numbers-values-excluded-combination = selectPrimeNumbers вӹкӹ пумы ак-влӓ карангдымы ушымаш ыльы

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers кӧргӹштӹ ушымаш-влӓын 70% гӹц шукыжы карангдымы

select-random-combination-fluke = Пиш линӓт керддӹмӹ пӓшӓ доно кокла гӹц нӓлмӹ ак-влӓын ушымашӹштым айыраш ӹш ли

select-random-value-fluke = Пиш линӓт керддӹмӹ пӓшӓ доно кокла гӹц нӓлмӹ акым айыраш ӹш ли
