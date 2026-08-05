# Ojibwe diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
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
# Written in the Fiero double-vowel orthography; see `content.ftl`'s header for
# the dialect spread and the animate/inanimate gender.
#
# The counted selects are kept here, unlike in the rest of this batch: Ojibwe
# marks the inanimate plural and the verb agrees with it, so «bezhig» and several
# really are two sentences. See `chrome.ftl`'s header.
#
# Ojibwe negates with a particle and a verb ending together — «gaawiin …
# -sinoon» — so a negated sentence is framed rather than prefixed, and that frame
# is what most of these messages are built on.


## `<lineSegment>`

# The select stays: «-an» is marked on the plural and the verb agrees with it.
line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } gaawiin odaapinigaadesinoon apii niizh ishkwaandeg gii-asigaadeg
       *[other] { $attributes } gaawiin odaapinigaadesinoon apii niizh ishkwaandeg gii-asigaadeg
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } gaawiin odaapinigaadesinoon apii bezhig ishkwaandeg gaye bezhig naawayi'ii gii-asigaadeg
       *[other] { $attributes } gaawiin odaapinigaadesinoon apii bezhig ishkwaandeg gaye bezhig naawayi'ii gii-asigaadeg
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset gaawiin gegoo izhichigesinoon naawayi'ii gaawiin ayaamagasinoon

## `<line>`

line-points-undetermined-dimensions = Jiigaatig mazina'igaansan onji gaawiin gikendaagozisinoon endaso-izhinaagoziwin.

line-points-too-few-dimensions = Jiigaatig da-izhaa mazina'igaansan onji niizh gemaa nawaj endaso-izhinaagoziwin.

line-points-depend-on-variables = Jiigaatig izhaa mazina'igaansan onji aanjisejig onji: { $variables }.

line-equation-invalid-format = Gaawiin gwayak izhinaagoziwin jiigaatig-naasaabiwin { $variable1 } gaye { $variable2 } aanjisejig biinji.

## `<ray>`

ray-overprescribed-through = Waaseyaasing gii-asigaade through, endpoint gaye direction onji.  through gii-asigaadeg gaawiin odaapinigaadesinoon.

ray-dimension-mismatch = numDimensions gaawiin naasaabisinoon waaseyaasing biinji.

## `<vector>`

vector-overprescribed-head = Bekitoor gii-asigaade head, tail gaye displacement onji.  head gii-asigaadeg gaawiin odaapinigaadesinoon.

vector-dimension-mismatch = numDimensions gaawiin naasaabisinoon bekitoor biinji.

## Attracting and constraining

attract-to-without-nearest-point = Gaawiin gashkitoosinoon ji-wiidoopandaman bezhig `<{ $component }>`, gaawiin nearestPoint otayaanzinoon onji.

constrain-to-without-nearest-point = Gaawiin gashkitoosinoon ji-gibaakwa'aman bezhig `<{ $component }>`, gaawiin nearestPoint otayaanzinoon onji.

constrain-to-interior-without-nearest-point = Gaawiin gashkitoosinoon ji-gibaakwa'aman biinji bezhig `<{ $component }>`, gaawiin nearestPoint otayaanzinoon onji.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition gaawiin odaapinigaadesinoon choiceInput gaawiin inline

## Ordering children by index

choice-input-indices-count-mismatch = indices gii-asigaadeg choiceInput onji gaawiin odaapinigaadesinoon, agindaasowin gaawiin naasaabisinoon choice oniijaanisan agindaasowin.

pretzel-indices-count-mismatch = indices gii-asigaadeg problem onji gaawiin odaapinigaadesinoon, agindaasowin gaawiin naasaabisinoon problem oniijaanisan agindaasowin.

shuffle-indices-count-mismatch = indices gii-asigaadeg shuffle onji gaawiin odaapinigaadesinoon, agindaasowin gaawiin naasaabisinoon onji-ayi'iin agindaasowin.

indices-ignored-out-of-range = indices gii-asigaadeg { $component } onji gaawiin odaapinigaadesinoon, aanind indices agwajiing ayaamagadoon.

pretzel-indices-repeated = indices gii-asigaadeg pretzel onji gaawiin odaapinigaadesinoon, aanind indices niizhing ayaamagadoon.

pretzel-circuit-first-index = indices gii-asigaadeg pretzel circuit biinji gaawiin odaapinigaadesinoon, netamising index da-1 onji.

## `<shuffle>` and `<sort>`

string-children-need-type = Ji-anokiid `<{ $component }>` ikidowin-oniijaanisan gaye, `type` ozhibii'igaans da-asigaade.

invalid-type-defaulting-to-math = Gaawiin gwayak { $type } izhinaagoziwin { $component } onji. Da-math, text, number gemaa boolean. math asigaade.

string-not-valid-component-to-arrange = Ikidowin "{ $value }" gaawiin gwayak onji-ayi'ii { $component } onji. Gaawiin odaapinigaadesinoon.

## Types and variables

invalid-type-defaulting-to-number = Gaawiin gwayak { $type } izhinaagoziwin, number asigaade.

invalid-variable-value = Gaawiin gwayak aanjised odibaakonigewin: `{ $value }`

## Variants

variant-index-must-be-number = Bakaan izhinaagoziwin index { $index } da-agindaasowin

variant-index-must-be-integer = Bakaan izhinaagoziwin index { $index } da-gwayak-agindaasowin

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` gaawiin ozhitoosinoon gwayak-dibaabiishkoojiganan onji. Debinaak-dibaabiishkoojiganan asigaadewan.

side-by-side-absolute-margins = `<{ $component }>` gaawiin ozhitoosinoon gwayak-dibaabiishkoojiganan onji. Debinaak-jiigaatigwaanan asigaadewan.

side-by-side-no-block-child = Gaawiin gwayak `<{ $component }>`: bezhig makak-oniijaanis da-ayaamagad.

## `<label>`

label-for-ignored-on-graphical = `for` ozhibii'igaans gaawiin odaapinigaadesinoon mazinaakizon `<label>` ining.

label-for-must-resolve-to-one = `for` ozhibii'igaans `<label>` ining bezhig eta onji-ayi'ii da-owiindamaagen.

label-for-unresolved = `for` ozhibii'igaans `<label>` ining gaawiin gii-gashkitoosinoon ji-owiindamaagenid onji-ayi'ii.

label-for-answer-with-authored-inputs = `for` ozhibii'igaans `<label>` ining owiindamaagen bezhig `<answer>` ozhibii'igewinini gii-asang biindigewinan gaye; wiindamaage biindigewin dash.

label-for-answer-without-input = `for` ozhibii'igaans `<label>` ining owiindamaagen bezhig `<answer>` gaawiin biindigewin otayaanzinoon ji-izhinikaadeg.

label-for-must-reference-input-or-answer = `for` ozhibii'igaans `<label>` ining bezhig biindigewin gemaa bezhig nakwetamowin da-owiindamaagen.

## Accessibility

accessibility-short-description-or-decorative = Bagidinigewin onji, `<{ $component }>` bezhig gabashish-wiindamaagewin da-otayaan gemaa da-ikidwaade wawezhi'igan.

accessibility-video-short-description = Bagidinigewin onji, `<video>` bezhig gabashish-wiindamaagewin da-otayaan.

accessibility-input-short-description-or-label = Bagidinigewin onji, `<{ $component }>` bezhig gabashish-wiindamaagewin gemaa bezhig izhinikaazowin da-otayaan.

accessibility-answer-input-short-description-or-label = Bagidinigewin onji, bezhig `<answer>` biindigewin ozhitood bezhig gabashish-wiindamaagewin gemaa bezhig izhinikaazowin da-otayaan.

accessibility-short-description-contains-math = Gabashish-wiindamaagewinan gaawiin agindaasowin-onji-ayi'iin `<{ $component }>` izhi da-otayaanzinoon. Ozhibii'an agindaasowin ikidowinan gaye.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } gaawiin debisemagasinoon onaakonigan-izhinikaazowin ikidowin onji (makadewaa izhinaagoziwin) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 da-ayaamagad).
       *[other] { $colorName } gaawiin debisemagasinoon onaakonigan-izhinikaazowin ikidowin onji ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 da-ayaamagad).
    }

## `<circle>`

circle-through-points-non-numerical = Gaawiin mashi ozhitoosinoon `<circle>` { $count } mazina'igaansan onji apii mazina'igaansan gaawiin agindaasowin otayaanzinoon.

circle-too-many-through-points = Gaawiin gashkitoosinoon ji-agindaasod waawiyeyaa 3 nawaj mazina'igaansan onji.

circle-overprescribed-radius-center-points = Gaawiin gashkitoosinoon ji-agindaasod waawiyeyaa gii-asigaadeg naawayi'ii-dibaabiishkoojigan, naawayi'ii gaye mazina'igaansan gaye.

circle-center-with-multiple-points = Gaawiin gashkitoosinoon ji-agindaasod waawiyeyaa gii-asigaadeg naawayi'ii 1 nawaj mazina'igaans onji.

circle-radius-too-small = Gaawiin gashkitoosinoon ji-agindaasod waawiyeyaa: niizh mazina'igaansan naawayi'ii { $distance } onji, naawayi'ii-dibaabiishkoojigan { $radius } gii-asigaadeg agaashiinyi.

circle-radius-with-many-points = Gaawiin gashkitoosinoon ji-ozhitood waawiyeyaa niizh nawaj mazina'igaansan onji naawayi'ii-dibaabiishkoojigan gii-asigaadeg gaye.

circle-invalid-center-or-through-points = Gaawiin gwayak waawiyeyaa onaawayi'ii gemaa omazina'igaansan.

circle-radius-center-with-multiple-points = Gaawiin gashkitoosinoon ji-agindaasod waawiyeyaa onaawayi'ii-dibaabiishkoojigan gii-asigaadeg naawayi'ii 1 nawaj mazina'igaans onji.

circle-change-radius-non-numerical = Gaawiin gashkitoosinoon ji-aanjitood waawiyeyaa onaawayi'ii-dibaabiishkoojigan mazina'igaansan gaawiin agindaasowinan

circle-radius-with-points-non-numerical = Gaawiin gashkitoosinoon ji-ozhitood waawiyeyaa bezhig nawaj mazina'igaans onji naawayi'ii-dibaabiishkoojigan gii-asigaadeg gaye, agindaasowin gaawiin ayaamagasinoon.

circle-change-center-non-numerical = Gaawiin mashi ozhitoosinoon ji-aanjitood waawiyeyaa onaawayi'ii mazina'igaansan onji gaawiin agindaasowin otayaanzinoon.

## `<function>`

# Both selects stay: Ojibwe marks the inanimate plural on both nouns.
function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Gaawiin debisemagasinoon anokiiwin-akiiwan endaso-izhinaagoziwin. Akiiwan { $intervals } dazhiwin otayaan gaye anokiiwin { $inputs ->
            [one] { $inputs } biindigewin
           *[other] { $inputs } biindigewinan
        } otayaan.
       *[other] Gaawiin debisemagasinoon anokiiwin-akiiwan endaso-izhinaagoziwin. Akiiwan { $intervals } dazhiwinan otayaanan gaye anokiiwin { $inputs ->
            [one] { $inputs } biindigewin
           *[other] { $inputs } biindigewinan
        } otayaan.
    }

function-domain-invalid-format = Gaawiin gwayak izhinaagoziwin anokiiwin-akiiwan onji.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Anokiiwin ogichi-ayi'ii gaawiin agindaasowin gaawiin odaapinigaadesinoon.
        [minimum] Anokiiwin oagaashiiny-ayi'ii gaawiin agindaasowin gaawiin odaapinigaadesinoon.
        [extremum] Anokiiwin oishkwaach-ayi'ii gaawiin agindaasowin gaawiin odaapinigaadesinoon.
        [point] Anokiiwin omazina'igaans gaawiin agindaasowin gaawiin odaapinigaadesinoon.
        [slope] Anokiiwin obimaakwaawin gaawiin agindaasowin gaawiin odaapinigaadesinoon.
       *[other] { $type } anokiiwin onji gaawiin agindaasowin gaawiin odaapinigaadesinoon.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Anokiiwin ogichi-ayi'ii bizhishig gaawiin odaapinigaadesinoon.
        [minimum] Anokiiwin oagaashiiny-ayi'ii bizhishig gaawiin odaapinigaadesinoon.
        [extremum] Anokiiwin oishkwaach-ayi'ii bizhishig gaawiin odaapinigaadesinoon.
        [point] Anokiiwin omazina'igaans bizhishig gaawiin odaapinigaadesinoon.
       *[other] { $type } anokiiwin onji bizhishig gaawiin odaapinigaadesinoon.
    }

function-points-too-close = Anokiiwin niizh mazina'igaansan otayaanan besho ayaamagadoon. Gaawiin gashkitoosinoon ji-wiindamaageng anokiiwin.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Anokiiwin-azhegiiwewinan gashkitoowan apii biindigewinan agindaasowin naasaabimagak zaagijiwewinan agindaasowin gaye. O'ow anokiiwin { $inputs } biindigewin gaye { $outputs ->
            [one] { $outputs } zaagijiwewin
           *[other] { $outputs } zaagijiwewinan
        } otayaan.
       *[other] Anokiiwin-azhegiiwewinan gashkitoowan apii biindigewinan agindaasowin naasaabimagak zaagijiwewinan agindaasowin gaye. O'ow anokiiwin { $inputs } biindigewinan gaye { $outputs ->
            [one] { $outputs } zaagijiwewin
           *[other] { $outputs } zaagijiwewinan
        } otayaan.
    }

## `<sequence>`

sequence-invalid-length = Gaawiin gwayak niibowa-asigina'igan oginwaawin.  Da-gwayak-agindaasowin gaawiin agaawaa.

sequence-invalid-step = Gaawiin gwayak niibowa-asigina'igan odakobinigan.  Da-agindaasowin { $type } izhinaagoziwin niibowa-asigina'igan onji.

sequence-invalid-endpoint-number = Gaawiin gwayak "{ $attribute }" agindaasowin-niibowa-asigina'igan onji.  Da-agindaasowin.

sequence-invalid-endpoint-letters = Gaawiin gwayak "{ $attribute }" ozhibii'igaans-niibowa-asigina'igan onji.  Da-ozhibii'igaansan-mamawi.

sequence-invalid-endpoint = Gaawiin gwayak niibowa-asigina'igan "{ $attribute }".

select-from-sequence-coprime-not-numbers = coprime gaawiin odaapinigaadesinoon, gaawiin agindaasowinan odaapinigaadesinoon onji

select-from-sequence-coprime-with-exclude-combinations = coprime gaawiin odaapinigaadesinoon, excludeCombinations gii-asigaade onji

## Resolving a `target`

target-not-found = Gaawiin gwayak target `<{ $source }>` onji: gaawiin mikigaadesinoon.

target-state-variable-not-found = Gaawiin gwayak target `<{ $source }>` onji: gaawiin mikigaadesinoon "{ $property }" ezhinikaadeg bezhig `<{ $component }>` ining.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` odaanjisewinan bakaan da-ayaawan bezhigo-aanjised onji.

ode-system-duplicate-variable-names = Gaawiin gashkitoosinoon ji-wiindamaageng ODE RHS anokiiwinan niizhing aanjised-izhinikaazowinan gaye.

ode-system-rhs-function-error = Gaawiin gashkitoosinoon ji-wiindamaageng ODE RHS anokiiwin.  Bataadowin mathjs anokiiwin ozhitood.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Gaawiin gashkitoosinoon ji-wiindamaageng wiikwaan { $count } jiigaatigoon naawayi'ii

angle-invalid-through-point = Gaawiin gwayak mazina'igaans `<angle>` through ining

parabola-vertex-too-many-points = Gaawiin mashi ozhitoosinoon paraboolaa wiikwaan gaye 1 nawaj mazina'igaans onji.

parabola-too-many-points = Gaawiin mashi ozhitoosinoon paraboolaa 3 nawaj mazina'igaansan onji.

intersection-too-many-items = Gaawiin mashi ozhitoosinoon aazhawaakwaawin niizh nawaj onji-ayi'iin onji

## Other math components

ionic-compound-not-two-ions = Gaawiin mashi ozhitoosinoon ionic-mamaw-ayi'ii niizh ion bakaan onji.

ionic-compound-needs-cation-and-anion = Ionic-mamaw-ayi'ii bezhig cation gaye bezhig anion eta onji ozhitoowin.

solve-equations-cannot-evaluate = Gaawiin gashkitoosinoon ji-nanaa'itood naasaabiwin, gaawiin gii-gashkitoosinoon ji-agindaasod: { $equation }

math-operators-operand-number-required = operandNumber da-asigaade apii agindaasowin-onji-ayi'ii zaagijidood.

eigen-decomposition-failed = Gaawiin gii-gashkitoosinoon ji-agindaasod matris odibaakonigewinan

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } gaawiin ayaamagasinoon izhinaagoziwining, mii dash apane bizhishig da-onaasaabimagad.
       *[other] `<matchesPattern>`: { $parameters } gaawiin ayaamagasinoon izhinaagoziwining, mii dash apane bizhishig da-onaasaabimagadoon.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: gaawiin gii-nisidotaagozisinoon grid="{ $grid }". Da-none, medium, dense, gemaa niizh agindaasowinan gaawiin agaawaa, bezhig dazhi gaye, o'ow izhi grid="1 0.5". Gaawiin jiigaatig-asigina'igan ozhitoosinoon.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" gaawiin odaapinigaadesinoon prefigure waabanda'iwewining; gichi-nikaaning izhichigewin odaapinigaade.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" gaawiin odaapinigaadesinoon prefigure waabanda'iwewining; ishpiming izhichigewin odaapinigaade.

prefigure-invalid-axis-bounds = `<graph>`: gaawiin gwayak jiigaatig-jiigaatigwaanan prefigure aanjitoowin onji; netaa-bbox odaapinigaade (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: gaawiin gwayak dibaabiishkoojigan prefigure aanjitoowin onji; netaa-mazinaakizon dibaabiishkoojigan 425 odaapinigaade.

prefigure-invalid-aspect-ratio = `<graph>`: gaawiin gwayak aspectRatio prefigure aanjitoowin onji; netaa-naasaabiwin 1 odaapinigaade.

prefigure-grid-spacing-too-fine = `<graph>`: jiigaatig-asigina'igan odazhiwin bibagaa jiigaatig-jiigaatigwaanan onji; jiigaatig-asigina'igan webinigaade prefigure waabanda'iwewining.

prefigure-annotations-not-rendered = `<graph>`: ozhibii'iganan gaawiin waabanda'iwesinoon apii PreFigure waabanda'iwewin gaawiin odaapinigaadesinoon.

multiple-annotations-children = Niibiwa `<annotations>` oniijaanisan gii-mikigaadewan `<graph>` biinji; gakina webinigaadewan, ishkwaach eta.

## Referring to other components

copy-unrecognized-component-type = Gaawiin gashkitoosinoon ji-ginwaabitood gemaa ji-naabitood onji-ayi'ii izhinaagoziwin gaawiin gikendaagozid: { $type }.

copy-prop-not-found = Gaawiin gii-mikigaadesinoon prop { $property } bezhig onji-ayi'ii { $component } izhinaagoziwin ining

collect-no-source = Gaawiin gegoo onjishkaamagak gii-mikigaadesinoon collect onji.

collect-invalid-component-type = Gaawiin gashkitoosinoon ji-mawandood onji-ayi'iin `<{ $component }>` izhinaagoziwin, gaawiin gwayak izhinaagoziwin onji.

reference-index-unavailable = Gaawiin gashkitoosinoon ji-owiindamaagenid index `{ $reference }`

## `<callAction>`

component-action-unavailable = Gaawiin gashkitoosinoon ji-nandomind { $action } onji-ayi'ii `{ $reference }` ining

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Gaawiin gwayak wiindamaagewinan izhinaagoziwin.  Shingishingoon oginwaawinan gaawiin naasaabisinoon. Gii-mikigaade componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Wiindamaagewinan niizhing gaabawi-izhinikaazowinan otayaanan.  Gii-mikigaade componentIdx :{ $componentIdx }

data-frame-missing-column-name = Wiindamaagewinan bezhig gaabawi-izhinikaazowin obanaajitoon.  Gii-mikigaade componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Bezhig award o'ow nakwetamowin onji nakwetamowin tag ogii-izhinizha'aan nakwetamowin ining ayaamagad, mii dash gaawiin gikendaagozid izhichigewin da-ani-izhiwidoon.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` asigaadeg bezhig `<answer>` ining biinji bezhig makak `sectionWideCheckWork` otayaang gaawiin gegoo izhichigesinoon, makak ogikinawaabandaan gagwedaagewinan agindaasowin onji. Asin `maxNumAttempts` makak ining dash.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` asigaadeg bezhig makak `sectionWideCheckWork` otayaang ining, biinji bezhig bakaan makak `sectionWideCheckWork` otayaang, gaawiin gegoo izhichigesinoon, agwajiing makak ogikinawaabandaan gagwedaagewinan agindaasowin onji. Asin `maxNumAttempts` agwajiing makak ining dash.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] { $attributes } ozhibii'igaans gaawiin gegoo da-izhichigesinoon symbolicEquality gaawiin asigaadesinoon.
       *[other] { $attributes } ozhibii'igaansan gaawiin gegoo da-izhichigesinoon symbolicEquality gaawiin asigaadesinoon.
    }

answer-invalid-type = Gaawiin gwayak izhinaagoziwin nakwetamowin onji: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Onji-ayi'ii `<{ $component }>` gaawiin izhinikaazowin otayaanzinoon onji, gaawiin gashkitoosinoon ji-odaapinigaadeg module ozhibii'igaans onji

module-attribute-name-already-defined = Onji-ayi'ii `<{ $component } name="{ $name }">` gaawiin gashkitoosinoon ji-odaapinigaadeg ozhibii'igaans izhi module onji, `<module>` izhinaagoziwin azhigwa bezhig "{ $name }" ozhibii'igaans otayaan onji.

conditional-content-condition-ignored = `condition` ozhibii'igaans gaawiin odaapinigaadesinoon bezhig `<conditionalContent>` ining case gemaa else oniijaanisan otayaang.

slider-markers-type-mismatch = Mazina'igan izhinaagoziwin gaawiin naasaabisinoon slider izhinaagoziwin.

pretzel-problem-needs-statement-and-answer = Gaawiin gwayak pretzel: gakina `<problem>` bezhig `<statement>` gaye bezhig `<answer>` da-otayaan.

pretzel-circuit-first-problem-distractor = Gaawiin gwayak pretzel: mode="circuit" biinji, netamising `<problem>` gaawiin wanishkwe'igan da-ayaasinoon.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Gaawiin gwayak { $values } `{ $attribute }` ozhibii'igaans onji; gaawiin odaapinigaadesinoon.
       *[other] Gaawiin gwayak { $values } `{ $attribute }` ozhibii'igaans onji; gaawiin odaapinigaadesinoon.
    }

attribute-must-be-references = Gaawiin gwayak `{ $value }` `{ $attribute }` ozhibii'igaans onji. Ozhibii'igaans izhi-wiindamaagewinan `$` gaye maajitaajig onji da-ozhitoowin.

math-input-invalid-function-names = <mathInput>: gaawiin gwayak anokiiwin-izhinikaazowinan gaawiin odaapinigaadesinoon { $attribute } biinji: { $names }. Gakina izhinikaazowin owaabanda'iwewin-onji-ayi'ii 2 nawaj ozhibii'igaansan da-otayaan (ozhibii'igaansan gemaa jiigaatigoon); bezhig `|<mathspeak alternative>` da-bi-ayaamagad.

## Building components from the source

component-type-invalid = Gaawiin gwayak onji-ayi'ii izhinaagoziwin: `<{ $componentType }>`

attribute-repeated = Gaawiin gashkitoosinoon ji-niizhing-asigaadeg ozhibii'igaans { $attribute }.

attribute-invalid-for-component = Gaawiin gwayak ozhibii'igaans "{ $attribute }" bezhig onji-ayi'ii `<{ $componentType }>` izhinaagoziwin onji.

## Style definition contrast

style-definition-insufficient-contrast =
    Izhinaagoziwin-wiindamaagewin { $styleNumber } gaawiin debisemagasinoon { $context ->
        [text-on-background] ikidowin-onaagoziwin atesing-onaagoziwin onji
        [high-contrast] gichi-onaagoziwin mazinaakizonaabik onji
        [line] jiigaatig-onaagoziwin mazinaakizonaabik onji
        [marker] mazina'igan-onaagoziwin mazinaakizonaabik onji
       *[text-on-canvas] ikidowin-onaagoziwin mazinaakizonaabik onji
    }{ $mode ->
        [dark] { " (makadewaa izhinaagoziwin)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 da-ayaamagad).

style-definition-dark-mode-text-background-contrast =
    Aanawi izhinaagoziwin-wiindamaagewin { $styleNumber } ogii-asaan onaagoziwinan debisemagakin waaseyaa izhinaagoziwin onji, makadewaa onaagoziwinan onjishkaajig igiw odibaakonigewinan onji gaawiin debisemagasinoon ikidowin-onaagoziwin atesing-onaagoziwin onji ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 da-ayaamagad). { $suggestion ->
        [available] Ji-debisemagak makadewaa izhinaagoziwining, mishawaakwadoon waaseyaa debisewin (o'ow izhi, asin { $lightAttribute }="{ $lightColor }") gemaa aanjitoon makadewaa onaagoziwin (o'ow izhi, asin { $darkAttribute }="{ $darkColor }").
       *[none] Ji-debisemagak makadewaa izhinaagoziwining, mishawaakwadoon waaseyaa debisewin gemaa aanjitoon onaagoziwinan onjishkaajig textColorDarkMode gaye/gemaa backgroundColorDarkMode gaye.
    }

style-definition-dark-mode-text-canvas-contrast =
    Aanawi izhinaagoziwin-wiindamaagewin { $styleNumber } ogii-asaan bezhig ikidowin-onaagoziwin debisemagak waaseyaa izhinaagoziwin onji, makadewaa ikidowin-onaagoziwin onjishkaad a'aw odibaakonigewin onji gaawiin debisemagasinoon mazinaakizonaabik onji ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 da-ayaamagad). { $suggestion ->
        [available] Ji-debisemagak makadewaa izhinaagoziwining, mishawaakwadoon waaseyaa debisewin (o'ow izhi, asin textColor="{ $lightColor }") gemaa aanjitoon makadewaa onaagoziwin (o'ow izhi, asin textColorDarkMode="{ $darkColor }").
       *[none] Ji-debisemagak makadewaa izhinaagoziwining, mishawaakwadoon waaseyaa debisewin gemaa aanjitoon onaagoziwin onjishkaad textColorDarkMode gaye.
    }

section-multiple-style-palettes = Bezhig onaakonigan bezhig <stylePalette> eta da-odaapinan; ishkwaach odaapinigaade.

## Unique variants

variant-num-to-select-not-non-negative-integer = gaawiin gashkitoosinoon ji-gikendaagozid { $component } obezhigo-bakaan-izhinaagoziwinan, numToSelect gaawiin gwayak-agindaasowin gaawiin agaawaa onji.

variant-num-to-select-not-constant-number = gaawiin gashkitoosinoon ji-gikendaagozid { $component } obezhigo-bakaan-izhinaagoziwinan, numToSelect gaawiin apane-agindaasowin onji.

variant-with-replacement-not-constant-boolean = gaawiin gashkitoosinoon ji-gikendaagozid { $component } obezhigo-bakaan-izhinaagoziwinan, withReplacement gaawiin apane-boolean onji.

variant-select-weight-disables-unique = select obezhigo-bakaan-izhinaagoziwinan gibaakwa'igaadewan apii bezhig odaapinigewin selectWeight gemaa selectForVariants gii-asigaadeg otayaang

variant-coprime-undetermined = gaawiin gashkitoosinoon ji-gikendaagozid { $component } obezhigo-bakaan-izhinaagoziwinan, gaawiin gii-gikendaagozisinoon coprime apane gaawiin geget onji.

variant-attribute-not-constant = gaawiin gashkitoosinoon ji-gikendaagozid { $component } obezhigo-bakaan-izhinaagoziwinan, { $attribute } gaawiin apane onji.

variant-attribute-not-number = gaawiin gashkitoosinoon ji-gikendaagozid { $component } obezhigo-bakaan-izhinaagoziwinan, { $attribute } gaawiin agindaasowin onji.

variant-attribute-wrong-type-for-sequence =
    gaawiin gashkitoosinoon ji-gikendaagozid { $component } { $type } izhinaagoziwin obezhigo-bakaan-izhinaagoziwinan, { $attribute } gaawiin { $expected ->
        [letters-combination] ozhibii'igaansan-mamawi
        [math-expression] gwayak agindaasowin-ikidowin
        [integer] gwayak-agindaasowin
       *[number] agindaasowin
    } onji.

variant-length-not-integer = gaawiin gashkitoosinoon ji-gikendaagozid { $component } obezhigo-bakaan-izhinaagoziwinan, length gaawiin gwayak-agindaasowin onji.

variant-sort-not-implemented = gaawiin mashi ozhitoosinoon bezhig { $component } obezhigo-bakaan-izhinaagoziwinan sort gaye

variant-exclude-combinations-not-implemented = gaawiin mashi ozhitoosinoon bezhig { $component } obezhigo-bakaan-izhinaagoziwinan excludeCombinations gaye

variant-math-exclude-not-implemented = gaawiin mashi ozhitoosinoon bezhig { $component } math izhinaagoziwin obezhigo-bakaan-izhinaagoziwinan exclude gaye

variant-non-constant-exclude-not-implemented = gaawiin mashi ozhitoosinoon bezhig { $component } obezhigo-bakaan-izhinaagoziwinan gaawiin apane exclude gaye

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: gaawiin odaapinigaadesinoon graph prefigure waabanda'iwewining; oniijaanis webinigaade.

prefigure-descendant-invalid-geometry = { $subject }: gaawiin ishkwaasemagasinoon gemaa gaawiin debisemagasinoon dibaabiishkoojigan; oniijaanis webinigaade.

prefigure-curve-label-omitted = { $subject }: izhinikaazowinan gaawiin odaapinigaadesinoon waagaatig-onji-ayi'iin gii-aanjitoowin ining; izhinikaazowin webinigaade.

prefigure-curve-unsupported-definition-type = { $subject }: waagaatig-anokiiwin-wiindamaagewin izhinaagoziwin '{ $definitionType }' gaawiin odaapinigaadesinoon; oniijaanis webinigaade.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions ozhibii'igaans gaawiin odaapinigaadesinoon regionBetweenCurves ining; oniijaanis webinigaade.

prefigure-region-non-formula-child = { $subject }: formula izhinaagoziwin anokiiwin-oniijaanisan eta odaapinigaadewan regionBetweenCurves ining; oniijaanis webinigaade.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' gaawiin odaapinigaadesinoon { $labelKind ->
        [line-family] jiigaatig-dewe'igan izhinikaazowin
       *[point] mazina'igaans izhinikaazowin
    } onji; netaa-PreFigure naasaabiwin odaapinigaade.

prefigure-fill-style-unsupported = { $subject }: PreFigure gaawiin odaapinanzii mooshkinebiiwin izhinaagoziwin '{ $fillStyle }'; debisewin-mooshkinebiiwin ining azhegiiwe.

prefigure-line-style-unknown = { $subject }: jiigaatig izhinaagoziwin '{ $lineStyle }' gaawiin gikendaagozid webinigaade PreFigure zaagijiwewin onji.

prefigure-marker-style-mapped-to-diamond = { $subject }: mazina'igan izhinaagoziwin '{ $markerStyle }' gii-asigaade PreFigure izhinaagoziwin 'diamond' izhi.

prefigure-marker-style-unsupported = { $subject }: PreFigure gaawiin odaapinanzii mazina'igan izhinaagoziwin '{ $markerStyle }'; netaa-izhinaagoziwin odaapinigaade.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: gaawiin gwayak `ref`; gaawiin gashkitoosinoon ji-mikang izhi-wiindamaagewin. Ozhibii'igan webinigaade.

annotation-ref-multiple-targets = `<annotation>`: `ref` niibiwa izhi-wiindamaagewinan ogii-dagoshinaan; netamising odaapinigaade.

annotation-ref-outside-graph = `<annotation>`: gaawiin gwayak `ref`; izhi-wiindamaagewin agwajiing graph ayaamagad. Ozhibii'igan webinigaade.

annotation-ref-unsupported-target = `<annotation>`: gaawiin gwayak `ref`; izhi-wiindamaagewin gaawiin mazinaakizon-onji-ayi'ii odaapinigaadeg prefigure aanjitoowin ining. Ozhibii'igan webinigaade.

annotation-text-missing = `<annotation>`: `text` gaawiin ayaamagasinoon gemaa bizhishig; bizhishig ikidowin asigaade.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Waawiyeyaa-dakobinigan gii-mikigaade.
       *[other] Waawiyeyaa-dakobinigan gii-mikigaade bezhig `<{ $componentType }>` gaye.
    }

reference-no-referent = Gaawiin gegoo gii-mikigaadesinoon o'ow izhi-wiindamaagewin onji: `{ $reference }`

reference-multiple-referents = Niibiwa gii-mikigaadewan o'ow izhi-wiindamaagewin onji: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Gaawiin gwayak izhinaagoziwin { $attribute } ozhibii'igaans `<{ $componentType }>` onji.

children-invalid = Gaawiin gwayak oniijaanisan `<{ $componentType }>` onji: gaawiin gwayak oniijaanisan gii-mikigaadewan: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Gaawiin gwayak `{ $value }` `{ $attribute }` ozhibii'igaans onji, `{ $default }` odaapinigaade

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML izhinaagoziwin { $version } gaawiin gii-mikigaadesinoon.
       *[other] DoenetML izhinaagoziwin { $version } gaawiin gii-mikigaadesinoon. Izhinaagoziwin { $fallback } ining azhegiiwe
    }

## Reading the DoenetML

parse-invalid-doenetml = Gaawiin gwayak DoenetML: { $content }

parse-tag-missing-close-tag = Gaawiin gwayak DoenetML: Tag `{ $tag }` gaawiin gibaakwa'igan-tag otayaanzinoon. Bezhig tag wiin gibaakwa'od gemaa bezhig `</{ $tagName }>` tag da-ayaamagad.

parse-tag-error = Gaawiin gwayak DoenetML: Bataadowin tag `<{ $tagName }>` biinji

parse-attribute-missing-value = Gaawiin gwayak DoenetML: Gaawiin gwayak ozhibii'igaans `{ $attribute }` odibaakonigewin obanaajitoon.

parse-attribute-invalid = Gaawiin gwayak DoenetML: Gaawiin gwayak ozhibii'igaans `{ $attribute }`

parse-attribute-value-invalid = Gaawiin gwayak DoenetML: Gaawiin gwayak ozhibii'igaans-dibaakonigewin `{ $value }`

parse-attribute-value-quote-mismatch = Gaawiin gwayak DoenetML: Gaawiin gwayak ozhibii'igaans-dibaakonigewin `{ $value }`. Ikidowin-mazina'iganan gaawiin naasaabisinoon. Bezhig `{ $quote }` obanaajitoon

parse-open-tag-name-missing = Gaawiin gwayak DoenetML: Bezhig tag gii-mikigaade gaawiin izhinikaazowin otayaanzinoon, o'ow izhi `<`

parse-tag-not-closed = Gaawiin gwayak DoenetML: Tag `{ $tag }` gaawiin gii-gibaakwa'igaadesinoon (bezhig `>` obanaajitoon).

parse-self-closing-tag-name-missing = Gaawiin gwayak DoenetML: Bezhig tag gii-mikigaade gaawiin izhinikaazowin otayaanzinoon `<{ $content }>`

parse-self-closing-tag-not-closed = Gaawiin gwayak DoenetML: Tag `{ $tag }` gaawiin gii-gibaakwa'igaadesinoon (`/>` obanaajitoon).

parse-tag-invalid-attributes = Gaawiin gwayak DoenetML: Tag `{ $tag }` gaawiin gwayak. Gaawiin gwayak ozhibii'igaansan da-otayaan.

parse-close-tag-name-missing = Gaawiin gwayak DoenetML: Bezhig gibaakwa'igan-tag gii-mikigaade gaawiin izhinikaazowin otayaanzinoon, o'ow izhi `</`

parse-attribute-value-unquoted = Ozhibii'igaans-dibaakonigewinan ikidowin-mazina'iganan biinji da-ayaamagadoon: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Gaawiin gwayak DoenetML: Gibaakwa'igan-tag `{ $tag }` gii-mikigaade, gaawiin dash baakinigan-tag naasaabid ayaamagasinoon

parse-close-tag-mismatched = Gaawiin gwayak DoenetML: Gibaakwa'igan-tag gaawiin naasaabisinoon. `</{ $expected }>` gii-ayaamagad da-gii. `{ $found }` gii-mikigaade

parser-node-unconvertible = Gaawiin gii-gashkitoosinoon ji-aanjitoong node { $node } Dast node izhi.

## Names

name-attribute-invalid =
    Gaawiin gwayak ozhibii'igaans name='{ $name }'. { $reason ->
        [characters] Izhinikaazowinan ozhibii'igaansan, agindaasowinan, niisaayi'ii-jiigaatigoon gemaa jiigaatigoon eta da-otayaanan.
       *[start] Izhinikaazowinan bezhig ozhibii'igaans gaye da-maajitaawan.
    }

component-name-invalid-start = Gaawiin gwayak onji-ayi'ii izhinikaazowin "{ $name }". Izhinikaazowinan bezhig ozhibii'igaans gaye da-maajitaawan.

## `<answer>` sugar

answer-video-watched-missing-video = Nakwetamowin videoWatched izhinaagoziwin bezhig video ozhibii'igaans da-otayaan

answer-video-watched-video-not-reference = Nakwetamowin videoWatched izhinaagoziwin bezhig video ozhibii'igaans izhi-wiindamaagewin ayaad da-otayaan

answer-name-not-single-text = Nakwetamowin name ozhibii'igaans bezhig ikidowin-oniijaanis eta da-otayaan

## Referencing another document

external-doenetml-recursion-limit = Gaawiin gii-gashkitoosinoon ji-odaapinang agwajiing DoenetML, niibiwa azhegiiwewinan onji. Waawiyeyaa izhi-wiindamaagewin ina ayaamagad?

external-doenetml-unavailable = Gaawiin gii-gashkitoosinoon ji-odaapinang DoenetML { $attribute }="{ $uri }" onji

external-doenetml-type-mismatch = Gaawiin gwayak DoenetML gii-odaapinigaade { $attribute }="{ $uri }" onji: gaawiin gii-naasaabisinoon onji-ayi'ii izhinaagoziwin "{ $componentType }" gaye

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ozhibii'igaans `{ $from }` gete-ayi'ii; odaapinan `{ $to }` dash.
       *[other] [deprecation] Ozhibii'igaans `{ $from }` `<{ $component }>` ining gete-ayi'ii; odaapinan `{ $to }` dash.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ozhibii'igaans `{ $from }` gete-ayi'ii gaye gaawiin odaapinigaadesinoon, `{ $to }` gaye gii-asigaade onji.
       *[other] [deprecation] Ozhibii'igaans `{ $from }` `<{ $component }>` ining gete-ayi'ii gaye gaawiin odaapinigaadesinoon, `{ $to }` gaye gii-asigaade onji.
    }

deprecated-attribute-ignored = [deprecation] Ozhibii'igaans `{ $attribute }` `<{ $component }>` ining gete-ayi'ii gaye gaawiin odaapinigaadesinoon.

deprecated-attribute-to-child = [deprecation] Ozhibii'igaans `{ $attribute }` `<{ $component }>` ining gete-ayi'ii; odaapinan bezhig `<{ $child }>` oniijaanis dash.

deprecated-attribute-value-renamed = [deprecation] `{ $value }` ozhibii'igaans `{ $attribute }` `<{ $component }>` ining gete-ayi'ii; odaapinan `{ $to }` dash.


## Language coverage

pluralize-english-only = `<pluralize>` zhaaganaashiimowin eta ogashkitoon ji-niibiwa-doodang, mii dash oikidowin gaawiin aanjitoosinoon mazina'igan { $locale } ozhibii'igaadeg biinji. Ozhibii'an niibiwa-izhinaagoziwin giin, gemaa asin `pluralForm` ozhibii'igaans gaye.


## Checking against the schema

schema-element-unrecognized = Onji-ayi'ii `<{ $tag }>` gaawiin Doenet onji-ayi'ii gikendaagozid.

schema-element-not-allowed-at-root = Onji-ayi'ii `<{ $tag }>` gaawiin bagidinigaadesinoon mazina'igan ojiibik ining.

schema-element-not-allowed-inside = Onji-ayi'ii `<{ $tag }>` gaawiin bagidinigaadesinoon `<{ $parent }>` biinji.

schema-attribute-unrecognized = Onji-ayi'ii `<{ $tag }>` gaawiin ozhibii'igaans `{ $attribute }` ezhinikaadeg otayaanzinoon.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ozhibii'igaans `{ $attribute }` onji-ayi'ii `<{ $tag }>` ining bezhig asigina'igan da-ayaamagad, gakina oniijaanis bezhig o'ow onji: { $allowed }
       *[other] Ozhibii'igaans `{ $attribute }` onji-ayi'ii `<{ $tag }>` ining bezhig o'ow onji da-ayaamagad: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Gaawiin gwayak bakaan-izhinaagoziwin izhinikaazowin select onji.  Bakaan-izhinaagoziwin izhinikaazowin { $variantName } { $numOptions } odaapinigewinan biinji ayaamagad gaye dash odaapinigewin agindaasowin { $numToSelect } ayaamagad.

select-variant-name-without-options = Aanind bakaan-izhinaagoziwinan gii-asigaadewan select onji gaye dash gaawiin odaapinigewinan gii-asigaadesinoon o'ow bakaan-izhinaagoziwin izhinikaazowin onji: { $variantName }.

select-variant-name-not-possible = Bakaan-izhinaagoziwin izhinikaazowin { $variantName } gii-asigaadeg select onji gaawiin gashkitoo-bakaan-izhinaagoziwin izhinikaazowin.

select-too-few-options = Gaawiin gashkitoosinoon ji-odaapinang { $numToSelect } onji-ayi'iin { $numOptions } eta onji.

select-from-sequence-too-few-values = Gaawiin gashkitoosinoon ji-odaapinang { $numToSelect } dibaakonigewinan niibowa-asigina'igan { $length } ginwaa onji.

select-from-sequence-indices-count-mismatch = indices agindaasowin gii-asigaadeg select onji odaapinigewin agindaasowin da-onaasaabimagad

select-from-sequence-indices-not-integers = Gakina indices gii-asigaadeg select onji gwayak-agindaasowinan da-ayaawan

select-from-sequence-index-excluded = selectfromsequence index gii-asigaadeg gii-webinigaade

select-from-sequence-indices-excluded-combination = selectfromsequence indices gii-asigaadeg gii-webinigaadeg mamawi gii-ayaamagad

select-from-sequence-coprime-not-positive-integers = Gaawiin gashkitoosinoon ji-odaapinang coprime mamawi'idiwinan, gaawiin gwayak-agindaasowinan gaawiin agaawaa odaapinigaadesinoon onji.

select-from-sequence-coprime-common-factor = Gaawiin gashkitoosinoon ji-odaapinang coprime agindaasowinan. Gakina gashkitoo-dibaakonigewinan bezhig naasaab-onji-ayi'ii otayaanan. ("from" gemaa "to" gii-asigaadeg coprime da-ayaamagad "step" gaye.)

select-from-sequence-coprime-single-number = Gaawiin gashkitoosinoon ji-odaapinang coprime mamawi'idiwinan bezhig agindaasowin gaawiin 1 onji.

select-from-sequence-excluded-too-many-combinations = 70% nawaj mamawi'idiwinan gii-webinigaadewan selectFromSequence biinji

select-from-sequence-coprime-none-found = Gaawiin gii-gashkitoosinoon ji-odaapinang coprime agindaasowinan. Gakina gashkitoo-dibaakonigewinan bezhig naasaab-onji-ayi'ii otayaanan.

select-from-sequence-too-few-unique-values = Gaawiin gashkitoosinoon ji-odaapinang { $numToSelect } bezhigo-dibaakonigewinan niibowa-asigina'igan { $numPossibleValues } ginwaa onji

select-prime-numbers-too-few-values = Gaawiin gashkitoosinoon ji-odaapinang { $numToSelect } dibaakonigewinan prime-agindaasowinan asigina'igan { $numValues } ginwaa onji

select-prime-numbers-values-count-mismatch = Dibaakonigewinan agindaasowin gii-asigaadeg select onji odaapinigewin agindaasowin da-onaasaabimagad

select-prime-numbers-values-not-prime = Gakina dibaakonigewinan gii-asigaadeg select prime-agindaasowin onji prime-agindaasowinan asigina'igan biinji da-ayaamagadoon

select-prime-numbers-values-excluded-combination = selectPrimeNumbers dibaakonigewinan gii-asigaadeg gii-webinigaadeg mamawi gii-ayaamagad

select-prime-numbers-excluded-too-many-combinations = 70% nawaj mamawi'idiwinan gii-webinigaadewan selectPrimeNumbers biinji

select-random-combination-fluke = Gichi-gaawiin-gashkitoo-izhiwebiziwin onji, gaawiin gii-gashkitoosinoon ji-odaapinang gaawiin-gikendaagozijig dibaakonigewinan mamawi

select-random-value-fluke = Gichi-gaawiin-gashkitoo-izhiwebiziwin onji, gaawiin gii-gashkitoosinoon ji-odaapinang gaawiin-gikendaagozid dibaakonigewin
