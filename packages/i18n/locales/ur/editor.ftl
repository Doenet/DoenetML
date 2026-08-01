# Urdu editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register as in `chrome.ftl`: the polite plural, and «۔» for a full stop.
#
# Where English interpolates a bare verb — "Click to { $action } accessibility
# report" — Urdu puts its verb at the end of the clause and cannot take one
# dropped into the middle, so the selector carries the whole sentence. Fluent
# does not care where a select sits inside a pattern.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] دوبارہ ترتیب
       *[update] تازہ کاری
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] ناظر کی { $word }
       *[other] ناظر کی { $word } { $shortcut }
    }


## The variant picker

editor-variant = نسخہ
editor-variant-filter = چھانٹیں...
editor-variant-next = اگلا نسخہ منتخب کریں
editor-variant-previous = پچھلا نسخہ منتخب کریں


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA کے مطابق رسائی کی خلاف ورزی سامنے آئی۔ { $action ->
            [close] رسائی کی رپورٹ بند کرنے کے لیے کلک کریں۔
           *[open] رسائی کی رپورٹ کھولنے کے لیے کلک کریں۔
        }
        [advisories] { $action ->
            [close] رسائی کی رپورٹ بند کرنے کے لیے کلک کریں۔
           *[open] رسائی کی رپورٹ کھولنے کے لیے کلک کریں۔
        } WCAG AA کی کوئی خلاف ورزی نہیں ملی، مگر رسائی سے متعلق مزید تجاویز موجود ہیں۔
       *[clean] { $action ->
            [close] رسائی کی رپورٹ بند کرنے کے لیے کلک کریں۔
           *[open] رسائی کی رپورٹ کھولنے کے لیے کلک کریں۔
        } رسائی سے متعلق کوئی مسئلہ نہیں ملا۔
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA کے مطابق رسائی کی خلاف ورزی سامنے آئی۔ WCAG AA کی { $count } خلاف ورزیاں ملیں۔ { $action ->
            [close] رسائی کی رپورٹ بند کرنے کے لیے کلک کریں۔
           *[open] رسائی کی رپورٹ کھولنے کے لیے کلک کریں۔
        }
        [advisories] WCAG AA کی کوئی خلاف ورزی سامنے نہیں آئی۔ رسائی سے متعلق { $count } مزید تجاویز ملیں۔ { $action ->
            [close] رسائی کی رپورٹ بند کرنے کے لیے کلک کریں۔
           *[open] رسائی کی رپورٹ کھولنے کے لیے کلک کریں۔
        }
       *[clean] WCAG AA کی کوئی خلاف ورزی سامنے نہیں آئی۔ { $action ->
            [close] رسائی کی رپورٹ بند کرنے کے لیے کلک کریں۔
           *[open] رسائی کی رپورٹ کھولنے کے لیے کلک کریں۔
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML کا نسخہ { $version }

editor-tab-help = سیاق کے مطابق مدد
editor-tab-help-short = سیاق
editor-tab-errors = خرابیاں
editor-tab-warnings = تنبیہات
editor-tab-info = معلومات
editor-tab-accessibility = رسائی
editor-tab-responses = بھیجے گئے جواب

editor-tab-with-count = { $label }: { $count }

editor-options = مدوّن کی ترتیبات
editor-format-as-doenetml = DoenetML کے طور پر ترتیب دیں
editor-format-as-xml = XML کے طور پر ترتیب دیں


## The diagnostics panel

editor-diagnostic-line = سطر نمبر { $line }

editor-no-errors = کوئی خرابی نہیں
editor-no-warnings = کوئی تنبیہ نہیں
editor-no-info = کوئی معلوماتی تشخیص نہیں

editor-show-info-annotations = مدوّن میں معلوماتی تشخیصات دکھائیں
editor-show-accessibility-annotations = مدوّن میں رسائی کی تشخیصات دکھائیں

editor-accessibility-learn-more = رسائی کے بارے میں Doenet کا طریقہ جانیں

editor-accessibility-violations-heading = رسائی کی خلاف ورزیاں ({ $standard })

editor-accessibility-other-heading = رسائی کے دیگر مسائل
editor-none-found = کچھ نہیں ملا


## Submitted responses

editor-no-responses = ابھی تک کوئی جواب نہیں بھیجا گیا
editor-response-answer-id = جواب کی شناخت
editor-response-response = جواب
editor-response-credit = نمبر
editor-response-submitted = بھیجنے کا وقت


## The context-help panel

help-placeholder = دستاویزات دیکھنے کے لیے کرسر کو کسی عنصر کے نام، کسی صفت یا { $ref } پر رکھیں۔

help-unsupported-ref-chain = { $example } جیسے کئی حصوں والے حوالوں کی مدد ابھی دستیاب نہیں۔

help-unresolved-ref =
    { $reason ->
        [notFound] { $ref } جس عنصر کی طرف اشارہ کرتا ہے وہ نہیں ملا۔
        [multiple] { $ref } جن عناصر کی طرف اشارہ کرتا ہے وہ ایک سے زیادہ ہیں۔
       *[indeterminate] { $ref } کس عنصر کی طرف اشارہ کرتا ہے، یہ طے نہیں ہو سکا۔
    }

# The arrow is direction rather than punctuation, and Urdu runs the other way,
# so it points where the reader is going.
help-learn-about-references = حوالوں کے بارے میں جانیں ←
help-reference-page = حوالہ صفحہ ←

help-suggestions-header =
    { $location ->
        [inside] { $element } کے اندر
       *[top] سب سے اوپر کی سطح پر
    }{ $allowed ->
        [none] { " — یہاں کچھ نہیں آتا۔" }
        [text] { " — یہاں متن لکھا جا سکتا ہے۔" }
        [text-and-components] { " — یہاں متن لکھا جا سکتا ہے، یا یہ آزمائیں:" }
       *[components] { " — آزمانے کے لیے چیزیں:" }
    }

help-suggestions-footer = تمام { $total } اجزا دیکھنے کے لیے { $shortcut } دبائیں۔

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ایک حوالہ ہے { $target } کا۔
       *[other] { $ref } ایک حوالہ ہے { $target } کا (سطر { $line })۔
    }

help-ref-derived-from =
    { $line ->
        [none] اسے { $owner } نے { $role } کے طور پر متعارف کرایا۔
       *[other] اسے { $owner } نے سطر { $line } پر { $role } کے طور پر متعارف کرایا۔
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ایک حوالہ ہے { $element } کی { $property } خاصیت کا۔
       *[other] { $ref } ایک حوالہ ہے { $element } کی { $property } خاصیت کا (سطر { $line })۔
    }

help-kind-attribute = صفت
help-kind-snippet = ٹکڑا
help-kind-array-entry = صف کا عنصر

help-default = طے شدہ قیمت:
help-active-default = فعال طے شدہ قیمت:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] جائز قیمتیں (ہر عنصر کے لیے ایک):
       *[other] جائز قیمتیں:
    }

help-suggested-values = تجویز کردہ قیمتیں:

help-inserts = داخل کرتا ہے:

help-coordinates =
    { $count ->
        [one] محور:
       *[other] محاور:
    }

help-type = قسم:

help-resolved-style = طے شدہ اسلوب (styleNumber { $styleNumber }):

help-resolved-function-names = طے شدہ دالوں کے نام:
help-reset-list = اس اندراج پر فہرست دوبارہ ترتیب دیں:
help-added-on-input = اس اندراج پر شامل ہوا:
help-removed-on-input = اس اندراج پر ہٹایا گیا:

help-reset-overrides = { $reset } کو { $additional } اور { $removed } پر ترجیح حاصل ہے۔
