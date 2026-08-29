# Nogai diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# own source, and so does the literal `[deprecation]` marker.
#
# Nogai counts in the same two categories English does, `one` and `other`, so
# every selection below keeps both branches — but a noun after a numeral stays
# singular, so the two usually differ only in the number they print. Nothing
# here agrees with a gender or a noun class; Nogai has neither.
#
# The technical vocabulary here is largely Russian, which is what written Nogai
# uses for it: «компонент», «атрибут», «функция», «индекс», «версия»,
# «параметр». What is Nogai is the grammar around them and the everyday words
# — «табылмады», «эсапка алынмайды», «болувы керек», «дурыс тувыл».
#
# The words this file is least sure of are the mathematical and computing terms
# that are *not* Russian loans, because Nogai has published almost nothing in
# which they would appear. «тизбек» for a sequence, «оьз-ара туьп санлар» for
# coprime numbers, «силтеме» for a reference, «нысан» for a target or referent,
# «урпак» for a descendant node and «оьзгеше вариантлар» for unique variants
# are all built on the general Kipchak pattern rather than copied from attested
# Nogai usage. A speaker should read them as proposals.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } эки уш нокта белгиленгенде эсапка алынмайды
       *[other] { $attributes } эки уш нокта белгиленгенде эсапка алынмайды
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } уш нокта эм орта нокта экеви де белгиленгенде эсапка алынмайды
       *[other] { $attributes } уш нокта эм орта нокта экеви де белгиленгенде эсапка алынмайды
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset орта нокта болмаса эсер этпейди

## `<line>`

line-points-undetermined-dimensions = Оьлшемлери белгисиз нокталар аша оьтетаган туьз сызык.

line-points-too-few-dimensions = Туьз сызык эм азы эки оьлшемли нокталар аша оьтуьви керек.

line-points-depend-on-variables = Туьз сызык оьзгеруьвшилерге байланыслы нокталар аша оьтеди: { $variables }.

line-equation-invalid-format = { $variable1 } эм { $variable2 } оьзгеруьвшилериндеги туьз сызык тенълемесининъ форматы дурыс тувыл.

## `<ray>`

ray-overprescribed-through = Нур through, endpoint эм direction мен белгиленген. Белгиленген through эсапка алынмайды.

ray-dimension-mismatch = Нурда numDimensions келиспейди.

## `<vector>`

vector-overprescribed-head = Вектор head, tail эм displacement пен белгиленген. Белгиленген head эсапка алынмайды.

vector-dimension-mismatch = Векторда numDimensions келиспейди.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` уьстине тартылып болмайды, себеби онда nearestPoint хал оьзгеруьвшиси йок.

constrain-to-without-nearest-point = `<{ $component }>` пен шеклендирилип болмайды, себеби онда nearestPoint хал оьзгеруьвшиси йок.

constrain-to-interior-without-nearest-point = `<{ $component }>` ишине шеклендирилип болмайды, себеби онда nearestPoint хал оьзгеруьвшиси йок.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition инлайн болмаган choiceInput уьшин эсапка алынмайды

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput уьшин белгиленген индекслер эсапка алынмайды, себеби индекслер саны choice балаларынынъ санына келиспейди.

pretzel-indices-count-mismatch = problem уьшин белгиленген индекслер эсапка алынмайды, себеби индекслер саны problem балаларынынъ санына келиспейди.

shuffle-indices-count-mismatch = shuffle уьшин белгиленген индекслер эсапка алынмайды, себеби индекслер саны компонентлер санына келиспейди.

indices-ignored-out-of-range = { $component } уьшин белгиленген индекслер эсапка алынмайды, себеби базы индекслер шектен тыс.

pretzel-indices-repeated = pretzel уьшин белгиленген индекслер эсапка алынмайды, себеби базы индекслер кайталанады.

pretzel-circuit-first-index = circuit режиминде pretzel уьшин белгиленген индекслер эсапка алынмайды, себеби биринши индекс 1 болувы керек.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` сатыр балалары мен ислев уьшин `type` атрибуты белгиленуьви керек.

invalid-type-defaulting-to-math = { $component } компоненти уьшин { $type } туьри дурыс тувыл. Ол math, text, number яде boolean болувы керек. math алынады.

string-not-valid-component-to-arrange = «{ $value }» сатыры { $component } уьшин ярайтаган компонент тувыл. Эсапка алынмайды.

## Types and variables

invalid-type-defaulting-to-number = { $type } туьри дурыс тувыл, туьр number этип салынады.

invalid-variable-value = Оьзгеруьвшидинъ маьнеси дурыс тувыл: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариант индекси сан болувы керек

variant-index-must-be-integer = { $index } вариант индекси бутин сан болувы керек

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют оьлшемлер уьшин ясалмаган. Кенъликлер салыстырмалы этип салынады.

side-by-side-absolute-margins = `<{ $component }>` абсолют оьлшемлер уьшин ясалмаган. Шетлер салыстырмалы этип салынады.

side-by-side-no-block-child = `<{ $component }>` дурыс тувыл: онда эм азы бир блок бала болувы керек.

## `<label>`

label-for-ignored-on-graphical = График `<label>` уьстиндеги `for` атрибуты эсапка алынмайды.

label-for-must-resolve-to-one = `<label>` уьстиндеги `for` атрибуты тек бир компонентти коьрсетуьви керек.

label-for-unresolved = `<label>` уьстиндеги `for` атрибуты компонентке келтирилип болмады.

label-for-answer-with-authored-inputs = `<label>` уьстиндеги `for` атрибуты автор язган киргистуьвлери бар `<answer>` уьстине силтейди; киргистуьвдинъ оьзине силтенъиз.

label-for-answer-without-input = `<label>` уьстиндеги `for` атрибуты белгилейтаган киргистуьви йок `<answer>` уьстине силтейди.

label-for-must-reference-input-or-answer = `<label>` уьстиндеги `for` атрибуты киргистуьв яде явап уьстине силтеви керек.

## Accessibility

accessibility-short-description-or-decorative = Колайлык уьшин `<{ $component }>` кыска суьвретлемеси болувы яде безев этип белгиленуьви керек.

accessibility-video-short-description = Колайлык уьшин `<video>` кыска суьвретлемеси болувы керек.

accessibility-input-short-description-or-label = Колайлык уьшин `<{ $component }>` кыска суьвретлемеси яде белгиси болувы керек.

accessibility-answer-input-short-description-or-label = Колайлык уьшин киргистуьв ясайтаган `<answer>` кыска суьвретлемеси яде белгиси болувы керек.

accessibility-short-description-contains-math = Кыска суьвретлемелерде `<{ $component }>` киби математика компонентлери болмавы керек. Математиканы соьз бен язынъыз.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } боьлим баслыгынынъ тексти уьшин етерли контраст бермейди (карангы режим) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эм азы { $threshold }:1 керек).
       *[other] { $colorName } боьлим баслыгынынъ тексти уьшин етерли контраст бермейди ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эм азы { $threshold }:1 керек).
    }

## `<circle>`

circle-through-points-non-numerical = Нокталардынъ сан маьнелери болмаган аьлде { $count } нокта аша оьтетаган `<circle>` ясалмаган.

circle-too-many-through-points = 3 ноктадан коьп нокта аша оьтетаган тоьгеректи есаплап болмайды.

circle-overprescribed-radius-center-points = Белгиленген радиус, орталык эм нокталар мен тоьгеректи есаплап болмайды.

circle-center-with-multiple-points = Белгиленген орталык пан 1 ноктадан коьп нокта аша оьтетаган тоьгеректи есаплап болмайды.

circle-radius-too-small = Тоьгеректи есаплап болмайды: эки нокта арасындагы аралык { $distance } болганда, белгиленген { $radius } радиусы бек кишкей.

circle-radius-with-many-points = Белгиленген радиус пан эки ноктадан коьп нокта аша оьтетаган тоьгерек ясап болмайды.

circle-invalid-center-or-through-points = Тоьгеректинъ орталыгы яде нокталары дурыс тувыл.

circle-radius-center-with-multiple-points = Белгиленген орталык пан 1 ноктадан коьп нокта аша оьтетаган тоьгеректинъ радиусын есаплап болмайды.

circle-change-radius-non-numerical = Сан маьнелери болмаган нокталы тоьгеректинъ радиусын авыстырып болмайды

circle-radius-with-points-non-numerical = Сан маьнелери болмаганда белгиленген радиус пан бир ноктадан коьп нокта аша оьтетаган тоьгерек ясап болмайды.

circle-change-center-non-numerical = Сан маьнелери болмаган нокталар аша оьтетаган тоьгеректинъ орталыгын авыстырув ясалмаган.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функциядынъ анъламлав аймагынынъ оьлшеми етерли тувыл. Аймакта { $intervals } аралык бар, ама функцияда { $inputs ->
            [one] { $inputs } киргистуьв
           *[other] { $inputs } киргистуьв
        } бар.
       *[other] Функциядынъ анъламлав аймагынынъ оьлшеми етерли тувыл. Аймакта { $intervals } аралык бар, ама функцияда { $inputs ->
            [one] { $inputs } киргистуьв
           *[other] { $inputs } киргистуьв
        } бар.
    }

function-domain-invalid-format = Функциядынъ анъламлав аймагынынъ форматы дурыс тувыл.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функциядынъ сан болмаган максимумы эсапка алынмайды.
        [minimum] Функциядынъ сан болмаган минимумы эсапка алынмайды.
        [extremum] Функциядынъ сан болмаган экстремумы эсапка алынмайды.
        [point] Функциядынъ сан болмаган ноктасы эсапка алынмайды.
        [slope] Функциядынъ сан болмаган авышлыгы эсапка алынмайды.
       *[other] Функциядынъ сан болмаган { $type } маьнеси эсапка алынмайды.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функциядынъ бос максимумы эсапка алынмайды.
        [minimum] Функциядынъ бос минимумы эсапка алынмайды.
        [extremum] Функциядынъ бос экстремумы эсапка алынмайды.
        [point] Функциядынъ бос ноктасы эсапка алынмайды.
       *[other] Функциядынъ бос { $type } маьнеси эсапка алынмайды.
    }

function-points-too-close = Функцияда бир-бирине бек ювык эки нокта бар. Функцияны анъламлап болмайды.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функция итерациялары киргистуьвлер саны шыгыслар санына тенъ болганда ганъа мумкин. Бу функцияда { $inputs } киргистуьв эм { $outputs ->
            [one] { $outputs } шыгыс
           *[other] { $outputs } шыгыс
        } бар.
       *[other] Функция итерациялары киргистуьвлер саны шыгыслар санына тенъ болганда ганъа мумкин. Бу функцияда { $inputs } киргистуьв эм { $outputs ->
            [one] { $outputs } шыгыс
           *[other] { $outputs } шыгыс
        } бар.
    }

## `<sequence>`

sequence-invalid-length = Тизбектинъ узынлыгы дурыс тувыл. Ол кери болмаган бутин сан болувы керек.

sequence-invalid-step = Тизбектинъ адымы дурыс тувыл. { $type } туьрли тизбек уьшин ол сан болувы керек.

sequence-invalid-endpoint-number = Сан тизбегининъ «{ $attribute }» маьнеси дурыс тувыл. Ол сан болувы керек.

sequence-invalid-endpoint-letters = Аьриплер тизбегининъ «{ $attribute }» маьнеси дурыс тувыл. Ол аьриплер косылувы болувы керек.

sequence-invalid-endpoint = Тизбектинъ «{ $attribute }» маьнеси дурыс тувыл.

select-from-sequence-coprime-not-numbers = санлар сайланмаганга coprime эсапка алынмайды

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations белгиленгенге coprime эсапка алынмайды

## Resolving a `target`

target-not-found = `<{ $source }>` уьшин target дурыс тувыл: нысан табылмады.

target-state-variable-not-found = `<{ $source }>` уьшин target дурыс тувыл: `<{ $component }>` уьстинде «{ $property }» атлы хал оьзгеруьвшиси табылмады.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` оьзгеруьвшилери гаьрезсиз оьзгеруьвшиден баска болувы керек.

ode-system-duplicate-variable-names = Кайталанатаган гаьрезли оьзгеруьвши атлары мен ODE RHS функцияларын анъламлап болмайды.

ode-system-rhs-function-error = ODE RHS функциясын анъламлап болмайды. mathjs функциясын ясаганда кате шыкты.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } туьз сызык арасындагы муьйишти анъламлап болмайды

angle-invalid-through-point = `<angle>` through ишиндеги нокта дурыс тувыл

parabola-vertex-too-many-points = Тоьбеси белгиленген эм 1 ноктадан коьп нокта аша оьтетаган парабола ясалмаган.

parabola-too-many-points = 3 ноктадан коьп нокта аша оьтетаган парабола ясалмаган.

intersection-too-many-items = Эки затдан коьп зат уьшин кесилуьв ясалмаган

## Other math components

ionic-compound-not-two-ions = Эки ионнан баска зат уьшин ион косылысы ясалмаган.

ionic-compound-needs-cation-and-anion = Ион косылысы тек бир катион эм бир анион уьшин ясалган.

solve-equations-cannot-evaluate = Тенълемени есаплап болмаганга ону шешип болмайды: { $equation }

math-operators-operand-number-required = Математикалык операндты алганда operandNumber белгиленуьви керек.

eigen-decomposition-failed = Матрицадынъ оьз маьнелерин есаплап болмады

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметри уьлгиде йок, сонынъ уьшин ол аьр заман бос маьнеге келиседи.
       *[other] `<matchesPattern>`: { $parameters } параметрлери уьлгиде йок, сонынъ уьшин олар аьр заман бос маьнеге келиседи.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" анъламга алынмайды. Ол none, medium, dense яде бослык пан боьлинген эки он сан болувы керек, мысалы grid="1 0.5". Тор сызылмайды.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` уьшин { $expected ->
        [one] бир шыгысы бар, аьр ноктада y' авышлыгын беретаган функция керек, мысалы `y - x`
       *[other] эки шыгысы бар, аьр ноктада векторды беретаган функция керек, мысалы `(y, -x)`
    }, ама берилген функцияда { $found ->
        [one] { $found } шыгыс
       *[other] { $found } шыгыс
    } бар. { $alternative ->
        [none] Бир зат та сызылмайды.
       *[other] Ол функция уьшин `<{ $alternative }>` компоненти керек. Бир зат та сызылмайды.
    }

field-function-attribute-ignored-with-child = `function` атрибуты эсапка алынмайды, себеби функция компонент ишинде де берилген; ишиндегиси колланылады. Функцияны тек бир йол мен беринъиз.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибуты компонент ишинде тувра язылган аьнълатпадынъ оьзгеруьвшилерин атайды. { $reason ->
        [function-child] Мунда функция `<function>` баласы болып берилген, ол оьз оьзгеруьвшилерин оьзи атайды, сонынъ уьшин `variables` эсапка алынмайды.
       *[no-expression] Мунда сондай аьнълатпа берилмеген, сонынъ уьшин `variables` эсапка алынмайды.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" prefigure коьрсетуьвшисинде колланылмайды; онъ якка салув колланылады.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" prefigure коьрсетуьвшисинде колланылмайды; йогары якка салув колланылады.

prefigure-invalid-axis-bounds = `<graph>`: prefigure авыстырувы уьшин ок шеклери дурыс тувыл; аьдепки bbox (-10,-10,10,10) колланылады.

prefigure-invalid-width = `<graph>`: prefigure авыстырувы уьшин кенълик дурыс тувыл; аьдепки диаграмма кенълиги 425 колланылады.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure авыстырувы уьшин aspectRatio дурыс тувыл; аьдепки катнас 1 колланылады.

prefigure-grid-spacing-too-fine = `<graph>`: ок шеклери уьшин тор аралыгы бек кишкей; prefigure коьрсетуьвшисинде тор сызылмайды.

prefigure-annotations-not-rendered = `<graph>`: PreFigure коьрсетуьвшиси колланылмаганда аннотациялар сызылмайды.

multiple-annotations-children = `<graph>` ишинде бир кесек `<annotations>` баласы табылды; эм сонъгысыннан баскалары эсапка алынмайды.

## Referring to other components

copy-unrecognized-component-type = Танылмаган компонент туьрин кенъейтип яде коьширип болмайды: { $type }.

copy-prop-not-found = { $component } туьриндеги компонентте { $property } проп табылмады

collect-no-source = collect уьшин дерек табылмады.

collect-invalid-component-type = `<{ $component }>` туьриндеги компонентлерди йыйып болмайды, себеби ол дурыс компонент туьри тувыл.

reference-index-unavailable = `{ $reference }` индексине силтеп болмайды

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентинде { $action } шакырып болмайды

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Деректинъ формасы дурыс тувыл. Катарлардынъ узынлыклары бирдей тувыл. Табылган ер: componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Деректе кайталанатаган багана атлары бар. Табылган ер: componentIdx :{ $componentIdx }

data-frame-missing-column-name = Деректинъ багана аты йок. Табылган ер: componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Бу яваптынъ бир баллавы answer тегининъ оьзи йиберген явабына таянады, ол куьтилмеген аьрекетке аькеледи.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` бар контейнер ишиндеги `<answer>` уьстине `maxNumAttempts` салув эсер этпейди, себеби аьрекетлер саны контейнер мен басшыланады. `maxNumAttempts` контейнердинъ оьзине салынъыз.

nested-section-wide-check-work-max-num-attempts = Баска `sectionWideCheckWork` бар контейнер ишиндеги `sectionWideCheckWork` бар контейнерге `maxNumAttempts` салув эсер этпейди, себеби аьрекетлер саны сыртта турган контейнер мен басшыланады. `maxNumAttempts` сыртта турган контейнерге салынъыз.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] { $attributes } атрибуты symbolicEquality салынмаса эсер этпейди.
       *[other] { $attributes } атрибутлары symbolicEquality салынмаса эсер этпейди.
    }

answer-invalid-type = Явап уьшин туьр дурыс тувыл: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентининъ аты болмаганга ол модуль атрибуты уьшин колланылып болмайды

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компоненти модуль атрибуты болып колланылып болмайды, себеби `<module>` компонент туьринде «{ $name }» атлы атрибут алдын анъламланган.

conditional-content-condition-ignored = case яде else балалары бар `<conditionalContent>` компонентинде `condition` атрибуты эсапка алынмайды.

slider-markers-type-mismatch = Маркерлер туьри слайдер туьрине келиспейди.

pretzel-problem-needs-statement-and-answer = pretzel дурыс тувыл: аьр `<problem>` ишинде бир `<statement>` эм бир `<answer>` болувы керек.

pretzel-circuit-first-problem-distractor = pretzel дурыс тувыл: mode="circuit" болганда биринши `<problem>` дистрактор болып болмайды.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибуты уьшин { $values } маьнеси дурыс тувыл; эсапка алынмайды.
       *[other] `{ $attribute }` атрибуты уьшин { $values } маьнелери дурыс тувыл; эсапка алынмайды.
    }

attribute-must-be-references = `{ $attribute }` атрибуты уьшин `{ $value }` маьнеси дурыс тувыл. Атрибут `$` пен басланатаган силтемелерден куралувы керек.

math-input-invalid-function-names = <mathInput>: { $attribute } ишиндеги дурыс тувыл функция атлары эсапка алынмады: { $names }. Аьр аттынъ коьрсетилетаган боьлиги эм азы 2 белгиден (аьрип яде дефис) турувы керек; сонъында `|<mathspeak alternative>` косымшасы болувы мумкин.

## Building components from the source

component-type-invalid = Компонент туьри дурыс тувыл: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутын кайталап болмайды.

attribute-invalid-for-component = `<{ $componentType }>` туьриндеги компонент уьшин «{ $attribute }» атрибуты дурыс тувыл.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стиль анъламламасында { $context ->
        [text-on-background] фон туьси алдында текст туьси
        [high-contrast] полотно алдында оьр контрастлы туьс
        [line] полотно алдында сызык туьси
        [marker] полотно алдында маркер туьси
       *[text-on-canvas] полотно алдында текст туьси
    } уьшин етерли контраст йок{ $mode ->
        [dark] { " (карангы режим)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эм азы { $threshold }:1 керек).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стиль анъламламасында ярык режим уьшин етерли контраст беретаган туьслер белгиленген болса да, бу маьнелерден шыгарылган карангы режим туьслери фон туьси алдында текст туьси уьшин етерли контраст бермейди ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эм азы { $threshold }:1 керек). { $suggestion ->
        [available] Карангы режимде етерли контраст болсын деп, яде ярык режимдеги контрастты арттырынъыз (мысалы, { $lightAttribute }="{ $lightColor }" салынъыз), яде карангы режим туьсин авыстырынъыз (мысалы, { $darkAttribute }="{ $darkColor }" салынъыз).
       *[none] Карангы режимде етерли контраст болсын деп, ярык режимдеги контрастты арттырынъыз яде шыгарылган туьслерди textColorDarkMode эм/яде backgroundColorDarkMode пен авыстырынъыз.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стиль анъламламасында ярык режим уьшин етерли контраст беретаган текст туьси белгиленген болса да, бу маьнеден шыгарылган карангы режим текст туьси полотно алдында етерли контраст бермейди ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; эм азы { $threshold }:1 керек). { $suggestion ->
        [available] Карангы режимде етерли контраст болсын деп, яде ярык режимдеги контрастты арттырынъыз (мысалы, textColor="{ $lightColor }" салынъыз), яде карангы режим туьсин авыстырынъыз (мысалы, textColorDarkMode="{ $darkColor }" салынъыз).
       *[none] Карангы режимде етерли контраст болсын деп, ярык режимдеги контрастты арттырынъыз яде шыгарылган туьсти textColorDarkMode пен авыстырынъыз.
    }

section-multiple-style-palettes = Боьлим тек бир <stylePalette> сайлап болады; эм сонъгысы колланылады.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } компонентининъ оьзгеше вариантларын белгилеп болмайды, себеби numToSelect кери болмаган бутин сан тувыл.

variant-num-to-select-not-constant-number = { $component } компонентининъ оьзгеше вариантларын белгилеп болмайды, себеби numToSelect турувлы сан тувыл.

variant-with-replacement-not-constant-boolean = { $component } компонентининъ оьзгеше вариантларын белгилеп болмайды, себеби withReplacement турувлы boolean тувыл.

variant-select-weight-disables-unique = selectWeight яде selectForVariants белгиленген вариант болса, select уьшин оьзгеше вариантлар оьширилген

variant-coprime-undetermined = { $component } компонентининъ оьзгеше вариантларын белгилеп болмайды, себеби coprime аьр заман ялган болатаганын белгилеп болмайды.

variant-attribute-not-constant = { $component } компонентининъ оьзгеше вариантларын белгилеп болмайды, себеби { $attribute } турувлы тувыл.

variant-attribute-not-number = { $component } компонентининъ оьзгеше вариантларын белгилеп болмайды, себеби { $attribute } сан тувыл.

variant-attribute-wrong-type-for-sequence =
    { $type } туьриндеги { $component } компонентининъ оьзгеше вариантларын белгилеп болмайды, себеби { $attribute } { $expected ->
        [letters-combination] аьриплер косылувы
        [math-expression] ярайтаган математикалык аьнълатпа
        [integer] бутин сан
       *[number] сан
    } тувыл.

variant-length-not-integer = { $component } компонентининъ оьзгеше вариантларын белгилеп болмайды, себеби length бутин сан тувыл.

variant-sort-not-implemented = sort пен { $component } компонентининъ оьзгеше вариантлары ясалмаган

variant-exclude-combinations-not-implemented = excludeCombinations пен { $component } компонентининъ оьзгеше вариантлары ясалмаган

variant-math-exclude-not-implemented = exclude пен math туьриндеги { $component } компонентининъ оьзгеше вариантлары ясалмаган

variant-non-constant-exclude-not-implemented = турувлы тувыл exclude пен { $component } компонентининъ оьзгеше вариантлары ясалмаган

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure коьрсетуьвшисинде колланылмайды; урпак атлап оьтилди.

prefigure-descendant-invalid-geometry = { $subject }: геометриясы шексиз яде толы тувыл; урпак атлап оьтилди.

prefigure-curve-label-omitted = { $subject }: авыстырылган кыйсык элементлеринде белгилер колланылмайды; белги калдырылды.

prefigure-curve-unsupported-definition-type = { $subject }: кыйсык функциясынынъ анъламлав туьри «{ $definitionType }» колланылмайды; урпак атлап оьтилди.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves уьстиндеги flipFunctions атрибуты колланылмайды; урпак атлап оьтилди.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves уьшин тек formula туьриндеги бала функциялар колланылады; урпак атлап оьтилди.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] сызык аьелиндеги белги
       *[point] нокта белгиси
    } уьшин labelPosition «{ $labelPosition }» колланылмайды; аьдепки PreFigure тегислеви колланылады.

prefigure-fill-style-unsupported = { $subject }: толтырув стили «{ $fillStyle }» PreFigure уьшин колланылмайды; тегис толтырув алынады.

prefigure-line-style-unknown = { $subject }: белгисиз сызык стили «{ $lineStyle }» PreFigure шыгысыннан калдырылды.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркер стили «{ $markerStyle }» PreFigure «diamond» стилине келтирилди.

prefigure-marker-style-unsupported = { $subject }: маркер стили «{ $markerStyle }» PreFigure уьшин колланылмайды; аьдепки стиль колланылады.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` дурыс тувыл; нысанды табып болмайды. Аннотация калдырылды.

annotation-ref-multiple-targets = `<annotation>`: `ref` бир кесек нысанды коьрсетти; биринши нысан колланылады.

annotation-ref-outside-graph = `<annotation>`: `ref` дурыс тувыл; нысан оьзи турган графиктинъ сыртында. Аннотация калдырылды.

annotation-ref-unsupported-target = `<annotation>`: `ref` дурыс тувыл; нысан prefigure авыстырувында колланылатаган график объект тувыл. Аннотация калдырылды.

annotation-text-missing = `<annotation>`: `text` йок яде бос; бос текст шыгарылады.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Тоьгерек гаьрезлилик табылды.
       *[other] `<{ $componentType }>` компоненти катнасатаган тоьгерек гаьрезлилик табылды.
    }

reference-no-referent = Силтеме уьшин нысан табылмады: `{ $reference }`

reference-multiple-referents = Силтеме уьшин бир кесек нысан табылды: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` компонентининъ { $attribute } атрибутынынъ форматы дурыс тувыл.

children-invalid = `<{ $componentType }>` уьшин балалар дурыс тувыл: дурыс тувыл балалар табылды: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибуты уьшин `{ $value }` маьнеси дурыс тувыл, `{ $default }` маьнеси колланылады

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версиясы табылмады.
       *[other] DoenetML { $version } версиясы табылмады. { $fallback } версиясы колланылады
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML дурыс тувыл: { $content }

parse-tag-missing-close-tag = DoenetML дурыс тувыл: `{ $tag }` тегининъ ябув теги йок. Оьзи ябылатаган тег яде `</{ $tagName }>` теги керек эди.

parse-tag-error = DoenetML дурыс тувыл: `<{ $tagName }>` тегинде кате

parse-attribute-missing-value = DoenetML дурыс тувыл: `{ $attribute }` атрибутынынъ маьнеси йок болып коьринеди.

parse-attribute-invalid = DoenetML дурыс тувыл: `{ $attribute }` атрибуты дурыс тувыл

parse-attribute-value-invalid = DoenetML дурыс тувыл: `{ $value }` атрибут маьнеси дурыс тувыл

parse-attribute-value-quote-mismatch = DoenetML дурыс тувыл: `{ $value }` атрибут маьнеси дурыс тувыл. Тырнаклар келиспейди. `{ $quote }` йок болып коьринеди

parse-open-tag-name-missing = DoenetML дурыс тувыл: аты йок тег табылды, мысалы `<`

parse-tag-not-closed = DoenetML дурыс тувыл: `{ $tag }` теги ябылмаган (`>` йок болып коьринеди).

parse-self-closing-tag-name-missing = DoenetML дурыс тувыл: аты йок тег табылды `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML дурыс тувыл: `{ $tag }` теги ябылмаган (`/>` йок болып коьринеди).

parse-tag-invalid-attributes = DoenetML дурыс тувыл: `{ $tag }` теги дурыс тувыл. Онынъ атрибутлары дурыс тувыл болувы мумкин.

parse-close-tag-name-missing = DoenetML дурыс тувыл: аты йок ябув теги табылды, мысалы `</`

parse-attribute-value-unquoted = Атрибут маьнелери тырнак ишинде болувы керек: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML дурыс тувыл: `{ $tag }` ябув теги табылды, ама онъа келисетаган ашув теги йок

parse-close-tag-mismatched = DoenetML дурыс тувыл: ябув теги келиспейди. `</{ $expected }>` керек эди. `{ $found }` табылды

parser-node-unconvertible = { $node } туьйинин Dast туьйинине авыстырып болмады.

## Names

name-attribute-invalid =
    name='{ $name }' атрибут аты дурыс тувыл. { $reason ->
        [characters] Атларда тек аьриплер, санлар, астыннан сызыклар яде дефислер болады.
       *[start] Атлар аьрип пен басланувы керек.
    }

component-name-invalid-start = «{ $name }» компонент аты дурыс тувыл. Атлар аьрип пен басланувы керек.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched туьриндеги яваптынъ video атрибуты болувы керек

answer-video-watched-video-not-reference = videoWatched туьриндеги яваптынъ video атрибуты силтеме болувы керек

answer-name-not-single-text = Яваптынъ name атрибутында бир ганъа текст баласы болувы керек

## Referencing another document

external-doenetml-recursion-limit = Рекурсия дережеси бек коьп болганга сырткы DoenetML алынып болмады. Тоьгерек силтеме бар ма экен?

external-doenetml-unavailable = { $attribute }="{ $uri }" ерден DoenetML алынып болмады

external-doenetml-type-mismatch = { $attribute }="{ $uri }" ерден алынган DoenetML дурыс тувыл: ол «{ $componentType }» компонент туьрине келиспеди

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибуты эскирген; онынъ орнына `{ $to }` колланынъыз.
       *[other] [deprecation] `<{ $component }>` уьстиндеги `{ $from }` атрибуты эскирген; онынъ орнына `{ $to }` колланынъыз.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибуты эскирген эм эсапка алынмайды, себеби `{ $to }` да белгиленген.
       *[other] [deprecation] `<{ $component }>` уьстиндеги `{ $from }` атрибуты эскирген эм эсапка алынмайды, себеби `{ $to }` да белгиленген.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` уьстиндеги `{ $attribute }` атрибуты эскирген эм эсапка алынмайды.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` уьстиндеги `{ $attribute }` атрибуты эскирген; онынъ орнына `<{ $child }>` баласын колланынъыз.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` уьстиндеги `{ $attribute }` атрибутынынъ `{ $value }` маьнеси эскирген; онынъ орнына `{ $to }` колланынъыз.

## Language coverage

pluralize-english-only = `<pluralize>` тек инглиз тилинде коьплик сан ясап болады, сонынъ уьшин { $locale } тилинде язылган документте онынъ тексти авыспай калады. Коьплик формасын оьзинъиз язынъыз яде ону `pluralForm` атрибуты мен беринъиз.

## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элементи танылатаган Doenet элементи тувыл.

schema-element-not-allowed-at-root = `<{ $tag }>` элементи документтинъ тамырында турып болмайды.

schema-element-not-allowed-inside = `<{ $tag }>` элементи `<{ $parent }>` ишинде турып болмайды.

schema-attribute-unrecognized = `<{ $tag }>` элементининъ `{ $attribute }` атлы атрибуты йок.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементининъ `{ $attribute }` атрибуты аьр элементи мыналардынъ бирев болатаган тизим болувы керек: { $allowed }
       *[other] `<{ $tag }>` элементининъ `{ $attribute }` атрибуты мыналардынъ бирев болувы керек: { $allowed }
    }

## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select уьшин вариант аты дурыс тувыл. { $variantName } вариант аты { $numOptions } вариантта расады, ама сайланатаган сан { $numToSelect }.

select-variant-name-without-options = select уьшин базы вариантлар белгиленген, ама { $variantName } деген болатаган вариант аты уьшин бир зат та белгиленмеген.

select-variant-name-not-possible = select уьшин белгиленген { $variantName } вариант аты болатаган вариант аты тувыл.

select-too-few-options = { $numOptions } компоненттен { $numToSelect } компонент сайлап болмайды.

select-from-sequence-too-few-values = Узынлыгы { $length } болган тизбектен { $numToSelect } маьне сайлап болмайды.

select-from-sequence-indices-count-mismatch = select уьшин белгиленген индекслер саны сайланатаган санга келисуьви керек

select-from-sequence-indices-not-integers = select уьшин белгиленген барлык индекслер бутин сан болувы керек

select-from-sequence-index-excluded = selectfromsequence уьшин шыгарылып тасланган индекс белгиленген

select-from-sequence-indices-excluded-combination = selectfromsequence уьшин шыгарылып тасланган косылув индекслери белгиленген

select-from-sequence-coprime-not-positive-integers = Он бутин санлар сайланмаганга оьз-ара туьп косылувлар сайлап болмайды.

select-from-sequence-coprime-common-factor = Оьз-ара туьп санлар сайлап болмайды. Барлык болатаган маьнелердинъ ортак боьлуьвшиси бар. («from» яде «to» маьнелери «step» пен оьз-ара туьп болувы керек.)

select-from-sequence-coprime-single-number = 1 болмаган бир саннан оьз-ара туьп косылувлар сайлап болмайды.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ишинде косылувлардынъ 70%-ыннан коьби шыгарылып тасланган

select-from-sequence-coprime-none-found = Оьз-ара туьп санлар сайланып болмады. Барлык болатаган маьнелердинъ ортак боьлуьвшиси бар.

select-from-sequence-too-few-unique-values = Узынлыгы { $numPossibleValues } болган тизбектен { $numToSelect } оьзгеше маьне сайлап болмайды

select-prime-numbers-too-few-values = Узынлыгы { $numValues } болган туьп санлар тизиминнен { $numToSelect } маьне сайлап болмайды

select-prime-numbers-values-count-mismatch = select уьшин белгиленген маьнелер саны сайланатаган санга келисуьви керек

select-prime-numbers-values-not-prime = select prime number уьшин белгиленген барлык маьнелер туьп санлар тизиминде болувы керек

select-prime-numbers-values-excluded-combination = selectPrimeNumbers уьшин белгиленген маьнелер шыгарылып тасланган косылув эди

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ишинде косылувлардынъ 70%-ыннан коьби шыгарылып тасланган

select-random-combination-fluke = Бек сийрек расайтаган аьл себебинен тосын маьнелер косылувы сайланып болмады

select-random-value-fluke = Бек сийрек расайтаган аьл себебинен тосын маьне сайланып болмады
