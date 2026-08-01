# Assamese diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# A counted noun is not pluralized in Assamese, so the two branches of a plural
# selector read the same wherever only the noun would have changed.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] দুটা প্ৰান্তবিন্দু নিৰ্দিষ্ট কৰা থাকিলে { $attributes } উপেক্ষা কৰা হয়
       *[other] দুটা প্ৰান্তবিন্দু নিৰ্দিষ্ট কৰা থাকিলে { $attributes } উপেক্ষা কৰা হয়
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] এটা প্ৰান্তবিন্দু আৰু এটা মধ্যবিন্দু দুয়োটা নিৰ্দিষ্ট কৰা থাকিলে { $attributes } উপেক্ষা কৰা হয়
       *[other] এটা প্ৰান্তবিন্দু আৰু এটা মধ্যবিন্দু দুয়োটা নিৰ্দিষ্ট কৰা থাকিলে { $attributes } উপেক্ষা কৰা হয়
    }

line-segment-midpoint-offset-without-midpoint = মধ্যবিন্দু নোহোৱাকৈ midpointOffset-ৰ কোনো প্ৰভাৱ নাই

## `<line>`

line-points-undetermined-dimensions = অনিৰ্ধাৰিত মাত্ৰাৰ বিন্দুৰ মাজেৰে যোৱা ৰেখা।

line-points-too-few-dimensions = ৰেখা অন্ততঃ দুই মাত্ৰাৰ বিন্দুৰ মাজেৰে যাব লাগিব।

line-points-depend-on-variables = ৰেখাটো চলকৰ ওপৰত নিৰ্ভৰ কৰা বিন্দুৰ মাজেৰে গৈছে: { $variables }।

line-equation-invalid-format = { $variable1 } আৰু { $variable2 } চলকত ৰেখাৰ সমীকৰণৰ বিন্যাস অবৈধ।

## `<ray>`

ray-overprescribed-through = ৰশ্মিটো through, endpoint আৰু direction-এৰে নিৰ্ধাৰিত।  নিৰ্দিষ্ট কৰা through উপেক্ষা কৰা হৈছে।

ray-dimension-mismatch = ৰশ্মিত numDimensions মিলা নাই।

## `<vector>`

vector-overprescribed-head = ভেক্টৰটো head, tail আৰু displacement-এৰে নিৰ্ধাৰিত।  নিৰ্দিষ্ট কৰা head উপেক্ষা কৰা হৈছে।

vector-dimension-mismatch = ভেক্টৰত numDimensions মিলা নাই।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>`-ৰ ফালে আকৰ্ষণ কৰিব পৰা নাযায়, কাৰণ ইয়াৰ nearestPoint ষ্টেট ভেৰিয়েবল নাই।

constrain-to-without-nearest-point = `<{ $component }>`-ৰ সাপেক্ষে সীমাবদ্ধ কৰিব পৰা নাযায়, কাৰণ ইয়াৰ nearestPoint ষ্টেট ভেৰিয়েবল নাই।

constrain-to-interior-without-nearest-point = `<{ $component }>`-ৰ ভিতৰত সীমাবদ্ধ কৰিব পৰা নাযায়, কাৰণ ইয়াৰ nearestPoint ষ্টেট ভেৰিয়েবল নাই।

## `<choiceInput>`

choice-input-label-position-ignored = ইনলাইন নোহোৱা choiceInput-ৰ বাবে labelPosition উপেক্ষা কৰা হয়

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-ৰ বাবে নিৰ্দিষ্ট কৰা সূচক উপেক্ষা কৰা হৈছে, কাৰণ সূচকৰ সংখ্যা choice সন্তানৰ সংখ্যাৰ সৈতে মিলা নাই।

pretzel-indices-count-mismatch = problem-ৰ বাবে নিৰ্দিষ্ট কৰা সূচক উপেক্ষা কৰা হৈছে, কাৰণ সূচকৰ সংখ্যা problem সন্তানৰ সংখ্যাৰ সৈতে মিলা নাই।

shuffle-indices-count-mismatch = shuffle-ৰ বাবে নিৰ্দিষ্ট কৰা সূচক উপেক্ষা কৰা হৈছে, কাৰণ সূচকৰ সংখ্যা উপাদানৰ সংখ্যাৰ সৈতে মিলা নাই।

indices-ignored-out-of-range = { $component }-ৰ বাবে নিৰ্দিষ্ট কৰা সূচক উপেক্ষা কৰা হৈছে, কাৰণ কিছু সূচক সীমাৰ বাহিৰত।

pretzel-indices-repeated = pretzel-ৰ বাবে নিৰ্দিষ্ট কৰা সূচক উপেক্ষা কৰা হৈছে, কাৰণ কিছু সূচকৰ পুনৰাবৃত্তি হৈছে।

pretzel-circuit-first-index = circuit ম'ডত pretzel-ৰ বাবে নিৰ্দিষ্ট কৰা সূচক উপেক্ষা কৰা হৈছে, কাৰণ প্ৰথম সূচকটো 1 হ'ব লাগিব।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>`-এ ষ্ট্ৰিং সন্তানৰ সৈতে কাম কৰিবলৈ এটা `type` এট্ৰিবিউট নিৰ্দিষ্ট কৰিব লাগিব।

invalid-type-defaulting-to-math = { $component } উপাদানৰ বাবে { $type } ধৰণটো অবৈধ। math, text, number বা boolean-ৰ এটা হ'ব লাগিব। math ধৰি লোৱা হৈছে।

string-not-valid-component-to-arrange = "{ $value }" ষ্ট্ৰিংটো { $component } কৰিবলৈ বৈধ উপাদান নহয়। উপেক্ষা কৰা হৈছে।

## Types and variables

invalid-type-defaulting-to-number = { $type } ধৰণটো অবৈধ, ধৰণ number কৰা হৈছে।

invalid-variable-value = এটা চলকৰ মান অবৈধ: `{ $value }`

## Variants

variant-index-must-be-number = ৰূপভেদৰ সূচক { $index } এটা সংখ্যা হ'ব লাগিব

variant-index-must-be-integer = ৰূপভেদৰ সূচক { $index } এটা পূৰ্ণসংখ্যা হ'ব লাগিব

## `<sideBySide>`

side-by-side-absolute-widths = পৰম জোখৰ বাবে `<{ $component }>` ৰূপায়িত হোৱা নাই। প্ৰস্থ আপেক্ষিক কৰা হৈছে।

side-by-side-absolute-margins = পৰম জোখৰ বাবে `<{ $component }>` ৰূপায়িত হোৱা নাই। মাৰ্জিন আপেক্ষিক কৰা হৈছে।

side-by-side-no-block-child = `<{ $component }>` অবৈধ: ইয়াত অন্ততঃ এটা ব্লক সন্তান থাকিব লাগিব।

## `<label>`

label-for-ignored-on-graphical = লৈখিক `<label>`-ৰ ওপৰত `for` এট্ৰিবিউট উপেক্ষা কৰা হয়।

label-for-must-resolve-to-one = `<label>`-ৰ ওপৰত `for` এট্ৰিবিউটটো ঠিক এটা উপাদানত নিৰ্ণীত হ'ব লাগিব।

label-for-unresolved = `<label>`-ৰ ওপৰত `for` এট্ৰিবিউটটো কোনো উপাদানত নিৰ্ণয় কৰিব পৰা নগ'ল।

label-for-answer-with-authored-inputs = `<label>`-ৰ ওপৰত `for` এট্ৰিবিউটটোৱে এনে এটা `<answer>` নিৰ্দেশ কৰে যাৰ ইনপুট বেলেগকৈ লিখা হৈছে; পোনপটীয়াকৈ সেই ইনপুটটোকেই নিৰ্দেশ কৰক।

label-for-answer-without-input = `<label>`-ৰ ওপৰত `for` এট্ৰিবিউটটোৱে এনে এটা `<answer>` নিৰ্দেশ কৰে যাৰ লেবেল দিবলৈ কোনো ইনপুট নাই।

label-for-must-reference-input-or-answer = `<label>`-ৰ ওপৰত `for` এট্ৰিবিউটটোৱে এটা ইনপুট বা এটা answer নিৰ্দেশ কৰিব লাগিব।

## Accessibility

accessibility-short-description-or-decorative = প্ৰৱেশযোগ্যতাৰ বাবে `<{ $component }>`-ৰ হয় এটা চমু বিৱৰণ থাকিব লাগিব, নহয় ইয়াক অলংকৰণ হিচাপে চিহ্নিত কৰিব লাগিব।

accessibility-video-short-description = প্ৰৱেশযোগ্যতাৰ বাবে `<video>`-ৰ এটা চমু বিৱৰণ থাকিব লাগিব।

accessibility-input-short-description-or-label = প্ৰৱেশযোগ্যতাৰ বাবে `<{ $component }>`-ৰ এটা চমু বিৱৰণ বা এটা লেবেল থাকিব লাগিব।

accessibility-answer-input-short-description-or-label = প্ৰৱেশযোগ্যতাৰ বাবে ইনপুট সৃষ্টি কৰা `<answer>`-ৰ এটা চমু বিৱৰণ বা এটা লেবেল থাকিব লাগিব।

accessibility-short-description-contains-math = চমু বিৱৰণত `<{ $component }>`-ৰ দৰে গণিত উপাদান থকা উচিত নহয়। যিকোনো গণিত কথাৰে লিখক।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] খণ্ডৰ শিৰোনামৰ লিখাৰ বাবে { $colorName }-ৰ বৈসাদৃশ্য পৰ্যাপ্ত নহয় (গাঢ় ম'ড) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; অন্ততঃ { $threshold }:1 প্ৰয়োজন)।
       *[other] খণ্ডৰ শিৰোনামৰ লিখাৰ বাবে { $colorName }-ৰ বৈসাদৃশ্য পৰ্যাপ্ত নহয় ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; অন্ততঃ { $threshold }:1 প্ৰয়োজন)।
    }

## `<circle>`

circle-through-points-non-numerical = বিন্দুবোৰৰ সাংখ্যিক মান নাথাকিলে { $count }টা বিন্দুৰ মাজেৰে `<circle>` ৰূপায়িত কৰা হোৱা নাই।

circle-too-many-through-points = 3টাতকৈ অধিক বিন্দুৰ মাজেৰে বৃত্ত নিৰ্ণয় কৰিব নোৱাৰি।

circle-overprescribed-radius-center-points = নিৰ্দিষ্ট ব্যাসাৰ্ধ, কেন্দ্ৰ আৰু অতিক্ৰান্ত বিন্দুৰে বৃত্ত নিৰ্ণয় কৰিব নোৱাৰি।

circle-center-with-multiple-points = নিৰ্দিষ্ট কেন্দ্ৰ আৰু 1টাতকৈ অধিক বিন্দুৰ মাজেৰে বৃত্ত নিৰ্ণয় কৰিব নোৱাৰি।

circle-radius-too-small = বৃত্ত নিৰ্ণয় কৰিব নোৱাৰি: দুটা বিন্দুৰ মাজৰ দূৰত্ব { $distance } হোৱাত নিৰ্দিষ্ট ব্যাসাৰ্ধ { $radius } অতি সৰু।

circle-radius-with-many-points = নিৰ্দিষ্ট ব্যাসাৰ্ধেৰে দুটাতকৈ অধিক বিন্দুৰ মাজেৰে বৃত্ত সৃষ্টি কৰিব নোৱাৰি।

circle-invalid-center-or-through-points = বৃত্তৰ কেন্দ্ৰ বা অতিক্ৰান্ত বিন্দু অবৈধ।

circle-radius-center-with-multiple-points = নিৰ্দিষ্ট কেন্দ্ৰ আৰু 1টাতকৈ অধিক বিন্দুৰ মাজেৰে বৃত্তৰ ব্যাসাৰ্ধ নিৰ্ণয় কৰিব নোৱাৰি।

circle-change-radius-non-numerical = সাংখ্যিক নোহোৱা অতিক্ৰান্ত বিন্দুৰে বৃত্তৰ ব্যাসাৰ্ধ সলনি কৰিব নোৱাৰি

circle-radius-with-points-non-numerical = সাংখ্যিক মান নাথাকিলে নিৰ্দিষ্ট ব্যাসাৰ্ধেৰে এটাতকৈ অধিক বিন্দুৰ মাজেৰে বৃত্ত সৃষ্টি কৰিব নোৱাৰি।

circle-change-center-non-numerical = সাংখ্যিক নোহোৱা বিন্দুৰ মাজেৰে যোৱা বৃত্তৰ কেন্দ্ৰ সলনি কৰাটো ৰূপায়িত হোৱা নাই।

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] ফলনৰ ডমেইনৰ মাত্ৰা পৰ্যাপ্ত নহয়। ডমেইনত { $intervals }টা অন্তৰাল আছে কিন্তু ফলনৰ { $inputs ->
            [one] { $inputs }টা ইনপুট
           *[other] { $inputs }টা ইনপুট
        } আছে।
       *[other] ফলনৰ ডমেইনৰ মাত্ৰা পৰ্যাপ্ত নহয়। ডমেইনত { $intervals }টা অন্তৰাল আছে কিন্তু ফলনৰ { $inputs ->
            [one] { $inputs }টা ইনপুট
           *[other] { $inputs }টা ইনপুট
        } আছে।
    }

function-domain-invalid-format = ফলনৰ ডমেইনৰ বিন্যাস অবৈধ।

function-ignoring-non-numerical =
    { $type ->
        [maximum] ফলনৰ সাংখ্যিক নোহোৱা সৰ্বোচ্চ মান উপেক্ষা কৰা হৈছে।
        [minimum] ফলনৰ সাংখ্যিক নোহোৱা সৰ্বনিম্ন মান উপেক্ষা কৰা হৈছে।
        [extremum] ফলনৰ সাংখ্যিক নোহোৱা চৰম মান উপেক্ষা কৰা হৈছে।
        [point] ফলনৰ সাংখ্যিক নোহোৱা বিন্দু উপেক্ষা কৰা হৈছে।
        [slope] ফলনৰ সাংখ্যিক নোহোৱা ঢাল উপেক্ষা কৰা হৈছে।
       *[other] ফলনৰ সাংখ্যিক নোহোৱা { $type } উপেক্ষা কৰা হৈছে।
    }

function-ignoring-empty =
    { $type ->
        [maximum] ফলনৰ খালী সৰ্বোচ্চ মান উপেক্ষা কৰা হৈছে।
        [minimum] ফলনৰ খালী সৰ্বনিম্ন মান উপেক্ষা কৰা হৈছে।
        [extremum] ফলনৰ খালী চৰম মান উপেক্ষা কৰা হৈছে।
        [point] ফলনৰ খালী বিন্দু উপেক্ষা কৰা হৈছে।
       *[other] ফলনৰ খালী { $type } উপেক্ষা কৰা হৈছে।
    }

function-points-too-close = ফলনত দুটা বিন্দুৰ অৱস্থান বহুত ওচৰা-ওচৰি। ফলন সংজ্ঞায়িত কৰিব পৰা নাযায়।

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] ফলনৰ ইনপুটৰ সংখ্যা আউটপুটৰ সংখ্যাৰ সমান হ'লেহে ফলন পুনৰাবৃত্তি সম্ভৱ। এই ফলনৰ { $inputs }টা ইনপুট আৰু { $outputs ->
            [one] { $outputs }টা আউটপুট
           *[other] { $outputs }টা আউটপুট
        } আছে।
       *[other] ফলনৰ ইনপুটৰ সংখ্যা আউটপুটৰ সংখ্যাৰ সমান হ'লেহে ফলন পুনৰাবৃত্তি সম্ভৱ। এই ফলনৰ { $inputs }টা ইনপুট আৰু { $outputs ->
            [one] { $outputs }টা আউটপুট
           *[other] { $outputs }টা আউটপুট
        } আছে।
    }

## `<sequence>`

sequence-invalid-length = অনুক্ৰমৰ দৈৰ্ঘ্য অবৈধ।  এটা অঋণাত্মক পূৰ্ণসংখ্যা হ'ব লাগিব।

sequence-invalid-step = অনুক্ৰমৰ খোজ অবৈধ।  { $type } ধৰণৰ অনুক্ৰমৰ বাবে এটা সংখ্যা হ'ব লাগিব।

sequence-invalid-endpoint-number = সংখ্যা অনুক্ৰমৰ "{ $attribute }" অবৈধ।  এটা সংখ্যা হ'ব লাগিব।

sequence-invalid-endpoint-letters = আখৰ অনুক্ৰমৰ "{ $attribute }" অবৈধ।  এটা আখৰ সমষ্টি হ'ব লাগিব।

sequence-invalid-endpoint = অনুক্ৰমৰ "{ $attribute }" অবৈধ।

select-from-sequence-coprime-not-numbers = সংখ্যা বাছনি কৰা হোৱা নাই বাবে coprime উপেক্ষা কৰা হৈছে

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations নিৰ্দিষ্ট কৰা আছে বাবে coprime উপেক্ষা কৰা হৈছে

## Resolving a `target`

target-not-found = `<{ $source }>`-ৰ বাবে target অবৈধ: লক্ষ্য বিচাৰি পোৱা নগ'ল।

target-state-variable-not-found = `<{ $source }>`-ৰ বাবে target অবৈধ: `<{ $component }>`-ত "{ $property }" নামৰ কোনো ষ্টেট ভেৰিয়েবল বিচাৰি পোৱা নগ'ল।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-ৰ চলকবোৰ স্বাধীন চলকতকৈ বেলেগ হ'ব লাগিব।

ode-system-duplicate-variable-names = একে নামৰ নিৰ্ভৰশীল চলকেৰে ODE RHS ফলন সংজ্ঞায়িত কৰিব নোৱাৰি।

ode-system-rhs-function-error = ODE RHS ফলন সংজ্ঞায়িত কৰিব পৰা নাযায়।  mathjs ফলন সৃষ্টিত ত্ৰুটি।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count }টা ৰেখাৰ মাজত কোণ সংজ্ঞায়িত কৰিব নোৱাৰি

angle-invalid-through-point = `<angle>`-ৰ through-ত বিন্দু অবৈধ

parabola-vertex-too-many-points = শীৰ্ষবিন্দুসহ 1টাতকৈ অধিক বিন্দুৰ মাজেৰে পৰাবৃত্ত ৰূপায়িত হোৱা নাই।

parabola-too-many-points = 3টাতকৈ অধিক বিন্দুৰ মাজেৰে পৰাবৃত্ত ৰূপায়িত হোৱা নাই।

intersection-too-many-items = দুটাতকৈ অধিক বস্তুৰ ছেদ ৰূপায়িত হোৱা নাই

## Other math components

ionic-compound-not-two-ions = দুটা আয়নৰ বাহিৰে আন কিবাৰ বাবে আয়নিক যৌগ ৰূপায়িত হোৱা নাই।

ionic-compound-needs-cation-and-anion = আয়নিক যৌগ কেৱল এটা কেটায়ন আৰু এটা এনায়নৰ বাবে ৰূপায়িত।

solve-equations-cannot-evaluate = সমীকৰণটোৰ মান নিৰ্ণয় কৰিব নোৱাৰাত সমাধান কৰিব পৰা নাযায়: { $equation }

math-operators-operand-number-required = গাণিতিক উপপদ উলিওৱাৰ সময়ত এটা operandNumber নিৰ্দিষ্ট কৰিব লাগিব।

eigen-decomposition-failed = মেট্ৰিক্সৰ আইগেনমান নিৰ্ণয় কৰিব পৰা নগ'ল

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } পেৰামিটাৰটো পেটাৰ্নত নাই, গতিকে ই সদায় এটা খালীৰ সৈতে মিলিব।
       *[other] `<matchesPattern>`: { $parameters } পেৰামিটাৰবোৰ পেটাৰ্নত নাই, গতিকে সেইবোৰ সদায় এটা খালীৰ সৈতে মিলিব।
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" বুজিব পৰা নাযায়। ই none, medium, dense, অথবা এটা স্পেচেৰে পৃথক কৰা দুটা ধনাত্মক সংখ্যা হ'ব লাগিব, যেনে grid="1 0.5"। কোনো গ্ৰিড অঁকা নহ'ব।

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure ৰেণ্ডাৰাৰত xLabelPosition="left" সমৰ্থিত নহয়; সোঁফালৰ আচৰণ ব্যৱহাৰ কৰা হৈছে।

prefigure-y-label-position-unsupported = `<graph>`: prefigure ৰেণ্ডাৰাৰত yLabelPosition="bottom" সমৰ্থিত নহয়; ওপৰফালৰ আচৰণ ব্যৱহাৰ কৰা হৈছে।

prefigure-invalid-axis-bounds = `<graph>`: prefigure ৰূপান্তৰৰ বাবে অক্ষৰ সীমা অবৈধ; পূৰ্বনিৰ্ধাৰিত bbox (-10,-10,10,10) ব্যৱহাৰ কৰা হৈছে।

prefigure-invalid-width = `<graph>`: prefigure ৰূপান্তৰৰ বাবে প্ৰস্থ অবৈধ; পূৰ্বনিৰ্ধাৰিত চিত্ৰপ্ৰস্থ 425 ব্যৱহাৰ কৰা হৈছে।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ৰূপান্তৰৰ বাবে aspectRatio অবৈধ; পূৰ্বনিৰ্ধাৰিত অনুপাত 1 ব্যৱহাৰ কৰা হৈছে।

prefigure-grid-spacing-too-fine = `<graph>`: অক্ষৰ সীমাৰ তুলনাত গ্ৰিডৰ ব্যৱধান বৰ সূক্ষ্ম; prefigure ৰেণ্ডাৰাৰত গ্ৰিডটো বাদ দিয়া হৈছে।

prefigure-annotations-not-rendered = `<graph>`: PreFigure ৰেণ্ডাৰাৰ ব্যৱহাৰ নকৰিলে টোকা ৰেণ্ডাৰ কৰা নহ'ব।

multiple-annotations-children = `<graph>`-ত একাধিক `<annotations>` সন্তান পোৱা গৈছে; শেষটোৰ বাহিৰে বাকী সকলো উপেক্ষা কৰা হৈছে।

## Referring to other components

copy-unrecognized-component-type = অজ্ঞাত উপাদান ধৰণ সম্প্ৰসাৰণ বা নকল কৰিব নোৱাৰি: { $type }।

copy-prop-not-found = { $component } ধৰণৰ উপাদানত { $property } প্ৰপ বিচাৰি পোৱা নগ'ল

collect-no-source = collect-ৰ বাবে কোনো উৎস পোৱা নগ'ল।

collect-invalid-component-type = `<{ $component }>` ধৰণৰ উপাদান সংগ্ৰহ কৰিব নোৱাৰি, কাৰণ ই এটা অবৈধ উপাদান ধৰণ।

reference-index-unavailable = `{ $reference }` সূচকটো নিৰ্দেশ কৰিব নোৱাৰি

## `<callAction>`

component-action-unavailable = `{ $reference }` উপাদানত { $action } মাতিব নোৱাৰি

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ডেটাৰ আকৃতি অবৈধ।  শাৰীবোৰৰ দৈৰ্ঘ্য অসামঞ্জস্যপূৰ্ণ। componentIdx :{ $componentIdx }-ত পোৱা গৈছে

data-frame-duplicate-column-names = ডেটাত একে নামৰ স্তম্ভ আছে।  componentIdx :{ $componentIdx }-ত পোৱা গৈছে

data-frame-missing-column-name = ডেটাৰ এটা স্তম্ভৰ নাম নাই।  componentIdx :{ $componentIdx }-ত পোৱা গৈছে

## `<answer>` and scoring

answer-award-depends-on-own-response = এই answer-ৰ এটা award একেটা answer টেগৰ নিজৰ দাখিল কৰা উত্তৰৰ ওপৰত ভিত্তি কৰি তৈয়াৰ, যিয়ে অপ্ৰত্যাশিত আচৰণৰ কাৰণ হ'ব।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` থকা ধাৰকৰ ভিতৰত থকা `<answer>`-ত `maxNumAttempts` দিলে কোনো প্ৰভাৱ নপৰে, কাৰণ প্ৰয়াসৰ সংখ্যা ধাৰকটোৱেই নিয়ন্ত্ৰণ কৰে। ইয়াৰ ঠাইত ধাৰকৰ ওপৰত `maxNumAttempts` দিয়ক।

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` থকা আন এটা ধাৰকৰ ভিতৰত থকা `sectionWideCheckWork` ধাৰকৰ ওপৰত `maxNumAttempts` দিলে কোনো প্ৰভাৱ নপৰে, কাৰণ প্ৰয়াসৰ সংখ্যা বাহিৰৰ ধাৰকটোৱেই নিয়ন্ত্ৰণ কৰে। ইয়াৰ ঠাইত বাহিৰৰ ধাৰকৰ ওপৰত `maxNumAttempts` দিয়ক।

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality নিৰ্ধাৰণ কৰা নাথাকিলে { $attributes } এট্ৰিবিউটৰ কোনো প্ৰভাৱ নাথাকিব।
       *[other] symbolicEquality নিৰ্ধাৰণ কৰা নাথাকিলে { $attributes } এট্ৰিবিউটবোৰৰ কোনো প্ৰভাৱ নাথাকিব।
    }

answer-invalid-type = answer-ৰ বাবে ধৰণ অবৈধ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` উপাদানটোৰ কোনো নাম নথকাত ইয়াক module-ৰ এট্ৰিবিউট হিচাপে ব্যৱহাৰ কৰিব নোৱাৰি

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` উপাদানটো module-ৰ এট্ৰিবিউট হিচাপে ব্যৱহাৰ কৰিব নোৱাৰি, কাৰণ `<module>` উপাদান ধৰণত ইতিমধ্যে "{ $name }" নামৰ এটা এট্ৰিবিউট সংজ্ঞায়িত আছে।

conditional-content-condition-ignored = case বা else সন্তান থকা `<conditionalContent>` উপাদানত `condition` এট্ৰিবিউট উপেক্ষা কৰা হয়।

slider-markers-type-mismatch = চিহ্নৰ ধৰণ শ্লাইডাৰৰ ধৰণৰ সৈতে মিলা নাই।

pretzel-problem-needs-statement-and-answer = pretzel অবৈধ: প্ৰতিটো `<problem>`-ত এটা `<statement>` আৰু এটা `<answer>` থাকিব লাগিব।

pretzel-circuit-first-problem-distractor = pretzel অবৈধ: mode="circuit"-ত প্ৰথম `<problem>` এটা বিভ্ৰান্তিকৰ বিকল্প হ'ব নোৱাৰে।

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` এট্ৰিবিউটৰ বাবে { $values } মানটো অবৈধ; উপেক্ষা কৰা হৈছে।
       *[other] `{ $attribute }` এট্ৰিবিউটৰ বাবে { $values } মানবোৰ অবৈধ; উপেক্ষা কৰা হৈছে।
    }

attribute-must-be-references = `{ $attribute }` এট্ৰিবিউটৰ বাবে `{ $value }` মানটো অবৈধ। এট্ৰিবিউটটো `$`-এৰে আৰম্ভ হোৱা ৰেফাৰেন্সেৰে গঠিত হ'ব লাগিব।

math-input-invalid-function-names = <mathInput>: { $attribute }-ত অবৈধ ফলনৰ নাম উপেক্ষা কৰা হৈছে: { $names }। প্ৰতিটো নামৰ প্ৰদৰ্শন-অংশ অন্ততঃ 2 আখৰৰ (আখৰ বা হাইফেন) হ'ব লাগিব; ইয়াৰ পিছত বিকল্পভাৱে এটা `|<mathspeak alternative>` অংশ বহিব পাৰে।

## Building components from the source

component-type-invalid = উপাদান ধৰণ অবৈধ: `<{ $componentType }>`

attribute-repeated = { $attribute } এট্ৰিবিউটৰ পুনৰাবৃত্তি কৰিব নোৱাৰি।

attribute-invalid-for-component = `<{ $componentType }>` ধৰণৰ উপাদানৰ বাবে "{ $attribute }" এট্ৰিবিউটটো অবৈধ।

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } শৈলী সংজ্ঞাত { $context ->
        [text-on-background] পটভূমিৰ ৰঙৰ সাপেক্ষে লিখাৰ ৰঙৰ
        [high-contrast] কেনভাচৰ সাপেক্ষে উচ্চ-বৈসাদৃশ্য ৰঙৰ
        [line] কেনভাচৰ সাপেক্ষে ৰেখাৰ ৰঙৰ
        [marker] কেনভাচৰ সাপেক্ষে চিহ্নৰ ৰঙৰ
       *[text-on-canvas] কেনভাচৰ সাপেক্ষে লিখাৰ ৰঙৰ
    } বৈসাদৃশ্য পৰ্যাপ্ত নহয়{ $mode ->
        [dark] { " (গাঢ় ম'ড)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; অন্ততঃ { $threshold }:1 প্ৰয়োজন)।

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } শৈলী সংজ্ঞাত নিৰ্দিষ্ট কৰা ৰঙবোৰে পাতল ম'ডত পৰ্যাপ্ত বৈসাদৃশ্য দিলেও, সেই মানৰ পৰা পোৱা গাঢ়-ম'ডৰ ৰঙত পটভূমিৰ ৰঙৰ সাপেক্ষে লিখাৰ ৰঙৰ বৈসাদৃশ্য পৰ্যাপ্ত নহয় ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; অন্ততঃ { $threshold }:1 প্ৰয়োজন)। { $suggestion ->
        [available] গাঢ় ম'ডত পৰ্যাপ্ত বৈসাদৃশ্য নিশ্চিত কৰিবলৈ হয় পাতল ম'ডৰ বৈসাদৃশ্য বঢ়াওক (যেনে { $lightAttribute }="{ $lightColor }" দিয়ক), নহয় গাঢ়-ম'ডৰ ৰঙটো নিজেই নিৰ্ধাৰণ কৰক (যেনে { $darkAttribute }="{ $darkColor }" দিয়ক)।
       *[none] গাঢ় ম'ডত পৰ্যাপ্ত বৈসাদৃশ্য নিশ্চিত কৰিবলৈ পাতল ম'ডৰ বৈসাদৃশ্য বঢ়াওক, অথবা textColorDarkMode আৰু/বা backgroundColorDarkMode-ৰে উদ্ভূত ৰঙবোৰ নিজেই নিৰ্ধাৰণ কৰক।
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } শৈলী সংজ্ঞাত নিৰ্দিষ্ট কৰা লিখাৰ ৰঙে পাতল ম'ডত পৰ্যাপ্ত বৈসাদৃশ্য দিলেও, সেই মানৰ পৰা পোৱা গাঢ়-ম'ডৰ লিখাৰ ৰঙত কেনভাচৰ সাপেক্ষে বৈসাদৃশ্য পৰ্যাপ্ত নহয় ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; অন্ততঃ { $threshold }:1 প্ৰয়োজন)। { $suggestion ->
        [available] গাঢ় ম'ডত পৰ্যাপ্ত বৈসাদৃশ্য নিশ্চিত কৰিবলৈ হয় পাতল ম'ডৰ বৈসাদৃশ্য বঢ়াওক (যেনে textColor="{ $lightColor }" দিয়ক), নহয় গাঢ়-ম'ডৰ ৰঙটো নিজেই নিৰ্ধাৰণ কৰক (যেনে textColorDarkMode="{ $darkColor }" দিয়ক)।
       *[none] গাঢ় ম'ডত পৰ্যাপ্ত বৈসাদৃশ্য নিশ্চিত কৰিবলৈ পাতল ম'ডৰ বৈসাদৃশ্য বঢ়াওক, অথবা textColorDarkMode-এৰে উদ্ভূত ৰঙটো নিজেই নিৰ্ধাৰণ কৰক।
    }

section-multiple-style-palettes = এটা খণ্ডই কেৱল এটা <stylePalette> বাছিব পাৰে; শেষটো ব্যৱহাৰ কৰা হৈছে।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component }-ৰ স্বতন্ত্ৰ ৰূপভেদ নিৰ্ধাৰণ কৰিব পৰা নাযায়, কাৰণ numToSelect এটা অঋণাত্মক পূৰ্ণসংখ্যা নহয়।

variant-num-to-select-not-constant-number = { $component }-ৰ স্বতন্ত্ৰ ৰূপভেদ নিৰ্ধাৰণ কৰিব পৰা নাযায়, কাৰণ numToSelect এটা ধ্ৰুৱ সংখ্যা নহয়।

variant-with-replacement-not-constant-boolean = { $component }-ৰ স্বতন্ত্ৰ ৰূপভেদ নিৰ্ধাৰণ কৰিব পৰা নাযায়, কাৰণ withReplacement এটা ধ্ৰুৱ বুলিয়ান নহয়।

variant-select-weight-disables-unique = কোনো বিকল্পত selectWeight বা selectForVariants নিৰ্দিষ্ট কৰা থাকিলে select-ৰ স্বতন্ত্ৰ ৰূপভেদ নিষ্ক্ৰিয় থাকে

variant-coprime-undetermined = { $component }-ৰ স্বতন্ত্ৰ ৰূপভেদ নিৰ্ধাৰণ কৰিব পৰা নাযায়, কাৰণ coprime সদায় মিছা নেকি সেয়া নিৰ্ধাৰণ কৰিব পৰা নাযায়।

variant-attribute-not-constant = { $component }-ৰ স্বতন্ত্ৰ ৰূপভেদ নিৰ্ধাৰণ কৰিব পৰা নাযায়, কাৰণ { $attribute } এটা ধ্ৰুৱক নহয়।

variant-attribute-not-number = { $component }-ৰ স্বতন্ত্ৰ ৰূপভেদ নিৰ্ধাৰণ কৰিব পৰা নাযায়, কাৰণ { $attribute } এটা সংখ্যা নহয়।

variant-attribute-wrong-type-for-sequence =
    { $type } ধৰণৰ { $component }-ৰ স্বতন্ত্ৰ ৰূপভেদ নিৰ্ধাৰণ কৰিব পৰা নাযায়, কাৰণ { $attribute } { $expected ->
        [letters-combination] এটা আখৰ সমষ্টি
        [math-expression] এটা বৈধ গাণিতিক ৰাশি
        [integer] এটা পূৰ্ণসংখ্যা
       *[number] এটা সংখ্যা
    } নহয়।

variant-length-not-integer = { $component }-ৰ স্বতন্ত্ৰ ৰূপভেদ নিৰ্ধাৰণ কৰিব পৰা নাযায়, কাৰণ length এটা পূৰ্ণসংখ্যা নহয়।

variant-sort-not-implemented = sort-সহ { $component }-ৰ স্বতন্ত্ৰ ৰূপভেদ ৰূপায়িত হোৱা নাই

variant-exclude-combinations-not-implemented = excludeCombinations-সহ { $component }-ৰ স্বতন্ত্ৰ ৰূপভেদ ৰূপায়িত হোৱা নাই

variant-math-exclude-not-implemented = exclude-সহ math ধৰণৰ { $component }-ৰ স্বতন্ত্ৰ ৰূপভেদ ৰূপায়িত হোৱা নাই

variant-non-constant-exclude-not-implemented = ধ্ৰুৱ নোহোৱা exclude-সহ { $component }-ৰ স্বতন্ত্ৰ ৰূপভেদ ৰূপায়িত হোৱা নাই

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure ৰেণ্ডাৰাৰত সমৰ্থিত নহয়; উত্তৰসূৰীটো বাদ দিয়া হৈছে।

prefigure-descendant-invalid-geometry = { $subject }: জ্যামিতি সসীম নহয় বা অসম্পূৰ্ণ; উত্তৰসূৰীটো বাদ দিয়া হৈছে।

prefigure-curve-label-omitted = { $subject }: ৰূপান্তৰিত বক্ৰৰেখা উপাদানত লেবেল সমৰ্থিত নহয়; লেবেল বাদ দিয়া হৈছে।

prefigure-curve-unsupported-definition-type = { $subject }: '{ $definitionType }' বক্ৰৰেখা ফলন সংজ্ঞাৰ ধৰণটো সমৰ্থিত নহয়; উত্তৰসূৰীটো বাদ দিয়া হৈছে।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves-ত flipFunctions এট্ৰিবিউটটো সমৰ্থিত নহয়; উত্তৰসূৰীটো বাদ দিয়া হৈছে।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves-ত কেৱল সূত্ৰ-ধৰণৰ সন্তান ফলন সমৰ্থিত; উত্তৰসূৰীটো বাদ দিয়া হৈছে।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] ৰেখা-গোত্ৰৰ লেবেলৰ
       *[point] বিন্দুৰ লেবেলৰ
    } বাবে '{ $labelPosition }' labelPosition সমৰ্থিত নহয়; PreFigure-ৰ পূৰ্বনিৰ্ধাৰিত সজ্জা ব্যৱহাৰ কৰা হৈছে।

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' ভৰোৱা শৈলীটো PreFigure-এ সমৰ্থন নকৰে; নিটোল ভৰোৱালৈ উভতি যোৱা হৈছে।

prefigure-line-style-unknown = { $subject }: অজ্ঞাত ৰেখা শৈলী '{ $lineStyle }' PreFigure আউটপুটৰ পৰা বাদ দিয়া হৈছে।

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' চিহ্ন শৈলীটো PreFigure-ৰ 'diamond' শৈলীৰ সৈতে মিলোৱা হৈছে।

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' চিহ্ন শৈলীটো PreFigure-এ সমৰ্থন নকৰে; পূৰ্বনিৰ্ধাৰিত শৈলী ব্যৱহাৰ কৰা হৈছে।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` অবৈধ; লক্ষ্য নিৰ্ণয় কৰিব পৰা নাযায়। টোকাটো বাদ দিয়া হৈছে।

annotation-ref-multiple-targets = `<annotation>`: `ref` একাধিক লক্ষ্যত উপনীত হৈছে; প্ৰথম লক্ষ্যটো ব্যৱহাৰ কৰা হৈছে।

annotation-ref-outside-graph = `<annotation>`: `ref` অবৈধ; লক্ষ্যটো ধাৰক graph-ৰ বাহিৰত। টোকাটো বাদ দিয়া হৈছে।

annotation-ref-unsupported-target = `<annotation>`: `ref` অবৈধ; prefigure ৰূপান্তৰত লক্ষ্যটো সমৰ্থিত লৈখিক বস্তু নহয়। টোকাটো বাদ দিয়া হৈছে।

annotation-text-missing = `<annotation>`: `text` নাই বা খালী; খালী লিখা সৃষ্টি কৰা হৈছে।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] চক্ৰাকাৰ নিৰ্ভৰতা চিনাক্ত কৰা হৈছে।
       *[other] `<{ $componentType }>` উপাদান জড়িত চক্ৰাকাৰ নিৰ্ভৰতা চিনাক্ত কৰা হৈছে।
    }

reference-no-referent = ৰেফাৰেন্সৰ বাবে কোনো লক্ষ্য পোৱা নগ'ল: `{ $reference }`

reference-multiple-referents = ৰেফাৰেন্সৰ বাবে একাধিক লক্ষ্য পোৱা গৈছে: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>`-ৰ { $attribute } এট্ৰিবিউটৰ বিন্যাস অবৈধ।

children-invalid = `<{ $componentType }>`-ৰ বাবে সন্তান অবৈধ: অবৈধ সন্তান পোৱা গৈছে: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` এট্ৰিবিউটৰ বাবে `{ $value }` মানটো অবৈধ, `{ $default }` মানটো ব্যৱহাৰ কৰা হৈছে

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML সংস্কৰণ { $version } পোৱা নগ'ল।
       *[other] DoenetML সংস্কৰণ { $version } পোৱা নগ'ল। { $fallback } সংস্কৰণলৈ উভতি যোৱা হৈছে
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML অবৈধ: { $content }

parse-tag-missing-close-tag = DoenetML অবৈধ: `{ $tag }` টেগটোৰ কোনো সমাপ্তি টেগ নাই। এটা স্ব-সমাপ্ত টেগ বা এটা `</{ $tagName }>` টেগ প্ৰত্যাশিত আছিল।

parse-tag-error = DoenetML অবৈধ: `<{ $tagName }>` টেগত ত্ৰুটি

parse-attribute-missing-value = DoenetML অবৈধ: `{ $attribute }` এট্ৰিবিউটটো অবৈধ, যেন ইয়াৰ মান নাই।

parse-attribute-invalid = DoenetML অবৈধ: `{ $attribute }` এট্ৰিবিউটটো অবৈধ

parse-attribute-value-invalid = DoenetML অবৈধ: `{ $value }` এট্ৰিবিউট মানটো অবৈধ

parse-attribute-value-quote-mismatch = DoenetML অবৈধ: `{ $value }` এট্ৰিবিউট মানটো অবৈধ। উদ্ধৃতিচিহ্নবোৰ মিলা নাই। যেন এটা `{ $quote }` নাই

parse-open-tag-name-missing = DoenetML অবৈধ: নাম নোহোৱা এটা টেগ পোৱা গৈছে, যেনে `<`

parse-tag-not-closed = DoenetML অবৈধ: `{ $tag }` টেগটো বন্ধ কৰা হোৱা নাই (যেন এটা `>` নাই)।

parse-self-closing-tag-name-missing = DoenetML অবৈধ: নাম নোহোৱা এটা টেগ পোৱা গৈছে `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML অবৈধ: `{ $tag }` টেগটো বন্ধ কৰা হোৱা নাই (যেন `/>` নাই)।

parse-tag-invalid-attributes = DoenetML অবৈধ: `{ $tag }` টেগটো বৈধ নহয়। ইয়াৰ এট্ৰিবিউটত ভুল থাকিব পাৰে।

parse-close-tag-name-missing = DoenetML অবৈধ: নাম নোহোৱা এটা সমাপ্তি টেগ পোৱা গৈছে, যেনে `</`

parse-attribute-value-unquoted = এট্ৰিবিউটৰ মান উদ্ধৃতিচিহ্নত আবদ্ধ থাকিব লাগিব: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML অবৈধ: `{ $tag }` সমাপ্তি টেগ পোৱা গৈছে, কিন্তু ইয়াৰ সংগতিপূৰ্ণ কোনো আৰম্ভণিৰ টেগ নাই

parse-close-tag-mismatched = DoenetML অবৈধ: সমাপ্তি টেগ মিলা নাই। `</{ $expected }>` প্ৰত্যাশিত আছিল। পোৱা গ'ল `{ $found }`

parser-node-unconvertible = { $node } ন'ডটো Dast ন'ডলৈ ৰূপান্তৰ কৰিব পৰা নগ'ল।

## Names

name-attribute-invalid =
    name='{ $name }' এট্ৰিবিউটটো অবৈধ। { $reason ->
        [characters] নামত কেৱল আখৰ, সংখ্যা, আণ্ডাৰস্ক'ৰ বা হাইফেন থাকিব পাৰে।
       *[start] নাম এটা আখৰেৰে আৰম্ভ হ'ব লাগিব।
    }

component-name-invalid-start = "{ $name }" উপাদানৰ নামটো অবৈধ। নাম এটা আখৰেৰে আৰম্ভ হ'ব লাগিব।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched ধৰণৰ answer-ত এটা video এট্ৰিবিউট থাকিব লাগিব

answer-video-watched-video-not-reference = videoWatched ধৰণৰ answer-ৰ video এট্ৰিবিউটটো এটা ৰেফাৰেন্স হ'ব লাগিব

answer-name-not-single-text = answer-ৰ name এট্ৰিবিউটত এটাই মাত্ৰ text সন্তান থাকিব লাগিব

## Referencing another document

external-doenetml-recursion-limit = পুনৰাবৃত্তিৰ স্তৰ বেছি হোৱাত বাহিৰৰ DoenetML আনিব পৰা নাযায়। ক'ৰবাত চক্ৰাকাৰ ৰেফাৰেন্স আছে নেকি?

external-doenetml-unavailable = { $attribute }="{ $uri }"-ৰ পৰা DoenetML আনিব পৰা নাযায়

external-doenetml-type-mismatch = { $attribute }="{ $uri }"-ৰ পৰা অনা DoenetML অবৈধ: ই "{ $componentType }" উপাদান ধৰণৰ সৈতে মিলা নাই

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` এট্ৰিবিউটটো অপ্ৰচলিত; ইয়াৰ ঠাইত `{ $to }` ব্যৱহাৰ কৰক।
       *[other] [deprecation] `<{ $component }>`-ৰ `{ $from }` এট্ৰিবিউটটো অপ্ৰচলিত; ইয়াৰ ঠাইত `{ $to }` ব্যৱহাৰ কৰক।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }`-ও নিৰ্দিষ্ট কৰা আছে বাবে `{ $from }` এট্ৰিবিউটটো অপ্ৰচলিত আৰু উপেক্ষিত।
       *[other] [deprecation] `{ $to }`-ও নিৰ্দিষ্ট কৰা আছে বাবে `<{ $component }>`-ৰ `{ $from }` এট্ৰিবিউটটো অপ্ৰচলিত আৰু উপেক্ষিত।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`-ৰ `{ $attribute }` এট্ৰিবিউটটো অপ্ৰচলিত আৰু উপেক্ষিত।


## Language coverage

pluralize-english-only = `<pluralize>`-এ কেৱল ইংৰাজী বহুবচন কৰিব পাৰে, গতিকে { $locale } ভাষাত লিখা নথিত ইয়াৰ লিখা অপৰিৱৰ্তিত থাকে। বহুবচন ৰূপটো পোনপটীয়াকৈ লিখক, অথবা `pluralForm` এট্ৰিবিউটেৰে নিৰ্ধাৰণ কৰক।


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` উপাদানটো Doenet-ৰ পৰিচিত উপাদান নহয়।

schema-element-not-allowed-at-root = `<{ $tag }>` উপাদানটো নথিৰ মূলত অনুমোদিত নহয়।

schema-element-not-allowed-inside = `<{ $tag }>` উপাদানটো `<{ $parent }>`-ৰ ভিতৰত অনুমোদিত নহয়।

schema-attribute-unrecognized = `<{ $tag }>` উপাদানৰ `{ $attribute }` নামৰ কোনো এট্ৰিবিউট নাই।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` উপাদানৰ `{ $attribute }` এট্ৰিবিউটটো এনে এটা তালিকা হ'ব লাগিব যাৰ প্ৰতিটো ভুক্তি ইয়াৰ এটা: { $allowed }
       *[other] `<{ $tag }>` উপাদানৰ `{ $attribute }` এট্ৰিবিউটটো ইয়াৰ এটা হ'ব লাগিব: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select-ৰ বাবে ৰূপভেদৰ নাম অবৈধ।  { $variantName } ৰূপভেদৰ নামটো { $numOptions }টা বিকল্পত আছে কিন্তু বাছনি কৰিবলগীয়া সংখ্যা { $numToSelect }।

select-variant-name-without-options = select-ৰ বাবে কিছু ৰূপভেদ নিৰ্দিষ্ট কৰা আছে কিন্তু সম্ভাৱ্য ৰূপভেদৰ নাম { $variantName }-ৰ বাবে কোনো বিকল্প নিৰ্দিষ্ট কৰা নাই।

select-variant-name-not-possible = select-ৰ বাবে নিৰ্দিষ্ট কৰা { $variantName } ৰূপভেদৰ নামটো এটা সম্ভাৱ্য ৰূপভেদৰ নাম নহয়।

select-too-few-options = কেৱল { $numOptions }টাৰ পৰা { $numToSelect }টা উপাদান বাছনি কৰিব নোৱাৰি।

select-from-sequence-too-few-values = { $length } দৈৰ্ঘ্যৰ এটা অনুক্ৰমৰ পৰা { $numToSelect }টা মান বাছনি কৰিব নোৱাৰি।

select-from-sequence-indices-count-mismatch = select-ৰ বাবে নিৰ্দিষ্ট কৰা সূচকৰ সংখ্যা বাছনি কৰিবলগীয়া সংখ্যাৰ সৈতে মিলিব লাগিব

select-from-sequence-indices-not-integers = select-ৰ বাবে নিৰ্দিষ্ট কৰা সকলো সূচক পূৰ্ণসংখ্যা হ'ব লাগিব

select-from-sequence-index-excluded = selectfromsequence-ৰ যি সূচকটো নিৰ্দিষ্ট কৰা হৈছিল সেয়া বাদ দিয়া আছিল

select-from-sequence-indices-excluded-combination = selectfromsequence-ৰ যি সূচকবোৰ নিৰ্দিষ্ট কৰা হৈছিল সেয়া এটা বাদ দিয়া সমাবেশ আছিল

select-from-sequence-coprime-not-positive-integers = ধনাত্মক পূৰ্ণসংখ্যা বাছনি কৰা হোৱা নাই বাবে সহমৌলিক সমাবেশ বাছনি কৰিব নোৱাৰি।

select-from-sequence-coprime-common-factor = সহমৌলিক সংখ্যা বাছনি কৰিব নোৱাৰি। সকলো সম্ভাৱ্য মানৰ এটা সাধাৰণ উৎপাদক আছে। ("from" বা "to"-ৰ নিৰ্দিষ্ট কৰা মান "step"-ৰ সৈতে সহমৌলিক হ'ব লাগিব।)

select-from-sequence-coprime-single-number = 1 নোহোৱা এটাই মাত্ৰ সংখ্যাৰ পৰা সহমৌলিক সমাবেশ বাছনি কৰিব নোৱাৰি।

select-from-sequence-excluded-too-many-combinations = selectFromSequence-ত 70%-তকৈ অধিক সমাবেশ বাদ দিয়া হৈছে

select-from-sequence-coprime-none-found = সহমৌলিক সংখ্যা বাছনি কৰিব পৰা নগ'ল। সকলো সম্ভাৱ্য মানৰ এটা সাধাৰণ উৎপাদক আছে।

select-from-sequence-too-few-unique-values = { $numPossibleValues } দৈৰ্ঘ্যৰ অনুক্ৰমৰ পৰা { $numToSelect }টা স্বতন্ত্ৰ মান বাছনি কৰিব নোৱাৰি

select-prime-numbers-too-few-values = { $numValues } দৈৰ্ঘ্যৰ মৌলিক সংখ্যাৰ তালিকাৰ পৰা { $numToSelect }টা মান বাছনি কৰিব নোৱাৰি

select-prime-numbers-values-count-mismatch = select-ৰ বাবে নিৰ্দিষ্ট কৰা মানৰ সংখ্যা বাছনি কৰিবলগীয়া সংখ্যাৰ সৈতে মিলিব লাগিব

select-prime-numbers-values-not-prime = select prime number-ৰ বাবে নিৰ্দিষ্ট কৰা সকলো মান মৌলিক সংখ্যাৰ তালিকাত থাকিব লাগিব

select-prime-numbers-values-excluded-combination = selectPrimeNumbers-ৰ নিৰ্দিষ্ট কৰা মানবোৰ এটা বাদ দিয়া সমাবেশ আছিল

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-ত 70%-তকৈ অধিক সমাবেশ বাদ দিয়া হৈছে

select-random-combination-fluke = অতি অসম্ভৱ এক আকস্মিকতাৰ বাবে বিশৃংখল মানৰ সমাবেশ বাছনি কৰিব পৰা নগ'ল

select-random-value-fluke = অতি অসম্ভৱ এক আকস্মিকতাৰ বাবে বিশৃংখল মান বাছনি কৰিব পৰা নগ'ল
