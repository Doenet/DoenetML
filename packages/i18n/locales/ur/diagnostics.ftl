# Urdu warnings and errors. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `through`, `endpoint`, `midpointOffset`, `numDimensions` and the like are
# DoenetML attribute names. They are part of the language, not prose, and are
# left in English exactly as written.
#
# Urdu ends a sentence with «۔» and separates with «،». Brackets, quotes and
# the colon are the same characters as in English and are written
# opening-first, in logical order; the bidi algorithm turns them around when
# the text is drawn.
#
# Urdu is postpositional, so a message that in English reads "for
# `<{ $component }>`" puts its relator after the argument rather than in front
# of it, and several sentences are turned around against the English for that
# reason alone.
#
# Where English distinguishes a singular from a plural only in the verb — "is
# ignored" against "are ignored" — Urdu says one thing, and the select is
# dropped rather than written out twice identically. The count argument then
# goes unused, which is harmless: it stays in the English message for the
# languages that need it.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = جب دو نقطۂ اختتام مقرر ہوں تو { $attributes } کو نظرانداز کر دیا جاتا ہے

line-segment-attributes-ignored-with-endpoint-and-midpoint = جب ایک نقطۂ اختتام اور ایک نقطۂ وسط دونوں مقرر ہوں تو { $attributes } کو نظرانداز کر دیا جاتا ہے

line-segment-midpoint-offset-without-midpoint = نقطۂ وسط کے بغیر midpointOffset کا کوئی اثر نہیں

## `<line>`

line-points-undetermined-dimensions = ایسے نقطوں سے گزرنے والی لکیر جن کی ابعاد طے نہیں۔

line-points-too-few-dimensions = لکیر کو کم از کم دو ابعاد والے نقطوں سے گزرنا چاہیے۔

line-points-depend-on-variables = لکیر ایسے نقطوں سے گزرتی ہے جو متغیرات پر منحصر ہیں: { $variables }۔

line-equation-invalid-format = متغیرات { $variable1 } اور { $variable2 } میں لکیر کی مساوات کی ساخت نامعتبر ہے۔

## `<ray>`

ray-overprescribed-through = شعاع through، endpoint اور direction سے متعین ہے۔ مقرر کردہ through کو نظرانداز کیا جا رہا ہے۔

ray-dimension-mismatch = شعاع میں numDimensions مطابقت نہیں رکھتا۔

## `<vector>`

vector-overprescribed-head = سمتیہ head، tail اور displacement سے متعین ہے۔ مقرر کردہ head کو نظرانداز کیا جا رہا ہے۔

vector-dimension-mismatch = سمتیے میں numDimensions مطابقت نہیں رکھتا۔

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` کی طرف کھینچا نہیں جا سکتا کیونکہ اس کے پاس nearestPoint نامی حالت متغیر نہیں۔

constrain-to-without-nearest-point = `<{ $component }>` تک محدود نہیں کیا جا سکتا کیونکہ اس کے پاس nearestPoint نامی حالت متغیر نہیں۔

constrain-to-interior-without-nearest-point = `<{ $component }>` کے اندرونی حصے تک محدود نہیں کیا جا سکتا کیونکہ اس کے پاس nearestPoint نامی حالت متغیر نہیں۔

## `<choiceInput>`

choice-input-label-position-ignored = غیر سطری choiceInput میں labelPosition کو نظرانداز کر دیا جاتا ہے

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput میں مقرر کردہ indices کو نظرانداز کیا جا رہا ہے کیونکہ اشاریوں کی تعداد choice قسم کے بچوں کی تعداد سے نہیں ملتی۔

pretzel-indices-count-mismatch = problem میں مقرر کردہ indices کو نظرانداز کیا جا رہا ہے کیونکہ اشاریوں کی تعداد problem قسم کے بچوں کی تعداد سے نہیں ملتی۔

shuffle-indices-count-mismatch = shuffle میں مقرر کردہ indices کو نظرانداز کیا جا رہا ہے کیونکہ اشاریوں کی تعداد اجزا کی تعداد سے نہیں ملتی۔

indices-ignored-out-of-range = { $component } میں مقرر کردہ indices کو نظرانداز کیا جا رہا ہے کیونکہ کچھ اشاریے حد سے باہر ہیں۔

pretzel-indices-repeated = pretzel میں مقرر کردہ indices کو نظرانداز کیا جا رہا ہے کیونکہ کچھ اشاریے دہرائے گئے ہیں۔

pretzel-circuit-first-index = circuit وضع میں pretzel کے مقرر کردہ indices کو نظرانداز کیا جا رہا ہے کیونکہ پہلا اشاریہ 1 ہونا چاہیے۔

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` کو متنی بچوں کے ساتھ چلانے کے لیے type صفت مقرر کرنا ضروری ہے۔

invalid-type-defaulting-to-math = جزو { $component } کے لیے قسم { $type } نامعتبر ہے۔ یہ math، text، number یا boolean میں سے کوئی ایک ہونی چاہیے۔ math استعمال کی جا رہی ہے۔

string-not-valid-component-to-arrange = متن "{ $value }" ایسا جائز جزو نہیں جسے { $component } ترتیب دے سکے۔ اسے نظرانداز کیا جا رہا ہے۔

## Types and variables

invalid-type-defaulting-to-number = قسم { $type } نامعتبر ہے، قسم number مقرر کی جا رہی ہے۔

invalid-variable-value = کسی متغیر کی نامعتبر قیمت: `{ $value }`

## Variants

variant-index-must-be-number = نسخے کا اشاریہ { $index } ایک عدد ہونا چاہیے

variant-index-must-be-integer = نسخے کا اشاریہ { $index } صحیح عدد ہونا چاہیے

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` مطلق پیمائشوں کے لیے نافذ نہیں۔ چوڑائیاں نسبتی مقرر کی جا رہی ہیں۔

side-by-side-absolute-margins = `<{ $component }>` مطلق پیمائشوں کے لیے نافذ نہیں۔ حاشیے نسبتی مقرر کیے جا رہے ہیں۔

side-by-side-no-block-child = `<{ $component }>` نامعتبر ہے: اس میں کم از کم ایک بلاک نوعیت کا بچہ ہونا چاہیے۔

## `<label>`

label-for-ignored-on-graphical = گرافیکی `<label>` پر `for` صفت کو نظرانداز کر دیا جاتا ہے۔

label-for-must-resolve-to-one = `<label>` پر `for` صفت کو ٹھیک ایک جزو کی طرف اشارہ کرنا چاہیے۔

label-for-unresolved = `<label>` پر `for` صفت کسی جزو تک نہیں پہنچ سکی۔

label-for-answer-with-authored-inputs = `<label>` پر `for` صفت ایسے `<answer>` کی طرف اشارہ کرتی ہے جس کے اندراجات صراحتاً لکھے گئے ہیں؛ براہِ راست اندراج کی طرف اشارہ کریں۔

label-for-answer-without-input = `<label>` پر `for` صفت ایسے `<answer>` کی طرف اشارہ کرتی ہے جس کے پاس عنوان دینے کے لیے کوئی اندراج نہیں۔

label-for-must-reference-input-or-answer = `<label>` پر `for` صفت کو کسی اندراج یا کسی `<answer>` کی طرف اشارہ کرنا چاہیے۔

## Accessibility

accessibility-short-description-or-decorative = رسائی کی خاطر `<{ $component }>` کے پاس یا تو مختصر تفصیل ہونی چاہیے یا اسے زیبائشی قرار دیا جانا چاہیے۔

accessibility-video-short-description = رسائی کی خاطر `<video>` کے پاس مختصر تفصیل ہونی چاہیے۔

accessibility-input-short-description-or-label = رسائی کی خاطر `<{ $component }>` کے پاس مختصر تفصیل یا عنوان ہونا چاہیے۔

accessibility-answer-input-short-description-or-label = رسائی کی خاطر اندراج بنانے والے `<answer>` کے پاس مختصر تفصیل یا عنوان ہونا چاہیے۔

accessibility-short-description-contains-math = مختصر تفصیلات میں `<{ $component }>` جیسے ریاضیاتی اجزا نہیں ہونے چاہئیں۔ ریاضی کو لفظوں میں لکھیں۔

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] باب کے عنوان کے متن کے لیے { $colorName } کا تضاد ناکافی ہے (تاریک وضع) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کم از کم { $threshold }:1 درکار ہے)۔
       *[other] باب کے عنوان کے متن کے لیے { $colorName } کا تضاد ناکافی ہے ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کم از کم { $threshold }:1 درکار ہے)۔
    }

## `<circle>`

circle-through-points-non-numerical = جب نقطوں کی عددی قیمتیں نہ ہوں تو { $count } نقطوں سے گزرنے والا `<circle>` نافذ نہیں کیا گیا۔

circle-too-many-through-points = 3 سے زیادہ نقطوں سے گزرنے والا دائرہ شمار نہیں کیا جا سکتا۔

circle-overprescribed-radius-center-points = مقرر کردہ نصف قطر، مرکز اور گزرنے والے نقطوں کے ساتھ دائرہ شمار نہیں کیا جا سکتا۔

circle-center-with-multiple-points = مقرر کردہ مرکز کے ساتھ ایک سے زیادہ نقطے سے گزرنے والا دائرہ شمار نہیں کیا جا سکتا۔

circle-radius-too-small = دائرہ شمار نہیں کیا جا سکتا: چونکہ دونوں نقطوں کے درمیان فاصلہ { $distance } ہے، اس لیے مقرر کردہ نصف قطر { $radius } بہت چھوٹا ہے۔

circle-radius-with-many-points = مقرر کردہ نصف قطر کے ساتھ دو سے زیادہ نقطوں سے گزرنے والا دائرہ نہیں بنایا جا سکتا۔

circle-invalid-center-or-through-points = دائرے کا مرکز یا اس کے گزرنے والے نقطے نامعتبر ہیں۔

circle-radius-center-with-multiple-points = مقرر کردہ مرکز کے ساتھ ایک سے زیادہ نقطے سے گزرنے والے دائرے کا نصف قطر شمار نہیں کیا جا سکتا۔

circle-change-radius-non-numerical = غیر عددی نقطوں سے گزرنے والے دائرے کا نصف قطر تبدیل نہیں کیا جا سکتا

circle-radius-with-points-non-numerical = جب عددی قیمتیں دستیاب نہ ہوں تو مقرر کردہ نصف قطر کے ساتھ ایک سے زیادہ نقطے سے گزرنے والا دائرہ نہیں بنایا جا سکتا۔

circle-change-center-non-numerical = غیر عددی نقطوں سے گزرنے والے دائرے کا مرکز بدلنا نافذ نہیں کیا گیا۔

## `<function>`

function-domain-insufficient-dimensions = دالے کے میدان کے لیے ابعاد ناکافی ہیں۔ میدان میں { $intervals } وقفے ہیں جبکہ دالے کے { $inputs } اندراج ہیں۔

function-domain-invalid-format = دالے کے میدان کی ساخت نامعتبر ہے۔

function-ignoring-non-numerical =
    { $type ->
        [maximum] دالے کی غیر عددی زیادہ سے زیادہ قیمت نظرانداز کی جا رہی ہے۔
        [minimum] دالے کی غیر عددی کم سے کم قیمت نظرانداز کی جا رہی ہے۔
        [extremum] دالے کی غیر عددی انتہائی قیمت نظرانداز کی جا رہی ہے۔
        [point] دالے کا غیر عددی نقطہ نظرانداز کیا جا رہا ہے۔
        [slope] دالے کا غیر عددی ڈھلوان نظرانداز کیا جا رہا ہے۔
       *[other] دالے کا غیر عددی { $type } نظرانداز کیا جا رہا ہے۔
    }

function-ignoring-empty =
    { $type ->
        [maximum] دالے کی خالی زیادہ سے زیادہ قیمت نظرانداز کی جا رہی ہے۔
        [minimum] دالے کی خالی کم سے کم قیمت نظرانداز کی جا رہی ہے۔
        [extremum] دالے کی خالی انتہائی قیمت نظرانداز کی جا رہی ہے۔
        [point] دالے کا خالی نقطہ نظرانداز کیا جا رہا ہے۔
       *[other] دالے کا خالی { $type } نظرانداز کیا جا رہا ہے۔
    }

function-points-too-close = دالے میں دو ایسے نقطے ہیں جن کے مقامات بہت قریب ہیں۔ دالہ متعین نہیں کیا جا سکتا۔

function-iterates-input-output-mismatch = دالے کی تکرار تبھی ممکن ہے جب اندراج کی تعداد اخراج کی تعداد کے برابر ہو۔ اس دالے کے { $inputs } اندراج اور { $outputs } اخراج ہیں۔

## `<sequence>`

sequence-invalid-length = تسلسل کی لمبائی نامعتبر ہے۔ یہ غیر منفی صحیح عدد ہونی چاہیے۔

sequence-invalid-step = تسلسل کا قدم نامعتبر ہے۔ { $type } قسم کے تسلسل کے لیے یہ ایک عدد ہونا چاہیے۔

sequence-invalid-endpoint-number = عددی تسلسل کی "{ $attribute }" قیمت نامعتبر ہے۔ یہ ایک عدد ہونی چاہیے۔

sequence-invalid-endpoint-letters = حروف کے تسلسل کی "{ $attribute }" قیمت نامعتبر ہے۔ یہ حروف کا مجموعہ ہونی چاہیے۔

sequence-invalid-endpoint = تسلسل کی "{ $attribute }" قیمت نامعتبر ہے۔

select-from-sequence-coprime-not-numbers = coprime نظرانداز کیا گیا کیونکہ انتخاب عددوں میں سے نہیں ہو رہا

select-from-sequence-coprime-with-exclude-combinations = coprime نظرانداز کیا گیا کیونکہ excludeCombinations مقرر ہے

## Resolving a `target`

target-not-found = `<{ $source }>` میں target کی قیمت نامعتبر ہے: ہدف نہیں ملا۔

target-state-variable-not-found = `<{ $source }>` میں target کی قیمت نامعتبر ہے: `<{ $component }>` پر "{ $property }" نام کا کوئی حالت متغیر نہیں ملا۔

## `<odeSystem>`

# «دایاں طرف» is the right-hand side of the equation and stays the right one:
# mathematics is a left-to-right island inside an Urdu document, so the
# equation the phrase names is drawn the same way round as in English.
ode-system-variables-match-independent = `<odeSystem>` کے متغیرات کو آزاد متغیر سے مختلف ہونا چاہیے۔

ode-system-duplicate-variable-names = تفریقی مساوات کے دائیں طرف کے دالے دہرائے گئے تابع متغیرات کے ناموں کے ساتھ متعین نہیں کیے جا سکتے۔

ode-system-rhs-function-error = تفریقی مساوات کے دائیں طرف کا دالہ متعین نہیں کیا جا سکتا۔ mathjs دالہ بناتے ہوئے خرابی۔

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } لکیروں کے درمیان زاویہ متعین نہیں کیا جا سکتا

angle-invalid-through-point = `<angle>` کی through میں نامعتبر نقطہ

parabola-vertex-too-many-points = مقرر کردہ راس کے ساتھ ایک سے زیادہ نقطے سے گزرنے والا قطع مکافی نافذ نہیں کیا گیا۔

parabola-too-many-points = 3 سے زیادہ نقطوں سے گزرنے والا قطع مکافی نافذ نہیں کیا گیا۔

intersection-too-many-items = دو سے زیادہ اشیا کا تقاطع نافذ نہیں کیا گیا

## Other math components

ionic-compound-not-two-ions = دو آئنوں کے سوا کسی اور صورت کے لیے آئنی مرکب نافذ نہیں کیا گیا۔

ionic-compound-needs-cation-and-anion = آئنی مرکب صرف ایک کیٹائن اور ایک اینائن کے لیے نافذ ہے۔

solve-equations-cannot-evaluate = مساوات حل نہیں ہو سکی کیونکہ اس کی قدر معلوم نہیں کی جا سکی: { $equation }

math-operators-operand-number-required = ریاضیاتی عامل نکالتے وقت operandNumber مقرر کرنا ضروری ہے۔

eigen-decomposition-failed = میٹرکس کی خاص قیمتیں شمار نہیں کی جا سکیں

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: پیرامیٹر { $parameters } نمونے میں نہیں آتا، اس لیے وہ ہمیشہ ایک خالی جگہ سے مطابقت کرے گا۔
       *[other] `<matchesPattern>`: پیرامیٹر { $parameters } نمونے میں نہیں آتے، اس لیے وہ ہمیشہ ایک خالی جگہ سے مطابقت کریں گے۔
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" کا مطلب نہیں سمجھا جا سکا۔ یہ none، medium، dense، یا خالی جگہ سے جدا دو مثبت عدد ہونا چاہیے، جیسے grid="1 0.5"۔ کوئی جالی نہیں بنائی جائے گی۔

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure ناظر میں xLabelPosition="left" کی مدد نہیں؛ right مقام کا رویہ استعمال کیا جا رہا ہے۔

prefigure-y-label-position-unsupported = `<graph>`: prefigure ناظر میں yLabelPosition="bottom" کی مدد نہیں؛ top مقام کا رویہ استعمال کیا جا رہا ہے۔

prefigure-invalid-axis-bounds = `<graph>`: prefigure میں تبدیلی کے لیے محوروں کی حدود نامعتبر ہیں؛ طے شدہ bbox (-10,-10,10,10) استعمال کیا جا رہا ہے۔

prefigure-invalid-width = `<graph>`: prefigure میں تبدیلی کے لیے چوڑائی نامعتبر ہے؛ طے شدہ خاکے کی چوڑائی 425 استعمال کی جا رہی ہے۔

prefigure-invalid-aspect-ratio = `<graph>`: prefigure میں تبدیلی کے لیے aspectRatio نامعتبر ہے؛ طے شدہ تناسب 1 استعمال کیا جا رہا ہے۔

prefigure-grid-spacing-too-fine = `<graph>`: محوروں کی حدود کے لحاظ سے جالی کا فاصلہ بہت باریک ہے؛ prefigure ناظر میں جالی چھوڑ دی گئی ہے۔

prefigure-annotations-not-rendered = `<graph>`: جب PreFigure ناظر استعمال نہ ہو تو حاشیے نہیں بنائے جائیں گے۔

multiple-annotations-children = `<graph>` کے اندر ایک سے زیادہ `<annotations>` بچے ملے؛ آخری کے سوا سب نظرانداز کیے جا رہے ہیں۔

## Referring to other components

copy-unrecognized-component-type = نامعلوم قسم کے جزو کو بڑھایا یا نقل نہیں کیا جا سکتا: { $type }۔

copy-prop-not-found = { $component } قسم کے جزو پر { $property } خاصیت نہیں ملی

collect-no-source = collect کے لیے کوئی مأخذ نہیں ملا۔

collect-invalid-component-type = `<{ $component }>` قسم کے اجزا جمع نہیں کیے جا سکتے کیونکہ یہ نامعتبر قسم ہے۔

reference-index-unavailable = اشاریے `{ $reference }` کا حوالہ نہیں دیا جا سکتا

## `<callAction>`

component-action-unavailable = جزو `{ $reference }` پر { $action } نہیں چلایا جا سکتا

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ڈیٹا کی ساخت نامعتبر ہے۔ سطروں کی لمبائیاں یکساں نہیں۔ componentIdx :{ $componentIdx } پر ملا

data-frame-duplicate-column-names = ڈیٹا میں کالموں کے نام دہرائے گئے ہیں۔ componentIdx :{ $componentIdx } پر ملا

data-frame-missing-column-name = ڈیٹا میں ایک کالم کا نام نہیں۔ componentIdx :{ $componentIdx } پر ملا

## `<answer>` and scoring

answer-award-depends-on-own-response = اس جواب کا ایک award خود answer کے بھیجے گئے جواب پر منحصر ہے، جس سے غیر متوقع رویہ پیدا ہوگا۔

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` والے ظرف کے اندر `<answer>` پر `maxNumAttempts` مقرر کرنے کا کوئی اثر نہیں، کیونکہ کوششوں کی تعداد ظرف طے کرتا ہے۔ اس کے بجائے `maxNumAttempts` ظرف پر مقرر کریں۔

nested-section-wide-check-work-max-num-attempts = ایسے ظرف پر `maxNumAttempts` مقرر کرنے کا کوئی اثر نہیں جو `sectionWideCheckWork` رکھتا ہو اور خود ایک اور ایسے ہی ظرف کے اندر ہو، کیونکہ کوششوں کی تعداد بیرونی ظرف طے کرتا ہے۔ `maxNumAttempts` بیرونی ظرف پر مقرر کریں۔

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality مقرر کیے بغیر { $attributes } صفت کا کوئی اثر نہیں ہوگا۔
       *[other] symbolicEquality مقرر کیے بغیر { $attributes } صفات کا کوئی اثر نہیں ہوگا۔
    }

answer-invalid-type = جواب کے لیے نامعتبر قسم: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = چونکہ جزو `<{ $component }>` کا کوئی نام نہیں، اسے module کی صفت کے طور پر استعمال نہیں کیا جا سکتا

module-attribute-name-already-defined = جزو `<{ $component } name="{ $name }">` کو module کی صفت کے طور پر استعمال نہیں کیا جا سکتا کیونکہ `<module>` قسم میں پہلے ہی "{ $name }" نام کی صفت متعین ہے۔

conditional-content-condition-ignored = ایسے `<conditionalContent>` جزو پر `condition` صفت نظرانداز کر دی جاتی ہے جس کے case یا else بچے ہوں۔

slider-markers-type-mismatch = نشانوں کی قسم سلائیڈر کی قسم سے نہیں ملتی۔

pretzel-problem-needs-statement-and-answer = نامعتبر pretzel: ہر `<problem>` میں ایک `<statement>` اور ایک `<answer>` ہونا چاہیے۔

pretzel-circuit-first-problem-distractor = نامعتبر pretzel: mode="circuit" میں پہلا `<problem>` توجہ بٹانے والا نہیں ہو سکتا۔

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] صفت `{ $attribute }` کے لیے قیمت { $values } نامعتبر ہے؛ اسے نظرانداز کیا جا رہا ہے۔
       *[other] صفت `{ $attribute }` کے لیے قیمتیں { $values } نامعتبر ہیں؛ انہیں نظرانداز کیا جا رہا ہے۔
    }

attribute-must-be-references = صفت `{ $attribute }` کے لیے قیمت `{ $value }` نامعتبر ہے۔ صفت ایسے حوالوں سے بننی چاہیے جو `$` سے شروع ہوں۔

math-input-invalid-function-names = <mathInput>: { $attribute } میں نامعتبر دالوں کے نام نظرانداز کیے گئے: { $names }۔ ہر نام کا نمایاں حصہ کم از کم دو حروف کا ہونا چاہیے (حروف یا ڈیش)؛ اس کے بعد اختیاری لاحقہ `|<mathspeak alternative>` آ سکتا ہے۔

## Building components from the source

component-type-invalid = نامعتبر قسم کا جزو: `<{ $componentType }>`

attribute-repeated = صفت { $attribute } کو دہرایا نہیں جا سکتا۔

attribute-invalid-for-component = `<{ $componentType }>` قسم کے جزو کے لیے صفت "{ $attribute }" نامعتبر ہے۔

## Style definition contrast

style-definition-insufficient-contrast =
    اسلوب کی تعریف { $styleNumber } میں { $context ->
        [text-on-background] متن کے رنگ کا پس منظر کے رنگ کے مقابلے میں
        [high-contrast] زیادہ تضاد والے رنگ کا تختے کے مقابلے میں
        [line] لکیر کے رنگ کا تختے کے مقابلے میں
        [marker] نشان کے رنگ کا تختے کے مقابلے میں
       *[text-on-canvas] متن کے رنگ کا تختے کے مقابلے میں
    } تضاد ناکافی ہے{ $mode ->
        [dark] { " (تاریک وضع)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کم از کم { $threshold }:1 درکار ہے)۔

style-definition-dark-mode-text-background-contrast =
    اگرچہ اسلوب کی تعریف { $styleNumber } نے ایسے رنگ مقرر کیے ہیں جو روشن وضع میں کافی تضاد دیتے ہیں، ان سے اخذ کردہ تاریک وضع کے رنگوں میں متن کے رنگ اور پس منظر کے رنگ کے درمیان تضاد ناکافی ہے ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کم از کم { $threshold }:1 درکار ہے)۔ { $suggestion ->
        [available] تاریک وضع میں کافی تضاد یقینی بنانے کے لیے یا تو روشن وضع کا تضاد بڑھائیں (مثلاً { $lightAttribute }="{ $lightColor }") یا تاریک وضع کا رنگ خود مقرر کریں (مثلاً { $darkAttribute }="{ $darkColor }")۔
       *[none] تاریک وضع میں کافی تضاد یقینی بنانے کے لیے روشن وضع کا تضاد بڑھائیں یا اخذ کردہ رنگوں کو textColorDarkMode اور/یا backgroundColorDarkMode سے بدلیں۔
    }

style-definition-dark-mode-text-canvas-contrast =
    اگرچہ اسلوب کی تعریف { $styleNumber } نے ایسا متن کا رنگ مقرر کیا ہے جو روشن وضع میں کافی تضاد دیتا ہے، اس سے اخذ کردہ تاریک وضع کے متن کے رنگ کا تختے کے مقابلے میں تضاد ناکافی ہے ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کم از کم { $threshold }:1 درکار ہے)۔ { $suggestion ->
        [available] تاریک وضع میں کافی تضاد یقینی بنانے کے لیے یا تو روشن وضع کا تضاد بڑھائیں (مثلاً textColor="{ $lightColor }") یا تاریک وضع کا رنگ خود مقرر کریں (مثلاً textColorDarkMode="{ $darkColor }")۔
       *[none] تاریک وضع میں کافی تضاد یقینی بنانے کے لیے روشن وضع کا تضاد بڑھائیں یا اخذ کردہ رنگ کو textColorDarkMode سے بدلیں۔
    }

section-multiple-style-palettes = ایک باب صرف ایک <stylePalette> منتخب کر سکتا ہے؛ آخری استعمال کی جا رہی ہے۔

## Unique variants

variant-num-to-select-not-non-negative-integer = جزو { $component } کے منفرد نسخے طے نہیں کیے جا سکتے کیونکہ numToSelect غیر منفی صحیح عدد نہیں۔

variant-num-to-select-not-constant-number = جزو { $component } کے منفرد نسخے طے نہیں کیے جا سکتے کیونکہ numToSelect ثابت عدد نہیں۔

variant-with-replacement-not-constant-boolean = جزو { $component } کے منفرد نسخے طے نہیں کیے جا سکتے کیونکہ withReplacement ثابت منطقی قیمت نہیں۔

variant-select-weight-disables-unique = اگر کسی اختیار پر selectWeight یا selectForVariants مقرر ہو تو select کے منفرد نسخے بند ہو جاتے ہیں

variant-coprime-undetermined = جزو { $component } کے منفرد نسخے طے نہیں کیے جا سکتے کیونکہ یہ طے نہیں ہو سکا کہ coprime ہمیشہ غلط ہے۔

variant-attribute-not-constant = جزو { $component } کے منفرد نسخے طے نہیں کیے جا سکتے کیونکہ { $attribute } ثابت نہیں۔

variant-attribute-not-number = جزو { $component } کے منفرد نسخے طے نہیں کیے جا سکتے کیونکہ { $attribute } عدد نہیں۔

variant-attribute-wrong-type-for-sequence =
    { $type } قسم کے جزو { $component } کے منفرد نسخے طے نہیں کیے جا سکتے کیونکہ { $attribute } { $expected ->
        [letters-combination] حروف کا مجموعہ
        [math-expression] جائز ریاضیاتی اظہار
        [integer] صحیح عدد
       *[number] عدد
    } نہیں۔

variant-length-not-integer = جزو { $component } کے منفرد نسخے طے نہیں کیے جا سکتے کیونکہ length صحیح عدد نہیں۔

variant-sort-not-implemented = sort کے ساتھ { $component } کے منفرد نسخے نافذ نہیں کیے گئے

variant-exclude-combinations-not-implemented = excludeCombinations کے ساتھ { $component } کے منفرد نسخے نافذ نہیں کیے گئے

variant-math-exclude-not-implemented = exclude کے ساتھ math قسم کے { $component } کے منفرد نسخے نافذ نہیں کیے گئے

variant-non-constant-exclude-not-implemented = غیر ثابت exclude کے ساتھ { $component } کے منفرد نسخے نافذ نہیں کیے گئے

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: خاکے کے prefigure ناظر میں مدد نہیں؛ تابع عنصر چھوڑ دیا گیا۔

prefigure-descendant-invalid-geometry = { $subject }: غیر متناہی یا نامکمل ہندسہ؛ تابع عنصر چھوڑ دیا گیا۔

prefigure-curve-label-omitted = { $subject }: تبدیل شدہ منحنی عناصر پر عنوانات کی مدد نہیں؛ عنوان چھوڑ دیا گیا۔

prefigure-curve-unsupported-definition-type = { $subject }: منحنی دالے کی تعریف کی قسم '{ $definitionType }' کی مدد نہیں؛ تابع عنصر چھوڑ دیا گیا۔

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves پر flipFunctions صفت کی مدد نہیں؛ تابع عنصر چھوڑ دیا گیا۔

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves پر صرف فارمولے سے متعین بچہ دالوں کی مدد ہے؛ تابع عنصر چھوڑ دیا گیا۔

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] لکیر خاندان کے عنوان
       *[point] نقطے کے عنوان
    } کے لیے labelPosition '{ $labelPosition }' کی مدد نہیں؛ PreFigure کی طے شدہ ترتیب استعمال کی گئی۔

prefigure-fill-style-unsupported = { $subject }: بھراؤ کا اسلوب '{ $fillStyle }' PreFigure میں معاون نہیں؛ یکساں بھراؤ استعمال کیا جا رہا ہے۔

prefigure-line-style-unknown = { $subject }: لکیر کا اسلوب '{ $lineStyle }' نامعلوم ہے اور PreFigure کے اخراج سے نکال دیا گیا۔

prefigure-marker-style-mapped-to-diamond = { $subject }: نشان کا اسلوب '{ $markerStyle }' PreFigure کے 'diamond' اسلوب پر منتقل کیا گیا۔

prefigure-marker-style-unsupported = { $subject }: نشان کا اسلوب '{ $markerStyle }' PreFigure میں معاون نہیں؛ طے شدہ اسلوب استعمال کیا گیا۔

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` نامعتبر ہے؛ ہدف طے نہیں ہو سکا۔ حاشیہ چھوڑ دیا گیا۔

annotation-ref-multiple-targets = `<annotation>`: `ref` ایک سے زیادہ ہدف تک پہنچا؛ پہلا ہدف استعمال کیا جا رہا ہے۔

annotation-ref-outside-graph = `<annotation>`: `ref` نامعتبر ہے؛ ہدف اپنے خاکے سے باہر ہے۔ حاشیہ چھوڑ دیا گیا۔

annotation-ref-unsupported-target = `<annotation>`: `ref` نامعتبر ہے؛ ہدف prefigure میں تبدیلی کے لیے معاون گرافیکی شے نہیں۔ حاشیہ چھوڑ دیا گیا۔

annotation-text-missing = `<annotation>`: `text` غائب یا خالی ہے؛ خالی متن دیا جا رہا ہے۔

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] دائروی انحصار سامنے آیا۔
       *[other] `<{ $componentType }>` جزو پر مشتمل دائروی انحصار سامنے آیا۔
    }

reference-no-referent = حوالے کے لیے کوئی مرجع نہیں ملا: `{ $reference }`

reference-multiple-referents = حوالے کے لیے ایک سے زیادہ مرجع ملے: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` کی { $attribute } صفت کی ساخت نامعتبر ہے۔

children-invalid = `<{ $componentType }>` کے لیے نامعتبر بچے: نامعتبر بچے ملے: { $children }

## Falling back to a default

attribute-value-invalid-using-default = صفت `{ $attribute }` کے لیے قیمت `{ $value }` نامعتبر ہے، قیمت `{ $default }` استعمال کی جا رہی ہے

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML کا نسخہ { $version } نہیں ملا۔
       *[other] DoenetML کا نسخہ { $version } نہیں ملا۔ نسخہ { $fallback } استعمال کیا جا رہا ہے
    }

## Reading the DoenetML

parse-invalid-doenetml = نامعتبر DoenetML: { $content }

parse-tag-missing-close-tag = نامعتبر DoenetML: ٹیگ `{ $tag }` کا اختتامی ٹیگ نہیں۔ خود بند ہونے والا ٹیگ یا `</{ $tagName }>` ٹیگ متوقع تھا۔

parse-tag-error = نامعتبر DoenetML: ٹیگ `<{ $tagName }>` میں خرابی

parse-attribute-missing-value = نامعتبر DoenetML: لگتا ہے نامعتبر صفت `{ $attribute }` کی قیمت غائب ہے۔

parse-attribute-invalid = نامعتبر DoenetML: صفت `{ $attribute }` نامعتبر ہے

parse-attribute-value-invalid = نامعتبر DoenetML: صفت کی قیمت `{ $value }` نامعتبر ہے

parse-attribute-value-quote-mismatch = نامعتبر DoenetML: صفت کی قیمت `{ $value }` نامعتبر ہے۔ واوین آپس میں نہیں ملتے۔ لگتا ہے ایک `{ $quote }` غائب ہے

parse-open-tag-name-missing = نامعتبر DoenetML: بغیر نام کا ٹیگ ملا، جیسے `<`

parse-tag-not-closed = نامعتبر DoenetML: ٹیگ `{ $tag }` بند نہیں ہوا (لگتا ہے `>` غائب ہے)۔

parse-self-closing-tag-name-missing = نامعتبر DoenetML: بغیر نام کا ٹیگ ملا `<{ $content }>`

parse-self-closing-tag-not-closed = نامعتبر DoenetML: ٹیگ `{ $tag }` بند نہیں ہوا (لگتا ہے `/>` غائب ہے)۔

parse-tag-invalid-attributes = نامعتبر DoenetML: ٹیگ `{ $tag }` جائز نہیں۔ ہو سکتا ہے اس کی صفات غلط ہوں۔

parse-close-tag-name-missing = نامعتبر DoenetML: بغیر نام کا اختتامی ٹیگ ملا، جیسے `</`

parse-attribute-value-unquoted = صفات کی قیمتیں واوین کے اندر ہونی چاہئیں: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = نامعتبر DoenetML: اختتامی ٹیگ `{ $tag }` ملا، مگر اس کا کوئی ابتدائی ٹیگ نہیں

parse-close-tag-mismatched = نامعتبر DoenetML: اختتامی ٹیگ میل نہیں کھاتا۔ `</{ $expected }>` متوقع تھا۔ `{ $found }` ملا

parser-node-unconvertible = گرہ { $node } کو Dast گرہ میں تبدیل نہیں کیا جا سکا۔

## Names

name-attribute-invalid =
    صفت name='{ $name }' نامعتبر ہے۔ { $reason ->
        [characters] ناموں میں صرف حروف، ہندسے، زیریں خط یا ڈیش ہو سکتے ہیں۔
       *[start] نام حرف سے شروع ہونے چاہئیں۔
    }

component-name-invalid-start = جزو کا نام "{ $name }" نامعتبر ہے۔ نام حرف سے شروع ہونے چاہئیں۔

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched قسم کے جواب کے پاس video صفت ہونی چاہیے

answer-video-watched-video-not-reference = videoWatched قسم کے جواب کی video صفت ایک حوالہ ہونی چاہیے

answer-name-not-single-text = جواب کی name صفت میں ایک ہی متنی بچہ ہونا چاہیے

## Referencing another document

external-doenetml-recursion-limit = بہت زیادہ تکرار کی وجہ سے بیرونی DoenetML حاصل نہیں ہو سکا۔ کیا کوئی دائروی حوالہ ہے؟

external-doenetml-unavailable = { $attribute }="{ $uri }" سے DoenetML حاصل نہیں ہو سکا

external-doenetml-type-mismatch = { $attribute }="{ $uri }" سے حاصل کیا گیا DoenetML نامعتبر ہے: یہ "{ $componentType }" قسم سے نہیں ملتا

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] صفت `{ $from }` متروک ہے؛ اس کی جگہ `{ $to }` استعمال کریں۔
       *[other] [deprecation] `<{ $component }>` پر صفت `{ $from }` متروک ہے؛ اس کی جگہ `{ $to }` استعمال کریں۔
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] صفت `{ $from }` متروک ہے اور نظرانداز کر دی گئی کیونکہ `{ $to }` بھی مقرر ہے۔
       *[other] [deprecation] `<{ $component }>` پر صفت `{ $from }` متروک ہے اور نظرانداز کر دی گئی کیونکہ `{ $to }` بھی مقرر ہے۔
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` پر صفت `{ $attribute }` متروک ہے اور نظرانداز کر دی گئی۔


## Language coverage

pluralize-english-only = `<pluralize>` صرف انگریزی الفاظ کی جمع بنا سکتا ہے، اس لیے { $locale } زبان میں لکھی دستاویز میں اس کا متن ویسا ہی رہتا ہے۔ جمع کی صورت براہِ راست لکھیں، یا اسے `pluralForm` صفت سے مقرر کریں۔


## Checking against the schema

schema-element-unrecognized = عنصر `<{ $tag }>` Doenet کا شناخت شدہ عنصر نہیں۔

schema-element-not-allowed-at-root = عنصر `<{ $tag }>` دستاویز کی جڑ میں جائز نہیں۔

schema-element-not-allowed-inside = عنصر `<{ $tag }>` `<{ $parent }>` کے اندر جائز نہیں۔

schema-attribute-unrecognized = عنصر `<{ $tag }>` کے پاس `{ $attribute }` نام کی کوئی صفت نہیں۔

schema-attribute-value-not-allowed =
    { $isList ->
        [true] عنصر `<{ $tag }>` کی صفت `{ $attribute }` ایسی فہرست ہونی چاہیے جس کا ہر عنصر ان میں سے ایک ہو: { $allowed }
       *[other] عنصر `<{ $tag }>` کی صفت `{ $attribute }` ان میں سے ایک ہونی چاہیے: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select کے لیے نامعتبر نسخے کا نام۔ نسخے کا نام { $variantName } { $numOptions } اختیارات میں آتا ہے مگر منتخب کرنے کی تعداد { $numToSelect } ہے۔

select-variant-name-without-options = select کے لیے کچھ نسخے مقرر ہیں مگر ممکنہ نسخے کے نام کے لیے کوئی اختیار مقرر نہیں: { $variantName }۔

select-variant-name-not-possible = select کے لیے مقرر کردہ نسخے کا نام { $variantName } کوئی ممکنہ نام نہیں۔

select-too-few-options = صرف { $numOptions } میں سے { $numToSelect } اجزا منتخب نہیں کیے جا سکتے۔

select-from-sequence-too-few-values = { $length } لمبے تسلسل میں سے { $numToSelect } قیمتیں منتخب نہیں کی جا سکتیں۔

select-from-sequence-indices-count-mismatch = select کے لیے مقرر کردہ اشاریوں کی تعداد منتخب کرنے کی تعداد سے ملنی چاہیے

select-from-sequence-indices-not-integers = select کے لیے مقرر کردہ تمام اشاریے صحیح عدد ہونے چاہئیں

select-from-sequence-index-excluded = selectfromsequence کا مقرر کردہ اشاریہ خارج شدہ تھا

select-from-sequence-indices-excluded-combination = selectfromsequence کے مقرر کردہ اشاریے ایک خارج شدہ مجموعہ تھے

select-from-sequence-coprime-not-positive-integers = باہم اولی مجموعے منتخب نہیں کیے جا سکتے کیونکہ انتخاب مثبت صحیح عددوں میں سے نہیں ہو رہا۔

select-from-sequence-coprime-common-factor = باہم اولی عدد منتخب نہیں کیے جا سکتے۔ تمام ممکنہ قیمتوں کا ایک مشترک عامل ہے۔ ("from" یا "to" کی مقرر کردہ قیمت "step" کے ساتھ باہم اولی ہونی چاہیے۔)

select-from-sequence-coprime-single-number = ایسے واحد عدد سے باہم اولی مجموعے منتخب نہیں کیے جا سکتے جو 1 نہ ہو۔

select-from-sequence-excluded-too-many-combinations = selectFromSequence میں 70% سے زیادہ مجموعے خارج کر دیے گئے

select-from-sequence-coprime-none-found = باہم اولی عدد منتخب نہیں کیے جا سکے۔ تمام ممکنہ قیمتوں کا ایک مشترک عامل ہے۔

select-from-sequence-too-few-unique-values = { $numPossibleValues } لمبے تسلسل میں سے { $numToSelect } منفرد قیمتیں منتخب نہیں کی جا سکتیں

select-prime-numbers-too-few-values = { $numValues } لمبی اولی عددوں کی فہرست میں سے { $numToSelect } قیمتیں منتخب نہیں کی جا سکتیں

select-prime-numbers-values-count-mismatch = select کے لیے مقرر کردہ قیمتوں کی تعداد منتخب کرنے کی تعداد سے ملنی چاہیے

select-prime-numbers-values-not-prime = select prime number کے لیے مقرر کردہ تمام قیمتیں اولی عددوں کی فہرست میں ہونی چاہئیں

select-prime-numbers-values-excluded-combination = selectPrimeNumbers کی مقرر کردہ قیمتیں ایک خارج شدہ مجموعہ تھیں

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers میں 70% سے زیادہ مجموعے خارج کر دیے گئے

select-random-combination-fluke = نہایت غیر متوقع اتفاق سے، بے ترتیب قیمتوں کا مجموعہ منتخب نہیں ہو سکا

select-random-value-fluke = نہایت غیر متوقع اتفاق سے، بے ترتیب قیمت منتخب نہیں ہو سکی
