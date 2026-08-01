# Hindi editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] रीसेट करें
       *[update] अद्यतन करें
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] दर्शक { $word }
       *[other] दर्शक { $word } { $shortcut }
    }


## The variant picker

editor-variant = रूपांतर
editor-variant-filter = फ़िल्टर...
editor-variant-next = अगला रूपांतर चुनें
editor-variant-previous = पिछला रूपांतर चुनें


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA सुगम्यता उल्लंघन पाया गया। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करने
           *[open] खोलने
        } के लिए क्लिक करें।
        [advisories] सुगम्यता रिपोर्ट { $action ->
            [close] बंद करने
           *[open] खोलने
        } के लिए क्लिक करें। कोई WCAG AA उल्लंघन नहीं मिला, पर सुगम्यता संबंधी अन्य सुझाव हैं।
       *[clean] सुगम्यता रिपोर्ट { $action ->
            [close] बंद करने
           *[open] खोलने
        } के लिए क्लिक करें। कोई सुगम्यता समस्या नहीं मिली।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA सुगम्यता उल्लंघन पाया गया। { $count } WCAG AA उल्लंघन मिले। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करने
           *[open] खोलने
        } के लिए क्लिक करें।
        [advisories] कोई WCAG AA उल्लंघन नहीं मिला। सुगम्यता संबंधी { $count } अन्य सुझाव मिले। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करने
           *[open] खोलने
        } के लिए क्लिक करें।
       *[clean] कोई WCAG AA उल्लंघन नहीं मिला। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करने
           *[open] खोलने
        } के लिए क्लिक करें।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML संस्करण { $version }

editor-tab-help = प्रसंग अनुसार सहायता
editor-tab-help-short = प्रसंग
editor-tab-errors = त्रुटियाँ
editor-tab-warnings = चेतावनियाँ
editor-tab-info = जानकारी
editor-tab-accessibility = सुगम्यता
editor-tab-responses = भेजे गए उत्तर

editor-tab-with-count = { $label }: { $count }

editor-options = संपादक विकल्प
editor-format-as-doenetml = DoenetML रूप में स्वरूपित करें
editor-format-as-xml = XML रूप में स्वरूपित करें


## The diagnostics panel

editor-diagnostic-line = पंक्ति #{ $line }

editor-no-errors = कोई त्रुटि नहीं
editor-no-warnings = कोई चेतावनी नहीं
editor-no-info = कोई सूचनात्मक निदान नहीं

editor-show-info-annotations = संपादक में सूचनात्मक निदान दिखाएँ
editor-show-accessibility-annotations = संपादक में सुगम्यता निदान दिखाएँ

editor-accessibility-learn-more = जानें कि Doenet सुगम्यता को किस तरह देखता है

editor-accessibility-violations-heading = सुगम्यता उल्लंघन ({ $standard })

editor-accessibility-other-heading = अन्य सुगम्यता समस्याएँ
editor-none-found = कुछ नहीं मिला


## Submitted responses

editor-no-responses = अभी तक कोई उत्तर नहीं भेजा गया
editor-response-answer-id = उत्तर आईडी
editor-response-response = उत्तर
editor-response-credit = अंक
editor-response-submitted = भेजा गया


## The context-help panel

help-placeholder = दस्तावेज़ीकरण देखने के लिए कर्सर को टैग नाम, विशेषता या { $ref } पर रखें।

help-unsupported-ref-chain = { $example } जैसे बहु-भागीय संदर्भों की सहायता अभी उपलब्ध नहीं है।

help-unresolved-ref =
    { $reason ->
        [notFound] इस संदर्भ का कोई लक्ष्य नहीं मिला: { $ref }।
        [multiple] इस संदर्भ के कई लक्ष्य मिले: { $ref }।
       *[indeterminate] { $ref } का लक्ष्य निर्धारित नहीं किया जा सका।
    }

help-learn-about-references = संदर्भों के बारे में जानें →
help-reference-page = संदर्भ पृष्ठ →

help-suggestions-header =
    { $location ->
        [inside] { $element } के भीतर
       *[top] शीर्ष स्तर पर
    }{ $allowed ->
        [none] { " — यहाँ कुछ नहीं रखा जा सकता।" }
        [text] { " — यहाँ पाठ लिखा जा सकता है।" }
        [text-and-components] { " — यहाँ पाठ लिखें, या ये आज़माएँ:" }
       *[components] { " — ये आज़माएँ:" }
    }

help-suggestions-footer = सभी { $total } घटक देखने के लिए { $shortcut } दबाएँ।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref }, { $target } का संदर्भ है।
       *[other] { $ref }, { $target } का संदर्भ है (पंक्ति { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } द्वारा { $role } के रूप में लाया गया।
       *[other] { $owner } द्वारा पंक्ति { $line } में { $role } के रूप में लाया गया।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref }, { $element } के { $property } गुण का संदर्भ है।
       *[other] { $ref }, { $element } के { $property } गुण का संदर्भ है (पंक्ति { $line })।
    }

help-kind-attribute = विशेषता
help-kind-snippet = कोड अंश
help-kind-array-entry = सरणी प्रविष्टि

help-default = पूर्वनिर्धारित:
help-active-default = प्रभावी पूर्वनिर्धारित:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] अनुमत मान (प्रति मद एक):
       *[other] अनुमत मान:
    }

help-suggested-values = सुझाए गए मान:

help-inserts = जोड़ता है:

help-coordinates =
    { $count ->
        [one] निर्देशांक:
       *[other] निर्देशांक:
    }

help-type = प्रकार:

help-resolved-style = निर्धारित शैली (styleNumber { $styleNumber }):

help-resolved-function-names = निर्धारित फलन नाम:
help-reset-list = इस इनपुट की रीसेट सूची:
help-added-on-input = इस इनपुट पर जोड़ा गया:
help-removed-on-input = इस इनपुट पर हटाया गया:

help-reset-overrides = { $reset }, { $additional } और { $removed } पर वरीयता रखता है।
