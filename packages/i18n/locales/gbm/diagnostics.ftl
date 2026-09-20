# Garhwali (गढ़वळि) diagnostics: the errors and warnings shown to whoever is looking
# at the screen. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Devanagari**, which is the only script Garhwali is written in.
#
# **Method, stated plainly.** Garhwali has no established register for
# mathematics or for software, so the technical vocabulary of this catalog is
# Hindi — रेखा, बहुभुज, फलन, विशेषता, घटक, संस्करण — the words a Garhwali
# speaker meets in an Uttarakhand classroom, which teaches out of Hindi
# textbooks. What is Garhwali here is the grammatical layer written over it:
# the genitive कु / की / का rather than Hindi का / की / के, the object marker
# तैं, the copula च (plural छन), the negative नि, मा for *in*, बटि for
# *from*, दगड़ि for *with*, अर for *and*, जु for *if*, कुण for *for*, क्यांकि
# for *because*, and the -आ imperative (करा, दिखावा, हटावा) Garhwali puts on a
# button. A reviewer should read this as Garhwali grammar over Hindi
# terminology and is free to replace the terminology wherever Garhwali has its
# own word.
#
# **Nothing selects on a plural category.** CLDR has no plural data for
# `gbm`, so every count in this file goes through a single `*[other]`. The
# one exception is `field-function-wrong-num-outputs`, where English is not
# counting but distinguishing a one-output field from a two-output one; that
# fork is kept as the numeric literal `[1]`, which Fluent matches against the
# number itself rather than against a plural category.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = दो सिरे दिए जाण पर { $attributes } पर ध्यान नि दिया जांद

line-segment-attributes-ignored-with-endpoint-and-midpoint = सिरा अर मध्यबिंदु दोनों दिए जाण पर { $attributes } पर ध्यान नि दिया जांद

line-segment-midpoint-offset-without-midpoint = मध्यबिंदु का बिना midpointOffset कु कोई प्रभाव नि हूंद

## `<line>`

line-points-undetermined-dimensions = ऐसे बिंदुओं बटि होकर जाण वाली रेखा जिनकी विमा अनिश्चित च।

line-points-too-few-dimensions = रेखा तैं कम बटि कम द्विविमीय बिंदुओं बटि होकर जाना चैंद।

line-points-depend-on-variables = रेखा उन बिंदुओं बटि होकर जांदि च जो चरों पर निर्भर छन: { $variables }।

line-equation-invalid-format = चर { $variable1 } अर { $variable2 } मा रेखा का समीकरण कु प्रारूप अमान्य च।

## `<ray>`

ray-overprescribed-through = किरण एक साथ through, endpoint अर direction बटि निर्धारित च। दिए गए through तैं छोड़ा जा रौं च।

ray-dimension-mismatch = किरण मा numDimensions मेल नि खाते।

## `<vector>`

vector-overprescribed-head = सदिश एक साथ head, tail अर displacement बटि निर्धारित च। दिए गए head तैं छोड़ा जा रौं च।

vector-dimension-mismatch = सदिश मा numDimensions मेल नि खाते।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` की तरफ आकर्षित नि किया जा सकद, क्यांकि वै मा nearestPoint अवस्था चर नि च।

constrain-to-without-nearest-point = `<{ $component }>` तक सीमित नि किया जा सकद, क्यांकि वै मा nearestPoint अवस्था चर नि च।

constrain-to-interior-without-nearest-point = `<{ $component }>` का भीतरी भाग तक सीमित नि किया जा सकद, क्यांकि वै मा nearestPoint अवस्था चर नि च।

## `<choiceInput>`

choice-input-label-position-ignored = अंतःपंक्ति न होण वाले choiceInput कुण labelPosition पर ध्यान नि दिया जांद

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput कुण दिए गए indices तैं छोड़ा जा रौं च, क्यांकि indices की संख्या choice संतानों की संख्या बटि मेल नि खाती।

pretzel-indices-count-mismatch = problem कुण दिए गए indices तैं छोड़ा जा रौं च, क्यांकि indices की संख्या problem संतानों की संख्या बटि मेल नि खाती।

shuffle-indices-count-mismatch = shuffle कुण दिए गए indices तैं छोड़ा जा रौं च, क्यांकि indices की संख्या घटकों की संख्या बटि मेल नि खाती।

indices-ignored-out-of-range = { $component } कुण दिए गए indices तैं छोड़ा जा रौं च, क्यांकि कुछ अनुक्रमांक परिसर बटि बाहर छन।

pretzel-indices-repeated = pretzel कुण दिए गए indices तैं छोड़ा जा रौं च, क्यांकि कुछ अनुक्रमांक दोहराए गए छन।

pretzel-circuit-first-index = circuit विधा मा pretzel कुण दिए गए indices तैं छोड़ा जा रौं च, क्यांकि पैलु अनुक्रमांक 1 होण चैंद।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` तैं पाठ संतानों दगड़ि काम करण कुण `type` विशेषता देनी ह्वेलि।

invalid-type-defaulting-to-math = { $component } घटक कुण प्रकार { $type } अमान्य च। यु math, text, number या boolean मा बटि एक होण चैंद। math कु उपयोग किया जा रौं च।

string-not-valid-component-to-arrange = पाठ "{ $value }" { $component } कुण मान्य घटक नि च। छोड़ा जा रौं च।

## Types and variables

invalid-type-defaulting-to-number = प्रकार { $type } अमान्य च; प्रकार number पर सेट किया जा रौं च।

invalid-variable-value = चर कु मान अमान्य च: `{ $value }`

## Variants

variant-index-must-be-number = संस्करण अनुक्रमांक { $index } एक संख्या होणि चैंद

variant-index-must-be-integer = संस्करण अनुक्रमांक { $index } एक पूर्णांक होण चैंद

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` निरपेक्ष मापों कुण उपलब्ध नि च। चौड़ाइयाँ सापेक्ष की जा रैं छन।

side-by-side-absolute-margins = `<{ $component }>` निरपेक्ष मापों कुण उपलब्ध नि च। हाशिये सापेक्ष किए जा रैं छन।

side-by-side-no-block-child = अमान्य `<{ $component }>`: यै मा कम बटि कम एक खंड संतान होणि चैंद।

## `<label>`

label-for-ignored-on-graphical = आलेखीय `<label>` पर `for` विशेषता पर ध्यान नि दिया जांद।

label-for-must-resolve-to-one = `<label>` पर `for` विशेषता ठीक एक घटक तक पहुँचनी चैंद।

label-for-unresolved = `<label>` पर `for` विशेषता किसी घटक तक नि पहुँच सकी।

label-for-answer-with-authored-inputs = `<label>` पर `for` विशेषता ऐसे `<answer>` कु संदर्भ देती च जै मा इनपुट स्पष्ट रूप से लिखे गए छन; सीधे उसी इनपुट कु संदर्भ द्या।

label-for-answer-without-input = `<label>` पर `for` विशेषता ऐसे `<answer>` कु संदर्भ देती च जै मा लेबल लगाण योग्य इनपुट नि च।

label-for-must-reference-input-or-answer = `<label>` पर `for` विशेषता किसी इनपुट या किसी उत्तर कु संदर्भ देनी चैंद।

## Accessibility

accessibility-short-description-or-decorative = सुगम्यता कुण `<{ $component }>` कु या तो संक्षिप्त विवरण होण चैंद या उसे सजावटी बताया जाना चैंद।

accessibility-video-short-description = सुगम्यता कुण `<video>` कु संक्षिप्त विवरण होण चैंद।

accessibility-input-short-description-or-label = सुगम्यता कुण `<{ $component }>` कु संक्षिप्त विवरण या लेबल होण चैंद।

accessibility-answer-input-short-description-or-label = सुगम्यता कुण इनपुट बनाण वाले `<answer>` कु संक्षिप्त विवरण या लेबल होण चैंद।

accessibility-short-description-contains-math = संक्षिप्त विवरणों मा `<{ $component }>` जन गणितीय घटक नि होण चैंद। गणित तैं शब्दों मा लिखा।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } कु खंड शीर्षक पाठ कुण वैषम्य अपर्याप्त च (गहरी विधा) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम बटि कम { $threshold }:1 चैंद)।
       *[other] { $colorName } कु खंड शीर्षक पाठ कुण वैषम्य अपर्याप्त च ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम बटि कम { $threshold }:1 चैंद)।
    }

## `<circle>`

circle-through-points-non-numerical = जब बिंदुओं का संख्यात्मक मान न हों, तब { $count } बिंदुओं बटि होकर जाण वाला `<circle>` अभी उपलब्ध नि च।

circle-too-many-through-points = 3 बटि अधिक बिंदुओं बटि होकर जाण वाला वृत्त परिकलित नि किया जा सकद।

circle-overprescribed-radius-center-points = त्रिज्या, केंद्र अर गुज़रने वाले बिंदु एक साथ दिए जाण पर वृत्त परिकलित नि किया जा सकद।

circle-center-with-multiple-points = दिए गए केंद्र दगड़ि 1 बटि अधिक बिंदु बटि होकर जाण वाला वृत्त परिकलित नि किया जा सकद।

circle-radius-too-small = वृत्त परिकलित नि किया जा सकद: दोनों बिंदुओं का बीच की दूरी { $distance } च, इसलिए दी गई त्रिज्या { $radius } बहुत छोटी च।

circle-radius-with-many-points = दी गई त्रिज्या दगड़ि दो बटि अधिक बिंदुओं बटि होकर जाण वाला वृत्त नि बनाया जा सकद।

circle-invalid-center-or-through-points = वृत्त कु केंद्र या गुज़रने वाले बिंदु अमान्य छन।

circle-radius-center-with-multiple-points = दिए गए केंद्र दगड़ि 1 बटि अधिक बिंदु बटि होकर जाण वाले वृत्त की त्रिज्या परिकलित नि की जा सकदि।

circle-change-radius-non-numerical = जै वृत्त का गुज़रने वाले बिंदु संख्यात्मक नि छन, वैकी त्रिज्या नि बदली जा सकदि

circle-radius-with-points-non-numerical = संख्यात्मक मान न होण पर, दी गई त्रिज्या दगड़ि एक बटि अधिक बिंदु बटि होकर जाण वाला वृत्त नि बनाया जा सकद।

circle-change-center-non-numerical = असंख्यात्मक बिंदुओं बटि होकर जाण वाले वृत्त कु केंद्र बदलना अभी उपलब्ध नि च।

## `<function>`

function-domain-insufficient-dimensions = फलन का प्रांत की विमाएँ अपर्याप्त छन। प्रांत मा { $intervals } अंतराल छन, पर फलन मा { $inputs } इनपुट छन।

function-domain-invalid-format = फलन का प्रांत कु प्रारूप अमान्य च।

function-ignoring-non-numerical =
    { $type ->
        [maximum] फलन कु असंख्यात्मक उच्चिष्ठ छोड़ा जा रौं च।
        [minimum] फलन कु असंख्यात्मक निम्निष्ठ छोड़ा जा रौं च।
        [extremum] फलन कु असंख्यात्मक चरम मान छोड़ा जा रौं च।
        [point] फलन कु असंख्यात्मक बिंदु छोड़ा जा रौं च।
        [slope] फलन की असंख्यात्मक प्रवणता छोड़ी जा रैं च।
       *[other] फलन कु असंख्यात्मक { $type } छोड़ा जा रौं च।
    }

function-ignoring-empty =
    { $type ->
        [maximum] फलन कु रिक्त उच्चिष्ठ छोड़ा जा रौं च।
        [minimum] फलन कु रिक्त निम्निष्ठ छोड़ा जा रौं च।
        [extremum] फलन कु रिक्त चरम मान छोड़ा जा रौं च।
        [point] फलन कु रिक्त बिंदु छोड़ा जा रौं च।
       *[other] फलन कु रिक्त { $type } छोड़ा जा रौं च।
    }

function-points-too-close = फलन मा दो बिंदु बहुत पास-पास छन। फलन परिभाषित नि किया जा सकद।

function-iterates-input-output-mismatch = फलन कु पुनरावर्तन तभी संभव च जब इनपुट की संख्या आउटपुट की संख्या का बराबर हो। यै फलन मा { $inputs } इनपुट अर { $outputs } आउटपुट छन।

## `<sequence>`

sequence-invalid-length = अनुक्रम की लंबाई अमान्य च। यु ऋणेतर पूर्णांक होणि चैंद।

sequence-invalid-step = अनुक्रम कु चरण अमान्य च। { $type } प्रकार का अनुक्रम कुण यु एक संख्या होणि चैंद।

sequence-invalid-endpoint-number = संख्या अनुक्रम कु "{ $attribute }" अमान्य च। यु एक संख्या होणि चैंद।

sequence-invalid-endpoint-letters = अक्षर अनुक्रम कु "{ $attribute }" अमान्य च। यु अक्षरों कु संयोजन होण चैंद।

sequence-invalid-endpoint = अनुक्रम कु "{ $attribute }" अमान्य च।

select-from-sequence-coprime-not-numbers = संख्याएँ नि चुनी जा रहीं, इसलिए coprime छोड़ा गया

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations दिया गया च, इसलिए coprime छोड़ा गया

## Resolving a `target`

target-not-found = `<{ $source }>` कुण target अमान्य च: लक्ष्य नि मिला।

target-state-variable-not-found = `<{ $source }>` कुण target अमान्य च: `<{ $component }>` पर "{ $property }" नाम कु अवस्था चर नि मिला।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` का चर स्वतंत्र चर बटि भिन्न होण चैंद।

ode-system-duplicate-variable-names = दोहराए गए आश्रित चर नामों दगड़ि ODE का दाएँ पक्ष का फलन परिभाषित नि किए जा सकदा।

ode-system-rhs-function-error = ODE का दाएँ पक्ष कु फलन परिभाषित नि किया जा सकद। mathjs फलन बनाते समय त्रुटि हुई।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } रेखाओं का बीच कु कोण परिभाषित नि किया जा सकद

angle-invalid-through-point = `<angle>` का through मा अमान्य बिंदु च

parabola-vertex-too-many-points = दिए गए शीर्ष दगड़ि 1 बटि अधिक बिंदु बटि होकर जाण वाला परवलय अभी उपलब्ध नि च।

parabola-too-many-points = 3 बटि अधिक बिंदुओं बटि होकर जाण वाला परवलय अभी उपलब्ध नि च।

intersection-too-many-items = दो बटि अधिक वस्तुओं कु प्रतिच्छेदन अभी उपलब्ध नि च

## Other math components

ionic-compound-not-two-ions = दो आयनों का अलावा किसी अर स्थिति कुण आयनिक यौगिक अभी उपलब्ध नि च।

ionic-compound-needs-cation-and-anion = आयनिक यौगिक केवल एक धनायन अर एक ऋणायन कुण उपलब्ध च।

solve-equations-cannot-evaluate = समीकरण कु मान नि निकाला जा सका, इसलिए वु हल नि किया जा सकद: { $equation }

math-operators-operand-number-required = गणितीय संकार्य निकालते समय operandNumber देना आवश्यक च।

eigen-decomposition-failed = आव्यूह का अभिलक्षणिक मान परिकलित नि किए जा सके

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: प्राचल { $parameters } पैटर्न मा नि आते, इसलिए वे सदा रिक्त बटि मेल खाएँगे।

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" तैं समझा नि जा सका। यु none, medium, dense, या रिक्त स्थान बटि अलग की गई दो धनात्मक संख्याएँ होणि चैंद, जन grid="1 0.5"। कोई ग्रिड नि खींचा जाएगा।

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure रेंडरर मा xLabelPosition="left" समर्थित नि च; दाईं स्थिति वाला व्यवहार अपनाया जा रौं च।

prefigure-y-label-position-unsupported = `<graph>`: prefigure रेंडरर मा yLabelPosition="bottom" समर्थित नि च; ऊपरी स्थिति वाला व्यवहार अपनाया जा रौं च।

prefigure-invalid-axis-bounds = `<graph>`: prefigure रूपांतरण कुण अक्ष सीमाएँ अमान्य छन; पूर्वनिर्धारित bbox (-10,-10,10,10) अपनाया जा रौं च।

prefigure-invalid-width = `<graph>`: prefigure रूपांतरण कुण चौड़ाई अमान्य च; पूर्वनिर्धारित आरेख चौड़ाई 425 अपनाई जा रैं च।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure रूपांतरण कुण aspectRatio अमान्य च; पूर्वनिर्धारित अनुपात 1 अपनाया जा रौं च।

prefigure-grid-spacing-too-fine = `<graph>`: अक्ष सीमाओं की तुलना मा ग्रिड कु अंतराल बहुत महीन च; prefigure रेंडरर मा ग्रिड छोड़ा जा रौं च।

prefigure-annotations-not-rendered = `<graph>`: PreFigure रेंडरर कु उपयोग न होण पर टीकाएँ नि खींची जाएँगी।

field-function-wrong-num-outputs =
    `<{ $component }>` तैं ऐसा फलन चैंद जै मा { $expected ->
        [1] एक आउटपुट हो, यानी हर बिंदु पर प्रवणता y', जन `y - x`
       *[other] दो आउटपुट हों, यानी हर बिंदु पर सदिश, जन `(y, -x)`
    }, पर दिए गए फलन मा { $found } आउटपुट छन। { $alternative ->
        [none] कुछ नि खींचा जाएगा।
       *[other] वै फलन कुण `<{ $alternative }>` घटक च। कुछ नि खींचा जाएगा।
    }

field-function-attribute-ignored-with-child = `function` विशेषता पर ध्यान नि दिया जांद, क्यांकि फलन घटक का भितर भी दिया गया च; भीतर वाला ही लिया जांद च। फलन दोनों मा बटि केवल एक तरह बटि द्या।

field-variables-ignored =
    `<{ $component }>`: `variables` विशेषता वै व्यंजक का चर बताती च जो घटक का भितर सीधे लिखा गया हो। { $reason ->
        [function-child] यहाँ फलन `<function>` संतान का रूप मा दिया गया च, जो अपने चर स्वयं बताती च, इसलिए `variables` पर ध्यान नि दिया जांद।
       *[no-expression] यहाँ ऐसा कोई व्यंजक नि दिया गया, इसलिए `variables` पर ध्यान नि दिया जांद।
    }

multiple-annotations-children = `<graph>` मा एक बटि अधिक `<annotations>` संतानें मिलीं; अंतिम तैं छोड़कर सभी पर ध्यान नि दिया जाएगा।

## Referring to other components

copy-unrecognized-component-type = अपरिचित घटक प्रकार तैं विस्तारित या प्रतिलिपित नि किया जा सकद: { $type }।

copy-prop-not-found = { $component } प्रकार का घटक पर { $property } गुण नि मिला

collect-no-source = collect कुण कोई स्रोत नि मिला।

collect-invalid-component-type = `<{ $component }>` प्रकार का घटक एकत्र नि किए जा सकदा, क्यांकि यु मान्य घटक प्रकार नि च।

reference-index-unavailable = अनुक्रमांक `{ $reference }` कु संदर्भ नि दिया जा सकद

## `<callAction>`

component-action-unavailable = घटक `{ $reference }` पर { $action } नि बुलाया जा सकद

## `<dataFrame>`

data-frame-inconsistent-row-lengths = आँकड़ों कु आकार अमान्य च। पंक्तियों की लंबाई असंगत च। componentIdx :{ $componentIdx } मा मिला

data-frame-duplicate-column-names = आँकड़ों मा स्तंभ नाम दोहराए गए छन। componentIdx :{ $componentIdx } मा मिला

data-frame-missing-column-name = आँकड़ों मा एक स्तंभ नाम अनुपस्थित च। componentIdx :{ $componentIdx } मा मिला

## `<answer>` and scoring

answer-award-depends-on-own-response = यै उत्तर कु एक award स्वयं answer टैग द्वारा भेजे गए उत्तर पर आधारित च, जिससे अप्रत्याशित व्यवहार ह्वेलु।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` वाले पात्र का भितर का `<answer>` पर `maxNumAttempts` सेट करण कु कोई प्रभाव नि हूंद, क्यांकि प्रयासों की संख्या पात्र नियंत्रित करद च। `maxNumAttempts` पात्र पर सेट करा।

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` वाले किसी अन्य पात्र का भितर स्थित `sectionWideCheckWork` पात्र पर `maxNumAttempts` सेट करण कु कोई प्रभाव नि हूंद, क्यांकि प्रयासों की संख्या बाहरी पात्र नियंत्रित करद च। `maxNumAttempts` बाहरी पात्र पर सेट करा।

answer-attributes-need-symbolic-equality = symbolicEquality सेट किए बिना { $attributes } विशेषताओं कु कोई प्रभाव नि ह्वेलु।

answer-invalid-type = answer कुण प्रकार अमान्य च: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = क्यांकि घटक `<{ $component }>` कु नाम नि च, इसे मॉड्यूल विशेषता का रूप मा उपयोग नि किया जा सकद

module-attribute-name-already-defined = घटक `<{ $component } name="{ $name }">` तैं मॉड्यूल की विशेषता का रूप मा उपयोग नि किया जा सकद, क्यांकि घटक प्रकार `<module>` मा "{ $name }" विशेषता पहले बटि परिभाषित च।

conditional-content-condition-ignored = case या else संतानों वाले `<conditionalContent>` घटक पर `condition` विशेषता पर ध्यान नि दिया जांद।

slider-markers-type-mismatch = चिह्नकों कु प्रकार स्लाइडर का प्रकार बटि मेल नि खाता।

pretzel-problem-needs-statement-and-answer = अमान्य pretzel: प्रत्येक `<problem>` मा एक `<statement>` अर एक `<answer>` होण चैंद।

pretzel-circuit-first-problem-distractor = अमान्य pretzel: mode="circuit" मा पैलु `<problem>` भ्रामक विकल्प नि हो सकद।

## Attribute values

attribute-invalid-values = विशेषता `{ $attribute }` कुण मान { $values } अमान्य छन; छोड़ा जा रौं च।

attribute-must-be-references = विशेषता `{ $attribute }` कुण मान `{ $value }` अमान्य च। विशेषता `$` बटि आरंभ होण वाले संदर्भों बटि बनी होणि चैंद।

math-input-invalid-function-names = <mathInput>: { $attribute } मा अमान्य फलन नाम छोड़े गए: { $names }। प्रत्येक नाम का दृश्य भाग मा कम बटि कम 2 वर्ण (अक्षर या योजक चिह्न) होण चैंद; उसके बाद वैकल्पिक `|<mathspeak विकल्प>` प्रत्यय आ सकद च।

## Building components from the source

component-type-invalid = घटक प्रकार अमान्य च: `<{ $componentType }>`

attribute-repeated = विशेषता { $attribute } दोहराई नि जा सकदि।

attribute-invalid-for-component = `<{ $componentType }>` प्रकार का घटक कुण विशेषता "{ $attribute }" अमान्य च।

## Style definition contrast

style-definition-insufficient-contrast =
    शैली परिभाषा { $styleNumber } मा { $context ->
        [text-on-background] पृष्ठभूमि रंग की तुलना मा पाठ रंग
        [high-contrast] कैनवास की तुलना मा उच्च वैषम्य रंग
        [line] कैनवास की तुलना मा रेखा रंग
        [marker] कैनवास की तुलना मा चिह्नक रंग
       *[text-on-canvas] कैनवास की तुलना मा पाठ रंग
    } कुण वैषम्य अपर्याप्त च{ $mode ->
        [dark] { " (गहरी विधा)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम बटि कम { $threshold }:1 चैंद)।

style-definition-dark-mode-text-background-contrast =
    यद्यपि शैली परिभाषा { $styleNumber } ने हल्की विधा कुण पर्याप्त वैषम्य वाले रंग दिए छन, इन मानों बटि व्युत्पन्न गहरी विधा का रंगों मा पाठ रंग अर पृष्ठभूमि रंग का बीच वैषम्य अपर्याप्त च ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम बटि कम { $threshold }:1 चैंद)। { $suggestion ->
        [available] गहरी विधा मा पर्याप्त वैषम्य सुनिश्चित करण कुण या तो हल्की विधा कु वैषम्य बढ़ावा (जन { $lightAttribute }="{ $lightColor }" सेट करा) या गहरी विधा कु रंग अधिरोहित करा (जन { $darkAttribute }="{ $darkColor }" सेट करा)।
       *[none] गहरी विधा मा पर्याप्त वैषम्य सुनिश्चित करण कुण हल्की विधा कु वैषम्य बढ़ावा या व्युत्पन्न रंगों तैं textColorDarkMode अर/या backgroundColorDarkMode बटि अधिरोहित करा।
    }

style-definition-dark-mode-text-canvas-contrast =
    यद्यपि शैली परिभाषा { $styleNumber } ने हल्की विधा कुण पर्याप्त वैषम्य वाला पाठ रंग दिया च, यै मान बटि व्युत्पन्न गहरी विधा का पाठ रंग कु कैनवास की तुलना मा वैषम्य अपर्याप्त च ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम बटि कम { $threshold }:1 चैंद)। { $suggestion ->
        [available] गहरी विधा मा पर्याप्त वैषम्य सुनिश्चित करण कुण या तो हल्की विधा कु वैषम्य बढ़ावा (जन textColor="{ $lightColor }" सेट करा) या गहरी विधा कु रंग अधिरोहित करा (जन textColorDarkMode="{ $darkColor }" सेट करा)।
       *[none] गहरी विधा मा पर्याप्त वैषम्य सुनिश्चित करण कुण हल्की विधा कु वैषम्य बढ़ावा या व्युत्पन्न रंग तैं textColorDarkMode बटि अधिरोहित करा।
    }

section-multiple-style-palettes = एक खंड केवल एक <stylePalette> चुन सकद च; अंतिम कु उपयोग किया जा रौं च।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } का अद्वितीय संस्करण निर्धारित नि किए जा सकदा, क्यांकि numToSelect ऋणेतर पूर्णांक नि च।

variant-num-to-select-not-constant-number = { $component } का अद्वितीय संस्करण निर्धारित नि किए जा सकदा, क्यांकि numToSelect अचर नि च।

variant-with-replacement-not-constant-boolean = { $component } का अद्वितीय संस्करण निर्धारित नि किए जा सकदा, क्यांकि withReplacement अचर बूलीय मान नि च।

variant-select-weight-disables-unique = जु कोई विकल्प selectWeight या selectForVariants देता च तो select का अद्वितीय संस्करण निष्क्रिय हो जांदा छन

variant-coprime-undetermined = { $component } का अद्वितीय संस्करण निर्धारित नि किए जा सकदा, क्यांकि यु तय नि हो सका कि coprime सदा असत्य च।

variant-attribute-not-constant = { $component } का अद्वितीय संस्करण निर्धारित नि किए जा सकदा, क्यांकि { $attribute } अचर नि च।

variant-attribute-not-number = { $component } का अद्वितीय संस्करण निर्धारित नि किए जा सकदा, क्यांकि { $attribute } संख्या नि च।

variant-attribute-wrong-type-for-sequence =
    { $type } प्रकार का { $component } का अद्वितीय संस्करण निर्धारित नि किए जा सकदा, क्यांकि { $attribute } { $expected ->
        [letters-combination] अक्षरों कु संयोजन
        [math-expression] मान्य गणितीय व्यंजक
        [integer] पूर्णांक
       *[number] संख्या
    } नि च।

variant-length-not-integer = { $component } का अद्वितीय संस्करण निर्धारित नि किए जा सकदा, क्यांकि length पूर्णांक नि च।

variant-sort-not-implemented = sort वाले { $component } का अद्वितीय संस्करण अभी उपलब्ध नि छन

variant-exclude-combinations-not-implemented = excludeCombinations वाले { $component } का अद्वितीय संस्करण अभी उपलब्ध नि छन

variant-math-exclude-not-implemented = exclude वाले math प्रकार का { $component } का अद्वितीय संस्करण अभी उपलब्ध नि छन

variant-non-constant-exclude-not-implemented = अनचर exclude वाले { $component } का अद्वितीय संस्करण अभी उपलब्ध नि छन

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: आलेख का prefigure रेंडरर मा समर्थित नि; वंशज छोड़ा गया।

prefigure-descendant-invalid-geometry = { $subject }: ज्यामिति असीमित या अपूर्ण च; वंशज छोड़ा गया।

prefigure-curve-label-omitted = { $subject }: रूपांतरित वक्र तत्वों पर लेबल समर्थित नि; लेबल छोड़ा गया।

prefigure-curve-unsupported-definition-type = { $subject }: वक्र फलन परिभाषा प्रकार '{ $definitionType }' समर्थित नि; वंशज छोड़ा गया।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves पर flipFunctions विशेषता समर्थित नि; वंशज छोड़ा गया।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves केवल सूत्र प्रकार का संतान फलनों कु समर्थन करद च; वंशज छोड़ा गया।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] रेखा कुल का लेबल
       *[point] बिंदु लेबल
    } कुण labelPosition '{ $labelPosition }' समर्थित नि; PreFigure की पूर्वनिर्धारित संरेखण अपनाई जा रैं च।

prefigure-fill-style-unsupported = { $subject }: भराव शैली '{ $fillStyle }' PreFigure मा समर्थित नि; ठोस भराव अपनाया जा रौं च।

prefigure-line-style-unknown = { $subject }: अज्ञात रेखा शैली '{ $lineStyle }' PreFigure का आउटपुट बटि छोड़ी गई।

prefigure-marker-style-mapped-to-diamond = { $subject }: चिह्नक शैली '{ $markerStyle }' PreFigure की 'diamond' शैली पर मानचित्रित की गई।

prefigure-marker-style-unsupported = { $subject }: चिह्नक शैली '{ $markerStyle }' PreFigure मा समर्थित नि; पूर्वनिर्धारित शैली अपनाई जा रैं च।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` अमान्य; लक्ष्य निर्धारित नि हो सका। टीका छोड़ी गई।

annotation-ref-multiple-targets = `<annotation>`: `ref` बटि कई लक्ष्य निकले; पैलु लक्ष्य लिया जा रौं च।

annotation-ref-outside-graph = `<annotation>`: `ref` अमान्य; लक्ष्य उसे समेटे आलेख का बाहर च। टीका छोड़ी गई।

annotation-ref-unsupported-target = `<annotation>`: `ref` अमान्य; prefigure रूपांतरण मा लक्ष्य समर्थित आलेखीय वस्तु नि च। टीका छोड़ी गई।

annotation-text-missing = `<annotation>`: `text` अनुपस्थित या रिक्त; रिक्त पाठ दिया जा रौं च।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] चक्रीय निर्भरता कु पता चला।
       *[other] `<{ $componentType }>` घटक बटि जुड़ी चक्रीय निर्भरता कु पता चला।
    }

reference-no-referent = यै संदर्भ कु कोई लक्ष्य नि मिला: `{ $reference }`

reference-multiple-referents = यै संदर्भ का कई लक्ष्य मिले: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` की विशेषता { $attribute } कु प्रारूप अमान्य च।

children-invalid = `<{ $componentType }>` की संतानें अमान्य छन: अमान्य संतानें मिलीं: { $children }

## Falling back to a default

attribute-value-invalid-using-default = विशेषता `{ $attribute }` कुण मान `{ $value }` अमान्य च; मान `{ $default }` कु उपयोग किया जा रौं च

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML संस्करण { $version } नि मिला।
       *[other] DoenetML संस्करण { $version } नि मिला। संस्करण { $fallback } पर लौटा जा रौं च
    }

## Reading the DoenetML

parse-invalid-doenetml = अमान्य DoenetML: { $content }

parse-tag-missing-close-tag = अमान्य DoenetML: टैग `{ $tag }` कु समापन टैग नि च। स्वतः बंद होण वाला टैग या `</{ $tagName }>` टैग अपेक्षित छौ।

parse-tag-error = अमान्य DoenetML: टैग `<{ $tagName }>` मा त्रुटि

parse-attribute-missing-value = अमान्य DoenetML: विशेषता `{ $attribute }` कु मान अनुपस्थित प्रतीत हूंद च।

parse-attribute-invalid = अमान्य DoenetML: विशेषता `{ $attribute }` अमान्य च

parse-attribute-value-invalid = अमान्य DoenetML: विशेषता मान `{ $value }` अमान्य च

parse-attribute-value-quote-mismatch = अमान्य DoenetML: विशेषता मान `{ $value }` अमान्य च। उद्धरण चिह्न मेल नि खाते। एक `{ $quote }` अनुपस्थित प्रतीत हूंद च

parse-open-tag-name-missing = अमान्य DoenetML: बिना नाम कु टैग मिला, जन `<`

parse-tag-not-closed = अमान्य DoenetML: टैग `{ $tag }` बंद नि हुआ (एक `>` अनुपस्थित प्रतीत हूंद च)।

parse-self-closing-tag-name-missing = अमान्य DoenetML: बिना नाम कु टैग मिला `<{ $content }>`

parse-self-closing-tag-not-closed = अमान्य DoenetML: टैग `{ $tag }` बंद नि हुआ (`/>` अनुपस्थित प्रतीत हूंद च)।

parse-tag-invalid-attributes = अमान्य DoenetML: टैग `{ $tag }` मान्य नि च। यैकी विशेषताएँ ग़लत हो सकदि छन।

parse-close-tag-name-missing = अमान्य DoenetML: बिना नाम कु समापन टैग मिला, जन `</`

parse-attribute-value-unquoted = विशेषता मान उद्धरण चिह्नों मा होण चैंद: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = अमान्य DoenetML: समापन टैग `{ $tag }` मिला, पर वै बटि मेल खाता आरंभ टैग नि च

parse-close-tag-mismatched = अमान्य DoenetML: समापन टैग मेल नि खाता। `</{ $expected }>` अपेक्षित छौ। `{ $found }` मिला

parser-node-unconvertible = नोड { $node } तैं Dast नोड मा परिवर्तित नि किया जा सका।

## Names

name-attribute-invalid =
    विशेषता name='{ $name }' अमान्य च। { $reason ->
        [characters] नामों मा केवल अक्षर, अंक, अधोरेखा या योजक चिह्न हो सकदा छन।
       *[start] नाम अक्षर बटि आरंभ होण चैंद।
    }

component-name-invalid-start = घटक नाम "{ $name }" अमान्य च। नाम अक्षर बटि आरंभ होण चैंद।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched प्रकार का answer मा video विशेषता होणि चैंद

answer-video-watched-video-not-reference = videoWatched प्रकार का answer की video विशेषता एक संदर्भ होणि चैंद

answer-name-not-single-text = answer की name विशेषता मा केवल एक पाठ संतान होणि चैंद

## Referencing another document

external-doenetml-recursion-limit = पुनरावर्तन का बहुत अधिक स्तरों का कारण बाहरी DoenetML प्राप्त नि किया जा सका। कहीं चक्रीय संदर्भ तो नि?

external-doenetml-unavailable = { $attribute }="{ $uri }" बटि DoenetML प्राप्त नि किया जा सका

external-doenetml-type-mismatch = { $attribute }="{ $uri }" बटि प्राप्त DoenetML अमान्य च: यु घटक प्रकार "{ $componentType }" बटि मेल नि खाया

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` अप्रचलित च; यैका बदला `{ $to }` कु उपयोग करा।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` अप्रचलित च; यैका बदला `{ $to }` कु उपयोग करा।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` अप्रचलित च अर छोड़ दी गई, क्यांकि `{ $to }` भी दिया गया च।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` अप्रचलित च अर छोड़ दी गई, क्यांकि `{ $to }` भी दिया गया च।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` अप्रचलित च अर छोड़ दी गई।

deprecated-attribute-to-child = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` अप्रचलित च; यैका बदला `<{ $child }>` संतान लिखा।

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` कु मान `{ $value }` अप्रचलित च; यैका बदला `{ $to }` कु उपयोग करा।


## Language coverage

pluralize-english-only = `<pluralize>` केवल अंग्रेज़ी कु बहुवचन बना सकद च, इसलिए { $locale } मा लिखे दस्तावेज़ मा वैकु पाठ अपरिवर्तित रहता च। बहुवचन रूप सीधे लिखा, या `pluralForm` विशेषता बटि द्या।


## Checking against the schema

schema-element-unrecognized = तत्व `<{ $tag }>` कोई परिचित Doenet तत्व नि च।

schema-element-not-allowed-at-root = तत्व `<{ $tag }>` दस्तावेज़ का मूल मा मान्य नि च।

schema-element-not-allowed-inside = तत्व `<{ $tag }>` `<{ $parent }>` का भितर मान्य नि च।

schema-attribute-unrecognized = तत्व `<{ $tag }>` मा `{ $attribute }` नाम की कोई विशेषता नि च।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] तत्व `<{ $tag }>` की विशेषता `{ $attribute }` एक सूची होणि चैंद जिसकी हर मद इनमें बटि एक हो: { $allowed }
       *[other] तत्व `<{ $tag }>` की विशेषता `{ $attribute }` इनमें बटि एक होणि चैंद: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select कुण संस्करण नाम अमान्य च। संस्करण नाम { $variantName } { $numOptions } विकल्पों मा आता च, पर चुनण की संख्या { $numToSelect } च।

select-variant-name-without-options = select कुण संस्करण दिए गए छन, पर संभावित संस्करण नाम कुण कोई विकल्प नि च: { $variantName }।

select-variant-name-not-possible = select कुण दिया गया संस्करण नाम { $variantName } संभावित संस्करण नाम नि च।

select-too-few-options = केवल { $numOptions } घटकों मा बटि { $numToSelect } नि चुने जा सकदा।

select-from-sequence-too-few-values = { $length } लंबाई का अनुक्रम बटि { $numToSelect } मान नि चुने जा सकदा।

select-from-sequence-indices-count-mismatch = select कुण दिए गए अनुक्रमांकों की संख्या चुनण की संख्या बटि मेल खानी चैंद

select-from-sequence-indices-not-integers = select कुण दिए गए सभी अनुक्रमांक पूर्णांक होण चैंद

select-from-sequence-index-excluded = selectfromsequence कुण दिया गया अनुक्रमांक बहिष्कृत छौ

select-from-sequence-indices-excluded-combination = selectfromsequence कुण दिए गए अनुक्रमांक बहिष्कृत संयोजन बनाते छा

select-from-sequence-coprime-not-positive-integers = धनात्मक पूर्णांक नि चुने जा रैं, इसलिए सहअभाज्य संयोजन नि चुने जा सकदा।

select-from-sequence-coprime-common-factor = सहअभाज्य संख्याएँ नि चुनी जा सकदीं। सभी संभावित मानों मा एक उभयनिष्ठ गुणनखंड च। (दिए गए "from" या "to" मान "step" का सहअभाज्य होण चैंद।)

select-from-sequence-coprime-single-number = 1 बटि भिन्न किसी एकल संख्या बटि सहअभाज्य संयोजन नि चुने जा सकदा।

select-from-sequence-excluded-too-many-combinations = selectFromSequence मा 70% बटि अधिक संयोजन बहिष्कृत किए गए

select-from-sequence-coprime-none-found = सहअभाज्य संख्याएँ नि चुनी जा सकीं। सभी संभावित मानों मा एक उभयनिष्ठ गुणनखंड च।

select-from-sequence-too-few-unique-values = { $numPossibleValues } लंबाई का अनुक्रम बटि { $numToSelect } भिन्न मान नि चुने जा सकदा

select-prime-numbers-too-few-values = { $numValues } लंबाई की अभाज्य सूची बटि { $numToSelect } मान नि चुने जा सकदा

select-prime-numbers-values-count-mismatch = select कुण दिए गए मानों की संख्या चुनण की संख्या बटि मेल खानी चैंद

select-prime-numbers-values-not-prime = select prime number कुण दिए गए सभी मान अभाज्य सूची मा होण चैंद

select-prime-numbers-values-excluded-combination = selectPrimeNumbers कुण दिए गए मान बहिष्कृत संयोजन बनाते छा

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers मा 70% बटि अधिक संयोजन बहिष्कृत किए गए

select-random-combination-fluke = अत्यंत असंभव संयोग बटि यादृच्छिक मानों कु संयोजन नि चुना जा सका

select-random-value-fluke = अत्यंत असंभव संयोग बटि यादृच्छिक मान नि चुना जा सका

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] यु `<{ $component }>` नि दिखाया जा रौं, क्यांकि यु गणित का भितर च अर `inline` नि च। `inline` जोड़ा, ताकि यु ड्रॉप-डाउन सूची बन जाए, जो व्यंजक का भितर समा जांदि च।
        [expanded] यु `<{ $component }>` नि दिखाया जा रौं, क्यांकि यु गणित का भितर च अर `expanded` च। `expanded` हटावा; बहु-पंक्ति बक्सा व्यंजक का भितर नि समाता।
        [on-graph] यु `<{ $component }>` नि दिखाया जा रौं, क्यांकि यु आलेख पर खींचे गए गणित का भितर च, जै मा इनपुट कुण जगह नि च।
       *[relative-width] यु `<{ $component }>` नि दिखाया जा रौं, क्यांकि यु गणित का भितर च अर यैकी चौड़ाई सापेक्ष च। चौड़ाई निरपेक्ष इकाइयों मा द्या, जन `px`।
    }
