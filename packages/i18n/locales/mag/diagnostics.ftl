# Magahi (मगही) diagnostics: the warnings and errors the worker raises and the
# reader is shown. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth. Selected by `uiLocale`, not by the language the document
# was written in.
#
# Message ids are never translated — only the text to the right of `=`.
# Neither are the DoenetML identifiers quoted inside these sentences:
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `maxNumAttempts`,
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
# These are the words a Magahi reader has met; inventing equivalents would put
# words in front of a reader that nobody uses.
#
# **What is Magahi is the frame**, and it carries the whole file:
#
#   «हइ»                      the copula
#   «ना»                      the negator
#   «ना कएल जा सकऽ हइ»        *cannot be done*
#   «छोड़ल जा रहल हइ»         *ignoring*
#   «धेयान ना देल जा हइ»      *is ignored*
#   «होवे के चाही»            *must be*
#   «काहेकि»                  *because*; «तेकरा लेल» *therefore*
#   «अखने उपलब्ध ना हइ»       *has not been implemented*
#   «लेल»                     *for* — the dative, and the file's signature
#   «में»                     the locative; «के» the genitive and accusative
#   «आउ» / «या» / «अगर»       *and* / *or* / *if*
#   «जे» / «जेकर»             the relative pronoun and its genitive
#   «सब»                      the plural, written after the noun
#   -ल                        the participle: देल, कएल, मिलल, छोड़ल, लिखल
#
# A sentence that has slipped back into «है», «नहीं», «क्योंकि» or «के लिए»
# is a mistake to fix rather than a stylistic choice. This is a **framed**
# catalog: the sentences are Magahi, the nouns inside them are declared Hindi,
# and a speaker should expect to correct the sentences as often as the words.
#
# **The present habitual «-ऽ हइ» is the seed's least certain choice.** It
# writes «होवऽ हइ», «देवऽ हइ», «करऽ हइ» with an avagraha for the lengthened
# stem vowel, which is one of several conventions in printed Magahi; a
# reviewer who prefers «होबऽ हइ», «होवे हइ» or a plain «होवइ» should change
# all four files at once rather than message by message.
#
# **No plural branches.** CLDR has no plural data for `mag`, so every
# `[one]`/`[other]` fork English writes over a count is collapsed here; most
# become a plain message, since a Magahi noun is unmarked after a numeral. The
# one exception is `field-function-wrong-num-outputs`, where English is not
# counting but distinguishing a one-output field from a two-output one; that
# fork is kept as the numeric literal `[1]`, which Fluent matches against the
# number itself rather than against a plural category.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = दू सिरा देल जाय पर { $attributes } पर धेयान ना देल जा हइ

line-segment-attributes-ignored-with-endpoint-and-midpoint = सिरा आउ मध्यबिंदु दूनू देल जाय पर { $attributes } पर धेयान ना देल जा हइ

line-segment-midpoint-offset-without-midpoint = मध्यबिंदु के बिना midpointOffset के कोनो असर ना होवऽ हइ

## `<line>`

line-points-undetermined-dimensions = अइसन बिंदु सब से होके जाय वाली रेखा जेकर विमा तय ना हइ।

line-points-too-few-dimensions = रेखा के कम से कम दू विमा वाले बिंदु सब से होके जाय के चाही।

line-points-depend-on-variables = रेखा ओह बिंदु सब से होके जा रहल हइ जे चर सब पर निर्भर हइ: { $variables }।

line-equation-invalid-format = चर { $variable1 } आउ { $variable2 } में रेखा के समीकरण के प्रारूप अमान्य हइ।

## `<ray>`

ray-overprescribed-through = किरण एके संग through, endpoint आउ direction से तय हइ। देल गेल through छोड़ल जा रहल हइ।

ray-dimension-mismatch = किरण में numDimensions मेल ना खाय हइ।

## `<vector>`

vector-overprescribed-head = सदिश एके संग head, tail आउ displacement से तय हइ। देल गेल head छोड़ल जा रहल हइ।

vector-dimension-mismatch = सदिश में numDimensions मेल ना खाय हइ।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` के ओर खींचा ना जा सकऽ हइ, काहेकि ओह में nearestPoint अवस्था चर ना हइ।

constrain-to-without-nearest-point = `<{ $component }>` तक सीमित ना कएल जा सकऽ हइ, काहेकि ओह में nearestPoint अवस्था चर ना हइ।

constrain-to-interior-without-nearest-point = `<{ $component }>` के भीतरी भाग तक सीमित ना कएल जा सकऽ हइ, काहेकि ओह में nearestPoint अवस्था चर ना हइ।

## `<choiceInput>`

choice-input-label-position-ignored = अंतःपंक्ति न होय वाले choiceInput लेल labelPosition पर धेयान ना देल जा हइ

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput लेल देल गेल indices छोड़ल जा रहल हइ, काहेकि indices के संख्या choice संतान सब के संख्या से मेल ना खाय हइ।

pretzel-indices-count-mismatch = problem लेल देल गेल indices छोड़ल जा रहल हइ, काहेकि indices के संख्या problem संतान सब के संख्या से मेल ना खाय हइ।

shuffle-indices-count-mismatch = shuffle लेल देल गेल indices छोड़ल जा रहल हइ, काहेकि indices के संख्या घटक सब के संख्या से मेल ना खाय हइ।

indices-ignored-out-of-range = { $component } लेल देल गेल indices छोड़ल जा रहल हइ, काहेकि कुछ अनुक्रमांक परिसर से बाहर हइ।

pretzel-indices-repeated = pretzel लेल देल गेल indices छोड़ल जा रहल हइ, काहेकि कुछ अनुक्रमांक दोहरावल गेल हइ।

pretzel-circuit-first-index = circuit विधा में pretzel लेल देल गेल indices छोड़ल जा रहल हइ, काहेकि पहिलका अनुक्रमांक 1 होवे के चाही।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` के पाठ संतान सब के संग काम करे लेल `type` विशेषता देवे के चाही।

invalid-type-defaulting-to-math = { $component } घटक लेल प्रकार { $type } अमान्य हइ। ई math, text, number या boolean में से एक होवे के चाही। math के उपयोग कएल जा रहल हइ।

string-not-valid-component-to-arrange = पाठ "{ $value }" { $component } लेल मान्य घटक ना हइ। छोड़ल जा रहल हइ।

## Types and variables

invalid-type-defaulting-to-number = प्रकार { $type } अमान्य हइ; प्रकार number कएल जा रहल हइ।

invalid-variable-value = चर के मान अमान्य हइ: `{ $value }`

## Variants

variant-index-must-be-number = संस्करण अनुक्रमांक { $index } संख्या होवे के चाही

variant-index-must-be-integer = संस्करण अनुक्रमांक { $index } पूर्णांक होवे के चाही

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` निरपेक्ष माप लेल अखने उपलब्ध ना हइ। चौड़ाई सापेक्ष कएल जा रहल हइ।

side-by-side-absolute-margins = `<{ $component }>` निरपेक्ष माप लेल अखने उपलब्ध ना हइ। हाशिया सापेक्ष कएल जा रहल हइ।

side-by-side-no-block-child = अमान्य `<{ $component }>`: ई में कम से कम एक खंड संतान होवे के चाही।

## `<label>`

label-for-ignored-on-graphical = आलेखीय `<label>` पर `for` विशेषता पर धेयान ना देल जा हइ।

label-for-must-resolve-to-one = `<label>` पर `for` विशेषता ठीक एके घटक तक पहुँचे के चाही।

label-for-unresolved = `<label>` पर `for` विशेषता कोनो घटक तक ना पहुँच सकल।

label-for-answer-with-authored-inputs = `<label>` पर `for` विशेषता अइसन `<answer>` के संदर्भ देवऽ हइ जेकरा में इनपुट खुद लिखा गेल हइ; सीधे ओहि इनपुट के संदर्भ दऽ।

label-for-answer-without-input = `<label>` पर `for` विशेषता अइसन `<answer>` के संदर्भ देवऽ हइ जेकरा में लेबल लगावे लायक इनपुट ना हइ।

label-for-must-reference-input-or-answer = `<label>` पर `for` विशेषता कोनो इनपुट या कोनो जवाब के संदर्भ देवे के चाही।

## Accessibility

accessibility-short-description-or-decorative = सुगम्यता लेल `<{ $component }>` के या त संछिप्त विवरण होवे के चाही या ओकरा सजावटी बतावा जाय के चाही।

accessibility-video-short-description = सुगम्यता लेल `<video>` के संछिप्त विवरण होवे के चाही।

accessibility-input-short-description-or-label = सुगम्यता लेल `<{ $component }>` के संछिप्त विवरण या लेबल होवे के चाही।

accessibility-answer-input-short-description-or-label = सुगम्यता लेल इनपुट बनावे वाले `<answer>` के संछिप्त विवरण या लेबल होवे के चाही।

accessibility-short-description-contains-math = संछिप्त विवरण में `<{ $component }>` जइसे गणितीय घटक ना होवे के चाही। गणित के सब्द सब में लिखू।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } के खंड सीर्षक के पाठ लेल वैषम्य अपर्याप्त हइ (गाढ़ विधा) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाही)।
       *[other] { $colorName } के खंड सीर्षक के पाठ लेल वैषम्य अपर्याप्त हइ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाही)।
    }

## `<circle>`

circle-through-points-non-numerical = जब बिंदु सब के संख्यात्मक मान न होंय, तब { $count } बिंदु सब से होके जाय वाला `<circle>` अखने उपलब्ध ना हइ।

circle-too-many-through-points = 3 से जादा बिंदु सब से होके जाय वाला वृत्त ना निकाला जा सकऽ हइ।

circle-overprescribed-radius-center-points = त्रिज्या, केंद्र आउ गुजरे वाले बिंदु एके संग देल जाय पर वृत्त ना निकाला जा सकऽ हइ।

circle-center-with-multiple-points = देल गेल केंद्र के संग 1 से जादा बिंदु से होके जाय वाला वृत्त ना निकाला जा सकऽ हइ।

circle-radius-too-small = वृत्त ना निकाला जा सकऽ हइ: दूनू बिंदु सब के बीच के दूरी { $distance } हइ, तेकरा लेल देल गेल त्रिज्या { $radius } बहुत छोट हइ।

circle-radius-with-many-points = देल गेल त्रिज्या के संग दू से जादा बिंदु सब से होके जाय वाला वृत्त ना बनावा जा सकऽ हइ।

circle-invalid-center-or-through-points = वृत्त के केंद्र या गुजरे वाले बिंदु अमान्य हइ।

circle-radius-center-with-multiple-points = देल गेल केंद्र के संग 1 से जादा बिंदु से होके जाय वाले वृत्त के त्रिज्या ना निकाली जा सकऽ हइ।

circle-change-radius-non-numerical = जौन वृत्त के गुजरे वाले बिंदु संख्यात्मक ना हइ, ओकर त्रिज्या ना बदली जा सकऽ हइ

circle-radius-with-points-non-numerical = संख्यात्मक मान न होय पर, देल गेल त्रिज्या के संग एक से जादा बिंदु से होके जाय वाला वृत्त ना बनावा जा सकऽ हइ।

circle-change-center-non-numerical = असंख्यात्मक बिंदु सब से होके जाय वाले वृत्त के केंद्र बदलब अखने उपलब्ध ना हइ।

## `<function>`

function-domain-insufficient-dimensions = फलन के प्रांत के विमा अपर्याप्त हइ। प्रांत में { $intervals } अंतराल हइ, बाकिर फलन में { $inputs } इनपुट हइ।

function-domain-invalid-format = फलन के प्रांत के प्रारूप अमान्य हइ।

function-ignoring-non-numerical =
    { $type ->
        [maximum] फलन के असंख्यात्मक उच्चिष्ठ छोड़ल जा रहल हइ।
        [minimum] फलन के असंख्यात्मक निम्निष्ठ छोड़ल जा रहल हइ।
        [extremum] फलन के असंख्यात्मक चरम मान छोड़ल जा रहल हइ।
        [point] फलन के असंख्यात्मक बिंदु छोड़ल जा रहल हइ।
        [slope] फलन के असंख्यात्मक प्रवणता छोड़ल जा रहल हइ।
       *[other] फलन के असंख्यात्मक { $type } छोड़ल जा रहल हइ।
    }

function-ignoring-empty =
    { $type ->
        [maximum] फलन के खाली उच्चिष्ठ छोड़ल जा रहल हइ।
        [minimum] फलन के खाली निम्निष्ठ छोड़ल जा रहल हइ।
        [extremum] फलन के खाली चरम मान छोड़ल जा रहल हइ।
        [point] फलन के खाली बिंदु छोड़ल जा रहल हइ।
       *[other] फलन के खाली { $type } छोड़ल जा रहल हइ।
    }

function-points-too-close = फलन में दू बिंदु बहुत पास-पास हइ। फलन परिभाषित ना कएल जा सकऽ हइ।

function-iterates-input-output-mismatch = फलन के पुनरावर्तन तबहीं संभव हइ जब इनपुट के संख्या आउटपुट के संख्या के बराबर होय। ई फलन में { $inputs } इनपुट आउ { $outputs } आउटपुट हइ।

## `<sequence>`

sequence-invalid-length = अनुक्रम के लंबाई अमान्य हइ। ई ऋणेतर पूर्णांक होवे के चाही।

sequence-invalid-step = अनुक्रम के चरण अमान्य हइ। { $type } प्रकार के अनुक्रम लेल ई संख्या होवे के चाही।

sequence-invalid-endpoint-number = संख्या अनुक्रम के "{ $attribute }" अमान्य हइ। ई संख्या होवे के चाही।

sequence-invalid-endpoint-letters = अच्छर अनुक्रम के "{ $attribute }" अमान्य हइ। ई अच्छर सब के संयोजन होवे के चाही।

sequence-invalid-endpoint = अनुक्रम के "{ $attribute }" अमान्य हइ।

select-from-sequence-coprime-not-numbers = संख्या ना चुनी जात, तेकरा लेल coprime छोड़ा गेल

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations देल गेल हइ, तेकरा लेल coprime छोड़ा गेल

## Resolving a `target`

target-not-found = `<{ $source }>` लेल target अमान्य हइ: लक्ष्य ना मिलल।

target-state-variable-not-found = `<{ $source }>` लेल target अमान्य हइ: `<{ $component }>` पर "{ $property }" नाम के अवस्था चर ना मिलल।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` के चर स्वतंत्र चर से अलग होवे के चाही।

ode-system-duplicate-variable-names = दोहरावल गेल आश्रित चर नाम सब के संग ODE के दाहिन पच्छ के फलन परिभाषित ना कएल जा सकऽ हइ।

ode-system-rhs-function-error = ODE के दाहिन पच्छ के फलन परिभाषित ना कएल जा सकऽ हइ। mathjs फलन बनावत समय त्रुटि भेल।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } रेखा सब के बीच के कोण परिभाषित ना कएल जा सकऽ हइ

angle-invalid-through-point = `<angle>` के through में अमान्य बिंदु हइ

parabola-vertex-too-many-points = देल गेल सीर्ष के संग 1 से जादा बिंदु से होके जाय वाला परवलय अखने उपलब्ध ना हइ।

parabola-too-many-points = 3 से जादा बिंदु सब से होके जाय वाला परवलय अखने उपलब्ध ना हइ।

intersection-too-many-items = दू से जादा वस्तु सब के प्रतिच्छेदन अखने उपलब्ध ना हइ

## Other math components

ionic-compound-not-two-ions = दू आयन सब के अलावा कोनो आउ हालत लेल आयनिक यौगिक अखने उपलब्ध ना हइ।

ionic-compound-needs-cation-and-anion = आयनिक यौगिक खाली एक धनायन आउ एक ऋणायन लेल उपलब्ध हइ।

solve-equations-cannot-evaluate = समीकरण के मान ना निकाला जा सकल, तेकरा लेल ऊ हल ना कएल जा सकऽ हइ: { $equation }

math-operators-operand-number-required = गणितीय संकार्य निकालत समय operandNumber देब जरूरी हइ।

eigen-decomposition-failed = आव्यूह के अभिलच्छनिक मान ना निकाले जा सकल

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: प्राचल { $parameters } पैटर्न में ना आवऽ हइ, तेकरा लेल ऊ सदा खाली से मेल खाई।

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" समझा ना जा सकल। ई none, medium, dense, या खाली जगह से अलगावल दू धनात्मक संख्या होवे के चाही, जइसे grid="1 0.5"। कोनो ग्रिड ना खींचा जाई।

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` के अइसन फलन चाही जेकरा में { $expected ->
        [1] एक आउटपुट होय, हर बिंदु पर प्रवणता y', जइसे `y - x`
       *[other] दू आउटपुट होंय, हर बिंदु पर सदिश, जइसे `(y, -x)`
    }, बाकिर जौन फलन देल गेल ओह में { $found } आउटपुट हइ। { $alternative ->
        [none] कुछ ना खींचा जाई।
       *[other] ओह फलन लेल `<{ $alternative }>` घटक हइ। कुछ ना खींचा जाई।
    }

field-function-attribute-ignored-with-child = `function` विशेषता पर धेयान ना देल जा हइ, काहेकि फलन घटक के भीतर भी देल गेल हइ; भीतर वाला लेल जा रहल हइ। फलन दूनू में से खाली एके तरह से दऽ।

field-variables-ignored =
    `<{ $component }>`: `variables` विशेषता ओह व्यंजक के चर सब के नाम देवऽ हइ जौन सीधे घटक के भीतर लिखा गेल हइ। { $reason ->
        [function-child] इहाँ फलन `<function>` संतान के रूप में देल गेल हइ, जौन आपन चर खुद बतावत हइ, तेकरा लेल `variables` छोड़ल जा रहल हइ।
       *[no-expression] इहाँ अइसन कोनो व्यंजक ना देल गेल, तेकरा लेल `variables` छोड़ल जा रहल हइ।
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure रेंडरर में xLabelPosition="left" समर्थित ना हइ; दाहिन ओर वाला बरताव लेल जा रहल हइ।

prefigure-y-label-position-unsupported = `<graph>`: prefigure रेंडरर में yLabelPosition="bottom" समर्थित ना हइ; ऊपर वाला बरताव लेल जा रहल हइ।

prefigure-invalid-axis-bounds = `<graph>`: prefigure रूपांतरण लेल अच्छ सीमा अमान्य हइ; पूर्वनिर्धारित bbox (-10,-10,10,10) लेल जा रहल हइ।

prefigure-invalid-width = `<graph>`: prefigure रूपांतरण लेल चौड़ाई अमान्य हइ; पूर्वनिर्धारित आरेख चौड़ाई 425 लेल जा रहल हइ।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure रूपांतरण लेल aspectRatio अमान्य हइ; पूर्वनिर्धारित अनुपात 1 लेल जा रहल हइ।

prefigure-grid-spacing-too-fine = `<graph>`: अच्छ सीमा के हिसाब से ग्रिड के अंतराल बहुत महीन हइ; prefigure रेंडरर में ग्रिड छोड़ल जा रहल हइ।

prefigure-annotations-not-rendered = `<graph>`: PreFigure रेंडरर के उपयोग न होय पर टीका ना खींची जाई।

multiple-annotations-children = `<graph>` में एक से जादा `<annotations>` संतान मिललं; अंतिम के छोड़िके सब पर धेयान ना देल जइतइ।

## Referring to other components

copy-unrecognized-component-type = अपरिचित घटक प्रकार के बढ़ावा या नकल ना कएल जा सकऽ हइ: { $type }।

copy-prop-not-found = { $component } प्रकार के घटक पर { $property } गुण ना मिलल

collect-no-source = collect लेल कोनो स्रोत ना मिलल।

collect-invalid-component-type = `<{ $component }>` प्रकार के घटक बटोरे ना जा सकऽ हइ, काहेकि ई मान्य घटक प्रकार ना हइ।

reference-index-unavailable = अनुक्रमांक `{ $reference }` के संदर्भ ना देल जा सकऽ हइ

## `<callAction>`

component-action-unavailable = घटक `{ $reference }` पर { $action } ना बुलावा जा सकऽ हइ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = आँकड़ा सब के आकार अमान्य हइ। पंक्ति सब के लंबाई असंगत हइ। componentIdx :{ $componentIdx } में मिलल

data-frame-duplicate-column-names = आँकड़ा सब में स्तंभ नाम दोहरावल गेल हइ। componentIdx :{ $componentIdx } में मिलल

data-frame-missing-column-name = आँकड़ा सब में एक स्तंभ नाम ना हइ। componentIdx :{ $componentIdx } में मिलल

## `<answer>` and scoring

answer-award-depends-on-own-response = ई जवाब के एक award खुद answer टैग के पठावल जवाब पर टिका हइ, जेह से अनचाहा बरताव होई।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` वाले पात्र के भीतर के `<answer>` पर `maxNumAttempts` राखे के कोनो असर ना होवऽ हइ, काहेकि मौका सब के संख्या पात्र तय करऽ हइ। `maxNumAttempts` पात्र पर राखू।

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` वाले कोनो आउ पात्र के भीतर बैठे `sectionWideCheckWork` पात्र पर `maxNumAttempts` राखे के कोनो असर ना होवऽ हइ, काहेकि मौका सब के संख्या बाहरी पात्र तय करऽ हइ। `maxNumAttempts` बाहरी पात्र पर राखू।

answer-attributes-need-symbolic-equality = symbolicEquality राखे बिना { $attributes } विशेषता के कोनो असर ना होई।

answer-invalid-type = answer लेल प्रकार अमान्य हइ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = काहेकि घटक `<{ $component }>` के नाम ना हइ, एकरा मॉड्यूल के विशेषता के रूप में ना लीन जा सकऽ हइ

module-attribute-name-already-defined = घटक `<{ $component } name="{ $name }">` के मॉड्यूल के विशेषता के रूप में ना लीन जा सकऽ हइ, काहेकि घटक प्रकार `<module>` में "{ $name }" विशेषता पहिलहीं से परिभाषित हइ।

conditional-content-condition-ignored = case या else संतान सब वाले `<conditionalContent>` घटक पर `condition` विशेषता पर धेयान ना देल जा हइ।

slider-markers-type-mismatch = चिह्नक सब के प्रकार स्लाइडर के प्रकार से मेल ना खाय हइ।

pretzel-problem-needs-statement-and-answer = अमान्य pretzel: हर `<problem>` में एक `<statement>` आउ एक `<answer>` होवे के चाही।

pretzel-circuit-first-problem-distractor = अमान्य pretzel: mode="circuit" में पहिलका `<problem>` भरमावे वाला विकल्प ना हो सकऽ हइ।

## Attribute values

attribute-invalid-values = विशेषता `{ $attribute }` लेल मान { $values } अमान्य हइ; छोड़ल जा रहल हइ।

attribute-must-be-references = विशेषता `{ $attribute }` लेल मान `{ $value }` अमान्य हइ। विशेषता `$` से सुरू होय वाले संदर्भ सब से बनी होवे के चाही।

math-input-invalid-function-names = <mathInput>: { $attribute } में अमान्य फलन नाम छोड़े गए: { $names }। हर नाम के दिखे वाले भाग में कम से कम 2 वर्ण (अच्छर या योजक चिह्न) होवे के चाही; ओकर बाद वैकल्पिक `|<mathspeak विकल्प>` प्रत्यय आइ सकत हइ।

## Building components from the source

component-type-invalid = घटक प्रकार अमान्य हइ: `<{ $componentType }>`

attribute-repeated = विशेषता { $attribute } दोहरावी ना जा सकऽ हइ।

attribute-invalid-for-component = `<{ $componentType }>` प्रकार के घटक लेल विशेषता "{ $attribute }" अमान्य हइ।

## Style definition contrast

style-definition-insufficient-contrast =
    शैली परिभाषा { $styleNumber } में { $context ->
        [text-on-background] पृष्ठभूमि के रंग के आगे पाठ के रंग
        [high-contrast] कैनवास के आगे उच्च वैषम्य के रंग
        [line] कैनवास के आगे रेखा के रंग
        [marker] कैनवास के आगे चिह्नक के रंग
       *[text-on-canvas] कैनवास के आगे पाठ के रंग
    } लेल वैषम्य अपर्याप्त हइ{ $mode ->
        [dark] { " (गाढ़ विधा)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाही)।

style-definition-dark-mode-text-background-contrast =
    जदपि शैली परिभाषा { $styleNumber } हल्की विधा लेल पर्याप्त वैषम्य वाले रंग देवऽ हइ, ई मान सब से निकले गाढ़ विधा के रंग सब में पाठ के रंग आउ पृष्ठभूमि के रंग के बीच वैषम्य अपर्याप्त हइ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाही)। { $suggestion ->
        [available] गाढ़ विधा में पर्याप्त वैषम्य पावे लेल या त हल्की विधा के वैषम्य बढ़ावू (जइसे { $lightAttribute }="{ $lightColor }" राखू) या गाढ़ विधा के रंग बदलि दऽ (जइसे { $darkAttribute }="{ $darkColor }" राखू)।
       *[none] गाढ़ विधा में पर्याप्त वैषम्य पावे लेल हल्की विधा के वैषम्य बढ़ावू या निकले रंग सब के textColorDarkMode आउ/या backgroundColorDarkMode से बदलि दऽ।
    }

style-definition-dark-mode-text-canvas-contrast =
    जदपि शैली परिभाषा { $styleNumber } हल्की विधा लेल पर्याप्त वैषम्य वाला पाठ रंग देवऽ हइ, ई मान से निकला गाढ़ विधा के पाठ रंग कैनवास के आगे अपर्याप्त वैषम्य रखऽ हइ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाही)। { $suggestion ->
        [available] गाढ़ विधा में पर्याप्त वैषम्य पावे लेल या त हल्की विधा के वैषम्य बढ़ावू (जइसे textColor="{ $lightColor }" राखू) या गाढ़ विधा के रंग बदलि दऽ (जइसे textColorDarkMode="{ $darkColor }" राखू)।
       *[none] गाढ़ विधा में पर्याप्त वैषम्य पावे लेल हल्की विधा के वैषम्य बढ़ावू या निकले रंग के textColorDarkMode से बदलि दऽ।
    }

section-multiple-style-palettes = एक खंड खाली एक <stylePalette> चुनि सकत हइ; अंतिम लेल जा रहल हइ।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } के अनोखा संस्करण तय ना कएल जा सकऽ हइ, काहेकि numToSelect ऋणेतर पूर्णांक ना हइ।

variant-num-to-select-not-constant-number = { $component } के अनोखा संस्करण तय ना कएल जा सकऽ हइ, काहेकि numToSelect अचर संख्या ना हइ।

variant-with-replacement-not-constant-boolean = { $component } के अनोखा संस्करण तय ना कएल जा सकऽ हइ, काहेकि withReplacement अचर बूलीय मान ना हइ।

variant-select-weight-disables-unique = अगर कोनो विकल्प selectWeight या selectForVariants देवऽ हइ त select के अनोखा संस्करण बंद होइ जा रहल हइ

variant-coprime-undetermined = { $component } के अनोखा संस्करण तय ना कएल जा सकऽ हइ, काहेकि ई तय ना हो सकल कि coprime सदा असत्य हइ।

variant-attribute-not-constant = { $component } के अनोखा संस्करण तय ना कएल जा सकऽ हइ, काहेकि { $attribute } अचर ना हइ।

variant-attribute-not-number = { $component } के अनोखा संस्करण तय ना कएल जा सकऽ हइ, काहेकि { $attribute } संख्या ना हइ।

variant-attribute-wrong-type-for-sequence =
    { $type } प्रकार के { $component } के अनोखा संस्करण तय ना कएल जा सकऽ हइ, काहेकि { $attribute } { $expected ->
        [letters-combination] अच्छर सब के संयोजन
        [math-expression] मान्य गणितीय व्यंजक
        [integer] पूर्णांक
       *[number] संख्या
    } ना हइ।

variant-length-not-integer = { $component } के अनोखा संस्करण तय ना कएल जा सकऽ हइ, काहेकि length पूर्णांक ना हइ।

variant-sort-not-implemented = sort वाले { $component } के अनोखा संस्करण अखने उपलब्ध ना हइ

variant-exclude-combinations-not-implemented = excludeCombinations वाले { $component } के अनोखा संस्करण अखने उपलब्ध ना हइ

variant-math-exclude-not-implemented = exclude वाले math प्रकार के { $component } के अनोखा संस्करण अखने उपलब्ध ना हइ

variant-non-constant-exclude-not-implemented = अनचर exclude वाले { $component } के अनोखा संस्करण अखने उपलब्ध ना हइ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: आलेख के prefigure रेंडरर में समर्थित ना; वंसज छोड़ा गेल।

prefigure-descendant-invalid-geometry = { $subject }: ज्यामिति असीमित या अधूरी हइ; वंसज छोड़ा गेल।

prefigure-curve-label-omitted = { $subject }: बदले गेल वक्र तत्व सब पर लेबल समर्थित ना; लेबल छोड़ा गेल।

prefigure-curve-unsupported-definition-type = { $subject }: वक्र फलन परिभाषा प्रकार '{ $definitionType }' समर्थित ना; वंसज छोड़ा गेल।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves पर flipFunctions विशेषता समर्थित ना; वंसज छोड़ा गेल।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves खाली सूत्र प्रकार के संतान फलन सब के मानऽ हइ; वंसज छोड़ा गेल।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] रेखा कुल के लेबल
       *[point] बिंदु के लेबल
    } लेल labelPosition '{ $labelPosition }' समर्थित ना; PreFigure के पूर्वनिर्धारित संरेखण लेल जा रहल हइ।

prefigure-fill-style-unsupported = { $subject }: भराव शैली '{ $fillStyle }' PreFigure में समर्थित ना; ठोस भराव लेल जा रहल हइ।

prefigure-line-style-unknown = { $subject }: अनजान रेखा शैली '{ $lineStyle }' PreFigure के आउटपुट से छोड़ी गई।

prefigure-marker-style-mapped-to-diamond = { $subject }: चिह्नक शैली '{ $markerStyle }' PreFigure के 'diamond' शैली पर मानचित्रित कएल गेल।

prefigure-marker-style-unsupported = { $subject }: चिह्नक शैली '{ $markerStyle }' PreFigure में समर्थित ना; पूर्वनिर्धारित शैली लेल जा रहल हइ।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` अमान्य; लक्ष्य तय ना हो सकल। टीका छोड़ी गई।

annotation-ref-multiple-targets = `<annotation>`: `ref` से कई लक्ष्य निकले; पहिलका लक्ष्य लेल जा रहल हइ।

annotation-ref-outside-graph = `<annotation>`: `ref` अमान्य; लक्ष्य ओकरा समेटे आलेख के बाहर हइ। टीका छोड़ी गई।

annotation-ref-unsupported-target = `<annotation>`: `ref` अमान्य; prefigure रूपांतरण में लक्ष्य समर्थित आलेखीय वस्तु ना हइ। टीका छोड़ी गई।

annotation-text-missing = `<annotation>`: `text` ना हइ या खाली हइ; खाली पाठ देल जा रहल हइ।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] चक्रीय निर्भरता के पता चला।
       *[other] `<{ $componentType }>` घटक से जुड़ी चक्रीय निर्भरता के पता चला।
    }

reference-no-referent = ई संदर्भ के कोनो लक्ष्य ना मिलल: `{ $reference }`

reference-multiple-referents = ई संदर्भ के कई लक्ष्य मिलल: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` के विशेषता { $attribute } के प्रारूप अमान्य हइ।

children-invalid = `<{ $componentType }>` के संतान अमान्य हइ: अमान्य संतान मिललं: { $children }

## Falling back to a default

attribute-value-invalid-using-default = विशेषता `{ $attribute }` लेल मान `{ $value }` अमान्य हइ; मान `{ $default }` लेल जा रहल हइ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML संस्करण { $version } ना मिलल।
       *[other] DoenetML संस्करण { $version } ना मिलल। संस्करण { $fallback } पर लौटा जा रहल हइ
    }

## Reading the DoenetML

parse-invalid-doenetml = अमान्य DoenetML: { $content }

parse-tag-missing-close-tag = अमान्य DoenetML: टैग `{ $tag }` के समापन टैग ना हइ। खुद बंद होय वाला टैग या `</{ $tagName }>` टैग चाही हल।

parse-tag-error = अमान्य DoenetML: टैग `<{ $tagName }>` में त्रुटि

parse-attribute-missing-value = अमान्य DoenetML: विशेषता `{ $attribute }` के मान ना लगऽ हइ।

parse-attribute-invalid = अमान्य DoenetML: विशेषता `{ $attribute }` अमान्य हइ

parse-attribute-value-invalid = अमान्य DoenetML: विशेषता के मान `{ $value }` अमान्य हइ

parse-attribute-value-quote-mismatch = अमान्य DoenetML: विशेषता के मान `{ $value }` अमान्य हइ। उद्धरण चिह्न मेल ना खाय हइ। एक `{ $quote }` छूटा लगऽ हइ

parse-open-tag-name-missing = अमान्य DoenetML: बिना नाम के टैग मिलल, जइसे `<`

parse-tag-not-closed = अमान्य DoenetML: टैग `{ $tag }` बंद ना भेल (एक `>` छूटा लगऽ हइ)।

parse-self-closing-tag-name-missing = अमान्य DoenetML: बिना नाम के टैग मिलल `<{ $content }>`

parse-self-closing-tag-not-closed = अमान्य DoenetML: टैग `{ $tag }` बंद ना भेल (`/>` छूटा लगऽ हइ)।

parse-tag-invalid-attributes = अमान्य DoenetML: टैग `{ $tag }` मान्य ना हइ। एकर विशेषता गलत हो सकऽ हइ हइ।

parse-close-tag-name-missing = अमान्य DoenetML: बिना नाम के समापन टैग मिलल, जइसे `</`

parse-attribute-value-unquoted = विशेषता के मान उद्धरण चिह्न सब में होवे के चाही: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = अमान्य DoenetML: समापन टैग `{ $tag }` मिलल, बाकिर ओहसे मेल खात आरंभ टैग ना हइ

parse-close-tag-mismatched = अमान्य DoenetML: समापन टैग मेल ना खाय हइ। `</{ $expected }>` चाही हल। `{ $found }` मिलल

parser-node-unconvertible = नोड { $node } के Dast नोड में ना बदला जा सकल।

## Names

name-attribute-invalid =
    विशेषता name='{ $name }' अमान्य हइ। { $reason ->
        [characters] नाम सब में खाली अच्छर, अंक, अधोरेखा या योजक चिह्न हो सकऽ हइ हइ।
       *[start] नाम अच्छर से सुरू होवे के चाही।
    }

component-name-invalid-start = घटक नाम "{ $name }" अमान्य हइ। नाम अच्छर से सुरू होवे के चाही।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched प्रकार के answer में video विशेषता होवे के चाही

answer-video-watched-video-not-reference = videoWatched प्रकार के answer के video विशेषता एक संदर्भ होवे के चाही

answer-name-not-single-text = answer के name विशेषता में खाली एक पाठ संतान होवे के चाही

## Referencing another document

external-doenetml-recursion-limit = पुनरावर्तन के बहुत जादा स्तर सब के कारन बाहरी DoenetML ना मिल सका। कहूँ चक्रीय संदर्भ त ना?

external-doenetml-unavailable = { $attribute }="{ $uri }" से DoenetML ना मिल सका

external-doenetml-type-mismatch = { $attribute }="{ $uri }" से मिलल DoenetML अमान्य हइ: ई घटक प्रकार "{ $componentType }" से मेल ना खाया

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` अप्रचलित हइ; एकर बदले `{ $to }` के उपयोग करू।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` अप्रचलित हइ; एकर बदले `{ $to }` के उपयोग करू।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` अप्रचलित हइ आउ छोड़ी गई, काहेकि `{ $to }` भी देल गेल हइ।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` अप्रचलित हइ आउ छोड़ी गई, काहेकि `{ $to }` भी देल गेल हइ।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` अप्रचलित हइ आउ छोड़ी गई।

deprecated-attribute-to-child = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` अप्रचलित हइ; एकर बदले `<{ $child }>` संतान लिखू।

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` के मान `{ $value }` अप्रचलित हइ; एकर बदले `{ $to }` के उपयोग करू।

## Language coverage

pluralize-english-only = `<pluralize>` खाली अंग्रेजी के बहुवचन बनाइ सकत हइ, तेकरा लेल { $locale } में लिखे दस्तावेज में ओकर पाठ जस के तस रहऽ हइ। बहुवचन रूप सीधे लिखू, या `pluralForm` विशेषता से दऽ।

## Checking against the schema

schema-element-unrecognized = तत्व `<{ $tag }>` कोनो परिचित Doenet तत्व ना हइ।

schema-element-not-allowed-at-root = तत्व `<{ $tag }>` दस्तावेज के मूल में मान्य ना हइ।

schema-element-not-allowed-inside = तत्व `<{ $tag }>` `<{ $parent }>` के भीतर मान्य ना हइ।

schema-attribute-unrecognized = तत्व `<{ $tag }>` में `{ $attribute }` नाम के कोनो विशेषता ना हइ।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] तत्व `<{ $tag }>` के विशेषता `{ $attribute }` अइसन सूची होवे के चाही जेकर हर मद इनमें से एक होय: { $allowed }
       *[other] तत्व `<{ $tag }>` के विशेषता `{ $attribute }` इनमें से एक होवे के चाही: { $allowed }
    }

## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select लेल संस्करण नाम अमान्य हइ। संस्करण नाम { $variantName } { $numOptions } विकल्प सब में आवऽ हइ, बाकिर चुने के संख्या { $numToSelect } हइ।

select-variant-name-without-options = select लेल संस्करण देल गेल हइ, बाकिर संभव संस्करण नाम लेल कोनो विकल्प ना हइ: { $variantName }।

select-variant-name-not-possible = select लेल देल गेल संस्करण नाम { $variantName } संभव संस्करण नाम ना हइ।

select-too-few-options = खाली { $numOptions } घटक सब में से { $numToSelect } ना चुने जा सकऽ हइ।

select-from-sequence-too-few-values = { $length } लंबाई के अनुक्रम से { $numToSelect } मान ना चुने जा सकऽ हइ।

select-from-sequence-indices-count-mismatch = select लेल देल गेल अनुक्रमांक सब के संख्या चुने के संख्या से मेल खाय के चाही

select-from-sequence-indices-not-integers = select लेल देल गेल सब अनुक्रमांक पूर्णांक होवे के चाही

select-from-sequence-index-excluded = selectfromsequence लेल देल गेल अनुक्रमांक बाहर कएल गेल रहल

select-from-sequence-indices-excluded-combination = selectfromsequence लेल देल गेल अनुक्रमांक बाहर कएल गेल संयोजन रहल

select-from-sequence-coprime-not-positive-integers = धनात्मक पूर्णांक ना चुने जात, तेकरा लेल सहअभाज्य संयोजन ना चुने जा सकऽ हइ।

select-from-sequence-coprime-common-factor = सहअभाज्य संख्या ना चुनी जा सकऽ हइ। सब संभव मान सब में एक उभयनिष्ठ गुणनखंड हइ। (देल गेल "from" या "to" मान "step" के सहअभाज्य होवे के चाही।)

select-from-sequence-coprime-single-number = 1 से अलग कोनो एके संख्या से सहअभाज्य संयोजन ना चुने जा सकऽ हइ।

select-from-sequence-excluded-too-many-combinations = selectFromSequence में 70% से जादा संयोजन बाहर कएल गेल

select-from-sequence-coprime-none-found = सहअभाज्य संख्या ना चुनी जा सकल। सब संभव मान सब में एक उभयनिष्ठ गुणनखंड हइ।

select-from-sequence-too-few-unique-values = { $numPossibleValues } लंबाई के अनुक्रम से { $numToSelect } अलग मान ना चुने जा सकऽ हइ

select-prime-numbers-too-few-values = { $numValues } लंबाई के अभाज्य सूची से { $numToSelect } मान ना चुने जा सकऽ हइ

select-prime-numbers-values-count-mismatch = select लेल देल गेल मान सब के संख्या चुने के संख्या से मेल खाय के चाही

select-prime-numbers-values-not-prime = select prime number लेल देल गेल सब मान अभाज्य सूची में होवे के चाही

select-prime-numbers-values-excluded-combination = selectPrimeNumbers लेल देल गेल मान बाहर कएल गेल संयोजन रहल

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers में 70% से जादा संयोजन बाहर कएल गेल

select-random-combination-fluke = बहुते अनहोनी संजोग से यादृच्छिक मान सब के संयोजन ना चुना जा सकल

select-random-value-fluke = बहुते अनहोनी संजोग से यादृच्छिक मान ना चुना जा सकल

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] ई `<{ $component }>` ना देखाओल जा हइ, काहेकि ई गणित के भीतर हइ आउ `inline` ना हइ। `inline` जोड़ू, जेह से ई ड्रॉप-डाउन सूची बनि जाय, जौन व्यंजक के भीतर समाइ जा रहल हइ।
        [expanded] ई `<{ $component }>` ना देखाओल जा हइ, काहेकि ई गणित के भीतर हइ आउ `expanded` हइ। `expanded` हटावू; कई पंक्ति वाला डिब्बा व्यंजक के भीतर ना समाय हइ।
        [on-graph] ई `<{ $component }>` ना देखाओल जा हइ, काहेकि ई आलेख पर खींचे गेल गणित के भीतर हइ, जहाँ इनपुट लेल जगह ना हइ।
       *[relative-width] ई `<{ $component }>` ना देखाओल जा हइ, काहेकि ई गणित के भीतर हइ आउ एकर चौड़ाई सापेक्ष हइ। चौड़ाई निरपेक्ष इकाई में दऽ, जइसे `px`।
    }
