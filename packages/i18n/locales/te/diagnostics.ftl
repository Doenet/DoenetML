# Telugu diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] రెండు అంత్యబిందువులు పేర్కొన్నప్పుడు { $attributes } పట్టించుకోబడదు
       *[other] రెండు అంత్యబిందువులు పేర్కొన్నప్పుడు { $attributes } పట్టించుకోబడవు
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] ఒక అంత్యబిందువు, ఒక మధ్యబిందువు రెండూ పేర్కొన్నప్పుడు { $attributes } పట్టించుకోబడదు
       *[other] ఒక అంత్యబిందువు, ఒక మధ్యబిందువు రెండూ పేర్కొన్నప్పుడు { $attributes } పట్టించుకోబడవు
    }

line-segment-midpoint-offset-without-midpoint = మధ్యబిందువు లేకుండా midpointOffset కు ఎలాంటి ప్రభావమూ ఉండదు

## `<line>`

line-points-undetermined-dimensions = నిర్ధారించని పరిమాణాలు గల బిందువుల గుండా పోయే సరళరేఖ.

line-points-too-few-dimensions = సరళరేఖ కనీసం రెండు పరిమాణాలు గల బిందువుల గుండా పోవాలి.

line-points-depend-on-variables = సరళరేఖ చరరాశులపై ఆధారపడిన బిందువుల గుండా పోతోంది: { $variables }.

line-equation-invalid-format = { $variable1 }, { $variable2 } చరరాశులలో సరళరేఖ సమీకరణానికి చెల్లని రూపం.

## `<ray>`

ray-overprescribed-through = కిరణం through, endpoint, direction అన్నిటి చేత నిర్దేశించబడింది. పేర్కొన్న through పట్టించుకోబడలేదు.

ray-dimension-mismatch = కిరణంలో numDimensions సరిపోలలేదు.

## `<vector>`

vector-overprescribed-head = సదిశ head, tail, displacement అన్నిటి చేత నిర్దేశించబడింది. పేర్కొన్న head పట్టించుకోబడలేదు.

vector-dimension-mismatch = సదిశలో numDimensions సరిపోలలేదు.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` కు nearestPoint స్థితి చరరాశి లేనందున దాని వైపు ఆకర్షించలేము.

constrain-to-without-nearest-point = `<{ $component }>` కు nearestPoint స్థితి చరరాశి లేనందున దానికి పరిమితం చేయలేము.

constrain-to-interior-without-nearest-point = `<{ $component }>` కు nearestPoint స్థితి చరరాశి లేనందున దాని లోపలికి పరిమితం చేయలేము.

## `<choiceInput>`

choice-input-label-position-ignored = ఇన్‌లైన్ కాని choiceInput కు labelPosition పట్టించుకోబడదు

## Ordering children by index

choice-input-indices-count-mismatch = సూచికల సంఖ్య choice శిశువుల సంఖ్యతో సరిపోలనందున choiceInput కు పేర్కొన్న సూచికలు పట్టించుకోబడలేదు.

pretzel-indices-count-mismatch = సూచికల సంఖ్య problem శిశువుల సంఖ్యతో సరిపోలనందున problem కు పేర్కొన్న సూచికలు పట్టించుకోబడలేదు.

shuffle-indices-count-mismatch = సూచికల సంఖ్య భాగాల సంఖ్యతో సరిపోలనందున shuffle కు పేర్కొన్న సూచికలు పట్టించుకోబడలేదు.

indices-ignored-out-of-range = కొన్ని సూచికలు పరిధి దాటినందున { $component } కు పేర్కొన్న సూచికలు పట్టించుకోబడలేదు.

pretzel-indices-repeated = కొన్ని సూచికలు పునరావృతమైనందున pretzel కు పేర్కొన్న సూచికలు పట్టించుకోబడలేదు.

pretzel-circuit-first-index = circuit పద్ధతిలో మొదటి సూచిక 1 అయి ఉండాలి కాబట్టి pretzel కు పేర్కొన్న సూచికలు పట్టించుకోబడలేదు.

## `<shuffle>` and `<sort>`

string-children-need-type = స్ట్రింగు శిశువులతో `<{ $component }>` పనిచేయాలంటే `type` లక్షణం పేర్కొనాలి.

invalid-type-defaulting-to-math = { $component } భాగానికి { $type } అనేది చెల్లని type. అది math, text, number లేదా boolean లలో ఒకటై ఉండాలి. math గా అమర్చబడుతోంది.

string-not-valid-component-to-arrange = "{ $value }" అనే స్ట్రింగు { $component } చేయడానికి తగిన భాగం కాదు. పట్టించుకోబడలేదు.

## Types and variables

invalid-type-defaulting-to-number = { $type } అనేది చెల్లని type, type ను number గా అమరుస్తున్నాం.

invalid-variable-value = చరరాశికి చెల్లని విలువ: `{ $value }`

## Variants

variant-index-must-be-number = రూపాంతర సూచిక { $index } ఒక సంఖ్య అయి ఉండాలి

variant-index-must-be-integer = రూపాంతర సూచిక { $index } ఒక పూర్ణసంఖ్య అయి ఉండాలి

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` నిరపేక్ష కొలతలకు అమలు చేయబడలేదు. వెడల్పులను సాపేక్షంగా అమరుస్తున్నాం.

side-by-side-absolute-margins = `<{ $component }>` నిరపేక్ష కొలతలకు అమలు చేయబడలేదు. అంచులను సాపేక్షంగా అమరుస్తున్నాం.

side-by-side-no-block-child = చెల్లని `<{ $component }>`: దానికి కనీసం ఒక బ్లాకు శిశువు ఉండాలి.

## `<label>`

label-for-ignored-on-graphical = గ్రాఫికల్ `<label>` పై ఉన్న `for` లక్షణం పట్టించుకోబడదు.

label-for-must-resolve-to-one = `<label>` పై ఉన్న `for` లక్షణం సరిగ్గా ఒక భాగానికి పరిష్కరించబడాలి.

label-for-unresolved = `<label>` పై ఉన్న `for` లక్షణాన్ని ఒక భాగానికి పరిష్కరించలేకపోయాం.

label-for-answer-with-authored-inputs = `<label>` పై ఉన్న `for` లక్షణం, స్పష్టంగా రాసిన ఇన్‌పుట్‌లు గల `<answer>` ను సూచిస్తోంది; ఇన్‌పుట్‌ను నేరుగా సూచించండి.

label-for-answer-without-input = `<label>` పై ఉన్న `for` లక్షణం, లేబుల్ పెట్టడానికి ఇన్‌పుట్ లేని `<answer>` ను సూచిస్తోంది.

label-for-must-reference-input-or-answer = `<label>` పై ఉన్న `for` లక్షణం ఒక ఇన్‌పుట్‌ను లేదా ఒక సమాధానాన్ని సూచించాలి.

## Accessibility

accessibility-short-description-or-decorative = అందుబాటు కోసం `<{ $component }>` కు ఒక చిన్న వివరణ ఉండాలి లేదా అది అలంకారమని పేర్కొనాలి.

accessibility-video-short-description = అందుబాటు కోసం `<video>` కు ఒక చిన్న వివరణ ఉండాలి.

accessibility-input-short-description-or-label = అందుబాటు కోసం `<{ $component }>` కు ఒక చిన్న వివరణ లేదా ఒక లేబుల్ ఉండాలి.

accessibility-answer-input-short-description-or-label = అందుబాటు కోసం, ఇన్‌పుట్‌ను సృష్టించే `<answer>` కు ఒక చిన్న వివరణ లేదా ఒక లేబుల్ ఉండాలి.

accessibility-short-description-contains-math = చిన్న వివరణలలో `<{ $component }>` వంటి గణిత భాగాలు ఉండకూడదు. గణితాన్ని మాటల్లో రాయండి.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] విభాగ శీర్షిక పాఠ్యానికి { $colorName } యొక్క వ్యత్యాసం సరిపోదు (చీకటి రీతి) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; కనీసం { $threshold }:1 కావాలి).
       *[other] విభాగ శీర్షిక పాఠ్యానికి { $colorName } యొక్క వ్యత్యాసం సరిపోదు ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; కనీసం { $threshold }:1 కావాలి).
    }

## `<circle>`

circle-through-points-non-numerical = బిందువులకు సంఖ్యా విలువలు లేని సందర్భంలో { $count } బిందువుల గుండా పోయే `<circle>` అమలు చేయబడలేదు.

circle-too-many-through-points = 3 కంటే ఎక్కువ బిందువుల గుండా పోయే వృత్తాన్ని లెక్కించలేము.

circle-overprescribed-radius-center-points = వ్యాసార్ధం, కేంద్రం, గుండా పోయే బిందువులు మూడూ పేర్కొన్న వృత్తాన్ని లెక్కించలేము.

circle-center-with-multiple-points = పేర్కొన్న కేంద్రంతో 1 కంటే ఎక్కువ బిందువు గుండా పోయే వృత్తాన్ని లెక్కించలేము.

circle-radius-too-small = వృత్తాన్ని లెక్కించలేము: రెండు బిందువుల మధ్య దూరం { $distance } కాబట్టి, పేర్కొన్న వ్యాసార్ధం { $radius } చాలా చిన్నది.

circle-radius-with-many-points = పేర్కొన్న వ్యాసార్ధంతో రెండు కంటే ఎక్కువ బిందువుల గుండా పోయే వృత్తాన్ని సృష్టించలేము.

circle-invalid-center-or-through-points = వృత్తం యొక్క కేంద్రం లేదా గుండా పోయే బిందువులు చెల్లనివి.

circle-radius-center-with-multiple-points = పేర్కొన్న కేంద్రంతో 1 కంటే ఎక్కువ బిందువు గుండా పోయే వృత్తం యొక్క వ్యాసార్ధాన్ని లెక్కించలేము.

circle-change-radius-non-numerical = సంఖ్యా విలువలు లేని బిందువుల గుండా పోయే వృత్తం యొక్క వ్యాసార్ధాన్ని మార్చలేము

circle-radius-with-points-non-numerical = సంఖ్యా విలువలు లేనప్పుడు, పేర్కొన్న వ్యాసార్ధంతో ఒకటి కంటే ఎక్కువ బిందువు గుండా పోయే వృత్తాన్ని సృష్టించలేము.

circle-change-center-non-numerical = సంఖ్యా విలువలు లేని బిందువుల గుండా పోయే వృత్తం యొక్క కేంద్రాన్ని మార్చడం అమలు చేయబడలేదు.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] ప్రమేయ ప్రదేశానికి తగినన్ని పరిమాణాలు లేవు. ప్రదేశంలో { $intervals } అంతరం ఉంది, కానీ ప్రమేయానికి { $inputs ->
            [one] { $inputs } ఇన్‌పుట్
           *[other] { $inputs } ఇన్‌పుట్‌లు
        } ఉన్నాయి.
       *[other] ప్రమేయ ప్రదేశానికి తగినన్ని పరిమాణాలు లేవు. ప్రదేశంలో { $intervals } అంతరాలు ఉన్నాయి, కానీ ప్రమేయానికి { $inputs ->
            [one] { $inputs } ఇన్‌పుట్
           *[other] { $inputs } ఇన్‌పుట్‌లు
        } ఉన్నాయి.
    }

function-domain-invalid-format = ప్రమేయ ప్రదేశానికి చెల్లని రూపం.

function-ignoring-non-numerical =
    { $type ->
        [maximum] ప్రమేయం యొక్క సంఖ్యేతర గరిష్ఠం పట్టించుకోబడలేదు.
        [minimum] ప్రమేయం యొక్క సంఖ్యేతర కనిష్ఠం పట్టించుకోబడలేదు.
        [extremum] ప్రమేయం యొక్క సంఖ్యేతర అంత్యమం పట్టించుకోబడలేదు.
        [point] ప్రమేయం యొక్క సంఖ్యేతర బిందువు పట్టించుకోబడలేదు.
        [slope] ప్రమేయం యొక్క సంఖ్యేతర వాలు పట్టించుకోబడలేదు.
       *[other] ప్రమేయం యొక్క సంఖ్యేతర { $type } పట్టించుకోబడలేదు.
    }

function-ignoring-empty =
    { $type ->
        [maximum] ప్రమేయం యొక్క ఖాళీ గరిష్ఠం పట్టించుకోబడలేదు.
        [minimum] ప్రమేయం యొక్క ఖాళీ కనిష్ఠం పట్టించుకోబడలేదు.
        [extremum] ప్రమేయం యొక్క ఖాళీ అంత్యమం పట్టించుకోబడలేదు.
        [point] ప్రమేయం యొక్క ఖాళీ బిందువు పట్టించుకోబడలేదు.
       *[other] ప్రమేయం యొక్క ఖాళీ { $type } పట్టించుకోబడలేదు.
    }

function-points-too-close = ప్రమేయంలో చాలా దగ్గరగా ఉన్న రెండు బిందువులు ఉన్నాయి. ప్రమేయాన్ని నిర్వచించలేము.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] ప్రమేయం యొక్క ఇన్‌పుట్‌ల సంఖ్య అవుట్‌పుట్‌ల సంఖ్యకు సమానమైతేనే ప్రమేయ పునరావృతాలు సాధ్యం. ఈ ప్రమేయానికి { $inputs } ఇన్‌పుట్, { $outputs ->
            [one] { $outputs } అవుట్‌పుట్
           *[other] { $outputs } అవుట్‌పుట్‌లు
        } ఉన్నాయి.
       *[other] ప్రమేయం యొక్క ఇన్‌పుట్‌ల సంఖ్య అవుట్‌పుట్‌ల సంఖ్యకు సమానమైతేనే ప్రమేయ పునరావృతాలు సాధ్యం. ఈ ప్రమేయానికి { $inputs } ఇన్‌పుట్‌లు, { $outputs ->
            [one] { $outputs } అవుట్‌పుట్
           *[other] { $outputs } అవుట్‌పుట్‌లు
        } ఉన్నాయి.
    }

## `<sequence>`

sequence-invalid-length = శ్రేణి పొడవు చెల్లదు. అది ఒక ఋణేతర పూర్ణసంఖ్య అయి ఉండాలి.

sequence-invalid-step = శ్రేణి అంతరం చెల్లదు. { $type } రకం శ్రేణికి అది ఒక సంఖ్య అయి ఉండాలి.

sequence-invalid-endpoint-number = సంఖ్యా శ్రేణి యొక్క "{ $attribute }" చెల్లదు. అది ఒక సంఖ్య అయి ఉండాలి.

sequence-invalid-endpoint-letters = అక్షర శ్రేణి యొక్క "{ $attribute }" చెల్లదు. అది ఒక అక్షర సముదాయం అయి ఉండాలి.

sequence-invalid-endpoint = శ్రేణి యొక్క "{ $attribute }" చెల్లదు.

select-from-sequence-coprime-not-numbers = సంఖ్యలను ఎంచుకోనందున coprime పట్టించుకోబడలేదు

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations పేర్కొన్నందున coprime పట్టించుకోబడలేదు

## Resolving a `target`

target-not-found = `<{ $source }>` కు చెల్లని target: లక్ష్యాన్ని కనుగొనలేకపోయాం.

target-state-variable-not-found = `<{ $source }>` కు చెల్లని target: `<{ $component }>` పై "{ $property }" అనే పేరు గల స్థితి చరరాశిని కనుగొనలేకపోయాం.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` యొక్క చరరాశులు స్వతంత్ర చరరాశికి భిన్నంగా ఉండాలి.

ode-system-duplicate-variable-names = ఒకే పరతంత్ర చరరాశి పేర్లతో ODE RHS ప్రమేయాలను నిర్వచించలేము.

ode-system-rhs-function-error = ODE RHS ప్రమేయాన్ని నిర్వచించలేము. mathjs ప్రమేయాన్ని సృష్టించడంలో దోషం.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } సరళరేఖల మధ్య కోణాన్ని నిర్వచించలేము

angle-invalid-through-point = `<angle>` యొక్క through లో చెల్లని బిందువు

parabola-vertex-too-many-points = శీర్షంతో 1 కంటే ఎక్కువ బిందువు గుండా పోయే పరావలయం అమలు చేయబడలేదు.

parabola-too-many-points = 3 కంటే ఎక్కువ బిందువుల గుండా పోయే పరావలయం అమలు చేయబడలేదు.

intersection-too-many-items = రెండు కంటే ఎక్కువ అంశాలకు ఖండనం అమలు చేయబడలేదు

## Other math components

ionic-compound-not-two-ions = రెండు అయాన్లు తప్ప మరి దేనికీ అయానిక సమ్మేళనం అమలు చేయబడలేదు.

ionic-compound-needs-cation-and-anion = ఒక కేటయాన్, ఒక ఆనయాన్ కు మాత్రమే అయానిక సమ్మేళనం అమలు చేయబడింది.

solve-equations-cannot-evaluate = సమీకరణాన్ని మూల్యాంకనం చేయలేనందున దాన్ని సాధించలేము: { $equation }

math-operators-operand-number-required = గణిత ఉపకరణాన్ని వెలికితీసేటప్పుడు operandNumber పేర్కొనాలి.

eigen-decomposition-failed = మాత్రిక యొక్క ఐగన్ విలువలను లెక్కించలేకపోయాం

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } అనే పరామితి నమూనాలో రానందున అది ఎప్పుడూ ఖాళీతో సరిపోలుతుంది.
       *[other] `<matchesPattern>`: { $parameters } అనే పరామితులు నమూనాలో రానందున అవి ఎప్పుడూ ఖాళీతో సరిపోలుతాయి.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ను అర్థం చేసుకోలేకపోయాం. అది none, medium, dense లేదా ఖాళీతో వేరు చేసిన రెండు ధన సంఖ్యలు — ఉదాహరణకు grid="1 0.5" — అయి ఉండాలి. గ్రిడ్ గీయబడలేదు.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure రెండరర్‌లో xLabelPosition="left" మద్దతు లేదు; కుడి-స్థాన ప్రవర్తన వాడబడుతోంది.

prefigure-y-label-position-unsupported = `<graph>`: prefigure రెండరర్‌లో yLabelPosition="bottom" మద్దతు లేదు; పై-స్థాన ప్రవర్తన వాడబడుతోంది.

prefigure-invalid-axis-bounds = `<graph>`: prefigure మార్పిడికి అక్షాల హద్దులు చెల్లవు; అప్రమేయ bbox (-10,-10,10,10) వాడబడుతోంది.

prefigure-invalid-width = `<graph>`: prefigure మార్పిడికి వెడల్పు చెల్లదు; అప్రమేయ రేఖాచిత్ర వెడల్పు 425 వాడబడుతోంది.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure మార్పిడికి aspectRatio చెల్లదు; అప్రమేయ నిష్పత్తి 1 వాడబడుతోంది.

prefigure-grid-spacing-too-fine = `<graph>`: అక్షాల హద్దులకు గ్రిడ్ అంతరం చాలా సన్నగా ఉంది; prefigure రెండరర్‌లో గ్రిడ్ వదిలివేయబడుతోంది.

prefigure-annotations-not-rendered = `<graph>`: PreFigure రెండరర్ వాడనప్పుడు వ్యాఖ్యానాలు చూపబడవు.

multiple-annotations-children = `<graph>` లో పలు `<annotations>` శిశువులు కనిపించాయి; చివరిది తప్ప మిగిలినవి పట్టించుకోబడలేదు.

## Referring to other components

copy-unrecognized-component-type = గుర్తించని భాగ రకాన్ని విస్తరించలేము లేదా నకలు తీయలేము: { $type }.

copy-prop-not-found = { $component } రకం భాగంపై { $property } లక్షణాన్ని కనుగొనలేకపోయాం

collect-no-source = collect కు మూలం ఏదీ కనిపించలేదు.

collect-invalid-component-type = `<{ $component }>` చెల్లని భాగ రకం కావడంతో ఆ రకం భాగాలను సేకరించలేము.

reference-index-unavailable = `{ $reference }` అనే సూచికను సూచించలేము

## `<callAction>`

component-action-unavailable = `{ $reference }` భాగంపై { $action } ను పిలవలేము

## `<dataFrame>`

data-frame-inconsistent-row-lengths = డేటా ఆకారం చెల్లదు. వరుసల పొడవులు అస్థిరంగా ఉన్నాయి. componentIdx :{ $componentIdx } లో కనిపించింది

data-frame-duplicate-column-names = డేటాలో నిలువు వరుసల పేర్లు పునరావృతమయ్యాయి. componentIdx :{ $componentIdx } లో కనిపించింది

data-frame-missing-column-name = డేటాలో ఒక నిలువు వరుస పేరు లేదు. componentIdx :{ $componentIdx } లో కనిపించింది

## `<answer>` and scoring

answer-award-depends-on-own-response = ఈ సమాధానానికి ఒక award, అదే answer ట్యాగు సమర్పించిన స్పందనపైనే ఆధారపడి ఉంది; ఇది ఊహించని ప్రవర్తనకు దారితీస్తుంది.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` గల కంటైనరు లోపలి `<answer>` పై `maxNumAttempts` అమర్చడం వల్ల ఎలాంటి ప్రభావమూ ఉండదు; ప్రయత్నాల సంఖ్యను ఆ కంటైనరే నియంత్రిస్తుంది. `maxNumAttempts` ను కంటైనరుపై అమర్చండి.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` గల మరో కంటైనరు లోపలి, `sectionWideCheckWork` గల కంటైనరుపై `maxNumAttempts` అమర్చడం వల్ల ఎలాంటి ప్రభావమూ ఉండదు; ప్రయత్నాల సంఖ్యను బయటి కంటైనరే నియంత్రిస్తుంది. `maxNumAttempts` ను బయటి కంటైనరుపై అమర్చండి.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality అమర్చకుండా { $attributes } లక్షణానికి ఎలాంటి ప్రభావమూ ఉండదు.
       *[other] symbolicEquality అమర్చకుండా { $attributes } లక్షణాలకు ఎలాంటి ప్రభావమూ ఉండదు.
    }

answer-invalid-type = సమాధానానికి చెల్లని రకం: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` భాగానికి పేరు లేనందున, దాన్ని module లక్షణంగా వాడలేము

module-attribute-name-already-defined = `<module>` భాగ రకంలో "{ $name }" అనే లక్షణం ఇప్పటికే నిర్వచించబడినందున, `<{ $component } name="{ $name }">` అనే భాగాన్ని module కు లక్షణంగా వాడలేము.

conditional-content-condition-ignored = case లేదా else శిశువులు గల `<conditionalContent>` భాగంపై `condition` లక్షణం పట్టించుకోబడదు.

slider-markers-type-mismatch = గుర్తుల రకం slider రకంతో సరిపోలలేదు.

pretzel-problem-needs-statement-and-answer = చెల్లని pretzel: ప్రతి `<problem>` లో ఒక `<statement>`, ఒక `<answer>` ఉండాలి.

pretzel-circuit-first-problem-distractor = చెల్లని pretzel: mode="circuit" లో మొదటి `<problem>` ఒక పరధ్యానం కాకూడదు.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` లక్షణానికి చెల్లని విలువ { $values }; పట్టించుకోబడలేదు.
       *[other] `{ $attribute }` లక్షణానికి చెల్లని విలువలు { $values }; పట్టించుకోబడలేదు.
    }

attribute-must-be-references = `{ $attribute }` లక్షణానికి `{ $value }` చెల్లని విలువ. ఆ లక్షణం `$` తో మొదలయ్యే నిర్దేశాలతో కూడి ఉండాలి.

math-input-invalid-function-names = <mathInput>: { $attribute } లోని చెల్లని ప్రమేయ పేరు(ల)ను పట్టించుకోలేదు: { $names }. ప్రతి పేరు యొక్క ప్రదర్శన భాగం కనీసం 2 అక్షరాలు (అక్షరాలు లేదా హైఫన్లు) కలిగి ఉండాలి; ఆ తర్వాత ఐచ్ఛికంగా `|<mathspeak alternative>` ప్రత్యయం రావచ్చు.

## Building components from the source

component-type-invalid = చెల్లని భాగ రకం: `<{ $componentType }>`

attribute-repeated = { $attribute } లక్షణాన్ని పునరావృతం చేయలేము.

attribute-invalid-for-component = `<{ $componentType }>` రకం భాగానికి "{ $attribute }" చెల్లని లక్షణం.

## Style definition contrast

style-definition-insufficient-contrast =
    శైలి నిర్వచనం { $styleNumber } లో { $context ->
        [text-on-background] నేపథ్య రంగుపై పాఠ్య రంగు
        [high-contrast] కాన్వాసుపై అధిక-వ్యత్యాస రంగు
        [line] కాన్వాసుపై రేఖ రంగు
        [marker] కాన్వాసుపై గుర్తు రంగు
       *[text-on-canvas] కాన్వాసుపై పాఠ్య రంగు
    } యొక్క వ్యత్యాసం సరిపోదు{ $mode ->
        [dark] { " (చీకటి రీతి)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; కనీసం { $threshold }:1 కావాలి).

style-definition-dark-mode-text-background-contrast =
    శైలి నిర్వచనం { $styleNumber } వెలుతురు రీతికి సరిపోయే వ్యత్యాసమిచ్చే రంగులను పేర్కొన్నప్పటికీ, వాటి నుంచి తీసుకున్న చీకటి రీతి రంగులలో నేపథ్య రంగుపై పాఠ్య రంగు వ్యత్యాసం సరిపోదు ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; కనీసం { $threshold }:1 కావాలి). { $suggestion ->
        [available] చీకటి రీతిలో తగినంత వ్యత్యాసం కోసం, వెలుతురు రీతి వ్యత్యాసాన్ని పెంచండి (ఉదా. { $lightAttribute }="{ $lightColor }" అమర్చండి) లేదా చీకటి రీతి రంగును అధిగమించండి (ఉదా. { $darkAttribute }="{ $darkColor }" అమర్చండి).
       *[none] చీకటి రీతిలో తగినంత వ్యత్యాసం కోసం, వెలుతురు రీతి వ్యత్యాసాన్ని పెంచండి లేదా తీసుకున్న రంగులను textColorDarkMode మరియు/లేదా backgroundColorDarkMode తో అధిగమించండి.
    }

style-definition-dark-mode-text-canvas-contrast =
    శైలి నిర్వచనం { $styleNumber } వెలుతురు రీతికి సరిపోయే వ్యత్యాసమిచ్చే పాఠ్య రంగును పేర్కొన్నప్పటికీ, దాని నుంచి తీసుకున్న చీకటి రీతి పాఠ్య రంగుకు కాన్వాసుపై వ్యత్యాసం సరిపోదు ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; కనీసం { $threshold }:1 కావాలి). { $suggestion ->
        [available] చీకటి రీతిలో తగినంత వ్యత్యాసం కోసం, వెలుతురు రీతి వ్యత్యాసాన్ని పెంచండి (ఉదా. textColor="{ $lightColor }" అమర్చండి) లేదా చీకటి రీతి రంగును అధిగమించండి (ఉదా. textColorDarkMode="{ $darkColor }" అమర్చండి).
       *[none] చీకటి రీతిలో తగినంత వ్యత్యాసం కోసం, వెలుతురు రీతి వ్యత్యాసాన్ని పెంచండి లేదా తీసుకున్న రంగును textColorDarkMode తో అధిగమించండి.
    }

section-multiple-style-palettes = ఒక విభాగం ఒకే ఒక <stylePalette> ను ఎంచుకోగలదు; చివరిది వాడబడుతోంది.

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect ఋణేతర పూర్ణసంఖ్య కానందున { $component } యొక్క ప్రత్యేక రూపాంతరాలను నిర్ధారించలేము.

variant-num-to-select-not-constant-number = numToSelect స్థిర సంఖ్య కానందున { $component } యొక్క ప్రత్యేక రూపాంతరాలను నిర్ధారించలేము.

variant-with-replacement-not-constant-boolean = withReplacement స్థిర boolean కానందున { $component } యొక్క ప్రత్యేక రూపాంతరాలను నిర్ధారించలేము.

variant-select-weight-disables-unique = selectWeight లేదా selectForVariants పేర్కొన్న ఒక ఎంపిక ఉంటే select కు ప్రత్యేక రూపాంతరాలు నిలిపివేయబడతాయి

variant-coprime-undetermined = coprime ఎప్పుడూ తప్పు అని నిర్ధారించలేనందున { $component } యొక్క ప్రత్యేక రూపాంతరాలను నిర్ధారించలేము.

variant-attribute-not-constant = { $attribute } స్థిరాంకం కానందున { $component } యొక్క ప్రత్యేక రూపాంతరాలను నిర్ధారించలేము.

variant-attribute-not-number = { $attribute } సంఖ్య కానందున { $component } యొక్క ప్రత్యేక రూపాంతరాలను నిర్ధారించలేము.

variant-attribute-wrong-type-for-sequence =
    { $attribute } అనేది { $expected ->
        [letters-combination] ఒక అక్షర సముదాయం
        [math-expression] ఒక చెల్లుబాటయ్యే గణిత సమాసం
        [integer] ఒక పూర్ణసంఖ్య
       *[number] ఒక సంఖ్య
    } కానందున { $type } రకం { $component } యొక్క ప్రత్యేక రూపాంతరాలను నిర్ధారించలేము.

variant-length-not-integer = length పూర్ణసంఖ్య కానందున { $component } యొక్క ప్రత్యేక రూపాంతరాలను నిర్ధారించలేము.

variant-sort-not-implemented = sort గల { $component } యొక్క ప్రత్యేక రూపాంతరాలు అమలు చేయబడలేదు

variant-exclude-combinations-not-implemented = excludeCombinations గల { $component } యొక్క ప్రత్యేక రూపాంతరాలు అమలు చేయబడలేదు

variant-math-exclude-not-implemented = exclude గల math రకం { $component } యొక్క ప్రత్యేక రూపాంతరాలు అమలు చేయబడలేదు

variant-non-constant-exclude-not-implemented = స్థిరం కాని exclude గల { $component } యొక్క ప్రత్యేక రూపాంతరాలు అమలు చేయబడలేదు

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure రెండరర్‌లో మద్దతు లేదు; వారసుడు వదిలివేయబడ్డాడు.

prefigure-descendant-invalid-geometry = { $subject }: అనంత లేదా అసంపూర్ణ జ్యామితి; వారసుడు వదిలివేయబడ్డాడు.

prefigure-curve-label-omitted = { $subject }: మార్చిన వక్రరేఖ మూలకాలపై లేబుల్‌లకు మద్దతు లేదు; లేబుల్ వదిలివేయబడింది.

prefigure-curve-unsupported-definition-type = { $subject }: మద్దతు లేని వక్రరేఖ ప్రమేయ నిర్వచన రకం '{ $definitionType }'; వారసుడు వదిలివేయబడ్డాడు.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves పై మద్దతు లేని flipFunctions లక్షణం; వారసుడు వదిలివేయబడ్డాడు.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves పై సూత్ర రకం శిశు ప్రమేయాలకు మాత్రమే మద్దతు ఉంది; వారసుడు వదిలివేయబడ్డాడు.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] రేఖ కుటుంబ లేబుల్‌కు
       *[point] బిందు లేబుల్‌కు
    } మద్దతు లేని labelPosition '{ $labelPosition }'; అప్రమేయ PreFigure అమరిక వాడబడింది.

prefigure-fill-style-unsupported = { $subject }: నింపు శైలి '{ $fillStyle }' కు PreFigure మద్దతు ఇవ్వదు; ఘన నింపునకు మారుతోంది.

prefigure-line-style-unknown = { $subject }: తెలియని రేఖ శైలి '{ $lineStyle }' PreFigure అవుట్‌పుట్ నుంచి వదిలివేయబడింది.

prefigure-marker-style-mapped-to-diamond = { $subject }: గుర్తు శైలి '{ $markerStyle }' PreFigure శైలి 'diamond' కు మ్యాపు చేయబడింది.

prefigure-marker-style-unsupported = { $subject }: గుర్తు శైలి '{ $markerStyle }' కు PreFigure మద్దతు ఇవ్వదు; అప్రమేయ శైలి వాడబడింది.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: చెల్లని `ref`; లక్ష్యాన్ని పరిష్కరించలేకపోయాం. వ్యాఖ్యానం వదిలివేయబడింది.

annotation-ref-multiple-targets = `<annotation>`: `ref` పలు లక్ష్యాలకు పరిష్కరించబడింది; మొదటి లక్ష్యం వాడబడుతోంది.

annotation-ref-outside-graph = `<annotation>`: చెల్లని `ref`; లక్ష్యం దాన్ని కలిగిన గ్రాఫుకు వెలుపల ఉంది. వ్యాఖ్యానం వదిలివేయబడింది.

annotation-ref-unsupported-target = `<annotation>`: చెల్లని `ref`; prefigure మార్పిడిలో లక్ష్యం మద్దతు గల గ్రాఫిక్ వస్తువు కాదు. వ్యాఖ్యానం వదిలివేయబడింది.

annotation-text-missing = `<annotation>`: `text` లేదు లేదా ఖాళీగా ఉంది; ఖాళీ పాఠ్యం ఇవ్వబడుతోంది.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] వృత్తాకార ఆధారపడటం కనుగొనబడింది.
       *[other] `<{ $componentType }>` భాగంతో కూడిన వృత్తాకార ఆధారపడటం కనుగొనబడింది.
    }

reference-no-referent = ఈ నిర్దేశానికి ఏదీ కనిపించలేదు: `{ $reference }`

reference-multiple-referents = ఈ నిర్దేశానికి పలు లక్ష్యాలు కనిపించాయి: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` యొక్క { $attribute } లక్షణానికి చెల్లని రూపం.

children-invalid = `<{ $componentType }>` కు చెల్లని శిశువులు: చెల్లని శిశువులు కనిపించాయి: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` లక్షణానికి `{ $value }` చెల్లని విలువ, `{ $default }` అనే విలువ వాడబడుతోంది

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML రూపాంతరం { $version } కనిపించలేదు.
       *[other] DoenetML రూపాంతరం { $version } కనిపించలేదు. రూపాంతరం { $fallback } వాడబడుతోంది
    }

## Reading the DoenetML

parse-invalid-doenetml = చెల్లని DoenetML: { $content }

parse-tag-missing-close-tag = చెల్లని DoenetML: `{ $tag }` ట్యాగుకు మూసే ట్యాగు లేదు. స్వయం-మూసుకునే ట్యాగు లేదా `</{ $tagName }>` ట్యాగు ఆశించబడింది.

parse-tag-error = చెల్లని DoenetML: `<{ $tagName }>` ట్యాగులో దోషం

parse-attribute-missing-value = చెల్లని DoenetML: `{ $attribute }` అనే చెల్లని లక్షణానికి విలువ లేనట్టు కనిపిస్తోంది.

parse-attribute-invalid = చెల్లని DoenetML: చెల్లని లక్షణం `{ $attribute }`

parse-attribute-value-invalid = చెల్లని DoenetML: చెల్లని లక్షణ విలువ `{ $value }`

parse-attribute-value-quote-mismatch = చెల్లని DoenetML: చెల్లని లక్షణ విలువ `{ $value }`. కొటేషను గుర్తులు సరిపోలలేదు. `{ $quote }` లేనట్టు కనిపిస్తోంది

parse-open-tag-name-missing = చెల్లని DoenetML: పేరు లేని ఒక ట్యాగు కనిపించింది, ఉదా. `<`

parse-tag-not-closed = చెల్లని DoenetML: `{ $tag }` ట్యాగు మూయబడలేదు (`>` లేనట్టు కనిపిస్తోంది).

parse-self-closing-tag-name-missing = చెల్లని DoenetML: పేరు లేని ఒక ట్యాగు కనిపించింది `<{ $content }>`

parse-self-closing-tag-not-closed = చెల్లని DoenetML: `{ $tag }` ట్యాగు మూయబడలేదు (`/>` లేనట్టు కనిపిస్తోంది).

parse-tag-invalid-attributes = చెల్లని DoenetML: `{ $tag }` ట్యాగు చెల్లదు. దాని లక్షణాలు తప్పుగా ఉండవచ్చు.

parse-close-tag-name-missing = చెల్లని DoenetML: పేరు లేని ఒక మూసే ట్యాగు కనిపించింది, ఉదా. `</`

parse-attribute-value-unquoted = లక్షణ విలువలు కొటేషను గుర్తులలో ఉండాలి: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = చెల్లని DoenetML: `{ $tag }` అనే మూసే ట్యాగు కనిపించింది, కానీ దానికి సరిపోయే తెరిచే ట్యాగు లేదు

parse-close-tag-mismatched = చెల్లని DoenetML: మూసే ట్యాగు సరిపోలలేదు. `</{ $expected }>` ఆశించబడింది. `{ $found }` కనిపించింది

parser-node-unconvertible = { $node } అనే నోడును Dast నోడుగా మార్చలేకపోయాం.

## Names

name-attribute-invalid =
    చెల్లని లక్షణం name='{ $name }'. { $reason ->
        [characters] పేర్లలో అక్షరాలు, అంకెలు, అండర్‌స్కోర్లు లేదా హైఫన్లు మాత్రమే ఉండగలవు.
       *[start] పేర్లు ఒక అక్షరంతో మొదలవ్వాలి.
    }

component-name-invalid-start = చెల్లని భాగ పేరు "{ $name }". పేర్లు ఒక అక్షరంతో మొదలవ్వాలి.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched రకం సమాధానానికి ఒక video లక్షణం ఉండాలి

answer-video-watched-video-not-reference = videoWatched రకం సమాధానం యొక్క video లక్షణం ఒక నిర్దేశం అయి ఉండాలి

answer-name-not-single-text = సమాధానం యొక్క name లక్షణానికి ఒకే ఒక text శిశువు ఉండాలి

## Referencing another document

external-doenetml-recursion-limit = మరీ ఎక్కువ స్థాయిల పునరావృతం వల్ల బాహ్య DoenetML ను తీసుకురాలేకపోయాం. వృత్తాకార నిర్దేశం ఏమైనా ఉందా?

external-doenetml-unavailable = { $attribute }="{ $uri }" నుంచి DoenetML ను తీసుకురాలేకపోయాం

external-doenetml-type-mismatch = { $attribute }="{ $uri }" నుంచి తీసుకున్న DoenetML చెల్లదు: అది "{ $componentType }" అనే భాగ రకంతో సరిపోలలేదు

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` లక్షణం నిలిపివేయబడుతోంది; బదులుగా `{ $to }` వాడండి.
       *[other] [deprecation] `<{ $component }>` పై ఉన్న `{ $from }` లక్షణం నిలిపివేయబడుతోంది; బదులుగా `{ $to }` వాడండి.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` కూడా పేర్కొన్నందున `{ $from }` లక్షణం నిలిపివేయబడుతోంది, పట్టించుకోబడలేదు.
       *[other] [deprecation] `{ $to }` కూడా పేర్కొన్నందున `<{ $component }>` పై ఉన్న `{ $from }` లక్షణం నిలిపివేయబడుతోంది, పట్టించుకోబడలేదు.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` పై ఉన్న `{ $attribute }` లక్షణం నిలిపివేయబడుతోంది, పట్టించుకోబడలేదు.


## Language coverage

pluralize-english-only = `<pluralize>` ఆంగ్లాన్ని మాత్రమే బహువచనం చేయగలదు, కాబట్టి { $locale } భాషలో రాసిన పత్రంలో దాని పాఠ్యం మార్చకుండా వదిలివేయబడుతుంది. బహువచన రూపాన్ని నేరుగా రాయండి, లేదా `pluralForm` లక్షణంతో అమర్చండి.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` అనేది గుర్తించబడిన Doenet మూలకం కాదు.

schema-element-not-allowed-at-root = పత్రం మూలంలో `<{ $tag }>` మూలకం అనుమతించబడదు.

schema-element-not-allowed-inside = `<{ $parent }>` లోపల `<{ $tag }>` మూలకం అనుమతించబడదు.

schema-attribute-unrecognized = `<{ $tag }>` మూలకానికి `{ $attribute }` అనే లక్షణం లేదు.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` మూలకం యొక్క `{ $attribute }` లక్షణం, ప్రతి అంశమూ వీటిలో ఒకటిగా ఉండే జాబితా అయి ఉండాలి: { $allowed }
       *[other] `<{ $tag }>` మూలకం యొక్క `{ $attribute }` లక్షణం వీటిలో ఒకటై ఉండాలి: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select కు చెల్లని రూపాంతర పేరు. రూపాంతర పేరు { $variantName } అనేది { $numOptions } ఎంపికలలో వస్తోంది, కానీ ఎంచుకోవలసిన సంఖ్య { $numToSelect }.

select-variant-name-without-options = select కు కొన్ని రూపాంతరాలు పేర్కొన్నారు, కానీ సాధ్యమైన రూపాంతర పేరుకు ఎంపికలు ఏవీ పేర్కొనలేదు: { $variantName }.

select-variant-name-not-possible = select కు పేర్కొన్న రూపాంతర పేరు { $variantName } ఒక సాధ్యమైన రూపాంతర పేరు కాదు.

select-too-few-options = { $numOptions } భాగాల నుంచి { $numToSelect } భాగాలను ఎంచుకోలేము.

select-from-sequence-too-few-values = { $length } పొడవు గల శ్రేణి నుంచి { $numToSelect } విలువలను ఎంచుకోలేము.

select-from-sequence-indices-count-mismatch = select కు పేర్కొన్న సూచికల సంఖ్య, ఎంచుకోవలసిన సంఖ్యతో సరిపోలాలి

select-from-sequence-indices-not-integers = select కు పేర్కొన్న అన్ని సూచికలూ పూర్ణసంఖ్యలై ఉండాలి

select-from-sequence-index-excluded = మినహాయించిన ఒక selectfromsequence సూచిక పేర్కొనబడింది

select-from-sequence-indices-excluded-combination = మినహాయించిన సముదాయమైన selectfromsequence సూచికలు పేర్కొనబడ్డాయి

select-from-sequence-coprime-not-positive-integers = ధన పూర్ణసంఖ్యలను ఎంచుకోనందున సాపేక్ష ప్రధాన సముదాయాలను ఎంచుకోలేము.

select-from-sequence-coprime-common-factor = సాపేక్ష ప్రధాన సంఖ్యలను ఎంచుకోలేము. సాధ్యమైన అన్ని విలువలకూ ఒక ఉమ్మడి కారణాంకం ఉంది. ("from" లేదా "to" యొక్క పేర్కొన్న విలువలు "step" తో సాపేక్ష ప్రధానంగా ఉండాలి.)

select-from-sequence-coprime-single-number = 1 కాని ఒకే ఒక సంఖ్య నుంచి సాపేక్ష ప్రధాన సముదాయాలను ఎంచుకోలేము.

select-from-sequence-excluded-too-many-combinations = selectFromSequence లో 70% కంటే ఎక్కువ సముదాయాలు మినహాయించబడ్డాయి

select-from-sequence-coprime-none-found = సాపేక్ష ప్రధాన సంఖ్యలను ఎంచుకోలేకపోయాం. సాధ్యమైన అన్ని విలువలకూ ఒక ఉమ్మడి కారణాంకం ఉంది.

select-from-sequence-too-few-unique-values = { $numPossibleValues } పొడవు గల శ్రేణి నుంచి { $numToSelect } ప్రత్యేక విలువలను ఎంచుకోలేము

select-prime-numbers-too-few-values = { $numValues } పొడవు గల ప్రధాన సంఖ్యల జాబితా నుంచి { $numToSelect } విలువలను ఎంచుకోలేము

select-prime-numbers-values-count-mismatch = select కు పేర్కొన్న విలువల సంఖ్య, ఎంచుకోవలసిన సంఖ్యతో సరిపోలాలి

select-prime-numbers-values-not-prime = select prime number కు పేర్కొన్న అన్ని విలువలూ ప్రధాన సంఖ్యల జాబితాలో ఉండాలి

select-prime-numbers-values-excluded-combination = selectPrimeNumbers కు పేర్కొన్న విలువలు మినహాయించిన సముదాయంగా ఉన్నాయి

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers లో 70% కంటే ఎక్కువ సముదాయాలు మినహాయించబడ్డాయి

select-random-combination-fluke = అత్యంత అరుదైన యాదృచ్ఛికం వల్ల, యాదృచ్ఛిక విలువల సముదాయాన్ని ఎంచుకోలేకపోయాం

select-random-value-fluke = అత్యంత అరుదైన యాదృచ్ఛికం వల్ల, యాదృచ్ఛిక విలువను ఎంచుకోలేకపోయాం
