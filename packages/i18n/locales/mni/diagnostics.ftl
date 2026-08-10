# Manipuri (Meitei) diagnostics: errors and warnings surfaced to the reader or
# author. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`
# and the rest — are part of the language rather than prose, and stay in
# English exactly as written. So does the `[deprecation]` marker.
#
# মখল is *type* here and nothing else: an attribute is এট্রিবিউট and a variant
# রূপভেদ, as `editor.ftl`'s header sets out.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] অরোয়বা চেৎ অনিমক পীরবদা { $attributes } লৌথোক্লি
       *[other] অরোয়বা চেৎ অনিমক পীরবদা { $attributes } লৌথোক্লি
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] অরোয়বা চেৎ অমসুং মরক্তা লৈবা চেৎ অনিমক পীরবদা { $attributes } লৌথোক্লি
       *[other] অরোয়বা চেৎ অমসুং মরক্তা লৈবা চেৎ অনিমক পীরবদা { $attributes } লৌথোক্লি
    }

line-segment-midpoint-offset-without-midpoint = মরক্তা লৈবা চেৎ য়াওদনা midpointOffset-না করিসু তৌদে

## `<line>`

line-points-undetermined-dimensions = লেপ্তবা মচাওগী চেৎসিংদগী চৎপা পরেং।

line-points-too-few-dimensions = পরেং অসি খ্বাইদগী য়াম্বা মচাও অনিগী চেৎসিংদগী চৎপা তাই।

line-points-depend-on-variables = পরেং অসি চরদা লৈবা চেৎসিংদগী চৎলি: { $variables }।

line-equation-invalid-format = চর { $variable1 } অমসুং { $variable2 }-দা পরেংগী সমীকরণগী অরানবা মওং।

## `<ray>`

ray-overprescribed-through = কিরণ অসি through, endpoint অমসুং direction — অহুম্মক্না লেপ্লি। পীরিবা through লৌথোক্লি।

ray-dimension-mismatch = কিরণদা numDimensions চান্নদে।

## `<vector>`

vector-overprescribed-head = সদিশ অসি head, tail অমসুং displacement — অহুম্মক্না লেপ্লি। পীরিবা head লৌথোক্লি।

vector-dimension-mismatch = সদিশদা numDimensions চান্নদে।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>`-দা nearestPoint কৌবা ফিভম চর লৈতে, মরম অদুনা মদুগী মফমদা চিংশিনবা ঙমদে।

constrain-to-without-nearest-point = `<{ $component }>`-দা nearestPoint কৌবা ফিভম চর লৈতে, মরম অদুনা মদুদা থিংবা ঙমদে।

constrain-to-interior-without-nearest-point = `<{ $component }>`-দা nearestPoint কৌবা ফিভম চর লৈতে, মরম অদুনা মদুগী মনুংদা থিংবা ঙমদে।

## `<choiceInput>`

choice-input-label-position-ignored = ইনলাইন নত্তবা choiceInput-কীদমক labelPosition লৌথোক্লি

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-কীদমক পীরিবা ইন্দেক্স লৌথোক্লি, মরমদি ইন্দেক্সকী মশিং অসি খনগদবা মচাসিংগী মশিংগা চান্নদে।

pretzel-indices-count-mismatch = problem-গীদমক পীরিবা ইন্দেক্স লৌথোক্লি, মরমদি ইন্দেক্সকী মশিং অসি problem মচাসিংগী মশিংগা চান্নদে।

shuffle-indices-count-mismatch = shuffle-গীদমক পীরিবা ইন্দেক্স লৌথোক্লি, মরমদি ইন্দেক্সকী মশিং অসি শরুকশিংগী মশিংগা চান্নদে।

indices-ignored-out-of-range = { $component }-গীদমক পীরিবা ইন্দেক্স লৌথোক্লি, মরমদি ইন্দেক্স খরা মখল অসিগী মপান্দা লৈরি।

pretzel-indices-repeated = pretzel-গীদমক পীরিবা ইন্দেক্স লৌথোক্লি, মরমদি ইন্দেক্স খরা অমুক হন্না লৈরি।

pretzel-circuit-first-index = circuit মোদতা pretzel-গীদমক পীরিবা ইন্দেক্স লৌথোক্লি, মরমদি অহানবা ইন্দেক্স অসি 1 ওইগদবনি।

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` অসি স্ত্রিং মচাসিংগা লোয়ননা থবক তৌনবা `type` এট্রিবিউট পীবা তঙাইফদে।

invalid-type-defaulting-to-math = { $component } শরুক্কীদমক { $type } মখল অসি অরানবনি। math, text, number নত্ত্রগা boolean-গী মরক্তা অমা ওইগদবনি। অহানবা ওইনা math লৌই।

string-not-valid-component-to-arrange = স্ত্রিং "{ $value }" অসি { $component }-গীদমক য়াবা শরুক নত্তে। লৌথোক্লি।

## Types and variables

invalid-type-defaulting-to-number = { $type } মখল অসি অরানবনি, মখল অসি number ওইহল্লি।

invalid-variable-value = চরগী অরানবা মমল: `{ $value }`

## Variants

variant-index-must-be-number = রূপভেদ ইন্দেক্স { $index } অসি মশিং অমা ওইগদবনি

variant-index-must-be-integer = রূপভেদ ইন্দেক্স { $index } অসি পূর্ণাংক অমা ওইগদবনি

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` অসি নিরপেক্ষ চাংগীদমক শেমদে। অপাকপা অসি সাপেক্ষ ওইহল্লি।

side-by-side-absolute-margins = `<{ $component }>` অসি নিরপেক্ষ চাংগীদমক শেমদে। মপান অসি সাপেক্ষ ওইহল্লি।

side-by-side-no-block-child = অরানবা `<{ $component }>`: মসিদা খ্বাইদগী য়াম্বা ব্লক মচা অমা লৈগদবনি।

## `<label>`

label-for-ignored-on-graphical = আলেখীয় `<label>`-দা `for` এট্রিবিউট লৌথোক্লি।

label-for-must-resolve-to-one = `<label>`-দা `for` এট্রিবিউট অসি শরুক অমখক্তা উৎপা তাই।

label-for-unresolved = `<label>`-দা `for` এট্রিবিউট অসিনা শরুক অমত্তা উৎপা ঙমদে।

label-for-answer-with-authored-inputs = `<label>`-দা `for` এট্রিবিউট অসিনা ইরিবনা মশামক ইনপুত ইখিবা `<answer>` অদু উৎলি; ইনপুত অদু ফজনা উৎলু।

label-for-answer-without-input = `<label>`-দা `for` এট্রিবিউট অসিনা মমিং থোনবা য়াবা ইনপুত লৈতবা `<answer>` অদু উৎলি।

label-for-must-reference-input-or-answer = `<label>`-দা `for` এট্রিবিউট অসিনা ইনপুত অমা নত্ত্রগা পাউখুম অমা উৎপা তাই।

## Accessibility

accessibility-short-description-or-decorative = শিজিন্নবা য়াবগীদমক `<{ $component }>`-দা য়াম্না শাংদবা ৱারোল লৈগদবনি নত্ত্রগা মদুবু decorative হায়গদবনি।

accessibility-video-short-description = শিজিন্নবা য়াবগীদমক `<video>`-দা য়াম্না শাংদবা ৱারোল লৈগদবনি।

accessibility-input-short-description-or-label = শিজিন্নবা য়াবগীদমক `<{ $component }>`-দা য়াম্না শাংদবা ৱারোল নত্ত্রগা মমিং লৈগদবনি।

accessibility-answer-input-short-description-or-label = শিজিন্নবা য়াবগীদমক ইনপুত শেম্বা `<answer>`-দা য়াম্না শাংদবা ৱারোল নত্ত্রগা মমিং লৈগদবনি।

accessibility-short-description-contains-math = য়াম্না শাংদবা ৱারোলদা `<{ $component }>` অসিগুম্বা গণিতকী শরুক লৈরোইদবনি। গণিত অদু ৱাহৈনা ইরো।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] শরুক্কী মমিংগী ৱারোলগীদমক { $colorName }-গী মমল খেন্নবা য়াম্না মকুপ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; খ্বাইদগী য়াম্না { $threshold }:1 তঙাইফদে) (অমুবা মোদ)।
       *[other] শরুক্কী মমিংগী ৱারোলগীদমক { $colorName }-গী মমল খেন্নবা য়াম্না মকুপ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; খ্বাইদগী য়াম্না { $threshold }:1 তঙাইফদে)।
    }

## `<circle>`

circle-through-points-non-numerical = চেৎসিংগী মশিংগী মমল লৈতবা মফমদা { $count } চেৎতগী চৎপা `<circle>` হৌজিক ফাওবদা শেম্লবা লৈতে।

circle-too-many-through-points = চেৎ অহুমদগী হেন্না চৎপা বৃত্ত পারবা ঙমদে।

circle-overprescribed-radius-center-points = পীরিবা ত্রিজ্যা, মরক অমসুং চেৎ — অহুম্মক্কা লোয়ননা বৃত্ত পারবা ঙমদে।

circle-center-with-multiple-points = পীরিবা মরক্কা লোয়ননা চেৎ অমদগী হেন্না চৎপা বৃত্ত পারবা ঙমদে।

circle-radius-too-small = বৃত্ত পারবা ঙমদে: চেৎ অনিগী মরক্কী লাপথোকপা { $distance } ওইবনা, পীরিবা ত্রিজ্যা { $radius } অসি য়াম্না পীক্লি।

circle-radius-with-many-points = পীরিবা ত্রিজ্যাগা লোয়ননা চেৎ অনিদগী হেন্না চৎপা বৃত্ত শেম্বা ঙমদে।

circle-invalid-center-or-through-points = বৃত্তকী অরানবা মরক নত্ত্রগা চেৎ।

circle-radius-center-with-multiple-points = পীরিবা মরক্কা লোয়ননা চেৎ অমদগী হেন্না চৎপা বৃত্তকী ত্রিজ্যা পারবা ঙমদে।

circle-change-radius-non-numerical = মশিংগী মমল লৈতবা চেৎতগী চৎপা বৃত্তকী ত্রিজ্যা হোংদোকপা ঙমদে

circle-radius-with-points-non-numerical = মশিংগী মমল লৈতবদা, পীরিবা ত্রিজ্যাগা লোয়ননা চেৎ অমদগী হেন্না চৎপা বৃত্ত শেম্বা ঙমদে।

circle-change-center-non-numerical = মশিংগী মমল লৈতবা চেৎতগী চৎপা বৃত্তকী মরক হোংদোকপা হৌজিক ফাওবদা শেম্লবা লৈতে।

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] ফলনগী প্রান্তকীদমক মচাও মকুপ্লি। প্রান্তদা অন্তরাল { $intervals } লৈরি অদুবু ফলনদা ইনপুত { $inputs ->
            [one] { $inputs }
           *[other] { $inputs }
        } লৈরি।
       *[other] ফলনগী প্রান্তকীদমক মচাও মকুপ্লি। প্রান্তদা অন্তরাল { $intervals } লৈরি অদুবু ফলনদা ইনপুত { $inputs ->
            [one] { $inputs }
           *[other] { $inputs }
        } লৈরি।
    }

function-domain-invalid-format = ফলনগী প্রান্তকী অরানবা মওং।

function-ignoring-non-numerical =
    { $type ->
        [maximum] ফলনগী মশিং নত্তবা খ্বাইদগী ৱাংবা মমল লৌথোক্লি।
        [minimum] ফলনগী মশিং নত্তবা খ্বাইদগী নেম্বা মমল লৌথোক্লি।
        [extremum] ফলনগী মশিং নত্তবা অরোয়বা মমল লৌথোক্লি।
        [point] ফলনগী মশিং নত্তবা চেৎ লৌথোক্লি।
        [slope] ফলনগী মশিং নত্তবা ঢাল লৌথোক্লি।
       *[other] ফলনগী মশিং নত্তবা { $type } লৌথোক্লি।
    }

function-ignoring-empty =
    { $type ->
        [maximum] ফলনগী অহাংবা খ্বাইদগী ৱাংবা মমল লৌথোক্লি।
        [minimum] ফলনগী অহাংবা খ্বাইদগী নেম্বা মমল লৌথোক্লি।
        [extremum] ফলনগী অহাংবা অরোয়বা মমল লৌথোক্লি।
        [point] ফলনগী অহাংবা চেৎ লৌথোক্লি।
       *[other] ফলনগী অহাংবা { $type } লৌথোক্লি।
    }

function-points-too-close = ফলনদা চেৎ অনি য়াম্না নকনা লৈরি। ফলন লেপ্পা ঙমদে।

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] ফলনগী আবৃত্তি অসি ইনপুত্কী মশিং অমসুং আউটপুত্কী মশিং মান্নবা মতমদখক্তা ওইবা ঙমই। ফলন অসিদা ইনপুত { $inputs } অমসুং আউটপুত { $outputs ->
            [one] { $outputs }
           *[other] { $outputs }
        } লৈরি।
       *[other] ফলনগী আবৃত্তি অসি ইনপুত্কী মশিং অমসুং আউটপুত্কী মশিং মান্নবা মতমদখক্তা ওইবা ঙমই। ফলন অসিদা ইনপুত { $inputs } অমসুং আউটপুত { $outputs ->
            [one] { $outputs }
           *[other] { $outputs }
        } লৈরি।
    }

## `<sequence>`

sequence-invalid-length = অনুক্রমগী অরানবা অশাংবা। ঋণাত্মক নত্তবা পূর্ণাংক অমা ওইগদবনি।

sequence-invalid-step = অনুক্রমগী অরানবা খোংথাং। { $type } মখলগী অনুক্রমগীদমক মশিং অমা ওইগদবনি।

sequence-invalid-endpoint-number = মশিংগী অনুক্রমগী অরানবা "{ $attribute }"। মশিং অমা ওইগদবনি।

sequence-invalid-endpoint-letters = ময়েক্কী অনুক্রমগী অরানবা "{ $attribute }"। ময়েক পুনশিনবা অমা ওইগদবনি।

sequence-invalid-endpoint = অনুক্রমগী অরানবা "{ $attribute }"।

select-from-sequence-coprime-not-numbers = মশিং খল্লবা নত্তবনা coprime লৌথোক্লি

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations পীরবনা coprime লৌথোক্লি

## Resolving a `target`

target-not-found = `<{ $source }>`-গী অরানবা পান্দম: পান্দম ফংদে।

target-state-variable-not-found = `<{ $source }>`-গী অরানবা পান্দম: `<{ $component }>`-দা "{ $property }" কৌবা ফিভম চর ফংদে।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-গী চরসিং অসি নিংতম্বা চরদগী তোঙানবা ওইগদবনি।

ode-system-duplicate-variable-names = অমুক হন্না লৈবা আশ্রিত চরগী মমিংগা লোয়ননা ODE RHS ফলন লেপ্পা ঙমদে।

ode-system-rhs-function-error = ODE RHS ফলন লেপ্পা ঙমদে। mathjs ফলন শেম্বদা অশোয়বা।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = পরেং { $count }-গী মরক্তা কোণ লেপ্পা ঙমদে

angle-invalid-through-point = `<angle>`-গী through-দা অরানবা চেৎ

parabola-vertex-too-many-points = মকোক্কা লোয়ননা চেৎ অমদগী হেন্না চৎপা পরবলয় হৌজিক ফাওবদা শেম্লবা লৈতে।

parabola-too-many-points = চেৎ অহুমদগী হেন্না চৎপা পরবলয় হৌজিক ফাওবদা শেম্লবা লৈতে।

intersection-too-many-items = পোৎ অনিদগী হেন্নবগী প্রতিচ্ছেদ হৌজিক ফাওবদা শেম্লবা লৈতে

## Other math components

ionic-compound-not-two-ions = আয়ন অনি নত্তবা অতোপ্পগীদমক আয়নিক যৌগিক হৌজিক ফাওবদা শেম্লবা লৈতে।

ionic-compound-needs-cation-and-anion = আয়নিক যৌগিক অসি ধনায়ন অমা অমসুং ঋণায়ন অমখক্তগীদমক শেম্লি।

solve-equations-cannot-evaluate = সমীকরণগী মমল থিবা ঙমদবনা মদু পাউখুম পীবা ঙমদে: { $equation }

math-operators-operand-number-required = গণিতকী সংকার্য লৌথোক্নবা operandNumber পীবা তঙাইফদে।

eigen-decomposition-failed = আব্যূহগী আইগেন মমল পারবা ঙমদে

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: প্রাচল { $parameters } অসি নমুনাদা লৈতে, মরম অদুনা মদু মতম পুম্নমক্তা অহাংবগা চান্নগনি।
       *[other] `<matchesPattern>`: প্রাচল { $parameters } অসি নমুনাদা লৈতে, মরম অদুনা মখোয় মতম পুম্নমক্তা অহাংবগা চান্নগনি।
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" অসি খঙবা ঙমদে। মসি none, medium, dense, নত্ত্রগা অহাংবনা খায়দোকপা ধনাত্মক মশিং অনি ওইগদবনি, খুদম ওইনা grid="1 0.5"। জালি অমত্তা শেম্লবা লৈতে।

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure উৎপা মশীনদা xLabelPosition="left" চৎনদে; right-কী মওং লৌই।

prefigure-y-label-position-unsupported = `<graph>`: prefigure উৎপা মশীনদা yLabelPosition="bottom" চৎনদে; top-কী মওং লৌই।

prefigure-invalid-axis-bounds = `<graph>`: prefigure হোংদোকপগীদমক অরানবা অক্ষ মখল; অহানবা bbox (-10,-10,10,10) লৌই।

prefigure-invalid-width = `<graph>`: prefigure হোংদোকপগীদমক অরানবা অপাকপা; অহানবা মমিগী অপাকপা 425 লৌই।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure হোংদোকপগীদমক অরানবা aspectRatio; অহানবা অনুপাত 1 লৌই।

prefigure-grid-spacing-too-fine = `<graph>`: অক্ষগী মখলগীদমক জালিগী মরক য়াম্না পীক্লি; prefigure উৎপা মশীনদা জালি থাদোক্লি।

prefigure-annotations-not-rendered = `<graph>`: PreFigure উৎপা মশীন শিজিন্নদ্রবদি ৱারোলসিং শেম্লোই।

multiple-annotations-children = `<graph>`-দা `<annotations>` মচা কয়া ফংলে; অরোয়বদু নত্তনা পুম্নমক লৌথোক্লি।

## Referring to other components

copy-unrecognized-component-type = খঙদবা শরুক মখল অসি হেনগৎপা নত্ত্রগা কোপি তৌবা ঙমদে: { $type }।

copy-prop-not-found = { $component } মখলগী শরুক্তা { $property } মগুন ফংদে

collect-no-source = collect-কীদমক হৌরকফম অমত্তা ফংদে।

collect-invalid-component-type = `<{ $component }>` মখলগী শরুক পুনশিনবা ঙমদে, মরমদি মসি অরানবা শরুক মখলনি।

reference-index-unavailable = ইন্দেক্স `{ $reference }` উৎপা ঙমদে

## `<callAction>`

component-action-unavailable = শরুক `{ $reference }`-দা { $action } কৌবা ঙমদে

## `<dataFrame>`

data-frame-inconsistent-row-lengths = দাতাগী মওং অরানবনি। পরিংশিংগী অশাংবা চান্নদে। componentIdx :{ $componentIdx }-দা ফংলে

data-frame-duplicate-column-names = দাতাদা অমুক হন্না লৈবা কোলমগী মমিং লৈরি। componentIdx :{ $componentIdx }-দা ফংলে

data-frame-missing-column-name = দাতাদা কোলমগী মমিং অমা লৈতে। componentIdx :{ $componentIdx }-দা ফংলে

## `<answer>` and scoring

answer-award-depends-on-own-response = পাউখুম অসিগী award অমা অসি answer তেগ অসিগী মশাগী থাদোকখ্রবা পাউখুমদা য়ুম্ফম ওই, মদুনা থাজদবা মওং পুরককনি।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` লৈবা পুক্নীংগী মনুংদা লৈবা `<answer>`-দা `maxNumAttempts` পীবনা করিসু তৌদে, মরমদি হোৎনবগী মশিং অদু পুক্নীংনা লমজিংই। `maxNumAttempts` অদু পুক্নীংদা পীয়ু।

nested-section-wide-check-work-max-num-attempts = অতোপ্পা `sectionWideCheckWork` পুক্নীংগী মনুংদা লৈবা `sectionWideCheckWork` পুক্নীংদা `maxNumAttempts` পীবনা করিসু তৌদে, মরমদি হোৎনবগী মশিং অদু মপান্দগী পুক্নীংনা লমজিংই। `maxNumAttempts` অদু মপান্দগী পুক্নীংদা পীয়ু।

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality লৈত্রবদি { $attributes } এট্রিবিউট অসিনা করিসু তৌরোই।
       *[other] symbolicEquality লৈত্রবদি { $attributes } এট্রিবিউটসিংনা করিসু তৌরোই।
    }

answer-invalid-type = পাউখুমগী অরানবা মখল: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` শরুক্কী মমিং লৈতে, মরম অদুনা মদুবু module-গী এট্রিবিউট ওইনা শিজিন্নবা ঙমদে

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` শরুক অসি module-গী এট্রিবিউট ওইনা শিজিন্নবা ঙমদে, মরমদি `<module>` শরুক মখলদা "{ $name }" এট্রিবিউট অসি হান্ননা লেপ্লে।

conditional-content-condition-ignored = case নত্ত্রগা else মচা লৈবা `<conditionalContent>` শরুক্তা `condition` এট্রিবিউট লৌথোক্লি।

slider-markers-type-mismatch = খুদমগী মখল অসি slider-গী মখলগা চান্নদে।

pretzel-problem-needs-statement-and-answer = অরানবা pretzel: `<problem>` খুদিংদা `<statement>` অমা অমসুং `<answer>` অমা লৈগদবনি।

pretzel-circuit-first-problem-distractor = অরানবা pretzel: mode="circuit"-তা অহানবা `<problem>` অসি ভ্রামক ওইবা ঙমদে।

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` এট্রিবিউটগীদমক অরানবা মমল { $values }; লৌথোক্লি।
       *[other] `{ $attribute }` এট্রিবিউটগীদমক অরানবা মমল { $values }; লৌথোক্লি।
    }

attribute-must-be-references = `{ $attribute }` এট্রিবিউটগীদমক `{ $value }` অসি অরানবা মমলনি। এট্রিবিউট অসি `$`-না হৌবা মরীসিংনা শেম্বা তাই।

math-input-invalid-function-names = <mathInput>: { $attribute }-দা অরানবা ফলনগী মমিং লৌথোক্লি: { $names }। মমিং খুদিংগী উৎপা শরুক্তা খ্বাইদগী য়াম্না ময়েক অনি (ময়েক নত্ত্রগা মরী খুদম) লৈগদবনি; মদুগী মতুংদা `|<mathspeak alternative>` হাপচিনবা য়াই।

## Building components from the source

component-type-invalid = অরানবা শরুক মখল: `<{ $componentType }>`

attribute-repeated = { $attribute } এট্রিবিউট অমুক হন্না পীবা ঙমদে।

attribute-invalid-for-component = `<{ $componentType }>` মখলগী শরুক্কীদমক "{ $attribute }" এট্রিবিউট অসি অরানবনি।

## Style definition contrast

style-definition-insufficient-contrast =
    মওং লেপ্পা { $styleNumber }-দা { $context ->
        [text-on-background] মতুংগী মচুগী মাইকৈদা ৱারোলগী মচু
        [high-contrast] কেনভাসকী মাইকৈদা খেন্নবা য়াম্বা মচু
        [line] কেনভাসকী মাইকৈদা পরেংগী মচু
        [marker] কেনভাসকী মাইকৈদা খুদমগী মচু
       *[text-on-canvas] কেনভাসকী মাইকৈদা ৱারোলগী মচু
    } অসিগী মমল খেন্নবা মকুপ্লি{ $mode ->
        [dark] { " (অমুবা মোদ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; খ্বাইদগী য়াম্না { $threshold }:1 তঙাইফদে)।

style-definition-dark-mode-text-background-contrast =
    মওং লেপ্পা { $styleNumber }-দা পীরিবা মচুসিংনা অঙৌবা মোদকীদমক মমল খেন্নবা কুপ্না পীরবসু, মখোয়দগী শেম্লকপা অমুবা মোদকী মচুসিংদা মতুংগী মচুগী মাইকৈদা ৱারোলগী মচুগী খেন্নবা মকুপ্লি ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; খ্বাইদগী য়াম্না { $threshold }:1 তঙাইফদে)। { $suggestion ->
        [available] অমুবা মোদতা মমল খেন্নবা কুপ্নবগীদমক অঙৌবা মোদকী খেন্নবা হেনগৎহল্লু (খুদম ওইনা { $lightAttribute }="{ $lightColor }"), নত্ত্রগা অমুবা মোদকী মচু নশানা পীয়ু (খুদম ওইনা { $darkAttribute }="{ $darkColor }")।
       *[none] অমুবা মোদতা মমল খেন্নবা কুপ্নবগীদমক অঙৌবা মোদকী খেন্নবা হেনগৎহল্লু, নত্ত্রগা শেম্লকপা মচুসিং textColorDarkMode অমসুং/নত্ত্রগা backgroundColorDarkMode-না নশানা পীয়ু।
    }

style-definition-dark-mode-text-canvas-contrast =
    মওং লেপ্পা { $styleNumber }-দা পীরিবা ৱারোলগী মচুনা অঙৌবা মোদকীদমক মমল খেন্নবা কুপ্না পীরবসু, মদুদগী শেম্লকপা অমুবা মোদকী ৱারোলগী মচুনা কেনভাসকী মাইকৈদা খেন্নবা মকুপ্লি ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; খ্বাইদগী য়াম্না { $threshold }:1 তঙাইফদে)। { $suggestion ->
        [available] অমুবা মোদতা মমল খেন্নবা কুপ্নবগীদমক অঙৌবা মোদকী খেন্নবা হেনগৎহল্লু (খুদম ওইনা textColor="{ $lightColor }"), নত্ত্রগা অমুবা মোদকী মচু নশানা পীয়ু (খুদম ওইনা textColorDarkMode="{ $darkColor }")।
       *[none] অমুবা মোদতা মমল খেন্নবা কুপ্নবগীদমক অঙৌবা মোদকী খেন্নবা হেনগৎহল্লু, নত্ত্রগা শেম্লকপা মচু textColorDarkMode-না নশানা পীয়ু।
    }

section-multiple-style-palettes = শরুক অমনা <stylePalette> অমখক্তা খনবা ঙমই; অরোয়বদু লৌই।

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component }-গী তোঙানবা রূপভেদ লেপ্পা ঙমদে, মরমদি numToSelect অসি ঋণাত্মক নত্তবা পূর্ণাংক নত্তে।

variant-num-to-select-not-constant-number = { $component }-গী তোঙানবা রূপভেদ লেপ্পা ঙমদে, মরমদি numToSelect অসি লেপ্লবা মশিং নত্তে।

variant-with-replacement-not-constant-boolean = { $component }-গী তোঙানবা রূপভেদ লেপ্পা ঙমদে, মরমদি withReplacement অসি লেপ্লবা বূলিয়ন নত্তে।

variant-select-weight-disables-unique = খনগদবা অমদা selectWeight নত্ত্রগা selectForVariants পীরবদি select-কী তোঙানবা রূপভেদ থিংই

variant-coprime-undetermined = { $component }-গী তোঙানবা রূপভেদ লেপ্পা ঙমদে, মরমদি coprime অসি মতম পুম্নমক্তা অরানবনি হায়বদু লেপ্পা ঙমদে।

variant-attribute-not-constant = { $component }-গী তোঙানবা মখল লেপ্পা ঙমদে, মরমদি { $attribute } অসি লেপ্লবা নত্তে।

variant-attribute-not-number = { $component }-গী তোঙানবা মখল লেপ্পা ঙমদে, মরমদি { $attribute } অসি মশিং নত্তে।

variant-attribute-wrong-type-for-sequence =
    { $type } মখলগী { $component }-গী তোঙানবা মখল লেপ্পা ঙমদে, মরমদি { $attribute } অসি { $expected ->
        [letters-combination] ময়েক পুনশিনবা
        [math-expression] য়াবা গণিতকী ৱাহৈ ময়েক
        [integer] পূর্ণাংক
       *[number] মশিং
    } নত্তে।

variant-length-not-integer = { $component }-গী তোঙানবা মখল লেপ্পা ঙমদে, মরমদি length অসি পূর্ণাংক নত্তে।

variant-sort-not-implemented = sort লৈবা { $component }-গী তোঙানবা মখল হৌজিক ফাওবদা শেম্লবা লৈতে

variant-exclude-combinations-not-implemented = excludeCombinations লৈবা { $component }-গী তোঙানবা মখল হৌজিক ফাওবদা শেম্লবা লৈতে

variant-math-exclude-not-implemented = exclude লৈবা math মখলগী { $component }-গী তোঙানবা মখল হৌজিক ফাওবদা শেম্লবা লৈতে

variant-non-constant-exclude-not-implemented = লেপ্তবা exclude লৈবা { $component }-গী তোঙানবা মখল হৌজিক ফাওবদা শেম্লবা লৈতে

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure উৎপা মশীনদা চৎনদে; মচা থাদোক্লে।

prefigure-descendant-invalid-geometry = { $subject }: অরোয়বা লৈতবা নত্ত্রগা মপুং ফাদবা জ্যামিতি; মচা থাদোক্লে।

prefigure-curve-label-omitted = { $subject }: হোংদোকখ্রবা কোয়বা পরেংগী শরুক্তা মমিং চৎনদে; মমিং থাদোক্লে।

prefigure-curve-unsupported-definition-type = { $subject }: কোয়বা পরেংগী ফলন লেপ্পগী মখল '{ $definitionType }' চৎনদে; মচা থাদোক্লে।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves-তা flipFunctions এট্রিবিউট চৎনদে; মচা থাদোক্লে।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves-তা formula মখলগী মচা ফলনখক্তা চৎনই; মচা থাদোক্লে।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] পরেং মখলগী মমিং
       *[point] চেৎকী মমিং
    }-গীদমক labelPosition '{ $labelPosition }' চৎনদে; অহানবা PreFigure মায়কৈ লৌখ্রে।

prefigure-fill-style-unsupported = { $subject }: থল্লবগী মওং '{ $fillStyle }' অসি PreFigure-না চৎনদে; মপুং ফাবা থল্লবা লৌখ্রে।

prefigure-line-style-unknown = { $subject }: খঙদবা পরেংগী মওং '{ $lineStyle }' PreFigure-গী থোরকপদগী থাদোক্লে।

prefigure-marker-style-mapped-to-diamond = { $subject }: খুদমগী মওং '{ $markerStyle }' অসি PreFigure-গী 'diamond' মওংদা হোংহল্লে।

prefigure-marker-style-unsupported = { $subject }: খুদমগী মওং '{ $markerStyle }' অসি PreFigure-না চৎনদে; অহানবা মওং লৌখ্রে।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: অরানবা `ref`; পান্দম ফংদে। ৱারোল থাদোক্লে।

annotation-ref-multiple-targets = `<annotation>`: `ref`-না পান্দম কয়া ফংহল্লে; অহানবা পান্দম লৌখ্রে।

annotation-ref-outside-graph = `<annotation>`: অরানবা `ref`; পান্দম অসি graph অদুগী মপান্দা লৈরি। ৱারোল থাদোক্লে।

annotation-ref-unsupported-target = `<annotation>`: অরানবা `ref`; prefigure হোংদোকপদা পান্দম অসি চৎনবা আলেখীয় পোৎ নত্তে। ৱারোল থাদোক্লে।

annotation-text-missing = `<annotation>`: `text` লৈতে নত্ত্রগা অহাংবনি; অহাংবা ৱারোল পীখ্রে।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] কোয়বা তংদুনা লৈবা ফংলে।
       *[other] `<{ $componentType }>` শরুক য়াওনা কোয়বা তংদুনা লৈবা ফংলে।
    }

reference-no-referent = মরীগী পান্দম অমত্তা ফংদে: `{ $reference }`

reference-multiple-referents = মরীগী পান্দম কয়া ফংলে: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>`-গী { $attribute } এট্রিবিউটগী অরানবা মওং।

children-invalid = `<{ $componentType }>`-গীদমক অরানবা মচা: অরানবা মচা ফংলে: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` এট্রিবিউটগীদমক `{ $value }` অসি অরানবা মমলনি, `{ $default }` মমল লৌই

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML ভর্সন { $version } ফংদে।
       *[other] DoenetML ভর্সন { $version } ফংদে। ভর্সন { $fallback } লৌই
    }

## Reading the DoenetML

parse-invalid-doenetml = অরানবা DoenetML: { $content }

parse-tag-missing-close-tag = অরানবা DoenetML: তেগ `{ $tag }`-কী লোইশিনবা তেগ লৈতে। মশানা লোইশিনজবা তেগ নত্ত্রগা `</{ $tagName }>` তেগ তঙাইফদে।

parse-tag-error = অরানবা DoenetML: তেগ `<{ $tagName }>`-দা অশোয়বা

parse-attribute-missing-value = অরানবা DoenetML: অরানবা এট্রিবিউট `{ $attribute }`-দা মমল লৈতবা মালি।

parse-attribute-invalid = অরানবা DoenetML: অরানবা এট্রিবিউট `{ $attribute }`

parse-attribute-value-invalid = অরানবা DoenetML: অরানবা মখলগী মমল `{ $value }`

parse-attribute-value-quote-mismatch = অরানবা DoenetML: অরানবা মখলগী মমল `{ $value }`। উদ্ধরণ খুদম চান্নদে। `{ $quote }` লৈতবা মালি

parse-open-tag-name-missing = অরানবা DoenetML: তেগ মমিং য়াওদবা তেগ ফংলে, খুদম ওইনা `<`

parse-tag-not-closed = অরানবা DoenetML: তেগ `{ $tag }` লোইশিনদে (`>` লৈতবা মালি)।

parse-self-closing-tag-name-missing = অরানবা DoenetML: তেগ মমিং য়াওদবা তেগ ফংলে `<{ $content }>`

parse-self-closing-tag-not-closed = অরানবা DoenetML: তেগ `{ $tag }` লোইশিনদে (`/>` লৈতবা মালি)।

parse-tag-invalid-attributes = অরানবা DoenetML: তেগ `{ $tag }` অসি য়াদে। মদুগী মখলসিং অরানবা ওইবা য়াই।

parse-close-tag-name-missing = অরানবা DoenetML: তেগ মমিং য়াওদবা লোইশিনবা তেগ ফংলে, খুদম ওইনা `</`

parse-attribute-value-unquoted = মখলগী মমল অসি উদ্ধরণ খুদমগী মনুংদা থমগদবনি: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = অরানবা DoenetML: লোইশিনবা তেগ `{ $tag }` ফংলে, অদুবু মদুগা চান্নবা হাংদোকপা তেগ লৈতে

parse-close-tag-mismatched = অরানবা DoenetML: লোইশিনবা তেগ চান্নদে। `</{ $expected }>` তঙাইফদে। `{ $found }` ফংলে

parser-node-unconvertible = নোদ { $node } অসি Dast নোদতা হোংদোকপা ঙমদে।

## Names

name-attribute-invalid =
    অরানবা মখল name='{ $name }'। { $reason ->
        [characters] মমিংদা ময়েক, মশিং, মখাগী পরেং নত্ত্রগা মরী খুদমখক্তা লৈবা য়াই।
       *[start] মমিং অসি ময়েক অমনা হৌগদবনি।
    }

component-name-invalid-start = অরানবা শরুক্কী মমিং "{ $name }"। মমিং অসি ময়েক অমনা হৌগদবনি।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched মখলগী পাউখুমদা video মখল লৈগদবনি

answer-video-watched-video-not-reference = videoWatched মখলগী পাউখুমগী video মখল অসি মরী অমা ওইগদবনি

answer-name-not-single-text = পাউখুমগী name মখলদা ৱারোলগী মচা অমখক্তা লৈগদবনি

## Referencing another document

external-doenetml-recursion-limit = থাক য়াম্না কয়া হন্না হন্না চৎপনা মপান্দগী DoenetML পুরকপা ঙমদে। কোয়বা মরী অমা লৈব্রা?

external-doenetml-unavailable = { $attribute }="{ $uri }"-দগী DoenetML পুরকপা ঙমদে

external-doenetml-type-mismatch = { $attribute }="{ $uri }"-দগী পুরকপা DoenetML অসি অরানবনি: মসি "{ $componentType }" শরুক মখলগা চান্নদে

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] এট্রিবিউট `{ $from }` থাদোক্লে; মদুগী মহুত্তা `{ $to }` শিজিন্নৌ।
       *[other] [deprecation] `<{ $component }>`-দা এট্রিবিউট `{ $from }` থাদোক্লে; মদুগী মহুত্তা `{ $to }` শিজিন্নৌ।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] এট্রিবিউট `{ $from }` থাদোক্লে অমসুং লৌথোক্লে, মরমদি `{ $to }`-সু পীরে।
       *[other] [deprecation] `<{ $component }>`-দা এট্রিবিউট `{ $from }` থাদোক্লে অমসুং লৌথোক্লে, মরমদি `{ $to }`-সু পীরে।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`-দা এট্রিবিউট `{ $attribute }` থাদোক্লে অমসুং লৌথোক্লে।

deprecated-attribute-to-child = [deprecation] `<{ $component }>`-দা এট্রিবিউট `{ $attribute }` থাদোক্লে; মদুগী মহুত্তা `<{ $child }>` মচা শিজিন্নৌ।

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>`-দা এট্রিবিউট `{ $attribute }`-গী মমল `{ $value }` থাদোক্লে; মদুগী মহুত্তা `{ $to }` শিজিন্নৌ।


## Language coverage

pluralize-english-only = `<pluralize>`-না ইংলিশখক্তগী মশিং কয়াগী মওং শেম্বা ঙমই, মরম অদুনা { $locale }-দা ইবা দোকুমেন্তা মদুগী ৱারোল হোংদোক্তনা লৈ। মশিং কয়াগী মওং অদু ফজনা ইরো, নত্ত্রগা `pluralForm` মখলনা পীয়ু।


## Checking against the schema

schema-element-unrecognized = শরুক `<{ $tag }>` অসি খঙবা Doenet শরুক নত্তে।

schema-element-not-allowed-at-root = শরুক `<{ $tag }>` অসি দোকুমেন্তকী মরূদা য়াদে।

schema-element-not-allowed-inside = শরুক `<{ $tag }>` অসি `<{ $parent }>`-গী মনুংদা য়াদে।

schema-attribute-unrecognized = শরুক `<{ $tag }>`-দা `{ $attribute }` কৌবা মখল লৈতে।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] শরুক `<{ $tag }>`-গী `{ $attribute }` মখল অসি পোৎ খুদিংমক মসিসিংগী মরক্তা অমা ওইবা পরিং অমা ওইগদবনি: { $allowed }
       *[other] শরুক `<{ $tag }>`-গী `{ $attribute }` মখল অসি মসিসিংগী মরক্তা অমা ওইগদবনি: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select-কীদমক অরানবা রূপভেদগী মমিং। রূপভেদগী মমিং { $variantName } অসি খনগদবা { $numOptions }-দা লৈরি অদুবু খনগদবা মশিংদি { $numToSelect }-নি।

select-variant-name-without-options = select-কীদমক রূপভেদ খরা পীরে অদুবু ওইথোকপা য়াবা রূপভেদগী মমিং { $variantName }-গীদমক খনগদবা অমত্তা পীদে।

select-variant-name-not-possible = select-কীদমক পীরিবা রূপভেদগী মমিং { $variantName } অসি ওইথোকপা য়াবা রূপভেদগী মমিং নত্তে।

select-too-few-options = { $numOptions }খক্তদগী শরুক { $numToSelect } খনবা ঙমদে।

select-from-sequence-too-few-values = অশাংবা { $length }-গী অনুক্রমদগী মমল { $numToSelect } খনবা ঙমদে।

select-from-sequence-indices-count-mismatch = select-কীদমক পীরিবা ইন্দেক্সকী মশিং অসি খনগদবা মশিংগা চান্নগদবনি

select-from-sequence-indices-not-integers = select-কীদমক পীরিবা ইন্দেক্স পুম্নমক পূর্ণাংক ওইগদবনি

select-from-sequence-index-excluded = selectfromsequence-গী পীরিবা ইন্দেক্স অসি থাদোকখ্রবনি

select-from-sequence-indices-excluded-combination = selectfromsequence-গী পীরিবা ইন্দেক্স অসি থাদোকখ্রবা পুনশিনবনি

select-from-sequence-coprime-not-positive-integers = ধনাত্মক পূর্ণাংক খল্লবা নত্তবনা সহ-অভাজ্য পুনশিনবা খনবা ঙমদে।

select-from-sequence-coprime-common-factor = সহ-অভাজ্য মশিং খনবা ঙমদে। ওইথোকপা য়াবা মমল পুম্নমক্না গুণনখণ্ড অমা শারুই। ("from" নত্ত্রগা "to"-গী পীরিবা মমলসিং অসি "step"-কা সহ-অভাজ্য ওইগদবনি।)

select-from-sequence-coprime-single-number = 1 নত্তবা মশিং অমখক্তদগী সহ-অভাজ্য পুনশিনবা খনবা ঙমদে।

select-from-sequence-excluded-too-many-combinations = selectFromSequence-দা পুনশিনবগী 70%-দগী হেন্না থাদোকখ্রে

select-from-sequence-coprime-none-found = সহ-অভাজ্য মশিং খনবা ঙমখিদে। ওইথোকপা য়াবা মমল পুম্নমক্না গুণনখণ্ড অমা শারুই।

select-from-sequence-too-few-unique-values = অশাংবা { $numPossibleValues }-গী অনুক্রমদগী তোঙানবা মমল { $numToSelect } খনবা ঙমদে

select-prime-numbers-too-few-values = অশাংবা { $numValues }-গী অভাজ্য মশিংগী পরিংদগী মমল { $numToSelect } খনবা ঙমদে

select-prime-numbers-values-count-mismatch = select-কীদমক পীরিবা মমলগী মশিং অসি খনগদবা মশিংগা চান্নগদবনি

select-prime-numbers-values-not-prime = select prime number-কীদমক পীরিবা মমল পুম্নমক অভাজ্য মশিংগী পরিংদা লৈগদবনি

select-prime-numbers-values-excluded-combination = selectPrimeNumbers-কী পীরিবা মমলসিং অসি থাদোকখ্রবা পুনশিনবনি

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-দা পুনশিনবগী 70%-দগী হেন্না থাদোকখ্রে

select-random-combination-fluke = য়াম্না ওইথোকপা ঙমদবা মওংদা যাদৃচ্ছিক মমলগী পুনশিনবা খনবা ঙমখিদে

select-random-value-fluke = য়াম্না ওইথোকপা ঙমদবা মওংদা যাদৃচ্ছিক মমল খনবা ঙমখিদে
