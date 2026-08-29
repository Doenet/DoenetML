# Komi-Permyak diagnostics. Translated from `locales/en/diagnostics.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic with Komi's ӧ — but **not** with the і that Komi-Zyrian
# writes, which is not a letter of the Komi-Permyak alphabet.
#
# Komi-Permyak (`koi`) is a member of the Komi macrolanguage (`kv`) that until
# now was folded onto the Komi-Zyrian catalog by `MACROLANGUAGE_MEMBERS` in
# `src/negotiate.ts`. It is a written standard of its own, so it now has a
# catalog of its own and that fold is removed. Where its spelling parts from
# `locales/kpv`'s in the words this file contains: the plural is -эз and not
# Zyrian -яс (тшыкӧдчӧмэз, индексэз, пасэз for kv's тшыкӧдчӧмъяс, индексъяс,
# пасъяс), no word is written with і (вӧли, пыртис for kv's вӧлі, пыртіс), and
# «либо» stands where Zyrian writes «либӧ».
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# The technical nouns are the Russian ones, which is what written Komi-Permyak
# uses for them: «компонент», «атрибут», «функция», «индекс».


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] кык пом пас индӧм дырйи { $attributes } оз лыддьысь
       *[other] кык пом пас индӧм дырйи { $attributes } оз лыддьысь
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] пом пас да шӧр пас кыкнан индӧм дырйи { $attributes } оз лыддьысь
       *[other] пом пас да шӧр пас кыкнан индӧм дырйи { $attributes } оз лыддьысь
    }

line-segment-midpoint-offset-without-midpoint = шӧр пастӧг midpointOffset немтор вылӧ оз вӧч

## `<line>`

line-points-undetermined-dimensions = Мерайтӧмыс тӧдтӧм пасэз пыр мунысь веськыд визь.

line-points-too-few-dimensions = Веськыд визь этша дырйи кык мерайтӧма пасэз пыр мунны колӧ.

line-points-depend-on-variables = Веськыд визь вежласяна мерайтӧмэзысь кывтысь пасэз пыр мунӧ: { $variables }.

line-equation-invalid-format = { $variable1 } да { $variable2 } вежласяна мерайтӧмэза веськыд визьлӧн уравнениеыслӧн форматыс абу веськыд.

## `<ray>`

ray-overprescribed-through = Луч through, endpoint да direction пыр сетӧма. Сетӧм through оз лыддьысь.

ray-dimension-mismatch = лучын numDimensions оз лӧсяв.

## `<vector>`

vector-overprescribed-head = Вектор head, tail да displacement пыр сетӧма. Сетӧм head оз лыддьысь.

vector-dimension-mismatch = векторын numDimensions оз лӧсяв.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элемент дорӧ кыскыны оз позь, тайӧс вӧсна мый сылӧн nearestPoint статус вежласяныс абу.

constrain-to-without-nearest-point = `<{ $component }>` элементӧн ӧтувтны оз позь, тайӧс вӧсна мый сылӧн nearestPoint статус вежласяныс абу.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементлӧн пытшкӧсӧн ӧтувтны оз позь, тайӧс вӧсна мый сылӧн nearestPoint статус вежласяныс абу.

## `<choiceInput>`

choice-input-label-position-ignored = визь пытшкын абу choiceInput вылӧ labelPosition оз лыддьысь

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput вылӧ сетӧм индексэз оз лыддьысьны, тайӧс вӧсна мый налӧн лыдыс choice челядьлӧн лыдыслы оз лӧсяв.

pretzel-indices-count-mismatch = problem вылӧ сетӧм индексэз оз лыддьысьны, тайӧс вӧсна мый налӧн лыдыс problem челядьлӧн лыдыслы оз лӧсяв.

shuffle-indices-count-mismatch = shuffle вылӧ сетӧм индексэз оз лыддьысьны, тайӧс вӧсна мый налӧн лыдыс компонентэзлӧн лыдыслы оз лӧсяв.

indices-ignored-out-of-range = { $component } вылӧ сетӧм индексэз оз лыддьысьны, тайӧс вӧсна мый кутшӧмкӧэз кывкӧртӧдысь петӧны.

pretzel-indices-repeated = pretzel вылӧ сетӧм индексэз оз лыддьысьны, тайӧс вӧсна мый кутшӧмкӧэз выльысь лоӧны.

pretzel-circuit-first-index = circuit режимын pretzel вылӧ сетӧм индексэз оз лыддьысьны, тайӧс вӧсна мый медводдза индексыс 1 лоны колӧ.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текст челядьӧн уджалӧм вӧсна `type` атрибут сетны колӧ.

invalid-type-defaulting-to-math = { $component } компонентлы абу веськыд ног { $type }. Сийӧ math, text, number либо boolean лоны колӧ. math вӧдитчӧ.

string-not-valid-component-to-arrange = «{ $value }» визь { $component } вылӧ лӧсялана компонент абу. Оз лыддьысь.

## Types and variables

invalid-type-defaulting-to-number = Абу веськыд ног { $type }, ногыс number лоӧ.

invalid-variable-value = Вежласянлӧн абу веськыд донйыс: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариант индекс лыд лоны колӧ

variant-index-must-be-integer = { $index } вариант индекс тыр лыд лоны колӧ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолютнӧй мерайтӧмэзлы абу вӧчӧма. Пасьтаэзыс ӧтлаӧдана лоӧны.

side-by-side-absolute-margins = `<{ $component }>` абсолютнӧй мерайтӧмэзлы абу вӧчӧма. Дорыс ӧтлаӧдана лоӧны.

side-by-side-no-block-child = Абу веськыд `<{ $component }>`: сылӧн этша дырйи ӧти блок челядьыс лоны колӧ.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элементысь `for` атрибут оз лыддьысь.

label-for-must-resolve-to-one = `<label>` элементысь `for` атрибут дзик ӧти компонент вылӧ индыны колӧ.

label-for-unresolved = `<label>` элементысь `for` атрибутсӧ компонентӧн йитны эз артмы.

label-for-answer-with-authored-inputs = `<label>` элементысь `for` атрибут автор гижӧм пыртан ин вылӧ `<answer>` вылӧ индӧ; ин вылӧ веськыда индӧй.

label-for-answer-without-input = `<label>` элементысь `for` атрибут пасъялан пыртан интӧг `<answer>` вылӧ индӧ.

label-for-must-reference-input-or-answer = `<label>` элементысь `for` атрибут пыртан ин либо вочакыв вылӧ индыны колӧ.

## Accessibility

accessibility-short-description-or-decorative = Воан позянлун вӧсна `<{ $component }>` либо дженьыд гижӧда лоны колӧ, либо серпасалӧм моз пасйыны.

accessibility-video-short-description = Воан позянлун вӧсна `<video>` дженьыд гижӧда лоны колӧ.

accessibility-input-short-description-or-label = Воан позянлун вӧсна `<{ $component }>` дженьыд гижӧда либо паса лоны колӧ.

accessibility-answer-input-short-description-or-label = Воан позянлун вӧсна пыртан ин лӧсьӧдысь `<answer>` дженьыд гижӧда либо паса лоны колӧ.

accessibility-short-description-contains-math = Дженьыд гижӧдэзын `<{ $component }>` кодь математическӧй компонентэз лоны оз позь. Математикасӧ кывэзӧн гиж.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } юкӧнлӧн юр текстыслы тырмымӧн контраст оз сет (пемыд ног) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; этша дырйи { $threshold }:1 колӧ).
       *[other] { $colorName } юкӧнлӧн юр текстыслы тырмымӧн контраст оз сет ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; этша дырйи { $threshold }:1 колӧ).
    }

## `<circle>`

circle-through-points-non-numerical = Пасэзлӧн лыд донэзыс абу кӧ, { $count } пас пыр мунысь `<circle>` абу вӧчӧма.

circle-too-many-through-points = 3-ысь унджык пас пыр мунысь гӧгрӧссӧ лыддьыны оз позь.

circle-overprescribed-radius-center-points = Сетӧм радиусӧн, шӧрӧн да пасэзӧн гӧгрӧссӧ лыддьыны оз позь.

circle-center-with-multiple-points = Сетӧм шӧрӧн 1-ысь унджык пас пыр мунысь гӧгрӧссӧ лыддьыны оз позь.

circle-radius-too-small = Гӧгрӧссӧ лыддьыны оз позь: кык пас костыс { $distance } кӧ, сетӧм радиусыс { $radius } зэв ичӧт.

circle-radius-with-many-points = Сетӧм радиусӧн кыкысь унджык пас пыр мунысь гӧгрӧс вӧчны оз позь.

circle-invalid-center-or-through-points = Гӧгрӧслӧн шӧрыс либо пасэзыс абу веськыдӧсь.

circle-radius-center-with-multiple-points = Сетӧм шӧрӧн 1-ысь унджык пас пыр мунысь гӧгрӧслысь радиуссӧ лыддьыны оз позь.

circle-change-radius-non-numerical = Лыд абу пасэза гӧгрӧслысь радиуссӧ вежны оз позь

circle-radius-with-points-non-numerical = Лыд донэз абу кӧ, сетӧм радиусӧн ӧтиысь унджык пас пыр мунысь гӧгрӧс вӧчны оз позь.

circle-change-center-non-numerical = Лыд абу пасэз пыр мунысь гӧгрӧслысь шӧрсӧ вежӧм абу вӧчӧма.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функциялӧн тӧдмалӧм инсьыс мерайтӧмыс оз тырмы. Инын { $intervals } колас эм, а функцияын { $inputs ->
            [one] { $inputs } пыртӧм
           *[other] { $inputs } пыртӧм
        } эм.
       *[other] Функциялӧн тӧдмалӧм инсьыс мерайтӧмыс оз тырмы. Инын { $intervals } колас эм, а функцияын { $inputs ->
            [one] { $inputs } пыртӧм
           *[other] { $inputs } пыртӧм
        } эм.
    }

function-domain-invalid-format = Функциялӧн тӧдмалӧм инсьыс форматыс абу веськыд.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функциялӧн лыд абу максимумыс оз лыддьысь.
        [minimum] Функциялӧн лыд абу минимумыс оз лыддьысь.
        [extremum] Функциялӧн лыд абу экстремумыс оз лыддьысь.
        [point] Функциялӧн лыд абу пасыс оз лыддьысь.
        [slope] Функциялӧн лыд абу мыгӧрыс оз лыддьысь.
       *[other] Функциялӧн лыд абу { $type } донйыс оз лыддьысь.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функциялӧн тыртӧм максимумыс оз лыддьысь.
        [minimum] Функциялӧн тыртӧм минимумыс оз лыддьысь.
        [extremum] Функциялӧн тыртӧм экстремумыс оз лыддьысь.
        [point] Функциялӧн тыртӧм пасыс оз лыддьысь.
       *[other] Функциялӧн тыртӧм { $type } донйыс оз лыддьысь.
    }

function-points-too-close = Функцияын ӧта-мӧдыслы зэв матын кык пас эм. Функциясӧ тӧдмавны оз позь.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функциялӧн итерациясӧ вӧчны позьӧ сӧмын пыртӧмэзлӧн лыдыс петӧмэзлӧн лыдыслы ӧткодь кӧ. Тайӧ функцияын { $inputs } пыртӧм да { $outputs ->
            [one] { $outputs } петӧм
           *[other] { $outputs } петӧм
        } эм.
       *[other] Функциялӧн итерациясӧ вӧчны позьӧ сӧмын пыртӧмэзлӧн лыдыс петӧмэзлӧн лыдыслы ӧткодь кӧ. Тайӧ функцияын { $inputs } пыртӧм да { $outputs ->
            [one] { $outputs } петӧм
           *[other] { $outputs } петӧм
        } эм.
    }

## `<sequence>`

sequence-invalid-length = Радлӧн кузьтаыс абу веськыд. Сийӧ минус абу тыр лыд лоны колӧ.

sequence-invalid-step = Радлӧн воськовыс абу веськыд. { $type } ногӧн радлы сийӧ лыд лоны колӧ.

sequence-invalid-endpoint-number = Лыд радлӧн «{ $attribute }» донйыс абу веськыд. Сийӧ лыд лоны колӧ.

sequence-invalid-endpoint-letters = Шыпас радлӧн «{ $attribute }» донйыс абу веськыд. Сийӧ шыпасэзлӧн ӧтлаӧдӧм лоны колӧ.

sequence-invalid-endpoint = Радлӧн «{ $attribute }» донйыс абу веськыд.

select-from-sequence-coprime-not-numbers = лыдэз абу бӧрйӧма, сы вӧсна coprime оз лыддьысь

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations сетӧма, сы вӧсна coprime оз лыддьысь

## Resolving a `target`

target-not-found = `<{ $source }>` вылӧ абу веськыд target: мог эз аддзысь.

target-state-variable-not-found = `<{ $source }>` вылӧ абу веськыд target: `<{ $component }>` элементын «{ $property }» нима статус вежласян эз аддзысь.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` вежласянэзыс аскежса вежласянысь торъявны колӧ.

ode-system-duplicate-variable-names = Кывтысь вежласянэзлӧн нимэзыс выльысь лоӧны кӧ, ДТ веськыд бок функцияэзсӧ тӧдмавны оз позь.

ode-system-rhs-function-error = ДТ веськыд бок функциясӧ тӧдмавны оз позь. mathjs функциясӧ лӧсьӧдигӧн тшыкӧдчӧм.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } веськыд визь костса пельӧссӧ тӧдмавны оз позь

angle-invalid-through-point = `<angle>` элементлӧн through донйын абу веськыд пас

parabola-vertex-too-many-points = Сетӧм йывйӧн 1-ысь унджык пас пыр мунысь парабола абу вӧчӧма.

parabola-too-many-points = 3-ысь унджык пас пыр мунысь парабола абу вӧчӧма.

intersection-too-many-items = Кыкысь унджык объектлӧн вомӧнъялӧмыс абу вӧчӧма

## Other math components

ionic-compound-not-two-ions = Кык ионысь мукӧд ион йитӧдэз абу вӧчӧма.

ionic-compound-needs-cation-and-anion = Ион йитӧд ӧти катионлы да ӧти анионлы сӧмын вӧчӧма.

solve-equations-cannot-evaluate = Уравнениесӧ вӧчны оз позь, тайӧс вӧсна мый сийӧс лыддьыны эз артмы: { $equation }

math-operators-operand-number-required = Математическӧй операндсӧ торйӧдӧм вӧсна operandNumber сетны колӧ.

eigen-decomposition-failed = Матрицалысь ас донэзсӧ лыддьыны эз артмы

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр образецын оз паныдасьлы, сы вӧсна сийӧ пыр тыртӧмлы лӧсялӧ.
       *[other] `<matchesPattern>`: { $parameters } параметрэз образецын оз паныдасьлыны, сы вӧсна найӧ пыр тыртӧмлы лӧсялӧны.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" донсӧ гӧгӧрвоны оз позь. Сийӧ none, medium, dense либо тыртӧм инӧн торйӧдӧм кык плюс лыд лоны колӧ, шуам grid="1 0.5". Сетка оз серпасась.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure серпасалысьын xLabelPosition="left" абу вӧчӧма; веськыд бок пуктӧм вӧдитчӧ.

prefigure-y-label-position-unsupported = `<graph>`: prefigure серпасалысьын yLabelPosition="bottom" абу вӧчӧма; вылыс бок пуктӧм вӧдитчӧ.

prefigure-invalid-axis-bounds = `<graph>`: prefigure вуджӧдӧмлы тэльэзлӧн помэзыс абу веськыдӧсь; подув bbox (-10,-10,10,10) вӧдитчӧ.

prefigure-invalid-width = `<graph>`: prefigure вуджӧдӧмлы пасьтаыс абу веськыд; диаграммалӧн подув пасьтаыс 425 вӧдитчӧ.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure вуджӧдӧмлы aspectRatio абу веськыд; подув боклӧн йитӧдыс 1 вӧдитчӧ.

prefigure-grid-spacing-too-fine = `<graph>`: сеткалӧн воськовыс тэльэзлӧн помэзыслы зэв ичӧт; prefigure серпасалысьын сетка оз петкӧдчы.

prefigure-annotations-not-rendered = `<graph>`: PreFigure серпасалысь оз вӧдитчы кӧ, пасйӧдэз оз серпасасьны.

multiple-annotations-children = `<graph>` пытшкын уна `<annotations>` челядь аддзӧма; медбӧръяысь мукӧдэзыс оз лыддьысьны.

## Referring to other components

copy-unrecognized-component-type = Тӧдтӧм компонент ногсӧ паськӧдны либо копируйтны оз позь: { $type }.

copy-prop-not-found = { $component } нога компонентын { $property } свойство эз аддзысь

collect-no-source = collect вылӧ подув эз аддзысь.

collect-invalid-component-type = `<{ $component }>` нога компонентэзсӧ чукӧртны оз позь, тайӧс вӧсна мый тайӧ абу веськыд компонент ног.

reference-index-unavailable = `{ $reference }` индекс вылӧ йитӧд вӧчны оз позь

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентын { $action } корны оз позь

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Даннӧйэзлӧн ногыс абу веськыд. Визьэзлӧн кузьтаэзыс торъялӧны. Аддзӧма componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Даннӧйэзын юрбитанлӧн нимэзыс выльысь лоӧны. Аддзӧма componentIdx :{ $componentIdx }

data-frame-missing-column-name = Даннӧйэзын юрбитан ним оз тырмы. Аддзӧма componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Тайӧ вочакывлӧн award донйыс answer тегыслӧн ас мӧдӧдӧм вочакыв вылас пуксьӧ, тайӧ виччысьтӧм могэзӧ воштӧ.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` эма контейнер пытшкса `<answer>` вылӧ `maxNumAttempts` пуктӧм оз вӧч, тайӧс вӧсна мый видлӧмэзлысь лыдсӧ контейнерыс тӧдмалӧ. `maxNumAttempts` донсӧ контейнер вылӧ пукты.

nested-section-wide-check-work-max-num-attempts = Мӧд `sectionWideCheckWork` контейнер пытшкын сулалысь `sectionWideCheckWork` контейнер вылӧ `maxNumAttempts` пуктӧм оз вӧч, тайӧс вӧсна мый видлӧмэзлысь лыдсӧ ортсы контейнерыс тӧдмалӧ. `maxNumAttempts` донсӧ ортсы контейнер вылӧ пукты.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality абу пуктӧма кӧ, { $attributes } атрибут оз вӧч.
       *[other] symbolicEquality абу пуктӧма кӧ, { $attributes } атрибутэз оз вӧчны.
    }

answer-invalid-type = answer вылӧ абу веськыд ног: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентлӧн нимыс абу, сы вӧсна сийӧс модуль атрибут моз вӧдитчыны оз позь

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентсӧ модуль атрибут моз вӧдитчыны оз позь, тайӧс вӧсна мый `<module>` компонент ногын «{ $name }» атрибут нин тӧдмалӧма.

conditional-content-condition-ignored = case либо else челядьӧн `<conditionalContent>` компонентын `condition` атрибут оз лыддьысь.

slider-markers-type-mismatch = Маркерэзлӧн ногыс ползунокалӧн ногыслы оз лӧсяв.

pretzel-problem-needs-statement-and-answer = Абу веськыд pretzel: быд `<problem>` ӧти `<statement>` да ӧти `<answer>` пытшкас босьтны колӧ.

pretzel-circuit-first-problem-distractor = Абу веськыд pretzel: mode="circuit" режимын медводдза `<problem>` вниманиесӧ бокӧ нуысь лоны оз вермы.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибутлы абу веськыд дон { $values }; оз лыддьысь.
       *[other] `{ $attribute }` атрибутлы абу веськыд донэз { $values }; оз лыддьысьны.
    }

attribute-must-be-references = `{ $attribute }` атрибутлы абу веськыд дон `{ $value }`. Атрибут `$` пасысь заводитчысь йитӧдэзысь лоны колӧ.

math-input-invalid-function-names = <mathInput>: { $attribute } пытшкса абу веськыд функция нимэз эз лыддьысьны: { $names }. Быд нимлӧн тыдалана юкӧныс этша дырйи 2 шыпас лоны колӧ (шыпасэз либо визьэз); сы бӧрын колана абу `|<mathspeak альтернатива>` содтӧд воны вермас.

## Building components from the source

component-type-invalid = Абу веськыд компонент ног: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутсӧ выльысь вӧчны оз позь.

attribute-invalid-for-component = `<{ $componentType }>` нога компонентлы абу веськыд атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль тӧдмалӧмын { $context ->
        [text-on-background] текстлӧн рӧмыс да фонлӧн рӧмыс
        [high-contrast] ыджыд контраста рӧм да серпасалан ин
        [line] визьлӧн рӧмыс да серпасалан ин
        [marker] маркерлӧн рӧмыс да серпасалан ин
       *[text-on-canvas] текстлӧн рӧмыс да серпасалан ин
    } кост контрастыс оз тырмы{ $mode ->
        [dark] { " (пемыд ног)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; этша дырйи { $threshold }:1 колӧ).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль тӧдмалӧмын сетӧм рӧмэз югыд ноглы тырмымӧн контраст сетисны кӧ, налысь петӧм пемыд ног рӧмэз текст да фон кост тырмымӧн контраст оз сетны ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; этша дырйи { $threshold }:1 колӧ). { $suggestion ->
        [available] Пемыд ногын тырмымӧн контраст вӧсна югыд ноглысь контрастсӧ ыдждӧд (шуам { $lightAttribute }="{ $lightColor }"), либо пемыд ног рӧмсӧ веж (шуам { $darkAttribute }="{ $darkColor }").
       *[none] Пемыд ногын тырмымӧн контраст вӧсна югыд ноглысь контрастсӧ ыдждӧд либо петӧм рӧмэзсӧ textColorDarkMode да/либо backgroundColorDarkMode пыр веж.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль тӧдмалӧмын сетӧм текст рӧм югыд ноглы тырмымӧн контраст сетис кӧ, сылысь петӧм пемыд ног текст рӧм серпасалан инӧн тырмымӧн контраст оз сет ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; этша дырйи { $threshold }:1 колӧ). { $suggestion ->
        [available] Пемыд ногын тырмымӧн контраст вӧсна югыд ноглысь контрастсӧ ыдждӧд (шуам textColor="{ $lightColor }"), либо пемыд ног рӧмсӧ веж (шуам textColorDarkMode="{ $darkColor }").
       *[none] Пемыд ногын тырмымӧн контраст вӧсна югыд ноглысь контрастсӧ ыдждӧд либо петӧм рӧмсӧ textColorDarkMode пыр веж.
    }

section-multiple-style-palettes = Юкӧн ӧти сӧмын <stylePalette> бӧрйыны вермас; медбӧръяыс вӧдитчӧ.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } вылӧ выльысь лотӧм вариантэзсӧ тӧдмавны оз позь, тайӧс вӧсна мый numToSelect минус абу тыр лыд абу.

variant-num-to-select-not-constant-number = { $component } вылӧ выльысь лотӧм вариантэзсӧ тӧдмавны оз позь, тайӧс вӧсна мый numToSelect вежласьтӧм лыд абу.

variant-with-replacement-not-constant-boolean = { $component } вылӧ выльысь лотӧм вариантэзсӧ тӧдмавны оз позь, тайӧс вӧсна мый withReplacement вежласьтӧм логическӧй дон абу.

variant-select-weight-disables-unique = кутшӧмкӧ бӧрйӧмын selectWeight либо selectForVariants сетӧма кӧ, select вылӧ выльысь лотӧм вариантэз кусӧны

variant-coprime-undetermined = { $component } вылӧ выльысь лотӧм вариантэзсӧ тӧдмавны оз позь, тайӧс вӧсна мый coprime пыр абу веськыд-ӧ, сийӧс тӧдмавны оз позь.

variant-attribute-not-constant = { $component } вылӧ выльысь лотӧм вариантэзсӧ тӧдмавны оз позь, тайӧс вӧсна мый { $attribute } вежласьтӧм абу.

variant-attribute-not-number = { $component } вылӧ выльысь лотӧм вариантэзсӧ тӧдмавны оз позь, тайӧс вӧсна мый { $attribute } лыд абу.

variant-attribute-wrong-type-for-sequence =
    { $type } нога { $component } вылӧ выльысь лотӧм вариантэзсӧ тӧдмавны оз позь, тайӧс вӧсна мый { $attribute } { $expected ->
        [letters-combination] шыпасэзлӧн ӧтлаӧдӧм
        [math-expression] лӧсялана математическӧй висьталӧм
        [integer] тыр лыд
       *[number] лыд
    } абу.

variant-length-not-integer = { $component } вылӧ выльысь лотӧм вариантэзсӧ тӧдмавны оз позь, тайӧс вӧсна мый length тыр лыд абу.

variant-sort-not-implemented = sort эма { $component } вылӧ выльысь лотӧм вариантэз абу вӧчӧма

variant-exclude-combinations-not-implemented = excludeCombinations эма { $component } вылӧ выльысь лотӧм вариантэз абу вӧчӧма

variant-math-exclude-not-implemented = exclude эма math нога { $component } вылӧ выльысь лотӧм вариантэз абу вӧчӧма

variant-non-constant-exclude-not-implemented = вежласьтӧм абу exclude эма { $component } вылӧ выльысь лотӧм вариантэз абу вӧчӧма

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графиклӧн prefigure серпасалысьын абу вӧчӧма; выйӧдыс кольӧма.

prefigure-descendant-invalid-geometry = { $subject }: помтӧм либо тырмытӧм геометрия; выйӧдыс кольӧма.

prefigure-curve-label-omitted = { $subject }: вуджӧдӧм кусыня элементэзын пасэз абу вӧчӧма; пас кольӧма.

prefigure-curve-unsupported-definition-type = { $subject }: абу вӧчӧм кусыня функция тӧдмалӧмлӧн ногыс «{ $definitionType }»; выйӧдыс кольӧма.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементысь flipFunctions атрибут абу вӧчӧма; выйӧдыс кольӧма.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формулаӧн сетӧм челядь функцияэзсӧ сӧмын босьтӧ; выйӧдыс кольӧма.

prefigure-label-position-unsupported =
    { $subject }: абу вӧчӧм labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] визьэзлӧн котырыслӧн пасыслы
       *[point] паслӧн пасыслы
    }; PreFigure-лӧн подув ӧтлаӧдӧмыс вӧдитчӧ.

prefigure-fill-style-unsupported = { $subject }: тыртан стиль «{ $fillStyle }» PreFigure вылӧ абу вӧчӧма; тыр тыртӧмӧ вуджӧ.

prefigure-line-style-unknown = { $subject }: тӧдтӧм визь стиль «{ $lineStyle }» PreFigure петӧмысь бӧрйӧма.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер стиль «{ $markerStyle }» PreFigure «diamond» стильӧн лӧсьӧдӧма.

prefigure-marker-style-unsupported = { $subject }: маркер стиль «{ $markerStyle }» PreFigure вылӧ абу вӧчӧма; подув стиль вӧдитчӧ.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: абу веськыд `ref`; могсӧ йитны оз позь. Пасйӧд бӧрйӧма.

annotation-ref-multiple-targets = `<annotation>`: `ref` уна могӧн йитчис; медводдзаыс вӧдитчӧ.

annotation-ref-outside-graph = `<annotation>`: абу веськыд `ref`; мог сийӧс пытшкас босьтысь графикысь ортсыын. Пасйӧд бӧрйӧма.

annotation-ref-unsupported-target = `<annotation>`: абу веськыд `ref`; мог prefigure вуджӧдӧмын вӧчӧм график объект абу. Пасйӧд бӧрйӧма.

annotation-text-missing = `<annotation>`: `text` абу либо тыртӧм; тыртӧм текст петкӧдчӧ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Гӧгрӧс кывтӧм аддзӧма.
       *[other] `<{ $componentType }>` компонентсӧ пытшкас босьтысь гӧгрӧс кывтӧм аддзӧма.
    }

reference-no-referent = Йитӧдлы объект эз аддзысь: `{ $reference }`

reference-multiple-referents = Йитӧдлы уна объект аддзӧма: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементлӧн { $attribute } атрибутыслӧн форматыс абу веськыд.

children-invalid = `<{ $componentType }>` вылӧ абу веськыд челядь: абу веськыд челядь аддзӧма: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибутлы абу веськыд дон `{ $value }`; `{ $default }` дон вӧдитчӧ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версия эз аддзысь.
       *[other] DoenetML { $version } версия эз аддзысь. { $fallback } версия вӧдитчӧ
    }

## Reading the DoenetML

parse-invalid-doenetml = Абу веськыд DoenetML: { $content }

parse-tag-missing-close-tag = Абу веськыд DoenetML: `{ $tag }` теглӧн пӧдлалан тегыс абу. Ас пӧдласьысь тег либо `</{ $tagName }>` тег виччысьӧма.

parse-tag-error = Абу веськыд DoenetML: `<{ $tagName }>` тегын тшыкӧдчӧм

parse-attribute-missing-value = Абу веськыд DoenetML: `{ $attribute }` атрибутын дон оз тырмы кодь.

parse-attribute-invalid = Абу веськыд DoenetML: абу веськыд атрибут `{ $attribute }`

parse-attribute-value-invalid = Абу веськыд DoenetML: атрибутлӧн абу веськыд донйыс `{ $value }`

parse-attribute-value-quote-mismatch = Абу веськыд DoenetML: атрибутлӧн абу веськыд донйыс `{ $value }`. Кавычкаэз оз лӧсявны. `{ $quote }` оз тырмы кодь

parse-open-tag-name-missing = Абу веськыд DoenetML: нимтӧм тег аддзӧма, шуам `<`

parse-tag-not-closed = Абу веськыд DoenetML: `{ $tag }` тег абу пӧдлалӧма (`>` оз тырмы кодь).

parse-self-closing-tag-name-missing = Абу веськыд DoenetML: нимтӧм тег аддзӧма `<{ $content }>`

parse-self-closing-tag-not-closed = Абу веськыд DoenetML: `{ $tag }` тег абу пӧдлалӧма (`/>` оз тырмы кодь).

parse-tag-invalid-attributes = Абу веськыд DoenetML: `{ $tag }` тег лӧсялана абу. Сылӧн атрибутэзыс абу веськыдӧсь лоны вермасны.

parse-close-tag-name-missing = Абу веськыд DoenetML: нимтӧм пӧдлалан тег аддзӧма, шуам `</`

parse-attribute-value-unquoted = Атрибутлӧн донэзыс кавычка пытшкын лоны колӧ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Абу веськыд DoenetML: `{ $tag }` пӧдлалан тег аддзӧма, но сылы лӧсялана восьтан тег абу

parse-close-tag-mismatched = Абу веськыд DoenetML: оз лӧсяв пӧдлалан тег. `</{ $expected }>` виччысьӧма. `{ $found }` аддзӧма

parser-node-unconvertible = { $node } узелсӧ Dast узелӧ вуджӧдны эз артмы.

## Names

name-attribute-invalid =
    Абу веськыд атрибут name='{ $name }'. { $reason ->
        [characters] Нимэзын шыпасэз, лыдэз, улыс визьэз либо визьэз сӧмын лоны вермасны.
       *[start] Нимэз шыпасысь заводитчыны колӧ.
    }

component-name-invalid-start = Абу веськыд компонент ним «{ $name }». Нимэз шыпасысь заводитчыны колӧ.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched нога answer-лӧн video атрибутыс лоны колӧ

answer-video-watched-video-not-reference = videoWatched нога answer-лӧн video атрибутыс йитӧд лоны колӧ

answer-name-not-single-text = answer-лӧн name атрибутын дзик ӧти текст челядь лоны колӧ

## Referencing another document

external-doenetml-recursion-limit = Рекурсиялӧн тшупӧдэзыс зэв уна, сы вӧсна ортсы DoenetML босьтны эз артмы. Гӧгрӧс йитӧд абу-ӧ?

external-doenetml-unavailable = { $attribute }="{ $uri }" адресысь DoenetML босьтны эз артмы

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адресысь абу веськыд DoenetML босьтӧма: сийӧ «{ $componentType }» компонент ноглы эз лӧсяв

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут важмис; сы пыдди `{ $to }` вӧдитчы.
       *[other] [deprecation] `<{ $component }>` элементысь `{ $from }` атрибут важмис; сы пыдди `{ $to }` вӧдитчы.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут важмис да оз лыддьысь, тайӧс вӧсна мый `{ $to }` тшӧтш сетӧма.
       *[other] [deprecation] `<{ $component }>` элементысь `{ $from }` атрибут важмис да оз лыддьысь, тайӧс вӧсна мый `{ $to }` тшӧтш сетӧма.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементысь `{ $attribute }` атрибут важмис да оз лыддьысь.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элементысь `{ $attribute }` атрибут важмис; сы пыдди `<{ $child }>` челядьӧн вӧдитчы.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элементысь `{ $attribute }` атрибутлӧн `{ $value }` донйыс важмис; сы пыдди `{ $to }` вӧдитчы.


## Language coverage

pluralize-english-only = `<pluralize>` уна лыдсӧ англия кыв вылын сӧмын вермас вӧчны, сы вӧсна { $locale } кыв вылын гижӧм документын сылӧн текстыс вежсьытӧг колӧ. Уна лыд формасӧ асьыд гиж либо сийӧс `pluralForm` атрибутӧн сет.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент тӧдса Doenet элемент абу.

schema-element-not-allowed-at-root = `<{ $tag }>` элементлы документлӧн вужйын позянлун оз сетсьы.

schema-element-not-allowed-inside = `<{ $tag }>` элементлы `<{ $parent }>` пытшкын позянлун оз сетсьы.

schema-attribute-unrecognized = `<{ $tag }>` элементын `{ $attribute }` нима атрибут абу.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементлӧн `{ $attribute }` атрибутыс быд элементыс тайӧэзысь ӧти лоан список лоны колӧ: { $allowed }
       *[other] `<{ $tag }>` элементлӧн `{ $attribute }` атрибутыс тайӧэзысь ӧти лоны колӧ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select вылӧ абу веськыд вариант ним. { $variantName } вариант ним { $numOptions } бӧрйӧмын паныдасьлӧ, а бӧрйан лыдыс { $numToSelect }.

select-variant-name-without-options = select вылӧ вариантэз сетӧма, но позяна вариант нимлы ӧти бӧрйӧм абу: { $variantName }.

select-variant-name-not-possible = select вылӧ сетӧм { $variantName } вариант ним позяна вариант ним абу.

select-too-few-options = Ставыс { $numOptions } пиысь { $numToSelect } компонент бӧрйыны оз позь.

select-from-sequence-too-few-values = Кузьтаыс { $length } радысь { $numToSelect } дон бӧрйыны оз позь.

select-from-sequence-indices-count-mismatch = select вылӧ сетӧм индексэзлӧн лыдыс бӧрйан лыдлы лӧсявны колӧ

select-from-sequence-indices-not-integers = select вылӧ сетӧм став индексэз тыр лыд лоны колӧ

select-from-sequence-index-excluded = selectfromsequence вылӧ сетӧм индекс бӧрйӧма вӧли

select-from-sequence-indices-excluded-combination = selectfromsequence вылӧ сетӧм индексэз бӧрйӧм ӧтлаӧдӧм вӧли

select-from-sequence-coprime-not-positive-integers = Плюс тыр лыдэз абу бӧрйӧма, сы вӧсна ӧта-мӧдлы прӧстӧй ӧтлаӧдӧмэзсӧ бӧрйыны оз позь.

select-from-sequence-coprime-common-factor = Ӧта-мӧдлы прӧстӧй лыдэзсӧ бӧрйыны оз позь. Став позяна донэзлӧн ӧтув юклысьыс эм. (Сетӧм "from" либо "to" донэз "step"-кӧд ӧта-мӧдлы прӧстӧй лоны колӧ.)

select-from-sequence-coprime-single-number = 1 абу ӧти лыдысь ӧта-мӧдлы прӧстӧй ӧтлаӧдӧмэзсӧ бӧрйыны оз позь.

select-from-sequence-excluded-too-many-combinations = selectFromSequence пытшкын ӧтлаӧдӧмэзлӧн 70%-ысь унджыкыс бӧрйӧма

select-from-sequence-coprime-none-found = Ӧта-мӧдлы прӧстӧй лыдэзсӧ бӧрйыны эз артмы. Став позяна донэзлӧн ӧтув юклысьыс эм.

select-from-sequence-too-few-unique-values = Кузьтаыс { $numPossibleValues } радысь { $numToSelect } торъялана дон бӧрйыны оз позь

select-prime-numbers-too-few-values = Кузьтаыс { $numValues } прӧстӧй лыдэз списокысь { $numToSelect } дон бӧрйыны оз позь

select-prime-numbers-values-count-mismatch = select вылӧ сетӧм донэзлӧн лыдыс бӧрйан лыдлы лӧсявны колӧ

select-prime-numbers-values-not-prime = select prime number вылӧ сетӧм став донэз прӧстӧй лыдэз списокын лоны колӧ

select-prime-numbers-values-excluded-combination = selectPrimeNumbers вылӧ сетӧм донэз бӧрйӧм ӧтлаӧдӧм вӧли

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers пытшкын ӧтлаӧдӧмэзлӧн 70%-ысь унджыкыс бӧрйӧма

select-random-combination-fluke = Зэв позьтӧм лоӧм вӧсна сяма донэзлысь ӧтлаӧдӧмсӧ бӧрйыны эз артмы

select-random-value-fluke = Зэв позьтӧм лоӧм вӧсна сяма донсӧ бӧрйыны эз артмы

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` вылӧ колӧ функция, кӧни { $expected ->
        [one] ӧти петӧм, быд пас вылын мыгӧр y', шуам `y - x`
       *[other] кык петӧм, быд пас вылын вектор, шуам `(y, -x)`
    }, но сетӧм функцияын { $found ->
        [one] { $found } петӧм
       *[other] { $found } петӧм
    } эм. { $alternative ->
        [none] Немтор оз серпасась.
       *[other] Сэтшӧм функциялы `<{ $alternative }>` компонент лӧсялӧ. Немтор оз серпасась.
    }

field-function-attribute-ignored-with-child = `function` атрибут оз лыддьысь, тайӧс вӧсна мый функциясӧ компонент пытшкын тшӧтш сетӧма; пытшкӧсаыс вӧдитчӧ. Функциясӧ кыкысь абу, ӧтиысь сет.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибут компонент пытшкын веськыда гижӧм висьталӧмлысь вежласянэзсӧ нимтӧ. { $reason ->
        [function-child] Тани функциясӧ `<function>` челядьӧн сетӧма, а сийӧ ас вежласянэзсӧ нимтӧ, сы вӧсна `variables` оз лыддьысь.
       *[no-expression] Сэтшӧм висьталӧм тани абу сетӧма, сы вӧсна `variables` оз лыддьысь.
    }
