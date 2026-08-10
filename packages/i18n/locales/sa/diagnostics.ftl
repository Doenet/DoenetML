# Sanskrit diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`
# and the rest — are part of the language rather than prose, and stay in
# English exactly as written. So does the `[deprecation]` marker.
#
# Every join across a placeable is unsandhied, for the reason `content.ftl`'s
# header gives: a word standing beside a value this catalog never sees cannot
# be euphonically combined with it.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] द्वयोः अन्तबिन्द्वोः उक्तयोः { $attributes } उपेक्ष्यते
       *[other] द्वयोः अन्तबिन्द्वोः उक्तयोः { $attributes } उपेक्ष्यन्ते
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] अन्तबिन्दौ मध्यबिन्दौ च उभयोः उक्तयोः { $attributes } उपेक्ष्यते
       *[other] अन्तबिन्दौ मध्यबिन्दौ च उभयोः उक्तयोः { $attributes } उपेक्ष्यन्ते
    }

line-segment-midpoint-offset-without-midpoint = मध्यबिन्दुं विना midpointOffset निष्फलम्

## `<line>`

line-points-undetermined-dimensions = अनिर्णीतपरिमाणानां बिन्दूनां माध्यमेन रेखा।

line-points-too-few-dimensions = रेखा न्यूनातिन्यूनं द्विपरिमाणानां बिन्दूनां माध्यमेन भवेत्।

line-points-depend-on-variables = रेखा तेषु बिन्दुषु गच्छति ये चलेषु आश्रिताः: { $variables }।

line-equation-invalid-format = { $variable1 } { $variable2 } चलयोः रेखासमीकरणस्य अमान्यं रूपम्।

## `<ray>`

ray-overprescribed-through = किरणः through, endpoint, direction इत्येतैः त्रिभिः निर्दिष्टः। उक्तं through उपेक्ष्यते।

ray-dimension-mismatch = किरणे numDimensions न मिलति।

## `<vector>`

vector-overprescribed-head = सदिशः head, tail, displacement इत्येतैः त्रिभिः निर्दिष्टः। उक्तं head उपेक्ष्यते।

vector-dimension-mismatch = सदिशे numDimensions न मिलति।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` इत्यस्मिन् nearestPoint इति स्थितिचलः नास्ति, अतः तत्र आकर्षणं न शक्यम्।

constrain-to-without-nearest-point = `<{ $component }>` इत्यस्मिन् nearestPoint इति स्थितिचलः नास्ति, अतः तत्र नियन्त्रणं न शक्यम्।

constrain-to-interior-without-nearest-point = `<{ $component }>` इत्यस्मिन् nearestPoint इति स्थितिचलः नास्ति, अतः तस्य अन्तर्भागे नियन्त्रणं न शक्यम्।

## `<choiceInput>`

choice-input-label-position-ignored = अन्तःपङ्क्तिरहिते choiceInput इत्यस्मिन् labelPosition उपेक्ष्यते

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput इत्यस्य कृते उक्ताः अनुक्रमाः उपेक्ष्यन्ते, यतः अनुक्रमाणां सङ्ख्या विकल्पापत्यानां सङ्ख्यया सह न मिलति।

pretzel-indices-count-mismatch = problem इत्यस्य कृते उक्ताः अनुक्रमाः उपेक्ष्यन्ते, यतः अनुक्रमाणां सङ्ख्या problem-अपत्यानां सङ्ख्यया सह न मिलति।

shuffle-indices-count-mismatch = shuffle इत्यस्य कृते उक्ताः अनुक्रमाः उपेक्ष्यन्ते, यतः अनुक्रमाणां सङ्ख्या घटकानां सङ्ख्यया सह न मिलति।

indices-ignored-out-of-range = { $component } इत्यस्य कृते उक्ताः अनुक्रमाः उपेक्ष्यन्ते, यतः केचन अनुक्रमाः सीमातः बहिः सन्ति।

pretzel-indices-repeated = pretzel इत्यस्य कृते उक्ताः अनुक्रमाः उपेक्ष्यन्ते, यतः केचन अनुक्रमाः पुनरुक्ताः।

pretzel-circuit-first-index = circuit-प्रकारे pretzel इत्यस्य कृते उक्ताः अनुक्रमाः उपेक्ष्यन्ते, यतः प्रथमः अनुक्रमः 1 भवेत्।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` इत्यस्य कृते शब्दापत्यैः सह कार्यार्थं `type` इति विशेषणम् अवश्यं वक्तव्यम्।

invalid-type-defaulting-to-math = { $component } घटकस्य कृते { $type } इति प्रकारः अमान्यः। math, text, number, boolean इत्येतेषु एकः भवेत्। math इति पूर्वनिर्धारितं गृह्यते।

string-not-valid-component-to-arrange = "{ $value }" इति शब्दः { $component } इत्यस्य कृते मान्यः घटकः नास्ति। उपेक्ष्यते।

## Types and variables

invalid-type-defaulting-to-number = { $type } इति प्रकारः अमान्यः, प्रकारः number इति स्थाप्यते।

invalid-variable-value = चलस्य अमान्यं मूल्यम्: `{ $value }`

## Variants

variant-index-must-be-number = भेदानुक्रमः { $index } सङ्ख्या भवेत्

variant-index-must-be-integer = भेदानुक्रमः { $index } पूर्णाङ्कः भवेत्

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` निरपेक्षमापनानां कृते न निर्मितम्। विस्ताराः सापेक्षाः क्रियन्ते।

side-by-side-absolute-margins = `<{ $component }>` निरपेक्षमापनानां कृते न निर्मितम्। प्रान्ताः सापेक्षाः क्रियन्ते।

side-by-side-no-block-child = अमान्यम् `<{ $component }>`: अस्मिन् न्यूनातिन्यूनम् एकं खण्डापत्यम् आवश्यकम्।

## `<label>`

label-for-ignored-on-graphical = आलेखीये `<label>` इत्यस्मिन् `for` इति विशेषणम् उपेक्ष्यते।

label-for-must-resolve-to-one = `<label>` इत्यस्मिन् `for` इति विशेषणम् अवश्यम् एकम् एव घटकं निर्दिशेत्।

label-for-unresolved = `<label>` इत्यस्मिन् `for` इति विशेषणं कञ्चन घटकं निर्देष्टुं न शक्तम्।

label-for-answer-with-authored-inputs = `<label>` इत्यस्मिन् `for` इति विशेषणं तम् `<answer>` निर्दिशति यस्मिन् लेखकेन स्वयं निवेशाः लिखिताः; साक्षात् निवेशः निर्दिश्यताम्।

label-for-answer-without-input = `<label>` इत्यस्मिन् `for` इति विशेषणं तम् `<answer>` निर्दिशति यस्मिन् नामाङ्कनयोग्यः निवेशः नास्ति।

label-for-must-reference-input-or-answer = `<label>` इत्यस्मिन् `for` इति विशेषणम् अवश्यं निवेशम् उत्तरं वा निर्दिशेत्।

## Accessibility

accessibility-short-description-or-decorative = सुगम्यतायै `<{ $component }>` इत्यस्य वा संक्षिप्तवर्णनम् आवश्यकं वा तत् decorative इति वक्तव्यम्।

accessibility-video-short-description = सुगम्यतायै `<video>` इत्यस्य संक्षिप्तवर्णनम् आवश्यकम्।

accessibility-input-short-description-or-label = सुगम्यतायै `<{ $component }>` इत्यस्य संक्षिप्तवर्णनं नामाङ्कनं वा आवश्यकम्।

accessibility-answer-input-short-description-or-label = सुगम्यतायै निवेशं जनयतः `<answer>` इत्यस्य संक्षिप्तवर्णनं नामाङ्कनं वा आवश्यकम्।

accessibility-short-description-contains-math = संक्षिप्तवर्णनेषु `<{ $component }>` इत्यादीनि गणितघटकानि न स्थापनीयानि। गणितं शब्दैः लिख्यताम्।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] अध्यायशीर्षकपाठ्यस्य कृते { $colorName } इत्यस्य वैषम्यम् अपर्याप्तम् (कृष्णपटलम्) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; न्यूनातिन्यूनं { $threshold }:1 आवश्यकम्)।
       *[other] अध्यायशीर्षकपाठ्यस्य कृते { $colorName } इत्यस्य वैषम्यम् अपर्याप्तम् ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; न्यूनातिन्यूनं { $threshold }:1 आवश्यकम्)।
    }

## `<circle>`

circle-through-points-non-numerical = यत्र बिन्दूनां साङ्ख्यिकमूल्यानि न सन्ति तत्र { $count } बिन्दुभिः गच्छत् `<circle>` अद्यापि न निर्मितम्।

circle-too-many-through-points = त्रिभ्यः अधिकैः बिन्दुभिः गच्छत् वृत्तं गणयितुं न शक्यम्।

circle-overprescribed-radius-center-points = उक्तेन त्रिज्येन, केन्द्रेण, गमनबिन्दुभिश्च सह वृत्तं गणयितुं न शक्यम्।

circle-center-with-multiple-points = उक्तेन केन्द्रेण सह एकाधिकैः बिन्दुभिः गच्छत् वृत्तं गणयितुं न शक्यम्।

circle-radius-too-small = वृत्तं गणयितुं न शक्यम्: द्वयोः बिन्द्वोः अन्तरं { $distance } इति सति उक्तः त्रिज्यः { $radius } अतिलघुः।

circle-radius-with-many-points = उक्तेन त्रिज्येन सह द्वाभ्याम् अधिकैः बिन्दुभिः गच्छत् वृत्तं रचयितुं न शक्यम्।

circle-invalid-center-or-through-points = वृत्तस्य अमान्यं केन्द्रं गमनबिन्दवो वा।

circle-radius-center-with-multiple-points = उक्तेन केन्द्रेण सह एकाधिकैः बिन्दुभिः गच्छतः वृत्तस्य त्रिज्यं गणयितुं न शक्यम्।

circle-change-radius-non-numerical = असाङ्ख्यिकैः गमनबिन्दुभिः सह वृत्तस्य त्रिज्यं परिवर्तयितुं न शक्यम्

circle-radius-with-points-non-numerical = साङ्ख्यिकमूल्यानाम् अभावे उक्तेन त्रिज्येन सह एकाधिकैः बिन्दुभिः गच्छत् वृत्तं रचयितुं न शक्यम्।

circle-change-center-non-numerical = असाङ्ख्यिकमूल्यैः बिन्दुभिः गच्छतः वृत्तस्य केन्द्रपरिवर्तनम् अद्यापि न निर्मितम्।

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] फलनस्य प्रान्तस्य कृते परिमाणानि अपर्याप्तानि। प्रान्ते { $intervals } अन्तरालः अस्ति किन्तु फलने { $inputs ->
            [one] { $inputs } निवेशः
           *[other] { $inputs } निवेशाः
        } सन्ति।
       *[other] फलनस्य प्रान्तस्य कृते परिमाणानि अपर्याप्तानि। प्रान्ते { $intervals } अन्तरालाः सन्ति किन्तु फलने { $inputs ->
            [one] { $inputs } निवेशः
           *[other] { $inputs } निवेशाः
        } सन्ति।
    }

function-domain-invalid-format = फलनस्य प्रान्तस्य अमान्यं रूपम्।

function-ignoring-non-numerical =
    { $type ->
        [maximum] फलनस्य असाङ्ख्यिकम् उच्चतमम् उपेक्ष्यते।
        [minimum] फलनस्य असाङ्ख्यिकं निम्नतमम् उपेक्ष्यते।
        [extremum] फलनस्य असाङ्ख्यिकं चरमम् उपेक्ष्यते।
        [point] फलनस्य असाङ्ख्यिकः बिन्दुः उपेक्ष्यते।
        [slope] फलनस्य असाङ्ख्यिका प्रवणता उपेक्ष्यते।
       *[other] फलनस्य असाङ्ख्यिकं { $type } उपेक्ष्यते।
    }

function-ignoring-empty =
    { $type ->
        [maximum] फलनस्य रिक्तम् उच्चतमम् उपेक्ष्यते।
        [minimum] फलनस्य रिक्तं निम्नतमम् उपेक्ष्यते।
        [extremum] फलनस्य रिक्तं चरमम् उपेक्ष्यते।
        [point] फलनस्य रिक्तः बिन्दुः उपेक्ष्यते।
       *[other] फलनस्य रिक्तं { $type } उपेक्ष्यते।
    }

function-points-too-close = फलने द्वौ बिन्दू अतिनिकटौ स्तः। फलनं निर्धारयितुं न शक्यम्।

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] फलनस्य आवर्तनानि तदैव शक्यानि यदा निवेशानां सङ्ख्या निर्गमानां सङ्ख्यया समाना भवति। अस्मिन् फलने { $inputs } निवेशः { $outputs ->
            [one] { $outputs } निर्गमः
           *[other] { $outputs } निर्गमाः
        } च सन्ति।
       *[other] फलनस्य आवर्तनानि तदैव शक्यानि यदा निवेशानां सङ्ख्या निर्गमानां सङ्ख्यया समाना भवति। अस्मिन् फलने { $inputs } निवेशाः { $outputs ->
            [one] { $outputs } निर्गमः
           *[other] { $outputs } निर्गमाः
        } च सन्ति।
    }

## `<sequence>`

sequence-invalid-length = श्रेण्याः अमान्या दीर्घता। अऋणात्मकः पूर्णाङ्कः भवेत्।

sequence-invalid-step = श्रेण्याः अमान्यं पदम्। { $type } प्रकारस्य श्रेण्याः कृते सङ्ख्या भवेत्।

sequence-invalid-endpoint-number = सङ्ख्याश्रेण्याः अमान्यं "{ $attribute }"। सङ्ख्या भवेत्।

sequence-invalid-endpoint-letters = अक्षरश्रेण्याः अमान्यं "{ $attribute }"। अक्षरसमूहः भवेत्।

sequence-invalid-endpoint = श्रेण्याः अमान्यं "{ $attribute }"।

select-from-sequence-coprime-not-numbers = सङ्ख्याः न चीयन्ते इति कारणात् coprime उपेक्ष्यते

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations उक्तम् इति कारणात् coprime उपेक्ष्यते

## Resolving a `target`

target-not-found = `<{ $source }>` इत्यस्य अमान्यं लक्ष्यम्: लक्ष्यं न प्राप्तम्।

target-state-variable-not-found = `<{ $source }>` इत्यस्य अमान्यं लक्ष्यम्: `<{ $component }>` इत्यस्मिन् "{ $property }" इति नाम्ना स्थितिचलः न प्राप्तः।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` इत्यस्य चलाः स्वतन्त्रचलात् भिन्नाः भवेयुः।

ode-system-duplicate-variable-names = पुनरुक्तैः आश्रितचलनामभिः ODE RHS फलनानि निर्धारयितुं न शक्यम्।

ode-system-rhs-function-error = ODE RHS फलनं निर्धारयितुं न शक्यम्। mathjs फलनरचनायां दोषः।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } रेखाणां मध्ये कोणं निर्धारयितुं न शक्यम्

angle-invalid-through-point = `<angle>` इत्यस्य through इत्यस्मिन् अमान्यः बिन्दुः

parabola-vertex-too-many-points = शीर्षेण सह एकाधिकैः बिन्दुभिः गच्छत् परवलयम् अद्यापि न निर्मितम्।

parabola-too-many-points = त्रिभ्यः अधिकैः बिन्दुभिः गच्छत् परवलयम् अद्यापि न निर्मितम्।

intersection-too-many-items = द्वाभ्याम् अधिकानां वस्तूनां छेदः अद्यापि न निर्मितः

## Other math components

ionic-compound-not-two-ions = द्वाभ्याम् आयनाभ्याम् अन्यत्र आयनिकं यौगिकम् अद्यापि न निर्मितम्।

ionic-compound-needs-cation-and-anion = आयनिकं यौगिकम् एकेन धनायनेन एकेन ऋणायनेन च सह एव निर्मितम्।

solve-equations-cannot-evaluate = समीकरणं गणयितुं न शक्यम् इति कारणात् तत् साधयितुं न शक्यम्: { $equation }

math-operators-operand-number-required = गणितीयं कर्म निष्कासयितुम् operandNumber अवश्यं वक्तव्यम्।

eigen-decomposition-failed = आव्यूहस्य स्वमूल्यानि गणयितुं न शक्यानि

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } इति प्राचलः प्रतिमाने न विद्यते, अतः सः सर्वदा रिक्तेन मिलिष्यति।
       *[other] `<matchesPattern>`: { $parameters } इति प्राचलाः प्रतिमाने न विद्यन्ते, अतः ते सर्वदा रिक्तेन मिलिष्यन्ति।
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" इत्येतत् बोद्धुं न शक्यम्। तत् none, medium, dense, अथवा रिक्तेन विभक्ते द्वे धनात्मके सङ्ख्ये भवेयुः, यथा grid="1 0.5"। जालकं न लिख्यते।

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure प्रदर्शके xLabelPosition="left" न समर्थितम्; right-स्थानस्य आचरणं गृह्यते।

prefigure-y-label-position-unsupported = `<graph>`: prefigure प्रदर्शके yLabelPosition="bottom" न समर्थितम्; top-स्थानस्य आचरणं गृह्यते।

prefigure-invalid-axis-bounds = `<graph>`: prefigure-परिवर्तनार्थम् अमान्याः अक्षसीमाः; पूर्वनिर्धारितं bbox (-10,-10,10,10) गृह्यते।

prefigure-invalid-width = `<graph>`: prefigure-परिवर्तनार्थम् अमान्यः विस्तारः; पूर्वनिर्धारितः रेखाचित्रविस्तारः 425 गृह्यते।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure-परिवर्तनार्थम् अमान्यम् aspectRatio; पूर्वनिर्धारितम् अनुपातं 1 गृह्यते।

prefigure-grid-spacing-too-fine = `<graph>`: अक्षसीमाणां कृते जालकान्तरम् अतिसूक्ष्मम्; prefigure प्रदर्शके जालकं त्यज्यते।

prefigure-annotations-not-rendered = `<graph>`: PreFigure प्रदर्शकं विना टिप्पण्यः न लिख्यन्ते।

multiple-annotations-children = `<graph>` इत्यस्मिन् बहूनि `<annotations>` अपत्यानि प्राप्तानि; अन्तिमं विना सर्वाणि उपेक्ष्यन्ते।

## Referring to other components

copy-unrecognized-component-type = अपरिचितः घटकप्रकारः विस्तारयितुं प्रतिलिखितुं वा न शक्यः: { $type }।

copy-prop-not-found = { $component } प्रकारस्य घटके { $property } इति गुणः न प्राप्तः

collect-no-source = collect इत्यस्य कृते कोऽपि स्रोतः न प्राप्तः।

collect-invalid-component-type = `<{ $component }>` प्रकारस्य घटकाः सङ्ग्रहीतुं न शक्याः, यतः सः अमान्यः घटकप्रकारः।

reference-index-unavailable = `{ $reference }` इति अनुक्रमः निर्देष्टुं न शक्यः

## `<callAction>`

component-action-unavailable = `{ $reference }` इति घटके { $action } इति आह्वातुं न शक्यम्

## `<dataFrame>`

data-frame-inconsistent-row-lengths = दत्तांशस्य अमान्यम् आकारम्। पङ्क्तीनां दीर्घतासु असङ्गतिः। componentIdx :{ $componentIdx } इत्यत्र प्राप्तम्

data-frame-duplicate-column-names = दत्तांशे पुनरुक्तानि स्तम्भनामानि। componentIdx :{ $componentIdx } इत्यत्र प्राप्तम्

data-frame-missing-column-name = दत्तांशे एकं स्तम्भनाम न विद्यते। componentIdx :{ $componentIdx } इत्यत्र प्राप्तम्

## `<answer>` and scoring

answer-award-depends-on-own-response = अस्य उत्तरस्य एकम् award अस्य एव answer इत्यस्य प्रेषितोत्तरे आश्रितम्, येन अनपेक्षितम् आचरणं भविष्यति।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` युक्तस्य आधारस्य अन्तः स्थिते `<answer>` इत्यस्मिन् `maxNumAttempts` निष्फलम्, यतः प्रयत्नसङ्ख्या आधारेण नियन्त्र्यते। `maxNumAttempts` आधारे स्थाप्यताम्।

nested-section-wide-check-work-max-num-attempts = अन्यस्य `sectionWideCheckWork` युक्तस्य आधारस्य अन्तः स्थिते `sectionWideCheckWork` युक्ते आधारे `maxNumAttempts` निष्फलम्, यतः प्रयत्नसङ्ख्या बाह्येन आधारेण नियन्त्र्यते। `maxNumAttempts` बाह्ये आधारे स्थाप्यताम्।

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality विना { $attributes } इति विशेषणं निष्फलं भविष्यति।
       *[other] symbolicEquality विना { $attributes } इति विशेषणानि निष्फलानि भविष्यन्ति।
    }

answer-invalid-type = उत्तरस्य अमान्यः प्रकारः: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` इति घटकस्य नाम नास्ति, अतः सः module-विशेषणरूपेण प्रयोक्तुं न शक्यः

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` इति घटकः module इत्यस्य विशेषणरूपेण प्रयोक्तुं न शक्यः, यतः `<module>` घटकप्रकारे "{ $name }" इति विशेषणं पूर्वमेव निर्धारितम्।

conditional-content-condition-ignored = case अथवा else अपत्यैः युक्ते `<conditionalContent>` घटके `condition` इति विशेषणम् उपेक्ष्यते।

slider-markers-type-mismatch = चिह्नानां प्रकारः slider इत्यस्य प्रकारेण सह न मिलति।

pretzel-problem-needs-statement-and-answer = अमान्यम् pretzel: प्रत्येकस्मिन् `<problem>` एकम् `<statement>` एकम् `<answer>` च भवेत्।

pretzel-circuit-first-problem-distractor = अमान्यम् pretzel: mode="circuit" इत्यस्मिन् प्रथमम् `<problem>` भ्रामकं न भवेत्।

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` विशेषणस्य कृते { $values } इति अमान्यं मूल्यम्; उपेक्ष्यते।
       *[other] `{ $attribute }` विशेषणस्य कृते { $values } इति अमान्यानि मूल्यानि; उपेक्ष्यन्ते।
    }

attribute-must-be-references = `{ $attribute }` विशेषणस्य कृते `{ $value }` इति अमान्यं मूल्यम्। विशेषणं `$` इत्यनेन आरब्धैः सन्दर्भैः रचितं भवेत्।

math-input-invalid-function-names = <mathInput>: { $attribute } इत्यस्मिन् अमान्यानि फलननामानि उपेक्षितानि: { $names }। प्रत्येकस्य नाम्नः दर्शनखण्डः न्यूनातिन्यूनं द्व्यक्षरः भवेत् (अक्षराणि अथवा योजकचिह्नानि); तदनन्तरं वैकल्पिकम् `|<mathspeak alternative>` इति योजयितुं शक्यते।

## Building components from the source

component-type-invalid = अमान्यः घटकप्रकारः: `<{ $componentType }>`

attribute-repeated = { $attribute } इति विशेषणं पुनः वक्तुं न शक्यम्।

attribute-invalid-for-component = `<{ $componentType }>` प्रकारस्य घटकस्य कृते "{ $attribute }" इति विशेषणम् अमान्यम्।

## Style definition contrast

style-definition-insufficient-contrast =
    शैलीनिर्धारणे { $styleNumber } { $context ->
        [text-on-background] पाठ्यवर्णस्य पृष्ठभूमिवर्णं प्रति
        [high-contrast] उच्चवैषम्यवर्णस्य पटलं प्रति
        [line] रेखावर्णस्य पटलं प्रति
        [marker] चिह्नवर्णस्य पटलं प्रति
       *[text-on-canvas] पाठ्यवर्णस्य पटलं प्रति
    } वैषम्यम् अपर्याप्तम्{ $mode ->
        [dark] { " (कृष्णपटलम्)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; न्यूनातिन्यूनं { $threshold }:1 आवश्यकम्)।

style-definition-dark-mode-text-background-contrast =
    यद्यपि शैलीनिर्धारणे { $styleNumber } उक्ताः वर्णाः शुक्लपटलस्य कृते पर्याप्तं वैषम्यं ददति, तथापि तेभ्यः व्युत्पन्नानां कृष्णपटलवर्णानां पाठ्यवर्णस्य पृष्ठभूमिवर्णं प्रति वैषम्यम् अपर्याप्तम् ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; न्यूनातिन्यूनं { $threshold }:1 आवश्यकम्)। { $suggestion ->
        [available] कृष्णपटले पर्याप्तवैषम्यार्थं वा शुक्लपटलस्य वैषम्यं वर्ध्यताम् (यथा { $lightAttribute }="{ $lightColor }"), वा कृष्णपटलवर्णः स्वयम् उच्यताम् (यथा { $darkAttribute }="{ $darkColor }")।
       *[none] कृष्णपटले पर्याप्तवैषम्यार्थं शुक्लपटलस्य वैषम्यं वर्ध्यताम्, अथवा व्युत्पन्नाः वर्णाः textColorDarkMode तथा/अथवा backgroundColorDarkMode इत्येताभ्यां स्वयम् उच्यन्ताम्।
    }

style-definition-dark-mode-text-canvas-contrast =
    यद्यपि शैलीनिर्धारणे { $styleNumber } उक्तः पाठ्यवर्णः शुक्लपटलस्य कृते पर्याप्तं वैषम्यं ददाति, तथापि तस्मात् व्युत्पन्नस्य कृष्णपटलपाठ्यवर्णस्य पटलं प्रति वैषम्यम् अपर्याप्तम् ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; न्यूनातिन्यूनं { $threshold }:1 आवश्यकम्)। { $suggestion ->
        [available] कृष्णपटले पर्याप्तवैषम्यार्थं वा शुक्लपटलस्य वैषम्यं वर्ध्यताम् (यथा textColor="{ $lightColor }"), वा कृष्णपटलवर्णः स्वयम् उच्यताम् (यथा textColorDarkMode="{ $darkColor }")।
       *[none] कृष्णपटले पर्याप्तवैषम्यार्थं शुक्लपटलस्य वैषम्यं वर्ध्यताम्, अथवा व्युत्पन्नः वर्णः textColorDarkMode इत्यनेन स्वयम् उच्यताम्।
    }

section-multiple-style-palettes = एकः अध्यायः एकम् एव <stylePalette> चेतुं शक्नोति; अन्तिमं गृह्यते।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } इत्यस्य अद्वितीयाः भेदाः न निर्णेतुं शक्याः, यतः numToSelect अऋणात्मकः पूर्णाङ्कः नास्ति।

variant-num-to-select-not-constant-number = { $component } इत्यस्य अद्वितीयाः भेदाः न निर्णेतुं शक्याः, यतः numToSelect स्थिरा सङ्ख्या नास्ति।

variant-with-replacement-not-constant-boolean = { $component } इत्यस्य अद्वितीयाः भेदाः न निर्णेतुं शक्याः, यतः withReplacement स्थिरः बूलियन् नास्ति।

variant-select-weight-disables-unique = यदि कस्यचित् विकल्पस्य selectWeight अथवा selectForVariants उक्तम्, तर्हि select इत्यस्य अद्वितीयाः भेदाः निष्क्रियाः भवन्ति

variant-coprime-undetermined = { $component } इत्यस्य अद्वितीयाः भेदाः न निर्णेतुं शक्याः, यतः coprime सर्वदा असत्यम् इति निर्णेतुं न शक्यम्।

variant-attribute-not-constant = { $component } इत्यस्य अद्वितीयाः भेदाः न निर्णेतुं शक्याः, यतः { $attribute } स्थिरं नास्ति।

variant-attribute-not-number = { $component } इत्यस्य अद्वितीयाः भेदाः न निर्णेतुं शक्याः, यतः { $attribute } सङ्ख्या नास्ति।

variant-attribute-wrong-type-for-sequence =
    { $type } प्रकारस्य { $component } इत्यस्य अद्वितीयाः भेदाः न निर्णेतुं शक्याः, यतः { $attribute } { $expected ->
        [letters-combination] अक्षरसमूहः
        [math-expression] मान्यं गणितीयव्यञ्जनम्
        [integer] पूर्णाङ्कः
       *[number] सङ्ख्या
    } नास्ति।

variant-length-not-integer = { $component } इत्यस्य अद्वितीयाः भेदाः न निर्णेतुं शक्याः, यतः length पूर्णाङ्कः नास्ति।

variant-sort-not-implemented = sort युक्तस्य { $component } इत्यस्य अद्वितीयाः भेदाः अद्यापि न निर्मिताः

variant-exclude-combinations-not-implemented = excludeCombinations युक्तस्य { $component } इत्यस्य अद्वितीयाः भेदाः अद्यापि न निर्मिताः

variant-math-exclude-not-implemented = exclude युक्तस्य math प्रकारस्य { $component } इत्यस्य अद्वितीयाः भेदाः अद्यापि न निर्मिताः

variant-non-constant-exclude-not-implemented = अस्थिरेण exclude युक्तस्य { $component } इत्यस्य अद्वितीयाः भेदाः अद्यापि न निर्मिताः

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure प्रदर्शके न समर्थितम्; अपत्यं त्यज्यते।

prefigure-descendant-invalid-geometry = { $subject }: अपरिमिता अपूर्णा वा ज्यामितिः; अपत्यं त्यज्यते।

prefigure-curve-label-omitted = { $subject }: परिवर्तितेषु वक्रघटकेषु नामाङ्कनानि न समर्थितानि; नामाङ्कनं त्यज्यते।

prefigure-curve-unsupported-definition-type = { $subject }: '{ $definitionType }' इति वक्रफलननिर्धारणप्रकारः न समर्थितः; अपत्यं त्यज्यते।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves इत्यस्मिन् flipFunctions इति विशेषणं न समर्थितम्; अपत्यं त्यज्यते।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves इत्यस्मिन् केवलं formula-प्रकारस्य अपत्यफलनानि समर्थितानि; अपत्यं त्यज्यते।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] रेखाकुलस्य नामाङ्कनस्य
       *[point] बिन्दुनामाङ्कनस्य
    } कृते '{ $labelPosition }' इति labelPosition न समर्थितम्; पूर्वनिर्धारिता PreFigure संरेखा गृह्यते।

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' इति पूरणशैली PreFigure इत्यनेन न समर्थिता; एकवर्णं पूरणं गृह्यते।

prefigure-line-style-unknown = { $subject }: '{ $lineStyle }' इति अज्ञाता रेखाशैली PreFigure-निर्गमात् त्यज्यते।

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' इति चिह्नशैली PreFigure इत्यस्य 'diamond' शैल्यां परिणमिता।

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' इति चिह्नशैली PreFigure इत्यनेन न समर्थिता; पूर्वनिर्धारिता शैली गृह्यते।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: अमान्यम् `ref`; लक्ष्यं निर्देष्टुं न शक्यम्। टिप्पणी त्यज्यते।

annotation-ref-multiple-targets = `<annotation>`: `ref` बहूनि लक्ष्याणि निर्दिशति; प्रथमं लक्ष्यं गृह्यते।

annotation-ref-outside-graph = `<annotation>`: अमान्यम् `ref`; लक्ष्यं परिवेष्टकात् graph इत्यस्मात् बहिः। टिप्पणी त्यज्यते।

annotation-ref-unsupported-target = `<annotation>`: अमान्यम् `ref`; prefigure-परिवर्तने लक्ष्यं समर्थितम् आलेखीयं वस्तु नास्ति। टिप्पणी त्यज्यते।

annotation-text-missing = `<annotation>`: `text` न विद्यते रिक्तं वा; रिक्तं पाठ्यं लिख्यते।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] चक्रीयम् आश्रयणं दृष्टम्।
       *[other] `<{ $componentType }>` घटकं सम्बद्ध्य चक्रीयम् आश्रयणं दृष्टम्।
    }

reference-no-referent = सन्दर्भस्य कोऽपि लक्ष्यः न प्राप्तः: `{ $reference }`

reference-multiple-referents = सन्दर्भस्य बहवः लक्ष्याः प्राप्ताः: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` इत्यस्य { $attribute } विशेषणस्य अमान्यं रूपम्।

children-invalid = `<{ $componentType }>` इत्यस्य अमान्यानि अपत्यानि: अमान्यानि अपत्यानि प्राप्तानि: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` विशेषणस्य कृते `{ $value }` इति अमान्यं मूल्यम्, `{ $default }` इति मूल्यं गृह्यते

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML आवृत्तिः { $version } न प्राप्ता।
       *[other] DoenetML आवृत्तिः { $version } न प्राप्ता। { $fallback } इति आवृत्तिः गृह्यते
    }

## Reading the DoenetML

parse-invalid-doenetml = अमान्यम् DoenetML: { $content }

parse-tag-missing-close-tag = अमान्यम् DoenetML: `{ $tag }` इति पिधानस्य समापकं पिधानं नास्ति। स्वयंसमापकं पिधानम् अथवा `</{ $tagName }>` इति पिधानम् अपेक्षितम्।

parse-tag-error = अमान्यम् DoenetML: `<{ $tagName }>` इति पिधाने दोषः

parse-attribute-missing-value = अमान्यम् DoenetML: `{ $attribute }` इति अमान्ये विशेषणे मूल्यं न दृश्यते।

parse-attribute-invalid = अमान्यम् DoenetML: `{ $attribute }` इति अमान्यं विशेषणम्

parse-attribute-value-invalid = अमान्यम् DoenetML: `{ $value }` इति अमान्यं विशेषणमूल्यम्

parse-attribute-value-quote-mismatch = अमान्यम् DoenetML: `{ $value }` इति अमान्यं विशेषणमूल्यम्। उद्धरणचिह्ने न मिलतः। `{ $quote }` इति न्यूनम् इति भाति

parse-open-tag-name-missing = अमान्यम् DoenetML: पिधाननाम विना पिधानं प्राप्तम्, यथा `<`

parse-tag-not-closed = अमान्यम् DoenetML: `{ $tag }` इति पिधानं न समापितम् (`>` न्यूनम् इति भाति)।

parse-self-closing-tag-name-missing = अमान्यम् DoenetML: पिधाननाम विना पिधानं प्राप्तम् `<{ $content }>`

parse-self-closing-tag-not-closed = अमान्यम् DoenetML: `{ $tag }` इति पिधानं न समापितम् (`/>` न्यूनम् इति भाति)।

parse-tag-invalid-attributes = अमान्यम् DoenetML: `{ $tag }` इति पिधानम् अमान्यम्। तस्य विशेषणानि अशुद्धानि स्युः।

parse-close-tag-name-missing = अमान्यम् DoenetML: पिधाननाम विना समापकं पिधानं प्राप्तम्, यथा `</`

parse-attribute-value-unquoted = विशेषणमूल्यानि उद्धरणचिह्नयोः मध्ये स्थापनीयानि: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = अमान्यम् DoenetML: `{ $tag }` इति समापकं पिधानं प्राप्तम्, किन्तु तदनुरूपम् आरम्भकं पिधानं नास्ति

parse-close-tag-mismatched = अमान्यम् DoenetML: समापकं पिधानं न मिलति। `</{ $expected }>` अपेक्षितम्। `{ $found }` प्राप्तम्

parser-node-unconvertible = { $node } इति ग्रन्थिः Dast-ग्रन्थिरूपेण परिवर्तयितुं न शक्ता।

## Names

name-attribute-invalid =
    अमान्यं विशेषणम् name='{ $name }'। { $reason ->
        [characters] नामसु केवलम् अक्षराणि, अङ्काः, अधोरेखाः, योजकचिह्नानि वा भवितुम् अर्हन्ति।
       *[start] नामानि अक्षरेण आरभेरन्।
    }

component-name-invalid-start = "{ $name }" इति अमान्यं घटकनाम। नामानि अक्षरेण आरभेरन्।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched प्रकारस्य उत्तरे video इति विशेषणम् आवश्यकम्

answer-video-watched-video-not-reference = videoWatched प्रकारस्य उत्तरे video इति विशेषणं सन्दर्भः भवेत्

answer-name-not-single-text = उत्तरस्य name इति विशेषणे एकम् एव पाठ्यापत्यं भवेत्

## Referencing another document

external-doenetml-recursion-limit = अतिबहूनां स्तराणाम् आवर्तनात् बाह्यं DoenetML आनेतुं न शक्यम्। किं चक्रीयः सन्दर्भः अस्ति?

external-doenetml-unavailable = { $attribute }="{ $uri }" इत्यस्मात् DoenetML आनेतुं न शक्यम्

external-doenetml-type-mismatch = { $attribute }="{ $uri }" इत्यस्मात् आनीतम् अमान्यम् DoenetML: तत् "{ $componentType }" इति घटकप्रकारेण सह न मिलति

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` इति विशेषणं परित्यक्तम्; तत्स्थाने `{ $to }` प्रयुज्यताम्।
       *[other] [deprecation] `<{ $component }>` इत्यस्मिन् `{ $from }` इति विशेषणं परित्यक्तम्; तत्स्थाने `{ $to }` प्रयुज्यताम्।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` इति विशेषणं परित्यक्तम्, `{ $to }` अपि उक्तम् इति कारणात् उपेक्ष्यते।
       *[other] [deprecation] `<{ $component }>` इत्यस्मिन् `{ $from }` इति विशेषणं परित्यक्तम्, `{ $to }` अपि उक्तम् इति कारणात् उपेक्ष्यते।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` इत्यस्मिन् `{ $attribute }` इति विशेषणं परित्यक्तम् उपेक्षितं च।

deprecated-attribute-to-child = [deprecation] `<{ $component }>` इत्यस्मिन् `{ $attribute }` इति विशेषणं परित्यक्तम्; तत्स्थाने `<{ $child }>` इति अपत्यं प्रयुज्यताम्।

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` इत्यस्मिन् `{ $attribute }` विशेषणस्य `{ $value }` इति मूल्यं परित्यक्तम्; तत्स्थाने `{ $to }` प्रयुज्यताम्।


## Language coverage

pluralize-english-only = `<pluralize>` केवलम् आङ्ग्लभाषायाः बहुवचनं रचयितुं शक्नोति, अतः { $locale } भाषायां लिखिते लेखे तस्य पाठ्यम् अपरिवर्तितं तिष्ठति। बहुवचनरूपं साक्षात् लिख्यताम्, अथवा `pluralForm` इति विशेषणेन उच्यताम्।


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` इति घटकः Doenet-घटकरूपेण न परिचितः।

schema-element-not-allowed-at-root = `<{ $tag }>` इति घटकः लेखस्य मूले न अनुज्ञातः।

schema-element-not-allowed-inside = `<{ $tag }>` इति घटकः `<{ $parent }>` इत्यस्य अन्तः न अनुज्ञातः।

schema-attribute-unrecognized = `<{ $tag }>` इति घटके `{ $attribute }` इति विशेषणं नास्ति।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` घटकस्य `{ $attribute }` इति विशेषणं तादृशी सूची भवेत् यस्याः प्रत्येकं वस्तु एतेषु एकम्: { $allowed }
       *[other] `<{ $tag }>` घटकस्य `{ $attribute }` इति विशेषणम् एतेषु एकं भवेत्: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select इत्यस्य अमान्यं भेदनाम। { $variantName } इति भेदनाम { $numOptions } विकल्पेषु दृश्यते किन्तु चेतव्यानां सङ्ख्या { $numToSelect }।

select-variant-name-without-options = select इत्यस्य कृते केचन भेदाः उक्ताः किन्तु सम्भाव्यभेदनाम्नः { $variantName } कृते न के अपि विकल्पाः उक्ताः।

select-variant-name-not-possible = select इत्यस्य कृते उक्तं { $variantName } इति भेदनाम सम्भाव्यं भेदनाम नास्ति।

select-too-few-options = केवलं { $numOptions } इत्येभ्यः { $numToSelect } घटकाः चेतुं न शक्याः।

select-from-sequence-too-few-values = { $length } दीर्घतायाः श्रेण्याः { $numToSelect } मूल्यानि चेतुं न शक्यानि।

select-from-sequence-indices-count-mismatch = select इत्यस्य कृते उक्तानाम् अनुक्रमाणां सङ्ख्या चेतव्यानां सङ्ख्यया सह मिलेत्

select-from-sequence-indices-not-integers = select इत्यस्य कृते उक्ताः सर्वे अनुक्रमाः पूर्णाङ्काः भवेयुः

select-from-sequence-index-excluded = selectfromsequence इत्यस्य उक्तः अनुक्रमः वर्जितः आसीत्

select-from-sequence-indices-excluded-combination = selectfromsequence इत्यस्य उक्ताः अनुक्रमाः वर्जितः संयोगः आसीत्

select-from-sequence-coprime-not-positive-integers = धनात्मकाः पूर्णाङ्काः न चीयन्ते इति कारणात् सहअभाज्यसंयोगाः चेतुं न शक्याः।

select-from-sequence-coprime-common-factor = सहअभाज्याः सङ्ख्याः चेतुं न शक्याः। सर्वेषु सम्भाव्यमूल्येषु एकः साधारणः गुणकः अस्ति। ("from" अथवा "to" इत्येतयोः उक्तानि मूल्यानि "step" इत्यनेन सह सहअभाज्यानि भवेयुः।)

select-from-sequence-coprime-single-number = 1 भिन्नायाः एकस्याः सङ्ख्यायाः सहअभाज्यसंयोगाः चेतुं न शक्याः।

select-from-sequence-excluded-too-many-combinations = selectFromSequence इत्यस्मिन् 70% अधिकाः संयोगाः वर्जिताः

select-from-sequence-coprime-none-found = सहअभाज्याः सङ्ख्याः चेतुं न शक्ताः। सर्वेषु सम्भाव्यमूल्येषु एकः साधारणः गुणकः अस्ति।

select-from-sequence-too-few-unique-values = { $numPossibleValues } दीर्घतायाः श्रेण्याः { $numToSelect } अद्वितीयानि मूल्यानि चेतुं न शक्यानि

select-prime-numbers-too-few-values = { $numValues } दीर्घतायाः अभाज्यसङ्ख्यासूच्याः { $numToSelect } मूल्यानि चेतुं न शक्यानि

select-prime-numbers-values-count-mismatch = select इत्यस्य कृते उक्तानां मूल्यानां सङ्ख्या चेतव्यानां सङ्ख्यया सह मिलेत्

select-prime-numbers-values-not-prime = select prime number इत्यस्य कृते उक्तानि सर्वाणि मूल्यानि अभाज्यसङ्ख्यासूच्यां भवेयुः

select-prime-numbers-values-excluded-combination = selectPrimeNumbers इत्यस्य उक्तानि मूल्यानि वर्जितः संयोगः आसीत्

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers इत्यस्मिन् 70% अधिकाः संयोगाः वर्जिताः

select-random-combination-fluke = अत्यन्तासम्भाव्येन दैवेन यादृच्छिकमूल्यानां संयोगः चेतुं न शक्तः

select-random-value-fluke = अत्यन्तासम्भाव्येन दैवेन यादृच्छिकं मूल्यं चेतुं न शक्तम्
