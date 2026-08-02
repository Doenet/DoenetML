# Persian warnings and errors. Translated from `locales/en/diagnostics.ftl`,
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
# Persian punctuates with «،» and «؛» and asks with «؟». Brackets, quotes and
# the full stop are the same characters as in English and are written
# opening-first, in logical order; the bidi algorithm turns them around when
# the text is drawn.
#
# Where English distinguishes a singular from a plural only in the verb — "is
# ignored" against "are ignored" — Persian says one thing, and the select is
# dropped rather than written out twice identically. The count argument then
# goes unused, which is harmless: it stays in the English message for the
# languages that need it.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = وقتی دو نقطهٔ انتهایی مشخص شده باشد، { $attributes } نادیده گرفته می‌شود

line-segment-attributes-ignored-with-endpoint-and-midpoint = وقتی یک نقطهٔ انتهایی و یک نقطهٔ میانی با هم مشخص شده باشند، { $attributes } نادیده گرفته می‌شود

line-segment-midpoint-offset-without-midpoint = بدون نقطهٔ میانی، midpointOffset اثری ندارد

## `<line>`

line-points-undetermined-dimensions = خطی که از نقاطی با ابعاد نامشخص می‌گذرد.

line-points-too-few-dimensions = خط باید از نقاطی با دست‌کم دو بُعد بگذرد.

line-points-depend-on-variables = خط از نقاطی می‌گذرد که به متغیرها وابسته‌اند: { $variables }.

line-equation-invalid-format = قالب نامعتبر برای معادلهٔ خط با متغیرهای { $variable1 } و { $variable2 }.

## `<ray>`

ray-overprescribed-through = نیم‌خط با through و endpoint و direction مشخص شده است. through مشخص‌شده نادیده گرفته می‌شود.

ray-dimension-mismatch = ناسازگاری numDimensions در نیم‌خط.

## `<vector>`

vector-overprescribed-head = بردار با head و tail و displacement مشخص شده است. head مشخص‌شده نادیده گرفته می‌شود.

vector-dimension-mismatch = ناسازگاری numDimensions در بردار.

## Attracting and constraining

attract-to-without-nearest-point = جذب به `<{ $component }>` ممکن نیست، چون متغیر حالت nearestPoint را ندارد.

constrain-to-without-nearest-point = مقید کردن به `<{ $component }>` ممکن نیست، چون متغیر حالت nearestPoint را ندارد.

constrain-to-interior-without-nearest-point = مقید کردن به درون `<{ $component }>` ممکن نیست، چون متغیر حالت nearestPoint را ندارد.

## `<choiceInput>`

choice-input-label-position-ignored = در choiceInput غیرِ درون‌خطی، labelPosition نادیده گرفته می‌شود

## Ordering children by index

choice-input-indices-count-mismatch = indices مشخص‌شده در choiceInput نادیده گرفته می‌شود، چون تعداد اندیس‌ها با تعداد فرزندان choice نمی‌خواند.

pretzel-indices-count-mismatch = indices مشخص‌شده در problem نادیده گرفته می‌شود، چون تعداد اندیس‌ها با تعداد فرزندان problem نمی‌خواند.

shuffle-indices-count-mismatch = indices مشخص‌شده در shuffle نادیده گرفته می‌شود، چون تعداد اندیس‌ها با تعداد مؤلفه‌ها نمی‌خواند.

indices-ignored-out-of-range = indices مشخص‌شده در { $component } نادیده گرفته می‌شود، چون برخی اندیس‌ها خارج از بازه‌اند.

pretzel-indices-repeated = indices مشخص‌شده در pretzel نادیده گرفته می‌شود، چون برخی اندیس‌ها تکراری‌اند.

pretzel-circuit-first-index = indices مشخص‌شده در pretzel در حالت circuit نادیده گرفته می‌شود، چون اندیس نخست باید 1 باشد.

## `<shuffle>` and `<sort>`

string-children-need-type = برای اینکه `<{ $component }>` با فرزندان رشته‌ای کار کند، باید ویژگی type مشخص شود.

invalid-type-defaulting-to-math = نوع { $type } برای مؤلفهٔ { $component } نامعتبر است. باید یکی از math، text، number یا boolean باشد. math به کار می‌رود.

string-not-valid-component-to-arrange = رشتهٔ "{ $value }" مؤلفهٔ معتبری نیست که { $component } بتواند آن را بچیند. نادیده گرفته می‌شود.

## Types and variables

invalid-type-defaulting-to-number = نوع { $type } نامعتبر است؛ نوع روی number تنظیم می‌شود.

invalid-variable-value = مقدار نامعتبر یک متغیر: `{ $value }`

## Variants

variant-index-must-be-number = اندیس نسخه { $index } باید عدد باشد

variant-index-must-be-integer = اندیس نسخه { $index } باید عدد صحیح باشد

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` برای اندازه‌های مطلق پیاده‌سازی نشده است. عرض‌ها نسبی تنظیم می‌شوند.

side-by-side-absolute-margins = `<{ $component }>` برای اندازه‌های مطلق پیاده‌سازی نشده است. حاشیه‌ها نسبی تنظیم می‌شوند.

side-by-side-no-block-child = `<{ $component }>` نامعتبر است: باید دست‌کم یک فرزند بلوکی داشته باشد.

## `<label>`

label-for-ignored-on-graphical = ویژگی `for` روی `<label>` گرافیکی نادیده گرفته می‌شود.

label-for-must-resolve-to-one = ویژگی `for` روی `<label>` باید دقیقاً به یک مؤلفه اشاره کند.

label-for-unresolved = ویژگی `for` روی `<label>` به هیچ مؤلفه‌ای نرسید.

label-for-answer-with-authored-inputs = ویژگی `for` روی `<label>` به `<answer>` ای اشاره می‌کند که ورودی‌هایش صریحاً نوشته شده‌اند؛ مستقیماً به خود ورودی اشاره کنید.

label-for-answer-without-input = ویژگی `for` روی `<label>` به `<answer>` ای اشاره می‌کند که ورودی‌ای برای برچسب‌گذاری ندارد.

label-for-must-reference-input-or-answer = ویژگی `for` روی `<label>` باید به یک ورودی یا به یک `<answer>` اشاره کند.

## Accessibility

accessibility-short-description-or-decorative = برای دسترس‌پذیری، `<{ $component }>` باید توصیف کوتاه داشته باشد یا تزئینی مشخص شود.

accessibility-video-short-description = برای دسترس‌پذیری، `<video>` باید توصیف کوتاه داشته باشد.

accessibility-input-short-description-or-label = برای دسترس‌پذیری، `<{ $component }>` باید توصیف کوتاه یا برچسب داشته باشد.

accessibility-answer-input-short-description-or-label = برای دسترس‌پذیری، `<answer>` ای که ورودی می‌سازد باید توصیف کوتاه یا برچسب داشته باشد.

accessibility-short-description-contains-math = توصیف کوتاه نباید مؤلفه‌های ریاضی مانند `<{ $component }>` داشته باشد. ریاضیات را با واژه بنویسید.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] کنتراست { $colorName } برای متن عنوان بخش کافی نیست (حالت تیره) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازم است).
       *[other] کنتراست { $colorName } برای متن عنوان بخش کافی نیست ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازم است).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` گذرنده از { $count } نقطه وقتی نقطه‌ها مقدار عددی ندارند پیاده‌سازی نشده است.

circle-too-many-through-points = محاسبهٔ دایرهٔ گذرنده از بیش از 3 نقطه ممکن نیست.

circle-overprescribed-radius-center-points = محاسبهٔ دایره با شعاع و مرکز و نقاط گذر، هر سه مشخص‌شده، ممکن نیست.

circle-center-with-multiple-points = محاسبهٔ دایره با مرکز مشخص که از بیش از یک نقطه بگذرد ممکن نیست.

circle-radius-too-small = محاسبهٔ دایره ممکن نیست: چون فاصلهٔ دو نقطه { $distance } است، شعاع مشخص‌شدهٔ { $radius } بسیار کوچک است.

circle-radius-with-many-points = ساختن دایرهٔ گذرنده از بیش از دو نقطه با شعاع مشخص ممکن نیست.

circle-invalid-center-or-through-points = مرکز یا نقاط گذر دایره نامعتبر است.

circle-radius-center-with-multiple-points = محاسبهٔ شعاع دایره با مرکز مشخص که از بیش از یک نقطه بگذرد ممکن نیست.

circle-change-radius-non-numerical = تغییر شعاع دایره‌ای که از نقاط غیرعددی می‌گذرد ممکن نیست

circle-radius-with-points-non-numerical = ساختن دایرهٔ گذرنده از بیش از یک نقطه با شعاع مشخص، وقتی مقدار عددی در دست نیست، ممکن نیست.

circle-change-center-non-numerical = تغییر مرکز دایره‌ای که از نقاط غیرعددی می‌گذرد پیاده‌سازی نشده است.

## `<function>`

function-domain-insufficient-dimensions = ابعاد دامنهٔ تابع کافی نیست. دامنه { $intervals } بازه دارد، ولی تابع { $inputs } ورودی دارد.

function-domain-invalid-format = قالب نامعتبر برای دامنهٔ تابع.

function-ignoring-non-numerical =
    { $type ->
        [maximum] بیشینهٔ غیرعددی تابع نادیده گرفته می‌شود.
        [minimum] کمینهٔ غیرعددی تابع نادیده گرفته می‌شود.
        [extremum] حد نهایی غیرعددی تابع نادیده گرفته می‌شود.
        [point] نقطهٔ غیرعددی تابع نادیده گرفته می‌شود.
        [slope] شیب غیرعددی تابع نادیده گرفته می‌شود.
       *[other] { $type } غیرعددی تابع نادیده گرفته می‌شود.
    }

function-ignoring-empty =
    { $type ->
        [maximum] بیشینهٔ خالی تابع نادیده گرفته می‌شود.
        [minimum] کمینهٔ خالی تابع نادیده گرفته می‌شود.
        [extremum] حد نهایی خالی تابع نادیده گرفته می‌شود.
        [point] نقطهٔ خالی تابع نادیده گرفته می‌شود.
       *[other] { $type } خالی تابع نادیده گرفته می‌شود.
    }

function-points-too-close = تابع دو نقطه دارد که مکانشان بیش از حد به هم نزدیک است. تعریف تابع ممکن نیست.

function-iterates-input-output-mismatch = تکرارهای تابع تنها وقتی ممکن است که شمار ورودی‌ها با شمار خروجی‌ها برابر باشد. این تابع { $inputs } ورودی و { $outputs } خروجی دارد.

## `<sequence>`

sequence-invalid-length = طول دنباله نامعتبر است. باید عدد صحیح نامنفی باشد.

sequence-invalid-step = گام دنباله نامعتبر است. برای دنبالهٔ نوع { $type } باید عدد باشد.

sequence-invalid-endpoint-number = مقدار "{ $attribute }" برای دنبالهٔ عددی نامعتبر است. باید عدد باشد.

sequence-invalid-endpoint-letters = مقدار "{ $attribute }" برای دنبالهٔ حرفی نامعتبر است. باید ترکیبی از حروف باشد.

sequence-invalid-endpoint = مقدار "{ $attribute }" برای دنباله نامعتبر است.

select-from-sequence-coprime-not-numbers = coprime نادیده گرفته شد، چون انتخاب از میان عددها نیست

select-from-sequence-coprime-with-exclude-combinations = coprime نادیده گرفته شد، چون excludeCombinations مشخص شده است

## Resolving a `target`

target-not-found = مقدار target در `<{ $source }>` نامعتبر است: هدف یافت نشد.

target-state-variable-not-found = مقدار target در `<{ $source }>` نامعتبر است: متغیر حالتی به نام "{ $property }" روی `<{ $component }>` یافت نشد.

## `<odeSystem>`

# «سمت راست» is the right-hand side of the equation and stays the right one:
# mathematics is a left-to-right island inside a Persian document, so the
# equation the phrase names is drawn the same way round as in English.
ode-system-variables-match-independent = متغیرهای `<odeSystem>` باید با متغیر مستقل فرق داشته باشند.

ode-system-duplicate-variable-names = تعریف توابع سمت راست معادلهٔ دیفرانسیل با نام‌های متغیر وابستهٔ تکراری ممکن نیست.

ode-system-rhs-function-error = تعریف تابع سمت راست معادلهٔ دیفرانسیل ممکن نیست. خطا در ساخت تابع mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = تعریف زاویه میان { $count } خط ممکن نیست

angle-invalid-through-point = نقطهٔ نامعتبر در through مربوط به `<angle>`

parabola-vertex-too-many-points = سهمی با رأس مشخص که از بیش از یک نقطه بگذرد پیاده‌سازی نشده است.

parabola-too-many-points = سهمی گذرنده از بیش از 3 نقطه پیاده‌سازی نشده است.

intersection-too-many-items = اشتراک برای بیش از دو مورد پیاده‌سازی نشده است

## Other math components

ionic-compound-not-two-ions = ترکیب یونی برای چیزی جز دو یون پیاده‌سازی نشده است.

ionic-compound-needs-cation-and-anion = ترکیب یونی تنها برای یک کاتیون و یک آنیون پیاده‌سازی شده است.

solve-equations-cannot-evaluate = حل معادله ممکن نیست، چون معادله ارزیابی نشد: { $equation }

math-operators-operand-number-required = هنگام استخراج یک عملوند ریاضی باید operandNumber مشخص شود.

eigen-decomposition-failed = محاسبهٔ مقادیر ویژهٔ ماتریس ممکن نشد

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: پارامتر { $parameters } در الگو نمی‌آید، پس همیشه با یک جای خالی مطابقت می‌کند.
       *[other] `<matchesPattern>`: پارامترهای { $parameters } در الگو نمی‌آیند، پس همیشه با یک جای خالی مطابقت می‌کنند.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: تفسیر grid="{ $grid }" ممکن نشد. باید none یا medium یا dense باشد، یا دو عدد مثبت جداشده با فاصله، مانند grid="1 0.5". هیچ شبکه‌ای رسم نمی‌شود.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: مقدار xLabelPosition="left" در نمایشگر prefigure پشتیبانی نمی‌شود؛ رفتار موضع right به کار می‌رود.

prefigure-y-label-position-unsupported = `<graph>`: مقدار yLabelPosition="bottom" در نمایشگر prefigure پشتیبانی نمی‌شود؛ رفتار موضع top به کار می‌رود.

prefigure-invalid-axis-bounds = `<graph>`: کران‌های محور برای تبدیل به prefigure نامعتبر است؛ bbox پیش‌فرض (-10,-10,10,10) به کار می‌رود.

prefigure-invalid-width = `<graph>`: عرض برای تبدیل به prefigure نامعتبر است؛ عرض پیش‌فرض نمودار 425 به کار می‌رود.

prefigure-invalid-aspect-ratio = `<graph>`: مقدار aspectRatio برای تبدیل به prefigure نامعتبر است؛ نسبت ابعاد پیش‌فرض 1 به کار می‌رود.

prefigure-grid-spacing-too-fine = `<graph>`: فاصلهٔ شبکه برای کران‌های محور بیش از حد ریز است؛ شبکه در نمایشگر prefigure حذف می‌شود.

prefigure-annotations-not-rendered = `<graph>`: وقتی نمایشگر PreFigure به کار نرود، حاشیه‌نویسی‌ها رسم نمی‌شوند.

multiple-annotations-children = بیش از یک فرزند `<annotations>` در `<graph>` یافت شد؛ همه جز آخری نادیده گرفته می‌شوند.

## Referring to other components

copy-unrecognized-component-type = گسترش یا کپی کردن نوع مؤلفهٔ ناشناخته ممکن نیست: { $type }.

copy-prop-not-found = ویژگی { $property } روی مؤلفه‌ای از نوع { $component } یافت نشد

collect-no-source = منبعی برای collect یافت نشد.

collect-invalid-component-type = گردآوری مؤلفه‌های نوع `<{ $component }>` ممکن نیست، چون نوع مؤلفهٔ نامعتبری است.

reference-index-unavailable = ارجاع به اندیس `{ $reference }` ممکن نیست

## `<callAction>`

component-action-unavailable = فراخوانی { $action } روی مؤلفهٔ `{ $reference }` ممکن نیست

## `<dataFrame>`

data-frame-inconsistent-row-lengths = شکل داده نامعتبر است. طول سطرها ناسازگار است. در componentIdx :{ $componentIdx } یافت شد

data-frame-duplicate-column-names = داده نام ستون تکراری دارد. در componentIdx :{ $componentIdx } یافت شد

data-frame-missing-column-name = داده یک نام ستون کم دارد. در componentIdx :{ $componentIdx } یافت شد

## `<answer>` and scoring

answer-award-depends-on-own-response = یکی از award های این پاسخ بر پایهٔ پاسخ ارسال‌شدهٔ خود عنصر answer است، که رفتار غیرمنتظره به بار می‌آورد.

answer-max-num-attempts-in-section-wide-check-work = تنظیم `maxNumAttempts` روی `<answer>` درون ظرفی با `sectionWideCheckWork` اثری ندارد، چون شمار تلاش‌ها را ظرف تعیین می‌کند. به جای آن `maxNumAttempts` را روی ظرف تنظیم کنید.

nested-section-wide-check-work-max-num-attempts = تنظیم `maxNumAttempts` روی ظرفی با `sectionWideCheckWork` که خود درون ظرف دیگری با `sectionWideCheckWork` است اثری ندارد، چون شمار تلاش‌ها را ظرف بیرونی تعیین می‌کند. `maxNumAttempts` را روی ظرف بیرونی تنظیم کنید.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] ویژگی { $attributes } بدون تنظیم symbolicEquality اثری ندارد.
       *[other] ویژگی‌های { $attributes } بدون تنظیم symbolicEquality اثری ندارند.
    }

answer-invalid-type = نوع نامعتبر برای پاسخ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = چون مؤلفهٔ `<{ $component }>` نام ندارد، نمی‌توان آن را ویژگی یک module قرار داد

module-attribute-name-already-defined = مؤلفهٔ `<{ $component } name="{ $name }">` را نمی‌توان ویژگی یک module قرار داد، چون نوع مؤلفهٔ `<module>` از پیش ویژگی‌ای به نام "{ $name }" دارد.

conditional-content-condition-ignored = ویژگی `condition` روی مؤلفهٔ `<conditionalContent>` که فرزند case یا else دارد نادیده گرفته می‌شود.

slider-markers-type-mismatch = نوع نشانگرها با نوع لغزنده نمی‌خواند.

pretzel-problem-needs-statement-and-answer = pretzel نامعتبر: هر `<problem>` باید یک `<statement>` و یک `<answer>` داشته باشد.

pretzel-circuit-first-problem-distractor = pretzel نامعتبر: در mode="circuit" نخستین `<problem>` نمی‌تواند گمراه‌کننده باشد.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] مقدار { $values } برای ویژگی `{ $attribute }` نامعتبر است؛ نادیده گرفته می‌شود.
       *[other] مقادیر { $values } برای ویژگی `{ $attribute }` نامعتبر است؛ نادیده گرفته می‌شود.
    }

attribute-must-be-references = مقدار `{ $value }` برای ویژگی `{ $attribute }` نامعتبر است. ویژگی باید از ارجاع‌هایی ساخته شود که با `$` آغاز می‌شوند.

math-input-invalid-function-names = <mathInput>: نام‌های تابع نامعتبر در { $attribute } نادیده گرفته شد: { $names }. بخش نمایشی هر نام باید دست‌کم دو نویسه باشد (حرف یا خط تیره)؛ پس از آن می‌تواند پسوند اختیاری `|<mathspeak alternative>` بیاید.

## Building components from the source

component-type-invalid = نوع مؤلفهٔ نامعتبر: `<{ $componentType }>`

attribute-repeated = ویژگی { $attribute } را نمی‌توان تکرار کرد.

attribute-invalid-for-component = ویژگی "{ $attribute }" برای مؤلفه‌ای از نوع `<{ $componentType }>` نامعتبر است.

## Style definition contrast

style-definition-insufficient-contrast =
    کنتراست تعریف سبک { $styleNumber } کافی نیست، در { $context ->
        [text-on-background] رنگ متن در برابر رنگ پس‌زمینه
        [high-contrast] رنگ پرکنتراست در برابر بوم
        [line] رنگ خط در برابر بوم
        [marker] رنگ نشانگر در برابر بوم
       *[text-on-canvas] رنگ متن در برابر بوم
    }{ $mode ->
        [dark] { " (حالت تیره)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازم است).

style-definition-dark-mode-text-background-contrast =
    هرچند تعریف سبک { $styleNumber } رنگ‌هایی مشخص کرده که در حالت روشن کنتراست کافی دارند، رنگ‌های حالت تیره که از آن‌ها مشتق می‌شوند کنتراست کافی میان رنگ متن و رنگ پس‌زمینه نمی‌دهند ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازم است). { $suggestion ->
        [available] برای کنتراست کافی در حالت تیره، یا کنتراست حالت روشن را بیشتر کنید (مثلاً { $lightAttribute }="{ $lightColor }") یا رنگ حالت تیره را بازنویسی کنید (مثلاً { $darkAttribute }="{ $darkColor }").
       *[none] برای کنتراست کافی در حالت تیره، کنتراست حالت روشن را بیشتر کنید یا رنگ‌های مشتق‌شده را با textColorDarkMode و/یا backgroundColorDarkMode بازنویسی کنید.
    }

style-definition-dark-mode-text-canvas-contrast =
    هرچند تعریف سبک { $styleNumber } رنگ متنی مشخص کرده که در حالت روشن کنتراست کافی دارد، رنگ متن حالت تیره که از آن مشتق می‌شود در برابر بوم کنتراست کافی ندارد ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ دست‌کم { $threshold }:1 لازم است). { $suggestion ->
        [available] برای کنتراست کافی در حالت تیره، یا کنتراست حالت روشن را بیشتر کنید (مثلاً textColor="{ $lightColor }") یا رنگ حالت تیره را بازنویسی کنید (مثلاً textColorDarkMode="{ $darkColor }").
       *[none] برای کنتراست کافی در حالت تیره، کنتراست حالت روشن را بیشتر کنید یا رنگ مشتق‌شده را با textColorDarkMode بازنویسی کنید.
    }

section-multiple-style-palettes = یک بخش تنها می‌تواند یک <stylePalette> برگزیند؛ آخرین مورد به کار می‌رود.

## Unique variants

variant-num-to-select-not-non-negative-integer = تعیین نسخه‌های یکتای مؤلفهٔ { $component } ممکن نیست، چون numToSelect عدد صحیح نامنفی نیست.

variant-num-to-select-not-constant-number = تعیین نسخه‌های یکتای مؤلفهٔ { $component } ممکن نیست، چون numToSelect عدد ثابت نیست.

variant-with-replacement-not-constant-boolean = تعیین نسخه‌های یکتای مؤلفهٔ { $component } ممکن نیست، چون withReplacement مقدار بولی ثابت نیست.

variant-select-weight-disables-unique = اگر گزینه‌ای selectWeight یا selectForVariants داشته باشد، نسخه‌های یکتا برای select از کار می‌افتد

variant-coprime-undetermined = تعیین نسخه‌های یکتای مؤلفهٔ { $component } ممکن نیست، چون نمی‌توان مطمئن شد coprime همیشه نادرست است.

variant-attribute-not-constant = تعیین نسخه‌های یکتای مؤلفهٔ { $component } ممکن نیست، چون { $attribute } ثابت نیست.

variant-attribute-not-number = تعیین نسخه‌های یکتای مؤلفهٔ { $component } ممکن نیست، چون { $attribute } عدد نیست.

variant-attribute-wrong-type-for-sequence =
    تعیین نسخه‌های یکتای مؤلفهٔ { $component } از نوع { $type } ممکن نیست، چون { $attribute } { $expected ->
        [letters-combination] ترکیبی از حروف
        [math-expression] عبارت ریاضی معتبر
        [integer] عدد صحیح
       *[number] عدد
    } نیست.

variant-length-not-integer = تعیین نسخه‌های یکتای مؤلفهٔ { $component } ممکن نیست، چون length عدد صحیح نیست.

variant-sort-not-implemented = نسخه‌های یکتای { $component } همراه با sort پیاده‌سازی نشده است

variant-exclude-combinations-not-implemented = نسخه‌های یکتای { $component } همراه با excludeCombinations پیاده‌سازی نشده است

variant-math-exclude-not-implemented = نسخه‌های یکتای { $component } از نوع math همراه با exclude پیاده‌سازی نشده است

variant-non-constant-exclude-not-implemented = نسخه‌های یکتای { $component } همراه با exclude ناثابت پیاده‌سازی نشده است

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: در نمایشگر prefigure نمودار پشتیبانی نمی‌شود؛ از این فرزند صرف‌نظر شد.

prefigure-descendant-invalid-geometry = { $subject }: هندسهٔ نامتناهی یا ناقص؛ از این فرزند صرف‌نظر شد.

prefigure-curve-label-omitted = { $subject }: برچسب روی عناصر منحنی تبدیل‌شده پشتیبانی نمی‌شود؛ برچسب حذف شد.

prefigure-curve-unsupported-definition-type = { $subject }: نوع تعریف تابع منحنی '{ $definitionType }' پشتیبانی نمی‌شود؛ از این فرزند صرف‌نظر شد.

prefigure-region-flip-functions-unsupported = { $subject }: ویژگی flipFunctions روی regionBetweenCurves پشتیبانی نمی‌شود؛ از این فرزند صرف‌نظر شد.

prefigure-region-non-formula-child = { $subject }: روی regionBetweenCurves تنها توابع فرزندی که با فرمول تعریف شده‌اند پشتیبانی می‌شوند؛ از این فرزند صرف‌نظر شد.

prefigure-label-position-unsupported =
    { $subject }: مقدار labelPosition '{ $labelPosition }' برای { $labelKind ->
        [line-family] برچسب خانوادهٔ خط
       *[point] برچسب نقطه
    } پشتیبانی نمی‌شود؛ چینش پیش‌فرض PreFigure به کار رفت.

prefigure-fill-style-unsupported = { $subject }: سبک پرکردن '{ $fillStyle }' در PreFigure پشتیبانی نمی‌شود؛ پرکردن یکدست به کار می‌رود.

prefigure-line-style-unknown = { $subject }: سبک خط '{ $lineStyle }' ناشناخته است و از خروجی PreFigure حذف شد.

prefigure-marker-style-mapped-to-diamond = { $subject }: سبک نشانگر '{ $markerStyle }' به سبک 'diamond' در PreFigure نگاشته شد.

prefigure-marker-style-unsupported = { $subject }: سبک نشانگر '{ $markerStyle }' در PreFigure پشتیبانی نمی‌شود؛ سبک پیش‌فرض به کار رفت.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: مقدار `ref` نامعتبر است؛ هدف مشخص نشد. حاشیه‌نویسی حذف شد.

annotation-ref-multiple-targets = `<annotation>`: `ref` به بیش از یک هدف رسید؛ هدف نخست به کار می‌رود.

annotation-ref-outside-graph = `<annotation>`: مقدار `ref` نامعتبر است؛ هدف بیرون از نمودار دربرگیرنده است. حاشیه‌نویسی حذف شد.

annotation-ref-unsupported-target = `<annotation>`: مقدار `ref` نامعتبر است؛ هدف در تبدیل به prefigure شیء گرافیکی پشتیبانی‌شده‌ای نیست. حاشیه‌نویسی حذف شد.

annotation-text-missing = `<annotation>`: مقدار `text` نبود یا خالی بود؛ متن خالی داده می‌شود.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] وابستگی حلقوی شناسایی شد.
       *[other] وابستگی حلقوی شناسایی شد که مؤلفهٔ `<{ $componentType }>` را دربر می‌گیرد.
    }

reference-no-referent = مرجعی برای ارجاع یافت نشد: `{ $reference }`

reference-multiple-referents = بیش از یک مرجع برای ارجاع یافت شد: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = قالب نامعتبر برای ویژگی { $attribute } در `<{ $componentType }>`.

children-invalid = فرزندان نامعتبر برای `<{ $componentType }>`: فرزندان نامعتبر یافت شد: { $children }

## Falling back to a default

attribute-value-invalid-using-default = مقدار `{ $value }` برای ویژگی `{ $attribute }` نامعتبر است؛ مقدار `{ $default }` به کار می‌رود

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] نسخهٔ { $version } از DoenetML یافت نشد.
       *[other] نسخهٔ { $version } از DoenetML یافت نشد. نسخهٔ { $fallback } به جای آن به کار می‌رود
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML نامعتبر: { $content }

parse-tag-missing-close-tag = DoenetML نامعتبر: برچسب `{ $tag }` برچسب پایانی ندارد. برچسب خودبسته یا برچسب `</{ $tagName }>` انتظار می‌رفت.

parse-tag-error = DoenetML نامعتبر: خطا در برچسب `<{ $tagName }>`

parse-attribute-missing-value = DoenetML نامعتبر: به نظر می‌رسد ویژگی نامعتبر `{ $attribute }` مقدار ندارد.

parse-attribute-invalid = DoenetML نامعتبر: ویژگی `{ $attribute }` نامعتبر است

parse-attribute-value-invalid = DoenetML نامعتبر: مقدار ویژگی `{ $value }` نامعتبر است

parse-attribute-value-quote-mismatch = DoenetML نامعتبر: مقدار ویژگی `{ $value }` نامعتبر است. گیومه‌ها با هم نمی‌خوانند. به نظر می‌رسد یک `{ $quote }` کم دارید

parse-open-tag-name-missing = DoenetML نامعتبر: برچسبی بدون نام یافت شد، مانند `<`

parse-tag-not-closed = DoenetML نامعتبر: برچسب `{ $tag }` بسته نشد (به نظر می‌رسد `>` کم است).

parse-self-closing-tag-name-missing = DoenetML نامعتبر: برچسبی بدون نام یافت شد `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML نامعتبر: برچسب `{ $tag }` بسته نشد (به نظر می‌رسد `/>` کم است).

parse-tag-invalid-attributes = DoenetML نامعتبر: برچسب `{ $tag }` معتبر نیست. شاید ویژگی‌هایش نادرست باشد.

parse-close-tag-name-missing = DoenetML نامعتبر: برچسب پایانی بدون نام یافت شد، مانند `</`

parse-attribute-value-unquoted = مقدار ویژگی‌ها باید درون گیومه بیاید: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML نامعتبر: برچسب پایانی `{ $tag }` یافت شد، ولی برچسب آغازین متناظری ندارد

parse-close-tag-mismatched = DoenetML نامعتبر: برچسب پایانی ناسازگار. `</{ $expected }>` انتظار می‌رفت. `{ $found }` یافت شد

parser-node-unconvertible = تبدیل گرهٔ { $node } به گرهٔ Dast ممکن نشد.

## Names

name-attribute-invalid =
    ویژگی name='{ $name }' نامعتبر است. { $reason ->
        [characters] نام‌ها تنها می‌توانند حرف، رقم، زیرخط یا خط تیره داشته باشند.
       *[start] نام‌ها باید با حرف آغاز شوند.
    }

component-name-invalid-start = نام مؤلفهٔ "{ $name }" نامعتبر است. نام‌ها باید با حرف آغاز شوند.

## `<answer>` sugar

answer-video-watched-missing-video = پاسخ با نوع videoWatched باید ویژگی video داشته باشد

answer-video-watched-video-not-reference = ویژگی video در پاسخ با نوع videoWatched باید یک ارجاع باشد

answer-name-not-single-text = ویژگی name در پاسخ باید یک فرزند متنی داشته باشد

## Referencing another document

external-doenetml-recursion-limit = دریافت DoenetML بیرونی به سبب بازگشت بیش از حد ممکن نشد. آیا ارجاع حلقوی وجود دارد؟

external-doenetml-unavailable = دریافت DoenetML از { $attribute }="{ $uri }" ممکن نشد

external-doenetml-type-mismatch = DoenetML دریافت‌شده از { $attribute }="{ $uri }" نامعتبر است: با نوع مؤلفهٔ "{ $componentType }" نمی‌خواند

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] ویژگی `{ $from }` منسوخ است؛ به جای آن `{ $to }` را به کار ببرید.
       *[other] [deprecation] ویژگی `{ $from }` روی `<{ $component }>` منسوخ است؛ به جای آن `{ $to }` را به کار ببرید.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] ویژگی `{ $from }` منسوخ است و نادیده گرفته شد، چون `{ $to }` هم مشخص شده است.
       *[other] [deprecation] ویژگی `{ $from }` روی `<{ $component }>` منسوخ است و نادیده گرفته شد، چون `{ $to }` هم مشخص شده است.
    }

deprecated-attribute-ignored = [deprecation] ویژگی `{ $attribute }` روی `<{ $component }>` منسوخ است و نادیده گرفته شد.


## Language coverage

pluralize-english-only = `<pluralize>` تنها می‌تواند واژه‌های انگلیسی را جمع ببندد، پس در سندی که به زبان { $locale } نوشته شده متنش دست‌نخورده می‌ماند. شکل جمع را مستقیم بنویسید، یا آن را با ویژگی `pluralForm` مشخص کنید.


## Checking against the schema

schema-element-unrecognized = عنصر `<{ $tag }>` عنصر شناخته‌شده‌ای در Doenet نیست.

schema-element-not-allowed-at-root = عنصر `<{ $tag }>` در ریشهٔ سند مجاز نیست.

schema-element-not-allowed-inside = عنصر `<{ $tag }>` درون `<{ $parent }>` مجاز نیست.

schema-attribute-unrecognized = عنصر `<{ $tag }>` ویژگی‌ای به نام `{ $attribute }` ندارد.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] ویژگی `{ $attribute }` در عنصر `<{ $tag }>` باید فهرستی باشد که هر درایه‌اش یکی از این‌هاست: { $allowed }
       *[other] ویژگی `{ $attribute }` در عنصر `<{ $tag }>` باید یکی از این‌ها باشد: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = نام نسخهٔ نامعتبر برای select. نام نسخهٔ { $variantName } در { $numOptions } گزینه می‌آید، ولی شمار انتخاب { $numToSelect } است.

select-variant-name-without-options = برای select چند نسخه مشخص شده، ولی برای نام نسخهٔ ممکن هیچ گزینه‌ای مشخص نشده است: { $variantName }.

select-variant-name-not-possible = نام نسخهٔ { $variantName } که برای select مشخص شده، نام نسخهٔ ممکنی نیست.

select-too-few-options = انتخاب { $numToSelect } مؤلفه از میان تنها { $numOptions } تا ممکن نیست.

select-from-sequence-too-few-values = انتخاب { $numToSelect } مقدار از دنباله‌ای به طول { $length } ممکن نیست.

select-from-sequence-indices-count-mismatch = شمار اندیس‌های مشخص‌شده برای select باید با شمار انتخاب بخواند

select-from-sequence-indices-not-integers = همهٔ اندیس‌های مشخص‌شده برای select باید عدد صحیح باشند

select-from-sequence-index-excluded = اندیس مشخص‌شدهٔ selectfromsequence مستثنا شده بود

select-from-sequence-indices-excluded-combination = اندیس‌های مشخص‌شدهٔ selectfromsequence ترکیبی مستثنا بود

select-from-sequence-coprime-not-positive-integers = انتخاب ترکیب‌های نسبت‌به‌هم‌اول ممکن نیست، چون انتخاب از میان عددهای صحیح مثبت نیست.

select-from-sequence-coprime-common-factor = انتخاب عددهای نسبت‌به‌هم‌اول ممکن نیست. همهٔ مقادیر ممکن عامل مشترکی دارند. (مقدار مشخص‌شدهٔ "from" یا "to" باید نسبت به "step" اول باشد.)

select-from-sequence-coprime-single-number = انتخاب ترکیب‌های نسبت‌به‌هم‌اول از یک عدد که 1 نیست ممکن نیست.

select-from-sequence-excluded-too-many-combinations = بیش از 70% ترکیب‌ها در selectFromSequence مستثنا شد

select-from-sequence-coprime-none-found = انتخاب عددهای نسبت‌به‌هم‌اول ممکن نشد. همهٔ مقادیر ممکن عامل مشترکی دارند.

select-from-sequence-too-few-unique-values = انتخاب { $numToSelect } مقدار یکتا از دنباله‌ای به طول { $numPossibleValues } ممکن نیست

select-prime-numbers-too-few-values = انتخاب { $numToSelect } مقدار از فهرست عددهای اول به طول { $numValues } ممکن نیست

select-prime-numbers-values-count-mismatch = شمار مقادیر مشخص‌شده برای select باید با شمار انتخاب بخواند

select-prime-numbers-values-not-prime = همهٔ مقادیر مشخص‌شده برای select prime number باید در فهرست عددهای اول باشند

select-prime-numbers-values-excluded-combination = مقادیر مشخص‌شدهٔ selectPrimeNumbers ترکیبی مستثنا بود

select-prime-numbers-excluded-too-many-combinations = بیش از 70% ترکیب‌ها در selectPrimeNumbers مستثنا شد

select-random-combination-fluke = بر اثر تصادفی بسیار نامحتمل، انتخاب ترکیبی از مقادیر تصادفی ممکن نشد

select-random-value-fluke = بر اثر تصادفی بسیار نامحتمل، انتخاب مقدار تصادفی ممکن نشد
