# Konkani diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`
# and the rest — are part of the language rather than prose, and stay in
# English exactly as written. So does the `[deprecation]` marker.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] दोनूय शेवटबिंदू दिल्ले आसतना { $attributes } दुर्लक्षित जाता
       *[other] दोनूय शेवटबिंदू दिल्ले आसतना { $attributes } दुर्लक्षित जातात
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] शेवटबिंदू आनी मध्यबिंदू दोनूय दिल्ले आसतना { $attributes } दुर्लक्षित जाता
       *[other] शेवटबिंदू आनी मध्यबिंदू दोनूय दिल्ले आसतना { $attributes } दुर्लक्षित जातात
    }

line-segment-midpoint-offset-without-midpoint = मध्यबिंदू नासतना midpointOffset चो परिणाम ना

## `<line>`

line-points-undetermined-dimensions = अनिश्चित परिमाणांच्या बिंदूंतल्यान वचपी रेघ।

line-points-too-few-dimensions = रेघ उण्यांत उणी दोन परिमाणांच्या बिंदूंतल्यान वचपाक जाय।

line-points-depend-on-variables = रेघ त्या बिंदूंतल्यान वता जे चलांचेर आदारिल्ले आसात: { $variables }।

line-equation-invalid-format = चल { $variable1 } आनी { $variable2 } हांतल्या रेघेच्या समिकरणाचें अवैध रूप।

## `<ray>`

ray-overprescribed-through = किरण through, endpoint आनी direction — तिनूय वरवीं थारायलां। दिल्लें through दुर्लक्षित।

ray-dimension-mismatch = किरणांत numDimensions जुळना।

## `<vector>`

vector-overprescribed-head = सदिश head, tail आनी displacement — तिनूय वरवीं थारायलां। दिल्लें head दुर्लक्षित।

vector-dimension-mismatch = सदिशांत numDimensions जुळना।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` हांतूं nearestPoint नांवाचो स्थिती चल ना, देखून ताचे कडेन आकर्शण जावंक शकना।

constrain-to-without-nearest-point = `<{ $component }>` हांतूं nearestPoint नांवाचो स्थिती चल ना, देखून ताचेर नियंत्रण जावंक शकना।

constrain-to-interior-without-nearest-point = `<{ $component }>` हांतूं nearestPoint नांवाचो स्थिती चल ना, देखून ताच्या भितरल्या वाठारांत नियंत्रण जावंक शकना।

## `<choiceInput>`

choice-input-label-position-ignored = इनलायन नाशिल्ल्या choiceInput खातीर labelPosition दुर्लक्षित

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput खातीर दिल्ले निर्देशांक दुर्लक्षित, कित्याक निर्देशांकांची संख्या वेंचणी-भुरग्यांच्या संख्येकडेन जुळना।

pretzel-indices-count-mismatch = problem खातीर दिल्ले निर्देशांक दुर्लक्षित, कित्याक निर्देशांकांची संख्या problem-भुरग्यांच्या संख्येकडेन जुळना।

shuffle-indices-count-mismatch = shuffle खातीर दिल्ले निर्देशांक दुर्लक्षित, कित्याक निर्देशांकांची संख्या घटकांच्या संख्येकडेन जुळना।

indices-ignored-out-of-range = { $component } खातीर दिल्ले निर्देशांक दुर्लक्षित, कित्याक कांय निर्देशांक मर्यादे भायर आसात।

pretzel-indices-repeated = pretzel खातीर दिल्ले निर्देशांक दुर्लक्षित, कित्याक कांय निर्देशांक परत परत आयल्यात।

pretzel-circuit-first-index = circuit प्रकारांत pretzel खातीर दिल्ले निर्देशांक दुर्लक्षित, कित्याक पयलो निर्देशांक 1 आसपाक जाय।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` हाका स्ट्रिंग भुरग्यां वांगडा काम करपाक `type` गुणधर्म दिवप गरजेचें।

invalid-type-defaulting-to-math = { $component } घटका खातीर { $type } प्रकार अवैध। math, text, number वा boolean हांतल्यान एक आसपाक जाय। मूळ रुपान math घेतां।

string-not-valid-component-to-arrange = स्ट्रिंग "{ $value }" { $component } खातीर वैध घटक न्हय। दुर्लक्षित।

## Types and variables

invalid-type-defaulting-to-number = { $type } प्रकार अवैध, प्रकार number थारायतां।

invalid-variable-value = चलाचें अवैध मोल: `{ $value }`

## Variants

variant-index-must-be-number = प्रकार निर्देशांक { $index } एक संख्या आसपाक जाय

variant-index-must-be-integer = प्रकार निर्देशांक { $index } एक पूर्णांक आसपाक जाय

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` निरपेक्ष मापां खातीर बांदिल्लें ना. रुंदाय सापेक्ष करतां।

side-by-side-absolute-margins = `<{ $component }>` निरपेक्ष मापां खातीर बांदिल्लें ना. देगो सापेक्ष करतां।

side-by-side-no-block-child = अवैध `<{ $component }>`: हांतूं उण्यांत उणो एक ब्लॉक भुरगो आसपाक जाय।

## `<label>`

label-for-ignored-on-graphical = आलेखी `<label>` चेर `for` गुणधर्म दुर्लक्षित जाता।

label-for-must-resolve-to-one = `<label>` चेर `for` गुणधर्म फकत एकाच घटकाक दाखोवपाक जाय।

label-for-unresolved = `<label>` चेर `for` गुणधर्म खंयच्याय घटकाक दाखोवंक ना जालो।

label-for-answer-with-authored-inputs = `<label>` चेर `for` गुणधर्म अशा `<answer>` क दाखयता जांतूं बरोवप्यान स्वता निवेश बरयल्यात; निवेशाक सरळ दाखयात।

label-for-answer-without-input = `<label>` चेर `for` गुणधर्म अशा `<answer>` क दाखयता जांतूं नामपट्टी लावपा सारको निवेश ना।

label-for-must-reference-input-or-answer = `<label>` चेर `for` गुणधर्म खंयच्याय निवेशाक वा जापेक दाखोवपाक जाय।

## Accessibility

accessibility-short-description-or-decorative = सुगमताये खातीर `<{ $component }>` हाका वा तर आवांठ वर्णन आसपाक जाय वा ताका decorative म्हणपाक जाय।

accessibility-video-short-description = सुगमताये खातीर `<video>` हाका आवांठ वर्णन आसपाक जाय।

accessibility-input-short-description-or-label = सुगमताये खातीर `<{ $component }>` हाका आवांठ वर्णन वा नामपट्टी आसपाक जाय।

accessibility-answer-input-short-description-or-label = सुगमताये खातीर निवेश तयार करपी `<answer>` हाका आवांठ वर्णन वा नामपट्टी आसपाक जाय।

accessibility-short-description-contains-math = आवांठ वर्णनांत `<{ $component }>` सारके गणित घटक आसपाक फावना। गणित उतरांनी बरयात।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] विभाग मथळ्याच्या मजकुरा खातीर { $colorName } हाचो विरोधाभास उणो ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; उण्यांत उणो { $threshold }:1 जाय) (काळो प्रकार)।
       *[other] विभाग मथळ्याच्या मजकुरा खातीर { $colorName } हाचो विरोधाभास उणो ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; उण्यांत उणो { $threshold }:1 जाय)।
    }

## `<circle>`

circle-through-points-non-numerical = जंय बिंदूंक संख्यात्मक मोलां नात, थंय { $count } बिंदूंतल्यान वचपें `<circle>` आजून बांदूंक ना।

circle-too-many-through-points = तीन परस चड बिंदूंतल्यान वचपें वर्तुळ मेजूंक शकना।

circle-overprescribed-radius-center-points = दिल्ली त्रिज्या, केंद्र आनी बिंदू — तिनूय वांगडा वर्तुळ मेजूंक शकना।

circle-center-with-multiple-points = दिल्ल्या केंद्रा वांगडा एका परस चड बिंदूंतल्यान वचपें वर्तुळ मेजूंक शकना।

circle-radius-too-small = वर्तुळ मेजूंक शकना: दोन बिंदूं मदलें अंतर { $distance } आसा, देखून दिल्ली त्रिज्या { $radius } खूब ल्हान।

circle-radius-with-many-points = दिल्ल्या त्रिज्ये वांगडा दोन परस चड बिंदूंतल्यान वचपें वर्तुळ तयार करूंक शकना।

circle-invalid-center-or-through-points = वर्तुळाचें अवैध केंद्र वा बिंदू।

circle-radius-center-with-multiple-points = दिल्ल्या केंद्रा वांगडा एका परस चड बिंदूंतल्यान वचपी वर्तुळाची त्रिज्या मेजूंक शकना।

circle-change-radius-non-numerical = संख्यात्मक नाशिल्ल्या बिंदूंतल्यान वचपी वर्तुळाची त्रिज्या बदलूंक शकना

circle-radius-with-points-non-numerical = संख्यात्मक मोलां नासतना, दिल्ल्या त्रिज्ये वांगडा एका परस चड बिंदूंतल्यान वचपें वर्तुळ तयार करूंक शकना।

circle-change-center-non-numerical = संख्यात्मक नाशिल्ल्या मोलांच्या बिंदूंतल्यान वचपी वर्तुळाचें केंद्र बदलप आजून बांदूंक ना।

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] फलनाच्या प्रांता खातीर परिमाणां उणीं। प्रांतांत { $intervals } अंतराळ आसा पूण फलनांत { $inputs ->
            [one] { $inputs } निवेश
           *[other] { $inputs } निवेश
        } आसात।
       *[other] फलनाच्या प्रांता खातीर परिमाणां उणीं। प्रांतांत { $intervals } अंतराळ आसात पूण फलनांत { $inputs ->
            [one] { $inputs } निवेश
           *[other] { $inputs } निवेश
        } आसात।
    }

function-domain-invalid-format = फलनाच्या प्रांताचें अवैध रूप।

function-ignoring-non-numerical =
    { $type ->
        [maximum] फलनाचें संख्यात्मक नाशिल्लें चडांत चड मोल दुर्लक्षित।
        [minimum] फलनाचें संख्यात्मक नाशिल्लें उण्यांत उणें मोल दुर्लक्षित।
        [extremum] फलनाचें संख्यात्मक नाशिल्लें टोकाचें मोल दुर्लक्षित।
        [point] फलनाचो संख्यात्मक नाशिल्लो बिंदू दुर्लक्षित।
        [slope] फलनाचो संख्यात्मक नाशिल्लो उतार दुर्लक्षित।
       *[other] फलनाचें संख्यात्मक नाशिल्लें { $type } दुर्लक्षित।
    }

function-ignoring-empty =
    { $type ->
        [maximum] फलनाचें रितें चडांत चड मोल दुर्लक्षित।
        [minimum] फलनाचें रितें उण्यांत उणें मोल दुर्लक्षित।
        [extremum] फलनाचें रितें टोकाचें मोल दुर्लक्षित।
        [point] फलनाचो रितो बिंदू दुर्लक्षित।
       *[other] फलनाचें रितें { $type } दुर्लक्षित।
    }

function-points-too-close = फलनांत दोन बिंदू खूब लागीं आसात। फलन थारावंक शकना।

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] फलनाचीं आवर्तनां तेदनाच शक्य जातात जेदना निवेशांची संख्या निर्गमांच्या संख्येइतली आसता। ह्या फलनांत { $inputs } निवेश आनी { $outputs ->
            [one] { $outputs } निर्गम
           *[other] { $outputs } निर्गम
        } आसात।
       *[other] फलनाचीं आवर्तनां तेदनाच शक्य जातात जेदना निवेशांची संख्या निर्गमांच्या संख्येइतली आसता। ह्या फलनांत { $inputs } निवेश आनी { $outputs ->
            [one] { $outputs } निर्गम
           *[other] { $outputs } निर्गम
        } आसात।
    }

## `<sequence>`

sequence-invalid-length = श्रेणीची अवैध लांबाय। एक ऋण नाशिल्लो पूर्णांक आसपाक जाय।

sequence-invalid-step = श्रेणीचें अवैध पावल। { $type } प्रकाराच्या श्रेणी खातीर एक संख्या आसपाक जाय।

sequence-invalid-endpoint-number = संख्या श्रेणीचें अवैध "{ $attribute }"। एक संख्या आसपाक जाय।

sequence-invalid-endpoint-letters = अक्षर श्रेणीचें अवैध "{ $attribute }"। अक्षरांचो एकठांय आसपाक जाय।

sequence-invalid-endpoint = श्रेणीचें अवैध "{ $attribute }"।

select-from-sequence-coprime-not-numbers = संख्या वेंचिनात देखून coprime दुर्लक्षित

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations दिल्लें देखून coprime दुर्लक्षित

## Resolving a `target`

target-not-found = `<{ $source }>` खातीर अवैध लक्ष्य: लक्ष्य मेळूंक ना।

target-state-variable-not-found = `<{ $source }>` खातीर अवैध लक्ष्य: `<{ $component }>` चेर "{ $property }" नांवाचो स्थिती चल मेळूंक ना।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` हाचे चल स्वतंत्र चला परस वेगळे आसपाक जाय।

ode-system-duplicate-variable-names = परत परत आयिल्ल्या आदारित चल नांवां वांगडा ODE RHS फलनां थारावंक शकना।

ode-system-rhs-function-error = ODE RHS फलन थारावंक शकना। mathjs फलन तयार करपांत चूक।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } रेघां मदलो कोन थारावंक शकना

angle-invalid-through-point = `<angle>` हाच्या through हांतूं अवैध बिंदू

parabola-vertex-too-many-points = शिखरा वांगडा एका परस चड बिंदूंतल्यान वचपें परवलय आजून बांदूंक ना।

parabola-too-many-points = तीन परस चड बिंदूंतल्यान वचपें परवलय आजून बांदूंक ना।

intersection-too-many-items = दोन परस चड वस्तूंचो छेद आजून बांदूंक ना

## Other math components

ionic-compound-not-two-ions = दोन आयनां बगर हेर कशाय खातीर आयनीक संयुग आजून बांदूंक ना।

ionic-compound-needs-cation-and-anion = आयनीक संयुग फकत एक धनायन आनी एक ऋणायन खातीर बांदलां।

solve-equations-cannot-evaluate = समिकरणाचें मोल काडूंक ना जालें देखून तें सोडोवंक शकना: { $equation }

math-operators-operand-number-required = गणिती संकार्य काडपाक operandNumber दिवप गरजेचें।

eigen-decomposition-failed = आव्यूहाचीं आयगेन मोलां मेजूंक ना जालीं

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: प्राचल { $parameters } प्रतिरुपांत ना, देखून तो सदांच रित्या कडेन जुळटलो।
       *[other] `<matchesPattern>`: प्राचल { $parameters } प्रतिरुपांत नात, देखून ते सदांच रित्या कडेन जुळटले।
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" समजूंक ना जालें। तें none, medium, dense, वा रित्या सुवातेन वेगळायल्ल्यो दोन धनात्मक संख्या आसपाक जाय, देखीक grid="1 0.5"। जाळी काडूंक ना।

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure प्रदर्शकांत xLabelPosition="left" आदारित ना; right वागणूक घेतां।

prefigure-y-label-position-unsupported = `<graph>`: prefigure प्रदर्शकांत yLabelPosition="bottom" आदारित ना; top वागणूक घेतां।

prefigure-invalid-axis-bounds = `<graph>`: prefigure रुपांतरा खातीर अवैध अक्ष मर्यादा; मूळ bbox (-10,-10,10,10) घेतां।

prefigure-invalid-width = `<graph>`: prefigure रुपांतरा खातीर अवैध रुंदाय; मूळ आकृती रुंदाय 425 घेतां।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure रुपांतरा खातीर अवैध aspectRatio; मूळ प्रमाण 1 घेतां।

prefigure-grid-spacing-too-fine = `<graph>`: अक्ष मर्यादां खातीर जाळीचें अंतर खूब बारीक; prefigure प्रदर्शकांत जाळी सोडटां।

prefigure-annotations-not-rendered = `<graph>`: PreFigure प्रदर्शक वापरिनासतना टिपण्यो काडचे नात।

multiple-annotations-children = `<graph>` हांतूं जायते `<annotations>` भुरगे मेळ्ळे; निमाणो सोडून सगळे दुर्लक्षित।

## Referring to other components

copy-unrecognized-component-type = वळखूंक ना जाल्लो घटक प्रकार वाडोवंक वा नकल करूंक शकना: { $type }।

copy-prop-not-found = { $component } प्रकाराच्या घटकाचेर { $property } गुणधर्म मेळूंक ना

collect-no-source = collect खातीर खंयचोच स्रोत मेळूंक ना।

collect-invalid-component-type = `<{ $component }>` प्रकाराचे घटक एकठांय करूंक शकना, कित्याक तो अवैध घटक प्रकार।

reference-index-unavailable = निर्देशांक `{ $reference }` दाखोवंक शकना

## `<callAction>`

component-action-unavailable = घटक `{ $reference }` चेर { $action } चलोवंक शकना

## `<dataFrame>`

data-frame-inconsistent-row-lengths = डेटाचो आकार अवैध. ओळींच्यो लांबायो जुळनात. componentIdx :{ $componentIdx } हांगा मेळ्ळें

data-frame-duplicate-column-names = डेटांत परत परत आयिल्लीं स्तंभ नांवां. componentIdx :{ $componentIdx } हांगा मेळ्ळें

data-frame-missing-column-name = डेटांत एक स्तंभ नांव ना. componentIdx :{ $componentIdx } हांगा मेळ्ळें

## `<answer>` and scoring

answer-award-depends-on-own-response = ह्या जापेचें एक award ह्याच answer टॅगाच्या स्वताच्या धाडिल्ल्या जापेचेर आदारिल्लें आसा, ज्या वरवीं अनपेक्षित वागणूक जातली।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` आशिल्ल्या आदाराभितरल्या `<answer>` चेर `maxNumAttempts` दिवपाचो परिणाम ना, कित्याक यत्नांची संख्या आदार नियंत्रीत करता। `maxNumAttempts` आदाराचेर दियात।

nested-section-wide-check-work-max-num-attempts = हेर `sectionWideCheckWork` आशिल्ल्या आदाराभितरल्या `sectionWideCheckWork` आदाराचेर `maxNumAttempts` दिवपाचो परिणाम ना, कित्याक यत्नांची संख्या भायलो आदार नियंत्रीत करता। `maxNumAttempts` भायल्या आदाराचेर दियात।

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality नासतना { $attributes } गुणधर्माचो परिणाम जावचो ना।
       *[other] symbolicEquality नासतना { $attributes } गुणधर्मांचो परिणाम जावचो ना।
    }

answer-invalid-type = जापे खातीर अवैध प्रकार: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` घटकाक नांव ना, देखून तो module गुणधर्म म्हूण वापरूंक शकना

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` घटक module हाचो गुणधर्म म्हूण वापरूंक शकना, कित्याक `<module>` घटक प्रकारांत "{ $name }" गुणधर्म आदींच थारायला।

conditional-content-condition-ignored = case वा else भुरगे आशिल्ल्या `<conditionalContent>` घटकाचेर `condition` गुणधर्म दुर्लक्षित जाता।

slider-markers-type-mismatch = खुणांचो प्रकार slider हाच्या प्रकाराकडेन जुळना।

pretzel-problem-needs-statement-and-answer = अवैध pretzel: दर एका `<problem>` हांतूं एक `<statement>` आनी एक `<answer>` आसपाक जाय।

pretzel-circuit-first-problem-distractor = अवैध pretzel: mode="circuit" हांतूं पयलें `<problem>` भ्रामक आसूंक शकना।

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` गुणधर्मा खातीर अवैध मोल { $values }; दुर्लक्षित।
       *[other] `{ $attribute }` गुणधर्मा खातीर अवैध मोलां { $values }; दुर्लक्षित।
    }

attribute-must-be-references = `{ $attribute }` गुणधर्मा खातीर `{ $value }` अवैध मोल। गुणधर्म `$` न सुरू जावपी संदर्भांनी तयार जावपाक जाय।

math-input-invalid-function-names = <mathInput>: { $attribute } हांतले अवैध फलन नांव दुर्लक्षित: { $names }। दर एका नांवाच्या दर्शन वांट्यांत उण्यांत उणीं दोन अक्षरां (अक्षरां वा जोडचिन्न) आसपाक जाय; उपरांत ऐच्छीक `|<mathspeak alternative>` घालूंक येता।

## Building components from the source

component-type-invalid = अवैध घटक प्रकार: `<{ $componentType }>`

attribute-repeated = { $attribute } गुणधर्म परत सांगूंक शकना।

attribute-invalid-for-component = `<{ $componentType }>` प्रकाराच्या घटका खातीर "{ $attribute }" गुणधर्म अवैध।

## Style definition contrast

style-definition-insufficient-contrast =
    शैली व्याख्या { $styleNumber } हांतूं { $context ->
        [text-on-background] फांटभूंय रंगा मुखार मजकूर रंगाचो
        [high-contrast] कॅनवासा मुखार उच्च-विरोधाभास रंगाचो
        [line] कॅनवासा मुखार रेघ रंगाचो
        [marker] कॅनवासा मुखार खूण रंगाचो
       *[text-on-canvas] कॅनवासा मुखार मजकूर रंगाचो
    } विरोधाभास उणो{ $mode ->
        [dark] { " (काळो प्रकार)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; उण्यांत उणो { $threshold }:1 जाय)।

style-definition-dark-mode-text-background-contrast =
    शैली व्याख्या { $styleNumber } हांतले दिल्ले रंग उजवाडाच्या प्रकारा खातीर पावपुरतो विरोधाभास दितात तरी, तांचे वयल्यान तयार जाल्ल्या काळ्या प्रकाराच्या रंगांनी फांटभूंय रंगा मुखार मजकूर रंगाचो विरोधाभास उणो ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; उण्यांत उणो { $threshold }:1 जाय)। { $suggestion ->
        [available] काळ्या प्रकारांत पावपुरत्या विरोधाभासा खातीर वा तर उजवाडाच्या प्रकाराचो विरोधाभास वाडयात (देखीक { $lightAttribute }="{ $lightColor }"), वा काळ्या प्रकाराचो रंग स्वता दियात (देखीक { $darkAttribute }="{ $darkColor }")।
       *[none] काळ्या प्रकारांत पावपुरत्या विरोधाभासा खातीर उजवाडाच्या प्रकाराचो विरोधाभास वाडयात, वा तयार जाल्ले रंग textColorDarkMode आनी/वा backgroundColorDarkMode वरवीं स्वता दियात।
    }

style-definition-dark-mode-text-canvas-contrast =
    शैली व्याख्या { $styleNumber } हांतलो दिल्लो मजकूर रंग उजवाडाच्या प्रकारा खातीर पावपुरतो विरोधाभास दिता तरी, ताचे वयल्यान तयार जाल्ल्या काळ्या प्रकाराच्या मजकूर रंगाचो कॅनवासा मुखार विरोधाभास उणो ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; उण्यांत उणो { $threshold }:1 जाय)। { $suggestion ->
        [available] काळ्या प्रकारांत पावपुरत्या विरोधाभासा खातीर वा तर उजवाडाच्या प्रकाराचो विरोधाभास वाडयात (देखीक textColor="{ $lightColor }"), वा काळ्या प्रकाराचो रंग स्वता दियात (देखीक textColorDarkMode="{ $darkColor }")।
       *[none] काळ्या प्रकारांत पावपुरत्या विरोधाभासा खातीर उजवाडाच्या प्रकाराचो विरोधाभास वाडयात, वा तयार जाल्लो रंग textColorDarkMode वरवीं स्वता दियात।
    }

section-multiple-style-palettes = एक विभाग फकत एक <stylePalette> वेंचूंक शकता; निमाणो घेतां।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } हाचे अद्वितीय प्रकार थारावंक शकना, कित्याक numToSelect ऋण नाशिल्लो पूर्णांक न्हय।

variant-num-to-select-not-constant-number = { $component } हाचे अद्वितीय प्रकार थारावंक शकना, कित्याक numToSelect स्थीर संख्या न्हय।

variant-with-replacement-not-constant-boolean = { $component } हाचे अद्वितीय प्रकार थारावंक शकना, कित्याक withReplacement स्थीर बूलियन न्हय।

variant-select-weight-disables-unique = खंयच्याय विकल्पाक selectWeight वा selectForVariants दिल्लें आसल्यार select हाचे अद्वितीय प्रकार बंद जातात

variant-coprime-undetermined = { $component } हाचे अद्वितीय प्रकार थारावंक शकना, कित्याक coprime सदांच फट आसा हें थारावंक शकना।

variant-attribute-not-constant = { $component } हाचे अद्वितीय प्रकार थारावंक शकना, कित्याक { $attribute } स्थीर ना।

variant-attribute-not-number = { $component } हाचे अद्वितीय प्रकार थारावंक शकना, कित्याक { $attribute } संख्या न्हय।

variant-attribute-wrong-type-for-sequence =
    { $type } प्रकाराच्या { $component } हाचे अद्वितीय प्रकार थारावंक शकना, कित्याक { $attribute } { $expected ->
        [letters-combination] अक्षरांचो एकठांय
        [math-expression] वैध गणिती अभिव्यक्ती
        [integer] पूर्णांक
       *[number] संख्या
    } न्हय।

variant-length-not-integer = { $component } हाचे अद्वितीय प्रकार थारावंक शकना, कित्याक length पूर्णांक न्हय।

variant-sort-not-implemented = sort आशिल्ल्या { $component } हाचे अद्वितीय प्रकार आजून बांदूंक ना

variant-exclude-combinations-not-implemented = excludeCombinations आशिल्ल्या { $component } हाचे अद्वितीय प्रकार आजून बांदूंक ना

variant-math-exclude-not-implemented = exclude आशिल्ल्या math प्रकाराच्या { $component } हाचे अद्वितीय प्रकार आजून बांदूंक ना

variant-non-constant-exclude-not-implemented = अस्थीर exclude आशिल्ल्या { $component } हाचे अद्वितीय प्रकार आजून बांदूंक ना

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure प्रदर्शकांत आदारित ना; वंशज सोडलो।

prefigure-descendant-invalid-geometry = { $subject }: अमर्याद वा अपुरी भूमिती; वंशज सोडलो।

prefigure-curve-label-omitted = { $subject }: रुपांतरीत वक्र घटकांचेर नामपट्ट्यो आदारित नात; नामपट्टी सोडली।

prefigure-curve-unsupported-definition-type = { $subject }: वक्र फलन व्याख्या प्रकार '{ $definitionType }' आदारित ना; वंशज सोडलो।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves चेर flipFunctions गुणधर्म आदारित ना; वंशज सोडलो।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves चेर फकत formula प्रकाराचीं भुरगीं फलनां आदारित आसात; वंशज सोडलो।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] रेघ-कुळाची नामपट्टी
       *[point] बिंदू नामपट्टी
    } हाका labelPosition '{ $labelPosition }' आदारित ना; मूळ PreFigure संरेखण घेतलें।

prefigure-fill-style-unsupported = { $subject }: भरण शैली '{ $fillStyle }' PreFigure हांतूं आदारित ना; घट्ट भरण घेतलें।

prefigure-line-style-unknown = { $subject }: अज्ञात रेघ शैली '{ $lineStyle }' PreFigure निर्गमांतल्यान सोडली।

prefigure-marker-style-mapped-to-diamond = { $subject }: खूण शैली '{ $markerStyle }' PreFigure हाच्या 'diamond' शैलींत बदलली।

prefigure-marker-style-unsupported = { $subject }: खूण शैली '{ $markerStyle }' PreFigure हांतूं आदारित ना; मूळ शैली घेतली।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: अवैध `ref`; लक्ष्य मेळूंक ना। टिपणी सोडली।

annotation-ref-multiple-targets = `<annotation>`: `ref` न जायते लक्ष्य मेळ्ळे; पयलें लक्ष्य घेतलें।

annotation-ref-outside-graph = `<annotation>`: अवैध `ref`; लक्ष्य त्या graph भायर आसा। टिपणी सोडली।

annotation-ref-unsupported-target = `<annotation>`: अवैध `ref`; prefigure रुपांतरांत लक्ष्य आदारित आलेखी वस्तू न्हय। टिपणी सोडली।

annotation-text-missing = `<annotation>`: `text` ना वा रितें; रितो मजकूर दिलो।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] चक्री परस्परावलंबन मेळ्ळें।
       *[other] `<{ $componentType }>` घटका वांगडा चक्री परस्परावलंबन मेळ्ळें।
    }

reference-no-referent = संदर्भाक खंयचेंच लक्ष्य मेळूंक ना: `{ $reference }`

reference-multiple-referents = संदर्भाक जायते लक्ष्य मेळ्ळे: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` हाच्या { $attribute } गुणधर्माचें अवैध रूप।

children-invalid = `<{ $componentType }>` खातीर अवैध भुरगे: अवैध भुरगे मेळ्ळे: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` गुणधर्मा खातीर `{ $value }` अवैध मोल, `{ $default }` मोल घेतां

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML आवृत्ती { $version } मेळूंक ना।
       *[other] DoenetML आवृत्ती { $version } मेळूंक ना। आवृत्ती { $fallback } घेतां
    }

## Reading the DoenetML

parse-invalid-doenetml = अवैध DoenetML: { $content }

parse-tag-missing-close-tag = अवैध DoenetML: टॅग `{ $tag }` हाका बंद करपी टॅग ना। स्वता-बंद जावपी टॅग वा `</{ $tagName }>` टॅग जाय।

parse-tag-error = अवैध DoenetML: टॅग `<{ $tagName }>` हांतूं चूक

parse-attribute-missing-value = अवैध DoenetML: अवैध गुणधर्म `{ $attribute }` हाका मोल नाशिल्ल्या भशेन दिसता।

parse-attribute-invalid = अवैध DoenetML: अवैध गुणधर्म `{ $attribute }`

parse-attribute-value-invalid = अवैध DoenetML: अवैध गुणधर्म मोल `{ $value }`

parse-attribute-value-quote-mismatch = अवैध DoenetML: अवैध गुणधर्म मोल `{ $value }`। अवतरण चिन्नां जुळनात। `{ $quote }` उणें आशिल्ल्या भशेन दिसता

parse-open-tag-name-missing = अवैध DoenetML: टॅग नांव नासतना टॅग मेळ्ळो, देखीक `<`

parse-tag-not-closed = अवैध DoenetML: टॅग `{ $tag }` बंद जावंक ना (`>` उणें आशिल्ल्या भशेन दिसता)।

parse-self-closing-tag-name-missing = अवैध DoenetML: टॅग नांव नासतना टॅग मेळ्ळो `<{ $content }>`

parse-self-closing-tag-not-closed = अवैध DoenetML: टॅग `{ $tag }` बंद जावंक ना (`/>` उणें आशिल्ल्या भशेन दिसता)।

parse-tag-invalid-attributes = अवैध DoenetML: टॅग `{ $tag }` वैध ना। ताचे गुणधर्म चुकीचे आसूं येतात।

parse-close-tag-name-missing = अवैध DoenetML: टॅग नांव नासतना बंद करपी टॅग मेळ्ळो, देखीक `</`

parse-attribute-value-unquoted = गुणधर्म मोलां अवतरण चिन्नांनी दवरपाक जाय: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = अवैध DoenetML: बंद करपी टॅग `{ $tag }` मेळ्ळो, पूण ताका जुळपी उगडपी टॅग ना

parse-close-tag-mismatched = अवैध DoenetML: बंद करपी टॅग जुळना। `</{ $expected }>` जाय आशिल्लो। `{ $found }` मेळ्ळो

parser-node-unconvertible = नोड { $node } Dast नोडांत बदलूंक ना जालो।

## Names

name-attribute-invalid =
    अवैध गुणधर्म name='{ $name }'। { $reason ->
        [characters] नांवांनी फकत अक्षरां, आंकडे, अधोरेखा वा जोडचिन्नां आसूं येतात।
       *[start] नांवां अक्षरान सुरू जावपाक जाय।
    }

component-name-invalid-start = अवैध घटक नांव "{ $name }"। नांवां अक्षरान सुरू जावपाक जाय।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched प्रकाराच्या जापेक video गुणधर्म आसपाक जाय

answer-video-watched-video-not-reference = videoWatched प्रकाराच्या जापेचो video गुणधर्म एक संदर्भ आसपाक जाय

answer-name-not-single-text = जापेच्या name गुणधर्माक फकत एक मजकूर भुरगो आसपाक जाय

## Referencing another document

external-doenetml-recursion-limit = खूब चड पातळ्यांच्या पुनरावृत्ते वरवीं भायलें DoenetML हाडूंक ना जालें। खंय चक्री संदर्भ तर ना?

external-doenetml-unavailable = { $attribute }="{ $uri }" हांतल्यान DoenetML हाडूंक ना जालें

external-doenetml-type-mismatch = { $attribute }="{ $uri }" हांतल्यान हाडिल्लें DoenetML अवैध: तें "{ $componentType }" घटक प्रकाराकडेन जुळूंक ना

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] गुणधर्म `{ $from }` सोडून दिला; ताचे सुवातेर `{ $to }` वापरात।
       *[other] [deprecation] `<{ $component }>` चेर गुणधर्म `{ $from }` सोडून दिला; ताचे सुवातेर `{ $to }` वापरात।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] गुणधर्म `{ $from }` सोडून दिला आनी दुर्लक्षित, कित्याक `{ $to }` लेगीत दिलां।
       *[other] [deprecation] `<{ $component }>` चेर गुणधर्म `{ $from }` सोडून दिला आनी दुर्लक्षित, कित्याक `{ $to }` लेगीत दिलां।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` चेर गुणधर्म `{ $attribute }` सोडून दिला आनी दुर्लक्षित।

deprecated-attribute-to-child = [deprecation] `<{ $component }>` चेर गुणधर्म `{ $attribute }` सोडून दिला; ताचे सुवातेर `<{ $child }>` भुरगो वापरात।

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` चेर गुणधर्म `{ $attribute }` हाचें मोल `{ $value }` सोडून दिलां; ताचे सुवातेर `{ $to }` वापरात।


## Language coverage

pluralize-english-only = `<pluralize>` फकत इंग्लिशाचें अनेकवचन करूंक शकता, देखून { $locale } हातूंत बरयल्ल्या दस्तावेजांत ताचो मजकूर तसोच उरता। अनेकवचन रूप सरळ बरयात, वा `pluralForm` गुणधर्मान दियात।


## Checking against the schema

schema-element-unrecognized = घटक `<{ $tag }>` वळखीचो Doenet घटक न्हय।

schema-element-not-allowed-at-root = घटक `<{ $tag }>` दस्तावेजाच्या मुळांत परवानगी ना।

schema-element-not-allowed-inside = घटक `<{ $tag }>` `<{ $parent }>` भितर परवानगी ना।

schema-attribute-unrecognized = घटक `<{ $tag }>` हाका `{ $attribute }` नांवाचो गुणधर्म ना।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] घटक `<{ $tag }>` हाचो `{ $attribute }` गुणधर्म अशी वळेरी आसपाक जाय जंयची दर एक वस्त हांतल्यान एक आसा: { $allowed }
       *[other] घटक `<{ $tag }>` हाचो `{ $attribute }` गुणधर्म हांतल्यान एक आसपाक जाय: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select खातीर अवैध प्रकार नांव। प्रकार नांव { $variantName } { $numOptions } विकल्पांनी येता पूण वेंचपाची संख्या { $numToSelect }।

select-variant-name-without-options = select खातीर कांय प्रकार दिल्यात पूण संभाव्य प्रकार नांव { $variantName } खातीर खंयचेच विकल्प दिवंक ना।

select-variant-name-not-possible = select खातीर दिल्लें प्रकार नांव { $variantName } संभाव्य प्रकार नांव न्हय।

select-too-few-options = फकत { $numOptions } हांतल्यान { $numToSelect } घटक वेंचूंक शकना।

select-from-sequence-too-few-values = { $length } लांबायेच्या श्रेणींतल्यान { $numToSelect } मोलां वेंचूंक शकना।

select-from-sequence-indices-count-mismatch = select खातीर दिल्ल्या निर्देशांकांची संख्या वेंचपाच्या संख्येकडेन जुळपाक जाय

select-from-sequence-indices-not-integers = select खातीर दिल्ले सगळे निर्देशांक पूर्णांक आसपाक जाय

select-from-sequence-index-excluded = selectfromsequence हाचो दिल्लो निर्देशांक वगळिल्लो आशिल्लो

select-from-sequence-indices-excluded-combination = selectfromsequence हाचे दिल्ले निर्देशांक वगळिल्लो एकठांय आशिल्लो

select-from-sequence-coprime-not-positive-integers = धनात्मक पूर्णांक वेंचिनात देखून सहअविभाज्य एकठांय वेंचूंक शकना।

select-from-sequence-coprime-common-factor = सहअविभाज्य संख्या वेंचूंक शकना। सगळ्या संभाव्य मोलांक एक सामायीक गुणक आसा। ("from" वा "to" हांचीं दिल्लीं मोलां "step" कडेन सहअविभाज्य आसपाक जाय।)

select-from-sequence-coprime-single-number = 1 सोडून एका एकसुऱ्या संख्येंतल्यान सहअविभाज्य एकठांय वेंचूंक शकना।

select-from-sequence-excluded-too-many-combinations = selectFromSequence हांतूं 70% परस चड एकठांय वगळ्ळे

select-from-sequence-coprime-none-found = सहअविभाज्य संख्या वेंचूंक ना जाल्यो। सगळ्या संभाव्य मोलांक एक सामायीक गुणक आसा।

select-from-sequence-too-few-unique-values = { $numPossibleValues } लांबायेच्या श्रेणींतल्यान { $numToSelect } अद्वितीय मोलां वेंचूंक शकना

select-prime-numbers-too-few-values = { $numValues } लांबायेच्या अविभाज्य संख्यांच्या वळेरींतल्यान { $numToSelect } मोलां वेंचूंक शकना

select-prime-numbers-values-count-mismatch = select खातीर दिल्ल्या मोलांची संख्या वेंचपाच्या संख्येकडेन जुळपाक जाय

select-prime-numbers-values-not-prime = select prime number खातीर दिल्लीं सगळीं मोलां अविभाज्य संख्यांच्या वळेरींत आसपाक जाय

select-prime-numbers-values-excluded-combination = selectPrimeNumbers हाचीं दिल्लीं मोलां वगळिल्लो एकठांय आशिल्लो

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers हांतूं 70% परस चड एकठांय वगळ्ळे

select-random-combination-fluke = खूबूच असंभव योगायोगान यादृच्छीक मोलांचो एकठांय वेंचूंक ना जालो

select-random-value-fluke = खूबूच असंभव योगायोगान यादृच्छीक मोल वेंचूंक ना जालें
