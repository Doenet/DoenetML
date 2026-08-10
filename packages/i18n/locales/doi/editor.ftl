# Dogri editor and language-server surfaces: the footer, the diagnostics panel,
# the variant picker, the accessibility button, and the context-help panel
# beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] रीसेट
       *[update] अपडेट
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] दर्शक { $word } करो
       *[other] दर्शक { $word } करो { $shortcut }
    }


## The variant picker

editor-variant = किस्म

editor-variant-filter = छाणो…

editor-variant-next = अगली किस्म चुनो

editor-variant-previous = पिछली किस्म चुनो


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA सुगमता दा उल्लंघन मिलेआ। सुगमता रपट { $action ->
            [close] बंद करने
           *[open] खोह्लने
        } आस्तै क्लिक करो।
        [advisories] सुगमता रपट { $action ->
            [close] बंद करने
           *[open] खोह्लने
        } आस्तै क्लिक करो। कोई WCAG AA उल्लंघन नेईं मिलेआ, पर होर सुगमता सलाह मजूद ऐ।
       *[clean] सुगमता रपट { $action ->
            [close] बंद करने
           *[open] खोह्लने
        } आस्तै क्लिक करो। कोई सुगमता दी दिक्कत नेईं मिली।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA सुगमता दा उल्लंघन मिलेआ। { $count ->
            [one] { $count } WCAG AA उल्लंघन
           *[other] { $count } WCAG AA उल्लंघन
        } मिले। सुगमता रपट { $action ->
            [close] बंद करने
           *[open] खोह्लने
        } आस्तै क्लिक करो।
        [advisories] कोई WCAG AA उल्लंघन नेईं मिलेआ। { $count ->
            [one] { $count } होर सुगमता सलाह
           *[other] { $count } होर सुगमता सलाहां
        } मिलियां। सुगमता रपट { $action ->
            [close] बंद करने
           *[open] खोह्लने
        } आस्तै क्लिक करो।
       *[clean] कोई WCAG AA उल्लंघन नेईं मिलेआ। सुगमता रपट { $action ->
            [close] बंद करने
           *[open] खोह्लने
        } आस्तै क्लिक करो।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML संस्करण { $version }

editor-tab-help = संदर्भ मताबक मदद
editor-tab-help-short = संदर्भ
editor-tab-errors = गलतियां
editor-tab-warnings = चेतावनियां
editor-tab-info = जानकारी
editor-tab-accessibility = सुगमता
editor-tab-responses = भेजे गेदे जवाब

editor-tab-with-count = { $label }: { $count }

editor-options = संपादक दे विकल्प
editor-format-as-doenetml = DoenetML दे रूप च सजाओ
editor-format-as-xml = XML दे रूप च सजाओ


## The diagnostics panel

editor-diagnostic-line = पंगत #{ $line }

editor-no-errors = कोई गलती नेईं
editor-no-warnings = कोई चेतावनी नेईं
editor-no-info = कोई जानकारी नेईं

editor-show-info-annotations = संपादक च जानकारी दस्सो
editor-show-accessibility-annotations = संपादक च सुगमता दी सूचना दस्सो

editor-accessibility-learn-more = Doenet सुगमता गी किय्यां दिखदा ऐ, इह जानो

editor-accessibility-violations-heading = सुगमता दे उल्लंघन ({ $standard })

editor-accessibility-other-heading = होर सुगमता दियां दिक्कतां
editor-none-found = कुछ नेईं मिलेआ


## Submitted responses

editor-no-responses = हाल्लै तगर कोई जवाब नेईं भेजेआ गेआ
editor-response-answer-id = जवाब आईडी
editor-response-response = जवाब
editor-response-credit = अंक
editor-response-submitted = भेजेआ गेआ


## The context-help panel

help-placeholder = दस्तावेजीकरण आस्तै कर्सर गी टैग नां, विशेषता, जां { $ref } पर रक्खो।

help-unsupported-ref-chain = { $example } जनेह् मता-हिस्से आले संदर्भें आस्तै मदद हाल्लै नेईं ऐ।

help-unresolved-ref =
    { $reason ->
        [notFound] इस संदर्भ दा कोई लक्ष्य नेईं मिलेआ: { $ref }।
        [multiple] इस संदर्भ दे मते लक्ष्य मिले: { $ref }।
       *[indeterminate] { $ref } दा लक्ष्य तै नेईं होई सकेआ।
    }

help-learn-about-references = संदर्भें दे बारे च जानो →
help-reference-page = संदर्भ सफा →

help-suggestions-header =
    { $location ->
        [inside] { $element } दे अंदर
       *[top] सारें कोला उप्परले स्तर पर
    }{ $allowed ->
        [none] { " — इत्थै कुछ नेईं आई सकदा।" }
        [text] { " — इत्थै पाठ लिखो।" }
        [text-and-components] { " — इत्थै पाठ लिखो, जां इह् अजमाओ:" }
       *[components] { " — इह् अजमाओ:" }
    }

help-suggestions-footer = सारे { $total } घटक दिखने आस्तै { $shortcut } दबाओ।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } { $target } दा इक संदर्भ ऐ।
       *[other] { $ref } { $target } दा इक संदर्भ ऐ (पंगत { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ने { $role } दे रूप च आंदा।
       *[other] { $owner } ने पंगत { $line } पर { $role } दे रूप च आंदा।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } { $element } दे { $property } गुण दा इक संदर्भ ऐ।
       *[other] { $ref } { $element } दे { $property } गुण दा इक संदर्भ ऐ (पंगत { $line })।
    }

help-kind-attribute = विशेषता
help-kind-snippet = टुकड़ा
help-kind-array-entry = सरणी दी प्रविष्टि

help-default = मूल:
help-active-default = सक्रिय मूल:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] मन्नोचे मुल्ल (हर इक वस्तू आस्तै इक):
       *[other] मन्नोचे मुल्ल:
    }

help-suggested-values = सुझाए गेदे मुल्ल:

help-inserts = पाँदा ऐ:

help-coordinates =
    { $count ->
        [one] निर्देशांक:
       *[other] निर्देशांक:
    }

help-type = किस्म:

help-resolved-style = तै कीती शैली (styleNumber { $styleNumber }):

help-resolved-function-names = तै कीते फलन नां:
help-reset-list = इस निवेश पर रीसेट सूची:
help-added-on-input = इस निवेश पर जोड़ेआ गेआ:
help-removed-on-input = इस निवेश पर हटाया गेआ:

help-reset-overrides = { $reset } { $additional } ते { $removed } पर भारी ऐ।
