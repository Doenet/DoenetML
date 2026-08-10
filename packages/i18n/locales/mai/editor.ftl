# Maithili editor and language-server surfaces: the footer, the diagnostics
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
        [none] दर्शक { $word } करू
       *[other] दर्शक { $word } करू { $shortcut }
    }


## The variant picker

editor-variant = भेद

editor-variant-filter = छानू…

editor-variant-next = अगिला भेद चुनू

editor-variant-previous = पछिला भेद चुनू


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA सुगम्यता उल्लंघन भेटल। सुगम्यता प्रतिवेदन { $action ->
            [close] बंद
           *[open] खोलबा
        } लेल क्लिक करू।
        [advisories] सुगम्यता प्रतिवेदन { $action ->
            [close] बंद
           *[open] खोलबा
        } लेल क्लिक करू। कोनो WCAG AA उल्लंघन नहि भेटल, मुदा आओर सुगम्यता अनुशंसा उपलब्ध अछि।
       *[clean] सुगम्यता प्रतिवेदन { $action ->
            [close] बंद
           *[open] खोलबा
        } लेल क्लिक करू। कोनो सुगम्यता समस्या नहि भेटल।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA सुगम्यता उल्लंघन भेटल। { $count ->
            [one] { $count } WCAG AA उल्लंघन
           *[other] { $count } WCAG AA उल्लंघन
        } भेटल। सुगम्यता प्रतिवेदन { $action ->
            [close] बंद
           *[open] खोलबा
        } लेल क्लिक करू।
        [advisories] कोनो WCAG AA उल्लंघन नहि भेटल। { $count ->
            [one] { $count } आओर सुगम्यता अनुशंसा
           *[other] { $count } आओर सुगम्यता अनुशंसा
        } भेटल। सुगम्यता प्रतिवेदन { $action ->
            [close] बंद
           *[open] खोलबा
        } लेल क्लिक करू।
       *[clean] कोनो WCAG AA उल्लंघन नहि भेटल। सुगम्यता प्रतिवेदन { $action ->
            [close] बंद
           *[open] खोलबा
        } लेल क्लिक करू।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML संस्करण { $version }

editor-tab-help = संदर्भ अनुसार सहायता
editor-tab-help-short = संदर्भ
editor-tab-errors = त्रुटि
editor-tab-warnings = चेतावनी
editor-tab-info = जानकारी
editor-tab-accessibility = सुगम्यता
editor-tab-responses = पठाओल उत्तर

editor-tab-with-count = { $label }: { $count }

editor-options = संपादक विकल्प
editor-format-as-doenetml = DoenetML रूप मे सजाउ
editor-format-as-xml = XML रूप मे सजाउ


## The diagnostics panel

editor-diagnostic-line = पाँती #{ $line }

editor-no-errors = कोनो त्रुटि नहि
editor-no-warnings = कोनो चेतावनी नहि
editor-no-info = कोनो जानकारी नहि

editor-show-info-annotations = संपादक मे जानकारी देखाउ
editor-show-accessibility-annotations = संपादक मे सुगम्यता सूचना देखाउ

editor-accessibility-learn-more = Doenet सुगम्यता केँ कोना अपनबैत अछि, से जानू

editor-accessibility-violations-heading = सुगम्यता उल्लंघन ({ $standard })

editor-accessibility-other-heading = आन सुगम्यता समस्या
editor-none-found = किछु नहि भेटल


## Submitted responses

editor-no-responses = आब तक कोनो उत्तर नहि पठाओल गेल
editor-response-answer-id = उत्तर आईडी
editor-response-response = उत्तर
editor-response-credit = अंक
editor-response-submitted = पठाओल गेल


## The context-help panel

help-placeholder = दस्तावेजीकरण लेल कर्सर केँ टैग नाम, विशेषता, वा { $ref } पर राखू।

help-unsupported-ref-chain = { $example } जकाँ बहु-भाग संदर्भ लेल सहायता आब तक नहि अछि।

help-unresolved-ref =
    { $reason ->
        [notFound] ई संदर्भ लेल कोनो लक्ष्य नहि भेटल: { $ref }।
        [multiple] ई संदर्भ लेल बहुतो लक्ष्य भेटल: { $ref }।
       *[indeterminate] { $ref } लेल लक्ष्य निर्धारित नहि भऽ सकल।
    }

help-learn-about-references = संदर्भ क बारे मे जानू →
help-reference-page = संदर्भ पृष्ठ →

help-suggestions-header =
    { $location ->
        [inside] { $element } क भीतर
       *[top] सबसँ ऊपर वला स्तर पर
    }{ $allowed ->
        [none] { " — एतऽ किछु नहि आबि सकैत अछि।" }
        [text] { " — एतऽ पाठ लिखू।" }
        [text-and-components] { " — एतऽ पाठ लिखू, वा ई सब आजमाउ:" }
       *[components] { " — ई सब आजमाउ:" }
    }

help-suggestions-footer = सभ { $total } घटक देखबा लेल { $shortcut } दबाउ।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } { $target } क एकटा संदर्भ अछि।
       *[other] { $ref } { $target } क एकटा संदर्भ अछि (पाँती { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } द्वारा { $role } रूप मे आनल गेल।
       *[other] { $owner } द्वारा पाँती { $line } पर { $role } रूप मे आनल गेल।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } { $element } क { $property } गुण क एकटा संदर्भ अछि।
       *[other] { $ref } { $element } क { $property } गुण क एकटा संदर्भ अछि (पाँती { $line })।
    }

help-kind-attribute = विशेषता
help-kind-snippet = अंश
help-kind-array-entry = सरणी प्रविष्टि

help-default = पूर्वनिर्धारित:
help-active-default = सक्रिय पूर्वनिर्धारित:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] अनुमत मान (प्रति वस्तु एक):
       *[other] अनुमत मान:
    }

help-suggested-values = सुझाओल मान:

help-inserts = जोड़ैत अछि:

help-coordinates =
    { $count ->
        [one] निर्देशांक:
       *[other] निर्देशांक:
    }

help-type = प्रकार:

help-resolved-style = निर्धारित शैली (styleNumber { $styleNumber }):

help-resolved-function-names = निर्धारित फलन नाम:
help-reset-list = ई इनपुट पर रीसेट सूची:
help-added-on-input = ई इनपुट पर जोड़ल गेल:
help-removed-on-input = ई इनपुट पर हटाओल गेल:

help-reset-overrides = { $reset } { $additional } आ { $removed } केँ ओगरैत अछि।
