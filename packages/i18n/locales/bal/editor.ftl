# Balochi (بلوچی) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel beside them. Translated from `locales/en/editor.ftl`,
# which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Southern Balochi as written in Pakistan, Perso-Arabic on the Urdu letter
# inventory, right to left — the same convention `chrome.ftl` states, and the
# four files of this locale must not be split between two orthographies.
#
# Balochi is verb-final, so where English drops a bare verb into the middle of
# a sentence — "Click to { $action } accessibility report" — the whole sentence
# sits inside the selector instead. Fluent does not care where a select falls
# in a pattern.
#
# `WCAG`, `DoenetML`, `XML`, `styleNumber` and every element or attribute name
# are identifiers rather than words and stay exactly as written.
#
# **This is the thinnest of the four files.** The context-help panel talks
# about references, properties, arrays and resolved types, and Balochi has no
# settled words for any of that; what is written below keeps the Urdu and
# English computing terms — `ریفرنس`, `پراپرٹی`, `اری`, `ٹائپ`, `سٹائل`,
# `کوآرڈینیٹ` — rather than coining Balochi ones. A speaker replacing them
# needs no permission.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] پدا نو
       *[update] نوکین
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] چارک ءَ { $word }
       *[other] چارک ءَ { $word } { $shortcut }
    }


## The variant picker

editor-variant = ورینٹ
editor-variant-filter = چھانٹ...
editor-variant-next = رندی ورینٹ ءَ گچین
editor-variant-previous = پیسری ورینٹ ءَ گچین


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA رسیدگی ءِ خلاف ورزی ے کپت. { $action ->
            [close] رسیدگی ءِ رپورٹ ءَ بند کنگ ءِ واستہ کلک کن.
           *[open] رسیدگی ءِ رپورٹ ءَ پچ کنگ ءِ واستہ کلک کن.
        }
        [advisories] { $action ->
            [close] رسیدگی ءِ رپورٹ ءَ بند کنگ ءِ واستہ کلک کن.
           *[open] رسیدگی ءِ رپورٹ ءَ پچ کنگ ءِ واستہ کلک کن.
        } WCAG AA ءِ ہچ خلاف ورزی ے نہ کپت، بلے دگہ رسیدگی ءِ صلاح ھست.
       *[clean] { $action ->
            [close] رسیدگی ءِ رپورٹ ءَ بند کنگ ءِ واستہ کلک کن.
           *[open] رسیدگی ءِ رپورٹ ءَ پچ کنگ ءِ واستہ کلک کن.
        } رسیدگی ءِ ہچ مسئلہ ے نہ کپت.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA رسیدگی ءِ خلاف ورزی ے کپت. { $count } WCAG AA خلاف ورزی کپت. { $action ->
            [close] رسیدگی ءِ رپورٹ ءَ بند کنگ ءِ واستہ کلک کن.
           *[open] رسیدگی ءِ رپورٹ ءَ پچ کنگ ءِ واستہ کلک کن.
        }
        [advisories] WCAG AA ءِ ہچ خلاف ورزی ے نہ کپت. { $count } دگہ رسیدگی ءِ صلاح کپت. { $action ->
            [close] رسیدگی ءِ رپورٹ ءَ بند کنگ ءِ واستہ کلک کن.
           *[open] رسیدگی ءِ رپورٹ ءَ پچ کنگ ءِ واستہ کلک کن.
        }
       *[clean] WCAG AA ءِ ہچ خلاف ورزی ے نہ کپت. { $action ->
            [close] رسیدگی ءِ رپورٹ ءَ بند کنگ ءِ واستہ کلک کن.
           *[open] رسیدگی ءِ رپورٹ ءَ پچ کنگ ءِ واستہ کلک کن.
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ءِ ورژن { $version }

editor-tab-help = موقع ءِ سرا رہشون
editor-tab-help-short = موقع
editor-tab-errors = خطا
editor-tab-warnings = ھشدار
editor-tab-info = معلومات
editor-tab-accessibility = رسیدگی
editor-tab-responses = روان بوتگیں جواب

editor-tab-with-count = { $label }: { $count }

editor-options = ایڈیٹر ءِ گچین
editor-format-as-doenetml = DoenetML ءِ رنگ ءَ ترتیب دی
editor-format-as-xml = XML ءِ رنگ ءَ ترتیب دی


## The diagnostics panel

editor-diagnostic-line = لینک #{ $line }

editor-no-errors = ہچ خطا نیست
editor-no-warnings = ہچ ھشدار نیست
editor-no-info = ہچ معلوماتی نشانی نیست

editor-show-info-annotations = ایڈیٹر ءَ معلوماتی نشانیاں پیش دار
editor-show-accessibility-annotations = ایڈیٹر ءَ رسیدگی ءِ نشانیاں پیش دار

editor-accessibility-learn-more = Doenet رسیدگی ءَ چون چارت، بزان ←

editor-accessibility-violations-heading = رسیدگی ءِ خلاف ورزی ({ $standard })

editor-accessibility-other-heading = رسیدگی ءِ دگہ مسئلہ
editor-none-found = ہچ چیزے نہ کپت


## Submitted responses

editor-no-responses = ہنوں تانکہ ہچ جواب ے روان نہ بوتگ
editor-response-answer-id = جواب ءِ نام
editor-response-response = جواب
editor-response-credit = نمرہ
editor-response-submitted = روان بیت ءِ وھد


## The context-help panel

help-placeholder = دستاویز ءِ واستہ کرسر ءَ ٹیگ ءِ نام، ایٹریبیوٹ یا { $ref } ءِ سرا اِشت.

help-unsupported-ref-chain = { $example } رنگیں چند بہری ریفرنس ءِ واستہ رہشون ہنوں تانکہ نیست.

help-unresolved-ref =
    { $reason ->
        [notFound] { $ref } ءِ واستہ ہچ مرجع ے نہ کپت.
        [multiple] { $ref } ءِ واستہ چند مرجع کپتنت.
       *[indeterminate] { $ref } ءِ مرجع معلوم نہ بوت.
    }

# The arrow is direction rather than punctuation, and Balochi runs the other
# way, so it points where the reader is going.
help-learn-about-references = ریفرنساں ءِ بارو ءَ بزان ←
help-reference-page = ریفرنس ءِ صفحہ ←

help-suggestions-header =
    { $location ->
        [inside] { $element } ءِ تہ ءَ
       *[top] سرین سطح ءَ
    }{ $allowed ->
        [none] { " — اِدا ہچ چیزے نہ کیت." }
        [text] { " — اِدا متن نبیس." }
        [text-and-components] { " — اِدا متن نبیس، یا اے چیزاں کوشست کن:" }
       *[components] { " — کوشست کنگ ءِ واستہ چیز:" }
    }

help-suggestions-footer = ہر { $total } کمپوننٹ ءَ دیدگ ءِ واستہ { $shortcut } ءَ دبا.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ھما { $target } ءِ ریفرنس اِنت.
       *[other] { $ref } ھما { $target } ءِ ریفرنس اِنت (لینک { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } آ ءِ ءَ { $role } ءِ رنگ ءَ آورتہ.
       *[other] { $owner } آ ءِ ءَ لینک { $line } ءَ { $role } ءِ رنگ ءَ آورتہ.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ھما { $element } ءِ { $property } پراپرٹی ءِ ریفرنس اِنت.
       *[other] { $ref } ھما { $element } ءِ { $property } پراپرٹی ءِ ریفرنس اِنت (لینک { $line }).
    }

help-kind-attribute = ایٹریبیوٹ
help-kind-snippet = ٹکڑ
help-kind-array-entry = اری ءِ درجہ

help-default = پیشدار:
help-active-default = چالوکیں پیشدار:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] اجازت بوتگیں قیمت (ہر درجہ ءِ واستہ یکے):
       *[other] اجازت بوتگیں قیمت:
    }

help-suggested-values = صلاح بوتگیں قیمت:

help-inserts = ھور کنت:

help-coordinates =
    { $count ->
       *[other] کوآرڈینیٹ:
    }

help-type = ٹائپ:

help-resolved-style = معلوم بوتگیں سٹائل (styleNumber { $styleNumber }):

help-resolved-function-names = فنکشن ءِ معلوم بوتگیں نام:
help-reset-list = اے اِنپٹ ءِ سرا لسٹ ءَ پدا نو کن:
help-added-on-input = اے اِنپٹ ءِ سرا ھور بوتگیں:
help-removed-on-input = اے اِنپٹ ءِ سرا در بوتگیں:

help-reset-overrides = { $reset }، { $additional } ءُ { $removed } ءِ سرا کارمرز بیت.
