# Hindi diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = दो सिरे दिए जाने पर { $attributes } पर ध्यान नहीं दिया जाता

line-segment-attributes-ignored-with-endpoint-and-midpoint = सिरा और मध्यबिंदु दोनों दिए जाने पर { $attributes } पर ध्यान नहीं दिया जाता

line-segment-midpoint-offset-without-midpoint = मध्यबिंदु के बिना midpointOffset का कोई प्रभाव नहीं होता

## `<line>`

line-points-undetermined-dimensions = ऐसे बिंदुओं से होकर जाने वाली रेखा जिनकी विमा अनिश्चित है।

line-points-too-few-dimensions = रेखा को कम से कम द्विविमीय बिंदुओं से होकर जाना चाहिए।

line-points-depend-on-variables = रेखा उन बिंदुओं से होकर जाती है जो चरों पर निर्भर हैं: { $variables }।

line-equation-invalid-format = चर { $variable1 } और { $variable2 } में रेखा के समीकरण का प्रारूप अमान्य है।

## `<ray>`

ray-overprescribed-through = किरण एक साथ through, endpoint और direction से निर्धारित है। दिए गए through को छोड़ा जा रहा है।

ray-dimension-mismatch = किरण में numDimensions मेल नहीं खाते।

## `<vector>`

vector-overprescribed-head = सदिश एक साथ head, tail और displacement से निर्धारित है। दिए गए head को छोड़ा जा रहा है।

vector-dimension-mismatch = सदिश में numDimensions मेल नहीं खाते।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` की ओर आकर्षित नहीं किया जा सकता, क्योंकि उसमें nearestPoint अवस्था चर नहीं है।

constrain-to-without-nearest-point = `<{ $component }>` तक सीमित नहीं किया जा सकता, क्योंकि उसमें nearestPoint अवस्था चर नहीं है।

constrain-to-interior-without-nearest-point = `<{ $component }>` के भीतरी भाग तक सीमित नहीं किया जा सकता, क्योंकि उसमें nearestPoint अवस्था चर नहीं है।

## `<choiceInput>`

choice-input-label-position-ignored = अंतःपंक्ति न होने वाले choiceInput के लिए labelPosition पर ध्यान नहीं दिया जाता

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput के लिए दिए गए indices को छोड़ा जा रहा है, क्योंकि indices की संख्या choice संतानों की संख्या से मेल नहीं खाती।

pretzel-indices-count-mismatch = problem के लिए दिए गए indices को छोड़ा जा रहा है, क्योंकि indices की संख्या problem संतानों की संख्या से मेल नहीं खाती।

shuffle-indices-count-mismatch = shuffle के लिए दिए गए indices को छोड़ा जा रहा है, क्योंकि indices की संख्या घटकों की संख्या से मेल नहीं खाती।

indices-ignored-out-of-range = { $component } के लिए दिए गए indices को छोड़ा जा रहा है, क्योंकि कुछ अनुक्रमांक परिसर से बाहर हैं।

pretzel-indices-repeated = pretzel के लिए दिए गए indices को छोड़ा जा रहा है, क्योंकि कुछ अनुक्रमांक दोहराए गए हैं।

pretzel-circuit-first-index = circuit विधा में pretzel के लिए दिए गए indices को छोड़ा जा रहा है, क्योंकि पहला अनुक्रमांक 1 होना चाहिए।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` को पाठ संतानों के साथ काम करने के लिए `type` विशेषता देनी होगी।

invalid-type-defaulting-to-math = { $component } घटक के लिए प्रकार { $type } अमान्य है। यह math, text, number या boolean में से एक होना चाहिए। math का उपयोग किया जा रहा है।

string-not-valid-component-to-arrange = पाठ "{ $value }" { $component } के लिए मान्य घटक नहीं है। छोड़ा जा रहा है।

## Types and variables

invalid-type-defaulting-to-number = प्रकार { $type } अमान्य है; प्रकार number पर सेट किया जा रहा है।

invalid-variable-value = चर का मान अमान्य है: `{ $value }`

## Variants

variant-index-must-be-number = संस्करण अनुक्रमांक { $index } एक संख्या होनी चाहिए

variant-index-must-be-integer = संस्करण अनुक्रमांक { $index } एक पूर्णांक होना चाहिए

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` निरपेक्ष मापों के लिए उपलब्ध नहीं है। चौड़ाइयाँ सापेक्ष की जा रही हैं।

side-by-side-absolute-margins = `<{ $component }>` निरपेक्ष मापों के लिए उपलब्ध नहीं है। हाशिये सापेक्ष किए जा रहे हैं।

side-by-side-no-block-child = अमान्य `<{ $component }>`: इसमें कम से कम एक खंड संतान होनी चाहिए।

## `<label>`

label-for-ignored-on-graphical = आलेखीय `<label>` पर `for` विशेषता पर ध्यान नहीं दिया जाता।

label-for-must-resolve-to-one = `<label>` पर `for` विशेषता ठीक एक घटक तक पहुँचनी चाहिए।

label-for-unresolved = `<label>` पर `for` विशेषता किसी घटक तक नहीं पहुँच सकी।

label-for-answer-with-authored-inputs = `<label>` पर `for` विशेषता ऐसे `<answer>` का संदर्भ देती है जिसमें इनपुट स्पष्ट रूप से लिखे गए हैं; सीधे उसी इनपुट का संदर्भ दें।

label-for-answer-without-input = `<label>` पर `for` विशेषता ऐसे `<answer>` का संदर्भ देती है जिसमें लेबल लगाने योग्य इनपुट नहीं है।

label-for-must-reference-input-or-answer = `<label>` पर `for` विशेषता किसी इनपुट या किसी उत्तर का संदर्भ देनी चाहिए।

## Accessibility

accessibility-short-description-or-decorative = सुगम्यता के लिए `<{ $component }>` का या तो संक्षिप्त विवरण होना चाहिए या उसे सजावटी बताया जाना चाहिए।

accessibility-video-short-description = सुगम्यता के लिए `<video>` का संक्षिप्त विवरण होना चाहिए।

accessibility-input-short-description-or-label = सुगम्यता के लिए `<{ $component }>` का संक्षिप्त विवरण या लेबल होना चाहिए।

accessibility-answer-input-short-description-or-label = सुगम्यता के लिए इनपुट बनाने वाले `<answer>` का संक्षिप्त विवरण या लेबल होना चाहिए।

accessibility-short-description-contains-math = संक्षिप्त विवरणों में `<{ $component }>` जैसे गणितीय घटक नहीं होने चाहिए। गणित को शब्दों में लिखें।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } का खंड शीर्षक पाठ के लिए वैषम्य अपर्याप्त है (गहरी विधा) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाहिए)।
       *[other] { $colorName } का खंड शीर्षक पाठ के लिए वैषम्य अपर्याप्त है ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाहिए)।
    }

## `<circle>`

circle-through-points-non-numerical = जब बिंदुओं के संख्यात्मक मान न हों, तब { $count } बिंदुओं से होकर जाने वाला `<circle>` अभी उपलब्ध नहीं है।

circle-too-many-through-points = 3 से अधिक बिंदुओं से होकर जाने वाला वृत्त परिकलित नहीं किया जा सकता।

circle-overprescribed-radius-center-points = त्रिज्या, केंद्र और गुज़रने वाले बिंदु एक साथ दिए जाने पर वृत्त परिकलित नहीं किया जा सकता।

circle-center-with-multiple-points = दिए गए केंद्र के साथ 1 से अधिक बिंदु से होकर जाने वाला वृत्त परिकलित नहीं किया जा सकता।

circle-radius-too-small = वृत्त परिकलित नहीं किया जा सकता: दोनों बिंदुओं के बीच की दूरी { $distance } है, इसलिए दी गई त्रिज्या { $radius } बहुत छोटी है।

circle-radius-with-many-points = दी गई त्रिज्या के साथ दो से अधिक बिंदुओं से होकर जाने वाला वृत्त नहीं बनाया जा सकता।

circle-invalid-center-or-through-points = वृत्त का केंद्र या गुज़रने वाले बिंदु अमान्य हैं।

circle-radius-center-with-multiple-points = दिए गए केंद्र के साथ 1 से अधिक बिंदु से होकर जाने वाले वृत्त की त्रिज्या परिकलित नहीं की जा सकती।

circle-change-radius-non-numerical = जिस वृत्त के गुज़रने वाले बिंदु संख्यात्मक नहीं हैं, उसकी त्रिज्या नहीं बदली जा सकती

circle-radius-with-points-non-numerical = संख्यात्मक मान न होने पर, दी गई त्रिज्या के साथ एक से अधिक बिंदु से होकर जाने वाला वृत्त नहीं बनाया जा सकता।

circle-change-center-non-numerical = असंख्यात्मक बिंदुओं से होकर जाने वाले वृत्त का केंद्र बदलना अभी उपलब्ध नहीं है।

## `<function>`

function-domain-insufficient-dimensions = फलन के प्रांत की विमाएँ अपर्याप्त हैं। प्रांत में { $intervals } अंतराल हैं, पर फलन में { $inputs } इनपुट हैं।

function-domain-invalid-format = फलन के प्रांत का प्रारूप अमान्य है।

function-ignoring-non-numerical =
    { $type ->
        [maximum] फलन का असंख्यात्मक उच्चिष्ठ छोड़ा जा रहा है।
        [minimum] फलन का असंख्यात्मक निम्निष्ठ छोड़ा जा रहा है।
        [extremum] फलन का असंख्यात्मक चरम मान छोड़ा जा रहा है।
        [point] फलन का असंख्यात्मक बिंदु छोड़ा जा रहा है।
        [slope] फलन की असंख्यात्मक प्रवणता छोड़ी जा रही है।
       *[other] फलन का असंख्यात्मक { $type } छोड़ा जा रहा है।
    }

function-ignoring-empty =
    { $type ->
        [maximum] फलन का रिक्त उच्चिष्ठ छोड़ा जा रहा है।
        [minimum] फलन का रिक्त निम्निष्ठ छोड़ा जा रहा है।
        [extremum] फलन का रिक्त चरम मान छोड़ा जा रहा है।
        [point] फलन का रिक्त बिंदु छोड़ा जा रहा है।
       *[other] फलन का रिक्त { $type } छोड़ा जा रहा है।
    }

function-points-too-close = फलन में दो बिंदु बहुत पास-पास हैं। फलन परिभाषित नहीं किया जा सकता।

function-iterates-input-output-mismatch = फलन का पुनरावर्तन तभी संभव है जब इनपुट की संख्या आउटपुट की संख्या के बराबर हो। इस फलन में { $inputs } इनपुट और { $outputs } आउटपुट हैं।

## `<sequence>`

sequence-invalid-length = अनुक्रम की लंबाई अमान्य है। यह ऋणेतर पूर्णांक होनी चाहिए।

sequence-invalid-step = अनुक्रम का चरण अमान्य है। { $type } प्रकार के अनुक्रम के लिए यह एक संख्या होनी चाहिए।

sequence-invalid-endpoint-number = संख्या अनुक्रम का "{ $attribute }" अमान्य है। यह एक संख्या होनी चाहिए।

sequence-invalid-endpoint-letters = अक्षर अनुक्रम का "{ $attribute }" अमान्य है। यह अक्षरों का संयोजन होना चाहिए।

sequence-invalid-endpoint = अनुक्रम का "{ $attribute }" अमान्य है।

select-from-sequence-coprime-not-numbers = संख्याएँ नहीं चुनी जा रहीं, इसलिए coprime छोड़ा गया

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations दिया गया है, इसलिए coprime छोड़ा गया

## Resolving a `target`

target-not-found = `<{ $source }>` के लिए target अमान्य है: लक्ष्य नहीं मिला।

target-state-variable-not-found = `<{ $source }>` के लिए target अमान्य है: `<{ $component }>` पर "{ $property }" नाम का अवस्था चर नहीं मिला।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` के चर स्वतंत्र चर से भिन्न होने चाहिए।

ode-system-duplicate-variable-names = दोहराए गए आश्रित चर नामों के साथ ODE के दाएँ पक्ष के फलन परिभाषित नहीं किए जा सकते।

ode-system-rhs-function-error = ODE के दाएँ पक्ष का फलन परिभाषित नहीं किया जा सकता। mathjs फलन बनाते समय त्रुटि हुई।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } रेखाओं के बीच का कोण परिभाषित नहीं किया जा सकता

angle-invalid-through-point = `<angle>` के through में अमान्य बिंदु है

parabola-vertex-too-many-points = दिए गए शीर्ष के साथ 1 से अधिक बिंदु से होकर जाने वाला परवलय अभी उपलब्ध नहीं है।

parabola-too-many-points = 3 से अधिक बिंदुओं से होकर जाने वाला परवलय अभी उपलब्ध नहीं है।

intersection-too-many-items = दो से अधिक वस्तुओं का प्रतिच्छेदन अभी उपलब्ध नहीं है

## Other math components

ionic-compound-not-two-ions = दो आयनों के अतिरिक्त किसी और स्थिति के लिए आयनिक यौगिक अभी उपलब्ध नहीं है।

ionic-compound-needs-cation-and-anion = आयनिक यौगिक केवल एक धनायन और एक ऋणायन के लिए उपलब्ध है।

solve-equations-cannot-evaluate = समीकरण का मान नहीं निकाला जा सका, इसलिए वह हल नहीं किया जा सकता: { $equation }

math-operators-operand-number-required = गणितीय संकार्य निकालते समय operandNumber देना आवश्यक है।

eigen-decomposition-failed = आव्यूह के अभिलक्षणिक मान परिकलित नहीं किए जा सके

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: प्राचल { $parameters } पैटर्न में नहीं आता, इसलिए वह सदा रिक्त से मेल खाएगा।
       *[other] `<matchesPattern>`: प्राचल { $parameters } पैटर्न में नहीं आते, इसलिए वे सदा रिक्त से मेल खाएँगे।
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" को समझा नहीं जा सका। यह none, medium, dense, या रिक्त स्थान से अलग की गई दो धनात्मक संख्याएँ होनी चाहिए, जैसे grid="1 0.5"। कोई ग्रिड नहीं खींचा जाएगा।

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure रेंडरर में xLabelPosition="left" समर्थित नहीं है; दाईं स्थिति वाला व्यवहार अपनाया जा रहा है।

prefigure-y-label-position-unsupported = `<graph>`: prefigure रेंडरर में yLabelPosition="bottom" समर्थित नहीं है; ऊपरी स्थिति वाला व्यवहार अपनाया जा रहा है।

prefigure-invalid-axis-bounds = `<graph>`: prefigure रूपांतरण के लिए अक्ष सीमाएँ अमान्य हैं; पूर्वनिर्धारित bbox (-10,-10,10,10) अपनाया जा रहा है।

prefigure-invalid-width = `<graph>`: prefigure रूपांतरण के लिए चौड़ाई अमान्य है; पूर्वनिर्धारित आरेख चौड़ाई 425 अपनाई जा रही है।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure रूपांतरण के लिए aspectRatio अमान्य है; पूर्वनिर्धारित अनुपात 1 अपनाया जा रहा है।

prefigure-grid-spacing-too-fine = `<graph>`: अक्ष सीमाओं की तुलना में ग्रिड का अंतराल बहुत महीन है; prefigure रेंडरर में ग्रिड छोड़ा जा रहा है।

prefigure-annotations-not-rendered = `<graph>`: PreFigure रेंडरर का उपयोग न होने पर टीकाएँ नहीं खींची जाएँगी।

multiple-annotations-children = `<graph>` में एक से अधिक `<annotations>` संतानें मिलीं; अंतिम को छोड़कर सभी पर ध्यान नहीं दिया जाएगा।

## Referring to other components

copy-unrecognized-component-type = अपरिचित घटक प्रकार को विस्तारित या प्रतिलिपित नहीं किया जा सकता: { $type }।

copy-prop-not-found = { $component } प्रकार के घटक पर { $property } गुण नहीं मिला

collect-no-source = collect के लिए कोई स्रोत नहीं मिला।

collect-invalid-component-type = `<{ $component }>` प्रकार के घटक एकत्र नहीं किए जा सकते, क्योंकि यह मान्य घटक प्रकार नहीं है।

reference-index-unavailable = अनुक्रमांक `{ $reference }` का संदर्भ नहीं दिया जा सकता

## `<callAction>`

component-action-unavailable = घटक `{ $reference }` पर { $action } नहीं बुलाया जा सकता

## `<dataFrame>`

data-frame-inconsistent-row-lengths = आँकड़ों का आकार अमान्य है। पंक्तियों की लंबाई असंगत है। componentIdx :{ $componentIdx } में मिला

data-frame-duplicate-column-names = आँकड़ों में स्तंभ नाम दोहराए गए हैं। componentIdx :{ $componentIdx } में मिला

data-frame-missing-column-name = आँकड़ों में एक स्तंभ नाम अनुपस्थित है। componentIdx :{ $componentIdx } में मिला

## `<answer>` and scoring

answer-award-depends-on-own-response = इस उत्तर का एक award स्वयं answer टैग द्वारा भेजे गए उत्तर पर आधारित है, जिससे अप्रत्याशित व्यवहार होगा।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` वाले पात्र के भीतर के `<answer>` पर `maxNumAttempts` सेट करने का कोई प्रभाव नहीं होता, क्योंकि प्रयासों की संख्या पात्र नियंत्रित करता है। `maxNumAttempts` पात्र पर सेट करें।

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` वाले किसी अन्य पात्र के भीतर स्थित `sectionWideCheckWork` पात्र पर `maxNumAttempts` सेट करने का कोई प्रभाव नहीं होता, क्योंकि प्रयासों की संख्या बाहरी पात्र नियंत्रित करता है। `maxNumAttempts` बाहरी पात्र पर सेट करें।

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality सेट किए बिना { $attributes } विशेषता का कोई प्रभाव नहीं होगा।
       *[other] symbolicEquality सेट किए बिना { $attributes } विशेषताओं का कोई प्रभाव नहीं होगा।
    }

answer-invalid-type = answer के लिए प्रकार अमान्य है: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = चूँकि घटक `<{ $component }>` का नाम नहीं है, इसे मॉड्यूल विशेषता के रूप में उपयोग नहीं किया जा सकता

module-attribute-name-already-defined = घटक `<{ $component } name="{ $name }">` को मॉड्यूल की विशेषता के रूप में उपयोग नहीं किया जा सकता, क्योंकि घटक प्रकार `<module>` में "{ $name }" विशेषता पहले से परिभाषित है।

conditional-content-condition-ignored = case या else संतानों वाले `<conditionalContent>` घटक पर `condition` विशेषता पर ध्यान नहीं दिया जाता।

slider-markers-type-mismatch = चिह्नकों का प्रकार स्लाइडर के प्रकार से मेल नहीं खाता।

pretzel-problem-needs-statement-and-answer = अमान्य pretzel: प्रत्येक `<problem>` में एक `<statement>` और एक `<answer>` होना चाहिए।

pretzel-circuit-first-problem-distractor = अमान्य pretzel: mode="circuit" में पहला `<problem>` भ्रामक विकल्प नहीं हो सकता।

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] विशेषता `{ $attribute }` के लिए मान { $values } अमान्य है; छोड़ा जा रहा है।
       *[other] विशेषता `{ $attribute }` के लिए मान { $values } अमान्य हैं; छोड़ा जा रहा है।
    }

attribute-must-be-references = विशेषता `{ $attribute }` के लिए मान `{ $value }` अमान्य है। विशेषता `$` से आरंभ होने वाले संदर्भों से बनी होनी चाहिए।

math-input-invalid-function-names = <mathInput>: { $attribute } में अमान्य फलन नाम छोड़े गए: { $names }। प्रत्येक नाम के दृश्य भाग में कम से कम 2 वर्ण (अक्षर या योजक चिह्न) होने चाहिए; उसके बाद वैकल्पिक `|<mathspeak विकल्प>` प्रत्यय आ सकता है।

## Building components from the source

component-type-invalid = घटक प्रकार अमान्य है: `<{ $componentType }>`

attribute-repeated = विशेषता { $attribute } दोहराई नहीं जा सकती।

attribute-invalid-for-component = `<{ $componentType }>` प्रकार के घटक के लिए विशेषता "{ $attribute }" अमान्य है।

## Style definition contrast

style-definition-insufficient-contrast =
    शैली परिभाषा { $styleNumber } में { $context ->
        [text-on-background] पृष्ठभूमि रंग की तुलना में पाठ रंग
        [high-contrast] कैनवास की तुलना में उच्च वैषम्य रंग
        [line] कैनवास की तुलना में रेखा रंग
        [marker] कैनवास की तुलना में चिह्नक रंग
       *[text-on-canvas] कैनवास की तुलना में पाठ रंग
    } के लिए वैषम्य अपर्याप्त है{ $mode ->
        [dark] { " (गहरी विधा)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाहिए)।

style-definition-dark-mode-text-background-contrast =
    यद्यपि शैली परिभाषा { $styleNumber } ने हल्की विधा के लिए पर्याप्त वैषम्य वाले रंग दिए हैं, इन मानों से व्युत्पन्न गहरी विधा के रंगों में पाठ रंग और पृष्ठभूमि रंग के बीच वैषम्य अपर्याप्त है ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाहिए)। { $suggestion ->
        [available] गहरी विधा में पर्याप्त वैषम्य सुनिश्चित करने के लिए या तो हल्की विधा का वैषम्य बढ़ाएँ (जैसे { $lightAttribute }="{ $lightColor }" सेट करें) या गहरी विधा का रंग अधिरोहित करें (जैसे { $darkAttribute }="{ $darkColor }" सेट करें)।
       *[none] गहरी विधा में पर्याप्त वैषम्य सुनिश्चित करने के लिए हल्की विधा का वैषम्य बढ़ाएँ या व्युत्पन्न रंगों को textColorDarkMode और/या backgroundColorDarkMode से अधिरोहित करें।
    }

style-definition-dark-mode-text-canvas-contrast =
    यद्यपि शैली परिभाषा { $styleNumber } ने हल्की विधा के लिए पर्याप्त वैषम्य वाला पाठ रंग दिया है, इस मान से व्युत्पन्न गहरी विधा के पाठ रंग का कैनवास की तुलना में वैषम्य अपर्याप्त है ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाहिए)। { $suggestion ->
        [available] गहरी विधा में पर्याप्त वैषम्य सुनिश्चित करने के लिए या तो हल्की विधा का वैषम्य बढ़ाएँ (जैसे textColor="{ $lightColor }" सेट करें) या गहरी विधा का रंग अधिरोहित करें (जैसे textColorDarkMode="{ $darkColor }" सेट करें)।
       *[none] गहरी विधा में पर्याप्त वैषम्य सुनिश्चित करने के लिए हल्की विधा का वैषम्य बढ़ाएँ या व्युत्पन्न रंग को textColorDarkMode से अधिरोहित करें।
    }

section-multiple-style-palettes = एक खंड केवल एक <stylePalette> चुन सकता है; अंतिम का उपयोग किया जा रहा है।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } के अद्वितीय संस्करण निर्धारित नहीं किए जा सकते, क्योंकि numToSelect ऋणेतर पूर्णांक नहीं है।

variant-num-to-select-not-constant-number = { $component } के अद्वितीय संस्करण निर्धारित नहीं किए जा सकते, क्योंकि numToSelect अचर नहीं है।

variant-with-replacement-not-constant-boolean = { $component } के अद्वितीय संस्करण निर्धारित नहीं किए जा सकते, क्योंकि withReplacement अचर बूलीय मान नहीं है।

variant-select-weight-disables-unique = यदि कोई विकल्प selectWeight या selectForVariants देता है तो select के अद्वितीय संस्करण निष्क्रिय हो जाते हैं

variant-coprime-undetermined = { $component } के अद्वितीय संस्करण निर्धारित नहीं किए जा सकते, क्योंकि यह तय नहीं हो सका कि coprime सदा असत्य है।

variant-attribute-not-constant = { $component } के अद्वितीय संस्करण निर्धारित नहीं किए जा सकते, क्योंकि { $attribute } अचर नहीं है।

variant-attribute-not-number = { $component } के अद्वितीय संस्करण निर्धारित नहीं किए जा सकते, क्योंकि { $attribute } संख्या नहीं है।

variant-attribute-wrong-type-for-sequence =
    { $type } प्रकार के { $component } के अद्वितीय संस्करण निर्धारित नहीं किए जा सकते, क्योंकि { $attribute } { $expected ->
        [letters-combination] अक्षरों का संयोजन
        [math-expression] मान्य गणितीय व्यंजक
        [integer] पूर्णांक
       *[number] संख्या
    } नहीं है।

variant-length-not-integer = { $component } के अद्वितीय संस्करण निर्धारित नहीं किए जा सकते, क्योंकि length पूर्णांक नहीं है।

variant-sort-not-implemented = sort वाले { $component } के अद्वितीय संस्करण अभी उपलब्ध नहीं हैं

variant-exclude-combinations-not-implemented = excludeCombinations वाले { $component } के अद्वितीय संस्करण अभी उपलब्ध नहीं हैं

variant-math-exclude-not-implemented = exclude वाले math प्रकार के { $component } के अद्वितीय संस्करण अभी उपलब्ध नहीं हैं

variant-non-constant-exclude-not-implemented = अनचर exclude वाले { $component } के अद्वितीय संस्करण अभी उपलब्ध नहीं हैं

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: आलेख के prefigure रेंडरर में समर्थित नहीं; वंशज छोड़ा गया।

prefigure-descendant-invalid-geometry = { $subject }: ज्यामिति असीमित या अपूर्ण है; वंशज छोड़ा गया।

prefigure-curve-label-omitted = { $subject }: रूपांतरित वक्र तत्वों पर लेबल समर्थित नहीं; लेबल छोड़ा गया।

prefigure-curve-unsupported-definition-type = { $subject }: वक्र फलन परिभाषा प्रकार '{ $definitionType }' समर्थित नहीं; वंशज छोड़ा गया।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves पर flipFunctions विशेषता समर्थित नहीं; वंशज छोड़ा गया।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves केवल सूत्र प्रकार के संतान फलनों का समर्थन करता है; वंशज छोड़ा गया।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] रेखा कुल के लेबल
       *[point] बिंदु लेबल
    } के लिए labelPosition '{ $labelPosition }' समर्थित नहीं; PreFigure की पूर्वनिर्धारित संरेखण अपनाई जा रही है।

prefigure-fill-style-unsupported = { $subject }: भराव शैली '{ $fillStyle }' PreFigure में समर्थित नहीं; ठोस भराव अपनाया जा रहा है।

prefigure-line-style-unknown = { $subject }: अज्ञात रेखा शैली '{ $lineStyle }' PreFigure के आउटपुट से छोड़ी गई।

prefigure-marker-style-mapped-to-diamond = { $subject }: चिह्नक शैली '{ $markerStyle }' PreFigure की 'diamond' शैली पर मानचित्रित की गई।

prefigure-marker-style-unsupported = { $subject }: चिह्नक शैली '{ $markerStyle }' PreFigure में समर्थित नहीं; पूर्वनिर्धारित शैली अपनाई जा रही है।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` अमान्य; लक्ष्य निर्धारित नहीं हो सका। टीका छोड़ी गई।

annotation-ref-multiple-targets = `<annotation>`: `ref` से कई लक्ष्य निकले; पहला लक्ष्य लिया जा रहा है।

annotation-ref-outside-graph = `<annotation>`: `ref` अमान्य; लक्ष्य उसे समेटे आलेख के बाहर है। टीका छोड़ी गई।

annotation-ref-unsupported-target = `<annotation>`: `ref` अमान्य; prefigure रूपांतरण में लक्ष्य समर्थित आलेखीय वस्तु नहीं है। टीका छोड़ी गई।

annotation-text-missing = `<annotation>`: `text` अनुपस्थित या रिक्त; रिक्त पाठ दिया जा रहा है।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] चक्रीय निर्भरता का पता चला।
       *[other] `<{ $componentType }>` घटक से जुड़ी चक्रीय निर्भरता का पता चला।
    }

reference-no-referent = इस संदर्भ का कोई लक्ष्य नहीं मिला: `{ $reference }`

reference-multiple-referents = इस संदर्भ के कई लक्ष्य मिले: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` की विशेषता { $attribute } का प्रारूप अमान्य है।

children-invalid = `<{ $componentType }>` की संतानें अमान्य हैं: अमान्य संतानें मिलीं: { $children }

## Falling back to a default

attribute-value-invalid-using-default = विशेषता `{ $attribute }` के लिए मान `{ $value }` अमान्य है; मान `{ $default }` का उपयोग किया जा रहा है

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML संस्करण { $version } नहीं मिला।
       *[other] DoenetML संस्करण { $version } नहीं मिला। संस्करण { $fallback } पर लौटा जा रहा है
    }

## Reading the DoenetML

parse-invalid-doenetml = अमान्य DoenetML: { $content }

parse-tag-missing-close-tag = अमान्य DoenetML: टैग `{ $tag }` का समापन टैग नहीं है। स्वतः बंद होने वाला टैग या `</{ $tagName }>` टैग अपेक्षित था।

parse-tag-error = अमान्य DoenetML: टैग `<{ $tagName }>` में त्रुटि

parse-attribute-missing-value = अमान्य DoenetML: विशेषता `{ $attribute }` का मान अनुपस्थित प्रतीत होता है।

parse-attribute-invalid = अमान्य DoenetML: विशेषता `{ $attribute }` अमान्य है

parse-attribute-value-invalid = अमान्य DoenetML: विशेषता मान `{ $value }` अमान्य है

parse-attribute-value-quote-mismatch = अमान्य DoenetML: विशेषता मान `{ $value }` अमान्य है। उद्धरण चिह्न मेल नहीं खाते। एक `{ $quote }` अनुपस्थित प्रतीत होता है

parse-open-tag-name-missing = अमान्य DoenetML: बिना नाम का टैग मिला, जैसे `<`

parse-tag-not-closed = अमान्य DoenetML: टैग `{ $tag }` बंद नहीं हुआ (एक `>` अनुपस्थित प्रतीत होता है)।

parse-self-closing-tag-name-missing = अमान्य DoenetML: बिना नाम का टैग मिला `<{ $content }>`

parse-self-closing-tag-not-closed = अमान्य DoenetML: टैग `{ $tag }` बंद नहीं हुआ (`/>` अनुपस्थित प्रतीत होता है)।

parse-tag-invalid-attributes = अमान्य DoenetML: टैग `{ $tag }` मान्य नहीं है। इसकी विशेषताएँ ग़लत हो सकती हैं।

parse-close-tag-name-missing = अमान्य DoenetML: बिना नाम का समापन टैग मिला, जैसे `</`

parse-attribute-value-unquoted = विशेषता मान उद्धरण चिह्नों में होने चाहिए: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = अमान्य DoenetML: समापन टैग `{ $tag }` मिला, पर उससे मेल खाता आरंभ टैग नहीं है

parse-close-tag-mismatched = अमान्य DoenetML: समापन टैग मेल नहीं खाता। `</{ $expected }>` अपेक्षित था। `{ $found }` मिला

parser-node-unconvertible = नोड { $node } को Dast नोड में परिवर्तित नहीं किया जा सका।

## Names

name-attribute-invalid =
    विशेषता name='{ $name }' अमान्य है। { $reason ->
        [characters] नामों में केवल अक्षर, अंक, अधोरेखा या योजक चिह्न हो सकते हैं।
       *[start] नाम अक्षर से आरंभ होने चाहिए।
    }

component-name-invalid-start = घटक नाम "{ $name }" अमान्य है। नाम अक्षर से आरंभ होने चाहिए।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched प्रकार के answer में video विशेषता होनी चाहिए

answer-video-watched-video-not-reference = videoWatched प्रकार के answer की video विशेषता एक संदर्भ होनी चाहिए

answer-name-not-single-text = answer की name विशेषता में केवल एक पाठ संतान होनी चाहिए

## Referencing another document

external-doenetml-recursion-limit = पुनरावर्तन के बहुत अधिक स्तरों के कारण बाहरी DoenetML प्राप्त नहीं किया जा सका। कहीं चक्रीय संदर्भ तो नहीं?

external-doenetml-unavailable = { $attribute }="{ $uri }" से DoenetML प्राप्त नहीं किया जा सका

external-doenetml-type-mismatch = { $attribute }="{ $uri }" से प्राप्त DoenetML अमान्य है: यह घटक प्रकार "{ $componentType }" से मेल नहीं खाया

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` अप्रचलित है; इसके बदले `{ $to }` का उपयोग करें।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` अप्रचलित है; इसके बदले `{ $to }` का उपयोग करें।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` अप्रचलित है और छोड़ दी गई, क्योंकि `{ $to }` भी दिया गया है।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` अप्रचलित है और छोड़ दी गई, क्योंकि `{ $to }` भी दिया गया है।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` अप्रचलित है और छोड़ दी गई।


## Language coverage

pluralize-english-only = `<pluralize>` केवल अंग्रेज़ी का बहुवचन बना सकता है, इसलिए { $locale } में लिखे दस्तावेज़ में उसका पाठ अपरिवर्तित रहता है। बहुवचन रूप सीधे लिखें, या `pluralForm` विशेषता से दें।


## Checking against the schema

schema-element-unrecognized = तत्व `<{ $tag }>` कोई परिचित Doenet तत्व नहीं है।

schema-element-not-allowed-at-root = तत्व `<{ $tag }>` दस्तावेज़ के मूल में मान्य नहीं है।

schema-element-not-allowed-inside = तत्व `<{ $tag }>` `<{ $parent }>` के भीतर मान्य नहीं है।

schema-attribute-unrecognized = तत्व `<{ $tag }>` में `{ $attribute }` नाम की कोई विशेषता नहीं है।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] तत्व `<{ $tag }>` की विशेषता `{ $attribute }` एक सूची होनी चाहिए जिसकी हर मद इनमें से एक हो: { $allowed }
       *[other] तत्व `<{ $tag }>` की विशेषता `{ $attribute }` इनमें से एक होनी चाहिए: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select के लिए संस्करण नाम अमान्य है। संस्करण नाम { $variantName } { $numOptions } विकल्पों में आता है, पर चुनने की संख्या { $numToSelect } है।

select-variant-name-without-options = select के लिए संस्करण दिए गए हैं, पर संभावित संस्करण नाम के लिए कोई विकल्प नहीं है: { $variantName }।

select-variant-name-not-possible = select के लिए दिया गया संस्करण नाम { $variantName } संभावित संस्करण नाम नहीं है।

select-too-few-options = केवल { $numOptions } घटकों में से { $numToSelect } नहीं चुने जा सकते।

select-from-sequence-too-few-values = { $length } लंबाई के अनुक्रम से { $numToSelect } मान नहीं चुने जा सकते।

select-from-sequence-indices-count-mismatch = select के लिए दिए गए अनुक्रमांकों की संख्या चुनने की संख्या से मेल खानी चाहिए

select-from-sequence-indices-not-integers = select के लिए दिए गए सभी अनुक्रमांक पूर्णांक होने चाहिए

select-from-sequence-index-excluded = selectfromsequence के लिए दिया गया अनुक्रमांक बहिष्कृत था

select-from-sequence-indices-excluded-combination = selectfromsequence के लिए दिए गए अनुक्रमांक बहिष्कृत संयोजन बनाते थे

select-from-sequence-coprime-not-positive-integers = धनात्मक पूर्णांक नहीं चुने जा रहे, इसलिए सहअभाज्य संयोजन नहीं चुने जा सकते।

select-from-sequence-coprime-common-factor = सहअभाज्य संख्याएँ नहीं चुनी जा सकतीं। सभी संभावित मानों में एक उभयनिष्ठ गुणनखंड है। (दिए गए "from" या "to" मान "step" के सहअभाज्य होने चाहिए।)

select-from-sequence-coprime-single-number = 1 से भिन्न किसी एकल संख्या से सहअभाज्य संयोजन नहीं चुने जा सकते।

select-from-sequence-excluded-too-many-combinations = selectFromSequence में 70% से अधिक संयोजन बहिष्कृत किए गए

select-from-sequence-coprime-none-found = सहअभाज्य संख्याएँ नहीं चुनी जा सकीं। सभी संभावित मानों में एक उभयनिष्ठ गुणनखंड है।

select-from-sequence-too-few-unique-values = { $numPossibleValues } लंबाई के अनुक्रम से { $numToSelect } भिन्न मान नहीं चुने जा सकते

select-prime-numbers-too-few-values = { $numValues } लंबाई की अभाज्य सूची से { $numToSelect } मान नहीं चुने जा सकते

select-prime-numbers-values-count-mismatch = select के लिए दिए गए मानों की संख्या चुनने की संख्या से मेल खानी चाहिए

select-prime-numbers-values-not-prime = select prime number के लिए दिए गए सभी मान अभाज्य सूची में होने चाहिए

select-prime-numbers-values-excluded-combination = selectPrimeNumbers के लिए दिए गए मान बहिष्कृत संयोजन बनाते थे

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers में 70% से अधिक संयोजन बहिष्कृत किए गए

select-random-combination-fluke = अत्यंत असंभव संयोग से यादृच्छिक मानों का संयोजन नहीं चुना जा सका

select-random-value-fluke = अत्यंत असंभव संयोग से यादृच्छिक मान नहीं चुना जा सका
