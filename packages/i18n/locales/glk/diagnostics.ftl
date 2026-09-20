# Gilaki (گیلکی) warnings and errors — everything the worker, the parser and
# the schema checker put in front of whoever is looking at the screen.
# Translated from `locales/en/diagnostics.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Perso-Arabic script, right to left. The Gilaki Wikipedia's
# «ؤ» for /o/ and «ۊ» for /u/ — «خؤب», «بۊشؤ» — are **not** used in this seed:
# across a file this long they could only be applied by guessing at the vowel
# of every borrowed technical term, and half an orthography is worse than
# none. Plain Persian «و», «ا», «ی» throughout. A corrector who wants the
# Wikipedia convention should convert **all four files of this locale at
# once** rather than leave the two systems mixed inside one catalog.
# (One caveat, so nobody "fixes" it: «ؤ» also occurs inside the Persian
# loanwords «مؤلفه» and «مؤلفه‌ان», where it is the ordinary Arabic hamza
# carrier of the standard Persian spelling, not the Gilaki /o/ letter. Those
# stay as they are.)
#
# **What is Gilaki here and what is not.** This is the file where the honest
# answer matters most, because it is the longest. Every technical noun below —
# «ویژگی», «مؤلفه», «متغیر», «دنباله», «کنتراست», «معادله», «ماتریس» — is
# Persian, and that is deliberate: Gilaki has no register for any of this, and
# a Gilaki-shaped respelling of a Persian term would be a word no reader has
# ever seen. What is Gilaki, without exception, is the grammar carrying them:
#
#   * «ایسه» / «نیه» for *is* and *is not*, never «است» / «نیست»;
#   * «ممکن نیه» for *cannot*, «واستی» for *must*, «چونکی» for *because*;
#   * the passive «نادیده گرفته بنه» (*is ignored*), «پیاده‌سازی نوبوسته»
#     (*has not been implemented*), «پیدا نوبوسته» (*was not found*), with the
#     negative prefix «ن-»;
#   * the plural «-ان» — «نقطه‌ان», «اندیسان», «مؤلفه‌ان» — never «-ها»;
#   * the classifier «تا» with a singular noun after a numeral;
#   * the postpositions «مئن» (*in*, *inside*) and «ره» (*to*, object marker),
#     which assemble a phrase back to front from the Persian.
#
# A reviewer should expect to be **rewriting sentences, not correcting
# typos**.
#
# **DoenetML identifiers stay in English.** `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `maxNumAttempts`, `styleNumber`,
# `selectFromSequence`, every tag and attribute name, `WCAG AA`, the
# `[deprecation]` marker, `prefigure` / `PreFigure`, `mathjs` and `Dast` are
# part of the language rather than prose, and are written exactly as they
# stand.
#
# **Counting.** `Intl.PluralRules` has no data for `glk`, so nothing but
# `[one]` and `*[other]` could ever be selected — and Gilaki leaves a counted
# noun singular, so the two branches would be identical anyway. Every count
# select in this file is therefore collapsed to a single sentence with no
# select at all. The count argument then goes unused, which is harmless: it
# stays in the English message for the languages that need it.
#
# **Punctuation.** «،» and «؛» for comma and semicolon, «؟» for a question
# mark. Brackets, quotes and the full stop are the same characters English
# uses and are written opening-first, in logical order; the bidi algorithm
# turns them round when the text is drawn. Digits are Latin, repo-wide policy.
#
# **Coverage.** This file covers every key in `locales/en/diagnostics.ftl`,
# including the six (`field-function-wrong-num-outputs`,
# `field-function-attribute-ignored-with-child`, `field-variables-ignored`,
# `deprecated-attribute-to-child`, `deprecated-attribute-value-renamed`,
# `math-embedded-input-shape-unsuitable`) that `fa` leaves to fall back to
# English.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = وقتی دو تا انتهایی نقطه مشخص ببه، { $attributes } نادیده گرفته بنه

line-segment-attributes-ignored-with-endpoint-and-midpoint = وقتی ایتا انتهایی نقطه و ایتا میانی نقطه با هم مشخص ببید، { $attributes } نادیده گرفته بنه

line-segment-midpoint-offset-without-midpoint = میانی نقطه نوبون، midpointOffset هیچ اثر ندنه

## `<line>`

line-points-undetermined-dimensions = خطی کی نامشخص ابعاد نقطه‌ان مئن‌جا رد بنه.

line-points-too-few-dimensions = خط واستی نقطه‌انی مئن‌جا رد ببه کی دست‌کم دو تا بعد بدأریدی.

line-points-depend-on-variables = خط نقطه‌انی مئن‌جا رد بنه کی متغیران ره وابسته‌ایدی: { $variables }.

line-equation-invalid-format = { $variable1 } و { $variable2 } متغیران همراه خط معادله ره قالب نامعتبر ایسه.

## `<ray>`

ray-overprescribed-through = نیم‌خط through و endpoint و direction همراه مشخص بوبو. مشخص‌بوبو through نادیده گرفته بنه.

ray-dimension-mismatch = نیم‌خط مئن numDimensions ناسازگار ایسه.

## `<vector>`

vector-overprescribed-head = بردار head و tail و displacement همراه مشخص بوبو. مشخص‌بوبو head نادیده گرفته بنه.

vector-dimension-mismatch = بردار مئن numDimensions ناسازگار ایسه.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ره جذب بوستن ممکن نیه، چونکی nearestPoint حالت متغیر ره ندنه.

constrain-to-without-nearest-point = `<{ $component }>` ره مقید بوستن ممکن نیه، چونکی nearestPoint حالت متغیر ره ندنه.

constrain-to-interior-without-nearest-point = `<{ $component }>` درون ره مقید بوستن ممکن نیه، چونکی nearestPoint حالت متغیر ره ندنه.

## `<choiceInput>`

choice-input-label-position-ignored = درون‌خطی‌نیه choiceInput مئن، labelPosition نادیده گرفته بنه

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput مئن مشخص‌بوبو indices نادیده گرفته بنه، چونکی اندیسان شمار choice فرزندان شمار همراه نمی‌خوانه.

pretzel-indices-count-mismatch = problem مئن مشخص‌بوبو indices نادیده گرفته بنه، چونکی اندیسان شمار problem فرزندان شمار همراه نمی‌خوانه.

shuffle-indices-count-mismatch = shuffle مئن مشخص‌بوبو indices نادیده گرفته بنه، چونکی اندیسان شمار مؤلفه‌ان شمار همراه نمی‌خوانه.

indices-ignored-out-of-range = { $component } مئن مشخص‌بوبو indices نادیده گرفته بنه، چونکی بعضی اندیسان بازه ره بیرون ایسیدی.

pretzel-indices-repeated = pretzel مئن مشخص‌بوبو indices نادیده گرفته بنه، چونکی بعضی اندیسان تکراری ایسیدی.

pretzel-circuit-first-index = circuit حالت مئن pretzel ره مشخص‌بوبو indices نادیده گرفته بنه، چونکی اولین اندیس واستی 1 ببه.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` رشته‌ای فرزندان همراه کار بکونه، واستی type ویژگی مشخص ببه.

invalid-type-defaulting-to-math = { $component } مؤلفه ره { $type } نوع نامعتبر ایسه. واستی math، text، number یا boolean ببه. math به کار شونه.

string-not-valid-component-to-arrange = "{ $value }" رشته معتبر مؤلفه‌ای نیه کی { $component } اونه بچینه. نادیده گرفته بنه.

## Types and variables

invalid-type-defaulting-to-number = { $type } نوع نامعتبر ایسه؛ نوع number سر تنظیم بنه.

invalid-variable-value = ایتا متغیر نامعتبر مقدار: `{ $value }`

## Variants

variant-index-must-be-number = { $index } نسخه اندیس واستی عدد ببه

variant-index-must-be-integer = { $index } نسخه اندیس واستی صحیح عدد ببه

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` مطلق اندازه‌ان ره پیاده‌سازی نوبوسته. عرضان نسبی تنظیم بنه.

side-by-side-absolute-margins = `<{ $component }>` مطلق اندازه‌ان ره پیاده‌سازی نوبوسته. حاشیه‌ان نسبی تنظیم بنه.

side-by-side-no-block-child = `<{ $component }>` نامعتبر ایسه: واستی دست‌کم ایتا بلوکی فرزند بدأره.

## `<label>`

label-for-ignored-on-graphical = گرافیکی `<label>` سر `for` ویژگی نادیده گرفته بنه.

label-for-must-resolve-to-one = `<label>` سر `for` ویژگی واستی دقیقاً ایتا مؤلفه ره اشاره بکونه.

label-for-unresolved = `<label>` سر `for` ویژگی هیچ مؤلفه‌ای ره نرسه.

label-for-answer-with-authored-inputs = `<label>` سر `for` ویژگی ایتا `<answer>` ره اشاره کونه کی اونه ورودی‌ان صریحاً بنویشته بوبوسته؛ مستقیم خود ورودی ره اشاره بکونید.

label-for-answer-without-input = `<label>` سر `for` ویژگی ایتا `<answer>` ره اشاره کونه کی برچسب‌زنی ره ورودی ندنه.

label-for-must-reference-input-or-answer = `<label>` سر `for` ویژگی واستی ایتا ورودی یا ایتا `<answer>` ره اشاره بکونه.

## Accessibility

accessibility-short-description-or-decorative = دسترس‌پذیری ره، `<{ $component }>` واستی یا کوتاه توصیف بدأره یا تزئینی مشخص ببه.

accessibility-video-short-description = دسترس‌پذیری ره، `<video>` واستی کوتاه توصیف بدأره.

accessibility-input-short-description-or-label = دسترس‌پذیری ره، `<{ $component }>` واستی کوتاه توصیف یا برچسب بدأره.

accessibility-answer-input-short-description-or-label = دسترس‌پذیری ره، ایتا `<answer>` کی ورازه سازه واستی کوتاه توصیف یا برچسب بدأره.

accessibility-short-description-contains-math = کوتاه توصیف نواستی `<{ $component }>` مانستن ریاضی مؤلفه‌ان بدأره. ریاضی ره واژه همراه بنویسید.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] بخش عنوان متن ره { $colorName } کنتراست کافی نیه (تیره حالت) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازمه).
       *[other] بخش عنوان متن ره { $colorName } کنتراست کافی نیه ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازمه).
    }

## `<circle>`

circle-through-points-non-numerical = { $count } تا نقطه مئن‌جا رد‌بونه `<circle>`، وقتی نقطه‌ان عددی مقدار ندأریدی، پیاده‌سازی نوبوسته.

circle-too-many-through-points = 3 تا نقطه ویشتر مئن‌جا رد‌بونه دایره ره حساب کودن ممکن نیه.

circle-overprescribed-radius-center-points = شعاع و مرکز و گذر نقطه‌ان، هر سه مشخص‌بوبو، همراه دایره ره حساب کودن ممکن نیه.

circle-center-with-multiple-points = مشخص مرکز همراه دایره‌ای کی ایتا نقطه ویشتر مئن‌جا رد ببه ره حساب کودن ممکن نیه.

circle-radius-too-small = دایره ره حساب کودن ممکن نیه: چونکی دو تا نقطه فاصله { $distance } ایسه، مشخص‌بوبو شعاع { $radius } خیلی کوچیکه.

circle-radius-with-many-points = مشخص شعاع همراه دو تا نقطه ویشتر مئن‌جا رد‌بونه دایره ره ساختن ممکن نیه.

circle-invalid-center-or-through-points = دایره مرکز یا گذر نقطه‌ان نامعتبر ایسه.

circle-radius-center-with-multiple-points = مشخص مرکز همراه دایره‌ای کی ایتا نقطه ویشتر مئن‌جا رد ببه ره شعاع حساب کودن ممکن نیه.

circle-change-radius-non-numerical = غیرعددی نقطه‌ان مئن‌جا رد‌بونه دایره شعاع ره عوض کودن ممکن نیه

circle-radius-with-points-non-numerical = وقتی عددی مقدار دس نیه، مشخص شعاع همراه ایتا نقطه ویشتر مئن‌جا رد‌بونه دایره ره ساختن ممکن نیه.

circle-change-center-non-numerical = غیرعددی نقطه‌ان مئن‌جا رد‌بونه دایره مرکز ره عوض کودن پیاده‌سازی نوبوسته.

## `<function>`

# One sentence rather than four: Gilaki leaves the counted noun singular with
# the classifier «تا», so both of English's nested selects would render the
# same wording twice over.
function-domain-insufficient-dimensions = تابع دامنه ابعاد کافی نیه. دامنه { $intervals } تا بازه دنه، ولی تابع { $inputs } تا ورودی دنه.

function-domain-invalid-format = تابع دامنه ره قالب نامعتبر ایسه.

function-ignoring-non-numerical =
    { $type ->
        [maximum] تابع غیرعددی بیشترین نادیده گرفته بنه.
        [minimum] تابع غیرعددی کمترین نادیده گرفته بنه.
        [extremum] تابع غیرعددی حد نهایی نادیده گرفته بنه.
        [point] تابع غیرعددی نقطه نادیده گرفته بنه.
        [slope] تابع غیرعددی شیب نادیده گرفته بنه.
       *[other] تابع غیرعددی { $type } نادیده گرفته بنه.
    }

function-ignoring-empty =
    { $type ->
        [maximum] تابع خالی بیشترین نادیده گرفته بنه.
        [minimum] تابع خالی کمترین نادیده گرفته بنه.
        [extremum] تابع خالی حد نهایی نادیده گرفته بنه.
        [point] تابع خالی نقطه نادیده گرفته بنه.
       *[other] تابع خالی { $type } نادیده گرفته بنه.
    }

function-points-too-close = تابع دو تا نقطه دنه کی اوشانه جا خیلی هم ره نزدیکه. تابع ره تعریف کودن ممکن نیه.

function-iterates-input-output-mismatch = تابع تکراران فقط وقتی ممکنه کی ورودی‌ان شمار خروجی‌ان شمار همراه برابر ببه. ای تابع { $inputs } تا ورودی و { $outputs } تا خروجی دنه.

## `<sequence>`

sequence-invalid-length = دنباله طول نامعتبر ایسه. واستی نامنفی صحیح عدد ببه.

sequence-invalid-step = دنباله گام نامعتبر ایسه. { $type } نوع دنباله ره واستی عدد ببه.

sequence-invalid-endpoint-number = عددی دنباله ره "{ $attribute }" نامعتبر ایسه. واستی عدد ببه.

sequence-invalid-endpoint-letters = حرفی دنباله ره "{ $attribute }" نامعتبر ایسه. واستی حروف ترکیب ببه.

sequence-invalid-endpoint = دنباله ره "{ $attribute }" نامعتبر ایسه.

select-from-sequence-coprime-not-numbers = coprime نادیده گرفته بوبو، چونکی انتخاب عددان میان نیه

select-from-sequence-coprime-with-exclude-combinations = coprime نادیده گرفته بوبو، چونکی excludeCombinations مشخص بوبو

## Resolving a `target`

target-not-found = `<{ $source }>` مئن target نامعتبر ایسه: هدف پیدا نوبوسته.

target-state-variable-not-found = `<{ $source }>` مئن target نامعتبر ایسه: `<{ $component }>` سر "{ $property }" نام همراه حالت متغیری پیدا نوبوسته.

## `<odeSystem>`

# «سمت راست» is the right-hand side of the equation and stays the right one:
# mathematics is a left-to-right island inside a Gilaki document, so the
# equation the phrase names is drawn the same way round as in English.
ode-system-variables-match-independent = `<odeSystem>` متغیران واستی مستقل متغیر همراه فرق بدأریدی.

ode-system-duplicate-variable-names = تکراری وابسته متغیر نامان همراه دیفرانسیل معادله سمت راست توابع ره تعریف کودن ممکن نیه.

ode-system-rhs-function-error = دیفرانسیل معادله سمت راست تابع ره تعریف کودن ممکن نیه. mathjs تابع ساختن مئن خطا.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } تا خط میان زاویه ره تعریف کودن ممکن نیه

angle-invalid-through-point = `<angle>` ره through مئن نامعتبر نقطه

parabola-vertex-too-many-points = مشخص رأس همراه سهمی کی ایتا نقطه ویشتر مئن‌جا رد ببه پیاده‌سازی نوبوسته.

parabola-too-many-points = 3 تا نقطه ویشتر مئن‌جا رد‌بونه سهمی پیاده‌سازی نوبوسته.

intersection-too-many-items = دو تا مورد ویشتر ره اشتراک پیاده‌سازی نوبوسته

## Other math components

ionic-compound-not-two-ions = یونی ترکیب دو تا یون جز هیچی ره پیاده‌سازی نوبوسته.

ionic-compound-needs-cation-and-anion = یونی ترکیب فقط ایتا کاتیون و ایتا آنیون ره پیاده‌سازی بوبو.

solve-equations-cannot-evaluate = معادله ره حل کودن ممکن نیه، چونکی معادله ارزیابی نوبوسته: { $equation }

math-operators-operand-number-required = ایتا ریاضی عملوند ره بیرون کشئن وخت واستی operandNumber مشخص ببه.

eigen-decomposition-failed = ماتریس ویژه مقادیر ره حساب کودن ممکن نوبوسته

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: { $parameters } پارامتران الگو مئن نایدی، پس همیشک ایتا خالی جا همراه مطابقت کونیدی.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ره تفسیر کودن ممکن نوبوسته. واستی none یا medium یا dense ببه، یا دو تا مثبت عدد کی فاصله همراه سیوا ببید، مانستن grid="1 0.5". هیچ شبکه‌ای رسم نبنه.

## `<slopeField>` and `<vectorField>`

# One sentence per branch rather than English's nested count selects: Gilaki
# counts with «تا» and a singular noun, so a singular and a plural branch
# would be word for word the same.
field-function-wrong-num-outputs =
    `<{ $component }>` ایتا تابعی لازم دنه کی { $expected ->
        [one] ایتا خروجی بدأره، هر نقطه مئن y' شیب، مانستن `y - x`
       *[other] دو تا خروجی بدأره، هر نقطه مئن بردار، مانستن `(y, -x)`
    }، ولی تابعی کی اونه بدأیید { $found } تا خروجی دنه. { $alternative ->
        [none] هیچی رسم نبنه.
       *[other] `<{ $alternative }>` اون تابع ره مؤلفه ایسه. هیچی رسم نبنه.
    }

field-function-attribute-ignored-with-child = `function` ویژگی نادیده گرفته بنه، چونکی تابع مؤلفه درون هم بدأ بوبو؛ درونی اون به کار شونه. تابع ره فقط ایتا رایی از ای دو تا بدید.

field-variables-ignored =
    `<{ $component }>`: `variables` ویژگی اون عبارتی متغیران ره نام برنه کی مستقیم مؤلفه درون بنویشته ببه. { $reason ->
        [function-child] ایه تابع ایتا `<function>` فرزند شکل مئن بدأ بوبو، کی خودش خو متغیران ره نام برنه، پس `variables` نادیده گرفته بنه.
       *[no-expression] ایه چنین عبارتی بدأ نوبوسته، پس `variables` نادیده گرفته بنه.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure نمایشگر مئن xLabelPosition="left" پشتیبانی نبنه؛ right موضع رفتار به کار شونه.

prefigure-y-label-position-unsupported = `<graph>`: prefigure نمایشگر مئن yLabelPosition="bottom" پشتیبانی نبنه؛ top موضع رفتار به کار شونه.

prefigure-invalid-axis-bounds = `<graph>`: prefigure ره تبدیل مئن محور کرانان نامعتبر ایسه؛ پیش‌فرض bbox (-10,-10,10,10) به کار شونه.

prefigure-invalid-width = `<graph>`: prefigure ره تبدیل مئن عرض نامعتبر ایسه؛ نمودار پیش‌فرض عرض 425 به کار شونه.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ره تبدیل مئن aspectRatio نامعتبر ایسه؛ پیش‌فرض ابعاد نسبت 1 به کار شونه.

prefigure-grid-spacing-too-fine = `<graph>`: محور کرانان ره شبکه فاصله خیلی ریزه؛ prefigure نمایشگر مئن شبکه حذف بنه.

prefigure-annotations-not-rendered = `<graph>`: وقتی PreFigure نمایشگر به کار نشه، حاشیه‌نویسی‌ان رسم نبیدی.

multiple-annotations-children = `<graph>` مئن ایتا `<annotations>` فرزند ویشتر پیدا بوبو؛ آخری جز همه نادیده گرفته بیدی.

## Referring to other components

copy-unrecognized-component-type = ناشناخته مؤلفه نوع ره گسترش دان یا کپی کودن ممکن نیه: { $type }.

copy-prop-not-found = { $component } نوع مؤلفه‌ای سر { $property } ویژگی پیدا نوبوسته

collect-no-source = collect ره هیچ منبع پیدا نوبوسته.

collect-invalid-component-type = `<{ $component }>` نوع مؤلفه‌ان ره گردآوری کودن ممکن نیه، چونکی نامعتبر مؤلفه نوعی ایسه.

reference-index-unavailable = `{ $reference }` اندیس ره ارجاع دان ممکن نیه

## `<callAction>`

component-action-unavailable = `{ $reference }` مؤلفه سر { $action } ره فراخواندن ممکن نیه

## `<dataFrame>`

data-frame-inconsistent-row-lengths = داده شکل نامعتبر ایسه. سطران طول ناسازگار ایسه. componentIdx :{ $componentIdx } مئن پیدا بوبو

data-frame-duplicate-column-names = داده تکراری ستون نام دنه. componentIdx :{ $componentIdx } مئن پیدا بوبو

data-frame-missing-column-name = داده ایتا ستون نام کم دنه. componentIdx :{ $componentIdx } مئن پیدا بوبو

## `<answer>` and scoring

answer-award-depends-on-own-response = ای پاسخ ره ایتا award خود answer عنصر ارسال‌بوبو پاسخ سر بنا بوبو، کی غیرمنتظره رفتار به بار آورنه.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` همراه ظرفی درون `<answer>` سر `maxNumAttempts` ره تنظیم کودن هیچ اثر ندنه، چونکی تلاشان شمار ره ظرف تعیین کونه. اونه جا `maxNumAttempts` ره ظرف سر تنظیم بکونید.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` همراه ظرفی سر کی خودش `sectionWideCheckWork` همراه دیگر ظرفی درون ایسه، `maxNumAttempts` ره تنظیم کودن هیچ اثر ندنه، چونکی تلاشان شمار ره بیرونی ظرف تعیین کونه. `maxNumAttempts` ره بیرونی ظرف سر تنظیم بکونید.

answer-attributes-need-symbolic-equality = symbolicEquality ره تنظیم نوبون، { $attributes } ویژگی هیچ اثر ندنه.

answer-invalid-type = پاسخ ره نامعتبر نوع: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = چونکی `<{ $component }>` مؤلفه نام ندنه، اونه ایتا module ویژگی قرار دان ممکن نیه

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` مؤلفه ره ایتا module ویژگی قرار دان ممکن نیه، چونکی `<module>` مؤلفه نوع از پیش "{ $name }" نام همراه ویژگی‌ای دنه.

conditional-content-condition-ignored = `<conditionalContent>` مؤلفه‌ای کی case یا else فرزند دنه، اونه سر `condition` ویژگی نادیده گرفته بنه.

slider-markers-type-mismatch = نشانگران نوع لغزنده نوع همراه نمی‌خوانه.

pretzel-problem-needs-statement-and-answer = نامعتبر pretzel: هر `<problem>` واستی ایتا `<statement>` و ایتا `<answer>` بدأره.

pretzel-circuit-first-problem-distractor = نامعتبر pretzel: mode="circuit" مئن اولین `<problem>` گمراه‌کننده بوستن نتانه.

## Attribute values

attribute-invalid-values = `{ $attribute }` ویژگی ره { $values } مقدار نامعتبر ایسه؛ نادیده گرفته بنه.

attribute-must-be-references = `{ $attribute }` ویژگی ره `{ $value }` مقدار نامعتبر ایسه. ویژگی واستی ارجاعانی مئن‌جا ساخته ببه کی `$` همراه شروع بیدی.

math-input-invalid-function-names = <mathInput>: { $attribute } مئن نامعتبر تابع نامان نادیده گرفته بوبو: { $names }. هر نام نمایشی بخش واستی دست‌کم دو تا نویسه ببه (حرف یا خط تیره)؛ اونه دومبال شا ایتا اختیاری `|<mathspeak alternative>` پسوند بایه.

## Building components from the source

component-type-invalid = نامعتبر مؤلفه نوع: `<{ $componentType }>`

attribute-repeated = { $attribute } ویژگی ره تکرار کودن ممکن نیه.

attribute-invalid-for-component = `<{ $componentType }>` نوع مؤلفه‌ای ره "{ $attribute }" ویژگی نامعتبر ایسه.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } سبک تعریف کنتراست کافی نیه، { $context ->
        [text-on-background] پس‌زمینه رنگ برابر مئن متن رنگ ره
        [high-contrast] بوم برابر مئن پرکنتراست رنگ ره
        [line] بوم برابر مئن خط رنگ ره
        [marker] بوم برابر مئن نشانگر رنگ ره
       *[text-on-canvas] بوم برابر مئن متن رنگ ره
    }{ $mode ->
        [dark] { " (تیره حالت)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازمه).

style-definition-dark-mode-text-background-contrast =
    اگرچه { $styleNumber } سبک تعریف رنگانی مشخص بوکوده کی روشن حالت مئن کافی کنتراست دأریدی، تیره حالت رنگان کی اوشان‌جا مشتق بیدی، متن رنگ و پس‌زمینه رنگ میان کافی کنتراست ندأریدی ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازمه). { $suggestion ->
        [available] تیره حالت مئن کافی کنتراست ره، یا روشن حالت کنتراست ره ویشتر بکونید (مثلاً { $lightAttribute }="{ $lightColor }") یا تیره حالت رنگ ره بازنویسی بکونید (مثلاً { $darkAttribute }="{ $darkColor }").
       *[none] تیره حالت مئن کافی کنتراست ره، روشن حالت کنتراست ره ویشتر بکونید یا مشتق‌بوبو رنگان ره textColorDarkMode و/یا backgroundColorDarkMode همراه بازنویسی بکونید.
    }

style-definition-dark-mode-text-canvas-contrast =
    اگرچه { $styleNumber } سبک تعریف متن رنگی مشخص بوکوده کی روشن حالت مئن کافی کنتراست دنه، تیره حالت متن رنگ کی اون‌جا مشتق بنه بوم برابر مئن کافی کنتراست ندنه ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازمه). { $suggestion ->
        [available] تیره حالت مئن کافی کنتراست ره، یا روشن حالت کنتراست ره ویشتر بکونید (مثلاً textColor="{ $lightColor }") یا تیره حالت رنگ ره بازنویسی بکونید (مثلاً textColorDarkMode="{ $darkColor }").
       *[none] تیره حالت مئن کافی کنتراست ره، روشن حالت کنتراست ره ویشتر بکونید یا مشتق‌بوبو رنگ ره textColorDarkMode همراه بازنویسی بکونید.
    }

section-multiple-style-palettes = ایتا بخش فقط ایتا <stylePalette> ره انتخاب کودن تانه؛ آخری اون به کار شونه.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } مؤلفه یکتا نسخه‌ان ره تعیین کودن ممکن نیه، چونکی numToSelect نامنفی صحیح عدد نیه.

variant-num-to-select-not-constant-number = { $component } مؤلفه یکتا نسخه‌ان ره تعیین کودن ممکن نیه، چونکی numToSelect ثابت عدد نیه.

variant-with-replacement-not-constant-boolean = { $component } مؤلفه یکتا نسخه‌ان ره تعیین کودن ممکن نیه، چونکی withReplacement ثابت بولی مقدار نیه.

variant-select-weight-disables-unique = اگه ایتا گزینه selectWeight یا selectForVariants بدأره، select ره یکتا نسخه‌ان کار نکونیدی

variant-coprime-undetermined = { $component } مؤلفه یکتا نسخه‌ان ره تعیین کودن ممکن نیه، چونکی مطمئن بوستن نتانیم coprime همیشک نادرسته.

variant-attribute-not-constant = { $component } مؤلفه یکتا نسخه‌ان ره تعیین کودن ممکن نیه، چونکی { $attribute } ثابت نیه.

variant-attribute-not-number = { $component } مؤلفه یکتا نسخه‌ان ره تعیین کودن ممکن نیه، چونکی { $attribute } عدد نیه.

variant-attribute-wrong-type-for-sequence =
    { $type } نوع { $component } مؤلفه یکتا نسخه‌ان ره تعیین کودن ممکن نیه، چونکی { $attribute } { $expected ->
        [letters-combination] حروف ترکیب
        [math-expression] معتبر ریاضی عبارت
        [integer] صحیح عدد
       *[number] عدد
    } نیه.

variant-length-not-integer = { $component } مؤلفه یکتا نسخه‌ان ره تعیین کودن ممکن نیه، چونکی length صحیح عدد نیه.

variant-sort-not-implemented = sort همراه { $component } یکتا نسخه‌ان پیاده‌سازی نوبوسته

variant-exclude-combinations-not-implemented = excludeCombinations همراه { $component } یکتا نسخه‌ان پیاده‌سازی نوبوسته

variant-math-exclude-not-implemented = exclude همراه math نوع { $component } یکتا نسخه‌ان پیاده‌سازی نوبوسته

variant-non-constant-exclude-not-implemented = ناثابت exclude همراه { $component } یکتا نسخه‌ان پیاده‌سازی نوبوسته

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: نمودار prefigure نمایشگر مئن پشتیبانی نبنه؛ ای فرزند‌جا صرف‌نظر بوبو.

prefigure-descendant-invalid-geometry = { $subject }: نامتناهی یا ناقص هندسه؛ ای فرزند‌جا صرف‌نظر بوبو.

prefigure-curve-label-omitted = { $subject }: تبدیل‌بوبو منحنی عناصر سر برچسب پشتیبانی نبنه؛ برچسب حذف بوبو.

prefigure-curve-unsupported-definition-type = { $subject }: منحنی تابع تعریف نوع '{ $definitionType }' پشتیبانی نبنه؛ ای فرزند‌جا صرف‌نظر بوبو.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves سر flipFunctions ویژگی پشتیبانی نبنه؛ ای فرزند‌جا صرف‌نظر بوبو.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves سر فقط اون فرزند توابعی کی فرمول همراه تعریف بوبوسته پشتیبانی بیدی؛ ای فرزند‌جا صرف‌نظر بوبو.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] خط خانواده برچسب
       *[point] نقطه برچسب
    } ره labelPosition '{ $labelPosition }' پشتیبانی نبنه؛ PreFigure پیش‌فرض چینش به کار بوشو.

prefigure-fill-style-unsupported = { $subject }: PreFigure مئن '{ $fillStyle }' پرکردن سبک پشتیبانی نبنه؛ یکدست پرکردن به کار شونه.

prefigure-line-style-unknown = { $subject }: '{ $lineStyle }' خط سبک ناشناخته ایسه و PreFigure خروجی‌جا حذف بوبو.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' نشانگر سبک PreFigure مئن 'diamond' سبک ره نگاشته بوبو.

prefigure-marker-style-unsupported = { $subject }: PreFigure مئن '{ $markerStyle }' نشانگر سبک پشتیبانی نبنه؛ پیش‌فرض سبک به کار بوشو.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` نامعتبر ایسه؛ هدف مشخص نوبوسته. حاشیه‌نویسی حذف بوبو.

annotation-ref-multiple-targets = `<annotation>`: `ref` ایتا هدف ویشتر ره برسه؛ اولین هدف به کار شونه.

annotation-ref-outside-graph = `<annotation>`: `ref` نامعتبر ایسه؛ هدف دربرگیرنده نمودار بیرون ایسه. حاشیه‌نویسی حذف بوبو.

annotation-ref-unsupported-target = `<annotation>`: `ref` نامعتبر ایسه؛ هدف prefigure ره تبدیل مئن پشتیبانی‌بونه گرافیکی شیئی نیه. حاشیه‌نویسی حذف بوبو.

annotation-text-missing = `<annotation>`: `text` نبو یا خالی بو؛ خالی متن دأ بنه.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] حلقوی وابستگی شناسایی بوبو.
       *[other] حلقوی وابستگی شناسایی بوبو کی `<{ $componentType }>` مؤلفه ره دربر گیرنه.
    }

reference-no-referent = ای ارجاع ره هیچ مرجع پیدا نوبوسته: `{ $reference }`

reference-multiple-referents = ای ارجاع ره ایتا مرجع ویشتر پیدا بوبو: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` مئن { $attribute } ویژگی ره قالب نامعتبر ایسه.

children-invalid = `<{ $componentType }>` ره نامعتبر فرزندان: نامعتبر فرزندان پیدا بوبو: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` ویژگی ره `{ $value }` مقدار نامعتبر ایسه؛ `{ $default }` مقدار به کار شونه

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } نسخه پیدا نوبوسته.
       *[other] DoenetML { $version } نسخه پیدا نوبوسته. اونه جا { $fallback } نسخه به کار شونه
    }

## Reading the DoenetML

parse-invalid-doenetml = نامعتبر DoenetML: { $content }

parse-tag-missing-close-tag = نامعتبر DoenetML: `{ $tag }` برچسب پایانی برچسب ندنه. خودبسته برچسب یا `</{ $tagName }>` برچسب انتظار بوشو.

parse-tag-error = نامعتبر DoenetML: `<{ $tagName }>` برچسب مئن خطا

parse-attribute-missing-value = نامعتبر DoenetML: انگار نامعتبر ویژگی `{ $attribute }` مقدار ندنه.

parse-attribute-invalid = نامعتبر DoenetML: `{ $attribute }` ویژگی نامعتبر ایسه

parse-attribute-value-invalid = نامعتبر DoenetML: `{ $value }` ویژگی مقدار نامعتبر ایسه

parse-attribute-value-quote-mismatch = نامعتبر DoenetML: `{ $value }` ویژگی مقدار نامعتبر ایسه. گیومه‌ان هم ره نمی‌خوانیدی. انگار ایتا `{ $quote }` کم دأرید

parse-open-tag-name-missing = نامعتبر DoenetML: نام‌نیه برچسبی پیدا بوبو، مانستن `<`

parse-tag-not-closed = نامعتبر DoenetML: `{ $tag }` برچسب دوسته نوبوسته (انگار ایتا `>` کمه).

parse-self-closing-tag-name-missing = نامعتبر DoenetML: نام‌نیه برچسبی پیدا بوبو `<{ $content }>`

parse-self-closing-tag-not-closed = نامعتبر DoenetML: `{ $tag }` برچسب دوسته نوبوسته (انگار `/>` کمه).

parse-tag-invalid-attributes = نامعتبر DoenetML: `{ $tag }` برچسب معتبر نیه. شاید اونه ویژگی‌ان نادرست ببید.

parse-close-tag-name-missing = نامعتبر DoenetML: نام‌نیه پایانی برچسبی پیدا بوبو، مانستن `</`

parse-attribute-value-unquoted = ویژگی‌ان مقدار واستی گیومه درون بایه: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = نامعتبر DoenetML: `{ $tag }` پایانی برچسب پیدا بوبو، ولی متناظر آغازین برچسب ندنه

parse-close-tag-mismatched = نامعتبر DoenetML: ناسازگار پایانی برچسب. `</{ $expected }>` انتظار بوشو. `{ $found }` پیدا بوبو

parser-node-unconvertible = { $node } گره ره Dast گره ره تبدیل کودن ممکن نوبوسته.

## Names

name-attribute-invalid =
    name='{ $name }' ویژگی نامعتبر ایسه. { $reason ->
        [characters] نامان فقط شا حرف، رقم، زیرخط یا خط تیره بدأریدی.
       *[start] نامان واستی حرف همراه شروع ببید.
    }

component-name-invalid-start = "{ $name }" مؤلفه نام نامعتبر ایسه. نامان واستی حرف همراه شروع ببید.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched نوع همراه پاسخ واستی video ویژگی بدأره

answer-video-watched-video-not-reference = videoWatched نوع همراه پاسخ مئن video ویژگی واستی ایتا ارجاع ببه

answer-name-not-single-text = پاسخ مئن name ویژگی واستی ایتا متنی فرزند بدأره

## Referencing another document

external-doenetml-recursion-limit = خیلی بازگشت سبب‌جا بیرونی DoenetML ره گیتن ممکن نوبوسته. حلقوی ارجاع دره؟

external-doenetml-unavailable = { $attribute }="{ $uri }" جا DoenetML گیتن ممکن نوبوسته

external-doenetml-type-mismatch = { $attribute }="{ $uri }" جا گرفته‌بوبو DoenetML نامعتبر ایسه: "{ $componentType }" مؤلفه نوع همراه نمی‌خوانه

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` ویژگی منسوخ ایسه؛ اونه جا `{ $to }` ره به کار ببرید.
       *[other] [deprecation] `<{ $component }>` سر `{ $from }` ویژگی منسوخ ایسه؛ اونه جا `{ $to }` ره به کار ببرید.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` ویژگی منسوخ ایسه و نادیده گرفته بوبو، چونکی `{ $to }` هم مشخص بوبو.
       *[other] [deprecation] `<{ $component }>` سر `{ $from }` ویژگی منسوخ ایسه و نادیده گرفته بوبو، چونکی `{ $to }` هم مشخص بوبو.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` سر `{ $attribute }` ویژگی منسوخ ایسه و نادیده گرفته بوبو.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` سر `{ $attribute }` ویژگی منسوخ ایسه؛ اونه جا ایتا `<{ $child }>` فرزند به کار ببرید.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` سر `{ $attribute }` ویژگی ره `{ $value }` مقدار منسوخ ایسه؛ اونه جا `{ $to }` ره به کار ببرید.


## Language coverage

pluralize-english-only = `<pluralize>` فقط انگلیسی واژه‌ان ره تانه جمع ببنده، پس سندی کی { $locale } زبان همراه بنویشته بوبو مئن اونه متن دست‌نخورده مانه. جمع شکل ره مستقیم بنویسید، یا اونه `pluralForm` ویژگی همراه مشخص بکونید.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` عنصر Doenet مئن شناخته‌بوبو عنصری نیه.

schema-element-not-allowed-at-root = `<{ $tag }>` عنصر سند ریشه مئن مجاز نیه.

schema-element-not-allowed-inside = `<{ $tag }>` عنصر `<{ $parent }>` درون مجاز نیه.

schema-attribute-unrecognized = `<{ $tag }>` عنصر `{ $attribute }` نام همراه ویژگی‌ای ندنه.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` عنصر مئن `{ $attribute }` ویژگی واستی فهرستی ببه کی اونه هر درایه اینان‌جا ایتا ببه: { $allowed }
       *[other] `<{ $tag }>` عنصر مئن `{ $attribute }` ویژگی واستی اینان‌جا ایتا ببه: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select ره نامعتبر نسخه نام. { $variantName } نسخه نام { $numOptions } تا گزینه مئن آیه، ولی انتخاب شمار { $numToSelect } ایسه.

select-variant-name-without-options = select ره چند تا نسخه مشخص بوبو، ولی ممکن نسخه نام ره هیچ گزینه مشخص نوبوسته: { $variantName }.

select-variant-name-not-possible = { $variantName } نسخه نام کی select ره مشخص بوبو، ممکن نسخه نامی نیه.

select-too-few-options = فقط { $numOptions } تا میان‌جا { $numToSelect } تا مؤلفه ره انتخاب کودن ممکن نیه.

select-from-sequence-too-few-values = { $length } طول همراه دنباله‌ای‌جا { $numToSelect } تا مقدار ره انتخاب کودن ممکن نیه.

select-from-sequence-indices-count-mismatch = select ره مشخص‌بوبو اندیسان شمار واستی انتخاب شمار همراه بخوانه

select-from-sequence-indices-not-integers = select ره مشخص‌بوبو اندیسان همه واستی صحیح عدد ببید

select-from-sequence-index-excluded = selectfromsequence مشخص‌بوبو اندیس مستثنا بوبوسته

select-from-sequence-indices-excluded-combination = selectfromsequence مشخص‌بوبو اندیسان مستثنا ترکیبی بو

select-from-sequence-coprime-not-positive-integers = نسبت‌به‌هم‌اول ترکیبان ره انتخاب کودن ممکن نیه، چونکی انتخاب مثبت صحیح عددان میان نیه.

select-from-sequence-coprime-common-factor = نسبت‌به‌هم‌اول عددان ره انتخاب کودن ممکن نیه. همه ممکن مقادیر مشترک عاملی دأریدی. ("from" یا "to" مشخص‌بوبو مقدار واستی "step" ره نسبت اول ببه.)

select-from-sequence-coprime-single-number = ایتا عددی کی 1 نیه اون‌جا نسبت‌به‌هم‌اول ترکیبان ره انتخاب کودن ممکن نیه.

select-from-sequence-excluded-too-many-combinations = selectFromSequence مئن 70% ویشتر ترکیبان مستثنا بوبو

select-from-sequence-coprime-none-found = نسبت‌به‌هم‌اول عددان ره انتخاب کودن ممکن نوبوسته. همه ممکن مقادیر مشترک عاملی دأریدی.

select-from-sequence-too-few-unique-values = { $numPossibleValues } طول همراه دنباله‌ای‌جا { $numToSelect } تا یکتا مقدار ره انتخاب کودن ممکن نیه

select-prime-numbers-too-few-values = { $numValues } طول همراه اول عددان فهرستی‌جا { $numToSelect } تا مقدار ره انتخاب کودن ممکن نیه

select-prime-numbers-values-count-mismatch = select ره مشخص‌بوبو مقادیر شمار واستی انتخاب شمار همراه بخوانه

select-prime-numbers-values-not-prime = select prime number ره مشخص‌بوبو مقادیر همه واستی اول عددان فهرست مئن ببید

select-prime-numbers-values-excluded-combination = selectPrimeNumbers مشخص‌بوبو مقادیر مستثنا ترکیبی بو

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers مئن 70% ویشتر ترکیبان مستثنا بوبو

select-random-combination-fluke = خیلی نامحتمل تصادف اثر‌جا، تصادفی مقادیر ترکیبی ره انتخاب کودن ممکن نوبوسته

select-random-value-fluke = خیلی نامحتمل تصادف اثر‌جا، تصادفی مقدار ره انتخاب کودن ممکن نوبوسته

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` ریاضی درون رسم نبنه؛ عبارت هوتویی حروف‌چینی بنه کی پیش از ورودی‌ان جاسازی بوستن بو. { $reason ->
        [not-inline] فقط ایتا `inline` انتخاب ورودی عبارت درون جا گیره؛ `inline` نوبون ایتا دکمه‌ان بلوکه.
        [expanded] ایتا `expanded` متن ورودی چندسطری جعبه ایسه، کی عبارت درون نیشتن ره خیلی گتّه.
        [on-graph] نمودار سر عبارت ایتا تک تصویر شکل مئن رسم بنه، کی ایتا کنترل ره جا ندنه.
       *[relative-width] اونه `width` نسبی ایسه (درصد یا `em`)، کی عبارت درون هیچی ندنه کی اونه همراه سنجیده ببه. عرض ره مطلق واحد همراه، مانستن `px`، بدید.
    }
