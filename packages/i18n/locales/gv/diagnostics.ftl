# Manx (Gaelg) diagnostics. Translated from `locales/en/diagnostics.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin, traditional Manx orthography** (Cregeen's dictionary of
# 1835, Kelly's «Fockleyr Manninagh as Baarlagh», the Manx Bible), as in every
# file of this catalog. Digits are Latin, as `src/intl.ts` pins for every
# locale, and every number inside this prose is written in Latin digits.
#
# **DoenetML identifiers are not translated.** `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `labelPosition`, `selectFromSequence` and
# every tag name stay in English exactly as written, as do the `[deprecation]`
# marker and `WCAG AA`.
#
# **Manx and borrowed.** The frame is Manx: «cha nel» / «cha nod» negating,
# «shegin da» for *must*, «son» for *for*, «gyn» for *without*, «agh» for
# *but*, «as» for *and*, «ny» for *or*, «tra» for *when*, «er-yn-oyr dy» for
# *because*, «ayns ynnyd shen» for *instead*. «marranys», «raaue», «feddynit»,
# «neu-chair», «lhiggit shaghey», «enmyssit», «ennym», «earroo», «linney»,
# «poynt», «bree» and «sorch» are Manx. The markup vocabulary is **English,
# declared**: `attribute`, `component`, `element`, `reference`, `input`,
# `index`, `array`, `renderer`, `format`. Manx terminology work has not reached
# XML markup, and a Manx speaker reads those words in English; disguising them
# in coined Gaelic would be worse than saying so.
#
# **Counts.** Manx's CLDR rules select only `one` (n mod 10 = 1: 1, 11, 21, …),
# `two` (n mod 10 = 2: 2, 12, 22, …), `few` (n mod 100 = 0, 20, 40, 60, 80:
# 0, 20, 40, 60, 80, 100, …) and `other` for integers. `many` is a declared
# category belonging to counts written with a visible decimal fraction, which
# **no integer is**, so no `[many]` branch appears anywhere in this catalog.
#
# A Manx noun after a numeral stays singular and only its initial moves: «un»
# and «daa» lenite (b→v, c→ch, d→gh, g→gh, j→y, m→v, p→ph, s→h, t→h) and
# «feed» and «tree»…«jeih» do not. So a message that **prints** its numeral
# forks `one` / `two` against `other` — `function-domain-insufficient-dimensions`,
# `function-iterates-input-output-mismatch` and `field-function-wrong-num-outputs`
# do, on «coyrt-stiagh» and «coyrt-magh».
#
# A message that counts a list without printing a numeral does **not** fork:
# `one` would catch a list of 11 attributes and give it a singular. So
# `line-segment-attributes-ignored-with-endpoints` and its neighbours,
# `matches-pattern-parameter-not-in-pattern`,
# `answer-attributes-need-symbolic-equality` and `attribute-invalid-values` are
# each written once, which is the correct Manx and not a shortcut.
#
# `field-function-wrong-num-outputs`'s `$expected` is a two-way choice between
# one output and two rather than a plural; 2 selects `two` in Manx, which falls
# through to `*[other]`, so the branch pair still lands correctly.
#
# The exception to that account, left for a speaker: `select-too-few-options`
# and the two `select-from-sequence-too-few-*` messages print `{ $numToSelect }`
# in front of «bree», whose `b` lenites to «vree» after «un» and «daa», and are
# written once anyway. `circle-through-points-non-numerical` is the same seam
# with «poynt», whose `p` lenites to «phoynt» — and this file already writes it
# both ways within four lines of itself, «ny smoo na un phoynt» beside «ny smoo
# na 1 poynt», because it follows the English original's digit/word split rather
# than Manx's. Either all of them want the `one`/`two` fork the three messages
# above take, or those three do not. `locales/kw`'s `diagnostics.ftl` records
# the identical seam for Cornish, message for message.
#
# **Weakest first.** «çhiaghtoo» for *sequence* is the first thing to check:
# it is used seven times and consistently, but it is the ordinal of «shiaght»
# (*seven*), so it may be the wrong word done tidily. Then «lhiggit shaghey»
# for *ignored*, «reaghit» for *resolved* and «co-heiyrtys» for *dependency*;
# then the parser and schema sections, which carry the longest sentences and
# the least dictionary support.

## `<lineSegment>`

# The list is a placeable and no numeral is printed, so the two English
# branches collapse into one form: see the note on counts above.
line-segment-attributes-ignored-with-endpoints = Ta { $attributes } lhiggit shaghey tra ta daa endpoint enmyssit
line-segment-attributes-ignored-with-endpoint-and-midpoint = Ta { $attributes } lhiggit shaghey tra ta endpoint as midpoint ny neesht enmyssit
line-segment-midpoint-offset-without-midpoint = cha nel bree erbee ec midpointOffset gyn midpoint

## `<line>`

line-points-undetermined-dimensions = Linney trooid poyntyn gyn towseyn cronnit.
line-points-too-few-dimensions = Shegin da'n linney goll trooid poyntyn jeh daa howse er y chooid sloo.
line-points-depend-on-variables = Ta'n linney goll trooid poyntyn ta croghey er caghlaaderyn: { $variables }.
line-equation-invalid-format = Format neu-chair son co-heeshtaght linney ayns ny caghlaaderyn { $variable1 } as { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ta'n goull enmyssit liorish through, endpoint as direction. Lhiggey shaghey yn through enmyssit.
ray-dimension-mismatch = Cha nel numDimensions cordail ayns y ghoull.

## `<vector>`

vector-overprescribed-head = Ta'n vectoyr enmyssit liorish head, tail as displacement. Lhiggey shaghey yn head enmyssit.
vector-dimension-mismatch = Cha nel numDimensions cordail ayns y vectoyr.

## Attracting and constraining

attract-to-without-nearest-point = Cha nod oo tayrn gys `<{ $component }>` er-yn-oyr nagh vel caghlaader stayd nearestPoint echey.
constrain-to-without-nearest-point = Cha nod oo cumrail gys `<{ $component }>` er-yn-oyr nagh vel caghlaader stayd nearestPoint echey.
constrain-to-interior-without-nearest-point = Cha nod oo cumrail gys cheu-sthie jeh `<{ $component }>` er-yn-oyr nagh vel caghlaader stayd nearestPoint echey.

## `<choiceInput>`

choice-input-label-position-ignored = ta labelPosition lhiggit shaghey son choiceInput nagh vel inline

## Ordering children by index

choice-input-indices-count-mismatch = Lhiggey shaghey ny indices enmyssit son choiceInput er-yn-oyr nagh vel earroo ny indices cordail rish earroo ny cloan choice.
pretzel-indices-count-mismatch = Lhiggey shaghey ny indices enmyssit son problem er-yn-oyr nagh vel earroo ny indices cordail rish earroo ny cloan problem.
shuffle-indices-count-mismatch = Lhiggey shaghey ny indices enmyssit son shuffle er-yn-oyr nagh vel earroo ny indices cordail rish earroo ny component.
indices-ignored-out-of-range = Lhiggey shaghey ny indices enmyssit son { $component } er-yn-oyr dy vel paart jeu ass towse.
pretzel-indices-repeated = Lhiggey shaghey ny indices enmyssit son pretzel er-yn-oyr dy vel paart jeu aa-ghrait.
pretzel-circuit-first-index = Lhiggey shaghey ny indices enmyssit son pretzel ayns mod circuit er-yn-oyr dy nhegin da'n chied index ve 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Dy vod `<{ $component }>` gobbraghey lesh cloan streng, shegin da'n attribute `type` ve enmyssit.
invalid-type-defaulting-to-math = Sorch neu-chair { $type } son y component { $component }. Shegin da ve unnane jeh math, text, number ny boolean. Goaill math myr cadjin.
string-not-valid-component-to-arrange = Cha nel yn streng "{ $value }" ny component cair dy { $component }. Lhiggey shaghey.

## Types and variables

invalid-type-defaulting-to-number = Sorch neu-chair { $type }, cur y sorch dys number.
invalid-variable-value = Bree neu-chair jeh caghlaader: `{ $value }`

## Variants

variant-index-must-be-number = Shegin da'n index caghlaa { $index } ve ny earroo
variant-index-must-be-integer = Shegin da'n index caghlaa { $index } ve ny slane earroo

## `<sideBySide>`

side-by-side-absolute-widths = Cha nel `<{ $component }>` jeant son towseyn bunneydagh. Cur ny lheead dys relative.
side-by-side-absolute-margins = Cha nel `<{ $component }>` jeant son towseyn bunneydagh. Cur ny oirryn dys relative.
side-by-side-no-block-child = `<{ $component }>` neu-chair: shegin da ve unnane lhiannoo block echey er y chooid sloo.

## `<label>`

label-for-ignored-on-graphical = Ta'n attribute `for` er `<label>` graafagh lhiggit shaghey.
label-for-must-resolve-to-one = Shegin da'n attribute `for` er `<label>` reaghey dys un component dy jeeragh.
label-for-unresolved = Cha row yn attribute `for` er `<label>` abyl dy ve reaghit dys component.
label-for-answer-with-authored-inputs = Ta'n attribute `for` er `<label>` cowraghey `<answer>` lesh inputs screeuit ec yn ughtar; cowree yn input hene.
label-for-answer-without-input = Ta'n attribute `for` er `<label>` cowraghey `<answer>` gyn input dy lipey.
label-for-must-reference-input-or-answer = Shegin da'n attribute `for` er `<label>` cowraghey input ny ansoor.

## Accessibility

accessibility-short-description-or-decorative = Son roshtynys, shegin da `<{ $component }>` ve cur myn-choontey giare ny ve enmyssit myr decorative.
accessibility-video-short-description = Son roshtynys, shegin da `<video>` ve cur myn-choontey giare.
accessibility-input-short-description-or-label = Son roshtynys, shegin da `<{ $component }>` ve cur myn-choontey giare ny lipey.
accessibility-answer-input-short-description-or-label = Son roshtynys, shegin da `<answer>` ta jannoo input ve cur myn-choontey giare ny lipey.
accessibility-short-description-contains-math = Cha lhisagh myn-choontaghyn giare ve cummal component maddaghtagh myr `<{ $component }>`. Screeu magh yn vaddaght lesh focklyn.
accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Cha nel dy liooar contrast ec { $colorName } son teks kione y rheynn (mod dorraghey) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; shegin da ve { $threshold }:1 er y chooid sloo).
       *[other] Cha nel dy liooar contrast ec { $colorName } son teks kione y rheynn ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; shegin da ve { $threshold }:1 er y chooid sloo).
    }

## `<circle>`

circle-through-points-non-numerical = Cha nel `<circle>` trooid { $count } poynt jeant tra nagh vel breeyn earrooagh ec ny poyntyn.
circle-too-many-through-points = Cha nod oo cowrey kiarkyl trooid ny smoo na 3 poynt.
circle-overprescribed-radius-center-points = Cha nod oo cowrey kiarkyl lesh radius, mean as poyntyn enmyssit.
circle-center-with-multiple-points = Cha nod oo cowrey kiarkyl lesh mean enmyssit trooid ny smoo na 1 poynt.
circle-radius-too-small = Cha nod oo cowrey kiarkyl: fakin dy vel yn foddid eddyr y daa phoynt { $distance }, ta'n radius enmyssit { $radius } ro veg.
circle-radius-with-many-points = Cha nod oo jannoo kiarkyl trooid ny smoo na daa phoynt lesh radius enmyssit.
circle-invalid-center-or-through-points = Mean ny poyntyn through neu-chair jeh'n chiarkyl.
circle-radius-center-with-multiple-points = Cha nod oo cowrey radius kiarkyl lesh mean enmyssit trooid ny smoo na 1 poynt.
circle-change-radius-non-numerical = Cha nod oo caghlaa radius kiarkyl lesh poyntyn through nagh vel earrooagh
circle-radius-with-points-non-numerical = Cha nod oo jannoo kiarkyl trooid ny smoo na un phoynt lesh radius enmyssit tra nagh vel breeyn earrooagh ayn.
circle-change-center-non-numerical = Cha nel caghlaa mean kiarkyl trooid poyntyn lesh breeyn nagh vel earrooagh jeant.

## `<function>`

# «reamys» begins with `r`, which has no lenited form, so the interval count
# does not fork; «coyrt-stiagh» begins with `c`, which «un» and «daa» lenite
# to `ch`, so the input count does.
function-domain-insufficient-dimensions =
    Cha nel dy liooar towseyn son domain y funshoon. Ta { $intervals } reamys ayns y domain agh ta { $inputs ->
        [one] { $inputs } choyrt-stiagh
        [two] { $inputs } choyrt-stiagh
       *[other] { $inputs } coyrt-stiagh
    } ec y funshoon.
function-domain-invalid-format = Format neu-chair son domain y funshoon.
function-ignoring-non-numerical =
    { $type ->
        [maximum] Lhiggey shaghey yn ard-vree nagh vel earrooagh jeh'n funshoon.
        [minimum] Lhiggey shaghey yn injil-vree nagh vel earrooagh jeh'n funshoon.
        [extremum] Lhiggey shaghey yn eer-vree nagh vel earrooagh jeh'n funshoon.
        [point] Lhiggey shaghey yn poynt nagh vel earrooagh jeh'n funshoon.
        [slope] Lhiggey shaghey yn liargagh nagh vel earrooagh jeh'n funshoon.
       *[other] Lhiggey shaghey yn { $type } nagh vel earrooagh jeh'n funshoon.
    }
function-ignoring-empty =
    { $type ->
        [maximum] Lhiggey shaghey yn ard-vree follym jeh'n funshoon.
        [minimum] Lhiggey shaghey yn injil-vree follym jeh'n funshoon.
        [extremum] Lhiggey shaghey yn eer-vree follym jeh'n funshoon.
        [point] Lhiggey shaghey yn poynt follym jeh'n funshoon.
       *[other] Lhiggey shaghey yn { $type } follym jeh'n funshoon.
    }
function-points-too-close = Ta daa phoynt ayns y funshoon ro ghaire da y cheilley. Cha nod oo cowrey yn funshoon.
function-iterates-input-output-mismatch =
    Cha nod iteratyn funshoon ve ayn agh my ta earroo ny inputs cordail rish earroo ny outputs. Ta { $inputs ->
        [one] { $inputs } choyrt-stiagh
        [two] { $inputs } choyrt-stiagh
       *[other] { $inputs } coyrt-stiagh
    } as { $outputs ->
        [one] { $outputs } choyrt-magh
        [two] { $outputs } choyrt-magh
       *[other] { $outputs } coyrt-magh
    } ec y funshoon shoh.

## `<sequence>`

sequence-invalid-length = Lhiurid neu-chair jeh'n çhiaghtoo. Shegin da ve ny slane earroo nagh vel fo-neu.
sequence-invalid-step = Kesmad neu-chair jeh'n çhiaghtoo. Shegin da ve ny earroo son çhiaghtoo jeh'n sorch { $type }.
sequence-invalid-endpoint-number = "{ $attribute }" neu-chair jeh çhiaghtoo earrooyn. Shegin da ve ny earroo.
sequence-invalid-endpoint-letters = "{ $attribute }" neu-chair jeh çhiaghtoo lettyryn. Shegin da ve ny cochiangley lettyryn.
sequence-invalid-endpoint = "{ $attribute }" neu-chair jeh'n çhiaghtoo.
select-from-sequence-coprime-not-numbers = ta coprime lhiggit shaghey er-yn-oyr nagh vel earrooyn ry-reih
select-from-sequence-coprime-with-exclude-combinations = ta coprime lhiggit shaghey er-yn-oyr dy vel excludeCombinations enmyssit

## Resolving a `target`

target-not-found = Targad neu-chair son `<{ $source }>`: cha nod oo feddyn y targad.
target-state-variable-not-found = Targad neu-chair son `<{ $source }>`: cha nod oo feddyn caghlaader stayd enmyssit "{ $property }" er `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Shegin da caghlaaderyn `<odeSystem>` ve anchasley rish y chaghlaader seyr.
ode-system-duplicate-variable-names = Cha nod oo cowrey funshoonyn RHS ODE lesh enmyn caghlaader aa-ghrait.
ode-system-rhs-function-error = Cha nod oo cowrey funshoon RHS ODE. Marranys jannoo yn funshoon mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Cha nod oo cowrey uillin eddyr { $count } linney
angle-invalid-through-point = Poynt neu-chair ayns through jeh `<angle>`
parabola-vertex-too-many-points = Cha nel parabola lesh vertex trooid ny smoo na 1 poynt jeant.
parabola-too-many-points = Cha nel parabola trooid ny smoo na 3 poynt jeant.
intersection-too-many-items = Cha nel crossag son ny smoo na daa nhee jeant

## Other math components

ionic-compound-not-two-ions = Cha nel co-vestey ionagh jeant son red erbee agh daa ion.
ionic-compound-needs-cation-and-anion = Cha nel co-vestey ionagh jeant agh son un cation as un anion.
solve-equations-cannot-evaluate = Cha nod oo feaysley yn cho-heeshtaght er-yn-oyr nagh row eh abyl dy ve towsit: { $equation }
math-operators-operand-number-required = Shegin da operandNumber ve enmyssit tra ta operand maddaghtagh er ny hayrn magh.
eigen-decomposition-failed = Cha row eigenbreeyn y vatrix abyl dy ve towsit

## `<matchesPattern>`

# No numeral is printed, so this is written once: see the note on counts above.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: cha nel { $parameters } cheet ayns y phatran, myr shen nee eh cordail rish follym dy kinjagh.

## `<graph>`

graph-grid-invalid = `<graph>`: cha nod oo toiggal grid="{ $grid }". Shegin da ve none, medium, dense, ny daa earroo bishagh scarrit lesh spoar, myr grid="1 0.5". Cha nel grid erbee tayrnit.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    Ta feme ec `<{ $component }>` er funshoon lesh { $expected ->
        [one] un choyrt-magh, yn liargagh y' ec dagh poynt, myr `y - x`
       *[other] daa choyrt-magh, yn vectoyr ec dagh poynt, myr `(y, -x)`
    }, agh ta { $found ->
        [one] { $found } choyrt-magh
        [two] { $found } choyrt-magh
       *[other] { $found } coyrt-magh
    } ec y funshoon v'eh er gheddyn. { $alternative ->
        [none] Cha nel veg tayrnit.
       *[other] She `<{ $alternative }>` yn component son y funshoon shen. Cha nel veg tayrnit.
    }
field-function-attribute-ignored-with-child = Ta'n attribute `function` lhiggit shaghey er-yn-oyr dy vel y funshoon currit cheu-sthie jeh'n component myrgeddin; ta'n fer cheu-sthie ymmydit. Cur y funshoon er un aght ny elley, cha nee er y daa aght.
field-variables-ignored =
    `<{ $component }>`: ta'n attribute `variables` enmys caghlaaderyn loayrtys screeuit dy jeeragh cheu-sthie jeh'n component. { $reason ->
        [function-child] Ta'n funshoon ayns shoh currit myr lhiannoo `<function>`, as t'eh enmys ny caghlaaderyn echey hene, myr shen ta `variables` lhiggit shaghey.
       *[no-expression] Cha nel loayrtys jeh'n sorch shen currit ayns shoh, myr shen ta `variables` lhiggit shaghey.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: cha nel xLabelPosition="left" cundaigit ayns y renderer prefigure; ymmydey aght y chiart-cheu.
prefigure-y-label-position-unsupported = `<graph>`: cha nel yLabelPosition="bottom" cundaigit ayns y renderer prefigure; ymmydey aght y vullee.
prefigure-invalid-axis-bounds = `<graph>`: oirryn essyl neu-chair son y chaghlaa prefigure; ymmydey yn bbox cadjin (-10,-10,10,10).
prefigure-invalid-width = `<graph>`: lheead neu-chair son y chaghlaa prefigure; ymmydey lheead diagram cadjin 425.
prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio neu-chair son y chaghlaa prefigure; ymmydey yn rheynn cadjin 1.
prefigure-grid-spacing-too-fine = `<graph>`: ta spoar y ghrid ro veen son oirryn yn essyl; ta'n grid faagit magh ayns y renderer prefigure.
prefigure-annotations-not-rendered = `<graph>`: cha bee notyn tayrnit mannagh vel y renderer PreFigure ymmydit.
multiple-annotations-children = Va ymmodee cloan `<annotations>` feddynit ayns `<graph>`; ta ooilley agh yn fer s'jerree lhiggit shaghey.

## Referring to other components

copy-unrecognized-component-type = Cha nod oo sheeyney ny coip sorch component neu-enmyssit: { $type }.
copy-prop-not-found = Cha row yn prop { $property } feddynit er component jeh'n sorch { $component }
collect-no-source = Cha row bun erbee feddynit son collect.
collect-invalid-component-type = Cha nod oo chaglym component jeh'n sorch `<{ $component }>` er-yn-oyr dy vel eh ny horch component neu-chair.
reference-index-unavailable = Cha nod oo cowraghey yn index `{ $reference }`

## `<callAction>`

component-action-unavailable = Cha nod oo geamagh { $action } er y component `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Ta cummey neu-chair ec y data. Cha nel lhiurid ny rea cordail. Feddynit ayns componentIdx :{ $componentIdx }
data-frame-duplicate-column-names = Ta enmyn colloo aa-ghrait ayns y data. Feddynit ayns componentIdx :{ $componentIdx }
data-frame-missing-column-name = Ta ennym colloo caillit ayns y data. Feddynit ayns componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ta award son yn ansoor shoh bunnit er yn ansoor currit stiagh ec y tag answer hene, as ver shen lhiat ymmyrkey neu-yerkit.
answer-max-num-attempts-in-section-wide-check-work = Cha nel bree erbee ec cur `maxNumAttempts` er `<answer>` cheu-sthie jeh cummalagh lesh `sectionWideCheckWork`, er-yn-oyr dy vel earroo ny prowallyn fo reill y chummalagh. Cur `maxNumAttempts` er y chummalagh ayns ynnyd shen.
nested-section-wide-check-work-max-num-attempts = Cha nel bree erbee ec cur `maxNumAttempts` er cummalagh lesh `sectionWideCheckWork` ta cheu-sthie jeh cummalagh elley lesh `sectionWideCheckWork`, er-yn-oyr dy vel earroo ny prowallyn fo reill y chummalagh mooie. Cur `maxNumAttempts` er y chummalagh mooie ayns ynnyd shen.
# No numeral is printed, so this is written once.
answer-attributes-need-symbolic-equality = Cha bee bree erbee ec { $attributes } gyn symbolicEquality currit.
answer-invalid-type = Sorch neu-chair son yn ansoor: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Er-yn-oyr nagh vel ennym ec y component `<{ $component }>`, cha nod eh ve ymmydit son attribute module
module-attribute-name-already-defined = Cha nod y component `<{ $component } name="{ $name }">` ve ymmydit myr attribute son module er-yn-oyr dy vel attribute "{ $name }" cowrit hannah ec y sorch component `<module>`.
conditional-content-condition-ignored = Ta'n attribute `condition` lhiggit shaghey er component `<conditionalContent>` lesh cloan case ny else.
slider-markers-type-mismatch = Cha nel sorch ny markyn cordail rish sorch y slider.
pretzel-problem-needs-statement-and-answer = Pretzel neu-chair: shegin da dagh `<problem>` cummal un `<statement>` as un `<answer>`.
pretzel-circuit-first-problem-distractor = Pretzel neu-chair: ayns mode="circuit", cha nod y chied `<problem>` ve ny distractor.

## Attribute values

# No numeral is printed, so this is written once.
attribute-invalid-values = Bree neu-chair { $values } son yn attribute `{ $attribute }`; lhiggey shaghey.
attribute-must-be-references = Bree neu-chair `{ $value }` son yn attribute `{ $attribute }`. Shegin da'n attribute ve jeant jeh reference ta goaill toshiaght lesh `$`.
math-input-invalid-function-names = <mathInput>: va enmyn funshoon neu-chair lhiggit shaghey ayns { $attribute }: { $names }. Shegin da ayrn soilshee dagh ennym ve 2 lettyr er y chooid sloo (lettyryn ny linnaghyn-tayrn); foddee suffix `|<mathspeak alternative>` cheet ny yei.

## Building components from the source

component-type-invalid = Sorch component neu-chair: `<{ $componentType }>`
attribute-repeated = Cha nod oo aa-ghra yn attribute { $attribute }.
attribute-invalid-for-component = Attribute neu-chair "{ $attribute }" son component jeh'n sorch `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Cha nel dy liooar contrast ec y chowrey aght { $styleNumber } son { $context ->
        [text-on-background] daah y teks noi daah y chooylrey
        [high-contrast] yn daah ard-chontrast noi yn eaddagh
        [line] daah y linney noi yn eaddagh
        [marker] daah y vark noi yn eaddagh
       *[text-on-canvas] daah y teks noi yn eaddagh
    }{ $mode ->
        [dark] { " (mod dorraghey)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; shegin da ve { $threshold }:1 er y chooid sloo).
style-definition-dark-mode-text-background-contrast =
    Ga dy vel daahghyn enmyssit ec y chowrey aght { $styleNumber } ta cur dy liooar contrast son y vod hollys, cha nel dy liooar contrast ec ny daahghyn mod dorraghey tayrnit voue son daah y teks noi daah y chooylrey ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; shegin da ve { $threshold }:1 er y chooid sloo). { $suggestion ->
        [available] Dy yannoo shickyr jeh dy liooar contrast ayns y vod dorraghey, edyr bishee contrast y vod hollys (myr sampleyr, cur { $lightAttribute }="{ $lightColor }") ny cur daah elley son y vod dorraghey (myr sampleyr, cur { $darkAttribute }="{ $darkColor }").
       *[none] Dy yannoo shickyr jeh dy liooar contrast ayns y vod dorraghey, bishee contrast y vod hollys ny cur daahghyn elley ayns ynnyd ny daahghyn tayrnit lesh textColorDarkMode as/ny backgroundColorDarkMode.
    }
style-definition-dark-mode-text-canvas-contrast =
    Ga dy vel daah teks enmyssit ec y chowrey aght { $styleNumber } ta cur dy liooar contrast son y vod hollys, cha nel dy liooar contrast ec y daah teks mod dorraghey tayrnit veih noi yn eaddagh ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; shegin da ve { $threshold }:1 er y chooid sloo). { $suggestion ->
        [available] Dy yannoo shickyr jeh dy liooar contrast ayns y vod dorraghey, edyr bishee contrast y vod hollys (myr sampleyr, cur textColor="{ $lightColor }") ny cur daah elley son y vod dorraghey (myr sampleyr, cur textColorDarkMode="{ $darkColor }").
       *[none] Dy yannoo shickyr jeh dy liooar contrast ayns y vod dorraghey, bishee contrast y vod hollys ny cur daah elley ayns ynnyd y daah tayrnit lesh textColorDarkMode.
    }
section-multiple-style-palettes = Cha nod rheynn reih agh un <stylePalette>; ymmydey yn fer s'jerree.

## Unique variants

variant-num-to-select-not-non-negative-integer = cha nod oo cronney caghlaaghyn er-lheh jeh { $component } er-yn-oyr nagh vel numToSelect ny slane earroo nagh vel fo-neu.
variant-num-to-select-not-constant-number = cha nod oo cronney caghlaaghyn er-lheh jeh { $component } er-yn-oyr nagh vel numToSelect ny earroo shassoo.
variant-with-replacement-not-constant-boolean = cha nod oo cronney caghlaaghyn er-lheh jeh { $component } er-yn-oyr nagh vel withReplacement ny boolean shassoo.
variant-select-weight-disables-unique = Ta caghlaaghyn er-lheh son select currit ass my ta reih ayn lesh selectWeight ny selectForVariants enmyssit
variant-coprime-undetermined = cha nod oo cronney caghlaaghyn er-lheh jeh { $component } er-yn-oyr nagh nod oo cronney dy vel coprime foalsey dy kinjagh.
variant-attribute-not-constant = cha nod oo cronney caghlaaghyn er-lheh jeh { $component } er-yn-oyr nagh vel { $attribute } shassoo.
variant-attribute-not-number = cha nod oo cronney caghlaaghyn er-lheh jeh { $component } er-yn-oyr nagh vel { $attribute } ny earroo.
variant-attribute-wrong-type-for-sequence =
    cha nod oo cronney caghlaaghyn er-lheh jeh { $component } jeh'n sorch { $type } er-yn-oyr nagh vel { $attribute } ny { $expected ->
        [letters-combination] chochiangley lettyryn
        [math-expression] loayrtys maddaghtagh cair
        [integer] slane earroo
       *[number] earroo
    }.
variant-length-not-integer = cha nod oo cronney caghlaaghyn er-lheh jeh { $component } er-yn-oyr nagh vel length ny slane earroo.
variant-sort-not-implemented = cha nel caghlaaghyn er-lheh jeh { $component } lesh sort jeant
variant-exclude-combinations-not-implemented = cha nel caghlaaghyn er-lheh jeh { $component } lesh excludeCombinations jeant
variant-math-exclude-not-implemented = cha nel caghlaaghyn er-lheh jeh { $component } jeh'n sorch math lesh exclude jeant
variant-non-constant-exclude-not-implemented = cha nel caghlaaghyn er-lheh jeh { $component } lesh exclude nagh vel shassoo jeant

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: cha nel eh cundaigit ayns y renderer prefigure graf; faagit magh.
prefigure-descendant-invalid-geometry = { $subject }: towse neu-chrieit ny neu-slane; faagit magh.
prefigure-curve-label-omitted = { $subject }: cha nel lipaghyn cundaigit er elementyn croymmey caghlaait; faagit magh.
prefigure-curve-unsupported-definition-type = { $subject }: sorch cowrey croymmey neu-chundaigit '{ $definitionType }'; faagit magh.
prefigure-region-flip-functions-unsupported = { $subject }: attribute flipFunctions neu-chundaigit er regionBetweenCurves; faagit magh.
prefigure-region-non-formula-child = { $subject }: cha nel agh cloan funshoon jeh'n sorch formula cundaigit er regionBetweenCurves; faagit magh.
prefigure-label-position-unsupported =
    { $subject }: labelPosition neu-chundaigit '{ $labelPosition }' son { $labelKind ->
        [line-family] lipey jeh'n lught linney
       *[point] lipey poynt
    }; ta'n cochiart cadjin PreFigure ymmydit.
prefigure-fill-style-unsupported = { $subject }: cha nel yn aght lhieeney '{ $fillStyle }' cundaigit ec PreFigure; goll er-ash gys lhieeney slane.
prefigure-line-style-unknown = { $subject }: aght linney neu-enmyssit '{ $lineStyle }' faagit magh ass yn assbroie PreFigure.
prefigure-marker-style-mapped-to-diamond = { $subject }: aght mark '{ $markerStyle }' caghlaait gys yn aght PreFigure 'diamond'.
prefigure-marker-style-unsupported = { $subject }: cha nel yn aght mark '{ $markerStyle }' cundaigit ec PreFigure; ta'n aght cadjin ymmydit.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` neu-chair; cha nod oo reaghey yn targad. Faagit magh.
annotation-ref-multiple-targets = `<annotation>`: va `ref` reaghit gys ymmodee targadyn; ymmydey yn chied targad.
annotation-ref-outside-graph = `<annotation>`: `ref` neu-chair; ta'n targad mooie jeh'n graf ta cummal eh. Faagit magh.
annotation-ref-unsupported-target = `<annotation>`: `ref` neu-chair; cha nel yn targad ny nhee graafagh cundaigit ayns y chaghlaa prefigure. Faagit magh.
annotation-text-missing = `<annotation>`: `text` caillit ny follym; cur magh teks follym.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Co-heiyrtys kiarkylagh feddynit.
       *[other] Co-heiyrtys kiarkylagh feddynit lesh y component `<{ $componentType }>` ayn.
    }
reference-no-referent = Cha row nhee erbee feddynit son y reference: `{ $reference }`
reference-multiple-referents = Va ymmodee nheeghyn feddynit son y reference: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format neu-chair son yn attribute { $attribute } jeh `<{ $componentType }>`.
children-invalid = Cloan neu-chair son `<{ $componentType }>`: cloan neu-chair feddynit: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Bree neu-chair `{ $value }` son yn attribute `{ $attribute }`, ymmydey yn vree `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Cha row yn lhieggan DoenetML { $version } feddynit.
       *[other] Cha row yn lhieggan DoenetML { $version } feddynit. Goll er-ash gys lhieggan { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML neu-chair: { $content }
parse-tag-missing-close-tag = DoenetML neu-chair: Cha nel tag dooney ec y tag `{ $tag }`. Va tag ta dooney eh hene ny tag `</{ $tagName }>` jerkit rish.
parse-tag-error = DoenetML neu-chair: Marranys ayns y tag `<{ $tagName }>`
parse-attribute-missing-value = DoenetML neu-chair: Ta'n attribute neu-chair `{ $attribute }` caill bree, myr te jeeaghyn.
parse-attribute-invalid = DoenetML neu-chair: Attribute neu-chair `{ $attribute }`
parse-attribute-value-invalid = DoenetML neu-chair: Bree attribute neu-chair `{ $value }`
parse-attribute-value-quote-mismatch = DoenetML neu-chair: Bree attribute neu-chair `{ $value }`. Cha nel ny cowraghyn-raa cordail. Te jeeaghyn dy vel `{ $quote }` caillit ayd
parse-open-tag-name-missing = DoenetML neu-chair: Va tag feddynit gyn ennym tag, myr `<`
parse-tag-not-closed = DoenetML neu-chair: Cha row yn tag `{ $tag }` dooint (te jeeaghyn dy vel `>` caillit).
parse-self-closing-tag-name-missing = DoenetML neu-chair: Va tag feddynit gyn ennym tag `<{ $content }>`
parse-self-closing-tag-not-closed = DoenetML neu-chair: Cha row yn tag `{ $tag }` dooint (te jeeaghyn dy vel `/>` caillit).
parse-tag-invalid-attributes = DoenetML neu-chair: Cha nel yn tag `{ $tag }` cair. Foddee dy vel attributes aggairagh echey.
parse-close-tag-name-missing = DoenetML neu-chair: Va tag dooney feddynit gyn ennym tag, myr `</`
parse-attribute-value-unquoted = Shegin da breeyn attribute ve cummit ayns cowraghyn-raa: `{ $attribute }="{ $value }"`
parse-close-tag-without-open-tag = DoenetML neu-chair: Va'n tag dooney `{ $tag }` feddynit, agh cha nel tag fosley cordail rish
parse-close-tag-mismatched = DoenetML neu-chair: Tag dooney nagh vel cordail. Va `</{ $expected }>` jerkit rish. Va `{ $found }` feddynit
parser-node-unconvertible = Cha row yn node { $node } abyl dy ve caghlaait gys node Dast.

## Names

name-attribute-invalid =
    Attribute neu-chair name='{ $name }'. { $reason ->
        [characters] Cha nod enmyn cummal agh lettyryn, earrooyn, fo-linnaghyn ny linnaghyn-tayrn.
       *[start] Shegin da enmyn goaill toshiaght lesh lettyr.
    }
component-name-invalid-start = Ennym component neu-chair "{ $name }". Shegin da enmyn goaill toshiaght lesh lettyr.

## `<answer>` sugar

answer-video-watched-missing-video = Shegin da ansoor jeh'n sorch videoWatched ve cur attribute video
answer-video-watched-video-not-reference = Shegin da ansoor jeh'n sorch videoWatched ve cur attribute video ta ny reference
answer-name-not-single-text = Shegin da attribute ennym yn ansoor ve cur un lhiannoo teks

## Referencing another document

external-doenetml-recursion-limit = Cha nod oo geddyn DoenetML mooie er-yn-oyr dy vel ro ymmodee keimyn aa-chassey ayn. Vel reference kiarkylagh ayn?
external-doenetml-unavailable = Cha nod oo geddyn DoenetML veih { $attribute }="{ $uri }"
external-doenetml-type-mismatch = Va DoenetML neu-chair feddynit veih { $attribute }="{ $uri }": cha row eh cordail rish y sorch component "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ta'n attribute `{ $from }` shenn; ymmyd `{ $to }` ayns ynnyd shen.
       *[other] [deprecation] Ta'n attribute `{ $from }` er `<{ $component }>` shenn; ymmyd `{ $to }` ayns ynnyd shen.
    }
deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ta'n attribute `{ $from }` shenn as lhiggit shaghey er-yn-oyr dy vel `{ $to }` enmyssit myrgeddin.
       *[other] [deprecation] Ta'n attribute `{ $from }` er `<{ $component }>` shenn as lhiggit shaghey er-yn-oyr dy vel `{ $to }` enmyssit myrgeddin.
    }
deprecated-attribute-ignored = [deprecation] Ta'n attribute `{ $attribute }` er `<{ $component }>` shenn as lhiggit shaghey.
deprecated-attribute-to-child = [deprecation] Ta'n attribute `{ $attribute }` er `<{ $component }>` shenn; ymmyd lhiannoo `<{ $child }>` ayns ynnyd shen.
deprecated-attribute-value-renamed = [deprecation] Ta'n vree `{ $value }` jeh'n attribute `{ $attribute }` er `<{ $component }>` shenn; ymmyd `{ $to }` ayns ynnyd shen.


## Language coverage

pluralize-english-only = Cha nod `<pluralize>` jannoo ymmodee-earroo agh ayns Baarle, myr shen ta'n teks echey faagit myr t'eh ayns docamad screeuit ayns { $locale }. Screeu yn cummey ymmodee-earroo dy jeeragh, ny cur eh lesh yn attribute `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Cha nel yn element `<{ $tag }>` ny element Doenet enmyssit.
schema-element-not-allowed-at-root = Cha nel yn element `<{ $tag }>` lowit ec fraue y docamad.
schema-element-not-allowed-inside = Cha nel yn element `<{ $tag }>` lowit cheu-sthie jeh `<{ $parent }>`.
schema-attribute-unrecognized = Cha nel attribute enmyssit `{ $attribute }` ec yn element `<{ $tag }>`.
schema-attribute-value-not-allowed =
    { $isList ->
        [true] Shegin da'n attribute `{ $attribute }` jeh'n element `<{ $tag }>` ve ny rolley as dagh nhee ayn unnane jeu shoh: { $allowed }
       *[other] Shegin da'n attribute `{ $attribute }` jeh'n element `<{ $tag }>` ve unnane jeu shoh: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ennym caghlaa neu-chair son select. Ta'n ennym caghlaa { $variantName } cheet ayns { $numOptions } reih agh she { $numToSelect } yn earroo dy reih.
select-variant-name-without-options = Ta caghlaaghyn enmyssit son select agh cha nel reihyssyn enmyssit son yn ennym caghlaa possible: { $variantName }.
select-variant-name-not-possible = Cha nel yn ennym caghlaa { $variantName } enmyssit son select ny ennym caghlaa possible.
select-too-few-options = Cha nod oo reih { $numToSelect } component ass { $numOptions } ny lomarcan.
select-from-sequence-too-few-values = Cha nod oo reih { $numToSelect } bree ass çhiaghtoo jeh'n lhiurid { $length }.
select-from-sequence-indices-count-mismatch = Shegin da earroo ny indices enmyssit son select cordail rish yn earroo dy reih
select-from-sequence-indices-not-integers = Shegin da dagh index enmyssit son select ve ny slane earroo
select-from-sequence-index-excluded = Va index enmyssit jeh selectfromsequence er ny yaagail magh
select-from-sequence-indices-excluded-combination = Va ny indices enmyssit jeh selectfromsequence ny chochiangley faagit magh
select-from-sequence-coprime-not-positive-integers = Cha nod oo reih cochianglaghyn coprime er-yn-oyr nagh vel slane earrooyn bishagh ry-reih.
select-from-sequence-coprime-common-factor = Cha nod oo reih earrooyn coprime. Ta factor cadjin ec dagh bree possible. (Shegin da ny breeyn enmyssit jeh "from" ny "to" ve coprime rish "step".)
select-from-sequence-coprime-single-number = Cha nod oo reih cochianglaghyn coprime ass un earroo nagh vel 1.
select-from-sequence-excluded-too-many-combinations = Va ny smoo na 70% jeh ny cochianglaghyn faagit magh ayns selectFromSequence
select-from-sequence-coprime-none-found = Cha row earrooyn coprime abyl dy ve reihit. Ta factor cadjin ec dagh bree possible.
select-from-sequence-too-few-unique-values = Cha nod oo reih { $numToSelect } bree er-lheh ass çhiaghtoo jeh'n lhiurid { $numPossibleValues }
select-prime-numbers-too-few-values = Cha nod oo reih { $numToSelect } bree ass rolley earrooyn bun jeh'n lhiurid { $numValues }
select-prime-numbers-values-count-mismatch = Shegin da earroo ny breeyn enmyssit son select cordail rish yn earroo dy reih
select-prime-numbers-values-not-prime = Shegin da dagh bree enmyssit son reih earroo bun ve ayns y rolley earrooyn bun
select-prime-numbers-values-excluded-combination = Va ny breeyn enmyssit jeh selectPrimeNumbers ny chochiangley faagit magh
select-prime-numbers-excluded-too-many-combinations = Va ny smoo na 70% jeh ny cochianglaghyn faagit magh ayns selectPrimeNumbers
select-random-combination-fluke = Liorish taghyrt feer neu-yerkit, cha row cochiangley dy vreeyn gyn oardagh abyl dy ve reihit
select-random-value-fluke = Liorish taghyrt feer neu-yerkit, cha row bree gyn oardagh abyl dy ve reihit

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Cha nel yn `<{ $component }>` shoh soilshit er-yn-oyr dy vel eh cheu-sthie jeh maddaght as nagh vel eh `inline`. Cur `inline` rish dy jean eh ny rolley lhieggit, ta goll cheu-sthie jeh loayrtys.
        [expanded] Cha nel yn `<{ $component }>` shoh soilshit er-yn-oyr dy vel eh cheu-sthie jeh maddaght as dy vel eh `expanded`. Scugh `expanded`; cha nel kishtey ymmodee-linney goll cheu-sthie jeh loayrtys.
        [on-graph] Cha nel yn `<{ $component }>` shoh soilshit er-yn-oyr dy vel eh cheu-sthie jeh maddaght tayrnit er graf, as cha nel reamys ayn son input.
       *[relative-width] Cha nel yn `<{ $component }>` shoh soilshit er-yn-oyr dy vel eh cheu-sthie jeh maddaght as dy vel lheead relative echey. Cur y lheead ayns unnidyn bunneydagh, myr `px`, ayns ynnyd shen.
    }
