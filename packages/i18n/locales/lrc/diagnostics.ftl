# Northern Luri (لری شمالی) warnings and errors. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth. Produced by the
# worker but addressed to whoever is looking at the screen, so these are
# selected by `uiLocale`.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Perso-Arabic script, right to left, written throughout with
# **plain Persian letters** — و, ا, ی. The Luri Wikipedia's «ؤ» for /o/ and
# «ۊ» for /u/, which give the endonym «لۊری شومالی», are **not used in these
# files**: applied to only some of fifteen hundred technical messages the
# convention stops being a spelling and becomes noise. A corrector who prefers
# it must convert **all four files at once**, and must not leave the two
# systems mixed inside one catalog.
#
# One caveat about that rule: «ؤ» also occurs inside ordinary Persian
# loanwords spelled the Persian way — «مؤلفه» throughout these files — where
# it is a hamza on a wāw and not the Luri /o/ vowel. Those are not
# violations of the decision above, and should be left alone.
#
# **What is Luri here and what is not.** Almost every content word in this file
# is **Persian**. Diagnostics are about attributes, components, sequences and
# contrast ratios, and Luri has no register of its own for any of that — its
# speakers do this subject in Persian, and inventing Luri-looking respellings
# would produce a catalog no one could read. What is consistently Luri:
#
#   * the copula — «هه» for *is*, «نیه» for *is not*, «ممکن نیه» for *is not
#     possible*, never Persian «است» / «نیست»;
#   * the plural **«-یل»** — «نقطه‌یل», «مؤلفه‌یل», «اندیسیل», «مقداریل» — never
#     «-ها» or «-ان»;
#   * the numeral classifier «تا» with a singular noun — «3 تا نقطه»;
#   * «سی» for *for*, «ای» for *this*, «او» for *that*, «دووارته» for *again*.
#
# Luri's word order agrees with Persian's, so the **shape** of these sentences
# is close to `locales/fa/diagnostics.ftl`'s on purpose; the difference between
# the two catalogs is morphological rather than syntactic. A reviewer should
# expect to be **rewriting sentences**, not correcting typos.
#
# `through`, `endpoint`, `midpointOffset`, `numDimensions` and the like are
# DoenetML attribute and tag names. They are part of the language, not prose,
# and are left in English exactly as written — as are `WCAG AA`, `PreFigure`,
# `mathjs`, `Dast` and the `[deprecation]` marker.
#
# **Counting.** `Intl.PluralRules` has no data for `lrc`, so a `[one]` branch
# could never be selected by the language's own rules, and Luri would not want
# one: a noun after a numeral stays singular. Every count select is therefore
# collapsed to a single `*[other]`, or dropped entirely where both English
# branches then say the same thing in Luri. The unused count argument is
# harmless — it stays in the English message for the languages that need it.
#
# Punctuation: «،» and «؛» separate, «؟» asks. Brackets, quotes and the full
# stop are the same characters as in English and are written opening-first, in
# logical order; the bidi algorithm turns them around when the text is drawn.
# Digits are Latin, per the repository-wide policy.
#
# **Coverage.** Every key in `locales/en/diagnostics.ftl` is translated here.
# That makes this catalog wider than `locales/fa/diagnostics.ftl`, which has
# not caught up with the field, deprecation and embedded-input messages.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = وختی دو تا نقطهٔ انتهایی مشخص وابیه، { $attributes } نادیده گرته بونه

line-segment-attributes-ignored-with-endpoint-and-midpoint = وختی یه نقطهٔ انتهایی و یه نقطهٔ میانی با هم مشخص وابین، { $attributes } نادیده گرته بونه

line-segment-midpoint-offset-without-midpoint = بی نقطهٔ میانی، midpointOffset اثری ندارۀ

## `<line>`

line-points-undetermined-dimensions = خطی که از نقطه‌یلی با ابعاد نامشخص رد بونه.

line-points-too-few-dimensions = خط باید از نقطه‌یلی با دست‌کم دو تا بُعد رد بو.

line-points-depend-on-variables = خط از نقطه‌یلی رد بونه که به متغیریل وابسته‌ن: { $variables }.

line-equation-invalid-format = قالب معادلهٔ خط با متغیریل { $variable1 } و { $variable2 } نامعتبر هه.

## `<ray>`

ray-overprescribed-through = نیم‌خط با through و endpoint و direction مشخص وابیه. through مشخص‌وابیه نادیده گرته بونه.

ray-dimension-mismatch = ناسازگاری numDimensions در نیم‌خط.

## `<vector>`

vector-overprescribed-head = بردار با head و tail و displacement مشخص وابیه. head مشخص‌وابیه نادیده گرته بونه.

vector-dimension-mismatch = ناسازگاری numDimensions در بردار.

## Attracting and constraining

attract-to-without-nearest-point = جذب به `<{ $component }>` ممکن نیه، چون متغیر حالت nearestPoint ره ندارۀ.

constrain-to-without-nearest-point = مقید کردن به `<{ $component }>` ممکن نیه، چون متغیر حالت nearestPoint ره ندارۀ.

constrain-to-interior-without-nearest-point = مقید کردن به درون `<{ $component }>` ممکن نیه، چون متغیر حالت nearestPoint ره ندارۀ.

## `<choiceInput>`

choice-input-label-position-ignored = در choiceInput غیرِ درون‌خطی، labelPosition نادیده گرته بونه

## Ordering children by index

choice-input-indices-count-mismatch = indices مشخص‌وابیه در choiceInput نادیده گرته بونه، چون شمار اندیسیل با شمار فرزندیل choice نمخونه.

pretzel-indices-count-mismatch = indices مشخص‌وابیه در problem نادیده گرته بونه، چون شمار اندیسیل با شمار فرزندیل problem نمخونه.

shuffle-indices-count-mismatch = indices مشخص‌وابیه در shuffle نادیده گرته بونه، چون شمار اندیسیل با شمار مؤلفه‌یل نمخونه.

indices-ignored-out-of-range = indices مشخص‌وابیه در { $component } نادیده گرته بونه، چون بعضی اندیسیل خارج از بازه‌ن.

pretzel-indices-repeated = indices مشخص‌وابیه در pretzel نادیده گرته بونه، چون بعضی اندیسیل تکراری‌ن.

pretzel-circuit-first-index = indices مشخص‌وابیه در pretzel در حالت circuit نادیده گرته بونه، چون اندیس نخست باید 1 بو.

## `<shuffle>` and `<sort>`

string-children-need-type = سی اینکه `<{ $component }>` با فرزندیل رشته‌ای کار کنه، باید ویژگی type مشخص بو.

invalid-type-defaulting-to-math = نوع { $type } سی مؤلفهٔ { $component } نامعتبر هه. باید یکی از math، text، number یا boolean بو. math به کار رۀ.

string-not-valid-component-to-arrange = رشتهٔ "{ $value }" مؤلفهٔ معتبری نیه که { $component } بتونه او ره بچینه. نادیده گرته بونه.

## Types and variables

invalid-type-defaulting-to-number = نوع { $type } نامعتبر هه؛ نوع سر number تنظیم بونه.

invalid-variable-value = مقدار نامعتبر یه متغیر: `{ $value }`

## Variants

variant-index-must-be-number = اندیس نسخه { $index } باید عدد بو

variant-index-must-be-integer = اندیس نسخه { $index } باید عدد صحیح بو

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` سی اندازه‌یل مطلق پیاده‌سازی نوابیه. عرضیل نسبی تنظیم بونه.

side-by-side-absolute-margins = `<{ $component }>` سی اندازه‌یل مطلق پیاده‌سازی نوابیه. حاشیه‌یل نسبی تنظیم بونه.

side-by-side-no-block-child = `<{ $component }>` نامعتبر هه: باید دست‌کم یه فرزند بلوکی داشته بو.

## `<label>`

label-for-ignored-on-graphical = ویژگی `for` سر `<label>` گرافیکی نادیده گرته بونه.

label-for-must-resolve-to-one = ویژگی `for` سر `<label>` باید دقیقاً به یه مؤلفه اشاره کنه.

label-for-unresolved = ویژگی `for` سر `<label>` به هیچ مؤلفه‌ای نرسی.

label-for-answer-with-authored-inputs = ویژگی `for` سر `<label>` به `<answer>` ای اشاره کنه که ورودی‌یلش صریحاً نوشته وابیه؛ مستقیم به خود ورودی اشاره کنین.

label-for-answer-without-input = ویژگی `for` سر `<label>` به `<answer>` ای اشاره کنه که ورودی‌ای سی برچسب‌گذاری ندارۀ.

label-for-must-reference-input-or-answer = ویژگی `for` سر `<label>` باید به یه ورودی یا به یه `<answer>` اشاره کنه.

## Accessibility

accessibility-short-description-or-decorative = سی دسترس‌پذیری، `<{ $component }>` باید توصیف کوتاه داشته بو یا تزئینی مشخص بو.

accessibility-video-short-description = سی دسترس‌پذیری، `<video>` باید توصیف کوتاه داشته بو.

accessibility-input-short-description-or-label = سی دسترس‌پذیری، `<{ $component }>` باید توصیف کوتاه یا برچسب داشته بو.

accessibility-answer-input-short-description-or-label = سی دسترس‌پذیری، `<answer>` ای که ورودی سازه باید توصیف کوتاه یا برچسب داشته بو.

accessibility-short-description-contains-math = توصیف کوتاه نباید مؤلفه‌یل ریاضی مثل `<{ $component }>` داشته بو. ریاضیات ره با واژه بنویسین.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] کنتراست { $colorName } سی متن عنوان بخش کافی نیه (حالت تیره) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازم هه).
       *[other] کنتراست { $colorName } سی متن عنوان بخش کافی نیه ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازم هه).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` رد‌بونه از { $count } تا نقطه، وختی نقطه‌یل مقدار عددی ندارن، پیاده‌سازی نوابیه.

circle-too-many-through-points = محاسبهٔ دایره‌ای که از بیشتر از 3 تا نقطه رد بو ممکن نیه.

circle-overprescribed-radius-center-points = محاسبهٔ دایره با شعاع و مرکز و نقطه‌یل گذر، هر سه مشخص‌وابیه، ممکن نیه.

circle-center-with-multiple-points = محاسبهٔ دایره با مرکز مشخص که از بیشتر از یه نقطه رد بو ممکن نیه.

circle-radius-too-small = محاسبهٔ دایره ممکن نیه: چون فاصلهٔ دو تا نقطه { $distance } هه، شعاع مشخص‌وابیهٔ { $radius } خیلی کوچیک هه.

circle-radius-with-many-points = ساختن دایره‌ای که با شعاع مشخص از بیشتر از دو تا نقطه رد بو ممکن نیه.

circle-invalid-center-or-through-points = مرکز یا نقطه‌یل گذر دایره نامعتبر هه.

circle-radius-center-with-multiple-points = محاسبهٔ شعاع دایره با مرکز مشخص که از بیشتر از یه نقطه رد بو ممکن نیه.

circle-change-radius-non-numerical = تغییر شعاع دایره‌ای که از نقطه‌یل غیرعددی رد بونه ممکن نیه

circle-radius-with-points-non-numerical = ساختن دایره‌ای که با شعاع مشخص از بیشتر از یه نقطه رد بو، وختی مقدار عددی در دست نیه، ممکن نیه.

circle-change-center-non-numerical = تغییر مرکز دایره‌ای که از نقطه‌یل غیرعددی رد بونه پیاده‌سازی نوابیه.

## `<function>`

# Two counts in one sentence in English, each with its own singular. Luri
# leaves the noun singular after a numeral either way, so both selects are
# dropped and the sentence is written once.
function-domain-insufficient-dimensions = ابعاد دامنهٔ تابع کافی نیه. دامنه { $intervals } تا بازه دارۀ، ولی تابع { $inputs } تا ورودی دارۀ.

function-domain-invalid-format = قالب دامنهٔ تابع نامعتبر هه.

function-ignoring-non-numerical =
    { $type ->
        [maximum] بیشینهٔ غیرعددی تابع نادیده گرته بونه.
        [minimum] کمینهٔ غیرعددی تابع نادیده گرته بونه.
        [extremum] حد نهایی غیرعددی تابع نادیده گرته بونه.
        [point] نقطهٔ غیرعددی تابع نادیده گرته بونه.
        [slope] شیب غیرعددی تابع نادیده گرته بونه.
       *[other] { $type } غیرعددی تابع نادیده گرته بونه.
    }

function-ignoring-empty =
    { $type ->
        [maximum] بیشینهٔ خالی تابع نادیده گرته بونه.
        [minimum] کمینهٔ خالی تابع نادیده گرته بونه.
        [extremum] حد نهایی خالی تابع نادیده گرته بونه.
        [point] نقطهٔ خالی تابع نادیده گرته بونه.
       *[other] { $type } خالی تابع نادیده گرته بونه.
    }

function-points-too-close = تابع دو تا نقطه دارۀ که جاشون خیلی به هم نزدیک هه. تعریف تابع ممکن نیه.

function-iterates-input-output-mismatch = تکراریل تابع فقط وختی ممکن هه که شمار ورودی‌یل با شمار خروجی‌یل برابر بو. ای تابع { $inputs } تا ورودی و { $outputs } تا خروجی دارۀ.

## `<sequence>`

sequence-invalid-length = طول دنباله نامعتبر هه. باید عدد صحیح نامنفی بو.

sequence-invalid-step = گام دنباله نامعتبر هه. سی دنبالهٔ نوع { $type } باید عدد بو.

sequence-invalid-endpoint-number = مقدار "{ $attribute }" سی دنبالهٔ عددی نامعتبر هه. باید عدد بو.

sequence-invalid-endpoint-letters = مقدار "{ $attribute }" سی دنبالهٔ حرفی نامعتبر هه. باید ترکیبی از حرفیل بو.

sequence-invalid-endpoint = مقدار "{ $attribute }" سی دنباله نامعتبر هه.

select-from-sequence-coprime-not-numbers = coprime نادیده گرته وابی، چون گزینش از میان عددیل نیه

select-from-sequence-coprime-with-exclude-combinations = coprime نادیده گرته وابی، چون excludeCombinations مشخص وابیه

## Resolving a `target`

target-not-found = مقدار target در `<{ $source }>` نامعتبر هه: هدف پیدا نوابی.

target-state-variable-not-found = مقدار target در `<{ $source }>` نامعتبر هه: متغیر حالتی به نام "{ $property }" سر `<{ $component }>` پیدا نوابی.

## `<odeSystem>`

# «سمت راست» is the right-hand side of the equation and stays the right one:
# mathematics is a left-to-right island inside a right-to-left document, so the
# equation the phrase names is drawn the same way round as in English.
ode-system-variables-match-independent = متغیریل `<odeSystem>` باید با متغیر مستقل فرق داشته بون.

ode-system-duplicate-variable-names = تعریف توابع سمت راست معادلهٔ دیفرانسیل با نامیل متغیر وابستهٔ تکراری ممکن نیه.

ode-system-rhs-function-error = تعریف تابع سمت راست معادلهٔ دیفرانسیل ممکن نیه. خطا در ساخت تابع mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = تعریف زاویه میان { $count } تا خط ممکن نیه

angle-invalid-through-point = نقطهٔ نامعتبر در through مربوط به `<angle>`

parabola-vertex-too-many-points = سهمی با رأس مشخص که از بیشتر از یه نقطه رد بو پیاده‌سازی نوابیه.

parabola-too-many-points = سهمی که از بیشتر از 3 تا نقطه رد بو پیاده‌سازی نوابیه.

intersection-too-many-items = اشتراک سی بیشتر از دو تا مورد پیاده‌سازی نوابیه

## Other math components

ionic-compound-not-two-ions = ترکیب یونی سی چیزی جز دو تا یون پیاده‌سازی نوابیه.

ionic-compound-needs-cation-and-anion = ترکیب یونی فقط سی یه کاتیون و یه آنیون پیاده‌سازی وابیه.

solve-equations-cannot-evaluate = حل معادله ممکن نیه، چون معادله ارزیابی نوابی: { $equation }

math-operators-operand-number-required = وختی یه عملوند ریاضی استخراج بونه باید operandNumber مشخص بو.

eigen-decomposition-failed = محاسبهٔ مقادیر ویژهٔ ماتریس ممکن نوابی

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: پارامتریل { $parameters } در الگو نیان، پس همیشه با یه جای خالی مطابقت کنن.

## `<graph>`

graph-grid-invalid = `<graph>`: تفسیر grid="{ $grid }" ممکن نوابی. باید none یا medium یا dense بو، یا دو تا عدد مثبت که با فاصله جدا وابین، مثل grid="1 0.5". هیچ شبکه‌ای رسم نبونه.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` تابعی خوانه که { $expected ->
        [one] یه خروجی داشته بو، یعنی شیب y' در هر نقطه، مثل `y - x`
       *[other] دو تا خروجی داشته بو، یعنی بردار در هر نقطه، مثل `(y, -x)`
    }، ولی تابعی که به او داده وابیه { $found } تا خروجی دارۀ. { $alternative ->
        [none] هیچی رسم نبونه.
       *[other] `<{ $alternative }>` مؤلفهٔ درست سی ای تابع هه. هیچی رسم نبونه.
    }

field-function-attribute-ignored-with-child = ویژگی `function` نادیده گرته بونه، چون تابع درون خود مؤلفه هم داده وابیه؛ همو که درون هه به کار رۀ. تابع ره فقط به یکی از ای دو راه بدین.

field-variables-ignored =
    `<{ $component }>`: ویژگی `variables` نام متغیریل عبارتی ره گوه که مستقیم درون مؤلفه نوشته وابیه. { $reason ->
        [function-child] تابع ایچه به شکل فرزند `<function>` داده وابیه، که خودش متغیریلش ره نوم‌گذاری کنه، پس `variables` نادیده گرته بونه.
       *[no-expression] همچه عبارتی ایچه داده نوابیه، پس `variables` نادیده گرته بونه.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: مقدار xLabelPosition="left" در نمایشگر prefigure پشتیبانی نبونه؛ رفتار موضع right به کار رۀ.

prefigure-y-label-position-unsupported = `<graph>`: مقدار yLabelPosition="bottom" در نمایشگر prefigure پشتیبانی نبونه؛ رفتار موضع top به کار رۀ.

prefigure-invalid-axis-bounds = `<graph>`: کرانیل محور سی تبدیل به prefigure نامعتبر هه؛ bbox پیش‌فرض (-10,-10,10,10) به کار رۀ.

prefigure-invalid-width = `<graph>`: عرض سی تبدیل به prefigure نامعتبر هه؛ عرض پیش‌فرض نمودار 425 به کار رۀ.

prefigure-invalid-aspect-ratio = `<graph>`: مقدار aspectRatio سی تبدیل به prefigure نامعتبر هه؛ نسبت ابعاد پیش‌فرض 1 به کار رۀ.

prefigure-grid-spacing-too-fine = `<graph>`: فاصلهٔ شبکه سی کرانیل محور خیلی ریز هه؛ شبکه در نمایشگر prefigure حذف بونه.

prefigure-annotations-not-rendered = `<graph>`: وختی نمایشگر PreFigure به کار نره، حاشیه‌نویسی‌یل رسم نبونن.

multiple-annotations-children = بیشتر از یه فرزند `<annotations>` در `<graph>` پیدا وابی؛ همه جز آخری نادیده گرته بونن.

## Referring to other components

copy-unrecognized-component-type = گسترش یا کپی کردن نوع مؤلفهٔ ناشناخته ممکن نیه: { $type }.

copy-prop-not-found = ویژگی { $property } سر مؤلفه‌ای از نوع { $component } پیدا نوابی

collect-no-source = منبعی سی collect پیدا نوابی.

collect-invalid-component-type = گردآوری مؤلفه‌یل نوع `<{ $component }>` ممکن نیه، چون نوع مؤلفهٔ نامعتبری هه.

reference-index-unavailable = ارجاع به اندیس `{ $reference }` ممکن نیه

## `<callAction>`

component-action-unavailable = فراخوانی { $action } سر مؤلفهٔ `{ $reference }` ممکن نیه

## `<dataFrame>`

data-frame-inconsistent-row-lengths = شکل داده نامعتبر هه. طول سطریل ناسازگار هه. در componentIdx :{ $componentIdx } پیدا وابی

data-frame-duplicate-column-names = داده نام ستون تکراری دارۀ. در componentIdx :{ $componentIdx } پیدا وابی

data-frame-missing-column-name = داده یه نام ستون کم دارۀ. در componentIdx :{ $componentIdx } پیدا وابی

## `<answer>` and scoring

answer-award-depends-on-own-response = یکی از award یل ای پاسخ بر پایهٔ پاسخ ارسال‌وابیهٔ خود عنصر answer هه، که رفتار غیرمنتظره به بار آرۀ.

answer-max-num-attempts-in-section-wide-check-work = تنظیم `maxNumAttempts` سر `<answer>` درون ظرفی با `sectionWideCheckWork` اثری ندارۀ، چون شمار تلاشیل ره ظرف تعیین کنه. به جاش `maxNumAttempts` ره سر ظرف تنظیم کنین.

nested-section-wide-check-work-max-num-attempts = تنظیم `maxNumAttempts` سر ظرفی با `sectionWideCheckWork` که خودش درون ظرف دیگه‌ای با `sectionWideCheckWork` هه اثری ندارۀ، چون شمار تلاشیل ره ظرف بیرونی تعیین کنه. `maxNumAttempts` ره سر ظرف بیرونی تنظیم کنین.

answer-attributes-need-symbolic-equality = ویژگی‌یل { $attributes } بی تنظیم symbolicEquality اثری ندارن.

answer-invalid-type = نوع نامعتبر سی پاسخ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = چون مؤلفهٔ `<{ $component }>` نام ندارۀ، نتونه ویژگی یه module بو

module-attribute-name-already-defined = مؤلفهٔ `<{ $component } name="{ $name }">` نتونه ویژگی یه module بو، چون نوع مؤلفهٔ `<module>` از پیش ویژگی‌ای به نام "{ $name }" دارۀ.

conditional-content-condition-ignored = ویژگی `condition` سر مؤلفهٔ `<conditionalContent>` که فرزند case یا else دارۀ نادیده گرته بونه.

slider-markers-type-mismatch = نوع نشانگریل با نوع لغزنده نمخونه.

pretzel-problem-needs-statement-and-answer = pretzel نامعتبر: هر `<problem>` باید یه `<statement>` و یه `<answer>` داشته بو.

pretzel-circuit-first-problem-distractor = pretzel نامعتبر: در mode="circuit" نخستین `<problem>` نتونه گمراه‌کننده بو.

## Attribute values

attribute-invalid-values = مقداریل { $values } سی ویژگی `{ $attribute }` نامعتبر هه؛ نادیده گرته بونه.

attribute-must-be-references = مقدار `{ $value }` سی ویژگی `{ $attribute }` نامعتبر هه. ویژگی باید از ارجاعیلی ساخته بو که با `$` شروع بونن.

math-input-invalid-function-names = <mathInput>: نامیل تابع نامعتبر در { $attribute } نادیده گرته وابی: { $names }. بخش نمایشی هر نام باید دست‌کم دو تا نویسه بو (حرف یا خط تیره)؛ بعدش تونه پسوند اختیاری `|<mathspeak alternative>` بیا.

## Building components from the source

component-type-invalid = نوع مؤلفهٔ نامعتبر: `<{ $componentType }>`

attribute-repeated = ویژگی { $attribute } ره نتونین تکرار کنین.

attribute-invalid-for-component = ویژگی "{ $attribute }" سی مؤلفه‌ای از نوع `<{ $componentType }>` نامعتبر هه.

## Style definition contrast

style-definition-insufficient-contrast =
    کنتراست تعریف سبک { $styleNumber } کافی نیه، در { $context ->
        [text-on-background] رنگ متن در برابر رنگ پس‌زمینه
        [high-contrast] رنگ پرکنتراست در برابر بوم
        [line] رنگ خط در برابر بوم
        [marker] رنگ نشانگر در برابر بوم
       *[text-on-canvas] رنگ متن در برابر بوم
    }{ $mode ->
        [dark] { " (حالت تیره)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازم هه).

style-definition-dark-mode-text-background-contrast =
    هرچند تعریف سبک { $styleNumber } رنگیلی مشخص کرده که در حالت روشن کنتراست کافی دارن، رنگیل حالت تیره که از اونا مشتق بونن کنتراست کافی میان رنگ متن و رنگ پس‌زمینه ندارن ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازم هه). { $suggestion ->
        [available] سی کنتراست کافی در حالت تیره، یا کنتراست حالت روشن ره بیشتر کنین (مثلاً { $lightAttribute }="{ $lightColor }") یا رنگ حالت تیره ره بازنویسی کنین (مثلاً { $darkAttribute }="{ $darkColor }").
       *[none] سی کنتراست کافی در حالت تیره، کنتراست حالت روشن ره بیشتر کنین یا رنگیل مشتق‌وابیه ره با textColorDarkMode و/یا backgroundColorDarkMode بازنویسی کنین.
    }

style-definition-dark-mode-text-canvas-contrast =
    هرچند تعریف سبک { $styleNumber } رنگ متنی مشخص کرده که در حالت روشن کنتراست کافی دارۀ، رنگ متن حالت تیره که از او مشتق بونه در برابر بوم کنتراست کافی ندارۀ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازم هه). { $suggestion ->
        [available] سی کنتراست کافی در حالت تیره، یا کنتراست حالت روشن ره بیشتر کنین (مثلاً textColor="{ $lightColor }") یا رنگ حالت تیره ره بازنویسی کنین (مثلاً textColorDarkMode="{ $darkColor }").
       *[none] سی کنتراست کافی در حالت تیره، کنتراست حالت روشن ره بیشتر کنین یا رنگ مشتق‌وابیه ره با textColorDarkMode بازنویسی کنین.
    }

section-multiple-style-palettes = یه بخش فقط تونه یه <stylePalette> بگزینه؛ آخری به کار رۀ.

## Unique variants

variant-num-to-select-not-non-negative-integer = تعیین نسخه‌یل یکتای مؤلفهٔ { $component } ممکن نیه، چون numToSelect عدد صحیح نامنفی نیه.

variant-num-to-select-not-constant-number = تعیین نسخه‌یل یکتای مؤلفهٔ { $component } ممکن نیه، چون numToSelect عدد ثابت نیه.

variant-with-replacement-not-constant-boolean = تعیین نسخه‌یل یکتای مؤلفهٔ { $component } ممکن نیه، چون withReplacement مقدار بولی ثابت نیه.

variant-select-weight-disables-unique = اگه گزینه‌ای selectWeight یا selectForVariants داشته بو، نسخه‌یل یکتا سی select از کار افته

variant-coprime-undetermined = تعیین نسخه‌یل یکتای مؤلفهٔ { $component } ممکن نیه، چون نتونیم مطمئن بویم coprime همیشه نادرست هه.

variant-attribute-not-constant = تعیین نسخه‌یل یکتای مؤلفهٔ { $component } ممکن نیه، چون { $attribute } ثابت نیه.

variant-attribute-not-number = تعیین نسخه‌یل یکتای مؤلفهٔ { $component } ممکن نیه، چون { $attribute } عدد نیه.

variant-attribute-wrong-type-for-sequence =
    تعیین نسخه‌یل یکتای مؤلفهٔ { $component } از نوع { $type } ممکن نیه، چون { $attribute } { $expected ->
        [letters-combination] ترکیبی از حرفیل
        [math-expression] عبارت ریاضی معتبر
        [integer] عدد صحیح
       *[number] عدد
    } نیه.

variant-length-not-integer = تعیین نسخه‌یل یکتای مؤلفهٔ { $component } ممکن نیه، چون length عدد صحیح نیه.

variant-sort-not-implemented = نسخه‌یل یکتای { $component } همراه با sort پیاده‌سازی نوابیه

variant-exclude-combinations-not-implemented = نسخه‌یل یکتای { $component } همراه با excludeCombinations پیاده‌سازی نوابیه

variant-math-exclude-not-implemented = نسخه‌یل یکتای { $component } از نوع math همراه با exclude پیاده‌سازی نوابیه

variant-non-constant-exclude-not-implemented = نسخه‌یل یکتای { $component } همراه با exclude ناثابت پیاده‌سازی نوابیه

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: در نمایشگر prefigure نمودار پشتیبانی نبونه؛ از ای فرزند صرف‌نظر وابی.

prefigure-descendant-invalid-geometry = { $subject }: هندسهٔ نامتناهی یا ناقص؛ از ای فرزند صرف‌نظر وابی.

prefigure-curve-label-omitted = { $subject }: برچسب سر عناصر منحنی تبدیل‌وابیه پشتیبانی نبونه؛ برچسب حذف وابی.

prefigure-curve-unsupported-definition-type = { $subject }: نوع تعریف تابع منحنی '{ $definitionType }' پشتیبانی نبونه؛ از ای فرزند صرف‌نظر وابی.

prefigure-region-flip-functions-unsupported = { $subject }: ویژگی flipFunctions سر regionBetweenCurves پشتیبانی نبونه؛ از ای فرزند صرف‌نظر وابی.

prefigure-region-non-formula-child = { $subject }: سر regionBetweenCurves فقط توابع فرزندی که با فرمول تعریف وابین پشتیبانی بونن؛ از ای فرزند صرف‌نظر وابی.

prefigure-label-position-unsupported =
    { $subject }: مقدار labelPosition '{ $labelPosition }' سی { $labelKind ->
        [line-family] برچسب خانوادهٔ خط
       *[point] برچسب نقطه
    } پشتیبانی نبونه؛ چینش پیش‌فرض PreFigure به کار رفت.

prefigure-fill-style-unsupported = { $subject }: سبک پرکردن '{ $fillStyle }' در PreFigure پشتیبانی نبونه؛ پرکردن یکدست به کار رۀ.

prefigure-line-style-unknown = { $subject }: سبک خط '{ $lineStyle }' ناشناخته هه و از خروجی PreFigure حذف وابی.

prefigure-marker-style-mapped-to-diamond = { $subject }: سبک نشانگر '{ $markerStyle }' به سبک 'diamond' در PreFigure نگاشته وابی.

prefigure-marker-style-unsupported = { $subject }: سبک نشانگر '{ $markerStyle }' در PreFigure پشتیبانی نبونه؛ سبک پیش‌فرض به کار رفت.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: مقدار `ref` نامعتبر هه؛ هدف مشخص نوابی. حاشیه‌نویسی حذف وابی.

annotation-ref-multiple-targets = `<annotation>`: `ref` به بیشتر از یه هدف رسی؛ هدف نخست به کار رۀ.

annotation-ref-outside-graph = `<annotation>`: مقدار `ref` نامعتبر هه؛ هدف بیرون از نمودار دربرگیرنده هه. حاشیه‌نویسی حذف وابی.

annotation-ref-unsupported-target = `<annotation>`: مقدار `ref` نامعتبر هه؛ هدف در تبدیل به prefigure شیء گرافیکی پشتیبانی‌وابیه‌ای نیه. حاشیه‌نویسی حذف وابی.

annotation-text-missing = `<annotation>`: مقدار `text` نبی یا خالی بی؛ متن خالی داده بونه.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] وابستگی حلقوی پیدا وابی.
       *[other] وابستگی حلقوی پیدا وابی که مؤلفهٔ `<{ $componentType }>` ره دربر گره.
    }

reference-no-referent = مرجعی سی ارجاع پیدا نوابی: `{ $reference }`

reference-multiple-referents = بیشتر از یه مرجع سی ارجاع پیدا وابی: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = قالب ویژگی { $attribute } در `<{ $componentType }>` نامعتبر هه.

children-invalid = فرزندیل نامعتبر سی `<{ $componentType }>`: فرزندیل نامعتبر پیدا وابی: { $children }

## Falling back to a default

attribute-value-invalid-using-default = مقدار `{ $value }` سی ویژگی `{ $attribute }` نامعتبر هه؛ مقدار `{ $default }` به کار رۀ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] نسخهٔ { $version } از DoenetML پیدا نوابی.
       *[other] نسخهٔ { $version } از DoenetML پیدا نوابی. نسخهٔ { $fallback } به جاش به کار رۀ
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML نامعتبر: { $content }

parse-tag-missing-close-tag = DoenetML نامعتبر: برچسب `{ $tag }` برچسب پایانی ندارۀ. برچسب خودبسته یا برچسب `</{ $tagName }>` انتظار رفت.

parse-tag-error = DoenetML نامعتبر: خطا در برچسب `<{ $tagName }>`

parse-attribute-missing-value = DoenetML نامعتبر: به نظر رسه ویژگی نامعتبر `{ $attribute }` مقدار ندارۀ.

parse-attribute-invalid = DoenetML نامعتبر: ویژگی `{ $attribute }` نامعتبر هه

parse-attribute-value-invalid = DoenetML نامعتبر: مقدار ویژگی `{ $value }` نامعتبر هه

parse-attribute-value-quote-mismatch = DoenetML نامعتبر: مقدار ویژگی `{ $value }` نامعتبر هه. گیومه‌یل با هم نمخونن. به نظر رسه یه `{ $quote }` کم دارین

parse-open-tag-name-missing = DoenetML نامعتبر: برچسبی بی نام پیدا وابی، مثل `<`

parse-tag-not-closed = DoenetML نامعتبر: برچسب `{ $tag }` بسته نوابی (به نظر رسه `>` کم هه).

parse-self-closing-tag-name-missing = DoenetML نامعتبر: برچسبی بی نام پیدا وابی `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML نامعتبر: برچسب `{ $tag }` بسته نوابی (به نظر رسه `/>` کم هه).

parse-tag-invalid-attributes = DoenetML نامعتبر: برچسب `{ $tag }` معتبر نیه. شاید ویژگی‌یلش نادرست بون.

parse-close-tag-name-missing = DoenetML نامعتبر: برچسب پایانی بی نام پیدا وابی، مثل `</`

parse-attribute-value-unquoted = مقدار ویژگی‌یل باید درون گیومه بیا: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML نامعتبر: برچسب پایانی `{ $tag }` پیدا وابی، ولی برچسب آغازین متناظری ندارۀ

parse-close-tag-mismatched = DoenetML نامعتبر: برچسب پایانی ناسازگار. `</{ $expected }>` انتظار رفت. `{ $found }` پیدا وابی

parser-node-unconvertible = تبدیل گرهٔ { $node } به گرهٔ Dast ممکن نوابی.

## Names

name-attribute-invalid =
    ویژگی name='{ $name }' نامعتبر هه. { $reason ->
        [characters] نامیل فقط تونن حرف، رقم، زیرخط یا خط تیره داشته بون.
       *[start] نامیل باید با حرف شروع بون.
    }

component-name-invalid-start = نام مؤلفهٔ "{ $name }" نامعتبر هه. نامیل باید با حرف شروع بون.

## `<answer>` sugar

answer-video-watched-missing-video = پاسخ با نوع videoWatched باید ویژگی video داشته بو

answer-video-watched-video-not-reference = ویژگی video در پاسخ با نوع videoWatched باید یه ارجاع بو

answer-name-not-single-text = ویژگی name در پاسخ باید یه فرزند متنی داشته بو

## Referencing another document

external-doenetml-recursion-limit = دریافت DoenetML بیرونی به سبب بازگشت بیش از حد ممکن نوابی. آیا ارجاع حلقوی هه؟

external-doenetml-unavailable = دریافت DoenetML از { $attribute }="{ $uri }" ممکن نوابی

external-doenetml-type-mismatch = DoenetML دریافت‌وابیه از { $attribute }="{ $uri }" نامعتبر هه: با نوع مؤلفهٔ "{ $componentType }" نمخونه

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] ویژگی `{ $from }` منسوخ هه؛ به جاش `{ $to }` ره به کار ببرین.
       *[other] [deprecation] ویژگی `{ $from }` سر `<{ $component }>` منسوخ هه؛ به جاش `{ $to }` ره به کار ببرین.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] ویژگی `{ $from }` منسوخ هه و نادیده گرته وابی، چون `{ $to }` هم مشخص وابیه.
       *[other] [deprecation] ویژگی `{ $from }` سر `<{ $component }>` منسوخ هه و نادیده گرته وابی، چون `{ $to }` هم مشخص وابیه.
    }

deprecated-attribute-ignored = [deprecation] ویژگی `{ $attribute }` سر `<{ $component }>` منسوخ هه و نادیده گرته وابی.

deprecated-attribute-to-child = [deprecation] ویژگی `{ $attribute }` سر `<{ $component }>` منسوخ هه؛ به جاش یه فرزند `<{ $child }>` بنویسین.

deprecated-attribute-value-renamed = [deprecation] مقدار `{ $value }` از ویژگی `{ $attribute }` سر `<{ $component }>` منسوخ هه؛ به جاش `{ $to }` ره به کار ببرین.


## Language coverage

pluralize-english-only = `<pluralize>` فقط تونه واژه‌یل انگلیسی ره جمع ببنده، پس در سندی که به زبان { $locale } نوشته وابیه متنش دست‌نخورده منه. شکل جمع ره مستقیم بنویسین، یا او ره با ویژگی `pluralForm` مشخص کنین.


## Checking against the schema

schema-element-unrecognized = عنصر `<{ $tag }>` عنصر شناخته‌وابیه‌ای در Doenet نیه.

schema-element-not-allowed-at-root = عنصر `<{ $tag }>` در ریشهٔ سند مجاز نیه.

schema-element-not-allowed-inside = عنصر `<{ $tag }>` درون `<{ $parent }>` مجاز نیه.

schema-attribute-unrecognized = عنصر `<{ $tag }>` ویژگی‌ای به نام `{ $attribute }` ندارۀ.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] ویژگی `{ $attribute }` در عنصر `<{ $tag }>` باید فهرستی بو که هر درایه‌اش یکی از اینیل هه: { $allowed }
       *[other] ویژگی `{ $attribute }` در عنصر `<{ $tag }>` باید یکی از اینیل بو: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = نام نسخهٔ نامعتبر سی select. نام نسخهٔ { $variantName } در { $numOptions } تا گزینه یه، ولی شمار گزینش { $numToSelect } هه.

select-variant-name-without-options = سی select چند تا نسخه مشخص وابیه، ولی سی نام نسخهٔ ممکن هیچ گزینه‌ای مشخص نوابیه: { $variantName }.

select-variant-name-not-possible = نام نسخهٔ { $variantName } که سی select مشخص وابیه، نام نسخهٔ ممکنی نیه.

select-too-few-options = گزینش { $numToSelect } تا مؤلفه از میان فقط { $numOptions } تا ممکن نیه.

select-from-sequence-too-few-values = گزینش { $numToSelect } تا مقدار از دنباله‌ای به طول { $length } ممکن نیه.

select-from-sequence-indices-count-mismatch = شمار اندیسیل مشخص‌وابیه سی select باید با شمار گزینش بخونه

select-from-sequence-indices-not-integers = همهٔ اندیسیل مشخص‌وابیه سی select باید عدد صحیح بون

select-from-sequence-index-excluded = اندیس مشخص‌وابیهٔ selectfromsequence مستثنا وابیه بی

select-from-sequence-indices-excluded-combination = اندیسیل مشخص‌وابیهٔ selectfromsequence ترکیبی مستثنا بی

select-from-sequence-coprime-not-positive-integers = گزینش ترکیبیل نسبت‌به‌هم‌اول ممکن نیه، چون گزینش از میان عددیل صحیح مثبت نیه.

select-from-sequence-coprime-common-factor = گزینش عددیل نسبت‌به‌هم‌اول ممکن نیه. همهٔ مقادیر ممکن عامل مشترکی دارن. (مقدار مشخص‌وابیهٔ "from" یا "to" باید نسبت به "step" اول بو.)

select-from-sequence-coprime-single-number = گزینش ترکیبیل نسبت‌به‌هم‌اول از یه عدد که 1 نیه ممکن نیه.

select-from-sequence-excluded-too-many-combinations = بیشتر از 70% ترکیبیل در selectFromSequence مستثنا وابی

select-from-sequence-coprime-none-found = گزینش عددیل نسبت‌به‌هم‌اول ممکن نوابی. همهٔ مقادیر ممکن عامل مشترکی دارن.

select-from-sequence-too-few-unique-values = گزینش { $numToSelect } تا مقدار یکتا از دنباله‌ای به طول { $numPossibleValues } ممکن نیه

select-prime-numbers-too-few-values = گزینش { $numToSelect } تا مقدار از فهرست عددیل اول به طول { $numValues } ممکن نیه

select-prime-numbers-values-count-mismatch = شمار مقادیر مشخص‌وابیه سی select باید با شمار گزینش بخونه

select-prime-numbers-values-not-prime = همهٔ مقادیر مشخص‌وابیه سی select prime number باید در فهرست عددیل اول بون

select-prime-numbers-values-excluded-combination = مقادیر مشخص‌وابیهٔ selectPrimeNumbers ترکیبی مستثنا بی

select-prime-numbers-excluded-too-many-combinations = بیشتر از 70% ترکیبیل در selectPrimeNumbers مستثنا وابی

select-random-combination-fluke = بر اثر تصادفی خیلی نامحتمل، گزینش ترکیبی از مقادیر تصادفی ممکن نوابی

select-random-value-fluke = بر اثر تصادفی خیلی نامحتمل، گزینش مقدار تصادفی ممکن نوابی

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` درون ریاضیات رسم نبونه؛ عبارت همونجور حروف‌چینی بونه که پیش از امکان جاسازی ورودی‌یل بی. { $reason ->
        [not-inline] فقط یه choice input از نوع `inline` درون یه عبارت جا گره؛ بی `inline` او یه بلوک از دکمه‌یل هه.
        [expanded] یه text input از نوع `expanded` یه جعبهٔ چندسطری هه، که سی نشستن درون یه عبارت خیلی بزرگ هه.
        [on-graph] سر یه نمودار، عبارت به شکل یه تصویر یکپارچه رسم بونه، که جایی سی یه کنترل ندارۀ.
       *[relative-width] مقدار `width` او نسبی هه (درصد یا `em`)، که درون یه عبارت چیزی سی سنجیدن ندارۀ. عرض ره با واحد مطلق، مثل `px`، بدین.
    }
