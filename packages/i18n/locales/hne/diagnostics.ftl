# Chhattisgarhi (छत्तीसगढ़ी) diagnostics: the warnings and errors the worker
# raises and the reader is shown. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth. Selected by
# `uiLocale`, not by the language the document was written in.
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
# These are the words a Chhattisgarhi reader has met; inventing equivalents
# would put words in front of a reader that nobody uses.
#
# **What is Chhattisgarhi is the frame**, and it carries the whole file:
#
#   «हे» / «हें»              the copula
#   «नइ»                      the negator
#   «नइ करे जा सकय»           *cannot be done*
#   «छोड़े जावत हे»           *ignoring*
#   «धियान नइ दिए जाय»        *is ignored*
#   «होना चाही»               *must be*
#   «काबर के»                 *because*
#   «तेकर सेती»               *therefore*
#   «अभी उपलब्ध नइ हे»        *has not been implemented*
#   «बर»                      *for* — the dative, and the file's signature
#   «ले»                      *from / out of*; «ला» the accusative
#   «अउ» / «या» / «कहूँ»      *and* / *or* / *if*
#   «मन»                      the plural, written after the noun
#
# A sentence that has slipped back into «है», «नहीं», «क्योंकि» or «के लिए»
# is a mistake to fix rather than a stylistic choice. This is a **framed**
# catalog: the sentences are Chhattisgarhi, the nouns inside them are declared
# Hindi, and a speaker should expect to correct the sentences as often as the
# words.
#
# **No plural branches.** CLDR has no plural data for `hne`, so every
# `[one]`/`[other]` fork English writes over a count is collapsed here; most
# become a plain message, since a Chhattisgarhi noun is unmarked after a
# numeral. The one exception is `field-function-wrong-num-outputs`, where
# English is not counting but distinguishing a one-output field from a
# two-output one; that fork is kept as the numeric literal `[1]`, which Fluent
# matches against the number itself rather than against a plural category.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = दू सिरा दे जाय पर { $attributes } पर धियान नइ दिए जाय

line-segment-attributes-ignored-with-endpoint-and-midpoint = सिरा अउ मध्यबिंदु दूनों दे जाय पर { $attributes } पर धियान नइ दिए जाय

line-segment-midpoint-offset-without-midpoint = मध्यबिंदु के बिना midpointOffset के कोनो असर नइ होवय

## `<line>`

line-points-undetermined-dimensions = अइसन बिंदु मन से होके जाय वाली रेखा जेकर विमा तय नइ हे।

line-points-too-few-dimensions = रेखा ला कम से कम दू विमा वाले बिंदु मन से होके जाना चाही।

line-points-depend-on-variables = रेखा ओ बिंदु मन से होके जावत हे जउन चर मन पर निर्भर हें: { $variables }।

line-equation-invalid-format = चर { $variable1 } अउ { $variable2 } म रेखा के समीकरण के प्रारूप अमान्य हे।

## `<ray>`

ray-overprescribed-through = किरण एके संग through, endpoint अउ direction से तय हे। दे गे through छोड़े जावत हे।

ray-dimension-mismatch = किरण म numDimensions मेल नइ खावय।

## `<vector>`

vector-overprescribed-head = सदिश एके संग head, tail अउ displacement से तय हे। दे गे head छोड़े जावत हे।

vector-dimension-mismatch = सदिश म numDimensions मेल नइ खावय।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` के ओर खींचा नइ जा सकय, काबर के ओ म nearestPoint अवस्था चर नइ हे।

constrain-to-without-nearest-point = `<{ $component }>` तक सीमित नइ करे जा सकय, काबर के ओ म nearestPoint अवस्था चर नइ हे।

constrain-to-interior-without-nearest-point = `<{ $component }>` के भीतरी भाग तक सीमित नइ करे जा सकय, काबर के ओ म nearestPoint अवस्था चर नइ हे।

## `<choiceInput>`

choice-input-label-position-ignored = अंतःपंक्ति न होय वाले choiceInput बर labelPosition पर धियान नइ दिए जाय

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput बर दे गे indices छोड़े जावत हे, काबर के indices के संख्या choice संतान मन के संख्या से मेल नइ खावय।

pretzel-indices-count-mismatch = problem बर दे गे indices छोड़े जावत हे, काबर के indices के संख्या problem संतान मन के संख्या से मेल नइ खावय।

shuffle-indices-count-mismatch = shuffle बर दे गे indices छोड़े जावत हे, काबर के indices के संख्या घटक मन के संख्या से मेल नइ खावय।

indices-ignored-out-of-range = { $component } बर दे गे indices छोड़े जावत हे, काबर के कुछ अनुक्रमांक परिसर से बाहर हें।

pretzel-indices-repeated = pretzel बर दे गे indices छोड़े जावत हे, काबर के कुछ अनुक्रमांक दोहरावल गे हें।

pretzel-circuit-first-index = circuit विधा म pretzel बर दे गे indices छोड़े जावत हे, काबर के पहिली अनुक्रमांक 1 होना चाही।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` ला पाठ संतान मन के संग काम करे बर `type` विशेषता देना चाही।

invalid-type-defaulting-to-math = { $component } घटक बर प्रकार { $type } अमान्य हे। ए math, text, number या boolean म ले एक होना चाही। math के उपयोग करे जावत हे।

string-not-valid-component-to-arrange = पाठ "{ $value }" { $component } बर मान्य घटक नइ हे। छोड़े जावत हे।

## Types and variables

invalid-type-defaulting-to-number = प्रकार { $type } अमान्य हे; प्रकार number करे जावत हे।

invalid-variable-value = चर के मान अमान्य हे: `{ $value }`

## Variants

variant-index-must-be-number = संस्करण अनुक्रमांक { $index } संख्या होना चाही

variant-index-must-be-integer = संस्करण अनुक्रमांक { $index } पूर्णांक होना चाही

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` निरपेक्ष माप बर अभी उपलब्ध नइ हे। चौड़ाई सापेक्ष करे जावत हे।

side-by-side-absolute-margins = `<{ $component }>` निरपेक्ष माप बर अभी उपलब्ध नइ हे। हाशिया सापेक्ष करे जावत हे।

side-by-side-no-block-child = अमान्य `<{ $component }>`: ए म कम से कम एक खंड संतान होना चाही।

## `<label>`

label-for-ignored-on-graphical = आलेखीय `<label>` पर `for` विशेषता पर धियान नइ दिए जाय।

label-for-must-resolve-to-one = `<label>` पर `for` विशेषता ठीक एके घटक तक पहुँचना चाही।

label-for-unresolved = `<label>` पर `for` विशेषता कोनो घटक तक नइ पहुँच सकिस।

label-for-answer-with-authored-inputs = `<label>` पर `for` विशेषता अइसन `<answer>` के संदर्भ देथे जेमा इनपुट खुद लिखा गिस हे; सीधे ओहि इनपुट के संदर्भ देव।

label-for-answer-without-input = `<label>` पर `for` विशेषता अइसन `<answer>` के संदर्भ देथे जेमा लेबल लगावे लायक इनपुट नइ हे।

label-for-must-reference-input-or-answer = `<label>` पर `for` विशेषता कोनो इनपुट या कोनो जवाब के संदर्भ देना चाही।

## Accessibility

accessibility-short-description-or-decorative = सुगम्यता बर `<{ $component }>` के या त संछिप्त विवरण होना चाही या ओला सजावटी बतावा जाना चाही।

accessibility-video-short-description = सुगम्यता बर `<video>` के संछिप्त विवरण होना चाही।

accessibility-input-short-description-or-label = सुगम्यता बर `<{ $component }>` के संछिप्त विवरण या लेबल होना चाही।

accessibility-answer-input-short-description-or-label = सुगम्यता बर इनपुट बनावे वाले `<answer>` के संछिप्त विवरण या लेबल होना चाही।

accessibility-short-description-contains-math = संछिप्त विवरण म `<{ $component }>` जइसे गणितीय घटक नइ होना चाही। गणित ला सब्द मन म लिखव।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } के खंड सीर्षक के पाठ बर वैषम्य अपर्याप्त हे (गाढ़ विधा) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाही)।
       *[other] { $colorName } के खंड सीर्षक के पाठ बर वैषम्य अपर्याप्त हे ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाही)।
    }

## `<circle>`

circle-through-points-non-numerical = जब बिंदु मन के संख्यात्मक मान न होंय, तब { $count } बिंदु मन से होके जाय वाला `<circle>` अभी उपलब्ध नइ हे।

circle-too-many-through-points = 3 से जादा बिंदु मन से होके जाय वाला वृत्त नइ निकाला जा सकय।

circle-overprescribed-radius-center-points = त्रिज्या, केंद्र अउ गुजरे वाले बिंदु एके संग दे जाय पर वृत्त नइ निकाला जा सकय।

circle-center-with-multiple-points = दे गे केंद्र के संग 1 से जादा बिंदु से होके जाय वाला वृत्त नइ निकाला जा सकय।

circle-radius-too-small = वृत्त नइ निकाला जा सकय: दूनों बिंदु मन के बीच के दूरी { $distance } हे, तेकर सेती दे गे त्रिज्या { $radius } बहुत छोट हे।

circle-radius-with-many-points = दे गे त्रिज्या के संग दू से जादा बिंदु मन से होके जाय वाला वृत्त नइ बनावा जा सकय।

circle-invalid-center-or-through-points = वृत्त के केंद्र या गुजरे वाले बिंदु अमान्य हें।

circle-radius-center-with-multiple-points = दे गे केंद्र के संग 1 से जादा बिंदु से होके जाय वाले वृत्त के त्रिज्या नइ निकाली जा सकय।

circle-change-radius-non-numerical = जौन वृत्त के गुजरे वाले बिंदु संख्यात्मक नइ हें, ओकर त्रिज्या नइ बदली जा सकय

circle-radius-with-points-non-numerical = संख्यात्मक मान न होय पर, दे गे त्रिज्या के संग एक से जादा बिंदु से होके जाय वाला वृत्त नइ बनावा जा सकय।

circle-change-center-non-numerical = असंख्यात्मक बिंदु मन से होके जाय वाले वृत्त के केंद्र बदलब अभी उपलब्ध नइ हे।

## `<function>`

function-domain-insufficient-dimensions = फलन के प्रांत के विमा अपर्याप्त हें। प्रांत म { $intervals } अंतराल हें, पर फलन म { $inputs } इनपुट हें।

function-domain-invalid-format = फलन के प्रांत के प्रारूप अमान्य हे।

function-ignoring-non-numerical =
    { $type ->
        [maximum] फलन के असंख्यात्मक उच्चिष्ठ छोड़े जावत हे।
        [minimum] फलन के असंख्यात्मक निम्निष्ठ छोड़े जावत हे।
        [extremum] फलन के असंख्यात्मक चरम मान छोड़े जावत हे।
        [point] फलन के असंख्यात्मक बिंदु छोड़े जावत हे।
        [slope] फलन के असंख्यात्मक प्रवणता छोड़े जावत हे।
       *[other] फलन के असंख्यात्मक { $type } छोड़े जावत हे।
    }

function-ignoring-empty =
    { $type ->
        [maximum] फलन के खाली उच्चिष्ठ छोड़े जावत हे।
        [minimum] फलन के खाली निम्निष्ठ छोड़े जावत हे।
        [extremum] फलन के खाली चरम मान छोड़े जावत हे।
        [point] फलन के खाली बिंदु छोड़े जावत हे।
       *[other] फलन के खाली { $type } छोड़े जावत हे।
    }

function-points-too-close = फलन म दू बिंदु बहुत पास-पास हें। फलन परिभाषित नइ करे जा सकय।

function-iterates-input-output-mismatch = फलन के पुनरावर्तन तबहीं संभव हे जब इनपुट के संख्या आउटपुट के संख्या के बराबर होय। ए फलन म { $inputs } इनपुट अउ { $outputs } आउटपुट हें।

## `<sequence>`

sequence-invalid-length = अनुक्रम के लंबाई अमान्य हे। ए ऋणेतर पूर्णांक होना चाही।

sequence-invalid-step = अनुक्रम के चरण अमान्य हे। { $type } प्रकार के अनुक्रम बर ए संख्या होना चाही।

sequence-invalid-endpoint-number = संख्या अनुक्रम के "{ $attribute }" अमान्य हे। ए संख्या होना चाही।

sequence-invalid-endpoint-letters = अछर अनुक्रम के "{ $attribute }" अमान्य हे। ए अछर मन के संयोजन होना चाही।

sequence-invalid-endpoint = अनुक्रम के "{ $attribute }" अमान्य हे।

select-from-sequence-coprime-not-numbers = संख्या नइ चुनी जात, तेकर सेती coprime छोड़ा गिस

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations दे गे हे, तेकर सेती coprime छोड़ा गिस

## Resolving a `target`

target-not-found = `<{ $source }>` बर target अमान्य हे: लक्ष्य नइ मिलिस।

target-state-variable-not-found = `<{ $source }>` बर target अमान्य हे: `<{ $component }>` पर "{ $property }" नाम के अवस्था चर नइ मिलिस।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` के चर स्वतंत्र चर से अलग होना चाही।

ode-system-duplicate-variable-names = दोहरावल गे आश्रित चर नाम मन के संग ODE के दाहिन पच्छ के फलन परिभाषित नइ करे जा सकय।

ode-system-rhs-function-error = ODE के दाहिन पच्छ के फलन परिभाषित नइ करे जा सकय। mathjs फलन बनावत समय त्रुटि होइस।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } रेखा मन के बीच के कोण परिभाषित नइ करे जा सकय

angle-invalid-through-point = `<angle>` के through म अमान्य बिंदु हे

parabola-vertex-too-many-points = दे गे सीर्ष के संग 1 से जादा बिंदु से होके जाय वाला परवलय अभी उपलब्ध नइ हे।

parabola-too-many-points = 3 से जादा बिंदु मन से होके जाय वाला परवलय अभी उपलब्ध नइ हे।

intersection-too-many-items = दू से जादा वस्तु मन के प्रतिच्छेदन अभी उपलब्ध नइ हे

## Other math components

ionic-compound-not-two-ions = दू आयन मन के अलावा कोनो अउ हालत बर आयनिक यौगिक अभी उपलब्ध नइ हे।

ionic-compound-needs-cation-and-anion = आयनिक यौगिक खाली एक धनायन अउ एक ऋणायन बर उपलब्ध हे।

solve-equations-cannot-evaluate = समीकरण के मान नइ निकाला जा सकिस, तेकर सेती ऊ हल नइ करे जा सकय: { $equation }

math-operators-operand-number-required = गणितीय संकार्य निकालत समय operandNumber देब जरूरी हे।

eigen-decomposition-failed = आव्यूह के अभिलच्छनिक मान नइ निकाले जा सकिन

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: प्राचल { $parameters } पैटर्न म नइ आवय, तेकर सेती ऊ सदा खाली से मेल खाई।

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" समझा नइ जा सकिस। ए none, medium, dense, या खाली जगह से अलगावल दू धनात्मक संख्या होना चाही, जइसे grid="1 0.5"। कोनो ग्रिड नइ खींचा जाई।

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` ला अइसन फलन चाही जेमा { $expected ->
        [1] एक आउटपुट होय, हर बिंदु पर प्रवणता y', जइसे `y - x`
       *[other] दू आउटपुट होंय, हर बिंदु पर सदिश, जइसे `(y, -x)`
    }, पर जौन फलन दे गे ओ म { $found } आउटपुट हें। { $alternative ->
        [none] कुछ नइ खींचा जाई।
       *[other] ओ फलन बर `<{ $alternative }>` घटक हे। कुछ नइ खींचा जाई।
    }

field-function-attribute-ignored-with-child = `function` विशेषता पर धियान नइ दिए जाय, काबर के फलन घटक के भीतर भी दे गे हे; भीतर वाला लेय जावत हे। फलन दूनों म ले खाली एके तरह से देव।

field-variables-ignored =
    `<{ $component }>`: `variables` विशेषता ओ व्यंजक के चर मन के नाम देथे जौन सीधे घटक के भीतर लिखा गिस हे। { $reason ->
        [function-child] इहाँ फलन `<function>` संतान के रूप म दे गे हे, जौन आपन चर खुद बतावत हे, तेकर सेती `variables` छोड़े जावत हे।
       *[no-expression] इहाँ अइसन कोनो व्यंजक नइ दे गे, तेकर सेती `variables` छोड़े जावत हे।
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure रेंडरर म xLabelPosition="left" समर्थित नइ हे; दाहिन ओर वाला बरताव लेय जावत हे।

prefigure-y-label-position-unsupported = `<graph>`: prefigure रेंडरर म yLabelPosition="bottom" समर्थित नइ हे; ऊपर वाला बरताव लेय जावत हे।

prefigure-invalid-axis-bounds = `<graph>`: prefigure रूपांतरण बर अच्छ सीमा अमान्य हे; पूर्वनिर्धारित bbox (-10,-10,10,10) लेय जावत हे।

prefigure-invalid-width = `<graph>`: prefigure रूपांतरण बर चौड़ाई अमान्य हे; पूर्वनिर्धारित आरेख चौड़ाई 425 लेय जावत हे।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure रूपांतरण बर aspectRatio अमान्य हे; पूर्वनिर्धारित अनुपात 1 लेय जावत हे।

prefigure-grid-spacing-too-fine = `<graph>`: अच्छ सीमा के हिसाब से ग्रिड के अंतराल बहुत महीन हे; prefigure रेंडरर म ग्रिड छोड़े जावत हे।

prefigure-annotations-not-rendered = `<graph>`: PreFigure रेंडरर के उपयोग न होय पर टीका नइ खींची जाई।

multiple-annotations-children = `<graph>` म एक से जादा `<annotations>` संतान मिलिसं; अंतिम ला छोड़िके सब पर धियान नइ दिए जाय।

## Referring to other components

copy-unrecognized-component-type = अपरिचित घटक प्रकार ला बढ़ावा या नकल नइ करे जा सकय: { $type }।

copy-prop-not-found = { $component } प्रकार के घटक पर { $property } गुण नइ मिलिस

collect-no-source = collect बर कोनो स्रोत नइ मिलिस।

collect-invalid-component-type = `<{ $component }>` प्रकार के घटक बटोरे नइ जा सकय, काबर के ए मान्य घटक प्रकार नइ हे।

reference-index-unavailable = अनुक्रमांक `{ $reference }` के संदर्भ नइ दे जा सकय

## `<callAction>`

component-action-unavailable = घटक `{ $reference }` पर { $action } नइ बुलावा जा सकय

## `<dataFrame>`

data-frame-inconsistent-row-lengths = आँकड़ा मन के आकार अमान्य हे। पंक्ति मन के लंबाई असंगत हे। componentIdx :{ $componentIdx } म मिलिस

data-frame-duplicate-column-names = आँकड़ा मन म स्तंभ नाम दोहरावल गे हें। componentIdx :{ $componentIdx } म मिलिस

data-frame-missing-column-name = आँकड़ा मन म एक स्तंभ नाम नइ हे। componentIdx :{ $componentIdx } म मिलिस

## `<answer>` and scoring

answer-award-depends-on-own-response = ए जवाब के एक award खुद answer टैग के पठावल जवाब पर टिका हे, जेह से अनचाहा बरताव होई।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` वाले पात्र के भीतर के `<answer>` पर `maxNumAttempts` राखे के कोनो असर नइ होवय, काबर के मौका मन के संख्या पात्र तय करथे। `maxNumAttempts` पात्र पर राखव।

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` वाले कोनो अउ पात्र के भीतर बैठे `sectionWideCheckWork` पात्र पर `maxNumAttempts` राखे के कोनो असर नइ होवय, काबर के मौका मन के संख्या बाहरी पात्र तय करथे। `maxNumAttempts` बाहरी पात्र पर राखव।

answer-attributes-need-symbolic-equality = symbolicEquality राखे बिना { $attributes } विशेषता के कोनो असर नइ होई।

answer-invalid-type = answer बर प्रकार अमान्य हे: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = काबर के घटक `<{ $component }>` के नाम नइ हे, एला मॉड्यूल के विशेषता के रूप म नइ लीन जा सकय

module-attribute-name-already-defined = घटक `<{ $component } name="{ $name }">` ला मॉड्यूल के विशेषता के रूप म नइ लीन जा सकय, काबर के घटक प्रकार `<module>` म "{ $name }" विशेषता पहिलिच ले परिभाषित हे।

conditional-content-condition-ignored = case या else संतान मन वाले `<conditionalContent>` घटक पर `condition` विशेषता पर धियान नइ दिए जाय।

slider-markers-type-mismatch = चिह्नक मन के प्रकार स्लाइडर के प्रकार से मेल नइ खावय।

pretzel-problem-needs-statement-and-answer = अमान्य pretzel: हर `<problem>` म एक `<statement>` अउ एक `<answer>` होना चाही।

pretzel-circuit-first-problem-distractor = अमान्य pretzel: mode="circuit" म पहिली `<problem>` भरमावे वाला विकल्प नइ हो सकय।

## Attribute values

attribute-invalid-values = विशेषता `{ $attribute }` बर मान { $values } अमान्य हे; छोड़े जावत हे।

attribute-must-be-references = विशेषता `{ $attribute }` बर मान `{ $value }` अमान्य हे। विशेषता `$` से सुरू होय वाले संदर्भ मन से बनी होना चाही।

math-input-invalid-function-names = <mathInput>: { $attribute } म अमान्य फलन नाम छोड़े गए: { $names }। हर नाम के दिखे वाले भाग म कम से कम 2 वर्ण (अछर या योजक चिह्न) होना चाही; ओकर बाद वैकल्पिक `|<mathspeak विकल्प>` प्रत्यय आइ सकत हे।

## Building components from the source

component-type-invalid = घटक प्रकार अमान्य हे: `<{ $componentType }>`

attribute-repeated = विशेषता { $attribute } दोहरावी नइ जा सकय।

attribute-invalid-for-component = `<{ $componentType }>` प्रकार के घटक बर विशेषता "{ $attribute }" अमान्य हे।

## Style definition contrast

style-definition-insufficient-contrast =
    शैली परिभाषा { $styleNumber } म { $context ->
        [text-on-background] पृष्ठभूमि के रंग के आगे पाठ के रंग
        [high-contrast] कैनवास के आगे उच्च वैषम्य के रंग
        [line] कैनवास के आगे रेखा के रंग
        [marker] कैनवास के आगे चिह्नक के रंग
       *[text-on-canvas] कैनवास के आगे पाठ के रंग
    } बर वैषम्य अपर्याप्त हे{ $mode ->
        [dark] { " (गाढ़ विधा)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाही)।

style-definition-dark-mode-text-background-contrast =
    भले शैली परिभाषा { $styleNumber } हल्की विधा बर पर्याप्त वैषम्य वाले रंग देथे, ए मान मन से निकले गाढ़ विधा के रंग मन म पाठ के रंग अउ पृष्ठभूमि के रंग के बीच वैषम्य अपर्याप्त हे ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाही)। { $suggestion ->
        [available] गाढ़ विधा म पर्याप्त वैषम्य पावे बर या त हल्की विधा के वैषम्य बढ़ावव (जइसे { $lightAttribute }="{ $lightColor }" राखव) या गाढ़ विधा के रंग बदलि देव (जइसे { $darkAttribute }="{ $darkColor }" राखव)।
       *[none] गाढ़ विधा म पर्याप्त वैषम्य पावे बर हल्की विधा के वैषम्य बढ़ावव या निकले रंग मन ला textColorDarkMode अउ/या backgroundColorDarkMode से बदलि देव।
    }

style-definition-dark-mode-text-canvas-contrast =
    भले शैली परिभाषा { $styleNumber } हल्की विधा बर पर्याप्त वैषम्य वाला पाठ रंग देथे, ए मान से निकला गाढ़ विधा के पाठ रंग कैनवास के आगे अपर्याप्त वैषम्य रखथे ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम से कम { $threshold }:1 चाही)। { $suggestion ->
        [available] गाढ़ विधा म पर्याप्त वैषम्य पावे बर या त हल्की विधा के वैषम्य बढ़ावव (जइसे textColor="{ $lightColor }" राखव) या गाढ़ विधा के रंग बदलि देव (जइसे textColorDarkMode="{ $darkColor }" राखव)।
       *[none] गाढ़ विधा म पर्याप्त वैषम्य पावे बर हल्की विधा के वैषम्य बढ़ावव या निकले रंग ला textColorDarkMode से बदलि देव।
    }

section-multiple-style-palettes = एक खंड खाली एक <stylePalette> चुनि सकत हे; अंतिम लेय जावत हे।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } के अनोखा संस्करण तय नइ करे जा सकय, काबर के numToSelect ऋणेतर पूर्णांक नइ हे।

variant-num-to-select-not-constant-number = { $component } के अनोखा संस्करण तय नइ करे जा सकय, काबर के numToSelect अचर संख्या नइ हे।

variant-with-replacement-not-constant-boolean = { $component } के अनोखा संस्करण तय नइ करे जा सकय, काबर के withReplacement अचर बूलीय मान नइ हे।

variant-select-weight-disables-unique = कहूँ कोनो विकल्प selectWeight या selectForVariants देथे त select के अनोखा संस्करण बंद होइ जावत हें

variant-coprime-undetermined = { $component } के अनोखा संस्करण तय नइ करे जा सकय, काबर के ए तय नइ हो सकिस कि coprime सदा असत्य हे।

variant-attribute-not-constant = { $component } के अनोखा संस्करण तय नइ करे जा सकय, काबर के { $attribute } अचर नइ हे।

variant-attribute-not-number = { $component } के अनोखा संस्करण तय नइ करे जा सकय, काबर के { $attribute } संख्या नइ हे।

variant-attribute-wrong-type-for-sequence =
    { $type } प्रकार के { $component } के अनोखा संस्करण तय नइ करे जा सकय, काबर के { $attribute } { $expected ->
        [letters-combination] अछर मन के संयोजन
        [math-expression] मान्य गणितीय व्यंजक
        [integer] पूर्णांक
       *[number] संख्या
    } नइ हे।

variant-length-not-integer = { $component } के अनोखा संस्करण तय नइ करे जा सकय, काबर के length पूर्णांक नइ हे।

variant-sort-not-implemented = sort वाले { $component } के अनोखा संस्करण अभी उपलब्ध नइ हें

variant-exclude-combinations-not-implemented = excludeCombinations वाले { $component } के अनोखा संस्करण अभी उपलब्ध नइ हें

variant-math-exclude-not-implemented = exclude वाले math प्रकार के { $component } के अनोखा संस्करण अभी उपलब्ध नइ हें

variant-non-constant-exclude-not-implemented = अनचर exclude वाले { $component } के अनोखा संस्करण अभी उपलब्ध नइ हें

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: आलेख के prefigure रेंडरर म समर्थित नइ; वंसज छोड़ा गिस।

prefigure-descendant-invalid-geometry = { $subject }: ज्यामिति असीमित या अधूरी हे; वंसज छोड़ा गिस।

prefigure-curve-label-omitted = { $subject }: बदले गे वक्र तत्व मन पर लेबल समर्थित नइ; लेबल छोड़ा गिस।

prefigure-curve-unsupported-definition-type = { $subject }: वक्र फलन परिभाषा प्रकार '{ $definitionType }' समर्थित नइ; वंसज छोड़ा गिस।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves पर flipFunctions विशेषता समर्थित नइ; वंसज छोड़ा गिस।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves खाली सूत्र प्रकार के संतान फलन मन ला मानथे; वंसज छोड़ा गिस।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] रेखा कुल के लेबल
       *[point] बिंदु के लेबल
    } बर labelPosition '{ $labelPosition }' समर्थित नइ; PreFigure के पूर्वनिर्धारित संरेखण लेय जावत हे।

prefigure-fill-style-unsupported = { $subject }: भराव शैली '{ $fillStyle }' PreFigure म समर्थित नइ; ठोस भराव लेय जावत हे।

prefigure-line-style-unknown = { $subject }: अनजान रेखा शैली '{ $lineStyle }' PreFigure के आउटपुट से छोड़ी गई।

prefigure-marker-style-mapped-to-diamond = { $subject }: चिह्नक शैली '{ $markerStyle }' PreFigure के 'diamond' शैली पर मानचित्रित करे गिस।

prefigure-marker-style-unsupported = { $subject }: चिह्नक शैली '{ $markerStyle }' PreFigure म समर्थित नइ; पूर्वनिर्धारित शैली लेय जावत हे।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` अमान्य; लक्ष्य तय नइ हो सकिस। टीका छोड़ी गई।

annotation-ref-multiple-targets = `<annotation>`: `ref` से कई लक्ष्य निकले; पहिली लक्ष्य लेय जावत हे।

annotation-ref-outside-graph = `<annotation>`: `ref` अमान्य; लक्ष्य ओला समेटे आलेख के बाहर हे। टीका छोड़ी गई।

annotation-ref-unsupported-target = `<annotation>`: `ref` अमान्य; prefigure रूपांतरण म लक्ष्य समर्थित आलेखीय वस्तु नइ हे। टीका छोड़ी गई।

annotation-text-missing = `<annotation>`: `text` नइ हे या खाली हे; खाली पाठ दे जावत हे।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] चक्रीय निर्भरता के पता चला।
       *[other] `<{ $componentType }>` घटक से जुड़ी चक्रीय निर्भरता के पता चला।
    }

reference-no-referent = ए संदर्भ के कोनो लक्ष्य नइ मिलिस: `{ $reference }`

reference-multiple-referents = ए संदर्भ के कई लक्ष्य मिलिन: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` के विशेषता { $attribute } के प्रारूप अमान्य हे।

children-invalid = `<{ $componentType }>` के संतान अमान्य हें: अमान्य संतान मिलिसं: { $children }

## Falling back to a default

attribute-value-invalid-using-default = विशेषता `{ $attribute }` बर मान `{ $value }` अमान्य हे; मान `{ $default }` लेय जावत हे

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML संस्करण { $version } नइ मिलिस।
       *[other] DoenetML संस्करण { $version } नइ मिलिस। संस्करण { $fallback } पर लौटा जावत हे
    }

## Reading the DoenetML

parse-invalid-doenetml = अमान्य DoenetML: { $content }

parse-tag-missing-close-tag = अमान्य DoenetML: टैग `{ $tag }` के समापन टैग नइ हे। खुद बंद होय वाला टैग या `</{ $tagName }>` टैग चाही रिहिस।

parse-tag-error = अमान्य DoenetML: टैग `<{ $tagName }>` म त्रुटि

parse-attribute-missing-value = अमान्य DoenetML: विशेषता `{ $attribute }` के मान नइ लागथे।

parse-attribute-invalid = अमान्य DoenetML: विशेषता `{ $attribute }` अमान्य हे

parse-attribute-value-invalid = अमान्य DoenetML: विशेषता के मान `{ $value }` अमान्य हे

parse-attribute-value-quote-mismatch = अमान्य DoenetML: विशेषता के मान `{ $value }` अमान्य हे। उद्धरण चिह्न मेल नइ खावय। एक `{ $quote }` छूटा लागथे

parse-open-tag-name-missing = अमान्य DoenetML: बिना नाम के टैग मिलिस, जइसे `<`

parse-tag-not-closed = अमान्य DoenetML: टैग `{ $tag }` बंद नइ होइस (एक `>` छूटा लागथे)।

parse-self-closing-tag-name-missing = अमान्य DoenetML: बिना नाम के टैग मिलिस `<{ $content }>`

parse-self-closing-tag-not-closed = अमान्य DoenetML: टैग `{ $tag }` बंद नइ होइस (`/>` छूटा लागथे)।

parse-tag-invalid-attributes = अमान्य DoenetML: टैग `{ $tag }` मान्य नइ हे। एकर विशेषता गलत हो सकय हें।

parse-close-tag-name-missing = अमान्य DoenetML: बिना नाम के समापन टैग मिलिस, जइसे `</`

parse-attribute-value-unquoted = विशेषता के मान उद्धरण चिह्न मन म होना चाही: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = अमान्य DoenetML: समापन टैग `{ $tag }` मिलिस, पर ओहसे मेल खात आरंभ टैग नइ हे

parse-close-tag-mismatched = अमान्य DoenetML: समापन टैग मेल नइ खावय। `</{ $expected }>` चाही रिहिस। `{ $found }` मिलिस

parser-node-unconvertible = नोड { $node } ला Dast नोड म नइ बदला जा सकिस।

## Names

name-attribute-invalid =
    विशेषता name='{ $name }' अमान्य हे। { $reason ->
        [characters] नाम मन म खाली अछर, अंक, अधोरेखा या योजक चिह्न हो सकय हें।
       *[start] नाम अछर से सुरू होना चाही।
    }

component-name-invalid-start = घटक नाम "{ $name }" अमान्य हे। नाम अछर से सुरू होना चाही।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched प्रकार के answer म video विशेषता होना चाही

answer-video-watched-video-not-reference = videoWatched प्रकार के answer के video विशेषता एक संदर्भ होना चाही

answer-name-not-single-text = answer के name विशेषता म खाली एक पाठ संतान होना चाही

## Referencing another document

external-doenetml-recursion-limit = पुनरावर्तन के बहुत जादा स्तर मन के कारन बाहरी DoenetML नइ मिल सका। कहूँ चक्रीय संदर्भ त नइ?

external-doenetml-unavailable = { $attribute }="{ $uri }" से DoenetML नइ मिल सका

external-doenetml-type-mismatch = { $attribute }="{ $uri }" से मिलिस DoenetML अमान्य हे: ए घटक प्रकार "{ $componentType }" से मेल नइ खाया

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` अप्रचलित हे; एकर बदले `{ $to }` के उपयोग करव।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` अप्रचलित हे; एकर बदले `{ $to }` के उपयोग करव।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` अप्रचलित हे अउ छोड़ी गई, काबर के `{ $to }` भी दे गे हे।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` अप्रचलित हे अउ छोड़ी गई, काबर के `{ $to }` भी दे गे हे।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` अप्रचलित हे अउ छोड़ी गई।

deprecated-attribute-to-child = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` अप्रचलित हे; एकर बदले `<{ $child }>` संतान लिखव।

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` के मान `{ $value }` अप्रचलित हे; एकर बदले `{ $to }` के उपयोग करव।

## Language coverage

pluralize-english-only = `<pluralize>` खाली अंग्रेजी के बहुवचन बनाइ सकत हे, तेकर सेती { $locale } म लिखे दस्तावेज म ओकर पाठ जस के तस रहिथे। बहुवचन रूप सीधे लिखव, या `pluralForm` विशेषता से देव।

## Checking against the schema

schema-element-unrecognized = तत्व `<{ $tag }>` कोनो परिचित Doenet तत्व नइ हे।

schema-element-not-allowed-at-root = तत्व `<{ $tag }>` दस्तावेज के मूल म मान्य नइ हे।

schema-element-not-allowed-inside = तत्व `<{ $tag }>` `<{ $parent }>` के भीतर मान्य नइ हे।

schema-attribute-unrecognized = तत्व `<{ $tag }>` म `{ $attribute }` नाम के कोनो विशेषता नइ हे।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] तत्व `<{ $tag }>` के विशेषता `{ $attribute }` अइसन सूची होना चाही जेकर हर मद इनमन ले एक होय: { $allowed }
       *[other] तत्व `<{ $tag }>` के विशेषता `{ $attribute }` इनमन ले एक होना चाही: { $allowed }
    }

## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select बर संस्करण नाम अमान्य हे। संस्करण नाम { $variantName } { $numOptions } विकल्प मन म आथे, पर चुने के संख्या { $numToSelect } हे।

select-variant-name-without-options = select बर संस्करण दे गे हें, पर संभव संस्करण नाम बर कोनो विकल्प नइ हे: { $variantName }।

select-variant-name-not-possible = select बर दे गे संस्करण नाम { $variantName } संभव संस्करण नाम नइ हे।

select-too-few-options = खाली { $numOptions } घटक मन म ले { $numToSelect } नइ चुने जा सकय।

select-from-sequence-too-few-values = { $length } लंबाई के अनुक्रम से { $numToSelect } मान नइ चुने जा सकय।

select-from-sequence-indices-count-mismatch = select बर दे गे अनुक्रमांक मन के संख्या चुने के संख्या से मेल खाना चाही

select-from-sequence-indices-not-integers = select बर दे गे सब अनुक्रमांक पूर्णांक होना चाही

select-from-sequence-index-excluded = selectfromsequence बर दे गे अनुक्रमांक बाहर करे गिस रिहिस

select-from-sequence-indices-excluded-combination = selectfromsequence बर दे गे अनुक्रमांक बाहर करे गिस संयोजन रिहिन

select-from-sequence-coprime-not-positive-integers = धनात्मक पूर्णांक नइ चुने जात, तेकर सेती सहअभाज्य संयोजन नइ चुने जा सकय।

select-from-sequence-coprime-common-factor = सहअभाज्य संख्या नइ चुनी जा सकय। सब संभव मान मन म एक उभयनिष्ठ गुणनखंड हे। (दे गे "from" या "to" मान "step" के सहअभाज्य होना चाही।)

select-from-sequence-coprime-single-number = 1 से अलग कोनो एके संख्या से सहअभाज्य संयोजन नइ चुने जा सकय।

select-from-sequence-excluded-too-many-combinations = selectFromSequence म 70% से जादा संयोजन बाहर करे गिस

select-from-sequence-coprime-none-found = सहअभाज्य संख्या नइ चुनी जा सकिस। सब संभव मान मन म एक उभयनिष्ठ गुणनखंड हे।

select-from-sequence-too-few-unique-values = { $numPossibleValues } लंबाई के अनुक्रम से { $numToSelect } अलग मान नइ चुने जा सकय

select-prime-numbers-too-few-values = { $numValues } लंबाई के अभाज्य सूची से { $numToSelect } मान नइ चुने जा सकय

select-prime-numbers-values-count-mismatch = select बर दे गे मान मन के संख्या चुने के संख्या से मेल खाना चाही

select-prime-numbers-values-not-prime = select prime number बर दे गे सब मान अभाज्य सूची म होना चाही

select-prime-numbers-values-excluded-combination = selectPrimeNumbers बर दे गे मान बाहर करे गिस संयोजन रिहिन

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers म 70% से जादा संयोजन बाहर करे गिस

select-random-combination-fluke = बहुते अनहोनी संजोग से यादृच्छिक मान मन के संयोजन नइ चुना जा सकिस

select-random-value-fluke = बहुते अनहोनी संजोग से यादृच्छिक मान नइ चुना जा सकिस

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] ए `<{ $component }>` नइ देखाए जावय, काबर के ए गणित के भीतर हे अउ `inline` नइ हे। `inline` जोड़व, जेह से ए ड्रॉप-डाउन सूची बनि जाय, जौन व्यंजक के भीतर समाइ जावत हे।
        [expanded] ए `<{ $component }>` नइ देखाए जावय, काबर के ए गणित के भीतर हे अउ `expanded` हे। `expanded` हटावव; कई पंक्ति वाला डिब्बा व्यंजक के भीतर नइ समावय।
        [on-graph] ए `<{ $component }>` नइ देखाए जावय, काबर के ए आलेख पर खींचे गे गणित के भीतर हे, जहाँ इनपुट बर जगह नइ हे।
       *[relative-width] ए `<{ $component }>` नइ देखाए जावय, काबर के ए गणित के भीतर हे अउ एकर चौड़ाई सापेक्ष हे। चौड़ाई निरपेक्ष इकाई म देव, जइसे `px`।
    }
