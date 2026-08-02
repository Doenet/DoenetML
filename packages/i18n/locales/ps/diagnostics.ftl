# Pashto warnings and errors. Translated from `locales/en/diagnostics.ftl`,
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
# Pashto ends a sentence with «۔» and separates with «،». Brackets, quotes and
# the colon are the same characters as in English and are written
# opening-first, in logical order; the bidi algorithm turns them around when
# the text is drawn.
#
# Pashto is postpositional, and its «د … لپاره» wraps what it governs, so a
# message that in English reads "for `<{ $component }>`" is turned around here
# rather than translated in place.
#
# Where English distinguishes a singular from a plural only in the verb — "is
# ignored" against "are ignored" — Pashto says one thing, and the select is
# dropped rather than written out twice identically. The count argument then
# goes unused, which is harmless: it stays in the English message for the
# languages that need it.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = کله چې دوه پای ټکي وټاکل شي، { $attributes } نظر نه کیږي

line-segment-attributes-ignored-with-endpoint-and-midpoint = کله چې یو پای ټکی او یو منځنی ټکی دواړه وټاکل شي، { $attributes } نظر نه کیږي

line-segment-midpoint-offset-without-midpoint = د منځني ټکي پرته midpointOffset هېڅ اغېز نه لري

## `<line>`

line-points-undetermined-dimensions = هغه کرښه چې له نامعلومو ابعادو لرونکو ټکو تېریږي۔

line-points-too-few-dimensions = کرښه باید لږ تر لږه دوه ابعاد لرونکو ټکو څخه تېره شي۔

line-points-depend-on-variables = کرښه له هغو ټکو تېریږي چې پر متغیرونو ولاړ دي: { $variables }۔

line-equation-invalid-format = د { $variable1 } او { $variable2 } متغیرونو په کرښه معادله کې ناسمه بڼه۔

## `<ray>`

ray-overprescribed-through = وړانګه د through، endpoint او direction له لارې ټاکل شوې۔ ټاکل شوی through نظر نه کیږي۔

ray-dimension-mismatch = په وړانګه کې د numDimensions ناسمښت۔

## `<vector>`

vector-overprescribed-head = ویکتور د head، tail او displacement له لارې ټاکل شوی۔ ټاکل شوی head نظر نه کیږي۔

vector-dimension-mismatch = په ویکتور کې د numDimensions ناسمښت۔

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ته جذب نه شي کېدای ځکه چې د nearestPoint حالت متغیر نه لري۔

constrain-to-without-nearest-point = `<{ $component }>` ته محدودول نه شي کېدای ځکه چې د nearestPoint حالت متغیر نه لري۔

constrain-to-interior-without-nearest-point = د `<{ $component }>` دننه محدودول نه شي کېدای ځکه چې د nearestPoint حالت متغیر نه لري۔

## `<choiceInput>`

choice-input-label-position-ignored = په غیر کرښه‌ییز choiceInput کې labelPosition نظر نه کیږي

## Ordering children by index

choice-input-indices-count-mismatch = په choiceInput کې ټاکل شوي indices نظر نه کیږي ځکه چې د شاخصونو شمېر د choice ماشومانو له شمېر سره نه خوري۔

pretzel-indices-count-mismatch = په problem کې ټاکل شوي indices نظر نه کیږي ځکه چې د شاخصونو شمېر د problem ماشومانو له شمېر سره نه خوري۔

shuffle-indices-count-mismatch = په shuffle کې ټاکل شوي indices نظر نه کیږي ځکه چې د شاخصونو شمېر د برخو له شمېر سره نه خوري۔

indices-ignored-out-of-range = په { $component } کې ټاکل شوي indices نظر نه کیږي ځکه چې ځینې شاخصونه له حده وتلي دي۔

pretzel-indices-repeated = په pretzel کې ټاکل شوي indices نظر نه کیږي ځکه چې ځینې شاخصونه تکرار شوي دي۔

pretzel-circuit-first-index = په circuit حالت کې د pretzel ټاکل شوي indices نظر نه کیږي ځکه چې لومړی شاخص باید 1 وي۔

## `<shuffle>` and `<sort>`

string-children-need-type = د دې لپاره چې `<{ $component }>` له متني ماشومانو سره کار وکړي، باید د type ځانګړنه وټاکل شي۔

invalid-type-defaulting-to-math = د { $component } برخې لپاره { $type } ډول ناسم دی۔ باید له math، text، number یا boolean څخه یو وي۔ math کارول کیږي۔

string-not-valid-component-to-arrange = متن "{ $value }" داسې سمه برخه نه ده چې { $component } یې تنظیم کړي۔ نظر نه کیږي۔

## Types and variables

invalid-type-defaulting-to-number = { $type } ډول ناسم دی، ډول number ټاکل کیږي۔

invalid-variable-value = د یوه متغیر ناسم ارزښت: `{ $value }`

## Variants

variant-index-must-be-number = د بڼې شاخص { $index } باید شمېره وي

variant-index-must-be-integer = د بڼې شاخص { $index } باید بشپړه شمېره وي

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` د مطلقو اندازو لپاره نه دی چمتو شوی۔ پلنوالي نسبي ټاکل کیږي۔

side-by-side-absolute-margins = `<{ $component }>` د مطلقو اندازو لپاره نه دی چمتو شوی۔ څنډې نسبي ټاکل کیږي۔

side-by-side-no-block-child = `<{ $component }>` ناسم دی: باید لږ تر لږه یو بلاک ماشوم ولري۔

## `<label>`

label-for-ignored-on-graphical = پر ګرافیکي `<label>` باندې د `for` ځانګړنه نظر نه کیږي۔

label-for-must-resolve-to-one = پر `<label>` باندې د `for` ځانګړنه باید سمه یوې برخې ته اشاره وکړي۔

label-for-unresolved = پر `<label>` باندې د `for` ځانګړنه هېڅ برخې ته ونه رسېده۔

label-for-answer-with-authored-inputs = پر `<label>` باندې د `for` ځانګړنه داسې `<answer>` ته اشاره کوي چې ننوتنې یې څرګندې لیکل شوې؛ مستقیم ننوتنې ته اشاره وکړئ۔

label-for-answer-without-input = پر `<label>` باندې د `for` ځانګړنه داسې `<answer>` ته اشاره کوي چې د نومولو لپاره ننوتنه نه لري۔

label-for-must-reference-input-or-answer = پر `<label>` باندې د `for` ځانګړنه باید یوې ننوتنې یا یوه `<answer>` ته اشاره وکړي۔

## Accessibility

accessibility-short-description-or-decorative = د لاسرسي لپاره `<{ $component }>` باید یا لنډ تشریح ولري یا د ښکلا لپاره وټاکل شي۔

accessibility-video-short-description = د لاسرسي لپاره `<video>` باید لنډ تشریح ولري۔

accessibility-input-short-description-or-label = د لاسرسي لپاره `<{ $component }>` باید لنډ تشریح یا نوم ولري۔

accessibility-answer-input-short-description-or-label = د لاسرسي لپاره هغه `<answer>` چې ننوتنه جوړوي باید لنډ تشریح یا نوم ولري۔

accessibility-short-description-contains-math = لنډ تشریحات باید د `<{ $component }>` په څېر ریاضي برخې ونه لري۔ ریاضي په کلمو ولیکئ۔

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] د څپرکي د سرلیک متن لپاره د { $colorName } توپیر بس نه دی (تیاره حالت) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ لږ تر لږه { $threshold }:1 اړین دی)۔
       *[other] د څپرکي د سرلیک متن لپاره د { $colorName } توپیر بس نه دی ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ لږ تر لږه { $threshold }:1 اړین دی)۔
    }

## `<circle>`

circle-through-points-non-numerical = کله چې ټکي عددي ارزښتونه ونه لري، له { $count } ټکو تېرېدونکی `<circle>` نه دی چمتو شوی۔

circle-too-many-through-points = له 3 څخه زیاتو ټکو تېرېدونکې دایره نه شي حسابېدای۔

circle-overprescribed-radius-center-points = له ټاکل شوي وړانګې، مرکز او تېرېدونکو ټکو سره دایره نه شي حسابېدای۔

circle-center-with-multiple-points = له ټاکل شوي مرکز سره هغه دایره چې له یوه څخه زیاتو ټکو تېریږي نه شي حسابېدای۔

circle-radius-too-small = دایره نه شي حسابېدای: ځکه چې د دوو ټکو ترمنځ واټن { $distance } دی، نو ټاکل شوې وړانګه { $radius } ډېره کوچنۍ ده۔

circle-radius-with-many-points = له ټاکل شوي وړانګې سره له دوو څخه زیاتو ټکو تېرېدونکې دایره نه شي جوړېدای۔

circle-invalid-center-or-through-points = د دایرې مرکز یا تېرېدونکي ټکي ناسم دي۔

circle-radius-center-with-multiple-points = له ټاکل شوي مرکز سره د هغې دایرې وړانګه چې له یوه څخه زیاتو ټکو تېریږي نه شي حسابېدای۔

circle-change-radius-non-numerical = د هغې دایرې وړانګه چې له غیر عددي ټکو تېریږي نه شي بدلېدای

circle-radius-with-points-non-numerical = کله چې عددي ارزښتونه شتون ونه لري، له ټاکل شوي وړانګې سره له یوه څخه زیاتو ټکو تېرېدونکې دایره نه شي جوړېدای۔

circle-change-center-non-numerical = د هغې دایرې د مرکز بدلول چې له غیر عددي ټکو تېریږي نه دی چمتو شوی۔

## `<function>`

function-domain-insufficient-dimensions = د فنکشن د ساحې لپاره ابعاد بس نه دي۔ ساحه { $intervals } وقفې لري، خو فنکشن { $inputs } ننوتنې لري۔

function-domain-invalid-format = د فنکشن د ساحې بڼه ناسمه ده۔

function-ignoring-non-numerical =
    { $type ->
        [maximum] د فنکشن غیر عددي اعظمي ارزښت نظر نه کیږي۔
        [minimum] د فنکشن غیر عددي اصغري ارزښت نظر نه کیږي۔
        [extremum] د فنکشن غیر عددي وروستی ارزښت نظر نه کیږي۔
        [point] د فنکشن غیر عددي ټکی نظر نه کیږي۔
        [slope] د فنکشن غیر عددي ډډه نظر نه کیږي۔
       *[other] د فنکشن غیر عددي { $type } نظر نه کیږي۔
    }

function-ignoring-empty =
    { $type ->
        [maximum] د فنکشن تش اعظمي ارزښت نظر نه کیږي۔
        [minimum] د فنکشن تش اصغري ارزښت نظر نه کیږي۔
        [extremum] د فنکشن تش وروستی ارزښت نظر نه کیږي۔
        [point] د فنکشن تش ټکی نظر نه کیږي۔
       *[other] د فنکشن تش { $type } نظر نه کیږي۔
    }

function-points-too-close = فنکشن دوه داسې ټکي لري چې ځایونه یې ډېر نږدې دي۔ فنکشن نه شي تعریفېدای۔

function-iterates-input-output-mismatch = د فنکشن تکرارونه یوازې هغه وخت ممکن دي چې د ننوتنو شمېر د وتنو له شمېر سره برابر وي۔ دا فنکشن { $inputs } ننوتنې او { $outputs } وتنې لري۔

## `<sequence>`

sequence-invalid-length = د لړۍ اوږدوالی ناسم دی۔ باید غیر منفي بشپړه شمېره وي۔

sequence-invalid-step = د لړۍ ګام ناسم دی۔ د { $type } ډول لړۍ لپاره باید شمېره وي۔

sequence-invalid-endpoint-number = د عددي لړۍ "{ $attribute }" ارزښت ناسم دی۔ باید شمېره وي۔

sequence-invalid-endpoint-letters = د تورو لړۍ "{ $attribute }" ارزښت ناسم دی۔ باید د تورو ترکیب وي۔

sequence-invalid-endpoint = د لړۍ "{ $attribute }" ارزښت ناسم دی۔

select-from-sequence-coprime-not-numbers = coprime نظر نه شو ځکه چې انتخاب له شمېرو څخه نه دی

select-from-sequence-coprime-with-exclude-combinations = coprime نظر نه شو ځکه چې excludeCombinations ټاکل شوی

## Resolving a `target`

target-not-found = په `<{ $source }>` کې د target ارزښت ناسم دی: موخه ونه موندل شوه۔

target-state-variable-not-found = په `<{ $source }>` کې د target ارزښت ناسم دی: پر `<{ $component }>` باندې د "{ $property }" په نوم حالت متغیر ونه موندل شو۔

## `<odeSystem>`

# «ښۍ خوا» is the right-hand side of the equation and stays the right one:
# mathematics is a left-to-right island inside a Pashto document, so the
# equation the phrase names is drawn the same way round as in English.
ode-system-variables-match-independent = د `<odeSystem>` متغیرونه باید له خپلواک متغیر څخه توپیر ولري۔

ode-system-duplicate-variable-names = د تفاضلي معادلې د ښۍ خوا فنکشنونه له تکرارو تابع متغیر نومونو سره نه شي تعریفېدای۔

ode-system-rhs-function-error = د تفاضلي معادلې د ښۍ خوا فنکشن نه شي تعریفېدای۔ د mathjs فنکشن په جوړولو کې تېروتنه۔

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = د { $count } کرښو ترمنځ زاویه نه شي تعریفېدای

angle-invalid-through-point = د `<angle>` په through کې ناسم ټکی

parabola-vertex-too-many-points = له ټاکل شوي راس سره هغه پارابولا چې له یوه څخه زیاتو ټکو تېریږي نه ده چمتو شوې۔

parabola-too-many-points = له 3 څخه زیاتو ټکو تېرېدونکې پارابولا نه ده چمتو شوې۔

intersection-too-many-items = د دوو څخه زیاتو څیزونو تقاطع نه ده چمتو شوې

## Other math components

ionic-compound-not-two-ions = د دوو آیونونو پرته د بل هېڅ لپاره آیوني ترکیب نه دی چمتو شوی۔

ionic-compound-needs-cation-and-anion = آیوني ترکیب یوازې د یوه کاتیون او یوه انیون لپاره چمتو شوی۔

solve-equations-cannot-evaluate = معادله حل نه شوه ځکه چې ارزښت یې ونه ټاکل شو: { $equation }

math-operators-operand-number-required = د ریاضي عملوند په اخیستلو کې باید operandNumber وټاکل شي۔

eigen-decomposition-failed = د ماتریکس ځانګړي ارزښتونه ونه شول حسابېدای

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } پرامیټر په نمونه کې نه راځي، نو تل به له تش ځای سره برابر شي۔
       *[other] `<matchesPattern>`: { $parameters } پرامیټرونه په نمونه کې نه راځي، نو تل به له تش ځای سره برابر شي۔
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ونه پېژندل شو۔ باید none، medium، dense وي، یا په یوه تشه سره جلا شوې دوه مثبتې شمېرې، لکه grid="1 0.5"۔ هېڅ جال به ونه اېستل شي۔

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: په prefigure لیدونکي کې xLabelPosition="left" نه ملاتړ کیږي؛ د right ځای چلند کارول کیږي۔

prefigure-y-label-position-unsupported = `<graph>`: په prefigure لیدونکي کې yLabelPosition="bottom" نه ملاتړ کیږي؛ د top ځای چلند کارول کیږي۔

prefigure-invalid-axis-bounds = `<graph>`: prefigure ته د بدلون لپاره د محورونو بریدونه ناسم دي؛ تلواله bbox (-10,-10,10,10) کارول کیږي۔

prefigure-invalid-width = `<graph>`: prefigure ته د بدلون لپاره پلنوالی ناسم دی؛ تلواله د انځور پلنوالی 425 کارول کیږي۔

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ته د بدلون لپاره aspectRatio ناسم دی؛ تلواله تناسب 1 کارول کیږي۔

prefigure-grid-spacing-too-fine = `<graph>`: د محورونو د بریدونو په پرتله د جال واټن ډېر باریک دی؛ په prefigure لیدونکي کې جال پرېښودل کیږي۔

prefigure-annotations-not-rendered = `<graph>`: کله چې د PreFigure لیدونکی ونه کارول شي، یادښتونه به ونه اېستل شي۔

multiple-annotations-children = په `<graph>` کې له یوه څخه زیات `<annotations>` ماشومان وموندل شول؛ پرته له وروستي، نور ټول نظر نه کیږي۔

## Referring to other components

copy-unrecognized-component-type = ناپېژندلی ډول برخه نه شي غځېدای یا کاپي کېدای: { $type }۔

copy-prop-not-found = د { $component } ډول برخه کې { $property } ځانګړنه ونه موندل شوه

collect-no-source = د collect لپاره هېڅ سرچینه ونه موندل شوه۔

collect-invalid-component-type = د `<{ $component }>` ډول برخې نه شي راټولېدای ځکه چې دا ناسم ډول دی۔

reference-index-unavailable = شاخص `{ $reference }` ته حواله نه شي کېدای

## `<callAction>`

component-action-unavailable = پر `{ $reference }` برخه باندې { $action } نه شي بلل کېدای

## `<dataFrame>`

data-frame-inconsistent-row-lengths = د معلوماتو بڼه ناسمه ده۔ د کتارونو اوږدوالي یو شان نه دي۔ په componentIdx :{ $componentIdx } کې وموندل شو

data-frame-duplicate-column-names = معلومات تکرار شوي ستون نومونه لري۔ په componentIdx :{ $componentIdx } کې وموندل شو

data-frame-missing-column-name = معلوماتو کې د یوه ستون نوم نشته۔ په componentIdx :{ $componentIdx } کې وموندل شو

## `<answer>` and scoring

answer-award-depends-on-own-response = د دې ځواب یو award پر همدې answer د لېږل شوي ځواب ولاړ دی، چې ناڅاپي چلند به رامنځته کړي۔

answer-max-num-attempts-in-section-wide-check-work = د `sectionWideCheckWork` لرونکي ظرف دننه پر `<answer>` باندې د `maxNumAttempts` ټاکل هېڅ اغېز نه لري، ځکه چې د هڅو شمېر ظرف ټاکي۔ پر ځای یې `maxNumAttempts` پر ظرف وټاکئ۔

nested-section-wide-check-work-max-num-attempts = پر هغه ظرف باندې د `maxNumAttempts` ټاکل چې `sectionWideCheckWork` لري او پخپله د بل داسې ظرف دننه دی هېڅ اغېز نه لري، ځکه چې د هڅو شمېر بهرنی ظرف ټاکي۔ `maxNumAttempts` پر بهرني ظرف وټاکئ۔

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] د symbolicEquality له ټاکلو پرته به د { $attributes } ځانګړنې هېڅ اغېز ونه لري۔
       *[other] د symbolicEquality له ټاکلو پرته به د { $attributes } ځانګړنو هېڅ اغېز ونه لري۔
    }

answer-invalid-type = د ځواب لپاره ناسم ډول: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = ځکه چې د `<{ $component }>` برخې نوم نشته، د module د ځانګړنې په توګه یې کارول نه شي کېدای

module-attribute-name-already-defined = د `<{ $component } name="{ $name }">` برخه د module د ځانګړنې په توګه نه شي کارېدای ځکه چې د `<module>` ډول لا دمخه د "{ $name }" په نوم ځانګړنه لري۔

conditional-content-condition-ignored = پر هغه `<conditionalContent>` برخه باندې چې د case یا else ماشومان لري، د `condition` ځانګړنه نظر نه کیږي۔

slider-markers-type-mismatch = د نښو ډول د سلایډر له ډول سره نه خوري۔

pretzel-problem-needs-statement-and-answer = ناسم pretzel: هر `<problem>` باید یو `<statement>` او یو `<answer>` ولري۔

pretzel-circuit-first-problem-distractor = ناسم pretzel: په mode="circuit" کې لومړی `<problem>` نه شي کولای پام اړوونکی وي۔

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] د `{ $attribute }` ځانګړنې لپاره { $values } ارزښت ناسم دی؛ نظر نه کیږي۔
       *[other] د `{ $attribute }` ځانګړنې لپاره { $values } ارزښتونه ناسم دي؛ نظر نه کیږي۔
    }

attribute-must-be-references = د `{ $attribute }` ځانګړنې لپاره `{ $value }` ارزښت ناسم دی۔ ځانګړنه باید له هغو حوالو جوړه وي چې په `$` پیل کیږي۔

math-input-invalid-function-names = <mathInput>: په { $attribute } کې ناسم فنکشن نومونه نظر نه شول: { $names }۔ د هر نوم ښکاره برخه باید لږ تر لږه دوه توري وي (توري یا ډشونه)؛ ورپسې کېدای شي اختیاري `|<mathspeak alternative>` راشي۔

## Building components from the source

component-type-invalid = ناسم ډول برخه: `<{ $componentType }>`

attribute-repeated = د { $attribute } ځانګړنه نه شي تکرارېدای۔

attribute-invalid-for-component = د `<{ $componentType }>` ډول برخې لپاره د "{ $attribute }" ځانګړنه ناسمه ده۔

## Style definition contrast

style-definition-insufficient-contrast =
    د سبک تعریف { $styleNumber } کې د { $context ->
        [text-on-background] متن رنګ د شالید د رنګ په پرتله
        [high-contrast] لوړ توپیر لرونکی رنګ د تختې په پرتله
        [line] د کرښې رنګ د تختې په پرتله
        [marker] د نښې رنګ د تختې په پرتله
       *[text-on-canvas] د متن رنګ د تختې په پرتله
    } توپیر بس نه دی{ $mode ->
        [dark] { " (تیاره حالت)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ لږ تر لږه { $threshold }:1 اړین دی)۔

style-definition-dark-mode-text-background-contrast =
    که څه هم د سبک تعریف { $styleNumber } داسې رنګونه ټاکلي چې په روښانه حالت کې بس توپیر لري، له هغو څخه اخیستل شوي د تیاره حالت رنګونه د متن او شالید د رنګ ترمنځ بس توپیر نه ورکوي ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ لږ تر لږه { $threshold }:1 اړین دی)۔ { $suggestion ->
        [available] په تیاره حالت کې د بس توپیر لپاره یا په روښانه حالت کې توپیر زیات کړئ (لکه { $lightAttribute }="{ $lightColor }") یا د تیاره حالت رنګ پخپله وټاکئ (لکه { $darkAttribute }="{ $darkColor }")۔
       *[none] په تیاره حالت کې د بس توپیر لپاره په روښانه حالت کې توپیر زیات کړئ یا اخیستل شوي رنګونه په textColorDarkMode او/یا backgroundColorDarkMode بدل کړئ۔
    }

style-definition-dark-mode-text-canvas-contrast =
    که څه هم د سبک تعریف { $styleNumber } داسې د متن رنګ ټاکلی چې په روښانه حالت کې بس توپیر لري، له هغه څخه اخیستل شوی د تیاره حالت متن رنګ د تختې په پرتله بس توپیر نه لري ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ لږ تر لږه { $threshold }:1 اړین دی)۔ { $suggestion ->
        [available] په تیاره حالت کې د بس توپیر لپاره یا په روښانه حالت کې توپیر زیات کړئ (لکه textColor="{ $lightColor }") یا د تیاره حالت رنګ پخپله وټاکئ (لکه textColorDarkMode="{ $darkColor }")۔
       *[none] په تیاره حالت کې د بس توپیر لپاره په روښانه حالت کې توپیر زیات کړئ یا اخیستل شوی رنګ په textColorDarkMode بدل کړئ۔
    }

section-multiple-style-palettes = یو څپرکی یوازې یوه <stylePalette> ټاکلای شي؛ وروستۍ کارول کیږي۔

## Unique variants

variant-num-to-select-not-non-negative-integer = د { $component } برخې بېلې بڼې نه شي ټاکل کېدای ځکه چې numToSelect غیر منفي بشپړه شمېره نه ده۔

variant-num-to-select-not-constant-number = د { $component } برخې بېلې بڼې نه شي ټاکل کېدای ځکه چې numToSelect ثابته شمېره نه ده۔

variant-with-replacement-not-constant-boolean = د { $component } برخې بېلې بڼې نه شي ټاکل کېدای ځکه چې withReplacement ثابت منطقي ارزښت نه دی۔

variant-select-weight-disables-unique = که یو انتخاب selectWeight یا selectForVariants ولري، د select بېلې بڼې بندېږي

variant-coprime-undetermined = د { $component } برخې بېلې بڼې نه شي ټاکل کېدای ځکه چې دا معلومه نه شوه چې coprime تل ناسم دی۔

variant-attribute-not-constant = د { $component } برخې بېلې بڼې نه شي ټاکل کېدای ځکه چې { $attribute } ثابت نه دی۔

variant-attribute-not-number = د { $component } برخې بېلې بڼې نه شي ټاکل کېدای ځکه چې { $attribute } شمېره نه ده۔

variant-attribute-wrong-type-for-sequence =
    د { $type } ډول { $component } برخې بېلې بڼې نه شي ټاکل کېدای ځکه چې { $attribute } { $expected ->
        [letters-combination] د تورو ترکیب
        [math-expression] سم ریاضي عبارت
        [integer] بشپړه شمېره
       *[number] شمېره
    } نه دی۔

variant-length-not-integer = د { $component } برخې بېلې بڼې نه شي ټاکل کېدای ځکه چې length بشپړه شمېره نه ده۔

variant-sort-not-implemented = له sort سره د { $component } بېلې بڼې نه دي چمتو شوې

variant-exclude-combinations-not-implemented = له excludeCombinations سره د { $component } بېلې بڼې نه دي چمتو شوې

variant-math-exclude-not-implemented = له exclude سره د math ډول { $component } بېلې بڼې نه دي چمتو شوې

variant-non-constant-exclude-not-implemented = له ناثابت exclude سره د { $component } بېلې بڼې نه دي چمتو شوې

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: د انځور په prefigure لیدونکي کې ملاتړ نه کیږي؛ تابع عنصر پرېښودل شو۔

prefigure-descendant-invalid-geometry = { $subject }: ناتمامه یا نابشپړه هندسه؛ تابع عنصر پرېښودل شو۔

prefigure-curve-label-omitted = { $subject }: پر بدل شویو منحني عناصرو باندې نومونه نه ملاتړ کیږي؛ نوم پرېښودل شو۔

prefigure-curve-unsupported-definition-type = { $subject }: د منحني فنکشن د تعریف ډول '{ $definitionType }' نه ملاتړ کیږي؛ تابع عنصر پرېښودل شو۔

prefigure-region-flip-functions-unsupported = { $subject }: پر regionBetweenCurves باندې د flipFunctions ځانګړنه نه ملاتړ کیږي؛ تابع عنصر پرېښودل شو۔

prefigure-region-non-formula-child = { $subject }: پر regionBetweenCurves باندې یوازې د فورمول له مخې تعریف شوي ماشوم فنکشنونه ملاتړ کیږي؛ تابع عنصر پرېښودل شو۔

prefigure-label-position-unsupported =
    { $subject }: د { $labelKind ->
        [line-family] د کرښې کورنۍ نوم
       *[point] د ټکي نوم
    } لپاره labelPosition '{ $labelPosition }' نه ملاتړ کیږي؛ د PreFigure تلواله برابرول وکارول شول۔

prefigure-fill-style-unsupported = { $subject }: د ډکاو سبک '{ $fillStyle }' په PreFigure کې نه ملاتړ کیږي؛ یو شان ډکاو کارول کیږي۔

prefigure-line-style-unknown = { $subject }: د کرښې سبک '{ $lineStyle }' ناپېژندلی دی او د PreFigure له وتنې څخه پرېښودل شو۔

prefigure-marker-style-mapped-to-diamond = { $subject }: د نښې سبک '{ $markerStyle }' د PreFigure 'diamond' سبک ته واړول شو۔

prefigure-marker-style-unsupported = { $subject }: د نښې سبک '{ $markerStyle }' په PreFigure کې نه ملاتړ کیږي؛ تلواله سبک وکارول شو۔

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ناسم دی؛ موخه ونه ټاکل شوه۔ یادښت پرېښودل شو۔

annotation-ref-multiple-targets = `<annotation>`: `ref` له یوې څخه زیاتو موخو ته ورسېد؛ لومړۍ موخه کارول کیږي۔

annotation-ref-outside-graph = `<annotation>`: `ref` ناسم دی؛ موخه له خپل انځور بهر ده۔ یادښت پرېښودل شو۔

annotation-ref-unsupported-target = `<annotation>`: `ref` ناسم دی؛ موخه په prefigure بدلون کې ملاتړ شوی ګرافیکي څیز نه دی۔ یادښت پرېښودل شو۔

annotation-text-missing = `<annotation>`: `text` نشته یا تش دی؛ تش متن ورکول کیږي۔

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] دایروي تړاو وموندل شو۔
       *[other] د `<{ $componentType }>` برخې پر بنسټ دایروي تړاو وموندل شو۔
    }

reference-no-referent = د حوالې لپاره هېڅ مرجع ونه موندل شوه: `{ $reference }`

reference-multiple-referents = د حوالې لپاره له یوې څخه زیاتې مرجع ګانې وموندل شوې: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = د `<{ $componentType }>` د { $attribute } ځانګړنې بڼه ناسمه ده۔

children-invalid = د `<{ $componentType }>` لپاره ناسم ماشومان: ناسم ماشومان وموندل شول: { $children }

## Falling back to a default

attribute-value-invalid-using-default = د `{ $attribute }` ځانګړنې لپاره `{ $value }` ارزښت ناسم دی، د `{ $default }` ارزښت کارول کیږي

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] د DoenetML بڼه { $version } ونه موندل شوه۔
       *[other] د DoenetML بڼه { $version } ونه موندل شوه۔ بڼه { $fallback } کارول کیږي
    }

## Reading the DoenetML

parse-invalid-doenetml = ناسم DoenetML: { $content }

parse-tag-missing-close-tag = ناسم DoenetML: د `{ $tag }` ټګ د تړلو ټګ نه لري۔ خودتړونکی ټګ یا د `</{ $tagName }>` ټګ تمه کېده۔

parse-tag-error = ناسم DoenetML: په `<{ $tagName }>` ټګ کې تېروتنه

parse-attribute-missing-value = ناسم DoenetML: داسې ښکاري چې ناسمې ځانګړنې `{ $attribute }` ته ارزښت نشته۔

parse-attribute-invalid = ناسم DoenetML: د `{ $attribute }` ځانګړنه ناسمه ده

parse-attribute-value-invalid = ناسم DoenetML: د ځانګړنې ارزښت `{ $value }` ناسم دی

parse-attribute-value-quote-mismatch = ناسم DoenetML: د ځانګړنې ارزښت `{ $value }` ناسم دی۔ اقتباس نښې سره نه خوري۔ داسې ښکاري چې یوه `{ $quote }` نشته

parse-open-tag-name-missing = ناسم DoenetML: بې نومه ټګ وموندل شو، لکه `<`

parse-tag-not-closed = ناسم DoenetML: د `{ $tag }` ټګ ونه تړل شو (داسې ښکاري چې `>` نشته)۔

parse-self-closing-tag-name-missing = ناسم DoenetML: بې نومه ټګ وموندل شو `<{ $content }>`

parse-self-closing-tag-not-closed = ناسم DoenetML: د `{ $tag }` ټګ ونه تړل شو (داسې ښکاري چې `/>` نشته)۔

parse-tag-invalid-attributes = ناسم DoenetML: د `{ $tag }` ټګ سم نه دی۔ کېدای شي ځانګړنې یې ناسمې وي۔

parse-close-tag-name-missing = ناسم DoenetML: بې نومه د تړلو ټګ وموندل شو، لکه `</`

parse-attribute-value-unquoted = د ځانګړنو ارزښتونه باید د اقتباس نښو دننه وي: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = ناسم DoenetML: د تړلو ټګ `{ $tag }` وموندل شو، خو ورته پرانیستونکی ټګ نشته

parse-close-tag-mismatched = ناسم DoenetML: د تړلو ټګ سره نه خوري۔ `</{ $expected }>` تمه کېده۔ `{ $found }` وموندل شو

parser-node-unconvertible = د { $node } غوټه Dast غوټې ته ونه اړول شوه۔

## Names

name-attribute-invalid =
    د name='{ $name }' ځانګړنه ناسمه ده۔ { $reason ->
        [characters] نومونه یوازې توري، شمېرې، لاندنۍ کرښې یا ډشونه لرلای شي۔
       *[start] نومونه باید په توري پیل شي۔
    }

component-name-invalid-start = د برخې نوم "{ $name }" ناسم دی۔ نومونه باید په توري پیل شي۔

## `<answer>` sugar

answer-video-watched-missing-video = د videoWatched ډول ځواب باید د video ځانګړنه ولري

answer-video-watched-video-not-reference = د videoWatched ډول ځواب د video ځانګړنه باید حواله وي

answer-name-not-single-text = د ځواب د name ځانګړنه باید یو متني ماشوم ولري

## Referencing another document

external-doenetml-recursion-limit = د ډېرو تکرارونو له امله بهرنی DoenetML ترلاسه نه شو۔ آیا دایروي حواله شته؟

external-doenetml-unavailable = له { $attribute }="{ $uri }" څخه DoenetML ترلاسه نه شو

external-doenetml-type-mismatch = له { $attribute }="{ $uri }" څخه ترلاسه شوی DoenetML ناسم دی: د "{ $componentType }" ډول سره نه خوري

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] د `{ $from }` ځانګړنه زړه شوې؛ پر ځای یې `{ $to }` وکاروئ۔
       *[other] [deprecation] پر `<{ $component }>` باندې د `{ $from }` ځانګړنه زړه شوې؛ پر ځای یې `{ $to }` وکاروئ۔
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] د `{ $from }` ځانګړنه زړه شوې او نظر نه شوه ځکه چې `{ $to }` هم ټاکل شوی۔
       *[other] [deprecation] پر `<{ $component }>` باندې د `{ $from }` ځانګړنه زړه شوې او نظر نه شوه ځکه چې `{ $to }` هم ټاکل شوی۔
    }

deprecated-attribute-ignored = [deprecation] پر `<{ $component }>` باندې د `{ $attribute }` ځانګړنه زړه شوې او نظر نه شوه۔


## Language coverage

pluralize-english-only = `<pluralize>` یوازې انګریزي کلمې جمع کولای شي، نو په { $locale } ژبه لیکل شوي سند کې یې متن هماغسې پاتې کیږي۔ د جمع بڼه مستقیم ولیکئ، یا یې د `pluralForm` ځانګړنې په مرسته وټاکئ۔


## Checking against the schema

schema-element-unrecognized = عنصر `<{ $tag }>` د Doenet پېژندل شوی عنصر نه دی۔

schema-element-not-allowed-at-root = عنصر `<{ $tag }>` د سند په ریښه کې اجازه نه لري۔

schema-element-not-allowed-inside = عنصر `<{ $tag }>` د `<{ $parent }>` دننه اجازه نه لري۔

schema-attribute-unrecognized = عنصر `<{ $tag }>` د `{ $attribute }` په نوم ځانګړنه نه لري۔

schema-attribute-value-not-allowed =
    { $isList ->
        [true] د `<{ $tag }>` عنصر `{ $attribute }` ځانګړنه باید داسې لړ وي چې هر عنصر یې له دې څخه یو وي: { $allowed }
       *[other] د `<{ $tag }>` عنصر `{ $attribute }` ځانګړنه باید له دې څخه یوه وي: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = د select لپاره ناسم د بڼې نوم۔ د بڼې نوم { $variantName } په { $numOptions } انتخابونو کې راځي خو د ټاکلو شمېر { $numToSelect } دی۔

select-variant-name-without-options = د select لپاره ځینې بڼې ټاکل شوې خو د ممکنې بڼې نوم لپاره هېڅ انتخاب نه دی ټاکل شوی: { $variantName }۔

select-variant-name-not-possible = د select لپاره ټاکل شوی د بڼې نوم { $variantName } ممکنه بڼه نه ده۔

select-too-few-options = یوازې له { $numOptions } څخه { $numToSelect } برخې نه شي ټاکل کېدای۔

select-from-sequence-too-few-values = د { $length } اوږدوالي لړۍ څخه { $numToSelect } ارزښتونه نه شي ټاکل کېدای۔

select-from-sequence-indices-count-mismatch = د select لپاره ټاکل شویو شاخصونو شمېر باید د ټاکلو له شمېر سره برابر وي

select-from-sequence-indices-not-integers = د select لپاره ټاکل شوي ټول شاخصونه باید بشپړې شمېرې وي

select-from-sequence-index-excluded = د selectfromsequence ټاکل شوی شاخص ایستل شوی و

select-from-sequence-indices-excluded-combination = د selectfromsequence ټاکل شوي شاخصونه ایستل شوی ترکیب و

select-from-sequence-coprime-not-positive-integers = یو له بل سره اول ترکیبونه نه شي ټاکل کېدای ځکه چې انتخاب له مثبتو بشپړو شمېرو څخه نه دی۔

select-from-sequence-coprime-common-factor = یو له بل سره اول شمېرې نه شي ټاکل کېدای۔ ټول ممکن ارزښتونه یو ګډ عامل لري۔ (د "from" یا "to" ټاکل شوی ارزښت باید له "step" سره اول وي۔)

select-from-sequence-coprime-single-number = له داسې یوې شمېرې چې 1 نه وي، یو له بل سره اول ترکیبونه نه شي ټاکل کېدای۔

select-from-sequence-excluded-too-many-combinations = په selectFromSequence کې له 70% څخه زیات ترکیبونه ایستل شوي

select-from-sequence-coprime-none-found = یو له بل سره اول شمېرې ونه ټاکل شوې۔ ټول ممکن ارزښتونه یو ګډ عامل لري۔

select-from-sequence-too-few-unique-values = د { $numPossibleValues } اوږدوالي لړۍ څخه { $numToSelect } بېل ارزښتونه نه شي ټاکل کېدای

select-prime-numbers-too-few-values = د { $numValues } اوږدوالي اولو شمېرو له لړ څخه { $numToSelect } ارزښتونه نه شي ټاکل کېدای

select-prime-numbers-values-count-mismatch = د select لپاره ټاکل شویو ارزښتونو شمېر باید د ټاکلو له شمېر سره برابر وي

select-prime-numbers-values-not-prime = د select prime number لپاره ټاکل شوي ټول ارزښتونه باید د اولو شمېرو په لړ کې وي

select-prime-numbers-values-excluded-combination = د selectPrimeNumbers ټاکل شوي ارزښتونه ایستل شوی ترکیب و

select-prime-numbers-excluded-too-many-combinations = په selectPrimeNumbers کې له 70% څخه زیات ترکیبونه ایستل شوي

select-random-combination-fluke = د ډېر نادر اتفاق له امله، د تصادفي ارزښتونو ترکیب ونه ټاکل شو

select-random-value-fluke = د ډېر نادر اتفاق له امله، تصادفي ارزښت ونه ټاکل شو
