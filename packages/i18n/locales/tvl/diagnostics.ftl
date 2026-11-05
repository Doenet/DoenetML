# Tuvaluan (te ggana Tuvalu) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Dialect, orthography, number and gender are as `content.ftl`'s header sets
# them out: **southern (Funafuti–Vaitupu)**, geminate consonants written double
# («ggana», «ttau», «ttou»), long vowels unmarked, no grammatical gender, no
# `$role` fork, and no plural marking on a noun after a numeral.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# **Counted messages.** A Tuvaluan noun takes no ending for number and a
# numeral in front of it changes nothing, so where English's two branches
# differ only in the number of a noun this file writes **one unselected form**.
# Where they differ in something else — `field-function-wrong-num-outputs`,
# whose branches name different things entirely — `one` and `*[other]` are
# kept so that no branch goes missing. `Intl.PluralRules` has no CLDR data for
# `tvl` and resolves against the runtime's default locale, so a `[two]`,
# `[few]` or `[many]` branch would be text nothing could select.
#
# **Recurring frames**, kept the same throughout so the file reads as one voice:
#   «E se mafai o …»        cannot …
#   «E se fakaaogaa …»      … is ignored (literally: is not used)
#   «E se tonu …»           … is invalid
#   «e ttau o …»            … must …
#   «E seki fai …»          … has not been implemented
#   «ne tuku»               … that was specified
#   «e se maua»             … cannot be found
#
# **Terms shared with the other three files** (see `editor.ftl`): «uiga»
# attribute, «fakasinoga» reference, «vaega» component, «mea sē» error,
# «fakaeteete» warning, «avanoa faigofie» accessibility, «tau» value, «suiga»
# variable, «numela» number. «vaega» does double duty — it is *component* here
# and *part* in `content.ftl`'s `section-name` — and a reviewer may well want
# to separate the two.
#
# **`locales/tkl` (Tokelauan) is a sibling in this batch.** The two catalogs
# are expected to look alike; their agreement is not evidence that either is
# right, since one process produced both from one set of inferences.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = E se fakaaogaa a { $attributes } kafai ne tuku a pito e lua

line-segment-attributes-ignored-with-endpoint-and-midpoint = E se fakaaogaa a { $attributes } kafai ne tuku fakatasi te pito mo te poini ogatotonu

line-segment-midpoint-offset-without-midpoint = E seai se aogaa o te midpointOffset kafai e seai se poini ogatotonu

## `<line>`

line-points-undetermined-dimensions = Se laina e uu i poini e se iloa olotou fuataga.

line-points-too-few-dimensions = E ttau o uu te laina i poini e lua ne fuataga i te tokosi ifo.

line-points-depend-on-variables = E uu te laina i poini e fakalagolago ki suiga: { $variables }.

line-equation-invalid-format = E se tonu te fakatulagaga o te fakatusa laina i suiga { $variable1 } mo te { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ne tuku te laina fakasino e auala i te through, te endpoint mo te direction. E se fakaaogaa te through ne tuku.

ray-dimension-mismatch = E se fetaui te numDimensions i te laina fakasino.

## `<vector>`

vector-overprescribed-head = Ne tuku te veketa e auala i te head, te tail mo te displacement. E se fakaaogaa te head ne tuku.

vector-dimension-mismatch = E se fetaui te numDimensions i te veketa.

## Attracting and constraining

attract-to-without-nearest-point = E se mafai o tosina ki se `<{ $component }>` ona e seai sena suiga tulaga nearestPoint.

constrain-to-without-nearest-point = E se mafai o fakatapula ki se `<{ $component }>` ona e seai sena suiga tulaga nearestPoint.

constrain-to-interior-without-nearest-point = E se mafai o fakatapula ki loto o se `<{ $component }>` ona e seai sena suiga tulaga nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = E se fakaaogaa te labelPosition mo se choiceInput e se inline

## Ordering children by index

choice-input-indices-count-mismatch = E se fakaaogaa a indices ne tuku mo te choiceInput ona e se fetaui te aofaki o indices mo te aofaki o fanau choice.

pretzel-indices-count-mismatch = E se fakaaogaa a indices ne tuku mo te problem ona e se fetaui te aofaki o indices mo te aofaki o fanau problem.

shuffle-indices-count-mismatch = E se fakaaogaa a indices ne tuku mo te shuffle ona e se fetaui te aofaki o indices mo te aofaki o vaega.

indices-ignored-out-of-range = E se fakaaogaa a indices ne tuku mo te { $component } ona e isi ne indices i tua o te tapulaa.

pretzel-indices-repeated = E se fakaaogaa a indices ne tuku mo te pretzel ona e toe fai nisi indices.

pretzel-circuit-first-index = E se fakaaogaa a indices ne tuku mo te pretzel i te mode circuit ona e ttau o 1 te index muamua.

## `<shuffle>` and `<sort>`

string-children-need-type = Ke galue te `<{ $component }>` mo fanau e ne kupu, e ttau o tuku te uiga `type`.

invalid-type-defaulting-to-math = E se tonu te type { $type } mo te vaega { $component }. E ttau o math, text, number, io me boolean. Ka fakaaogaa te math.

string-not-valid-component-to-arrange = Te kupu "{ $value }" e se vaega tonu mo te { $component }. E se fakaaogaa.

## Types and variables

invalid-type-defaulting-to-number = E se tonu te type { $type }, ka fakatoka te type ki te number.

invalid-variable-value = E se tonu te tau o se suiga: `{ $value }`

## Variants

variant-index-must-be-number = E ttau o numela te index fesuiaiga { $index }

variant-index-must-be-integer = E ttau o numela katoa te index fesuiaiga { $index }

## `<sideBySide>`

side-by-side-absolute-widths = E seki fai te `<{ $component }>` mo fuataga tumau. Ka fakatoka a lautele ki te fakatusatusa.

side-by-side-absolute-margins = E seki fai te `<{ $component }>` mo fuataga tumau. Ka fakatoka a tuakoi ki te fakatusatusa.

side-by-side-no-block-child = E se tonu te `<{ $component }>`: e ttau o isi sena tama poloka e tasi i te tokosi ifo.

## `<label>`

label-for-ignored-on-graphical = E se fakaaogaa te uiga `for` i luga o se `<label>` ata.

label-for-must-resolve-to-one = E ttau i te uiga `for` i luga o te `<label>` o fakasino ki se vaega e tasi.

label-for-unresolved = Ne seki mafai ne te uiga `for` i luga o te `<label>` o fakasino ki se vaega.

label-for-answer-with-authored-inputs = E fakasino te uiga `for` i luga o te `<label>` ki se `<answer>` e isi ana mea faiga ne tusi ne te tusitala; fakasino tonu ki te mea faiga.

label-for-answer-without-input = E fakasino te uiga `for` i luga o te `<label>` ki se `<answer>` e seai sena mea faiga e fakaigoa.

label-for-must-reference-input-or-answer = E ttau i te uiga `for` i luga o te `<label>` o fakasino ki se mea faiga io me se answer.

## Accessibility

accessibility-short-description-or-decorative = Mo avanoa faigofie, e ttau i te `<{ $component }>` o isi sena fakamatalaga toetoe io me tuku e pelā mo se teuteuga.

accessibility-video-short-description = Mo avanoa faigofie, e ttau i te `<video>` o isi sena fakamatalaga toetoe.

accessibility-input-short-description-or-label = Mo avanoa faigofie, e ttau i te `<{ $component }>` o isi sena fakamatalaga toetoe io me se igoa.

accessibility-answer-input-short-description-or-label = Mo avanoa faigofie, e ttau i se `<answer>` e fai ne ia se mea faiga o isi sena fakamatalaga toetoe io me se igoa.

accessibility-short-description-contains-math = E se ttau o isi ne vaega matematika e pelā mo te `<{ $component }>` i loto i fakamatalaga toetoe. Tusi te matematika ki kupu.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] E se lava te kesekesega o te { $colorName } mo te tusitusiga o te ulutala mataupu (mode pouli) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e manakogina te { $threshold }:1 i te tokosi ifo).
       *[other] E se lava te kesekesega o te { $colorName } mo te tusitusiga o te ulutala mataupu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e manakogina te { $threshold }:1 i te tokosi ifo).
    }

## `<circle>`

circle-through-points-non-numerical = E seki fai te `<circle>` e uu i poini e { $count } kafai e seai ne tau numela o poini.

circle-too-many-through-points = E se mafai o fuafua se liko e uu i poini e sili atu i te 3.

circle-overprescribed-radius-center-points = E se mafai o fuafua se liko kafai ne tuku te radius, te ogatotonu mo poini.

circle-center-with-multiple-points = E se mafai o fuafua se liko mo te ogatotonu ne tuku e uu i poini e sili atu i te 1.

circle-radius-too-small = E se mafai o fuafua te liko: ona ko te mmao i te va o poini e lua ko { $distance }, e foliki ttoo te radius { $radius } ne tuku.

circle-radius-with-many-points = E se mafai o fai se liko e uu i poini e sili atu i te lua mo se radius ne tuku.

circle-invalid-center-or-through-points = E se tonu te ogatotonu io me poini e uu ki ei te liko.

circle-radius-center-with-multiple-points = E se mafai o fuafua te radius o te liko mo te ogatotonu ne tuku e uu i poini e sili atu i te 1.

circle-change-radius-non-numerical = E se mafai o sui te radius o te liko kafai e seai ne tau numela o poini e uu ki ei

circle-radius-with-points-non-numerical = E se mafai o fai se liko e uu i poini e sili atu i te tasi mo se radius ne tuku kafai e seai ne tau numela.

circle-change-center-non-numerical = E seki fai te suiga o te ogatotonu o se liko e uu i poini e seai ne tau numela.

## `<function>`

function-domain-insufficient-dimensions = E se lava ne fuataga mo te domain o te galuega. E { $intervals } vaitaimi o te domain kae e { $inputs } mea ulu ki loto o te galuega.

function-domain-invalid-format = E se tonu te fakatulagaga o te domain mo te galuega.

function-ignoring-non-numerical =
    { $type ->
        [maximum] E se fakaaogaa te maximum o te galuega ona e se numela.
        [minimum] E se fakaaogaa te minimum o te galuega ona e se numela.
        [extremum] E se fakaaogaa te extremum o te galuega ona e se numela.
        [point] E se fakaaogaa te poini o te galuega ona e se numela.
        [slope] E se fakaaogaa te fakasolo o te galuega ona e se numela.
       *[other] E se fakaaogaa te { $type } o te galuega ona e se numela.
    }

function-ignoring-empty =
    { $type ->
        [maximum] E se fakaaogaa te maximum gaogao o te galuega.
        [minimum] E se fakaaogaa te minimum gaogao o te galuega.
        [extremum] E se fakaaogaa te extremum gaogao o te galuega.
        [point] E se fakaaogaa te poini gaogao o te galuega.
       *[other] E se fakaaogaa te { $type } gaogao o te galuega.
    }

function-points-too-close = E isi ne poini e lua o te galuega e pili ttoo olotou koga. E se mafai o fakauiga te galuega.

function-iterates-input-output-mismatch = E mafai fua ne fakafoki o te galuega kafai e tai tasi te aofaki o mea ulu ki loto mo te aofaki o mea ttau mai. E { $inputs } mea ulu ki loto o te galuega tenei kae e { $outputs } mea ttau mai.

## `<sequence>`

sequence-invalid-length = E se tonu te loa o te sequence. E ttau o numela katoa e se fakaitiiti ifo i te 0.

sequence-invalid-step = E se tonu te step o te sequence. E ttau o numela mo se sequence o te type { $type }.

sequence-invalid-endpoint-number = E se tonu te "{ $attribute }" o te sequence numela. E ttau o numela.

sequence-invalid-endpoint-letters = E se tonu te "{ $attribute }" o te sequence mataitusi. E ttau o se tuufakatasiga mataitusi.

sequence-invalid-endpoint = E se tonu te "{ $attribute }" o te sequence.

select-from-sequence-coprime-not-numbers = E se fakaaogaa te coprime ona e se filifili ne numela

select-from-sequence-coprime-with-exclude-combinations = E se fakaaogaa te coprime ona ne tuku te excludeCombinations

## Resolving a `target`

target-not-found = E se tonu te target mo te `<{ $source }>`: e se maua te target.

target-state-variable-not-found = E se tonu te target mo te `<{ $source }>`: e se maua se suiga tulaga e igoa ki te "{ $property }" i luga o se `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = E ttau i suiga o te `<odeSystem>` o kese mai te suiga tutokotasi.

ode-system-duplicate-variable-names = E se mafai o fakauiga a galuega ODE RHS mo igoa suiga e tai tasi.

ode-system-rhs-function-error = E se mafai o fakauiga te galuega ODE RHS. Ne isi se mea sē i te faiga o te galuega mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = E se mafai o fakauiga se tulimanu i te va o laina e { $count }

angle-invalid-through-point = E se tonu te poini i te through o te `<angle>`

parabola-vertex-too-many-points = E seki fai te palapola mo te tumu e uu i poini e sili atu i te 1.

parabola-too-many-points = E seki fai te palapola e uu i poini e sili atu i te 3.

intersection-too-many-items = E seki fai te fetaulaiga mo mea e sili atu i te lua

## Other math components

ionic-compound-not-two-ions = E seki fai te tuufakatasiga ionika mo se mea kese mai ions e lua.

ionic-compound-needs-cation-and-anion = Ne fai fua te tuufakatasiga ionika mo te cation e tasi mo te anion e tasi.

solve-equations-cannot-evaluate = E se mafai o fofo te fakatusa ona e se mafai o fuafua te fakatusa: { $equation }

math-operators-operand-number-required = E ttau o tuku se operandNumber kafai e tosi mai se operand matematika.

eigen-decomposition-failed = E se mafai o fuafua a eigenvalues o te matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: e se maua a { $parameters } i te pattern, telaa la ka fetaui faeloa mo se koga gaogao.

## `<graph>`

graph-grid-invalid = `<graph>`: e se mafai o iloa te grid="{ $grid }". E ttau o none, medium, dense, io me ne numela e lua e sili atu i te 0 kae e vaevae ne se avanoa, e pelā mo te grid="1 0.5". E seai se grid e tusi.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` e manakogina se galuega mo { $expected ->
        [one] te mea ttau mai e tasi, ko te fakasolo y' i poini takitasi, e pelā mo te `y - x`
       *[other] mea ttau mai e lua, ko te veketa i poini takitasi, e pelā mo te `(y, -x)`
    }, kae e { $found ->
        [one] { $found } mea ttau mai o te galuega ne tuku
       *[other] { $found } mea ttau mai o te galuega ne tuku
    }. { $alternative ->
        [none] E seai se mea e tusi.
       *[other] Ko te `<{ $alternative }>` te vaega mo te galuega tenaa. E seai se mea e tusi.
    }

field-function-attribute-ignored-with-child = E se fakaaogaa te uiga `function` ona ne tuku foki te galuega i loto i te vaega; ko te mea i loto e fakaaogaa. Tuku te galuega i te auala e tasi fua.

field-variables-ignored =
    `<{ $component }>`: e fakaigoa ne te uiga `variables` a suiga o se fakamatalaga ne tusi tonu i loto i te vaega. { $reason ->
        [function-child] Ne tuku te galuega i konei e pelā mo se tama `<function>`, telaa e fakaigoa ne ia ana suiga, tela la e se fakaaogaa te `variables`.
       *[no-expression] E seai se fakamatalaga pelā i konei, tela la e se fakaaogaa te `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: e se mafai o fakaaogaa te xLabelPosition="left" i te prefigure renderer; e fakaaogaa te faiga o te right.

prefigure-y-label-position-unsupported = `<graph>`: e se mafai o fakaaogaa te yLabelPosition="bottom" i te prefigure renderer; e fakaaogaa te faiga o te top.

prefigure-invalid-axis-bounds = `<graph>`: e se tonu a tuakoi o te axis mo te liliuga prefigure; e fakaaogaa te bbox masani (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: e se tonu te lautele mo te liliuga prefigure; e fakaaogaa te lautele masani o te ata 425.

prefigure-invalid-aspect-ratio = `<graph>`: e se tonu te aspectRatio mo te liliuga prefigure; e fakaaogaa te aspect ratio masani 1.

prefigure-grid-spacing-too-fine = `<graph>`: e pili ttoo te va o laina o te malae fuafua mo tuakoi o te axis; e se tusi te malae fuafua i te prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: e se tusi a annotations kafai e se fakaaogaa te PreFigure renderer.

multiple-annotations-children = E uke a fanau `<annotations>` ne maua i te `<graph>`; e se fakaaogaa a mea katoa kae ko te mea fakaoti fua.

## Referring to other components

copy-unrecognized-component-type = E se mafai o fakaloaloa io me kopi se vaega e se iloa tena type: { $type }.

copy-prop-not-found = E se maua te prop { $property } i luga o se vaega o te type { $component }

collect-no-source = E seai se source ne maua mo te collect.

collect-invalid-component-type = E se mafai o tanumaki ne vaega o te type `<{ $component }>` ona e se type tonu.

reference-index-unavailable = E se mafai o fakasino ki te index `{ $reference }`

## `<callAction>`

component-action-unavailable = E se mafai o kalaga ki te { $action } i luga o te vaega `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = E se tonu te foliga o te data. E se tai tasi te loa o laina. Ne maua i te componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = E isi ne igoa koluma e tai tasi i te data. Ne maua i te componentIdx :{ $componentIdx }

data-frame-missing-column-name = E galo se igoa koluma o te data. Ne maua i te componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = E fakavae se award o te tali tenei ki te tali telotou eiloa ne kave, telaa ka fai ei ne mea e se fakamoemoeina.

answer-max-num-attempts-in-section-wide-check-work = E seai se aogaa o te tukuga o te `maxNumAttempts` i luga o se `<answer>` i loto i se pusa mo te `sectionWideCheckWork`, ona e pule te pusa ki te aofaki o taumafaiga. Tuku te `maxNumAttempts` i luga o te pusa.

nested-section-wide-check-work-max-num-attempts = E seai se aogaa o te tukuga o te `maxNumAttempts` i luga o se pusa mo te `sectionWideCheckWork` telaa e i loto i se isi pusa mo te `sectionWideCheckWork`, ona e pule te pusa i tua ki te aofaki o taumafaiga. Tuku te `maxNumAttempts` i luga o te pusa i tua.

answer-attributes-need-symbolic-equality = E seai se aogaa o te uiga { $attributes } kafai e seki tuku te symbolicEquality.

answer-invalid-type = E se tonu te type mo te answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ona e seai se igoa o te vaega `<{ $component }>`, e se mafai o fakaaogaa mo se uiga o te module

module-attribute-name-already-defined = E se mafai o fakaaogaa te vaega `<{ $component } name="{ $name }">` e pelā mo se uiga o se module ona ko oti ne isi se uiga "{ $name }" o te type `<module>`.

conditional-content-condition-ignored = E se fakaaogaa te uiga `condition` i luga o se vaega `<conditionalContent>` e isi ana fanau case io me else.

slider-markers-type-mismatch = E se fetaui te type o markers mo te type o te slider.

pretzel-problem-needs-statement-and-answer = E se tonu te pretzel: e ttau i `<problem>` takitasi o isi sena `<statement>` e tasi mo sena `<answer>` e tasi.

pretzel-circuit-first-problem-distractor = E se tonu te pretzel: i te mode="circuit", e se mafai o distractor te `<problem>` muamua.

## Attribute values

attribute-invalid-values = E se tonu te tau { $values } mo te uiga `{ $attribute }`; e se fakaaogaa.

attribute-must-be-references = E se tonu te tau `{ $value }` mo te uiga `{ $attribute }`. E ttau o fai te uiga ki fakasinoga e kamata i se `$`.

math-input-invalid-function-names = <mathInput>: e se fakaaogaa a igoa galuega e se tonu i te { $attribute }: { $names }. E ttau i te koga fakaasi o te igoa takitasi o 2 mataitusi io me sili atu (mataitusi io me tosi); e mafai foki o oti i se `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = E se tonu te type o te vaega: `<{ $componentType }>`

attribute-repeated = E se mafai o toe fai te uiga { $attribute }.

attribute-invalid-for-component = E se tonu te uiga "{ $attribute }" mo se vaega o te type `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    E se lava te kesekesega o te style definition { $styleNumber } mo te { $context ->
        [text-on-background] lanu o te tusitusiga mo te lanu o te koga tua
        [high-contrast] lanu kesekese ttoo mo te laupepa
        [line] lanu o te laina mo te laupepa
        [marker] lanu o te fakailoga mo te laupepa
       *[text-on-canvas] lanu o te tusitusiga mo te laupepa
    }{ $mode ->
        [dark] { " (mode pouli)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e manakogina te { $threshold }:1 i te tokosi ifo).

style-definition-dark-mode-text-background-contrast =
    E ui eiloa i te lava o te kesekesega o lanu ne tuku i te style definition { $styleNumber } mo te mode maalama, e se lava te kesekesega o te lanu o te tusitusiga mo te lanu o te koga tua i lanu o te mode pouli ne maua mai i ei ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e manakogina te { $threshold }:1 i te tokosi ifo). { $suggestion ->
        [available] Ke lava te kesekesega i te mode pouli, fakalasi te kesekesega o te mode maalama (e pelā mo te tukuga o te { $lightAttribute }="{ $lightColor }") io me sui te lanu o te mode pouli (e pelā mo te tukuga o te { $darkAttribute }="{ $darkColor }").
       *[none] Ke lava te kesekesega i te mode pouli, fakalasi te kesekesega o te mode maalama io me sui a lanu ne maua mai i ei mo te textColorDarkMode mo te backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    E ui eiloa i te lava o te kesekesega o te lanu o te tusitusiga ne tuku i te style definition { $styleNumber } mo te mode maalama, e se lava te kesekesega o te lanu o te tusitusiga o te mode pouli ne maua mai i ei mo te laupepa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e manakogina te { $threshold }:1 i te tokosi ifo). { $suggestion ->
        [available] Ke lava te kesekesega i te mode pouli, fakalasi te kesekesega o te mode maalama (e pelā mo te tukuga o te textColor="{ $lightColor }") io me sui te lanu o te mode pouli (e pelā mo te tukuga o te textColorDarkMode="{ $darkColor }").
       *[none] Ke lava te kesekesega i te mode pouli, fakalasi te kesekesega o te mode maalama io me sui te lanu ne maua mai i ei mo te textColorDarkMode.
    }

section-multiple-style-palettes = E mafai fua ne se mataupu o filifili se <stylePalette> e tasi; e fakaaogaa te mea fakaoti.

## Unique variants

variant-num-to-select-not-non-negative-integer = e se mafai o iloa a fesuiaiga tokotasi o te { $component } ona e se numela katoa e se fakaitiiti ifo i te 0 te numToSelect.

variant-num-to-select-not-constant-number = e se mafai o iloa a fesuiaiga tokotasi o te { $component } ona e se numela tumau te numToSelect.

variant-with-replacement-not-constant-boolean = e se mafai o iloa a fesuiaiga tokotasi o te { $component } ona e se boolean tumau te withReplacement.

variant-select-weight-disables-unique = E se mafai a fesuiaiga tokotasi mo te select kafai e isi se option mo te selectWeight io me te selectForVariants ne tuku

variant-coprime-undetermined = e se mafai o iloa a fesuiaiga tokotasi o te { $component } ona e se mafai o iloa me e sē faeloa te coprime.

variant-attribute-not-constant = e se mafai o iloa a fesuiaiga tokotasi o te { $component } ona e se tumau te { $attribute }.

variant-attribute-not-number = e se mafai o iloa a fesuiaiga tokotasi o te { $component } ona e se numela te { $attribute }.

variant-attribute-wrong-type-for-sequence =
    e se mafai o iloa a fesuiaiga tokotasi o te { $component } o te type { $type } ona e se { $expected ->
        [letters-combination] tuufakatasiga mataitusi
        [math-expression] fakamatalaga matematika tonu
        [integer] numela katoa
       *[number] numela
    } te { $attribute }.

variant-length-not-integer = e se mafai o iloa a fesuiaiga tokotasi o te { $component } ona e se numela katoa te length.

variant-sort-not-implemented = e seki fai a fesuiaiga tokotasi o se { $component } mo te sort

variant-exclude-combinations-not-implemented = e seki fai a fesuiaiga tokotasi o se { $component } mo te excludeCombinations

variant-math-exclude-not-implemented = e seki fai a fesuiaiga tokotasi o se { $component } o te type math mo te exclude

variant-non-constant-exclude-not-implemented = e seki fai a fesuiaiga tokotasi o se { $component } mo se exclude e se tumau

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: e se mafai o fakaaogaa i te graph prefigure renderer; e se fakaaogaa te tama.

prefigure-descendant-invalid-geometry = { $subject }: e se katoa io me e se gata te foliga; e se fakaaogaa te tama.

prefigure-curve-label-omitted = { $subject }: e se mafai o fakaaogaa ne igoa i luga o vaega piko ne liliu; e se tusi te igoa.

prefigure-curve-unsupported-definition-type = { $subject }: e se mafai o fakaaogaa te type o te fakauigaga o te galuega piko '{ $definitionType }'; e se fakaaogaa te tama.

prefigure-region-flip-functions-unsupported = { $subject }: e se mafai o fakaaogaa te uiga flipFunctions i luga o te regionBetweenCurves; e se fakaaogaa te tama.

prefigure-region-non-formula-child = { $subject }: e mafai fua ne galuega fanau o te type formula i luga o te regionBetweenCurves; e se fakaaogaa te tama.

prefigure-label-position-unsupported =
    { $subject }: e se mafai o fakaaogaa te labelPosition '{ $labelPosition }' mo te { $labelKind ->
        [line-family] igoa o te kau laina
       *[point] igoa o te poini
    }; e fakaaogaa te fakatokaga masani a PreFigure.

prefigure-fill-style-unsupported = { $subject }: e se mafai ne PreFigure o fakaaogaa te fill style '{ $fillStyle }'; e fakaaogaa se fakafonuga tumau.

prefigure-line-style-unknown = { $subject }: e se iloa te line style '{ $lineStyle }', tela la e se tuku ki te mea e ttau mai i te PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: ne liliu te marker style '{ $markerStyle }' ki te style 'diamond' a PreFigure.

prefigure-marker-style-unsupported = { $subject }: e se mafai ne PreFigure o fakaaogaa te marker style '{ $markerStyle }'; e fakaaogaa te style masani.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: e se tonu te `ref`; e se maua te target. E se tusi te annotation.

annotation-ref-multiple-targets = `<annotation>`: ne fakasino te `ref` ki ne targets e uke; e fakaaogaa te target muamua.

annotation-ref-outside-graph = `<annotation>`: e se tonu te `ref`; e i tua te target i te graph telaa e i loto ki ei. E se tusi te annotation.

annotation-ref-unsupported-target = `<annotation>`: e se tonu te `ref`; e se vaega ata e mafai o fakaaogaa i te liliuga prefigure te target. E se tusi te annotation.

annotation-text-missing = `<annotation>`: e galo io me gaogao te `text`; e tuku atu se tusitusiga gaogao.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ne maua se fakalagolagoga fakatakamilo.
       *[other] Ne maua se fakalagolagoga fakatakamilo e aofia ei se vaega `<{ $componentType }>`.
    }

reference-no-referent = Seai se mea ne maua mo te fakasinoga: `{ $reference }`

reference-multiple-referents = E uke a mea ne maua mo te fakasinoga: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = E se tonu te fakatulagaga o te uiga { $attribute } o te `<{ $componentType }>`.

children-invalid = E se tonu a fanau o te `<{ $componentType }>`: Ne maua a fanau e se tonu: { $children }

## Falling back to a default

attribute-value-invalid-using-default = E se tonu te tau `{ $value }` mo te uiga `{ $attribute }`, e fakaaogaa te tau `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] E se maua te fesuiaiga DoenetML { $version }.
       *[other] E se maua te fesuiaiga DoenetML { $version }. E fakaaogaa te fesuiaiga { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML e se tonu: { $content }

parse-tag-missing-close-tag = DoenetML e se tonu: E seai se fakailoga pono o te fakailoga `{ $tag }`. E manakogina se fakailoga e pono i a ia eiloa io me se fakailoga `</{ $tagName }>`.

parse-tag-error = DoenetML e se tonu: E isi se mea sē i te fakailoga `<{ $tagName }>`

parse-attribute-missing-value = DoenetML e se tonu: E foliga mai e galo te tau o te uiga `{ $attribute }` e se tonu.

parse-attribute-invalid = DoenetML e se tonu: E se tonu te uiga `{ $attribute }`

parse-attribute-value-invalid = DoenetML e se tonu: E se tonu te tau o te uiga `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML e se tonu: E se tonu te tau o te uiga `{ $value }`. E se fetaui a fakailoga siteki. E foliga mai e galo se `{ $quote }`

parse-open-tag-name-missing = DoenetML e se tonu: Ne maua se fakailoga e seai sena igoa, e pelā mo te `<`

parse-tag-not-closed = DoenetML e se tonu: Ne seki pono te fakailoga `{ $tag }` (e foliga mai e galo se `>`).

parse-self-closing-tag-name-missing = DoenetML e se tonu: Ne maua se fakailoga e seai sena igoa `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML e se tonu: Ne seki pono te fakailoga `{ $tag }` (e foliga mai e galo se `/>`).

parse-tag-invalid-attributes = DoenetML e se tonu: E se tonu te fakailoga `{ $tag }`. E kaataki e isi ne uiga e se tonu.

parse-close-tag-name-missing = DoenetML e se tonu: Ne maua se fakailoga pono e seai sena igoa, e pelā mo te `</`

parse-attribute-value-unquoted = E ttau o tuku a tau o uiga i loto i fakailoga siteki: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML e se tonu: Ne maua te fakailoga pono `{ $tag }`, kae e seai sena fakailoga tala

parse-close-tag-mismatched = DoenetML e se tonu: E se fetaui te fakailoga pono. Ne manakogina se `</{ $expected }>`. Ne maua se `{ $found }`

parser-node-unconvertible = Ne seki mafai o liliu te node { $node } ki se Dast node.

## Names

name-attribute-invalid =
    E se tonu te igoa o te uiga name='{ $name }'. { $reason ->
        [characters] E mafai fua o isi ne mataitusi, numela, tosi i lalo io me tosi i loto i igoa.
       *[start] E ttau o kamata a igoa i se mataitusi.
    }

component-name-invalid-start = E se tonu te igoa o te vaega "{ $name }". E ttau o kamata a igoa i se mataitusi.

## `<answer>` sugar

answer-video-watched-missing-video = E ttau i se answer o te type videoWatched o isi sena uiga video

answer-video-watched-video-not-reference = E ttau i se answer o te type videoWatched o fai tena uiga video mo se fakasinoga

answer-name-not-single-text = E ttau i te uiga name o te answer o isi sena tama text e tasi

## Referencing another document

external-doenetml-recursion-limit = E se mafai o aumai te DoenetML mai tua ona e uke ttoo a fokiga. E isi se fakasinoga fakatakamilo?

external-doenetml-unavailable = E se mafai o aumai te DoenetML mai te { $attribute }="{ $uri }"

external-doenetml-type-mismatch = E se tonu te DoenetML ne aumai mai te { $attribute }="{ $uri }": ne se fetaui mo te type o te vaega "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ko oti ne fakagata te uiga `{ $from }`; fakaaogaa te `{ $to }`.
       *[other] [deprecation] Ko oti ne fakagata te uiga `{ $from }` i luga o te `<{ $component }>`; fakaaogaa te `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ko oti ne fakagata te uiga `{ $from }` kae e se fakaaogaa ona ne tuku foki te `{ $to }`.
       *[other] [deprecation] Ko oti ne fakagata te uiga `{ $from }` i luga o te `<{ $component }>` kae e se fakaaogaa ona ne tuku foki te `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Ko oti ne fakagata te uiga `{ $attribute }` i luga o te `<{ $component }>` kae e se fakaaogaa.

deprecated-attribute-to-child = [deprecation] Ko oti ne fakagata te uiga `{ $attribute }` i luga o te `<{ $component }>`; fakaaogaa se tama `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Ko oti ne fakagata te tau `{ $value }` o te uiga `{ $attribute }` i luga o te `<{ $component }>`; fakaaogaa te `{ $to }`.


## Language coverage

pluralize-english-only = E mafai fua ne te `<pluralize>` o fai te uiga uke i te ggana Peletania, tela la e tuku faeloa tena tusitusiga e pelā mo te tusiga a te tusitala i se pepa ne tusi i te { $locale }. Tusi tonu te uiga uke, io me tuku ki te uiga `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Te elemene `<{ $tag }>` e se elemene Doenet e iloa.

schema-element-not-allowed-at-root = E se mafai o tuku te elemene `<{ $tag }>` i te aka o te pepa.

schema-element-not-allowed-inside = E se mafai o tuku te elemene `<{ $tag }>` i loto o te `<{ $parent }>`.

schema-attribute-unrecognized = E seai se uiga o te elemene `<{ $tag }>` e igoa ki te `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] E ttau i te uiga `{ $attribute }` o te elemene `<{ $tag }>` o fai mo se lisi telaa e tasi ana mea takitasi i konei: { $allowed }
       *[other] E ttau i te uiga `{ $attribute }` o te elemene `<{ $tag }>` o tasi i konei: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = E se tonu te igoa o te fesuiaiga mo te select. E maua te igoa fesuiaiga { $variantName } i options e { $numOptions } kae ko te aofaki e filifili ko { $numToSelect }.

select-variant-name-without-options = Ne tuku ne fesuiaiga mo te select kae e seai ne options ne tuku mo te igoa fesuiaiga: { $variantName }.

select-variant-name-not-possible = Te igoa fesuiaiga { $variantName } ne tuku mo te select e se igoa fesuiaiga e mafai.

select-too-few-options = E se mafai o filifili ne vaega e { $numToSelect } mai i vaega e { $numOptions } fua.

select-from-sequence-too-few-values = E se mafai o filifili ne tau e { $numToSelect } mai i se sequence e { $length } tena loa.

select-from-sequence-indices-count-mismatch = E ttau o fetaui te aofaki o indices ne tuku mo te select mo te aofaki e filifili

select-from-sequence-indices-not-integers = E ttau o numela katoa a indices katoa ne tuku mo te select

select-from-sequence-index-excluded = Ne tuku se index o te selectfromsequence telaa ne fakagata

select-from-sequence-indices-excluded-combination = Ne tuku ne indices o te selectfromsequence telaa se tuufakatasiga ne fakagata

select-from-sequence-coprime-not-positive-integers = E se mafai o filifili ne tuufakatasiga coprime ona e se filifili ne numela katoa e sili atu i te 0.

select-from-sequence-coprime-common-factor = E se mafai o filifili ne numela coprime. E tai tasi te vaega e vaevae ki ei a tau katoa. (E ttau o coprime a tau ne tuku o te "from" io me te "to" mo te "step".)

select-from-sequence-coprime-single-number = E se mafai o filifili ne tuufakatasiga coprime mai i se numela e tasi telaa e se 1.

select-from-sequence-excluded-too-many-combinations = Ne fakagata a tuufakatasiga e sili atu i te 70% i te selectFromSequence

select-from-sequence-coprime-none-found = Ne seki mafai o filifili ne numela coprime. E tai tasi te vaega e vaevae ki ei a tau katoa.

select-from-sequence-too-few-unique-values = E se mafai o filifili ne tau tokotasi e { $numToSelect } mai i se sequence e { $numPossibleValues } tena loa

select-prime-numbers-too-few-values = E se mafai o filifili ne tau e { $numToSelect } mai i se lisi o numela primes e { $numValues } tena loa

select-prime-numbers-values-count-mismatch = E ttau o fetaui te aofaki o tau ne tuku mo te select mo te aofaki e filifili

select-prime-numbers-values-not-prime = E ttau o i loto i te lisi o primes a tau katoa ne tuku mo te select prime number

select-prime-numbers-values-excluded-combination = Ne tuku ne tau o te selectPrimeNumbers telaa se tuufakatasiga ne fakagata

select-prime-numbers-excluded-too-many-combinations = Ne fakagata a tuufakatasiga e sili atu i te 70% i te selectPrimeNumbers

select-random-combination-fluke = I se mea faimaalie e taatasi, ne seki mafai o filifili se tuufakatasiga o tau fuaa

select-random-value-fluke = I se mea faimaalie e taatasi, ne seki mafai o filifili se tau fuaa

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    E se tusi te `<{ $component }>` i loto i te matematika; e tusi te fakamatalaga e pelā mo te faiga muamua i te taimi e seki mafai ei o tuku ne mea faiga ki loto. { $reason ->
        [not-inline] E mafai fua ne se choice input `inline` o ofi ki loto i se fakamatalaga; kafai e seai se `inline` e fai mo se poloka o patana.
        [expanded] Se pusa e uke ona laina te text input `expanded`, telaa e lasi ttoo ke ofi ki loto i se fakamatalaga.
        [on-graph] I luga o se graph e tusi te fakamatalaga e pelā mo se ata e tasi, telaa e seai sena koga mo se mea faiga.
       *[relative-width] E fakatusatusa tena `width` (se pasene io me se `em`), telaa e seai sena mea e fua ki ei i loto i se fakamatalaga. Tuku te lautele i fuataga tumau, e pelā mo te `px`.
    }
