# Bangla diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
#
# A counted noun is not pluralized in Bangla, so the two branches of a plural
# selector read the same wherever only the noun would have changed.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] দুটি প্রান্তবিন্দু নির্দিষ্ট করা থাকলে { $attributes } উপেক্ষা করা হয়
       *[other] দুটি প্রান্তবিন্দু নির্দিষ্ট করা থাকলে { $attributes } উপেক্ষা করা হয়
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] একটি প্রান্তবিন্দু ও একটি মধ্যবিন্দু দুটিই নির্দিষ্ট করা থাকলে { $attributes } উপেক্ষা করা হয়
       *[other] একটি প্রান্তবিন্দু ও একটি মধ্যবিন্দু দুটিই নির্দিষ্ট করা থাকলে { $attributes } উপেক্ষা করা হয়
    }

line-segment-midpoint-offset-without-midpoint = মধ্যবিন্দু ছাড়া midpointOffset-এর কোনো প্রভাব নেই

## `<line>`

line-points-undetermined-dimensions = অনির্ধারিত মাত্রার বিন্দুর মধ্য দিয়ে যাওয়া রেখা।

line-points-too-few-dimensions = রেখাকে অন্তত দুই মাত্রার বিন্দুর মধ্য দিয়ে যেতে হবে।

line-points-depend-on-variables = রেখাটি এমন বিন্দুর মধ্য দিয়ে যায় যা চলকের উপর নির্ভর করে: { $variables }।

line-equation-invalid-format = { $variable1 } ও { $variable2 } চলকে রেখার সমীকরণের বিন্যাস অবৈধ।

## `<ray>`

ray-overprescribed-through = রশ্মিটি through, endpoint ও direction দিয়ে নির্ধারিত।  নির্দিষ্ট করা through উপেক্ষা করা হচ্ছে।

ray-dimension-mismatch = রশ্মিতে numDimensions মিলছে না।

## `<vector>`

vector-overprescribed-head = ভেক্টরটি head, tail ও displacement দিয়ে নির্ধারিত।  নির্দিষ্ট করা head উপেক্ষা করা হচ্ছে।

vector-dimension-mismatch = ভেক্টরে numDimensions মিলছে না।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>`-এর দিকে আকর্ষণ করা যাচ্ছে না, কারণ এর nearestPoint স্টেট ভেরিয়েবল নেই।

constrain-to-without-nearest-point = `<{ $component }>`-এর সাপেক্ষে সীমাবদ্ধ করা যাচ্ছে না, কারণ এর nearestPoint স্টেট ভেরিয়েবল নেই।

constrain-to-interior-without-nearest-point = `<{ $component }>`-এর অভ্যন্তরে সীমাবদ্ধ করা যাচ্ছে না, কারণ এর nearestPoint স্টেট ভেরিয়েবল নেই।

## `<choiceInput>`

choice-input-label-position-ignored = ইনলাইন নয় এমন choiceInput-এর জন্য labelPosition উপেক্ষা করা হয়

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-এর জন্য নির্দিষ্ট করা সূচক উপেক্ষা করা হচ্ছে, কারণ সূচকের সংখ্যা choice সন্তানের সংখ্যার সাথে মিলছে না।

pretzel-indices-count-mismatch = problem-এর জন্য নির্দিষ্ট করা সূচক উপেক্ষা করা হচ্ছে, কারণ সূচকের সংখ্যা problem সন্তানের সংখ্যার সাথে মিলছে না।

shuffle-indices-count-mismatch = shuffle-এর জন্য নির্দিষ্ট করা সূচক উপেক্ষা করা হচ্ছে, কারণ সূচকের সংখ্যা উপাদানের সংখ্যার সাথে মিলছে না।

indices-ignored-out-of-range = { $component }-এর জন্য নির্দিষ্ট করা সূচক উপেক্ষা করা হচ্ছে, কারণ কিছু সূচক সীমার বাইরে।

pretzel-indices-repeated = pretzel-এর জন্য নির্দিষ্ট করা সূচক উপেক্ষা করা হচ্ছে, কারণ কিছু সূচকের পুনরাবৃত্তি হয়েছে।

pretzel-circuit-first-index = circuit মোডে pretzel-এর জন্য নির্দিষ্ট করা সূচক উপেক্ষা করা হচ্ছে, কারণ প্রথম সূচকটি 1 হতে হবে।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` স্ট্রিং সন্তানের সাথে কাজ করতে হলে একটি `type` অ্যাট্রিবিউট নির্দিষ্ট করতে হবে।

invalid-type-defaulting-to-math = { $component } উপাদানের জন্য { $type } ধরনটি অবৈধ। math, text, number বা boolean-এর একটি হতে হবে। math ধরে নেওয়া হচ্ছে।

string-not-valid-component-to-arrange = "{ $value }" স্ট্রিংটি { $component } করার জন্য বৈধ উপাদান নয়। উপেক্ষা করা হচ্ছে।

## Types and variables

invalid-type-defaulting-to-number = { $type } ধরনটি অবৈধ, ধরন number করা হচ্ছে।

invalid-variable-value = একটি চলকের মান অবৈধ: `{ $value }`

## Variants

variant-index-must-be-number = রূপভেদের সূচক { $index } একটি সংখ্যা হতে হবে

variant-index-must-be-integer = রূপভেদের সূচক { $index } একটি পূর্ণসংখ্যা হতে হবে

## `<sideBySide>`

side-by-side-absolute-widths = পরম পরিমাপের জন্য `<{ $component }>` বাস্তবায়িত হয়নি। প্রস্থ আপেক্ষিক করা হচ্ছে।

side-by-side-absolute-margins = পরম পরিমাপের জন্য `<{ $component }>` বাস্তবায়িত হয়নি। মার্জিন আপেক্ষিক করা হচ্ছে।

side-by-side-no-block-child = `<{ $component }>` অবৈধ: এতে অন্তত একটি ব্লক সন্তান থাকতে হবে।

## `<label>`

label-for-ignored-on-graphical = লৈখিক `<label>`-এর উপর `for` অ্যাট্রিবিউট উপেক্ষা করা হয়।

label-for-must-resolve-to-one = `<label>`-এর উপর `for` অ্যাট্রিবিউটকে ঠিক একটি উপাদানে নির্ধারিত হতে হবে।

label-for-unresolved = `<label>`-এর উপর `for` অ্যাট্রিবিউটকে কোনো উপাদানে নির্ধারণ করা যায়নি।

label-for-answer-with-authored-inputs = `<label>`-এর উপর `for` অ্যাট্রিবিউট এমন একটি `<answer>` নির্দেশ করে যার ইনপুট আলাদাভাবে লেখা হয়েছে; সরাসরি সেই ইনপুটটিকেই নির্দেশ করুন।

label-for-answer-without-input = `<label>`-এর উপর `for` অ্যাট্রিবিউট এমন একটি `<answer>` নির্দেশ করে যার লেবেল দেওয়ার মতো কোনো ইনপুট নেই।

label-for-must-reference-input-or-answer = `<label>`-এর উপর `for` অ্যাট্রিবিউটকে একটি ইনপুট বা একটি answer নির্দেশ করতে হবে।

## Accessibility

accessibility-short-description-or-decorative = প্রবেশযোগ্যতার জন্য `<{ $component }>`-এর হয় একটি সংক্ষিপ্ত বিবরণ থাকতে হবে, নয়তো একে অলংকরণ হিসেবে চিহ্নিত করতে হবে।

accessibility-video-short-description = প্রবেশযোগ্যতার জন্য `<video>`-এর একটি সংক্ষিপ্ত বিবরণ থাকতে হবে।

accessibility-input-short-description-or-label = প্রবেশযোগ্যতার জন্য `<{ $component }>`-এর একটি সংক্ষিপ্ত বিবরণ বা একটি লেবেল থাকতে হবে।

accessibility-answer-input-short-description-or-label = প্রবেশযোগ্যতার জন্য ইনপুট তৈরি করে এমন `<answer>`-এর একটি সংক্ষিপ্ত বিবরণ বা একটি লেবেল থাকতে হবে।

accessibility-short-description-contains-math = সংক্ষিপ্ত বিবরণে `<{ $component }>`-এর মতো গণিত উপাদান থাকা উচিত নয়। যেকোনো গণিত কথায় লিখুন।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] বিভাগের শিরোনামের লেখার জন্য { $colorName }-এর বৈসাদৃশ্য যথেষ্ট নয় (গাঢ় মোড) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; অন্তত { $threshold }:1 প্রয়োজন)।
       *[other] বিভাগের শিরোনামের লেখার জন্য { $colorName }-এর বৈসাদৃশ্য যথেষ্ট নয় ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; অন্তত { $threshold }:1 প্রয়োজন)।
    }

## `<circle>`

circle-through-points-non-numerical = বিন্দুগুলির সাংখ্যিক মান না থাকলে { $count }টি বিন্দুর মধ্য দিয়ে `<circle>` বাস্তবায়ন করা হয়নি।

circle-too-many-through-points = 3টির বেশি বিন্দুর মধ্য দিয়ে বৃত্ত নির্ণয় করা যায় না।

circle-overprescribed-radius-center-points = নির্দিষ্ট ব্যাসার্ধ, কেন্দ্র ও অতিক্রান্ত বিন্দু দিয়ে বৃত্ত নির্ণয় করা যায় না।

circle-center-with-multiple-points = নির্দিষ্ট কেন্দ্র ও 1টির বেশি বিন্দুর মধ্য দিয়ে বৃত্ত নির্ণয় করা যায় না।

circle-radius-too-small = বৃত্ত নির্ণয় করা যায় না: দুটি বিন্দুর মধ্যে দূরত্ব { $distance } হওয়ায় নির্দিষ্ট ব্যাসার্ধ { $radius } অত্যন্ত ছোট।

circle-radius-with-many-points = নির্দিষ্ট ব্যাসার্ধ নিয়ে দুইয়ের বেশি বিন্দুর মধ্য দিয়ে বৃত্ত তৈরি করা যায় না।

circle-invalid-center-or-through-points = বৃত্তের কেন্দ্র বা অতিক্রান্ত বিন্দু অবৈধ।

circle-radius-center-with-multiple-points = নির্দিষ্ট কেন্দ্র ও 1টির বেশি বিন্দুর মধ্য দিয়ে বৃত্তের ব্যাসার্ধ নির্ণয় করা যায় না।

circle-change-radius-non-numerical = সাংখ্যিক নয় এমন অতিক্রান্ত বিন্দুসহ বৃত্তের ব্যাসার্ধ বদলানো যায় না

circle-radius-with-points-non-numerical = সাংখ্যিক মান না থাকলে নির্দিষ্ট ব্যাসার্ধ নিয়ে একের বেশি বিন্দুর মধ্য দিয়ে বৃত্ত তৈরি করা যায় না।

circle-change-center-non-numerical = সাংখ্যিক নয় এমন বিন্দুর মধ্য দিয়ে যাওয়া বৃত্তের কেন্দ্র বদলানো বাস্তবায়িত হয়নি।

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] ফাংশনের ডোমেনের মাত্রা যথেষ্ট নয়। ডোমেনে { $intervals }টি ব্যবধি আছে কিন্তু ফাংশনের { $inputs ->
            [one] { $inputs }টি ইনপুট
           *[other] { $inputs }টি ইনপুট
        } আছে।
       *[other] ফাংশনের ডোমেনের মাত্রা যথেষ্ট নয়। ডোমেনে { $intervals }টি ব্যবধি আছে কিন্তু ফাংশনের { $inputs ->
            [one] { $inputs }টি ইনপুট
           *[other] { $inputs }টি ইনপুট
        } আছে।
    }

function-domain-invalid-format = ফাংশনের ডোমেনের বিন্যাস অবৈধ।

function-ignoring-non-numerical =
    { $type ->
        [maximum] ফাংশনের সাংখ্যিক নয় এমন সর্বোচ্চ মান উপেক্ষা করা হচ্ছে।
        [minimum] ফাংশনের সাংখ্যিক নয় এমন সর্বনিম্ন মান উপেক্ষা করা হচ্ছে।
        [extremum] ফাংশনের সাংখ্যিক নয় এমন চরম মান উপেক্ষা করা হচ্ছে।
        [point] ফাংশনের সাংখ্যিক নয় এমন বিন্দু উপেক্ষা করা হচ্ছে।
        [slope] ফাংশনের সাংখ্যিক নয় এমন ঢাল উপেক্ষা করা হচ্ছে।
       *[other] ফাংশনের সাংখ্যিক নয় এমন { $type } উপেক্ষা করা হচ্ছে।
    }

function-ignoring-empty =
    { $type ->
        [maximum] ফাংশনের ফাঁকা সর্বোচ্চ মান উপেক্ষা করা হচ্ছে।
        [minimum] ফাংশনের ফাঁকা সর্বনিম্ন মান উপেক্ষা করা হচ্ছে।
        [extremum] ফাংশনের ফাঁকা চরম মান উপেক্ষা করা হচ্ছে।
        [point] ফাংশনের ফাঁকা বিন্দু উপেক্ষা করা হচ্ছে।
       *[other] ফাংশনের ফাঁকা { $type } উপেক্ষা করা হচ্ছে।
    }

function-points-too-close = ফাংশনে দুটি বিন্দুর অবস্থান খুব কাছাকাছি। ফাংশন সংজ্ঞায়িত করা যাচ্ছে না।

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] ফাংশনের ইনপুটের সংখ্যা আউটপুটের সংখ্যার সমান হলেই কেবল ফাংশন পুনরাবৃত্তি সম্ভব। এই ফাংশনের { $inputs }টি ইনপুট ও { $outputs ->
            [one] { $outputs }টি আউটপুট
           *[other] { $outputs }টি আউটপুট
        } আছে।
       *[other] ফাংশনের ইনপুটের সংখ্যা আউটপুটের সংখ্যার সমান হলেই কেবল ফাংশন পুনরাবৃত্তি সম্ভব। এই ফাংশনের { $inputs }টি ইনপুট ও { $outputs ->
            [one] { $outputs }টি আউটপুট
           *[other] { $outputs }টি আউটপুট
        } আছে।
    }

## `<sequence>`

sequence-invalid-length = অনুক্রমের দৈর্ঘ্য অবৈধ।  একটি অঋণাত্মক পূর্ণসংখ্যা হতে হবে।

sequence-invalid-step = অনুক্রমের ধাপ অবৈধ।  { $type } ধরনের অনুক্রমের জন্য একটি সংখ্যা হতে হবে।

sequence-invalid-endpoint-number = সংখ্যা অনুক্রমের "{ $attribute }" অবৈধ।  একটি সংখ্যা হতে হবে।

sequence-invalid-endpoint-letters = অক্ষর অনুক্রমের "{ $attribute }" অবৈধ।  একটি অক্ষরসমষ্টি হতে হবে।

sequence-invalid-endpoint = অনুক্রমের "{ $attribute }" অবৈধ।

select-from-sequence-coprime-not-numbers = সংখ্যা বাছাই করা হচ্ছে না বলে coprime উপেক্ষা করা হয়েছে

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations নির্দিষ্ট করা আছে বলে coprime উপেক্ষা করা হয়েছে

## Resolving a `target`

target-not-found = `<{ $source }>`-এর জন্য target অবৈধ: লক্ষ্য খুঁজে পাওয়া যায়নি।

target-state-variable-not-found = `<{ $source }>`-এর জন্য target অবৈধ: `<{ $component }>`-এ "{ $property }" নামের কোনো স্টেট ভেরিয়েবল খুঁজে পাওয়া যায়নি।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-এর চলকগুলি স্বাধীন চলক থেকে আলাদা হতে হবে।

ode-system-duplicate-variable-names = একই নামের নির্ভরশীল চলক নিয়ে ODE RHS ফাংশন সংজ্ঞায়িত করা যায় না।

ode-system-rhs-function-error = ODE RHS ফাংশন সংজ্ঞায়িত করা যাচ্ছে না।  mathjs ফাংশন তৈরিতে ত্রুটি।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count }টি রেখার মধ্যে কোণ সংজ্ঞায়িত করা যায় না

angle-invalid-through-point = `<angle>`-এর through-এ বিন্দু অবৈধ

parabola-vertex-too-many-points = শীর্ষবিন্দুসহ 1টির বেশি বিন্দুর মধ্য দিয়ে পরাবৃত্ত বাস্তবায়িত হয়নি।

parabola-too-many-points = 3টির বেশি বিন্দুর মধ্য দিয়ে পরাবৃত্ত বাস্তবায়িত হয়নি।

intersection-too-many-items = দুইয়ের বেশি বস্তুর ছেদ বাস্তবায়িত হয়নি

## Other math components

ionic-compound-not-two-ions = দুটি আয়ন ছাড়া অন্য কিছুর জন্য আয়নিক যৌগ বাস্তবায়িত হয়নি।

ionic-compound-needs-cation-and-anion = আয়নিক যৌগ কেবল একটি ক্যাটায়ন ও একটি অ্যানায়নের জন্য বাস্তবায়িত।

solve-equations-cannot-evaluate = সমীকরণটির মান নির্ণয় করা যায়নি বলে সমাধান করা যাচ্ছে না: { $equation }

math-operators-operand-number-required = গাণিতিক উপপদ বের করার সময় একটি operandNumber নির্দিষ্ট করতে হবে।

eigen-decomposition-failed = ম্যাট্রিক্সের আইগেনমান নির্ণয় করা যায়নি

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } প্যারামিটারটি প্যাটার্নে নেই, তাই এটি সবসময় একটি ফাঁকার সাথে মিলবে।
       *[other] `<matchesPattern>`: { $parameters } প্যারামিটারগুলি প্যাটার্নে নেই, তাই সেগুলি সবসময় একটি ফাঁকার সাথে মিলবে।
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" বোঝা যাচ্ছে না। এটি none, medium, dense, অথবা একটি স্পেস দিয়ে আলাদা করা দুটি ধনাত্মক সংখ্যা হতে হবে, যেমন grid="1 0.5"। কোনো গ্রিড আঁকা হবে না।

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure রেন্ডারারে xLabelPosition="left" সমর্থিত নয়; ডানদিকের আচরণ ব্যবহার করা হচ্ছে।

prefigure-y-label-position-unsupported = `<graph>`: prefigure রেন্ডারারে yLabelPosition="bottom" সমর্থিত নয়; উপরের দিকের আচরণ ব্যবহার করা হচ্ছে।

prefigure-invalid-axis-bounds = `<graph>`: prefigure রূপান্তরের জন্য অক্ষের সীমা অবৈধ; পূর্বনির্ধারিত bbox (-10,-10,10,10) ব্যবহার করা হচ্ছে।

prefigure-invalid-width = `<graph>`: prefigure রূপান্তরের জন্য প্রস্থ অবৈধ; পূর্বনির্ধারিত চিত্রপ্রস্থ 425 ব্যবহার করা হচ্ছে।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure রূপান্তরের জন্য aspectRatio অবৈধ; পূর্বনির্ধারিত অনুপাত 1 ব্যবহার করা হচ্ছে।

prefigure-grid-spacing-too-fine = `<graph>`: অক্ষের সীমার তুলনায় গ্রিডের ব্যবধান খুব সূক্ষ্ম; prefigure রেন্ডারারে গ্রিডটি বাদ দেওয়া হয়েছে।

prefigure-annotations-not-rendered = `<graph>`: PreFigure রেন্ডারার ব্যবহার না করলে টীকা রেন্ডার করা হবে না।

multiple-annotations-children = `<graph>`-এ একাধিক `<annotations>` সন্তান পাওয়া গেছে; শেষটি ছাড়া বাকি সব উপেক্ষা করা হয়েছে।

## Referring to other components

copy-unrecognized-component-type = অজানা উপাদান ধরন বর্ধিত বা অনুলিপি করা যায় না: { $type }।

copy-prop-not-found = { $component } ধরনের উপাদানে { $property } প্রপ খুঁজে পাওয়া যায়নি

collect-no-source = collect-এর জন্য কোনো উৎস পাওয়া যায়নি।

collect-invalid-component-type = `<{ $component }>` ধরনের উপাদান সংগ্রহ করা যায় না, কারণ এটি একটি অবৈধ উপাদান ধরন।

reference-index-unavailable = `{ $reference }` সূচকটি নির্দেশ করা যায় না

## `<callAction>`

component-action-unavailable = `{ $reference }` উপাদানে { $action } ডাকা যায় না

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ডেটার আকার অবৈধ।  সারিগুলির দৈর্ঘ্য অসামঞ্জস্যপূর্ণ। componentIdx :{ $componentIdx }-এ পাওয়া গেছে

data-frame-duplicate-column-names = ডেটায় একই নামের কলাম আছে।  componentIdx :{ $componentIdx }-এ পাওয়া গেছে

data-frame-missing-column-name = ডেটার একটি কলামের নাম নেই।  componentIdx :{ $componentIdx }-এ পাওয়া গেছে

## `<answer>` and scoring

answer-award-depends-on-own-response = এই answer-এর একটি award একই answer ট্যাগের নিজের জমা দেওয়া উত্তরের উপর ভিত্তি করে তৈরি, যা অপ্রত্যাশিত আচরণের কারণ হবে।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` আছে এমন ধারকের ভিতরে থাকা `<answer>`-এ `maxNumAttempts` বসালে কোনো প্রভাব পড়ে না, কারণ প্রচেষ্টার সংখ্যা ধারকটিই নিয়ন্ত্রণ করে। বদলে ধারকের উপর `maxNumAttempts` বসান।

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` আছে এমন আরেকটি ধারকের ভিতরে থাকা `sectionWideCheckWork` ধারকের উপর `maxNumAttempts` বসালে কোনো প্রভাব পড়ে না, কারণ প্রচেষ্টার সংখ্যা বাইরের ধারকটিই নিয়ন্ত্রণ করে। বদলে বাইরের ধারকের উপর `maxNumAttempts` বসান।

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality নির্ধারিত না থাকলে { $attributes } অ্যাট্রিবিউটের কোনো প্রভাব থাকবে না।
       *[other] symbolicEquality নির্ধারিত না থাকলে { $attributes } অ্যাট্রিবিউটগুলির কোনো প্রভাব থাকবে না।
    }

answer-invalid-type = answer-এর জন্য ধরন অবৈধ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` উপাদানটির কোনো নাম না থাকায় এটি module-এর অ্যাট্রিবিউট হিসেবে ব্যবহার করা যাবে না

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` উপাদানটি module-এর অ্যাট্রিবিউট হিসেবে ব্যবহার করা যাবে না, কারণ `<module>` উপাদান ধরনে ইতিমধ্যেই "{ $name }" নামের একটি অ্যাট্রিবিউট সংজ্ঞায়িত আছে।

conditional-content-condition-ignored = case বা else সন্তান আছে এমন `<conditionalContent>` উপাদানে `condition` অ্যাট্রিবিউট উপেক্ষা করা হয়।

slider-markers-type-mismatch = চিহ্নের ধরন স্লাইডারের ধরনের সাথে মিলছে না।

pretzel-problem-needs-statement-and-answer = pretzel অবৈধ: প্রতিটি `<problem>`-এ একটি `<statement>` ও একটি `<answer>` থাকতে হবে।

pretzel-circuit-first-problem-distractor = pretzel অবৈধ: mode="circuit"-এ প্রথম `<problem>` একটি বিভ্রান্তিকর বিকল্প হতে পারে না।

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` অ্যাট্রিবিউটের জন্য { $values } মানটি অবৈধ; উপেক্ষা করা হচ্ছে।
       *[other] `{ $attribute }` অ্যাট্রিবিউটের জন্য { $values } মানগুলি অবৈধ; উপেক্ষা করা হচ্ছে।
    }

attribute-must-be-references = `{ $attribute }` অ্যাট্রিবিউটের জন্য `{ $value }` মানটি অবৈধ। অ্যাট্রিবিউটটি `$` দিয়ে শুরু হওয়া রেফারেন্স দিয়ে গঠিত হতে হবে।

math-input-invalid-function-names = <mathInput>: { $attribute }-এ অবৈধ ফাংশনের নাম উপেক্ষা করা হয়েছে: { $names }। প্রতিটি নামের প্রদর্শন-অংশ অন্তত 2 অক্ষরের (অক্ষর বা হাইফেন) হতে হবে; এর পরে ঐচ্ছিকভাবে একটি `|<mathspeak alternative>` অংশ বসতে পারে।

## Building components from the source

component-type-invalid = উপাদান ধরন অবৈধ: `<{ $componentType }>`

attribute-repeated = { $attribute } অ্যাট্রিবিউটের পুনরাবৃত্তি করা যায় না।

attribute-invalid-for-component = `<{ $componentType }>` ধরনের উপাদানের জন্য "{ $attribute }" অ্যাট্রিবিউটটি অবৈধ।

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } শৈলী সংজ্ঞায় { $context ->
        [text-on-background] পটভূমির রঙের সাপেক্ষে লেখার রঙের
        [high-contrast] ক্যানভাসের সাপেক্ষে উচ্চ-বৈসাদৃশ্য রঙের
        [line] ক্যানভাসের সাপেক্ষে রেখার রঙের
        [marker] ক্যানভাসের সাপেক্ষে চিহ্নের রঙের
       *[text-on-canvas] ক্যানভাসের সাপেক্ষে লেখার রঙের
    } বৈসাদৃশ্য যথেষ্ট নয়{ $mode ->
        [dark] { " (গাঢ় মোড)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; অন্তত { $threshold }:1 প্রয়োজন)।

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } শৈলী সংজ্ঞায় নির্দিষ্ট করা রঙগুলি হালকা মোডে যথেষ্ট বৈসাদৃশ্য দিলেও, সেই মান থেকে পাওয়া গাঢ়-মোডের রঙে পটভূমির রঙের সাপেক্ষে লেখার রঙের বৈসাদৃশ্য যথেষ্ট নয় ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; অন্তত { $threshold }:1 প্রয়োজন)। { $suggestion ->
        [available] গাঢ় মোডে যথেষ্ট বৈসাদৃশ্য নিশ্চিত করতে হয় হালকা মোডের বৈসাদৃশ্য বাড়ান (যেমন { $lightAttribute }="{ $lightColor }" বসান), নয়তো গাঢ়-মোডের রঙটি নিজেই নির্ধারণ করুন (যেমন { $darkAttribute }="{ $darkColor }" বসান)।
       *[none] গাঢ় মোডে যথেষ্ট বৈসাদৃশ্য নিশ্চিত করতে হালকা মোডের বৈসাদৃশ্য বাড়ান, অথবা textColorDarkMode ও/বা backgroundColorDarkMode দিয়ে উদ্ভূত রঙগুলি নিজেই নির্ধারণ করুন।
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } শৈলী সংজ্ঞায় নির্দিষ্ট করা লেখার রঙ হালকা মোডে যথেষ্ট বৈসাদৃশ্য দিলেও, সেই মান থেকে পাওয়া গাঢ়-মোডের লেখার রঙে ক্যানভাসের সাপেক্ষে বৈসাদৃশ্য যথেষ্ট নয় ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; অন্তত { $threshold }:1 প্রয়োজন)। { $suggestion ->
        [available] গাঢ় মোডে যথেষ্ট বৈসাদৃশ্য নিশ্চিত করতে হয় হালকা মোডের বৈসাদৃশ্য বাড়ান (যেমন textColor="{ $lightColor }" বসান), নয়তো গাঢ়-মোডের রঙটি নিজেই নির্ধারণ করুন (যেমন textColorDarkMode="{ $darkColor }" বসান)।
       *[none] গাঢ় মোডে যথেষ্ট বৈসাদৃশ্য নিশ্চিত করতে হালকা মোডের বৈসাদৃশ্য বাড়ান, অথবা textColorDarkMode দিয়ে উদ্ভূত রঙটি নিজেই নির্ধারণ করুন।
    }

section-multiple-style-palettes = একটি বিভাগ কেবল একটি <stylePalette> বাছতে পারে; শেষটি ব্যবহার করা হচ্ছে।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component }-এর স্বতন্ত্র রূপভেদ নির্ধারণ করা যাচ্ছে না, কারণ numToSelect একটি অঋণাত্মক পূর্ণসংখ্যা নয়।

variant-num-to-select-not-constant-number = { $component }-এর স্বতন্ত্র রূপভেদ নির্ধারণ করা যাচ্ছে না, কারণ numToSelect একটি ধ্রুব সংখ্যা নয়।

variant-with-replacement-not-constant-boolean = { $component }-এর স্বতন্ত্র রূপভেদ নির্ধারণ করা যাচ্ছে না, কারণ withReplacement একটি ধ্রুব বুলিয়ান নয়।

variant-select-weight-disables-unique = কোনো বিকল্পে selectWeight বা selectForVariants নির্দিষ্ট করা থাকলে select-এর স্বতন্ত্র রূপভেদ নিষ্ক্রিয় থাকে

variant-coprime-undetermined = { $component }-এর স্বতন্ত্র রূপভেদ নির্ধারণ করা যাচ্ছে না, কারণ coprime সবসময় মিথ্যা কি না তা নির্ধারণ করা যাচ্ছে না।

variant-attribute-not-constant = { $component }-এর স্বতন্ত্র রূপভেদ নির্ধারণ করা যাচ্ছে না, কারণ { $attribute } একটি ধ্রুবক নয়।

variant-attribute-not-number = { $component }-এর স্বতন্ত্র রূপভেদ নির্ধারণ করা যাচ্ছে না, কারণ { $attribute } একটি সংখ্যা নয়।

variant-attribute-wrong-type-for-sequence =
    { $type } ধরনের { $component }-এর স্বতন্ত্র রূপভেদ নির্ধারণ করা যাচ্ছে না, কারণ { $attribute } { $expected ->
        [letters-combination] একটি অক্ষরসমষ্টি
        [math-expression] একটি বৈধ গাণিতিক রাশি
        [integer] একটি পূর্ণসংখ্যা
       *[number] একটি সংখ্যা
    } নয়।

variant-length-not-integer = { $component }-এর স্বতন্ত্র রূপভেদ নির্ধারণ করা যাচ্ছে না, কারণ length একটি পূর্ণসংখ্যা নয়।

variant-sort-not-implemented = sort সহ { $component }-এর স্বতন্ত্র রূপভেদ বাস্তবায়িত হয়নি

variant-exclude-combinations-not-implemented = excludeCombinations সহ { $component }-এর স্বতন্ত্র রূপভেদ বাস্তবায়িত হয়নি

variant-math-exclude-not-implemented = exclude সহ math ধরনের { $component }-এর স্বতন্ত্র রূপভেদ বাস্তবায়িত হয়নি

variant-non-constant-exclude-not-implemented = ধ্রুব নয় এমন exclude সহ { $component }-এর স্বতন্ত্র রূপভেদ বাস্তবায়িত হয়নি

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure রেন্ডারারে সমর্থিত নয়; উত্তরসূরিটি বাদ দেওয়া হয়েছে।

prefigure-descendant-invalid-geometry = { $subject }: জ্যামিতি সসীম নয় বা অসম্পূর্ণ; উত্তরসূরিটি বাদ দেওয়া হয়েছে।

prefigure-curve-label-omitted = { $subject }: রূপান্তরিত বক্ররেখা উপাদানে লেবেল সমর্থিত নয়; লেবেল বাদ দেওয়া হয়েছে।

prefigure-curve-unsupported-definition-type = { $subject }: '{ $definitionType }' বক্ররেখা ফাংশন সংজ্ঞার ধরনটি সমর্থিত নয়; উত্তরসূরিটি বাদ দেওয়া হয়েছে।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves-এ flipFunctions অ্যাট্রিবিউটটি সমর্থিত নয়; উত্তরসূরিটি বাদ দেওয়া হয়েছে।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves-এ কেবল সূত্র-ধরনের সন্তান ফাংশন সমর্থিত; উত্তরসূরিটি বাদ দেওয়া হয়েছে।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] রেখা-গোত্রের লেবেলের
       *[point] বিন্দুর লেবেলের
    } জন্য '{ $labelPosition }' labelPosition সমর্থিত নয়; PreFigure-এর পূর্বনির্ধারিত সজ্জা ব্যবহার করা হয়েছে।

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' ভরাট শৈলীটি PreFigure সমর্থন করে না; নিরেট ভরাটে ফিরে যাওয়া হচ্ছে।

prefigure-line-style-unknown = { $subject }: অজানা রেখা শৈলী '{ $lineStyle }' PreFigure আউটপুট থেকে বাদ দেওয়া হয়েছে।

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' চিহ্ন শৈলীটি PreFigure-এর 'diamond' শৈলীতে মেলানো হয়েছে।

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' চিহ্ন শৈলীটি PreFigure সমর্থন করে না; পূর্বনির্ধারিত শৈলী ব্যবহার করা হয়েছে।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` অবৈধ; লক্ষ্য নির্ধারণ করা যাচ্ছে না। টীকাটি বাদ দেওয়া হয়েছে।

annotation-ref-multiple-targets = `<annotation>`: `ref` একাধিক লক্ষ্যে পৌঁছেছে; প্রথম লক্ষ্যটি ব্যবহার করা হচ্ছে।

annotation-ref-outside-graph = `<annotation>`: `ref` অবৈধ; লক্ষ্যটি ধারক graph-এর বাইরে। টীকাটি বাদ দেওয়া হয়েছে।

annotation-ref-unsupported-target = `<annotation>`: `ref` অবৈধ; prefigure রূপান্তরে লক্ষ্যটি সমর্থিত লৈখিক বস্তু নয়। টীকাটি বাদ দেওয়া হয়েছে।

annotation-text-missing = `<annotation>`: `text` নেই বা ফাঁকা; ফাঁকা লেখা তৈরি করা হচ্ছে।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] চক্রাকার নির্ভরতা শনাক্ত হয়েছে।
       *[other] `<{ $componentType }>` উপাদান জড়িত চক্রাকার নির্ভরতা শনাক্ত হয়েছে।
    }

reference-no-referent = রেফারেন্সের জন্য কোনো লক্ষ্য পাওয়া যায়নি: `{ $reference }`

reference-multiple-referents = রেফারেন্সের জন্য একাধিক লক্ষ্য পাওয়া গেছে: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>`-এর { $attribute } অ্যাট্রিবিউটের বিন্যাস অবৈধ।

children-invalid = `<{ $componentType }>`-এর জন্য সন্তান অবৈধ: অবৈধ সন্তান পাওয়া গেছে: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` অ্যাট্রিবিউটের জন্য `{ $value }` মানটি অবৈধ, `{ $default }` মানটি ব্যবহার করা হচ্ছে

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML সংস্করণ { $version } পাওয়া যায়নি।
       *[other] DoenetML সংস্করণ { $version } পাওয়া যায়নি। { $fallback } সংস্করণে ফিরে যাওয়া হচ্ছে
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML অবৈধ: { $content }

parse-tag-missing-close-tag = DoenetML অবৈধ: `{ $tag }` ট্যাগটির কোনো সমাপ্তি ট্যাগ নেই। একটি স্ব-সমাপ্ত ট্যাগ বা একটি `</{ $tagName }>` ট্যাগ প্রত্যাশিত ছিল।

parse-tag-error = DoenetML অবৈধ: `<{ $tagName }>` ট্যাগে ত্রুটি

parse-attribute-missing-value = DoenetML অবৈধ: `{ $attribute }` অ্যাট্রিবিউটটি অবৈধ, মনে হচ্ছে এর মান নেই।

parse-attribute-invalid = DoenetML অবৈধ: `{ $attribute }` অ্যাট্রিবিউটটি অবৈধ

parse-attribute-value-invalid = DoenetML অবৈধ: `{ $value }` অ্যাট্রিবিউট মানটি অবৈধ

parse-attribute-value-quote-mismatch = DoenetML অবৈধ: `{ $value }` অ্যাট্রিবিউট মানটি অবৈধ। উদ্ধৃতিচিহ্নগুলি মিলছে না। মনে হচ্ছে একটি `{ $quote }` অনুপস্থিত

parse-open-tag-name-missing = DoenetML অবৈধ: নাম ছাড়া একটি ট্যাগ পাওয়া গেছে, যেমন `<`

parse-tag-not-closed = DoenetML অবৈধ: `{ $tag }` ট্যাগটি বন্ধ করা হয়নি (মনে হচ্ছে একটি `>` অনুপস্থিত)।

parse-self-closing-tag-name-missing = DoenetML অবৈধ: নাম ছাড়া একটি ট্যাগ পাওয়া গেছে `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML অবৈধ: `{ $tag }` ট্যাগটি বন্ধ করা হয়নি (মনে হচ্ছে `/>` অনুপস্থিত)।

parse-tag-invalid-attributes = DoenetML অবৈধ: `{ $tag }` ট্যাগটি বৈধ নয়। এর অ্যাট্রিবিউটে ভুল থাকতে পারে।

parse-close-tag-name-missing = DoenetML অবৈধ: নাম ছাড়া একটি সমাপ্তি ট্যাগ পাওয়া গেছে, যেমন `</`

parse-attribute-value-unquoted = অ্যাট্রিবিউটের মান উদ্ধৃতিচিহ্নে আবদ্ধ থাকতে হবে: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML অবৈধ: `{ $tag }` সমাপ্তি ট্যাগ পাওয়া গেছে, কিন্তু এর সঙ্গতিপূর্ণ কোনো শুরুর ট্যাগ নেই

parse-close-tag-mismatched = DoenetML অবৈধ: সমাপ্তি ট্যাগ মিলছে না। `</{ $expected }>` প্রত্যাশিত ছিল। পাওয়া গেছে `{ $found }`

parser-node-unconvertible = { $node } নোডটিকে Dast নোডে রূপান্তর করা যায়নি।

## Names

name-attribute-invalid =
    name='{ $name }' অ্যাট্রিবিউটটি অবৈধ। { $reason ->
        [characters] নামে কেবল অক্ষর, সংখ্যা, আন্ডারস্কোর বা হাইফেন থাকতে পারে।
       *[start] নাম একটি অক্ষর দিয়ে শুরু হতে হবে।
    }

component-name-invalid-start = "{ $name }" উপাদানের নামটি অবৈধ। নাম একটি অক্ষর দিয়ে শুরু হতে হবে।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched ধরনের answer-এ একটি video অ্যাট্রিবিউট থাকতে হবে

answer-video-watched-video-not-reference = videoWatched ধরনের answer-এর video অ্যাট্রিবিউটটি একটি রেফারেন্স হতে হবে

answer-name-not-single-text = answer-এর name অ্যাট্রিবিউটে একটিমাত্র text সন্তান থাকতে হবে

## Referencing another document

external-doenetml-recursion-limit = পুনরাবৃত্তির স্তর অত্যধিক হওয়ায় বাইরের DoenetML আনা যাচ্ছে না। কোথাও কি চক্রাকার রেফারেন্স আছে?

external-doenetml-unavailable = { $attribute }="{ $uri }" থেকে DoenetML আনা যাচ্ছে না

external-doenetml-type-mismatch = { $attribute }="{ $uri }" থেকে আনা DoenetML অবৈধ: এটি "{ $componentType }" উপাদান ধরনের সাথে মেলেনি

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` অ্যাট্রিবিউটটি অপ্রচলিত; বদলে `{ $to }` ব্যবহার করুন।
       *[other] [deprecation] `<{ $component }>`-এর `{ $from }` অ্যাট্রিবিউটটি অপ্রচলিত; বদলে `{ $to }` ব্যবহার করুন।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }`-ও নির্দিষ্ট করা আছে বলে `{ $from }` অ্যাট্রিবিউটটি অপ্রচলিত ও উপেক্ষিত।
       *[other] [deprecation] `{ $to }`-ও নির্দিষ্ট করা আছে বলে `<{ $component }>`-এর `{ $from }` অ্যাট্রিবিউটটি অপ্রচলিত ও উপেক্ষিত।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`-এর `{ $attribute }` অ্যাট্রিবিউটটি অপ্রচলিত ও উপেক্ষিত।


## Language coverage

pluralize-english-only = `<pluralize>` কেবল ইংরেজি বহুবচন করতে পারে, তাই { $locale } ভাষায় লেখা নথিতে এর লেখা অপরিবর্তিত থাকে। বহুবচন রূপটি সরাসরি লিখুন, অথবা `pluralForm` অ্যাট্রিবিউট দিয়ে নির্ধারণ করুন।


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` উপাদানটি Doenet-এর পরিচিত উপাদান নয়।

schema-element-not-allowed-at-root = `<{ $tag }>` উপাদানটি নথির মূলে অনুমোদিত নয়।

schema-element-not-allowed-inside = `<{ $tag }>` উপাদানটি `<{ $parent }>`-এর ভিতরে অনুমোদিত নয়।

schema-attribute-unrecognized = `<{ $tag }>` উপাদানের `{ $attribute }` নামে কোনো অ্যাট্রিবিউট নেই।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` উপাদানের `{ $attribute }` অ্যাট্রিবিউটটি এমন একটি তালিকা হতে হবে যার প্রতিটি ভুক্তি এদের একটি: { $allowed }
       *[other] `<{ $tag }>` উপাদানের `{ $attribute }` অ্যাট্রিবিউটটি এদের একটি হতে হবে: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select-এর জন্য রূপভেদের নাম অবৈধ।  { $variantName } রূপভেদের নামটি { $numOptions }টি বিকল্পে আছে কিন্তু বাছাই করার সংখ্যা { $numToSelect }।

select-variant-name-without-options = select-এর জন্য কিছু রূপভেদ নির্দিষ্ট করা আছে কিন্তু সম্ভাব্য রূপভেদের নাম { $variantName }-এর জন্য কোনো বিকল্প নির্দিষ্ট করা নেই।

select-variant-name-not-possible = select-এর জন্য নির্দিষ্ট করা { $variantName } রূপভেদের নামটি একটি সম্ভাব্য রূপভেদের নাম নয়।

select-too-few-options = কেবল { $numOptions }টি থেকে { $numToSelect }টি উপাদান বাছাই করা যায় না।

select-from-sequence-too-few-values = { $length } দৈর্ঘ্যের একটি অনুক্রম থেকে { $numToSelect }টি মান বাছাই করা যায় না।

select-from-sequence-indices-count-mismatch = select-এর জন্য নির্দিষ্ট করা সূচকের সংখ্যা বাছাই করার সংখ্যার সাথে মিলতে হবে

select-from-sequence-indices-not-integers = select-এর জন্য নির্দিষ্ট করা সব সূচক পূর্ণসংখ্যা হতে হবে

select-from-sequence-index-excluded = selectfromsequence-এর যে সূচকটি নির্দিষ্ট করা হয়েছে তা বাদ দেওয়া ছিল

select-from-sequence-indices-excluded-combination = selectfromsequence-এর যে সূচকগুলি নির্দিষ্ট করা হয়েছে তা একটি বাদ দেওয়া সমাবেশ ছিল

select-from-sequence-coprime-not-positive-integers = ধনাত্মক পূর্ণসংখ্যা বাছাই করা হচ্ছে না বলে সহমৌলিক সমাবেশ বাছাই করা যায় না।

select-from-sequence-coprime-common-factor = সহমৌলিক সংখ্যা বাছাই করা যায় না। সব সম্ভাব্য মানের একটি সাধারণ উৎপাদক আছে। ("from" বা "to"-এর নির্দিষ্ট করা মান "step"-এর সাথে সহমৌলিক হতে হবে।)

select-from-sequence-coprime-single-number = 1 নয় এমন একটিমাত্র সংখ্যা থেকে সহমৌলিক সমাবেশ বাছাই করা যায় না।

select-from-sequence-excluded-too-many-combinations = selectFromSequence-এ 70%-এর বেশি সমাবেশ বাদ দেওয়া হয়েছে

select-from-sequence-coprime-none-found = সহমৌলিক সংখ্যা বাছাই করা যায়নি। সব সম্ভাব্য মানের একটি সাধারণ উৎপাদক আছে।

select-from-sequence-too-few-unique-values = { $numPossibleValues } দৈর্ঘ্যের অনুক্রম থেকে { $numToSelect }টি স্বতন্ত্র মান বাছাই করা যায় না

select-prime-numbers-too-few-values = { $numValues } দৈর্ঘ্যের মৌলিক সংখ্যার তালিকা থেকে { $numToSelect }টি মান বাছাই করা যায় না

select-prime-numbers-values-count-mismatch = select-এর জন্য নির্দিষ্ট করা মানের সংখ্যা বাছাই করার সংখ্যার সাথে মিলতে হবে

select-prime-numbers-values-not-prime = select prime number-এর জন্য নির্দিষ্ট করা সব মান মৌলিক সংখ্যার তালিকায় থাকতে হবে

select-prime-numbers-values-excluded-combination = selectPrimeNumbers-এর নির্দিষ্ট করা মানগুলি একটি বাদ দেওয়া সমাবেশ ছিল

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-এ 70%-এর বেশি সমাবেশ বাদ দেওয়া হয়েছে

select-random-combination-fluke = অত্যন্ত অসম্ভব এক কাকতালীয় কারণে এলোমেলো মানের সমাবেশ বাছাই করা যায়নি

select-random-value-fluke = অত্যন্ত অসম্ভব এক কাকতালীয় কারণে এলোমেলো মান বাছাই করা যায়নি
