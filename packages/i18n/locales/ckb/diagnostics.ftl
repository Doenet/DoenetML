# Central Kurdish (Sorani) warnings and errors. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Kurdo-Arabic alphabet; `ckb` maximizes to `ckb-Arab-IQ` and is
# right to left. Kurmanji has its own left-to-right Latin catalog in
# `locales/ku`.
#
# `through`, `endpoint`, `midpointOffset`, `numDimensions` and the like are
# DoenetML attribute names. They are part of the language, not prose, and are
# left in English exactly as written. Backticks, brackets and quotes are the
# same characters as in English and are written opening-first, in logical
# order; the bidi algorithm turns them around when the text is drawn.
#
# Where English distinguishes a singular from a plural only in the verb — "is
# ignored" against "are ignored" — Sorani says one thing, and the select is
# dropped rather than written out twice identically. The count argument then
# goes unused, which is harmless: it stays in the English message for the
# languages that need it. Counts are Latin digits, never ٠١٢٣.
#
# Sorani has no grammatical gender, so nothing here agrees with anything.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = کاتێک دوو خاڵی کۆتایی دیاری کرابن، { $attributes } پشتگوێ دەخرێت

line-segment-attributes-ignored-with-endpoint-and-midpoint = کاتێک خاڵێکی کۆتایی و خاڵێکی ناوەڕاست پێکەوە دیاری کرابن، { $attributes } پشتگوێ دەخرێت

line-segment-midpoint-offset-without-midpoint = بەبێ خاڵی ناوەڕاست، midpointOffset هیچ کاریگەرییەکی نییە

## `<line>`

line-points-undetermined-dimensions = هێڵێک بەناو خاڵانێکدا کە ڕەهەندیان دیارینییە.

line-points-too-few-dimensions = هێڵ دەبێت بەناو خاڵانێکدا بڕوات کە بەلایەنی کەمەوە دوو ڕەهەندیان هەبێت.

line-points-depend-on-variables = هێڵ بەناو خاڵانێکدا دەڕوات کە بە گۆڕاوەکانەوە بەندن: { $variables }.

line-equation-invalid-format = فۆرمی نادروست بۆ هاوکێشەی هێڵ بە گۆڕاوەکانی { $variable1 } و { $variable2 }.

## `<ray>`

ray-overprescribed-through = نیوەهێڵ بە through و endpoint و direction دیاری کراوە. through ـی دیاریکراو پشتگوێ دەخرێت.

ray-dimension-mismatch = نەگونجانی numDimensions لە نیوەهێڵدا.

## `<vector>`

vector-overprescribed-head = ڤێکتۆر بە head و tail و displacement دیاری کراوە. head ـی دیاریکراو پشتگوێ دەخرێت.

vector-dimension-mismatch = نەگونجانی numDimensions لە ڤێکتۆردا.

## Attracting and constraining

attract-to-without-nearest-point = ناتوانرێت ڕاکێشان بۆ `<{ $component }>` بکرێت، چونکە گۆڕاوی دۆخی nearestPoint ی نییە.

constrain-to-without-nearest-point = ناتوانرێت سنووردارکردن بۆ `<{ $component }>` بکرێت، چونکە گۆڕاوی دۆخی nearestPoint ی نییە.

constrain-to-interior-without-nearest-point = ناتوانرێت سنووردارکردن بۆ ناوەوەی `<{ $component }>` بکرێت، چونکە گۆڕاوی دۆخی nearestPoint ی نییە.

## `<choiceInput>`

choice-input-label-position-ignored = لە choiceInput ی نا-inline دا، labelPosition پشتگوێ دەخرێت

## Ordering children by index

choice-input-indices-count-mismatch = indices ی دیاریکراو بۆ choiceInput پشتگوێ دەخرێت، چونکە ژمارەی ئیندێکسەکان لەگەڵ ژمارەی منداڵەکانی choice ناگونجێت.

pretzel-indices-count-mismatch = indices ی دیاریکراو بۆ problem پشتگوێ دەخرێت، چونکە ژمارەی ئیندێکسەکان لەگەڵ ژمارەی منداڵەکانی problem ناگونجێت.

shuffle-indices-count-mismatch = indices ی دیاریکراو بۆ shuffle پشتگوێ دەخرێت، چونکە ژمارەی ئیندێکسەکان لەگەڵ ژمارەی پێکهاتەکان ناگونجێت.

indices-ignored-out-of-range = indices ی دیاریکراو بۆ { $component } پشتگوێ دەخرێت، چونکە هەندێک ئیندێکس لە دەرەوەی مەودان.

pretzel-indices-repeated = indices ی دیاریکراو بۆ pretzel پشتگوێ دەخرێت، چونکە هەندێک ئیندێکس دووبارە بوونەتەوە.

pretzel-circuit-first-index = indices ی دیاریکراو بۆ pretzel لە دۆخی circuit دا پشتگوێ دەخرێت، چونکە یەکەم ئیندێکس دەبێت 1 بێت.

## `<shuffle>` and `<sort>`

string-children-need-type = بۆ ئەوەی `<{ $component }>` لەگەڵ منداڵی دەقیدا کار بکات، دەبێت تایبەتمەندی `type` دیاری بکرێت.

invalid-type-defaulting-to-math = جۆری { $type } بۆ پێکهاتەی { $component } نادروستە. دەبێت یەکێک بێت لە math، text، number یان boolean. math وەک بنەڕەت بەکاردێت.

string-not-valid-component-to-arrange = دەقی "{ $value }" پێکهاتەیەکی دروست نییە بۆ { $component }. پشتگوێ دەخرێت.

## Types and variables

invalid-type-defaulting-to-number = جۆری { $type } نادروستە؛ جۆر دەکرێت بە number.

invalid-variable-value = نرخی نادروستی گۆڕاوێک: `{ $value }`

## Variants

variant-index-must-be-number = ئیندێکسی وەشانی { $index } دەبێت ژمارە بێت

variant-index-must-be-integer = ئیندێکسی وەشانی { $index } دەبێت ژمارەی تەواو بێت

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` بۆ پێوانەی ڕەها جێبەجێ نەکراوە. پانییەکان دەکرێن بە ڕێژەیی.

side-by-side-absolute-margins = `<{ $component }>` بۆ پێوانەی ڕەها جێبەجێ نەکراوە. پەراوێزەکان دەکرێن بە ڕێژەیی.

side-by-side-no-block-child = `<{ $component }>` ی نادروست: دەبێت بەلایەنی کەمەوە یەک منداڵی بلۆکی هەبێت.

## `<label>`

label-for-ignored-on-graphical = تایبەتمەندی `for` لەسەر `<label>` ی وێنەیی پشتگوێ دەخرێت.

label-for-must-resolve-to-one = تایبەتمەندی `for` لەسەر `<label>` دەبێت تەنها بۆ یەک پێکهاتە بگەڕێتەوە.

label-for-unresolved = تایبەتمەندی `for` لەسەر `<label>` نەگەیشتە هیچ پێکهاتەیەک.

label-for-answer-with-authored-inputs = تایبەتمەندی `for` لەسەر `<label>` ئاماژە بە `<answer>` ێک دەکات کە خۆی داخڵکراوەکانی نووسراون؛ ڕاستەوخۆ ئاماژە بە داخڵکراوەکە بکە.

label-for-answer-without-input = تایبەتمەندی `for` لەسەر `<label>` ئاماژە بە `<answer>` ێک دەکات کە داخڵکراوی نییە بۆ ناونیشانکردن.

label-for-must-reference-input-or-answer = تایبەتمەندی `for` لەسەر `<label>` دەبێت ئاماژە بە داخڵکراوێک یان بە `<answer>` ێک بکات.

## Accessibility

accessibility-short-description-or-decorative = لە پێناو دەستڕاگەیشتن، `<{ $component }>` دەبێت یان وەسفێکی کورتی هەبێت یان وەک ڕازێنەرەوە دیاری بکرێت.

accessibility-video-short-description = لە پێناو دەستڕاگەیشتن، `<video>` دەبێت وەسفێکی کورتی هەبێت.

accessibility-input-short-description-or-label = لە پێناو دەستڕاگەیشتن، `<{ $component }>` دەبێت وەسفێکی کورت یان ناونیشانێکی هەبێت.

accessibility-answer-input-short-description-or-label = لە پێناو دەستڕاگەیشتن، `<answer>` ێک کە داخڵکراوێک دروست دەکات دەبێت وەسفێکی کورت یان ناونیشانێکی هەبێت.

accessibility-short-description-contains-math = وەسفی کورت نابێت پێکهاتەی بیرکاری وەک `<{ $component }>` لەخۆ بگرێت. بیرکارییەکە بە وشە بنووسە.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } جیاوازی ڕەنگی پێویستی نییە بۆ دەقی سەرناونیشانی بەش (دۆخی تاریک) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ بەلایەنی کەمەوە { $threshold }:1 پێویستە).
       *[other] { $colorName } جیاوازی ڕەنگی پێویستی نییە بۆ دەقی سەرناونیشانی بەش ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ بەلایەنی کەمەوە { $threshold }:1 پێویستە).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` بەناو { $count } خاڵدا لە حاڵەتێکدا کە خاڵەکان نرخی ژمارەییان نییە، جێبەجێ نەکراوە.

circle-too-many-through-points = ناتوانرێت بازنە بەناو زیاتر لە 3 خاڵدا بژمێردرێت.

circle-overprescribed-radius-center-points = ناتوانرێت بازنە بە تیشک و ناوەند و خاڵی دیاریکراوەوە بژمێردرێت.

circle-center-with-multiple-points = ناتوانرێت بازنە بە ناوەندی دیاریکراو و بەناو زیاتر لە 1 خاڵدا بژمێردرێت.

circle-radius-too-small = ناتوانرێت بازنە بژمێردرێت: بە مەبەستی ئەوەی دووری نێوان دوو خاڵەکە { $distance } ە، تیشکی دیاریکراوی { $radius } زۆر بچووکە.

circle-radius-with-many-points = ناتوانرێت بازنە بەناو زیاتر لە دوو خاڵدا بە تیشکی دیاریکراوەوە دروست بکرێت.

circle-invalid-center-or-through-points = ناوەند یان خاڵەکانی بازنە نادروستن.

circle-radius-center-with-multiple-points = ناتوانرێت تیشکی بازنە بە ناوەندی دیاریکراو و بەناو زیاتر لە 1 خاڵدا بژمێردرێت.

circle-change-radius-non-numerical = ناتوانرێت تیشکی بازنە بگۆڕدرێت کاتێک خاڵەکان ژمارەیی نین

circle-radius-with-points-non-numerical = ناتوانرێت بازنە بەناو زیاتر لە یەک خاڵدا بە تیشکی دیاریکراوەوە دروست بکرێت کاتێک نرخی ژمارەیی نییە.

circle-change-center-non-numerical = گۆڕینی ناوەندی بازنە بەناو خاڵانێکدا کە ژمارەیی نین، جێبەجێ نەکراوە.

## `<function>`

function-domain-insufficient-dimensions = ڕەهەندی پێویست بۆ بواری فەنکشن نییە. بوار { $intervals } ماوەی هەیە بەڵام فەنکشن { $inputs } داخڵکراوی هەیە.

function-domain-invalid-format = فۆرمی نادروست بۆ بواری فەنکشن.

function-ignoring-non-numerical =
    { $type ->
        [maximum] پشتگوێخستنی بەرزترین نرخی نا-ژمارەیی فەنکشن.
        [minimum] پشتگوێخستنی نزمترین نرخی نا-ژمارەیی فەنکشن.
        [extremum] پشتگوێخستنی نرخی سنووریی نا-ژمارەیی فەنکشن.
        [point] پشتگوێخستنی خاڵی نا-ژمارەیی فەنکشن.
        [slope] پشتگوێخستنی لاری نا-ژمارەیی فەنکشن.
       *[other] پشتگوێخستنی { $type } ی نا-ژمارەیی فەنکشن.
    }

function-ignoring-empty =
    { $type ->
        [maximum] پشتگوێخستنی بەرزترین نرخی بەتاڵی فەنکشن.
        [minimum] پشتگوێخستنی نزمترین نرخی بەتاڵی فەنکشن.
        [extremum] پشتگوێخستنی نرخی سنووریی بەتاڵی فەنکشن.
        [point] پشتگوێخستنی خاڵی بەتاڵی فەنکشن.
       *[other] پشتگوێخستنی { $type } ی بەتاڵی فەنکشن.
    }

function-points-too-close = فەنکشن دوو خاڵی تێدایە کە شوێنیان زۆر لە یەک نزیکە. ناتوانرێت فەنکشن پێناسە بکرێت.

function-iterates-input-output-mismatch = دووبارەکردنەوەی فەنکشن تەنها کاتێک دەکرێت کە ژمارەی داخڵکراوەکان لەگەڵ ژمارەی دەرچووەکان یەکسان بێت. ئەم فەنکشنە { $inputs } داخڵکراو و { $outputs } دەرچووی هەیە.

## `<sequence>`

sequence-invalid-length = درێژی زنجیرە نادروستە. دەبێت ژمارەیەکی تەواوی نانەرێنی بێت.

sequence-invalid-step = هەنگاوی زنجیرە نادروستە. بۆ زنجیرەی جۆری { $type } دەبێت ژمارە بێت.

sequence-invalid-endpoint-number = "{ $attribute }" ی زنجیرەی ژمارەیی نادروستە. دەبێت ژمارە بێت.

sequence-invalid-endpoint-letters = "{ $attribute }" ی زنجیرەی پیتەکان نادروستە. دەبێت کۆمەڵێک پیت بێت.

sequence-invalid-endpoint = "{ $attribute }" ی زنجیرە نادروستە.

select-from-sequence-coprime-not-numbers = coprime پشتگوێ دەخرێت، چونکە ژمارە هەڵنابژێردرێت

select-from-sequence-coprime-with-exclude-combinations = coprime پشتگوێ دەخرێت، چونکە excludeCombinations دیاری کراوە

## Resolving a `target`

target-not-found = target ی نادروست بۆ `<{ $source }>`: ئامانج نەدۆزرایەوە.

target-state-variable-not-found = target ی نادروست بۆ `<{ $source }>`: گۆڕاوی دۆخێک بەناوی "{ $property }" لەسەر `<{ $component }>` نەدۆزرایەوە.

## `<odeSystem>`

ode-system-variables-match-independent = گۆڕاوەکانی `<odeSystem>` دەبێت جیاواز بن لە گۆڕاوی سەربەخۆ.

ode-system-duplicate-variable-names = ناتوانرێت فەنکشنەکانی لای ڕاستی ODE بە ناوی گۆڕاوی دووبارەوە پێناسە بکرێن.

ode-system-rhs-function-error = ناتوانرێت فەنکشنی لای ڕاستی ODE پێناسە بکرێت. هەڵە لە دروستکردنی فەنکشنی mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = ناتوانرێت گۆشەیەک لە نێوان { $count } هێڵدا پێناسە بکرێت

angle-invalid-through-point = خاڵی نادروست لە through ی `<angle>` دا

parabola-vertex-too-many-points = پارابۆل بە تەوەرە و بەناو زیاتر لە 1 خاڵدا جێبەجێ نەکراوە.

parabola-too-many-points = پارابۆل بەناو زیاتر لە 3 خاڵدا جێبەجێ نەکراوە.

intersection-too-many-items = پێکدادان بۆ زیاتر لە دوو بڕگە جێبەجێ نەکراوە

## Other math components

ionic-compound-not-two-ions = پێکهاتەی ئایۆنی تەنها بۆ دوو ئایۆن جێبەجێ کراوە.

ionic-compound-needs-cation-and-anion = پێکهاتەی ئایۆنی تەنها بۆ یەک کاتایۆن و یەک ئەنایۆن جێبەجێ کراوە.

solve-equations-cannot-evaluate = ناتوانرێت هاوکێشە شی بکرێتەوە، چونکە نەتوانرا هەڵبسەنگێندرێت: { $equation }

math-operators-operand-number-required = کاتێک ئۆپەراندێکی بیرکاری دەردەهێنرێت، دەبێت operandNumber دیاری بکرێت.

eigen-decomposition-failed = نەتوانرا نرخە ئایگنەکانی ماتریکس بژمێردرێن

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: پارامەتەری { $parameters } لە نەخشەکەدا نایەت، بۆیە هەمیشە لەگەڵ بەتاڵ دەگونجێت.

## `<graph>`

graph-grid-invalid = `<graph>`: ناتوانرێت grid="{ $grid }" لێکبدرێتەوە. دەبێت none، medium، dense، یان دوو ژمارەی ئەرێنی بێت کە بە بۆشاییەک جیا کرابنەوە، وەک grid="1 0.5". هیچ تۆڕێک ناکێشرێت.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` فەنکشنێکی پێویستە کە { $expected ->
        [one] یەک دەرچووی هەبێت، لاری y' لە هەر خاڵێکدا، وەک `y - x`
       *[other] دوو دەرچووی هەبێت، ڤێکتۆرەکە لە هەر خاڵێکدا، وەک `(y, -x)`
    }، بەڵام ئەو فەنکشنەی پێی دراوە { $found } دەرچووی هەیە. { $alternative ->
        [none] هیچ ناکێشرێت.
       *[other] `<{ $alternative }>` ئەو پێکهاتەیەیە کە بۆ ئەم فەنکشنە دەگونجێت. هیچ ناکێشرێت.
    }

field-function-attribute-ignored-with-child = تایبەتمەندی `function` پشتگوێ دەخرێت، چونکە فەنکشنەکە لە ناو پێکهاتەکەشدا دراوە؛ ئەوەی ناوەوە بەکاردێت. فەنکشنەکە تەنها بە یەکێک لە دوو ڕێگاکە بدە.

field-variables-ignored =
    `<{ $component }>`: تایبەتمەندی `variables` ناوی گۆڕاوەکانی دەربڕینێک دەبات کە ڕاستەوخۆ لە ناو پێکهاتەکەدا نووسراوە. { $reason ->
        [function-child] فەنکشنەکە لێرەدا وەک منداڵێکی `<function>` دراوە کە خۆی ناوی گۆڕاوەکانی خۆی دەبات، بۆیە `variables` پشتگوێ دەخرێت.
       *[no-expression] هیچ دەربڕینێکی وا لێرەدا نەدراوە، بۆیە `variables` پشتگوێ دەخرێت.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" لە پیشاندەری prefigure دا پشتگیری ناکرێت؛ ڕەفتاری لای ڕاست بەکاردێت.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" لە پیشاندەری prefigure دا پشتگیری ناکرێت؛ ڕەفتاری لای سەرەوە بەکاردێت.

prefigure-invalid-axis-bounds = `<graph>`: سنووری تەوەرەکان بۆ گۆڕینی prefigure نادروستە؛ bbox ی بنەڕەت (-10,-10,10,10) بەکاردێت.

prefigure-invalid-width = `<graph>`: پانی بۆ گۆڕینی prefigure نادروستە؛ پانی بنەڕەتی وێنە 425 بەکاردێت.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio بۆ گۆڕینی prefigure نادروستە؛ ڕێژەی بنەڕەتی 1 بەکاردێت.

prefigure-grid-spacing-too-fine = `<graph>`: بۆشایی نێوان تۆڕەکە بۆ سنووری تەوەرەکان زۆر ورد و بچووکە؛ تۆڕەکە لە پیشاندەری prefigure دا نانووسرێت.

prefigure-annotations-not-rendered = `<graph>`: کاتێک پیشاندەری PreFigure بەکارنەیەت، تێبینییەکان پیشان نادرێن.

multiple-annotations-children = چەند منداڵێکی `<annotations>` لە `<graph>` دا دۆزرایەوە؛ جگە لە دوایینیان هەمووی پشتگوێ دەخرێن.

## Referring to other components

copy-unrecognized-component-type = ناتوانرێت جۆرێکی پێکهاتەی نەناسراو درێژ بکرێتەوە یان لەبەر بگیرێتەوە: { $type }.

copy-prop-not-found = نەتوانرا خاسیەتی { $property } لەسەر پێکهاتەیەکی جۆری { $component } بدۆزرێتەوە

collect-no-source = هیچ سەرچاوەیەک بۆ collect نەدۆزرایەوە.

collect-invalid-component-type = ناتوانرێت پێکهاتەی جۆری `<{ $component }>` کۆبکرێتەوە، چونکە جۆرێکی نادروستی پێکهاتەیە.

reference-index-unavailable = ناتوانرێت ئاماژە بە ئیندێکسی `{ $reference }` بکرێت

## `<callAction>`

component-action-unavailable = ناتوانرێت { $action } لەسەر پێکهاتەی `{ $reference }` بانگ بکرێت

## `<dataFrame>`

data-frame-inconsistent-row-lengths = شێوەی داتاکە نادروستە. ڕیزەکان درێژی جیاوازیان هەیە. دۆزرایەوە لە componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = داتاکە ناوی ستوونی دووبارەی هەیە. دۆزرایەوە لە componentIdx :{ $componentIdx }

data-frame-missing-column-name = ناوی ستوونێک لە داتاکەدا کەمە. دۆزرایەوە لە componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = خەڵاتێکی ئەم وەڵامە پشت بە وەڵامی نێردراوی خودی `<answer>` ەکە دەبەستێت، ئەمەش دەبێتە هۆی ڕەفتارێکی چاوەڕواننەکراو.

answer-max-num-attempts-in-section-wide-check-work = دانانی `maxNumAttempts` لەسەر `<answer>` ێک لە ناو هەڵگرێکدا کە `sectionWideCheckWork` ی هەیە هیچ کاریگەرییەکی نییە، چونکە ژمارەی هەوڵەکان لەلایەن هەڵگرەکەوە کۆنترۆڵ دەکرێت. لەبری ئەوە `maxNumAttempts` لەسەر هەڵگرەکە دابنێ.

nested-section-wide-check-work-max-num-attempts = دانانی `maxNumAttempts` لەسەر هەڵگرێک کە `sectionWideCheckWork` ی هەیە و لە ناو هەڵگرێکی تردایە کە ئەویش `sectionWideCheckWork` ی هەیە، هیچ کاریگەرییەکی نییە، چونکە ژمارەی هەوڵەکان لەلایەن هەڵگری دەرەکییەوە کۆنترۆڵ دەکرێت. لەبری ئەوە `maxNumAttempts` لەسەر هەڵگری دەرەکی دابنێ.

answer-attributes-need-symbolic-equality = تایبەتمەندی { $attributes } بەبێ دانانی symbolicEquality هیچ کاریگەرییەکی نابێت.

answer-invalid-type = جۆری نادروست بۆ وەڵام: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = لەبەر ئەوەی پێکهاتەی `<{ $component }>` ناوی نییە، ناتوانرێت وەک تایبەتمەندییەکی مۆدیوول بەکاربهێنرێت

module-attribute-name-already-defined = پێکهاتەی `<{ $component } name="{ $name }">` ناتوانرێت وەک تایبەتمەندییەک بۆ مۆدیوول بەکاربهێنرێت، چونکە جۆری پێکهاتەی `<module>` پێشتر تایبەتمەندییەکی "{ $name }" ی پێناسە کردووە.

conditional-content-condition-ignored = تایبەتمەندی `condition` پشتگوێ دەخرێت لەسەر پێکهاتەی `<conditionalContent>` ێک کە منداڵی case یان else ی هەیە.

slider-markers-type-mismatch = جۆری نیشانەکان لەگەڵ جۆری سلایدەر ناگونجێت.

pretzel-problem-needs-statement-and-answer = pretzel ی نادروست: هەر `<problem>` ێک دەبێت یەک `<statement>` و یەک `<answer>` ی تێدا بێت.

pretzel-circuit-first-problem-distractor = pretzel ی نادروست: لە mode="circuit" دا، یەکەم `<problem>` ناتوانێت distractor بێت.

## Attribute values

attribute-invalid-values = نرخی نادروستی { $values } بۆ تایبەتمەندی `{ $attribute }`؛ پشتگوێ دەخرێت.

attribute-must-be-references = نرخی نادروستی `{ $value }` بۆ تایبەتمەندی `{ $attribute }`. تایبەتمەندی دەبێت لە ئاماژەکان پێک بێت کە بە `$` دەست پێ دەکەن.

math-input-invalid-function-names = <mathInput>: ناوی فەنکشنی نادروست لە { $attribute } دا پشتگوێ خرا: { $names }. بەشی پیشاندانی هەر ناوێک دەبێت بەلایەنی کەمەوە 2 نووسە بێت (پیت یان بەڕێ)؛ دەکرێت پاشگرێکی هەڵبژاردەی `|<mathspeak alternative>` بەدوایدا بێت.

## Building components from the source

component-type-invalid = جۆری پێکهاتەی نادروست: `<{ $componentType }>`

attribute-repeated = ناتوانرێت تایبەتمەندی { $attribute } دووبارە بکرێتەوە.

attribute-invalid-for-component = تایبەتمەندی "{ $attribute }" بۆ پێکهاتەیەکی جۆری `<{ $componentType }>` نادروستە.

## Style definition contrast

style-definition-insufficient-contrast =
    پێناسەی شێوازی { $styleNumber } جیاوازی ڕەنگی پێویستی نییە بۆ { $context ->
        [text-on-background] ڕەنگی دەق بەرامبەر بە ڕەنگی پاشبنەما
        [high-contrast] ڕەنگی جیاوازی بەرز بەرامبەر بە بۆشاییەکە
        [line] ڕەنگی هێڵ بەرامبەر بە بۆشاییەکە
        [marker] ڕەنگی نیشانە بەرامبەر بە بۆشاییەکە
       *[text-on-canvas] ڕەنگی دەق بەرامبەر بە بۆشاییەکە
    }{ $mode ->
        [dark] { " (دۆخی تاریک)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ بەلایەنی کەمەوە { $threshold }:1 پێویستە).

style-definition-dark-mode-text-background-contrast =
    هەرچەندە پێناسەی شێوازی { $styleNumber } ڕەنگی وای دیاری کردووە کە بۆ دۆخی ڕووناک جیاوازی پێویستیان هەیە، ئەو ڕەنگانەی بۆ دۆخی تاریک لێیان دەرهێنراون جیاوازی پێویستیان نییە بۆ ڕەنگی دەق بەرامبەر بە ڕەنگی پاشبنەما ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ بەلایەنی کەمەوە { $threshold }:1 پێویستە). { $suggestion ->
        [available] بۆ دڵنیابوون لە جیاوازی پێویست لە دۆخی تاریکدا، یان جیاوازی دۆخی ڕووناک زیاد بکە (بۆ نموونە { $lightAttribute }="{ $lightColor }" دابنێ) یان ڕەنگی دۆخی تاریک بگۆڕە (بۆ نموونە { $darkAttribute }="{ $darkColor }" دابنێ).
       *[none] بۆ دڵنیابوون لە جیاوازی پێویست لە دۆخی تاریکدا، جیاوازی دۆخی ڕووناک زیاد بکە یان ڕەنگە دەرهێنراوەکان بە textColorDarkMode و/یان backgroundColorDarkMode بگۆڕە.
    }

style-definition-dark-mode-text-canvas-contrast =
    هەرچەندە پێناسەی شێوازی { $styleNumber } ڕەنگی دەقێکی دیاری کردووە کە بۆ دۆخی ڕووناک جیاوازی پێویستی هەیە، ئەو ڕەنگی دەقەی بۆ دۆخی تاریک لێی دەرهێنراوە جیاوازی پێویستی نییە بەرامبەر بە بۆشاییەکە ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ بەلایەنی کەمەوە { $threshold }:1 پێویستە). { $suggestion ->
        [available] بۆ دڵنیابوون لە جیاوازی پێویست لە دۆخی تاریکدا، یان جیاوازی دۆخی ڕووناک زیاد بکە (بۆ نموونە textColor="{ $lightColor }" دابنێ) یان ڕەنگی دۆخی تاریک بگۆڕە (بۆ نموونە textColorDarkMode="{ $darkColor }" دابنێ).
       *[none] بۆ دڵنیابوون لە جیاوازی پێویست لە دۆخی تاریکدا، جیاوازی دۆخی ڕووناک زیاد بکە یان ڕەنگە دەرهێنراوەکە بە textColorDarkMode بگۆڕە.
    }

section-multiple-style-palettes = بەشێک تەنها دەتوانێت یەک <stylePalette> هەڵبژێرێت؛ دوایینیان بەکاردێت.

## Unique variants

variant-num-to-select-not-non-negative-integer = ناتوانرێت وەشانە بێهاوتاکانی { $component } دیاری بکرێن، چونکە numToSelect ژمارەیەکی تەواوی نانەرێنی نییە.

variant-num-to-select-not-constant-number = ناتوانرێت وەشانە بێهاوتاکانی { $component } دیاری بکرێن، چونکە numToSelect ژمارەیەکی نەگۆڕ نییە.

variant-with-replacement-not-constant-boolean = ناتوانرێت وەشانە بێهاوتاکانی { $component } دیاری بکرێن، چونکە withReplacement بولیانێکی نەگۆڕ نییە.

variant-select-weight-disables-unique = وەشانە بێهاوتاکان بۆ select ناچالاک دەکرێن ئەگەر بژاردەیەک هەبێت کە selectWeight یان selectForVariants ی بۆ دیاری کرابێت

variant-coprime-undetermined = ناتوانرێت وەشانە بێهاوتاکانی { $component } دیاری بکرێن، چونکە ناتوانرێت دیاری بکرێت coprime هەمیشە هەڵەیە.

variant-attribute-not-constant = ناتوانرێت وەشانە بێهاوتاکانی { $component } دیاری بکرێن، چونکە { $attribute } نەگۆڕ نییە.

variant-attribute-not-number = ناتوانرێت وەشانە بێهاوتاکانی { $component } دیاری بکرێن، چونکە { $attribute } ژمارە نییە.

variant-attribute-wrong-type-for-sequence =
    ناتوانرێت وەشانە بێهاوتاکانی { $component } ی جۆری { $type } دیاری بکرێن، چونکە { $attribute } ئەمە نییە: { $expected ->
        [letters-combination] کۆمەڵێک پیت
        [math-expression] دەربڕینێکی بیرکاری دروست
        [integer] ژمارەیەکی تەواو
       *[number] ژمارەیەک
    }.

variant-length-not-integer = ناتوانرێت وەشانە بێهاوتاکانی { $component } دیاری بکرێن، چونکە length ژمارەیەکی تەواو نییە.

variant-sort-not-implemented = وەشانە بێهاوتاکانی { $component } ێک لەگەڵ sort جێبەجێ نەکراون

variant-exclude-combinations-not-implemented = وەشانە بێهاوتاکانی { $component } ێک لەگەڵ excludeCombinations جێبەجێ نەکراون

variant-math-exclude-not-implemented = وەشانە بێهاوتاکانی { $component } ێکی جۆری math لەگەڵ exclude جێبەجێ نەکراون

variant-non-constant-exclude-not-implemented = وەشانە بێهاوتاکانی { $component } ێک لەگەڵ exclude ی ناجێگیر جێبەجێ نەکراون

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: لە پیشاندەری prefigure ی graph دا پشتگیری ناکرێت؛ نەوەکە بەجێهێڵدرا.

prefigure-descendant-invalid-geometry = { $subject }: ئەندازەی ناتەواو یان ناکۆتایی؛ نەوەکە بەجێهێڵدرا.

prefigure-curve-label-omitted = { $subject }: ناونیشان لەسەر توخمە چەماوە گۆڕدراوەکان پشتگیری ناکرێت؛ ناونیشان نانووسرێت.

prefigure-curve-unsupported-definition-type = { $subject }: جۆری پێناسەی فەنکشنی چەماوەی '{ $definitionType }' پشتگیری ناکرێت؛ نەوەکە بەجێهێڵدرا.

prefigure-region-flip-functions-unsupported = { $subject }: تایبەتمەندی flipFunctions لەسەر regionBetweenCurves پشتگیری ناکرێت؛ نەوەکە بەجێهێڵدرا.

prefigure-region-non-formula-child = { $subject }: تەنها فەنکشنی منداڵی جۆری formula لەسەر regionBetweenCurves پشتگیری دەکرێن؛ نەوەکە بەجێهێڵدرا.

prefigure-label-position-unsupported =
    { $subject }: labelPosition ی '{ $labelPosition }' پشتگیری ناکرێت بۆ { $labelKind ->
        [line-family] ناونیشانی خێزانی هێڵ
       *[point] ناونیشانی خاڵ
    }؛ ڕیزکردنی بنەڕەتی PreFigure بەکارهێنرا.

prefigure-fill-style-unsupported = { $subject }: شێوازی پڕکردنەوەی '{ $fillStyle }' لەلایەن PreFigure ەوە پشتگیری ناکرێت؛ پڕکردنەوەی ڕەق بەکاردێت.

prefigure-line-style-unknown = { $subject }: شێوازی هێڵی نەناسراوی '{ $lineStyle }' لە دەرچووی PreFigure دا نانووسرێت.

prefigure-marker-style-mapped-to-diamond = { $subject }: شێوازی نیشانەی '{ $markerStyle }' بۆ شێوازی 'diamond' ی PreFigure گۆڕدرا.

prefigure-marker-style-unsupported = { $subject }: شێوازی نیشانەی '{ $markerStyle }' لەلایەن PreFigure ەوە پشتگیری ناکرێت؛ شێوازی بنەڕەت بەکارهێنرا.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ی نادروست؛ ناتوانرێت ئامانج بدۆزرێتەوە. تێبینییەکە نانووسرێت.

annotation-ref-multiple-targets = `<annotation>`: `ref` گەیشتە چەند ئامانجێک؛ یەکەم ئامانج بەکاردێت.

annotation-ref-outside-graph = `<annotation>`: `ref` ی نادروست؛ ئامانجەکە لە دەرەوەی ئەو گرافەیە کە لەخۆی گرتووە. تێبینییەکە نانووسرێت.

annotation-ref-unsupported-target = `<annotation>`: `ref` ی نادروست؛ ئامانجەکە بەرهەمێکی وێنەیی پشتگیریکراو نییە لە گۆڕینی prefigure دا. تێبینییەکە نانووسرێت.

annotation-text-missing = `<annotation>`: `text` نییە یان بەتاڵە؛ دەقێکی بەتاڵ دەنووسرێت.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] پشتبەستنی سووڕاوی دۆزرایەوە.
       *[other] پشتبەستنی سووڕاوی دۆزرایەوە کە پێکهاتەی `<{ $componentType }>` تێیدایە.
    }

reference-no-referent = هیچ ئامانجێک بۆ ئاماژەی `{ $reference }` نەدۆزرایەوە

reference-multiple-referents = چەند ئامانجێک بۆ ئاماژەی `{ $reference }` دۆزرایەوە

## Children that do not match

children-invalid-attribute-format = فۆرمی نادروست بۆ تایبەتمەندی { $attribute } ی `<{ $componentType }>`.

children-invalid = منداڵی نادروست بۆ `<{ $componentType }>`: ئەم منداڵە نادروستانە دۆزرانەوە: { $children }

## Falling back to a default

attribute-value-invalid-using-default = نرخی نادروستی `{ $value }` بۆ تایبەتمەندی `{ $attribute }`، نرخی `{ $default }` بەکاردێت

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] وەشانی DoenetML ی { $version } نەدۆزرایەوە.
       *[other] وەشانی DoenetML ی { $version } نەدۆزرایەوە. دەگەڕێتەوە بۆ وەشانی { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ی نادروست: { $content }

parse-tag-missing-close-tag = DoenetML ی نادروست: تاگی `{ $tag }` تاگی داخستنی نییە. تاگێکی خۆداخەر یان تاگێکی `</{ $tagName }>` چاوەڕوان دەکرا.

parse-tag-error = DoenetML ی نادروست: هەڵە لە تاگی `<{ $tagName }>` دا

parse-attribute-missing-value = DoenetML ی نادروست: وا دیارە تایبەتمەندی نادروستی `{ $attribute }` نرخی نییە.

parse-attribute-invalid = DoenetML ی نادروست: تایبەتمەندی نادروستی `{ $attribute }`

parse-attribute-value-invalid = DoenetML ی نادروست: نرخی نادروستی تایبەتمەندی `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML ی نادروست: نرخی نادروستی تایبەتمەندی `{ $value }`. نیشانەکانی وتە لەگەڵ یەکتر ناگونجێن. وا دیارە `{ $quote }` ێکت کەمە

parse-open-tag-name-missing = DoenetML ی نادروست: تاگێک بەبێ ناوی تاگ دۆزرایەوە، بۆ نموونە `<`

parse-tag-not-closed = DoenetML ی نادروست: تاگی `{ $tag }` دانەخرا (وا دیارە `>` کەمە).

parse-self-closing-tag-name-missing = DoenetML ی نادروست: تاگێک بەبێ ناوی تاگ دۆزرایەوە `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ی نادروست: تاگی `{ $tag }` دانەخرا (وا دیارە `/>` کەمە).

parse-tag-invalid-attributes = DoenetML ی نادروست: تاگی `{ $tag }` دروست نییە. لەوانەیە تایبەتمەندی هەڵەی هەبێت.

parse-close-tag-name-missing = DoenetML ی نادروست: تاگێکی داخستن بەبێ ناوی تاگ دۆزرایەوە، بۆ نموونە `</`

parse-attribute-value-unquoted = نرخی تایبەتمەندی دەبێت لە نێو وتەنیشانەدا بێت: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ی نادروست: تاگی داخستنی `{ $tag }` دۆزرایەوە، بەڵام هیچ تاگێکی کردنەوەی هاوتای نییە

parse-close-tag-mismatched = DoenetML ی نادروست: تاگی داخستنی نەگونجاو. `</{ $expected }>` چاوەڕوان دەکرا. `{ $found }` دۆزرایەوە

parser-node-unconvertible = نەتوانرا گرێی { $node } بگۆڕدرێت بۆ گرێی Dast.

## Names

name-attribute-invalid =
    ناوی نادروستی تایبەتمەندی name='{ $name }'. { $reason ->
        [characters] ناو تەنها دەتوانێت پیت، ژمارە، ژێرهێڵ یان بەڕێ لەخۆ بگرێت.
       *[start] ناو دەبێت بە پیتێک دەست پێ بکات.
    }

component-name-invalid-start = ناوی پێکهاتەی نادروستی "{ $name }". ناو دەبێت بە پیتێک دەست پێ بکات.

## `<answer>` sugar

answer-video-watched-missing-video = وەڵامی جۆری videoWatched دەبێت تایبەتمەندی video ی هەبێت

answer-video-watched-video-not-reference = وەڵامی جۆری videoWatched دەبێت تایبەتمەندی video ی هەبێت کە ئاماژەیەک بێت

answer-name-not-single-text = تایبەتمەندی name ی وەڵام دەبێت یەک منداڵی دەقی هەبێت

## Referencing another document

external-doenetml-recursion-limit = نەتوانرا DoenetML ی دەرەکی وەربگیرێت بەهۆی زۆری ئاستەکانی سووڕانەوە. ئایا ئاماژەیەکی سووڕاوی هەیە؟

external-doenetml-unavailable = نەتوانرا DoenetML وەربگیرێت لە { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ی نادروست لە { $attribute }="{ $uri }" وەرگیرا: لەگەڵ جۆری پێکهاتەی "{ $componentType }" نەگونجا

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] تایبەتمەندی `{ $from }` بەسەرچووە؛ لەبری ئەوە `{ $to }` بەکاربهێنە.
       *[other] [deprecation] تایبەتمەندی `{ $from }` لەسەر `<{ $component }>` بەسەرچووە؛ لەبری ئەوە `{ $to }` بەکاربهێنە.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] تایبەتمەندی `{ $from }` بەسەرچووە و پشتگوێ دەخرێت، چونکە `{ $to }` یش دیاری کراوە.
       *[other] [deprecation] تایبەتمەندی `{ $from }` لەسەر `<{ $component }>` بەسەرچووە و پشتگوێ دەخرێت، چونکە `{ $to }` یش دیاری کراوە.
    }

deprecated-attribute-ignored = [deprecation] تایبەتمەندی `{ $attribute }` لەسەر `<{ $component }>` بەسەرچووە و پشتگوێ دەخرێت.

deprecated-attribute-to-child = [deprecation] تایبەتمەندی `{ $attribute }` لەسەر `<{ $component }>` بەسەرچووە؛ لەبری ئەوە منداڵێکی `<{ $child }>` بەکاربهێنە.

deprecated-attribute-value-renamed = [deprecation] نرخی `{ $value }` ی تایبەتمەندی `{ $attribute }` لەسەر `<{ $component }>` بەسەرچووە؛ لەبری ئەوە `{ $to }` بەکاربهێنە.


## Language coverage

pluralize-english-only = `<pluralize>` تەنها دەتوانێت ئینگلیزی کۆ بکات، بۆیە دەقەکەی لە دۆکیومێنتێکدا کە بە { $locale } نووسراوە بێگۆڕ دەمێنێتەوە. فۆرمی کۆ ڕاستەوخۆ بنووسە، یان بە تایبەتمەندی `pluralForm` دایبنێ.


## Checking against the schema

schema-element-unrecognized = توخمی `<{ $tag }>` توخمێکی ناسراوی Doenet نییە.

schema-element-not-allowed-at-root = توخمی `<{ $tag }>` لە ڕەگی دۆکیومێنتدا ڕێگەپێدراو نییە.

schema-element-not-allowed-inside = توخمی `<{ $tag }>` لە ناو `<{ $parent }>` دا ڕێگەپێدراو نییە.

schema-attribute-unrecognized = توخمی `<{ $tag }>` تایبەتمەندییەکی بەناوی `{ $attribute }` ی نییە.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] تایبەتمەندی `{ $attribute }` ی توخمی `<{ $tag }>` دەبێت لیستێک بێت کە هەر بڕگەیەکی یەکێک بێت لەمانە: { $allowed }
       *[other] تایبەتمەندی `{ $attribute }` ی توخمی `<{ $tag }>` دەبێت یەکێک بێت لەمانە: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = ناوی وەشانی نادروست بۆ select. ناوی وەشانی { $variantName } لە { $numOptions } بژاردەدا دێت بەڵام ژمارەی هەڵبژاردن { $numToSelect } ە.

select-variant-name-without-options = هەندێک وەشان بۆ select دیاری کراون بەڵام هیچ بژاردەیەک بۆ ناوی وەشانی گونجاو دیاری نەکراوە: { $variantName }.

select-variant-name-not-possible = ناوی وەشانی { $variantName } کە بۆ select دیاری کراوە، ناوێکی وەشانی گونجاو نییە.

select-too-few-options = ناتوانرێت { $numToSelect } پێکهاتە لە تەنها { $numOptions } دا هەڵبژێردرێت.

select-from-sequence-too-few-values = ناتوانرێت { $numToSelect } نرخ لە زنجیرەیەکی بە درێژی { $length } دا هەڵبژێردرێت.

select-from-sequence-indices-count-mismatch = ژمارەی ئیندێکسە دیاریکراوەکان بۆ select دەبێت لەگەڵ ژمارەی هەڵبژاردن بگونجێت

select-from-sequence-indices-not-integers = هەموو ئیندێکسە دیاریکراوەکان بۆ select دەبێت ژمارەی تەواو بن

select-from-sequence-index-excluded = ئیندێکسێکی دیاریکراوی selectfromsequence کە دەرخرابوو

select-from-sequence-indices-excluded-combination = ئیندێکسە دیاریکراوەکانی selectfromsequence کە کۆمەڵەیەکی دەرخراو بوون

select-from-sequence-coprime-not-positive-integers = ناتوانرێت کۆمەڵەی coprime هەڵبژێردرێت، چونکە ژمارەی تەواوی ئەرێنی هەڵنابژێردرێت.

select-from-sequence-coprime-common-factor = ناتوانرێت ژمارەی coprime هەڵبژێردرێت. هەموو نرخە گونجاوەکان فاکتەرێکی هاوبەشیان هەیە. (نرخە دیاریکراوەکانی "from" یان "to" دەبێت لەگەڵ "step" دا coprime بن.)

select-from-sequence-coprime-single-number = ناتوانرێت کۆمەڵەی coprime لە یەک ژمارەدا هەڵبژێردرێت کە 1 نییە.

select-from-sequence-excluded-too-many-combinations = زیاتر لە 70% ی کۆمەڵەکان لە selectFromSequence دا دەرخران

select-from-sequence-coprime-none-found = نەتوانرا ژمارەی coprime هەڵبژێردرێت. هەموو نرخە گونجاوەکان فاکتەرێکی هاوبەشیان هەیە.

select-from-sequence-too-few-unique-values = ناتوانرێت { $numToSelect } نرخی بێهاوتا لە زنجیرەیەکی بە درێژی { $numPossibleValues } دا هەڵبژێردرێت

select-prime-numbers-too-few-values = ناتوانرێت { $numToSelect } نرخ لە لیستێکی ژمارە سەرەتاییەکان بە درێژی { $numValues } دا هەڵبژێردرێت

select-prime-numbers-values-count-mismatch = ژمارەی نرخە دیاریکراوەکان بۆ select دەبێت لەگەڵ ژمارەی هەڵبژاردن بگونجێت

select-prime-numbers-values-not-prime = هەموو نرخە دیاریکراوەکان بۆ هەڵبژاردنی ژمارەی سەرەتایی دەبێت لە لیستی ژمارە سەرەتاییەکاندا بن

select-prime-numbers-values-excluded-combination = نرخە دیاریکراوەکانی selectPrimeNumbers کۆمەڵەیەکی دەرخراو بوون

select-prime-numbers-excluded-too-many-combinations = زیاتر لە 70% ی کۆمەڵەکان لە selectPrimeNumbers دا دەرخران

select-random-combination-fluke = بە ڕێکەوتێکی زۆر دوور، نەتوانرا کۆمەڵەیەکی نرخی هەڕەمەکی هەڵبژێردرێت

select-random-value-fluke = بە ڕێکەوتێکی زۆر دوور، نەتوانرا نرخێکی هەڕەمەکی هەڵبژێردرێت
