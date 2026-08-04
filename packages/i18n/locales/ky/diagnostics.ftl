# Kyrgyz diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Kyrgyz counts in the same two categories English does, so every selection
# below keeps both branches — but a noun after a numeral stays singular, so the
# two usually differ only in the number they print.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] эки учу тең берилгенде { $attributes } эске алынбайт
       *[other] эки учу тең берилгенде { $attributes } эске алынбайт
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] учу да, орто чекити да берилгенде { $attributes } эске алынбайт
       *[other] учу да, орто чекити да берилгенде { $attributes } эске алынбайт
    }

line-segment-midpoint-offset-without-midpoint = орто чекитсиз midpointOffset эч нерсеге таасир этпейт

## `<line>`

line-points-undetermined-dimensions = Өлчөмү белгисиз чекиттер аркылуу өткөн түз сызык.

line-points-too-few-dimensions = Түз сызык жок дегенде эки өлчөмдүү чекиттер аркылуу өтүшү керек.

line-points-depend-on-variables = Түз сызык өзгөрмөлөргө көз каранды чекиттер аркылуу өтөт: { $variables }.

line-equation-invalid-format = { $variable1 } жана { $variable2 } өзгөрмөлөрүндөгү түз сызыктын теңдемесинин форматы жараксыз.

## `<ray>`

ray-overprescribed-through = Нур through, endpoint жана direction аркылуу берилген. Берилген through эске алынбайт.

ray-dimension-mismatch = нурда numDimensions дал келбейт.

## `<vector>`

vector-overprescribed-head = Вектор head, tail жана displacement аркылуу берилген. Берилген head эске алынбайт.

vector-dimension-mismatch = вектордо numDimensions дал келбейт.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элементине тартууга болбойт, анткени анын nearestPoint абал өзгөрмөсү жок.

constrain-to-without-nearest-point = `<{ $component }>` элементи менен чектөөгө болбойт, анткени анын nearestPoint абал өзгөрмөсү жок.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементинин ички аймагы менен чектөөгө болбойт, анткени анын nearestPoint абал өзгөрмөсү жок.

## `<choiceInput>`

choice-input-label-position-ignored = сапка киргизилбеген choiceInput үчүн labelPosition эске алынбайт

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput үчүн берилген индекстер эске алынбайт, анткени алардын саны choice урпактарынын санына дал келбейт.

pretzel-indices-count-mismatch = problem үчүн берилген индекстер эске алынбайт, анткени алардын саны problem урпактарынын санына дал келбейт.

shuffle-indices-count-mismatch = shuffle үчүн берилген индекстер эске алынбайт, анткени алардын саны компоненттердин санына дал келбейт.

indices-ignored-out-of-range = { $component } үчүн берилген индекстер эске алынбайт, анткени кээ бири диапазондон тышкары.

pretzel-indices-repeated = pretzel үчүн берилген индекстер эске алынбайт, анткени кээ бири кайталанат.

pretzel-circuit-first-index = circuit режиминде pretzel үчүн берилген индекстер эске алынбайт, анткени биринчи индекс 1 болушу керек.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` тексттик урпактар менен иштеши үчүн `type` атрибуту берилиши керек.

invalid-type-defaulting-to-math = { $component } компоненти үчүн жараксыз түр { $type }. Ал math, text, number же boolean болушу керек. math колдонулат.

string-not-valid-component-to-arrange = «{ $value }» сабы { $component } үчүн жарактуу компонент эмес. Эске алынбайт.

## Types and variables

invalid-type-defaulting-to-number = Жараксыз түр { $type }, түрү number болуп коюлат.

invalid-variable-value = Өзгөрмөнүн жараксыз мааниси: `{ $value }`

## Variants

variant-index-must-be-number = Варианттын индекси { $index } сан болушу керек

variant-index-must-be-integer = Варианттын индекси { $index } бүтүн сан болушу керек

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолюттук өлчөмдөр үчүн ишке ашырылган эмес. Туурасы салыштырмалуу болот.

side-by-side-absolute-margins = `<{ $component }>` абсолюттук өлчөмдөр үчүн ишке ашырылган эмес. Четки талаалар салыштырмалуу болот.

side-by-side-no-block-child = Жараксыз `<{ $component }>`: анын жок дегенде бир блоктук урпагы болушу керек.

## `<label>`

label-for-ignored-on-graphical = Графикалык `<label>` элементиндеги `for` атрибуту эске алынбайт.

label-for-must-resolve-to-one = `<label>` элементиндеги `for` атрибуту так бир компонентке шилтеши керек.

label-for-unresolved = `<label>` элементиндеги `for` атрибутун компонент менен байланыштыруу мүмкүн болбоду.

label-for-answer-with-authored-inputs = `<label>` элементиндеги `for` атрибуту автор жазган киргизүү талаалары бар `<answer>` элементине шилтейт; талаага түздөн-түз шилтеңиз.

label-for-answer-without-input = `<label>` элементиндеги `for` атрибуту белгиленүүчү киргизүү талаасы жок `<answer>` элементине шилтейт.

label-for-must-reference-input-or-answer = `<label>` элементиндеги `for` атрибуту киргизүү талаасына же жоопко шилтеши керек.

## Accessibility

accessibility-short-description-or-decorative = Жеткиликтүүлүк үчүн `<{ $component }>` же кыскача сүрөттөмөгө ээ болушу, же жасалгалоочу катары белгиленүүсү керек.

accessibility-video-short-description = Жеткиликтүүлүк үчүн `<video>` кыскача сүрөттөмөгө ээ болушу керек.

accessibility-input-short-description-or-label = Жеткиликтүүлүк үчүн `<{ $component }>` кыскача сүрөттөмөгө же белгиге ээ болушу керек.

accessibility-answer-input-short-description-or-label = Жеткиликтүүлүк үчүн киргизүү талаасын түзгөн `<answer>` кыскача сүрөттөмөгө же белгиге ээ болушу керек.

accessibility-short-description-contains-math = Кыскача сүрөттөмөлөрдө `<{ $component }>` сыяктуу математикалык компоненттер болбошу керек. Математиканы сөз менен жазыңыз.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } бөлүмдүн аталышынын тексти үчүн жетиштүү контраст бербейт (караңгы тема) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; жок дегенде { $threshold }:1 талап кылынат).
       *[other] { $colorName } бөлүмдүн аталышынын тексти үчүн жетиштүү контраст бербейт ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; жок дегенде { $threshold }:1 талап кылынат).
    }

## `<circle>`

circle-through-points-non-numerical = Чекиттердин сандык мааниси жок болгондо { $count } чекит аркылуу өткөн `<circle>` ишке ашырылган эмес.

circle-too-many-through-points = 3төн көп чекит аркылуу өткөн айлананы эсептөө мүмкүн эмес.

circle-overprescribed-radius-center-points = Берилген радиус, борбор жана чекиттер менен айлананы эсептөө мүмкүн эмес.

circle-center-with-multiple-points = Берилген борбор менен 1ден көп чекит аркылуу өткөн айлананы эсептөө мүмкүн эмес.

circle-radius-too-small = Айлананы эсептөө мүмкүн эмес: эки чекиттин ортосундагы аралык { $distance } болгондуктан, берилген радиус { $radius } өтө кичине.

circle-radius-with-many-points = Берилген радиус менен экиден көп чекит аркылуу өткөн айлана түзүү мүмкүн эмес.

circle-invalid-center-or-through-points = Айлананын борбору же чекиттери жараксыз.

circle-radius-center-with-multiple-points = Берилген борбор менен 1ден көп чекит аркылуу өткөн айлананын радиусун эсептөө мүмкүн эмес.

circle-change-radius-non-numerical = Сандык эмес чекиттери бар айлананын радиусун өзгөртүү мүмкүн эмес

circle-radius-with-points-non-numerical = Сандык маанилер жок болгондо берилген радиус менен бирден көп чекит аркылуу өткөн айлана түзүү мүмкүн эмес.

circle-change-center-non-numerical = Сандык эмес чекиттер аркылуу өткөн айлананын борборун өзгөртүү ишке ашырылган эмес.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функциянын аныкталуу областынын өлчөмү жетишсиз. Областта { $intervals } аралык бар, функцияда болсо { $inputs ->
            [one] { $inputs } кириш
           *[other] { $inputs } кириш
        }.
       *[other] Функциянын аныкталуу областынын өлчөмү жетишсиз. Областта { $intervals } аралык бар, функцияда болсо { $inputs ->
            [one] { $inputs } кириш
           *[other] { $inputs } кириш
        }.
    }

function-domain-invalid-format = Функциянын аныкталуу областынын форматы жараксыз.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функциянын сандык эмес максимуму эске алынбайт.
        [minimum] Функциянын сандык эмес минимуму эске алынбайт.
        [extremum] Функциянын сандык эмес экстремуму эске алынбайт.
        [point] Функциянын сандык эмес чекити эске алынбайт.
        [slope] Функциянын сандык эмес бурчтук коэффициенти эске алынбайт.
       *[other] Функциянын сандык эмес { $type } мааниси эске алынбайт.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функциянын бош максимуму эске алынбайт.
        [minimum] Функциянын бош минимуму эске алынбайт.
        [extremum] Функциянын бош экстремуму эске алынбайт.
        [point] Функциянын бош чекити эске алынбайт.
       *[other] Функциянын бош { $type } мааниси эске алынбайт.
    }

function-points-too-close = Функцияда бири-бирине өтө жакын эки чекит бар. Функцияны аныктоо мүмкүн эмес.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функциянын итерациялары кириштердин саны чыгыштардын санына барабар болгондо гана мүмкүн. Бул функцияда { $inputs } кириш жана { $outputs ->
            [one] { $outputs } чыгыш
           *[other] { $outputs } чыгыш
        } бар.
       *[other] Функциянын итерациялары кириштердин саны чыгыштардын санына барабар болгондо гана мүмкүн. Бул функцияда { $inputs } кириш жана { $outputs ->
            [one] { $outputs } чыгыш
           *[other] { $outputs } чыгыш
        } бар.
    }

## `<sequence>`

sequence-invalid-length = Ырааттуулуктун узундугу жараксыз. Ал терс эмес бүтүн сан болушу керек.

sequence-invalid-step = Ырааттуулуктун кадамы жараксыз. { $type } түрүндөгү ырааттуулук үчүн ал сан болушу керек.

sequence-invalid-endpoint-number = Сандык ырааттуулуктун «{ $attribute }» мааниси жараксыз. Ал сан болушу керек.

sequence-invalid-endpoint-letters = Тамгалык ырааттуулуктун «{ $attribute }» мааниси жараксыз. Ал тамгалардын айкалышы болушу керек.

sequence-invalid-endpoint = Ырааттуулуктун «{ $attribute }» мааниси жараксыз.

select-from-sequence-coprime-not-numbers = сандар тандалбагандыктан coprime эске алынбайт

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations берилгендиктен coprime эске алынбайт

## Resolving a `target`

target-not-found = `<{ $source }>` үчүн жараксыз target: бутага табылган жок.

target-state-variable-not-found = `<{ $source }>` үчүн жараксыз target: `<{ $component }>` элементинде «{ $property }» аттуу абал өзгөрмөсү табылган жок.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` өзгөрмөлөрү көз каранды эмес өзгөрмөдөн айырмаланышы керек.

ode-system-duplicate-variable-names = Көз каранды өзгөрмөлөрдүн кайталанган аттары менен ДТ оң жак функцияларын аныктоо мүмкүн эмес.

ode-system-rhs-function-error = ДТ оң жак функциясын аныктоо мүмкүн эмес. mathjs функциясын түзүүдө ката.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } түз сызыктын ортосундагы бурчту аныктоо мүмкүн эмес

angle-invalid-through-point = `<angle>` элементинин through маанисинде жараксыз чекит

parabola-vertex-too-many-points = Берилген чоку менен 1ден көп чекит аркылуу өткөн парабола ишке ашырылган эмес.

parabola-too-many-points = 3төн көп чекит аркылуу өткөн парабола ишке ашырылган эмес.

intersection-too-many-items = Экиден көп объекттин кесилиши ишке ашырылган эмес

## Other math components

ionic-compound-not-two-ions = Эки иондон башка иондук кошулмалар ишке ашырылган эмес.

ionic-compound-needs-cation-and-anion = Иондук кошулмалар бир катион жана бир анион үчүн гана ишке ашырылган.

solve-equations-cannot-evaluate = Теңдемени чечүү мүмкүн эмес, анткени аны эсептөө мүмкүн болбоду: { $equation }

math-operators-operand-number-required = Математикалык операндды бөлүп алуу үчүн operandNumber берилиши керек.

eigen-decomposition-failed = Матрицанын өздүк маанилерин эсептөө мүмкүн болбоду

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметри үлгүдө кездешпейт, ошондуктан ал ар дайым бош мааниге дал келет.
       *[other] `<matchesPattern>`: { $parameters } параметрлери үлгүдө кездешпейт, ошондуктан алар ар дайым бош мааниге дал келет.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" маанисин чечмелөө мүмкүн эмес. Ал none, medium, dense же боштук менен ажыратылган эки оң сан болушу керек, мисалы grid="1 0.5". Тор тартылбайт.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure чагылдыргычында xLabelPosition="left" колдоого алынбайт; оң жактагы жайгашуу колдонулат.

prefigure-y-label-position-unsupported = `<graph>`: prefigure чагылдыргычында yLabelPosition="bottom" колдоого алынбайт; жогорку жайгашуу колдонулат.

prefigure-invalid-axis-bounds = `<graph>`: prefigure айландыруусу үчүн октордун чектери жараксыз; демейки bbox (-10,-10,10,10) колдонулат.

prefigure-invalid-width = `<graph>`: prefigure айландыруусу үчүн туурасы жараксыз; диаграмманын демейки туурасы 425 колдонулат.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure айландыруусу үчүн aspectRatio жараксыз; демейки капталдардын катышы 1 колдонулат.

prefigure-grid-spacing-too-fine = `<graph>`: тордун кадамы октордун чектери үчүн өтө майда; prefigure чагылдыргычында тор түшүрүлүп калтырылат.

prefigure-annotations-not-rendered = `<graph>`: PreFigure чагылдыргычы колдонулбаганда аннотациялар тартылбайт.

multiple-annotations-children = `<graph>` ичинде бир нече `<annotations>` урпагы табылды; акыркысынан башкасынын баары эске алынбайт.

## Referring to other components

copy-unrecognized-component-type = Таанылбаган компонент түрүн кеңейтүү же көчүрүү мүмкүн эмес: { $type }.

copy-prop-not-found = { $component } түрүндөгү компонентте { $property } касиети табылган жок

collect-no-source = collect үчүн булак табылган жок.

collect-invalid-component-type = `<{ $component }>` түрүндөгү компоненттерди чогултуу мүмкүн эмес, анткени бул жараксыз компонент түрү.

reference-index-unavailable = `{ $reference }` индексине шилтеме кылуу мүмкүн эмес

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентинде { $action } чакыруу мүмкүн эмес

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Маалыматтардын формасы жараксыз. Саптардын узундугу ар башка. Табылды componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Маалыматтарда кайталанган мамыча аттары бар. Табылды componentIdx :{ $componentIdx }

data-frame-missing-column-name = Маалыматтарда мамычанын аты жок. Табылды componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Бул жооптун award мааниси answer тегинин өз жөнөтүлгөн жообуна негизделген, бул күтүлбөгөн жүрүм-турумга алып келет.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` бар контейнердин ичиндеги `<answer>` элементине `maxNumAttempts` коюу таасир этпейт, анткени аракеттердин санын контейнер аныктайт. `maxNumAttempts` маанисин контейнерге коюңуз.

nested-section-wide-check-work-max-num-attempts = Башка `sectionWideCheckWork` контейнеринин ичинде турган `sectionWideCheckWork` контейнерине `maxNumAttempts` коюу таасир этпейт, анткени аракеттердин санын сырткы контейнер аныктайт. `maxNumAttempts` маанисин сырткы контейнерге коюңуз.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality коюлбаса, { $attributes } атрибуту таасир этпейт.
       *[other] symbolicEquality коюлбаса, { $attributes } атрибуттары таасир этпейт.
    }

answer-invalid-type = answer үчүн жараксыз түр: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентинин аты жок болгондуктан, аны модуль атрибуту катары колдонуу мүмкүн эмес

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентин модуль атрибуту катары колдонуу мүмкүн эмес, анткени `<module>` компонент түрүндө «{ $name }» атрибуту мурдатан аныкталган.

conditional-content-condition-ignored = case же else урпактары бар `<conditionalContent>` компонентинде `condition` атрибуту эске алынбайт.

slider-markers-type-mismatch = Маркерлердин түрү жылдыргычтын түрүнө дал келбейт.

pretzel-problem-needs-statement-and-answer = Жараксыз pretzel: ар бир `<problem>` бир `<statement>` жана бир `<answer>` камтышы керек.

pretzel-circuit-first-problem-distractor = Жараксыз pretzel: mode="circuit" режиминде биринчи `<problem>` алаксытуучу боло албайт.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибуту үчүн жараксыз маани { $values }; эске алынбайт.
       *[other] `{ $attribute }` атрибуту үчүн жараксыз маанилер { $values }; эске алынбайт.
    }

attribute-must-be-references = `{ $attribute }` атрибуту үчүн жараксыз маани `{ $value }`. Атрибут `$` белгисинен башталган шилтемелерден турушу керек.

math-input-invalid-function-names = <mathInput>: { $attribute } ичиндеги жараксыз функция аттары эске алынган жок: { $names }. Ар бир аттын көрсөтүлүүчү бөлүгү жок дегенде 2 белги болушу керек (тамгалар же сызыкчалар); андан кийин милдеттүү эмес `|<mathspeak алтернатива>` мүчөсү келиши мүмкүн.

## Building components from the source

component-type-invalid = Жараксыз компонент түрү: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутун кайталоого болбойт.

attribute-invalid-for-component = `<{ $componentType }>` түрүндөгү компонент үчүн жараксыз атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль аныктамасында { $context ->
        [text-on-background] тексттин түсү менен фондун түсүнүн
        [high-contrast] жогорку контрасттуу түс менен кенептин
        [line] сызыктын түсү менен кенептин
        [marker] маркердин түсү менен кенептин
       *[text-on-canvas] тексттин түсү менен кенептин
    } ортосундагы контраст жетишсиз{ $mode ->
        [dark] { " (караңгы тема)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; жок дегенде { $threshold }:1 талап кылынат).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль аныктамасында берилген түстөр ачык тема үчүн жетиштүү контраст берсе да, алардан алынган караңгы теманын түстөрү текст менен фондун ортосунда жетишсиз контраст берет ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; жок дегенде { $threshold }:1 талап кылынат). { $suggestion ->
        [available] Караңгы темада жетиштүү контраст үчүн же ачык темадагы контрастты жогорулатыңыз (мисалы { $lightAttribute }="{ $lightColor }"), же караңгы теманын түсүн алмаштырыңыз (мисалы { $darkAttribute }="{ $darkColor }").
       *[none] Караңгы темада жетиштүү контраст үчүн ачык темадагы контрастты жогорулатыңыз же алынган түстөрдү textColorDarkMode жана/же backgroundColorDarkMode менен алмаштырыңыз.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль аныктамасында берилген тексттин түсү ачык тема үчүн жетиштүү контраст берсе да, андан алынган караңгы теманын текст түсү кенеп менен жетишсиз контраст берет ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; жок дегенде { $threshold }:1 талап кылынат). { $suggestion ->
        [available] Караңгы темада жетиштүү контраст үчүн же ачык темадагы контрастты жогорулатыңыз (мисалы textColor="{ $lightColor }"), же караңгы теманын түсүн алмаштырыңыз (мисалы textColorDarkMode="{ $darkColor }").
       *[none] Караңгы темада жетиштүү контраст үчүн ачык темадагы контрастты жогорулатыңыз же алынган түстү textColorDarkMode менен алмаштырыңыз.
    }

section-multiple-style-palettes = Бөлүм бир гана <stylePalette> тандай алат; акыркысы колдонулат.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } үчүн уникалдуу варианттарды аныктоо мүмкүн эмес, анткени numToSelect терс эмес бүтүн сан эмес.

variant-num-to-select-not-constant-number = { $component } үчүн уникалдуу варианттарды аныктоо мүмкүн эмес, анткени numToSelect туруктуу сан эмес.

variant-with-replacement-not-constant-boolean = { $component } үчүн уникалдуу варианттарды аныктоо мүмкүн эмес, анткени withReplacement туруктуу логикалык маани эмес.

variant-select-weight-disables-unique = кайсы бир вариантта selectWeight же selectForVariants берилсе, select үчүн уникалдуу варианттар өчүрүлөт

variant-coprime-undetermined = { $component } үчүн уникалдуу варианттарды аныктоо мүмкүн эмес, анткени coprime ар дайым жалган экенин аныктоо мүмкүн эмес.

variant-attribute-not-constant = { $component } үчүн уникалдуу варианттарды аныктоо мүмкүн эмес, анткени { $attribute } туруктуу эмес.

variant-attribute-not-number = { $component } үчүн уникалдуу варианттарды аныктоо мүмкүн эмес, анткени { $attribute } сан эмес.

variant-attribute-wrong-type-for-sequence =
    { $type } түрүндөгү { $component } үчүн уникалдуу варианттарды аныктоо мүмкүн эмес, анткени { $attribute } { $expected ->
        [letters-combination] тамгалардын айкалышы
        [math-expression] жарактуу математикалык туюнтма
        [integer] бүтүн сан
       *[number] сан
    } эмес.

variant-length-not-integer = { $component } үчүн уникалдуу варианттарды аныктоо мүмкүн эмес, анткени length бүтүн сан эмес.

variant-sort-not-implemented = sort бар { $component } үчүн уникалдуу варианттар ишке ашырылган эмес

variant-exclude-combinations-not-implemented = excludeCombinations бар { $component } үчүн уникалдуу варианттар ишке ашырылган эмес

variant-math-exclude-not-implemented = exclude бар math түрүндөгү { $component } үчүн уникалдуу варианттар ишке ашырылган эмес

variant-non-constant-exclude-not-implemented = туруктуу эмес exclude бар { $component } үчүн уникалдуу варианттар ишке ашырылган эмес

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графиктин prefigure чагылдыргычында колдоого алынбайт; урпак өткөрүлүп жиберилди.

prefigure-descendant-invalid-geometry = { $subject }: чексиз же толук эмес геометрия; урпак өткөрүлүп жиберилди.

prefigure-curve-label-omitted = { $subject }: айландырылган ийри элементтеринде белгилер колдоого алынбайт; белги түшүрүлүп калтырылды.

prefigure-curve-unsupported-definition-type = { $subject }: колдоого алынбаган ийри функциясынын аныктама түрү «{ $definitionType }»; урпак өткөрүлүп жиберилди.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементиндеги flipFunctions атрибуту колдоого алынбайт; урпак өткөрүлүп жиберилди.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves формула менен берилген урпак функцияларды гана колдойт; урпак өткөрүлүп жиберилди.

prefigure-label-position-unsupported =
    { $subject }: колдоого алынбаган labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] түз сызыктар тобунун белгиси үчүн
       *[point] чекиттин белгиси үчүн
    }; PreFigure демейки тегиздөөсү колдонулат.

prefigure-fill-style-unsupported = { $subject }: толтуруу стили «{ $fillStyle }» PreFigure тарабынан колдоого алынбайт; бир өңдүү толтурууга өтүлөт.

prefigure-line-style-unknown = { $subject }: белгисиз сызык стили «{ $lineStyle }» PreFigure чыгарылышынан алынып салынды.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер стили «{ $markerStyle }» PreFigure «diamond» стилине дал келтирилди.

prefigure-marker-style-unsupported = { $subject }: маркер стили «{ $markerStyle }» PreFigure тарабынан колдоого алынбайт; демейки стиль колдонулат.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: жараксыз `ref`; бутаны байланыштыруу мүмкүн эмес. Аннотация түшүрүлүп калтырылды.

annotation-ref-multiple-targets = `<annotation>`: `ref` бир нече бута менен байланышты; биринчиси колдонулат.

annotation-ref-outside-graph = `<annotation>`: жараксыз `ref`; бута аны камтыган графиктен тышкары. Аннотация түшүрүлүп калтырылды.

annotation-ref-unsupported-target = `<annotation>`: жараксыз `ref`; бута prefigure айландыруусунда колдоого алынган графикалык объект эмес. Аннотация түшүрүлүп калтырылды.

annotation-text-missing = `<annotation>`: `text` жок же бош; бош текст чыгарылат.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Циклдик көз карандылык аныкталды.
       *[other] `<{ $componentType }>` компонентин камтыган циклдик көз карандылык аныкталды.
    }

reference-no-referent = Шилтемеге объект табылган жок: `{ $reference }`

reference-multiple-referents = Шилтемеге бир нече объект табылды: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементинин { $attribute } атрибутунун форматы жараксыз.

children-invalid = `<{ $componentType }>` үчүн жараксыз урпактар: жараксыз урпактар табылды: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибуту үчүн жараксыз маани `{ $value }`; `{ $default }` мааниси колдонулат

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версиясы табылган жок.
       *[other] DoenetML { $version } версиясы табылган жок. { $fallback } версиясы колдонулат
    }

## Reading the DoenetML

parse-invalid-doenetml = Жараксыз DoenetML: { $content }

parse-tag-missing-close-tag = Жараксыз DoenetML: `{ $tag }` тегинин жабуучу теги жок. Өзү жабылуучу тег же `</{ $tagName }>` теги күтүлдү.

parse-tag-error = Жараксыз DoenetML: `<{ $tagName }>` тегинде ката

parse-attribute-missing-value = Жараксыз DoenetML: `{ $attribute }` атрибутунда маани жок сыяктуу.

parse-attribute-invalid = Жараксыз DoenetML: жараксыз атрибут `{ $attribute }`

parse-attribute-value-invalid = Жараксыз DoenetML: жараксыз атрибут мааниси `{ $value }`

parse-attribute-value-quote-mismatch = Жараксыз DoenetML: жараксыз атрибут мааниси `{ $value }`. Тырмакчалар дал келбейт. `{ $quote }` жок сыяктуу

parse-open-tag-name-missing = Жараксыз DoenetML: аты жок тег табылды, мисалы `<`

parse-tag-not-closed = Жараксыз DoenetML: `{ $tag }` теги жабылган эмес (`>` жок сыяктуу).

parse-self-closing-tag-name-missing = Жараксыз DoenetML: аты жок тег табылды `<{ $content }>`

parse-self-closing-tag-not-closed = Жараксыз DoenetML: `{ $tag }` теги жабылган эмес (`/>` жок сыяктуу).

parse-tag-invalid-attributes = Жараксыз DoenetML: `{ $tag }` теги жарактуу эмес. Анын атрибуттары туура эмес болушу мүмкүн.

parse-close-tag-name-missing = Жараксыз DoenetML: аты жок жабуучу тег табылды, мисалы `</`

parse-attribute-value-unquoted = Атрибуттардын маанилери тырмакчага алынышы керек: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Жараксыз DoenetML: `{ $tag }` жабуучу теги табылды, бирок ага дал келген ачуучу тег жок

parse-close-tag-mismatched = Жараксыз DoenetML: дал келбеген жабуучу тег. `</{ $expected }>` күтүлдү. `{ $found }` табылды

parser-node-unconvertible = { $node } түйүнүн Dast түйүнүнө айландыруу мүмкүн болбоду.

## Names

name-attribute-invalid =
    Жараксыз атрибут name='{ $name }'. { $reason ->
        [characters] Аттарда тамгалар, сандар, астыңкы сызыктар же дефистер гана болушу мүмкүн.
       *[start] Аттар тамгадан башталышы керек.
    }

component-name-invalid-start = Жараксыз компоненттин аты «{ $name }». Аттар тамгадан башталышы керек.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched түрүндөгү answer-дин video атрибуту болушу керек

answer-video-watched-video-not-reference = videoWatched түрүндөгү answer-дин video атрибуту шилтеме болушу керек

answer-name-not-single-text = answer-дин name атрибутунда так бир тексттик урпак болушу керек

## Referencing another document

external-doenetml-recursion-limit = Рекурсиянын деңгээли өтө көп болгондуктан сырткы DoenetML алуу мүмкүн болбоду. Циклдик шилтеме жокпу?

external-doenetml-unavailable = { $attribute }="{ $uri }" дарегинен DoenetML алуу мүмкүн болбоду

external-doenetml-type-mismatch = { $attribute }="{ $uri }" дарегинен жараксыз DoenetML алынды: ал «{ $componentType }» компонент түрүнө дал келген жок

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибуту эскирген; анын ордуна `{ $to }` колдонуңуз.
       *[other] [deprecation] `<{ $component }>` элементиндеги `{ $from }` атрибуту эскирген; анын ордуна `{ $to }` колдонуңуз.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибуту эскирген жана эске алынбайт, анткени `{ $to }` да берилген.
       *[other] [deprecation] `<{ $component }>` элементиндеги `{ $from }` атрибуту эскирген жана эске алынбайт, анткени `{ $to }` да берилген.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементиндеги `{ $attribute }` атрибуту эскирген жана эске алынбайт.


## Language coverage

pluralize-english-only = `<pluralize>` көптүк түрдү англис тилинде гана жасай алат, ошондуктан { $locale } тилинде жазылган документте анын тексти өзгөрүүсүз калат. Көптүк түрдү өзүңүз жазыңыз же `pluralForm` атрибуту менен бериңиз.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элементи таанылган Doenet элементи эмес.

schema-element-not-allowed-at-root = `<{ $tag }>` элементине документтин түбүндө уруксат берилбейт.

schema-element-not-allowed-inside = `<{ $tag }>` элементине `<{ $parent }>` ичинде уруксат берилбейт.

schema-attribute-unrecognized = `<{ $tag }>` элементинде `{ $attribute }` аттуу атрибут жок.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементинин `{ $attribute }` атрибуту ар бир элементи төмөнкүлөрдүн бири болгон тизме болушу керек: { $allowed }
       *[other] `<{ $tag }>` элементинин `{ $attribute }` атрибуту төмөнкүлөрдүн бири болушу керек: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select үчүн жараксыз варианттын аты. { $variantName } варианттын аты { $numOptions } вариантта кездешет, тандала турган сан болсо { $numToSelect }.

select-variant-name-without-options = select үчүн варианттар берилген, бирок мүмкүн болгон варианттын атына бир да тандоо жок: { $variantName }.

select-variant-name-not-possible = select үчүн берилген { $variantName } варианттын аты мүмкүн болгон варианттын аты эмес.

select-too-few-options = Болгону { $numOptions } ичинен { $numToSelect } компонентти тандоо мүмкүн эмес.

select-from-sequence-too-few-values = Узундугу { $length } ырааттуулуктан { $numToSelect } маани тандоо мүмкүн эмес.

select-from-sequence-indices-count-mismatch = select үчүн берилген индекстердин саны тандала турган санга дал келиши керек

select-from-sequence-indices-not-integers = select үчүн берилген бардык индекстер бүтүн сан болушу керек

select-from-sequence-index-excluded = selectfromsequence үчүн берилген индекс алынып салынган эле

select-from-sequence-indices-excluded-combination = selectfromsequence үчүн берилген индекстер алынып салынган айкалыш эле

select-from-sequence-coprime-not-positive-integers = Оң бүтүн сандар тандалбагандыктан өз ара жөнөкөй айкалыштарды тандоо мүмкүн эмес.

select-from-sequence-coprime-common-factor = Өз ара жөнөкөй сандарды тандоо мүмкүн эмес. Бардык мүмкүн болгон маанилердин жалпы бөлүүчүсү бар. (Берилген "from" же "to" маанилери "step" мааниси менен өз ара жөнөкөй болушу керек.)

select-from-sequence-coprime-single-number = 1ден башка жалгыз сандан өз ара жөнөкөй айкалыштарды тандоо мүмкүн эмес.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ичинде айкалыштардын 70%дан ашыгы алынып салынды

select-from-sequence-coprime-none-found = Өз ара жөнөкөй сандарды тандоо мүмкүн болбоду. Бардык мүмкүн болгон маанилердин жалпы бөлүүчүсү бар.

select-from-sequence-too-few-unique-values = Узундугу { $numPossibleValues } ырааттуулуктан { $numToSelect } башка маани тандоо мүмкүн эмес

select-prime-numbers-too-few-values = Узундугу { $numValues } жөнөкөй сандар тизмесинен { $numToSelect } маани тандоо мүмкүн эмес

select-prime-numbers-values-count-mismatch = select үчүн берилген маанилердин саны тандала турган санга дал келиши керек

select-prime-numbers-values-not-prime = select prime number үчүн берилген бардык маанилер жөнөкөй сандар тизмесинде болушу керек

select-prime-numbers-values-excluded-combination = selectPrimeNumbers үчүн берилген маанилер алынып салынган айкалыш эле

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ичинде айкалыштардын 70%дан ашыгы алынып салынды

select-random-combination-fluke = Өтө күтүлбөгөн кокустуктан улам кокустук маанилердин айкалышын тандоо мүмкүн болбоду

select-random-value-fluke = Өтө күтүлбөгөн кокустуктан улам кокустук маани тандоо мүмкүн болбоду
