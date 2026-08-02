# Persian editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register as in `chrome.ftl`: verbal nouns for controls, polite plural for a
# sentence addressed to the reader.
#
# Where English interpolates a bare verb — "Click to { $action } accessibility
# report" — the Persian verb comes at the end of its clause and cannot be
# dropped into the middle of one, so the selector carries the whole sentence.
# Fluent does not care where a select sits inside a pattern.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] بازنشانی
       *[update] به‌روزرسانی
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } نمایشگر
       *[other] { $word } نمایشگر { $shortcut }
    }


## The variant picker

editor-variant = نسخه
editor-variant-filter = فیلتر...
editor-variant-next = انتخاب نسخهٔ بعدی
editor-variant-previous = انتخاب نسخهٔ قبلی


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] نقض دسترس‌پذیری بر پایهٔ WCAG AA شناسایی شد. { $action ->
            [close] برای بستن گزارش دسترس‌پذیری کلیک کنید.
           *[open] برای باز کردن گزارش دسترس‌پذیری کلیک کنید.
        }
        [advisories] { $action ->
            [close] برای بستن گزارش دسترس‌پذیری کلیک کنید.
           *[open] برای باز کردن گزارش دسترس‌پذیری کلیک کنید.
        } هیچ نقضی از WCAG AA یافت نشد، اما توصیه‌های دسترس‌پذیری دیگری در دسترس است.
       *[clean] { $action ->
            [close] برای بستن گزارش دسترس‌پذیری کلیک کنید.
           *[open] برای باز کردن گزارش دسترس‌پذیری کلیک کنید.
        } هیچ مشکل دسترس‌پذیری یافت نشد.
    }

editor-accessibility-label =
    { $status ->
        [violations] نقض دسترس‌پذیری بر پایهٔ WCAG AA شناسایی شد. { $count } نقض WCAG AA یافت شد. { $action ->
            [close] برای بستن گزارش دسترس‌پذیری کلیک کنید.
           *[open] برای باز کردن گزارش دسترس‌پذیری کلیک کنید.
        }
        [advisories] هیچ نقضی از WCAG AA شناسایی نشد. { $count } توصیهٔ دسترس‌پذیری دیگر یافت شد. { $action ->
            [close] برای بستن گزارش دسترس‌پذیری کلیک کنید.
           *[open] برای باز کردن گزارش دسترس‌پذیری کلیک کنید.
        }
       *[clean] هیچ نقضی از WCAG AA شناسایی نشد. { $action ->
            [close] برای بستن گزارش دسترس‌پذیری کلیک کنید.
           *[open] برای باز کردن گزارش دسترس‌پذیری کلیک کنید.
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = نسخهٔ DoenetML { $version }

editor-tab-help = راهنمای وابسته به بافت
editor-tab-help-short = بافت
editor-tab-errors = خطاها
editor-tab-warnings = هشدارها
editor-tab-info = اطلاعات
editor-tab-accessibility = دسترس‌پذیری
editor-tab-responses = پاسخ‌های ارسال‌شده

editor-tab-with-count = { $label }: { $count }

editor-options = تنظیمات ویرایشگر
editor-format-as-doenetml = قالب‌بندی به شکل DoenetML
editor-format-as-xml = قالب‌بندی به شکل XML


## The diagnostics panel

editor-diagnostic-line = سطر شمارهٔ { $line }

editor-no-errors = بدون خطا
editor-no-warnings = بدون هشدار
editor-no-info = بدون تشخیص اطلاعاتی

editor-show-info-annotations = نمایش تشخیص‌های اطلاعاتی در ویرایشگر
editor-show-accessibility-annotations = نمایش تشخیص‌های دسترس‌پذیری در ویرایشگر

editor-accessibility-learn-more = آشنایی با رویکرد Doenet به دسترس‌پذیری

editor-accessibility-violations-heading = نقض‌های دسترس‌پذیری ({ $standard })

editor-accessibility-other-heading = مسائل دیگر دسترس‌پذیری
editor-none-found = چیزی یافت نشد


## Submitted responses

editor-no-responses = هنوز پاسخی ارسال نشده است
editor-response-answer-id = شناسهٔ پاسخ
editor-response-response = پاسخ
editor-response-credit = نمره
editor-response-submitted = زمان ارسال


## The context-help panel

help-placeholder = برای دیدن مستندات، مکان‌نما را روی نام یک عنصر، یک ویژگی یا { $ref } ببرید.

help-unsupported-ref-chain = راهنما برای ارجاع‌های چندبخشی مانند { $example } هنوز پشتیبانی نمی‌شود.

help-unresolved-ref =
    { $reason ->
        [notFound] عنصری که { $ref } به آن اشاره کند یافت نشد.
        [multiple] بیش از یک عنصر یافت شد که { $ref } به آن اشاره می‌کند.
       *[indeterminate] عنصری که { $ref } به آن اشاره می‌کند مشخص نشد.
    }

# The arrow is direction rather than punctuation, and Persian runs the other
# way, so it points where the reader is going.
help-learn-about-references = آشنایی با ارجاع‌ها ←
help-reference-page = صفحهٔ مرجع ←

help-suggestions-header =
    { $location ->
        [inside] درون { $element }
       *[top] در بالاترین سطح
    }{ $allowed ->
        [none] { " — اینجا چیزی قرار نمی‌گیرد." }
        [text] { " — اینجا می‌توان متن نوشت." }
        [text-and-components] { " — اینجا می‌توان متن نوشت، یا این‌ها را آزمود:" }
       *[components] { " — چیزهایی برای آزمودن:" }
    }

help-suggestions-footer = برای دیدن هر { $total } مؤلفه { $shortcut } را بفشارید.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ارجاعی است به { $target }.
       *[other] { $ref } ارجاعی است به { $target } (سطر { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } آن را به شکل { $role } معرفی کرده است.
       *[other] { $owner } آن را در سطر { $line } به شکل { $role } معرفی کرده است.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ارجاعی است به ویژگی { $property } در عنصر { $element }.
       *[other] { $ref } ارجاعی است به ویژگی { $property } در عنصر { $element } (سطر { $line }).
    }

help-kind-attribute = ویژگی
help-kind-snippet = قطعه
help-kind-array-entry = درایهٔ آرایه

help-default = مقدار پیش‌فرض:
help-active-default = مقدار پیش‌فرض فعال:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] مقادیر مجاز (یکی برای هر درایه):
       *[other] مقادیر مجاز:
    }

help-suggested-values = مقادیر پیشنهادی:

help-inserts = درج می‌کند:

help-coordinates =
    { $count ->
        [one] مختصات:
       *[other] مختصات:
    }

help-type = نوع:

help-resolved-style = سبک محاسبه‌شده (styleNumber { $styleNumber }):

help-resolved-function-names = نام‌های محاسبه‌شدهٔ توابع:
help-reset-list = بازنشانی فهرست روی این ورودی:
help-added-on-input = افزوده‌شده در این ورودی:
help-removed-on-input = حذف‌شده در این ورودی:

help-reset-overrides = { $reset } بر { $additional } و { $removed } اولویت دارد.
