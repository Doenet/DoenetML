# Ingush diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Ingush (гӀалгӀай мотт) in Cyrillic with the palochka Ӏ, which is a letter and
# neither a Latin capital I nor a digit 1.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# The exemplar for this catalog is `locales/ce`, the other Vainakh language;
# `content.ftl`'s header explains what that relationship is and where this file
# follows Ingush rather than Chechen. In this file the recurring differences
# are small and constant: «хӀана аьлча» for "because" where Chechen writes
# «хӀунда аьлча», «мегац» for "cannot", «тидам ца бу» for "is ignored", «цӀи»
# for a name, «доаца» for the negative participle.
#
# Ingush's class agreement does not reach this file: nothing here describes a
# noun the catalog itself supplies, so no message forks on a class. The fork
# lives in `content.ftl`, and that file's header says why it lives only there.
#
# The technical vocabulary is the Russian one, which is what written Ingush
# uses for it: «компонент», «атрибут», «функци», «индекс», «формат».
#
# Ingush counts in two plural categories, `one` and `other`, so every count
# below keeps the two branches English gives it. A noun after a numeral stays
# singular, so in most of them the two branches read alike.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] шиъ йисте билгалбаьча { $attributes } тидам ца бу
       *[other] шиъ йисте билгалбаьча { $attributes } тидам ца бу
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] йисте а, юкъера тӀадам а билгалбаьча { $attributes } тидам ца бу
       *[other] йисте а, юкъера тӀадам а билгалбаьча { $attributes } тидам ца бу
    }

line-segment-midpoint-offset-without-midpoint = юкъера тӀадам боаца midpointOffset хӀаманна тӀа ца кхоач

## `<line>`

line-points-undetermined-dimensions = Барам ца бовзаш болча тӀадамашкахьара доагӀа нийса сиз.

line-points-too-few-dimensions = Нийса сиз кӀезигагӀа шиъ барам болча тӀадамашкахьара даха деза.

line-points-depend-on-variables = Нийса сиз хувцалуча барамашка хьежача тӀадамашкахьара доагӀа: { $variables }.

line-equation-invalid-format = { $variable1 } а, { $variable2 } а хувцалуча барамашца долча нийсача сизан уравнена формат нийса яц.

## `<ray>`

ray-overprescribed-through = Луч through, endpoint а, direction а тӀехьара деннад. Деннача through тидам ца бу.

ray-dimension-mismatch = лучехь numDimensions ца тоъ.

## `<vector>`

vector-overprescribed-head = Вектор head, tail а, displacement а тӀехьара деннад. Деннача head тидам ца бу.

vector-dimension-mismatch = векторехь numDimensions ца тоъ.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` элементага теда мегац, хӀана аьлча цун nearestPoint яха хьала хувцалу барам бац.

constrain-to-without-nearest-point = `<{ $component }>` элементаца доза де мегац, хӀана аьлча цун nearestPoint яха хьала хувцалу барам бац.

constrain-to-interior-without-nearest-point = `<{ $component }>` элемента чурчоа доза де мегац, хӀана аьлча цун nearestPoint яха хьала хувцалу барам бац.

## `<choiceInput>`

choice-input-label-position-ignored = могӀана чу доаца choiceInput тӀа labelPosition тидам ца бу

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput тӀа деннача индексий тидам ца бу, хӀана аьлча царна дукхал choice берий дукхала ца тоъ.

pretzel-indices-count-mismatch = problem тӀа деннача индексий тидам ца бу, хӀана аьлча царна дукхал problem берий дукхала ца тоъ.

shuffle-indices-count-mismatch = shuffle тӀа деннача индексий тидам ца бу, хӀана аьлча царна дукхал компонентий дукхала ца тоъ.

indices-ignored-out-of-range = { $component } тӀа деннача индексий тидам ца бу, хӀана аьлча цхьабараш доза тӀера арадоал.

pretzel-indices-repeated = pretzel тӀа деннача индексий тидам ца бу, хӀана аьлча цхьабараш юха карладоал.

pretzel-circuit-first-index = circuit режиме pretzel тӀа деннача индексий тидам ца бу, хӀана аьлча хьалхара индекс 1 хила еза.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` текста берашца болх бе `type` атрибут енна хила еза.

invalid-type-defaulting-to-math = { $component } компонента нийса доаца тайпа { $type }. Из math, text, number е boolean хила деза. math лоаттаду.

string-not-valid-component-to-arrange = «{ $value }» могӀа { $component } де мегача компонент бац. Тидам ца бу.

## Types and variables

invalid-type-defaulting-to-number = Нийса доаца тайпа { $type }, тайпа number хургда.

invalid-variable-value = Хувцалуча барама нийса боаца мах: `{ $value }`

## Variants

variant-index-must-be-number = { $index } варианта индекс терахь хила деза

variant-index-must-be-integer = { $index } варианта индекс дийна терахь хила деза

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолютни барамашта дина дац. Шоралла юстара хургья.

side-by-side-absolute-margins = `<{ $component }>` абсолютни барамашта дина дац. Йистош юстара хургья.

side-by-side-no-block-child = Нийса доаца `<{ $component }>`: цун кӀезигагӀа цхьа блок бер хила деза.

## `<label>`

label-for-ignored-on-graphical = График `<label>` элемента `for` атрибута тидам ца бу.

label-for-must-resolve-to-one = `<label>` элемента `for` атрибут цхьан компонента тӀа бен хьежаш хила ца деза.

label-for-unresolved = `<label>` элемента `for` атрибут компонентаца тохаде ца делар.

label-for-answer-with-authored-inputs = `<label>` элемента `for` атрибут авторо яздаьча чудаларий моттигаш йолча `<answer>` тӀа хьежа; моттига тӀа нийсса хьажабе.

label-for-answer-without-input = `<label>` элемента `for` атрибут чудаларий моттиг йоаца `<answer>` тӀа хьежа.

label-for-must-reference-input-or-answer = `<label>` элемента `for` атрибут чудаларий моттига е жоапа тӀа хьежаш хила деза.

## Accessibility

accessibility-short-description-or-decorative = Кхачара `<{ $component }>` йоацача билгалдаккхарца хила деза, е хозде йоагӀаш я аьнна билгалде деза.

accessibility-video-short-description = Кхачара `<video>` йоацача билгалдаккхарца хила деза.

accessibility-input-short-description-or-label = Кхачара `<{ $component }>` йоацача билгалдаккхарца е хьаьркаца хила деза.

accessibility-answer-input-short-description-or-label = Кхачара чудаларий моттиг кхолла `<answer>` йоацача билгалдаккхарца е хьаьркаца хила деза.

accessibility-short-description-contains-math = Йоацача билгалдаккхарашка `<{ $component }>` санна математически компоненташ хила ца еза. Математика дешашца язъе.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } декъа корта яздеча текста тоаъаш контраст ца ло (Ӏаьржа тайпа) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кӀезигагӀа { $threshold }:1 деза).
       *[other] { $colorName } декъа корта яздеча текста тоаъаш контраст ца ло ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кӀезигагӀа { $threshold }:1 деза).
    }

## `<circle>`

circle-through-points-non-numerical = ТӀадамашта терахьа мах ца хилча { $count } тӀадамашкахьара доагӀа `<circle>` дина дац.

circle-too-many-through-points = 3-ал дукхагӀча тӀадамашкахьара доагӀа го хьисапде мегац.

circle-overprescribed-radius-center-points = Денна радиус, юкъ а, тӀадамаш а долаш го хьисапде мегац.

circle-center-with-multiple-points = Денна юкъаца 1-ал дукхагӀча тӀадамашкахьара доагӀа го хьисапде мегац.

circle-radius-too-small = Го хьисапде мегац: шин тӀадама юкъера геналле { $distance } хилча, денна радиус { $radius } тӀех зӀамига ба.

circle-radius-with-many-points = Денна радиусаца шиъал дукхагӀча тӀадамашкахьара доагӀа го кхолла мегац.

circle-invalid-center-or-through-points = Гон юкъ е тӀадамаш нийса дац.

circle-radius-center-with-multiple-points = Денна юкъаца 1-ал дукхагӀча тӀадамашкахьара доагӀача гон радиус хьисапде мегац.

circle-change-radius-non-numerical = Терахьа боаца тӀадамаш болча гон радиус хувца мегац

circle-radius-with-points-non-numerical = Терахьа мах ца хилча денна радиусаца цхьаннал дукхагӀча тӀадамашкахьара доагӀа го кхолла мегац.

circle-change-center-non-numerical = Терахьа боаца тӀадамашкахьара доагӀача гон юкъ хувцар дина дац.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Функца билгалъяьча моттига барам ца тоъ. Моттига чу { $intervals } юкъ я, функце ткъа { $inputs ->
            [one] { $inputs } чудаккхар
           *[other] { $inputs } чудаккхар
        } да.
       *[other] Функца билгалъяьча моттига барам ца тоъ. Моттига чу { $intervals } юкъ я, функце ткъа { $inputs ->
            [one] { $inputs } чудаккхар
           *[other] { $inputs } чудаккхар
        } да.
    }

function-domain-invalid-format = Функца билгалъяьча моттига формат нийса яц.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Функца терахьа доаца максимума тидам ца бу.
        [minimum] Функца терахьа доаца минимума тидам ца бу.
        [extremum] Функца терахьа доаца экстремума тидам ца бу.
        [point] Функца терахьа боаца тӀадама тидам ца бу.
        [slope] Функца терахьа доаца наклона тидам ца бу.
       *[other] Функца терахьа доаца { $type } маха тидам ца бу.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Функца ерриг йоаца максимума тидам ца бу.
        [minimum] Функца ерриг йоаца минимума тидам ца бу.
        [extremum] Функца ерриг йоаца экстремума тидам ца бу.
        [point] Функца ерриг боаца тӀадама тидам ца бу.
       *[other] Функца ерриг йоаца { $type } маха тидам ца бу.
    }

function-points-too-close = Функце вошта тӀех гаргара шиъ тӀадам ба. Функци билгалъе мегац.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Функца итерацеш хул чудаккхарий дукхал арадаккхарий дукхалца цхьатарра хилча бе. Укх функце { $inputs } чудаккхар а, { $outputs ->
            [one] { $outputs } арадаккхар
           *[other] { $outputs } арадаккхар
        } а да.
       *[other] Функца итерацеш хул чудаккхарий дукхал арадаккхарий дукхалца цхьатарра хилча бе. Укх функце { $inputs } чудаккхар а, { $outputs ->
            [one] { $outputs } арадаккхар
           *[other] { $outputs } арадаккхар
        } а да.
    }

## `<sequence>`

sequence-invalid-length = Тайпана деналле нийса яц. Из минус йоаца дийна терахь хила еза.

sequence-invalid-step = Тайпана гӀулакх нийса яц. { $type } тайпан тайпана из терахь хила деза.

sequence-invalid-endpoint-number = Терахьий тайпана «{ $attribute }» мах нийса бац. Из терахь хила деза.

sequence-invalid-endpoint-letters = Элпий тайпана «{ $attribute }» мах нийса бац. Из элпий цхьанкхетар хила деза.

sequence-invalid-endpoint = Тайпана «{ $attribute }» мах нийса бац.

select-from-sequence-coprime-not-numbers = терахьаш ца хоржаш дола дела coprime тидам ца бу

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations денна дола дела coprime тидам ца бу

## Resolving a `target`

target-not-found = `<{ $source }>` тӀа нийса доаца target: Ӏалашо ца корайо.

target-state-variable-not-found = `<{ $source }>` тӀа нийса доаца target: `<{ $component }>` элементе «{ $property }» яха цӀи йола хьала хувцалу барам ца корабаь.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` хувцалу барамаш шоаш-шоай долча барамах къаьста деза.

ode-system-duplicate-variable-names = Хьежача хувцалуча барамий цӀераш юха карладоалаш ДУ аьттухьара функцеш билгалъе мегац.

ode-system-rhs-function-error = ДУ аьттухьара функци билгалъе мегац. mathjs функци кхолла гӀалат хиннад.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } нийсача сизий юкъера сонера билгалбе мегац

angle-invalid-through-point = `<angle>` элемента through маха чу нийса боаца тӀадам

parabola-vertex-too-many-points = Денна корта болаш 1-ал дукхагӀча тӀадамашкахьара йоагӀа парабола йина яц.

parabola-too-many-points = 3-ал дукхагӀча тӀадамашкахьара йоагӀа парабола йина яц.

intersection-too-many-items = Шиъал дукхагӀча объектий вовшахкхетар дина дац

## Other math components

ionic-compound-not-two-ions = Шин ионах кхы ионий цхьанкхетар дина дац.

ionic-compound-needs-cation-and-anion = Ионий цхьанкхетар цхьан катиона а, цхьан аниона а бе дина дац.

solve-equations-cannot-evaluate = Уравнени яьшта мегац, хӀана аьлча из хьисапе яха ца делар: { $equation }

math-operators-operand-number-required = Математически операнд къаста operandNumber енна хила еза.

eigen-decomposition-failed = Матрица шийна мах хьисапбе ца делар

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } параметр кепе ца корайо, цудухьа из хӀаман даиман ерриг йоацачоа тоаргья.
       *[other] `<matchesPattern>`: { $parameters } параметраш кепе ца корайо, цудухьа уж даиман ерриг йоацачоа тоаргья.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" маха кхетаде мегац. Из none, medium, dense е моттигаца къаьстта шиъ плюсан терахь хила деза, масала grid="1 0.5". Сеть ца хьокха.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` компонента { $expected ->
        [one] цхьа арадаккхар дола функци еза — хӀор тӀадама наклон y', масала `y - x`
       *[other] шиъ арадаккхар дола функци еза — хӀор тӀадама вектор, масала `(y, -x)`
    }, деннача функце ткъа { $found ->
        [one] { $found } арадаккхар да
       *[other] { $found } арадаккхар да
    }. { $alternative ->
        [none] ХӀама ца хьокха.
       *[other] Из функца `<{ $alternative }>` компонент я. ХӀама ца хьокха.
    }

field-function-attribute-ignored-with-child = `function` атрибута тидам ца бу, хӀана аьлча функци компонента чура а еннай; чурчун пайда оал. Функци шин наькъах цхьанне бе ма ле.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибуто компонента чу нийсса яздаьча билгалдаккхара барамашта цӀераш ле. { $reason ->
        [function-child] Укхаза функци `<function>` бер санна еннай, цо шийна барамашта цӀераш ле, цудухьа `variables` тидам ца бу.
       *[no-expression] Укхаза из тайпара билгалдаккхар денна дац, цудухьа `variables` тидам ца бу.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure сурт дехкархочунга xLabelPosition="left" дина дац; аьттухьара хӀоттам лоаттабу.

prefigure-y-label-position-unsupported = `<graph>`: prefigure сурт дехкархочунга yLabelPosition="bottom" дина дац; лакхара хӀоттам лоаттабу.

prefigure-invalid-axis-bounds = `<graph>`: prefigure дерзадара доза нийса дац; бух болаш bbox (-10,-10,10,10) лоаттабу.

prefigure-invalid-width = `<graph>`: prefigure дерзадара шоралла нийса яц; диаграмма бух болаш шоралла 425 лоаттаю.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure дерзадара aspectRatio нийса дац; бух болаш оагӀонаш барам 1 лоаттабу.

prefigure-grid-spacing-too-fine = `<graph>`: сета гӀулакх дозанашта тӀех зӀамига да; prefigure сурт дехкархочунга сеть ца хьокха.

prefigure-annotations-not-rendered = `<graph>`: PreFigure сурт дехкархочох пайда ца эцаш билгалдараш ца хьокха.

multiple-annotations-children = `<graph>` чу дукха `<annotations>` бер корадаьд; тӀехьарчунна дӀаэттача кхыдараш тидам ца бу.

## Referring to other components

copy-unrecognized-component-type = Ца бовзаш болча компонента тайпа шорде е копи е мегац: { $type }.

copy-prop-not-found = { $component } тайпан компоненте { $property } яха башхал ца корайо

collect-no-source = collect тӀа хьост ца корадаь.

collect-invalid-component-type = `<{ $component }>` тайпан компонентеш гулъе мегац, хӀана аьлча из нийса доаца компонента тайпа да.

reference-index-unavailable = `{ $reference }` индекса тӀа хьажар кхолла мегац

## `<callAction>`

component-action-unavailable = `{ $reference }` компоненте { $action } кхайка мегац

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Хаамий кеп нийса яц. МогӀий деналле цхьатарра яц. Корадаьд componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Хаамашка баганай цӀераш юха карладоал. Корадаьд componentIdx :{ $componentIdx }

data-frame-missing-column-name = Хаамашка баганан цӀи ца тоъ. Корадаьд componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Укх жоапа award мах answer тега шийна дӀаденнача жоапа тӀа хьежа, цо ца хьоахаяьча хьале дала таралу.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` йолча контейнера чурча `<answer>` тӀа `maxNumAttempts` хӀоттадар хӀаманна тӀа ца кхоач, хӀана аьлча гӀортий дукхал контейнеро билгалъю. `maxNumAttempts` мах контейнера тӀа хӀоттабе.

nested-section-wide-check-work-max-num-attempts = Кхыча `sectionWideCheckWork` контейнера чу латта `sectionWideCheckWork` контейнера тӀа `maxNumAttempts` хӀоттадар хӀаманна тӀа ца кхоач, хӀана аьлча гӀортий дукхал арахьарча контейнеро билгалъю. `maxNumAttempts` мах арахьарча контейнера тӀа хӀоттабе.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality хӀоттаяь ца хилча { $attributes } атрибут хӀаманна тӀа ца кхоачаргба.
       *[other] symbolicEquality хӀоттаяь ца хилча { $attributes } атрибуташ хӀаманна тӀа ца кхоачаргба.
    }

answer-invalid-type = answer тӀа нийса доаца тайпа: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` компонента цӀи яц, цудухьа цох модула атрибут де мегац

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` компонентах модула атрибут де мегац, хӀана аьлча `<module>` компонента тайпан «{ $name }» атрибут хӀанзалца билгалъяьй.

conditional-content-condition-ignored = case е else бераш долча `<conditionalContent>` компоненте `condition` атрибута тидам ца бу.

slider-markers-type-mismatch = Маркерий тайпа ползунока тайпана ца тоъ.

pretzel-problem-needs-statement-and-answer = Нийса доаца pretzel: хӀор `<problem>` чу цхьа `<statement>` а, цхьа `<answer>` а хила деза.

pretzel-circuit-first-problem-distractor = Нийса доаца pretzel: mode="circuit" режиме хьалхара `<problem>` тидам дӀабоаккхаш хила ца еза.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибута нийса боаца мах { $values }; тидам ца бу.
       *[other] `{ $attribute }` атрибута нийса доаца мах { $values }; тидам ца бу.
    }

attribute-must-be-references = `{ $attribute }` атрибута нийса боаца мах `{ $value }`. Атрибут `$` хьаьркаца долалуча хьажарашкара латташ хила деза.

math-input-invalid-function-names = <mathInput>: { $attribute } чура нийса доаца функцешта цӀераш тидаме ца эца: { $names }. ХӀор цӀера гуш дола дакъа кӀезигагӀа 2 хьаьрк хила деза (элпаш е сизаш); цул тӀехьагӀа деза доаца `|<mathspeak альтернатива>` тӀатохар хила таралу.

## Building components from the source

component-type-invalid = Нийса доаца компонента тайпа: `<{ $componentType }>`

attribute-repeated = { $attribute } атрибут юха карлаяккха мегац.

attribute-invalid-for-component = `<{ $componentType }>` тайпан компонента нийса доаца атрибут «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } стила билгалдаккхаре { $context ->
        [text-on-background] текста бос а, фона бос а
        [high-contrast] лакха контраст болаш бос а, сурта моттиг а
        [line] сизан бос а, сурта моттиг а
        [marker] маркера бос а, сурта моттиг а
       *[text-on-canvas] текста бос а, сурта моттиг а
    } юкъе контраст ца тоъ{ $mode ->
        [dark] { " (Ӏаьржа тайпа)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кӀезигагӀа { $threshold }:1 деза).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } стила билгалдаккхаре денна бесаш сирлача тайпана тоаъаш контраст лу делха а, царах даьнна Ӏаьржача тайпан бесашта текст а, фон а юкъе тоаъаш контраст ца ло ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кӀезигагӀа { $threshold }:1 деза). { $suggestion ->
        [available] Ӏаьржача тайпа чу тоаъаш контраст хилийта е сирлача тайпан контраст алсамъяккха (масала { $lightAttribute }="{ $lightColor }"), е Ӏаьржача тайпан бос хувца (масала { $darkAttribute }="{ $darkColor }").
       *[none] Ӏаьржача тайпа чу тоаъаш контраст хилийта сирлача тайпан контраст алсамъяккха е даьнна бесаш textColorDarkMode а/е backgroundColorDarkMode а тӀехьара хувца.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } стила билгалдаккхаре денна текста бос сирлача тайпана тоаъаш контраст лу белха а, цох баьнна Ӏаьржача тайпан текста бос сурта моттигаца тоаъаш контраст ца ло ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; кӀезигагӀа { $threshold }:1 деза). { $suggestion ->
        [available] Ӏаьржача тайпа чу тоаъаш контраст хилийта е сирлача тайпан контраст алсамъяккха (масала textColor="{ $lightColor }"), е Ӏаьржача тайпан бос хувца (масала textColorDarkMode="{ $darkColor }").
       *[none] Ӏаьржача тайпа чу тоаъаш контраст хилийта сирлача тайпан контраст алсамъяккха е баьнна бос textColorDarkMode тӀехьара хувца.
    }

section-multiple-style-palettes = Корто цхьа <stylePalette> бе харжа мегац; тӀехьарчох пайда оал.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } тӀа юха карладоацаш дола варианташ билгалде мегац, хӀана аьлча numToSelect минус йоаца дийна терахь яц.

variant-num-to-select-not-constant-number = { $component } тӀа юха карладоацаш дола варианташ билгалде мегац, хӀана аьлча numToSelect хувцалуш йоаца терахь яц.

variant-with-replacement-not-constant-boolean = { $component } тӀа юха карладоацаш дола варианташ билгалде мегац, хӀана аьлча withReplacement хувцалуш боаца логически мах бац.

variant-select-weight-disables-unique = цхьан харжаме selectWeight е selectForVariants денна хилча, select тӀа юха карладоацаш дола варианташ дӀадоах

variant-coprime-undetermined = { $component } тӀа юха карладоацаш дола варианташ билгалде мегац, хӀана аьлча coprime даиман харц йолаш я аьнна билгалде мегац.

variant-attribute-not-constant = { $component } тӀа юха карладоацаш дола варианташ билгалде мегац, хӀана аьлча { $attribute } хувцалуш йоацар яц.

variant-attribute-not-number = { $component } тӀа юха карладоацаш дола варианташ билгалде мегац, хӀана аьлча { $attribute } терахь яц.

variant-attribute-wrong-type-for-sequence =
    { $type } тайпан { $component } тӀа юха карладоацаш дола варианташ билгалде мегац, хӀана аьлча { $attribute } { $expected ->
        [letters-combination] элпий цхьанкхетар
        [math-expression] тоаъаш дола математически билгалдаккхар
        [integer] дийна терахь
       *[number] терахь
    } яц.

variant-length-not-integer = { $component } тӀа юха карладоацаш дола варианташ билгалде мегац, хӀана аьлча length дийна терахь яц.

variant-sort-not-implemented = sort йолча { $component } тӀа юха карладоацаш дола варианташ дина дац

variant-exclude-combinations-not-implemented = excludeCombinations йолча { $component } тӀа юха карладоацаш дола варианташ дина дац

variant-math-exclude-not-implemented = exclude йолча math тайпан { $component } тӀа юха карладоацаш дола варианташ дина дац

variant-non-constant-exclude-not-implemented = хувцалуш йоаца exclude йолча { $component } тӀа юха карладоацаш дола варианташ дина дац

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: графика prefigure сурт дехкархочунга дина дац; тӀехье дӀатесай.

prefigure-descendant-invalid-geometry = { $subject }: чаккхе йоаца е кхачаза геометри; тӀехье дӀатесай.

prefigure-curve-label-omitted = { $subject }: дерзабаьча сизий элементашка хьаьркаш дина дац; хьаьрк дӀатесай.

prefigure-curve-unsupported-definition-type = { $subject }: дина доаца сизан функца билгалдаккхара тайпа «{ $definitionType }»; тӀехье дӀатесай.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves элемента flipFunctions атрибут дина дац; тӀехье дӀатесай.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves тӀа формулаца денна берий функцеш бе ца эца; тӀехье дӀатесай.

prefigure-label-position-unsupported =
    { $subject }: дина доаца labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] сизий доазала хьаьркана
       *[point] тӀадама хьаьркана
    }; PreFigure бух болаш нисдар лоаттаду.

prefigure-fill-style-unsupported = { $subject }: дузара стиль «{ $fillStyle }» PreFigure тӀа дина дац; ерриг дузара доал.

prefigure-line-style-unknown = { $subject }: ца бовзаш болаш сизан стиль «{ $lineStyle }» PreFigure арадаккхарара дӀабаьккхаб.

prefigure-marker-style-mapped-to-diamond = { $subject }: маркера стиль «{ $markerStyle }» PreFigure «diamond» стилаца нисбаьб.

prefigure-marker-style-unsupported = { $subject }: маркера стиль «{ $markerStyle }» PreFigure тӀа дина дац; бух болаш стиль лоаттабу.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: нийса доаца `ref`; Ӏалашо тохае мегац. Билгалдар дӀадаьккхад.

annotation-ref-multiple-targets = `<annotation>`: `ref` дукхача Ӏалашонашца тохаяьй; хьалхарчох пайда оал.

annotation-ref-outside-graph = `<annotation>`: нийса доаца `ref`; Ӏалашо чура графикех арахьа я. Билгалдар дӀадаьккхад.

annotation-ref-unsupported-target = `<annotation>`: нийса доаца `ref`; Ӏалашо prefigure дерзадаре дина дола график объект яц. Билгалдар дӀадаьккхад.

annotation-text-missing = `<annotation>`: `text` яц е ерриг яц; ерриг йоаца текст арахьокх.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Гон хьажар корадаьд.
       *[other] `<{ $componentType }>` компонента чу дола гон хьажар корадаьд.
    }

reference-no-referent = Хьажарна объект ца корайо: `{ $reference }`

reference-multiple-referents = Хьажарна дукха объекташ корадаь: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` элемента { $attribute } атрибута формат нийса яц.

children-invalid = `<{ $componentType }>` тӀа нийса доаца бераш: нийса доаца бераш корадаь: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибута нийса боаца мах `{ $value }`; `{ $default }` махах пайда оал

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } верси ца корайо.
       *[other] DoenetML { $version } верси ца корайо. { $fallback } версех пайда оал
    }

## Reading the DoenetML

parse-invalid-doenetml = Нийса доаца DoenetML: { $content }

parse-tag-missing-close-tag = Нийса доаца DoenetML: `{ $tag }` тега дӀакъовла тег яц. Ше дӀакъовлаш йола тег е `</{ $tagName }>` тег хьоахаяь яр.

parse-tag-error = Нийса доаца DoenetML: `<{ $tagName }>` теге гӀалат

parse-attribute-missing-value = Нийса доаца DoenetML: `{ $attribute }` атрибута мах ца тоъ санна ба.

parse-attribute-invalid = Нийса доаца DoenetML: нийса йоаца атрибут `{ $attribute }`

parse-attribute-value-invalid = Нийса доаца DoenetML: атрибута нийса боаца мах `{ $value }`

parse-attribute-value-quote-mismatch = Нийса доаца DoenetML: атрибута нийса боаца мах `{ $value }`. Кавычкаш ца тоъ. `{ $quote }` ца тоъ санна я

parse-open-tag-name-missing = Нийса доаца DoenetML: цӀи йоаца тег корайо, масала `<`

parse-tag-not-closed = Нийса доаца DoenetML: `{ $tag }` тег дӀакъовлаяь яц (`>` ца тоъ санна я).

parse-self-closing-tag-name-missing = Нийса доаца DoenetML: цӀи йоаца тег корайо `<{ $content }>`

parse-self-closing-tag-not-closed = Нийса доаца DoenetML: `{ $tag }` тег дӀакъовлаяь яц (`/>` ца тоъ санна я).

parse-tag-invalid-attributes = Нийса доаца DoenetML: `{ $tag }` тег тоаъаш яц. Цун атрибуташ нийса ца хила таралу.

parse-close-tag-name-missing = Нийса доаца DoenetML: цӀи йоаца дӀакъовла тег корайо, масала `</`

parse-attribute-value-unquoted = Атрибута мах кавычкий чу хила беза: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Нийса доаца DoenetML: `{ $tag }` дӀакъовла тег корайо, бакъда цунна тоаъаш йолалу тег яц

parse-close-tag-mismatched = Нийса доаца DoenetML: ца тоаъ дӀакъовла тег. `</{ $expected }>` хьоахаяь яр. `{ $found }` корайо

parser-node-unconvertible = { $node } узел Dast узела тӀа дерза ца делар.

## Names

name-attribute-invalid =
    Нийса йоаца атрибут name='{ $name }'. { $reason ->
        [characters] ЦӀерашка элпаш, терахьаш, кӀалхьара сизаш е сизаш бе хила ца таралу.
       *[start] ЦӀераш элпаца йолалуш хила еза.
    }

component-name-invalid-start = Нийса йоаца компонента цӀи «{ $name }». ЦӀераш элпаца йолалуш хила еза.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched тайпан answer video атрибутаца хила деза

answer-video-watched-video-not-reference = videoWatched тайпан answer-а video атрибут хьажар хила еза

answer-name-not-single-text = answer-а name атрибута чу цхьа текста бер бе хила ца деза

## Referencing another document

external-doenetml-recursion-limit = Рекурса тӀегӀанаш тӀех дукха да, цудухьа арахьара DoenetML эца ца делар. Гон хьажар яц те?

external-doenetml-unavailable = { $attribute }="{ $uri }" адресара DoenetML эца ца делар

external-doenetml-type-mismatch = { $attribute }="{ $uri }" адресара нийса доаца DoenetML эцад: из «{ $componentType }» компонента тайпана ца тийшар

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут йоаяьй; цун метта `{ $to }` лелае.
       *[other] [deprecation] `<{ $component }>` элемента `{ $from }` атрибут йоаяьй; цун метта `{ $to }` лелае.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` атрибут йоаяьй а, цун тидам ца бу а, хӀана аьлча `{ $to }` а еннай.
       *[other] [deprecation] `<{ $component }>` элемента `{ $from }` атрибут йоаяьй а, цун тидам ца бу а, хӀана аьлча `{ $to }` а еннай.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` элемента `{ $attribute }` атрибут йоаяьй а, цун тидам ца бу а.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` элемента `{ $attribute }` атрибут йоаяьй; цун метта `<{ $child }>` бер лелае.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` элемента `{ $attribute }` атрибута `{ $value }` мах бухбаьнна ба; цун метта `{ $to }` лелае.


## Language coverage

pluralize-english-only = `<pluralize>` дукхала терахьа тӀа ингалса метта бе де мегац, цудухьа { $locale } метта яздаьча документе цун текст хувцаш дац. Дукхала кеп Ӏа язъе, е из `pluralForm` атрибутаца лаьрхӀае.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` элемент бовзаш болаш Doenet элемент бац.

schema-element-not-allowed-at-root = `<{ $tag }>` элемента документа орамехьа бокъо ца ло.

schema-element-not-allowed-inside = `<{ $tag }>` элемента `<{ $parent }>` чу бокъо ца ло.

schema-attribute-unrecognized = `<{ $tag }>` элементе `{ $attribute }` яха цӀи йола атрибут яц.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` элемента `{ $attribute }` атрибут хӀор элемент укхарех цхьаъ болаш список хила еза: { $allowed }
       *[other] `<{ $tag }>` элемента `{ $attribute }` атрибут укхарех цхьаъ хила еза: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select тӀа нийса йоаца варианта цӀи. { $variantName } варианта цӀи { $numOptions } харжаме корайо, харжа езар ткъа { $numToSelect } я.

select-variant-name-without-options = select тӀа варианташ еннай, бакъда хила тарлуча варианта цӀерага цхьа харжам а бац: { $variantName }.

select-variant-name-not-possible = select тӀа денна { $variantName } варианта цӀи хила тарлуча варианта цӀи яц.

select-too-few-options = Дерригаш { $numOptions } юкъера { $numToSelect } компонент харжа мегац.

select-from-sequence-too-few-values = Деналле { $length } йолча тайпанах { $numToSelect } мах харжа мегац.

select-from-sequence-indices-count-mismatch = select тӀа деннача индексий дукхал харжа езача дукхала тоаъ еза

select-from-sequence-indices-not-integers = select тӀа денна масса индексаш дийна терахь хила еза

select-from-sequence-index-excluded = selectfromsequence тӀа денна индекс дӀабаьккха бар

select-from-sequence-indices-excluded-combination = selectfromsequence тӀа денна индексаш дӀадаьккха цхьанкхетар дар

select-from-sequence-coprime-not-positive-integers = Плюсан дийна терахьаш ца хоржаш дола дела вошта хьалха доаца цхьанкхетараш харжа мегац.

select-from-sequence-coprime-common-factor = Вошта хьалха доаца терахьаш харжа мегац. Массаза хила тарлуча маха цхьан декъархо ба. (Денна "from" е "to" мах "step"-аца вошта хьалха боацаш хила беза.)

select-from-sequence-coprime-single-number = 1 йоаца цхьан терахьах вошта хьалха доаца цхьанкхетараш харжа мегац.

select-from-sequence-excluded-too-many-combinations = selectFromSequence чу цхьанкхетарий 70%-ал дукхагӀчарех дӀадаьхад

select-from-sequence-coprime-none-found = Вошта хьалха доаца терахьаш харжа ца делар. Массаза хила тарлуча маха цхьан декъархо ба.

select-from-sequence-too-few-unique-values = Деналле { $numPossibleValues } йолча тайпанах { $numToSelect } башха мах харжа мегац

select-prime-numbers-too-few-values = Деналле { $numValues } йолча хьалхарча терахьий спискех { $numToSelect } мах харжа мегац

select-prime-numbers-values-count-mismatch = select тӀа деннача махай дукхал харжа езача дукхала тоаъ еза

select-prime-numbers-values-not-prime = select prime number тӀа денна масса мах хьалхарча терахьий списке хила беза

select-prime-numbers-values-excluded-combination = selectPrimeNumbers тӀа денна мах дӀабаьккха цхьанкхетар дар

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers чу цхьанкхетарий 70%-ал дукхагӀчарех дӀадаьхад

select-random-combination-fluke = ТӀех хила ца тарлуча хӀамаца ца ховча махай цхьанкхетар харжа ца делар

select-random-value-fluke = ТӀех хила ца тарлуча хӀамаца ца ховш бола мах харжа ца делар
