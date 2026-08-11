# Erzya diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# The technical nouns are the Russian ones, which is what written Erzya uses
# for them: «компонент», «атрибут», «функция», «индекс».


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] кавто пень точкатне невтезь бути, { $attributes } а ловови
       *[other] кавто пень точкатне невтезь бути, { $attributes } а ловови
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] пень точкась ды куншка точкась кавонест невтезь бути, { $attributes } а ловови
       *[other] пень точкась ды куншка точкась кавонест невтезь бути, { $attributes } а ловови
    }

line-segment-midpoint-offset-without-midpoint = куншка точкавтомо midpointOffset мезескак а токши

## `<line>`

line-points-undetermined-dimensions = Онксозо асодавикс точкатнень пачк ютыця виде линия.

line-points-too-few-dimensions = Виде линиясь сехте аламо кавто онкссо точкатнень пачк ютомо эряви.

line-points-depend-on-variables = Виде линиясь полавтовиця онкстнэде лепштявиця точкатнень пачк юты: { $variables }.

line-equation-invalid-format = { $variable1 } ды { $variable2 } полавтовиця онкссо виде линиянь уравнениянть форматозо а виде.

## `<ray>`

ray-overprescribed-through = Лучось through, endpoint ды direction пачк максозь. Максозь through а ловови.

ray-dimension-mismatch = лучсонть numDimensions а вейсэнди.

## `<vector>`

vector-overprescribed-head = Векторось head, tail ды displacement пачк максозь. Максозь head а ловови.

vector-dimension-mismatch = векторсонть numDimensions а вейсэнди.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элементэнтень таргамс а маштови, эдь сонзэ nearestPoint статусонь полавтовицязо арась.

constrain-to-without-nearest-point = `<{ $component }>` элементсэ пежедемс а маштови, эдь сонзэ nearestPoint статусонь полавтовицязо арась.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементэнь потмосонзо пежедемс а маштови, эдь сонзэ nearestPoint статусонь полавтовицязо арась.

## `<choiceInput>`

choice-input-label-position-ignored = ряд потсо аволь choiceInput лангс labelPosition а ловови

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput лангс максозь индекстнэ а ловновить, эдь сынст ламоксчист choice эйкакштнэнь ламоксчинтень а вейсэнди.

pretzel-indices-count-mismatch = problem лангс максозь индекстнэ а ловновить, эдь сынст ламоксчист problem эйкакштнэнь ламоксчинтень а вейсэнди.

shuffle-indices-count-mismatch = shuffle лангс максозь индекстнэ а ловновить, эдь сынст ламоксчист компоненттнэнь ламоксчинтень а вейсэнди.

indices-ignored-out-of-range = { $component } лангс максозь индекстнэ а ловновить, эдь конатнеяк пелькстамодо лисить.

pretzel-indices-repeated = pretzel лангс максозь индекстнэ а ловновить, эдь конатнеяк омбоцеде вастневить.

pretzel-circuit-first-index = circuit режимсэ pretzel лангс максозь индекстнэ а ловновить, эдь васенце индексэсь 1 улемс эряви.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текстэнь эйкакштнэ марто важодемга `type` атрибут максомс эряви.

invalid-type-defaulting-to-math = { $component } компонентэнтень а виде лад { $type }. Сон math, text, number эли boolean улемс эряви. math тевс нолдави.

string-not-valid-component-to-arrange = «{ $value }» рядось { $component } лангс маштовикс компонент арась. А ловови.

## Types and variables

invalid-type-defaulting-to-number = А виде лад { $type }, ладозо number ули.

invalid-variable-value = Полавтовицянь а виде питне: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариантонь индексэсь ловома улемс эряви

variant-index-must-be-integer = { $index } вариантонь индексэсь целой ловома улемс эряви

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолютной онкстнэнень а теезь. Келест вейсэндявикс улить.

side-by-side-absolute-margins = `<{ $component }>` абсолютной онкстнэнень а теезь. Чирест вейсэндявикс улить.

side-by-side-no-block-child = А виде `<{ $component }>`: сонзэ сехте аламо вейке блок эйкакшозо улемс эряви.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элементэнь `for` атрибутось а ловови.

label-for-must-resolve-to-one = `<label>` элементэнь `for` атрибутось ансяк вейке компонент лангс невтемс эряви.

label-for-unresolved = `<label>` элементэнь `for` атрибутонть компонент марто сюлмамс эзь маштово.

label-for-answer-with-authored-inputs = `<label>` элементэнь `for` атрибутось авторонь сёрмадозь совавтома таркат марто `<answer>` лангс невти; таркантень видестэ невтик.

label-for-answer-without-input = `<label>` элементэнь `for` атрибутось совавтома таркавтомо `<answer>` лангс невти.

label-for-must-reference-input-or-answer = `<label>` элементэнь `for` атрибутось совавтома тарка эли каршо вал лангс невтемс эряви.

## Accessibility

accessibility-short-description-or-decorative = Пачкодемань кисэ `<{ $component }>` эли нурька невтема марто улемс эряви, эли мазылгавтома ладсо тешкстамс.

accessibility-video-short-description = Пачкодемань кисэ `<video>` нурька невтема марто улемс эряви.

accessibility-input-short-description-or-label = Пачкодемань кисэ `<{ $component }>` нурька невтема эли тешкс марто улемс эряви.

accessibility-answer-input-short-description-or-label = Пачкодемань кисэ совавтома тарка теиця `<answer>` нурька невтема эли тешкс марто улемс эряви.

accessibility-short-description-contains-math = Нурька невтематнесэ `<{ $component }>` ладсо математикань компоненттнэ улемс а эрявить. Математиканть валсо сёрмадык.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } пелькскень прявт текстэнтень сатышка контраст а максы (чопода лад) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сехте аламо { $threshold }:1 эряви).
       *[other] { $colorName } пелькскень прявт текстэнтень сатышка контраст а максы ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сехте аламо { $threshold }:1 эряви).
    }

## `<circle>`

circle-through-points-non-numerical = Точкатнень ловома питнест арасть бути, { $count } точкань пачк ютыця `<circle>` а теезь.

circle-too-many-through-points = 3-де ламо точкань пачк ютыця кругонть ловомс а маштови.

circle-overprescribed-radius-center-points = Максозь радиус, куншка ды точкат марто кругонть ловомс а маштови.

circle-center-with-multiple-points = Максозь куншка марто 1-де ламо точкань пачк ютыця кругонть ловомс а маштови.

circle-radius-too-small = Кругонть ловомс а маштови: кавто точкатнень ютксост { $distance } бути, максозь радиусось { $radius } пек вишкине.

circle-radius-with-many-points = Максозь радиус марто кавтодо ламо точкань пачк ютыця круг теемс а маштови.

circle-invalid-center-or-through-points = Кругонь куншказо эли точканзо а видеть.

circle-radius-center-with-multiple-points = Максозь куншка марто 1-де ламо точкань пачк ютыця кругонь радиусонзо ловомс а маштови.

circle-change-radius-non-numerical = Ловома аволь точкат марто кругонь радиусонзо полавтомс а маштови

circle-radius-with-points-non-numerical = Ловома питнеть арасть бути, максозь радиус марто вейкеде ламо точкань пачк ютыця круг теемс а маштови.

circle-change-center-non-numerical = Ловома аволь точкань пачк ютыця кругонь куншканзо полавтомась а теезь.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функциянь содавикс тарканть онксозо а сатни. Таркасонть { $intervals } ютко ули, а функциясонть { $inputs ->
            [one] { $inputs } совавтома
           *[other] { $inputs } совавтома
        } ули.
       *[other] Функциянь содавикс тарканть онксозо а сатни. Таркасонть { $intervals } ютко ули, а функциясонть { $inputs ->
            [one] { $inputs } совавтома
           *[other] { $inputs } совавтома
        } ули.
    }

function-domain-invalid-format = Функциянь содавикс тарканть форматозо а виде.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функциянь ловома аволь максимумозо а ловови.
        [minimum] Функциянь ловома аволь минимумозо а ловови.
        [extremum] Функциянь ловома аволь экстремумозо а ловови.
        [point] Функциянь ловома аволь точказо а ловови.
        [slope] Функциянь ловома аволь чирезэ а ловови.
       *[other] Функциянь ловома аволь { $type } питнезэ а ловови.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функциянь чаво максимумозо а ловови.
        [minimum] Функциянь чаво минимумозо а ловови.
        [extremum] Функциянь чаво экстремумозо а ловови.
        [point] Функциянь чаво точказо а ловови.
       *[other] Функциянь чаво { $type } питнезэ а ловови.
    }

function-points-too-close = Функциясонть вейкест-вейкест пек маласо кавто точкат улить. Функциянть содамс а маштови.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функциянь итерациятне маштовить ансяк совавтоматнень ламоксчист лисематнень ламоксчинтень вейкетть бути. Те функциясонть { $inputs } совавтома ды { $outputs ->
            [one] { $outputs } лисема
           *[other] { $outputs } лисема
        } ули.
       *[other] Функциянь итерациятне маштовить ансяк совавтоматнень ламоксчист лисематнень ламоксчинтень вейкетть бути. Те функциясонть { $inputs } совавтома ды { $outputs ->
            [one] { $outputs } лисема
           *[other] { $outputs } лисема
        } ули.
    }

## `<sequence>`

sequence-invalid-length = Мельга-мельгань кувалмозо а виде. Сон минус аволь целой ловома улемс эряви.

sequence-invalid-step = Мельга-мельгань эскелксэзэ а виде. { $type } ладсо мельга-мельгантень сон ловома улемс эряви.

sequence-invalid-endpoint-number = Ловомань мельга-мельгань «{ $attribute }» питнезэ а виде. Сон ловома улемс эряви.

sequence-invalid-endpoint-letters = Буквань мельга-мельгань «{ $attribute }» питнезэ а виде. Сон буквань вейсэндявкс улемс эряви.

sequence-invalid-endpoint = Мельга-мельгань «{ $attribute }» питнезэ а виде.

select-from-sequence-coprime-not-numbers = ловоматне а кочказь, седе coprime а ловови

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations максозь, седе coprime а ловови

## Resolving a `target`

target-not-found = `<{ $source }>` лангс а виде target: цель эзь муеве.

target-state-variable-not-found = `<{ $source }>` лангс а виде target: `<{ $component }>` элементсэ «{ $property }» лем марто статусонь полавтовиця эзь муеве.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` полавтовицянзо эсь прянь полавтовицядонть явовомс эрявить.

ode-system-duplicate-variable-names = Лепштявиця полавтовицятнень лемест омбоцеде вастневить бути, ДТ вить пелень функциятнень содамс а маштови.

ode-system-rhs-function-error = ДТ вить пелень функциянть содамс а маштови. mathjs функциянть теемстэ ильведевкс.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } виде линиянь ютксо ужонть содамс а маштови

angle-invalid-through-point = `<angle>` элементэнь through питнесэнть а виде точка

parabola-vertex-too-many-points = Максозь пря марто 1-де ламо точкань пачк ютыця парабола а теезь.

parabola-too-many-points = 3-де ламо точкань пачк ютыця парабола а теезь.

intersection-too-many-items = Кавтодо ламо объектэнь вастневемась а теезь

## Other math components

ionic-compound-not-two-ions = Кавто иондо башка иононь сюлмавкст а теезь.

ionic-compound-needs-cation-and-anion = Иононь сюлмавксось ансяк вейке катионтень ды вейке анионтень теезь.

solve-equations-cannot-evaluate = Уравнениянть теемс а маштови, эдь сонзэ ловомс эзь маштово: { $equation }

math-operators-operand-number-required = Математикань операндонть явовтомга operandNumber максомс эряви.

eigen-decomposition-failed = Матрицань эсь питнензэ ловомс эзь маштово

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметрась образецсэнть а вастневи, седе сон свал чавонтень вейсэнди.
       *[other] `<matchesPattern>`: { $parameters } параметртне образецсэнть а вастневить, седе сынь свал чавонтень вейсэндить.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" питненть чарькодемс а маштови. Сон none, medium, dense эли чаво таркасо явовтозь кавто плюс ловома улемс эряви, кода grid="1 0.5". Сеткась а артови.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure артыцясонть xLabelPosition="left" а теезь; вить пелень аштема тевс нолдави.

prefigure-y-label-position-unsupported = `<graph>`: prefigure артыцясонть yLabelPosition="bottom" а теезь; вере пелень аштема тевс нолдави.

prefigure-invalid-axis-bounds = `<graph>`: prefigure ютавтомантень тенгетнень пест а видеть; основной bbox (-10,-10,10,10) тевс нолдави.

prefigure-invalid-width = `<graph>`: prefigure ютавтомантень келезэ а виде; диаграммань основной келезэ 425 тевс нолдави.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ютавтомантень aspectRatio а виде; основной пелькстнэнь вейсэндявксост 1 тевс нолдави.

prefigure-grid-spacing-too-fine = `<graph>`: сеткань эскелксэзэ тенгетнень пестэнзэ пек вишкине; prefigure артыцясонть сеткась а невтеви.

prefigure-annotations-not-rendered = `<graph>`: PreFigure артыцясь а тевс нолдави бути, тешкстамотне а артовить.

multiple-annotations-children = `<graph>` потсо ламо `<annotations>` эйкакш муезь; меельцеденть башка лиятне а ловновить.

## Referring to other components

copy-unrecognized-component-type = Асодавикс компонентэнь ладонть келейгавтомс эли копировамс а маштови: { $type }.

copy-prop-not-found = { $component } ладсо компонентсэнть { $property } свойства эзь муеве

collect-no-source = collect лангс лисьма эзь муеве.

collect-invalid-component-type = `<{ $component }>` ладсо компоненттнэнь пурнамс а маштови, эдь те а виде компонентэнь лад.

reference-index-unavailable = `{ $reference }` индекс лангс сюлмавкс теемс а маштови

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентсэнть { $action } тердемс а маштови

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Даннойтнень ладост а виде. Рядтнэнь кувалмост а вейкетть. Муезь componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Даннойтнесэ баганонь лемтне омбоцеде вастневить. Муезь componentIdx :{ $componentIdx }

data-frame-missing-column-name = Даннойтнесэ баганонь лем а сатни. Муезь componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Те каршо валонь award питнезэ answer тегень эсензэ кучозь каршо вал лангс аштевти, те а учовикс тевтненень пачти.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` марто контейнер потсо `<answer>` лангс `maxNumAttempts` путомась а токши, эдь снартнематнень ламоксчист контейнерэсь содасы. `maxNumAttempts` питненть контейнер лангс путык.

nested-section-wide-check-work-max-num-attempts = Лия `sectionWideCheckWork` контейнер потсо аштиця `sectionWideCheckWork` контейнер лангс `maxNumAttempts` путомась а токши, эдь снартнематнень ламоксчист ушо контейнерэсь содасы. `maxNumAttempts` питненть ушо контейнер лангс путык.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality а путозь бути, { $attributes } атрибутось а токши.
       *[other] symbolicEquality а путозь бути, { $attributes } атрибуттнэ а токшить.
    }

answer-invalid-type = answer лангс а виде лад: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентэнь лемезэ арась, седе сонзэ модулень атрибут ладсо тевс нолдамс а маштови

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентэнть модулень атрибут ладсо тевс нолдамс а маштови, эдь `<module>` компонентэнь ладсонть «{ $name }» атрибутось уш содазь.

conditional-content-condition-ignored = case эли else эйкакшт марто `<conditionalContent>` компонентсэнть `condition` атрибутось а ловови.

slider-markers-type-mismatch = Маркертнэнь ладост ползунокань ладонтень а вейсэнди.

pretzel-problem-needs-statement-and-answer = А виде pretzel: эрьва `<problem>` вейке `<statement>` ды вейке `<answer>` потмозонзо саемс эряви.

pretzel-circuit-first-problem-distractor = А виде pretzel: mode="circuit" режимсэ васенце `<problem>` мельть ёно ветиця улемс а маштови.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибутонтень а виде питне { $values }; а ловови.
       *[other] `{ $attribute }` атрибутонтень а виде питнеть { $values }; а ловновить.
    }

attribute-must-be-references = `{ $attribute }` атрибутонтень а виде питне `{ $value }`. Атрибутось `$` тешкстэ ушодовиця сюлмавкстнэде улемс эряви.

math-input-invalid-function-names = <mathInput>: { $attribute } потсо а виде функциянь лемтне эзть ловново: { $names }. Эрьва лемень неявиця пельксэзэ сехте аламо 2 тешкс улемс эряви (букват эли чирькст); сонзэ мельга а эрявикс `|<mathspeak альтернатива>` поладкс сы маштови.

## Building components from the source

component-type-invalid = А виде компонентэнь лад: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутонть омбоцеде теемс а маштови.

attribute-invalid-for-component = `<{ $componentType }>` ладсо компонентэнтень а виде атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стилень меремасонть { $context ->
        [text-on-background] текстэнь тюсось ды фононь тюсось
        [high-contrast] покш контраст марто тюс ды артома тарка
        [line] линиянь тюсось ды артома тарка
        [marker] маркерэнь тюсось ды артома тарка
       *[text-on-canvas] текстэнь тюсось ды артома тарка
    } ютксо контрастось а сатни{ $mode ->
        [dark] { " (чопода лад)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сехте аламо { $threshold }:1 эряви).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стилень меремасонть максозь тюстнэ валдо ладонтень сатышка контраст максть бути, сынст эйстэ лисезь чопода ладонь тюстнэ текстэнь ды фононь ютксо сатышка контраст а максыть ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сехте аламо { $threshold }:1 эряви). { $suggestion ->
        [available] Чопода ладсо сатышка контрастонь кисэ валдо ладонь контрастонть покшолгавтык (кода { $lightAttribute }="{ $lightColor }"), эли чопода ладонь тюсонть полавтык (кода { $darkAttribute }="{ $darkColor }").
       *[none] Чопода ладсо сатышка контрастонь кисэ валдо ладонь контрастонть покшолгавтык эли лисезь тюстнэнь textColorDarkMode ды/эли backgroundColorDarkMode вельде полавтык.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стилень меремасонть максозь текстэнь тюсось валдо ладонтень сатышка контраст максь бути, сонзэ эйстэ лисезь чопода ладонь текстэнь тюсось артома тарка марто сатышка контраст а максы ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сехте аламо { $threshold }:1 эряви). { $suggestion ->
        [available] Чопода ладсо сатышка контрастонь кисэ валдо ладонь контрастонть покшолгавтык (кода textColor="{ $lightColor }"), эли чопода ладонь тюсонть полавтык (кода textColorDarkMode="{ $darkColor }").
       *[none] Чопода ладсо сатышка контрастонь кисэ валдо ладонь контрастонть покшолгавтык эли лисезь тюсонть textColorDarkMode вельде полавтык.
    }

section-multiple-style-palettes = Пелькскесь ансяк вейке <stylePalette> кочкамс маштови; меельцесь тевс нолдави.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } лангс а вастневиця вариантнэнь содамс а маштови, эдь numToSelect минус аволь целой ловома арась.

variant-num-to-select-not-constant-number = { $component } лангс а вастневиця вариантнэнь содамс а маштови, эдь numToSelect а полавтовиця ловома арась.

variant-with-replacement-not-constant-boolean = { $component } лангс а вастневиця вариантнэнь содамс а маштови, эдь withReplacement а полавтовиця логикань питне арась.

variant-select-weight-disables-unique = кодамояк кочкамосо selectWeight эли selectForVariants максозь бути, select лангс а вастневиця вариантнэ мадить

variant-coprime-undetermined = { $component } лангс а вастневиця вариантнэнь содамс а маштови, эдь coprime свал а виде-арась, сень содамс а маштови.

variant-attribute-not-constant = { $component } лангс а вастневиця вариантнэнь содамс а маштови, эдь { $attribute } а полавтовиця арась.

variant-attribute-not-number = { $component } лангс а вастневиця вариантнэнь содамс а маштови, эдь { $attribute } ловома арась.

variant-attribute-wrong-type-for-sequence =
    { $type } ладсо { $component } лангс а вастневиця вариантнэнь содамс а маштови, эдь { $attribute } { $expected ->
        [letters-combination] буквань вейсэндявкс
        [math-expression] маштовикс математикань ёвтамо
        [integer] целой ловома
       *[number] ловома
    } арась.

variant-length-not-integer = { $component } лангс а вастневиця вариантнэнь содамс а маштови, эдь length целой ловома арась.

variant-sort-not-implemented = sort марто { $component } лангс а вастневиця вариантнэ а теезь

variant-exclude-combinations-not-implemented = excludeCombinations марто { $component } лангс а вастневиця вариантнэ а теезь

variant-math-exclude-not-implemented = exclude марто math ладсо { $component } лангс а вастневиця вариантнэ а теезь

variant-non-constant-exclude-not-implemented = а полавтовиця арась exclude марто { $component } лангс а вастневиця вариантнэ а теезь

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графикень prefigure артыцясонть а теезь; буезэ кадовсь.

prefigure-descendant-invalid-geometry = { $subject }: пезэ арась эли а сатышка геометрия; буезэ кадовсь.

prefigure-curve-label-omitted = { $subject }: ютавтозь кичкере элементнэсэ тешкстнэ а теезь; тешксэсь кадовсь.

prefigure-curve-unsupported-definition-type = { $subject }: а теезь кичкере функциянь меремань лад «{ $definitionType }»; буезэ кадовсь.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементэнь flipFunctions атрибутось а теезь; буезэ кадовсь.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves ансяк формуласо максозь эйкакш функциятнень саи; буезэ кадовсь.

prefigure-label-position-unsupported =
    { $subject }: а теезь labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] линиянь кудораськень тешксэнтень
       *[point] точкань тешксэнтень
    }; PreFigure-нь основной вейсэндявтомась тевс нолдави.

prefigure-fill-style-unsupported = { $subject }: пештямонь стилесь «{ $fillStyle }» PreFigure лангс а теезь; пешксе пештямос юты.

prefigure-line-style-unknown = { $subject }: асодавикс линиянь стилесь «{ $lineStyle }» PreFigure лисемастонть саезь.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркерэнь стилесь «{ $markerStyle }» PreFigure «diamond» стиль марто вейсэндявтозь.

prefigure-marker-style-unsupported = { $subject }: маркерэнь стилесь «{ $markerStyle }» PreFigure лангс а теезь; основной стиль тевс нолдави.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: а виде `ref`; цельть сюлмамс а маштови. Тешкстамось саезь.

annotation-ref-multiple-targets = `<annotation>`: `ref` ламо цель марто сюлмавсь; васенцесь тевс нолдави.

annotation-ref-outside-graph = `<annotation>`: а виде `ref`; целесь сонзэ потмозонзо саиця графикенть ушосо. Тешкстамось саезь.

annotation-ref-unsupported-target = `<annotation>`: а виде `ref`; целесь prefigure ютавтомасонть теезь график объект арась. Тешкстамось саезь.

annotation-text-missing = `<annotation>`: `text` арась эли чаво; чаво текст лиси.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Кружамонь лепштявома муезь.
       *[other] `<{ $componentType }>` компонентэнть потмозонзо саиця кружамонь лепштявома муезь.
    }

reference-no-referent = Сюлмавксонтень объект эзь муеве: `{ $reference }`

reference-multiple-referents = Сюлмавксонтень ламо объект муезь: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементэнь { $attribute } атрибутонь форматозо а виде.

children-invalid = `<{ $componentType }>` лангс а виде эйкакшт: а виде эйкакшт муезь: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибутонтень а виде питне `{ $value }`; `{ $default }` питнесь тевс нолдави

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версиясь эзь муеве.
       *[other] DoenetML { $version } версиясь эзь муеве. { $fallback } версиясь тевс нолдави
    }

## Reading the DoenetML

parse-invalid-doenetml = А виде DoenetML: { $content }

parse-tag-missing-close-tag = А виде DoenetML: `{ $tag }` тегень пекстыця тегезэ арась. Эсь прянзо пекстыця тег эли `</{ $tagName }>` тег учовсь.

parse-tag-error = А виде DoenetML: `<{ $tagName }>` тегсэнть ильведевкс

parse-attribute-missing-value = А виде DoenetML: `{ $attribute }` атрибутсонть питне а сатни ладсо.

parse-attribute-invalid = А виде DoenetML: а виде атрибут `{ $attribute }`

parse-attribute-value-invalid = А виде DoenetML: атрибутонь а виде питне `{ $value }`

parse-attribute-value-quote-mismatch = А виде DoenetML: атрибутонь а виде питне `{ $value }`. Кавычкатне а вейсэндить. `{ $quote }` а сатни ладсо

parse-open-tag-name-missing = А виде DoenetML: лемтеме тег муезь, кода `<`

parse-tag-not-closed = А виде DoenetML: `{ $tag }` тегесь а пекстазь (`>` а сатни ладсо).

parse-self-closing-tag-name-missing = А виде DoenetML: лемтеме тег муезь `<{ $content }>`

parse-self-closing-tag-not-closed = А виде DoenetML: `{ $tag }` тегесь а пекстазь (`/>` а сатни ладсо).

parse-tag-invalid-attributes = А виде DoenetML: `{ $tag }` тегесь маштовикс арась. Сонзэ атрибутонзо а видеть улемс маштовить.

parse-close-tag-name-missing = А виде DoenetML: лемтеме пекстыця тег муезь, кода `</`

parse-attribute-value-unquoted = Атрибутонь питнетне кавычка потсо улемс эрявить: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = А виде DoenetML: `{ $tag }` пекстыця тег муезь, ансяк сонензэ вейсэндиця панжиця тег арась

parse-close-tag-mismatched = А виде DoenetML: а вейсэндиця пекстыця тег. `</{ $expected }>` учовсь. `{ $found }` муезь

parser-node-unconvertible = { $node } узелэнть Dast узелс ютавтомс эзь маштово.

## Names

name-attribute-invalid =
    А виде атрибут name='{ $name }'. { $reason ->
        [characters] Лемтнесэ ансяк букват, ловомат, ало чирькст эли чирькст улемс маштовить.
       *[start] Лемтне буквасто ушодовомс эрявить.
    }

component-name-invalid-start = А виде компонентэнь лем «{ $name }». Лемтне буквасто ушодовомс эрявить.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched ладсо answer-энь video атрибутозо улемс эряви

answer-video-watched-video-not-reference = videoWatched ладсо answer-энь video атрибутозо сюлмавкс улемс эряви

answer-name-not-single-text = answer-энь name атрибутсонзо ансяк вейке текстэнь эйкакш улемс эряви

## Referencing another document

external-doenetml-recursion-limit = Рекурсиянь пелькстнэ пек ламот, седе ушо DoenetML саемс эзь маштово. Кружамонь сюлмавкс арась?

external-doenetml-unavailable = { $attribute }="{ $uri }" адрестэ DoenetML саемс эзь маштово

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адрестэ а виде DoenetML саезь: сон «{ $componentType }» компонентэнь ладонтень эзь вейсэнде

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибутось сыредсь; сонзэ таркас `{ $to }` тевс нолдак.
       *[other] [deprecation] `<{ $component }>` элементэнь `{ $from }` атрибутось сыредсь; сонзэ таркас `{ $to }` тевс нолдак.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибутось сыредсь ды а ловови, эдь `{ $to }` тожо максозь.
       *[other] [deprecation] `<{ $component }>` элементэнь `{ $from }` атрибутось сыредсь ды а ловови, эдь `{ $to }` тожо максозь.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементэнь `{ $attribute }` атрибутось сыредсь ды а ловови.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элементэнь `{ $attribute }` атрибутось сыредсь; сонзэ таркас `<{ $child }>` эйкакш тевс нолдак.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элементэнь `{ $attribute }` атрибутонь `{ $value }` питнезэ сыредсь; сонзэ таркас `{ $to }` тевс нолдак.


## Language coverage

pluralize-english-only = `<pluralize>` ламоксчинть ансяк англань кельсэ теемс маштови, седе { $locale } кельсэ сёрмадозь документсэнть сонзэ текстэзэ апак полавто кадови. Ламоксчинь форманть эсь прят сёрмадык эли сонзэ `pluralForm` атрибут вельде максык.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элементэсь содавикс Doenet элемент арась.

schema-element-not-allowed-at-root = `<{ $tag }>` элементэнтень документэнь ундоксонть а мереви.

schema-element-not-allowed-inside = `<{ $tag }>` элементэнтень `<{ $parent }>` потсо а мереви.

schema-attribute-unrecognized = `<{ $tag }>` элементсэнть `{ $attribute }` лем марто атрибут арась.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементэнь `{ $attribute }` атрибутось эрьва элементэзэ нетнеде вейке улиця список улемс эряви: { $allowed }
       *[other] `<{ $tag }>` элементэнь `{ $attribute }` атрибутось нетнеде вейке улемс эряви: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select лангс а виде вариантонь лем. { $variantName } вариантонь лемесь { $numOptions } кочкамосо вастневи, а кочкамс эрявикс ламоксчись { $numToSelect }.

select-variant-name-without-options = select лангс вариантт максозь, ансяк маштовикс вариантонь лемнентень вейкеяк кочкамо арась: { $variantName }.

select-variant-name-not-possible = select лангс максозь { $variantName } вариантонь лемесь маштовикс вариантонь лем арась.

select-too-few-options = Весемезэ { $numOptions } эйстэ { $numToSelect } компонент кочкамс а маштови.

select-from-sequence-too-few-values = Кувалмозо { $length } мельга-мельгастонть { $numToSelect } питне кочкамс а маштови.

select-from-sequence-indices-count-mismatch = select лангс максозь индекстнэнь ламоксчист кочкамс эрявикс ламоксчинтень вейсэндявомс эряви

select-from-sequence-indices-not-integers = select лангс максозь весе индекстнэ целой ловома улемс эрявить

select-from-sequence-index-excluded = selectfromsequence лангс максозь индексэсь саезель

select-from-sequence-indices-excluded-combination = selectfromsequence лангс максозь индекстнэ саезь вейсэндявкс ульнесть

select-from-sequence-coprime-not-positive-integers = Плюс целой ловоматне а кочказь, седе вейкест-вейкест кисэ простой вейсэндявкстнэнь кочкамс а маштови.

select-from-sequence-coprime-common-factor = Вейкест-вейкест кисэ простой ловоматнень кочкамс а маштови. Весе маштовикс питнетнень вейсэнь явицяст ули. (Максозь "from" эли "to" питнетне "step" марто вейкест-вейкест кисэ простой улемс эрявить.)

select-from-sequence-coprime-single-number = 1 арась вейке ловомасто вейкест-вейкест кисэ простой вейсэндявкстнэнь кочкамс а маштови.

select-from-sequence-excluded-too-many-combinations = selectFromSequence потсо вейсэндявкстнэде 70%-де ламось саезь

select-from-sequence-coprime-none-found = Вейкест-вейкест кисэ простой ловоматнень кочкамс эзь маштово. Весе маштовикс питнетнень вейсэнь явицяст ули.

select-from-sequence-too-few-unique-values = Кувалмозо { $numPossibleValues } мельга-мельгастонть { $numToSelect } явовиця питне кочкамс а маштови

select-prime-numbers-too-few-values = Кувалмозо { $numValues } простой ловомань спискестэ { $numToSelect } питне кочкамс а маштови

select-prime-numbers-values-count-mismatch = select лангс максозь питнетнень ламоксчист кочкамс эрявикс ламоксчинтень вейсэндявомс эряви

select-prime-numbers-values-not-prime = select prime number лангс максозь весе питнетне простой ловомань спискесэ улемс эрявить

select-prime-numbers-values-excluded-combination = selectPrimeNumbers лангс максозь питнетне саезь вейсэндявкс ульнесть

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers потсо вейсэндявкстнэде 70%-де ламось саезь

select-random-combination-fluke = Пек а маштовикс тевень кувалт эрьва кодамо питнетнень вейсэндявксост кочкамс эзь маштово

select-random-value-fluke = Пек а маштовикс тевень кувалт эрьва кодамо питненть кочкамс эзь маштово
