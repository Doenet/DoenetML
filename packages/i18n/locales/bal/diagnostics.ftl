# Balochi (بلوچی) diagnostics: the errors and warnings the core and the
# language server put in front of whoever is looking at the screen. Translated
# from `locales/en/diagnostics.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Southern Balochi as written in Pakistan, Perso-Arabic on the Urdu letter
# inventory, right to left — the same convention the other three files of this
# locale state.
#
# **Element names, attribute names and values are not words.** `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `math`, `text`, `boolean`,
# `coprime`, `selectFromSequence` and every `<tag>` written into these
# sentences are DoenetML identifiers and stay in English exactly as they are.
# The backticks and angle brackets around them are this catalog's punctuation.
#
# **No message here selects on a count**, although `bal` is the one tag in its
# batch that CLDR gives real plural data to. It gives `one` and `other`, with
# zero in `other`; Balochi leaves a noun unmarked after a numeral, so the two
# branches would carry identical text and each such message is written once as
# `*[other]`. The count argument then goes unused, which is harmless. The
# symbolic selectors — `$reason`, `$type`, `$mode`, `$suggestion`, `$isList`
# and the rest — keep every branch English has, because those keys are
# compared letter for letter and a renamed one is a branch nothing can reach.
#
# **Vocabulary chosen once and used throughout**, so a correction is one
# search: «نظرانداز بیت» for *is ignored*, «مقرر بوتگیں» for *specified*,
# «غلط» for *invalid*, «قیمت» for *value*, «ایٹریبیوٹ» for *attribute*,
# «کمپوننٹ» for *component*, «باید» for *must*, «کپت» for *found*. Those and
# `ریفرنس`, `میٹرکس`, `ٹائپ`, `فنکشن`, `ویکٹر`, `انڈیکس`, `ورینٹ` are Urdu or
# English loans kept rather than coined.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] وھدے کہ دو endpoint مقرر بنت، { $attributes } نظرانداز بیت
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] وھدے کہ یک endpoint ءُ یک midpoint ہر دو مقرر بنت، { $attributes } نظرانداز بیت
    }

line-segment-midpoint-offset-without-midpoint = بے midpoint ءَ، midpointOffset ہچ اثر ے نہ کنت

## `<line>`

line-points-undetermined-dimensions = خط ھما نقطہ آں ءَ چه رئیت کہ آ ھانی نامعلوم اَنت.

line-points-too-few-dimensions = خط باید کہ ھما نقطہ آں ءَ چه بروت کہ کمترین دو ھانی دارنت.

line-points-depend-on-variables = خط ھما نقطہ آں ءَ چه رئیت کہ اے ویریئبلاں ءَ بستگ اَنت: { $variables }.

line-equation-invalid-format = ویریئبل { $variable1 } ءُ { $variable2 } ءِ تہ ءَ خط ءِ مساوات ءِ فارمیٹ غلط اِنت.

## `<ray>`

ray-overprescribed-through = شعاع through، endpoint ءُ direction چه مقرر بوتگ.  مقرر بوتگیں through نظرانداز بیت.

ray-dimension-mismatch = شعاع ءِ تہ ءَ numDimensions جوڑ نہ کیت.

## `<vector>`

vector-overprescribed-head = ویکٹر head، tail ءُ displacement چه مقرر بوتگ.  مقرر بوتگیں head نظرانداز بیت.

vector-dimension-mismatch = ویکٹر ءِ تہ ءَ numDimensions جوڑ نہ کیت.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ءِ کنٹ ءَ کشگ نہ بیت، پرچا کہ آ ءِ ءَ nearestPoint ھالی ویریئبل ے نیست.

constrain-to-without-nearest-point = `<{ $component }>` ءِ کنٹ ءَ بندگ نہ بیت، پرچا کہ آ ءِ ءَ nearestPoint ھالی ویریئبل ے نیست.

constrain-to-interior-without-nearest-point = `<{ $component }>` ءِ تہ ءِ کنٹ ءَ بندگ نہ بیت، پرچا کہ آ ءِ ءَ nearestPoint ھالی ویریئبل ے نیست.

## `<choiceInput>`

choice-input-label-position-ignored = ھما choiceInput ءِ واستہ کہ inline نہ اِنت، labelPosition نظرانداز بیت

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput ءِ انڈیکس نظرانداز بنت، پرچا کہ انڈیکساں ءِ تعداد ءُ choice ءِ چکاں ءِ تعداد جوڑ نہ کنت.

pretzel-indices-count-mismatch = problem ءِ انڈیکس نظرانداز بنت، پرچا کہ انڈیکساں ءِ تعداد ءُ problem ءِ چکاں ءِ تعداد جوڑ نہ کنت.

shuffle-indices-count-mismatch = shuffle ءِ انڈیکس نظرانداز بنت، پرچا کہ انڈیکساں ءِ تعداد ءُ کمپوننٹاں ءِ تعداد جوڑ نہ کنت.

indices-ignored-out-of-range = { $component } ءِ انڈیکس نظرانداز بنت، پرچا کہ چند انڈیکس حد ءَ چه در اَنت.

pretzel-indices-repeated = pretzel ءِ انڈیکس نظرانداز بنت، پرچا کہ چند انڈیکس پدا آتکگ اَنت.

pretzel-circuit-first-index = circuit موڈ ءَ pretzel ءِ انڈیکس نظرانداز بنت، پرچا کہ اولی انڈیکس باید کہ 1 ببیت.

## `<shuffle>` and `<sort>`

string-children-need-type = تانکہ `<{ $component }>` string چکاں ءِ گون کار کنت، type ایٹریبیوٹ باید کہ مقرر ببیت.

invalid-type-defaulting-to-math = { $component } کمپوننٹ ءِ واستہ ٹائپ { $type } غلط اِنت. باید کہ math، text، number یا boolean ببیت. پیشدار math کارمرز بیت.

string-not-valid-component-to-arrange = String "{ $value }" ھما { $component } ءِ واستہ درستیں کمپوننٹ ے نہ اِنت. نظرانداز بیت.

## Types and variables

invalid-type-defaulting-to-number = ٹائپ { $type } غلط اِنت، ٹائپ number ءَ مقرر بیت.

invalid-variable-value = ویریئبل ءِ قیمت غلط اِنت: `{ $value }`

## Variants

variant-index-must-be-number = ورینٹ ءِ انڈیکس { $index } باید کہ عدد ے ببیت

variant-index-must-be-integer = ورینٹ ءِ انڈیکس { $index } باید کہ صحیح عدد ے ببیت

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` مطلق پیمائش ءِ واستہ نہ جوڑ بوتگ. پہنائی نسبتی ءَ مقرر بیت.

side-by-side-absolute-margins = `<{ $component }>` مطلق پیمائش ءِ واستہ نہ جوڑ بوتگ. مارجن نسبتی ءَ مقرر بیت.

side-by-side-no-block-child = `<{ $component }>` غلط اِنت: باید کہ کمترین یک بلاک چک ے دارت.

## `<label>`

label-for-ignored-on-graphical = گرافیکی `<label>` ءِ سرا `for` ایٹریبیوٹ نظرانداز بیت.

label-for-must-resolve-to-one = `<label>` ءِ `for` ایٹریبیوٹ باید کہ ٹھیک یک کمپوننٹ ءَ نشان بدنت.

label-for-unresolved = `<label>` ءِ `for` ایٹریبیوٹ ہچ کمپوننٹ ے ءَ نشان نہ دات.

label-for-answer-with-authored-inputs = `<label>` ءِ `for` ایٹریبیوٹ ھما `<answer>` ے ءَ نشان دنت کہ آ ءِ اِنپٹ نبیسوک چه نبشتہ بوتگ؛ سیدا اِنپٹ ءَ ریفرنس بدے.

label-for-answer-without-input = `<label>` ءِ `for` ایٹریبیوٹ ھما `<answer>` ے ءَ نشان دنت کہ آ ءِ ءَ نام دیگ ءِ واستہ اِنپٹ ے نیست.

label-for-must-reference-input-or-answer = `<label>` ءِ `for` ایٹریبیوٹ باید کہ یا اِنپٹ ے یا answer ے ءَ ریفرنس بدنت.

## Accessibility

accessibility-short-description-or-decorative = رسیدگی ءِ واستہ `<{ $component }>` باید کہ یا کوتاہیں تشریح ے دارت یا decorative ءَ مقرر ببیت.

accessibility-video-short-description = رسیدگی ءِ واستہ `<video>` باید کہ کوتاہیں تشریح ے دارت.

accessibility-input-short-description-or-label = رسیدگی ءِ واستہ `<{ $component }>` باید کہ کوتاہیں تشریح ے یا label ے دارت.

accessibility-answer-input-short-description-or-label = رسیدگی ءِ واستہ ھما `<answer>` ے کہ اِنپٹ ے جوڑ کنت باید کہ کوتاہیں تشریح ے یا label ے دارت.

accessibility-short-description-contains-math = کوتاہیں تشریح باید کہ `<{ $component }>` رنگیں ریاضی ءِ کمپوننٹاں ءَ نہ دارت. ریاضی ءَ لفظاں ءِ گون بنبیس.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } بہر ءِ سرگپت ءِ متن ءِ واستہ بس ایں کنٹراسٹ ے نہ دنت (تاہاریں موڈ) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کمترین { $threshold }:1 لوٹیت).
       *[other] { $colorName } بہر ءِ سرگپت ءِ متن ءِ واستہ بس ایں کنٹراسٹ ے نہ دنت ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کمترین { $threshold }:1 لوٹیت).
    }

## `<circle>`

circle-through-points-non-numerical = نقطہ آں ءِ عددی قیمت نیست؛ { $count } نقطہ آں ءَ چه رئوکیں `<circle>` ہنوں تانکہ نہ جوڑ بوتگ.

circle-too-many-through-points = 3 نقطہ آں ءَ چه گیشتر ءَ رئوکیں دائرہ ءِ حساب نہ بیت.

circle-overprescribed-radius-center-points = مقرر بوتگیں شعاع، مرکز ءُ نقطہ آں ءِ گون دائرہ ءِ حساب نہ بیت.

circle-center-with-multiple-points = مقرر بوتگیں مرکز ءِ گون 1 نقطہ ءَ چه گیشتر ءَ رئوکیں دائرہ ءِ حساب نہ بیت.

circle-radius-too-small = دائرہ ءِ حساب نہ بیت: دو نقطہ آں ءِ نیام ءِ دوری { $distance } اِنت، اے واستہ مقرر بوتگیں شعاع { $radius } کمتر اِنت.

circle-radius-with-many-points = مقرر بوتگیں شعاع ءِ گون دو نقطہ آں ءَ چه گیشتر ءَ رئوکیں دائرہ نہ جوڑ بیت.

circle-invalid-center-or-through-points = دائرہ ءِ مرکز یا نقطہ غلط اَنت.

circle-radius-center-with-multiple-points = مقرر بوتگیں مرکز ءِ گون 1 نقطہ ءَ چه گیشتر ءَ رئوکیں دائرہ ءِ شعاع ءِ حساب نہ بیت.

circle-change-radius-non-numerical = عددی قیمت نہ دارگیں نقطہ آں ءَ چه رئوکیں دائرہ ءِ شعاع نہ بدل بیت

circle-radius-with-points-non-numerical = عددی قیمت نیست؛ مقرر بوتگیں شعاع ءِ گون یک نقطہ ءَ چه گیشتر ءَ رئوکیں دائرہ نہ جوڑ بیت.

circle-change-center-non-numerical = عددی قیمت نہ دارگیں نقطہ آں ءَ چه رئوکیں دائرہ ءِ مرکز ءِ بدل کنگ ہنوں تانکہ نہ جوڑ بوتگ.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] فنکشن ءِ ڈومین ءِ ھانی بس نہ اَنت. ڈومین ءَ { $intervals } وقفہ ھست، بلے فنکشن ءَ { $inputs ->
           *[other] { $inputs } اِنپٹ
        } ھست.
    }

function-domain-invalid-format = فنکشن ءِ ڈومین ءِ فارمیٹ غلط اِنت.

function-ignoring-non-numerical =
    { $type ->
        [maximum] فنکشن ءِ غیر عددی maximum نظرانداز بیت.
        [minimum] فنکشن ءِ غیر عددی minimum نظرانداز بیت.
        [extremum] فنکشن ءِ غیر عددی extremum نظرانداز بیت.
        [point] فنکشن ءِ غیر عددی نقطہ نظرانداز بیت.
        [slope] فنکشن ءِ غیر عددی میلان نظرانداز بیت.
       *[other] فنکشن ءِ غیر عددی { $type } نظرانداز بیت.
    }

function-ignoring-empty =
    { $type ->
        [maximum] فنکشن ءِ خالی maximum نظرانداز بیت.
        [minimum] فنکشن ءِ خالی minimum نظرانداز بیت.
        [extremum] فنکشن ءِ خالی extremum نظرانداز بیت.
        [point] فنکشن ءِ خالی نقطہ نظرانداز بیت.
       *[other] فنکشن ءِ خالی { $type } نظرانداز بیت.
    }

function-points-too-close = فنکشن ءِ تہ ءَ دو نقطہ ھست کہ آیانی جاہ زیاتیں نزیک اَنت. فنکشن ءِ تعریف نہ بیت.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] فنکشن ءِ تکرار ھمے وھد ءَ ممکن اِنت کہ اِنپٹاں ءِ تعداد ءُ آؤٹپٹاں ءِ تعداد برابر ببنت. اے فنکشن ءَ { $inputs } اِنپٹ ءُ { $outputs ->
           *[other] { $outputs } آؤٹپٹ
        } ھست.
    }

## `<sequence>`

sequence-invalid-length = ترتیب ءِ درازی غلط اِنت.  باید کہ منفی نہ ایں صحیح عدد ے ببیت.

sequence-invalid-step = ترتیب ءِ گام غلط اِنت.  { $type } ٹائپ ءِ ترتیب ءِ واستہ باید کہ عدد ے ببیت.

sequence-invalid-endpoint-number = عددی ترتیب ءِ "{ $attribute }" غلط اِنت.  باید کہ عدد ے ببیت.

sequence-invalid-endpoint-letters = حرفی ترتیب ءِ "{ $attribute }" غلط اِنت.  باید کہ حرفاں ءِ ترکیب ے ببیت.

sequence-invalid-endpoint = ترتیب ءِ "{ $attribute }" غلط اِنت.

select-from-sequence-coprime-not-numbers = عدد گچین نہ بنت، اے واستہ coprime نظرانداز بیت

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations مقرر بوتگ، اے واستہ coprime نظرانداز بیت

## Resolving a `target`

target-not-found = `<{ $source }>` ءِ واستہ target غلط اِنت: target نہ کپت.

target-state-variable-not-found = `<{ $source }>` ءِ واستہ target غلط اِنت: `<{ $component }>` ءِ سرا "{ $property }" نامیں ھالی ویریئبل ے نہ کپت.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` ءِ ویریئبل باید کہ آزاتیں ویریئبل ءَ چه پرک ببنت.

ode-system-duplicate-variable-names = پدا آتکگیں بستگیں ویریئبل ءِ نام ءِ گون ODE RHS فنکشناں ءِ تعریف نہ بیت.

ode-system-rhs-function-error = ODE RHS فنکشن ءِ تعریف نہ بیت.  mathjs فنکشن ءِ جوڑ کنگ ءَ خطا.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } خطاں ءِ نیام ءَ زاویہ ءِ تعریف نہ بیت

angle-invalid-through-point = `<angle>` ءِ through ءَ غلطیں نقطہ

parabola-vertex-too-many-points = ورٹیکس ءِ گون 1 نقطہ ءَ چه گیشتر ءَ رئوکیں پیرابولا ہنوں تانکہ نہ جوڑ بوتگ.

parabola-too-many-points = 3 نقطہ آں ءَ چه گیشتر ءَ رئوکیں پیرابولا ہنوں تانکہ نہ جوڑ بوتگ.

intersection-too-many-items = دو چیزاں ءَ چه گیشتر ءِ واستہ برخورد ہنوں تانکہ نہ جوڑ بوتگ

## Other math components

ionic-compound-not-two-ions = دو آئیوناں ءَ چه دگہ ہچ چیز ءِ واستہ آئیونی ترکیب ہنوں تانکہ نہ جوڑ بوتگ.

ionic-compound-needs-cation-and-anion = آئیونی ترکیب ھما یک کیٹائون ءُ یک اینائون ءِ واستہ جوڑ بوتگ.

solve-equations-cannot-evaluate = مساوات ءِ حساب نہ بوت، اے واستہ حل نہ بوت: { $equation }

math-operators-operand-number-required = ریاضی ءِ آپرینڈ ے ءِ در کشگ ءِ وھد ءَ operandNumber باید کہ مقرر ببیت.

eigen-decomposition-failed = میٹرکس ءِ آئیگن قیمتاں ءِ حساب نہ بوت

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: پیرامیٹر { $parameters } پیٹرن ءِ تہ ءَ نیست، اے واستہ ھمیشہ خالی ے ءِ گون جوڑ کنت.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ءِ مطلب نہ زانگ بیت. باید کہ none، medium، dense یا دو مثبتیں عدد ببنت کہ یک خالی ءِ گون پرک بوتگ اَنت، ھمے رنگ grid="1 0.5". ہچ گرڈ ے نہ کشگ بیت.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` ءَ ھما فنکشن ے لوٹیت کہ { $expected ->
        [one] یک آؤٹپٹ بدنت، بزان ہر نقطہ ءَ y' میلان، ھمے رنگ `y - x`
       *[other] دو آؤٹپٹ بدنت، بزان ہر نقطہ ءَ ویکٹر، ھمے رنگ `(y, -x)`
    }، بلے دات بوتگیں فنکشن { $found ->
       *[other] { $found } آؤٹپٹ
    } دنت. { $alternative ->
        [none] ہچ چیزے نہ کشگ بیت.
       *[other] اے فنکشن ءِ واستہ کمپوننٹ `<{ $alternative }>` اِنت. ہچ چیزے نہ کشگ بیت.
    }

field-function-attribute-ignored-with-child = فنکشن کمپوننٹ ءِ تہ ءَ ہم دات بوتگ، اے واستہ `function` ایٹریبیوٹ نظرانداز بیت؛ تہ ایں فنکشن کارمرز بیت. فنکشن ءَ ھما یک رہ ءَ بدے.

field-variables-ignored =
    `<{ $component }>`: `variables` ایٹریبیوٹ ھما عبارت ءِ ویریئبلاں ءَ نام دنت کہ سیدا کمپوننٹ ءِ تہ ءَ نبشتہ بوتگ. { $reason ->
        [function-child] فنکشن اِدا `<function>` چک ءِ رنگ ءَ دات بوتگ، ءُ آ وت وتی ویریئبلاں ءَ نام دنت، اے واستہ `variables` نظرانداز بیت.
       *[no-expression] اِدا ھمے رنگ عبارت ے نیست، اے واستہ `variables` نظرانداز بیت.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure رینڈرر ءَ xLabelPosition="left" ءِ سہار نیست؛ راستی جاہ ءِ رنگ ءَ کار کنت.

prefigure-y-label-position-unsupported = `<graph>`: prefigure رینڈرر ءَ yLabelPosition="bottom" ءِ سہار نیست؛ برزی جاہ ءِ رنگ ءَ کار کنت.

prefigure-invalid-axis-bounds = `<graph>`: prefigure ءِ بدل کنگ ءِ واستہ محور ءِ حد غلط اَنت؛ پیشداریں bbox (-10,-10,10,10) کارمرز بیت.

prefigure-invalid-width = `<graph>`: prefigure ءِ بدل کنگ ءِ واستہ پہنائی غلط اِنت؛ پیشداریں پہنائی 425 کارمرز بیت.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ءِ بدل کنگ ءِ واستہ aspectRatio غلط اِنت؛ پیشداریں نسبت 1 کارمرز بیت.

prefigure-grid-spacing-too-fine = `<graph>`: محور ءِ حداں ءِ واستہ گرڈ ءِ فاصلہ زیاتیں تنگ اِنت؛ prefigure رینڈرر ءَ گرڈ نہ کشگ بیت.

prefigure-annotations-not-rendered = `<graph>`: وھدے کہ PreFigure رینڈرر کار نہ کنت، annotation نہ کشگ بنت.

multiple-annotations-children = `<graph>` ءِ تہ ءَ چند `<annotations>` چک کپتنت؛ آخری ءَ چه دگہ درست نظرانداز بنت.

## Referring to other components

copy-unrecognized-component-type = نہ زانتگیں کمپوننٹ ءِ ٹائپ ءِ دراج کنگ یا کاپی کنگ نہ بیت: { $type }.

copy-prop-not-found = { $component } ٹائپ ءِ کمپوننٹ ءِ سرا { $property } prop نہ کپت

collect-no-source = collect ءِ واستہ ہچ سرچمگ ے نہ کپت.

collect-invalid-component-type = `<{ $component }>` ٹائپ ءِ کمپوننٹاں ءِ گِرگ نہ بیت، پرچا کہ اے ٹائپ غلط اِنت.

reference-index-unavailable = `{ $reference }` انڈیکس ءَ ریفرنس دیگ نہ بیت

## `<callAction>`

component-action-unavailable = `{ $reference }` کمپوننٹ ءِ سرا { $action } ءِ گوانک دیگ نہ بیت

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ڈیٹا ءِ شکل غلط اِنت.  رجاں ءِ درازی جوڑ نہ کنت. componentIdx ءَ کپت :{ $componentIdx }

data-frame-duplicate-column-names = ڈیٹا ءِ تہ ءَ ستوناں ءِ نام پدا آتکگ اَنت.  componentIdx ءَ کپت :{ $componentIdx }

data-frame-missing-column-name = ڈیٹا ءَ یک ستون ءِ نام کم اِنت.  componentIdx ءَ کپت :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = اے جواب ءِ award وتی روان بوتگیں جواب ءِ سرا بستگ اِنت، ءُ اے چیز نہ چاراں تہ ایں کار ءَ برت.

answer-max-num-attempts-in-section-wide-check-work = sectionWideCheckWork دارگیں کنٹینر ءِ تہ ءَ `<answer>` ءِ سرا `maxNumAttempts` مقرر کنگ ہچ اثر ے نہ کنت، پرچا کہ کوشستاں ءِ تعداد کنٹینر چه کنٹرول بیت. `maxNumAttempts` ءَ کنٹینر ءِ سرا مقرر کن.

nested-section-wide-check-work-max-num-attempts = ھما sectionWideCheckWork دارگیں کنٹینر ے کہ دگہ sectionWideCheckWork دارگیں کنٹینر ے ءِ تہ ءَ اِنت، آ ءِ سرا `maxNumAttempts` مقرر کنگ ہچ اثر ے نہ کنت، پرچا کہ کوشستاں ءِ تعداد در ایں کنٹینر چه کنٹرول بیت. `maxNumAttempts` ءَ در ایں کنٹینر ءِ سرا مقرر کن.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] بے symbolicEquality ءَ { $attributes } ایٹریبیوٹ ہچ اثر ے نہ کنت.
    }

answer-invalid-type = جواب ءِ واستہ ٹائپ غلط اِنت: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` کمپوننٹ ءَ نام ے نیست، اے واستہ module ءِ ایٹریبیوٹ ءِ واستہ کارمرز نہ بیت

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` کمپوننٹ module ءِ ایٹریبیوٹ ءِ رنگ ءَ کارمرز نہ بیت، پرچا کہ `<module>` کمپوننٹ ءِ ٹائپ ءَ "{ $name }" ایٹریبیوٹ پیسر چه تعریف بوتگ.

conditional-content-condition-ignored = case یا else چکاں دارگیں `<conditionalContent>` کمپوننٹ ءِ سرا `condition` ایٹریبیوٹ نظرانداز بیت.

slider-markers-type-mismatch = مارکراں ءِ ٹائپ ءُ slider ءِ ٹائپ جوڑ نہ کنت.

pretzel-problem-needs-statement-and-answer = pretzel غلط اِنت: ہر `<problem>` باید کہ یک `<statement>` ءُ یک `<answer>` دارت.

pretzel-circuit-first-problem-distractor = pretzel غلط اِنت: mode="circuit" ءَ اولی `<problem>` نہ بیت کہ distractor ببیت.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] `{ $attribute }` ایٹریبیوٹ ءِ واستہ غلطیں قیمت { $values }؛ نظرانداز بیت.
    }

attribute-must-be-references = `{ $attribute }` ایٹریبیوٹ ءِ واستہ قیمت `{ $value }` غلط اِنت. ایٹریبیوٹ باید کہ ھما ریفرنساں چه جوڑ ببیت کہ `$` ءِ گون سرا بنت.

math-input-invalid-function-names = <mathInput>: { $attribute } ءِ تہ ءَ غلطیں فنکشن ءِ نام نظرانداز بوتنت: { $names }. ہر نام ءِ نشان دیگ ءِ بہر باید کہ کمترین 2 حرف ببیت (حرف یا ڈیش)؛ آ ءِ ءَ رند یک `|<mathspeak alternative>` ھم آتک کنت.

## Building components from the source

component-type-invalid = کمپوننٹ ءِ ٹائپ غلط اِنت: `<{ $componentType }>`

attribute-repeated = { $attribute } ایٹریبیوٹ پدا نہ آتک کنت.

attribute-invalid-for-component = `<{ $componentType }>` ٹائپ ءِ کمپوننٹ ءِ واستہ "{ $attribute }" ایٹریبیوٹ غلط اِنت.

## Style definition contrast

style-definition-insufficient-contrast =
    سٹائل ءِ تعریف { $styleNumber } ءَ { $context ->
        [text-on-background] پشت زمین ءِ خلاف متن ءِ رنگ
        [high-contrast] کینوس ءِ خلاف برزیں کنٹراسٹ ءِ رنگ
        [line] کینوس ءِ خلاف خط ءِ رنگ
        [marker] کینوس ءِ خلاف مارکر ءِ رنگ
       *[text-on-canvas] کینوس ءِ خلاف متن ءِ رنگ
    } ءِ واستہ بس ایں کنٹراسٹ ے نیست{ $mode ->
        [dark] { " (تاہاریں موڈ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کمترین { $threshold }:1 لوٹیت).

style-definition-dark-mode-text-background-contrast =
    سٹائل ءِ تعریف { $styleNumber } ءِ مقرر بوتگیں رنگ روشنیں موڈ ءِ واستہ بس ایں کنٹراسٹ دنت، بلے آیاں چه در آتکگیں تاہاریں موڈ ءِ رنگاں ءَ پشت زمین ءِ خلاف متن ءِ رنگ ءِ کنٹراسٹ بس نہ اِنت ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کمترین { $threshold }:1 لوٹیت). { $suggestion ->
        [available] تانکہ تاہاریں موڈ ءَ کنٹراسٹ بس ببیت، یا روشنیں موڈ ءِ کنٹراسٹ ءَ گیش کن (مثال ءِ رنگ ءَ { $lightAttribute }="{ $lightColor }" مقرر کن) یا تاہاریں موڈ ءِ رنگ ءَ بدل کن (مثال ءِ رنگ ءَ { $darkAttribute }="{ $darkColor }" مقرر کن).
       *[none] تانکہ تاہاریں موڈ ءَ کنٹراسٹ بس ببیت، روشنیں موڈ ءِ کنٹراسٹ ءَ گیش کن یا در آتکگیں رنگاں ءَ textColorDarkMode ءُ/یا backgroundColorDarkMode ءِ گون بدل کن.
    }

style-definition-dark-mode-text-canvas-contrast =
    سٹائل ءِ تعریف { $styleNumber } ءِ مقرر بوتگیں متن ءِ رنگ روشنیں موڈ ءِ واستہ بس ایں کنٹراسٹ دنت، بلے آ ءَ چه در آتکگیں تاہاریں موڈ ءِ متن ءِ رنگ کینوس ءِ خلاف بس ایں کنٹراسٹ ے نہ دنت ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کمترین { $threshold }:1 لوٹیت). { $suggestion ->
        [available] تانکہ تاہاریں موڈ ءَ کنٹراسٹ بس ببیت، یا روشنیں موڈ ءِ کنٹراسٹ ءَ گیش کن (مثال ءِ رنگ ءَ textColor="{ $lightColor }" مقرر کن) یا تاہاریں موڈ ءِ رنگ ءَ بدل کن (textColorDarkMode="{ $darkColor }" مقرر کن).
       *[none] تانکہ تاہاریں موڈ ءَ کنٹراسٹ بس ببیت، روشنیں موڈ ءِ کنٹراسٹ ءَ گیش کن یا در آتکگیں رنگ ءَ textColorDarkMode ءِ گون بدل کن.
    }

section-multiple-style-palettes = یک بہر ھما یک <stylePalette> ے گچین کنت؛ آخری کارمرز بیت.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } ءِ خاصیں ورینٹ معلوم نہ بنت، پرچا کہ numToSelect منفی نہ ایں صحیح عدد ے نہ اِنت.

variant-num-to-select-not-constant-number = { $component } ءِ خاصیں ورینٹ معلوم نہ بنت، پرچا کہ numToSelect ثابتیں عدد ے نہ اِنت.

variant-with-replacement-not-constant-boolean = { $component } ءِ خاصیں ورینٹ معلوم نہ بنت، پرچا کہ withReplacement ثابتیں boolean ے نہ اِنت.

variant-select-weight-disables-unique = اگاں آپشن ے selectWeight یا selectForVariants دارت، select ءِ واستہ خاصیں ورینٹ بند بنت

variant-coprime-undetermined = { $component } ءِ خاصیں ورینٹ معلوم نہ بنت، پرچا کہ معلوم نہ بیت کہ coprime ھمیشہ دروگ اِنت.

variant-attribute-not-constant = { $component } ءِ خاصیں ورینٹ معلوم نہ بنت، پرچا کہ { $attribute } ثابت نہ اِنت.

variant-attribute-not-number = { $component } ءِ خاصیں ورینٹ معلوم نہ بنت، پرچا کہ { $attribute } عدد ے نہ اِنت.

variant-attribute-wrong-type-for-sequence =
    { $type } ٹائپ ءِ { $component } ءِ خاصیں ورینٹ معلوم نہ بنت، پرچا کہ { $attribute } { $expected ->
        [letters-combination] حرفاں ءِ ترکیب ے
        [math-expression] درستیں ریاضی ءِ عبارت ے
        [integer] صحیح عدد ے
       *[number] عدد ے
    } نہ اِنت.

variant-length-not-integer = { $component } ءِ خاصیں ورینٹ معلوم نہ بنت، پرچا کہ length صحیح عدد ے نہ اِنت.

variant-sort-not-implemented = sort دارگیں { $component } ءِ خاصیں ورینٹ ہنوں تانکہ نہ جوڑ بوتگ

variant-exclude-combinations-not-implemented = excludeCombinations دارگیں { $component } ءِ خاصیں ورینٹ ہنوں تانکہ نہ جوڑ بوتگ

variant-math-exclude-not-implemented = exclude دارگیں math ٹائپ ءِ { $component } ءِ خاصیں ورینٹ ہنوں تانکہ نہ جوڑ بوتگ

variant-non-constant-exclude-not-implemented = نہ ثابت ایں exclude دارگیں { $component } ءِ خاصیں ورینٹ ہنوں تانکہ نہ جوڑ بوتگ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: گراف ءِ prefigure رینڈرر ءَ اے ءِ سہار نیست؛ نسل ءَ ھشتگ بوت.

prefigure-descendant-invalid-geometry = { $subject }: جیومیٹری پورہ یا محدود نہ اِنت؛ نسل ءَ ھشتگ بوت.

prefigure-curve-label-omitted = { $subject }: بدل بوتگیں خم ءِ عنصراں ءِ سرا label ءِ سہار نیست؛ label ءَ ھشتگ بوت.

prefigure-curve-unsupported-definition-type = { $subject }: خم ءِ فنکشن ءِ تعریف ءِ ٹائپ '{ $definitionType }' ءِ سہار نیست؛ نسل ءَ ھشتگ بوت.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves ءِ سرا flipFunctions ایٹریبیوٹ ءِ سہار نیست؛ نسل ءَ ھشتگ بوت.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves ءِ سرا ھما formula ٹائپ ءِ چک ایں فنکشناں ءِ سہار ھست؛ نسل ءَ ھشتگ بوت.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] خط ءِ رِند ءِ label
       *[point] نقطہ ءِ label
    } ءِ واستہ labelPosition '{ $labelPosition }' ءِ سہار نیست؛ PreFigure ءِ پیشداریں ہمترازی کارمرز بوت.

prefigure-fill-style-unsupported = { $subject }: PreFigure ءَ پُر کنگ ءِ سٹائل '{ $fillStyle }' ءِ سہار نیست؛ سادہ ایں پُر کنگ کارمرز بیت.

prefigure-line-style-unknown = { $subject }: نہ زانتگیں خط ءِ سٹائل '{ $lineStyle }' PreFigure ءِ آؤٹپٹ ءَ چه ھشتگ بوت.

prefigure-marker-style-mapped-to-diamond = { $subject }: مارکر ءِ سٹائل '{ $markerStyle }' PreFigure ءِ 'diamond' سٹائل ءَ بدل بوت.

prefigure-marker-style-unsupported = { $subject }: PreFigure ءَ مارکر ءِ سٹائل '{ $markerStyle }' ءِ سہار نیست؛ پیشداریں سٹائل کارمرز بوت.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` غلط اِنت؛ ہدف معلوم نہ بوت. annotation ھشتگ بوت.

annotation-ref-multiple-targets = `<annotation>`: `ref` چند ہدفاں ءَ نشان دات؛ اولی ہدف کارمرز بیت.

annotation-ref-outside-graph = `<annotation>`: `ref` غلط اِنت؛ ہدف گراف ءَ چه در اِنت. annotation ھشتگ بوت.

annotation-ref-unsupported-target = `<annotation>`: `ref` غلط اِنت؛ prefigure ءِ بدل کنگ ءَ ہدف سہار بوتگیں گرافیکی چیز ے نہ اِنت. annotation ھشتگ بوت.

annotation-text-missing = `<annotation>`: `text` کم یا خالی اِنت؛ خالی ایں متن در دیگ بیت.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] گِرد ایں بستگی کپت.
       *[other] `<{ $componentType }>` کمپوننٹ ءِ گون گِرد ایں بستگی کپت.
    }

reference-no-referent = `{ $reference }` ریفرنس ءِ واستہ ہچ مرجع ے نہ کپت

reference-multiple-referents = `{ $reference }` ریفرنس ءِ واستہ چند مرجع کپتنت

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` ءِ { $attribute } ایٹریبیوٹ ءِ فارمیٹ غلط اِنت.

children-invalid = `<{ $componentType }>` ءِ واستہ غلطیں چک: غلطیں چک کپتنت: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` ایٹریبیوٹ ءِ واستہ قیمت `{ $value }` غلط اِنت، `{ $default }` قیمت کارمرز بیت

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML ءِ ورژن { $version } نہ کپت.
       *[other] DoenetML ءِ ورژن { $version } نہ کپت. ورژن { $fallback } کارمرز بیت
    }

## Reading the DoenetML

parse-invalid-doenetml = غلطیں DoenetML: { $content }

parse-tag-missing-close-tag = غلطیں DoenetML: `{ $tag }` ٹیگ ءِ بندیں ٹیگ نیست. یا وت بند بوکیں ٹیگ ے یا `</{ $tagName }>` ٹیگ ے لوٹیت.

parse-tag-error = غلطیں DoenetML: `<{ $tagName }>` ٹیگ ءَ خطا

parse-attribute-missing-value = غلطیں DoenetML: غلطیں ایٹریبیوٹ `{ $attribute }` ءَ چار کنت کہ قیمت ے کم اِنت.

parse-attribute-invalid = غلطیں DoenetML: غلطیں ایٹریبیوٹ `{ $attribute }`

parse-attribute-value-invalid = غلطیں DoenetML: غلطیں ایٹریبیوٹ ءِ قیمت `{ $value }`

parse-attribute-value-quote-mismatch = غلطیں DoenetML: غلطیں ایٹریبیوٹ ءِ قیمت `{ $value }`. کوٹیشن ءِ نشان جوڑ نہ کنت. چار کنت کہ یک `{ $quote }` کم اِنت

parse-open-tag-name-missing = غلطیں DoenetML: بے نام ایں ٹیگ ے کپت، مثال ءِ رنگ ءَ `<`

parse-tag-not-closed = غلطیں DoenetML: `{ $tag }` ٹیگ بند نہ بوت (چار کنت کہ یک `>` کم اِنت).

parse-self-closing-tag-name-missing = غلطیں DoenetML: بے نام ایں ٹیگ ے کپت `<{ $content }>`

parse-self-closing-tag-not-closed = غلطیں DoenetML: `{ $tag }` ٹیگ بند نہ بوت (چار کنت کہ `/>` کم اِنت).

parse-tag-invalid-attributes = غلطیں DoenetML: `{ $tag }` ٹیگ درست نہ اِنت. چار کنت کہ آ ءِ ایٹریبیوٹ غلط اَنت.

parse-close-tag-name-missing = غلطیں DoenetML: بے نام ایں بندیں ٹیگ ے کپت، مثال ءِ رنگ ءَ `</`

parse-attribute-value-unquoted = ایٹریبیوٹ ءِ قیمت باید کہ کوٹیشن ءِ تہ ءَ ببیت: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = غلطیں DoenetML: بندیں ٹیگ `{ $tag }` کپت، بلے آ ءِ پچ ایں ٹیگ نیست

parse-close-tag-mismatched = غلطیں DoenetML: بندیں ٹیگ جوڑ نہ کنت. `</{ $expected }>` لوٹگ بوت. `{ $found }` کپت

parser-node-unconvertible = { $node } نوڈ Dast نوڈ ءَ بدل نہ بوت.

## Names

name-attribute-invalid =
    غلطیں ایٹریبیوٹ name='{ $name }'. { $reason ->
        [characters] نام ھما حرف، عدد، چیری لکیر یا ڈیش دارت کنت.
       *[start] نام باید کہ حرف ے چه سرا ببنت.
    }

component-name-invalid-start = غلطیں کمپوننٹ ءِ نام "{ $name }". نام باید کہ حرف ے چه سرا ببنت.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched ٹائپ ءِ جواب باید کہ video ایٹریبیوٹ ے دارت

answer-video-watched-video-not-reference = videoWatched ٹائپ ءِ جواب ءِ video ایٹریبیوٹ باید کہ ریفرنس ے ببیت

answer-name-not-single-text = جواب ءِ name ایٹریبیوٹ باید کہ ھما یک text چک ے دارت

## Referencing another document

external-doenetml-recursion-limit = زیاتیں تہ بہ تہ سطحاں ءِ سبب ءَ در ایں DoenetML نہ گرگ بوت. گِرد ایں ریفرنس ے ھست؟

external-doenetml-unavailable = { $attribute }="{ $uri }" ءَ چه DoenetML نہ گرگ بوت

external-doenetml-type-mismatch = { $attribute }="{ $uri }" ءَ چه گرگ بوتگیں DoenetML غلط اِنت: آ "{ $componentType }" کمپوننٹ ءِ ٹائپ ءِ گون جوڑ نہ کرت

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` ایٹریبیوٹ کہنگ بوتگ؛ آ ءِ جاہ ءَ `{ $to }` کارمرز کن.
       *[other] [deprecation] `<{ $component }>` ءِ سرا `{ $from }` ایٹریبیوٹ کہنگ بوتگ؛ آ ءِ جاہ ءَ `{ $to }` کارمرز کن.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` ایٹریبیوٹ کہنگ بوتگ ءُ نظرانداز بیت، پرچا کہ `{ $to }` ہم مقرر بوتگ.
       *[other] [deprecation] `<{ $component }>` ءِ سرا `{ $from }` ایٹریبیوٹ کہنگ بوتگ ءُ نظرانداز بیت، پرچا کہ `{ $to }` ہم مقرر بوتگ.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` ءِ سرا `{ $attribute }` ایٹریبیوٹ کہنگ بوتگ ءُ نظرانداز بیت.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` ءِ سرا `{ $attribute }` ایٹریبیوٹ کہنگ بوتگ؛ آ ءِ جاہ ءَ `<{ $child }>` چک ے کارمرز کن.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` ءِ سرا `{ $attribute }` ایٹریبیوٹ ءِ قیمت `{ $value }` کہنگ بوتگ؛ آ ءِ جاہ ءَ `{ $to }` کارمرز کن.


## Language coverage

pluralize-english-only = `<pluralize>` ھما انگریزی ءَ جمع کنت کنت، اے واستہ { $locale } ءَ نبشتہ بوتگیں دستاویز ءَ آ ءِ متن ھمے رنگ ءَ مانیت. جمع ءِ شکل ءَ سیدا بنبیس، یا `pluralForm` ایٹریبیوٹ ءِ گون مقرر کن.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` عنصر Doenet ءِ زانتگیں عنصر ے نہ اِنت.

schema-element-not-allowed-at-root = `<{ $tag }>` عنصر دستاویز ءِ ریشہ ءَ اجازت نہ دارت.

schema-element-not-allowed-inside = `<{ $tag }>` عنصر `<{ $parent }>` ءِ تہ ءَ اجازت نہ دارت.

schema-attribute-unrecognized = `<{ $tag }>` عنصر ءَ `{ $attribute }` نامیں ایٹریبیوٹ ے نیست.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` عنصر ءِ `{ $attribute }` ایٹریبیوٹ باید کہ ھما لسٹ ے ببیت کہ ہر درجہ ءِ آ ءِ ھمے چیزاں ءَ چه یکے ببیت: { $allowed }
       *[other] `<{ $tag }>` عنصر ءِ `{ $attribute }` ایٹریبیوٹ باید کہ ھمے چیزاں ءَ چه یکے ببیت: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select ءِ واستہ ورینٹ ءِ نام غلط اِنت.  ورینٹ ءِ نام { $variantName } { $numOptions } آپشناں ءَ آتک، بلے گچین کنگ ءِ تعداد { $numToSelect } اِنت.

select-variant-name-without-options = select ءِ واستہ چند ورینٹ مقرر بوتگ اَنت، بلے ممکنیں ورینٹ ءِ نام { $variantName } ءِ واستہ ہچ آپشن ے مقرر نہ بوتگ.

select-variant-name-not-possible = select ءِ واستہ مقرر بوتگیں ورینٹ ءِ نام { $variantName } ممکنیں نام ے نہ اِنت.

select-too-few-options = ھما { $numOptions } ءَ چه { $numToSelect } کمپوننٹ گچین نہ بنت.

select-from-sequence-too-few-values = { $length } درازی ءِ ترتیب ے ءَ چه { $numToSelect } قیمت گچین نہ بنت.

select-from-sequence-indices-count-mismatch = select ءِ واستہ مقرر بوتگیں انڈیکساں ءِ تعداد باید کہ گچین کنگ ءِ تعداد ءِ گون جوڑ ببیت

select-from-sequence-indices-not-integers = select ءِ واستہ مقرر بوتگیں درست ایں انڈیکس باید کہ صحیح عدد ببنت

select-from-sequence-index-excluded = selectfromsequence ءِ مقرر بوتگیں انڈیکس در ھشتگ بوتگ

select-from-sequence-indices-excluded-combination = selectfromsequence ءِ مقرر بوتگیں انڈیکس در ھشتگ بوتگیں ترکیب ے ات

select-from-sequence-coprime-not-positive-integers = مثبتیں صحیح عدد گچین نہ بنت، اے واستہ coprime ترکیب گچین نہ بنت.

select-from-sequence-coprime-common-factor = coprime عدد گچین نہ بنت. درست ایں ممکنیں قیمت یک ھمگیں فیکٹر ے دارنت. (مقرر بوتگیں "from" یا "to" ءِ قیمت باید کہ "step" ءِ گون coprime ببنت.)

select-from-sequence-coprime-single-number = ھما یک عدد ے ءَ چه کہ 1 نہ اِنت، coprime ترکیب گچین نہ بنت.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ءَ ترکیباں ءَ چه %70 ءَ چه گیشتر در ھشتگ بوتگ

select-from-sequence-coprime-none-found = coprime عدد گچین نہ بوتنت. درست ایں ممکنیں قیمت یک ھمگیں فیکٹر ے دارنت.

select-from-sequence-too-few-unique-values = { $numPossibleValues } درازی ءِ ترتیب ے ءَ چه { $numToSelect } خاصیں قیمت گچین نہ بنت

select-prime-numbers-too-few-values = { $numValues } درازی ءِ اولیں عدداں ءِ لسٹ ے ءَ چه { $numToSelect } قیمت گچین نہ بنت

select-prime-numbers-values-count-mismatch = select ءِ واستہ مقرر بوتگیں قیمتاں ءِ تعداد باید کہ گچین کنگ ءِ تعداد ءِ گون جوڑ ببیت

select-prime-numbers-values-not-prime = اولیں عدد ءِ گچین کنگ ءِ واستہ مقرر بوتگیں قیمت باید کہ اولیں عدداں ءِ لسٹ ءِ تہ ءَ ببنت

select-prime-numbers-values-excluded-combination = selectPrimeNumbers ءِ مقرر بوتگیں قیمت در ھشتگ بوتگیں ترکیب ے ات

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ءَ ترکیباں ءَ چه %70 ءَ چه گیشتر در ھشتگ بوتگ

select-random-combination-fluke = زیاتیں کم ایں اتفاق ے ءِ سبب ءَ، اتفاقی قیمتاں ءِ ترکیب گچین نہ بوت

select-random-value-fluke = زیاتیں کم ایں اتفاق ے ءِ سبب ءَ، اتفاقی قیمت ے گچین نہ بوت

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` ریاضی ءِ تہ ءَ نہ کشگ بیت؛ عبارت ھمے رنگ ءَ چاپ بیت کہ اِنپٹاں ءِ تہ ءَ اِشتگ چه پیسر ات. { $reason ->
        [not-inline] عبارت ے ءِ تہ ءَ ھما `inline` گچین ءِ اِنپٹ کپیت؛ بے `inline` ءَ آ بٹناں ءِ بلاک ے اِنت.
        [expanded] `expanded` متن ءِ اِنپٹ چند لینکی ایں دبہ ے اِنت، ءُ عبارت ءِ تہ ءَ نشتگ ءِ واستہ زیاتیں مزن اِنت.
        [on-graph] گراف ءِ سرا عبارت یک تصویر ءِ رنگ ءَ کشگ بیت، ءُ آ ءِ تہ ءَ کنٹرول ے ءِ واستہ جاہ نیست.
       *[relative-width] آ ءِ `width` نسبتی اِنت (فیصد ے یا `em`)، ءُ عبارت ءِ تہ ءَ آ ءِ پیمائش ءِ واستہ ہچ چیزے نیست. پہنائی ءَ مطلق واحداں ءَ، ھمے رنگ `px`، بدے.
    }
