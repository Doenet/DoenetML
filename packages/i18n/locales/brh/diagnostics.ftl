# Brahui (براہوئی) diagnostics: the errors and warnings the core and the
# language server put in front of whoever is looking at the screen. Translated
# from `locales/en/diagnostics.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Perso-Arabic on the Urdu letter inventory as Brahui is printed in Quetta,
# right to left, case clitics written as separate words — the same convention
# the other three files of this locale state. Digits are Latin.
#
# **Element names, attribute names and values are not words.** `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `math`, `text`, `boolean`,
# `coprime`, `selectFromSequence` and every `<tag>` written into these
# sentences are DoenetML identifiers and stay in English exactly as they are.
# The backticks and angle brackets around them are this catalog's punctuation.
#
# **No message here selects on a count.** CLDR has no plural data for `brh`, so
# a category branch would be one nothing could select and `lint:i18n` would
# reject; and a Brahui noun after a numeral stays unmarked in any case. Each
# such message is written once as `*[other]`, with the count kept in the
# selector so that nothing is lost from the message's shape. The `[1]` in
# `field-function-wrong-num-outputs` is a numeric literal rather than a
# category — Fluent matches it against the number itself — so it stays where
# English has it. The symbolic selectors — `$reason`, `$type`, `$mode`,
# `$suggestion`, `$isList`, `$context`, `$expected` and the rest — keep every
# branch English has, because those keys are compared letter for letter and a
# renamed one is a branch nothing can reach.
#
# **A small set of frames, chosen once and used throughout**, so that a
# correction is one search and so that a speaker can fix the grammar of a
# hundred sentences by fixing five:
#
#   «… نظرانداز اے»    is ignored
#   «… مقرر اے»        is specified
#   «… غلط اے»         is invalid
#   «… موجود اف»       is not there / was not found
#   «… ممکن اف»        cannot be done
#   «… لازم اے»        must (behind a verbal noun in ‑نگ)
#   «چونکہ …»          because
#
# The copula «اے» and its negative «اف» are Brahui; most of the words between
# them are Balochi or Urdu loans — `ریفرنس`, `میٹرکس`, `ٹائپ`, `فنکشن`,
# `ویکٹر`, `انڈیکس`, `ورینٹ`, `کمپوننٹ`, `ایٹریبیوٹ` — kept rather than coined,
# because Brahui has no computing register of its own and this file says so
# rather than inventing one.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] وخت کہ ایرا endpoint مقرر اے، { $attributes } نظرانداز اے
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] وخت کہ اسٹ endpoint او اسٹ midpoint دونی مقرر اے، { $attributes } نظرانداز اے
    }

line-segment-midpoint-offset-without-midpoint = midpoint نا بغیر midpointOffset نا ہچ اثر اف

## `<line>`

line-points-undetermined-dimensions = خط دا نقطہ آن گڑیک کہ نا ابعاد نامعلوم اے۔

line-points-too-few-dimensions = خط نا دا نقطہ آن گڑنگ لازم اے کہ کمترین ایرا ابعاد دارے۔

line-points-depend-on-variables = خط دا نقطہ آن گڑیک کہ دا متغیر ٹی بستہ اے: { $variables }۔

line-equation-invalid-format = متغیر { $variable1 } او { $variable2 } ٹی خط نا مساوات نا فارمیٹ غلط اے۔

## `<ray>`

ray-overprescribed-through = شعاع through، endpoint او direction آن مقرر اے۔  مقرر through نظرانداز اے۔

ray-dimension-mismatch = شعاع ٹی numDimensions جوڑ اف۔

## `<vector>`

vector-overprescribed-head = ویکٹر head، tail او displacement آن مقرر اے۔  مقرر head نظرانداز اے۔

vector-dimension-mismatch = ویکٹر ٹی numDimensions جوڑ اف۔

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` کے کشنگ ممکن اف، چونکہ نا nearestPoint حالتی متغیر موجود اف۔

constrain-to-without-nearest-point = `<{ $component }>` کے بندنگ ممکن اف، چونکہ نا nearestPoint حالتی متغیر موجود اف۔

constrain-to-interior-without-nearest-point = `<{ $component }>` نا اندرونی بہر کے بندنگ ممکن اف، چونکہ نا nearestPoint حالتی متغیر موجود اف۔

## `<choiceInput>`

choice-input-label-position-ignored = دا choiceInput کے کہ inline اف، labelPosition نظرانداز اے

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput کے مقرر انڈیکس نظرانداز اے، چونکہ انڈیکس نا تعداد او choice نا چک نا تعداد جوڑ اف۔

pretzel-indices-count-mismatch = problem کے مقرر انڈیکس نظرانداز اے، چونکہ انڈیکس نا تعداد او problem نا چک نا تعداد جوڑ اف۔

shuffle-indices-count-mismatch = shuffle کے مقرر انڈیکس نظرانداز اے، چونکہ انڈیکس نا تعداد او کمپوننٹ نا تعداد جوڑ اف۔

indices-ignored-out-of-range = { $component } کے مقرر انڈیکس نظرانداز اے، چونکہ چند انڈیکس حد آن در اے۔

pretzel-indices-repeated = pretzel کے مقرر انڈیکس نظرانداز اے، چونکہ چند انڈیکس پدا آسا اے۔

pretzel-circuit-first-index = circuit موڈ ٹی pretzel کے مقرر انڈیکس نظرانداز اے، چونکہ اولی انڈیکس نا 1 مانگ لازم اے۔

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` نا string چک تون کار کننگ کے `type` ایٹریبیوٹ نا مقرر مانگ لازم اے۔

invalid-type-defaulting-to-math = { $component } کمپوننٹ کے ٹائپ { $type } غلط اے۔ نا math، text، number یا boolean مانگ لازم اے۔ پیشدار math کار ٹی گڑیک۔

string-not-valid-component-to-arrange = String "{ $value }" { $component } کے راست کمپوننٹ اف۔ نظرانداز اے۔

## Types and variables

invalid-type-defaulting-to-number = ٹائپ { $type } غلط اے، ٹائپ number مقرر اے۔

invalid-variable-value = متغیر نا قیمت غلط اے: `{ $value }`

## Variants

variant-index-must-be-number = ورینٹ نا انڈیکس { $index } نا عدد مانگ لازم اے

variant-index-must-be-integer = ورینٹ نا انڈیکس { $index } نا صحیح عدد مانگ لازم اے

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` مطلق پیمائش کے جوڑ اف۔ پہنائی نسبتی مقرر اے۔

side-by-side-absolute-margins = `<{ $component }>` مطلق پیمائش کے جوڑ اف۔ حاشیہ نسبتی مقرر اے۔

side-by-side-no-block-child = `<{ $component }>` غلط اے: نا کمترین اسٹ بلاک چک دارنگ لازم اے۔

## `<label>`

label-for-ignored-on-graphical = گرافیکی `<label>` ٹی `for` ایٹریبیوٹ نظرانداز اے۔

label-for-must-resolve-to-one = `<label>` نا `for` ایٹریبیوٹ نا ٹھیک اسٹ کمپوننٹ کے نشان دیہنگ لازم اے۔

label-for-unresolved = `<label>` نا `for` ایٹریبیوٹ ہچ کمپوننٹ کے نشان دیرا اف۔

label-for-answer-with-authored-inputs = `<label>` نا `for` ایٹریبیوٹ دا `<answer>` کے نشان دیک کہ نا ان پٹ نبیسوک آن نبشتہ اے؛ سیدا ان پٹ کے ریفرنس دیہنگ۔

label-for-answer-without-input = `<label>` نا `for` ایٹریبیوٹ دا `<answer>` کے نشان دیک کہ نا نام دیہنگ کے ان پٹ موجود اف۔

label-for-must-reference-input-or-answer = `<label>` نا `for` ایٹریبیوٹ نا یا ان پٹ کے یا answer کے ریفرنس دیہنگ لازم اے۔

## Accessibility

accessibility-short-description-or-decorative = رسائی کے `<{ $component }>` نا یا کوتاہ تفصیل دارنگ یا decorative مقرر مانگ لازم اے۔

accessibility-video-short-description = رسائی کے `<video>` نا کوتاہ تفصیل دارنگ لازم اے۔

accessibility-input-short-description-or-label = رسائی کے `<{ $component }>` نا کوتاہ تفصیل یا label دارنگ لازم اے۔

accessibility-answer-input-short-description-or-label = رسائی کے دا `<answer>` نا، کہ اسٹ ان پٹ جوڑ کیک، کوتاہ تفصیل یا label دارنگ لازم اے۔

accessibility-short-description-contains-math = کوتاہ تفصیل ٹی `<{ $component }>` رنگ ریاضی نا کمپوننٹ نا مانگ لازم اف۔ ریاضی نا لفظ تون نبشتہ کننگ۔

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } بہر نا سرگپت نا متن کے بس کنٹراسٹ دیرا اف (تاہار موڈ) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کمترین { $threshold }:1 لوٹینگ)۔
       *[other] { $colorName } بہر نا سرگپت نا متن کے بس کنٹراسٹ دیرا اف ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کمترین { $threshold }:1 لوٹینگ)۔
    }

## `<circle>`

circle-through-points-non-numerical = وخت کہ نقطہ نا عددی قیمت موجود اف، { $count } نقطہ آن گڑوک `<circle>` ہنو تانکہ جوڑ اف۔

circle-too-many-through-points = 3 آن گیشتر نقطہ آن گڑوک دائرہ نا حساب ممکن اف۔

circle-overprescribed-radius-center-points = مقرر شعاع، مرکز او نقطہ تون دائرہ نا حساب ممکن اف۔

circle-center-with-multiple-points = مقرر مرکز تون 1 آن گیشتر نقطہ آن گڑوک دائرہ نا حساب ممکن اف۔

circle-radius-too-small = دائرہ نا حساب ممکن اف: ایرا نقطہ نا نیام نا دوری { $distance } اے، دا کے مقرر شعاع { $radius } کمتر اے۔

circle-radius-with-many-points = مقرر شعاع تون ایرا آن گیشتر نقطہ آن گڑوک دائرہ جوڑ مانگ ممکن اف۔

circle-invalid-center-or-through-points = دائرہ نا مرکز یا نقطہ غلط اے۔

circle-radius-center-with-multiple-points = مقرر مرکز تون 1 آن گیشتر نقطہ آن گڑوک دائرہ نا شعاع نا حساب ممکن اف۔

circle-change-radius-non-numerical = عددی قیمت نا دارنگ نقطہ آن گڑوک دائرہ نا شعاع نا بدل کننگ ممکن اف

circle-radius-with-points-non-numerical = وخت کہ عددی قیمت موجود اف، مقرر شعاع تون اسٹ آن گیشتر نقطہ آن گڑوک دائرہ جوڑ مانگ ممکن اف۔

circle-change-center-non-numerical = عددی قیمت نا دارنگ نقطہ آن گڑوک دائرہ نا مرکز نا بدل کننگ ہنو تانکہ جوڑ اف۔

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] فنکشن نا ڈومین کے ابعاد بس اف۔ ڈومین ٹی { $intervals } وقفہ اے، بلے فنکشن ٹی { $inputs ->
           *[other] { $inputs } ان پٹ
        } اے۔
    }

function-domain-invalid-format = فنکشن نا ڈومین نا فارمیٹ غلط اے۔

function-ignoring-non-numerical =
    { $type ->
        [maximum] فنکشن نا غیر عددی maximum نظرانداز اے۔
        [minimum] فنکشن نا غیر عددی minimum نظرانداز اے۔
        [extremum] فنکشن نا غیر عددی extremum نظرانداز اے۔
        [point] فنکشن نا غیر عددی نقطہ نظرانداز اے۔
        [slope] فنکشن نا غیر عددی میلان نظرانداز اے۔
       *[other] فنکشن نا غیر عددی { $type } نظرانداز اے۔
    }

function-ignoring-empty =
    { $type ->
        [maximum] فنکشن نا تہی maximum نظرانداز اے۔
        [minimum] فنکشن نا تہی minimum نظرانداز اے۔
        [extremum] فنکشن نا تہی extremum نظرانداز اے۔
        [point] فنکشن نا تہی نقطہ نظرانداز اے۔
       *[other] فنکشن نا تہی { $type } نظرانداز اے۔
    }

function-points-too-close = فنکشن ٹی ایرا نقطہ اے کہ نا جاہ اسٹ ندے کے زیات نزیک اے۔ فنکشن نا تعریف ممکن اف۔

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] فنکشن نا تکرار دا وخت ممکن اے کہ ان پٹ نا تعداد او آؤٹ پٹ نا تعداد برابر اے۔ دا فنکشن ٹی { $inputs } ان پٹ او { $outputs ->
           *[other] { $outputs } آؤٹ پٹ
        } اے۔
    }

## `<sequence>`

sequence-invalid-length = ترتیب نا درازی غلط اے۔  نا غیر منفی صحیح عدد مانگ لازم اے۔

sequence-invalid-step = ترتیب نا گام غلط اے۔  { $type } ٹائپ نا ترتیب کے نا عدد مانگ لازم اے۔

sequence-invalid-endpoint-number = عددی ترتیب نا "{ $attribute }" غلط اے۔  نا عدد مانگ لازم اے۔

sequence-invalid-endpoint-letters = حرفی ترتیب نا "{ $attribute }" غلط اے۔  نا حرف نا ترکیب مانگ لازم اے۔

sequence-invalid-endpoint = ترتیب نا "{ $attribute }" غلط اے۔

select-from-sequence-coprime-not-numbers = عدد گچین اف، دا کے coprime نظرانداز اے

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations مقرر اے، دا کے coprime نظرانداز اے

## Resolving a `target`

target-not-found = `<{ $source }>` کے target غلط اے: target موجود اف۔

target-state-variable-not-found = `<{ $source }>` کے target غلط اے: `<{ $component }>` ٹی "{ $property }" نام نا حالتی متغیر موجود اف۔

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` نا متغیر نا آزاد متغیر آن پرک مانگ لازم اے۔

ode-system-duplicate-variable-names = پدا آسا بستہ متغیر نا نام تون ODE RHS فنکشن نا تعریف ممکن اف۔

ode-system-rhs-function-error = ODE RHS فنکشن نا تعریف ممکن اف۔  mathjs فنکشن نا جوڑ کننگ ٹی خطا۔

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } خط نا نیام ٹی زاویہ نا تعریف ممکن اف

angle-invalid-through-point = `<angle>` نا through ٹی غلط نقطہ

parabola-vertex-too-many-points = راس تون 1 آن گیشتر نقطہ آن گڑوک پیرابولا ہنو تانکہ جوڑ اف۔

parabola-too-many-points = 3 آن گیشتر نقطہ آن گڑوک پیرابولا ہنو تانکہ جوڑ اف۔

intersection-too-many-items = ایرا آن گیشتر چیز کے تقاطع ہنو تانکہ جوڑ اف

## Other math components

ionic-compound-not-two-ions = ایرا آئون آن دگہ ہچ چیز کے آئونی ترکیب ہنو تانکہ جوڑ اف۔

ionic-compound-needs-cation-and-anion = آئونی ترکیب صرف اسٹ کیٹائون او اسٹ اینائون کے جوڑ اے۔

solve-equations-cannot-evaluate = مساوات نا حساب ممکن اف، دا کے مساوات نا حل ممکن اف: { $equation }

math-operators-operand-number-required = ریاضی نا عامل نا در کشنگ وخت operandNumber نا مقرر مانگ لازم اے۔

eigen-decomposition-failed = میٹرکس نا آئیگن قیمت نا حساب ممکن اف

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: پیرامیٹر { $parameters } پیٹرن ٹی موجود اف، دا کے ہمیشہ تہی تون جوڑ کیک۔
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" نا مطلب معلوم اف۔ نا none، medium، dense یا ایرا مثبت عدد مانگ لازم اے کہ اسٹ تہی جاہ تون پرک اے، دا رنگ grid="1 0.5"۔ ہچ گرڈ کشا اف۔

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` کے دا فنکشن لوٹینگ کہ { $expected ->
        [1] اسٹ آؤٹ پٹ دیک، یعنی ہر نقطہ ٹی میلان y'، دا رنگ `y - x`
       *[other] ایرا آؤٹ پٹ دیک، یعنی ہر نقطہ ٹی ویکٹر، دا رنگ `(y, -x)`
    }، بلے دیہا فنکشن { $found ->
       *[other] { $found } آؤٹ پٹ
    } دیک۔ { $alternative ->
        [none] ہچ چیز کشا اف۔
       *[other] دا فنکشن کے `<{ $alternative }>` راست کمپوننٹ اے۔ ہچ چیز کشا اف۔
    }

field-function-attribute-ignored-with-child = `function` ایٹریبیوٹ نظرانداز اے، چونکہ فنکشن کمپوننٹ نا اندر ٹی ہم دیہا اے؛ اندری فنکشن کار ٹی گڑیک۔ فنکشن نا صرف اسٹ رہ آن دیہنگ۔

field-variables-ignored =
    `<{ $component }>`: `variables` ایٹریبیوٹ دا عبارت نا متغیر کے نام دیک کہ سیدا کمپوننٹ نا اندر ٹی نبشتہ اے۔ { $reason ->
        [function-child] دیرا فنکشن `<function>` چک نا رنگ ٹی دیہا اے، او دا وت نا متغیر کے نام دیک، دا کے `variables` نظرانداز اے۔
       *[no-expression] دیرا دا رنگ عبارت موجود اف، دا کے `variables` نظرانداز اے۔
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure رینڈرر ٹی xLabelPosition="left" نا سہار موجود اف؛ راست جاہ نا رنگ کار ٹی گڑیک۔

prefigure-y-label-position-unsupported = `<graph>`: prefigure رینڈرر ٹی yLabelPosition="bottom" نا سہار موجود اف؛ برزی جاہ نا رنگ کار ٹی گڑیک۔

prefigure-invalid-axis-bounds = `<graph>`: prefigure نا بدل کننگ کے محور نا حد غلط اے؛ پیشدار bbox (-10,-10,10,10) کار ٹی گڑیک۔

prefigure-invalid-width = `<graph>`: prefigure نا بدل کننگ کے پہنائی غلط اے؛ پیشدار خاکہ نا پہنائی 425 کار ٹی گڑیک۔

prefigure-invalid-aspect-ratio = `<graph>`: prefigure نا بدل کننگ کے aspectRatio غلط اے؛ پیشدار نسبت 1 کار ٹی گڑیک۔

prefigure-grid-spacing-too-fine = `<graph>`: محور نا حد کے گرڈ نا فاصلہ زیات تنگ اے؛ prefigure رینڈرر ٹی گرڈ کشا اف۔

prefigure-annotations-not-rendered = `<graph>`: وخت کہ PreFigure رینڈرر کار ٹی اف، annotation کشا اف۔

multiple-annotations-children = `<graph>` ٹی چند `<annotations>` چک خفتا؛ آخری آن دگہ درست نظرانداز اے۔

## Referring to other components

copy-unrecognized-component-type = نامعلوم کمپوننٹ ٹائپ نا دراج کننگ یا کاپی کننگ ممکن اف: { $type }۔

copy-prop-not-found = { $component } ٹائپ نا کمپوننٹ ٹی { $property } prop موجود اف

collect-no-source = collect کے ہچ سرچمہ موجود اف۔

collect-invalid-component-type = `<{ $component }>` ٹائپ نا کمپوننٹ نا گرنگ ممکن اف، چونکہ دا ٹائپ غلط اے۔

reference-index-unavailable = انڈیکس `{ $reference }` کے ریفرنس دیہنگ ممکن اف

## `<callAction>`

component-action-unavailable = کمپوننٹ `{ $reference }` ٹی { $action } نا گوانک دیہنگ ممکن اف

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ڈیٹا نا شکل غلط اے۔  رج نا درازی اسٹ رنگ اف۔ componentIdx ٹی خفتا :{ $componentIdx }

data-frame-duplicate-column-names = ڈیٹا ٹی کالم نا نام پدا آسا اے۔  componentIdx ٹی خفتا :{ $componentIdx }

data-frame-missing-column-name = ڈیٹا ٹی اسٹ کالم نا نام موجود اف۔  componentIdx ٹی خفتا :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = دا جواب نا award وت نا دیہا جواب ٹی بستہ اے، او دا کار غیر متوقع رویہ کے گڑیک۔

answer-max-num-attempts-in-section-wide-check-work = دا کنٹینر نا اندر کہ sectionWideCheckWork دارے، `<answer>` ٹی `maxNumAttempts` نا مقرر کننگ نا ہچ اثر اف، چونکہ کوشش نا تعداد کنٹینر آن کنٹرول اے۔ `maxNumAttempts` نا کنٹینر ٹی مقرر کننگ۔

nested-section-wide-check-work-max-num-attempts = دا sectionWideCheckWork دارنگ کنٹینر کہ دگہ sectionWideCheckWork دارنگ کنٹینر نا اندر اے، نا سرا `maxNumAttempts` نا مقرر کننگ نا ہچ اثر اف، چونکہ کوشش نا تعداد دری کنٹینر آن کنٹرول اے۔ `maxNumAttempts` نا دری کنٹینر ٹی مقرر کننگ۔

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] symbolicEquality نا مقرر کننگ نا بغیر { $attributes } ایٹریبیوٹ نا ہچ اثر اف۔
    }

answer-invalid-type = جواب کے ٹائپ غلط اے: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` کمپوننٹ نا نام موجود اف، دا کے module نا ایٹریبیوٹ نا رنگ ٹی کار ٹی گڑنگ ممکن اف

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` کمپوننٹ نا module نا ایٹریبیوٹ نا رنگ ٹی کار ٹی گڑنگ ممکن اف، چونکہ `<module>` کمپوننٹ ٹائپ ٹی "{ $name }" ایٹریبیوٹ پیشتر آن تعریف اے۔

conditional-content-condition-ignored = case یا else چک دارنگ `<conditionalContent>` کمپوننٹ ٹی `condition` ایٹریبیوٹ نظرانداز اے۔

slider-markers-type-mismatch = مارکر نا ٹائپ او slider نا ٹائپ جوڑ اف۔

pretzel-problem-needs-statement-and-answer = pretzel غلط اے: ہر `<problem>` ٹی اسٹ `<statement>` او اسٹ `<answer>` مانگ لازم اے۔

pretzel-circuit-first-problem-distractor = pretzel غلط اے: mode="circuit" ٹی اولی `<problem>` نا distractor مانگ ممکن اف۔

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] `{ $attribute }` ایٹریبیوٹ کے غلط قیمت { $values }؛ نظرانداز اے۔
    }

attribute-must-be-references = `{ $attribute }` ایٹریبیوٹ کے قیمت `{ $value }` غلط اے۔ ایٹریبیوٹ نا دا ریفرنس آن جوڑ مانگ لازم اے کہ `$` تون سرا کیک۔

math-input-invalid-function-names = <mathInput>: { $attribute } ٹی غلط فنکشن نا نام نظرانداز اے: { $names }۔ ہر نام نا نشان دیہنگ نا بہر نا کمترین 2 حرف مانگ لازم اے (حرف یا ڈیش)؛ نا رند اسٹ `|<mathspeak alternative>` ہم آسک۔

## Building components from the source

component-type-invalid = کمپوننٹ نا ٹائپ غلط اے: `<{ $componentType }>`

attribute-repeated = { $attribute } ایٹریبیوٹ نا پدا آنگ ممکن اف۔

attribute-invalid-for-component = `<{ $componentType }>` ٹائپ نا کمپوننٹ کے "{ $attribute }" ایٹریبیوٹ غلط اے۔

## Style definition contrast

style-definition-insufficient-contrast =
    سٹائل نا تعریف { $styleNumber } ٹی { $context ->
        [text-on-background] پشت زمین نا خلاف متن نا رنگ
        [high-contrast] کینوس نا خلاف برزی کنٹراسٹ نا رنگ
        [line] کینوس نا خلاف خط نا رنگ
        [marker] کینوس نا خلاف مارکر نا رنگ
       *[text-on-canvas] کینوس نا خلاف متن نا رنگ
    } کے بس کنٹراسٹ موجود اف{ $mode ->
        [dark] { " (تاہار موڈ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کمترین { $threshold }:1 لوٹینگ)۔

style-definition-dark-mode-text-background-contrast =
    سٹائل نا تعریف { $styleNumber } نا مقرر رنگ روشن موڈ کے بس کنٹراسٹ دیک، بلے دا آن در آسا تاہار موڈ نا رنگ ٹی پشت زمین نا خلاف متن نا رنگ نا کنٹراسٹ بس اف ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کمترین { $threshold }:1 لوٹینگ)۔ { $suggestion ->
        [available] تاہار موڈ ٹی بس کنٹراسٹ کے یا روشن موڈ نا کنٹراسٹ نا گیش کننگ (مثال نا رنگ { $lightAttribute }="{ $lightColor }" مقرر کننگ) یا تاہار موڈ نا رنگ نا بدل کننگ (مثال نا رنگ { $darkAttribute }="{ $darkColor }" مقرر کننگ)۔
       *[none] تاہار موڈ ٹی بس کنٹراسٹ کے روشن موڈ نا کنٹراسٹ نا گیش کننگ یا در آسا رنگ نا textColorDarkMode او/یا backgroundColorDarkMode تون بدل کننگ۔
    }

style-definition-dark-mode-text-canvas-contrast =
    سٹائل نا تعریف { $styleNumber } نا مقرر متن نا رنگ روشن موڈ کے بس کنٹراسٹ دیک، بلے دا آن در آسا تاہار موڈ نا متن نا رنگ کینوس نا خلاف بس کنٹراسٹ دیرا اف ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ کمترین { $threshold }:1 لوٹینگ)۔ { $suggestion ->
        [available] تاہار موڈ ٹی بس کنٹراسٹ کے یا روشن موڈ نا کنٹراسٹ نا گیش کننگ (مثال نا رنگ textColor="{ $lightColor }" مقرر کننگ) یا تاہار موڈ نا رنگ نا بدل کننگ (textColorDarkMode="{ $darkColor }" مقرر کننگ)۔
       *[none] تاہار موڈ ٹی بس کنٹراسٹ کے روشن موڈ نا کنٹراسٹ نا گیش کننگ یا در آسا رنگ نا textColorDarkMode تون بدل کننگ۔
    }

section-multiple-style-palettes = اسٹ بہر صرف اسٹ <stylePalette> گچین کیک؛ آخری کار ٹی گڑیک۔

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } نا خاص ورینٹ معلوم اف، چونکہ numToSelect غیر منفی صحیح عدد اف۔

variant-num-to-select-not-constant-number = { $component } نا خاص ورینٹ معلوم اف، چونکہ numToSelect ثابت عدد اف۔

variant-with-replacement-not-constant-boolean = { $component } نا خاص ورینٹ معلوم اف، چونکہ withReplacement ثابت boolean اف۔

variant-select-weight-disables-unique = اگر اسٹ آپشن ٹی selectWeight یا selectForVariants مقرر اے، select کے خاص ورینٹ بند اے

variant-coprime-undetermined = { $component } نا خاص ورینٹ معلوم اف، چونکہ دا معلوم اف کہ coprime ہمیشہ دروگ اے۔

variant-attribute-not-constant = { $component } نا خاص ورینٹ معلوم اف، چونکہ { $attribute } ثابت اف۔

variant-attribute-not-number = { $component } نا خاص ورینٹ معلوم اف، چونکہ { $attribute } عدد اف۔

variant-attribute-wrong-type-for-sequence =
    { $type } ٹائپ نا { $component } نا خاص ورینٹ معلوم اف، چونکہ { $attribute } { $expected ->
        [letters-combination] حرف نا ترکیب
        [math-expression] راست ریاضی نا عبارت
        [integer] صحیح عدد
       *[number] عدد
    } اف۔

variant-length-not-integer = { $component } نا خاص ورینٹ معلوم اف، چونکہ length صحیح عدد اف۔

variant-sort-not-implemented = sort دارنگ { $component } نا خاص ورینٹ ہنو تانکہ جوڑ اف

variant-exclude-combinations-not-implemented = excludeCombinations دارنگ { $component } نا خاص ورینٹ ہنو تانکہ جوڑ اف

variant-math-exclude-not-implemented = exclude دارنگ math ٹائپ نا { $component } نا خاص ورینٹ ہنو تانکہ جوڑ اف

variant-non-constant-exclude-not-implemented = غیر ثابت exclude دارنگ { $component } نا خاص ورینٹ ہنو تانکہ جوڑ اف

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: گراف نا prefigure رینڈرر ٹی دا نا سہار موجود اف؛ نسل ہشتا۔

prefigure-descendant-invalid-geometry = { $subject }: جیومیٹری پورہ یا محدود اف؛ نسل ہشتا۔

prefigure-curve-label-omitted = { $subject }: بدل آسا منحنی نا عنصر ٹی label نا سہار موجود اف؛ label ہشتا۔

prefigure-curve-unsupported-definition-type = { $subject }: منحنی نا فنکشن نا تعریف نا ٹائپ '{ $definitionType }' نا سہار موجود اف؛ نسل ہشتا۔

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves ٹی flipFunctions ایٹریبیوٹ نا سہار موجود اف؛ نسل ہشتا۔

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves ٹی صرف formula ٹائپ نا چک فنکشن نا سہار اے؛ نسل ہشتا۔

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] خط نا رند نا label
       *[point] نقطہ نا label
    } کے labelPosition '{ $labelPosition }' نا سہار موجود اف؛ PreFigure نا پیشدار ہمترازی کار ٹی گڑا۔

prefigure-fill-style-unsupported = { $subject }: PreFigure ٹی پر کننگ نا سٹائل '{ $fillStyle }' نا سہار موجود اف؛ سادہ پر کننگ کار ٹی گڑیک۔

prefigure-line-style-unknown = { $subject }: نامعلوم خط نا سٹائل '{ $lineStyle }' PreFigure نا آؤٹ پٹ آن ہشتا۔

prefigure-marker-style-mapped-to-diamond = { $subject }: مارکر نا سٹائل '{ $markerStyle }' PreFigure نا 'diamond' سٹائل ٹی بدل آسا۔

prefigure-marker-style-unsupported = { $subject }: PreFigure ٹی مارکر نا سٹائل '{ $markerStyle }' نا سہار موجود اف؛ پیشدار سٹائل کار ٹی گڑا۔

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` غلط اے؛ ہدف معلوم اف۔ annotation ہشتا۔

annotation-ref-multiple-targets = `<annotation>`: `ref` چند ہدف کے نشان دیرا؛ اولی ہدف کار ٹی گڑیک۔

annotation-ref-outside-graph = `<annotation>`: `ref` غلط اے؛ ہدف گراف آن در اے۔ annotation ہشتا۔

annotation-ref-unsupported-target = `<annotation>`: `ref` غلط اے؛ prefigure نا بدل کننگ ٹی ہدف سہار دارنگ گرافیکی چیز اف۔ annotation ہشتا۔

annotation-text-missing = `<annotation>`: `text` کم یا تہی اے؛ تہی متن در دیہنگ اے۔

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] گرد بستگی خفتا۔
       *[other] `<{ $componentType }>` کمپوننٹ تون گرد بستگی خفتا۔
    }

reference-no-referent = ریفرنس `{ $reference }` کے ہچ مرجع موجود اف

reference-multiple-referents = ریفرنس `{ $reference }` کے چند مرجع خفتا

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` نا { $attribute } ایٹریبیوٹ نا فارمیٹ غلط اے۔

children-invalid = `<{ $componentType }>` کے غلط چک: غلط چک خفتا: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` ایٹریبیوٹ کے قیمت `{ $value }` غلط اے، قیمت `{ $default }` کار ٹی گڑیک

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML نا ورژن { $version } موجود اف۔
       *[other] DoenetML نا ورژن { $version } موجود اف۔ ورژن { $fallback } کار ٹی گڑیک
    }

## Reading the DoenetML

parse-invalid-doenetml = غلط DoenetML: { $content }

parse-tag-missing-close-tag = غلط DoenetML: `{ $tag }` ٹیگ نا بند ٹیگ موجود اف۔ یا وت بند مانگ ٹیگ یا `</{ $tagName }>` ٹیگ لوٹینگ۔

parse-tag-error = غلط DoenetML: `<{ $tagName }>` ٹیگ ٹی خطا

parse-attribute-missing-value = غلط DoenetML: غلط ایٹریبیوٹ `{ $attribute }` نا قیمت کم اے۔

parse-attribute-invalid = غلط DoenetML: غلط ایٹریبیوٹ `{ $attribute }`

parse-attribute-value-invalid = غلط DoenetML: ایٹریبیوٹ نا غلط قیمت `{ $value }`

parse-attribute-value-quote-mismatch = غلط DoenetML: ایٹریبیوٹ نا غلط قیمت `{ $value }`۔ کوٹیشن نا نشان جوڑ اف۔ اسٹ `{ $quote }` کم اے

parse-open-tag-name-missing = غلط DoenetML: بے نام ٹیگ خفتا، مثال نا رنگ `<`

parse-tag-not-closed = غلط DoenetML: `{ $tag }` ٹیگ بند اف (اسٹ `>` کم اے)۔

parse-self-closing-tag-name-missing = غلط DoenetML: بے نام ٹیگ خفتا `<{ $content }>`

parse-self-closing-tag-not-closed = غلط DoenetML: `{ $tag }` ٹیگ بند اف (`/>` کم اے)۔

parse-tag-invalid-attributes = غلط DoenetML: `{ $tag }` ٹیگ راست اف۔ نا ایٹریبیوٹ غلط اے۔

parse-close-tag-name-missing = غلط DoenetML: بے نام بند ٹیگ خفتا، مثال نا رنگ `</`

parse-attribute-value-unquoted = ایٹریبیوٹ نا قیمت نا کوٹیشن نا اندر مانگ لازم اے: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = غلط DoenetML: بند ٹیگ `{ $tag }` خفتا، بلے نا پچ ٹیگ موجود اف

parse-close-tag-mismatched = غلط DoenetML: بند ٹیگ جوڑ اف۔ `</{ $expected }>` لوٹا۔ `{ $found }` خفتا

parser-node-unconvertible = { $node } نوڈ نا Dast نوڈ ٹی بدل کننگ ممکن اف۔

## Names

name-attribute-invalid =
    غلط ایٹریبیوٹ name='{ $name }'۔ { $reason ->
        [characters] نام ٹی صرف حرف، عدد، چیری لکیر یا ڈیش آسک۔
       *[start] نام نا حرف تون سرا مانگ لازم اے۔
    }

component-name-invalid-start = غلط کمپوننٹ نا نام "{ $name }"۔ نام نا حرف تون سرا مانگ لازم اے۔

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched ٹائپ نا جواب نا video ایٹریبیوٹ دارنگ لازم اے

answer-video-watched-video-not-reference = videoWatched ٹائپ نا جواب نا video ایٹریبیوٹ نا ریفرنس مانگ لازم اے

answer-name-not-single-text = جواب نا name ایٹریبیوٹ نا صرف اسٹ text چک دارنگ لازم اے

## Referencing another document

external-doenetml-recursion-limit = زیات تہ بہ تہ سطح نا سبب آن دری DoenetML نا گرنگ ممکن اف۔ گرد ریفرنس اے؟

external-doenetml-unavailable = { $attribute }="{ $uri }" آن DoenetML نا گرنگ ممکن اف

external-doenetml-type-mismatch = { $attribute }="{ $uri }" آن گرا DoenetML غلط اے: دا "{ $componentType }" کمپوننٹ نا ٹائپ تون جوڑ اف

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` ایٹریبیوٹ کہنہ اے؛ نا جاہ ٹی `{ $to }` کار ٹی گڑیننگ۔
       *[other] [deprecation] `<{ $component }>` ٹی `{ $from }` ایٹریبیوٹ کہنہ اے؛ نا جاہ ٹی `{ $to }` کار ٹی گڑیننگ۔
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` ایٹریبیوٹ کہنہ او نظرانداز اے، چونکہ `{ $to }` ہم مقرر اے۔
       *[other] [deprecation] `<{ $component }>` ٹی `{ $from }` ایٹریبیوٹ کہنہ او نظرانداز اے، چونکہ `{ $to }` ہم مقرر اے۔
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` ٹی `{ $attribute }` ایٹریبیوٹ کہنہ او نظرانداز اے۔

deprecated-attribute-to-child = [deprecation] `<{ $component }>` ٹی `{ $attribute }` ایٹریبیوٹ کہنہ اے؛ نا جاہ ٹی `<{ $child }>` چک کار ٹی گڑیننگ۔

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` ٹی `{ $attribute }` ایٹریبیوٹ نا قیمت `{ $value }` کہنہ اے؛ نا جاہ ٹی `{ $to }` کار ٹی گڑیننگ۔


## Language coverage

pluralize-english-only = `<pluralize>` صرف انگریزی نا جمع کیک، دا کے { $locale } ٹی نبشتہ دستاویز ٹی نا متن دا رنگ مانیک۔ جمع نا شکل نا سیدا نبشتہ کننگ، یا `pluralForm` ایٹریبیوٹ تون مقرر کننگ۔


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` عنصر Doenet نا معلوم عنصر اف۔

schema-element-not-allowed-at-root = `<{ $tag }>` عنصر کے دستاویز نا ریشہ ٹی اجازت اف۔

schema-element-not-allowed-inside = `<{ $tag }>` عنصر کے `<{ $parent }>` نا اندر اجازت اف۔

schema-attribute-unrecognized = `<{ $tag }>` عنصر ٹی `{ $attribute }` نام نا ایٹریبیوٹ موجود اف۔

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` عنصر نا `{ $attribute }` ایٹریبیوٹ نا دا لسٹ مانگ لازم اے کہ نا ہر درجہ دا چیز آن اسٹ اے: { $allowed }
       *[other] `<{ $tag }>` عنصر نا `{ $attribute }` ایٹریبیوٹ نا دا چیز آن اسٹ مانگ لازم اے: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select کے ورینٹ نا نام غلط اے۔  ورینٹ نا نام { $variantName } { $numOptions } آپشن ٹی آسا، بلے گچین کننگ نا تعداد { $numToSelect } اے۔

select-variant-name-without-options = select کے چند ورینٹ مقرر اے، بلے ممکن ورینٹ نا نام { $variantName } کے ہچ آپشن مقرر اف۔

select-variant-name-not-possible = select کے مقرر ورینٹ نا نام { $variantName } ممکن نام اف۔

select-too-few-options = صرف { $numOptions } آن { $numToSelect } کمپوننٹ نا گچین کننگ ممکن اف۔

select-from-sequence-too-few-values = { $length } درازی نا ترتیب آن { $numToSelect } قیمت نا گچین کننگ ممکن اف۔

select-from-sequence-indices-count-mismatch = select کے مقرر انڈیکس نا تعداد نا گچین کننگ نا تعداد تون جوڑ مانگ لازم اے

select-from-sequence-indices-not-integers = select کے مقرر درست انڈیکس نا صحیح عدد مانگ لازم اے

select-from-sequence-index-excluded = selectfromsequence نا مقرر انڈیکس در ہشتا اے

select-from-sequence-indices-excluded-combination = selectfromsequence نا مقرر انڈیکس در ہشتا ترکیب اے

select-from-sequence-coprime-not-positive-integers = مثبت صحیح عدد گچین اف، دا کے coprime ترکیب نا گچین کننگ ممکن اف۔

select-from-sequence-coprime-common-factor = coprime عدد نا گچین کننگ ممکن اف۔ درست ممکن قیمت اسٹ ہمگ فیکٹر دارے۔ (مقرر "from" یا "to" نا قیمت نا "step" تون coprime مانگ لازم اے۔)

select-from-sequence-coprime-single-number = دا اسٹ عدد آن کہ 1 اف، coprime ترکیب نا گچین کننگ ممکن اف۔

select-from-sequence-excluded-too-many-combinations = selectFromSequence ٹی ترکیب آن 70% آن گیشتر در ہشتا

select-from-sequence-coprime-none-found = coprime عدد گچین اف۔ درست ممکن قیمت اسٹ ہمگ فیکٹر دارے۔

select-from-sequence-too-few-unique-values = { $numPossibleValues } درازی نا ترتیب آن { $numToSelect } خاص قیمت نا گچین کننگ ممکن اف

select-prime-numbers-too-few-values = { $numValues } درازی نا اولی عدد نا لسٹ آن { $numToSelect } قیمت نا گچین کننگ ممکن اف

select-prime-numbers-values-count-mismatch = select کے مقرر قیمت نا تعداد نا گچین کننگ نا تعداد تون جوڑ مانگ لازم اے

select-prime-numbers-values-not-prime = اولی عدد نا گچین کننگ کے مقرر قیمت نا اولی عدد نا لسٹ ٹی مانگ لازم اے

select-prime-numbers-values-excluded-combination = selectPrimeNumbers نا مقرر قیمت در ہشتا ترکیب اے

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ٹی ترکیب آن 70% آن گیشتر در ہشتا

select-random-combination-fluke = زیات کم اتفاق نا سبب آن، اتفاقی قیمت نا ترکیب گچین اف

select-random-value-fluke = زیات کم اتفاق نا سبب آن، اتفاقی قیمت گچین اف

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] دا `<{ $component }>` کشا اف، چونکہ دا ریاضی نا اندر اے او `inline` اف۔ `inline` نا ھور کننگ، تانکہ دا اسٹ ڈراپ ڈاؤن لسٹ مانے کہ عبارت نا اندر ٹی گنجک۔
        [expanded] دا `<{ $component }>` کشا اف، چونکہ دا ریاضی نا اندر اے او `expanded` اے۔ `expanded` نا در کننگ؛ چند لینک دبہ عبارت نا اندر ٹی گنجا اف۔
        [on-graph] دا `<{ $component }>` کشا اف، چونکہ دا گراف ٹی کشا ریاضی نا اندر اے، او آدا ان پٹ کے جاہ موجود اف۔
       *[relative-width] دا `<{ $component }>` کشا اف، چونکہ دا ریاضی نا اندر اے او نا پہنائی نسبتی اے۔ پہنائی نا مطلق واحد ٹی دیہنگ، دا رنگ `px`۔
    }
