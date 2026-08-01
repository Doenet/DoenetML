# Marathi diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
        [one] दोन अंत्यबिंदू दिलेले असताना { $attributes } दुर्लक्षित केले जाते
       *[other] दोन अंत्यबिंदू दिलेले असताना { $attributes } दुर्लक्षित केली जातात
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] एक अंत्यबिंदू आणि एक मध्यबिंदू दोन्ही दिलेले असताना { $attributes } दुर्लक्षित केले जाते
       *[other] एक अंत्यबिंदू आणि एक मध्यबिंदू दोन्ही दिलेले असताना { $attributes } दुर्लक्षित केली जातात
    }

line-segment-midpoint-offset-without-midpoint = मध्यबिंदूशिवाय midpointOffset चा काहीही परिणाम होत नाही

## `<line>`

line-points-undetermined-dimensions = अनिश्चित मितींच्या बिंदूंमधून जाणारी रेषा.

line-points-too-few-dimensions = रेषा किमान दोन मितींच्या बिंदूंमधून जायला हवी.

line-points-depend-on-variables = रेषा चलांवर अवलंबून असणाऱ्या बिंदूंमधून जाते: { $variables }.

line-equation-invalid-format = { $variable1 } आणि { $variable2 } चलांतील रेषेच्या समीकरणाची मांडणी अवैध आहे.

## `<ray>`

ray-overprescribed-through = किरण through, endpoint आणि direction ने ठरवला आहे.  दिलेले through दुर्लक्षित केले जात आहे.

ray-dimension-mismatch = किरणात numDimensions जुळत नाही.

## `<vector>`

vector-overprescribed-head = सदिश head, tail आणि displacement ने ठरवला आहे.  दिलेले head दुर्लक्षित केले जात आहे.

vector-dimension-mismatch = सदिशात numDimensions जुळत नाही.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` कडे आकर्षित करता येत नाही, कारण त्याला nearestPoint स्टेट व्हेरिएबल नाही.

constrain-to-without-nearest-point = `<{ $component }>` वर मर्यादित करता येत नाही, कारण त्याला nearestPoint स्टेट व्हेरिएबल नाही.

constrain-to-interior-without-nearest-point = `<{ $component }>` च्या आतील भागात मर्यादित करता येत नाही, कारण त्याला nearestPoint स्टेट व्हेरिएबल नाही.

## `<choiceInput>`

choice-input-label-position-ignored = इनलाइन नसलेल्या choiceInput साठी labelPosition दुर्लक्षित केले जाते

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput साठी दिलेले निर्देशांक दुर्लक्षित केले जात आहेत, कारण निर्देशांकांची संख्या choice अपत्यांच्या संख्येशी जुळत नाही.

pretzel-indices-count-mismatch = problem साठी दिलेले निर्देशांक दुर्लक्षित केले जात आहेत, कारण निर्देशांकांची संख्या problem अपत्यांच्या संख्येशी जुळत नाही.

shuffle-indices-count-mismatch = shuffle साठी दिलेले निर्देशांक दुर्लक्षित केले जात आहेत, कारण निर्देशांकांची संख्या घटकांच्या संख्येशी जुळत नाही.

indices-ignored-out-of-range = { $component } साठी दिलेले निर्देशांक दुर्लक्षित केले जात आहेत, कारण काही निर्देशांक मर्यादेबाहेर आहेत.

pretzel-indices-repeated = pretzel साठी दिलेले निर्देशांक दुर्लक्षित केले जात आहेत, कारण काही निर्देशांकांची पुनरावृत्ती झाली आहे.

pretzel-circuit-first-index = circuit मोडमध्ये pretzel साठी दिलेले निर्देशांक दुर्लक्षित केले जात आहेत, कारण पहिला निर्देशांक 1 असायला हवा.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` ने स्ट्रिंग अपत्यांसह काम करण्यासाठी `type` ॲट्रिब्यूट देणे आवश्यक आहे.

invalid-type-defaulting-to-math = { $component } घटकासाठी { $type } हा प्रकार अवैध आहे. math, text, number किंवा boolean यांपैकी एक असायला हवा. math गृहीत धरले जात आहे.

string-not-valid-component-to-arrange = "{ $value }" ही स्ट्रिंग { $component } करण्यासाठी वैध घटक नाही. दुर्लक्षित केली जात आहे.

## Types and variables

invalid-type-defaulting-to-number = { $type } हा प्रकार अवैध आहे, प्रकार number केला जात आहे.

invalid-variable-value = चलाचे मूल्य अवैध आहे: `{ $value }`

## Variants

variant-index-must-be-number = प्रकार निर्देशांक { $index } ही संख्या असायला हवी

variant-index-must-be-integer = प्रकार निर्देशांक { $index } हा पूर्णांक असायला हवा

## `<sideBySide>`

side-by-side-absolute-widths = निरपेक्ष मापांसाठी `<{ $component }>` अंमलात आणलेला नाही. रुंदी सापेक्ष केली जात आहे.

side-by-side-absolute-margins = निरपेक्ष मापांसाठी `<{ $component }>` अंमलात आणलेला नाही. समास सापेक्ष केले जात आहेत.

side-by-side-no-block-child = `<{ $component }>` अवैध: त्यात किमान एक ब्लॉक अपत्य असायला हवे.

## `<label>`

label-for-ignored-on-graphical = आलेखीय `<label>` वरील `for` ॲट्रिब्यूट दुर्लक्षित केले जाते.

label-for-must-resolve-to-one = `<label>` वरील `for` ॲट्रिब्यूट नेमक्या एका घटकावर ठरायला हवे.

label-for-unresolved = `<label>` वरील `for` ॲट्रिब्यूट कोणत्याही घटकावर ठरवता आले नाही.

label-for-answer-with-authored-inputs = `<label>` वरील `for` ॲट्रिब्यूट अशा `<answer>` चा संदर्भ देते ज्याची इनपुटे स्वतंत्रपणे लिहिली आहेत; थेट त्या इनपुटचाच संदर्भ द्या.

label-for-answer-without-input = `<label>` वरील `for` ॲट्रिब्यूट अशा `<answer>` चा संदर्भ देते ज्याला लेबल देण्यासारखे इनपुट नाही.

label-for-must-reference-input-or-answer = `<label>` वरील `for` ॲट्रिब्यूट एखाद्या इनपुटचा किंवा answer चा संदर्भ द्यायला हवे.

## Accessibility

accessibility-short-description-or-decorative = सुलभतेसाठी `<{ $component }>` ला एकतर लघुवर्णन असायला हवे, नाहीतर त्याला सजावटीचा म्हणून नोंदवायला हवे.

accessibility-video-short-description = सुलभतेसाठी `<video>` ला लघुवर्णन असायला हवे.

accessibility-input-short-description-or-label = सुलभतेसाठी `<{ $component }>` ला लघुवर्णन किंवा लेबल असायला हवे.

accessibility-answer-input-short-description-or-label = सुलभतेसाठी इनपुट तयार करणाऱ्या `<answer>` ला लघुवर्णन किंवा लेबल असायला हवे.

accessibility-short-description-contains-math = लघुवर्णनात `<{ $component }>` सारखे गणिती घटक असू नयेत. कोणतेही गणित शब्दांत लिहा.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] विभाग शीर्षकाच्या मजकुरासाठी { $colorName } चा वैषम्य पुरेसा नाही (गडद मोड) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; किमान { $threshold }:1 आवश्यक).
       *[other] विभाग शीर्षकाच्या मजकुरासाठी { $colorName } चा वैषम्य पुरेसा नाही ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; किमान { $threshold }:1 आवश्यक).
    }

## `<circle>`

circle-through-points-non-numerical = बिंदूंना संख्यात्मक मूल्ये नसताना { $count } बिंदूंमधून जाणारे `<circle>` अंमलात आणलेले नाही.

circle-too-many-through-points = 3 पेक्षा जास्त बिंदूंमधून वर्तुळ काढता येत नाही.

circle-overprescribed-radius-center-points = दिलेली त्रिज्या, केंद्र आणि जाणारे बिंदू यांनी वर्तुळ काढता येत नाही.

circle-center-with-multiple-points = दिलेले केंद्र आणि 1 पेक्षा जास्त बिंदूंमधून वर्तुळ काढता येत नाही.

circle-radius-too-small = वर्तुळ काढता येत नाही: दोन बिंदूंमधील अंतर { $distance } असल्याने दिलेली त्रिज्या { $radius } फार लहान आहे.

circle-radius-with-many-points = दिलेल्या त्रिज्येसह दोनपेक्षा जास्त बिंदूंमधून वर्तुळ तयार करता येत नाही.

circle-invalid-center-or-through-points = वर्तुळाचे केंद्र किंवा जाणारे बिंदू अवैध आहेत.

circle-radius-center-with-multiple-points = दिलेले केंद्र आणि 1 पेक्षा जास्त बिंदूंमधून वर्तुळाची त्रिज्या काढता येत नाही.

circle-change-radius-non-numerical = संख्यात्मक नसलेल्या जाणाऱ्या बिंदूंसह वर्तुळाची त्रिज्या बदलता येत नाही

circle-radius-with-points-non-numerical = संख्यात्मक मूल्ये नसताना दिलेल्या त्रिज्येसह एकापेक्षा जास्त बिंदूंमधून वर्तुळ तयार करता येत नाही.

circle-change-center-non-numerical = संख्यात्मक नसलेल्या बिंदूंमधून जाणाऱ्या वर्तुळाचे केंद्र बदलणे अंमलात आणलेले नाही.

## `<function>`

# आहे / आहेत agrees with the inputs alone, so it belongs inside the `$inputs`
# branches rather than after them — the same agreement the outer `$intervals`
# select already makes for अंतराल.
function-domain-insufficient-dimensions =
    { $intervals ->
        [one] फलनाच्या प्रांताच्या मिती पुरेशा नाहीत. प्रांतात { $intervals } अंतराल आहे पण फलनाला { $inputs ->
            [one] { $inputs } इनपुट आहे.
           *[other] { $inputs } इनपुटे आहेत.
        }
       *[other] फलनाच्या प्रांताच्या मिती पुरेशा नाहीत. प्रांतात { $intervals } अंतराले आहेत पण फलनाला { $inputs ->
            [one] { $inputs } इनपुट आहे.
           *[other] { $inputs } इनपुटे आहेत.
        }
    }

function-domain-invalid-format = फलनाच्या प्रांताची मांडणी अवैध आहे.

function-ignoring-non-numerical =
    { $type ->
        [maximum] फलनाचे संख्यात्मक नसलेले कमाल मूल्य दुर्लक्षित केले जात आहे.
        [minimum] फलनाचे संख्यात्मक नसलेले किमान मूल्य दुर्लक्षित केले जात आहे.
        [extremum] फलनाचे संख्यात्मक नसलेले टोकाचे मूल्य दुर्लक्षित केले जात आहे.
        [point] फलनाचा संख्यात्मक नसलेला बिंदू दुर्लक्षित केला जात आहे.
        [slope] फलनाचा संख्यात्मक नसलेला उतार दुर्लक्षित केला जात आहे.
       *[other] फलनाचे संख्यात्मक नसलेले { $type } दुर्लक्षित केले जात आहे.
    }

function-ignoring-empty =
    { $type ->
        [maximum] फलनाचे रिकामे कमाल मूल्य दुर्लक्षित केले जात आहे.
        [minimum] फलनाचे रिकामे किमान मूल्य दुर्लक्षित केले जात आहे.
        [extremum] फलनाचे रिकामे टोकाचे मूल्य दुर्लक्षित केले जात आहे.
        [point] फलनाचा रिकामा बिंदू दुर्लक्षित केला जात आहे.
       *[other] फलनाचे रिकामे { $type } दुर्लक्षित केले जात आहे.
    }

function-points-too-close = फलनात दोन बिंदूंची ठिकाणे फार जवळ आहेत. फलन ठरवता येत नाही.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] फलनाच्या इनपुटांची संख्या आउटपुटांच्या संख्येइतकी असेल तरच फलन पुनरावृत्ती शक्य आहे. या फलनाला { $inputs } इनपुट आणि { $outputs ->
            [one] { $outputs } आउटपुट
           *[other] { $outputs } आउटपुटे
        } आहेत.
       *[other] फलनाच्या इनपुटांची संख्या आउटपुटांच्या संख्येइतकी असेल तरच फलन पुनरावृत्ती शक्य आहे. या फलनाला { $inputs } इनपुटे आणि { $outputs ->
            [one] { $outputs } आउटपुट
           *[other] { $outputs } आउटपुटे
        } आहेत.
    }

## `<sequence>`

sequence-invalid-length = क्रमाची लांबी अवैध आहे.  ती अऋण पूर्णांक असायला हवी.

sequence-invalid-step = क्रमाचे पाऊल अवैध आहे.  { $type } प्रकाराच्या क्रमासाठी ते संख्या असायला हवे.

sequence-invalid-endpoint-number = संख्या क्रमाचे "{ $attribute }" अवैध आहे.  ते संख्या असायला हवे.

sequence-invalid-endpoint-letters = अक्षर क्रमाचे "{ $attribute }" अवैध आहे.  तो अक्षरसमूह असायला हवा.

sequence-invalid-endpoint = क्रमाचे "{ $attribute }" अवैध आहे.

select-from-sequence-coprime-not-numbers = संख्या निवडल्या जात नसल्याने coprime दुर्लक्षित केले

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations दिलेले असल्याने coprime दुर्लक्षित केले

## Resolving a `target`

target-not-found = `<{ $source }>` साठी target अवैध: लक्ष्य सापडत नाही.

target-state-variable-not-found = `<{ $source }>` साठी target अवैध: `<{ $component }>` वर "{ $property }" नावाचे स्टेट व्हेरिएबल सापडत नाही.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` ची चले स्वतंत्र चलापेक्षा वेगळी असायला हवीत.

ode-system-duplicate-variable-names = एकाच नावाच्या अवलंबित चलांसह ODE RHS फलने ठरवता येत नाहीत.

ode-system-rhs-function-error = ODE RHS फलन ठरवता येत नाही.  mathjs फलन तयार करताना त्रुटी.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } रेषांमधील कोन ठरवता येत नाही

angle-invalid-through-point = `<angle>` च्या through मध्ये बिंदू अवैध आहे

parabola-vertex-too-many-points = शिरोबिंदूसह 1 पेक्षा जास्त बिंदूंमधून अन्वस्त अंमलात आणलेला नाही.

parabola-too-many-points = 3 पेक्षा जास्त बिंदूंमधून अन्वस्त अंमलात आणलेला नाही.

intersection-too-many-items = दोनपेक्षा जास्त वस्तूंचा छेद अंमलात आणलेला नाही

## Other math components

ionic-compound-not-two-ions = दोन आयनांव्यतिरिक्त इतर कशासाठीही आयनिक संयुग अंमलात आणलेले नाही.

ionic-compound-needs-cation-and-anion = आयनिक संयुग फक्त एक धनायन आणि एक ऋणायन यांसाठी अंमलात आणलेले आहे.

solve-equations-cannot-evaluate = समीकरणाचे मूल्य काढता न आल्याने ते सोडवता येत नाही: { $equation }

math-operators-operand-number-required = गणिती पद काढताना operandNumber देणे आवश्यक आहे.

eigen-decomposition-failed = मॅट्रिक्सची आयगेन मूल्ये काढता आली नाहीत

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } हा पॅरामीटर पॅटर्नमध्ये येत नाही, त्यामुळे तो नेहमी रिकाम्याशी जुळेल.
       *[other] `<matchesPattern>`: { $parameters } हे पॅरामीटर पॅटर्नमध्ये येत नाहीत, त्यामुळे ते नेहमी रिकाम्याशी जुळतील.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" चा अर्थ लावता येत नाही. ते none, medium, dense, किंवा एका स्पेसने वेगळ्या केलेल्या दोन धन संख्या असायला हवे, उदा. grid="1 0.5". कोणतीही जाळी काढली जाणार नाही.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure रेंडररमध्ये xLabelPosition="left" समर्थित नाही; उजवीकडचे वर्तन वापरले जात आहे.

prefigure-y-label-position-unsupported = `<graph>`: prefigure रेंडररमध्ये yLabelPosition="bottom" समर्थित नाही; वरचे वर्तन वापरले जात आहे.

prefigure-invalid-axis-bounds = `<graph>`: prefigure रूपांतरासाठी अक्ष मर्यादा अवैध आहेत; पूर्वनिर्धारित bbox (-10,-10,10,10) वापरले जात आहे.

prefigure-invalid-width = `<graph>`: prefigure रूपांतरासाठी रुंदी अवैध आहे; पूर्वनिर्धारित आकृती रुंदी 425 वापरली जात आहे.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure रूपांतरासाठी aspectRatio अवैध आहे; पूर्वनिर्धारित गुणोत्तर 1 वापरले जात आहे.

prefigure-grid-spacing-too-fine = `<graph>`: अक्ष मर्यादांच्या तुलनेत जाळीचे अंतर फार सूक्ष्म आहे; prefigure रेंडररमध्ये जाळी वगळली आहे.

prefigure-annotations-not-rendered = `<graph>`: PreFigure रेंडरर वापरला नाही तर टिपा रेंडर केल्या जाणार नाहीत.

multiple-annotations-children = `<graph>` मध्ये अनेक `<annotations>` अपत्ये आढळली; शेवटचे सोडून बाकी सर्व दुर्लक्षित केली आहेत.

## Referring to other components

copy-unrecognized-component-type = अनोळखी घटक प्रकार वाढवता किंवा नक्कल करता येत नाही: { $type }.

copy-prop-not-found = { $component } प्रकाराच्या घटकावर { $property } प्रॉप सापडली नाही

collect-no-source = collect साठी स्रोत सापडला नाही.

collect-invalid-component-type = `<{ $component }>` प्रकाराचे घटक गोळा करता येत नाहीत, कारण तो अवैध घटक प्रकार आहे.

reference-index-unavailable = `{ $reference }` हा निर्देशांक संदर्भित करता येत नाही

## `<callAction>`

component-action-unavailable = `{ $reference }` घटकावर { $action } चालवता येत नाही

## `<dataFrame>`

data-frame-inconsistent-row-lengths = डेटाचा आकार अवैध आहे.  ओळींच्या लांबी विसंगत आहेत. componentIdx :{ $componentIdx } मध्ये आढळले

data-frame-duplicate-column-names = डेटात एकाच नावाचे स्तंभ आहेत.  componentIdx :{ $componentIdx } मध्ये आढळले

data-frame-missing-column-name = डेटातील एका स्तंभाला नाव नाही.  componentIdx :{ $componentIdx } मध्ये आढळले

## `<answer>` and scoring

answer-award-depends-on-own-response = या answer चा एक award त्याच answer टॅगच्या स्वतःच्या पाठवलेल्या उत्तरावर आधारित आहे, ज्यामुळे अनपेक्षित वर्तन होईल.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` असलेल्या पात्रात असणाऱ्या `<answer>` वर `maxNumAttempts` दिल्याने काहीही परिणाम होत नाही, कारण प्रयत्नांची संख्या पात्रच नियंत्रित करते. त्याऐवजी पात्रावर `maxNumAttempts` द्या.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` असलेल्या दुसऱ्या पात्रात असणाऱ्या `sectionWideCheckWork` पात्रावर `maxNumAttempts` दिल्याने काहीही परिणाम होत नाही, कारण प्रयत्नांची संख्या बाहेरचे पात्रच नियंत्रित करते. त्याऐवजी बाहेरच्या पात्रावर `maxNumAttempts` द्या.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality ठरवलेले नसेल तर { $attributes } ॲट्रिब्यूटचा काहीही परिणाम होणार नाही.
       *[other] symbolicEquality ठरवलेले नसेल तर { $attributes } ॲट्रिब्यूटांचा काहीही परिणाम होणार नाही.
    }

answer-invalid-type = answer साठी प्रकार अवैध: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` या घटकाला नाव नसल्याने तो module च्या ॲट्रिब्यूटसाठी वापरता येणार नाही

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` हा घटक module चा ॲट्रिब्यूट म्हणून वापरता येणार नाही, कारण `<module>` घटक प्रकारात आधीच "{ $name }" नावाचे ॲट्रिब्यूट ठरवलेले आहे.

conditional-content-condition-ignored = case किंवा else अपत्ये असलेल्या `<conditionalContent>` घटकावर `condition` ॲट्रिब्यूट दुर्लक्षित केले जाते.

slider-markers-type-mismatch = खुणांचा प्रकार स्लायडरच्या प्रकाराशी जुळत नाही.

pretzel-problem-needs-statement-and-answer = pretzel अवैध: प्रत्येक `<problem>` मध्ये एक `<statement>` आणि एक `<answer>` असायला हवे.

pretzel-circuit-first-problem-distractor = pretzel अवैध: mode="circuit" मध्ये पहिला `<problem>` भरकटवणारा पर्याय असू शकत नाही.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` ॲट्रिब्यूटसाठी { $values } हे मूल्य अवैध आहे; दुर्लक्षित केले जात आहे.
       *[other] `{ $attribute }` ॲट्रिब्यूटसाठी { $values } ही मूल्ये अवैध आहेत; दुर्लक्षित केली जात आहेत.
    }

attribute-must-be-references = `{ $attribute }` ॲट्रिब्यूटसाठी `{ $value }` हे मूल्य अवैध आहे. ॲट्रिब्यूट `$` ने सुरू होणाऱ्या संदर्भांनी बनलेले असायला हवे.

math-input-invalid-function-names = <mathInput>: { $attribute } मधील अवैध फलननावे दुर्लक्षित केली: { $names }. प्रत्येक नावाचा दर्शन-भाग किमान 2 अक्षरांचा (अक्षरे किंवा हायफन) असायला हवा; त्यानंतर पर्यायाने `|<mathspeak alternative>` हा भाग येऊ शकतो.

## Building components from the source

component-type-invalid = घटक प्रकार अवैध: `<{ $componentType }>`

attribute-repeated = { $attribute } ॲट्रिब्यूटची पुनरावृत्ती करता येत नाही.

attribute-invalid-for-component = `<{ $componentType }>` प्रकाराच्या घटकासाठी "{ $attribute }" ॲट्रिब्यूट अवैध आहे.

## Style definition contrast

style-definition-insufficient-contrast =
    शैली व्याख्या { $styleNumber } मध्ये { $context ->
        [text-on-background] पार्श्वभूमीच्या रंगाच्या तुलनेत मजकुराच्या रंगाचा
        [high-contrast] कॅनव्हासच्या तुलनेत उच्च-वैषम्य रंगाचा
        [line] कॅनव्हासच्या तुलनेत रेषेच्या रंगाचा
        [marker] कॅनव्हासच्या तुलनेत खुणेच्या रंगाचा
       *[text-on-canvas] कॅनव्हासच्या तुलनेत मजकुराच्या रंगाचा
    } वैषम्य पुरेसा नाही{ $mode ->
        [dark] { " (गडद मोड)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; किमान { $threshold }:1 आवश्यक).

style-definition-dark-mode-text-background-contrast =
    शैली व्याख्या { $styleNumber } मध्ये दिलेले रंग फिकट मोडमध्ये पुरेसा वैषम्य देत असले तरी, त्या मूल्यांपासून मिळणाऱ्या गडद-मोड रंगांत पार्श्वभूमीच्या रंगाच्या तुलनेत मजकुराच्या रंगाचा वैषम्य पुरेसा नाही ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; किमान { $threshold }:1 आवश्यक). { $suggestion ->
        [available] गडद मोडमध्ये पुरेसा वैषम्य मिळावा म्हणून एकतर फिकट मोडचा वैषम्य वाढवा (उदा. { $lightAttribute }="{ $lightColor }" द्या), नाहीतर गडद-मोडचा रंग स्वतः ठरवा (उदा. { $darkAttribute }="{ $darkColor }" द्या).
       *[none] गडद मोडमध्ये पुरेसा वैषम्य मिळावा म्हणून फिकट मोडचा वैषम्य वाढवा, किंवा textColorDarkMode व/वा backgroundColorDarkMode ने मिळालेले रंग स्वतः ठरवा.
    }

style-definition-dark-mode-text-canvas-contrast =
    शैली व्याख्या { $styleNumber } मध्ये दिलेला मजकुराचा रंग फिकट मोडमध्ये पुरेसा वैषम्य देत असला तरी, त्या मूल्यापासून मिळणाऱ्या गडद-मोड मजकूर रंगाचा कॅनव्हासच्या तुलनेत वैषम्य पुरेसा नाही ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; किमान { $threshold }:1 आवश्यक). { $suggestion ->
        [available] गडद मोडमध्ये पुरेसा वैषम्य मिळावा म्हणून एकतर फिकट मोडचा वैषम्य वाढवा (उदा. textColor="{ $lightColor }" द्या), नाहीतर गडद-मोडचा रंग स्वतः ठरवा (उदा. textColorDarkMode="{ $darkColor }" द्या).
       *[none] गडद मोडमध्ये पुरेसा वैषम्य मिळावा म्हणून फिकट मोडचा वैषम्य वाढवा, किंवा textColorDarkMode ने मिळालेला रंग स्वतः ठरवा.
    }

section-multiple-style-palettes = एक विभाग फक्त एकच <stylePalette> निवडू शकतो; शेवटचा वापरला जात आहे.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } चे स्वतंत्र प्रकार ठरवता येत नाहीत, कारण numToSelect हा अऋण पूर्णांक नाही.

variant-num-to-select-not-constant-number = { $component } चे स्वतंत्र प्रकार ठरवता येत नाहीत, कारण numToSelect ही स्थिर संख्या नाही.

variant-with-replacement-not-constant-boolean = { $component } चे स्वतंत्र प्रकार ठरवता येत नाहीत, कारण withReplacement हा स्थिर बूलियन नाही.

variant-select-weight-disables-unique = एखाद्या पर्यायावर selectWeight किंवा selectForVariants दिलेले असेल तर select चे स्वतंत्र प्रकार बंद राहतात

variant-coprime-undetermined = { $component } चे स्वतंत्र प्रकार ठरवता येत नाहीत, कारण coprime नेहमी असत्य आहे का हे ठरवता येत नाही.

variant-attribute-not-constant = { $component } चे स्वतंत्र प्रकार ठरवता येत नाहीत, कारण { $attribute } स्थिरांक नाही.

variant-attribute-not-number = { $component } चे स्वतंत्र प्रकार ठरवता येत नाहीत, कारण { $attribute } संख्या नाही.

variant-attribute-wrong-type-for-sequence =
    { $type } प्रकाराच्या { $component } चे स्वतंत्र प्रकार ठरवता येत नाहीत, कारण { $attribute } हा { $expected ->
        [letters-combination] अक्षरसमूह
        [math-expression] वैध गणिती पदावली
        [integer] पूर्णांक
       *[number] संख्या
    } नाही.

variant-length-not-integer = { $component } चे स्वतंत्र प्रकार ठरवता येत नाहीत, कारण length पूर्णांक नाही.

variant-sort-not-implemented = sort सह { $component } चे स्वतंत्र प्रकार अंमलात आणलेले नाहीत

variant-exclude-combinations-not-implemented = excludeCombinations सह { $component } चे स्वतंत्र प्रकार अंमलात आणलेले नाहीत

variant-math-exclude-not-implemented = exclude सह math प्रकाराच्या { $component } चे स्वतंत्र प्रकार अंमलात आणलेले नाहीत

variant-non-constant-exclude-not-implemented = स्थिर नसलेल्या exclude सह { $component } चे स्वतंत्र प्रकार अंमलात आणलेले नाहीत

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure रेंडररमध्ये समर्थित नाही; वंशज वगळला.

prefigure-descendant-invalid-geometry = { $subject }: भूमिती ससीम नाही किंवा अपूर्ण आहे; वंशज वगळला.

prefigure-curve-label-omitted = { $subject }: रूपांतरित वक्र घटकांवर लेबले समर्थित नाहीत; लेबल वगळले.

prefigure-curve-unsupported-definition-type = { $subject }: '{ $definitionType }' हा वक्र फलन व्याख्येचा प्रकार समर्थित नाही; वंशज वगळला.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves वरील flipFunctions ॲट्रिब्यूट समर्थित नाही; वंशज वगळला.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves वर फक्त सूत्र-प्रकाराची अपत्य फलने समर्थित आहेत; वंशज वगळला.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] रेषा-कुळाच्या लेबलासाठी
       *[point] बिंदू लेबलासाठी
    } '{ $labelPosition }' हे labelPosition समर्थित नाही; PreFigure ची पूर्वनिर्धारित मांडणी वापरली.

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' ही भरण शैली PreFigure ला समर्थित नाही; घन भरणाकडे परत जात आहे.

prefigure-line-style-unknown = { $subject }: अनोळखी रेषा शैली '{ $lineStyle }' PreFigure आउटपुटमधून वगळली.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' ही खूण शैली PreFigure च्या 'diamond' शैलीशी जुळवली.

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' ही खूण शैली PreFigure ला समर्थित नाही; पूर्वनिर्धारित शैली वापरली.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` अवैध; लक्ष्य ठरवता येत नाही. टीप वगळली.

annotation-ref-multiple-targets = `<annotation>`: `ref` अनेक लक्ष्यांवर ठरले; पहिले लक्ष्य वापरले जात आहे.

annotation-ref-outside-graph = `<annotation>`: `ref` अवैध; लक्ष्य सामावणाऱ्या graph च्या बाहेर आहे. टीप वगळली.

annotation-ref-unsupported-target = `<annotation>`: `ref` अवैध; prefigure रूपांतरात लक्ष्य हा समर्थित आलेखीय घटक नाही. टीप वगळली.

annotation-text-missing = `<annotation>`: `text` नाही किंवा रिकामे आहे; रिकामा मजकूर तयार केला जात आहे.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] वर्तुळाकार अवलंबित्व आढळले.
       *[other] `<{ $componentType }>` घटकाचा समावेश असलेले वर्तुळाकार अवलंबित्व आढळले.
    }

reference-no-referent = संदर्भासाठी लक्ष्य आढळले नाही: `{ $reference }`

reference-multiple-referents = संदर्भासाठी अनेक लक्ष्ये आढळली: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` च्या { $attribute } ॲट्रिब्यूटची मांडणी अवैध आहे.

children-invalid = `<{ $componentType }>` साठी अपत्ये अवैध: अवैध अपत्ये आढळली: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` ॲट्रिब्यूटसाठी `{ $value }` हे मूल्य अवैध आहे, `{ $default }` हे मूल्य वापरले जात आहे

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML आवृत्ती { $version } सापडली नाही.
       *[other] DoenetML आवृत्ती { $version } सापडली नाही. आवृत्ती { $fallback } वापरली जात आहे
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML अवैध: { $content }

parse-tag-missing-close-tag = DoenetML अवैध: `{ $tag }` या टॅगला बंद करणारा टॅग नाही. स्वतःच बंद होणारा टॅग किंवा `</{ $tagName }>` टॅग अपेक्षित होता.

parse-tag-error = DoenetML अवैध: `<{ $tagName }>` टॅगमध्ये त्रुटी

parse-attribute-missing-value = DoenetML अवैध: `{ $attribute }` हे ॲट्रिब्यूट अवैध आहे, त्याचे मूल्य दिलेले दिसत नाही.

parse-attribute-invalid = DoenetML अवैध: `{ $attribute }` हे ॲट्रिब्यूट अवैध आहे

parse-attribute-value-invalid = DoenetML अवैध: `{ $value }` हे ॲट्रिब्यूट मूल्य अवैध आहे

parse-attribute-value-quote-mismatch = DoenetML अवैध: `{ $value }` हे ॲट्रिब्यूट मूल्य अवैध आहे. अवतरणचिन्हे जुळत नाहीत. एक `{ $quote }` कमी असल्याचे दिसते

parse-open-tag-name-missing = DoenetML अवैध: नावाशिवाय टॅग आढळला, उदा. `<`

parse-tag-not-closed = DoenetML अवैध: `{ $tag }` हा टॅग बंद केलेला नाही (एक `>` कमी असल्याचे दिसते).

parse-self-closing-tag-name-missing = DoenetML अवैध: नावाशिवाय टॅग आढळला `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML अवैध: `{ $tag }` हा टॅग बंद केलेला नाही (`/>` कमी असल्याचे दिसते).

parse-tag-invalid-attributes = DoenetML अवैध: `{ $tag }` हा टॅग वैध नाही. त्याची ॲट्रिब्यूटे चुकीची असू शकतात.

parse-close-tag-name-missing = DoenetML अवैध: नावाशिवाय बंद करणारा टॅग आढळला, उदा. `</`

parse-attribute-value-unquoted = ॲट्रिब्यूट मूल्ये अवतरणचिन्हांत असायला हवीत: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML अवैध: `{ $tag }` हा बंद करणारा टॅग आढळला, पण त्याला जुळणारा उघडणारा टॅग नाही

parse-close-tag-mismatched = DoenetML अवैध: बंद करणारा टॅग जुळत नाही. `</{ $expected }>` अपेक्षित होता. आढळला `{ $found }`

parser-node-unconvertible = { $node } हा नोड Dast नोडमध्ये रूपांतरित करता आला नाही.

## Names

name-attribute-invalid =
    name='{ $name }' हे ॲट्रिब्यूट अवैध आहे. { $reason ->
        [characters] नावांत फक्त अक्षरे, अंक, अंडरस्कोर किंवा हायफन असू शकतात.
       *[start] नावे अक्षराने सुरू व्हायला हवीत.
    }

component-name-invalid-start = "{ $name }" हे घटकाचे नाव अवैध आहे. नावे अक्षराने सुरू व्हायला हवीत.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched प्रकाराच्या answer ला video ॲट्रिब्यूट असायला हवे

answer-video-watched-video-not-reference = videoWatched प्रकाराच्या answer चे video ॲट्रिब्यूट संदर्भ असायला हवे

answer-name-not-single-text = answer च्या name ॲट्रिब्यूटला एकच text अपत्य असायला हवे

## Referencing another document

external-doenetml-recursion-limit = पुनरावृत्तीचे स्तर फार जास्त असल्याने बाहेरचा DoenetML मिळवता येत नाही. कुठे वर्तुळाकार संदर्भ आहे का?

external-doenetml-unavailable = { $attribute }="{ $uri }" मधून DoenetML मिळवता येत नाही

external-doenetml-type-mismatch = { $attribute }="{ $uri }" मधून मिळालेला DoenetML अवैध: तो "{ $componentType }" या घटक प्रकाराशी जुळला नाही

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` हे ॲट्रिब्यूट कालबाह्य आहे; त्याऐवजी `{ $to }` वापरा.
       *[other] [deprecation] `<{ $component }>` वरील `{ $from }` हे ॲट्रिब्यूट कालबाह्य आहे; त्याऐवजी `{ $to }` वापरा.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` देखील दिलेले असल्याने `{ $from }` हे ॲट्रिब्यूट कालबाह्य आणि दुर्लक्षित आहे.
       *[other] [deprecation] `{ $to }` देखील दिलेले असल्याने `<{ $component }>` वरील `{ $from }` हे ॲट्रिब्यूट कालबाह्य आणि दुर्लक्षित आहे.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` वरील `{ $attribute }` हे ॲट्रिब्यूट कालबाह्य आणि दुर्लक्षित आहे.


## Language coverage

pluralize-english-only = `<pluralize>` फक्त इंग्रजीचे अनेकवचन करू शकतो, त्यामुळे { $locale } भाषेत लिहिलेल्या दस्तऐवजात त्याचा मजकूर तसाच राहतो. अनेकवचनी रूप थेट लिहा, किंवा `pluralForm` ॲट्रिब्यूटने द्या.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` हा घटक Doenet ला ओळखीचा नाही.

schema-element-not-allowed-at-root = `<{ $tag }>` हा घटक दस्तऐवजाच्या मुळाशी चालत नाही.

schema-element-not-allowed-inside = `<{ $tag }>` हा घटक `<{ $parent }>` च्या आत चालत नाही.

schema-attribute-unrecognized = `<{ $tag }>` या घटकाला `{ $attribute }` नावाचे ॲट्रिब्यूट नाही.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` घटकाचे `{ $attribute }` ॲट्रिब्यूट अशी यादी असायला हवे जिची प्रत्येक नोंद यांपैकी एक असेल: { $allowed }
       *[other] `<{ $tag }>` घटकाचे `{ $attribute }` ॲट्रिब्यूट यांपैकी एक असायला हवे: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select साठी प्रकाराचे नाव अवैध.  { $variantName } हे प्रकाराचे नाव { $numOptions } पर्यायांत येते पण निवडायची संख्या { $numToSelect } आहे.

select-variant-name-without-options = select साठी काही प्रकार दिले आहेत पण संभाव्य प्रकार नाव { $variantName } साठी एकही पर्याय दिलेला नाही.

select-variant-name-not-possible = select साठी दिलेले { $variantName } हे प्रकाराचे नाव संभाव्य प्रकार नाव नाही.

select-too-few-options = फक्त { $numOptions } मधून { $numToSelect } घटक निवडता येत नाहीत.

select-from-sequence-too-few-values = { $length } लांबीच्या क्रमातून { $numToSelect } मूल्ये निवडता येत नाहीत.

select-from-sequence-indices-count-mismatch = select साठी दिलेल्या निर्देशांकांची संख्या निवडायच्या संख्येशी जुळायला हवी

select-from-sequence-indices-not-integers = select साठी दिलेले सर्व निर्देशांक पूर्णांक असायला हवेत

select-from-sequence-index-excluded = selectfromsequence चा जो निर्देशांक दिला होता तो वगळलेला होता

select-from-sequence-indices-excluded-combination = selectfromsequence चे जे निर्देशांक दिले होते ते वगळलेला संच होते

select-from-sequence-coprime-not-positive-integers = धन पूर्णांक निवडले जात नसल्याने सहमूल संच निवडता येत नाहीत.

select-from-sequence-coprime-common-factor = सहमूल संख्या निवडता येत नाहीत. सर्व संभाव्य मूल्यांना एक समान अवयव आहे. ("from" किंवा "to" ची दिलेली मूल्ये "step" शी सहमूल असायला हवीत.)

select-from-sequence-coprime-single-number = 1 नसलेल्या एकाच संख्येतून सहमूल संच निवडता येत नाहीत.

select-from-sequence-excluded-too-many-combinations = selectFromSequence मध्ये 70% पेक्षा जास्त संच वगळले

select-from-sequence-coprime-none-found = सहमूल संख्या निवडता आल्या नाहीत. सर्व संभाव्य मूल्यांना एक समान अवयव आहे.

select-from-sequence-too-few-unique-values = { $numPossibleValues } लांबीच्या क्रमातून { $numToSelect } स्वतंत्र मूल्ये निवडता येत नाहीत

select-prime-numbers-too-few-values = { $numValues } लांबीच्या मूळ संख्यांच्या यादीतून { $numToSelect } मूल्ये निवडता येत नाहीत

select-prime-numbers-values-count-mismatch = select साठी दिलेल्या मूल्यांची संख्या निवडायच्या संख्येशी जुळायला हवी

select-prime-numbers-values-not-prime = select prime number साठी दिलेली सर्व मूल्ये मूळ संख्यांच्या यादीत असायला हवीत

select-prime-numbers-values-excluded-combination = selectPrimeNumbers ची दिलेली मूल्ये वगळलेला संच होती

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers मध्ये 70% पेक्षा जास्त संच वगळले

select-random-combination-fluke = अत्यंत असंभाव्य योगायोगाने यादृच्छिक मूल्यांचा संच निवडता आला नाही

select-random-value-fluke = अत्यंत असंभाव्य योगायोगाने यादृच्छिक मूल्य निवडता आले नाही
