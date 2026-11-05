# Saraiki (سرائیکی) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel beside them. Translated from `locales/en/editor.ftl`,
# which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Perso-Arabic on Urdu's letter inventory plus Saraiki's four implosives
# ٻ ڄ ڋ ڳ, right to left — the same convention `chrome.ftl` states, and the
# four files of this locale must not be split between two orthographies.
#
# Saraiki is verb-final, so where English drops a bare verb into the middle of
# a sentence — "Click to { $action } accessibility report" — the whole sentence
# sits inside the selector instead. Fluent does not care where a select falls
# in a pattern.
#
# No message here selects on a plural category: CLDR has none for `skr`, and a
# Saraiki noun after a numeral stays unmarked in any case, so every count
# message is a single `*[other]` with the count kept in the selector.
#
# `WCAG`, `DoenetML`, `XML`, `styleNumber` and every element or attribute name
# are identifiers rather than words and stay exactly as written.
#
# **This is the thinnest of the four files.** The context-help panel talks
# about references, properties, arrays and resolved types, and Saraiki has no
# settled words for any of that; what is written below keeps the Urdu and
# English computing terms — `ریفرنس`, `پراپرٹی`, `اری`, `ٹائپ`, `سٹائل`,
# `کوآرڈینیٹ` — rather than coining Saraiki ones. A speaker replacing them
# needs no permission.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ری سیٹ
       *[update] اپ ڈیٹ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] ناظر { $word } کرو
       *[other] ناظر { $word } کرو { $shortcut }
    }


## The variant picker

editor-variant = ورینٹ
editor-variant-filter = چھاݨو...
editor-variant-next = اڳلا ورینٹ چݨو
editor-variant-previous = پچھلا ورینٹ چݨو


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA رسائی دی خلاف ورزی لبھی۔ { $action ->
            [close] رسائی دی رپورٹ بند کرݨ کیتے کلک کرو۔
           *[open] رسائی دی رپورٹ کھولݨ کیتے کلک کرو۔
        }
        [advisories] { $action ->
            [close] رسائی دی رپورٹ بند کرݨ کیتے کلک کرو۔
           *[open] رسائی دی رپورٹ کھولݨ کیتے کلک کرو۔
        } WCAG AA دی کوئی خلاف ورزی نہ لبھی، پر رسائی دیاں کجھ ٻیاں سفارشاں موجود ہن۔
       *[clean] { $action ->
            [close] رسائی دی رپورٹ بند کرݨ کیتے کلک کرو۔
           *[open] رسائی دی رپورٹ کھولݨ کیتے کلک کرو۔
        } رسائی دا کوئی مسئلہ نہ لبھا۔
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA رسائی دی خلاف ورزی لبھی۔ { $count } WCAG AA خلاف ورزیاں لبھیاں۔ { $action ->
            [close] رسائی دی رپورٹ بند کرݨ کیتے کلک کرو۔
           *[open] رسائی دی رپورٹ کھولݨ کیتے کلک کرو۔
        }
        [advisories] WCAG AA دی کوئی خلاف ورزی نہ لبھی۔ رسائی دیاں { $count } ٻیاں سفارشاں لبھیاں۔ { $action ->
            [close] رسائی دی رپورٹ بند کرݨ کیتے کلک کرو۔
           *[open] رسائی دی رپورٹ کھولݨ کیتے کلک کرو۔
        }
       *[clean] WCAG AA دی کوئی خلاف ورزی نہ لبھی۔ { $action ->
            [close] رسائی دی رپورٹ بند کرݨ کیتے کلک کرو۔
           *[open] رسائی دی رپورٹ کھولݨ کیتے کلک کرو۔
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ورژن { $version }

editor-tab-help = موقعے دے مطابق مدد
editor-tab-help-short = موقع
editor-tab-errors = خرابیاں
editor-tab-warnings = تنبیہاں
editor-tab-info = معلومات
editor-tab-accessibility = رسائی
editor-tab-responses = بھیجے ڳئے جواب

editor-tab-with-count = { $label }: { $count }

editor-options = ایڈیٹر دیاں ترتیباں
editor-format-as-doenetml = DoenetML وانگوں ترتیب ڋیو
editor-format-as-xml = XML وانگوں ترتیب ڋیو


## The diagnostics panel

editor-diagnostic-line = سطر #{ $line }

editor-no-errors = کوئی خرابی کائنی
editor-no-warnings = کوئی تنبیہ کائنی
editor-no-info = کوئی معلوماتی نشانی کائنی

editor-show-info-annotations = ایڈیٹر وچ معلوماتی نشانیاں ڋکھاؤ
editor-show-accessibility-annotations = ایڈیٹر وچ رسائی دیاں نشانیاں ڋکھاؤ

editor-accessibility-learn-more = ڄاݨو جو Doenet رسائی نوں کیویں ڋیکھدے ←

editor-accessibility-violations-heading = رسائی دیاں خلاف ورزیاں ({ $standard })

editor-accessibility-other-heading = رسائی دے ٻئے مسئلے
editor-none-found = کجھ نہ لبھا


## Submitted responses

editor-no-responses = ہالے تیک کوئی جواب نہیں بھیجیا ڳیا
editor-response-answer-id = جواب دی شناخت
editor-response-response = جواب
editor-response-credit = نمبر
editor-response-submitted = بھیجݨ دا ویلا


## The context-help panel

help-placeholder = دستاویزات کیتے کرسر کیں ٹیگ دے ناں، ایٹریبیوٹ یا { $ref } تے رکھو۔

help-unsupported-ref-chain = { $example } ورڳے کئی حصیاں آلے ریفرنساں کیتے مدد ہالے تیک موجود کائنی۔

help-unresolved-ref =
    { $reason ->
        [notFound] ریفرنس { $ref } کیتے کوئی مرجع نہ ملیا۔
        [multiple] ریفرنس { $ref } کیتے کئی مرجع ملے۔
       *[indeterminate] { $ref } دا مرجع معلوم نہ تھی سڳیا۔
    }

# The arrow is direction rather than punctuation, and Saraiki runs the other
# way, so it points where the reader is going.
help-learn-about-references = ریفرنساں دے بارے ڄاݨو ←
help-reference-page = ریفرنس دا صفحہ ←

help-suggestions-header =
    { $location ->
        [inside] { $element } دے اندر
       *[top] سب توں اُتلی سطح تے
    }{ $allowed ->
        [none] { " — ایتھاں کجھ وی نہیں آندا۔" }
        [text] { " — ایتھاں متن لکھو۔" }
        [text-and-components] { " — ایتھاں متن لکھو، یا ایہ اڋمائو:" }
       *[components] { " — اڋماوݨ آلیاں چیزاں:" }
    }

help-suggestions-footer = سارے { $total } کمپوننٹ ڋیکھݨ کیتے { $shortcut } دٻاؤ۔

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } { $target } دا ریفرنس اے۔
       *[other] { $ref } { $target } دا ریفرنس اے (سطر { $line })۔
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } نے ایں نوں { $role } دے طور تے متعارف کرایا۔
       *[other] { $owner } نے ایں نوں سطر { $line } تے { $role } دے طور تے متعارف کرایا۔
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } { $element } دی { $property } پراپرٹی دا ریفرنس اے۔
       *[other] { $ref } { $element } دی { $property } پراپرٹی دا ریفرنس اے (سطر { $line })۔
    }

help-kind-attribute = ایٹریبیوٹ
help-kind-snippet = ٹکڑا
help-kind-array-entry = اری دا اندراج

help-default = پہلوں توں مقرر:
help-active-default = چالو پہلوں توں مقرر:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] جائز قیمتاں (ہر جز کیتے ہک):
       *[other] جائز قیمتاں:
    }

help-suggested-values = تجویز کیتیاں ڳئیاں قیمتاں:

help-inserts = شامل کریندے:

help-coordinates =
    { $count ->
       *[other] کوآرڈینیٹ:
    }

help-type = ٹائپ:

help-resolved-style = طے تھیا ہویا سٹائل (styleNumber { $styleNumber }):

help-resolved-function-names = طے تھئے ہوئے فنکشن ناں:
help-reset-list = ایں ان پٹ تے فہرست ری سیٹ کرو:
help-added-on-input = ایں ان پٹ تے شامل کیتے ڳئے:
help-removed-on-input = ایں ان پٹ توں ہٹائے ڳئے:

help-reset-overrides = { $reset }، { $additional } تے { $removed } تے حاوی تھیندے۔
