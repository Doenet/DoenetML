# Odia diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# A counted noun is usually left unmarked in Odia, so a select is written out
# only where the two branches genuinely differ.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = ଦୁଇଟି ପ୍ରାନ୍ତବିନ୍ଦୁ ଦିଆଯାଇଥିଲେ { $attributes } ଅଣଦେଖା କରାଯାଏ

line-segment-attributes-ignored-with-endpoint-and-midpoint = ଗୋଟିଏ ପ୍ରାନ୍ତବିନ୍ଦୁ ଓ ଗୋଟିଏ ମଧ୍ୟବିନ୍ଦୁ ଦୁହିଁକି ଦିଆଯାଇଥିଲେ { $attributes } ଅଣଦେଖା କରାଯାଏ

line-segment-midpoint-offset-without-midpoint = ମଧ୍ୟବିନ୍ଦୁ ବିନା midpointOffset ର କୌଣସି ପ୍ରଭାବ ନାହିଁ

## `<line>`

line-points-undetermined-dimensions = ଅନିର୍ଦ୍ଧାରିତ ପରିମାଣର ବିନ୍ଦୁ ମଧ୍ୟ ଦେଇ ଯାଉଥିବା ସରଳରେଖା।

line-points-too-few-dimensions = ସରଳରେଖା ଅନ୍ତତଃ ଦୁଇ ପରିମାଣର ବିନ୍ଦୁ ମଧ୍ୟ ଦେଇ ଯିବା ଉଚିତ।

line-points-depend-on-variables = ସରଳରେଖା ଚଳ ଉପରେ ନିର୍ଭରଶୀଳ ବିନ୍ଦୁ ମଧ୍ୟ ଦେଇ ଯାଉଛି: { $variables }।

line-equation-invalid-format = ଚଳ { $variable1 } ଓ { $variable2 } ରେ ସରଳରେଖାର ସମୀକରଣ ପାଇଁ ଅବୈଧ ରୂପ।

## `<ray>`

ray-overprescribed-through = ରଶ୍ମି through, endpoint ଓ direction ତିନୋଟିଙ୍କ ଦ୍ୱାରା ନିର୍ଦ୍ଦିଷ୍ଟ। ଦିଆଯାଇଥିବା through ଅଣଦେଖା କରାଯାଉଛି।

ray-dimension-mismatch = ରଶ୍ମିରେ numDimensions ମେଳ ଖାଉ ନାହିଁ।

## `<vector>`

vector-overprescribed-head = ଭେକ୍ଟର head, tail ଓ displacement ତିନୋଟିଙ୍କ ଦ୍ୱାରା ନିର୍ଦ୍ଦିଷ୍ଟ। ଦିଆଯାଇଥିବା head ଅଣଦେଖା କରାଯାଉଛି।

vector-dimension-mismatch = ଭେକ୍ଟରରେ numDimensions ମେଳ ଖାଉ ନାହିଁ।

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ପାଖରେ nearestPoint ସ୍ଥିତି ଚଳ ନଥିବାରୁ ସେଥିପ୍ରତି ଆକର୍ଷିତ କରାଯାଇପାରିବ ନାହିଁ।

constrain-to-without-nearest-point = `<{ $component }>` ପାଖରେ nearestPoint ସ୍ଥିତି ଚଳ ନଥିବାରୁ ସେଥିରେ ସୀମିତ କରାଯାଇପାରିବ ନାହିଁ।

constrain-to-interior-without-nearest-point = `<{ $component }>` ପାଖରେ nearestPoint ସ୍ଥିତି ଚଳ ନଥିବାରୁ ତାହାର ଭିତର ଭାଗରେ ସୀମିତ କରାଯାଇପାରିବ ନାହିଁ।

## `<choiceInput>`

choice-input-label-position-ignored = ଇନଲାଇନ ନଥିବା choiceInput ପାଇଁ labelPosition ଅଣଦେଖା କରାଯାଏ

## Ordering children by index

choice-input-indices-count-mismatch = ସୂଚକାଙ୍କ ସଂଖ୍ୟା choice ଶିଶୁ ଉପାଦାନର ସଂଖ୍ୟା ସହ ମେଳ ନଖାଇବାରୁ choiceInput ପାଇଁ ଦିଆଯାଇଥିବା ସୂଚକାଙ୍କ ଅଣଦେଖା କରାଯାଉଛି।

pretzel-indices-count-mismatch = ସୂଚକାଙ୍କ ସଂଖ୍ୟା problem ଶିଶୁ ଉପାଦାନର ସଂଖ୍ୟା ସହ ମେଳ ନଖାଇବାରୁ problem ପାଇଁ ଦିଆଯାଇଥିବା ସୂଚକାଙ୍କ ଅଣଦେଖା କରାଯାଉଛି।

shuffle-indices-count-mismatch = ସୂଚକାଙ୍କ ସଂଖ୍ୟା ଉପାଦାନର ସଂଖ୍ୟା ସହ ମେଳ ନଖାଇବାରୁ shuffle ପାଇଁ ଦିଆଯାଇଥିବା ସୂଚକାଙ୍କ ଅଣଦେଖା କରାଯାଉଛି।

indices-ignored-out-of-range = କେତେକ ସୂଚକାଙ୍କ ପରିସର ବାହାରେ ଥିବାରୁ { $component } ପାଇଁ ଦିଆଯାଇଥିବା ସୂଚକାଙ୍କ ଅଣଦେଖା କରାଯାଉଛି।

pretzel-indices-repeated = କେତେକ ସୂଚକାଙ୍କ ପୁନରାବୃତ୍ତି ହୋଇଥିବାରୁ pretzel ପାଇଁ ଦିଆଯାଇଥିବା ସୂଚକାଙ୍କ ଅଣଦେଖା କରାଯାଉଛି।

pretzel-circuit-first-index = circuit ଧାରାରେ ପ୍ରଥମ ସୂଚକାଙ୍କ 1 ହେବା ଆବଶ୍ୟକ, ତେଣୁ pretzel ପାଇଁ ଦିଆଯାଇଥିବା ସୂଚକାଙ୍କ ଅଣଦେଖା କରାଯାଉଛି।

## `<shuffle>` and `<sort>`

string-children-need-type = ଷ୍ଟ୍ରିଙ୍ଗ ଶିଶୁ ଉପାଦାନ ସହ `<{ $component }>` କାମ କରିବା ପାଇଁ `type` ଗୁଣ ଦେବା ଆବଶ୍ୟକ।

invalid-type-defaulting-to-math = { $component } ଉପାଦାନ ପାଇଁ { $type } ଏକ ଅବୈଧ type। ଏହା math, text, number କିମ୍ବା boolean ମଧ୍ୟରୁ ଗୋଟିଏ ହେବା ଉଚିତ। math ଭାବେ ସେଟ କରାଯାଉଛି।

string-not-valid-component-to-arrange = "{ $value }" ଷ୍ଟ୍ରିଙ୍ଗ { $component } କରିବା ପାଇଁ ଉପଯୁକ୍ତ ଉପାଦାନ ନୁହେଁ। ଅଣଦେଖା କରାଯାଉଛି।

## Types and variables

invalid-type-defaulting-to-number = { $type } ଏକ ଅବୈଧ type, type କୁ number ଭାବେ ସେଟ କରାଯାଉଛି।

invalid-variable-value = ଚଳର ଅବୈଧ ମୂଲ୍ୟ: `{ $value }`

## Variants

variant-index-must-be-number = ପ୍ରକାର ସୂଚକାଙ୍କ { $index } ଏକ ସଂଖ୍ୟା ହେବା ଆବଶ୍ୟକ

variant-index-must-be-integer = ପ୍ରକାର ସୂଚକାଙ୍କ { $index } ଏକ ପୂର୍ଣ୍ଣସଂଖ୍ୟା ହେବା ଆବଶ୍ୟକ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ନିରପେକ୍ଷ ମାପ ପାଇଁ ପ୍ରଚଳିତ ନାହିଁ। ଓସାର ଆପେକ୍ଷିକ ଭାବେ ସେଟ କରାଯାଉଛି।

side-by-side-absolute-margins = `<{ $component }>` ନିରପେକ୍ଷ ମାପ ପାଇଁ ପ୍ରଚଳିତ ନାହିଁ। ମାର୍ଜିନ ଆପେକ୍ଷିକ ଭାବେ ସେଟ କରାଯାଉଛି।

side-by-side-no-block-child = ଅବୈଧ `<{ $component }>`: ଏଥିରେ ଅନ୍ତତଃ ଗୋଟିଏ ବ୍ଲକ ଶିଶୁ ଉପାଦାନ ରହିବା ଆବଶ୍ୟକ।

## `<label>`

label-for-ignored-on-graphical = ଚିତ୍ରାତ୍ମକ `<label>` ଉପରେ `for` ଗୁଣ ଅଣଦେଖା କରାଯାଏ।

label-for-must-resolve-to-one = `<label>` ଉପରେ `for` ଗୁଣ ଠିକ୍ ଗୋଟିଏ ଉପାଦାନରେ ସମାଧାନ ହେବା ଆବଶ୍ୟକ।

label-for-unresolved = `<label>` ଉପରେ `for` ଗୁଣ କୌଣସି ଉପାଦାନରେ ସମାଧାନ ହୋଇପାରିଲା ନାହିଁ।

label-for-answer-with-authored-inputs = `<label>` ଉପରେ `for` ଗୁଣ ସ୍ପଷ୍ଟ ଲିଖିତ ଇନପୁଟ ଥିବା `<answer>` କୁ ସୂଚାଉଛି; ଇନପୁଟକୁ ସିଧାସଳଖ ସୂଚାନ୍ତୁ।

label-for-answer-without-input = `<label>` ଉପରେ `for` ଗୁଣ ନାମ ଦେବା ପାଇଁ ଇନପୁଟ ନଥିବା `<answer>` କୁ ସୂଚାଉଛି।

label-for-must-reference-input-or-answer = `<label>` ଉପରେ `for` ଗୁଣ ଗୋଟିଏ ଇନପୁଟ କିମ୍ବା ଗୋଟିଏ ଉତ୍ତରକୁ ସୂଚାଇବା ଆବଶ୍ୟକ।

## Accessibility

accessibility-short-description-or-decorative = ଅଭିଗମ୍ୟତା ପାଇଁ `<{ $component }>` ପାଖରେ ଏକ ସଂକ୍ଷିପ୍ତ ବର୍ଣ୍ଣନା ରହିବା ଉଚିତ କିମ୍ବା ଏହାକୁ ସାଜସଜ୍ଜା ଭାବେ ଦର୍ଶାଯିବା ଉଚିତ।

accessibility-video-short-description = ଅଭିଗମ୍ୟତା ପାଇଁ `<video>` ପାଖରେ ଏକ ସଂକ୍ଷିପ୍ତ ବର୍ଣ୍ଣନା ରହିବା ଉଚିତ।

accessibility-input-short-description-or-label = ଅଭିଗମ୍ୟତା ପାଇଁ `<{ $component }>` ପାଖରେ ଏକ ସଂକ୍ଷିପ୍ତ ବର୍ଣ୍ଣନା କିମ୍ବା ଏକ ନାମ ରହିବା ଉଚିତ।

accessibility-answer-input-short-description-or-label = ଅଭିଗମ୍ୟତା ପାଇଁ, ଇନପୁଟ ସୃଷ୍ଟି କରୁଥିବା `<answer>` ପାଖରେ ଏକ ସଂକ୍ଷିପ୍ତ ବର୍ଣ୍ଣନା କିମ୍ବା ଏକ ନାମ ରହିବା ଉଚିତ।

accessibility-short-description-contains-math = ସଂକ୍ଷିପ୍ତ ବର୍ଣ୍ଣନାରେ `<{ $component }>` ପରି ଗାଣିତିକ ଉପାଦାନ ରହିବା ଉଚିତ ନୁହେଁ। ଗଣିତକୁ ଶବ୍ଦରେ ଲେଖନ୍ତୁ।

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] ବିଭାଗ ଶୀର୍ଷକ ଲେଖା ପାଇଁ { $colorName } ର ବୈଷମ୍ୟ ଯଥେଷ୍ଟ ନୁହେଁ (ଗାଢ଼ ଧାରା) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ଅନ୍ତତଃ { $threshold }:1 ଆବଶ୍ୟକ)।
       *[other] ବିଭାଗ ଶୀର୍ଷକ ଲେଖା ପାଇଁ { $colorName } ର ବୈଷମ୍ୟ ଯଥେଷ୍ଟ ନୁହେଁ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ଅନ୍ତତଃ { $threshold }:1 ଆବଶ୍ୟକ)।
    }

## `<circle>`

circle-through-points-non-numerical = ବିନ୍ଦୁଗୁଡ଼ିକର ସାଂଖ୍ୟିକ ମୂଲ୍ୟ ନଥିବା ସ୍ଥଳେ { $count } ବିନ୍ଦୁ ମଧ୍ୟ ଦେଇ ଯାଉଥିବା `<circle>` ପ୍ରଚଳିତ ନାହିଁ।

circle-too-many-through-points = 3 ରୁ ଅଧିକ ବିନ୍ଦୁ ମଧ୍ୟ ଦେଇ ଯାଉଥିବା ବୃତ୍ତ ଗଣନା କରାଯାଇପାରିବ ନାହିଁ।

circle-overprescribed-radius-center-points = ବ୍ୟାସାର୍ଦ୍ଧ, କେନ୍ଦ୍ର ଓ ଅତିକ୍ରମ କରୁଥିବା ବିନ୍ଦୁ ତିନୋଟି ଦିଆଯାଇଥିବା ବୃତ୍ତ ଗଣନା କରାଯାଇପାରିବ ନାହିଁ।

circle-center-with-multiple-points = ଦିଆଯାଇଥିବା କେନ୍ଦ୍ର ସହ 1 ରୁ ଅଧିକ ବିନ୍ଦୁ ମଧ୍ୟ ଦେଇ ଯାଉଥିବା ବୃତ୍ତ ଗଣନା କରାଯାଇପାରିବ ନାହିଁ।

circle-radius-too-small = ବୃତ୍ତ ଗଣନା କରାଯାଇପାରିବ ନାହିଁ: ଦୁଇ ବିନ୍ଦୁ ମଧ୍ୟରେ ଦୂରତା { $distance } ହୋଇଥିବାରୁ, ଦିଆଯାଇଥିବା ବ୍ୟାସାର୍ଦ୍ଧ { $radius } ବହୁତ ଛୋଟ।

circle-radius-with-many-points = ଦିଆଯାଇଥିବା ବ୍ୟାସାର୍ଦ୍ଧ ସହ ଦୁଇରୁ ଅଧିକ ବିନ୍ଦୁ ମଧ୍ୟ ଦେଇ ଯାଉଥିବା ବୃତ୍ତ ସୃଷ୍ଟି କରାଯାଇପାରିବ ନାହିଁ।

circle-invalid-center-or-through-points = ବୃତ୍ତର କେନ୍ଦ୍ର କିମ୍ବା ଅତିକ୍ରମ କରୁଥିବା ବିନ୍ଦୁ ଅବୈଧ।

circle-radius-center-with-multiple-points = ଦିଆଯାଇଥିବା କେନ୍ଦ୍ର ସହ 1 ରୁ ଅଧିକ ବିନ୍ଦୁ ମଧ୍ୟ ଦେଇ ଯାଉଥିବା ବୃତ୍ତର ବ୍ୟାସାର୍ଦ୍ଧ ଗଣନା କରାଯାଇପାରିବ ନାହିଁ।

circle-change-radius-non-numerical = ସାଂଖ୍ୟିକ ମୂଲ୍ୟ ନଥିବା ବିନ୍ଦୁ ମଧ୍ୟ ଦେଇ ଯାଉଥିବା ବୃତ୍ତର ବ୍ୟାସାର୍ଦ୍ଧ ବଦଳାଯାଇପାରିବ ନାହିଁ

circle-radius-with-points-non-numerical = ସାଂଖ୍ୟିକ ମୂଲ୍ୟ ନଥିଲେ, ଦିଆଯାଇଥିବା ବ୍ୟାସାର୍ଦ୍ଧ ସହ ଗୋଟିଏରୁ ଅଧିକ ବିନ୍ଦୁ ମଧ୍ୟ ଦେଇ ଯାଉଥିବା ବୃତ୍ତ ସୃଷ୍ଟି କରାଯାଇପାରିବ ନାହିଁ।

circle-change-center-non-numerical = ସାଂଖ୍ୟିକ ମୂଲ୍ୟ ନଥିବା ବିନ୍ଦୁ ମଧ୍ୟ ଦେଇ ଯାଉଥିବା ବୃତ୍ତର କେନ୍ଦ୍ର ବଦଳାଇବା ପ୍ରଚଳିତ ନାହିଁ।

## `<function>`

function-domain-insufficient-dimensions = ଫଳନର ପ୍ରାନ୍ତ ପାଇଁ ଯଥେଷ୍ଟ ପରିମାଣ ନାହିଁ। ପ୍ରାନ୍ତରେ { $intervals } ଅନ୍ତରାଳ ଅଛି, କିନ୍ତୁ ଫଳନରେ { $inputs } ଇନପୁଟ ଅଛି।

function-domain-invalid-format = ଫଳନର ପ୍ରାନ୍ତ ପାଇଁ ଅବୈଧ ରୂପ।

function-ignoring-non-numerical =
    { $type ->
        [maximum] ଫଳନର ଅସାଂଖ୍ୟିକ ସର୍ବାଧିକ ମୂଲ୍ୟ ଅଣଦେଖା କରାଯାଉଛି।
        [minimum] ଫଳନର ଅସାଂଖ୍ୟିକ ସର୍ବନିମ୍ନ ମୂଲ୍ୟ ଅଣଦେଖା କରାଯାଉଛି।
        [extremum] ଫଳନର ଅସାଂଖ୍ୟିକ ଚରମ ମୂଲ୍ୟ ଅଣଦେଖା କରାଯାଉଛି।
        [point] ଫଳନର ଅସାଂଖ୍ୟିକ ବିନ୍ଦୁ ଅଣଦେଖା କରାଯାଉଛି।
        [slope] ଫଳନର ଅସାଂଖ୍ୟିକ ଢାଲ ଅଣଦେଖା କରାଯାଉଛି।
       *[other] ଫଳନର ଅସାଂଖ୍ୟିକ { $type } ଅଣଦେଖା କରାଯାଉଛି।
    }

function-ignoring-empty =
    { $type ->
        [maximum] ଫଳନର ଖାଲି ସର୍ବାଧିକ ମୂଲ୍ୟ ଅଣଦେଖା କରାଯାଉଛି।
        [minimum] ଫଳନର ଖାଲି ସର୍ବନିମ୍ନ ମୂଲ୍ୟ ଅଣଦେଖା କରାଯାଉଛି।
        [extremum] ଫଳନର ଖାଲି ଚରମ ମୂଲ୍ୟ ଅଣଦେଖା କରାଯାଉଛି।
        [point] ଫଳନର ଖାଲି ବିନ୍ଦୁ ଅଣଦେଖା କରାଯାଉଛି।
       *[other] ଫଳନର ଖାଲି { $type } ଅଣଦେଖା କରାଯାଉଛି।
    }

function-points-too-close = ଫଳନରେ ବହୁତ ପାଖାପାଖି ଥିବା ଦୁଇଟି ବିନ୍ଦୁ ଅଛି। ଫଳନ ସଂଜ୍ଞାୟିତ କରାଯାଇପାରିବ ନାହିଁ।

function-iterates-input-output-mismatch = ଫଳନର ଇନପୁଟ ସଂଖ୍ୟା ଆଉଟପୁଟ ସଂଖ୍ୟା ସହ ସମାନ ହେଲେ ହିଁ ଫଳନ ପୁନରାବୃତ୍ତି ସମ୍ଭବ। ଏହି ଫଳନରେ { $inputs } ଇନପୁଟ ଓ { $outputs } ଆଉଟପୁଟ ଅଛି।

## `<sequence>`

sequence-invalid-length = କ୍ରମର ଲମ୍ବ ଅବୈଧ। ଏହା ଏକ ଅଋଣାତ୍ମକ ପୂର୍ଣ୍ଣସଂଖ୍ୟା ହେବା ଆବଶ୍ୟକ।

sequence-invalid-step = କ୍ରମର ପାଦ ଅବୈଧ। { $type } ପ୍ରକାରର କ୍ରମ ପାଇଁ ଏହା ଏକ ସଂଖ୍ୟା ହେବା ଆବଶ୍ୟକ।

sequence-invalid-endpoint-number = ସଂଖ୍ୟା କ୍ରମର "{ $attribute }" ଅବୈଧ। ଏହା ଏକ ସଂଖ୍ୟା ହେବା ଆବଶ୍ୟକ।

sequence-invalid-endpoint-letters = ଅକ୍ଷର କ୍ରମର "{ $attribute }" ଅବୈଧ। ଏହା ଏକ ଅକ୍ଷର ସଂଯୋଗ ହେବା ଆବଶ୍ୟକ।

sequence-invalid-endpoint = କ୍ରମର "{ $attribute }" ଅବୈଧ।

select-from-sequence-coprime-not-numbers = ସଂଖ୍ୟା ବଛା ନଯାଉଥିବାରୁ coprime ଅଣଦେଖା କରାଯାଉଛି

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations ଦିଆଯାଇଥିବାରୁ coprime ଅଣଦେଖା କରାଯାଉଛି

## Resolving a `target`

target-not-found = `<{ $source }>` ପାଇଁ ଅବୈଧ target: ଲକ୍ଷ୍ୟ ମିଳିଲା ନାହିଁ।

target-state-variable-not-found = `<{ $source }>` ପାଇଁ ଅବୈଧ target: `<{ $component }>` ଉପରେ "{ $property }" ନାମର ସ୍ଥିତି ଚଳ ମିଳିଲା ନାହିଁ।

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` ର ଚଳ ସ୍ୱାଧୀନ ଚଳଠାରୁ ଅଲଗା ହେବା ଆବଶ୍ୟକ।

ode-system-duplicate-variable-names = ସମାନ ନିର୍ଭରଶୀଳ ଚଳ ନାମ ସହ ODE RHS ଫଳନ ସଂଜ୍ଞାୟିତ କରାଯାଇପାରିବ ନାହିଁ।

ode-system-rhs-function-error = ODE RHS ଫଳନ ସଂଜ୍ଞାୟିତ କରାଯାଇପାରିବ ନାହିଁ। mathjs ଫଳନ ସୃଷ୍ଟିରେ ତ୍ରୁଟି।

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } ସରଳରେଖା ମଧ୍ୟରେ କୋଣ ସଂଜ୍ଞାୟିତ କରାଯାଇପାରିବ ନାହିଁ

angle-invalid-through-point = `<angle>` ର through ରେ ଅବୈଧ ବିନ୍ଦୁ

parabola-vertex-too-many-points = ଶୀର୍ଷ ସହ 1 ରୁ ଅଧିକ ବିନ୍ଦୁ ମଧ୍ୟ ଦେଇ ଯାଉଥିବା ପରାବୃତ୍ତ ପ୍ରଚଳିତ ନାହିଁ।

parabola-too-many-points = 3 ରୁ ଅଧିକ ବିନ୍ଦୁ ମଧ୍ୟ ଦେଇ ଯାଉଥିବା ପରାବୃତ୍ତ ପ୍ରଚଳିତ ନାହିଁ।

intersection-too-many-items = ଦୁଇରୁ ଅଧିକ ବସ୍ତୁ ପାଇଁ ଛେଦ ପ୍ରଚଳିତ ନାହିଁ

## Other math components

ionic-compound-not-two-ions = ଦୁଇଟି ଆୟନ ବ୍ୟତୀତ ଅନ୍ୟ କାହା ପାଇଁ ଆୟୋନିକ ଯୌଗିକ ପ୍ରଚଳିତ ନାହିଁ।

ionic-compound-needs-cation-and-anion = ଗୋଟିଏ କ୍ୟାଟାୟନ ଓ ଗୋଟିଏ ଆନାୟନ ପାଇଁ ହିଁ ଆୟୋନିକ ଯୌଗିକ ପ୍ରଚଳିତ।

solve-equations-cannot-evaluate = ସମୀକରଣର ମୂଲ୍ୟାୟନ ନହେବାରୁ ଏହାକୁ ସମାଧାନ କରାଯାଇପାରିବ ନାହିଁ: { $equation }

math-operators-operand-number-required = ଗାଣିତିକ ଅବୟବ ବାହାର କରିବା ସମୟରେ operandNumber ଦେବା ଆବଶ୍ୟକ।

eigen-decomposition-failed = ମାଟ୍ରିକ୍ସର ଆଇଗେନ ମୂଲ୍ୟ ଗଣନା କରାଯାଇପାରିଲା ନାହିଁ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: { $parameters } ପାରାମିଟର ଛାଞ୍ଚରେ ନଆସିବାରୁ ଏହା ସର୍ବଦା ଏକ ଖାଲି ସ୍ଥାନ ସହ ମେଳ ଖାଇବ।

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ବୁଝାପଡ଼ିଲା ନାହିଁ। ଏହା none, medium, dense କିମ୍ବା ଏକ ଖାଲି ସ୍ଥାନରେ ଅଲଗା ହୋଇଥିବା ଦୁଇଟି ଧନାତ୍ମକ ସଂଖ୍ୟା — ଯେମିତି grid="1 0.5" — ହେବା ଆବଶ୍ୟକ। କୌଣସି ଜାଲି ଅଙ୍କାଯାଇ ନାହିଁ।

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure ରେଣ୍ଡରରରେ xLabelPosition="left" ସମର୍ଥିତ ନୁହେଁ; ଡାହାଣ ପାର୍ଶ୍ୱର ଆଚରଣ ବ୍ୟବହାର କରାଯାଉଛି।

prefigure-y-label-position-unsupported = `<graph>`: prefigure ରେଣ୍ଡରରରେ yLabelPosition="bottom" ସମର୍ଥିତ ନୁହେଁ; ଉପର ପାର୍ଶ୍ୱର ଆଚରଣ ବ୍ୟବହାର କରାଯାଉଛି।

prefigure-invalid-axis-bounds = `<graph>`: prefigure ରୂପାନ୍ତର ପାଇଁ ଅକ୍ଷର ସୀମା ଅବୈଧ; ପୂର୍ବନିର୍ଦ୍ଧାରିତ bbox (-10,-10,10,10) ବ୍ୟବହାର କରାଯାଉଛି।

prefigure-invalid-width = `<graph>`: prefigure ରୂପାନ୍ତର ପାଇଁ ଓସାର ଅବୈଧ; ପୂର୍ବନିର୍ଦ୍ଧାରିତ ଚିତ୍ର ଓସାର 425 ବ୍ୟବହାର କରାଯାଉଛି।

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ରୂପାନ୍ତର ପାଇଁ aspectRatio ଅବୈଧ; ପୂର୍ବନିର୍ଦ୍ଧାରିତ ଅନୁପାତ 1 ବ୍ୟବହାର କରାଯାଉଛି।

prefigure-grid-spacing-too-fine = `<graph>`: ଅକ୍ଷର ସୀମା ପାଇଁ ଜାଲିର ବ୍ୟବଧାନ ବହୁତ ସୂକ୍ଷ୍ମ; prefigure ରେଣ୍ଡରରରେ ଜାଲି ଛାଡ଼ି ଦିଆଯାଉଛି।

prefigure-annotations-not-rendered = `<graph>`: PreFigure ରେଣ୍ଡରର ବ୍ୟବହାର ନହେଲେ ଟିପ୍ପଣୀ ଦେଖାଯିବ ନାହିଁ।

multiple-annotations-children = `<graph>` ରେ ଏକାଧିକ `<annotations>` ଶିଶୁ ଉପାଦାନ ମିଳିଲା; ଶେଷଟି ବ୍ୟତୀତ ସବୁ ଅଣଦେଖା କରାଯାଉଛି।

## Referring to other components

copy-unrecognized-component-type = ଅଚିହ୍ନା ଉପାଦାନ ପ୍ରକାରକୁ ବିସ୍ତାର କିମ୍ବା ନକଲ କରାଯାଇପାରିବ ନାହିଁ: { $type }।

copy-prop-not-found = { $component } ପ୍ରକାରର ଉପାଦାନ ଉପରେ { $property } ଗୁଣ ମିଳିଲା ନାହିଁ

collect-no-source = collect ପାଇଁ କୌଣସି ଉତ୍ସ ମିଳିଲା ନାହିଁ।

collect-invalid-component-type = `<{ $component }>` ଅବୈଧ ଉପାଦାନ ପ୍ରକାର ହୋଇଥିବାରୁ ସେହି ପ୍ରକାରର ଉପାଦାନ ସଂଗ୍ରହ କରାଯାଇପାରିବ ନାହିଁ।

reference-index-unavailable = `{ $reference }` ସୂଚକାଙ୍କକୁ ସୂଚାଯାଇପାରିବ ନାହିଁ

## `<callAction>`

component-action-unavailable = `{ $reference }` ଉପାଦାନ ଉପରେ { $action } ଡକାଯାଇପାରିବ ନାହିଁ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ତଥ୍ୟର ଆକାର ଅବୈଧ। ଧାଡ଼ିଗୁଡ଼ିକର ଲମ୍ବ ଅସଙ୍ଗତ। componentIdx :{ $componentIdx } ରେ ମିଳିଲା

data-frame-duplicate-column-names = ତଥ୍ୟରେ ସ୍ତମ୍ଭର ନାମ ପୁନରାବୃତ୍ତି ହୋଇଛି। componentIdx :{ $componentIdx } ରେ ମିଳିଲା

data-frame-missing-column-name = ତଥ୍ୟରେ ଗୋଟିଏ ସ୍ତମ୍ଭର ନାମ ନାହିଁ। componentIdx :{ $componentIdx } ରେ ମିଳିଲା

## `<answer>` and scoring

answer-award-depends-on-own-response = ଏହି ଉତ୍ତରର ଗୋଟିଏ award, ସେହି answer ଟ୍ୟାଗ ପଠାଇଥିବା ଉତ୍ତର ଉପରେ ହିଁ ଆଧାରିତ; ଏଥିରୁ ଅପ୍ରତ୍ୟାଶିତ ଆଚରଣ ଘଟିବ।

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` ଥିବା ପାତ୍ର ଭିତରର `<answer>` ଉପରେ `maxNumAttempts` ସେଟ କରିବାର କୌଣସି ପ୍ରଭାବ ନାହିଁ; ପ୍ରୟାସ ସଂଖ୍ୟା ସେହି ପାତ୍ର ହିଁ ନିୟନ୍ତ୍ରଣ କରେ। `maxNumAttempts` ପାତ୍ର ଉପରେ ସେଟ କରନ୍ତୁ।

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` ଥିବା ଅନ୍ୟ ପାତ୍ର ଭିତରର, `sectionWideCheckWork` ଥିବା ପାତ୍ର ଉପରେ `maxNumAttempts` ସେଟ କରିବାର କୌଣସି ପ୍ରଭାବ ନାହିଁ; ପ୍ରୟାସ ସଂଖ୍ୟା ବାହାର ପାତ୍ର ହିଁ ନିୟନ୍ତ୍ରଣ କରେ। `maxNumAttempts` ବାହାର ପାତ୍ର ଉପରେ ସେଟ କରନ୍ତୁ।

answer-attributes-need-symbolic-equality = symbolicEquality ସେଟ ନକରି { $attributes } ଗୁଣର କୌଣସି ପ୍ରଭାବ ରହିବ ନାହିଁ।

answer-invalid-type = ଉତ୍ତର ପାଇଁ ଅବୈଧ ପ୍ରକାର: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` ଉପାଦାନର ନାମ ନଥିବାରୁ, ଏହାକୁ module ଗୁଣ ଭାବେ ବ୍ୟବହାର କରାଯାଇପାରିବ ନାହିଁ

module-attribute-name-already-defined = `<module>` ଉପାଦାନ ପ୍ରକାରରେ "{ $name }" ଗୁଣ ପୂର୍ବରୁ ସଂଜ୍ଞାୟିତ ଥିବାରୁ, `<{ $component } name="{ $name }">` ଉପାଦାନକୁ module ର ଗୁଣ ଭାବେ ବ୍ୟବହାର କରାଯାଇପାରିବ ନାହିଁ।

conditional-content-condition-ignored = case କିମ୍ବା else ଶିଶୁ ଉପାଦାନ ଥିବା `<conditionalContent>` ଉପାଦାନ ଉପରେ `condition` ଗୁଣ ଅଣଦେଖା କରାଯାଏ।

slider-markers-type-mismatch = ଚିହ୍ନଗୁଡ଼ିକର ପ୍ରକାର slider ର ପ୍ରକାର ସହ ମେଳ ଖାଉ ନାହିଁ।

pretzel-problem-needs-statement-and-answer = ଅବୈଧ pretzel: ପ୍ରତ୍ୟେକ `<problem>` ରେ ଗୋଟିଏ `<statement>` ଓ ଗୋଟିଏ `<answer>` ରହିବା ଆବଶ୍ୟକ।

pretzel-circuit-first-problem-distractor = ଅବୈଧ pretzel: mode="circuit" ରେ ପ୍ରଥମ `<problem>` ଏକ ଭ୍ରମକାରୀ ହୋଇପାରିବ ନାହିଁ।

## Attribute values

attribute-invalid-values = `{ $attribute }` ଗୁଣ ପାଇଁ ଅବୈଧ ମୂଲ୍ୟ { $values }; ଅଣଦେଖା କରାଯାଉଛି।

attribute-must-be-references = `{ $attribute }` ଗୁଣ ପାଇଁ `{ $value }` ଅବୈଧ ମୂଲ୍ୟ। ଏହି ଗୁଣ `$` ରୁ ଆରମ୍ଭ ହେଉଥିବା ସନ୍ଦର୍ଭରେ ଗଠିତ ହେବା ଆବଶ୍ୟକ।

math-input-invalid-function-names = <mathInput>: { $attribute } ରେ ଥିବା ଅବୈଧ ଫଳନ ନାମ ଅଣଦେଖା କରାଗଲା: { $names }। ପ୍ରତ୍ୟେକ ନାମର ପ୍ରଦର୍ଶନ ଅଂଶ ଅନ୍ତତଃ 2 ଅକ୍ଷର (ଅକ୍ଷର କିମ୍ବା ଡ୍ୟାସ) ର ହେବା ଆବଶ୍ୟକ; ତାପରେ ଇଚ୍ଛାଧୀନ ଭାବେ `|<mathspeak alternative>` ପ୍ରତ୍ୟୟ ଆସିପାରେ।

## Building components from the source

component-type-invalid = ଅବୈଧ ଉପାଦାନ ପ୍ରକାର: `<{ $componentType }>`

attribute-repeated = { $attribute } ଗୁଣ ପୁନରାବୃତ୍ତି କରାଯାଇପାରିବ ନାହିଁ।

attribute-invalid-for-component = `<{ $componentType }>` ପ୍ରକାରର ଉପାଦାନ ପାଇଁ "{ $attribute }" ଅବୈଧ ଗୁଣ।

## Style definition contrast

style-definition-insufficient-contrast =
    ଶୈଳୀ ସଂଜ୍ଞା { $styleNumber } ରେ { $context ->
        [text-on-background] ପୃଷ୍ଠଭୂମି ରଙ୍ଗ ବିରୁଦ୍ଧରେ ଲେଖା ରଙ୍ଗର
        [high-contrast] କ୍ୟାନଭାସ ବିରୁଦ୍ଧରେ ଉଚ୍ଚ-ବୈଷମ୍ୟ ରଙ୍ଗର
        [line] କ୍ୟାନଭାସ ବିରୁଦ୍ଧରେ ରେଖା ରଙ୍ଗର
        [marker] କ୍ୟାନଭାସ ବିରୁଦ୍ଧରେ ଚିହ୍ନ ରଙ୍ଗର
       *[text-on-canvas] କ୍ୟାନଭାସ ବିରୁଦ୍ଧରେ ଲେଖା ରଙ୍ଗର
    } ବୈଷମ୍ୟ ଯଥେଷ୍ଟ ନୁହେଁ{ $mode ->
        [dark] { " (ଗାଢ଼ ଧାରା)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ଅନ୍ତତଃ { $threshold }:1 ଆବଶ୍ୟକ)।

style-definition-dark-mode-text-background-contrast =
    ଶୈଳୀ ସଂଜ୍ଞା { $styleNumber } ଉଜ୍ଜ୍ୱଳ ଧାରା ପାଇଁ ଯଥେଷ୍ଟ ବୈଷମ୍ୟ ଦେଉଥିବା ରଙ୍ଗ ଦେଇଥିଲେ ମଧ୍ୟ, ସେଥିରୁ ମିଳିଥିବା ଗାଢ଼ ଧାରାର ରଙ୍ଗରେ ପୃଷ୍ଠଭୂମି ରଙ୍ଗ ବିରୁଦ୍ଧରେ ଲେଖା ରଙ୍ଗର ବୈଷମ୍ୟ ଯଥେଷ୍ଟ ନୁହେଁ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ଅନ୍ତତଃ { $threshold }:1 ଆବଶ୍ୟକ)। { $suggestion ->
        [available] ଗାଢ଼ ଧାରାରେ ଯଥେଷ୍ଟ ବୈଷମ୍ୟ ନିଶ୍ଚିତ କରିବାକୁ, ଉଜ୍ଜ୍ୱଳ ଧାରାର ବୈଷମ୍ୟ ବଢ଼ାନ୍ତୁ (ଯେମିତି { $lightAttribute }="{ $lightColor }" ସେଟ କରନ୍ତୁ) କିମ୍ବା ଗାଢ଼ ଧାରାର ରଙ୍ଗ ବଦଳାନ୍ତୁ (ଯେମିତି { $darkAttribute }="{ $darkColor }" ସେଟ କରନ୍ତୁ)।
       *[none] ଗାଢ଼ ଧାରାରେ ଯଥେଷ୍ଟ ବୈଷମ୍ୟ ନିଶ୍ଚିତ କରିବାକୁ, ଉଜ୍ଜ୍ୱଳ ଧାରାର ବୈଷମ୍ୟ ବଢ଼ାନ୍ତୁ କିମ୍ବା ମିଳିଥିବା ରଙ୍ଗକୁ textColorDarkMode ଏବଂ/କିମ୍ବା backgroundColorDarkMode ଦ୍ୱାରା ବଦଳାନ୍ତୁ।
    }

style-definition-dark-mode-text-canvas-contrast =
    ଶୈଳୀ ସଂଜ୍ଞା { $styleNumber } ଉଜ୍ଜ୍ୱଳ ଧାରା ପାଇଁ ଯଥେଷ୍ଟ ବୈଷମ୍ୟ ଦେଉଥିବା ଲେଖା ରଙ୍ଗ ଦେଇଥିଲେ ମଧ୍ୟ, ସେଥିରୁ ମିଳିଥିବା ଗାଢ଼ ଧାରାର ଲେଖା ରଙ୍ଗର କ୍ୟାନଭାସ ବିରୁଦ୍ଧରେ ବୈଷମ୍ୟ ଯଥେଷ୍ଟ ନୁହେଁ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ଅନ୍ତତଃ { $threshold }:1 ଆବଶ୍ୟକ)। { $suggestion ->
        [available] ଗାଢ଼ ଧାରାରେ ଯଥେଷ୍ଟ ବୈଷମ୍ୟ ନିଶ୍ଚିତ କରିବାକୁ, ଉଜ୍ଜ୍ୱଳ ଧାରାର ବୈଷମ୍ୟ ବଢ଼ାନ୍ତୁ (ଯେମିତି textColor="{ $lightColor }" ସେଟ କରନ୍ତୁ) କିମ୍ବା ଗାଢ଼ ଧାରାର ରଙ୍ଗ ବଦଳାନ୍ତୁ (ଯେମିତି textColorDarkMode="{ $darkColor }" ସେଟ କରନ୍ତୁ)।
       *[none] ଗାଢ଼ ଧାରାରେ ଯଥେଷ୍ଟ ବୈଷମ୍ୟ ନିଶ୍ଚିତ କରିବାକୁ, ଉଜ୍ଜ୍ୱଳ ଧାରାର ବୈଷମ୍ୟ ବଢ଼ାନ୍ତୁ କିମ୍ବା ମିଳିଥିବା ରଙ୍ଗକୁ textColorDarkMode ଦ୍ୱାରା ବଦଳାନ୍ତୁ।
    }

section-multiple-style-palettes = ଗୋଟିଏ ବିଭାଗ କେବଳ ଗୋଟିଏ <stylePalette> ବାଛିପାରିବ; ଶେଷଟି ବ୍ୟବହାର କରାଯାଉଛି।

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect ଏକ ଅଋଣାତ୍ମକ ପୂର୍ଣ୍ଣସଂଖ୍ୟା ନହେବାରୁ { $component } ର ଅନନ୍ୟ ପ୍ରକାର ନିର୍ଦ୍ଧାରଣ କରାଯାଇପାରିବ ନାହିଁ।

variant-num-to-select-not-constant-number = numToSelect ଏକ ସ୍ଥିର ସଂଖ୍ୟା ନହେବାରୁ { $component } ର ଅନନ୍ୟ ପ୍ରକାର ନିର୍ଦ୍ଧାରଣ କରାଯାଇପାରିବ ନାହିଁ।

variant-with-replacement-not-constant-boolean = withReplacement ଏକ ସ୍ଥିର boolean ନହେବାରୁ { $component } ର ଅନନ୍ୟ ପ୍ରକାର ନିର୍ଦ୍ଧାରଣ କରାଯାଇପାରିବ ନାହିଁ।

variant-select-weight-disables-unique = selectWeight କିମ୍ବା selectForVariants ଦିଆଯାଇଥିବା କୌଣସି ବିକଳ୍ପ ଥିଲେ select ପାଇଁ ଅନନ୍ୟ ପ୍ରକାର ବନ୍ଦ ହୋଇଯାଏ

variant-coprime-undetermined = coprime ସର୍ବଦା ମିଥ୍ୟା ବୋଲି ନିର୍ଦ୍ଧାରଣ ନହେବାରୁ { $component } ର ଅନନ୍ୟ ପ୍ରକାର ନିର୍ଦ୍ଧାରଣ କରାଯାଇପାରିବ ନାହିଁ।

variant-attribute-not-constant = { $attribute } ସ୍ଥିର ନହେବାରୁ { $component } ର ଅନନ୍ୟ ପ୍ରକାର ନିର୍ଦ୍ଧାରଣ କରାଯାଇପାରିବ ନାହିଁ।

variant-attribute-not-number = { $attribute } ସଂଖ୍ୟା ନହେବାରୁ { $component } ର ଅନନ୍ୟ ପ୍ରକାର ନିର୍ଦ୍ଧାରଣ କରାଯାଇପାରିବ ନାହିଁ।

variant-attribute-wrong-type-for-sequence =
    { $attribute } { $expected ->
        [letters-combination] ଏକ ଅକ୍ଷର ସଂଯୋଗ
        [math-expression] ଏକ ବୈଧ ଗାଣିତିକ ଅଭିବ୍ୟକ୍ତି
        [integer] ଏକ ପୂର୍ଣ୍ଣସଂଖ୍ୟା
       *[number] ଏକ ସଂଖ୍ୟା
    } ନହେବାରୁ { $type } ପ୍ରକାରର { $component } ର ଅନନ୍ୟ ପ୍ରକାର ନିର୍ଦ୍ଧାରଣ କରାଯାଇପାରିବ ନାହିଁ।

variant-length-not-integer = length ପୂର୍ଣ୍ଣସଂଖ୍ୟା ନହେବାରୁ { $component } ର ଅନନ୍ୟ ପ୍ରକାର ନିର୍ଦ୍ଧାରଣ କରାଯାଇପାରିବ ନାହିଁ।

variant-sort-not-implemented = sort ଥିବା { $component } ର ଅନନ୍ୟ ପ୍ରକାର ପ୍ରଚଳିତ ନାହିଁ

variant-exclude-combinations-not-implemented = excludeCombinations ଥିବା { $component } ର ଅନନ୍ୟ ପ୍ରକାର ପ୍ରଚଳିତ ନାହିଁ

variant-math-exclude-not-implemented = exclude ଥିବା math ପ୍ରକାରର { $component } ର ଅନନ୍ୟ ପ୍ରକାର ପ୍ରଚଳିତ ନାହିଁ

variant-non-constant-exclude-not-implemented = ସ୍ଥିର ନଥିବା exclude ଥିବା { $component } ର ଅନନ୍ୟ ପ୍ରକାର ପ୍ରଚଳିତ ନାହିଁ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure ରେଣ୍ଡରରରେ ସମର୍ଥିତ ନୁହେଁ; ବଂଶଜ ଛାଡ଼ି ଦିଆଗଲା।

prefigure-descendant-invalid-geometry = { $subject }: ଅସୀମ କିମ୍ବା ଅସମ୍ପୂର୍ଣ୍ଣ ଜ୍ୟାମିତି; ବଂଶଜ ଛାଡ଼ି ଦିଆଗଲା।

prefigure-curve-label-omitted = { $subject }: ରୂପାନ୍ତରିତ ବକ୍ରରେଖା ଉପାଦାନ ଉପରେ ନାମ ସମର୍ଥିତ ନୁହେଁ; ନାମ ଛାଡ଼ି ଦିଆଗଲା।

prefigure-curve-unsupported-definition-type = { $subject }: ଅସମର୍ଥିତ ବକ୍ରରେଖା ଫଳନ ସଂଜ୍ଞା ପ୍ରକାର '{ $definitionType }'; ବଂଶଜ ଛାଡ଼ି ଦିଆଗଲା।

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves ଉପରେ ଅସମର୍ଥିତ flipFunctions ଗୁଣ; ବଂଶଜ ଛାଡ଼ି ଦିଆଗଲା।

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves ଉପରେ କେବଳ ସୂତ୍ର ପ୍ରକାରର ଶିଶୁ ଫଳନ ସମର୍ଥିତ; ବଂଶଜ ଛାଡ଼ି ଦିଆଗଲା।

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] ରେଖା ପରିବାରର ନାମ ପାଇଁ
       *[point] ବିନ୍ଦୁର ନାମ ପାଇଁ
    } ଅସମର୍ଥିତ labelPosition '{ $labelPosition }'; ପୂର୍ବନିର୍ଦ୍ଧାରିତ PreFigure ସଜ୍ଜା ବ୍ୟବହାର କରାଗଲା।

prefigure-fill-style-unsupported = { $subject }: ପୂରଣ ଶୈଳୀ '{ $fillStyle }' କୁ PreFigure ସମର୍ଥନ କରେ ନାହିଁ; ଘନ ପୂରଣକୁ ଫେରାଯାଉଛି।

prefigure-line-style-unknown = { $subject }: ଅଜଣା ରେଖା ଶୈଳୀ '{ $lineStyle }' PreFigure ଆଉଟପୁଟରୁ ଛାଡ଼ି ଦିଆଗଲା।

prefigure-marker-style-mapped-to-diamond = { $subject }: ଚିହ୍ନ ଶୈଳୀ '{ $markerStyle }' PreFigure ଶୈଳୀ 'diamond' ରେ ମ୍ୟାପ କରାଗଲା।

prefigure-marker-style-unsupported = { $subject }: ଚିହ୍ନ ଶୈଳୀ '{ $markerStyle }' କୁ PreFigure ସମର୍ଥନ କରେ ନାହିଁ; ପୂର୍ବନିର୍ଦ୍ଧାରିତ ଶୈଳୀ ବ୍ୟବହାର କରାଗଲା।

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ଅବୈଧ `ref`; ଲକ୍ଷ୍ୟ ସମାଧାନ ହୋଇପାରିଲା ନାହିଁ। ଟିପ୍ପଣୀ ଛାଡ଼ି ଦିଆଗଲା।

annotation-ref-multiple-targets = `<annotation>`: `ref` ଏକାଧିକ ଲକ୍ଷ୍ୟରେ ସମାଧାନ ହେଲା; ପ୍ରଥମ ଲକ୍ଷ୍ୟ ବ୍ୟବହାର କରାଯାଉଛି।

annotation-ref-outside-graph = `<annotation>`: ଅବୈଧ `ref`; ଲକ୍ଷ୍ୟ ଏହାକୁ ଧାରଣ କରିଥିବା ଗ୍ରାଫ ବାହାରେ ଅଛି। ଟିପ୍ପଣୀ ଛାଡ଼ି ଦିଆଗଲା।

annotation-ref-unsupported-target = `<annotation>`: ଅବୈଧ `ref`; prefigure ରୂପାନ୍ତରରେ ଲକ୍ଷ୍ୟ ସମର୍ଥିତ ଚିତ୍ରାତ୍ମକ ବସ୍ତୁ ନୁହେଁ। ଟିପ୍ପଣୀ ଛାଡ଼ି ଦିଆଗଲା।

annotation-text-missing = `<annotation>`: `text` ନାହିଁ କିମ୍ବା ଖାଲି; ଖାଲି ଲେଖା ଦିଆଯାଉଛି।

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] ଚକ୍ରୀୟ ନିର୍ଭରଶୀଳତା ମିଳିଲା।
       *[other] `<{ $componentType }>` ଉପାଦାନ ସହ ଜଡ଼ିତ ଚକ୍ରୀୟ ନିର୍ଭରଶୀଳତା ମିଳିଲା।
    }

reference-no-referent = ଏହି ସନ୍ଦର୍ଭ ପାଇଁ କିଛି ମିଳିଲା ନାହିଁ: `{ $reference }`

reference-multiple-referents = ଏହି ସନ୍ଦର୍ଭ ପାଇଁ ଏକାଧିକ ଲକ୍ଷ୍ୟ ମିଳିଲା: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` ର { $attribute } ଗୁଣ ପାଇଁ ଅବୈଧ ରୂପ।

children-invalid = `<{ $componentType }>` ପାଇଁ ଅବୈଧ ଶିଶୁ ଉପାଦାନ: ଅବୈଧ ଶିଶୁ ଉପାଦାନ ମିଳିଲା: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` ଗୁଣ ପାଇଁ `{ $value }` ଅବୈଧ ମୂଲ୍ୟ, `{ $default }` ମୂଲ୍ୟ ବ୍ୟବହାର କରାଯାଉଛି

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML ସଂସ୍କରଣ { $version } ମିଳିଲା ନାହିଁ।
       *[other] DoenetML ସଂସ୍କରଣ { $version } ମିଳିଲା ନାହିଁ। ସଂସ୍କରଣ { $fallback } ବ୍ୟବହାର କରାଯାଉଛି
    }

## Reading the DoenetML

parse-invalid-doenetml = ଅବୈଧ DoenetML: { $content }

parse-tag-missing-close-tag = ଅବୈଧ DoenetML: `{ $tag }` ଟ୍ୟାଗର ବନ୍ଦ କରୁଥିବା ଟ୍ୟାଗ ନାହିଁ। ନିଜେ ବନ୍ଦ ହେଉଥିବା ଟ୍ୟାଗ କିମ୍ବା `</{ $tagName }>` ଟ୍ୟାଗ ଆଶା କରାଯାଉଥିଲା।

parse-tag-error = ଅବୈଧ DoenetML: `<{ $tagName }>` ଟ୍ୟାଗରେ ତ୍ରୁଟି

parse-attribute-missing-value = ଅବୈଧ DoenetML: `{ $attribute }` ଅବୈଧ ଗୁଣର ମୂଲ୍ୟ ନଥିବା ପରି ଲାଗୁଛି।

parse-attribute-invalid = ଅବୈଧ DoenetML: ଅବୈଧ ଗୁଣ `{ $attribute }`

parse-attribute-value-invalid = ଅବୈଧ DoenetML: ଅବୈଧ ଗୁଣ ମୂଲ୍ୟ `{ $value }`

parse-attribute-value-quote-mismatch = ଅବୈଧ DoenetML: ଅବୈଧ ଗୁଣ ମୂଲ୍ୟ `{ $value }`। ଉଦ୍ଧୃତି ଚିହ୍ନ ମେଳ ଖାଉ ନାହିଁ। `{ $quote }` ନଥିବା ପରି ଲାଗୁଛି

parse-open-tag-name-missing = ଅବୈଧ DoenetML: ନାମ ବିନା ଟ୍ୟାଗ ମିଳିଲା, ଯେମିତି `<`

parse-tag-not-closed = ଅବୈଧ DoenetML: `{ $tag }` ଟ୍ୟାଗ ବନ୍ଦ ହୋଇନାହିଁ (`>` ନଥିବା ପରି ଲାଗୁଛି)।

parse-self-closing-tag-name-missing = ଅବୈଧ DoenetML: ନାମ ବିନା ଟ୍ୟାଗ ମିଳିଲା `<{ $content }>`

parse-self-closing-tag-not-closed = ଅବୈଧ DoenetML: `{ $tag }` ଟ୍ୟାଗ ବନ୍ଦ ହୋଇନାହିଁ (`/>` ନଥିବା ପରି ଲାଗୁଛି)।

parse-tag-invalid-attributes = ଅବୈଧ DoenetML: `{ $tag }` ଟ୍ୟାଗ ବୈଧ ନୁହେଁ। ଏହାର ଗୁଣ ଭୁଲ ହୋଇପାରେ।

parse-close-tag-name-missing = ଅବୈଧ DoenetML: ନାମ ବିନା ବନ୍ଦ କରୁଥିବା ଟ୍ୟାଗ ମିଳିଲା, ଯେମିତି `</`

parse-attribute-value-unquoted = ଗୁଣ ମୂଲ୍ୟ ଉଦ୍ଧୃତି ଚିହ୍ନ ଭିତରେ ରହିବା ଆବଶ୍ୟକ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = ଅବୈଧ DoenetML: `{ $tag }` ବନ୍ଦ କରୁଥିବା ଟ୍ୟାଗ ମିଳିଲା, କିନ୍ତୁ ଏହାର ଖୋଲୁଥିବା ଟ୍ୟାଗ ନାହିଁ

parse-close-tag-mismatched = ଅବୈଧ DoenetML: ବନ୍ଦ କରୁଥିବା ଟ୍ୟାଗ ମେଳ ଖାଉ ନାହିଁ। `</{ $expected }>` ଆଶା କରାଯାଉଥିଲା। `{ $found }` ମିଳିଲା

parser-node-unconvertible = { $node } ନୋଡକୁ Dast ନୋଡରେ ରୂପାନ୍ତର କରାଯାଇପାରିଲା ନାହିଁ।

## Names

name-attribute-invalid =
    ଅବୈଧ ଗୁଣ name='{ $name }'। { $reason ->
        [characters] ନାମରେ କେବଳ ଅକ୍ଷର, ଅଙ୍କ, ଅଣ୍ଡରସ୍କୋର କିମ୍ବା ଡ୍ୟାସ ରହିପାରେ।
       *[start] ନାମ ଏକ ଅକ୍ଷରରୁ ଆରମ୍ଭ ହେବା ଆବଶ୍ୟକ।
    }

component-name-invalid-start = ଅବୈଧ ଉପାଦାନ ନାମ "{ $name }"। ନାମ ଏକ ଅକ୍ଷରରୁ ଆରମ୍ଭ ହେବା ଆବଶ୍ୟକ।

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched ପ୍ରକାରର ଉତ୍ତର ପାଖରେ ଏକ video ଗୁଣ ରହିବା ଆବଶ୍ୟକ

answer-video-watched-video-not-reference = videoWatched ପ୍ରକାରର ଉତ୍ତରର video ଗୁଣ ଏକ ସନ୍ଦର୍ଭ ହେବା ଆବଶ୍ୟକ

answer-name-not-single-text = ଉତ୍ତରର name ଗୁଣରେ କେବଳ ଗୋଟିଏ text ଶିଶୁ ଉପାଦାନ ରହିବା ଆବଶ୍ୟକ

## Referencing another document

external-doenetml-recursion-limit = ବହୁତ ଅଧିକ ସ୍ତରର ପୁନରାବୃତ୍ତି କାରଣରୁ ବାହ୍ୟ DoenetML ଆଣି ହେଲା ନାହିଁ। କୌଣସି ଚକ୍ରୀୟ ସନ୍ଦର୍ଭ ଅଛି କି?

external-doenetml-unavailable = { $attribute }="{ $uri }" ରୁ DoenetML ଆଣି ହେଲା ନାହିଁ

external-doenetml-type-mismatch = { $attribute }="{ $uri }" ରୁ ମିଳିଥିବା DoenetML ଅବୈଧ: ଏହା "{ $componentType }" ଉପାଦାନ ପ୍ରକାର ସହ ମେଳ ଖାଇଲା ନାହିଁ

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` ଗୁଣ ବନ୍ଦ ହେଉଛି; ଏହା ବଦଳରେ `{ $to }` ବ୍ୟବହାର କରନ୍ତୁ।
       *[other] [deprecation] `<{ $component }>` ଉପରେ `{ $from }` ଗୁଣ ବନ୍ଦ ହେଉଛି; ଏହା ବଦଳରେ `{ $to }` ବ୍ୟବହାର କରନ୍ତୁ।
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` ମଧ୍ୟ ଦିଆଯାଇଥିବାରୁ `{ $from }` ଗୁଣ ବନ୍ଦ ହେଉଛି ଓ ଅଣଦେଖା କରାଯାଉଛି।
       *[other] [deprecation] `{ $to }` ମଧ୍ୟ ଦିଆଯାଇଥିବାରୁ `<{ $component }>` ଉପରେ `{ $from }` ଗୁଣ ବନ୍ଦ ହେଉଛି ଓ ଅଣଦେଖା କରାଯାଉଛି।
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` ଉପରେ `{ $attribute }` ଗୁଣ ବନ୍ଦ ହେଉଛି ଓ ଅଣଦେଖା କରାଯାଉଛି।


## Language coverage

pluralize-english-only = `<pluralize>` କେବଳ ଇଂରାଜୀର ବହୁବଚନ କରିପାରେ, ତେଣୁ { $locale } ଭାଷାରେ ଲେଖା ଦଲିଲରେ ଏହାର ଲେଖା ଅପରିବର୍ତ୍ତିତ ରହେ। ବହୁବଚନ ରୂପ ସିଧାସଳଖ ଲେଖନ୍ତୁ, କିମ୍ବା `pluralForm` ଗୁଣ ଦ୍ୱାରା ସେଟ କରନ୍ତୁ।


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` ଏକ ଚିହ୍ନିତ Doenet ଉପାଦାନ ନୁହେଁ।

schema-element-not-allowed-at-root = ଦଲିଲର ମୂଳରେ `<{ $tag }>` ଉପାଦାନର ଅନୁମତି ନାହିଁ।

schema-element-not-allowed-inside = `<{ $parent }>` ଭିତରେ `<{ $tag }>` ଉପାଦାନର ଅନୁମତି ନାହିଁ।

schema-attribute-unrecognized = `<{ $tag }>` ଉପାଦାନରେ `{ $attribute }` ନାମର ଗୁଣ ନାହିଁ।

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` ଉପାଦାନର `{ $attribute }` ଗୁଣ ଏମିତି ଏକ ତାଲିକା ହେବା ଆବଶ୍ୟକ ଯାହାର ପ୍ରତ୍ୟେକ ପ୍ରବିଷ୍ଟି ଏଥିମଧ୍ୟରୁ ଗୋଟିଏ ହେବ: { $allowed }
       *[other] `<{ $tag }>` ଉପାଦାନର `{ $attribute }` ଗୁଣ ଏଥିମଧ୍ୟରୁ ଗୋଟିଏ ହେବା ଆବଶ୍ୟକ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select ପାଇଁ ଅବୈଧ ପ୍ରକାର ନାମ। ପ୍ରକାର ନାମ { $variantName } { $numOptions } ବିକଳ୍ପରେ ଆସୁଛି, କିନ୍ତୁ ବାଛିବାର ସଂଖ୍ୟା { $numToSelect }।

select-variant-name-without-options = select ପାଇଁ କେତେକ ପ୍ରକାର ଦିଆଯାଇଛି, କିନ୍ତୁ ସମ୍ଭାବ୍ୟ ପ୍ରକାର ନାମ ପାଇଁ କୌଣସି ବିକଳ୍ପ ଦିଆଯାଇନାହିଁ: { $variantName }।

select-variant-name-not-possible = select ପାଇଁ ଦିଆଯାଇଥିବା ପ୍ରକାର ନାମ { $variantName } ଏକ ସମ୍ଭାବ୍ୟ ପ୍ରକାର ନାମ ନୁହେଁ।

select-too-few-options = କେବଳ { $numOptions } ମଧ୍ୟରୁ { $numToSelect } ଉପାଦାନ ବଛା ଯାଇପାରିବ ନାହିଁ।

select-from-sequence-too-few-values = { $length } ଲମ୍ବର କ୍ରମରୁ { $numToSelect } ମୂଲ୍ୟ ବଛା ଯାଇପାରିବ ନାହିଁ।

select-from-sequence-indices-count-mismatch = select ପାଇଁ ଦିଆଯାଇଥିବା ସୂଚକାଙ୍କ ସଂଖ୍ୟା ବାଛିବାର ସଂଖ୍ୟା ସହ ମେଳ ଖାଇବା ଆବଶ୍ୟକ

select-from-sequence-indices-not-integers = select ପାଇଁ ଦିଆଯାଇଥିବା ସମସ୍ତ ସୂଚକାଙ୍କ ପୂର୍ଣ୍ଣସଂଖ୍ୟା ହେବା ଆବଶ୍ୟକ

select-from-sequence-index-excluded = ବାଦ ଦିଆଯାଇଥିବା selectfromsequence ସୂଚକାଙ୍କ ଦିଆଯାଇଛି

select-from-sequence-indices-excluded-combination = ବାଦ ଦିଆଯାଇଥିବା ସଂଯୋଗ ହୋଇଥିବା selectfromsequence ସୂଚକାଙ୍କ ଦିଆଯାଇଛି

select-from-sequence-coprime-not-positive-integers = ଧନାତ୍ମକ ପୂର୍ଣ୍ଣସଂଖ୍ୟା ବଛା ନଯାଉଥିବାରୁ ସହ-ମୌଳିକ ସଂଯୋଗ ବଛା ଯାଇପାରିବ ନାହିଁ।

select-from-sequence-coprime-common-factor = ସହ-ମୌଳିକ ସଂଖ୍ୟା ବଛା ଯାଇପାରିବ ନାହିଁ। ସମସ୍ତ ସମ୍ଭାବ୍ୟ ମୂଲ୍ୟର ଏକ ସାଧାରଣ ଗୁଣନୀୟକ ଅଛି। ("from" କିମ୍ବା "to" ର ଦିଆଯାଇଥିବା ମୂଲ୍ୟ "step" ସହ ସହ-ମୌଳିକ ହେବା ଆବଶ୍ୟକ।)

select-from-sequence-coprime-single-number = 1 ନଥିବା ଗୋଟିଏ ମାତ୍ର ସଂଖ୍ୟାରୁ ସହ-ମୌଳିକ ସଂଯୋଗ ବଛା ଯାଇପାରିବ ନାହିଁ।

select-from-sequence-excluded-too-many-combinations = selectFromSequence ରେ 70% ରୁ ଅଧିକ ସଂଯୋଗ ବାଦ ଦିଆଯାଇଛି

select-from-sequence-coprime-none-found = ସହ-ମୌଳିକ ସଂଖ୍ୟା ବଛା ଯାଇପାରିଲା ନାହିଁ। ସମସ୍ତ ସମ୍ଭାବ୍ୟ ମୂଲ୍ୟର ଏକ ସାଧାରଣ ଗୁଣନୀୟକ ଅଛି।

select-from-sequence-too-few-unique-values = { $numPossibleValues } ଲମ୍ବର କ୍ରମରୁ { $numToSelect } ଅନନ୍ୟ ମୂଲ୍ୟ ବଛା ଯାଇପାରିବ ନାହିଁ

select-prime-numbers-too-few-values = { $numValues } ଲମ୍ବର ମୌଳିକ ସଂଖ୍ୟା ତାଲିକାରୁ { $numToSelect } ମୂଲ୍ୟ ବଛା ଯାଇପାରିବ ନାହିଁ

select-prime-numbers-values-count-mismatch = select ପାଇଁ ଦିଆଯାଇଥିବା ମୂଲ୍ୟ ସଂଖ୍ୟା ବାଛିବାର ସଂଖ୍ୟା ସହ ମେଳ ଖାଇବା ଆବଶ୍ୟକ

select-prime-numbers-values-not-prime = select prime number ପାଇଁ ଦିଆଯାଇଥିବା ସମସ୍ତ ମୂଲ୍ୟ ମୌଳିକ ସଂଖ୍ୟା ତାଲିକାରେ ରହିବା ଆବଶ୍ୟକ

select-prime-numbers-values-excluded-combination = selectPrimeNumbers ପାଇଁ ଦିଆଯାଇଥିବା ମୂଲ୍ୟ ବାଦ ଦିଆଯାଇଥିବା ସଂଯୋଗ ଥିଲା

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ରେ 70% ରୁ ଅଧିକ ସଂଯୋଗ ବାଦ ଦିଆଯାଇଛି

select-random-combination-fluke = ଅତ୍ୟନ୍ତ ଅସମ୍ଭାବ୍ୟ ସଂଯୋଗବଶତଃ, ଅନିୟମିତ ମୂଲ୍ୟର ସଂଯୋଗ ବଛା ଯାଇପାରିଲା ନାହିଁ

select-random-value-fluke = ଅତ୍ୟନ୍ତ ଅସମ୍ଭାବ୍ୟ ସଂଯୋଗବଶତଃ, ଅନିୟମିତ ମୂଲ୍ୟ ବଛା ଯାଇପାରିଲା ନାହିଁ
