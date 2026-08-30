# Saraiki (سرائیکی) diagnostics: the errors and warnings the core and the
# language server put in front of whoever is looking at the screen. Translated
# from `locales/en/diagnostics.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Perso-Arabic on Urdu's letter inventory plus Saraiki's four implosives
# ٻ ڄ ڋ ڳ, the implosive *ḍ* encoded U+068B, right to left — the same
# convention the other three files of this locale state. Digits are Latin.
#
# **Element names, attribute names and values are not words.** `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `math`, `text`, `boolean`,
# `coprime`, `selectFromSequence` and every `<tag>` written into these
# sentences are DoenetML identifiers and stay in English exactly as they are.
# The backticks and angle brackets around them are this catalog's punctuation.
#
# **No message here selects on a count.** CLDR has no plural data for `skr`, so
# a category branch would be one nothing could select and `lint:i18n` would
# reject; and it would be pointless besides, since a Saraiki noun after a
# numeral stays unmarked. Each such message is written once as `*[other]`, with
# the count argument kept in the selector so that nothing is lost from the
# message's shape. The `[1]` in `field-function-wrong-num-outputs` is a numeric
# literal rather than a category — Fluent matches it against the number itself
# — so it stays where English has it. The symbolic selectors — `$reason`,
# `$type`, `$mode`, `$suggestion`, `$isList`, `$context`, `$expected` and the
# rest — keep every branch English has, because those keys are compared letter
# for letter and a renamed one is a branch nothing can reach.
#
# **Vocabulary chosen once and used throughout**, so a correction is one
# search: «نظرانداز کیتا ویندے» for *is ignored*, «مقرر کیتا ڳیا» for
# *specified*, «غلط» for *invalid*, «قیمت» for *value*, «ایٹریبیوٹ» for
# *attribute*, «کمپوننٹ» for *component*, «لازمی» for *must*, «نہ ملیا» for
# *not found*, «کیوں جو» for *because*. Those and `ریفرنس`, `میٹرکس`, `ٹائپ`,
# `فنکشن`, `ویکٹر`, `انڈیکس`, `ورینٹ` are Urdu or English loans kept rather
# than coined: Saraiki has no computing register of its own, and this file says
# so rather than inventing one.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] جڈاں ڋو endpoint مقرر کیتے ون٘ڄن، تاں { $attributes } نظرانداز کیتا ویندے
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] جڈاں ہک endpoint تے ہک midpoint ڋوہیں مقرر کیتے ون٘ڄن، تاں { $attributes } نظرانداز کیتا ویندے
    }

line-segment-midpoint-offset-without-midpoint = midpoint دے بغیر midpointOffset دا کوئی اثر کائنی

## `<line>`

line-points-undetermined-dimensions = خط اینہاں نقطیاں وچوں لنگھدے جینہاں دے ابعاد نامعلوم ہن۔

line-points-too-few-dimensions = خط دا اینہاں نقطیاں وچوں لنگھݨا لازمی اے جیہڑے گھٹ توں گھٹ ڋو ابعاد رکھدے ہن۔

line-points-depend-on-variables = خط اینہاں نقطیاں وچوں لنگھدے جیہڑے ایں متغیرات تے منحصر ہن: { $variables }۔

line-equation-invalid-format = متغیرات { $variable1 } تے { $variable2 } وچ خط دی مساوات دا فارمیٹ غلط اے۔

## `<ray>`

ray-overprescribed-through = شعاع through، endpoint تے direction نال مقرر کیتی ڳئی اے۔  مقرر کیتا ڳیا through نظرانداز کیتا ویندے۔

ray-dimension-mismatch = شعاع وچ numDimensions میل نہیں کھاندا۔

## `<vector>`

vector-overprescribed-head = ویکٹر head، tail تے displacement نال مقرر کیتا ڳیا اے۔  مقرر کیتا ڳیا head نظرانداز کیتا ویندے۔

vector-dimension-mismatch = ویکٹر وچ numDimensions میل نہیں کھاندا۔

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ول کھچ نہیں سڳدی، کیوں جو ایندے کول nearestPoint حالتی متغیر کائنی۔

constrain-to-without-nearest-point = `<{ $component }>` تے پابندی نہیں لڳ سڳدی، کیوں جو ایندے کول nearestPoint حالتی متغیر کائنی۔

constrain-to-interior-without-nearest-point = `<{ $component }>` دے اندرونی حصے تے پابندی نہیں لڳ سڳدی، کیوں جو ایندے کول nearestPoint حالتی متغیر کائنی۔

## `<choiceInput>`

choice-input-label-position-ignored = جیہڑا choiceInput inline کائنی، اوندے کیتے labelPosition نظرانداز کیتا ویندے

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput کیتے مقرر کیتے ڳئے انڈیکس نظرانداز کیتے ویندن، کیوں جو انڈیکساں دی تعداد choice دے بچیاں دی تعداد نال میل نہیں کھاندی۔

pretzel-indices-count-mismatch = problem کیتے مقرر کیتے ڳئے انڈیکس نظرانداز کیتے ویندن، کیوں جو انڈیکساں دی تعداد problem دے بچیاں دی تعداد نال میل نہیں کھاندی۔

shuffle-indices-count-mismatch = shuffle کیتے مقرر کیتے ڳئے انڈیکس نظرانداز کیتے ویندن، کیوں جو انڈیکساں دی تعداد کمپوننٹاں دی تعداد نال میل نہیں کھاندی۔

indices-ignored-out-of-range = { $component } کیتے مقرر کیتے ڳئے انڈیکس نظرانداز کیتے ویندن، کیوں جو کجھ انڈیکس حد توں ٻاہر ہن۔

pretzel-indices-repeated = pretzel کیتے مقرر کیتے ڳئے انڈیکس نظرانداز کیتے ویندن، کیوں جو کجھ انڈیکس دُہرائے ڳئے ہن۔

pretzel-circuit-first-index = circuit موڈ وچ pretzel کیتے مقرر کیتے ڳئے انڈیکس نظرانداز کیتے ویندن، کیوں جو پہلے انڈیکس دا 1 ہوݨ لازمی اے۔

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` نوں string بچیاں نال کم کرݨ کیتے `type` ایٹریبیوٹ دا مقرر ہوݨ لازمی اے۔

invalid-type-defaulting-to-math = { $component } کمپوننٹ کیتے ٹائپ { $type } غلط اے۔ ایندا math، text، number یا boolean ہوݨ لازمی اے۔ پہلوں توں مقرر math ورتیا ویندے۔

string-not-valid-component-to-arrange = String "{ $value }" { $component } کیتے درست کمپوننٹ کائنی۔ نظرانداز کیتا ویندے۔

## Types and variables

invalid-type-defaulting-to-number = ٹائپ { $type } غلط اے، ٹائپ number مقرر کیتا ویندے۔

invalid-variable-value = متغیر دی قیمت غلط اے: `{ $value }`

## Variants

variant-index-must-be-number = ورینٹ دے انڈیکس { $index } دا عدد ہوݨ لازمی اے

variant-index-must-be-integer = ورینٹ دے انڈیکس { $index } دا صحیح عدد ہوݨ لازمی اے

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` مطلق پیمائشاں کیتے نہیں بݨیا۔ چوڑائیاں نسبتی مقرر کیتیاں ویندن۔

side-by-side-absolute-margins = `<{ $component }>` مطلق پیمائشاں کیتے نہیں بݨیا۔ حاشیے نسبتی مقرر کیتے ویندن۔

side-by-side-no-block-child = `<{ $component }>` غلط اے: ایندے کول گھٹ توں گھٹ ہک بلاک بچہ ہوݨ لازمی اے۔

## `<label>`

label-for-ignored-on-graphical = گرافیکی `<label>` تے `for` ایٹریبیوٹ نظرانداز کیتا ویندے۔

label-for-must-resolve-to-one = `<label>` تے `for` ایٹریبیوٹ دا ٹھیک ہک کمپوننٹ ول اشارہ کرݨ لازمی اے۔

label-for-unresolved = `<label>` تے `for` ایٹریبیوٹ کیں کمپوننٹ ول اشارہ نہ کر سڳیا۔

label-for-answer-with-authored-inputs = `<label>` تے `for` ایٹریبیوٹ ہک ہیجھے `<answer>` ول اشارہ کریندے جیندے ان پٹ مصنف نے آپ لکھے ہن؛ سیدھا ان پٹ ول ریفرنس ڋیو۔

label-for-answer-without-input = `<label>` تے `for` ایٹریبیوٹ ہک ہیجھے `<answer>` ول اشارہ کریندے جیندے کول عنوان ڋیوݨ کیتے کوئی ان پٹ کائنی۔

label-for-must-reference-input-or-answer = `<label>` تے `for` ایٹریبیوٹ دا کیں ان پٹ یا کیں answer ول ریفرنس ہوݨ لازمی اے۔

## Accessibility

accessibility-short-description-or-decorative = رسائی کیتے `<{ $component }>` دا یا تاں مختصر تفصیل رکھݨ یا decorative مقرر ہوݨ لازمی اے۔

accessibility-video-short-description = رسائی کیتے `<video>` دا مختصر تفصیل رکھݨ لازمی اے۔

accessibility-input-short-description-or-label = رسائی کیتے `<{ $component }>` دا مختصر تفصیل یا label رکھݨ لازمی اے۔

accessibility-answer-input-short-description-or-label = رسائی کیتے ہیجھے `<answer>` دا، جیہڑا ہک ان پٹ بݨیندے، مختصر تفصیل یا label رکھݨ لازمی اے۔

accessibility-short-description-contains-math = مختصر تفصیلاں وچ `<{ $component }>` ورڳے ریاضی دے کمپوننٹ نہیں ہوݨے چاہیدے۔ ریاضی نوں لفظاں وچ لکھو۔

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } باب دے عنوان دے متن کیتے کافی کنٹراسٹ نہیں ڋیندا (تاریک موڈ) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ گھٹ توں گھٹ { $threshold }:1 درکار اے)۔
       *[other] { $colorName } باب دے عنوان دے متن کیتے کافی کنٹراسٹ نہیں ڋیندا ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ گھٹ توں گھٹ { $threshold }:1 درکار اے)۔
    }

## `<circle>`

circle-through-points-non-numerical = جڈاں نقطیاں دیاں عددی قیمتاں نہ ہوون، تاں { $count } نقطیاں وچوں لنگھݨ آلا `<circle>` ہالے تیک نہیں بݨیا۔

circle-too-many-through-points = 3 توں ودھ نقطیاں وچوں لنگھݨ آلے دائرے دا حساب نہیں تھی سڳدا۔

circle-overprescribed-radius-center-points = مقرر کیتے ڳئے رداس، مرکز تے نقطیاں نال دائرے دا حساب نہیں تھی سڳدا۔

circle-center-with-multiple-points = مقرر کیتے ڳئے مرکز نال 1 توں ودھ نقطیاں وچوں لنگھݨ آلے دائرے دا حساب نہیں تھی سڳدا۔

circle-radius-too-small = دائرے دا حساب نہیں تھی سڳدا: ڋوہاں نقطیاں وچکار فاصلہ { $distance } اے، ایں کیتے مقرر کیتا ڳیا رداس { $radius } ٻہوں گھٹ اے۔

circle-radius-with-many-points = مقرر کیتے ڳئے رداس نال ڋو توں ودھ نقطیاں وچوں لنگھݨ آلا دائرہ نہیں بݨ سڳدا۔

circle-invalid-center-or-through-points = دائرے دا مرکز یا نقطے غلط ہن۔

circle-radius-center-with-multiple-points = مقرر کیتے ڳئے مرکز نال 1 توں ودھ نقطیاں وچوں لنگھݨ آلے دائرے دے رداس دا حساب نہیں تھی سڳدا۔

circle-change-radius-non-numerical = جیہڑے نقطیاں دیاں عددی قیمتاں کائنی، اونہاں وچوں لنگھݨ آلے دائرے دا رداس نہیں بدل سڳدا

circle-radius-with-points-non-numerical = جڈاں عددی قیمتاں نہ ہوون، تاں مقرر کیتے ڳئے رداس نال ہک توں ودھ نقطیاں وچوں لنگھݨ آلا دائرہ نہیں بݨ سڳدا۔

circle-change-center-non-numerical = جیہڑے نقطیاں دیاں عددی قیمتاں کائنی، اونہاں وچوں لنگھݨ آلے دائرے دا مرکز بدلݨ ہالے تیک نہیں بݨیا۔

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] فنکشن دے ڈومین کیتے ابعاد کافی کائنی۔ ڈومین وچ { $intervals } وقفے ہن پر فنکشن کول { $inputs ->
           *[other] { $inputs } ان پٹ
        } ہن۔
    }

function-domain-invalid-format = فنکشن دے ڈومین دا فارمیٹ غلط اے۔

function-ignoring-non-numerical =
    { $type ->
        [maximum] فنکشن دا غیر عددی maximum نظرانداز کیتا ویندے۔
        [minimum] فنکشن دا غیر عددی minimum نظرانداز کیتا ویندے۔
        [extremum] فنکشن دا غیر عددی extremum نظرانداز کیتا ویندے۔
        [point] فنکشن دا غیر عددی نقطہ نظرانداز کیتا ویندے۔
        [slope] فنکشن دا غیر عددی میلان نظرانداز کیتا ویندے۔
       *[other] فنکشن دا غیر عددی { $type } نظرانداز کیتا ویندے۔
    }

function-ignoring-empty =
    { $type ->
        [maximum] فنکشن دا خالی maximum نظرانداز کیتا ویندے۔
        [minimum] فنکشن دا خالی minimum نظرانداز کیتا ویندے۔
        [extremum] فنکشن دا خالی extremum نظرانداز کیتا ویندے۔
        [point] فنکشن دا خالی نقطہ نظرانداز کیتا ویندے۔
       *[other] فنکشن دا خالی { $type } نظرانداز کیتا ویندے۔
    }

function-points-too-close = فنکشن وچ ڋو ہیجھے نقطے ہن جیہڑے ہک ڋوجھے دے ٻہوں نزدیک ہن۔ فنکشن دی تعریف نہیں تھی سڳدی۔

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] فنکشن دے تکرار تڈاں ہی ممکن ہن جڈاں فنکشن دے ان پٹاں دی تعداد آؤٹ پٹاں دی تعداد دے برابر ہووے۔ ایں فنکشن کول { $inputs } ان پٹ تے { $outputs ->
           *[other] { $outputs } آؤٹ پٹ
        } ہن۔
    }

## `<sequence>`

sequence-invalid-length = ترتیب دی لمبائی غلط اے۔  ایندا غیر منفی صحیح عدد ہوݨ لازمی اے۔

sequence-invalid-step = ترتیب دا قدم غلط اے۔  { $type } ٹائپ دی ترتیب کیتے ایندا عدد ہوݨ لازمی اے۔

sequence-invalid-endpoint-number = عددی ترتیب دا "{ $attribute }" غلط اے۔  ایندا عدد ہوݨ لازمی اے۔

sequence-invalid-endpoint-letters = حرفی ترتیب دا "{ $attribute }" غلط اے۔  ایندا حرفاں دا مجموعہ ہوݨ لازمی اے۔

sequence-invalid-endpoint = ترتیب دا "{ $attribute }" غلط اے۔

select-from-sequence-coprime-not-numbers = عدد نہیں چݨے ویندے، ایں کیتے coprime نظرانداز کیتا ویندے

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations مقرر کیتا ڳیا اے، ایں کیتے coprime نظرانداز کیتا ویندے

## Resolving a `target`

target-not-found = `<{ $source }>` کیتے target غلط اے: target نہ ملیا۔

target-state-variable-not-found = `<{ $source }>` کیتے target غلط اے: `<{ $component }>` تے "{ $property }" ناں دا حالتی متغیر نہ ملیا۔

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` دے متغیرات دا آزاد متغیر توں وکھرا ہوݨ لازمی اے۔

ode-system-duplicate-variable-names = دُہرائے ڳئے تابع متغیراں دے ناواں نال ODE RHS فنکشناں دی تعریف نہیں تھی سڳدی۔

ode-system-rhs-function-error = ODE RHS فنکشن دی تعریف نہیں تھی سڳدی۔  mathjs فنکشن بݨاوݨ وچ خرابی۔

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } خطاں وچکار زاویے دی تعریف نہیں تھی سڳدی

angle-invalid-through-point = `<angle>` دے through وچ غلط نقطہ

parabola-vertex-too-many-points = راس نال 1 توں ودھ نقطیاں وچوں لنگھݨ آلا پیرابولا ہالے تیک نہیں بݨیا۔

parabola-too-many-points = 3 توں ودھ نقطیاں وچوں لنگھݨ آلا پیرابولا ہالے تیک نہیں بݨیا۔

intersection-too-many-items = ڋو توں ودھ چیزاں دا تقاطع ہالے تیک نہیں بݨیا

## Other math components

ionic-compound-not-two-ions = ڋو آئناں توں علاوہ کیں ٻئی صورت وچ آئنی مرکب ہالے تیک نہیں بݨیا۔

ionic-compound-needs-cation-and-anion = آئنی مرکب صرف ہک کیٹائن تے ہک اینائن کیتے بݨیا اے۔

solve-equations-cannot-evaluate = مساوات دا حساب نہ تھی سڳیا، ایں کیتے مساوات حل نہیں تھیندی: { $equation }

math-operators-operand-number-required = ریاضی دا کوئی عامل کڈھݨ ویلھے operandNumber دا مقرر ہوݨ لازمی اے۔

eigen-decomposition-failed = میٹرکس دیاں آئگن قیمتاں دا حساب نہ تھی سڳیا

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: پیرامیٹر { $parameters } پیٹرن وچ کائنی، ایں کیتے ہمیشہ خالی نال میل کھاسی۔
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" دا مطلب سمجھ نہیں آندا۔ ایندا none، medium، dense یا ڋو مثبت عدد ہوݨ لازمی اے جیہڑے ہک خالی جاء نال وکھرے کیتے ڳئے ہوون، جیویں grid="1 0.5"۔ کوئی گرڈ نہیں وائھیا ویندا۔

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` نوں ہیجھا فنکشن گھرجدے جیہڑا { $expected ->
        [1] ہک آؤٹ پٹ ڋیوے، یعنی ہر نقطے تے میلان y'، جیویں `y - x`
       *[other] ڋو آؤٹ پٹ ڋیوے، یعنی ہر نقطے تے ویکٹر، جیویں `(y, -x)`
    }، پر جیہڑا فنکشن ڋتا ڳیا اے او { $found ->
       *[other] { $found } آؤٹ پٹ
    } ڋیندے۔ { $alternative ->
        [none] کجھ وی نہیں وائھیا ویندا۔
       *[other] ایں فنکشن کیتے `<{ $alternative }>` ٹھیک کمپوننٹ اے۔ کجھ وی نہیں وائھیا ویندا۔
    }

field-function-attribute-ignored-with-child = `function` ایٹریبیوٹ نظرانداز کیتا ویندے کیوں جو فنکشن کمپوننٹ دے اندر وی ڋتا ڳیا اے؛ اندر آلا ورتیا ویندے۔ فنکشن ڋوہاں وچوں صرف ہک طریقے نال ڋیو۔

field-variables-ignored =
    `<{ $component }>`: `variables` ایٹریبیوٹ ہیجھے اظہار دے متغیرات دے ناں ڋیندے جیہڑا سیدھا کمپوننٹ دے اندر لکھیا ڳیا ہووے۔ { $reason ->
        [function-child] ایتھاں فنکشن `<function>` بچے دے طور تے ڋتا ڳیا اے، جیہڑا آپݨے متغیرات دے ناں آپ ڋیندے، ایں کیتے `variables` نظرانداز کیتا ویندے۔
       *[no-expression] ایتھاں ہیجھا کوئی اظہار کائنی، ایں کیتے `variables` نظرانداز کیتا ویندے۔
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure رینڈرر وچ xLabelPosition="left" دی سہولت کائنی؛ سڄے پاسے آلا رویہ ورتیا ویندے۔

prefigure-y-label-position-unsupported = `<graph>`: prefigure رینڈرر وچ yLabelPosition="bottom" دی سہولت کائنی؛ اُتلے پاسے آلا رویہ ورتیا ویندے۔

prefigure-invalid-axis-bounds = `<graph>`: prefigure وچ بدلݨ کیتے محور دیاں حداں غلط ہن؛ پہلوں توں مقرر bbox (-10,-10,10,10) ورتیا ویندے۔

prefigure-invalid-width = `<graph>`: prefigure وچ بدلݨ کیتے چوڑائی غلط اے؛ پہلوں توں مقرر خاکے دی چوڑائی 425 ورتی ویندی اے۔

prefigure-invalid-aspect-ratio = `<graph>`: prefigure وچ بدلݨ کیتے aspectRatio غلط اے؛ پہلوں توں مقرر تناسب 1 ورتیا ویندے۔

prefigure-grid-spacing-too-fine = `<graph>`: محور دیاں حداں کیتے گرڈ دا فاصلہ ٻہوں باریک اے؛ prefigure رینڈرر وچ گرڈ چھوڑ ڋتا ویندے۔

prefigure-annotations-not-rendered = `<graph>`: جڈاں PreFigure رینڈرر نہ ورتیا ون٘ڄے، تاں annotation نہیں وائھے ویندے۔

multiple-annotations-children = `<graph>` وچ کئی `<annotations>` بچے ملے؛ آخری توں سوا باقی سارے نظرانداز کیتے ویندن۔

## Referring to other components

copy-unrecognized-component-type = ناشناختہ کمپوننٹ ٹائپ دی توسیع یا نقل نہیں تھی سڳدی: { $type }۔

copy-prop-not-found = { $component } ٹائپ دے کمپوننٹ تے { $property } prop نہ ملیا

collect-no-source = collect کیتے کوئی ماخذ نہ ملیا۔

collect-invalid-component-type = `<{ $component }>` ٹائپ دے کمپوننٹ اکٹھے نہیں تھی سڳدے، کیوں جو ایہ ٹائپ غلط اے۔

reference-index-unavailable = انڈیکس `{ $reference }` دا ریفرنس نہیں ڋتا ون٘ڄ سڳدا

## `<callAction>`

component-action-unavailable = کمپوننٹ `{ $reference }` تے { $action } نہیں سڋیا ون٘ڄ سڳدا

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ڈیٹے دی شکل غلط اے۔  قطاراں دیاں لمبائیاں ہک ورڳیاں کائنی۔ componentIdx وچ ملیا :{ $componentIdx }

data-frame-duplicate-column-names = ڈیٹے وچ کالماں دے ناں دُہرائے ڳئے ہن۔  componentIdx وچ ملیا :{ $componentIdx }

data-frame-missing-column-name = ڈیٹے وچ ہک کالم دا ناں کائنی۔  componentIdx وچ ملیا :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = ایں جواب دا ہک award اوندے آپݨے بھیجے ڳئے جواب تے منحصر اے، تے ایں نال غیر متوقع رویہ سامݨے آسی۔

answer-max-num-attempts-in-section-wide-check-work = ہیجھے کنٹینر دے اندر جیندے کول sectionWideCheckWork ہووے، `<answer>` تے `maxNumAttempts` مقرر کرݨ دا کوئی اثر کائنی، کیوں جو کوششاں دی تعداد کنٹینر کنٹرول کریندے۔ `maxNumAttempts` کنٹینر تے مقرر کرو۔

nested-section-wide-check-work-max-num-attempts = ہیجھے کنٹینر تے جیندے کول sectionWideCheckWork ہووے تے جیہڑا کیں ٻئے sectionWideCheckWork آلے کنٹینر دے اندر ہووے، `maxNumAttempts` مقرر کرݨ دا کوئی اثر کائنی، کیوں جو کوششاں دی تعداد ٻاہرلا کنٹینر کنٹرول کریندے۔ `maxNumAttempts` ٻاہرلے کنٹینر تے مقرر کرو۔

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] symbolicEquality مقرر کیتے بغیر { $attributes } ایٹریبیوٹ دا کوئی اثر نہیں تھیسی۔
    }

answer-invalid-type = جواب کیتے ٹائپ غلط اے: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` کمپوننٹ دا کوئی ناں کائنی، ایں کیتے او module دے ایٹریبیوٹ طور تے نہیں ورتیا ون٘ڄ سڳدا

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` کمپوننٹ module دے ایٹریبیوٹ طور تے نہیں ورتیا ون٘ڄ سڳدا، کیوں جو `<module>` کمپوننٹ ٹائپ وچ "{ $name }" ناں دا ایٹریبیوٹ پہلوں ای موجود اے۔

conditional-content-condition-ignored = جیندے کول case یا else بچے ہوون، ایہو جیہے `<conditionalContent>` کمپوننٹ تے `condition` ایٹریبیوٹ نظرانداز کیتا ویندے۔

slider-markers-type-mismatch = مارکراں دا ٹائپ slider دے ٹائپ نال میل نہیں کھاندا۔

pretzel-problem-needs-statement-and-answer = pretzel غلط اے: ہر `<problem>` وچ ہک `<statement>` تے ہک `<answer>` ہوݨ لازمی اے۔

pretzel-circuit-first-problem-distractor = pretzel غلط اے: mode="circuit" وچ پہلا `<problem>` distractor نہیں تھی سڳدا۔

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] ایٹریبیوٹ `{ $attribute }` کیتے غلط قیمت { $values }؛ نظرانداز کیتی ویندی اے۔
    }

attribute-must-be-references = ایٹریبیوٹ `{ $attribute }` کیتے قیمت `{ $value }` غلط اے۔ ایٹریبیوٹ ہیجھے ریفرنساں توں بݨیا ہوݨ لازمی اے جیہڑے `$` نال شروع تھیندن۔

math-input-invalid-function-names = <mathInput>: { $attribute } وچ غلط فنکشن ناں نظرانداز کیتے ڳئے: { $names }۔ ہر ناں دا ڋکھاوے آلا حصہ گھٹ توں گھٹ 2 حرفاں دا ہوݨ لازمی اے (حرف یا ڈیش)؛ اوندے پچھوں مرضی نال `|<mathspeak alternative>` وی آ سڳدے۔

## Building components from the source

component-type-invalid = کمپوننٹ ٹائپ غلط اے: `<{ $componentType }>`

attribute-repeated = ایٹریبیوٹ { $attribute } دُہرایا نہیں ون٘ڄ سڳدا۔

attribute-invalid-for-component = `<{ $componentType }>` ٹائپ دے کمپوننٹ کیتے ایٹریبیوٹ "{ $attribute }" غلط اے۔

## Style definition contrast

style-definition-insufficient-contrast =
    سٹائل دی تعریف { $styleNumber } وچ { $context ->
        [text-on-background] پس منظر دے مقابلے متن دے رنگ
        [high-contrast] کینوس دے مقابلے تیز کنٹراسٹ آلے رنگ
        [line] کینوس دے مقابلے خط دے رنگ
        [marker] کینوس دے مقابلے مارکر دے رنگ
       *[text-on-canvas] کینوس دے مقابلے متن دے رنگ
    } کیتے کافی کنٹراسٹ کائنی{ $mode ->
        [dark] { " (تاریک موڈ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ گھٹ توں گھٹ { $threshold }:1 درکار اے)۔

style-definition-dark-mode-text-background-contrast =
    سٹائل دی تعریف { $styleNumber } وچ مقرر کیتے ڳئے رنگ روشن موڈ کیتے کافی کنٹراسٹ ڋیندن، پر اونہاں توں کڈھے ڳئے تاریک موڈ دے رنگاں وچ پس منظر دے مقابلے متن دے رنگ دا کنٹراسٹ کافی کائنی ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ گھٹ توں گھٹ { $threshold }:1 درکار اے)۔ { $suggestion ->
        [available] تاریک موڈ وچ کافی کنٹراسٹ یقینی بݨاوݨ کیتے یا تاں روشن موڈ دا کنٹراسٹ ودھاؤ (مثلاً { $lightAttribute }="{ $lightColor }" مقرر کرو) یا تاریک موڈ دا رنگ آپ مقرر کرو (مثلاً { $darkAttribute }="{ $darkColor }" مقرر کرو)۔
       *[none] تاریک موڈ وچ کافی کنٹراسٹ یقینی بݨاوݨ کیتے روشن موڈ دا کنٹراسٹ ودھاؤ یا کڈھے ڳئے رنگاں نوں textColorDarkMode تے/یا backgroundColorDarkMode نال بدلو۔
    }

style-definition-dark-mode-text-canvas-contrast =
    سٹائل دی تعریف { $styleNumber } وچ مقرر کیتا ڳیا متن دا رنگ روشن موڈ کیتے کافی کنٹراسٹ ڋیندے، پر اوندے توں کڈھیا ڳیا تاریک موڈ دے متن دا رنگ کینوس دے مقابلے کافی کنٹراسٹ نہیں ڋیندا ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ گھٹ توں گھٹ { $threshold }:1 درکار اے)۔ { $suggestion ->
        [available] تاریک موڈ وچ کافی کنٹراسٹ یقینی بݨاوݨ کیتے یا تاں روشن موڈ دا کنٹراسٹ ودھاؤ (مثلاً textColor="{ $lightColor }" مقرر کرو) یا تاریک موڈ دا رنگ آپ مقرر کرو (textColorDarkMode="{ $darkColor }" مقرر کرو)۔
       *[none] تاریک موڈ وچ کافی کنٹراسٹ یقینی بݨاوݨ کیتے روشن موڈ دا کنٹراسٹ ودھاؤ یا کڈھے ڳئے رنگ نوں textColorDarkMode نال بدلو۔
    }

section-multiple-style-palettes = ہک باب صرف ہک <stylePalette> چݨ سڳدے؛ آخری ورتیا ویندے۔

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } دے منفرد ورینٹ معلوم نہیں تھی سڳدے، کیوں جو numToSelect غیر منفی صحیح عدد کائنی۔

variant-num-to-select-not-constant-number = { $component } دے منفرد ورینٹ معلوم نہیں تھی سڳدے، کیوں جو numToSelect ثابت عدد کائنی۔

variant-with-replacement-not-constant-boolean = { $component } دے منفرد ورینٹ معلوم نہیں تھی سڳدے، کیوں جو withReplacement ثابت boolean کائنی۔

variant-select-weight-disables-unique = جے کیں آپشن تے selectWeight یا selectForVariants مقرر ہووے تاں select کیتے منفرد ورینٹ بند تھی ویندن

variant-coprime-undetermined = { $component } دے منفرد ورینٹ معلوم نہیں تھی سڳدے، کیوں جو ایہ معلوم نہیں تھیندا جو coprime ہمیشہ غلط اے۔

variant-attribute-not-constant = { $component } دے منفرد ورینٹ معلوم نہیں تھی سڳدے، کیوں جو { $attribute } ثابت کائنی۔

variant-attribute-not-number = { $component } دے منفرد ورینٹ معلوم نہیں تھی سڳدے، کیوں جو { $attribute } عدد کائنی۔

variant-attribute-wrong-type-for-sequence =
    { $type } ٹائپ دے { $component } دے منفرد ورینٹ معلوم نہیں تھی سڳدے، کیوں جو { $attribute } { $expected ->
        [letters-combination] حرفاں دا مجموعہ
        [math-expression] درست ریاضیاتی اظہار
        [integer] صحیح عدد
       *[number] عدد
    } کائنی۔

variant-length-not-integer = { $component } دے منفرد ورینٹ معلوم نہیں تھی سڳدے، کیوں جو length صحیح عدد کائنی۔

variant-sort-not-implemented = sort آلے { $component } دے منفرد ورینٹ ہالے تیک نہیں بݨے

variant-exclude-combinations-not-implemented = excludeCombinations آلے { $component } دے منفرد ورینٹ ہالے تیک نہیں بݨے

variant-math-exclude-not-implemented = exclude آلے math ٹائپ دے { $component } دے منفرد ورینٹ ہالے تیک نہیں بݨے

variant-non-constant-exclude-not-implemented = غیر ثابت exclude آلے { $component } دے منفرد ورینٹ ہالے تیک نہیں بݨے

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: گراف دے prefigure رینڈرر وچ ایندی سہولت کائنی؛ اولاد چھوڑ ڋتی ڳئی۔

prefigure-descendant-invalid-geometry = { $subject }: جیومیٹری غیر محدود یا ادھوری اے؛ اولاد چھوڑ ڋتی ڳئی۔

prefigure-curve-label-omitted = { $subject }: بدلے ڳئے منحنی عناصر تے label دی سہولت کائنی؛ label چھوڑ ڋتا ڳیا۔

prefigure-curve-unsupported-definition-type = { $subject }: منحنی دے فنکشن دی تعریف دے ٹائپ '{ $definitionType }' دی سہولت کائنی؛ اولاد چھوڑ ڋتی ڳئی۔

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves تے flipFunctions ایٹریبیوٹ دی سہولت کائنی؛ اولاد چھوڑ ڋتی ڳئی۔

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves تے صرف formula ٹائپ دے بچہ فنکشناں دی سہولت اے؛ اولاد چھوڑ ڋتی ڳئی۔

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] خط خاندان دے label
       *[point] نقطے دے label
    } کیتے labelPosition '{ $labelPosition }' دی سہولت کائنی؛ PreFigure دی پہلوں توں مقرر ترتیب ورتی ڳئی۔

prefigure-fill-style-unsupported = { $subject }: PreFigure وچ بھراوے دے سٹائل '{ $fillStyle }' دی سہولت کائنی؛ سادہ بھراوا ورتیا ویندے۔

prefigure-line-style-unknown = { $subject }: ناشناختہ خط دا سٹائل '{ $lineStyle }' PreFigure دے آؤٹ پٹ وچوں چھوڑ ڋتا ڳیا۔

prefigure-marker-style-mapped-to-diamond = { $subject }: مارکر دا سٹائل '{ $markerStyle }' PreFigure دے 'diamond' سٹائل وچ بدلیا ڳیا۔

prefigure-marker-style-unsupported = { $subject }: PreFigure وچ مارکر دے سٹائل '{ $markerStyle }' دی سہولت کائنی؛ پہلوں توں مقرر سٹائل ورتیا ڳیا۔

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` غلط اے؛ ہدف نہیں لبھدا۔ annotation چھوڑ ڋتا ڳیا۔

annotation-ref-multiple-targets = `<annotation>`: `ref` کئی ہدفاں ول اشارہ کریندے؛ پہلا ہدف ورتیا ویندے۔

annotation-ref-outside-graph = `<annotation>`: `ref` غلط اے؛ ہدف اپݨے گراف توں ٻاہر اے۔ annotation چھوڑ ڋتا ڳیا۔

annotation-ref-unsupported-target = `<annotation>`: `ref` غلط اے؛ prefigure وچ بدلݨ ویلھے ہدف کوئی سہولت آلی گرافیکی چیز کائنی۔ annotation چھوڑ ڋتا ڳیا۔

annotation-text-missing = `<annotation>`: `text` غائب یا خالی اے؛ خالی متن ڋتا ویندے۔

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] گول انحصار لبھیا۔
       *[other] `<{ $componentType }>` کمپوننٹ نال جڑیا گول انحصار لبھیا۔
    }

reference-no-referent = ریفرنس `{ $reference }` کیتے کوئی مرجع نہ ملیا

reference-multiple-referents = ریفرنس `{ $reference }` کیتے کئی مرجع ملے

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` دے ایٹریبیوٹ { $attribute } دا فارمیٹ غلط اے۔

children-invalid = `<{ $componentType }>` کیتے غلط بچے: غلط بچے ملے: { $children }

## Falling back to a default

attribute-value-invalid-using-default = ایٹریبیوٹ `{ $attribute }` کیتے قیمت `{ $value }` غلط اے، قیمت `{ $default }` ورتی ویندی اے

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML دا ورژن { $version } نہ ملیا۔
       *[other] DoenetML دا ورژن { $version } نہ ملیا۔ ورژن { $fallback } ورتیا ویندے
    }

## Reading the DoenetML

parse-invalid-doenetml = غلط DoenetML: { $content }

parse-tag-missing-close-tag = غلط DoenetML: ٹیگ `{ $tag }` دا بند کرݨ آلا ٹیگ کائنی۔ یا تاں آپ بند تھیوݨ آلا ٹیگ یا `</{ $tagName }>` ٹیگ درکار اے۔

parse-tag-error = غلط DoenetML: ٹیگ `<{ $tagName }>` وچ خرابی

parse-attribute-missing-value = غلط DoenetML: غلط ایٹریبیوٹ `{ $attribute }` توں لڳدے جو ایندی قیمت غائب اے۔

parse-attribute-invalid = غلط DoenetML: غلط ایٹریبیوٹ `{ $attribute }`

parse-attribute-value-invalid = غلط DoenetML: ایٹریبیوٹ دی غلط قیمت `{ $value }`

parse-attribute-value-quote-mismatch = غلط DoenetML: ایٹریبیوٹ دی غلط قیمت `{ $value }`۔ واوین دا جوڑا میل نہیں کھاندا۔ لڳدے جو تہاڋے کول ہک `{ $quote }` گھٹ اے

parse-open-tag-name-missing = غلط DoenetML: بغیر ناں دا ٹیگ ملیا، جیویں `<`

parse-tag-not-closed = غلط DoenetML: ٹیگ `{ $tag }` بند نہ تھیا (لڳدے جو ہک `>` غائب اے)۔

parse-self-closing-tag-name-missing = غلط DoenetML: بغیر ناں دا ٹیگ ملیا `<{ $content }>`

parse-self-closing-tag-not-closed = غلط DoenetML: ٹیگ `{ $tag }` بند نہ تھیا (لڳدے جو `/>` غائب اے)۔

parse-tag-invalid-attributes = غلط DoenetML: ٹیگ `{ $tag }` درست کائنی۔ لڳدے جو ایندے ایٹریبیوٹ غلط ہن۔

parse-close-tag-name-missing = غلط DoenetML: بغیر ناں دا بند کرݨ آلا ٹیگ ملیا، جیویں `</`

parse-attribute-value-unquoted = ایٹریبیوٹ دیاں قیمتاں دا واوین وچ ہوݨ لازمی اے: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = غلط DoenetML: بند کرݨ آلا ٹیگ `{ $tag }` ملیا، پر اوندا کھولݨ آلا ٹیگ کائنی

parse-close-tag-mismatched = غلط DoenetML: بند کرݨ آلا ٹیگ میل نہیں کھاندا۔ `</{ $expected }>` درکار ہا۔ `{ $found }` ملیا

parser-node-unconvertible = نوڈ { $node } نوں Dast نوڈ وچ نہ بدلیا ون٘ڄ سڳیا۔

## Names

name-attribute-invalid =
    غلط ایٹریبیوٹ name='{ $name }'۔ { $reason ->
        [characters] ناواں وچ صرف حرف، عدد، ہیٹھلی لکیر یا ڈیش آ سڳدن۔
       *[start] ناواں دا کیں حرف نال شروع تھیوݨ لازمی اے۔
    }

component-name-invalid-start = غلط کمپوننٹ ناں "{ $name }"۔ ناواں دا کیں حرف نال شروع تھیوݨ لازمی اے۔

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched ٹائپ دے جواب کول video ایٹریبیوٹ ہوݨ لازمی اے

answer-video-watched-video-not-reference = videoWatched ٹائپ دے جواب دا video ایٹریبیوٹ ہک ریفرنس ہوݨ لازمی اے

answer-name-not-single-text = جواب دے name ایٹریبیوٹ وچ صرف ہک text بچہ ہوݨ لازمی اے

## Referencing another document

external-doenetml-recursion-limit = ٻہوں زیادہ تہاں دے سبب ٻاہرلا DoenetML نہ لیا ون٘ڄ سڳیا۔ کیا کوئی گول ریفرنس اے؟

external-doenetml-unavailable = { $attribute }="{ $uri }" توں DoenetML نہ لیا ون٘ڄ سڳیا

external-doenetml-type-mismatch = { $attribute }="{ $uri }" توں لیا ڳیا DoenetML غلط اے: او "{ $componentType }" کمپوننٹ ٹائپ نال میل نہ کھادا

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] ایٹریبیوٹ `{ $from }` متروک اے؛ اوندی جاء تے `{ $to }` ورتو۔
       *[other] [deprecation] `<{ $component }>` تے ایٹریبیوٹ `{ $from }` متروک اے؛ اوندی جاء تے `{ $to }` ورتو۔
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] ایٹریبیوٹ `{ $from }` متروک اے تے نظرانداز کیتا ویندے، کیوں جو `{ $to }` وی مقرر کیتا ڳیا اے۔
       *[other] [deprecation] `<{ $component }>` تے ایٹریبیوٹ `{ $from }` متروک اے تے نظرانداز کیتا ویندے، کیوں جو `{ $to }` وی مقرر کیتا ڳیا اے۔
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` تے ایٹریبیوٹ `{ $attribute }` متروک اے تے نظرانداز کیتا ویندے۔

deprecated-attribute-to-child = [deprecation] `<{ $component }>` تے ایٹریبیوٹ `{ $attribute }` متروک اے؛ اوندی جاء تے `<{ $child }>` بچہ ورتو۔

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` تے ایٹریبیوٹ `{ $attribute }` دی قیمت `{ $value }` متروک اے؛ اوندی جاء تے `{ $to }` ورتو۔


## Language coverage

pluralize-english-only = `<pluralize>` صرف انگریزی دی جمع بݨا سڳدے، ایں کیتے { $locale } وچ لکھی ڳئی دستاویز وچ اوندا متن جیویں ہا اوویں رہندے۔ جمع دی شکل سیدھی لکھو، یا `pluralForm` ایٹریبیوٹ نال مقرر کرو۔


## Checking against the schema

schema-element-unrecognized = عنصر `<{ $tag }>` Doenet دا پہچاݨیا ہویا عنصر کائنی۔

schema-element-not-allowed-at-root = عنصر `<{ $tag }>` دستاویز دی جڑ تے نہیں آ سڳدا۔

schema-element-not-allowed-inside = عنصر `<{ $tag }>` `<{ $parent }>` دے اندر نہیں آ سڳدا۔

schema-attribute-unrecognized = عنصر `<{ $tag }>` کول `{ $attribute }` ناں دا کوئی ایٹریبیوٹ کائنی۔

schema-attribute-value-not-allowed =
    { $isList ->
        [true] عنصر `<{ $tag }>` دے ایٹریبیوٹ `{ $attribute }` دا ہیجھی فہرست ہوݨ لازمی اے جیندا ہر جز اینہاں وچوں ہک ہووے: { $allowed }
       *[other] عنصر `<{ $tag }>` دے ایٹریبیوٹ `{ $attribute }` دا اینہاں وچوں ہک ہوݨ لازمی اے: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select کیتے ورینٹ دا ناں غلط اے۔  ورینٹ دا ناں { $variantName } { $numOptions } آپشناں وچ آندے، پر چݨݨ دی تعداد { $numToSelect } اے۔

select-variant-name-without-options = select کیتے کجھ ورینٹ مقرر کیتے ڳئے ہن، پر ممکنہ ورینٹ ناں { $variantName } کیتے کوئی آپشن مقرر کائنی۔

select-variant-name-not-possible = select کیتے مقرر کیتا ڳیا ورینٹ ناں { $variantName } ممکنہ ورینٹ ناں کائنی۔

select-too-few-options = صرف { $numOptions } وچوں { $numToSelect } کمپوننٹ نہیں چݨے ون٘ڄ سڳدے۔

select-from-sequence-too-few-values = { $length } لمبائی دی ترتیب وچوں { $numToSelect } قیمتاں نہیں چݨیاں ون٘ڄ سڳدیاں۔

select-from-sequence-indices-count-mismatch = select کیتے مقرر کیتے ڳئے انڈیکساں دی تعداد دا چݨݨ دی تعداد نال میل کھاوݨ لازمی اے

select-from-sequence-indices-not-integers = select کیتے مقرر کیتے ڳئے سارے انڈیکساں دا صحیح عدد ہوݨ لازمی اے

select-from-sequence-index-excluded = selectfromsequence دا مقرر کیتا ڳیا انڈیکس خارج کیتا ڳیا ہا

select-from-sequence-indices-excluded-combination = selectfromsequence دے مقرر کیتے ڳئے انڈیکس ہک خارج کیتا ڳیا مجموعہ ہن

select-from-sequence-coprime-not-positive-integers = مثبت صحیح عدد نہیں چݨے ویندے، ایں کیتے coprime مجموعے نہیں چݨے ون٘ڄ سڳدے۔

select-from-sequence-coprime-common-factor = coprime عدد نہیں چݨے ون٘ڄ سڳدے۔ ساریاں ممکنہ قیمتاں دا ہک سانجھا عامل اے۔ (مقرر کیتیاں ڳئیاں "from" یا "to" دیاں قیمتاں دا "step" نال coprime ہوݨ لازمی اے۔)

select-from-sequence-coprime-single-number = ہیجھے اکلے عدد وچوں جیہڑا 1 کائنی، coprime مجموعے نہیں چݨے ون٘ڄ سڳدے۔

select-from-sequence-excluded-too-many-combinations = selectFromSequence وچ 70% توں ودھ مجموعے خارج کیتے ڳئے

select-from-sequence-coprime-none-found = coprime عدد نہ چݨے ون٘ڄ سڳے۔ ساریاں ممکنہ قیمتاں دا ہک سانجھا عامل اے۔

select-from-sequence-too-few-unique-values = { $numPossibleValues } لمبائی دی ترتیب وچوں { $numToSelect } منفرد قیمتاں نہیں چݨیاں ون٘ڄ سڳدیاں

select-prime-numbers-too-few-values = { $numValues } لمبائی دی مفرد عدداں دی فہرست وچوں { $numToSelect } قیمتاں نہیں چݨیاں ون٘ڄ سڳدیاں

select-prime-numbers-values-count-mismatch = select کیتے مقرر کیتیاں ڳئیاں قیمتاں دی تعداد دا چݨݨ دی تعداد نال میل کھاوݨ لازمی اے

select-prime-numbers-values-not-prime = مفرد عدد چݨݨ کیتے مقرر کیتیاں ڳئیاں ساریاں قیمتاں دا مفرد عدداں دی فہرست وچ ہوݨ لازمی اے

select-prime-numbers-values-excluded-combination = selectPrimeNumbers دیاں مقرر کیتیاں ڳئیاں قیمتاں ہک خارج کیتا ڳیا مجموعہ ہن

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers وچ 70% توں ودھ مجموعے خارج کیتے ڳئے

select-random-combination-fluke = ٻہوں انوکھے اتفاق نال بے ترتیب قیمتاں دا مجموعہ نہ چݨیا ون٘ڄ سڳیا

select-random-value-fluke = ٻہوں انوکھے اتفاق نال بے ترتیب قیمت نہ چݨی ون٘ڄ سڳی

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] ایہ `<{ $component }>` نہیں وائھیا ویندا کیوں جو ایہ ریاضی دے اندر اے تے `inline` کائنی۔ `inline` شامل کرو تاں جو ایہ ہک ڈراپ ڈاؤن فہرست بݨ ون٘ڄے، جیہڑی اظہار دے اندر سما ویندی اے۔
        [expanded] ایہ `<{ $component }>` نہیں وائھیا ویندا کیوں جو ایہ ریاضی دے اندر اے تے `expanded` اے۔ `expanded` ہٹاؤ؛ کئی سطراں آلا ڈٻہ اظہار دے اندر نہیں سما سڳدا۔
        [on-graph] ایہ `<{ $component }>` نہیں وائھیا ویندا کیوں جو ایہ گراف تے وائھے ڳئے ریاضی دے اندر اے، تے اوتھاں ان پٹ کیتے جاء کائنی۔
       *[relative-width] ایہ `<{ $component }>` نہیں وائھیا ویندا کیوں جو ایہ ریاضی دے اندر اے تے ایندی چوڑائی نسبتی اے۔ چوڑائی مطلق اکائیاں وچ ڋیو، جیویں `px`۔
    }
