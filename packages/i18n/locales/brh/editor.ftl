# Brahui (براہوئی) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel beside them. Translated from `locales/en/editor.ftl`,
# which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Perso-Arabic on the Urdu letter inventory as Brahui is printed in Quetta,
# right to left, case clitics written as separate words — the same convention
# `chrome.ftl` states, and the four files of this locale must not be split
# between two orthographies.
#
# Brahui is rigidly verb-final, so where English drops a bare verb into the
# middle of a sentence — "Click to { $action } accessibility report" — the
# whole sentence sits inside the selector instead. Fluent does not care where a
# select falls in a pattern.
#
# No message here selects on a plural category: CLDR has none for `brh`, and a
# Brahui noun after a numeral stays unmarked in any case, so every count
# message is a single `*[other]` with the count kept in the selector.
#
# `WCAG`, `DoenetML`, `XML`, `styleNumber` and every element or attribute name
# are identifiers rather than words and stay exactly as written.
#
# **This is the thinnest of the four files.** The context-help panel talks
# about references, properties, arrays and resolved types, and Brahui has no
# settled words for any of that; what is written below keeps the Urdu, Balochi
# and English computing terms — `ریفرنس`, `پراپرٹی`, `اری`, `ٹائپ`, `سٹائل`,
# `کوآرڈینیٹ` — rather than coining Brahui ones. What is Brahui here is the
# frame around them: the case clitics, the head-final order, the copula «اے»
# and its negative «اف», and the verbal noun in `‑نگ` on every control. A
# speaker replacing the vocabulary needs no permission.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] پدا نو
       *[update] نوکن
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] چاروک نا { $word }
       *[other] چاروک نا { $word } { $shortcut }
    }


## The variant picker

editor-variant = ورینٹ
editor-variant-filter = چھاننگ...
editor-variant-next = رندی ورینٹ نا گچین کننگ
editor-variant-previous = پیشی ورینٹ نا گچین کننگ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA رسائی نا خلاف ورزی خفتا۔ { $action ->
            [close] رسائی نا رپورٹ نا بند کننگ کے کلک کننگ۔
           *[open] رسائی نا رپورٹ نا پچ کننگ کے کلک کننگ۔
        }
        [advisories] { $action ->
            [close] رسائی نا رپورٹ نا بند کننگ کے کلک کننگ۔
           *[open] رسائی نا رپورٹ نا پچ کننگ کے کلک کننگ۔
        } WCAG AA نا ہچ خلاف ورزی خفتا اف، بلے رسائی نا دگہ صلاح موجود اے۔
       *[clean] { $action ->
            [close] رسائی نا رپورٹ نا بند کننگ کے کلک کننگ۔
           *[open] رسائی نا رپورٹ نا پچ کننگ کے کلک کننگ۔
        } رسائی نا ہچ مسئلہ خفتا اف۔
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA رسائی نا خلاف ورزی خفتا۔ { $count } WCAG AA خلاف ورزی خفتا۔ { $action ->
            [close] رسائی نا رپورٹ نا بند کننگ کے کلک کننگ۔
           *[open] رسائی نا رپورٹ نا پچ کننگ کے کلک کننگ۔
        }
        [advisories] WCAG AA نا ہچ خلاف ورزی خفتا اف۔ رسائی نا { $count } دگہ صلاح خفتا۔ { $action ->
            [close] رسائی نا رپورٹ نا بند کننگ کے کلک کننگ۔
           *[open] رسائی نا رپورٹ نا پچ کننگ کے کلک کننگ۔
        }
       *[clean] WCAG AA نا ہچ خلاف ورزی خفتا اف۔ { $action ->
            [close] رسائی نا رپورٹ نا بند کننگ کے کلک کننگ۔
           *[open] رسائی نا رپورٹ نا پچ کننگ کے کلک کننگ۔
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML نا ورژن { $version }

editor-tab-help = موقع نا مطابق رہشون
editor-tab-help-short = موقع
editor-tab-errors = خطا
editor-tab-warnings = ہشدار
editor-tab-info = معلومات
editor-tab-accessibility = رسائی
editor-tab-responses = دیہا جواب

editor-tab-with-count = { $label }: { $count }

editor-options = ایڈیٹر نا گچین
editor-format-as-doenetml = DoenetML نا رنگ ٹی ترتیب دیہنگ
editor-format-as-xml = XML نا رنگ ٹی ترتیب دیہنگ


## The diagnostics panel

editor-diagnostic-line = سطر #{ $line }

editor-no-errors = ہچ خطا اف
editor-no-warnings = ہچ ہشدار اف
editor-no-info = ہچ معلوماتی نشانی اف

editor-show-info-annotations = ایڈیٹر ٹی معلوماتی نشانی نا دیرنگ
editor-show-accessibility-annotations = ایڈیٹر ٹی رسائی نا نشانی نا دیرنگ

editor-accessibility-learn-more = Doenet رسائی نا کے چون چاریک، دا نا زانگ ←

editor-accessibility-violations-heading = رسائی نا خلاف ورزی ({ $standard })

editor-accessibility-other-heading = رسائی نا دگہ مسئلہ
editor-none-found = ہچ چیز خفتا اف


## Submitted responses

editor-no-responses = ہنو تانکہ ہچ جواب دیہا اف
editor-response-answer-id = جواب نا نام
editor-response-response = جواب
editor-response-credit = نمبر
editor-response-submitted = دیہنگ نا وخت


## The context-help panel

help-placeholder = دستاویز کے کرسر نا ٹیگ نا نام، ایٹریبیوٹ یا { $ref } ٹی ہشنگ۔

help-unsupported-ref-chain = { $example } رنگ چند بہری ریفرنس کے رہشون ہنو تانکہ موجود اف۔

help-unresolved-ref =
    { $reason ->
        [notFound] { $ref } کے ہچ مرجع موجود اف۔
        [multiple] { $ref } کے چند مرجع خفتا۔
       *[indeterminate] { $ref } نا مرجع معلوم اف۔
    }

# The arrow is direction rather than punctuation, and Brahui runs the other
# way, so it points where the reader is going.
help-learn-about-references = ریفرنس نا بارے ٹی زانگ ←
help-reference-page = ریفرنس نا صفحہ ←

help-suggestions-header =
    { $location ->
        [inside] { $element } نا اندر
       *[top] سرین سطح ٹی
    }{ $allowed ->
        [none] { " — آدا ہچ چیز آسا اف۔" }
        [text] { " — آدا متن نبشتہ کننگ۔" }
        [text-and-components] { " — آدا متن نبشتہ کننگ، یا دا چیز نا کوشش کننگ:" }
       *[components] { " — کوشش کننگ نا چیز:" }
    }

help-suggestions-footer = درست { $total } کمپوننٹ نا دیدنگ کے { $shortcut } نا دبانگ۔

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } دا { $target } نا ریفرنس اے۔
       *[other] { $ref } دا { $target } نا ریفرنس اے (سطر { $line })۔
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } دا نا { $role } نا رنگ ٹی آرا۔
       *[other] { $owner } دا نا سطر { $line } ٹی { $role } نا رنگ ٹی آرا۔
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } دا { $element } نا { $property } پراپرٹی نا ریفرنس اے۔
       *[other] { $ref } دا { $element } نا { $property } پراپرٹی نا ریفرنس اے (سطر { $line })۔
    }

help-kind-attribute = ایٹریبیوٹ
help-kind-snippet = ٹکڑ
help-kind-array-entry = اری نا درجہ

help-default = پیشدار:
help-active-default = چالوک پیشدار:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] اجازت نا قیمت (ہر درجہ کے اسٹ):
       *[other] اجازت نا قیمت:
    }

help-suggested-values = صلاح نا قیمت:

help-inserts = ھور کیک:

help-coordinates =
    { $count ->
       *[other] کوآرڈینیٹ:
    }

help-type = ٹائپ:

help-resolved-style = معلوم سٹائل (styleNumber { $styleNumber }):

help-resolved-function-names = فنکشن نا معلوم نام:
help-reset-list = دا ان پٹ ٹی لسٹ نا پدا نو کننگ:
help-added-on-input = دا ان پٹ ٹی ھور آسا:
help-removed-on-input = دا ان پٹ آن در آسا:

help-reset-overrides = { $reset }، { $additional } او { $removed } نا سرا کار ٹی گڑیک۔
