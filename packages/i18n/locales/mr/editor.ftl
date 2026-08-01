# Marathi editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Element names, attribute names, `styleNumber`, `WCAG AA` and version numbers
# are identifiers rather than prose and stay exactly as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] रीसेट
       *[update] अद्ययावत
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] दर्शक { $word }
       *[other] दर्शक { $word } { $shortcut }
    }


## The variant picker

editor-variant = प्रकार
editor-variant-filter = गाळा...
editor-variant-next = पुढील प्रकार निवडा
editor-variant-previous = मागील प्रकार निवडा


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA सुलभता उल्लंघन आढळले. सुलभता अहवाल { $action ->
            [close] बंद करण्यासाठी
           *[open] उघडण्यासाठी
        } क्लिक करा.
        [advisories] सुलभता अहवाल { $action ->
            [close] बंद करण्यासाठी
           *[open] उघडण्यासाठी
        } क्लिक करा. एकही WCAG AA उल्लंघन आढळले नाही, पण आणखी काही सुलभता शिफारशी उपलब्ध आहेत.
       *[clean] सुलभता अहवाल { $action ->
            [close] बंद करण्यासाठी
           *[open] उघडण्यासाठी
        } क्लिक करा. एकही सुलभता समस्या आढळली नाही.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA सुलभता उल्लंघन आढळले. { $count ->
            [one] { $count } WCAG AA उल्लंघन
           *[other] { $count } WCAG AA उल्लंघने
        } आढळली. सुलभता अहवाल { $action ->
            [close] बंद करण्यासाठी
           *[open] उघडण्यासाठी
        } क्लिक करा.
        [advisories] एकही WCAG AA उल्लंघन आढळले नाही. आणखी { $count ->
            [one] { $count } सुलभता शिफारस
           *[other] { $count } सुलभता शिफारशी
        } आढळल्या. सुलभता अहवाल { $action ->
            [close] बंद करण्यासाठी
           *[open] उघडण्यासाठी
        } क्लिक करा.
       *[clean] एकही WCAG AA उल्लंघन आढळले नाही. सुलभता अहवाल { $action ->
            [close] बंद करण्यासाठी
           *[open] उघडण्यासाठी
        } क्लिक करा.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML आवृत्ती { $version }

editor-tab-help = संदर्भानुसार मदत
editor-tab-help-short = संदर्भ
editor-tab-errors = त्रुटी
editor-tab-warnings = इशारे
editor-tab-info = माहिती
editor-tab-accessibility = सुलभता
editor-tab-responses = पाठवलेली उत्तरे

editor-tab-with-count = { $label }: { $count }

editor-options = संपादक पर्याय
editor-format-as-doenetml = DoenetML म्हणून मांडा
editor-format-as-xml = XML म्हणून मांडा


## The diagnostics panel

editor-diagnostic-line = ओळ #{ $line }

editor-no-errors = त्रुटी नाहीत
editor-no-warnings = इशारे नाहीत
editor-no-info = माहितीपर सूचना नाहीत

editor-show-info-annotations = संपादकात माहितीपर सूचना दाखवा
editor-show-accessibility-annotations = संपादकात सुलभता सूचना दाखवा

editor-accessibility-learn-more = Doenet सुलभतेकडे कसे पाहते ते जाणून घ्या

editor-accessibility-violations-heading = सुलभता उल्लंघने ({ $standard })

editor-accessibility-other-heading = इतर सुलभता समस्या
editor-none-found = काहीही आढळले नाही


## Submitted responses

editor-no-responses = अद्याप एकही उत्तर पाठवलेले नाही
editor-response-answer-id = उत्तराचा आयडी
editor-response-response = उत्तर
editor-response-credit = गुण
editor-response-submitted = पाठवले


## The context-help panel

help-placeholder = दस्तऐवजीकरणासाठी कर्सर टॅगच्या नावावर, ॲट्रिब्यूटवर किंवा { $ref } वर ठेवा.

help-unsupported-ref-chain = { $example } सारख्या बहु-भागी संदर्भांसाठी मदत अद्याप उपलब्ध नाही.

help-unresolved-ref =
    { $reason ->
        [notFound] संदर्भासाठी लक्ष्य आढळले नाही: { $ref }.
        [multiple] संदर्भासाठी अनेक लक्ष्ये आढळली: { $ref }.
       *[indeterminate] { $ref } चे लक्ष्य ठरवता आले नाही.
    }

help-learn-about-references = संदर्भांविषयी जाणून घ्या →
help-reference-page = संदर्भ पृष्ठ →

help-suggestions-header =
    { $location ->
        [inside] { $element } च्या आत
       *[top] सर्वोच्च स्तरावर
    }{ $allowed ->
        [none] { " — इथे काहीही बसत नाही." }
        [text] { " — इथे मजकूर लिहा." }
        [text-and-components] { " — इथे मजकूर लिहा, किंवा हे वापरून पाहा:" }
       *[components] { " — हे वापरून पाहा:" }
    }

help-suggestions-footer = सर्व { $total } घटक पाहण्यासाठी { $shortcut } दाबा.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } हा { $target } चा संदर्भ आहे.
       *[other] { $ref } हा { $target } चा संदर्भ आहे (ओळ { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ने हा { $role } म्हणून आणला.
       *[other] { $owner } ने हा ओळ { $line } वर { $role } म्हणून आणला.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } हा { $element } च्या { $property } गुणधर्माचा संदर्भ आहे.
       *[other] { $ref } हा { $element } च्या { $property } गुणधर्माचा संदर्भ आहे (ओळ { $line }).
    }

help-kind-attribute = ॲट्रिब्यूट
help-kind-snippet = स्निपेट
help-kind-array-entry = ॲरे नोंद

help-default = पूर्वनिर्धारित:
help-active-default = कार्यरत पूर्वनिर्धारित:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] अनुमत मूल्ये (प्रत्येक नोंदीसाठी एक):
       *[other] अनुमत मूल्ये:
    }

help-suggested-values = सुचवलेली मूल्ये:

help-inserts = हे घालते:

help-coordinates =
    { $count ->
        [one] सहनिर्देशक:
       *[other] सहनिर्देशक:
    }

help-type = प्रकार:

help-resolved-style = ठरलेली शैली (styleNumber { $styleNumber }):

help-resolved-function-names = ठरलेली फलननावे:
help-reset-list = या इनपुटवर यादी रीसेट:
help-added-on-input = या इनपुटवर जोडले:
help-removed-on-input = या इनपुटवर काढले:

help-reset-overrides = { $reset } हा { $additional } आणि { $removed } यांच्यावर प्राधान्य घेतो.
