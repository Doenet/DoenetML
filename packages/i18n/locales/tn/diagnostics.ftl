# Setswana diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
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
# Where English separates a singular from a plural only in the verb — "is
# ignored" against "are ignored" — the Setswana verb takes its subject concord
# from the noun class rather than from the count, and the argument is a list
# either way. So those selects are dropped and the count argument goes unused.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } ga e elwe tlhoko fa dintlha tse pedi tsa bokhutlo di tlhalositswe

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } ga e elwe tlhoko fa ntlha ya bokhutlo le ntlha ya bogareng ka bobedi di tlhalositswe

line-segment-midpoint-offset-without-midpoint = midpointOffset ga e na tshusumetso fa go se na ntlha ya bogareng

## `<line>`

line-points-undetermined-dimensions = Mola o feta mo dintlheng tse di nang le bogolo jo bo sa itsiweng.

line-points-too-few-dimensions = Mola o tshwanetse go feta mo dintlheng tse di nang le bogolo jo bobedi bonnye.

line-points-depend-on-variables = Mola o feta mo dintlheng tse di ikaegileng ka diphetogo: { $variables }.

line-equation-invalid-format = Sebopego ga se a siama mo equation ya mola mo diphetogong { $variable1 } le { $variable2 }.

## `<ray>`

ray-overprescribed-through = Lesedi le tlhalositswe ka through, endpoint le direction ka botlhe. through e e tlhalositsweng ga e elwe tlhoko.

ray-dimension-mismatch = numDimensions ga e tsamaelane mo leseding.

## `<vector>`

vector-overprescribed-head = Vektara e tlhalositswe ka head, tail le displacement ka botlhe. head e e tlhalositsweng ga e elwe tlhoko.

vector-dimension-mismatch = numDimensions ga e tsamaelane mo vektareng.

## Attracting and constraining

attract-to-without-nearest-point = Ga e kgone go gogelwa kwa `<{ $component }>` ka gonne ga e na phetogo ya seemo nearestPoint.

constrain-to-without-nearest-point = Ga e kgone go golegwa mo `<{ $component }>` ka gonne ga e na phetogo ya seemo nearestPoint.

constrain-to-interior-without-nearest-point = Ga e kgone go golegwa mo teng ga `<{ $component }>` ka gonne ga e na phetogo ya seemo nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ga e elwe tlhoko mo choiceInput e e seng ya mola o le mongwe

## Ordering children by index

choice-input-indices-count-mismatch = Disupo tse di tlhalositsweng mo choiceInput ga di elwe tlhoko ka gonne palo ya disupo ga e tsamaelane le palo ya bana ba choice.

pretzel-indices-count-mismatch = Disupo tse di tlhalositsweng mo problem ga di elwe tlhoko ka gonne palo ya disupo ga e tsamaelane le palo ya bana ba problem.

shuffle-indices-count-mismatch = Disupo tse di tlhalositsweng mo shuffle ga di elwe tlhoko ka gonne palo ya disupo ga e tsamaelane le palo ya dilo.

indices-ignored-out-of-range = Disupo tse di tlhalositsweng mo { $component } ga di elwe tlhoko ka gonne disupo dingwe di kwa ntle ga selekanyo.

pretzel-indices-repeated = Disupo tse di tlhalositsweng mo pretzel ga di elwe tlhoko ka gonne disupo dingwe di boeleditswe.

pretzel-circuit-first-index = Disupo tse di tlhalositsweng mo pretzel mo mokgweng wa circuit ga di elwe tlhoko ka gonne sesupo sa ntlha se tshwanetse go nna 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Gore `<{ $component }>` e dire le bana ba mofuta wa mokwalo, tshiamelo `type` e tshwanetse go tlhalosiwa.

invalid-type-defaulting-to-math = type { $type } ga e a siama mo selong { $component }. E tshwanetse go nna nngwe ya math, text, number kgotsa boolean. E bewa math.

string-not-valid-component-to-arrange = Mokwalo "{ $value }" ga se selo sa { $component } se se siameng. Ga se elwe tlhoko.

## Types and variables

invalid-type-defaulting-to-number = type { $type } ga e a siama, type e bewa number.

invalid-variable-value = Boleng jwa phetogo ga bo a siama: `{ $value }`

## Variants

variant-index-must-be-number = Sesupo sa mofuta { $index } se tshwanetse go nna palo

variant-index-must-be-integer = Sesupo sa mofuta { $index } se tshwanetse go nna palo e e feletseng

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ga e a dirwa ka dikelo tse di tiileng. Bophara bo bewa ka dikarolo.

side-by-side-absolute-margins = `<{ $component }>` ga e a dirwa ka dikelo tse di tiileng. Melelwane e bewa ka dikarolo.

side-by-side-no-block-child = `<{ $component }>` ga e a siama: e tshwanetse go nna le ngwana a le mongwe bonnye wa mofuta wa boloko.

## `<label>`

label-for-ignored-on-graphical = Tshiamelo `for` mo `<label>` ya setshwantsho ga e elwe tlhoko.

label-for-must-resolve-to-one = Tshiamelo `for` mo `<label>` e tshwanetse go supa selo se le sengwe fela.

label-for-unresolved = Tshiamelo `for` mo `<label>` ga e a kgona go supa selo sepe.

label-for-answer-with-authored-inputs = Tshiamelo `for` mo `<label>` e supa `<answer>` e e nang le ditsenyo tse di kwadilweng; supa tsenyo ka boyona.

label-for-answer-without-input = Tshiamelo `for` mo `<label>` e supa `<answer>` e e senang tsenyo e e ka rewang leina.

label-for-must-reference-input-or-answer = Tshiamelo `for` mo `<label>` e tshwanetse go supa tsenyo kgotsa karabo.

## Accessibility

accessibility-short-description-or-decorative = Ka ntlha ya tsenogo, `<{ $component }>` e tshwanetse go nna le tlhaloso e khutshwane kgotsa e tlhalosiwe e le ya mokgabiso.

accessibility-video-short-description = Ka ntlha ya tsenogo, `<video>` e tshwanetse go nna le tlhaloso e khutshwane.

accessibility-input-short-description-or-label = Ka ntlha ya tsenogo, `<{ $component }>` e tshwanetse go nna le tlhaloso e khutshwane kgotsa leina.

accessibility-answer-input-short-description-or-label = Ka ntlha ya tsenogo, `<answer>` e e dirang tsenyo e tshwanetse go nna le tlhaloso e khutshwane kgotsa leina.

accessibility-short-description-contains-math = Tlhaloso e khutshwane ga e a tshwanela go nna le dilo tsa dipalo jaaka `<{ $component }>`. Tlhalosa dipalo tsotlhe ka mafoko.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } e na le pharologano e e sa lekaneng mo mokwalong wa setlhogo sa karolo (mokgwa o o lefifi) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e tlhoka bonnye { $threshold }:1).
       *[other] { $colorName } e na le pharologano e e sa lekaneng mo mokwalong wa setlhogo sa karolo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e tlhoka bonnye { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` e e fetang mo dintlheng tse { $count } ga e ise e dirwe fa dintlha tseo di se na boleng jwa dipalo.

circle-too-many-through-points = Ga e kgone go bala sedikadikwe se se fetang mo dintlheng tse di fetang 3.

circle-overprescribed-radius-center-points = Ga e kgone go bala sedikadikwe se se nang le radiase, bogare le dintlha tsa go feta tsotlhe di tlhalositswe.

circle-center-with-multiple-points = Ga e kgone go bala sedikadikwe se se nang le bogare jo bo tlhalositsweng se se fetang mo dintlheng tse di fetang 1.

circle-radius-too-small = Ga e kgone go bala sedikadikwe: ka gonne sekgala fa gare ga dintlha tse pedi ke { $distance }, radiase { $radius } e e tlhalositsweng e nnye thata.

circle-radius-with-many-points = Ga e kgone go dira sedikadikwe se se fetang mo dintlheng tse di fetang tse pedi se se nang le radiase e e tlhalositsweng.

circle-invalid-center-or-through-points = Bogare jwa sedikadikwe kgotsa dintlha tsa sona tsa go feta ga di a siama.

circle-radius-center-with-multiple-points = Ga e kgone go bala radiase ya sedikadikwe se se nang le bogare jo bo tlhalositsweng se se fetang mo dintlheng tse di fetang 1.

circle-change-radius-non-numerical = Ga e kgone go fetola radiase ya sedikadikwe se se fetang mo dintlheng tse di senang boleng jwa dipalo

circle-radius-with-points-non-numerical = Ga e kgone go dira sedikadikwe se se fetang mo dintlheng tse di fetang e le nngwe se se nang le radiase e e tlhalositsweng fa go se na boleng jwa dipalo.

circle-change-center-non-numerical = Go fetola bogare jwa sedikadikwe se se fetang mo dintlheng tse di senang boleng jwa dipalo ga go ise go dirwe.

## `<function>`

function-domain-insufficient-dimensions = Bogolo jwa lefelo la tiro ga bo a lekana. Lefelo le na le dikgaoganyo tse { $intervals } mme tiro e na le ditsenyo tse { $inputs }.

function-domain-invalid-format = Sebopego sa lefelo la tiro ga se a siama.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ntlha e kgolo ya tiro e e seng ya dipalo ga e elwe tlhoko.
        [minimum] Ntlha e nnye ya tiro e e seng ya dipalo ga e elwe tlhoko.
        [extremum] Ntlha ya bokhutlo ya tiro e e seng ya dipalo ga e elwe tlhoko.
        [point] Ntlha ya tiro e e seng ya dipalo ga e elwe tlhoko.
        [slope] Sekamo sa tiro se se seng sa dipalo ga se elwe tlhoko.
       *[other] { $type } ya tiro e e seng ya dipalo ga e elwe tlhoko.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ntlha e kgolo ya tiro e e senang sepe ga e elwe tlhoko.
        [minimum] Ntlha e nnye ya tiro e e senang sepe ga e elwe tlhoko.
        [extremum] Ntlha ya bokhutlo ya tiro e e senang sepe ga e elwe tlhoko.
        [point] Ntlha ya tiro e e senang sepe ga e elwe tlhoko.
       *[other] { $type } ya tiro e e senang sepe ga e elwe tlhoko.
    }

function-points-too-close = Tiro e na le dintlha tse pedi tse di gaufi thata. Tiro ga e kgone go tlhalosiwa.

function-iterates-input-output-mismatch = Go boeletsa tiro go kgonagala fela fa palo ya ditsenyo e lekana le palo ya ditlhagiso. Tiro e e na le ditsenyo tse { $inputs } le ditlhagiso tse { $outputs }.

## `<sequence>`

sequence-invalid-length = Boleele jwa tatelano ga bo a siama. Bo tshwanetse go nna palo e e feletseng e e seng kwa tlase ga zero.

sequence-invalid-step = Kgato ya tatelano ga e a siama. Mo tatelanong ya mofuta { $type } e tshwanetse go nna palo.

sequence-invalid-endpoint-number = "{ $attribute }" ya tatelano ya dipalo ga e a siama. E tshwanetse go nna palo.

sequence-invalid-endpoint-letters = "{ $attribute }" ya tatelano ya ditlhaka ga e a siama. E tshwanetse go nna ditlhaka.

sequence-invalid-endpoint = "{ $attribute }" ya tatelano ga e a siama.

select-from-sequence-coprime-not-numbers = coprime ga e elwe tlhoko ka gonne ga se dipalo tse di tlhophiwang

select-from-sequence-coprime-with-exclude-combinations = coprime ga e elwe tlhoko ka gonne excludeCombinations e tlhalositswe

## Resolving a `target`

target-not-found = target ga e a siama mo `<{ $source }>`: maikaelelo ga a a fitlhelwa.

target-state-variable-not-found = target ga e a siama mo `<{ $source }>`: phetogo ya seemo e e nang le leina "{ $property }" ga e a fitlhelwa mo `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Diphetogo tsa `<odeSystem>` di tshwanetse go farologana le phetogo e e ikemetseng.

ode-system-duplicate-variable-names = Ga e kgone go tlhalosa ditiro tsa ODE RHS tse di nang le maina a diphetogo a a boeleditsweng.

ode-system-rhs-function-error = Ga e kgone go tlhalosa tiro ya ODE RHS. Phoso fa go dirwa tiro ya mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ga e kgone go tlhalosa sekhutlo fa gare ga mela e { $count }

angle-invalid-through-point = Ntlha ga e a siama mo through ya `<angle>`

parabola-vertex-too-many-points = Parabola e e nang le ntlha e kgolo e e fetang mo dintlheng tse di fetang 1 ga e ise e dirwe.

parabola-too-many-points = Parabola e e fetang mo dintlheng tse di fetang 3 ga e ise e dirwe.

intersection-too-many-items = Kgabaganyo ya dilo tse di fetang tse pedi ga e ise e dirwe

## Other math components

ionic-compound-not-two-ions = Motswako wa ione o o fetang di-ione tse pedi ga o ise o dirwe.

ionic-compound-needs-cation-and-anion = Motswako wa ione o diretswe cation e le nngwe le anion e le nngwe fela.

solve-equations-cannot-evaluate = Ga e kgone go rarabolola equation ka gonne equation ga e a kgona go balwa: { $equation }

math-operators-operand-number-required = operandNumber e tshwanetse go tlhalosiwa fa go ntshiwa operand ya dipalo.

eigen-decomposition-failed = Ga e kgone go bala boleng jwa eigen jwa matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: diparamitara { $parameters } ga di tlhage mo sebopegong, ka jalo di tla tsamaelana le lefela ka metlha.

## `<graph>`

graph-grid-invalid = `<graph>`: ga e kgone go tlhalosa grid="{ $grid }". E tshwanetse go nna none, medium, dense, kgotsa dipalo tse pedi tse di siameng tse di kgaogantsweng ka sebaka, jaaka grid="1 0.5". Ga go na grid e e gatisiwang.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ga e tshegediwe mo mmontshing wa prefigure; boitshwaro jwa lefelo la moja bo dirisiwa.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ga e tshegediwe mo mmontshing wa prefigure; boitshwaro jwa lefelo la godimo bo dirisiwa.

prefigure-invalid-axis-bounds = `<graph>`: melelwane ya axis ga e a siama mo phetolong ya prefigure; bbox (-10,-10,10,10) e dirisiwa.

prefigure-invalid-width = `<graph>`: bophara ga bo a siama mo phetolong ya prefigure; bophara jwa setshwantsho 425 bo dirisiwa.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ga e a siama mo phetolong ya prefigure; selekanyo 1 se dirisiwa.

prefigure-grid-spacing-too-fine = `<graph>`: dikgaoganyo tsa grid di nnye thata mo melelwaneng ya axis; grid e tlogetswe mo mmontshing wa prefigure.

prefigure-annotations-not-rendered = `<graph>`: ditlhokomelo ga di kitla di bontshiwa fa mmontshi wa PreFigure a sa dirisiwe.

multiple-annotations-children = Bana ba bantsi ba `<annotations>` ba fitlhetswe mo `<graph>`; botlhe ga ba elwe tlhoko fa e se wa bofelo.

## Referring to other components

copy-unrecognized-component-type = Ga e kgone go atolosa kgotsa go kopa mofuta wa selo o o sa itsiweng: { $type }.

copy-prop-not-found = Tshiamelo { $property } ga e a fitlhelwa mo selong sa mofuta { $component }

collect-no-source = Ga go na motswedi o o fitlhetsweng wa collect.

collect-invalid-component-type = Ga e kgone go kokoanya dilo tsa mofuta `<{ $component }>` ka gonne ke mofuta wa selo o o sa siamang.

reference-index-unavailable = Ga e kgone go supa sesupo `{ $reference }`

## `<callAction>`

component-action-unavailable = Ga e kgone go bitsa { $action } mo selong `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Sebopego sa data ga se a siama. Mela e na le boleele jo bo sa tsamaelaneng. E fitlhetswe mo componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data e na le maina a mela e e emeng a a boeleditsweng. E fitlhetswe mo componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data ga e na leina la mola o o emeng. E fitlhetswe mo componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award e le nngwe ya karabo e e ikaegile ka karabo e e romilweng ke tagi answer ka boyona, mme seo se tla tlisa boitshwaro jo bo sa lebelelwang.

answer-max-num-attempts-in-section-wide-check-work = Go baya `maxNumAttempts` mo `<answer>` e e mo teng ga sejana se se nang le `sectionWideCheckWork` ga go na tshusumetso, ka gonne sejana seo ke sona se se laolang palo ya diteko. Baya `maxNumAttempts` mo sejaneng ka bosona.

nested-section-wide-check-work-max-num-attempts = Go baya `maxNumAttempts` mo sejaneng se se nang le `sectionWideCheckWork` se se mo teng ga sejana se sengwe se se nang le `sectionWideCheckWork` ga go na tshusumetso, ka gonne sejana sa kwa ntle ke sona se se laolang palo ya diteko. Baya `maxNumAttempts` mo sejaneng sa kwa ntle.

answer-attributes-need-symbolic-equality = Ditshiamelo { $attributes } ga di kitla di nna le tshusumetso fa symbolicEquality e sa bewa.

answer-invalid-type = Mofuta ga o a siama mo karabong: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ka gonne selo `<{ $component }>` ga se na leina, ga se kgone go dirisiwa e le tshiamelo ya module

module-attribute-name-already-defined = Selo `<{ $component } name="{ $name }">` ga se kgone go dirisiwa e le tshiamelo ya module ka gonne mofuta wa selo `<module>` o setse o na le tshiamelo e e nang le leina "{ $name }".

conditional-content-condition-ignored = Tshiamelo `condition` ga e elwe tlhoko mo selong `<conditionalContent>` se se nang le bana ba case kgotsa else.

slider-markers-type-mismatch = Mofuta wa matshwao ga o tsamaelane le mofuta wa slider.

pretzel-problem-needs-statement-and-answer = pretzel ga e a siama: `<problem>` nngwe le nngwe e tshwanetse go nna le `<statement>` e le nngwe le `<answer>` e le nngwe.

pretzel-circuit-first-problem-distractor = pretzel ga e a siama: mo mode="circuit", `<problem>` ya ntlha ga e kgone go nna ya go tsietsa.

## Attribute values

attribute-invalid-values = Boleng { $values } ga bo a siama mo tshiamelong `{ $attribute }`; ga bo elwe tlhoko.

attribute-must-be-references = Boleng `{ $value }` ga bo a siama mo tshiamelong `{ $attribute }`. Tshiamelo e tshwanetse go dirwa ka disupo tse di simololang ka `$`.

math-input-invalid-function-names = <mathInput>: maina a ditiro a a sa siamang mo { $attribute } ga a elwe tlhoko: { $names }. Karolo e e bontshiwang ya leina lengwe le lengwe e tshwanetse go nna le ditlhaka tse 2 bonnye (ditlhaka kgotsa mela); tlatsetso `|<mathspeak alternative>` e ka latela.

## Building components from the source

component-type-invalid = Mofuta wa selo ga o a siama: `<{ $componentType }>`

attribute-repeated = Tshiamelo { $attribute } ga e kgone go boelediwa.

attribute-invalid-for-component = Tshiamelo "{ $attribute }" ga e a siama mo selong sa mofuta `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Tlhaloso ya setaele { $styleNumber } e na le pharologano e e sa lekaneng mo { $context ->
        [text-on-background] mmala wa mokwalo kgatlhanong le mmala wa bokamorago
        [high-contrast] mmala wa pharologano e kgolo kgatlhanong le lesela
        [line] mmala wa mola kgatlhanong le lesela
        [marker] mmala wa letshwao kgatlhanong le lesela
       *[text-on-canvas] mmala wa mokwalo kgatlhanong le lesela
    }{ $mode ->
        [dark] { " (mokgwa o o lefifi)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e tlhoka bonnye { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Le fa tlhaloso ya setaele { $styleNumber } e tlhalositse mebala e e nang le pharologano e e lekaneng mo mokgweng o o phatsimang, mebala ya mokgwa o o lefifi e e tswang mo go yona e na le pharologano e e sa lekaneng mo mmaleng wa mokwalo kgatlhanong le mmala wa bokamorago ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e tlhoka bonnye { $threshold }:1). { $suggestion ->
        [available] Go netefatsa pharologano e e lekaneng mo mokgweng o o lefifi, oketsa pharologano ya mokgwa o o phatsimang (sekai baya { $lightAttribute }="{ $lightColor }") kgotsa fetola mmala wa mokgwa o o lefifi (sekai baya { $darkAttribute }="{ $darkColor }").
       *[none] Go netefatsa pharologano e e lekaneng mo mokgweng o o lefifi, oketsa pharologano ya mokgwa o o phatsimang kgotsa fetola mebala e e tswang mo go yona ka textColorDarkMode le/kgotsa backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Le fa tlhaloso ya setaele { $styleNumber } e tlhalositse mmala wa mokwalo o o nang le pharologano e e lekaneng mo mokgweng o o phatsimang, mmala wa mokwalo wa mokgwa o o lefifi o o tswang mo go ona o na le pharologano e e sa lekaneng kgatlhanong le lesela ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e tlhoka bonnye { $threshold }:1). { $suggestion ->
        [available] Go netefatsa pharologano e e lekaneng mo mokgweng o o lefifi, oketsa pharologano ya mokgwa o o phatsimang (sekai baya textColor="{ $lightColor }") kgotsa fetola mmala wa mokgwa o o lefifi (sekai baya textColorDarkMode="{ $darkColor }").
       *[none] Go netefatsa pharologano e e lekaneng mo mokgweng o o lefifi, oketsa pharologano ya mokgwa o o phatsimang kgotsa fetola mmala o o tswang mo go ona ka textColorDarkMode.
    }

section-multiple-style-palettes = Karolo e ka tlhopha <stylePalette> e le nngwe fela; ya bofelo e dirisiwa.

## Unique variants

variant-num-to-select-not-non-negative-integer = ga e kgone go tlhalosa mefuta e e ikgethileng ya { $component } ka gonne numToSelect ga se palo e e feletseng e e seng kwa tlase ga zero.

variant-num-to-select-not-constant-number = ga e kgone go tlhalosa mefuta e e ikgethileng ya { $component } ka gonne numToSelect ga se palo e e sa fetogeng.

variant-with-replacement-not-constant-boolean = ga e kgone go tlhalosa mefuta e e ikgethileng ya { $component } ka gonne withReplacement ga se boolean e e sa fetogeng.

variant-select-weight-disables-unique = Mefuta e e ikgethileng ya select e a timiwa fa go na le kgetho e e nang le selectWeight kgotsa selectForVariants e e tlhalositsweng

variant-coprime-undetermined = ga e kgone go tlhalosa mefuta e e ikgethileng ya { $component } ka gonne ga e kgone go netefatsa gore coprime ke maaka ka metlha.

variant-attribute-not-constant = ga e kgone go tlhalosa mefuta e e ikgethileng ya { $component } ka gonne { $attribute } ga e a nitama.

variant-attribute-not-number = ga e kgone go tlhalosa mefuta e e ikgethileng ya { $component } ka gonne { $attribute } ga se palo.

variant-attribute-wrong-type-for-sequence =
    ga e kgone go tlhalosa mefuta e e ikgethileng ya { $component } ya mofuta { $type } ka gonne { $attribute } ga se { $expected ->
        [letters-combination] motswako wa ditlhaka
        [math-expression] polelo ya dipalo e e siameng
        [integer] palo e e feletseng
       *[number] palo
    }.

variant-length-not-integer = ga e kgone go tlhalosa mefuta e e ikgethileng ya { $component } ka gonne length ga se palo e e feletseng.

variant-sort-not-implemented = mefuta e e ikgethileng ya { $component } e e nang le sort ga e ise e dirwe

variant-exclude-combinations-not-implemented = mefuta e e ikgethileng ya { $component } e e nang le excludeCombinations ga e ise e dirwe

variant-math-exclude-not-implemented = mefuta e e ikgethileng ya { $component } ya mofuta math e e nang le exclude ga e ise e dirwe

variant-non-constant-exclude-not-implemented = mefuta e e ikgethileng ya { $component } e e nang le exclude e e sa nitamang ga e ise e dirwe

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ga e tshegediwe mo mmontshing wa graph prefigure; setlogolo se tlodilwe.

prefigure-descendant-invalid-geometry = { $subject }: geometry e e senang molelwane kgotsa e e sa feleleng; setlogolo se tlodilwe.

prefigure-curve-label-omitted = { $subject }: maina ga a tshegediwe mo dilong tsa kobamo tse di fetotsweng; leina le tlogetswe.

prefigure-curve-unsupported-definition-type = { $subject }: mofuta wa tlhaloso ya tiro ya kobamo '{ $definitionType }' ga o tshegediwe; setlogolo se tlodilwe.

prefigure-region-flip-functions-unsupported = { $subject }: tshiamelo flipFunctions mo regionBetweenCurves ga e tshegediwe; setlogolo se tlodilwe.

prefigure-region-non-formula-child = { $subject }: ditiro tsa bana ba mofuta formula fela ke tse di tshegediwang mo regionBetweenCurves; setlogolo se tlodilwe.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ga e tshegediwe mo { $labelKind ->
        [line-family] leina la lelapa la mola
       *[point] leina la ntlha
    }; thulaganyo ya PreFigure e dirisiwa.

prefigure-fill-style-unsupported = { $subject }: setaele sa go tlatsa '{ $fillStyle }' ga se tshegediwe ke PreFigure; e boela mo go tlatseng ka mmala o le mongwe.

prefigure-line-style-unknown = { $subject }: setaele sa mola '{ $lineStyle }' ga se itsiwe mme se tlogetswe mo ditlhagisong tsa PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: setaele sa letshwao '{ $markerStyle }' se tsamaelantswe le setaele sa PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: setaele sa letshwao '{ $markerStyle }' ga se tshegediwe ke PreFigure; setaele se se leng teng ka tlwaelo se dirisiwa.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ga e a siama; maikaelelo ga a kgone go itsiwe. Tlhokomelo e tlogetswe.

annotation-ref-multiple-targets = `<annotation>`: `ref` e tlhalositse maikaelelo a mantsi; maikaelelo a ntlha a dirisiwa.

annotation-ref-outside-graph = `<annotation>`: `ref` ga e a siama; maikaelelo a kwa ntle ga kerafo e e a tshotseng. Tlhokomelo e tlogetswe.

annotation-ref-unsupported-target = `<annotation>`: `ref` ga e a siama; maikaelelo ga se selo sa setshwantsho se se tshegediwang mo phetolong ya prefigure. Tlhokomelo e tlogetswe.

annotation-text-missing = `<annotation>`: `text` ga e yo kgotsa ga e na sepe; mokwalo o o senang sepe o ntshiwa.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Boikaego jo bo dikologang bo fitlhetswe.
       *[other] Boikaego jo bo dikologang jo bo amang selo `<{ $componentType }>` bo fitlhetswe.
    }

reference-no-referent = Ga go na sepe se se fitlhetsweng mo sesupong: `{ $reference }`

reference-multiple-referents = Dilo tse dintsi di fitlhetswe mo sesupong: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Sebopego ga se a siama mo tshiamelong { $attribute } ya `<{ $componentType }>`.

children-invalid = Bana ga ba a siama mo `<{ $componentType }>`: Bana ba ba sa siamang ba fitlhetswe: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Boleng `{ $value }` ga bo a siama mo tshiamelong `{ $attribute }`, boleng `{ $default }` bo dirisiwa

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML mofuta { $version } ga o a fitlhelwa.
       *[other] DoenetML mofuta { $version } ga o a fitlhelwa. E boela mo mofuteng { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ga e a siama: { $content }

parse-tag-missing-close-tag = DoenetML ga e a siama: Tagi `{ $tag }` ga e na tagi ya go tswala. Go ne go lebeletswe tagi e e itswalang kgotsa tagi `</{ $tagName }>`.

parse-tag-error = DoenetML ga e a siama: Phoso mo taging `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ga e a siama: Tshiamelo `{ $attribute }` e e sa siamang e bonala e sena boleng.

parse-attribute-invalid = DoenetML ga e a siama: Tshiamelo `{ $attribute }` ga e a siama

parse-attribute-value-invalid = DoenetML ga e a siama: Boleng jwa tshiamelo `{ $value }` ga bo a siama

parse-attribute-value-quote-mismatch = DoenetML ga e a siama: Boleng jwa tshiamelo `{ $value }` ga bo a siama. Matshwao a mafoko ga a tsamaelane. Go bonala `{ $quote }` e tlhaela

parse-open-tag-name-missing = DoenetML ga e a siama: Go fitlhetswe tagi e e senang leina, sekai `<`

parse-tag-not-closed = DoenetML ga e a siama: Tagi `{ $tag }` ga e a tswalwa (go bonala `>` e tlhaela).

parse-self-closing-tag-name-missing = DoenetML ga e a siama: Go fitlhetswe tagi e e senang leina `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ga e a siama: Tagi `{ $tag }` ga e a tswalwa (go bonala `/>` e tlhaela).

parse-tag-invalid-attributes = DoenetML ga e a siama: Tagi `{ $tag }` ga e a siama. Gongwe e na le ditshiamelo tse di sa siamang.

parse-close-tag-name-missing = DoenetML ga e a siama: Go fitlhetswe tagi ya go tswala e e senang leina, sekai `</`

parse-attribute-value-unquoted = Boleng jwa ditshiamelo bo tshwanetse go bewa mo gare ga matshwao a mafoko: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ga e a siama: Go fitlhetswe tagi ya go tswala `{ $tag }`, mme ga go na tagi ya go bula e e tsamaelanang

parse-close-tag-mismatched = DoenetML ga e a siama: Tagi ya go tswala ga e tsamaelane. Go ne go lebeletswe `</{ $expected }>`. Go fitlhetswe `{ $found }`

parser-node-unconvertible = Ga go a kgonagala go fetola node { $node } go nna node ya Dast.

## Names

name-attribute-invalid =
    Tshiamelo name='{ $name }' ga e a siama. { $reason ->
        [characters] Maina a ka nna le ditlhaka, dipalo, mela ya kwa tlase kgotsa mela fela.
       *[start] Maina a tshwanetse go simolola ka tlhaka.
    }

component-name-invalid-start = Leina la selo "{ $name }" ga le a siama. Maina a tshwanetse go simolola ka tlhaka.

## `<answer>` sugar

answer-video-watched-missing-video = Karabo ya mofuta videoWatched e tshwanetse go nna le tshiamelo video

answer-video-watched-video-not-reference = Karabo ya mofuta videoWatched e tshwanetse go nna le tshiamelo video e e leng sesupo

answer-name-not-single-text = Tshiamelo name ya karabo e tshwanetse go nna le ngwana a le mongwe fela wa text

## Referencing another document

external-doenetml-recursion-limit = Ga e kgone go bona DoenetML ya kwa ntle ka ntlha ya go boeletsa mo gontsi thata. A go na le sesupo se se dikologang?

external-doenetml-unavailable = Ga e kgone go bona DoenetML go tswa mo { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML e e bonweng go tswa mo { $attribute }="{ $uri }" ga e a siama: ga e tsamaelane le mofuta wa selo "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Tshiamelo `{ $from }` e feditswe ke nako; dirisa `{ $to }`.
       *[other] [deprecation] Tshiamelo `{ $from }` mo `<{ $component }>` e feditswe ke nako; dirisa `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Tshiamelo `{ $from }` e feditswe ke nako mme ga e elwe tlhoko ka gonne `{ $to }` le yona e tlhalositswe.
       *[other] [deprecation] Tshiamelo `{ $from }` mo `<{ $component }>` e feditswe ke nako mme ga e elwe tlhoko ka gonne `{ $to }` le yona e tlhalositswe.
    }

deprecated-attribute-ignored = [deprecation] Tshiamelo `{ $attribute }` mo `<{ $component }>` e feditswe ke nako mme ga e elwe tlhoko.

deprecated-attribute-to-child = [deprecation] Tshiamelo `{ $attribute }` mo `<{ $component }>` e feditswe ke nako; dirisa ngwana `<{ $child }>`.


## Language coverage

pluralize-english-only = `<pluralize>` e ka dira bontsi ka Sekgoa fela, ka jalo mokwalo wa yona o sala jaaka o ntse mo lokwalong lo lo kwadilweng ka { $locale }. Kwala sebopego sa bontsi ka bowena, kgotsa se baye mo tshiamelong `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Selo `<{ $tag }>` ga se selo sa Doenet se se itsiweng.

schema-element-not-allowed-at-root = Selo `<{ $tag }>` ga se letlelelwe mo moding wa lokwalo.

schema-element-not-allowed-inside = Selo `<{ $tag }>` ga se letlelelwe mo teng ga `<{ $parent }>`.

schema-attribute-unrecognized = Selo `<{ $tag }>` ga se na tshiamelo e e nang le leina `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Tshiamelo `{ $attribute }` ya selo `<{ $tag }>` e tshwanetse go nna lenaneo le selo sengwe le sengwe mo go lona e leng nngwe ya: { $allowed }
       *[other] Tshiamelo `{ $attribute }` ya selo `<{ $tag }>` e tshwanetse go nna nngwe ya: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Leina la mofuta ga le a siama mo select. Leina la mofuta { $variantName } le tlhaga mo dikgethong tse { $numOptions } mme palo ya go tlhopha ke { $numToSelect }.

select-variant-name-without-options = Mefuta mengwe e tlhalositswe mo select mme ga go na kgetho e e tlhalositsweng mo leineng la mofuta le le kgonagalang: { $variantName }.

select-variant-name-not-possible = Leina la mofuta { $variantName } le le tlhalositsweng mo select ga se leina la mofuta le le kgonagalang.

select-too-few-options = Ga e kgone go tlhopha dilo tse { $numToSelect } mo go { $numOptions } fela.

select-from-sequence-too-few-values = Ga e kgone go tlhopha boleng jo { $numToSelect } mo tatelanong e e nang le boleele jwa { $length }.

select-from-sequence-indices-count-mismatch = Palo ya disupo tse di tlhalositsweng mo select e tshwanetse go tsamaelana le palo ya go tlhopha

select-from-sequence-indices-not-integers = Disupo tsotlhe tse di tlhalositsweng mo select di tshwanetse go nna dipalo tse di feletseng

select-from-sequence-index-excluded = Go tlhalositswe sesupo sa selectfromsequence se se ntshitsweng

select-from-sequence-indices-excluded-combination = Go tlhalositswe disupo tsa selectfromsequence tse di neng di le motswako o o ntshitsweng

select-from-sequence-coprime-not-positive-integers = Ga e kgone go tlhopha metswako ya dipalo tse di sa kgaoganeng ka gonne ga se dipalo tse di feletseng tse di kwa godimo ga zero tse di tlhophiwang.

select-from-sequence-coprime-common-factor = Ga e kgone go tlhopha dipalo tse di sa kgaoganeng. Boleng jotlhe jo bo kgonagalang bo abelana kgaolo e le nngwe. (Boleng jo bo tlhalositsweng jwa "from" kgotsa "to" bo tshwanetse go se abelane le "step".)

select-from-sequence-coprime-single-number = Ga e kgone go tlhopha metswako ya dipalo tse di sa kgaoganeng mo palong e le nngwe e e seng 1.

select-from-sequence-excluded-too-many-combinations = Go feta 70% ya metswako e ntshitswe mo selectFromSequence

select-from-sequence-coprime-none-found = Ga go a kgonagala go tlhopha dipalo tse di sa kgaoganeng. Boleng jotlhe jo bo kgonagalang bo abelana kgaolo e le nngwe.

select-from-sequence-too-few-unique-values = Ga e kgone go tlhopha boleng jo bo ikgethileng jo { $numToSelect } mo tatelanong e e nang le boleele jwa { $numPossibleValues }

select-prime-numbers-too-few-values = Ga e kgone go tlhopha boleng jo { $numToSelect } mo lenaneong la dipalo tsa prime le le nang le boleele jwa { $numValues }

select-prime-numbers-values-count-mismatch = Palo ya boleng jo bo tlhalositsweng mo select e tshwanetse go tsamaelana le palo ya go tlhopha

select-prime-numbers-values-not-prime = Boleng jotlhe jo bo tlhalositsweng mo select prime number bo tshwanetse go nna mo lenaneong la dipalo tsa prime

select-prime-numbers-values-excluded-combination = Boleng jwa selectPrimeNumbers jo bo tlhalositsweng bo ne bo le motswako o o ntshitsweng

select-prime-numbers-excluded-too-many-combinations = Go feta 70% ya metswako e ntshitswe mo selectPrimeNumbers

select-random-combination-fluke = Ka tsela e e sa tlwaelegang, ga go a kgonagala go tlhopha motswako wa boleng jo bo sa rulaganngwang

select-random-value-fluke = Ka tsela e e sa tlwaelegang, ga go a kgonagala go tlhopha boleng jo bo sa rulaganngwang
