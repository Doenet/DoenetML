# Maithili diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] दुनू अंतबिंदु देल गेला पर { $attributes } केँ उपेक्षित कएल जाइत अछि
       *[other] दुनू अंतबिंदु देल गेला पर { $attributes } केँ उपेक्षित कएल जाइत अछि
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] अंतबिंदु आ मध्यबिंदु दुनू देल गेला पर { $attributes } केँ उपेक्षित कएल जाइत अछि
       *[other] अंतबिंदु आ मध्यबिंदु दुनू देल गेला पर { $attributes } केँ उपेक्षित कएल जाइत अछि
    }

line-segment-midpoint-offset-without-midpoint = मध्यबिंदु बिना midpointOffset क कोनो असर नहि

## `<line>`

line-points-undetermined-dimensions = अनिर्धारित विमा वला बिंदु सभ सँ होइत रेखा।

line-points-too-few-dimensions = रेखा कम सँ कम दू विमा वला बिंदु सभ सँ होएबाक चाही।

line-points-depend-on-variables = रेखा ओहि बिंदु सभ सँ होइत अछि जे चर पर निर्भर अछि: { $variables }।

line-equation-invalid-format = चर { $variable1 } आ { $variable2 } मे रेखा क समीकरण क अमान्य प्रारूप।

## `<ray>`

ray-overprescribed-through = किरण through, endpoint आ direction — तीनू सँ निर्धारित अछि। देल गेल through उपेक्षित।

ray-dimension-mismatch = किरण मे numDimensions नहि मिलैत अछि।

## `<vector>`

vector-overprescribed-head = सदिश head, tail आ displacement — तीनू सँ निर्धारित अछि। देल गेल head उपेक्षित।

vector-dimension-mismatch = सदिश मे numDimensions नहि मिलैत अछि।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` मे nearestPoint नामक स्थिति चर नहि अछि, तेँ ओकरा दिस आकर्षण नहि भऽ सकैत अछि।

constrain-to-without-nearest-point = `<{ $component }>` मे nearestPoint नामक स्थिति चर नहि अछि, तेँ ओकरा पर नियंत्रण नहि भऽ सकैत अछि।

constrain-to-interior-without-nearest-point = `<{ $component }>` मे nearestPoint नामक स्थिति चर नहि अछि, तेँ ओकर भीतर नियंत्रण नहि भऽ सकैत अछि।

## `<choiceInput>`

choice-input-label-position-ignored = गैर-इनलाइन choiceInput लेल labelPosition उपेक्षित

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput लेल देल गेल सूचकांक उपेक्षित, कारण सूचकांक क संख्या विकल्प संतति क संख्या सँ नहि मिलैत अछि।

pretzel-indices-count-mismatch = problem लेल देल गेल सूचकांक उपेक्षित, कारण सूचकांक क संख्या problem संतति क संख्या सँ नहि मिलैत अछि।

shuffle-indices-count-mismatch = shuffle लेल देल गेल सूचकांक उपेक्षित, कारण सूचकांक क संख्या घटक क संख्या सँ नहि मिलैत अछि।

indices-ignored-out-of-range = { $component } लेल देल गेल सूचकांक उपेक्षित, कारण किछु सूचकांक सीमा सँ बाहर अछि।

pretzel-indices-repeated = pretzel लेल देल गेल सूचकांक उपेक्षित, कारण किछु सूचकांक दोहराओल गेल अछि।

pretzel-circuit-first-index = circuit मोड मे pretzel लेल देल गेल सूचकांक उपेक्षित, कारण पहिल सूचकांक 1 होएबाक चाही।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` केँ स्ट्रिंग संतति संग काज करबा लेल `type` विशेषता देनाइ जरूरी अछि।

invalid-type-defaulting-to-math = { $component } घटक लेल { $type } प्रकार अमान्य अछि। math, text, number वा boolean मे सँ एक होएबाक चाही। पूर्वनिर्धारित रूप मे math लेल जाइत अछि।

string-not-valid-component-to-arrange = स्ट्रिंग "{ $value }" { $component } लेल मान्य घटक नहि अछि। उपेक्षित।

## Types and variables

invalid-type-defaulting-to-number = { $type } प्रकार अमान्य, प्रकार number कएल जाइत अछि।

invalid-variable-value = चर क अमान्य मान: `{ $value }`

## Variants

variant-index-must-be-number = भेद सूचकांक { $index } एकटा संख्या होएबाक चाही

variant-index-must-be-integer = भेद सूचकांक { $index } एकटा पूर्णांक होएबाक चाही

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` निरपेक्ष मापन लेल नहि बनल अछि। चौड़ाई सापेक्ष कएल जाइत अछि।

side-by-side-absolute-margins = `<{ $component }>` निरपेक्ष मापन लेल नहि बनल अछि। हाशिया सापेक्ष कएल जाइत अछि।

side-by-side-no-block-child = अमान्य `<{ $component }>`: एहि मे कम सँ कम एकटा ब्लॉक संतति होएबाक चाही।

## `<label>`

label-for-ignored-on-graphical = आलेखीय `<label>` पर `for` विशेषता उपेक्षित अछि।

label-for-must-resolve-to-one = `<label>` पर `for` विशेषता ठीक एकटा घटक दिस देखएबाक चाही।

label-for-unresolved = `<label>` पर `for` विशेषता कोनो घटक दिस नहि जा सकल।

label-for-answer-with-authored-inputs = `<label>` पर `for` विशेषता एहन `<answer>` केँ देखबैत अछि जकरा मे लेखक स्वयं इनपुट लिखने छथि; इनपुट केँ सीधा देखाउ।

label-for-answer-without-input = `<label>` पर `for` विशेषता एहन `<answer>` केँ देखबैत अछि जकरा मे लेबल लगएबा जोग इनपुट नहि अछि।

label-for-must-reference-input-or-answer = `<label>` पर `for` विशेषता कोनो इनपुट वा उत्तर दिस देखएबाक चाही।

## Accessibility

accessibility-short-description-or-decorative = सुगम्यता लेल `<{ $component }>` क या तँ संक्षिप्त विवरण होएबाक चाही या ओकरा decorative कहबाक चाही।

accessibility-video-short-description = सुगम्यता लेल `<video>` क संक्षिप्त विवरण होएबाक चाही।

accessibility-input-short-description-or-label = सुगम्यता लेल `<{ $component }>` क संक्षिप्त विवरण वा लेबल होएबाक चाही।

accessibility-answer-input-short-description-or-label = सुगम्यता लेल इनपुट बनबैत `<answer>` क संक्षिप्त विवरण वा लेबल होएबाक चाही।

accessibility-short-description-contains-math = संक्षिप्त विवरण मे `<{ $component }>` जकाँ गणित घटक नहि रहबाक चाही। गणित केँ शब्द मे लिखू।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] खंड शीर्षक पाठ लेल { $colorName } क विषमता अपर्याप्त अछि (डार्क मोड) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम सँ कम { $threshold }:1 चाही)।
       *[other] खंड शीर्षक पाठ लेल { $colorName } क विषमता अपर्याप्त अछि ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम सँ कम { $threshold }:1 चाही)।
    }

## `<circle>`

circle-through-points-non-numerical = जतऽ बिंदु सभ क संख्यात्मक मान नहि अछि, ओतऽ { $count } बिंदु सँ होइत `<circle>` आब तक नहि बनल अछि।

circle-too-many-through-points = तीन सँ बेसी बिंदु सँ होइत वृत्त क गणना नहि भऽ सकैत अछि।

circle-overprescribed-radius-center-points = देल गेल त्रिज्या, केंद्र आ बिंदु — तीनू संग वृत्त क गणना नहि भऽ सकैत अछि।

circle-center-with-multiple-points = देल गेल केंद्र संग एक सँ बेसी बिंदु सँ होइत वृत्त क गणना नहि भऽ सकैत अछि।

circle-radius-too-small = वृत्त क गणना नहि भऽ सकैत अछि: दुनू बिंदु क बीच क दूरी { $distance } अछि, तेँ देल गेल त्रिज्या { $radius } बहुत छोट अछि।

circle-radius-with-many-points = देल गेल त्रिज्या संग दू सँ बेसी बिंदु सँ होइत वृत्त नहि बनि सकैत अछि।

circle-invalid-center-or-through-points = वृत्त क अमान्य केंद्र वा बिंदु।

circle-radius-center-with-multiple-points = देल गेल केंद्र संग एक सँ बेसी बिंदु सँ होइत वृत्त क त्रिज्या क गणना नहि भऽ सकैत अछि।

circle-change-radius-non-numerical = गैर-संख्यात्मक बिंदु सँ होइत वृत्त क त्रिज्या नहि बदलल जा सकैत अछि

circle-radius-with-points-non-numerical = संख्यात्मक मान बिना, देल गेल त्रिज्या संग एक सँ बेसी बिंदु सँ होइत वृत्त नहि बनि सकैत अछि।

circle-change-center-non-numerical = गैर-संख्यात्मक मान वला बिंदु सँ होइत वृत्त क केंद्र बदलनाइ आब तक नहि बनल अछि।

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] फलन क प्रांत लेल विमा अपर्याप्त अछि। प्रांत मे { $intervals } अंतराल अछि मुदा फलन मे { $inputs ->
            [one] { $inputs } इनपुट
           *[other] { $inputs } इनपुट
        } अछि।
       *[other] फलन क प्रांत लेल विमा अपर्याप्त अछि। प्रांत मे { $intervals } अंतराल अछि मुदा फलन मे { $inputs ->
            [one] { $inputs } इनपुट
           *[other] { $inputs } इनपुट
        } अछि।
    }

function-domain-invalid-format = फलन क प्रांत क अमान्य प्रारूप।

function-ignoring-non-numerical =
    { $type ->
        [maximum] फलन क गैर-संख्यात्मक अधिकतम उपेक्षित।
        [minimum] फलन क गैर-संख्यात्मक न्यूनतम उपेक्षित।
        [extremum] फलन क गैर-संख्यात्मक चरम उपेक्षित।
        [point] फलन क गैर-संख्यात्मक बिंदु उपेक्षित।
        [slope] फलन क गैर-संख्यात्मक ढाल उपेक्षित।
       *[other] फलन क गैर-संख्यात्मक { $type } उपेक्षित।
    }

function-ignoring-empty =
    { $type ->
        [maximum] फलन क खाली अधिकतम उपेक्षित।
        [minimum] फलन क खाली न्यूनतम उपेक्षित।
        [extremum] फलन क खाली चरम उपेक्षित।
        [point] फलन क खाली बिंदु उपेक्षित।
       *[other] फलन क खाली { $type } उपेक्षित।
    }

function-points-too-close = फलन मे दूटा बिंदु बहुत लग-लग अछि। फलन परिभाषित नहि भऽ सकैत अछि।

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] फलन क आवृत्ति तखनहि संभव अछि जखन इनपुट क संख्या आउटपुट क संख्या बराबर होइत अछि। एहि फलन मे { $inputs } इनपुट आ { $outputs ->
            [one] { $outputs } आउटपुट
           *[other] { $outputs } आउटपुट
        } अछि।
       *[other] फलन क आवृत्ति तखनहि संभव अछि जखन इनपुट क संख्या आउटपुट क संख्या बराबर होइत अछि। एहि फलन मे { $inputs } इनपुट आ { $outputs ->
            [one] { $outputs } आउटपुट
           *[other] { $outputs } आउटपुट
        } अछि।
    }

## `<sequence>`

sequence-invalid-length = अनुक्रम क अमान्य लंबाई। एकटा गैर-ऋणात्मक पूर्णांक होएबाक चाही।

sequence-invalid-step = अनुक्रम क अमान्य पद। { $type } प्रकार क अनुक्रम लेल एकटा संख्या होएबाक चाही।

sequence-invalid-endpoint-number = संख्या अनुक्रम क अमान्य "{ $attribute }"। एकटा संख्या होएबाक चाही।

sequence-invalid-endpoint-letters = अक्षर अनुक्रम क अमान्य "{ $attribute }"। अक्षर क समूह होएबाक चाही।

sequence-invalid-endpoint = अनुक्रम क अमान्य "{ $attribute }"।

select-from-sequence-coprime-not-numbers = संख्या नहि चुनल जा रहल अछि, तेँ coprime उपेक्षित

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations देल गेल अछि, तेँ coprime उपेक्षित

## Resolving a `target`

target-not-found = `<{ $source }>` लेल अमान्य लक्ष्य: लक्ष्य नहि भेटल।

target-state-variable-not-found = `<{ $source }>` लेल अमान्य लक्ष्य: `<{ $component }>` पर "{ $property }" नामक स्थिति चर नहि भेटल।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` क चर स्वतंत्र चर सँ भिन्न होएबाक चाही।

ode-system-duplicate-variable-names = दोहराओल आश्रित चर नाम संग ODE RHS फलन परिभाषित नहि भऽ सकैत अछि।

ode-system-rhs-function-error = ODE RHS फलन परिभाषित नहि भऽ सकैत अछि। mathjs फलन बनएबा मे त्रुटि।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } रेखा क बीच कोण परिभाषित नहि भऽ सकैत अछि

angle-invalid-through-point = `<angle>` क through मे अमान्य बिंदु

parabola-vertex-too-many-points = शीर्ष संग एक सँ बेसी बिंदु सँ होइत परवलय आब तक नहि बनल अछि।

parabola-too-many-points = तीन सँ बेसी बिंदु सँ होइत परवलय आब तक नहि बनल अछि।

intersection-too-many-items = दू सँ बेसी वस्तु क प्रतिच्छेद आब तक नहि बनल अछि

## Other math components

ionic-compound-not-two-ions = दू आयन केँ छोड़ि आन कोनो लेल आयनिक यौगिक आब तक नहि बनल अछि।

ionic-compound-needs-cation-and-anion = आयनिक यौगिक खाली एकटा धनायन आ एकटा ऋणायन लेल बनल अछि।

solve-equations-cannot-evaluate = समीकरण क मान नहि निकालल जा सकल, तेँ ओकरा हल नहि कएल जा सकैत अछि: { $equation }

math-operators-operand-number-required = गणित क संकार्य निकालबा लेल operandNumber देनाइ जरूरी अछि।

eigen-decomposition-failed = आव्यूह क आइगेन-मान क गणना नहि भऽ सकल

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: प्राचल { $parameters } प्रतिरूप मे नहि अछि, तेँ ओ सदिखन खाली सँ मिलत।
       *[other] `<matchesPattern>`: प्राचल { $parameters } प्रतिरूप मे नहि अछि, तेँ ओ सदिखन खाली सँ मिलत।
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" नहि बुझल जा सकल। ई none, medium, dense, वा खाली स्थान सँ अलग दूटा धनात्मक संख्या होएबाक चाही, जेना grid="1 0.5"। कोनो जाल नहि खींचल गेल।

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure प्रदर्शक मे xLabelPosition="left" समर्थित नहि अछि; right क व्यवहार लेल जाइत अछि।

prefigure-y-label-position-unsupported = `<graph>`: prefigure प्रदर्शक मे yLabelPosition="bottom" समर्थित नहि अछि; top क व्यवहार लेल जाइत अछि।

prefigure-invalid-axis-bounds = `<graph>`: prefigure रूपांतरण लेल अमान्य अक्ष सीमा; पूर्वनिर्धारित bbox (-10,-10,10,10) लेल जाइत अछि।

prefigure-invalid-width = `<graph>`: prefigure रूपांतरण लेल अमान्य चौड़ाई; पूर्वनिर्धारित रेखाचित्र चौड़ाई 425 लेल जाइत अछि।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure रूपांतरण लेल अमान्य aspectRatio; पूर्वनिर्धारित अनुपात 1 लेल जाइत अछि।

prefigure-grid-spacing-too-fine = `<graph>`: अक्ष सीमा लेल जाल क अंतराल बहुत सूक्ष्म अछि; prefigure प्रदर्शक मे जाल छोड़ल जाइत अछि।

prefigure-annotations-not-rendered = `<graph>`: PreFigure प्रदर्शक बिना टिप्पणी नहि खींचल जाएत।

multiple-annotations-children = `<graph>` मे बहुतो `<annotations>` संतति भेटल; अंतिम केँ छोड़ि सभ उपेक्षित।

## Referring to other components

copy-unrecognized-component-type = अपरिचित घटक प्रकार केँ बढ़ाओल वा नकल नहि कएल जा सकैत अछि: { $type }।

copy-prop-not-found = { $component } प्रकार क घटक पर { $property } गुण नहि भेटल

collect-no-source = collect लेल कोनो स्रोत नहि भेटल।

collect-invalid-component-type = `<{ $component }>` प्रकार क घटक एकत्र नहि कएल जा सकैत अछि, कारण ई अमान्य घटक प्रकार अछि।

reference-index-unavailable = सूचकांक `{ $reference }` केँ नहि देखाओल जा सकैत अछि

## `<callAction>`

component-action-unavailable = घटक `{ $reference }` पर { $action } नहि चलाओल जा सकैत अछि

## `<dataFrame>`

data-frame-inconsistent-row-lengths = डेटा क आकार अमान्य अछि। पाँती सभ क लंबाई असंगत अछि। componentIdx :{ $componentIdx } मे भेटल

data-frame-duplicate-column-names = डेटा मे दोहराओल स्तंभ नाम अछि। componentIdx :{ $componentIdx } मे भेटल

data-frame-missing-column-name = डेटा मे एकटा स्तंभ नाम नहि अछि। componentIdx :{ $componentIdx } मे भेटल

## `<answer>` and scoring

answer-award-depends-on-own-response = एहि उत्तर क एकटा award एहि answer टैग क अपन पठाओल उत्तर पर आधारित अछि, जकर परिणाम अप्रत्याशित होएत।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` वला पात्र क भीतर वला `<answer>` पर `maxNumAttempts` देला सँ कोनो असर नहि होइत, कारण प्रयास क संख्या पात्र सँ नियंत्रित होइत अछि। `maxNumAttempts` पात्र पर देल जाउ।

nested-section-wide-check-work-max-num-attempts = आन `sectionWideCheckWork` वला पात्र क भीतर वला `sectionWideCheckWork` पात्र पर `maxNumAttempts` देला सँ कोनो असर नहि होइत, कारण प्रयास क संख्या बाहरी पात्र सँ नियंत्रित होइत अछि। `maxNumAttempts` बाहरी पात्र पर देल जाउ।

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality बिना { $attributes } विशेषता क कोनो असर नहि होएत।
       *[other] symbolicEquality बिना { $attributes } विशेषता सभ क कोनो असर नहि होएत।
    }

answer-invalid-type = उत्तर लेल अमान्य प्रकार: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` घटक क नाम नहि अछि, तेँ ओ module क विशेषता रूप मे प्रयोग नहि भऽ सकैत अछि

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` घटक module क विशेषता रूप मे प्रयोग नहि भऽ सकैत अछि, कारण `<module>` घटक प्रकार मे "{ $name }" विशेषता पहिने सँ परिभाषित अछि।

conditional-content-condition-ignored = case वा else संतति वला `<conditionalContent>` घटक पर `condition` विशेषता उपेक्षित अछि।

slider-markers-type-mismatch = चिन्ह क प्रकार slider क प्रकार सँ नहि मिलैत अछि।

pretzel-problem-needs-statement-and-answer = अमान्य pretzel: प्रत्येक `<problem>` मे एकटा `<statement>` आ एकटा `<answer>` होएबाक चाही।

pretzel-circuit-first-problem-distractor = अमान्य pretzel: mode="circuit" मे पहिल `<problem>` भ्रामक नहि भऽ सकैत अछि।

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] विशेषता `{ $attribute }` लेल अमान्य मान { $values }; उपेक्षित।
       *[other] विशेषता `{ $attribute }` लेल अमान्य मान { $values }; उपेक्षित।
    }

attribute-must-be-references = विशेषता `{ $attribute }` लेल `{ $value }` अमान्य मान अछि। विशेषता एहन संदर्भ सँ बनल होएबाक चाही जे `$` सँ शुरू होइत अछि।

math-input-invalid-function-names = <mathInput>: { $attribute } मे अमान्य फलन नाम उपेक्षित: { $names }। प्रत्येक नाम क प्रदर्शन खंड मे कम सँ कम दू अक्षर (अक्षर वा योजक) होएबाक चाही; ओकरा बाद वैकल्पिक `|<mathspeak alternative>` लगाओल जा सकैत अछि।

## Building components from the source

component-type-invalid = अमान्य घटक प्रकार: `<{ $componentType }>`

attribute-repeated = विशेषता { $attribute } केँ दोहराओल नहि जा सकैत अछि।

attribute-invalid-for-component = `<{ $componentType }>` प्रकार क घटक लेल "{ $attribute }" विशेषता अमान्य अछि।

## Style definition contrast

style-definition-insufficient-contrast =
    शैली परिभाषा { $styleNumber } मे { $context ->
        [text-on-background] पृष्ठभूमि रंग क सामने पाठ रंग
        [high-contrast] कैनवास क सामने उच्च-विषमता रंग
        [line] कैनवास क सामने रेखा रंग
        [marker] कैनवास क सामने चिन्ह रंग
       *[text-on-canvas] कैनवास क सामने पाठ रंग
    } लेल विषमता अपर्याप्त अछि{ $mode ->
        [dark] { " (डार्क मोड)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम सँ कम { $threshold }:1 चाही)।

style-definition-dark-mode-text-background-contrast =
    यद्यपि शैली परिभाषा { $styleNumber } मे देल गेल रंग लाइट मोड लेल पर्याप्त विषमता दैत अछि, ओहि सँ बनल डार्क मोड रंग मे पृष्ठभूमि रंग क सामने पाठ रंग क विषमता अपर्याप्त अछि ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम सँ कम { $threshold }:1 चाही)। { $suggestion ->
        [available] डार्क मोड मे पर्याप्त विषमता लेल या तँ लाइट मोड क विषमता बढ़ाउ (जेना { $lightAttribute }="{ $lightColor }"), या डार्क मोड रंग स्वयं देल जाउ (जेना { $darkAttribute }="{ $darkColor }")।
       *[none] डार्क मोड मे पर्याप्त विषमता लेल लाइट मोड क विषमता बढ़ाउ, वा बनल रंग केँ textColorDarkMode आ/वा backgroundColorDarkMode सँ स्वयं देल जाउ।
    }

style-definition-dark-mode-text-canvas-contrast =
    यद्यपि शैली परिभाषा { $styleNumber } मे देल गेल पाठ रंग लाइट मोड लेल पर्याप्त विषमता दैत अछि, ओहि सँ बनल डार्क मोड पाठ रंग क कैनवास क सामने विषमता अपर्याप्त अछि ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम सँ कम { $threshold }:1 चाही)। { $suggestion ->
        [available] डार्क मोड मे पर्याप्त विषमता लेल या तँ लाइट मोड क विषमता बढ़ाउ (जेना textColor="{ $lightColor }"), या डार्क मोड रंग स्वयं देल जाउ (जेना textColorDarkMode="{ $darkColor }")।
       *[none] डार्क मोड मे पर्याप्त विषमता लेल लाइट मोड क विषमता बढ़ाउ, वा बनल रंग केँ textColorDarkMode सँ स्वयं देल जाउ।
    }

section-multiple-style-palettes = एकटा खंड खाली एकटा <stylePalette> चुनि सकैत अछि; अंतिम वला लेल जाइत अछि।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } क अद्वितीय भेद निर्धारित नहि भऽ सकैत अछि, कारण numToSelect गैर-ऋणात्मक पूर्णांक नहि अछि।

variant-num-to-select-not-constant-number = { $component } क अद्वितीय भेद निर्धारित नहि भऽ सकैत अछि, कारण numToSelect स्थिर संख्या नहि अछि।

variant-with-replacement-not-constant-boolean = { $component } क अद्वितीय भेद निर्धारित नहि भऽ सकैत अछि, कारण withReplacement स्थिर बूलियन नहि अछि।

variant-select-weight-disables-unique = जँ कोनो विकल्प मे selectWeight वा selectForVariants देल गेल हो तँ select क अद्वितीय भेद निष्क्रिय भऽ जाइत अछि

variant-coprime-undetermined = { $component } क अद्वितीय भेद निर्धारित नहि भऽ सकैत अछि, कारण coprime सदिखन असत्य अछि — ई निर्धारित नहि भऽ सकल।

variant-attribute-not-constant = { $component } क अद्वितीय भेद निर्धारित नहि भऽ सकैत अछि, कारण { $attribute } स्थिर नहि अछि।

variant-attribute-not-number = { $component } क अद्वितीय भेद निर्धारित नहि भऽ सकैत अछि, कारण { $attribute } संख्या नहि अछि।

variant-attribute-wrong-type-for-sequence =
    { $type } प्रकार क { $component } क अद्वितीय भेद निर्धारित नहि भऽ सकैत अछि, कारण { $attribute } { $expected ->
        [letters-combination] अक्षर क समूह
        [math-expression] मान्य गणित व्यंजन
        [integer] पूर्णांक
       *[number] संख्या
    } नहि अछि।

variant-length-not-integer = { $component } क अद्वितीय भेद निर्धारित नहि भऽ सकैत अछि, कारण length पूर्णांक नहि अछि।

variant-sort-not-implemented = sort वला { $component } क अद्वितीय भेद आब तक नहि बनल अछि

variant-exclude-combinations-not-implemented = excludeCombinations वला { $component } क अद्वितीय भेद आब तक नहि बनल अछि

variant-math-exclude-not-implemented = exclude वला math प्रकार क { $component } क अद्वितीय भेद आब तक नहि बनल अछि

variant-non-constant-exclude-not-implemented = अस्थिर exclude वला { $component } क अद्वितीय भेद आब तक नहि बनल अछि

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure प्रदर्शक मे समर्थित नहि; वंशज छोड़ल गेल।

prefigure-descendant-invalid-geometry = { $subject }: अपरिमित वा अपूर्ण ज्यामिति; वंशज छोड़ल गेल।

prefigure-curve-label-omitted = { $subject }: रूपांतरित वक्र घटक पर लेबल समर्थित नहि; लेबल छोड़ल गेल।

prefigure-curve-unsupported-definition-type = { $subject }: वक्र फलन परिभाषा प्रकार '{ $definitionType }' समर्थित नहि; वंशज छोड़ल गेल।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves पर flipFunctions विशेषता समर्थित नहि; वंशज छोड़ल गेल।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves पर खाली formula प्रकार क संतति फलन समर्थित अछि; वंशज छोड़ल गेल।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] रेखा-परिवार क लेबल
       *[point] बिंदु लेबल
    } लेल labelPosition '{ $labelPosition }' समर्थित नहि; पूर्वनिर्धारित PreFigure संरेखण लेल गेल।

prefigure-fill-style-unsupported = { $subject }: भरनी शैली '{ $fillStyle }' PreFigure मे समर्थित नहि; ठोस भरनी लेल गेल।

prefigure-line-style-unknown = { $subject }: अज्ञात रेखा शैली '{ $lineStyle }' PreFigure निर्गम सँ छोड़ल गेल।

prefigure-marker-style-mapped-to-diamond = { $subject }: चिन्ह शैली '{ $markerStyle }' PreFigure क 'diamond' शैली मे बदलल गेल।

prefigure-marker-style-unsupported = { $subject }: चिन्ह शैली '{ $markerStyle }' PreFigure मे समर्थित नहि; पूर्वनिर्धारित शैली लेल गेल।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: अमान्य `ref`; लक्ष्य नहि भेटल। टिप्पणी छोड़ल गेल।

annotation-ref-multiple-targets = `<annotation>`: `ref` सँ बहुतो लक्ष्य भेटल; पहिल लक्ष्य लेल गेल।

annotation-ref-outside-graph = `<annotation>`: अमान्य `ref`; लक्ष्य ओहि graph सँ बाहर अछि। टिप्पणी छोड़ल गेल।

annotation-ref-unsupported-target = `<annotation>`: अमान्य `ref`; prefigure रूपांतरण मे लक्ष्य समर्थित आलेखीय वस्तु नहि अछि। टिप्पणी छोड़ल गेल।

annotation-text-missing = `<annotation>`: `text` नहि अछि वा खाली अछि; खाली पाठ देल गेल।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] चक्रीय निर्भरता भेटल।
       *[other] `<{ $componentType }>` घटक केँ लऽ कऽ चक्रीय निर्भरता भेटल।
    }

reference-no-referent = संदर्भ लेल कोनो लक्ष्य नहि भेटल: `{ $reference }`

reference-multiple-referents = संदर्भ लेल बहुतो लक्ष्य भेटल: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` क { $attribute } विशेषता क अमान्य प्रारूप।

children-invalid = `<{ $componentType }>` लेल अमान्य संतति: अमान्य संतति भेटल: { $children }

## Falling back to a default

attribute-value-invalid-using-default = विशेषता `{ $attribute }` लेल `{ $value }` अमान्य मान अछि, `{ $default }` मान लेल जाइत अछि

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML संस्करण { $version } नहि भेटल।
       *[other] DoenetML संस्करण { $version } नहि भेटल। संस्करण { $fallback } लेल जाइत अछि
    }

## Reading the DoenetML

parse-invalid-doenetml = अमान्य DoenetML: { $content }

parse-tag-missing-close-tag = अमान्य DoenetML: टैग `{ $tag }` क कोनो समापन टैग नहि अछि। स्वयं-समापन टैग वा `</{ $tagName }>` टैग चाही।

parse-tag-error = अमान्य DoenetML: टैग `<{ $tagName }>` मे त्रुटि

parse-attribute-missing-value = अमान्य DoenetML: अमान्य विशेषता `{ $attribute }` मे मान नहि बुझाइत अछि।

parse-attribute-invalid = अमान्य DoenetML: अमान्य विशेषता `{ $attribute }`

parse-attribute-value-invalid = अमान्य DoenetML: अमान्य विशेषता मान `{ $value }`

parse-attribute-value-quote-mismatch = अमान्य DoenetML: अमान्य विशेषता मान `{ $value }`। उद्धरण चिन्ह नहि मिलैत अछि। लगैत अछि जे `{ $quote }` छूटि गेल

parse-open-tag-name-missing = अमान्य DoenetML: टैग नाम बिना टैग भेटल, जेना `<`

parse-tag-not-closed = अमान्य DoenetML: टैग `{ $tag }` बंद नहि भेल (लगैत अछि जे `>` छूटि गेल)।

parse-self-closing-tag-name-missing = अमान्य DoenetML: टैग नाम बिना टैग भेटल `<{ $content }>`

parse-self-closing-tag-not-closed = अमान्य DoenetML: टैग `{ $tag }` बंद नहि भेल (लगैत अछि जे `/>` छूटि गेल)।

parse-tag-invalid-attributes = अमान्य DoenetML: टैग `{ $tag }` मान्य नहि अछि। एकर विशेषता गलत भऽ सकैत अछि।

parse-close-tag-name-missing = अमान्य DoenetML: टैग नाम बिना समापन टैग भेटल, जेना `</`

parse-attribute-value-unquoted = विशेषता मान उद्धरण चिन्ह मे राखल जाए: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = अमान्य DoenetML: समापन टैग `{ $tag }` भेटल, मुदा ओकर कोनो आरंभ टैग नहि अछि

parse-close-tag-mismatched = अमान्य DoenetML: समापन टैग नहि मिलैत अछि। `</{ $expected }>` चाही छल। `{ $found }` भेटल

parser-node-unconvertible = नोड { $node } केँ Dast नोड मे नहि बदलल जा सकल।

## Names

name-attribute-invalid =
    अमान्य विशेषता name='{ $name }'। { $reason ->
        [characters] नाम मे खाली अक्षर, अंक, अधोरेखा वा योजक भऽ सकैत अछि।
       *[start] नाम अक्षर सँ शुरू होएबाक चाही।
    }

component-name-invalid-start = अमान्य घटक नाम "{ $name }"। नाम अक्षर सँ शुरू होएबाक चाही।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched प्रकार वला उत्तर मे video विशेषता होएबाक चाही

answer-video-watched-video-not-reference = videoWatched प्रकार वला उत्तर क video विशेषता एकटा संदर्भ होएबाक चाही

answer-name-not-single-text = उत्तर क name विशेषता मे खाली एकटा पाठ संतति होएबाक चाही

## Referencing another document

external-doenetml-recursion-limit = बहुत बेसी स्तर क पुनरावृत्ति क कारण बाहरी DoenetML नहि आनल जा सकल। कतहु चक्रीय संदर्भ तँ नहि अछि?

external-doenetml-unavailable = { $attribute }="{ $uri }" सँ DoenetML नहि आनल जा सकल

external-doenetml-type-mismatch = { $attribute }="{ $uri }" सँ आनल गेल DoenetML अमान्य अछि: ई "{ $componentType }" घटक प्रकार सँ नहि मिलल

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` परित्यक्त अछि; एकर बदला `{ $to }` लिखू।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` परित्यक्त अछि; एकर बदला `{ $to }` लिखू।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` परित्यक्त अछि आ उपेक्षित अछि, कारण `{ $to }` सेहो देल गेल अछि।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` परित्यक्त अछि आ उपेक्षित अछि, कारण `{ $to }` सेहो देल गेल अछि।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` परित्यक्त आ उपेक्षित अछि।

deprecated-attribute-to-child = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` परित्यक्त अछि; एकर बदला `<{ $child }>` संतति लिखू।

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` क मान `{ $value }` परित्यक्त अछि; एकर बदला `{ $to }` लिखू।


## Language coverage

pluralize-english-only = `<pluralize>` खाली अंग्रेजी क बहुवचन बना सकैत अछि, तेँ { $locale } मे लिखल दस्तावेज मे ओकर पाठ जेहन क तेहन रहैत अछि। बहुवचन रूप सीधा लिखू, वा `pluralForm` विशेषता सँ देल जाउ।


## Checking against the schema

schema-element-unrecognized = घटक `<{ $tag }>` कोनो परिचित Doenet घटक नहि अछि।

schema-element-not-allowed-at-root = घटक `<{ $tag }>` दस्तावेज क मूल मे अनुमत नहि अछि।

schema-element-not-allowed-inside = घटक `<{ $tag }>` `<{ $parent }>` क भीतर अनुमत नहि अछि।

schema-attribute-unrecognized = घटक `<{ $tag }>` मे `{ $attribute }` नामक कोनो विशेषता नहि अछि।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] घटक `<{ $tag }>` क विशेषता `{ $attribute }` एहन सूची होएबाक चाही जकर प्रत्येक वस्तु एहि मे सँ एक हो: { $allowed }
       *[other] घटक `<{ $tag }>` क विशेषता `{ $attribute }` एहि मे सँ एक होएबाक चाही: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select लेल अमान्य भेद नाम। भेद नाम { $variantName } { $numOptions } विकल्प मे अबैत अछि मुदा चुनबाक संख्या { $numToSelect } अछि।

select-variant-name-without-options = select लेल किछु भेद देल गेल अछि मुदा संभावित भेद नाम { $variantName } लेल कोनो विकल्प नहि देल गेल अछि।

select-variant-name-not-possible = select लेल देल गेल भेद नाम { $variantName } संभावित भेद नाम नहि अछि।

select-too-few-options = खाली { $numOptions } मे सँ { $numToSelect } घटक नहि चुनल जा सकैत अछि।

select-from-sequence-too-few-values = { $length } लंबाई क अनुक्रम सँ { $numToSelect } मान नहि चुनल जा सकैत अछि।

select-from-sequence-indices-count-mismatch = select लेल देल गेल सूचकांक क संख्या चुनबाक संख्या सँ मिलबाक चाही

select-from-sequence-indices-not-integers = select लेल देल गेल सभ सूचकांक पूर्णांक होएबाक चाही

select-from-sequence-index-excluded = selectfromsequence क देल गेल सूचकांक बहिष्कृत छल

select-from-sequence-indices-excluded-combination = selectfromsequence क देल गेल सूचकांक एकटा बहिष्कृत संयोजन छल

select-from-sequence-coprime-not-positive-integers = धनात्मक पूर्णांक नहि चुनल जा रहल अछि, तेँ सह-अभाज्य संयोजन नहि चुनल जा सकैत अछि।

select-from-sequence-coprime-common-factor = सह-अभाज्य संख्या नहि चुनल जा सकैत अछि। सभ संभावित मान क एकटा साझा गुणनखंड अछि। ("from" वा "to" क देल गेल मान "step" संग सह-अभाज्य होएबाक चाही।)

select-from-sequence-coprime-single-number = 1 केँ छोड़ि कोनो एकल संख्या सँ सह-अभाज्य संयोजन नहि चुनल जा सकैत अछि।

select-from-sequence-excluded-too-many-combinations = selectFromSequence मे 70% सँ बेसी संयोजन बहिष्कृत भेल

select-from-sequence-coprime-none-found = सह-अभाज्य संख्या नहि चुनल जा सकल। सभ संभावित मान क एकटा साझा गुणनखंड अछि।

select-from-sequence-too-few-unique-values = { $numPossibleValues } लंबाई क अनुक्रम सँ { $numToSelect } अद्वितीय मान नहि चुनल जा सकैत अछि

select-prime-numbers-too-few-values = { $numValues } लंबाई क अभाज्य संख्या सूची सँ { $numToSelect } मान नहि चुनल जा सकैत अछि

select-prime-numbers-values-count-mismatch = select लेल देल गेल मान क संख्या चुनबाक संख्या सँ मिलबाक चाही

select-prime-numbers-values-not-prime = select prime number लेल देल गेल सभ मान अभाज्य संख्या सूची मे होएबाक चाही

select-prime-numbers-values-excluded-combination = selectPrimeNumbers क देल गेल मान एकटा बहिष्कृत संयोजन छल

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers मे 70% सँ बेसी संयोजन बहिष्कृत भेल

select-random-combination-fluke = अत्यंत असंभव संयोग सँ यादृच्छिक मान क संयोजन नहि चुनल जा सकल

select-random-value-fluke = अत्यंत असंभव संयोग सँ यादृच्छिक मान नहि चुनल जा सकल
