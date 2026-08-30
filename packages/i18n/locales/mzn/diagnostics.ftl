# Mazanderani (مازِرونی) warnings and errors. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth. Produced by the
# worker but addressed to whoever is looking at the screen, so selected by
# `uiLocale` rather than by the document's own language.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Plain Persian letters. No «ؤ», no «ۊ» — those belong to the
# Gilaki and Luri writing conventions, not to this one — and no vocalisation
# except in the handful of words that need it to be readable at all. A
# corrector who wants a pointed text should convert all four files together
# rather than point this one and leave the others bare.
#
# **What is Mazanderani here.** The copula («هسه» / «نیه», never «است» /
# «نیست»), the passive and inchoative «بونه» where Persian writes «می‌شود»,
# the plural «-ون» rather than «-ها», the numeral classifier «تا» with a
# singular noun, and head-final word order. Beyond those five, the vocabulary
# of this file is **Persian** — «مؤلفه», «ویژگی», «اندیس», «کنتراست»,
# «دسترس‌پذیری», «معتبر» — because Persian is the language Mazanderani speakers
# read software and mathematics in, and there is no Mazanderani technical
# register to reach for. A reviewer should expect to be rewriting sentences
# rather than correcting typos.
#
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `maxNumAttempts`,
# `selectFromSequence`, the tag names, `WCAG AA`, `[deprecation]`, `prefigure`
# / `PreFigure`, `mathjs` and `Dast` are DoenetML or foreign identifiers. They
# are part of the language, not prose, and stay in English exactly as written.
#
# **Counting.** `Intl.PluralRules` has no data for `mzn`, so nothing but `one`
# and `other` could ever be selected — and Mazanderani would not use them
# anyway, since a numeral is followed by «تا» and a **singular** noun. Every
# count select from the English is therefore collapsed: either to a single
# `*[other]` branch, or, where English distinguished the two only in a verb
# ("is ignored" against "are ignored"), dropped altogether so that one sentence
# covers both. The count argument then goes unused here, which is harmless — it
# stays in the English message for the languages that need it.
#
# **Punctuation.** «،» and «؛» for comma and semicolon, «؟» for a question
# mark. Brackets, quotes and the full stop are the same characters English
# uses, written opening-first in logical order; the bidi algorithm turns them
# round when the line is drawn.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = وقتی دِتا انتهایی نقطه مشخص بَیّه بائه، { $attributes } نادیده گرفته بونه

line-segment-attributes-ignored-with-endpoint-and-midpoint = وقتی یه انتهایی نقطه و یه میونی نقطه هردِتا مشخص بَیّه بائن، { $attributes } نادیده گرفته بونه

line-segment-midpoint-offset-without-midpoint = بدون میونی نقطه، midpointOffset هیچ اثری ندارنه

## `<line>`

line-points-undetermined-dimensions = خطی که نامشخص ابعادِ نقطه‌ون سَره رد بونه.

line-points-too-few-dimensions = خط بائد نقطه‌ونی سَره رد بَواشه که دست‌کم دِتا بُعد دارنه.

line-points-depend-on-variables = خط نقطه‌ونی سَره رد بونه که متغیرون ره وابسته هستنه: { $variables }.

line-equation-invalid-format = { $variable1 } و { $variable2 } متغیرون همراهِ خطِ معادله نامعتبر قالب دارنه.

## `<ray>`

ray-overprescribed-through = نیم‌خط ره through و endpoint و direction، هرسه‌تا، مشخص هاکردنه. مشخص‌بَیی through نادیده گرفته بونه.

ray-dimension-mismatch = نیم‌خط دله numDimensions نمی‌خوانه.

## `<vector>`

vector-overprescribed-head = بردار ره head و tail و displacement، هرسه‌تا، مشخص هاکردنه. مشخص‌بَیی head نادیده گرفته بونه.

vector-dimension-mismatch = بردار دله numDimensions نمی‌خوانه.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ره جذب بوندن ممکن نیه، چون nearestPoint حالتِ متغیر ره ندارنه.

constrain-to-without-nearest-point = `<{ $component }>` ره مقید هاکردن ممکن نیه، چون nearestPoint حالتِ متغیر ره ندارنه.

constrain-to-interior-without-nearest-point = `<{ $component }>` دِله ره مقید هاکردن ممکن نیه، چون nearestPoint حالتِ متغیر ره ندارنه.

## `<choiceInput>`

choice-input-label-position-ignored = درون‌خطی‌نیّه choiceInput دله، labelPosition نادیده گرفته بونه

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput دله مشخص‌بَیی indices نادیده گرفته بونه، چون اندیس‌ونِ شمار choice فرزندونِ شمار ره نمی‌خوانه.

pretzel-indices-count-mismatch = problem دله مشخص‌بَیی indices نادیده گرفته بونه، چون اندیس‌ونِ شمار problem فرزندونِ شمار ره نمی‌خوانه.

shuffle-indices-count-mismatch = shuffle دله مشخص‌بَیی indices نادیده گرفته بونه، چون اندیس‌ونِ شمار مؤلفه‌ونِ شمار ره نمی‌خوانه.

indices-ignored-out-of-range = { $component } دله مشخص‌بَیی indices نادیده گرفته بونه، چون چن تا اندیس بازه جه بیرون هسه.

pretzel-indices-repeated = pretzel دله مشخص‌بَیی indices نادیده گرفته بونه، چون چن تا اندیس تکراری هسه.

pretzel-circuit-first-index = circuit حالت دله، pretzel ِ مشخص‌بَیی indices نادیده گرفته بونه، چون نخستین اندیس بائد 1 بَواشه.

## `<shuffle>` and `<sort>`

string-children-need-type = تا `<{ $component }>` رشته‌ای فرزندون همراه کار هاکنه، بائد type ویژگی مشخص بَواشه.

invalid-type-defaulting-to-math = { $component } مؤلفه سِری { $type } نوع نامعتبر هسه. بائد math یا text یا number یا boolean بَواشه. math به کار شونه.

string-not-valid-component-to-arrange = "{ $value }" رشته معتبر مؤلفه‌ای نیه که { $component } بتونه اون ره بچینه. نادیده گرفته بونه.

## Types and variables

invalid-type-defaulting-to-number = { $type } نوع نامعتبر هسه؛ نوع رو number تنظیم بونه.

invalid-variable-value = یه متغیرِ نامعتبر مقدار: `{ $value }`

## Variants

variant-index-must-be-number = { $index } نسخه‌اندیس بائد عدد بَواشه

variant-index-must-be-integer = { $index } نسخه‌اندیس بائد صحیح عدد بَواشه

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` مطلق اندازه‌ون سِری پیاده نیّه. عرضون نسبی تنظیم بونه.

side-by-side-absolute-margins = `<{ $component }>` مطلق اندازه‌ون سِری پیاده نیّه. حاشیه‌ون نسبی تنظیم بونه.

side-by-side-no-block-child = `<{ $component }>` نامعتبر هسه: بائد دست‌کم یه بلوکی فرزند دارِ بَواشه.

## `<label>`

label-for-ignored-on-graphical = گرافیکی `<label>` رو `for` ویژگی نادیده گرفته بونه.

label-for-must-resolve-to-one = `<label>` رو `for` ویژگی بائد دقیقاً یه مؤلفه ره اشاره هاکنه.

label-for-unresolved = `<label>` رو `for` ویژگی هیچ مؤلفه‌ای ره نرسیه.

label-for-answer-with-authored-inputs = `<label>` رو `for` ویژگی `<answer>` ای ره اشاره کانده که ونه ورودی‌ون ره صراحتاً بنویشتنه؛ خودِ ورودی ره سرراست اشاره هاکنین.

label-for-answer-without-input = `<label>` رو `for` ویژگی `<answer>` ای ره اشاره کانده که برچسب‌گذاری سِری هیچ ورودی ندارنه.

label-for-must-reference-input-or-answer = `<label>` رو `for` ویژگی بائد یه ورودی یا یه `<answer>` ره اشاره هاکنه.

## Accessibility

accessibility-short-description-or-decorative = دسترس‌پذیری سِری، `<{ $component }>` بائد یا کوتاه توصیف دارِ بَواشه یا تزئینی مشخص بَواشه.

accessibility-video-short-description = دسترس‌پذیری سِری، `<video>` بائد کوتاه توصیف دارِ بَواشه.

accessibility-input-short-description-or-label = دسترس‌پذیری سِری، `<{ $component }>` بائد کوتاه توصیف یا برچسب دارِ بَواشه.

accessibility-answer-input-short-description-or-label = دسترس‌پذیری سِری، `<answer>` ای که ورودی سازنه بائد کوتاه توصیف یا برچسب دارِ بَواشه.

accessibility-short-description-contains-math = کوتاه توصیف نائد `<{ $component }>` ماننده ریاضی مؤلفه‌ون دارِ بَواشه. ریاضی ره کلمه همراه بنویسین.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } کنتراست بخشِ عنوانِ متن سِری کافی نیه (تیره حالت) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازم هسه).
       *[other] { $colorName } کنتراست بخشِ عنوانِ متن سِری کافی نیه ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازم هسه).
    }

## `<circle>`

circle-through-points-non-numerical = وقتی نقطه‌ون عددی مقدار ندارنه، { $count } تا نقطه سَره ردبونه `<circle>` پیاده نیّه.

circle-too-many-through-points = 3 تا نقطه جه بیشتر سَره ردبونه دایره ره حساب هاکردن ممکن نیه.

circle-overprescribed-radius-center-points = دایره ره شعاع و مرکز و گذرنقطه‌ون، هرسه‌تا مشخص‌بَیی، حساب هاکردن ممکن نیه.

circle-center-with-multiple-points = مشخص مرکز همراه دایره‌ای که یه نقطه جه بیشتر سَره رد بوه، حساب هاکردن ممکن نیه.

circle-radius-too-small = دایره ره حساب هاکردن ممکن نیه: چون دِتا نقطه فاصله { $distance } هسه، مشخص‌بَیی { $radius } شعاع خله کوچیک هسه.

circle-radius-with-many-points = مشخص شعاع همراه، دِتا نقطه جه بیشتر سَره ردبونه دایره ره سائتن ممکن نیه.

circle-invalid-center-or-through-points = دایره مرکز یا گذرنقطه‌ون نامعتبر هسه.

circle-radius-center-with-multiple-points = مشخص مرکز همراه دایره‌ای که یه نقطه جه بیشتر سَره رد بوه، ونه شعاع ره حساب هاکردن ممکن نیه.

circle-change-radius-non-numerical = دایره‌ای که غیرعددی نقطه‌ون سَره رد بونه، ونه شعاع ره عوض هاکردن ممکن نیه

circle-radius-with-points-non-numerical = وقتی عددی مقدار دست دله نیه، مشخص شعاع همراه یه نقطه جه بیشتر سَره ردبونه دایره ره سائتن ممکن نیه.

circle-change-center-non-numerical = دایره‌ای که غیرعددی نقطه‌ون سَره رد بونه، ونه مرکز ره عوض هاکردن پیاده نیّه.

## `<function>`

function-domain-insufficient-dimensions = تابعِ دامنه ابعاد کافی نیه. دامنه { $intervals } تا بازه دارنه، ولی تابع { $inputs } تا ورودی دارنه.

function-domain-invalid-format = تابعِ دامنه نامعتبر قالب دارنه.

function-ignoring-non-numerical =
    { $type ->
        [maximum] تابعِ غیرعددی بیشینه نادیده گرفته بونه.
        [minimum] تابعِ غیرعددی کمینه نادیده گرفته بونه.
        [extremum] تابعِ غیرعددی حد نهایی نادیده گرفته بونه.
        [point] تابعِ غیرعددی نقطه نادیده گرفته بونه.
        [slope] تابعِ غیرعددی شیب نادیده گرفته بونه.
       *[other] تابعِ غیرعددی { $type } نادیده گرفته بونه.
    }

function-ignoring-empty =
    { $type ->
        [maximum] تابعِ خالی بیشینه نادیده گرفته بونه.
        [minimum] تابعِ خالی کمینه نادیده گرفته بونه.
        [extremum] تابعِ خالی حد نهایی نادیده گرفته بونه.
        [point] تابعِ خالی نقطه نادیده گرفته بونه.
       *[other] تابعِ خالی { $type } نادیده گرفته بونه.
    }

function-points-too-close = تابع دِتا نقطه دارنه که وشونِ جا خله همدیگه ره نزدیک هسه. تابع ره تعریف هاکردن ممکن نیه.

function-iterates-input-output-mismatch = تابعِ تکرارون فقط وقتی ممکن هسه که ورودی‌ونِ شمار خروجی‌ونِ شمار همراه برابر بَواشه. این تابع { $inputs } تا ورودی و { $outputs } تا خروجی دارنه.

## `<sequence>`

sequence-invalid-length = دنباله طول نامعتبر هسه. بائد نامنفی صحیح عدد بَواشه.

sequence-invalid-step = دنباله گام نامعتبر هسه. { $type } نوعِ دنباله سِری بائد عدد بَواشه.

sequence-invalid-endpoint-number = عددی دنباله سِری "{ $attribute }" مقدار نامعتبر هسه. بائد عدد بَواشه.

sequence-invalid-endpoint-letters = حرفی دنباله سِری "{ $attribute }" مقدار نامعتبر هسه. بائد حرفونِ ترکیب بَواشه.

sequence-invalid-endpoint = دنباله سِری "{ $attribute }" مقدار نامعتبر هسه.

select-from-sequence-coprime-not-numbers = coprime نادیده گرفته بیّه، چون انتخاب عددون میون جه نیه

select-from-sequence-coprime-with-exclude-combinations = coprime نادیده گرفته بیّه، چون excludeCombinations مشخص بَیّه

## Resolving a `target`

target-not-found = `<{ $source }>` دله target مقدار نامعتبر هسه: هدف پیدا نیّه.

target-state-variable-not-found = `<{ $source }>` دله target مقدار نامعتبر هسه: `<{ $component }>` رو "{ $property }" نامِ حالت‌متغیر پیدا نیّه.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` متغیرون بائد مستقل متغیر همراه فرق دارِ بَوان.

ode-system-duplicate-variable-names = تکراری وابسته‌متغیر نامون همراه، دیفرانسیل معادله راست‌سمتِ توابع ره تعریف هاکردن ممکن نیه.

ode-system-rhs-function-error = دیفرانسیل معادله راست‌سمتِ تابع ره تعریف هاکردن ممکن نیه. mathjs تابع ره سائتن دله خطا دَره.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } تا خط میون زاویه ره تعریف هاکردن ممکن نیه

angle-invalid-through-point = `<angle>` مالِ through دله نامعتبر نقطه

parabola-vertex-too-many-points = مشخص رأس همراه سهمی‌ای که یه نقطه جه بیشتر سَره رد بوه، پیاده نیّه.

parabola-too-many-points = 3 تا نقطه جه بیشتر سَره ردبونه سهمی پیاده نیّه.

intersection-too-many-items = دِتا مورد جه بیشتر سِری اشتراک پیاده نیّه

## Other math components

ionic-compound-not-two-ions = یونی ترکیب دِتا یون جه غیر هیچی سِری پیاده نیّه.

ionic-compound-needs-cation-and-anion = یونی ترکیب فقط یه کاتیون و یه آنیون سِری پیاده بَیّه.

solve-equations-cannot-evaluate = معادله ره حل هاکردن ممکن نیه، چون معادله ارزیابی نیّه: { $equation }

math-operators-operand-number-required = وقتی یه ریاضی عملوند ره جدا کاندی، بائد operandNumber ره مشخص هاکنی.

eigen-decomposition-failed = ماتریسِ ویژه‌مقدارون ره حساب هاکردن ممکن نیّه

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: { $parameters } الگو دله نِمو، پس همیشه یه خالی‌جا همراه می‌خوانه.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ره تفسیر هاکردن ممکن نیّه. بائد none یا medium یا dense بَواشه، یا دِتا مثبت عدد که فاصله همراه جدا بَوه، ماننده grid="1 0.5". هیچ شبکه‌ای کشیه نَوونه.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` تابعی ره خوانه که { $expected ->
        [one] یه خروجی دارِ بَواشه، هر نقطه دله y' شیب، ماننده `y - x`
       *[other] دِتا خروجی دارِ بَواشه، هر نقطه دله بردار، ماننده `(y, -x)`
    }، ولی تابعی که وِره هدائه بیّه { $found } تا خروجی دارنه. { $alternative ->
        [none] هیچی کشیه نَوونه.
       *[other] اون تابع سِری `<{ $alternative }>` مؤلفه دَره. هیچی کشیه نَوونه.
    }

field-function-attribute-ignored-with-child = `function` ویژگی نادیده گرفته بونه، چون تابع مؤلفه دِله هم هدائه بیّه؛ اونی که دِله هسه به کار شونه. تابع ره فقط یکی از این دِتا راه همراه هاده.

field-variables-ignored =
    `<{ $component }>`: `variables` ویژگی اون عبارتِ متغیرون ره نوم کانده که سرراست مؤلفه دِله بنویشته بَیّه. { $reason ->
        [function-child] اینجه تابع ره `<function>` فرزند شکل هدائنه، که خودش وه متغیرون ره نوم کانده، پس `variables` نادیده گرفته بونه.
       *[no-expression] اینجه چنین عبارتی هدائه نَیّه، پس `variables` نادیده گرفته بونه.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure نمایشگر دله xLabelPosition="left" پشتیبانی نَوونه؛ right موضعِ رفتار به کار شونه.

prefigure-y-label-position-unsupported = `<graph>`: prefigure نمایشگر دله yLabelPosition="bottom" پشتیبانی نَوونه؛ top موضعِ رفتار به کار شونه.

prefigure-invalid-axis-bounds = `<graph>`: prefigure ره تبدیل سِری محورِ کرانون نامعتبر هسه؛ پیش‌فرض bbox (-10,-10,10,10) به کار شونه.

prefigure-invalid-width = `<graph>`: prefigure ره تبدیل سِری عرض نامعتبر هسه؛ نمودارِ پیش‌فرض عرض 425 به کار شونه.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ره تبدیل سِری aspectRatio نامعتبر هسه؛ پیش‌فرض ابعادنسبت 1 به کار شونه.

prefigure-grid-spacing-too-fine = `<graph>`: محورِ کرانون سِری شبکه فاصله خله ریز هسه؛ prefigure نمایشگر دله شبکه حذف بونه.

prefigure-annotations-not-rendered = `<graph>`: وقتی PreFigure نمایشگر به کار نَشو، حاشیه‌نویسی‌ون کشیه نَوونه.

multiple-annotations-children = `<graph>` دِله یه `<annotations>` فرزند جه بیشتر پیدا بیّه؛ آخری جه غیر همه نادیده گرفته بونه.

## Referring to other components

copy-unrecognized-component-type = ناشناخته مؤلفه‌نوع ره گسترش یا کپی هاکردن ممکن نیه: { $type }.

copy-prop-not-found = { $component } نوعِ مؤلفه رو { $property } ویژگی پیدا نیّه

collect-no-source = collect سِری هیچ منبعی پیدا نیّه.

collect-invalid-component-type = `<{ $component }>` نوعِ مؤلفه‌ون ره گرد هاکردن ممکن نیه، چون نامعتبر مؤلفه‌نوع هسه.

reference-index-unavailable = `{ $reference }` اندیس ره اشاره هاکردن ممکن نیه

## `<callAction>`

component-action-unavailable = `{ $reference }` مؤلفه رو { $action } ره صدا هاکردن ممکن نیه

## `<dataFrame>`

data-frame-inconsistent-row-lengths = داده شکل نامعتبر هسه. سطرونِ طول ناسازگار هسه. componentIdx :{ $componentIdx } دله پیدا بیّه

data-frame-duplicate-column-names = داده تکراری ستون‌نوم دارنه. componentIdx :{ $componentIdx } دله پیدا بیّه

data-frame-missing-column-name = داده یه ستون‌نوم کم دارنه. componentIdx :{ $componentIdx } دله پیدا بیّه

## `<answer>` and scoring

answer-award-depends-on-own-response = این پاسخِ یکی از award ون خودِ answer عنصرِ اِرسال‌بَیی جواب سَره سوار هسه، که غیرمنتظره رفتار پیش یارنه.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` دارِ ظرف دِله `<answer>` رو `maxNumAttempts` ره تنظیم هاکردن هیچ اثری ندارنه، چون تلاش‌ونِ شمار ره ظرف تعیین کانده. ونه جا `maxNumAttempts` ره ظرف رو تنظیم هاکنین.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` دارِ ظرفی که خودش یه دیگه `sectionWideCheckWork` دارِ ظرف دِله دَره، اون رو `maxNumAttempts` ره تنظیم هاکردن هیچ اثری ندارنه، چون تلاش‌ونِ شمار ره بیرونی ظرف تعیین کانده. `maxNumAttempts` ره بیرونی ظرف رو تنظیم هاکنین.

answer-attributes-need-symbolic-equality = بدون اینکه symbolicEquality تنظیم بَواشه، { $attributes } ویژگی هیچ اثری ندارنه.

answer-invalid-type = پاسخ سِری نامعتبر نوع: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = چون `<{ $component }>` مؤلفه نوم ندارنه، نَشونه اون ره یه module ویژگی قرار هدائن

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` مؤلفه ره نَشونه یه module ویژگی قرار هدائن، چون `<module>` مؤلفه‌نوع پیش جه "{ $name }" نامِ ویژگی دارنه.

conditional-content-condition-ignored = `<conditionalContent>` مؤلفه‌ای که case یا else فرزند دارنه، اون رو `condition` ویژگی نادیده گرفته بونه.

slider-markers-type-mismatch = نشانگرونِ نوع لغزنده نوع ره نمی‌خوانه.

pretzel-problem-needs-statement-and-answer = نامعتبر pretzel: هر `<problem>` بائد یه `<statement>` و یه `<answer>` دارِ بَواشه.

pretzel-circuit-first-problem-distractor = نامعتبر pretzel: mode="circuit" دله نخستین `<problem>` نَتونده گمراه‌کننده بَواشه.

## Attribute values

attribute-invalid-values = `{ $attribute }` ویژگی سِری { $values } مقدار نامعتبر هسه؛ نادیده گرفته بونه.

attribute-must-be-references = `{ $attribute }` ویژگی سِری `{ $value }` مقدار نامعتبر هسه. ویژگی بائد ارجاعونی جه سائته بَوه که `$` همراه شروع بونه.

math-input-invalid-function-names = <mathInput>: { $attribute } دله نامعتبر تابع‌نومون نادیده گرفته بیّه: { $names }. هر نومِ نمایشی بخش بائد دست‌کم دِتا نویسه بَواشه (حرف یا خط تیره)؛ ونه پشت سر شونه اختیاری `|<mathspeak alternative>` پسوند بَیره.

## Building components from the source

component-type-invalid = نامعتبر مؤلفه‌نوع: `<{ $componentType }>`

attribute-repeated = { $attribute } ویژگی ره نَشونه تکرار هاکردن.

attribute-invalid-for-component = `<{ $componentType }>` نوعِ مؤلفه سِری "{ $attribute }" ویژگی نامعتبر هسه.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } سبک‌تعریفِ کنتراست کافی نیه، { $context ->
        [text-on-background] پس‌زمینه رنگ ورِ متن رنگ سِری
        [high-contrast] بوم ورِ پرکنتراست رنگ سِری
        [line] بوم ورِ خط رنگ سِری
        [marker] بوم ورِ نشانگر رنگ سِری
       *[text-on-canvas] بوم ورِ متن رنگ سِری
    }{ $mode ->
        [dark] { " (تیره حالت)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازم هسه).

style-definition-dark-mode-text-background-contrast =
    هرچند { $styleNumber } سبک‌تعریف رنگونی مشخص هاکرده که روشن حالت دله کافی کنتراست دارنه، تیره حالتِ رنگون که وشون جه مشتق بونه، پس‌زمینه رنگ ورِ متن رنگ سِری کافی کنتراست ندارنه ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازم هسه). { $suggestion ->
        [available] تیره حالت دله کافی کنتراست سِری، یا روشن حالتِ کنتراست ره بیشتر هاکنین (مثلاً { $lightAttribute }="{ $lightColor }") یا تیره حالتِ رنگ ره بازنویسی هاکنین (مثلاً { $darkAttribute }="{ $darkColor }").
       *[none] تیره حالت دله کافی کنتراست سِری، روشن حالتِ کنتراست ره بیشتر هاکنین یا مشتق‌بَیی رنگون ره textColorDarkMode و/یا backgroundColorDarkMode همراه بازنویسی هاکنین.
    }

style-definition-dark-mode-text-canvas-contrast =
    هرچند { $styleNumber } سبک‌تعریف یه متن‌رنگ مشخص هاکرده که روشن حالت دله کافی کنتراست دارنه، تیره حالتِ متن‌رنگ که ونجه مشتق بونه، بوم ورِ کافی کنتراست ندارنه ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازم هسه). { $suggestion ->
        [available] تیره حالت دله کافی کنتراست سِری، یا روشن حالتِ کنتراست ره بیشتر هاکنین (مثلاً textColor="{ $lightColor }") یا تیره حالتِ رنگ ره بازنویسی هاکنین (مثلاً textColorDarkMode="{ $darkColor }").
       *[none] تیره حالت دله کافی کنتراست سِری، روشن حالتِ کنتراست ره بیشتر هاکنین یا مشتق‌بَیی رنگ ره textColorDarkMode همراه بازنویسی هاکنین.
    }

section-multiple-style-palettes = یه بخش فقط تونده یه <stylePalette> ره وچینه؛ آخری مورد به کار شونه.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } مؤلفه یکتا نسخه‌ون ره تعیین هاکردن ممکن نیه، چون numToSelect نامنفی صحیح عدد نیه.

variant-num-to-select-not-constant-number = { $component } مؤلفه یکتا نسخه‌ون ره تعیین هاکردن ممکن نیه، چون numToSelect ثابت عدد نیه.

variant-with-replacement-not-constant-boolean = { $component } مؤلفه یکتا نسخه‌ون ره تعیین هاکردن ممکن نیه، چون withReplacement ثابت بولی مقدار نیه.

variant-select-weight-disables-unique = اگه یه گزینه selectWeight یا selectForVariants دارِ بَواشه، select سِری یکتا نسخه‌ون از کار کَفِنه

variant-coprime-undetermined = { $component } مؤلفه یکتا نسخه‌ون ره تعیین هاکردن ممکن نیه، چون نَشونه مطمئن بیّن که coprime همیشه نادرست هسه.

variant-attribute-not-constant = { $component } مؤلفه یکتا نسخه‌ون ره تعیین هاکردن ممکن نیه، چون { $attribute } ثابت نیه.

variant-attribute-not-number = { $component } مؤلفه یکتا نسخه‌ون ره تعیین هاکردن ممکن نیه، چون { $attribute } عدد نیه.

variant-attribute-wrong-type-for-sequence =
    { $type } نوعِ { $component } مؤلفه یکتا نسخه‌ون ره تعیین هاکردن ممکن نیه، چون { $attribute } { $expected ->
        [letters-combination] حرفونِ ترکیب
        [math-expression] معتبر ریاضی عبارت
        [integer] صحیح عدد
       *[number] عدد
    } نیه.

variant-length-not-integer = { $component } مؤلفه یکتا نسخه‌ون ره تعیین هاکردن ممکن نیه، چون length صحیح عدد نیه.

variant-sort-not-implemented = sort همراهِ { $component } یکتا نسخه‌ون پیاده نیّه

variant-exclude-combinations-not-implemented = excludeCombinations همراهِ { $component } یکتا نسخه‌ون پیاده نیّه

variant-math-exclude-not-implemented = exclude همراهِ math نوعِ { $component } یکتا نسخه‌ون پیاده نیّه

variant-non-constant-exclude-not-implemented = ناثابت exclude همراهِ { $component } یکتا نسخه‌ون پیاده نیّه

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: نمودارِ prefigure نمایشگر دله پشتیبانی نَوونه؛ این فرزند جه صرف‌نظر بیّه.

prefigure-descendant-invalid-geometry = { $subject }: نامتناهی یا ناقص هندسه؛ این فرزند جه صرف‌نظر بیّه.

prefigure-curve-label-omitted = { $subject }: تبدیل‌بَیی منحنی عنصرون رو برچسب پشتیبانی نَوونه؛ برچسب حذف بیّه.

prefigure-curve-unsupported-definition-type = { $subject }: منحنی تابعِ تعریف‌نوع '{ $definitionType }' پشتیبانی نَوونه؛ این فرزند جه صرف‌نظر بیّه.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves رو flipFunctions ویژگی پشتیبانی نَوونه؛ این فرزند جه صرف‌نظر بیّه.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves رو فقط اون فرزندتوابعی پشتیبانی بونه که فرمول همراه تعریف بَیّه؛ این فرزند جه صرف‌نظر بیّه.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] خط‌خانواده برچسب
       *[point] نقطه برچسب
    } سِری labelPosition '{ $labelPosition }' پشتیبانی نَوونه؛ PreFigure پیش‌فرض چینش به کار بورده.

prefigure-fill-style-unsupported = { $subject }: PreFigure دله '{ $fillStyle }' پرکردن‌سبک پشتیبانی نَوونه؛ یکدست پرکردن به کار شونه.

prefigure-line-style-unknown = { $subject }: '{ $lineStyle }' خط‌سبک ناشناخته هسه و PreFigure خروجی جه حذف بیّه.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' نشانگرسبک PreFigure دله 'diamond' سبک ره نگاشته بیّه.

prefigure-marker-style-unsupported = { $subject }: PreFigure دله '{ $markerStyle }' نشانگرسبک پشتیبانی نَوونه؛ پیش‌فرض سبک به کار بورده.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` مقدار نامعتبر هسه؛ هدف مشخص نیّه. حاشیه‌نویسی حذف بیّه.

annotation-ref-multiple-targets = `<annotation>`: `ref` یه هدف جه بیشتر ره رسیه؛ نخستین هدف به کار شونه.

annotation-ref-outside-graph = `<annotation>`: `ref` مقدار نامعتبر هسه؛ هدف دربرگیرنده نمودار جه بیرون هسه. حاشیه‌نویسی حذف بیّه.

annotation-ref-unsupported-target = `<annotation>`: `ref` مقدار نامعتبر هسه؛ prefigure ره تبدیل دله، هدف پشتیبانی‌بَیی گرافیکی شیء نیه. حاشیه‌نویسی حذف بیّه.

annotation-text-missing = `<annotation>`: `text` مقدار نَیّه یا خالی بیّه؛ خالی متن هدائه بونه.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] حلقوی وابستگی شناسایی بیّه.
       *[other] حلقوی وابستگی شناسایی بیّه که `<{ $componentType }>` مؤلفه ره دربر گیرنه.
    }

reference-no-referent = این ارجاع سِری هیچ مرجعی پیدا نیّه: `{ $reference }`

reference-multiple-referents = این ارجاع سِری یه مرجع جه بیشتر پیدا بیّه: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` دله { $attribute } ویژگی نامعتبر قالب دارنه.

children-invalid = `<{ $componentType }>` سِری نامعتبر فرزندون: نامعتبر فرزندون پیدا بیّه: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` ویژگی سِری `{ $value }` مقدار نامعتبر هسه؛ `{ $default }` مقدار به کار شونه

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML مالِ { $version } نسخه پیدا نیّه.
       *[other] DoenetML مالِ { $version } نسخه پیدا نیّه. ونه جا { $fallback } نسخه به کار شونه
    }

## Reading the DoenetML

parse-invalid-doenetml = نامعتبر DoenetML: { $content }

parse-tag-missing-close-tag = نامعتبر DoenetML: `{ $tag }` برچسب پایانی برچسب ندارنه. خودبسته برچسب یا `</{ $tagName }>` برچسب انتظار بورده.

parse-tag-error = نامعتبر DoenetML: `<{ $tagName }>` برچسب دله خطا

parse-attribute-missing-value = نامعتبر DoenetML: اینتی به نظر یِنه که `{ $attribute }` نامعتبر ویژگی مقدار ندارنه.

parse-attribute-invalid = نامعتبر DoenetML: `{ $attribute }` ویژگی نامعتبر هسه

parse-attribute-value-invalid = نامعتبر DoenetML: `{ $value }` ویژگی‌مقدار نامعتبر هسه

parse-attribute-value-quote-mismatch = نامعتبر DoenetML: `{ $value }` ویژگی‌مقدار نامعتبر هسه. گیومه‌ون همدیگه ره نمی‌خوانه. اینتی به نظر یِنه که یه `{ $quote }` کم دارنی

parse-open-tag-name-missing = نامعتبر DoenetML: بی‌نوم برچسبی پیدا بیّه، ماننده `<`

parse-tag-not-closed = نامعتبر DoenetML: `{ $tag }` برچسب دَوِسته نیّه (اینتی به نظر یِنه که `>` کم هسه).

parse-self-closing-tag-name-missing = نامعتبر DoenetML: بی‌نوم برچسبی پیدا بیّه `<{ $content }>`

parse-self-closing-tag-not-closed = نامعتبر DoenetML: `{ $tag }` برچسب دَوِسته نیّه (اینتی به نظر یِنه که `/>` کم هسه).

parse-tag-invalid-attributes = نامعتبر DoenetML: `{ $tag }` برچسب معتبر نیه. شاید ونه ویژگی‌ون نادرست بَواشه.

parse-close-tag-name-missing = نامعتبر DoenetML: بی‌نوم پایانی برچسبی پیدا بیّه، ماننده `</`

parse-attribute-value-unquoted = ویژگی‌ونِ مقدار بائد گیومه دِله بَیره: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = نامعتبر DoenetML: `{ $tag }` پایانی برچسب پیدا بیّه، ولی متناظر آغازین برچسب ندارنه

parse-close-tag-mismatched = نامعتبر DoenetML: ناسازگار پایانی برچسب. `</{ $expected }>` انتظار بورده. `{ $found }` پیدا بیّه

parser-node-unconvertible = { $node } گره ره Dast گره ره تبدیل هاکردن ممکن نیّه.

## Names

name-attribute-invalid =
    name='{ $name }' ویژگی نامعتبر هسه. { $reason ->
        [characters] نومون فقط توننه حرف، رقم، زیرخط یا خط تیره دارِ بَوان.
       *[start] نومون بائد حرف همراه شروع بَوان.
    }

component-name-invalid-start = "{ $name }" مؤلفه‌نوم نامعتبر هسه. نومون بائد حرف همراه شروع بَوان.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched نوعِ پاسخ بائد video ویژگی دارِ بَواشه

answer-video-watched-video-not-reference = videoWatched نوعِ پاسخ دله video ویژگی بائد یه ارجاع بَواشه

answer-name-not-single-text = پاسخ دله name ویژگی بائد یه متنی فرزند دارِ بَواشه

## Referencing another document

external-doenetml-recursion-limit = خله بازگشت خاطر، بیرونی DoenetML ره بَیتن ممکن نیّه. حلقوی ارجاع دَره؟

external-doenetml-unavailable = { $attribute }="{ $uri }" جه DoenetML ره بَیتن ممکن نیّه

external-doenetml-type-mismatch = { $attribute }="{ $uri }" جه بَیته‌بَیی DoenetML نامعتبر هسه: "{ $componentType }" مؤلفه‌نوع ره نمی‌خوانه

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` ویژگی منسوخ هسه؛ ونه جا `{ $to }` ره به کار ببرین.
       *[other] [deprecation] `<{ $component }>` رو `{ $from }` ویژگی منسوخ هسه؛ ونه جا `{ $to }` ره به کار ببرین.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` ویژگی منسوخ هسه و نادیده گرفته بیّه، چون `{ $to }` هم مشخص بَیّه.
       *[other] [deprecation] `<{ $component }>` رو `{ $from }` ویژگی منسوخ هسه و نادیده گرفته بیّه، چون `{ $to }` هم مشخص بَیّه.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` رو `{ $attribute }` ویژگی منسوخ هسه و نادیده گرفته بیّه.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` رو `{ $attribute }` ویژگی منسوخ هسه؛ ونه جا یه `<{ $child }>` فرزند به کار ببرین.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` رو `{ $attribute }` ویژگی مالِ `{ $value }` مقدار منسوخ هسه؛ ونه جا `{ $to }` ره به کار ببرین.


## Language coverage

pluralize-english-only = `<pluralize>` فقط تونده انگلیسی کلمه‌ون ره جمع ببنده، پس سندی که { $locale } زبون همراه بنویشته بَیّه، ونه متن دست‌نخورده موندنه. جمعِ شکل ره سرراست بنویسین، یا اون ره `pluralForm` ویژگی همراه مشخص هاکنین.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` عنصر Doenet دله شناخته‌بَیی عنصری نیه.

schema-element-not-allowed-at-root = `<{ $tag }>` عنصر سندِ ریشه دله مجاز نیه.

schema-element-not-allowed-inside = `<{ $tag }>` عنصر `<{ $parent }>` دِله مجاز نیه.

schema-attribute-unrecognized = `<{ $tag }>` عنصر `{ $attribute }` نامِ ویژگی ندارنه.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` عنصر دله `{ $attribute }` ویژگی بائد فهرستی بَواشه که ونه هر درایه یکی از اینونه: { $allowed }
       *[other] `<{ $tag }>` عنصر دله `{ $attribute }` ویژگی بائد یکی از اینون بَواشه: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select سِری نامعتبر نسخه‌نوم. { $variantName } نسخه‌نوم { $numOptions } تا گزینه دله یِنه، ولی انتخابِ شمار { $numToSelect } هسه.

select-variant-name-without-options = select سِری چن تا نسخه مشخص بَیّه، ولی ممکن نسخه‌نوم سِری هیچ گزینه‌ای مشخص نَیّه: { $variantName }.

select-variant-name-not-possible = { $variantName } نسخه‌نوم که select سِری مشخص بَیّه، ممکن نسخه‌نومی نیه.

select-too-few-options = فقط { $numOptions } تا میون جه { $numToSelect } تا مؤلفه ره وچیندن ممکن نیه.

select-from-sequence-too-few-values = { $length } طولِ دنباله جه { $numToSelect } تا مقدار ره وچیندن ممکن نیه.

select-from-sequence-indices-count-mismatch = select سِری مشخص‌بَیی اندیس‌ونِ شمار بائد انتخابِ شمار ره بخوانه

select-from-sequence-indices-not-integers = select سِری مشخص‌بَیی اندیس‌ون همه بائد صحیح عدد بَوان

select-from-sequence-index-excluded = selectfromsequence مالِ مشخص‌بَیی اندیس مستثنا بَیّه بیه

select-from-sequence-indices-excluded-combination = selectfromsequence مالِ مشخص‌بَیی اندیس‌ون مستثنا ترکیبی بیه

select-from-sequence-coprime-not-positive-integers = نسبت‌به‌هم‌اول ترکیبون ره وچیندن ممکن نیه، چون انتخاب مثبت صحیح عددون میون جه نیه.

select-from-sequence-coprime-common-factor = نسبت‌به‌هم‌اول عددون ره وچیندن ممکن نیه. همه ممکن مقدارون یه مشترک عامل دارنه. ("from" یا "to" مالِ مشخص‌بَیی مقدار بائد "step" ره نسبت اول بَواشه.)

select-from-sequence-coprime-single-number = یه عدد جه که 1 نیه، نسبت‌به‌هم‌اول ترکیبون ره وچیندن ممکن نیه.

select-from-sequence-excluded-too-many-combinations = selectFromSequence دله ترکیبون جه 70% جه بیشتر مستثنا بیّه

select-from-sequence-coprime-none-found = نسبت‌به‌هم‌اول عددون ره وچیندن ممکن نیّه. همه ممکن مقدارون یه مشترک عامل دارنه.

select-from-sequence-too-few-unique-values = { $numPossibleValues } طولِ دنباله جه { $numToSelect } تا یکتا مقدار ره وچیندن ممکن نیه

select-prime-numbers-too-few-values = { $numValues } طولِ اول‌عددونِ فهرست جه { $numToSelect } تا مقدار ره وچیندن ممکن نیه

select-prime-numbers-values-count-mismatch = select سِری مشخص‌بَیی مقدارونِ شمار بائد انتخابِ شمار ره بخوانه

select-prime-numbers-values-not-prime = select prime number سِری مشخص‌بَیی مقدارون همه بائد اول‌عددونِ فهرست دله بَوان

select-prime-numbers-values-excluded-combination = selectPrimeNumbers مالِ مشخص‌بَیی مقدارون مستثنا ترکیبی بیه

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers دله ترکیبون جه 70% جه بیشتر مستثنا بیّه

select-random-combination-fluke = خله نامحتمل تصادف خاطر، تصادفی مقدارون جه ترکیبی ره وچیندن ممکن نیّه

select-random-value-fluke = خله نامحتمل تصادف خاطر، تصادفی مقدار ره وچیندن ممکن نیّه

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` ریاضی دِله کشیه نَوونه؛ عبارت اینتی حروف‌چینی بونه که پیش جه بیه، وقتی هنتا ورودی‌ون ره نَشویی ریاضی دِله بائتن. { $reason ->
        [not-inline] فقط `inline` انتخاب‌ورودی عبارت دِله جا گیرنه؛ بدون `inline` یه دکمه‌ون بلوک هسه.
        [expanded] `expanded` متن‌ورودی یه چندسطری جعبه هسه، که عبارت دِله بائتن سِری خله گت هسه.
        [on-graph] نمودار رو، عبارت یه یکپارچه عکس شکل کشیه بونه، که هیچ جا یه کنترل سِری ندارنه.
       *[relative-width] ونه `width` نسبی هسه (درصد یا `em`)، که عبارت دِله هیچی ندارنه که وه ره اندازه بَیره. عرض ره مطلق واحد همراه، ماننده `px`، هاده.
    }
