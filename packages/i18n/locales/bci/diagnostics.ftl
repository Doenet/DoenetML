# Baoulé diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# See `content.ftl`'s header for orthography, plural-category behaviour, the
# Akan/Twi agreement comparison, the verbal-morphology caveat, and the
# vocabulary/loanword policy this catalog also follows.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# As in `locales/ak`, the messages here that separate a singular count from a
# plural one only in a grammatical agreement English marks and Baoulé does
# not — `$attributesCount`, `$valuesCount`, and the inner `$inputs`/`$outputs`
# selects of the two function messages — collapse to one flat wording and the
# count argument goes unused for agreement (it may still appear inside the
# sentence as a number). A select on a *symbolic* key rather than a count
# (`$mode`, `$context`, `$fallback`, `$isList`, `$expected`, `$labelKind`, a
# `$component`/`$componentType` of `none` versus a name) is kept with the same
# branches as English, because that is a choice of content, not of agreement.
#
# A line of the author's source is a «layin»; «liɲ», which `content.ftl` uses,
# is the geometric line a document draws.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = Sɛ be kan awieliɛ pwɛn nnyɔn'n i ndɛ'n, { $attributes } w'a yoman fɛ

line-segment-attributes-ignored-with-endpoint-and-midpoint = Sɛ be kan awieliɛ pwɛn nin afiɛn pwɛn kwlaa i ndɛ'n, { $attributes } w'a yoman fɛ

line-segment-midpoint-offset-without-midpoint = midpointOffset w'a yoman fɛ sɛ afiɛn pwɛn nunman

## `<line>`

line-points-undetermined-dimensions = Liɲ'n fa pwɛn mun mɔ be dimansiɔn'n w'a wunman i.

line-points-too-few-dimensions = Ɔ fata kɛ liɲ'n fa pwɛn mun mɔ be dimansiɔn ti nnyɔn annzɛ tra sɔ.

line-points-depend-on-variables = Liɲ'n fa pwɛn mun mɔ be gua varyabli ng'ɔ o wa: { $variables }.

line-equation-invalid-format = Liɲ'n i ekwasiɔn'n i sɛsalɛ timan kpa wɔ varyabli { $variable1 } nin { $variable2 } be nun.

## `<ray>`

ray-overprescribed-through = Be fa through, endpoint, nin direction kwlaa be sie liɲ-atin'n. Through mɔ be kannin'n, w'a yoman fɛ.

ray-dimension-mismatch = numDimensions timan kpa wɔ liɲ-atin'n nun.

## `<vector>`

vector-overprescribed-head = Be fa head, tail, nin displacement kwlaa be sie vɛktɛr'n. Head mɔ be kannin'n, w'a yoman fɛ.

vector-dimension-mismatch = numDimensions timan kpa wɔ vɛktɛr'n nun.

## Attracting and constraining

attract-to-without-nearest-point = Ɔ kwlá-man tɛ i nglo kɔ `<{ $component }>` su, kɛ mɔ nearestPoint tebe-varyabli'n nunman i wun.

constrain-to-without-nearest-point = Ɔ kwlá-man siesie i kɔ `<{ $component }>` su, kɛ mɔ nearestPoint tebe-varyabli'n nunman i wun.

constrain-to-interior-without-nearest-point = Ɔ kwlá-man siesie i kɔ `<{ $component }>` i wun lɔ, kɛ mɔ nearestPoint tebe-varyabli'n nunman i wun.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition w'a yoman fɛ wɔ choiceInput mɔ ɔ timan layin kunngba su'n i wun

## Ordering children by index

choice-input-indices-count-mismatch = Endisi mɔ be kannin be ndɛ'n, be w'a yoman fɛ wɔ choiceInput i wun kɛ mɔ endisi be dodo'n nin ɔyilɛ ba dodo'n be timan kunngba.

pretzel-indices-count-mismatch = Endisi mɔ be kannin be ndɛ'n, be w'a yoman fɛ wɔ problem i wun kɛ mɔ endisi be dodo'n nin problem ba dodo'n be timan kunngba.

shuffle-indices-count-mismatch = Endisi mɔ be kannin be ndɛ'n, be w'a yoman fɛ wɔ shuffle i wun kɛ mɔ endisi be dodo'n nin kɔmpozan ba dodo'n be timan kunngba.

indices-ignored-out-of-range = Endisi mɔ be kannin be ndɛ'n, be w'a yoman fɛ wɔ { $component } i wun kɛ mɔ endisi wie mun be o ekun mɔ be kunndɛli'n i ekun lɔ.

pretzel-indices-repeated = Endisi mɔ be kannin be ndɛ'n, be w'a yoman fɛ wɔ pretzel i wun kɛ mɔ endisi wie be sannin be ba ekun.

pretzel-circuit-first-index = Endisi mɔ be kannin be ndɛ'n, be w'a yoman fɛ wɔ pretzel circuit i wun kɛ mɔ ɔ fata kɛ endisi klikli'n ti 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Sɛ `<{ $component }>` bɛ di junman kpa nin nkyerɛwde-wafa mma'n, ɔ fata kɛ be kan `type` atribi'n i ndɛ.

invalid-type-defaulting-to-math = type { $type } timan kpa mma { $component } kɔmpozan'n. Ɔ fata kɛ ɔ ti math, text, number, annzɛ boolean. Be fa math be sie i osu.

string-not-valid-component-to-arrange = Nkyerɛwde "{ $value }" timan kɔmpozan ng'ɔ fata { $component } su'n. W'a yoman fɛ.

## Types and variables

invalid-type-defaulting-to-number = type { $type } timan kpa, be fa number be sie type i osu.

invalid-variable-value = Varyabli i valè timan kpa: `{ $value }`

## Variants

variant-index-must-be-number = Ɔ fata kɛ varyan endisi { $index } ti nɔmba

variant-index-must-be-integer = Ɔ fata kɛ varyan endisi { $index } ti nɔmba mua

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` w'a yoman kunndɛlɛ mma nsusuan mɔ ɔ syɛman'n. Be fa i akpasua'n be sie i relatif.

side-by-side-absolute-margins = `<{ $component }>` w'a yoman kunndɛlɛ mma nsusuan mɔ ɔ syɛman'n. Be fa i ekun'n be sie i relatif.

side-by-side-no-block-child = `<{ $component }>` timan kpa: ɔ fata kɛ ɔ wɔ blɔk-wafa ba kunngba likawlɛ.

## `<label>`

label-for-ignored-on-graphical = `for` atribi'n mɔ ɔ o `<label>` mɔ ɔ ti fɔto su'n, w'a yoman fɛ.

label-for-must-resolve-to-one = Ɔ fata kɛ `for` atribi'n mɔ ɔ o `<label>` su'n kle kɔmpozan kunngba pɛ.

label-for-unresolved = `for` atribi'n mɔ ɔ o `<label>` su'n w'a kwlá-man kle kɔmpozan fi.

label-for-answer-with-authored-inputs = `for` atribi'n mɔ ɔ o `<label>` su'n kle `<answer>` mɔ be klɛli i input mun kpa; kle input'n i wunngbɛn.

label-for-answer-without-input = `for` atribi'n mɔ ɔ o `<label>` su'n kle `<answer>` mɔ input fi nunman i wun mɔ be kwla to i dunman.

label-for-must-reference-input-or-answer = Ɔ fata kɛ `for` atribi'n mɔ ɔ o `<label>` su'n kle input annzɛ tɛlɛ.

## Accessibility

accessibility-short-description-or-decorative = Kɛ mɔ nun-tinlɛ ti'n, ɔ fata kɛ `<{ $component }>` wɔ nglɛlɛ kaan annzɛ be se kɛ ɔ ti sasalɛ like.

accessibility-video-short-description = Kɛ mɔ nun-tinlɛ ti'n, ɔ fata kɛ `<video>` wɔ nglɛlɛ kaan.

accessibility-input-short-description-or-label = Kɛ mɔ nun-tinlɛ ti'n, ɔ fata kɛ `<{ $component }>` wɔ nglɛlɛ kaan annzɛ dunman.

accessibility-answer-input-short-description-or-label = Kɛ mɔ nun-tinlɛ ti'n, ɔ fata kɛ `<answer>` mɔ ɔ yi input'n wɔ nglɛlɛ kaan annzɛ dunman.

accessibility-short-description-contains-math = Ɔ fataman kɛ akontabuo-kɔmpozan mun kɛ `<{ $component }>` sa be o nglɛlɛ kaan'n nun. Klɛ akontabuo'n kwlaa i wafa nglo ndɛ.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } nsanwlɛ'n sɔman akpasua ti nkyerɛwde'n (esu wafa) su ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ɔ fata kɛ ɔ ti { $threshold }:1 annzɛ tra sɔ).
       *[other] { $colorName } nsanwlɛ'n sɔman akpasua ti nkyerɛwde'n su ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ɔ fata kɛ ɔ ti { $threshold }:1 annzɛ tra sɔ).
    }

## `<circle>`

circle-through-points-non-numerical = B'a yoman `<circle>` mɔ ɔ fa pwɛn { $count } su likawlɛ i wafa mɔ pwɛn sɔ mun be nunman nɔmba valè.

circle-too-many-through-points = Ɔ kwlá-man bu wafa fɛfɛ mɔ ɔ fa pwɛn 3 tra sɔ.

circle-overprescribed-radius-center-points = Ɔ kwlá-man bu wafa fɛfɛ mɔ be kannin i reyɔn, i afiɛn, nin pwɛn ng'ɔ fa su'n be kwlaa be ndɛ.

circle-center-with-multiple-points = Ɔ kwlá-man bu wafa fɛfɛ mɔ be kannin i afiɛn ndɛ mɔ ɔ fa pwɛn kun tra sɔ.

circle-radius-too-small = Ɔ kwlá-man bu wafa fɛfɛ: kɛ mɔ pwɛn nnyɔn'n be afiɛn ntamu'n ti { $distance }'n ti'n, reyɔn { $radius } mɔ be kannin'n, ɔ ti kaan dan.

circle-radius-with-many-points = Ɔ kwlá-man yo wafa fɛfɛ mɔ ɔ fa pwɛn nnyɔn tra sɔ mɔ reyɔn mɔ be kannin'n ka su.

circle-invalid-center-or-through-points = Wafa fɛfɛ'n i afiɛn annzɛ pwɛn ng'ɔ fa su'n be timan kpa.

circle-radius-center-with-multiple-points = Ɔ kwlá-man bu wafa fɛfɛ mɔ be kannin i afiɛn ndɛ mɔ ɔ fa pwɛn kun tra sɔ'n i reyɔn.

circle-change-radius-non-numerical = Ɔ kwlá-man kaci wafa fɛfɛ mɔ i pwɛn mun be nunman nɔmba valè'n i reyɔn

circle-radius-with-points-non-numerical = Ɔ kwlá-man yo wafa fɛfɛ mɔ ɔ fa pwɛn kun tra sɔ mɔ reyɔn'n ka su'n, kɛ mɔ nɔmba valè'n nunman i wun.

circle-change-center-non-numerical = B'a yoman kacilɛ wafa fɛfɛ mɔ i pwɛn mun be nunman nɔmba valè'n i afiɛn.

## `<function>`

function-domain-insufficient-dimensions = Fɔnksiɔn'n i domɛn'n i dimansiɔn'n sɔman. Domɛn'n wɔ ntamu { $intervals } su, sanngɛ fɔnksiɔn'n wɔ input { $inputs } su.

function-domain-invalid-format = Fɔnksiɔn'n i domɛn'n i sɛsalɛ timan kpa.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Fɔnksiɔn'n i soro pwɛn'n mɔ ɔ timan nɔmba'n, w'a yoman fɛ.
        [minimum] Fɔnksiɔn'n i fam pwɛn'n mɔ ɔ timan nɔmba'n, w'a yoman fɛ.
        [extremum] Fɔnksiɔn'n i awieliɛ pwɛn'n mɔ ɔ timan nɔmba'n, w'a yoman fɛ.
        [point] Fɔnksiɔn'n i pwɛn'n mɔ ɔ timan nɔmba'n, w'a yoman fɛ.
        [slope] Fɔnksiɔn'n i kekle-ndɛ'n mɔ ɔ timan nɔmba'n, w'a yoman fɛ.
       *[other] Fɔnksiɔn'n i { $type } mɔ ɔ timan nɔmba'n, w'a yoman fɛ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Fɔnksiɔn'n i soro pwɛn'n mɔ hwe nunman i wun'n, w'a yoman fɛ.
        [minimum] Fɔnksiɔn'n i fam pwɛn'n mɔ hwe nunman i wun'n, w'a yoman fɛ.
        [extremum] Fɔnksiɔn'n i awieliɛ pwɛn'n mɔ hwe nunman i wun'n, w'a yoman fɛ.
        [point] Fɔnksiɔn'n i pwɛn'n mɔ hwe nunman i wun'n, w'a yoman fɛ.
       *[other] Fɔnksiɔn'n i { $type } mɔ hwe nunman i wun'n, w'a yoman fɛ.
    }

function-points-too-close = Fɔnksiɔn'n wɔ pwɛn nnyɔn mɔ be mantan be wun dan. Ɔ kwlá-man kle fɔnksiɔn'n i bo.

function-iterates-input-output-mismatch = Fɔnksiɔn'n kwla san yo i wun kunngba mɔ input dodo'n nin output dodo'n be ti kunngba. Fɔnksiɔn nga i input ti { $inputs }, i output ti { $outputs }.

## `<sequence>`

sequence-invalid-length = Sekans'n i tenlɛ'n timan kpa. Ɔ fata kɛ ɔ ti nɔmba mua mɔ ɔ timan fam-nɔmba.

sequence-invalid-step = Sekans'n i anwlan'n timan kpa. Wɔ sekans { $type } wafa'n nun, ɔ fata kɛ ɔ ti nɔmba.

sequence-invalid-endpoint-number = Nɔmba sekans'n i "{ $attribute }" timan kpa. Ɔ fata kɛ ɔ ti nɔmba.

sequence-invalid-endpoint-letters = Nkyerɛwde sekans'n i "{ $attribute }" timan kpa. Ɔ fata kɛ ɔ ti nkyerɛwde nkabo.

sequence-invalid-endpoint = Sekans'n i "{ $attribute }" timan kpa.

select-from-sequence-coprime-not-numbers = coprime w'a yoman fɛ kɛ mɔ be timan nɔmba yifuɛ

select-from-sequence-coprime-with-exclude-combinations = coprime w'a yoman fɛ kɛ mɔ be kannin excludeCombinations i ndɛ

## Resolving a `target`

target-not-found = target timan kpa wɔ `<{ $source }>` nun: b'a kwlá-man wun deɛ ɔ kle.

target-state-variable-not-found = target timan kpa wɔ `<{ $source }>` nun: b'a kwlá-man wun tebe-varyabli mɔ be flɛ i "{ $property }" wɔ `<{ $component }>` nun.

## `<odeSystem>`

ode-system-variables-match-independent = Ɔ fata kɛ `<odeSystem>` i varyabli mun be timan kunngba nin varyabli mɔ ɔ ti indepandan'n.

ode-system-duplicate-variable-names = Ɔ kwlá-man kle ODE RHS fɔnksiɔn'n i bo, kɛ mɔ varyabli dunman kun sannin i ba ekun.

ode-system-rhs-function-error = Ɔ kwlá-man kle ODE RHS fɔnksiɔn'n i bo. Sa tɛ kun trɔlɛ, kɛ be yili mathjs fɔnksiɔn.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ɔ kwlá-man kle liɲ { $count } be afiɛn ndɛ'n i bo

angle-invalid-through-point = Pwɛn'n timan kpa wɔ `<angle>` through nun

parabola-vertex-too-many-points = B'a yoman parabɔl mɔ i soro pwɛn'n fa pwɛn kun tra sɔ.

parabola-too-many-points = B'a yoman parabɔl mɔ ɔ fa pwɛn 3 tra sɔ.

intersection-too-many-items = B'a yoman like nnyɔn tra sɔ be kpɛtɛlɛ

## Other math components

ionic-compound-not-two-ions = B'a yoman ayɔn nkabo mɔ ɔ timan ayɔn nnyɔn pɛ.

ionic-compound-needs-cation-and-anion = Be yoli ayɔn nkabo katayɔn kunngba nin anayɔn kunngba pɛ mma.

solve-equations-cannot-evaluate = Ɔ kwlá-man siesie ekwasiɔn'n, kɛ mɔ b'a kwlá-man bu i wun akontaa: { $equation }

math-operators-operand-number-required = Ɔ fata kɛ be kan operandNumber i ndɛ, kɛ be yi akontabuo operande.

eigen-decomposition-failed = Ɔ kwlá-man bu matrisi'n i eigen valè mun

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: paramɛtr { $parameters } nunman like-wafa'n nun, ɔ maan be kwla hyia hwe.

## `<graph>`

graph-grid-invalid = `<graph>`: ɔ kwlá-man kle grid="{ $grid }" i bo. Ɔ fata kɛ ɔ ti none, medium, dense, annzɛ nɔmba pozitif nnyɔn mɔ ɔlɛ o be afiɛn, kɛ grid="1 0.5". Be yiman grid fi kle.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure kyerɛfuɛ'n sɔman xLabelPosition="left"; be fa nifa-akpasua yolɛ.

prefigure-y-label-position-unsupported = `<graph>`: prefigure kyerɛfuɛ'n sɔman yLabelPosition="bottom"; be fa soro-akpasua yolɛ.

prefigure-invalid-axis-bounds = `<graph>`: aks ano'n timan kpa mma prefigure sɛsalɛ; be fa bbox (-10,-10,10,10) mɔ ɔ ti osu'n.

prefigure-invalid-width = `<graph>`: akpasua'n timan kpa mma prefigure sɛsalɛ; be fa fɔto akpasua 425 mɔ ɔ ti osu'n.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio timan kpa mma prefigure sɛsalɛ; be fa nsusuan 1 mɔ ɔ ti osu'n.

prefigure-grid-spacing-too-fine = `<graph>`: grid'n i afiɛn ntamu'n kaan dan mma aks ano mun; be yiman grid fi wɔ prefigure kyerɛfuɛ'n nun.

prefigure-annotations-not-rendered = `<graph>`: be kleman anɔtasiɔn mun sɛ be siman PreFigure kyerɛfuɛ'n.

multiple-annotations-children = Be wunnin `<annotations>` ba kpanngban wɔ `<graph>` nun; be yiman be kwlaa be wun, saan deɛ ɔ ti afiɛnun'n.

## Referring to other components

copy-unrecognized-component-type = Ɔ kwlá-man trɛ annzɛ kopi kɔmpozan-wafa mɔ be simɛn i: { $type }.

copy-prop-not-found = B'a kwlá-man wun su { $property } wɔ kɔmpozan { $component } su

collect-no-source = B'a wunman fibea fi mma collect.

collect-invalid-component-type = Ɔ kwlá-man kunndɛ `<{ $component }>` wafa ba mun, kɛ mɔ ɔ ti kɔmpozan-wafa mɔ ɔ timan kpa.

reference-index-unavailable = Ɔ kwlá-man kle endisi `{ $reference }`

## `<callAction>`

component-action-unavailable = Ɔ kwlá-man flɛ { $action } wɔ kɔmpozan `{ $reference }` su

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Nzɔliɛ'n i sɛsalɛ timan kpa. Layin mun be tenlɛ timan kunngba. Be wunnin i wɔ componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Kolɔn dunman kun sannin i ba ekun nzɔliɛ'n nun. Be wunnin i wɔ componentIdx :{ $componentIdx }

data-frame-missing-column-name = Kolɔn dunman kun nunman nzɔliɛ'n nun. Be wunnin i wɔ componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Tɛlɛ nga i nzuɛn kun gua tɛlɛ mɔ answer tagi'n ti mannin'n su, ɔ maan sa ng'ɔ hwɛman kwan bɛ ba.

answer-max-num-attempts-in-section-wide-check-work = Sɛ a fa `maxNumAttempts` a sie i `<answer>` mɔ ɔ o adaka mɔ `sectionWideCheckWork` o su'n nun'n su'n, ɔ yoman fɛ, kɛ mɔ adaka'n yɛ ɔ sie wafa dodo'n niɔn. Fa `maxNumAttempts` sie adaka'n i wunngbɛn su.

nested-section-wide-check-work-max-num-attempts = Sɛ a fa `maxNumAttempts` a sie i adaka mɔ `sectionWideCheckWork` o su'n mɔ ɔ o adaka uflɛ mɔ `sectionWideCheckWork` nso o su'n nun'n su'n, ɔ yoman fɛ, kɛ mɔ adaka mɔ ɔ o akyi'n yɛ ɔ sie wafa dodo'n niɔn. Fa `maxNumAttempts` sie adaka mɔ ɔ o akyi'n su.

answer-attributes-need-symbolic-equality = Atribi { $attributes } su yoman fɛ sɛ be sieman symbolicEquality.

answer-invalid-type = Wafa mɔ be fali'n timan kpa mma tɛlɛ'n: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Kɛ mɔ `<{ $component }>` kɔmpozan'n nunman dunman'n ti'n, ɔ kwlá-man ti module atribi

module-attribute-name-already-defined = Ɔ kwlá-man fa `<{ $component } name="{ $name }">` ti module atribi, kɛ mɔ `<module>` wafa'n wɔ atribi kun mɔ i dunman ti "{ $name }" kaka.

conditional-content-condition-ignored = `condition` atribi'n w'a yoman fɛ wɔ `<conditionalContent>` mɔ ɔ wɔ case annzɛ else ba'n su.

slider-markers-type-mismatch = Nzɛnzɛ wafa'n nin slider wafa'n be timan kunngba.

pretzel-problem-needs-statement-and-answer = pretzel timan kpa: ɔ fata kɛ `<problem>` kwlaa wɔ `<statement>` kunngba nin `<answer>` kunngba.

pretzel-circuit-first-problem-distractor = pretzel timan kpa: wɔ mode="circuit" nun, `<problem>` klikli'n kwlá-man ti nnaan-ndɛ.

## Attribute values

attribute-invalid-values = Valè { $values } timan kpa mma atribi `{ $attribute }`; w'a yoman fɛ.

attribute-must-be-references = Valè `{ $value }` timan kpa mma atribi `{ $attribute }`. Ɔ fata kɛ atribi'n ti referans mɔ be bo i bo `$` su.

math-input-invalid-function-names = <mathInput>: fɔnksiɔn dunman mɔ be timan kpa'n wɔ { $attribute } nun, be w'a yoman fɛ: { $names }. Ɔ fata kɛ dunman kwlaa i nglo-fa ti nkyerɛwde annzɛ liɲ 2 annzɛ tra sɔ; `|<mathspeak alternative>` kwla ba i akyi.

## Building components from the source

component-type-invalid = Kɔmpozan-wafa timan kpa: `<{ $componentType }>`

attribute-repeated = Ɔ kwlá-man kan atribi { $attribute } i ndɛ ekun.

attribute-invalid-for-component = Atribi "{ $attribute }" timan kpa mma `<{ $componentType }>` wafa kɔmpozan.

## Style definition contrast

style-definition-insufficient-contrast =
    Nsiesielɛ nglɛlɛ { $styleNumber } i nsanwlɛ'n sɔman { $context ->
        [text-on-background] nkyerɛwde kalɛ nin akyi kalɛ'n
        [high-contrast] nsanwlɛ dan kalɛ'n nin asɔnun-nun kalɛ'n
        [line] liɲ kalɛ'n nin asɔnun-nun kalɛ'n
        [marker] nzɛnzɛ kalɛ'n nin asɔnun-nun kalɛ'n
       *[text-on-canvas] nkyerɛwde kalɛ'n nin asɔnun-nun kalɛ'n
    }{ $mode ->
        [dark] { " (esu wafa)" }
       *[light] { "" }
    } be afiɛn ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ɔ fata kɛ ɔ ti { $threshold }:1 annzɛ tra sɔ).

style-definition-dark-mode-text-background-contrast =
    Ɔ ti sɔ mɔ nsiesielɛ nglɛlɛ { $styleNumber } kannin kalɛ mun mɔ be nsanwlɛ'n sɔ mma aliɛ-wafa nun'n, sanngɛ esu-wafa kalɛ mɔ be fa yili sɔ mun'n be nsanwlɛ'n sɔman nkyerɛwde kalɛ'n nin akyi kalɛ'n be afiɛn ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ɔ fata kɛ ɔ ti { $threshold }:1 annzɛ tra sɔ). { $suggestion ->
        [available] Sɛ a kunndɛ kɛ nsanwlɛ'n sɔ esu-wafa nun'n, fa aliɛ-wafa nsanwlɛ'n mantan soro (kɛ nnyɛnndɛ, sie { $lightAttribute }="{ $lightColor }") annzɛ kaci esu-wafa kalɛ'n (kɛ nnyɛnndɛ, sie { $darkAttribute }="{ $darkColor }").
       *[none] Sɛ a kunndɛ kɛ nsanwlɛ'n sɔ esu-wafa nun'n, fa aliɛ-wafa nsanwlɛ'n mantan soro annzɛ kaci kalɛ mɔ be yili sɔ'n wɔ textColorDarkMode nin/annzɛ backgroundColorDarkMode nun.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ɔ ti sɔ mɔ nsiesielɛ nglɛlɛ { $styleNumber } kannin nkyerɛwde kalɛ mɔ i nsanwlɛ'n sɔ mma aliɛ-wafa nun'n, sanngɛ esu-wafa nkyerɛwde kalɛ mɔ be fa yili sɔ'n i nsanwlɛ'n sɔman asɔnun-nun kalɛ'n afiɛn ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ɔ fata kɛ ɔ ti { $threshold }:1 annzɛ tra sɔ). { $suggestion ->
        [available] Sɛ a kunndɛ kɛ nsanwlɛ'n sɔ esu-wafa nun'n, fa aliɛ-wafa nsanwlɛ'n mantan soro (kɛ nnyɛnndɛ, sie textColor="{ $lightColor }") annzɛ kaci esu-wafa kalɛ'n (kɛ nnyɛnndɛ, sie textColorDarkMode="{ $darkColor }").
       *[none] Sɛ a kunndɛ kɛ nsanwlɛ'n sɔ esu-wafa nun'n, fa aliɛ-wafa nsanwlɛ'n mantan soro annzɛ kaci kalɛ mɔ be yili sɔ'n wɔ textColorDarkMode nun.
    }

section-multiple-style-palettes = Akpasua kun kwla yi <stylePalette> kunngba pɛ; deɛ ɔ o akyi'n yɛ ɔ o osu niɔn.

## Unique variants

variant-num-to-select-not-non-negative-integer = ɔ kwlá-man wun { $component } wafa varyan soronko, kɛ mɔ numToSelect timan nɔmba mua mɔ ɔ timan fam-nɔmba.

variant-num-to-select-not-constant-number = ɔ kwlá-man wun { $component } wafa varyan soronko, kɛ mɔ numToSelect timan nɔmba mɔ ɔ kaciman.

variant-with-replacement-not-constant-boolean = ɔ kwlá-man wun { $component } wafa varyan soronko, kɛ mɔ withReplacement timan boolean mɔ ɔ kaciman.

variant-select-weight-disables-unique = Sɛ ɔyilɛ wie wɔ selectWeight annzɛ selectForVariants'n, be yiman varyan soronko'n

variant-coprime-undetermined = ɔ kwlá-man wun { $component } wafa varyan soronko, kɛ mɔ ɔ kwlá-man si sɛ coprime ti ato daa.

variant-attribute-not-constant = ɔ kwlá-man wun { $component } wafa varyan soronko, kɛ mɔ { $attribute } kaciman.

variant-attribute-not-number = ɔ kwlá-man wun { $component } wafa varyan soronko, kɛ mɔ { $attribute } timan nɔmba.

variant-attribute-wrong-type-for-sequence =
    ɔ kwlá-man wun { $component } { $type } wafa varyan soronko, kɛ mɔ { $attribute } timan { $expected ->
        [letters-combination] nkyerɛwde nkabo
        [math-expression] akontabuo ndɛ mɔ ɔ ti kpa
        [integer] nɔmba mua
       *[number] nɔmba
    }.

variant-length-not-integer = ɔ kwlá-man wun { $component } wafa varyan soronko, kɛ mɔ length timan nɔmba mua.

variant-sort-not-implemented = b'a yoman { $component } wafa varyan soronko mɔ sort ka su

variant-exclude-combinations-not-implemented = b'a yoman { $component } wafa varyan soronko mɔ excludeCombinations ka su

variant-math-exclude-not-implemented = b'a yoman { $component } math wafa varyan soronko mɔ exclude ka su

variant-non-constant-exclude-not-implemented = b'a yoman { $component } wafa varyan soronko mɔ exclude mɔ ɔ kaciman'n ka su

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure kyerɛfuɛ'n sɔman; be yiman ba'n i wun.

prefigure-descendant-invalid-geometry = { $subject }: jeomɛtri'n timan kpa annzɛ ɔ wieman; be yiman ba'n i wun.

prefigure-curve-label-omitted = { $subject }: dunman w'a yoman fɛ wɔ nzo mɔ be kacili su'n; be yiman dunman'n i wun.

prefigure-curve-unsupported-definition-type = { $subject }: nzo fɔnksiɔn nglɛlɛ wafa '{ $definitionType }' sɔman; be yiman ba'n i wun.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions atribi mɔ ɔ o regionBetweenCurves su'n sɔman; be yiman ba'n i wun.

prefigure-region-non-formula-child = { $subject }: fɔmuli-wafa fɔnksiɔn ba pɛ yɛ be sɔ wɔ regionBetweenCurves nun niɔn; be yiman ba'n i wun.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' sɔman mma { $labelKind ->
        [line-family] liɲ-akpasua dunman
       *[point] pwɛn dunman
    }; PreFigure i osu-siesielɛ yɛ ɔ o su niɔn.

prefigure-fill-style-unsupported = { $subject }: PreFigure sɔman nzuɛn-yilɛ wafa '{ $fillStyle }'; ɔ san kɔ kalɛ kunngba yilɛ su.

prefigure-line-style-unknown = { $subject }: b'a simɛn liɲ wafa '{ $lineStyle }', be yili i wɔ PreFigure junman'n nun.

prefigure-marker-style-mapped-to-diamond = { $subject }: be fa nzɛnzɛ wafa '{ $markerStyle }' hyia PreFigure wafa 'diamond'.

prefigure-marker-style-unsupported = { $subject }: PreFigure sɔman nzɛnzɛ wafa '{ $markerStyle }'; wafa mɔ ɔ o osu'n yɛ ɔ o su niɔn.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` timan kpa; ɔ kwlá-man wun deɛ ɔ kle. Be yiman anɔtasiɔn'n i wun.

annotation-ref-multiple-targets = `<annotation>`: `ref` kleli like kpanngban; deɛ ɔ o klikli'n yɛ ɔ o su niɔn.

annotation-ref-outside-graph = `<annotation>`: `ref` timan kpa; deɛ ɔ kle'n o graf'n mɔ ɔ kuku i'n i ekun lɔ. Be yiman anɔtasiɔn'n i wun.

annotation-ref-unsupported-target = `<annotation>`: `ref` timan kpa; deɛ ɔ kle'n timan fɔto like mɔ prefigure sɛsalɛ'n sɔ i. Be yiman anɔtasiɔn'n i wun.

annotation-text-missing = `<annotation>`: `text` nunman i wun annzɛ hwe nunman i wun; nkyerɛwde mɔ hwe nunman i wun yɛ ɔ bɛ ba niɔn.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Be wunnin gua-gua like kun.
       *[other] Be wunnin gua-gua like kun mɔ ɔ gua `<{ $componentType }>` wa.
    }

reference-no-referent = B'a wunman deɛ referans nga kle i: `{ $reference }`

reference-multiple-referents = Be wunnin like kpanngban mɔ referans nga kle be: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Sɛsalɛ'n timan kpa mma `<{ $componentType }>` atribi { $attribute }.

children-invalid = Ba mun be timan kpa mma `<{ $componentType }>`: be wunnin ba mun mɔ be timan kpa: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valè `{ $value }` timan kpa mma atribi `{ $attribute }`, valè `{ $default }` yɛ ɔ o su niɔn

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] B'a wunman DoenetML nglɛlɛ { $version }.
       *[other] B'a wunman DoenetML nglɛlɛ { $version }. Ɔ san kɔ nglɛlɛ { $fallback } su
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML timan kpa: { $content }

parse-tag-missing-close-tag = DoenetML timan kpa: Tagi `{ $tag }` nunman i awieliɛ tagi'n i wun. Be flɛli tagi mɔ ɔ kata i wun annzɛ tagi `</{ $tagName }>`.

parse-tag-error = DoenetML timan kpa: Sa tɛ kun o tagi `<{ $tagName }>` nun

parse-attribute-missing-value = DoenetML timan kpa: Ɔ ti kɛ atribi `{ $attribute }` mɔ ɔ timan kpa'n nunman valè.

parse-attribute-invalid = DoenetML timan kpa: Atribi `{ $attribute }` timan kpa

parse-attribute-value-invalid = DoenetML timan kpa: Atribi valè `{ $value }` timan kpa

parse-attribute-value-quote-mismatch = DoenetML timan kpa: Atribi valè `{ $value }` timan kpa. Kasa-nzɛnzɛ mun be timan kunngba. Ɔ ti kɛ `{ $quote }` w'a yaci

parse-open-tag-name-missing = DoenetML timan kpa: Be wunnin tagi mɔ dunman nunman i wun, kɛ `<`

parse-tag-not-closed = DoenetML timan kpa: B'a kataman tagi `{ $tag }` (ɔ ti kɛ `>` w'a yaci).

parse-self-closing-tag-name-missing = DoenetML timan kpa: Be wunnin tagi mɔ dunman nunman i wun `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML timan kpa: B'a kataman tagi `{ $tag }` (ɔ ti kɛ `/>` w'a yaci).

parse-tag-invalid-attributes = DoenetML timan kpa: Tagi `{ $tag }` timan kpa. Atribi mɔ ɔ timan kpa kwla o i nun.

parse-close-tag-name-missing = DoenetML timan kpa: Be wunnin awieliɛ tagi mɔ dunman nunman i wun, kɛ `</`

parse-attribute-value-unquoted = Ɔ fata kɛ atribi valè'n o kasa-nzɛnzɛ nun: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML timan kpa: Be wunnin awieliɛ tagi `{ $tag }`, sanngɛ tagi mɔ ɔ bo i bo'n nunman lɛ

parse-close-tag-mismatched = DoenetML timan kpa: Awieliɛ tagi'n timan kpa. Be flɛli `</{ $expected }>`. Be wunnin `{ $found }`

parser-node-unconvertible = Ɔ kwlá-man kaci nɔdi { $node } kɔ Dast nɔdi su.

## Names

name-attribute-invalid =
    Atribi name='{ $name }' timan kpa. { $reason ->
        [characters] Dunman kwla nya nkyerɛwde, nɔmba, ase-liɲ, annzɛ liɲ likawlɛ.
       *[start] Ɔ fata kɛ dunman'n fin nkyerɛwde su.
    }

component-name-invalid-start = Kɔmpozan dunman "{ $name }" timan kpa. Ɔ fata kɛ dunman'n fin nkyerɛwde su.

## `<answer>` sugar

answer-video-watched-missing-video = Ɔ fata kɛ answer mɔ i wafa ti videoWatched'n wɔ video atribi

answer-video-watched-video-not-reference = Ɔ fata kɛ answer mɔ i wafa ti videoWatched'n wɔ video atribi mɔ ɔ ti referans

answer-name-not-single-text = Ɔ fata kɛ answer name atribi'n wɔ text ba kunngba pɛ

## Referencing another document

external-doenetml-recursion-limit = Ɔ kwlá-man nya DoenetML mɔ ɔ fin ekun, kɛ mɔ ɔ san kɔ i wun su dan. Sɛ gua-gua like kun o lɛ?

external-doenetml-unavailable = Ɔ kwlá-man nya DoenetML mɔ ɔ fin { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML mɔ be nyannin i fin { $attribute }="{ $uri }" timan kpa: ɔ nin kɔmpozan-wafa "{ $componentType }" be timan kunngba

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribi `{ $from }` w'a fii; fa `{ $to }` sie i osu.
       *[other] [deprecation] Atribi `{ $from }` mɔ ɔ o `<{ $component }>` su'n w'a fii; fa `{ $to }` sie i osu.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribi `{ $from }` w'a fii, ɔ w'a yoman fɛ, kɛ mɔ be kannin `{ $to }` nso i ndɛ.
       *[other] [deprecation] Atribi `{ $from }` mɔ ɔ o `<{ $component }>` su'n w'a fii, ɔ w'a yoman fɛ, kɛ mɔ be kannin `{ $to }` nso i ndɛ.
    }

deprecated-attribute-ignored = [deprecation] Atribi `{ $attribute }` mɔ ɔ o `<{ $component }>` su'n w'a fii, ɔ w'a yoman fɛ.

deprecated-attribute-to-child = [deprecation] Atribi `{ $attribute }` mɔ ɔ o `<{ $component }>` su'n w'a fii; fa `<{ $child }>` ba sie i osu.

deprecated-attribute-value-renamed = [deprecation] Valè `{ $value }` mɔ ɔ o atribi `{ $attribute }` mɔ ɔ o `<{ $component }>` su'n, w'a fii; fa `{ $to }` sie i osu.


## Language coverage

pluralize-english-only = `<pluralize>` kwla kaci ndɛ dodo Anglɛ nun likawlɛ, ɔ maan i nkyerɛwde'n te o i osu kunngba wɔ fluwa mɔ be klɛli i { $locale } nun'n. Klɛ dodo-wafa'n i wunngbɛn, annzɛ fa sie `pluralForm` atribi'n nun.


## Checking against the schema

schema-element-unrecognized = Like `<{ $tag }>` timan Doenet like mɔ be si i.

schema-element-not-allowed-at-root = Be maman like `<{ $tag }>` kwan wɔ fluwa'n i bo su.

schema-element-not-allowed-inside = Be maman like `<{ $tag }>` kwan wɔ `<{ $parent }>` nun.

schema-attribute-unrecognized = Like `<{ $tag }>` nunman atribi mɔ be flɛ i `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ɔ fata kɛ like `<{ $tag }>` i atribi `{ $attribute }` ti nhwehwɛmu mɔ deɛ kwlaa mɔ ɔ o su'n ti yeinom be nun kun: { $allowed }
       *[other] Ɔ fata kɛ like `<{ $tag }>` i atribi `{ $attribute }` ti yeinom be nun kun: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Varyan dunman'n timan kpa mma select. Varyan dunman { $variantName } o ɔpsiɔn { $numOptions } be nun, sanngɛ dodo mɔ be bɛ yi'n ti { $numToSelect }.

select-variant-name-without-options = Be kannin varyan wie be ndɛ mma select, sanngɛ b'a kanman ɔpsiɔn fi ndɛ mma varyan dunman mɔ ɔ kwla ba: { $variantName }.

select-variant-name-not-possible = Varyan dunman { $variantName } mɔ be kannin i ndɛ mma select'n, ɔ timan varyan dunman mɔ ɔ kwla ba.

select-too-few-options = Ɔ kwlá-man yi { $numToSelect } kɔmpozan fin { $numOptions } pɛ nun.

select-from-sequence-too-few-values = Ɔ kwlá-man yi valè { $numToSelect } fin sekans mɔ i tenlɛ ti { $length }'n nun.

select-from-sequence-indices-count-mismatch = Ɔ fata kɛ endisi dodo mɔ be kannin be ndɛ mma select'n nin dodo mɔ be bɛ yi'n be ti kunngba

select-from-sequence-indices-not-integers = Ɔ fata kɛ endisi kwlaa mɔ be kannin be ndɛ mma select'n be ti nɔmba mua

select-from-sequence-index-excluded = Be kannin selectfromsequence endisi mɔ be yili i nun ba'n i ndɛ

select-from-sequence-indices-excluded-combination = Be kannin selectfromsequence endisi mɔ be nkabo yili be nun ba'n be ndɛ

select-from-sequence-coprime-not-positive-integers = Ɔ kwlá-man yi nɔmba mɔ be nin be wun nunman kwan nkabo, kɛ mɔ be timan nɔmba mua pozitif mɔ be bɛ yi.

select-from-sequence-coprime-common-factor = Ɔ kwlá-man yi nɔmba mɔ be nin be wun nunman kwan. Valè kwlaa mɔ ɔ kwla ba'n be wɔ kpɛfuɛ kunngba. (Ɔ fata kɛ valè mɔ be kannin be ndɛ wɔ "from" annzɛ "to" nun'n nin be wun nunman kwan nin "step".)

select-from-sequence-coprime-single-number = Ɔ kwlá-man yi nɔmba mɔ be nin be wun nunman kwan nkabo fin nɔmba kunngba mɔ ɔ timan 1.

select-from-sequence-excluded-too-many-combinations = Be yili nkabo 70% tra sɔ be nun wɔ selectFromSequence nun

select-from-sequence-coprime-none-found = B'a kwlá-man yi nɔmba mɔ be nin be wun nunman kwan. Valè kwlaa mɔ ɔ kwla ba'n be wɔ kpɛfuɛ kunngba.

select-from-sequence-too-few-unique-values = Ɔ kwlá-man yi valè soronko { $numToSelect } fin sekans mɔ i tenlɛ ti { $numPossibleValues }'n nun

select-prime-numbers-too-few-values = Ɔ kwlá-man yi valè { $numToSelect } fin nɔmba mɔ be nkɛtɛ le'n i list mɔ i tenlɛ ti { $numValues }'n nun

select-prime-numbers-values-count-mismatch = Ɔ fata kɛ valè dodo mɔ be kannin be ndɛ mma select'n nin dodo mɔ be bɛ yi'n be ti kunngba

select-prime-numbers-values-not-prime = Ɔ fata kɛ valè kwlaa mɔ be kannin be ndɛ mma select prime number'n be o nɔmba mɔ be nkɛtɛ le'n i list nun

select-prime-numbers-values-excluded-combination = selectPrimeNumbers valè mɔ be kannin be ndɛ'n, be nkabo yili be nun ba

select-prime-numbers-excluded-too-many-combinations = Be yili nkabo 70% tra sɔ be nun wɔ selectPrimeNumbers nun

select-random-combination-fluke = Ɔ timan sa ng'ɔ taa sin, sanngɛ b'a kwlá-man yi valè mɔ be fa kpa nkabo

select-random-value-fluke = Ɔ timan sa ng'ɔ taa sin, sanngɛ b'a kwlá-man yi valè mɔ be fa kpa
