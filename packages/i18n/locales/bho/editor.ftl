# Bhojpuri editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
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
        [none] दर्शक { $word } करीं
       *[other] दर्शक { $word } करीं { $shortcut }
    }


## The variant picker

editor-variant = भेद

editor-variant-filter = छानीं…

editor-variant-next = अगिला भेद चुनीं

editor-variant-previous = पहिले वाला भेद चुनीं


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA सुगम्यता के उल्लंघन मिलल। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } खातिर क्लिक करीं।
        [advisories] सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } खातिर क्लिक करीं। कवनो WCAG AA उल्लंघन ना मिलल, बाकिर अउरी सुगम्यता के सलाह उपलब्ध बा।
       *[clean] सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } खातिर क्लिक करीं। कवनो सुगम्यता के समस्या ना मिलल।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA सुगम्यता के उल्लंघन मिलल। { $count ->
            [one] { $count } WCAG AA उल्लंघन
           *[other] { $count } WCAG AA उल्लंघन
        } मिलल। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } खातिर क्लिक करीं।
        [advisories] कवनो WCAG AA उल्लंघन ना मिलल। { $count ->
            [one] { $count } अउरी सुगम्यता के सलाह
           *[other] { $count } अउरी सुगम्यता के सलाह
        } मिलल। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } खातिर क्लिक करीं।
       *[clean] कवनो WCAG AA उल्लंघन ना मिलल। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करे
           *[open] खोले
        } खातिर क्लिक करीं।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML संस्करण { $version }

editor-tab-help = संदर्भ के हिसाब से मदद
editor-tab-help-short = संदर्भ
editor-tab-errors = गलती
editor-tab-warnings = चेतावनी
editor-tab-info = जानकारी
editor-tab-accessibility = सुगम्यता
editor-tab-responses = भेजल जवाब

editor-tab-with-count = { $label }: { $count }

editor-options = संपादक के विकल्प
editor-format-as-doenetml = DoenetML के रूप में सजाईं
editor-format-as-xml = XML के रूप में सजाईं


## The diagnostics panel

editor-diagnostic-line = पाँती #{ $line }

editor-no-errors = कवनो गलती ना
editor-no-warnings = कवनो चेतावनी ना
editor-no-info = कवनो जानकारी ना

editor-show-info-annotations = संपादक में जानकारी देखाईं
editor-show-accessibility-annotations = संपादक में सुगम्यता के सूचना देखाईं

editor-accessibility-learn-more = Doenet सुगम्यता के कइसे देखेला, ई जानीं

editor-accessibility-violations-heading = सुगम्यता के उल्लंघन ({ $standard })

editor-accessibility-other-heading = दोसर सुगम्यता के समस्या
editor-none-found = कुछ ना मिलल


## Submitted responses

editor-no-responses = अबले कवनो जवाब ना भेजल गइल
editor-response-answer-id = जवाब के आईडी
editor-response-response = जवाब
editor-response-credit = अंक
editor-response-submitted = भेजल गइल


## The context-help panel

help-placeholder = दस्तावेजीकरण खातिर कर्सर के टैग नाम, विशेषता, भा { $ref } पर राखीं।

help-unsupported-ref-chain = { $example } जइसन बहु-भाग वाला संदर्भ खातिर मदद अबले ना बा।

help-unresolved-ref =
    { $reason ->
        [notFound] ई संदर्भ के कवनो लक्ष्य ना मिलल: { $ref }।
        [multiple] ई संदर्भ के कई गो लक्ष्य मिलल: { $ref }।
       *[indeterminate] { $ref } के लक्ष्य तय ना हो सकल।
    }

help-learn-about-references = संदर्भ के बारे में जानीं →
help-reference-page = संदर्भ पन्ना →

help-suggestions-header =
    { $location ->
        [inside] { $element } के भीतर
       *[top] सबसे ऊपर वाला स्तर पर
    }{ $allowed ->
        [none] { " — इहाँ कुछ ना आ सके।" }
        [text] { " — इहाँ पाठ लिखीं।" }
        [text-and-components] { " — इहाँ पाठ लिखीं, भा ई सब आजमाईं:" }
       *[components] { " — ई सब आजमाईं:" }
    }

help-suggestions-footer = सब { $total } घटक देखे खातिर { $shortcut } दबाईं।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } { $target } के एगो संदर्भ ह।
       *[other] { $ref } { $target } के एगो संदर्भ ह (पाँती { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } { $role } के रूप में ले आइल।
       *[other] { $owner } पाँती { $line } पर { $role } के रूप में ले आइल।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } { $element } के { $property } गुण के एगो संदर्भ ह।
       *[other] { $ref } { $element } के { $property } गुण के एगो संदर्भ ह (पाँती { $line })।
    }

help-kind-attribute = विशेषता
help-kind-snippet = अंश
help-kind-array-entry = सरणी के प्रविष्टि

help-default = पूर्वनिर्धारित:
help-active-default = सक्रिय पूर्वनिर्धारित:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] अनुमत मान (हर वस्तु खातिर एगो):
       *[other] अनुमत मान:
    }

help-suggested-values = सुझाव वाला मान:

help-inserts = जोड़ेला:

help-coordinates =
    { $count ->
        [one] निर्देशांक:
       *[other] निर्देशांक:
    }

help-type = प्रकार:

help-resolved-style = तय शैली (styleNumber { $styleNumber }):

help-resolved-function-names = तय फलन के नाम:
help-reset-list = ई इनपुट पर रीसेट सूची:
help-added-on-input = ई इनपुट पर जोड़ल गइल:
help-removed-on-input = ई इनपुट पर हटावल गइल:

help-reset-overrides = { $reset } { $additional } आ { $removed } पर भारी पड़ेला।
