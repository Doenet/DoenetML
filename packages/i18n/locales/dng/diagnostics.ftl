# Dungan (хуэйзў хуа / хуэйзў йүян) diagnostics — the errors and warnings put
# in front of whoever is looking at the screen. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Element names, attribute names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written, as does anything quoted back from the
# author's own source. The `[deprecation]` marker is a literal and is left
# alone. Message ids are never translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Standard Dungan Cyrillic — the Soviet-era alphabet still
# current in Kyrgyzstan and Kazakhstan: Russian letters plus **ә, җ, ң, ў, ү**.
# **Tones are unmarked**, as that orthography leaves them: no accent, no
# macron, no tone digit, no tone letter, in this or any of the other three
# files. A corrector must not add one, and must not mix in **pinyin** (`zh`,
# `x`, `q`, `ü` are written `җ`, `щ`, `ч`, `ү` here) or **Chinese characters**.
#
# **Word order and grammar.** Modifier before noun with the attributive
# particle **«ди»** — «будуй ди значение», «{ $component } ди тип». No gender,
# no agreement, no case. Number is not marked after a numeral, and CLDR has no
# plural data for `dng` at all, so every count select here is **collapsed to a
# single `*[other]`**. Two selects keep their `[one]` branch on purpose —
# `field-function-wrong-num-outputs`'s `$expected` — because there the branches
# say two different things (one output is a slope, two are a vector) rather
# than agreeing a noun with a number.
#
# **Loans.** This catalog is the most Russian of the four, and deliberately so.
# Doenet's diagnostics are written in the vocabulary of a discipline Dungan
# speakers study in **Russian**; there is no Dungan word for an attribute, a
# component, a matrix, a variant or a sequence, and none is invented here. So
# the frame is Dungan — «будуй» (wrong), «бунын» (cannot), «җаобуҗо» (cannot
# find), «бищү» (must), «бугуан» (ignoring), «хэ мый шыщян» (not implemented
# yet), «мый юң» (has no effect) — and the nouns are the Russian words as
# written, **uninflected** in the nominative, because Dungan does not decline
# and a guessed case ending would be a claim this seed cannot check. A speaker
# should feel free to replace any of them.
#
# Russian loans used below include: атрибут, компонент, элемент, значение,
# тип, функция, интервал, координата, матрица, вариант, версия, документ,
# ошибка, символ, формула, комбинация, индекс, список, стиль, фон, контраст,
# рендерер, аннотация, ссылка, множитель, схема (schema), последовательность
# (sequence), and the geometry words луч, вектор, кривая, парабола, окружность,
# многоугольник, область. Dungan words this file does commit to: сян (line),
# сяндуан (segment), дян (point), җёду (angle), хаң (row), ле (column), да
# (large), щё (small), җын / җя (true / false), даан (answer), вынти
# (question / problem), мин (name), е (page), шў (number).

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] лянгә endpoint дин ща лиола, { $attributes } җё бугуанла
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] endpoint гын midpoint лянгә дў дин ща лиола, { $attributes } җё бугуанла
    }

line-segment-midpoint-offset-without-midpoint = мый ю midpoint, midpointOffset җё мый юң

## `<line>`

line-points-undetermined-dimensions = Сян чуангуәди дянди размерность дин бучў.

line-points-too-few-dimensions = Сян бищү чуангуә җишо лянгә размерность ди дян.

line-points-depend-on-variables = Сян чуангуәди дян кансə җə щə переменная: { $variables }.

line-equation-invalid-format = Юң { $variable1 } гын { $variable2 } щеди сян ди уравнение ди формат будуй.

## `<ray>`

ray-overprescribed-through = Луч сы юң through, endpoint гын direction дин ща ди. Дин щади through бугуанла.

ray-dimension-mismatch = Луч ли ди numDimensions дуй бушаң.

## `<vector>`

vector-overprescribed-head = Вектор сы юң head, tail гын displacement дин ща ди. Дин щади head бугуанла.

vector-dimension-mismatch = Вектор ли ди numDimensions дуй бушаң.

## Attracting and constraining

attract-to-without-nearest-point = Бунын ба та щи дао `<{ $component }>` шаң, инвый та мый ю nearestPoint җə гә состояние ди переменная.

constrain-to-without-nearest-point = Бунын ба та щян зэ `<{ $component }>` шаң, инвый та мый ю nearestPoint җə гә состояние ди переменная.

constrain-to-interior-without-nearest-point = Бунын ба та щян зэ `<{ $component }>` ди лийтў, инвый та мый ю nearestPoint җə гә состояние ди переменная.

## `<choiceInput>`

choice-input-label-position-ignored = Бу сы inline ди choiceInput шаң, labelPosition бугуанла

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput ди indices ди шў гын choice ди зынэрди шў дуй бушаң, indices бугуанла.

pretzel-indices-count-mismatch = problem ди indices ди шў гын problem ди зынэрди шў дуй бушаң, indices бугуанла.

shuffle-indices-count-mismatch = shuffle ди indices ди шў гын компонент ди шў дуй бушаң, indices бугуанла.

indices-ignored-out-of-range = { $component } ди йищə indices чугуәла фанвый, indices бугуанла.

pretzel-indices-repeated = pretzel ди йищə indices чуңфўла, indices бугуанла.

pretzel-circuit-first-index = pretzel зэ circuit режим ли дийигә индекс бищү сы 1, indices бугуанла.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` яо гын строка ди зынэр йикуәр гунзуо, бищү дин ща `type` җə гә атрибут.

invalid-type-defaulting-to-math = { $component } компонент ди type { $type } будуй. Бищү сы math, text, number хуәҗə boolean. Щян ан math юң.

string-not-valid-component-to-arrange = Строка "{ $value }" бунын { $component }. Бугуанла.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } будуй, ан number юң.

invalid-variable-value = Переменная ди значение будуй: `{ $value }`

## Variants

variant-index-must-be-number = Вариант ди индекс { $index } бищү сы йигә шў

variant-index-must-be-integer = Вариант ди индекс { $index } бищү сы җынышў

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` хэ мый шыщян абсолютный ди чиду. Куанду ан относительный юң.

side-by-side-absolute-margins = `<{ $component }>` хэ мый шыщян абсолютный ди чиду. Бянди кунр ан относительный юң.

side-by-side-no-block-child = `<{ $component }>` будуй: та бищү ю җишо йигә блок ди зынэр.

## `<label>`

label-for-ignored-on-graphical = Тўщиң ди `<label>` шаң ди `for` атрибут бугуанла.

label-for-must-resolve-to-one = `<label>` шаң ди `for` бищү җы җы йигә компонент.

label-for-unresolved = `<label>` шаң ди `for` җы ди компонент җаобуҗо.

label-for-answer-with-authored-inputs = `<label>` шаң ди `for` җы ди `<answer>` йиҗин зыҗи щела ввод; җиҗе җы җə гә ввод ба.

label-for-answer-without-input = `<label>` шаң ди `for` җы ди `<answer>` мый ю кәи да бёчянди ввод.

label-for-must-reference-input-or-answer = `<label>` шаң ди `for` бищү җы йигә ввод хуәҗə йигә answer.

## Accessibility

accessibility-short-description-or-decorative = Вый ла доступность, `<{ $component }>` хуәҗə ю йигә дуан ди шомин, хуәҗə дин ща сы декоративный ди.

accessibility-video-short-description = Вый ла доступность, `<video>` бищү ю йигә дуан ди шомин.

accessibility-input-short-description-or-label = Вый ла доступность, `<{ $component }>` бищү ю йигә дуан ди шомин хуәҗə йигә бёчян.

accessibility-answer-input-short-description-or-label = Вый ла доступность, зыҗи щели ввод ди `<answer>` бищү ю йигә дуан ди шомин хуәҗə йигә бёчян.

accessibility-short-description-contains-math = Дуан ди шомин ли бу гэ ю щяң `<{ $component }>` җəяңди математика ди компонент. Ба математика юң хуа шочўлэ.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } гый раздел ди бёти ди вынзы ди контраст гуәйү щё (тёмный режим) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; җишо яо { $threshold }:1).
       *[other] { $colorName } гый раздел ди бёти ди вынзы ди контраст гуәйү щё ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; җишо яо { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Дян мый ю шўзы ди значение ди шыхў, чуангуә { $count } гә дянди `<circle>` хэ мый шыщян.

circle-too-many-through-points = Бунын суан чуангуә 3 гә идади дян ди окружность.

circle-overprescribed-radius-center-points = Радиус, центр гын чуангуәди дян дў дин щала, окружность бунын суан.

circle-center-with-multiple-points = Центр дин щала, зэ чуангуә 1 гә идади дян ди окружность бунын суан.

circle-radius-too-small = Окружность бунын суан: лянгә дян ди зуйли сы { $distance }, дин щади радиус { $radius } гуәйү щё.

circle-radius-with-many-points = Радиус дин щала, бунын зуо чуангуә лянгә идади дян ди окружность.

circle-invalid-center-or-through-points = Окружность ди центр хуәҗə чуангуәди дян будуй.

circle-radius-center-with-multiple-points = Центр дин щала, чуангуә 1 гә идади дянди окружность ди радиус бунын суан.

circle-change-radius-non-numerical = Чуангуәди дян мый ю шўзы ди значение, окружность ди радиус бунын хуан

circle-radius-with-points-non-numerical = Мый ю шўзы ди значение ди шыхў, дин щала радиус җё бунын зуо чуангуә йигә идади дян ди окружность.

circle-change-center-non-numerical = Чуангуә мый ю шўзы ди значение ди дян ди окружность, ба та ди центр хуан җə гә хэ мый шыщян.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] Функция ди область определения ди размерность бугу. Область определения ю { $intervals } гә интервал, дансы функция ю { $inputs ->
           *[other] { $inputs } гә ввод
        }.
    }

function-domain-invalid-format = Функция ди область определения ди формат будуй.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функция ди мый ю шўзы ди максимум бугуанла.
        [minimum] Функция ди мый ю шўзы ди минимум бугуанла.
        [extremum] Функция ди мый ю шўзы ди экстремум бугуанла.
        [point] Функция ди мый ю шўзы ди дян бугуанла.
        [slope] Функция ди мый ю шўзы ди наклон бугуанла.
       *[other] Функция ди мый ю шўзы ди { $type } бугуанла.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функция ди кун ди максимум бугуанла.
        [minimum] Функция ди кун ди минимум бугуанла.
        [extremum] Функция ди кун ди экстремум бугуанла.
        [point] Функция ди кун ди дян бугуанла.
       *[other] Функция ди кун ди { $type } бугуанла.
    }

function-points-too-close = Функция ли ю лянгә дян лиди гуәйү җин. Функция дин бучў.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] Җы ю функция ди ввод ди шў гын вывод ди шў йияң ди шыхў, итерация цэ нын зуо. Җə гә функция ю { $inputs } гә ввод, { $outputs ->
           *[other] { $outputs } гә вывод
        }.
    }

## `<sequence>`

sequence-invalid-length = Последовательность ди чаңду будуй. Бищү сы бу фў ди җынышў.

sequence-invalid-step = Последовательность ди шаг будуй. { $type } тип ди последовательность ли та бищү сы йигә шў.

sequence-invalid-endpoint-number = Шў ди последовательность ди "{ $attribute }" будуй. Бищү сы йигә шў.

sequence-invalid-endpoint-letters = Зымўди последовательность ди "{ $attribute }" будуй. Бищү сы йигә зымў ди зухә.

sequence-invalid-endpoint = Последовательность ди "{ $attribute }" будуй.

select-from-sequence-coprime-not-numbers = Бу сы щүан шў, coprime бугуанла

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations дин щала, coprime бугуанла

## Resolving a `target`

target-not-found = `<{ $source }>` ди target будуй: target җаобуҗо.

target-state-variable-not-found = `<{ $source }>` ди target будуй: `<{ $component }>` шаң мый ю җё "{ $property }" ди состояние ди переменная.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` ди переменная бищү гын независимый ди переменная бу йияң.

ode-system-duplicate-variable-names = Зависимый ди переменная ди мин чуңфўла, ODE ди йү бян ди функция дин бучў.

ode-system-rhs-function-error = ODE ди йү бян ди функция дин бучў. Зуо mathjs ди функция ди шыхў чула ошибка.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } тё сян җунҗян ди җёду дин бучў

angle-invalid-through-point = `<angle>` ди through ли ди дян будуй

parabola-vertex-too-many-points = Вершина ю ла, зэ чуангуә 1 гә идади дян ди парабола хэ мый шыщян.

parabola-too-many-points = Чуангуә 3 гә идади дян ди парабола хэ мый шыщян.

intersection-too-many-items = Лянгә идади дунщи ди пересечение хэ мый шыщян

## Other math components

ionic-compound-not-two-ions = Лянгә ион идади ионное соединение хэ мый шыщян.

ionic-compound-needs-cation-and-anion = Ионное соединение җы гый йигә катион гын йигә анион шыщянла.

solve-equations-cannot-evaluate = Уравнение суан бучў, сои бунын җе: { $equation }

math-operators-operand-number-required = Чў математика ди операнд ди шыхў бищү дин ща operandNumber.

eigen-decomposition-failed = Матрица ди собственный ди значение бунын суан

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: параметр { $parameters } зэ образец ли мый чущян, сои та зун сы дуй йигә кун.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" кан бу мин. Та бищү сы none, medium, dense, хуәҗə лянгә җун җян ю кунрди җын ди шў, бифаң grid="1 0.5". Сетка мый хуа.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` яо йигә функция, та ю { $expected ->
        [one] йигә вывод, җё сы мый йигә дян шаң ди наклон y', бифаң `y - x`
       *[other] лянгә вывод, җё сы мый йигә дян шаң ди вектор, бифаң `(y, -x)`
    }, дансы гыйла ди функция ю { $found ->
       *[other] { $found } гә вывод
    }. { $alternative ->
        [none] Шәму дў мый хуа.
       *[other] Җə гә функция гэ юң `<{ $alternative }>`. Шәму дў мый хуа.
    }

field-function-attribute-ignored-with-child = `function` җə гә атрибут бугуанла, инвый функция зэ компонент ди лийтў е гыйла; юңди сы лийтў ди. Функция җы гэ юң йигә фазы гый.

field-variables-ignored =
    `<{ $component }>`: `variables` җə гә атрибут җы ди сы җиҗе щезэ компонент лийтў ди выражение ди переменная. { $reason ->
        [function-child] Җəли ди функция сы йигә `<function>` зынэр, та зыҗи мин зыҗи ди переменная, сои `variables` бугуанла.
       *[no-expression] Җəли мый ю җəяңди выражение, сои `variables` бугуанла.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure рендерер ли мый ю xLabelPosition="left"; ан right ди яңзы юң.

prefigure-y-label-position-unsupported = `<graph>`: prefigure рендерер ли мый ю yLabelPosition="bottom"; ан top ди яңзы юң.

prefigure-invalid-axis-bounds = `<graph>`: prefigure җуанхуан ди осьди фанвый будуй; ан мырянди bbox (-10,-10,10,10) юң.

prefigure-invalid-width = `<graph>`: prefigure җуанхуан ди куанду будуй; ан мырянди куанду 425 юң.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure җуанхуан ди aspectRatio будуй; ан мырянди 1 юң.

prefigure-grid-spacing-too-fine = `<graph>`: сеткади кунр дуй ось ди фанвый лэ шо гуәйү мищи; prefigure рендерер ли сетка бу хуа.

prefigure-annotations-not-rendered = `<graph>`: бу юң PreFigure рендерер ди шыхў, аннотация бу хуа.

multiple-annotations-children = `<graph>` ли җаоҗо бу җы йигә `<annotations>` зынэр; чў зуйхўди йигә, битиди дў бугуанла.

## Referring to other components

copy-unrecognized-component-type = Бу җинди компонент ди тип бунын extend е бунын copy: { $type }.

copy-prop-not-found = { $component } тип ди компонент шаң җаобуҗо prop { $property }

collect-no-source = Collect мый җаоҗо source.

collect-invalid-component-type = `<{ $component }>` бу сы йигә җынди компонент ди тип, сои бунын collect.

reference-index-unavailable = Бунын җы индекс `{ $reference }`

## `<callAction>`

component-action-unavailable = Компонент `{ $reference }` шаң бунын җё { $action }

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Шўҗүди щиңҗуаң будуй. Хаң ди чаңду бу йияң. Зэ componentIdx :{ $componentIdx } җаоҗоди

data-frame-duplicate-column-names = Шўҗүди ле ди мин чуңфўла. Зэ componentIdx :{ $componentIdx } җаоҗоди

data-frame-missing-column-name = Шўҗү шоли йигә ле ди мин. Зэ componentIdx :{ $componentIdx } җаоҗоди

## `<answer>` and scoring

answer-award-depends-on-own-response = Җə гә answer ди award кансə answer зыҗи сунхади хуэйда, җə йё чў щянбудәди шәр.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` ди контейнер лийтў ди `<answer>` шаң дин ща `maxNumAttempts` мый юң, инвый цышў сы контейнер гуанди. Ба `maxNumAttempts` дин зэ контейнер шаң ба.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` ди контейнер зэ лиң йигә `sectionWideCheckWork` ди контейнер лийтў ди шыхў, зэ та шаң дин ща `maxNumAttempts` мый юң, инвый цышў сы вэйтўди контейнер гуанди. Ба `maxNumAttempts` дин зэ вэйтўди контейнер шаң ба.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] Мый дин ща symbolicEquality, { $attributes } җə гә атрибут мый юң.
    }

answer-invalid-type = Answer ди тип будуй: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` җə гә компонент мый ю мин, сои бунын даң module ди атрибут юң

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` бунын даң module ди атрибут юң, инвый `<module>` җə гә компонент ди тип шаң йиҗин ю йигә "{ $name }" ди атрибут.

conditional-content-condition-ignored = `<conditionalContent>` ю case хуәҗə else ди зынэр ди шыхў, `condition` җə гә атрибут бугуанла.

slider-markers-type-mismatch = Маркер ди тип гын slider ди тип дуй бушаң.

pretzel-problem-needs-statement-and-answer = Pretzel будуй: мый йигә `<problem>` лийтў бищү ю йигә `<statement>` гын йигә `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel будуй: mode="circuit" ди шыхў, дийигә `<problem>` бунын сы дистрактор.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] Атрибут `{ $attribute }` ди значение { $values } будуй; бугуанла.
    }

attribute-must-be-references = Атрибут `{ $attribute }` ди значение `{ $value }` будуй. Атрибут бищү сы юң `$` кэтўди ссылка зучынди.

math-input-invalid-function-names = <mathInput>: { $attribute } ли будуй ди функция ди мин бугуанла: { $names }. Мый йигә мин ди щянши ди буфын җишо яо 2 гә зыфў (зымў хуәҗə чаңхәнр); хўтў кәи җя йигә `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Компонент ди тип будуй: `<{ $componentType }>`

attribute-repeated = Атрибут { $attribute } бунын чуңфў.

attribute-invalid-for-component = `<{ $componentType }>` тип ди компонент шаң "{ $attribute }" җə гә атрибут будуй.

## Style definition contrast

style-definition-insufficient-contrast =
    Стиль { $styleNumber } ли { $context ->
        [text-on-background] вынзы ди сә дуй фон ди сә
        [high-contrast] высокий контраст ди сә дуй холст
        [line] сян ди сә дуй холст
        [marker] маркер ди сә дуй холст
       *[text-on-canvas] вынзы ди сә дуй холст
    } ди контраст гуәйү щё{ $mode ->
        [dark] { " (тёмный режим)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; җишо яо { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Стиль { $styleNumber } дин щади сә зэ светлый режим ли контраст гу, дансы цун та суанчўлэди тёмный режим ди сә, вынзы дуй фон ди контраст бугу ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; җишо яо { $threshold }:1). { $suggestion ->
        [available] Яо зэ тёмный режим ли контраст гу, хуәҗə ба светлый режим ди контраст җяда (бифаң { $lightAttribute }="{ $lightColor }"), хуәҗə ба тёмный режим ди сә зыҗи дин ща (бифаң { $darkAttribute }="{ $darkColor }").
       *[none] Яо зэ тёмный режим ли контраст гу, хуәҗə ба светлый режим ди контраст җяда, хуәҗə юң textColorDarkMode гын/хуәҗə backgroundColorDarkMode ба суанчўлэди сә гэща.
    }

style-definition-dark-mode-text-canvas-contrast =
    Стиль { $styleNumber } дин щади вынзы ди сә зэ светлый режим ли контраст гу, дансы цун та суанчўлэди тёмный режим ди вынзы ди сә дуй холст ди контраст бугу ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; җишо яо { $threshold }:1). { $suggestion ->
        [available] Яо зэ тёмный режим ли контраст гу, хуәҗə ба светлый режим ди контраст җяда (бифаң textColor="{ $lightColor }"), хуәҗə ба тёмный режим ди сә зыҗи дин ща (бифаң textColorDarkMode="{ $darkColor }").
       *[none] Яо зэ тёмный режим ли контраст гу, хуәҗə ба светлый режим ди контраст җяда, хуәҗə юң textColorDarkMode ба суанчўлэди сә гэща.
    }

section-multiple-style-palettes = Йигә раздел җы нын щүан йигә <stylePalette>; юңди сы зуйхўди йигә.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } ди numToSelect бу сы бу фў ди җынышў, сои та ди вариант дин бучў.

variant-num-to-select-not-constant-number = { $component } ди numToSelect бу сы йигә бу бянди шў, сои та ди вариант дин бучў.

variant-with-replacement-not-constant-boolean = { $component } ди withReplacement бу сы йигә бу бянди җын/җя, сои та ди вариант дин бучў.

variant-select-weight-disables-unique = Ю selectWeight хуәҗə selectForVariants ди option ди шыхў, select ди дуй йигә ди вариант гуанла

variant-coprime-undetermined = coprime сы бу сы зун бу җын дин бучў, сои { $component } ди вариант дин бучў.

variant-attribute-not-constant = { $component } ди { $attribute } бу сы бу бянди, сои та ди вариант дин бучў.

variant-attribute-not-number = { $component } ди { $attribute } бу сы йигә шў, сои та ди вариант дин бучў.

variant-attribute-wrong-type-for-sequence =
    { $type } тип ди { $component } ди { $attribute } бу сы { $expected ->
        [letters-combination] йигә зымў ди зухә
        [math-expression] йигә җынди математика ди выражение
        [integer] йигә җынышў
       *[number] йигә шў
    }, сои та ди вариант дин бучў.

variant-length-not-integer = { $component } ди length бу сы җынышў, сои та ди вариант дин бучў.

variant-sort-not-implemented = Ю sort ди { $component } ди дуй йигә ди вариант хэ мый шыщян

variant-exclude-combinations-not-implemented = Ю excludeCombinations ди { $component } ди дуй йигә ди вариант хэ мый шыщян

variant-math-exclude-not-implemented = Ю exclude ди math тип ди { $component } ди дуй йигә ди вариант хэ мый шыщян

variant-non-constant-exclude-not-implemented = Ю бянди exclude ди { $component } ди дуй йигә ди вариант хэ мый шыщян

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph ди prefigure рендерер ли мый ю та; җə гә зысўн тёгуәла.

prefigure-descendant-invalid-geometry = { $subject }: геометрия бу вансы хуәҗə бу ю чиңди; җə гә зысўн тёгуәла.

prefigure-curve-label-omitted = { $subject }: җуанхуанли ди кривая шаң бунын да бёчян; бёчян шола.

prefigure-curve-unsupported-definition-type = { $subject }: кривая ди функция ди дин и ди тип '{ $definitionType }' мый ю; җə гә зысўн тёгуәла.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves шаң ди flipFunctions атрибут мый ю; җə гә зысўн тёгуәла.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves җы нын юң formula тип ди функция ди зынэр; җə гә зысўн тёгуәла.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] сян йиҗяди бёчян
       *[point] дян ди бёчян
    } шаң labelPosition '{ $labelPosition }' мый ю; ан PreFigure мырянди яңзы фаңди.

prefigure-fill-style-unsupported = { $subject }: PreFigure мый ю '{ $fillStyle }' җəяңди тян ди яңзы; ан җынди тян юң.

prefigure-line-style-unknown = { $subject }: бу җинди сян ди яңзы '{ $lineStyle }' цун PreFigure ди чўкў ли шола.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер ди яңзы '{ $markerStyle }' хуанчын PreFigure ди 'diamond' ла.

prefigure-marker-style-unsupported = { $subject }: PreFigure мый ю '{ $markerStyle }' җəяңди маркер ди яңзы; ан мырянди яңзы юң.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` будуй; җы ди дунщи җаобуҗо. Аннотация шола.

annotation-ref-multiple-targets = `<annotation>`: `ref` җы ди дунщи бу җы йигә; юңди сы дийигә.

annotation-ref-outside-graph = `<annotation>`: `ref` будуй; җы ди дунщи зэ graph ди вэйтў. Аннотация шола.

annotation-ref-unsupported-target = `<annotation>`: `ref` будуй; prefigure җуанхуан ли җы ди бу сы йигә кәи юңди тўщиң ди дунщи. Аннотация шола.

annotation-text-missing = `<annotation>`: `text` шола хуәҗə сы кун ди; чўлэди сы кун вынзы.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Җаоҗо ла юанчүан ди кансə.
       *[other] Җаоҗо ла гын `<{ $componentType }>` компонент ю гуанди юанчүан ди кансə.
    }

reference-no-referent = Җə гә ссылка җы ди дунщи җаобуҗо: `{ $reference }`

reference-multiple-referents = Җə гә ссылка җы ди дунщи җаоҗо бу җы йигә: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` ди { $attribute } җə гә атрибут ди формат будуй.

children-invalid = `<{ $componentType }>` ди зынэр будуй: җаоҗо будуй ди зынэр: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Атрибут `{ $attribute }` ди значение `{ $value }` будуй, ан `{ $default }` юң

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML версия { $version } җаобуҗо.
       *[other] DoenetML версия { $version } җаобуҗо. Ан версия { $fallback } юң
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML будуй: { $content }

parse-tag-missing-close-tag = DoenetML будуй: `{ $tag }` җə гә тег мый ю гуан ди тег. Яо йигә зыҗи гуан ди тег, хуәҗə йигә `</{ $tagName }>` тег.

parse-tag-error = DoenetML будуй: `<{ $tagName }>` җə гә тег ли ю ошибка

parse-attribute-missing-value = DoenetML будуй: `{ $attribute }` җə гә атрибут будуй, кансə сы шола значение.

parse-attribute-invalid = DoenetML будуй: `{ $attribute }` җə гә атрибут будуй

parse-attribute-value-invalid = DoenetML будуй: атрибут ди значение `{ $value }` будуй

parse-attribute-value-quote-mismatch = DoenetML будуй: атрибут ди значение `{ $value }` будуй. Иньхо дуй бушаң. Кансə сы шола йигә `{ $quote }`

parse-open-tag-name-missing = DoenetML будуй: җаоҗо йигә мый ю мин ди тег, бифаң `<`

parse-tag-not-closed = DoenetML будуй: `{ $tag }` җə гә тег мый гуаншаң (кансə сы шола йигә `>`).

parse-self-closing-tag-name-missing = DoenetML будуй: җаоҗо йигә мый ю мин ди тег `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML будуй: `{ $tag }` җə гә тег мый гуаншаң (кансə сы шола `/>`).

parse-tag-invalid-attributes = DoenetML будуй: `{ $tag }` җə гә тег будуй. Кәнын та ди атрибут будуй.

parse-close-tag-name-missing = DoenetML будуй: җаоҗо йигә мый ю мин ди гуан ди тег, бифаң `</`

parse-attribute-value-unquoted = Атрибут ди значение бищү фаңзэ иньхо ли: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML будуй: җаоҗо гуан ди тег `{ $tag }`, дансы мый ю гын та дуйди кэ ди тег

parse-close-tag-mismatched = DoenetML будуй: гуан ди тег дуй бушаң. Яо ди сы `</{ $expected }>`. Җаоҗоди сы `{ $found }`

parser-node-unconvertible = Узел { $node } бунын җуанчын Dast ди узел.

## Names

name-attribute-invalid =
    Атрибут name='{ $name }' будуй. { $reason ->
        [characters] Мин ли җы нын ю зымў, шўзы, ялинр хуәҗə чаңхәнр.
       *[start] Мин бищү юң зымў кэтў.
    }

component-name-invalid-start = Компонент ди мин "{ $name }" будуй. Мин бищү юң зымў кэтў.

## `<answer>` sugar

answer-video-watched-missing-video = Type сы videoWatched ди answer бищү ю video җə гә атрибут

answer-video-watched-video-not-reference = Type сы videoWatched ди answer ди video җə гә атрибут бищү сы йигә ссылка

answer-name-not-single-text = Answer ди name җə гә атрибут бищү ю йигә text ди зынэр

## Referencing another document

external-doenetml-recursion-limit = Юанчүанди цышў тэ дола, вэйтўди DoenetML ныйбуляй. Кансə ю юанчүанди ссылка ба?

external-doenetml-unavailable = { $attribute }="{ $uri }" ди DoenetML ныйбуляй

external-doenetml-type-mismatch = { $attribute }="{ $uri }" ныйляйди DoenetML будуй: та гын "{ $componentType }" җə гә компонент ди тип дуй бушаң

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Атрибут `{ $from }` гуәшыла; юң `{ $to }` ба.
       *[other] [deprecation] `<{ $component }>` шаң ди атрибут `{ $from }` гуәшыла; юң `{ $to }` ба.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Атрибут `{ $from }` гуәшыла, `{ $to }` е дин щала, сои та бугуанла.
       *[other] [deprecation] `<{ $component }>` шаң ди атрибут `{ $from }` гуәшыла, `{ $to }` е дин щала, сои та бугуанла.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` шаң ди атрибут `{ $attribute }` гуәшыла, бугуанла.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` шаң ди атрибут `{ $attribute }` гуәшыла; юң йигә `<{ $child }>` зынэр ба.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` шаң ди атрибут `{ $attribute }` ди значение `{ $value }` гуәшыла; юң `{ $to }` ба.


## Language coverage

pluralize-english-only = `<pluralize>` җы нын ба английский ди хуа бян чын дуошў, сои юң { $locale } щеди документ ли та ди вынзы мый бян. Җиҗе ба дуошў ди щиңши щечўлэ, хуәҗə юң `pluralForm` җə гә атрибут дин ща.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` бу сы йигә Doenet җинди элемент.

schema-element-not-allowed-at-root = `<{ $tag }>` бунын фаңзэ документ ди гынр шаң.

schema-element-not-allowed-inside = `<{ $tag }>` бунын фаңзэ `<{ $parent }>` ди лийтў.

schema-attribute-unrecognized = `<{ $tag }>` җə гә элемент мый ю җё `{ $attribute }` ди атрибут.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элемент ди атрибут `{ $attribute }` бищү сы йигә список, лийтў мый йигә дунщи бищү сы җə щə ли ди йигә: { $allowed }
       *[other] `<{ $tag }>` элемент ди атрибут `{ $attribute }` бищү сы җə щə ли ди йигә: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Select ди вариант ди мин будуй. Вариант ди мин { $variantName } зэ { $numOptions } гә option ли чущянла, дансы яо щүан ди сы { $numToSelect } гә.

select-variant-name-without-options = Select дин щала вариант, дансы { $variantName } җə гә вариант ди мин мый ю option.

select-variant-name-not-possible = Select дин щади вариант ди мин { $variantName } бу сы йигә кәи юңди вариант ди мин.

select-too-few-options = Җы ю { $numOptions } гә, бунын щүан { $numToSelect } гә компонент.

select-from-sequence-too-few-values = Чаңду сы { $length } ди последовательность ли бунын щүан { $numToSelect } гә значение.

select-from-sequence-indices-count-mismatch = Select дин щади индекс ди шў бищү гын яо щүан ди шў йияң

select-from-sequence-indices-not-integers = Select дин щади индекс дў бищү сы җынышў

select-from-sequence-index-excluded = selectfromsequence дин щади индекс сы пэйчўлэди

select-from-sequence-indices-excluded-combination = selectfromsequence дин щади индекс сы йигә пэйчўлэди комбинация

select-from-sequence-coprime-not-positive-integers = Бу сы щүан җынди җынышў, сои бунын щүан взаимно простой ди комбинация.

select-from-sequence-coprime-common-factor = Бунын щүан взаимно простой ди шў. Сою кәнынди значение ю гунтун ди множитель. (Дин щади "from" хуәҗə "to" бищү гын "step" взаимно простой.)

select-from-sequence-coprime-single-number = Бунын цун йигә бу сы 1 ди шў ли щүан взаимно простой ди комбинация.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ли пэйчўла 70% идади комбинация

select-from-sequence-coprime-none-found = Бунын щүан взаимно простой ди шў. Сою кәнынди значение ю гунтун ди множитель.

select-from-sequence-too-few-unique-values = Чаңду сы { $numPossibleValues } ди последовательность ли бунын щүан { $numToSelect } гә бу йияңди значение

select-prime-numbers-too-few-values = Чаңду сы { $numValues } ди җышў ди список ли бунын щүан { $numToSelect } гә значение

select-prime-numbers-values-count-mismatch = Select дин щади значение ди шў бищү гын яо щүан ди шў йияң

select-prime-numbers-values-not-prime = Select prime number дин щади значение дў бищү зэ җышў ди список ли

select-prime-numbers-values-excluded-combination = selectPrimeNumbers дин щади значение сы йигә пэйчўлэди комбинация

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ли пэйчўла 70% идади комбинация

select-random-combination-fluke = Тэ шоҗянди шәр: суйҗы ди значение ди комбинация мый щүанчў лэ

select-random-value-fluke = Тэ шоҗянди шәр: суйҗы ди значение мый щүанчў лэ

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` мый хуа зэ математика ди лийтў; выражение ан ввод хэ бунын фаң җинчўди шыхў ди яңзы пайбанди. { $reason ->
        [not-inline] Җы ю `inline` ди choice ди ввод фаңдә җин выражение ли; мый ю `inline` та сы йигә кўзы ди блок.
        [expanded] `expanded` ди text ди ввод сы йигә до хаң ди хәзы, фаңзэ выражение ли гуәйү да.
        [on-graph] Зэ graph шаң выражение сы даң йигә тў хуади, лийтў мый ю фаң кўзы ди кунр.
       *[relative-width] Та ди `width` сы относительный ди (процент хуәҗə `em`), зэ выражение ли мый ю дунщи гый та лян. Юң абсолютный ди даньвый, бифаң `px`, гый куанду ба.
    }
