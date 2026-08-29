# Avar diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Avar (авар мацӀ) in the Cyrillic orthography with the palochka Ӏ, which is a
# letter of the alphabet rather than a Latin I or a digit 1.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Avar counts in two plural categories, `one` and `other`, so every count
# selection keeps the shape English gave it. A noun after a numeral stays
# singular in Avar, so a pair of branches often differs in nothing but the
# number it prints; that is the language rather than an unfinished translation.
#
# Nothing in this file agrees with a noun class. Avar's class agreement is
# real — a suffix -в, -й, -б or -л on the agreeing word — but it needs a noun
# the catalog itself supplies, and what these messages describe is the author's
# own document. `content.ftl` is where the class system is written out, and its
# header is where the reason this seed forks nothing is argued.
#
# The technical vocabulary is the Russian one written Avar uses for it —
# «компонент», «атрибут», «функция», «индекс», «последовательность»,
# «переменная», «матрица», «контраст» — because mathematics and computing in
# Dagestan are taught and written in Russian. Where Avar has an everyday word
# that carries the meaning it is used instead: «мухъ» a line, «тӀанкӀ» a point,
# «цӀар» a name, «къимат» a value, «гъалатӀ» an error.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] кӀиго рагӀалаб тӀанкӀ бихьизабуни { $attributes } хӀисабалде босуларо
       *[other] кӀиго рагӀалаб тӀанкӀ бихьизабуни { $attributes } хӀисабалде росуларо
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] рагӀалаб тӀанкӀги гьоркьохъеб тӀанкӀги цадахъ бихьизаруни { $attributes } хӀисабалде босуларо
       *[other] рагӀалаб тӀанкӀги гьоркьохъеб тӀанкӀги цадахъ бихьизаруни { $attributes } хӀисабалде росуларо
    }

line-segment-midpoint-offset-without-midpoint = гьоркьохъеб тӀанкӀ гьечӀого midpointOffset хӀалтӀуларо

## `<line>`

line-points-undetermined-dimensions = Барам лъачӀел тӀанкӀаздасан унеб мухъ.

line-points-too-few-dimensions = Мухъ камизе гьечӀого кӀиго барам бугел тӀанкӀаздасан ине ккола.

line-points-depend-on-variables = Мухъ гьал переменнаязде мугъчӀвараб тӀанкӀаздасан унеб буго: { $variables }.

line-equation-invalid-format = { $variable1 } ва { $variable2 } абурал переменнаязулаб мухъил уравнениялъул формат мекъаб буго.

## `<ray>`

ray-overprescribed-through = Луч through, endpoint ва direction гьаруна бихьизабун.  Бихьизабураб through хӀисабалде босуларо.

ray-dimension-mismatch = лучалда numDimensions данде ккола гьечӀо.

## `<vector>`

vector-overprescribed-head = Вектор head, tail ва displacement гьаруна бихьизабун.  Бихьизабураб head хӀисабалде босуларо.

vector-dimension-mismatch = векторалда numDimensions данде ккола гьечӀо.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` абуралде цӀазе кӀоларо, гьелъул nearestPoint абураб хӀалалъул переменная гьечӀолъиялъ.

constrain-to-without-nearest-point = `<{ $component }>` абуралда гӀорхъи лъезе кӀоларо, гьелъул nearestPoint абураб хӀалалъул переменная гьечӀолъиялъ.

constrain-to-interior-without-nearest-point = `<{ $component }>` абуралъул жаниб гӀорхъи лъезе кӀоларо, гьелъул nearestPoint абураб хӀалалъул переменная гьечӀолъиялъ.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition инлайн гуреб choiceInput-алъе хӀисабалде босуларо

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-алъе бихьизарурал индексал хӀисабалде росуларо, гьезул къадар лъималазул къадаралда данде кколеб гьечӀолъиялъ.

pretzel-indices-count-mismatch = масъалаялъе бихьизарурал индексал хӀисабалде росуларо, гьезул къадар масъалаялъул лъималазул къадаралда данде кколеб гьечӀолъиялъ.

shuffle-indices-count-mismatch = shuffle-алъе бихьизарурал индексал хӀисабалде росуларо, гьезул къадар компонентазул къадаралда данде кколеб гьечӀолъиялъ.

indices-ignored-out-of-range = { $component } абуралъе бихьизарурал индексал хӀисабалде росуларо, цоцаязул гӀорхъабаздаса къватӀир рахъиналъ.

pretzel-indices-repeated = pretzel-алъе бихьизарурал индексал хӀисабалде росуларо, цоцаял такрар гьаруналъ.

pretzel-circuit-first-index = circuit режималда pretzel-алъе бихьизарурал индексал хӀисабалде росуларо, тӀоцебесеб индекс 1 букӀине кколелъиялъ.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` строкаязул лъималаздалъун хӀалтӀизе, `type` абураб атрибут бихьизабизе ккола.

invalid-type-defaulting-to-math = { $component } абураб компонентазе { $type } абураб тайпа мекъаб буго. math, text, number яги boolean букӀине ккола. math лъола.

string-not-valid-component-to-arrange = "{ $value }" абураб строка { $component } гьабизе бегьулеб компонент гуро. ХӀисабалде босуларо.

## Types and variables

invalid-type-defaulting-to-number = { $type } абураб тайпа мекъаб буго, тайпа number лъола.

invalid-variable-value = Переменнаялъул мекъаб къимат: `{ $value }`

## Variants

variant-index-must-be-number = { $index } абураб вариантасул индекс число букӀине ккола

variant-index-must-be-integer = { $index } абураб вариантасул индекс бегӀераб число букӀине ккола

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолютал барамазе гьабун гьечӀо. Гьоркьохъал барамал относителяллъун рахъулел руго.

side-by-side-absolute-margins = `<{ $component }>` абсолютал барамазе гьабун гьечӀо. РагӀалал относителяллъун рахъулел руго.

side-by-side-no-block-child = Мекъаб `<{ $component }>`: гьелъул камизе гьечӀого цо блокияб лъимер букӀине ккола.

## `<label>`

label-for-ignored-on-graphical = Графикияб `<label>` абуралда `for` абураб атрибут хӀисабалде босуларо.

label-for-must-resolve-to-one = `<label>` абуралда бугеб `for` абураб атрибут цо компоненталде бачине ккола.

label-for-unresolved = `<label>` абуралда бугеб `for` абураб атрибут компоненталде бачине кӀвечӀо.

label-for-answer-with-authored-inputs = `<label>` абуралда бугеб `for` абураб атрибуталъ хӀаракатчиясул хъварал инпутал ругеб `<answer>` абуралде ссылка гьабула; инпуталде битӀун ссылка гьабе.

label-for-answer-without-input = `<label>` абуралда бугеб `for` абураб атрибуталъ цӀар кьезе инпут гьечӀеб `<answer>` абуралде ссылка гьабула.

label-for-must-reference-input-or-answer = `<label>` абуралда бугеб `for` абураб атрибуталъ инпуталде яги жавабалде ссылка гьабизе ккола.

## Accessibility

accessibility-short-description-or-decorative = Щвезабиялъе `<{ $component }>` абуралъе яги къокъаб баян букӀине ккола, яги гьеб декоративаблъун бихьизабизе ккола.

accessibility-video-short-description = Щвезабиялъе `<video>` абуралъе къокъаб баян букӀине ккола.

accessibility-input-short-description-or-label = Щвезабиялъе `<{ $component }>` абуралъе къокъаб баян яги цӀар букӀине ккола.

accessibility-answer-input-short-description-or-label = Щвезабиялъе инпут гьабулеб `<answer>` абуралъе къокъаб баян яги цӀар букӀине ккола.

accessibility-short-description-contains-math = Къокъал баяназда `<{ $component }>` гӀадал математикиял компонентал рукӀине бегьуларо. Математика рагӀабаздалъун хъвае.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } абуралъул контраст бетӀералъул текстазе гӀоларо (чӀегӀераб режим) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; камизе гьечӀого { $threshold }:1 ккола).
       *[other] { $colorName } абуралъул контраст бетӀералъул текстазе гӀоларо ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; камизе гьечӀого { $threshold }:1 ккола).
    }

## `<circle>`

circle-through-points-non-numerical = { $count } тӀанкӀалдасан унеб `<circle>` гьабизе гьабун гьечӀо тӀанкӀаздаса числоязулал къиматал гьечӀеб мехалъ.

circle-too-many-through-points = Лъабгоялдаса цӀикӀкӀарал тӀанкӀаздасан унеб круг хӀисабизе кӀоларо.

circle-overprescribed-radius-center-points = Бихьизабураб радиус, бакьулъ ва тӀанкӀал цадахъ ругеб круг хӀисабизе кӀоларо.

circle-center-with-multiple-points = Бихьизабураб бакьулъ бугеб круг цоялдаса цӀикӀкӀарал тӀанкӀаздасан хӀисабизе кӀоларо.

circle-radius-too-small = Круг хӀисабизе кӀоларо: кӀиго тӀанкӀалда гьоркьоб манзил { $distance } бугеб мехалъ, бихьизабураб { $radius } абураб радиус гьитӀинаб буго.

circle-radius-with-many-points = Бихьизабураб радиус бугеб круг кӀиго тӀанкӀалдаса цӀикӀкӀарал тӀанкӀаздасан гьабизе кӀоларо.

circle-invalid-center-or-through-points = Кругалъул бакьулъ яги тӀанкӀал мекъал руго.

circle-radius-center-with-multiple-points = Бихьизабураб бакьулъ бугеб кругалъул радиус цоялдаса цӀикӀкӀарал тӀанкӀаздасан хӀисабизе кӀоларо.

circle-change-radius-non-numerical = Числоязулал къиматал гьечӀел тӀанкӀаздасан унеб кругалъул радиус хисизе кӀоларо

circle-radius-with-points-non-numerical = Числоязулал къиматал гьечӀеб мехалъ бихьизабураб радиусалдалъун цоялдаса цӀикӀкӀарал тӀанкӀаздасан унеб круг гьабизе кӀоларо.

circle-change-center-non-numerical = Числоязулал къиматал гьечӀел тӀанкӀаздасан унеб кругалъул бакьулъ хисизе гьабун гьечӀо.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функциялъул областалъе барамал гӀоларо. Областалда { $intervals } интервал буго, амма функциялда { $inputs ->
            [one] { $inputs } инпут
           *[other] { $inputs } инпут
        } буго.
       *[other] Функциялъул областалъе барамал гӀоларо. Областалда { $intervals } интервал буго, амма функциялда { $inputs ->
            [one] { $inputs } инпут
           *[other] { $inputs } инпут
        } буго.
    }

function-domain-invalid-format = Функциялъул областалъул формат мекъаб буго.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функциялъул числоялъулаб гуреб максимум хӀисабалде босуларо.
        [minimum] Функциялъул числоялъулаб гуреб минимум хӀисабалде босуларо.
        [extremum] Функциялъул числоялъулаб гуреб экстремум хӀисабалде босуларо.
        [point] Функциялъул числоялъулаб гуреб тӀанкӀ хӀисабалде босуларо.
        [slope] Функциялъул числоялъулаб гуреб наклон хӀисабалде босуларо.
       *[other] Функциялъул числоялъулаб гуреб { $type } хӀисабалде босуларо.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функциялъул чӀобогояб максимум хӀисабалде босуларо.
        [minimum] Функциялъул чӀобогояб минимум хӀисабалде босуларо.
        [extremum] Функциялъул чӀобогояб экстремум хӀисабалде босуларо.
        [point] Функциялъул чӀобогояб тӀанкӀ хӀисабалде босуларо.
       *[other] Функциялъул чӀобогояб { $type } хӀисабалде босуларо.
    }

function-points-too-close = Функциялда цоцазде гӀагарлъун ругел кӀиго тӀанкӀ буго. Функция бихьизабизе кӀоларо.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функциялъул итерацияби гьаризе бегьула инпутазул къадар аутпутазул къадаралда данде ккараб мехалъ гурони гьечӀо. Гьаб функциялда { $inputs } инпут ва { $outputs ->
            [one] { $outputs } аутпут
           *[other] { $outputs } аутпут
        } буго.
       *[other] Функциялъул итерацияби гьаризе бегьула инпутазул къадар аутпутазул къадаралда данде ккараб мехалъ гурони гьечӀо. Гьаб функциялда { $inputs } инпут ва { $outputs ->
            [one] { $outputs } аутпут
           *[other] { $outputs } аутпут
        } буго.
    }

## `<sequence>`

sequence-invalid-length = Последовательностасул барам мекъаб буго.  Нулалдаса гъоркье гьечӀеб бегӀераб число букӀине ккола.

sequence-invalid-step = Последовательностасул шаг мекъаб буго.  { $type } тайпаялъул последовательностасе число букӀине ккола.

sequence-invalid-endpoint-number = Числоязул последовательностасул "{ $attribute }" мекъаб буго.  Число букӀине ккола.

sequence-invalid-endpoint-letters = ХӀарпазул последовательностасул "{ $attribute }" мекъаб буго.  ХӀарпазул цолъи букӀине ккола.

sequence-invalid-endpoint = Последовательностасул "{ $attribute }" мекъаб буго.

select-from-sequence-coprime-not-numbers = числоял тӀаса рищулел гьечӀолъиялъ coprime хӀисабалде босуларо

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations бихьизабуралъ coprime хӀисабалде босуларо

## Resolving a `target`

target-not-found = `<{ $source }>` абуралъул target мекъаб буго: target батичӀо.

target-state-variable-not-found = `<{ $source }>` абуралъул target мекъаб буго: `<{ $component }>` абуралда "{ $property }" абураб цӀар бугеб хӀалалъул переменная батичӀо.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` абуралъул переменнаял мустакъилаб переменнаялдаса батӀиял рукӀине ккола.

ode-system-duplicate-variable-names = Такрар гьарурал переменнаязул цӀараздалъун ОДУ-ялъул рахъалъулал функцияби бихьизаризе кӀоларо.

ode-system-rhs-function-error = ОДУ-ялъул рахъалъулаб функция бихьизабизе кӀоларо.  mathjs функция гьабулаго гъалатӀ ккана.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } мухъалда гьоркьоб угол бихьизабизе кӀоларо

angle-invalid-through-point = `<angle>` абуралъул through абуралда мекъаб тӀанкӀ буго

parabola-vertex-too-many-points = Вершина бугеб парабола цоялдаса цӀикӀкӀарал тӀанкӀаздасан гьабун гьечӀо.

parabola-too-many-points = Лъабгоялдаса цӀикӀкӀарал тӀанкӀаздасан унеб парабола гьабун гьечӀо.

intersection-too-many-items = КӀиго жоялдаса цӀикӀкӀарал жалазе пересечение гьабун гьечӀо

## Other math components

ionic-compound-not-two-ions = КӀиго ион гуреб цогидаб жоялъе ионияб цолъи гьабун гьечӀо.

ionic-compound-needs-cation-and-anion = Ионияб цолъи цо катионалъеги цо анионалъеги гурони гьабун гьечӀо.

solve-equations-cannot-evaluate = Уравнение хӀисабизе кӀвечӀолъиялъ гьеб бахъизе кӀоларо: { $equation }

math-operators-operand-number-required = Математикияб операнд бахъулаго operandNumber бихьизабизе ккола.

eigen-decomposition-failed = Матрицаялъул собственниял къиматал хӀисаризе кӀвечӀо

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } абураб параметр паттерналда гьечӀо, гьелъ киданиги чӀобогояб бакӀ гурони батуларо.
       *[other] `<matchesPattern>`: { $parameters } абурал параметрал паттерналда гьечӀо, гьез киданиги чӀобогояб бакӀ гурони батуларо.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" бичӀчӀизе кӀоларо. Гьеб none, medium, dense яги пробелалъ ратӀа гьарурал кӀиго позитивияб число букӀине ккола, масала grid="1 0.5". Сетка бахъуларо.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` абуралъе { $expected ->
        [one] цо аутпут бугеб функция ккола, гьеб щибаб тӀанкӀалда бугеб y' наклон буго, масала `y - x`
       *[other] кӀиго аутпут бугеб функция ккола, гьеб щибаб тӀанкӀалда бугеб вектор буго, масала `(y, -x)`
    }, амма кьураб функциялда { $found ->
        [one] { $found } аутпут
       *[other] { $found } аутпут
    } буго. { $alternative ->
        [none] Щибго бахъуларо.
       *[other] Гьеб функциялъе `<{ $alternative }>` ккола кколеб компонент. Щибго бахъуларо.
    }

field-function-attribute-ignored-with-child = `function` абураб атрибут хӀисабалде босуларо, щайгурелъул функция компоненталъул жанибги кьун буго; жанибгиялъ хӀалтӀула. Функция кӀиго къагӀидаялдаса цоялдалъун гурони кьуге.

field-variables-ignored =
    `<{ $component }>`: `variables` абураб атрибуталъ компоненталъул жаниб битӀун хъвараб выражениялъул переменнаязул цӀарал кьола. { $reason ->
        [function-child] Гьаниб функция `<function>` лъималлъун кьун буго, гьелъ жиндирго переменнаязул цӀарал кьола, гьелъин `variables` хӀисабалде босулареб.
       *[no-expression] Гьаниб гьедин выражение кьун гьечӀо, гьелъин `variables` хӀисабалде босулареб.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure рендерералда xLabelPosition="left" хӀалтӀуларо; right-позициялъул къагӀида хӀалтӀизабула.

prefigure-y-label-position-unsupported = `<graph>`: prefigure рендерералда yLabelPosition="bottom" хӀалтӀуларо; top-позициялъул къагӀида хӀалтӀизабула.

prefigure-invalid-axis-bounds = `<graph>`: prefigure гьабизе осалъул гӀорхъаби мекъал руго; стандартияб bbox (-10,-10,10,10) хӀалтӀизабула.

prefigure-invalid-width = `<graph>`: prefigure гьабизе гьоркьохъеб барам мекъаб буго; стандартияб 425 барам хӀалтӀизабула.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure гьабизе aspectRatio мекъаб буго; стандартияб 1 гьоркьохъеб бащалъи хӀалтӀизабула.

prefigure-grid-spacing-too-fine = `<graph>`: сеткаялъул гьоркьохъеб манзил осазул гӀорхъабазе бигьаго гьитӀинаб буго; prefigure рендерералда сетка бахъуларо.

prefigure-annotations-not-rendered = `<graph>`: PreFigure рендерер хӀалтӀизабичӀони аннотацияби бахъуларо.

multiple-annotations-children = `<graph>` абуралъул жаниб гӀемерал `<annotations>` лъимал ратана; ахирисеб гуреб киналго хӀисабалде росуларо.

## Referring to other components

copy-unrecognized-component-type = Лъаларедухъ бугеб компоненталъул тайпа хисизе яги копия гьабизе кӀоларо: { $type }.

copy-prop-not-found = { $component } тайпаялъул компоненталда { $property } абураб проп батичӀо

collect-no-source = collect-алъе источник батичӀо.

collect-invalid-component-type = `<{ $component }>` тайпаялъул компонентал ракӀаризе кӀоларо, гьеб мекъаб тайпа бугелъул.

reference-index-unavailable = `{ $reference }` абураб индексалде ссылка гьабизе кӀоларо

## `<callAction>`

component-action-unavailable = `{ $reference }` абураб компоненталда { $action } гьабизе кӀоларо

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Хазинаялъул шакл мекъаб буго.  Строкабазул барамал данде ккола гьечӀо. Батана componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Хазинаялда столбецазул цӀарал такрар гьарун руго.  Батана componentIdx :{ $componentIdx }

data-frame-missing-column-name = Хазинаялда цо столбецалъул цӀар гьечӀо.  Батана componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Гьаб жавабалъул award жиндирго битӀараб жавабалда мугъчӀвараб буго, гьелъ хӀисабалде босулареб къагӀидаялде бачина.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` бугеб контейнералъул жаниб бугеб `<answer>` абуралда `maxNumAttempts` лъуни хӀалтӀуларо, гӀужазул къадар контейнералъ бихьизабулелъул. `maxNumAttempts` контейнералда лъе.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` бугеб цогидаб контейнералъул жаниб бугеб `sectionWideCheckWork` бугеб контейнералда `maxNumAttempts` лъуни хӀалтӀуларо, гӀужазул къадар къватӀисеб контейнералъ бихьизабулелъул. `maxNumAttempts` къватӀисеб контейнералда лъе.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality лъечӀого { $attributes } абураб атрибут хӀалтӀуларо.
       *[other] symbolicEquality лъечӀого { $attributes } абурал атрибутал хӀалтӀуларо.
    }

answer-invalid-type = Жавабалъе мекъаб тайпа: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` абураб компоненталъе цӀар гьечӀолъиялъ, гьеб модулалъул атрибуталъе хӀалтӀизабизе кӀоларо

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` абураб компонент модулалъул атрибуталъе хӀалтӀизабизе кӀоларо, щайгурелъул `<module>` тайпаялда гьанжего "{ $name }" абураб атрибут буго.

conditional-content-condition-ignored = case яги else лъимал ругеб `<conditionalContent>` компоненталда `condition` абураб атрибут хӀисабалде босуларо.

slider-markers-type-mismatch = Маркеразул тайпа слайдералъул тайпаялда данде ккола гьечӀо.

pretzel-problem-needs-statement-and-answer = Мекъаб pretzel: щибаб `<problem>` абуралъул жаниб цо `<statement>` ва цо `<answer>` букӀине ккола.

pretzel-circuit-first-problem-distractor = Мекъаб pretzel: mode="circuit" бугеб мехалъ тӀоцебесеб `<problem>` дистрактор букӀине бегьуларо.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` абураб атрибуталъе { $values } абураб къимат мекъаб буго; хӀисабалде босуларо.
       *[other] `{ $attribute }` абураб атрибуталъе { $values } абурал къиматал мекъал руго; хӀисабалде росуларо.
    }

attribute-must-be-references = `{ $attribute }` абураб атрибуталъе `{ $value }` абураб къимат мекъаб буго. Атрибут `$` абуралдаса байбихьулел ссылкабаздаса гьабизе ккола.

math-input-invalid-function-names = <mathInput>: { $attribute } абуралда рарал мекъал функциязул цӀарал хӀисабалде росулел гьечӀо: { $names }. Щибаб цӀаралъул бихьулеб бутӀаялда камизе гьечӀого 2 хӀарп (хӀарпал яги дефисал) букӀине ккола; хадуб `|<mathspeak alternative>` абураб бутӀа бачине бегьула.

## Building components from the source

component-type-invalid = Мекъаб компоненталъул тайпа: `<{ $componentType }>`

attribute-repeated = { $attribute } абураб атрибут такрар гьабизе кӀоларо.

attribute-invalid-for-component = `<{ $componentType }>` тайпаялъул компоненталъе "{ $attribute }" абураб атрибут мекъаб буго.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } абураб стилалъул контраст { $context ->
        [text-on-background] текстазул кьералъе фоналъул кьералда данде
        [high-contrast] кӀудияб контрасталъул кьералъе холсталда данде
        [line] мухъил кьералъе холсталда данде
        [marker] маркералъул кьералъе холсталда данде
       *[text-on-canvas] текстазул кьералъе холсталда данде
    } гӀоларо{ $mode ->
        [dark] { " (чӀегӀераб режим)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; камизе гьечӀого { $threshold }:1 ккола).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } абураб стилалда бихьизарурал кьеразул гвангъараб режималъе гӀоларедухъ контраст бугониги, гьезул къиматаздаса бахъарал чӀегӀераб режималъул кьеразда текстазул кьералъе фоналъул кьералда данде контраст гӀоларо ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; камизе гьечӀого { $threshold }:1 ккола). { $suggestion ->
        [available] ЧӀегӀераб режималда контраст гӀезабизе, яги гвангъараб режималъул контраст цӀикӀкӀинабе (масала, { $lightAttribute }="{ $lightColor }" лъе), яги чӀегӀераб режималъул кьер хисе (масала, { $darkAttribute }="{ $darkColor }" лъе).
       *[none] ЧӀегӀераб режималда контраст гӀезабизе, гвангъараб режималъул контраст цӀикӀкӀинабе яги бахъарал кьерал textColorDarkMode ва/яги backgroundColorDarkMode абуразда хисе.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } абураб стилалда бихьизабураб текстазул кьералъе гвангъараб режималда гӀоларедухъ контраст бугониги, гьеб къиматалдаса бахъараб чӀегӀераб режималъул текстазул кьералъе холсталда данде контраст гӀоларо ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; камизе гьечӀого { $threshold }:1 ккола). { $suggestion ->
        [available] ЧӀегӀераб режималда контраст гӀезабизе, яги гвангъараб режималъул контраст цӀикӀкӀинабе (масала, textColor="{ $lightColor }" лъе), яги чӀегӀераб режималъул кьер хисе (масала, textColorDarkMode="{ $darkColor }" лъе).
       *[none] ЧӀегӀераб режималда контраст гӀезабизе, гвангъараб режималъул контраст цӀикӀкӀинабе яги бахъараб кьер textColorDarkMode абуралда хисе.
    }

section-multiple-style-palettes = БетӀералъе цо <stylePalette> гурони тӀаса бищизе кӀоларо; ахирисеб хӀалтӀизабула.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } абуралъул батӀиял вариантал бихьизаризе кӀоларо, numToSelect нулалдаса гъоркье гьечӀеб бегӀераб число гьечӀолъиялъ.

variant-num-to-select-not-constant-number = { $component } абуралъул батӀиял вариантал бихьизаризе кӀоларо, numToSelect константияб число гьечӀолъиялъ.

variant-with-replacement-not-constant-boolean = { $component } абуралъул батӀиял вариантал бихьизаризе кӀоларо, withReplacement константияб булев къимат гьечӀолъиялъ.

variant-select-weight-disables-unique = selectWeight яги selectForVariants бихьизабураб вариант бугони, select-алъе батӀиял вариантал хӀалтӀуларо

variant-coprime-undetermined = { $component } абуралъул батӀиял вариантал бихьизаризе кӀоларо, coprime киданиго мекъаб бугилан бихьизабизе кӀвечӀолъиялъ.

variant-attribute-not-constant = { $component } абуралъул батӀиял вариантал бихьизаризе кӀоларо, { $attribute } константа гьечӀолъиялъ.

variant-attribute-not-number = { $component } абуралъул батӀиял вариантал бихьизаризе кӀоларо, { $attribute } число гьечӀолъиялъ.

variant-attribute-wrong-type-for-sequence =
    { $type } тайпаялъул { $component } абуралъул батӀиял вариантал бихьизаризе кӀоларо, { $attribute } { $expected ->
        [letters-combination] хӀарпазул цолъи
        [math-expression] бегьулеб математикияб выражение
        [integer] бегӀераб число
       *[number] число
    } гьечӀолъиялъ.

variant-length-not-integer = { $component } абуралъул батӀиял вариантал бихьизаризе кӀоларо, length бегӀераб число гьечӀолъиялъ.

variant-sort-not-implemented = sort бугеб { $component } абуралъул батӀиял вариантал гьабун гьечӀо

variant-exclude-combinations-not-implemented = excludeCombinations бугеб { $component } абуралъул батӀиял вариантал гьабун гьечӀо

variant-math-exclude-not-implemented = exclude бугеб math тайпаялъул { $component } абуралъул батӀиял вариантал гьабун гьечӀо

variant-non-constant-exclude-not-implemented = константияб гуреб exclude бугеб { $component } абуралъул батӀиял вариантал гьабун гьечӀо

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графикалъул prefigure рендерералда хӀалтӀуларо; наслу тӀаса бита.

prefigure-descendant-invalid-geometry = { $subject }: гӀорхъи гьечӀеб яги лъугӀичӀеб геометрия; наслу тӀаса бита.

prefigure-curve-label-omitted = { $subject }: хисарал кривая элементазда цӀарал хӀалтӀуларо; цӀар тӀаса бита.

prefigure-curve-unsupported-definition-type = { $subject }: '{ $definitionType }' абураб кривая функция бихьизабиялъул тайпа хӀалтӀуларо; наслу тӀаса бита.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves абуралда flipFunctions абураб атрибут хӀалтӀуларо; наслу тӀаса бита.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves абуралда формулаялъул тайпаялъул лъимал гурони хӀалтӀуларо; наслу тӀаса бита.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] мухъазул тайпаялъул цӀаралъе
       *[point] тӀанкӀалъул цӀаралъе
    } '{ $labelPosition }' абураб labelPosition хӀалтӀуларо; PreFigure-ялъул стандартияб бащалъи хӀалтӀизабула.

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' абураб цӀезабиялъул стиль PreFigure-алда хӀалтӀуларо; цӀураб кьералде нахъбуссунеб буго.

prefigure-line-style-unknown = { $subject }: лъаларедухъ бугеб '{ $lineStyle }' абураб мухъил стиль PreFigure-алъул аутпуталдаса тӀаса бита.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' абураб маркералъул стиль PreFigure-алъул 'diamond' стилалде сунеб буго.

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' абураб маркералъул стиль PreFigure-алда хӀалтӀуларо; стандартияб стиль хӀалтӀизабула.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` мекъаб буго; жиндирго жоялде бачине кӀоларо. Аннотация тӀаса бита.

annotation-ref-multiple-targets = `<annotation>`: `ref` гӀемерал жалазде бачана; тӀоцебесеб жо хӀалтӀизабула.

annotation-ref-outside-graph = `<annotation>`: `ref` мекъаб буго; жо жанисеб графикалдаса къватӀиб буго. Аннотация тӀаса бита.

annotation-ref-unsupported-target = `<annotation>`: `ref` мекъаб буго; prefigure гьабулаго жо хӀалтӀулеб графикияб объект гуро. Аннотация тӀаса бита.

annotation-text-missing = `<annotation>`: `text` гьечӀо яги чӀобогояб буго; чӀобогояб текст бахъула.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Сверараб мугъчӀвай батана.
       *[other] `<{ $componentType }>` компонент бугеб сверараб мугъчӀвай батана.
    }

reference-no-referent = Ссылкаялъе жаваб кколеб жо батичӀо: `{ $reference }`

reference-multiple-referents = Ссылкаялъе жаваб кколел гӀемерал жал ратана: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` абуралъул { $attribute } абураб атрибуталъул формат мекъаб буго.

children-invalid = `<{ $componentType }>` абуралъе лъимал мекъал руго: мекъал лъимал ратана: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` абураб атрибуталъе `{ $value }` абураб къимат мекъаб буго, `{ $default }` абураб къимат хӀалтӀизабула

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версия батичӀо.
       *[other] DoenetML { $version } версия батичӀо. { $fallback } версиялде нахъбуссунеб буго
    }

## Reading the DoenetML

parse-invalid-doenetml = Мекъаб DoenetML: { $content }

parse-tag-missing-close-tag = Мекъаб DoenetML: `{ $tag }` абураб тегалъе къазабулеб тег гьечӀо. Жиндирго къазабулеб тег яги `</{ $tagName }>` тег ккола кколеб.

parse-tag-error = Мекъаб DoenetML: `<{ $tagName }>` абураб тегалда гъалатӀ буго

parse-attribute-missing-value = Мекъаб DoenetML: `{ $attribute }` абураб мекъаб атрибуталъе къимат камун бугилан бихьула.

parse-attribute-invalid = Мекъаб DoenetML: `{ $attribute }` абураб атрибут мекъаб буго

parse-attribute-value-invalid = Мекъаб DoenetML: `{ $value }` абураб атрибуталъул къимат мекъаб буго

parse-attribute-value-quote-mismatch = Мекъаб DoenetML: `{ $value }` абураб атрибуталъул къимат мекъаб буго. Кавычкаби данде ккола гьечӀо. Дуда `{ $quote }` камун бугилан бихьула

parse-open-tag-name-missing = Мекъаб DoenetML: цӀар гьечӀеб тег батана, масала `<`

parse-tag-not-closed = Мекъаб DoenetML: `{ $tag }` абураб тег къан гьечӀо (`>` камун бугилан бихьула).

parse-self-closing-tag-name-missing = Мекъаб DoenetML: цӀар гьечӀеб тег батана `<{ $content }>`

parse-self-closing-tag-not-closed = Мекъаб DoenetML: `{ $tag }` абураб тег къан гьечӀо (`/>` камун бугилан бихьула).

parse-tag-invalid-attributes = Мекъаб DoenetML: `{ $tag }` абураб тег мекъаб буго. Гьелъул атрибутал мекъал ратизе бегьула.

parse-close-tag-name-missing = Мекъаб DoenetML: цӀар гьечӀеб къазабулеб тег батана, масала `</`

parse-attribute-value-unquoted = Атрибутазул къиматал кавычкабазда жаниб рукӀине ккола: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Мекъаб DoenetML: `{ $tag }` абураб къазабулеб тег батана, амма гьелъие данде кколеб рагьулеб тег батичӀо

parse-close-tag-mismatched = Мекъаб DoenetML: къазабулеб тег данде ккола гьечӀо. `</{ $expected }>` ккола кколеб. Батана `{ $found }`

parser-node-unconvertible = { $node } абураб узел Dast узеллъун хисизе кӀвечӀо.

## Names

name-attribute-invalid =
    name='{ $name }' абураб атрибуталъул цӀар мекъаб буго. { $reason ->
        [characters] ЦӀаразда хӀарпал, числоял, гъоркьисел мухъалги дефисалги гурони рукӀине бегьуларо.
       *[start] ЦӀарал хӀарпалдаса байбихьизе ккола.
    }

component-name-invalid-start = "{ $name }" абураб компоненталъул цӀар мекъаб буго. ЦӀарал хӀарпалдаса байбихьизе ккола.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched тайпаялъул жавабалда video абураб атрибут букӀине ккола

answer-video-watched-video-not-reference = videoWatched тайпаялъул жавабалда бугеб video абураб атрибут ссылка букӀине ккола

answer-name-not-single-text = Жавабалъул name абураб атрибуталда цо текстияб лъимер букӀине ккола

## Referencing another document

external-doenetml-recursion-limit = ЦӀикӀкӀараб рекурсиялъул даражаби гьаруналъ къватӀисеб DoenetML босизе кӀвечӀо. Сверараб ссылка бугищ?

external-doenetml-unavailable = { $attribute }="{ $uri }" абуралдаса DoenetML босизе кӀвечӀо

external-doenetml-type-mismatch = { $attribute }="{ $uri }" абуралдаса босараб DoenetML мекъаб буго: гьеб "{ $componentType }" абураб компоненталъул тайпаялда данде ккечӀо

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` абураб атрибут хӀалтӀудаса бахъун буго; гьелъул бакӀалда `{ $to }` хӀалтӀизабе.
       *[other] [deprecation] `<{ $component }>` абуралда бугеб `{ $from }` абураб атрибут хӀалтӀудаса бахъун буго; гьелъул бакӀалда `{ $to }` хӀалтӀизабе.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` абураб атрибут хӀалтӀудаса бахъун буго ва хӀисабалде босуларо, щайгурелъул `{ $to }` гӀагги бихьизабун буго.
       *[other] [deprecation] `<{ $component }>` абуралда бугеб `{ $from }` абураб атрибут хӀалтӀудаса бахъун буго ва хӀисабалде босуларо, щайгурелъул `{ $to }` гӀагги бихьизабун буго.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` абуралда бугеб `{ $attribute }` абураб атрибут хӀалтӀудаса бахъун буго ва хӀисабалде босуларо.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` абуралда бугеб `{ $attribute }` абураб атрибут хӀалтӀудаса бахъун буго; гьелъул бакӀалда `<{ $child }>` абураб лъимер хъвае.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` абуралда бугеб `{ $attribute }` абураб атрибуталъул `{ $value }` абураб къимат хӀалтӀудаса бахъун буго; гьелъул бакӀалда `{ $to }` хӀалтӀизабе.


## Language coverage

pluralize-english-only = `<pluralize>` абуралъ ингилис мацӀалъул рагӀаби гурони гӀемерлъиялде рахъизе кӀоларо, гьелъин { $locale } мацӀалда хъвараб документалда текст хисичӀого тарав. ГӀемерлъиялъул форма жиндирго хъвае, яги `pluralForm` абураб атрибуталдалъун бихьизабе.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` абураб элемент Doenet-алъул лъалеб элемент гуро.

schema-element-not-allowed-at-root = `<{ $tag }>` абураб элемент документалъул кӀалтӀуялда букӀине бегьуларо.

schema-element-not-allowed-inside = `<{ $tag }>` абураб элемент `<{ $parent }>` абуралъул жаниб букӀине бегьуларо.

schema-attribute-unrecognized = `<{ $tag }>` абураб элементалда `{ $attribute }` абураб цӀар бугеб атрибут гьечӀо.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` абураб элементалъул `{ $attribute }` абураб атрибут список букӀине ккола, гьелъул щибаб бутӀа гьазда гьоркьоса цо букӀине ккола: { $allowed }
       *[other] `<{ $tag }>` абураб элементалъул `{ $attribute }` абураб атрибут гьазда гьоркьоса цо букӀине ккола: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select-алъе вариантасул цӀар мекъаб буго.  { $variantName } абураб вариантасул цӀар { $numOptions } вариантазда буго, амма тӀаса бищизе кколеб къадар { $numToSelect } буго.

select-variant-name-without-options = select-алъе цо-цо вариантал бихьизарун руго, амма { $variantName } абураб бегьулеб вариантасул цӀаралъе вариантал бихьизарун гьечӀо.

select-variant-name-not-possible = select-алъе бихьизабураб { $variantName } абураб вариантасул цӀар бегьулеб вариантасул цӀар гуро.

select-too-few-options = Гурони { $numOptions } бугеб мехалъ { $numToSelect } компонент тӀаса бищизе кӀоларо.

select-from-sequence-too-few-values = { $length } барам бугеб последовательносталдаса { $numToSelect } къимат тӀаса бищизе кӀоларо.

select-from-sequence-indices-count-mismatch = select-алъе бихьизарурал индексазул къадар тӀаса бищизе кколеб къадаралда данде ккезе ккола

select-from-sequence-indices-not-integers = select-алъе бихьизарурал киналго индексал бегӀерал числоял рукӀине ккола

select-from-sequence-index-excluded = selectfromsequence абуралъул къватӀибе бахъараб индекс бихьизабун буго

select-from-sequence-indices-excluded-combination = selectfromsequence абуралъул къватӀибе бахъараб цолъи кколел индексал бихьизарун руго

select-from-sequence-coprime-not-positive-integers = Позитивиял бегӀерал числоял тӀаса рищулел гьечӀолъиялъ coprime цолъаби тӀаса ришизе кӀоларо.

select-from-sequence-coprime-common-factor = Coprime числоял тӀаса ришизе кӀоларо. Киналго бегьулел къиматазда цого умумулаб множитель буго. ("from" яги "to" абуразул бихьизарурал къиматал "step" абуралда coprime рукӀине ккола.)

select-from-sequence-coprime-single-number = 1 гуреб цо числоялдаса coprime цолъаби тӀаса ришизе кӀоларо.

select-from-sequence-excluded-too-many-combinations = selectFromSequence абуралда цолъабазул 70%-ялдаса цӀикӀкӀараб къватӀибе бахъун буго

select-from-sequence-coprime-none-found = Coprime числоял тӀаса ришизе кӀвечӀо. Киналго бегьулел къиматазда цого умумулаб множитель буго.

select-from-sequence-too-few-unique-values = { $numPossibleValues } барам бугеб последовательносталдаса { $numToSelect } батӀияб къимат тӀаса бищизе кӀоларо

select-prime-numbers-too-few-values = { $numValues } барам бугеб простой числоязул списокалдаса { $numToSelect } къимат тӀаса бищизе кӀоларо

select-prime-numbers-values-count-mismatch = select-алъе бихьизарурал къиматазул къадар тӀаса бищизе кколеб къадаралда данде ккезе ккола

select-prime-numbers-values-not-prime = select prime number абуралъе бихьизарурал киналго къиматал простой числоязул списокалда рукӀине ккола

select-prime-numbers-values-excluded-combination = selectPrimeNumbers абуралъул къватӀибе бахъараб цолъи кколел къиматал бихьизарун руго

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers абуралда цолъабазул 70%-ялдаса цӀикӀкӀараб къватӀибе бахъун буго

select-random-combination-fluke = ЦӀакъго камуларедухъ ккараб ишалъ, случайниял къиматазул цолъи тӀаса бищизе кӀвечӀо

select-random-value-fluke = ЦӀакъго камуларедухъ ккараб ишалъ, случайнияб къимат тӀаса бищизе кӀвечӀо
