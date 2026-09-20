# Gilbertese / Kiribati (te taetae ni Kiribati) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Standard Kiribati: the thirteen letters `a b e i k m n ng o
# r t u w`, the velarized labials written out as **«bw» and «mw»** («bwai»,
# «mwakoro», «mwakuri») rather than in the older mission spelling («bai»,
# «makoro», «makuri»), and **no macrons** — vowel length is written by doubling
# the vowel. `chrome.ftl`'s header states both decisions in full; a reviewer
# who prefers the mission orthography should convert all four files together
# rather than mix the two systems.
#
# **Counting, and the classifier.** Kiribati counts with numeral classifiers,
# and every count in this file — intervals, inputs, outputs, points, lines,
# attributes, options, values — is an abstract or inanimate thing, so all of
# them take **«-ua», the general classifier** («teuana», «uoua», «tenua»).
# None of them is animate («-man»), wooden («-kai») or a vehicle («-waa»), so
# no other classifier could apply. The classifier is not written, and cannot
# be: it is a suffix on the numeral word — «uoua», never «2-ua» — and every
# count here arrives as a placeable this catalog never sees. That is the
# README's "an affix cannot be welded to a placeable", and it is a recorded
# debt rather than a decision: a speaker reading these counts aloud supplies
# the classifier the digit cannot carry.
#
# **Number.** A noun is not marked for number after a numeral, so where
# English's `one` and `other` branches differ only in the noun's plural, this
# file writes the same words in both. The branches are kept rather than
# collapsed so that no branch goes missing; `Intl.PluralRules` has no CLDR data
# for `gil` and would resolve against the runtime's default locale, so no
# `[two]`, `[few]` or `[many]` branch is written anywhere.
#
# **Word order.** The noun comes first and its modifier follows through the
# singular linker **«ae»** — «te value ae aki eti», *an invalid value*. The
# recurring frames of this file are «E aki kona n …» (cannot …), «e riai n …»
# (must …), «E tuai ni karaoaki …» (has not been implemented), «e aki
# kabonganaaki» (is ignored) and «akea manenana» (has no effect).
#
# **Loans.** Technical vocabulary this seed could not establish is kept as the
# English word in English spelling and is not respelled: `line`, `point`,
# `vector`, `circle`, `function`, `domain`, `interval`, `input`, `output`,
# `sequence`, `matrix`, `component`, `attribute`, `value`, `type`, `variable`,
# `index`, `pattern`, `label`, `grid`, `renderer`, `accessibility`,
# `contrast`, `style`, `variant`, `reference`, `column`, `row`, `data` and the
# PreFigure vocabulary. Everything else is Kiribati.

## `<lineSegment>`

# $attributes is a list of attribute names; $attributesCount is its length.
line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] e aki kabonganaaki { $attributes } ngkana a taekinaki uoua te endpoint
       *[other] e aki kabonganaaki { $attributes } ngkana a taekinaki uoua te endpoint
    }

# $attributes is a list of attribute names; $attributesCount is its length.
line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] e aki kabonganaaki { $attributes } ngkana a taekinaki te endpoint ao te midpoint ni kauoua
       *[other] e aki kabonganaaki { $attributes } ngkana a taekinaki te endpoint ao te midpoint ni kauoua
    }

line-segment-midpoint-offset-without-midpoint = akea manenan midpointOffset ngkana akea te midpoint

## `<line>`

line-points-undetermined-dimensions = Te line ae rinanon taian point aika aki ataaki mwaitin dimension-ia.

line-points-too-few-dimensions = E riai te line bwa e na rinanon taian point aika uoua tabo n dimension ke a bati riki.

# $variables is a bare enumeration of variable names, not an "and" list.
line-points-depend-on-variables = Te line e rinanon taian point aika a bo ma taian variable aikai: { $variables }.

line-equation-invalid-format = E aki eti katein te equation ibukin te line n taian variable ae { $variable1 } ao { $variable2 }.

## `<ray>`

ray-overprescribed-through = E kamatataaki te ray n through, endpoint, ao direction.  E aki kabonganaaki te through ae taekinaki.

ray-dimension-mismatch = E aki boraoi numDimensions n te ray.

## `<vector>`

vector-overprescribed-head = E kamatataaki te vector n head, tail, ao displacement.  E aki kabonganaaki te head ae taekinaki.

vector-dimension-mismatch = E aki boraoi numDimensions n te vector.

## Attracting and constraining

# $component is the DoenetML tag of the child that was named, e.g. "polygon".
attract-to-without-nearest-point = E aki kona n attract nakon te `<{ $component }>` ibukina bwa akea iai te state variable ae nearestPoint.

constrain-to-without-nearest-point = E aki kona n constrain nakon te `<{ $component }>` ibukina bwa akea iai te state variable ae nearestPoint.

constrain-to-interior-without-nearest-point = E aki kona n constrain nakon nanon te `<{ $component }>` ibukina bwa akea iai te state variable ae nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = e aki kabonganaaki labelPosition ibukin te choiceInput ae tiaki inline

## Ordering children by index

choice-input-indices-count-mismatch = E aki kabonganaaki taian indices aika taekinaki ibukin te choiceInput ibukina bwa e aki boraoi mwaitiia ma mwaitin taian choice ae natina.

pretzel-indices-count-mismatch = E aki kabonganaaki taian indices aika taekinaki ibukin te problem ibukina bwa e aki boraoi mwaitiia ma mwaitin taian problem aika natina.

shuffle-indices-count-mismatch = E aki kabonganaaki taian indices aika taekinaki ibukin te shuffle ibukina bwa e aki boraoi mwaitiia ma mwaitin taian component.

# $component is `choiceInput`, `pretzel` or `shuffle` — a DoenetML component
# name, so it stays in English.
indices-ignored-out-of-range = E aki kabonganaaki taian indices aika taekinaki ibukin { $component } ibukina bwa iai tabeua aika a otinako mai buakon te mwaiti ae kariaiakaki.

pretzel-indices-repeated = E aki kabonganaaki taian indices aika taekinaki ibukin te pretzel ibukina bwa iai tabeua aika a manga okioki.

pretzel-circuit-first-index = E aki kabonganaaki taian indices aika taekinaki ibukin te pretzel n te circuit mode ibukina bwa e riai te moan index bwa 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ibukin mwakurin te `<{ $component }>` ma natina aika string, e riai n taekinaki te attribute ae `type`.

# $type is what the author wrote; math, text, number and boolean are attribute
# values and stay in English.
invalid-type-defaulting-to-math = E aki eti te type ae { $type } ibukin te component ae { $component }. E riai bwa teuana mai buakon math, text, number, ke boolean. E kabonganaaki math.

# $value is the string child that could not be used.
string-not-valid-component-to-arrange = Te string ae "{ $value }" tiaki te component ae eti ibukin { $component }. E aki kabonganaaki.

## Types and variables

invalid-type-defaulting-to-number = E aki eti te type ae { $type }, e a katauaki te type bwa number.

invalid-variable-value = E aki eti te value ibukin te variable: `{ $value }`

## Variants

variant-index-must-be-number = E riai te variant index ae { $index } bwa te number

variant-index-must-be-integer = E riai te variant index ae { $index } bwa te integer

## `<sideBySide>`

side-by-side-absolute-widths = E tuai ni karaoaki te `<{ $component }>` ibukin taian mwaiti ae absolute. A katauaki taian width bwa relative.

side-by-side-absolute-margins = E tuai ni karaoaki te `<{ $component }>` ibukin taian mwaiti ae absolute. A katauaki taian margin bwa relative.

side-by-side-no-block-child = E aki eti te `<{ $component }>`: e riai n iai teuana natina ae te block.

## `<label>`

label-for-ignored-on-graphical = E aki kabonganaaki te attribute ae `for` iaon te `<label>` ae graphical.

label-for-must-resolve-to-one = E riai te attribute ae `for` iaon te `<label>` bwa e na kaineti nakon ti teuana te component.

label-for-unresolved = E aki kona ni kuneaki te component ae kaineti ma te attribute ae `for` iaon te `<label>`.

label-for-answer-with-authored-inputs = Te attribute ae `for` iaon te `<label>` e kaineti nakon te `<answer>` ae iai iai taian input aika koreaki iroun te tia korea; kaineti nakon te input.

label-for-answer-without-input = Te attribute ae `for` iaon te `<label>` e kaineti nakon te `<answer>` ae akea te input ae na labelaki.

label-for-must-reference-input-or-answer = E riai te attribute ae `for` iaon te `<label>` bwa e na kaineti nakon te input ke te answer.

## Accessibility

# $component is a DoenetML tag, e.g. "graph" or "image".
accessibility-short-description-or-decorative = Ibukin te accessibility, e riai te `<{ $component }>` bwa e na iai te kabwarabwara ae kimototo ke e na taekinaki bwa decorative.

accessibility-video-short-description = Ibukin te accessibility, e riai te `<video>` bwa e na iai te kabwarabwara ae kimototo.

accessibility-input-short-description-or-label = Ibukin te accessibility, e riai te `<{ $component }>` bwa e na iai te kabwarabwara ae kimototo ke te label.

accessibility-answer-input-short-description-or-label = Ibukin te accessibility, te `<answer>` ae karika te input e riai n iai te kabwarabwara ae kimototo ke te label.

accessibility-short-description-contains-math = A aki riai taian kabwarabwara aika kimototo n iai taian component ni math n aron te `<{ $component }>`. Korei taian math n taeka.

# $colorName is an attribute name and stays in English. $ratio and $threshold
# are contrast ratios; $mode says which theme the shortfall was measured in,
# and is `dark` or `light`.
accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Akea tokin te contrast iroun { $colorName } ibukin koroboki n atu ni mwakoro (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e riai n { $threshold }:1 ke e rietata riki).
       *[other] Akea tokin te contrast iroun { $colorName } ibukin koroboki n atu ni mwakoro ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e riai n { $threshold }:1 ke e rietata riki).
    }

## `<circle>`

# $count is the number of through points.
circle-through-points-non-numerical = E tuai ni karaoaki te `<circle>` ae rinanon { $count } te point ngkana akea numerical value irouia taian point.

circle-too-many-through-points = E aki kona ni karaoaki te circle ae rinanon taian point aika raka iaon 3.

circle-overprescribed-radius-center-points = E aki kona ni karaoaki te circle ma te radius, te center ao taian through point aika taekinaki ni kabane.

circle-center-with-multiple-points = E aki kona ni karaoaki te circle ma te center ae taekinaki ae rinanon taian point aika raka iaon 1.

circle-radius-too-small = E aki kona ni karaoaki te circle: ngkai raroan uoua te point bon { $distance }, e uarereke te radius ae taekinaki ae { $radius }.

circle-radius-with-many-points = E aki kona ni karikaki te circle ae rinanon taian point aika raka iaon uoua ma te radius ae taekinaki.

circle-invalid-center-or-through-points = E aki eti te center ke taian through point ibukin te circle.

circle-radius-center-with-multiple-points = E aki kona ni warekaki radiusin te circle ma te center ae taekinaki ae rinanon taian point aika raka iaon 1.

circle-change-radius-non-numerical = E aki kona ni bitaki radiusin te circle ae rinanon taian point aika akea numerical value irouia

circle-radius-with-points-non-numerical = E aki kona ni karikaki te circle ae rinanon taian point aika raka iaon teuana ma te radius ae taekinaki ngkana akea numerical value irouia.

circle-change-center-non-numerical = E tuai ni karaoaki bitakin centerin te circle ae rinanon taian point aika akea numerical value irouia.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] A aki tau taian dimension ibukin te domain ibukin te function. Iai { $intervals } te interval n te domain ma iai { $inputs ->
            [one] { $inputs } te input
           *[other] { $inputs } te input
        } iroun te function.
       *[other] A aki tau taian dimension ibukin te domain ibukin te function. Iai { $intervals } te interval n te domain ma iai { $inputs ->
            [one] { $inputs } te input
           *[other] { $inputs } te input
        } iroun te function.
    }

function-domain-invalid-format = E aki eti katein te domain ibukin te function.

function-ignoring-non-numerical =
    { $type ->
        [maximum] E aki kabonganaaki te maximum ae tiaki te namba ibukin te function.
        [minimum] E aki kabonganaaki te minimum ae tiaki te namba ibukin te function.
        [extremum] E aki kabonganaaki te extremum ae tiaki te namba ibukin te function.
        [point] E aki kabonganaaki te point ae tiaki te namba ibukin te function.
        [slope] E aki kabonganaaki te slope ae tiaki te namba ibukin te function.
       *[other] E aki kabonganaaki te { $type } ae tiaki te namba ibukin te function.
    }

function-ignoring-empty =
    { $type ->
        [maximum] E aki kabonganaaki te maximum ae akea kanoana ibukin te function.
        [minimum] E aki kabonganaaki te minimum ae akea kanoana ibukin te function.
        [extremum] E aki kabonganaaki te extremum ae akea kanoana ibukin te function.
        [point] E aki kabonganaaki te point ae akea kanoana ibukin te function.
       *[other] E aki kabonganaaki te { $type } ae akea kanoana ibukin te function.
    }

function-points-too-close = Iai uoua te point n te function aika rangi ni kaan. E aki kona ni katauaki te function.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] A kona n reke taian iterate ibukin te function ti ngkana e boraoi mwaitin taian input ma mwaitin taian output. Iai { $inputs } te input ao { $outputs ->
            [one] { $outputs } te output
           *[other] { $outputs } te output
        } iroun te function aei.
       *[other] A kona n reke taian iterate ibukin te function ti ngkana e boraoi mwaitin taian input ma mwaitin taian output. Iai { $inputs } te input ao { $outputs ->
            [one] { $outputs } te output
           *[other] { $outputs } te output
        } iroun te function aei.
    }

## `<sequence>`

sequence-invalid-length = E aki eti abwakin te sequence.  E riai bwa te integer ae aki mena i aan te akea.

# $type is a sequence type: number, letters, or math.
sequence-invalid-step = E aki eti te step ibukin te sequence.  E riai bwa te namba ibukin te sequence ae { $type }.

# $attribute is `from` or `to` — an attribute name, so it stays in English.
sequence-invalid-endpoint-number = E aki eti "{ $attribute }" ibukin te sequence ni namba.  E riai bwa te namba.

sequence-invalid-endpoint-letters = E aki eti "{ $attribute }" ibukin te sequence ni letters.  E riai bwa te ikotaki ni letters.

sequence-invalid-endpoint = E aki eti "{ $attribute }" ibukin te sequence.

select-from-sequence-coprime-not-numbers = e aki kabonganaaki coprime ibukina bwa a aki rineaki taian namba

select-from-sequence-coprime-with-exclude-combinations = e aki kabonganaaki coprime ibukina bwa e taekinaki excludeCombinations

## Resolving a `target`

target-not-found = E aki eti te target ibukin te `<{ $source }>`: e aki kona ni kuneaki te target.

target-state-variable-not-found = E aki eti te target ibukin te `<{ $source }>`: e aki kona ni kuneaki te state variable ae arana "{ $property }" iaon te `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = A riai taian variable ibukin te `<odeSystem>` bwa a na kaokoro ma te independent variable.

ode-system-duplicate-variable-names = E aki kona ni katauaki te ODE RHS function ngkana a okioki aran taian dependent variable.

ode-system-rhs-function-error = E aki kona ni katauaki te ODE RHS function.  E bure karikan te mathjs function.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = E aki kona ni katauaki te angle i marenan { $count } te line

angle-invalid-through-point = E aki eti te point n through ibukin te `<angle>`

parabola-vertex-too-many-points = E tuai ni karaoaki te parabola ma te vertex ae rinanon taian point aika raka iaon 1.

parabola-too-many-points = E tuai ni karaoaki te parabola ae rinanon taian point aika raka iaon 3.

intersection-too-many-items = E tuai ni karaoaki te intersection ibukin bwaai aika raka iaon uoua

## Other math components

ionic-compound-not-two-ions = E tuai ni karaoaki te ionic compound ibukin te bwai ae tiaki uoua te ion.

ionic-compound-needs-cation-and-anion = E karaoaki te ionic compound ti ibukin teuana te cation ao teuana te anion.

# $equation is the equation as the author wrote it.
solve-equations-cannot-evaluate = E aki kona n solve te equation ibukina bwa e aki kona ni warekaki: { $equation }

math-operators-operand-number-required = E riai n taekinaki te operandNumber ngkana e anaaki te operand ni math.

eigen-decomposition-failed = E aki kona ni warekaki taian eigenvalue ibukin te matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: e aki mena n te pattern te parameter ae { $parameters }, mangaia are e na boraoi n taai nako ma te blank.
       *[other] `<matchesPattern>`: a aki mena n te pattern taian parameter aika { $parameters }, mangaia are a na boraoi n taai nako ma te blank.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: e aki kona n ataaki grid="{ $grid }". E riai bwa none, medium, dense, ke uoua te namba ae raka iaon te akea aika kaokoroaki n te tabo ae akea, n aron grid="1 0.5". Akea te grid ae kaotaki.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    E kainnanoa te `<{ $component }>` te function ae iai iroun { $expected ->
        [one] teuana te output, te slope ae y' n te point teuana ma teuana, n aron `y - x`
       *[other] uoua te output, te vector n te point teuana ma teuana, n aron `(y, -x)`
    }, ma te function ae anganaki e iai iroun { $found ->
        [one] { $found } te output
       *[other] { $found } te output
    }. { $alternative ->
        [none] Akea te bwai ae kaotaki.
       *[other] Te `<{ $alternative }>` bon te component ae boraoi ma te function anne. Akea te bwai ae kaotaki.
    }

field-function-attribute-ignored-with-child = E aki kabonganaaki te attribute ae `function` ibukina bwa e mena naba te function i nanon te component; e kabonganaaki are i nano. Anga te function ni ti teuana te aro.

field-variables-ignored =
    `<{ $component }>`: te attribute ae `variables` e ataia aran taian variable ibukin te expression ae koreaki i nanon te component. { $reason ->
        [function-child] E anganaki te function ikai bwa natina ae te `<function>`, ae ataia aran oin ana variable, mangaia are e aki kabonganaaki `variables`.
       *[no-expression] Akea te expression ae anga ikai, mangaia are e aki kabonganaaki `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: e aki kona xLabelPosition="left" n te prefigure renderer; e kabonganaaki aron te right-position.

prefigure-y-label-position-unsupported = `<graph>`: e aki kona yLabelPosition="bottom" n te prefigure renderer; e kabonganaaki aron te top-position.

prefigure-invalid-axis-bounds = `<graph>`: a aki eti tian taian axis ibukin te bitaki nakon prefigure; e kabonganaaki te bbox ae te default (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: e aki eti te width ibukin te bitaki nakon prefigure; e kabonganaaki abwakin te diagram ae te default 425.

prefigure-invalid-aspect-ratio = `<graph>`: e aki eti te aspectRatio ibukin te bitaki nakon prefigure; e kabonganaaki te aspect ratio ae te default 1.

prefigure-grid-spacing-too-fine = `<graph>`: a rangi ni kaan i marenaia kanoan te grid ibukin tian taian axis; e kaakeaki te grid n te prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: a na aki kaotaki taian annotation ngkana e aki kabonganaaki te PreFigure renderer.

multiple-annotations-children = A bati natin te `<graph>` aika `<annotations>`; a aki kabonganaaki ni kabane ma ti te kabanea.

## Referring to other components

copy-unrecognized-component-type = E aki kona n extend ke n copy te component type ae aki ataaki: { $type }.

copy-prop-not-found = E aki kona ni kuneaki te prop ae { $property } iaon te component ae te { $component }

collect-no-source = Akea te source ae kuneaki ibukin te collect.

collect-invalid-component-type = E aki kona ni collect taian component ae te `<{ $component }>` ibukina bwa te component type ae aki eti.

reference-index-unavailable = E aki kona ni kaineti nakon te index ae `{ $reference }`

## `<callAction>`

component-action-unavailable = E aki kona ni weteaki { $action } iaon te component ae `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = E aki eti aron te data.  A aki boraoi abwakin taian row. E kuneaki n te componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = A okioki aran taian column n te data.  E kuneaki n te componentIdx :{ $componentIdx }

data-frame-missing-column-name = E bua aran teuana te column n te data.  E kuneaki n te componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Te award ibukin te kaeka aei e katauaki iaon oin ana kaeka te answer tag, ae e na karika te mwakuri ae aki kantaningaki.

answer-max-num-attempts-in-section-wide-check-work = Akea manenan katauan `maxNumAttempts` iaon te `<answer>` ae mena i nanon te container ae iai `sectionWideCheckWork` iai, ibukina bwa e taui mwaitin taian kataaki te container. Katauia `maxNumAttempts` iaon te container.

nested-section-wide-check-work-max-num-attempts = Akea manenan katauan `maxNumAttempts` iaon te container ae iai `sectionWideCheckWork` iai ae mena i nanon te container riki teuana ae iai `sectionWideCheckWork` iai, ibukina bwa e taui mwaitin taian kataaki te container are i tinaniku. Katauia `maxNumAttempts` iaon te container are i tinaniku.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Akea manenan te attribute ae { $attributes } ngkana e aki katauaki symbolicEquality.
       *[other] Akea manenan taian attribute aika { $attributes } ngkana e aki katauaki symbolicEquality.
    }

answer-invalid-type = E aki eti te type ibukin te answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ngkai akea aran te component ae `<{ $component }>`, e aki kona ni kabonganaaki ibukin ana attribute te module

module-attribute-name-already-defined = E aki kona ni kabonganaaki te component ae `<{ $component } name="{ $name }">` bwa ana attribute te module ibukina bwa iai ana attribute ae "{ $name }" te component type ae `<module>`.

conditional-content-condition-ignored = E aki kabonganaaki te attribute ae `condition` iaon te component ae `<conditionalContent>` ae iai natina aika case ke else.

slider-markers-type-mismatch = E aki boraoi typen taian marker ma typen te slider.

pretzel-problem-needs-statement-and-answer = E aki eti te pretzel: e riai n iai teuana te `<statement>` ao teuana te `<answer>` i nanon te `<problem>` teuana ma teuana.

pretzel-circuit-first-problem-distractor = E aki eti te pretzel: n te mode="circuit", e aki kona te moan `<problem>` bwa te distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] E aki eti te value ae { $values } ibukin te attribute ae `{ $attribute }`; e aki kabonganaaki.
       *[other] A aki eti taian value aika { $values } ibukin te attribute ae `{ $attribute }`; a aki kabonganaaki.
    }

attribute-must-be-references = E aki eti te value ae `{ $value }` ibukin te attribute ae `{ $attribute }`. E riai te attribute bwa e na karaoaki man taian reference aika moanaki n te `$`.

math-input-invalid-function-names = <mathInput>: a aki kabonganaaki aran taian function aika aki eti n { $attribute }: { $names }. E riai mwakoron te ara ae kaotaki bwa e na uoua koroboki ke e na bati riki (letters ke dashes); e kona n rimwi te suffix ae `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = E aki eti te component type: `<{ $componentType }>`

attribute-repeated = E aki kona n okiokinaki te attribute ae { $attribute }.

attribute-invalid-for-component = E aki eti te attribute ae "{ $attribute }" ibukin te component ae te `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Akea tokin te contrast n te style definition ae { $styleNumber } ibukin { $context ->
        [text-on-background] kunin te koroboki ni kaitaraa kunin te background
        [high-contrast] te kuna ae high-contrast ni kaitaraa te canvas
        [line] kunin te line ni kaitaraa te canvas
        [marker] kunin te marker ni kaitaraa te canvas
       *[text-on-canvas] kunin te koroboki ni kaitaraa te canvas
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e riai n { $threshold }:1 ke e rietata riki).

style-definition-dark-mode-text-background-contrast =
    E ngae ngke iai kunin te style definition ae { $styleNumber } aika taekinaki aika tau te contrast iai ibukin te light mode, ma a aki tau taian kuna ibukin te dark mode aika reke mai iai ibukin te contrast i marenan kunin te koroboki ma kunin te background ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e riai n { $threshold }:1 ke e rietata riki). { $suggestion ->
        [available] Ibukin karekean te contrast ae tau n te dark mode, ko kona ni kabatia te contrast n te light mode (n aron katauan { $lightAttribute }="{ $lightColor }") ke ni bita te kuna ibukin te dark mode (n aron katauan { $darkAttribute }="{ $darkColor }").
       *[none] Ibukin karekean te contrast ae tau n te dark mode, kabatia te contrast n te light mode ke bita taian kuna aika reke ni kabonganaan textColorDarkMode ao/ke backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    E ngae ngke iai kunin te koroboki n te style definition ae { $styleNumber } ae taekinaki ae tau te contrast iai ibukin te light mode, ma e aki tau kunin te koroboki ibukin te dark mode ae reke mai iai ni kaitaraa te canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e riai n { $threshold }:1 ke e rietata riki). { $suggestion ->
        [available] Ibukin karekean te contrast ae tau n te dark mode, ko kona ni kabatia te contrast n te light mode (n aron katauan textColor="{ $lightColor }") ke ni bita te kuna ibukin te dark mode (n aron katauan textColorDarkMode="{ $darkColor }").
       *[none] Ibukin karekean te contrast ae tau n te dark mode, kabatia te contrast n te light mode ke bita te kuna ae reke ni kabonganaan textColorDarkMode.
    }

section-multiple-style-palettes = E kona ni rinea ti teuana te <stylePalette> te mwakoro; e kabonganaaki are kabanea.

## Unique variants

variant-num-to-select-not-non-negative-integer = e aki kona n ataaki taian variant aika kaokoro ibukin { $component } ibukina bwa tiaki te integer ae aki mena i aan te akea numToSelect.

variant-num-to-select-not-constant-number = e aki kona n ataaki taian variant aika kaokoro ibukin { $component } ibukina bwa tiaki te namba ae aki bibitaki numToSelect.

variant-with-replacement-not-constant-boolean = e aki kona n ataaki taian variant aika kaokoro ibukin { $component } ibukina bwa tiaki te boolean ae aki bibitaki withReplacement.

variant-select-weight-disables-unique = A aki kona n reke taian variant aika kaokoro ibukin te select ngkana iai te option ae taekinaki iai selectWeight ke selectForVariants

variant-coprime-undetermined = e aki kona n ataaki taian variant aika kaokoro ibukin { $component } ibukina bwa e aki kona n ataaki bwa e aki koaua coprime n taai nako.

variant-attribute-not-constant = e aki kona n ataaki taian variant aika kaokoro ibukin { $component } ibukina bwa e bibitaki { $attribute }.

variant-attribute-not-number = e aki kona n ataaki taian variant aika kaokoro ibukin { $component } ibukina bwa tiaki te namba { $attribute }.

variant-attribute-wrong-type-for-sequence =
    e aki kona n ataaki taian variant aika kaokoro ibukin { $component } ae te type ae { $type } ibukina bwa tiaki { $expected ->
        [letters-combination] te ikotaki ni letters
        [math-expression] te math expression ae eti
        [integer] te integer
       *[number] te namba
    } { $attribute }.

variant-length-not-integer = e aki kona n ataaki taian variant aika kaokoro ibukin { $component } ibukina bwa tiaki te integer te length.

variant-sort-not-implemented = e tuai ni karaoaki taian variant aika kaokoro ibukin te { $component } ae iai te sort iai

variant-exclude-combinations-not-implemented = e tuai ni karaoaki taian variant aika kaokoro ibukin te { $component } ae iai te excludeCombinations iai

variant-math-exclude-not-implemented = e tuai ni karaoaki taian variant aika kaokoro ibukin te { $component } ae te type ae math ae iai te exclude iai

variant-non-constant-exclude-not-implemented = e tuai ni karaoaki taian variant aika kaokoro ibukin te { $component } ae iai te exclude ae bibitaki iai

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: e aki kona n te graph prefigure renderer; e kaakeaki natina.

prefigure-descendant-invalid-geometry = { $subject }: e aki bwanin ke e aki toki te geometry; e kaakeaki natina.

prefigure-curve-label-omitted = { $subject }: a aki kona taian label iaon taian curve element aika bitaki; e kaakeaki te label.

prefigure-curve-unsupported-definition-type = { $subject }: e aki kona te curve function definition type ae '{ $definitionType }'; e kaakeaki natina.

prefigure-region-flip-functions-unsupported = { $subject }: e aki kona te attribute ae flipFunctions iaon regionBetweenCurves; e kaakeaki natina.

prefigure-region-non-formula-child = { $subject }: a kona ti natina aika function aika te type ae formula iaon regionBetweenCurves; e kaakeaki natina.

prefigure-label-position-unsupported =
    { $subject }: e aki kona te labelPosition ae '{ $labelPosition }' ibukin { $labelKind ->
        [line-family] te label n te utu ni line
       *[point] te label ni point
    }; e kabonganaaki katautaun te PreFigure ae te default.

prefigure-fill-style-unsupported = { $subject }: e aki kona te fill style ae '{ $fillStyle }' iroun te PreFigure; e kabonganaaki te fill ae solid.

prefigure-line-style-unknown = { $subject }: e kaakeaki te line style ae aki ataaki ae '{ $lineStyle }' mai buakon kanoan te PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: e bitaki te marker style ae '{ $markerStyle }' nakon te PreFigure style ae 'diamond'.

prefigure-marker-style-unsupported = { $subject }: e aki kona te marker style ae '{ $markerStyle }' iroun te PreFigure; e kabonganaaki te style ae te default.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: e aki eti te `ref`; e aki kona ni kuneaki te target. E kaakeaki te annotation.

annotation-ref-multiple-targets = `<annotation>`: a bati taian target aika reke man te `ref`; e kabonganaaki te moan target.

annotation-ref-outside-graph = `<annotation>`: e aki eti te `ref`; e mena te target i tinanikun te graph ae otabwaninia. E kaakeaki te annotation.

annotation-ref-unsupported-target = `<annotation>`: e aki eti te `ref`; tiaki te bwai ni graph ae kona n te bitaki nakon prefigure te target. E kaakeaki te annotation.

annotation-text-missing = `<annotation>`: e bua ke akea kanoan te `text`; e kaotaki te text ae akea kanoana.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] E kuneaki te circular dependency.
       *[other] E kuneaki te circular dependency ae irekereke ma te component ae `<{ $componentType }>`.
    }

reference-no-referent = Akea te bwai ae kuneaki ibukin te reference: `{ $reference }`

reference-multiple-referents = A bati bwaai aika kuneaki ibukin te reference: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = E aki eti katein te attribute ae { $attribute } ibukin te `<{ $componentType }>`.

children-invalid = A aki eti natin te `<{ $componentType }>`: a kuneaki natina aika aki eti: { $children }

## Falling back to a default

attribute-value-invalid-using-default = E aki eti te value ae `{ $value }` ibukin te attribute ae `{ $attribute }`, e kabonganaaki te value ae `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] E aki kuneaki te DoenetML version ae { $version }.
       *[other] E aki kuneaki te DoenetML version ae { $version }. E kabonganaaki te version ae { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = E aki eti te DoenetML: { $content }

parse-tag-missing-close-tag = E aki eti te DoenetML: Akea ana closing tag te tag ae `{ $tag }`. E kantaningaki te tag ae self-closing ke te tag ae `</{ $tagName }>`.

parse-tag-error = E aki eti te DoenetML: E bure te tag ae `<{ $tagName }>`

parse-attribute-missing-value = E aki eti te DoenetML: Te attribute ae aki eti ae `{ $attribute }` e taraa n ae akea valuena.

parse-attribute-invalid = E aki eti te DoenetML: Te attribute ae aki eti ae `{ $attribute }`

parse-attribute-value-invalid = E aki eti te DoenetML: Te attribute value ae aki eti ae `{ $value }`

parse-attribute-value-quote-mismatch = E aki eti te DoenetML: Te attribute value ae aki eti ae `{ $value }`. A aki boraoi taian quote mark. Ko taraa n ae e bua iroum te `{ $quote }`

parse-open-tag-name-missing = E aki eti te DoenetML: E kuneaki te tag ae akea arana, n aron `<`

parse-tag-not-closed = E aki eti te DoenetML: E aki kainaki te tag ae `{ $tag }` (e taraa n ae e bua te `>`).

parse-self-closing-tag-name-missing = E aki eti te DoenetML: E kuneaki te tag ae akea arana `<{ $content }>`

parse-self-closing-tag-not-closed = E aki eti te DoenetML: E aki kainaki te tag ae `{ $tag }` (e taraa n ae e bua te `/>`).

parse-tag-invalid-attributes = E aki eti te DoenetML: E aki eti te tag ae `{ $tag }`. A kona n aki eti ana attribute.

parse-close-tag-name-missing = E aki eti te DoenetML: E kuneaki te closing tag ae akea arana, n aron `</`

parse-attribute-value-unquoted = A riai taian attribute value n otabwaninaki n taian quote: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = E aki eti te DoenetML: E kuneaki te closing tag ae `{ $tag }`, ma akea te opening tag ae boraoi ma ngaia

parse-close-tag-mismatched = E aki eti te DoenetML: E aki boraoi te closing tag. E kantaningaki `</{ $expected }>`. E kuneaki `{ $found }`

parser-node-unconvertible = E aki kona ni bitaki te node ae { $node } nakon te Dast node.

## Names

name-attribute-invalid =
    E aki eti te attribute ae name='{ $name }'. { $reason ->
        [characters] A kona n iai ti taian letter, namba, underscore ke hyphen n taian ara.
       *[start] A riai taian ara ni moanaki n te letter.
    }

component-name-invalid-start = E aki eti aran te component ae "{ $name }". A riai taian ara ni moanaki n te letter.

## `<answer>` sugar

answer-video-watched-missing-video = E riai te answer ae te type ae videoWatched bwa e na iai te attribute ae video

answer-video-watched-video-not-reference = E riai te answer ae te type ae videoWatched bwa e na iai te attribute ae video ae te reference

answer-name-not-single-text = E riai te attribute ae name ibukin te answer bwa e na iai ti teuana natina ae te text

## Referencing another document

external-doenetml-recursion-limit = E aki kona n reke te DoenetML mai tinaniku ibukina bwa a rangi ni bati riringan te okioki. Iai te circular reference?

external-doenetml-unavailable = E aki kona n reke te DoenetML mai { $attribute }="{ $uri }"

external-doenetml-type-mismatch = E aki eti te DoenetML ae reke mai { $attribute }="{ $uri }": e aki boraoi ma te component type ae "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] E aki manga kabonganaaki te attribute ae `{ $from }`; kabongana `{ $to }`.
       *[other] [deprecation] E aki manga kabonganaaki te attribute ae `{ $from }` iaon te `<{ $component }>`; kabongana `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] E aki manga kabonganaaki te attribute ae `{ $from }` ao e kaakeaki ibukina bwa e taekinaki naba `{ $to }`.
       *[other] [deprecation] E aki manga kabonganaaki te attribute ae `{ $from }` iaon te `<{ $component }>` ao e kaakeaki ibukina bwa e taekinaki naba `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] E aki manga kabonganaaki ao e kaakeaki te attribute ae `{ $attribute }` iaon te `<{ $component }>`.

deprecated-attribute-to-child = [deprecation] E aki manga kabonganaaki te attribute ae `{ $attribute }` iaon te `<{ $component }>`; kabongana natina ae te `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] E aki manga kabonganaaki te value ae `{ $value }` ibukin te attribute ae `{ $attribute }` iaon te `<{ $component }>`; kabongana `{ $to }`.


## Language coverage

pluralize-english-only = E kona ni kabatiaa ti te taetae n Ingiriti te `<pluralize>`, mangaia are e tiku n aki bitaki kanoana n te document ae koreaki n { $locale }. Korea te bwai ae bati oin nanona, ke katauia n te attribute ae `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Te element ae `<{ $tag }>` tiaki te Doenet element ae ataaki.

schema-element-not-allowed-at-root = E aki kariaiakaki te element ae `<{ $tag }>` n te root ibukin te document.

schema-element-not-allowed-inside = E aki kariaiakaki te element ae `<{ $tag }>` i nanon te `<{ $parent }>`.

schema-attribute-unrecognized = Akea ana attribute te element ae `<{ $tag }>` ae arana `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] E riai te attribute ae `{ $attribute }` ibukin te element ae `<{ $tag }>` bwa te list ae bwaina teuana ma teuana bon teuana mai buakon: { $allowed }
       *[other] E riai te attribute ae `{ $attribute }` ibukin te element ae `<{ $tag }>` bwa teuana mai buakon: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = E aki eti aran te variant ibukin te select.  E kaoti aran te variant ae { $variantName } n { $numOptions } te option ma mwaitin are e na rineaki bon { $numToSelect }.

select-variant-name-without-options = A taekinaki tabeua taian variant ibukin te select ma akea te option ae taekinaki ibukin aran te variant ae kona ni kaoti: { $variantName }.

select-variant-name-not-possible = Aran te variant ae { $variantName } ae taekinaki ibukin te select bon tiaki te ara ae kona ni kaoti.

select-too-few-options = E aki kona n rineaki { $numToSelect } te component man ti { $numOptions }.

select-from-sequence-too-few-values = E aki kona n rineaki { $numToSelect } te value man te sequence ae abwakina { $length }.

select-from-sequence-indices-count-mismatch = E riai mwaitin taian index aika taekinaki ibukin te select bwa e na boraoi ma mwaitin are e na rineaki

select-from-sequence-indices-not-integers = A riai taian index ni kabane aika taekinaki ibukin te select bwa taian integer

select-from-sequence-index-excluded = E taekinaki ana index te selectfromsequence ae kaakeaki

select-from-sequence-indices-excluded-combination = A taekinaki ana index te selectfromsequence aika te ikotaki ae kaakeaki

select-from-sequence-coprime-not-positive-integers = E aki kona n rineaki te ikotaki ni coprime ibukina bwa a aki rineaki taian integer aika raka iaon te akea.

select-from-sequence-coprime-common-factor = E aki kona n rineaki taian namba ni coprime. A tibwaia te factor ae ti teuana taian value ni kabane. (A riai taian value aika taekinaki ibukin "from" ke "to" bwa a na coprime ma "step".)

select-from-sequence-coprime-single-number = E aki kona n rineaki te ikotaki ni coprime man ti teuana te namba ae tiaki 1.

select-from-sequence-excluded-too-many-combinations = A kaakeaki taian ikotaki aika raka iaon 70% n te selectFromSequence

select-from-sequence-coprime-none-found = E aki kona n rineaki taian namba ni coprime. A tibwaia te factor ae ti teuana taian value ni kabane.

select-from-sequence-too-few-unique-values = E aki kona n rineaki { $numToSelect } te value ae kaokoro man te sequence ae abwakina { $numPossibleValues }

select-prime-numbers-too-few-values = E aki kona n rineaki { $numToSelect } te value man te list ni prime ae abwakina { $numValues }

select-prime-numbers-values-count-mismatch = E riai mwaitin taian value aika taekinaki ibukin te select bwa e na boraoi ma mwaitin are e na rineaki

select-prime-numbers-values-not-prime = A riai taian value ni kabane aika taekinaki ibukin te select prime number bwa a na mena n te list ni prime

select-prime-numbers-values-excluded-combination = A taekinaki ana value te selectPrimeNumbers aika te ikotaki ae kaakeaki

select-prime-numbers-excluded-too-many-combinations = A kaakeaki taian ikotaki aika raka iaon 70% n te selectPrimeNumbers

select-random-combination-fluke = N te bwai ae rangi ni kakaokoro, e aki kona n rineaki te ikotaki ni value aika random

select-random-value-fluke = N te bwai ae rangi ni kakaokoro, e aki kona n rineaki te value ae random

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    E aki kaotaki te `<{ $component }>` i nanon te math; e katauaki te expression n aron are imwain ae a kona n karinaki taian input i nanona. { $reason ->
        [not-inline] Ti te choice input ae `inline` ae kona ni mena i nanon te expression; ngkana akea `inline` bon te block ni button.
        [expanded] Te text input ae `expanded` bon te bwaoki ae bati kibuna, ae bubura riki nakon are e kona ni mena i nanon te expression.
        [on-graph] Iaon te graph e kaotaki te expression bwa ti teuana te taamnei, ae akea te tabo iai ibukin te control.
       *[relative-width] E relative te `width` iai (te percentage ke te `em`), ae akea te bwai ae na baireaki mai iai i nanon te expression. Anga te width n te mwaiti ae absolute, n aron te `px`.
    }
