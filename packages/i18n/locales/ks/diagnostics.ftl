# Kashmiri diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Right-to-left, written in logical order. DoenetML element, attribute and
# value names stay in English exactly as written, and so does the
# `[deprecation]` marker. Kashmiri leaves a noun singular after a numeral, so
# where English separates singular from plural only in the verb the two
# branches read alike here.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] زٕ اَنٛدِم نُختہٕ دِنہٕ آمٕتؠ آسنہٕ سٕتؠ چھُ { $attributes } نظرانداز کرنہٕ یِوان
       *[other] زٕ اَنٛدِم نُختہٕ دِنہٕ آمٕتؠ آسنہٕ سٕتؠ چھِ { $attributes } نظرانداز کرنہٕ یِوان
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] اَنٛدِم نُختہٕ تہٕ درمیٲنی نُختہٕ دۄنوے دِنہٕ آمٕتؠ آسنہٕ سٕتؠ چھُ { $attributes } نظرانداز کرنہٕ یِوان
       *[other] اَنٛدِم نُختہٕ تہٕ درمیٲنی نُختہٕ دۄنوے دِنہٕ آمٕتؠ آسنہٕ سٕتؠ چھِ { $attributes } نظرانداز کرنہٕ یِوان
    }

line-segment-midpoint-offset-without-midpoint = درمیٲنی نُختہٕ ورٲے چھُ نہٕ midpointOffset کینٛہہ کران

## `<line>`

line-points-undetermined-dimensions = ناطےٕ ابعادن ہٕنٛدؠن نُختن پؠٹھہٕ نیرِتھ ریکھہ۔

line-points-too-few-dimensions = ریکھہ گژھِ کم از کم زٕ ابعادن ہٕنٛدؠن نُختن پؠٹھہٕ نیرُن۔

line-points-depend-on-variables = ریکھہ چھےٕ تِمن نُختن پؠٹھہٕ نیران یِم چھِ متغیٖرن پؠٹھ مُنحصِر: { $variables }۔

line-equation-invalid-format = متغیٖر { $variable1 } تہٕ { $variable2 } منٛز ریکھٕ مساوات ہُنٛد غلط فارمیٹ۔

## `<ray>`

ray-overprescribed-through = کِرَن چھِ through، endpoint تہٕ direction — ترؠیوے سٕتؠ طےٕ کرنہٕ آمٕتؠ۔ دِنہٕ آمُت through چھُ نظرانداز۔

ray-dimension-mismatch = کِرَنس منٛز چھُ نہٕ numDimensions میٚلان۔

## `<vector>`

vector-overprescribed-head = سَدِش چھُ head، tail تہٕ displacement — ترؠیوے سٕتؠ طےٕ کرنہٕ آمُت۔ دِنہٕ آمُت head چھُ نظرانداز۔

vector-dimension-mismatch = سَدِشَس منٛز چھُ نہٕ numDimensions میٚلان۔

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` منٛز چھُ نہٕ nearestPoint ناوٕ کہٕنٛہہ حالت متغیٖر، اَتھؠ کِنؠ ہیٚکِہ نہٕ تَتھ کُن کھؠنٛچِتھ۔

constrain-to-without-nearest-point = `<{ $component }>` منٛز چھُ نہٕ nearestPoint ناوٕ کہٕنٛہہ حالت متغیٖر، اَتھؠ کِنؠ ہیٚکِہ نہٕ تَتھ پؠٹھ پابندی کرِتھ۔

constrain-to-interior-without-nearest-point = `<{ $component }>` منٛز چھُ نہٕ nearestPoint ناوٕ کہٕنٛہہ حالت متغیٖر، اَتھؠ کِنؠ ہیٚکِہ نہٕ تَتھ اَنٛدر پابندی کرِتھ۔

## `<choiceInput>`

choice-input-label-position-ignored = غیٖر اِنلاین choiceInput خٲطرٕ چھُ labelPosition نظرانداز

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput خٲطرٕ دِنہٕ آمٕتؠ اِنڈیکس چھِ نظرانداز، کیازِکہ اِنڈیکسن ہٕنٛز تعداد چھےٕ نہٕ ژٲرِتھ فرزندن ہٕنٛزِ تعدادٕ سٕتؠ میٚلان۔

pretzel-indices-count-mismatch = problem خٲطرٕ دِنہٕ آمٕتؠ اِنڈیکس چھِ نظرانداز، کیازِکہ اِنڈیکسن ہٕنٛز تعداد چھےٕ نہٕ problem فرزندن ہٕنٛزِ تعدادٕ سٕتؠ میٚلان۔

shuffle-indices-count-mismatch = shuffle خٲطرٕ دِنہٕ آمٕتؠ اِنڈیکس چھِ نظرانداز، کیازِکہ اِنڈیکسن ہٕنٛز تعداد چھےٕ نہٕ جُزوَن ہٕنٛزِ تعدادٕ سٕتؠ میٚلان۔

indices-ignored-out-of-range = { $component } خٲطرٕ دِنہٕ آمٕتؠ اِنڈیکس چھِ نظرانداز، کیازِکہ کینٛہہ اِنڈیکس چھِ حدہٕ نیبر۔

pretzel-indices-repeated = pretzel خٲطرٕ دِنہٕ آمٕتؠ اِنڈیکس چھِ نظرانداز، کیازِکہ کینٛہہ اِنڈیکس چھِ دۄہرٲومٕتؠ۔

pretzel-circuit-first-index = circuit موڈس منٛز pretzel خٲطرٕ دِنہٕ آمٕتؠ اِنڈیکس چھِ نظرانداز، کیازِکہ گۆڑنیُک اِنڈیکس گژھِ 1 آسُن۔

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` خٲطرٕ سٹرِنٛگ فرزندن سٕتؠ کٲم کرنہٕ خٲطرٕ چھُ `type` خٲصیت دِنُن ضروٗری۔

invalid-type-defaulting-to-math = { $component } جُزوَس خٲطرٕ چھےٕ { $type } قِسم غلط۔ math، text، number یا boolean منٛزٕ اَکھ گژھِ آسُن۔ بُنیٲدی طورٕ چھُ math ہیٚنہٕ یِوان۔

string-not-valid-component-to-arrange = سٹرِنٛگ "{ $value }" چھُ نہٕ { $component } خٲطرٕ دُرُست جُز۔ نظرانداز۔

## Types and variables

invalid-type-defaulting-to-number = { $type } قِسم چھےٕ غلط، قِسم چھےٕ number کرنہٕ یِوان۔

invalid-variable-value = متغیٖرُک غلط قدر: `{ $value }`

## Variants

variant-index-must-be-number = قِسم اِنڈیکس { $index } گژھِ اَکھ عدد آسُن

variant-index-must-be-integer = قِسم اِنڈیکس { $index } گژھِ اَکھ صحیح عدد آسُن

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` چھُ نہٕ مُطلق پیمٲیش خٲطرٕ بنومُت۔ چوڑٲیی چھےٕ نِسبتی کرنہٕ یِوان۔

side-by-side-absolute-margins = `<{ $component }>` چھُ نہٕ مُطلق پیمٲیش خٲطرٕ بنومُت۔ حاشیہٕ چھِ نِسبتی کرنہٕ یِوان۔

side-by-side-no-block-child = غلط `<{ $component }>`: یَتھ منٛز گژھِ کم از کم اَکھ بلاک فرزند آسُن۔

## `<label>`

label-for-ignored-on-graphical = گرافِکی `<label>` پؠٹھ چھےٕ `for` خٲصیت نظرانداز۔

label-for-must-resolve-to-one = `<label>` پؠٹھ `for` خٲصیت گژھِ بالکل اَکھ جُز ہاوُن۔

label-for-unresolved = `<label>` پؠٹھ `for` خٲصیت ہیٚکہٕ نہٕ کہٕنٛہہ جُز ہٲوِتھ۔

label-for-answer-with-authored-inputs = `<label>` پؠٹھ `for` خٲصیت چھےٕ سٕہ `<answer>` ہاوان یَتھ منٛز چھُ لیٚکھن وٲلؠن پانہٕ اِنپُٹ لیٚکھمٕتؠ؛ اِنپُٹ ہٲوِو سیٖدٕ۔

label-for-answer-without-input = `<label>` پؠٹھ `for` خٲصیت چھےٕ سٕہ `<answer>` ہاوان یَتھ منٛز چھُ نہٕ لیبل لاگنہٕ لٲیق اِنپُٹ۔

label-for-must-reference-input-or-answer = `<label>` پؠٹھ `for` خٲصیت گژھِ کانٛہہ اِنپُٹ یا جواب ہاوُن۔

## Accessibility

accessibility-short-description-or-decorative = رسٲیی خٲطرٕ گژھِ `<{ $component }>` ہُنٛد یا تہٕ مُختصر بیان آسُن یا تَتھ گژھِ decorative وَنُن۔

accessibility-video-short-description = رسٲیی خٲطرٕ گژھِ `<video>` ہُنٛد مُختصر بیان آسُن۔

accessibility-input-short-description-or-label = رسٲیی خٲطرٕ گژھِ `<{ $component }>` ہُنٛد مُختصر بیان یا لیبل آسُن۔

accessibility-answer-input-short-description-or-label = رسٲیی خٲطرٕ گژھِ اِنپُٹ بناوَن وٲلِس `<answer>` ہُنٛد مُختصر بیان یا لیبل آسُن۔

accessibility-short-description-contains-math = مُختصر بیانَس منٛز گژھِ نہٕ `<{ $component }>` ہیوٚ ریاضی جُز آسُن۔ ریاضی لیٚکھِو لفظن منٛز۔

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] حِصٕ سُرخی متنَس خٲطرٕ چھُ { $colorName } سٕنٛد تضاد کم ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کم از کم { $threshold }:1 ضروٗری) (ڈارک موڈ)۔
       *[other] حِصٕ سُرخی متنَس خٲطرٕ چھُ { $colorName } سٕنٛد تضاد کم ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کم از کم { $threshold }:1 ضروٗری)۔
    }

## `<circle>`

circle-through-points-non-numerical = یَتھ جایہِ چھِ نہٕ نُختن ہٕنٛدؠ عددی قدر، تَتؠ چھُ نہٕ وۄنؠ تام { $count } نُختن پؠٹھہٕ نیران `<circle>` بنومُت۔

circle-too-many-through-points = ترؠن کھۄتہٕ زیادٕ نُختن پؠٹھہٕ نیران دٲیرٕ ہیٚکِہ نہٕ گٔنِتھ یِتھ۔

circle-overprescribed-radius-center-points = دِنہٕ آمٕتؠ نِصف قُطر، مرکز تہٕ نُختہٕ — ترؠیوے سٕتؠ ہیٚکِہ نہٕ دٲیرٕ گٔنِتھ یِتھ۔

circle-center-with-multiple-points = دِنہٕ آمٕتِس مرکزس سٕتؠ اَکہٕ کھۄتہٕ زیادٕ نُختن پؠٹھہٕ نیران دٲیرٕ ہیٚکِہ نہٕ گٔنِتھ یِتھ۔

circle-radius-too-small = دٲیرٕ ہیٚکِہ نہٕ گٔنِتھ یِتھ: زٕ نُختن دَرمیان دوٗری چھےٕ { $distance }، اَتھؠ کِنؠ چھُ دِنہٕ آمُت نِصف قُطر { $radius } واریاہ لۆکُٹ۔

circle-radius-with-many-points = دِنہٕ آمٕتِس نِصف قُطرَس سٕتؠ زٕن کھۄتہٕ زیادٕ نُختن پؠٹھہٕ نیران دٲیرٕ ہیٚکِہ نہٕ بنِتھ۔

circle-invalid-center-or-through-points = دٲیرُک غلط مرکز یا نُختہٕ۔

circle-radius-center-with-multiple-points = دِنہٕ آمٕتِس مرکزس سٕتؠ اَکہٕ کھۄتہٕ زیادٕ نُختن پؠٹھہٕ نیران دٲیرُک نِصف قُطر ہیٚکِہ نہٕ گٔنِتھ یِتھ۔

circle-change-radius-non-numerical = غیٖر عددی نُختن پؠٹھہٕ نیران دٲیرُک نِصف قُطر ہیٚکِہ نہٕ بدلِتھ یِتھ

circle-radius-with-points-non-numerical = عددی قدر ورٲے چھُ دِنہٕ آمٕتِس نِصف قُطرَس سٕتؠ اَکہٕ کھۄتہٕ زیادٕ نُختن پؠٹھہٕ نیران دٲیرٕ ہیٚکِہ نہٕ بنِتھ۔

circle-change-center-non-numerical = غیٖر عددی قدرن ہٕنٛدؠن نُختن پؠٹھہٕ نیران دٲیرُک مرکز بدلُن چھُ نہٕ وۄنؠ تام بنومُت۔

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] فَلَنَس ہٕنٛدِس دائرٕ کارَس خٲطرٕ چھِ ابعاد کم۔ دائرٕ کارَس منٛز چھُ { $intervals } وقفہٕ مگر فَلَنَس منٛز چھِ { $inputs ->
            [one] { $inputs } اِنپُٹ
           *[other] { $inputs } اِنپُٹ
        }۔
       *[other] فَلَنَس ہٕنٛدِس دائرٕ کارَس خٲطرٕ چھِ ابعاد کم۔ دائرٕ کارَس منٛز چھِ { $intervals } وقفہٕ مگر فَلَنَس منٛز چھِ { $inputs ->
            [one] { $inputs } اِنپُٹ
           *[other] { $inputs } اِنپُٹ
        }۔
    }

function-domain-invalid-format = فَلَنَس ہٕنٛدِس دائرٕ کارُک غلط فارمیٹ۔

function-ignoring-non-numerical =
    { $type ->
        [maximum] فَلَنُک غیٖر عددی زیادٕ کھۄتہٕ زیادٕ قدر چھُ نظرانداز۔
        [minimum] فَلَنُک غیٖر عددی کم از کم قدر چھُ نظرانداز۔
        [extremum] فَلَنُک غیٖر عددی اِنتہٲیی قدر چھُ نظرانداز۔
        [point] فَلَنُک غیٖر عددی نُختہٕ چھُ نظرانداز۔
        [slope] فَلَنُک غیٖر عددی ڈھلان چھُ نظرانداز۔
       *[other] فَلَنُک غیٖر عددی { $type } چھُ نظرانداز۔
    }

function-ignoring-empty =
    { $type ->
        [maximum] فَلَنُک خٲلی زیادٕ کھۄتہٕ زیادٕ قدر چھُ نظرانداز۔
        [minimum] فَلَنُک خٲلی کم از کم قدر چھُ نظرانداز۔
        [extremum] فَلَنُک خٲلی اِنتہٲیی قدر چھُ نظرانداز۔
        [point] فَلَنُک خٲلی نُختہٕ چھُ نظرانداز۔
       *[other] فَلَنُک خٲلی { $type } چھُ نظرانداز۔
    }

function-points-too-close = فَلَنَس منٛز چھِ زٕ نُختہٕ واریاہ نزدیٖک۔ فَلَن ہیٚکِہ نہٕ طےٕ کرِتھ یِتھ۔

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] فَلَن اعادٕ چھِ صِرف تَوٲ ممکِن یٕلہ اِنپُٹن ہٕنٛز تعداد آؤٹپُٹن ہٕنٛزِ تعدادٕ سٕتؠ برابر آسہِ۔ یَتھ فَلَنَس منٛز چھِ { $inputs } اِنپُٹ تہٕ { $outputs ->
            [one] { $outputs } آؤٹپُٹ
           *[other] { $outputs } آؤٹپُٹ
        }۔
       *[other] فَلَن اعادٕ چھِ صِرف تَوٲ ممکِن یٕلہ اِنپُٹن ہٕنٛز تعداد آؤٹپُٹن ہٕنٛزِ تعدادٕ سٕتؠ برابر آسہِ۔ یَتھ فَلَنَس منٛز چھِ { $inputs } اِنپُٹ تہٕ { $outputs ->
            [one] { $outputs } آؤٹپُٹ
           *[other] { $outputs } آؤٹپُٹ
        }۔
    }

## `<sequence>`

sequence-invalid-length = تسلسلُک غلط طوٗل۔ گژھِ اَکھ غیٖر منفی صحیح عدد آسُن۔

sequence-invalid-step = تسلسلُک غلط قدم۔ { $type } قِسمُک تسلسل خٲطرٕ گژھِ اَکھ عدد آسُن۔

sequence-invalid-endpoint-number = عددی تسلسلُک غلط "{ $attribute }"۔ گژھِ اَکھ عدد آسُن۔

sequence-invalid-endpoint-letters = حرفی تسلسلُک غلط "{ $attribute }"۔ گژھِ حرفن ہُنٛد مجموٗعہٕ آسُن۔

sequence-invalid-endpoint = تسلسلُک غلط "{ $attribute }"۔

select-from-sequence-coprime-not-numbers = عدد چھِ نہٕ ژارنہٕ یِوان، اَتھؠ کِنؠ چھُ coprime نظرانداز

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations چھُ دِنہٕ آمُت، اَتھؠ کِنؠ چھُ coprime نظرانداز

## Resolving a `target`

target-not-found = `<{ $source }>` خٲطرٕ غلط ہدف: ہدف نہٕ لَبۆو۔

target-state-variable-not-found = `<{ $source }>` خٲطرٕ غلط ہدف: `<{ $component }>` پؠٹھ چھُ نہٕ "{ $property }" ناوٕ حالت متغیٖر لَبنہٕ آمُت۔

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` ہٕنٛدؠ متغیٖر گژھِن آزاد متغیٖرٕ کھۄتہٕ الگ آسُن۔

ode-system-duplicate-variable-names = دۄہرٲومٕتؠن تٲبِع متغیٖر ناون سٕتؠ ہیٚکِن نہٕ ODE RHS فَلَن طےٕ کرِتھ یِتھ۔

ode-system-rhs-function-error = ODE RHS فَلَن ہیٚکِہ نہٕ طےٕ کرِتھ یِتھ۔ mathjs فَلَن بناونس منٛز غلطی۔

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } ریکھن دَرمیان ہیٚکِہ نہٕ زٲوِیہٕ طےٕ کرِتھ یِتھ

angle-invalid-through-point = `<angle>` سٕنٛدِس through منٛز غلط نُختہٕ

parabola-vertex-too-many-points = چوٹِس سٕتؠ اَکہٕ کھۄتہٕ زیادٕ نُختن پؠٹھہٕ نیران پَروَلَے چھُ نہٕ وۄنؠ تام بنومُت۔

parabola-too-many-points = ترؠن کھۄتہٕ زیادٕ نُختن پؠٹھہٕ نیران پَروَلَے چھُ نہٕ وۄنؠ تام بنومُت۔

intersection-too-many-items = زٕن کھۄتہٕ زیادٕ چیٖزن ہُنٛد قطع چھُ نہٕ وۄنؠ تام بنومُت

## Other math components

ionic-compound-not-two-ions = زٕ آیٕن ورٲے بیٚیہِ کیٚنٛہہ خٲطرٕ چھُ نہٕ وۄنؠ تام آیٕنِک مُرکب بنومُت۔

ionic-compound-needs-cation-and-anion = آیٕنِک مُرکب چھُ صِرف اَکِس کیٹایٕنَس تہٕ اَکِس اینایٕنَس خٲطرٕ بنومُت۔

solve-equations-cannot-evaluate = مساواتُک قدر ہیٚکہٕ نہٕ کڈِتھ، اَتھؠ کِنؠ ہیٚکِہ نہٕ تِہ حل کرِتھ یِتھ: { $equation }

math-operators-operand-number-required = ریاضی عامِل کڈنہٕ خٲطرٕ چھُ operandNumber دِنُن ضروٗری۔

eigen-decomposition-failed = میٹرِکسُک آیگَن قدر ہیٚکہٕ نہٕ گٔنِتھ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: پیرامیٹر { $parameters } چھُ نہٕ نموٗنس منٛز، اَتھؠ کِنؠ میٚلِہ سُہ ہمیشہ خٲلی سٕتؠ۔
       *[other] `<matchesPattern>`: پیرامیٹر { $parameters } چھِ نہٕ نموٗنس منٛز، اَتھؠ کِنؠ میٚلَن تِم ہمیشہ خٲلی سٕتؠ۔
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ہیٚکہٕ نہٕ سَمجِھتھ۔ یِہ گژھِ none، medium، dense، یا خٲلی جایہٕ سٕتؠ الگ کرنہٕ آمٕتؠ زٕ مثبت عدد آسُن، مثلن grid="1 0.5"۔ کہٕنٛہہ جال چھُ نہٕ کڈنہٕ آمُت۔

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure ہاوَن وٲلِس منٛز چھُ نہٕ xLabelPosition="left" چالوٗ؛ right ہُنٛد رویہٕ چھُ ہیٚنہٕ یِوان۔

prefigure-y-label-position-unsupported = `<graph>`: prefigure ہاوَن وٲلِس منٛز چھُ نہٕ yLabelPosition="bottom" چالوٗ؛ top ہُنٛد رویہٕ چھُ ہیٚنہٕ یِوان۔

prefigure-invalid-axis-bounds = `<graph>`: prefigure تبدیٖلی خٲطرٕ غلط محور حد؛ بُنیٲدی bbox (-10,-10,10,10) چھُ ہیٚنہٕ یِوان۔

prefigure-invalid-width = `<graph>`: prefigure تبدیٖلی خٲطرٕ غلط چوڑٲیی؛ بُنیٲدی خٲکہٕ چوڑٲیی 425 چھےٕ ہیٚنہٕ یِوان۔

prefigure-invalid-aspect-ratio = `<graph>`: prefigure تبدیٖلی خٲطرٕ غلط aspectRatio؛ بُنیٲدی تناسُب 1 چھُ ہیٚنہٕ یِوان۔

prefigure-grid-spacing-too-fine = `<graph>`: محور حدن خٲطرٕ چھےٕ جالٕچ دوٗری واریاہ باریٖک؛ prefigure ہاوَن وٲلِس منٛز چھُ جال ترٲوِتھ یِوان۔

prefigure-annotations-not-rendered = `<graph>`: PreFigure ہاوَن وول ورٲے چھِ نہٕ نوٹ کڈنہٕ یِوان۔

multiple-annotations-children = `<graph>` منٛز آیہٕ زیادٕ `<annotations>` فرزند لبنہٕ؛ اَنٛدِمِس ورٲے چھِ سٲری نظرانداز۔

## Referring to other components

copy-unrecognized-component-type = ناواقِف جُز قِسم ہیٚکِہ نہٕ بڑٲوِتھ یا نقل کرِتھ یِتھ: { $type }۔

copy-prop-not-found = { $component } قِسمُک جُزوَس پؠٹھ چھُ نہٕ { $property } خٲصیت لَبنہٕ آمُت

collect-no-source = collect خٲطرٕ چھُ نہٕ کہٕنٛہہ ماخذ لَبنہٕ آمُت۔

collect-invalid-component-type = `<{ $component }>` قِسمُک جُز ہیٚکِہ نہٕ کٹھؠ کرِتھ یِتھ، کیازِکہ یِہ چھےٕ غلط جُز قِسم۔

reference-index-unavailable = اِنڈیکس `{ $reference }` ہیٚکِہ نہٕ حوالہٕ دِتھ یِتھ

## `<callAction>`

component-action-unavailable = جُز `{ $reference }` پؠٹھ ہیٚکِہ نہٕ { $action } چلٲوِتھ یِتھ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ڈیٹا ہُنٛد شکل چھےٕ غلط۔ قطارن ہٕنٛدؠ طوٗل چھِ نہٕ میٚلان۔ componentIdx :{ $componentIdx } منٛز لَبۆو

data-frame-duplicate-column-names = ڈیٹس منٛز چھِ دۄہرٲومٕتؠ ستوٗن ناو۔ componentIdx :{ $componentIdx } منٛز لَبۆو

data-frame-missing-column-name = ڈیٹس منٛز چھُ نہٕ اَکھ ستوٗن ناو۔ componentIdx :{ $componentIdx } منٛز لَبۆو

## `<answer>` and scoring

answer-award-depends-on-own-response = یَتھ جوابُک اَکھ award چھُ یَمِس answer ٹیگَس ہٕنٛدِس پننِس بیٖجِمٕتِس جوابس پؠٹھ مُنحصِر، یَمؠ سٕتؠ گژھِ غیٖر متوقع رویہٕ۔

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` وٲلِس ظرفَس اَنٛدر آسَن وٲلِس `<answer>` پؠٹھ چھُ نہٕ `maxNumAttempts` دِنُک کینٛہہ اثر، کیازِکہ کوشِشن ہٕنٛز تعداد چھےٕ ظرف کنٹرول کران۔ `maxNumAttempts` دِیُو ظرفَس پؠٹھ۔

nested-section-wide-check-work-max-num-attempts = بیٚیہِ `sectionWideCheckWork` ظرفَس اَنٛدر آسَن وٲلِس `sectionWideCheckWork` ظرفَس پؠٹھ چھُ نہٕ `maxNumAttempts` دِنُک کینٛہہ اثر، کیازِکہ کوشِشن ہٕنٛز تعداد چھےٕ نیبرِم ظرف کنٹرول کران۔ `maxNumAttempts` دِیُو نیبرِمِس ظرفَس پؠٹھ۔

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality ورٲے گژھِ نہٕ { $attributes } خٲصیتُک کینٛہہ اثر۔
       *[other] symbolicEquality ورٲے گژھِ نہٕ { $attributes } خٲصیتن ہُنٛد کینٛہہ اثر۔
    }

answer-invalid-type = جوابس خٲطرٕ غلط قِسم: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` جُزوَس چھُ نہٕ ناو، اَتھؠ کِنؠ ہیٚکِہ نہٕ سُہ module خٲصیتٕ ہیٚنٛز صوٗرتس منٛز اِستعمال کرِتھ یِتھ

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` جُز ہیٚکِہ نہٕ module سٕنٛز خٲصیت بنِتھ، کیازِکہ `<module>` جُز قِسمس منٛز چھےٕ "{ $name }" خٲصیت پرٛٲنؠ طےٕ۔

conditional-content-condition-ignored = case یا else فرزندن وٲلِس `<conditionalContent>` جُزوَس پؠٹھ چھےٕ `condition` خٲصیت نظرانداز۔

slider-markers-type-mismatch = نِشانن ہٕنٛز قِسم چھےٕ نہٕ slider سٕنٛزِ قِسمہٕ سٕتؠ میٚلان۔

pretzel-problem-needs-statement-and-answer = غلط pretzel: پرٛتھ `<problem>` منٛز گژھِ اَکھ `<statement>` تہٕ اَکھ `<answer>` آسُن۔

pretzel-circuit-first-problem-distractor = غلط pretzel: mode="circuit" منٛز ہیٚکِہ نہٕ گۆڑنیُک `<problem>` بھٹکاوَن وول آسِتھ۔

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` خٲصیت خٲطرٕ غلط قدر { $values }؛ نظرانداز۔
       *[other] `{ $attribute }` خٲصیت خٲطرٕ غلط قدر { $values }؛ نظرانداز۔
    }

attribute-must-be-references = `{ $attribute }` خٲصیت خٲطرٕ چھُ `{ $value }` غلط قدر۔ خٲصیت گژھِ تِمن حوالن سٕتؠ بنُن یِم `$` سٕتؠ چھِ شُروٗع گژھان۔

math-input-invalid-function-names = <mathInput>: { $attribute } منٛز غلط فَلَن ناو نظرانداز: { $names }۔ پرٛتھ ناوٕ سٕنٛد ہاوَنُک حِصہٕ گژھِ کم از کم زٕ حرفن ہُنٛد آسُن (حرف یا ڈیش)؛ تَتھ پَتہٕ ہیٚکہٕ `|<mathspeak alternative>` لاگِتھ۔

## Building components from the source

component-type-invalid = غلط جُز قِسم: `<{ $componentType }>`

attribute-repeated = خٲصیت { $attribute } ہیٚکِہ نہٕ دۄہرٲوِتھ یِتھ۔

attribute-invalid-for-component = `<{ $componentType }>` قِسمٕ کِس جُزوَس خٲطرٕ چھےٕ "{ $attribute }" خٲصیت غلط۔

## Style definition contrast

style-definition-insufficient-contrast =
    انداز تعریٖف { $styleNumber } منٛز چھُ { $context ->
        [text-on-background] پؠٹھ بوٗن رنٛگَس برونٛہہ کنہِ متن رنٛگُک
        [high-contrast] کینوسس برونٛہہ کنہِ زیادٕ تضاد رنٛگُک
        [line] کینوسس برونٛہہ کنہِ ریکھہ رنٛگُک
        [marker] کینوسس برونٛہہ کنہِ نِشان رنٛگُک
       *[text-on-canvas] کینوسس برونٛہہ کنہِ متن رنٛگُک
    } تضاد کم{ $mode ->
        [dark] { " (ڈارک موڈ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کم از کم { $threshold }:1 ضروٗری)۔

style-definition-dark-mode-text-background-contrast =
    اگرچہٕ انداز تعریٖف { $styleNumber } منٛز دِنہٕ آمٕتؠ رنٛگ چھِ لائٹ موڈ خٲطرٕ کٲفی تضاد دِوان، تَمؠ پؠٹھہٕ بنٕمٕتؠن ڈارک موڈ رنٛگن منٛز چھُ پؠٹھ بوٗن رنٛگَس برونٛہہ کنہِ متن رنٛگُک تضاد کم ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کم از کم { $threshold }:1 ضروٗری)۔ { $suggestion ->
        [available] ڈارک موڈس منٛز کٲفی تضاد خٲطرٕ یا تہٕ لائٹ موڈُک تضاد بڑٲوِو (مثلن { $lightAttribute }="{ $lightColor }")، یا ڈارک موڈُک رنٛگ پانہٕ دِیُو (مثلن { $darkAttribute }="{ $darkColor }")۔
       *[none] ڈارک موڈس منٛز کٲفی تضاد خٲطرٕ لائٹ موڈُک تضاد بڑٲوِو، یا بنٕمٕتؠ رنٛگ textColorDarkMode تہٕ/یا backgroundColorDarkMode سٕتؠ پانہٕ دِیُو۔
    }

style-definition-dark-mode-text-canvas-contrast =
    اگرچہٕ انداز تعریٖف { $styleNumber } منٛز دِنہٕ آمُت متن رنٛگ چھُ لائٹ موڈ خٲطرٕ کٲفی تضاد دِوان، تَمؠ پؠٹھہٕ بنٕمٕتِس ڈارک موڈ متن رنٛگَس چھُ کینوسس برونٛہہ کنہِ تضاد کم ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کم از کم { $threshold }:1 ضروٗری)۔ { $suggestion ->
        [available] ڈارک موڈس منٛز کٲفی تضاد خٲطرٕ یا تہٕ لائٹ موڈُک تضاد بڑٲوِو (مثلن textColor="{ $lightColor }")، یا ڈارک موڈُک رنٛگ پانہٕ دِیُو (مثلن textColorDarkMode="{ $darkColor }")۔
       *[none] ڈارک موڈس منٛز کٲفی تضاد خٲطرٕ لائٹ موڈُک تضاد بڑٲوِو، یا بنٕمُت رنٛگ textColorDarkMode سٕتؠ پانہٕ دِیُو۔
    }

section-multiple-style-palettes = اَکھ حِصہٕ ہیٚکِہ صِرف اَکھ <stylePalette> ژٲرِتھ؛ اَنٛدِم چھُ ہیٚنہٕ یِوان۔

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } ہٕنٛزؠ منفرد قِسمہٕ ہیٚکِن نہٕ طےٕ کرِتھ یِتھ، کیازِکہ numToSelect چھُ نہٕ غیٖر منفی صحیح عدد۔

variant-num-to-select-not-constant-number = { $component } ہٕنٛزؠ منفرد قِسمہٕ ہیٚکِن نہٕ طےٕ کرِتھ یِتھ، کیازِکہ numToSelect چھُ نہٕ مُستقِل عدد۔

variant-with-replacement-not-constant-boolean = { $component } ہٕنٛزؠ منفرد قِسمہٕ ہیٚکِن نہٕ طےٕ کرِتھ یِتھ، کیازِکہ withReplacement چھُ نہٕ مُستقِل بوٗلیَن۔

variant-select-weight-disables-unique = اگر کانٛہہ آپشنس منٛز چھُ selectWeight یا selectForVariants دِنہٕ آمُت تہٕ گژھِن select ہٕنٛزؠ منفرد قِسمہٕ بند

variant-coprime-undetermined = { $component } ہٕنٛزؠ منفرد قِسمہٕ ہیٚکِن نہٕ طےٕ کرِتھ یِتھ، کیازِکہ coprime چھُ ہمیشہ غلط — یِہ ہیٚکہٕ نہٕ طےٕ کرِتھ۔

variant-attribute-not-constant = { $component } ہٕنٛزؠ منفرد قِسمہٕ ہیٚکِن نہٕ طےٕ کرِتھ یِتھ، کیازِکہ { $attribute } چھُ نہٕ مُستقِل۔

variant-attribute-not-number = { $component } ہٕنٛزؠ منفرد قِسمہٕ ہیٚکِن نہٕ طےٕ کرِتھ یِتھ، کیازِکہ { $attribute } چھُ نہٕ عدد۔

variant-attribute-wrong-type-for-sequence =
    { $type } قِسمٕ کؠن { $component } ہٕنٛزؠ منفرد قِسمہٕ ہیٚکِن نہٕ طےٕ کرِتھ یِتھ، کیازِکہ { $attribute } چھُ نہٕ { $expected ->
        [letters-combination] حرفن ہُنٛد مجموٗعہٕ
        [math-expression] دُرُست ریاضی اِظہار
        [integer] صحیح عدد
       *[number] عدد
    }۔

variant-length-not-integer = { $component } ہٕنٛزؠ منفرد قِسمہٕ ہیٚکِن نہٕ طےٕ کرِتھ یِتھ، کیازِکہ length چھُ نہٕ صحیح عدد۔

variant-sort-not-implemented = sort وٲلِس { $component } ہٕنٛزؠ منفرد قِسمہٕ چھِ نہٕ وۄنؠ تام بنٕمٕتؠ

variant-exclude-combinations-not-implemented = excludeCombinations وٲلِس { $component } ہٕنٛزؠ منفرد قِسمہٕ چھِ نہٕ وۄنؠ تام بنٕمٕتؠ

variant-math-exclude-not-implemented = exclude وٲلِس math قِسمٕ کِس { $component } ہٕنٛزؠ منفرد قِسمہٕ چھِ نہٕ وۄنؠ تام بنٕمٕتؠ

variant-non-constant-exclude-not-implemented = غیٖر مُستقِل exclude وٲلِس { $component } ہٕنٛزؠ منفرد قِسمہٕ چھِ نہٕ وۄنؠ تام بنٕمٕتؠ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure ہاوَن وٲلِس منٛز چھُ نہٕ چالوٗ؛ اولاد ترٲوِنہٕ آیہٕ۔

prefigure-descendant-invalid-geometry = { $subject }: غیٖر محدوٗد یا نامُکمل ہندسہٕ؛ اولاد ترٲوِنہٕ آیہٕ۔

prefigure-curve-label-omitted = { $subject }: تبدیٖل کرنہٕ آمٕتؠن ژھۄکٕ جُزوَن پؠٹھ چھِ نہٕ لیبل چالوٗ؛ لیبل ترٲوِنہٕ آو۔

prefigure-curve-unsupported-definition-type = { $subject }: ژھۄکٕ فَلَن تعریٖف قِسم '{ $definitionType }' چھُ نہٕ چالوٗ؛ اولاد ترٲوِنہٕ آیہٕ۔

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves پؠٹھ چھےٕ نہٕ flipFunctions خٲصیت چالوٗ؛ اولاد ترٲوِنہٕ آیہٕ۔

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves پؠٹھ چھِ صِرف formula قِسمٕ کؠ فرزند فَلَن چالوٗ؛ اولاد ترٲوِنہٕ آیہٕ۔

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] ریکھہ خٲندانُک لیبل
       *[point] نُختہٕ لیبل
    } خٲطرٕ چھُ نہٕ labelPosition '{ $labelPosition }' چالوٗ؛ بُنیٲدی PreFigure ترتیٖب ہیٚنہٕ آیہٕ۔

prefigure-fill-style-unsupported = { $subject }: بھرَن انداز '{ $fillStyle }' چھُ نہٕ PreFigure منٛز چالوٗ؛ ٹھوس بھرَن ہیٚنہٕ آو۔

prefigure-line-style-unknown = { $subject }: ناواقِف ریکھہ انداز '{ $lineStyle }' PreFigure نتیجہٕ پؠٹھہٕ ترٲوِنہٕ آو۔

prefigure-marker-style-mapped-to-diamond = { $subject }: نِشان انداز '{ $markerStyle }' PreFigure سٕنٛدِس 'diamond' اندازس منٛز بدلاونہٕ آو۔

prefigure-marker-style-unsupported = { $subject }: نِشان انداز '{ $markerStyle }' چھُ نہٕ PreFigure منٛز چالوٗ؛ بُنیٲدی انداز ہیٚنہٕ آو۔

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: غلط `ref`؛ ہدف نہٕ لَبۆو۔ نوٹ ترٲوِنہٕ آو۔

annotation-ref-multiple-targets = `<annotation>`: `ref` پؠٹھہٕ لَبؠ زیادٕ ہدف؛ گۆڑنیُک ہدف ہیٚنہٕ آو۔

annotation-ref-outside-graph = `<annotation>`: غلط `ref`؛ ہدف چھُ تَتھ graph نیبر۔ نوٹ ترٲوِنہٕ آو۔

annotation-ref-unsupported-target = `<annotation>`: غلط `ref`؛ prefigure تبدیٖلی منٛز چھُ نہٕ ہدف چالوٗ گرافِکی چیٖز۔ نوٹ ترٲوِنہٕ آو۔

annotation-text-missing = `<annotation>`: `text` چھُ نہٕ یا چھُ خٲلی؛ خٲلی متن دِنہٕ آو۔

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] دائرَوی اِنحصار لَبۆو۔
       *[other] `<{ $componentType }>` جُزوَس سٕتؠ دائرَوی اِنحصار لَبۆو۔
    }

reference-no-referent = حوالس ہُنٛد کہٕنٛہہ ہدف نہٕ لَبۆو: `{ $reference }`

reference-multiple-referents = حوالس ہٕنٛد زیادٕ ہدف لَبؠ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` سٕنٛزِ { $attribute } خٲصیتُک غلط فارمیٹ۔

children-invalid = `<{ $componentType }>` خٲطرٕ غلط فرزند: غلط فرزند لَبؠ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` خٲصیت خٲطرٕ چھُ `{ $value }` غلط قدر، `{ $default }` قدر چھُ ہیٚنہٕ یِوان

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML ورژن { $version } نہٕ لَبۆو۔
       *[other] DoenetML ورژن { $version } نہٕ لَبۆو۔ ورژن { $fallback } چھُ ہیٚنہٕ یِوان
    }

## Reading the DoenetML

parse-invalid-doenetml = غلط DoenetML: { $content }

parse-tag-missing-close-tag = غلط DoenetML: ٹیگ `{ $tag }` سٕنٛد چھُ نہٕ کہٕنٛہہ بند ٹیگ۔ پانہٕ بند گژھَن وول ٹیگ یا `</{ $tagName }>` ٹیگ چھُ ضروٗری۔

parse-tag-error = غلط DoenetML: ٹیگ `<{ $tagName }>` منٛز غلطی

parse-attribute-missing-value = غلط DoenetML: غلط خٲصیت `{ $attribute }` منٛز چھُ نہٕ قدر بوزنہٕ یِوان۔

parse-attribute-invalid = غلط DoenetML: غلط خٲصیت `{ $attribute }`

parse-attribute-value-invalid = غلط DoenetML: غلط خٲصیت قدر `{ $value }`

parse-attribute-value-quote-mismatch = غلط DoenetML: غلط خٲصیت قدر `{ $value }`۔ اِقتباس نِشان چھِ نہٕ میٚلان۔ بٲسان چھُ زِ `{ $quote }` چھُ گَمُت

parse-open-tag-name-missing = غلط DoenetML: ٹیگ ناوٕ ورٲے ٹیگ لَبۆو، مثلن `<`

parse-tag-not-closed = غلط DoenetML: ٹیگ `{ $tag }` گَو نہٕ بند (بٲسان چھُ زِ `>` چھُ گَمُت)۔

parse-self-closing-tag-name-missing = غلط DoenetML: ٹیگ ناوٕ ورٲے ٹیگ لَبۆو `<{ $content }>`

parse-self-closing-tag-not-closed = غلط DoenetML: ٹیگ `{ $tag }` گَو نہٕ بند (بٲسان چھُ زِ `/>` چھُ گَمُت)۔

parse-tag-invalid-attributes = غلط DoenetML: ٹیگ `{ $tag }` چھُ نہٕ دُرُست۔ اَمؠ سٕنٛزؠ خٲصیتہٕ ہیٚکَن غلط آسِتھ۔

parse-close-tag-name-missing = غلط DoenetML: ٹیگ ناوٕ ورٲے بند ٹیگ لَبۆو، مثلن `</`

parse-attribute-value-unquoted = خٲصیتٕ قدر گژھِن اِقتباس نِشانن منٛز تھاوُن: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = غلط DoenetML: بند ٹیگ `{ $tag }` لَبۆو، مگر اَمؠ سٕنٛد چھُ نہٕ کہٕنٛہہ کھولَن وول ٹیگ

parse-close-tag-mismatched = غلط DoenetML: بند ٹیگ چھُ نہٕ میٚلان۔ `</{ $expected }>` اوس ضروٗری۔ `{ $found }` لَبۆو

parser-node-unconvertible = نوڈ { $node } ہیٚکہٕ نہٕ Dast نوڈس منٛز بدلٲوِتھ۔

## Names

name-attribute-invalid =
    غلط خٲصیت name='{ $name }'۔ { $reason ->
        [characters] ناوَن منٛز ہیٚکِن صِرف حرف، عدد، زیرِ خط یا ڈیش آسِتھ۔
       *[start] ناو گژھِن حرفہٕ سٕتؠ شُروٗع گژھُن۔
    }

component-name-invalid-start = غلط جُز ناو "{ $name }"۔ ناو گژھِن حرفہٕ سٕتؠ شُروٗع گژھُن۔

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched قِسمٕ کِس جوابس منٛز گژھِ video خٲصیت آسُن

answer-video-watched-video-not-reference = videoWatched قِسمٕ کِس جوابس ہٕنٛز video خٲصیت گژھِ اَکھ حوالہٕ آسُن

answer-name-not-single-text = جوابس ہٕنٛزِ name خٲصیتہِ منٛز گژھِ صِرف اَکھ متن فرزند آسُن

## Referencing another document

external-doenetml-recursion-limit = واریاہ زیادٕ درجن ہٕنٛدِس تکرارَس کِنؠ ہیٚکہٕ نہٕ نیبرِم DoenetML آنِتھ۔ کیا کُنہِ جایہِ چھُ دائرَوی حوالہٕ؟

external-doenetml-unavailable = { $attribute }="{ $uri }" پؠٹھہٕ ہیٚکہٕ نہٕ DoenetML آنِتھ

external-doenetml-type-mismatch = { $attribute }="{ $uri }" پؠٹھہٕ آمُت DoenetML چھُ غلط: یِہ گَو نہٕ "{ $componentType }" جُز قِسمہٕ سٕتؠ میٚلان

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] خٲصیت `{ $from }` چھےٕ ترٲوِنہٕ آمٕژ؛ اَمؠ سٕنٛدِ جایہِ لیٚکھِو `{ $to }`۔
       *[other] [deprecation] `<{ $component }>` پؠٹھ چھےٕ خٲصیت `{ $from }` ترٲوِنہٕ آمٕژ؛ اَمؠ سٕنٛدِ جایہِ لیٚکھِو `{ $to }`۔
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] خٲصیت `{ $from }` چھےٕ ترٲوِنہٕ آمٕژ تہٕ نظرانداز، کیازِکہ `{ $to }` تہِ چھُ دِنہٕ آمُت۔
       *[other] [deprecation] `<{ $component }>` پؠٹھ چھےٕ خٲصیت `{ $from }` ترٲوِنہٕ آمٕژ تہٕ نظرانداز، کیازِکہ `{ $to }` تہِ چھُ دِنہٕ آمُت۔
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` پؠٹھ چھےٕ خٲصیت `{ $attribute }` ترٲوِنہٕ آمٕژ تہٕ نظرانداز۔

deprecated-attribute-to-child = [deprecation] `<{ $component }>` پؠٹھ چھےٕ خٲصیت `{ $attribute }` ترٲوِنہٕ آمٕژ؛ اَمؠ سٕنٛدِ جایہِ لیٚکھِو `<{ $child }>` فرزند۔

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` پؠٹھ چھُ خٲصیت `{ $attribute }` ہُنٛد قدر `{ $value }` ترٲوِنہٕ آمُت؛ اَمؠ سٕنٛدِ جایہِ لیٚکھِو `{ $to }`۔


## Language coverage

pluralize-english-only = `<pluralize>` ہیٚکِہ صِرف انگریٖزی جمع بنٲوِتھ، اَتھؠ کِنؠ چھُ { $locale } منٛز لیٚکھمٕتِس دستاویزس منٛز اَمؠ سٕنٛد متن تِتھؠ پٲٹھؠ روزان۔ جمع صوٗرت لیٚکھِو سیٖدٕ، یا `pluralForm` خٲصیتہٕ سٕتؠ دِیُو۔


## Checking against the schema

schema-element-unrecognized = عنصر `<{ $tag }>` چھُ نہٕ واقِف Doenet عنصر۔

schema-element-not-allowed-at-root = عنصر `<{ $tag }>` چھُ نہٕ دستاویزٕ سٕنٛدِس جَرس پؠٹھ اِجازت یُتھ۔

schema-element-not-allowed-inside = عنصر `<{ $tag }>` چھُ نہٕ `<{ $parent }>` اَنٛدر اِجازت یُتھ۔

schema-attribute-unrecognized = عنصر `<{ $tag }>` منٛز چھےٕ نہٕ `{ $attribute }` ناوٕ کہٕنٛہہ خٲصیت۔

schema-attribute-value-not-allowed =
    { $isList ->
        [true] عنصر `<{ $tag }>` سٕنٛز `{ $attribute }` خٲصیت گژھِ تِتھؠ فہرِست آسُن یَمؠ سٕنٛد پرٛتھ چیٖز چھُ یِمَن منٛزٕ اَکھ: { $allowed }
       *[other] عنصر `<{ $tag }>` سٕنٛز `{ $attribute }` خٲصیت گژھِ یِمَن منٛزٕ اَکھ آسُن: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select خٲطرٕ غلط قِسم ناو۔ قِسم ناو { $variantName } چھُ { $numOptions } آپشنن منٛز یِوان مگر ژارنٕچ تعداد چھےٕ { $numToSelect }۔

select-variant-name-without-options = select خٲطرٕ چھِ کینٛہہ قِسمہٕ دِنہٕ آمٕتؠ مگر ممکِن قِسم ناوٕ { $variantName } خٲطرٕ چھُ نہٕ کہٕنٛہہ آپشن دِنہٕ آمُت۔

select-variant-name-not-possible = select خٲطرٕ دِنہٕ آمُت قِسم ناو { $variantName } چھُ نہٕ ممکِن قِسم ناو۔

select-too-few-options = صِرف { $numOptions } منٛزٕ ہیٚکِن نہٕ { $numToSelect } جُز ژٲرِتھ یِتھ۔

select-from-sequence-too-few-values = { $length } طوٗلٕ کِس تسلسلَس منٛزٕ ہیٚکِن نہٕ { $numToSelect } قدر ژٲرِتھ یِتھ۔

select-from-sequence-indices-count-mismatch = select خٲطرٕ دِنہٕ آمٕتؠن اِنڈیکسن ہٕنٛز تعداد گژھِ ژارنٕچ تعدادٕ سٕتؠ میٚلُن

select-from-sequence-indices-not-integers = select خٲطرٕ دِنہٕ آمٕتؠ سٲری اِنڈیکس گژھِن صحیح عدد آسُن

select-from-sequence-index-excluded = selectfromsequence سٕنٛد دِنہٕ آمُت اِنڈیکس اوس ترٲوِتھ

select-from-sequence-indices-excluded-combination = selectfromsequence سٕنٛدؠ دِنہٕ آمٕتؠ اِنڈیکس اوس ترٲومُت مجموٗعہٕ

select-from-sequence-coprime-not-positive-integers = مثبت صحیح عدد چھِ نہٕ ژارنہٕ یِوان، اَتھؠ کِنؠ ہیٚکِن نہٕ ہم اول مجموٗعہٕ ژٲرِتھ یِتھ۔

select-from-sequence-coprime-common-factor = ہم اول عدد ہیٚکِن نہٕ ژٲرِتھ یِتھ۔ سٲرِنؠ ممکِن قدرن ہُنٛد چھُ اَکھ مُشترکہٕ عامِل۔ ("from" یا "to" ہٕنٛدؠ دِنہٕ آمٕتؠ قدر گژھِن "step" سٕتؠ ہم اول آسُن۔)

select-from-sequence-coprime-single-number = 1 ورٲے کُنہِ اَکہِ عددٕ پؠٹھہٕ ہیٚکِن نہٕ ہم اول مجموٗعہٕ ژٲرِتھ یِتھ۔

select-from-sequence-excluded-too-many-combinations = selectFromSequence منٛز آیہٕ 70% کھۄتہٕ زیادٕ مجموٗعہٕ ترٲوِنہٕ

select-from-sequence-coprime-none-found = ہم اول عدد ہیٚکِن نہٕ ژٲرِتھ۔ سٲرِنؠ ممکِن قدرن ہُنٛد چھُ اَکھ مُشترکہٕ عامِل۔

select-from-sequence-too-few-unique-values = { $numPossibleValues } طوٗلٕ کِس تسلسلَس منٛزٕ ہیٚکِن نہٕ { $numToSelect } منفرد قدر ژٲرِتھ یِتھ

select-prime-numbers-too-few-values = { $numValues } طوٗلٕ کِس اول عددن ہٕنٛدِس فہرِستہٕ منٛزٕ ہیٚکِن نہٕ { $numToSelect } قدر ژٲرِتھ یِتھ

select-prime-numbers-values-count-mismatch = select خٲطرٕ دِنہٕ آمٕتؠن قدرن ہٕنٛز تعداد گژھِ ژارنٕچ تعدادٕ سٕتؠ میٚلُن

select-prime-numbers-values-not-prime = select prime number خٲطرٕ دِنہٕ آمٕتؠ سٲری قدر گژھِن اول عددن ہٕنٛدِس فہرِستس منٛز آسُن

select-prime-numbers-values-excluded-combination = selectPrimeNumbers سٕنٛدؠ دِنہٕ آمٕتؠ قدر ٲس ترٲومُت مجموٗعہٕ

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers منٛز آیہٕ 70% کھۄتہٕ زیادٕ مجموٗعہٕ ترٲوِنہٕ

select-random-combination-fluke = واریاہ ناممکِن اِتفاقٕ سٕتؠ ہیٚکہٕ نہٕ بےٕترتیٖب قدرن ہُنٛد مجموٗعہٕ ژٲرِتھ

select-random-value-fluke = واریاہ ناممکِن اِتفاقٕ سٕتؠ ہیٚکہٕ نہٕ بےٕترتیٖب قدر ژٲرِتھ
