# Khmer diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Khmer has a single plural category, so a countable message needs no
# selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } ត្រូវបានមិនអើពើ នៅពេលដែលបានកំណត់ចុងទាំងពីរ

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } ត្រូវបានមិនអើពើ នៅពេលដែលបានកំណត់ទាំងចុង និងចំណុចកណ្ដាល

line-segment-midpoint-offset-without-midpoint = midpointOffset គ្មានឥទ្ធិពលទេ បើគ្មានចំណុចកណ្ដាល

## `<line>`

line-points-undetermined-dimensions = បន្ទាត់កាត់តាមចំណុចដែលមិនច្បាស់អំពីវិមាត្រ។

line-points-too-few-dimensions = បន្ទាត់ត្រូវកាត់តាមចំណុចដែលមានយ៉ាងតិចពីរវិមាត្រ។

line-points-depend-on-variables = បន្ទាត់កាត់តាមចំណុចដែលអាស្រ័យលើអថេរ៖ { $variables }។

line-equation-invalid-format = ទម្រង់សមីការបន្ទាត់ក្នុងអថេរ { $variable1 } និង { $variable2 } មិនត្រឹមត្រូវ។

## `<ray>`

ray-overprescribed-through = កាំរស្មីត្រូវបានកំណត់ដោយ through, endpoint និង direction ព្រមគ្នា។ នឹងមិនអើពើ through ដែលបានកំណត់។

ray-dimension-mismatch = numDimensions មិនត្រូវគ្នាក្នុងកាំរស្មី។

## `<vector>`

vector-overprescribed-head = វ៉ិចទ័រត្រូវបានកំណត់ដោយ head, tail និង displacement ព្រមគ្នា។ នឹងមិនអើពើ head ដែលបានកំណត់។

vector-dimension-mismatch = numDimensions មិនត្រូវគ្នាក្នុងវ៉ិចទ័រ។

## Attracting and constraining

attract-to-without-nearest-point = មិនអាចទាញចូល `<{ $component }>` បានទេ ព្រោះវាគ្មានអថេរស្ថានភាព nearestPoint។

constrain-to-without-nearest-point = មិនអាចដាក់កម្រិតលើ `<{ $component }>` បានទេ ព្រោះវាគ្មានអថេរស្ថានភាព nearestPoint។

constrain-to-interior-without-nearest-point = មិនអាចដាក់កម្រិតក្នុងផ្ទៃខាងក្នុងនៃ `<{ $component }>` បានទេ ព្រោះវាគ្មានអថេរស្ថានភាព nearestPoint។

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ត្រូវបានមិនអើពើសម្រាប់ choiceInput ដែលមិនមែនជា inline

## Ordering children by index

choice-input-indices-count-mismatch = មិនអើពើ indices ដែលបានកំណត់សម្រាប់ choiceInput ព្រោះចំនួន indices មិនត្រូវនឹងចំនួនកូន choice។

pretzel-indices-count-mismatch = មិនអើពើ indices ដែលបានកំណត់សម្រាប់ problem ព្រោះចំនួន indices មិនត្រូវនឹងចំនួនកូន problem។

shuffle-indices-count-mismatch = មិនអើពើ indices ដែលបានកំណត់សម្រាប់ shuffle ព្រោះចំនួន indices មិនត្រូវនឹងចំនួនសមាសភាគ។

indices-ignored-out-of-range = មិនអើពើ indices ដែលបានកំណត់សម្រាប់ { $component } ព្រោះមាន indices ខ្លះហួសដែន។

pretzel-indices-repeated = មិនអើពើ indices ដែលបានកំណត់សម្រាប់ pretzel ព្រោះមាន indices ខ្លះស្ទួនគ្នា។

pretzel-circuit-first-index = មិនអើពើ indices ដែលបានកំណត់សម្រាប់ pretzel ក្នុងរបៀប circuit ព្រោះ index ដំបូងត្រូវតែជា 1។

## `<shuffle>` and `<sort>`

string-children-need-type = ដើម្បីឱ្យ `<{ $component }>` ដំណើរការជាមួយកូនជាអក្សរ ត្រូវកំណត់អាត្រីប្យូត `type`។

invalid-type-defaulting-to-math = type { $type } មិនត្រឹមត្រូវសម្រាប់សមាសភាគ { $component }។ ត្រូវតែជា math, text, number ឬ boolean។ នឹងប្រើ math ជាលំនាំដើម។

string-not-valid-component-to-arrange = អក្សរ "{ $value }" មិនមែនជាសមាសភាគត្រឹមត្រូវសម្រាប់ { $component } ទេ។ នឹងមិនអើពើ។

## Types and variables

invalid-type-defaulting-to-number = type { $type } មិនត្រឹមត្រូវ នឹងកំណត់ type ជា number។

invalid-variable-value = តម្លៃអថេរមិនត្រឹមត្រូវ៖ `{ $value }`

## Variants

variant-index-must-be-number = index នៃ variant { $index } ត្រូវតែជាចំនួន

variant-index-must-be-integer = index នៃ variant { $index } ត្រូវតែជាចំនួនគត់

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` មិនទាន់អនុវត្តសម្រាប់រង្វាស់ដាច់ខាតទេ។ នឹងកំណត់ទទឹងជាធៀប។

side-by-side-absolute-margins = `<{ $component }>` មិនទាន់អនុវត្តសម្រាប់រង្វាស់ដាច់ខាតទេ។ នឹងកំណត់រឹមជាធៀប។

side-by-side-no-block-child = `<{ $component }>` មិនត្រឹមត្រូវ៖ វាត្រូវតែមានកូនប្លុកយ៉ាងតិចមួយ។

## `<label>`

label-for-ignored-on-graphical = អាត្រីប្យូត `for` លើ `<label>` ក្នុងក្រាហ្វិកត្រូវបានមិនអើពើ។

label-for-must-resolve-to-one = អាត្រីប្យូត `for` លើ `<label>` ត្រូវតែសំដៅទៅសមាសភាគតែមួយ។

label-for-unresolved = អាត្រីប្យូត `for` លើ `<label>` មិនអាចសំដៅទៅសមាសភាគណាមួយបានទេ។

label-for-answer-with-authored-inputs = អាត្រីប្យូត `for` លើ `<label>` សំដៅទៅ `<answer>` ដែលមានប្រអប់បញ្ចូលសរសេរដោយអ្នកនិពន្ធ។ សូមសំដៅទៅប្រអប់បញ្ចូលដោយផ្ទាល់។

label-for-answer-without-input = អាត្រីប្យូត `for` លើ `<label>` សំដៅទៅ `<answer>` ដែលគ្មានប្រអប់បញ្ចូលឱ្យដាក់ស្លាក។

label-for-must-reference-input-or-answer = អាត្រីប្យូត `for` លើ `<label>` ត្រូវតែសំដៅទៅប្រអប់បញ្ចូល ឬ answer។

## Accessibility

accessibility-short-description-or-decorative = ដើម្បីលទ្ធភាពប្រើប្រាស់ `<{ $component }>` ត្រូវតែមានការពិពណ៌នាខ្លី ឬត្រូវកំណត់ថាជាការតុបតែង។

accessibility-video-short-description = ដើម្បីលទ្ធភាពប្រើប្រាស់ `<video>` ត្រូវតែមានការពិពណ៌នាខ្លី។

accessibility-input-short-description-or-label = ដើម្បីលទ្ធភាពប្រើប្រាស់ `<{ $component }>` ត្រូវតែមានការពិពណ៌នាខ្លី ឬស្លាក។

accessibility-answer-input-short-description-or-label = ដើម្បីលទ្ធភាពប្រើប្រាស់ `<answer>` ដែលបង្កើតប្រអប់បញ្ចូល ត្រូវតែមានការពិពណ៌នាខ្លី ឬស្លាក។

accessibility-short-description-contains-math = ការពិពណ៌នាខ្លីមិនគួរមានសមាសភាគគណិតវិទ្យាដូចជា `<{ $component }>` ទេ។ សូមសរសេរគណិតវិទ្យាជាពាក្យ។

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } មានកម្រិតផ្ទុយពណ៌មិនគ្រប់គ្រាន់សម្រាប់អក្សរចំណងជើងផ្នែក (របៀបងងឹត) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ត្រូវការយ៉ាងតិច { $threshold }:1)។
       *[other] { $colorName } មានកម្រិតផ្ទុយពណ៌មិនគ្រប់គ្រាន់សម្រាប់អក្សរចំណងជើងផ្នែក ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ត្រូវការយ៉ាងតិច { $threshold }:1)។
    }

## `<circle>`

circle-through-points-non-numerical = មិនទាន់អនុវត្ត `<circle>` កាត់តាមចំណុច { $count } ក្នុងករណីដែលចំណុចគ្មានតម្លៃជាលេខទេ។

circle-too-many-through-points = មិនអាចគណនារង្វង់កាត់តាមចំណុចលើសពី 3 បានទេ។

circle-overprescribed-radius-center-points = មិនអាចគណនារង្វង់ដែលកំណត់ទាំងកាំ ផ្ចិត និងចំណុចកាត់បានទេ។

circle-center-with-multiple-points = មិនអាចគណនារង្វង់ដែលកំណត់ផ្ចិត ហើយកាត់តាមចំណុចលើសពី 1 បានទេ។

circle-radius-too-small = មិនអាចគណនារង្វង់បានទេ៖ ដោយចម្ងាយរវាងចំណុចទាំងពីរគឺ { $distance } កាំ { $radius } ដែលបានកំណត់តូចពេក។

circle-radius-with-many-points = មិនអាចបង្កើតរង្វង់កាត់តាមចំណុចលើសពីពីរ ដោយកំណត់កាំបានទេ។

circle-invalid-center-or-through-points = ផ្ចិត ឬចំណុចកាត់នៃរង្វង់មិនត្រឹមត្រូវ។

circle-radius-center-with-multiple-points = មិនអាចគណនាកាំនៃរង្វង់ដែលកំណត់ផ្ចិត ហើយកាត់តាមចំណុចលើសពី 1 បានទេ។

circle-change-radius-non-numerical = មិនអាចប្ដូរកាំនៃរង្វង់ដែលមានចំណុចកាត់មិនមែនជាលេខបានទេ

circle-radius-with-points-non-numerical = មិនអាចបង្កើតរង្វង់កាត់តាមចំណុចលើសពីមួយ ដោយកំណត់កាំ នៅពេលគ្មានតម្លៃជាលេខបានទេ។

circle-change-center-non-numerical = មិនទាន់អនុវត្តការប្ដូរផ្ចិតនៃរង្វង់ដែលកាត់តាមចំណុចមិនមែនជាលេខទេ។

## `<function>`

function-domain-insufficient-dimensions = វិមាត្រនៃដែនកំណត់សម្រាប់អនុគមន៍មិនគ្រប់គ្រាន់។ ដែនកំណត់មានចន្លោះ { $intervals } ប៉ុន្តែអនុគមន៍មានធាតុចូល { $inputs }។

function-domain-invalid-format = ទម្រង់ដែនកំណត់សម្រាប់អនុគមន៍មិនត្រឹមត្រូវ។

function-ignoring-non-numerical =
    { $type ->
        [maximum] មិនអើពើតម្លៃអតិបរមាមិនមែនជាលេខនៃអនុគមន៍។
        [minimum] មិនអើពើតម្លៃអប្បបរមាមិនមែនជាលេខនៃអនុគមន៍។
        [extremum] មិនអើពើតម្លៃចុងមិនមែនជាលេខនៃអនុគមន៍។
        [point] មិនអើពើចំណុចមិនមែនជាលេខនៃអនុគមន៍។
        [slope] មិនអើពើមេគុណប្រាប់ទិសមិនមែនជាលេខនៃអនុគមន៍។
       *[other] មិនអើពើ { $type } មិនមែនជាលេខនៃអនុគមន៍។
    }

function-ignoring-empty =
    { $type ->
        [maximum] មិនអើពើតម្លៃអតិបរមាទទេនៃអនុគមន៍។
        [minimum] មិនអើពើតម្លៃអប្បបរមាទទេនៃអនុគមន៍។
        [extremum] មិនអើពើតម្លៃចុងទទេនៃអនុគមន៍។
        [point] មិនអើពើចំណុចទទេនៃអនុគមន៍។
       *[other] មិនអើពើ { $type } ទទេនៃអនុគមន៍។
    }

function-points-too-close = អនុគមន៍មានចំណុចពីរដែលនៅជិតគ្នាពេក។ មិនអាចកំណត់អនុគមន៍បានទេ។

function-iterates-input-output-mismatch = ការធ្វើឡើងវិញនៃអនុគមន៍អាចធ្វើបានតែពេលចំនួនធាតុចូលស្មើនឹងចំនួនធាតុចេញ។ អនុគមន៍នេះមានធាតុចូល { $inputs } និងធាតុចេញ { $outputs }។

## `<sequence>`

sequence-invalid-length = ប្រវែងលំដាប់មិនត្រឹមត្រូវ។ ត្រូវតែជាចំនួនគត់មិនអវិជ្ជមាន។

sequence-invalid-step = ជំហានលំដាប់មិនត្រឹមត្រូវ។ ត្រូវតែជាចំនួនសម្រាប់លំដាប់ប្រភេទ { $type }។

sequence-invalid-endpoint-number = "{ $attribute }" នៃលំដាប់លេខមិនត្រឹមត្រូវ។ ត្រូវតែជាចំនួន។

sequence-invalid-endpoint-letters = "{ $attribute }" នៃលំដាប់អក្សរមិនត្រឹមត្រូវ។ ត្រូវតែជាបន្សំអក្សរ។

sequence-invalid-endpoint = "{ $attribute }" នៃលំដាប់មិនត្រឹមត្រូវ។

select-from-sequence-coprime-not-numbers = coprime ត្រូវបានមិនអើពើ ព្រោះមិនកំពុងជ្រើសរើសលេខ

select-from-sequence-coprime-with-exclude-combinations = coprime ត្រូវបានមិនអើពើ ព្រោះបានកំណត់ excludeCombinations

## Resolving a `target`

target-not-found = target មិនត្រឹមត្រូវសម្រាប់ `<{ $source }>`៖ រកមិនឃើញ target។

target-state-variable-not-found = target មិនត្រឹមត្រូវសម្រាប់ `<{ $source }>`៖ រកមិនឃើញអថេរស្ថានភាពឈ្មោះ "{ $property }" លើ `<{ $component }>`។

## `<odeSystem>`

ode-system-variables-match-independent = អថេរនៃ `<odeSystem>` ត្រូវតែខុសពីអថេរឯករាជ្យ។

ode-system-duplicate-variable-names = មិនអាចកំណត់អនុគមន៍ខាងស្ដាំនៃ ODE ដែលមានឈ្មោះអថេរអាស្រ័យស្ទួនគ្នាបានទេ។

ode-system-rhs-function-error = មិនអាចកំណត់អនុគមន៍ខាងស្ដាំនៃ ODE បានទេ។ មានកំហុសពេលបង្កើតអនុគមន៍ mathjs។

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = មិនអាចកំណត់មុំរវាងបន្ទាត់ { $count } បានទេ

angle-invalid-through-point = ចំណុចក្នុង through នៃ `<angle>` មិនត្រឹមត្រូវ

parabola-vertex-too-many-points = មិនទាន់អនុវត្តប៉ារ៉ាបូលដែលមានកំពូល ហើយកាត់តាមចំណុចលើសពី 1 ទេ។

parabola-too-many-points = មិនទាន់អនុវត្តប៉ារ៉ាបូលកាត់តាមចំណុចលើសពី 3 ទេ។

intersection-too-many-items = មិនទាន់អនុវត្តប្រសព្វសម្រាប់ធាតុលើសពីពីរទេ

## Other math components

ionic-compound-not-two-ions = មិនទាន់អនុវត្តសមាសធាតុអ៊ីយ៉ុងសម្រាប់អ្វីក្រៅពីអ៊ីយ៉ុងពីរទេ។

ionic-compound-needs-cation-and-anion = សមាសធាតុអ៊ីយ៉ុងអនុវត្តបានតែសម្រាប់កាទីយ៉ុងមួយ និងអានីយ៉ុងមួយប៉ុណ្ណោះ។

solve-equations-cannot-evaluate = មិនអាចដោះស្រាយសមីការបានទេ ព្រោះមិនអាចគណនាសមីការ៖ { $equation }

math-operators-operand-number-required = ត្រូវកំណត់ operandNumber ពេលដកយកអង្គប្រមាណវិធីគណិតវិទ្យា។

eigen-decomposition-failed = មិនអាចគណនាតម្លៃលក្ខណៈនៃម៉ាទ្រីសបានទេ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`៖ ប៉ារ៉ាម៉ែត្រ { $parameters } មិនមានក្នុងលំនាំទេ ដូច្នេះវានឹងផ្គូផ្គងនឹងកន្លែងទទេជានិច្ច។

## `<graph>`

graph-grid-invalid = `<graph>`៖ មិនអាចបកស្រាយ grid="{ $grid }" បានទេ។ វាត្រូវតែជា none, medium, dense ឬចំនួនវិជ្ជមានពីរខណ្ឌដោយដកឃ្លា ដូចជា grid="1 0.5"។ នឹងមិនគូសក្រឡាចត្រង្គទេ។

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`៖ xLabelPosition="left" មិនត្រូវបានគាំទ្រក្នុងកម្មវិធីបង្ហាញ prefigure ទេ។ នឹងប្រើឥរិយាបថនៃទីតាំងខាងស្ដាំ។

prefigure-y-label-position-unsupported = `<graph>`៖ yLabelPosition="bottom" មិនត្រូវបានគាំទ្រក្នុងកម្មវិធីបង្ហាញ prefigure ទេ។ នឹងប្រើឥរិយាបថនៃទីតាំងខាងលើ។

prefigure-invalid-axis-bounds = `<graph>`៖ ព្រំដែនអ័ក្សមិនត្រឹមត្រូវសម្រាប់ការបំប្លែងទៅ prefigure។ នឹងប្រើ bbox លំនាំដើម (-10,-10,10,10)។

prefigure-invalid-width = `<graph>`៖ ទទឹងមិនត្រឹមត្រូវសម្រាប់ការបំប្លែងទៅ prefigure។ នឹងប្រើទទឹងដ្យាក្រាមលំនាំដើម 425។

prefigure-invalid-aspect-ratio = `<graph>`៖ aspectRatio មិនត្រឹមត្រូវសម្រាប់ការបំប្លែងទៅ prefigure។ នឹងប្រើផលធៀបរូបរាងលំនាំដើម 1។

prefigure-grid-spacing-too-fine = `<graph>`៖ គម្លាតក្រឡាចត្រង្គល្អិតពេកសម្រាប់ព្រំដែនអ័ក្ស។ ក្រឡាចត្រង្គត្រូវបានលុបចោលក្នុងកម្មវិធីបង្ហាញ prefigure។

prefigure-annotations-not-rendered = `<graph>`៖ ចំណារពន្យល់នឹងមិនត្រូវបានបង្ហាញទេ ពេលមិនប្រើកម្មវិធីបង្ហាញ PreFigure។

multiple-annotations-children = រកឃើញកូន `<annotations>` ច្រើនក្នុង `<graph>`។ ទាំងអស់លើកលែងតែចុងក្រោយត្រូវបានមិនអើពើ។

## Referring to other components

copy-unrecognized-component-type = មិនអាចពង្រីក ឬចម្លងប្រភេទសមាសភាគដែលមិនស្គាល់៖ { $type }។

copy-prop-not-found = រកមិនឃើញ prop { $property } លើសមាសភាគប្រភេទ { $component }

collect-no-source = រកមិនឃើញប្រភពសម្រាប់ collect។

collect-invalid-component-type = មិនអាចប្រមូលសមាសភាគប្រភេទ `<{ $component }>` បានទេ ព្រោះវាជាប្រភេទសមាសភាគមិនត្រឹមត្រូវ។

reference-index-unavailable = មិនអាចយោង index `{ $reference }` បានទេ

## `<callAction>`

component-action-unavailable = មិនអាចហៅ { $action } លើសមាសភាគ `{ $reference }` បានទេ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ទិន្នន័យមានរូបរាងមិនត្រឹមត្រូវ។ ជួរដេកមានប្រវែងមិនស្មើគ្នា។ រកឃើញនៅ componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = ទិន្នន័យមានឈ្មោះជួរឈរស្ទួនគ្នា។ រកឃើញនៅ componentIdx :{ $componentIdx }

data-frame-missing-column-name = ទិន្នន័យខ្វះឈ្មោះជួរឈរ។ រកឃើញនៅ componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award សម្រាប់ចម្លើយនេះផ្អែកលើចម្លើយដែល answer ខ្លួនឯងបានដាក់ស្នើ ដែលនឹងនាំឱ្យមានឥរិយាបថមិនរំពឹងទុក។

answer-max-num-attempts-in-section-wide-check-work = ការកំណត់ `maxNumAttempts` លើ `<answer>` ក្នុងធាតុផ្ទុកដែលមាន `sectionWideCheckWork` គ្មានឥទ្ធិពលទេ ព្រោះចំនួនឱកាសត្រូវបានគ្រប់គ្រងដោយធាតុផ្ទុកនោះ។ សូមកំណត់ `maxNumAttempts` លើធាតុផ្ទុកវិញ។

nested-section-wide-check-work-max-num-attempts = ការកំណត់ `maxNumAttempts` លើធាតុផ្ទុកដែលមាន `sectionWideCheckWork` ហើយស្ថិតក្នុងធាតុផ្ទុកមួយទៀតដែលមាន `sectionWideCheckWork` គ្មានឥទ្ធិពលទេ ព្រោះចំនួនឱកាសត្រូវបានគ្រប់គ្រងដោយធាតុផ្ទុកខាងក្រៅ។ សូមកំណត់ `maxNumAttempts` លើធាតុផ្ទុកខាងក្រៅវិញ។

answer-attributes-need-symbolic-equality = អាត្រីប្យូត { $attributes } នឹងគ្មានឥទ្ធិពលទេ បើគ្មាន symbolicEquality។

answer-invalid-type = ប្រភេទមិនត្រឹមត្រូវសម្រាប់ answer៖ { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = ដោយសមាសភាគ `<{ $component }>` គ្មានឈ្មោះ វាមិនអាចប្រើជាអាត្រីប្យូតរបស់ module បានទេ

module-attribute-name-already-defined = សមាសភាគ `<{ $component } name="{ $name }">` មិនអាចប្រើជាអាត្រីប្យូតរបស់ module បានទេ ព្រោះប្រភេទសមាសភាគ `<module>` មានអាត្រីប្យូត "{ $name }" រួចហើយ។

conditional-content-condition-ignored = អាត្រីប្យូត `condition` ត្រូវបានមិនអើពើលើសមាសភាគ `<conditionalContent>` ដែលមានកូន case ឬ else។

slider-markers-type-mismatch = ប្រភេទសញ្ញាសម្គាល់មិនត្រូវនឹងប្រភេទ slider។

pretzel-problem-needs-statement-and-answer = pretzel មិនត្រឹមត្រូវ៖ `<problem>` នីមួយៗត្រូវតែមាន `<statement>` មួយ និង `<answer>` មួយ។

pretzel-circuit-first-problem-distractor = pretzel មិនត្រឹមត្រូវ៖ ក្នុង mode="circuit" `<problem>` ដំបូងមិនអាចជា distractor បានទេ។

## Attribute values

attribute-invalid-values = តម្លៃ { $values } មិនត្រឹមត្រូវសម្រាប់អាត្រីប្យូត `{ $attribute }`។ នឹងមិនអើពើ។

attribute-must-be-references = តម្លៃ `{ $value }` មិនត្រឹមត្រូវសម្រាប់អាត្រីប្យូត `{ $attribute }`។ អាត្រីប្យូតត្រូវតែផ្សំឡើងពីការយោងដែលចាប់ផ្ដើមដោយ `$`។

math-input-invalid-function-names = <mathInput>៖ បានមិនអើពើឈ្មោះអនុគមន៍មិនត្រឹមត្រូវក្នុង { $attribute }៖ { $names }។ ផ្នែកបង្ហាញនៃឈ្មោះនីមួយៗត្រូវមានយ៉ាងតិច 2 តួអក្សរ (អក្សរ ឬសហសញ្ញា) ហើយអាចមានផ្នែកបន្ថែម `|<mathspeak alternative>` នៅខាងក្រោយ។

## Building components from the source

component-type-invalid = ប្រភេទសមាសភាគមិនត្រឹមត្រូវ៖ `<{ $componentType }>`

attribute-repeated = មិនអាចដាក់អាត្រីប្យូត { $attribute } ស្ទួនបានទេ។

attribute-invalid-for-component = អាត្រីប្យូត "{ $attribute }" មិនត្រឹមត្រូវសម្រាប់សមាសភាគប្រភេទ `<{ $componentType }>`។

## Style definition contrast

style-definition-insufficient-contrast =
    និយមន័យរចនាបថ { $styleNumber } មានកម្រិតផ្ទុយពណ៌មិនគ្រប់គ្រាន់សម្រាប់{ $context ->
        [text-on-background] ពណ៌អក្សរធៀបនឹងពណ៌ផ្ទៃខាងក្រោយ
        [high-contrast] ពណ៌ដែលមានកម្រិតផ្ទុយខ្ពស់ធៀបនឹងផ្ទាំង
        [line] ពណ៌បន្ទាត់ធៀបនឹងផ្ទាំង
        [marker] ពណ៌សញ្ញាសម្គាល់ធៀបនឹងផ្ទាំង
       *[text-on-canvas] ពណ៌អក្សរធៀបនឹងផ្ទាំង
    }{ $mode ->
        [dark] { " (របៀបងងឹត)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ត្រូវការយ៉ាងតិច { $threshold }:1)។

style-definition-dark-mode-text-background-contrast =
    ទោះបីនិយមន័យរចនាបថ { $styleNumber } បានកំណត់ពណ៌ដែលមានកម្រិតផ្ទុយពណ៌គ្រប់គ្រាន់សម្រាប់របៀបភ្លឺក៏ដោយ ពណ៌សម្រាប់របៀបងងឹតដែលទាញចេញពីតម្លៃទាំងនោះមានកម្រិតផ្ទុយពណ៌មិនគ្រប់គ្រាន់សម្រាប់ពណ៌អក្សរធៀបនឹងពណ៌ផ្ទៃខាងក្រោយ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ត្រូវការយ៉ាងតិច { $threshold }:1)។ { $suggestion ->
        [available] ដើម្បីធានាកម្រិតផ្ទុយពណ៌គ្រប់គ្រាន់ក្នុងរបៀបងងឹត សូមបង្កើនកម្រិតផ្ទុយពណ៌ក្នុងរបៀបភ្លឺ (ឧ. កំណត់ { $lightAttribute }="{ $lightColor }") ឬជំនួសពណ៌របៀបងងឹត (ឧ. កំណត់ { $darkAttribute }="{ $darkColor }")។
       *[none] ដើម្បីធានាកម្រិតផ្ទុយពណ៌គ្រប់គ្រាន់ក្នុងរបៀបងងឹត សូមបង្កើនកម្រិតផ្ទុយពណ៌ក្នុងរបៀបភ្លឺ ឬជំនួសពណ៌ដែលទាញចេញដោយ textColorDarkMode និង/ឬ backgroundColorDarkMode។
    }

style-definition-dark-mode-text-canvas-contrast =
    ទោះបីនិយមន័យរចនាបថ { $styleNumber } បានកំណត់ពណ៌អក្សរដែលមានកម្រិតផ្ទុយពណ៌គ្រប់គ្រាន់សម្រាប់របៀបភ្លឺក៏ដោយ ពណ៌អក្សរសម្រាប់របៀបងងឹតដែលទាញចេញពីតម្លៃនោះមានកម្រិតផ្ទុយពណ៌មិនគ្រប់គ្រាន់ធៀបនឹងផ្ទាំង ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ត្រូវការយ៉ាងតិច { $threshold }:1)។ { $suggestion ->
        [available] ដើម្បីធានាកម្រិតផ្ទុយពណ៌គ្រប់គ្រាន់ក្នុងរបៀបងងឹត សូមបង្កើនកម្រិតផ្ទុយពណ៌ក្នុងរបៀបភ្លឺ (ឧ. កំណត់ textColor="{ $lightColor }") ឬជំនួសពណ៌របៀបងងឹត (ឧ. កំណត់ textColorDarkMode="{ $darkColor }")។
       *[none] ដើម្បីធានាកម្រិតផ្ទុយពណ៌គ្រប់គ្រាន់ក្នុងរបៀបងងឹត សូមបង្កើនកម្រិតផ្ទុយពណ៌ក្នុងរបៀបភ្លឺ ឬជំនួសពណ៌ដែលទាញចេញដោយ textColorDarkMode។
    }

section-multiple-style-palettes = ផ្នែកមួយអាចជ្រើសរើស <stylePalette> តែមួយប៉ុណ្ណោះ។ នឹងប្រើមួយចុងក្រោយ។

## Unique variants

variant-num-to-select-not-non-negative-integer = មិនអាចកំណត់ variant តែមួយគត់នៃ { $component } បានទេ ព្រោះ numToSelect មិនមែនជាចំនួនគត់មិនអវិជ្ជមាន។

variant-num-to-select-not-constant-number = មិនអាចកំណត់ variant តែមួយគត់នៃ { $component } បានទេ ព្រោះ numToSelect មិនមែនជាចំនួនថេរ។

variant-with-replacement-not-constant-boolean = មិនអាចកំណត់ variant តែមួយគត់នៃ { $component } បានទេ ព្រោះ withReplacement មិនមែនជា boolean ថេរ។

variant-select-weight-disables-unique = variant តែមួយគត់សម្រាប់ select ត្រូវបានបិទ បើមាន option ណាមួយកំណត់ selectWeight ឬ selectForVariants

variant-coprime-undetermined = មិនអាចកំណត់ variant តែមួយគត់នៃ { $component } បានទេ ព្រោះមិនអាចកំណត់ថា coprime ជាមិនពិតជានិច្ច។

variant-attribute-not-constant = មិនអាចកំណត់ variant តែមួយគត់នៃ { $component } បានទេ ព្រោះ { $attribute } មិនមែនជាតម្លៃថេរ។

variant-attribute-not-number = មិនអាចកំណត់ variant តែមួយគត់នៃ { $component } បានទេ ព្រោះ { $attribute } មិនមែនជាចំនួន។

variant-attribute-wrong-type-for-sequence =
    មិនអាចកំណត់ variant តែមួយគត់នៃ { $component } ប្រភេទ { $type } បានទេ ព្រោះ { $attribute } មិនមែនជា{ $expected ->
        [letters-combination] បន្សំអក្សរ
        [math-expression] កន្សោមគណិតវិទ្យាត្រឹមត្រូវ
        [integer] ចំនួនគត់
       *[number] ចំនួន
    }។

variant-length-not-integer = មិនអាចកំណត់ variant តែមួយគត់នៃ { $component } បានទេ ព្រោះ length មិនមែនជាចំនួនគត់។

variant-sort-not-implemented = មិនទាន់អនុវត្ត variant តែមួយគត់នៃ { $component } ដែលមាន sort ទេ

variant-exclude-combinations-not-implemented = មិនទាន់អនុវត្ត variant តែមួយគត់នៃ { $component } ដែលមាន excludeCombinations ទេ

variant-math-exclude-not-implemented = មិនទាន់អនុវត្ត variant តែមួយគត់នៃ { $component } ប្រភេទ math ដែលមាន exclude ទេ

variant-non-constant-exclude-not-implemented = មិនទាន់អនុវត្ត variant តែមួយគត់នៃ { $component } ដែលមាន exclude មិនថេរទេ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }៖ មិនត្រូវបានគាំទ្រក្នុងកម្មវិធីបង្ហាញ prefigure នៃក្រាបទេ។ ធាតុកូនត្រូវបានរំលង។

prefigure-descendant-invalid-geometry = { $subject }៖ ធរណីមាត្រមិនកំណត់ ឬមិនពេញលេញ។ ធាតុកូនត្រូវបានរំលង។

prefigure-curve-label-omitted = { $subject }៖ ស្លាកមិនត្រូវបានគាំទ្រលើធាតុខ្សែកោងដែលបានបំប្លែងទេ។ ស្លាកត្រូវបានលុបចោល។

prefigure-curve-unsupported-definition-type = { $subject }៖ ប្រភេទនិយមន័យអនុគមន៍ខ្សែកោង '{ $definitionType }' មិនត្រូវបានគាំទ្រទេ។ ធាតុកូនត្រូវបានរំលង។

prefigure-region-flip-functions-unsupported = { $subject }៖ អាត្រីប្យូត flipFunctions លើ regionBetweenCurves មិនត្រូវបានគាំទ្រទេ។ ធាតុកូនត្រូវបានរំលង។

prefigure-region-non-formula-child = { $subject }៖ មានតែអនុគមន៍កូនប្រភេទរូបមន្តទេដែលត្រូវបានគាំទ្រលើ regionBetweenCurves។ ធាតុកូនត្រូវបានរំលង។

prefigure-label-position-unsupported =
    { $subject }៖ labelPosition '{ $labelPosition }' មិនត្រូវបានគាំទ្រសម្រាប់{ $labelKind ->
        [line-family] ស្លាកនៃត្រកូលបន្ទាត់
       *[point] ស្លាកចំណុច
    }ទេ។ នឹងប្រើការតម្រឹមលំនាំដើមរបស់ PreFigure។

prefigure-fill-style-unsupported = { $subject }៖ រចនាបថបំពេញ '{ $fillStyle }' មិនត្រូវបានគាំទ្រដោយ PreFigure ទេ។ នឹងប្រើការបំពេញពេញលេញជំនួស។

prefigure-line-style-unknown = { $subject }៖ រចនាបថបន្ទាត់ '{ $lineStyle }' មិនស្គាល់ ត្រូវបានលុបចេញពីលទ្ធផល PreFigure។

prefigure-marker-style-mapped-to-diamond = { $subject }៖ រចនាបថសញ្ញាសម្គាល់ '{ $markerStyle }' ត្រូវបានប្ដូរទៅរចនាបថ 'diamond' របស់ PreFigure។

prefigure-marker-style-unsupported = { $subject }៖ រចនាបថសញ្ញាសម្គាល់ '{ $markerStyle }' មិនត្រូវបានគាំទ្រដោយ PreFigure ទេ។ នឹងប្រើរចនាបថលំនាំដើម។

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`៖ `ref` មិនត្រឹមត្រូវ។ មិនអាចរកគោលដៅបានទេ។ ចំណារពន្យល់ត្រូវបានលុបចោល។

annotation-ref-multiple-targets = `<annotation>`៖ `ref` សំដៅទៅគោលដៅច្រើន។ នឹងប្រើគោលដៅទីមួយ។

annotation-ref-outside-graph = `<annotation>`៖ `ref` មិនត្រឹមត្រូវ។ គោលដៅនៅក្រៅក្រាបដែលរុំព័ទ្ធ។ ចំណារពន្យល់ត្រូវបានលុបចោល។

annotation-ref-unsupported-target = `<annotation>`៖ `ref` មិនត្រឹមត្រូវ។ គោលដៅមិនមែនជាវត្ថុក្រាហ្វិកដែលគាំទ្រក្នុងការបំប្លែងទៅ prefigure ទេ។ ចំណារពន្យល់ត្រូវបានលុបចោល។

annotation-text-missing = `<annotation>`៖ `text` បាត់ ឬទទេ។ នឹងបញ្ចេញអត្ថបទទទេ។

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] រកឃើញភាពអាស្រ័យជារង្វង់។
       *[other] រកឃើញភាពអាស្រ័យជារង្វង់ដែលពាក់ព័ន្ធនឹងសមាសភាគ `<{ $componentType }>`។
    }

reference-no-referent = រកមិនឃើញអ្វីដែលការយោងសំដៅទៅ៖ `{ $reference }`

reference-multiple-referents = រកឃើញអ្វីច្រើនដែលការយោងសំដៅទៅ៖ `{ $reference }`

## Children that do not match

children-invalid-attribute-format = ទម្រង់អាត្រីប្យូត { $attribute } នៃ `<{ $componentType }>` មិនត្រឹមត្រូវ។

children-invalid = កូនមិនត្រឹមត្រូវសម្រាប់ `<{ $componentType }>`៖ រកឃើញកូនមិនត្រឹមត្រូវ៖ { $children }

## Falling back to a default

attribute-value-invalid-using-default = តម្លៃ `{ $value }` មិនត្រឹមត្រូវសម្រាប់អាត្រីប្យូត `{ $attribute }` នឹងប្រើតម្លៃ `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] រកមិនឃើញ DoenetML កំណែ { $version }។
       *[other] រកមិនឃើញ DoenetML កំណែ { $version }។ នឹងប្រើកំណែ { $fallback } ជំនួស
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML មិនត្រឹមត្រូវ៖ { $content }

parse-tag-missing-close-tag = DoenetML មិនត្រឹមត្រូវ៖ ស្លាក `{ $tag }` គ្មានស្លាកបិទទេ។ ត្រូវការស្លាកបិទដោយខ្លួនឯង ឬស្លាក `</{ $tagName }>`។

parse-tag-error = DoenetML មិនត្រឹមត្រូវ៖ មានកំហុសក្នុងស្លាក `<{ $tagName }>`

parse-attribute-missing-value = DoenetML មិនត្រឹមត្រូវ៖ អាត្រីប្យូត `{ $attribute }` មិនត្រឹមត្រូវ ហាក់ដូចជាខ្វះតម្លៃ។

parse-attribute-invalid = DoenetML មិនត្រឹមត្រូវ៖ អាត្រីប្យូត `{ $attribute }` មិនត្រឹមត្រូវ

parse-attribute-value-invalid = DoenetML មិនត្រឹមត្រូវ៖ តម្លៃអាត្រីប្យូត `{ $value }` មិនត្រឹមត្រូវ

parse-attribute-value-quote-mismatch = DoenetML មិនត្រឹមត្រូវ៖ តម្លៃអាត្រីប្យូត `{ $value }` មិនត្រឹមត្រូវ។ សញ្ញាសម្រង់មិនត្រូវគ្នា។ ហាក់ដូចជាខ្វះ `{ $quote }`

parse-open-tag-name-missing = DoenetML មិនត្រឹមត្រូវ៖ រកឃើញស្លាកគ្មានឈ្មោះ ឧ. `<`

parse-tag-not-closed = DoenetML មិនត្រឹមត្រូវ៖ ស្លាក `{ $tag }` មិនត្រូវបានបិទ (ហាក់ដូចជាខ្វះ `>`)។

parse-self-closing-tag-name-missing = DoenetML មិនត្រឹមត្រូវ៖ រកឃើញស្លាកគ្មានឈ្មោះ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML មិនត្រឹមត្រូវ៖ ស្លាក `{ $tag }` មិនត្រូវបានបិទ (ហាក់ដូចជាខ្វះ `/>`)។

parse-tag-invalid-attributes = DoenetML មិនត្រឹមត្រូវ៖ ស្លាក `{ $tag }` មិនត្រឹមត្រូវ។ វាអាចមានអាត្រីប្យូតខុស។

parse-close-tag-name-missing = DoenetML មិនត្រឹមត្រូវ៖ រកឃើញស្លាកបិទគ្មានឈ្មោះ ឧ. `</`

parse-attribute-value-unquoted = តម្លៃអាត្រីប្យូតត្រូវតែដាក់ក្នុងសញ្ញាសម្រង់៖ `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML មិនត្រឹមត្រូវ៖ រកឃើញស្លាកបិទ `{ $tag }` ប៉ុន្តែគ្មានស្លាកបើកត្រូវគ្នា

parse-close-tag-mismatched = DoenetML មិនត្រឹមត្រូវ៖ ស្លាកបិទមិនត្រូវគ្នា។ ត្រូវការ `</{ $expected }>` តែរកឃើញ `{ $found }`

parser-node-unconvertible = មិនអាចបំប្លែងថ្នាំង { $node } ទៅជាថ្នាំង Dast បានទេ។

## Names

name-attribute-invalid =
    អាត្រីប្យូត name='{ $name }' មិនត្រឹមត្រូវ។ { $reason ->
        [characters] ឈ្មោះអាចមានតែអក្សរ លេខ សញ្ញាគូសក្រោម ឬសហសញ្ញាប៉ុណ្ណោះ។
       *[start] ឈ្មោះត្រូវតែចាប់ផ្ដើមដោយអក្សរ។
    }

component-name-invalid-start = ឈ្មោះសមាសភាគ "{ $name }" មិនត្រឹមត្រូវ។ ឈ្មោះត្រូវតែចាប់ផ្ដើមដោយអក្សរ។

## `<answer>` sugar

answer-video-watched-missing-video = answer ប្រភេទ videoWatched ត្រូវតែមានអាត្រីប្យូត video

answer-video-watched-video-not-reference = answer ប្រភេទ videoWatched ត្រូវតែមានអាត្រីប្យូត video ដែលជាការយោង

answer-name-not-single-text = អាត្រីប្យូត name នៃ answer ត្រូវតែមានកូនជាអក្សរតែមួយ

## Referencing another document

external-doenetml-recursion-limit = មិនអាចទាញ DoenetML ខាងក្រៅបានទេ ព្រោះមានកម្រិតហៅខ្លួនឯងច្រើនពេក។ តើមានការយោងជារង្វង់ឬ?

external-doenetml-unavailable = មិនអាចទាញ DoenetML ពី { $attribute }="{ $uri }" បានទេ

external-doenetml-type-mismatch = DoenetML ដែលទាញពី { $attribute }="{ $uri }" មិនត្រឹមត្រូវ៖ វាមិនត្រូវនឹងប្រភេទសមាសភាគ "{ $componentType }" ទេ

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] អាត្រីប្យូត `{ $from }` លែងប្រើហើយ។ សូមប្រើ `{ $to }` ជំនួស។
       *[other] [deprecation] អាត្រីប្យូត `{ $from }` លើ `<{ $component }>` លែងប្រើហើយ។ សូមប្រើ `{ $to }` ជំនួស។
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] អាត្រីប្យូត `{ $from }` លែងប្រើហើយ ហើយត្រូវបានមិនអើពើ ព្រោះបានកំណត់ `{ $to }` ផងដែរ។
       *[other] [deprecation] អាត្រីប្យូត `{ $from }` លើ `<{ $component }>` លែងប្រើហើយ ហើយត្រូវបានមិនអើពើ ព្រោះបានកំណត់ `{ $to }` ផងដែរ។
    }

deprecated-attribute-ignored = [deprecation] អាត្រីប្យូត `{ $attribute }` លើ `<{ $component }>` លែងប្រើហើយ ហើយត្រូវបានមិនអើពើ។


## Language coverage

pluralize-english-only = `<pluralize>` អាចប្ដូរទៅពហុវចនៈបានតែសម្រាប់ភាសាអង់គ្លេសប៉ុណ្ណោះ ដូច្នេះអត្ថបទរបស់វាមិនត្រូវបានប្ដូរទេ ក្នុងឯកសារដែលសរសេរជា { $locale }។ សូមសរសេរទម្រង់ពហុវចនៈដោយផ្ទាល់ ឬកំណត់វាដោយអាត្រីប្យូត `pluralForm`។


## Checking against the schema

schema-element-unrecognized = ធាតុ `<{ $tag }>` មិនមែនជាធាតុ Doenet ដែលស្គាល់ទេ។

schema-element-not-allowed-at-root = ធាតុ `<{ $tag }>` មិនត្រូវបានអនុញ្ញាតនៅឫសនៃឯកសារទេ។

schema-element-not-allowed-inside = ធាតុ `<{ $tag }>` មិនត្រូវបានអនុញ្ញាតនៅខាងក្នុង `<{ $parent }>` ទេ។

schema-attribute-unrecognized = ធាតុ `<{ $tag }>` គ្មានអាត្រីប្យូតឈ្មោះ `{ $attribute }` ទេ។

schema-attribute-value-not-allowed =
    { $isList ->
        [true] អាត្រីប្យូត `{ $attribute }` នៃធាតុ `<{ $tag }>` ត្រូវតែជាបញ្ជីដែលធាតុនីមួយៗជាមួយក្នុងចំណោម៖ { $allowed }
       *[other] អាត្រីប្យូត `{ $attribute }` នៃធាតុ `<{ $tag }>` ត្រូវតែជាមួយក្នុងចំណោម៖ { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = ឈ្មោះ variant មិនត្រឹមត្រូវសម្រាប់ select។ ឈ្មោះ variant { $variantName } មានក្នុង { $numOptions } option ប៉ុន្តែចំនួនត្រូវជ្រើសរើសគឺ { $numToSelect }។

select-variant-name-without-options = មាន variant ខ្លះត្រូវបានកំណត់សម្រាប់ select ប៉ុន្តែគ្មាន option សម្រាប់ឈ្មោះ variant ដែលអាចមាន៖ { $variantName }។

select-variant-name-not-possible = ឈ្មោះ variant { $variantName } ដែលបានកំណត់សម្រាប់ select មិនមែនជាឈ្មោះ variant ដែលអាចមានទេ។

select-too-few-options = មិនអាចជ្រើសរើស { $numToSelect } សមាសភាគ ពីត្រឹមតែ { $numOptions } បានទេ។

select-from-sequence-too-few-values = មិនអាចជ្រើសរើស { $numToSelect } តម្លៃ ពីលំដាប់ប្រវែង { $length } បានទេ។

select-from-sequence-indices-count-mismatch = ចំនួន indices ដែលកំណត់សម្រាប់ select ត្រូវតែស្មើនឹងចំនួនត្រូវជ្រើសរើស

select-from-sequence-indices-not-integers = indices ទាំងអស់ដែលកំណត់សម្រាប់ select ត្រូវតែជាចំនួនគត់

select-from-sequence-index-excluded = index ដែលកំណត់សម្រាប់ selectfromsequence ត្រូវបានដកចេញ

select-from-sequence-indices-excluded-combination = indices ដែលកំណត់សម្រាប់ selectfromsequence ជាបន្សំដែលត្រូវបានដកចេញ

select-from-sequence-coprime-not-positive-integers = មិនអាចជ្រើសរើសបន្សំបឋមទៅវិញទៅមកបានទេ ព្រោះមិនកំពុងជ្រើសរើសចំនួនគត់វិជ្ជមាន។

select-from-sequence-coprime-common-factor = មិនអាចជ្រើសរើសលេខបឋមទៅវិញទៅមកបានទេ។ តម្លៃដែលអាចមានទាំងអស់មានកត្តារួម។ (តម្លៃ "from" ឬ "to" ដែលកំណត់ត្រូវតែបឋមទៅវិញទៅមកនឹង "step"។)

select-from-sequence-coprime-single-number = មិនអាចជ្រើសរើសបន្សំបឋមទៅវិញទៅមកពីលេខតែមួយដែលមិនមែនជា 1 បានទេ។

select-from-sequence-excluded-too-many-combinations = បានដកចេញលើសពី 70% នៃបន្សំក្នុង selectFromSequence

select-from-sequence-coprime-none-found = មិនអាចជ្រើសរើសលេខបឋមទៅវិញទៅមកបានទេ។ តម្លៃដែលអាចមានទាំងអស់មានកត្តារួម។

select-from-sequence-too-few-unique-values = មិនអាចជ្រើសរើស { $numToSelect } តម្លៃខុសៗគ្នា ពីលំដាប់ប្រវែង { $numPossibleValues } បានទេ

select-prime-numbers-too-few-values = មិនអាចជ្រើសរើស { $numToSelect } តម្លៃ ពីបញ្ជីលេខបឋមប្រវែង { $numValues } បានទេ

select-prime-numbers-values-count-mismatch = ចំនួនតម្លៃដែលកំណត់សម្រាប់ select ត្រូវតែស្មើនឹងចំនួនត្រូវជ្រើសរើស

select-prime-numbers-values-not-prime = តម្លៃទាំងអស់ដែលកំណត់សម្រាប់ select លេខបឋម ត្រូវតែស្ថិតក្នុងបញ្ជីលេខបឋម

select-prime-numbers-values-excluded-combination = តម្លៃដែលកំណត់សម្រាប់ selectPrimeNumbers ជាបន្សំដែលត្រូវបានដកចេញ

select-prime-numbers-excluded-too-many-combinations = បានដកចេញលើសពី 70% នៃបន្សំក្នុង selectPrimeNumbers

select-random-combination-fluke = ដោយឧបទ្ទវហេតុដ៏កម្រ មិនអាចជ្រើសរើសបន្សំតម្លៃចៃដន្យបានទេ

select-random-value-fluke = ដោយឧបទ្ទវហេតុដ៏កម្រ មិនអាចជ្រើសរើសតម្លៃចៃដន្យបានទេ
