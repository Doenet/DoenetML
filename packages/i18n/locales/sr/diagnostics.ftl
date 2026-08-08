# Serbian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic and in the Ekavian standard.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Serbian counts in three plural categories, and which of them a message needs
# depends on what the count does in it. A message that prints the number next
# to a noun agrees that noun with it, so it spells out `one` and `few`. A
# message where the number never appears — the list messages, whose count only
# decides whether a verb is singular or plural — has just the two forms Serbian
# offers there.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } се занемарује када су задате обе крајње тачке
       *[other] { $attributes } се занемарују када су задате обе крајње тачке
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } се занемарује када су задати и крајња тачка и средиште
       *[other] { $attributes } се занемарују када су задати и крајња тачка и средиште
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset нема дејства без задатог средишта

## `<line>`

line-points-undetermined-dimensions = Права кроз тачке неодређене димензије.

line-points-too-few-dimensions = Права мора да пролази кроз тачке димензије најмање два.

line-points-depend-on-variables = Права пролази кроз тачке које зависе од променљивих: { $variables }.

line-equation-invalid-format = Неисправан облик једначине праве у променљивима { $variable1 } и { $variable2 }.

## `<ray>`

ray-overprescribed-through = Полуправа је задата помоћу through, endpoint и direction. Задато through се занемарује.

ray-dimension-mismatch = Неслагање numDimensions код полуправе.

## `<vector>`

vector-overprescribed-head = Вектор је задат помоћу head, tail и displacement. Задато head се занемарује.

vector-dimension-mismatch = Неслагање numDimensions код вектора.

## Attracting and constraining

attract-to-without-nearest-point = Није могуће привлачити ка `<{ $component }>` јер нема променљиву стања nearestPoint.

constrain-to-without-nearest-point = Није могуће ограничити на `<{ $component }>` јер нема променљиву стања nearestPoint.

constrain-to-interior-without-nearest-point = Није могуће ограничити на унутрашњост `<{ $component }>` јер нема променљиву стања nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition се занемарује за неуграђени choiceInput

## Ordering children by index

choice-input-indices-count-mismatch = Индекси задати за choiceInput се занемарују јер њихов број не одговара броју подређених choice.

pretzel-indices-count-mismatch = Индекси задати за problem се занемарују јер њихов број не одговара броју подређених problem.

shuffle-indices-count-mismatch = Индекси задати за shuffle се занемарују јер њихов број не одговара броју компоненти.

indices-ignored-out-of-range = Индекси задати за { $component } се занемарују јер су неки ван опсега.

pretzel-indices-repeated = Индекси задати за pretzel се занемарују јер се неки понављају.

pretzel-circuit-first-index = Индекси задати за pretzel у режиму circuit се занемарују јер први индекс мора бити 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Да би `<{ $component }>` радио са текстуалном децом, мора бити задат атрибут `type`.

invalid-type-defaulting-to-math = Неисправан тип { $type } за компоненту { $component }. Мора бити math, text, number или boolean. Користи се math.

string-not-valid-component-to-arrange = Ниска „{ $value }“ није ваљана компонента за { $component }. Занемарује се.

## Types and variables

invalid-type-defaulting-to-number = Неисправан тип { $type }; тип се поставља на number.

invalid-variable-value = Неисправна вредност променљиве: `{ $value }`

## Variants

variant-index-must-be-number = Индекс варијанте { $index } мора бити број

variant-index-must-be-integer = Индекс варијанте { $index } мора бити цео број

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` није изведен за апсолутне мере. Ширине постају релативне.

side-by-side-absolute-margins = `<{ $component }>` није изведен за апсолутне мере. Маргине постају релативне.

side-by-side-no-block-child = Неисправан `<{ $component }>`: мора имати бар једно блоковско дете.

## `<label>`

label-for-ignored-on-graphical = Атрибут `for` на графичком `<label>` се занемарује.

label-for-must-resolve-to-one = Атрибут `for` на `<label>` мора да води тачно на једну компоненту.

label-for-unresolved = Атрибут `for` на `<label>` није могао да се разреши у компоненту.

label-for-answer-with-authored-inputs = Атрибут `for` на `<label>` упућује на `<answer>` са изричито написаним пољима за унос; упутите директно на поље.

label-for-answer-without-input = Атрибут `for` на `<label>` упућује на `<answer>` без поља за унос које би се означило.

label-for-must-reference-input-or-answer = Атрибут `for` на `<label>` мора да упућује на поље за унос или на одговор.

## Accessibility

accessibility-short-description-or-decorative = Ради приступачности, `<{ $component }>` мора имати кратак опис или бити означен као украсни.

accessibility-video-short-description = Ради приступачности, `<video>` мора имати кратак опис.

accessibility-input-short-description-or-label = Ради приступачности, `<{ $component }>` мора имати кратак опис или ознаку.

accessibility-answer-input-short-description-or-label = Ради приступачности, `<answer>` који ствара поље за унос мора имати кратак опис или ознаку.

accessibility-short-description-contains-math = Кратки описи не би требало да садрже математичке компоненте попут `<{ $component }>`. Математику испишите речима.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } има недовољан контраст за текст наслова одељка (тамна тема) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; потребно је бар { $threshold }:1).
       *[other] { $colorName } има недовољан контраст за текст наслова одељка ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; потребно је бар { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` кроз { $count } тачака није изведена када тачке немају бројевне вредности.

circle-too-many-through-points = Није могуће израчунати кружницу кроз више од 3 тачке.

circle-overprescribed-radius-center-points = Није могуће израчунати кружницу са задатим полупречником, средиштем и тачкама.

circle-center-with-multiple-points = Није могуће израчунати кружницу са задатим средиштем кроз више од 1 тачке.

circle-radius-too-small = Није могуће израчунати кружницу: пошто је растојање између двеју тачака { $distance }, задати полупречник { $radius } је премали.

circle-radius-with-many-points = Није могуће конструисати кружницу кроз више од две тачке са задатим полупречником.

circle-invalid-center-or-through-points = Неисправно средиште или тачке кружнице.

circle-radius-center-with-multiple-points = Није могуће израчунати полупречник кружнице са задатим средиштем кроз више од 1 тачке.

circle-change-radius-non-numerical = Није могуће променити полупречник кружнице са небројевним тачкама

circle-radius-with-points-non-numerical = Није могуће конструисати кружницу кроз више од једне тачке са задатим полупречником када нема бројевних вредности.

circle-change-center-non-numerical = Мењање средишта кружнице кроз небројевне тачке није изведено.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Недовољно димензија за домен функције. Домен има { $intervals } интервал, а функција има { $inputs ->
            [one] { $inputs } улаз
            [few] { $inputs } улаза
           *[other] { $inputs } улаза
        }.
        [few] Недовољно димензија за домен функције. Домен има { $intervals } интервала, а функција има { $inputs ->
            [one] { $inputs } улаз
            [few] { $inputs } улаза
           *[other] { $inputs } улаза
        }.
       *[other] Недовољно димензија за домен функције. Домен има { $intervals } интервала, а функција има { $inputs ->
            [one] { $inputs } улаз
            [few] { $inputs } улаза
           *[other] { $inputs } улаза
        }.
    }

function-domain-invalid-format = Неисправан облик домена функције.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Небројевни максимум функције се занемарује.
        [minimum] Небројевни минимум функције се занемарује.
        [extremum] Небројевни екстрем функције се занемарује.
        [point] Небројевна тачка функције се занемарује.
        [slope] Небројевни нагиб функције се занемарује.
       *[other] Небројевно { $type } функције се занемарује.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Празан максимум функције се занемарује.
        [minimum] Празан минимум функције се занемарује.
        [extremum] Празан екстрем функције се занемарује.
        [point] Празна тачка функције се занемарује.
       *[other] Празно { $type } функције се занемарује.
    }

function-points-too-close = Функција садржи две тачке које су превише близу. Функцију није могуће дефинисати.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Итерације функције могуће су само ако је број улаза једнак броју излаза. Ова функција има { $inputs } улаз и { $outputs ->
            [one] { $outputs } излаз
            [few] { $outputs } излаза
           *[other] { $outputs } излаза
        }.
        [few] Итерације функције могуће су само ако је број улаза једнак броју излаза. Ова функција има { $inputs } улаза и { $outputs ->
            [one] { $outputs } излаз
            [few] { $outputs } излаза
           *[other] { $outputs } излаза
        }.
       *[other] Итерације функције могуће су само ако је број улаза једнак броју излаза. Ова функција има { $inputs } улаза и { $outputs ->
            [one] { $outputs } излаз
            [few] { $outputs } излаза
           *[other] { $outputs } излаза
        }.
    }

## `<sequence>`

sequence-invalid-length = Неисправна дужина низа. Мора бити ненегативан цео број.

sequence-invalid-step = Неисправан корак низа. За низ типа { $type } мора бити број.

sequence-invalid-endpoint-number = Неисправно „{ $attribute }“ бројевног низа. Мора бити број.

sequence-invalid-endpoint-letters = Неисправно „{ $attribute }“ словног низа. Мора бити комбинација слова.

sequence-invalid-endpoint = Неисправно „{ $attribute }“ низа.

select-from-sequence-coprime-not-numbers = coprime се занемарује јер се не бирају бројеви

select-from-sequence-coprime-with-exclude-combinations = coprime се занемарује јер је задато excludeCombinations

## Resolving a `target`

target-not-found = Неисправан target за `<{ $source }>`: циљ није пронађен.

target-state-variable-not-found = Неисправан target за `<{ $source }>`: `<{ $component }>` нема променљиву стања с именом „{ $property }“.

## `<odeSystem>`

ode-system-variables-match-independent = Променљиве `<odeSystem>` морају се разликовати од независне променљиве.

ode-system-duplicate-variable-names = Није могуће дефинисати десне стране ОДЈ са поновљеним именима зависних променљивих.

ode-system-rhs-function-error = Није могуће дефинисати десну страну ОДЈ. Грешка при стварању mathjs функције.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Није могуће дефинисати угао између { $count } правих

angle-invalid-through-point = Неисправна тачка у through код `<angle>`

parabola-vertex-too-many-points = Парабола са задатим теменом кроз више од 1 тачке није изведена.

parabola-too-many-points = Парабола кроз више од 3 тачке није изведена.

intersection-too-many-items = Пресек више од два објекта није изведен

## Other math components

ionic-compound-not-two-ions = Јонска једињења осим оних од два јона нису изведена.

ionic-compound-needs-cation-and-anion = Јонска једињења су изведена само за један катјон и један анјон.

solve-equations-cannot-evaluate = Једначину није могуће решити јер није могла да се израчуна: { $equation }

math-operators-operand-number-required = За издвајање математичког операнда мора се задати operandNumber.

eigen-decomposition-failed = Сопствене вредности матрице нису могле да се израчунају

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: параметар { $parameters } се не појављује у обрасцу па ће увек одговарати празнини.
       *[other] `<matchesPattern>`: параметри { $parameters } се не појављују у обрасцу па ће увек одговарати празнини.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: није могуће протумачити grid="{ $grid }". Вредност мора бити none, medium, dense или два позитивна броја раздвојена размаком, на пример grid="1 0.5". Мрежа се не црта.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" није подржан у приказивачу prefigure; користи се понашање за десни положај.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" није подржан у приказивачу prefigure; користи се понашање за горњи положај.

prefigure-invalid-axis-bounds = `<graph>`: неисправне границе оса за претварање у prefigure; користи се подразумевани bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: неисправна ширина за претварање у prefigure; користи се подразумевана ширина дијаграма 425.

prefigure-invalid-aspect-ratio = `<graph>`: неисправан aspectRatio за претварање у prefigure; користи се подразумевани однос страница 1.

prefigure-grid-spacing-too-fine = `<graph>`: размак мреже је преситан за границе оса; у приказивачу prefigure мрежа се изоставља.

prefigure-annotations-not-rendered = `<graph>`: ван приказивача PreFigure напомене се не приказују.

multiple-annotations-children = У `<graph>` пронађено је више подређених `<annotations>`; све осим последње се занемарују.

## Referring to other components

copy-unrecognized-component-type = Није могуће проширити или копирати непрепознат тип компоненте: { $type }.

copy-prop-not-found = Својство { $property } није пронађено на компоненти типа { $component }

collect-no-source = За collect није пронађен извор.

collect-invalid-component-type = Није могуће сакупљати компоненте типа `<{ $component }>` јер је то неисправан тип компоненте.

reference-index-unavailable = Није могуће упутити на индекс `{ $reference }`

## `<callAction>`

component-action-unavailable = Није могуће позвати { $action } на компоненти `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Подаци имају неисправан облик. Редови су различитих дужина. Пронађено у componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Подаци имају поновљена имена колона. Пронађено у componentIdx :{ $componentIdx }

data-frame-missing-column-name = Подацима недостаје име колоне. Пронађено у componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award овог одговора ослања се на послати одговор саме ознаке answer, што ће довести до неочекиваног понашања.

answer-max-num-attempts-in-section-wide-check-work = Постављање `maxNumAttempts` на `<answer>` унутар контејнера са `sectionWideCheckWork` нема дејства јер број покушаја одређује контејнер. Поставите `maxNumAttempts` на контејнер.

nested-section-wide-check-work-max-num-attempts = Постављање `maxNumAttempts` на контејнер са `sectionWideCheckWork` који је и сам унутар другог контејнера са `sectionWideCheckWork` нема дејства јер број покушаја одређује спољашњи контејнер. Поставите `maxNumAttempts` на спољашњи контејнер.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Атрибут { $attributes } неће имати дејства без постављеног symbolicEquality.
       *[other] Атрибути { $attributes } неће имати дејства без постављеног symbolicEquality.
    }

answer-invalid-type = Неисправан тип за answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Компонента `<{ $component }>` нема име па не може да се употреби као атрибут модула

module-attribute-name-already-defined = Компонента `<{ $component } name="{ $name }">` не може да се употреби као атрибут модула јер тип компоненте `<module>` већ има дефинисан атрибут „{ $name }“.

conditional-content-condition-ignored = Атрибут `condition` се занемарује на компоненти `<conditionalContent>` са подређеним case или else.

slider-markers-type-mismatch = Тип ознака не одговара типу клизача.

pretzel-problem-needs-statement-and-answer = Неисправан pretzel: сваки `<problem>` мора да садржи један `<statement>` и један `<answer>`.

pretzel-circuit-first-problem-distractor = Неисправан pretzel: при mode="circuit" први `<problem>` не може бити ометач.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Неисправна вредност { $values } за атрибут `{ $attribute }`; занемарује се.
       *[other] Неисправне вредности { $values } за атрибут `{ $attribute }`; занемарују се.
    }

attribute-must-be-references = Неисправна вредност `{ $value }` за атрибут `{ $attribute }`. Атрибут мора бити састављен од упута које почињу са `$`.

math-input-invalid-function-names = <mathInput>: неисправна имена функција у { $attribute } су занемарена: { $names }. Приказни део сваког имена мора имати бар 2 знака (слова или цртице); иза њега може следити необавезан наставак `|<mathspeak алтернатива>`.

## Building components from the source

component-type-invalid = Неисправан тип компоненте: `<{ $componentType }>`

attribute-repeated = Атрибут { $attribute } не сме да се понавља.

attribute-invalid-for-component = Неисправан атрибут „{ $attribute }“ за компоненту типа `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Дефиниција стила { $styleNumber } има недовољан контраст за { $context ->
        [text-on-background] боју текста наспрам боје позадине
        [high-contrast] високонтрастну боју наспрам подлоге
        [line] боју линија наспрам подлоге
        [marker] боју ознака наспрам подлоге
       *[text-on-canvas] боју текста наспрам подлоге
    }{ $mode ->
        [dark] { " (тамна тема)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; потребно је бар { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Иако дефиниција стила { $styleNumber } задаје боје са довољним контрастом за светлу тему, из њих изведене боје за тамну тему дају недовољан контраст текста наспрам позадине ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; потребно је бар { $threshold }:1). { $suggestion ->
        [available] За довољан контраст у тамној теми или повећајте контраст у светлој теми (на пример { $lightAttribute }="{ $lightColor }") или замените боју за тамну тему (на пример { $darkAttribute }="{ $darkColor }").
       *[none] За довољан контраст у тамној теми повећајте контраст у светлој теми или замените изведене боје помоћу textColorDarkMode и/или backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Иако дефиниција стила { $styleNumber } задаје боју текста са довољним контрастом за светлу тему, из ње изведена боја текста за тамну тему даје недовољан контраст наспрам подлоге ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; потребно је бар { $threshold }:1). { $suggestion ->
        [available] За довољан контраст у тамној теми или повећајте контраст у светлој теми (на пример textColor="{ $lightColor }") или замените боју за тамну тему (на пример textColorDarkMode="{ $darkColor }").
       *[none] За довољан контраст у тамној теми повећајте контраст у светлој теми или замените изведену боју помоћу textColorDarkMode.
    }

section-multiple-style-palettes = Одељак може да изабере само једну <stylePalette>; користи се последња.

## Unique variants

variant-num-to-select-not-non-negative-integer = није могуће одредити јединствене варијанте компоненте { $component } јер numToSelect није ненегативан цео број.

variant-num-to-select-not-constant-number = није могуће одредити јединствене варијанте компоненте { $component } јер numToSelect није константан број.

variant-with-replacement-not-constant-boolean = није могуће одредити јединствене варијанте компоненте { $component } јер withReplacement није константна логичка вредност.

variant-select-weight-disables-unique = Јединствене варијанте за select искључене су ако нека могућност има задат selectWeight или selectForVariants

variant-coprime-undetermined = није могуће одредити јединствене варијанте компоненте { $component } јер се не може утврдити да је coprime увек нетачно.

variant-attribute-not-constant = није могуће одредити јединствене варијанте компоненте { $component } јер { $attribute } није константа.

variant-attribute-not-number = није могуће одредити јединствене варијанте компоненте { $component } јер { $attribute } није број.

variant-attribute-wrong-type-for-sequence =
    није могуће одредити јединствене варијанте компоненте { $component } типа { $type } јер { $attribute } није { $expected ->
        [letters-combination] комбинација слова
        [math-expression] ваљан математички израз
        [integer] цео број
       *[number] број
    }.

variant-length-not-integer = није могуће одредити јединствене варијанте компоненте { $component } јер length није цео број.

variant-sort-not-implemented = јединствене варијанте компоненте { $component } са sort нису изведене

variant-exclude-combinations-not-implemented = јединствене варијанте компоненте { $component } са excludeCombinations нису изведене

variant-math-exclude-not-implemented = јединствене варијанте компоненте { $component } типа math са exclude нису изведене

variant-non-constant-exclude-not-implemented = јединствене варијанте компоненте { $component } са неконстантним exclude нису изведене

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: није подржано у приказивачу prefigure за графике; потомак је прескочен.

prefigure-descendant-invalid-geometry = { $subject }: бесконачна или непотпуна геометрија; потомак је прескочен.

prefigure-curve-label-omitted = { $subject }: ознаке нису подржане на претвореним елементима кривих; ознака је изостављена.

prefigure-curve-unsupported-definition-type = { $subject }: неподржан тип дефиниције функције криве „{ $definitionType }“; потомак је прескочен.

prefigure-region-flip-functions-unsupported = { $subject }: атрибут flipFunctions на regionBetweenCurves није подржан; потомак је прескочен.

prefigure-region-non-formula-child = { $subject }: на regionBetweenCurves подржане су само подређене функције задате формулом; потомак је прескочен.

prefigure-label-position-unsupported =
    { $subject }: неподржан labelPosition „{ $labelPosition }“ за { $labelKind ->
        [line-family] ознаку из породице правих
       *[point] ознаку тачке
    }; користи се подразумевано поравнање PreFigure-а.

prefigure-fill-style-unsupported = { $subject }: стил испуне „{ $fillStyle }“ није подржан у PreFigure-у; користи се пуна испуна.

prefigure-line-style-unknown = { $subject }: непознат стил линије „{ $lineStyle }“ изостављен је из излаза PreFigure-а.

prefigure-marker-style-mapped-to-diamond = { $subject }: стил ознаке „{ $markerStyle }“ пресликан је у стил „diamond“ у PreFigure-у.

prefigure-marker-style-unsupported = { $subject }: стил ознаке „{ $markerStyle }“ није подржан у PreFigure-у; користи се подразумевани стил.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: неисправан `ref`; циљ не може да се разреши. Напомена је изостављена.

annotation-ref-multiple-targets = `<annotation>`: `ref` се разрешио у више циљева; користи се први.

annotation-ref-outside-graph = `<annotation>`: неисправан `ref`; циљ је ван графика који га садржи. Напомена је изостављена.

annotation-ref-unsupported-target = `<annotation>`: неисправан `ref`; циљ није подржан графички објекат при претварању у prefigure. Напомена је изостављена.

annotation-text-missing = `<annotation>`: `text` недостаје или је празан; исписује се празан текст.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Откривена је кружна зависност.
       *[other] Откривена је кружна зависност која укључује компоненту `<{ $componentType }>`.
    }

reference-no-referent = Није пронађен објекат за упуту: `{ $reference }`

reference-multiple-referents = Пронађено је више објеката за упуту: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Неисправан облик атрибута { $attribute } компоненте `<{ $componentType }>`.

children-invalid = Неисправна деца за `<{ $componentType }>`: пронађена су неисправна деца: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Неисправна вредност `{ $value }` за атрибут `{ $attribute }`; користи се вредност `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Верзија { $version } DoenetML-а није пронађена.
       *[other] Верзија { $version } DoenetML-а није пронађена. Користи се верзија { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Неисправан DoenetML: { $content }

parse-tag-missing-close-tag = Неисправан DoenetML: ознака `{ $tag }` нема затварајућу ознаку. Очекивала се самозатварајућа ознака или ознака `</{ $tagName }>`.

parse-tag-error = Неисправан DoenetML: грешка у ознаци `<{ $tagName }>`

parse-attribute-missing-value = Неисправан DoenetML: атрибуту `{ $attribute }` изгледа недостаје вредност.

parse-attribute-invalid = Неисправан DoenetML: неисправан атрибут `{ $attribute }`

parse-attribute-value-invalid = Неисправан DoenetML: неисправна вредност атрибута `{ $value }`

parse-attribute-value-quote-mismatch = Неисправан DoenetML: неисправна вредност атрибута `{ $value }`. Наводници се не поклапају. Изгледа да недостаје `{ $quote }`

parse-open-tag-name-missing = Неисправан DoenetML: пронађена је ознака без имена, на пример `<`

parse-tag-not-closed = Неисправан DoenetML: ознака `{ $tag }` није затворена (изгледа да недостаје `>`).

parse-self-closing-tag-name-missing = Неисправан DoenetML: пронађена је ознака без имена `<{ $content }>`

parse-self-closing-tag-not-closed = Неисправан DoenetML: ознака `{ $tag }` није затворена (изгледа да недостаје `/>`).

parse-tag-invalid-attributes = Неисправан DoenetML: ознака `{ $tag }` није ваљана. Можда има погрешне атрибуте.

parse-close-tag-name-missing = Неисправан DoenetML: пронађена је затварајућа ознака без имена, на пример `</`

parse-attribute-value-unquoted = Вредности атрибута морају бити под наводницима: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Неисправан DoenetML: пронађена је затварајућа ознака `{ $tag }`, али нема одговарајуће отварајуће

parse-close-tag-mismatched = Неисправан DoenetML: неодговарајућа затварајућа ознака. Очекивала се `</{ $expected }>`. Пронађена је `{ $found }`

parser-node-unconvertible = Чвор { $node } није могао да се претвори у Dast чвор.

## Names

name-attribute-invalid =
    Неисправан атрибут name='{ $name }'. { $reason ->
        [characters] Имена могу садржати само слова, бројеве, доње црте или цртице.
       *[start] Имена морају почињати словом.
    }

component-name-invalid-start = Неисправно име компоненте „{ $name }“. Имена морају почињати словом.

## `<answer>` sugar

answer-video-watched-missing-video = answer типа videoWatched мора имати атрибут video

answer-video-watched-video-not-reference = Код answer типа videoWatched атрибут video мора бити упута

answer-name-not-single-text = Атрибут name компоненте answer мора имати тачно једно текстуално дете

## Referencing another document

external-doenetml-recursion-limit = Спољашњи DoenetML није могао да се преузме због превише нивоа рекурзије. Има ли кружне упуте?

external-doenetml-unavailable = DoenetML није могао да се преузме са { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Преузет је неисправан DoenetML са { $attribute }="{ $uri }": не одговара типу компоненте „{ $componentType }“

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Атрибут `{ $from }` је застарео; употребите `{ $to }`.
       *[other] [deprecation] Атрибут `{ $from }` на `<{ $component }>` је застарео; употребите `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Атрибут `{ $from }` је застарео и занемарује се јер је задат и `{ $to }`.
       *[other] [deprecation] Атрибут `{ $from }` на `<{ $component }>` је застарео и занемарује се јер је задат и `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Атрибут `{ $attribute }` на `<{ $component }>` је застарео и занемарује се.


## Language coverage

pluralize-english-only = `<pluralize>` може да гради множину само на енглеском, па у документу на језику { $locale } његов текст остаје непромењен. Напишите облик множине сами или га задајте атрибутом `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Елемент `<{ $tag }>` није препознат Doenet елемент.

schema-element-not-allowed-at-root = Елемент `<{ $tag }>` није дозвољен у корену документа.

schema-element-not-allowed-inside = Елемент `<{ $tag }>` није дозвољен унутар `<{ $parent }>`.

schema-attribute-unrecognized = Елемент `<{ $tag }>` нема атрибут с именом `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Атрибут `{ $attribute }` елемента `<{ $tag }>` мора бити списак чији је сваки члан једно од: { $allowed }
       *[other] Атрибут `{ $attribute }` елемента `<{ $tag }>` мора бити једно од: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Неисправно име варијанте за select. Име варијанте { $variantName } појављује се у { $numOptions } могућности, а изабрати треба { $numToSelect }.

select-variant-name-without-options = За select су задате варијанте, али није задата ниједна могућност за могуће име варијанте: { $variantName }.

select-variant-name-not-possible = Име варијанте { $variantName } задато за select није могуће име варијанте.

select-too-few-options = Није могуће изабрати { $numToSelect } компоненти из само { $numOptions }.

select-from-sequence-too-few-values = Није могуће изабрати { $numToSelect } вредности из низа дужине { $length }.

select-from-sequence-indices-count-mismatch = Број индекса задатих за select мора да одговара броју за избор

select-from-sequence-indices-not-integers = Сви индекси задати за select морају бити цели бројеви

select-from-sequence-index-excluded = Задати индекс за selectfromsequence био је искључен

select-from-sequence-indices-excluded-combination = Задати индекси за selectfromsequence чинили су искључену комбинацију

select-from-sequence-coprime-not-positive-integers = Није могуће изабрати узајамно просте комбинације јер се не бирају позитивни цели бројеви.

select-from-sequence-coprime-common-factor = Није могуће изабрати узајамно просте бројеве. Све могуће вредности имају заједнички делилац. (Задате вредности "from" или "to" морају бити узајамно просте са "step".)

select-from-sequence-coprime-single-number = Није могуће изабрати узајамно просте комбинације из једног броја различитог од 1.

select-from-sequence-excluded-too-many-combinations = У selectFromSequence искључено је више од 70 % комбинација

select-from-sequence-coprime-none-found = Узајамно просте бројеве није било могуће изабрати. Све могуће вредности имају заједнички делилац.

select-from-sequence-too-few-unique-values = Није могуће изабрати { $numToSelect } различитих вредности из низа дужине { $numPossibleValues }

select-prime-numbers-too-few-values = Није могуће изабрати { $numToSelect } вредности са списка простих бројева дужине { $numValues }

select-prime-numbers-values-count-mismatch = Број вредности задатих за select мора да одговара броју за избор

select-prime-numbers-values-not-prime = Све вредности задате за select prime number морају бити на списку простих бројева

select-prime-numbers-values-excluded-combination = Задате вредности за selectPrimeNumbers чиниле су искључену комбинацију

select-prime-numbers-excluded-too-many-combinations = У selectPrimeNumbers искључено је више од 70 % комбинација

select-random-combination-fluke = Крајње невероватном случајношћу није било могуће изабрати комбинацију случајних вредности

select-random-value-fluke = Крајње невероватном случајношћу није било могуће изабрати случајну вредност
