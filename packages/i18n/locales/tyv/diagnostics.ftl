# Tuvan diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
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
# The technical nouns are the Russian ones, which is what written Tuvan uses
# for them: «компонент», «атрибут», «функция», «индекс».


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] ийи ужу точказы-даа айыттынган болза { $attributes } санашпас
       *[other] ийи ужу точказы-даа айыттынган болза { $attributes } санашпас
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] ужу точказы-даа, ортузу точказы-даа айыттынган болза { $attributes } санашпас
       *[other] ужу точказы-даа, ортузу точказы-даа айыттынган болза { $attributes } санашпас
    }

line-segment-midpoint-offset-without-midpoint = ортузу точказы чок midpointOffset чүүге-даа салдар чедирбес

## `<line>`

line-points-undetermined-dimensions = Хемчээ билдинмес точкалар дамчыштыр эртер дорт шугум.

line-points-too-few-dimensions = Дорт шугум эң эвээш ийи хемчээлдиг точкалар дамчыштыр эртер ужурлуг.

line-points-depend-on-variables = Дорт шугум өскерлир хемчээлдерден хамааржыр точкалар дамчыштыр эртер: { $variables }.

line-equation-invalid-format = { $variable1 } биле { $variable2 } өскерлир хемчээлдерлиг дорт шугум деңнелгезиниң форматы шын эвес.

## `<ray>`

ray-overprescribed-through = Лучту through, endpoint база direction дамчыштыр берген. Берген through санашпас.

ray-dimension-mismatch = лучта numDimensions дүүшпес.

## `<vector>`

vector-overprescribed-head = Векторну head, tail база displacement дамчыштыр берген. Берген head санашпас.

vector-dimension-mismatch = векторда numDimensions дүүшпес.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элементиже тыртып шыдавас, чүге дизе ооң nearestPoint байдал хемчээли чок.

constrain-to-without-nearest-point = `<{ $component }>` элементи-биле кызыгаарлап шыдавас, чүге дизе ооң nearestPoint байдал хемчээли чок.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементиниң иштии-биле кызыгаарлап шыдавас, чүге дизе ооң nearestPoint байдал хемчээли чок.

## `<choiceInput>`

choice-input-label-position-ignored = одуруг иштинде эвес choiceInput дээш labelPosition санашпас

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput дээш берген индекстер санашпас, чүге дизе оларның саны choice уругларының санынга дүүшпес.

pretzel-indices-count-mismatch = problem дээш берген индекстер санашпас, чүге дизе оларның саны problem уругларының санынга дүүшпес.

shuffle-indices-count-mismatch = shuffle дээш берген индекстер санашпас, чүге дизе оларның саны компонентилер санынга дүүшпес.

indices-ignored-out-of-range = { $component } дээш берген индекстер санашпас, чүге дизе чамдыызы кызыгаардан үнүп турар.

pretzel-indices-repeated = pretzel дээш берген индекстер санашпас, чүге дизе чамдыызы катаптаттынып турар.

pretzel-circuit-first-index = circuit чурумунда pretzel дээш берген индекстер санашпас, чүге дизе баштайгы индекс 1 болур ужурлуг.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текст уруглары-биле ажылдаары-биле `type` атрибут бээр ужурлуг.

invalid-type-defaulting-to-math = { $component } компонентиге шын эвес хевир { $type }. Ол math, text, number азы boolean болур ужурлуг. math ажыглаттынар.

string-not-valid-component-to-arrange = «{ $value }» одуруг { $component } дээш таарымчалыг компонент эвес. Санашпас.

## Types and variables

invalid-type-defaulting-to-number = Шын эвес хевир { $type }, хевири number кылдыр салдынар.

invalid-variable-value = Өскерлир хемчээлдиң шын эвес утказы: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариант индекизи сан болур ужурлуг

variant-index-must-be-integer = { $index } вариант индекизи бүдүн сан болур ужурлуг

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют хемчээлдерге кылдынмаан. Делгемнери деңнештирилге кылдыр салдынар.

side-by-side-absolute-margins = `<{ $component }>` абсолют хемчээлдерге кылдынмаан. Кыдыглары деңнештирилге кылдыр салдынар.

side-by-side-no-block-child = Шын эвес `<{ $component }>`: ооң эң эвээш бир блок уруу турар ужурлуг.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элементиниң `for` атрибуду санашпас.

label-for-must-resolve-to-one = `<label>` элементиниң `for` атрибуду чаңгыс компонентиже айтыр ужурлуг.

label-for-unresolved = `<label>` элементиниң `for` атрибудун компонент-биле холбап шыдаваан.

label-for-answer-with-authored-inputs = `<label>` элементиниң `for` атрибуду автор бижээн киирилде шөлдерлиг `<answer>` иже айтып турар; шөлче дорт айтыңар.

label-for-answer-without-input = `<label>` элементиниң `for` атрибуду демдеглээр киирилде шөлү чок `<answer>` иже айтып турар.

label-for-must-reference-input-or-answer = `<label>` элементиниң `for` атрибуду киирилде шөлүнче азы харыыже айтыр ужурлуг.

## Accessibility

accessibility-short-description-or-decorative = Ажыглаар арга дээш `<{ $component }>` кыска тайылбырлыг болур азы чурумал кылдыр демдеглеттинер ужурлуг.

accessibility-video-short-description = Ажыглаар арга дээш `<video>` кыска тайылбырлыг болур ужурлуг.

accessibility-input-short-description-or-label = Ажыглаар арга дээш `<{ $component }>` кыска тайылбырлыг азы демдектиг болур ужурлуг.

accessibility-answer-input-short-description-or-label = Ажыглаар арга дээш киирилде шөлүн тургузар `<answer>` кыска тайылбырлыг азы демдектиг болур ужурлуг.

accessibility-short-description-contains-math = Кыска тайылбырларда `<{ $component }>` дег математиктиг компонентилер турбас ужурлуг. Математиканы сөс-биле бижиңер.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } эге баштыңының тексти дээш четчир контраст бербейн турар (караңгы хевир) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эң эвээш { $threshold }:1 негеттинер).
       *[other] { $colorName } эге баштыңының тексти дээш четчир контраст бербейн турар ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эң эвээш { $threshold }:1 негеттинер).
    }

## `<circle>`

circle-through-points-non-numerical = Точкаларның сан утказы чок болганда { $count } точка дамчыштыр эртер `<circle>` кылдынмаан.

circle-too-many-through-points = 3-тен хөй точка дамчыштыр эртер тегерикти санап шыдавас.

circle-overprescribed-radius-center-points = Берген радиус, төп база точкалар-биле тегерикти санап шыдавас.

circle-center-with-multiple-points = Берген төп-биле 1-ден хөй точка дамчыштыр эртер тегерикти санап шыдавас.

circle-radius-too-small = Тегерикти санап шыдавас: ийи точка аразының ырааны { $distance } болганда, берген радиус { $radius } дыка биче.

circle-radius-with-many-points = Берген радиус-биле ийиден хөй точка дамчыштыр эртер тегерик тургузуп шыдавас.

circle-invalid-center-or-through-points = Тегериктиң төвү азы точкалары шын эвес.

circle-radius-center-with-multiple-points = Берген төп-биле 1-ден хөй точка дамчыштыр эртер тегериктиң радиузун санап шыдавас.

circle-change-radius-non-numerical = Сан эвес точкалыг тегериктиң радиузун өскертип шыдавас

circle-radius-with-points-non-numerical = Сан утказы чок болганда берген радиус-биле бирден хөй точка дамчыштыр эртер тегерик тургузуп шыдавас.

circle-change-center-non-numerical = Сан эвес точкалар дамчыштыр эртер тегериктиң төвүн өскертири кылдынмаан.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцияның тодараттынар шөлүнүң хемчээли четчир эвес. Шөлде { $intervals } аразы бар, а функцияда { $inputs ->
            [one] { $inputs } киирилде
           *[other] { $inputs } киирилде
        }.
       *[other] Функцияның тодараттынар шөлүнүң хемчээли четчир эвес. Шөлде { $intervals } аразы бар, а функцияда { $inputs ->
            [one] { $inputs } киирилде
           *[other] { $inputs } киирилде
        }.
    }

function-domain-invalid-format = Функцияның тодараттынар шөлүнүң форматы шын эвес.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцияның сан эвес максимуму санашпас.
        [minimum] Функцияның сан эвес минимуму санашпас.
        [extremum] Функцияның сан эвес экстремуму санашпас.
        [point] Функцияның сан эвес точказы санашпас.
        [slope] Функцияның сан эвес чарлыы санашпас.
       *[other] Функцияның сан эвес { $type } утказы санашпас.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцияның куруг максимуму санашпас.
        [minimum] Функцияның куруг минимуму санашпас.
        [extremum] Функцияның куруг экстремуму санашпас.
        [point] Функцияның куруг точказы санашпас.
       *[other] Функцияның куруг { $type } утказы санашпас.
    }

function-points-too-close = Функцияда бот-боттарынга дыка чоок ийи точка бар. Функцияны тодарадып шыдавас.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функция итерациялары киирилделер саны үндүрүлгелер санынга дең турда чүгле болур. Бо функцияда { $inputs } киирилде база { $outputs ->
            [one] { $outputs } үндүрүлге
           *[other] { $outputs } үндүрүлге
        } бар.
       *[other] Функция итерациялары киирилделер саны үндүрүлгелер санынга дең турда чүгле болур. Бо функцияда { $inputs } киирилде база { $outputs ->
            [one] { $outputs } үндүрүлге
           *[other] { $outputs } үндүрүлге
        } бар.
    }

## `<sequence>`

sequence-invalid-length = Дараалашкактың узуну шын эвес. Ол минус эвес бүдүн сан болур ужурлуг.

sequence-invalid-step = Дараалашкактың базымы шын эвес. { $type } хевирлиг дараалашкакка ол сан болур ужурлуг.

sequence-invalid-endpoint-number = Сан дараалашкааның «{ $attribute }» утказы шын эвес. Ол сан болур ужурлуг.

sequence-invalid-endpoint-letters = Ужук дараалашкааның «{ $attribute }» утказы шын эвес. Ол ужуктар каттыжыышкыны болур ужурлуг.

sequence-invalid-endpoint = Дараалашкактың «{ $attribute }» утказы шын эвес.

select-from-sequence-coprime-not-numbers = саннар шилиттинмээн болганда coprime санашпас

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations берген болганда coprime санашпас

## Resolving a `target`

target-not-found = `<{ $source }>` дээш шын эвес target: сорулга тывылбаан.

target-state-variable-not-found = `<{ $source }>` дээш шын эвес target: `<{ $component }>` элементиде «{ $property }» деп аттыг байдал хемчээли тывылбаан.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` өскерлир хемчээлдери хамаарышпас хемчээлден ылгалыр ужурлуг.

ode-system-duplicate-variable-names = Хамааржыр хемчээлдерниң аттары катаптаттынып турда ДТ оң талазының функцияларын тодарадып шыдавас.

ode-system-rhs-function-error = ДТ оң талазының функциязын тодарадып шыдавас. mathjs функциязын тургузарда частырыг.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } дорт шугум аразында булуңну тодарадып шыдавас

angle-invalid-through-point = `<angle>` элементиниң through утказында шын эвес точка

parabola-vertex-too-many-points = Берген бажы-биле 1-ден хөй точка дамчыштыр эртер парабола кылдынмаан.

parabola-too-many-points = 3-тен хөй точка дамчыштыр эртер парабола кылдынмаан.

intersection-too-many-items = Ийиден хөй объектиниң кежилгези кылдынмаан

## Other math components

ionic-compound-not-two-ions = Ийи иондан өске ион каттыжыышкыны кылдынмаан.

ionic-compound-needs-cation-and-anion = Ион каттыжыышкыны чаңгыс катион биле чаңгыс анион дээш чүгле кылдынган.

solve-equations-cannot-evaluate = Деңнелгени шиитпирлеп шыдавас, чүге дизе ону санап шыдаваан: { $equation }

math-operators-operand-number-required = Математиктиг операндыны аңгылаары-биле operandNumber бээр ужурлуг.

eigen-decomposition-failed = Матрицаның бодунуң утказын санап шыдаваан

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр үлегерде таварышпайн турар, ынчангаш ол кезээде куругга дүгжүр.
       *[other] `<matchesPattern>`: { $parameters } параметрлер үлегерде таварышпайн турар, ынчангаш олар кезээде куругга дүгжүр.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" утказын билип шыдавас. Ол none, medium, dense азы куруг чер-биле аңгыланган ийи плюстуг сан болур ужурлуг, чижээ grid="1 0.5". Сеткил чуруттунмас.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure чуруктаарында xLabelPosition="left" кылдынмаан; оң талага салыр чуруму ажыглаттынар.

prefigure-y-label-position-unsupported = `<graph>`: prefigure чуруктаарында yLabelPosition="bottom" кылдынмаан; кырынга салыр чуруму ажыглаттынар.

prefigure-invalid-axis-bounds = `<graph>`: prefigure шилчидиишкининге тенгиш кызыгаарлары шын эвес; кол bbox (-10,-10,10,10) ажыглаттынар.

prefigure-invalid-width = `<graph>`: prefigure шилчидиишкининге делгеми шын эвес; диаграмманың кол делгеми 425 ажыглаттынар.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure шилчидиишкининге aspectRatio шын эвес; кол таларның хамаарылгазы 1 ажыглаттынар.

prefigure-grid-spacing-too-fine = `<graph>`: сеткил базымы тенгиш кызыгаарларынга дыка бичии; prefigure чуруктаарында сеткил үндүрүлбес.

prefigure-annotations-not-rendered = `<graph>`: PreFigure чуруктаары ажыглаттынмас болза демдеглелдер чуруттунмас.

multiple-annotations-children = `<graph>` иштинде хөй `<annotations>` уруу тывылган; сөөлгүзүнден өскелери санашпас.

## Referring to other components

copy-unrecognized-component-type = Билдинмес компонент хевирин делгедип азы хоолгалап шыдавас: { $type }.

copy-prop-not-found = { $component } хевирлиг компонентиде { $property } шынары тывылбаан

collect-no-source = collect дээш үнер чер тывылбаан.

collect-invalid-component-type = `<{ $component }>` хевирлиг компонентилерни чыып шыдавас, чүге дизе бо шын эвес компонент хевири.

reference-index-unavailable = `{ $reference }` индексче шилчилге кылып шыдавас

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентиде { $action } кыйгырып шыдавас

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Медээлерниң хевири шын эвес. Одуругларның узуну аңгы-аңгы. Тывылган componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Медээлерде баган аттары катаптаттынып турар. Тывылган componentIdx :{ $componentIdx }

data-frame-missing-column-name = Медээлерде баган ады чедишпейн турар. Тывылган componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Бо харыының award утказы answer тегтиң бодунуң чорудупкан харыызынга үндезилеттинген, бо манавааны байдалче чедирер.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` бар контейнер иштинде `<answer>` иже `maxNumAttempts` салыры салдар чедирбес, чүге дизе оралдажыышкыннар санын контейнер тодарадыр. `maxNumAttempts` утказын контейнерже салыңар.

nested-section-wide-check-work-max-num-attempts = Өске `sectionWideCheckWork` контейнер иштинде турар `sectionWideCheckWork` контейнерже `maxNumAttempts` салыры салдар чедирбес, чүге дизе оралдажыышкыннар санын даштыкы контейнер тодарадыр. `maxNumAttempts` утказын даштыкы контейнерже салыңар.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality салдынмаан болза { $attributes } атрибут салдар чедирбес.
       *[other] symbolicEquality салдынмаан болза { $attributes } атрибуттар салдар чедирбес.
    }

answer-invalid-type = answer дээш шын эвес хевир: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентиниң ады чок болганда ону модуль атрибуду кылдыр ажыглап шыдавас

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентини модуль атрибуду кылдыр ажыглап шыдавас, чүге дизе `<module>` компонент хевиринде «{ $name }» атрибут ам-даа тодараттынган.

conditional-content-condition-ignored = case азы else уруглары бар `<conditionalContent>` компонентиде `condition` атрибут санашпас.

slider-markers-type-mismatch = Маркерлерниң хевири шимчедикчиниң хевиринге дүүшпес.

pretzel-problem-needs-statement-and-answer = Шын эвес pretzel: `<problem>` бүрүзү чаңгыс `<statement>` база чаңгыс `<answer>` иштинде турар ужурлуг.

pretzel-circuit-first-problem-distractor = Шын эвес pretzel: mode="circuit" чурумунда баштайгы `<problem>` кичээнгейни оскунар кылдыр турбас ужурлуг.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибутка шын эвес утка { $values }; санашпас.
       *[other] `{ $attribute }` атрибутка шын эвес утказы { $values }; санашпас.
    }

attribute-must-be-references = `{ $attribute }` атрибутка шын эвес утка `{ $value }`. Атрибут `$` демдектен эгелээр шилчилгелерден тургустунган болур ужурлуг.

math-input-invalid-function-names = <mathInput>: { $attribute } иштинде шын эвес функция аттары санашпаан: { $names }. Ат бүрүзүнүң көстүр кезээ эң эвээш 2 демдек болур ужурлуг (ужуктар азы шыйыглар); ооң соонда негеттинмес `|<mathspeak альтернатива>` немелдези кээп болур.

## Building components from the source

component-type-invalid = Шын эвес компонент хевири: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутту катаптап шыдавас.

attribute-invalid-for-component = `<{ $componentType }>` хевирлиг компонентиге шын эвес атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль тодарадылгазында { $context ->
        [text-on-background] текст өңү биле фон өңү
        [high-contrast] бедик контрастылыг өң биле чурук шөлү
        [line] шугум өңү биле чурук шөлү
        [marker] маркер өңү биле чурук шөлү
       *[text-on-canvas] текст өңү биле чурук шөлү
    } аразында контраст четчир эвес{ $mode ->
        [dark] { " (караңгы хевир)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эң эвээш { $threshold }:1 негеттинер).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль тодарадылгазында берген өңнер чырык хевирге четчир контраст берген-даа болза, олардан үнген караңгы хевир өңнери текст биле фон аразынга четчир контраст бербейн турар ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эң эвээш { $threshold }:1 негеттинер). { $suggestion ->
        [available] Караңгы хевирге четчир контраст дээш чырык хевирниң контразын улгаттырыңар (чижээ { $lightAttribute }="{ $lightColor }") азы караңгы хевир өңүн солуңар (чижээ { $darkAttribute }="{ $darkColor }").
       *[none] Караңгы хевирге четчир контраст дээш чырык хевирниң контразын улгаттырыңар азы үнген өңнерни textColorDarkMode база/азы backgroundColorDarkMode-биле солуңар.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль тодарадылгазында берген текст өңү чырык хевирге четчир контраст берген-даа болза, ооң-биле үнген караңгы хевир текст өңү чурук шөлү-биле четчир контраст бербейн турар ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эң эвээш { $threshold }:1 негеттинер). { $suggestion ->
        [available] Караңгы хевирге четчир контраст дээш чырык хевирниң контразын улгаттырыңар (чижээ textColor="{ $lightColor }") азы караңгы хевир өңүн солуңар (чижээ textColorDarkMode="{ $darkColor }").
       *[none] Караңгы хевирге четчир контраст дээш чырык хевирниң контразын улгаттырыңар азы үнген өңнү textColorDarkMode-биле солуңар.
    }

section-multiple-style-palettes = Эге чаңгыс <stylePalette> шилип болур; сөөлгүзү ажыглаттынар.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } дээш катаптаттынмас варианттарны тодарадып шыдавас, чүге дизе numToSelect минус эвес бүдүн сан эвес.

variant-num-to-select-not-constant-number = { $component } дээш катаптаттынмас варианттарны тодарадып шыдавас, чүге дизе numToSelect турум сан эвес.

variant-with-replacement-not-constant-boolean = { $component } дээш катаптаттынмас варианттарны тодарадып шыдавас, чүге дизе withReplacement турум логиктиг утка эвес.

variant-select-weight-disables-unique = кандыг-бир шилилгеде selectWeight азы selectForVariants берген болза, select дээш катаптаттынмас варианттар өжүрлүр

variant-coprime-undetermined = { $component } дээш катаптаттынмас варианттарны тодарадып шыдавас, чүге дизе coprime кезээде меге бе дээрзин тодарадып шыдавас.

variant-attribute-not-constant = { $component } дээш катаптаттынмас варианттарны тодарадып шыдавас, чүге дизе { $attribute } турум эвес.

variant-attribute-not-number = { $component } дээш катаптаттынмас варианттарны тодарадып шыдавас, чүге дизе { $attribute } сан эвес.

variant-attribute-wrong-type-for-sequence =
    { $type } хевирлиг { $component } дээш катаптаттынмас варианттарны тодарадып шыдавас, чүге дизе { $attribute } { $expected ->
        [letters-combination] ужуктар каттыжыышкыны
        [math-expression] таарымчалыг математиктиг илередиишкин
        [integer] бүдүн сан
       *[number] сан
    } эвес.

variant-length-not-integer = { $component } дээш катаптаттынмас варианттарны тодарадып шыдавас, чүге дизе length бүдүн сан эвес.

variant-sort-not-implemented = sort бар { $component } дээш катаптаттынмас варианттар кылдынмаан

variant-exclude-combinations-not-implemented = excludeCombinations бар { $component } дээш катаптаттынмас варианттар кылдынмаан

variant-math-exclude-not-implemented = exclude бар math хевирлиг { $component } дээш катаптаттынмас варианттар кылдынмаан

variant-non-constant-exclude-not-implemented = турум эвес exclude бар { $component } дээш катаптаттынмас варианттар кылдынмаан

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графиктиң prefigure чуруктаарында кылдынмаан; салгакчызы кагдынган.

prefigure-descendant-invalid-geometry = { $subject }: төнчү чок азы долу эвес геометрия; салгакчызы кагдынган.

prefigure-curve-label-omitted = { $subject }: шилчиткен кыйыг элементилерге демдектер кылдынмаан; демдек кагдынган.

prefigure-curve-unsupported-definition-type = { $subject }: кылдынмаан кыйыг функция тодарадылгазының хевири «{ $definitionType }»; салгакчызы кагдынган.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементиниң flipFunctions атрибуду кылдынмаан; салгакчызы кагдынган.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формула-биле берген уруг функцияларны чүгле хүлээп алыр; салгакчызы кагдынган.

prefigure-label-position-unsupported =
    { $subject }: кылдынмаан labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] шугумнар өг-бүлезиниң демдээ дээш
       *[point] точка демдээ дээш
    }; PreFigure-ниң кол деңнештирилгези ажыглаттынар.

prefigure-fill-style-unsupported = { $subject }: долдурар стиль «{ $fillStyle }» PreFigure-ге кылдынмаан; долу долдурарынче шилчиир.

prefigure-line-style-unknown = { $subject }: билдинмес шугум стили «{ $lineStyle }» PreFigure үндүрүлгезинден ужулдурган.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер стили «{ $markerStyle }» PreFigure «diamond» стилинге дүүштүрген.

prefigure-marker-style-unsupported = { $subject }: маркер стили «{ $markerStyle }» PreFigure-ге кылдынмаан; кол стиль ажыглаттынар.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: шын эвес `ref`; сорулганы холбап шыдавас. Демдеглел ужулдурган.

annotation-ref-multiple-targets = `<annotation>`: `ref` хөй сорулга-биле холбашкан; баштайгызы ажыглаттынар.

annotation-ref-outside-graph = `<annotation>`: шын эвес `ref`; сорулга ону иштинде тудуп турар графиктиң дашты. Демдеглел ужулдурган.

annotation-ref-unsupported-target = `<annotation>`: шын эвес `ref`; сорулга prefigure шилчидиишкининде кылдынган график объект эвес. Демдеглел ужулдурган.

annotation-text-missing = `<annotation>`: `text` чок азы куруг; куруг текст үндүрүлүр.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Долгандыр хамаарылга тывылган.
       *[other] `<{ $componentType }>` компонентини иштинде тудуп турар долгандыр хамаарылга тывылган.
    }

reference-no-referent = Шилчилгеге объект тывылбаан: `{ $reference }`

reference-multiple-referents = Шилчилгеге хөй объект тывылган: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементиниң { $attribute } атрибудунуң форматы шын эвес.

children-invalid = `<{ $componentType }>` дээш шын эвес уруглар: шын эвес уруглар тывылган: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибутка шын эвес утка `{ $value }`; `{ $default }` утказы ажыглаттынар

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } хевири тывылбаан.
       *[other] DoenetML { $version } хевири тывылбаан. { $fallback } хевири ажыглаттынар
    }

## Reading the DoenetML

parse-invalid-doenetml = Шын эвес DoenetML: { $content }

parse-tag-missing-close-tag = Шын эвес DoenetML: `{ $tag }` тегтиң хаар тегги чок. Бодун хаар тег азы `</{ $tagName }>` тег манаттынган.

parse-tag-error = Шын эвес DoenetML: `<{ $tagName }>` тегде частырыг

parse-attribute-missing-value = Шын эвес DoenetML: `{ $attribute }` атрибутта утка чедишпейн турар хире.

parse-attribute-invalid = Шын эвес DoenetML: шын эвес атрибут `{ $attribute }`

parse-attribute-value-invalid = Шын эвес DoenetML: атрибуттуң шын эвес утказы `{ $value }`

parse-attribute-value-quote-mismatch = Шын эвес DoenetML: атрибуттуң шын эвес утказы `{ $value }`. Дырбактар дүүшпейн турар. `{ $quote }` чедишпейн турар хире

parse-open-tag-name-missing = Шын эвес DoenetML: ат чок тег тывылган, чижээ `<`

parse-tag-not-closed = Шын эвес DoenetML: `{ $tag }` тег хагдынмаан (`>` чедишпейн турар хире).

parse-self-closing-tag-name-missing = Шын эвес DoenetML: ат чок тег тывылган `<{ $content }>`

parse-self-closing-tag-not-closed = Шын эвес DoenetML: `{ $tag }` тег хагдынмаан (`/>` чедишпейн турар хире).

parse-tag-invalid-attributes = Шын эвес DoenetML: `{ $tag }` тег таарымчалыг эвес. Ооң атрибуттары шын эвес болуп болур.

parse-close-tag-name-missing = Шын эвес DoenetML: ат чок хаар тег тывылган, чижээ `</`

parse-attribute-value-unquoted = Атрибут утказы дырбак иштинде турар ужурлуг: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Шын эвес DoenetML: `{ $tag }` хаар тег тывылган, ынчалза-даа аңаа дүгжүр ажыдар тег чок

parse-close-tag-mismatched = Шын эвес DoenetML: дүүшпес хаар тег. `</{ $expected }>` манаттынган. `{ $found }` тывылган

parser-node-unconvertible = { $node } түңнелди Dast түңнелинче шилчидип шыдаваан.

## Names

name-attribute-invalid =
    Шын эвес атрибут name='{ $name }'. { $reason ->
        [characters] Аттарда ужуктар, саннар, адаккы шыйыглар азы шыйыглар чүгле турар ужурлуг.
       *[start] Аттар ужуктан эгелээр ужурлуг.
    }

component-name-invalid-start = Шын эвес компонент ады «{ $name }». Аттар ужуктан эгелээр ужурлуг.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched хевирлиг answer video атрибуттуг болур ужурлуг

answer-video-watched-video-not-reference = videoWatched хевирлиг answer video атрибуду шилчилге болур ужурлуг

answer-name-not-single-text = answer name атрибуду чаңгыс текст уруглуг болур ужурлуг

## Referencing another document

external-doenetml-recursion-limit = Рекурсия деңнелдери дыка хөй болганда даштыкы DoenetML ап шыдаваан. Долгандыр шилчилге чок бе?

external-doenetml-unavailable = { $attribute }="{ $uri }" адрестен DoenetML ап шыдаваан

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адрестен шын эвес DoenetML алдынган: ол «{ $componentType }» компонент хевиринге дүүшпээн

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут эргижирээн; ооң орнунга `{ $to }` ажыглаңар.
       *[other] [deprecation] `<{ $component }>` элементиниң `{ $from }` атрибуду эргижирээн; ооң орнунга `{ $to }` ажыглаңар.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут эргижирээн база санашпас, чүге дизе `{ $to }` база берген.
       *[other] [deprecation] `<{ $component }>` элементиниң `{ $from }` атрибуду эргижирээн база санашпас, чүге дизе `{ $to }` база берген.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементиниң `{ $attribute }` атрибуду эргижирээн база санашпас.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элементиниң `{ $attribute }` атрибуду эргижирээн; ооң орнунга `<{ $child }>` уруун ажыглаңар.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элементиниң `{ $attribute }` атрибудунуң `{ $value }` утказы эргижирээн; ооң орнунга `{ $to }` ажыглаңар.


## Language coverage

pluralize-english-only = `<pluralize>` хөй санны чүгле англи дылга кылып шыдаар, ынчангаш { $locale } дылга бижиттинген документиде ооң тексти өскерилбейн артар. Хөй сан хевирин боттарыңар бижиңер азы ону `pluralForm` атрибут-биле бериңер.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент билдингир Doenet элементизи эвес.

schema-element-not-allowed-at-root = `<{ $tag }>` элементиге документиниң дазылында чөпшээрел бербес.

schema-element-not-allowed-inside = `<{ $tag }>` элементиге `<{ $parent }>` иштинде чөпшээрел бербес.

schema-attribute-unrecognized = `<{ $tag }>` элементиде `{ $attribute }` деп аттыг атрибут чок.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементиниң `{ $attribute }` атрибуду элемент бүрүзү мындыгларның бирээзи болур даңзы болур ужурлуг: { $allowed }
       *[other] `<{ $tag }>` элементиниң `{ $attribute }` атрибуду мындыгларның бирээзи болур ужурлуг: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select дээш шын эвес вариант ады. { $variantName } вариант ады { $numOptions } шилилгеде таваржып турар, а шилиир саны { $numToSelect }.

select-variant-name-without-options = select дээш варианттар берген, ынчалза-даа болур вариант адынга чаңгыс-даа шилилге чок: { $variantName }.

select-variant-name-not-possible = select дээш берген { $variantName } вариант ады болур вариант ады эвес.

select-too-few-options = Шупту { $numOptions } иштинден { $numToSelect } компонентини шилип шыдавас.

select-from-sequence-too-few-values = Узуну { $length } дараалашкактан { $numToSelect } утканы шилип шыдавас.

select-from-sequence-indices-count-mismatch = select дээш берген индекстер саны шилиир санынга дүүшкен турар ужурлуг

select-from-sequence-indices-not-integers = select дээш берген бүгү индекстер бүдүн сан болур ужурлуг

select-from-sequence-index-excluded = selectfromsequence дээш берген индекс үндүрүлген турган

select-from-sequence-indices-excluded-combination = selectfromsequence дээш берген индекстер үндүрген каттыжыышкын турган

select-from-sequence-coprime-not-positive-integers = Плюстуг бүдүн саннар шилиттинмээн болганда бот-боттарынга барымдаалыг каттыжыышкыннарны шилип шыдавас.

select-from-sequence-coprime-common-factor = Бот-боттарынга барымдаалыг саннарны шилип шыдавас. Болур бүгү утка ниити үлекчилиг. (Берген "from" азы "to" утказы "step"-биле бот-боттарынга барымдаалыг болур ужурлуг.)

select-from-sequence-coprime-single-number = 1 эвес чаңгыс сандан бот-боттарынга барымдаалыг каттыжыышкыннарны шилип шыдавас.

select-from-sequence-excluded-too-many-combinations = selectFromSequence иштинде каттыжыышкыннарның 70%-тен хөйү үндүрүлген

select-from-sequence-coprime-none-found = Бот-боттарынга барымдаалыг саннарны шилип шыдаваан. Болур бүгү утка ниити үлекчилиг.

select-from-sequence-too-few-unique-values = Узуну { $numPossibleValues } дараалашкактан { $numToSelect } аңгы-аңгы утканы шилип шыдавас

select-prime-numbers-too-few-values = Узуну { $numValues } барымдаалыг саннар даңзызындан { $numToSelect } утканы шилип шыдавас

select-prime-numbers-values-count-mismatch = select дээш берген утка саны шилиир санынга дүүшкен турар ужурлуг

select-prime-numbers-values-not-prime = select prime number дээш берген бүгү утка барымдаалыг саннар даңзызында турар ужурлуг

select-prime-numbers-values-excluded-combination = selectPrimeNumbers дээш берген утка үндүрген каттыжыышкын турган

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers иштинде каттыжыышкыннарның 70%-тен хөйү үндүрүлген

select-random-combination-fluke = Дыка болдунмас таварылга-биле таварылгалыг утка каттыжыышкынын шилип шыдаваан

select-random-value-fluke = Дыка болдунмас таварылга-биле таварылгалыг утканы шилип шыдаваан
