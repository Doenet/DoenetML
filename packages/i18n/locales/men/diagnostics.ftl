# Mende diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element names, attribute names and attribute values — `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `math`, `text` and the rest —
# are part of the language rather than prose, and stay in English exactly as
# written.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] ti { $attributes } wumbu ji ti nsuka fele yɛlɛ
       *[other] ti { $attributes } wumbu ji ti nsuka fele yɛlɛ
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] ti { $attributes } wumbu ji ti nsuka kɛ ndɛvɛ ti fele yɛlɛ
       *[other] ti { $attributes } wumbu ji ti nsuka kɛ ndɛvɛ ti fele yɛlɛ
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ii yenge wue ina ndɛvɛ ii lɔ

## `<line>`

line-points-undetermined-dimensions = Laing na a li tɔkpɔisia ma na ti gbotoma ii majɔɔ.

line-points-too-few-dimensions = Laing i lɔ i li tɔkpɔisia ma na ti gbotoma fele ɔɔ na wa woma.

line-points-depend-on-variables = Laing a li tɔkpɔisia ma na ti lɔ wotelasia ma: { $variables }.

line-equation-invalid-format = Laing ikweshɔn mɔla ii tonya { $variable1 } kɛ { $variable2 } hu.

## `<ray>`

ray-overprescribed-through = Ti re yɛlɛ a through, endpoint kɛ direction.  Ti through na ti yɛlɛ wumbu.

ray-dimension-mismatch = numDimensions ii yɛlɛ kɛnɛi re hu.

## `<vector>`

vector-overprescribed-head = Ti vɛkta yɛlɛ a head, tail kɛ displacement.  Ti head na ti yɛlɛ wumbu.

vector-dimension-mismatch = numDimensions ii yɛlɛ kɛnɛi vɛkta hu.

## Attracting and constraining

attract-to-without-nearest-point = Ti ii gula ti li `<{ $component }>` ma va ngi nearestPoint stet wotela ii lɔ.

constrain-to-without-nearest-point = Ti ii gula ti gbɔkɔ `<{ $component }>` ma va ngi nearestPoint stet wotela ii lɔ.

constrain-to-interior-without-nearest-point = Ti ii gula ti gbɔkɔ `<{ $component }>` bu va ngi nearestPoint stet wotela ii lɔ.

## `<choiceInput>`

choice-input-label-position-ignored = ti labelPosition wumbu choiceInput na ii inline va

## Ordering children by index

choice-input-indices-count-mismatch = Ti indices na ti yɛlɛ choiceInput va wumbu va indices namba ii yɛlɛ kɛnɛi choice ndoisia namba ma.

pretzel-indices-count-mismatch = Ti indices na ti yɛlɛ problem va wumbu va indices namba ii yɛlɛ kɛnɛi problem ndoisia namba ma.

shuffle-indices-count-mismatch = Ti indices na ti yɛlɛ shuffle va wumbu va indices namba ii yɛlɛ kɛnɛi hindeisia namba ma.

indices-ignored-out-of-range = Ti indices na ti yɛlɛ { $component } va wumbu va ti gbesia ti lɔ ndɔlɔ gbe.

pretzel-indices-repeated = Ti indices na ti yɛlɛ pretzel va wumbu va ti gbesia ti yɛlɛ gbɔma.

pretzel-circuit-first-index = Ti indices na ti yɛlɛ pretzel va mode="circuit" hu wumbu va index na lɔ ma i lɔ i yɛlɛ 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Kɔ `<{ $component }>` i yenge wue a string ndoisia, `type` attribute i lɔ i yɛlɛ.

invalid-type-defaulting-to-math = Type { $type } ii tonya { $component } va. I lɔ i yɛlɛ math, text, number ɔɔ boolean. Ti a math wue.

string-not-valid-component-to-arrange = String "{ $value }" ii hinda tonya { $component } va. Ti a ngi wumbu.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } ii tonya, ti type wote number ma.

invalid-variable-value = Wotela hinda na ii tonya: `{ $value }`

## Variants

variant-index-must-be-number = Wotela index { $index } i lɔ i yɛlɛ namba

variant-index-must-be-integer = Wotela index { $index } i lɔ i yɛlɛ namba kpɛlɛ

## `<sideBySide>`

side-by-side-absolute-widths = Ti `<{ $component }>` ii yɛlɛ gɔɔla kpɛlɛ va. Ti wala wote gɔɔla gbe ma.

side-by-side-absolute-margins = Ti `<{ $component }>` ii yɛlɛ gɔɔla kpɛlɛ va. Ti ngɔwusia wote gɔɔla gbe ma.

side-by-side-no-block-child = `<{ $component }>` ii tonya: i lɔ i block ndoi yila ɔɔ na wa woma majɔɔ.

## `<label>`

label-for-ignored-on-graphical = Ti `for` attribute na lɔ kɛlɛma `<label>` ma wumbu.

label-for-must-resolve-to-one = `for` attribute na lɔ `<label>` ma i lɔ i li hinda yila pɛ ma.

label-for-unresolved = `for` attribute na lɔ `<label>` ma ii gula i li hinda gbi ma.

label-for-answer-with-authored-inputs = `for` attribute na lɔ `<label>` ma a `<answer>` yɛpɛ na inputsia ti yɛlɛ; yɛpɛ input ma kɛnɛi.

label-for-answer-without-input = `for` attribute na lɔ `<label>` ma a `<answer>` yɛpɛ na input ii lɔ.

label-for-must-reference-input-or-answer = `for` attribute na lɔ `<label>` ma i lɔ i input ɔɔ answer yɛpɛ.

## Accessibility

accessibility-short-description-or-decorative = Majɔɔla va, `<{ $component }>` i lɔ i hugɔɔla kulɔ majɔɔ ɔɔ ti yɛlɛ kɛ decorative.

accessibility-video-short-description = Majɔɔla va, `<video>` i lɔ i hugɔɔla kulɔ majɔɔ.

accessibility-input-short-description-or-label = Majɔɔla va, `<{ $component }>` i lɔ i hugɔɔla kulɔ ɔɔ biye majɔɔ.

accessibility-answer-input-short-description-or-label = Majɔɔla va, `<answer>` na a input yɛlɛ i lɔ i hugɔɔla kulɔ ɔɔ biye majɔɔ.

accessibility-short-description-contains-math = Hugɔɔla kulɔsia ti ii lɔ ti mat hindeisia kɛ `<{ $component }>` majɔɔ. Nyɛingɔ mat a njepeisia.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ii wotela wa majɔɔ gbua woma njepei va (mode teli) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i lɔ i yɛlɛ { $threshold }:1 ɔɔ na wa woma).
       *[other] { $colorName } ii wotela wa majɔɔ gbua woma njepei va ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i lɔ i yɛlɛ { $threshold }:1 ɔɔ na wa woma).
    }

## `<circle>`

circle-through-points-non-numerical = Ti `<circle>` na a li tɔkpɔisia { $count } ma ii yɛlɛ ina tɔkpɔisia ti nambasia ii lɔ.

circle-too-many-through-points = Ti ii gula ti kolɔ gɔɔ na a li tɔkpɔisia 3 ma na wa woma.

circle-overprescribed-radius-center-points = Ti ii gula ti kolɔ gɔɔ a radius, ndɛvɛ kɛ tɔkpɔisia kpɛlɛ.

circle-center-with-multiple-points = Ti ii gula ti kolɔ gɔɔ a ndɛvɛ na a li tɔkpɔi 1 ma na wa woma.

circle-radius-too-small = Ti ii gula ti kolɔ gɔɔ: ina tɔkpɔisia fele ti ndɔlɔ a { $distance }, radius { $radius } na ti yɛlɛ i kulɔ wa.

circle-radius-with-many-points = Ti ii gula ti kolɔ yɛlɛ na a li tɔkpɔisia fele ma na wa woma a radius na ti yɛlɛ.

circle-invalid-center-or-through-points = Kolɔ ndɛvɛ ɔɔ ngi tɔkpɔisia ti ii tonya.

circle-radius-center-with-multiple-points = Ti ii gula ti kolɔ radius gɔɔ a ndɛvɛ na a li tɔkpɔi 1 ma na wa woma.

circle-change-radius-non-numerical = Ti ii gula ti kolɔ radius wote a tɔkpɔisia na ti nambasia ii lɔ

circle-radius-with-points-non-numerical = Ti ii gula ti kolɔ yɛlɛ na a li tɔkpɔi yila ma na wa woma a radius ina nambasia ti ii lɔ.

circle-change-center-non-numerical = Kolɔ ndɛvɛ wotela na a li tɔkpɔisia ma na ti nambasia ii lɔ ii yɛlɛ.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Gbotomasia ti ii gbɔyɔ fɔnkshɔn domain va. Domain a wati gbua { $intervals } majɔɔ kɛɛ fɔnkshɔn a { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        } majɔɔ.
       *[other] Gbotomasia ti ii gbɔyɔ fɔnkshɔn domain va. Domain a wati gbua { $intervals } majɔɔ kɛɛ fɔnkshɔn a { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        } majɔɔ.
    }

function-domain-invalid-format = Fɔnkshɔn domain mɔla ii tonya.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ti fɔnkshɔn wai na namba ii lɔ wumbu.
        [minimum] Ti fɔnkshɔn kulɔi na namba ii lɔ wumbu.
        [extremum] Ti fɔnkshɔn nsuka na namba ii lɔ wumbu.
        [point] Ti fɔnkshɔn tɔkpɔi na namba ii lɔ wumbu.
        [slope] Ti fɔnkshɔn kpandila na namba ii lɔ wumbu.
       *[other] Ti fɔnkshɔn { $type } na namba ii lɔ wumbu.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ti fɔnkshɔn wai na hinda ii lɔ hu wumbu.
        [minimum] Ti fɔnkshɔn kulɔi na hinda ii lɔ hu wumbu.
        [extremum] Ti fɔnkshɔn nsuka na hinda ii lɔ hu wumbu.
        [point] Ti fɔnkshɔn tɔkpɔi na hinda ii lɔ hu wumbu.
       *[other] Ti fɔnkshɔn { $type } na hinda ii lɔ hu wumbu.
    }

function-points-too-close = Fɔnkshɔn a tɔkpɔisia fele majɔɔ na ti gbualɔ kɛnɛi wa. Ti ii gula ti fɔnkshɔn hugɔɔ.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Fɔnkshɔn gbɔmalasia ti gula pɛ ina inputsia namba a yɛlɛ kɛnɛi outputsia namba ma. Fɔnkshɔn ji a input { $inputs } kɛ { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        } majɔɔ.
       *[other] Fɔnkshɔn gbɔmalasia ti gula pɛ ina inputsia namba a yɛlɛ kɛnɛi outputsia namba ma. Fɔnkshɔn ji a input { $inputs } kɛ { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        } majɔɔ.
    }

## `<sequence>`

sequence-invalid-length = Sequence ndɔlɔ ii tonya.  I lɔ i yɛlɛ namba kpɛlɛ na ii lɔ ziro bu.

sequence-invalid-step = Sequence step ii tonya.  I lɔ i yɛlɛ namba sequence type { $type } va.

sequence-invalid-endpoint-number = Number sequence "{ $attribute }" ii tonya.  I lɔ i yɛlɛ namba.

sequence-invalid-endpoint-letters = Letters sequence "{ $attribute }" ii tonya.  I lɔ i yɛlɛ lɛta gbɔɔla.

sequence-invalid-endpoint = Sequence "{ $attribute }" ii tonya.

select-from-sequence-coprime-not-numbers = ti coprime wumbu va ti ii nambasia hɛnda

select-from-sequence-coprime-with-exclude-combinations = ti coprime wumbu va ti excludeCombinations yɛlɛ

## Resolving a `target`

target-not-found = `<{ $source }>` target ii tonya: ti ii gula ti target majɔɔ.

target-state-variable-not-found = `<{ $source }>` target ii tonya: ti ii gula ti stet wotela na ngi biye a "{ $property }" majɔɔ `<{ $component }>` ma.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` wotelasia ti lɔ ti gbualɔ wotela na lɔ ngi yɔɔ ma.

ode-system-duplicate-variable-names = Ti ii gula ti ODE RHS fɔnkshɔnsia hugɔɔ a wotela biyeisia na ti yɛlɛ gbɔma.

ode-system-rhs-function-error = Ti ii gula ti ODE RHS fɔnkshɔn hugɔɔ.  Hinda nyamu lɔ mathjs fɔnkshɔn yɛlɛla hu.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ti ii gula ti angul hugɔɔ laingsia { $count } gbualɔ

angle-invalid-through-point = Tɔkpɔi ii tonya `<angle>` ngi through hu

parabola-vertex-too-many-points = Parabola a vertex na a li tɔkpɔi 1 ma na wa woma ii yɛlɛ.

parabola-too-many-points = Parabola na a li tɔkpɔisia 3 ma na wa woma ii yɛlɛ.

intersection-too-many-items = Hindeisia fele na wa woma ti gbualɔla ii yɛlɛ

## Other math components

ionic-compound-not-two-ions = Ayɔn gbɔɔla hinda gbe va na ii ayɔn fele ii yɛlɛ.

ionic-compound-needs-cation-and-anion = Ti ayɔn gbɔɔla yɛlɛ katayɔn yila kɛ anayɔn yila pɛ va.

solve-equations-cannot-evaluate = Ti ii gula ti ikweshɔn gulɔ va ti ii gula ti ngi gɔɔ: { $equation }

math-operators-operand-number-required = operandNumber i lɔ i yɛlɛ ina ti mat operand wumbu.

eigen-decomposition-failed = Ti ii gula ti matriks aygɛnvalyusia gɔɔ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } ii lɔ patan hu, fale i a yɛlɛ kɛnɛi hinda gbi ma wati kpɛlɛ.
       *[other] `<matchesPattern>`: parameter { $parameters } ti ii lɔ patan hu, fale ti a yɛlɛ kɛnɛi hinda gbi ma wati kpɛlɛ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ti ii gula ti grid="{ $grid }" hugɔɔ. I lɔ i yɛlɛ none, medium, dense, ɔɔ nambasia fele na ti lɔ ziro woma na ndɔlɔ a ti gbualɔ, kɛ grid="1 0.5". Ti grid gbi ii yɛlɛ.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ii yenge wue prefigure gɛnɛmɔi hu; ti a kɔmɛ gbua yenge wue.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ii yenge wue prefigure gɛnɛmɔi hu; ti a woma gbua yenge wue.

prefigure-invalid-axis-bounds = `<graph>`: aksis ngɔwusia ti ii tonya prefigure va; ti a bbox (-10,-10,10,10) wue.

prefigure-invalid-width = `<graph>`: wala ii tonya prefigure va; ti a wala 425 wue.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ii tonya prefigure va; ti a aspɛkt reshio 1 wue.

prefigure-grid-spacing-too-fine = `<graph>`: grid ndɔlɔi i kulɔ wa aksis ngɔwusia va; ti grid wumbu prefigure gɛnɛmɔi hu.

prefigure-annotations-not-rendered = `<graph>`: annotations ti ii gɛnɛ ina ti ii PreFigure gɛnɛmɔi wue.

multiple-annotations-children = Ti `<annotations>` ndoisia gbotoma majɔɔ `<graph>` hu; ti kpɛlɛ wumbu na lɔ nsuka ma va.

## Referring to other components

copy-unrecognized-component-type = Ti ii gula ti hinda mɔla na ti ii majɔɔ hɛnda ɔɔ ti ngi hɛlɛ: { $type }.

copy-prop-not-found = Ti ii gula ti prop { $property } majɔɔ hinda mɔla { $component } ma

collect-no-source = Ti gulɔla gbi ii majɔɔ collect va.

collect-invalid-component-type = Ti ii gula ti hindeisia mɔla `<{ $component }>` gbɔɔ va mɔla ii tonya.

reference-index-unavailable = Ti ii gula ti index `{ $reference }` yɛpɛ

## `<callAction>`

component-action-unavailable = Ti ii gula ti { $action } lolɔ hinda `{ $reference }` ma

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Data mɔla ii tonya.  Lɔlɔisia ti ndɔlɔsia ti gbualɔ. Ti majɔɔ componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data a kɔlum biyeisia na ti yɛlɛ gbɔma majɔɔ.  Ti majɔɔ componentIdx :{ $componentIdx }

data-frame-missing-column-name = Kɔlum biye yila ii lɔ data hu.  Ti majɔɔ componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Njepe ji ngi award a lɔ answer tag ngi njepe na i venga ma, na a hinda wa wa na bi ii ma gɔɔ.

answer-max-num-attempts-in-section-wide-check-work = Ina bi `maxNumAttempts` yɛlɛ `<answer>` na lɔ hinda na a `sectionWideCheckWork` majɔɔ bu ma, ii yenge wue, va hinda na a gɔɔlasia namba gbɔɔ. Yɛlɛ `maxNumAttempts` hinda na ma.

nested-section-wide-check-work-max-num-attempts = Ina bi `maxNumAttempts` yɛlɛ hinda na a `sectionWideCheckWork` majɔɔ tao i lɔ hinda gbe na a `sectionWideCheckWork` majɔɔ bu ma, ii yenge wue, va hinda na lɔ kɔmɛ a gɔɔlasia namba gbɔɔ. Yɛlɛ `maxNumAttempts` hinda na lɔ kɔmɛ ma.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] { $attributes } attribute ii yenge wue ina symbolicEquality ii yɛlɛnga.
       *[other] { $attributes } attribute ti ii yenge wue ina symbolicEquality ii yɛlɛnga.
    }

answer-invalid-type = Njepei type ii tonya: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Va hinda `<{ $component }>` ngi biye ii lɔ, ti ii gula ti ngi wue kɛ module attribute

module-attribute-name-already-defined = Ti ii gula ti hinda `<{ $component } name="{ $name }">` wue kɛ module attribute va `<module>` a "{ $name }" attribute majɔɔ kunafɔ.

conditional-content-condition-ignored = Ti `condition` attribute wumbu `<conditionalContent>` na a case ɔɔ else ndoisia majɔɔ ma.

slider-markers-type-mismatch = Markers type ii yɛlɛ kɛnɛi slider type ma.

pretzel-problem-needs-statement-and-answer = Pretzel ii tonya: `<problem>` gbi i lɔ i `<statement>` yila kɛ `<answer>` yila majɔɔ.

pretzel-circuit-first-problem-distractor = Pretzel ii tonya: mode="circuit" hu, `<problem>` na lɔ ma ii gula i yɛlɛ distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Hinda { $values } ii tonya attribute `{ $attribute }` va; ti a ngi wumbu.
       *[other] Hindeisia { $values } ti ii tonya attribute `{ $attribute }` va; ti a ti wumbu.
    }

attribute-must-be-references = Hinda `{ $value }` ii tonya attribute `{ $attribute }` va. Attribute i lɔ i yɛlɛ hɛndeisia na ti yɛpɛ a `$`.

math-input-invalid-function-names = <mathInput>: ti fɔnkshɔn biyeisia na ti ii tonya wumbu { $attribute } hu: { $names }. Biye gbi ngi gɛnɛla gbua i lɔ i lɛtasia fele ɔɔ na wa woma majɔɔ (lɛtasia ɔɔ dashsia); `|<mathspeak alternative>` a gula i wa woma.

## Building components from the source

component-type-invalid = Hinda mɔla ii tonya: `<{ $componentType }>`

attribute-repeated = Ti ii gula ti attribute { $attribute } yɛlɛ gbɔma.

attribute-invalid-for-component = Attribute "{ $attribute }" ii tonya hinda mɔla `<{ $componentType }>` va.

## Style definition contrast

style-definition-insufficient-contrast =
    Mɔla hugɔɔla { $styleNumber } ii wotela wa majɔɔ { $context ->
        [text-on-background] njepei kala kɛ woma kala ti gbualɔ
        [high-contrast] wotela wa kala kɛ kanvas ti gbualɔ
        [line] laing kala kɛ kanvas ti gbualɔ
        [marker] tɔkpɔi kala kɛ kanvas ti gbualɔ
       *[text-on-canvas] njepei kala kɛ kanvas ti gbualɔ
    }{ $mode ->
        [dark] { " (mode teli)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i lɔ i yɛlɛ { $threshold }:1 ɔɔ na wa woma).

style-definition-dark-mode-text-background-contrast =
    Kɛɛ mɔla hugɔɔla { $styleNumber } a kalasia majɔɔ na ti wotela wa majɔɔ mode kɔlɛ va, mode teli kalasia na ti wa ti hu ti ii wotela wa majɔɔ njepei kala kɛ woma kala ti gbualɔ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i lɔ i yɛlɛ { $threshold }:1 ɔɔ na wa woma). { $suggestion ->
        [available] Kɔ wotela wa i majɔɔ mode teli hu, wa mode kɔlɛ wotela ma (kɛlɛma va, yɛlɛ { $lightAttribute }="{ $lightColor }") ɔɔ wote mode teli kala (kɛlɛma va, yɛlɛ { $darkAttribute }="{ $darkColor }").
       *[none] Kɔ wotela wa i majɔɔ mode teli hu, wa mode kɔlɛ wotela ma ɔɔ wote kalasia a textColorDarkMode ɔɔ backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Kɛɛ mɔla hugɔɔla { $styleNumber } a njepei kala majɔɔ na a wotela wa majɔɔ mode kɔlɛ va, mode teli njepei kala na i wa ngi hu ii wotela wa majɔɔ kanvas ma ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i lɔ i yɛlɛ { $threshold }:1 ɔɔ na wa woma). { $suggestion ->
        [available] Kɔ wotela wa i majɔɔ mode teli hu, wa mode kɔlɛ wotela ma (kɛlɛma va, yɛlɛ textColor="{ $lightColor }") ɔɔ wote mode teli kala (kɛlɛma va, yɛlɛ textColorDarkMode="{ $darkColor }").
       *[none] Kɔ wotela wa i majɔɔ mode teli hu, wa mode kɔlɛ wotela ma ɔɔ wote kala a textColorDarkMode.
    }

section-multiple-style-palettes = Gbua a gula i <stylePalette> yila pɛ hɛnda; ti a na lɔ nsuka ma wue.

## Unique variants

variant-num-to-select-not-non-negative-integer = ti ii gula ti { $component } wotela gbesia majɔɔ va numToSelect ii namba kpɛlɛ na ii lɔ ziro bu.

variant-num-to-select-not-constant-number = ti ii gula ti { $component } wotela gbesia majɔɔ va numToSelect ii namba na ii wote.

variant-with-replacement-not-constant-boolean = ti ii gula ti { $component } wotela gbesia majɔɔ va withReplacement ii boolean na ii wote.

variant-select-weight-disables-unique = Ti select wotela gbesia gbɔkɔ ina option gbi a selectWeight ɔɔ selectForVariants majɔɔ

variant-coprime-undetermined = ti ii gula ti { $component } wotela gbesia majɔɔ va ti ii gula ti gɔɔ ina coprime a ngunya wati kpɛlɛ.

variant-attribute-not-constant = ti ii gula ti { $component } wotela gbesia majɔɔ va { $attribute } a wote.

variant-attribute-not-number = ti ii gula ti { $component } wotela gbesia majɔɔ va { $attribute } ii namba.

variant-attribute-wrong-type-for-sequence =
    ti ii gula ti { $component } type { $type } wotela gbesia majɔɔ va { $attribute } ii { $expected ->
        [letters-combination] lɛta gbɔɔla
        [math-expression] mat njepe tonya
        [integer] namba kpɛlɛ
       *[number] namba
    }.

variant-length-not-integer = ti ii gula ti { $component } wotela gbesia majɔɔ va length ii namba kpɛlɛ.

variant-sort-not-implemented = { $component } kɛ sort ti wotela gbesia ti ii yɛlɛ

variant-exclude-combinations-not-implemented = { $component } kɛ excludeCombinations ti wotela gbesia ti ii yɛlɛ

variant-math-exclude-not-implemented = { $component } type math kɛ exclude ti wotela gbesia ti ii yɛlɛ

variant-non-constant-exclude-not-implemented = { $component } kɛ exclude na a wote ti wotela gbesia ti ii yɛlɛ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ii yenge wue graph prefigure gɛnɛmɔi hu; ti ndoi wumbu.

prefigure-descendant-invalid-geometry = { $subject }: jiɔmɛtri ii tonya ɔɔ ii gbɔyɔ; ti ndoi wumbu.

prefigure-curve-label-omitted = { $subject }: biyeisia ti ii yenge wue curve hindeisia na ti wotenga ma; ti biye wumbu.

prefigure-curve-unsupported-definition-type = { $subject }: curve fɔnkshɔn hugɔɔla mɔla '{ $definitionType }' ii yenge wue; ti ndoi wumbu.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions attribute na lɔ regionBetweenCurves ma ii yenge wue; ti ndoi wumbu.

prefigure-region-non-formula-child = { $subject }: formula-mɔla ndoi fɔnkshɔnsia pɛ ti yenge wue regionBetweenCurves ma; ti ndoi wumbu.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ii yenge wue { $labelKind ->
        [line-family] laing bɔndei biye
       *[point] tɔkpɔi biye
    } va; ti a PreFigure ndɔlɔ wue.

prefigure-fill-style-unsupported = { $subject }: PreFigure ii gbuala mɔla '{ $fillStyle }' majɔɔ; ti a gbuala kpɛlɛ wue.

prefigure-line-style-unknown = { $subject }: ti ii laing mɔla '{ $lineStyle }' majɔɔ, fale ti a ngi wumbu PreFigure hu.

prefigure-marker-style-mapped-to-diamond = { $subject }: ti tɔkpɔi mɔla '{ $markerStyle }' wote PreFigure mɔla 'diamond' ma.

prefigure-marker-style-unsupported = { $subject }: PreFigure ii tɔkpɔi mɔla '{ $markerStyle }' majɔɔ; ti a mɔla na lɔ pili wue.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ii tonya; ti ii gula ti target majɔɔ. Ti annotation wumbu.

annotation-ref-multiple-targets = `<annotation>`: `ref` a targetsia gbotoma majɔɔ; ti a na lɔ ma wue.

annotation-ref-outside-graph = `<annotation>`: `ref` ii tonya; target a lɔ graph gbe. Ti annotation wumbu.

annotation-ref-unsupported-target = `<annotation>`: `ref` ii tonya; target ii kɛlɛma hinda na prefigure a ngi majɔɔ. Ti annotation wumbu.

annotation-text-missing = `<annotation>`: `text` ii lɔ ɔɔ hinda ii lɔ hu; ti njepe hinda ii lɔ hu nyɛingɔ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ti kolɔ hɛndela majɔɔ.
       *[other] Ti kolɔ hɛndela majɔɔ hinda `<{ $componentType }>` kɛ.
    }

reference-no-referent = Ti hinda gbi ii majɔɔ hɛnde va: `{ $reference }`

reference-multiple-referents = Ti hindeisia gbotoma majɔɔ hɛnde va: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` ngi attribute { $attribute } mɔla ii tonya.

children-invalid = `<{ $componentType }>` ngi ndoisia ti ii tonya: Ti ndoisia na ti ii tonya majɔɔ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Hinda `{ $value }` ii tonya attribute `{ $attribute }` va, ti a `{ $default }` wue

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ti DoenetML wotela { $version } ii majɔɔ.
       *[other] Ti DoenetML wotela { $version } ii majɔɔ. Ti a wotela { $fallback } wue
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ii tonya: { $content }

parse-tag-missing-close-tag = DoenetML ii tonya: Tag `{ $tag }` ngi gbɔkɔla tag ii lɔ. Ti a tag na a ngi yɔɔ gbɔkɔ ɔɔ tag `</{ $tagName }>` mahou.

parse-tag-error = DoenetML ii tonya: Hinda nyamu lɔ tag `<{ $tagName }>` hu

parse-attribute-missing-value = DoenetML ii tonya: Attribute `{ $attribute }` ii tonya, a gɛnɛ kɛ ngi hinda ii lɔ.

parse-attribute-invalid = DoenetML ii tonya: Attribute `{ $attribute }` ii tonya

parse-attribute-value-invalid = DoenetML ii tonya: Attribute hinda `{ $value }` ii tonya

parse-attribute-value-quote-mismatch = DoenetML ii tonya: Attribute hinda `{ $value }` ii tonya. Kwot tɔkpɔisia ti ii yɛlɛ kɛnɛi. A gɛnɛ kɛ `{ $quote }` ii lɔ

parse-open-tag-name-missing = DoenetML ii tonya: Ti tag na ngi biye ii lɔ majɔɔ, kɛ `<`

parse-tag-not-closed = DoenetML ii tonya: Ti ii tag `{ $tag }` gbɔkɔ (a gɛnɛ kɛ `>` ii lɔ).

parse-self-closing-tag-name-missing = DoenetML ii tonya: Ti tag na ngi biye ii lɔ majɔɔ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ii tonya: Ti ii tag `{ $tag }` gbɔkɔ (a gɛnɛ kɛ `/>` ii lɔ).

parse-tag-invalid-attributes = DoenetML ii tonya: Tag `{ $tag }` ii tonya. A gula i attributesia na ti ii tonya majɔɔ.

parse-close-tag-name-missing = DoenetML ii tonya: Ti gbɔkɔla tag na ngi biye ii lɔ majɔɔ, kɛ `</`

parse-attribute-value-unquoted = Attribute hindeisia ti lɔ ti yɛlɛ kwotsia bu: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ii tonya: Ti gbɔkɔla tag `{ $tag }` majɔɔ, kɛɛ gbɔyɔla tag ii lɔ

parse-close-tag-mismatched = DoenetML ii tonya: Gbɔkɔla tag ii yɛlɛ kɛnɛi. Ti a `</{ $expected }>` mahou. Ti `{ $found }` majɔɔ

parser-node-unconvertible = Ti ii gula ti node { $node } wote Dast node ma.

## Names

name-attribute-invalid =
    Attribute name='{ $name }' ii tonya. { $reason ->
        [characters] Biyeisia ti gula ti lɛtasia, nambasia, andaskɔsia ɔɔ dashsia pɛ majɔɔ.
       *[start] Biyeisia ti lɔ ti yɛpɛ a lɛta.
    }

component-name-invalid-start = Hinda biye "{ $name }" ii tonya. Biyeisia ti lɔ ti yɛpɛ a lɛta.

## `<answer>` sugar

answer-video-watched-missing-video = Answer type videoWatched i lɔ i video attribute majɔɔ

answer-video-watched-video-not-reference = Answer type videoWatched i lɔ i video attribute na a hɛnde majɔɔ

answer-name-not-single-text = Answer name attribute i lɔ i text ndoi yila pɛ majɔɔ

## Referencing another document

external-doenetml-recursion-limit = Ti ii gula ti DoenetML na lɔ gbe majɔɔ va gbɔmalasia ti gbotoma wa. Kolɔ hɛnde a lɔ?

external-doenetml-unavailable = Ti ii gula ti DoenetML majɔɔ { $attribute }="{ $uri }" hu

external-doenetml-type-mismatch = DoenetML na ti majɔɔ { $attribute }="{ $uri }" hu ii tonya: ii yɛlɛ kɛnɛi hinda mɔla "{ $componentType }" ma

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` a kunafɔ; wue `{ $to }`.
       *[other] [deprecation] Attribute `{ $from }` na lɔ `<{ $component }>` ma a kunafɔ; wue `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` a kunafɔ tao ti a ngi wumbu va `{ $to }` gboma a lɔ.
       *[other] [deprecation] Attribute `{ $from }` na lɔ `<{ $component }>` ma a kunafɔ tao ti a ngi wumbu va `{ $to }` gboma a lɔ.
    }

deprecated-attribute-ignored = [deprecation] Attribute `{ $attribute }` na lɔ `<{ $component }>` ma a kunafɔ tao ti a ngi wumbu.

deprecated-attribute-to-child = [deprecation] Attribute `{ $attribute }` na lɔ `<{ $component }>` ma a kunafɔ; wue `<{ $child }>` ndoi.

deprecated-attribute-value-renamed = [deprecation] Hinda `{ $value }` na lɔ attribute `{ $attribute }` hu `<{ $component }>` ma a kunafɔ; wue `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` a gula i Inglish pɛ gbotoma, fale i ngi njepei tɔɔ kɛ bi ngi nyɛingɔnga buk na ti nyɛingɔnga { $locale } hu. Nyɛingɔ gbotoma mɔla kɛnɛi, ɔɔ yɛlɛ ngi a `pluralForm` attribute.


## Checking against the schema

schema-element-unrecognized = Hinda `<{ $tag }>` ii Doenet hinda na ti a ngi majɔɔ.

schema-element-not-allowed-at-root = Ti ii hinda `<{ $tag }>` gula buk woma ma.

schema-element-not-allowed-inside = Ti ii hinda `<{ $tag }>` gula `<{ $parent }>` bu.

schema-attribute-unrecognized = Hinda `<{ $tag }>` attribute na ngi biye a `{ $attribute }` ii lɔ.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Hinda `<{ $tag }>` ngi attribute `{ $attribute }` i lɔ i yɛlɛ nyɛingɔ na ngi hindeisia gbi a yila ji hu: { $allowed }
       *[other] Hinda `<{ $tag }>` ngi attribute `{ $attribute }` i lɔ i yɛlɛ yila ji hu: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Select wotela biye ii tonya.  Wotela biye { $variantName } a gɛnɛ option { $numOptions } hu kɛɛ hɛndela namba a { $numToSelect }.

select-variant-name-without-options = Ti wotela gbesia yɛlɛ select va kɛɛ ti option gbi ii yɛlɛ wotela biye na a gula i lɔ va: { $variantName }.

select-variant-name-not-possible = Wotela biye { $variantName } na ti yɛlɛ select va ii wotela biye na a gula i lɔ.

select-too-few-options = Ti ii gula ti hindeisia { $numToSelect } hɛnda { $numOptions } pɛ hu.

select-from-sequence-too-few-values = Ti ii gula ti hindeisia { $numToSelect } hɛnda sequence na ngi ndɔlɔ a { $length } hu.

select-from-sequence-indices-count-mismatch = Indices namba na ti yɛlɛ select va i lɔ i yɛlɛ kɛnɛi hɛndela namba ma

select-from-sequence-indices-not-integers = Indices kpɛlɛ na ti yɛlɛ select va ti lɔ ti yɛlɛ nambasia kpɛlɛ

select-from-sequence-index-excluded = Ti selectfromsequence index na ti wumbunga yɛlɛ

select-from-sequence-indices-excluded-combination = Ti selectfromsequence indices na ti gbɔɔla ti wumbunga yɛlɛ

select-from-sequence-coprime-not-positive-integers = Ti ii gula ti coprime gbɔɔlasia hɛnda va ti ii nambasia kpɛlɛ na ti lɔ ziro woma hɛnda.

select-from-sequence-coprime-common-factor = Ti ii gula ti coprime nambasia hɛnda. Hindeisia kpɛlɛ na ti gula ti lɔ ti a faktɔ yila majɔɔ. ("from" ɔɔ "to" hindeisia na ti yɛlɛ ti lɔ ti yɛlɛ coprime "step" kɛ.)

select-from-sequence-coprime-single-number = Ti ii gula ti coprime gbɔɔlasia hɛnda namba yila na ii 1 hu.

select-from-sequence-excluded-too-many-combinations = Ti gbɔɔlasia 70% na wa woma wumbu selectFromSequence hu

select-from-sequence-coprime-none-found = Ti ii gula ti coprime nambasia hɛnda. Hindeisia kpɛlɛ na ti gula ti lɔ ti a faktɔ yila majɔɔ.

select-from-sequence-too-few-unique-values = Ti ii gula ti hindeisia gbesia { $numToSelect } hɛnda sequence na ngi ndɔlɔ a { $numPossibleValues } hu

select-prime-numbers-too-few-values = Ti ii gula ti hindeisia { $numToSelect } hɛnda praym nyɛingɔ na ngi ndɔlɔ a { $numValues } hu

select-prime-numbers-values-count-mismatch = Hindeisia namba na ti yɛlɛ select va i lɔ i yɛlɛ kɛnɛi hɛndela namba ma

select-prime-numbers-values-not-prime = Hindeisia kpɛlɛ na ti yɛlɛ select prime number va ti lɔ ti yɛlɛ praym nyɛingɔi hu

select-prime-numbers-values-excluded-combination = Hindeisia na ti yɛlɛ selectPrimeNumbers va ti gbɔɔla na ti wumbunga

select-prime-numbers-excluded-too-many-combinations = Ti gbɔɔlasia 70% na wa woma wumbu selectPrimeNumbers hu

select-random-combination-fluke = Hinda na ii gula i yɛlɛ, ti ii gula ti hinda gbesia gbɔɔla hɛnda

select-random-value-fluke = Hinda na ii gula i yɛlɛ, ti ii gula ti hinda gbe hɛnda
