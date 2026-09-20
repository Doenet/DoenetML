# Northern Luri (لری شمالی) editor and language-server surfaces: the footer,
# the diagnostics panel, the variant picker, the accessibility button and the
# context-help panel beside them. Translated from `locales/en/editor.ftl`,
# which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Perso-Arabic script, right to left, written with **plain
# Persian letters** — و, ا, ی. The Luri Wikipedia's «ؤ» for /o/ and «ۊ» for /u/
# (as in the endonym «لۊری شومالی») are **not** used anywhere in these four
# files: the convention needs a speaker checking every vowel, and applied to
# only part of a catalog it reads as an unfinished edit rather than as a
# spelling. A corrector who prefers it must convert **all four files at once**
# and never mix the two systems inside one catalog.
#
# One caveat about that rule: «ؤ» also occurs inside ordinary Persian
# loanwords spelled the Persian way — «مؤلفه» throughout these files — where
# it is a hamza on a wāw and not the Luri /o/ vowel. Those are not
# violations of the decision above, and should be left alone.
#
# **What is Luri here and what is not.** Beyond the copula «هه»/«نیه», the
# «-یل» plural («خطایل», «هشداریل», «مقداریل»), the numeral classifier «تا»,
# and a few everyday words, the vocabulary in this file is **Persian** — there
# is no Luri register for «ویرایشگر», «دسترس‌پذیری» or «ارجاع», and Luri
# speakers do this subject in Persian. Luri's word order agrees with Persian's
# too, so the shape of these messages is deliberately close to
# `locales/fa/editor.ftl`; what separates the two catalogs is morphology, not
# syntax. A reviewer should expect to be **rewriting sentences**, not
# correcting typos.
#
# **Counting.** `Intl.PluralRules` has no data for `lrc`, so a `[one]` branch
# could never be selected — and Luri would not want one, since a noun after a
# numeral stays singular and takes «تا». Every count select here is collapsed
# to a single `*[other]`, or dropped where the sentence then reads the same
# either way.
#
# Where English interpolates a bare verb — "Click to { $action } accessibility
# report" — the verb comes at the end of its clause in Luri and cannot be
# dropped into the middle of one, so the selector carries the whole sentence.
# Fluent does not mind where a select sits inside a pattern.
#
# **Coverage.** Every key in `locales/en/editor.ftl` is translated here;
# nothing is omitted.


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
editor-variant-filter = پالایش...
editor-variant-next = گزیدن نسخهٔ پسین
editor-variant-previous = گزیدن نسخهٔ پیشین


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] نقض دسترس‌پذیری بر پایهٔ WCAG AA پیدا وابی. { $action ->
            [close] سی بستن گزارش دسترس‌پذیری کلیک کنین.
           *[open] سی وا کردن گزارش دسترس‌پذیری کلیک کنین.
        }
        [advisories] { $action ->
            [close] سی بستن گزارش دسترس‌پذیری کلیک کنین.
           *[open] سی وا کردن گزارش دسترس‌پذیری کلیک کنین.
        } هیچ نقضی از WCAG AA پیدا نوابی، اما توصیه‌یل دسترس‌پذیری دیگه‌ای هه.
       *[clean] { $action ->
            [close] سی بستن گزارش دسترس‌پذیری کلیک کنین.
           *[open] سی وا کردن گزارش دسترس‌پذیری کلیک کنین.
        } هیچ مشکل دسترس‌پذیری پیدا نوابی.
    }

editor-accessibility-label =
    { $status ->
        [violations] نقض دسترس‌پذیری بر پایهٔ WCAG AA پیدا وابی. { $count } تا نقض WCAG AA پیدا وابی. { $action ->
            [close] سی بستن گزارش دسترس‌پذیری کلیک کنین.
           *[open] سی وا کردن گزارش دسترس‌پذیری کلیک کنین.
        }
        [advisories] هیچ نقضی از WCAG AA پیدا نوابی. { $count } تا توصیهٔ دسترس‌پذیری دیگه پیدا وابی. { $action ->
            [close] سی بستن گزارش دسترس‌پذیری کلیک کنین.
           *[open] سی وا کردن گزارش دسترس‌پذیری کلیک کنین.
        }
       *[clean] هیچ نقضی از WCAG AA پیدا نوابی. { $action ->
            [close] سی بستن گزارش دسترس‌پذیری کلیک کنین.
           *[open] سی وا کردن گزارش دسترس‌پذیری کلیک کنین.
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = نسخهٔ DoenetML { $version }

editor-tab-help = راهنمای وابسته به بافت
editor-tab-help-short = بافت
editor-tab-errors = خطایل
editor-tab-warnings = هشداریل
editor-tab-info = اطلاعات
editor-tab-accessibility = دسترس‌پذیری
editor-tab-responses = پاسخیل ارسال‌وابیه

editor-tab-with-count = { $label }: { $count }

editor-options = تنظیمات ویرایشگر
editor-format-as-doenetml = قالب‌بندی به شکل DoenetML
editor-format-as-xml = قالب‌بندی به شکل XML


## The diagnostics panel

editor-diagnostic-line = سطر شمارهٔ { $line }

editor-no-errors = هیچ خطایی نیه
editor-no-warnings = هیچ هشداری نیه
editor-no-info = هیچ تشخیص اطلاعاتی نیه

editor-show-info-annotations = نمایش تشخیصیل اطلاعاتی در ویرایشگر
editor-show-accessibility-annotations = نمایش تشخیصیل دسترس‌پذیری در ویرایشگر

editor-accessibility-learn-more = آشنایی با رویکرد Doenet به دسترس‌پذیری

editor-accessibility-violations-heading = نقضیل دسترس‌پذیری ({ $standard })

editor-accessibility-other-heading = مشکلیل دیگهٔ دسترس‌پذیری
editor-none-found = هیچی پیدا نوابی


## Submitted responses

editor-no-responses = هنو هیچ پاسخی ارسال نوابیه
editor-response-answer-id = شناسهٔ پاسخ
editor-response-response = پاسخ
editor-response-credit = نمره
editor-response-submitted = زمان ارسال


## The context-help panel

help-placeholder = سی دیدن مستندات، مکان‌نما ره سر نام یه عنصر، یه ویژگی یا { $ref } ببرین.

help-unsupported-ref-chain = راهنما سی ارجاعیل چندبخشی مثل { $example } هنو پشتیبانی نبونه.

help-unresolved-ref =
    { $reason ->
        [notFound] عنصری که { $ref } به او اشاره کنه پیدا نوابی.
        [multiple] بیشتر از یه عنصر پیدا وابی که { $ref } به او اشاره کنه.
       *[indeterminate] عنصری که { $ref } به او اشاره کنه مشخص نوابی.
    }

# The arrow is direction rather than punctuation, and Luri runs right to left,
# so it points where the reader is going.
help-learn-about-references = آشنایی با ارجاعیل ←
help-reference-page = صفحهٔ مرجع ←

help-suggestions-header =
    { $location ->
        [inside] درون { $element }
       *[top] در بالاترین سطح
    }{ $allowed ->
        [none] { " — ایچه هیچی جا نگره." }
        [text] { " — ایچه متن بنویسین." }
        [text-and-components] { " — ایچه متن بنویسین، یا اینیل ره امتحان کنین:" }
       *[components] { " — چیزیلی سی امتحان کردن:" }
    }

help-suggestions-footer = سی دیدن هر { $total } تا مؤلفه { $shortcut } ره بفشارین.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ارجاعی هه به { $target }.
       *[other] { $ref } ارجاعی هه به { $target } (سطر { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } او ره به شکل { $role } معرفی کرده.
       *[other] { $owner } او ره در سطر { $line } به شکل { $role } معرفی کرده.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ارجاعی هه به ویژگی { $property } در عنصر { $element }.
       *[other] { $ref } ارجاعی هه به ویژگی { $property } در عنصر { $element } (سطر { $line }).
    }

help-kind-attribute = ویژگی
help-kind-snippet = قطعه
help-kind-array-entry = درایهٔ آرایه

help-default = مقدار پیش‌فرض:
help-active-default = مقدار پیش‌فرض فعال:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] مقداریل مجاز (یکی سی هر درایه):
       *[other] مقداریل مجاز:
    }

help-suggested-values = مقداریل پیشنهادی:

help-inserts = درج کنه:

# Luri leaves the noun unmarked after a count, so both English branches say the
# same thing and the select is collapsed.
help-coordinates = مختصات:

help-type = نوع:

help-resolved-style = سبک محاسبه‌وابیه (styleNumber { $styleNumber }):

help-resolved-function-names = نامیل محاسبه‌وابیهٔ توابع:
help-reset-list = بازنشانی فهرست سر ای ورودی:
help-added-on-input = افزوده‌وابیه در ای ورودی:
help-removed-on-input = حذف‌وابیه در ای ورودی:

help-reset-overrides = { $reset } سر { $additional } و { $removed } اولویت دارۀ.
