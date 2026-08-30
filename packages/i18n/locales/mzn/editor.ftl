# Mazanderani (مازِرونی) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel beside them. Translated from `locales/en/editor.ftl`,
# which is the source of truth. Selected by `uiLocale`.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Plain Persian letters, as in the other three files of this
# locale: no «ؤ» and no «ۊ» — the extra vowel letters belong to the Gilaki and
# Luri conventions — and no vocalisation beyond the few words that are
# unreadable without it. A corrector who prefers a pointed text should convert
# all four files at once rather than mix the two habits inside one locale.
#
# **What is Mazanderani here.** The copula «هسه» / «نیه» in place of Persian
# «است» / «نیست», the passive «بونه» for «می‌شود», the plural «-ون» rather than
# «-ها», the classifier «تا» with a singular noun after a numeral, and
# head-final word order — a modifier stands in front of the noun it modifies,
# which is why «دسترس‌پذیری گزارش» reads the way it does. Everything else is
# **Persian**: «ویرایشگر», «ویژگی», «مستندات», «مؤلفه», «پیش‌فرض». Mazanderani
# has no editor or programming vocabulary of its own, and borrowing the words
# its speakers actually read on a screen is honest where invention would not
# be. A reviewer should expect to be rewriting sentences rather than fixing
# typos.
#
# **Counting.** `Intl.PluralRules` has no data for `mzn`, so only `one` and
# `other` could ever be reached; and a Mazanderani numeral takes «تا» and a
# singular noun, so the two would say the same thing anyway. Every count select
# from the English is collapsed to one wording — `editor-accessibility-label`
# and `help-coordinates` below each carry a single `*[other]`.
#
# **Placement of the verb.** English writes "Click to { $action } accessibility
# report", dropping a bare verb into the middle of a sentence. A Mazanderani
# verb closes its clause and cannot sit there, so — as `fa` does — the `$action`
# selector carries the whole sentence in each branch rather than a word.
#
# `WCAG AA`, `DoenetML`, `styleNumber` and the DoenetML attribute names are
# identifiers, not prose, and stay in English exactly as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] بازنشانی
       *[update] به‌روزرسانی
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] نمایشگر ره { $word }
       *[other] نمایشگر ره { $word } { $shortcut }
    }


## The variant picker

editor-variant = نسخه
editor-variant-filter = صافی...
editor-variant-next = بعدی نسخه ره وچین
editor-variant-previous = قبلی نسخه ره وچین


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA بر پایه دسترس‌پذیری نقض شناسایی بیّه. { $action ->
            [close] دسترس‌پذیری گزارش ره دَوِستن سِری کلیک هاکنین.
           *[open] دسترس‌پذیری گزارش ره وا هاکردن سِری کلیک هاکنین.
        }
        [advisories] { $action ->
            [close] دسترس‌پذیری گزارش ره دَوِستن سِری کلیک هاکنین.
           *[open] دسترس‌پذیری گزارش ره وا هاکردن سِری کلیک هاکنین.
        } هیچ WCAG AA نقضی پیدا نیّه، ولی دیگه دسترس‌پذیری توصیه‌ون دست دله دَره.
       *[clean] { $action ->
            [close] دسترس‌پذیری گزارش ره دَوِستن سِری کلیک هاکنین.
           *[open] دسترس‌پذیری گزارش ره وا هاکردن سِری کلیک هاکنین.
        } هیچ دسترس‌پذیری مشکلی پیدا نیّه.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA بر پایه دسترس‌پذیری نقض شناسایی بیّه. { $count } تا WCAG AA نقض پیدا بیّه. { $action ->
            [close] دسترس‌پذیری گزارش ره دَوِستن سِری کلیک هاکنین.
           *[open] دسترس‌پذیری گزارش ره وا هاکردن سِری کلیک هاکنین.
        }
        [advisories] هیچ WCAG AA نقضی شناسایی نیّه. { $count } تا دیگه دسترس‌پذیری توصیه پیدا بیّه. { $action ->
            [close] دسترس‌پذیری گزارش ره دَوِستن سِری کلیک هاکنین.
           *[open] دسترس‌پذیری گزارش ره وا هاکردن سِری کلیک هاکنین.
        }
       *[clean] هیچ WCAG AA نقضی شناسایی نیّه. { $action ->
            [close] دسترس‌پذیری گزارش ره دَوِستن سِری کلیک هاکنین.
           *[open] دسترس‌پذیری گزارش ره وا هاکردن سِری کلیک هاکنین.
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML مالِ { $version } نسخه

editor-tab-help = بافت ره وابسته راهنما
editor-tab-help-short = بافت
editor-tab-errors = خطاون
editor-tab-warnings = هشدارون
editor-tab-info = اطلاعات
editor-tab-accessibility = دسترس‌پذیری
editor-tab-responses = اِرسال‌بَیی جوابون

editor-tab-with-count = { $label }: { $count }

editor-options = ویرایشگر تنظیمات
editor-format-as-doenetml = DoenetML شکل قالب‌بندی هاکن
editor-format-as-xml = XML شکل قالب‌بندی هاکن


## The diagnostics panel

editor-diagnostic-line = { $line } شماره سطر

editor-no-errors = هیچ خطا نیه
editor-no-warnings = هیچ هشدار نیه
editor-no-info = هیچ اطلاعاتی تشخیص نیه

editor-show-info-annotations = ویرایشگر دله اطلاعاتی تشخیص‌ون ره نشون هاده
editor-show-accessibility-annotations = ویرایشگر دله دسترس‌پذیری تشخیص‌ون ره نشون هاده

editor-accessibility-learn-more = دسترس‌پذیری ره Doenet رویکرد ره یاد بَیرین

editor-accessibility-violations-heading = دسترس‌پذیری نقضون ({ $standard })

editor-accessibility-other-heading = دیگه دسترس‌پذیری مسائل
editor-none-found = هیچی پیدا نیّه


## Submitted responses

editor-no-responses = هنتا هیچ جوابی اِرسال نیّه
editor-response-answer-id = جوابِ شناسه
editor-response-response = جواب
editor-response-credit = نمره
editor-response-submitted = اِرسالِ زمان


## The context-help panel

help-placeholder = مستندات ره دیّن سِری، مکان‌نما ره یه برچسب‌نوم، یه ویژگی یا { $ref } رو ببرین.

help-unsupported-ref-chain = { $example } ماننده چندبخشی ارجاعون سِری راهنما هنتا پشتیبانی نَوونه.

help-unresolved-ref =
    { $reason ->
        [notFound] هیچ عنصری پیدا نیّه که { $ref } وِره اشاره هاکنه.
        [multiple] یه عنصر جه بیشتر پیدا بیّه که { $ref } وشون ره اشاره کانده.
       *[indeterminate] اون عنصری که { $ref } وِره اشاره کانده مشخص نیّه.
    }

# The arrow is direction rather than punctuation, and Mazanderani is written
# right to left, so it points the way the reader is going.
help-learn-about-references = ارجاعون ره یاد بَیرین ←
help-reference-page = مرجعِ صفحه ←

help-suggestions-header =
    { $location ->
        [inside] { $element } دِله
       *[top] بالاترین سطح دله
    }{ $allowed ->
        [none] { " — اینجه هیچی جا نَیرنه." }
        [text] { " — اینجه شونه متن بنویشتن." }
        [text-and-components] { " — اینجه شونه متن بنویشتن، یا اینون ره امتحان هاکردن:" }
       *[components] { " — چیزونی که شونه امتحان هاکردن:" }
    }

help-suggestions-footer = همه { $total } تا مؤلفه ره دیّن سِری { $shortcut } ره بَزنین.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } یه ارجاع هسه { $target } ره.
       *[other] { $ref } یه ارجاع هسه { $target } ره (سطر { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } وِره { $role } شکل معرفی هاکرده.
       *[other] { $owner } وِره { $line } سطر دله { $role } شکل معرفی هاکرده.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } یه ارجاع هسه { $element } عنصر دله { $property } ویژگی ره.
       *[other] { $ref } یه ارجاع هسه { $element } عنصر دله { $property } ویژگی ره (سطر { $line }).
    }

help-kind-attribute = ویژگی
help-kind-snippet = قطعه
help-kind-array-entry = آرایه درایه

help-default = پیش‌فرض مقدار:
help-active-default = فعال پیش‌فرض مقدار:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] مجاز مقدارون (هر درایه سِری یکی):
       *[other] مجاز مقدارون:
    }

help-suggested-values = پیشنهادی مقدارون:

help-inserts = درج کانده:

help-coordinates =
    { $count ->
       *[other] مختصات:
    }

help-type = نوع:

help-resolved-style = محاسبه‌بَیی سبک (styleNumber { $styleNumber }):

help-resolved-function-names = محاسبه‌بَیی تابع‌نومون:
help-reset-list = این ورودی رو فهرست ره بازنشانی هاکن:
help-added-on-input = این ورودی دله افزوده بیّه:
help-removed-on-input = این ورودی دله حذف بیّه:

help-reset-overrides = { $reset } { $additional } و { $removed } سَره اولویت دارنه.
