# Meadow Mari diagnostics. Translated from `locales/en/diagnostics.ftl`, which
# is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Meadow Mari**, the larger of the two Mari literary standards. The directory
# is named `mhr` rather than the macrolanguage `chm` because Hill Mari ships
# beside it as `locales/mrj`; `negotiate.ts` aliases `chm` onto `mhr`, so a
# document written with either tag reaches this catalog. See
# `locales/mhr/content.ftl` for the full note.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# The technical nouns are the Russian ones, which is what written Meadow Mari
# uses for
# them: «компонент», «атрибут», «функций», «индекс».


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] кок мучаш точко ончыктымо годым { $attributes } шотыш ок нал
       *[other] кок мучаш точко ончыктымо годым { $attributes } шотыш ок нал
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] мучаш точко ден покшел точко коктынат ончыктымо годым { $attributes } шотыш ок нал
       *[other] мучаш точко ден покшел точко коктынат ончыктымо годым { $attributes } шотыш ок нал
    }

line-segment-midpoint-offset-without-midpoint = покшел точко деч посна midpointOffset нимолан ок логал

## `<line>`

line-points-undetermined-dimensions = Виса палыдыме точко-влак гоч эртыше вияш линий.

line-points-too-few-dimensions = Вияш линий эн шагал кок висан точко-влак гоч эртышаш.

line-points-depend-on-variables = Вияш линий вашталтше виса-влак деч зависитлыше точко-влак гоч эрта: { $variables }.

line-equation-invalid-format = { $variable1 } да { $variable2 } вашталтше висан вияш линийын уравненийжын форматше чын огыл.

## `<ray>`

ray-overprescribed-through = Луч through, endpoint да direction гоч пуымо. Пуымо through шотыш ок нал.

ray-dimension-mismatch = лучышто numDimensions ок келше.

## `<vector>`

vector-overprescribed-head = Вектор head, tail да displacement гоч пуымо. Пуымо head шотыш ок нал.

vector-dimension-mismatch = векторышто numDimensions ок келше.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элемент деке шупшаш ок лий, вет тудын nearestPoint статус вашталтшыже уке.

constrain-to-without-nearest-point = `<{ $component }>` элемент дене чараш ок лий, вет тудын nearestPoint статус вашталтшыже уке.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементын кӧргыж дене чараш ок лий, вет тудын nearestPoint статус вашталтшыже уке.

## `<choiceInput>`

choice-input-label-position-ignored = радам кӧргыштӧ огыл choiceInput ӱмбак labelPosition шотыш ок нал

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput ӱмбак пуымо индекс-влак шотыш огыт нал, вет нунын чотышт choice икшыве-влакын чотыштлан ок келше.

pretzel-indices-count-mismatch = problem ӱмбак пуымо индекс-влак шотыш огыт нал, вет нунын чотышт problem икшыве-влакын чотыштлан ок келше.

shuffle-indices-count-mismatch = shuffle ӱмбак пуымо индекс-влак шотыш огыт нал, вет нунын чотышт компонент-влакын чотыштлан ок келше.

indices-ignored-out-of-range = { $component } ӱмбак пуымо индекс-влак шотыш огыт нал, вет южыжо чек гыч лектыт.

pretzel-indices-repeated = pretzel ӱмбак пуымо индекс-влак шотыш огыт нал, вет южыжо угыч вашлиялтыт.

pretzel-circuit-first-index = circuit режимыште pretzel ӱмбак пуымо индекс-влак шотыш огыт нал, вет икымше индекс 1 лийшаш.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текст икшыве-влак дене пашам ышташ `type` атрибутым пуаш кӱлеш.

invalid-type-defaulting-to-math = { $component } компонентлан чын огыл тӱс { $type }. Тудо math, text, number але boolean лийшаш. math кучылталтеш.

string-not-valid-component-to-arrange = «{ $value }» радам { $component } ӱмбак келшыше компонент огыл. Шотыш ок нал.

## Types and variables

invalid-type-defaulting-to-number = Чын огыл тӱс { $type }, тӱсшӧ number лиеш.

invalid-variable-value = Вашталтшын чын огыл акше: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариантын индексше чот лийшаш

variant-index-must-be-integer = { $index } вариантын индексше тичмаш чот лийшаш

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолютный виса-влаклан ыштыме огыл. Кумдыкышт таҥастарыме лийыт.

side-by-side-absolute-margins = `<{ $component }>` абсолютный виса-влаклан ыштыме огыл. Тӱржӧ таҥастарыме лийыт.

side-by-side-no-block-child = Чын огыл `<{ $component }>`: тудын эн шагал ик блок икшывыже лийшаш.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элементын `for` атрибутшо шотыш ок нал.

label-for-must-resolve-to-one = `<label>` элементын `for` атрибутшо лач ик компонент ӱмбак ончыкташ тӱҥалшаш.

label-for-unresolved = `<label>` элементын `for` атрибутшым компонент дене кылдаш ыш лий.

label-for-answer-with-authored-inputs = `<label>` элементын `for` атрибутшо автор возымо пуртымо пасу-влакан `<answer>` ӱмбак ончыкта; пасу ӱмбак вигак ончыкто.

label-for-answer-without-input = `<label>` элементын `for` атрибутшо палемдыме пуртымо пасу деч посна `<answer>` ӱмбак ончыкта.

label-for-must-reference-input-or-answer = `<label>` элементын `for` атрибутшо пуртымо пасу але вашмут ӱмбак ончыкташ тӱҥалшаш.

## Accessibility

accessibility-short-description-or-decorative = Шуын кертмашлан `<{ $component }>` але кӱчык умылтарымашан лийшаш, але сӧрастарымаш семын палемдалтшаш.

accessibility-video-short-description = Шуын кертмашлан `<video>` кӱчык умылтарымашан лийшаш.

accessibility-input-short-description-or-label = Шуын кертмашлан `<{ $component }>` кӱчык умылтарымашан але палан лийшаш.

accessibility-answer-input-short-description-or-label = Шуын кертмашлан пуртымо пасум ыштыше `<answer>` кӱчык умылтарымашан але палан лийшаш.

accessibility-short-description-contains-math = Кӱчык умылтарымаш-влакыште `<{ $component }>` гай математический компонент-влак лийшаш огытыл. Математикым мут дене возо.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ужашын вуй текстшылан ситыше контрастым ок пу (пычкемыш тӱс) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эн шагал { $threshold }:1 кӱлеш).
       *[other] { $colorName } ужашын вуй текстшылан ситыше контрастым ок пу ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эн шагал { $threshold }:1 кӱлеш).
    }

## `<circle>`

circle-through-points-non-numerical = Точко-влакын чот акышт уке годым { $count } точко гоч эртыше `<circle>` ыштыме огыл.

circle-too-many-through-points = 3 деч шуко точко гоч эртыше йыргешкым шотлаш ок лий.

circle-overprescribed-radius-center-points = Пуымо радиус, покшел да точко-влак дене йыргешкым шотлаш ок лий.

circle-center-with-multiple-points = Пуымо покшел дене 1 деч шуко точко гоч эртыше йыргешкым шотлаш ок лий.

circle-radius-too-small = Йыргешкым шотлаш ок лий: кок точко коклаште кужыт { $distance } улмо годым, пуымо радиус { $radius } пеш изи.

circle-radius-with-many-points = Пуымо радиус дене кок деч шуко точко гоч эртыше йыргешкым ышташ ок лий.

circle-invalid-center-or-through-points = Йыргешкын покшелже але точкыжо чын огытыл.

circle-radius-center-with-multiple-points = Пуымо покшел дене 1 деч шуко точко гоч эртыше йыргешкын радиусшым шотлаш ок лий.

circle-change-radius-non-numerical = Чот огыл точкан йыргешкын радиусшым вашталташ ок лий

circle-radius-with-points-non-numerical = Чот ак-влак уке годым пуымо радиус дене ик деч шуко точко гоч эртыше йыргешкым ышташ ок лий.

circle-change-center-non-numerical = Чот огыл точко-влак гоч эртыше йыргешкын покшелжым вашталтымаш ыштыме огыл.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцийын палемдыме кундемжын висаже ок сите. Кундемыште { $intervals } кокла уло, а функцийыште { $inputs ->
            [one] { $inputs } пуртымаш
           *[other] { $inputs } пуртымаш
        } уло.
       *[other] Функцийын палемдыме кундемжын висаже ок сите. Кундемыште { $intervals } кокла уло, а функцийыште { $inputs ->
            [one] { $inputs } пуртымаш
           *[other] { $inputs } пуртымаш
        } уло.
    }

function-domain-invalid-format = Функцийын палемдыме кундемжын форматше чын огыл.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцийын чот огыл максимумжо шотыш ок нал.
        [minimum] Функцийын чот огыл минимумжо шотыш ок нал.
        [extremum] Функцийын чот огыл экстремумжо шотыш ок нал.
        [point] Функцийын чот огыл точкыжо шотыш ок нал.
        [slope] Функцийын чот огыл важыкшо шотыш ок нал.
       *[other] Функцийын чот огыл { $type } акше шотыш ок нал.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцийын яра максимумжо шотыш ок нал.
        [minimum] Функцийын яра минимумжо шотыш ок нал.
        [extremum] Функцийын яра экстремумжо шотыш ок нал.
        [point] Функцийын яра точкыжо шотыш ок нал.
       *[other] Функцийын яра { $type } акше шотыш ок нал.
    }

function-points-too-close = Функцийыште икте-весылан пеш лишыл кок точко уло. Функцийым палемдаш ок лий.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функцийын итерацийже пуртымаш-влакын чотышт лукмаш-влакын чотыштлан икгай улмо годым гына лиеш. Тиде функцийыште { $inputs } пуртымаш да { $outputs ->
            [one] { $outputs } лукмаш
           *[other] { $outputs } лукмаш
        } уло.
       *[other] Функцийын итерацийже пуртымаш-влакын чотышт лукмаш-влакын чотыштлан икгай улмо годым гына лиеш. Тиде функцийыште { $inputs } пуртымаш да { $outputs ->
            [one] { $outputs } лукмаш
           *[other] { $outputs } лукмаш
        } уло.
    }

## `<sequence>`

sequence-invalid-length = Радамын кужытшо чын огыл. Тудо минус огыл тичмаш чот лийшаш.

sequence-invalid-step = Радамын ошкылжо чын огыл. { $type } тӱсан радамлан тудо чот лийшаш.

sequence-invalid-endpoint-number = Чот радамын «{ $attribute }» акше чын огыл. Тудо чот лийшаш.

sequence-invalid-endpoint-letters = Буква радамын «{ $attribute }» акше чын огыл. Тудо буква-влакын ушымашышт лийшаш.

sequence-invalid-endpoint = Радамын «{ $attribute }» акше чын огыл.

select-from-sequence-coprime-not-numbers = чот-влак ойырымо огытыл, сандене coprime шотыш ок нал

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations пуымо, сандене coprime шотыш ок нал

## Resolving a `target`

target-not-found = `<{ $source }>` ӱмбак чын огыл target: цель муалт огыл.

target-state-variable-not-found = `<{ $source }>` ӱмбак чын огыл target: `<{ $component }>` элементыште «{ $property }» лӱман статус вашталтше муалт огыл.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` вашталтшыже-влак шкешотан вашталтше деч ойыртемалтшаш.

ode-system-duplicate-variable-names = Зависитлыше вашталтше-влакын лӱмышт угыч вашлиялтыт гын, ДТ пурла велын функцийжым палемдаш ок лий.

ode-system-rhs-function-error = ДТ пурла велын функцийжым палемдаш ок лий. mathjs функцийым ыштыме годым йоҥылыш.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } вияш линий коклаште лукым палемдаш ок лий

angle-invalid-through-point = `<angle>` элементын through акыштыже чын огыл точко

parabola-vertex-too-many-points = Пуымо вуй дене 1 деч шуко точко гоч эртыше парабола ыштыме огыл.

parabola-too-many-points = 3 деч шуко точко гоч эртыше парабола ыштыме огыл.

intersection-too-many-items = Кок деч шуко объектын вашпӱчмашыже ыштыме огыл

## Other math components

ionic-compound-not-two-ions = Кок ион деч моло ион ушымаш ыштыме огыл.

ionic-compound-needs-cation-and-anion = Ион ушымаш ик катионлан да ик анионлан гына ыштыме.

solve-equations-cannot-evaluate = Уравненийым ышташ ок лий, вет тудым шотлаш ыш лий: { $equation }

math-operators-operand-number-required = Математический операндым ойыраш operandNumber пуаш кӱлеш.

eigen-decomposition-failed = Матрицын шке акшым шотлаш ыш лий

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр образецыште ок вашлиялт, сандене тудо эре яралан келша.
       *[other] `<matchesPattern>`: { $parameters } параметр-влак образецыште огыт вашлиялт, сандене нуно эре яралан келшат.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" акым умылаш ок лий. Тудо none, medium, dense але яра вер дене ойырымо кок плюс чот лийшаш, мутлан grid="1 0.5". Сетке ок сӱретлалт.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure сӱретызыште xLabelPosition="left" ыштыме огыл; пурла велын шындымашыже кучылталтеш.

prefigure-y-label-position-unsupported = `<graph>`: prefigure сӱретызыште yLabelPosition="bottom" ыштыме огыл; кӱшыл велын шындымашыже кучылталтеш.

prefigure-invalid-axis-bounds = `<graph>`: prefigure вончыктарымашлан ось-влакын чекышт чын огытыл; тӱҥ bbox (-10,-10,10,10) кучылталтеш.

prefigure-invalid-width = `<graph>`: prefigure вончыктарымашлан кумдык чын огыл; диаграммын тӱҥ кумдыкшо 425 кучылталтеш.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure вончыктарымашлан aspectRatio чын огыл; тӱҥ вел-влакын кыл-вашкылышт 1 кучылталтеш.

prefigure-grid-spacing-too-fine = `<graph>`: сеткын ошкылжо ось-влакын чекыштлан пеш изи; prefigure сӱретызыште сетке ок лук.

prefigure-annotations-not-rendered = `<graph>`: PreFigure сӱретызе ок кучылталт гын, палемдымаш-влак огыт сӱретлалт.

multiple-annotations-children = `<graph>` кӧргыштӧ шуко `<annotations>` икшыве муалте; пытартышыж деч моло-влак шотыш огыт нал.

## Referring to other components

copy-unrecognized-component-type = Палыдыме компонент тӱсым шараш але копироватлаш ок лий: { $type }.

copy-prop-not-found = { $component } тӱсан компонентыште { $property } свойстве муалт огыл

collect-no-source = collect ӱмбак источник муалт огыл.

collect-invalid-component-type = `<{ $component }>` тӱсан компонент-влакым погаш ок лий, вет тиде чын огыл компонент тӱс.

reference-index-unavailable = `{ $reference }` индекс ӱмбак кылверым ышташ ок лий

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентыште { $action } ӱжаш ок лий

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Даннӧй-влакын тӱсышт чын огыл. Радам-влакын кужытышт тӱрлӧ. Муалте componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Даннӧй-влакыште меҥгын лӱмжӧ угыч вашлиялтеш. Муалте componentIdx :{ $componentIdx }

data-frame-missing-column-name = Даннӧй-влакыште меҥге лӱм ок сите. Муалте componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Тиде вашмутын award акше answer тегын шке колтымо вашмутшо ӱмбак эҥерта, тиде вучыдымо пашалан конда.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` дене контейнер кӧргысӧ `<answer>` ӱмбак `maxNumAttempts` шындымаш ок логал, вет тӧчымаш-влакын чотыштым контейнер палемда. `maxNumAttempts` акым контейнер ӱмбак шынде.

nested-section-wide-check-work-max-num-attempts = Вес `sectionWideCheckWork` контейнер кӧргыштӧ шогышо `sectionWideCheckWork` контейнер ӱмбак `maxNumAttempts` шындымаш ок логал, вет тӧчымаш-влакын чотыштым тӱжвал контейнер палемда. `maxNumAttempts` акым тӱжвал контейнер ӱмбак шынде.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality шындыме огыл гын, { $attributes } атрибут ок логал.
       *[other] symbolicEquality шындыме огыл гын, { $attributes } атрибут-влак огыт логал.
    }

answer-invalid-type = answer ӱмбак чын огыл тӱс: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентын лӱмжӧ уке, сандене тудым модуль атрибут семын кучылташ ок лий

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентым модуль атрибут семын кучылташ ок лий, вет `<module>` компонент тӱсыштӧ «{ $name }» атрибут ынде палемдыме.

conditional-content-condition-ignored = case але else икшыве-влакан `<conditionalContent>` компонентыште `condition` атрибут шотыш ок нал.

slider-markers-type-mismatch = Маркер-влакын тӱсышт ползунокын тӱсышлан ок келше.

pretzel-problem-needs-statement-and-answer = Чын огыл pretzel: кажне `<problem>` ик `<statement>` да ик `<answer>` кӧргыжеш налшаш.

pretzel-circuit-first-problem-distractor = Чын огыл pretzel: mode="circuit" режимыште икымше `<problem>` шонымашым ӧрдыжкӧ наҥгайыше лийшаш огыл.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибутлан чын огыл ак { $values }; шотыш ок нал.
       *[other] `{ $attribute }` атрибутлан чын огыл ак-влак { $values }; шотыш огыт нал.
    }

attribute-must-be-references = `{ $attribute }` атрибутлан чын огыл ак `{ $value }`. Атрибут `$` пале дене тӱҥалше кылвер-влак гыч лийшаш.

math-input-invalid-function-names = <mathInput>: { $attribute } кӧргысӧ чын огыл функций лӱм-влак шотыш налме огытыл: { $names }. Кажне лӱмын койшо ужашыже эн шагал 2 пале лийшаш (буква-влак але кыдалаш кыл); тудын почеш кӱлдымӧ `|<mathspeak альтернативе>` ешартыш толын кертеш.

## Building components from the source

component-type-invalid = Чын огыл компонент тӱс: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутым угыч ышташ ок лий.

attribute-invalid-for-component = `<{ $componentType }>` тӱсан компонентлан чын огыл атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль палемдымаште { $context ->
        [text-on-background] текстын тӱсшӧ да фонын тӱсшӧ
        [high-contrast] кугу контрастан тӱс да сӱретлыме кундем
        [line] линийын тӱсшӧ да сӱретлыме кундем
        [marker] маркерын тӱсшӧ да сӱретлыме кундем
       *[text-on-canvas] текстын тӱсшӧ да сӱретлыме кундем
    } коклаште контраст ок сите{ $mode ->
        [dark] { " (пычкемыш тӱс)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эн шагал { $threshold }:1 кӱлеш).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль палемдымаште пуымо тӱс-влак волгыдо тӱслан ситыше контрастым пуышт гынат, нуно гыч лекше пычкемыш тӱсын тӱсшӧ-влак текст ден фон коклаште ситыше контрастым огыт пу ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эн шагал { $threshold }:1 кӱлеш). { $suggestion ->
        [available] Пычкемыш тӱсыштӧ ситыше контрастлан але волгыдо тӱсын контрастшым кугемде (мутлан { $lightAttribute }="{ $lightColor }"), але пычкемыш тӱсын тӱсшым вашталте (мутлан { $darkAttribute }="{ $darkColor }").
       *[none] Пычкемыш тӱсыштӧ ситыше контрастлан волгыдо тӱсын контрастшым кугемде але лекше тӱс-влакым textColorDarkMode да/але backgroundColorDarkMode гоч вашталте.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль палемдымаште пуымо текст тӱс волгыдо тӱслан ситыше контрастым пуыш гынат, тудын гыч лекше пычкемыш тӱсын текст тӱсшӧ сӱретлыме кундем дене ситыше контрастым ок пу ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эн шагал { $threshold }:1 кӱлеш). { $suggestion ->
        [available] Пычкемыш тӱсыштӧ ситыше контрастлан але волгыдо тӱсын контрастшым кугемде (мутлан textColor="{ $lightColor }"), але пычкемыш тӱсын тӱсшым вашталте (мутлан textColorDarkMode="{ $darkColor }").
       *[none] Пычкемыш тӱсыштӧ ситыше контрастлан волгыдо тӱсын контрастшым кугемде але лекше тӱсым textColorDarkMode гоч вашталте.
    }

section-multiple-style-palettes = Ужаш ик <stylePalette> гына ойырен кертеш; пытартышыже кучылталтеш.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } ӱмбак угыч лийдыме вариант-влакым палемдаш ок лий, вет numToSelect минус огыл тичмаш чот огыл.

variant-num-to-select-not-constant-number = { $component } ӱмбак угыч лийдыме вариант-влакым палемдаш ок лий, вет numToSelect вашталтдыме чот огыл.

variant-with-replacement-not-constant-boolean = { $component } ӱмбак угыч лийдыме вариант-влакым палемдаш ок лий, вет withReplacement вашталтдыме логический ак огыл.

variant-select-weight-disables-unique = могай-гынат ойырымаште selectWeight але selectForVariants пуымо гын, select ӱмбак угыч лийдыме вариант-влак йӧрат

variant-coprime-undetermined = { $component } ӱмбак угыч лийдыме вариант-влакым палемдаш ок лий, вет coprime эре чын огыл мо, тидым палемдаш ок лий.

variant-attribute-not-constant = { $component } ӱмбак угыч лийдыме вариант-влакым палемдаш ок лий, вет { $attribute } вашталтдыме огыл.

variant-attribute-not-number = { $component } ӱмбак угыч лийдыме вариант-влакым палемдаш ок лий, вет { $attribute } чот огыл.

variant-attribute-wrong-type-for-sequence =
    { $type } тӱсан { $component } ӱмбак угыч лийдыме вариант-влакым палемдаш ок лий, вет { $attribute } { $expected ->
        [letters-combination] буква-влакын ушымашышт
        [math-expression] келшыше математический ойлымаш
        [integer] тичмаш чот
       *[number] чот
    } огыл.

variant-length-not-integer = { $component } ӱмбак угыч лийдыме вариант-влакым палемдаш ок лий, вет length тичмаш чот огыл.

variant-sort-not-implemented = sort дене { $component } ӱмбак угыч лийдыме вариант-влак ыштыме огытыл

variant-exclude-combinations-not-implemented = excludeCombinations дене { $component } ӱмбак угыч лийдыме вариант-влак ыштыме огытыл

variant-math-exclude-not-implemented = exclude дене math тӱсан { $component } ӱмбак угыч лийдыме вариант-влак ыштыме огытыл

variant-non-constant-exclude-not-implemented = вашталтдыме огыл exclude дене { $component } ӱмбак угыч лийдыме вариант-влак ыштыме огытыл

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графикын prefigure сӱретызыштыже ыштыме огыл; тукымжо кодалте.

prefigure-descendant-invalid-geometry = { $subject }: мучашдыме але тичмаш огыл геометрий; тукымжо кодалте.

prefigure-curve-label-omitted = { $subject }: вончыктарыме кадыр элемент-влакыште пале-влак ыштыме огытыл; пале кодалте.

prefigure-curve-unsupported-definition-type = { $subject }: ыштыме огыл кадыр функций палемдымашын тӱсшӧ «{ $definitionType }»; тукымжо кодалте.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементын flipFunctions атрибутшо ыштыме огыл; тукымжо кодалте.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формула дене пуымо икшыве функций-влакым гына налеш; тукымжо кодалте.

prefigure-label-position-unsupported =
    { $subject }: ыштыме огыл labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] линий тукымын палыжлан
       *[point] точкын палыжлан
    }; PreFigure-ын тӱҥ таҥастарымашыже кучылталтеш.

prefigure-fill-style-unsupported = { $subject }: темыме стиль «{ $fillStyle }» PreFigure ӱмбак ыштыме огыл; тичмаш темымашке вонча.

prefigure-line-style-unknown = { $subject }: палыдыме линий стиль «{ $lineStyle }» PreFigure лукмаш гыч кораҥдыме.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер стиль «{ $markerStyle }» PreFigure «diamond» стиль дене келыштарыме.

prefigure-marker-style-unsupported = { $subject }: маркер стиль «{ $markerStyle }» PreFigure ӱмбак ыштыме огыл; тӱҥ стиль кучылталтеш.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: чын огыл `ref`; цельым кылдаш ок лий. Палемдымаш кораҥдыме.

annotation-ref-multiple-targets = `<annotation>`: `ref` шуко цель дене кылдалте; икымшыже кучылталтеш.

annotation-ref-outside-graph = `<annotation>`: чын огыл `ref`; цель тудым кӧргыжеш налше график деч тӱжвалне. Палемдымаш кораҥдыме.

annotation-ref-unsupported-target = `<annotation>`: чын огыл `ref`; цель prefigure вончыктарымаште ыштыме график объект огыл. Палемдымаш кораҥдыме.

annotation-text-missing = `<annotation>`: `text` уке але яра; яра текст лукталтеш.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Йыр зависимость муалте.
       *[other] `<{ $componentType }>` компонентым кӧргыжеш налше йыр зависимость муалте.
    }

reference-no-referent = Кылверлан объект муалт огыл: `{ $reference }`

reference-multiple-referents = Кылверлан шуко объект муалте: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементын { $attribute } атрибутшын форматше чын огыл.

children-invalid = `<{ $componentType }>` ӱмбак чын огыл икшыве-влак: чын огыл икшыве-влак муалтыч: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибутлан чын огыл ак `{ $value }`; `{ $default }` ак кучылталтеш

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версий муалт огыл.
       *[other] DoenetML { $version } версий муалт огыл. { $fallback } версий кучылталтеш
    }

## Reading the DoenetML

parse-invalid-doenetml = Чын огыл DoenetML: { $content }

parse-tag-missing-close-tag = Чын огыл DoenetML: `{ $tag }` тегын петырыше тегше уке. Шкенжым петырыше тег але `</{ $tagName }>` тег вучалте.

parse-tag-error = Чын огыл DoenetML: `<{ $tagName }>` тегыште йоҥылыш

parse-attribute-missing-value = Чын огыл DoenetML: `{ $attribute }` атрибутышто ак ок сите гай.

parse-attribute-invalid = Чын огыл DoenetML: чын огыл атрибут `{ $attribute }`

parse-attribute-value-invalid = Чын огыл DoenetML: атрибутын чын огыл акше `{ $value }`

parse-attribute-value-quote-mismatch = Чын огыл DoenetML: атрибутын чын огыл акше `{ $value }`. Кавычке-влак огыт келше. `{ $quote }` ок сите гай

parse-open-tag-name-missing = Чын огыл DoenetML: лӱмдымӧ тег муалте, мутлан `<`

parse-tag-not-closed = Чын огыл DoenetML: `{ $tag }` тег петырыме огыл (`>` ок сите гай).

parse-self-closing-tag-name-missing = Чын огыл DoenetML: лӱмдымӧ тег муалте `<{ $content }>`

parse-self-closing-tag-not-closed = Чын огыл DoenetML: `{ $tag }` тег петырыме огыл (`/>` ок сите гай).

parse-tag-invalid-attributes = Чын огыл DoenetML: `{ $tag }` тег келшыше огыл. Тудын атрибутшо-влак чын огыт лий кертыт.

parse-close-tag-name-missing = Чын огыл DoenetML: лӱмдымӧ петырыше тег муалте, мутлан `</`

parse-attribute-value-unquoted = Атрибутын ак-влакше кавычке кӧргыштӧ лийшаш: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Чын огыл DoenetML: `{ $tag }` петырыше тег муалте, но тудлан келшыше почшо тег уке

parse-close-tag-mismatched = Чын огыл DoenetML: келшыдыме петырыше тег. `</{ $expected }>` вучалте. `{ $found }` муалте

parser-node-unconvertible = { $node } узелым Dast узелыш вончыкташ ыш лий.

## Names

name-attribute-invalid =
    Чын огыл атрибут name='{ $name }'. { $reason ->
        [characters] Лӱм-влакыште буква-влак, чот-влак, ӱлыл кыл але кыл гына лийын кертыт.
       *[start] Лӱм-влак буква гыч тӱҥалшаш.
    }

component-name-invalid-start = Чын огыл компонент лӱм «{ $name }». Лӱм-влак буква гыч тӱҥалшаш.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched тӱсан answer-ын video атрибутшо лийшаш

answer-video-watched-video-not-reference = videoWatched тӱсан answer-ын video атрибутшо кылвер лийшаш

answer-name-not-single-text = answer-ын name атрибутыштыже лач ик текст икшыве лийшаш

## Referencing another document

external-doenetml-recursion-limit = Рекурсийын кӱкшытшӧ-влак пеш шуко, сандене тӱжвал DoenetML-ым налаш ыш лий. Йыр кылвер уке мо?

external-doenetml-unavailable = { $attribute }="{ $uri }" адрес гыч DoenetML-ым налаш ыш лий

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адрес гыч чын огыл DoenetML налме: тудо «{ $componentType }» компонент тӱслан ыш келше

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут тошто лийын; тудын олмеш `{ $to }` кучылт.
       *[other] [deprecation] `<{ $component }>` элементын `{ $from }` атрибутшо тошто лийын; тудын олмеш `{ $to }` кучылт.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут тошто лийын да шотыш ок нал, вет `{ $to }` тоже пуымо.
       *[other] [deprecation] `<{ $component }>` элементын `{ $from }` атрибутшо тошто лийын да шотыш ок нал, вет `{ $to }` тоже пуымо.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементын `{ $attribute }` атрибутшо тошто лийын да шотыш ок нал.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элементын `{ $attribute }` атрибутшо тошто лийын; тудын олмеш `<{ $child }>` икшывым кучылт.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элементын `{ $attribute }` атрибутшын `{ $value }` акше тошто лийын; тудын олмеш `{ $to }` кучылт.


## Language coverage

pluralize-english-only = `<pluralize>` шуко чотым англичан йылме дене гына ыштен кертеш, сандене { $locale } йылме дене возымо документыште тудын текстше вашталтде кодеш. Шуко чот формым шке возо але тудым `pluralForm` атрибут дене пу.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент палыме Doenet элемент огыл.

schema-element-not-allowed-at-root = `<{ $tag }>` элементлан документын вожыштыжо ок лий.

schema-element-not-allowed-inside = `<{ $tag }>` элементлан `<{ $parent }>` кӧргыштӧ ок лий.

schema-attribute-unrecognized = `<{ $tag }>` элементыште `{ $attribute }` лӱман атрибут уке.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементын `{ $attribute }` атрибутшо кажне элементше нунын гыч иктыже лийше лӱмер лийшаш: { $allowed }
       *[other] `<{ $tag }>` элементын `{ $attribute }` атрибутшо нунын гыч иктыже лийшаш: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select ӱмбак чын огыл вариант лӱм. { $variantName } вариант лӱм { $numOptions } ойырымаште вашлиялтеш, а ойырышаш чот { $numToSelect }.

select-variant-name-without-options = select ӱмбак вариант-влак пуымо, но лийын кертше вариант лӱмлан ик ойырымашат уке: { $variantName }.

select-variant-name-not-possible = select ӱмбак пуымо { $variantName } вариант лӱм лийын кертше вариант лӱм огыл.

select-too-few-options = Чылаже { $numOptions } гыч { $numToSelect } компонентым ойыраш ок лий.

select-from-sequence-too-few-values = Кужытшо { $length } радам гыч { $numToSelect } акым ойыраш ок лий.

select-from-sequence-indices-count-mismatch = select ӱмбак пуымо индекс-влакын чотышт ойырышаш чотлан келшышаш

select-from-sequence-indices-not-integers = select ӱмбак пуымо чыла индекс-влак тичмаш чот лийшаш

select-from-sequence-index-excluded = selectfromsequence ӱмбак пуымо индекс кораҥдыме ыле

select-from-sequence-indices-excluded-combination = selectfromsequence ӱмбак пуымо индекс-влак кораҥдыме ушымаш ыле

select-from-sequence-coprime-not-positive-integers = Плюс тичмаш чот-влак ойырымо огытыл, сандене икте-весылан проста ушымаш-влакым ойыраш ок лий.

select-from-sequence-coprime-common-factor = Икте-весылан проста чот-влакым ойыраш ок лий. Чыла лийын кертше ак-влакын икгай шеледышышт уло. (Пуымо "from" але "to" ак-влак "step" дене икте-весылан проста лийшаш.)

select-from-sequence-coprime-single-number = 1 огыл ик чот гыч икте-весылан проста ушымаш-влакым ойыраш ок лий.

select-from-sequence-excluded-too-many-combinations = selectFromSequence кӧргыштӧ ушымаш-влакын 70% деч шукыжо кораҥдыме

select-from-sequence-coprime-none-found = Икте-весылан проста чот-влакым ойыраш ыш лий. Чыла лийын кертше ак-влакын икгай шеледышышт уло.

select-from-sequence-too-few-unique-values = Кужытшо { $numPossibleValues } радам гыч { $numToSelect } тӱрлӧ акым ойыраш ок лий

select-prime-numbers-too-few-values = Кужытшо { $numValues } проста чот лӱмер гыч { $numToSelect } акым ойыраш ок лий

select-prime-numbers-values-count-mismatch = select ӱмбак пуымо ак-влакын чотышт ойырышаш чотлан келшышаш

select-prime-numbers-values-not-prime = select prime number ӱмбак пуымо чыла ак-влак проста чот лӱмерыште лийшаш

select-prime-numbers-values-excluded-combination = selectPrimeNumbers ӱмбак пуымо ак-влак кораҥдыме ушымаш ыле

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers кӧргыштӧ ушымаш-влакын 70% деч шукыжо кораҥдыме

select-random-combination-fluke = Пеш лийын кертдыме паша дене кокла гыч налме ак-влакын ушымашыштым ойыраш ыш лий

select-random-value-fluke = Пеш лийын кертдыме паша дене кокла гыч налме акым ойыраш ыш лий
