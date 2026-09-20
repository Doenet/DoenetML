# Dargwa diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The Akusha-based literary standard, in Cyrillic; see `content.ftl`'s header
# for what that choice leaves out, since Dargwa is a group of varieties rather
# than one language. The palochka Ӏ is a letter, not a Latin I and not a
# digit 1.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Dargwa's class agreement does not reach this file. `content.ftl` explains
# why the fork lives there and only there: Dargwa classes are semantic (male
# human, female human, everything else), and nothing described here is a
# person.
#
# Both `{ $count -> … }` shapes keep their two branches, but a Dargwa noun
# after a numeral stays singular, so the branches differ only in the number
# they print.
#
# The technical vocabulary is the Russian one written Dargwa uses —
# «компонент», «атрибут», «элемент», «функция», «индекс», «переменная» is
# rendered as the transparent Dargwa «дарсдируси» where it is prose. Where a
# plain Dargwa word exists it is used: «хатӀа» error, «кьимат» value, «лугӀи»
# number, «у» name, «хӀярп» letter, «жерге» line or row, «мер» place.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] кӀел ахирла точка гибхӀели { $attributes } пикрилизи хӀебуцу
       *[other] кӀел ахирла точка гибхӀели { $attributes } пикрилизи хӀебуцу
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] ахирла точка ва бухӀнала точка кӀелра гибхӀели { $attributes } пикрилизи хӀебуцу
       *[other] ахирла точка ва бухӀнала точка кӀелра гибхӀели { $attributes } пикрилизи хӀебуцу
    }

line-segment-midpoint-offset-without-midpoint = бухӀнала точка агарли midpointOffset секӀайчи хӀебиркур

## `<line>`

line-points-undetermined-dimensions = Кьадар билгӀабарили ахӀенти точкабазибад башуси линия.

line-points-too-few-dimensions = Линия камлира кӀел кьадар лебти точкабазибад башуси биэс гӀягӀниси саби.

line-points-depend-on-variables = Линия дарсдирути кьиматуначи хӀерси точкабазибад башули саби: { $variables }.

line-equation-invalid-format = { $variable1 } ва { $variable2 } дарсдирутачилси линияла уравнениела формат бархьси ахӀен.

## `<ray>`

ray-overprescribed-through = Луч through, endpoint ва direction сарили гибси саби. Гибси through пикрилизи хӀебуцу.

ray-dimension-mismatch = лучлизиб numDimensions цугхӀебикур.

## `<vector>`

vector-overprescribed-head = Вектор head, tail ва displacement сарили гибси саби. Гибси head пикрилизи хӀебуцу.

vector-dimension-mismatch = векторлизиб numDimensions цугхӀебикур.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элементличи битӀакӀес хӀебирар, сенкӀун илала nearestPoint бикӀуси хӀялла кьимат агара.

constrain-to-without-nearest-point = `<{ $component }>` элементличи дозабирес хӀебирар, сенкӀун илала nearestPoint бикӀуси хӀялла кьимат агара.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементла бухӀнализи дозабирес хӀебирар, сенкӀун илала nearestPoint бикӀуси хӀялла кьимат агара.

## `<choiceInput>`

choice-input-label-position-ignored = жергелизиб ахӀенси choiceInput-лис labelPosition пикрилизи хӀебуцу

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-лис гибти индексуни пикрилизи хӀебуцу, сенкӀун илдала лугӀи choice дурхӀнала лугӀилис цугхӀебикур.

pretzel-indices-count-mismatch = problem-лис гибти индексуни пикрилизи хӀебуцу, сенкӀун илдала лугӀи problem дурхӀнала лугӀилис цугхӀебикур.

shuffle-indices-count-mismatch = shuffle-лис гибти индексуни пикрилизи хӀебуцу, сенкӀун илдала лугӀи компонентунала лугӀилис цугхӀебикур.

indices-ignored-out-of-range = { $component } элементлис гибти индексуни пикрилизи хӀебуцу, сенкӀун цацадехӀ дозализирад дурадулхъан.

pretzel-indices-repeated = pretzel-лис гибти индексуни пикрилизи хӀебуцу, сенкӀун цацадехӀ гьатӀира дучӀули сари.

pretzel-circuit-first-index = circuit режимлизиб pretzel-лис гибти индексуни пикрилизи хӀебуцу, сенкӀун ункъала индекс 1 биэс гӀягӀниси саби.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текстла дурхӀначил хӀянчибирахъес `type` атрибут гес гӀягӀниси саби.

invalid-type-defaulting-to-math = { $component } компонентлис бархьси ахӀенси тип { $type }. Ил math, text, number яра boolean биэс гӀягӀниси саби. math пайдалабиру.

string-not-valid-component-to-arrange = «{ $value }» текст { $component } барес бирути компонент ахӀен. Пикрилизи хӀебуцу.

## Types and variables

invalid-type-defaulting-to-number = Бархьси ахӀенси тип { $type }, тип number бирар.

invalid-variable-value = Дарсдирусила бархьси ахӀенси кьимат: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариантла индекс лугӀи биэс гӀягӀниси саби

variant-index-must-be-integer = { $index } вариантла индекс бухӀнабуцибси лугӀи биэс гӀягӀниси саби

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолютный умцлумас барили ахӀен. Ширина бархбасунсиличи шурбулхъан.

side-by-side-absolute-margins = `<{ $component }>` абсолютный умцлумас барили ахӀен. Дубани бархбасунсиличи шурдулхъан.

side-by-side-no-block-child = Бархьси ахӀенси `<{ $component }>`: илала камлира ца блок дурхӀя биэс гӀягӀниси саби.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элементла `for` атрибут пикрилизи хӀебуцу.

label-for-must-resolve-to-one = `<label>` элементла `for` атрибут ца компонентличи бен хӀерси биэс гӀягӀниси саби.

label-for-unresolved = `<label>` элементла `for` атрибут компонентличил бархбасахъес хӀебирар.

label-for-answer-with-authored-inputs = `<label>` элементла `for` атрибут авторли делкӀунти чебухъантачилси `<answer>` элементличи хӀерси саби; чебухъанничи гьаннала хӀерси биахъа.

label-for-answer-without-input = `<label>` элементла `for` атрибут лишанбирес чебухъан агарси `<answer>` элементличи хӀерси саби.

label-for-must-reference-input-or-answer = `<label>` элементла `for` атрибут чебухъанничи яра жавабличи хӀерси биэс гӀягӀниси саби.

## Accessibility

accessibility-short-description-or-decorative = Гьаргдешлис `<{ $component }>` элементла къантӀси баян биэс гӀягӀниси саби, яра ил жагабирусиличи халбарес гӀягӀниси саби.

accessibility-video-short-description = Гьаргдешлис `<video>` элементла къантӀси баян биэс гӀягӀниси саби.

accessibility-input-short-description-or-label = Гьаргдешлис `<{ $component }>` элементла къантӀси баян яра лишан биэс гӀягӀниси саби.

accessibility-answer-input-short-description-or-label = Гьаргдешлис чебухъан бируси `<answer>` элементла къантӀси баян яра лишан биэс гӀягӀниси саби.

accessibility-short-description-contains-math = КъантӀти баянтазир `<{ $component }>` гъуна математикала компонентуни диэс хӀейгеси саби. Математика девлумачил белкӀа.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } бикӀусилис бекӀла текстлис гӀягӀниси контраст агара (цӀудара режим) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; камлира { $threshold }:1 гӀягӀниси саби).
       *[other] { $colorName } бикӀусилис бекӀла текстлис гӀягӀниси контраст агара ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; камлира { $threshold }:1 гӀягӀниси саби).
    }

## `<circle>`

circle-through-points-non-numerical = Точкабала лугӀила кьиматуни агархӀели { $count } точкализирад башуси `<circle>` барили ахӀен.

circle-too-many-through-points = ХӀябал точкалицад имцӀалирад башуси окружность хӀисаббарес хӀебирар.

circle-overprescribed-radius-center-points = Гибси радиус, юкӀ ва точкаби лерли окружность хӀисаббарес хӀебирар.

circle-center-with-multiple-points = Гибси юкӀличил ца точкалицад имцӀалирад башуси окружность хӀисаббарес хӀебирар.

circle-radius-too-small = Окружность хӀисаббарес хӀебирар: кӀел точкала ургабси гьуни { $distance } биублихӀели, гибси радиус { $radius } бегӀлара биштӀаси саби.

circle-radius-with-many-points = Гибси радиусличил кӀел точкалицад имцӀалирад башуси окружность барес хӀебирар.

circle-invalid-center-or-through-points = Окружностьла юкӀ яра точкаби бархьти ахӀен.

circle-radius-center-with-multiple-points = Гибси юкӀличил ца точкалицад имцӀалирад башуси окружностьла радиус хӀисаббарес хӀебирар.

circle-change-radius-non-numerical = ЛугӀила кьиматуни агарти точкабачилси окружностьла радиус дарсбарес хӀебирар

circle-radius-with-points-non-numerical = ЛугӀила кьиматуни агархӀели гибси радиусличил ца точкалицад имцӀалирад башуси окружность барес хӀебирар.

circle-change-center-non-numerical = ЛугӀила кьиматуни агарти точкабазирад башуси окружностьла юкӀ дарсбирни барили ахӀен.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцияла областьла кьадар камли саби. Областьлизиб { $intervals } интервал леб, функциялизиб биалли { $inputs ->
            [one] { $inputs } вход
           *[other] { $inputs } вход
        } леб.
       *[other] Функцияла областьла кьадар камли саби. Областьлизиб { $intervals } интервал леб, функциялизиб биалли { $inputs ->
            [one] { $inputs } вход
           *[other] { $inputs } вход
        } леб.
    }

function-domain-invalid-format = Функцияла областьла формат бархьси ахӀен.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцияла лугӀила ахӀенси максимум пикрилизи хӀебуцу.
        [minimum] Функцияла лугӀила ахӀенси минимум пикрилизи хӀебуцу.
        [extremum] Функцияла лугӀила ахӀенси экстремум пикрилизи хӀебуцу.
        [point] Функцияла лугӀила ахӀенси точка пикрилизи хӀебуцу.
        [slope] Функцияла лугӀила ахӀенси наклон пикрилизи хӀебуцу.
       *[other] Функцияла лугӀила ахӀенси { $type } пикрилизи хӀебуцу.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцияла бацӀси максимум пикрилизи хӀебуцу.
        [minimum] Функцияла бацӀси минимум пикрилизи хӀебуцу.
        [extremum] Функцияла бацӀси экстремум пикрилизи хӀебуцу.
        [point] Функцияла бацӀси точка пикрилизи хӀебуцу.
       *[other] Функцияла бацӀси { $type } пикрилизи хӀебуцу.
    }

function-points-too-close = Функциялизир цаличи ца бегӀлара гъамли кадиибти кӀел точка лер. Функция билгӀабарес хӀебирар.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функцияла итерацияби дирар входунала лугӀи выходунала лугӀилис цугбикибхӀели бен. Иш функциялизиб { $inputs } вход ва { $outputs ->
            [one] { $outputs } выход
           *[other] { $outputs } выход
        } леб.
       *[other] Функцияла итерацияби дирар входунала лугӀи выходунала лугӀилис цугбикибхӀели бен. Иш функциялизиб { $inputs } вход ва { $outputs ->
            [one] { $outputs } выход
           *[other] { $outputs } выход
        } леб.
    }

## `<sequence>`

sequence-invalid-length = Последовательностьла бухъяндеш бархьси ахӀен. Ил минусличил ахӀенси бухӀнабуцибси лугӀи биэс гӀягӀниси саби.

sequence-invalid-step = Последовательностьла шаг бархьси ахӀен. { $type } типла последовательностьлис ил лугӀи биэс гӀягӀниси саби.

sequence-invalid-endpoint-number = ЛугӀила последовательностьла «{ $attribute }» бархьси ахӀен. Ил лугӀи биэс гӀягӀниси саби.

sequence-invalid-endpoint-letters = ХӀярпунала последовательностьла «{ $attribute }» бархьси ахӀен. Ил хӀярпунала цалабикни биэс гӀягӀниси саби.

sequence-invalid-endpoint = Последовательностьла «{ $attribute }» бархьси ахӀен.

select-from-sequence-coprime-not-numbers = лугӀни чердикӀули ахӀенти сабливан coprime пикрилизи хӀебуцу

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations гибси сабливан coprime пикрилизи хӀебуцу

## Resolving a `target`

target-not-found = `<{ $source }>` элементлис бархьси ахӀенси target: мурад хӀебаргиб.

target-state-variable-not-found = `<{ $source }>` элементлис бархьси ахӀенси target: `<{ $component }>` элементлизиб «{ $property }» бикӀуси хӀялла кьимат хӀебаргиб.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` элементла дарсдирути сунезибадал ахӀенси дарсдирусиличибад декӀарти диэс гӀягӀнити сари.

ode-system-duplicate-variable-names = ГьатӀира дучӀути умани лерти дарсдирутачил ДУ-ла аьтула функцияби билгӀадарес хӀедирар.

ode-system-rhs-function-error = ДУ-ла аьтула функция билгӀабарес хӀебирар. mathjs функция барухӀели хатӀа.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } линияла ургабси угол билгӀабарес хӀебирар

angle-invalid-through-point = `<angle>` элементла through бикӀусилизиб бархьси ахӀенси точка

parabola-vertex-too-many-points = Гибси бекӀличил ца точкалицад имцӀалирад башуси парабола барили ахӀен.

parabola-too-many-points = ХӀябал точкалицад имцӀалирад башуси парабола барили ахӀен.

intersection-too-many-items = КӀел секӀайцад имцӀали секӀайс кабикибси мер барили ахӀен

## Other math components

ionic-compound-not-two-ions = КӀел ионничибад декӀарси ионтала цалабикни барили ахӀен.

ionic-compound-needs-cation-and-anion = Ионтала цалабикни ца катионнис ва ца анионнис бен барили ахӀен.

solve-equations-cannot-evaluate = Уравнение арзес хӀебирар, сенкӀун ил хӀисаббарес хӀебиуб: { $equation }

math-operators-operand-number-required = Математикала операнд касес operandNumber гес гӀягӀниси саби.

eigen-decomposition-failed = Матрицала сунела кьиматуни хӀисабдарес хӀедиуб

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр шаблонализиб агара, гьадила ил даимлис бацӀсиличил цугбикур.
       *[other] `<matchesPattern>`: { $parameters } параметруни шаблонализир агара, гьадила илди даимлис бацӀсиличил цугдикур.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" бикӀусила мягӀна бургес хӀебирар. Ил none, medium, dense яра мер-мерличил декӀарбарибти кӀел плюсла лугӀи биэс гӀягӀниси саби, масала grid="1 0.5". Сетка хӀебалкьахъу.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` элементлис гӀягӀниси функциялизиб { $expected ->
        [one] ца выход, гьар точкализибси наклон y', масала `y - x`,
       *[other] кӀел выход, гьар точкализибси вектор, масала `(y, -x)`,
    } биэс гӀягӀниси саби, гибси функциялизиб биалли { $found ->
        [one] { $found } выход
       *[other] { $found } выход
    } леб. { $alternative ->
        [none] СекӀалра хӀебалкьахъу.
       *[other] Ил функциялис `<{ $alternative }>` компонент саби. СекӀалра хӀебалкьахъу.
    }

field-function-attribute-ignored-with-child = `function` атрибут пикрилизи хӀебуцу, сенкӀун функция компонентла бухӀнабра гибси саби; бухӀнабси пайдалабиру. Функция кӀелрад ца гьунчиб бен ма гу.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибутли компонентла бухӀнаб белкӀунси выражениела дарсдирути умдеш. { $reason ->
        [function-child] Иш функция `<function>` дурхӀя сабливан гибси саби, илини сунела дарсдирути сунени умдеш, гьадила `variables` пикрилизи хӀебуцу.
       *[no-expression] ИшбахӀ ил гъуна выражение агара, гьадила `variables` пикрилизи хӀебуцу.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure бирусилизиб xLabelPosition="left" барили ахӀен; аьтула мерла къяйда пайдалабиру.

prefigure-y-label-position-unsupported = `<graph>`: prefigure бирусилизиб yLabelPosition="bottom" барили ахӀен; чедила мерла къяйда пайдалабиру.

prefigure-invalid-axis-bounds = `<graph>`: prefigure-личи шурбатес осьла дозани бархьти ахӀен; бехӀбихьудла bbox (-10,-10,10,10) пайдалабиру.

prefigure-invalid-width = `<graph>`: prefigure-личи шурбатес ширина бархьси ахӀен; диаграммала бехӀбихьудла ширина 425 пайдалабиру.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure-личи шурбатес aspectRatio бархьси ахӀен; бехӀбихьудла бяхӀянала кьадар 1 пайдалабиру.

prefigure-grid-spacing-too-fine = `<graph>`: сеткала шаг осьла дозанас бегӀлара биштӀаси саби; prefigure бирусилизиб сетка хӀебалкьахъу.

prefigure-annotations-not-rendered = `<graph>`: PreFigure бируси хӀепайдалабирухӀели лишанти хӀедалкьахъу.

multiple-annotations-children = `<graph>` бухӀнаб дахъал `<annotations>` дурхӀни даргиб; ахирличибсиличибад декӀарти лерилра пикрилизи хӀедуцу.

## Referring to other components

copy-unrecognized-component-type = Бевзуси ахӀенси компонентла тип бушбарес яра копия барес хӀебирар: { $type }.

copy-prop-not-found = { $component } типла компонентлизиб { $property } бикӀуси хасдеш хӀебаргиб

collect-no-source = collect-лис хьулчи хӀебаргиб.

collect-invalid-component-type = `<{ $component }>` типла компонентуни цалабирхъес хӀедирар, сенкӀун ил бархьси ахӀенси компонентла тип саби.

reference-index-unavailable = `{ $reference }` бикӀуси индексличи хӀерси барес хӀебирар

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентлизиб { $action } жибарес хӀебирар

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Хабардала кеп бархьси ахӀен. Жергнала бухъяндеш цугхӀебикур. Баргибси componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Хабардализир столбецунала умани гьатӀира дучӀули сари. Баргибси componentIdx :{ $componentIdx }

data-frame-missing-column-name = Хабардализиб столбецла у агара. Баргибси componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Иш жавабла award сунела answer тегли бархьибси жавабличи хӀерси саби, илини хӀебалуси хӀялличи биркахъес асубирар.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` лебси контейнерла бухӀнабси `<answer>` элементлис `maxNumAttempts` кабизахъни секӀайчи хӀебиркур, сенкӀун попыткабала лугӀи контейнерли билгӀабиру. `maxNumAttempts` контейнерлис кабизахъа.

nested-section-wide-check-work-max-num-attempts = ЦархӀил `sectionWideCheckWork` лебси контейнерла бухӀнабси `sectionWideCheckWork` лебси контейнерлис `maxNumAttempts` кабизахъни секӀайчи хӀебиркур, сенкӀун попыткабала лугӀи дурала контейнерли билгӀабиру. `maxNumAttempts` дурала контейнерлис кабизахъа.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality кабизахъили агарли { $attributes } атрибут секӀайчи хӀебиркур.
       *[other] symbolicEquality кабизахъили агарли { $attributes } атрибутуни секӀайчи хӀедиркур.
    }

answer-invalid-type = answer-лис бархьси ахӀенси тип: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентла у агара, гьадила ил модульла атрибут сабливан пайдалабарес хӀебирар

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонент модульла атрибут сабливан пайдалабарес хӀебирар, сенкӀун `<module>` компонентла типлизиб гьаннала «{ $name }» атрибут билгӀабарибси саби.

conditional-content-condition-ignored = case яра else дурхӀни лерти `<conditionalContent>` компонентлизиб `condition` атрибут пикрилизи хӀебуцу.

slider-markers-type-mismatch = Маркертала тип ползунокла типлис цугхӀебикур.

pretzel-problem-needs-statement-and-answer = Бархьси ахӀенси pretzel: гьар `<problem>` бухӀнаб ца `<statement>` ва ца `<answer>` биэс гӀягӀниси саби.

pretzel-circuit-first-problem-distractor = Бархьси ахӀенси pretzel: mode="circuit" режимлизиб ункъала `<problem>` пикри архьуси биэс хӀейгеси саби.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибутлис бархьси ахӀенси кьимат { $values }; пикрилизи хӀебуцу.
       *[other] `{ $attribute }` атрибутлис бархьти ахӀенти кьиматуни { $values }; пикрилизи хӀедуцу.
    }

attribute-must-be-references = `{ $attribute }` атрибутлис бархьси ахӀенси кьимат `{ $value }`. Атрибут `$` лишанничибад бехӀбирхьути хӀерсиличибад кабикибси биэс гӀягӀниси саби.

math-input-invalid-function-names = <mathInput>: { $attribute } бухӀнабси бархьти ахӀенти функцияла умани пикрилизи хӀедуциб: { $names }. Гьар ула чебиуси бутӀализиб камлира 2 лишан биэс гӀягӀниси саби (хӀярпани яра дефисуни); илала гӀергъи гӀягӀниси ахӀенси `|<mathspeak альтернатива>` кабиркес асубирар.

## Building components from the source

component-type-invalid = Бархьси ахӀенси компонентла тип: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибут гьатӀира белкӀес хӀебирар.

attribute-invalid-for-component = `<{ $componentType }>` типла компонентлис бархьси ахӀенси атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стильла билгӀабарнилизиб { $context ->
        [text-on-background] текстла ранг ва фонна ранг
        [high-contrast] халаси контрастла ранг ва суратла мер
        [line] линияла ранг ва суратла мер
        [marker] маркерла ранг ва суратла мер
       *[text-on-canvas] текстла ранг ва суратла мер
    } ургаб гӀягӀниси контраст агара{ $mode ->
        [dark] { " (цӀудара режим)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; камлира { $threshold }:1 гӀягӀниси саби).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стильла билгӀабарнилизиб гибти рангани шаласи режимлис гӀягӀниси контраст лугули диалра, илдазирад дурадухъунти цӀудара режимла ранганас текстла ва фонна ургаб гӀягӀниси контраст агара ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; камлира { $threshold }:1 гӀягӀниси саби). { $suggestion ->
        [available] ЦӀудара режимлизиб гӀягӀниси контраст биахъес, яра шаласи режимла контраст имцӀабара (масала { $lightAttribute }="{ $lightColor }" кабизахъа), яра цӀудара режимла ранг дарсбара (масала { $darkAttribute }="{ $darkColor }" кабизахъа).
       *[none] ЦӀудара режимлизиб гӀягӀниси контраст биахъес шаласи режимла контраст имцӀабара, яра дурадухъунти рангани textColorDarkMode ва/яра backgroundColorDarkMode-личил дарсдара.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стильла билгӀабарнилизиб гибси текстла ранг шаласи режимлис гӀягӀниси контраст лугули биалра, илизирад дурабухъунси цӀудара режимла текстла рангли суратла мерличил гӀягӀниси контраст хӀелугу ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; камлира { $threshold }:1 гӀягӀниси саби). { $suggestion ->
        [available] ЦӀудара режимлизиб гӀягӀниси контраст биахъес, яра шаласи режимла контраст имцӀабара (масала textColor="{ $lightColor }" кабизахъа), яра цӀудара режимла ранг дарсбара (масала textColorDarkMode="{ $darkColor }" кабизахъа).
       *[none] ЦӀудара режимлизиб гӀягӀниси контраст биахъес шаласи режимла контраст имцӀабара, яра дурабухъунси ранг textColorDarkMode-личил дарсбара.
    }

section-multiple-style-palettes = БекӀли ца <stylePalette> бен чеббикӀес хӀебирар; ахирличибси пайдалабиру.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } элементла декӀар-декӀарти вариантуни билгӀадарес хӀедирар, сенкӀун numToSelect минусличил ахӀенси бухӀнабуцибси лугӀи ахӀен.

variant-num-to-select-not-constant-number = { $component } элементла декӀар-декӀарти вариантуни билгӀадарес хӀедирар, сенкӀун numToSelect дарсхӀебируси лугӀи ахӀен.

variant-with-replacement-not-constant-boolean = { $component } элементла декӀар-декӀарти вариантуни билгӀадарес хӀедирар, сенкӀун withReplacement дарсхӀебируси логикала кьимат ахӀен.

variant-select-weight-disables-unique = ца харжлизиб selectWeight яра selectForVariants гибси биалли, select-ла декӀар-декӀарти вариантуни хӀедирар

variant-coprime-undetermined = { $component } элементла декӀар-декӀарти вариантуни билгӀадарес хӀедирар, сенкӀун coprime даимлис къяна саби или билгӀабарес хӀебирар.

variant-attribute-not-constant = { $component } элементла декӀар-декӀарти вариантуни билгӀадарес хӀедирар, сенкӀун { $attribute } дарсхӀебируси ахӀен.

variant-attribute-not-number = { $component } элементла декӀар-декӀарти вариантуни билгӀадарес хӀедирар, сенкӀун { $attribute } лугӀи ахӀен.

variant-attribute-wrong-type-for-sequence =
    { $type } типла { $component } элементла декӀар-декӀарти вариантуни билгӀадарес хӀедирар, сенкӀун { $attribute } { $expected ->
        [letters-combination] хӀярпунала цалабикни
        [math-expression] бархьси математикала выражение
        [integer] бухӀнабуцибси лугӀи
       *[number] лугӀи
    } ахӀен.

variant-length-not-integer = { $component } элементла декӀар-декӀарти вариантуни билгӀадарес хӀедирар, сенкӀун length бухӀнабуцибси лугӀи ахӀен.

variant-sort-not-implemented = sort лебси { $component } элементла декӀар-декӀарти вариантуни дарили ахӀен

variant-exclude-combinations-not-implemented = excludeCombinations лебси { $component } элементла декӀар-декӀарти вариантуни дарили ахӀен

variant-math-exclude-not-implemented = exclude лебси math типла { $component } элементла декӀар-декӀарти вариантуни дарили ахӀен

variant-non-constant-exclude-not-implemented = дарсбируси exclude лебси { $component } элементла декӀар-декӀарти вариантуни дарили ахӀен

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графикла prefigure бирусилизиб барили ахӀен; тухум архьибси саби.

prefigure-descendant-invalid-geometry = { $subject }: ахир агарси яра таманси ахӀенси геометрия; тухум архьибси саби.

prefigure-curve-label-omitted = { $subject }: шурбатурти кривая элементуначир лишанти дарили ахӀен; лишан архьибси саби.

prefigure-curve-unsupported-definition-type = { $subject }: барили ахӀенси кривая функцияла билгӀабарнила тип «{ $definitionType }»; тухум архьибси саби.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементла flipFunctions атрибут барили ахӀен; тухум архьибси саби.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves элементлис формулала типла дурхӀнала функцияби бен хӀедуцу; тухум архьибси саби.

prefigure-label-position-unsupported =
    { $subject }: барили ахӀенси labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] линиябала тухумла лишанлис
       *[point] точкала лишанлис
    }; PreFigure-ла бехӀбихьудла кабизахъни пайдалабиру.

prefigure-fill-style-unsupported = { $subject }: бицӀнила стиль «{ $fillStyle }» PreFigure-ли хӀебуцу; лерилра бицӀуси рангличи шурбулхъан.

prefigure-line-style-unknown = { $subject }: бевзуси ахӀенси линияла стиль «{ $lineStyle }» PreFigure-ла дурабуцнилизирад архьибси саби.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркерла стиль «{ $markerStyle }» PreFigure-ла «diamond» стильличил цугбарибси саби.

prefigure-marker-style-unsupported = { $subject }: маркерла стиль «{ $markerStyle }» PreFigure-ли хӀебуцу; бехӀбихьудла стиль пайдалабиру.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: бархьси ахӀенси `ref`; мурад баргес хӀебирар. Лишан архьибси саби.

annotation-ref-multiple-targets = `<annotation>`: `ref` дахъал мурадуначил бархбасунси саби; ункъала мурад пайдалабиру.

annotation-ref-outside-graph = `<annotation>`: бархьси ахӀенси `ref`; мурад сунезибси графикла дураб саби. Лишан архьибси саби.

annotation-ref-unsupported-target = `<annotation>`: бархьси ахӀенси `ref`; мурад prefigure-личи шурбатнилизиб бируси график секӀал ахӀен. Лишан архьибси саби.

annotation-text-missing = `<annotation>`: `text` агара яра бацӀси саби; бацӀси текст дурабулхъан.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Гуми гъуна хӀерси баргибси саби.
       *[other] `<{ $componentType }>` компонентличилси гуми гъуна хӀерси баргибси саби.
    }

reference-no-referent = ХӀерсилис мурад хӀебаргиб: `{ $reference }`

reference-multiple-referents = ХӀерсилис дахъал мурадуни даргиб: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементла { $attribute } атрибутла формат бархьси ахӀен.

children-invalid = `<{ $componentType }>` элементлис бархьти ахӀенти дурхӀни: бархьти ахӀенти дурхӀни даргиб: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибутлис бархьси ахӀенси кьимат `{ $value }`; `{ $default }` кьимат пайдалабиру

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версия хӀебаргиб.
       *[other] DoenetML { $version } версия хӀебаргиб. { $fallback } версия пайдалабиру
    }

## Reading the DoenetML

parse-invalid-doenetml = Бархьси ахӀенси DoenetML: { $content }

parse-tag-missing-close-tag = Бархьси ахӀенси DoenetML: `{ $tag }` тегла кӀапӀбируси тег агара. Сунени сай кӀапӀбируси тег яра `</{ $tagName }>` тег хӀяжатси сабри.

parse-tag-error = Бархьси ахӀенси DoenetML: `<{ $tagName }>` теглизиб хатӀа

parse-attribute-missing-value = Бархьси ахӀенси DoenetML: `{ $attribute }` атрибутлис кьимат агарсиван саби.

parse-attribute-invalid = Бархьси ахӀенси DoenetML: бархьси ахӀенси атрибут `{ $attribute }`

parse-attribute-value-invalid = Бархьси ахӀенси DoenetML: атрибутла бархьси ахӀенси кьимат `{ $value }`

parse-attribute-value-quote-mismatch = Бархьси ахӀенси DoenetML: атрибутла бархьси ахӀенси кьимат `{ $value }`. Кавычкаби цугхӀедикур. `{ $quote }` агарсиван саби

parse-open-tag-name-missing = Бархьси ахӀенси DoenetML: у агарси тег баргибси саби, масала `<`

parse-tag-not-closed = Бархьси ахӀенси DoenetML: `{ $tag }` тег кӀапӀбарили ахӀен (`>` агарсиван саби).

parse-self-closing-tag-name-missing = Бархьси ахӀенси DoenetML: у агарси тег баргибси саби `<{ $content }>`

parse-self-closing-tag-not-closed = Бархьси ахӀенси DoenetML: `{ $tag }` тег кӀапӀбарили ахӀен (`/>` агарсиван саби).

parse-tag-invalid-attributes = Бархьси ахӀенси DoenetML: `{ $tag }` тег бархьси ахӀен. Илала атрибутуни бархьти ахӀенти диэс асубирар.

parse-close-tag-name-missing = Бархьси ахӀенси DoenetML: у агарси кӀапӀбируси тег баргибси саби, масала `</`

parse-attribute-value-unquoted = Атрибутла кьиматуни кавычкабала бухӀнар диэс гӀягӀнити сари: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Бархьси ахӀенси DoenetML: `{ $tag }` кӀапӀбируси тег баргибси саби, амма илис цугбикуси абхьибси тег агара

parse-close-tag-mismatched = Бархьси ахӀенси DoenetML: цугхӀебикуси кӀапӀбируси тег. `</{ $expected }>` хӀяжатси сабри. `{ $found }` баргибси саби

parser-node-unconvertible = { $node } узел Dast узелличи шурбатес хӀебиуб.

## Names

name-attribute-invalid =
    Бархьси ахӀенси атрибут name='{ $name }'. { $reason ->
        [characters] Умазир хӀярпани, лугӀни, удила сизри яра дефисуни бен диэс хӀедирар.
       *[start] Умани хӀярпличибад дехӀдирхьути диэс гӀягӀнити сари.
    }

component-name-invalid-start = Бархьси ахӀенси компонентла у «{ $name }». Умани хӀярпличибад дехӀдирхьути диэс гӀягӀнити сари.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched типла answer-лизиб video атрибут биэс гӀягӀниси саби

answer-video-watched-video-not-reference = videoWatched типла answer-ла video атрибут хӀерси биэс гӀягӀниси саби

answer-name-not-single-text = answer-ла name атрибутлизиб ца текстла дурхӀя бен биэс хӀейгеси саби

## Referencing another document

external-doenetml-recursion-limit = Рекурсияла даражаби бегӀлара дахъал сарливан дурала DoenetML касес хӀебиуб. Гуми гъуна хӀерси лебалав?

external-doenetml-unavailable = { $attribute }="{ $uri }" бикӀусилизирад DoenetML касес хӀебиуб

external-doenetml-type-mismatch = { $attribute }="{ $uri }" бикӀусилизирад бархьси ахӀенси DoenetML касибси саби: ил «{ $componentType }» компонентла типлис цугхӀебикиб

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут гӀелабси саби; илала мерличиб `{ $to }` пайдалабара.
       *[other] [deprecation] `<{ $component }>` элементла `{ $from }` атрибут гӀелабси саби; илала мерличиб `{ $to }` пайдалабара.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут гӀелабси саби ва пикрилизи хӀебуцу, сенкӀун `{ $to }` бирахъалра гибси саби.
       *[other] [deprecation] `<{ $component }>` элементла `{ $from }` атрибут гӀелабси саби ва пикрилизи хӀебуцу, сенкӀун `{ $to }` бирахъалра гибси саби.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементла `{ $attribute }` атрибут гӀелабси саби ва пикрилизи хӀебуцу.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элементла `{ $attribute }` атрибут гӀелабси саби; илала мерличиб `<{ $child }>` дурхӀя пайдалабара.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элементла `{ $attribute }` атрибутла `{ $value }` кьимат гӀелабси саби; илала мерличиб `{ $to }` пайдалабара.


## Language coverage

pluralize-english-only = `<pluralize>` ингилис мезличиб бен дахъалсиличи шурбатес хӀебирар, гьадила { $locale } мезличиб белкӀунси документлизиб илала текст дарсхӀебарили кализур. Дахъалсила кеп сунени белкӀа, яра ил `pluralForm` атрибутличил кабизахъа.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент бевзуси Doenet элемент ахӀен.

schema-element-not-allowed-at-root = `<{ $tag }>` элементлис документла хьулчилизиб бажардидеш агара.

schema-element-not-allowed-inside = `<{ $tag }>` элементлис `<{ $parent }>` бухӀнаб бажардидеш агара.

schema-attribute-unrecognized = `<{ $tag }>` элементлизиб `{ $attribute }` бикӀуси атрибут агара.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементла `{ $attribute }` атрибут гьар секӀал иштазирад цали бируси список биэс гӀягӀниси саби: { $allowed }
       *[other] `<{ $tag }>` элементла `{ $attribute }` атрибут иштазирад ца биэс гӀягӀниси саби: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select-лис бархьси ахӀенси вариантла у. { $variantName } вариантла у { $numOptions } харжлизиб бургу, чеббикӀес гӀягӀнити биалли { $numToSelect } сари.

select-variant-name-without-options = select-лис цацадехӀ вариантуни гибти сари, амма биэс бируси вариантла улис ца харжра агара: { $variantName }.

select-variant-name-not-possible = select-лис гибси { $variantName } вариантла у биэс бируси вариантла у ахӀен.

select-too-few-options = Ца { $numOptions } секӀайзирад { $numToSelect } компонент чеббикӀес хӀебирар.

select-from-sequence-too-few-values = Бухъяндеш { $length } сабси последовательностьлизирад { $numToSelect } кьимат чеббикӀес хӀебирар.

select-from-sequence-indices-count-mismatch = select-лис гибти индексунала лугӀи чеббикӀес гӀягӀнитала лугӀилис цугбикуси биэс гӀягӀниси саби

select-from-sequence-indices-not-integers = select-лис гибти лерилра индексуни бухӀнабуцибти лугӀни диэс гӀягӀнити сари

select-from-sequence-index-excluded = дурабуцибси selectfromsequence-ла индекс гибси сабри

select-from-sequence-indices-excluded-combination = дурабуцибси цалабикни сабси selectfromsequence-ла индексуни гибти сарри

select-from-sequence-coprime-not-positive-integers = плюсла бухӀнабуцибти лугӀни чердикӀули ахӀенти сабливан цаличи ца хьалхаагарти цалабикни чердикӀес хӀедирар.

select-from-sequence-coprime-common-factor = Цаличи ца хьалхаагарти лугӀни чердикӀес хӀедирар. Биэс бирути лерилра кьиматунас ца цугси бутӀуси леб. (Гибти "from" яра "to" кьиматуни "step"-личи хьалхаагарти диэс гӀягӀнити сари.)

select-from-sequence-coprime-single-number = 1 ахӀенси ца лугӀилизирад цаличи ца хьалхаагарти цалабикни чердикӀес хӀедирар.

select-from-sequence-excluded-too-many-combinations = selectFromSequence бухӀнаб цалабикнала 70%-личибад имцӀали дурадуциб

select-from-sequence-coprime-none-found = Цаличи ца хьалхаагарти лугӀни чердикӀес хӀедиуб. Биэс бирути лерилра кьиматунас ца цугси бутӀуси леб.

select-from-sequence-too-few-unique-values = Бухъяндеш { $numPossibleValues } сабси последовательностьлизирад { $numToSelect } декӀарси кьимат чеббикӀес хӀебирар

select-prime-numbers-too-few-values = Бухъяндеш { $numValues } сабси ункъала лугӀнала спискализирад { $numToSelect } кьимат чеббикӀес хӀебирар

select-prime-numbers-values-count-mismatch = select-лис гибти кьиматунала лугӀи чеббикӀес гӀягӀнитала лугӀилис цугбикуси биэс гӀягӀниси саби

select-prime-numbers-values-not-prime = select prime number-лис гибти лерилра кьиматуни ункъала лугӀнала спискализир диэс гӀягӀнити сари

select-prime-numbers-values-excluded-combination = дурабуцибси цалабикни сабси selectPrimeNumbers-ла кьиматуни гибти сарри

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers бухӀнаб цалабикнала 70%-личибад имцӀали дурадуциб

select-random-combination-fluke = БегӀлара камли биэс бируси хӀялли хӀебалуси кьиматунала цалабикни чеббикӀес хӀебиуб

select-random-value-fluke = БегӀлара камли биэс бируси хӀялли хӀебалуси кьимат чеббикӀес хӀебиуб
