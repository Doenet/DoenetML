# Guarani diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Written in the *jopara* register; see `chrome.ftl`'s header.
#
# Guarani drops «-kuéra» after a numeral and its verbs do not agree with an
# inanimate subject's number, so a counted message whose only English difference
# is number renders one string here and the select is dropped. A comment marks
# each site.


## `<lineSegment>`

# No select: the plural suffix is dropped after a count and «ojehejarei» does not
# agree with the number of what is ignored, so one string covers both English
# categories. The count still arrives.
line-segment-attributes-ignored-with-endpoints = { $attributes } ojehejarei mokõi apy oñemoĩ jave

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } ojehejarei peteĩ apy ha peteĩ mbyte oñemoĩ jave

line-segment-midpoint-offset-without-midpoint = midpointOffset mba'eve ndojapói mbyte ndaipórirõ

## `<line>`

line-points-undetermined-dimensions = Tairũ ohasáva kyta ijyvyra'ỹva rehe.

line-points-too-few-dimensions = Tairũ ohasava'erã kyta mokõi yvyra guive oguerekóva rehe.

line-points-depend-on-variables = Tairũ ohasa kyta oñemoambuévare oĩva rehe: { $variables }.

line-equation-invalid-format = Tairũ ha'ãnga naiporãiva { $variable1 } ha { $variable2 } oñemoambuéva ndive.

## `<ray>`

ray-overprescribed-through = Tairũ apy'ỹ oñemoĩ through, endpoint ha direction ndive.  through oñemoĩva ojehejarei.

ray-dimension-mismatch = numDimensions ndojojái tairũ apy'ỹme.

## `<vector>`

vector-overprescribed-head = Bektor oñemoĩ head, tail ha displacement ndive.  head oñemoĩva ojehejarei.

vector-dimension-mismatch = numDimensions ndojojái bektórpe.

## Attracting and constraining

attract-to-without-nearest-point = Ndaikatúi oñemboja peteĩ `<{ $component }>` rehe, nearestPoint teko ndoguerekóigui.

constrain-to-without-nearest-point = Ndaikatúi oñemombyta peteĩ `<{ $component }>` rehe, nearestPoint teko ndoguerekóigui.

constrain-to-interior-without-nearest-point = Ndaikatúi oñemombyta peteĩ `<{ $component }>` ryepýpe, nearestPoint teko ndoguerekóigui.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ojehejarei choiceInput inline'ỹvape

## Ordering children by index

choice-input-indices-count-mismatch = indices oñemoĩva choiceInput peguarã ojehejarei, indices papapy ndojojáigui choice ra'y papapy ndive.

pretzel-indices-count-mismatch = indices oñemoĩva problem peguarã ojehejarei, indices papapy ndojojáigui problem ra'y papapy ndive.

shuffle-indices-count-mismatch = indices oñemoĩva shuffle peguarã ojehejarei, indices papapy ndojojáigui apyra papapy ndive.

indices-ignored-out-of-range = indices oñemoĩva { $component } peguarã ojehejarei, oĩgui indices okápe opytáva.

pretzel-indices-repeated = indices oñemoĩva pretzel peguarã ojehejarei, oĩgui indices ojejapyre.

pretzel-circuit-first-index = indices oñemoĩva pretzel circuit-pe ojehejarei, peteĩha index 1 va'erãgui.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` omba'apo haguã jehaipy ra'y ndive, emoĩ va'erã peteĩ `type` teroja.

invalid-type-defaulting-to-math = { $type } naiporãi { $component } apyrape. math, text, number térã boolean va'erã. math oñemoĩ.

string-not-valid-component-to-arrange = Jehaipy "{ $value }" ndaha'éi apyra oĩporãva { $component } peguarã. Ojehejarei.

## Types and variables

invalid-type-defaulting-to-number = { $type } naiporãi, number oñemoĩ.

invalid-variable-value = Oñemoambuéva tepy naiporãiva: `{ $value }`

## Variants

variant-index-must-be-number = Ojehecháva index { $index } papapy va'erã

variant-index-must-be-integer = Ojehecháva index { $index } papapy oĩmbáva va'erã

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ndojejapói mba'e ra'ãha oĩmbávape guarã. Ipe oñemoĩ ojoguáva ramo.

side-by-side-absolute-margins = `<{ $component }>` ndojejapói mba'e ra'ãha oĩmbávape guarã. Ijyva oñemoĩ ojoguáva ramo.

side-by-side-no-block-child = `<{ $component }>` naiporãi: oguereko va'erã peteĩ bloke ra'y.

## `<label>`

label-for-ignored-on-graphical = `for` teroja ojehejarei `<label>` ta'ãngáva rehe.

label-for-must-resolve-to-one = `for` teroja `<label>` rehe peteĩ apyra rehénte ohechauka va'erã.

label-for-unresolved = `for` teroja `<label>` rehe ndaikatúi ohechauka peteĩ apyra.

label-for-answer-with-authored-inputs = `for` teroja `<label>` rehe ohechauka peteĩ `<answer>` oguerekóva jeike ojehaipyre; ehechauka pe jeike rehe voi.

label-for-answer-without-input = `for` teroja `<label>` rehe ohechauka peteĩ `<answer>` jeike'ỹva oñembohéra haguã.

label-for-must-reference-input-or-answer = `for` teroja `<label>` rehe ohechauka va'erã peteĩ jeike térã peteĩ mbohovái rehe.

## Accessibility

accessibility-short-description-or-decorative = Jeikeha rehe, `<{ $component }>` oguereko va'erã ñemyesakã mbyky térã oñemoĩ va'erã jeguaka ramo.

accessibility-video-short-description = Jeikeha rehe, `<video>` oguereko va'erã ñemyesakã mbyky.

accessibility-input-short-description-or-label = Jeikeha rehe, `<{ $component }>` oguereko va'erã ñemyesakã mbyky térã téra.

accessibility-answer-input-short-description-or-label = Jeikeha rehe, peteĩ `<answer>` ojapóva jeike oguereko va'erã ñemyesakã mbyky térã téra.

accessibility-short-description-contains-math = Ñemyesakã mbyky ndoguerekói va'erã papapy apyra `<{ $component }>` mba'eichagua. Ehai papapy ñe'ẽme.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ndoguerekói jehecha porã pehẽngue téra jehaipýpe (hũva) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; oikotevẽ { $threshold }:1).
       *[other] { $colorName } ndoguerekói jehecha porã pehẽngue téra jehaipýpe ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; oikotevẽ { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Ndojejapói gueteri `<circle>` ohasáva { $count } kyta rehe, kyta papapy tepy'ỹrõ.

circle-too-many-through-points = Ndaikatúi oñemombe'u apu'a ohasáva 3 kyta ári.

circle-overprescribed-radius-center-points = Ndaikatúi oñemombe'u apu'a oguerekóva mbyte ra'ã, mbyte ha kyta oñemoĩmbáva.

circle-center-with-multiple-points = Ndaikatúi oñemombe'u apu'a mbyte oñemoĩva ndive ohasáva 1 kyta ári.

circle-radius-too-small = Ndaikatúi oñemombe'u apu'a: mokõi kyta mbyte pukukue { $distance } haguére, mbyte ra'ã { $radius } oñemoĩva michĩeterei.

circle-radius-with-many-points = Ndaikatúi ojejapo apu'a ohasáva mokõi kyta ári mbyte ra'ã oñemoĩva ndive.

circle-invalid-center-or-through-points = Apu'a mbyte térã ikyta naiporãi.

circle-radius-center-with-multiple-points = Ndaikatúi oñemombe'u apu'a mbyte ra'ã, mbyte oñemoĩva ndive ohasáva 1 kyta ári.

circle-change-radius-non-numerical = Ndaikatúi oñemoambue apu'a mbyte ra'ã, ikyta papapy'ỹrõ

circle-radius-with-points-non-numerical = Ndaikatúi ojejapo apu'a ohasáva peteĩ kyta ári mbyte ra'ã oñemoĩva ndive, papapy tepy ndaipórirõ.

circle-change-center-non-numerical = Ndojejapói gueteri apu'a mbyte ñemoambue, ikyta papapy tepy'ỹrõ.

## `<function>`

# Both selects dropped: «pa'ũ» and «jeike» take no plural suffix after a numeral,
# so English's four sentences are one here. Both counts still arrive and are
# still formatted.
function-domain-insufficient-dimensions = Funsiõ renda yvyra ndahetái. Tenda oguereko { $intervals } pa'ũ hákatu funsiõ oguereko { $inputs } jeike.

function-domain-invalid-format = Funsiõ renda ha'ãnga naiporãi.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funsiõ tuichavéva papapy'ỹva ojehejarei.
        [minimum] Funsiõ michĩvéva papapy'ỹva ojehejarei.
        [extremum] Funsiõ apy papapy'ỹva ojehejarei.
        [point] Funsiõ kyta papapy'ỹva ojehejarei.
        [slope] Funsiõ jeupi papapy'ỹva ojehejarei.
       *[other] Funsiõ { $type } papapy'ỹva ojehejarei.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funsiõ tuichavéva nandíva ojehejarei.
        [minimum] Funsiõ michĩvéva nandíva ojehejarei.
        [extremum] Funsiõ apy nandíva ojehejarei.
        [point] Funsiõ kyta nandíva ojehejarei.
       *[other] Funsiõ { $type } nandíva ojehejarei.
    }

function-points-too-close = Funsiõ oguereko mokõi kyta oĩva ijykeretevoi. Ndaikatúi oñemyesakã funsiõ.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Funsiõ jeykekue ikatu jeikepy papapy ojoja jave osẽva papapy ndive. Ko funsiõ oguereko { $inputs } jeike ha { $outputs } osẽva.

## `<sequence>`

sequence-invalid-length = Jekupyty pukukue naiporãi.  Papapy oĩmbáva michĩ'ỹva va'erã.

sequence-invalid-step = Jekupyty pyrũ naiporãi.  { $type } jekupytýpe guarã papapy va'erã.

sequence-invalid-endpoint-number = Papapy jekupyty "{ $attribute }" naiporãi.  Papapy va'erã.

sequence-invalid-endpoint-letters = Achegety jekupyty "{ $attribute }" naiporãi.  Achegety ñembojoaju va'erã.

sequence-invalid-endpoint = Jekupyty "{ $attribute }" naiporãi.

select-from-sequence-coprime-not-numbers = coprime ojehejarei, papapy ndojeporavóigui

select-from-sequence-coprime-with-exclude-combinations = coprime ojehejarei, excludeCombinations oñemoĩgui

## Resolving a `target`

target-not-found = target naiporãi `<{ $source }>` peguarã: ndojejuhúi.

target-state-variable-not-found = target naiporãi `<{ $source }>` peguarã: ndojejuhúi teko "{ $property }" hérava peteĩ `<{ $component }>` rehe.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` oñemoambuéva ambue va'erã pe oñemoambue'ỹvagui.

ode-system-duplicate-variable-names = Ndaikatúi oñemyesakã ODE RHS funsiõ, oñemoambuéva réra ojejapyre ndive.

ode-system-rhs-function-error = Ndaikatúi oñemyesakã ODE RHS funsiõ.  Javy ojejapy jave mathjs funsiõ.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ndaikatúi oñemyesakã hakua { $count } tairũ mbytépe

angle-invalid-through-point = Kyta naiporãiva `<angle>` through-pe

parabola-vertex-too-many-points = Ndojejapói gueteri parábola hakua ndive ohasáva 1 kyta ári.

parabola-too-many-points = Ndojejapói gueteri parábola ohasáva 3 kyta ári.

intersection-too-many-items = Ndojejapói gueteri jekutu mokõi apyra ári

## Other math components

ionic-compound-not-two-ions = Ndojejapói gueteri ñembojoaju ioniko mokõi ion ndaha'éiva peguarã.

ionic-compound-needs-cation-and-anion = Ñembojoaju ioniko ojejapo peteĩ katiõ ha peteĩ aniõ peguarãnte.

solve-equations-cannot-evaluate = Ndaikatúi oñemyesakã ha'ãnga, ndaikatúigui oñeha'ã: { $equation }

math-operators-operand-number-required = Emoĩ va'erã peteĩ operandNumber eguenohẽ jave peteĩ papapy operando.

eigen-decomposition-failed = Ndaikatúi oñemombe'u matris tepy teete

## `<matchesPattern>`

# No select: the plural suffix is dropped after a count and the verb does not
# agree, so both English categories are one string.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: { $parameters } ndojehechái pe ta'ãngápe, upévare ojojáta nandíva ndive tapiaite.

## `<graph>`

graph-grid-invalid = `<graph>`: ndaikatúi oñemyesakã grid="{ $grid }". none, medium, dense, térã mokõi papapy michĩ'ỹva pa'ũ ndive va'erã, ko'ãichagua grid="1 0.5". Ndojejapói tairũ ñembojoaju.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ndojeguerekói prefigure mba'erechahápe; akatúa gotyo teko ojeporu.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ndojeguerekói prefigure mba'erechahápe; yvate gotyo teko ojeporu.

prefigure-invalid-axis-bounds = `<graph>`: mba'yrujere apy naiporãi prefigure ñemoambuépe guarã; bbox ypykue ojeporu (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ipekue naiporãi prefigure ñemoambuépe guarã; ta'ãnga pekue ypykue 425 ojeporu.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio naiporãi prefigure ñemoambuépe guarã; ra'ã ypykue 1 ojeporu.

prefigure-grid-spacing-too-fine = `<graph>`: tairũ ñembojoaju pa'ũ po'ieterei mba'yrujere apýpe guarã; tairũ ñembojoaju ojeheja prefigure mba'erechahápe.

prefigure-annotations-not-rendered = `<graph>`: jehaipy joapy ndojehechaukái PreFigure mba'erechaha ndojeporúirõ.

multiple-annotations-children = Ojejuhu heta `<annotations>` ra'y `<graph>` ryepýpe; opa ojehejarei pe ipahaguánte.

## Referring to other components

copy-unrecognized-component-type = Ndaikatúi oñemombuku térã oñekopia apyra ojekuaa'ỹva: { $type }.

copy-prop-not-found = Ndojejuhúi prop { $property } peteĩ apyra { $component } mba'eichaguápe

collect-no-source = Ndojejuhúi mba'evete collect peguarã.

collect-invalid-component-type = Ndaikatúi oñembyaty apyra `<{ $component }>` mba'eichagua, naiporãigui mba'eichagua ramo.

reference-index-unavailable = Ndaikatúi ohechauka index `{ $reference }` rehe

## `<callAction>`

component-action-unavailable = Ndaikatúi oñehenói { $action } apyra `{ $reference }` rehe

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Marandu ha'ãnga naiporãi.  Tysỹi pukukue ndojojái. Ojejuhu componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Marandu oguereko kolúmna réra ojejapyre.  Ojejuhu componentIdx :{ $componentIdx }

data-frame-missing-column-name = Marandúpe oñembyai peteĩ kolúmna réra.  Ojejuhu componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Peteĩ award ko mbohovái peguarã oĩ pe mbohovái tag omondova'ekue rehe, ha upéva ogueraháta teko ojeha'arõ'ỹvape.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` oñemoĩva peteĩ `<answer>` rehe, `sectionWideCheckWork` oguerekóva ryepýpe, mba'eve ndojapói, ñeha'ã papapy pe ryru omoĩgui. Emoĩ `maxNumAttempts` pe ryru rehe.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` oñemoĩva peteĩ ryru `sectionWideCheckWork` oguerekóva rehe, ambue ryru `sectionWideCheckWork` oguerekóva ryepýpe oĩva, mba'eve ndojapói, ñeha'ã papapy pe ryru okapegua omoĩgui. Emoĩ `maxNumAttempts` pe ryru okapegua rehe.

# No select: «teroja» takes no plural suffix after a count and the verb does not
# agree with it.
answer-attributes-need-symbolic-equality = Teroja { $attributes } mba'eve ndojapomo'ãi symbolicEquality oñemoĩ'ỹrõ.

answer-invalid-type = Mbohovái mba'eichagua naiporãiva: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Apyra `<{ $component }>` ndoguerekóigui téra, ndaikatúi ojeporu module teroja peguarã

module-attribute-name-already-defined = Apyra `<{ $component } name="{ $name }">` ndaikatúi ojeporu teroja ramo module peguarã, apyra `<module>` oguerekómagui peteĩ "{ $name }" teroja.

conditional-content-condition-ignored = Teroja `condition` ojehejarei apyra `<conditionalContent>` case térã else ra'y oguerekóvape.

slider-markers-type-mismatch = Ta'ãnga mba'eichagua ndojojái slider mba'eichagua ndive.

pretzel-problem-needs-statement-and-answer = pretzel naiporãi: peteĩteĩ `<problem>` oguereko va'erã peteĩ `<statement>` ha peteĩ `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel naiporãi: mode="circuit"-pe, peteĩha `<problem>` ndaikatúi ha'e mbotavyha.

## Attribute values

# No select: «tepy» takes no plural suffix after a count and «ojehejarei» does not
# agree with it.
attribute-invalid-values = Tepy { $values } naiporãi teroja `{ $attribute }` peguarã; ojehejarei.

attribute-must-be-references = Tepy `{ $value }` naiporãi teroja `{ $attribute }` peguarã. Teroja ojejapo va'erã jehechauka `$`-pe oñepyrũva ndive.

math-input-invalid-function-names = <mathInput>: funsiõ réra naiporãiva ojehejarei { $attribute }-pe: { $names }. Peteĩteĩ téra jehechauka pehẽ oguereko va'erã 2 achegety guive (achegety térã kytã puku); ikatu ou peteĩ `|<mathspeak alternative>` upe rire.

## Building components from the source

component-type-invalid = Apyra mba'eichagua naiporãiva: `<{ $componentType }>`

attribute-repeated = Ndaikatúi ojejapy teroja { $attribute }.

attribute-invalid-for-component = Teroja "{ $attribute }" naiporãi peteĩ apyra `<{ $componentType }>` mba'eichaguápe.

## Style definition contrast

style-definition-insufficient-contrast =
    Ta'ãnga ñemyesakã { $styleNumber } ndoguerekói jehecha porã { $context ->
        [text-on-background] jehaipy sa'y tugua sa'y renondépe
        [high-contrast] sa'y jehecha porãva mba'yrupepo renondépe
        [line] tairũ sa'y mba'yrupepo renondépe
        [marker] ta'ãnga sa'y mba'yrupepo renondépe
       *[text-on-canvas] jehaipy sa'y mba'yrupepo renondépe
    }{ $mode ->
        [dark] { " (hũva)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; oikotevẽ { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Ta'ãnga ñemyesakã { $styleNumber } omoĩ ramo jepe sa'y jehecha porãva hesakãvape guarã, sa'y hũva oúva umi tepýgui ndoguerekói jehecha porã jehaipy sa'y tugua sa'y renondépe ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; oikotevẽ { $threshold }:1). { $suggestion ->
        [available] Jehecha porã oĩ haguã hũvape, embotuichave hesakãva jehecha porã (techapyrã, emoĩ { $lightAttribute }="{ $lightColor }") térã emoambue hũva sa'y (techapyrã, emoĩ { $darkAttribute }="{ $darkColor }").
       *[none] Jehecha porã oĩ haguã hũvape, embotuichave hesakãva jehecha porã térã emoambue sa'y oúva textColorDarkMode ha/térã backgroundColorDarkMode ndive.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ta'ãnga ñemyesakã { $styleNumber } omoĩ ramo jepe jehaipy sa'y jehecha porãva hesakãvape guarã, jehaipy sa'y hũva oúva upe tepýgui ndoguerekói jehecha porã mba'yrupepo renondépe ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; oikotevẽ { $threshold }:1). { $suggestion ->
        [available] Jehecha porã oĩ haguã hũvape, embotuichave hesakãva jehecha porã (techapyrã, emoĩ textColor="{ $lightColor }") térã emoambue hũva sa'y (techapyrã, emoĩ textColorDarkMode="{ $darkColor }").
       *[none] Jehecha porã oĩ haguã hũvape, embotuichave hesakãva jehecha porã térã emoambue sa'y oúva textColorDarkMode ndive.
    }

section-multiple-style-palettes = Peteĩ pehẽngue ikatu oiporavo peteĩ <stylePalette>-nte; pe ipahaguã ojeporu.

## Unique variants

variant-num-to-select-not-non-negative-integer = ndaikatúi ojekuaa { $component } ojehecháva ha'eñóva, numToSelect ndaha'éigui papapy oĩmbáva michĩ'ỹva.

variant-num-to-select-not-constant-number = ndaikatúi ojekuaa { $component } ojehecháva ha'eñóva, numToSelect ndaha'éigui papapy oñemoambue'ỹva.

variant-with-replacement-not-constant-boolean = ndaikatúi ojekuaa { $component } ojehecháva ha'eñóva, withReplacement ndaha'éigui boolean oñemoambue'ỹva.

variant-select-weight-disables-unique = select ojehecháva ha'eñóva oñembotývo oĩrõ peteĩ poravorã selectWeight térã selectForVariants oñemoĩva ndive

variant-coprime-undetermined = ndaikatúi ojekuaa { $component } ojehecháva ha'eñóva, ndaikatúigui ojekuaa coprime japu tapiaite.

variant-attribute-not-constant = ndaikatúi ojekuaa { $component } ojehecháva ha'eñóva, { $attribute } ndaha'éigui oñemoambue'ỹva.

variant-attribute-not-number = ndaikatúi ojekuaa { $component } ojehecháva ha'eñóva, { $attribute } ndaha'éigui papapy.

variant-attribute-wrong-type-for-sequence =
    ndaikatúi ojekuaa { $component } { $type } mba'eichagua ojehecháva ha'eñóva, { $attribute } ndaha'éigui { $expected ->
        [letters-combination] achegety ñembojoaju
        [math-expression] papapy ñe'ẽ oĩporãva
        [integer] papapy oĩmbáva
       *[number] papapy
    }.

variant-length-not-integer = ndaikatúi ojekuaa { $component } ojehecháva ha'eñóva, length ndaha'éigui papapy oĩmbáva.

variant-sort-not-implemented = ndojejapói gueteri { $component } ojehecháva ha'eñóva sort ndive

variant-exclude-combinations-not-implemented = ndojejapói gueteri { $component } ojehecháva ha'eñóva excludeCombinations ndive

variant-math-exclude-not-implemented = ndojejapói gueteri { $component } math mba'eichagua ojehecháva ha'eñóva exclude ndive

variant-non-constant-exclude-not-implemented = ndojejapói gueteri { $component } ojehecháva ha'eñóva exclude oñemoambuéva ndive

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ndojeguerekói graph prefigure mba'erechahápe; ra'y ojehejarei.

prefigure-descendant-invalid-geometry = { $subject }: yvyra ha'ãnga ndaha'éiva oĩmbáva térã ijapytépe opytáva; ra'y ojehejarei.

prefigure-curve-label-omitted = { $subject }: ndojeguerekói téra tairũ karẽ oñemoambuéva rehe; téra ojeheja.

prefigure-curve-unsupported-definition-type = { $subject }: tairũ karẽ funsiõ ñemyesakã '{ $definitionType }' ndojeguerekói; ra'y ojehejarei.

prefigure-region-flip-functions-unsupported = { $subject }: teroja flipFunctions ndojeguerekói regionBetweenCurves rehe; ra'y ojehejarei.

prefigure-region-non-formula-child = { $subject }: formula mba'eichagua funsiõ ra'ýnte ojeguereko regionBetweenCurves rehe; ra'y ojehejarei.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ndojeguerekói { $labelKind ->
        [line-family] tairũ aty téra
       *[point] kyta téra
    } peguarã; PreFigure ñembohysýi ypykue ojeporu.

prefigure-fill-style-unsupported = { $subject }: PreFigure ndoguerekói ñembojehe'a ta'ãnga '{ $fillStyle }'; ñembojehe'a oĩmbávape oñemboja.

prefigure-line-style-unknown = { $subject }: tairũ ta'ãnga '{ $lineStyle }' ojekuaa'ỹva ojeheja PreFigure osẽvagui.

prefigure-marker-style-mapped-to-diamond = { $subject }: ta'ãnga ha'ãha '{ $markerStyle }' oñemoĩ PreFigure ta'ãnga 'diamond' ramo.

prefigure-marker-style-unsupported = { $subject }: PreFigure ndoguerekói ta'ãnga ha'ãha '{ $markerStyle }'; ta'ãnga ypykue ojeporu.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` naiporãi; ndaikatúi ojejuhu pe ojehecháva. Jehaipy joapy ojeheja.

annotation-ref-multiple-targets = `<annotation>`: `ref` ohupyty heta ojehecháva; peteĩha ojeporu.

annotation-ref-outside-graph = `<annotation>`: `ref` naiporãi; pe ojehecháva oĩ graph okápe. Jehaipy joapy ojeheja.

annotation-ref-unsupported-target = `<annotation>`: `ref` naiporãi; pe ojehecháva ndaha'éi mba'e ta'ãnga ojeguerekóva prefigure ñemoambuépe. Jehaipy joapy ojeheja.

annotation-text-missing = `<annotation>`: `text` ndaipóri térã nandi; jehaipy nandi oñemoĩ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ojejuhu ñemboja apu'a.
       *[other] Ojejuhu ñemboja apu'a apyra `<{ $componentType }>` ndive.
    }

reference-no-referent = Ndojejuhúi mba'eve ko jehechauka peguarã: `{ $reference }`

reference-multiple-referents = Ojejuhu heta ko jehechauka peguarã: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ha'ãnga naiporãi teroja { $attribute } `<{ $componentType }>` peguarã.

children-invalid = Ra'y naiporãiva `<{ $componentType }>` peguarã: Ojejuhu ra'y naiporãiva: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Tepy `{ $value }` naiporãi teroja `{ $attribute }` peguarã, tepy `{ $default }` ojeporu

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ndojejuhúi DoenetML { $version }.
       *[other] Ndojejuhúi DoenetML { $version }. { $fallback }-pe oñemboja
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML naiporãiva: { $content }

parse-tag-missing-close-tag = DoenetML naiporãiva: Tag `{ $tag }` ndoguerekói tag mboty. Ojeha'arõ tag ijehe oñembotýva térã peteĩ tag `</{ $tagName }>`.

parse-tag-error = DoenetML naiporãiva: Javy tag `<{ $tagName }>` ryepýpe

parse-attribute-missing-value = DoenetML naiporãiva: Teroja `{ $attribute }` naiporãiva ndoguerekóiva tepy.

parse-attribute-invalid = DoenetML naiporãiva: Teroja `{ $attribute }` naiporãi

parse-attribute-value-invalid = DoenetML naiporãiva: Teroja tepy `{ $value }` naiporãi

parse-attribute-value-quote-mismatch = DoenetML naiporãiva: Teroja tepy `{ $value }` naiporãi. Ñe'ẽ ra'ãha ndojojái. Nde ndoguerekói peteĩ `{ $quote }`

parse-open-tag-name-missing = DoenetML naiporãiva: Ojejuhu tag téra'ỹva, techapyrã `<`

parse-tag-not-closed = DoenetML naiporãiva: Tag `{ $tag }` ndoñembotýi (peteĩ `>` ndaipóri).

parse-self-closing-tag-name-missing = DoenetML naiporãiva: Ojejuhu tag téra'ỹva `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML naiporãiva: Tag `{ $tag }` ndoñembotýi (`/>` ndaipóri).

parse-tag-invalid-attributes = DoenetML naiporãiva: Tag `{ $tag }` naiporãi. Ikatu oguereko teroja naiporãiva.

parse-close-tag-name-missing = DoenetML naiporãiva: Ojejuhu tag mboty téra'ỹva, techapyrã `</`

parse-attribute-value-unquoted = Teroja tepy oĩ va'erã ñe'ẽ ra'ãha ryepýpe: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML naiporãiva: Ojejuhu tag mboty `{ $tag }`, hákatu ndaipóri tag jepe'a ojojáva

parse-close-tag-mismatched = DoenetML naiporãiva: Tag mboty ndojojái. Ojeha'arõ `</{ $expected }>`. Ojejuhu `{ $found }`

parser-node-unconvertible = Ndaikatúi oñemoambue node { $node } Dast node ramo.

## Names

name-attribute-invalid =
    Teroja name='{ $name }' naiporãi. { $reason ->
        [characters] Térape ikatu oĩ achegety, papapy, kytã yvypegua térã kytã pukúnte.
       *[start] Téra oñepyrũ va'erã peteĩ achegety ndive.
    }

component-name-invalid-start = Apyra téra "{ $name }" naiporãi. Téra oñepyrũ va'erã peteĩ achegety ndive.

## `<answer>` sugar

answer-video-watched-missing-video = Mbohovái videoWatched mba'eichagua oguereko va'erã peteĩ video teroja

answer-video-watched-video-not-reference = Mbohovái videoWatched mba'eichagua oguereko va'erã video teroja ha'éva peteĩ jehechauka

answer-name-not-single-text = Mbohovái name teroja oguereko va'erã peteĩ jehaipy ra'ýnte

## Referencing another document

external-doenetml-recursion-limit = Ndaikatúi ojejuhu DoenetML okapegua, hetaitereígui jeykekue. Oĩpiko peteĩ jehechauka apu'a?

external-doenetml-unavailable = Ndaikatúi ojejuhu DoenetML { $attribute }="{ $uri }"-gui

external-doenetml-type-mismatch = DoenetML naiporãiva ojejuhu { $attribute }="{ $uri }"-gui: ndojojái apyra mba'eichagua "{ $componentType }" ndive

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Teroja `{ $from }` ndojeporuvéima; eporu `{ $to }`.
       *[other] [deprecation] Teroja `{ $from }` `<{ $component }>` rehe ndojeporuvéima; eporu `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Teroja `{ $from }` ndojeporuvéima ha ojehejarei, `{ $to }` avei oñemoĩgui.
       *[other] [deprecation] Teroja `{ $from }` `<{ $component }>` rehe ndojeporuvéima ha ojehejarei, `{ $to }` avei oñemoĩgui.
    }

deprecated-attribute-ignored = [deprecation] Teroja `{ $attribute }` `<{ $component }>` rehe ndojeporuvéima ha ojehejarei.

deprecated-attribute-to-child = [deprecation] Teroja `{ $attribute }` `<{ $component }>` rehe ndojeporuvéima; eporu peteĩ `<{ $child }>` ra'y.

deprecated-attribute-value-renamed = [deprecation] Tepy `{ $value }` teroja `{ $attribute }` `<{ $component }>` rehe ndojeporuvéima; eporu `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` ikatu ombohetave inglés ñe'ẽnte, upévare ijehaipy opyta upéichante peteĩ kuatia { $locale } ñe'ẽme ojehaipyrépe. Ehai hetáva voi, térã emoĩ `pluralForm` teroja ndive.


## Checking against the schema

schema-element-unrecognized = Apyra `<{ $tag }>` ndaha'éi apyra Doenet ojekuaáva.

schema-element-not-allowed-at-root = Apyra `<{ $tag }>` ndojeguerekói kuatia rapópe.

schema-element-not-allowed-inside = Apyra `<{ $tag }>` ndojeguerekói `<{ $parent }>` ryepýpe.

schema-attribute-unrecognized = Apyra `<{ $tag }>` ndoguerekói teroja `{ $attribute }` hérava.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Teroja `{ $attribute }` apyra `<{ $tag }>` rehe tysỹi va'erã, peteĩteĩ apyra ko'ãvagui peteĩ: { $allowed }
       *[other] Teroja `{ $attribute }` apyra `<{ $tag }>` rehe ko'ãvagui peteĩ va'erã: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ojehecháva téra naiporãi select peguarã.  Ojehecháva téra { $variantName } ojehecha { $numOptions } poravorãme hákatu poravorã papapy { $numToSelect }.

select-variant-name-without-options = Oĩ ojehecháva oñemoĩva select peguarã hákatu ndaipóri poravorã ko ojehecháva téra ikatúvape guarã: { $variantName }.

select-variant-name-not-possible = Ojehecháva téra { $variantName } oñemoĩva select peguarã ndaha'éi ojehecháva téra ikatúva.

select-too-few-options = Ndaikatúi oiporavo { $numToSelect } apyra { $numOptions }-gui añónte.

select-from-sequence-too-few-values = Ndaikatúi oiporavo { $numToSelect } tepy peteĩ jekupyty { $length } pukukue oguerekóvagui.

select-from-sequence-indices-count-mismatch = indices papapy oñemoĩva select peguarã ojoja va'erã poravorã papapy ndive

select-from-sequence-indices-not-integers = Opa indices oñemoĩva select peguarã papapy oĩmbáva va'erã

select-from-sequence-index-excluded = selectfromsequence index oñemoĩva oñemboyke

select-from-sequence-indices-excluded-combination = selectfromsequence indices oñemoĩva ha'e ñembojoaju oñemboykepyre

select-from-sequence-coprime-not-positive-integers = Ndaikatúi oiporavo coprime ñembojoaju, papapy oĩmbáva michĩ'ỹva ndojeporavóigui.

select-from-sequence-coprime-common-factor = Ndaikatúi oiporavo papapy coprime. Opa tepy ikatúva oguereko peteĩ mba'e ojoguáva. ("from" térã "to" oñemoĩva coprime va'erã "step" ndive.)

select-from-sequence-coprime-single-number = Ndaikatúi oiporavo coprime ñembojoaju peteĩ papapy 1 ndaha'éivagui.

select-from-sequence-excluded-too-many-combinations = 70% ári ñembojoaju oñemboyke selectFromSequence-pe

select-from-sequence-coprime-none-found = Ndaikatúi oiporavo papapy coprime. Opa tepy ikatúva oguereko peteĩ mba'e ojoguáva.

select-from-sequence-too-few-unique-values = Ndaikatúi oiporavo { $numToSelect } tepy ha'eñóva peteĩ jekupyty { $numPossibleValues } pukukue oguerekóvagui

select-prime-numbers-too-few-values = Ndaikatúi oiporavo { $numToSelect } tepy peteĩ papapy primo tysỹi { $numValues } pukukue oguerekóvagui

select-prime-numbers-values-count-mismatch = Tepy papapy oñemoĩva select peguarã ojoja va'erã poravorã papapy ndive

select-prime-numbers-values-not-prime = Opa tepy oñemoĩva select papapy primo peguarã oĩ va'erã papapy primo tysỹipe

select-prime-numbers-values-excluded-combination = selectPrimeNumbers tepy oñemoĩva ha'e ñembojoaju oñemboykepyre

select-prime-numbers-excluded-too-many-combinations = 70% ári ñembojoaju oñemboyke selectPrimeNumbers-pe

select-random-combination-fluke = Mba'e ikatu'ỹva rupi, ndaikatúi oiporavo tepy poravopyre ñembojoaju

select-random-value-fluke = Mba'e ikatu'ỹva rupi, ndaikatúi oiporavo tepy poravopyre
