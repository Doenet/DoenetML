# Hazaragi (هزارگی / آزرگی) editor and language-server surfaces: the footer,
# the diagnostics panel, the variant picker, the accessibility button and the
# context-help panel beside them. Translated from `locales/en/editor.ftl`,
# which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Perso-Arabic on Kabul Dari conventions, right to left — the same orthography
# the other three files of this locale use, and they must not be split between
# two conventions. Register as in `chrome.ftl`: verbal nouns for controls, the
# polite plural for a sentence addressed to the reader.
#
# Where English drops a bare verb into the middle of a sentence — "Click to
# { $action } accessibility report" — the Persian-type verb comes at the end of
# its clause and cannot be spliced into the middle of one, so the selector
# carries the whole sentence. Fluent does not care where a select sits in a
# pattern.
#
# `WCAG`, `DoenetML`, `XML`, `styleNumber` and every element or attribute name
# are identifiers rather than words and stay exactly as written.
#
# **This file is where Hazaragi and Dari are hardest to tell apart**, because
# almost none of it is everyday speech: it is software vocabulary, and Hazaragi
# borrows it from Dari and English exactly as Dari does. `مرجع`, `ریفرنس`,
# `آرایه`, `تایپ`, `ستایل`, `کوردینات` are kept in that shape rather than
# replaced by coinages.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] بازنشانی
       *[update] نو کدو
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } نمایشگر
       *[other] { $word } نمایشگر { $shortcut }
    }


## The variant picker

editor-variant = نسخه
editor-variant-filter = فیلتر...
editor-variant-next = انتخابِ نسخهٔ بعدی
editor-variant-previous = انتخابِ نسخهٔ پیشتر


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] تخطی از دسترس‌پذیریِ WCAG AA پیدا شد. { $action ->
            [close] بلدِ بسته کدونِ راپورِ دسترس‌پذیری کلیک کنین.
           *[open] بلدِ باز کدونِ راپورِ دسترس‌پذیری کلیک کنین.
        }
        [advisories] { $action ->
            [close] بلدِ بسته کدونِ راپورِ دسترس‌پذیری کلیک کنین.
           *[open] بلدِ باز کدونِ راپورِ دسترس‌پذیری کلیک کنین.
        } هیچ تخطی از WCAG AA پیدا نشد، مگم سفارش‌های دیگهٔ دسترس‌پذیری موجود استه.
       *[clean] { $action ->
            [close] بلدِ بسته کدونِ راپورِ دسترس‌پذیری کلیک کنین.
           *[open] بلدِ باز کدونِ راپورِ دسترس‌پذیری کلیک کنین.
        } هیچ مشکلِ دسترس‌پذیری پیدا نشد.
    }

editor-accessibility-label =
    { $status ->
        [violations] تخطی از دسترس‌پذیریِ WCAG AA پیدا شد. { $count } تخطی از WCAG AA پیدا شد. { $action ->
            [close] بلدِ بسته کدونِ راپورِ دسترس‌پذیری کلیک کنین.
           *[open] بلدِ باز کدونِ راپورِ دسترس‌پذیری کلیک کنین.
        }
        [advisories] هیچ تخطی از WCAG AA پیدا نشد. { $count } سفارشِ دیگهٔ دسترس‌پذیری پیدا شد. { $action ->
            [close] بلدِ بسته کدونِ راپورِ دسترس‌پذیری کلیک کنین.
           *[open] بلدِ باز کدونِ راپورِ دسترس‌پذیری کلیک کنین.
        }
       *[clean] هیچ تخطی از WCAG AA پیدا نشد. { $action ->
            [close] بلدِ بسته کدونِ راپورِ دسترس‌پذیری کلیک کنین.
           *[open] بلدِ باز کدونِ راپورِ دسترس‌پذیری کلیک کنین.
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = نسخهٔ DoenetML { $version }

editor-tab-help = رهنماییِ وابسته به زمینه
editor-tab-help-short = زمینه
editor-tab-errors = خطاها
editor-tab-warnings = هشدارها
editor-tab-info = معلومات
editor-tab-accessibility = دسترس‌پذیری
editor-tab-responses = جواب‌های روان‌شده

editor-tab-with-count = { $label }: { $count }

editor-options = گزینه‌های ادیتور
editor-format-as-doenetml = ترتیب کدو به شکلِ DoenetML
editor-format-as-xml = ترتیب کدو به شکلِ XML


## The diagnostics panel

editor-diagnostic-line = سطر شمارهٔ { $line }

editor-no-errors = هیچ خطا نیست
editor-no-warnings = هیچ هشدار نیست
editor-no-info = هیچ تشخیصِ معلوماتی نیست

editor-show-info-annotations = نشان دادونِ تشخیص‌های معلوماتی در ادیتور
editor-show-accessibility-annotations = نشان دادونِ تشخیص‌های دسترس‌پذیری در ادیتور

editor-accessibility-learn-more = بدانین که Doenet دسترس‌پذیری ره چطور می‌بینه ←

editor-accessibility-violations-heading = تخطی‌های دسترس‌پذیری ({ $standard })

editor-accessibility-other-heading = مشکل‌های دیگهٔ دسترس‌پذیری
editor-none-found = هیچ چیز پیدا نشد


## Submitted responses

editor-no-responses = هنوز هیچ جواب روان نشده
editor-response-answer-id = شناسهٔ جواب
editor-response-response = جواب
editor-response-credit = نمره
editor-response-submitted = وقتِ روان کدو


## The context-help panel

help-placeholder = بلدِ دیدونِ اسناد، نشانگر ره سرِ نامِ یک تگ، یک صفت یا { $ref } بمانین.

help-unsupported-ref-chain = رهنمایی بلدِ مرجع‌های چندبخشی مثلِ { $example } هنوز موجود نیست.

help-unresolved-ref =
    { $reason ->
        [notFound] بلدِ { $ref } هیچ مرجع پیدا نشد.
        [multiple] بلدِ { $ref } چند مرجع پیدا شد.
       *[indeterminate] مرجعِ { $ref } معلوم نشد.
    }

# The arrow is direction rather than punctuation, and Hazaragi runs the other
# way, so it points where the reader is going.
help-learn-about-references = دربارهٔ مرجع‌ها بدانین ←
help-reference-page = صفحهٔ مرجع ←

help-suggestions-header =
    { $location ->
        [inside] در داخلِ { $element }
       *[top] در بالاترین سطح
    }{ $allowed ->
        [none] { " — ایجه هیچ چیز نمی‌آیه." }
        [text] { " — ایجه متن نوشته می‌شنه." }
        [text-and-components] { " — ایجه متن بنویسین، یا ای‌ها ره کوشش کنین:" }
       *[components] { " — چیزهایی بلدِ کوشش:" }
    }

help-suggestions-footer = بلدِ دیدونِ هر { $total } جزء { $shortcut } ره فشار بتین.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } یک مرجع استه به { $target }.
       *[other] { $ref } یک مرجع استه به { $target } (سطر { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } او ره به شکلِ { $role } معرفی کده.
       *[other] { $owner } او ره در سطر { $line } به شکلِ { $role } معرفی کده.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } یک مرجع استه به خاصیتِ { $property } در { $element }.
       *[other] { $ref } یک مرجع استه به خاصیتِ { $property } در { $element } (سطر { $line }).
    }

help-kind-attribute = صفت
help-kind-snippet = پارچه
help-kind-array-entry = درایهٔ آرایه

help-default = پیش‌فرض:
help-active-default = پیش‌فرضِ فعال:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] ارزش‌های مجاز (بلدِ هر درایه یکی):
       *[other] ارزش‌های مجاز:
    }

help-suggested-values = ارزش‌های سفارش‌شده:

help-inserts = درج می‌کنه:

help-coordinates =
    { $count ->
       *[other] کوردینات:
    }

help-type = تایپ:

help-resolved-style = ستایلِ معلوم‌شده (styleNumber { $styleNumber }):

help-resolved-function-names = نام‌های معلوم‌شدهٔ فنکشن:
help-reset-list = بازنشانیِ فهرست سرِ ای ورودی:
help-added-on-input = علاوه‌شده سرِ ای ورودی:
help-removed-on-input = دورشده سرِ ای ورودی:

help-reset-overrides = { $reset } سرِ { $additional } و { $removed } برتری داره.
