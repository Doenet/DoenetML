# Sindhi warnings and errors. Translated from `locales/en/diagnostics.ftl`,
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
# Sindhi separates with «،». Brackets, quotes and the full stop are the same
# characters as in English and are written opening-first, in logical order; the
# bidi algorithm turns them around when the text is drawn.
#
# Sindhi is postpositional, so a message that in English reads "for
# `<{ $component }>`" puts its relator after the argument rather than in front
# of it, and several sentences are turned around for that reason alone.
#
# Where English distinguishes a singular from a plural only in the verb — "is
# ignored" against "are ignored" — Sindhi says one thing, and the select is
# dropped rather than written out twice identically. The count argument then
# goes unused, which is harmless: it stays in the English message for the
# languages that need it.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = جڏهن ٻه پڇاڙي وارا نقطا مقرر هجن ته { $attributes } نظرانداز ڪيو وڃي ٿو

line-segment-attributes-ignored-with-endpoint-and-midpoint = جڏهن هڪ پڇاڙي وارو نقطو ۽ هڪ وچيون نقطو ٻئي مقرر هجن ته { $attributes } نظرانداز ڪيو وڃي ٿو

line-segment-midpoint-offset-without-midpoint = وچئين نقطي بغير midpointOffset جو ڪو اثر ناهي

## `<line>`

line-points-undetermined-dimensions = اهڙن نقطن مان لنگهندڙ ليڪ جن جا طول اڻ ڄاڻ آهن.

line-points-too-few-dimensions = ليڪ کي گهٽ ۾ گهٽ ٻن طولن وارن نقطن مان لنگهڻ گهرجي.

line-points-depend-on-variables = ليڪ اهڙن نقطن مان لنگهي ٿي جيڪي متغيرن تي دارومدار رکن ٿا: { $variables }.

line-equation-invalid-format = متغيرن { $variable1 } ۽ { $variable2 } ۾ ليڪ جي مساوات جي صورت ناجائز آهي.

## `<ray>`

ray-overprescribed-through = ڪرڻو through، endpoint ۽ direction سان مقرر ٿيل آهي. مقرر ڪيل through نظرانداز ڪيو پيو وڃي.

ray-dimension-mismatch = ڪرڻي ۾ numDimensions ٺهڪي نٿو اچي.

## `<vector>`

vector-overprescribed-head = ویڪٽر head، tail ۽ displacement سان مقرر ٿيل آهي. مقرر ڪيل head نظرانداز ڪيو پيو وڃي.

vector-dimension-mismatch = ویڪٽر ۾ numDimensions ٺهڪي نٿو اچي.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ڏانهن ڇڪيو نٿو وڃي ڇو ته وٽس nearestPoint نالي حالت وارو متغير ناهي.

constrain-to-without-nearest-point = `<{ $component }>` تائين محدود نٿو ڪري سگهجي ڇو ته وٽس nearestPoint نالي حالت وارو متغير ناهي.

constrain-to-interior-without-nearest-point = `<{ $component }>` جي اندر تائين محدود نٿو ڪري سگهجي ڇو ته وٽس nearestPoint نالي حالت وارو متغير ناهي.

## `<choiceInput>`

choice-input-label-position-ignored = غير سٽ واري choiceInput ۾ labelPosition نظرانداز ڪيو وڃي ٿو

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput ۾ مقرر ڪيل indices نظرانداز ڪيا پيا وڃن ڇو ته اشارن جو تعداد choice قسم جي ٻارن جي تعداد سان نٿو ملي.

pretzel-indices-count-mismatch = problem ۾ مقرر ڪيل indices نظرانداز ڪيا پيا وڃن ڇو ته اشارن جو تعداد problem قسم جي ٻارن جي تعداد سان نٿو ملي.

shuffle-indices-count-mismatch = shuffle ۾ مقرر ڪيل indices نظرانداز ڪيا پيا وڃن ڇو ته اشارن جو تعداد جزن جي تعداد سان نٿو ملي.

indices-ignored-out-of-range = { $component } ۾ مقرر ڪيل indices نظرانداز ڪيا پيا وڃن ڇو ته ڪجهه اشارا حد کان ٻاهر آهن.

pretzel-indices-repeated = pretzel ۾ مقرر ڪيل indices نظرانداز ڪيا پيا وڃن ڇو ته ڪجهه اشارا ورجايل آهن.

pretzel-circuit-first-index = circuit حالت ۾ pretzel جا مقرر ڪيل indices نظرانداز ڪيا پيا وڃن ڇو ته پهريون اشارو 1 هجڻ گهرجي.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` کي متني ٻارن سان هلائڻ لاءِ type خاصيت مقرر ڪرڻ ضروري آهي.

invalid-type-defaulting-to-math = جزي { $component } لاءِ قسم { $type } ناجائز آهي. اهو math، text، number يا boolean مان هڪ هجڻ گهرجي. math استعمال ٿي رهيو آهي.

string-not-valid-component-to-arrange = متن "{ $value }" اهڙو جائز جزو ناهي جنهن کي { $component } ترتيب ڏئي سگهي. ان کي نظرانداز ڪيو پيو وڃي.

## Types and variables

invalid-type-defaulting-to-number = قسم { $type } ناجائز آهي، قسم number مقرر ڪيو پيو وڃي.

invalid-variable-value = ڪنهن متغير جو ناجائز قدر: `{ $value }`

## Variants

variant-index-must-be-number = نسخي جو اشارو { $index } انگ هجڻ گهرجي

variant-index-must-be-integer = نسخي جو اشارو { $index } صحيح عدد هجڻ گهرجي

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` مطلق ماپن لاءِ نافذ ناهي. ويڪرون نسبتي مقرر ڪيون پيون وڃن.

side-by-side-absolute-margins = `<{ $component }>` مطلق ماپن لاءِ نافذ ناهي. حاشيا نسبتي مقرر ڪيا پيا وڃن.

side-by-side-no-block-child = `<{ $component }>` ناجائز آهي: ان ۾ گهٽ ۾ گهٽ هڪ بلاڪ ٻار هجڻ گهرجي.

## `<label>`

label-for-ignored-on-graphical = گرافڪ واري `<label>` تي `for` خاصيت نظرانداز ڪئي وڃي ٿي.

label-for-must-resolve-to-one = `<label>` تي `for` خاصيت کي بلڪل هڪ جزي ڏانهن اشارو ڪرڻ گهرجي.

label-for-unresolved = `<label>` تي `for` خاصيت ڪنهن به جزي تائين نه پهتي.

label-for-answer-with-authored-inputs = `<label>` تي `for` خاصيت اهڙي `<answer>` ڏانهن اشارو ڪري ٿي جنهن جون داخلائون چٽيءَ طرح لکيل آهن؛ سڌو داخلا ڏانهن اشارو ڪريو.

label-for-answer-without-input = `<label>` تي `for` خاصيت اهڙي `<answer>` ڏانهن اشارو ڪري ٿي جنهن وٽ نالو ڏيڻ لاءِ ڪا داخلا ناهي.

label-for-must-reference-input-or-answer = `<label>` تي `for` خاصيت کي ڪنهن داخلا يا ڪنهن `<answer>` ڏانهن اشارو ڪرڻ گهرجي.

## Accessibility

accessibility-short-description-or-decorative = رسائي جي خاطر `<{ $component }>` وٽ يا ته مختصر تفصيل هجڻ گهرجي يا ان کي سينگار وارو مقرر ڪيو وڃي.

accessibility-video-short-description = رسائي جي خاطر `<video>` وٽ مختصر تفصيل هجڻ گهرجي.

accessibility-input-short-description-or-label = رسائي جي خاطر `<{ $component }>` وٽ مختصر تفصيل يا نالو هجڻ گهرجي.

accessibility-answer-input-short-description-or-label = رسائي جي خاطر داخلا ٺاهيندڙ `<answer>` وٽ مختصر تفصيل يا نالو هجڻ گهرجي.

accessibility-short-description-contains-math = مختصر تفصيلن ۾ `<{ $component }>` جهڙا رياضياتي جزا نه هجڻ گهرجن. رياضي کي لفظن ۾ لکو.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] باب جي عنوان جي متن لاءِ { $colorName } جو فرق ڪافي ناهي (اونداهي حالت) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ گهٽ ۾ گهٽ { $threshold }:1 گهربل آهي).
       *[other] باب جي عنوان جي متن لاءِ { $colorName } جو فرق ڪافي ناهي ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ گهٽ ۾ گهٽ { $threshold }:1 گهربل آهي).
    }

## `<circle>`

circle-through-points-non-numerical = جڏهن نقطن وٽ عددي قدر نه هجن ته { $count } نقطن مان لنگهندڙ `<circle>` نافذ ناهي.

circle-too-many-through-points = 3 کان وڌيڪ نقطن مان لنگهندڙ دائرو ڳڻي نٿو سگهجي.

circle-overprescribed-radius-center-points = مقرر ٿيل نصف قطر، مرڪز ۽ لنگهندڙ نقطن سان دائرو ڳڻي نٿو سگهجي.

circle-center-with-multiple-points = مقرر ٿيل مرڪز سان هڪ کان وڌيڪ نقطي مان لنگهندڙ دائرو ڳڻي نٿو سگهجي.

circle-radius-too-small = دائرو ڳڻي نٿو سگهجي: جيئن ته ٻن نقطن جي وچ ۾ فاصلو { $distance } آهي، ان ڪري مقرر ٿيل نصف قطر { $radius } تمام ننڍو آهي.

circle-radius-with-many-points = مقرر ٿيل نصف قطر سان ٻن کان وڌيڪ نقطن مان لنگهندڙ دائرو ٺاهي نٿو سگهجي.

circle-invalid-center-or-through-points = دائري جو مرڪز يا ان جا لنگهندڙ نقطا ناجائز آهن.

circle-radius-center-with-multiple-points = مقرر ٿيل مرڪز سان هڪ کان وڌيڪ نقطي مان لنگهندڙ دائري جو نصف قطر ڳڻي نٿو سگهجي.

circle-change-radius-non-numerical = غير عددي نقطن مان لنگهندڙ دائري جو نصف قطر تبديل نٿو ڪري سگهجي

circle-radius-with-points-non-numerical = جڏهن عددي قدر موجود نه هجن ته مقرر ٿيل نصف قطر سان هڪ کان وڌيڪ نقطي مان لنگهندڙ دائرو ٺاهي نٿو سگهجي.

circle-change-center-non-numerical = غير عددي نقطن مان لنگهندڙ دائري جو مرڪز بدلائڻ نافذ ناهي.

## `<function>`

function-domain-insufficient-dimensions = فنڪشن جي دائري لاءِ طول ڪافي ناهن. دائري ۾ { $intervals } وقفا آهن پر فنڪشن وٽ { $inputs } داخلائون آهن.

function-domain-invalid-format = فنڪشن جي دائري جي صورت ناجائز آهي.

function-ignoring-non-numerical =
    { $type ->
        [maximum] فنڪشن جو غير عددي وڏي ۾ وڏو قدر نظرانداز ڪيو پيو وڃي.
        [minimum] فنڪشن جو غير عددي ننڍي ۾ ننڍو قدر نظرانداز ڪيو پيو وڃي.
        [extremum] فنڪشن جو غير عددي انتهائي قدر نظرانداز ڪيو پيو وڃي.
        [point] فنڪشن جو غير عددي نقطو نظرانداز ڪيو پيو وڃي.
        [slope] فنڪشن جو غير عددي لاڙو نظرانداز ڪيو پيو وڃي.
       *[other] فنڪشن جو غير عددي { $type } نظرانداز ڪيو پيو وڃي.
    }

function-ignoring-empty =
    { $type ->
        [maximum] فنڪشن جو خالي وڏي ۾ وڏو قدر نظرانداز ڪيو پيو وڃي.
        [minimum] فنڪشن جو خالي ننڍي ۾ ننڍو قدر نظرانداز ڪيو پيو وڃي.
        [extremum] فنڪشن جو خالي انتهائي قدر نظرانداز ڪيو پيو وڃي.
        [point] فنڪشن جو خالي نقطو نظرانداز ڪيو پيو وڃي.
       *[other] فنڪشن جو خالي { $type } نظرانداز ڪيو پيو وڃي.
    }

function-points-too-close = فنڪشن ۾ ٻه اهڙا نقطا آهن جن جا هنڌ تمام ويجها آهن. فنڪشن جي وضاحت نٿي ڪري سگهجي.

function-iterates-input-output-mismatch = فنڪشن جا ورجاءَ تڏهن ئي ممڪن آهن جڏهن داخلائن جو تعداد نتيجن جي تعداد جي برابر هجي. هن فنڪشن وٽ { $inputs } داخلائون ۽ { $outputs } نتيجا آهن.

## `<sequence>`

sequence-invalid-length = سلسلي جي ڊيگهه ناجائز آهي. اها غير منفي صحيح عدد هجڻ گهرجي.

sequence-invalid-step = سلسلي جو قدم ناجائز آهي. { $type } قسم جي سلسلي لاءِ اهو انگ هجڻ گهرجي.

sequence-invalid-endpoint-number = عددي سلسلي جو "{ $attribute }" قدر ناجائز آهي. اهو انگ هجڻ گهرجي.

sequence-invalid-endpoint-letters = اکرن جي سلسلي جو "{ $attribute }" قدر ناجائز آهي. اهو اکرن جو ميلاپ هجڻ گهرجي.

sequence-invalid-endpoint = سلسلي جو "{ $attribute }" قدر ناجائز آهي.

select-from-sequence-coprime-not-numbers = coprime نظرانداز ڪيو ويو ڇو ته چونڊ انگن مان ناهي

select-from-sequence-coprime-with-exclude-combinations = coprime نظرانداز ڪيو ويو ڇو ته excludeCombinations مقرر ٿيل آهي

## Resolving a `target`

target-not-found = `<{ $source }>` ۾ target جو قدر ناجائز آهي: منزل نه ملي.

target-state-variable-not-found = `<{ $source }>` ۾ target جو قدر ناجائز آهي: `<{ $component }>` تي "{ $property }" نالي ڪو حالت وارو متغير نه مليو.

## `<odeSystem>`

# «ساڄي پاسي» is the right-hand side of the equation and stays the right one:
# mathematics is a left-to-right island inside a Sindhi document, so the
# equation the phrase names is drawn the same way round as in English.
ode-system-variables-match-independent = `<odeSystem>` جا متغير آزاد متغير کان مختلف هجڻ گهرجن.

ode-system-duplicate-variable-names = تفاضلي مساوات جي ساڄي پاسي وارا فنڪشن ورجايل تابع متغيرن جي نالن سان وضاحت نٿا ڪري سگهجن.

ode-system-rhs-function-error = تفاضلي مساوات جي ساڄي پاسي وارو فنڪشن وضاحت نٿو ڪري سگهجي. mathjs فنڪشن ٺاهڻ ۾ خرابي.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } ليڪن جي وچ ۾ زاويه جي وضاحت نٿي ڪري سگهجي

angle-invalid-through-point = `<angle>` جي through ۾ ناجائز نقطو

parabola-vertex-too-many-points = مقرر ٿيل چوٽيءَ سان هڪ کان وڌيڪ نقطي مان لنگهندڙ پيرابولا نافذ ناهي.

parabola-too-many-points = 3 کان وڌيڪ نقطن مان لنگهندڙ پيرابولا نافذ ناهي.

intersection-too-many-items = ٻن کان وڌيڪ شين جو تقاطع نافذ ناهي

## Other math components

ionic-compound-not-two-ions = ٻن آئونن کان سواءِ ٻئي ڪنهن به صورت لاءِ آئوني مرڪب نافذ ناهي.

ionic-compound-needs-cation-and-anion = آئوني مرڪب رڳو هڪ ڪيٽائون ۽ هڪ اينائون لاءِ نافذ آهي.

solve-equations-cannot-evaluate = مساوات حل نه ٿي سگهي ڇو ته ان جو قدر نه معلوم ٿي سگهيو: { $equation }

math-operators-operand-number-required = رياضياتي عامل ڪڍڻ وقت operandNumber مقرر ڪرڻ ضروري آهي.

eigen-decomposition-failed = ميٽرڪس جا خاص قدر ڳڻي نه سگهيا

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: پيرا ميٽر { $parameters } نموني ۾ نٿا اچن، ان ڪري اهي هميشه خالي جاءِ سان ٺهڪندا.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" جو مطلب سمجهي نه سگهيو. اهو none، medium، dense هجڻ گهرجي، يا هڪ خالي جاءِ سان جدا ٿيل ٻه مثبت انگ، جيئن grid="1 0.5". ڪا به ڄاري نه ٺاهي ويندي.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure ناظر ۾ xLabelPosition="left" جي مدد ناهي؛ right واري هنڌ جو رويو استعمال ٿي رهيو آهي.

prefigure-y-label-position-unsupported = `<graph>`: prefigure ناظر ۾ yLabelPosition="bottom" جي مدد ناهي؛ top واري هنڌ جو رويو استعمال ٿي رهيو آهي.

prefigure-invalid-axis-bounds = `<graph>`: prefigure ۾ تبديليءَ لاءِ محورن جون حدون ناجائز آهن؛ ڊفالٽ bbox (-10,-10,10,10) استعمال ٿي رهيو آهي.

prefigure-invalid-width = `<graph>`: prefigure ۾ تبديليءَ لاءِ ويڪر ناجائز آهي؛ ڊفالٽ خاڪي جي ويڪر 425 استعمال ٿي رهي آهي.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ۾ تبديليءَ لاءِ aspectRatio ناجائز آهي؛ ڊفالٽ تناسب 1 استعمال ٿي رهيو آهي.

prefigure-grid-spacing-too-fine = `<graph>`: محورن جي حدن جي ڀيٽ ۾ ڄاري جو وٿي تمام سنهو آهي؛ prefigure ناظر ۾ ڄاري ڇڏي وئي آهي.

prefigure-annotations-not-rendered = `<graph>`: جڏهن PreFigure ناظر استعمال نه ٿئي ته حاشيا نه ٺاهيا ويندا.

multiple-annotations-children = `<graph>` جي اندر هڪ کان وڌيڪ `<annotations>` ٻار مليا؛ آخري کانسواءِ سڀ نظرانداز ڪيا پيا وڃن.

## Referring to other components

copy-unrecognized-component-type = اڻ سڃاتل قسم جي جزي کي وڌائي يا نقل ڪري نٿو سگهجي: { $type }.

copy-prop-not-found = { $component } قسم جي جزي تي { $property } خاصيت نه ملي

collect-no-source = collect لاءِ ڪو ذريعو نه مليو.

collect-invalid-component-type = `<{ $component }>` قسم جا جزا گڏ نٿا ڪري سگهجن ڇو ته اهو ناجائز قسم آهي.

reference-index-unavailable = اشاري `{ $reference }` ڏانهن حوالو نٿو ڏئي سگهجي

## `<callAction>`

component-action-unavailable = جزي `{ $reference }` تي { $action } نٿو هلائي سگهجي

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ڊيٽا جي صورت ناجائز آهي. قطارن جون ڊيگهون هڪجهڙيون ناهن. componentIdx :{ $componentIdx } تي مليو

data-frame-duplicate-column-names = ڊيٽا ۾ ڪالمن جا نالا ورجايل آهن. componentIdx :{ $componentIdx } تي مليو

data-frame-missing-column-name = ڊيٽا ۾ هڪ ڪالم جو نالو ناهي. componentIdx :{ $componentIdx } تي مليو

## `<answer>` and scoring

answer-award-depends-on-own-response = هن جواب جو هڪ award پاڻ answer جي موڪليل جواب تي دارومدار رکي ٿو، جنهن سان اڻ ڄاتل رويو پيدا ٿيندو.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` واري ظرف اندر `<answer>` تي `maxNumAttempts` مقرر ڪرڻ جو ڪو اثر ناهي، ڇو ته ڪوششن جو تعداد ظرف طئي ڪري ٿو. ان جي بدران `maxNumAttempts` ظرف تي مقرر ڪريو.

nested-section-wide-check-work-max-num-attempts = اهڙي ظرف تي `maxNumAttempts` مقرر ڪرڻ جو ڪو اثر ناهي جيڪو `sectionWideCheckWork` رکي ٿو ۽ پاڻ ٻئي اهڙي ظرف اندر آهي، ڇو ته ڪوششن جو تعداد ٻاهريون ظرف طئي ڪري ٿو. `maxNumAttempts` ٻاهرين ظرف تي مقرر ڪريو.

answer-attributes-need-symbolic-equality = symbolicEquality مقرر ڪرڻ کانسواءِ { $attributes } خاصيتن جو ڪو اثر نه ٿيندو.

answer-invalid-type = جواب لاءِ ناجائز قسم: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = جيئن ته جزي `<{ $component }>` جو ڪو نالو ناهي، ان کي module جي خاصيت طور استعمال نٿو ڪري سگهجي

module-attribute-name-already-defined = جزو `<{ $component } name="{ $name }">` module جي خاصيت طور استعمال نٿو ڪري سگهجي ڇو ته `<module>` قسم وٽ اڳ ۾ ئي "{ $name }" نالي خاصيت آهي.

conditional-content-condition-ignored = اهڙي `<conditionalContent>` جزي تي `condition` خاصيت نظرانداز ڪئي وڃي ٿي جنهن وٽ case يا else ٻار هجن.

slider-markers-type-mismatch = نشانن جو قسم سلائيڊر جي قسم سان نٿو ملي.

pretzel-problem-needs-statement-and-answer = ناجائز pretzel: هر `<problem>` ۾ هڪ `<statement>` ۽ هڪ `<answer>` هجڻ گهرجي.

pretzel-circuit-first-problem-distractor = ناجائز pretzel: mode="circuit" ۾ پهريون `<problem>` ڌيان ڇڪائيندڙ نٿو ٿي سگهي.

## Attribute values

attribute-invalid-values = خاصيت `{ $attribute }` لاءِ { $values } قدر ناجائز آهن؛ انهن کي نظرانداز ڪيو پيو وڃي.

attribute-must-be-references = خاصيت `{ $attribute }` لاءِ قدر `{ $value }` ناجائز آهي. خاصيت اهڙن حوالن مان ٺهڻ گهرجي جيڪي `$` سان شروع ٿين.

math-input-invalid-function-names = <mathInput>: { $attribute } ۾ ناجائز فنڪشن نالا نظرانداز ڪيا ويا: { $names }. هر نالي جو ڏيکاريل حصو گهٽ ۾ گهٽ ٻن اکرن جو هجڻ گهرجي (اکر يا ڊيش)؛ ان کان پوءِ اختياري لاحقو `|<mathspeak alternative>` اچي سگهي ٿو.

## Building components from the source

component-type-invalid = ناجائز قسم جو جزو: `<{ $componentType }>`

attribute-repeated = خاصيت { $attribute } کي ورجائي نٿو سگهجي.

attribute-invalid-for-component = `<{ $componentType }>` قسم جي جزي لاءِ خاصيت "{ $attribute }" ناجائز آهي.

## Style definition contrast

style-definition-insufficient-contrast =
    انداز جي وضاحت { $styleNumber } ۾ { $context ->
        [text-on-background] متن جي رنگ جو پس منظر جي رنگ جي ڀيٽ ۾
        [high-contrast] وڌيڪ فرق واري رنگ جو تختي جي ڀيٽ ۾
        [line] ليڪ جي رنگ جو تختي جي ڀيٽ ۾
        [marker] نشان جي رنگ جو تختي جي ڀيٽ ۾
       *[text-on-canvas] متن جي رنگ جو تختي جي ڀيٽ ۾
    } فرق ڪافي ناهي{ $mode ->
        [dark] { " (اونداهي حالت)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ گهٽ ۾ گهٽ { $threshold }:1 گهربل آهي).

style-definition-dark-mode-text-background-contrast =
    جيتوڻيڪ انداز جي وضاحت { $styleNumber } اهڙا رنگ مقرر ڪيا آهن جيڪي روشن حالت ۾ ڪافي فرق ڏين ٿا، انهن مان ورتل اونداهي حالت جا رنگ متن ۽ پس منظر جي رنگ جي وچ ۾ ڪافي فرق نٿا ڏين ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ گهٽ ۾ گهٽ { $threshold }:1 گهربل آهي). { $suggestion ->
        [available] اونداهي حالت ۾ ڪافي فرق لاءِ يا ته روشن حالت جو فرق وڌايو (جيئن { $lightAttribute }="{ $lightColor }") يا اونداهي حالت جو رنگ پاڻ مقرر ڪريو (جيئن { $darkAttribute }="{ $darkColor }").
       *[none] اونداهي حالت ۾ ڪافي فرق لاءِ روشن حالت جو فرق وڌايو يا ورتل رنگن کي textColorDarkMode ۽/يا backgroundColorDarkMode سان بدلايو.
    }

style-definition-dark-mode-text-canvas-contrast =
    جيتوڻيڪ انداز جي وضاحت { $styleNumber } اهڙو متن جو رنگ مقرر ڪيو آهي جيڪو روشن حالت ۾ ڪافي فرق ڏئي ٿو، ان مان ورتل اونداهي حالت جو متن جو رنگ تختي جي ڀيٽ ۾ ڪافي فرق نٿو ڏئي ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ گهٽ ۾ گهٽ { $threshold }:1 گهربل آهي). { $suggestion ->
        [available] اونداهي حالت ۾ ڪافي فرق لاءِ يا ته روشن حالت جو فرق وڌايو (جيئن textColor="{ $lightColor }") يا اونداهي حالت جو رنگ پاڻ مقرر ڪريو (جيئن textColorDarkMode="{ $darkColor }").
       *[none] اونداهي حالت ۾ ڪافي فرق لاءِ روشن حالت جو فرق وڌايو يا ورتل رنگ کي textColorDarkMode سان بدلايو.
    }

section-multiple-style-palettes = هڪ باب رڳو هڪ <stylePalette> چونڊي سگهي ٿو؛ آخري استعمال ٿي رهي آهي.

## Unique variants

variant-num-to-select-not-non-negative-integer = جزي { $component } جا منفرد نسخا طئي نٿا ٿي سگهن ڇو ته numToSelect غير منفي صحيح عدد ناهي.

variant-num-to-select-not-constant-number = جزي { $component } جا منفرد نسخا طئي نٿا ٿي سگهن ڇو ته numToSelect ثابت انگ ناهي.

variant-with-replacement-not-constant-boolean = جزي { $component } جا منفرد نسخا طئي نٿا ٿي سگهن ڇو ته withReplacement ثابت منطقي قدر ناهي.

variant-select-weight-disables-unique = جيڪڏهن ڪنهن اختيار تي selectWeight يا selectForVariants مقرر هجي ته select جا منفرد نسخا بند ٿي وڃن ٿا

variant-coprime-undetermined = جزي { $component } جا منفرد نسخا طئي نٿا ٿي سگهن ڇو ته اهو طئي نه ٿي سگهيو ته coprime هميشه غلط آهي.

variant-attribute-not-constant = جزي { $component } جا منفرد نسخا طئي نٿا ٿي سگهن ڇو ته { $attribute } ثابت ناهي.

variant-attribute-not-number = جزي { $component } جا منفرد نسخا طئي نٿا ٿي سگهن ڇو ته { $attribute } انگ ناهي.

variant-attribute-wrong-type-for-sequence =
    { $type } قسم جي جزي { $component } جا منفرد نسخا طئي نٿا ٿي سگهن ڇو ته { $attribute } { $expected ->
        [letters-combination] اکرن جو ميلاپ
        [math-expression] جائز رياضياتي جملو
        [integer] صحيح عدد
       *[number] انگ
    } ناهي.

variant-length-not-integer = جزي { $component } جا منفرد نسخا طئي نٿا ٿي سگهن ڇو ته length صحيح عدد ناهي.

variant-sort-not-implemented = sort سان { $component } جا منفرد نسخا نافذ ناهن

variant-exclude-combinations-not-implemented = excludeCombinations سان { $component } جا منفرد نسخا نافذ ناهن

variant-math-exclude-not-implemented = exclude سان math قسم جي { $component } جا منفرد نسخا نافذ ناهن

variant-non-constant-exclude-not-implemented = غير ثابت exclude سان { $component } جا منفرد نسخا نافذ ناهن

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: خاڪي جي prefigure ناظر ۾ مدد ناهي؛ تابع عنصر ڇڏي ڏنو ويو.

prefigure-descendant-invalid-geometry = { $subject }: اڻ پوري يا اڻ مڪمل جاميٽري؛ تابع عنصر ڇڏي ڏنو ويو.

prefigure-curve-label-omitted = { $subject }: تبديل ٿيل منحني عنصرن تي نالن جي مدد ناهي؛ نالو ڇڏي ڏنو ويو.

prefigure-curve-unsupported-definition-type = { $subject }: منحني فنڪشن جي وضاحت جو قسم '{ $definitionType }' مدد ۾ ناهي؛ تابع عنصر ڇڏي ڏنو ويو.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves تي flipFunctions خاصيت جي مدد ناهي؛ تابع عنصر ڇڏي ڏنو ويو.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves تي رڳو فارمولي سان طئي ٿيل ٻار فنڪشنن جي مدد آهي؛ تابع عنصر ڇڏي ڏنو ويو.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] ليڪ خاندان جي نالي
       *[point] نقطي جي نالي
    } لاءِ labelPosition '{ $labelPosition }' جي مدد ناهي؛ PreFigure جي ڊفالٽ ترتيب استعمال ٿي.

prefigure-fill-style-unsupported = { $subject }: ڀراءَ جو انداز '{ $fillStyle }' PreFigure ۾ مدد ۾ ناهي؛ هڪجهڙو ڀراءُ استعمال ٿي رهيو آهي.

prefigure-line-style-unknown = { $subject }: ليڪ جو انداز '{ $lineStyle }' اڻ ڄاتل آهي ۽ PreFigure جي نتيجي مان ڪڍيو ويو.

prefigure-marker-style-mapped-to-diamond = { $subject }: نشان جو انداز '{ $markerStyle }' PreFigure جي 'diamond' انداز ڏانهن بدلايو ويو.

prefigure-marker-style-unsupported = { $subject }: نشان جو انداز '{ $markerStyle }' PreFigure ۾ مدد ۾ ناهي؛ ڊفالٽ انداز استعمال ٿيو.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ناجائز آهي؛ منزل طئي نه ٿي سگهي. حاشيو ڇڏي ڏنو ويو.

annotation-ref-multiple-targets = `<annotation>`: `ref` هڪ کان وڌيڪ منزلن تائين پهتو؛ پهرين منزل استعمال ٿي رهي آهي.

annotation-ref-outside-graph = `<annotation>`: `ref` ناجائز آهي؛ منزل پنهنجي خاڪي کان ٻاهر آهي. حاشيو ڇڏي ڏنو ويو.

annotation-ref-unsupported-target = `<annotation>`: `ref` ناجائز آهي؛ منزل prefigure ۾ تبديليءَ لاءِ مدد ٿيل گرافڪ شيءِ ناهي. حاشيو ڇڏي ڏنو ويو.

annotation-text-missing = `<annotation>`: `text` غائب يا خالي آهي؛ خالي متن ڏنو پيو وڃي.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] گول دارومدار مليو.
       *[other] `<{ $componentType }>` جزي تي مشتمل گول دارومدار مليو.
    }

reference-no-referent = حوالي لاءِ ڪو مرجع نه مليو: `{ $reference }`

reference-multiple-referents = حوالي لاءِ هڪ کان وڌيڪ مرجع مليا: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` جي { $attribute } خاصيت جي صورت ناجائز آهي.

children-invalid = `<{ $componentType }>` لاءِ ناجائز ٻار: ناجائز ٻار مليا: { $children }

## Falling back to a default

attribute-value-invalid-using-default = خاصيت `{ $attribute }` لاءِ قدر `{ $value }` ناجائز آهي، قدر `{ $default }` استعمال ٿي رهيو آهي

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML جو نسخو { $version } نه مليو.
       *[other] DoenetML جو نسخو { $version } نه مليو. نسخو { $fallback } استعمال ٿي رهيو آهي
    }

## Reading the DoenetML

parse-invalid-doenetml = ناجائز DoenetML: { $content }

parse-tag-missing-close-tag = ناجائز DoenetML: ٽيگ `{ $tag }` جو بند ٿيندڙ ٽيگ ناهي. پاڻ بند ٿيندڙ ٽيگ يا `</{ $tagName }>` ٽيگ جي اميد هئي.

parse-tag-error = ناجائز DoenetML: ٽيگ `<{ $tagName }>` ۾ خرابي

parse-attribute-missing-value = ناجائز DoenetML: لڳي ٿو ناجائز خاصيت `{ $attribute }` جو قدر غائب آهي.

parse-attribute-invalid = ناجائز DoenetML: خاصيت `{ $attribute }` ناجائز آهي

parse-attribute-value-invalid = ناجائز DoenetML: خاصيت جو قدر `{ $value }` ناجائز آهي

parse-attribute-value-quote-mismatch = ناجائز DoenetML: خاصيت جو قدر `{ $value }` ناجائز آهي. اقتباسي نشان ٺهڪي نٿا اچن. لڳي ٿو هڪ `{ $quote }` غائب آهي

parse-open-tag-name-missing = ناجائز DoenetML: بغير نالي وارو ٽيگ مليو، جيئن `<`

parse-tag-not-closed = ناجائز DoenetML: ٽيگ `{ $tag }` بند نه ٿيو (لڳي ٿو `>` غائب آهي).

parse-self-closing-tag-name-missing = ناجائز DoenetML: بغير نالي وارو ٽيگ مليو `<{ $content }>`

parse-self-closing-tag-not-closed = ناجائز DoenetML: ٽيگ `{ $tag }` بند نه ٿيو (لڳي ٿو `/>` غائب آهي).

parse-tag-invalid-attributes = ناجائز DoenetML: ٽيگ `{ $tag }` جائز ناهي. ٿي سگهي ٿو ان جون خاصيتون غلط هجن.

parse-close-tag-name-missing = ناجائز DoenetML: بغير نالي وارو بند ٿيندڙ ٽيگ مليو، جيئن `</`

parse-attribute-value-unquoted = خاصيتن جا قدر اقتباسي نشانن اندر هجڻ گهرجن: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = ناجائز DoenetML: بند ٿيندڙ ٽيگ `{ $tag }` مليو، پر ان جو ڪو کلندڙ ٽيگ ناهي

parse-close-tag-mismatched = ناجائز DoenetML: بند ٿيندڙ ٽيگ ٺهڪي نٿو اچي. `</{ $expected }>` جي اميد هئي. `{ $found }` مليو

parser-node-unconvertible = ڳنڍ { $node } کي Dast ڳنڍ ۾ تبديل نه ڪري سگهيو.

## Names

name-attribute-invalid =
    خاصيت name='{ $name }' ناجائز آهي. { $reason ->
        [characters] نالن ۾ رڳو اکر، انگ، هيٺيون ليڪون يا ڊيش ٿي سگهن ٿا.
       *[start] نالا اکر سان شروع ٿيڻ گهرجن.
    }

component-name-invalid-start = جزي جو نالو "{ $name }" ناجائز آهي. نالا اکر سان شروع ٿيڻ گهرجن.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched قسم جي جواب وٽ video خاصيت هجڻ گهرجي

answer-video-watched-video-not-reference = videoWatched قسم جي جواب جي video خاصيت هڪ حوالو هجڻ گهرجي

answer-name-not-single-text = جواب جي name خاصيت ۾ هڪ متني ٻار هجڻ گهرجي

## Referencing another document

external-doenetml-recursion-limit = تمام گهڻن ورجاون سبب ٻاهريون DoenetML حاصل نه ٿي سگهيو. ڇا ڪو گول حوالو آهي؟

external-doenetml-unavailable = { $attribute }="{ $uri }" مان DoenetML حاصل نه ٿي سگهيو

external-doenetml-type-mismatch = { $attribute }="{ $uri }" مان حاصل ڪيل DoenetML ناجائز آهي: اهو "{ $componentType }" قسم سان نٿو ملي

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] خاصيت `{ $from }` متروڪ آهي؛ ان جي بدران `{ $to }` استعمال ڪريو.
       *[other] [deprecation] `<{ $component }>` تي خاصيت `{ $from }` متروڪ آهي؛ ان جي بدران `{ $to }` استعمال ڪريو.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] خاصيت `{ $from }` متروڪ آهي ۽ نظرانداز ڪئي وئي ڇو ته `{ $to }` پڻ مقرر آهي.
       *[other] [deprecation] `<{ $component }>` تي خاصيت `{ $from }` متروڪ آهي ۽ نظرانداز ڪئي وئي ڇو ته `{ $to }` پڻ مقرر آهي.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` تي خاصيت `{ $attribute }` متروڪ آهي ۽ نظرانداز ڪئي وئي.


## Language coverage

pluralize-english-only = `<pluralize>` رڳو انگريزي لفظن جو جمع ٺاهي سگهي ٿو، ان ڪري { $locale } ٻوليءَ ۾ لکيل دستاويز ۾ ان جو متن جيئن جو تيئن رهي ٿو. جمع جي صورت سڌو لکو، يا ان کي `pluralForm` خاصيت سان مقرر ڪريو.


## Checking against the schema

schema-element-unrecognized = عنصر `<{ $tag }>` Doenet جو سڃاتل عنصر ناهي.

schema-element-not-allowed-at-root = عنصر `<{ $tag }>` دستاويز جي پاڙ ۾ جائز ناهي.

schema-element-not-allowed-inside = عنصر `<{ $tag }>` `<{ $parent }>` جي اندر جائز ناهي.

schema-attribute-unrecognized = عنصر `<{ $tag }>` وٽ `{ $attribute }` نالي ڪا خاصيت ناهي.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] عنصر `<{ $tag }>` جي خاصيت `{ $attribute }` اهڙي فهرست هجڻ گهرجي جنهن جو هر عنصر هنن مان هڪ هجي: { $allowed }
       *[other] عنصر `<{ $tag }>` جي خاصيت `{ $attribute }` هنن مان هڪ هجڻ گهرجي: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select لاءِ ناجائز نسخي جو نالو. نسخي جو نالو { $variantName } { $numOptions } اختيارن ۾ اچي ٿو پر چونڊڻ جو تعداد { $numToSelect } آهي.

select-variant-name-without-options = select لاءِ ڪجهه نسخا مقرر آهن پر ممڪن نسخي جي نالي لاءِ ڪو اختيار مقرر ناهي: { $variantName }.

select-variant-name-not-possible = select لاءِ مقرر ڪيل نسخي جو نالو { $variantName } ڪو ممڪن نالو ناهي.

select-too-few-options = رڳو { $numOptions } مان { $numToSelect } جزا چونڊي نٿا سگهجن.

select-from-sequence-too-few-values = { $length } ڊگهي سلسلي مان { $numToSelect } قدر چونڊي نٿا سگهجن.

select-from-sequence-indices-count-mismatch = select لاءِ مقرر ڪيل اشارن جو تعداد چونڊڻ جي تعداد سان ملڻ گهرجي

select-from-sequence-indices-not-integers = select لاءِ مقرر ڪيل سڀ اشارا صحيح عدد هجڻ گهرجن

select-from-sequence-index-excluded = selectfromsequence جو مقرر ڪيل اشارو ڪڍيل هو

select-from-sequence-indices-excluded-combination = selectfromsequence جا مقرر ڪيل اشارا هڪ ڪڍيل ميلاپ هو

select-from-sequence-coprime-not-positive-integers = پاڻ ۾ اول ميلاپ چونڊي نٿا سگهجن ڇو ته چونڊ مثبت صحيح عددن مان ناهي.

select-from-sequence-coprime-common-factor = پاڻ ۾ اول انگ چونڊي نٿا سگهجن. سڀ ممڪن قدر هڪ گڏيل عامل رکن ٿا. ("from" يا "to" جو مقرر ڪيل قدر "step" سان اول هجڻ گهرجي.)

select-from-sequence-coprime-single-number = اهڙي هڪ انگ مان جيڪو 1 نه هجي، پاڻ ۾ اول ميلاپ چونڊي نٿا سگهجن.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ۾ 70% کان وڌيڪ ميلاپ ڪڍيا ويا

select-from-sequence-coprime-none-found = پاڻ ۾ اول انگ چونڊي نه سگهيا. سڀ ممڪن قدر هڪ گڏيل عامل رکن ٿا.

select-from-sequence-too-few-unique-values = { $numPossibleValues } ڊگهي سلسلي مان { $numToSelect } منفرد قدر چونڊي نٿا سگهجن

select-prime-numbers-too-few-values = { $numValues } ڊگهي اول انگن جي فهرست مان { $numToSelect } قدر چونڊي نٿا سگهجن

select-prime-numbers-values-count-mismatch = select لاءِ مقرر ڪيل قدرن جو تعداد چونڊڻ جي تعداد سان ملڻ گهرجي

select-prime-numbers-values-not-prime = select prime number لاءِ مقرر ڪيل سڀ قدر اول انگن جي فهرست ۾ هجڻ گهرجن

select-prime-numbers-values-excluded-combination = selectPrimeNumbers جا مقرر ڪيل قدر هڪ ڪڍيل ميلاپ هو

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ۾ 70% کان وڌيڪ ميلاپ ڪڍيا ويا

select-random-combination-fluke = تمام گهٽ ممڪن اتفاق سبب، بي ترتيب قدرن جو ميلاپ چونڊجي نه سگهيو

select-random-value-fluke = تمام گهٽ ممڪن اتفاق سبب، بي ترتيب قدر چونڊجي نه سگهيو
