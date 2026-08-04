# Kazakh diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Kazakh counts in the same two categories English does, so every selection
# below keeps both branches — but a noun after a numeral stays singular, so the
# two usually differ only in the number they print.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] екі ұш нүкте де берілгенде { $attributes } еленбейді
       *[other] екі ұш нүкте де берілгенде { $attributes } еленбейді
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] ұш нүкте де, орта нүкте де берілгенде { $attributes } еленбейді
       *[other] ұш нүкте де, орта нүкте де берілгенде { $attributes } еленбейді
    }

line-segment-midpoint-offset-without-midpoint = орта нүктесіз midpointOffset ешнәрсеге әсер етпейді

## `<line>`

line-points-undetermined-dimensions = Өлшемі белгісіз нүктелер арқылы өтетін түзу.

line-points-too-few-dimensions = Түзу кемінде екі өлшемді нүктелер арқылы өтуі керек.

line-points-depend-on-variables = Түзу айнымалыларға тәуелді нүктелер арқылы өтеді: { $variables }.

line-equation-invalid-format = { $variable1 } және { $variable2 } айнымалыларындағы түзу теңдеуінің пішімі жарамсыз.

## `<ray>`

ray-overprescribed-through = Сәуле through, endpoint және direction арқылы берілген. Берілген through еленбейді.

ray-dimension-mismatch = сәуледе numDimensions сәйкес келмейді.

## `<vector>`

vector-overprescribed-head = Вектор head, tail және displacement арқылы берілген. Берілген head еленбейді.

vector-dimension-mismatch = векторда numDimensions сәйкес келмейді.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элементіне тартуға болмайды, себебі оның nearestPoint күй айнымалысы жоқ.

constrain-to-without-nearest-point = `<{ $component }>` элементімен шектеуге болмайды, себебі оның nearestPoint күй айнымалысы жоқ.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементінің ішкі аймағымен шектеуге болмайды, себебі оның nearestPoint күй айнымалысы жоқ.

## `<choiceInput>`

choice-input-label-position-ignored = жолішілік емес choiceInput үшін labelPosition еленбейді

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput үшін берілген индекстер еленбейді, себебі олардың саны choice ұрпақтарының санына сәйкес келмейді.

pretzel-indices-count-mismatch = problem үшін берілген индекстер еленбейді, себебі олардың саны problem ұрпақтарының санына сәйкес келмейді.

shuffle-indices-count-mismatch = shuffle үшін берілген индекстер еленбейді, себебі олардың саны құрамдастардың санына сәйкес келмейді.

indices-ignored-out-of-range = { $component } үшін берілген индекстер еленбейді, себебі кейбірі ауқымнан тыс.

pretzel-indices-repeated = pretzel үшін берілген индекстер еленбейді, себебі кейбірі қайталанады.

pretzel-circuit-first-index = circuit режимінде pretzel үшін берілген индекстер еленбейді, себебі бірінші индекс 1 болуы керек.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` мәтіндік ұрпақтармен жұмыс істеуі үшін `type` атрибуты берілуі керек.

invalid-type-defaulting-to-math = { $component } құрамдасы үшін жарамсыз түр { $type }. Ол math, text, number немесе boolean болуы керек. math қолданылады.

string-not-valid-component-to-arrange = «{ $value }» жолы { $component } үшін жарамды құрамдас емес. Еленбейді.

## Types and variables

invalid-type-defaulting-to-number = Жарамсыз түр { $type }, түрі number болып қойылады.

invalid-variable-value = Айнымалының жарамсыз мәні: `{ $value }`

## Variants

variant-index-must-be-number = Нұсқа индексі { $index } сан болуы керек

variant-index-must-be-integer = Нұсқа индексі { $index } бүтін сан болуы керек

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолютті өлшемдер үшін жүзеге асырылмаған. Ендер салыстырмалы болады.

side-by-side-absolute-margins = `<{ $component }>` абсолютті өлшемдер үшін жүзеге асырылмаған. Шет өрістері салыстырмалы болады.

side-by-side-no-block-child = Жарамсыз `<{ $component }>`: оның кемінде бір блоктық ұрпағы болуы керек.

## `<label>`

label-for-ignored-on-graphical = Графикалық `<label>` элементіндегі `for` атрибуты еленбейді.

label-for-must-resolve-to-one = `<label>` элементіндегі `for` атрибуты дәл бір құрамдасқа сілтеуі керек.

label-for-unresolved = `<label>` элементіндегі `for` атрибутын құрамдаспен байланыстыру мүмкін болмады.

label-for-answer-with-authored-inputs = `<label>` элементіндегі `for` атрибуты авторы жазған енгізу өрістері бар `<answer>` элементіне сілтейді; өріске тікелей сілтеңіз.

label-for-answer-without-input = `<label>` элементіндегі `for` атрибуты белгіленетін енгізу өрісі жоқ `<answer>` элементіне сілтейді.

label-for-must-reference-input-or-answer = `<label>` элементіндегі `for` атрибуты енгізу өрісіне немесе жауапқа сілтеуі керек.

## Accessibility

accessibility-short-description-or-decorative = Қолжетімділік үшін `<{ $component }>` не қысқа сипаттамасы болуы, не безендіру ретінде белгіленуі керек.

accessibility-video-short-description = Қолжетімділік үшін `<video>` қысқа сипаттамасы болуы керек.

accessibility-input-short-description-or-label = Қолжетімділік үшін `<{ $component }>` қысқа сипаттамасы немесе белгісі болуы керек.

accessibility-answer-input-short-description-or-label = Қолжетімділік үшін енгізу өрісін жасайтын `<answer>` қысқа сипаттамасы немесе белгісі болуы керек.

accessibility-short-description-contains-math = Қысқа сипаттамаларда `<{ $component }>` сияқты математикалық құрамдастар болмауы керек. Математиканы сөзбен жазыңыз.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } бөлім тақырыбының мәтіні үшін жеткілікті контраст бермейді (қараңғы режим) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кемінде { $threshold }:1 қажет).
       *[other] { $colorName } бөлім тақырыбының мәтіні үшін жеткілікті контраст бермейді ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кемінде { $threshold }:1 қажет).
    }

## `<circle>`

circle-through-points-non-numerical = Нүктелердің сандық мәндері болмағанда { $count } нүкте арқылы өтетін `<circle>` жүзеге асырылмаған.

circle-too-many-through-points = 3-тен көп нүкте арқылы өтетін шеңберді есептеу мүмкін емес.

circle-overprescribed-radius-center-points = Берілген радиус, центр және нүктелермен шеңберді есептеу мүмкін емес.

circle-center-with-multiple-points = Берілген центрмен 1-ден көп нүкте арқылы өтетін шеңберді есептеу мүмкін емес.

circle-radius-too-small = Шеңберді есептеу мүмкін емес: екі нүкте арасындағы қашықтық { $distance } болғандықтан, берілген радиус { $radius } тым кіші.

circle-radius-with-many-points = Берілген радиуспен екіден көп нүкте арқылы өтетін шеңбер құру мүмкін емес.

circle-invalid-center-or-through-points = Шеңбердің центрі немесе нүктелері жарамсыз.

circle-radius-center-with-multiple-points = Берілген центрмен 1-ден көп нүкте арқылы өтетін шеңбердің радиусын есептеу мүмкін емес.

circle-change-radius-non-numerical = Сандық емес нүктелері бар шеңбердің радиусын өзгерту мүмкін емес

circle-radius-with-points-non-numerical = Сандық мәндер болмағанда берілген радиуспен бірден көп нүкте арқылы өтетін шеңбер құру мүмкін емес.

circle-change-center-non-numerical = Сандық емес нүктелер арқылы өтетін шеңбердің центрін өзгерту жүзеге асырылмаған.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцияның анықталу облысының өлшемі жеткіліксіз. Облыста { $intervals } аралық бар, ал функцияда { $inputs ->
            [one] { $inputs } кіріс
           *[other] { $inputs } кіріс
        }.
       *[other] Функцияның анықталу облысының өлшемі жеткіліксіз. Облыста { $intervals } аралық бар, ал функцияда { $inputs ->
            [one] { $inputs } кіріс
           *[other] { $inputs } кіріс
        }.
    }

function-domain-invalid-format = Функцияның анықталу облысының пішімі жарамсыз.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцияның сандық емес максимумы еленбейді.
        [minimum] Функцияның сандық емес минимумы еленбейді.
        [extremum] Функцияның сандық емес экстремумы еленбейді.
        [point] Функцияның сандық емес нүктесі еленбейді.
        [slope] Функцияның сандық емес бұрыштық коэффициенті еленбейді.
       *[other] Функцияның сандық емес { $type } мәні еленбейді.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцияның бос максимумы еленбейді.
        [minimum] Функцияның бос минимумы еленбейді.
        [extremum] Функцияның бос экстремумы еленбейді.
        [point] Функцияның бос нүктесі еленбейді.
       *[other] Функцияның бос { $type } мәні еленбейді.
    }

function-points-too-close = Функцияда бір-біріне тым жақын екі нүкте бар. Функцияны анықтау мүмкін емес.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функция итерациялары тек кірістер саны шығыстар санына тең болғанда ғана мүмкін. Бұл функцияда { $inputs } кіріс және { $outputs ->
            [one] { $outputs } шығыс
           *[other] { $outputs } шығыс
        } бар.
       *[other] Функция итерациялары тек кірістер саны шығыстар санына тең болғанда ғана мүмкін. Бұл функцияда { $inputs } кіріс және { $outputs ->
            [one] { $outputs } шығыс
           *[other] { $outputs } шығыс
        } бар.
    }

## `<sequence>`

sequence-invalid-length = Тізбектің ұзындығы жарамсыз. Ол теріс емес бүтін сан болуы керек.

sequence-invalid-step = Тізбектің қадамы жарамсыз. { $type } түріндегі тізбек үшін ол сан болуы керек.

sequence-invalid-endpoint-number = Сандық тізбектің «{ $attribute }» мәні жарамсыз. Ол сан болуы керек.

sequence-invalid-endpoint-letters = Әріптік тізбектің «{ $attribute }» мәні жарамсыз. Ол әріптер тіркесі болуы керек.

sequence-invalid-endpoint = Тізбектің «{ $attribute }» мәні жарамсыз.

select-from-sequence-coprime-not-numbers = сандар таңдалмағандықтан coprime еленбейді

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations берілгендіктен coprime еленбейді

## Resolving a `target`

target-not-found = `<{ $source }>` үшін жарамсыз target: нысана табылмады.

target-state-variable-not-found = `<{ $source }>` үшін жарамсыз target: `<{ $component }>` элементінде «{ $property }» атты күй айнымалысы табылмады.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` айнымалылары тәуелсіз айнымалыдан өзгеше болуы керек.

ode-system-duplicate-variable-names = Тәуелді айнымалылардың қайталанатын атауларымен ДТ оң жақ функцияларын анықтау мүмкін емес.

ode-system-rhs-function-error = ДТ оң жақ функциясын анықтау мүмкін емес. mathjs функциясын құру кезінде қате.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } түзудің арасындағы бұрышты анықтау мүмкін емес

angle-invalid-through-point = `<angle>` элементінің through мәнінде жарамсыз нүкте

parabola-vertex-too-many-points = Берілген төбемен 1-ден көп нүкте арқылы өтетін парабола жүзеге асырылмаған.

parabola-too-many-points = 3-тен көп нүкте арқылы өтетін парабола жүзеге асырылмаған.

intersection-too-many-items = Екіден көп нысанның қиылысуы жүзеге асырылмаған

## Other math components

ionic-compound-not-two-ions = Екі ионнан басқа иондық қосылыстар жүзеге асырылмаған.

ionic-compound-needs-cation-and-anion = Иондық қосылыстар тек бір катион мен бір анион үшін жүзеге асырылған.

solve-equations-cannot-evaluate = Теңдеуді шешу мүмкін емес, себебі оны есептеу мүмкін болмады: { $equation }

math-operators-operand-number-required = Математикалық операндты бөліп алу үшін operandNumber берілуі керек.

eigen-decomposition-failed = Матрицаның меншікті мәндерін есептеу мүмкін болмады

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметрі үлгіде кездеспейді, сондықтан ол әрқашан бос мәнге сәйкес келеді.
       *[other] `<matchesPattern>`: { $parameters } параметрлері үлгіде кездеспейді, сондықтан олар әрқашан бос мәнге сәйкес келеді.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" мәнін түсіндіру мүмкін емес. Ол none, medium, dense немесе бос орынмен бөлінген екі оң сан болуы керек, мысалы grid="1 0.5". Тор сызылмайды.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure бейнелеуішінде xLabelPosition="left" қолдау таппайды; оң жақ орналасу әрекеті қолданылады.

prefigure-y-label-position-unsupported = `<graph>`: prefigure бейнелеуішінде yLabelPosition="bottom" қолдау таппайды; жоғарғы орналасу әрекеті қолданылады.

prefigure-invalid-axis-bounds = `<graph>`: prefigure түрлендіруі үшін осьтердің шектері жарамсыз; әдепкі bbox (-10,-10,10,10) қолданылады.

prefigure-invalid-width = `<graph>`: prefigure түрлендіруі үшін ен жарамсыз; диаграмманың әдепкі ені 425 қолданылады.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure түрлендіруі үшін aspectRatio жарамсыз; әдепкі қабырғалар қатынасы 1 қолданылады.

prefigure-grid-spacing-too-fine = `<graph>`: тордың қадамы осьтердің шектері үшін тым ұсақ; prefigure бейнелеуішінде тор түсіріліп қалдырылады.

prefigure-annotations-not-rendered = `<graph>`: PreFigure бейнелеуіші қолданылмағанда аңдатпалар сызылмайды.

multiple-annotations-children = `<graph>` ішінде бірнеше `<annotations>` ұрпағы табылды; соңғысынан басқасының бәрі еленбейді.

## Referring to other components

copy-unrecognized-component-type = Танылмаған құрамдас түрін кеңейту немесе көшіру мүмкін емес: { $type }.

copy-prop-not-found = { $component } түріндегі құрамдаста { $property } қасиеті табылмады

collect-no-source = collect үшін дереккөз табылмады.

collect-invalid-component-type = `<{ $component }>` түріндегі құрамдастарды жинау мүмкін емес, себебі бұл жарамсыз құрамдас түрі.

reference-index-unavailable = `{ $reference }` индексіне сілтеу мүмкін емес

## `<callAction>`

component-action-unavailable = `{ $reference }` құрамдасында { $action } шақыру мүмкін емес

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Деректердің пішіні жарамсыз. Жолдардың ұзындықтары әртүрлі. Табылды componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Деректерде қайталанатын баған атаулары бар. Табылды componentIdx :{ $componentIdx }

data-frame-missing-column-name = Деректерде баған атауы жоқ. Табылды componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Бұл жауаптың award мәні answer тегінің өз жіберілген жауабына негізделген, бұл күтпеген әрекетке әкеледі.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` бар контейнердің ішіндегі `<answer>` элементіне `maxNumAttempts` қою әсер етпейді, себебі әрекеттер санын контейнер анықтайды. `maxNumAttempts` мәнін контейнерге қойыңыз.

nested-section-wide-check-work-max-num-attempts = Басқа `sectionWideCheckWork` контейнерінің ішінде тұрған `sectionWideCheckWork` контейнеріне `maxNumAttempts` қою әсер етпейді, себебі әрекеттер санын сыртқы контейнер анықтайды. `maxNumAttempts` мәнін сыртқы контейнерге қойыңыз.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality қойылмаса, { $attributes } атрибуты әсер етпейді.
       *[other] symbolicEquality қойылмаса, { $attributes } атрибуттары әсер етпейді.
    }

answer-invalid-type = answer үшін жарамсыз түр: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` құрамдасының аты жоқ болғандықтан, оны модуль атрибуты ретінде пайдалану мүмкін емес

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` құрамдасын модуль атрибуты ретінде пайдалану мүмкін емес, себебі `<module>` құрамдас түрінде «{ $name }» атрибуты бұрыннан анықталған.

conditional-content-condition-ignored = case немесе else ұрпақтары бар `<conditionalContent>` құрамдасында `condition` атрибуты еленбейді.

slider-markers-type-mismatch = Маркерлердің түрі жүгірткінің түріне сәйкес келмейді.

pretzel-problem-needs-statement-and-answer = Жарамсыз pretzel: әрбір `<problem>` бір `<statement>` және бір `<answer>` қамтуы керек.

pretzel-circuit-first-problem-distractor = Жарамсыз pretzel: mode="circuit" режимінде бірінші `<problem>` алаңдатқыш бола алмайды.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибуты үшін жарамсыз мән { $values }; еленбейді.
       *[other] `{ $attribute }` атрибуты үшін жарамсыз мәндер { $values }; еленбейді.
    }

attribute-must-be-references = `{ $attribute }` атрибуты үшін жарамсыз мән `{ $value }`. Атрибут `$` таңбасынан басталатын сілтемелерден тұруы керек.

math-input-invalid-function-names = <mathInput>: { $attribute } ішіндегі жарамсыз функция атаулары еленбеді: { $names }. Әр атаудың көрсетілетін бөлігі кемінде 2 таңба болуы керек (әріптер немесе сызықшалар); одан кейін міндетті емес `|<mathspeak баламасы>` жұрнағы келуі мүмкін.

## Building components from the source

component-type-invalid = Жарамсыз құрамдас түрі: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутын қайталауға болмайды.

attribute-invalid-for-component = `<{ $componentType }>` түріндегі құрамдас үшін жарамсыз атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль анықтамасында { $context ->
        [text-on-background] мәтін түсі мен фон түсінің
        [high-contrast] жоғары контрастты түс пен кенептің
        [line] сызық түсі мен кенептің
        [marker] маркер түсі мен кенептің
       *[text-on-canvas] мәтін түсі мен кенептің
    } арасындағы контраст жеткіліксіз{ $mode ->
        [dark] { " (қараңғы режим)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кемінде { $threshold }:1 қажет).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль анықтамасында берілген түстер ашық тақырып үшін жеткілікті контраст берсе де, олардан алынған қараңғы режим түстері мәтін мен фонның арасында жеткіліксіз контраст береді ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кемінде { $threshold }:1 қажет). { $suggestion ->
        [available] Қараңғы тақырыпта жеткілікті контраст үшін не ашық режимдеғы контрастты арттырыңыз (мысалы { $lightAttribute }="{ $lightColor }"), не қараңғы режим түсін ауыстырыңыз (мысалы { $darkAttribute }="{ $darkColor }").
       *[none] Қараңғы тақырыпта жеткілікті контраст үшін ашық режимдеғы контрастты арттырыңыз немесе алынған түстерді textColorDarkMode және/немесе backgroundColorDarkMode арқылы ауыстырыңыз.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль анықтамасында берілген мәтін түсі ашық тақырып үшін жеткілікті контраст берсе де, одан алынған қараңғы режим мәтін түсі кенеппен жеткіліксіз контраст береді ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кемінде { $threshold }:1 қажет). { $suggestion ->
        [available] Қараңғы тақырыпта жеткілікті контраст үшін не ашық режимдеғы контрастты арттырыңыз (мысалы textColor="{ $lightColor }"), не қараңғы режим түсін ауыстырыңыз (мысалы textColorDarkMode="{ $darkColor }").
       *[none] Қараңғы тақырыпта жеткілікті контраст үшін ашық режимдеғы контрастты арттырыңыз немесе алынған түсті textColorDarkMode арқылы ауыстырыңыз.
    }

section-multiple-style-palettes = Бөлім тек бір <stylePalette> таңдай алады; соңғысы қолданылады.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } үшін бірегей нұсқаларды анықтау мүмкін емес, себебі numToSelect теріс емес бүтін сан емес.

variant-num-to-select-not-constant-number = { $component } үшін бірегей нұсқаларды анықтау мүмкін емес, себебі numToSelect тұрақты сан емес.

variant-with-replacement-not-constant-boolean = { $component } үшін бірегей нұсқаларды анықтау мүмкін емес, себебі withReplacement тұрақты логикалық мән емес.

variant-select-weight-disables-unique = қандай да бір нұсқада selectWeight немесе selectForVariants берілсе, select үшін бірегей нұсқалар өшіріледі

variant-coprime-undetermined = { $component } үшін бірегей нұсқаларды анықтау мүмкін емес, себебі coprime әрқашан жалған екенін анықтау мүмкін емес.

variant-attribute-not-constant = { $component } үшін бірегей нұсқаларды анықтау мүмкін емес, себебі { $attribute } тұрақты емес.

variant-attribute-not-number = { $component } үшін бірегей нұсқаларды анықтау мүмкін емес, себебі { $attribute } сан емес.

variant-attribute-wrong-type-for-sequence =
    { $type } түріндегі { $component } үшін бірегей нұсқаларды анықтау мүмкін емес, себебі { $attribute } { $expected ->
        [letters-combination] әріптер тіркесі
        [math-expression] жарамды математикалық өрнек
        [integer] бүтін сан
       *[number] сан
    } емес.

variant-length-not-integer = { $component } үшін бірегей нұсқаларды анықтау мүмкін емес, себебі length бүтін сан емес.

variant-sort-not-implemented = sort бар { $component } үшін бірегей нұсқалар жүзеге асырылмаған

variant-exclude-combinations-not-implemented = excludeCombinations бар { $component } үшін бірегей нұсқалар жүзеге асырылмаған

variant-math-exclude-not-implemented = exclude бар math түріндегі { $component } үшін бірегей нұсқалар жүзеге асырылмаған

variant-non-constant-exclude-not-implemented = тұрақты емес exclude бар { $component } үшін бірегей нұсқалар жүзеге асырылмаған

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графиктің prefigure бейнелеуішінде қолдау таппайды; ұрпақ өткізіп жіберілді.

prefigure-descendant-invalid-geometry = { $subject }: шектеусіз немесе толық емес геометрия; ұрпақ өткізіп жіберілді.

prefigure-curve-label-omitted = { $subject }: түрлендірілген қисық элементтерінде белгілер қолдау таппайды; белгі түсіріліп қалдырылды.

prefigure-curve-unsupported-definition-type = { $subject }: қолдау таппайтын қисық функциясының анықтама түрі «{ $definitionType }»; ұрпақ өткізіп жіберілді.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементіндегі flipFunctions атрибуты қолдау таппайды; ұрпақ өткізіп жіберілді.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves тек формуламен берілген ұрпақ функцияларды қолдайды; ұрпақ өткізіп жіберілді.

prefigure-label-position-unsupported =
    { $subject }: қолдау таппайтын labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] түзулер тобының белгісі үшін
       *[point] нүкте белгісі үшін
    }; PreFigure әдепкі туралауы қолданылады.

prefigure-fill-style-unsupported = { $subject }: толтыру стилі «{ $fillStyle }» PreFigure-де қолдау таппайды; тұтас толтыруға көшіріледі.

prefigure-line-style-unknown = { $subject }: белгісіз сызық стилі «{ $lineStyle }» PreFigure шығысынан алынып тасталды.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер стилі «{ $markerStyle }» PreFigure «diamond» стиліне сәйкестендірілді.

prefigure-marker-style-unsupported = { $subject }: маркер стилі «{ $markerStyle }» PreFigure-де қолдау таппайды; әдепкі стиль қолданылады.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: жарамсыз `ref`; нысананы байланыстыру мүмкін емес. Аңдатпа түсіріліп қалдырылды.

annotation-ref-multiple-targets = `<annotation>`: `ref` бірнеше нысанамен байланысты; біріншісі қолданылады.

annotation-ref-outside-graph = `<annotation>`: жарамсыз `ref`; нысана оны қамтитын графиктен тыс. Аңдатпа түсіріліп қалдырылды.

annotation-ref-unsupported-target = `<annotation>`: жарамсыз `ref`; нысана prefigure түрлендіруінде қолдау табатын графикалық нысан емес. Аңдатпа түсіріліп қалдырылды.

annotation-text-missing = `<annotation>`: `text` жоқ немесе бос; бос мәтін шығарылады.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Циклдік тәуелділік анықталды.
       *[other] `<{ $componentType }>` құрамдасын қамтитын циклдік тәуелділік анықталды.
    }

reference-no-referent = Сілтемеге нысан табылмады: `{ $reference }`

reference-multiple-referents = Сілтемеге бірнеше нысан табылды: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементінің { $attribute } атрибутының пішімі жарамсыз.

children-invalid = `<{ $componentType }>` үшін жарамсыз ұрпақтар: жарамсыз ұрпақтар табылды: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибуты үшін жарамсыз мән `{ $value }`; `{ $default }` мәні қолданылады

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } нұсқасы табылмады.
       *[other] DoenetML { $version } нұсқасы табылмады. { $fallback } нұсқасы қолданылады
    }

## Reading the DoenetML

parse-invalid-doenetml = Жарамсыз DoenetML: { $content }

parse-tag-missing-close-tag = Жарамсыз DoenetML: `{ $tag }` тегінің жабатын тегі жоқ. Өзі жабылатын тег немесе `</{ $tagName }>` тегі күтілді.

parse-tag-error = Жарамсыз DoenetML: `<{ $tagName }>` тегінде қате

parse-attribute-missing-value = Жарамсыз DoenetML: `{ $attribute }` атрибутында мән жоқ сияқты.

parse-attribute-invalid = Жарамсыз DoenetML: жарамсыз атрибут `{ $attribute }`

parse-attribute-value-invalid = Жарамсыз DoenetML: жарамсыз атрибут мәні `{ $value }`

parse-attribute-value-quote-mismatch = Жарамсыз DoenetML: жарамсыз атрибут мәні `{ $value }`. Тырнақшалар сәйкес келмейді. `{ $quote }` жоқ сияқты

parse-open-tag-name-missing = Жарамсыз DoenetML: аты жоқ тег табылды, мысалы `<`

parse-tag-not-closed = Жарамсыз DoenetML: `{ $tag }` тегі жабылмаған (`>` жоқ сияқты).

parse-self-closing-tag-name-missing = Жарамсыз DoenetML: аты жоқ тег табылды `<{ $content }>`

parse-self-closing-tag-not-closed = Жарамсыз DoenetML: `{ $tag }` тегі жабылмаған (`/>` жоқ сияқты).

parse-tag-invalid-attributes = Жарамсыз DoenetML: `{ $tag }` тегі жарамды емес. Оның атрибуттары қате болуы мүмкін.

parse-close-tag-name-missing = Жарамсыз DoenetML: аты жоқ жабатын тег табылды, мысалы `</`

parse-attribute-value-unquoted = Атрибут мәндері тырнақшаға алынуы керек: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Жарамсыз DoenetML: `{ $tag }` жабатын тегі табылды, бірақ оған сәйкес ашатын тег жоқ

parse-close-tag-mismatched = Жарамсыз DoenetML: сәйкес келмейтін жабатын тег. `</{ $expected }>` күтілді. `{ $found }` табылды

parser-node-unconvertible = { $node } түйінін Dast түйініне түрлендіру мүмкін болмады.

## Names

name-attribute-invalid =
    Жарамсыз атрибут name='{ $name }'. { $reason ->
        [characters] Атауларда тек әріптер, сандар, астыңғы сызықтар немесе дефистер болуы мүмкін.
       *[start] Атаулар әріптен басталуы керек.
    }

component-name-invalid-start = Жарамсыз құрамдас аты «{ $name }». Атаулар әріптен басталуы керек.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched түріндегі answer-дің video атрибуты болуы керек

answer-video-watched-video-not-reference = videoWatched түріндегі answer-дің video атрибуты сілтеме болуы керек

answer-name-not-single-text = answer-дің name атрибутында дәл бір мәтіндік ұрпақ болуы керек

## Referencing another document

external-doenetml-recursion-limit = Рекурсия деңгейлері тым көп болғандықтан сыртқы DoenetML алу мүмкін болмады. Циклдік сілтеме жоқ па?

external-doenetml-unavailable = { $attribute }="{ $uri }" мекенжайынан DoenetML алу мүмкін болмады

external-doenetml-type-mismatch = { $attribute }="{ $uri }" мекенжайынан жарамсыз DoenetML алынды: ол «{ $componentType }» құрамдас түріне сәйкес келмеді

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибуты ескірген; оның орнына `{ $to }` қолданыңыз.
       *[other] [deprecation] `<{ $component }>` элементіндегі `{ $from }` атрибуты ескірген; оның орнына `{ $to }` қолданыңыз.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибуты ескірген және еленбейді, себебі `{ $to }` да берілген.
       *[other] [deprecation] `<{ $component }>` элементіндегі `{ $from }` атрибуты ескірген және еленбейді, себебі `{ $to }` да берілген.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементіндегі `{ $attribute }` атрибуты ескірген және еленбейді.


## Language coverage

pluralize-english-only = `<pluralize>` тек ағылшын тілінде көпше түр жасай алады, сондықтан { $locale } тілінде жазылған құжатта оның мәтіні өзгеріссіз қалады. Көпше түрді өзіңіз жазыңыз немесе `pluralForm` атрибутымен беріңіз.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элементі танылатын Doenet элементі емес.

schema-element-not-allowed-at-root = `<{ $tag }>` элементіне құжаттың түбірінде рұқсат етілмейді.

schema-element-not-allowed-inside = `<{ $tag }>` элементіне `<{ $parent }>` ішінде рұқсат етілмейді.

schema-attribute-unrecognized = `<{ $tag }>` элементінде `{ $attribute }` атты атрибут жоқ.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементінің `{ $attribute }` атрибуты әр элементі мыналардың бірі болатын тізім болуы керек: { $allowed }
       *[other] `<{ $tag }>` элементінің `{ $attribute }` атрибуты мыналардың бірі болуы керек: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select үшін жарамсыз нұсқа аты. { $variantName } нұсқа аты { $numOptions } нұсқада кездеседі, ал таңдалатын сан { $numToSelect }.

select-variant-name-without-options = select үшін нұсқалар берілген, бірақ ықтимал нұсқа атына бірде-бір таңдау жоқ: { $variantName }.

select-variant-name-not-possible = select үшін берілген { $variantName } нұсқа аты ықтимал нұсқа аты емес.

select-too-few-options = Небәрі { $numOptions } ішінен { $numToSelect } құрамдасты таңдау мүмкін емес.

select-from-sequence-too-few-values = Ұзындығы { $length } тізбектен { $numToSelect } мән таңдау мүмкін емес.

select-from-sequence-indices-count-mismatch = select үшін берілген индекстер саны таңдалатын санға сәйкес келуі керек

select-from-sequence-indices-not-integers = select үшін берілген барлық индекстер бүтін сан болуы керек

select-from-sequence-index-excluded = selectfromsequence үшін берілген индекс алынып тасталған еді

select-from-sequence-indices-excluded-combination = selectfromsequence үшін берілген индекстер алынып тасталған тіркес еді

select-from-sequence-coprime-not-positive-integers = Оң бүтін сандар таңдалмағандықтан өзара жай тіркестерді таңдау мүмкін емес.

select-from-sequence-coprime-common-factor = Өзара жай сандарды таңдау мүмкін емес. Барлық ықтимал мәндердің ортақ бөлгіші бар. (Берілген "from" немесе "to" мәндері "step" мәнімен өзара жай болуы керек.)

select-from-sequence-coprime-single-number = 1-ден өзге жалғыз саннан өзара жай тіркестерді таңдау мүмкін емес.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ішінде тіркестердің 70%-дан астамы алынып тасталды

select-from-sequence-coprime-none-found = Өзара жай сандарды таңдау мүмкін болмады. Барлық ықтимал мәндердің ортақ бөлгіші бар.

select-from-sequence-too-few-unique-values = Ұзындығы { $numPossibleValues } тізбектен { $numToSelect } түрлі мән таңдау мүмкін емес

select-prime-numbers-too-few-values = Ұзындығы { $numValues } жай сандар тізімінен { $numToSelect } мән таңдау мүмкін емес

select-prime-numbers-values-count-mismatch = select үшін берілген мәндер саны таңдалатын санға сәйкес келуі керек

select-prime-numbers-values-not-prime = select prime number үшін берілген барлық мәндер жай сандар тізімінде болуы керек

select-prime-numbers-values-excluded-combination = selectPrimeNumbers үшін берілген мәндер алынып тасталған тіркес еді

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ішінде тіркестердің 70%-дан астамы алынып тасталды

select-random-combination-fluke = Аса екіталай кездейсоқтық салдарынан кездейсоқ мәндер тіркесін таңдау мүмкін болмады

select-random-value-fluke = Аса екіталай кездейсоқтық салдарынан кездейсоқ мән таңдау мүмкін болмады
