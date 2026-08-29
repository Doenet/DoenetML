# Kumyk diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Kumyk in the Cyrillic orthography of Dagestan's schools and press — the
# script CLDR assumes for a bare `kum`, which maximizes to `kum-Cyrl-RU`.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# The computing and mathematics vocabulary here is mostly Russian, which is
# what written Kumyk itself reaches for: «компонент», «атрибут», «функция»,
# «индекс», «формат», «радиус». What is Kumyk is the grammar around them and
# the everyday words — «табылмады», «гьисапгъа алынмай», «болма герек». Three
# terms are the seed's own derivations rather than attested ones and should be
# checked first: «оьзгерювчю» for *variable*, «тизбе» for *sequence*, and
# «силтев» for *reference*.
#
# Kumyk counts in the same two categories English does, `one` and `other`, so
# every selection below keeps both branches — but a noun after a numeral stays
# singular, so the two usually differ only in the number they print. Nothing
# here agrees with a gender or a noun class; Kumyk has neither.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] эки уч нокъат да гёрсетилгенде { $attributes } гьисапгъа алынмай
       *[other] эки уч нокъат да гёрсетилгенде { $attributes } гьисапгъа алынмай
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] уч нокъат да, орта нокъат да гёрсетилгенде { $attributes } гьисапгъа алынмай
       *[other] уч нокъат да, орта нокъат да гёрсетилгенде { $attributes } гьисапгъа алынмай
    }

line-segment-midpoint-offset-without-midpoint = орта нокъат ёкъ буса midpointOffset бир зат да этмей

## `<line>`

line-points-undetermined-dimensions = Оьлчевю белгисиз нокъатлар аркъылы оьтеген тюз сызыкъ.

line-points-too-few-dimensions = Тюз сызыкъ инг аз эки оьлчевлю нокъатлар аркъылы оьтме герек.

line-points-depend-on-variables = Тюз сызыкъ оьзгерювчюлеге байлавлу нокъатлар аркъылы оьте: { $variables }.

line-equation-invalid-format = { $variable1 } ва { $variable2 } оьзгерювчюлердеги тюз сызыкъны тенглевюню форматы тюз тюгюл.

## `<ray>`

ray-overprescribed-through = Нур through, endpoint ва direction аркъылы белгиленген. Гёрсетилген through гьисапгъа алынмай.

ray-dimension-mismatch = нурда numDimensions къыйышмай.

## `<vector>`

vector-overprescribed-head = Вектор head, tail ва displacement аркъылы белгиленген. Гёрсетилген head гьисапгъа алынмай.

vector-dimension-mismatch = векторда numDimensions къыйышмай.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` компонентде nearestPoint гьал оьзгерювчюсю ёкъ, шону учун огъар тартма болмай.

constrain-to-without-nearest-point = `<{ $component }>` компонентде nearestPoint гьал оьзгерювчюсю ёкъ, шону учун огъар байлама болмай.

constrain-to-interior-without-nearest-point = `<{ $component }>` компонентде nearestPoint гьал оьзгерювчюсю ёкъ, шону учун ону ичине байлама болмай.

## `<choiceInput>`

choice-input-label-position-ignored = inline болмагъан choiceInput учун labelPosition гьисапгъа алынмай

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput учун гёрсетилген индекслер гьисапгъа алынмай: индекслени саны бала танглавланы санына къыйышмай.

pretzel-indices-count-mismatch = масала учун гёрсетилген индекслер гьисапгъа алынмай: индекслени саны бала масалаланы санына къыйышмай.

shuffle-indices-count-mismatch = shuffle учун гёрсетилген индекслер гьисапгъа алынмай: индекслени саны компонентлени санына къыйышмай.

indices-ignored-out-of-range = { $component } учун гёрсетилген индекслер гьисапгъа алынмай: бир нече индекс чекден чыгъа.

pretzel-indices-repeated = pretzel учун гёрсетилген индекслер гьисапгъа алынмай: бир нече индекс такрарлана.

pretzel-circuit-first-index = circuit кюйде pretzel учун гёрсетилген индекслер гьисапгъа алынмай: биринчи индекс 1 болма герек.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` сатыр балалар булан ишлесин учун `type` атрибут гёрсетилме герек.

invalid-type-defaulting-to-math = { $component } компонент учун { $type } тюр тюз тюгюл. Ол math, text, number яда boolean болма герек. math алына.

string-not-valid-component-to-arrange = "{ $value }" деген сатыр { $component } учун ярайгъан компонент тюгюл. Гьисапгъа алынмай.

## Types and variables

invalid-type-defaulting-to-number = { $type } тюр тюз тюгюл, тюр number этилди.

invalid-variable-value = Оьзгерювчюню къыйматы тюз тюгюл: `{ $value }`

## Variants

variant-index-must-be-number = { $index } деген вариант индекс сан болма герек

variant-index-must-be-integer = { $index } деген вариант индекс бютюн сан болма герек

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолют оьлчевлер учун этилмеген. Генгликлер салыштырывлу этиле.

side-by-side-absolute-margins = `<{ $component }>` абсолют оьлчевлер учун этилмеген. Ятлавлар салыштырывлу этиле.

side-by-side-no-block-child = `<{ $component }>` тюз тюгюл: онда инг аз бир блок бала болма герек.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элементде `for` атрибут гьисапгъа алынмай.

label-for-must-resolve-to-one = `<label>` элементни `for` атрибуту тек бир компонентге тюшме герек.

label-for-unresolved = `<label>` элементни `for` атрибутун бир компонентге де байлап болмады.

label-for-answer-with-authored-inputs = `<label>` элементни `for` атрибуту автор оьзю язгъан гиришлери булангъы `<answer>` компонентге силтей; тувра гиришге силтегиз.

label-for-answer-without-input = `<label>` элементни `for` атрибуту белги салма гириши болмагъан `<answer>` компонентге силтей.

label-for-must-reference-input-or-answer = `<label>` элементни `for` атрибуту гиришге яда жавапгъа силтеме герек.

## Accessibility

accessibility-short-description-or-decorative = Онгайлыкъ учун `<{ $component }>` я къысгъа англатыву булан болма герек, я безев гьисапда гёрсетилме герек.

accessibility-video-short-description = Онгайлыкъ учун `<video>` къысгъа англатыву булан болма герек.

accessibility-input-short-description-or-label = Онгайлыкъ учун `<{ $component }>` къысгъа англатыву яда белгиси булан болма герек.

accessibility-answer-input-short-description-or-label = Онгайлыкъ учун гириш яратагъан `<answer>` къысгъа англатыву яда белгиси булан болма герек.

accessibility-short-description-contains-math = Къысгъа англатывларда `<{ $component }>` йимик математика компонентлер болмаса яхшы. Математиканы сёзлер булан языгъыз.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] бёлюкню башлыгъыны тексти учун { $colorName } контрасты етишмей (къарангы кюй) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; инг аз { $threshold }:1 герек).
       *[other] бёлюкню башлыгъыны тексти учун { $colorName } контрасты етишмей ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; инг аз { $threshold }:1 герек).
    }

## `<circle>`

circle-through-points-non-numerical = Нокъатланы сан къыйматлары ёкъ буса, { $count } нокъат аркъылы оьтеген `<circle>` гьали этилмеген.

circle-too-many-through-points = 3 нокъатдан кёп нокъат аркъылы оьтеген тёгеректи гьисаплап болмай.

circle-overprescribed-radius-center-points = Радиусу да, центры да, оьтеген нокъатлары да гёрсетилген тёгеректи гьисаплап болмай.

circle-center-with-multiple-points = Центры гёрсетилген тёгерек 1 нокъатдан кёп нокъат аркъылы оьтме болмай.

circle-radius-too-small = Тёгеректи гьисаплап болмай: эки нокъатны арасы { $distance } буса, гёрсетилген { $radius } радиус бек гиччи.

circle-radius-with-many-points = Радиусу гёрсетилген тёгерек эки нокъатдан кёп нокъат аркъылы оьтме болмай.

circle-invalid-center-or-through-points = Тёгеректи центры яда оьтеген нокъатлары тюз тюгюл.

circle-radius-center-with-multiple-points = Центры гёрсетилген ва 1 нокъатдан кёп нокъат аркъылы оьтеген тёгеректи радиусун гьисаплап болмай.

circle-change-radius-non-numerical = Сан къыйматлары болмагъан нокъатлар аркъылы оьтеген тёгеректи радиусун алышдырып болмай

circle-radius-with-points-non-numerical = Сан къыйматлары ёкъ буса, радиусу гёрсетилген тёгеректи бир нокъатдан кёп нокъат аркъылы оьтгерип болмай.

circle-change-center-non-numerical = Сан къыйматлары болмагъан нокъатлар аркъылы оьтеген тёгеректи центрын алышдырыв гьали этилмеген.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функцияны берилиш майданыны оьлчевлери етишмей. Майданда { $intervals } аралыкъ бар, тек функцияны { $inputs ->
            [one] { $inputs } гириши
           *[other] { $inputs } гириши
        } бар.
       *[other] Функцияны берилиш майданыны оьлчевлери етишмей. Майданда { $intervals } аралыкъ бар, тек функцияны { $inputs ->
            [one] { $inputs } гириши
           *[other] { $inputs } гириши
        } бар.
    }

function-domain-invalid-format = Функцияны берилиш майданыны форматы тюз тюгюл.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функцияны сан болмагъан инг уьст къыйматы гьисапгъа алынмай.
        [minimum] Функцияны сан болмагъан инг тёбен къыйматы гьисапгъа алынмай.
        [extremum] Функцияны сан болмагъан экстремумы гьисапгъа алынмай.
        [point] Функцияны сан болмагъан нокъаты гьисапгъа алынмай.
        [slope] Функцияны сан болмагъан къыялыгъы гьисапгъа алынмай.
       *[other] Функцияны сан болмагъан { $type } деген къыйматы гьисапгъа алынмай.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функцияны бош инг уьст къыйматы гьисапгъа алынмай.
        [minimum] Функцияны бош инг тёбен къыйматы гьисапгъа алынмай.
        [extremum] Функцияны бош экстремумы гьисапгъа алынмай.
        [point] Функцияны бош нокъаты гьисапгъа алынмай.
       *[other] Функцияны бош { $type } деген къыйматы гьисапгъа алынмай.
    }

function-points-too-close = Функцияда ерлери бир-бирине бек ювукъ эки нокъат бар. Функцияны белгилеп болмай.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функцияны итерациялары тек гиришлерини саны чыгъышларыны санына тенг буса болалар. Бу функцияны { $inputs } гириши ва { $outputs ->
            [one] { $outputs } чыгъышы
           *[other] { $outputs } чыгъышы
        } бар.
       *[other] Функцияны итерациялары тек гиришлерини саны чыгъышларыны санына тенг буса болалар. Бу функцияны { $inputs } гириши ва { $outputs ->
            [one] { $outputs } чыгъышы
           *[other] { $outputs } чыгъышы
        } бар.
    }

## `<sequence>`

sequence-invalid-length = Тизбени узунлугъу тюз тюгюл. Ол терс болмагъан бютюн сан болма герек.

sequence-invalid-step = Тизбени абаты тюз тюгюл. { $type } тюрлю тизбе учун ол сан болма герек.

sequence-invalid-endpoint-number = Сан тизбени "{ $attribute }" къыйматы тюз тюгюл. Ол сан болма герек.

sequence-invalid-endpoint-letters = Гьарп тизбени "{ $attribute }" къыйматы тюз тюгюл. Ол гьарплардан къурулма герек.

sequence-invalid-endpoint = Тизбени "{ $attribute }" къыйматы тюз тюгюл.

select-from-sequence-coprime-not-numbers = санлар танглана болмагъан учун coprime гьисапгъа алынмай

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations гёрсетилген учун coprime гьисапгъа алынмай

## Resolving a `target`

target-not-found = `<{ $source }>` учун target тюз тюгюл: мурат табылмады.

target-state-variable-not-found = `<{ $source }>` учун target тюз тюгюл: `<{ $component }>` компонентде "{ $property }" деген гьал оьзгерювчю табылмады.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` компонентни оьзгерювчюлери эркин оьзгерювчюден башгъа болма герек.

ode-system-duplicate-variable-names = Такрарланагъан гьасил оьзгерювчю атлары булан ODE RHS функцияланы белгилеп болмай.

ode-system-rhs-function-error = ODE RHS функцияны белгилеп болмай. mathjs функцияны яратывда янгылыш.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } сызыкъны арасындагъы мююшню белгилеп болмай

angle-invalid-through-point = `<angle>` компонентни through къыйматындагъы нокъат тюз тюгюл

parabola-vertex-too-many-points = Тёбеси гёрсетилген ва 1 нокъатдан кёп нокъат аркъылы оьтеген парабола гьали этилмеген.

parabola-too-many-points = 3 нокъатдан кёп нокъат аркъылы оьтеген парабола гьали этилмеген.

intersection-too-many-items = Экиден кёп затны кесилиш ери гьали этилмеген

## Other math components

ionic-compound-not-two-ions = Эки иондан башгъа зат учун ион къошулув гьали этилмеген.

ionic-compound-needs-cation-and-anion = Ион къошулув тек бир катион ва бир анион учун этилген.

solve-equations-cannot-evaluate = Тенглевню гьисаплап болмагъан учун ону чечип болмай: { $equation }

math-operators-operand-number-required = Математика операндны алгъанда operandNumber гёрсетилме герек.

eigen-decomposition-failed = Матрицаны оьз санларын гьисаплап болмады

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } деген параметр уьлгюде ёкъ, шону учун ол гьар заман бош ерге къыйышажакъ.
       *[other] `<matchesPattern>`: { $parameters } деген параметрлер уьлгюде ёкъ, шону учун олар гьар заман бош ерге къыйышажакъ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" англашылмай. Ол none, medium, dense яда бош ер булан айырылгъан эки оьр сан болма герек, мисал учун grid="1 0.5". Тор сызылмай.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` учун { $expected ->
        [one] бир чыгъышы — гьар нокъатда y' къыялыгъы, мисал учун `y - x`
       *[other] эки чыгъышы — гьар нокъатда вектор, мисал учун `(y, -x)`
    } болагъан функция герек, тек огъар берилген функцияны { $found ->
        [one] { $found } чыгъышы
       *[other] { $found } чыгъышы
    } бар. { $alternative ->
        [none] Бир зат да сызылмай.
       *[other] Шо функция учун компонент — `<{ $alternative }>`. Бир зат да сызылмай.
    }

field-function-attribute-ignored-with-child = Функция компонентни ичинде де берилген учун `function` атрибут гьисапгъа алынмай; ичиндеги алына. Функцияны тек бир кюйде беригиз.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибут компонентни ичинде тувра язылгъан ифаданы оьзгерювчюлерин атай. { $reason ->
        [function-child] Мунда функция `<function>` бала гьисапда берилген, ол оьзюню оьзгерювчюлерин оьзю атай, шону учун `variables` гьисапгъа алынмай.
       *[no-expression] Мунда шолай ифада берилмеген, шону учун `variables` гьисапгъа алынмай.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure суратлавчуда xLabelPosition="left" ишлемей; right кюйде этиле.

prefigure-y-label-position-unsupported = `<graph>`: prefigure суратлавчуда yLabelPosition="bottom" ишлемей; top кюйде этиле.

prefigure-invalid-axis-bounds = `<graph>`: prefigure гёчюрюв учун охланы чеклери тюз тюгюл; келишив бойунча bbox (-10,-10,10,10) алына.

prefigure-invalid-width = `<graph>`: prefigure гёчюрюв учун генглик тюз тюгюл; келишив бойунча 425 генглик алына.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure гёчюрюв учун aspectRatio тюз тюгюл; келишив бойунча 1 къатнав алына.

prefigure-grid-spacing-too-fine = `<graph>`: торну аралыгъы охланы чеклери учун бек гиччи; prefigure суратлавчуда тор сызылмай.

prefigure-annotations-not-rendered = `<graph>`: PreFigure суратлавчу ишлетилмесе, аннотациялар сызылмай.

multiple-annotations-children = `<graph>` ичинде бир нече `<annotations>` бала табылды; ахырынчысындан къайрысы гьисапгъа алынмай.

## Referring to other components

copy-unrecognized-component-type = Танылмагъан компонент тюрню узатып да, гёчюрюп де болмай: { $type }.

copy-prop-not-found = { $component } тюрлю компонентде { $property } деген prop табылмады

collect-no-source = collect учун чашма табылмады.

collect-invalid-component-type = `<{ $component }>` тюр тюз болмагъан учун шолай компонентлени жыйып болмай.

reference-index-unavailable = `{ $reference }` деген индексге силтеп болмай

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентде { $action } чакъырып болмай

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Малуматны кюрчюсю тюз тюгюл. Сатырланы узунлугъу бир болмай. componentIdx :{ $componentIdx } ичинде табылды

data-frame-duplicate-column-names = Малуматда такрарланагъан багъана атлар бар. componentIdx :{ $componentIdx } ичинде табылды

data-frame-missing-column-name = Малуматда бир багъананы аты ёкъ. componentIdx :{ $componentIdx } ичинде табылды

## `<answer>` and scoring

answer-award-depends-on-own-response = Бу жавапны award-ы шо жавапны оьзюню йиберилген жавабына таянып ишлей, бу гёзленмеген натижалагъа гелтирежек.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` булангъы контейнерни ичиндеги `<answer>` компонентде `maxNumAttempts` салыв бир зат да этмей, неге тюгюл сынавланы санын контейнер белгилей. `maxNumAttempts` контейнерде салыгъыз.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` булангъы башгъа контейнерни ичиндеги `sectionWideCheckWork` булангъы контейнерде `maxNumAttempts` салыв бир зат да этмей, неге тюгюл сынавланы санын тышдагъы контейнер белгилей. `maxNumAttempts` тышдагъы контейнерде салыгъыз.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality салынмаса, { $attributes } атрибут бир зат да этмежек.
       *[other] symbolicEquality салынмаса, { $attributes } атрибутлар бир зат да этмежек.
    }

answer-invalid-type = Жавапны тюрю тюз тюгюл: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентни аты болмагъан учун ону модулну атрибуту гьисапда ишлетип болмай

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентни модулну атрибуту гьисапда ишлетип болмай, неге тюгюл `<module>` компонент тюрде "{ $name }" деген атрибут алдын да белгиленген.

conditional-content-condition-ignored = case яда else балалары булангъы `<conditionalContent>` компонентде `condition` атрибут гьисапгъа алынмай.

slider-markers-type-mismatch = Маркерлени тюрю слайдерни тюрюне къыйышмай.

pretzel-problem-needs-statement-and-answer = pretzel тюз тюгюл: гьар `<problem>` бир `<statement>` ва бир `<answer>` булан болма герек.

pretzel-circuit-first-problem-distractor = pretzel тюз тюгюл: mode="circuit" кюйде биринчи `<problem>` distractor болма болмай.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибут учун { $values } къыймат тюз тюгюл; гьисапгъа алынмай.
       *[other] `{ $attribute }` атрибут учун { $values } къыйматлар тюз тюгюл; гьисапгъа алынмай.
    }

attribute-must-be-references = `{ $attribute }` атрибут учун `{ $value }` къыймат тюз тюгюл. Атрибут `$` булан башланагъан силтевлерден къурулма герек.

math-input-invalid-function-names = <mathInput>: { $attribute } ичиндеги тюз болмагъан функция атлар гьисапгъа алынмады: { $names }. Гьар атны гёрюнеген бёлюгю инг аз 2 белгиден (гьарплардан яда дефислерден) къурулма герек; ондан сонг `|<mathspeak alternative>` къошум гелме бола.

## Building components from the source

component-type-invalid = Компонентни тюрю тюз тюгюл: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутну такрарлап болмай.

attribute-invalid-for-component = `<{ $componentType }>` тюрлю компонент учун "{ $attribute }" атрибут тюз тюгюл.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } номерли стиль белгилевде { $context ->
        [text-on-background] текстни тюсюню фонну тюсюне
        [high-contrast] уьст контрастлы тюсню канвасгъа
        [line] сызыкъны тюсюню канвасгъа
        [marker] маркерни тюсюню канвасгъа
       *[text-on-canvas] текстни тюсюню канвасгъа
    } гёре контрасты етишмей{ $mode ->
        [dark] { " (къарангы кюй)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; инг аз { $threshold }:1 герек).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } номерли стиль белгилевде гёрсетилген тюслер ярыкъ кюй учун таман контраст бере буса да, шо къыйматлардан алынагъан къарангы кюйню тюслеринде текстни тюсюню фонну тюсюне гёре контрасты етишмей ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; инг аз { $threshold }:1 герек). { $suggestion ->
        [available] Къарангы кюйде таман контраст болсун учун я ярыкъ кюйню контрастын артдырыгъыз (мисал учун { $lightAttribute }="{ $lightColor }" салыгъыз), я къарангы кюйню тюсюн оьзюгюз белгилегиз (мисал учун { $darkAttribute }="{ $darkColor }" салыгъыз).
       *[none] Къарангы кюйде таман контраст болсун учун ярыкъ кюйню контрастын артдырыгъыз яда алынагъан тюслени textColorDarkMode ва/яда backgroundColorDarkMode булан алышдырыгъыз.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } номерли стиль белгилевде гёрсетилген текстни тюсю ярыкъ кюй учун таман контраст бере буса да, шо къыйматдан алынагъан къарангы кюйдеги текстни тюсюню канвасгъа гёре контрасты етишмей ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; инг аз { $threshold }:1 герек). { $suggestion ->
        [available] Къарангы кюйде таман контраст болсун учун я ярыкъ кюйню контрастын артдырыгъыз (мисал учун textColor="{ $lightColor }" салыгъыз), я къарангы кюйню тюсюн оьзюгюз белгилегиз (мисал учун textColorDarkMode="{ $darkColor }" салыгъыз).
       *[none] Къарангы кюйде таман контраст болсун учун ярыкъ кюйню контрастын артдырыгъыз яда алынагъан тюсню textColorDarkMode булан алышдырыгъыз.
    }

section-multiple-style-palettes = Бир бёлюк тек бир <stylePalette> танглама бола; ахырынчысы алына.

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect терс болмагъан бютюн сан тюгюл, шону учун { $component } компонентни башгъа-башгъа вариантларын белгилеп болмай.

variant-num-to-select-not-constant-number = numToSelect турукълу сан тюгюл, шону учун { $component } компонентни башгъа-башгъа вариантларын белгилеп болмай.

variant-with-replacement-not-constant-boolean = withReplacement турукълу boolean тюгюл, шону учун { $component } компонентни башгъа-башгъа вариантларын белгилеп болмай.

variant-select-weight-disables-unique = selectWeight яда selectForVariants гёрсетилген вариант бар буса, select учун башгъа-башгъа вариантлар ишлемей

variant-coprime-undetermined = coprime гьар заман ялгъан экенни белгилеп болмай, шону учун { $component } компонентни башгъа-башгъа вариантларын белгилеп болмай.

variant-attribute-not-constant = { $attribute } турукълу тюгюл, шону учун { $component } компонентни башгъа-башгъа вариантларын белгилеп болмай.

variant-attribute-not-number = { $attribute } сан тюгюл, шону учун { $component } компонентни башгъа-башгъа вариантларын белгилеп болмай.

variant-attribute-wrong-type-for-sequence =
    { $attribute } { $expected ->
        [letters-combination] гьарплардан къурулгъан къошулув
        [math-expression] тюз математика ифада
        [integer] бютюн сан
       *[number] сан
    } тюгюл, шону учун { $type } тюрлю { $component } компонентни башгъа-башгъа вариантларын белгилеп болмай.

variant-length-not-integer = length бютюн сан тюгюл, шону учун { $component } компонентни башгъа-башгъа вариантларын белгилеп болмай.

variant-sort-not-implemented = sort булангъы { $component } компонентни башгъа-башгъа вариантлары гьали этилмеген

variant-exclude-combinations-not-implemented = excludeCombinations булангъы { $component } компонентни башгъа-башгъа вариантлары гьали этилмеген

variant-math-exclude-not-implemented = exclude булангъы math тюрлю { $component } компонентни башгъа-башгъа вариантлары гьали этилмеген

variant-non-constant-exclude-not-implemented = турукълу болмагъан exclude булангъы { $component } компонентни башгъа-башгъа вариантлары гьали этилмеген

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure суратлавчуда ишлемей; бала гьисапгъа алынмай.

prefigure-descendant-invalid-geometry = { $subject }: геометриясы битмеген яда чексиз; бала гьисапгъа алынмай.

prefigure-curve-label-omitted = { $subject }: гёчюрюлген эгри сызыкъларда белгилер ишлемей; белги гьисапгъа алынмай.

prefigure-curve-unsupported-definition-type = { $subject }: эгри сызыкъны '{ $definitionType }' деген белгилев тюрю ишлемей; бала гьисапгъа алынмай.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves компонентде flipFunctions атрибут ишлемей; бала гьисапгъа алынмай.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves компонентде тек формула тюрлю бала функциялар ишлей; бала гьисапгъа алынмай.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] сызыкъ группаны белгиси
       *[point] нокъатны белгиси
    } учун '{ $labelPosition }' деген labelPosition ишлемей; PreFigure келишив бойунча тизив ишлетиле.

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' деген боявну кюю PreFigure-де ишлемей; толу боявгъа къайтарыла.

prefigure-line-style-unknown = { $subject }: '{ $lineStyle }' деген сызыкъны кюю танылмай, PreFigure чыгъышдан алына.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' деген маркерни кюю PreFigure-ни 'diamond' кююне гёчюрюлген.

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' деген маркерни кюю PreFigure-де ишлемей; келишив бойунча кюй ишлетиле.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` тюз тюгюл; мурат табылмай. Аннотация гьисапгъа алынмай.

annotation-ref-multiple-targets = `<annotation>`: `ref` бир нече муратгъа тюшдю; биринчиси алына.

annotation-ref-outside-graph = `<annotation>`: `ref` тюз тюгюл; мурат оьзюню графигини тышында. Аннотация гьисапгъа алынмай.

annotation-ref-unsupported-target = `<annotation>`: `ref` тюз тюгюл; мурат prefigure гёчюрювде ишлейген график объект тюгюл. Аннотация гьисапгъа алынмай.

annotation-text-missing = `<annotation>`: `text` ёкъ яда бош; бош текст чыгъарыла.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Тёгерек байлавлукъ табылды.
       *[other] `<{ $componentType }>` компонент булангъы тёгерек байлавлукъ табылды.
    }

reference-no-referent = Силтев учун объект табылмады: `{ $reference }`

reference-multiple-referents = Силтев учун бир нече объект табылды: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` компонентни { $attribute } атрибутуну форматы тюз тюгюл.

children-invalid = `<{ $componentType }>` компонент учун балалар тюз тюгюл: тюз болмагъан балалар табылды: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибут учун `{ $value }` къыймат тюз тюгюл, `{ $default }` къыймат ишлетиле

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML-ни { $version } версиясы табылмады.
       *[other] DoenetML-ни { $version } версиясы табылмады. { $fallback } версиясы ишлетиле
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML тюз тюгюл: { $content }

parse-tag-missing-close-tag = DoenetML тюз тюгюл: `{ $tag }` тегни ябагъан теги ёкъ. Оьзю ябылагъан тег яда `</{ $tagName }>` тег герек эди.

parse-tag-error = DoenetML тюз тюгюл: `<{ $tagName }>` тегде янгылыш

parse-attribute-missing-value = DoenetML тюз тюгюл: `{ $attribute }` деген тюз болмагъан атрибутну къыйматы ёкъ гёремен.

parse-attribute-invalid = DoenetML тюз тюгюл: `{ $attribute }` атрибут тюз тюгюл

parse-attribute-value-invalid = DoenetML тюз тюгюл: `{ $value }` деген атрибутну къыйматы тюз тюгюл

parse-attribute-value-quote-mismatch = DoenetML тюз тюгюл: `{ $value }` деген атрибутну къыйматы тюз тюгюл. Тырнакълар къыйышмай. `{ $quote }` етишмей гёремен

parse-open-tag-name-missing = DoenetML тюз тюгюл: аты болмагъан тег табылды, мисал учун `<`

parse-tag-not-closed = DoenetML тюз тюгюл: `{ $tag }` тег ябылмагъан (`>` етишмей гёремен).

parse-self-closing-tag-name-missing = DoenetML тюз тюгюл: аты болмагъан тег табылды `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML тюз тюгюл: `{ $tag }` тег ябылмагъан (`/>` етишмей гёремен).

parse-tag-invalid-attributes = DoenetML тюз тюгюл: `{ $tag }` тег тюз тюгюл. Ону атрибутлары тюз болмаса ярай.

parse-close-tag-name-missing = DoenetML тюз тюгюл: аты болмагъан ябагъан тег табылды, мисал учун `</`

parse-attribute-value-unquoted = Атрибутну къыйматлары тырнакъланы ичинде болма герек: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML тюз тюгюл: `{ $tag }` ябагъан тег табылды, тек огъар къыйышагъан ачагъан тег ёкъ

parse-close-tag-mismatched = DoenetML тюз тюгюл: ябагъан тег къыйышмай. `</{ $expected }>` герек эди. `{ $found }` табылды

parser-node-unconvertible = { $node } деген тюгюмню Dast тюгюмге гёчюрюп болмады.

## Names

name-attribute-invalid =
    name='{ $name }' атрибут тюз тюгюл. { $reason ->
        [characters] Атларда тек гьарплар, санлар, тюп сызыкълар яда дефислер болма бола.
       *[start] Атлар гьарп булан башланма герек.
    }

component-name-invalid-start = "{ $name }" деген компонентни аты тюз тюгюл. Атлар гьарп булан башланма герек.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched тюрлю жавапны video атрибуту болма герек

answer-video-watched-video-not-reference = videoWatched тюрлю жавапны video атрибуту силтев болма герек

answer-name-not-single-text = Жавапны name атрибутуну тек бир текст баласы болма герек

## Referencing another document

external-doenetml-recursion-limit = Рекурсияны даражалары бек кёп болгъан учун тышдагъы DoenetML-ни алып болмай. Тёгерек силтев бармы экен?

external-doenetml-unavailable = { $attribute }="{ $uri }" деген ерден DoenetML алып болмай

external-doenetml-type-mismatch = { $attribute }="{ $uri }" деген ерден алынгъан DoenetML тюз тюгюл: ол "{ $componentType }" компонент тюрге къыйышмады

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут эсгиленген; ону орнунда `{ $to }` ишлетигиз.
       *[other] [deprecation] `<{ $component }>` компонентдеги `{ $from }` атрибут эсгиленген; ону орнунда `{ $to }` ишлетигиз.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут эсгиленген ва `{ $to }` да гёрсетилген учун гьисапгъа алынмай.
       *[other] [deprecation] `<{ $component }>` компонентдеги `{ $from }` атрибут эсгиленген ва `{ $to }` да гёрсетилген учун гьисапгъа алынмай.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` компонентдеги `{ $attribute }` атрибут эсгиленген ва гьисапгъа алынмай.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` компонентдеги `{ $attribute }` атрибут эсгиленген; ону орнунда `<{ $child }>` бала ишлетигиз.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` компонентдеги `{ $attribute }` атрибутну `{ $value }` къыйматы эсгиленген; ону орнунда `{ $to }` ишлетигиз.


## Language coverage

pluralize-english-only = `<pluralize>` тек ингилис сёзлени кёплюк санына салма бола, шону учун { $locale } тилде язылгъан документде ону тексти алышынмай къала. Кёплюк санын оьзюгюз языгъыз яда `pluralForm` атрибут булан гёрсетигиз.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент Doenet-ни танылагъан элементи тюгюл.

schema-element-not-allowed-at-root = `<{ $tag }>` элементге документни тамурунда ихтияр ёкъ.

schema-element-not-allowed-inside = `<{ $tag }>` элементге `<{ $parent }>` ичинде ихтияр ёкъ.

schema-attribute-unrecognized = `<{ $tag }>` элементни `{ $attribute }` деген атрибуту ёкъ.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементни `{ $attribute }` атрибуту сиягь болма герек, ону гьар элементи буланы бириси: { $allowed }
       *[other] `<{ $tag }>` элементни `{ $attribute }` атрибуту буланы бириси болма герек: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select учун вариантны аты тюз тюгюл. { $variantName } деген вариантны аты { $numOptions } танглавда бар, тек танглана турагъан сан { $numToSelect }.

select-variant-name-without-options = select учун бир нече вариант гёрсетилген, тек { $variantName } деген болма болагъан вариантны аты учун бир танглав да гёрсетилмеген.

select-variant-name-not-possible = select учун гёрсетилген { $variantName } деген вариантны аты болма болагъан вариантны аты тюгюл.

select-too-few-options = Тек { $numOptions } компонентден { $numToSelect } компонент танглап болмай.

select-from-sequence-too-few-values = Узунлугъу { $length } тизбеден { $numToSelect } къыймат танглап болмай.

select-from-sequence-indices-count-mismatch = select учун гёрсетилген индекслени саны танглана турагъан сангъа къыйышма герек

select-from-sequence-indices-not-integers = select учун гёрсетилген бары да индекслер бютюн санлар болма герек

select-from-sequence-index-excluded = selectfromsequence учун гёрсетилген индекс чыгъарылгъан эди

select-from-sequence-indices-excluded-combination = selectfromsequence учун гёрсетилген индекслер чыгъарылгъан къошулув эди

select-from-sequence-coprime-not-positive-integers = Оьр бютюн санлар тангланмагъан учун оьз ара ярым санланы къошулувун танглап болмай.

select-from-sequence-coprime-common-factor = Оьз ара ярым санланы танглап болмай. Бары да болма болагъан къыйматланы уртакъ бёлюучюсю бар. (Гёрсетилген "from" яда "to" къыйматлар "step" булан оьз ара ярым болма герек.)

select-from-sequence-coprime-single-number = 1 болмагъан бир санны оьзюнден оьз ара ярым къошулув танглап болмай.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ичинде къошулувланы 70%-ден кёбю чыгъарылгъан

select-from-sequence-coprime-none-found = Оьз ара ярым санланы танглап болмады. Бары да болма болагъан къыйматланы уртакъ бёлюучюсю бар.

select-from-sequence-too-few-unique-values = Узунлугъу { $numPossibleValues } тизбеден { $numToSelect } башгъа-башгъа къыймат танглап болмай

select-prime-numbers-too-few-values = Узунлугъу { $numValues } ярым санланы сиягьындан { $numToSelect } къыймат танглап болмай

select-prime-numbers-values-count-mismatch = select учун гёрсетилген къыйматланы саны танглана турагъан сангъа къыйышма герек

select-prime-numbers-values-not-prime = select prime number учун гёрсетилген бары да къыйматлар ярым санланы сиягьында болма герек

select-prime-numbers-values-excluded-combination = selectPrimeNumbers учун гёрсетилген къыйматлар чыгъарылгъан къошулув эди

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ичинде къошулувланы 70%-ден кёбю чыгъарылгъан

select-random-combination-fluke = Бек болма болмайгъан тюшюм булан тосденгги къыйматланы къошулувун танглап болмады

select-random-value-fluke = Бек болма болмайгъан тюшюм булан тосденгги къыйматны танглап болмады
