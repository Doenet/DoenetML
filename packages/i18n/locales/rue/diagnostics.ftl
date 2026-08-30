# Rusyn (русиньскый язык) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Prešov (Pryashiv) codification in Cyrillic, with «ы»,
# «ї», «ё» and the soft sign «ь» as letters of the alphabet; see `chrome.ftl`
# for the full note. This file writes that one codification rather than mixing
# the Slovak, Polish (Lemko) and Transcarpathian norms — the trade `locales/sc`
# and `locales/rm` record, a standard chosen over a spread of varieties.
#
# **Rusyn is a language of its own and must not be edited toward Ukrainian or
# Slovak.** The quickest check is a handful of everyday words: «што» (uk «що»,
# sk «čo»), «лем» 'only' (uk «лише»), «кідь» 'if, when' (uk «якщо»), «вецей»
# 'more' (uk «більше»), «тот/тота/тото» (uk «цей/ця/це»), «жебы» (uk «щоб», sk
# «aby»), «холем» 'at least' (uk «щонайменше»), «айбо» 'but'. The reflexive is
# written apart — «іґнорує ся», «не дало ся» — where Ukrainian writes
# «ігнорується». A sentence here with «що», «якщо» or «більше» in it has
# slipped into Ukrainian.
#
# **Direction.** Left to right; `direction.ts` needs no entry for `rue`.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber`, `maxNumAttempts`, `sectionWideCheckWork`
# — are part of the language, not prose, and stay in English exactly as
# written. So does anything quoted back from the author's own source, and so do
# `WCAG AA`, `DoenetML`, `PreFigure`, `prefigure`, `XML`, `mathjs` and `Dast`,
# which are names.
#
# **Number.** CLDR has no plural rules for `rue`, so no `zero`, `two`, `few` or
# `many` branch appears anywhere. This matters more than it would for a
# Germanic language: Rusyn really does have a `few`/`many` split — «дві точкы»
# against «пять точок» — and nothing in the runtime could select between them,
# so a counted noun is written in the one form that reads acceptably across the
# range. Every **symbolic** selector — `$type`, `$mode`, `$reason`, `$context`,
# `$suggestion`, `$alternative`, `$fallback`, `$expected`, `$labelKind`,
# `$isList`, `$componentType` — is kept byte for byte from English, keys
# included.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } ся іґнорує, кідь суть заданы два кінцї
       *[other] { $attributes } ся іґнорують, кідь суть заданы два кінцї
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ся іґнорує, кідь є заданый і кінець, і середина
       *[other] { $attributes } ся іґнорують, кідь є заданый і кінець, і середина
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset нич не робить без середины

## `<line>`

line-points-undetermined-dimensions = Пряма через точкы з неопредїленов розмірностёв.

line-points-too-few-dimensions = Пряма мусить іти через точкы холем двох розмірів.

line-points-depend-on-variables = Пряма іде через точкы, котры зависять од премінных: { $variables }.

line-equation-invalid-format = Неправилный формат рівнаня прямой в премінных { $variable1 } а { $variable2 }.

## `<ray>`

ray-overprescribed-through = Полпряма є задана через through, endpoint а direction.  Задане through ся іґнорує.

ray-dimension-mismatch = Незгода numDimensions в полпрямій.

## `<vector>`

vector-overprescribed-head = Вектор є заданый через head, tail а displacement.  Задане head ся іґнорує.

vector-dimension-mismatch = Незгода numDimensions в векторї.

## Attracting and constraining

attract-to-without-nearest-point = Не мож притягати ку `<{ $component }>`, бо тот компонент не мать статову премінну nearestPoint.

constrain-to-without-nearest-point = Не мож обмежыти на `<{ $component }>`, бо тот компонент не мать статову премінну nearestPoint.

constrain-to-interior-without-nearest-point = Не мож обмежыти на внуторок `<{ $component }>`, бо тот компонент не мать статову премінну nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ся іґнорує при неінлайновім choiceInput

## Ordering children by index

choice-input-indices-count-mismatch = Заданы про choiceInput індексы ся іґнорують, бо їх чісло ся не згодує з чіслом дїточых choice.

pretzel-indices-count-mismatch = Заданы про problem індексы ся іґнорують, бо їх чісло ся не згодує з чіслом дїточых problem.

shuffle-indices-count-mismatch = Заданы про shuffle індексы ся іґнорують, бо їх чісло ся не згодує з чіслом компонентів.

indices-ignored-out-of-range = Заданы про { $component } індексы ся іґнорують, бо дакотры суть за межами розсягу.

pretzel-indices-repeated = Заданы про pretzel індексы ся іґнорують, бо дакотры ся повторюють.

pretzel-circuit-first-index = Заданы про pretzel в режимі circuit індексы ся іґнорують, бо першый індекс мусить быти 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Жебы `<{ $component }>` робив з текстовыма дїточыма елементами, мусить быти заданый атрібут `type`.

invalid-type-defaulting-to-math = Неправилный тіп { $type } про компонент { $component }. Мусить быти єден з math, text, number або boolean. Хоснує ся math.

string-not-valid-component-to-arrange = Ретязець "{ $value }" не є придатным компонентом про { $component }. Іґнорує ся.

## Types and variables

invalid-type-defaulting-to-number = Неправилный тіп { $type }, тіп ся наставлять на number.

invalid-variable-value = Неправилна годнота премінной: `{ $value }`

## Variants

variant-index-must-be-number = Індекс варіанту { $index } мусить быти чісло

variant-index-must-be-integer = Індекс варіанту { $index } мусить быти цїле чісло

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` не є реалізованый про абсолутны міры. Шырькы ся наставлять на релатівны.

side-by-side-absolute-margins = `<{ $component }>` не є реалізованый про абсолутны міры. Окрайкы ся наставлять на релатівны.

side-by-side-no-block-child = Неправилный `<{ $component }>`: мусить мати холем єден блоковый дїточый елемент.

## `<label>`

label-for-ignored-on-graphical = Атрібут `for` на ґрафічнім `<label>` ся іґнорує.

label-for-must-resolve-to-one = Атрібут `for` на `<label>` мусить указовати рівно на єден компонент.

label-for-unresolved = Атрібут `for` на `<label>` ся не дав приписати ку жадному компоненту.

label-for-answer-with-authored-inputs = Атрібут `for` на `<label>` ся одкликує на `<answer>` з явно записаныма вступами; одкликуйте ся просто на вступ.

label-for-answer-without-input = Атрібут `for` на `<label>` ся одкликує на `<answer>`, котрый не мать вступ на означіня.

label-for-must-reference-input-or-answer = Атрібут `for` на `<label>` ся мусить одкликовати на вступ або на answer.

## Accessibility

accessibility-short-description-or-decorative = Про приступность мусить `<{ $component }>` мати короткый опис або быти означеный як декоратівный.

accessibility-video-short-description = Про приступность мусить `<video>` мати короткый опис.

accessibility-input-short-description-or-label = Про приступность мусить `<{ $component }>` мати короткый опис або означіня.

accessibility-answer-input-short-description-or-label = Про приступность мусить `<answer>`, котрый творить вступ, мати короткый опис або означіня.

accessibility-short-description-contains-math = Короткы описы бы не мали обсяговати математічны компоненты як `<{ $component }>`. Пиште математіку словами.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } мать недостаточный контраст про текст наголовку роздїлу (темна тема) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; треба холем { $threshold }:1).
       *[other] { $colorName } мать недостаточный контраст про текст наголовку роздїлу ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; треба холем { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` через { $count } точок не є реалізованый в припадї, кідь точкы не мають чісельны годноты.

circle-too-many-through-points = Не мож вырахововати круг через веце як 3 точкы.

circle-overprescribed-radius-center-points = Не мож вырахововати круг із заданым радіусом, центром а точками.

circle-center-with-multiple-points = Не мож вырахововати круг із заданым центром через веце як 1 точку.

circle-radius-too-small = Не мож вырахововати круг: при оддалености міджі двома точками { $distance } є заданый радіус { $radius } замалый.

circle-radius-with-many-points = Не мож створити круг через веце як дві точкы із заданым радіусом.

circle-invalid-center-or-through-points = Неправилный центер або точкы круга.

circle-radius-center-with-multiple-points = Не мож вырахововати радіус круга із заданым центром через веце як 1 точку.

circle-change-radius-non-numerical = Не мож змінити радіус круга з нечісельныма точками

circle-radius-with-points-non-numerical = Не мож створити круг через веце як єдну точку із заданым радіусом, кідь не є чісельных годнот.

circle-change-center-non-numerical = Зміна центра круга через точкы з нечісельныма годнотами не є реалізована.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Недостаточна розмірность дефінічной области функції. Область мать { $intervals } інтервал, айбо функція мать { $inputs ->
            [one] { $inputs } вступ
           *[other] { $inputs } вступів
        }.
       *[other] Недостаточна розмірность дефінічной области функції. Область мать { $intervals } інтервалів, айбо функція мать { $inputs ->
            [one] { $inputs } вступ
           *[other] { $inputs } вступів
        }.
    }

function-domain-invalid-format = Неправилный формат дефінічной области функції.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Нечісельне максімум функції ся іґнорує.
        [minimum] Нечісельне мінімум функції ся іґнорує.
        [extremum] Нечісельный екстрем функції ся іґнорує.
        [point] Нечісельна точка функції ся іґнорує.
        [slope] Нечісельный склон функції ся іґнорує.
       *[other] Нечісельне { $type } функції ся іґнорує.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Порожнє максімум функції ся іґнорує.
        [minimum] Порожнє мінімум функції ся іґнорує.
        [extremum] Порожнїй екстрем функції ся іґнорує.
        [point] Порожня точка функції ся іґнорує.
       *[other] Порожнє { $type } функції ся іґнорує.
    }

function-points-too-close = Функція мать дві точкы, котры суть барз близко єдна ку другій. Не мож дефіновати функцію.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Ітерації функції суть можны лем тогды, кідь ся чісло вступів рівнать чіслу выступів. Тота функція мать { $inputs } вступ а { $outputs ->
            [one] { $outputs } выступ
           *[other] { $outputs } выступів
        }.
       *[other] Ітерації функції суть можны лем тогды, кідь ся чісло вступів рівнать чіслу выступів. Тота функція мать { $inputs } вступів а { $outputs ->
            [one] { $outputs } выступ
           *[other] { $outputs } выступів
        }.
    }

## `<sequence>`

sequence-invalid-length = Неправилна довжка поступности.  Мусить быти незаперне цїле чісло.

sequence-invalid-step = Неправилный крок поступности.  Про поступность тіпу { $type } мусить быти чіслом.

sequence-invalid-endpoint-number = Неправилне "{ $attribute }" чісельной поступности.  Мусить быти чіслом.

sequence-invalid-endpoint-letters = Неправилне "{ $attribute }" буквеной поступности.  Мусить быти комбінаціёв буков.

sequence-invalid-endpoint = Неправилне "{ $attribute }" поступности.

select-from-sequence-coprime-not-numbers = coprime ся іґнорує, бо ся не выберають чісла

select-from-sequence-coprime-with-exclude-combinations = coprime ся іґнорує, бо є задане excludeCombinations

## Resolving a `target`

target-not-found = Неправилный target про `<{ $source }>`: цїль ся не найшла.

target-state-variable-not-found = Неправилный target про `<{ $source }>`: не найшла ся статова премінна "{ $property }" на `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Премінны `<odeSystem>` ся мусять одрізняти од незалежной премінной.

ode-system-duplicate-variable-names = Не мож дефіновати правы стороны ОДР з єднакыма назвами залежных премінных.

ode-system-rhs-function-error = Не мож дефіновати праву сторону ОДР.  Хыба при творїню функції mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Не мож дефіновати угол міджі { $count } прямыма

angle-invalid-through-point = Неправилна точка в through у `<angle>`

parabola-vertex-too-many-points = Парабола з верьхолом через веце як 1 точку не є реалізована.

parabola-too-many-points = Парабола через веце як 3 точкы не є реалізована.

intersection-too-many-items = Перетин веце як двох обєктів не є реалізованый

## Other math components

ionic-compound-not-two-ions = Йонова злучіна є реалізована лем про дві йоны.

ionic-compound-needs-cation-and-anion = Йонова злучіна є реалізована лем про єден катіон а єден аніон.

solve-equations-cannot-evaluate = Не мож рїшыти рівнаня, бо ся не дало вырахововати: { $equation }

math-operators-operand-number-required = При выбераню математічного операнда мусить быти заданый operandNumber.

eigen-decomposition-failed = Не дало ся вырахововати властны годноты матріцї

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: параметер { $parameters } ся у взорцї не выскытує, так же все буде одповідати порожнёму місту.
       *[other] `<matchesPattern>`: параметры { $parameters } ся у взорцї не выскытують, так же все будуть одповідати порожнёму місту.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: не мож розуміти grid="{ $grid }". Мусить то быти none, medium, dense або дві позітівны чісла оддїлены медзеров, наприклад grid="1 0.5". Мережа ся не малює.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` потребує функцію з { $expected ->
        [one] єдным выступом, склоном y' в каждій точцї, наприклад `y - x`
       *[other] двома выступами, вектором в каждій точцї, наприклад `(y, -x)`
    }, айбо задана функція мать { $found ->
        [one] { $found } выступ
       *[other] { $found } выступів
    }. { $alternative ->
        [none] Нич ся не малює.
       *[other] `<{ $alternative }>` є компонент про тоту функцію. Нич ся не малює.
    }

field-function-attribute-ignored-with-child = Атрібут `function` ся іґнорує, бо функція є задана і внутрї компонента; хоснує ся тота внутрїшня. Задайте функцію лем єдным з двох способів.

field-variables-ignored =
    `<{ $component }>`: атрібут `variables` менує премінны выразу записаного просто внутрї компонента. { $reason ->
        [function-child] Функція є тут задана як дїточый `<function>`, котрый менує свої властны премінны, так же `variables` ся іґнорує.
       *[no-expression] Такый выраз тут не є заданый, так же `variables` ся іґнорує.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" не є підпорованый в рендерерї prefigure; хоснує ся поведїня про right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" не є підпорованый в рендерерї prefigure; хоснує ся поведїня про top.

prefigure-invalid-axis-bounds = `<graph>`: неправилны межі осей про переклад prefigure; хоснує ся выходный bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: неправилна шырька про переклад prefigure; хоснує ся выходна шырька діаґраму 425.

prefigure-invalid-aspect-ratio = `<graph>`: неправилный aspectRatio про переклад prefigure; хоснує ся выходный помір сторон 1.

prefigure-grid-spacing-too-fine = `<graph>`: розступ мережы є барз дрібный про межі осей; в рендерерї prefigure ся мережа не малює.

prefigure-annotations-not-rendered = `<graph>`: анотації ся не малюють, кідь ся не хоснує рендерер PreFigure.

multiple-annotations-children = В `<graph>` ся нашло веце дїточых `<annotations>`; вшыткы окрем послїднёго ся іґнорують.

## Referring to other components

copy-unrecognized-component-type = Не мож росшырити або копіровати нерозпознаный тіп компонента: { $type }.

copy-prop-not-found = Не найшла ся властность { $property } на компонентї тіпу { $component }

collect-no-source = Про collect ся не найшло жадне жрідло.

collect-invalid-component-type = Не мож зберати компоненты тіпу `<{ $component }>`, бо то не є правилный тіп компонента.

reference-index-unavailable = Не мож ся одкликати на індекс `{ $reference }`

## `<callAction>`

component-action-unavailable = Не мож зволати { $action } на компонентї `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Данны мають неправилный твар.  Рядкы мають розлічну довжку. Найдене в componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Данны мають єднакы назвы стовпців.  Найдене в componentIdx :{ $componentIdx }

data-frame-missing-column-name = Данным хыбить назва стовпця.  Найдене в componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Оцїнїня про тоту одповідь ся опирать о послану одповідь самого таґу answer, што приведе ку нечеканому поведїню.

answer-max-num-attempts-in-section-wide-check-work = Задаваня `maxNumAttempts` на `<answer>` внутрї контейнера з `sectionWideCheckWork` нич не робить, бо чісло проб рядить контейнер. Задайте `maxNumAttempts` на контейнерї.

nested-section-wide-check-work-max-num-attempts = Задаваня `maxNumAttempts` на контейнерї з `sectionWideCheckWork`, котрый є внутрї другого контейнера з `sectionWideCheckWork`, нич не робить, бо чісло проб рядить вонкашнїй контейнер. Задайте `maxNumAttempts` на вонкашнїм контейнерї.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Атрібут { $attributes } нич не буде робити без заданого symbolicEquality.
       *[other] Атрібуты { $attributes } нич не будуть робити без заданого symbolicEquality.
    }

answer-invalid-type = Неправилный тіп про answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Кідь компонент `<{ $component }>` не мать назву, не мож го хосновати як атрібут модулу

module-attribute-name-already-defined = Компонент `<{ $component } name="{ $name }">` не мож хосновати як атрібут модулу, бо тіп компонента `<module>` уж мать атрібут "{ $name }".

conditional-content-condition-ignored = Атрібут `condition` ся іґнорує на компонентї `<conditionalContent>` з дїточыма case або else.

slider-markers-type-mismatch = Тіп маркерів ся не згодує з тіпом слайдера.

pretzel-problem-needs-statement-and-answer = Неправилный pretzel: каждый `<problem>` мусить мати єден `<statement>` а єден `<answer>`.

pretzel-circuit-first-problem-distractor = Неправилный pretzel: при mode="circuit" першый `<problem>` не може быти одволаком.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Неправилна годнота { $values } про атрібут `{ $attribute }`; іґнорує ся.
       *[other] Неправилны годноты { $values } про атрібут `{ $attribute }`; іґнорують ся.
    }

attribute-must-be-references = Неправилна годнота `{ $value }` про атрібут `{ $attribute }`. Атрібут ся мусить складати з одкликів, котры зачінають на `$`.

math-input-invalid-function-names = <mathInput>: в { $attribute } ся зіґноровали неправилны назвы функцій: { $names }. Указована часть каждой назвы мусить мати холем 2 знакы (буквы або дефісы); по нїй може іти неповинный суфікс `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Неправилный тіп компонента: `<{ $componentType }>`

attribute-repeated = Не мож повторёвати атрібут { $attribute }.

attribute-invalid-for-component = Неправилный атрібут "{ $attribute }" про компонент тіпу `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Дефініція штілу { $styleNumber } мать недостаточный контраст { $context ->
        [text-on-background] фарбы тексту проти фарбі тла
        [high-contrast] высококонтрастной фарбы проти платну
        [line] фарбы лінії проти платну
        [marker] фарбы маркера проти платну
       *[text-on-canvas] фарбы тексту проти платну
    }{ $mode ->
        [dark] { " (темна тема)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; треба холем { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Хоць в дефініції штілу { $styleNumber } суть заданы фарбы з достаточным контрастом про світлу тему, фарбы темной темы одведжены з тых годнот мають недостаточный контраст фарбы тексту проти фарбі тла ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; треба холем { $threshold }:1). { $suggestion ->
        [available] Жебы забезпечіти достаточный контраст в темній темі, або звышьте контраст в світлій темі (наприклад, задайте { $lightAttribute }="{ $lightColor }"), або перепиште фарбу темной темы (наприклад, задайте { $darkAttribute }="{ $darkColor }").
       *[none] Жебы забезпечіти достаточный контраст в темній темі, звышьте контраст в світлій темі або перепиште одведжены фарбы через textColorDarkMode а/або backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Хоць в дефініції штілу { $styleNumber } є задана фарба тексту з достаточным контрастом про світлу тему, фарба тексту темной темы одведжена з той годноты мать недостаточный контраст проти платну ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; треба холем { $threshold }:1). { $suggestion ->
        [available] Жебы забезпечіти достаточный контраст в темній темі, або звышьте контраст в світлій темі (наприклад, задайте textColor="{ $lightColor }"), або перепиште фарбу темной темы (наприклад, задайте textColorDarkMode="{ $darkColor }").
       *[none] Жебы забезпечіти достаточный контраст в темній темі, звышьте контраст в світлій темі або перепиште одведжену фарбу через textColorDarkMode.
    }

section-multiple-style-palettes = Роздїл може выбрати лем єдну <stylePalette>; хоснує ся послїдня.

## Unique variants

variant-num-to-select-not-non-negative-integer = не мож опредїлити унікатны варіанты { $component }, бо numToSelect не є незаперне цїле чісло.

variant-num-to-select-not-constant-number = не мож опредїлити унікатны варіанты { $component }, бо numToSelect не є стале чісло.

variant-with-replacement-not-constant-boolean = не мож опредїлити унікатны варіанты { $component }, бо withReplacement не є стала булова годнота.

variant-select-weight-disables-unique = Унікатны варіанты про select суть выпнуты, кідь є опція із заданым selectWeight або selectForVariants

variant-coprime-undetermined = не мож опредїлити унікатны варіанты { $component }, бо ся не дасть опредїлити, же coprime є все неправда.

variant-attribute-not-constant = не мож опредїлити унікатны варіанты { $component }, бо { $attribute } не є сталый.

variant-attribute-not-number = не мож опредїлити унікатны варіанты { $component }, бо { $attribute } не є чісло.

variant-attribute-wrong-type-for-sequence =
    не мож опредїлити унікатны варіанты { $component } тіпу { $type }, бо { $attribute } не є { $expected ->
        [letters-combination] комбінація буков
        [math-expression] правилный математічный выраз
        [integer] цїле чісло
       *[number] чісло
    }.

variant-length-not-integer = не мож опредїлити унікатны варіанты { $component }, бо length не є цїле чісло.

variant-sort-not-implemented = унікатны варіанты { $component } із sort не суть реалізованы

variant-exclude-combinations-not-implemented = унікатны варіанты { $component } із excludeCombinations не суть реалізованы

variant-math-exclude-not-implemented = унікатны варіанты { $component } тіпу math з exclude не суть реалізованы

variant-non-constant-exclude-not-implemented = унікатны варіанты { $component } з несталым exclude не суть реалізованы

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: не є підпорованый в рендерерї graph prefigure; потомок ся выхабив.

prefigure-descendant-invalid-geometry = { $subject }: ґеометрія не є конечна або є неповна; потомок ся выхабив.

prefigure-curve-label-omitted = { $subject }: означіня не суть підпорованы на переложеных елементах кривой; означіня ся выхабило.

prefigure-curve-unsupported-definition-type = { $subject }: непідпорованый тіп дефініції кривой '{ $definitionType }'; потомок ся выхабив.

prefigure-region-flip-functions-unsupported = { $subject }: непідпорованый атрібут flipFunctions на regionBetweenCurves; потомок ся выхабив.

prefigure-region-non-formula-child = { $subject }: на regionBetweenCurves суть підпорованы лем дїточы функції заданы формулов; потомок ся выхабив.

prefigure-label-position-unsupported =
    { $subject }: непідпорованый labelPosition '{ $labelPosition }' про { $labelKind ->
        [line-family] означіня обєкту родины прямых
       *[point] означіня точкы
    }; хоснує ся выходне вырівнаня PreFigure.

prefigure-fill-style-unsupported = { $subject }: штіл выповнїня '{ $fillStyle }' не є підпорованый в PreFigure; хоснує ся повне выповнїня.

prefigure-line-style-unknown = { $subject }: незнамый штіл лінії '{ $lineStyle }' ся выхабив з выступу PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: штіл маркера '{ $markerStyle }' ся приписав ку штілу PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: штіл маркера '{ $markerStyle }' не є підпорованый в PreFigure; хоснує ся выходный штіл.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: неправилный `ref`; не мож найти цїль. Анотація ся выхабила.

annotation-ref-multiple-targets = `<annotation>`: `ref` указує на веце цїлїв; хоснує ся перша.

annotation-ref-outside-graph = `<annotation>`: неправилный `ref`; цїль є за межами ґрафу, котрый ю обсягує. Анотація ся выхабила.

annotation-ref-unsupported-target = `<annotation>`: неправилный `ref`; цїль не є підпорованый ґрафічный обєкт при переложіню prefigure. Анотація ся выхабила.

annotation-text-missing = `<annotation>`: хыбить `text` або є порожнїй; выводить ся порожнїй текст.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Найдена циклічна залежность.
       *[other] Найдена циклічна залежность за участёв компонента `<{ $componentType }>`.
    }

reference-no-referent = Про одклик ся не найшов жаден референт: `{ $reference }`

reference-multiple-referents = Про одклик ся найшло веце референтів: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Неправилный формат атрібуту { $attribute } у `<{ $componentType }>`.

children-invalid = Неправилны дїточы елементы про `<{ $componentType }>`: найшли ся неправилны дїточы елементы: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Неправилна годнота `{ $value }` про атрібут `{ $attribute }`, хоснує ся годнота `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Верзія DoenetML { $version } ся не найшла.
       *[other] Верзія DoenetML { $version } ся не найшла. Хоснує ся верзія { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Неправилный DoenetML: { $content }

parse-tag-missing-close-tag = Неправилный DoenetML: таґ `{ $tag }` не мать заперающій таґ. Чекать ся самозаперающій таґ або таґ `</{ $tagName }>`.

parse-tag-error = Неправилный DoenetML: хыба в таґу `<{ $tagName }>`

parse-attribute-missing-value = Неправилный DoenetML: неправилному атрібуту `{ $attribute }`, здає ся, хыбить годнота.

parse-attribute-invalid = Неправилный DoenetML: неправилный атрібут `{ $attribute }`

parse-attribute-value-invalid = Неправилный DoenetML: неправилна годнота атрібуту `{ $value }`

parse-attribute-value-quote-mismatch = Неправилный DoenetML: неправилна годнота атрібуту `{ $value }`. Уводзовкы ся не згодують. Здає ся, же хыбить `{ $quote }`

parse-open-tag-name-missing = Неправилный DoenetML: найденый таґ без назвы, наприклад `<`

parse-tag-not-closed = Неправилный DoenetML: таґ `{ $tag }` не быв запертый (здає ся, же хыбить `>`).

parse-self-closing-tag-name-missing = Неправилный DoenetML: найденый таґ без назвы `<{ $content }>`

parse-self-closing-tag-not-closed = Неправилный DoenetML: таґ `{ $tag }` не быв запертый (здає ся, же хыбить `/>`).

parse-tag-invalid-attributes = Неправилный DoenetML: таґ `{ $tag }` не є правилный. Може мать хыбны атрібуты.

parse-close-tag-name-missing = Неправилный DoenetML: найденый заперающій таґ без назвы, наприклад `</`

parse-attribute-value-unquoted = Годноты атрібутів мусять быти в уводзовках: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Неправилный DoenetML: найденый заперающій таґ `{ $tag }`, айбо не є одповідный отваряючій

parse-close-tag-mismatched = Неправилный DoenetML: незгодный заперающій таґ. Чекав ся `</{ $expected }>`. Найденый `{ $found }`

parser-node-unconvertible = Не дало ся переложыти узол { $node } на узол Dast.

## Names

name-attribute-invalid =
    Неправилный атрібут name='{ $name }'. { $reason ->
        [characters] Назвы можуть обсяговати лем буквы, чісла, підчаркы або дефісы.
       *[start] Назвы мусять зачінати буквов.
    }

component-name-invalid-start = Неправилна назва компонента "{ $name }". Назвы мусять зачінати буквов.

## `<answer>` sugar

answer-video-watched-missing-video = answer з type videoWatched мусить мати атрібут video

answer-video-watched-video-not-reference = answer з type videoWatched мусить мати атрібут video, котрый є одклик

answer-name-not-single-text = Атрібут name у answer мусить мати єден дїточый текстовый елемент

## Referencing another document

external-doenetml-recursion-limit = Не дало ся здобыти вонкашнїй DoenetML про барз много уровнїв рекурзії. Не є там циклічный одклик?

external-doenetml-unavailable = Не дало ся здобыти DoenetML з { $attribute }="{ $uri }"

external-doenetml-type-mismatch = З { $attribute }="{ $uri }" ся здобыв неправилный DoenetML: не одповідать тіпу компонента "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Атрібут `{ $from }` є застаралый; хоснуйте намісто нёго `{ $to }`.
       *[other] [deprecation] Атрібут `{ $from }` на `<{ $component }>` є застаралый; хоснуйте намісто нёго `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Атрібут `{ $from }` є застаралый а іґнорує ся, бо є заданый і `{ $to }`.
       *[other] [deprecation] Атрібут `{ $from }` на `<{ $component }>` є застаралый а іґнорує ся, бо є заданый і `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Атрібут `{ $attribute }` на `<{ $component }>` є застаралый а іґнорує ся.

deprecated-attribute-to-child = [deprecation] Атрібут `{ $attribute }` на `<{ $component }>` є застаралый; хоснуйте намісто нёго дїточый `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Годнота `{ $value }` атрібуту `{ $attribute }` на `<{ $component }>` є застарала; хоснуйте намісто нёй `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` знать творити множину лем по анґліцькы, так же в документї написанім языком { $locale } зістане його текст незміненый. Напиште форму множины просто, або ю задайте атрібутом `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Елемент `<{ $tag }>` не є розпознаный елемент Doenet.

schema-element-not-allowed-at-root = Елемент `<{ $tag }>` не є дозволеный в кореню документу.

schema-element-not-allowed-inside = Елемент `<{ $tag }>` не є дозволеный внутрї `<{ $parent }>`.

schema-attribute-unrecognized = Елемент `<{ $tag }>` не мать атрібут з назвов `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Атрібут `{ $attribute }` елементу `<{ $tag }>` мусить быти список, котрого каждый член є єден з: { $allowed }
       *[other] Атрібут `{ $attribute }` елементу `<{ $tag }>` мусить быти єден з: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Неправилна назва варіанту про select.  Назва варіанту { $variantName } ся выскытує в { $numOptions } опціях, айбо выбрати треба { $numToSelect }.

select-variant-name-without-options = Про select суть заданы варіанты, айбо не суть заданы опції про можну назву варіанту: { $variantName }.

select-variant-name-not-possible = Назва варіанту { $variantName } задана про select не є можна назва варіанту.

select-too-few-options = Не мож выбрати { $numToSelect } компонентів лем з { $numOptions }.

select-from-sequence-too-few-values = Не мож выбрати { $numToSelect } годнот з поступности довжкы { $length }.

select-from-sequence-indices-count-mismatch = Чісло заданых про select індексів ся мусить згодовати з чіслом, котре треба выбрати

select-from-sequence-indices-not-integers = Вшыткы заданы про select індексы мусять быти цїлы чісла

select-from-sequence-index-excluded = Заданый індекс selectfromsequence быв вынятый

select-from-sequence-indices-excluded-combination = Заданы індексы selectfromsequence творили выняту комбінацію

select-from-sequence-coprime-not-positive-integers = Не мож выбрати взаємно просты комбінації, бо ся не выберають позітівны цїлы чісла.

select-from-sequence-coprime-common-factor = Не мож выбрати взаємно просты чісла. Вшыткы можны годноты мають сполочный дїлитель. (Заданы годноты "from" або "to" мусять быти взаємно просты зо "step".)

select-from-sequence-coprime-single-number = Не мож выбрати взаємно просты комбінації з єдного чісла, котре не є 1.

select-from-sequence-excluded-too-many-combinations = В selectFromSequence ся вынято веце як 70% комбінацій

select-from-sequence-coprime-none-found = Не дало ся выбрати взаємно просты чісла. Вшыткы можны годноты мають сполочный дїлитель.

select-from-sequence-too-few-unique-values = Не мож выбрати { $numToSelect } унікатных годнот з поступности довжкы { $numPossibleValues }

select-prime-numbers-too-few-values = Не мож выбрати { $numToSelect } годнот зо списку простых чісел довжкы { $numValues }

select-prime-numbers-values-count-mismatch = Чісло заданых про select годнот ся мусить згодовати з чіслом, котре треба выбрати

select-prime-numbers-values-not-prime = Вшыткы годноты заданы про выбір простого чісла мусять быти в списку простых чісел

select-prime-numbers-values-excluded-combination = Заданы годноты selectPrimeNumbers творили выняту комбінацію

select-prime-numbers-excluded-too-many-combinations = В selectPrimeNumbers ся вынято веце як 70% комбінацій

select-random-combination-fluke = Про барз неправдоподобну случайность ся не дала выбрати комбінація нагодных годнот

select-random-value-fluke = Про барз неправдоподобну случайность ся не дала выбрати нагодна годнота

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` ся не малює внутрї математікы; выраз ся сазать так, як ся сазав перед тым, як ся дали вкладати вступы. { $reason ->
        [not-inline] Лем `inline` вступ выбору ся змістить внутрї выразу; без `inline` є то блок ґомбіків.
        [expanded] `expanded` текстовый вступ є вецейрядковый бокс, котрый є барз великый, жебы ся змістив внутрї выразу.
        [on-graph] На ґрафу ся выраз малює як єдиный образок, в котрім не є місто про контролку.
       *[relative-width] Його `width` є релатівна (процента або `em`), а тота не мать ся внутрї выразу проти чому міряти. Задайте шырьку в абсолутных єдиницях, наприклад `px`.
    }
