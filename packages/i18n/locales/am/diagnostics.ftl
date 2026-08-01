# Amharic diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
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

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = ሁለት ጫፎች ሲገለጹ { $attributes } ችላ ይባላል

line-segment-attributes-ignored-with-endpoint-and-midpoint = ጫፍና መካከለኛ ነጥብ አብረው ሲገለጹ { $attributes } ችላ ይባላል

line-segment-midpoint-offset-without-midpoint = መካከለኛ ነጥብ ከሌለ midpointOffset ውጤት የለውም

## `<line>`

line-points-undetermined-dimensions = ልኬታቸው ባልታወቁ ነጥቦች የሚያልፍ መስመር።

line-points-too-few-dimensions = መስመሩ ቢያንስ ባለሁለት ልኬት ነጥቦች ማለፍ አለበት።

line-points-depend-on-variables = መስመሩ በተለዋዋጮች በሚመሠረቱ ነጥቦች ያልፋል፦ { $variables }።

line-equation-invalid-format = በተለዋዋጮች { $variable1 } እና { $variable2 } የተጻፈው የመስመር ቀመር ቅርጸት ልክ አይደለም።

## `<ray>`

ray-overprescribed-through = ጨረሩ በthrough፣ endpoint እና direction በአንድ ጊዜ ተወስኗል። የተገለጸው through ችላ ተብሏል።

ray-dimension-mismatch = በጨረሩ ውስጥ numDimensions አይመሳሰሉም።

## `<vector>`

vector-overprescribed-head = ቬክተሩ በhead፣ tail እና displacement በአንድ ጊዜ ተወስኗል። የተገለጸው head ችላ ተብሏል።

vector-dimension-mismatch = በቬክተሩ ውስጥ numDimensions አይመሳሰሉም።

## Attracting and constraining

attract-to-without-nearest-point = ወደ `<{ $component }>` መሳብ አይቻልም፤ የnearestPoint የሁኔታ ተለዋዋጭ የለውም።

constrain-to-without-nearest-point = በ`<{ $component }>` መገደብ አይቻልም፤ የnearestPoint የሁኔታ ተለዋዋጭ የለውም።

constrain-to-interior-without-nearest-point = በ`<{ $component }>` ውስጠኛ ክፍል መገደብ አይቻልም፤ የnearestPoint የሁኔታ ተለዋዋጭ የለውም።

## `<choiceInput>`

choice-input-label-position-ignored = ኢንላይን ላልሆነ choiceInput labelPosition ችላ ይባላል

## Ordering children by index

choice-input-indices-count-mismatch = የindices ብዛት ከchoice ልጆች ብዛት ጋር ስለማይመሳሰል ለchoiceInput የተገለጹት indices ችላ ተብለዋል።

pretzel-indices-count-mismatch = የindices ብዛት ከproblem ልጆች ብዛት ጋር ስለማይመሳሰል ለproblem የተገለጹት indices ችላ ተብለዋል።

shuffle-indices-count-mismatch = የindices ብዛት ከአካላት ብዛት ጋር ስለማይመሳሰል ለshuffle የተገለጹት indices ችላ ተብለዋል።

indices-ignored-out-of-range = አንዳንድ ጠቋሚዎች ከክልል ውጭ ስለሆኑ ለ{ $component } የተገለጹት indices ችላ ተብለዋል።

pretzel-indices-repeated = አንዳንድ ጠቋሚዎች ስለተደጋገሙ ለpretzel የተገለጹት indices ችላ ተብለዋል።

pretzel-circuit-first-index = በcircuit ሁነታ የመጀመሪያው ጠቋሚ 1 መሆን ስላለበት ለpretzel የተገለጹት indices ችላ ተብለዋል።

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` ከጽሑፍ ልጆች ጋር እንዲሠራ የ`type` ባሕርይ መገለጽ አለበት።

invalid-type-defaulting-to-math = ለ{ $component } አካል ዓይነት { $type } ልክ አይደለም። math፣ text፣ number ወይም boolean መሆን አለበት። math ጥቅም ላይ ውሏል።

string-not-valid-component-to-arrange = ጽሑፍ "{ $value }" ለ{ $component } ትክክለኛ አካል አይደለም። ችላ ተብሏል።

## Types and variables

invalid-type-defaulting-to-number = ዓይነት { $type } ልክ አይደለም፤ ዓይነቱ ወደ number ተቀይሯል።

invalid-variable-value = የተለዋዋጭ እሴት ልክ አይደለም፦ `{ $value }`

## Variants

variant-index-must-be-number = የዓይነት ጠቋሚ { $index } ቁጥር መሆን አለበት

variant-index-must-be-integer = የዓይነት ጠቋሚ { $index } ኢንቲጀር መሆን አለበት

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ለፍጹም ልኬቶች አልተተገበረም። ስፋቶቹ ወደ አንጻራዊ ተቀይረዋል።

side-by-side-absolute-margins = `<{ $component }>` ለፍጹም ልኬቶች አልተተገበረም። ኅዳጎቹ ወደ አንጻራዊ ተቀይረዋል።

side-by-side-no-block-child = ልክ ያልሆነ `<{ $component }>`፦ ቢያንስ አንድ የብሎክ ልጅ ሊኖረው ይገባል።

## `<label>`

label-for-ignored-on-graphical = በሥዕላዊ `<label>` ላይ ያለው `for` ባሕርይ ችላ ይባላል።

label-for-must-resolve-to-one = በ`<label>` ላይ ያለው `for` ባሕርይ በትክክል ወደ አንድ አካል መድረስ አለበት።

label-for-unresolved = በ`<label>` ላይ ያለው `for` ባሕርይ ወደ አካል ሊደርስ አልቻለም።

label-for-answer-with-authored-inputs = በ`<label>` ላይ ያለው `for` ባሕርይ ግቤቶቹ በግልጽ የተጻፉለትን `<answer>` ያመለክታል፤ በቀጥታ ግቤቱን ያመልክቱ።

label-for-answer-without-input = በ`<label>` ላይ ያለው `for` ባሕርይ መለያ የሚሰጠው ግቤት የሌለውን `<answer>` ያመለክታል።

label-for-must-reference-input-or-answer = በ`<label>` ላይ ያለው `for` ባሕርይ ግቤትን ወይም መልስን ማመልከት አለበት።

## Accessibility

accessibility-short-description-or-decorative = ለተደራሽነት ሲባል `<{ $component }>` አጭር መግለጫ ሊኖረው ወይም እንደ ጌጥ መገለጽ አለበት።

accessibility-video-short-description = ለተደራሽነት ሲባል `<video>` አጭር መግለጫ ሊኖረው ይገባል።

accessibility-input-short-description-or-label = ለተደራሽነት ሲባል `<{ $component }>` አጭር መግለጫ ወይም መለያ ሊኖረው ይገባል።

accessibility-answer-input-short-description-or-label = ለተደራሽነት ሲባል ግቤት የሚፈጥር `<answer>` አጭር መግለጫ ወይም መለያ ሊኖረው ይገባል።

accessibility-short-description-contains-math = አጭር መግለጫዎች እንደ `<{ $component }>` ያሉ የሒሳብ አካላትን መያዝ የለባቸውም። ሒሳቡን በቃላት ይግለጹ።

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ለክፍል ርዕስ ጽሑፍ በቂ ንጽጽር የለውም (ጨለማ ሁነታ) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1፤ ቢያንስ { $threshold }:1 ያስፈልጋል)።
       *[other] { $colorName } ለክፍል ርዕስ ጽሑፍ በቂ ንጽጽር የለውም ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1፤ ቢያንስ { $threshold }:1 ያስፈልጋል)።
    }

## `<circle>`

circle-through-points-non-numerical = ነጥቦቹ ቁጥራዊ እሴት በሌላቸው ጊዜ በ{ $count } ነጥቦች የሚያልፍ `<circle>` ገና አልተተገበረም።

circle-too-many-through-points = ከ3 በላይ ነጥቦች የሚያልፍ ክብ ማስላት አይቻልም።

circle-overprescribed-radius-center-points = ራዲየስ፣ ማዕከልና የሚያልፍባቸው ነጥቦች በአንድ ጊዜ ሲገለጹ ክብ ማስላት አይቻልም።

circle-center-with-multiple-points = የተገለጸ ማዕከል ያለውና ከ1 በላይ ነጥብ የሚያልፍ ክብ ማስላት አይቻልም።

circle-radius-too-small = ክቡን ማስላት አይቻልም፦ በሁለቱ ነጥቦች መካከል ያለው ርቀት { $distance } ስለሆነ የተገለጸው ራዲየስ { $radius } በጣም ትንሽ ነው።

circle-radius-with-many-points = በተገለጸ ራዲየስ ከሁለት በላይ ነጥቦች የሚያልፍ ክብ መፍጠር አይቻልም።

circle-invalid-center-or-through-points = የክቡ ማዕከል ወይም የሚያልፍባቸው ነጥቦች ልክ አይደሉም።

circle-radius-center-with-multiple-points = የተገለጸ ማዕከል ያለውና ከ1 በላይ ነጥብ የሚያልፍ ክብ ራዲየስ ማስላት አይቻልም።

circle-change-radius-non-numerical = የሚያልፍባቸው ነጥቦች ቁጥራዊ ያልሆኑ ክብ ራዲየስ መቀየር አይቻልም

circle-radius-with-points-non-numerical = ቁጥራዊ እሴቶች በሌሉበት፣ በተገለጸ ራዲየስ ከአንድ በላይ ነጥብ የሚያልፍ ክብ መፍጠር አይቻልም።

circle-change-center-non-numerical = ቁጥራዊ ባልሆኑ ነጥቦች የሚያልፍ ክብ ማዕከል መቀየር ገና አልተተገበረም።

## `<function>`

function-domain-insufficient-dimensions = የተግባሩ ጎራ ልኬቶች በቂ አይደሉም። ጎራው { $intervals } ክፍተቶች አሉት፣ ተግባሩ ግን { $inputs } ግቤቶች አሉት።

function-domain-invalid-format = የተግባሩ ጎራ ቅርጸት ልክ አይደለም።

function-ignoring-non-numerical =
    { $type ->
        [maximum] ቁጥራዊ ያልሆነውን የተግባር ከፍተኛ እሴት ችላ በማለት ላይ።
        [minimum] ቁጥራዊ ያልሆነውን የተግባር ዝቅተኛ እሴት ችላ በማለት ላይ።
        [extremum] ቁጥራዊ ያልሆነውን የተግባር ጫፍ እሴት ችላ በማለት ላይ።
        [point] ቁጥራዊ ያልሆነውን የተግባር ነጥብ ችላ በማለት ላይ።
        [slope] ቁጥራዊ ያልሆነውን የተግባር ተዳፋት ችላ በማለት ላይ።
       *[other] ቁጥራዊ ያልሆነውን የተግባር { $type } ችላ በማለት ላይ።
    }

function-ignoring-empty =
    { $type ->
        [maximum] ባዶ የሆነውን የተግባር ከፍተኛ እሴት ችላ በማለት ላይ።
        [minimum] ባዶ የሆነውን የተግባር ዝቅተኛ እሴት ችላ በማለት ላይ።
        [extremum] ባዶ የሆነውን የተግባር ጫፍ እሴት ችላ በማለት ላይ።
        [point] ባዶ የሆነውን የተግባር ነጥብ ችላ በማለት ላይ።
       *[other] ባዶ የሆነውን የተግባር { $type } ችላ በማለት ላይ።
    }

function-points-too-close = ተግባሩ በጣም የተቀራረቡ ሁለት ነጥቦች አሉት። ተግባሩን መግለጽ አይቻልም።

function-iterates-input-output-mismatch = የተግባር ድግግሞሽ የሚቻለው የግቤቶች ብዛት ከውጤቶች ብዛት ጋር ሲተካከል ብቻ ነው። ይህ ተግባር { $inputs } ግቤቶችና { $outputs } ውጤቶች አሉት።

## `<sequence>`

sequence-invalid-length = የተከታታዩ ርዝመት ልክ አይደለም። አሉታዊ ያልሆነ ኢንቲጀር መሆን አለበት።

sequence-invalid-step = የተከታታዩ ርምጃ ልክ አይደለም። ለ{ $type } ዓይነት ተከታታይ ቁጥር መሆን አለበት።

sequence-invalid-endpoint-number = የቁጥር ተከታታይ "{ $attribute }" ልክ አይደለም። ቁጥር መሆን አለበት።

sequence-invalid-endpoint-letters = የፊደል ተከታታይ "{ $attribute }" ልክ አይደለም። የፊደላት ጥምረት መሆን አለበት።

sequence-invalid-endpoint = የተከታታዩ "{ $attribute }" ልክ አይደለም።

select-from-sequence-coprime-not-numbers = ቁጥሮች ስላልተመረጡ coprime ችላ ተብሏል

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations ስለተገለጸ coprime ችላ ተብሏል

## Resolving a `target`

target-not-found = ለ`<{ $source }>` target ልክ አይደለም፦ ዒላማው አልተገኘም።

target-state-variable-not-found = ለ`<{ $source }>` target ልክ አይደለም፦ በ`<{ $component }>` ላይ "{ $property }" የተባለ የሁኔታ ተለዋዋጭ አልተገኘም።

## `<odeSystem>`

ode-system-variables-match-independent = የ`<odeSystem>` ተለዋዋጮች ከነጻው ተለዋዋጭ የተለዩ መሆን አለባቸው።

ode-system-duplicate-variable-names = በተደጋገሙ ጥገኛ ተለዋዋጭ ስሞች የODE የቀኝ ወገን ተግባራትን መግለጽ አይቻልም።

ode-system-rhs-function-error = የODE የቀኝ ወገን ተግባርን መግለጽ አይቻልም። የmathjs ተግባር ሲፈጠር ስህተት ተከስቷል።

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = በ{ $count } መስመሮች መካከል ያለውን ማዕዘን መግለጽ አይቻልም

angle-invalid-through-point = በ`<angle>` through ውስጥ ልክ ያልሆነ ነጥብ አለ

parabola-vertex-too-many-points = የተገለጸ ጫፍ ያለውና ከ1 በላይ ነጥብ የሚያልፍ ፓራቦላ ገና አልተተገበረም።

parabola-too-many-points = ከ3 በላይ ነጥቦች የሚያልፍ ፓራቦላ ገና አልተተገበረም።

intersection-too-many-items = ከሁለት በላይ ነገሮች መገናኛ ገና አልተተገበረም

## Other math components

ionic-compound-not-two-ions = ከሁለት አዮን ውጭ ላለ አዮኒክ ውህድ ገና አልተተገበረም።

ionic-compound-needs-cation-and-anion = አዮኒክ ውህድ የተተገበረው ለአንድ አዎንታዊ አዮን እና ለአንድ አሉታዊ አዮን ብቻ ነው።

solve-equations-cannot-evaluate = ቀመሩ ሊሰላ ስላልቻለ መፍታት አይቻልም፦ { $equation }

math-operators-operand-number-required = የሒሳብ ኦፐራንድ ሲወጣ operandNumber መገለጽ አለበት።

eigen-decomposition-failed = የማትሪክሱ ባሕርያዊ እሴቶች ሊሰሉ አልቻሉም

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`፦ ግቤት { $parameters } በስርዓተ ጥለቱ ውስጥ ስለማይገኝ ሁልጊዜ ባዶን ያዛምዳል።

## `<graph>`

graph-grid-invalid = `<graph>`፦ grid="{ $grid }" ሊተረጎም አልቻለም። none፣ medium፣ dense ወይም በክፍተት የተለያዩ ሁለት አዎንታዊ ቁጥሮች መሆን አለበት፣ ለምሳሌ grid="1 0.5"። ፍርግርግ አይሳልም።

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`፦ በprefigure አሳያ ውስጥ xLabelPosition="left" አይደገፍም፤ የቀኝ ጎን ባሕርይ ጥቅም ላይ ውሏል።

prefigure-y-label-position-unsupported = `<graph>`፦ በprefigure አሳያ ውስጥ yLabelPosition="bottom" አይደገፍም፤ የላይኛው ጎን ባሕርይ ጥቅም ላይ ውሏል።

prefigure-invalid-axis-bounds = `<graph>`፦ ለprefigure ልወጣ የዘንጎች ወሰን ልክ አይደለም፤ ነባሪው bbox (-10,-10,10,10) ጥቅም ላይ ውሏል።

prefigure-invalid-width = `<graph>`፦ ለprefigure ልወጣ ስፋቱ ልክ አይደለም፤ ነባሪው የሥዕል ስፋት 425 ጥቅም ላይ ውሏል።

prefigure-invalid-aspect-ratio = `<graph>`፦ ለprefigure ልወጣ aspectRatio ልክ አይደለም፤ ነባሪው ጥምርታ 1 ጥቅም ላይ ውሏል።

prefigure-grid-spacing-too-fine = `<graph>`፦ ከዘንጎቹ ወሰን አንጻር የፍርግርጉ ክፍተት በጣም ጥብቅ ነው፤ በprefigure አሳያ ውስጥ ፍርግርጉ ተትቷል።

prefigure-annotations-not-rendered = `<graph>`፦ የPreFigure አሳያ ጥቅም ላይ ካልዋለ ማብራሪያዎች አይሳሉም።

multiple-annotations-children = በ`<graph>` ውስጥ በርካታ `<annotations>` ልጆች ተገኝተዋል፤ ከመጨረሻው በስተቀር ሁሉም ችላ ተብለዋል።

## Referring to other components

copy-unrecognized-component-type = ያልታወቀ የአካል ዓይነት ማስፋት ወይም መቅዳት አይቻልም፦ { $type }።

copy-prop-not-found = በ{ $component } ዓይነት አካል ላይ { $property } ባሕርይ አልተገኘም

collect-no-source = ለcollect ምንጭ አልተገኘም።

collect-invalid-component-type = `<{ $component }>` ትክክለኛ የአካል ዓይነት ስላልሆነ የዚህ ዓይነት አካላትን መሰብሰብ አይቻልም።

reference-index-unavailable = ጠቋሚ `{ $reference }` ማመልከት አይቻልም

## `<callAction>`

component-action-unavailable = በአካል `{ $reference }` ላይ { $action } መጥራት አይቻልም

## `<dataFrame>`

data-frame-inconsistent-row-lengths = የመረጃው ቅርጽ ልክ አይደለም። የረድፎቹ ርዝመት አይመሳሰልም። በcomponentIdx :{ $componentIdx } ተገኝቷል

data-frame-duplicate-column-names = መረጃው የተደጋገሙ የዓምድ ስሞች አሉት። በcomponentIdx :{ $componentIdx } ተገኝቷል

data-frame-missing-column-name = መረጃው የዓምድ ስም ይጎድለዋል። በcomponentIdx :{ $componentIdx } ተገኝቷል

## `<answer>` and scoring

answer-award-depends-on-own-response = የዚህ መልስ አንድ award በራሱ በanswer መለያ በተላከው መልስ ላይ የተመሠረተ ነው፤ ይህም ያልታሰበ ባሕርይ ያስከትላል።

answer-max-num-attempts-in-section-wide-check-work = የሙከራዎቹ ብዛት በያዥው ስለሚቆጣጠር፣ `sectionWideCheckWork` ባለው ያዥ ውስጥ ባለ `<answer>` ላይ `maxNumAttempts` ማስቀመጥ ውጤት የለውም። `maxNumAttempts` በያዥው ላይ ያስቀምጡ።

nested-section-wide-check-work-max-num-attempts = የሙከራዎቹ ብዛት በውጪኛው ያዥ ስለሚቆጣጠር፣ `sectionWideCheckWork` ባለው ሌላ ያዥ ውስጥ ባለ `sectionWideCheckWork` ያዥ ላይ `maxNumAttempts` ማስቀመጥ ውጤት የለውም። `maxNumAttempts` በውጪኛው ያዥ ላይ ያስቀምጡ።

answer-attributes-need-symbolic-equality = symbolicEquality ካልተቀመጠ የ{ $attributes } ባሕርይ ውጤት አይኖረውም።

answer-invalid-type = ለanswer ዓይነቱ ልክ አይደለም፦ { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = አካል `<{ $component }>` ስም ስለሌለው እንደ ሞጁል ባሕርይ ሊያገለግል አይችልም

module-attribute-name-already-defined = የአካል ዓይነት `<module>` አስቀድሞ "{ $name }" ባሕርይ ስለገለጸ አካል `<{ $component } name="{ $name }">` እንደ ሞጁል ባሕርይ ሊያገለግል አይችልም።

conditional-content-condition-ignored = case ወይም else ልጆች ባሉት `<conditionalContent>` አካል ላይ `condition` ባሕርይ ችላ ይባላል።

slider-markers-type-mismatch = የምልክቶቹ ዓይነት ከተንሸራታቹ ዓይነት ጋር አይመሳሰልም።

pretzel-problem-needs-statement-and-answer = ልክ ያልሆነ pretzel፦ እያንዳንዱ `<problem>` አንድ `<statement>` እና አንድ `<answer>` መያዝ አለበት።

pretzel-circuit-first-problem-distractor = ልክ ያልሆነ pretzel፦ በmode="circuit" የመጀመሪያው `<problem>` አሳሳች ምርጫ ሊሆን አይችልም።

## Attribute values

attribute-invalid-values = ለባሕርይ `{ $attribute }` እሴት { $values } ልክ አይደለም፤ ችላ ተብሏል።

attribute-must-be-references = ለባሕርይ `{ $attribute }` እሴት `{ $value }` ልክ አይደለም። ባሕርዩ በ`$` ከሚጀምሩ ማጣቀሻዎች መገንባት አለበት።

math-input-invalid-function-names = <mathInput>፦ በ{ $attribute } ውስጥ ልክ ያልሆኑ የተግባር ስሞች ችላ ተብለዋል፦ { $names }። የእያንዳንዱ ስም የሚታየው ክፍል ቢያንስ 2 ቁምፊዎች (ፊደላት ወይም ሰረዞች) ሊኖሩት ይገባል፤ ከዚያ በኋላ አማራጭ `|<mathspeak ተለዋጭ>` ቅጥያ ሊመጣ ይችላል።

## Building components from the source

component-type-invalid = የአካል ዓይነት ልክ አይደለም፦ `<{ $componentType }>`

attribute-repeated = ባሕርይ { $attribute } መደገም አይችልም።

attribute-invalid-for-component = ባሕርይ "{ $attribute }" ለ`<{ $componentType }>` ዓይነት አካል ልክ አይደለም።

## Style definition contrast

style-definition-insufficient-contrast =
    የቅጥ ትርጓሜ { $styleNumber } ለ{ $context ->
        [text-on-background] የጽሑፍ ቀለም ከዳራ ቀለም አንጻር
        [high-contrast] ከፍተኛ ንጽጽር ያለው ቀለም ከሸራው አንጻር
        [line] የመስመር ቀለም ከሸራው አንጻር
        [marker] የምልክት ቀለም ከሸራው አንጻር
       *[text-on-canvas] የጽሑፍ ቀለም ከሸራው አንጻር
    } በቂ ንጽጽር የለውም{ $mode ->
        [dark] { " (ጨለማ ሁነታ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1፤ ቢያንስ { $threshold }:1 ያስፈልጋል)።

style-definition-dark-mode-text-background-contrast =
    የቅጥ ትርጓሜ { $styleNumber } ለብርሃን ሁነታ በቂ ንጽጽር ያላቸውን ቀለሞች ቢገልጽም፣ ከእነዚህ እሴቶች የተገኙት የጨለማ ሁነታ ቀለሞች በጽሑፍ ቀለምና በዳራ ቀለም መካከል በቂ ንጽጽር የላቸውም ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1፤ ቢያንስ { $threshold }:1 ያስፈልጋል)። { $suggestion ->
        [available] በጨለማ ሁነታ በቂ ንጽጽር ለማረጋገጥ የብርሃን ሁነታውን ንጽጽር ይጨምሩ (ለምሳሌ { $lightAttribute }="{ $lightColor }" ያስቀምጡ) ወይም የጨለማ ሁነታውን ቀለም ይሽሩ (ለምሳሌ { $darkAttribute }="{ $darkColor }" ያስቀምጡ)።
       *[none] በጨለማ ሁነታ በቂ ንጽጽር ለማረጋገጥ የብርሃን ሁነታውን ንጽጽር ይጨምሩ ወይም የተገኙትን ቀለሞች በtextColorDarkMode እና/ወይም በbackgroundColorDarkMode ይሽሩ።
    }

style-definition-dark-mode-text-canvas-contrast =
    የቅጥ ትርጓሜ { $styleNumber } ለብርሃን ሁነታ በቂ ንጽጽር ያለው የጽሑፍ ቀለም ቢገልጽም፣ ከዚህ እሴት የተገኘው የጨለማ ሁነታ የጽሑፍ ቀለም ከሸራው አንጻር በቂ ንጽጽር የለውም ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1፤ ቢያንስ { $threshold }:1 ያስፈልጋል)። { $suggestion ->
        [available] በጨለማ ሁነታ በቂ ንጽጽር ለማረጋገጥ የብርሃን ሁነታውን ንጽጽር ይጨምሩ (ለምሳሌ textColor="{ $lightColor }" ያስቀምጡ) ወይም የጨለማ ሁነታውን ቀለም ይሽሩ (ለምሳሌ textColorDarkMode="{ $darkColor }" ያስቀምጡ)።
       *[none] በጨለማ ሁነታ በቂ ንጽጽር ለማረጋገጥ የብርሃን ሁነታውን ንጽጽር ይጨምሩ ወይም የተገኘውን ቀለም በtextColorDarkMode ይሽሩ።
    }

section-multiple-style-palettes = አንድ ክፍል አንድ <stylePalette> ብቻ መምረጥ ይችላል፤ የመጨረሻው ጥቅም ላይ ውሏል።

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect አሉታዊ ያልሆነ ኢንቲጀር ስላልሆነ የ{ $component } ልዩ ዓይነቶች ሊወሰኑ አይችሉም።

variant-num-to-select-not-constant-number = numToSelect ቋሚ ስላልሆነ የ{ $component } ልዩ ዓይነቶች ሊወሰኑ አይችሉም።

variant-with-replacement-not-constant-boolean = withReplacement ቋሚ የቡሊያን እሴት ስላልሆነ የ{ $component } ልዩ ዓይነቶች ሊወሰኑ አይችሉም።

variant-select-weight-disables-unique = አንድ ምርጫ selectWeight ወይም selectForVariants ከገለጸ የselect ልዩ ዓይነቶች ይሰናከላሉ

variant-coprime-undetermined = coprime ሁልጊዜ ሐሰት መሆኑ ስላልተረጋገጠ የ{ $component } ልዩ ዓይነቶች ሊወሰኑ አይችሉም።

variant-attribute-not-constant = { $attribute } ቋሚ ስላልሆነ የ{ $component } ልዩ ዓይነቶች ሊወሰኑ አይችሉም።

variant-attribute-not-number = { $attribute } ቁጥር ስላልሆነ የ{ $component } ልዩ ዓይነቶች ሊወሰኑ አይችሉም።

variant-attribute-wrong-type-for-sequence =
    { $attribute } { $expected ->
        [letters-combination] የፊደላት ጥምረት
        [math-expression] ትክክለኛ የሒሳብ አገላለጽ
        [integer] ኢንቲጀር
       *[number] ቁጥር
    } ስላልሆነ የ{ $type } ዓይነት { $component } ልዩ ዓይነቶች ሊወሰኑ አይችሉም።

variant-length-not-integer = length ኢንቲጀር ስላልሆነ የ{ $component } ልዩ ዓይነቶች ሊወሰኑ አይችሉም።

variant-sort-not-implemented = sort ያለው { $component } ልዩ ዓይነቶች ገና አልተተገበሩም

variant-exclude-combinations-not-implemented = excludeCombinations ያለው { $component } ልዩ ዓይነቶች ገና አልተተገበሩም

variant-math-exclude-not-implemented = exclude ያለው የmath ዓይነት { $component } ልዩ ዓይነቶች ገና አልተተገበሩም

variant-non-constant-exclude-not-implemented = ቋሚ ያልሆነ exclude ያለው { $component } ልዩ ዓይነቶች ገና አልተተገበሩም

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }፦ በግራፍ prefigure አሳያ ውስጥ አይደገፍም፤ ዘሩ ተዘሏል።

prefigure-descendant-invalid-geometry = { $subject }፦ ጂኦሜትሪው ውሱን ያልሆነ ወይም ያልተሟላ ነው፤ ዘሩ ተዘሏል።

prefigure-curve-label-omitted = { $subject }፦ በተለወጡ የጠምዛዛ አካላት ላይ መለያዎች አይደገፉም፤ መለያው ተትቷል።

prefigure-curve-unsupported-definition-type = { $subject }፦ የማይደገፍ የጠምዛዛ ተግባር ትርጓሜ ዓይነት '{ $definitionType }'፤ ዘሩ ተዘሏል።

prefigure-region-flip-functions-unsupported = { $subject }፦ በregionBetweenCurves ላይ የflipFunctions ባሕርይ አይደገፍም፤ ዘሩ ተዘሏል።

prefigure-region-non-formula-child = { $subject }፦ regionBetweenCurves የቀመር ዓይነት ንዑስ ተግባራትን ብቻ ይደግፋል፤ ዘሩ ተዘሏል።

prefigure-label-position-unsupported =
    { $subject }፦ ለ{ $labelKind ->
        [line-family] የመስመር ቤተሰብ መለያ
       *[point] የነጥብ መለያ
    } labelPosition '{ $labelPosition }' አይደገፍም፤ የPreFigure ነባሪ አሰላለፍ ጥቅም ላይ ውሏል።

prefigure-fill-style-unsupported = { $subject }፦ የመሙያ ቅጥ '{ $fillStyle }' በPreFigure አይደገፍም፤ ወደ ሙሉ መሙያ ተቀይሯል።

prefigure-line-style-unknown = { $subject }፦ ያልታወቀ የመስመር ቅጥ '{ $lineStyle }' ከPreFigure ውጤት ተትቷል።

prefigure-marker-style-mapped-to-diamond = { $subject }፦ የምልክት ቅጥ '{ $markerStyle }' ወደ PreFigure ቅጥ 'diamond' ተዛምዷል።

prefigure-marker-style-unsupported = { $subject }፦ የምልክት ቅጥ '{ $markerStyle }' በPreFigure አይደገፍም፤ ነባሪው ቅጥ ጥቅም ላይ ውሏል።

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`፦ `ref` ልክ አይደለም፤ ዒላማው ሊወሰን አልቻለም። ማብራሪያው ተትቷል።

annotation-ref-multiple-targets = `<annotation>`፦ `ref` ወደ በርካታ ዒላማዎች ደርሷል፤ የመጀመሪያው ዒላማ ጥቅም ላይ ውሏል።

annotation-ref-outside-graph = `<annotation>`፦ `ref` ልክ አይደለም፤ ዒላማው ከያዘው ግራፍ ውጭ ነው። ማብራሪያው ተትቷል።

annotation-ref-unsupported-target = `<annotation>`፦ `ref` ልክ አይደለም፤ በprefigure ልወጣ ውስጥ ዒላማው የሚደገፍ ሥዕላዊ ነገር አይደለም። ማብራሪያው ተትቷል።

annotation-text-missing = `<annotation>`፦ `text` ይጎድላል ወይም ባዶ ነው፤ ባዶ ጽሑፍ ወጥቷል።

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] ዑደታዊ ጥገኝነት ተገኝቷል።
       *[other] `<{ $componentType }>` አካልን የሚያካትት ዑደታዊ ጥገኝነት ተገኝቷል።
    }

reference-no-referent = ለማጣቀሻው ዒላማ አልተገኘም፦ `{ $reference }`

reference-multiple-referents = ለማጣቀሻው በርካታ ዒላማዎች ተገኝተዋል፦ `{ $reference }`

## Children that do not match

children-invalid-attribute-format = የ`<{ $componentType }>` ባሕርይ { $attribute } ቅርጸት ልክ አይደለም።

children-invalid = የ`<{ $componentType }>` ልጆች ልክ አይደሉም፦ ልክ ያልሆኑ ልጆች ተገኝተዋል፦ { $children }

## Falling back to a default

attribute-value-invalid-using-default = ለባሕርይ `{ $attribute }` እሴት `{ $value }` ልክ አይደለም፤ እሴት `{ $default }` ጥቅም ላይ ውሏል

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] የDoenetML ስሪት { $version } አልተገኘም።
       *[other] የDoenetML ስሪት { $version } አልተገኘም። ወደ ስሪት { $fallback } ተመልሷል
    }

## Reading the DoenetML

parse-invalid-doenetml = ልክ ያልሆነ DoenetML፦ { $content }

parse-tag-missing-close-tag = ልክ ያልሆነ DoenetML፦ መለያ `{ $tag }` መዝጊያ መለያ የለውም። ራሱን የሚዘጋ መለያ ወይም `</{ $tagName }>` መለያ ይጠበቅ ነበር።

parse-tag-error = ልክ ያልሆነ DoenetML፦ በመለያ `<{ $tagName }>` ውስጥ ስህተት አለ

parse-attribute-missing-value = ልክ ያልሆነ DoenetML፦ ባሕርይ `{ $attribute }` እሴት የጎደለው ይመስላል።

parse-attribute-invalid = ልክ ያልሆነ DoenetML፦ ባሕርይ `{ $attribute }` ልክ አይደለም

parse-attribute-value-invalid = ልክ ያልሆነ DoenetML፦ የባሕርይ እሴት `{ $value }` ልክ አይደለም

parse-attribute-value-quote-mismatch = ልክ ያልሆነ DoenetML፦ የባሕርይ እሴት `{ $value }` ልክ አይደለም። የጥቅስ ምልክቶቹ አይመሳሰሉም። አንድ `{ $quote }` የጎደለ ይመስላል

parse-open-tag-name-missing = ልክ ያልሆነ DoenetML፦ ስም የሌለው መለያ ተገኝቷል፣ ለምሳሌ `<`

parse-tag-not-closed = ልክ ያልሆነ DoenetML፦ መለያ `{ $tag }` አልተዘጋም (አንድ `>` የጎደለ ይመስላል)።

parse-self-closing-tag-name-missing = ልክ ያልሆነ DoenetML፦ ስም የሌለው መለያ ተገኝቷል `<{ $content }>`

parse-self-closing-tag-not-closed = ልክ ያልሆነ DoenetML፦ መለያ `{ $tag }` አልተዘጋም (`/>` የጎደለ ይመስላል)።

parse-tag-invalid-attributes = ልክ ያልሆነ DoenetML፦ መለያ `{ $tag }` ትክክል አይደለም። ባሕርያቱ ስህተት ሊኖራቸው ይችላል።

parse-close-tag-name-missing = ልክ ያልሆነ DoenetML፦ ስም የሌለው መዝጊያ መለያ ተገኝቷል፣ ለምሳሌ `</`

parse-attribute-value-unquoted = የባሕርይ እሴቶች በጥቅስ ምልክቶች መከበብ አለባቸው፦ `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = ልክ ያልሆነ DoenetML፦ መዝጊያ መለያ `{ $tag }` ተገኝቷል፣ ነገር ግን ተመሳሳይ መክፈቻ መለያ የለም

parse-close-tag-mismatched = ልክ ያልሆነ DoenetML፦ መዝጊያ መለያው አይመሳሰልም። `</{ $expected }>` ይጠበቅ ነበር። `{ $found }` ተገኝቷል

parser-node-unconvertible = ኖድ { $node } ወደ Dast ኖድ ሊለወጥ አልቻለም።

## Names

name-attribute-invalid =
    ባሕርይ name='{ $name }' ልክ አይደለም። { $reason ->
        [characters] ስሞች ፊደላትን፣ ቁጥሮችን፣ ከስር መስመርን ወይም ሰረዝን ብቻ ሊይዙ ይችላሉ።
       *[start] ስሞች በፊደል መጀመር አለባቸው።
    }

component-name-invalid-start = የአካል ስም "{ $name }" ልክ አይደለም። ስሞች በፊደል መጀመር አለባቸው።

## `<answer>` sugar

answer-video-watched-missing-video = የvideoWatched ዓይነት answer የvideo ባሕርይ ሊኖረው ይገባል

answer-video-watched-video-not-reference = የvideoWatched ዓይነት answer የvideo ባሕርዩ ማጣቀሻ መሆን አለበት

answer-name-not-single-text = የanswer name ባሕርይ አንድ የጽሑፍ ልጅ ብቻ ሊኖረው ይገባል

## Referencing another document

external-doenetml-recursion-limit = በጣም ብዙ የድግግሞሽ ደረጃዎች ስላሉ ውጫዊ DoenetML ማግኘት አልተቻለም። ዑደታዊ ማጣቀሻ ይኖር ይሆን?

external-doenetml-unavailable = ከ{ $attribute }="{ $uri }" DoenetML ማግኘት አልተቻለም

external-doenetml-type-mismatch = ከ{ $attribute }="{ $uri }" የተገኘው DoenetML ልክ አይደለም፦ ከአካል ዓይነት "{ $componentType }" ጋር አልተመሳሰለም

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] ባሕርይ `{ $from }` ከአገልግሎት ውጭ ነው፤ በምትኩ `{ $to }` ይጠቀሙ።
       *[other] [deprecation] በ`<{ $component }>` ላይ ያለው ባሕርይ `{ $from }` ከአገልግሎት ውጭ ነው፤ በምትኩ `{ $to }` ይጠቀሙ።
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` ደግሞ ስለተገለጸ ባሕርይ `{ $from }` ከአገልግሎት ውጭ ሆኖ ችላ ተብሏል።
       *[other] [deprecation] `{ $to }` ደግሞ ስለተገለጸ በ`<{ $component }>` ላይ ያለው ባሕርይ `{ $from }` ከአገልግሎት ውጭ ሆኖ ችላ ተብሏል።
    }

deprecated-attribute-ignored = [deprecation] በ`<{ $component }>` ላይ ያለው ባሕርይ `{ $attribute }` ከአገልግሎት ውጭ ሆኖ ችላ ተብሏል።


## Language coverage

pluralize-english-only = `<pluralize>` የእንግሊዝኛን ብዙ ቁጥር ብቻ መሥራት ስለሚችል፣ በ{ $locale } በተጻፈ ሰነድ ውስጥ ጽሑፉ ሳይለወጥ ይቀራል። የብዙ ቁጥር ቅርጹን በቀጥታ ይጻፉ፣ ወይም በ`pluralForm` ባሕርይ ይግለጹ።


## Checking against the schema

schema-element-unrecognized = አካል `<{ $tag }>` የሚታወቅ የDoenet አካል አይደለም።

schema-element-not-allowed-at-root = አካል `<{ $tag }>` በሰነዱ ሥር ላይ አይፈቀድም።

schema-element-not-allowed-inside = አካል `<{ $tag }>` በ`<{ $parent }>` ውስጥ አይፈቀድም።

schema-attribute-unrecognized = አካል `<{ $tag }>` `{ $attribute }` የተባለ ባሕርይ የለውም።

schema-attribute-value-not-allowed =
    { $isList ->
        [true] የአካል `<{ $tag }>` ባሕርይ `{ $attribute }` እያንዳንዱ ንጥል ከሚከተሉት አንዱ የሆነ ዝርዝር መሆን አለበት፦ { $allowed }
       *[other] የአካል `<{ $tag }>` ባሕርይ `{ $attribute }` ከሚከተሉት አንዱ መሆን አለበት፦ { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = ለselect የዓይነት ስሙ ልክ አይደለም። የዓይነት ስም { $variantName } በ{ $numOptions } ምርጫዎች ውስጥ ይገኛል፣ የሚመረጠው ብዛት ግን { $numToSelect } ነው።

select-variant-name-without-options = ለselect ዓይነቶች ተገልጸዋል፣ ነገር ግን ለሚቻለው የዓይነት ስም ምርጫዎች የሉም፦ { $variantName }።

select-variant-name-not-possible = ለselect የተገለጸው የዓይነት ስም { $variantName } ሊሆን የሚችል የዓይነት ስም አይደለም።

select-too-few-options = ከ{ $numOptions } አካላት ብቻ { $numToSelect } መምረጥ አይቻልም።

select-from-sequence-too-few-values = ርዝመቱ { $length } ከሆነ ተከታታይ { $numToSelect } እሴቶች መምረጥ አይቻልም።

select-from-sequence-indices-count-mismatch = ለselect የተገለጹት ጠቋሚዎች ብዛት ከሚመረጠው ብዛት ጋር መመሳሰል አለበት

select-from-sequence-indices-not-integers = ለselect የተገለጹት ጠቋሚዎች ሁሉ ኢንቲጀሮች መሆን አለባቸው

select-from-sequence-index-excluded = ለselectfromsequence የተገለጸው ጠቋሚ የተገለለ ነበር

select-from-sequence-indices-excluded-combination = ለselectfromsequence የተገለጹት ጠቋሚዎች የተገለለ ጥምረት ነበሩ

select-from-sequence-coprime-not-positive-integers = አዎንታዊ ኢንቲጀሮች ስላልተመረጡ የcoprime ጥምረቶች መምረጥ አይቻልም።

select-from-sequence-coprime-common-factor = coprime ቁጥሮች መምረጥ አይቻልም። ሁሉም ሊሆኑ የሚችሉ እሴቶች የጋራ አካፋይ አላቸው። (የተገለጹት "from" ወይም "to" እሴቶች ከ"step" ጋር coprime መሆን አለባቸው።)

select-from-sequence-coprime-single-number = ከ1 የተለየ ከአንድ ነጠላ ቁጥር የcoprime ጥምረቶች መምረጥ አይቻልም።

select-from-sequence-excluded-too-many-combinations = በselectFromSequence ውስጥ ከ70% በላይ ጥምረቶች ተገልለዋል

select-from-sequence-coprime-none-found = coprime ቁጥሮች መምረጥ አልተቻለም። ሁሉም ሊሆኑ የሚችሉ እሴቶች የጋራ አካፋይ አላቸው።

select-from-sequence-too-few-unique-values = ርዝመቱ { $numPossibleValues } ከሆነ ተከታታይ { $numToSelect } የተለያዩ እሴቶች መምረጥ አይቻልም

select-prime-numbers-too-few-values = ርዝመቱ { $numValues } ከሆነ የቀዳሚ ቁጥሮች ዝርዝር { $numToSelect } እሴቶች መምረጥ አይቻልም

select-prime-numbers-values-count-mismatch = ለselect የተገለጹት እሴቶች ብዛት ከሚመረጠው ብዛት ጋር መመሳሰል አለበት

select-prime-numbers-values-not-prime = ለselect prime number የተገለጹት እሴቶች ሁሉ በቀዳሚ ቁጥሮች ዝርዝር ውስጥ መሆን አለባቸው

select-prime-numbers-values-excluded-combination = ለselectPrimeNumbers የተገለጹት እሴቶች የተገለለ ጥምረት ነበሩ

select-prime-numbers-excluded-too-many-combinations = በselectPrimeNumbers ውስጥ ከ70% በላይ ጥምረቶች ተገልለዋል

select-random-combination-fluke = እጅግ ባልተጠበቀ አጋጣሚ የዘፈቀደ እሴቶች ጥምረት መምረጥ አልተቻለም

select-random-value-fluke = እጅግ ባልተጠበቀ አጋጣሚ የዘፈቀደ እሴት መምረጥ አልተቻለም
