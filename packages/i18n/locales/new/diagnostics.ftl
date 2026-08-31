# Newar / Nepal Bhasa (नेपाल भाषा) diagnostics: the warnings and errors the
# worker raises and the reader is shown. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth. Selected by
# `uiLocale`, not by the language the document was written in.
#
# Message ids are never translated — only the text to the right of `=`.
# Neither are the DoenetML identifiers quoted inside these sentences:
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `maxNumAttempts`,
# `selectFromSequence`, `styleNumber` and every tag and attribute name like
# them are part of the language an author writes, not prose, and stay in
# English exactly as written. So does the `[deprecation]` marker, which is a
# label rather than a word, and so do `WCAG AA` and `PreFigure`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script** is `chrome.ftl`'s: Devanagari rather than Ranjana, for the
# reasons that file's header gives in full.
#
# **The technical vocabulary is Nepali and Sanskrit, declared as such** —
# अवैध, त्रुटि, चेतावनी, घटक, विशेषता, चर, आयाम, सन्दर्भ, अनुक्रम, संयोजन.
# Newar readers meet these words in Nepali schooling; coining Newar
# equivalents would put unfamiliar words in front of a reader who already has
# familiar ones. What is Newar is the frame around them: मफु and मफुत for the
# inabilities, मदु for absence, मखु for the negated copula, याये and its
# inflections for the verb, and नापं, निंतिं, स्वयां for the postpositions.
#
# **One paraphrase is declared and used everywhere so that one search replaces
# it.** English's *is ignored* is written «उपेक्षा याइ» throughout — literally
# *is disregarded*. It is a Sanskrit-register word rather than a Newar one,
# and it appears in thirty-six messages, so it is the first thing a speaker
# should replace. One message inflects it differently —
# `math-input-invalid-function-names` writes «उपेक्षा यानाच्वन» — so a search
# for «उपेक्षा» rather than for the whole phrase catches all of them.
#
# **No plural branches anywhere.** CLDR has no plural data for `new`, so
# `line-segment-attributes-ignored-with-endpoints` and its relatives write a
# single `*[other]` where English writes `[one]` and `[other]`. The one
# numeric literal that survives is `[1]` in
# `field-function-wrong-num-outputs`, which forks on how many outputs a
# component *needs* rather than on a count the reader is looking at; Fluent
# matches it against the number itself before any plural rule is consulted.
#
# **Numbers render in Latin digits** (#1615).

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] निगू endpoint तयातःबले { $attributes } या उपेक्षा याइ
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] endpoint व midpoint निगूं तयातःबले { $attributes } या उपेक्षा याइ
    }

line-segment-midpoint-offset-without-midpoint = midpoint मदुसा midpointOffset या छुं असर मदु

## `<line>`

line-points-undetermined-dimensions = आयाम मस्युगु बिन्दु द्वारा रेखा।

line-points-too-few-dimensions = रेखा उकिं न्ह्यथनागु बिन्दुत कम्तीमं निगू आयामया जुइमाः।

line-points-depend-on-variables = रेखा उकिं न्ह्यथनागु बिन्दुत चरय् आधारित दु: { $variables }।

line-equation-invalid-format = { $variable1 } व { $variable2 } चरय् रेखाया समीकरणया अवैध ढाँचा।

## `<ray>`

ray-overprescribed-through = किरण through, endpoint व direction स्वंलिसें तयातःगु दु।  तयातःगु through या उपेक्षा याइ।

ray-dimension-mismatch = किरणय् numDimensions मिले जुइ मफुत।

## `<vector>`

vector-overprescribed-head = सदिश head, tail व displacement स्वंलिसें तयातःगु दु।  तयातःगु head या उपेक्षा याइ।

vector-dimension-mismatch = सदिशय् numDimensions मिले जुइ मफुत।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` य् nearestPoint स्थिति चर मदुगुलिं उकियात आकर्षित याये मफु।

constrain-to-without-nearest-point = `<{ $component }>` य् nearestPoint स्थिति चर मदुगुलिं उकियात सीमित याये मफु।

constrain-to-interior-without-nearest-point = `<{ $component }>` य् nearestPoint स्थिति चर मदुगुलिं उकिया दुनेयात सीमित याये मफु।

## `<choiceInput>`

choice-input-label-position-ignored = inline मजूगु choiceInput या निंतिं labelPosition या उपेक्षा याइ

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput या निंतिं तयातःगु indices या संख्या choice कापंत या संख्या नापं मिले मजूगुलिं उकिया उपेक्षा याइ।

pretzel-indices-count-mismatch = problem या निंतिं तयातःगु indices या संख्या problem कापंत या संख्या नापं मिले मजूगुलिं उकिया उपेक्षा याइ।

shuffle-indices-count-mismatch = shuffle या निंतिं तयातःगु indices या संख्या घटकत या संख्या नापं मिले मजूगुलिं उकिया उपेक्षा याइ।

indices-ignored-out-of-range = { $component } या निंतिं तयातःगु indices मध्ये छुं सीमा पिने जूगुलिं उकिया उपेक्षा याइ।

pretzel-indices-repeated = pretzel या निंतिं तयातःगु indices मध्ये छुं दुबारा जूगुलिं उकिया उपेक्षा याइ।

pretzel-circuit-first-index = circuit मोडय् pretzel या निंतिं न्हापांगु index 1 जुइमाःगुलिं तयातःगु indices या उपेक्षा याइ।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` स्ट्रिङ कापंत नापं ज्या यायेत `type` विशेषता तयेमाः।

invalid-type-defaulting-to-math = { $component } घटकया निंतिं अवैध type { $type }। math, text, number वा boolean मध्ये छगू जुइमाः। math कथं तयाच्वन।

string-not-valid-component-to-arrange = स्ट्रिङ "{ $value }" { $component } यायेत वैध घटक मखु। उपेक्षा याइ।

## Types and variables

invalid-type-defaulting-to-number = अवैध type { $type }, type number कथं तयाच्वन।

invalid-variable-value = चरया अवैध मान: `{ $value }`

## Variants

variant-index-must-be-number = Variant index { $index } संख्या जुइमाः

variant-index-must-be-integer = Variant index { $index } पूर्णांक जुइमाः

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` निरपेक्ष नापया निंतिं लागू जुयाच्वंगु मदु। चाकलत सापेक्ष कथं तयाच्वन।

side-by-side-absolute-margins = `<{ $component }>` निरपेक्ष नापया निंतिं लागू जुयाच्वंगु मदु। किनारात सापेक्ष कथं तयाच्वन।

side-by-side-no-block-child = अवैध `<{ $component }>`: उकिइ कम्तीमं छगू ब्लक काय जुइमाः।

## `<label>`

label-for-ignored-on-graphical = चित्रात्मक `<label>` य् दुगु `for` विशेषताया उपेक्षा याइ।

label-for-must-resolve-to-one = `<label>` या `for` विशेषता ठीक छगू घटकय् मात्र लाइमाः।

label-for-unresolved = `<label>` या `for` विशेषता छुं नं घटकय् लाके मफुत।

label-for-answer-with-authored-inputs = `<label>` या `for` विशेषतां च्वमिं थःम्हं तयातःगु input दुगु `<answer>` न्ह्यथनाच्वंगु दु; input यात हे सीधा न्ह्यथनादिसँ।

label-for-answer-without-input = `<label>` या `for` विशेषतां label याये त्वःगु input मदुगु `<answer>` न्ह्यथनाच्वंगु दु।

label-for-must-reference-input-or-answer = `<label>` या `for` विशेषतां छगू input वा छगू answer न्ह्यथनेमाः।

## Accessibility

accessibility-short-description-or-decorative = पहुँचयोग्यताया निंतिं `<{ $component }>` या छगू छोटो विवरण दयेमाः वा उकियात decorative कथं तयेमाः।

accessibility-video-short-description = पहुँचयोग्यताया निंतिं `<video>` या छगू छोटो विवरण दयेमाः।

accessibility-input-short-description-or-label = पहुँचयोग्यताया निंतिं `<{ $component }>` या छगू छोटो विवरण वा छगू label दयेमाः।

accessibility-answer-input-short-description-or-label = पहुँचयोग्यताया निंतिं input दयेकीगु `<answer>` या छगू छोटो विवरण वा छगू label दयेमाः।

accessibility-short-description-contains-math = छोटो विवरणय् `<{ $component }>` थें ज्याःगु गणित घटक मदयेमाः। गणित खँग्वलं हे च्वयादिसँ।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] खण्डया शीर्षक अक्षरया निंतिं { $colorName } या विपरीतता तताः (हाकु मोड) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम्तीमं { $threshold }:1 मालि)।
       *[other] खण्डया शीर्षक अक्षरया निंतिं { $colorName } या विपरीतता तताः ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम्तीमं { $threshold }:1 मालि)।
    }

## `<circle>`

circle-through-points-non-numerical = बिन्दुतय्गु संख्यात्मक मान मदुबले { $count } बिन्दु द्वारा `<circle>` लागू यायेधुंकूगु मदु।

circle-too-many-through-points = स्वंगू स्वयां अप्व बिन्दु द्वारा वृत्त गणना याये मफु।

circle-overprescribed-radius-center-points = तयातःगु radius, center व through बिन्दु स्वंलिसें दुगु वृत्त गणना याये मफु।

circle-center-with-multiple-points = तयातःगु center नापं छगू स्वयां अप्व बिन्दु द्वारा वृत्त गणना याये मफु।

circle-radius-too-small = वृत्त गणना याये मफु: निगू बिन्दुया दथुइ दूरी { $distance } जूगुलिं, तयातःगु radius { $radius } तताः चिधिकः।

circle-radius-with-many-points = तयातःगु radius नापं निगू स्वयां अप्व बिन्दु द्वारा वृत्त दयेके मफु।

circle-invalid-center-or-through-points = वृत्तया अवैध center वा through बिन्दु।

circle-radius-center-with-multiple-points = तयातःगु center नापं छगू स्वयां अप्व बिन्दु द्वारा वृत्तया radius गणना याये मफु।

circle-change-radius-non-numerical = संख्यात्मक मान मदुगु through बिन्दु दुगु वृत्तया radius बदले मफु

circle-radius-with-points-non-numerical = संख्यात्मक मान मदुबले तयातःगु radius नापं छगू स्वयां अप्व बिन्दु द्वारा वृत्त दयेके मफु।

circle-change-center-non-numerical = संख्यात्मक मान मदुगु बिन्दु द्वारा दयेकूगु वृत्तया center बदलेगु लागू यायेधुंकूगु मदु।

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] फलनया domain या निंतिं आयाम तताः। domain य् { $intervals } अन्तराल दु तर फलनय् { $inputs ->
           *[other] { $inputs } input
        } दु।
    }

function-domain-invalid-format = फलनया domain या अवैध ढाँचा।

function-ignoring-non-numerical =
    { $type ->
        [maximum] फलनया संख्यात्मक मजूगु अधिकतमया उपेक्षा याइ।
        [minimum] फलनया संख्यात्मक मजूगु न्यूनतमया उपेक्षा याइ।
        [extremum] फलनया संख्यात्मक मजूगु चरम मानया उपेक्षा याइ।
        [point] फलनया संख्यात्मक मजूगु बिन्दुया उपेक्षा याइ।
        [slope] फलनया संख्यात्मक मजूगु ढलानया उपेक्षा याइ।
       *[other] फलनया संख्यात्मक मजूगु { $type } या उपेक्षा याइ।
    }

function-ignoring-empty =
    { $type ->
        [maximum] फलनया खालि अधिकतमया उपेक्षा याइ।
        [minimum] फलनया खालि न्यूनतमया उपेक्षा याइ।
        [extremum] फलनया खालि चरम मानया उपेक्षा याइ।
        [point] फलनया खालि बिन्दुया उपेक्षा याइ।
       *[other] फलनया खालि { $type } या उपेक्षा याइ।
    }

function-points-too-close = फलनय् तताः चकंचकं दुगु निगू बिन्दु दु। फलन परिभाषित याये मफु।

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] फलनया input या संख्या व output या संख्या समान जूसा मात्र फलन दोहोर्याये फु। थ्व फलनय् { $inputs } input व { $outputs ->
           *[other] { $outputs } output
        } दु।
    }

## `<sequence>`

sequence-invalid-length = अनुक्रमया अवैध ल्याः।  ऋणात्मक मजूगु पूर्णांक जुइमाः।

sequence-invalid-step = अनुक्रमया अवैध step।  { $type } प्रकारया अनुक्रमया निंतिं संख्या जुइमाः।

sequence-invalid-endpoint-number = number अनुक्रमया अवैध "{ $attribute }"।  संख्या जुइमाः।

sequence-invalid-endpoint-letters = letters अनुक्रमया अवैध "{ $attribute }"।  अक्षरया संयोजन जुइमाः।

sequence-invalid-endpoint = अनुक्रमया अवैध "{ $attribute }"।

select-from-sequence-coprime-not-numbers = संख्या ल्ययाच्वंगु मजूगुलिं coprime या उपेक्षा याइ

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations तयातःगुलिं coprime या उपेक्षा याइ

## Resolving a `target`

target-not-found = `<{ $source }>` या निंतिं अवैध target: target लुइ मफुत।

target-state-variable-not-found = `<{ $source }>` या निंतिं अवैध target: `<{ $component }>` य् "{ $property }" नांगु स्थिति चर लुइ मफुत।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` या चरत स्वतन्त्र चर स्वयां पाइमाः।

ode-system-duplicate-variable-names = दुबारा जूगु आश्रित चरया नां नापं ODE RHS फलन परिभाषित याये मफु।

ode-system-rhs-function-error = ODE RHS फलन परिभाषित याये मफु।  mathjs फलन दयेकेगुली त्रुटि।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } रेखाया दथुइ कोण परिभाषित याये मफु

angle-invalid-through-point = `<angle>` या through य् अवैध बिन्दु

parabola-vertex-too-many-points = vertex नापं छगू स्वयां अप्व बिन्दु द्वारा परवलय लागू यायेधुंकूगु मदु।

parabola-too-many-points = स्वंगू स्वयां अप्व बिन्दु द्वारा परवलय लागू यायेधुंकूगु मदु।

intersection-too-many-items = निगू स्वयां अप्व वस्तुया निंतिं प्रतिच्छेदन लागू यायेधुंकूगु मदु

## Other math components

ionic-compound-not-two-ions = निगू आयन मखुगु मेगु छुं नं निंतिं आयनिक यौगिक लागू यायेधुंकूगु मदु।

ionic-compound-needs-cation-and-anion = आयनिक यौगिक छगू क्याटायन व छगू आयनया निंतिं मात्र लागू जुयाच्वंगु दु।

solve-equations-cannot-evaluate = समीकरण मूल्याङ्कन याये मफुगुलिं उकियात हल याये मफु: { $equation }

math-operators-operand-number-required = गणितीय operand पिकायेबले operandNumber तयेमाः।

eigen-decomposition-failed = मेट्रिक्सया eigenvalue गणना याये मफुत

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: { $parameters } parameter pattern य् मदुगुलिं उकिं सदां खालि हे मिले जुइ।
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" बुझे याये मफु। थ्व none, medium, dense, वा खालि ठाउँलिसें पाःगु निगू धनात्मक संख्या जुइमाः, जस्तै grid="1 0.5"। छुं नं grid क्यनाच्वंगु मदु।

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` यात { $expected ->
        [1] छगू output दुगु फलन मालि, ब्वबिं ब्वबिं ढलान y', जस्तै `y - x`
       *[other] निगू output दुगु फलन मालि, ब्वबिं ब्वबिं सदिश, जस्तै `(y, -x)`
    }, तर बियातःगु फलनय् { $found ->
       *[other] { $found } output
    } दु। { $alternative ->
        [none] छुं नं क्यनाच्वंगु मदु।
       *[other] उगु फलनया निंतिं `<{ $alternative }>` घटक ख:। छुं नं क्यनाच्वंगु मदु।
    }

field-function-attribute-ignored-with-child = फलन घटकया दुने नं बियातःगुलिं `function` विशेषताया उपेक्षा याइ; दुनेयागु हे छ्यलाच्वंगु दु। फलन निगू उपाय मध्ये छगू कथं मात्र बियादिसँ।

field-variables-ignored =
    `<{ $component }>`: `variables` विशेषतां घटकया दुने सीधा च्वयातःगु अभिव्यक्तिया चरतय्गु नां न्ह्यथनी। { $reason ->
        [function-child] थन फलन छगू `<function>` काय कथं बियातःगु दु, गुगुं थःगु चर थःम्हं हे न्ह्यथनी, अले `variables` या उपेक्षा याइ।
       *[no-expression] थन अथे छुं नं अभिव्यक्ति बियातःगु मदु, अले `variables` या उपेक्षा याइ।
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure रेन्डररय् xLabelPosition="left" लागू जुइ मफु; right-position या व्यवहार छ्यलाच्वन।

prefigure-y-label-position-unsupported = `<graph>`: prefigure रेन्डररय् yLabelPosition="bottom" लागू जुइ मफु; top-position या व्यवहार छ्यलाच्वन।

prefigure-invalid-axis-bounds = `<graph>`: prefigure रूपान्तरणया निंतिं अवैध अक्ष सीमा; पूर्वनिर्धारित bbox (-10,-10,10,10) छ्यलाच्वन।

prefigure-invalid-width = `<graph>`: prefigure रूपान्तरणया निंतिं अवैध चाकल; पूर्वनिर्धारित रेखाचित्र चाकल 425 छ्यलाच्वन।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure रूपान्तरणया निंतिं अवैध aspectRatio; पूर्वनिर्धारित अनुपात 1 छ्यलाच्वन।

prefigure-grid-spacing-too-fine = `<graph>`: अक्षया सीमाया निंतिं ग्रिडया दूरी तताः चिधिकः; prefigure रेन्डररय् ग्रिड त्वःताच्वन।

prefigure-annotations-not-rendered = `<graph>`: PreFigure रेन्डरर मछ्यःसा टिप्पणीत क्यनाच्वंगु मदु।

multiple-annotations-children = `<graph>` य् अप्व `<annotations>` कापंत लुत; लिपांगु छगू बाहेक दक्वया उपेक्षा याइ।

## Referring to other components

copy-unrecognized-component-type = मस्युगु घटक प्रकार विस्तार वा प्रतिलिपि याये मफु: { $type }।

copy-prop-not-found = { $component } प्रकारया घटकय् { $property } prop लुइ मफुत

collect-no-source = collect या निंतिं छुं नं स्रोत लुइ मफुत।

collect-invalid-component-type = `<{ $component }>` अवैध घटक प्रकार जूगुलिं उगु प्रकारया घटकत collect याये मफु।

reference-index-unavailable = index `{ $reference }` न्ह्यथने मफु

## `<callAction>`

component-action-unavailable = `{ $reference }` घटकय् { $action } बोले याये मफु

## `<dataFrame>`

data-frame-inconsistent-row-lengths = डाटाया आकार अवैध दु।  पंक्तितय्गु ल्याः फरक फरक दु। componentIdx :{ $componentIdx } य् लुत

data-frame-duplicate-column-names = डाटाय् दुबारा जूगु स्तम्भया नां दु।  componentIdx :{ $componentIdx } य् लुत

data-frame-missing-column-name = डाटाय् छगू स्तम्भया नां मदु।  componentIdx :{ $componentIdx } य् लुत

## `<answer>` and scoring

answer-award-depends-on-own-response = थ्व लिसःया छगू award थ्व answer ट्यागं हे छ्वयातःगु लिसःय् आधारित दु, गुकिं अनपेक्षित व्यवहार जुइ।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` दुगु कन्टेनरया दुने दुगु `<answer>` य् `maxNumAttempts` तयेगुया छुं असर मदु, छाय्धाःसा प्रयासया संख्या कन्टेनरं हे नियन्त्रण याइ। `maxNumAttempts` कन्टेनरय् हे तयादिसँ।

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` दुगु मेगु कन्टेनरया दुने दुगु `sectionWideCheckWork` कन्टेनरय् `maxNumAttempts` तयेगुया छुं असर मदु, छाय्धाःसा प्रयासया संख्या पिनेयागु कन्टेनरं हे नियन्त्रण याइ। `maxNumAttempts` पिनेयागु कन्टेनरय् हे तयादिसँ।

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] symbolicEquality मतःसा { $attributes } विशेषताया छुं नं असर मदइ।
    }

answer-invalid-type = लिसःया निंतिं अवैध type: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` घटकया नां मदुगुलिं उकियात module या विशेषता कथं छ्यले मफु

module-attribute-name-already-defined = `<module>` घटक प्रकारय् "{ $name }" विशेषता न्हापां हे परिभाषित जुइधुंकूगुलिं `<{ $component } name="{ $name }">` घटकयात module या विशेषता कथं छ्यले मफु।

conditional-content-condition-ignored = case वा else कापंत दुगु `<conditionalContent>` घटकय् `condition` विशेषताया उपेक्षा याइ।

slider-markers-type-mismatch = Marker या प्रकार slider या प्रकार नापं मिले जुइ मफुत।

pretzel-problem-needs-statement-and-answer = अवैध pretzel: दक्व `<problem>` य् छगू `<statement>` व छगू `<answer>` जुइमाः।

pretzel-circuit-first-problem-distractor = अवैध pretzel: mode="circuit" य् न्हापांगु `<problem>` distractor जुइ मफु।

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] `{ $attribute }` विशेषताया निंतिं अवैध मान { $values }; उपेक्षा याइ।
    }

attribute-must-be-references = `{ $attribute }` विशेषताया निंतिं अवैध मान `{ $value }`। विशेषता `$` नं शुरु जुइगु सन्दर्भं दयेकेमाः।

math-input-invalid-function-names = <mathInput>: { $attribute } य् दुगु अवैध फलनया नांया उपेक्षा यानाच्वन: { $names }। दक्व नांया प्रदर्शन खण्ड कम्तीमं 2 अक्षर (अक्षर वा ड्यास) जुइमाः; लिपा वैकल्पिक `|<mathspeak alternative>` प्रत्यय वये फु।

## Building components from the source

component-type-invalid = अवैध घटक प्रकार: `<{ $componentType }>`

attribute-repeated = { $attribute } विशेषता दुबारा तये मफु।

attribute-invalid-for-component = `<{ $componentType }>` प्रकारया घटकया निंतिं अवैध विशेषता "{ $attribute }"।

## Style definition contrast

style-definition-insufficient-contrast =
    शैली परिभाषा { $styleNumber } य् { $context ->
        [text-on-background] पृष्ठभूमिया रङ नापं अक्षरया रङया
        [high-contrast] क्यानभास नापं उच्च-विपरीतता रङया
        [line] क्यानभास नापं रेखाया रङया
        [marker] क्यानभास नापं marker या रङया
       *[text-on-canvas] क्यानभास नापं अक्षरया रङया
    } विपरीतता तताः{ $mode ->
        [dark] { " (हाकु मोड)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम्तीमं { $threshold }:1 मालि)।

style-definition-dark-mode-text-background-contrast =
    शैली परिभाषा { $styleNumber } य् तयातःगु रङं तुयु मोडया निंतिं ल्यंकः विपरीतता बिइ धाःसां, उगु मानं दयेकूगु हाकु मोडया रङय् पृष्ठभूमिया रङ नापं अक्षरया रङया विपरीतता तताः ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम्तीमं { $threshold }:1 मालि)। { $suggestion ->
        [available] हाकु मोडय् ल्यंकः विपरीतता दयेकेत तुयु मोडया विपरीतता अप्व यानादिसँ (जस्तै { $lightAttribute }="{ $lightColor }" तयादिसँ) वा हाकु मोडया रङ थःम्हं तयादिसँ (जस्तै { $darkAttribute }="{ $darkColor }")।
       *[none] हाकु मोडय् ल्यंकः विपरीतता दयेकेत तुयु मोडया विपरीतता अप्व यानादिसँ वा दयेकूगु रङतयेत textColorDarkMode व/वा backgroundColorDarkMode नं बदलेयानादिसँ।
    }

style-definition-dark-mode-text-canvas-contrast =
    शैली परिभाषा { $styleNumber } य् तयातःगु अक्षरया रङं तुयु मोडया निंतिं ल्यंकः विपरीतता बिइ धाःसां, उगु मानं दयेकूगु हाकु मोडया अक्षरया रङया क्यानभास नापं विपरीतता तताः ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; कम्तीमं { $threshold }:1 मालि)। { $suggestion ->
        [available] हाकु मोडय् ल्यंकः विपरीतता दयेकेत तुयु मोडया विपरीतता अप्व यानादिसँ (जस्तै textColor="{ $lightColor }" तयादिसँ) वा हाकु मोडया रङ थःम्हं तयादिसँ (जस्तै textColorDarkMode="{ $darkColor }")।
       *[none] हाकु मोडय् ल्यंकः विपरीतता दयेकेत तुयु मोडया विपरीतता अप्व यानादिसँ वा दयेकूगु रङ textColorDarkMode नं बदलेयानादिसँ।
    }

section-multiple-style-palettes = छगू खण्डं छगू <stylePalette> मात्र ल्यये फु; लिपांगु छगू छ्यलाच्वन।

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect ऋणात्मक मजूगु पूर्णांक मजूगुलिं { $component } या अद्वितीय variant निर्धारण याये मफु।

variant-num-to-select-not-constant-number = numToSelect स्थिर संख्या मजूगुलिं { $component } या अद्वितीय variant निर्धारण याये मफु।

variant-with-replacement-not-constant-boolean = withReplacement स्थिर boolean मजूगुलिं { $component } या अद्वितीय variant निर्धारण याये मफु।

variant-select-weight-disables-unique = selectWeight वा selectForVariants तयातःगु विकल्प दुसा select या अद्वितीय variant बन्द जुइ

variant-coprime-undetermined = coprime सदां असत्य ख: धकाः निर्धारण याये मफुगुलिं { $component } या अद्वितीय variant निर्धारण याये मफु।

variant-attribute-not-constant = { $attribute } स्थिर मजूगुलिं { $component } या अद्वितीय variant निर्धारण याये मफु।

variant-attribute-not-number = { $attribute } संख्या मजूगुलिं { $component } या अद्वितीय variant निर्धारण याये मफु।

variant-attribute-wrong-type-for-sequence =
    { $attribute } { $expected ->
        [letters-combination] अक्षरया संयोजन
        [math-expression] वैध गणितीय अभिव्यक्ति
        [integer] पूर्णांक
       *[number] संख्या
    } मजूगुलिं { $type } प्रकारया { $component } या अद्वितीय variant निर्धारण याये मफु।

variant-length-not-integer = length पूर्णांक मजूगुलिं { $component } या अद्वितीय variant निर्धारण याये मफु।

variant-sort-not-implemented = sort दुगु { $component } या अद्वितीय variant लागू यायेधुंकूगु मदु

variant-exclude-combinations-not-implemented = excludeCombinations दुगु { $component } या अद्वितीय variant लागू यायेधुंकूगु मदु

variant-math-exclude-not-implemented = exclude दुगु math प्रकारया { $component } या अद्वितीय variant लागू यायेधुंकूगु मदु

variant-non-constant-exclude-not-implemented = स्थिर मजूगु exclude दुगु { $component } या अद्वितीय variant लागू यायेधुंकूगु मदु

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure रेन्डररय् लागू जुइ मफु; सन्तति त्वःताच्वन।

prefigure-descendant-invalid-geometry = { $subject }: अपूर्ण वा सीमित मजूगु ज्यामिति; सन्तति त्वःताच्वन।

prefigure-curve-label-omitted = { $subject }: रूपान्तरण जूगु वक्र तत्वय् label लागू जुइ मफु; label त्वःताच्वन।

prefigure-curve-unsupported-definition-type = { $subject }: लागू जुइ मफुगु वक्र फलन परिभाषा प्रकार '{ $definitionType }'; सन्तति त्वःताच्वन।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves य् लागू जुइ मफुगु flipFunctions विशेषता; सन्तति त्वःताच्वन।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves य् formula प्रकारया काय फलन मात्र लागू जुइ फु; सन्तति त्वःताच्वन।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] रेखा-परिवारया label
       *[point] बिन्दुया label
    } या निंतिं लागू जुइ मफुगु labelPosition '{ $labelPosition }'; पूर्वनिर्धारित PreFigure पङ्क्तिबद्धता छ्यलाच्वन।

prefigure-fill-style-unsupported = { $subject }: भरणया शैली '{ $fillStyle }' PreFigure य् लागू जुइ मफु; ठोस भरण छ्यलाच्वन।

prefigure-line-style-unknown = { $subject }: मस्युगु रेखा शैली '{ $lineStyle }' PreFigure निंतिं त्वःताच्वन।

prefigure-marker-style-mapped-to-diamond = { $subject }: marker शैली '{ $markerStyle }' PreFigure या 'diamond' शैलीय् बदलाच्वन।

prefigure-marker-style-unsupported = { $subject }: marker शैली '{ $markerStyle }' PreFigure य् लागू जुइ मफु; पूर्वनिर्धारित शैली छ्यलाच्वन।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: अवैध `ref`; target लाके मफु। टिप्पणी त्वःताच्वन।

annotation-ref-multiple-targets = `<annotation>`: `ref` अप्व target य् लात; न्हापांगु target छ्यलाच्वन।

annotation-ref-outside-graph = `<annotation>`: अवैध `ref`; target दुगु graph या पिने दु। टिप्पणी त्वःताच्वन।

annotation-ref-unsupported-target = `<annotation>`: अवैध `ref`; prefigure रूपान्तरणय् target लागू जुइफुगु चित्रात्मक वस्तु मखु। टिप्पणी त्वःताच्वन।

annotation-text-missing = `<annotation>`: `text` मदु वा खालि दु; खालि अक्षर पिकयाच्वन।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] चक्रीय निर्भरता लुत।
       *[other] `<{ $componentType }>` घटक नापं जुड्यागु चक्रीय निर्भरता लुत।
    }

reference-no-referent = सन्दर्भया निंतिं छुं नं लक्ष्य लुइ मफुत: `{ $reference }`

reference-multiple-referents = सन्दर्भया निंतिं अप्व लक्ष्य लुत: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` या { $attribute } विशेषताया अवैध ढाँचा।

children-invalid = `<{ $componentType }>` या निंतिं अवैध कापंत: अवैध कापंत लुत: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` विशेषताया निंतिं अवैध मान `{ $value }`, `{ $default }` मान छ्यलाच्वन

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML संस्करण { $version } लुइ मफुत।
       *[other] DoenetML संस्करण { $version } लुइ मफुत। संस्करण { $fallback } य् लिहाँ वनाच्वन
    }

## Reading the DoenetML

parse-invalid-doenetml = अवैध DoenetML: { $content }

parse-tag-missing-close-tag = अवैध DoenetML: `{ $tag }` ट्यागया बन्द याइगु ट्याग मदु। थःम्हं बन्द जुइगु ट्याग वा छगू `</{ $tagName }>` ट्याग मालि।

parse-tag-error = अवैध DoenetML: `<{ $tagName }>` ट्यागय् त्रुटि

parse-attribute-missing-value = अवैध DoenetML: अवैध विशेषता `{ $attribute }` य् मान मदुथें ताः।

parse-attribute-invalid = अवैध DoenetML: अवैध विशेषता `{ $attribute }`

parse-attribute-value-invalid = अवैध DoenetML: अवैध विशेषता मान `{ $value }`

parse-attribute-value-quote-mismatch = अवैध DoenetML: अवैध विशेषता मान `{ $value }`। उद्धरण चिन्ह मिले जुइ मफुत। छित छगू `{ $quote }` मदुथें ताः

parse-open-tag-name-missing = अवैध DoenetML: नां मदुगु ट्याग लुत, जस्तै `<`

parse-tag-not-closed = अवैध DoenetML: `{ $tag }` ट्याग बन्द जुइ मफुत (छगू `>` मदुथें ताः)।

parse-self-closing-tag-name-missing = अवैध DoenetML: नां मदुगु ट्याग लुत `<{ $content }>`

parse-self-closing-tag-not-closed = अवैध DoenetML: `{ $tag }` ट्याग बन्द जुइ मफुत (`/>` मदुथें ताः)।

parse-tag-invalid-attributes = अवैध DoenetML: `{ $tag }` ट्याग वैध मखु। उकिइ ठीक मजूगु विशेषता दयेफु।

parse-close-tag-name-missing = अवैध DoenetML: नां मदुगु बन्द ट्याग लुत, जस्तै `</`

parse-attribute-value-unquoted = विशेषताया मान उद्धरण चिन्ह दुने तयेमाः: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = अवैध DoenetML: `{ $tag }` बन्द ट्याग लुत, तर उकिया निंतिं चायेकीगु ट्याग मदु

parse-close-tag-mismatched = अवैध DoenetML: बन्द ट्याग मिले जुइ मफुत। `</{ $expected }>` मालि। `{ $found }` लुत

parser-node-unconvertible = { $node } नोडयात Dast नोडय् बदले मफुत।

## Names

name-attribute-invalid =
    अवैध विशेषता name='{ $name }'। { $reason ->
        [characters] नांय् अक्षर, संख्या, अन्डरस्कोर वा हाइफन मात्र दयेफु।
       *[start] नां अक्षरं शुरु जुइमाः।
    }

component-name-invalid-start = अवैध घटक नां "{ $name }"। नां अक्षरं शुरु जुइमाः।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched प्रकारया answer य् video विशेषता जुइमाः

answer-video-watched-video-not-reference = videoWatched प्रकारया answer या video विशेषता छगू सन्दर्भ जुइमाः

answer-name-not-single-text = Answer या name विशेषताय् छगू मात्र text काय जुइमाः

## Referencing another document

external-doenetml-recursion-limit = तताः अप्व तह पुनरावृत्ति जूगुलिं पिनेयागु DoenetML काये मफुत। चक्रीय सन्दर्भ दु ला?

external-doenetml-unavailable = { $attribute }="{ $uri }" नं DoenetML काये मफुत

external-doenetml-type-mismatch = { $attribute }="{ $uri }" नं कयागु DoenetML अवैध दु: थ्व "{ $componentType }" घटक प्रकार नापं मिले जुइ मफुत

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` विशेषता पुलांगु जुइधुंकल; उकिया सट्टाय् `{ $to }` छ्यलादिसँ।
       *[other] [deprecation] `<{ $component }>` य् दुगु `{ $from }` विशेषता पुलांगु जुइधुंकल; उकिया सट्टाय् `{ $to }` छ्यलादिसँ।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` नं तयातःगुलिं `{ $from }` विशेषता पुलांगु जुइधुंकल व उकिया उपेक्षा याइ।
       *[other] [deprecation] `<{ $component }>` य् दुगु `{ $from }` विशेषता `{ $to }` नं तयातःगुलिं पुलांगु जुइधुंकल व उकिया उपेक्षा याइ।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` य् दुगु `{ $attribute }` विशेषता पुलांगु जुइधुंकल व उकिया उपेक्षा याइ।

deprecated-attribute-to-child = [deprecation] `<{ $component }>` य् दुगु `{ $attribute }` विशेषता पुलांगु जुइधुंकल; उकिया सट्टाय् छगू `<{ $child }>` काय छ्यलादिसँ।

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` य् दुगु `{ $attribute }` विशेषताया `{ $value }` मान पुलांगु जुइधुंकल; उकिया सट्टाय् `{ $to }` छ्यलादिसँ।


## Language coverage

pluralize-english-only = `<pluralize>` अंग्रेजीया मात्र बहुवचन दयेके फु, अले { $locale } भाषाय् च्वयातःगु दस्तावेजय् उकिया अक्षर छुं नं मबदलिकं ल्यनी। बहुवचन रूप सीधा च्वयादिसँ, वा `pluralForm` विशेषतां तयादिसँ।


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` तत्व Doenet या स्युगु तत्व मखु।

schema-element-not-allowed-at-root = `<{ $tag }>` तत्व दस्तावेजया मूलय् तये मज्यू।

schema-element-not-allowed-inside = `<{ $tag }>` तत्व `<{ $parent }>` या दुने तये मज्यू।

schema-attribute-unrecognized = `<{ $tag }>` तत्वय् `{ $attribute }` नांगु विशेषता मदु।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` तत्वया `{ $attribute }` विशेषता छगू सूची जुइमाः, गुकिया दक्व वस्तु थ्व मध्ये छगू जुइमाः: { $allowed }
       *[other] `<{ $tag }>` तत्वया `{ $attribute }` विशेषता थ्व मध्ये छगू जुइमाः: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select या निंतिं अवैध variant नां।  Variant नां { $variantName } { $numOptions } विकल्पय् वयाच्वंगु दु तर ल्ययेत्वःगु संख्या { $numToSelect } ख:।

select-variant-name-without-options = select या निंतिं छुं variant तयातःगु दु तर संभावित variant नां { $variantName } या निंतिं छुं नं विकल्प तयातःगु मदु।

select-variant-name-not-possible = select या निंतिं तयातःगु variant नां { $variantName } संभावित variant नां मखु।

select-too-few-options = { $numOptions } मात्र दुसा { $numToSelect } घटक ल्यये मफु।

select-from-sequence-too-few-values = { $length } ल्याःया अनुक्रमं { $numToSelect } मान ल्यये मफु।

select-from-sequence-indices-count-mismatch = select या निंतिं तयातःगु indices या संख्या ल्ययेत्वःगु संख्या नापं मिले जुइमाः

select-from-sequence-indices-not-integers = select या निंतिं तयातःगु दक्व indices पूर्णांक जुइमाः

select-from-sequence-index-excluded = selectfromsequence या तयातःगु index पिकयातःगु ख:

select-from-sequence-indices-excluded-combination = selectfromsequence या तयातःगु indices पिकयातःगु संयोजन ख:

select-from-sequence-coprime-not-positive-integers = धनात्मक पूर्णांक ल्ययाच्वंगु मजूगुलिं coprime संयोजन ल्यये मफु।

select-from-sequence-coprime-common-factor = Coprime संख्या ल्यये मफु। दक्व संभावित मानय् छगू साझा गुणनखण्ड दु। ("from" वा "to" या तयातःगु मान "step" नापं coprime जुइमाः।)

select-from-sequence-coprime-single-number = 1 मजूगु छगू मात्र संख्यां coprime संयोजन ल्यये मफु।

select-from-sequence-excluded-too-many-combinations = selectFromSequence य् संयोजनया 70% स्वयां अप्व पिकयातःगु दु

select-from-sequence-coprime-none-found = Coprime संख्या ल्यये मफुत। दक्व संभावित मानय् छगू साझा गुणनखण्ड दु।

select-from-sequence-too-few-unique-values = { $numPossibleValues } ल्याःया अनुक्रमं { $numToSelect } अद्वितीय मान ल्यये मफु

select-prime-numbers-too-few-values = { $numValues } ल्याःया अभाज्य संख्याया सूचीं { $numToSelect } मान ल्यये मफु

select-prime-numbers-values-count-mismatch = select या निंतिं तयातःगु मानया संख्या ल्ययेत्वःगु संख्या नापं मिले जुइमाः

select-prime-numbers-values-not-prime = select prime number या निंतिं तयातःगु दक्व मान अभाज्य संख्याया सूचीय् जुइमाः

select-prime-numbers-values-excluded-combination = selectPrimeNumbers या तयातःगु मान पिकयातःगु संयोजन ख:

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers य् संयोजनया 70% स्वयां अप्व पिकयातःगु दु

select-random-combination-fluke = तताः असंभव संयोगं, अनियमित मानया संयोजन ल्यये मफुत

select-random-value-fluke = तताः असंभव संयोगं, अनियमित मान ल्यये मफुत

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] थ्व `<{ $component }>` गणितया दुने दुसां `inline` मजूगुलिं क्यनाच्वंगु मदु। `inline` तयादिसँ, अले थ्व ड्रप-डाउन सूची जुइ, गुगु अभिव्यक्तिया दुने लाइ।
        [expanded] थ्व `<{ $component }>` गणितया दुने दुसां `expanded` जूगुलिं क्यनाच्वंगु मदु। `expanded` पिकयादिसँ; अप्व लाइनया बाकस अभिव्यक्तिया दुने मलाः।
        [on-graph] थ्व `<{ $component }>` graph य् क्यनातःगु गणितया दुने दूगुलिं क्यनाच्वंगु मदु, अन input या निंतिं ठाउँ मदु।
       *[relative-width] थ्व `<{ $component }>` गणितया दुने दुसां सापेक्ष चाकल दूगुलिं क्यनाच्वंगु मदु। चाकल `px` थें ज्याःगु निरपेक्ष एककय् बियादिसँ।
    }
