# Moksha diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **This file is the answer `locales/myv`'s header asks for.** That header says
# that Erzya and Moksha are two languages, not two spellings of one; that ISO
# 639-3 gives them `myv` and `mdf` separately with no macrolanguage code over
# them; that a Moksha reader arriving under `mdf` therefore "reaches English
# rather than this file"; and that "the answer to it is a `locales/mdf` beside
# this one, not a widening of this one". This is that catalog. It is a separate
# catalog, not a widening of `locales/myv`: nothing about `locales/myv` changes,
# and neither file is a fallback for the other.
#
# Written in Cyrillic, which is the orthography Mordovia's schools and
# publishing use for Moksha and what CLDR fills a bare `mdf` in as.
#
# Moksha has no grammatical gender and does not inflect an attributive
# adjective, so `$gender` and `$role` go unused, exactly as in `locales/myv`.
#
# The seed reached Moksha through the correspondences that separate it from
# Erzya in the words these files contain:
#
#   negation                «аф», «аш» for Erzya «а», «аволь», «арась»;
#                           «изь» for Erzya «эзь»
#   participle              -ф for Erzya -зь: максф, тиф, муф, артф
#   -фкс for Erzya -вкс     сюлмафкс (myv: сюлмавкс)
#   inessive/elative        -са, -ста for Erzya -сэ/-со, -стэ/-сто:
#                           ширеса, лангса (myv: чиресэ, лангсо)
#   -нза, -ть, -тне         for Erzya -нзэ, -нть, -тнэ
#   loan adjectives         -ай for Erzya -ой: серай, фиолетовай
#   lexicon                 мархта, инкса, кда, фкя, аньцек, лама, сяда, и
#                           (myv: марто, кисэ, бути, вейке, ансяк, ламо, седе,
#                           ды)
#   numerals                фкя, кафта, колма (myv: вейке, кавто, колмо), and
#                           the ablative on them in -да: фкяда, кафтада
#                           (myv: вейкеде, кавтодо)
#
# **Where the seed did not know Moksha's own word it left the shape Moksha and
# Erzya share**, rather than inventing one. Those are the first thing a speaker
# should correct, and they are the reason this catalog reads closer to
# `locales/myv` than a Moksha speaker will want it to. Four residues are known
# rather than guessed at, and are the next things to fix: the ablative is still
# written Erzya-style `-де/-до` outside the numerals («нетнеде»,
# «сюлмафкстнеде») where Moksha writes `-да`; the abessive is `-втомо`
# («таркавтомо», «точкавтомо») where Moksha writes `-фтома`; "equal" is
# «вейкетть», an Erzya form this seed could not confidently replace; and the
# lexicon row's «лама» reached only the bare word — everything built on it is
# still Erzya-shaped («ламоксчист», «ламоксчинтень», «аламо»,
# «коламо», «ламось»), because the seed could not establish Moksha's
# abstract-noun suffix here and declined to invent the case forms. The numerals
# and their ablative have been corrected — every `-да` on a digit below is the
# Moksha ending — so what is left is in the other endings rather than in the
# stems.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# The technical nouns are the Russian ones, which is what written Moksha uses
# for them: «компонент», «атрибут», «функция», «индекс».


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] кафта пень точкатне невтезь кда, { $attributes } аф ловови
       *[other] кафта пень точкатне невтезь кда, { $attributes } аф ловови
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] пень точкась и куншка точкась кавонест невтезь кда, { $attributes } аф ловови
       *[other] пень точкась и куншка точкась кавонест невтезь кда, { $attributes } аф ловови
    }

line-segment-midpoint-offset-without-midpoint = куншка точкавтомо midpointOffset мезескак аф токши

## `<line>`

line-points-undetermined-dimensions = Онксозо асодавикс точкатнень пачк ютыця виде линия.

line-points-too-few-dimensions = Виде линиясь сехте аламо кафта онксса точкатнень пачк ютомо эряви.

line-points-depend-on-variables = Виде линиясь полавтовиця онкстнеде лепштявиця точкатнень пачк юты: { $variables }.

line-equation-invalid-format = { $variable1 } и { $variable2 } полавтовиця онксса виде линиянь уравнениять форматозо аф виде.

## `<ray>`

ray-overprescribed-through = Лучось through, endpoint и direction пачк максф. Максф through аф ловови.

ray-dimension-mismatch = лучсоть numDimensions аф вейсэнди.

## `<vector>`

vector-overprescribed-head = Векторось head, tail и displacement пачк максф. Максф head аф ловови.

vector-dimension-mismatch = векторсоть numDimensions аф вейсэнди.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элементэнтень таргамс аф маштови, эдь сонь nearestPoint статусонь полавтовицязо аш.

constrain-to-without-nearest-point = `<{ $component }>` элементса пежедемс аф маштови, эдь сонь nearestPoint статусонь полавтовицязо аш.

constrain-to-interior-without-nearest-point = `<{ $component }>` элементэнь потмосонзо пежедемс аф маштови, эдь сонь nearestPoint статусонь полавтовицязо аш.

## `<choiceInput>`

choice-input-label-position-ignored = ряд потса аф choiceInput ланкс labelPosition аф ловови

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput ланкс максф индекстне аф ловновить, эдь сынст ламоксчист choice эйкакштнень ламоксчинтень аф вейсэнди.

pretzel-indices-count-mismatch = problem ланкс максф индекстне аф ловновить, эдь сынст ламоксчист problem эйкакштнень ламоксчинтень аф вейсэнди.

shuffle-indices-count-mismatch = shuffle ланкс максф индекстне аф ловновить, эдь сынст ламоксчист компоненттнень ламоксчинтень аф вейсэнди.

indices-ignored-out-of-range = { $component } ланкс максф индекстне аф ловновить, эдь конатнеяк пелькстамодо лисить.

pretzel-indices-repeated = pretzel ланкс максф индекстне аф ловновить, эдь конатнеяк омбоцеде вастневить.

pretzel-circuit-first-index = circuit режимса pretzel ланкс максф индекстне аф ловновить, эдь васенце индексэсь 1 улемс эряви.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текстэнь эйкакштне мархта важодемга `type` атрибут максомс эряви.

invalid-type-defaulting-to-math = { $component } компонентэнтень аф виде лад { $type }. Сон math, text, number эли boolean улемс эряви. math тевс нолдави.

string-not-valid-component-to-arrange = «{ $value }» рядось { $component } ланкс маштовикс компонент аш. Аф ловови.

## Types and variables

invalid-type-defaulting-to-number = Аф виде лад { $type }, ладозо number ули.

invalid-variable-value = Полавтовицянь аф виде питне: `{ $value }`

## Variants

variant-index-must-be-number = { $index } вариантонь индексэсь ловома улемс эряви

variant-index-must-be-integer = { $index } вариантонь индексэсь целай ловома улемс эряви

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолютнай онкстненень аф тиф. Келест вейсэндявикс улить.

side-by-side-absolute-margins = `<{ $component }>` абсолютнай онкстненень аф тиф. Чирест вейсэндявикс улить.

side-by-side-no-block-child = Аф виде `<{ $component }>`: сонь сехте аламо фкя блок эйкакшозо улемс эряви.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элементэнь `for` атрибутось аф ловови.

label-for-must-resolve-to-one = `<label>` элементэнь `for` атрибутось аньцек фкя компонент ланкс невтемс эряви.

label-for-unresolved = `<label>` элементэнь `for` атрибутоть компонент мархта сюлмамс изь маштово.

label-for-answer-with-authored-inputs = `<label>` элементэнь `for` атрибутось авторонь сёрмадозь совавтома таркат мархта `<answer>` ланкс невти; таркантень видеста невтик.

label-for-answer-without-input = `<label>` элементэнь `for` атрибутось совавтома таркавтомо `<answer>` ланкс невти.

label-for-must-reference-input-or-answer = `<label>` элементэнь `for` атрибутось совавтома тарка эли каршо вал ланкс невтемс эряви.

## Accessibility

accessibility-short-description-or-decorative = Пачкодемань инкса `<{ $component }>` эли нурька невтема мархта улемс эряви, эли мазылгавтома ладса тешкстамс.

accessibility-video-short-description = Пачкодемань инкса `<video>` нурька невтема мархта улемс эряви.

accessibility-input-short-description-or-label = Пачкодемань инкса `<{ $component }>` нурька невтема эли тешкс мархта улемс эряви.

accessibility-answer-input-short-description-or-label = Пачкодемань инкса совавтома тарка теиця `<answer>` нурька невтема эли тешкс мархта улемс эряви.

accessibility-short-description-contains-math = Нурька невтематнеса `<{ $component }>` ладса математикань компоненттне улемс аф эрявить. Математикать валса сёрмадык.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } пелькскень прявт текстэнтень сатышка контраст аф максы (чопода лад) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сехте аламо { $threshold }:1 эряви).
       *[other] { $colorName } пелькскень прявт текстэнтень сатышка контраст аф максы ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сехте аламо { $threshold }:1 эряви).
    }

## `<circle>`

circle-through-points-non-numerical = Точкатнень ловома питнест арасть кда, { $count } точкань пачк ютыця `<circle>` аф тиф.

circle-too-many-through-points = 3-да лама точкань пачк ютыця круготь ловомс аф маштови.

circle-overprescribed-radius-center-points = Максф радиус, куншка и точкат мархта круготь ловомс аф маштови.

circle-center-with-multiple-points = Максф куншка мархта 1-да лама точкань пачк ютыця круготь ловомс аф маштови.

circle-radius-too-small = Круготь ловомс аф маштови: кафта точкатнень ютксост { $distance } кда, максф радиусось { $radius } пек вишкине.

circle-radius-with-many-points = Максф радиус мархта кафтада лама точкань пачк ютыця круг теемс аф маштови.

circle-invalid-center-or-through-points = Кругонь куншказо эли точканзо аф видеть.

circle-radius-center-with-multiple-points = Максф куншка мархта 1-да лама точкань пачк ютыця кругонь радиусонзо ловомс аф маштови.

circle-change-radius-non-numerical = Ловома аф точкат мархта кругонь радиусонзо полавтомс аф маштови

circle-radius-with-points-non-numerical = Ловома питнеть арасть кда, максф радиус мархта фкяда лама точкань пачк ютыця круг теемс аф маштови.

circle-change-center-non-numerical = Ловома аф точкань пачк ютыця кругонь куншканзо полавтомась аф тиф.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функциянь содавикс таркать онксозо аф сатни. Таркасоть { $intervals } ютко ули, аф функциясоть { $inputs ->
            [one] { $inputs } совавтома
           *[other] { $inputs } совавтома
        } ули.
       *[other] Функциянь содавикс таркать онксозо аф сатни. Таркасоть { $intervals } ютко ули, аф функциясоть { $inputs ->
            [one] { $inputs } совавтома
           *[other] { $inputs } совавтома
        } ули.
    }

function-domain-invalid-format = Функциянь содавикс таркать форматозо аф виде.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функциянь ловома аф максимумозо аф ловови.
        [minimum] Функциянь ловома аф минимумозо аф ловови.
        [extremum] Функциянь ловома аф экстремумозо аф ловови.
        [point] Функциянь ловома аф точказо аф ловови.
        [slope] Функциянь ловома аф чирезэ аф ловови.
       *[other] Функциянь ловома аф { $type } питнезэ аф ловови.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функциянь шава максимумозо аф ловови.
        [minimum] Функциянь шава минимумозо аф ловови.
        [extremum] Функциянь шава экстремумозо аф ловови.
        [point] Функциянь шава точказо аф ловови.
       *[other] Функциянь шава { $type } питнезэ аф ловови.
    }

function-points-too-close = Функциясоть фкяст-фкяст пек маласа кафта точкат улить. Функциять содамс аф маштови.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функциянь итерациятне маштовить аньцек совавтоматнень ламоксчист лисематнень ламоксчинтень вейкетть кда. Те функциясоть { $inputs } совавтома и { $outputs ->
            [one] { $outputs } лисема
           *[other] { $outputs } лисема
        } ули.
       *[other] Функциянь итерациятне маштовить аньцек совавтоматнень ламоксчист лисематнень ламоксчинтень вейкетть кда. Те функциясоть { $inputs } совавтома и { $outputs ->
            [one] { $outputs } лисема
           *[other] { $outputs } лисема
        } ули.
    }

## `<sequence>`

sequence-invalid-length = Мельга-мельгань кувалмозо аф виде. Сон минус аф целай ловома улемс эряви.

sequence-invalid-step = Мельга-мельгань эскелксэзэ аф виде. { $type } ладса мельга-мельгантень сон ловома улемс эряви.

sequence-invalid-endpoint-number = Ловомань мельга-мельгань «{ $attribute }» питнезэ аф виде. Сон ловома улемс эряви.

sequence-invalid-endpoint-letters = Буквань мельга-мельгань «{ $attribute }» питнезэ аф виде. Сон буквань вейсэндяфкс улемс эряви.

sequence-invalid-endpoint = Мельга-мельгань «{ $attribute }» питнезэ аф виде.

select-from-sequence-coprime-not-numbers = ловоматне аф кочкаф, сяда coprime аф ловови

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations максф, сяда coprime аф ловови

## Resolving a `target`

target-not-found = `<{ $source }>` ланкс аф виде target: цель изь муеве.

target-state-variable-not-found = `<{ $source }>` ланкс аф виде target: `<{ $component }>` элементса «{ $property }» лем мархта статусонь полавтовиця изь муеве.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` полавтовицянзо эсь прянь полавтовицядоть явовомс эрявить.

ode-system-duplicate-variable-names = Лепштявиця полавтовицятнень лемест омбоцеде вастневить кда, ДТ вить пелень функциятнень содамс аф маштови.

ode-system-rhs-function-error = ДТ вить пелень функциять содамс аф маштови. mathjs функциять теемста ильведефкс.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } виде линиянь юткса ужоть содамс аф маштови

angle-invalid-through-point = `<angle>` элементэнь through питнесэть аф виде точка

parabola-vertex-too-many-points = Максф пря мархта 1-да лама точкань пачк ютыця парабола аф тиф.

parabola-too-many-points = 3-да лама точкань пачк ютыця парабола аф тиф.

intersection-too-many-items = Кафтада лама объектэнь вастневемась аф тиф

## Other math components

ionic-compound-not-two-ions = Кавто иондо башка иононь сюлмафкст аф тиф.

ionic-compound-needs-cation-and-anion = Иононь сюлмафксось аньцек фкя катионтень и фкя анионтень тиф.

solve-equations-cannot-evaluate = Уравнениять теемс аф маштови, эдь сонь ловомс изь маштово: { $equation }

math-operators-operand-number-required = Математикань операндоть явовтомга operandNumber максомс эряви.

eigen-decomposition-failed = Матрицань эсь питненза ловомс изь маштово

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметрась образецсэть аф вастневи, сяда сон свал чавонтень вейсэнди.
       *[other] `<matchesPattern>`: { $parameters } параметртне образецсэть аф вастневить, сяда сынь свал чавонтень вейсэндить.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" питнеть чарькодемс аф маштови. Сон none, medium, dense эли шава таркаса явовтозь кафта плюс ловома улемс эряви, кода grid="1 0.5". Сеткась аф артови.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure артыцясоть xLabelPosition="left" аф тиф; вить пелень аштема тевс нолдави.

prefigure-y-label-position-unsupported = `<graph>`: prefigure артыцясоть yLabelPosition="bottom" аф тиф; вере пелень аштема тевс нолдави.

prefigure-invalid-axis-bounds = `<graph>`: prefigure ютавтомантень тенгетнень пест аф видеть; основнай bbox (-10,-10,10,10) тевс нолдави.

prefigure-invalid-width = `<graph>`: prefigure ютавтомантень келезэ аф виде; диаграммань основнай келезэ 425 тевс нолдави.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ютавтомантень aspectRatio аф виде; основнай пелькстнень вейсэндяфксост 1 тевс нолдави.

prefigure-grid-spacing-too-fine = `<graph>`: сеткань эскелксэзэ тенгетнень пестэнза пек вишкине; prefigure артыцясоть сеткась аф невтеви.

prefigure-annotations-not-rendered = `<graph>`: PreFigure артыцясь аф тевс нолдави кда, тешкстамотне аф артовить.

multiple-annotations-children = `<graph>` потса лама `<annotations>` эйкакш муф; меельцедеть башка лиятне аф ловновить.

## Referring to other components

copy-unrecognized-component-type = Асодавикс компонентэнь ладоть келейгавтомс эли копировамс аф маштови: { $type }.

copy-prop-not-found = { $component } ладса компонентсэть { $property } свойства изь муеве

collect-no-source = collect ланкс лисьма изь муеве.

collect-invalid-component-type = `<{ $component }>` ладса компоненттнень пурнамс аф маштови, эдь те аф виде компонентэнь лад.

reference-index-unavailable = `{ $reference }` индекс ланкс сюлмафкс теемс аф маштови

## `<callAction>`

component-action-unavailable = `{ $reference }` компонентсэть { $action } тердемс аф маштови

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Даннайтнень ладост аф виде. Рядтнень кувалмост аф вейкетть. Муезь componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Даннайтнеса баганонь лемтне омбоцеде вастневить. Муезь componentIdx :{ $componentIdx }

data-frame-missing-column-name = Даннайтнеса баганонь лем аф сатни. Муезь componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Те каршо валонь award питнезэ answer тегень эсенза кучф каршо вал ланкс аштевти, те аф учовикс тевтненень пачти.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` мархта контейнер потса `<answer>` ланкс `maxNumAttempts` путомась аф токши, эдь снартнематнень ламоксчист контейнерэсь содасы. `maxNumAttempts` питнеть контейнер ланкс путык.

nested-section-wide-check-work-max-num-attempts = Лия `sectionWideCheckWork` контейнер потса аштиця `sectionWideCheckWork` контейнер ланкс `maxNumAttempts` путомась аф токши, эдь снартнематнень ламоксчист ушо контейнерэсь содасы. `maxNumAttempts` питнеть ушо контейнер ланкс путык.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality аф путозь кда, { $attributes } атрибутось аф токши.
       *[other] symbolicEquality аф путозь кда, { $attributes } атрибуттне аф токшить.
    }

answer-invalid-type = answer ланкс аф виде лад: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонентэнь лемезэ аш, сяда сонь модулень атрибут ладса тевс нолдамс аф маштови

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентэть модулень атрибут ладса тевс нолдамс аф маштови, эдь `<module>` компонентэнь ладсоть «{ $name }» атрибутось уш содазь.

conditional-content-condition-ignored = case эли else эйкакшт мархта `<conditionalContent>` компонентсэть `condition` атрибутось аф ловови.

slider-markers-type-mismatch = Маркертнень ладост ползунокань ладонтень аф вейсэнди.

pretzel-problem-needs-statement-and-answer = Аф виде pretzel: эрьва `<problem>` фкя `<statement>` и фкя `<answer>` потмозонзо саемс эряви.

pretzel-circuit-first-problem-distractor = Аф виде pretzel: mode="circuit" режимса васенце `<problem>` мельть ёно ветиця улемс аф маштови.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибутонтень аф виде питне { $values }; аф ловови.
       *[other] `{ $attribute }` атрибутонтень аф виде питнеть { $values }; аф ловновить.
    }

attribute-must-be-references = `{ $attribute }` атрибутонтень аф виде питне `{ $value }`. Атрибутось `$` тешкста ушодовиця сюлмафкстнеде улемс эряви.

math-input-invalid-function-names = <mathInput>: { $attribute } потса аф виде функциянь лемтне эзть ловново: { $names }. Эрьва лемень неявиця пельксэзэ сехте аламо 2 тешкс улемс эряви (букват эли чирькст); сонь мельга аф эрявикс `|<mathspeak альтернатива>` поладкс сы маштови.

## Building components from the source

component-type-invalid = Аф виде компонентэнь лад: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибутоть омбоцеде теемс аф маштови.

attribute-invalid-for-component = `<{ $componentType }>` ладса компонентэнтень аф виде атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стилень меремасоть { $context ->
        [text-on-background] текстэнь тюсось и фононь тюсось
        [high-contrast] покш контраст мархта тюс и артома тарка
        [line] линиянь тюсось и артома тарка
        [marker] маркерэнь тюсось и артома тарка
       *[text-on-canvas] текстэнь тюсось и артома тарка
    } юткса контрастось аф сатни{ $mode ->
        [dark] { " (чопода лад)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сехте аламо { $threshold }:1 эряви).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стилень меремасоть максф тюстне валдо ладонтень сатышка контраст максть кда, сынст эйста лисьф чопода ладонь тюстне текстэнь и фононь юткса сатышка контраст аф максыть ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сехте аламо { $threshold }:1 эряви). { $suggestion ->
        [available] Чопода ладса сатышка контрастонь инкса валдо ладонь контрастоть покшолгавтык (кода { $lightAttribute }="{ $lightColor }"), эли чопода ладонь тюсоть полавтык (кода { $darkAttribute }="{ $darkColor }").
       *[none] Чопода ладса сатышка контрастонь инкса валдо ладонь контрастоть покшолгавтык эли лисьф тюстнень textColorDarkMode и/эли backgroundColorDarkMode вельде полавтык.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стилень меремасоть максф текстэнь тюсось валдо ладонтень сатышка контраст максь кда, сонь эйста лисьф чопода ладонь текстэнь тюсось артома тарка мархта сатышка контраст аф максы ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; сехте аламо { $threshold }:1 эряви). { $suggestion ->
        [available] Чопода ладса сатышка контрастонь инкса валдо ладонь контрастоть покшолгавтык (кода textColor="{ $lightColor }"), эли чопода ладонь тюсоть полавтык (кода textColorDarkMode="{ $darkColor }").
       *[none] Чопода ладса сатышка контрастонь инкса валдо ладонь контрастоть покшолгавтык эли лисьф тюсоть textColorDarkMode вельде полавтык.
    }

section-multiple-style-palettes = Пелькскесь аньцек фкя <stylePalette> кочкамс маштови; меельцесь тевс нолдави.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } ланкс аф вастневиця вариантнень содамс аф маштови, эдь numToSelect минус аф целай ловома аш.

variant-num-to-select-not-constant-number = { $component } ланкс аф вастневиця вариантнень содамс аф маштови, эдь numToSelect аф полавтовиця ловома аш.

variant-with-replacement-not-constant-boolean = { $component } ланкс аф вастневиця вариантнень содамс аф маштови, эдь withReplacement аф полавтовиця логикань питне аш.

variant-select-weight-disables-unique = кодамояк кочкамоса selectWeight эли selectForVariants максф кда, select ланкс аф вастневиця вариантне мадить

variant-coprime-undetermined = { $component } ланкс аф вастневиця вариантнень содамс аф маштови, эдь coprime свал аф виде-аш, сень содамс аф маштови.

variant-attribute-not-constant = { $component } ланкс аф вастневиця вариантнень содамс аф маштови, эдь { $attribute } аф полавтовиця аш.

variant-attribute-not-number = { $component } ланкс аф вастневиця вариантнень содамс аф маштови, эдь { $attribute } ловома аш.

variant-attribute-wrong-type-for-sequence =
    { $type } ладса { $component } ланкс аф вастневиця вариантнень содамс аф маштови, эдь { $attribute } { $expected ->
        [letters-combination] буквань вейсэндяфкс
        [math-expression] маштовикс математикань ёвтамо
        [integer] целай ловома
       *[number] ловома
    } аш.

variant-length-not-integer = { $component } ланкс аф вастневиця вариантнень содамс аф маштови, эдь length целай ловома аш.

variant-sort-not-implemented = sort мархта { $component } ланкс аф вастневиця вариантне аф тиф

variant-exclude-combinations-not-implemented = excludeCombinations мархта { $component } ланкс аф вастневиця вариантне аф тиф

variant-math-exclude-not-implemented = exclude мархта math ладса { $component } ланкс аф вастневиця вариантне аф тиф

variant-non-constant-exclude-not-implemented = аф полавтовиця аш exclude мархта { $component } ланкс аф вастневиця вариантне аф тиф

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графикень prefigure артыцясоть аф тиф; буезэ кадовсь.

prefigure-descendant-invalid-geometry = { $subject }: пезэ аш эли аф сатышка геометрия; буезэ кадовсь.

prefigure-curve-label-omitted = { $subject }: ютавтозь кичкере элементнеса тешкстне аф тиф; тешксэсь кадовсь.

prefigure-curve-unsupported-definition-type = { $subject }: аф тиф кичкере функциянь меремань лад «{ $definitionType }»; буезэ кадовсь.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элементэнь flipFunctions атрибутось аф тиф; буезэ кадовсь.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves аньцек формуласа максф эйкакш функциятнень саи; буезэ кадовсь.

prefigure-label-position-unsupported =
    { $subject }: аф тиф labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] линиянь кудораськень тешксэнтень
       *[point] точкань тешксэнтень
    }; PreFigure-нь основнай вейсэндявтомась тевс нолдави.

prefigure-fill-style-unsupported = { $subject }: пештямонь стилесь «{ $fillStyle }» PreFigure ланкс аф тиф; пешксе пештямос юты.

prefigure-line-style-unknown = { $subject }: асодавикс линиянь стилесь «{ $lineStyle }» PreFigure лисемастоть сяф.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркерэнь стилесь «{ $markerStyle }» PreFigure «diamond» стиль мархта вейсэндявтозь.

prefigure-marker-style-unsupported = { $subject }: маркерэнь стилесь «{ $markerStyle }» PreFigure ланкс аф тиф; основнай стиль тевс нолдави.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: аф виде `ref`; цельть сюлмамс аф маштови. Тешкстамось сяф.

annotation-ref-multiple-targets = `<annotation>`: `ref` лама цель мархта сюлмавсь; васенцесь тевс нолдави.

annotation-ref-outside-graph = `<annotation>`: аф виде `ref`; целесь сонь потмозонзо саиця графикеть ушоса. Тешкстамось сяф.

annotation-ref-unsupported-target = `<annotation>`: аф виде `ref`; целесь prefigure ютавтомасоть тиф график объект аш. Тешкстамось сяф.

annotation-text-missing = `<annotation>`: `text` аш эли шава; шава текст лиси.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Кружамонь лепштявома муф.
       *[other] `<{ $componentType }>` компонентэть потмозонзо саиця кружамонь лепштявома муф.
    }

reference-no-referent = Сюлмафксонтень объект изь муеве: `{ $reference }`

reference-multiple-referents = Сюлмафксонтень лама объект муф: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элементэнь { $attribute } атрибутонь форматозо аф виде.

children-invalid = `<{ $componentType }>` ланкс аф виде эйкакшт: аф виде эйкакшт муф: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибутонтень аф виде питне `{ $value }`; `{ $default }` питнесь тевс нолдави

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } версиясь изь муеве.
       *[other] DoenetML { $version } версиясь изь муеве. { $fallback } версиясь тевс нолдави
    }

## Reading the DoenetML

parse-invalid-doenetml = Аф виде DoenetML: { $content }

parse-tag-missing-close-tag = Аф виде DoenetML: `{ $tag }` тегень пекстыця тегезэ аш. Эсь прянзо пекстыця тег эли `</{ $tagName }>` тег учовсь.

parse-tag-error = Аф виде DoenetML: `<{ $tagName }>` тегсэть ильведефкс

parse-attribute-missing-value = Аф виде DoenetML: `{ $attribute }` атрибутсоть питне аф сатни ладса.

parse-attribute-invalid = Аф виде DoenetML: аф виде атрибут `{ $attribute }`

parse-attribute-value-invalid = Аф виде DoenetML: атрибутонь аф виде питне `{ $value }`

parse-attribute-value-quote-mismatch = Аф виде DoenetML: атрибутонь аф виде питне `{ $value }`. Кавычкатне аф вейсэндить. `{ $quote }` аф сатни ладса

parse-open-tag-name-missing = Аф виде DoenetML: лемтеме тег муф, кода `<`

parse-tag-not-closed = Аф виде DoenetML: `{ $tag }` тегесь аф пекстазь (`>` аф сатни ладса).

parse-self-closing-tag-name-missing = Аф виде DoenetML: лемтеме тег муф `<{ $content }>`

parse-self-closing-tag-not-closed = Аф виде DoenetML: `{ $tag }` тегесь аф пекстазь (`/>` аф сатни ладса).

parse-tag-invalid-attributes = Аф виде DoenetML: `{ $tag }` тегесь маштовикс аш. Сонза атрибутонзо аф видеть улемс маштовить.

parse-close-tag-name-missing = Аф виде DoenetML: лемтеме пекстыця тег муф, кода `</`

parse-attribute-value-unquoted = Атрибутонь питнетне кавычка потса улемс эрявить: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Аф виде DoenetML: `{ $tag }` пекстыця тег муф, аньцек соненза вейсэндиця панжиця тег аш

parse-close-tag-mismatched = Аф виде DoenetML: аф вейсэндиця пекстыця тег. `</{ $expected }>` учовсь. `{ $found }` муф

parser-node-unconvertible = { $node } узелэть Dast узелс ютавтомс изь маштово.

## Names

name-attribute-invalid =
    Аф виде атрибут name='{ $name }'. { $reason ->
        [characters] Лемтнеса аньцек букват, ловомат, ало чирькст эли чирькст улемс маштовить.
       *[start] Лемтне букваста ушодовомс эрявить.
    }

component-name-invalid-start = Аф виде компонентэнь лем «{ $name }». Лемтне букваста ушодовомс эрявить.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched ладса answer-энь video атрибутозо улемс эряви

answer-video-watched-video-not-reference = videoWatched ладса answer-энь video атрибутозо сюлмафкс улемс эряви

answer-name-not-single-text = answer-энь name атрибутсонзо аньцек фкя текстэнь эйкакш улемс эряви

## Referencing another document

external-doenetml-recursion-limit = Рекурсиянь пелькстне пек ламот, сяда ушо DoenetML саемс изь маштово. Кружамонь сюлмафкс аш?

external-doenetml-unavailable = { $attribute }="{ $uri }" адреста DoenetML саемс изь маштово

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адреста аф виде DoenetML сяф: сон «{ $componentType }» компонентэнь ладонтень изь вейсэнде

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибутось сыредсь; сонь таркас `{ $to }` тевс нолдак.
       *[other] [deprecation] `<{ $component }>` элементэнь `{ $from }` атрибутось сыредсь; сонь таркас `{ $to }` тевс нолдак.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибутось сыредсь и аф ловови, эдь `{ $to }` тожо максф.
       *[other] [deprecation] `<{ $component }>` элементэнь `{ $from }` атрибутось сыредсь и аф ловови, эдь `{ $to }` тожо максф.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элементэнь `{ $attribute }` атрибутось сыредсь и аф ловови.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элементэнь `{ $attribute }` атрибутось сыредсь; сонь таркас `<{ $child }>` эйкакш тевс нолдак.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элементэнь `{ $attribute }` атрибутонь `{ $value }` питнезэ сыредсь; сонь таркас `{ $to }` тевс нолдак.


## Language coverage

pluralize-english-only = `<pluralize>` ламоксчить аньцек англань кельса теемс маштови, сяда { $locale } кельса сёрмадозь документсэть сонь текстэзэ апак полавто кадови. Ламоксчинь формать эсь прят сёрмадык эли сонь `pluralForm` атрибут вельде максык.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элементэсь содавикс Doenet элемент аш.

schema-element-not-allowed-at-root = `<{ $tag }>` элементэнтень документэнь ундоксоть аф мереви.

schema-element-not-allowed-inside = `<{ $tag }>` элементэнтень `<{ $parent }>` потса аф мереви.

schema-attribute-unrecognized = `<{ $tag }>` элементсэть `{ $attribute }` лем мархта атрибут аш.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элементэнь `{ $attribute }` атрибутось эрьва элементэзэ нетнеде фкя улиця список улемс эряви: { $allowed }
       *[other] `<{ $tag }>` элементэнь `{ $attribute }` атрибутось нетнеде фкя улемс эряви: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select ланкс аф виде вариантонь лем. { $variantName } вариантонь лемесь { $numOptions } кочкамоса вастневи, аф кочкамс эрявикс ламоксчись { $numToSelect }.

select-variant-name-without-options = select ланкс вариантт максф, аньцек маштовикс вариантонь лемнентень фкявок кочкамо аш: { $variantName }.

select-variant-name-not-possible = select ланкс максф { $variantName } вариантонь лемесь маштовикс вариантонь лем аш.

select-too-few-options = Весемезэ { $numOptions } эйста { $numToSelect } компонент кочкамс аф маштови.

select-from-sequence-too-few-values = Кувалмозо { $length } мельга-мельгастоть { $numToSelect } питне кочкамс аф маштови.

select-from-sequence-indices-count-mismatch = select ланкс максф индекстнень ламоксчист кочкамс эрявикс ламоксчинтень вейсэндявомс эряви

select-from-sequence-indices-not-integers = select ланкс максф весе индекстне целай ловома улемс эрявить

select-from-sequence-index-excluded = selectfromsequence ланкс максф индексэсь саезель

select-from-sequence-indices-excluded-combination = selectfromsequence ланкс максф индекстне сяф вейсэндяфкс ульнесть

select-from-sequence-coprime-not-positive-integers = Плюс целай ловоматне аф кочкаф, сяда фкяст-фкяст инкса простай вейсэндяфкстнень кочкамс аф маштови.

select-from-sequence-coprime-common-factor = Вейкест-фкяст инкса простай ловоматнень кочкамс аф маштови. Весе маштовикс питнетнень вейсэнь явицяст ули. (Максф "from" эли "to" питнетне "step" мархта фкяст-фкяст инкса простай улемс эрявить.)

select-from-sequence-coprime-single-number = 1 аш фкя ловомаста фкяст-фкяст инкса простай вейсэндяфкстнень кочкамс аф маштови.

select-from-sequence-excluded-too-many-combinations = selectFromSequence потса вейсэндяфкстнеде 70%-да ламось сяф

select-from-sequence-coprime-none-found = Вейкест-фкяст инкса простай ловоматнень кочкамс изь маштово. Весе маштовикс питнетнень вейсэнь явицяст ули.

select-from-sequence-too-few-unique-values = Кувалмозо { $numPossibleValues } мельга-мельгастоть { $numToSelect } явовиця питне кочкамс аф маштови

select-prime-numbers-too-few-values = Кувалмозо { $numValues } простай ловомань спискеста { $numToSelect } питне кочкамс аф маштови

select-prime-numbers-values-count-mismatch = select ланкс максф питнетнень ламоксчист кочкамс эрявикс ламоксчинтень вейсэндявомс эряви

select-prime-numbers-values-not-prime = select prime number ланкс максф весе питнетне простай ловомань спискеса улемс эрявить

select-prime-numbers-values-excluded-combination = selectPrimeNumbers ланкс максф питнетне сяф вейсэндяфкс ульнесть

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers потса вейсэндяфкстнеде 70%-да ламось сяф

select-random-combination-fluke = Пек аф маштовикс тевень кувалт эрьва кодамо питнетнень вейсэндяфксост кочкамс изь маштово

select-random-value-fluke = Пек аф маштовикс тевень кувалт эрьва кодамо питнеть кочкамс изь маштово

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` инкса эряви функция, конань улихть { $expected ->
        [one] фкя лисема, эрь точкаса наклонць y', мярьгомс `y - x`
       *[other] кафта лисемат, эрь точкаса векторсь, мярьгомс `(y, -x)`
    }, но максф функциять улихть { $found ->
        [one] { $found } лисемац
       *[other] { $found } лисемац
    }. { $alternative ->
        [none] Мезевок аф артови.
       *[other] Стама функциять инкса `<{ $alternative }>` компонентсь лади. Мезевок аф артови.
    }

field-function-attribute-ignored-with-child = `function` атрибутсь аф ловови, сяс мес функциясь максф компонентть потмоса тожа; тевс сявови потмосась. Макск функциять аньцек фкя ладса.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибутсь лемди компонентть потмоса сёрмадф выражениять переменнайнзон. { $reason ->
        [function-child] Тяса функциясь максф `<function>` идьокс, конац ась переменнайнзон лемди, сяс `variables` аф ловови.
       *[no-expression] Стама выражения тяса аф максф, сяс `variables` аф ловови.
    }
