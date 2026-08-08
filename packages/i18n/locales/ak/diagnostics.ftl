# Akan diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Asante Twi, as `content.ftl`'s header sets out.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Where English separates a singular from a plural only in the verb — "is
# ignored" against "are ignored" — the Twi verb takes no number from its
# subject, and the argument is a list either way. So those selects are dropped
# and the count argument goes unused.
#
# A line of the author's source is a «layin»; «nsensanee», which `content.ftl`
# uses, is the geometric line a document draws.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = Sɛ wɔka awieeɛ pɔint mmienu no ho asɛm a, wɔmfa { $attributes } nyɛ hwee

line-segment-attributes-ignored-with-endpoint-and-midpoint = Sɛ wɔka awieeɛ pɔint ne mfimfini pɔint nyinaa ho asɛm a, wɔmfa { $attributes } nyɛ hwee

line-segment-midpoint-offset-without-midpoint = midpointOffset nyɛ hwee sɛ mfimfini pɔint nni hɔ a

## `<line>`

line-points-undetermined-dimensions = Nsensanee no fa pɔint a wɔnhunu wɔn tɛtrɛtɛ so.

line-points-too-few-dimensions = Ɛsɛ sɛ nsensanee no fa pɔint a wɔwɔ tɛtrɛtɛ mmienu firi aseɛ so.

line-points-depend-on-variables = Nsensanee no fa pɔint a wɔgyina nsakraeɛ so: { $variables }.

line-equation-invalid-format = Nhyehyɛeɛ no nteɛ mma nsensanee kyekyeremu wɔ nsakraeɛ { $variable1 } ne { $variable2 } mu.

## `<ray>`

ray-overprescribed-through = Wɔde through, endpoint ne direction nyinaa akyerɛ nsensanee-kwan no. Wɔmfa through a wɔkaeɛ no nyɛ hwee.

ray-dimension-mismatch = numDimensions nhyia wɔ nsensanee-kwan no mu.

## `<vector>`

vector-overprescribed-head = Wɔde head, tail ne displacement nyinaa akyerɛ vɛkta no. Wɔmfa head a wɔkaeɛ no nyɛ hwee.

vector-dimension-mismatch = numDimensions nhyia wɔ vɛkta no mu.

## Attracting and constraining

attract-to-without-nearest-point = Ɛntumi ntwe nkɔ `<{ $component }>` so ɛfiri sɛ ɔnni tebea nsakraeɛ nearestPoint.

constrain-to-without-nearest-point = Ɛntumi nkyekyere nkɔ `<{ $component }>` so ɛfiri sɛ ɔnni tebea nsakraeɛ nearestPoint.

constrain-to-interior-without-nearest-point = Ɛntumi nkyekyere nkɔ `<{ $component }>` mu ɛfiri sɛ ɔnni tebea nsakraeɛ nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = Wɔmfa labelPosition nyɛ hwee wɔ choiceInput a ɛnyɛ layin baako so

## Ordering children by index

choice-input-indices-count-mismatch = Wɔmfa indɛks a wɔkaeɛ nyɛ hwee wɔ choiceInput ho ɛfiri sɛ indɛks dodoɔ ne choice mma dodoɔ nhyia.

pretzel-indices-count-mismatch = Wɔmfa indɛks a wɔkaeɛ nyɛ hwee wɔ problem ho ɛfiri sɛ indɛks dodoɔ ne problem mma dodoɔ nhyia.

shuffle-indices-count-mismatch = Wɔmfa indɛks a wɔkaeɛ nyɛ hwee wɔ shuffle ho ɛfiri sɛ indɛks dodoɔ ne nneɛma dodoɔ nhyia.

indices-ignored-out-of-range = Wɔmfa indɛks a wɔkaeɛ nyɛ hwee wɔ { $component } ho ɛfiri sɛ indɛks bi wɔ ɛfa a wɔatwa no akyi.

pretzel-indices-repeated = Wɔmfa indɛks a wɔkaeɛ nyɛ hwee wɔ pretzel ho ɛfiri sɛ wɔasan aka indɛks bi.

pretzel-circuit-first-index = Wɔmfa indɛks a wɔkaeɛ nyɛ hwee wɔ pretzel circuit mu ɛfiri sɛ ɛsɛ sɛ indɛks a ɛdi kan yɛ 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Sɛ `<{ $component }>` bɛyɛ adwuma ne nkyerɛwee suban mma a, ɛsɛ sɛ wɔka su `type` ho asɛm.

invalid-type-defaulting-to-math = type { $type } nteɛ mma adeɛ { $component }. Ɛsɛ sɛ ɛyɛ math, text, number anaa boolean. Wɔde math sisi ananmu.

string-not-valid-component-to-arrange = Nkyerɛwee "{ $value }" nyɛ { $component } adeɛ a ɛteɛ. Wɔmfa nyɛ hwee.

## Types and variables

invalid-type-defaulting-to-number = type { $type } nteɛ, wɔde number sisi type ananmu.

invalid-variable-value = Nsakraeɛ gyinaboɔ nteɛ: `{ $value }`

## Variants

variant-index-must-be-number = Ɛsɛ sɛ suban indɛks { $index } yɛ nɔma

variant-index-must-be-integer = Ɛsɛ sɛ suban indɛks { $index } yɛ nɔma mua

## `<sideBySide>`

side-by-side-absolute-widths = Wɔnyɛɛ `<{ $component }>` a nsusuiɛ pɔtee wɔ mu bi da. Wɔde tɛtrɛtɛ no si nkyɛmu so.

side-by-side-absolute-margins = Wɔnyɛɛ `<{ $component }>` a nsusuiɛ pɔtee wɔ mu bi da. Wɔde nkyɛn no si nkyɛmu so.

side-by-side-no-block-child = `<{ $component }>` nteɛ: ɛsɛ sɛ ɛwɔ blɔk suban ɔba baako firi aseɛ.

## `<label>`

label-for-ignored-on-graphical = Wɔmfa su `for` a ɛwɔ mfoni `<label>` so nyɛ hwee.

label-for-must-resolve-to-one = Ɛsɛ sɛ su `for` a ɛwɔ `<label>` so kyerɛ adeɛ baako pɛ.

label-for-unresolved = Su `for` a ɛwɔ `<label>` so antumi ankyerɛ adeɛ biara.

label-for-answer-with-authored-inputs = Su `for` a ɛwɔ `<label>` so kyerɛ `<answer>` a ɔwɔ nsɛm-hyɛmu a wɔatwerɛ; kyerɛ nsɛm-hyɛmu no ankasa.

label-for-answer-without-input = Su `for` a ɛwɔ `<label>` so kyerɛ `<answer>` a ɔnni nsɛm-hyɛmu a wɔbɛto no din.

label-for-must-reference-input-or-answer = Ɛsɛ sɛ su `for` a ɛwɔ `<label>` so kyerɛ nsɛm-hyɛmu anaa mmuaeɛ.

## Accessibility

accessibility-short-description-or-decorative = Nkɔmu-kwan ho nti, ɛsɛ sɛ `<{ $component }>` wɔ nkyerɛaseɛ tiawa anaasɛ wɔka sɛ ɔyɛ nsiesie deɛ.

accessibility-video-short-description = Nkɔmu-kwan ho nti, ɛsɛ sɛ `<video>` wɔ nkyerɛaseɛ tiawa.

accessibility-input-short-description-or-label = Nkɔmu-kwan ho nti, ɛsɛ sɛ `<{ $component }>` wɔ nkyerɛaseɛ tiawa anaa din.

accessibility-answer-input-short-description-or-label = Nkɔmu-kwan ho nti, ɛsɛ sɛ `<answer>` a ɔbɔ nsɛm-hyɛmu wɔ nkyerɛaseɛ tiawa anaa din.

accessibility-short-description-contains-math = Ɛnsɛ sɛ akontabuo nneɛma sɛ `<{ $component }>` wɔ nkyerɛaseɛ tiawa no mu. Fa nsɛm ka akontabuo biara ho asɛm.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } nsonsonoeɛ no nnɔɔso mma ɔfa ti nkyerɛwee (esum tebea) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ɛsɛ sɛ ɛyɛ { $threshold }:1 firi aseɛ).
       *[other] { $colorName } nsonsonoeɛ no nnɔɔso mma ɔfa ti nkyerɛwee ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ɛsɛ sɛ ɛyɛ { $threshold }:1 firi aseɛ).
    }

## `<circle>`

circle-through-points-non-numerical = Wɔnyɛɛ `<circle>` a ɛfa pɔint { $count } so bi da wɔ berɛ a saa pɔint no nni nɔma gyinaboɔ.

circle-too-many-through-points = Ɛntumi mmu kanko a ɛfa pɔint 3 boro so ho akontaa.

circle-overprescribed-radius-center-points = Ɛntumi mmu kanko a wɔaka ne rediɔs, ne mfimfini ne pɔint a ɛfa so nyinaa ho asɛm ho akontaa.

circle-center-with-multiple-points = Ɛntumi mmu kanko a wɔaka ne mfimfini ho asɛm na ɛfa pɔint 1 boro so ho akontaa.

circle-radius-too-small = Ɛntumi mmu kanko ho akontaa: ɛfiri sɛ pɔint mmienu no ntam kwan yɛ { $distance }, rediɔs { $radius } a wɔkaeɛ no sua dodo.

circle-radius-with-many-points = Ɛntumi mmɔ kanko a ɛfa pɔint mmienu boro so a rediɔs a wɔkaeɛ ka ho.

circle-invalid-center-or-through-points = Kanko no mfimfini anaa pɔint a ɛfa so no nteɛ.

circle-radius-center-with-multiple-points = Ɛntumi mmu kanko a wɔaka ne mfimfini ho asɛm na ɛfa pɔint 1 boro so no rediɔs ho akontaa.

circle-change-radius-non-numerical = Ɛntumi nsesa kanko a ɛfa pɔint a wɔnni nɔma gyinaboɔ so no rediɔs

circle-radius-with-points-non-numerical = Ɛntumi mmɔ kanko a ɛfa pɔint baako boro so a rediɔs a wɔkaeɛ ka ho wɔ berɛ a nɔma gyinaboɔ nni hɔ.

circle-change-center-non-numerical = Wɔnsesaa kanko a ɛfa pɔint a wɔnni nɔma gyinaboɔ so no mfimfini bi da.

## `<function>`

function-domain-insufficient-dimensions = Fankshɔn no beaeɛ tɛtrɛtɛ nnɔɔso. Beaeɛ no wɔ ntam { $intervals } nanso fankshɔn no wɔ nsɛm-hyɛmu { $inputs }.

function-domain-invalid-format = Fankshɔn beaeɛ nhyehyɛeɛ nteɛ.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Wɔmfa fankshɔn no soro pɔint a ɛnyɛ nɔma no nyɛ hwee.
        [minimum] Wɔmfa fankshɔn no fam pɔint a ɛnyɛ nɔma no nyɛ hwee.
        [extremum] Wɔmfa fankshɔn no ano pɔint a ɛnyɛ nɔma no nyɛ hwee.
        [point] Wɔmfa fankshɔn no pɔint a ɛnyɛ nɔma no nyɛ hwee.
        [slope] Wɔmfa fankshɔn no nkyeaeɛ a ɛnyɛ nɔma no nyɛ hwee.
       *[other] Wɔmfa fankshɔn no { $type } a ɛnyɛ nɔma no nyɛ hwee.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Wɔmfa fankshɔn no soro pɔint a hwee nni mu no nyɛ hwee.
        [minimum] Wɔmfa fankshɔn no fam pɔint a hwee nni mu no nyɛ hwee.
        [extremum] Wɔmfa fankshɔn no ano pɔint a hwee nni mu no nyɛ hwee.
        [point] Wɔmfa fankshɔn no pɔint a hwee nni mu no nyɛ hwee.
       *[other] Wɔmfa fankshɔn no { $type } a hwee nni mu no nyɛ hwee.
    }

function-points-too-close = Fankshɔn no wɔ pɔint mmienu a ɛbɛn ho dodo. Wɔntumi nkyerɛ fankshɔn no aseɛ.

function-iterates-input-output-mismatch = Fankshɔn no tumi san yɛ ne ho bio bere a nsɛm-hyɛmu dodoɔ ne deɛ ɛfiri mu ba dodoɔ yɛ pɛ. Fankshɔn yi wɔ nsɛm-hyɛmu { $inputs } ne deɛ ɛfiri mu ba { $outputs }.

## `<sequence>`

sequence-invalid-length = Nsatoa no tenten nteɛ. Ɛsɛ sɛ ɛyɛ nɔma mua a ɛnyɛ fam-nɔma.

sequence-invalid-step = Nsatoa no anammɔn nteɛ. Wɔ { $type } suban nsatoa mu no, ɛsɛ sɛ ɛyɛ nɔma.

sequence-invalid-endpoint-number = Nɔma nsatoa no "{ $attribute }" nteɛ. Ɛsɛ sɛ ɛyɛ nɔma.

sequence-invalid-endpoint-letters = Nkyerɛwde nsatoa no "{ $attribute }" nteɛ. Ɛsɛ sɛ ɛyɛ nkyerɛwde.

sequence-invalid-endpoint = Nsatoa no "{ $attribute }" nteɛ.

select-from-sequence-coprime-not-numbers = Wɔmfa coprime nyɛ hwee ɛfiri sɛ ɛnyɛ nɔma na wɔreyi

select-from-sequence-coprime-with-exclude-combinations = Wɔmfa coprime nyɛ hwee ɛfiri sɛ wɔaka excludeCombinations ho asɛm

## Resolving a `target`

target-not-found = target nteɛ wɔ `<{ $source }>` mu: wɔanhunu deɛ ɛkyerɛ no.

target-state-variable-not-found = target nteɛ wɔ `<{ $source }>` mu: wɔanhunu tebea nsakraeɛ a ne din yɛ "{ $property }" wɔ `<{ $component }>` mu.

## `<odeSystem>`

ode-system-variables-match-independent = Ɛsɛ sɛ `<odeSystem>` nsakraeɛ no yɛ soronko firi nsakraeɛ a ɛgyina ne ho so no ho.

ode-system-duplicate-variable-names = Ɛntumi nkyerɛ ODE RHS fankshɔn aseɛ berɛ a nsakraeɛ din bi asan aba.

ode-system-rhs-function-error = Ɛntumi nkyerɛ ODE RHS fankshɔn aseɛ. Mfomsoɔ sii berɛ a wɔrebɔ mathjs fankshɔn no.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ɛntumi nkyerɛ nsensanee { $count } ntam kɔn aseɛ

angle-invalid-through-point = Pɔint no nteɛ wɔ `<angle>` through mu

parabola-vertex-too-many-points = Wɔnyɛɛ parabola a ɔwɔ soro pɔint na ɛfa pɔint 1 boro so bi da.

parabola-too-many-points = Wɔnyɛɛ parabola a ɛfa pɔint 3 boro so bi da.

intersection-too-many-items = Wɔnyɛɛ nneɛma mmienu boro so ntwitwaeɛ bi da

## Other math components

ionic-compound-not-two-ions = Wɔnyɛɛ ayɔn nkabom a ɛboro ayɔn mmienu so bi da.

ionic-compound-needs-cation-and-anion = Wɔyɛɛ ayɔn nkabom maa katayɔn baako ne anayɔn baako pɛ.

solve-equations-cannot-evaluate = Ɛntumi nnyina kyekyeremu no ano ɛfiri sɛ wɔantumi ammu ho akontaa: { $equation }

math-operators-operand-number-required = Ɛsɛ sɛ wɔka operandNumber ho asɛm berɛ a wɔreyi akontabuo adwumayɛfoɔ.

eigen-decomposition-failed = Ɛntumi mmu matriks no eigen gyinaboɔ ho akontaa

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: paramɛta { $parameters } nni nhyehyɛeɛ no mu, enti wɔbɛhyia hwee daa.

## `<graph>`

graph-grid-invalid = `<graph>`: ɛntumi nkyerɛ grid="{ $grid }" aseɛ. Ɛsɛ sɛ ɛyɛ none, medium, dense, anaa nɔma pɔsitif mmienu a ntam da wɔn ntam, sɛ grid="1 0.5". Wɔntwe girid biara.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure kyerɛfoɔ no nnye xLabelPosition="left" ntom; nifa fa nneyɛeɛ na ɛreyɛ adwuma.

prefigure-y-label-position-unsupported = `<graph>`: prefigure kyerɛfoɔ no nnye yLabelPosition="bottom" ntom; soro fa nneyɛeɛ na ɛreyɛ adwuma.

prefigure-invalid-axis-bounds = `<graph>`: aksis ano nteɛ mma prefigure nsakraeɛ; bbox (-10,-10,10,10) na ɛreyɛ adwuma.

prefigure-invalid-width = `<graph>`: tɛtrɛtɛ no nteɛ mma prefigure nsakraeɛ; mfoni tɛtrɛtɛ 425 na ɛreyɛ adwuma.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio nteɛ mma prefigure nsakraeɛ; nsusuiɛ 1 na ɛreyɛ adwuma.

prefigure-grid-spacing-too-fine = `<graph>`: girid ntam no sua dodo mma aksis ano no; wɔgyaee girid wɔ prefigure kyerɛfoɔ no mu.

prefigure-annotations-not-rendered = `<graph>`: wɔrenkyerɛ nkaeɛ berɛ a PreFigure kyerɛfoɔ nyɛ adwuma.

multiple-annotations-children = Wɔhunuu `<annotations>` mma pii wɔ `<graph>` mu; wɔmfa wɔn nyinaa nyɛ hwee gye deɛ ɔtwa toɔ.

## Referring to other components

copy-unrecognized-component-type = Ɛntumi ntrɛ anaa ɛnkopi adeɛ suban a wɔnnim: { $type }.

copy-prop-not-found = Wɔanhunu su { $property } wɔ { $component } suban adeɛ so

collect-no-source = Wɔanhunu fibea biara mma collect.

collect-invalid-component-type = Ɛntumi mmoaboa `<{ $component }>` suban nneɛma ano ɛfiri sɛ ɛyɛ adeɛ suban a ɛnteɛ.

reference-index-unavailable = Ɛntumi nkyerɛ indɛks `{ $reference }`

## `<callAction>`

component-action-unavailable = Ɛntumi mfrɛ { $action } wɔ adeɛ `{ $reference }` so

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Nsɛm no nhyehyɛeɛ nteɛ. Santene no tenten nyɛ pɛ. Wɔhunuu no wɔ componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Adum din bi asan aba nsɛm no mu. Wɔhunuu no wɔ componentIdx :{ $componentIdx }

data-frame-missing-column-name = Adum din bi nni nsɛm no mu. Wɔhunuu no wɔ componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Mmuaeɛ yi award baako gyina mmuaeɛ a answer tagi no ankasa de kɔeɛ so, na ɛno bɛma nneyɛeɛ a wɔnhwɛ kwan aba.

answer-max-num-attempts-in-section-wide-check-work = Sɛ wode `maxNumAttempts` si `<answer>` a ɛwɔ adaka a `sectionWideCheckWork` wɔ so mu so a, ɛnyɛ hwee, ɛfiri sɛ saa adaka no na ɛhwɛ mmɔdenbɔ dodoɔ so. Fa `maxNumAttempts` si adaka no ankasa so.

nested-section-wide-check-work-max-num-attempts = Sɛ wode `maxNumAttempts` si adaka a `sectionWideCheckWork` wɔ so a ɛwɔ adaka foforɔ a `sectionWideCheckWork` nso wɔ so mu so a, ɛnyɛ hwee, ɛfiri sɛ adaka a ɛwɔ akyire no na ɛhwɛ mmɔdenbɔ dodoɔ so. Fa `maxNumAttempts` si adaka a ɛwɔ akyire no so.

answer-attributes-need-symbolic-equality = Su { $attributes } renyɛ hwee sɛ wɔansi symbolicEquality a.

answer-invalid-type = Suban no nteɛ mma mmuaeɛ no: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ɛfiri sɛ adeɛ `<{ $component }>` nni din no, wɔntumi mfa nyɛ module su

module-attribute-name-already-defined = Wɔntumi mfa adeɛ `<{ $component } name="{ $name }">` nyɛ module su ɛfiri sɛ adeɛ suban `<module>` wɔ su a ne din yɛ "{ $name }" dada.

conditional-content-condition-ignored = Wɔmfa su `condition` nyɛ hwee wɔ adeɛ `<conditionalContent>` a ɔwɔ case anaa else mma so.

slider-markers-type-mismatch = Nsɛnkyerɛnne suban ne slider suban nhyia.

pretzel-problem-needs-statement-and-answer = pretzel nteɛ: ɛsɛ sɛ `<problem>` biara wɔ `<statement>` baako ne `<answer>` baako.

pretzel-circuit-first-problem-distractor = pretzel nteɛ: wɔ mode="circuit" mu no, `<problem>` a ɛdi kan no ntumi nyɛ nnaadaa deɛ.

## Attribute values

attribute-invalid-values = Gyinaboɔ { $values } nteɛ mma su `{ $attribute }`; wɔmfa nyɛ hwee.

attribute-must-be-references = Gyinaboɔ `{ $value }` nteɛ mma su `{ $attribute }`. Ɛsɛ sɛ su no yɛ nkyerɛ a ɛfiri `$` aseɛ.

math-input-invalid-function-names = <mathInput>: wɔmfa fankshɔn din a ɛnteɛ a ɛwɔ { $attribute } mu nyɛ hwee: { $names }. Ɛsɛ sɛ din biara kyerɛ-fa wɔ nkyerɛwde 2 firi aseɛ (nkyerɛwde anaa nsensanee); `|<mathspeak alternative>` bɛtumi adi akyire.

## Building components from the source

component-type-invalid = Adeɛ suban no nteɛ: `<{ $componentType }>`

attribute-repeated = Wɔntumi nsan nka su { $attribute } bio.

attribute-invalid-for-component = Su "{ $attribute }" nteɛ mma `<{ $componentType }>` suban adeɛ.

## Style definition contrast

style-definition-insufficient-contrast =
    Nsiesie nkyerɛaseɛ { $styleNumber } nsonsonoeɛ nnɔɔso mma { $context ->
        [text-on-background] nkyerɛwee kɔla ne akyire kɔla
        [high-contrast] nsonsonoeɛ kɛseɛ kɔla ne asaase no
        [line] nsensanee kɔla ne asaase no
        [marker] nsɛnkyerɛnne kɔla ne asaase no
       *[text-on-canvas] nkyerɛwee kɔla ne asaase no
    }{ $mode ->
        [dark] { " (esum tebea)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ɛsɛ sɛ ɛyɛ { $threshold }:1 firi aseɛ).

style-definition-dark-mode-text-background-contrast =
    Ɛwom sɛ nsiesie nkyerɛaseɛ { $styleNumber } kaa kɔla a nsonsonoeɛ dɔɔso wɔ hann tebea mu ho asɛm deɛ, nanso esum tebea kɔla a ɛfiri mu baeɛ no nsonsonoeɛ nnɔɔso mma nkyerɛwee kɔla ne akyire kɔla ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ɛsɛ sɛ ɛyɛ { $threshold }:1 firi aseɛ). { $suggestion ->
        [available] Sɛ wopɛ sɛ nsonsonoeɛ dɔɔso wɔ esum tebea mu a, ma hann tebea nsonsonoeɛ no nkɔ soro (sɛ nhwɛsoɔ, si { $lightAttribute }="{ $lightColor }") anaasɛ sesa esum tebea kɔla no (sɛ nhwɛsoɔ, si { $darkAttribute }="{ $darkColor }").
       *[none] Sɛ wopɛ sɛ nsonsonoeɛ dɔɔso wɔ esum tebea mu a, ma hann tebea nsonsonoeɛ no nkɔ soro anaasɛ sesa kɔla a ɛfiri mu ba no wɔ textColorDarkMode ne/anaa backgroundColorDarkMode mu.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ɛwom sɛ nsiesie nkyerɛaseɛ { $styleNumber } kaa nkyerɛwee kɔla a nsonsonoeɛ dɔɔso wɔ hann tebea mu ho asɛm deɛ, nanso esum tebea nkyerɛwee kɔla a ɛfiri mu baeɛ no nsonsonoeɛ nnɔɔso wɔ asaase no so ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ɛsɛ sɛ ɛyɛ { $threshold }:1 firi aseɛ). { $suggestion ->
        [available] Sɛ wopɛ sɛ nsonsonoeɛ dɔɔso wɔ esum tebea mu a, ma hann tebea nsonsonoeɛ no nkɔ soro (sɛ nhwɛsoɔ, si textColor="{ $lightColor }") anaasɛ sesa esum tebea kɔla no (sɛ nhwɛsoɔ, si textColorDarkMode="{ $darkColor }").
       *[none] Sɛ wopɛ sɛ nsonsonoeɛ dɔɔso wɔ esum tebea mu a, ma hann tebea nsonsonoeɛ no nkɔ soro anaasɛ sesa kɔla a ɛfiri mu ba no wɔ textColorDarkMode mu.
    }

section-multiple-style-palettes = Ɔfa bi tumi yi <stylePalette> baako pɛ; deɛ ɔtwa toɔ na ɛyɛ adwuma.

## Unique variants

variant-num-to-select-not-non-negative-integer = ɛntumi nhunu { $component } suban soronko ɛfiri sɛ numToSelect nyɛ nɔma mua a ɛnyɛ fam-nɔma.

variant-num-to-select-not-constant-number = ɛntumi nhunu { $component } suban soronko ɛfiri sɛ numToSelect nyɛ nɔma a ɛsesa.

variant-with-replacement-not-constant-boolean = ɛntumi nhunu { $component } suban soronko ɛfiri sɛ withReplacement nyɛ buulian a ɛnsesa.

variant-select-weight-disables-unique = Sɛ ɔyi bi wɔ selectWeight anaa selectForVariants a, wɔto select suban soronko no mu

variant-coprime-undetermined = ɛntumi nhunu { $component } suban soronko ɛfiri sɛ ɛntumi nsi so dua sɛ coprime yɛ atorɔ daa.

variant-attribute-not-constant = ɛntumi nhunu { $component } suban soronko ɛfiri sɛ { $attribute } nnyina pintinn.

variant-attribute-not-number = ɛntumi nhunu { $component } suban soronko ɛfiri sɛ { $attribute } nyɛ nɔma.

variant-attribute-wrong-type-for-sequence =
    ɛntumi nhunu { $component } { $type } suban soronko ɛfiri sɛ { $attribute } nyɛ { $expected ->
        [letters-combination] nkyerɛwde nkabom
        [math-expression] akontabuo nkyerɛwee a ɛteɛ
        [integer] nɔma mua
       *[number] nɔma
    }.

variant-length-not-integer = ɛntumi nhunu { $component } suban soronko ɛfiri sɛ length nyɛ nɔma mua.

variant-sort-not-implemented = wɔnyɛɛ { $component } suban soronko a sort ka ho bi da

variant-exclude-combinations-not-implemented = wɔnyɛɛ { $component } suban soronko a excludeCombinations ka ho bi da

variant-math-exclude-not-implemented = wɔnyɛɛ { $component } math suban soronko a exclude ka ho bi da

variant-non-constant-exclude-not-implemented = wɔnyɛɛ { $component } suban soronko a exclude a ɛnnyina pintinn ka ho bi da

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure kyerɛfoɔ no nnye ntom; wɔtoo aseni no twene.

prefigure-descendant-invalid-geometry = { $subject }: sukuu-nsusuiɛ a ɛnni ano anaa ɛnwieeɛ; wɔtoo aseni no twene.

prefigure-curve-label-omitted = { $subject }: din nnyɛ adwuma wɔ nkyea nneɛma a wɔasesa so; wɔgyaee din no.

prefigure-curve-unsupported-definition-type = { $subject }: nkyea fankshɔn nkyerɛaseɛ suban '{ $definitionType }' nnye ntom; wɔtoo aseni no twene.

prefigure-region-flip-functions-unsupported = { $subject }: su flipFunctions a ɛwɔ regionBetweenCurves so nnye ntom; wɔtoo aseni no twene.

prefigure-region-non-formula-child = { $subject }: formula suban mma fankshɔn nko ara na wɔgye tom wɔ regionBetweenCurves mu; wɔtoo aseni no twene.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' nnye ntom mma { $labelKind ->
        [line-family] nsensanee abusua din
       *[point] pɔint din
    }; PreFigure nhyehyɛeɛ na ɛreyɛ adwuma.

prefigure-fill-style-unsupported = { $subject }: PreFigure nnye mahyɛ-suban '{ $fillStyle }' ntom; ɛsan kɔ kɔla baako mahyɛ so.

prefigure-line-style-unknown = { $subject }: wɔnnim nsensanee suban '{ $lineStyle }' na wɔgyaee wɔ PreFigure adwuma mu.

prefigure-marker-style-mapped-to-diamond = { $subject }: wɔde nsɛnkyerɛnne suban '{ $markerStyle }' ahyia PreFigure suban 'diamond'.

prefigure-marker-style-unsupported = { $subject }: PreFigure nnye nsɛnkyerɛnne suban '{ $markerStyle }' ntom; suban a ɛwɔ hɔ dada na ɛreyɛ adwuma.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` nteɛ; ɛntumi nhunu deɛ ɛkyerɛ. Wɔgyaee nkaeɛ no.

annotation-ref-multiple-targets = `<annotation>`: `ref` kyerɛɛ nneɛma pii; deɛ ɛdi kan na ɛreyɛ adwuma.

annotation-ref-outside-graph = `<annotation>`: `ref` nteɛ; deɛ ɛkyerɛ no wɔ graf a ɛkura no akyi. Wɔgyaee nkaeɛ no.

annotation-ref-unsupported-target = `<annotation>`: `ref` nteɛ; deɛ ɛkyerɛ no nyɛ mfoni adeɛ a wɔgye tom wɔ prefigure nsakraeɛ mu. Wɔgyaee nkaeɛ no.

annotation-text-missing = `<annotation>`: `text` nni hɔ anaa hwee nni mu; nkyerɛwee a hwee nni mu na ɛreba.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Wɔahunu kanko-gyinabea.
       *[other] Wɔahunu kanko-gyinabea a ɛfa adeɛ `<{ $componentType }>` ho.
    }

reference-no-referent = Wɔanhunu biribiara mmaa nkyerɛ: `{ $reference }`

reference-multiple-referents = Wɔhunuu nneɛma pii maa nkyerɛ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Nhyehyɛeɛ no nteɛ mma `<{ $componentType }>` su { $attribute }.

children-invalid = Mma no nteɛ mma `<{ $componentType }>`: Wɔhunuu mma a wɔnteɛ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Gyinaboɔ `{ $value }` nteɛ mma su `{ $attribute }`, gyinaboɔ `{ $default }` na ɛreyɛ adwuma

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Wɔanhunu DoenetML nkyerɛaseɛ { $version }.
       *[other] Wɔanhunu DoenetML nkyerɛaseɛ { $version }. Ɛsan kɔ nkyerɛaseɛ { $fallback } so
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML nteɛ: { $content }

parse-tag-missing-close-tag = DoenetML nteɛ: Tagi `{ $tag }` nni to-mu tagi. Na wɔhwɛ kwan sɛ tagi a ɛto ne ho mu anaa tagi `</{ $tagName }>`.

parse-tag-error = DoenetML nteɛ: Mfomsoɔ wɔ tagi `<{ $tagName }>` mu

parse-attribute-missing-value = DoenetML nteɛ: Ɛte sɛ deɛ su `{ $attribute }` a ɛnteɛ no nni gyinaboɔ.

parse-attribute-invalid = DoenetML nteɛ: Su `{ $attribute }` nteɛ

parse-attribute-value-invalid = DoenetML nteɛ: Su gyinaboɔ `{ $value }` nteɛ

parse-attribute-value-quote-mismatch = DoenetML nteɛ: Su gyinaboɔ `{ $value }` nteɛ. Kasa-nsɛnkyerɛnne no nhyia. Ɛte sɛ deɛ `{ $quote }` ayera

parse-open-tag-name-missing = DoenetML nteɛ: Wɔhunuu tagi a ɛnni din, sɛ `<`

parse-tag-not-closed = DoenetML nteɛ: Wɔanto tagi `{ $tag }` mu (ɛte sɛ deɛ `>` ayera).

parse-self-closing-tag-name-missing = DoenetML nteɛ: Wɔhunuu tagi a ɛnni din `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML nteɛ: Wɔanto tagi `{ $tag }` mu (ɛte sɛ deɛ `/>` ayera).

parse-tag-invalid-attributes = DoenetML nteɛ: Tagi `{ $tag }` nteɛ. Ebia su a ɛnteɛ wɔ mu.

parse-close-tag-name-missing = DoenetML nteɛ: Wɔhunuu to-mu tagi a ɛnni din, sɛ `</`

parse-attribute-value-unquoted = Ɛsɛ sɛ su gyinaboɔ hyɛ kasa-nsɛnkyerɛnne mu: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML nteɛ: Wɔhunuu to-mu tagi `{ $tag }`, nanso bue-tagi a ɛne no hyia nni hɔ

parse-close-tag-mismatched = DoenetML nteɛ: To-mu tagi no nhyia. Na wɔhwɛ kwan `</{ $expected }>`. Wɔhunuu `{ $found }`

parser-node-unconvertible = Wɔantumi ansesa nɔdi { $node } ankɔ Dast nɔdi mu.

## Names

name-attribute-invalid =
    Su name='{ $name }' nteɛ. { $reason ->
        [characters] Din tumi nya nkyerɛwde, nɔma, ase-nsensanee anaa nsensanee nko ara.
       *[start] Ɛsɛ sɛ din firi nkyerɛwde aseɛ.
    }

component-name-invalid-start = Adeɛ din "{ $name }" nteɛ. Ɛsɛ sɛ din firi nkyerɛwde aseɛ.

## `<answer>` sugar

answer-video-watched-missing-video = Ɛsɛ sɛ videoWatched suban mmuaeɛ wɔ su video

answer-video-watched-video-not-reference = Ɛsɛ sɛ videoWatched suban mmuaeɛ wɔ su video a ɛyɛ nkyerɛ

answer-name-not-single-text = Ɛsɛ sɛ mmuaeɛ su name wɔ text ɔba baako pɛ

## Referencing another document

external-doenetml-recursion-limit = Ɛntumi nnya abɔntene DoenetML ɛfiri sɛ ɛsan kɔ ne ho so dodo. So nkyerɛ kanko bi wɔ hɔ?

external-doenetml-unavailable = Ɛntumi nnya DoenetML mfiri { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML a wɔnyaa no firii { $attribute }="{ $uri }" nteɛ: ɔne adeɛ suban "{ $componentType }" nhyia

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Su `{ $from }` abɔ dada; fa `{ $to }` si ananmu.
       *[other] [deprecation] Su `{ $from }` a ɛwɔ `<{ $component }>` so abɔ dada; fa `{ $to }` si ananmu.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Su `{ $from }` abɔ dada na wɔmfa nyɛ hwee ɛfiri sɛ wɔaka `{ $to }` nso ho asɛm.
       *[other] [deprecation] Su `{ $from }` a ɛwɔ `<{ $component }>` so abɔ dada na wɔmfa nyɛ hwee ɛfiri sɛ wɔaka `{ $to }` nso ho asɛm.
    }

deprecated-attribute-ignored = [deprecation] Su `{ $attribute }` a ɛwɔ `<{ $component }>` so abɔ dada na wɔmfa nyɛ hwee.

deprecated-attribute-to-child = [deprecation] Su `{ $attribute }` a ɛwɔ `<{ $component }>` so abɔ dada; fa `<{ $child }>` ba si ananmu.


## Language coverage

pluralize-english-only = `<pluralize>` tumi yɛ dodoɔ wɔ Borɔfo nko ara mu, enti ne nkyerɛwee no ka hɔ saa ara wɔ krataa a wɔtwerɛeɛ wɔ { $locale } mu. Twerɛ dodoɔ suban no ankasa, anaasɛ fa si su `pluralForm` mu.


## Checking against the schema

schema-element-unrecognized = Adeɛ `<{ $tag }>` nyɛ Doenet adeɛ a wɔnim.

schema-element-not-allowed-at-root = Wɔmma adeɛ `<{ $tag }>` ho kwan wɔ krataa no ntini so.

schema-element-not-allowed-inside = Wɔmma adeɛ `<{ $tag }>` ho kwan wɔ `<{ $parent }>` mu.

schema-attribute-unrecognized = Adeɛ `<{ $tag }>` nni su a ne din yɛ `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ɛsɛ sɛ adeɛ `<{ $tag }>` su `{ $attribute }` yɛ nhwehwɛmu a adeɛ biara a ɛwɔ mu yɛ yeinom bi: { $allowed }
       *[other] Ɛsɛ sɛ adeɛ `<{ $tag }>` su `{ $attribute }` yɛ yeinom bi: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Suban din no nteɛ mma select. Suban din { $variantName } wɔ ɔyi { $numOptions } mu nanso dodoɔ a wɔbɛyi yɛ { $numToSelect }.

select-variant-name-without-options = Wɔkaa suban bi ho asɛm maa select nanso wɔanka ɔyi biara ho asɛm mmaa suban din a ɛbɛtumi aba: { $variantName }.

select-variant-name-not-possible = Suban din { $variantName } a wɔkaa ho asɛm maa select no nyɛ suban din a ɛbɛtumi aba.

select-too-few-options = Ɛntumi nyi nneɛma { $numToSelect } mfiri { $numOptions } pɛ mu.

select-from-sequence-too-few-values = Ɛntumi nyi gyinaboɔ { $numToSelect } mfiri nsatoa a ne tenten yɛ { $length } mu.

select-from-sequence-indices-count-mismatch = Ɛsɛ sɛ indɛks dodoɔ a wɔkaa ho asɛm maa select no ne dodoɔ a wɔbɛyi hyia

select-from-sequence-indices-not-integers = Ɛsɛ sɛ indɛks a wɔkaa ho asɛm maa select nyinaa yɛ nɔma mua

select-from-sequence-index-excluded = Wɔkaa selectfromsequence indɛks a wɔayi afiri mu ho asɛm

select-from-sequence-indices-excluded-combination = Wɔkaa selectfromsequence indɛks a na ɛyɛ nkabom a wɔayi afiri mu ho asɛm

select-from-sequence-coprime-not-positive-integers = Ɛntumi nyi nɔma a wɔne wɔn ho nni kwan nkabom ɛfiri sɛ ɛnyɛ nɔma mua pɔsitif na wɔreyi.

select-from-sequence-coprime-common-factor = Ɛntumi nyi nɔma a wɔne wɔn ho nni kwan. Gyinaboɔ a ɛbɛtumi aba nyinaa wɔ ɔkyɛfoɔ baako. (Ɛsɛ sɛ gyinaboɔ a wɔkaa ho asɛm wɔ "from" anaa "to" mu no ne "step" nni kwan.)

select-from-sequence-coprime-single-number = Ɛntumi nyi nɔma a wɔne wɔn ho nni kwan nkabom mfiri nɔma baako a ɛnyɛ 1 mu.

select-from-sequence-excluded-too-many-combinations = Wɔayi nkabom no 70% boro so afiri selectFromSequence mu

select-from-sequence-coprime-none-found = Wɔantumi anyi nɔma a wɔne wɔn ho nni kwan. Gyinaboɔ a ɛbɛtumi aba nyinaa wɔ ɔkyɛfoɔ baako.

select-from-sequence-too-few-unique-values = Ɛntumi nyi gyinaboɔ soronko { $numToSelect } mfiri nsatoa a ne tenten yɛ { $numPossibleValues } mu

select-prime-numbers-too-few-values = Ɛntumi nyi gyinaboɔ { $numToSelect } mfiri nɔma a wɔnkyɛ no nhwehwɛmu a ne tenten yɛ { $numValues } mu

select-prime-numbers-values-count-mismatch = Ɛsɛ sɛ gyinaboɔ dodoɔ a wɔkaa ho asɛm maa select no ne dodoɔ a wɔbɛyi hyia

select-prime-numbers-values-not-prime = Ɛsɛ sɛ gyinaboɔ a wɔkaa ho asɛm maa select prime number nyinaa wɔ nɔma a wɔnkyɛ no nhwehwɛmu mu

select-prime-numbers-values-excluded-combination = selectPrimeNumbers gyinaboɔ a wɔkaa ho asɛm no na ɛyɛ nkabom a wɔayi afiri mu

select-prime-numbers-excluded-too-many-combinations = Wɔayi nkabom no 70% boro so afiri selectPrimeNumbers mu

select-random-combination-fluke = Ɛnnyɛ deɛ ɛtaa si, nanso wɔantumi anyi gyinaboɔ a wɔfa no kwa nkabom

select-random-value-fluke = Ɛnnyɛ deɛ ɛtaa si, nanso wɔantumi anyi gyinaboɔ a wɔfa no kwa
