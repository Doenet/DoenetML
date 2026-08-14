# Dogri diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] दौंएं अंतबिंदू दित्ते जाने पर { $attributes } गी अनदिक्खा कीता जंदा ऐ
       *[other] दौंएं अंतबिंदू दित्ते जाने पर { $attributes } गी अनदिक्खा कीता जंदा ऐ
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] अंतबिंदू ते मध्यबिंदू दौंएं दित्ते जाने पर { $attributes } गी अनदिक्खा कीता जंदा ऐ
       *[other] अंतबिंदू ते मध्यबिंदू दौंएं दित्ते जाने पर { $attributes } गी अनदिक्खा कीता जंदा ऐ
    }

line-segment-midpoint-offset-without-midpoint = मध्यबिंदू दे बगैर midpointOffset दा कोई असर नेईं

## `<line>`

line-points-undetermined-dimensions = अनिश्चित विमा आले बिंदुएं चा गुजरने आली रेखा।

line-points-too-few-dimensions = रेखा घट्टोघट्ट दो विमा आले बिंदुएं चा गुजरनी चाहिदी।

line-points-depend-on-variables = रेखा उनें बिंदुएं चा गुजरदी ऐ जेह्ड़े चरें पर निर्भर न: { $variables }।

line-equation-invalid-format = चर { $variable1 } ते { $variable2 } च रेखा दे समीकरण दा गलत प्रारूप।

## `<ray>`

ray-overprescribed-through = किरण through, endpoint ते direction — तिन्नें कोला तै ऐ। दित्ता गेदा through अनदिक्खा।

ray-dimension-mismatch = किरण च numDimensions नेईं मिलदा।

## `<vector>`

vector-overprescribed-head = सदिश head, tail ते displacement — तिन्नें कोला तै ऐ। दित्ता गेदा head अनदिक्खा।

vector-dimension-mismatch = सदिश च numDimensions नेईं मिलदा।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` च nearestPoint नां दा स्थिति चर नेईं ऐ, इस्सै करी उस्सै पासै खिच्च नेईं होई सकदी।

constrain-to-without-nearest-point = `<{ $component }>` च nearestPoint नां दा स्थिति चर नेईं ऐ, इस्सै करी उस पर नियंत्रण नेईं होई सकदा।

constrain-to-interior-without-nearest-point = `<{ $component }>` च nearestPoint नां दा स्थिति चर नेईं ऐ, इस्सै करी उंदे अंदर नियंत्रण नेईं होई सकदा।

## `<choiceInput>`

choice-input-label-position-ignored = गैर-इनलाइन choiceInput आस्तै labelPosition अनदिक्खा

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput आस्तै दित्ते गेदे सूचकांक अनदिक्खे, कीजो सूचकांकें दी गिनतरी विकल्प संतानें दी गिनतरी कन्नै नेईं मिलदी।

pretzel-indices-count-mismatch = problem आस्तै दित्ते गेदे सूचकांक अनदिक्खे, कीजो सूचकांकें दी गिनतरी problem संतानें दी गिनतरी कन्नै नेईं मिलदी।

shuffle-indices-count-mismatch = shuffle आस्तै दित्ते गेदे सूचकांक अनदिक्खे, कीजो सूचकांकें दी गिनतरी घटकें दी गिनतरी कन्नै नेईं मिलदी।

indices-ignored-out-of-range = { $component } आस्तै दित्ते गेदे सूचकांक अनदिक्खे, कीजो कुछ सूचकांक हद्द कोला बाह्रर न।

pretzel-indices-repeated = pretzel आस्तै दित्ते गेदे सूचकांक अनदिक्खे, कीजो कुछ सूचकांक दोह्राए गेदे न।

pretzel-circuit-first-index = circuit मोड च pretzel आस्तै दित्ते गेदे सूचकांक अनदिक्खे, कीजो पैह्ला सूचकांक 1 होना चाहिदा।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` गी स्ट्रिंग संतानें कन्नै कम्म करने आस्तै `type` विशेषता देना जरूरी ऐ।

invalid-type-defaulting-to-math = { $component } घटक आस्तै { $type } किस्म गलत ऐ। math, text, number जां boolean चा इक होनी चाहिदी। मूल रूप च math लैता जंदा ऐ।

string-not-valid-component-to-arrange = स्ट्रिंग "{ $value }" { $component } आस्तै मन्नोचा घटक नेईं ऐ। अनदिक्खा।

## Types and variables

invalid-type-defaulting-to-number = { $type } किस्म गलत ऐ, किस्म number कीती जंदी ऐ।

invalid-variable-value = चर दा गलत मुल्ल: `{ $value }`

## Variants

variant-index-must-be-number = किस्म सूचकांक { $index } इक गिनतरी होनी चाहिदी

variant-index-must-be-integer = किस्म सूचकांक { $index } इक पूर्णांक होना चाहिदा

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` निरपेक्ष मापें आस्तै नेईं बनोचा। चौड़ाई सापेक्ष कीती जंदी ऐ।

side-by-side-absolute-margins = `<{ $component }>` निरपेक्ष मापें आस्तै नेईं बनोचा। हाशिया सापेक्ष कीता जंदा ऐ।

side-by-side-no-block-child = गलत `<{ $component }>`: इस च घट्टोघट्ट इक ब्लॉक संतान होनी चाहिदी।

## `<label>`

label-for-ignored-on-graphical = आलेखी `<label>` पर `for` विशेषता अनदिक्खी जंदी ऐ।

label-for-must-resolve-to-one = `<label>` पर `for` विशेषता ठीक इक घटक दा पता देनी चाहिदी।

label-for-unresolved = `<label>` पर `for` विशेषता कुसै बी घटक दा पता नेईं देई सकी।

label-for-answer-with-authored-inputs = `<label>` पर `for` विशेषता उस `<answer>` दा पता दिंदी ऐ जिस च लिखारी ने अपने आप निवेश लिखे न; निवेश दा सिद्धा पता देओ।

label-for-answer-without-input = `<label>` पर `for` विशेषता उस `<answer>` दा पता दिंदी ऐ जिस च लेबल लाने जोगा निवेश नेईं ऐ।

label-for-must-reference-input-or-answer = `<label>` पर `for` विशेषता कुसै निवेश जां जवाब दा पता देनी चाहिदी।

## Accessibility

accessibility-short-description-or-decorative = सुगमता आस्तै `<{ $component }>` दा जां तां छोटा ब्यौरा होना चाहिदा जां उसी decorative आखना चाहिदा।

accessibility-video-short-description = सुगमता आस्तै `<video>` दा छोटा ब्यौरा होना चाहिदा।

accessibility-input-short-description-or-label = सुगमता आस्तै `<{ $component }>` दा छोटा ब्यौरा जां लेबल होना चाहिदा।

accessibility-answer-input-short-description-or-label = सुगमता आस्तै निवेश बनाने आले `<answer>` दा छोटा ब्यौरा जां लेबल होना चाहिदा।

accessibility-short-description-contains-math = छोटे ब्यौरे च `<{ $component }>` जनेह् गणित घटक नेईं होने चाहिदे। गणित गी शब्दें च लिखो।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] खंड सिरनांऽ दे पाठ आस्तै { $colorName } दा विरोधाभास घट्ट ऐ (डार्क मोड) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; घट्टोघट्ट { $threshold }:1 चाहिदा)।
       *[other] खंड सिरनांऽ दे पाठ आस्तै { $colorName } दा विरोधाभास घट्ट ऐ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; घट्टोघट्ट { $threshold }:1 चाहिदा)।
    }

## `<circle>`

circle-through-points-non-numerical = जित्थै बिंदुएं दे संख्यात्मक मुल्ल नेईं न, उत्थै { $count } बिंदुएं चा गुजरने आला `<circle>` हाल्लै नेईं बनोचा।

circle-too-many-through-points = त्रौं कोला मते बिंदुएं चा गुजरने आले वृत्त दी गिनतरी नेईं होई सकदी।

circle-overprescribed-radius-center-points = दित्ती गेदी त्रिज्या, केंद्र ते बिंदू — तिन्नें कन्नै वृत्त दी गिनतरी नेईं होई सकदी।

circle-center-with-multiple-points = दित्ते गेदे केंद्र कन्नै इक कोला मते बिंदुएं चा गुजरने आले वृत्त दी गिनतरी नेईं होई सकदी।

circle-radius-too-small = वृत्त दी गिनतरी नेईं होई सकदी: दौंएं बिंदुएं दे बिच्चै दी दूरी { $distance } ऐ, इस्सै करी दित्ती गेदी त्रिज्या { $radius } मते छोटी ऐ।

circle-radius-with-many-points = दित्ती गेदी त्रिज्या कन्नै दो कोला मते बिंदुएं चा गुजरने आला वृत्त नेईं बनी सकदा।

circle-invalid-center-or-through-points = वृत्त दा गलत केंद्र जां बिंदू।

circle-radius-center-with-multiple-points = दित्ते गेदे केंद्र कन्नै इक कोला मते बिंदुएं चा गुजरने आले वृत्त दी त्रिज्या दी गिनतरी नेईं होई सकदी।

circle-change-radius-non-numerical = गैर-संख्यात्मक बिंदुएं चा गुजरने आले वृत्त दी त्रिज्या नेईं बदली जाई सकदी

circle-radius-with-points-non-numerical = संख्यात्मक मुल्लें दे बगैर, दित्ती गेदी त्रिज्या कन्नै इक कोला मते बिंदुएं चा गुजरने आला वृत्त नेईं बनी सकदा।

circle-change-center-non-numerical = गैर-संख्यात्मक मुल्लें आले बिंदुएं चा गुजरने आले वृत्त दा केंद्र बदलना हाल्लै नेईं बनोचा।

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] फलन दे प्रांत आस्तै विमा घट्ट न। प्रांत च { $intervals } अंतराल ऐ पर फलन च { $inputs ->
            [one] { $inputs } निवेश
           *[other] { $inputs } निवेश
        } न।
       *[other] फलन दे प्रांत आस्तै विमा घट्ट न। प्रांत च { $intervals } अंतराल न पर फलन च { $inputs ->
            [one] { $inputs } निवेश
           *[other] { $inputs } निवेश
        } न।
    }

function-domain-invalid-format = फलन दे प्रांत दा गलत प्रारूप।

function-ignoring-non-numerical =
    { $type ->
        [maximum] फलन दा गैर-संख्यात्मक अधिकतम अनदिक्खा।
        [minimum] फलन दा गैर-संख्यात्मक न्यूनतम अनदिक्खा।
        [extremum] फलन दा गैर-संख्यात्मक चरम अनदिक्खा।
        [point] फलन दा गैर-संख्यात्मक बिंदू अनदिक्खा।
        [slope] फलन दा गैर-संख्यात्मक ढलान अनदिक्खा।
       *[other] फलन दा गैर-संख्यात्मक { $type } अनदिक्खा।
    }

function-ignoring-empty =
    { $type ->
        [maximum] फलन दा खाली अधिकतम अनदिक्खा।
        [minimum] फलन दा खाली न्यूनतम अनदिक्खा।
        [extremum] फलन दा खाली चरम अनदिक्खा।
        [point] फलन दा खाली बिंदू अनदिक्खा।
       *[other] फलन दा खाली { $type } अनदिक्खा।
    }

function-points-too-close = फलन च दो बिंदू मते नेड़े न। फलन तै नेईं होई सकदा।

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] फलन दियां आवृत्तियां तदुए संभव न जदुं निवेशें दी गिनतरी निर्गमें दी गिनतरी बराबर होऐ। इस फलन च { $inputs } निवेश ते { $outputs ->
            [one] { $outputs } निर्गम
           *[other] { $outputs } निर्गम
        } न।
       *[other] फलन दियां आवृत्तियां तदुए संभव न जदुं निवेशें दी गिनतरी निर्गमें दी गिनतरी बराबर होऐ। इस फलन च { $inputs } निवेश ते { $outputs ->
            [one] { $outputs } निर्गम
           *[other] { $outputs } निर्गम
        } न।
    }

## `<sequence>`

sequence-invalid-length = अनुक्रम दी गलत लंबाई। इक गैर-ऋणात्मक पूर्णांक होना चाहिदा।

sequence-invalid-step = अनुक्रम दा गलत पद। { $type } किस्म दे अनुक्रम आस्तै इक गिनतरी होनी चाहिदी।

sequence-invalid-endpoint-number = गिनतरी अनुक्रम दा गलत "{ $attribute }"। इक गिनतरी होनी चाहिदी।

sequence-invalid-endpoint-letters = अक्खर अनुक्रम दा गलत "{ $attribute }"। अक्खरें दा जोड़ होना चाहिदा।

sequence-invalid-endpoint = अनुक्रम दा गलत "{ $attribute }"।

select-from-sequence-coprime-not-numbers = गिनतरियां नेईं चुनियां जा करदियां, इस्सै करी coprime अनदिक्खा

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations दित्ता गेदा ऐ, इस्सै करी coprime अनदिक्खा

## Resolving a `target`

target-not-found = `<{ $source }>` आस्तै गलत लक्ष्य: लक्ष्य नेईं मिलेआ।

target-state-variable-not-found = `<{ $source }>` आस्तै गलत लक्ष्य: `<{ $component }>` पर "{ $property }" नां दा स्थिति चर नेईं मिलेआ।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` दे चर स्वतंत्र चर कोला बक्खरे होने चाहिदे।

ode-system-duplicate-variable-names = दोह्राए गेदे आश्रित चर नांऽ कन्नै ODE RHS फलन तै नेईं होई सकदे।

ode-system-rhs-function-error = ODE RHS फलन तै नेईं होई सकदा। mathjs फलन बनाने च गलती।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } रेखाएं दे बिच्चै कोण तै नेईं होई सकदा

angle-invalid-through-point = `<angle>` दे through च गलत बिंदू

parabola-vertex-too-many-points = शीर्ष कन्नै इक कोला मते बिंदुएं चा गुजरने आला परवलय हाल्लै नेईं बनोचा।

parabola-too-many-points = त्रौं कोला मते बिंदुएं चा गुजरने आला परवलय हाल्लै नेईं बनोचा।

intersection-too-many-items = दो कोला मतियां वस्तुएं दा प्रतिच्छेद हाल्लै नेईं बनोचा

## Other math components

ionic-compound-not-two-ions = दो आयनें गी छड्डियै होर कुसै आस्तै आयनिक यौगिक हाल्लै नेईं बनोचा।

ionic-compound-needs-cation-and-anion = आयनिक यौगिक सिर्फ इक धनायन ते इक ऋणायन आस्तै बनोचा।

solve-equations-cannot-evaluate = समीकरण दा मुल्ल नेईं कड्ढेआ जाई सकेआ, इस्सै करी उसी हल नेईं कीता जाई सकदा: { $equation }

math-operators-operand-number-required = गणित दा संकार्य कड्ढने आस्तै operandNumber देना जरूरी ऐ।

eigen-decomposition-failed = आव्यूह दे आइगेन-मुल्लें दी गिनतरी नेईं होई सकी

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: प्राचल { $parameters } प्रतिरूप च नेईं ऐ, इस्सै करी उह् हमेशा खाली कन्नै मिलग।
       *[other] `<matchesPattern>`: प्राचल { $parameters } प्रतिरूप च नेईं न, इस्सै करी उह् हमेशा खाली कन्नै मिलङन।
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" नेईं समझेआ जाई सकेआ। इह् none, medium, dense, जां खाली थाहर कन्नै बक्खरियां कीतियां दो धनात्मक गिनतरियां होनियां चाहिदियां, जिय्यां grid="1 0.5"। कोई जाल नेईं खिच्चेआ गेआ।

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure प्रदर्शक च xLabelPosition="left" समर्थित नेईं; right दा व्यवहार लैता जंदा ऐ।

prefigure-y-label-position-unsupported = `<graph>`: prefigure प्रदर्शक च yLabelPosition="bottom" समर्थित नेईं; top दा व्यवहार लैता जंदा ऐ।

prefigure-invalid-axis-bounds = `<graph>`: prefigure रूपांतरण आस्तै गलत अक्ष हद्द; मूल bbox (-10,-10,10,10) लैता जंदा ऐ।

prefigure-invalid-width = `<graph>`: prefigure रूपांतरण आस्तै गलत चौड़ाई; मूल रेखाचित्र चौड़ाई 425 लैती जंदी ऐ।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure रूपांतरण आस्तै गलत aspectRatio; मूल अनुपात 1 लैता जंदा ऐ।

prefigure-grid-spacing-too-fine = `<graph>`: अक्ष हद्दें आस्तै जाल दा अंतर मता बरीक ऐ; prefigure प्रदर्शक च जाल छड्डेआ जंदा ऐ।

prefigure-annotations-not-rendered = `<graph>`: PreFigure प्रदर्शक दे बगैर टिप्पणियां नेईं खिच्चियां जाङन।

multiple-annotations-children = `<graph>` च मतियां `<annotations>` संतानां मिलियां; अखीरी गी छड्डियै सारियां अनदिक्खियां।

## Referring to other components

copy-unrecognized-component-type = अणजांती घटक किस्म गी बधाया जां नकल नेईं कीता जाई सकदा: { $type }।

copy-prop-not-found = { $component } किस्म दे घटक पर { $property } गुण नेईं मिलेआ

collect-no-source = collect आस्तै कोई स्रोत नेईं मिलेआ।

collect-invalid-component-type = `<{ $component }>` किस्म दे घटक कट्ठे नेईं कीते जाई सकदे, कीजो इह् गलत घटक किस्म ऐ।

reference-index-unavailable = सूचकांक `{ $reference }` दा हवाला नेईं दित्ता जाई सकदा

## `<callAction>`

component-action-unavailable = घटक `{ $reference }` पर { $action } नेईं चलाया जाई सकदा

## `<dataFrame>`

data-frame-inconsistent-row-lengths = डेटा दा आकार गलत ऐ। पंगतें दियां लंबाइयां असंगत न। componentIdx :{ $componentIdx } च मिलेआ

data-frame-duplicate-column-names = डेटा च दोह्राए गेदे स्तंभ नांऽ न। componentIdx :{ $componentIdx } च मिलेआ

data-frame-missing-column-name = डेटा च इक स्तंभ नांऽ नेईं ऐ। componentIdx :{ $componentIdx } च मिलेआ

## `<answer>` and scoring

answer-award-depends-on-own-response = इस जवाब दा इक award इस्सै answer टैग दे अपने भेजे गेदे जवाब पर आधारित ऐ, जिस कन्नै अनचाहा व्यवहार होग।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` आले पात्र दे अंदर आले `<answer>` पर `maxNumAttempts` देने दा कोई असर नेईं, कीजो कोशशें दी गिनतरी पात्र कोला तै होंदी ऐ। `maxNumAttempts` पात्र पर देओ।

nested-section-wide-check-work-max-num-attempts = होर `sectionWideCheckWork` आले पात्र दे अंदर आले `sectionWideCheckWork` पात्र पर `maxNumAttempts` देने दा कोई असर नेईं, कीजो कोशशें दी गिनतरी बाह्रले पात्र कोला तै होंदी ऐ। `maxNumAttempts` बाह्रले पात्र पर देओ।

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality दे बगैर { $attributes } विशेषता दा कोई असर नेईं होग।
       *[other] symbolicEquality दे बगैर { $attributes } विशेषतां दा कोई असर नेईं होग।
    }

answer-invalid-type = जवाब आस्तै गलत किस्म: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` घटक दा नांऽ नेईं ऐ, इस्सै करी उह् module दी विशेषता दे रूप च नेईं बरतेआ जाई सकदा

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` घटक module दी विशेषता दे रूप च नेईं बरतेआ जाई सकदा, कीजो `<module>` घटक किस्म च "{ $name }" विशेषता पैह्लें थमां तै ऐ।

conditional-content-condition-ignored = case जां else संतानें आले `<conditionalContent>` घटक पर `condition` विशेषता अनदिक्खी जंदी ऐ।

slider-markers-type-mismatch = निशानें दी किस्म slider दी किस्म कन्नै नेईं मिलदी।

pretzel-problem-needs-statement-and-answer = गलत pretzel: हर इक `<problem>` च इक `<statement>` ते इक `<answer>` होना चाहिदा।

pretzel-circuit-first-problem-distractor = गलत pretzel: mode="circuit" च पैह्ला `<problem>` भ्रामक नेईं होई सकदा।

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] विशेषता `{ $attribute }` आस्तै गलत मुल्ल { $values }; अनदिक्खा।
       *[other] विशेषता `{ $attribute }` आस्तै गलत मुल्ल { $values }; अनदिक्खे।
    }

attribute-must-be-references = विशेषता `{ $attribute }` आस्तै `{ $value }` गलत मुल्ल ऐ। विशेषता उनें संदर्भें कोला बनी चाहिदी जेह्ड़े `$` कन्नै शुरू होंदे न।

math-input-invalid-function-names = <mathInput>: { $attribute } च गलत फलन नांऽ अनदिक्खे: { $names }। हर इक नांऽ दे प्रदर्शन हिस्से च घट्टोघट्ट दो अक्खर (अक्खर जां जोड़-निशान) होने चाहिदे; उंदे बाद इच्छा कन्नै `|<mathspeak alternative>` लाया जाई सकदा।

## Building components from the source

component-type-invalid = गलत घटक किस्म: `<{ $componentType }>`

attribute-repeated = विशेषता { $attribute } गी दोह्राया नेईं जाई सकदा।

attribute-invalid-for-component = `<{ $componentType }>` किस्म दे घटक आस्तै "{ $attribute }" विशेषता गलत ऐ।

## Style definition contrast

style-definition-insufficient-contrast =
    शैली परिभाशा { $styleNumber } च { $context ->
        [text-on-background] पृष्ठभूमि रंग दे सामनै पाठ रंग
        [high-contrast] कैनवास दे सामनै उच्च-विरोधाभास रंग
        [line] कैनवास दे सामनै रेखा रंग
        [marker] कैनवास दे सामनै निशान रंग
       *[text-on-canvas] कैनवास दे सामनै पाठ रंग
    } आस्तै विरोधाभास घट्ट ऐ{ $mode ->
        [dark] { " (डार्क मोड)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; घट्टोघट्ट { $threshold }:1 चाहिदा)।

style-definition-dark-mode-text-background-contrast =
    भामें शैली परिभाशा { $styleNumber } च दित्ते गेदे रंग लाइट मोड आस्तै पूरा विरोधाभास दिंदे न, उंदे कोला बने डार्क मोड रंगें च पृष्ठभूमि रंग दे सामनै पाठ रंग दा विरोधाभास घट्ट ऐ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; घट्टोघट्ट { $threshold }:1 चाहिदा)। { $suggestion ->
        [available] डार्क मोड च पूरे विरोधाभास आस्तै जां तां लाइट मोड दा विरोधाभास बधाओ (जिय्यां { $lightAttribute }="{ $lightColor }"), जां डार्क मोड दा रंग अपने आप देओ (जिय्यां { $darkAttribute }="{ $darkColor }")।
       *[none] डार्क मोड च पूरे विरोधाभास आस्तै लाइट मोड दा विरोधाभास बधाओ, जां बने रंगें गी textColorDarkMode ते/जां backgroundColorDarkMode कन्नै अपने आप देओ।
    }

style-definition-dark-mode-text-canvas-contrast =
    भामें शैली परिभाशा { $styleNumber } च दित्ता गेदा पाठ रंग लाइट मोड आस्तै पूरा विरोधाभास दिंदा ऐ, उंदे कोला बने डार्क मोड पाठ रंग दा कैनवास दे सामनै विरोधाभास घट्ट ऐ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; घट्टोघट्ट { $threshold }:1 चाहिदा)। { $suggestion ->
        [available] डार्क मोड च पूरे विरोधाभास आस्तै जां तां लाइट मोड दा विरोधाभास बधाओ (जिय्यां textColor="{ $lightColor }"), जां डार्क मोड दा रंग अपने आप देओ (जिय्यां textColorDarkMode="{ $darkColor }")।
       *[none] डार्क मोड च पूरे विरोधाभास आस्तै लाइट मोड दा विरोधाभास बधाओ, जां बने रंग गी textColorDarkMode कन्नै अपने आप देओ।
    }

section-multiple-style-palettes = इक खंड सिर्फ इक <stylePalette> चुनी सकदा ऐ; अखीरी लैता जंदा ऐ।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } दियां अनोखियां किस्मां तै नेईं होई सकदियां, कीजो numToSelect गैर-ऋणात्मक पूर्णांक नेईं ऐ।

variant-num-to-select-not-constant-number = { $component } दियां अनोखियां किस्मां तै नेईं होई सकदियां, कीजो numToSelect स्थिर गिनतरी नेईं ऐ।

variant-with-replacement-not-constant-boolean = { $component } दियां अनोखियां किस्मां तै नेईं होई सकदियां, कीजो withReplacement स्थिर बूलियन नेईं ऐ।

variant-select-weight-disables-unique = जेकर कुसै विकल्प च selectWeight जां selectForVariants दित्ता होऐ तां select दियां अनोखियां किस्मां बंद होई जंदियां न

variant-coprime-undetermined = { $component } दियां अनोखियां किस्मां तै नेईं होई सकदियां, कीजो coprime हमेशा झूठ ऐ — इह् तै नेईं होई सकेआ।

variant-attribute-not-constant = { $component } दियां अनोखियां किस्मां तै नेईं होई सकदियां, कीजो { $attribute } स्थिर नेईं ऐ।

variant-attribute-not-number = { $component } दियां अनोखियां किस्मां तै नेईं होई सकदियां, कीजो { $attribute } गिनतरी नेईं ऐ।

variant-attribute-wrong-type-for-sequence =
    { $type } किस्म दे { $component } दियां अनोखियां किस्मां तै नेईं होई सकदियां, कीजो { $attribute } { $expected ->
        [letters-combination] अक्खरें दा जोड़
        [math-expression] मन्नोचा गणित व्यंजन
        [integer] पूर्णांक
       *[number] गिनतरी
    } नेईं ऐ।

variant-length-not-integer = { $component } दियां अनोखियां किस्मां तै नेईं होई सकदियां, कीजो length पूर्णांक नेईं ऐ।

variant-sort-not-implemented = sort आले { $component } दियां अनोखियां किस्मां हाल्लै नेईं बनोचियां

variant-exclude-combinations-not-implemented = excludeCombinations आले { $component } दियां अनोखियां किस्मां हाल्लै नेईं बनोचियां

variant-math-exclude-not-implemented = exclude आले math किस्म दे { $component } दियां अनोखियां किस्मां हाल्लै नेईं बनोचियां

variant-non-constant-exclude-not-implemented = अस्थिर exclude आले { $component } दियां अनोखियां किस्मां हाल्लै नेईं बनोचियां

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure प्रदर्शक च समर्थित नेईं; वंशज छड्डेआ गेआ।

prefigure-descendant-invalid-geometry = { $subject }: अपरिमित जां अधूरी ज्यामिति; वंशज छड्डेआ गेआ।

prefigure-curve-label-omitted = { $subject }: रूपांतरित वक्र घटकें पर लेबल समर्थित नेईं; लेबल छड्डेआ गेआ।

prefigure-curve-unsupported-definition-type = { $subject }: वक्र फलन परिभाशा किस्म '{ $definitionType }' समर्थित नेईं; वंशज छड्डेआ गेआ।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves पर flipFunctions विशेषता समर्थित नेईं; वंशज छड्डेआ गेआ।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves पर सिर्फ formula किस्म दे संतान फलन समर्थित न; वंशज छड्डेआ गेआ।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] रेखा-परिवार दा लेबल
       *[point] बिंदू लेबल
    } आस्तै labelPosition '{ $labelPosition }' समर्थित नेईं; मूल PreFigure संरेखण लैता गेआ।

prefigure-fill-style-unsupported = { $subject }: भराई शैली '{ $fillStyle }' PreFigure च समर्थित नेईं; ठोस भराई लैती गेई।

prefigure-line-style-unknown = { $subject }: अणजांती रेखा शैली '{ $lineStyle }' PreFigure निर्गम कोला छड्डी गेई।

prefigure-marker-style-mapped-to-diamond = { $subject }: निशान शैली '{ $markerStyle }' PreFigure दी 'diamond' शैली च बदली गेई।

prefigure-marker-style-unsupported = { $subject }: निशान शैली '{ $markerStyle }' PreFigure च समर्थित नेईं; मूल शैली लैती गेई।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: गलत `ref`; लक्ष्य नेईं मिलेआ। टिप्पणी छड्डी गेई।

annotation-ref-multiple-targets = `<annotation>`: `ref` कोला मते लक्ष्य मिले; पैह्ला लक्ष्य लैता गेआ।

annotation-ref-outside-graph = `<annotation>`: गलत `ref`; लक्ष्य उस graph कोला बाह्रर ऐ। टिप्पणी छड्डी गेई।

annotation-ref-unsupported-target = `<annotation>`: गलत `ref`; prefigure रूपांतरण च लक्ष्य समर्थित आलेखी वस्तू नेईं ऐ। टिप्पणी छड्डी गेई।

annotation-text-missing = `<annotation>`: `text` नेईं ऐ जां खाली ऐ; खाली पाठ दित्ता गेआ।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] चक्रीय निर्भरता मिली।
       *[other] `<{ $componentType }>` घटक गी लेइयै चक्रीय निर्भरता मिली।
    }

reference-no-referent = संदर्भ दा कोई लक्ष्य नेईं मिलेआ: `{ $reference }`

reference-multiple-referents = संदर्भ दे मते लक्ष्य मिले: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` दी { $attribute } विशेषता दा गलत प्रारूप।

children-invalid = `<{ $componentType }>` आस्तै गलत संतानां: गलत संतानां मिलियां: { $children }

## Falling back to a default

attribute-value-invalid-using-default = विशेषता `{ $attribute }` आस्तै `{ $value }` गलत मुल्ल ऐ, `{ $default }` मुल्ल लैता जंदा ऐ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML संस्करण { $version } नेईं मिलेआ।
       *[other] DoenetML संस्करण { $version } नेईं मिलेआ। संस्करण { $fallback } लैता जंदा ऐ
    }

## Reading the DoenetML

parse-invalid-doenetml = गलत DoenetML: { $content }

parse-tag-missing-close-tag = गलत DoenetML: टैग `{ $tag }` दा कोई समापन टैग नेईं ऐ। स्वयं-समापन टैग जां `</{ $tagName }>` टैग चाहिदा।

parse-tag-error = गलत DoenetML: टैग `<{ $tagName }>` च गलती

parse-attribute-missing-value = गलत DoenetML: गलत विशेषता `{ $attribute }` च मुल्ल नेईं दीखदा।

parse-attribute-invalid = गलत DoenetML: गलत विशेषता `{ $attribute }`

parse-attribute-value-invalid = गलत DoenetML: गलत विशेषता मुल्ल `{ $value }`

parse-attribute-value-quote-mismatch = गलत DoenetML: गलत विशेषता मुल्ल `{ $value }`। उद्धरण निशान नेईं मिलदे। लगदा ऐ जे `{ $quote }` छुट्टी गेआ

parse-open-tag-name-missing = गलत DoenetML: टैग नांऽ दे बगैर टैग मिलेआ, जिय्यां `<`

parse-tag-not-closed = गलत DoenetML: टैग `{ $tag }` बंद नेईं होया (लगदा ऐ जे `>` छुट्टी गेआ)।

parse-self-closing-tag-name-missing = गलत DoenetML: टैग नांऽ दे बगैर टैग मिलेआ `<{ $content }>`

parse-self-closing-tag-not-closed = गलत DoenetML: टैग `{ $tag }` बंद नेईं होया (लगदा ऐ जे `/>` छुट्टी गेआ)।

parse-tag-invalid-attributes = गलत DoenetML: टैग `{ $tag }` मन्नोचा नेईं ऐ। इसदियां विशेषतां गलत होई सकदियां न।

parse-close-tag-name-missing = गलत DoenetML: टैग नांऽ दे बगैर समापन टैग मिलेआ, जिय्यां `</`

parse-attribute-value-unquoted = विशेषता दे मुल्ल उद्धरण निशानें च रक्खने चाहिदे: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = गलत DoenetML: समापन टैग `{ $tag }` मिलेआ, पर उसदा कोई आरंभ टैग नेईं ऐ

parse-close-tag-mismatched = गलत DoenetML: समापन टैग नेईं मिलदा। `</{ $expected }>` चाहिदा हा। `{ $found }` मिलेआ

parser-node-unconvertible = नोड { $node } गी Dast नोड च नेईं बदलेआ जाई सकेआ।

## Names

name-attribute-invalid =
    गलत विशेषता name='{ $name }'। { $reason ->
        [characters] नांऽ च सिर्फ अक्खर, अंक, अधोरेखा जां जोड़-निशान होई सकदे न।
       *[start] नांऽ अक्खर कन्नै शुरू होने चाहिदे।
    }

component-name-invalid-start = गलत घटक नांऽ "{ $name }"। नांऽ अक्खर कन्नै शुरू होने चाहिदे।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched किस्म आले जवाब च video विशेषता होनी चाहिदी

answer-video-watched-video-not-reference = videoWatched किस्म आले जवाब दी video विशेषता इक संदर्भ होनी चाहिदी

answer-name-not-single-text = जवाब दी name विशेषता च सिर्फ इक पाठ संतान होनी चाहिदी

## Referencing another document

external-doenetml-recursion-limit = मते स्तरें दी पुनरावृत्ति दे कारण बाह्रला DoenetML नेईं आई सकेआ। कुतै चक्रीय संदर्भ तां नेईं ऐ?

external-doenetml-unavailable = { $attribute }="{ $uri }" कोला DoenetML नेईं आई सकेआ

external-doenetml-type-mismatch = { $attribute }="{ $uri }" कोला आया DoenetML गलत ऐ: इह् "{ $componentType }" घटक किस्म कन्नै नेईं मिलेआ

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` छड्डी गेई ऐ; इसदी थाहर `{ $to }` लिखो।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` छड्डी गेई ऐ; इसदी थाहर `{ $to }` लिखो।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] विशेषता `{ $from }` छड्डी गेई ऐ ते अनदिक्खी ऐ, कीजो `{ $to }` बी दित्ता गेदा ऐ।
       *[other] [deprecation] `<{ $component }>` पर विशेषता `{ $from }` छड्डी गेई ऐ ते अनदिक्खी ऐ, कीजो `{ $to }` बी दित्ता गेदा ऐ।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` छड्डी गेई ते अनदिक्खी ऐ।

deprecated-attribute-to-child = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` छड्डी गेई ऐ; इसदी थाहर `<{ $child }>` संतान लिखो।

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` पर विशेषता `{ $attribute }` दा मुल्ल `{ $value }` छड्डेआ गेआ ऐ; इसदी थाहर `{ $to }` लिखो।


## Language coverage

pluralize-english-only = `<pluralize>` सिर्फ अंग्रेजी दा बहुवचन बनाई सकदा ऐ, इस्सै करी { $locale } च लिखे गेदे दस्तावेज च उसदा पाठ ओह्ई रौंह्दा ऐ। बहुवचन रूप सिद्धा लिखो, जां `pluralForm` विशेषता कन्नै देओ।


## Checking against the schema

schema-element-unrecognized = घटक `<{ $tag }>` कोई जांता-पछांता Doenet घटक नेईं ऐ।

schema-element-not-allowed-at-root = घटक `<{ $tag }>` दस्तावेज दी जड़ च मन्नोचा नेईं ऐ।

schema-element-not-allowed-inside = घटक `<{ $tag }>` `<{ $parent }>` दे अंदर मन्नोचा नेईं ऐ।

schema-attribute-unrecognized = घटक `<{ $tag }>` च `{ $attribute }` नां दी कोई विशेषता नेईं ऐ।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] घटक `<{ $tag }>` दी `{ $attribute }` विशेषता इक ऐसी सूची होनी चाहिदी जिसदी हर इक वस्तू इंदे चा इक होऐ: { $allowed }
       *[other] घटक `<{ $tag }>` दी `{ $attribute }` विशेषता इंदे चा इक होनी चाहिदी: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select आस्तै गलत किस्म नांऽ। किस्म नांऽ { $variantName } { $numOptions } विकल्पें च औंदा ऐ पर चुनने दी गिनतरी { $numToSelect } ऐ।

select-variant-name-without-options = select आस्तै कुछ किस्मां दित्तियां गेदियां न पर संभव किस्म नांऽ { $variantName } आस्तै कोई विकल्प नेईं दित्ता गेदा।

select-variant-name-not-possible = select आस्तै दित्ता गेदा किस्म नांऽ { $variantName } संभव किस्म नांऽ नेईं ऐ।

select-too-few-options = सिर्फ { $numOptions } चा { $numToSelect } घटक नेईं चुने जाई सकदे।

select-from-sequence-too-few-values = { $length } लंबाई दे अनुक्रम चा { $numToSelect } मुल्ल नेईं चुने जाई सकदे।

select-from-sequence-indices-count-mismatch = select आस्तै दित्ते गेदे सूचकांकें दी गिनतरी चुनने दी गिनतरी कन्नै मिलनी चाहिदी

select-from-sequence-indices-not-integers = select आस्तै दित्ते गेदे सारे सूचकांक पूर्णांक होने चाहिदे

select-from-sequence-index-excluded = selectfromsequence दा दित्ता गेदा सूचकांक बाह्रर रक्खेआ गेदा हा

select-from-sequence-indices-excluded-combination = selectfromsequence दे दित्ते गेदे सूचकांक इक बाह्रर रक्खेआ गेदा जोड़ हा

select-from-sequence-coprime-not-positive-integers = धनात्मक पूर्णांक नेईं चुने जा करदे, इस्सै करी सह-अभाज्य जोड़ नेईं चुने जाई सकदे।

select-from-sequence-coprime-common-factor = सह-अभाज्य गिनतरियां नेईं चुनियां जाई सकदियां। सारे संभव मुल्लें दा इक सांझा गुणनखंड ऐ। ("from" जां "to" दे दित्ते गेदे मुल्ल "step" कन्नै सह-अभाज्य होने चाहिदे।)

select-from-sequence-coprime-single-number = 1 गी छड्डियै कुसै इकल्ली गिनतरी चा सह-अभाज्य जोड़ नेईं चुने जाई सकदे।

select-from-sequence-excluded-too-many-combinations = selectFromSequence च 70% कोला मते जोड़ बाह्रर रक्खे गेदे

select-from-sequence-coprime-none-found = सह-अभाज्य गिनतरियां नेईं चुनियां जाई सकियां। सारे संभव मुल्लें दा इक सांझा गुणनखंड ऐ।

select-from-sequence-too-few-unique-values = { $numPossibleValues } लंबाई दे अनुक्रम चा { $numToSelect } अनोखे मुल्ल नेईं चुने जाई सकदे

select-prime-numbers-too-few-values = { $numValues } लंबाई दी अभाज्य गिनतरियें दी सूची चा { $numToSelect } मुल्ल नेईं चुने जाई सकदे

select-prime-numbers-values-count-mismatch = select आस्तै दित्ते गेदे मुल्लें दी गिनतरी चुनने दी गिनतरी कन्नै मिलनी चाहिदी

select-prime-numbers-values-not-prime = select prime number आस्तै दित्ते गेदे सारे मुल्ल अभाज्य गिनतरियें दी सूची च होने चाहिदे

select-prime-numbers-values-excluded-combination = selectPrimeNumbers दे दित्ते गेदे मुल्ल इक बाह्रर रक्खेआ गेदा जोड़ हा

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers च 70% कोला मते जोड़ बाह्रर रक्खे गेदे

select-random-combination-fluke = मते असंभव इत्तफाक कन्नै यादृच्छिक मुल्लें दा जोड़ नेईं चुनेआ जाई सकेआ

select-random-value-fluke = मते असंभव इत्तफाक कन्नै यादृच्छिक मुल्ल नेईं चुनेआ जाई सकेआ
