# Tamil diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Tamil counts in two plural categories, so a countable message writes both out
# where the noun changes shape.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] இரு முனைப்புள்ளிகள் குறிப்பிடப்படும்போது { $attributes } புறக்கணிக்கப்படுகிறது
       *[other] இரு முனைப்புள்ளிகள் குறிப்பிடப்படும்போது { $attributes } புறக்கணிக்கப்படுகின்றன
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] ஒரு முனைப்புள்ளியும் ஒரு நடுப்புள்ளியும் குறிப்பிடப்படும்போது { $attributes } புறக்கணிக்கப்படுகிறது
       *[other] ஒரு முனைப்புள்ளியும் ஒரு நடுப்புள்ளியும் குறிப்பிடப்படும்போது { $attributes } புறக்கணிக்கப்படுகின்றன
    }

line-segment-midpoint-offset-without-midpoint = நடுப்புள்ளி இல்லாமல் midpointOffset எந்த விளைவையும் தராது

## `<line>`

line-points-undetermined-dimensions = நிர்ணயிக்கப்படாத பரிமாணங்கள் கொண்ட புள்ளிகள் வழியாகச் செல்லும் கோடு.

line-points-too-few-dimensions = கோடு குறைந்தது இரு பரிமாணங்கள் கொண்ட புள்ளிகள் வழியாகச் செல்ல வேண்டும்.

line-points-depend-on-variables = கோடு மாறிகளைச் சார்ந்த புள்ளிகள் வழியாகச் செல்கிறது: { $variables }.

line-equation-invalid-format = { $variable1 } மற்றும் { $variable2 } மாறிகளில் கோட்டின் சமன்பாட்டுக்குத் தவறான வடிவம்.

## `<ray>`

ray-overprescribed-through = கதிர் through, endpoint மற்றும் direction ஆகியவற்றால் ஒருங்கே வரையறுக்கப்படுகிறது. குறிப்பிடப்பட்ட through புறக்கணிக்கப்படுகிறது.

ray-dimension-mismatch = கதிரில் numDimensions பொருந்தவில்லை.

## `<vector>`

vector-overprescribed-head = வெக்டர் head, tail மற்றும் displacement ஆகியவற்றால் ஒருங்கே வரையறுக்கப்படுகிறது. குறிப்பிடப்பட்ட head புறக்கணிக்கப்படுகிறது.

vector-dimension-mismatch = வெக்டரில் numDimensions பொருந்தவில்லை.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` க்கு nearestPoint நிலை மாறி இல்லாததால் அதை நோக்கி ஈர்க்க முடியாது.

constrain-to-without-nearest-point = `<{ $component }>` க்கு nearestPoint நிலை மாறி இல்லாததால் அதற்குக் கட்டுப்படுத்த முடியாது.

constrain-to-interior-without-nearest-point = `<{ $component }>` க்கு nearestPoint நிலை மாறி இல்லாததால் அதன் உட்பகுதிக்குக் கட்டுப்படுத்த முடியாது.

## `<choiceInput>`

choice-input-label-position-ignored = உள்வரிசை அல்லாத choiceInput க்கு labelPosition புறக்கணிக்கப்படுகிறது

## Ordering children by index

choice-input-indices-count-mismatch = குறியீட்டெண்களின் எண்ணிக்கை choice சேய்களின் எண்ணிக்கையுடன் பொருந்தாததால் choiceInput க்குக் குறிப்பிடப்பட்ட குறியீட்டெண்கள் புறக்கணிக்கப்படுகின்றன.

pretzel-indices-count-mismatch = குறியீட்டெண்களின் எண்ணிக்கை problem சேய்களின் எண்ணிக்கையுடன் பொருந்தாததால் problem க்குக் குறிப்பிடப்பட்ட குறியீட்டெண்கள் புறக்கணிக்கப்படுகின்றன.

shuffle-indices-count-mismatch = குறியீட்டெண்களின் எண்ணிக்கை கூறுகளின் எண்ணிக்கையுடன் பொருந்தாததால் shuffle க்குக் குறிப்பிடப்பட்ட குறியீட்டெண்கள் புறக்கணிக்கப்படுகின்றன.

indices-ignored-out-of-range = சில குறியீட்டெண்கள் வரம்புக்கு வெளியே இருப்பதால் { $component } க்குக் குறிப்பிடப்பட்ட குறியீட்டெண்கள் புறக்கணிக்கப்படுகின்றன.

pretzel-indices-repeated = சில குறியீட்டெண்கள் மீண்டும் வருவதால் pretzel க்குக் குறிப்பிடப்பட்ட குறியீட்டெண்கள் புறக்கணிக்கப்படுகின்றன.

pretzel-circuit-first-index = circuit முறையில் முதல் குறியீட்டெண் 1 ஆக இருக்க வேண்டும் என்பதால் pretzel க்குக் குறிப்பிடப்பட்ட குறியீட்டெண்கள் புறக்கணிக்கப்படுகின்றன.

## `<shuffle>` and `<sort>`

string-children-need-type = சரம் சேய்களுடன் `<{ $component }>` வேலை செய்ய `type` பண்பு குறிப்பிடப்பட வேண்டும்.

invalid-type-defaulting-to-math = { $component } கூறுக்கு { $type } என்பது தவறான type. அது math, text, number அல்லது boolean இல் ஒன்றாக இருக்க வேண்டும். math ஆக அமைக்கப்படுகிறது.

string-not-valid-component-to-arrange = "{ $value }" என்ற சரம் { $component } செய்யத் தகுந்த கூறு அல்ல. புறக்கணிக்கப்படுகிறது.

## Types and variables

invalid-type-defaulting-to-number = { $type } என்பது தவறான type, type ஆனது number ஆக அமைக்கப்படுகிறது.

invalid-variable-value = மாறியின் தவறான மதிப்பு: `{ $value }`

## Variants

variant-index-must-be-number = வகைமாதிரிக் குறியீட்டெண் { $index } ஒரு எண்ணாக இருக்க வேண்டும்

variant-index-must-be-integer = வகைமாதிரிக் குறியீட்டெண் { $index } ஒரு முழு எண்ணாக இருக்க வேண்டும்

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` தனித்த அளவீடுகளுக்குச் செயல்படுத்தப்படவில்லை. அகலங்கள் சார்பு அளவாக அமைக்கப்படுகின்றன.

side-by-side-absolute-margins = `<{ $component }>` தனித்த அளவீடுகளுக்குச் செயல்படுத்தப்படவில்லை. ஓரங்கள் சார்பு அளவாக அமைக்கப்படுகின்றன.

side-by-side-no-block-child = தவறான `<{ $component }>`: அதற்குக் குறைந்தது ஒரு தொகுதிச் சேய் இருக்க வேண்டும்.

## `<label>`

label-for-ignored-on-graphical = வரைகலை `<label>` இல் உள்ள `for` பண்பு புறக்கணிக்கப்படுகிறது.

label-for-must-resolve-to-one = `<label>` இல் உள்ள `for` பண்பு சரியாக ஒரு கூறாகத் தீர்க்கப்பட வேண்டும்.

label-for-unresolved = `<label>` இல் உள்ள `for` பண்பை ஒரு கூறாகத் தீர்க்க முடியவில்லை.

label-for-answer-with-authored-inputs = `<label>` இல் உள்ள `for` பண்பு, வெளிப்படையாக எழுதப்பட்ட உள்ளீடுகளைக் கொண்ட `<answer>` ஐக் குறிக்கிறது; உள்ளீட்டை நேரடியாகக் குறிப்பிடவும்.

label-for-answer-without-input = `<label>` இல் உள்ள `for` பண்பு, பெயரிட உள்ளீடு இல்லாத `<answer>` ஐக் குறிக்கிறது.

label-for-must-reference-input-or-answer = `<label>` இல் உள்ள `for` பண்பு ஒரு உள்ளீட்டையோ ஒரு விடையையோ குறிக்க வேண்டும்.

## Accessibility

accessibility-short-description-or-decorative = அணுகல்தன்மைக்காக `<{ $component }>` க்கு ஒரு சுருக்க விளக்கம் இருக்க வேண்டும் அல்லது அது அலங்காரம் என்று குறிப்பிடப்பட வேண்டும்.

accessibility-video-short-description = அணுகல்தன்மைக்காக `<video>` க்கு ஒரு சுருக்க விளக்கம் இருக்க வேண்டும்.

accessibility-input-short-description-or-label = அணுகல்தன்மைக்காக `<{ $component }>` க்கு ஒரு சுருக்க விளக்கமோ ஒரு பெயரோ இருக்க வேண்டும்.

accessibility-answer-input-short-description-or-label = அணுகல்தன்மைக்காக, ஒரு உள்ளீட்டை உருவாக்கும் `<answer>` க்கு ஒரு சுருக்க விளக்கமோ ஒரு பெயரோ இருக்க வேண்டும்.

accessibility-short-description-contains-math = சுருக்க விளக்கங்களில் `<{ $component }>` போன்ற கணிதக் கூறுகள் இருக்கக் கூடாது. கணிதத்தை வார்த்தைகளில் எழுதவும்.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] பிரிவுத் தலைப்பு உரைக்கு { $colorName } இன் மாறுபாடு போதுமானதாக இல்லை (இருள் நிலை) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; குறைந்தது { $threshold }:1 தேவை).
       *[other] பிரிவுத் தலைப்பு உரைக்கு { $colorName } இன் மாறுபாடு போதுமானதாக இல்லை ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; குறைந்தது { $threshold }:1 தேவை).
    }

## `<circle>`

circle-through-points-non-numerical = புள்ளிகளுக்கு எண் மதிப்புகள் இல்லாத நிலையில் { $count } புள்ளிகள் வழியாகச் செல்லும் `<circle>` செயல்படுத்தப்படவில்லை.

circle-too-many-through-points = 3 க்கும் மேற்பட்ட புள்ளிகள் வழியாகச் செல்லும் வட்டத்தைக் கணக்கிட முடியாது.

circle-overprescribed-radius-center-points = ஆரம், மையம் மற்றும் கடந்து செல்லும் புள்ளிகள் மூன்றும் குறிப்பிடப்பட்ட வட்டத்தைக் கணக்கிட முடியாது.

circle-center-with-multiple-points = குறிப்பிட்ட மையத்துடன் 1 க்கும் மேற்பட்ட புள்ளி வழியாகச் செல்லும் வட்டத்தைக் கணக்கிட முடியாது.

circle-radius-too-small = வட்டத்தைக் கணக்கிட முடியாது: இரு புள்ளிகளுக்கு இடையிலான தூரம் { $distance } என்பதால், குறிப்பிட்ட ஆரம் { $radius } மிகச் சிறியது.

circle-radius-with-many-points = குறிப்பிட்ட ஆரத்துடன் இரண்டுக்கும் மேற்பட்ட புள்ளிகள் வழியாகச் செல்லும் வட்டத்தை உருவாக்க முடியாது.

circle-invalid-center-or-through-points = வட்டத்தின் மையம் அல்லது கடந்து செல்லும் புள்ளிகள் தவறானவை.

circle-radius-center-with-multiple-points = குறிப்பிட்ட மையத்துடன் 1 க்கும் மேற்பட்ட புள்ளி வழியாகச் செல்லும் வட்டத்தின் ஆரத்தைக் கணக்கிட முடியாது.

circle-change-radius-non-numerical = எண் மதிப்பற்ற புள்ளிகள் வழியாகச் செல்லும் வட்டத்தின் ஆரத்தை மாற்ற முடியாது

circle-radius-with-points-non-numerical = எண் மதிப்புகள் இல்லாதபோது, குறிப்பிட்ட ஆரத்துடன் ஒன்றுக்கும் மேற்பட்ட புள்ளி வழியாகச் செல்லும் வட்டத்தை உருவாக்க முடியாது.

circle-change-center-non-numerical = எண் மதிப்பற்ற புள்ளிகள் வழியாகச் செல்லும் வட்டத்தின் மையத்தை மாற்றுவது செயல்படுத்தப்படவில்லை.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] சார்பின் ஆட்களத்திற்குப் போதுமான பரிமாணங்கள் இல்லை. ஆட்களத்தில் { $intervals } இடைவெளி உள்ளது, ஆனால் சார்பில் { $inputs ->
            [one] { $inputs } உள்ளீடு
           *[other] { $inputs } உள்ளீடுகள்
        } உள்ளன.
       *[other] சார்பின் ஆட்களத்திற்குப் போதுமான பரிமாணங்கள் இல்லை. ஆட்களத்தில் { $intervals } இடைவெளிகள் உள்ளன, ஆனால் சார்பில் { $inputs ->
            [one] { $inputs } உள்ளீடு
           *[other] { $inputs } உள்ளீடுகள்
        } உள்ளன.
    }

function-domain-invalid-format = சார்பின் ஆட்களத்திற்குத் தவறான வடிவம்.

function-ignoring-non-numerical =
    { $type ->
        [maximum] சார்பின் எண் மதிப்பற்ற மீப்பெருமம் புறக்கணிக்கப்படுகிறது.
        [minimum] சார்பின் எண் மதிப்பற்ற மீச்சிறுமம் புறக்கணிக்கப்படுகிறது.
        [extremum] சார்பின் எண் மதிப்பற்ற உச்சநிலை புறக்கணிக்கப்படுகிறது.
        [point] சார்பின் எண் மதிப்பற்ற புள்ளி புறக்கணிக்கப்படுகிறது.
        [slope] சார்பின் எண் மதிப்பற்ற சாய்வு புறக்கணிக்கப்படுகிறது.
       *[other] சார்பின் எண் மதிப்பற்ற { $type } புறக்கணிக்கப்படுகிறது.
    }

function-ignoring-empty =
    { $type ->
        [maximum] சார்பின் வெற்று மீப்பெருமம் புறக்கணிக்கப்படுகிறது.
        [minimum] சார்பின் வெற்று மீச்சிறுமம் புறக்கணிக்கப்படுகிறது.
        [extremum] சார்பின் வெற்று உச்சநிலை புறக்கணிக்கப்படுகிறது.
        [point] சார்பின் வெற்றுப் புள்ளி புறக்கணிக்கப்படுகிறது.
       *[other] சார்பின் வெற்று { $type } புறக்கணிக்கப்படுகிறது.
    }

function-points-too-close = சார்பில் மிக அருகருகே அமைந்த இரு புள்ளிகள் உள்ளன. சார்பை வரையறுக்க முடியாது.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] சார்பின் உள்ளீடுகளின் எண்ணிக்கை வெளியீடுகளின் எண்ணிக்கைக்குச் சமமாக இருந்தால் மட்டுமே சார்பு மறுசெய்கைகள் சாத்தியம். இந்தச் சார்பில் { $inputs } உள்ளீடும் { $outputs ->
            [one] { $outputs } வெளியீடும்
           *[other] { $outputs } வெளியீடுகளும்
        } உள்ளன.
       *[other] சார்பின் உள்ளீடுகளின் எண்ணிக்கை வெளியீடுகளின் எண்ணிக்கைக்குச் சமமாக இருந்தால் மட்டுமே சார்பு மறுசெய்கைகள் சாத்தியம். இந்தச் சார்பில் { $inputs } உள்ளீடுகளும் { $outputs ->
            [one] { $outputs } வெளியீடும்
           *[other] { $outputs } வெளியீடுகளும்
        } உள்ளன.
    }

## `<sequence>`

sequence-invalid-length = தொடரின் நீளம் தவறானது. அது ஒரு எதிர்மறையற்ற முழு எண்ணாக இருக்க வேண்டும்.

sequence-invalid-step = தொடரின் படி தவறானது. { $type } வகைத் தொடருக்கு அது ஒரு எண்ணாக இருக்க வேண்டும்.

sequence-invalid-endpoint-number = எண் தொடரின் "{ $attribute }" தவறானது. அது ஒரு எண்ணாக இருக்க வேண்டும்.

sequence-invalid-endpoint-letters = எழுத்துத் தொடரின் "{ $attribute }" தவறானது. அது ஒரு எழுத்துச் சேர்க்கையாக இருக்க வேண்டும்.

sequence-invalid-endpoint = தொடரின் "{ $attribute }" தவறானது.

select-from-sequence-coprime-not-numbers = எண்கள் தேர்ந்தெடுக்கப்படாததால் coprime புறக்கணிக்கப்படுகிறது

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations குறிப்பிடப்பட்டதால் coprime புறக்கணிக்கப்படுகிறது

## Resolving a `target`

target-not-found = `<{ $source }>` க்குத் தவறான target: இலக்கைக் கண்டறிய முடியவில்லை.

target-state-variable-not-found = `<{ $source }>` க்குத் தவறான target: `<{ $component }>` இல் "{ $property }" என்ற பெயருடைய நிலை மாறியைக் கண்டறிய முடியவில்லை.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` இன் மாறிகள் சார்பிலா மாறியிலிருந்து வேறுபட்டிருக்க வேண்டும்.

ode-system-duplicate-variable-names = ஒரே சார்பு மாறிப் பெயர்களுடன் ODE RHS சார்புகளை வரையறுக்க முடியாது.

ode-system-rhs-function-error = ODE RHS சார்பை வரையறுக்க முடியாது. mathjs சார்பை உருவாக்குவதில் பிழை.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } கோடுகளுக்கு இடையிலான கோணத்தை வரையறுக்க முடியாது

angle-invalid-through-point = `<angle>` இன் through இல் தவறான புள்ளி

parabola-vertex-too-many-points = முனையுடன் 1 க்கும் மேற்பட்ட புள்ளி வழியாகச் செல்லும் பரவளையம் செயல்படுத்தப்படவில்லை.

parabola-too-many-points = 3 க்கும் மேற்பட்ட புள்ளிகள் வழியாகச் செல்லும் பரவளையம் செயல்படுத்தப்படவில்லை.

intersection-too-many-items = இரண்டுக்கும் மேற்பட்ட உருப்படிகளுக்கான வெட்டு செயல்படுத்தப்படவில்லை

## Other math components

ionic-compound-not-two-ions = இரு அயனிகள் தவிர வேறு எதற்கும் அயனிச் சேர்மம் செயல்படுத்தப்படவில்லை.

ionic-compound-needs-cation-and-anion = ஓர் நேர் அயனிக்கும் ஓர் எதிர் அயனிக்கும் மட்டுமே அயனிச் சேர்மம் செயல்படுத்தப்பட்டுள்ளது.

solve-equations-cannot-evaluate = சமன்பாட்டை மதிப்பிட முடியாததால் அதைத் தீர்க்க முடியாது: { $equation }

math-operators-operand-number-required = கணிதக் கூறொன்றைப் பிரித்தெடுக்கும்போது operandNumber ஐக் குறிப்பிட வேண்டும்.

eigen-decomposition-failed = அணியின் ஐகன் மதிப்புகளைக் கணக்கிட முடியவில்லை

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } என்ற அளபுரு வடிவத்தில் வராததால் அது எப்போதும் ஒரு வெற்றிடத்துடன் பொருந்தும்.
       *[other] `<matchesPattern>`: { $parameters } என்ற அளபுருக்கள் வடிவத்தில் வராததால் அவை எப்போதும் ஒரு வெற்றிடத்துடன் பொருந்தும்.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ஐப் புரிந்துகொள்ள முடியவில்லை. அது none, medium, dense அல்லது ஒரு இடைவெளியால் பிரிக்கப்பட்ட இரு நேர் எண்களாக — எடுத்துக்காட்டாக grid="1 0.5" — இருக்க வேண்டும். கட்டம் எதுவும் வரையப்படவில்லை.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure காட்சியாக்கியில் xLabelPosition="left" ஆதரிக்கப்படவில்லை; வலப்புற நிலை நடத்தை பயன்படுத்தப்படுகிறது.

prefigure-y-label-position-unsupported = `<graph>`: prefigure காட்சியாக்கியில் yLabelPosition="bottom" ஆதரிக்கப்படவில்லை; மேற்புற நிலை நடத்தை பயன்படுத்தப்படுகிறது.

prefigure-invalid-axis-bounds = `<graph>`: prefigure மாற்றத்திற்கு அச்சு எல்லைகள் தவறானவை; இயல்புநிலை bbox (-10,-10,10,10) பயன்படுத்தப்படுகிறது.

prefigure-invalid-width = `<graph>`: prefigure மாற்றத்திற்கு அகலம் தவறானது; இயல்புநிலை வரைபட அகலம் 425 பயன்படுத்தப்படுகிறது.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure மாற்றத்திற்கு aspectRatio தவறானது; இயல்புநிலை விகிதம் 1 பயன்படுத்தப்படுகிறது.

prefigure-grid-spacing-too-fine = `<graph>`: அச்சு எல்லைகளுக்குக் கட்ட இடைவெளி மிக நுண்ணியதாக உள்ளது; prefigure காட்சியாக்கியில் கட்டம் விடப்படுகிறது.

prefigure-annotations-not-rendered = `<graph>`: PreFigure காட்சியாக்கியைப் பயன்படுத்தாதபோது விளக்கக் குறிப்புகள் காட்டப்படா.

multiple-annotations-children = `<graph>` இல் பல `<annotations>` சேய்கள் காணப்பட்டன; கடைசி ஒன்றைத் தவிர மற்றவை புறக்கணிக்கப்படுகின்றன.

## Referring to other components

copy-unrecognized-component-type = அறியப்படாத கூறு வகையை விரிவாக்கவோ நகலெடுக்கவோ முடியாது: { $type }.

copy-prop-not-found = { $component } வகைக் கூறில் { $property } என்ற பண்பைக் கண்டறிய முடியவில்லை

collect-no-source = collect க்கு மூலம் எதுவும் காணப்படவில்லை.

collect-invalid-component-type = `<{ $component }>` தவறான கூறு வகையாக இருப்பதால் அந்த வகைக் கூறுகளைச் சேகரிக்க முடியாது.

reference-index-unavailable = `{ $reference }` என்ற குறியீட்டெண்ணைக் குறிப்பிட முடியாது

## `<callAction>`

component-action-unavailable = `{ $reference }` கூறில் { $action } ஐ அழைக்க முடியாது

## `<dataFrame>`

data-frame-inconsistent-row-lengths = தரவின் வடிவம் தவறானது. வரிசைகளின் நீளங்கள் ஒத்திசைவற்றவை. componentIdx :{ $componentIdx } இல் காணப்பட்டது

data-frame-duplicate-column-names = தரவில் ஒரே நிரல் பெயர்கள் மீண்டும் வருகின்றன. componentIdx :{ $componentIdx } இல் காணப்பட்டது

data-frame-missing-column-name = தரவில் ஒரு நிரல் பெயர் இல்லை. componentIdx :{ $componentIdx } இல் காணப்பட்டது

## `<answer>` and scoring

answer-award-depends-on-own-response = இந்த விடையின் ஒரு award, அதே answer குறிச்சொல் சமர்ப்பித்த பதிலையே அடிப்படையாகக் கொண்டுள்ளது; இது எதிர்பாராத நடத்தைக்கு வழிவகுக்கும்.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` கொண்ட கொள்கலனுக்குள் உள்ள `<answer>` இல் `maxNumAttempts` அமைப்பது எந்த விளைவையும் தராது; முயற்சிகளின் எண்ணிக்கையை அந்தக் கொள்கலனே கட்டுப்படுத்துகிறது. `maxNumAttempts` ஐக் கொள்கலனில் அமைக்கவும்.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` கொண்ட மற்றொரு கொள்கலனுக்குள் உள்ள, `sectionWideCheckWork` கொண்ட கொள்கலனில் `maxNumAttempts` அமைப்பது எந்த விளைவையும் தராது; முயற்சிகளின் எண்ணிக்கையை வெளிப்புறக் கொள்கலனே கட்டுப்படுத்துகிறது. `maxNumAttempts` ஐ வெளிப்புறக் கொள்கலனில் அமைக்கவும்.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality அமைக்கப்படாமல் { $attributes } பண்பு எந்த விளைவையும் தராது.
       *[other] symbolicEquality அமைக்கப்படாமல் { $attributes } பண்புகள் எந்த விளைவையும் தரா.
    }

answer-invalid-type = விடைக்குத் தவறான வகை: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` கூறுக்குப் பெயர் இல்லாததால், அதை module பண்பாகப் பயன்படுத்த முடியாது

module-attribute-name-already-defined = `<module>` கூறு வகையில் "{ $name }" என்ற பண்பு ஏற்கனவே வரையறுக்கப்பட்டிருப்பதால், `<{ $component } name="{ $name }">` என்ற கூறை module இன் பண்பாகப் பயன்படுத்த முடியாது.

conditional-content-condition-ignored = case அல்லது else சேய்களைக் கொண்ட `<conditionalContent>` கூறில் `condition` பண்பு புறக்கணிக்கப்படுகிறது.

slider-markers-type-mismatch = குறிப்பான்களின் வகை slider இன் வகையுடன் பொருந்தவில்லை.

pretzel-problem-needs-statement-and-answer = தவறான pretzel: ஒவ்வொரு `<problem>` இலும் ஒரு `<statement>` ம் ஒரு `<answer>` ம் இருக்க வேண்டும்.

pretzel-circuit-first-problem-distractor = தவறான pretzel: mode="circuit" இல் முதல் `<problem>` ஒரு திசைதிருப்பியாக இருக்க முடியாது.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` பண்புக்குத் தவறான மதிப்பு { $values }; புறக்கணிக்கப்படுகிறது.
       *[other] `{ $attribute }` பண்புக்குத் தவறான மதிப்புகள் { $values }; புறக்கணிக்கப்படுகின்றன.
    }

attribute-must-be-references = `{ $attribute }` பண்புக்கு `{ $value }` என்பது தவறான மதிப்பு. அந்தப் பண்பு `$` இல் தொடங்கும் மேற்கோள்களால் ஆனதாக இருக்க வேண்டும்.

math-input-invalid-function-names = <mathInput>: { $attribute } இல் உள்ள தவறான சார்புப் பெயர்(கள்) புறக்கணிக்கப்பட்டன: { $names }. ஒவ்வொரு பெயரின் காட்சிப் பகுதியும் குறைந்தது 2 எழுத்துகள் (எழுத்துகள் அல்லது இடைக்கோடுகள்) கொண்டதாக இருக்க வேண்டும்; அதைத் தொடர்ந்து விருப்பத்தேர்வாக `|<mathspeak alternative>` பின்னொட்டு வரலாம்.

## Building components from the source

component-type-invalid = தவறான கூறு வகை: `<{ $componentType }>`

attribute-repeated = { $attribute } பண்பை மீண்டும் தர முடியாது.

attribute-invalid-for-component = `<{ $componentType }>` வகைக் கூறுக்கு "{ $attribute }" என்பது தவறான பண்பு.

## Style definition contrast

style-definition-insufficient-contrast =
    நடை வரையறை { $styleNumber } இல் { $context ->
        [text-on-background] பின்னணி நிறத்திற்கு எதிரான உரை நிறத்தின்
        [high-contrast] கித்தானுக்கு எதிரான உயர் மாறுபாட்டு நிறத்தின்
        [line] கித்தானுக்கு எதிரான கோட்டு நிறத்தின்
        [marker] கித்தானுக்கு எதிரான குறிப்பான் நிறத்தின்
       *[text-on-canvas] கித்தானுக்கு எதிரான உரை நிறத்தின்
    } மாறுபாடு போதுமானதாக இல்லை{ $mode ->
        [dark] { " (இருள் நிலை)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; குறைந்தது { $threshold }:1 தேவை).

style-definition-dark-mode-text-background-contrast =
    நடை வரையறை { $styleNumber } ஒளி நிலைக்குப் போதுமான மாறுபாட்டைத் தரும் நிறங்களைக் குறிப்பிட்டிருந்தாலும், அவற்றிலிருந்து பெறப்பட்ட இருள் நிலை நிறங்களில் பின்னணி நிறத்திற்கு எதிரான உரை நிறத்தின் மாறுபாடு போதுமானதாக இல்லை ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; குறைந்தது { $threshold }:1 தேவை). { $suggestion ->
        [available] இருள் நிலையில் போதுமான மாறுபாட்டை உறுதிசெய்ய, ஒளி நிலை மாறுபாட்டை அதிகரிக்கவும் (எ.கா. { $lightAttribute }="{ $lightColor }" என அமைக்கவும்) அல்லது இருள் நிலை நிறத்தை மேலெழுதவும் (எ.கா. { $darkAttribute }="{ $darkColor }" என அமைக்கவும்).
       *[none] இருள் நிலையில் போதுமான மாறுபாட்டை உறுதிசெய்ய, ஒளி நிலை மாறுபாட்டை அதிகரிக்கவும் அல்லது பெறப்பட்ட நிறங்களை textColorDarkMode மற்றும்/அல்லது backgroundColorDarkMode ஆல் மேலெழுதவும்.
    }

style-definition-dark-mode-text-canvas-contrast =
    நடை வரையறை { $styleNumber } ஒளி நிலைக்குப் போதுமான மாறுபாட்டைத் தரும் உரை நிறத்தைக் குறிப்பிட்டிருந்தாலும், அதிலிருந்து பெறப்பட்ட இருள் நிலை உரை நிறத்திற்குக் கித்தானுக்கு எதிரான மாறுபாடு போதுமானதாக இல்லை ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; குறைந்தது { $threshold }:1 தேவை). { $suggestion ->
        [available] இருள் நிலையில் போதுமான மாறுபாட்டை உறுதிசெய்ய, ஒளி நிலை மாறுபாட்டை அதிகரிக்கவும் (எ.கா. textColor="{ $lightColor }" என அமைக்கவும்) அல்லது இருள் நிலை நிறத்தை மேலெழுதவும் (எ.கா. textColorDarkMode="{ $darkColor }" என அமைக்கவும்).
       *[none] இருள் நிலையில் போதுமான மாறுபாட்டை உறுதிசெய்ய, ஒளி நிலை மாறுபாட்டை அதிகரிக்கவும் அல்லது பெறப்பட்ட நிறத்தை textColorDarkMode ஆல் மேலெழுதவும்.
    }

section-multiple-style-palettes = ஒரு பிரிவு ஒரே ஒரு <stylePalette> ஐ மட்டுமே தேர்ந்தெடுக்க முடியும்; கடைசி ஒன்று பயன்படுத்தப்படுகிறது.

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect ஒரு எதிர்மறையற்ற முழு எண்ணாக இல்லாததால் { $component } இன் தனித்த வகைமாதிரிகளைத் தீர்மானிக்க முடியாது.

variant-num-to-select-not-constant-number = numToSelect ஒரு மாறிலி எண்ணாக இல்லாததால் { $component } இன் தனித்த வகைமாதிரிகளைத் தீர்மானிக்க முடியாது.

variant-with-replacement-not-constant-boolean = withReplacement ஒரு மாறிலி boolean ஆக இல்லாததால் { $component } இன் தனித்த வகைமாதிரிகளைத் தீர்மானிக்க முடியாது.

variant-select-weight-disables-unique = selectWeight அல்லது selectForVariants குறிப்பிடப்பட்ட ஒரு விருப்பம் இருந்தால் select இன் தனித்த வகைமாதிரிகள் முடக்கப்படும்

variant-coprime-undetermined = coprime எப்போதும் தவறு என்பதைத் தீர்மானிக்க முடியாததால் { $component } இன் தனித்த வகைமாதிரிகளைத் தீர்மானிக்க முடியாது.

variant-attribute-not-constant = { $attribute } ஒரு மாறிலியாக இல்லாததால் { $component } இன் தனித்த வகைமாதிரிகளைத் தீர்மானிக்க முடியாது.

variant-attribute-not-number = { $attribute } ஒரு எண்ணாக இல்லாததால் { $component } இன் தனித்த வகைமாதிரிகளைத் தீர்மானிக்க முடியாது.

variant-attribute-wrong-type-for-sequence =
    { $attribute } ஆனது { $expected ->
        [letters-combination] ஒரு எழுத்துச் சேர்க்கையாக
        [math-expression] ஒரு செல்லுபடியான கணிதக் கோவையாக
        [integer] ஒரு முழு எண்ணாக
       *[number] ஒரு எண்ணாக
    } இல்லாததால் { $type } வகை { $component } இன் தனித்த வகைமாதிரிகளைத் தீர்மானிக்க முடியாது.

variant-length-not-integer = length ஒரு முழு எண்ணாக இல்லாததால் { $component } இன் தனித்த வகைமாதிரிகளைத் தீர்மானிக்க முடியாது.

variant-sort-not-implemented = sort உடன் கூடிய { $component } இன் தனித்த வகைமாதிரிகள் செயல்படுத்தப்படவில்லை

variant-exclude-combinations-not-implemented = excludeCombinations உடன் கூடிய { $component } இன் தனித்த வகைமாதிரிகள் செயல்படுத்தப்படவில்லை

variant-math-exclude-not-implemented = exclude உடன் கூடிய math வகை { $component } இன் தனித்த வகைமாதிரிகள் செயல்படுத்தப்படவில்லை

variant-non-constant-exclude-not-implemented = மாறிலி அல்லாத exclude உடன் கூடிய { $component } இன் தனித்த வகைமாதிரிகள் செயல்படுத்தப்படவில்லை

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure காட்சியாக்கியில் ஆதரிக்கப்படவில்லை; வழிவந்தது தவிர்க்கப்படுகிறது.

prefigure-descendant-invalid-geometry = { $subject }: முடிவிலா அல்லது முழுமையற்ற வடிவியல்; வழிவந்தது தவிர்க்கப்படுகிறது.

prefigure-curve-label-omitted = { $subject }: மாற்றப்பட்ட வளைவரைக் கூறுகளில் பெயர்கள் ஆதரிக்கப்படவில்லை; பெயர் விடப்படுகிறது.

prefigure-curve-unsupported-definition-type = { $subject }: ஆதரிக்கப்படாத வளைவரைச் சார்பு வரையறை வகை '{ $definitionType }'; வழிவந்தது தவிர்க்கப்படுகிறது.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves இல் ஆதரிக்கப்படாத flipFunctions பண்பு; வழிவந்தது தவிர்க்கப்படுகிறது.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves இல் வாய்ப்பாட்டு வகைச் சேய் சார்புகள் மட்டுமே ஆதரிக்கப்படுகின்றன; வழிவந்தது தவிர்க்கப்படுகிறது.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] கோட்டுக் குடும்பப் பெயருக்கு
       *[point] புள்ளிப் பெயருக்கு
    } ஆதரிக்கப்படாத labelPosition '{ $labelPosition }'; இயல்புநிலை PreFigure சீரமைப்பு பயன்படுத்தப்படுகிறது.

prefigure-fill-style-unsupported = { $subject }: நிரப்பு நடை '{ $fillStyle }' PreFigure ஆல் ஆதரிக்கப்படவில்லை; திடமான நிரப்புக்கு மாற்றப்படுகிறது.

prefigure-line-style-unknown = { $subject }: அறியப்படாத கோட்டு நடை '{ $lineStyle }' PreFigure வெளியீட்டிலிருந்து விடப்படுகிறது.

prefigure-marker-style-mapped-to-diamond = { $subject }: குறிப்பான் நடை '{ $markerStyle }' PreFigure நடை 'diamond' ஆக இணைக்கப்படுகிறது.

prefigure-marker-style-unsupported = { $subject }: குறிப்பான் நடை '{ $markerStyle }' PreFigure ஆல் ஆதரிக்கப்படவில்லை; இயல்புநிலை நடை பயன்படுத்தப்படுகிறது.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: தவறான `ref`; இலக்கைத் தீர்க்க முடியவில்லை. விளக்கக் குறிப்பு விடப்படுகிறது.

annotation-ref-multiple-targets = `<annotation>`: `ref` பல இலக்குகளாகத் தீர்க்கப்பட்டது; முதல் இலக்கு பயன்படுத்தப்படுகிறது.

annotation-ref-outside-graph = `<annotation>`: தவறான `ref`; இலக்கு உள்ளடக்கிய வரைபடத்திற்கு வெளியே உள்ளது. விளக்கக் குறிப்பு விடப்படுகிறது.

annotation-ref-unsupported-target = `<annotation>`: தவறான `ref`; prefigure மாற்றத்தில் இலக்கு ஆதரிக்கப்படும் வரைகலைப் பொருள் அல்ல. விளக்கக் குறிப்பு விடப்படுகிறது.

annotation-text-missing = `<annotation>`: `text` இல்லை அல்லது வெறுமையானது; வெற்று உரை வெளியிடப்படுகிறது.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] சுழல் சார்பு கண்டறியப்பட்டது.
       *[other] `<{ $componentType }>` கூறு சம்பந்தப்பட்ட சுழல் சார்பு கண்டறியப்பட்டது.
    }

reference-no-referent = இந்த மேற்கோளுக்கு எதுவும் காணப்படவில்லை: `{ $reference }`

reference-multiple-referents = இந்த மேற்கோளுக்குப் பல பொருள்கள் காணப்பட்டன: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` இன் { $attribute } பண்புக்குத் தவறான வடிவம்.

children-invalid = `<{ $componentType }>` க்குத் தவறான சேய்கள்: தவறான சேய்கள் காணப்பட்டன: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` பண்புக்கு `{ $value }` என்பது தவறான மதிப்பு, `{ $default }` என்ற மதிப்பு பயன்படுத்தப்படுகிறது

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML பதிப்பு { $version } காணப்படவில்லை.
       *[other] DoenetML பதிப்பு { $version } காணப்படவில்லை. பதிப்பு { $fallback } பயன்படுத்தப்படுகிறது
    }

## Reading the DoenetML

parse-invalid-doenetml = தவறான DoenetML: { $content }

parse-tag-missing-close-tag = தவறான DoenetML: `{ $tag }` குறிச்சொல்லுக்கு மூடும் குறிச்சொல் இல்லை. தன்னை மூடும் குறிச்சொல் அல்லது `</{ $tagName }>` குறிச்சொல் எதிர்பார்க்கப்பட்டது.

parse-tag-error = தவறான DoenetML: `<{ $tagName }>` குறிச்சொல்லில் பிழை

parse-attribute-missing-value = தவறான DoenetML: `{ $attribute }` என்ற தவறான பண்புக்கு மதிப்பு இல்லாதது போலத் தெரிகிறது.

parse-attribute-invalid = தவறான DoenetML: தவறான பண்பு `{ $attribute }`

parse-attribute-value-invalid = தவறான DoenetML: தவறான பண்பு மதிப்பு `{ $value }`

parse-attribute-value-quote-mismatch = தவறான DoenetML: தவறான பண்பு மதிப்பு `{ $value }`. மேற்கோள் குறிகள் பொருந்தவில்லை. `{ $quote }` விடுபட்டது போலத் தெரிகிறது

parse-open-tag-name-missing = தவறான DoenetML: பெயரில்லாத ஒரு குறிச்சொல் காணப்பட்டது, எ.கா. `<`

parse-tag-not-closed = தவறான DoenetML: `{ $tag }` குறிச்சொல் மூடப்படவில்லை (`>` விடுபட்டது போலத் தெரிகிறது).

parse-self-closing-tag-name-missing = தவறான DoenetML: பெயரில்லாத ஒரு குறிச்சொல் காணப்பட்டது `<{ $content }>`

parse-self-closing-tag-not-closed = தவறான DoenetML: `{ $tag }` குறிச்சொல் மூடப்படவில்லை (`/>` விடுபட்டது போலத் தெரிகிறது).

parse-tag-invalid-attributes = தவறான DoenetML: `{ $tag }` குறிச்சொல் செல்லுபடியாகாது. அதன் பண்புகள் தவறாக இருக்கலாம்.

parse-close-tag-name-missing = தவறான DoenetML: பெயரில்லாத ஒரு மூடும் குறிச்சொல் காணப்பட்டது, எ.கா. `</`

parse-attribute-value-unquoted = பண்பு மதிப்புகள் மேற்கோள் குறிகளுக்குள் இருக்க வேண்டும்: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = தவறான DoenetML: `{ $tag }` என்ற மூடும் குறிச்சொல் காணப்பட்டது, ஆனால் அதற்கிணையான திறக்கும் குறிச்சொல் இல்லை

parse-close-tag-mismatched = தவறான DoenetML: மூடும் குறிச்சொல் பொருந்தவில்லை. `</{ $expected }>` எதிர்பார்க்கப்பட்டது. `{ $found }` காணப்பட்டது

parser-node-unconvertible = { $node } என்ற முனையை Dast முனையாக மாற்ற முடியவில்லை.

## Names

name-attribute-invalid =
    தவறான பண்பு name='{ $name }'. { $reason ->
        [characters] பெயர்களில் எழுத்துகள், எண்கள், அடிக்கோடுகள் அல்லது இடைக்கோடுகள் மட்டுமே இருக்க முடியும்.
       *[start] பெயர்கள் ஒரு எழுத்தில் தொடங்க வேண்டும்.
    }

component-name-invalid-start = தவறான கூறுப் பெயர் "{ $name }". பெயர்கள் ஒரு எழுத்தில் தொடங்க வேண்டும்.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched வகை விடைக்கு ஒரு video பண்பு இருக்க வேண்டும்

answer-video-watched-video-not-reference = videoWatched வகை விடையின் video பண்பு ஒரு மேற்கோளாக இருக்க வேண்டும்

answer-name-not-single-text = விடையின் name பண்புக்கு ஒரே ஒரு text சேய் இருக்க வேண்டும்

## Referencing another document

external-doenetml-recursion-limit = மிக அதிக அளவு சுழல்நிலை காரணமாக வெளிப்புற DoenetML ஐப் பெற முடியவில்லை. சுழல் மேற்கோள் ஏதேனும் உள்ளதா?

external-doenetml-unavailable = { $attribute }="{ $uri }" இலிருந்து DoenetML ஐப் பெற முடியவில்லை

external-doenetml-type-mismatch = { $attribute }="{ $uri }" இலிருந்து பெறப்பட்ட DoenetML தவறானது: அது "{ $componentType }" என்ற கூறு வகையுடன் பொருந்தவில்லை

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` பண்பு நீக்கப்பட உள்ளது; அதற்குப் பதிலாக `{ $to }` ஐப் பயன்படுத்தவும்.
       *[other] [deprecation] `<{ $component }>` இல் உள்ள `{ $from }` பண்பு நீக்கப்பட உள்ளது; அதற்குப் பதிலாக `{ $to }` ஐப் பயன்படுத்தவும்.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` ம் குறிப்பிடப்பட்டிருப்பதால் `{ $from }` பண்பு நீக்கப்பட உள்ளது, புறக்கணிக்கப்படுகிறது.
       *[other] [deprecation] `{ $to }` ம் குறிப்பிடப்பட்டிருப்பதால் `<{ $component }>` இல் உள்ள `{ $from }` பண்பு நீக்கப்பட உள்ளது, புறக்கணிக்கப்படுகிறது.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` இல் உள்ள `{ $attribute }` பண்பு நீக்கப்பட உள்ளது, புறக்கணிக்கப்படுகிறது.


## Language coverage

pluralize-english-only = `<pluralize>` ஆல் ஆங்கிலத்தை மட்டுமே பன்மையாக்க முடியும், எனவே { $locale } மொழியில் எழுதப்பட்ட ஆவணத்தில் அதன் உரை மாற்றப்படாமல் விடப்படுகிறது. பன்மை வடிவத்தை நேரடியாக எழுதவும், அல்லது `pluralForm` பண்பால் அமைக்கவும்.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` என்பது அறியப்பட்ட Doenet கூறு அல்ல.

schema-element-not-allowed-at-root = ஆவணத்தின் வேரில் `<{ $tag }>` கூறு அனுமதிக்கப்படவில்லை.

schema-element-not-allowed-inside = `<{ $parent }>` இனுள் `<{ $tag }>` கூறு அனுமதிக்கப்படவில்லை.

schema-attribute-unrecognized = `<{ $tag }>` கூறுக்கு `{ $attribute }` என்ற பண்பு இல்லை.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` கூறின் `{ $attribute }` பண்பு, ஒவ்வொரு உறுப்பும் பின்வருவனவற்றுள் ஒன்றாக இருக்கும் பட்டியலாக இருக்க வேண்டும்: { $allowed }
       *[other] `<{ $tag }>` கூறின் `{ $attribute }` பண்பு பின்வருவனவற்றுள் ஒன்றாக இருக்க வேண்டும்: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select க்குத் தவறான வகைமாதிரிப் பெயர். வகைமாதிரிப் பெயர் { $variantName } ஆனது { $numOptions } விருப்பங்களில் வருகிறது, ஆனால் தேர்ந்தெடுக்க வேண்டிய எண்ணிக்கை { $numToSelect }.

select-variant-name-without-options = select க்குச் சில வகைமாதிரிகள் குறிப்பிடப்பட்டுள்ளன, ஆனால் சாத்தியமான வகைமாதிரிப் பெயருக்கு விருப்பங்கள் எதுவும் குறிப்பிடப்படவில்லை: { $variantName }.

select-variant-name-not-possible = select க்குக் குறிப்பிடப்பட்ட வகைமாதிரிப் பெயர் { $variantName } ஒரு சாத்தியமான வகைமாதிரிப் பெயர் அல்ல.

select-too-few-options = { $numOptions } கூறுகளிலிருந்து { $numToSelect } கூறுகளைத் தேர்ந்தெடுக்க முடியாது.

select-from-sequence-too-few-values = { $length } நீளமுள்ள தொடரிலிருந்து { $numToSelect } மதிப்புகளைத் தேர்ந்தெடுக்க முடியாது.

select-from-sequence-indices-count-mismatch = select க்குக் குறிப்பிடப்பட்ட குறியீட்டெண்களின் எண்ணிக்கை, தேர்ந்தெடுக்க வேண்டிய எண்ணிக்கையுடன் பொருந்த வேண்டும்

select-from-sequence-indices-not-integers = select க்குக் குறிப்பிடப்பட்ட அனைத்துக் குறியீட்டெண்களும் முழு எண்களாக இருக்க வேண்டும்

select-from-sequence-index-excluded = விலக்கப்பட்ட ஒரு selectfromsequence குறியீட்டெண் குறிப்பிடப்பட்டுள்ளது

select-from-sequence-indices-excluded-combination = விலக்கப்பட்ட ஒரு சேர்க்கையாக இருந்த selectfromsequence குறியீட்டெண்கள் குறிப்பிடப்பட்டுள்ளன

select-from-sequence-coprime-not-positive-integers = நேர் முழு எண்கள் தேர்ந்தெடுக்கப்படாததால் சார்பகா எண் சேர்க்கைகளைத் தேர்ந்தெடுக்க முடியாது.

select-from-sequence-coprime-common-factor = சார்பகா எண்களைத் தேர்ந்தெடுக்க முடியாது. சாத்தியமான அனைத்து மதிப்புகளுக்கும் ஒரு பொதுக் காரணி உள்ளது. ("from" அல்லது "to" இன் குறிப்பிட்ட மதிப்புகள் "step" உடன் சார்பகா எண்களாக இருக்க வேண்டும்.)

select-from-sequence-coprime-single-number = 1 அல்லாத ஒரே ஒரு எண்ணிலிருந்து சார்பகா எண் சேர்க்கைகளைத் தேர்ந்தெடுக்க முடியாது.

select-from-sequence-excluded-too-many-combinations = selectFromSequence இல் 70% க்கும் மேற்பட்ட சேர்க்கைகள் விலக்கப்பட்டுள்ளன

select-from-sequence-coprime-none-found = சார்பகா எண்களைத் தேர்ந்தெடுக்க முடியவில்லை. சாத்தியமான அனைத்து மதிப்புகளுக்கும் ஒரு பொதுக் காரணி உள்ளது.

select-from-sequence-too-few-unique-values = { $numPossibleValues } நீளமுள்ள தொடரிலிருந்து { $numToSelect } தனித்த மதிப்புகளைத் தேர்ந்தெடுக்க முடியாது

select-prime-numbers-too-few-values = { $numValues } நீளமுள்ள பகா எண் பட்டியலிலிருந்து { $numToSelect } மதிப்புகளைத் தேர்ந்தெடுக்க முடியாது

select-prime-numbers-values-count-mismatch = select க்குக் குறிப்பிடப்பட்ட மதிப்புகளின் எண்ணிக்கை, தேர்ந்தெடுக்க வேண்டிய எண்ணிக்கையுடன் பொருந்த வேண்டும்

select-prime-numbers-values-not-prime = select prime number க்குக் குறிப்பிடப்பட்ட அனைத்து மதிப்புகளும் பகா எண் பட்டியலில் இருக்க வேண்டும்

select-prime-numbers-values-excluded-combination = selectPrimeNumbers க்குக் குறிப்பிடப்பட்ட மதிப்புகள் விலக்கப்பட்ட ஒரு சேர்க்கையாக இருந்தன

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers இல் 70% க்கும் மேற்பட்ட சேர்க்கைகள் விலக்கப்பட்டுள்ளன

select-random-combination-fluke = மிக அரிதான தற்செயலால், சமவாய்ப்பு மதிப்புகளின் சேர்க்கையைத் தேர்ந்தெடுக்க முடியவில்லை

select-random-value-fluke = மிக அரிதான தற்செயலால், சமவாய்ப்பு மதிப்பைத் தேர்ந்தெடுக்க முடியவில்லை
