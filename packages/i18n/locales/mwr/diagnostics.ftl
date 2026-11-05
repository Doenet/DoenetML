# Marwari (मारवाड़ी) diagnostics: the errors and warnings shown to whoever is looking
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
# **Script: Devanagari.** Marwari is written in Devanagari today, in print
# and online; the Mahajani script it once used for accounts is not a running
# script for prose and is not attempted here.
#
# **Method, stated plainly.** Marwari has no established register for
# mathematics or for software, so the technical vocabulary of this catalog is
# Hindi — रेखा, बहुभुज, फलन, विशेषता, घटक, संस्करण — the words a Marwari
# speaker meets in a Rajasthani classroom, which teaches out of Hindi
# textbooks. What is Marwari here is the grammatical layer written over it:
# the genitive रो / री / रा rather than Hindi का / की / के, the object marker
# नै, the copula छै, the negative कोनी, मांय for *in*, सूं for *from*, अर for
# *and*, कै for *or*, जे for *if*, रै वास्ते for *for*, and the -ओ imperative
# (करो, दिखावो, हटावो) that Marwari puts on a button. A reviewer should read
# this as Marwari grammar over Hindi terminology and is free to replace the
# terminology wherever Marwari has its own word.
#
# **Nothing selects on a plural category.** CLDR has no plural data for
# `mwr`, so every count in this file goes through a single `*[other]`. The
# one exception is `field-function-wrong-num-outputs`, where English is not
# counting but distinguishing a one-output field from a two-output one; that
# fork is kept as the numeric literal `[1]`, which Fluent matches against the
# number itself rather than against a plural category.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = दो सिरे दिए जाण पर { $attributes } पर ध्यान कोनी दिया जावै

line-segment-attributes-ignored-with-endpoint-and-midpoint = सिरा अर मध्यबिंदु दोनों दिए जाण पर { $attributes } पर ध्यान कोनी दिया जावै

line-segment-midpoint-offset-without-midpoint = मध्यबिंदु रै बिना midpointOffset रो कोई प्रभाव कोनी होवै

## `<line>`

line-points-undetermined-dimensions = ऐसे बिंदुओं सूं होकर जाण वाली रेखा जिनकी विमा अनिश्चित छै।

line-points-too-few-dimensions = रेखा नै कम सूं कम द्विविमीय बिंदुओं सूं होकर जाना चाहीजै।

line-points-depend-on-variables = रेखा उन बिंदुओं सूं होकर जावै छै जो चरों पर निर्भर छै: { $variables }।

line-equation-invalid-format = चर { $variable1 } अर { $variable2 } मांय रेखा रा समीकरण रो प्रारूप अमान्य छै।

## `<ray>`

ray-overprescribed-through = किरण एक साथ through, endpoint अर direction सूं निर्धारित छै। दिए गिया through नै छोड़्यो जा रैयो छै।

ray-dimension-mismatch = किरण मांय numDimensions मेल कोनी खाते।

## `<vector>`

vector-overprescribed-head = सदिश एक साथ head, tail अर displacement सूं निर्धारित छै। दिए गिया head नै छोड़्यो जा रैयो छै।

vector-dimension-mismatch = सदिश मांय numDimensions मेल कोनी खाते।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` री ओर आकर्षित कोनी करियो जा सकै, क्यूंकै बीं मांय nearestPoint अवस्था चर कोनी।

constrain-to-without-nearest-point = `<{ $component }>` तक सीमित कोनी करियो जा सकै, क्यूंकै बीं मांय nearestPoint अवस्था चर कोनी।

constrain-to-interior-without-nearest-point = `<{ $component }>` रा भीतरी भाग तक सीमित कोनी करियो जा सकै, क्यूंकै बीं मांय nearestPoint अवस्था चर कोनी।

## `<choiceInput>`

choice-input-label-position-ignored = अंतःपंक्ति न होण वाले choiceInput रै वास्ते labelPosition पर ध्यान कोनी दिया जावै

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput रै वास्ते दिए गिया indices नै छोड़्यो जा रैयो छै, क्यूंकै indices री संख्या choice संतानों री संख्या सूं मेल कोनी खाती।

pretzel-indices-count-mismatch = problem रै वास्ते दिए गिया indices नै छोड़्यो जा रैयो छै, क्यूंकै indices री संख्या problem संतानों री संख्या सूं मेल कोनी खाती।

shuffle-indices-count-mismatch = shuffle रै वास्ते दिए गिया indices नै छोड़्यो जा रैयो छै, क्यूंकै indices री संख्या घटकों री संख्या सूं मेल कोनी खाती।

indices-ignored-out-of-range = { $component } रै वास्ते दिए गिया indices नै छोड़्यो जा रैयो छै, क्यूंकै कुछ अनुक्रमांक परिसर सूं बाहर छै।

pretzel-indices-repeated = pretzel रै वास्ते दिए गिया indices नै छोड़्यो जा रैयो छै, क्यूंकै कुछ अनुक्रमांक दोहराए गिया छै।

pretzel-circuit-first-index = circuit विधा मांय pretzel रै वास्ते दिए गिया indices नै छोड़्यो जा रैयो छै, क्यूंकै पहलो अनुक्रमांक 1 होणो चाहीजै।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` नै पाठ संतानों रै साथै काम करण रै वास्ते `type` विशेषता देनी होवैली।

invalid-type-defaulting-to-math = { $component } घटक रै वास्ते प्रकार { $type } अमान्य छै। आ math, text, number कै boolean मांय सूं एक होणो चाहीजै। math रो उपयोग करियो जा रैयो छै।

string-not-valid-component-to-arrange = पाठ "{ $value }" { $component } रै वास्ते मान्य घटक कोनी। छोड़्यो जा रैयो छै।

## Types and variables

invalid-type-defaulting-to-number = प्रकार { $type } अमान्य छै; प्रकार number पर सेट करियो जा रैयो छै।

invalid-variable-value = चर रो मान अमान्य छै: `{ $value }`

## Variants

variant-index-must-be-number = संस्करण अनुक्रमांक { $index } एक संख्या होणी चाहीजै

variant-index-must-be-integer = संस्करण अनुक्रमांक { $index } एक पूर्णांक होणो चाहीजै

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` निरपेक्ष मापों रै वास्ते उपलब्ध कोनी। चौड़ाइयाँ सापेक्ष री जा रैयी छै।

side-by-side-absolute-margins = `<{ $component }>` निरपेक्ष मापों रै वास्ते उपलब्ध कोनी। हाशिये सापेक्ष किए जा रैया छै।

side-by-side-no-block-child = अमान्य `<{ $component }>`: इण मांय कम सूं कम एक खंड संतान होणी चाहीजै।

## `<label>`

label-for-ignored-on-graphical = आलेखीय `<label>` पर `for` विशेषता पर ध्यान कोनी दिया जावै।

label-for-must-resolve-to-one = `<label>` पर `for` विशेषता ठीक एक घटक तक पहुँचनी चाहीजै।

label-for-unresolved = `<label>` पर `for` विशेषता किसी घटक तक कोनी पहुँच सकी।

label-for-answer-with-authored-inputs = `<label>` पर `for` विशेषता ऐसे `<answer>` रो संदर्भ देती छै जिण मांय इनपुट स्पष्ट रूप सूं लिखे गिया छै; सीधे उसी इनपुट रो संदर्भ द्यो।

label-for-answer-without-input = `<label>` पर `for` विशेषता ऐसे `<answer>` रो संदर्भ देती छै जिण मांय लेबल लगाण योग्य इनपुट कोनी।

label-for-must-reference-input-or-answer = `<label>` पर `for` विशेषता किसी इनपुट कै किसी उत्तर रो संदर्भ देनी चाहीजै।

## Accessibility

accessibility-short-description-or-decorative = सुगम्यता रै वास्ते `<{ $component }>` रो कै तो संक्षिप्त विवरण होणो चाहीजै कै उसे सजावटी बताया जाना चाहीजै।

accessibility-video-short-description = सुगम्यता रै वास्ते `<video>` रो संक्षिप्त विवरण होणो चाहीजै।

accessibility-input-short-description-or-label = सुगम्यता रै वास्ते `<{ $component }>` रो संक्षिप्त विवरण कै लेबल होणो चाहीजै।

accessibility-answer-input-short-description-or-label = सुगम्यता रै वास्ते इनपुट बनाण वाले `<answer>` रो संक्षिप्त विवरण कै लेबल होणो चाहीजै।

accessibility-short-description-contains-math = संक्षिप्त विवरणों मांय `<{ $component }>` जियां गणितीय घटक कोनी होण चाहीजै। गणित नै शब्दों मांय लिखो।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } रो खंड शीर्षक पाठ रै वास्ते वैषम्य अपर्याप्त छै (गहरी विधा) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम सूं कम { $threshold }:1 चाहीजै)।
       *[other] { $colorName } रो खंड शीर्षक पाठ रै वास्ते वैषम्य अपर्याप्त छै ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम सूं कम { $threshold }:1 चाहीजै)।
    }

## `<circle>`

circle-through-points-non-numerical = जब बिंदुओं रा संख्यात्मक मान न हों, तब { $count } बिंदुओं सूं होकर जाण वाला `<circle>` अभी उपलब्ध कोनी।

circle-too-many-through-points = 3 सूं अधिक बिंदुओं सूं होकर जाण वाला वृत्त परिकलित कोनी करियो जा सकै।

circle-overprescribed-radius-center-points = त्रिज्या, केंद्र अर गुज़रने वाले बिंदु एक साथ दिए जाण पर वृत्त परिकलित कोनी करियो जा सकै।

circle-center-with-multiple-points = दिए गिया केंद्र रै साथै 1 सूं अधिक बिंदु सूं होकर जाण वाला वृत्त परिकलित कोनी करियो जा सकै।

circle-radius-too-small = वृत्त परिकलित कोनी करियो जा सकै: दोनों बिंदुओं रै बिचाळै री दूरी { $distance } छै, इसलिए दी गी त्रिज्या { $radius } बहुत छोटी छै।

circle-radius-with-many-points = दी गी त्रिज्या रै साथै दो सूं अधिक बिंदुओं सूं होकर जाण वाला वृत्त कोनी बनाया जा सकै।

circle-invalid-center-or-through-points = वृत्त रो केंद्र कै गुज़रने वाले बिंदु अमान्य छै।

circle-radius-center-with-multiple-points = दिए गिया केंद्र रै साथै 1 सूं अधिक बिंदु सूं होकर जाण वाले वृत्त री त्रिज्या परिकलित कोनी री जा सकै।

circle-change-radius-non-numerical = जिण वृत्त रा गुज़रने वाले बिंदु संख्यात्मक कोनी, बींरी त्रिज्या कोनी बदली जा सकै

circle-radius-with-points-non-numerical = संख्यात्मक मान न होण पर, दी गी त्रिज्या रै साथै एक सूं अधिक बिंदु सूं होकर जाण वाला वृत्त कोनी बनाया जा सकै।

circle-change-center-non-numerical = असंख्यात्मक बिंदुओं सूं होकर जाण वाले वृत्त रो केंद्र बदलना अभी उपलब्ध कोनी।

## `<function>`

function-domain-insufficient-dimensions = फलन रा प्रांत री विमाएँ अपर्याप्त छै। प्रांत मांय { $intervals } अंतराल छै, पर फलन मांय { $inputs } इनपुट छै।

function-domain-invalid-format = फलन रा प्रांत रो प्रारूप अमान्य छै।

function-ignoring-non-numerical =
    { $type ->
        [maximum] फलन रो असंख्यात्मक उच्चिष्ठ छोड़्यो जा रैयो छै।
        [minimum] फलन रो असंख्यात्मक निम्निष्ठ छोड़्यो जा रैयो छै।
        [extremum] फलन रो असंख्यात्मक चरम मान छोड़्यो जा रैयो छै।
        [point] फलन रो असंख्यात्मक बिंदु छोड़्यो जा रैयो छै।
        [slope] फलन री असंख्यात्मक प्रवणता छोड़ी जा रैयी छै।
       *[other] फलन रो असंख्यात्मक { $type } छोड़्यो जा रैयो छै।
    }

function-ignoring-empty =
    { $type ->
        [maximum] फलन रो रिक्त उच्चिष्ठ छोड़्यो जा रैयो छै।
        [minimum] फलन रो रिक्त निम्निष्ठ छोड़्यो जा रैयो छै।
        [extremum] फलन रो रिक्त चरम मान छोड़्यो जा रैयो छै।
        [point] फलन रो रिक्त बिंदु छोड़्यो जा रैयो छै।
       *[other] फलन रो रिक्त { $type } छोड़्यो जा रैयो छै।
    }

function-points-too-close = फलन मांय दो बिंदु बहुत पास-पास छै। फलन परिभाषित कोनी करियो जा सकै।

function-iterates-input-output-mismatch = फलन रो पुनरावर्तन तभी संभव छै जब इनपुट री संख्या आउटपुट री संख्या रा बराबर हो। इण फलन मांय { $inputs } इनपुट अर { $outputs } आउटपुट छै।

## `<sequence>`

sequence-invalid-length = अनुक्रम री लंबाई अमान्य छै। आ ऋणेतर पूर्णांक होणी चाहीजै।

sequence-invalid-step = अनुक्रम रो चरण अमान्य छै। { $type } प्रकार रा अनुक्रम रै वास्ते आ एक संख्या होणी चाहीजै।

sequence-invalid-endpoint-number = संख्या अनुक्रम रो "{ $attribute }" अमान्य छै। आ एक संख्या होणी चाहीजै।

sequence-invalid-endpoint-letters = अक्षर अनुक्रम रो "{ $attribute }" अमान्य छै। आ अक्षरों रो संयोजन होणो चाहीजै।

sequence-invalid-endpoint = अनुक्रम रो "{ $attribute }" अमान्य छै।

select-from-sequence-coprime-not-numbers = संख्याएँ कोनी चुनी जा रहीं, इसलिए coprime छोड़्यो गयो

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations दिया गयो छै, इसलिए coprime छोड़्यो गयो

## Resolving a `target`

target-not-found = `<{ $source }>` रै वास्ते target अमान्य छै: लक्ष्य कोनी मिल्यो।

target-state-variable-not-found = `<{ $source }>` रै वास्ते target अमान्य छै: `<{ $component }>` पर "{ $property }" नाम रो अवस्था चर कोनी मिल्यो।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` रा चर स्वतंत्र चर सूं भिन्न होण चाहीजै।

ode-system-duplicate-variable-names = दोहराए गिया आश्रित चर नामों रै साथै ODE रा दाएँ पक्ष रा फलन परिभाषित कोनी किए जा सकै।

ode-system-rhs-function-error = ODE रा दाएँ पक्ष रो फलन परिभाषित कोनी करियो जा सकै। mathjs फलन बनाते समय त्रुटि हुई।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } रेखाओं रै बिचाळै रो कोण परिभाषित कोनी करियो जा सकै

angle-invalid-through-point = `<angle>` रा through मांय अमान्य बिंदु छै

parabola-vertex-too-many-points = दिए गिया शीर्ष रै साथै 1 सूं अधिक बिंदु सूं होकर जाण वाला परवलय अभी उपलब्ध कोनी।

parabola-too-many-points = 3 सूं अधिक बिंदुओं सूं होकर जाण वाला परवलय अभी उपलब्ध कोनी।

intersection-too-many-items = दो सूं अधिक वस्तुओं रो प्रतिच्छेदन अभी उपलब्ध कोनी

## Other math components

ionic-compound-not-two-ions = दो आयनों रै अलावा किसी अर स्थिति रै वास्ते आयनिक यौगिक अभी उपलब्ध कोनी।

ionic-compound-needs-cation-and-anion = आयनिक यौगिक केवल एक धनायन अर एक ऋणायन रै वास्ते उपलब्ध छै।

solve-equations-cannot-evaluate = समीकरण रो मान कोनी निकाला जा सका, इसलिए बो हल कोनी करियो जा सकै: { $equation }

math-operators-operand-number-required = गणितीय संकार्य निकालते समय operandNumber देना आवश्यक छै।

eigen-decomposition-failed = आव्यूह रा अभिलक्षणिक मान परिकलित कोनी किए जा सके

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: प्राचल { $parameters } पैटर्न मांय कोनी आते, इसलिए वे सदा रिक्त सूं मेल खाएँगे।

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" नै समझा कोनी जा सका। आ none, medium, dense, कै रिक्त स्थान सूं अलग री गी दो धनात्मक संख्याएँ होणी चाहीजै, जियां grid="1 0.5"। कोई ग्रिड कोनी खींचा जाएगा।

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure रेंडरर मांय xLabelPosition="left" समर्थित कोनी; दाईं स्थिति वाला व्यवहार अपणायो जा रैयो छै।

prefigure-y-label-position-unsupported = `<graph>`: prefigure रेंडरर मांय yLabelPosition="bottom" समर्थित कोनी; ऊपरी स्थिति वाला व्यवहार अपणायो जा रैयो छै।

prefigure-invalid-axis-bounds = `<graph>`: prefigure रूपांतरण रै वास्ते अक्ष सीमाएँ अमान्य छै; पूर्वनिर्धारित bbox (-10,-10,10,10) अपणायो जा रैयो छै।

prefigure-invalid-width = `<graph>`: prefigure रूपांतरण रै वास्ते चौड़ाई अमान्य छै; पूर्वनिर्धारित आरेख चौड़ाई 425 अपनाई जा रैयी छै।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure रूपांतरण रै वास्ते aspectRatio अमान्य छै; पूर्वनिर्धारित अनुपात 1 अपणायो जा रैयो छै।

prefigure-grid-spacing-too-fine = `<graph>`: अक्ष सीमाओं री तुलना मांय ग्रिड रो अंतराल बहुत महीन छै; prefigure रेंडरर मांय ग्रिड छोड़्यो जा रैयो छै।

prefigure-annotations-not-rendered = `<graph>`: PreFigure रेंडरर रो उपयोग न होण पर टीकाएँ कोनी खींची जाएँगी।

field-function-wrong-num-outputs =
    `<{ $component }>` नै ऐसा फलन चाहीजै जिण मांय { $expected ->
        [1] एक आउटपुट हो, यानी हर बिंदु पर प्रवणता y', जियां `y - x`
       *[other] दो आउटपुट हों, यानी हर बिंदु पर सदिश, जियां `(y, -x)`
    }, पर दिए गिया फलन मांय { $found } आउटपुट छै। { $alternative ->
        [none] कुछ कोनी खींचा जाएगा।
       *[other] बीं फलन रै वास्ते `<{ $alternative }>` घटक छै। कुछ कोनी खींचा जाएगा।
    }

field-function-attribute-ignored-with-child = `function` विशेषता पर ध्यान कोनी दिया जावै, क्यूंकै फलन घटक रै भीतर भी दिया गयो छै; भीतर वाला ही लियो जावै छै। फलन दोनों मांय सूं केवल एक तरह सूं द्यो।

field-variables-ignored =
    `<{ $component }>`: `variables` विशेषता बीं व्यंजक रा चर बताती छै जो घटक रै भीतर सीधे लिखा गयो हो। { $reason ->
        [function-child] यहाँ फलन `<function>` संतान रै रूप मांय दिया गयो छै, जो अपने चर स्वयं बताती छै, इसलिए `variables` पर ध्यान कोनी दिया जावै।
       *[no-expression] यहाँ ऐसा कोई व्यंजक कोनी दिया गयो, इसलिए `variables` पर ध्यान कोनी दिया जावै।
    }

multiple-annotations-children = `<graph>` मांय एक सूं अधिक `<annotations>` संतानें मिलीं; अंतिम नै छोड़कर सभी पर ध्यान कोनी दिया जाएगा।

## Referring to other components

copy-unrecognized-component-type = अपरिचित घटक प्रकार नै विस्तारित कै प्रतिलिपित कोनी करियो जा सकै: { $type }।

copy-prop-not-found = { $component } प्रकार रा घटक पर { $property } गुण कोनी मिल्यो

collect-no-source = collect रै वास्ते कोई स्रोत कोनी मिल्यो।

collect-invalid-component-type = `<{ $component }>` प्रकार रा घटक एकत्र कोनी किए जा सकै, क्यूंकै आ मान्य घटक प्रकार कोनी।

reference-index-unavailable = अनुक्रमांक `{ $reference }` रो संदर्भ कोनी दिया जा सकै

## `<callAction>`

component-action-unavailable = घटक `{ $reference }` पर { $action } कोनी बुलाया जा सकै

## `<dataFrame>`

data-frame-inconsistent-row-lengths = आँकड़ों रो आकार अमान्य छै। पंक्तियों री लंबाई असंगत छै। componentIdx :{ $componentIdx } मांय मिल्यो

data-frame-duplicate-column-names = आँकड़ों मांय स्तंभ नाम दोहराए गिया छै। componentIdx :{ $componentIdx } मांय मिल्यो

data-frame-missing-column-name = आँकड़ों मांय एक स्तंभ नाम अनुपस्थित छै। componentIdx :{ $componentIdx } मांय मिल्यो

## `<answer>` and scoring

answer-award-depends-on-own-response = इण उत्तर रो एक award स्वयं answer टैग द्वारा भेजे गिया उत्तर पर आधारित छै, जिससे अप्रत्याशित व्यवहार होवैला।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` वाले पात्र रै भीतर रा `<answer>` पर `maxNumAttempts` सेट करण रो कोई प्रभाव कोनी होवै, क्यूंकै प्रयासों री संख्या पात्र नियंत्रित करै छै। `maxNumAttempts` पात्र पर सेट करो।

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` वाले किसी अन्य पात्र रै भीतर स्थित `sectionWideCheckWork` पात्र पर `maxNumAttempts` सेट करण रो कोई प्रभाव कोनी होवै, क्यूंकै प्रयासों री संख्या बाहरी पात्र नियंत्रित करै छै। `maxNumAttempts` बाहरी पात्र पर सेट करो।

answer-attributes-need-symbolic-equality = symbolicEquality सेट किए बिना { $attributes } विशेषताओं रो कोई प्रभाव कोनी होवैला।

answer-invalid-type = answer रै वास्ते प्रकार अमान्य छै: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = क्यूंकै घटक `<{ $component }>` रो नाम कोनी, इसे मॉड्यूल विशेषता रै रूप मांय उपयोग कोनी करियो जा सकै

module-attribute-name-already-defined = घटक `<{ $component } name="{ $name }">` नै मॉड्यूल री विशेषता रै रूप मांय उपयोग कोनी करियो जा सकै, क्यूंकै घटक प्रकार `<module>` मांय "{ $name }" विशेषता पहले सूं परिभाषित छै।

conditional-content-condition-ignored = case कै else संतानों वाले `<conditionalContent>` घटक पर `condition` विशेषता पर ध्यान कोनी दिया जावै।

slider-markers-type-mismatch = चिह्नकों रो प्रकार स्लाइडर रा प्रकार सूं मेल कोनी खाता।

pretzel-problem-needs-statement-and-answer = अमान्य pretzel: प्रत्येक `<problem>` मांय एक `<statement>` अर एक `<answer>` होणो चाहीजै।

pretzel-circuit-first-problem-distractor = अमान्य pretzel: mode="circuit" मांय पहलो `<problem>` भ्रामक विकल्प कोनी हो सकै।

## Attribute values

attribute-invalid-values = विशेषता `{ $attribute }` रै वास्ते मान { $values } अमान्य छै; छोड़्यो जा रैयो छै।

attribute-must-be-references = विशेषता `{ $attribute }` रै वास्ते मान `{ $value }` अमान्य छै। विशेषता `$` सूं आरंभ होण वाले संदर्भों सूं बनी होणी चाहीजै।

math-input-invalid-function-names = <mathInput>: { $attribute } मांय अमान्य फलन नाम छोड़े गिया: { $names }। प्रत्येक नाम रा दृश्य भाग मांय कम सूं कम 2 वर्ण (अक्षर कै योजक चिह्न) होण चाहीजै; उसके बाद वैकल्पिक `|<mathspeak विकल्प>` प्रत्यय आ सकै छै।

## Building components from the source

component-type-invalid = घटक प्रकार अमान्य छै: `<{ $componentType }>`

attribute-repeated = विशेषता { $attribute } दोहराई कोनी जा सकै।

attribute-invalid-for-component = `<{ $componentType }>` प्रकार रा घटक रै वास्ते विशेषता "{ $attribute }" अमान्य छै।

## Style definition contrast

style-definition-insufficient-contrast =
    शैली परिभाषा { $styleNumber } मांय { $context ->
        [text-on-background] पृष्ठभूमि रंग री तुलना मांय पाठ रंग
        [high-contrast] कैनवास री तुलना मांय उच्च वैषम्य रंग
        [line] कैनवास री तुलना मांय रेखा रंग
        [marker] कैनवास री तुलना मांय चिह्नक रंग
       *[text-on-canvas] कैनवास री तुलना मांय पाठ रंग
    } रै वास्ते वैषम्य अपर्याप्त छै{ $mode ->
        [dark] { " (गहरी विधा)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम सूं कम { $threshold }:1 चाहीजै)।

style-definition-dark-mode-text-background-contrast =
    यद्यपि शैली परिभाषा { $styleNumber } ने हल्की विधा रै वास्ते पर्याप्त वैषम्य वाले रंग दिए छै, इन मानों सूं व्युत्पन्न गहरी विधा रा रंगों मांय पाठ रंग अर पृष्ठभूमि रंग रै बिचाळै वैषम्य अपर्याप्त छै ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम सूं कम { $threshold }:1 चाहीजै)। { $suggestion ->
        [available] गहरी विधा मांय पर्याप्त वैषम्य सुनिश्चित करण रै वास्ते कै तो हल्की विधा रो वैषम्य बढ़ावो (जियां { $lightAttribute }="{ $lightColor }" सेट करो) कै गहरी विधा रो रंग अधिरोहित करो (जियां { $darkAttribute }="{ $darkColor }" सेट करो)।
       *[none] गहरी विधा मांय पर्याप्त वैषम्य सुनिश्चित करण रै वास्ते हल्की विधा रो वैषम्य बढ़ावो कै व्युत्पन्न रंगों नै textColorDarkMode अर/कै backgroundColorDarkMode सूं अधिरोहित करो।
    }

style-definition-dark-mode-text-canvas-contrast =
    यद्यपि शैली परिभाषा { $styleNumber } ने हल्की विधा रै वास्ते पर्याप्त वैषम्य वाला पाठ रंग दिया छै, इण मान सूं व्युत्पन्न गहरी विधा रा पाठ रंग रो कैनवास री तुलना मांय वैषम्य अपर्याप्त छै ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम सूं कम { $threshold }:1 चाहीजै)। { $suggestion ->
        [available] गहरी विधा मांय पर्याप्त वैषम्य सुनिश्चित करण रै वास्ते कै तो हल्की विधा रो वैषम्य बढ़ावो (जियां textColor="{ $lightColor }" सेट करो) कै गहरी विधा रो रंग अधिरोहित करो (जियां textColorDarkMode="{ $darkColor }" सेट करो)।
       *[none] गहरी विधा मांय पर्याप्त वैषम्य सुनिश्चित करण रै वास्ते हल्की विधा रो वैषम्य बढ़ावो कै व्युत्पन्न रंग नै textColorDarkMode सूं अधिरोहित करो।
    }

section-multiple-style-palettes = एक खंड केवल एक <stylePalette> चुन सकै छै; अंतिम रो उपयोग करियो जा रैयो छै।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } रा अद्वितीय संस्करण निर्धारित कोनी किए जा सकै, क्यूंकै numToSelect ऋणेतर पूर्णांक कोनी।

variant-num-to-select-not-constant-number = { $component } रा अद्वितीय संस्करण निर्धारित कोनी किए जा सकै, क्यूंकै numToSelect अचर कोनी।

variant-with-replacement-not-constant-boolean = { $component } रा अद्वितीय संस्करण निर्धारित कोनी किए जा सकै, क्यूंकै withReplacement अचर बूलीय मान कोनी।

variant-select-weight-disables-unique = जे कोई विकल्प selectWeight कै selectForVariants देता छै तो select रा अद्वितीय संस्करण निष्क्रिय हो जावै छै

variant-coprime-undetermined = { $component } रा अद्वितीय संस्करण निर्धारित कोनी किए जा सकै, क्यूंकै आ तय कोनी हो सका कि coprime सदा असत्य छै।

variant-attribute-not-constant = { $component } रा अद्वितीय संस्करण निर्धारित कोनी किए जा सकै, क्यूंकै { $attribute } अचर कोनी।

variant-attribute-not-number = { $component } रा अद्वितीय संस्करण निर्धारित कोनी किए जा सकै, क्यूंकै { $attribute } संख्या कोनी।

variant-attribute-wrong-type-for-sequence =
    { $type } प्रकार रा { $component } रा अद्वितीय संस्करण निर्धारित कोनी किए जा सकै, क्यूंकै { $attribute } { $expected ->
        [letters-combination] अक्षरों रो संयोजन
        [math-expression] मान्य गणितीय व्यंजक
        [integer] पूर्णांक
       *[number] संख्या
    } कोनी।

variant-length-not-integer = { $component } रा अद्वितीय संस्करण निर्धारित कोनी किए जा सकै, क्यूंकै length पूर्णांक कोनी।

variant-sort-not-implemented = sort वाले { $component } रा अद्वितीय संस्करण अभी उपलब्ध कोनी

variant-exclude-combinations-not-implemented = excludeCombinations वाले { $component } रा अद्वितीय संस्करण अभी उपलब्ध कोनी

variant-math-exclude-not-implemented = exclude वाले math प्रकार रा { $component } रा अद्वितीय संस्करण अभी उपलब्ध कोनी

variant-non-constant-exclude-not-implemented = अनचर exclude वाले { $component } रा अद्वितीय संस्करण अभी उपलब्ध कोनी

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: आलेख रा prefigure रेंडरर मांय समर्थित कोनी; वंशज छोड़्यो गयो।

prefigure-descendant-invalid-geometry = { $subject }: ज्यामिति असीमित कै अपूर्ण छै; वंशज छोड़्यो गयो।

prefigure-curve-label-omitted = { $subject }: रूपांतरित वक्र तत्वों पर लेबल समर्थित कोनी; लेबल छोड़्यो गयो।

prefigure-curve-unsupported-definition-type = { $subject }: वक्र फलन परिभाषा प्रकार '{ $definitionType }' समर्थित कोनी; वंशज छोड़्यो गयो।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves पर flipFunctions विशेषता समर्थित कोनी; वंशज छोड़्यो गयो।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves केवल सूत्र प्रकार रा संतान फलनों रो समर्थन करै छै; वंशज छोड़्यो गयो।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] रेखा कुल रा लेबल
       *[point] बिंदु लेबल
    } रै वास्ते labelPosition '{ $labelPosition }' समर्थित कोनी; PreFigure री पूर्वनिर्धारित संरेखण अपनाई जा रैयी छै।

prefigure-fill-style-unsupported = { $subject }: भराव शैली '{ $fillStyle }' PreFigure मांय समर्थित कोनी; ठोस भराव अपणायो जा रैयो छै।

prefigure-line-style-unknown = { $subject }: अज्ञात रेखा शैली '{ $lineStyle }' PreFigure रा आउटपुट सूं छोड़ी गी।

prefigure-marker-style-mapped-to-diamond = { $subject }: चिह्नक शैली '{ $markerStyle }' PreFigure री 'diamond' शैली पर मानचित्रित री गी।

prefigure-marker-style-unsupported = { $subject }: चिह्नक शैली '{ $markerStyle }' PreFigure मांय समर्थित कोनी; पूर्वनिर्धारित शैली अपनाई जा रैयी छै।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` अमान्य; लक्ष्य निर्धारित कोनी हो सका। टीका छोड़ी गी।

annotation-ref-multiple-targets = `<annotation>`: `ref` सूं कई लक्ष्य निकले; पहलो लक्ष्य लियो जा रैयो छै।

annotation-ref-outside-graph = `<annotation>`: `ref` अमान्य; लक्ष्य उसे समेटे आलेख रा बाहर छै। टीका छोड़ी गी।

annotation-ref-unsupported-target = `<annotation>`: `ref` अमान्य; prefigure रूपांतरण मांय लक्ष्य समर्थित आलेखीय वस्तु कोनी। टीका छोड़ी गी।

annotation-text-missing = `<annotation>`: `text` अनुपस्थित कै रिक्त; रिक्त पाठ दिया जा रैयो छै।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] चक्रीय निर्भरता रो पता चला।
       *[other] `<{ $componentType }>` घटक सूं जुड़ी चक्रीय निर्भरता रो पता चला।
    }

reference-no-referent = इण संदर्भ रो कोई लक्ष्य कोनी मिल्यो: `{ $reference }`

reference-multiple-referents = इण संदर्भ रा कई लक्ष्य मिल्या: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` री विशेषता { $attribute } रो प्रारूप अमान्य छै।

children-invalid = `<{ $componentType }>` री संतानें अमान्य छै: अमान्य संतानें मिलीं: { $children }

## Falling back to a default

attribute-value-invalid-using-default = विशेषता `{ $attribute }` रै वास्ते मान `{ $value }` अमान्य छै; मान `{ $default }` रो उपयोग करियो जा रैयो छै

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML संस्करण { $version } कोनी मिल्यो।
       *[other] DoenetML संस्करण { $version } कोनी मिल्यो। संस्करण { $fallback } पर लौटा जा रैयो छै
    }

## Reading the DoenetML

parse-invalid-doenetml = अमान्य DoenetML: { $content }

parse-tag-missing-close-tag = अमान्य DoenetML: टैग `{ $tag }` रो समापन टैग कोनी। स्वतः बंद होण वाला टैग कै `</{ $tagName }>` टैग अपेक्षित हो।

parse-tag-error = अमान्य DoenetML: टैग `<{ $tagName }>` मांय त्रुटि

parse-attribute-missing-value = अमान्य DoenetML: विशेषता `{ $attribute }` रो मान अनुपस्थित प्रतीत होवै छै।

parse-attribute-invalid = अमान्य DoenetML: विशेषता `{ $attribute }` अमान्य छै

parse-attribute-value-invalid = अमान्य DoenetML: विशेषता मान `{ $value }` अमान्य छै

parse-attribute-value-quote-mismatch = अमान्य DoenetML: विशेषता मान `{ $value }` अमान्य छै। उद्धरण चिह्न मेल कोनी खाते। एक `{ $quote }` अनुपस्थित प्रतीत होवै छै

parse-open-tag-name-missing = अमान्य DoenetML: बिना नाम रो टैग मिल्यो, जियां `<`

parse-tag-not-closed = अमान्य DoenetML: टैग `{ $tag }` बंद कोनी हुआ (एक `>` अनुपस्थित प्रतीत होवै छै)।

parse-self-closing-tag-name-missing = अमान्य DoenetML: बिना नाम रो टैग मिल्यो `<{ $content }>`

parse-self-closing-tag-not-closed = अमान्य DoenetML: टैग `{ $tag }` बंद कोनी हुआ (`/>` अनुपस्थित प्रतीत होवै छै)।

parse-tag-invalid-attributes = अमान्य DoenetML: टैग `{ $tag }` मान्य कोनी। इणरी विशेषताएँ ग़लत हो सकै छै।

parse-close-tag-name-missing = अमान्य DoenetML: बिना नाम रो समापन टैग मिल्यो, जियां `</`

parse-attribute-value-unquoted = विशेषता मान उद्धरण चिह्नों मांय होण चाहीजै: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = अमान्य DoenetML: समापन टैग `{ $tag }` मिल्यो, पर बीं सूं मेल खाता आरंभ टैग कोनी

parse-close-tag-mismatched = अमान्य DoenetML: समापन टैग मेल कोनी खाता। `</{ $expected }>` अपेक्षित हो। `{ $found }` मिल्यो

parser-node-unconvertible = नोड { $node } नै Dast नोड मांय परिवर्तित कोनी करियो जा सका।

## Names

name-attribute-invalid =
    विशेषता name='{ $name }' अमान्य छै। { $reason ->
        [characters] नामों मांय केवल अक्षर, अंक, अधोरेखा कै योजक चिह्न हो सकै छै।
       *[start] नाम अक्षर सूं आरंभ होण चाहीजै।
    }

component-name-invalid-start = घटक नाम "{ $name }" अमान्य छै। नाम अक्षर सूं आरंभ होण चाहीजै।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched प्रकार रा answer मांय video विशेषता होणी चाहीजै

answer-video-watched-video-not-reference = videoWatched प्रकार रा answer री video विशेषता एक संदर्भ होणी चाहीजै

answer-name-not-single-text = answer री name विशेषता मांय केवल एक पाठ संतान होणी चाहीजै

## Referencing another document

external-doenetml-recursion-limit = पुनरावर्तन रा बहुत अधिक स्तरों रा कारण बाहरी DoenetML प्राप्त कोनी करियो जा सका। कहीं चक्रीय संदर्भ तो कोनी?

external-doenetml-unavailable = { $attribute }="{ $uri }" सूं DoenetML प्राप्त कोनी करियो जा सका

external-doenetml-type-mismatch = { $attribute }="{ $uri }" सूं प्राप्त DoenetML अमान्य छै: आ घटक प्रकार "{ $componentType }" सूं मेल कोनी खाया

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` अप्रचलित छै; इणरै ठोड़ `{ $to }` रो उपयोग करो।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` अप्रचलित छै; इणरै ठोड़ `{ $to }` रो उपयोग करो।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` अप्रचलित छै अर छोड़ दी गी, क्यूंकै `{ $to }` भी दिया गयो छै।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` अप्रचलित छै अर छोड़ दी गी, क्यूंकै `{ $to }` भी दिया गयो छै।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` अप्रचलित छै अर छोड़ दी गी।

deprecated-attribute-to-child = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` अप्रचलित छै; इणरै ठोड़ `<{ $child }>` संतान लिखो।

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` रो मान `{ $value }` अप्रचलित छै; इणरै ठोड़ `{ $to }` रो उपयोग करो।


## Language coverage

pluralize-english-only = `<pluralize>` केवल अंग्रेज़ी रो बहुवचन बना सकै छै, इसलिए { $locale } मांय लिखे दस्तावेज़ मांय बींरो पाठ अपरिवर्तित रहता छै। बहुवचन रूप सीधे लिखो, कै `pluralForm` विशेषता सूं द्यो।


## Checking against the schema

schema-element-unrecognized = तत्व `<{ $tag }>` कोई परिचित Doenet तत्व कोनी।

schema-element-not-allowed-at-root = तत्व `<{ $tag }>` दस्तावेज़ रा मूल मांय मान्य कोनी।

schema-element-not-allowed-inside = तत्व `<{ $tag }>` `<{ $parent }>` रै भीतर मान्य कोनी।

schema-attribute-unrecognized = तत्व `<{ $tag }>` मांय `{ $attribute }` नाम री कोई विशेषता कोनी।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] तत्व `<{ $tag }>` री विशेषता `{ $attribute }` एक सूची होणी चाहीजै जिसकी हर मद इनमें सूं एक हो: { $allowed }
       *[other] तत्व `<{ $tag }>` री विशेषता `{ $attribute }` इनमें सूं एक होणी चाहीजै: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select रै वास्ते संस्करण नाम अमान्य छै। संस्करण नाम { $variantName } { $numOptions } विकल्पों मांय आता छै, पर चुनण री संख्या { $numToSelect } छै।

select-variant-name-without-options = select रै वास्ते संस्करण दिए गिया छै, पर संभावित संस्करण नाम रै वास्ते कोई विकल्प कोनी: { $variantName }।

select-variant-name-not-possible = select रै वास्ते दिया गयो संस्करण नाम { $variantName } संभावित संस्करण नाम कोनी।

select-too-few-options = केवल { $numOptions } घटकों मांय सूं { $numToSelect } कोनी चुने जा सकै।

select-from-sequence-too-few-values = { $length } लंबाई रा अनुक्रम सूं { $numToSelect } मान कोनी चुने जा सकै।

select-from-sequence-indices-count-mismatch = select रै वास्ते दिए गिया अनुक्रमांकों री संख्या चुनण री संख्या सूं मेल खानी चाहीजै

select-from-sequence-indices-not-integers = select रै वास्ते दिए गिया सभी अनुक्रमांक पूर्णांक होण चाहीजै

select-from-sequence-index-excluded = selectfromsequence रै वास्ते दिया गयो अनुक्रमांक बहिष्कृत हो

select-from-sequence-indices-excluded-combination = selectfromsequence रै वास्ते दिए गिया अनुक्रमांक बहिष्कृत संयोजन बनाते हा

select-from-sequence-coprime-not-positive-integers = धनात्मक पूर्णांक कोनी चुने जा रैया, इसलिए सहअभाज्य संयोजन कोनी चुने जा सकै।

select-from-sequence-coprime-common-factor = सहअभाज्य संख्याएँ कोनी चुनी जा सकै। सभी संभावित मानों मांय एक उभयनिष्ठ गुणनखंड छै। (दिए गिया "from" कै "to" मान "step" रा सहअभाज्य होण चाहीजै।)

select-from-sequence-coprime-single-number = 1 सूं भिन्न किसी एकल संख्या सूं सहअभाज्य संयोजन कोनी चुने जा सकै।

select-from-sequence-excluded-too-many-combinations = selectFromSequence मांय 70% सूं अधिक संयोजन बहिष्कृत किए गिया

select-from-sequence-coprime-none-found = सहअभाज्य संख्याएँ कोनी चुनी जा सकी। सभी संभावित मानों मांय एक उभयनिष्ठ गुणनखंड छै।

select-from-sequence-too-few-unique-values = { $numPossibleValues } लंबाई रा अनुक्रम सूं { $numToSelect } भिन्न मान कोनी चुने जा सकै

select-prime-numbers-too-few-values = { $numValues } लंबाई री अभाज्य सूची सूं { $numToSelect } मान कोनी चुने जा सकै

select-prime-numbers-values-count-mismatch = select रै वास्ते दिए गिया मानों री संख्या चुनण री संख्या सूं मेल खानी चाहीजै

select-prime-numbers-values-not-prime = select prime number रै वास्ते दिए गिया सभी मान अभाज्य सूची मांय होण चाहीजै

select-prime-numbers-values-excluded-combination = selectPrimeNumbers रै वास्ते दिए गिया मान बहिष्कृत संयोजन बनाते हा

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers मांय 70% सूं अधिक संयोजन बहिष्कृत किए गिया

select-random-combination-fluke = अत्यंत असंभव संयोग सूं यादृच्छिक मानों रो संयोजन कोनी चुना जा सका

select-random-value-fluke = अत्यंत असंभव संयोग सूं यादृच्छिक मान कोनी चुना जा सका

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] आ `<{ $component }>` कोनी दिखाया जा रैयो, क्यूंकै आ गणित रै भीतर छै अर `inline` कोनी। `inline` जोड़ो, ताकि आ ड्रॉप-डाउन सूची बन जाए, जो व्यंजक रै भीतर समा जावै छै।
        [expanded] आ `<{ $component }>` कोनी दिखाया जा रैयो, क्यूंकै आ गणित रै भीतर छै अर `expanded` छै। `expanded` हटावो; बहु-पंक्ति बक्सा व्यंजक रै भीतर कोनी समाता।
        [on-graph] आ `<{ $component }>` कोनी दिखाया जा रैयो, क्यूंकै आ आलेख पर खींचे गिया गणित रै भीतर छै, जिण मांय इनपुट रै वास्ते जगह कोनी।
       *[relative-width] आ `<{ $component }>` कोनी दिखाया जा रैयो, क्यूंकै आ गणित रै भीतर छै अर इणरी चौड़ाई सापेक्ष छै। चौड़ाई निरपेक्ष इकाइयों मांय द्यो, जियां `px`।
    }
