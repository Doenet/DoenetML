# Belarusian diagnostics. Translated from `locales/en/diagnostics.ftl`, which
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
# Belarusian counts in four plural categories, and which of them a message
# needs depends on what the count does in it. A message that prints the number
# next to a noun agrees that noun with it, so it spells out `one`, `few` and
# `many`. A message where the number never appears — the list messages, whose
# count only decides whether a verb is singular or plural — has just the two
# forms Belarusian offers there.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } ігнаруецца, калі зададзены абодва канцы
       *[other] { $attributes } ігнаруюцца, калі зададзены абодва канцы
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ігнаруецца, калі зададзены і канец, і сярэдзіна
       *[other] { $attributes } ігнаруюцца, калі зададзены і канец, і сярэдзіна
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset не дзейнічае без зададзенай сярэдзіны

## `<line>`

line-points-undetermined-dimensions = Прамая праз пункты нявызначанай размернасці.

line-points-too-few-dimensions = Прамая мусіць праходзіць праз пункты размернасці не менш за два.

line-points-depend-on-variables = Прамая праходзіць праз пункты, якія залежаць ад зменных: { $variables }.

line-equation-invalid-format = Няправільны фармат ураўнення прамой у зменных { $variable1 } і { $variable2 }.

## `<ray>`

ray-overprescribed-through = Прамень зададзены праз through, endpoint і direction. Зададзенае through ігнаруецца.

ray-dimension-mismatch = Неадпаведнасць numDimensions у промні.

## `<vector>`

vector-overprescribed-head = Вектар зададзены праз head, tail і displacement. Зададзенае head ігнаруецца.

vector-dimension-mismatch = Неадпаведнасць numDimensions у вектары.

## Attracting and constraining

attract-to-without-nearest-point = Немагчыма прыцягваць да `<{ $component }>`: у яго няма зменнай стану nearestPoint.

constrain-to-without-nearest-point = Немагчыма абмежаваць да `<{ $component }>`: у яго няма зменнай стану nearestPoint.

constrain-to-interior-without-nearest-point = Немагчыма абмежаваць унутранасцю `<{ $component }>`: у яго няма зменнай стану nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ігнаруецца для невбудаванага choiceInput

## Ordering children by index

choice-input-indices-count-mismatch = Індэксы, зададзеныя для choiceInput, ігнаруюцца: іх колькасць не супадае з колькасцю даччыных choice.

pretzel-indices-count-mismatch = Індэксы, зададзеныя для problem, ігнаруюцца: іх колькасць не супадае з колькасцю даччыных problem.

shuffle-indices-count-mismatch = Індэксы, зададзеныя для shuffle, ігнаруюцца: іх колькасць не супадае з колькасцю кампанентаў.

indices-ignored-out-of-range = Індэксы, зададзеныя для { $component }, ігнаруюцца: некаторыя выходзяць за межы.

pretzel-indices-repeated = Індэксы, зададзеныя для pretzel, ігнаруюцца: некаторыя паўтараюцца.

pretzel-circuit-first-index = Індэксы, зададзеныя для pretzel у рэжыме circuit, ігнаруюцца: першы індэкс мусіць быць 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Каб `<{ $component }>` працаваў з тэкставымі даччынымі элементамі, трэба задаць атрыбут `type`.

invalid-type-defaulting-to-math = Няправільны тып { $type } для кампанента { $component }. Ён мусіць быць math, text, number або boolean. Ужываецца math.

string-not-valid-component-to-arrange = Радок «{ $value }» не з'яўляецца прыдатным кампанентам для { $component }. Ён ігнаруецца.

## Types and variables

invalid-type-defaulting-to-number = Няправільны тып { $type }; тып усталёўваецца ў number.

invalid-variable-value = Няправільнае значэнне зменнай: `{ $value }`

## Variants

variant-index-must-be-number = Індэкс варыянта { $index } мусіць быць лікам

variant-index-must-be-integer = Індэкс варыянта { $index } мусіць быць цэлым лікам

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` не рэалізаваны для абсалютных велічынь. Шырыні становяцца адноснымі.

side-by-side-absolute-margins = `<{ $component }>` не рэалізаваны для абсалютных велічынь. Водступы становяцца адноснымі.

side-by-side-no-block-child = Няправільны `<{ $component }>`: у яго мусіць быць хоць адзін блочны даччыны элемент.

## `<label>`

label-for-ignored-on-graphical = Атрыбут `for` у графічнага `<label>` ігнаруецца.

label-for-must-resolve-to-one = Атрыбут `for` у `<label>` мусіць указваць роўна на адзін кампанент.

label-for-unresolved = Атрыбут `for` у `<label>` не ўдалося звязаць з кампанентам.

label-for-answer-with-authored-inputs = Атрыбут `for` у `<label>` спасылаецца на `<answer>` з відавочна запісанымі палямі ўводу; спасылайцеся проста на поле.

label-for-answer-without-input = Атрыбут `for` у `<label>` спасылаецца на `<answer>` без поля ўводу, якое можна было б падпісаць.

label-for-must-reference-input-or-answer = Атрыбут `for` у `<label>` мусіць спасылацца на поле ўводу або на адказ.

## Accessibility

accessibility-short-description-or-decorative = Дзеля даступнасці `<{ $component }>` мусіць мець кароткае апісанне або быць пазначаны як дэкаратыўны.

accessibility-video-short-description = Дзеля даступнасці `<video>` мусіць мець кароткае апісанне.

accessibility-input-short-description-or-label = Дзеля даступнасці `<{ $component }>` мусіць мець кароткае апісанне або подпіс.

accessibility-answer-input-short-description-or-label = Дзеля даступнасці `<answer>`, які стварае поле ўводу, мусіць мець кароткае апісанне або подпіс.

accessibility-short-description-contains-math = Кароткія апісанні не мусяць змяшчаць матэматычных кампанентаў накшталт `<{ $component }>`. Запішыце матэматыку словамі.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] У { $colorName } недастатковая кантраснасць для тэксту загалоўка раздзела (цёмная тэма) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; патрабуецца не менш за { $threshold }:1).
       *[other] У { $colorName } недастатковая кантраснасць для тэксту загалоўка раздзела ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; патрабуецца не менш за { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` праз { $count } пунктаў не рэалізавана, калі пункты не маюць лікавых значэнняў.

circle-too-many-through-points = Немагчыма вылічыць акружнасць больш чым праз 3 пункты.

circle-overprescribed-radius-center-points = Немагчыма вылічыць акружнасць з зададзенымі радыусам, цэнтрам і пунктамі.

circle-center-with-multiple-points = Немагчыма вылічыць акружнасць з зададзеным цэнтрам больш чым праз 1 пункт.

circle-radius-too-small = Немагчыма вылічыць акружнасць: паколькі адлегласць паміж двума пунктамі роўная { $distance }, зададзены радыус { $radius } занадта малы.

circle-radius-with-many-points = Немагчыма пабудаваць акружнасць больш чым праз два пункты з зададзеным радыусам.

circle-invalid-center-or-through-points = Няправільны цэнтр або пункты акружнасці.

circle-radius-center-with-multiple-points = Немагчыма вылічыць радыус акружнасці з зададзеным цэнтрам больш чым праз 1 пункт.

circle-change-radius-non-numerical = Немагчыма змяніць радыус акружнасці з нелікавымі пунктамі

circle-radius-with-points-non-numerical = Немагчыма пабудаваць акружнасць больш чым праз адзін пункт з зададзеным радыусам, калі няма лікавых значэнняў.

circle-change-center-non-numerical = Змяненне цэнтра акружнасці праз нелікавыя пункты не рэалізавана.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Недастаткова вымярэнняў для вобласці вызначэння функцыі. У вобласці { $intervals } інтэрвал, а ў функцыі { $inputs ->
            [one] { $inputs } уваход
            [few] { $inputs } уваходы
            [many] { $inputs } уваходаў
           *[other] { $inputs } уваходы
        }.
        [few] Недастаткова вымярэнняў для вобласці вызначэння функцыі. У вобласці { $intervals } інтэрвалы, а ў функцыі { $inputs ->
            [one] { $inputs } уваход
            [few] { $inputs } уваходы
            [many] { $inputs } уваходаў
           *[other] { $inputs } уваходы
        }.
       *[other] Недастаткова вымярэнняў для вобласці вызначэння функцыі. У вобласці { $intervals } інтэрвалаў, а ў функцыі { $inputs ->
            [one] { $inputs } уваход
            [few] { $inputs } уваходы
            [many] { $inputs } уваходаў
           *[other] { $inputs } уваходы
        }.
    }

function-domain-invalid-format = Няправільны фармат вобласці вызначэння функцыі.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Нелікавы максімум функцыі ігнаруецца.
        [minimum] Нелікавы мінімум функцыі ігнаруецца.
        [extremum] Нелікавы экстрэмум функцыі ігнаруецца.
        [point] Нелікавы пункт функцыі ігнаруецца.
        [slope] Нелікавы нахіл функцыі ігнаруецца.
       *[other] Нелікавае { $type } функцыі ігнаруецца.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Пусты максімум функцыі ігнаруецца.
        [minimum] Пусты мінімум функцыі ігнаруецца.
        [extremum] Пусты экстрэмум функцыі ігнаруецца.
        [point] Пусты пункт функцыі ігнаруецца.
       *[other] Пустое { $type } функцыі ігнаруецца.
    }

function-points-too-close = Функцыя змяшчае два пункты, размешчаныя занадта блізка. Немагчыма вызначыць функцыю.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Ітэрацыі функцыі магчымыя, толькі калі колькасць уваходаў роўная колькасці выхадаў. У гэтай функцыі { $inputs } уваход і { $outputs ->
            [one] { $outputs } выхад
            [few] { $outputs } выхады
            [many] { $outputs } выхадаў
           *[other] { $outputs } выхады
        }.
        [few] Ітэрацыі функцыі магчымыя, толькі калі колькасць уваходаў роўная колькасці выхадаў. У гэтай функцыі { $inputs } уваходы і { $outputs ->
            [one] { $outputs } выхад
            [few] { $outputs } выхады
            [many] { $outputs } выхадаў
           *[other] { $outputs } выхады
        }.
       *[other] Ітэрацыі функцыі магчымыя, толькі калі колькасць уваходаў роўная колькасці выхадаў. У гэтай функцыі { $inputs } уваходаў і { $outputs ->
            [one] { $outputs } выхад
            [few] { $outputs } выхады
            [many] { $outputs } выхадаў
           *[other] { $outputs } выхады
        }.
    }

## `<sequence>`

sequence-invalid-length = Няправільная даўжыня паслядоўнасці. Яна мусіць быць неадмоўным цэлым лікам.

sequence-invalid-step = Няправільны крок паслядоўнасці. Для паслядоўнасці тыпу { $type } ён мусіць быць лікам.

sequence-invalid-endpoint-number = Няправільнае «{ $attribute }» лікавай паслядоўнасці. Яно мусіць быць лікам.

sequence-invalid-endpoint-letters = Няправільнае «{ $attribute }» літарнай паслядоўнасці. Яно мусіць быць спалучэннем літар.

sequence-invalid-endpoint = Няправільнае «{ $attribute }» паслядоўнасці.

select-from-sequence-coprime-not-numbers = coprime ігнаруецца, бо выбіраюцца не лікі

select-from-sequence-coprime-with-exclude-combinations = coprime ігнаруецца, бо зададзена excludeCombinations

## Resolving a `target`

target-not-found = Няправільны target для `<{ $source }>`: мэта не знойдзена.

target-state-variable-not-found = Няправільны target для `<{ $source }>`: у `<{ $component }>` няма зменнай стану з імем «{ $property }».

## `<odeSystem>`

ode-system-variables-match-independent = Зменныя `<odeSystem>` мусяць адрознівацца ад незалежнай зменнай.

ode-system-duplicate-variable-names = Немагчыма вызначыць правыя часткі ЗДР з паўторнымі імёнамі залежных зменных.

ode-system-rhs-function-error = Немагчыма вызначыць правую частку ЗДР. Памылка пры стварэнні функцыі mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Немагчыма вызначыць вугал паміж { $count } прамымі

angle-invalid-through-point = Няправільны пункт у through у `<angle>`

parabola-vertex-too-many-points = Парабала з зададзенай вяршыняй больш чым праз 1 пункт не рэалізавана.

parabola-too-many-points = Парабала больш чым праз 3 пункты не рэалізавана.

intersection-too-many-items = Перасячэнне больш чым двух аб'ектаў не рэалізавана

## Other math components

ionic-compound-not-two-ions = Іонныя злучэнні, апроч злучэнняў з двух іонаў, не рэалізаваны.

ionic-compound-needs-cation-and-anion = Іонныя злучэнні рэалізаваны толькі для аднаго катыёна і аднаго аніёна.

solve-equations-cannot-evaluate = Немагчыма вырашыць ураўненне, бо яго не ўдалося вылічыць: { $equation }

math-operators-operand-number-required = Каб выняць матэматычны аперанд, трэба задаць operandNumber.

eigen-decomposition-failed = Не ўдалося вылічыць уласныя значэнні матрыцы

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: параметр { $parameters } не сустракаецца ў шаблоне, таму ён заўсёды будзе супадаць з пропускам.
       *[other] `<matchesPattern>`: параметры { $parameters } не сустракаюцца ў шаблоне, таму яны заўсёды будуць супадаць з пропускам.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: не ўдалося разабраць grid="{ $grid }". Значэнне мусіць быць none, medium, dense альбо два дадатныя лікі праз прабел, напрыклад grid="1 0.5". Сетка не малюецца.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" не падтрымліваецца ў адлюстравальніку prefigure; ужываюцца паводзіны правай пазіцыі.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" не падтрымліваецца ў адлюстравальніку prefigure; ужываюцца паводзіны верхняй пазіцыі.

prefigure-invalid-axis-bounds = `<graph>`: няправільныя межы восяў для пераўтварэння ў prefigure; ужываецца прадвызначаны bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: няправільная шырыня для пераўтварэння ў prefigure; ужываецца прадвызначаная шырыня дыяграмы 425.

prefigure-invalid-aspect-ratio = `<graph>`: няправільнае aspectRatio для пераўтварэння ў prefigure; ужываюцца прадвызначаныя суадносіны бакоў 1.

prefigure-grid-spacing-too-fine = `<graph>`: крок сеткі занадта дробны для межаў восяў; у адлюстравальніку prefigure сетка апускаецца.

prefigure-annotations-not-rendered = `<graph>`: па-за адлюстравальнікам PreFigure анатацыі не выводзяцца.

multiple-annotations-children = У `<graph>` знойдзена некалькі даччыных `<annotations>`; усе, апроч апошняга, ігнаруюцца.

## Referring to other components

copy-unrecognized-component-type = Немагчыма пашырыць або скапіяваць нераспазнаны тып кампанента: { $type }.

copy-prop-not-found = Уласцівасць { $property } не знойдзена ў кампанента тыпу { $component }

collect-no-source = Для collect не знойдзена крыніца.

collect-invalid-component-type = Немагчыма збіраць кампаненты тыпу `<{ $component }>`: гэта няправільны тып кампанента.

reference-index-unavailable = Немагчыма спаслацца на індэкс `{ $reference }`

## `<callAction>`

component-action-unavailable = Немагчыма выклікаць { $action } у кампанента `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = У даных няправільная форма. Радкі маюць розную даўжыню. Знойдзена ў componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = У даных ёсць паўторныя імёны слупкоў. Знойдзена ў componentIdx :{ $componentIdx }

data-frame-missing-column-name = У даных адсутнічае імя слупка. Знойдзена ў componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award гэтага адказу абапіраецца на адпраўлены адказ самога тэга answer, што прывядзе да нечаканых паводзін.

answer-max-num-attempts-in-section-wide-check-work = Задаванне `maxNumAttempts` у `<answer>` унутры кантэйнера з `sectionWideCheckWork` не дзейнічае: колькасць спроб вызначаецца кантэйнерам. Задайце `maxNumAttempts` кантэйнеру.

nested-section-wide-check-work-max-num-attempts = Задаванне `maxNumAttempts` кантэйнеру з `sectionWideCheckWork`, які сам знаходзіцца ўнутры іншага кантэйнера з `sectionWideCheckWork`, не дзейнічае: колькасць спроб вызначаецца знешнім кантэйнерам. Задайце `maxNumAttempts` знешняму кантэйнеру.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Атрыбут { $attributes } не будзе дзейнічаць без зададзенага symbolicEquality.
       *[other] Атрыбуты { $attributes } не будуць дзейнічаць без зададзенага symbolicEquality.
    }

answer-invalid-type = Няправільны тып для answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Кампанент `<{ $component }>` не мае імя, таму яго нельга ўжыць як атрыбут модуля

module-attribute-name-already-defined = Кампанент `<{ $component } name="{ $name }">` нельга ўжыць як атрыбут модуля, бо ў тыпу кампанента `<module>` ужо вызначаны атрыбут «{ $name }».

conditional-content-condition-ignored = Атрыбут `condition` ігнаруецца ў кампанента `<conditionalContent>` з даччынымі case або else.

slider-markers-type-mismatch = Тып маркераў не супадае з тыпам паўзунка.

pretzel-problem-needs-statement-and-answer = Няправільны pretzel: кожны `<problem>` мусіць змяшчаць адзін `<statement>` і адзін `<answer>`.

pretzel-circuit-first-problem-distractor = Няправільны pretzel: пры mode="circuit" першы `<problem>` не можа быць адцягвальным.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Няправільнае значэнне { $values } для атрыбута `{ $attribute }`; яно ігнаруецца.
       *[other] Няправільныя значэнні { $values } для атрыбута `{ $attribute }`; яны ігнаруюцца.
    }

attribute-must-be-references = Няправільнае значэнне `{ $value }` для атрыбута `{ $attribute }`. Атрыбут мусіць складацца са спасылак, якія пачынаюцца з `$`.

math-input-invalid-function-names = <mathInput>: няправільныя імёны функцый у { $attribute } праігнараваны: { $names }. Бачная частка кожнага імя мусіць быць не карацейшая за 2 знакі (літары або злучкі); за ёй можа ісці неабавязковы суфікс `|<альтэрнатыва mathspeak>`.

## Building components from the source

component-type-invalid = Няправільны тып кампанента: `<{ $componentType }>`

attribute-repeated = Атрыбут { $attribute } нельга паўтараць.

attribute-invalid-for-component = Няправільны атрыбут «{ $attribute }» для кампанента тыпу `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    У вызначэння стылю { $styleNumber } недастатковая кантраснасць для { $context ->
        [text-on-background] колеру тэксту на колеры фону
        [high-contrast] высокакантраснага колеру на палатне
        [line] колеру ліній на палатне
        [marker] колеру маркераў на палатне
       *[text-on-canvas] колеру тэксту на палатне
    }{ $mode ->
        [dark] { " (цёмная тэма)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; патрабуецца не менш за { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Хоць у вызначэнні стылю { $styleNumber } зададзены колеры з дастатковай кантраснасцю для светлай тэмы, вытворныя ад іх колеры цёмнай тэмы даюць недастатковую кантраснасць тэксту на фоне ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; патрабуецца не менш за { $threshold }:1). { $suggestion ->
        [available] Каб забяспечыць дастатковую кантраснасць у цёмнай тэме, або павялічце кантраснасць светлай тэмы (напрыклад, { $lightAttribute }="{ $lightColor }"), або перавызначце колер цёмнай тэмы (напрыклад, { $darkAttribute }="{ $darkColor }").
       *[none] Каб забяспечыць дастатковую кантраснасць у цёмнай тэме, павялічце кантраснасць светлай тэмы або перавызначце вытворныя колеры праз textColorDarkMode і/або backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Хоць у вызначэнні стылю { $styleNumber } зададзены колер тэксту з дастатковай кантраснасцю для светлай тэмы, вытворны ад яго колер тэксту цёмнай тэмы дае недастатковую кантраснасць на палатне ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; патрабуецца не менш за { $threshold }:1). { $suggestion ->
        [available] Каб забяспечыць дастатковую кантраснасць у цёмнай тэме, або павялічце кантраснасць светлай тэмы (напрыклад, textColor="{ $lightColor }"), або перавызначце колер цёмнай тэмы (напрыклад, textColorDarkMode="{ $darkColor }").
       *[none] Каб забяспечыць дастатковую кантраснасць у цёмнай тэме, павялічце кантраснасць светлай тэмы або перавызначце вытворны колер праз textColorDarkMode.
    }

section-multiple-style-palettes = Раздзел можа выбраць толькі адну <stylePalette>; ужываецца апошняя.

## Unique variants

variant-num-to-select-not-non-negative-integer = немагчыма вызначыць унікальныя варыянты { $component }, бо numToSelect не з'яўляецца неадмоўным цэлым лікам.

variant-num-to-select-not-constant-number = немагчыма вызначыць унікальныя варыянты { $component }, бо numToSelect не з'яўляецца пастаянным лікам.

variant-with-replacement-not-constant-boolean = немагчыма вызначыць унікальныя варыянты { $component }, бо withReplacement не з'яўляецца пастаянным лагічным значэннем.

variant-select-weight-disables-unique = Унікальныя варыянты для select адключаны, калі ў якой-небудзь магчымасці зададзены selectWeight або selectForVariants

variant-coprime-undetermined = немагчыма вызначыць унікальныя варыянты { $component }, бо нельга ўстанавіць, што coprime заўсёды хлусня.

variant-attribute-not-constant = немагчыма вызначыць унікальныя варыянты { $component }, бо { $attribute } не з'яўляецца канстантай.

variant-attribute-not-number = немагчыма вызначыць унікальныя варыянты { $component }, бо { $attribute } не з'яўляецца лікам.

variant-attribute-wrong-type-for-sequence =
    немагчыма вызначыць унікальныя варыянты { $component } тыпу { $type }, бо { $attribute } не з'яўляецца { $expected ->
        [letters-combination] спалучэннем літар
        [math-expression] прыдатным матэматычным выразам
        [integer] цэлым лікам
       *[number] лікам
    }.

variant-length-not-integer = немагчыма вызначыць унікальныя варыянты { $component }, бо length не з'яўляецца цэлым лікам.

variant-sort-not-implemented = унікальныя варыянты { $component } з sort не рэалізаваны

variant-exclude-combinations-not-implemented = унікальныя варыянты { $component } з excludeCombinations не рэалізаваны

variant-math-exclude-not-implemented = унікальныя варыянты { $component } тыпу math з exclude не рэалізаваны

variant-non-constant-exclude-not-implemented = унікальныя варыянты { $component } з непастаянным exclude не рэалізаваны

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: не падтрымліваецца ў адлюстравальніку prefigure для графіка; нашчадак прапушчаны.

prefigure-descendant-invalid-geometry = { $subject }: бясконцая або няпоўная геаметрыя; нашчадак прапушчаны.

prefigure-curve-label-omitted = { $subject }: подпісы не падтрымліваюцца ў пераўтвораных элементах крывых; подпіс апушчаны.

prefigure-curve-unsupported-definition-type = { $subject }: непадтрыманы тып вызначэння функцыі крывой «{ $definitionType }»; нашчадак прапушчаны.

prefigure-region-flip-functions-unsupported = { $subject }: атрыбут flipFunctions у regionBetweenCurves не падтрымліваецца; нашчадак прапушчаны.

prefigure-region-non-formula-child = { $subject }: у regionBetweenCurves падтрымліваюцца толькі даччыныя функцыі, зададзеныя формулай; нашчадак прапушчаны.

prefigure-label-position-unsupported =
    { $subject }: непадтрыманае labelPosition «{ $labelPosition }» для { $labelKind ->
        [line-family] подпісу сямейства прамых
       *[point] подпісу пункта
    }; ужываецца прадвызначанае выраўноўванне PreFigure.

prefigure-fill-style-unsupported = { $subject }: стыль заліўкі «{ $fillStyle }» не падтрымліваецца PreFigure; ужываецца суцэльная заліўка.

prefigure-line-style-unknown = { $subject }: невядомы стыль лініі «{ $lineStyle }» апушчаны ў вывадзе PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: стыль маркера «{ $markerStyle }» супастаўлены са стылем PreFigure «diamond».

prefigure-marker-style-unsupported = { $subject }: стыль маркера «{ $markerStyle }» не падтрымліваецца PreFigure; ужываецца прадвызначаны стыль.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: няправільны `ref`; мэта не вызначаецца. Анатацыя апушчана.

annotation-ref-multiple-targets = `<annotation>`: `ref` вызначыўся ў некалькі мэтаў; ужываецца першая.

annotation-ref-outside-graph = `<annotation>`: няправільны `ref`; мэта знаходзіцца па-за графікам, які яе змяшчае. Анатацыя апушчана.

annotation-ref-unsupported-target = `<annotation>`: няправільны `ref`; мэта не з'яўляецца падтрыманым графічным аб'ектам пры пераўтварэнні ў prefigure. Анатацыя апушчана.

annotation-text-missing = `<annotation>`: `text` адсутнічае або пусты; выводзіцца пусты тэкст.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Выяўлена цыклічная залежнасць.
       *[other] Выяўлена цыклічная залежнасць з удзелам кампанента `<{ $componentType }>`.
    }

reference-no-referent = Не знойдзены аб'ект для спасылкі: `{ $reference }`

reference-multiple-referents = Знойдзена некалькі аб'ектаў для спасылкі: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Няправільны фармат атрыбута { $attribute } у `<{ $componentType }>`.

children-invalid = Няправільныя даччыныя элементы для `<{ $componentType }>`: знойдзены няправільныя даччыныя элементы: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Няправільнае значэнне `{ $value }` для атрыбута `{ $attribute }`; ужываецца значэнне `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Версія DoenetML { $version } не знойдзена.
       *[other] Версія DoenetML { $version } не знойдзена. Ужываецца версія { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Няправільны DoenetML: { $content }

parse-tag-missing-close-tag = Няправільны DoenetML: у тэга `{ $tag }` няма закрывальнага тэга. Чакаўся самазакрывальны тэг або тэг `</{ $tagName }>`.

parse-tag-error = Няправільны DoenetML: памылка ў тэгу `<{ $tagName }>`

parse-attribute-missing-value = Няправільны DoenetML: у атрыбута `{ $attribute }`, відаць, адсутнічае значэнне.

parse-attribute-invalid = Няправільны DoenetML: няправільны атрыбут `{ $attribute }`

parse-attribute-value-invalid = Няправільны DoenetML: няправільнае значэнне атрыбута `{ $value }`

parse-attribute-value-quote-mismatch = Няправільны DoenetML: няправільнае значэнне атрыбута `{ $value }`. Двукоссі не супадаюць. Відаць, не хапае `{ $quote }`

parse-open-tag-name-missing = Няправільны DoenetML: знойдзены тэг без імя, напрыклад `<`

parse-tag-not-closed = Няправільны DoenetML: тэг `{ $tag }` не закрыты (відаць, не хапае `>`).

parse-self-closing-tag-name-missing = Няправільны DoenetML: знойдзены тэг без імя `<{ $content }>`

parse-self-closing-tag-not-closed = Няправільны DoenetML: тэг `{ $tag }` не закрыты (відаць, не хапае `/>`).

parse-tag-invalid-attributes = Няправільны DoenetML: тэг `{ $tag }` няправільны. Магчыма, у яго няслушныя атрыбуты.

parse-close-tag-name-missing = Няправільны DoenetML: знойдзены закрывальны тэг без імя, напрыклад `</`

parse-attribute-value-unquoted = Значэнні атрыбутаў мусяць быць у двукоссях: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Няправільны DoenetML: знойдзены закрывальны тэг `{ $tag }`, але няма адпаведнага адкрывальнага

parse-close-tag-mismatched = Няправільны DoenetML: неадпаведны закрывальны тэг. Чакаўся `</{ $expected }>`. Знойдзены `{ $found }`

parser-node-unconvertible = Не ўдалося пераўтварыць вузел { $node } у вузел Dast.

## Names

name-attribute-invalid =
    Няправільны атрыбут name='{ $name }'. { $reason ->
        [characters] Імёны могуць змяшчаць толькі літары, лічбы, падкрэсліванні і злучкі.
       *[start] Імёны мусяць пачынацца з літары.
    }

component-name-invalid-start = Няправільнае імя кампанента «{ $name }». Імёны мусяць пачынацца з літары.

## `<answer>` sugar

answer-video-watched-missing-video = У answer з тыпам videoWatched мусіць быць атрыбут video

answer-video-watched-video-not-reference = У answer з тыпам videoWatched атрыбут video мусіць быць спасылкай

answer-name-not-single-text = У атрыбута name кампанента answer мусіць быць роўна адзін тэкставы даччыны элемент

## Referencing another document

external-doenetml-recursion-limit = Не ўдалося атрымаць знешні DoenetML з-за занадта вялікай глыбіні рэкурсіі. Ці няма цыклічнай спасылкі?

external-doenetml-unavailable = Не ўдалося атрымаць DoenetML з { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Атрыманы няправільны DoenetML з { $attribute }="{ $uri }": ён не адпавядае тыпу кампанента «{ $componentType }»

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Атрыбут `{ $from }` састарэлы; ужывайце `{ $to }`.
       *[other] [deprecation] Атрыбут `{ $from }` у `<{ $component }>` састарэлы; ужывайце `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Атрыбут `{ $from }` састарэлы і ігнаруецца, бо зададзены таксама `{ $to }`.
       *[other] [deprecation] Атрыбут `{ $from }` у `<{ $component }>` састарэлы і ігнаруецца, бо зададзены таксама `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Атрыбут `{ $attribute }` у `<{ $component }>` састарэлы і ігнаруецца.


## Language coverage

pluralize-english-only = `<pluralize>` умее ўтвараць множны лік толькі ў англійскай, таму ў дакуменце на мове { $locale } яго тэкст застаецца без змен. Напішыце форму множнага ліку самі або задайце яе атрыбутам `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Элемент `<{ $tag }>` не з'яўляецца вядомым элементам Doenet.

schema-element-not-allowed-at-root = Элемент `<{ $tag }>` не дапускаецца ў корані дакумента.

schema-element-not-allowed-inside = Элемент `<{ $tag }>` не дапускаецца ўнутры `<{ $parent }>`.

schema-attribute-unrecognized = У элемента `<{ $tag }>` няма атрыбута з імем `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Атрыбут `{ $attribute }` элемента `<{ $tag }>` мусіць быць спісам, кожны элемент якога — адно з: { $allowed }
       *[other] Атрыбут `{ $attribute }` элемента `<{ $tag }>` мусіць быць адным з: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Няправільнае імя варыянта для select. Імя варыянта { $variantName } сустракаецца ў { $numOptions } магчымасцях, а выбраць трэба { $numToSelect }.

select-variant-name-without-options = Для select зададзены варыянты, але не зададзена ніводнай магчымасці для магчымага імя варыянта: { $variantName }.

select-variant-name-not-possible = Імя варыянта { $variantName }, зададзенае для select, не з'яўляецца магчымым імем варыянта.

select-too-few-options = Немагчыма выбраць { $numToSelect } кампанентаў усяго з { $numOptions }.

select-from-sequence-too-few-values = Немагчыма выбраць { $numToSelect } значэнняў з паслядоўнасці даўжынёй { $length }.

select-from-sequence-indices-count-mismatch = Колькасць індэксаў, зададзеных для select, мусіць супадаць з колькасцю выбіраных

select-from-sequence-indices-not-integers = Усе індэксы, зададзеныя для select, мусяць быць цэлымі лікамі

select-from-sequence-index-excluded = Зададзены індэкс selectfromsequence быў выключаны

select-from-sequence-indices-excluded-combination = Зададзеныя індэксы selectfromsequence утварылі выключанае спалучэнне

select-from-sequence-coprime-not-positive-integers = Немагчыма выбраць узаемна простыя спалучэнні, бо выбіраюцца не дадатныя цэлыя лікі.

select-from-sequence-coprime-common-factor = Немагчыма выбраць узаемна простыя лікі. Усе магчымыя значэнні маюць агульны дзельнік. (Зададзеныя значэнні "from" або "to" мусяць быць узаемна простымі са "step".)

select-from-sequence-coprime-single-number = Немагчыма выбраць узаемна простыя спалучэнні з аднаго ліку, адрознага ад 1.

select-from-sequence-excluded-too-many-combinations = У selectFromSequence выключана больш за 70 % спалучэнняў

select-from-sequence-coprime-none-found = Не ўдалося выбраць узаемна простыя лікі. Усе магчымыя значэнні маюць агульны дзельнік.

select-from-sequence-too-few-unique-values = Немагчыма выбраць { $numToSelect } розных значэнняў з паслядоўнасці даўжынёй { $numPossibleValues }

select-prime-numbers-too-few-values = Немагчыма выбраць { $numToSelect } значэнняў са спіса простых лікаў даўжынёй { $numValues }

select-prime-numbers-values-count-mismatch = Колькасць значэнняў, зададзеных для select, мусіць супадаць з колькасцю выбіраных

select-prime-numbers-values-not-prime = Усе значэнні, зададзеныя для select prime number, мусяць уваходзіць у спіс простых лікаў

select-prime-numbers-values-excluded-combination = Зададзеныя значэнні selectPrimeNumbers утварылі выключанае спалучэнне

select-prime-numbers-excluded-too-many-combinations = У selectPrimeNumbers выключана больш за 70 % спалучэнняў

select-random-combination-fluke = Па надзвычай малаверагоднай выпадковасці не ўдалося выбраць спалучэнне выпадковых значэнняў

select-random-value-fluke = Па надзвычай малаверагоднай выпадковасці не ўдалося выбраць выпадковае значэнне
