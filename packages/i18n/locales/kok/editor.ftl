# Konkani editor and language-server surfaces: the footer, the diagnostics
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
        [reset] परतून थारायात
       *[update] अद्ययावत करात
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] दर्शक { $word }
       *[other] दर्शक { $word } { $shortcut }
    }


## The variant picker

editor-variant = प्रकार

editor-variant-filter = गाळात…

editor-variant-next = फुडलो प्रकार वेंचात

editor-variant-previous = फाटलो प्रकार वेंचात


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA सुगमताय उल्लंघन मेळ्ळें। सुगमताय अहवाल { $action ->
            [close] बंद करपाक
           *[open] उगडपाक
        } क्लिक करात।
        [advisories] सुगमताय अहवाल { $action ->
            [close] बंद करपाक
           *[open] उगडपाक
        } क्लिक करात। एकूय WCAG AA उल्लंघन मेळूंक ना, पूण हेर सुगमताय सुचोवण्यो उपलब्ध आसात।
       *[clean] सुगमताय अहवाल { $action ->
            [close] बंद करपाक
           *[open] उगडपाक
        } क्लिक करात। एकूय सुगमताय समस्या मेळूंक ना।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA सुगमताय उल्लंघन मेळ्ळें। { $count ->
            [one] { $count } WCAG AA उल्लंघन
           *[other] { $count } WCAG AA उल्लंघनां
        } मेळ्ळीं। सुगमताय अहवाल { $action ->
            [close] बंद करपाक
           *[open] उगडपाक
        } क्लिक करात।
        [advisories] एकूय WCAG AA उल्लंघन मेळूंक ना। { $count ->
            [one] { $count } हेर सुगमताय सुचोवणी
           *[other] { $count } हेर सुगमताय सुचोवण्यो
        } मेळ्ळ्यो। सुगमताय अहवाल { $action ->
            [close] बंद करपाक
           *[open] उगडपाक
        } क्लिक करात।
       *[clean] एकूय WCAG AA उल्लंघन मेळूंक ना। सुगमताय अहवाल { $action ->
            [close] बंद करपाक
           *[open] उगडपाक
        } क्लिक करात।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML आवृत्ती { $version }

editor-tab-help = संदर्भा प्रमाण आदार
editor-tab-help-short = संदर्भ
editor-tab-errors = चुको
editor-tab-warnings = शिटकावण्यो
editor-tab-info = म्हायती
editor-tab-accessibility = सुगमताय
editor-tab-responses = धाडिल्ल्यो जापो

editor-tab-with-count = { $label }: { $count }

editor-options = संपादक विकल्प
editor-format-as-doenetml = DoenetML रुपान सजयात
editor-format-as-xml = XML रुपान सजयात


## The diagnostics panel

editor-diagnostic-line = ओळ #{ $line }

editor-no-errors = एकूय चूक ना
editor-no-warnings = एकूय शिटकावणी ना
editor-no-info = एकूय म्हायती ना

editor-show-info-annotations = संपादकांत म्हायती दाखयात
editor-show-accessibility-annotations = संपादकांत सुगमताय सुचोवण्यो दाखयात

editor-accessibility-learn-more = Doenet सुगमतायेकडेन कशें पळयता तें जाणून घेयात

editor-accessibility-violations-heading = सुगमताय उल्लंघनां ({ $standard })

editor-accessibility-other-heading = हेर सुगमताय समस्या
editor-none-found = कांयच मेळूंक ना


## Submitted responses

editor-no-responses = आजून एकूय जाप धाडूंक ना
editor-response-answer-id = जाप आयडी
editor-response-response = जाप
editor-response-credit = गुण
editor-response-submitted = धाडिल्लें


## The context-help panel

help-placeholder = दस्तावेजीकरणा खातीर कर्सर टॅग नांव, गुणधर्म, वा { $ref } चेर दवरात।

help-unsupported-ref-chain = { $example } सारकिल्ल्या बहु-वांटो संदर्भां खातीर आदार आजून ना।

help-unresolved-ref =
    { $reason ->
        [notFound] ह्या संदर्भाक एकूय लक्ष्य मेळूंक ना: { $ref }।
        [multiple] ह्या संदर्भाक जायते लक्ष्य मेळ्ळे: { $ref }।
       *[indeterminate] { $ref } खातीर लक्ष्य थारावंक ना जालें।
    }

help-learn-about-references = संदर्भां विशीं जाणून घेयात →
help-reference-page = संदर्भ पान →

help-suggestions-header =
    { $location ->
        [inside] { $element } भितर
       *[top] सगळ्यांत वयल्या पातळेर
    }{ $allowed ->
        [none] { " — हांगा कांयच येवंक शकना।" }
        [text] { " — हांगा मजकूर बरयात।" }
        [text-and-components] { " — हांगा मजकूर बरयात, वा हें पळयात:" }
       *[components] { " — हें पळयात:" }
    }

help-suggestions-footer = सगळे { $total } घटक पळोवपाक { $shortcut } दामात।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } हो { $target } हाचो संदर्भ।
       *[other] { $ref } हो { $target } हाचो संदर्भ (ओळ { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } हाणें { $role } म्हूण हाडलें।
       *[other] { $owner } हाणें ओळ { $line } चेर { $role } म्हूण हाडलें।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } हो { $element } हाच्या { $property } गुणधर्माचो संदर्भ।
       *[other] { $ref } हो { $element } हाच्या { $property } गुणधर्माचो संदर्भ (ओळ { $line })।
    }

help-kind-attribute = गुणधर्म
help-kind-snippet = तुकडो
help-kind-array-entry = सरणी नोंद

help-default = मूळ:
help-active-default = सक्रिय मूळ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] मान्य मोलां (दर वस्तूक एक):
       *[other] मान्य मोलां:
    }

help-suggested-values = सुचयिल्लीं मोलां:

help-inserts = घालता:

help-coordinates =
    { $count ->
        [one] निर्देशांक:
       *[other] निर्देशांक:
    }

help-type = प्रकार:

help-resolved-style = थारायिल्ली शैली (styleNumber { $styleNumber }):

help-resolved-function-names = थारायिल्लीं फलन नांवां:
help-reset-list = ह्या निवेशाचेर परतून थारावपाची वळेरी:
help-added-on-input = ह्या निवेशाचेर जोडलें:
help-removed-on-input = ह्या निवेशाचेर काडलें:

help-reset-overrides = { $reset } हें { $additional } आनी { $removed } हांचेर चलता।
