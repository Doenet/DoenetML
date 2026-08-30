# Hazaragi (هزارگی / آزرگی) diagnostics: the errors and warnings the core and
# the language server put in front of whoever is looking at the screen.
# Translated from `locales/en/diagnostics.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Perso-Arabic on Kabul Dari conventions, right to left, as in the other three
# files of this locale. This is the file where Hazaragi and Dari are closest:
# almost every sentence in it is technical prose that Hazaragi takes from Dari
# unchanged, and writing a manufactured difference into it would help nobody.
# **A Dari sentence here is not an oversight.** «قد» for *with* and «بلدِ» for
# *for* are used where they fit.
#
# **Element names, attribute names and values are not words.** `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `math`, `text`, `boolean`,
# `coprime`, `selectFromSequence` and every `<tag>` written into these
# sentences are DoenetML identifiers and stay in English exactly as they are.
# The backticks and angle brackets around them are this catalog's punctuation.
#
# **No message here selects on a count.** `Intl.PluralRules` has no data for
# `haz`, and a noun after a numeral is unmarked anyway, so each of English's
# count branches is written once as `*[other]` and the count argument goes
# unused. The symbolic selectors — `$reason`, `$type`, `$mode`, `$suggestion`,
# `$isList` and the rest — keep every branch English has, because those keys
# are compared letter for letter and a renamed one is a branch nothing can
# reach.
#
# **Vocabulary chosen once and used throughout**, so a correction is one
# search: «نادیده گرفته می‌شه» for *is ignored*, «مشخص‌شده» for *specified*,
# «نادرست» for *invalid*, «ارزش» for *value*, «صفت» for *attribute*, «جزء»
# for *component*, «باید» for *must*, «پیدا شد» for *found*.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] وقتی دو endpoint مشخص شنه، { $attributes } نادیده گرفته می‌شه
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] وقتی یک endpoint و یک midpoint هر دو مشخص شنه، { $attributes } نادیده گرفته می‌شه
    }

line-segment-midpoint-offset-without-midpoint = بدونِ midpoint، midpointOffset هیچ اثر نداره

## `<line>`

line-points-undetermined-dimensions = خط از نقطه‌هایی می‌گذره که ابعادِ شان معلوم نیست.

line-points-too-few-dimensions = خط باید از نقطه‌هایی بگذره که کم از کم دو بُعد داشته باشه.

line-points-depend-on-variables = خط از نقطه‌هایی می‌گذره که به ای متغیرها وابسته استه: { $variables }.

line-equation-invalid-format = شکلِ نادرستِ معادلهٔ خط در متغیرهای { $variable1 } و { $variable2 }.

## `<ray>`

ray-overprescribed-through = نیم‌خط از through، endpoint و direction مشخص شده.  through ِ مشخص‌شده نادیده گرفته می‌شه.

ray-dimension-mismatch = در نیم‌خط numDimensions جور نمی‌آیه.

## `<vector>`

vector-overprescribed-head = ویکتور از head، tail و displacement مشخص شده.  head ِ مشخص‌شده نادیده گرفته می‌شه.

vector-dimension-mismatch = در ویکتور numDimensions جور نمی‌آیه.

## Attracting and constraining

attract-to-without-nearest-point = کشش به `<{ $component }>` نمی‌شه، چون متغیرِ حالتِ nearestPoint نداره.

constrain-to-without-nearest-point = محدود کدو به `<{ $component }>` نمی‌شه، چون متغیرِ حالتِ nearestPoint نداره.

constrain-to-interior-without-nearest-point = محدود کدو به داخلِ `<{ $component }>` نمی‌شه، چون متغیرِ حالتِ nearestPoint نداره.

## `<choiceInput>`

choice-input-label-position-ignored = بلدِ choiceInput ای که inline نیست، labelPosition نادیده گرفته می‌شه

## Ordering children by index

choice-input-indices-count-mismatch = اندیس‌های choiceInput نادیده گرفته می‌شه، چون شمارِ اندیس‌ها قد شمارِ فرزندهای choice جور نمی‌آیه.

pretzel-indices-count-mismatch = اندیس‌های problem نادیده گرفته می‌شه، چون شمارِ اندیس‌ها قد شمارِ فرزندهای problem جور نمی‌آیه.

shuffle-indices-count-mismatch = اندیس‌های shuffle نادیده گرفته می‌شه، چون شمارِ اندیس‌ها قد شمارِ اجزا جور نمی‌آیه.

indices-ignored-out-of-range = اندیس‌های { $component } نادیده گرفته می‌شه، چون چند اندیس از حد بیرون استه.

pretzel-indices-repeated = اندیس‌های pretzel نادیده گرفته می‌شه، چون چند اندیس تکرار شده.

pretzel-circuit-first-index = در حالتِ circuit اندیس‌های pretzel نادیده گرفته می‌شه، چون اندیسِ اول باید 1 باشه.

## `<shuffle>` and `<sort>`

string-children-need-type = بلدِ ای که `<{ $component }>` قد فرزندهای string کار کنه، صفتِ type باید مشخص شوه.

invalid-type-defaulting-to-math = تایپِ نادرستِ { $type } بلدِ جزءِ { $component }. باید یکی از math، text، number یا boolean باشه. پیش‌فرضِ math گرفته می‌شه.

string-not-valid-component-to-arrange = String "{ $value }" بلدِ { $component } جزءِ درست نیست. نادیده گرفته می‌شه.

## Types and variables

invalid-type-defaulting-to-number = تایپِ نادرستِ { $type }، تایپ number مانده می‌شه.

invalid-variable-value = ارزشِ نادرستِ یک متغیر: `{ $value }`

## Variants

variant-index-must-be-number = اندیسِ نسخهٔ { $index } باید عدد باشه

variant-index-must-be-integer = اندیسِ نسخهٔ { $index } باید عددِ صحیح باشه

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` بلدِ اندازه‌های مطلق ساخته نشده. عرض‌ها نسبی مانده می‌شه.

side-by-side-absolute-margins = `<{ $component }>` بلدِ اندازه‌های مطلق ساخته نشده. حاشیه‌ها نسبی مانده می‌شه.

side-by-side-no-block-child = `<{ $component }>` نادرست استه: باید کم از کم یک فرزندِ بلاک داشته باشه.

## `<label>`

label-for-ignored-on-graphical = صفتِ `for` سرِ `<label>` ِ گرافیکی نادیده گرفته می‌شه.

label-for-must-resolve-to-one = صفتِ `for` سرِ `<label>` باید دقیقاً به یک جزء برسه.

label-for-unresolved = صفتِ `for` سرِ `<label>` به هیچ جزء نرسید.

label-for-answer-with-authored-inputs = صفتِ `for` سرِ `<label>` به یک `<answer>` اشاره می‌کنه که ورودی‌های خوده نویسنده نوشته؛ مستقیم به ورودی اشاره کنین.

label-for-answer-without-input = صفتِ `for` سرِ `<label>` به یک `<answer>` اشاره می‌کنه که ورودی نداره تا نام‌گذاری شوه.

label-for-must-reference-input-or-answer = صفتِ `for` سرِ `<label>` باید به یک ورودی یا یک answer اشاره کنه.

## Accessibility

accessibility-short-description-or-decorative = بلدِ دسترس‌پذیری، `<{ $component }>` باید یا توضیحِ کوتاه داشته باشه یا decorative مشخص شوه.

accessibility-video-short-description = بلدِ دسترس‌پذیری، `<video>` باید توضیحِ کوتاه داشته باشه.

accessibility-input-short-description-or-label = بلدِ دسترس‌پذیری، `<{ $component }>` باید توضیحِ کوتاه یا یک label داشته باشه.

accessibility-answer-input-short-description-or-label = بلدِ دسترس‌پذیری، یک `<answer>` که ورودی می‌سازه باید توضیحِ کوتاه یا یک label داشته باشه.

accessibility-short-description-contains-math = توضیح‌های کوتاه نباید اجزای ریاضی مثلِ `<{ $component }>` داشته باشه. ریاضی ره قد کلمه‌ها بنویسین.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } بلدِ متنِ عنوانِ فصل کنتراستِ کافی نداره (حالتِ تاریک) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کم از کم { $threshold }:1 لازم استه).
       *[other] { $colorName } بلدِ متنِ عنوانِ فصل کنتراستِ کافی نداره ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کم از کم { $threshold }:1 لازم استه).
    }

## `<circle>`

circle-through-points-non-numerical = وقتی نقطه‌ها ارزشِ عددی نداره، `<circle>` ای که از { $count } نقطه بگذره هنوز ساخته نشده.

circle-too-many-through-points = دایرهٔ گذرنده از زیادتر از 3 نقطه حساب نمی‌شه.

circle-overprescribed-radius-center-points = دایره قد شعاع، مرکز و نقطه‌های مشخص‌شده یکجای حساب نمی‌شه.

circle-center-with-multiple-points = دایره قد مرکزِ مشخص‌شده و زیادتر از 1 نقطه حساب نمی‌شه.

circle-radius-too-small = دایره حساب نمی‌شه: فاصلهٔ بین دو نقطه { $distance } استه، و شعاعِ مشخص‌شدهٔ { $radius } کم استه.

circle-radius-with-many-points = دایرهٔ گذرنده از زیادتر از دو نقطه قد شعاعِ مشخص‌شده ساخته نمی‌شه.

circle-invalid-center-or-through-points = مرکز یا نقطه‌های دایره نادرست استه.

circle-radius-center-with-multiple-points = شعاعِ دایره قد مرکزِ مشخص‌شده و زیادتر از 1 نقطه حساب نمی‌شه.

circle-change-radius-non-numerical = شعاعِ دایره‌ای که از نقطه‌های غیرعددی می‌گذره تبدیل نمی‌شه

circle-radius-with-points-non-numerical = وقتی ارزشِ عددی نیست، دایرهٔ گذرنده از زیادتر از یک نقطه قد شعاعِ مشخص‌شده ساخته نمی‌شه.

circle-change-center-non-numerical = تبدیلِ مرکزِ دایره‌ای که از نقطه‌های غیرعددی می‌گذره هنوز ساخته نشده.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] ابعادِ دامنهٔ فنکشن کافی نیست. دامنه { $intervals } وقفه داره مگم فنکشن { $inputs ->
           *[other] { $inputs } ورودی
        } داره.
    }

function-domain-invalid-format = شکلِ نادرستِ دامنهٔ فنکشن.

function-ignoring-non-numerical =
    { $type ->
        [maximum] ماکسیممِ غیرعددیِ فنکشن نادیده گرفته می‌شه.
        [minimum] مینیممِ غیرعددیِ فنکشن نادیده گرفته می‌شه.
        [extremum] اکسترممِ غیرعددیِ فنکشن نادیده گرفته می‌شه.
        [point] نقطهٔ غیرعددیِ فنکشن نادیده گرفته می‌شه.
        [slope] میلانِ غیرعددیِ فنکشن نادیده گرفته می‌شه.
       *[other] { $type } ِ غیرعددیِ فنکشن نادیده گرفته می‌شه.
    }

function-ignoring-empty =
    { $type ->
        [maximum] ماکسیممِ خالیِ فنکشن نادیده گرفته می‌شه.
        [minimum] مینیممِ خالیِ فنکشن نادیده گرفته می‌شه.
        [extremum] اکسترممِ خالیِ فنکشن نادیده گرفته می‌شه.
        [point] نقطهٔ خالیِ فنکشن نادیده گرفته می‌شه.
       *[other] { $type } ِ خالیِ فنکشن نادیده گرفته می‌شه.
    }

function-points-too-close = فنکشن دو نقطه داره که جای شان زیاد نزدیک استه. فنکشن تعریف نمی‌شه.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] تکرارِ فنکشن فقط وقتی ممکن استه که شمارِ ورودی‌ها قد شمارِ خروجی‌ها برابر باشه. ای فنکشن { $inputs } ورودی و { $outputs ->
           *[other] { $outputs } خروجی
        } داره.
    }

## `<sequence>`

sequence-invalid-length = درازیِ دنباله نادرست استه.  باید عددِ صحیحِ غیرمنفی باشه.

sequence-invalid-step = گامِ دنباله نادرست استه.  بلدِ دنبالهٔ تایپِ { $type } باید عدد باشه.

sequence-invalid-endpoint-number = "{ $attribute }" ِ دنبالهٔ عددی نادرست استه.  باید عدد باشه.

sequence-invalid-endpoint-letters = "{ $attribute }" ِ دنبالهٔ حرفی نادرست استه.  باید ترکیبِ حرف‌ها باشه.

sequence-invalid-endpoint = "{ $attribute }" ِ دنباله نادرست استه.

select-from-sequence-coprime-not-numbers = چون عدد انتخاب نمی‌شه، coprime نادیده گرفته می‌شه

select-from-sequence-coprime-with-exclude-combinations = چون excludeCombinations مشخص شده، coprime نادیده گرفته می‌شه

## Resolving a `target`

target-not-found = target ِ نادرست بلدِ `<{ $source }>`: target پیدا نشد.

target-state-variable-not-found = target ِ نادرست بلدِ `<{ $source }>`: سرِ `<{ $component }>` متغیرِ حالتی به نامِ "{ $property }" پیدا نشد.

## `<odeSystem>`

ode-system-variables-match-independent = متغیرهای `<odeSystem>` باید از متغیرِ مستقل فرق داشته باشه.

ode-system-duplicate-variable-names = قد نام‌های تکراریِ متغیرهای وابسته، فنکشن‌های ODE RHS تعریف نمی‌شه.

ode-system-rhs-function-error = فنکشنِ ODE RHS تعریف نمی‌شه.  در ساختنِ فنکشنِ mathjs خطا شد.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = بین { $count } خط زاویه تعریف نمی‌شه

angle-invalid-through-point = نقطهٔ نادرست در through ِ `<angle>`

parabola-vertex-too-many-points = سهمی قد رأس و زیادتر از 1 نقطه هنوز ساخته نشده.

parabola-too-many-points = سهمیِ گذرنده از زیادتر از 3 نقطه هنوز ساخته نشده.

intersection-too-many-items = تقاطع بلدِ زیادتر از دو چیز هنوز ساخته نشده

## Other math components

ionic-compound-not-two-ions = ترکیبِ آیونی بلدِ چیزی غیر از دو آیون هنوز ساخته نشده.

ionic-compound-needs-cation-and-anion = ترکیبِ آیونی فقط بلدِ یک کاتیون و یک آنیون ساخته شده.

solve-equations-cannot-evaluate = معادله حل نشد چون ارزیابی نشد: { $equation }

math-operators-operand-number-required = وقتی یک عملوندِ ریاضی کشیده می‌شه، operandNumber باید مشخص شوه.

eigen-decomposition-failed = ارزش‌های ویژهٔ ماتریس حساب نشد

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: پارامترِ { $parameters } در الگو نیست، پس همیشه قد یک خالی جور می‌آیه.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" فهمیده نمی‌شه. باید none، medium، dense یا دو عددِ مثبت باشه که قد یک فاصله جدا شده، مثلِ grid="1 0.5". هیچ گرید کشیده نمی‌شه.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` یک فنکشن کار داره که { $expected ->
        [one] یک خروجی بته، یعنی میلانِ y' در هر نقطه، مثلِ `y - x`
       *[other] دو خروجی بته، یعنی ویکتور در هر نقطه، مثلِ `(y, -x)`
    }، مگم فنکشنی که داده شده { $found ->
       *[other] { $found } خروجی
    } داره. { $alternative ->
        [none] هیچ چیز کشیده نمی‌شه.
       *[other] بلدِ ای فنکشن جزءِ `<{ $alternative }>` استه. هیچ چیز کشیده نمی‌شه.
    }

field-function-attribute-ignored-with-child = چون فنکشن در داخلِ جزء هم داده شده، صفتِ `function` نادیده گرفته می‌شه؛ همو داخلی استفاده می‌شه. فنکشن ره فقط به یک راه بتین.

field-variables-ignored =
    `<{ $component }>`: صفتِ `variables` متغیرهای عبارتی ره نام می‌گیره که مستقیم در داخلِ جزء نوشته شده. { $reason ->
        [function-child] فنکشن ایجه به شکلِ فرزندِ `<function>` داده شده، و او خودش متغیرهای خوده نام می‌گیره، پس `variables` نادیده گرفته می‌شه.
       *[no-expression] ایجه هیچ همیطور عبارت داده نشده، پس `variables` نادیده گرفته می‌شه.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: در رندررِ prefigure ارزشِ xLabelPosition="left" پشتیبانی نمی‌شه؛ رفتارِ راست استفاده می‌شه.

prefigure-y-label-position-unsupported = `<graph>`: در رندررِ prefigure ارزشِ yLabelPosition="bottom" پشتیبانی نمی‌شه؛ رفتارِ بالا استفاده می‌شه.

prefigure-invalid-axis-bounds = `<graph>`: بلدِ تبدیلِ prefigure حدهای محور نادرست استه؛ bbox ِ پیش‌فرضِ (-10,-10,10,10) استفاده می‌شه.

prefigure-invalid-width = `<graph>`: بلدِ تبدیلِ prefigure عرض نادرست استه؛ عرضِ پیش‌فرضِ 425 استفاده می‌شه.

prefigure-invalid-aspect-ratio = `<graph>`: بلدِ تبدیلِ prefigure ارزشِ aspectRatio نادرست استه؛ نسبتِ پیش‌فرضِ 1 استفاده می‌شه.

prefigure-grid-spacing-too-fine = `<graph>`: بلدِ حدهای محور فاصلهٔ گرید زیاد ریزه استه؛ در رندررِ prefigure گرید کشیده نمی‌شه.

prefigure-annotations-not-rendered = `<graph>`: وقتی رندررِ PreFigure استفاده نمی‌شه، annotation ها کشیده نمی‌شه.

multiple-annotations-children = در `<graph>` چند فرزندِ `<annotations>` پیدا شد؛ غیر از آخری همه نادیده گرفته می‌شه.

## Referring to other components

copy-unrecognized-component-type = تایپِ ناشناختهٔ جزء تمدید یا کاپی نمی‌شه: { $type }.

copy-prop-not-found = سرِ جزءِ تایپِ { $component } چیزی به نامِ prop ِ { $property } پیدا نشد

collect-no-source = بلدِ collect هیچ منبع پیدا نشد.

collect-invalid-component-type = اجزای تایپِ `<{ $component }>` جمع نمی‌شه چون ای تایپ نادرست استه.

reference-index-unavailable = به اندیسِ `{ $reference }` اشاره نمی‌شه

## `<callAction>`

component-action-unavailable = { $action } سرِ جزءِ `{ $reference }` صدا زده نمی‌شه

## `<dataFrame>`

data-frame-inconsistent-row-lengths = شکلِ داده نادرست استه.  درازیِ سطرها یکسان نیست. در componentIdx پیدا شد :{ $componentIdx }

data-frame-duplicate-column-names = داده نام‌های تکراریِ ستون داره.  در componentIdx پیدا شد :{ $componentIdx }

data-frame-missing-column-name = در داده نامِ یک ستون کم استه.  در componentIdx پیدا شد :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award ِ ای جواب سرِ جوابِ روان‌شدهٔ خودِ همی answer بنا شده، و ای کار رفتارِ ناخواسته می‌آره.

answer-max-num-attempts-in-section-wide-check-work = مانده کدونِ `maxNumAttempts` سرِ یک `<answer>` در داخلِ ظرفی که sectionWideCheckWork داره هیچ اثر نداره، چون شمارِ کوشش‌ها ره ظرف کنترول می‌کنه. `maxNumAttempts` ره سرِ ظرف بمانین.

nested-section-wide-check-work-max-num-attempts = مانده کدونِ `maxNumAttempts` سرِ ظرفی که sectionWideCheckWork داره و خودش در داخلِ ظرفِ دیگهٔ sectionWideCheckWork استه هیچ اثر نداره، چون شمارِ کوشش‌ها ره ظرفِ بیرونی کنترول می‌کنه. `maxNumAttempts` ره سرِ ظرفِ بیرونی بمانین.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] بدونِ symbolicEquality صفتِ { $attributes } هیچ اثر نداره.
    }

answer-invalid-type = تایپِ نادرست بلدِ جواب: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = چون جزءِ `<{ $component }>` نام نداره، بلدِ صفتِ module استفاده نمی‌شه

module-attribute-name-already-defined = جزءِ `<{ $component } name="{ $name }">` بلدِ صفتِ module استفاده نمی‌شه، چون تایپِ جزءِ `<module>` از پیش صفتی به نامِ "{ $name }" داره.

conditional-content-condition-ignored = سرِ جزءِ `<conditionalContent>` که فرزندهای case یا else داره، صفتِ `condition` نادیده گرفته می‌شه.

slider-markers-type-mismatch = تایپِ نشانگرها قد تایپِ slider جور نمی‌آیه.

pretzel-problem-needs-statement-and-answer = pretzel ِ نادرست: هر `<problem>` باید یک `<statement>` و یک `<answer>` داشته باشه.

pretzel-circuit-first-problem-distractor = pretzel ِ نادرست: در mode="circuit" اولین `<problem>` نمی‌تانه distractor باشه.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] ارزشِ نادرستِ { $values } بلدِ صفتِ `{ $attribute }`؛ نادیده گرفته می‌شه.
    }

attribute-must-be-references = ارزشِ نادرستِ `{ $value }` بلدِ صفتِ `{ $attribute }`. صفت باید از مرجع‌هایی ساخته شوه که قد `$` شروع می‌شه.

math-input-invalid-function-names = <mathInput>: در { $attribute } نام‌های نادرستِ فنکشن نادیده گرفته شد: { $names }. بخشِ نمایشیِ هر نام باید کم از کم 2 کاراکتر باشه (حرف یا خط تیره)؛ بعدِ او یک `|<mathspeak alternative>` هم آمده می‌تانه.

## Building components from the source

component-type-invalid = تایپِ نادرستِ جزء: `<{ $componentType }>`

attribute-repeated = صفتِ { $attribute } تکرار نمی‌شه.

attribute-invalid-for-component = صفتِ نادرستِ "{ $attribute }" بلدِ جزءِ تایپِ `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    تعریفِ ستایلِ { $styleNumber } بلدِ { $context ->
        [text-on-background] رنگِ متن در برابرِ رنگِ پس‌منظره
        [high-contrast] رنگِ کنتراستِ بلند در برابرِ بوم
        [line] رنگِ خط در برابرِ بوم
        [marker] رنگِ نشانگر در برابرِ بوم
       *[text-on-canvas] رنگِ متن در برابرِ بوم
    } کنتراستِ کافی نداره{ $mode ->
        [dark] { " (حالتِ تاریک)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کم از کم { $threshold }:1 لازم استه).

style-definition-dark-mode-text-background-contrast =
    گرچه تعریفِ ستایلِ { $styleNumber } رنگ‌هایی مشخص کده که بلدِ حالتِ روشن کنتراستِ کافی داره، رنگ‌های حالتِ تاریک که از همی ارزش‌ها بیرون آمده بلدِ رنگِ متن در برابرِ رنگِ پس‌منظره کنتراستِ کافی نداره ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کم از کم { $threshold }:1 لازم استه). { $suggestion ->
        [available] بلدِ ای که در حالتِ تاریک کنتراست کافی شوه، یا کنتراستِ حالتِ روشن ره زیاد کنین (مثلاً { $lightAttribute }="{ $lightColor }" بمانین) یا رنگِ حالتِ تاریک ره تبدیل کنین (مثلاً { $darkAttribute }="{ $darkColor }" بمانین).
       *[none] بلدِ ای که در حالتِ تاریک کنتراست کافی شوه، کنتراستِ حالتِ روشن ره زیاد کنین یا رنگ‌های بیرون‌آمده ره قد textColorDarkMode و/یا backgroundColorDarkMode تبدیل کنین.
    }

style-definition-dark-mode-text-canvas-contrast =
    گرچه تعریفِ ستایلِ { $styleNumber } رنگِ متنی مشخص کده که بلدِ حالتِ روشن کنتراستِ کافی داره، رنگِ متنِ حالتِ تاریک که از همی ارزش بیرون آمده در برابرِ بوم کنتراستِ کافی نداره ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کم از کم { $threshold }:1 لازم استه). { $suggestion ->
        [available] بلدِ ای که در حالتِ تاریک کنتراست کافی شوه، یا کنتراستِ حالتِ روشن ره زیاد کنین (مثلاً textColor="{ $lightColor }" بمانین) یا رنگِ حالتِ تاریک ره تبدیل کنین (textColorDarkMode="{ $darkColor }" بمانین).
       *[none] بلدِ ای که در حالتِ تاریک کنتراست کافی شوه، کنتراستِ حالتِ روشن ره زیاد کنین یا رنگِ بیرون‌آمده ره قد textColorDarkMode تبدیل کنین.
    }

section-multiple-style-palettes = یک فصل فقط یک <stylePalette> انتخاب کده می‌تانه؛ آخری استفاده می‌شه.

## Unique variants

variant-num-to-select-not-non-negative-integer = نسخه‌های یگانهٔ { $component } معلوم نمی‌شه چون numToSelect عددِ صحیحِ غیرمنفی نیست.

variant-num-to-select-not-constant-number = نسخه‌های یگانهٔ { $component } معلوم نمی‌شه چون numToSelect عددِ ثابت نیست.

variant-with-replacement-not-constant-boolean = نسخه‌های یگانهٔ { $component } معلوم نمی‌شه چون withReplacement ِ boolean ِ ثابت نیست.

variant-select-weight-disables-unique = اگه یک گزینه selectWeight یا selectForVariants داشته باشه، نسخه‌های یگانه بلدِ select بند می‌شه

variant-coprime-undetermined = نسخه‌های یگانهٔ { $component } معلوم نمی‌شه چون معلوم نمی‌شه که coprime همیشه نادرست استه.

variant-attribute-not-constant = نسخه‌های یگانهٔ { $component } معلوم نمی‌شه چون { $attribute } ثابت نیست.

variant-attribute-not-number = نسخه‌های یگانهٔ { $component } معلوم نمی‌شه چون { $attribute } عدد نیست.

variant-attribute-wrong-type-for-sequence =
    نسخه‌های یگانهٔ { $component } ِ تایپِ { $type } معلوم نمی‌شه چون { $attribute } { $expected ->
        [letters-combination] ترکیبِ حرف‌ها
        [math-expression] عبارتِ ریاضیِ درست
        [integer] عددِ صحیح
       *[number] عدد
    } نیست.

variant-length-not-integer = نسخه‌های یگانهٔ { $component } معلوم نمی‌شه چون length عددِ صحیح نیست.

variant-sort-not-implemented = نسخه‌های یگانهٔ یک { $component } قد sort هنوز ساخته نشده

variant-exclude-combinations-not-implemented = نسخه‌های یگانهٔ یک { $component } قد excludeCombinations هنوز ساخته نشده

variant-math-exclude-not-implemented = نسخه‌های یگانهٔ یک { $component } ِ تایپِ math قد exclude هنوز ساخته نشده

variant-non-constant-exclude-not-implemented = نسخه‌های یگانهٔ یک { $component } قد exclude ِ غیرثابت هنوز ساخته نشده

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: در رندررِ prefigure ِ گراف پشتیبانی نمی‌شه؛ فرزند رد شد.

prefigure-descendant-invalid-geometry = { $subject }: هندسه ناتمام یا غیرمتناهی استه؛ فرزند رد شد.

prefigure-curve-label-omitted = { $subject }: سرِ عناصرِ منحنیِ تبدیل‌شده label پشتیبانی نمی‌شه؛ label انداخته شد.

prefigure-curve-unsupported-definition-type = { $subject }: تایپِ تعریفِ فنکشنِ منحنیِ '{ $definitionType }' پشتیبانی نمی‌شه؛ فرزند رد شد.

prefigure-region-flip-functions-unsupported = { $subject }: صفتِ flipFunctions سرِ regionBetweenCurves پشتیبانی نمی‌شه؛ فرزند رد شد.

prefigure-region-non-formula-child = { $subject }: سرِ regionBetweenCurves فقط فنکشن‌های فرزندِ تایپِ formula پشتیبانی می‌شه؛ فرزند رد شد.

prefigure-label-position-unsupported =
    { $subject }: بلدِ { $labelKind ->
        [line-family] label ِ خانوادهٔ خط
       *[point] label ِ نقطه
    } ارزشِ labelPosition '{ $labelPosition }' پشتیبانی نمی‌شه؛ هم‌ترازیِ پیش‌فرضِ PreFigure استفاده شد.

prefigure-fill-style-unsupported = { $subject }: ستایلِ پُرکدونِ '{ $fillStyle }' در PreFigure پشتیبانی نمی‌شه؛ پُرکدونِ ساده استفاده می‌شه.

prefigure-line-style-unknown = { $subject }: ستایلِ ناشناختهٔ خطِ '{ $lineStyle }' از خروجیِ PreFigure انداخته شد.

prefigure-marker-style-mapped-to-diamond = { $subject }: ستایلِ نشانگرِ '{ $markerStyle }' به ستایلِ 'diamond' ِ PreFigure نگاشته شد.

prefigure-marker-style-unsupported = { $subject }: ستایلِ نشانگرِ '{ $markerStyle }' در PreFigure پشتیبانی نمی‌شه؛ ستایلِ پیش‌فرض استفاده شد.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ِ نادرست؛ هدف پیدا نشد. annotation انداخته شد.

annotation-ref-multiple-targets = `<annotation>`: `ref` به چند هدف رسید؛ هدفِ اول استفاده می‌شه.

annotation-ref-outside-graph = `<annotation>`: `ref` ِ نادرست؛ هدف بیرون از گرافِ دربرگیرنده استه. annotation انداخته شد.

annotation-ref-unsupported-target = `<annotation>`: `ref` ِ نادرست؛ در تبدیلِ prefigure هدف یک شیءِ گرافیکیِ پشتیبانی‌شده نیست. annotation انداخته شد.

annotation-text-missing = `<annotation>`: `text` کم یا خالی استه؛ متنِ خالی بیرون داده می‌شه.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] وابستگیِ دورانی پیدا شد.
       *[other] وابستگیِ دورانی قد جزءِ `<{ $componentType }>` پیدا شد.
    }

reference-no-referent = بلدِ مرجعِ `{ $reference }` هیچ چیز پیدا نشد

reference-multiple-referents = بلدِ مرجعِ `{ $reference }` چند چیز پیدا شد

## Children that do not match

children-invalid-attribute-format = شکلِ نادرستِ صفتِ { $attribute } سرِ `<{ $componentType }>`.

children-invalid = فرزندهای نادرست بلدِ `<{ $componentType }>`: فرزندهای نادرست پیدا شد: { $children }

## Falling back to a default

attribute-value-invalid-using-default = ارزشِ نادرستِ `{ $value }` بلدِ صفتِ `{ $attribute }`، ارزشِ `{ $default }` استفاده می‌شه

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] نسخهٔ DoenetML ِ { $version } پیدا نشد.
       *[other] نسخهٔ DoenetML ِ { $version } پیدا نشد. نسخهٔ { $fallback } استفاده می‌شه
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ِ نادرست: { $content }

parse-tag-missing-close-tag = DoenetML ِ نادرست: تگِ `{ $tag }` تگِ بسته‌کننده نداره. یا یک تگِ خودبسته یا یک تگِ `</{ $tagName }>` لازم استه.

parse-tag-error = DoenetML ِ نادرست: خطا در تگِ `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ِ نادرست: چنین معلوم می‌شه که صفتِ نادرستِ `{ $attribute }` ارزش نداره.

parse-attribute-invalid = DoenetML ِ نادرست: صفتِ نادرستِ `{ $attribute }`

parse-attribute-value-invalid = DoenetML ِ نادرست: ارزشِ نادرستِ صفتِ `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML ِ نادرست: ارزشِ نادرستِ صفتِ `{ $value }`. نشان‌های نقل‌قول جور نمی‌آیه. چنین معلوم می‌شه که یک `{ $quote }` کم استه

parse-open-tag-name-missing = DoenetML ِ نادرست: یک تگ بدونِ نام پیدا شد، مثلاً `<`

parse-tag-not-closed = DoenetML ِ نادرست: تگِ `{ $tag }` بسته نشد (چنین معلوم می‌شه که یک `>` کم استه).

parse-self-closing-tag-name-missing = DoenetML ِ نادرست: یک تگ بدونِ نام پیدا شد `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ِ نادرست: تگِ `{ $tag }` بسته نشد (چنین معلوم می‌شه که `/>` کم استه).

parse-tag-invalid-attributes = DoenetML ِ نادرست: تگِ `{ $tag }` درست نیست. شاید صفت‌های نادرست داشته باشه.

parse-close-tag-name-missing = DoenetML ِ نادرست: یک تگِ بسته‌کننده بدونِ نام پیدا شد، مثلاً `</`

parse-attribute-value-unquoted = ارزشِ صفت‌ها باید در داخلِ نقل‌قول باشه: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ِ نادرست: تگِ بسته‌کنندهٔ `{ $tag }` پیدا شد، مگم تگِ باز کنندهٔ مطابقِ او نیست

parse-close-tag-mismatched = DoenetML ِ نادرست: تگِ بسته‌کننده جور نمی‌آیه. `</{ $expected }>` انتظار می‌رفت. `{ $found }` پیدا شد

parser-node-unconvertible = گرهِ { $node } به گرهِ Dast تبدیل نشد.

## Names

name-attribute-invalid =
    صفتِ نادرستِ name='{ $name }'. { $reason ->
        [characters] نام‌ها فقط حرف، عدد، خط زیر یا خط تیره داشته می‌تانه.
       *[start] نام‌ها باید قد یک حرف شروع شوه.
    }

component-name-invalid-start = نامِ نادرستِ جزءِ "{ $name }". نام‌ها باید قد یک حرف شروع شوه.

## `<answer>` sugar

answer-video-watched-missing-video = جوابِ تایپِ videoWatched باید صفتِ video داشته باشه

answer-video-watched-video-not-reference = صفتِ video ِ جوابِ تایپِ videoWatched باید یک مرجع باشه

answer-name-not-single-text = صفتِ name ِ جواب باید فقط یک فرزندِ text داشته باشه

## Referencing another document

external-doenetml-recursion-limit = به سببِ زیاد بودنِ سطح‌های بازگشتی، DoenetML ِ بیرونی گرفته نشد. مرجعِ دورانی استه؟

external-doenetml-unavailable = از { $attribute }="{ $uri }" DoenetML گرفته نشد

external-doenetml-type-mismatch = DoenetML ای که از { $attribute }="{ $uri }" گرفته شد نادرست استه: قد تایپِ جزءِ "{ $componentType }" جور نیامد

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] صفتِ `{ $from }` منسوخ شده؛ به جای او `{ $to }` استفاده کنین.
       *[other] [deprecation] صفتِ `{ $from }` سرِ `<{ $component }>` منسوخ شده؛ به جای او `{ $to }` استفاده کنین.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] صفتِ `{ $from }` منسوخ شده و نادیده گرفته می‌شه چون `{ $to }` هم مشخص شده.
       *[other] [deprecation] صفتِ `{ $from }` سرِ `<{ $component }>` منسوخ شده و نادیده گرفته می‌شه چون `{ $to }` هم مشخص شده.
    }

deprecated-attribute-ignored = [deprecation] صفتِ `{ $attribute }` سرِ `<{ $component }>` منسوخ شده و نادیده گرفته می‌شه.

deprecated-attribute-to-child = [deprecation] صفتِ `{ $attribute }` سرِ `<{ $component }>` منسوخ شده؛ به جای او یک فرزندِ `<{ $child }>` استفاده کنین.

deprecated-attribute-value-renamed = [deprecation] ارزشِ `{ $value }` ِ صفتِ `{ $attribute }` سرِ `<{ $component }>` منسوخ شده؛ به جای او `{ $to }` استفاده کنین.


## Language coverage

pluralize-english-only = `<pluralize>` فقط انگلیسی ره جمع کده می‌تانه، پس در سندی که به { $locale } نوشته شده متنِ او بی‌تبدیل می‌مانه. شکلِ جمع ره مستقیم بنویسین، یا قد صفتِ `pluralForm` مشخص کنین.


## Checking against the schema

schema-element-unrecognized = عنصرِ `<{ $tag }>` یک عنصرِ شناخته‌شدهٔ Doenet نیست.

schema-element-not-allowed-at-root = عنصرِ `<{ $tag }>` در ریشهٔ سند اجازه نداره.

schema-element-not-allowed-inside = عنصرِ `<{ $tag }>` در داخلِ `<{ $parent }>` اجازه نداره.

schema-attribute-unrecognized = عنصرِ `<{ $tag }>` صفتی به نامِ `{ $attribute }` نداره.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] صفتِ `{ $attribute }` ِ عنصرِ `<{ $tag }>` باید یک فهرست باشه که هر درایهٔ او یکی از ای‌ها باشه: { $allowed }
       *[other] صفتِ `{ $attribute }` ِ عنصرِ `<{ $tag }>` باید یکی از ای‌ها باشه: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = نامِ نادرستِ نسخه بلدِ select.  نامِ نسخهٔ { $variantName } در { $numOptions } گزینه آمده مگم شمارِ انتخاب { $numToSelect } استه.

select-variant-name-without-options = بلدِ select چند نسخه مشخص شده مگم بلدِ نامِ ممکنِ نسخهٔ { $variantName } هیچ گزینه مشخص نشده.

select-variant-name-not-possible = نامِ نسخهٔ { $variantName } که بلدِ select مشخص شده یک نامِ ممکن نیست.

select-too-few-options = از فقط { $numOptions } جزء، { $numToSelect } جزء انتخاب نمی‌شه.

select-from-sequence-too-few-values = از دنباله‌ای به درازیِ { $length }، { $numToSelect } ارزش انتخاب نمی‌شه.

select-from-sequence-indices-count-mismatch = شمارِ اندیس‌های مشخص‌شده بلدِ select باید قد شمارِ انتخاب برابر باشه

select-from-sequence-indices-not-integers = تمامِ اندیس‌های مشخص‌شده بلدِ select باید عددِ صحیح باشه

select-from-sequence-index-excluded = اندیسِ مشخص‌شدهٔ selectfromsequence بیرون مانده بود

select-from-sequence-indices-excluded-combination = اندیس‌های مشخص‌شدهٔ selectfromsequence یک ترکیبِ بیرون‌مانده بود

select-from-sequence-coprime-not-positive-integers = چون عددهای صحیحِ مثبت انتخاب نمی‌شه، ترکیب‌های coprime انتخاب نمی‌شه.

select-from-sequence-coprime-common-factor = عددهای coprime انتخاب نمی‌شه. تمامِ ارزش‌های ممکن یک عاملِ مشترک داره. (ارزش‌های مشخص‌شدهٔ "from" یا "to" باید قد "step" ِ coprime باشه.)

select-from-sequence-coprime-single-number = از یک عددِ تنها که 1 نیست، ترکیب‌های coprime انتخاب نمی‌شه.

select-from-sequence-excluded-too-many-combinations = در selectFromSequence زیادتر از %70 ترکیب‌ها بیرون مانده

select-from-sequence-coprime-none-found = عددهای coprime انتخاب نشد. تمامِ ارزش‌های ممکن یک عاملِ مشترک داره.

select-from-sequence-too-few-unique-values = از دنباله‌ای به درازیِ { $numPossibleValues }، { $numToSelect } ارزشِ یگانه انتخاب نمی‌شه

select-prime-numbers-too-few-values = از فهرستِ عددهای اولیه به درازیِ { $numValues }، { $numToSelect } ارزش انتخاب نمی‌شه

select-prime-numbers-values-count-mismatch = شمارِ ارزش‌های مشخص‌شده بلدِ select باید قد شمارِ انتخاب برابر باشه

select-prime-numbers-values-not-prime = تمامِ ارزش‌های مشخص‌شده بلدِ انتخابِ عددِ اولیه باید در فهرستِ عددهای اولیه باشه

select-prime-numbers-values-excluded-combination = ارزش‌های مشخص‌شدهٔ selectPrimeNumbers یک ترکیبِ بیرون‌مانده بود

select-prime-numbers-excluded-too-many-combinations = در selectPrimeNumbers زیادتر از %70 ترکیب‌ها بیرون مانده

select-random-combination-fluke = به یک تصادفِ زیاد کم‌احتمال، ترکیبِ ارزش‌های تصادفی انتخاب نشد

select-random-value-fluke = به یک تصادفِ زیاد کم‌احتمال، ارزشِ تصادفی انتخاب نشد

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` در داخلِ ریاضی کشیده نمی‌شه؛ عبارت همیطور چاپ می‌شه که پیش از ممکن شدنِ ورودی‌های داخلی چاپ می‌شد. { $reason ->
        [not-inline] در داخلِ یک عبارت فقط ورودیِ انتخابِ `inline` جای می‌شه؛ بدونِ `inline` او یک بلاکِ دکمه‌ها استه.
        [expanded] ورودیِ متنیِ `expanded` یک قوطیِ چندسطری استه و بلدِ نشستن در داخلِ یک عبارت زیاد کلان استه.
        [on-graph] سرِ گراف عبارت به شکلِ یک تصویرِ یکجایی کشیده می‌شه و در داخلِ او بلدِ کنترول جای نیست.
       *[relative-width] `width` ِ او نسبی استه (فیصد یا `em`) و در داخلِ یک عبارت هیچ چیز نیست که قد او اندازه شوه. عرض ره قد واحدهای مطلق، مثلِ `px`، بتین.
    }
