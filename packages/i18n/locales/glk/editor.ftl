# Gilaki (گیلکی) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel beside them. Translated from `locales/en/editor.ftl`,
# which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Perso-Arabic script, right to left, in the same convention
# the other three files of this locale use: the Gilaki Wikipedia's «ؤ» for /o/
# and «ۊ» for /u/ («خؤب», «بۊشؤ») are **not** used here, because they cannot be
# applied consistently across a catalog of this size without guessing the vowel
# of every borrowed term. Plain Persian «و», «ا», «ی» throughout. A corrector
# who prefers the Wikipedia spelling should convert **all four files at once**
# rather than mix the two systems inside one catalog.
# (One caveat, so nobody "fixes" it: «ؤ» also occurs inside the Persian
# loanwords «مؤلفه» and «مؤلفه‌ان», where it is the ordinary Arabic hamza
# carrier of the standard Persian spelling, not the Gilaki /o/ letter. Those
# stay as they are.)
#
# **What is Gilaki here and what is not.** Almost every noun in this file —
# «ویرایشگر», «ویژگی», «مؤلفه», «ارجاع», «مستندات», «دسترس‌پذیری» — is Persian,
# and deliberately so: Gilaki has no computing register, and a Gilaki-shaped
# respelling of a Persian technical word would be a word no reader has met.
# What is Gilaki is the frame around them: the copula «ایسه»/«نیه», the plural
# «-ان», the classifier «تا» with a singular noun, the verbs «کودن», «بوستن»,
# «واکودن», «دوستن», «دان», «بامو», the negative prefix «ن-», and the
# postpositions «مئن» (*in*) and «ره» (*to*). A reviewer should expect to be
# **rewriting sentences, not correcting typos**.
#
# **Counting.** `Intl.PluralRules` has no data for `glk`, so only `[one]` and
# `*[other]` could ever be reached — and Gilaki leaves a counted noun singular
# anyway, so there is nothing for the distinction to mark. Every count select
# in this file is collapsed to a single `*[other]`.
#
# Where English drops a bare verb into the middle of a sentence — "Click to
# { $action } accessibility report" — Gilaki, like Persian, puts the verb at
# the end of its clause and cannot take it as an infix, so the selector carries
# the whole sentence instead. Fluent does not mind where a select sits inside a
# pattern.
#
# **Coverage.** Every key in `locales/en/editor.ftl` is present.


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
editor-variant-next = بعدی نسخه انتخاب کودن
editor-variant-previous = قبلی نسخه انتخاب کودن


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA دسترس‌پذیری نقض پیدا بوبو. { $action ->
            [close] دسترس‌پذیری گزارش دوستن ره کلیک بکونید.
           *[open] دسترس‌پذیری گزارش واکودن ره کلیک بکونید.
        }
        [advisories] { $action ->
            [close] دسترس‌پذیری گزارش دوستن ره کلیک بکونید.
           *[open] دسترس‌پذیری گزارش واکودن ره کلیک بکونید.
        } هیچ WCAG AA نقض پیدا نوبوسته، ولی دیگر دسترس‌پذیری توصیه‌ان دره.
       *[clean] { $action ->
            [close] دسترس‌پذیری گزارش دوستن ره کلیک بکونید.
           *[open] دسترس‌پذیری گزارش واکودن ره کلیک بکونید.
        } هیچ دسترس‌پذیری مشکل پیدا نوبوسته.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA دسترس‌پذیری نقض پیدا بوبو. { $count } تا WCAG AA نقض پیدا بوبو. { $action ->
            [close] دسترس‌پذیری گزارش دوستن ره کلیک بکونید.
           *[open] دسترس‌پذیری گزارش واکودن ره کلیک بکونید.
        }
        [advisories] هیچ WCAG AA نقض پیدا نوبوسته. { $count } تا دیگر دسترس‌پذیری توصیه پیدا بوبو. { $action ->
            [close] دسترس‌پذیری گزارش دوستن ره کلیک بکونید.
           *[open] دسترس‌پذیری گزارش واکودن ره کلیک بکونید.
        }
       *[clean] هیچ WCAG AA نقض پیدا نوبوسته. { $action ->
            [close] دسترس‌پذیری گزارش دوستن ره کلیک بکونید.
           *[open] دسترس‌پذیری گزارش واکودن ره کلیک بکونید.
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML نسخه { $version }

editor-tab-help = بافت ره وابسته راهنما
editor-tab-help-short = بافت
editor-tab-errors = خطاان
editor-tab-warnings = هشداران
editor-tab-info = اطلاعات
editor-tab-accessibility = دسترس‌پذیری
editor-tab-responses = ارسال‌بوبو پاسخان

editor-tab-with-count = { $label }: { $count }

editor-options = ویرایشگر تنظیمات
editor-format-as-doenetml = DoenetML شکل مئن قالب‌بندی کودن
editor-format-as-xml = XML شکل مئن قالب‌بندی کودن


## The diagnostics panel

editor-diagnostic-line = سطر شماره { $line }

editor-no-errors = هیچ خطا نیه
editor-no-warnings = هیچ هشدار نیه
editor-no-info = هیچ اطلاعاتی تشخیص نیه

editor-show-info-annotations = ویرایشگر مئن اطلاعاتی تشخیصان نشان دان
editor-show-accessibility-annotations = ویرایشگر مئن دسترس‌پذیری تشخیصان نشان دان

editor-accessibility-learn-more = بیدینید Doenet چوطو دسترس‌پذیری ره نگاه کونه

editor-accessibility-violations-heading = دسترس‌پذیری نقضان ({ $standard })

editor-accessibility-other-heading = دیگر دسترس‌پذیری مشکلان
editor-none-found = هیچی پیدا نوبوسته


## Submitted responses

editor-no-responses = هنوز هیچ پاسخ ارسال نوبوسته
editor-response-answer-id = پاسخ شناسه
editor-response-response = پاسخ
editor-response-credit = نمره
editor-response-submitted = ارسال وخت


## The context-help panel

help-placeholder = مستندات ره بیدینید، مکان‌نما ره ایتا برچسب نام، ایتا ویژگی یا { $ref } سر ببرید.

help-unsupported-ref-chain = { $example } مانستن چندبخشی ارجاعان ره راهنما هنوز پشتیبانی نبنه.

help-unresolved-ref =
    { $reason ->
        [notFound] هیچ مرجع پیدا نوبوسته کی { $ref } اونه اشاره بکونه.
        [multiple] ویشتر از ایتا مرجع پیدا بوبو کی { $ref } اونه اشاره کونه.
       *[indeterminate] { $ref } مرجع مشخص نوبوسته.
    }

# The arrow is direction rather than punctuation, and Gilaki runs the other
# way, so it points where the reader is going.
help-learn-about-references = ارجاعان ره بشناسید ←
help-reference-page = مرجع صفحه ←

help-suggestions-header =
    { $location ->
        [inside] { $element } مئن
       *[top] جورترین سطح مئن
    }{ $allowed ->
        [none] { " — ایه هیچی نانه." }
        [text] { " — ایه شا متن بنویشتن." }
        [text-and-components] { " — ایه شا متن بنویشتن، یا اینان ره امتحان بکونید:" }
       *[components] { " — اینان ره امتحان بکونید:" }
    }

help-suggestions-footer = هر { $total } تا مؤلفه ره بیدینید، { $shortcut } ره بزنید.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ایتا ارجاع ایسه به { $target }.
       *[other] { $ref } ایتا ارجاع ایسه به { $target } (سطر { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } اونه { $role } شکل مئن معرفی بوکوده.
       *[other] { $owner } اونه سطر { $line } مئن { $role } شکل مئن معرفی بوکوده.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ایتا ارجاع ایسه به { $element } مئن { $property } ویژگی.
       *[other] { $ref } ایتا ارجاع ایسه به { $element } مئن { $property } ویژگی (سطر { $line }).
    }

help-kind-attribute = ویژگی
help-kind-snippet = قطعه
help-kind-array-entry = آرایه درایه

help-default = پیش‌فرض مقدار:
help-active-default = فعال پیش‌فرض مقدار:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] مجاز مقادیر (هر درایه ره ایتا):
       *[other] مجاز مقادیر:
    }

help-suggested-values = پیشنهادی مقادیر:

help-inserts = درج کونه:

# Gilaki leaves the noun singular after a numeral, so both branches would read
# the same; the select is collapsed to one.
help-coordinates = مختصات:

help-type = نوع:

help-resolved-style = محاسبه‌بوبو سبک (styleNumber { $styleNumber }):

help-resolved-function-names = توابع محاسبه‌بوبو نامان:
help-reset-list = ای ورودی سر فهرست بازنشانی:
help-added-on-input = ای ورودی سر اضافه‌بوبو:
help-removed-on-input = ای ورودی سر حذف‌بوبو:

help-reset-overrides = { $reset } بر { $additional } و { $removed } اولویت دنه.
