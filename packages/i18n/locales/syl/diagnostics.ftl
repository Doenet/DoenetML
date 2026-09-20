# Sylheti (ছিলটি) diagnostics: the warnings and errors the worker raises and
# the reader is shown. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth. Selected by `uiLocale`, not by the language the
# document was written in.
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
# **Script** is `chrome.ftl`'s: the Bengali script, as Sylheti is normally
# printed today, rather than Sylheti Nagri, for the three reasons that file's
# header gives in full.
#
# **The technical vocabulary is Bengali, declared as such** — ভুল, ত্রুটি,
# সতর্কতা, উপাদান, বৈশিষ্ট্য, চলক, মাত্রা, সন্দর্ভ, অনুক্রম, সংমিশ্রণ.
# Sylheti readers meet these words in Bengali schooling; coining Sylheti
# equivalents would put unfamiliar words in front of a reader who already has
# familiar ones. What is Sylheti is the frame around them: নায় for verbal
# negation, নাই for absence, আছে for presence, অউ and ইতা for the
# demonstratives, লাগি, দিয়া and লগে for the postpositions, and the honorific
# imperative in -ইন.
#
# **One paraphrase is declared and used everywhere so that one search replaces
# it.** English's *is ignored* is written «গণায় লওয়া অয় নায়» throughout —
# literally *is not taken into account*. It appears in something like thirty
# messages, so it is the first thing a speaker should replace, and replacing
# it is a single search.
#
# **No plural branches anywhere.** CLDR has no plural data for `syl`, so
# `line-segment-attributes-ignored-with-endpoints` and its relatives write a
# single `*[other]` where English writes `[one]` and `[other]`. The one
# numeric literal that survives is `[1]` in
# `field-function-wrong-num-outputs`, which forks on how many outputs a
# component *needs* rather than on a count the reader is looking at; Fluent
# matches it against the number itself before any plural rule is consulted.
#
# **Numbers render in Latin digits** rather than in Bengali numerals (#1615).

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] দুইটা endpoint দেওয়া থাকলে { $attributes } গণায় লওয়া অয় নায়
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] endpoint আর midpoint দুইটাউ দেওয়া থাকলে { $attributes } গণায় লওয়া অয় নায়
    }

line-segment-midpoint-offset-without-midpoint = midpoint নাই অইলে midpointOffset-র কোনো কাম নাই

## `<line>`

line-points-undetermined-dimensions = মাত্রা ঠিক অয় নাই এমন বিন্দু দিয়া রেখা।

line-points-too-few-dimensions = রেখা যেসব বিন্দু দিয়া যাইব ইতার কমসেকম দুই মাত্রা অইতে অইব।

line-points-depend-on-variables = রেখা যেসব বিন্দু দিয়া যাইব ইতা চলকের উপরে নির্ভর করে: { $variables }।

line-equation-invalid-format = { $variable1 } আর { $variable2 } চলকো রেখার সমীকরণের ভুল ছাঁচ।

## `<ray>`

ray-overprescribed-through = রশ্মি through, endpoint আর direction তিনটা দিয়াউ ঠিক করা অইছে।  দেওয়া through গণায় লওয়া অয় নায়।

ray-dimension-mismatch = রশ্মিও numDimensions মিলে নায়।

## `<vector>`

vector-overprescribed-head = ভেক্টর head, tail আর displacement তিনটা দিয়াউ ঠিক করা অইছে।  দেওয়া head গণায় লওয়া অয় নায়।

vector-dimension-mismatch = ভেক্টরো numDimensions মিলে নায়।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>`-র nearestPoint অবস্থা-চলক নাই, তাইন ইতার দিকে টানা যায় নায়।

constrain-to-without-nearest-point = `<{ $component }>`-র nearestPoint অবস্থা-চলক নাই, তাইন ইতার লগে বাঁধা যায় নায়।

constrain-to-interior-without-nearest-point = `<{ $component }>`-র nearestPoint অবস্থা-চলক নাই, তাইন ইতার ভিতরের লগে বাঁধা যায় নায়।

## `<choiceInput>`

choice-input-label-position-ignored = inline নায় এমন choiceInput-র লাগি labelPosition গণায় লওয়া অয় নায়

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-র লাগি দেওয়া indices-র সংখ্যা choice সন্তানের সংখ্যার লগে মিলে নায়, তাইন ইতা গণায় লওয়া অয় নায়।

pretzel-indices-count-mismatch = problem-র লাগি দেওয়া indices-র সংখ্যা problem সন্তানের সংখ্যার লগে মিলে নায়, তাইন ইতা গণায় লওয়া অয় নায়।

shuffle-indices-count-mismatch = shuffle-র লাগি দেওয়া indices-র সংখ্যা উপাদানের সংখ্যার লগে মিলে নায়, তাইন ইতা গণায় লওয়া অয় নায়।

indices-ignored-out-of-range = { $component }-র লাগি দেওয়া কিছু indices সীমার বাইরে, তাইন ইতা গণায় লওয়া অয় নায়।

pretzel-indices-repeated = pretzel-র লাগি দেওয়া কিছু indices দুইবার আইছে, তাইন ইতা গণায় লওয়া অয় নায়।

pretzel-circuit-first-index = circuit মোডো pretzel-র পয়লা index 1 অইতে অইব, তাইন দেওয়া indices গণায় লওয়া অয় নায়।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` স্ট্রিং সন্তান দিয়া কাম করতে অইলে একটা `type` বৈশিষ্ট্য দিতে অইব।

invalid-type-defaulting-to-math = { $component } উপাদানের লাগি ভুল type { $type }। math, text, number বা boolean-র একটা অইতে অইব। math ধরা অইল।

string-not-valid-component-to-arrange = স্ট্রিং "{ $value }" { $component } করার লাগি ঠিক উপাদান নায়। গণায় লওয়া অয় নায়।

## Types and variables

invalid-type-defaulting-to-number = ভুল type { $type }, type number ধরা অইল।

invalid-variable-value = চলকের ভুল মান: `{ $value }`

## Variants

variant-index-must-be-number = Variant index { $index } সংখ্যা অইতে অইব

variant-index-must-be-integer = Variant index { $index } পূর্ণসংখ্যা অইতে অইব

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` নিরপেক্ষ মাপের লাগি বানানো অয় নাই। চওড়া সাপেক্ষ ধরা অইল।

side-by-side-absolute-margins = `<{ $component }>` নিরপেক্ষ মাপের লাগি বানানো অয় নাই। কিনার সাপেক্ষ ধরা অইল।

side-by-side-no-block-child = ভুল `<{ $component }>`: ইতাত কমসেকম একটা ব্লক সন্তান থাকতে অইব।

## `<label>`

label-for-ignored-on-graphical = ছবিওয়ালা `<label>`-র উপরে `for` বৈশিষ্ট্য গণায় লওয়া অয় নায়।

label-for-must-resolve-to-one = `<label>`-র `for` বৈশিষ্ট্য ঠিক একটা উপাদানো লাগতে অইব।

label-for-unresolved = `<label>`-র `for` বৈশিষ্ট্য কোনো উপাদানো লাগানো গেছে নায়।

label-for-answer-with-authored-inputs = `<label>`-র `for` বৈশিষ্ট্য এমন একটা `<answer>`-রে দেখাইরার যেটার input লেখক নিজে দিছইন; input-রেউ সোজা দেখাইন।

label-for-answer-without-input = `<label>`-র `for` বৈশিষ্ট্য এমন একটা `<answer>`-রে দেখাইরার যেটার label দেওয়ার মতো কোনো input নাই।

label-for-must-reference-input-or-answer = `<label>`-র `for` বৈশিষ্ট্য একটা input বা একটা answer দেখাইতে অইব।

## Accessibility

accessibility-short-description-or-decorative = প্রবেশগম্যতার লাগি `<{ $component }>`-র একটা ছোট বিবরণ থাকতে অইব, নাইলে ইতারে decorative করতে অইব।

accessibility-video-short-description = প্রবেশগম্যতার লাগি `<video>`-র একটা ছোট বিবরণ থাকতে অইব।

accessibility-input-short-description-or-label = প্রবেশগম্যতার লাগি `<{ $component }>`-র একটা ছোট বিবরণ বা একটা label থাকতে অইব।

accessibility-answer-input-short-description-or-label = প্রবেশগম্যতার লাগি input বানায় এমন `<answer>`-র একটা ছোট বিবরণ বা একটা label থাকতে অইব।

accessibility-short-description-contains-math = ছোট বিবরণো `<{ $component }>`-র মতো গণিত উপাদান রাখা ঠিক নায়। গণিতটা কথা দিয়াউ লেখইন।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] বিভাগের শিরোনামের লেখার লাগি { $colorName }-র বৈসাদৃশ্য কম (কালা মোড) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; কমসেকম { $threshold }:1 লাগব)।
       *[other] বিভাগের শিরোনামের লেখার লাগি { $colorName }-র বৈসাদৃশ্য কম ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; কমসেকম { $threshold }:1 লাগব)।
    }

## `<circle>`

circle-through-points-non-numerical = বিন্দুইনতার সংখ্যা-মান নাই অইলে { $count } বিন্দু দিয়া `<circle>` এখনো বানানো অয় নাই।

circle-too-many-through-points = তিনটার বেশি বিন্দু দিয়া বৃত্ত হিসাব করা যায় নায়।

circle-overprescribed-radius-center-points = দেওয়া radius, center আর through বিন্দু তিনটাউ দিয়া বৃত্ত হিসাব করা যায় নায়।

circle-center-with-multiple-points = দেওয়া center-র লগে একটার বেশি বিন্দু দিয়া বৃত্ত হিসাব করা যায় নায়।

circle-radius-too-small = বৃত্ত হিসাব করা যায় নায়: দুই বিন্দুর মাঝের দূরত্ব { $distance }, তাইন দেওয়া radius { $radius } বেশি ছোট।

circle-radius-with-many-points = দেওয়া radius-র লগে দুইটার বেশি বিন্দু দিয়া বৃত্ত বানানো যায় নায়।

circle-invalid-center-or-through-points = বৃত্তের ভুল center বা through বিন্দু।

circle-radius-center-with-multiple-points = দেওয়া center-র লগে একটার বেশি বিন্দু দিয়া বৃত্তের radius হিসাব করা যায় নায়।

circle-change-radius-non-numerical = সংখ্যা-মান নাই এমন through বিন্দুওয়ালা বৃত্তের radius বদলানো যায় নায়

circle-radius-with-points-non-numerical = সংখ্যা-মান নাই অইলে দেওয়া radius-র লগে একটার বেশি বিন্দু দিয়া বৃত্ত বানানো যায় নায়।

circle-change-center-non-numerical = সংখ্যা-মান নাই এমন বিন্দু দিয়া বানানো বৃত্তের center বদলানো এখনো করা অয় নাই।

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] ফাংশনের domain-র মাত্রা কম। domain-ও { $intervals } ব্যবধান আছে অথচ ফাংশনো { $inputs ->
           *[other] { $inputs } input
        } আছে।
    }

function-domain-invalid-format = ফাংশনের domain-র ভুল ছাঁচ।

function-ignoring-non-numerical =
    { $type ->
        [maximum] ফাংশনের সংখ্যা নায় এমন সর্বোচ্চ মান গণায় লওয়া অয় নায়।
        [minimum] ফাংশনের সংখ্যা নায় এমন সর্বনিম্ন মান গণায় লওয়া অয় নায়।
        [extremum] ফাংশনের সংখ্যা নায় এমন চরম মান গণায় লওয়া অয় নায়।
        [point] ফাংশনের সংখ্যা নায় এমন বিন্দু গণায় লওয়া অয় নায়।
        [slope] ফাংশনের সংখ্যা নায় এমন ঢাল গণায় লওয়া অয় নায়।
       *[other] ফাংশনের সংখ্যা নায় এমন { $type } গণায় লওয়া অয় নায়।
    }

function-ignoring-empty =
    { $type ->
        [maximum] ফাংশনের খালি সর্বোচ্চ মান গণায় লওয়া অয় নায়।
        [minimum] ফাংশনের খালি সর্বনিম্ন মান গণায় লওয়া অয় নায়।
        [extremum] ফাংশনের খালি চরম মান গণায় লওয়া অয় নায়।
        [point] ফাংশনের খালি বিন্দু গণায় লওয়া অয় নায়।
       *[other] ফাংশনের খালি { $type } গণায় লওয়া অয় নায়।
    }

function-points-too-close = ফাংশনো এমন দুইটা বিন্দু আছে যেগুলি বেশি কাছাকাছি। ফাংশন ঠিক করা যায় নায়।

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] ফাংশনের input-র সংখ্যা আর output-র সংখ্যা সমান অইলেউ কেবল ফাংশন পুনরাবৃত্তি করা যায়। অউ ফাংশনো { $inputs } input আর { $outputs ->
           *[other] { $outputs } output
        } আছে।
    }

## `<sequence>`

sequence-invalid-length = অনুক্রমের ভুল দৈর্ঘ্য।  ঋণাত্মক নায় এমন পূর্ণসংখ্যা অইতে অইব।

sequence-invalid-step = অনুক্রমের ভুল step।  { $type } ধরনের অনুক্রমের লাগি একটা সংখ্যা অইতে অইব।

sequence-invalid-endpoint-number = number অনুক্রমের ভুল "{ $attribute }"।  একটা সংখ্যা অইতে অইব।

sequence-invalid-endpoint-letters = letters অনুক্রমের ভুল "{ $attribute }"।  অক্ষরের সংমিশ্রণ অইতে অইব।

sequence-invalid-endpoint = অনুক্রমের ভুল "{ $attribute }"।

select-from-sequence-coprime-not-numbers = সংখ্যা বাছা অইরার নায়, তাইন coprime গণায় লওয়া অয় নায়

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations দেওয়া আছে, তাইন coprime গণায় লওয়া অয় নায়

## Resolving a `target`

target-not-found = `<{ $source }>`-র লাগি ভুল target: target পাওয়া গেছে নায়।

target-state-variable-not-found = `<{ $source }>`-র লাগি ভুল target: `<{ $component }>`-ও "{ $property }" নামের কোনো অবস্থা-চলক পাওয়া গেছে নায়।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-র চলক স্বাধীন চলক থাকি আলাদা অইতে অইব।

ode-system-duplicate-variable-names = একউ নামের নির্ভরশীল চলক দিয়া ODE RHS ফাংশন ঠিক করা যায় নায়।

ode-system-rhs-function-error = ODE RHS ফাংশন ঠিক করা যায় নায়।  mathjs ফাংশন বানাইতে ত্রুটি অইছে।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } রেখার মাঝে কোণ ঠিক করা যায় নায়

angle-invalid-through-point = `<angle>`-র through-ও ভুল বিন্দু

parabola-vertex-too-many-points = vertex-র লগে একটার বেশি বিন্দু দিয়া পরাবৃত্ত এখনো বানানো অয় নাই।

parabola-too-many-points = তিনটার বেশি বিন্দু দিয়া পরাবৃত্ত এখনো বানানো অয় নাই।

intersection-too-many-items = দুইটার বেশি জিনিসের ছেদ এখনো বানানো অয় নাই

## Other math components

ionic-compound-not-two-ions = দুইটা আয়ন ছাড়া আর কিছুর লাগি আয়নিক যৌগ এখনো বানানো অয় নাই।

ionic-compound-needs-cation-and-anion = আয়নিক যৌগ খালি একটা ক্যাটায়ন আর একটা আয়নের লাগিউ বানানো অইছে।

solve-equations-cannot-evaluate = সমীকরণের মান বাইর করা গেছে নায়, তাইন ইতা সমাধান করা যায় নায়: { $equation }

math-operators-operand-number-required = গণিতের operand বাইর করার সময় একটা operandNumber দিতে অইব।

eigen-decomposition-failed = ম্যাট্রিক্সের eigenvalue হিসাব করা গেছে নায়

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: { $parameters } parameter pattern-ও নাই, তাইন ইতা সবসময় খালিউ মিলাইব।
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" বুঝা যায় নায়। ইতা none, medium, dense, বা খালি জায়গা দিয়া আলাদা করা দুইটা ধনাত্মক সংখ্যা অইতে অইব, যেমন grid="1 0.5"। কোনো grid আঁকা অয় নাই।

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>`-র লাগি { $expected ->
        [1] একটা output-অলা ফাংশন লাগে, মানে প্রতি বিন্দুর ঢাল y', যেমন `y - x`
       *[other] দুইটা output-অলা ফাংশন লাগে, মানে প্রতি বিন্দুর ভেক্টর, যেমন `(y, -x)`
    }, অথচ যেই ফাংশন দেওয়া অইছে ইতাত { $found ->
       *[other] { $found } output
    } আছে। { $alternative ->
        [none] কিছুউ আঁকা অয় নাই।
       *[other] অউ ফাংশনের লাগি `<{ $alternative }>` উপাদানটাউ ঠিক। কিছুউ আঁকা অয় নাই।
    }

field-function-attribute-ignored-with-child = ফাংশনটা উপাদানের ভিতরেউ দেওয়া আছে, তাইন `function` বৈশিষ্ট্য গণায় লওয়া অয় নায়; ভিতরেরটাউ কামে লাগে। ফাংশন দুই রকমের একটা রকমেউ দিইন।

field-variables-ignored =
    `<{ $component }>`: `variables` বৈশিষ্ট্য উপাদানের ভিতরে সোজা লেখা রাশির চলকইনতার নাম কয়। { $reason ->
        [function-child] এখানে ফাংশনটা একটা `<function>` সন্তান হিসাবে দেওয়া আছে, যেটা নিজের চলক নিজেউ কয়, তাইন `variables` গণায় লওয়া অয় নায়।
       *[no-expression] এখানে এমন কোনো রাশি দেওয়া নাই, তাইন `variables` গণায় লওয়া অয় নায়।
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure রেন্ডারারো xLabelPosition="left" চলে নায়; right-position-র আচরণ কামে লাগানো অইল।

prefigure-y-label-position-unsupported = `<graph>`: prefigure রেন্ডারারো yLabelPosition="bottom" চলে নায়; top-position-র আচরণ কামে লাগানো অইল।

prefigure-invalid-axis-bounds = `<graph>`: prefigure রূপান্তরের লাগি ভুল অক্ষ-সীমা; আগে থাকি ঠিক করা bbox (-10,-10,10,10) কামে লাগানো অইল।

prefigure-invalid-width = `<graph>`: prefigure রূপান্তরের লাগি ভুল চওড়া; আগে থাকি ঠিক করা নকশার চওড়া 425 কামে লাগানো অইল।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure রূপান্তরের লাগি ভুল aspectRatio; আগে থাকি ঠিক করা অনুপাত 1 কামে লাগানো অইল।

prefigure-grid-spacing-too-fine = `<graph>`: অক্ষের সীমার তুলনায় গ্রিডের ফাঁক বেশি চিকন; prefigure রেন্ডারারো গ্রিড বাদ দেওয়া অইল।

prefigure-annotations-not-rendered = `<graph>`: PreFigure রেন্ডারার কামে না লাগাইলে টীকা আঁকা অয় নায়।

multiple-annotations-children = `<graph>`-ও একের বেশি `<annotations>` সন্তান পাওয়া গেছে; শেষেরটা ছাড়া বাকি সবগুলি গণায় লওয়া অয় নায়।

## Referring to other components

copy-unrecognized-component-type = চিনা যায় নায় এমন উপাদান-ধরন বাড়ানো বা নকল করা যায় নায়: { $type }।

copy-prop-not-found = { $component } ধরনের উপাদানো { $property } prop পাওয়া গেছে নায়

collect-no-source = collect-র লাগি কোনো উৎস পাওয়া গেছে নায়।

collect-invalid-component-type = `<{ $component }>` ঠিক উপাদান-ধরন নায়, তাইন অউ ধরনের উপাদান collect করা যায় নায়।

reference-index-unavailable = index `{ $reference }` দেখানো যায় নায়

## `<callAction>`

component-action-unavailable = `{ $reference }` উপাদানো { $action } ডাকা যায় নায়

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ডেটার আকার ভুল।  সারিইনতার দৈর্ঘ্য একরকম নায়। componentIdx :{ $componentIdx }-ও পাওয়া গেছে

data-frame-duplicate-column-names = ডেটাত একউ স্তম্ভের নাম দুইবার আছে।  componentIdx :{ $componentIdx }-ও পাওয়া গেছে

data-frame-missing-column-name = ডেটাত একটা স্তম্ভের নাম নাই।  componentIdx :{ $componentIdx }-ও পাওয়া গেছে

## `<answer>` and scoring

answer-award-depends-on-own-response = অউ জুয়াপের একটা award অউ answer ট্যাগের নিজের পাঠানো জুয়াপের উপরে নির্ভর করে, ইতাত অপ্রত্যাশিত আচরণ অইব।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork`-ওয়ালা পাত্রের ভিতরের `<answer>`-ও `maxNumAttempts` দিলে কোনো কাম অয় নায়, কারণ সুযোগের সংখ্যা পাত্রটাউ ঠিক করে। `maxNumAttempts` পাত্রের উপরেউ দিইন।

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork`-ওয়ালা আরেকটা পাত্রের ভিতরের `sectionWideCheckWork`-ওয়ালা পাত্রো `maxNumAttempts` দিলে কোনো কাম অয় নায়, কারণ সুযোগের সংখ্যা বাইরের পাত্রটাউ ঠিক করে। `maxNumAttempts` বাইরের পাত্রের উপরেউ দিইন।

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] symbolicEquality দেওয়া না থাকলে { $attributes } বৈশিষ্ট্যের কোনো কাম অইত নায়।
    }

answer-invalid-type = জুয়াপের লাগি ভুল type: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` উপাদানের কোনো নাম নাই, তাইন ইতা module-র বৈশিষ্ট্য হিসাবে কামে লাগানো যায় নায়

module-attribute-name-already-defined = `<module>` উপাদান-ধরনো "{ $name }" নামের বৈশিষ্ট্য আগেউ ঠিক করা আছে, তাইন `<{ $component } name="{ $name }">` উপাদানটা module-র বৈশিষ্ট্য হিসাবে কামে লাগানো যায় নায়।

conditional-content-condition-ignored = case বা else সন্তানওয়ালা `<conditionalContent>` উপাদানো `condition` বৈশিষ্ট্য গণায় লওয়া অয় নায়।

slider-markers-type-mismatch = Marker-র ধরন slider-র ধরনের লগে মিলে নায়।

pretzel-problem-needs-statement-and-answer = ভুল pretzel: প্রতিটা `<problem>`-ও একটা `<statement>` আর একটা `<answer>` থাকতে অইব।

pretzel-circuit-first-problem-distractor = ভুল pretzel: mode="circuit"-ও পয়লা `<problem>` distractor অইতে পারে নায়।

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] `{ $attribute }` বৈশিষ্ট্যের লাগি ভুল মান { $values }; গণায় লওয়া অয় নায়।
    }

attribute-must-be-references = `{ $attribute }` বৈশিষ্ট্যের লাগি ভুল মান `{ $value }`। বৈশিষ্ট্যটা `$` দিয়া শুরু অওয়া সন্দর্ভ দিয়া বানাইতে অইব।

math-input-invalid-function-names = <mathInput>: { $attribute }-ও থাকা ভুল ফাংশন-নাম গণায় লওয়া অয় নায়: { $names }। প্রতিটা নামের দেখানোর অংশ কমসেকম 2 অক্ষরের (অক্ষর বা ড্যাশ) অইতে অইব; পিছে একটা `|<mathspeak alternative>` লাগানো যাইতে পারে।

## Building components from the source

component-type-invalid = ভুল উপাদান-ধরন: `<{ $componentType }>`

attribute-repeated = { $attribute } বৈশিষ্ট্য দুইবার দেওয়া যায় নায়।

attribute-invalid-for-component = `<{ $componentType }>` ধরনের উপাদানের লাগি ভুল বৈশিষ্ট্য "{ $attribute }"।

## Style definition contrast

style-definition-insufficient-contrast =
    শৈলী-সংজ্ঞা { $styleNumber }-ও { $context ->
        [text-on-background] পটভূমির রঙের লগে লেখার রঙের
        [high-contrast] ক্যানভাসের লগে উচ্চ-বৈসাদৃশ্য রঙের
        [line] ক্যানভাসের লগে রেখার রঙের
        [marker] ক্যানভাসের লগে marker-র রঙের
       *[text-on-canvas] ক্যানভাসের লগে লেখার রঙের
    } বৈসাদৃশ্য কম{ $mode ->
        [dark] { " (কালা মোড)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; কমসেকম { $threshold }:1 লাগব)।

style-definition-dark-mode-text-background-contrast =
    শৈলী-সংজ্ঞা { $styleNumber }-ও দেওয়া রঙ ধলা মোডের লাগি যথেষ্ট বৈসাদৃশ্য দেয় ঠিকউ, অথচ অউ মান থাকি বানানো কালা মোডের রঙো পটভূমির রঙের লগে লেখার রঙের বৈসাদৃশ্য কম ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; কমসেকম { $threshold }:1 লাগব)। { $suggestion ->
        [available] কালা মোডো যথেষ্ট বৈসাদৃশ্য পাইতে অইলে ধলা মোডের বৈসাদৃশ্য বাড়াইন (যেমন { $lightAttribute }="{ $lightColor }" দিইন), নাইলে কালা মোডের রঙ নিজেউ ঠিক করইন (যেমন { $darkAttribute }="{ $darkColor }")।
       *[none] কালা মোডো যথেষ্ট বৈসাদৃশ্য পাইতে অইলে ধলা মোডের বৈসাদৃশ্য বাড়াইন, নাইলে textColorDarkMode আর/বা backgroundColorDarkMode দিয়া বানানো রঙ নিজেউ ঠিক করইন।
    }

style-definition-dark-mode-text-canvas-contrast =
    শৈলী-সংজ্ঞা { $styleNumber }-ও দেওয়া লেখার রঙ ধলা মোডের লাগি যথেষ্ট বৈসাদৃশ্য দেয় ঠিকউ, অথচ অউ মান থাকি বানানো কালা মোডের লেখার রঙের ক্যানভাসের লগে বৈসাদৃশ্য কম ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; কমসেকম { $threshold }:1 লাগব)। { $suggestion ->
        [available] কালা মোডো যথেষ্ট বৈসাদৃশ্য পাইতে অইলে ধলা মোডের বৈসাদৃশ্য বাড়াইন (যেমন textColor="{ $lightColor }" দিইন), নাইলে কালা মোডের রঙ নিজেউ ঠিক করইন (যেমন textColorDarkMode="{ $darkColor }")।
       *[none] কালা মোডো যথেষ্ট বৈসাদৃশ্য পাইতে অইলে ধলা মোডের বৈসাদৃশ্য বাড়াইন, নাইলে textColorDarkMode দিয়া বানানো রঙ নিজেউ ঠিক করইন।
    }

section-multiple-style-palettes = একটা বিভাগ খালি একটা <stylePalette> বাছতে পারে; শেষেরটা কামে লাগানো অইল।

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect ঋণাত্মক নায় এমন পূর্ণসংখ্যা নায়, তাইন { $component }-র অনন্য variant ঠিক করা যায় নায়।

variant-num-to-select-not-constant-number = numToSelect ধ্রুব সংখ্যা নায়, তাইন { $component }-র অনন্য variant ঠিক করা যায় নায়।

variant-with-replacement-not-constant-boolean = withReplacement ধ্রুব boolean নায়, তাইন { $component }-র অনন্য variant ঠিক করা যায় নায়।

variant-select-weight-disables-unique = selectWeight বা selectForVariants দেওয়া কোনো option থাকলে select-র অনন্য variant বন্ধ অইযায়

variant-coprime-undetermined = coprime সবসময় মিছা কি না ঠিক করা যায় নায়, তাইন { $component }-র অনন্য variant ঠিক করা যায় নায়।

variant-attribute-not-constant = { $attribute } ধ্রুব নায়, তাইন { $component }-র অনন্য variant ঠিক করা যায় নায়।

variant-attribute-not-number = { $attribute } সংখ্যা নায়, তাইন { $component }-র অনন্য variant ঠিক করা যায় নায়।

variant-attribute-wrong-type-for-sequence =
    { $attribute } { $expected ->
        [letters-combination] অক্ষরের সংমিশ্রণ
        [math-expression] ঠিক গণিত রাশি
        [integer] পূর্ণসংখ্যা
       *[number] সংখ্যা
    } নায়, তাইন { $type } ধরনের { $component }-র অনন্য variant ঠিক করা যায় নায়।

variant-length-not-integer = length পূর্ণসংখ্যা নায়, তাইন { $component }-র অনন্য variant ঠিক করা যায় নায়।

variant-sort-not-implemented = sort-ওয়ালা { $component }-র অনন্য variant এখনো বানানো অয় নাই

variant-exclude-combinations-not-implemented = excludeCombinations-ওয়ালা { $component }-র অনন্য variant এখনো বানানো অয় নাই

variant-math-exclude-not-implemented = exclude-ওয়ালা math ধরনের { $component }-র অনন্য variant এখনো বানানো অয় নাই

variant-non-constant-exclude-not-implemented = ধ্রুব নায় এমন exclude-ওয়ালা { $component }-র অনন্য variant এখনো বানানো অয় নাই

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure রেন্ডারারো চলে নায়; বংশধর বাদ দেওয়া অইল।

prefigure-descendant-invalid-geometry = { $subject }: সসীম নায় বা অসম্পূর্ণ জ্যামিতি; বংশধর বাদ দেওয়া অইল।

prefigure-curve-label-omitted = { $subject }: রূপান্তর করা বক্র উপাদানো label চলে নায়; label বাদ দেওয়া অইল।

prefigure-curve-unsupported-definition-type = { $subject }: চলে নায় এমন বক্র ফাংশন-সংজ্ঞার ধরন '{ $definitionType }'; বংশধর বাদ দেওয়া অইল।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves-ও চলে নায় এমন flipFunctions বৈশিষ্ট্য; বংশধর বাদ দেওয়া অইল।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves-ও খালি formula ধরনের সন্তান ফাংশনউ চলে; বংশধর বাদ দেওয়া অইল।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] রেখা-পরিবারের label
       *[point] বিন্দুর label
    }-র লাগি চলে নায় এমন labelPosition '{ $labelPosition }'; আগে থাকি ঠিক করা PreFigure সারিবদ্ধতা কামে লাগানো অইল।

prefigure-fill-style-unsupported = { $subject }: ভরাটের শৈলী '{ $fillStyle }' PreFigure-ও চলে নায়; ঠাসা ভরাট কামে লাগানো অইল।

prefigure-line-style-unknown = { $subject }: অচেনা রেখা-শৈলী '{ $lineStyle }' PreFigure-র লেখা থাকি বাদ দেওয়া অইল।

prefigure-marker-style-mapped-to-diamond = { $subject }: marker শৈলী '{ $markerStyle }' PreFigure-র 'diamond' শৈলীও বদলানো অইল।

prefigure-marker-style-unsupported = { $subject }: marker শৈলী '{ $markerStyle }' PreFigure-ও চলে নায়; আগে থাকি ঠিক করা শৈলী কামে লাগানো অইল।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ভুল `ref`; target ঠিক করা যায় নায়। টীকা বাদ দেওয়া অইল।

annotation-ref-multiple-targets = `<annotation>`: `ref` একের বেশি target-ও লাগছে; পয়লা target কামে লাগানো অইল।

annotation-ref-outside-graph = `<annotation>`: ভুল `ref`; target যেই graph-র ভিতরে থাকার কথা ইতার বাইরে। টীকা বাদ দেওয়া অইল।

annotation-ref-unsupported-target = `<annotation>`: ভুল `ref`; prefigure রূপান্তরো target চলে এমন ছবির জিনিস নায়। টীকা বাদ দেওয়া অইল।

annotation-text-missing = `<annotation>`: `text` নাই বা খালি; খালি লেখা বাইর করা অইল।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] চক্রাকার নির্ভরতা পাওয়া গেছে।
       *[other] `<{ $componentType }>` উপাদানের লগে জড়িত চক্রাকার নির্ভরতা পাওয়া গেছে।
    }

reference-no-referent = সন্দর্ভের লাগি কোনো লক্ষ্য পাওয়া গেছে নায়: `{ $reference }`

reference-multiple-referents = সন্দর্ভের লাগি একের বেশি লক্ষ্য পাওয়া গেছে: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>`-র { $attribute } বৈশিষ্ট্যের ভুল ছাঁচ।

children-invalid = `<{ $componentType }>`-র লাগি ভুল সন্তান: ভুল সন্তান পাওয়া গেছে: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` বৈশিষ্ট্যের লাগি ভুল মান `{ $value }`, `{ $default }` মান কামে লাগানো অইল

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML সংস্করণ { $version } পাওয়া গেছে নায়।
       *[other] DoenetML সংস্করণ { $version } পাওয়া গেছে নায়। সংস্করণ { $fallback }-ও ফিরা যাওয়া অইল
    }

## Reading the DoenetML

parse-invalid-doenetml = ভুল DoenetML: { $content }

parse-tag-missing-close-tag = ভুল DoenetML: `{ $tag }` ট্যাগের কোনো বন্ধ ট্যাগ নাই। নিজেউ বন্ধ অওয়া ট্যাগ বা একটা `</{ $tagName }>` ট্যাগ লাগব।

parse-tag-error = ভুল DoenetML: `<{ $tagName }>` ট্যাগো ত্রুটি

parse-attribute-missing-value = ভুল DoenetML: ভুল বৈশিষ্ট্য `{ $attribute }`-র মান নাই বইলা মনে অইরার।

parse-attribute-invalid = ভুল DoenetML: ভুল বৈশিষ্ট্য `{ $attribute }`

parse-attribute-value-invalid = ভুল DoenetML: ভুল বৈশিষ্ট্যের মান `{ $value }`

parse-attribute-value-quote-mismatch = ভুল DoenetML: ভুল বৈশিষ্ট্যের মান `{ $value }`। উদ্ধৃতি চিহ্ন মিলে নায়। একটা `{ $quote }` নাই বইলা মনে অইরার

parse-open-tag-name-missing = ভুল DoenetML: নাম নাই এমন একটা ট্যাগ পাওয়া গেছে, যেমন `<`

parse-tag-not-closed = ভুল DoenetML: `{ $tag }` ট্যাগ বন্ধ করা অয় নাই (একটা `>` নাই বইলা মনে অইরার)।

parse-self-closing-tag-name-missing = ভুল DoenetML: নাম নাই এমন একটা ট্যাগ পাওয়া গেছে `<{ $content }>`

parse-self-closing-tag-not-closed = ভুল DoenetML: `{ $tag }` ট্যাগ বন্ধ করা অয় নাই (`/>` নাই বইলা মনে অইরার)।

parse-tag-invalid-attributes = ভুল DoenetML: `{ $tag }` ট্যাগ ঠিক নায়। ইতার বৈশিষ্ট্য ভুল অইতে পারে।

parse-close-tag-name-missing = ভুল DoenetML: নাম নাই এমন একটা বন্ধ ট্যাগ পাওয়া গেছে, যেমন `</`

parse-attribute-value-unquoted = বৈশিষ্ট্যের মান উদ্ধৃতি চিহ্নের ভিতরে রাখতে অইব: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = ভুল DoenetML: `{ $tag }` বন্ধ ট্যাগ পাওয়া গেছে, অথচ ইতার কোনো খোলা ট্যাগ নাই

parse-close-tag-mismatched = ভুল DoenetML: বন্ধ ট্যাগ মিলে নায়। `</{ $expected }>` লাগব। `{ $found }` পাওয়া গেছে

parser-node-unconvertible = { $node } নোডটা Dast নোডো বদলানো গেছে নায়।

## Names

name-attribute-invalid =
    ভুল বৈশিষ্ট্য name='{ $name }'। { $reason ->
        [characters] নামো খালি অক্ষর, সংখ্যা, আন্ডারস্কোর বা হাইফেন থাকতে পারে।
       *[start] নাম অক্ষর দিয়া শুরু অইতে অইব।
    }

component-name-invalid-start = ভুল উপাদানের নাম "{ $name }"। নাম অক্ষর দিয়া শুরু অইতে অইব।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched ধরনের answer-র একটা video বৈশিষ্ট্য থাকতে অইব

answer-video-watched-video-not-reference = videoWatched ধরনের answer-র video বৈশিষ্ট্য একটা সন্দর্ভ অইতে অইব

answer-name-not-single-text = Answer-র name বৈশিষ্ট্যো খালি একটা text সন্তান থাকতে অইব

## Referencing another document

external-doenetml-recursion-limit = বেশি স্তরের পুনরাবৃত্তির লাগি বাইরের DoenetML আনা গেছে নায়। কোনো চক্রাকার সন্দর্ভ আছে নি?

external-doenetml-unavailable = { $attribute }="{ $uri }" থাকি DoenetML আনা গেছে নায়

external-doenetml-type-mismatch = { $attribute }="{ $uri }" থাকি আনা DoenetML ভুল: ইতা "{ $componentType }" উপাদান-ধরনের লগে মিলে নায়

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` বৈশিষ্ট্য পুরানা অইগেছে; ইতার বদলে `{ $to }` কামে লাগাইন।
       *[other] [deprecation] `<{ $component }>`-র `{ $from }` বৈশিষ্ট্য পুরানা অইগেছে; ইতার বদলে `{ $to }` কামে লাগাইন।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }`-ও দেওয়া আছে, তাইন `{ $from }` বৈশিষ্ট্য পুরানা অইগেছে আর গণায় লওয়া অয় নায়।
       *[other] [deprecation] `<{ $component }>`-র `{ $from }` বৈশিষ্ট্য পুরানা অইগেছে আর `{ $to }`-ও দেওয়া আছে বইলা গণায় লওয়া অয় নায়।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`-র `{ $attribute }` বৈশিষ্ট্য পুরানা অইগেছে আর গণায় লওয়া অয় নায়।

deprecated-attribute-to-child = [deprecation] `<{ $component }>`-র `{ $attribute }` বৈশিষ্ট্য পুরানা অইগেছে; ইতার বদলে একটা `<{ $child }>` সন্তান কামে লাগাইন।

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>`-র `{ $attribute }` বৈশিষ্ট্যের `{ $value }` মান পুরানা অইগেছে; ইতার বদলে `{ $to }` কামে লাগাইন।


## Language coverage

pluralize-english-only = `<pluralize>` খালি ইংরাজিরউ বহুবচন বানাইতে পারে, তাইন { $locale } ভাষায় লেখা দলিলো ইতার লেখা যেমন আছিল তেমনউ থাকে। বহুবচন রূপটা সোজা লেখইন, নাইলে `pluralForm` বৈশিষ্ট্য দিয়া দিইন।


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` উপাদান Doenet-র চিনা উপাদান নায়।

schema-element-not-allowed-at-root = `<{ $tag }>` উপাদান দলিলের গোড়াত রাখা যায় নায়।

schema-element-not-allowed-inside = `<{ $tag }>` উপাদান `<{ $parent }>`-র ভিতরে রাখা যায় নায়।

schema-attribute-unrecognized = `<{ $tag }>` উপাদানের `{ $attribute }` নামের কোনো বৈশিষ্ট্য নাই।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` উপাদানের `{ $attribute }` বৈশিষ্ট্য এমন একটা তালিকা অইতে অইব যেটার প্রতিটা জিনিস ইতার একটা: { $allowed }
       *[other] `<{ $tag }>` উপাদানের `{ $attribute }` বৈশিষ্ট্য ইতার একটা অইতে অইব: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select-র লাগি ভুল variant নাম।  Variant নাম { $variantName } { $numOptions } option-ও আছে অথচ বাছার সংখ্যা { $numToSelect }।

select-variant-name-without-options = select-র লাগি কিছু variant দেওয়া আছে অথচ সম্ভব variant নাম { $variantName }-র লাগি কোনো option দেওয়া নাই।

select-variant-name-not-possible = select-র লাগি দেওয়া variant নাম { $variantName } সম্ভব variant নাম নায়।

select-too-few-options = খালি { $numOptions } থাকতে { $numToSelect } উপাদান বাছা যায় নায়।

select-from-sequence-too-few-values = { $length } দৈর্ঘ্যের অনুক্রম থাকি { $numToSelect } মান বাছা যায় নায়।

select-from-sequence-indices-count-mismatch = select-র লাগি দেওয়া indices-র সংখ্যা বাছার সংখ্যার লগে মিলতে অইব

select-from-sequence-indices-not-integers = select-র লাগি দেওয়া সব indices পূর্ণসংখ্যা অইতে অইব

select-from-sequence-index-excluded = selectfromsequence-র যেই index দেওয়া অইছে ইতা বাদ দেওয়া আছিল

select-from-sequence-indices-excluded-combination = selectfromsequence-র যেই indices দেওয়া অইছে ইতা বাদ দেওয়া সংমিশ্রণ আছিল

select-from-sequence-coprime-not-positive-integers = ধনাত্মক পূর্ণসংখ্যা বাছা অইরার নায়, তাইন coprime সংমিশ্রণ বাছা যায় নায়।

select-from-sequence-coprime-common-factor = Coprime সংখ্যা বাছা যায় নায়। সব সম্ভব মানের একটা সাধারণ উৎপাদক আছে। ("from" বা "to"-র দেওয়া মান "step"-র লগে coprime অইতে অইব।)

select-from-sequence-coprime-single-number = 1 নায় এমন একটাউ সংখ্যা থাকি coprime সংমিশ্রণ বাছা যায় নায়।

select-from-sequence-excluded-too-many-combinations = selectFromSequence-ও সংমিশ্রণের 70%-র বেশি বাদ দেওয়া অইছে

select-from-sequence-coprime-none-found = Coprime সংখ্যা বাছা গেছে নায়। সব সম্ভব মানের একটা সাধারণ উৎপাদক আছে।

select-from-sequence-too-few-unique-values = { $numPossibleValues } দৈর্ঘ্যের অনুক্রম থাকি { $numToSelect } অনন্য মান বাছা যায় নায়

select-prime-numbers-too-few-values = { $numValues } দৈর্ঘ্যের মৌলিক সংখ্যার তালিকা থাকি { $numToSelect } মান বাছা যায় নায়

select-prime-numbers-values-count-mismatch = select-র লাগি দেওয়া মানের সংখ্যা বাছার সংখ্যার লগে মিলতে অইব

select-prime-numbers-values-not-prime = select prime number-র লাগি দেওয়া সব মান মৌলিক সংখ্যার তালিকাত থাকতে অইব

select-prime-numbers-values-excluded-combination = selectPrimeNumbers-র যেই মান দেওয়া অইছে ইতা বাদ দেওয়া সংমিশ্রণ আছিল

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-ও সংমিশ্রণের 70%-র বেশি বাদ দেওয়া অইছে

select-random-combination-fluke = খুবউ অসম্ভব একটা ঘটনায়, এলোমেলো মানের সংমিশ্রণ বাছা গেছে নায়

select-random-value-fluke = খুবউ অসম্ভব একটা ঘটনায়, এলোমেলো মান বাছা গেছে নায়

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] অউ `<{ $component }>` গণিতের ভিতরে আছে অথচ `inline` নায়, তাইন ইতা দেখানো অয় নায়। `inline` দিইন, তাইলে ইতা ড্রপ-ডাউন তালিকা অইব, যেটা রাশির ভিতরে আঁটে।
        [expanded] অউ `<{ $component }>` গণিতের ভিতরে আছে আর `expanded`, তাইন ইতা দেখানো অয় নায়। `expanded` সরাইন; অনেক লাইনের বাকসো রাশির ভিতরে আঁটে নায়।
        [on-graph] অউ `<{ $component }>` graph-র উপরে আঁকা গণিতের ভিতরে আছে, ইতাত input-র জায়গা নাই, তাইন ইতা দেখানো অয় নায়।
       *[relative-width] অউ `<{ $component }>` গণিতের ভিতরে আছে আর ইতার চওড়া সাপেক্ষ, তাইন ইতা দেখানো অয় নায়। চওড়াটা `px`-র মতো নিরপেক্ষ এককো দিইন।
    }
