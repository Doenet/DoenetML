# Kashmiri editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Right-to-left, written in logical order. The arrows in the two help links are
# direction rather than punctuation and sit inside the message, so this catalog
# turns them around. `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are
# names and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ریٖسیٹ
       *[update] اپڈیٹ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] ویوٗر { $word } کرِو
       *[other] ویوٗر { $word } کرِو { $shortcut }
    }


## The variant picker

editor-variant = قِسم

editor-variant-filter = ژھانٛڈِو…

editor-variant-next = بۆنٕم قِسم ژٲرِو

editor-variant-previous = پَتٕم قِسم ژٲرِو


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA رسٲیی خِلاف ورزی لبنہٕ آیہٕ۔ رسٲیی رپورٹ { $action ->
            [close] بند کرنہٕ
           *[open] کھولنہٕ
        } خٲطرٕ کلِک کرِو۔
        [advisories] رسٲیی رپورٹ { $action ->
            [close] بند کرنہٕ
           *[open] کھولنہٕ
        } خٲطرٕ کلِک کرِو۔ کہٕنٛہہ WCAG AA خِلاف ورزی نہٕ لبنہٕ آیہٕ، مگر بیٚیہِ رسٲیی مشورٕ چھِ دستیاب۔
       *[clean] رسٲیی رپورٹ { $action ->
            [close] بند کرنہٕ
           *[open] کھولنہٕ
        } خٲطرٕ کلِک کرِو۔ کہٕنٛہہ رسٲیی مسٲلہٕ نہٕ لبنہٕ آو۔
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA رسٲیی خِلاف ورزی لبنہٕ آیہٕ۔ { $count ->
            [one] { $count } WCAG AA خِلاف ورزی
           *[other] { $count } WCAG AA خِلاف ورزی
        } لبنہٕ آیہٕ۔ رسٲیی رپورٹ { $action ->
            [close] بند کرنہٕ
           *[open] کھولنہٕ
        } خٲطرٕ کلِک کرِو۔
        [advisories] کہٕنٛہہ WCAG AA خِلاف ورزی نہٕ لبنہٕ آیہٕ۔ { $count ->
            [one] { $count } بیٚیہِ رسٲیی مشورٕ
           *[other] { $count } بیٚیہِ رسٲیی مشورٕ
        } لبنہٕ آیہٕ۔ رسٲیی رپورٹ { $action ->
            [close] بند کرنہٕ
           *[open] کھولنہٕ
        } خٲطرٕ کلِک کرِو۔
       *[clean] کہٕنٛہہ WCAG AA خِلاف ورزی نہٕ لبنہٕ آیہٕ۔ رسٲیی رپورٹ { $action ->
            [close] بند کرنہٕ
           *[open] کھولنہٕ
        } خٲطرٕ کلِک کرِو۔
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ورژن { $version }

editor-tab-help = سِیاق مُطٲبِق مدد
editor-tab-help-short = سِیاق
editor-tab-errors = غلطی
editor-tab-warnings = تَنبیٖہ
editor-tab-info = معلوٗمات
editor-tab-accessibility = رسٲیی
editor-tab-responses = بیٖجِمٕتؠ جواب

editor-tab-with-count = { $label }: { $count }

editor-options = ایڈیٹر آپشن
editor-format-as-doenetml = DoenetML صوٗرتس منٛز سٲرِو
editor-format-as-xml = XML صوٗرتس منٛز سٲرِو


## The diagnostics panel

editor-diagnostic-line = لَکیٖر #{ $line }

editor-no-errors = کہٕنٛہہ غلطی نہٕ
editor-no-warnings = کہٕنٛہہ تَنبیٖہ نہٕ
editor-no-info = کہٕنٛہہ معلوٗمات نہٕ

editor-show-info-annotations = ایڈیٹرس منٛز معلوٗمات ہٲوِو
editor-show-accessibility-annotations = ایڈیٹرس منٛز رسٲیی اِطلاع ہٲوِو

editor-accessibility-learn-more = Doenet رسٲیی کِتھٕ پٲٹھؠ چھُ ہیوان، سٕہ زٲنِو

editor-accessibility-violations-heading = رسٲیی خِلاف ورزی ({ $standard })

editor-accessibility-other-heading = بیٚیہِ رسٲیی مسٲلہٕ
editor-none-found = کہٕنٛہہ نہٕ لَبۆو


## Submitted responses

editor-no-responses = وۄنؠ تام کہٕنٛہہ جواب نہٕ بیٖجِمُت
editor-response-answer-id = جواب آی ڈی
editor-response-response = جواب
editor-response-credit = نمبر
editor-response-submitted = بیٖجِمُت


## The context-help panel

help-placeholder = دستاویزات خٲطرٕ کرسر ٹیگ ناوس، خٲصیتس، یا { $ref } پؠٹھ ژھٲرِو۔

help-unsupported-ref-chain = { $example } ہیوٚ کؠتھ حِصن ہُنٛدؠ حوالہٕ خٲطرٕ چھِ نہٕ وۄنؠ تام مدد۔

help-unresolved-ref =
    { $reason ->
        [notFound] یَتھ حوالس ہُنٛد کہٕنٛہہ ہدف نہٕ لَبۆو: { $ref }۔
        [multiple] یَتھ حوالس ہٕنٛد زیادٕ ہدف لَبؠ: { $ref }۔
       *[indeterminate] { $ref } ہُنٛد ہدف نہٕ طےٕ کرِتھ ہیوٚک۔
    }

help-learn-about-references = حوالن مُتعلِق زٲنِو ←
help-reference-page = حوالٕ صفحہٕ ←

help-suggestions-header =
    { $location ->
        [inside] { $element } منٛز
       *[top] سارِوے کھۄتہٕ ہیورِس درجس پؠٹھ
    }{ $allowed ->
        [none] { " — یَتؠ ہیٚکِہ نہٕ کہٕنٛہہ یِتھ۔" }
        [text] { " — یَتؠ لیٚکھِو متن۔" }
        [text-and-components] { " — یَتؠ لیٚکھِو متن، یا یِم آزمٲوِو:" }
       *[components] { " — یِم آزمٲوِو:" }
    }

help-suggestions-footer = سٲری { $total } جُز وُچھنہٕ خٲطرٕ { $shortcut } دبٲوِو۔

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } چھُ { $target } ہُنٛد اَکھ حوالہٕ۔
       *[other] { $ref } چھُ { $target } ہُنٛد اَکھ حوالہٕ (لَکیٖر { $line })۔
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } چھُ یِہ { $role } صوٗرتس منٛز آنمُت۔
       *[other] { $owner } چھُ یِہ لَکیٖر { $line } پؠٹھ { $role } صوٗرتس منٛز آنمُت۔
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } چھُ { $element } سٕنٛد { $property } خٲصیتُک اَکھ حوالہٕ۔
       *[other] { $ref } چھُ { $element } سٕنٛد { $property } خٲصیتُک اَکھ حوالہٕ (لَکیٖر { $line })۔
    }

help-kind-attribute = خٲصیت
help-kind-snippet = ٹُکڑٕ
help-kind-array-entry = صف اِندراج

help-default = بُنیٲدی:
help-active-default = فعال بُنیٲدی:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] اِجازت یُتھ قدر (پرٛتھ چیٖزس اَکھ):
       *[other] اِجازت یُتھ قدر:
    }

help-suggested-values = مشورٕ دِنہٕ آمٕتؠ قدر:

help-inserts = دَراوان چھُ:

help-coordinates =
    { $count ->
        [one] مُختصات:
       *[other] مُختصات:
    }

help-type = قِسم:

help-resolved-style = طےٕ کرنہٕ آمُت انداز (styleNumber { $styleNumber }):

help-resolved-function-names = طےٕ کرنہٕ آمٕتؠ فَلَن ناو:
help-reset-list = یَتھ اِنپُٹس پؠٹھ ریٖسیٹ فہرِست:
help-added-on-input = یَتھ اِنپُٹس پؠٹھ شٲمِل کرنہٕ آو:
help-removed-on-input = یَتھ اِنپُٹس پؠٹھ کڈنہٕ آو:

help-reset-overrides = { $reset } چھُ { $additional } تہٕ { $removed } پؠٹھ ژھایہٕ کران۔
