# Tahitian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Written with the ʻeta and the tārava; see `chrome.ftl`. Tahitian marks no
# number on the noun, so a counted message whose only English difference is the
# noun's number renders one string here and the select is dropped.


## `<lineSegment>`

# No select: «ʻaita e faʻaohipahia» does not agree with what is ignored, and the
# list carries no number of its own.
line-segment-attributes-ignored-with-endpoints = ʻaita te { $attributes } e faʻaohipahia ia haʻapāpūhia nā hopeʻa e piti

line-segment-attributes-ignored-with-endpoint-and-midpoint = ʻaita te { $attributes } e faʻaohipahia ia haʻapāpūhia te hopeʻa ʻe te ropū

line-segment-midpoint-offset-without-midpoint = ʻaita te midpointOffset e ʻohipa mai te mea ʻaita e ropū

## `<line>`

line-points-undetermined-dimensions = Reni e nā roto i te mau poini ʻaita i haʻapāpūhia tō rātou faito.

line-points-too-few-dimensions = E tiʻa i te reni ia haere nā roto i te mau poini e piti aore rā hau atu tō rātou faito.

line-points-depend-on-variables = Tē haere nei te reni nā roto i te mau poini e tiʻaturi nei i te mau taui: { $variables }.

line-equation-invalid-format = Huru tano ʻore nō te faʻataʻaraʻa o te reni i roto i te mau taui { $variable1 } ʻe { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ua haʻapāpūhia te hihi e te through, te endpoint ʻe te direction.  ʻAita te through i haʻapāpūhia e faʻaohipahia.

ray-dimension-mismatch = ʻaita te numDimensions e tuʻati i roto i te hihi.

## `<vector>`

vector-overprescribed-head = Ua haʻapāpūhia te vetetera e te head, te tail ʻe te displacement.  ʻAita te head i haʻapāpūhia e faʻaohipahia.

vector-dimension-mismatch = ʻaita te numDimensions e tuʻati i roto i te vetetera.

## Attracting and constraining

attract-to-without-nearest-point = ʻEita e nehenehe e huti i te `<{ $component }>` nō te mea ʻaita tōna taui huru nearestPoint.

constrain-to-without-nearest-point = ʻEita e nehenehe e tāpeʻa i te `<{ $component }>` nō te mea ʻaita tōna taui huru nearestPoint.

constrain-to-interior-without-nearest-point = ʻEita e nehenehe e tāpeʻa i roto i te `<{ $component }>` nō te mea ʻaita tōna taui huru nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = ʻaita te labelPosition e faʻaohipahia i roto i te choiceInput ʻaita e inline

## Ordering children by index

choice-input-indices-count-mismatch = ʻAita te mau indeki i haʻapāpūhia nō te choiceInput e faʻaohipahia nō te mea ʻaita te rahiraʻa indeki e tuʻati i te rahiraʻa māʻitiraʻa.

pretzel-indices-count-mismatch = ʻAita te mau indeki i haʻapāpūhia nō te problem e faʻaohipahia nō te mea ʻaita te rahiraʻa indeki e tuʻati i te rahiraʻa problem.

shuffle-indices-count-mismatch = ʻAita te mau indeki i haʻapāpūhia nō te shuffle e faʻaohipahia nō te mea ʻaita te rahiraʻa indeki e tuʻati i te rahiraʻa tuhaʻa.

indices-ignored-out-of-range = ʻAita te mau indeki i haʻapāpūhia nō te { $component } e faʻaohipahia nō te mea tē vai nei te indeki i ʻō atu i te ʻōtiʻa.

pretzel-indices-repeated = ʻAita te mau indeki i haʻapāpūhia nō te pretzel e faʻaohipahia nō te mea ua faʻahiti-piti-hia te tahi indeki.

pretzel-circuit-first-index = ʻAita te mau indeki i haʻapāpūhia nō te pretzel i te mode circuit e faʻaohipahia nō te mea e tiʻa i te indeki mātāmua ia riro ei 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ia ʻohipa te `<{ $component }>` e te mau tamariʻi string, e tiʻa ia haʻapāpūhia te ʻatirivite `type`.

invalid-type-defaulting-to-math = Tano ʻore te type { $type } nō te tuhaʻa { $component }. E tiʻa ia riro ei hōʻē o te math, text, number, aore rā boolean. Tē faʻaohipahia nei te math.

string-not-valid-component-to-arrange = ʻAita te string "{ $value }" e tuhaʻa tano nō te { $component }. ʻAita e faʻaohipahia.

## Types and variables

invalid-type-defaulting-to-number = Tano ʻore te type { $type }, ua tuʻuhia te type i te number.

invalid-variable-value = Faito tano ʻore o te tahi taui: `{ $value }`

## Variants

variant-index-must-be-number = E tiʻa i te indeki o te huru taʻa ê { $index } ia riro ei numera

variant-index-must-be-integer = E tiʻa i te indeki o te huru taʻa ê { $index } ia riro ei numera taʻato ʻa

## `<sideBySide>`

side-by-side-absolute-widths = ʻAitaʻe te `<{ $component }>` i faʻatupuhia nō te faito pāpū. Ua tuʻuhia te ʻāteatea ei faito tāʻiʻiti.

side-by-side-absolute-margins = ʻAitaʻe te `<{ $component }>` i faʻatupuhia nō te faito pāpū. Ua tuʻuhia te hiti ei faito tāʻiʻiti.

side-by-side-no-block-child = `<{ $component }>` tano ʻore: e tiʻa ia vai te hōʻē tamariʻi block.

## `<label>`

label-for-ignored-on-graphical = ʻAita te ʻatirivite `for` i roto i te `<label>` hōhoʻa e faʻaohipahia.

label-for-must-resolve-to-one = E tiʻa i te ʻatirivite `for` i roto i te `<label>` ia faʻataʻa i te hōʻē noa tuhaʻa.

label-for-unresolved = ʻAita te ʻatirivite `for` i roto i te `<label>` i nehenehe e faʻataʻa i te tahi tuhaʻa.

label-for-answer-with-authored-inputs = Tē faʻataʻa nei te ʻatirivite `for` i roto i te `<label>` i te hōʻē `<answer>` e vai ra te mau tuʻuraʻa i papaʻihia e te taata papaʻi; a faʻataʻa tōtiʻa i te tuʻuraʻa.

label-for-answer-without-input = Tē faʻataʻa nei te ʻatirivite `for` i roto i te `<label>` i te hōʻē `<answer>` ʻaita tōna tuʻuraʻa e tāpaʻohia.

label-for-must-reference-input-or-answer = E tiʻa i te ʻatirivite `for` i roto i te `<label>` ia faʻataʻa i te hōʻē input aore rā i te hōʻē answer.

## Accessibility

accessibility-short-description-or-decorative = Nō te ʻāravehi, e tiʻa i te `<{ $component }>` ia vai te faʻataʻaraʻa poto aore rā ia haʻapāpūhia ei faʻanehenehe.

accessibility-video-short-description = Nō te ʻāravehi, e tiʻa i te `<video>` ia vai te faʻataʻaraʻa poto.

accessibility-input-short-description-or-label = Nō te ʻāravehi, e tiʻa i te `<{ $component }>` ia vai te faʻataʻaraʻa poto aore rā te tāpaʻo.

accessibility-answer-input-short-description-or-label = Nō te ʻāravehi, e tiʻa i te hōʻē `<answer>` e faʻatupu nei i te tuʻuraʻa ia vai te faʻataʻaraʻa poto aore rā te tāpaʻo.

accessibility-short-description-contains-math = ʻEita e tiʻa i te mau faʻataʻaraʻa poto ia vai te mau tuhaʻa numera mai te `<{ $component }>`. A papaʻi i te numera na roto i te parau.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] ʻAita te taʻa ê o te { $colorName } e navai nō te parau upoʻo o te tuhaʻa (huru pōuri) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e titauhia te { $threshold }:1 aore rā hau atu).
       *[other] ʻAita te taʻa ê o te { $colorName } e navai nō te parau upoʻo o te tuhaʻa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e titauhia te { $threshold }:1 aore rā hau atu).
    }

## `<circle>`

circle-through-points-non-numerical = ʻAitaʻe te `<circle>` e haere nā roto i te { $count } poini i faʻatupuhia mai te mea ʻaita te mau poini e faito numera.

circle-too-many-through-points = ʻEita e nehenehe e tāpura i te ʻāpōpōti e haere nā roto i te hau atu i te 3 poini.

circle-overprescribed-radius-center-points = ʻEita e nehenehe e tāpura i te ʻāpōpōti e haʻapāpūhia tōna ʻātea, tōna ropū ʻe te mau poini e haere nā roto.

circle-center-with-multiple-points = ʻEita e nehenehe e tāpura i te ʻāpōpōti e haʻapāpūhia tōna ropū e haere rā nā roto i te hau atu i te 1 poini.

circle-radius-too-small = ʻEita e nehenehe e tāpura i te ʻāpōpōti: nō te mea e { $distance } te ʻātea o nā poini e piti, mea iti roa te ʻātea { $radius } i haʻapāpūhia.

circle-radius-with-many-points = ʻEita e nehenehe e faʻatupu i te ʻāpōpōti e haere nā roto i te hau atu i te piti poini e te ʻātea i haʻapāpūhia.

circle-invalid-center-or-through-points = Tano ʻore te ropū aore rā te mau poini e haere nā roto te ʻāpōpōti.

circle-radius-center-with-multiple-points = ʻEita e nehenehe e tāpura i te ʻātea o te ʻāpōpōti e haʻapāpūhia tōna ropū e haere rā nā roto i te hau atu i te 1 poini.

circle-change-radius-non-numerical = ʻEita e nehenehe e taui i te ʻātea o te ʻāpōpōti e haere nā roto i te mau poini ʻaore e numera

circle-radius-with-points-non-numerical = ʻEita e nehenehe e faʻatupu i te ʻāpōpōti e haere nā roto i te hau atu i te hōʻē poini e te ʻātea i haʻapāpūhia mai te mea ʻaita e faito numera.

circle-change-center-non-numerical = ʻAitaʻe te tauiraʻa o te ropū o te ʻāpōpōti e haere nā roto i te mau poini ʻaore e faito numera i faʻatupuhia.

## `<function>`

# English's two counts multiply out to four sentences; Tahitian has one, because
# «ārearea» and «tuʻuraʻa» do not change for number. Both selects are dropped
# and both counts still arrive.
function-domain-insufficient-dimensions = ʻAita te faito o te domain e navai nō te fonotio. E { $intervals } ārearea tō te domain, e { $inputs } tuʻuraʻa rā tō te fonotio.

function-domain-invalid-format = Huru tano ʻore o te domain nō te fonotio.

function-ignoring-non-numerical =
    { $type ->
        [maximum] ʻAita te faito teitei roa o te fonotio ʻaore e numera e faʻaohipahia.
        [minimum] ʻAita te faito haʻehaʻa roa o te fonotio ʻaore e numera e faʻaohipahia.
        [extremum] ʻAita te ʻōtiʻa o te fonotio ʻaore e numera e faʻaohipahia.
        [point] ʻAita te poini o te fonotio ʻaore e numera e faʻaohipahia.
        [slope] ʻAita te pīʻao o te fonotio ʻaore e numera e faʻaohipahia.
       *[other] ʻAita te { $type } o te fonotio ʻaore e numera e faʻaohipahia.
    }

function-ignoring-empty =
    { $type ->
        [maximum] ʻAita te faito teitei roa o te fonotio ʻaore e mea e faʻaohipahia.
        [minimum] ʻAita te faito haʻehaʻa roa o te fonotio ʻaore e mea e faʻaohipahia.
        [extremum] ʻAita te ʻōtiʻa o te fonotio ʻaore e mea e faʻaohipahia.
        [point] ʻAita te poini o te fonotio ʻaore e mea e faʻaohipahia.
       *[other] ʻAita te { $type } o te fonotio ʻaore e mea e faʻaohipahia.
    }

function-points-too-close = E piti poini tō te fonotio mea piri roa. ʻEita e nehenehe e faʻataʻa i te fonotio.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = E nehenehe noa te faʻahitiraʻa o te fonotio mai te mea e ʻaifaito te rahiraʻa tuʻuraʻa e te rahiraʻa faʻahopeʻaraʻa. E { $inputs } tuʻuraʻa e { $outputs } faʻahopeʻaraʻa tō teie fonotio.

## `<sequence>`

sequence-invalid-length = Tano ʻore te roa o te sequence.  E tiʻa ia riro ei numera taʻato ʻa ʻaore e haʻehaʻa i te ʻōre.

sequence-invalid-step = Tano ʻore te step o te sequence.  E tiʻa ia riro ei numera nō te sequence type { $type }.

sequence-invalid-endpoint-number = Tano ʻore te "{ $attribute }" o te sequence numera.  E tiʻa ia riro ei numera.

sequence-invalid-endpoint-letters = Tano ʻore te "{ $attribute }" o te sequence reta.  E tiʻa ia riro ei tuʻatiraʻa reta.

sequence-invalid-endpoint = Tano ʻore te "{ $attribute }" o te sequence.

select-from-sequence-coprime-not-numbers = ʻaita te coprime e faʻaohipahia nō te mea ʻaita e numera tē māʻitihia

select-from-sequence-coprime-with-exclude-combinations = ʻaita te coprime e faʻaohipahia nō te mea ua haʻapāpūhia te excludeCombinations

## Resolving a `target`

target-not-found = target tano ʻore nō te `<{ $source }>`: ʻaita i ʻitehia te target.

target-state-variable-not-found = target tano ʻore nō te `<{ $source }>`: ʻaita i ʻitehia te taui huru tōna iʻoa "{ $property }" i roto i te `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = E tiʻa i te mau taui o te `<odeSystem>` ia taʻa ê i te taui tiʻamā.

ode-system-duplicate-variable-names = ʻEita e nehenehe e faʻataʻa i te mau fonotio RHS o te ODE mai te mea e hoʻē â te iʻoa o te mau taui tiʻaturi.

ode-system-rhs-function-error = ʻEita e nehenehe e faʻataʻa i te fonotio RHS o te ODE.  Ua hape te faʻatupuraʻa o te fonotio mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = ʻEita e nehenehe e faʻataʻa i te tahi ʻōtiʻa i rotopū i te { $count } reni

angle-invalid-through-point = Poini tano ʻore i roto i te through o te `<angle>`

parabola-vertex-too-many-points = ʻAitaʻe te parabole e vai ra tōna upoʻo e haere rā nā roto i te hau atu i te 1 poini i faʻatupuhia.

parabola-too-many-points = ʻAitaʻe te parabole e haere nā roto i te hau atu i te 3 poini i faʻatupuhia.

intersection-too-many-items = ʻAitaʻe te fāraʻiraʻa nō te hau atu i te piti mea i faʻatupuhia

## Other math components

ionic-compound-not-two-ions = ʻAitaʻe te faʻaʻamuraʻa ionika nō te tahi atu mea ʻaore ra e piti ion i faʻatupuhia.

ionic-compound-needs-cation-and-anion = Ua faʻatupuhia te faʻaʻamuraʻa ionika nō te hōʻē noa cation e te hōʻē noa anion.

solve-equations-cannot-evaluate = ʻEita e nehenehe e faʻaʻoti i te faʻataʻaraʻa nō te mea ʻaita i nehenehe i hiʻopoʻa: { $equation }

math-operators-operand-number-required = E tiʻa ia haʻapāpūhia te operandNumber ia rave i te tahi operand numera.

eigen-decomposition-failed = ʻAita i nehenehe i tāpura i te eigenvalue o te matiri

## `<matchesPattern>`

# No select: the parameter list carries no number that the noun would show.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: ʻaita te parameter { $parameters } e ʻitehia i roto i te pattern, nō reira e tuʻati noa ʻoia i te mea ʻaore.

## `<graph>`

graph-grid-invalid = `<graph>`: ʻaita i taʻa te grid="{ $grid }". E tiʻa ia riro ei none, medium, dense, aore rā e piti numera maitaʻi i faʻataʻahia e te hōʻē vāhi ʻaore, mai te grid="1 0.5". ʻAita e grid e hōhoʻahia.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: ʻaita te xLabelPosition="left" e tauturuhia i roto i te renderer prefigure; tē faʻaohipa nei i te huru o te vāhi ʻatau.

prefigure-y-label-position-unsupported = `<graph>`: ʻaita te yLabelPosition="bottom" e tauturuhia i roto i te renderer prefigure; tē faʻaohipa nei i te huru o te vāhi i niʻa.

prefigure-invalid-axis-bounds = `<graph>`: tano ʻore te mau ʻōtiʻa o te ʻāfata nō te tauiraʻa prefigure; tē faʻaohipa nei i te bbox mātauhia (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: tano ʻore te ʻāteatea nō te tauiraʻa prefigure; tē faʻaohipa nei i te ʻāteatea mātauhia o te hōhoʻa 425.

prefigure-invalid-aspect-ratio = `<graph>`: tano ʻore te aspectRatio nō te tauiraʻa prefigure; tē faʻaohipa nei i te aspect ratio mātauhia 1.

prefigure-grid-spacing-too-fine = `<graph>`: mea piri roa te ʻāteatea o te grid nō te mau ʻōtiʻa o te ʻāfata; ʻaita te grid e hōhoʻahia i roto i te renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: ʻaita te mau annotation e hōhoʻahia mai te mea ʻaita te renderer PreFigure e faʻaohipahia.

multiple-annotations-children = E rave rahi tamariʻi `<annotations>` i ʻitehia i roto i te `<graph>`; ʻaita te tāʻato ʻaraʻa e faʻaohipahia maori râ te hopeʻa.

## Referring to other components

copy-unrecognized-component-type = ʻEita e nehenehe e faʻaroa aore rā e huri i te huru tuhaʻa ʻaita i ʻitehia: { $type }.

copy-prop-not-found = ʻAita i ʻitehia te prop { $property } i roto i te tuhaʻa huru { $component }

collect-no-source = ʻAita i ʻitehia te source nō te collect.

collect-invalid-component-type = ʻEita e nehenehe e haʻaputu i te mau tuhaʻa huru `<{ $component }>` nō te mea tano ʻore te huru tuhaʻa.

reference-index-unavailable = ʻEita e nehenehe e faʻahiti i te indeki `{ $reference }`

## `<callAction>`

component-action-unavailable = ʻEita e nehenehe e piʻi i te { $action } i roto i te tuhaʻa `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Tano ʻore te huru o te mau numera.  ʻAita te roa o te mau ʻāfata roa e ʻaifaito. Ua ʻitehia i te componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = E vai ra te iʻoa tīʻā hōʻē â i roto i te mau numera.  Ua ʻitehia i te componentIdx :{ $componentIdx }

data-frame-missing-column-name = ʻAita te iʻoa o te tahi tīʻā i roto i te mau numera.  Ua ʻitehia i te componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Tē tiʻaturi nei te award o teie pāhonoraʻa i te pāhonoraʻa tā te answer tag iho i hōpoi, ʻe e faʻatupu te reira i te huru ʻaita i tiʻaturihia.

answer-max-num-attempts-in-section-wide-check-work = ʻAita te tuʻuraʻa i te `maxNumAttempts` i roto i te hōʻē `<answer>` i roto i te ʻāfata e vai ra te `sectionWideCheckWork` e ʻohipa, nō te mea nā te ʻāfata e faʻanaho i te rahiraʻa tāmataraʻa. A tuʻu i te `maxNumAttempts` i niʻa i te ʻāfata.

nested-section-wide-check-work-max-num-attempts = ʻAita te tuʻuraʻa i te `maxNumAttempts` i niʻa i te ʻāfata e vai ra te `sectionWideCheckWork` e vai ra i roto i te tahi atu ʻāfata e vai ra te `sectionWideCheckWork` e ʻohipa, nō te mea nā te ʻāfata i rāpae e faʻanaho i te rahiraʻa tāmataraʻa. A tuʻu i te `maxNumAttempts` i niʻa i te ʻāfata i rāpae.

# No select: «ʻatirivite» is the same word for one and for many.
answer-attributes-need-symbolic-equality = ʻEita te ʻatirivite { $attributes } e ʻohipa mai te mea ʻaita te symbolicEquality i tuʻuhia.

answer-invalid-type = Huru tano ʻore nō te pāhonoraʻa: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Nō te mea ʻaita te iʻoa o te tuhaʻa `<{ $component }>`, ʻeita e nehenehe e faʻaohipa i te reira ei ʻatirivite nō te module

module-attribute-name-already-defined = ʻEita e nehenehe e faʻaohipa i te tuhaʻa `<{ $component } name="{ $name }">` ei ʻatirivite nō te module nō te mea tē vai nei tā te huru tuhaʻa `<module>` te ʻatirivite "{ $name }".

conditional-content-condition-ignored = ʻAita te ʻatirivite `condition` e faʻaohipahia i roto i te tuhaʻa `<conditionalContent>` e vai ra te mau tamariʻi case aore rā else.

slider-markers-type-mismatch = ʻAita te huru o te marker e tuʻati i te huru o te slider.

pretzel-problem-needs-statement-and-answer = Pretzel tano ʻore: e tiʻa i te `<problem>` tāʻitahi ia vai te hōʻē `<statement>` ʻe te hōʻē `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel tano ʻore: i te mode="circuit", ʻeita e nehenehe te `<problem>` mātāmua ia riro ei distractor.

## Attribute values

# No select: «faito» is the same word for one and for many.
attribute-invalid-values = Faito tano ʻore { $values } nō te ʻatirivite `{ $attribute }`; ʻaita e faʻaohipahia.

attribute-must-be-references = Faito tano ʻore `{ $value }` nō te ʻatirivite `{ $attribute }`. E tiʻa i te ʻatirivite ia hāmanihia i te mau faʻahitiraʻa e haʻamata i te `$`.

math-input-invalid-function-names = <mathInput>: ʻaita te mau iʻoa fonotio tano ʻore i roto i te { $attribute } e faʻaohipahia: { $names }. E tiʻa i te iʻoa tāʻitahi ia vai e piti aore rā hau atu reta (reta aore rā tuʻatiraʻa); e nehenehe te suffix `|<mathspeak alternative>` e pee.

## Building components from the source

component-type-invalid = Huru tuhaʻa tano ʻore: `<{ $componentType }>`

attribute-repeated = ʻEita e nehenehe e faʻahiti piti i te ʻatirivite { $attribute }.

attribute-invalid-for-component = ʻAtirivite tano ʻore "{ $attribute }" nō te tuhaʻa huru `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    ʻAita te taʻa ê o te faʻataʻaraʻa huru { $styleNumber } e navai nō te { $context ->
        [text-on-background] ʻiriʻiri o te parau i mua i te ʻiriʻiri o niʻa
        [high-contrast] ʻiriʻiri taʻa ê teitei i mua i te ʻāfata
        [line] ʻiriʻiri o te reni i mua i te ʻāfata
        [marker] ʻiriʻiri o te marker i mua i te ʻāfata
       *[text-on-canvas] ʻiriʻiri o te parau i mua i te ʻāfata
    }{ $mode ->
        [dark] { " (huru pōuri)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e titauhia te { $threshold }:1 aore rā hau atu).

style-definition-dark-mode-text-background-contrast =
    Noa atu â e vai ra i roto i te faʻataʻaraʻa huru { $styleNumber } te mau ʻiriʻiri i haʻapāpūhia e navai tō rātou taʻa ê nō te huru māramarama, ʻaita te taʻa ê o te ʻiriʻiri o te parau i mua i te ʻiriʻiri o niʻa e navai i roto i te mau ʻiriʻiri i ravehia nō te huru pōuri ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e titauhia te { $threshold }:1 aore rā hau atu). { $suggestion ->
        [available] Ia navai te taʻa ê i te huru pōuri, a faʻarahi i te taʻa ê o te huru māramarama (ei hiʻoraʻa, a tuʻu i te { $lightAttribute }="{ $lightColor }") aore rā a mono i te ʻiriʻiri o te huru pōuri (ei hiʻoraʻa, a tuʻu i te { $darkAttribute }="{ $darkColor }").
       *[none] Ia navai te taʻa ê i te huru pōuri, a faʻarahi i te taʻa ê o te huru māramarama aore rā a mono i te mau ʻiriʻiri i ravehia na roto i te textColorDarkMode ʻe/aore rā te backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Noa atu â e vai ra i roto i te faʻataʻaraʻa huru { $styleNumber } te ʻiriʻiri parau i haʻapāpūhia e navai tōna taʻa ê nō te huru māramarama, ʻaita te taʻa ê o te ʻiriʻiri parau i ravehia nō te huru pōuri e navai i mua i te ʻāfata ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e titauhia te { $threshold }:1 aore rā hau atu). { $suggestion ->
        [available] Ia navai te taʻa ê i te huru pōuri, a faʻarahi i te taʻa ê o te huru māramarama (ei hiʻoraʻa, a tuʻu i te textColor="{ $lightColor }") aore rā a mono i te ʻiriʻiri o te huru pōuri (ei hiʻoraʻa, a tuʻu i te textColorDarkMode="{ $darkColor }").
       *[none] Ia navai te taʻa ê i te huru pōuri, a faʻarahi i te taʻa ê o te huru māramarama aore rā a mono i te ʻiriʻiri i ravehia na roto i te textColorDarkMode.
    }

section-multiple-style-palettes = Hōʻē noa <stylePalette> e nehenehe e māʻitihia e te hōʻē tuhaʻa; tē faʻaohipa nei i te hopeʻa.

## Unique variants

variant-num-to-select-not-non-negative-integer = ʻeita e nehenehe e haʻapāpū i te mau huru taʻa ê otahi o te { $component } nō te mea ʻaita te numToSelect e numera taʻato ʻa ʻaore e haʻehaʻa i te ʻōre.

variant-num-to-select-not-constant-number = ʻeita e nehenehe e haʻapāpū i te mau huru taʻa ê otahi o te { $component } nō te mea ʻaita te numToSelect e numera pāpū.

variant-with-replacement-not-constant-boolean = ʻeita e nehenehe e haʻapāpū i te mau huru taʻa ê otahi o te { $component } nō te mea ʻaita te withReplacement e boolean pāpū.

variant-select-weight-disables-unique = Ua tāpeʻahia te mau huru taʻa ê otahi nō te select mai te mea e vai ra te māʻitiraʻa e haʻapāpūhia te selectWeight aore rā te selectForVariants

variant-coprime-undetermined = ʻeita e nehenehe e haʻapāpū i te mau huru taʻa ê otahi o te { $component } nō te mea ʻeita e nehenehe e haʻapāpū e false noa te coprime.

variant-attribute-not-constant = ʻeita e nehenehe e haʻapāpū i te mau huru taʻa ê otahi o te { $component } nō te mea ʻaita te { $attribute } e pāpū.

variant-attribute-not-number = ʻeita e nehenehe e haʻapāpū i te mau huru taʻa ê otahi o te { $component } nō te mea ʻaita te { $attribute } e numera.

variant-attribute-wrong-type-for-sequence =
    ʻeita e nehenehe e haʻapāpū i te mau huru taʻa ê otahi o te { $component } huru { $type } nō te mea ʻaita te { $attribute } e { $expected ->
        [letters-combination] tuʻatiraʻa reta
        [math-expression] parau numera tano
        [integer] numera taʻato ʻa
       *[number] numera
    }.

variant-length-not-integer = ʻeita e nehenehe e haʻapāpū i te mau huru taʻa ê otahi o te { $component } nō te mea ʻaita te length e numera taʻato ʻa.

variant-sort-not-implemented = ʻaitaʻe te mau huru taʻa ê otahi o te hōʻē { $component } e vai ra te sort i faʻatupuhia

variant-exclude-combinations-not-implemented = ʻaitaʻe te mau huru taʻa ê otahi o te hōʻē { $component } e vai ra te excludeCombinations i faʻatupuhia

variant-math-exclude-not-implemented = ʻaitaʻe te mau huru taʻa ê otahi o te hōʻē { $component } huru math e vai ra te exclude i faʻatupuhia

variant-non-constant-exclude-not-implemented = ʻaitaʻe te mau huru taʻa ê otahi o te hōʻē { $component } e vai ra te exclude ʻaore e pāpū i faʻatupuhia

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ʻaita e tauturuhia i roto i te renderer prefigure o te graph; ua faʻarue i te huaʻai.

prefigure-descendant-invalid-geometry = { $subject }: ʻaore e ʻōtiʻa aore rā ʻaita i ʻoti te huru; ua faʻarue i te huaʻai.

prefigure-curve-label-omitted = { $subject }: ʻaita te mau tāpaʻo e tauturuhia i niʻa i te mau pīʻao i hurihia; ua faʻaruehia te tāpaʻo.

prefigure-curve-unsupported-definition-type = { $subject }: ʻaita te huru faʻataʻaraʻa pīʻao '{ $definitionType }' e tauturuhia; ua faʻarue i te huaʻai.

prefigure-region-flip-functions-unsupported = { $subject }: ʻaita te ʻatirivite flipFunctions i niʻa i te regionBetweenCurves e tauturuhia; ua faʻarue i te huaʻai.

prefigure-region-non-formula-child = { $subject }: te mau tamariʻi fonotio huru formula ana ʻe tē tauturuhia i roto i te regionBetweenCurves; ua faʻarue i te huaʻai.

prefigure-label-position-unsupported =
    { $subject }: ʻaita te labelPosition '{ $labelPosition }' e tauturuhia nō te { $labelKind ->
        [line-family] tāpaʻo o te ʻutuāfare reni
       *[point] tāpaʻo o te poini
    }; tē faʻaohipa nei i te faʻaʻaifaitoraʻa mātauhia a PreFigure.

prefigure-fill-style-unsupported = { $subject }: ʻaita te huru ʻīraʻa '{ $fillStyle }' e tauturuhia e PreFigure; tē hoʻi nei i te ʻīraʻa pāpū.

prefigure-line-style-unknown = { $subject }: ʻaita te huru reni '{ $lineStyle }' i ʻitehia, ua faʻaruehia i roto i te output a PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: ua tuʻatihia te huru marker '{ $markerStyle }' i te huru 'diamond' a PreFigure.

prefigure-marker-style-unsupported = { $subject }: ʻaita te huru marker '{ $markerStyle }' e tauturuhia e PreFigure; tē faʻaohipa nei i te huru mātauhia.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` tano ʻore; ʻeita e nehenehe e faʻataʻa i te target. Ua faʻaruehia te annotation.

annotation-ref-multiple-targets = `<annotation>`: ua faʻataʻa te `ref` i te rave rahi target; tē faʻaohipa nei i te target mātāmua.

annotation-ref-outside-graph = `<annotation>`: `ref` tano ʻore; tē vai nei te target i rāpae i te graph e vai ra i roto. Ua faʻaruehia te annotation.

annotation-ref-unsupported-target = `<annotation>`: `ref` tano ʻore; ʻaita te target e mea hōhoʻa e tauturuhia i roto i te tauiraʻa prefigure. Ua faʻaruehia te annotation.

annotation-text-missing = `<annotation>`: ʻaita aore rā ʻaore e mea i roto i te `text`; tē faʻaʻite nei i te parau ʻaore.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ua ʻitehia te tiʻaturiraʻa ʻāti.
       *[other] Ua ʻitehia te tiʻaturiraʻa ʻāti e ʻo mai ra te tuhaʻa `<{ $componentType }>`.
    }

reference-no-referent = ʻAita i ʻitehia te mea tā te faʻahitiraʻa e faʻataʻa nei: `{ $reference }`

reference-multiple-referents = E rave rahi mea i ʻitehia tā te faʻahitiraʻa e faʻataʻa nei: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Huru tano ʻore o te ʻatirivite { $attribute } o te `<{ $componentType }>`.

children-invalid = Tano ʻore te mau tamariʻi o te `<{ $componentType }>`: ua ʻitehia te mau tamariʻi tano ʻore: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Faito tano ʻore `{ $value }` nō te ʻatirivite `{ $attribute }`, tē faʻaohipa nei i te faito `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] ʻAita i ʻitehia te huru DoenetML { $version }.
       *[other] ʻAita i ʻitehia te huru DoenetML { $version }. Tē hoʻi nei i te huru { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML tano ʻore: { $content }

parse-tag-missing-close-tag = DoenetML tano ʻore: ʻAita te tag ʻōpani o te tag `{ $tag }`. E tiʻaturihia te tag e ʻōpani ia ʻoia iho aore rā te tag `</{ $tagName }>`.

parse-tag-error = DoenetML tano ʻore: E hape tō roto i te tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML tano ʻore: Mai te mea ʻaita te faito o te ʻatirivite tano ʻore `{ $attribute }`.

parse-attribute-invalid = DoenetML tano ʻore: ʻAtirivite tano ʻore `{ $attribute }`

parse-attribute-value-invalid = DoenetML tano ʻore: Faito ʻatirivite tano ʻore `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML tano ʻore: Faito ʻatirivite tano ʻore `{ $value }`. ʻAita te mau tāpaʻo parau e tuʻati. Mai te mea ʻaita te hōʻē `{ $quote }`

parse-open-tag-name-missing = DoenetML tano ʻore: Ua ʻitehia te tag ʻaore tōna iʻoa, mai te `<`

parse-tag-not-closed = DoenetML tano ʻore: ʻAita te tag `{ $tag }` i ʻōpanihia (mai te mea ʻaita te `>`).

parse-self-closing-tag-name-missing = DoenetML tano ʻore: Ua ʻitehia te tag ʻaore tōna iʻoa `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML tano ʻore: ʻAita te tag `{ $tag }` i ʻōpanihia (mai te mea ʻaita te `/>`).

parse-tag-invalid-attributes = DoenetML tano ʻore: Tano ʻore te tag `{ $tag }`. Peneiaʻe tano ʻore tōna mau ʻatirivite.

parse-close-tag-name-missing = DoenetML tano ʻore: Ua ʻitehia te tag ʻōpani ʻaore tōna iʻoa, mai te `</`

parse-attribute-value-unquoted = E tiʻa i te mau faito ʻatirivite ia tuʻuhia i roto i te mau tāpaʻo parau: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML tano ʻore: Ua ʻitehia te tag ʻōpani `{ $tag }`, ʻaita rā te tag ʻiriti e tuʻati

parse-close-tag-mismatched = DoenetML tano ʻore: ʻAita te tag ʻōpani e tuʻati. E tiʻaturihia te `</{ $expected }>`. Ua ʻitehia te `{ $found }`

parser-node-unconvertible = ʻAita i nehenehe i huri i te node { $node } ei node Dast.

## Names

name-attribute-invalid =
    ʻAtirivite tano ʻore name='{ $name }'. { $reason ->
        [characters] E nehenehe noa te mau iʻoa ia vai te reta, te numera, te reni i raro aore rā te reni faʻataʻa.
       *[start] E tiʻa i te mau iʻoa ia haʻamata i te hōʻē reta.
    }

component-name-invalid-start = Iʻoa tuhaʻa tano ʻore "{ $name }". E tiʻa i te mau iʻoa ia haʻamata i te hōʻē reta.

## `<answer>` sugar

answer-video-watched-missing-video = E tiʻa i te answer e type videoWatched ia vai te ʻatirivite video

answer-video-watched-video-not-reference = E tiʻa i te ʻatirivite video o te answer e type videoWatched ia riro ei faʻahitiraʻa

answer-name-not-single-text = E tiʻa i te ʻatirivite name o te answer ia vai te hōʻē noa tamariʻi text

## Referencing another document

external-doenetml-recursion-limit = ʻEita e nehenehe e rave i te DoenetML nō rāpae nō te rahi roa o te mau faito faʻahitiraʻa. Tē vai nei anei te faʻahitiraʻa ʻāti?

external-doenetml-unavailable = ʻEita e nehenehe e rave i te DoenetML nō roto mai i te { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML tano ʻore i ravehia mai roto mai i te { $attribute }="{ $uri }": ʻaita ʻoia i tuʻati i te huru tuhaʻa "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] ʻAita te ʻatirivite `{ $from }` e faʻaohipahia faʻahou; a faʻaohipa i te `{ $to }`.
       *[other] [deprecation] ʻAita te ʻatirivite `{ $from }` i roto i te `<{ $component }>` e faʻaohipahia faʻahou; a faʻaohipa i te `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] ʻAita te ʻatirivite `{ $from }` e faʻaohipahia faʻahou ʻe ʻaita e faʻaohipahia nō te mea ua haʻapāpūhia atoʻa te `{ $to }`.
       *[other] [deprecation] ʻAita te ʻatirivite `{ $from }` i roto i te `<{ $component }>` e faʻaohipahia faʻahou ʻe ʻaita e faʻaohipahia nō te mea ua haʻapāpūhia atoʻa te `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] ʻAita te ʻatirivite `{ $attribute }` i roto i te `<{ $component }>` e faʻaohipahia faʻahou ʻe ʻaita e faʻaohipahia.

deprecated-attribute-to-child = [deprecation] ʻAita te ʻatirivite `{ $attribute }` i roto i te `<{ $component }>` e faʻaohipahia faʻahou; a faʻaohipa i te tamariʻi `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] ʻAita te faito `{ $value }` o te ʻatirivite `{ $attribute }` i roto i te `<{ $component }>` e faʻaohipahia faʻahou; a faʻaohipa i te `{ $to }`.


## Language coverage

pluralize-english-only = E nehenehe noa te `<pluralize>` e faʻarahi i te reo Beretane, nō reira ʻaita tōna parau e tauihia i roto i te papaʻiraʻa i papaʻihia na roto i te { $locale }. A papaʻi tōtiʻa i te huru rahi, aore rā a tuʻu i te reira na roto i te ʻatirivite `pluralForm`.


## Checking against the schema

schema-element-unrecognized = ʻAita te elemata `<{ $tag }>` e elemata Doenet i ʻitehia.

schema-element-not-allowed-at-root = ʻAita te elemata `<{ $tag }>` e faʻatiʻahia i te aʻa o te papaʻiraʻa.

schema-element-not-allowed-inside = ʻAita te elemata `<{ $tag }>` e faʻatiʻahia i roto i te `<{ $parent }>`.

schema-attribute-unrecognized = ʻAita te ʻatirivite tōna iʻoa `{ $attribute }` i roto i te elemata `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] E tiʻa i te ʻatirivite `{ $attribute }` o te elemata `<{ $tag }>` ia riro ei tāpura e riro te mea tāʻitahi ei hōʻē o te: { $allowed }
       *[other] E tiʻa i te ʻatirivite `{ $attribute }` o te elemata `<{ $tag }>` ia riro ei hōʻē o te: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Iʻoa huru taʻa ê tano ʻore nō te select.  Tē ʻitehia nei te iʻoa huru taʻa ê { $variantName } i roto i te { $numOptions } māʻitiraʻa, e { $numToSelect } rā te rahiraʻa e māʻitihia.

select-variant-name-without-options = Ua haʻapāpūhia te tahi mau huru taʻa ê nō te select, ʻaita rā e māʻitiraʻa i haʻapāpūhia nō te iʻoa huru taʻa ê: { $variantName }.

select-variant-name-not-possible = ʻAita te iʻoa huru taʻa ê { $variantName } i haʻapāpūhia nō te select e iʻoa huru taʻa ê e nehenehe.

select-too-few-options = ʻEita e nehenehe e māʻiti i te { $numToSelect } tuhaʻa nō roto mai i te { $numOptions } ana ʻe.

select-from-sequence-too-few-values = ʻEita e nehenehe e māʻiti i te { $numToSelect } faito nō roto mai i te sequence e { $length } tōna roa.

select-from-sequence-indices-count-mismatch = E tiʻa i te rahiraʻa indeki i haʻapāpūhia nō te select ia tuʻati i te rahiraʻa e māʻitihia

select-from-sequence-indices-not-integers = E tiʻa i te mau indeki ato ʻa i haʻapāpūhia nō te select ia riro ei numera taʻato ʻa

select-from-sequence-index-excluded = Ua haʻapāpūhia te indeki o te selectfromsequence tei faʻaruehia

select-from-sequence-indices-excluded-combination = Ua haʻapāpūhia te mau indeki o te selectfromsequence e tuʻatiraʻa tei faʻaruehia

select-from-sequence-coprime-not-positive-integers = ʻEita e nehenehe e māʻiti i te mau tuʻatiraʻa coprime nō te mea ʻaita e numera taʻato ʻa maitaʻi tē māʻitihia.

select-from-sequence-coprime-common-factor = ʻEita e nehenehe e māʻiti i te mau numera coprime. Hōʻē â faktora tō te mau faito ato ʻa. (E tiʻa i te faito "from" aore rā "to" i haʻapāpūhia ia riro ei coprime e te "step".)

select-from-sequence-coprime-single-number = ʻEita e nehenehe e māʻiti i te mau tuʻatiraʻa coprime nō roto mai i te hōʻē noa numera ʻaore e 1.

select-from-sequence-excluded-too-many-combinations = Ua faʻaruehia hau atu i te 70% o te mau tuʻatiraʻa i roto i te selectFromSequence

select-from-sequence-coprime-none-found = ʻAita i nehenehe i māʻiti i te mau numera coprime. Hōʻē â faktora tō te mau faito ato ʻa.

select-from-sequence-too-few-unique-values = ʻEita e nehenehe e māʻiti i te { $numToSelect } faito otahi nō roto mai i te sequence e { $numPossibleValues } tōna roa

select-prime-numbers-too-few-values = ʻEita e nehenehe e māʻiti i te { $numToSelect } faito nō roto mai i te tāpura numera prime e { $numValues } tōna roa

select-prime-numbers-values-count-mismatch = E tiʻa i te rahiraʻa faito i haʻapāpūhia nō te select ia tuʻati i te rahiraʻa e māʻitihia

select-prime-numbers-values-not-prime = E tiʻa i te mau faito ato ʻa i haʻapāpūhia nō te select prime number ia vai i roto i te tāpura numera prime

select-prime-numbers-values-excluded-combination = Te mau faito o te selectPrimeNumbers i haʻapāpūhia e tuʻatiraʻa tei faʻaruehia

select-prime-numbers-excluded-too-many-combinations = Ua faʻaruehia hau atu i te 70% o te mau tuʻatiraʻa i roto i te selectPrimeNumbers

select-random-combination-fluke = Nō te hōʻē ohipa mea varavara roa, ʻaita i nehenehe i māʻiti i te tuʻatiraʻa o te mau faito taʻiʻiti

select-random-value-fluke = Nō te hōʻē ohipa mea varavara roa, ʻaita i nehenehe i māʻiti i te faito taʻiʻiti
