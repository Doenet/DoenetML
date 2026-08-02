# Arabic warnings and errors. Translated from `locales/en/diagnostics.ftl`,
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
# Arabic writes the semicolon as «؛» and it is used here wherever the English
# separates two clauses with one. The full stop, the colon and the parentheses
# are the same characters in both scripts; the bidi algorithm turns the
# brackets around at render time, so they are written in logical order — the
# opening one first — exactly as in English.
#
# Two habits recur, both for the same reason: Arabic welds its one-letter
# prepositions to the word after them, and a placeable cannot be welded to
# anything. So a message that in English reads "for `<{ $component }>`" names
# what the argument is instead — «للمكوّن { $component }» — and a select whose
# variants would land after such a preposition carries the preposition inside
# each variant.
#
# Where English distinguishes a singular from a plural only in the verb — "is
# ignored" against "are ignored" — Arabic's «يتم تجاهل» covers both, and the
# select is dropped rather than written out twice identically. The count
# argument is then unused, which is harmless: it stays in the English message
# for the languages that need it.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = يتم تجاهل { $attributes } عند تحديد نقطتي النهاية

line-segment-attributes-ignored-with-endpoint-and-midpoint = يتم تجاهل { $attributes } عند تحديد نقطة نهاية ونقطة منتصف معًا

line-segment-midpoint-offset-without-midpoint = لا يؤثر midpointOffset ما لم تُحدَّد نقطة منتصف

## `<line>`

line-points-undetermined-dimensions = مستقيم يمر بنقاط ذات أبعاد غير محددة.

line-points-too-few-dimensions = يجب أن يمر المستقيم بنقاط ذات بعدين على الأقل.

line-points-depend-on-variables = المستقيم يمر بنقاط تعتمد على متغيرات: { $variables }.

line-equation-invalid-format = صيغة غير صالحة لمعادلة مستقيم بالمتغيرين { $variable1 } و{ $variable2 }.

## `<ray>`

ray-overprescribed-through = الشعاع محدد بواسطة through وendpoint وdirection. سيتم تجاهل through المحددة.

ray-dimension-mismatch = عدم تطابق numDimensions في الشعاع.

## `<vector>`

vector-overprescribed-head = المتجه محدد بواسطة head وtail وdisplacement. سيتم تجاهل head المحددة.

vector-dimension-mismatch = عدم تطابق numDimensions في المتجه.

## Attracting and constraining

attract-to-without-nearest-point = لا يمكن الجذب إلى `<{ $component }>` لأنه لا يملك متغير الحالة nearestPoint.

constrain-to-without-nearest-point = لا يمكن التقييد إلى `<{ $component }>` لأنه لا يملك متغير الحالة nearestPoint.

constrain-to-interior-without-nearest-point = لا يمكن التقييد داخل `<{ $component }>` لأنه لا يملك متغير الحالة nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = يتم تجاهل labelPosition في choiceInput غير المضمّن

## Ordering children by index

choice-input-indices-count-mismatch = يتم تجاهل indices المحددة في choiceInput لأن عدد المؤشرات لا يطابق عدد الأبناء من نوع choice.

pretzel-indices-count-mismatch = يتم تجاهل indices المحددة في problem لأن عدد المؤشرات لا يطابق عدد الأبناء من نوع problem.

shuffle-indices-count-mismatch = يتم تجاهل indices المحددة في shuffle لأن عدد المؤشرات لا يطابق عدد المكوّنات.

indices-ignored-out-of-range = يتم تجاهل indices المحددة في { $component } لأن بعض المؤشرات خارج النطاق.

pretzel-indices-repeated = يتم تجاهل indices المحددة في pretzel لأن بعض المؤشرات مكررة.

pretzel-circuit-first-index = يتم تجاهل indices المحددة في pretzel في وضع circuit لأن المؤشر الأول يجب أن يكون 1.

## `<shuffle>` and `<sort>`

string-children-need-type = لكي يعمل `<{ $component }>` مع أبناء نصيين، يجب تحديد السمة type.

invalid-type-defaulting-to-math = النوع { $type } غير صالح للمكوّن { $component }. يجب أن يكون أحد القيم math أو text أو number أو boolean. سيتم استخدام math.

string-not-valid-component-to-arrange = النص "{ $value }" ليس مكوّنًا صالحًا يعالجه { $component }. سيتم تجاهله.

## Types and variables

invalid-type-defaulting-to-number = النوع { $type } غير صالح، سيتم ضبط النوع على number.

invalid-variable-value = قيمة متغير غير صالحة: `{ $value }`

## Variants

variant-index-must-be-number = يجب أن يكون مؤشر النسخة { $index } رقمًا

variant-index-must-be-integer = يجب أن يكون مؤشر النسخة { $index } عددًا صحيحًا

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` غير مطبّق للقياسات المطلقة. سيتم ضبط العروض على قيم نسبية.

side-by-side-absolute-margins = `<{ $component }>` غير مطبّق للقياسات المطلقة. سيتم ضبط الهوامش على قيم نسبية.

side-by-side-no-block-child = `<{ $component }>` غير صالح: يجب أن يحتوي على ابن كتلي واحد على الأقل.

## `<label>`

label-for-ignored-on-graphical = يتم تجاهل السمة `for` على `<label>` الرسومي.

label-for-must-resolve-to-one = يجب أن تشير السمة `for` على `<label>` إلى مكوّن واحد بالضبط.

label-for-unresolved = تعذّر ربط السمة `for` على `<label>` بأي مكوّن.

label-for-answer-with-authored-inputs = تشير السمة `for` على `<label>` إلى `<answer>` له عناصر إدخال مكتوبة صراحة؛ يجب الإشارة إلى عنصر الإدخال مباشرة.

label-for-answer-without-input = تشير السمة `for` على `<label>` إلى `<answer>` بلا عنصر إدخال يمكن تسميته.

label-for-must-reference-input-or-answer = يجب أن تشير السمة `for` على `<label>` إلى عنصر إدخال أو إلى `<answer>`.

## Accessibility

accessibility-short-description-or-decorative = لأغراض إمكانية الوصول، يجب أن يحمل `<{ $component }>` وصفًا مختصرًا أو أن يُحدَّد بوصفه زخرفيًا.

accessibility-video-short-description = لأغراض إمكانية الوصول، يجب أن يحمل `<video>` وصفًا مختصرًا.

accessibility-input-short-description-or-label = لأغراض إمكانية الوصول، يجب أن يحمل `<{ $component }>` وصفًا مختصرًا أو تسمية.

accessibility-answer-input-short-description-or-label = لأغراض إمكانية الوصول، يجب أن يحمل `<answer>` الذي ينشئ عنصر إدخال وصفًا مختصرًا أو تسمية.

accessibility-short-description-contains-math = ينبغي ألا تحتوي الأوصاف المختصرة على مكوّنات رياضية مثل `<{ $component }>`. ينبغي كتابة الرياضيات بالكلمات.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] تباين { $colorName } غير كافٍ لنص عنوان القسم (الوضع الداكن) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ المطلوب { $threshold }:1 على الأقل).
       *[other] تباين { $colorName } غير كافٍ لنص عنوان القسم ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ المطلوب { $threshold }:1 على الأقل).
    }

## `<circle>`

circle-through-points-non-numerical = لم يُطبَّق `<circle>` المار عبر { $count } نقاط عندما لا تكون للنقاط قيم عددية.

circle-too-many-through-points = لا يمكن حساب دائرة تمر بأكثر من 3 نقاط.

circle-overprescribed-radius-center-points = لا يمكن حساب دائرة بنصف قطر ومركز ونقاط مرور محددة جميعًا.

circle-center-with-multiple-points = لا يمكن حساب دائرة بمركز محدد تمر بأكثر من نقطة واحدة.

circle-radius-too-small = لا يمكن حساب الدائرة: بما أن المسافة بين النقطتين هي { $distance }، فإن نصف القطر المحدد { $radius } صغير جدًا.

circle-radius-with-many-points = لا يمكن إنشاء دائرة تمر بأكثر من نقطتين بنصف قطر محدد.

circle-invalid-center-or-through-points = مركز الدائرة أو نقاط مرورها غير صالحة.

circle-radius-center-with-multiple-points = لا يمكن حساب نصف قطر دائرة بمركز محدد تمر بأكثر من نقطة واحدة.

circle-change-radius-non-numerical = لا يمكن تغيير نصف قطر دائرة تمر بنقاط غير عددية

circle-radius-with-points-non-numerical = لا يمكن إنشاء دائرة تمر بأكثر من نقطة بنصف قطر محدد عندما لا تتوفر قيم عددية.

circle-change-center-non-numerical = لم يُطبَّق تغيير مركز دائرة تمر بنقاط غير عددية.

## `<function>`

function-domain-insufficient-dimensions =
    أبعاد غير كافية لمجال الدالة. المجال يحتوي على { $intervals ->
        [one] فترة واحدة
        [two] فترتين
        [few] { $intervals } فترات
        [many] { $intervals } فترة
       *[other] { $intervals } فترة
    } بينما للدالة { $inputs ->
        [one] مدخل واحد
        [two] مدخلان
        [few] { $inputs } مدخلات
        [many] { $inputs } مدخلًا
       *[other] { $inputs } مدخل
    }.

function-domain-invalid-format = صيغة غير صالحة لمجال الدالة.

function-ignoring-non-numerical =
    { $type ->
        [maximum] يتم تجاهل القيمة العظمى غير العددية للدالة.
        [minimum] يتم تجاهل القيمة الصغرى غير العددية للدالة.
        [extremum] يتم تجاهل القيمة القصوى غير العددية للدالة.
        [point] يتم تجاهل النقطة غير العددية للدالة.
        [slope] يتم تجاهل الميل غير العددي للدالة.
       *[other] يتم تجاهل { $type } غير العددي للدالة.
    }

function-ignoring-empty =
    { $type ->
        [maximum] يتم تجاهل القيمة العظمى الفارغة للدالة.
        [minimum] يتم تجاهل القيمة الصغرى الفارغة للدالة.
        [extremum] يتم تجاهل القيمة القصوى الفارغة للدالة.
        [point] يتم تجاهل النقطة الفارغة للدالة.
       *[other] يتم تجاهل { $type } الفارغ للدالة.
    }

function-points-too-close = تحتوي الدالة على نقطتين متقاربتين أكثر من اللازم. لا يمكن تعريف الدالة.

function-iterates-input-output-mismatch =
    تكرارات الدالة ممكنة فقط إذا تساوى عدد مدخلاتها مع عدد مخرجاتها. لهذه الدالة { $inputs ->
        [one] مدخل واحد
        [two] مدخلان
        [few] { $inputs } مدخلات
        [many] { $inputs } مدخلًا
       *[other] { $inputs } مدخل
    } و{ $outputs ->
        [one] مخرج واحد
        [two] مخرجان
        [few] { $outputs } مخرجات
        [many] { $outputs } مخرجًا
       *[other] { $outputs } مخرج
    }.

## `<sequence>`

sequence-invalid-length = طول المتتالية غير صالح. يجب أن يكون عددًا صحيحًا غير سالب.

sequence-invalid-step = خطوة المتتالية غير صالحة. يجب أن تكون رقمًا لمتتالية من النوع { $type }.

sequence-invalid-endpoint-number = القيمة "{ $attribute }" لمتتالية الأرقام غير صالحة. يجب أن تكون رقمًا.

sequence-invalid-endpoint-letters = القيمة "{ $attribute }" لمتتالية الحروف غير صالحة. يجب أن تكون تركيبًا من الحروف.

sequence-invalid-endpoint = القيمة "{ $attribute }" للمتتالية غير صالحة.

select-from-sequence-coprime-not-numbers = تم تجاهل coprime لأن الاختيار ليس من الأرقام

select-from-sequence-coprime-with-exclude-combinations = تم تجاهل coprime لأن excludeCombinations محددة

## Resolving a `target`

target-not-found = قيمة target غير صالحة في `<{ $source }>`: تعذّر العثور على الهدف.

target-state-variable-not-found = قيمة target غير صالحة في `<{ $source }>`: تعذّر العثور على متغير حالة باسم "{ $property }" في `<{ $component }>`.

## `<odeSystem>`

# «الطرف الأيمن» is the right-hand side of the equation and stays the right
# one: mathematics is a left-to-right island inside an Arabic document, so the
# equation the phrase names is drawn the same way round as in English.
ode-system-variables-match-independent = يجب أن تختلف متغيرات `<odeSystem>` عن المتغير المستقل.

ode-system-duplicate-variable-names = لا يمكن تعريف دوال الطرف الأيمن للمعادلة التفاضلية بأسماء متغيرات تابعة مكررة.

ode-system-rhs-function-error = لا يمكن تعريف دالة الطرف الأيمن للمعادلة التفاضلية. خطأ في إنشاء دالة mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = لا يمكن تعريف زاوية بين { $count } مستقيمات

angle-invalid-through-point = نقطة غير صالحة في through الخاصة بالعنصر `<angle>`

parabola-vertex-too-many-points = لم يُطبَّق قطع مكافئ برأس محدد يمر بأكثر من نقطة واحدة.

parabola-too-many-points = لم يُطبَّق قطع مكافئ يمر بأكثر من 3 نقاط.

intersection-too-many-items = لم يُطبَّق التقاطع لأكثر من عنصرين

## Other math components

ionic-compound-not-two-ions = لم يُطبَّق المركب الأيوني لغير أيونين.

ionic-compound-needs-cation-and-anion = المركب الأيوني مطبّق لكاتيون واحد وأنيون واحد فقط.

solve-equations-cannot-evaluate = تعذّر حل المعادلة لأنه تعذّر تقييمها: { $equation }

math-operators-operand-number-required = يجب تحديد operandNumber عند استخراج معامل رياضي.

eigen-decomposition-failed = تعذّر حساب القيم الذاتية للمصفوفة

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: المعامل { $parameters } لا يظهر في النمط، لذا سيطابق فراغًا دائمًا.
       *[other] `<matchesPattern>`: المعاملات { $parameters } لا تظهر في النمط، لذا ستطابق فراغًا دائمًا.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: تعذّر تفسير grid="{ $grid }". يجب أن تكون none أو medium أو dense أو رقمين موجبين يفصل بينهما فراغ، مثل grid="1 0.5". لن تُرسم أي شبكة.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: القيمة xLabelPosition="left" غير مدعومة في عارض prefigure؛ سيتم استخدام سلوك الموضع right.

prefigure-y-label-position-unsupported = `<graph>`: القيمة yLabelPosition="bottom" غير مدعومة في عارض prefigure؛ سيتم استخدام سلوك الموضع top.

prefigure-invalid-axis-bounds = `<graph>`: حدود المحاور غير صالحة للتحويل إلى prefigure؛ سيتم استخدام bbox الافتراضي (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: العرض غير صالح للتحويل إلى prefigure؛ سيتم استخدام عرض الرسم الافتراضي 425.

prefigure-invalid-aspect-ratio = `<graph>`: قيمة aspectRatio غير صالحة للتحويل إلى prefigure؛ سيتم استخدام نسبة الأبعاد الافتراضية 1.

prefigure-grid-spacing-too-fine = `<graph>`: تباعد الشبكة أدق من أن يناسب حدود المحاور؛ سيتم حذف الشبكة في عارض prefigure.

prefigure-annotations-not-rendered = `<graph>`: لن تُعرض التعليقات التوضيحية عند عدم استخدام عارض PreFigure.

multiple-annotations-children = وُجد أكثر من ابن `<annotations>` داخل `<graph>`؛ سيتم تجاهل كل ما عدا الأخير.

## Referring to other components

copy-unrecognized-component-type = لا يمكن توسيع أو نسخ نوع مكوّن غير معروف: { $type }.

copy-prop-not-found = تعذّر العثور على الخاصية { $property } في مكوّن من النوع { $component }

collect-no-source = لم يُعثر على مصدر للتجميع.

collect-invalid-component-type = لا يمكن تجميع مكوّنات من النوع `<{ $component }>` لأنه نوع مكوّن غير صالح.

reference-index-unavailable = لا يمكن الإشارة إلى المؤشر `{ $reference }`

## `<callAction>`

component-action-unavailable = لا يمكن استدعاء { $action } على المكوّن `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = شكل البيانات غير صالح. أطوال الصفوف غير متسقة. وُجد في componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = تحتوي البيانات على أسماء أعمدة مكررة. وُجد في componentIdx :{ $componentIdx }

data-frame-missing-column-name = تنقص البيانات اسم عمود. وُجد في componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = يعتمد أحد عناصر award لهذه الإجابة على الإجابة المرسلة الخاصة بعنصر answer نفسه، وهو ما يؤدي إلى سلوك غير متوقع.

answer-max-num-attempts-in-section-wide-check-work = لا أثر لضبط `maxNumAttempts` على `<answer>` داخل حاوية تستخدم `sectionWideCheckWork`، لأن عدد المحاولات تتحكم فيه الحاوية. يجب ضبط `maxNumAttempts` على الحاوية بدلًا من ذلك.

nested-section-wide-check-work-max-num-attempts = لا أثر لضبط `maxNumAttempts` على حاوية تستخدم `sectionWideCheckWork` داخل حاوية أخرى تستخدم `sectionWideCheckWork`، لأن عدد المحاولات تتحكم فيه الحاوية الخارجية. يجب ضبط `maxNumAttempts` على الحاوية الخارجية.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] لن يكون للسمة { $attributes } أي تأثير بدون ضبط symbolicEquality.
       *[other] لن يكون للسمات { $attributes } أي تأثير بدون ضبط symbolicEquality.
    }

answer-invalid-type = نوع غير صالح للإجابة: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = بما أن المكوّن `<{ $component }>` بلا اسم، لا يمكن استخدامه سمةً لوحدة module

module-attribute-name-already-defined = لا يمكن استخدام المكوّن `<{ $component } name="{ $name }">` سمةً لوحدة module لأن نوع المكوّن `<module>` يعرّف بالفعل سمة باسم "{ $name }".

conditional-content-condition-ignored = يتم تجاهل السمة `condition` في مكوّن `<conditionalContent>` الذي له أبناء case أو else.

slider-markers-type-mismatch = نوع العلامات لا يطابق نوع المنزلق.

pretzel-problem-needs-statement-and-answer = pretzel غير صالح: يجب أن يحتوي كل `<problem>` على `<statement>` واحد و`<answer>` واحد.

pretzel-circuit-first-problem-distractor = pretzel غير صالح: في mode="circuit" لا يجوز أن يكون `<problem>` الأول عنصر تشتيت.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] القيمة { $values } غير صالحة للسمة `{ $attribute }`؛ سيتم تجاهلها.
       *[other] القيم { $values } غير صالحة للسمة `{ $attribute }`؛ سيتم تجاهلها.
    }

attribute-must-be-references = القيمة `{ $value }` غير صالحة للسمة `{ $attribute }`. يجب أن تتكوّن السمة من مراجع تبدأ بالرمز `$`.

math-input-invalid-function-names = <mathInput>: تم تجاهل أسماء دوال غير صالحة في { $attribute }: { $names }. يجب ألا يقل الجزء المعروض من كل اسم عن حرفين (حروف أو شرطات)؛ ويمكن أن تتبعه لاحقة اختيارية `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = نوع مكوّن غير صالح: `<{ $componentType }>`

attribute-repeated = لا يمكن تكرار السمة { $attribute }.

attribute-invalid-for-component = السمة "{ $attribute }" غير صالحة لمكوّن من النوع `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    تباين تعريف النمط { $styleNumber } غير كافٍ في { $context ->
        [text-on-background] لون النص مقابل لون الخلفية
        [high-contrast] لون التباين العالي مقابل لوحة الرسم
        [line] لون الخط مقابل لوحة الرسم
        [marker] لون العلامة مقابل لوحة الرسم
       *[text-on-canvas] لون النص مقابل لوحة الرسم
    }{ $mode ->
        [dark] { " (الوضع الداكن)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ المطلوب { $threshold }:1 على الأقل).

style-definition-dark-mode-text-background-contrast =
    رغم أن تعريف النمط { $styleNumber } يحدد ألوانًا ذات تباين كافٍ في الوضع الفاتح، فإن ألوان الوضع الداكن المشتقة منها تعطي تباينًا غير كافٍ بين لون النص ولون الخلفية ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ المطلوب { $threshold }:1 على الأقل). { $suggestion ->
        [available] لضمان تباين كافٍ في الوضع الداكن، يجب إما زيادة التباين في الوضع الفاتح (مثلًا بضبط { $lightAttribute }="{ $lightColor }") أو تجاوز لون الوضع الداكن (مثلًا بضبط { $darkAttribute }="{ $darkColor }").
       *[none] لضمان تباين كافٍ في الوضع الداكن، يجب زيادة التباين في الوضع الفاتح أو تجاوز الألوان المشتقة باستخدام textColorDarkMode و/أو backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    رغم أن تعريف النمط { $styleNumber } يحدد لون نص ذا تباين كافٍ في الوضع الفاتح، فإن لون النص المشتق منه للوضع الداكن يعطي تباينًا غير كافٍ مع لوحة الرسم ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ المطلوب { $threshold }:1 على الأقل). { $suggestion ->
        [available] لضمان تباين كافٍ في الوضع الداكن، يجب إما زيادة التباين في الوضع الفاتح (مثلًا بضبط textColor="{ $lightColor }") أو تجاوز لون الوضع الداكن (مثلًا بضبط textColorDarkMode="{ $darkColor }").
       *[none] لضمان تباين كافٍ في الوضع الداكن، يجب زيادة التباين في الوضع الفاتح أو تجاوز اللون المشتق باستخدام textColorDarkMode.
    }

section-multiple-style-palettes = لا يمكن للقسم اختيار أكثر من <stylePalette> واحدة؛ سيتم استخدام الأخيرة.

## Unique variants

variant-num-to-select-not-non-negative-integer = تعذّر تحديد النسخ الفريدة للمكوّن { $component } لأن numToSelect ليس عددًا صحيحًا غير سالب.

variant-num-to-select-not-constant-number = تعذّر تحديد النسخ الفريدة للمكوّن { $component } لأن numToSelect ليس رقمًا ثابتًا.

variant-with-replacement-not-constant-boolean = تعذّر تحديد النسخ الفريدة للمكوّن { $component } لأن withReplacement ليست قيمة منطقية ثابتة.

variant-select-weight-disables-unique = تتعطل النسخ الفريدة في select عند وجود خيار يحدد selectWeight أو selectForVariants

variant-coprime-undetermined = تعذّر تحديد النسخ الفريدة للمكوّن { $component } لأنه تعذّر التأكد من أن coprime خطأ دائمًا.

variant-attribute-not-constant = تعذّر تحديد النسخ الفريدة للمكوّن { $component } لأن { $attribute } ليست ثابتة.

variant-attribute-not-number = تعذّر تحديد النسخ الفريدة للمكوّن { $component } لأن { $attribute } ليست رقمًا.

variant-attribute-wrong-type-for-sequence =
    تعذّر تحديد النسخ الفريدة للمكوّن { $component } من النوع { $type } لأن { $attribute } ليست { $expected ->
        [letters-combination] تركيبًا من الحروف
        [math-expression] تعبيرًا رياضيًا صالحًا
        [integer] عددًا صحيحًا
       *[number] رقمًا
    }.

variant-length-not-integer = تعذّر تحديد النسخ الفريدة للمكوّن { $component } لأن length ليست عددًا صحيحًا.

variant-sort-not-implemented = لم تُطبَّق النسخ الفريدة لمكوّن { $component } مع sort

variant-exclude-combinations-not-implemented = لم تُطبَّق النسخ الفريدة لمكوّن { $component } مع excludeCombinations

variant-math-exclude-not-implemented = لم تُطبَّق النسخ الفريدة لمكوّن { $component } من النوع math مع exclude

variant-non-constant-exclude-not-implemented = لم تُطبَّق النسخ الفريدة لمكوّن { $component } مع exclude غير ثابتة

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: غير مدعوم في عارض prefigure للرسوم البيانية؛ تم تخطي العنصر التابع.

prefigure-descendant-invalid-geometry = { $subject }: هندسة غير منتهية أو غير مكتملة؛ تم تخطي العنصر التابع.

prefigure-curve-label-omitted = { $subject }: التسميات غير مدعومة على عناصر المنحنيات المحوَّلة؛ تم حذف التسمية.

prefigure-curve-unsupported-definition-type = { $subject }: نوع تعريف دالة المنحنى '{ $definitionType }' غير مدعوم؛ تم تخطي العنصر التابع.

prefigure-region-flip-functions-unsupported = { $subject }: السمة flipFunctions غير مدعومة على regionBetweenCurves؛ تم تخطي العنصر التابع.

prefigure-region-non-formula-child = { $subject }: لا تُدعم على regionBetweenCurves سوى الدوال الأبناء المعرَّفة بصيغة؛ تم تخطي العنصر التابع.

# «مع» rather than a preposition welded to the placeable: the variants below
# are Arabic words, and «لـ» would have to be written against one of them.
prefigure-label-position-unsupported =
    { $subject }: القيمة labelPosition '{ $labelPosition }' غير مدعومة مع { $labelKind ->
        [line-family] تسمية من عائلة المستقيمات
       *[point] تسمية نقطة
    }؛ تم استخدام محاذاة PreFigure الافتراضية.

prefigure-fill-style-unsupported = { $subject }: نمط التعبئة '{ $fillStyle }' غير مدعوم في PreFigure؛ سيتم استخدام تعبئة صلبة.

prefigure-line-style-unknown = { $subject }: نمط الخط '{ $lineStyle }' غير معروف وتم حذفه من مخرجات PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: تم تحويل نمط العلامة '{ $markerStyle }' إلى نمط PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: نمط العلامة '{ $markerStyle }' غير مدعوم في PreFigure؛ تم استخدام النمط الافتراضي.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: قيمة `ref` غير صالحة؛ تعذّر تحديد الهدف. تم حذف التعليق التوضيحي.

annotation-ref-multiple-targets = `<annotation>`: أدّت `ref` إلى أكثر من هدف؛ سيتم استخدام الهدف الأول.

annotation-ref-outside-graph = `<annotation>`: قيمة `ref` غير صالحة؛ الهدف خارج الرسم البياني الحاوي. تم حذف التعليق التوضيحي.

annotation-ref-unsupported-target = `<annotation>`: قيمة `ref` غير صالحة؛ الهدف ليس كائنًا رسوميًا مدعومًا في التحويل إلى prefigure. تم حذف التعليق التوضيحي.

annotation-text-missing = `<annotation>`: القيمة `text` مفقودة أو فارغة؛ سيتم إخراج نص فارغ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] تم رصد اعتماد دائري.
       *[other] تم رصد اعتماد دائري يشمل مكوّن `<{ $componentType }>`.
    }

reference-no-referent = لم يُعثر على عنصر يشير إليه المرجع: `{ $reference }`

reference-multiple-referents = وُجد أكثر من عنصر يشير إليه المرجع: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = صيغة غير صالحة للسمة { $attribute } في `<{ $componentType }>`.

children-invalid = أبناء غير صالحين في `<{ $componentType }>`: وُجد أبناء غير صالحين: { $children }

## Falling back to a default

attribute-value-invalid-using-default = القيمة `{ $value }` غير صالحة للسمة `{ $attribute }`، سيتم استخدام القيمة `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] لم يُعثر على إصدار DoenetML رقم { $version }.
       *[other] لم يُعثر على إصدار DoenetML رقم { $version }. سيتم الرجوع إلى الإصدار { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML غير صالح: { $content }

parse-tag-missing-close-tag = DoenetML غير صالح: الوسم `{ $tag }` بلا وسم إغلاق. كان المتوقع وسمًا ذاتي الإغلاق أو وسم `</{ $tagName }>`.

parse-tag-error = DoenetML غير صالح: خطأ في الوسم `<{ $tagName }>`

parse-attribute-missing-value = DoenetML غير صالح: يبدو أن السمة غير الصالحة `{ $attribute }` تنقصها قيمة.

parse-attribute-invalid = DoenetML غير صالح: السمة `{ $attribute }` غير صالحة

parse-attribute-value-invalid = DoenetML غير صالح: قيمة السمة `{ $value }` غير صالحة

parse-attribute-value-quote-mismatch = DoenetML غير صالح: قيمة السمة `{ $value }` غير صالحة. علامتا الاقتباس غير متطابقتين. يبدو أن العلامة `{ $quote }` مفقودة

parse-open-tag-name-missing = DoenetML غير صالح: وُجد وسم بلا اسم، مثل `<`

parse-tag-not-closed = DoenetML غير صالح: الوسم `{ $tag }` لم يُغلق (يبدو أن `>` مفقودة).

parse-self-closing-tag-name-missing = DoenetML غير صالح: وُجد وسم بلا اسم `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML غير صالح: الوسم `{ $tag }` لم يُغلق (يبدو أن `/>` مفقودة).

parse-tag-invalid-attributes = DoenetML غير صالح: الوسم `{ $tag }` غير صالح. قد تكون سماته غير صحيحة.

parse-close-tag-name-missing = DoenetML غير صالح: وُجد وسم إغلاق بلا اسم، مثل `</`

parse-attribute-value-unquoted = يجب وضع قيم السمات بين علامتي اقتباس: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML غير صالح: وُجد وسم الإغلاق `{ $tag }` بلا وسم فتح مقابل

parse-close-tag-mismatched = DoenetML غير صالح: وسم إغلاق غير متطابق. كان المتوقع `</{ $expected }>`. وُجد `{ $found }`

parser-node-unconvertible = تعذّر تحويل العقدة { $node } إلى عقدة Dast.

## Names

name-attribute-invalid =
    السمة name='{ $name }' غير صالحة. { $reason ->
        [characters] يمكن أن تحتوي الأسماء على حروف وأرقام وشرطات سفلية وشرطات فقط.
       *[start] يجب أن تبدأ الأسماء بحرف.
    }

component-name-invalid-start = اسم المكوّن "{ $name }" غير صالح. يجب أن تبدأ الأسماء بحرف.

## `<answer>` sugar

answer-video-watched-missing-video = يجب أن يكون للإجابة من النوع videoWatched سمة video

answer-video-watched-video-not-reference = يجب أن تكون سمة video للإجابة من النوع videoWatched مرجعًا

answer-name-not-single-text = يجب أن تحتوي سمة name للإجابة على ابن نصي واحد

## Referencing another document

external-doenetml-recursion-limit = تعذّر جلب DoenetML الخارجي بسبب كثرة مستويات التكرار. هل هناك مرجع دائري؟

external-doenetml-unavailable = تعذّر جلب DoenetML من { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML المجلوب من { $attribute }="{ $uri }" غير صالح: لا يطابق نوع المكوّن "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] السمة `{ $from }` مهملة؛ يجب استخدام `{ $to }` بدلًا منها.
       *[other] [deprecation] السمة `{ $from }` في `<{ $component }>` مهملة؛ يجب استخدام `{ $to }` بدلًا منها.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] السمة `{ $from }` مهملة وتم تجاهلها لأن `{ $to }` محددة أيضًا.
       *[other] [deprecation] السمة `{ $from }` في `<{ $component }>` مهملة وتم تجاهلها لأن `{ $to }` محددة أيضًا.
    }

deprecated-attribute-ignored = [deprecation] السمة `{ $attribute }` في `<{ $component }>` مهملة وتم تجاهلها.


## Language coverage

pluralize-english-only = يستطيع `<pluralize>` جمع الكلمات الإنجليزية فقط، لذا يُترك نصه كما كتبه المؤلف في مستند مكتوب بلغة { $locale }. يجب كتابة صيغة الجمع مباشرة، أو ضبطها بالسمة `pluralForm`.


## Checking against the schema

schema-element-unrecognized = العنصر `<{ $tag }>` ليس عنصرًا معروفًا في Doenet.

schema-element-not-allowed-at-root = العنصر `<{ $tag }>` غير مسموح به في جذر المستند.

schema-element-not-allowed-inside = العنصر `<{ $tag }>` غير مسموح به داخل `<{ $parent }>`.

schema-attribute-unrecognized = العنصر `<{ $tag }>` ليس له سمة باسم `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] يجب أن تكون السمة `{ $attribute }` في العنصر `<{ $tag }>` قائمة كل عنصر فيها واحد مما يلي: { $allowed }
       *[other] يجب أن تكون السمة `{ $attribute }` في العنصر `<{ $tag }>` واحدة مما يلي: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = اسم نسخة غير صالح في select. اسم النسخة { $variantName } يظهر في { $numOptions } خيارات بينما العدد المطلوب اختياره هو { $numToSelect }.

select-variant-name-without-options = حُددت بعض النسخ في select لكن لم تُحدد خيارات لاسم النسخة الممكن: { $variantName }.

select-variant-name-not-possible = اسم النسخة { $variantName } المحدد في select ليس اسم نسخة ممكنًا.

select-too-few-options = لا يمكن اختيار { $numToSelect } مكوّنات من { $numOptions } فقط.

select-from-sequence-too-few-values = لا يمكن اختيار { $numToSelect } قيم من متتالية طولها { $length }.

select-from-sequence-indices-count-mismatch = يجب أن يطابق عدد المؤشرات المحددة في select العدد المطلوب اختياره

select-from-sequence-indices-not-integers = يجب أن تكون كل المؤشرات المحددة في select أعدادًا صحيحة

select-from-sequence-index-excluded = المؤشر المحدد في selectfromsequence مستبعد

select-from-sequence-indices-excluded-combination = المؤشرات المحددة في selectfromsequence تشكّل تركيبًا مستبعدًا

select-from-sequence-coprime-not-positive-integers = لا يمكن اختيار تركيبات أولية فيما بينها لأن الاختيار ليس من الأعداد الصحيحة الموجبة.

select-from-sequence-coprime-common-factor = لا يمكن اختيار أعداد أولية فيما بينها. كل القيم الممكنة تشترك في عامل مشترك. (يجب أن تكون القيمة المحددة في "from" أو "to" أولية بالنسبة إلى "step".)

select-from-sequence-coprime-single-number = لا يمكن اختيار تركيبات أولية فيما بينها من عدد واحد غير 1.

select-from-sequence-excluded-too-many-combinations = تم استبعاد أكثر من 70% من التركيبات في selectFromSequence

select-from-sequence-coprime-none-found = تعذّر اختيار أعداد أولية فيما بينها. كل القيم الممكنة تشترك في عامل مشترك.

select-from-sequence-too-few-unique-values = لا يمكن اختيار { $numToSelect } قيم فريدة من متتالية طولها { $numPossibleValues }

select-prime-numbers-too-few-values = لا يمكن اختيار { $numToSelect } قيم من قائمة أعداد أولية طولها { $numValues }

select-prime-numbers-values-count-mismatch = يجب أن يطابق عدد القيم المحددة في select العدد المطلوب اختياره

select-prime-numbers-values-not-prime = يجب أن تكون كل القيم المحددة في select prime number ضمن قائمة الأعداد الأولية

select-prime-numbers-values-excluded-combination = القيم المحددة في selectPrimeNumbers تشكّل تركيبًا مستبعدًا

select-prime-numbers-excluded-too-many-combinations = تم استبعاد أكثر من 70% من التركيبات في selectPrimeNumbers

select-random-combination-fluke = بمصادفة بالغة الندرة، تعذّر اختيار تركيب من القيم العشوائية

select-random-value-fluke = بمصادفة بالغة الندرة، تعذّر اختيار قيمة عشوائية
