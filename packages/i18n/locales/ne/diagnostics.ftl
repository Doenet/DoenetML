# Nepali diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Translators: `through`, `endpoint`, `midpointOffset`, `numDimensions` and the
# like are DoenetML attribute names. They are part of the language, not prose,
# and are left in English exactly as written, as are tag names, attribute
# values and anything quoted back from the author's own source.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] दुई अन्त्यबिन्दु तोकिएको बेला { $attributes } बेवास्ता गरिन्छ
       *[other] दुई अन्त्यबिन्दु तोकिएको बेला { $attributes } बेवास्ता गरिन्छन्
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] एक अन्त्यबिन्दु र एक मध्यबिन्दु दुवै तोकिएको बेला { $attributes } बेवास्ता गरिन्छ
       *[other] एक अन्त्यबिन्दु र एक मध्यबिन्दु दुवै तोकिएको बेला { $attributes } बेवास्ता गरिन्छन्
    }

line-segment-midpoint-offset-without-midpoint = मध्यबिन्दुविना midpointOffset को कुनै प्रभाव हुँदैन

## `<line>`

line-points-undetermined-dimensions = अनिर्धारित आयामका बिन्दुहरूबाट जाने रेखा।

line-points-too-few-dimensions = रेखा कम्तीमा दुई आयामका बिन्दुहरूबाट जानुपर्छ।

line-points-depend-on-variables = रेखा चरहरूमा निर्भर बिन्दुहरूबाट जान्छ: { $variables }।

line-equation-invalid-format = { $variable1 } र { $variable2 } चरमा रेखाको समीकरणको ढाँचा अमान्य छ।

## `<ray>`

ray-overprescribed-through = किरण through, endpoint र direction ले तोकिएको छ।  तोकिएको through बेवास्ता गरिँदै छ।

ray-dimension-mismatch = किरणमा numDimensions मिलेन।

## `<vector>`

vector-overprescribed-head = सदिश head, tail र displacement ले तोकिएको छ।  तोकिएको head बेवास्ता गरिँदै छ।

vector-dimension-mismatch = सदिशमा numDimensions मिलेन।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` तर्फ आकर्षित गर्न सकिँदैन, किनभने यसमा nearestPoint स्टेट भेरिएबल छैन।

constrain-to-without-nearest-point = `<{ $component }>` मा सीमित गर्न सकिँदैन, किनभने यसमा nearestPoint स्टेट भेरिएबल छैन।

constrain-to-interior-without-nearest-point = `<{ $component }>` को भित्री भागमा सीमित गर्न सकिँदैन, किनभने यसमा nearestPoint स्टेट भेरिएबल छैन।

## `<choiceInput>`

choice-input-label-position-ignored = इनलाइन नभएको choiceInput का लागि labelPosition बेवास्ता गरिन्छ

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput का लागि तोकिएका सूचकाङ्क बेवास्ता गरिँदै छन्, किनभने सूचकाङ्कको सङ्ख्या choice सन्तानको सङ्ख्यासँग मिल्दैन।

pretzel-indices-count-mismatch = problem का लागि तोकिएका सूचकाङ्क बेवास्ता गरिँदै छन्, किनभने सूचकाङ्कको सङ्ख्या problem सन्तानको सङ्ख्यासँग मिल्दैन।

shuffle-indices-count-mismatch = shuffle का लागि तोकिएका सूचकाङ्क बेवास्ता गरिँदै छन्, किनभने सूचकाङ्कको सङ्ख्या घटकको सङ्ख्यासँग मिल्दैन।

indices-ignored-out-of-range = { $component } का लागि तोकिएका सूचकाङ्क बेवास्ता गरिँदै छन्, किनभने केही सूचकाङ्क दायराबाहिर छन्।

pretzel-indices-repeated = pretzel का लागि तोकिएका सूचकाङ्क बेवास्ता गरिँदै छन्, किनभने केही सूचकाङ्क दोहोरिएका छन्।

pretzel-circuit-first-index = circuit मोडमा pretzel का लागि तोकिएका सूचकाङ्क बेवास्ता गरिँदै छन्, किनभने पहिलो सूचकाङ्क 1 हुनुपर्छ।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` ले स्ट्रिङ सन्तानसँग काम गर्न `type` एट्रिब्युट तोक्नुपर्छ।

invalid-type-defaulting-to-math = { $component } घटकका लागि { $type } प्रकार अमान्य छ। math, text, number वा boolean मध्ये एक हुनुपर्छ। math मानिँदै छ।

string-not-valid-component-to-arrange = "{ $value }" स्ट्रिङ { $component } गर्नका लागि मान्य घटक होइन। बेवास्ता गरिँदै छ।

## Types and variables

invalid-type-defaulting-to-number = { $type } प्रकार अमान्य छ, प्रकार number बनाइँदै छ।

invalid-variable-value = चरको मान अमान्य छ: `{ $value }`

## Variants

variant-index-must-be-number = संस्करण सूचकाङ्क { $index } सङ्ख्या हुनुपर्छ

variant-index-must-be-integer = संस्करण सूचकाङ्क { $index } पूर्णाङ्क हुनुपर्छ

## `<sideBySide>`

side-by-side-absolute-widths = निरपेक्ष नापका लागि `<{ $component }>` कार्यान्वयन गरिएको छैन। चौडाइ सापेक्ष बनाइँदै छ।

side-by-side-absolute-margins = निरपेक्ष नापका लागि `<{ $component }>` कार्यान्वयन गरिएको छैन। सिमान्त सापेक्ष बनाइँदै छन्।

side-by-side-no-block-child = `<{ $component }>` अमान्य: यसमा कम्तीमा एउटा ब्लक सन्तान हुनुपर्छ।

## `<label>`

label-for-ignored-on-graphical = ग्राफिकल `<label>` माथिको `for` एट्रिब्युट बेवास्ता गरिन्छ।

label-for-must-resolve-to-one = `<label>` माथिको `for` एट्रिब्युट ठ्याक्कै एउटा घटकमा निर्धारण हुनुपर्छ।

label-for-unresolved = `<label>` माथिको `for` एट्रिब्युट कुनै घटकमा निर्धारण गर्न सकिएन।

label-for-answer-with-authored-inputs = `<label>` माथिको `for` एट्रिब्युटले छुट्टै लेखिएका इनपुट भएको `<answer>` लाई सन्दर्भ गर्छ; सिधै त्यही इनपुटलाई सन्दर्भ गर्नुहोस्।

label-for-answer-without-input = `<label>` माथिको `for` एट्रिब्युटले लेबल दिन मिल्ने इनपुट नभएको `<answer>` लाई सन्दर्भ गर्छ।

label-for-must-reference-input-or-answer = `<label>` माथिको `for` एट्रिब्युटले कुनै इनपुट वा answer लाई सन्दर्भ गर्नुपर्छ।

## Accessibility

accessibility-short-description-or-decorative = पहुँचयोग्यताका लागि `<{ $component }>` सँग या त छोटो विवरण हुनुपर्छ, या यसलाई सजावटी भनी तोक्नुपर्छ।

accessibility-video-short-description = पहुँचयोग्यताका लागि `<video>` सँग छोटो विवरण हुनुपर्छ।

accessibility-input-short-description-or-label = पहुँचयोग्यताका लागि `<{ $component }>` सँग छोटो विवरण वा लेबल हुनुपर्छ।

accessibility-answer-input-short-description-or-label = पहुँचयोग्यताका लागि इनपुट बनाउने `<answer>` सँग छोटो विवरण वा लेबल हुनुपर्छ।

accessibility-short-description-contains-math = छोटो विवरणमा `<{ $component }>` जस्ता गणित घटक हुनु हुँदैन। कुनै पनि गणित शब्दमा लेख्नुहोस्।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] खण्ड शीर्षकको पाठका लागि { $colorName } को कन्ट्रास्ट पर्याप्त छैन (गाढा मोड) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम्तीमा { $threshold }:1 चाहिन्छ)।
       *[other] खण्ड शीर्षकको पाठका लागि { $colorName } को कन्ट्रास्ट पर्याप्त छैन ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम्तीमा { $threshold }:1 चाहिन्छ)।
    }

## `<circle>`

circle-through-points-non-numerical = बिन्दुहरूमा सङ्ख्यात्मक मान नहुँदा { $count } बिन्दुबाट जाने `<circle>` कार्यान्वयन गरिएको छैन।

circle-too-many-through-points = 3 भन्दा बढी बिन्दुबाट वृत्त निकाल्न सकिँदैन।

circle-overprescribed-radius-center-points = तोकिएको अर्धव्यास, केन्द्र र जाने बिन्दुहरूले वृत्त निकाल्न सकिँदैन।

circle-center-with-multiple-points = तोकिएको केन्द्र र 1 भन्दा बढी बिन्दुबाट वृत्त निकाल्न सकिँदैन।

circle-radius-too-small = वृत्त निकाल्न सकिँदैन: दुई बिन्दुबीचको दूरी { $distance } भएकाले तोकिएको अर्धव्यास { $radius } धेरै सानो छ।

circle-radius-with-many-points = तोकिएको अर्धव्यासका साथ दुईभन्दा बढी बिन्दुबाट वृत्त बनाउन सकिँदैन।

circle-invalid-center-or-through-points = वृत्तको केन्द्र वा जाने बिन्दुहरू अमान्य छन्।

circle-radius-center-with-multiple-points = तोकिएको केन्द्र र 1 भन्दा बढी बिन्दुबाट वृत्तको अर्धव्यास निकाल्न सकिँदैन।

circle-change-radius-non-numerical = सङ्ख्यात्मक नभएका जाने बिन्दुसहितको वृत्तको अर्धव्यास बदल्न सकिँदैन

circle-radius-with-points-non-numerical = सङ्ख्यात्मक मान नहुँदा तोकिएको अर्धव्यासका साथ एकभन्दा बढी बिन्दुबाट वृत्त बनाउन सकिँदैन।

circle-change-center-non-numerical = सङ्ख्यात्मक नभएका बिन्दुबाट जाने वृत्तको केन्द्र बदल्ने काम कार्यान्वयन गरिएको छैन।

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] फलनको क्षेत्रका आयाम पर्याप्त छैनन्। क्षेत्रमा { $intervals } अन्तराल छ तर फलनमा { $inputs ->
            [one] { $inputs } इनपुट
           *[other] { $inputs } इनपुट
        } छन्।
       *[other] फलनको क्षेत्रका आयाम पर्याप्त छैनन्। क्षेत्रमा { $intervals } अन्तराल छन् तर फलनमा { $inputs ->
            [one] { $inputs } इनपुट
           *[other] { $inputs } इनपुट
        } छन्।
    }

function-domain-invalid-format = फलनको क्षेत्रको ढाँचा अमान्य छ।

function-ignoring-non-numerical =
    { $type ->
        [maximum] फलनको सङ्ख्यात्मक नभएको अधिकतम मान बेवास्ता गरिँदै छ।
        [minimum] फलनको सङ्ख्यात्मक नभएको न्यूनतम मान बेवास्ता गरिँदै छ।
        [extremum] फलनको सङ्ख्यात्मक नभएको चरम मान बेवास्ता गरिँदै छ।
        [point] फलनको सङ्ख्यात्मक नभएको बिन्दु बेवास्ता गरिँदै छ।
        [slope] फलनको सङ्ख्यात्मक नभएको ढलान बेवास्ता गरिँदै छ।
       *[other] फलनको सङ्ख्यात्मक नभएको { $type } बेवास्ता गरिँदै छ।
    }

function-ignoring-empty =
    { $type ->
        [maximum] फलनको खाली अधिकतम मान बेवास्ता गरिँदै छ।
        [minimum] फलनको खाली न्यूनतम मान बेवास्ता गरिँदै छ।
        [extremum] फलनको खाली चरम मान बेवास्ता गरिँदै छ।
        [point] फलनको खाली बिन्दु बेवास्ता गरिँदै छ।
       *[other] फलनको खाली { $type } बेवास्ता गरिँदै छ।
    }

function-points-too-close = फलनमा दुई बिन्दुका स्थान अति नजिक छन्। फलन परिभाषित गर्न सकिँदैन।

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] फलनको इनपुटको सङ्ख्या आउटपुटको सङ्ख्याबराबर भएमा मात्र फलन पुनरावृत्ति सम्भव छ। यो फलनमा { $inputs } इनपुट र { $outputs ->
            [one] { $outputs } आउटपुट
           *[other] { $outputs } आउटपुट
        } छन्।
       *[other] फलनको इनपुटको सङ्ख्या आउटपुटको सङ्ख्याबराबर भएमा मात्र फलन पुनरावृत्ति सम्भव छ। यो फलनमा { $inputs } इनपुट र { $outputs ->
            [one] { $outputs } आउटपुट
           *[other] { $outputs } आउटपुट
        } छन्।
    }

## `<sequence>`

sequence-invalid-length = अनुक्रमको लम्बाइ अमान्य छ।  यो ऋणात्मक नभएको पूर्णाङ्क हुनुपर्छ।

sequence-invalid-step = अनुक्रमको पाइला अमान्य छ।  { $type } प्रकारको अनुक्रमका लागि यो सङ्ख्या हुनुपर्छ।

sequence-invalid-endpoint-number = सङ्ख्या अनुक्रमको "{ $attribute }" अमान्य छ।  यो सङ्ख्या हुनुपर्छ।

sequence-invalid-endpoint-letters = अक्षर अनुक्रमको "{ $attribute }" अमान्य छ।  यो अक्षर समूह हुनुपर्छ।

sequence-invalid-endpoint = अनुक्रमको "{ $attribute }" अमान्य छ।

select-from-sequence-coprime-not-numbers = सङ्ख्या छानिँदै नभएकाले coprime बेवास्ता गरियो

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations तोकिएकाले coprime बेवास्ता गरियो

## Resolving a `target`

target-not-found = `<{ $source }>` का लागि target अमान्य: लक्ष्य भेटिएन।

target-state-variable-not-found = `<{ $source }>` का लागि target अमान्य: `<{ $component }>` मा "{ $property }" नामको स्टेट भेरिएबल भेटिएन।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` का चरहरू स्वतन्त्र चरभन्दा फरक हुनुपर्छ।

ode-system-duplicate-variable-names = एउटै नामका आश्रित चरसहित ODE RHS फलन परिभाषित गर्न सकिँदैन।

ode-system-rhs-function-error = ODE RHS फलन परिभाषित गर्न सकिँदैन।  mathjs फलन बनाउँदा त्रुटि।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } रेखाबीचको कोण परिभाषित गर्न सकिँदैन

angle-invalid-through-point = `<angle>` को through मा बिन्दु अमान्य छ

parabola-vertex-too-many-points = शीर्षबिन्दुसहित 1 भन्दा बढी बिन्दुबाट परवलय कार्यान्वयन गरिएको छैन।

parabola-too-many-points = 3 भन्दा बढी बिन्दुबाट परवलय कार्यान्वयन गरिएको छैन।

intersection-too-many-items = दुईभन्दा बढी वस्तुको प्रतिच्छेदन कार्यान्वयन गरिएको छैन

## Other math components

ionic-compound-not-two-ions = दुई आयनबाहेक अरू कुनै कुराका लागि आयनिक यौगिक कार्यान्वयन गरिएको छैन।

ionic-compound-needs-cation-and-anion = आयनिक यौगिक एउटा धनायन र एउटा ऋणायनका लागि मात्र कार्यान्वयन गरिएको छ।

solve-equations-cannot-evaluate = समीकरणको मान निकाल्न नसकिएकाले यसलाई हल गर्न सकिँदैन: { $equation }

math-operators-operand-number-required = गणितीय पद निकाल्दा operandNumber तोक्नुपर्छ।

eigen-decomposition-failed = म्याट्रिक्सका आइगेन मान निकाल्न सकिएन

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } प्यारामिटर ढाँचामा छैन, त्यसैले यो सधैँ खालीसँग मिल्नेछ।
       *[other] `<matchesPattern>`: { $parameters } प्यारामिटरहरू ढाँचामा छैनन्, त्यसैले तिनीहरू सधैँ खालीसँग मिल्नेछन्।
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" बुझ्न सकिँदैन। यो none, medium, dense, वा एउटा स्पेसले छुट्याइएका दुई धनात्मक सङ्ख्या हुनुपर्छ, जस्तै grid="1 0.5"। कुनै ग्रिड कोरिने छैन।

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure रेन्डररमा xLabelPosition="left" समर्थित छैन; दायाँतिरको व्यवहार प्रयोग गरिँदै छ।

prefigure-y-label-position-unsupported = `<graph>`: prefigure रेन्डररमा yLabelPosition="bottom" समर्थित छैन; माथिको व्यवहार प्रयोग गरिँदै छ।

prefigure-invalid-axis-bounds = `<graph>`: prefigure रूपान्तरणका लागि अक्षका सिमाना अमान्य छन्; पूर्वनिर्धारित bbox (-10,-10,10,10) प्रयोग गरिँदै छ।

prefigure-invalid-width = `<graph>`: prefigure रूपान्तरणका लागि चौडाइ अमान्य छ; पूर्वनिर्धारित चित्र चौडाइ 425 प्रयोग गरिँदै छ।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure रूपान्तरणका लागि aspectRatio अमान्य छ; पूर्वनिर्धारित अनुपात 1 प्रयोग गरिँदै छ।

prefigure-grid-spacing-too-fine = `<graph>`: अक्षका सिमानाको तुलनामा ग्रिडको दूरी अति सूक्ष्म छ; prefigure रेन्डररमा ग्रिड हटाइएको छ।

prefigure-annotations-not-rendered = `<graph>`: PreFigure रेन्डरर प्रयोग नगरेमा टिप्पणी रेन्डर गरिने छैनन्।

multiple-annotations-children = `<graph>` मा धेरै `<annotations>` सन्तान भेटिए; अन्तिमबाहेक सबै बेवास्ता गरिएका छन्।

## Referring to other components

copy-unrecognized-component-type = नचिनिएको घटक प्रकार विस्तार वा प्रतिलिपि गर्न सकिँदैन: { $type }।

copy-prop-not-found = { $component } प्रकारको घटकमा { $property } प्रप भेटिएन

collect-no-source = collect का लागि कुनै स्रोत भेटिएन।

collect-invalid-component-type = `<{ $component }>` प्रकारका घटक सङ्कलन गर्न सकिँदैन, किनभने यो अमान्य घटक प्रकार हो।

reference-index-unavailable = `{ $reference }` सूचकाङ्कलाई सन्दर्भ गर्न सकिँदैन

## `<callAction>`

component-action-unavailable = `{ $reference }` घटकमा { $action } चलाउन सकिँदैन

## `<dataFrame>`

data-frame-inconsistent-row-lengths = डाटाको आकार अमान्य छ।  पङ्क्तिका लम्बाइ असङ्गत छन्। componentIdx :{ $componentIdx } मा भेटियो

data-frame-duplicate-column-names = डाटामा उही नामका स्तम्भ छन्।  componentIdx :{ $componentIdx } मा भेटियो

data-frame-missing-column-name = डाटाको एउटा स्तम्भको नाम छैन।  componentIdx :{ $componentIdx } मा भेटियो

## `<answer>` and scoring

answer-award-depends-on-own-response = यो answer को एउटा award उही answer ट्यागको आफ्नै पठाइएको उत्तरमा आधारित छ, जसले अनपेक्षित व्यवहार निम्त्याउनेछ।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` भएको धारकभित्रको `<answer>` मा `maxNumAttempts` राख्दा कुनै प्रभाव पर्दैन, किनभने प्रयासको सङ्ख्या धारकले नै नियन्त्रण गर्छ। बरु धारकमा `maxNumAttempts` राख्नुहोस्।

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` भएको अर्को धारकभित्रको `sectionWideCheckWork` धारकमा `maxNumAttempts` राख्दा कुनै प्रभाव पर्दैन, किनभने प्रयासको सङ्ख्या बाहिरी धारकले नै नियन्त्रण गर्छ। बरु बाहिरी धारकमा `maxNumAttempts` राख्नुहोस्।

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality नराखिएमा { $attributes } एट्रिब्युटको कुनै प्रभाव हुनेछैन।
       *[other] symbolicEquality नराखिएमा { $attributes } एट्रिब्युटहरूको कुनै प्रभाव हुनेछैन।
    }

answer-invalid-type = answer का लागि प्रकार अमान्य: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` घटकको नाम नभएकाले यसलाई module को एट्रिब्युटका रूपमा प्रयोग गर्न सकिँदैन

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` घटकलाई module को एट्रिब्युटका रूपमा प्रयोग गर्न सकिँदैन, किनभने `<module>` घटक प्रकारमा पहिले नै "{ $name }" नामको एट्रिब्युट परिभाषित छ।

conditional-content-condition-ignored = case वा else सन्तान भएको `<conditionalContent>` घटकमा `condition` एट्रिब्युट बेवास्ता गरिन्छ।

slider-markers-type-mismatch = चिन्हको प्रकार स्लाइडरको प्रकारसँग मिल्दैन।

pretzel-problem-needs-statement-and-answer = pretzel अमान्य: प्रत्येक `<problem>` मा एउटा `<statement>` र एउटा `<answer>` हुनुपर्छ।

pretzel-circuit-first-problem-distractor = pretzel अमान्य: mode="circuit" मा पहिलो `<problem>` भ्रमकारी विकल्प हुन सक्दैन।

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` एट्रिब्युटका लागि { $values } मान अमान्य छ; बेवास्ता गरिँदै छ।
       *[other] `{ $attribute }` एट्रिब्युटका लागि { $values } मानहरू अमान्य छन्; बेवास्ता गरिँदै छन्।
    }

attribute-must-be-references = `{ $attribute }` एट्रिब्युटका लागि `{ $value }` मान अमान्य छ। एट्रिब्युट `$` बाट सुरु हुने सन्दर्भहरूले बनेको हुनुपर्छ।

math-input-invalid-function-names = <mathInput>: { $attribute } मा अमान्य फलन नाम बेवास्ता गरियो: { $names }। प्रत्येक नामको देखिने भाग कम्तीमा 2 अक्षरको (अक्षर वा हाइफन) हुनुपर्छ; त्यसपछि वैकल्पिक रूपमा `|<mathspeak alternative>` भाग आउन सक्छ।

## Building components from the source

component-type-invalid = घटक प्रकार अमान्य: `<{ $componentType }>`

attribute-repeated = { $attribute } एट्रिब्युट दोहोर्‍याउन सकिँदैन।

attribute-invalid-for-component = `<{ $componentType }>` प्रकारको घटकका लागि "{ $attribute }" एट्रिब्युट अमान्य छ।

## Style definition contrast

style-definition-insufficient-contrast =
    शैली परिभाषा { $styleNumber } मा { $context ->
        [text-on-background] पृष्ठभूमिको रङको तुलनामा पाठको रङको
        [high-contrast] क्यानभासको तुलनामा उच्च-कन्ट्रास्ट रङको
        [line] क्यानभासको तुलनामा रेखाको रङको
        [marker] क्यानभासको तुलनामा चिन्हको रङको
       *[text-on-canvas] क्यानभासको तुलनामा पाठको रङको
    } कन्ट्रास्ट पर्याप्त छैन{ $mode ->
        [dark] { " (गाढा मोड)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम्तीमा { $threshold }:1 चाहिन्छ)।

style-definition-dark-mode-text-background-contrast =
    शैली परिभाषा { $styleNumber } मा तोकिएका रङले हल्का मोडमा पर्याप्त कन्ट्रास्ट दिए पनि, ती मानबाट निस्कने गाढा-मोडका रङमा पृष्ठभूमिको रङको तुलनामा पाठको रङको कन्ट्रास्ट पर्याप्त छैन ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम्तीमा { $threshold }:1 चाहिन्छ)। { $suggestion ->
        [available] गाढा मोडमा पर्याप्त कन्ट्रास्टका लागि या त हल्का मोडको कन्ट्रास्ट बढाउनुहोस् (जस्तै { $lightAttribute }="{ $lightColor }" राख्नुहोस्), या गाढा-मोडको रङ आफैँ तोक्नुहोस् (जस्तै { $darkAttribute }="{ $darkColor }" राख्नुहोस्)।
       *[none] गाढा मोडमा पर्याप्त कन्ट्रास्टका लागि हल्का मोडको कन्ट्रास्ट बढाउनुहोस्, वा textColorDarkMode र/वा backgroundColorDarkMode ले निस्कने रङ आफैँ तोक्नुहोस्।
    }

style-definition-dark-mode-text-canvas-contrast =
    शैली परिभाषा { $styleNumber } मा तोकिएको पाठको रङले हल्का मोडमा पर्याप्त कन्ट्रास्ट दिए पनि, त्यो मानबाट निस्कने गाढा-मोडको पाठ रङको क्यानभासको तुलनामा कन्ट्रास्ट पर्याप्त छैन ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम्तीमा { $threshold }:1 चाहिन्छ)। { $suggestion ->
        [available] गाढा मोडमा पर्याप्त कन्ट्रास्टका लागि या त हल्का मोडको कन्ट्रास्ट बढाउनुहोस् (जस्तै textColor="{ $lightColor }" राख्नुहोस्), या गाढा-मोडको रङ आफैँ तोक्नुहोस् (जस्तै textColorDarkMode="{ $darkColor }" राख्नुहोस्)।
       *[none] गाढा मोडमा पर्याप्त कन्ट्रास्टका लागि हल्का मोडको कन्ट्रास्ट बढाउनुहोस्, वा textColorDarkMode ले निस्कने रङ आफैँ तोक्नुहोस्।
    }

section-multiple-style-palettes = एउटा खण्डले एउटै <stylePalette> मात्र छान्न सक्छ; अन्तिम प्रयोग गरिँदै छ।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } का स्वतन्त्र संस्करण निर्धारण गर्न सकिँदैन, किनभने numToSelect ऋणात्मक नभएको पूर्णाङ्क होइन।

variant-num-to-select-not-constant-number = { $component } का स्वतन्त्र संस्करण निर्धारण गर्न सकिँदैन, किनभने numToSelect स्थिर सङ्ख्या होइन।

variant-with-replacement-not-constant-boolean = { $component } का स्वतन्त्र संस्करण निर्धारण गर्न सकिँदैन, किनभने withReplacement स्थिर बुलियन होइन।

variant-select-weight-disables-unique = कुनै विकल्पमा selectWeight वा selectForVariants तोकिएमा select का स्वतन्त्र संस्करण निष्क्रिय हुन्छन्

variant-coprime-undetermined = { $component } का स्वतन्त्र संस्करण निर्धारण गर्न सकिँदैन, किनभने coprime सधैँ असत्य हो कि होइन भन्ने निर्धारण गर्न सकिँदैन।

variant-attribute-not-constant = { $component } का स्वतन्त्र संस्करण निर्धारण गर्न सकिँदैन, किनभने { $attribute } स्थिराङ्क होइन।

variant-attribute-not-number = { $component } का स्वतन्त्र संस्करण निर्धारण गर्न सकिँदैन, किनभने { $attribute } सङ्ख्या होइन।

variant-attribute-wrong-type-for-sequence =
    { $type } प्रकारको { $component } का स्वतन्त्र संस्करण निर्धारण गर्न सकिँदैन, किनभने { $attribute } { $expected ->
        [letters-combination] अक्षर समूह
        [math-expression] मान्य गणितीय अभिव्यक्ति
        [integer] पूर्णाङ्क
       *[number] सङ्ख्या
    } होइन।

variant-length-not-integer = { $component } का स्वतन्त्र संस्करण निर्धारण गर्न सकिँदैन, किनभने length पूर्णाङ्क होइन।

variant-sort-not-implemented = sort सहितको { $component } का स्वतन्त्र संस्करण कार्यान्वयन गरिएका छैनन्

variant-exclude-combinations-not-implemented = excludeCombinations सहितको { $component } का स्वतन्त्र संस्करण कार्यान्वयन गरिएका छैनन्

variant-math-exclude-not-implemented = exclude सहितको math प्रकारको { $component } का स्वतन्त्र संस्करण कार्यान्वयन गरिएका छैनन्

variant-non-constant-exclude-not-implemented = स्थिर नभएको exclude सहितको { $component } का स्वतन्त्र संस्करण कार्यान्वयन गरिएका छैनन्

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure रेन्डररमा समर्थित छैन; सन्तति हटाइयो।

prefigure-descendant-invalid-geometry = { $subject }: ज्यामिति ससीम छैन वा अपूर्ण छ; सन्तति हटाइयो।

prefigure-curve-label-omitted = { $subject }: रूपान्तरित वक्र घटकमा लेबल समर्थित छैनन्; लेबल हटाइयो।

prefigure-curve-unsupported-definition-type = { $subject }: '{ $definitionType }' वक्र फलन परिभाषाको प्रकार समर्थित छैन; सन्तति हटाइयो।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves माथिको flipFunctions एट्रिब्युट समर्थित छैन; सन्तति हटाइयो।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves मा सूत्र-प्रकारका सन्तान फलन मात्र समर्थित छन्; सन्तति हटाइयो।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] रेखा-परिवारको लेबलका लागि
       *[point] बिन्दु लेबलका लागि
    } '{ $labelPosition }' labelPosition समर्थित छैन; PreFigure को पूर्वनिर्धारित मिलान प्रयोग गरियो।

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' भरण शैली PreFigure ले समर्थन गर्दैन; ठोस भरणमा फर्किँदै छ।

prefigure-line-style-unknown = { $subject }: नचिनिएको रेखा शैली '{ $lineStyle }' PreFigure आउटपुटबाट हटाइयो।

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' चिन्ह शैली PreFigure को 'diamond' शैलीसँग मिलाइयो।

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' चिन्ह शैली PreFigure ले समर्थन गर्दैन; पूर्वनिर्धारित शैली प्रयोग गरियो।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` अमान्य; लक्ष्य निर्धारण गर्न सकिँदैन। टिप्पणी हटाइयो।

annotation-ref-multiple-targets = `<annotation>`: `ref` धेरै लक्ष्यमा पुग्यो; पहिलो लक्ष्य प्रयोग गरिँदै छ।

annotation-ref-outside-graph = `<annotation>`: `ref` अमान्य; लक्ष्य समेट्ने graph भन्दा बाहिर छ। टिप्पणी हटाइयो।

annotation-ref-unsupported-target = `<annotation>`: `ref` अमान्य; prefigure रूपान्तरणमा लक्ष्य समर्थित ग्राफिकल वस्तु होइन। टिप्पणी हटाइयो।

annotation-text-missing = `<annotation>`: `text` छैन वा खाली छ; खाली पाठ बनाइँदै छ।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] चक्रीय निर्भरता पत्ता लाग्यो।
       *[other] `<{ $componentType }>` घटक संलग्न चक्रीय निर्भरता पत्ता लाग्यो।
    }

reference-no-referent = सन्दर्भका लागि कुनै लक्ष्य भेटिएन: `{ $reference }`

reference-multiple-referents = सन्दर्भका लागि धेरै लक्ष्य भेटिए: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` को { $attribute } एट्रिब्युटको ढाँचा अमान्य छ।

children-invalid = `<{ $componentType }>` का लागि सन्तान अमान्य: अमान्य सन्तान भेटिए: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` एट्रिब्युटका लागि `{ $value }` मान अमान्य छ, `{ $default }` मान प्रयोग गरिँदै छ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML संस्करण { $version } भेटिएन।
       *[other] DoenetML संस्करण { $version } भेटिएन। संस्करण { $fallback } प्रयोग गरिँदै छ
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML अमान्य: { $content }

parse-tag-missing-close-tag = DoenetML अमान्य: `{ $tag }` ट्यागको बन्द गर्ने ट्याग छैन। आफैँ बन्द हुने ट्याग वा `</{ $tagName }>` ट्याग अपेक्षित थियो।

parse-tag-error = DoenetML अमान्य: `<{ $tagName }>` ट्यागमा त्रुटि

parse-attribute-missing-value = DoenetML अमान्य: `{ $attribute }` एट्रिब्युट अमान्य छ, यसको मान छुटेको देखिन्छ।

parse-attribute-invalid = DoenetML अमान्य: `{ $attribute }` एट्रिब्युट अमान्य छ

parse-attribute-value-invalid = DoenetML अमान्य: `{ $value }` एट्रिब्युट मान अमान्य छ

parse-attribute-value-quote-mismatch = DoenetML अमान्य: `{ $value }` एट्रिब्युट मान अमान्य छ। उद्धरण चिन्ह मिलेनन्। एउटा `{ $quote }` छुटेको देखिन्छ

parse-open-tag-name-missing = DoenetML अमान्य: नाम नभएको ट्याग भेटियो, जस्तै `<`

parse-tag-not-closed = DoenetML अमान्य: `{ $tag }` ट्याग बन्द गरिएको छैन (एउटा `>` छुटेको देखिन्छ)।

parse-self-closing-tag-name-missing = DoenetML अमान्य: नाम नभएको ट्याग भेटियो `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML अमान्य: `{ $tag }` ट्याग बन्द गरिएको छैन (`/>` छुटेको देखिन्छ)।

parse-tag-invalid-attributes = DoenetML अमान्य: `{ $tag }` ट्याग मान्य छैन। यसका एट्रिब्युट गलत हुन सक्छन्।

parse-close-tag-name-missing = DoenetML अमान्य: नाम नभएको बन्द गर्ने ट्याग भेटियो, जस्तै `</`

parse-attribute-value-unquoted = एट्रिब्युट मान उद्धरण चिन्हभित्र हुनुपर्छ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML अमान्य: `{ $tag }` बन्द गर्ने ट्याग भेटियो, तर यससँग मिल्ने खोल्ने ट्याग छैन

parse-close-tag-mismatched = DoenetML अमान्य: बन्द गर्ने ट्याग मिलेन। `</{ $expected }>` अपेक्षित थियो। भेटियो `{ $found }`

parser-node-unconvertible = { $node } नोडलाई Dast नोडमा रूपान्तरण गर्न सकिएन।

## Names

name-attribute-invalid =
    name='{ $name }' एट्रिब्युट अमान्य छ। { $reason ->
        [characters] नाममा अक्षर, अङ्क, अन्डरस्कोर वा हाइफन मात्र हुन सक्छन्।
       *[start] नाम अक्षरबाट सुरु हुनुपर्छ।
    }

component-name-invalid-start = "{ $name }" घटक नाम अमान्य छ। नाम अक्षरबाट सुरु हुनुपर्छ।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched प्रकारको answer मा video एट्रिब्युट हुनुपर्छ

answer-video-watched-video-not-reference = videoWatched प्रकारको answer को video एट्रिब्युट सन्दर्भ हुनुपर्छ

answer-name-not-single-text = answer को name एट्रिब्युटमा एउटै text सन्तान हुनुपर्छ

## Referencing another document

external-doenetml-recursion-limit = पुनरावृत्तिका तह धेरै भएकाले बाहिरी DoenetML ल्याउन सकिँदैन। कतै चक्रीय सन्दर्भ छ कि?

external-doenetml-unavailable = { $attribute }="{ $uri }" बाट DoenetML ल्याउन सकिँदैन

external-doenetml-type-mismatch = { $attribute }="{ $uri }" बाट ल्याइएको DoenetML अमान्य: यो "{ $componentType }" घटक प्रकारसँग मिलेन

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` एट्रिब्युट पुरानो भइसक्यो; बरु `{ $to }` प्रयोग गर्नुहोस्।
       *[other] [deprecation] `<{ $component }>` माथिको `{ $from }` एट्रिब्युट पुरानो भइसक्यो; बरु `{ $to }` प्रयोग गर्नुहोस्।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` पनि तोकिएकाले `{ $from }` एट्रिब्युट पुरानो र बेवास्ता गरिएको छ।
       *[other] [deprecation] `{ $to }` पनि तोकिएकाले `<{ $component }>` माथिको `{ $from }` एट्रिब्युट पुरानो र बेवास्ता गरिएको छ।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` माथिको `{ $attribute }` एट्रिब्युट पुरानो र बेवास्ता गरिएको छ।


## Language coverage

pluralize-english-only = `<pluralize>` ले अङ्ग्रेजीको मात्र बहुवचन बनाउन सक्छ, त्यसैले { $locale } भाषामा लेखिएको कागजातमा यसको पाठ जस्ताको तस्तै रहन्छ। बहुवचन रूप सिधै लेख्नुहोस्, वा `pluralForm` एट्रिब्युटले तोक्नुहोस्।


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` घटक Doenet ले चिन्ने घटक होइन।

schema-element-not-allowed-at-root = `<{ $tag }>` घटक कागजातको जरामा अनुमत छैन।

schema-element-not-allowed-inside = `<{ $tag }>` घटक `<{ $parent }>` भित्र अनुमत छैन।

schema-attribute-unrecognized = `<{ $tag }>` घटकमा `{ $attribute }` नामको एट्रिब्युट छैन।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` घटकको `{ $attribute }` एट्रिब्युट यस्तो सूची हुनुपर्छ जसका प्रत्येक वस्तु यीमध्ये एक हुन्: { $allowed }
       *[other] `<{ $tag }>` घटकको `{ $attribute }` एट्रिब्युट यीमध्ये एक हुनुपर्छ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select का लागि संस्करण नाम अमान्य।  { $variantName } संस्करण नाम { $numOptions } विकल्पमा आउँछ तर छान्नुपर्ने सङ्ख्या { $numToSelect } हो।

select-variant-name-without-options = select का लागि केही संस्करण तोकिएका छन् तर सम्भावित संस्करण नाम { $variantName } का लागि कुनै विकल्प तोकिएको छैन।

select-variant-name-not-possible = select का लागि तोकिएको { $variantName } संस्करण नाम सम्भावित संस्करण नाम होइन।

select-too-few-options = { $numOptions } मात्रैबाट { $numToSelect } घटक छान्न सकिँदैन।

select-from-sequence-too-few-values = { $length } लम्बाइको अनुक्रमबाट { $numToSelect } मान छान्न सकिँदैन।

select-from-sequence-indices-count-mismatch = select का लागि तोकिएका सूचकाङ्कको सङ्ख्या छान्नुपर्ने सङ्ख्यासँग मिल्नुपर्छ

select-from-sequence-indices-not-integers = select का लागि तोकिएका सबै सूचकाङ्क पूर्णाङ्क हुनुपर्छ

select-from-sequence-index-excluded = selectfromsequence को जुन सूचकाङ्क तोकिएको थियो त्यो हटाइएको थियो

select-from-sequence-indices-excluded-combination = selectfromsequence का जुन सूचकाङ्क तोकिएका थिए ती हटाइएको संयोजन थियो

select-from-sequence-coprime-not-positive-integers = धनात्मक पूर्णाङ्क छानिँदै नभएकाले सहअभाज्य संयोजन छान्न सकिँदैन।

select-from-sequence-coprime-common-factor = सहअभाज्य सङ्ख्या छान्न सकिँदैन। सबै सम्भावित मानको एउटा साझा गुणनखण्ड छ। ("from" वा "to" का तोकिएका मान "step" सँग सहअभाज्य हुनुपर्छ।)

select-from-sequence-coprime-single-number = 1 नभएको एउटै सङ्ख्याबाट सहअभाज्य संयोजन छान्न सकिँदैन।

select-from-sequence-excluded-too-many-combinations = selectFromSequence मा 70% भन्दा बढी संयोजन हटाइयो

select-from-sequence-coprime-none-found = सहअभाज्य सङ्ख्या छान्न सकिएन। सबै सम्भावित मानको एउटा साझा गुणनखण्ड छ।

select-from-sequence-too-few-unique-values = { $numPossibleValues } लम्बाइको अनुक्रमबाट { $numToSelect } स्वतन्त्र मान छान्न सकिँदैन

select-prime-numbers-too-few-values = { $numValues } लम्बाइको अभाज्य सङ्ख्याको सूचीबाट { $numToSelect } मान छान्न सकिँदैन

select-prime-numbers-values-count-mismatch = select का लागि तोकिएका मानको सङ्ख्या छान्नुपर्ने सङ्ख्यासँग मिल्नुपर्छ

select-prime-numbers-values-not-prime = select prime number का लागि तोकिएका सबै मान अभाज्य सङ्ख्याको सूचीमा हुनुपर्छ

select-prime-numbers-values-excluded-combination = selectPrimeNumbers का तोकिएका मान हटाइएको संयोजन थिए

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers मा 70% भन्दा बढी संयोजन हटाइयो

select-random-combination-fluke = अत्यन्तै असम्भव संयोगले अनियमित मानको संयोजन छान्न सकिएन

select-random-value-fluke = अत्यन्तै असम्भव संयोगले अनियमित मान छान्न सकिएन
