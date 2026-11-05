# Tabasaran diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Cyrillic orthography of the Tabasaran literary language. The
# palochka Ӏ is a letter, not a Latin I and not a digit 1 — «апӀуб»,
# «нукьтӀа» and «гъалатӀ» run through almost every line below and each of them
# depends on it.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language rather than prose and stay in
# English exactly as written, as does anything quoted back from the author's
# own source.
#
# Tabasaran counts in `one` and `other` and keeps a noun after a numeral in the
# singular, so the two branches of every count read alike. Nothing here forks
# on a noun class: Tabasaran's two classes ride on numerals, on the verb and on
# some pronouns, and `content.ftl`'s header explains why that keeps them out of
# these files.
#
# **No case ending is welded onto a placeable anywhere in this file, and that
# is what several of these sentences are shaped around.** Tabasaran has a very
# large case inventory and the ending's shape depends on the stem it lands on,
# so wherever English put a value next to a word that wanted a case, the ending
# went onto a noun this catalog writes instead: «компонентдиз»,
# «компонентдиинди» and «компонентдин» after `<{ $component }>`,
# «лишандиин» after a reference, «терефнаан» after a URI. That is the README's
# *name what the value is*, and it is why `attract-to-without-nearest-point`,
# `constrain-to-without-nearest-point`, `external-doenetml-unavailable` and the
# three `data-frame-*` messages are rephrased rather than translated in place —
# the last three end on the placeable outright, because a Tabasaran locative
# after `componentIdx :{ $componentIdx }` had nowhere safe to sit.
#
# The technical nouns are the Russian ones written Tabasaran technical prose
# uses — «компонент», «атрибут», «функция», «индекс», «переменная»,
# «последовательность» — since secondary mathematics in Dagestan is taught in
# Russian. The everyday verbs around them («гьисаба ккабхьуру дар» for *is
# ignored*, «апӀуз шулдар» for *cannot*, «гьеле мумкин дар» for *not
# implemented*, «герек ву» for *must*) are this seed's own consistent
# renderings and are the first thing a speaker should read.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] кьюб ахирин нукьтӀа улупнайиш { $attributes } гьисаба ккабхьуру дар
       *[other] кьюб ахирин нукьтӀа улупнайиш { $attributes } гьисаба ккабхьуру дар
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] ахирин нукьтӀа ва юкьван нукьтӀа улупнайиш { $attributes } гьисаба ккабхьуру дар
       *[other] ахирин нукьтӀа ва юкьван нукьтӀа улупнайиш { $attributes } гьисаба ккабхьуру дар
    }

line-segment-midpoint-offset-without-midpoint = юкьван нукьтӀа адарди midpointOffset тӀаьсир апӀуру дар

## `<line>`

line-points-undetermined-dimensions = Тайин дару измеренйир айи нукьтӀйириан гъябгъру дюз цӀар.

line-points-too-few-dimensions = Дюз цӀар кьюбдихьан кем дару измеренйир айи нукьтӀйириан гъябгъуб герек ву.

line-points-depend-on-variables = Дюз цӀар переменнйириин аслу вуйи нукьтӀйириан гъябгъюра: { $variables }.

line-equation-invalid-format = { $variable1 } ва { $variable2 } переменнйириъ дюз цӀарин уравненийин формат дюз дар.

## `<ray>`

ray-overprescribed-through = Нур through, endpoint ва direction лишнариинди тайин апӀна.  Улупу through гьисаба ккабхьуру дар.

ray-dimension-mismatch = Нуриъ numDimensions уйгъун дар.

## `<vector>`

vector-overprescribed-head = Вектор head, tail ва displacement лишнариинди тайин апӀна.  Улупу head гьисаба ккабхьуру дар.

vector-dimension-mismatch = Векториъ numDimensions уйгъун дар.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` компонентдиз жалб апӀуз шулдар: думуъ nearestPoint гьалин дегишлу адар.

constrain-to-without-nearest-point = `<{ $component }>` компонентдиинди сергьятламиш апӀуз шулдар: думуъ nearestPoint гьалин дегишлу адар.

constrain-to-interior-without-nearest-point = `<{ $component }>` компонентдин ичӀ пайиинди сергьятламиш апӀуз шулдар: думуъ nearestPoint гьалин дегишлу адар.

## `<choiceInput>`

choice-input-label-position-ignored = инлайн дару choiceInput бадали labelPosition гьисаба ккабхьуру дар

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput бадали улупу индексар гьисаба ккабхьуру дар: индексарин кьадар choice элементарин кьадариз уйгъун дар.

pretzel-indices-count-mismatch = problem бадали улупу индексар гьисаба ккабхьуру дар: индексарин кьадар problem элементарин кьадариз уйгъун дар.

shuffle-indices-count-mismatch = shuffle бадали улупу индексар гьисаба ккабхьуру дар: индексарин кьадар компонентарин кьадариз уйгъун дар.

indices-ignored-out-of-range = { $component } бадали улупу индексар гьисаба ккабхьуру дар: бязи индексар сергьятдиан адагъу ву.

pretzel-indices-repeated = pretzel бадали улупу индексар гьисаба ккабхьуру дар: бязи индексар тикрар шула.

pretzel-circuit-first-index = mode="circuit" вуйи pretzel бадали улупу индексар гьисаба ккабхьуру дар: сифтени индекс 1 вуйи герек ву.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` строкйин элементарихъди лихуз `type` атрибут улупуб герек ву.

invalid-type-defaulting-to-math = { $component } компонент бадали { $type } жюре дюз дар. Думу math, text, number ва я boolean хьуб герек ву. math гъадабгъна.

string-not-valid-component-to-arrange = "{ $value }" строка { $component } бадали дюз компонент дар. Гьисаба ккабхьуру дар.

## Types and variables

invalid-type-defaulting-to-number = { $type } жюре дюз дар, жюре number кьяйдайиинди тайин апӀна.

invalid-variable-value = Переменнайин дюз дару кьимат: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариантдин индекс число вуйи герек ву

variant-index-must-be-integer = { $index } вариантдин индекс бутӀун число вуйи герек ву

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют измеренйирихъди гьеле мумкин дар. Гьяркьувалар нисбий кьяйдайиинди тайин апӀна.

side-by-side-absolute-margins = `<{ $component }>` абсолют измеренйирихъди гьеле мумкин дар. Гъирагъар нисбий кьяйдайиинди тайин апӀна.

side-by-side-no-block-child = Дюз дару `<{ $component }>`: думуъ эн кем саб блок элемент хьуб герек ву.

## `<label>`

label-for-ignored-on-graphical = График `<label>` компонентдиин `for` атрибут гьисаба ккабхьуру дар.

label-for-must-resolve-to-one = `<label>` компонентдиин `for` атрибут таман саб компонентдиз хъуркьуб герек ву.

label-for-unresolved = `<label>` компонентдиин `for` атрибут компонентдиз хъуркьуз гъабхьундар.

label-for-answer-with-authored-inputs = `<label>` компонентдиин `for` атрибутди автори улупу ивруяр айи `<answer>` компонентдиз ссылка апӀура; гьадму ивруйиз ссылка апӀин.

label-for-answer-without-input = `<label>` компонентдиин `for` атрибутди лишан апӀуз ивру адру `<answer>` компонентдиз ссылка апӀура.

label-for-must-reference-input-or-answer = `<label>` компонентдиин `for` атрибутди ивруйиз ва я жавабиз ссылка апӀуб герек ву.

## Accessibility

accessibility-short-description-or-decorative = Хъуркьувал бадали `<{ $component }>` компонентдиъ кюрт баян хьуб, ва я думу декоративни вуш улупуб герек ву.

accessibility-video-short-description = Хъуркьувал бадали `<video>` компонентдиъ кюрт баян хьуб герек ву.

accessibility-input-short-description-or-label = Хъуркьувал бадали `<{ $component }>` компонентдиъ кюрт баян ва я лишан хьуб герек ву.

accessibility-answer-input-short-description-or-label = Хъуркьувал бадали ивру дапӀну айи `<answer>` компонентдиъ кюрт баян ва я лишан хьуб герек ву.

accessibility-short-description-contains-math = Кюрт баяниъ `<{ $component }>` жюре математический компонентар хьуб дюз дар. Математика гафариинди ликӀин.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } кьилин текстдиз таман дару контраст тувра (мичӀи режим) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эн кем { $threshold }:1 герек ву).
       *[other] { $colorName } кьилин текстдиз таман дару контраст тувра ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эн кем { $threshold }:1 герек ву).
    }

## `<circle>`

circle-through-points-non-numerical = НукьтӀйириъ числайин кьиматар адарки, { $count } нукьтӀайиан гъябгъру `<circle>` гьеле мумкин дар.

circle-too-many-through-points = 3 нукьтӀадихьан гизаф нукьтӀайиан гъябгъру даире гьисаб апӀуз шулдар.

circle-overprescribed-radius-center-points = Улупу радиус, юкь ва нукьтӀйирихъди даире гьисаб апӀуз шулдар.

circle-center-with-multiple-points = Улупу юкьихъди саб нукьтӀадихьан гизаф нукьтӀайиан гъябгъру даире гьисаб апӀуз шулдар.

circle-radius-too-small = Даире гьисаб апӀуз шулдар: кьюб нукьтӀайин арайин месафе { $distance } вуйиган, улупу { $radius } радиус гизаф бицӀи ву.

circle-radius-with-many-points = Улупу радиусихъди кьюб нукьтӀадихьан гизаф нукьтӀайиан гъябгъру даире дапӀуз шулдар.

circle-invalid-center-or-through-points = Даирейин юкь ва я нукьтӀйир дюз дар.

circle-radius-center-with-multiple-points = Улупу юкьихъди саб нукьтӀадихьан гизаф нукьтӀайиан гъябгъру даирейин радиус гьисаб апӀуз шулдар.

circle-change-radius-non-numerical = Числайин дару нукьтӀйириан гъябгъру даирейин радиус дегиш апӀуз шулдар

circle-radius-with-points-non-numerical = Числайин кьиматар адарки, улупу радиусихъди саб нукьтӀадихьан гизаф нукьтӀайиан гъябгъру даире дапӀуз шулдар.

circle-change-center-non-numerical = Числайин дару нукьтӀйириан гъябгъру даирейин юкь дегиш апӀуб гьеле мумкин дар.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцийин областназ таман дару измеренйир. Областдиъ { $intervals } интервал а, амма функцийихъ { $inputs ->
            [one] { $inputs } ивру
           *[other] { $inputs } ивру
        } а.
       *[other] Функцийин областназ таман дару измеренйир. Областдиъ { $intervals } интервал а, амма функцийихъ { $inputs ->
            [one] { $inputs } ивру
           *[other] { $inputs } ивру
        } а.
    }

function-domain-invalid-format = Функцийин областдин формат дюз дар.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцийин числайин дару максимум гьисаба ккабхьуру дар.
        [minimum] Функцийин числайин дару минимум гьисаба ккабхьуру дар.
        [extremum] Функцийин числайин дару экстремум гьисаба ккабхьуру дар.
        [point] Функцийин числайин дару нукьтӀа гьисаба ккабхьуру дар.
        [slope] Функцийин числайин дару наклон гьисаба ккабхьуру дар.
       *[other] Функцийин числайин дару { $type } гьисаба ккабхьуру дар.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцийин ичӀи максимум гьисаба ккабхьуру дар.
        [minimum] Функцийин ичӀи минимум гьисаба ккабхьуру дар.
        [extremum] Функцийин ичӀи экстремум гьисаба ккабхьуру дар.
        [point] Функцийин ичӀи нукьтӀа гьисаба ккабхьуру дар.
       *[other] Функцийин ичӀи { $type } гьисаба ккабхьуру дар.
    }

function-points-too-close = Функцияйиъ саб-сариз гизаф мукьа айи кьюб нукьтӀа а. Функция тайин апӀуз шулдар.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функцийин итерацйир анжах ивруйирин кьадар удучӀвуйирин кьадариз барабар вуш мумкин ву. Му функцийихъ { $inputs } ивру ва { $outputs ->
            [one] { $outputs } удучӀву
           *[other] { $outputs } удучӀву
        } а.
       *[other] Функцийин итерацйир анжах ивруйирин кьадар удучӀвуйирин кьадариз барабар вуш мумкин ву. Му функцийихъ { $inputs } ивру ва { $outputs ->
            [one] { $outputs } удучӀву
           *[other] { $outputs } удучӀву
        } а.
    }

## `<sequence>`

sequence-invalid-length = Последовательностин кьадар дюз дар.  Думу минус дару бутӀун число вуйи герек ву.

sequence-invalid-step = Последовательностин аддим дюз дар.  { $type } жюрейин последовательность бадали думу число вуйи герек ву.

sequence-invalid-endpoint-number = Числайин последовательностин "{ $attribute }" дюз дар.  Думу число вуйи герек ву.

sequence-invalid-endpoint-letters = Гьярфарин последовательностин "{ $attribute }" дюз дар.  Думу гьярфарин бирикме вуйи герек ву.

sequence-invalid-endpoint = Последовательностин "{ $attribute }" дюз дар.

select-from-sequence-coprime-not-numbers = числаяр сечмиш апӀурадарки coprime гьисаба ккабхьуру дар

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations улупнайиз coprime гьисаба ккабхьуру дар

## Resolving a `target`

target-not-found = `<{ $source }>` бадали дюз дару target: target агуз шулдар.

target-state-variable-not-found = `<{ $source }>` бадали дюз дару target: `<{ $component }>` компонентдиъ "{ $property }" ччвур айи гьалин дегишлу агуз шулдар.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` компонентдин переменнйир аслу дару переменнайиз тафаватлу хьуб герек ву.

ode-system-duplicate-variable-names = Тикрар шулайи аслу переменнйирин ччвурарихъди ОДУ функцйир тайин апӀуз шулдар.

ode-system-rhs-function-error = ОДУ функция тайин апӀуз шулдар.  mathjs функция дапӀруган гъалатӀ.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } дюз цӀарин арайин пипӀ тайин апӀуз шулдар

angle-invalid-through-point = `<angle>` компонентдин through-иъ дюз дару нукьтӀа

parabola-vertex-too-many-points = Кьилихъди саб нукьтӀадихьан гизаф нукьтӀайиан гъябгъру парабола гьеле мумкин дар.

parabola-too-many-points = 3 нукьтӀадихьан гизаф нукьтӀайиан гъябгъру парабола гьеле мумкин дар.

intersection-too-many-items = Кьюбдихьан гизаф затнан кесишме гьеле мумкин дар

## Other math components

ionic-compound-not-two-ions = Кьюб иондихьан жара затӀариз ион бирлешме гьеле мумкин дар.

ionic-compound-needs-cation-and-anion = Ион бирлешме анжах саб катион ва саб анион бадали мумкин ву.

solve-equations-cannot-evaluate = Уравнение гьял апӀуз шулдар: уравнение гьисаб апӀуз гъабхьундар: { $equation }

math-operators-operand-number-required = Математический операнд адагърайиз operandNumber улупуб герек ву.

eigen-decomposition-failed = Матрицайин собственный кьиматар гьисаб апӀуз гъабхьундар

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр шаблондиъ адар, гьаддиз думу гьаммишан ичӀи затӀихъди уйгъун жеди.
       *[other] `<matchesPattern>`: { $parameters } параметрар шаблондиъ адар, гьаддиз дурар гьаммишан ичӀи затӀихъди уйгъун жеди.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" гъавриъ ахъуз шулдар. Думу none, medium, dense ва я бушлугъди айирди улупу кьюб минус дару число хьуб герек ву, месела grid="1 0.5". Сетка улупру дар.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` компонентдиз { $expected ->
        [one] саб удучӀву — гьар са нукьтӀайиъ y' наклон, месела `y - x`
       *[other] кьюб удучӀву — гьар са нукьтӀайиъ вектор, месела `(y, -x)`
    } айи функция герек ву, амма тувнайи функцийихъ { $found ->
        [one] { $found } удучӀву
       *[other] { $found } удучӀву
    } а. { $alternative ->
        [none] ЗатӀ улупру дар.
       *[other] Гьадму функция бадали `<{ $alternative }>` компонент ву. ЗатӀ улупру дар.
    }

field-function-attribute-ignored-with-child = `function` атрибут гьисаба ккабхьуру дар, гьаз гъи функция компонентдин ичӀ пайиъ гьаци тувна; ичӀ пайиъ айиб ишлетмиш апӀура. Функция анжах саб кьяйдайиинди тувин.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибутди компонентдин ичӀ пайиъ ликӀнайи ифадайин переменнйир улупура. { $reason ->
        [function-child] Му функция `<function>` элементди тувна, ва думу чан переменнйир чиб улупура, гьаддиз `variables` гьисаба ккабхьуру дар.
       *[no-expression] Мушв гьаци ифада тувну адар, гьаддиз `variables` гьисаба ккабхьуру дар.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure рендердиъ xLabelPosition="left" гъабул апӀуру дар; right кьяйда ишлетмиш апӀура.

prefigure-y-label-position-unsupported = `<graph>`: prefigure рендердиъ yLabelPosition="bottom" гъабул апӀуру дар; top кьяйда ишлетмиш апӀура.

prefigure-invalid-axis-bounds = `<graph>`: prefigure бадали осьарин сергьятар дюз дар; стандарт bbox (-10,-10,10,10) ишлетмиш апӀура.

prefigure-invalid-width = `<graph>`: prefigure бадали гьяркьувал дюз дар; стандарт диаграммайин гьяркьувал 425 ишлетмиш апӀура.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure бадали aspectRatio дюз дар; стандарт нисбат 1 ишлетмиш апӀура.

prefigure-grid-spacing-too-fine = `<graph>`: осьарин сергьятариз сеткайин арайир гизаф бицӀи ву; prefigure рендердиъ сетка адабгъна.

prefigure-annotations-not-rendered = `<graph>`: PreFigure рендер ишлетмиш апӀурадарки, аннотацйир улупру дар.

multiple-annotations-children = `<graph>` компонентдиъ гизаф `<annotations>` элементар а; ахиримжибдилан гъайри вари гьисаба ккабхьуру дар.

## Referring to other components

copy-unrecognized-component-type = Аьгъю дару компонентдин жюре давам апӀуз ва я копия апӀуз шулдар: { $type }.

copy-prop-not-found = { $component } жюрейин компонентдиъ { $property } свойство агуз гъабхьундар

collect-no-source = collect бадали источник агуз гъабхьундар.

collect-invalid-component-type = `<{ $component }>` жюрейин компонентар жем апӀуз шулдар: думу дюз дару компонентдин жюре ву.

reference-index-unavailable = `{ $reference }` индексдиз ссылка апӀуз шулдар

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентдиз { $action } эвер тувуз шулдар

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Данныйирин форма дюз дар.  Жергйир саб кьадар дар. Мушв: componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Данныйириъ сутнарин ччвурар тикрар шула.  Мушв: componentIdx :{ $componentIdx }

data-frame-missing-column-name = Данныйириъ сутундин ччвур адар.  Мушв: componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Му жавабин award думу `<answer>` тегдин чан ивнайи жавабиин аслу ву, гьадму гюзлемиш дару нетижйириз гъухуди.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` айи контейнердин ичӀ пайиъ айи `<answer>` компонентдиин `maxNumAttempts` тайин апӀуб тӀаьсирсуз ву, гьаз гъи гьяракатарин кьадар контейнерди тайин апӀура. `maxNumAttempts` контейнердиин тайин апӀин.

nested-section-wide-check-work-max-num-attempts = Жара `sectionWideCheckWork` айи контейнердин ичӀ пайиъ айи `sectionWideCheckWork` айи контейнердиин `maxNumAttempts` тайин апӀуб тӀаьсирсуз ву, гьаз гъи гьяракатарин кьадар гъирагъдин контейнерди тайин апӀура. `maxNumAttempts` гъирагъдин контейнердиин тайин апӀин.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality тайин апӀундарди { $attributes } атрибут тӀаьсирсуз жеди.
       *[other] symbolicEquality тайин апӀундарди { $attributes } атрибутар тӀаьсирсуз жеди.
    }

answer-invalid-type = Жавабин жюре дюз дар: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентдиъ ччвур адарки, думу модулин атрибут кьяйдайиинди ишлетмиш апӀуз шулдар

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонент модулин атрибут кьяйдайиинди ишлетмиш апӀуз шулдар, гьаз гъи `<module>` компонентдин жюрейиъ "{ $name }" атрибут гьаци тайин дапӀна.

conditional-content-condition-ignored = case ва я else элементар айи `<conditionalContent>` компонентдиин `condition` атрибут гьисаба ккабхьуру дар.

slider-markers-type-mismatch = Маркерарин жюре слайдерин жюрейиз уйгъун дар.

pretzel-problem-needs-statement-and-answer = Дюз дару pretzel: гьар са `<problem>` компонентдиъ саб `<statement>` ва саб `<answer>` хьуб герек ву.

pretzel-circuit-first-problem-distractor = Дюз дару pretzel: mode="circuit" вуйиган сифтени `<problem>` дистрактор хьуз шулдар.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибутдин дюз дару кьимат { $values }; гьисаба ккабхьуру дар.
       *[other] `{ $attribute }` атрибутдин дюз дару кьиматар { $values }; гьисаба ккабхьуру дар.
    }

attribute-must-be-references = `{ $attribute }` атрибутдин `{ $value }` кьимат дюз дар. Атрибут `$` лишандиан ккебгъру ссылкйирикан ибарат хьуб герек ву.

math-input-invalid-function-names = <mathInput>: { $attribute } атрибутдиъ дюз дару функцйирин ччвурар гьисаба ккабхьундар: { $names }. Гьар са ччвурин улупру пай эн кем 2 гьярф (гьярфар ва я дефисар) хьуб герек ву; ччвурихъ хъуркьуз `|<mathspeak alternative>` элаве апӀуз шулу.

## Building components from the source

component-type-invalid = Дюз дару компонентдин жюре: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибут тикрар апӀуз шулдар.

attribute-invalid-for-component = `<{ $componentType }>` жюрейин компонент бадали "{ $attribute }" атрибут дюз дар.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стилин тайинатдиъ { $context ->
        [text-on-background] текстдин рангниз фондин рангнахъди
        [high-contrast] заан контрастин рангниз холстнахъди
        [line] цӀарин рангниз холстнахъди
        [marker] маркерин рангниз холстнахъди
       *[text-on-canvas] текстдин рангниз холстнахъди
    } таман дару контраст а{ $mode ->
        [dark] { " (мичӀи режим)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эн кем { $threshold }:1 герек ву).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стилин тайинатдиъ улупу ранграр ачухъ режимназ таман контраст тувра, амма гьаму кьиматариан адагъу мичӀи режимдин ранграриъ текстдин рангниз фондин рангнахъди таман дару контраст а ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эн кем { $threshold }:1 герек ву). { $suggestion ->
        [available] МичӀи режимдиъ таман контраст хьуб бадали ва я ачухъ режимдин контраст артмиш апӀин (месела, { $lightAttribute }="{ $lightColor }" тайин апӀин), ва я мичӀи режимдин ранг эвез апӀин (месела, { $darkAttribute }="{ $darkColor }" тайин апӀин).
       *[none] МичӀи режимдиъ таман контраст хьуб бадали ачухъ режимдин контраст артмиш апӀин, ва я адагъу ранграр textColorDarkMode ва/ва я backgroundColorDarkMode лишнариинди эвез апӀин.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стилин тайинатдиъ улупу текстдин рангди ачухъ режимназ таман контраст тувра, амма гьаму кьиматиан адагъу мичӀи режимдин текстдин рангниз холстнахъди таман дару контраст а ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эн кем { $threshold }:1 герек ву). { $suggestion ->
        [available] МичӀи режимдиъ таман контраст хьуб бадали ва я ачухъ режимдин контраст артмиш апӀин (месела, textColor="{ $lightColor }" тайин апӀин), ва я мичӀи режимдин ранг эвез апӀин (месела, textColorDarkMode="{ $darkColor }" тайин апӀин).
       *[none] МичӀи режимдиъ таман контраст хьуб бадали ачухъ режимдин контраст артмиш апӀин, ва я адагъу ранг textColorDarkMode лишандиинди эвез апӀин.
    }

section-multiple-style-palettes = Кьилиз анжах саб <stylePalette> сечмиш апӀуз шулу; ахиримжиб ишлетмиш апӀура.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } компонентдин тек-тек вариантар тайин апӀуз шулдар: numToSelect минус дару бутӀун число дар.

variant-num-to-select-not-constant-number = { $component } компонентдин тек-тек вариантар тайин апӀуз шулдар: numToSelect дегиш дару число дар.

variant-with-replacement-not-constant-boolean = { $component } компонентдин тек-тек вариантар тайин апӀуз шулдар: withReplacement дегиш дару boolean дар.

variant-select-weight-disables-unique = selectWeight ва я selectForVariants улупу сечим айиш, select бадали тек-тек вариантар тайин апӀуз шулдар

variant-coprime-undetermined = { $component } компонентдин тек-тек вариантар тайин апӀуз шулдар: coprime гьаммишан ялгъан вуш тайин апӀуз шулдар.

variant-attribute-not-constant = { $component } компонентдин тек-тек вариантар тайин апӀуз шулдар: { $attribute } дегиш дару кьимат дар.

variant-attribute-not-number = { $component } компонентдин тек-тек вариантар тайин апӀуз шулдар: { $attribute } число дар.

variant-attribute-wrong-type-for-sequence =
    { $type } жюрейин { $component } компонентдин тек-тек вариантар тайин апӀуз шулдар: { $attribute } { $expected ->
        [letters-combination] гьярфарин бирикме
        [math-expression] дюз математический ифада
        [integer] бутӀун число
       *[number] число
    } дар.

variant-length-not-integer = { $component } компонентдин тек-тек вариантар тайин апӀуз шулдар: length бутӀун число дар.

variant-sort-not-implemented = sort айи { $component } компонентдин тек-тек вариантар гьеле мумкин дар

variant-exclude-combinations-not-implemented = excludeCombinations айи { $component } компонентдин тек-тек вариантар гьеле мумкин дар

variant-math-exclude-not-implemented = exclude айи math жюрейин { $component } компонентдин тек-тек вариантар гьеле мумкин дар

variant-non-constant-exclude-not-implemented = дегиш жеру exclude айи { $component } компонентдин тек-тек вариантар гьеле мумкин дар

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure рендердиъ гъабул апӀуру дар; элемент адабгъна.

prefigure-descendant-invalid-geometry = { $subject }: геометрия таман дар ва я числаяр сергьятсуз ву; элемент адабгъна.

prefigure-curve-label-omitted = { $subject }: эгри цӀарин элементариин лишнар гъабул апӀуру дар; лишан адабгъна.

prefigure-curve-unsupported-definition-type = { $subject }: эгри цӀарин функцийин тайинатдин '{ $definitionType }' жюре гъабул апӀуру дар; элемент адабгъна.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves компонентдиин flipFunctions атрибут гъабул апӀуру дар; элемент адабгъна.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves компонентдиъ анжах формулайин жюрейин функцйир гъабул апӀура; элемент адабгъна.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] цӀарин жюрейин лишандиз
       *[point] нукьтӀайин лишандиз
    } '{ $labelPosition }' labelPosition гъабул апӀуру дар; PreFigure стандарт кьяйда ишлетмиш апӀна.

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' ацӀруйин стиль PreFigure гъабул апӀуру дар; саб рангнан ацӀруб ишлетмиш апӀура.

prefigure-line-style-unknown = { $subject }: аьгъю дару '{ $lineStyle }' цӀарин стиль PreFigure удучӀвуйиан адабгъна.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' маркерин стиль PreFigure 'diamond' стилиз элкъюрна.

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' маркерин стиль PreFigure гъабул апӀуру дар; стандарт стиль ишлетмиш апӀна.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` дюз дар; объект тайин апӀуз шулдар. Аннотация адабгъна.

annotation-ref-multiple-targets = `<annotation>`: `ref` гизаф объектариз хъуркьна; сифтени объект ишлетмиш апӀура.

annotation-ref-outside-graph = `<annotation>`: `ref` дюз дар; объект graph компонентдин гъирагъдиан удучӀвура. Аннотация адабгъна.

annotation-ref-unsupported-target = `<annotation>`: `ref` дюз дар; объект prefigure элкъуйиъ гъабул апӀру график объект дар. Аннотация адабгъна.

annotation-text-missing = `<annotation>`: `text` адар ва я ичӀи ву; ичӀи текст удучӀвура.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Даире аслувал а.
       *[other] `<{ $componentType }>` компонент иштирак апӀурайи даире аслувал а.
    }

reference-no-referent = Ссылкйин объект адар: `{ $reference }`

reference-multiple-referents = Ссылкйиз гизаф объектар а: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` компонентдин { $attribute } атрибутдин формат дюз дар.

children-invalid = `<{ $componentType }>` компонентдин элементар дюз дар: дюз дару элементар а: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибутдин `{ $value }` кьимат дюз дар, `{ $default }` кьимат ишлетмиш апӀура

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версия агуз гъабхьундар.
       *[other] DoenetML { $version } версия агуз гъабхьундар. { $fallback } версия ишлетмиш апӀура
    }

## Reading the DoenetML

parse-invalid-doenetml = Дюз дару DoenetML: { $content }

parse-tag-missing-close-tag = Дюз дару DoenetML: `{ $tag }` тегдихъ багъламиш апӀру тег адар. Чаз-чаб багъламиш шулу тег ва я `</{ $tagName }>` тег хьуб герек ву.

parse-tag-error = Дюз дару DoenetML: `<{ $tagName }>` тегдиъ гъалатӀ

parse-attribute-missing-value = Дюз дару DoenetML: `{ $attribute }` дюз дару атрибутдин кьимат адарси гъилигура.

parse-attribute-invalid = Дюз дару DoenetML: `{ $attribute }` атрибут дюз дар

parse-attribute-value-invalid = Дюз дару DoenetML: `{ $value }` атрибутдин кьимат дюз дар

parse-attribute-value-quote-mismatch = Дюз дару DoenetML: `{ $value }` атрибутдин кьимат дюз дар. Кавычкйир саб-сариз уйгъун дар. `{ $quote }` адарси гъилигура

parse-open-tag-name-missing = Дюз дару DoenetML: ччвур адру тег а, месела `<`

parse-tag-not-closed = Дюз дару DoenetML: `{ $tag }` тег багъламиш дапӀундар (`>` адарси гъилигура).

parse-self-closing-tag-name-missing = Дюз дару DoenetML: ччвур адру тег а `<{ $content }>`

parse-self-closing-tag-not-closed = Дюз дару DoenetML: `{ $tag }` тег багъламиш дапӀундар (`/>` адарси гъилигура).

parse-tag-invalid-attributes = Дюз дару DoenetML: `{ $tag }` тег дюз дар. Думуъ дюз дару атрибутар хьуз шулу.

parse-close-tag-name-missing = Дюз дару DoenetML: ччвур адру багъламиш апӀру тег а, месела `</`

parse-attribute-value-unquoted = Атрибутарин кьиматар кавычкйириъ хьуб герек ву: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Дюз дару DoenetML: `{ $tag }` багъламиш апӀру тег а, амма ачмиш апӀру тег адар

parse-close-tag-mismatched = Дюз дару DoenetML: багъламиш апӀру тег уйгъун дар. `</{ $expected }>` герек вуй. `{ $found }` а

parser-node-unconvertible = { $node } узел Dast узелиз элкъюруз гъабхьундар.

## Names

name-attribute-invalid =
    Дюз дару name='{ $name }' атрибут. { $reason ->
        [characters] Ччвурариъ анжах гьярфар, числаяр, кӀан цӀарар ва я дефисар хьуз шулу.
       *[start] Ччвурар гьярфнаан ккебгъуб герек ву.
    }

component-name-invalid-start = Дюз дару "{ $name }" компонентдин ччвур. Ччвурар гьярфнаан ккебгъуб герек ву.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched жюрейин жавабихъ video атрибут хьуб герек ву

answer-video-watched-video-not-reference = videoWatched жюрейин жавабин video атрибут ссылка хьуб герек ву

answer-name-not-single-text = Жавабин name атрибутдиъ саб текст элемент хьуб герек ву

## Referencing another document

external-doenetml-recursion-limit = Гизаф рекурсийин дережйир гъахьи бадали кьяляхъна DoenetML гъадагъуз гъабхьундар. Даире ссылка адарин?

external-doenetml-unavailable = { $attribute }="{ $uri }" терефнаан DoenetML гъадагъуз гъабхьундар

external-doenetml-type-mismatch = { $attribute }="{ $uri }" терефнаан гъадагъу DoenetML дюз дар: думу "{ $componentType }" компонентдин жюрейиз уйгъун дар

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут кюгьне ву; думун эвезиъ `{ $to }` ишлетмиш апӀин.
       *[other] [deprecation] `<{ $component }>` компонентдиин `{ $from }` атрибут кюгьне ву; думун эвезиъ `{ $to }` ишлетмиш апӀин.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут кюгьне ву ва гьисаба ккабхьуру дар, гьаз гъи `{ $to }` гьаци улупна.
       *[other] [deprecation] `<{ $component }>` компонентдиин `{ $from }` атрибут кюгьне ву ва гьисаба ккабхьуру дар, гьаз гъи `{ $to }` гьаци улупна.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` компонентдиин `{ $attribute }` атрибут кюгьне ву ва гьисаба ккабхьуру дар.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` компонентдиин `{ $attribute }` атрибут кюгьне ву; думун эвезиъ `<{ $child }>` элемент ишлетмиш апӀин.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` компонентдиин `{ $attribute }` атрибутдин `{ $value }` кьимат кюгьне ву; думун эвезиъ `{ $to }` ишлетмиш апӀин.


## Language coverage

pluralize-english-only = `<pluralize>` анжах инглис чӀалнан гафар гизафвалин кьяйдайиз элкъюруз шулу, гьаддиз { $locale } чӀалниъ ликӀнайи документиъ текст автори ликӀу кьяйдайиинди гъузура. Гизафвалин форма чиб ликӀин, ва я `pluralForm` атрибутдиинди тайин апӀин.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент Doenet аьгъю вуйи элемент дар.

schema-element-not-allowed-at-root = `<{ $tag }>` элемент документдин дувулиъ хьуз ихтияр адар.

schema-element-not-allowed-inside = `<{ $tag }>` элемент `<{ $parent }>` компонентдин ичӀ пайиъ хьуз ихтияр адар.

schema-attribute-unrecognized = `<{ $tag }>` элементдиъ `{ $attribute }` ччвур айи атрибут адар.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементдин `{ $attribute }` атрибут список хьуб герек ву, ва думун гьар са элемент гьаму кьиматарикан саб хьуб герек ву: { $allowed }
       *[other] `<{ $tag }>` элементдин `{ $attribute }` атрибут гьаму кьиматарикан саб хьуб герек ву: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select бадали вариантдин ччвур дюз дар.  { $variantName } вариантдин ччвур { $numOptions } сечимиъ а, амма сечмиш апӀру кьадар { $numToSelect } ву.

select-variant-name-without-options = select бадали бязи вариантар улупна, амма мумкин вуйи { $variantName } вариантдин ччвур бадали сечимар улупундар.

select-variant-name-not-possible = select бадали улупу { $variantName } вариантдин ччвур мумкин вуйи вариантдин ччвур дар.

select-too-few-options = Анжах { $numOptions } сечимиан { $numToSelect } компонент сечмиш апӀуз шулдар.

select-from-sequence-too-few-values = { $length } кьадар айи последовательностиан { $numToSelect } кьимат сечмиш апӀуз шулдар.

select-from-sequence-indices-count-mismatch = select бадали улупу индексарин кьадар сечмиш апӀру кьадариз уйгъун хьуб герек ву

select-from-sequence-indices-not-integers = select бадали улупу вари индексар бутӀун числаяр хьуб герек ву

select-from-sequence-index-excluded = selectfromsequence бадали адабгъу индекс улупна

select-from-sequence-indices-excluded-combination = selectfromsequence бадали адабгъу бирикме вуйи индексар улупна

select-from-sequence-coprime-not-positive-integers = Позитив бутӀун числаяр сечмиш апӀурадарки, coprime бирикмйир сечмиш апӀуз шулдар.

select-from-sequence-coprime-common-factor = Coprime числаяр сечмиш апӀуз шулдар. Мумкин вуйи вари кьиматариъ умуми делитель а. (Улупу "from" ва я "to" кьиматар "step" кьиматдихъди coprime хьуб герек ву.)

select-from-sequence-coprime-single-number = 1 дару саб числайиан coprime бирикмйир сечмиш апӀуз шулдар.

select-from-sequence-excluded-too-many-combinations = selectFromSequence компонентдиъ бирикмйирин 70%-дихьан гизафси адабгъна

select-from-sequence-coprime-none-found = Coprime числаяр сечмиш апӀуз гъабхьундар. Мумкин вуйи вари кьиматариъ умуми делитель а.

select-from-sequence-too-few-unique-values = { $numPossibleValues } кьадар айи последовательностиан { $numToSelect } тек-тек кьимат сечмиш апӀуз шулдар

select-prime-numbers-too-few-values = { $numValues } кьадар айи простой числйирин спискйиан { $numToSelect } кьимат сечмиш апӀуз шулдар

select-prime-numbers-values-count-mismatch = select бадали улупу кьиматарин кьадар сечмиш апӀру кьадариз уйгъун хьуб герек ву

select-prime-numbers-values-not-prime = select prime number бадали улупу вари кьиматар простой числйирин спискйиъ хьуб герек ву

select-prime-numbers-values-excluded-combination = selectPrimeNumbers бадали адабгъу бирикме вуйи кьиматар улупна

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers компонентдиъ бирикмйирин 70%-дихьан гизафси адабгъна

select-random-combination-fluke = Гизаф аьжайиб гьалди, тесадуф кьиматарин бирикме сечмиш апӀуз гъабхьундар

select-random-value-fluke = Гизаф аьжайиб гьалди, тесадуф кьимат сечмиш апӀуз гъабхьундар
