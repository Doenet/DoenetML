# Tajik diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Tajik counts in the same two categories English does, so every selection below
# keeps both branches — but a noun after a numeral stays singular, so the two
# usually differ only in the number they print.
#
# A case or izafat ending is written onto a value only where that value is a
# DoenetML identifier, which is Latin script and takes the same ending whatever
# it is — «{ $component }-ро», «{ $type }-и» — and it is hyphenated everywhere
# in this file, as Tajik hyphenates a suffix after Latin script. Nothing here
# welds an ending onto an author's own word: where one is quoted back it stands
# inside backticks or quotes and the ending falls on a word this catalog wrote.
# See "An affix cannot be welded to a placeable" in the README.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] вақте ки ҳар ду нуқтаи канорӣ дода шудаанд, { $attributes } ба эътибор гирифта намешавад
       *[other] вақте ки ҳар ду нуқтаи канорӣ дода шудаанд, { $attributes } ба эътибор гирифта намешавад
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] вақте ки ҳам нуқтаи канорӣ ва ҳам нуқтаи миёна дода шудаанд, { $attributes } ба эътибор гирифта намешавад
       *[other] вақте ки ҳам нуқтаи канорӣ ва ҳам нуқтаи миёна дода шудаанд, { $attributes } ба эътибор гирифта намешавад
    }

line-segment-midpoint-offset-without-midpoint = бе нуқтаи миёна midpointOffset ба чизе таъсир намекунад

## `<line>`

line-points-undetermined-dimensions = Хат аз нуқтаҳои дорои ченаки номуайян мегузарад.

line-points-too-few-dimensions = Хат бояд аз нуқтаҳои ҳадди ақал дученака гузарад.

line-points-depend-on-variables = Хат аз нуқтаҳое мегузарад, ки ба тағйирёбандаҳо вобастаанд: { $variables }.

line-equation-invalid-format = Формати нодурусти муодилаи хат дар тағйирёбандаҳои { $variable1 } ва { $variable2 }.

## `<ray>`

ray-overprescribed-through = Шуоъ бо through, endpoint ва direction дода шудааст. through-и додашуда ба эътибор гирифта намешавад.

ray-dimension-mismatch = дар шуоъ numDimensions мувофиқат намекунад.

## `<vector>`

vector-overprescribed-head = Вектор бо head, tail ва displacement дода шудааст. head-и додашуда ба эътибор гирифта намешавад.

vector-dimension-mismatch = дар вектор numDimensions мувофиқат намекунад.

## Attracting and constraining

attract-to-without-nearest-point = Ба `<{ $component }>` кашидан мумкин нест, зеро он тағйирёбандаи ҳолати nearestPoint надорад.

constrain-to-without-nearest-point = Бо `<{ $component }>` маҳдуд кардан мумкин нест, зеро он тағйирёбандаи ҳолати nearestPoint надорад.

constrain-to-interior-without-nearest-point = Бо дохили `<{ $component }>` маҳдуд кардан мумкин нест, зеро он тағйирёбандаи ҳолати nearestPoint надорад.

## `<choiceInput>`

choice-input-label-position-ignored = барои choiceInput-и ғайрисатрӣ labelPosition ба эътибор гирифта намешавад

## Ordering children by index

choice-input-indices-count-mismatch = Индексҳои барои choiceInput додашуда ба эътибор гирифта намешаванд, зеро шумораи онҳо ба шумораи фарзандони choice мувофиқат намекунад.

pretzel-indices-count-mismatch = Индексҳои барои problem додашуда ба эътибор гирифта намешаванд, зеро шумораи онҳо ба шумораи фарзандони problem мувофиқат намекунад.

shuffle-indices-count-mismatch = Индексҳои барои shuffle додашуда ба эътибор гирифта намешаванд, зеро шумораи онҳо ба шумораи ҷузъҳо мувофиқат намекунад.

indices-ignored-out-of-range = Индексҳои барои { $component } додашуда ба эътибор гирифта намешаванд, зеро баъзеи онҳо аз ҳудуд берунанд.

pretzel-indices-repeated = Индексҳои барои pretzel додашуда ба эътибор гирифта намешаванд, зеро баъзеи онҳо такрор мешаванд.

pretzel-circuit-first-index = Дар реҷаи circuit индексҳои барои pretzel додашуда ба эътибор гирифта намешаванд, зеро индекси аввал бояд 1 бошад.

## `<shuffle>` and `<sort>`

string-children-need-type = Барои он ки `<{ $component }>` бо фарзандони матнӣ кор кунад, атрибути `type` бояд дода шавад.

invalid-type-defaulting-to-math = Навъи нодуруст { $type } барои ҷузъи { $component }. Он бояд math, text, number ё boolean бошад. math истифода мешавад.

string-not-valid-component-to-arrange = Сатри «{ $value }» барои { $component } ҷузъи мувофиқ нест. Ба эътибор гирифта намешавад.

## Types and variables

invalid-type-defaulting-to-number = Навъи нодуруст { $type }, навъ ҳамчун number таъин мешавад.

invalid-variable-value = Қимати нодурусти тағйирёбанда: `{ $value }`

## Variants

variant-index-must-be-number = Индекси варианти { $index } бояд адад бошад

variant-index-must-be-integer = Индекси варианти { $index } бояд адади бутун бошад

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` барои ченакҳои мутлақ амалӣ карда нашудааст. Паҳноиҳо нисбӣ мешаванд.

side-by-side-absolute-margins = `<{ $component }>` барои ченакҳои мутлақ амалӣ карда нашудааст. Ҳошияҳо нисбӣ мешаванд.

side-by-side-no-block-child = `<{ $component }>`-и нодуруст: он бояд ҳадди ақал як фарзанди блокӣ дошта бошад.

## `<label>`

label-for-ignored-on-graphical = Атрибути `for`-и `<label>`-и графикӣ ба эътибор гирифта намешавад.

label-for-must-resolve-to-one = Атрибути `for`-и `<label>` бояд ба маҳз як ҷузъ ишора кунад.

label-for-unresolved = Атрибути `for`-и `<label>`-ро бо ҷузъ пайваст кардан нашуд.

label-for-answer-with-authored-inputs = Атрибути `for`-и `<label>` ба `<answer>`-е ишора мекунад, ки майдонҳои воридкунии аз ҷониби муаллиф навишташуда дорад; бевосита ба майдон ишора кунед.

label-for-answer-without-input = Атрибути `for`-и `<label>` ба `<answer>`-е ишора мекунад, ки майдони воридкунӣ барои нишонагузорӣ надорад.

label-for-must-reference-input-or-answer = Атрибути `for`-и `<label>` бояд ба майдони воридкунӣ ё ба ҷавоб ишора кунад.

## Accessibility

accessibility-short-description-or-decorative = Барои дастрасӣ `<{ $component }>` бояд ё тавсифи кӯтоҳ дошта бошад, ё ҳамчун ороишӣ нишон дода шавад.

accessibility-video-short-description = Барои дастрасӣ `<video>` бояд тавсифи кӯтоҳ дошта бошад.

accessibility-input-short-description-or-label = Барои дастрасӣ `<{ $component }>` бояд тавсифи кӯтоҳ ё нишона дошта бошад.

accessibility-answer-input-short-description-or-label = Барои дастрасӣ `<answer>`-и майдони воридкунӣ созанда бояд тавсифи кӯтоҳ ё нишона дошта бошад.

accessibility-short-description-contains-math = Тавсифҳои кӯтоҳ набояд ҷузъҳои математикӣ мисли `<{ $component }>` дошта бошанд. Математикаро бо калимаҳо нависед.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } барои матни сарлавҳаи боб контрасти кофӣ намедиҳад (реҷаи торик) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ҳадди ақал { $threshold }:1 лозим аст).
       *[other] { $colorName } барои матни сарлавҳаи боб контрасти кофӣ намедиҳад ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ҳадди ақал { $threshold }:1 лозим аст).
    }

## `<circle>`

circle-through-points-non-numerical = Вақте ки нуқтаҳо қимати ададӣ надоранд, `<circle>` аз { $count } нуқта амалӣ карда нашудааст.

circle-too-many-through-points = Доираро аз зиёда аз 3 нуқта ҳисоб кардан мумкин нест.

circle-overprescribed-radius-center-points = Доираро бо радиус, марказ ва нуқтаҳои додашуда ҳисоб кардан мумкин нест.

circle-center-with-multiple-points = Доираро бо маркази додашуда аз зиёда аз 1 нуқта ҳисоб кардан мумкин нест.

circle-radius-too-small = Доираро ҳисоб кардан мумкин нест: азбаски масофаи байни ду нуқта { $distance } аст, радиуси додашудаи { $radius } хеле хурд аст.

circle-radius-with-many-points = Доираро аз зиёда аз ду нуқта бо радиуси додашуда сохтан мумкин нест.

circle-invalid-center-or-through-points = Маркази доира ё нуқтаҳои он нодурустанд.

circle-radius-center-with-multiple-points = Радиуси доираро бо маркази додашуда аз зиёда аз 1 нуқта ҳисоб кардан мумкин нест.

circle-change-radius-non-numerical = Радиуси доираро бо нуқтаҳои ғайриададӣ тағйир додан мумкин нест

circle-radius-with-points-non-numerical = Вақте ки қиматҳои ададӣ нестанд, доираро аз зиёда аз як нуқта бо радиуси додашуда сохтан мумкин нест.

circle-change-center-non-numerical = Тағйир додани маркази доираи аз нуқтаҳои ғайриададӣ гузаранда амалӣ карда нашудааст.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ченаки соҳаи муайянии функсия кофӣ нест. Соҳа { $intervals } фосила дорад, вале функсия { $inputs ->
            [one] { $inputs } вуруд
           *[other] { $inputs } вуруд
        } дорад.
       *[other] Ченаки соҳаи муайянии функсия кофӣ нест. Соҳа { $intervals } фосила дорад, вале функсия { $inputs ->
            [one] { $inputs } вуруд
           *[other] { $inputs } вуруд
        } дорад.
    }

function-domain-invalid-format = Формати нодурусти соҳаи муайянии функсия.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Максимуми ғайриададии функсия ба эътибор гирифта намешавад.
        [minimum] Минимуми ғайриададии функсия ба эътибор гирифта намешавад.
        [extremum] Экстремуми ғайриададии функсия ба эътибор гирифта намешавад.
        [point] Нуқтаи ғайриададии функсия ба эътибор гирифта намешавад.
        [slope] Нишеби ғайриададии функсия ба эътибор гирифта намешавад.
       *[other] { $type }-и ғайриададии функсия ба эътибор гирифта намешавад.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Максимуми холии функсия ба эътибор гирифта намешавад.
        [minimum] Минимуми холии функсия ба эътибор гирифта намешавад.
        [extremum] Экстремуми холии функсия ба эътибор гирифта намешавад.
        [point] Нуқтаи холии функсия ба эътибор гирифта намешавад.
       *[other] { $type }-и холии функсия ба эътибор гирифта намешавад.
    }

function-points-too-close = Функсия ду нуқтаи ба ҳам хеле наздик дорад. Функсияро муайян кардан мумкин нест.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Такрори функсия танҳо вақте имконпазир аст, ки шумораи вурудҳо ба шумораи хуруҷҳо баробар бошад. Ин функсия { $inputs } вуруд ва { $outputs ->
            [one] { $outputs } хуруҷ
           *[other] { $outputs } хуруҷ
        } дорад.
       *[other] Такрори функсия танҳо вақте имконпазир аст, ки шумораи вурудҳо ба шумораи хуруҷҳо баробар бошад. Ин функсия { $inputs } вуруд ва { $outputs ->
            [one] { $outputs } хуруҷ
           *[other] { $outputs } хуруҷ
        } дорад.
    }

## `<sequence>`

sequence-invalid-length = Дарозии пайдарпайӣ нодуруст аст. Он бояд адади бутуни ғайриманфӣ бошад.

sequence-invalid-step = Қадами пайдарпайӣ нодуруст аст. Барои пайдарпайии навъи { $type } он бояд адад бошад.

sequence-invalid-endpoint-number = «{ $attribute }»-и пайдарпайии ададӣ нодуруст аст. Он бояд адад бошад.

sequence-invalid-endpoint-letters = «{ $attribute }»-и пайдарпайии ҳарфӣ нодуруст аст. Он бояд таркиби ҳарфҳо бошад.

sequence-invalid-endpoint = «{ $attribute }»-и пайдарпайӣ нодуруст аст.

select-from-sequence-coprime-not-numbers = азбаски ададҳо интихоб намешаванд, coprime ба эътибор гирифта намешавад

select-from-sequence-coprime-with-exclude-combinations = азбаски excludeCombinations дода шудааст, coprime ба эътибор гирифта намешавад

## Resolving a `target`

target-not-found = target-и нодуруст барои `<{ $source }>`: ҳадаф ёфт нашуд.

target-state-variable-not-found = target-и нодуруст барои `<{ $source }>`: дар `<{ $component }>` тағйирёбандаи ҳолат бо номи «{ $property }» ёфт нашуд.

## `<odeSystem>`

ode-system-variables-match-independent = Тағйирёбандаҳои `<odeSystem>` бояд аз тағйирёбандаи мустақил фарқ кунанд.

ode-system-duplicate-variable-names = Функсияҳои тарафи рости муодилаи дифференсиалиро бо номҳои такрории тағйирёбандаҳои вобаста муайян кардан мумкин нест.

ode-system-rhs-function-error = Функсияи тарафи рости муодилаи дифференсиалиро муайян кардан мумкин нест. Хато ҳангоми сохтани функсияи mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Кунҷи байни { $count } хатро муайян кардан мумкин нест

angle-invalid-through-point = Нуқтаи нодуруст дар through-и `<angle>`

parabola-vertex-too-many-points = Параболаи бо қуллаи додашуда аз зиёда аз 1 нуқта амалӣ карда нашудааст.

parabola-too-many-points = Парабола аз зиёда аз 3 нуқта амалӣ карда нашудааст.

intersection-too-many-items = Буриши зиёда аз ду объект амалӣ карда нашудааст

## Other math components

ionic-compound-not-two-ions = Пайвастагиҳои ионӣ ба ғайр аз ду ион амалӣ карда нашудаанд.

ionic-compound-needs-cation-and-anion = Пайвастагиҳои ионӣ танҳо барои як катион ва як анион амалӣ карда шудаанд.

solve-equations-cannot-evaluate = Муодиларо ҳал кардан мумкин нест, зеро онро ҳисоб кардан нашуд: { $equation }

math-operators-operand-number-required = Барои ҷудо кардани операнди математикӣ operandNumber бояд дода шавад.

eigen-decomposition-failed = Қиматҳои хосси матрисаро ҳисоб кардан нашуд

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: параметри { $parameters } дар намуна вонамехӯрад, бинобар ин он ҳамеша ба холӣ мувофиқат мекунад.
       *[other] `<matchesPattern>`: параметрҳои { $parameters } дар намуна вонамехӯранд, бинобар ин онҳо ҳамеша ба холӣ мувофиқат мекунанд.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }"-ро шарҳ додан мумкин нест. Он бояд none, medium, dense ё ду адади мусбати бо фосила ҷудошуда бошад, масалан grid="1 0.5". Тӯр кашида намешавад.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: дар тасвиргари prefigure xLabelPosition="left" дастгирӣ намешавад; рафтори мавқеи рост истифода мешавад.

prefigure-y-label-position-unsupported = `<graph>`: дар тасвиргари prefigure yLabelPosition="bottom" дастгирӣ намешавад; рафтори мавқеи боло истифода мешавад.

prefigure-invalid-axis-bounds = `<graph>`: ҳудуди меҳварҳо барои табдили prefigure нодуруст аст; bbox-и пешфарз (-10,-10,10,10) истифода мешавад.

prefigure-invalid-width = `<graph>`: паҳноӣ барои табдили prefigure нодуруст аст; паҳноии пешфарзи диаграмма 425 истифода мешавад.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio барои табдили prefigure нодуруст аст; таносуби пешфарзи тарафҳо 1 истифода мешавад.

prefigure-grid-spacing-too-fine = `<graph>`: қадами тӯр барои ҳудуди меҳварҳо хеле майда аст; дар тасвиргари prefigure тӯр партофта мешавад.

prefigure-annotations-not-rendered = `<graph>`: вақте ки тасвиргари PreFigure истифода намешавад, эзоҳҳо кашида намешаванд.

multiple-annotations-children = Дар `<graph>` якчанд фарзанди `<annotations>` ёфт шуд; ҳама ба ғайр аз охирин ба эътибор гирифта намешаванд.

## Referring to other components

copy-unrecognized-component-type = Навъи ношиноси ҷузъро васеъ ё нусхабардорӣ кардан мумкин нест: { $type }.

copy-prop-not-found = Хосияти { $property } дар ҷузъи навъи { $component } ёфт нашуд

collect-no-source = Барои collect манбаъ ёфт нашуд.

collect-invalid-component-type = Ҷузъҳои навъи `<{ $component }>`-ро ҷамъ кардан мумкин нест, зеро ин навъи нодурусти ҷузъ аст.

reference-index-unavailable = Ба индекси `{ $reference }` истинод кардан мумкин нест

## `<callAction>`

component-action-unavailable = Дар ҷузъи `{ $reference }` { $action }-ро даъват кардан мумкин нест

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Шакли маълумот нодуруст аст. Дарозии сатрҳо гуногун аст. Дар componentIdx :{ $componentIdx } ёфт шуд

data-frame-duplicate-column-names = Дар маълумот номҳои такрории сутунҳо ҳастанд. Дар componentIdx :{ $componentIdx } ёфт шуд

data-frame-missing-column-name = Дар маълумот номи сутун намерасад. Дар componentIdx :{ $componentIdx } ёфт шуд

## `<answer>` and scoring

answer-award-depends-on-own-response = award-и ин ҷавоб ба ҷавоби фиристодаи худи теги answer асос ёфтааст, ки ин ба рафтори ғайричашмдошт меорад.

answer-max-num-attempts-in-section-wide-check-work = Таъин кардани `maxNumAttempts` ба `<answer>` дар дохили контейнери дорои `sectionWideCheckWork` таъсир намекунад, зеро шумораи кӯшишҳоро контейнер муайян мекунад. `maxNumAttempts`-ро ба контейнер таъин кунед.

nested-section-wide-check-work-max-num-attempts = Таъин кардани `maxNumAttempts` ба контейнери дорои `sectionWideCheckWork`, ки худи он дар дохили контейнери дигари дорои `sectionWideCheckWork` аст, таъсир намекунад, зеро шумораи кӯшишҳоро контейнери берунӣ муайян мекунад. `maxNumAttempts`-ро ба контейнери берунӣ таъин кунед.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Бе symbolicEquality-и таъиншуда атрибути { $attributes } таъсир намекунад.
       *[other] Бе symbolicEquality-и таъиншуда атрибутҳои { $attributes } таъсир намекунанд.
    }

answer-invalid-type = Навъи нодуруст барои answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Азбаски ҷузъи `<{ $component }>` ном надорад, онро ҳамчун атрибути модул истифода бурдан мумкин нест

module-attribute-name-already-defined = Ҷузъи `<{ $component } name="{ $name }">`-ро ҳамчун атрибути модул истифода бурдан мумкин нест, зеро навъи ҷузъи `<module>` аллакай атрибути «{ $name }» дорад.

conditional-content-condition-ignored = Атрибути `condition` дар ҷузъи `<conditionalContent>`-и дорои фарзандони case ё else ба эътибор гирифта намешавад.

slider-markers-type-mismatch = Навъи маркерҳо ба навъи лағжанда мувофиқат намекунад.

pretzel-problem-needs-statement-and-answer = pretzel-и нодуруст: ҳар `<problem>` бояд як `<statement>` ва як `<answer>` дошта бошад.

pretzel-circuit-first-problem-distractor = pretzel-и нодуруст: дар реҷаи mode="circuit" `<problem>`-и аввал наметавонад парешонкунанда бошад.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Қимати нодуруст { $values } барои атрибути `{ $attribute }`; ба эътибор гирифта намешавад.
       *[other] Қиматҳои нодуруст { $values } барои атрибути `{ $attribute }`; ба эътибор гирифта намешаванд.
    }

attribute-must-be-references = Қимати нодуруст `{ $value }` барои атрибути `{ $attribute }`. Атрибут бояд аз истинодҳое иборат бошад, ки бо `$` оғоз мешаванд.

math-input-invalid-function-names = <mathInput>: номҳои нодурусти функсия дар { $attribute } ба эътибор гирифта нашуданд: { $names }. Қисми намоёни ҳар ном бояд ҳадди ақал 2 аломат бошад (ҳарфҳо ё тиреҳо); пас аз он пасванди ихтиёрии `|<mathspeak алтернатива>` омада метавонад.

## Building components from the source

component-type-invalid = Навъи нодурусти ҷузъ: `<{ $componentType }>`

attribute-repeated = Атрибути { $attribute }-ро такрор кардан мумкин нест.

attribute-invalid-for-component = Атрибути нодурусти «{ $attribute }» барои ҷузъи навъи `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Таърифи услуби { $styleNumber } контрасти нокофӣ дорад барои { $context ->
        [text-on-background] ранги матн нисбат ба ранги замина
        [high-contrast] ранги контрасти баланд нисбат ба майдони расм
        [line] ранги хат нисбат ба майдони расм
        [marker] ранги маркер нисбат ба майдони расм
       *[text-on-canvas] ранги матн нисбат ба майдони расм
    }{ $mode ->
        [dark] { " (реҷаи торик)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ҳадди ақал { $threshold }:1 лозим аст).

style-definition-dark-mode-text-background-contrast =
    Ҳарчанд рангҳои дар таърифи услуби { $styleNumber } додашуда барои реҷаи равшан контрасти кофӣ медиҳанд, рангҳои реҷаи торики аз онҳо ҳосилшуда байни матн ва замина контрасти нокофӣ медиҳанд ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ҳадди ақал { $threshold }:1 лозим аст). { $suggestion ->
        [available] Барои контрасти кофӣ дар реҷаи торик ё контрастро дар реҷаи равшан зиёд кунед (масалан { $lightAttribute }="{ $lightColor }"), ё ранги реҷаи торикро иваз кунед (масалан { $darkAttribute }="{ $darkColor }").
       *[none] Барои контрасти кофӣ дар реҷаи торик контрастро дар реҷаи равшан зиёд кунед ё рангҳои ҳосилшударо бо textColorDarkMode ва/ё backgroundColorDarkMode иваз кунед.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ҳарчанд ранги матни дар таърифи услуби { $styleNumber } додашуда барои реҷаи равшан контрасти кофӣ медиҳад, ранги матни реҷаи торики аз он ҳосилшуда нисбат ба майдони расм контрасти нокофӣ медиҳад ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ҳадди ақал { $threshold }:1 лозим аст). { $suggestion ->
        [available] Барои контрасти кофӣ дар реҷаи торик ё контрастро дар реҷаи равшан зиёд кунед (масалан textColor="{ $lightColor }"), ё ранги реҷаи торикро иваз кунед (масалан textColorDarkMode="{ $darkColor }").
       *[none] Барои контрасти кофӣ дар реҷаи торик контрастро дар реҷаи равшан зиёд кунед ё ранги ҳосилшударо бо textColorDarkMode иваз кунед.
    }

section-multiple-style-palettes = Боб танҳо як <stylePalette> интихоб карда метавонад; охирин истифода мешавад.

## Unique variants

variant-num-to-select-not-non-negative-integer = вариантҳои беназири { $component }-ро муайян кардан мумкин нест, зеро numToSelect адади бутуни ғайриманфӣ нест.

variant-num-to-select-not-constant-number = вариантҳои беназири { $component }-ро муайян кардан мумкин нест, зеро numToSelect адади доимӣ нест.

variant-with-replacement-not-constant-boolean = вариантҳои беназири { $component }-ро муайян кардан мумкин нест, зеро withReplacement қимати мантиқии доимӣ нест.

variant-select-weight-disables-unique = агар ягон интихоб selectWeight ё selectForVariants дошта бошад, вариантҳои беназири select хомӯш карда мешаванд

variant-coprime-undetermined = вариантҳои беназири { $component }-ро муайян кардан мумкин нест, зеро муайян кардан мумкин нест, ки coprime ҳамеша нодуруст аст.

variant-attribute-not-constant = вариантҳои беназири { $component }-ро муайян кардан мумкин нест, зеро { $attribute } доимӣ нест.

variant-attribute-not-number = вариантҳои беназири { $component }-ро муайян кардан мумкин нест, зеро { $attribute } адад нест.

variant-attribute-wrong-type-for-sequence =
    вариантҳои беназири { $component }-и навъи { $type }-ро муайян кардан мумкин нест, зеро { $attribute } { $expected ->
        [letters-combination] таркиби ҳарфҳо
        [math-expression] ифодаи математикии дуруст
        [integer] адади бутун
       *[number] адад
    } нест.

variant-length-not-integer = вариантҳои беназири { $component }-ро муайян кардан мумкин нест, зеро length адади бутун нест.

variant-sort-not-implemented = вариантҳои беназири { $component }-и дорои sort амалӣ карда нашудаанд

variant-exclude-combinations-not-implemented = вариантҳои беназири { $component }-и дорои excludeCombinations амалӣ карда нашудаанд

variant-math-exclude-not-implemented = вариантҳои беназири { $component }-и навъи math бо exclude амалӣ карда нашудаанд

variant-non-constant-exclude-not-implemented = вариантҳои беназири { $component }-и дорои exclude-и ғайридоимӣ амалӣ карда нашудаанд

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: дар тасвиргари prefigure-и график дастгирӣ намешавад; ворис партофта шуд.

prefigure-descendant-invalid-geometry = { $subject }: геометрияи беохир ё нопурра; ворис партофта шуд.

prefigure-curve-label-omitted = { $subject }: дар унсурҳои каҷхати табдилдодашуда нишонаҳо дастгирӣ намешаванд; нишона партофта шуд.

prefigure-curve-unsupported-definition-type = { $subject }: навъи дастгиринашавандаи таърифи функсияи каҷхат «{ $definitionType }»; ворис партофта шуд.

prefigure-region-flip-functions-unsupported = { $subject }: атрибути flipFunctions дар regionBetweenCurves дастгирӣ намешавад; ворис партофта шуд.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves танҳо функсияҳои фарзанди бо формула додашударо дастгирӣ мекунад; ворис партофта шуд.

prefigure-label-position-unsupported =
    { $subject }: labelPosition-и дастгиринашавандаи «{ $labelPosition }» барои { $labelKind ->
        [line-family] нишонаи оилаи хатҳо
       *[point] нишонаи нуқта
    }; ҷобаҷогузории пешфарзи PreFigure истифода мешавад.

prefigure-fill-style-unsupported = { $subject }: услуби пуркунии «{ $fillStyle }» аз ҷониби PreFigure дастгирӣ намешавад; ба пуркунии яклухт гузашта мешавад.

prefigure-line-style-unknown = { $subject }: услуби ношиноси хати «{ $lineStyle }» аз хуруҷи PreFigure бароварда шуд.

prefigure-marker-style-mapped-to-diamond = { $subject }: услуби маркери «{ $markerStyle }» ба услуби «diamond»-и PreFigure мувофиқ карда шуд.

prefigure-marker-style-unsupported = { $subject }: услуби маркери «{ $markerStyle }» аз ҷониби PreFigure дастгирӣ намешавад; услуби пешфарз истифода мешавад.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref`-и нодуруст; ҳадафро пайваст кардан мумкин нест. Эзоҳ партофта шуд.

annotation-ref-multiple-targets = `<annotation>`: `ref` ба якчанд ҳадаф пайваст шуд; аввалин истифода мешавад.

annotation-ref-outside-graph = `<annotation>`: `ref`-и нодуруст; ҳадаф аз графики дарбаргиранда берун аст. Эзоҳ партофта шуд.

annotation-ref-unsupported-target = `<annotation>`: `ref`-и нодуруст; ҳадаф объекти графикии дар табдили prefigure дастгиришаванда нест. Эзоҳ партофта шуд.

annotation-text-missing = `<annotation>`: `text` нест ё холӣ аст; матни холӣ бароварда мешавад.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Вобастагии даврӣ ошкор шуд.
       *[other] Вобастагии даврии дарбаргирандаи ҷузъи `<{ $componentType }>` ошкор шуд.
    }

reference-no-referent = Барои истинод объект ёфт нашуд: `{ $reference }`

reference-multiple-referents = Барои истинод якчанд объект ёфт шуд: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Формати нодурусти атрибути { $attribute }-и `<{ $componentType }>`.

children-invalid = Фарзандони нодуруст барои `<{ $componentType }>`: фарзандони нодуруст ёфт шуданд: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Қимати нодуруст `{ $value }` барои атрибути `{ $attribute }`; қимати `{ $default }` истифода мешавад

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Версияи DoenetML { $version } ёфт нашуд.
       *[other] Версияи DoenetML { $version } ёфт нашуд. Версияи { $fallback } истифода мешавад
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML-и нодуруст: { $content }

parse-tag-missing-close-tag = DoenetML-и нодуруст: теги `{ $tag }` теги пӯшанда надорад. Теги худпӯшанда ё теги `</{ $tagName }>` интизор мешуд.

parse-tag-error = DoenetML-и нодуруст: хато дар теги `<{ $tagName }>`

parse-attribute-missing-value = DoenetML-и нодуруст: ба назар мерасад, ки ба атрибути `{ $attribute }` қимат намерасад.

parse-attribute-invalid = DoenetML-и нодуруст: атрибути нодуруст `{ $attribute }`

parse-attribute-value-invalid = DoenetML-и нодуруст: қимати нодурусти атрибут `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML-и нодуруст: қимати нодурусти атрибут `{ $value }`. Нохунакҳо мувофиқат намекунанд. Ба назар мерасад, ки `{ $quote }` намерасад

parse-open-tag-name-missing = DoenetML-и нодуруст: теги бе ном ёфт шуд, масалан `<`

parse-tag-not-closed = DoenetML-и нодуруст: теги `{ $tag }` пӯшида нашудааст (ба назар мерасад, ки `>` намерасад).

parse-self-closing-tag-name-missing = DoenetML-и нодуруст: теги бе ном ёфт шуд `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML-и нодуруст: теги `{ $tag }` пӯшида нашудааст (ба назар мерасад, ки `/>` намерасад).

parse-tag-invalid-attributes = DoenetML-и нодуруст: теги `{ $tag }` дуруст нест. Он метавонад атрибутҳои нодуруст дошта бошад.

parse-close-tag-name-missing = DoenetML-и нодуруст: теги пӯшандаи бе ном ёфт шуд, масалан `</`

parse-attribute-value-unquoted = Қиматҳои атрибут бояд дар нохунакҳо бошанд: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML-и нодуруст: теги пӯшандаи `{ $tag }` ёфт шуд, вале теги кушояндаи мувофиқ нест

parse-close-tag-mismatched = DoenetML-и нодуруст: теги пӯшандаи номувофиқ. `</{ $expected }>` интизор мешуд. `{ $found }` ёфт шуд

parser-node-unconvertible = Гиреҳи { $node }-ро ба гиреҳи Dast табдил додан нашуд.

## Names

name-attribute-invalid =
    Атрибути нодуруст name='{ $name }'. { $reason ->
        [characters] Номҳо танҳо метавонанд ҳарфҳо, рақамҳо, зерхатҳо ё тиреҳо дошта бошанд.
       *[start] Номҳо бояд бо ҳарф оғоз шаванд.
    }

component-name-invalid-start = Номи нодурусти ҷузъ «{ $name }». Номҳо бояд бо ҳарф оғоз шаванд.

## `<answer>` sugar

answer-video-watched-missing-video = answer-и навъи videoWatched бояд атрибути video дошта бошад

answer-video-watched-video-not-reference = атрибути video-и answer-и навъи videoWatched бояд истинод бошад

answer-name-not-single-text = атрибути name-и answer бояд маҳз як фарзанди матнӣ дошта бошад

## Referencing another document

external-doenetml-recursion-limit = Аз сабаби зиёд будани сатҳҳои рекурсия DoenetML-и берунаро гирифтан нашуд. Магар истиноди даврӣ ҳаст?

external-doenetml-unavailable = DoenetML-ро аз { $attribute }="{ $uri }" гирифтан нашуд

external-doenetml-type-mismatch = Аз { $attribute }="{ $uri }" DoenetML-и нодуруст гирифта шуд: он ба навъи ҷузъи «{ $componentType }» мувофиқат накард

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Атрибути `{ $from }` кӯҳна шудааст; ба ҷои он `{ $to }`-ро истифода баред.
       *[other] [deprecation] Атрибути `{ $from }`-и `<{ $component }>` кӯҳна шудааст; ба ҷои он `{ $to }`-ро истифода баред.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Атрибути `{ $from }` кӯҳна шудааст ва ба эътибор гирифта намешавад, зеро `{ $to }` низ дода шудааст.
       *[other] [deprecation] Атрибути `{ $from }`-и `<{ $component }>` кӯҳна шудааст ва ба эътибор гирифта намешавад, зеро `{ $to }` низ дода шудааст.
    }

deprecated-attribute-ignored = [deprecation] Атрибути `{ $attribute }`-и `<{ $component }>` кӯҳна шудааст ва ба эътибор гирифта намешавад.


## Language coverage

pluralize-english-only = `<pluralize>` танҳо дар забони англисӣ ҷамъбандӣ карда метавонад, бинобар ин дар ҳуҷҷати бо забони { $locale } навишташуда матни он бетағйир мемонад. Шакли ҷамъро худатон нависед ё онро бо атрибути `pluralForm` таъин кунед.


## Checking against the schema

schema-element-unrecognized = Унсури `<{ $tag }>` унсури шинохтаи Doenet нест.

schema-element-not-allowed-at-root = Унсури `<{ $tag }>` дар решаи ҳуҷҷат иҷозат дода намешавад.

schema-element-not-allowed-inside = Унсури `<{ $tag }>` дар дохили `<{ $parent }>` иҷозат дода намешавад.

schema-attribute-unrecognized = Унсури `<{ $tag }>` атрибути бо номи `{ $attribute }` надорад.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Атрибути `{ $attribute }`-и унсури `<{ $tag }>` бояд рӯйхате бошад, ки ҳар унсураш яке аз инҳо бошад: { $allowed }
       *[other] Атрибути `{ $attribute }`-и унсури `<{ $tag }>` бояд яке аз инҳо бошад: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Номи нодурусти варианти select. Номи варианти { $variantName } дар { $numOptions } интихоб вомехӯрад, вале шумораи интихобшаванда { $numToSelect } аст.

select-variant-name-without-options = Барои select вариантҳо дода шудаанд, вале барои номи варианти имконпазир ягон интихоб нест: { $variantName }.

select-variant-name-not-possible = Номи варианти { $variantName }, ки барои select дода шудааст, номи варианти имконпазир нест.

select-too-few-options = { $numToSelect } ҷузъро танҳо аз { $numOptions } интихоб кардан мумкин нест.

select-from-sequence-too-few-values = { $numToSelect } қиматро аз пайдарпайии дарозиаш { $length } интихоб кардан мумкин нест.

select-from-sequence-indices-count-mismatch = Шумораи индексҳои барои select додашуда бояд ба шумораи интихобшаванда мувофиқат кунад

select-from-sequence-indices-not-integers = Ҳамаи индексҳои барои select додашуда бояд адади бутун бошанд

select-from-sequence-index-excluded = Индекси додашудаи selectfromsequence хориҷ карда шуда буд

select-from-sequence-indices-excluded-combination = Индексҳои додашудаи selectfromsequence таркиби хориҷшуда буданд

select-from-sequence-coprime-not-positive-integers = Азбаски ададҳои бутуни мусбат интихоб намешаванд, таркибҳои ҷуфти сода интихоб кардан мумкин нест.

select-from-sequence-coprime-common-factor = Ададҳои ҷуфти содаро интихоб кардан мумкин нест. Ҳамаи қиматҳои имконпазир бахшкунандаи умумӣ доранд. (Қиматҳои додашудаи "from" ё "to" бояд бо "step" ҷуфти сода бошанд.)

select-from-sequence-coprime-single-number = Аз як адади ягона, ки 1 нест, таркибҳои ҷуфти сода интихоб кардан мумкин нест.

select-from-sequence-excluded-too-many-combinations = Дар selectFromSequence зиёда аз 70% таркибҳо хориҷ карда шудаанд

select-from-sequence-coprime-none-found = Ададҳои ҷуфти содаро интихоб кардан нашуд. Ҳамаи қиматҳои имконпазир бахшкунандаи умумӣ доранд.

select-from-sequence-too-few-unique-values = { $numToSelect } қимати гуногунро аз пайдарпайии дарозиаш { $numPossibleValues } интихоб кардан мумкин нест

select-prime-numbers-too-few-values = { $numToSelect } қиматро аз рӯйхати ададҳои содаи дарозиаш { $numValues } интихоб кардан мумкин нест

select-prime-numbers-values-count-mismatch = Шумораи қиматҳои барои select додашуда бояд ба шумораи интихобшаванда мувофиқат кунад

select-prime-numbers-values-not-prime = Ҳамаи қиматҳои барои select prime number додашуда бояд дар рӯйхати ададҳои сода бошанд

select-prime-numbers-values-excluded-combination = Қиматҳои додашудаи selectPrimeNumbers таркиби хориҷшуда буданд

select-prime-numbers-excluded-too-many-combinations = Дар selectPrimeNumbers зиёда аз 70% таркибҳо хориҷ карда шудаанд

select-random-combination-fluke = Аз сабаби тасодуфи бениҳоят камэҳтимол таркиби қиматҳои тасодуфиро интихоб кардан нашуд

select-random-value-fluke = Аз сабаби тасодуфи бениҳоят камэҳтимол қимати тасодуфиро интихоб кардан нашуд
