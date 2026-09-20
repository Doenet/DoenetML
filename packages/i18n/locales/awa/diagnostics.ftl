# Awadhi (अवधी) diagnostics: the warnings and errors the worker raises and the
# reader is shown. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth. Selected by `uiLocale`, not by the language the document was
# written in.
#
# Message ids are never translated — only the text to the right of `=`. Neither
# are the DoenetML identifiers quoted inside these sentences: `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `maxNumAttempts`,
# `selectFromSequence` and every tag and attribute name like them are part of
# the language an author writes, not prose, and stay in English exactly as
# written. So does the `[deprecation]` marker, which is a label rather than a
# word, and anything quoted back from the author's own source.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Devanagari with Latin digits**, as in every file of this catalog.
#
# **The technical vocabulary is Hindi and Sanskrit and is declared as such** —
# घटक, विशेषता, चर, विमा, आव्यूह, संदर्भ, फलन, समीकरण, अनुक्रम, वैषम्य.
# Awadhi is not a language of instruction anywhere, so these are the words an
# Awadhi reader has met; inventing Awadhi equivalents would put words in front
# of a reader that nobody uses.
#
# **What is Awadhi is the frame**, and it carries the whole file:
#
#   «अहै» / «अहैं»            the copula
#   «नाहीं»                   the negator
#   «नाहीं कीन जाइ सकत»       *cannot be done*
#   «छोड़ा जात अहै»           *ignoring*
#   «पर ध्यान नाहीं दीन जात»  *is ignored*
#   «होय के चाही»             *must be*
#   «काहे से कि»              *because*
#   «अबहीं उपलब्ध नाहीं अहै»  *has not been implemented*
#   «क»                       the genitive, beside the borrowed «के»
#   «खातिर» / «अउर» / «या»    *for* / *and* / *or*
#   «जदि» / «जइसे» / «एह»     *if* / *like* / *this*, oblique
#
# A sentence that has slipped back into «है», «नहीं», «क्योंकि» or «के लिए»
# is a mistake to fix rather than a stylistic choice. This is a **framed**
# catalog: the sentences are Awadhi, the nouns inside them are declared Hindi,
# and a speaker should expect to correct the sentences as often as the words.
#
# **No plural branches.** CLDR has no plural data for `awa`, so every
# `[one]`/`[other]` fork English writes over a count is collapsed here; most
# become a plain message, since an Awadhi noun is unmarked after a numeral.
# The one exception is `field-function-wrong-num-outputs`, where English is
# not counting but distinguishing a one-output field from a two-output one;
# that fork is kept as the numeric literal `[1]`, which Fluent matches against
# the number itself rather than against a plural category.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = दुइ सिरा दीन जाय पर { $attributes } पर ध्यान नाहीं दीन जात

line-segment-attributes-ignored-with-endpoint-and-midpoint = सिरा अउर मध्यबिंदु दुनौ दीन जाय पर { $attributes } पर ध्यान नाहीं दीन जात

line-segment-midpoint-offset-without-midpoint = मध्यबिंदु क बिना midpointOffset क कउनो असर नाहीं होत

## `<line>`

line-points-undetermined-dimensions = अइसे बिंदुन से होइके जाय वाली रेखा जिनकी विमा तय नाहीं अहै।

line-points-too-few-dimensions = रेखा का कम से कम दुइ विमा वाले बिंदुन से होइके जाय के चाही।

line-points-depend-on-variables = रेखा ओह बिंदुन से होइके जात अहै जउन चरन पर निर्भर अहैं: { $variables }।

line-equation-invalid-format = चर { $variable1 } अउर { $variable2 } मा रेखा क समीकरण क प्रारूप अमान्य अहै।

## `<ray>`

ray-overprescribed-through = किरण एक्के संग through, endpoint अउर direction से तय अहै। दीन गा through छोड़ा जात अहै।

ray-dimension-mismatch = किरण मा numDimensions मेल नाहीं खात।

## `<vector>`

vector-overprescribed-head = सदिश एक्के संग head, tail अउर displacement से तय अहै। दीन गा head छोड़ा जात अहै।

vector-dimension-mismatch = सदिश मा numDimensions मेल नाहीं खात।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` क ओर खींचा नाहीं जाइ सकत, काहे से कि ओह मा nearestPoint अवस्था चर नाहीं अहै।

constrain-to-without-nearest-point = `<{ $component }>` तक सीमित नाहीं कीन जाइ सकत, काहे से कि ओह मा nearestPoint अवस्था चर नाहीं अहै।

constrain-to-interior-without-nearest-point = `<{ $component }>` क भीतरी भाग तक सीमित नाहीं कीन जाइ सकत, काहे से कि ओह मा nearestPoint अवस्था चर नाहीं अहै।

## `<choiceInput>`

choice-input-label-position-ignored = अंतःपंक्ति न होय वाले choiceInput खातिर labelPosition पर ध्यान नाहीं दीन जात

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput खातिर दीन गा indices छोड़ा जात अहै, काहे से कि indices क संख्या choice संतानन क संख्या से मेल नाहीं खात।

pretzel-indices-count-mismatch = problem खातिर दीन गा indices छोड़ा जात अहै, काहे से कि indices क संख्या problem संतानन क संख्या से मेल नाहीं खात।

shuffle-indices-count-mismatch = shuffle खातिर दीन गा indices छोड़ा जात अहै, काहे से कि indices क संख्या घटकन क संख्या से मेल नाहीं खात।

indices-ignored-out-of-range = { $component } खातिर दीन गा indices छोड़ा जात अहै, काहे से कि कुछ अनुक्रमांक परिसर से बाहर अहैं।

pretzel-indices-repeated = pretzel खातिर दीन गा indices छोड़ा जात अहै, काहे से कि कुछ अनुक्रमांक दोहरावल गयल अहैं।

pretzel-circuit-first-index = circuit विधा मा pretzel खातिर दीन गा indices छोड़ा जात अहै, काहे से कि पहिला अनुक्रमांक 1 होय के चाही।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` का पाठ संतानन क संग काम करै खातिर `type` विशेषता देय के चाही।

invalid-type-defaulting-to-math = { $component } घटक खातिर प्रकार { $type } अमान्य अहै। ई math, text, number या boolean मा से एक होय के चाही। math क उपयोग कीन जात अहै।

string-not-valid-component-to-arrange = पाठ "{ $value }" { $component } खातिर मान्य घटक नाहीं अहै। छोड़ा जात अहै।

## Types and variables

invalid-type-defaulting-to-number = प्रकार { $type } अमान्य अहै; प्रकार number कीन जात अहै।

invalid-variable-value = चर क मान अमान्य अहै: `{ $value }`

## Variants

variant-index-must-be-number = संस्करण अनुक्रमांक { $index } संख्या होय के चाही

variant-index-must-be-integer = संस्करण अनुक्रमांक { $index } पूर्णांक होय के चाही

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` निरपेक्ष माप खातिर अबहीं उपलब्ध नाहीं अहै। चौड़ाई सापेक्ष कीन जात अहै।

side-by-side-absolute-margins = `<{ $component }>` निरपेक्ष माप खातिर अबहीं उपलब्ध नाहीं अहै। हाशिया सापेक्ष कीन जात अहै।

side-by-side-no-block-child = अमान्य `<{ $component }>`: एह मा कम से कम एक खंड संतान होय के चाही।

## `<label>`

label-for-ignored-on-graphical = आलेखीय `<label>` पर `for` विशेषता पर ध्यान नाहीं दीन जात।

label-for-must-resolve-to-one = `<label>` पर `for` विशेषता ठीक एक्के घटक तक पहुँचै के चाही।

label-for-unresolved = `<label>` पर `for` विशेषता कउनो घटक तक नाहीं पहुँच पाई।

label-for-answer-with-authored-inputs = `<label>` पर `for` विशेषता अइसे `<answer>` क संदर्भ देत अहै जेह मा इनपुट खुद लिखा गा अहै; सीधे ओहि इनपुट क संदर्भ दौ।

label-for-answer-without-input = `<label>` पर `for` विशेषता अइसे `<answer>` क संदर्भ देत अहै जेह मा लेबल लगावै लायक इनपुट नाहीं अहै।

label-for-must-reference-input-or-answer = `<label>` पर `for` विशेषता कउनो इनपुट या कउनो जवाब क संदर्भ देय के चाही।

## Accessibility

accessibility-short-description-or-decorative = सुगम्यता खातिर `<{ $component }>` क या त संछिप्त विवरण होय के चाही या ओका सजावटी बतावा जाय के चाही।

accessibility-video-short-description = सुगम्यता खातिर `<video>` क संछिप्त विवरण होय के चाही।

accessibility-input-short-description-or-label = सुगम्यता खातिर `<{ $component }>` क संछिप्त विवरण या लेबल होय के चाही।

accessibility-answer-input-short-description-or-label = सुगम्यता खातिर इनपुट बनावै वाले `<answer>` क संछिप्त विवरण या लेबल होय के चाही।

accessibility-short-description-contains-math = संछिप्त विवरण मा `<{ $component }>` जइसे गणितीय घटक नाहीं होय के चाही। गणित का सब्दन मा लिखौ।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } क खंड सीर्षक क पाठ खातिर वैषम्य अपर्याप्त अहै (गहिर विधा) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाही)।
       *[other] { $colorName } क खंड सीर्षक क पाठ खातिर वैषम्य अपर्याप्त अहै ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाही)।
    }

## `<circle>`

circle-through-points-non-numerical = जब बिंदुन क संख्यात्मक मान न होंय, तब { $count } बिंदुन से होइके जाय वाला `<circle>` अबहीं उपलब्ध नाहीं अहै।

circle-too-many-through-points = 3 से जादा बिंदुन से होइके जाय वाला वृत्त नाहीं निकाला जाइ सकत।

circle-overprescribed-radius-center-points = त्रिज्या, केंद्र अउर गुजरै वाले बिंदु एक्के संग दीन जाय पर वृत्त नाहीं निकाला जाइ सकत।

circle-center-with-multiple-points = दीन गा केंद्र क संग 1 से जादा बिंदु से होइके जाय वाला वृत्त नाहीं निकाला जाइ सकत।

circle-radius-too-small = वृत्त नाहीं निकाला जाइ सकत: दुनौ बिंदुन क बीच क दूरी { $distance } अहै, एह से दीन गयल त्रिज्या { $radius } बहुत छोट अहै।

circle-radius-with-many-points = दीन गयल त्रिज्या क संग दुइ से जादा बिंदुन से होइके जाय वाला वृत्त नाहीं बनावा जाइ सकत।

circle-invalid-center-or-through-points = वृत्त क केंद्र या गुजरै वाले बिंदु अमान्य अहैं।

circle-radius-center-with-multiple-points = दीन गा केंद्र क संग 1 से जादा बिंदु से होइके जाय वाले वृत्त क त्रिज्या नाहीं निकाली जाइ सकत।

circle-change-radius-non-numerical = जौन वृत्त क गुजरै वाले बिंदु संख्यात्मक नाहीं अहैं, ओकर त्रिज्या नाहीं बदली जाइ सकत

circle-radius-with-points-non-numerical = संख्यात्मक मान न होय पर, दीन गयल त्रिज्या क संग एक से जादा बिंदु से होइके जाय वाला वृत्त नाहीं बनावा जाइ सकत।

circle-change-center-non-numerical = असंख्यात्मक बिंदुन से होइके जाय वाले वृत्त क केंद्र बदलब अबहीं उपलब्ध नाहीं अहै।

## `<function>`

function-domain-insufficient-dimensions = फलन क प्रांत क विमा अपर्याप्त अहैं। प्रांत मा { $intervals } अंतराल अहैं, बाकी फलन मा { $inputs } इनपुट अहैं।

function-domain-invalid-format = फलन क प्रांत क प्रारूप अमान्य अहै।

function-ignoring-non-numerical =
    { $type ->
        [maximum] फलन क असंख्यात्मक उच्चिष्ठ छोड़ा जात अहै।
        [minimum] फलन क असंख्यात्मक निम्निष्ठ छोड़ा जात अहै।
        [extremum] फलन क असंख्यात्मक चरम मान छोड़ा जात अहै।
        [point] फलन क असंख्यात्मक बिंदु छोड़ा जात अहै।
        [slope] फलन क असंख्यात्मक प्रवणता छोड़ी जात अहै।
       *[other] फलन क असंख्यात्मक { $type } छोड़ा जात अहै।
    }

function-ignoring-empty =
    { $type ->
        [maximum] फलन क खाली उच्चिष्ठ छोड़ा जात अहै।
        [minimum] फलन क खाली निम्निष्ठ छोड़ा जात अहै।
        [extremum] फलन क खाली चरम मान छोड़ा जात अहै।
        [point] फलन क खाली बिंदु छोड़ा जात अहै।
       *[other] फलन क खाली { $type } छोड़ा जात अहै।
    }

function-points-too-close = फलन मा दुइ बिंदु बहुत पास-पास अहैं। फलन परिभाषित नाहीं कीन जाइ सकत।

function-iterates-input-output-mismatch = फलन क पुनरावर्तन तबहीं संभव अहै जब इनपुट क संख्या आउटपुट क संख्या क बराबर होय। एह फलन मा { $inputs } इनपुट अउर { $outputs } आउटपुट अहैं।

## `<sequence>`

sequence-invalid-length = अनुक्रम क लंबाई अमान्य अहै। ई ऋणेतर पूर्णांक होय के चाही।

sequence-invalid-step = अनुक्रम क चरण अमान्य अहै। { $type } प्रकार क अनुक्रम खातिर ई संख्या होय के चाही।

sequence-invalid-endpoint-number = संख्या अनुक्रम क "{ $attribute }" अमान्य अहै। ई संख्या होय के चाही।

sequence-invalid-endpoint-letters = अच्छर अनुक्रम क "{ $attribute }" अमान्य अहै। ई अच्छरन क संयोजन होय के चाही।

sequence-invalid-endpoint = अनुक्रम क "{ $attribute }" अमान्य अहै।

select-from-sequence-coprime-not-numbers = संख्या नाहीं चुनी जात, एह से coprime छोड़ा गा

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations दीन गा अहै, एह से coprime छोड़ा गा

## Resolving a `target`

target-not-found = `<{ $source }>` खातिर target अमान्य अहै: लक्ष्य नाहीं मिला।

target-state-variable-not-found = `<{ $source }>` खातिर target अमान्य अहै: `<{ $component }>` पर "{ $property }" नाम क अवस्था चर नाहीं मिला।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` क चर स्वतंत्र चर से अलग होय के चाही।

ode-system-duplicate-variable-names = दोहरावल गयल आश्रित चर नामन क संग ODE क दाहिन पच्छ क फलन परिभाषित नाहीं कीन जाइ सकत।

ode-system-rhs-function-error = ODE क दाहिन पच्छ क फलन परिभाषित नाहीं कीन जाइ सकत। mathjs फलन बनावत समय त्रुटि भई।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } रेखन क बीच क कोण परिभाषित नाहीं कीन जाइ सकत

angle-invalid-through-point = `<angle>` क through मा अमान्य बिंदु अहै

parabola-vertex-too-many-points = दीन गा सीर्ष क संग 1 से जादा बिंदु से होइके जाय वाला परवलय अबहीं उपलब्ध नाहीं अहै।

parabola-too-many-points = 3 से जादा बिंदुन से होइके जाय वाला परवलय अबहीं उपलब्ध नाहीं अहै।

intersection-too-many-items = दुइ से जादा वस्तुन क प्रतिच्छेदन अबहीं उपलब्ध नाहीं अहै

## Other math components

ionic-compound-not-two-ions = दुइ आयनन क अलावा कउनो अउर हालत खातिर आयनिक यौगिक अबहीं उपलब्ध नाहीं अहै।

ionic-compound-needs-cation-and-anion = आयनिक यौगिक खाली एक धनायन अउर एक ऋणायन खातिर उपलब्ध अहै।

solve-equations-cannot-evaluate = समीकरण क मान नाहीं निकाला जाइ सका, एह से ऊ हल नाहीं कीन जाइ सकत: { $equation }

math-operators-operand-number-required = गणितीय संकार्य निकालत समय operandNumber देब जरूरी अहै।

eigen-decomposition-failed = आव्यूह क अभिलच्छनिक मान नाहीं निकाले जाइ सके

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: प्राचल { $parameters } पैटर्न मा नाहीं आवत, एह से ऊ सदा खाली से मेल खाई।

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" समझा नाहीं जाइ सका। ई none, medium, dense, या खाली जगह से अलगावल दुइ धनात्मक संख्या होय के चाही, जइसे grid="1 0.5"। कउनो ग्रिड नाहीं खींचा जाई।

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` का अइसा फलन चाही जेह मा { $expected ->
        [1] एक आउटपुट होय, हर बिंदु पर प्रवणता y', जइसे `y - x`
       *[other] दुइ आउटपुट होंय, हर बिंदु पर सदिश, जइसे `(y, -x)`
    }, बाकी जौन फलन दीन गा ओह मा { $found } आउटपुट अहैं। { $alternative ->
        [none] कुछ नाहीं खींचा जाई।
       *[other] ओह फलन खातिर `<{ $alternative }>` घटक अहै। कुछ नाहीं खींचा जाई।
    }

field-function-attribute-ignored-with-child = `function` विशेषता पर ध्यान नाहीं दीन जात, काहे से कि फलन घटक क भीतर भी दीन गा अहै; भीतर वाला लीन जात अहै। फलन दुनौ मा से खाली एक्के तरह से दौ।

field-variables-ignored =
    `<{ $component }>`: `variables` विशेषता ओह व्यंजक क चरन क नाम देत अहै जौन सीधे घटक क भीतर लिखा गा अहै। { $reason ->
        [function-child] इहाँ फलन `<function>` संतान क रूप मा दीन गा अहै, जौन आपन चर खुद बतावत अहै, एह से `variables` छोड़ा जात अहै।
       *[no-expression] इहाँ अइसा कउनो व्यंजक नाहीं दीन गा, एह से `variables` छोड़ा जात अहै।
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure रेंडरर मा xLabelPosition="left" समर्थित नाहीं अहै; दाहिन ओर वाला बरताव लीन जात अहै।

prefigure-y-label-position-unsupported = `<graph>`: prefigure रेंडरर मा yLabelPosition="bottom" समर्थित नाहीं अहै; ऊपर वाला बरताव लीन जात अहै।

prefigure-invalid-axis-bounds = `<graph>`: prefigure रूपांतरण खातिर अच्छ सीमा अमान्य अहै; पूर्वनिर्धारित bbox (-10,-10,10,10) लीन जात अहै।

prefigure-invalid-width = `<graph>`: prefigure रूपांतरण खातिर चौड़ाई अमान्य अहै; पूर्वनिर्धारित आरेख चौड़ाई 425 लीन जात अहै।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure रूपांतरण खातिर aspectRatio अमान्य अहै; पूर्वनिर्धारित अनुपात 1 लीन जात अहै।

prefigure-grid-spacing-too-fine = `<graph>`: अच्छ सीमा क हिसाब से ग्रिड क अंतराल बहुत महीन अहै; prefigure रेंडरर मा ग्रिड छोड़ा जात अहै।

prefigure-annotations-not-rendered = `<graph>`: PreFigure रेंडरर क उपयोग न होय पर टीका नाहीं खींची जाई।

multiple-annotations-children = `<graph>` मा एक से जादा `<annotations>` संतान मिलीं; अंतिम का छोड़िके सब पर ध्यान नाहीं दीन जाई।

## Referring to other components

copy-unrecognized-component-type = अपरिचित घटक प्रकार का बढ़ावा या नकल नाहीं कीन जाइ सकत: { $type }।

copy-prop-not-found = { $component } प्रकार क घटक पर { $property } गुण नाहीं मिला

collect-no-source = collect खातिर कउनो स्रोत नाहीं मिला।

collect-invalid-component-type = `<{ $component }>` प्रकार क घटक बटोरे नाहीं जाइ सकत, काहे से कि ई मान्य घटक प्रकार नाहीं अहै।

reference-index-unavailable = अनुक्रमांक `{ $reference }` क संदर्भ नाहीं दीन जाइ सकत

## `<callAction>`

component-action-unavailable = घटक `{ $reference }` पर { $action } नाहीं बुलावा जाइ सकत

## `<dataFrame>`

data-frame-inconsistent-row-lengths = आँकड़न क आकार अमान्य अहै। पंक्तिन क लंबाई असंगत अहै। componentIdx :{ $componentIdx } मा मिला

data-frame-duplicate-column-names = आँकड़न मा स्तंभ नाम दोहरावल गयल अहैं। componentIdx :{ $componentIdx } मा मिला

data-frame-missing-column-name = आँकड़न मा एक स्तंभ नाम नाहीं अहै। componentIdx :{ $componentIdx } मा मिला

## `<answer>` and scoring

answer-award-depends-on-own-response = एह जवाब क एक award खुद answer टैग क पठावल जवाब पर टिका अहै, जेह से अनचाहा बरताव होई।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` वाले पात्र क भीतर क `<answer>` पर `maxNumAttempts` राखै क कउनो असर नाहीं होत, काहे से कि मौकन क संख्या पात्र तय करत अहै। `maxNumAttempts` पात्र पर राखौ।

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` वाले कउनो अउर पात्र क भीतर बैठे `sectionWideCheckWork` पात्र पर `maxNumAttempts` राखै क कउनो असर नाहीं होत, काहे से कि मौकन क संख्या बाहरी पात्र तय करत अहै। `maxNumAttempts` बाहरी पात्र पर राखौ।

answer-attributes-need-symbolic-equality = symbolicEquality राखे बिना { $attributes } विशेषता क कउनो असर नाहीं होई।

answer-invalid-type = answer खातिर प्रकार अमान्य अहै: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = काहे से कि घटक `<{ $component }>` क नाम नाहीं अहै, एका मॉड्यूल क विशेषता क रूप मा नाहीं लीन जाइ सकत

module-attribute-name-already-defined = घटक `<{ $component } name="{ $name }">` का मॉड्यूल क विशेषता क रूप मा नाहीं लीन जाइ सकत, काहे से कि घटक प्रकार `<module>` मा "{ $name }" विशेषता पहिले से परिभाषित अहै।

conditional-content-condition-ignored = case या else संतानन वाले `<conditionalContent>` घटक पर `condition` विशेषता पर ध्यान नाहीं दीन जात।

slider-markers-type-mismatch = चिह्नकन क प्रकार स्लाइडर क प्रकार से मेल नाहीं खात।

pretzel-problem-needs-statement-and-answer = अमान्य pretzel: हर `<problem>` मा एक `<statement>` अउर एक `<answer>` होय के चाही।

pretzel-circuit-first-problem-distractor = अमान्य pretzel: mode="circuit" मा पहिला `<problem>` भरमावै वाला विकल्प नाहीं होइ सकत।

## Attribute values

attribute-invalid-values = विशेषता `{ $attribute }` खातिर मान { $values } अमान्य अहै; छोड़ा जात अहै।

attribute-must-be-references = विशेषता `{ $attribute }` खातिर मान `{ $value }` अमान्य अहै। विशेषता `$` से सुरू होय वाले संदर्भन से बनी होय के चाही।

math-input-invalid-function-names = <mathInput>: { $attribute } मा अमान्य फलन नाम छोड़े गए: { $names }। हर नाम क दिखै वाले भाग मा कम से कम 2 वर्ण (अच्छर या योजक चिह्न) होय के चाही; ओकर बाद वैकल्पिक `|<mathspeak विकल्प>` प्रत्यय आइ सकत अहै।

## Building components from the source

component-type-invalid = घटक प्रकार अमान्य अहै: `<{ $componentType }>`

attribute-repeated = विशेषता { $attribute } दोहरावी नाहीं जाइ सकत।

attribute-invalid-for-component = `<{ $componentType }>` प्रकार क घटक खातिर विशेषता "{ $attribute }" अमान्य अहै।

## Style definition contrast

style-definition-insufficient-contrast =
    शैली परिभाषा { $styleNumber } मा { $context ->
        [text-on-background] पृष्ठभूमि क रंग क आगे पाठ क रंग
        [high-contrast] कैनवास क आगे उच्च वैषम्य क रंग
        [line] कैनवास क आगे रेखा क रंग
        [marker] कैनवास क आगे चिह्नक क रंग
       *[text-on-canvas] कैनवास क आगे पाठ क रंग
    } खातिर वैषम्य अपर्याप्त अहै{ $mode ->
        [dark] { " (गहिर विधा)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाही)।

style-definition-dark-mode-text-background-contrast =
    जदपि शैली परिभाषा { $styleNumber } हल्की विधा खातिर पर्याप्त वैषम्य वाले रंग देत अहै, एह मानन से निकले गहिर विधा क रंगन मा पाठ क रंग अउर पृष्ठभूमि क रंग क बीच वैषम्य अपर्याप्त अहै ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाही)। { $suggestion ->
        [available] गहिर विधा मा पर्याप्त वैषम्य पावै खातिर या त हल्की विधा क वैषम्य बढ़ावौ (जइसे { $lightAttribute }="{ $lightColor }" राखौ) या गहिर विधा क रंग बदलि दौ (जइसे { $darkAttribute }="{ $darkColor }" राखौ)।
       *[none] गहिर विधा मा पर्याप्त वैषम्य पावै खातिर हल्की विधा क वैषम्य बढ़ावौ या निकले रंगन का textColorDarkMode अउर/या backgroundColorDarkMode से बदलि दौ।
    }

style-definition-dark-mode-text-canvas-contrast =
    जदपि शैली परिभाषा { $styleNumber } हल्की विधा खातिर पर्याप्त वैषम्य वाला पाठ रंग देत अहै, एह मान से निकला गहिर विधा क पाठ रंग कैनवास क आगे अपर्याप्त वैषम्य रखत अहै ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाही)। { $suggestion ->
        [available] गहिर विधा मा पर्याप्त वैषम्य पावै खातिर या त हल्की विधा क वैषम्य बढ़ावौ (जइसे textColor="{ $lightColor }" राखौ) या गहिर विधा क रंग बदलि दौ (जइसे textColorDarkMode="{ $darkColor }" राखौ)।
       *[none] गहिर विधा मा पर्याप्त वैषम्य पावै खातिर हल्की विधा क वैषम्य बढ़ावौ या निकले रंग का textColorDarkMode से बदलि दौ।
    }

section-multiple-style-palettes = एक खंड खाली एक <stylePalette> चुनि सकत अहै; अंतिम लीन जात अहै।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } क अनोख संस्करण तय नाहीं कीन जाइ सकत, काहे से कि numToSelect ऋणेतर पूर्णांक नाहीं अहै।

variant-num-to-select-not-constant-number = { $component } क अनोख संस्करण तय नाहीं कीन जाइ सकत, काहे से कि numToSelect अचर संख्या नाहीं अहै।

variant-with-replacement-not-constant-boolean = { $component } क अनोख संस्करण तय नाहीं कीन जाइ सकत, काहे से कि withReplacement अचर बूलीय मान नाहीं अहै।

variant-select-weight-disables-unique = जदि कउनो विकल्प selectWeight या selectForVariants देत अहै त select क अनोख संस्करण बंद होइ जात अहैं

variant-coprime-undetermined = { $component } क अनोख संस्करण तय नाहीं कीन जाइ सकत, काहे से कि ई तय नाहीं होइ सका कि coprime सदा असत्य अहै।

variant-attribute-not-constant = { $component } क अनोख संस्करण तय नाहीं कीन जाइ सकत, काहे से कि { $attribute } अचर नाहीं अहै।

variant-attribute-not-number = { $component } क अनोख संस्करण तय नाहीं कीन जाइ सकत, काहे से कि { $attribute } संख्या नाहीं अहै।

variant-attribute-wrong-type-for-sequence =
    { $type } प्रकार क { $component } क अनोख संस्करण तय नाहीं कीन जाइ सकत, काहे से कि { $attribute } { $expected ->
        [letters-combination] अच्छरन क संयोजन
        [math-expression] मान्य गणितीय व्यंजक
        [integer] पूर्णांक
       *[number] संख्या
    } नाहीं अहै।

variant-length-not-integer = { $component } क अनोख संस्करण तय नाहीं कीन जाइ सकत, काहे से कि length पूर्णांक नाहीं अहै।

variant-sort-not-implemented = sort वाले { $component } क अनोख संस्करण अबहीं उपलब्ध नाहीं अहैं

variant-exclude-combinations-not-implemented = excludeCombinations वाले { $component } क अनोख संस्करण अबहीं उपलब्ध नाहीं अहैं

variant-math-exclude-not-implemented = exclude वाले math प्रकार क { $component } क अनोख संस्करण अबहीं उपलब्ध नाहीं अहैं

variant-non-constant-exclude-not-implemented = अनचर exclude वाले { $component } क अनोख संस्करण अबहीं उपलब्ध नाहीं अहैं

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: आलेख क prefigure रेंडरर मा समर्थित नाहीं; वंसज छोड़ा गा।

prefigure-descendant-invalid-geometry = { $subject }: ज्यामिति असीमित या अधूरी अहै; वंसज छोड़ा गा।

prefigure-curve-label-omitted = { $subject }: बदले गयल वक्र तत्वन पर लेबल समर्थित नाहीं; लेबल छोड़ा गा।

prefigure-curve-unsupported-definition-type = { $subject }: वक्र फलन परिभाषा प्रकार '{ $definitionType }' समर्थित नाहीं; वंसज छोड़ा गा।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves पर flipFunctions विशेषता समर्थित नाहीं; वंसज छोड़ा गा।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves खाली सूत्र प्रकार क संतान फलनन का मानत अहै; वंसज छोड़ा गा।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] रेखा कुल क लेबल
       *[point] बिंदु क लेबल
    } खातिर labelPosition '{ $labelPosition }' समर्थित नाहीं; PreFigure क पूर्वनिर्धारित संरेखण लीन जात अहै।

prefigure-fill-style-unsupported = { $subject }: भराव शैली '{ $fillStyle }' PreFigure मा समर्थित नाहीं; ठोस भराव लीन जात अहै।

prefigure-line-style-unknown = { $subject }: अनजान रेखा शैली '{ $lineStyle }' PreFigure क आउटपुट से छोड़ी गई।

prefigure-marker-style-mapped-to-diamond = { $subject }: चिह्नक शैली '{ $markerStyle }' PreFigure क 'diamond' शैली पर मानचित्रित कीन गई।

prefigure-marker-style-unsupported = { $subject }: चिह्नक शैली '{ $markerStyle }' PreFigure मा समर्थित नाहीं; पूर्वनिर्धारित शैली लीन जात अहै।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` अमान्य; लक्ष्य तय नाहीं होइ सका। टीका छोड़ी गई।

annotation-ref-multiple-targets = `<annotation>`: `ref` से कई लक्ष्य निकले; पहिला लक्ष्य लीन जात अहै।

annotation-ref-outside-graph = `<annotation>`: `ref` अमान्य; लक्ष्य ओका समेटे आलेख क बाहर अहै। टीका छोड़ी गई।

annotation-ref-unsupported-target = `<annotation>`: `ref` अमान्य; prefigure रूपांतरण मा लक्ष्य समर्थित आलेखीय वस्तु नाहीं अहै। टीका छोड़ी गई।

annotation-text-missing = `<annotation>`: `text` नाहीं अहै या खाली अहै; खाली पाठ दीन जात अहै।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] चक्रीय निर्भरता क पता चला।
       *[other] `<{ $componentType }>` घटक से जुड़ी चक्रीय निर्भरता क पता चला।
    }

reference-no-referent = एह संदर्भ क कउनो लक्ष्य नाहीं मिला: `{ $reference }`

reference-multiple-referents = एह संदर्भ क कई लक्ष्य मिले: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` क विशेषता { $attribute } क प्रारूप अमान्य अहै।

children-invalid = `<{ $componentType }>` क संतान अमान्य अहैं: अमान्य संतान मिलीं: { $children }

## Falling back to a default

attribute-value-invalid-using-default = विशेषता `{ $attribute }` खातिर मान `{ $value }` अमान्य अहै; मान `{ $default }` लीन जात अहै

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML संस्करण { $version } नाहीं मिला।
       *[other] DoenetML संस्करण { $version } नाहीं मिला। संस्करण { $fallback } पर लौटा जात अहै
    }

## Reading the DoenetML

parse-invalid-doenetml = अमान्य DoenetML: { $content }

parse-tag-missing-close-tag = अमान्य DoenetML: टैग `{ $tag }` क समापन टैग नाहीं अहै। खुद बंद होय वाला टैग या `</{ $tagName }>` टैग चाही रहा।

parse-tag-error = अमान्य DoenetML: टैग `<{ $tagName }>` मा त्रुटि

parse-attribute-missing-value = अमान्य DoenetML: विशेषता `{ $attribute }` क मान नाहीं लागत अहै।

parse-attribute-invalid = अमान्य DoenetML: विशेषता `{ $attribute }` अमान्य अहै

parse-attribute-value-invalid = अमान्य DoenetML: विशेषता क मान `{ $value }` अमान्य अहै

parse-attribute-value-quote-mismatch = अमान्य DoenetML: विशेषता क मान `{ $value }` अमान्य अहै। उद्धरण चिह्न मेल नाहीं खात। एक `{ $quote }` छूटा लागत अहै

parse-open-tag-name-missing = अमान्य DoenetML: बिना नाम क टैग मिला, जइसे `<`

parse-tag-not-closed = अमान्य DoenetML: टैग `{ $tag }` बंद नाहीं भा (एक `>` छूटा लागत अहै)।

parse-self-closing-tag-name-missing = अमान्य DoenetML: बिना नाम क टैग मिला `<{ $content }>`

parse-self-closing-tag-not-closed = अमान्य DoenetML: टैग `{ $tag }` बंद नाहीं भा (`/>` छूटा लागत अहै)।

parse-tag-invalid-attributes = अमान्य DoenetML: टैग `{ $tag }` मान्य नाहीं अहै। एकर विशेषता गलत होइ सकत अहैं।

parse-close-tag-name-missing = अमान्य DoenetML: बिना नाम क समापन टैग मिला, जइसे `</`

parse-attribute-value-unquoted = विशेषता क मान उद्धरण चिह्नन मा होय के चाही: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = अमान्य DoenetML: समापन टैग `{ $tag }` मिला, बाकी ओहसे मेल खात आरंभ टैग नाहीं अहै

parse-close-tag-mismatched = अमान्य DoenetML: समापन टैग मेल नाहीं खात। `</{ $expected }>` चाही रहा। `{ $found }` मिला

parser-node-unconvertible = नोड { $node } का Dast नोड मा नाहीं बदला जाइ सका।

## Names

name-attribute-invalid =
    विशेषता name='{ $name }' अमान्य अहै। { $reason ->
        [characters] नामन मा खाली अच्छर, अंक, अधोरेखा या योजक चिह्न होइ सकत अहैं।
       *[start] नाम अच्छर से सुरू होय के चाही।
    }

component-name-invalid-start = घटक नाम "{ $name }" अमान्य अहै। नाम अच्छर से सुरू होय के चाही।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched प्रकार क answer मा video विशेषता होय के चाही

answer-video-watched-video-not-reference = videoWatched प्रकार क answer क video विशेषता एक संदर्भ होय के चाही

answer-name-not-single-text = answer क name विशेषता मा खाली एक पाठ संतान होय के चाही

## Referencing another document

external-doenetml-recursion-limit = पुनरावर्तन क बहुत जादा स्तरन क कारन बाहरी DoenetML नाहीं मिल सका। कहूँ चक्रीय संदर्भ त नाहीं?

external-doenetml-unavailable = { $attribute }="{ $uri }" से DoenetML नाहीं मिल सका

external-doenetml-type-mismatch = { $attribute }="{ $uri }" से मिला DoenetML अमान्य अहै: ई घटक प्रकार "{ $componentType }" से मेल नाहीं खाया

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` अप्रचलित अहै; एकर बदले `{ $to }` क उपयोग करौ।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` अप्रचलित अहै; एकर बदले `{ $to }` क उपयोग करौ।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` अप्रचलित अहै अउर छोड़ी गई, काहे से कि `{ $to }` भी दीन गा अहै।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` अप्रचलित अहै अउर छोड़ी गई, काहे से कि `{ $to }` भी दीन गा अहै।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` अप्रचलित अहै अउर छोड़ी गई।

deprecated-attribute-to-child = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` अप्रचलित अहै; एकर बदले `<{ $child }>` संतान लिखौ।

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` क मान `{ $value }` अप्रचलित अहै; एकर बदले `{ $to }` क उपयोग करौ।

## Language coverage

pluralize-english-only = `<pluralize>` खाली अंग्रेजी क बहुवचन बनाइ सकत अहै, एह से { $locale } मा लिखे दस्तावेज मा ओकर पाठ जस क तस रहत अहै। बहुवचन रूप सीधे लिखौ, या `pluralForm` विशेषता से दौ।

## Checking against the schema

schema-element-unrecognized = तत्व `<{ $tag }>` कउनो परिचित Doenet तत्व नाहीं अहै।

schema-element-not-allowed-at-root = तत्व `<{ $tag }>` दस्तावेज क मूल मा मान्य नाहीं अहै।

schema-element-not-allowed-inside = तत्व `<{ $tag }>` `<{ $parent }>` क भीतर मान्य नाहीं अहै।

schema-attribute-unrecognized = तत्व `<{ $tag }>` मा `{ $attribute }` नाम क कउनो विशेषता नाहीं अहै।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] तत्व `<{ $tag }>` क विशेषता `{ $attribute }` अइसी सूची होय के चाही जेकर हर मद इनमा से एक होय: { $allowed }
       *[other] तत्व `<{ $tag }>` क विशेषता `{ $attribute }` इनमा से एक होय के चाही: { $allowed }
    }

## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select खातिर संस्करण नाम अमान्य अहै। संस्करण नाम { $variantName } { $numOptions } विकल्पन मा आवत अहै, बाकी चुनै क संख्या { $numToSelect } अहै।

select-variant-name-without-options = select खातिर संस्करण दीन गयल अहैं, बाकी संभव संस्करण नाम खातिर कउनो विकल्प नाहीं अहै: { $variantName }।

select-variant-name-not-possible = select खातिर दीन गा संस्करण नाम { $variantName } संभव संस्करण नाम नाहीं अहै।

select-too-few-options = खाली { $numOptions } घटकन मा से { $numToSelect } नाहीं चुने जाइ सकत।

select-from-sequence-too-few-values = { $length } लंबाई क अनुक्रम से { $numToSelect } मान नाहीं चुने जाइ सकत।

select-from-sequence-indices-count-mismatch = select खातिर दीन गयल अनुक्रमांकन क संख्या चुनै क संख्या से मेल खाय के चाही

select-from-sequence-indices-not-integers = select खातिर दीन गयल सब अनुक्रमांक पूर्णांक होय के चाही

select-from-sequence-index-excluded = selectfromsequence खातिर दीन गा अनुक्रमांक बाहर कीन गा रहा

select-from-sequence-indices-excluded-combination = selectfromsequence खातिर दीन गयल अनुक्रमांक बाहर कीन गा संयोजन रहे

select-from-sequence-coprime-not-positive-integers = धनात्मक पूर्णांक नाहीं चुने जात, एह से सहअभाज्य संयोजन नाहीं चुने जाइ सकत।

select-from-sequence-coprime-common-factor = सहअभाज्य संख्या नाहीं चुनी जाइ सकत। सब संभव मानन मा एक उभयनिष्ठ गुणनखंड अहै। (दीन गयल "from" या "to" मान "step" क सहअभाज्य होय के चाही।)

select-from-sequence-coprime-single-number = 1 से अलग कउनो एक्के संख्या से सहअभाज्य संयोजन नाहीं चुने जाइ सकत।

select-from-sequence-excluded-too-many-combinations = selectFromSequence मा 70% से जादा संयोजन बाहर कीन गयल

select-from-sequence-coprime-none-found = सहअभाज्य संख्या नाहीं चुनी जाइ सकी। सब संभव मानन मा एक उभयनिष्ठ गुणनखंड अहै।

select-from-sequence-too-few-unique-values = { $numPossibleValues } लंबाई क अनुक्रम से { $numToSelect } अलग मान नाहीं चुने जाइ सकत

select-prime-numbers-too-few-values = { $numValues } लंबाई क अभाज्य सूची से { $numToSelect } मान नाहीं चुने जाइ सकत

select-prime-numbers-values-count-mismatch = select खातिर दीन गयल मानन क संख्या चुनै क संख्या से मेल खाय के चाही

select-prime-numbers-values-not-prime = select prime number खातिर दीन गयल सब मान अभाज्य सूची मा होय के चाही

select-prime-numbers-values-excluded-combination = selectPrimeNumbers खातिर दीन गयल मान बाहर कीन गा संयोजन रहे

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers मा 70% से जादा संयोजन बाहर कीन गयल

select-random-combination-fluke = बहुतै अनहोनी संजोग से यादृच्छिक मानन क संयोजन नाहीं चुना जाइ सका

select-random-value-fluke = बहुतै अनहोनी संजोग से यादृच्छिक मान नाहीं चुना जाइ सका

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] ई `<{ $component }>` नाहीं देखावा जात, काहे से कि ई गणित क भीतर अहै अउर `inline` नाहीं अहै। `inline` जोड़ौ, जेह से ई ड्रॉप-डाउन सूची बनि जाय, जौन व्यंजक क भीतर समाइ जात अहै।
        [expanded] ई `<{ $component }>` नाहीं देखावा जात, काहे से कि ई गणित क भीतर अहै अउर `expanded` अहै। `expanded` हटावौ; कई पंक्ति वाला डिब्बा व्यंजक क भीतर नाहीं समात।
        [on-graph] ई `<{ $component }>` नाहीं देखावा जात, काहे से कि ई आलेख पर खींचे गयल गणित क भीतर अहै, जहाँ इनपुट खातिर जगह नाहीं अहै।
       *[relative-width] ई `<{ $component }>` नाहीं देखावा जात, काहे से कि ई गणित क भीतर अहै अउर एकर चौड़ाई सापेक्ष अहै। चौड़ाई निरपेक्ष इकाई मा दौ, जइसे `px`।
    }
