# Mapudungun diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Written in the Alfabeto Mapuche Unificado; see `content.ftl`'s header for the
# orthography choice and for where the boundary between inherited words and
# Spanish loans falls.
#
# Mapudungun negates inside the verb — «-la-», «-no-» — rather than with a
# particle in front of it, so a negated sentence here is one word where English
# has two or three, and most of these messages are built on that.
#
# The plural is the free word «pu», dropped after a numeral, and the verb does not
# agree with an inanimate subject's number, so a counted message whose only
# English difference is number renders one string here and the select is dropped.
# A comment marks each site.


## `<lineSegment>`

# No select: the plural marker is dropped after a count and the verb does not
# agree with the number of what is ignored, so one string covers both English
# categories. The count still arrives.
line-segment-attributes-ignored-with-endpoints = { $attributes } inaduamngelay epu afpun elngele

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } inaduamngelay kiñe afpun ka kiñe rangiñ elngele

line-segment-midpoint-offset-without-midpoint = midpointOffset chem femlay rangiñ ngenole

## `<line>`

line-points-undetermined-dimensions = Wirin rupalu troy mew kimngenolu ñi fütrangen.

line-points-too-few-dimensions = Ti wirin müley ñi rupan troy mew epu doy fütrangen nielu.

line-points-depend-on-variables = Ti wirin rupay troy mew kañpüleluwün nielu: { $variables }.

line-equation-invalid-format = Weda adkünun ti wirin trürün { $variable1 } ka { $variable2 } kañpüleluwün mew.

## `<ray>`

ray-overprescribed-through = Ti rayu elngey through, endpoint ka direction mew.  Elngen through inaduamngelay.

ray-dimension-mismatch = numDimensions trürlay ti rayu mew.

## `<vector>`

vector-overprescribed-head = Ti bektor elngey head, tail ka displacement mew.  Elngen head inaduamngelay.

vector-dimension-mismatch = numDimensions trürlay ti bektor mew.

## Attracting and constraining

attract-to-without-nearest-point = Pepi witranngelay kiñe `<{ $component }>` mew, nearestPoint nienole.

constrain-to-without-nearest-point = Pepi nürünngelay kiñe `<{ $component }>` mew, nearestPoint nienole.

constrain-to-interior-without-nearest-point = Pepi nürünngelay kiñe `<{ $component }>` ponwi, nearestPoint nienole.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition inaduamngelay inline nolu choiceInput mew

## Ordering children by index

choice-input-indices-count-mismatch = Elngen indices choiceInput mew inaduamngelay, ti rakin trürlay ti choice pu püñeñ rakin mew.

pretzel-indices-count-mismatch = Elngen indices problem mew inaduamngelay, ti rakin trürlay ti problem pu püñeñ rakin mew.

shuffle-indices-count-mismatch = Elngen indices shuffle mew inaduamngelay, ti rakin trürlay ti pu trokiñ rakin mew.

indices-ignored-out-of-range = Elngen indices { $component } mew inaduamngelay, kiñeke indices wekun müley.

pretzel-indices-repeated = Elngen indices pretzel mew inaduamngelay, kiñeke indices epuñpüle müley.

pretzel-circuit-first-index = Elngen indices pretzel circuit mew inaduamngelay, ti wünen index müley ñi 1 ngen.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` küdawam wirintukun pu püñeñ mew, müley ñi elngen kiñe `type` adkünun.

invalid-type-defaulting-to-math = Weda adkünun { $type } ti { $component } trokiñ mew. Müley ñi math, text, number kam boolean ngen. math elngey.

string-not-valid-component-to-arrange = Ti wirintukun "{ $value }" rüfngelay trokiñ { $component } mew. Inaduamngelay.

## Types and variables

invalid-type-defaulting-to-number = Weda adkünun { $type }, number elngey.

invalid-variable-value = Weda falin kiñe kañpüleluwün mew: `{ $value }`

## Variants

variant-index-must-be-number = Adkünun index { $index } müley ñi rakin ngen

variant-index-must-be-integer = Adkünun index { $index } müley ñi apoll rakin ngen

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` dewmangelay apoll rakin mew. Trürkünun rakin elngey.

side-by-side-absolute-margins = `<{ $component }>` dewmangelay apoll rakin mew. Trürkünun inaltu elngey.

side-by-side-no-block-child = Weda `<{ $component }>`: müley ñi nien kiñe bloke püñeñ.

## `<label>`

label-for-ignored-on-graphical = `for` adkünun inaduamngelay adentun `<label>` mew.

label-for-must-resolve-to-one = `for` adkünun `<label>` mew müley ñi inarumen kiñe trokiñ müten.

label-for-unresolved = `for` adkünun `<label>` mew pepi inarumelafi kiñe trokiñ.

label-for-answer-with-authored-inputs = `for` adkünun `<label>` mew inarumey kiñe `<answer>` wirintukufe ñi elelchi konün nielu; inarumenge ti konün müten.

label-for-answer-without-input = `for` adkünun `<label>` mew inarumey kiñe `<answer>` konün nienolu üytuam.

label-for-must-reference-input-or-answer = `for` adkünun `<label>` mew müley ñi inarumen kiñe konün kam kiñe llowdungun.

## Accessibility

accessibility-short-description-or-decorative = Konpeyüm mew, `<{ $component }>` müley ñi nien kiñe pichi adentun kam ñi feypingen adkünulchi.

accessibility-video-short-description = Konpeyüm mew, `<video>` müley ñi nien kiñe pichi adentun.

accessibility-input-short-description-or-label = Konpeyüm mew, `<{ $component }>` müley ñi nien kiñe pichi adentun kam kiñe üy.

accessibility-answer-input-short-description-or-label = Konpeyüm mew, kiñe `<answer>` konün dewmalu müley ñi nien kiñe pichi adentun kam kiñe üy.

accessibility-short-description-contains-math = Pichi adentun müley ñi nienon rakin trokiñ `<{ $component }>` reke. Wirintukunge ti rakin dungu mew.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } pepi adkintungelay ti wichuntukun üy wirintukun mew (kurü adkünun) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; duamniey { $threshold }:1).
       *[other] { $colorName } pepi adkintungelay ti wichuntukun üy wirintukun mew ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; duamniey { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Petu dewmangelay `<circle>` { $count } troy mew rupalu, ti troy rakin falin nienole.

circle-too-many-through-points = Pepi rakingelay kiñe wallke 3 doy troy mew rupalu.

circle-overprescribed-radius-center-points = Pepi rakingelay kiñe wallke elngen rangiñ pülon, rangiñ ka troy mew.

circle-center-with-multiple-points = Pepi rakingelay kiñe wallke elngen rangiñ nielu 1 doy troy mew rupalu.

circle-radius-too-small = Pepi rakingelay ti wallke: ti epu troy ñi rangiñ pülon { $distance } ngele, elngen rangiñ pülon { $radius } pichiy.

circle-radius-with-many-points = Pepi dewmangelay kiñe wallke epu doy troy mew rupalu elngen rangiñ pülon mew.

circle-invalid-center-or-through-points = Weda ti wallke ñi rangiñ kam ñi troy.

circle-radius-center-with-multiple-points = Pepi rakingelay ti wallke ñi rangiñ pülon elngen rangiñ nielu 1 doy troy mew rupalu.

circle-change-radius-non-numerical = Pepi kañpüleelngelay ti wallke ñi rangiñ pülon ti troy rakin ngenole

circle-radius-with-points-non-numerical = Pepi dewmangelay kiñe wallke kiñe doy troy mew rupalu elngen rangiñ pülon mew, rakin falin ngenole.

circle-change-center-non-numerical = Petu dewmangelay ti wallke ñi rangiñ kañpüleelngen troy mew rupalu rakin falin nienolu.

## `<function>`

# Both selects dropped: the plural marker is dropped after a numeral and the verb
# does not agree, so English's four sentences are one here. Both counts still
# arrive and are still formatted.
function-domain-insufficient-dimensions = Ti funsion ñi mapu ñi fütrangen puwlay. Ti mapu niey { $intervals } rangiñtu welu ti funsion niey { $inputs } konün.

function-domain-invalid-format = Weda adkünun ti funsion ñi mapu mew.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ti funsion ñi doy fütra rakin ngenolu inaduamngelay.
        [minimum] Ti funsion ñi doy pichi rakin ngenolu inaduamngelay.
        [extremum] Ti funsion ñi afpun rakin ngenolu inaduamngelay.
        [point] Ti funsion ñi troy rakin ngenolu inaduamngelay.
        [slope] Ti funsion ñi witran rakin ngenolu inaduamngelay.
       *[other] Ti funsion ñi { $type } rakin ngenolu inaduamngelay.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ti funsion ñi doy fütra chemnorumelu inaduamngelay.
        [minimum] Ti funsion ñi doy pichi chemnorumelu inaduamngelay.
        [extremum] Ti funsion ñi afpun chemnorumelu inaduamngelay.
        [point] Ti funsion ñi troy chemnorumelu inaduamngelay.
       *[other] Ti funsion ñi { $type } chemnorumelu inaduamngelay.
    }

function-points-too-close = Ti funsion niey epu troy fülkülelu. Pepi adentungelay ti funsion.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Ti funsion ñi wüñoltun pepingey ti konün rakin trürle ti tripan rakin mew müten. Tüfachi funsion niey { $inputs } konün ka { $outputs } tripan.

## `<sequence>`

sequence-invalid-length = Weda ti inaltun ñi alün.  Müley ñi apoll rakin pichiñmanolu ngen.

sequence-invalid-step = Weda ti inaltun ñi nampülkan.  Müley ñi rakin ngen { $type } adkünun inaltun mew.

sequence-invalid-endpoint-number = Weda "{ $attribute }" rakin inaltun mew.  Müley ñi rakin ngen.

sequence-invalid-endpoint-letters = Weda "{ $attribute }" wirin inaltun mew.  Müley ñi wirin trawün ngen.

sequence-invalid-endpoint = Weda ti inaltun ñi "{ $attribute }".

select-from-sequence-coprime-not-numbers = coprime inaduamngelay, rakin dullingenole

select-from-sequence-coprime-with-exclude-combinations = coprime inaduamngelay, excludeCombinations elngele

## Resolving a `target`

target-not-found = Weda target `<{ $source }>` mew: peñgelay.

target-state-variable-not-found = Weda target `<{ $source }>` mew: peñgelay kiñe müleyüm "{ $property }" üy nielu kiñe `<{ $component }>` mew.

## `<odeSystem>`

ode-system-variables-match-independent = Ti `<odeSystem>` ñi kañpüleluwün müley ñi kaley ti kishu kañpüleluwün mew.

ode-system-duplicate-variable-names = Pepi adentungelay ODE RHS funsion epuñpüle kañpüleluwün üy mew.

ode-system-rhs-function-error = Pepi adentungelay ODE RHS funsion.  Welulkan ti mathjs funsion dewmalu.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Pepi adentungelay kiñe xoy { $count } wirin ñi rangiñ

angle-invalid-through-point = Weda troy `<angle>` ñi through mew

parabola-vertex-too-many-points = Petu dewmangelay parabola xoy nielu 1 doy troy mew rupalu.

parabola-too-many-points = Petu dewmangelay parabola 3 doy troy mew rupalu.

intersection-too-many-items = Petu dewmangelay trawün epu doy trokiñ mew

## Other math components

ionic-compound-not-two-ions = Petu dewmangelay trawün ionika epu ion kalelu mew.

ionic-compound-needs-cation-and-anion = Ti trawün ionika dewmangey kiñe kation ka kiñe anion mew müten.

solve-equations-cannot-evaluate = Pepi nornentungelay ti trürün, pepi rakingenole: { $equation }

math-operators-operand-number-required = Müley ñi elngen kiñe operandNumber kiñe rakin operando nentule.

eigen-decomposition-failed = Pepi rakingelay ti matris ñi kishu falin

## `<matchesPattern>`

# No select: the plural marker is dropped after a count and the verb does not
# agree, so both English categories are one string.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: ti { $parameters } rakin mülelay ti adentun mew, feymew rumel trürküleay chemnorume mew.

## `<graph>`

graph-grid-invalid = `<graph>`: pepi kimngelay grid="{ $grid }". Müley ñi none, medium, dense, kam epu rakin pichiñmanolu ngen, kiñe wechun mew wichungelu, tüfa reke grid="1 0.5". Chemnorume wirin trawün dewmangelay.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" inaduamngelay ti prefigure pengelfe mew; man püle femngen inaduamngey.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" inaduamngelay ti prefigure pengelfe mew; wenu püle femngen inaduamngey.

prefigure-invalid-axis-bounds = `<graph>`: weda ti wirin ñi afpun prefigure kañpüleelngen mew; wüne bbox inaduamngey (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: weda ti fütrangen prefigure kañpüleelngen mew; wüne adentun fütrangen 425 inaduamngey.

prefigure-invalid-aspect-ratio = `<graph>`: weda aspectRatio prefigure kañpüleelngen mew; wüne trürün 1 inaduamngey.

prefigure-grid-spacing-too-fine = `<graph>`: ti wirin trawün ñi wechun trongliy ti wirin ñi afpun mew; ti wirin trawün elkünungey ti prefigure pengelfe mew.

prefigure-annotations-not-rendered = `<graph>`: pu wirintukun pengelngelayay ti PreFigure pengelfe inaduamngenole.

multiple-annotations-children = Fentren `<annotations>` pu püñeñ peñgey `<graph>` ponwi; kom inaduamngelay, ti afpun müten.

## Referring to other components

copy-unrecognized-component-type = Pepi doyümngelay kam pepi kopiangelay kiñe trokiñ adkünun kimngenolu: { $type }.

copy-prop-not-found = Peñgelay prop { $property } kiñe trokiñ { $component } adkünun mew

collect-no-source = Chemnorume llitun peñgelay collect mew.

collect-invalid-component-type = Pepi trawüngelay trokiñ `<{ $component }>` adkünun, weda adkünun ngele.

reference-index-unavailable = Pepi inarumengelay ti index `{ $reference }`

## `<callAction>`

component-action-unavailable = Pepi mütrümngelay { $action } ti trokiñ `{ $reference }` mew

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Weda ti kimeltun ñi adkünun.  Ti wirin ñi alün trürlay. Peñgey componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Ti kimeltun niey epuñpüle witran üy.  Peñgey componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ti kimeltun ñamümniey kiñe witran üy.  Peñgey componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Kiñe award tüfachi llowdungun mew müley ti llowdungun tag ñi kishu werkün llowdungun mew, ka tüfa yeay kiñe femngen üngümngenolu.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` elngen kiñe `<answer>` mew, `sectionWideCheckWork` nielu ñi ponwi, chem femlay, ti ponwi elelchi ñi rakin pepilun elkünulu ngele. Elnge `maxNumAttempts` ti ponwi elelchi mew.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` elngen kiñe ponwi elelchi `sectionWideCheckWork` nielu mew, ka ponwi elelchi `sectionWideCheckWork` nielu ñi ponwi mülelu, chem femlay, ti wekun ponwi elelchi ñi rakin pepilun elkünulu ngele. Elnge `maxNumAttempts` ti wekun ponwi elelchi mew.

# No select: «adkünun» takes no plural marker after a count and the verb does not
# agree with it.
answer-attributes-need-symbolic-equality = Ti adkünun { $attributes } chem femlayay symbolicEquality elngenole.

answer-invalid-type = Weda adkünun ti llowdungun mew: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ti trokiñ `<{ $component }>` üy nienole, pepi inaduamngelay module adkünun mew

module-attribute-name-already-defined = Ti trokiñ `<{ $component } name="{ $name }">` pepi inaduamngelay adkünun reke module mew, ti `<module>` adkünun trokiñ dew niey kiñe "{ $name }" adkünun.

conditional-content-condition-ignored = Ti `condition` adkünun inaduamngelay kiñe `<conditionalContent>` trokiñ case kam else pu püñeñ nielu mew.

slider-markers-type-mismatch = Ti chillka adkünun trürlay ti slider adkünun mew.

pretzel-problem-needs-statement-and-answer = Weda pretzel: kom `<problem>` müley ñi nien kiñe `<statement>` ka kiñe `<answer>`.

pretzel-circuit-first-problem-distractor = Weda pretzel: mode="circuit" mew, ti wünen `<problem>` pepi ngelay ñamümfe.

## Attribute values

# No select: «falin» takes no plural marker after a count.
attribute-invalid-values = Weda falin { $values } ti adkünun `{ $attribute }` mew; inaduamngelay.

attribute-must-be-references = Weda falin `{ $value }` ti adkünun `{ $attribute }` mew. Ti adkünun müley ñi dewmangen inarumen `$` mew llitulu mew.

math-input-invalid-function-names = <mathInput>: weda funsion üy inaduamngelay { $attribute } mew: { $names }. Kom üy ñi pengelün trokiñ müley ñi nien 2 doy wirin (wirin kam wirin fütra); kiñe `|<mathspeak alternative>` küpaafuy ñi inan.

## Building components from the source

component-type-invalid = Weda trokiñ adkünun: `<{ $componentType }>`

attribute-repeated = Pepi epuñpülengelay ti adkünun { $attribute }.

attribute-invalid-for-component = Weda ti adkünun "{ $attribute }" kiñe trokiñ `<{ $componentType }>` adkünun mew.

## Style definition contrast

style-definition-insufficient-contrast =
    Ti adentun adkünun { $styleNumber } pepi adkintungelay { $context ->
        [text-on-background] ti wirintukun ad ti furi ad mew
        [high-contrast] ti fütra adkintun ad ti wirinwe mew
        [line] ti wirin ad ti wirinwe mew
        [marker] ti chillka ad ti wirinwe mew
       *[text-on-canvas] ti wirintukun ad ti wirinwe mew
    }{ $mode ->
        [dark] { " (kurü adkünun)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; duamniey { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Rüfngele ti adentun adkünun { $styleNumber } elelfi ad pepi adkintungelu ti liq adkünun mew, ti kurü ad tüfachi falin mew tripalu pepi adkintungelay ti wirintukun ad ti furi ad mew ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; duamniey { $threshold }:1). { $suggestion ->
        [available] Adkintungeam ti kurü adkünun mew, doyümnge ti liq adkintun (tüfa reke, elnge { $lightAttribute }="{ $lightColor }") kam kañpüleelnge ti kurü ad (tüfa reke, elnge { $darkAttribute }="{ $darkColor }").
       *[none] Adkintungeam ti kurü adkünun mew, doyümnge ti liq adkintun kam kañpüleelnge ti tripan ad textColorDarkMode ka/kam backgroundColorDarkMode mew.
    }

style-definition-dark-mode-text-canvas-contrast =
    Rüfngele ti adentun adkünun { $styleNumber } elelfi kiñe wirintukun ad pepi adkintungelu ti liq adkünun mew, ti kurü wirintukun ad tüfachi falin mew tripalu pepi adkintungelay ti wirinwe mew ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; duamniey { $threshold }:1). { $suggestion ->
        [available] Adkintungeam ti kurü adkünun mew, doyümnge ti liq adkintun (tüfa reke, elnge textColor="{ $lightColor }") kam kañpüleelnge ti kurü ad (tüfa reke, elnge textColorDarkMode="{ $darkColor }").
       *[none] Adkintungeam ti kurü adkünun mew, doyümnge ti liq adkintun kam kañpüleelnge ti tripan ad textColorDarkMode mew.
    }

section-multiple-style-palettes = Kiñe wichuntukun pepi dulliy kiñe <stylePalette> müten; ti afpun inaduamngey.

## Unique variants

variant-num-to-select-not-non-negative-integer = pepi kimngelay { $component } ñi kishu adkünun, numToSelect apoll rakin pichiñmanolu ngenole.

variant-num-to-select-not-constant-number = pepi kimngelay { $component } ñi kishu adkünun, numToSelect rumel rakin ngenole.

variant-with-replacement-not-constant-boolean = pepi kimngelay { $component } ñi kishu adkünun, withReplacement rumel boolean ngenole.

variant-select-weight-disables-unique = select ñi kishu adkünun nürüfngey mülele kiñe dullin selectWeight kam selectForVariants elngelu

variant-coprime-undetermined = pepi kimngelay { $component } ñi kishu adkünun, pepi kimngenole coprime rumel koyla ngen.

variant-attribute-not-constant = pepi kimngelay { $component } ñi kishu adkünun, { $attribute } rumel ngenole.

variant-attribute-not-number = pepi kimngelay { $component } ñi kishu adkünun, { $attribute } rakin ngenole.

variant-attribute-wrong-type-for-sequence =
    pepi kimngelay { $component } { $type } adkünun ñi kishu adkünun, { $attribute } { $expected ->
        [letters-combination] kiñe wirin trawün
        [math-expression] kiñe rüf rakin dungu
        [integer] kiñe apoll rakin
       *[number] kiñe rakin
    } ngenole.

variant-length-not-integer = pepi kimngelay { $component } ñi kishu adkünun, length apoll rakin ngenole.

variant-sort-not-implemented = petu dewmangelay kiñe { $component } ñi kishu adkünun sort mew

variant-exclude-combinations-not-implemented = petu dewmangelay kiñe { $component } ñi kishu adkünun excludeCombinations mew

variant-math-exclude-not-implemented = petu dewmangelay kiñe { $component } math adkünun ñi kishu adkünun exclude mew

variant-non-constant-exclude-not-implemented = petu dewmangelay kiñe { $component } ñi kishu adkünun rumel ngenolu exclude mew

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: inaduamngelay ti graph prefigure pengelfe mew; ti püñeñ elkünungey.

prefigure-descendant-invalid-geometry = { $subject }: afpunngenolu kam apollngenolu adkünun; ti püñeñ elkünungey.

prefigure-curve-label-omitted = { $subject }: pu üy inaduamngelay ti kañpüleelngen wallke wirin mew; ti üy elkünungey.

prefigure-curve-unsupported-definition-type = { $subject }: wallke wirin funsion adentun adkünun '{ $definitionType }' inaduamngelay; ti püñeñ elkünungey.

prefigure-region-flip-functions-unsupported = { $subject }: ti flipFunctions adkünun inaduamngelay regionBetweenCurves mew; ti püñeñ elkünungey.

prefigure-region-non-formula-child = { $subject }: formula adkünun funsion pu püñeñ müten inaduamngey regionBetweenCurves mew; ti püñeñ elkünungey.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' inaduamngelay { $labelKind ->
        [line-family] kiñe wirin reñma üy
       *[point] kiñe troy üy
    } mew; wüne PreFigure trürkünun inaduamngey.

prefigure-fill-style-unsupported = { $subject }: PreFigure inaduamlay ti apolen adkünun '{ $fillStyle }'; apoll apolen mew wüñotuy.

prefigure-line-style-unknown = { $subject }: kimngenolu wirin adkünun '{ $lineStyle }' elkünungey ti PreFigure tripan mew.

prefigure-marker-style-mapped-to-diamond = { $subject }: ti chillka adkünun '{ $markerStyle }' elngey PreFigure adkünun 'diamond' reke.

prefigure-marker-style-unsupported = { $subject }: PreFigure inaduamlay ti chillka adkünun '{ $markerStyle }'; wüne adkünun inaduamngey.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: weda `ref`; pepi peñgelay ti inarumepeyüm. Ti wirintukun elkünungey.

annotation-ref-multiple-targets = `<annotation>`: `ref` puwi fentren inarumepeyüm mew; ti wünen inaduamngey.

annotation-ref-outside-graph = `<annotation>`: weda `ref`; ti inarumepeyüm wekun müley ti graph mew. Ti wirintukun elkünungey.

annotation-ref-unsupported-target = `<annotation>`: weda `ref`; ti inarumepeyüm adentun trokiñ ngelay inaduamngelu ti prefigure kañpüleelngen mew. Ti wirintukun elkünungey.

annotation-text-missing = `<annotation>`: `text` ñamümniey kam chemnorumey; chemnorume wirintukun elngey.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Peñgey kiñe wallke luwün.
       *[other] Peñgey kiñe wallke luwün kiñe `<{ $componentType }>` trokiñ mew.
    }

reference-no-referent = Chemnorume peñgelay tüfachi inarumen mew: `{ $reference }`

reference-multiple-referents = Fentren peñgey tüfachi inarumen mew: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Weda adkünun ti adkünun { $attribute } `<{ $componentType }>` mew.

children-invalid = Weda pu püñeñ `<{ $componentType }>` mew: peñgey weda pu püñeñ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Weda falin `{ $value }` ti adkünun `{ $attribute }` mew, falin `{ $default }` inaduamngey

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML adkünun { $version } peñgelay.
       *[other] DoenetML adkünun { $version } peñgelay. Adkünun { $fallback } mew wüñotuy
    }

## Reading the DoenetML

parse-invalid-doenetml = Weda DoenetML: { $content }

parse-tag-missing-close-tag = Weda DoenetML: Ti tag `{ $tag }` nürüfpeyüm tag nielay. Müley kiñe tag kishu nürüfnielu kam kiñe `</{ $tagName }>` tag.

parse-tag-error = Weda DoenetML: Welulkan ti tag `<{ $tagName }>` mew

parse-attribute-missing-value = Weda DoenetML: Ti weda adkünun `{ $attribute }` falin ñamümniey.

parse-attribute-invalid = Weda DoenetML: Weda ti adkünun `{ $attribute }`

parse-attribute-value-invalid = Weda DoenetML: Weda ti adkünun falin `{ $value }`

parse-attribute-value-quote-mismatch = Weda DoenetML: Weda ti adkünun falin `{ $value }`. Ti dungu chillka trürlay. Ñamümniey kiñe `{ $quote }`

parse-open-tag-name-missing = Weda DoenetML: Peñgey kiñe tag üy nienolu, tüfa reke `<`

parse-tag-not-closed = Weda DoenetML: Ti tag `{ $tag }` nürüfngelay (kiñe `>` ñamümniey).

parse-self-closing-tag-name-missing = Weda DoenetML: Peñgey kiñe tag üy nienolu `<{ $content }>`

parse-self-closing-tag-not-closed = Weda DoenetML: Ti tag `{ $tag }` nürüfngelay (`/>` ñamümniey).

parse-tag-invalid-attributes = Weda DoenetML: Ti tag `{ $tag }` rüfngelay. Pepi niey weda adkünun.

parse-close-tag-name-missing = Weda DoenetML: Peñgey kiñe nürüfpeyüm tag üy nienolu, tüfa reke `</`

parse-attribute-value-unquoted = Ti adkünun falin müley ñi mülen dungu chillka ponwi: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Weda DoenetML: Peñgey nürüfpeyüm tag `{ $tag }`, welu müleay ti trürkülelu nülapeyüm tag

parse-close-tag-mismatched = Weda DoenetML: Ti nürüfpeyüm tag trürlay. Müleafuy `</{ $expected }>`. Peñgey `{ $found }`

parser-node-unconvertible = Pepi kañpüleelngelay ti node { $node } Dast node reke.

## Names

name-attribute-invalid =
    Weda ti adkünun name='{ $name }'. { $reason ->
        [characters] Pu üy pepi niey wirin, rakin, minche wirin kam fütra wirin müten.
       *[start] Pu üy müley ñi llitun kiñe wirin mew.
    }

component-name-invalid-start = Weda ti trokiñ üy "{ $name }". Pu üy müley ñi llitun kiñe wirin mew.

## `<answer>` sugar

answer-video-watched-missing-video = Kiñe llowdungun videoWatched adkünun müley ñi nien kiñe video adkünun

answer-video-watched-video-not-reference = Kiñe llowdungun videoWatched adkünun müley ñi nien kiñe video adkünun kiñe inarumen ngelu

answer-name-not-single-text = Ti llowdungun ñi name adkünun müley ñi nien kiñe wirintukun püñeñ müten

## Referencing another document

external-doenetml-recursion-limit = Pepi peñgelay ti wekun DoenetML, fentren wüñoltun mew. ¿Müley kiñe wallke inarumen?

external-doenetml-unavailable = Pepi peñgelay ti DoenetML { $attribute }="{ $uri }" mew

external-doenetml-type-mismatch = Weda DoenetML peñgey { $attribute }="{ $uri }" mew: trürlay ti trokiñ adkünun "{ $componentType }" mew

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ti adkünun `{ $from }` kuyfiyey; inaduamnge `{ $to }`.
       *[other] [deprecation] Ti adkünun `{ $from }` `<{ $component }>` mew kuyfiyey; inaduamnge `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ti adkünun `{ $from }` kuyfiyey ka inaduamngelay, `{ $to }` kafey elngele.
       *[other] [deprecation] Ti adkünun `{ $from }` `<{ $component }>` mew kuyfiyey ka inaduamngelay, `{ $to }` kafey elngele.
    }

deprecated-attribute-ignored = [deprecation] Ti adkünun `{ $attribute }` `<{ $component }>` mew kuyfiyey ka inaduamngelay.

deprecated-attribute-to-child = [deprecation] Ti adkünun `{ $attribute }` `<{ $component }>` mew kuyfiyey; inaduamnge kiñe `<{ $child }>` püñeñ.

deprecated-attribute-value-renamed = [deprecation] Ti falin `{ $value }` ti adkünun `{ $attribute }` `<{ $component }>` mew kuyfiyey; inaduamnge `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` pepi fentrenümi ti inglés dungu müten, feymew ñi wirintukun kañpülelay kiñe chillka { $locale } dungu mew wirintukungelu. Wirintukunge ti fentren adkünun kishu, kam elnge ti `pluralForm` adkünun mew.


## Checking against the schema

schema-element-unrecognized = Ti trokiñ `<{ $tag }>` kimngenolu Doenet trokiñ ngey.

schema-element-not-allowed-at-root = Ti trokiñ `<{ $tag }>` elungelay ti chillka ñi folil mew.

schema-element-not-allowed-inside = Ti trokiñ `<{ $tag }>` elungelay `<{ $parent }>` ponwi.

schema-attribute-unrecognized = Ti trokiñ `<{ $tag }>` nielay kiñe adkünun `{ $attribute }` üy nielu.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ti adkünun `{ $attribute }` ti trokiñ `<{ $tag }>` mew müley ñi wirin ngen, kom ñi trokiñ kiñe tüfa mew ngelu: { $allowed }
       *[other] Ti adkünun `{ $attribute }` ti trokiñ `<{ $tag }>` mew müley ñi kiñe tüfa mew ngen: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Weda adkünun üy select mew.  Ti adkünun üy { $variantName } müley { $numOptions } dullin mew welu ti dullin rakin { $numToSelect } ngey.

select-variant-name-without-options = Kiñeke adkünun elngey select mew welu chemnorume dullin elngelay tüfachi pepi adkünun üy mew: { $variantName }.

select-variant-name-not-possible = Ti adkünun üy { $variantName } elngen select mew pepi adkünun üy ngelay.

select-too-few-options = Pepi dullingelay { $numToSelect } trokiñ { $numOptions } mew müten.

select-from-sequence-too-few-values = Pepi dullingelay { $numToSelect } falin kiñe inaltun { $length } alünlu mew.

select-from-sequence-indices-count-mismatch = Ti indices rakin elngen select mew müley ñi trürün ti dullin rakin mew

select-from-sequence-indices-not-integers = Kom indices elngen select mew müley ñi apoll rakin ngen

select-from-sequence-index-excluded = Ti selectfromsequence ñi index elngen wemüngey

select-from-sequence-indices-excluded-combination = Ti selectfromsequence ñi indices elngen wemüngen trawün ngefuy

select-from-sequence-coprime-not-positive-integers = Pepi dullingelay coprime trawün, apoll rakin pichiñmanolu dullingenole.

select-from-sequence-coprime-common-factor = Pepi dullingelay coprime rakin. Kom pepi falin niey kiñe trürkülechi dewmafe. (Elngen "from" kam "to" falin müley ñi coprime ngen "step" mew.)

select-from-sequence-coprime-single-number = Pepi dullingelay coprime trawün kiñe rakin 1 ngenolu mew.

select-from-sequence-excluded-too-many-combinations = 70% doy trawün wemüngey selectFromSequence mew

select-from-sequence-coprime-none-found = Pepi dullingelay coprime rakin. Kom pepi falin niey kiñe trürkülechi dewmafe.

select-from-sequence-too-few-unique-values = Pepi dullingelay { $numToSelect } kishu falin kiñe inaltun { $numPossibleValues } alünlu mew

select-prime-numbers-too-few-values = Pepi dullingelay { $numToSelect } falin kiñe primo rakin wirin { $numValues } alünlu mew

select-prime-numbers-values-count-mismatch = Ti falin rakin elngen select mew müley ñi trürün ti dullin rakin mew

select-prime-numbers-values-not-prime = Kom falin elngen select primo rakin mew müley ñi mülen ti primo rakin wirin mew

select-prime-numbers-values-excluded-combination = Ti selectPrimeNumbers ñi falin elngen wemüngen trawün ngefuy

select-prime-numbers-excluded-too-many-combinations = 70% doy trawün wemüngey selectPrimeNumbers mew

select-random-combination-fluke = Kiñe rume pepingenochi dungu mew, pepi dullingelay kiñe kimngenochi falin trawün

select-random-value-fluke = Kiñe rume pepingenochi dungu mew, pepi dullingelay kiñe kimngenochi falin
