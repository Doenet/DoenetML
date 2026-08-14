# Bodo diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] मोननै जोबथा बिन्दु होनायाव { $attributes }खौ नायखानाय जायो
       *[other] मोननै जोबथा बिन्दु होनायाव { $attributes }खौ नायखानाय जायो
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] जोबथा बिन्दु आरो गेजेर बिन्दु मोननैबो होनायाव { $attributes }खौ नायखानाय जायो
       *[other] जोबथा बिन्दु आरो गेजेर बिन्दु मोननैबो होनायाव { $attributes }खौ नायखानाय जायो
    }

line-segment-midpoint-offset-without-midpoint = गेजेर बिन्दु गैयाब्ला midpointOffsetनि जेबो फिथाय गैया

## `<line>`

line-points-undetermined-dimensions = थि जायै आयदानि बिन्दुफोरजों थांनाय सारि।

line-points-too-few-dimensions = सारिआ खमैबो मोननै आयदानि बिन्दुफोरजों थांनांगौ।

line-points-depend-on-variables = सारिआ बै बिन्दुफोरजों थांयो जायफोरा चरनि सिङाव दं: { $variables }।

line-equation-invalid-format = चर { $variable1 } आरो { $variable2 }आव सारि समीकरणनि गोरोन्थि रोखोम।

## `<ray>`

ray-overprescribed-through = किरणखौ through, endpoint आरो direction — मोनथामजों थि खालामबाय। होनाय through नायखानाय जाबाय।

ray-dimension-mismatch = किरणआव numDimensions मिलिआखै।

## `<vector>`

vector-overprescribed-head = सदिशखौ head, tail आरो displacement — मोनथामजों थि खालामबाय। होनाय head नायखानाय जाबाय।

vector-dimension-mismatch = सदिशआव numDimensions मिलिआखै।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>`आव nearestPoint मुंनि थाखो चर गैया, बेखायनो बेनिसिम गोसो हरनो हाया।

constrain-to-without-nearest-point = `<{ $component }>`आव nearestPoint मुंनि थाखो चर गैया, बेखायनो बेनि गोजौआव सिन्थि होनो हाया।

constrain-to-interior-without-nearest-point = `<{ $component }>`आव nearestPoint मुंनि थाखो चर गैया, बेखायनो बेनि सिङाव सिन्थि होनो हाया।

## `<choiceInput>`

choice-input-label-position-ignored = इनलाइन नङै choiceInputनि थाखाय labelPosition नायखानाय जायो

## Ordering children by index

choice-input-indices-count-mismatch = choiceInputनि थाखाय होनाय सूचकांकफोर नायखानाय जायो, मानोना सूचकांकनि अनजिमा बासिखथाय फिसाजोनि अनजिमाजों मिलिआ।

pretzel-indices-count-mismatch = problemनि थाखाय होनाय सूचकांकफोर नायखानाय जायो, मानोना सूचकांकनि अनजिमा problem फिसाजोनि अनजिमाजों मिलिआ।

shuffle-indices-count-mismatch = shuffleनि थाखाय होनाय सूचकांकफोर नायखानाय जायो, मानोना सूचकांकनि अनजिमा बाहागोनि अनजिमाजों मिलिआ।

indices-ignored-out-of-range = { $component }नि थाखाय होनाय सूचकांकफोर नायखानाय जायो, मानोना मोनसे मोननै सूचकांक सिमानि बायजोआव दं।

pretzel-indices-repeated = pretzelनि थाखाय होनाय सूचकांकफोर नायखानाय जायो, मानोना मोनसे मोननै सूचकांक फिन फिन फैबाय।

pretzel-circuit-first-index = circuit रोखोमआव pretzelनि थाखाय होनाय सूचकांकफोर नायखानाय जायो, मानोना गिबि सूचकांकआ 1 जानांगौ।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>`खौ स्ट्रिं फिसाजोजों खामानि मावहोनो `type` आखुथाय होनांगौ।

invalid-type-defaulting-to-math = { $component } बाहागोनि थाखाय { $type } रोखोमआ गोरोन्थि। math, text, number एबा booleanनिफ्राय मोनसे जानांगौ। गुबैयै math लानाय जायो।

string-not-valid-component-to-arrange = स्ट्रिं "{ $value }"आ { $component }नि थाखाय गनायथि होनाय बाहागो नङा। नायखानाय जाबाय।

## Types and variables

invalid-type-defaulting-to-number = { $type } रोखोमआ गोरोन्थि, रोखोमखौ number खालामनाय जायो।

invalid-variable-value = चरनि गोरोन्थि बेसेन: `{ $value }`

## Variants

variant-index-must-be-number = रोखोम सूचकांक { $index } मोनसे अनजिमा जानांगौ

variant-index-must-be-integer = रोखोम सूचकांक { $index } मोनसे पूर्णांक जानांगौ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>`खौ निरपेक्ष मापनि थाखाय बानायाखै। गुवारखौ सापेक्ष खालामनाय जायो।

side-by-side-absolute-margins = `<{ $component }>`खौ निरपेक्ष मापनि थाखाय बानायाखै। सिमाखौ सापेक्ष खालामनाय जायो।

side-by-side-no-block-child = गोरोन्थि `<{ $component }>`: बेयाव खमैबो मोनसे ब्लक फिसाजो थानांगौ।

## `<label>`

label-for-ignored-on-graphical = आलेखीय `<label>`आव `for` आखुथाय नायखानाय जायो।

label-for-must-resolve-to-one = `<label>`आव `for` आखुथाया थार मोनसे बाहागोखौ दिन्थिनांगौ।

label-for-unresolved = `<label>`आव `for` आखुथाया जेबो बाहागोखौ दिन्थिनो हायाखै।

label-for-answer-with-authored-inputs = `<label>`आव `for` आखुथाया बै `<answer>`खौ दिन्थियो जायाव लिरगिरिया गावनो हाबहोनाय लिरबाय; हाबहोनायखौ थेवबो दिन्थि।

label-for-answer-without-input = `<label>`आव `for` आखुथाया बै `<answer>`खौ दिन्थियो जायाव लेबेल होनो हाथाव हाबहोनाय गैया।

label-for-must-reference-input-or-answer = `<label>`आव `for` आखुथाया मोनसे हाबहोनाय एबा फिनखौ दिन्थिनांगौ।

## Accessibility

accessibility-short-description-or-decorative = मोनथाव जायगानि थाखाय `<{ $component }>`नि फोरमायथि खोदोम बेखेवथि थानांगौ एबा बेखौ decorative होननो नांगौ।

accessibility-video-short-description = मोनथाव जायगानि थाखाय `<video>`नि खोदोम बेखेवथि थानांगौ।

accessibility-input-short-description-or-label = मोनथाव जायगानि थाखाय `<{ $component }>`नि खोदोम बेखेवथि एबा लेबेल थानांगौ।

accessibility-answer-input-short-description-or-label = मोनथाव जायगानि थाखाय हाबहोनाय बानायग्रा `<answer>`नि खोदोम बेखेवथि एबा लेबेल थानांगौ।

accessibility-short-description-contains-math = खोदोम बेखेवथियाव `<{ $component }>` बादि गणित बाहागो थानो नांगोमा। गणितखौ सोदोबजों लिर।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] बाहागो बिमुं फोरमायथिनि थाखाय { $colorName }नि गैलाव-गोदान खमबाय (गोसो मोड) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; खमैबो { $threshold }:1 नांगौ)।
       *[other] बाहागो बिमुं फोरमायथिनि थाखाय { $colorName }नि गैलाव-गोदान खमबाय ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; खमैबो { $threshold }:1 नांगौ)।
    }

## `<circle>`

circle-through-points-non-numerical = जेराव बिन्दुफोरनि अनजिमा बेसेन गैया, बेराव { $count } बिन्दुजों थांनाय `<circle>` दासिम बानायाखै।

circle-too-many-through-points = थामनिख्रुइ बांसिन बिन्दुजों थांनाय बृत्तखौ हिसाब खालामनो हाया।

circle-overprescribed-radius-center-points = होनाय त्रिज्या, गेजेर आरो बिन्दु — मोनथामजों बृत्तखौ हिसाब खालामनो हाया।

circle-center-with-multiple-points = होनाय गेजेरजों मोनसेख्रुइ बांसिन बिन्दुजों थांनाय बृत्तखौ हिसाब खालामनो हाया।

circle-radius-too-small = बृत्तखौ हिसाब खालामनो हाया: मोननै बिन्दुनि गेजेरनि गोजान { $distance }, बेखायनो होनाय त्रिज्या { $radius }आ बेसेबां फिसा।

circle-radius-with-many-points = होनाय त्रिज्याजों मोननैख्रुइ बांसिन बिन्दुजों थांनाय बृत्त बानायनो हाया।

circle-invalid-center-or-through-points = बृत्तनि गोरोन्थि गेजेर एबा बिन्दु।

circle-radius-center-with-multiple-points = होनाय गेजेरजों मोनसेख्रुइ बांसिन बिन्दुजों थांनाय बृत्तनि त्रिज्याखौ हिसाब खालामनो हाया।

circle-change-radius-non-numerical = अनजिमा नङै बिन्दुजों थांनाय बृत्तनि त्रिज्याखौ सोलायनो हाया

circle-radius-with-points-non-numerical = अनजिमा बेसेन गैयाब्ला, होनाय त्रिज्याजों मोनसेख्रुइ बांसिन बिन्दुजों थांनाय बृत्त बानायनो हाया।

circle-change-center-non-numerical = अनजिमा नङै बेसेननि बिन्दुजों थांनाय बृत्तनि गेजेर सोलायनाय दासिम बानायाखै।

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] फलननि प्रान्तनि थाखाय आयदा खमबाय। प्रान्तआव { $intervals } अन्तराल दं नाथाय फलनआव { $inputs ->
            [one] { $inputs } हाबहोनाय
           *[other] { $inputs } हाबहोनाय
        } दं।
       *[other] फलननि प्रान्तनि थाखाय आयदा खमबाय। प्रान्तआव { $intervals } अन्तराल दं नाथाय फलनआव { $inputs ->
            [one] { $inputs } हाबहोनाय
           *[other] { $inputs } हाबहोनाय
        } दं।
    }

function-domain-invalid-format = फलननि प्रान्तनि गोरोन्थि रोखोम।

function-ignoring-non-numerical =
    { $type ->
        [maximum] फलननि अनजिमा नङै गोबाव बेसेन नायखानाय जाबाय।
        [minimum] फलननि अनजिमा नङै खम बेसेन नायखानाय जाबाय।
        [extremum] फलननि अनजिमा नङै जोबथा बेसेन नायखानाय जाबाय।
        [point] फलननि अनजिमा नङै बिन्दु नायखानाय जाबाय।
        [slope] फलननि अनजिमा नङै ढाल नायखानाय जाबाय।
       *[other] फलननि अनजिमा नङै { $type } नायखानाय जाबाय।
    }

function-ignoring-empty =
    { $type ->
        [maximum] फलननि लांदां गोबाव बेसेन नायखानाय जाबाय।
        [minimum] फलननि लांदां खम बेसेन नायखानाय जाबाय।
        [extremum] फलननि लांदां जोबथा बेसेन नायखानाय जाबाय।
        [point] फलननि लांदां बिन्दु नायखानाय जाबाय।
       *[other] फलननि लांदां { $type } नायखानाय जाबाय।
    }

function-points-too-close = फलनआव मोननै बिन्दुआ बेसेबां खाथियाव दं। फलनखौ थि खालामनो हाया।

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] फलननि आवृत्तिया बैसमावनो जानो हागौ जेब्ला हाबहोनायनि अनजिमाया ओंखारनायनि अनजिमाजों समान जायो। बे फलनआव { $inputs } हाबहोनाय आरो { $outputs ->
            [one] { $outputs } ओंखारनाय
           *[other] { $outputs } ओंखारनाय
        } दं।
       *[other] फलननि आवृत्तिया बैसमावनो जानो हागौ जेब्ला हाबहोनायनि अनजिमाया ओंखारनायनि अनजिमाजों समान जायो। बे फलनआव { $inputs } हाबहोनाय आरो { $outputs ->
            [one] { $outputs } ओंखारनाय
           *[other] { $outputs } ओंखारनाय
        } दं।
    }

## `<sequence>`

sequence-invalid-length = अनुक्रमनि गोरोन्थि गोलाव। मोनसे ऋणात्मक नङै पूर्णांक जानांगौ।

sequence-invalid-step = अनुक्रमनि गोरोन्थि थाखो। { $type } रोखोमनि अनुक्रमनि थाखाय मोनसे अनजिमा जानांगौ।

sequence-invalid-endpoint-number = अनजिमा अनुक्रमनि गोरोन्थि "{ $attribute }"। मोनसे अनजिमा जानांगौ।

sequence-invalid-endpoint-letters = हांखो अनुक्रमनि गोरोन्थि "{ $attribute }"। हांखोनि जोनोम जानांगौ।

sequence-invalid-endpoint = अनुक्रमनि गोरोन्थि "{ $attribute }"।

select-from-sequence-coprime-not-numbers = अनजिमा बासिखनाय जायाखै, बेखायनो coprime नायखानाय जाबाय

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations होबाय, बेखायनो coprime नायखानाय जाबाय

## Resolving a `target`

target-not-found = `<{ $source }>`नि थाखाय गोरोन्थि थांखि: थांखि मोनाखै।

target-state-variable-not-found = `<{ $source }>`नि थाखाय गोरोन्थि थांखि: `<{ $component }>`आव "{ $property }" मुंनि थाखो चर मोनाखै।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`नि चरफोरा गावनो थाग्रा चरनिफ्राय गुबुन जानांगौ।

ode-system-duplicate-variable-names = फिन फिन फैनाय आश्रित चर मुंजों ODE RHS फलन थि खालामनो हाया।

ode-system-rhs-function-error = ODE RHS फलन थि खालामनो हाया। mathjs फलन बानायनायाव गोरोन्थि।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } सारिनि गेजेराव कोण थि खालामनो हाया

angle-invalid-through-point = `<angle>`नि throughआव गोरोन्थि बिन्दु

parabola-vertex-too-many-points = बिजौजों मोनसेख्रुइ बांसिन बिन्दुजों थांनाय परवलय दासिम बानायाखै।

parabola-too-many-points = थामनिख्रुइ बांसिन बिन्दुजों थांनाय परवलय दासिम बानायाखै।

intersection-too-many-items = मोननैख्रुइ बांसिन बेसादनि प्रतिच्छेद दासिम बानायाखै

## Other math components

ionic-compound-not-two-ions = मोननै आयननिख्रुइ गुबुननि थाखाय आयनिक यौगिक दासिम बानायाखै।

ionic-compound-needs-cation-and-anion = आयनिक यौगिकखौ खालि मोनसे धनायन आरो मोनसे ऋणायननि थाखाय बानायबाय।

solve-equations-cannot-evaluate = समीकरणनि बेसेन दिहुननो हायाखै, बेखायनो बेखौ सुस्रांनो हाया: { $equation }

math-operators-operand-number-required = गणित संकार्य दिहुननो operandNumber होनांगौ।

eigen-decomposition-failed = आव्यूहनि आइगेन बेसेन हिसाब खालामनो हायाखै

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: प्राचल { $parameters }आ नमुनायाव गैया, बेखायनो बेयो सान्नैबो लांदांजों मिलिगोन।
       *[other] `<matchesPattern>`: प्राचल { $parameters }आ नमुनायाव गैया, बेखायनो बेफोरा सान्नैबो लांदांजों मिलिगोन।
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }"खौ बुजिनो हायाखै। बेयो none, medium, dense, एबा लांदां जायगाजों बोखावनाय मोननै धनात्मक अनजिमा जानांगौ, जेरै grid="1 0.5"। जेबो जाल हरखानाय जायाखै।

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure दिन्थिग्रायाव xLabelPosition="left" मददखानाय नङा; rightनि आचार लानाय जायो।

prefigure-y-label-position-unsupported = `<graph>`: prefigure दिन्थिग्रायाव yLabelPosition="bottom" मददखानाय नङा; topनि आचार लानाय जायो।

prefigure-invalid-axis-bounds = `<graph>`: prefigure सोलायनायनि थाखाय गोरोन्थि अक्ष सिमा; गुबै bbox (-10,-10,10,10) लानाय जायो।

prefigure-invalid-width = `<graph>`: prefigure सोलायनायनि थाखाय गोरोन्थि गुवार; गुबै मुसुखा गुवार 425 लानाय जायो।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure सोलायनायनि थाखाय गोरोन्थि aspectRatio; गुबै अनुपात 1 लानाय जायो।

prefigure-grid-spacing-too-fine = `<graph>`: अक्ष सिमानि थाखाय जालनि गेजेर बेसेबां फिसा; prefigure दिन्थिग्रायाव जालखौ नागारनाय जायो।

prefigure-annotations-not-rendered = `<graph>`: PreFigure दिन्थिग्रा बाहायाब्ला टिप्पनी हरखानाय जानो नङा।

multiple-annotations-children = `<graph>`आव गोबां `<annotations>` फिसाजो मोनखांबाय; जोबथाखौ नागारनानै गासैखौबो नायखानाय जाबाय।

## Referring to other components

copy-unrecognized-component-type = मिथिजायै बाहागो रोखोमखौ बांहोनो एबा नकल खालामनो हाया: { $type }।

copy-prop-not-found = { $component } रोखोमनि बाहागोआव { $property } गुण मोनाखै

collect-no-source = collectनि थाखाय जेबो जरा मोनाखै।

collect-invalid-component-type = `<{ $component }>` रोखोमनि बाहागोखौ खौसे खालामनो हाया, मानोना बेयो गोरोन्थि बाहागो रोखोम।

reference-index-unavailable = सूचकांक `{ $reference }`खौ दिन्थिनो हाया

## `<callAction>`

component-action-unavailable = बाहागो `{ $reference }`आव { $action } खालामनो हाया

## `<dataFrame>`

data-frame-inconsistent-row-lengths = डाटानि रोखोमआ गोरोन्थि। सारिनि गोलावआ समान नङा। componentIdx :{ $componentIdx }आव मोनखांबाय

data-frame-duplicate-column-names = डाटायाव फिन फिन फैनाय खाम्फा मुं दं। componentIdx :{ $componentIdx }आव मोनखांबाय

data-frame-missing-column-name = डाटायाव मोनसे खाम्फा मुं गैया। componentIdx :{ $componentIdx }आव मोनखांबाय

## `<answer>` and scoring

answer-award-depends-on-own-response = बे फिननि मोनसे awardआ बे answer टेगनि गावनि दैथायखानाय फिननि सिङाव दं, बेजों मिजिं जायै आचार जागोन।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` गोनां बाथ्रानि सिङाव थानाय `<answer>`आव `maxNumAttempts` होनायनि जेबो फिथाय गैया, मानोना नाजाथायनि अनजिमाखौ बाथ्रा सिन्थि होयो। `maxNumAttempts`खौ बाथ्रायाव हो।

nested-section-wide-check-work-max-num-attempts = गुबुन `sectionWideCheckWork` गोनां बाथ्रानि सिङाव थानाय `sectionWideCheckWork` बाथ्रायाव `maxNumAttempts` होनायनि जेबो फिथाय गैया, मानोना नाजाथायनि अनजिमाखौ बायजोनि बाथ्रा सिन्थि होयो। `maxNumAttempts`खौ बायजोनि बाथ्रायाव हो।

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality गैयाब्ला { $attributes } आखुथायनि जेबो फिथाय जानो नङा।
       *[other] symbolicEquality गैयाब्ला { $attributes } आखुथायफोरनि जेबो फिथाय जानो नङा।
    }

answer-invalid-type = फिननि थाखाय गोरोन्थि रोखोम: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` बाहागोनि मुं गैया, बेखायनो बेखौ module आखुथाय बादि बाहायनो हाया

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` बाहागोखौ moduleनि आखुथाय बादि बाहायनो हाया, मानोना `<module>` बाहागो रोखोमआव "{ $name }" आखुथाय सिगाङावनो थि खालामबाय।

conditional-content-condition-ignored = case एबा else फिसाजो गोनां `<conditionalContent>` बाहागोआव `condition` आखुथाय नायखानाय जायो।

slider-markers-type-mismatch = सिननि रोखोमआ sliderनि रोखोमजों मिलिआ।

pretzel-problem-needs-statement-and-answer = गोरोन्थि pretzel: मोनफ्रोम `<problem>`आव मोनसे `<statement>` आरो मोनसे `<answer>` थानांगौ।

pretzel-circuit-first-problem-distractor = गोरोन्थि pretzel: mode="circuit"आव गिबि `<problem>`आ भ्रामक जानो हाया।

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` आखुथायनि थाखाय गोरोन्थि बेसेन { $values }; नायखानाय जाबाय।
       *[other] `{ $attribute }` आखुथायनि थाखाय गोरोन्थि बेसेन { $values }; नायखानाय जाबाय।
    }

attribute-must-be-references = `{ $attribute }` आखुथायनि थाखाय `{ $value }` गोरोन्थि बेसेन। आखुथाया `$`जों जागायनाय सोमोन्दोजों बानायजानांगौ।

math-input-invalid-function-names = <mathInput>: { $attribute }आव गोरोन्थि फलन मुं नायखानाय जाबाय: { $names }। मोनफ्रोम मुंनि दिन्थिनाय बाहागोआव खमैबो मोननै हांखो (हांखो एबा जोनोम सिन) थानांगौ; बेनि उनाव गोसोजों `|<mathspeak alternative>` होनो हागौ।

## Building components from the source

component-type-invalid = गोरोन्थि बाहागो रोखोम: `<{ $componentType }>`

attribute-repeated = { $attribute } आखुथायखौ फिन होनो हाया।

attribute-invalid-for-component = `<{ $componentType }>` रोखोमनि बाहागोनि थाखाय "{ $attribute }" आखुथाया गोरोन्थि।

## Style definition contrast

style-definition-insufficient-contrast =
    आदब बेखेवथि { $styleNumber }आव { $context ->
        [text-on-background] फाइल गाबनि सिगांआव फोरमायथि गाबनि
        [high-contrast] केनभासनि सिगांआव गोजौ-गैलाव गाबनि
        [line] केनभासनि सिगांआव सारि गाबनि
        [marker] केनभासनि सिगांआव सिन गाबनि
       *[text-on-canvas] केनभासनि सिगांआव फोरमायथि गाबनि
    } गैलाव-गोदान खमबाय{ $mode ->
        [dark] { " (गोसो मोड)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; खमैबो { $threshold }:1 नांगौ)।

style-definition-dark-mode-text-background-contrast =
    आदब बेखेवथि { $styleNumber }आव होनाय गाबफोरा गोफुर मोडनि थाखाय जोबोद गैलाव-गोदान होयोब्लाबो, बेनिफ्राय दिहुननाय गोसो मोड गाबफोरआव फाइल गाबनि सिगांआव फोरमायथि गाबनि गैलाव-गोदान खमबाय ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; खमैबो { $threshold }:1 नांगौ)। { $suggestion ->
        [available] गोसो मोडआव जोबोद गैलाव-गोदाननि थाखाय एबा गोफुर मोडनि गैलाव-गोदान बांहो (जेरै { $lightAttribute }="{ $lightColor }"), एबा गोसो मोड गाबखौ गावनो हो (जेरै { $darkAttribute }="{ $darkColor }")।
       *[none] गोसो मोडआव जोबोद गैलाव-गोदाननि थाखाय गोफुर मोडनि गैलाव-गोदान बांहो, एबा दिहुननाय गाबफोरखौ textColorDarkMode आरो/एबा backgroundColorDarkModeजों गावनो हो।
    }

style-definition-dark-mode-text-canvas-contrast =
    आदब बेखेवथि { $styleNumber }आव होनाय फोरमायथि गाबआ गोफुर मोडनि थाखाय जोबोद गैलाव-गोदान होयोब्लाबो, बेनिफ्राय दिहुननाय गोसो मोड फोरमायथि गाबनि केनभासनि सिगांआव गैलाव-गोदान खमबाय ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; खमैबो { $threshold }:1 नांगौ)। { $suggestion ->
        [available] गोसो मोडआव जोबोद गैलाव-गोदाननि थाखाय एबा गोफुर मोडनि गैलाव-गोदान बांहो (जेरै textColor="{ $lightColor }"), एबा गोसो मोड गाबखौ गावनो हो (जेरै textColorDarkMode="{ $darkColor }")।
       *[none] गोसो मोडआव जोबोद गैलाव-गोदाननि थाखाय गोफुर मोडनि गैलाव-गोदान बांहो, एबा दिहुननाय गाबखौ textColorDarkModeजों गावनो हो।
    }

section-multiple-style-palettes = मोनसे बाहागोआ खालि मोनसे <stylePalette> बासिखनो हागौ; जोबथाखौ लानाय जायो।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component }नि गुबुन रोखोमखौ थि खालामनो हाया, मानोना numToSelectआ ऋणात्मक नङै पूर्णांक नङा।

variant-num-to-select-not-constant-number = { $component }नि गुबुन रोखोमखौ थि खालामनो हाया, मानोना numToSelectआ थाखो अनजिमा नङा।

variant-with-replacement-not-constant-boolean = { $component }नि गुबुन रोखोमखौ थि खालामनो हाया, मानोना withReplacementआ थाखो बूलियन नङा।

variant-select-weight-disables-unique = जुदि जायखि जाया बासिखथायाव selectWeight एबा selectForVariants होबाय, selectनि गुबुन रोखोम बन्द जायो

variant-coprime-undetermined = { $component }नि गुबुन रोखोमखौ थि खालामनो हाया, मानोना coprimeआ सान्नैबो फोसाब बेखौ थि खालामनो हायाखै।

variant-attribute-not-constant = { $component }नि गुबुन रोखोमखौ थि खालामनो हाया, मानोना { $attribute }आ थाखो नङा।

variant-attribute-not-number = { $component }नि गुबुन रोखोमखौ थि खालामनो हाया, मानोना { $attribute }आ अनजिमा नङा।

variant-attribute-wrong-type-for-sequence =
    { $type } रोखोमनि { $component }नि गुबुन रोखोमखौ थि खालामनो हाया, मानोना { $attribute }आ { $expected ->
        [letters-combination] हांखोनि जोनोम
        [math-expression] गनायथि होनाय गणित बाथ्रा
        [integer] पूर्णांक
       *[number] अनजिमा
    } नङा।

variant-length-not-integer = { $component }नि गुबुन रोखोमखौ थि खालामनो हाया, मानोना lengthआ पूर्णांक नङा।

variant-sort-not-implemented = sort गोनां { $component }नि गुबुन रोखोम दासिम बानायाखै

variant-exclude-combinations-not-implemented = excludeCombinations गोनां { $component }नि गुबुन रोखोम दासिम बानायाखै

variant-math-exclude-not-implemented = exclude गोनां math रोखोमनि { $component }नि गुबुन रोखोम दासिम बानायाखै

variant-non-constant-exclude-not-implemented = थाखो नङै exclude गोनां { $component }नि गुबुन रोखोम दासिम बानायाखै

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure दिन्थिग्रायाव मददखानाय नङा; फिसाजो नागारबाय।

prefigure-descendant-invalid-geometry = { $subject }: सिमा गैयै एबा आबुंआ ज्यामिति; फिसाजो नागारबाय।

prefigure-curve-label-omitted = { $subject }: सोलायखानाय बांखां बाहागोआव लेबेल मददखानाय नङा; लेबेल नागारबाय।

prefigure-curve-unsupported-definition-type = { $subject }: बांखां फलन बेखेवथि रोखोम '{ $definitionType }' मददखानाय नङा; फिसाजो नागारबाय।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurvesआव flipFunctions आखुथाय मददखानाय नङा; फिसाजो नागारबाय।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurvesआव खालि formula रोखोमनि फिसाजो फलन मददखानाय; फिसाजो नागारबाय।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] सारि-सोलेरनि लेबेल
       *[point] बिन्दु लेबेल
    }नि थाखाय labelPosition '{ $labelPosition }' मददखानाय नङा; गुबै PreFigure सारिथाय लाबाय।

prefigure-fill-style-unsupported = { $subject }: आबुंनाय आदब '{ $fillStyle }' PreFigureआव मददखानाय नङा; गोख्रों आबुंनाय लाबाय।

prefigure-line-style-unknown = { $subject }: मिथिजायै सारि आदब '{ $lineStyle }' PreFigure ओंखारनायनिफ्राय नागारबाय।

prefigure-marker-style-mapped-to-diamond = { $subject }: सिन आदब '{ $markerStyle }' PreFigureनि 'diamond' आदबआव सोलायबाय।

prefigure-marker-style-unsupported = { $subject }: सिन आदब '{ $markerStyle }' PreFigureआव मददखानाय नङा; गुबै आदब लाबाय।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: गोरोन्थि `ref`; थांखि मोनाखै। टिप्पनी नागारबाय।

annotation-ref-multiple-targets = `<annotation>`: `ref`निफ्राय गोबां थांखि मोनखांबाय; गिबि थांखि लाबाय।

annotation-ref-outside-graph = `<annotation>`: गोरोन्थि `ref`; थांखिआ बै graphनि बायजोआव दं। टिप्पनी नागारबाय।

annotation-ref-unsupported-target = `<annotation>`: गोरोन्थि `ref`; prefigure सोलायनायाव थांखिआ मददखानाय आलेखीय बेसाद नङा। टिप्पनी नागारबाय।

annotation-text-missing = `<annotation>`: `text` गैया एबा लांदां; लांदां फोरमायथि होबाय।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] गोलाव सिङाव थानाय मोनखांबाय।
       *[other] `<{ $componentType }>` बाहागोजों गोलाव सिङाव थानाय मोनखांबाय।
    }

reference-no-referent = सोमोन्दोनि जेबो थांखि मोनाखै: `{ $reference }`

reference-multiple-referents = सोमोन्दोनि गोबां थांखि मोनखांबाय: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>`नि { $attribute } आखुथायनि गोरोन्थि रोखोम।

children-invalid = `<{ $componentType }>`नि थाखाय गोरोन्थि फिसाजो: गोरोन्थि फिसाजो मोनखांबाय: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` आखुथायनि थाखाय `{ $value }` गोरोन्थि बेसेन, `{ $default }` बेसेन लानाय जायो

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML बिसन { $version } मोनाखै।
       *[other] DoenetML बिसन { $version } मोनाखै। बिसन { $fallback } लानाय जायो
    }

## Reading the DoenetML

parse-invalid-doenetml = गोरोन्थि DoenetML: { $content }

parse-tag-missing-close-tag = गोरोन्थि DoenetML: टेग `{ $tag }`नि जेबो बन्द टेग गैया। गावनो बन्द जाग्रा टेग एबा `</{ $tagName }>` टेग नांगौ।

parse-tag-error = गोरोन्थि DoenetML: टेग `<{ $tagName }>`आव गोरोन्थि

parse-attribute-missing-value = गोरोन्थि DoenetML: गोरोन्थि आखुथाय `{ $attribute }`आव बेसेन गैया बादि नुयो।

parse-attribute-invalid = गोरोन्थि DoenetML: गोरोन्थि आखुथाय `{ $attribute }`

parse-attribute-value-invalid = गोरोन्थि DoenetML: गोरोन्थि आखुथाय बेसेन `{ $value }`

parse-attribute-value-quote-mismatch = गोरोन्थि DoenetML: गोरोन्थि आखुथाय बेसेन `{ $value }`। उद्धरण सिन मिलिआ। `{ $quote }` गैया बादि नुयो

parse-open-tag-name-missing = गोरोन्थि DoenetML: टेग मुं गैयै टेग मोनखांबाय, जेरै `<`

parse-tag-not-closed = गोरोन्थि DoenetML: टेग `{ $tag }` बन्द जायाखै (`>` गैया बादि नुयो)।

parse-self-closing-tag-name-missing = गोरोन्थि DoenetML: टेग मुं गैयै टेग मोनखांबाय `<{ $content }>`

parse-self-closing-tag-not-closed = गोरोन्थि DoenetML: टेग `{ $tag }` बन्द जायाखै (`/>` गैया बादि नुयो)।

parse-tag-invalid-attributes = गोरोन्थि DoenetML: टेग `{ $tag }` गनायथि होथाव नङा। बेनि आखुथायफोर गोरोन्थि जानो हागौ।

parse-close-tag-name-missing = गोरोन्थि DoenetML: टेग मुं गैयै बन्द टेग मोनखांबाय, जेरै `</`

parse-attribute-value-unquoted = आखुथाय बेसेनखौ उद्धरण सिननि गेजेराव दोननांगौ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = गोरोन्थि DoenetML: बन्द टेग `{ $tag }` मोनखांबाय, नाथाय बेनि जेबो खेवनाय टेग गैया

parse-close-tag-mismatched = गोरोन्थि DoenetML: बन्द टेग मिलिआ। `</{ $expected }>` नांगौमोन। `{ $found }` मोनखांबाय

parser-node-unconvertible = नोड { $node }खौ Dast नोडआव सोलायनो हायाखै।

## Names

name-attribute-invalid =
    गोरोन्थि आखुथाय name='{ $name }'। { $reason ->
        [characters] मुंआव खालि हांखो, अनजिमा, गाहाय सारि एबा जोनोम सिन थानो हागौ।
       *[start] मुंआ हांखोजों जागायनांगौ।
    }

component-name-invalid-start = गोरोन्थि बाहागो मुं "{ $name }"। मुंआ हांखोजों जागायनांगौ।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched रोखोमनि फिनआव video आखुथाय थानांगौ

answer-video-watched-video-not-reference = videoWatched रोखोमनि फिननि video आखुथाया मोनसे सोमोन्दो जानांगौ

answer-name-not-single-text = फिननि name आखुथायाव खालि मोनसे फोरमायथि फिसाजो थानांगौ

## Referencing another document

external-doenetml-recursion-limit = बेसेबां गोबां थाखोनि फिन फिन फैनायजों बायजोनि DoenetML लाबोनो हायाखै। जायखि जाया गोलाव सोमोन्दो दंनामा?

external-doenetml-unavailable = { $attribute }="{ $uri }"निफ्राय DoenetML लाबोनो हायाखै

external-doenetml-type-mismatch = { $attribute }="{ $uri }"निफ्राय लाबोनाय DoenetML गोरोन्थि: बेयो "{ $componentType }" बाहागो रोखोमजों मिलिआखै

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] आखुथाय `{ $from }` नागारबाय; बेनि सोलायाव `{ $to }` बाहाय।
       *[other] [deprecation] `<{ $component }>`आव आखुथाय `{ $from }` नागारबाय; बेनि सोलायाव `{ $to }` बाहाय।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] आखुथाय `{ $from }` नागारबाय आरो नायखानाय जाबाय, मानोना `{ $to }`बो होबाय।
       *[other] [deprecation] `<{ $component }>`आव आखुथाय `{ $from }` नागारबाय आरो नायखानाय जाबाय, मानोना `{ $to }`बो होबाय।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`आव आखुथाय `{ $attribute }` नागारबाय आरो नायखानाय जाबाय।

deprecated-attribute-to-child = [deprecation] `<{ $component }>`आव आखुथाय `{ $attribute }` नागारबाय; बेनि सोलायाव `<{ $child }>` फिसाजो बाहाय।

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>`आव आखुथाय `{ $attribute }`नि बेसेन `{ $value }` नागारबाय; बेनि सोलायाव `{ $to }` बाहाय।


## Language coverage

pluralize-english-only = `<pluralize>`आ खालि इंराजिनि गोबां रोखोम बानायनो हायो, बेखायनो { $locale }आव लिरखानाय दस्ताबेजआव बेनि फोरमायथिया एरनो थायो। गोबां रोखोमखौ थेवबो लिर, एबा `pluralForm` आखुथायजों हो।


## Checking against the schema

schema-element-unrecognized = बाहागो `<{ $tag }>` मिथिजानाय Doenet बाहागो नङा।

schema-element-not-allowed-at-root = बाहागो `<{ $tag }>`खौ दस्ताबेजनि गाहायाव गनायथि होनाय नङा।

schema-element-not-allowed-inside = बाहागो `<{ $tag }>`खौ `<{ $parent }>`नि सिङाव गनायथि होनाय नङा।

schema-attribute-unrecognized = बाहागो `<{ $tag }>`आव `{ $attribute }` मुंनि जेबो आखुथाय गैया।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] बाहागो `<{ $tag }>`नि `{ $attribute }` आखुथाया बैबादि लिस्ट जानांगौ जायनि मोनफ्रोम बेसादा बेफोरनिफ्राय मोनसे: { $allowed }
       *[other] बाहागो `<{ $tag }>`नि `{ $attribute }` आखुथाया बेफोरनिफ्राय मोनसे जानांगौ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = selectनि थाखाय गोरोन्थि रोखोम मुं। रोखोम मुं { $variantName }आ { $numOptions } बासिखथायाव फैयो नाथाय बासिखनो नांगौ अनजिमाया { $numToSelect }।

select-variant-name-without-options = selectनि थाखाय मोनसे मोननै रोखोम होबाय नाथाय जानो हाथाव रोखोम मुं { $variantName }नि थाखाय जेबो बासिखथाय होयाखै।

select-variant-name-not-possible = selectनि थाखाय होनाय रोखोम मुं { $variantName }आ जानो हाथाव रोखोम मुं नङा।

select-too-few-options = खालि { $numOptions }निफ्राय { $numToSelect } बाहागो बासिखनो हाया।

select-from-sequence-too-few-values = { $length } गोलावनि अनुक्रमनिफ्राय { $numToSelect } बेसेन बासिखनो हाया।

select-from-sequence-indices-count-mismatch = selectनि थाखाय होनाय सूचकांकनि अनजिमाया बासिखनो नांगौ अनजिमाजों मिलिनांगौ

select-from-sequence-indices-not-integers = selectनि थाखाय होनाय गासै सूचकांकफोरा पूर्णांक जानांगौ

select-from-sequence-index-excluded = selectfromsequenceनि होनाय सूचकांकआ नागारखानाय मोन

select-from-sequence-indices-excluded-combination = selectfromsequenceनि होनाय सूचकांकफोरा नागारखानाय जोनोम मोन

select-from-sequence-coprime-not-positive-integers = धनात्मक पूर्णांक बासिखनाय जायाखै, बेखायनो सह-अभाज्य जोनोम बासिखनो हाया।

select-from-sequence-coprime-common-factor = सह-अभाज्य अनजिमा बासिखनो हाया। गासै जानो हाथाव बेसेननि मोनसे लोगोसे गुणनखंड दं। ("from" एबा "to"नि होनाय बेसेनआ "step"जों सह-अभाज्य जानांगौ।)

select-from-sequence-coprime-single-number = 1 नङै मोनसे एखेरा अनजिमानिफ्राय सह-अभाज्य जोनोम बासिखनो हाया।

select-from-sequence-excluded-too-many-combinations = selectFromSequenceआव 70%निख्रुइ बांसिन जोनोम नागारखानाय जाबाय

select-from-sequence-coprime-none-found = सह-अभाज्य अनजिमा बासिखनो हायाखै। गासै जानो हाथाव बेसेननि मोनसे लोगोसे गुणनखंड दं।

select-from-sequence-too-few-unique-values = { $numPossibleValues } गोलावनि अनुक्रमनिफ्राय { $numToSelect } गुबुन बेसेन बासिखनो हाया

select-prime-numbers-too-few-values = { $numValues } गोलावनि अभाज्य अनजिमा लिस्टनिफ्राय { $numToSelect } बेसेन बासिखनो हाया

select-prime-numbers-values-count-mismatch = selectनि थाखाय होनाय बेसेननि अनजिमाया बासिखनो नांगौ अनजिमाजों मिलिनांगौ

select-prime-numbers-values-not-prime = select prime numberनि थाखाय होनाय गासै बेसेनफोरा अभाज्य अनजिमा लिस्टआव थानांगौ

select-prime-numbers-values-excluded-combination = selectPrimeNumbersनि होनाय बेसेनफोरा नागारखानाय जोनोम मोन

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbersआव 70%निख्रुइ बांसिन जोनोम नागारखानाय जाबाय

select-random-combination-fluke = जोबोद जानो हाथाव नङै आकस्मिकताजों यादृच्छिक बेसेननि जोनोम बासिखनो हायाखै

select-random-value-fluke = जोबोद जानो हाथाव नङै आकस्मिकताजों यादृच्छिक बेसेन बासिखनो हायाखै
