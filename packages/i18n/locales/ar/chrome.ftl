# Arabic viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register: impersonal throughout. A control is named by a verbal noun
# («إضافة صف», not «أضف صفًا») and an instruction is put in the passive
# («يُرجى إعادة تحميل الصفحة»), so that nothing here has to choose how
# formally a deployment addresses its readers, or whether it addresses one or
# several.
#
# Counted nouns select on all of Arabic's plural categories. `zero` is the
# category for exactly none, so it takes over the `[0]` branch English spells
# out by number.


## Answer submission

answer-checking = جارٍ التحقق...
answer-submitting = جارٍ الإرسال...
answer-checking-status = جارٍ التحقق من الإجابة
answer-submitting-status = جارٍ إرسال الإجابة
answer-correct = صحيح
answer-incorrect = غير صحيح
answer-response-saved = تم حفظ الإجابة
# Arabic writes no space before the percent sign, so `-short` differs from the
# English it renders beside.
answer-percent-credit = { $percent }% من الدرجة
answer-percent-correct = { $percent }% صحيح
answer-percent-short = { $percent }%
max-credit-available = الحد الأقصى للدرجة المتاحة: { $percent }%
attempts-remaining =
    { $count ->
        [zero] لا محاولات متبقية
        [one] بقيت محاولة واحدة
        [two] بقيت محاولتان
        [few] بقيت { $count } محاولات
        [many] بقيت { $count } محاولة
       *[other] بقيت { $count } محاولة
    }
# Named rather than adjectival: read aloud after a field's own name, «(صحيحة)»
# alone would leave a listener to guess what agreed with it.
validation-correct = (إجابة صحيحة)
validation-incorrect = (إجابة غير صحيحة)
validation-partially-correct = (إجابة صحيحة جزئيًا)
answer-show-responses =
    { $count ->
        [zero] عرض الإجابات المرسلة إلى { $answerId }
        [one] عرض إجابة واحدة مرسلة إلى { $answerId }
        [two] عرض إجابتين مرسلتين إلى { $answerId }
        [few] عرض { $count } إجابات مرسلة إلى { $answerId }
        [many] عرض { $count } إجابة مرسلة إلى { $answerId }
       *[other] عرض { $count } إجابة مرسلة إلى { $answerId }
    }

## Disclosure panels

feedback-heading = ملاحظات
collapsible-click-to-open = (النقر للفتح)
collapsible-click-to-close = (النقر للإغلاق)
collapsible-initializing = جارٍ التهيئة...
footnote-show = إظهار الحاشية
footnote-hide = إخفاء الحاشية
description-more-information = مزيد من المعلومات

## Controls

slider-previous = السابق
slider-next = التالي
keyboard-open = فتح لوحة المفاتيح
keyboard-close = إغلاق لوحة المفاتيح
choice-input-remove-choice = حذف { $choice }
matrix-remove-row = حذف صف
matrix-add-row = إضافة صف
matrix-remove-column = حذف عمود
matrix-add-column = إضافة عمود
subset-add-remove-points = إضافة/حذف نقاط
subset-toggle-points-intervals = التبديل بين النقاط والفترات
subset-move-points = تحريك النقاط
subset-clear = مسح
orbital-add-row = إضافة صف
orbital-remove-row = حذف صف
orbital-add-box = إضافة مربع
orbital-remove-box = حذف مربع
orbital-add-up-arrow = إضافة سهم لأعلى
orbital-add-down-arrow = إضافة سهم لأسفل
orbital-remove-arrow = حذف سهم
orbital-row-label = تسمية الصف { $row }
pretzel-answer = الإجابة
# «للعمود» names what `$column` is, so that the sentence does not have to
# attach a one-letter preposition to a placeable.

## Math input

math-input-preview-region = معاينة التعبير الرياضي
math-input-preview = معاينة
math-input-invalid-expression = تعبير غير صالح:

## Document status

viewer-initializing = جارٍ التهيئة...

## Errors

error-heading = خطأ
error-found-at =
    { $span ->
        [line] وُجد في السطر { $startLine }.
       *[lines] وُجد في الأسطر من { $startLine } إلى { $endLine }.
    }
document-contains-errors = يحتوي هذا المستند على أخطاء!
# Headings of the tooltip the editor shows over a squiggle.
diagnostic-heading-error = خطأ
diagnostic-heading-warning = تحذير
diagnostic-heading-information = معلومات
diagnostic-heading-hint = تلميح
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = مخالفة لإمكانية الوصول وفق WCAG AA
accessibility-heading-level-2 = تنبيه بشأن إمكانية الوصول
something-went-wrong = حدث خطأ ما.
# Follows `error-heading` and a colon.
renderer-load-failed = تعذّر تحميل أحد المكوّنات. يُرجى إعادة تحميل الصفحة.
core-start-failed = تعذّر بدء عارض المستند. يُرجى إعادة تحميل الصفحة.
