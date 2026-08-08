# Swahili diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# ignored" against "are ignored" — the Swahili verb takes its subject concord
# from the noun class rather than from the count, and the argument is a list
# either way. So those selects are dropped and the count argument goes unused.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } hupuuzwa pale nukta mbili za mwisho zinapobainishwa

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } hupuuzwa pale nukta ya mwisho na nukta ya kati zote mbili zinapobainishwa

line-segment-midpoint-offset-without-midpoint = midpointOffset haina athari bila nukta ya kati

## `<line>`

line-points-undetermined-dimensions = Mstari unapita katika nukta zenye vipimo visivyobainika.

line-points-too-few-dimensions = Mstari lazima upite katika nukta zenye angalau vipimo viwili.

line-points-depend-on-variables = Mstari unapita katika nukta zinazotegemea vigezo: { $variables }.

line-equation-invalid-format = Muundo si sahihi kwa mlinganyo wa mstari katika vigezo { $variable1 } na { $variable2 }.

## `<ray>`

ray-overprescribed-through = Mwale umebainishwa kwa through, endpoint na direction kwa pamoja. through iliyobainishwa inapuuzwa.

ray-dimension-mismatch = numDimensions hailingani katika mwale.

## `<vector>`

vector-overprescribed-head = Vekta imebainishwa kwa head, tail na displacement kwa pamoja. head iliyobainishwa inapuuzwa.

vector-dimension-mismatch = numDimensions hailingani katika vekta.

## Attracting and constraining

attract-to-without-nearest-point = Haiwezi kuvutwa kwenye `<{ $component }>` kwa kuwa haina kigezo cha hali nearestPoint.

constrain-to-without-nearest-point = Haiwezi kubanwa kwenye `<{ $component }>` kwa kuwa haina kigezo cha hali nearestPoint.

constrain-to-interior-without-nearest-point = Haiwezi kubanwa ndani ya `<{ $component }>` kwa kuwa haina kigezo cha hali nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition hupuuzwa kwa choiceInput isiyo ya mstari mmoja

## Ordering children by index

choice-input-indices-count-mismatch = Inapuuza indeksi zilizobainishwa kwa choiceInput kwa kuwa idadi ya indeksi hailingani na idadi ya watoto choice.

pretzel-indices-count-mismatch = Inapuuza indeksi zilizobainishwa kwa problem kwa kuwa idadi ya indeksi hailingani na idadi ya watoto problem.

shuffle-indices-count-mismatch = Inapuuza indeksi zilizobainishwa kwa shuffle kwa kuwa idadi ya indeksi hailingani na idadi ya vipengele.

indices-ignored-out-of-range = Inapuuza indeksi zilizobainishwa kwa { $component } kwa kuwa baadhi ya indeksi ziko nje ya wigo.

pretzel-indices-repeated = Inapuuza indeksi zilizobainishwa kwa pretzel kwa kuwa baadhi ya indeksi zimerudiwa.

pretzel-circuit-first-index = Inapuuza indeksi zilizobainishwa kwa pretzel katika modi circuit kwa kuwa indeksi ya kwanza lazima iwe 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ili `<{ $component }>` ifanye kazi na watoto wa aina ya mfuatano, sifa `type` lazima ibainishwe.

invalid-type-defaulting-to-math = type { $type } si sahihi kwa kipengele { $component }. Lazima iwe mojawapo ya math, text, number au boolean. Inawekwa kuwa math.

string-not-valid-component-to-arrange = Mfuatano "{ $value }" si kipengele sahihi cha { $component }. Unapuuzwa.

## Types and variables

invalid-type-defaulting-to-number = type { $type } si sahihi, type inawekwa kuwa number.

invalid-variable-value = Thamani ya kigezo si sahihi: `{ $value }`

## Variants

variant-index-must-be-number = Indeksi ya toleo { $index } lazima iwe nambari

variant-index-must-be-integer = Indeksi ya toleo { $index } lazima iwe nambari kamili

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` haijatekelezwa kwa vipimo kamili. Upana unawekwa kuwa wa uwiano.

side-by-side-absolute-margins = `<{ $component }>` haijatekelezwa kwa vipimo kamili. Pambizo zinawekwa kuwa za uwiano.

side-by-side-no-block-child = `<{ $component }>` si sahihi: lazima iwe na angalau mtoto mmoja wa aina ya bloku.

## `<label>`

label-for-ignored-on-graphical = Sifa `for` kwenye `<label>` ya kigrafu hupuuzwa.

label-for-must-resolve-to-one = Sifa `for` kwenye `<label>` lazima ibainishe kipengele kimoja hasa.

label-for-unresolved = Sifa `for` kwenye `<label>` haikuweza kubainishwa kuwa kipengele chochote.

label-for-answer-with-authored-inputs = Sifa `for` kwenye `<label>` inarejelea `<answer>` yenye maingizo yaliyoandikwa wazi; rejelea ingizo lenyewe moja kwa moja.

label-for-answer-without-input = Sifa `for` kwenye `<label>` inarejelea `<answer>` isiyo na ingizo la kuwekewa lebo.

label-for-must-reference-input-or-answer = Sifa `for` kwenye `<label>` lazima irejelee ingizo au jibu.

## Accessibility

accessibility-short-description-or-decorative = Kwa ajili ya ufikivu, `<{ $component }>` lazima iwe na maelezo mafupi au ibainishwe kuwa ya mapambo.

accessibility-video-short-description = Kwa ajili ya ufikivu, `<video>` lazima iwe na maelezo mafupi.

accessibility-input-short-description-or-label = Kwa ajili ya ufikivu, `<{ $component }>` lazima iwe na maelezo mafupi au lebo.

accessibility-answer-input-short-description-or-label = Kwa ajili ya ufikivu, `<answer>` inayounda ingizo lazima iwe na maelezo mafupi au lebo.

accessibility-short-description-contains-math = Maelezo mafupi hayapaswi kuwa na vipengele vya hisabati kama `<{ $component }>`. Eleza hisabati yoyote kwa maneno.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ina utofautishaji usiotosha kwa maandishi ya kichwa cha kifungu (modi ya giza) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; inahitaji angalau { $threshold }:1).
       *[other] { $colorName } ina utofautishaji usiotosha kwa maandishi ya kichwa cha kifungu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; inahitaji angalau { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Bado haijatekelezwa `<circle>` inayopita katika nukta { $count } pale nukta hizo hazina thamani za kinambari.

circle-too-many-through-points = Haiwezi kukokotoa duara linalopita katika nukta zaidi ya 3.

circle-overprescribed-radius-center-points = Haiwezi kukokotoa duara lenye nusukipenyo, kitovu na nukta za kupitia vyote vikiwa vimebainishwa.

circle-center-with-multiple-points = Haiwezi kukokotoa duara lenye kitovu kilichobainishwa linalopita katika nukta zaidi ya 1.

circle-radius-too-small = Haiwezi kukokotoa duara: kwa kuwa umbali kati ya nukta hizo mbili ni { $distance }, nusukipenyo { $radius } kilichobainishwa ni kidogo mno.

circle-radius-with-many-points = Haiwezi kuunda duara linalopita katika nukta zaidi ya mbili likiwa na nusukipenyo kilichobainishwa.

circle-invalid-center-or-through-points = Kitovu au nukta za kupitia za duara si sahihi.

circle-radius-center-with-multiple-points = Haiwezi kukokotoa nusukipenyo cha duara lenye kitovu kilichobainishwa linalopita katika nukta zaidi ya 1.

circle-change-radius-non-numerical = Haiwezi kubadilisha nusukipenyo cha duara linalopita katika nukta zisizo na thamani za kinambari

circle-radius-with-points-non-numerical = Haiwezi kuunda duara linalopita katika nukta zaidi ya moja likiwa na nusukipenyo kilichobainishwa pale hakuna thamani za kinambari.

circle-change-center-non-numerical = Bado haijatekelezwa kubadilisha kitovu cha duara linalopita katika nukta zisizo na thamani za kinambari.

## `<function>`

function-domain-insufficient-dimensions = Vipimo vya kikoa cha fanksheni havitoshi. Kikoa kina vipindi { $intervals } lakini fanksheni ina maingizo { $inputs }.

function-domain-invalid-format = Muundo wa kikoa cha fanksheni si sahihi.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Inapuuza kilele cha juu cha fanksheni kisicho cha kinambari.
        [minimum] Inapuuza kilele cha chini cha fanksheni kisicho cha kinambari.
        [extremum] Inapuuza kilele cha fanksheni kisicho cha kinambari.
        [point] Inapuuza nukta ya fanksheni isiyo ya kinambari.
        [slope] Inapuuza mteremko wa fanksheni usio wa kinambari.
       *[other] Inapuuza { $type } ya fanksheni isiyo ya kinambari.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Inapuuza kilele cha juu cha fanksheni kilicho tupu.
        [minimum] Inapuuza kilele cha chini cha fanksheni kilicho tupu.
        [extremum] Inapuuza kilele cha fanksheni kilicho tupu.
        [point] Inapuuza nukta ya fanksheni iliyo tupu.
       *[other] Inapuuza { $type } ya fanksheni iliyo tupu.
    }

function-points-too-close = Fanksheni ina nukta mbili zilizo karibu mno. Fanksheni haiwezi kufasiliwa.

function-iterates-input-output-mismatch = Marudio ya fanksheni yanawezekana tu ikiwa idadi ya maingizo ya fanksheni ni sawa na idadi ya matokeo yake. Fanksheni hii ina maingizo { $inputs } na matokeo { $outputs }.

## `<sequence>`

sequence-invalid-length = Urefu wa mfuatano si sahihi. Lazima uwe nambari kamili isiyo hasi.

sequence-invalid-step = Hatua ya mfuatano si sahihi. Kwa mfuatano wa aina { $type } lazima iwe nambari.

sequence-invalid-endpoint-number = "{ $attribute }" ya mfuatano wa nambari si sahihi. Lazima iwe nambari.

sequence-invalid-endpoint-letters = "{ $attribute }" ya mfuatano wa herufi si sahihi. Lazima iwe mchanganyiko wa herufi.

sequence-invalid-endpoint = "{ $attribute }" ya mfuatano si sahihi.

select-from-sequence-coprime-not-numbers = coprime inapuuzwa kwa kuwa si nambari zinazochaguliwa

select-from-sequence-coprime-with-exclude-combinations = coprime inapuuzwa kwa kuwa excludeCombinations imebainishwa

## Resolving a `target`

target-not-found = target si sahihi kwa `<{ $source }>`: shabaha haipatikani.

target-state-variable-not-found = target si sahihi kwa `<{ $source }>`: kigezo cha hali chenye jina "{ $property }" hakipatikani kwenye `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Vigezo vya `<odeSystem>` lazima viwe tofauti na kigezo huru.

ode-system-duplicate-variable-names = Haiwezi kufasili fanksheni za ODE RHS zenye majina ya vigezo tegemezi yanayorudiwa.

ode-system-rhs-function-error = Haiwezi kufasili fanksheni ya ODE RHS. Hitilafu wakati wa kuunda fanksheni ya mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Haiwezi kufasili pembe kati ya mistari { $count }

angle-invalid-through-point = Nukta si sahihi katika through ya `<angle>`

parabola-vertex-too-many-points = Bado haijatekelezwa parabola yenye kilele inayopita katika nukta zaidi ya 1.

parabola-too-many-points = Bado haijatekelezwa parabola inayopita katika nukta zaidi ya 3.

intersection-too-many-items = Bado haijatekelezwa mkato wa vitu zaidi ya viwili

## Other math components

ionic-compound-not-two-ions = Bado haijatekelezwa kiwanja ayoni kwa chochote zaidi ya ayoni mbili.

ionic-compound-needs-cation-and-anion = Kiwanja ayoni kimetekelezwa kwa kati moja na ani moja tu.

solve-equations-cannot-evaluate = Haiwezi kutatua mlinganyo kwa kuwa mlinganyo haukuweza kupimwa: { $equation }

math-operators-operand-number-required = operandNumber lazima ibainishwe wakati wa kutoa opereni ya hisabati.

eigen-decomposition-failed = Haiwezi kukokotoa thamani eigen za matriki

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: paramita { $parameters } hazitokei katika muundo, kwa hivyo zitalingana na nafasi tupu kila wakati.

## `<graph>`

graph-grid-invalid = `<graph>`: haiwezi kutafsiri grid="{ $grid }". Lazima iwe none, medium, dense, au nambari mbili chanya zilizotenganishwa kwa nafasi, kama grid="1 0.5". Hakuna gridi inayochorwa.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" haiungwi mkono katika kionyeshi cha prefigure; tabia ya nafasi ya kulia inatumika.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" haiungwi mkono katika kionyeshi cha prefigure; tabia ya nafasi ya juu inatumika.

prefigure-invalid-axis-bounds = `<graph>`: mipaka ya mhimili si sahihi kwa ubadilishaji wa prefigure; bbox chaguo-msingi (-10,-10,10,10) inatumika.

prefigure-invalid-width = `<graph>`: upana si sahihi kwa ubadilishaji wa prefigure; upana chaguo-msingi wa kielelezo 425 unatumika.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio si sahihi kwa ubadilishaji wa prefigure; uwiano chaguo-msingi 1 unatumika.

prefigure-grid-spacing-too-fine = `<graph>`: nafasi za gridi ni finyu mno kwa mipaka ya mhimili; gridi imeachwa katika kionyeshi cha prefigure.

prefigure-annotations-not-rendered = `<graph>`: vidokezo havitaonyeshwa pale kionyeshi cha PreFigure hakitumiki.

multiple-annotations-children = Watoto `<annotations>` wengi wamepatikana katika `<graph>`; wote wanapuuzwa isipokuwa wa mwisho.

## Referring to other components

copy-unrecognized-component-type = Haiwezi kupanua au kunakili aina ya kipengele isiyotambulika: { $type }.

copy-prop-not-found = Sifa { $property } haikupatikana kwenye kipengele cha aina { $component }

collect-no-source = Hakuna chanzo kilichopatikana kwa collect.

collect-invalid-component-type = Haiwezi kukusanya vipengele vya aina `<{ $component }>` kwa kuwa ni aina ya kipengele isiyo sahihi.

reference-index-unavailable = Haiwezi kurejelea indeksi `{ $reference }`

## `<callAction>`

component-action-unavailable = Haiwezi kuita { $action } kwenye kipengele `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Umbo la data si sahihi. Safu mlalo zina urefu usiolingana. Imepatikana katika componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data ina majina ya safu wima yanayorudiwa. Imepatikana katika componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data inakosa jina la safu wima. Imepatikana katika componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award moja ya jibu hili inategemea jibu lililowasilishwa na tagi answer yenyewe, jambo litakalosababisha tabia isiyotarajiwa.

answer-max-num-attempts-in-section-wide-check-work = Kuweka `maxNumAttempts` kwenye `<answer>` iliyo ndani ya chombo chenye `sectionWideCheckWork` hakuna athari, kwa kuwa idadi ya majaribio inadhibitiwa na chombo hicho. Weka `maxNumAttempts` kwenye chombo badala yake.

nested-section-wide-check-work-max-num-attempts = Kuweka `maxNumAttempts` kwenye chombo chenye `sectionWideCheckWork` kilicho ndani ya chombo kingine chenye `sectionWideCheckWork` hakuna athari, kwa kuwa idadi ya majaribio inadhibitiwa na chombo cha nje. Weka `maxNumAttempts` kwenye chombo cha nje badala yake.

answer-attributes-need-symbolic-equality = Sifa { $attributes } hazitakuwa na athari bila symbolicEquality kuwekwa.

answer-invalid-type = Aina si sahihi kwa jibu: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Kwa kuwa kipengele `<{ $component }>` hakina jina, hakiwezi kutumika kama sifa ya module

module-attribute-name-already-defined = Kipengele `<{ $component } name="{ $name }">` hakiwezi kutumika kama sifa ya module kwa kuwa aina ya kipengele `<module>` tayari ina sifa yenye jina "{ $name }".

conditional-content-condition-ignored = Sifa `condition` hupuuzwa kwenye kipengele `<conditionalContent>` chenye watoto case au else.

slider-markers-type-mismatch = Aina ya vialama hailingani na aina ya slider.

pretzel-problem-needs-statement-and-answer = pretzel si sahihi: kila `<problem>` lazima iwe na `<statement>` moja na `<answer>` moja.

pretzel-circuit-first-problem-distractor = pretzel si sahihi: katika mode="circuit", `<problem>` ya kwanza haiwezi kuwa ya kupotosha.

## Attribute values

attribute-invalid-values = Thamani { $values } si sahihi kwa sifa `{ $attribute }`; zinapuuzwa.

attribute-must-be-references = Thamani `{ $value }` si sahihi kwa sifa `{ $attribute }`. Sifa lazima iundwe na marejeleo yanayoanza na `$`.

math-input-invalid-function-names = <mathInput>: inapuuza majina ya fanksheni yasiyo sahihi katika { $attribute }: { $names }. Sehemu ya kuonyesha ya kila jina lazima iwe na angalau herufi 2 (herufi au vistari); kiambishi `|<mathspeak alternative>` cha hiari kinaweza kufuata.

## Building components from the source

component-type-invalid = Aina ya kipengele si sahihi: `<{ $componentType }>`

attribute-repeated = Sifa { $attribute } haiwezi kurudiwa.

attribute-invalid-for-component = Sifa "{ $attribute }" si sahihi kwa kipengele cha aina `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Fasili ya mtindo { $styleNumber } ina utofautishaji usiotosha kwa { $context ->
        [text-on-background] rangi ya maandishi dhidi ya rangi ya mandharinyuma
        [high-contrast] rangi ya utofautishaji wa juu dhidi ya turubai
        [line] rangi ya mstari dhidi ya turubai
        [marker] rangi ya kialama dhidi ya turubai
       *[text-on-canvas] rangi ya maandishi dhidi ya turubai
    }{ $mode ->
        [dark] { " (modi ya giza)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; inahitaji angalau { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Ingawa fasili ya mtindo { $styleNumber } imebainisha rangi zinazotoa utofautishaji unaotosha kwa modi ya mwanga, rangi za modi ya giza zinazotokana nazo zina utofautishaji usiotosha kwa rangi ya maandishi dhidi ya rangi ya mandharinyuma ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; inahitaji angalau { $threshold }:1). { $suggestion ->
        [available] Ili kuhakikisha utofautishaji unaotosha katika modi ya giza, ongeza utofautishaji wa modi ya mwanga (kwa mfano weka { $lightAttribute }="{ $lightColor }") au badilisha rangi ya modi ya giza (kwa mfano weka { $darkAttribute }="{ $darkColor }").
       *[none] Ili kuhakikisha utofautishaji unaotosha katika modi ya giza, ongeza utofautishaji wa modi ya mwanga au badilisha rangi zinazotokana nazo kwa textColorDarkMode na/au backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ingawa fasili ya mtindo { $styleNumber } imebainisha rangi ya maandishi inayotoa utofautishaji unaotosha kwa modi ya mwanga, rangi ya maandishi ya modi ya giza inayotokana nayo ina utofautishaji usiotosha dhidi ya turubai ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; inahitaji angalau { $threshold }:1). { $suggestion ->
        [available] Ili kuhakikisha utofautishaji unaotosha katika modi ya giza, ongeza utofautishaji wa modi ya mwanga (kwa mfano weka textColor="{ $lightColor }") au badilisha rangi ya modi ya giza (kwa mfano weka textColorDarkMode="{ $darkColor }").
       *[none] Ili kuhakikisha utofautishaji unaotosha katika modi ya giza, ongeza utofautishaji wa modi ya mwanga au badilisha rangi inayotokana nayo kwa textColorDarkMode.
    }

section-multiple-style-palettes = Kifungu kinaweza kuchagua <stylePalette> moja tu; cha mwisho kinatumika.

## Unique variants

variant-num-to-select-not-non-negative-integer = haiwezi kubainisha matoleo ya kipekee ya { $component } kwa kuwa numToSelect si nambari kamili isiyo hasi.

variant-num-to-select-not-constant-number = haiwezi kubainisha matoleo ya kipekee ya { $component } kwa kuwa numToSelect si nambari isiyobadilika.

variant-with-replacement-not-constant-boolean = haiwezi kubainisha matoleo ya kipekee ya { $component } kwa kuwa withReplacement si buliani isiyobadilika.

variant-select-weight-disables-unique = Matoleo ya kipekee ya select huzimwa ikiwa kuna chaguo lenye selectWeight au selectForVariants iliyobainishwa

variant-coprime-undetermined = haiwezi kubainisha matoleo ya kipekee ya { $component } kwa kuwa haiwezi kuhakikisha coprime ni uongo kila wakati.

variant-attribute-not-constant = haiwezi kubainisha matoleo ya kipekee ya { $component } kwa kuwa { $attribute } si thabiti.

variant-attribute-not-number = haiwezi kubainisha matoleo ya kipekee ya { $component } kwa kuwa { $attribute } si nambari.

variant-attribute-wrong-type-for-sequence =
    haiwezi kubainisha matoleo ya kipekee ya { $component } ya aina { $type } kwa kuwa { $attribute } si { $expected ->
        [letters-combination] mchanganyiko wa herufi
        [math-expression] kielezi sahihi cha hisabati
        [integer] nambari kamili
       *[number] nambari
    }.

variant-length-not-integer = haiwezi kubainisha matoleo ya kipekee ya { $component } kwa kuwa length si nambari kamili.

variant-sort-not-implemented = bado haijatekelezwa matoleo ya kipekee ya { $component } yenye sort

variant-exclude-combinations-not-implemented = bado haijatekelezwa matoleo ya kipekee ya { $component } yenye excludeCombinations

variant-math-exclude-not-implemented = bado haijatekelezwa matoleo ya kipekee ya { $component } ya aina math yenye exclude

variant-non-constant-exclude-not-implemented = bado haijatekelezwa matoleo ya kipekee ya { $component } yenye exclude isiyo thabiti

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: haiungwi mkono katika kionyeshi cha graph prefigure; kizazi kimerukwa.

prefigure-descendant-invalid-geometry = { $subject }: jiometri isiyo na ukomo au isiyokamilika; kizazi kimerukwa.

prefigure-curve-label-omitted = { $subject }: lebo haziungwi mkono kwenye vipengele vya mkunjo vilivyobadilishwa; lebo imeachwa.

prefigure-curve-unsupported-definition-type = { $subject }: aina ya fasili ya fanksheni ya mkunjo '{ $definitionType }' haiungwi mkono; kizazi kimerukwa.

prefigure-region-flip-functions-unsupported = { $subject }: sifa flipFunctions kwenye regionBetweenCurves haiungwi mkono; kizazi kimerukwa.

prefigure-region-non-formula-child = { $subject }: ni fanksheni watoto za aina ya formula pekee zinazoungwa mkono kwenye regionBetweenCurves; kizazi kimerukwa.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' haiungwi mkono kwa { $labelKind ->
        [line-family] lebo ya familia ya mstari
       *[point] lebo ya nukta
    }; mpangilio chaguo-msingi wa PreFigure unatumika.

prefigure-fill-style-unsupported = { $subject }: mtindo wa kujaza '{ $fillStyle }' hauungwi mkono na PreFigure; inarudi kwenye kujaza kwa rangi moja.

prefigure-line-style-unknown = { $subject }: mtindo wa mstari '{ $lineStyle }' hautambuliki na umeachwa katika matokeo ya PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: mtindo wa kialama '{ $markerStyle }' umeoanishwa na mtindo wa PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: mtindo wa kialama '{ $markerStyle }' hauungwi mkono na PreFigure; mtindo chaguo-msingi unatumika.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` si sahihi; shabaha haiwezi kubainishwa. Kidokezo kimeachwa.

annotation-ref-multiple-targets = `<annotation>`: `ref` imebainisha shabaha nyingi; shabaha ya kwanza inatumika.

annotation-ref-outside-graph = `<annotation>`: `ref` si sahihi; shabaha iko nje ya grafu inayoihifadhi. Kidokezo kimeachwa.

annotation-ref-unsupported-target = `<annotation>`: `ref` si sahihi; shabaha si kitu cha kigrafu kinachoungwa mkono katika ubadilishaji wa prefigure. Kidokezo kimeachwa.

annotation-text-missing = `<annotation>`: `text` haipo au ni tupu; maandishi tupu yanatolewa.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Utegemezi wa mzunguko umegunduliwa.
       *[other] Utegemezi wa mzunguko umegunduliwa unaohusisha kipengele `<{ $componentType }>`.
    }

reference-no-referent = Hakuna kirejelewa kilichopatikana kwa rejeleo: `{ $reference }`

reference-multiple-referents = Virejelewa vingi vimepatikana kwa rejeleo: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Muundo si sahihi kwa sifa { $attribute } ya `<{ $componentType }>`.

children-invalid = Watoto si sahihi kwa `<{ $componentType }>`: Wamepatikana watoto wasio sahihi: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Thamani `{ $value }` si sahihi kwa sifa `{ $attribute }`, thamani `{ $default }` inatumika

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML toleo { $version } halikupatikana.
       *[other] DoenetML toleo { $version } halikupatikana. Inarudi kwenye toleo { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML si sahihi: { $content }

parse-tag-missing-close-tag = DoenetML si sahihi: Tagi `{ $tag }` haina tagi ya kufunga. Ilitarajiwa tagi inayojifunga yenyewe au tagi `</{ $tagName }>`.

parse-tag-error = DoenetML si sahihi: Hitilafu katika tagi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML si sahihi: Sifa `{ $attribute }` isiyo sahihi inaonekana kukosa thamani.

parse-attribute-invalid = DoenetML si sahihi: Sifa `{ $attribute }` si sahihi

parse-attribute-value-invalid = DoenetML si sahihi: Thamani ya sifa `{ $value }` si sahihi

parse-attribute-value-quote-mismatch = DoenetML si sahihi: Thamani ya sifa `{ $value }` si sahihi. Alama za nukuu hazilingani. Inaonekana `{ $quote }` imekosekana

parse-open-tag-name-missing = DoenetML si sahihi: Imepatikana tagi isiyo na jina la tagi, kwa mfano `<`

parse-tag-not-closed = DoenetML si sahihi: Tagi `{ $tag }` haikufungwa (inaonekana `>` imekosekana).

parse-self-closing-tag-name-missing = DoenetML si sahihi: Imepatikana tagi isiyo na jina la tagi `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML si sahihi: Tagi `{ $tag }` haikufungwa (inaonekana `/>` imekosekana).

parse-tag-invalid-attributes = DoenetML si sahihi: Tagi `{ $tag }` si sahihi. Huenda ina sifa zisizo sahihi.

parse-close-tag-name-missing = DoenetML si sahihi: Imepatikana tagi ya kufunga isiyo na jina la tagi, kwa mfano `</`

parse-attribute-value-unquoted = Thamani za sifa lazima ziwekwe ndani ya alama za nukuu: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML si sahihi: Imepatikana tagi ya kufunga `{ $tag }`, lakini hakuna tagi ya kufungua inayolingana

parse-close-tag-mismatched = DoenetML si sahihi: Tagi ya kufunga hailingani. Ilitarajiwa `</{ $expected }>`. Imepatikana `{ $found }`

parser-node-unconvertible = Haikuweza kubadilisha nodi { $node } kuwa nodi ya Dast.

## Names

name-attribute-invalid =
    Sifa name='{ $name }' si sahihi. { $reason ->
        [characters] Majina yanaweza kuwa na herufi, nambari, vistari chini au vistari pekee.
       *[start] Majina lazima yaanze na herufi.
    }

component-name-invalid-start = Jina la kipengele "{ $name }" si sahihi. Majina lazima yaanze na herufi.

## `<answer>` sugar

answer-video-watched-missing-video = Jibu la aina videoWatched lazima liwe na sifa video

answer-video-watched-video-not-reference = Jibu la aina videoWatched lazima liwe na sifa video iliyo rejeleo

answer-name-not-single-text = Sifa name ya jibu lazima iwe na mtoto text mmoja tu

## Referencing another document

external-doenetml-recursion-limit = Haiwezi kupata DoenetML ya nje kwa sababu ya viwango vingi mno vya kujirudia. Je, kuna rejeleo la mzunguko?

external-doenetml-unavailable = Haiwezi kupata DoenetML kutoka { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML iliyopatikana kutoka { $attribute }="{ $uri }" si sahihi: hailingani na aina ya kipengele "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Sifa `{ $from }` imepitwa na wakati; tumia `{ $to }` badala yake.
       *[other] [deprecation] Sifa `{ $from }` kwenye `<{ $component }>` imepitwa na wakati; tumia `{ $to }` badala yake.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Sifa `{ $from }` imepitwa na wakati na inapuuzwa kwa kuwa `{ $to }` pia imebainishwa.
       *[other] [deprecation] Sifa `{ $from }` kwenye `<{ $component }>` imepitwa na wakati na inapuuzwa kwa kuwa `{ $to }` pia imebainishwa.
    }

deprecated-attribute-ignored = [deprecation] Sifa `{ $attribute }` kwenye `<{ $component }>` imepitwa na wakati na inapuuzwa.


## Language coverage

pluralize-english-only = `<pluralize>` inaweza kuweka wingi kwa Kiingereza pekee, kwa hivyo maandishi yake yanabaki kama yalivyo katika hati iliyoandikwa kwa { $locale }. Andika umbo la wingi moja kwa moja, au liweke kwa sifa `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Kipengele `<{ $tag }>` si kipengele cha Doenet kinachotambulika.

schema-element-not-allowed-at-root = Kipengele `<{ $tag }>` hakiruhusiwi kwenye shina la hati.

schema-element-not-allowed-inside = Kipengele `<{ $tag }>` hakiruhusiwi ndani ya `<{ $parent }>`.

schema-attribute-unrecognized = Kipengele `<{ $tag }>` hakina sifa yenye jina `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Sifa `{ $attribute }` ya kipengele `<{ $tag }>` lazima iwe orodha ambayo kila kipengee chake ni mojawapo ya: { $allowed }
       *[other] Sifa `{ $attribute }` ya kipengele `<{ $tag }>` lazima iwe mojawapo ya: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Jina la toleo si sahihi kwa select. Jina la toleo { $variantName } linatokea katika machaguo { $numOptions } lakini idadi ya kuchagua ni { $numToSelect }.

select-variant-name-without-options = Baadhi ya matoleo yamebainishwa kwa select lakini hakuna machaguo yaliyobainishwa kwa jina la toleo linalowezekana: { $variantName }.

select-variant-name-not-possible = Jina la toleo { $variantName } lililobainishwa kwa select si jina la toleo linalowezekana.

select-too-few-options = Haiwezi kuchagua vipengele { $numToSelect } kutoka { $numOptions } pekee.

select-from-sequence-too-few-values = Haiwezi kuchagua thamani { $numToSelect } kutoka mfuatano wenye urefu { $length }.

select-from-sequence-indices-count-mismatch = Idadi ya indeksi zilizobainishwa kwa select lazima ilingane na idadi ya kuchagua

select-from-sequence-indices-not-integers = Indeksi zote zilizobainishwa kwa select lazima ziwe nambari kamili

select-from-sequence-index-excluded = Imebainishwa indeksi ya selectfromsequence iliyotengwa

select-from-sequence-indices-excluded-combination = Zimebainishwa indeksi za selectfromsequence zilizokuwa mchanganyiko uliotengwa

select-from-sequence-coprime-not-positive-integers = Haiwezi kuchagua michanganyiko ya nambari shirikishi kwa kuwa si nambari kamili chanya zinazochaguliwa.

select-from-sequence-coprime-common-factor = Haiwezi kuchagua nambari shirikishi. Thamani zote zinazowezekana zinashiriki kigawe kimoja. (Thamani zilizobainishwa za "from" au "to" lazima ziwe shirikishi na "step".)

select-from-sequence-coprime-single-number = Haiwezi kuchagua michanganyiko ya nambari shirikishi kutoka nambari moja isiyokuwa 1.

select-from-sequence-excluded-too-many-combinations = Zaidi ya 70% ya michanganyiko imetengwa katika selectFromSequence

select-from-sequence-coprime-none-found = Haikuweza kuchagua nambari shirikishi. Thamani zote zinazowezekana zinashiriki kigawe kimoja.

select-from-sequence-too-few-unique-values = Haiwezi kuchagua thamani za kipekee { $numToSelect } kutoka mfuatano wenye urefu { $numPossibleValues }

select-prime-numbers-too-few-values = Haiwezi kuchagua thamani { $numToSelect } kutoka orodha ya nambari tasa yenye urefu { $numValues }

select-prime-numbers-values-count-mismatch = Idadi ya thamani zilizobainishwa kwa select lazima ilingane na idadi ya kuchagua

select-prime-numbers-values-not-prime = Thamani zote zilizobainishwa kwa select prime number lazima ziwe katika orodha ya nambari tasa

select-prime-numbers-values-excluded-combination = Thamani zilizobainishwa za selectPrimeNumbers zilikuwa mchanganyiko uliotengwa

select-prime-numbers-excluded-too-many-combinations = Zaidi ya 70% ya michanganyiko imetengwa katika selectPrimeNumbers

select-random-combination-fluke = Kwa bahati nadra mno, haikuweza kuchagua mchanganyiko wa thamani nasibu

select-random-value-fluke = Kwa bahati nadra mno, haikuweza kuchagua thamani nasibu
