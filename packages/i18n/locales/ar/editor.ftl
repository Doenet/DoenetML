# Arabic editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register: impersonal, as in `chrome.ftl` — a control is a verbal noun and an
# instruction is «يمكن …» or a passive, never an imperative.
#
# Several messages restructure their English rather than translating it in
# place. Where English interpolates a bare verb («Click to { $action }
# accessibility report»), Arabic would have to attach the preposition «لـ» to
# whatever the placeable rendered, so the selector carries the whole clause
# instead. Fluent does not care where a select sits inside a pattern, and a
# preposition welded to an argument is not something a translation can undo.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] إعادة تعيين
       *[update] تحديث
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } العارض
       *[other] { $word } العارض { $shortcut }
    }


## The variant picker

editor-variant = نسخة
editor-variant-filter = تصفية...
editor-variant-next = اختيار النسخة التالية
editor-variant-previous = اختيار النسخة السابقة


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] تم رصد مخالفة لإمكانية الوصول وفق WCAG AA. { $action ->
            [close] انقر لإغلاق تقرير إمكانية الوصول.
           *[open] انقر لفتح تقرير إمكانية الوصول.
        }
        [advisories] { $action ->
            [close] انقر لإغلاق تقرير إمكانية الوصول.
           *[open] انقر لفتح تقرير إمكانية الوصول.
        } لم تُرصد مخالفات لمعيار WCAG AA، لكن هناك توصيات إضافية بشأن إمكانية الوصول.
       *[clean] { $action ->
            [close] انقر لإغلاق تقرير إمكانية الوصول.
           *[open] انقر لفتح تقرير إمكانية الوصول.
        } لم تُرصد أي مشكلات في إمكانية الوصول.
    }

editor-accessibility-label =
    { $status ->
        [violations] تم رصد مخالفة لإمكانية الوصول وفق WCAG AA. { $count ->
            [one] وُجدت مخالفة واحدة لمعيار WCAG AA.
            [two] وُجدت مخالفتان لمعيار WCAG AA.
            [few] وُجدت { $count } مخالفات لمعيار WCAG AA.
            [many] وُجدت { $count } مخالفة لمعيار WCAG AA.
           *[other] وُجدت { $count } مخالفة لمعيار WCAG AA.
        } { $action ->
            [close] انقر لإغلاق تقرير إمكانية الوصول.
           *[open] انقر لفتح تقرير إمكانية الوصول.
        }
        [advisories] لم تُرصد مخالفات لمعيار WCAG AA. { $count ->
            [one] وُجدت توصية إضافية واحدة بشأن إمكانية الوصول.
            [two] وُجدت توصيتان إضافيتان بشأن إمكانية الوصول.
            [few] وُجدت { $count } توصيات إضافية بشأن إمكانية الوصول.
            [many] وُجدت { $count } توصية إضافية بشأن إمكانية الوصول.
           *[other] وُجدت { $count } توصية إضافية بشأن إمكانية الوصول.
        } { $action ->
            [close] انقر لإغلاق تقرير إمكانية الوصول.
           *[open] انقر لفتح تقرير إمكانية الوصول.
        }
       *[clean] لم تُرصد مخالفات لمعيار WCAG AA. { $action ->
            [close] انقر لإغلاق تقرير إمكانية الوصول.
           *[open] انقر لفتح تقرير إمكانية الوصول.
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = إصدار DoenetML { $version }

editor-tab-help = مساعدة حسب السياق
editor-tab-help-short = السياق
editor-tab-errors = الأخطاء
editor-tab-warnings = التحذيرات
editor-tab-info = معلومات
editor-tab-accessibility = إمكانية الوصول
editor-tab-responses = الإجابات المرسلة

editor-tab-with-count = { $label }: { $count }

editor-options = خيارات المحرر
editor-format-as-doenetml = تنسيق بصيغة DoenetML
editor-format-as-xml = تنسيق بصيغة XML


## The diagnostics panel

# «رقم» stands in for English's `#`, which is not how Arabic marks an ordinal.
editor-diagnostic-line = السطر رقم { $line }

editor-no-errors = لا أخطاء
editor-no-warnings = لا تحذيرات
editor-no-info = لا تشخيصات معلوماتية

editor-show-info-annotations = إظهار التشخيصات المعلوماتية في المحرر
editor-show-accessibility-annotations = إظهار تشخيصات إمكانية الوصول في المحرر

editor-accessibility-learn-more = التعرّف على نهج Doenet في إمكانية الوصول

editor-accessibility-violations-heading = مخالفات إمكانية الوصول ({ $standard })

editor-accessibility-other-heading = مشكلات أخرى في إمكانية الوصول
editor-none-found = لا يوجد


## Submitted responses

editor-no-responses = لا توجد إجابات مرسلة بعد
editor-response-answer-id = معرّف الإجابة
editor-response-response = الإجابة
editor-response-credit = الدرجة
editor-response-submitted = تاريخ الإرسال


## The context-help panel

help-placeholder = يُرجى وضع المؤشر على اسم عنصر أو سمة أو { $ref } لعرض التوثيق.

help-unsupported-ref-chain = المساعدة للمراجع متعددة الأجزاء مثل { $example } غير مدعومة بعد.

# Restructured around the reference rather than after a colon, so that no
# preposition has to be attached to `{ $ref }`.
help-unresolved-ref =
    { $reason ->
        [notFound] لم يُعثر على عنصر تشير إليه { $ref }.
        [multiple] وُجد أكثر من عنصر تشير إليه { $ref }.
       *[indeterminate] تعذّر تحديد العنصر الذي تشير إليه { $ref }.
    }

# The arrow is direction rather than punctuation, and this is the first
# catalog that runs the other way: it points to where the reader is going,
# which here is leftwards.
help-learn-about-references = التعرّف على المراجع ←
help-reference-page = صفحة المرجع ←

help-suggestions-header =
    { $location ->
        [inside] داخل { $element }
       *[top] في المستوى الأعلى
    }{ $allowed ->
        [none] { " — لا شيء يوضع هنا." }
        [text] { " — يمكن كتابة نص هنا." }
        [text-and-components] { " — يمكن كتابة نص هنا، أو تجربة:" }
       *[components] { " — أشياء يمكن تجربتها:" }
    }

# No plural select: «المكوّنات البالغ عددها …» counts by apposition rather than
# by agreement, so one phrase is correct for every value of `$total`.
help-suggestions-footer = يمكن الضغط على { $shortcut } لعرض المكوّنات البالغ عددها { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } مرجع إلى { $target }.
       *[other] { $ref } مرجع إلى { $target } (السطر { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] أنشأه { $owner } بوصفه { $role }.
       *[other] أنشأه { $owner } في السطر { $line } بوصفه { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } مرجع إلى الخاصية { $property } في العنصر { $element }.
       *[other] { $ref } مرجع إلى الخاصية { $property } في العنصر { $element } (السطر { $line }).
    }

help-kind-attribute = سمة
help-kind-snippet = مقتطف
help-kind-array-entry = عنصر مصفوفة

help-default = القيمة الافتراضية:
help-active-default = القيمة الافتراضية الفعّالة:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] القيم المسموح بها (واحدة لكل عنصر):
       *[other] القيم المسموح بها:
    }

help-suggested-values = القيم المقترحة:

help-inserts = يُدرج:

help-coordinates =
    { $count ->
        [one] الإحداثي:
        [two] الإحداثيان:
       *[other] الإحداثيات:
    }

help-type = النوع:

help-resolved-style = النمط المحسوب (styleNumber { $styleNumber }):

help-resolved-function-names = أسماء الدوال المحسوبة:
help-reset-list = إعادة تعيين القائمة على هذا الإدخال:
help-added-on-input = يُضاف عند هذا الإدخال:
help-removed-on-input = يُزال عند هذا الإدخال:

help-reset-overrides = { $reset } يتجاوز { $additional } و{ $removed }.
