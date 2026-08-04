# Tigrinya diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# own source. Ge'ez reads left to right, so those Latin runs need no direction
# mark to sit where they are written.
#
# Where English separates a singular from a plural only in the verb — "is
# ignored" against "are ignored" — Tigrinya agrees its verb with a subject that
# is a list either way, so those selects are dropped and the count argument
# goes unused.
#
# The full stop is «።» and the comma «፡», which is why no sentence here ends in
# a Latin period.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = ክልቲኦም መወዳእታ ነጥብታት ምስ ተገለጹ { $attributes } ኣይግድሱን

line-segment-attributes-ignored-with-endpoint-and-midpoint = መወዳእታ ነጥብን ማእከላይ ነጥብን ክልቲኦም ምስ ተገለጹ { $attributes } ኣይግድሱን

line-segment-midpoint-offset-without-midpoint = ማእከላይ ነጥቢ ብዘይብሉ midpointOffset ውጽኢት የብሉን

## `<line>`

line-points-undetermined-dimensions = እቲ መስመር ብዘይተፈልጠ ዓቐን ዘለዎም ነጥብታት ይሓልፍ።

line-points-too-few-dimensions = እቲ መስመር እንተ ወሓደ ክልተ ዓቐን ብዘለዎም ነጥብታት ክሓልፍ ኣለዎ።

line-points-depend-on-variables = እቲ መስመር ኣብ ተለዋወጥቲ ዝምርኮሱ ነጥብታት ይሓልፍ፡ { $variables }።

line-equation-invalid-format = ኣብ ተለዋወጥቲ { $variable1 } ከምኡ'ውን { $variable2 } ንዘሎ ማዕረነት መስመር እቲ ቅርጺ ቅቡል ኣይኮነን።

## `<ray>`

ray-overprescribed-through = እቲ ጩራ ብ through፡ endpoint ከምኡ'ውን direction ብሓባር ተገሊጹ። እቲ እተገልጸ through ኣይግደስን።

ray-dimension-mismatch = numDimensions ኣብቲ ጩራ ኣይሰማምዕን።

## `<vector>`

vector-overprescribed-head = እቲ ቬክተር ብ head፡ tail ከምኡ'ውን displacement ብሓባር ተገሊጹ። እቲ እተገልጸ head ኣይግደስን።

vector-dimension-mismatch = numDimensions ኣብቲ ቬክተር ኣይሰማምዕን።

## Attracting and constraining

attract-to-without-nearest-point = ናብ `<{ $component }>` ክስሓብ ኣይክእልን ምኽንያቱ ተለዋዋጢ ኩነታት nearestPoint የብሉን።

constrain-to-without-nearest-point = ናብ `<{ $component }>` ክግደድ ኣይክእልን ምኽንያቱ ተለዋዋጢ ኩነታት nearestPoint የብሉን።

constrain-to-interior-without-nearest-point = ኣብ ውሽጢ `<{ $component }>` ክግደድ ኣይክእልን ምኽንያቱ ተለዋዋጢ ኩነታት nearestPoint የብሉን።

## `<choiceInput>`

choice-input-label-position-ignored = ኣብ ሓደ መስመር ዘይኮነ choiceInput labelPosition ኣይግደስን

## Ordering children by index

choice-input-indices-count-mismatch = ንchoiceInput እተገልጹ መወከሲታት ኣይግደሱን ምኽንያቱ ብዝሒ መወከሲታት ምስ ብዝሒ ደቂ choice ኣይሰማምዕን።

pretzel-indices-count-mismatch = ንproblem እተገልጹ መወከሲታት ኣይግደሱን ምኽንያቱ ብዝሒ መወከሲታት ምስ ብዝሒ ደቂ problem ኣይሰማምዕን።

shuffle-indices-count-mismatch = ንshuffle እተገልጹ መወከሲታት ኣይግደሱን ምኽንያቱ ብዝሒ መወከሲታት ምስ ብዝሒ ኣቕሑ ኣይሰማምዕን።

indices-ignored-out-of-range = ን{ $component } እተገልጹ መወከሲታት ኣይግደሱን ምኽንያቱ ገለ መወከሲታት ካብ ዶብ ወጻኢ እዮም።

pretzel-indices-repeated = ንpretzel እተገልጹ መወከሲታት ኣይግደሱን ምኽንያቱ ገለ መወከሲታት ተደጋጊሞም።

pretzel-circuit-first-index = ኣብ circuit ዘሎ pretzel እተገልጹ መወከሲታት ኣይግደሱን ምኽንያቱ እቲ ቀዳማይ መወከሲ 1 ክኸውን ኣለዎ።

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` ምስ ናይ ጽሑፍ ዓይነት ደቂ ክሰርሕ እንተ ኾይኑ፡ ባህሪ `type` ክግለጽ ኣለዎ።

invalid-type-defaulting-to-math = type { $type } ንኣቕሓ { $component } ቅቡል ኣይኮነን። ካብ math፡ text፡ number ወይ boolean ሓደ ክኸውን ኣለዎ። math ይቕመጥ ኣሎ።

string-not-valid-component-to-arrange = ጽሑፍ "{ $value }" ቅቡል ናይ { $component } ኣቕሓ ኣይኮነን። ኣይግደስን።

## Types and variables

invalid-type-defaulting-to-number = type { $type } ቅቡል ኣይኮነን፡ type ከም number ይቕመጥ ኣሎ።

invalid-variable-value = ክብሪ ተለዋዋጢ ቅቡል ኣይኮነን፡ `{ $value }`

## Variants

variant-index-must-be-number = መወከሲ ዓይነት { $index } ቁጽሪ ክኸውን ኣለዎ

variant-index-must-be-integer = መወከሲ ዓይነት { $index } ምሉእ ቁጽሪ ክኸውን ኣለዎ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ብፍጹም መለክዒታት ኣይተሰርሐን። ስፍሓት ብመጠን ይቕመጥ ኣሎ።

side-by-side-absolute-margins = `<{ $component }>` ብፍጹም መለክዒታት ኣይተሰርሐን። ወሰናት ብመጠን ይቕመጡ ኣለዉ።

side-by-side-no-block-child = `<{ $component }>` ቅቡል ኣይኮነን፡ እንተ ወሓደ ሓደ ናይ ብሎክ ዓይነት ውሉድ ክህልዎ ኣለዎ።

## `<label>`

label-for-ignored-on-graphical = ኣብ ናይ ስእሊ `<label>` ዘሎ ባህሪ `for` ኣይግደስን።

label-for-must-resolve-to-one = ኣብ `<label>` ዘሎ ባህሪ `for` ልክዕ ሓደ ኣቕሓ ጥራይ ክውክል ኣለዎ።

label-for-unresolved = ኣብ `<label>` ዘሎ ባህሪ `for` ዝኾነ ኣቕሓ ክውክል ኣይከኣለን።

label-for-answer-with-authored-inputs = ኣብ `<label>` ዘሎ ባህሪ `for` እተጻሕፉ ኣታዊታት ዘለዎ `<answer>` ይውክል፤ ነቲ ኣታዊ ባዕሉ ውከስ።

label-for-answer-without-input = ኣብ `<label>` ዘሎ ባህሪ `for` ክሰመ ዝኽእል ኣታዊ ዘይብሉ `<answer>` ይውክል።

label-for-must-reference-input-or-answer = ኣብ `<label>` ዘሎ ባህሪ `for` ኣታዊ ወይ መልሲ ክውክል ኣለዎ።

## Accessibility

accessibility-short-description-or-decorative = ንተበጻሕነት፡ `<{ $component }>` ሓጺር መግለጺ ክህልዎ ወይ ከም ናይ ስልማት ክግለጽ ኣለዎ።

accessibility-video-short-description = ንተበጻሕነት፡ `<video>` ሓጺር መግለጺ ክህልዎ ኣለዎ።

accessibility-input-short-description-or-label = ንተበጻሕነት፡ `<{ $component }>` ሓጺር መግለጺ ወይ ስም ክህልዎ ኣለዎ።

accessibility-answer-input-short-description-or-label = ንተበጻሕነት፡ ኣታዊ ዝፈጥር `<answer>` ሓጺር መግለጺ ወይ ስም ክህልዎ ኣለዎ።

accessibility-short-description-contains-math = ሓጺር መግለጺ ከም `<{ $component }>` ዝኣመሰሉ ናይ ሒሳብ ኣቕሑ ክህልዎ የብሉን። ንዝኾነ ሒሳብ ብቓላት ግለጾ።

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ንናይ ክፍሊ ኣርእስቲ ጽሑፍ እኹል ፍልልይ የብሉን (ጸላም ኩነታት) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1፤ እንተ ወሓደ { $threshold }:1 የድሊ)።
       *[other] { $colorName } ንናይ ክፍሊ ኣርእስቲ ጽሑፍ እኹል ፍልልይ የብሉን ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1፤ እንተ ወሓደ { $threshold }:1 የድሊ)።
    }

## `<circle>`

circle-through-points-non-numerical = እቶም ነጥብታት ቁጽራዊ ክብሪ ምስ ዘይህልዎም፡ ብ { $count } ነጥብታት ዝሓልፍ `<circle>` ገና ኣይተተግበረን።

circle-too-many-through-points = ካብ 3 ንላዕሊ ብዝኾኑ ነጥብታት ዝሓልፍ ክቢ ክሕሰብ ኣይክእልን።

circle-overprescribed-radius-center-points = ራድየስ፡ ማእከልን መሕለፊ ነጥብታትን ኩሎም እተገልጹሉ ክቢ ክሕሰብ ኣይክእልን።

circle-center-with-multiple-points = እተገልጸ ማእከል ዘለዎን ካብ 1 ንላዕሊ ብዝኾኑ ነጥብታት ዝሓልፍን ክቢ ክሕሰብ ኣይክእልን።

circle-radius-too-small = ክቢ ክሕሰብ ኣይክእልን፡ ኣብ መንጎ እቶም ክልተ ነጥብታት ዘሎ ርሕቀት { $distance } ስለ ዝኾነ፡ እቲ እተገልጸ ራድየስ { $radius } ኣዝዩ ንእሽቶ እዩ።

circle-radius-with-many-points = እተገልጸ ራድየስ ዘለዎን ካብ ክልተ ንላዕሊ ብዝኾኑ ነጥብታት ዝሓልፍን ክቢ ክፍጠር ኣይክእልን።

circle-invalid-center-or-through-points = ማእከል ናይቲ ክቢ ወይ መሕለፊ ነጥብታቱ ቅቡላት ኣይኮኑን።

circle-radius-center-with-multiple-points = እተገልጸ ማእከል ዘለዎን ካብ 1 ንላዕሊ ብዝኾኑ ነጥብታት ዝሓልፍን ክቢ ራድየሱ ክሕሰብ ኣይክእልን።

circle-change-radius-non-numerical = ቁጽራዊ ክብሪ ብዘይብሎም ነጥብታት ዝሓልፍ ክቢ ራድየሱ ክቕየር ኣይክእልን

circle-radius-with-points-non-numerical = ቁጽራዊ ክብሪ ኣብ ዘይብሉሉ፡ እተገልጸ ራድየስ ዘለዎን ካብ ሓደ ንላዕሊ ብዝኾኑ ነጥብታት ዝሓልፍን ክቢ ክፍጠር ኣይክእልን።

circle-change-center-non-numerical = ቁጽራዊ ክብሪ ብዘይብሎም ነጥብታት ዝሓልፍ ክቢ ማእከሉ ምቕያር ገና ኣይተተግበረን።

## `<function>`

function-domain-insufficient-dimensions = ዓቐናት ናይቲ ናይ ተግባር መዳይ እኹላት ኣይኮኑን። እቲ መዳይ { $intervals } ክፍተታት ኣለዉዎ፡ እቲ ተግባር ግን { $inputs } ኣታዊታት ኣለዉዎ።

function-domain-invalid-format = ቅርጺ ናይቲ ናይ ተግባር መዳይ ቅቡል ኣይኮነን።

function-ignoring-non-numerical =
    { $type ->
        [maximum] ቁጽራዊ ዘይኮነ ላዕለዋይ ጫፍ ተግባር ኣይግደስን።
        [minimum] ቁጽራዊ ዘይኮነ ታሕተዋይ ጫፍ ተግባር ኣይግደስን።
        [extremum] ቁጽራዊ ዘይኮነ ጫፍ ተግባር ኣይግደስን።
        [point] ቁጽራዊ ዘይኮነ ነጥቢ ተግባር ኣይግደስን።
        [slope] ቁጽራዊ ዘይኮነ ትዅዑት ተግባር ኣይግደስን።
       *[other] ቁጽራዊ ዘይኮነ { $type } ተግባር ኣይግደስን።
    }

function-ignoring-empty =
    { $type ->
        [maximum] ባዶ ላዕለዋይ ጫፍ ተግባር ኣይግደስን።
        [minimum] ባዶ ታሕተዋይ ጫፍ ተግባር ኣይግደስን።
        [extremum] ባዶ ጫፍ ተግባር ኣይግደስን።
        [point] ባዶ ነጥቢ ተግባር ኣይግደስን።
       *[other] ባዶ { $type } ተግባር ኣይግደስን።
    }

function-points-too-close = እቲ ተግባር ኣዝዮም እተቐራረቡ ክልተ ነጥብታት ኣለዉዎ። እቲ ተግባር ክግለጽ ኣይክእልን።

function-iterates-input-output-mismatch = ናይ ተግባር ድግማ ዝከኣል ብዝሒ ኣታዊታት ምስ ብዝሒ ውጽኢታት ምስ ዝመዓራረ ጥራይ እዩ። እዚ ተግባር { $inputs } ኣታዊታትን { $outputs } ውጽኢታትን ኣለዉዎ።

## `<sequence>`

sequence-invalid-length = ንውሓት ተርታ ቅቡል ኣይኮነን። ካብ ዜሮ ዘይትሕት ምሉእ ቁጽሪ ክኸውን ኣለዎ።

sequence-invalid-step = ስጉምቲ ተርታ ቅቡል ኣይኮነን። ኣብ ናይ { $type } ዓይነት ተርታ ቁጽሪ ክኸውን ኣለዎ።

sequence-invalid-endpoint-number = ናይ ቁጽሪ ተርታ "{ $attribute }" ቅቡል ኣይኮነን። ቁጽሪ ክኸውን ኣለዎ።

sequence-invalid-endpoint-letters = ናይ ፊደላት ተርታ "{ $attribute }" ቅቡል ኣይኮነን። ፊደላት ክኸውን ኣለዎ።

sequence-invalid-endpoint = ናይ ተርታ "{ $attribute }" ቅቡል ኣይኮነን።

select-from-sequence-coprime-not-numbers = coprime ኣይግደስን ምኽንያቱ ዝምረጹ ቁጽርታት ኣይኮኑን

select-from-sequence-coprime-with-exclude-combinations = coprime ኣይግደስን ምኽንያቱ excludeCombinations ተገሊጹ

## Resolving a `target`

target-not-found = target ን`<{ $source }>` ቅቡል ኣይኮነን፡ እቲ ዕላማ ኣይተረኽበን።

target-state-variable-not-found = target ን`<{ $source }>` ቅቡል ኣይኮነን፡ "{ $property }" ዝበሃል ተለዋዋጢ ኩነታት ኣብ `<{ $component }>` ኣይተረኽበን።

## `<odeSystem>`

ode-system-variables-match-independent = ተለዋወጥቲ `<odeSystem>` ካብቲ ናጻ ተለዋዋጢ ክፍለዩ ኣለዎም።

ode-system-duplicate-variable-names = እተደጋገሙ ስማት ተለዋወጥቲ ዘለዉዎም ናይ ODE RHS ተግባራት ክግለጹ ኣይክእሉን።

ode-system-rhs-function-error = ናይ ODE RHS ተግባር ክግለጽ ኣይክእልን። ናይ mathjs ተግባር ኣብ ምፍጣር ጌጋ ተፈጢሩ።

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = ኣብ መንጎ { $count } መስመራት ዘሎ መኣዝን ክግለጽ ኣይክእልን

angle-invalid-through-point = ኣብ ናይ `<angle>` through ዘሎ ነጥቢ ቅቡል ኣይኮነን

parabola-vertex-too-many-points = ጫፍ ዘለዋን ካብ 1 ንላዕሊ ብዝኾኑ ነጥብታት እትሓልፍን ፓራቦላ ገና ኣይተተግበረትን።

parabola-too-many-points = ካብ 3 ንላዕሊ ብዝኾኑ ነጥብታት እትሓልፍ ፓራቦላ ገና ኣይተተግበረትን።

intersection-too-many-items = ካብ ክልተ ንላዕሊ ናይ ዝኾኑ ኣቕሑ ምቅርራብ ገና ኣይተተግበረን

## Other math components

ionic-compound-not-two-ions = ካብ ክልተ ኣዮናት ንላዕሊ ዘለዎ ኣዮናዊ ውህደት ገና ኣይተተግበረን።

ionic-compound-needs-cation-and-anion = ኣዮናዊ ውህደት ንሓደ ካትዮንን ሓደ ኣንዮንን ጥራይ እዩ እተተግበረ።

solve-equations-cannot-evaluate = እቲ ማዕረነት ክሕሰብ ስለ ዘይከኣለ ክፍታሕ ኣይክእልን፡ { $equation }

math-operators-operand-number-required = ናይ ሒሳብ ኦፐራንድ ኣብ ምውጻእ operandNumber ክግለጽ ኣለዎ።

eigen-decomposition-failed = ናይ ማትሪክስ eigen ክብርታት ክሕሰቡ ኣይክእሉን

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`፡ መለክዒታት { $parameters } ኣብቲ ቅርጺ ኣይረኣዩን፡ ስለዚ ኩሉ ግዜ ምስ ባዶ ክሰማምዑ እዮም።

## `<graph>`

graph-grid-invalid = `<graph>`፡ grid="{ $grid }" ክትርጎም ኣይክእልን። none፡ medium፡ dense፡ ወይ ብጋግ እተፈላለዩ ክልተ ኣወንታዊ ቁጽርታት ክኸውን ኣለዎ፡ ከም grid="1 0.5"። ዝኾነ መርበብ ኣይስኣልን።

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`፡ xLabelPosition="left" ኣብ ናይ prefigure ኣርኣዪ ኣይድገፍን፤ ናይ የማን ኣቀማምጣ ይስራሓሉ።

prefigure-y-label-position-unsupported = `<graph>`፡ yLabelPosition="bottom" ኣብ ናይ prefigure ኣርኣዪ ኣይድገፍን፤ ናይ ላዕሊ ኣቀማምጣ ይስራሓሉ።

prefigure-invalid-axis-bounds = `<graph>`፡ ንprefigure ምቕያር ዶባት ኣኽሲስ ቅቡላት ኣይኮኑን፤ bbox (-10,-10,10,10) ይስራሓሉ።

prefigure-invalid-width = `<graph>`፡ ንprefigure ምቕያር እቲ ስፍሓት ቅቡል ኣይኮነን፤ ናይ ስእሊ ስፍሓት 425 ይስራሓሉ።

prefigure-invalid-aspect-ratio = `<graph>`፡ ንprefigure ምቕያር aspectRatio ቅቡል ኣይኮነን፤ መጠን 1 ይስራሓሉ።

prefigure-grid-spacing-too-fine = `<graph>`፡ ናይ መርበብ ጋግ ንዶባት ኣኽሲስ ኣዝዩ ጸቢብ እዩ፤ መርበብ ኣብ ናይ prefigure ኣርኣዪ ተሪፉ።

prefigure-annotations-not-rendered = `<graph>`፡ ናይ PreFigure ኣርኣዪ ኣብ ዘይስራሓሉ ጊዜ መብርሂታት ኣይረኣዩን።

multiple-annotations-children = ኣብ `<graph>` ብዙሓት ደቂ `<annotations>` ተረኺቦም፤ ብዘይካ እቲ ናይ መወዳእታ ኩሎም ኣይግደሱን።

## Referring to other components

copy-unrecognized-component-type = ዘይተፈልጠ ዓይነት ኣቕሓ ክስፋሕ ወይ ክቕዳሕ ኣይክእልን፡ { $type }።

copy-prop-not-found = ባህሪ { $property } ኣብ ናይ { $component } ዓይነት ኣቕሓ ኣይተረኽበን

collect-no-source = ንcollect ዝኸውን ምንጪ ኣይተረኽበን።

collect-invalid-component-type = ናይ `<{ $component }>` ዓይነት ኣቕሑ ክእከቡ ኣይክእሉን ምኽንያቱ ቅቡል ዘይኮነ ዓይነት ኣቕሓ እዩ።

reference-index-unavailable = መወከሲ `{ $reference }` ክውከስ ኣይክእልን

## `<callAction>`

component-action-unavailable = ኣብ ኣቕሓ `{ $reference }` { $action } ክጽዋዕ ኣይክእልን

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ቅርጺ ዳታ ቅቡል ኣይኮነን። መስርዓት ዘይመዓራረ ንውሓት ኣለዎም። ኣብ componentIdx :{ $componentIdx } ተረኺቡ

data-frame-duplicate-column-names = እቲ ዳታ እተደጋገሙ ስማት ዓምዲ ኣለዉዎ። ኣብ componentIdx :{ $componentIdx } ተረኺቡ

data-frame-missing-column-name = እቲ ዳታ ስም ዓምዲ ይጎድሎ። ኣብ componentIdx :{ $componentIdx } ተረኺቡ

## `<answer>` and scoring

answer-award-depends-on-own-response = ሓደ ካብ award ናይዚ መልሲ ኣብቲ ናይ answer ታግ ባዕሉ ዝለኣኾ መልሲ ይምርኮስ፡ እዚ ድማ ዘይተጸበኻዮ ባህሪ ከምጽእ እዩ።

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` ኣብ ዘለዎ ኮንተይነር ውሽጢ ንዘሎ `<answer>` `maxNumAttempts` ምቕማጥ ውጽኢት የብሉን፡ ምኽንያቱ ብዝሒ ፈተነታት ብእቲ ኮንተይነር እዩ ዝቆጻጸር። ኣብ ክንድኡ `maxNumAttempts` ኣብቲ ኮንተይነር ኣቐምጥ።

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` ኣብ ዘለዎ ካልእ ኮንተይነር ውሽጢ ንዘሎ፡ ንሱ'ውን `sectionWideCheckWork` ዘለዎ ኮንተይነር `maxNumAttempts` ምቕማጥ ውጽኢት የብሉን፡ ምኽንያቱ ብዝሒ ፈተነታት ብእቲ ናይ ደገ ኮንተይነር እዩ ዝቆጻጸር። ኣብ ክንድኡ `maxNumAttempts` ኣብቲ ናይ ደገ ኮንተይነር ኣቐምጥ።

answer-attributes-need-symbolic-equality = symbolicEquality እንተ ዘይተቐሚጡ ባህርያት { $attributes } ውጽኢት ኣይህልዎምን።

answer-invalid-type = ንመልሲ እቲ ዓይነት ቅቡል ኣይኮነን፡ { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = ኣቕሓ `<{ $component }>` ስም ስለ ዘይብሉ፡ ከም ናይ module ባህሪ ክውዕል ኣይክእልን

module-attribute-name-already-defined = ኣቕሓ `<{ $component } name="{ $name }">` ከም ናይ module ባህሪ ክውዕል ኣይክእልን ምኽንያቱ ናይ ኣቕሓ ዓይነት `<module>` "{ $name }" ዝበሃል ባህሪ ኣቐዲሙ ኣለዎ።

conditional-content-condition-ignored = case ወይ else ደቂ ኣብ ዘለዎ ኣቕሓ `<conditionalContent>` ባህሪ `condition` ኣይግደስን።

slider-markers-type-mismatch = ዓይነት ምልክታት ምስ ዓይነት slider ኣይሰማምዕን።

pretzel-problem-needs-statement-and-answer = pretzel ቅቡል ኣይኮነን፡ ነፍሲ ወከፍ `<problem>` ሓደ `<statement>` ከምኡ'ውን ሓደ `<answer>` ክህልዎ ኣለዎ።

pretzel-circuit-first-problem-distractor = pretzel ቅቡል ኣይኮነን፡ ኣብ mode="circuit"፡ እቲ ቀዳማይ `<problem>` መስሓቲ ክኸውን ኣይክእልን።

## Attribute values

attribute-invalid-values = ክብርታት { $values } ንባህሪ `{ $attribute }` ቅቡላት ኣይኮኑን፤ ኣይግደሱን።

attribute-must-be-references = ክብሪ `{ $value }` ንባህሪ `{ $attribute }` ቅቡል ኣይኮነን። እቲ ባህሪ ብ`$` ካብ ዝጅምሩ መወከሲታት ክቐውም ኣለዎ።

math-input-invalid-function-names = <mathInput>፡ ኣብ { $attribute } ዘለዉ ቅቡላት ዘይኮኑ ስማት ተግባር ኣይግደሱን፡ { $names }። ናይ ነፍሲ ወከፍ ስም ዝረአ ክፋል እንተ ወሓደ 2 ፊደላት ክህልዎ ኣለዎ (ፊደላት ወይ መስመራት)፤ ናይ ምርጫ መጠቓለሊ `|<mathspeak alternative>` ክስዕብ ይኽእል።

## Building components from the source

component-type-invalid = ዓይነት ኣቕሓ ቅቡል ኣይኮነን፡ `<{ $componentType }>`

attribute-repeated = ባህሪ { $attribute } ክድገም ኣይክእልን።

attribute-invalid-for-component = ባህሪ "{ $attribute }" ንናይ `<{ $componentType }>` ዓይነት ኣቕሓ ቅቡል ኣይኮነን።

## Style definition contrast

style-definition-insufficient-contrast =
    ናይ ቅዲ ትርጉም { $styleNumber } ን{ $context ->
        [text-on-background] ሕብሪ ጽሑፍ ኣንጻር ሕብሪ ድሕረ-ባይታ
        [high-contrast] ሕብሪ ዓቢ ፍልልይ ኣንጻር እቲ ሸራ
        [line] ሕብሪ መስመር ኣንጻር እቲ ሸራ
        [marker] ሕብሪ ምልክት ኣንጻር እቲ ሸራ
       *[text-on-canvas] ሕብሪ ጽሑፍ ኣንጻር እቲ ሸራ
    } እኹል ፍልልይ የብሉን{ $mode ->
        [dark] { " (ጸላም ኩነታት)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1፤ እንተ ወሓደ { $threshold }:1 የድሊ)።

style-definition-dark-mode-text-background-contrast =
    ናይ ቅዲ ትርጉም { $styleNumber } ኣብ ብሩህ ኩነታት እኹል ፍልልይ ዝህቡ ሕብርታት እኳ እንተ ገለጸ፡ ካብኣቶም ዝወጹ ናይ ጸላም ኩነታት ሕብርታት ንሕብሪ ጽሑፍ ኣንጻር ሕብሪ ድሕረ-ባይታ እኹል ፍልልይ የብሎምን ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1፤ እንተ ወሓደ { $threshold }:1 የድሊ)። { $suggestion ->
        [available] ኣብ ጸላም ኩነታት እኹል ፍልልይ ንምርግጋጽ፡ ናይ ብሩህ ኩነታት ፍልልይ ወስኽ (ንኣብነት { $lightAttribute }="{ $lightColor }" ኣቐምጥ) ወይ ናይ ጸላም ኩነታት ሕብሪ ቀይር (ንኣብነት { $darkAttribute }="{ $darkColor }" ኣቐምጥ)።
       *[none] ኣብ ጸላም ኩነታት እኹል ፍልልይ ንምርግጋጽ፡ ናይ ብሩህ ኩነታት ፍልልይ ወስኽ ወይ እቶም ዝወጹ ሕብርታት ብtextColorDarkMode ከምኡ'ውን/ወይ backgroundColorDarkMode ቀይር።
    }

style-definition-dark-mode-text-canvas-contrast =
    ናይ ቅዲ ትርጉም { $styleNumber } ኣብ ብሩህ ኩነታት እኹል ፍልልይ ዝህብ ሕብሪ ጽሑፍ እኳ እንተ ገለጸ፡ ካብኡ ዝወጸ ናይ ጸላም ኩነታት ሕብሪ ጽሑፍ ኣንጻር እቲ ሸራ እኹል ፍልልይ የብሉን ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1፤ እንተ ወሓደ { $threshold }:1 የድሊ)። { $suggestion ->
        [available] ኣብ ጸላም ኩነታት እኹል ፍልልይ ንምርግጋጽ፡ ናይ ብሩህ ኩነታት ፍልልይ ወስኽ (ንኣብነት textColor="{ $lightColor }" ኣቐምጥ) ወይ ናይ ጸላም ኩነታት ሕብሪ ቀይር (ንኣብነት textColorDarkMode="{ $darkColor }" ኣቐምጥ)።
       *[none] ኣብ ጸላም ኩነታት እኹል ፍልልይ ንምርግጋጽ፡ ናይ ብሩህ ኩነታት ፍልልይ ወስኽ ወይ እቲ ዝወጸ ሕብሪ ብtextColorDarkMode ቀይር።
    }

section-multiple-style-palettes = ሓደ ክፍሊ ሓደ <stylePalette> ጥራይ ክመርጽ ይኽእል፤ እቲ ናይ መወዳእታ ይስራሓሉ።

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect ካብ ዜሮ ዘይትሕት ምሉእ ቁጽሪ ስለ ዘይኮነ ናይ { $component } ፍሉያት ዓይነታት ክግለጹ ኣይክእሉን።

variant-num-to-select-not-constant-number = numToSelect ዘይቀያየር ቁጽሪ ስለ ዘይኮነ ናይ { $component } ፍሉያት ዓይነታት ክግለጹ ኣይክእሉን።

variant-with-replacement-not-constant-boolean = withReplacement ዘይቀያየር ቡሊያን ስለ ዘይኮነ ናይ { $component } ፍሉያት ዓይነታት ክግለጹ ኣይክእሉን።

variant-select-weight-disables-unique = selectWeight ወይ selectForVariants እተገልጸሉ ምርጫ እንተ ሃልዩ ናይ select ፍሉያት ዓይነታት ይዕጸዉ

variant-coprime-undetermined = coprime ኩሉ ግዜ ሓሶት ምዃኑ ከረጋግጽ ስለ ዘይክእል ናይ { $component } ፍሉያት ዓይነታት ክግለጹ ኣይክእሉን።

variant-attribute-not-constant = { $attribute } ስለ ዘይተረጋገአ ናይ { $component } ፍሉያት ዓይነታት ክግለጹ ኣይክእሉን።

variant-attribute-not-number = { $attribute } ቁጽሪ ስለ ዘይኮነ ናይ { $component } ፍሉያት ዓይነታት ክግለጹ ኣይክእሉን።

variant-attribute-wrong-type-for-sequence =
    { $attribute } { $expected ->
        [letters-combination] ናይ ፊደላት ጥርናፈ
        [math-expression] ቅቡል ናይ ሒሳብ መግለጺ
        [integer] ምሉእ ቁጽሪ
       *[number] ቁጽሪ
    } ስለ ዘይኮነ ናይ { $component } ናይ { $type } ዓይነት ፍሉያት ዓይነታት ክግለጹ ኣይክእሉን።

variant-length-not-integer = length ምሉእ ቁጽሪ ስለ ዘይኮነ ናይ { $component } ፍሉያት ዓይነታት ክግለጹ ኣይክእሉን።

variant-sort-not-implemented = sort ዘለዎም ናይ { $component } ፍሉያት ዓይነታት ገና ኣይተተግበሩን

variant-exclude-combinations-not-implemented = excludeCombinations ዘለዎም ናይ { $component } ፍሉያት ዓይነታት ገና ኣይተተግበሩን

variant-math-exclude-not-implemented = exclude ዘለዎም ናይ { $component } ናይ math ዓይነት ፍሉያት ዓይነታት ገና ኣይተተግበሩን

variant-non-constant-exclude-not-implemented = ዘይተረጋገአ exclude ዘለዎም ናይ { $component } ፍሉያት ዓይነታት ገና ኣይተተግበሩን

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }፡ ኣብ ናይ graph prefigure ኣርኣዪ ኣይድገፍን፤ እቲ ወራሲ ተሓሊፉ።

prefigure-descendant-invalid-geometry = { $subject }፡ ዶብ ዘይብሉ ወይ ዘይተማልአ ጂኦሜትሪ፤ እቲ ወራሲ ተሓሊፉ።

prefigure-curve-label-omitted = { $subject }፡ ኣብ እተቐየሩ ናይ ጥውይዋይ ኣቕሑ ስማት ኣይድገፉን፤ እቲ ስም ተሪፉ።

prefigure-curve-unsupported-definition-type = { $subject }፡ ናይ ጥውይዋይ ተግባር ትርጉም ዓይነት '{ $definitionType }' ኣይድገፍን፤ እቲ ወራሲ ተሓሊፉ።

prefigure-region-flip-functions-unsupported = { $subject }፡ ኣብ regionBetweenCurves ዘሎ ባህሪ flipFunctions ኣይድገፍን፤ እቲ ወራሲ ተሓሊፉ።

prefigure-region-non-formula-child = { $subject }፡ ኣብ regionBetweenCurves ናይ formula ዓይነት ደቂ ተግባራት ጥራይ እዮም ዝድገፉ፤ እቲ ወራሲ ተሓሊፉ።

prefigure-label-position-unsupported =
    { $subject }፡ labelPosition '{ $labelPosition }' ን{ $labelKind ->
        [line-family] ስም ስድራ መስመር
       *[point] ስም ነጥቢ
    } ኣይድገፍን፤ ናይ PreFigure ኣቀማምጣ ይስራሓሉ።

prefigure-fill-style-unsupported = { $subject }፡ ናይ መመልኢ ቅዲ '{ $fillStyle }' ብPreFigure ኣይድገፍን፤ ናብ ናይ ሓደ ሕብሪ መመልኢ ይምለስ።

prefigure-line-style-unknown = { $subject }፡ ናይ መስመር ቅዲ '{ $lineStyle }' ኣይተፈልጠን፡ ኣብ ውጽኢት PreFigure ተሪፉ።

prefigure-marker-style-mapped-to-diamond = { $subject }፡ ናይ ምልክት ቅዲ '{ $markerStyle }' ምስ ናይ PreFigure ቅዲ 'diamond' ተዛሚዱ።

prefigure-marker-style-unsupported = { $subject }፡ ናይ ምልክት ቅዲ '{ $markerStyle }' ብPreFigure ኣይድገፍን፤ እቲ ቀዳምነት ዘለዎ ቅዲ ይስራሓሉ።

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`፡ `ref` ቅቡል ኣይኮነን፤ እቲ ዕላማ ክፍለጥ ኣይክእልን። እቲ መብርሂ ተሪፉ።

annotation-ref-multiple-targets = `<annotation>`፡ `ref` ብዙሓት ዕላማታት ገሊጹ፤ እቲ ቀዳማይ ዕላማ ይስራሓሉ።

annotation-ref-outside-graph = `<annotation>`፡ `ref` ቅቡል ኣይኮነን፤ እቲ ዕላማ ካብቲ ዝሓዞ ግራፍ ወጻኢ እዩ። እቲ መብርሂ ተሪፉ።

annotation-ref-unsupported-target = `<annotation>`፡ `ref` ቅቡል ኣይኮነን፤ እቲ ዕላማ ኣብ ናይ prefigure ምቕያር ዝድገፍ ናይ ስእሊ ኣቕሓ ኣይኮነን። እቲ መብርሂ ተሪፉ።

annotation-text-missing = `<annotation>`፡ `text` የልቦን ወይ ባዶ እዩ፤ ባዶ ጽሑፍ ይወጽእ።

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] ዑደታዊ ምምርኳስ ተረኺቡ።
       *[other] ንኣቕሓ `<{ $componentType }>` ዘሳትፍ ዑደታዊ ምምርኳስ ተረኺቡ።
    }

reference-no-referent = ንመወከሲ ዝኾነ ኣይተረኽበን፡ `{ $reference }`

reference-multiple-referents = ንመወከሲ ብዙሓት ተረኺበን፡ `{ $reference }`

## Children that do not match

children-invalid-attribute-format = ናይ `<{ $componentType }>` ባህሪ { $attribute } ቅርጺ ቅቡል ኣይኮነን።

children-invalid = ን`<{ $componentType }>` እቶም ደቂ ቅቡላት ኣይኮኑን፡ ቅቡላት ዘይኮኑ ደቂ ተረኺቦም፡ { $children }

## Falling back to a default

attribute-value-invalid-using-default = ክብሪ `{ $value }` ንባህሪ `{ $attribute }` ቅቡል ኣይኮነን፡ ክብሪ `{ $default }` ይስራሓሉ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML ስሪት { $version } ኣይተረኽበን።
       *[other] DoenetML ስሪት { $version } ኣይተረኽበን። ናብ ስሪት { $fallback } ይምለስ
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ቅቡል ኣይኮነን፡ { $content }

parse-tag-missing-close-tag = DoenetML ቅቡል ኣይኮነን፡ ታግ `{ $tag }` መዕጸዊ ታግ የብሉን። ባዕሉ ዝዕጾ ታግ ወይ ታግ `</{ $tagName }>` ተጸቢና።

parse-tag-error = DoenetML ቅቡል ኣይኮነን፡ ኣብ ታግ `<{ $tagName }>` ጌጋ

parse-attribute-missing-value = DoenetML ቅቡል ኣይኮነን፡ ቅቡል ዘይኮነ ባህሪ `{ $attribute }` ክብሪ ዝጎደሎ ይመስል።

parse-attribute-invalid = DoenetML ቅቡል ኣይኮነን፡ ባህሪ `{ $attribute }` ቅቡል ኣይኮነን

parse-attribute-value-invalid = DoenetML ቅቡል ኣይኮነን፡ ናይ ባህሪ ክብሪ `{ $value }` ቅቡል ኣይኮነን

parse-attribute-value-quote-mismatch = DoenetML ቅቡል ኣይኮነን፡ ናይ ባህሪ ክብሪ `{ $value }` ቅቡል ኣይኮነን። ናይ ጥቕሲ ምልክታት ኣይሰማምዑን። `{ $quote }` ዝጎደለ ይመስል

parse-open-tag-name-missing = DoenetML ቅቡል ኣይኮነን፡ ስም ዘይብሉ ታግ ተረኺቡ፡ ንኣብነት `<`

parse-tag-not-closed = DoenetML ቅቡል ኣይኮነን፡ ታግ `{ $tag }` ኣይተዓጸወን (`>` ዝጎደለ ይመስል)።

parse-self-closing-tag-name-missing = DoenetML ቅቡል ኣይኮነን፡ ስም ዘይብሉ ታግ ተረኺቡ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ቅቡል ኣይኮነን፡ ታግ `{ $tag }` ኣይተዓጸወን (`/>` ዝጎደለ ይመስል)።

parse-tag-invalid-attributes = DoenetML ቅቡል ኣይኮነን፡ ታግ `{ $tag }` ቅቡል ኣይኮነን። ምናልባት ቅቡላት ዘይኮኑ ባህርያት ኣለዉዎ።

parse-close-tag-name-missing = DoenetML ቅቡል ኣይኮነን፡ ስም ዘይብሉ መዕጸዊ ታግ ተረኺቡ፡ ንኣብነት `</`

parse-attribute-value-unquoted = ናይ ባህሪ ክብርታት ኣብ ውሽጢ ናይ ጥቕሲ ምልክታት ክቕመጡ ኣለዎም፡ `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ቅቡል ኣይኮነን፡ መዕጸዊ ታግ `{ $tag }` ተረኺቡ፡ ግን ዝሰማማዕ መኽፈቲ ታግ የልቦን

parse-close-tag-mismatched = DoenetML ቅቡል ኣይኮነን፡ እቲ መዕጸዊ ታግ ኣይሰማምዕን። `</{ $expected }>` ተጸቢና። `{ $found }` ተረኺቡ

parser-node-unconvertible = ኖድ { $node } ናብ ናይ Dast ኖድ ክቕየር ኣይከኣለን።

## Names

name-attribute-invalid =
    ባህሪ name='{ $name }' ቅቡል ኣይኮነን። { $reason ->
        [characters] ስማት ፊደላት፡ ቁጽርታት፡ ታሕተዎት መስመራት ወይ መስመራት ጥራይ ክህልዎም ይኽእል።
       *[start] ስማት ብፊደል ክጅምሩ ኣለዎም።
    }

component-name-invalid-start = ስም ኣቕሓ "{ $name }" ቅቡል ኣይኮነን። ስማት ብፊደል ክጅምሩ ኣለዎም።

## `<answer>` sugar

answer-video-watched-missing-video = ናይ videoWatched ዓይነት መልሲ ባህሪ video ክህልዎ ኣለዎ

answer-video-watched-video-not-reference = ናይ videoWatched ዓይነት መልሲ መወከሲ ዝኾነ ባህሪ video ክህልዎ ኣለዎ

answer-name-not-single-text = ናይ መልሲ ባህሪ name ሓደ text ውሉድ ጥራይ ክህልዎ ኣለዎ

## Referencing another document

external-doenetml-recursion-limit = ብዙሕ ደረጃ ድግማ ስለ ዘሎ ናይ ደገ DoenetML ክርከብ ኣይክእልን። ዑደታዊ መወከሲ ኣሎ ድዩ?

external-doenetml-unavailable = ካብ { $attribute }="{ $uri }" DoenetML ክርከብ ኣይክእልን

external-doenetml-type-mismatch = ካብ { $attribute }="{ $uri }" እተረኽበ DoenetML ቅቡል ኣይኮነን፡ ምስ ናይ ኣቕሓ ዓይነት "{ $componentType }" ኣይሰማምዕን

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] ባህሪ `{ $from }` ግዜኡ ሓሊፉ፤ ኣብ ክንድኡ `{ $to }` ተጠቐም።
       *[other] [deprecation] ኣብ `<{ $component }>` ዘሎ ባህሪ `{ $from }` ግዜኡ ሓሊፉ፤ ኣብ ክንድኡ `{ $to }` ተጠቐም።
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] ባህሪ `{ $from }` ግዜኡ ሓሊፉ፡ `{ $to }` እውን ስለ እተገልጸ ኣይግደስን።
       *[other] [deprecation] ኣብ `<{ $component }>` ዘሎ ባህሪ `{ $from }` ግዜኡ ሓሊፉ፡ `{ $to }` እውን ስለ እተገልጸ ኣይግደስን።
    }

deprecated-attribute-ignored = [deprecation] ኣብ `<{ $component }>` ዘሎ ባህሪ `{ $attribute }` ግዜኡ ሓሊፉ፡ ኣይግደስን።

deprecated-attribute-to-child = [deprecation] ኣብ `<{ $component }>` ዘሎ ባህሪ `{ $attribute }` ግዜኡ ሓሊፉ፤ ኣብ ክንድኡ ውሉድ `<{ $child }>` ተጠቐም።


## Language coverage

pluralize-english-only = `<pluralize>` ብእንግሊዝኛ ጥራይ ብዙሕነት ክገብር ይኽእል፡ ስለዚ ኣብ { $locale } እተጻሕፈ ሰነድ ጽሑፉ ከምዘሎ ይተርፍ። ናይ ብዙሕነት ቅርጺ ባዕልኻ ጽሓፍ፡ ወይ ኣብ ባህሪ `pluralForm` ኣቐምጦ።


## Checking against the schema

schema-element-unrecognized = ኣቕሓ `<{ $tag }>` ዝፍለጥ ናይ Doenet ኣቕሓ ኣይኮነን።

schema-element-not-allowed-at-root = ኣቕሓ `<{ $tag }>` ኣብ መሰረት እቲ ሰነድ ኣይፍቀድን።

schema-element-not-allowed-inside = ኣቕሓ `<{ $tag }>` ኣብ ውሽጢ `<{ $parent }>` ኣይፍቀድን።

schema-attribute-unrecognized = ኣቕሓ `<{ $tag }>` `{ $attribute }` ዝበሃል ባህሪ የብሉን።

schema-attribute-value-not-allowed =
    { $isList ->
        [true] ናይ ኣቕሓ `<{ $tag }>` ባህሪ `{ $attribute }` ነፍሲ ወከፍ ኣቕሓኡ ካብዞም ሓደ ዝኾነ ዝርዝር ክኸውን ኣለዎ፡ { $allowed }
       *[other] ናይ ኣቕሓ `<{ $tag }>` ባህሪ `{ $attribute }` ካብዞም ሓደ ክኸውን ኣለዎ፡ { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = ንselect ስም ዓይነት ቅቡል ኣይኮነን። ስም ዓይነት { $variantName } ኣብ { $numOptions } ምርጫታት ይረአ፡ ብዝሒ ምርጫ ግን { $numToSelect } እዩ።

select-variant-name-without-options = ንselect ገለ ዓይነታት ተገሊጾም፡ ግን ክኸውን ንዝኽእል ስም ዓይነት ዝኾነ ምርጫ ኣይተገልጸን፡ { $variantName }።

select-variant-name-not-possible = ንselect እተገልጸ ስም ዓይነት { $variantName } ክኸውን ዝኽእል ስም ዓይነት ኣይኮነን።

select-too-few-options = ካብ { $numOptions } ጥራይ { $numToSelect } ኣቕሑ ክምረጹ ኣይክእሉን።

select-from-sequence-too-few-values = ንውሓቱ { $length } ካብ ዝኾነ ተርታ { $numToSelect } ክብርታት ክምረጹ ኣይክእሉን።

select-from-sequence-indices-count-mismatch = ንselect እተገልጸ ብዝሒ መወከሲታት ምስ ብዝሒ ምርጫ ክሰማማዕ ኣለዎ

select-from-sequence-indices-not-integers = ንselect እተገልጹ ኩሎም መወከሲታት ምሉኣት ቁጽርታት ክኾኑ ኣለዎም

select-from-sequence-index-excluded = እተወገደ ናይ selectfromsequence መወከሲ ተገሊጹ

select-from-sequence-indices-excluded-combination = እተወገደ ጥርናፈ ዝነበሩ ናይ selectfromsequence መወከሲታት ተገሊጾም

select-from-sequence-coprime-not-positive-integers = ዝምረጹ ኣወንታዊ ምሉኣት ቁጽርታት ስለ ዘይኮኑ ናይ ተጻመድቲ ቁጽርታት ጥርናፈታት ክምረጹ ኣይክእሉን።

select-from-sequence-coprime-common-factor = ተጻመድቲ ቁጽርታት ክምረጹ ኣይክእሉን። ኩሎም ክኾኑ ዝኽእሉ ክብርታት ሓደ መማቐሊ የካፍሉ። (እተገልጹ ናይ "from" ወይ "to" ክብርታት ምስ "step" ተጻመድቲ ክኾኑ ኣለዎም።)

select-from-sequence-coprime-single-number = 1 ካብ ዘይኮነ ሓደ ቁጽሪ ናይ ተጻመድቲ ቁጽርታት ጥርናፈታት ክምረጹ ኣይክእሉን።

select-from-sequence-excluded-too-many-combinations = ኣብ selectFromSequence ካብ 70% ንላዕሊ ጥርናፈታት ተወጊዶም

select-from-sequence-coprime-none-found = ተጻመድቲ ቁጽርታት ክምረጹ ኣይከኣሉን። ኩሎም ክኾኑ ዝኽእሉ ክብርታት ሓደ መማቐሊ የካፍሉ።

select-from-sequence-too-few-unique-values = ንውሓቱ { $numPossibleValues } ካብ ዝኾነ ተርታ { $numToSelect } ፍሉያት ክብርታት ክምረጹ ኣይክእሉን

select-prime-numbers-too-few-values = ንውሓቱ { $numValues } ካብ ዝኾነ ናይ ቀዳማይ ቁጽርታት ዝርዝር { $numToSelect } ክብርታት ክምረጹ ኣይክእሉን

select-prime-numbers-values-count-mismatch = ንselect እተገልጸ ብዝሒ ክብርታት ምስ ብዝሒ ምርጫ ክሰማማዕ ኣለዎ

select-prime-numbers-values-not-prime = ንselect prime number እተገልጹ ኩሎም ክብርታት ኣብቲ ናይ ቀዳማይ ቁጽርታት ዝርዝር ክህልዉ ኣለዎም

select-prime-numbers-values-excluded-combination = እተገልጹ ናይ selectPrimeNumbers ክብርታት እተወገደ ጥርናፈ ነይሮም

select-prime-numbers-excluded-too-many-combinations = ኣብ selectPrimeNumbers ካብ 70% ንላዕሊ ጥርናፈታት ተወጊዶም

select-random-combination-fluke = ብዘይልሙድ ኩነት፡ ናይ ዘይተወሰኑ ክብርታት ጥርናፈ ክምረጽ ኣይከኣለን

select-random-value-fluke = ብዘይልሙድ ኩነት፡ ዘይተወሰነ ክብሪ ክምረጽ ኣይከኣለን
