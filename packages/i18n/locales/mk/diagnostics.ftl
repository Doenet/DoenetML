# Macedonian diagnostics. Translated from `locales/en/diagnostics.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
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
# Macedonian counts in two categories, so every selection below keeps both
# branches — but the `one` branch catches 21 and 101 as well as 1, which is why
# the noun beside `{ $inputs }` is singular there rather than plural.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } се игнорира кога се зададени двата краја
       *[other] { $attributes } се игнорираат кога се зададени двата краја
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } се игнорира кога се зададени и крај и средина
       *[other] { $attributes } се игнорираат кога се зададени и крај и средина
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset нема ефект без зададена средина

## `<line>`

line-points-undetermined-dimensions = Права низ точки со неопределена димензија.

line-points-too-few-dimensions = Правата мора да минува низ точки со димензија најмалку две.

line-points-depend-on-variables = Правата минува низ точки што зависат од променливи: { $variables }.

line-equation-invalid-format = Невалиден формат на равенка на права во променливите { $variable1 } и { $variable2 }.

## `<ray>`

ray-overprescribed-through = Полуправата е зададена преку through, endpoint и direction. Зададеното through се игнорира.

ray-dimension-mismatch = Несовпаѓање на numDimensions кај полуправата.

## `<vector>`

vector-overprescribed-head = Векторот е зададен преку head, tail и displacement. Зададеното head се игнорира.

vector-dimension-mismatch = Несовпаѓање на numDimensions кај векторот.

## Attracting and constraining

attract-to-without-nearest-point = Не може да се привлекува кон `<{ $component }>`: нема променлива на состојбата nearestPoint.

constrain-to-without-nearest-point = Не може да се ограничува кон `<{ $component }>`: нема променлива на состојбата nearestPoint.

constrain-to-interior-without-nearest-point = Не може да се ограничува кон внатрешноста на `<{ $component }>`: нема променлива на состојбата nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition се игнорира кај невграден choiceInput

## Ordering children by index

choice-input-indices-count-mismatch = Индексите зададени за choiceInput се игнорираат: бројот не се совпаѓа со бројот на подредени choice.

pretzel-indices-count-mismatch = Индексите зададени за problem се игнорираат: бројот не се совпаѓа со бројот на подредени problem.

shuffle-indices-count-mismatch = Индексите зададени за shuffle се игнорираат: бројот не се совпаѓа со бројот на компоненти.

indices-ignored-out-of-range = Индексите зададени за { $component } се игнорираат: некои се надвор од опсегот.

pretzel-indices-repeated = Индексите зададени за pretzel се игнорираат: некои се повторуваат.

pretzel-circuit-first-index = Индексите зададени за pretzel во режим circuit се игнорираат: првиот индекс мора да биде 1.

## `<shuffle>` and `<sort>`

string-children-need-type = За да работи `<{ $component }>` со текстуални подредени елементи, мора да се зададе атрибутот `type`.

invalid-type-defaulting-to-math = Невалиден тип { $type } за компонентата { $component }. Мора да биде math, text, number или boolean. Се користи math.

string-not-valid-component-to-arrange = Низата „{ $value }“ не е валидна компонента за { $component }. Се игнорира.

## Types and variables

invalid-type-defaulting-to-number = Невалиден тип { $type }; типот се поставува на number.

invalid-variable-value = Невалидна вредност на променлива: `{ $value }`

## Variants

variant-index-must-be-number = Индексот на варијантата { $index } мора да биде број

variant-index-must-be-integer = Индексот на варијантата { $index } мора да биде цел број

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` не е реализиран за апсолутни мерки. Ширините стануваат релативни.

side-by-side-absolute-margins = `<{ $component }>` не е реализиран за апсолутни мерки. Маргините стануваат релативни.

side-by-side-no-block-child = Невалиден `<{ $component }>`: мора да има барем еден блоковски подреден елемент.

## `<label>`

label-for-ignored-on-graphical = Атрибутот `for` кај графички `<label>` се игнорира.

label-for-must-resolve-to-one = Атрибутот `for` кај `<label>` мора да води до точно една компонента.

label-for-unresolved = Атрибутот `for` кај `<label>` не можеше да се разреши до компонента.

label-for-answer-with-authored-inputs = Атрибутот `for` кај `<label>` упатува на `<answer>` со изрично напишани полиња за внес; упатете директно на полето.

label-for-answer-without-input = Атрибутот `for` кај `<label>` упатува на `<answer>` без поле за внес што би се означило.

label-for-must-reference-input-or-answer = Атрибутот `for` кај `<label>` мора да упатува на поле за внес или на одговор.

## Accessibility

accessibility-short-description-or-decorative = Заради пристапност, `<{ $component }>` мора да има краток опис или да биде означен како декоративен.

accessibility-video-short-description = Заради пристапност, `<video>` мора да има краток опис.

accessibility-input-short-description-or-label = Заради пристапност, `<{ $component }>` мора да има краток опис или ознака.

accessibility-answer-input-short-description-or-label = Заради пристапност, `<answer>` што создава поле за внес мора да има краток опис или ознака.

accessibility-short-description-contains-math = Кратките описи не треба да содржат математички компоненти како `<{ $component }>`. Запишете ја математиката со зборови.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } има недоволен контраст за текстот на насловот на одделот (темна тема) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; потребно е барем { $threshold }:1).
       *[other] { $colorName } има недоволен контраст за текстот на насловот на одделот ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; потребно е барем { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` низ { $count } точки не е реализирана кога точките немаат нумерички вредности.

circle-too-many-through-points = Не може да се пресмета кружница низ повеќе од 3 точки.

circle-overprescribed-radius-center-points = Не може да се пресмета кружница со зададени радиус, центар и точки.

circle-center-with-multiple-points = Не може да се пресмета кружница со зададен центар низ повеќе од 1 точка.

circle-radius-too-small = Не може да се пресмета кружница: бидејќи растојанието меѓу двете точки е { $distance }, зададениот радиус { $radius } е премал.

circle-radius-with-many-points = Не може да се конструира кружница низ повеќе од две точки со зададен радиус.

circle-invalid-center-or-through-points = Невалиден центар или точки на кружницата.

circle-radius-center-with-multiple-points = Не може да се пресмета радиус на кружница со зададен центар низ повеќе од 1 точка.

circle-change-radius-non-numerical = Не може да се промени радиусот на кружница со ненумерички точки

circle-radius-with-points-non-numerical = Не може да се конструира кружница низ повеќе од една точка со зададен радиус кога нема нумерички вредности.

circle-change-center-non-numerical = Менувањето на центарот на кружница низ ненумерички точки не е реализирано.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Недоволно димензии за доменот на функцијата. Доменот има { $intervals } интервал, а функцијата има { $inputs ->
            [one] { $inputs } влез
           *[other] { $inputs } влезови
        }.
       *[other] Недоволно димензии за доменот на функцијата. Доменот има { $intervals } интервали, а функцијата има { $inputs ->
            [one] { $inputs } влез
           *[other] { $inputs } влезови
        }.
    }

function-domain-invalid-format = Невалиден формат на доменот на функцијата.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ненумеричкиот максимум на функцијата се игнорира.
        [minimum] Ненумеричкиот минимум на функцијата се игнорира.
        [extremum] Ненумеричкиот екстрем на функцијата се игнорира.
        [point] Ненумеричката точка на функцијата се игнорира.
        [slope] Ненумеричкиот наклон на функцијата се игнорира.
       *[other] Ненумеричкото { $type } на функцијата се игнорира.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Празниот максимум на функцијата се игнорира.
        [minimum] Празниот минимум на функцијата се игнорира.
        [extremum] Празниот екстрем на функцијата се игнорира.
        [point] Празната точка на функцијата се игнорира.
       *[other] Празното { $type } на функцијата се игнорира.
    }

function-points-too-close = Функцијата содржи две точки премногу блиску една до друга. Функцијата не може да се дефинира.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Итерации на функција се можни само ако бројот на влезови е еднаков на бројот на излези. Оваа функција има { $inputs } влез и { $outputs ->
            [one] { $outputs } излез
           *[other] { $outputs } излези
        }.
       *[other] Итерации на функција се можни само ако бројот на влезови е еднаков на бројот на излези. Оваа функција има { $inputs } влезови и { $outputs ->
            [one] { $outputs } излез
           *[other] { $outputs } излези
        }.
    }

## `<sequence>`

sequence-invalid-length = Невалидна должина на низата. Мора да биде ненегативен цел број.

sequence-invalid-step = Невалиден чекор на низата. За низа од тип { $type } мора да биде број.

sequence-invalid-endpoint-number = Невалидно „{ $attribute }“ на бројна низа. Мора да биде број.

sequence-invalid-endpoint-letters = Невалидно „{ $attribute }“ на буквена низа. Мора да биде комбинација од букви.

sequence-invalid-endpoint = Невалидно „{ $attribute }“ на низата.

select-from-sequence-coprime-not-numbers = coprime се игнорира бидејќи не се избираат броеви

select-from-sequence-coprime-with-exclude-combinations = coprime се игнорира бидејќи е зададено excludeCombinations

## Resolving a `target`

target-not-found = Невалиден target за `<{ $source }>`: целта не е пронајдена.

target-state-variable-not-found = Невалиден target за `<{ $source }>`: `<{ $component }>` нема променлива на состојбата со име „{ $property }“.

## `<odeSystem>`

ode-system-variables-match-independent = Променливите на `<odeSystem>` мора да се разликуваат од независната променлива.

ode-system-duplicate-variable-names = Не може да се дефинираат десните страни на ОДЕ со повторени имиња на зависни променливи.

ode-system-rhs-function-error = Не може да се дефинира десната страна на ОДЕ. Грешка при создавање функција на mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Не може да се дефинира агол меѓу { $count } прави

angle-invalid-through-point = Невалидна точка во through кај `<angle>`

parabola-vertex-too-many-points = Парабола со зададено теме низ повеќе од 1 точка не е реализирана.

parabola-too-many-points = Парабола низ повеќе од 3 точки не е реализирана.

intersection-too-many-items = Пресек на повеќе од два објекта не е реализиран

## Other math components

ionic-compound-not-two-ions = Јонски соединенија поинакви од оние со два јона не се реализирани.

ionic-compound-needs-cation-and-anion = Јонските соединенија се реализирани само за еден катјон и еден анјон.

solve-equations-cannot-evaluate = Равенката не може да се реши бидејќи не можеше да се пресмета: { $equation }

math-operators-operand-number-required = За извлекување на математички операнд мора да се зададе operandNumber.

eigen-decomposition-failed = Сопствените вредности на матрицата не можеа да се пресметаат

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: параметарот { $parameters } не се појавува во образецот, па секогаш ќе се совпаѓа со празно место.
       *[other] `<matchesPattern>`: параметрите { $parameters } не се појавуваат во образецот, па секогаш ќе се совпаѓаат со празно место.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" не може да се протолкува. Вредноста мора да биде none, medium, dense или два позитивни броја одделени со празно место, на пример grid="1 0.5". Не се црта мрежа.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" не е поддржано во прикажувачот prefigure; се користи однесувањето за десна положба.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" не е поддржано во прикажувачот prefigure; се користи однесувањето за горна положба.

prefigure-invalid-axis-bounds = `<graph>`: невалидни граници на оските за претворба во prefigure; се користи стандардниот bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: невалидна ширина за претворба во prefigure; се користи стандардната ширина на дијаграмот 425.

prefigure-invalid-aspect-ratio = `<graph>`: невалиден aspectRatio за претворба во prefigure; се користи стандардниот сооднос на страните 1.

prefigure-grid-spacing-too-fine = `<graph>`: чекорот на мрежата е преситен за границите на оските; во прикажувачот prefigure мрежата се изостава.

prefigure-annotations-not-rendered = `<graph>`: надвор од прикажувачот PreFigure анотациите не се прикажуваат.

multiple-annotations-children = Во `<graph>` се пронајдени повеќе подредени `<annotations>`; сите освен последниот се игнорираат.

## Referring to other components

copy-unrecognized-component-type = Не може да се прошири или копира непрепознаен тип компонента: { $type }.

copy-prop-not-found = Својството { $property } не е пронајдено кај компонента од тип { $component }

collect-no-source = За collect не е пронајден извор.

collect-invalid-component-type = Не може да се собираат компоненти од тип `<{ $component }>`: тоа е невалиден тип компонента.

reference-index-unavailable = Не може да се упати на индексот `{ $reference }`

## `<callAction>`

component-action-unavailable = Не може да се повика { $action } кај компонентата `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Податоците имаат невалидна форма. Редовите се со различна должина. Пронајдено во componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Податоците имаат повторени имиња на колони. Пронајдено во componentIdx :{ $componentIdx }

data-frame-missing-column-name = На податоците им недостига име на колона. Пронајдено во componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award на овој одговор се потпира на испратениот одговор на самата ознака answer, што ќе доведе до неочекувано однесување.

answer-max-num-attempts-in-section-wide-check-work = Поставувањето `maxNumAttempts` на `<answer>` во контејнер со `sectionWideCheckWork` нема ефект, бидејќи бројот обиди го определува контејнерот. Поставете `maxNumAttempts` на контејнерот.

nested-section-wide-check-work-max-num-attempts = Поставувањето `maxNumAttempts` на контејнер со `sectionWideCheckWork` што самиот е во друг контејнер со `sectionWideCheckWork` нема ефект, бидејќи бројот обиди го определува надворешниот контејнер. Поставете `maxNumAttempts` на надворешниот контејнер.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Атрибутот { $attributes } нема да има ефект без зададено symbolicEquality.
       *[other] Атрибутите { $attributes } нема да имаат ефект без зададено symbolicEquality.
    }

answer-invalid-type = Невалиден тип за answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Компонентата `<{ $component }>` нема име, па не може да се користи како атрибут на модул

module-attribute-name-already-defined = Компонентата `<{ $component } name="{ $name }">` не може да се користи како атрибут на модул бидејќи типот компонента `<module>` веќе има дефиниран атрибут „{ $name }“.

conditional-content-condition-ignored = Атрибутот `condition` се игнорира кај компонента `<conditionalContent>` со подредени case или else.

slider-markers-type-mismatch = Типот на маркерите не се совпаѓа со типот на лизгачот.

pretzel-problem-needs-statement-and-answer = Невалиден pretzel: секој `<problem>` мора да содржи еден `<statement>` и еден `<answer>`.

pretzel-circuit-first-problem-distractor = Невалиден pretzel: при mode="circuit" првиот `<problem>` не може да биде одвлекувач.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Невалидна вредност { $values } за атрибутот `{ $attribute }`; се игнорира.
       *[other] Невалидни вредности { $values } за атрибутот `{ $attribute }`; се игнорираат.
    }

attribute-must-be-references = Невалидна вредност `{ $value }` за атрибутот `{ $attribute }`. Атрибутот мора да е составен од упатувања што почнуваат со `$`.

math-input-invalid-function-names = <mathInput>: невалидните имиња на функции во { $attribute } беа игнорирани: { $names }. Прикажаниот дел од секое име мора да е барем 2 знака (букви или цртички); по него може да следи необврзен наставок `|<алтернатива за mathspeak>`.

## Building components from the source

component-type-invalid = Невалиден тип компонента: `<{ $componentType }>`

attribute-repeated = Атрибутот { $attribute } не смее да се повторува.

attribute-invalid-for-component = Невалиден атрибут „{ $attribute }“ за компонента од тип `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Дефиницијата на стил { $styleNumber } има недоволен контраст за { $context ->
        [text-on-background] бојата на текстот наспроти бојата на позадината
        [high-contrast] високонтрастната боја наспроти платното
        [line] бојата на линиите наспроти платното
        [marker] бојата на маркерите наспроти платното
       *[text-on-canvas] бојата на текстот наспроти платното
    }{ $mode ->
        [dark] { " (темна тема)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; потребно е барем { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Иако дефиницијата на стил { $styleNumber } задава бои со доволен контраст за светла тема, боите за темна тема изведени од нив даваат недоволен контраст на текстот наспроти позадината ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; потребно е барем { $threshold }:1). { $suggestion ->
        [available] За доволен контраст во темна тема, или зголемете го контрастот во светла тема (на пример { $lightAttribute }="{ $lightColor }"), или заменете ја бојата за темна тема (на пример { $darkAttribute }="{ $darkColor }").
       *[none] За доволен контраст во темна тема, зголемете го контрастот во светла тема или заменете ги изведените бои со textColorDarkMode и/или backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Иако дефиницијата на стил { $styleNumber } задава боја на текстот со доволен контраст за светла тема, бојата на текстот за темна тема изведена од неа дава недоволен контраст наспроти платното ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; потребно е барем { $threshold }:1). { $suggestion ->
        [available] За доволен контраст во темна тема, или зголемете го контрастот во светла тема (на пример textColor="{ $lightColor }"), или заменете ја бојата за темна тема (на пример textColorDarkMode="{ $darkColor }").
       *[none] За доволен контраст во темна тема, зголемете го контрастот во светла тема или заменете ја изведената боја со textColorDarkMode.
    }

section-multiple-style-palettes = Еден оддел може да избере само една <stylePalette>; се користи последната.

## Unique variants

variant-num-to-select-not-non-negative-integer = не можат да се определат единствените варијанти на { $component } бидејќи numToSelect не е ненегативен цел број.

variant-num-to-select-not-constant-number = не можат да се определат единствените варијанти на { $component } бидејќи numToSelect не е постојан број.

variant-with-replacement-not-constant-boolean = не можат да се определат единствените варијанти на { $component } бидејќи withReplacement не е постојана логичка вредност.

variant-select-weight-disables-unique = Единствените варијанти за select се исклучени ако некоја можност има зададено selectWeight или selectForVariants

variant-coprime-undetermined = не можат да се определат единствените варијанти на { $component } бидејќи не може да се утврди дека coprime е секогаш неточно.

variant-attribute-not-constant = не можат да се определат единствените варијанти на { $component } бидејќи { $attribute } не е константа.

variant-attribute-not-number = не можат да се определат единствените варијанти на { $component } бидејќи { $attribute } не е број.

variant-attribute-wrong-type-for-sequence =
    не можат да се определат единствените варијанти на { $component } од тип { $type } бидејќи { $attribute } не е { $expected ->
        [letters-combination] комбинација од букви
        [math-expression] валиден математички израз
        [integer] цел број
       *[number] број
    }.

variant-length-not-integer = не можат да се определат единствените варијанти на { $component } бидејќи length не е цел број.

variant-sort-not-implemented = единствените варијанти на { $component } со sort не се реализирани

variant-exclude-combinations-not-implemented = единствените варијанти на { $component } со excludeCombinations не се реализирани

variant-math-exclude-not-implemented = единствените варијанти на { $component } од тип math со exclude не се реализирани

variant-non-constant-exclude-not-implemented = единствените варијанти на { $component } со непостојано exclude не се реализирани

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: не е поддржано во прикажувачот prefigure за графици; потомокот е прескокнат.

prefigure-descendant-invalid-geometry = { $subject }: бесконечна или нецелосна геометрија; потомокот е прескокнат.

prefigure-curve-label-omitted = { $subject }: ознаки не се поддржани кај претворените елементи на криви; ознаката е изоставена.

prefigure-curve-unsupported-definition-type = { $subject }: неподдржан тип на дефиниција на функција на крива „{ $definitionType }“; потомокот е прескокнат.

prefigure-region-flip-functions-unsupported = { $subject }: атрибутот flipFunctions кај regionBetweenCurves не е поддржан; потомокот е прескокнат.

prefigure-region-non-formula-child = { $subject }: кај regionBetweenCurves се поддржани само подредени функции зададени со формула; потомокот е прескокнат.

prefigure-label-position-unsupported =
    { $subject }: неподдржано labelPosition „{ $labelPosition }“ за { $labelKind ->
        [line-family] ознака од семејството на правите
       *[point] ознака на точка
    }; се користи стандардното порамнување на PreFigure.

prefigure-fill-style-unsupported = { $subject }: стилот на исполнување „{ $fillStyle }“ не е поддржан од PreFigure; се користи полно исполнување.

prefigure-line-style-unknown = { $subject }: непознатиот стил на линија „{ $lineStyle }“ е изоставен од излезот на PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: стилот на маркерот „{ $markerStyle }“ е пресликан во стилот „diamond“ на PreFigure.

prefigure-marker-style-unsupported = { $subject }: стилот на маркерот „{ $markerStyle }“ не е поддржан од PreFigure; се користи стандардниот стил.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: невалиден `ref`; целта не може да се разреши. Анотацијата е изоставена.

annotation-ref-multiple-targets = `<annotation>`: `ref` се разреши во повеќе цели; се користи првата.

annotation-ref-outside-graph = `<annotation>`: невалиден `ref`; целта е надвор од графикот што ја содржи. Анотацијата е изоставена.

annotation-ref-unsupported-target = `<annotation>`: невалиден `ref`; целта не е поддржан графички објект при претворба во prefigure. Анотацијата е изоставена.

annotation-text-missing = `<annotation>`: `text` недостига или е празен; се исфрла празен текст.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Откриена е кружна зависност.
       *[other] Откриена е кружна зависност што вклучува компонента `<{ $componentType }>`.
    }

reference-no-referent = Не е пронајден објект за упатувањето: `{ $reference }`

reference-multiple-referents = Пронајдени се повеќе објекти за упатувањето: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Невалиден формат на атрибутот { $attribute } кај `<{ $componentType }>`.

children-invalid = Невалидни подредени елементи за `<{ $componentType }>`: пронајдени се невалидни подредени елементи: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Невалидна вредност `{ $value }` за атрибутот `{ $attribute }`; се користи вредноста `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Верзијата { $version } на DoenetML не е пронајдена.
       *[other] Верзијата { $version } на DoenetML не е пронајдена. Се користи верзијата { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Невалиден DoenetML: { $content }

parse-tag-missing-close-tag = Невалиден DoenetML: ознаката `{ $tag }` нема завршна ознака. Се очекуваше самозатворачка ознака или ознака `</{ $tagName }>`.

parse-tag-error = Невалиден DoenetML: грешка во ознаката `<{ $tagName }>`

parse-attribute-missing-value = Невалиден DoenetML: на атрибутот `{ $attribute }` изгледа му недостига вредност.

parse-attribute-invalid = Невалиден DoenetML: невалиден атрибут `{ $attribute }`

parse-attribute-value-invalid = Невалиден DoenetML: невалидна вредност на атрибут `{ $value }`

parse-attribute-value-quote-mismatch = Невалиден DoenetML: невалидна вредност на атрибут `{ $value }`. Наводниците не се совпаѓаат. Изгледа недостига `{ $quote }`

parse-open-tag-name-missing = Невалиден DoenetML: пронајдена е ознака без име, на пример `<`

parse-tag-not-closed = Невалиден DoenetML: ознаката `{ $tag }` не е затворена (изгледа недостига `>`).

parse-self-closing-tag-name-missing = Невалиден DoenetML: пронајдена е ознака без име `<{ $content }>`

parse-self-closing-tag-not-closed = Невалиден DoenetML: ознаката `{ $tag }` не е затворена (изгледа недостига `/>`).

parse-tag-invalid-attributes = Невалиден DoenetML: ознаката `{ $tag }` е невалидна. Можно е да има погрешни атрибути.

parse-close-tag-name-missing = Невалиден DoenetML: пронајдена е завршна ознака без име, на пример `</`

parse-attribute-value-unquoted = Вредностите на атрибутите мора да бидат во наводници: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Невалиден DoenetML: пронајдена е завршна ознака `{ $tag }`, но нема соодветна почетна

parse-close-tag-mismatched = Невалиден DoenetML: несоодветна завршна ознака. Се очекуваше `</{ $expected }>`. Пронајдено е `{ $found }`

parser-node-unconvertible = Јазолот { $node } не можеше да се претвори во јазол на Dast.

## Names

name-attribute-invalid =
    Невалиден атрибут name='{ $name }'. { $reason ->
        [characters] Имињата може да содржат само букви, бројки, долни црти и цртички.
       *[start] Имињата мора да почнуваат со буква.
    }

component-name-invalid-start = Невалидно име на компонента „{ $name }“. Имињата мора да почнуваат со буква.

## `<answer>` sugar

answer-video-watched-missing-video = answer од тип videoWatched мора да има атрибут video

answer-video-watched-video-not-reference = Кај answer од тип videoWatched атрибутот video мора да биде упатување

answer-name-not-single-text = Атрибутот name на answer мора да има точно еден текстуален подреден елемент

## Referencing another document

external-doenetml-recursion-limit = Надворешниот DoenetML не можеше да се преземе поради премногу нивоа рекурзија. Дали има кружно упатување?

external-doenetml-unavailable = DoenetML не можеше да се преземе од { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Преземен е невалиден DoenetML од { $attribute }="{ $uri }": не одговара на типот компонента „{ $componentType }“

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Атрибутот `{ $from }` е застарен; користете `{ $to }`.
       *[other] [deprecation] Атрибутот `{ $from }` кај `<{ $component }>` е застарен; користете `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Атрибутот `{ $from }` е застарен и се игнорира бидејќи е зададено и `{ $to }`.
       *[other] [deprecation] Атрибутот `{ $from }` кај `<{ $component }>` е застарен и се игнорира бидејќи е зададено и `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Атрибутот `{ $attribute }` кај `<{ $component }>` е застарен и се игнорира.


## Language coverage

pluralize-english-only = `<pluralize>` може да образува множина само на англиски, па во документ на јазикот { $locale } неговиот текст останува непроменет. Напишете ја формата за множина сами или задајте ја со атрибутот `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Елементот `<{ $tag }>` не е препознаен елемент на Doenet.

schema-element-not-allowed-at-root = Елементот `<{ $tag }>` не е дозволен во коренот на документот.

schema-element-not-allowed-inside = Елементот `<{ $tag }>` не е дозволен внатре во `<{ $parent }>`.

schema-attribute-unrecognized = Елементот `<{ $tag }>` нема атрибут со име `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Атрибутот `{ $attribute }` на елементот `<{ $tag }>` мора да биде список чиј секој член е едно од: { $allowed }
       *[other] Атрибутот `{ $attribute }` на елементот `<{ $tag }>` мора да биде едно од: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Невалидно име на варијанта за select. Името на варијантата { $variantName } се појавува кај { $numOptions } можности, а треба да се изберат { $numToSelect }.

select-variant-name-without-options = За select се зададени варијанти, но не е зададена ниту една можност за можното име на варијанта: { $variantName }.

select-variant-name-not-possible = Името на варијантата { $variantName } зададено за select не е можно име на варијанта.

select-too-few-options = Не може да се изберат { $numToSelect } компоненти од само { $numOptions }.

select-from-sequence-too-few-values = Не може да се изберат { $numToSelect } вредности од низа со должина { $length }.

select-from-sequence-indices-count-mismatch = Бројот на индекси зададени за select мора да се совпаѓа со бројот за избирање

select-from-sequence-indices-not-integers = Сите индекси зададени за select мора да бидат цели броеви

select-from-sequence-index-excluded = Зададениот индекс на selectfromsequence беше исклучен

select-from-sequence-indices-excluded-combination = Зададените индекси на selectfromsequence образуваа исклучена комбинација

select-from-sequence-coprime-not-positive-integers = Не може да се изберат заемно прости комбинации бидејќи не се избираат позитивни цели броеви.

select-from-sequence-coprime-common-factor = Не може да се изберат заемно прости броеви. Сите можни вредности имаат заеднички делител. (Зададените вредности на "from" или "to" мора да се заемно прости со "step".)

select-from-sequence-coprime-single-number = Не може да се изберат заемно прости комбинации од еден број различен од 1.

select-from-sequence-excluded-too-many-combinations = Во selectFromSequence се исклучени над 70 % од комбинациите

select-from-sequence-coprime-none-found = Не можеа да се изберат заемно прости броеви. Сите можни вредности имаат заеднички делител.

select-from-sequence-too-few-unique-values = Не може да се изберат { $numToSelect } различни вредности од низа со должина { $numPossibleValues }

select-prime-numbers-too-few-values = Не може да се изберат { $numToSelect } вредности од список прости броеви со должина { $numValues }

select-prime-numbers-values-count-mismatch = Бројот на вредности зададени за select мора да се совпаѓа со бројот за избирање

select-prime-numbers-values-not-prime = Сите вредности зададени за select prime number мора да бидат во списокот прости броеви

select-prime-numbers-values-excluded-combination = Зададените вредности на selectPrimeNumbers образуваа исклучена комбинација

select-prime-numbers-excluded-too-many-combinations = Во selectPrimeNumbers се исклучени над 70 % од комбинациите

select-random-combination-fluke = По крајно неверојатна случајност не можеше да се избере комбинација од случајни вредности

select-random-value-fluke = По крајно неверојатна случајност не можеше да се избере случајна вредност
