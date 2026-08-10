# Bhojpuri diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] दुनो अंतबिंदु देवला पर { $attributes } के उपेक्षा कइल जाला
       *[other] दुनो अंतबिंदु देवला पर { $attributes } के उपेक्षा कइल जाला
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] अंतबिंदु आ मध्यबिंदु दुनो देवला पर { $attributes } के उपेक्षा कइल जाला
       *[other] अंतबिंदु आ मध्यबिंदु दुनो देवला पर { $attributes } के उपेक्षा कइल जाला
    }

line-segment-midpoint-offset-without-midpoint = मध्यबिंदु के बिना midpointOffset के कवनो असर ना

## `<line>`

line-points-undetermined-dimensions = अनिश्चित विमा वाला बिंदु से गुजरे वाली रेखा।

line-points-too-few-dimensions = रेखा कम से कम दू विमा वाला बिंदु से गुजरे के चाहीं।

line-points-depend-on-variables = रेखा ओह बिंदु से गुजरेले जे चर पर निर्भर बाड़े: { $variables }।

line-equation-invalid-format = चर { $variable1 } आ { $variable2 } में रेखा के समीकरण के अमान्य प्रारूप।

## `<ray>`

ray-overprescribed-through = किरण through, endpoint आ direction — तीनो से तय बा। देहल गइल through के उपेक्षा।

ray-dimension-mismatch = किरण में numDimensions ना मिले।

## `<vector>`

vector-overprescribed-head = सदिश head, tail आ displacement — तीनो से तय बा। देहल गइल head के उपेक्षा।

vector-dimension-mismatch = सदिश में numDimensions ना मिले।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` में nearestPoint नाम के स्थिति चर नइखे, एहसे ओकरा ओर आकर्षण ना हो सके।

constrain-to-without-nearest-point = `<{ $component }>` में nearestPoint नाम के स्थिति चर नइखे, एहसे ओकरा पर नियंत्रण ना हो सके।

constrain-to-interior-without-nearest-point = `<{ $component }>` में nearestPoint नाम के स्थिति चर नइखे, एहसे ओकरा भीतर नियंत्रण ना हो सके।

## `<choiceInput>`

choice-input-label-position-ignored = गैर-इनलाइन choiceInput खातिर labelPosition के उपेक्षा

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput खातिर देहल गइल सूचकांक के उपेक्षा, काहेकि सूचकांक के संख्या विकल्प संतति के संख्या से ना मिले।

pretzel-indices-count-mismatch = problem खातिर देहल गइल सूचकांक के उपेक्षा, काहेकि सूचकांक के संख्या problem संतति के संख्या से ना मिले।

shuffle-indices-count-mismatch = shuffle खातिर देहल गइल सूचकांक के उपेक्षा, काहेकि सूचकांक के संख्या घटक के संख्या से ना मिले।

indices-ignored-out-of-range = { $component } खातिर देहल गइल सूचकांक के उपेक्षा, काहेकि कुछ सूचकांक सीमा से बाहर बाड़े।

pretzel-indices-repeated = pretzel खातिर देहल गइल सूचकांक के उपेक्षा, काहेकि कुछ सूचकांक दोहरा गइल बाड़े।

pretzel-circuit-first-index = circuit मोड में pretzel खातिर देहल गइल सूचकांक के उपेक्षा, काहेकि पहिला सूचकांक 1 होखे के चाहीं।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` के स्ट्रिंग संतति के साथे चले खातिर `type` विशेषता देवल जरूरी बा।

invalid-type-defaulting-to-math = { $component } घटक खातिर { $type } प्रकार अमान्य बा। math, text, number भा boolean में से एगो होखे के चाहीं। पूर्वनिर्धारित रूप में math लेहल जाला।

string-not-valid-component-to-arrange = स्ट्रिंग "{ $value }" { $component } खातिर मान्य घटक नइखे। उपेक्षा कइल जाला।

## Types and variables

invalid-type-defaulting-to-number = { $type } प्रकार अमान्य बा, प्रकार number कइल जाला।

invalid-variable-value = चर के अमान्य मान: `{ $value }`

## Variants

variant-index-must-be-number = भेद सूचकांक { $index } एगो संख्या होखे के चाहीं

variant-index-must-be-integer = भेद सूचकांक { $index } एगो पूर्णांक होखे के चाहीं

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` निरपेक्ष माप खातिर ना बनल बा। चौड़ाई सापेक्ष कइल जाला।

side-by-side-absolute-margins = `<{ $component }>` निरपेक्ष माप खातिर ना बनल बा। हाशिया सापेक्ष कइल जाला।

side-by-side-no-block-child = अमान्य `<{ $component }>`: एह में कम से कम एगो ब्लॉक संतति होखे के चाहीं।

## `<label>`

label-for-ignored-on-graphical = आलेखीय `<label>` पर `for` विशेषता के उपेक्षा कइल जाला।

label-for-must-resolve-to-one = `<label>` पर `for` विशेषता ठीक एगो घटक के ओर देखावे के चाहीं।

label-for-unresolved = `<label>` पर `for` विशेषता कवनो घटक के ओर ना जा सकल।

label-for-answer-with-authored-inputs = `<label>` पर `for` विशेषता अइसन `<answer>` के देखावेले जवना में लेखक खुद इनपुट लिखले बाड़े; इनपुट के सीधे देखाईं।

label-for-answer-without-input = `<label>` पर `for` विशेषता अइसन `<answer>` के देखावेले जवना में लेबल लगावे लायक इनपुट नइखे।

label-for-must-reference-input-or-answer = `<label>` पर `for` विशेषता कवनो इनपुट भा जवाब के ओर देखावे के चाहीं।

## Accessibility

accessibility-short-description-or-decorative = सुगम्यता खातिर `<{ $component }>` के या त संक्षिप्त विवरण होखे के चाहीं या ओकरा के decorative कहे के चाहीं।

accessibility-video-short-description = सुगम्यता खातिर `<video>` के संक्षिप्त विवरण होखे के चाहीं।

accessibility-input-short-description-or-label = सुगम्यता खातिर `<{ $component }>` के संक्षिप्त विवरण भा लेबल होखे के चाहीं।

accessibility-answer-input-short-description-or-label = सुगम्यता खातिर इनपुट बनावे वाला `<answer>` के संक्षिप्त विवरण भा लेबल होखे के चाहीं।

accessibility-short-description-contains-math = संक्षिप्त विवरण में `<{ $component }>` जइसन गणित के घटक ना होखे के चाहीं। गणित के शब्द में लिखीं।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] खंड के शीर्षक पाठ खातिर { $colorName } के विषमता कम बा (डार्क मोड) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाहीं)।
       *[other] खंड के शीर्षक पाठ खातिर { $colorName } के विषमता कम बा ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाहीं)।
    }

## `<circle>`

circle-through-points-non-numerical = जहाँ बिंदु के संख्यात्मक मान नइखे, ओहिजा { $count } बिंदु से गुजरे वाला `<circle>` अबले ना बनल बा।

circle-too-many-through-points = तीन से ढेर बिंदु से गुजरे वाला वृत्त के गणना ना हो सके।

circle-overprescribed-radius-center-points = देहल गइल त्रिज्या, केंद्र आ बिंदु — तीनो के साथे वृत्त के गणना ना हो सके।

circle-center-with-multiple-points = देहल गइल केंद्र के साथे एक से ढेर बिंदु से गुजरे वाला वृत्त के गणना ना हो सके।

circle-radius-too-small = वृत्त के गणना ना हो सके: दुनो बिंदु के बीच के दूरी { $distance } बा, एहसे देहल गइल त्रिज्या { $radius } बहुत छोट बा।

circle-radius-with-many-points = देहल गइल त्रिज्या के साथे दू से ढेर बिंदु से गुजरे वाला वृत्त ना बन सके।

circle-invalid-center-or-through-points = वृत्त के अमान्य केंद्र भा बिंदु।

circle-radius-center-with-multiple-points = देहल गइल केंद्र के साथे एक से ढेर बिंदु से गुजरे वाला वृत्त के त्रिज्या के गणना ना हो सके।

circle-change-radius-non-numerical = गैर-संख्यात्मक बिंदु से गुजरे वाला वृत्त के त्रिज्या ना बदलल जा सके

circle-radius-with-points-non-numerical = संख्यात्मक मान के बिना, देहल गइल त्रिज्या के साथे एक से ढेर बिंदु से गुजरे वाला वृत्त ना बन सके।

circle-change-center-non-numerical = गैर-संख्यात्मक मान वाला बिंदु से गुजरे वाला वृत्त के केंद्र बदलल अबले ना बनल बा।

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] फलन के प्रांत खातिर विमा कम बाड़े। प्रांत में { $intervals } अंतराल बा बाकिर फलन में { $inputs ->
            [one] { $inputs } इनपुट
           *[other] { $inputs } इनपुट
        } बा।
       *[other] फलन के प्रांत खातिर विमा कम बाड़े। प्रांत में { $intervals } अंतराल बाड़े बाकिर फलन में { $inputs ->
            [one] { $inputs } इनपुट
           *[other] { $inputs } इनपुट
        } बा।
    }

function-domain-invalid-format = फलन के प्रांत के अमान्य प्रारूप।

function-ignoring-non-numerical =
    { $type ->
        [maximum] फलन के गैर-संख्यात्मक अधिकतम के उपेक्षा।
        [minimum] फलन के गैर-संख्यात्मक न्यूनतम के उपेक्षा।
        [extremum] फलन के गैर-संख्यात्मक चरम के उपेक्षा।
        [point] फलन के गैर-संख्यात्मक बिंदु के उपेक्षा।
        [slope] फलन के गैर-संख्यात्मक ढाल के उपेक्षा।
       *[other] फलन के गैर-संख्यात्मक { $type } के उपेक्षा।
    }

function-ignoring-empty =
    { $type ->
        [maximum] फलन के खाली अधिकतम के उपेक्षा।
        [minimum] फलन के खाली न्यूनतम के उपेक्षा।
        [extremum] फलन के खाली चरम के उपेक्षा।
        [point] फलन के खाली बिंदु के उपेक्षा।
       *[other] फलन के खाली { $type } के उपेक्षा।
    }

function-points-too-close = फलन में दू गो बिंदु बहुत नजदीक बाड़े। फलन तय ना हो सके।

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] फलन के आवृत्ति तबे संभव बा जब इनपुट के संख्या आउटपुट के संख्या के बराबर होखे। एह फलन में { $inputs } इनपुट आ { $outputs ->
            [one] { $outputs } आउटपुट
           *[other] { $outputs } आउटपुट
        } बा।
       *[other] फलन के आवृत्ति तबे संभव बा जब इनपुट के संख्या आउटपुट के संख्या के बराबर होखे। एह फलन में { $inputs } इनपुट आ { $outputs ->
            [one] { $outputs } आउटपुट
           *[other] { $outputs } आउटपुट
        } बा।
    }

## `<sequence>`

sequence-invalid-length = अनुक्रम के अमान्य लंबाई। एगो गैर-ऋणात्मक पूर्णांक होखे के चाहीं।

sequence-invalid-step = अनुक्रम के अमान्य पद। { $type } प्रकार के अनुक्रम खातिर एगो संख्या होखे के चाहीं।

sequence-invalid-endpoint-number = संख्या अनुक्रम के अमान्य "{ $attribute }"। एगो संख्या होखे के चाहीं।

sequence-invalid-endpoint-letters = अक्षर अनुक्रम के अमान्य "{ $attribute }"। अक्षर के समूह होखे के चाहीं।

sequence-invalid-endpoint = अनुक्रम के अमान्य "{ $attribute }"।

select-from-sequence-coprime-not-numbers = संख्या ना चुनल जात बा, एहसे coprime के उपेक्षा

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations देहल गइल बा, एहसे coprime के उपेक्षा

## Resolving a `target`

target-not-found = `<{ $source }>` खातिर अमान्य लक्ष्य: लक्ष्य ना मिलल।

target-state-variable-not-found = `<{ $source }>` खातिर अमान्य लक्ष्य: `<{ $component }>` पर "{ $property }" नाम के स्थिति चर ना मिलल।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` के चर स्वतंत्र चर से अलग होखे के चाहीं।

ode-system-duplicate-variable-names = दोहरावल आश्रित चर नाम के साथे ODE RHS फलन तय ना हो सके।

ode-system-rhs-function-error = ODE RHS फलन तय ना हो सके। mathjs फलन बनावे में गलती।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } रेखा के बीच कोण तय ना हो सके

angle-invalid-through-point = `<angle>` के through में अमान्य बिंदु

parabola-vertex-too-many-points = शीर्ष के साथे एक से ढेर बिंदु से गुजरे वाला परवलय अबले ना बनल बा।

parabola-too-many-points = तीन से ढेर बिंदु से गुजरे वाला परवलय अबले ना बनल बा।

intersection-too-many-items = दू से ढेर वस्तु के प्रतिच्छेद अबले ना बनल बा

## Other math components

ionic-compound-not-two-ions = दू आयन के छोड़ि के दोसरा खातिर आयनिक यौगिक अबले ना बनल बा।

ionic-compound-needs-cation-and-anion = आयनिक यौगिक खाली एगो धनायन आ एगो ऋणायन खातिर बनल बा।

solve-equations-cannot-evaluate = समीकरण के मान ना निकलल, एहसे ओकरा के हल ना कइल जा सके: { $equation }

math-operators-operand-number-required = गणित के संकार्य निकाले खातिर operandNumber देवल जरूरी बा।

eigen-decomposition-failed = आव्यूह के आइगेन-मान के गणना ना हो सकल

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: प्राचल { $parameters } प्रतिरूप में नइखे, एहसे ऊ हमेशा खाली से मिली।
       *[other] `<matchesPattern>`: प्राचल { $parameters } प्रतिरूप में नइखन, एहसे ऊ हमेशा खाली से मिलिहें।
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ना समझल जा सकल। ई none, medium, dense, भा खाली जगह से अलगावल दू गो धनात्मक संख्या होखे के चाहीं, जइसे grid="1 0.5"। कवनो जाल ना खींचल गइल।

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure प्रदर्शक में xLabelPosition="left" समर्थित नइखे; right के व्यवहार लेहल जाला।

prefigure-y-label-position-unsupported = `<graph>`: prefigure प्रदर्शक में yLabelPosition="bottom" समर्थित नइखे; top के व्यवहार लेहल जाला।

prefigure-invalid-axis-bounds = `<graph>`: prefigure रूपांतरण खातिर अमान्य अक्ष सीमा; पूर्वनिर्धारित bbox (-10,-10,10,10) लेहल जाला।

prefigure-invalid-width = `<graph>`: prefigure रूपांतरण खातिर अमान्य चौड़ाई; पूर्वनिर्धारित रेखाचित्र चौड़ाई 425 लेहल जाला।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure रूपांतरण खातिर अमान्य aspectRatio; पूर्वनिर्धारित अनुपात 1 लेहल जाला।

prefigure-grid-spacing-too-fine = `<graph>`: अक्ष सीमा खातिर जाल के अंतर बहुत बारीक बा; prefigure प्रदर्शक में जाल छोड़ दिहल जाला।

prefigure-annotations-not-rendered = `<graph>`: PreFigure प्रदर्शक के बिना टिप्पणी ना खींचल जाई।

multiple-annotations-children = `<graph>` में कई गो `<annotations>` संतति मिलल; आखिरी के छोड़ि के सब के उपेक्षा।

## Referring to other components

copy-unrecognized-component-type = अपरिचित घटक प्रकार के बढ़ावल भा नकल ना कइल जा सके: { $type }।

copy-prop-not-found = { $component } प्रकार के घटक पर { $property } गुण ना मिलल

collect-no-source = collect खातिर कवनो स्रोत ना मिलल।

collect-invalid-component-type = `<{ $component }>` प्रकार के घटक जुटावल ना जा सके, काहेकि ई अमान्य घटक प्रकार बा।

reference-index-unavailable = सूचकांक `{ $reference }` के ना देखावल जा सके

## `<callAction>`

component-action-unavailable = घटक `{ $reference }` पर { $action } ना चलावल जा सके

## `<dataFrame>`

data-frame-inconsistent-row-lengths = डेटा के आकार अमान्य बा। पाँती के लंबाई असंगत बा। componentIdx :{ $componentIdx } में मिलल

data-frame-duplicate-column-names = डेटा में दोहरावल स्तंभ नाम बाड़े। componentIdx :{ $componentIdx } में मिलल

data-frame-missing-column-name = डेटा में एगो स्तंभ नाम नइखे। componentIdx :{ $componentIdx } में मिलल

## `<answer>` and scoring

answer-award-depends-on-own-response = एह जवाब के एगो award एही answer टैग के अपना भेजल जवाब पर आधारित बा, जवना से अनपेक्षित बरताव होई।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` वाला पात्र के भीतर वाला `<answer>` पर `maxNumAttempts` देवला के कवनो असर ना होखे, काहेकि कोशिश के संख्या पात्र से तय होले। `maxNumAttempts` पात्र पर देईं।

nested-section-wide-check-work-max-num-attempts = दोसरा `sectionWideCheckWork` वाला पात्र के भीतर वाला `sectionWideCheckWork` पात्र पर `maxNumAttempts` देवला के कवनो असर ना होखे, काहेकि कोशिश के संख्या बाहरी पात्र से तय होले। `maxNumAttempts` बाहरी पात्र पर देईं।

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality के बिना { $attributes } विशेषता के कवनो असर ना होई।
       *[other] symbolicEquality के बिना { $attributes } विशेषता सभ के कवनो असर ना होई।
    }

answer-invalid-type = जवाब खातिर अमान्य प्रकार: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` घटक के नाम नइखे, एहसे ऊ module के विशेषता के रूप में इस्तेमाल ना हो सके

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` घटक module के विशेषता के रूप में इस्तेमाल ना हो सके, काहेकि `<module>` घटक प्रकार में "{ $name }" विशेषता पहिलहीं से तय बा।

conditional-content-condition-ignored = case भा else संतति वाला `<conditionalContent>` घटक पर `condition` विशेषता के उपेक्षा कइल जाला।

slider-markers-type-mismatch = चिन्ह के प्रकार slider के प्रकार से ना मिले।

pretzel-problem-needs-statement-and-answer = अमान्य pretzel: हर `<problem>` में एगो `<statement>` आ एगो `<answer>` होखे के चाहीं।

pretzel-circuit-first-problem-distractor = अमान्य pretzel: mode="circuit" में पहिला `<problem>` भ्रामक ना हो सके।

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] विशेषता `{ $attribute }` खातिर अमान्य मान { $values }; उपेक्षा कइल जाला।
       *[other] विशेषता `{ $attribute }` खातिर अमान्य मान { $values }; उपेक्षा कइल जाला।
    }

attribute-must-be-references = विशेषता `{ $attribute }` खातिर `{ $value }` अमान्य मान बा। विशेषता अइसन संदर्भ से बनल होखे के चाहीं जे `$` से शुरू होखे।

math-input-invalid-function-names = <mathInput>: { $attribute } में अमान्य फलन नाम के उपेक्षा: { $names }। हर नाम के प्रदर्शन खंड में कम से कम दू अक्षर (अक्षर भा योजक) होखे के चाहीं; ओकरा बाद वैकल्पिक `|<mathspeak alternative>` लगावल जा सकेला।

## Building components from the source

component-type-invalid = अमान्य घटक प्रकार: `<{ $componentType }>`

attribute-repeated = विशेषता { $attribute } के दोहरावल ना जा सके।

attribute-invalid-for-component = `<{ $componentType }>` प्रकार के घटक खातिर "{ $attribute }" विशेषता अमान्य बा।

## Style definition contrast

style-definition-insufficient-contrast =
    शैली परिभाषा { $styleNumber } में { $context ->
        [text-on-background] पृष्ठभूमि रंग के सामने पाठ रंग
        [high-contrast] कैनवास के सामने उच्च-विषमता रंग
        [line] कैनवास के सामने रेखा रंग
        [marker] कैनवास के सामने चिन्ह रंग
       *[text-on-canvas] कैनवास के सामने पाठ रंग
    } खातिर विषमता कम बा{ $mode ->
        [dark] { " (डार्क मोड)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाहीं)।

style-definition-dark-mode-text-background-contrast =
    भले शैली परिभाषा { $styleNumber } में देहल गइल रंग लाइट मोड खातिर पर्याप्त विषमता देला, ओकरा से बनल डार्क मोड रंग में पृष्ठभूमि रंग के सामने पाठ रंग के विषमता कम बा ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाहीं)। { $suggestion ->
        [available] डार्क मोड में पर्याप्त विषमता खातिर या त लाइट मोड के विषमता बढ़ाईं (जइसे { $lightAttribute }="{ $lightColor }"), या डार्क मोड के रंग खुद देईं (जइसे { $darkAttribute }="{ $darkColor }")।
       *[none] डार्क मोड में पर्याप्त विषमता खातिर लाइट मोड के विषमता बढ़ाईं, भा बनल रंग के textColorDarkMode आ/भा backgroundColorDarkMode से खुद देईं।
    }

style-definition-dark-mode-text-canvas-contrast =
    भले शैली परिभाषा { $styleNumber } में देहल गइल पाठ रंग लाइट मोड खातिर पर्याप्त विषमता देला, ओकरा से बनल डार्क मोड पाठ रंग के कैनवास के सामने विषमता कम बा ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाहीं)। { $suggestion ->
        [available] डार्क मोड में पर्याप्त विषमता खातिर या त लाइट मोड के विषमता बढ़ाईं (जइसे textColor="{ $lightColor }"), या डार्क मोड के रंग खुद देईं (जइसे textColorDarkMode="{ $darkColor }")।
       *[none] डार्क मोड में पर्याप्त विषमता खातिर लाइट मोड के विषमता बढ़ाईं, भा बनल रंग के textColorDarkMode से खुद देईं।
    }

section-multiple-style-palettes = एगो खंड खाली एगो <stylePalette> चुन सकेला; आखिरी वाला लेहल जाला।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } के अद्वितीय भेद तय ना हो सके, काहेकि numToSelect गैर-ऋणात्मक पूर्णांक नइखे।

variant-num-to-select-not-constant-number = { $component } के अद्वितीय भेद तय ना हो सके, काहेकि numToSelect स्थिर संख्या नइखे।

variant-with-replacement-not-constant-boolean = { $component } के अद्वितीय भेद तय ना हो सके, काहेकि withReplacement स्थिर बूलियन नइखे।

variant-select-weight-disables-unique = अगर कवनो विकल्प में selectWeight भा selectForVariants देहल होखे त select के अद्वितीय भेद बंद हो जाला

variant-coprime-undetermined = { $component } के अद्वितीय भेद तय ना हो सके, काहेकि coprime हमेशा गलत बा — ई तय ना हो सकल।

variant-attribute-not-constant = { $component } के अद्वितीय भेद तय ना हो सके, काहेकि { $attribute } स्थिर नइखे।

variant-attribute-not-number = { $component } के अद्वितीय भेद तय ना हो सके, काहेकि { $attribute } संख्या नइखे।

variant-attribute-wrong-type-for-sequence =
    { $type } प्रकार के { $component } के अद्वितीय भेद तय ना हो सके, काहेकि { $attribute } { $expected ->
        [letters-combination] अक्षर के समूह
        [math-expression] मान्य गणित व्यंजन
        [integer] पूर्णांक
       *[number] संख्या
    } नइखे।

variant-length-not-integer = { $component } के अद्वितीय भेद तय ना हो सके, काहेकि length पूर्णांक नइखे।

variant-sort-not-implemented = sort वाला { $component } के अद्वितीय भेद अबले ना बनल बा

variant-exclude-combinations-not-implemented = excludeCombinations वाला { $component } के अद्वितीय भेद अबले ना बनल बा

variant-math-exclude-not-implemented = exclude वाला math प्रकार के { $component } के अद्वितीय भेद अबले ना बनल बा

variant-non-constant-exclude-not-implemented = अस्थिर exclude वाला { $component } के अद्वितीय भेद अबले ना बनल बा

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure प्रदर्शक में समर्थित नइखे; वंशज छोड़ल गइल।

prefigure-descendant-invalid-geometry = { $subject }: अपरिमित भा अधूरी ज्यामिति; वंशज छोड़ल गइल।

prefigure-curve-label-omitted = { $subject }: रूपांतरित वक्र घटक पर लेबल समर्थित नइखे; लेबल छोड़ल गइल।

prefigure-curve-unsupported-definition-type = { $subject }: वक्र फलन परिभाषा प्रकार '{ $definitionType }' समर्थित नइखे; वंशज छोड़ल गइल।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves पर flipFunctions विशेषता समर्थित नइखे; वंशज छोड़ल गइल।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves पर खाली formula प्रकार के संतति फलन समर्थित बाड़े; वंशज छोड़ल गइल।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] रेखा-परिवार के लेबल
       *[point] बिंदु लेबल
    } खातिर labelPosition '{ $labelPosition }' समर्थित नइखे; पूर्वनिर्धारित PreFigure संरेखण लेहल गइल।

prefigure-fill-style-unsupported = { $subject }: भराई शैली '{ $fillStyle }' PreFigure में समर्थित नइखे; ठोस भराई लेहल गइल।

prefigure-line-style-unknown = { $subject }: अनजान रेखा शैली '{ $lineStyle }' PreFigure निर्गम से छोड़ल गइल।

prefigure-marker-style-mapped-to-diamond = { $subject }: चिन्ह शैली '{ $markerStyle }' PreFigure के 'diamond' शैली में बदलल गइल।

prefigure-marker-style-unsupported = { $subject }: चिन्ह शैली '{ $markerStyle }' PreFigure में समर्थित नइखे; पूर्वनिर्धारित शैली लेहल गइल।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: अमान्य `ref`; लक्ष्य ना मिलल। टिप्पणी छोड़ल गइल।

annotation-ref-multiple-targets = `<annotation>`: `ref` से कई गो लक्ष्य मिलल; पहिला लक्ष्य लेहल गइल।

annotation-ref-outside-graph = `<annotation>`: अमान्य `ref`; लक्ष्य ओह graph से बाहर बा। टिप्पणी छोड़ल गइल।

annotation-ref-unsupported-target = `<annotation>`: अमान्य `ref`; prefigure रूपांतरण में लक्ष्य समर्थित आलेखीय वस्तु नइखे। टिप्पणी छोड़ल गइल।

annotation-text-missing = `<annotation>`: `text` नइखे भा खाली बा; खाली पाठ देहल गइल।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] चक्रीय निर्भरता मिलल।
       *[other] `<{ $componentType }>` घटक के लेके चक्रीय निर्भरता मिलल।
    }

reference-no-referent = संदर्भ खातिर कवनो लक्ष्य ना मिलल: `{ $reference }`

reference-multiple-referents = संदर्भ खातिर कई गो लक्ष्य मिलल: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` के { $attribute } विशेषता के अमान्य प्रारूप।

children-invalid = `<{ $componentType }>` खातिर अमान्य संतति: अमान्य संतति मिलल: { $children }

## Falling back to a default

attribute-value-invalid-using-default = विशेषता `{ $attribute }` खातिर `{ $value }` अमान्य मान बा, `{ $default }` मान लेहल जाला

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML संस्करण { $version } ना मिलल।
       *[other] DoenetML संस्करण { $version } ना मिलल। संस्करण { $fallback } लेहल जाला
    }

## Reading the DoenetML

parse-invalid-doenetml = अमान्य DoenetML: { $content }

parse-tag-missing-close-tag = अमान्य DoenetML: टैग `{ $tag }` के कवनो समापन टैग नइखे। स्वयं-समापन टैग भा `</{ $tagName }>` टैग चाहीं।

parse-tag-error = अमान्य DoenetML: टैग `<{ $tagName }>` में गलती

parse-attribute-missing-value = अमान्य DoenetML: अमान्य विशेषता `{ $attribute }` में मान ना लउके।

parse-attribute-invalid = अमान्य DoenetML: अमान्य विशेषता `{ $attribute }`

parse-attribute-value-invalid = अमान्य DoenetML: अमान्य विशेषता मान `{ $value }`

parse-attribute-value-quote-mismatch = अमान्य DoenetML: अमान्य विशेषता मान `{ $value }`। उद्धरण चिन्ह ना मिले। लागत बा कि `{ $quote }` छूट गइल

parse-open-tag-name-missing = अमान्य DoenetML: टैग नाम के बिना टैग मिलल, जइसे `<`

parse-tag-not-closed = अमान्य DoenetML: टैग `{ $tag }` बंद ना भइल (लागत बा कि `>` छूट गइल)।

parse-self-closing-tag-name-missing = अमान्य DoenetML: टैग नाम के बिना टैग मिलल `<{ $content }>`

parse-self-closing-tag-not-closed = अमान्य DoenetML: टैग `{ $tag }` बंद ना भइल (लागत बा कि `/>` छूट गइल)।

parse-tag-invalid-attributes = अमान्य DoenetML: टैग `{ $tag }` मान्य नइखे। एकर विशेषता गलत हो सकेले।

parse-close-tag-name-missing = अमान्य DoenetML: टैग नाम के बिना समापन टैग मिलल, जइसे `</`

parse-attribute-value-unquoted = विशेषता के मान उद्धरण चिन्ह में राखल जाव: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = अमान्य DoenetML: समापन टैग `{ $tag }` मिलल, बाकिर ओकर कवनो आरंभ टैग नइखे

parse-close-tag-mismatched = अमान्य DoenetML: समापन टैग ना मिले। `</{ $expected }>` चाहीं रहे। `{ $found }` मिलल

parser-node-unconvertible = नोड { $node } के Dast नोड में ना बदलल जा सकल।

## Names

name-attribute-invalid =
    अमान्य विशेषता name='{ $name }'। { $reason ->
        [characters] नाम में खाली अक्षर, अंक, अधोरेखा भा योजक हो सकेला।
       *[start] नाम अक्षर से शुरू होखे के चाहीं।
    }

component-name-invalid-start = अमान्य घटक नाम "{ $name }"। नाम अक्षर से शुरू होखे के चाहीं।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched प्रकार वाला जवाब में video विशेषता होखे के चाहीं

answer-video-watched-video-not-reference = videoWatched प्रकार वाला जवाब के video विशेषता एगो संदर्भ होखे के चाहीं

answer-name-not-single-text = जवाब के name विशेषता में खाली एगो पाठ संतति होखे के चाहीं

## Referencing another document

external-doenetml-recursion-limit = बहुत ढेर स्तर के पुनरावृत्ति के चलते बाहरी DoenetML ना आ सकल। कहीं चक्रीय संदर्भ त नइखे?

external-doenetml-unavailable = { $attribute }="{ $uri }" से DoenetML ना आ सकल

external-doenetml-type-mismatch = { $attribute }="{ $uri }" से आइल DoenetML अमान्य बा: ई "{ $componentType }" घटक प्रकार से ना मिलल

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` अब चलन में नइखे; एकरा बदले `{ $to }` लिखीं।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` अब चलन में नइखे; एकरा बदले `{ $to }` लिखीं।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` अब चलन में नइखे आ ओकर उपेक्षा कइल जाला, काहेकि `{ $to }` भी देहल बा।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` अब चलन में नइखे आ ओकर उपेक्षा कइल जाला, काहेकि `{ $to }` भी देहल बा।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` अब चलन में नइखे आ ओकर उपेक्षा कइल जाला।

deprecated-attribute-to-child = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` अब चलन में नइखे; एकरा बदले `<{ $child }>` संतति लिखीं।

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` के मान `{ $value }` अब चलन में नइखे; एकरा बदले `{ $to }` लिखीं।


## Language coverage

pluralize-english-only = `<pluralize>` खाली अंग्रेजी के बहुवचन बना सकेला, एहसे { $locale } में लिखल दस्तावेज में ओकर पाठ जस के तस रहेला। बहुवचन रूप सीधे लिखीं, भा `pluralForm` विशेषता से देईं।


## Checking against the schema

schema-element-unrecognized = घटक `<{ $tag }>` कवनो परिचित Doenet घटक नइखे।

schema-element-not-allowed-at-root = घटक `<{ $tag }>` दस्तावेज के मूल में अनुमत नइखे।

schema-element-not-allowed-inside = घटक `<{ $tag }>` `<{ $parent }>` के भीतर अनुमत नइखे।

schema-attribute-unrecognized = घटक `<{ $tag }>` में `{ $attribute }` नाम के कवनो विशेषता नइखे।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] घटक `<{ $tag }>` के विशेषता `{ $attribute }` अइसन सूची होखे के चाहीं जवना के हर वस्तु एह में से एगो होखे: { $allowed }
       *[other] घटक `<{ $tag }>` के विशेषता `{ $attribute }` एह में से एगो होखे के चाहीं: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select खातिर अमान्य भेद नाम। भेद नाम { $variantName } { $numOptions } विकल्प में आवेला बाकिर चुने के संख्या { $numToSelect } बा।

select-variant-name-without-options = select खातिर कुछ भेद देहल बा बाकिर संभावित भेद नाम { $variantName } खातिर कवनो विकल्प ना देहल बा।

select-variant-name-not-possible = select खातिर देहल गइल भेद नाम { $variantName } संभावित भेद नाम नइखे।

select-too-few-options = खाली { $numOptions } में से { $numToSelect } घटक ना चुनल जा सके।

select-from-sequence-too-few-values = { $length } लंबाई के अनुक्रम से { $numToSelect } मान ना चुनल जा सके।

select-from-sequence-indices-count-mismatch = select खातिर देहल गइल सूचकांक के संख्या चुने के संख्या से मिले के चाहीं

select-from-sequence-indices-not-integers = select खातिर देहल गइल सब सूचकांक पूर्णांक होखे के चाहीं

select-from-sequence-index-excluded = selectfromsequence के देहल गइल सूचकांक बहिष्कृत रहे

select-from-sequence-indices-excluded-combination = selectfromsequence के देहल गइल सूचकांक एगो बहिष्कृत संयोजन रहे

select-from-sequence-coprime-not-positive-integers = धनात्मक पूर्णांक ना चुनल जात बा, एहसे सह-अभाज्य संयोजन ना चुनल जा सके।

select-from-sequence-coprime-common-factor = सह-अभाज्य संख्या ना चुनल जा सके। सब संभावित मान के एगो साझा गुणनखंड बा। ("from" भा "to" के देहल गइल मान "step" के साथे सह-अभाज्य होखे के चाहीं।)

select-from-sequence-coprime-single-number = 1 के छोड़ि के कवनो अकेल संख्या से सह-अभाज्य संयोजन ना चुनल जा सके।

select-from-sequence-excluded-too-many-combinations = selectFromSequence में 70% से ढेर संयोजन बहिष्कृत भइल

select-from-sequence-coprime-none-found = सह-अभाज्य संख्या ना चुनल जा सकल। सब संभावित मान के एगो साझा गुणनखंड बा।

select-from-sequence-too-few-unique-values = { $numPossibleValues } लंबाई के अनुक्रम से { $numToSelect } अद्वितीय मान ना चुनल जा सके

select-prime-numbers-too-few-values = { $numValues } लंबाई के अभाज्य संख्या सूची से { $numToSelect } मान ना चुनल जा सके

select-prime-numbers-values-count-mismatch = select खातिर देहल गइल मान के संख्या चुने के संख्या से मिले के चाहीं

select-prime-numbers-values-not-prime = select prime number खातिर देहल गइल सब मान अभाज्य संख्या सूची में होखे के चाहीं

select-prime-numbers-values-excluded-combination = selectPrimeNumbers के देहल गइल मान एगो बहिष्कृत संयोजन रहे

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers में 70% से ढेर संयोजन बहिष्कृत भइल

select-random-combination-fluke = बहुते असंभव संयोग से यादृच्छिक मान के संयोजन ना चुनल जा सकल

select-random-value-fluke = बहुते असंभव संयोग से यादृच्छिक मान ना चुनल जा सकल
