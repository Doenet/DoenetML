# Kumaoni (कुमाऊँनी) editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker and the context-help panel beside them. Translated
# from `locales/en/editor.ftl`, which is the source of truth.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Devanagari**, which is the only script Kumaoni is written in.
#
# **Method, stated plainly.** Kumaoni has no established register for
# mathematics or for software, so the technical vocabulary of this catalog is
# Hindi — रेखा, बहुभुज, फलन, विशेषता, घटक, संस्करण — the words a Kumaoni
# speaker meets in an Uttarakhand classroom, which teaches out of Hindi
# textbooks. What is Kumaoni here is the grammatical layer written over it:
# the genitive क / की / का rather than Hindi का / की / के, the object marker
# कैं, the copula छ (plural छन), the negative नि, बटि for *from*, दगाड़ for
# *with*, अर for *and*, बान for *for*, किलैकि for *because*, and the -ओ
# imperative (करो, दिखाओ, हटाओ) Kumaoni puts on a button. A reviewer should
# read this as Kumaoni grammar over Hindi terminology and is free to replace
# the terminology wherever Kumaoni has its own word.
#
# **Nothing selects on a plural category.** CLDR has no plural data for
# `kfy`, so `lint:i18n` would reject a `[one]` branch outright. Every count
# in this file is written with one form and no selector at all — `$count` is
# plain interpolation here. The catalog's one branch on a number is
# `attempts-remaining`'s explicit `[0]` in `chrome.ftl`, which Fluent matches
# against the number itself rather than against a category.

## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] रीसेट करो
       *[update] अद्यतन करो
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] दर्शक { $word }
       *[other] दर्शक { $word } { $shortcut }
    }


## The variant picker

editor-variant = रूपांतर
editor-variant-filter = फ़िल्टर...
editor-variant-next = अगलो रूपांतर छांटो
editor-variant-previous = पिछलो रूपांतर छांटो


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA सुगम्यता उल्लंघन पाया गया। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करण
           *[open] खोलण
        } बान क्लिक करो।
        [advisories] सुगम्यता रिपोर्ट { $action ->
            [close] बंद करण
           *[open] खोलण
        } बान क्लिक करो। कोई WCAG AA उल्लंघन नि मिला, पर सुगम्यता संबंधी अन्य सुझाव छन।
       *[clean] सुगम्यता रिपोर्ट { $action ->
            [close] बंद करण
           *[open] खोलण
        } बान क्लिक करो। कोई सुगम्यता समस्या नि मिली।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA सुगम्यता उल्लंघन पाया गया। { $count } WCAG AA उल्लंघन मिले। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करण
           *[open] खोलण
        } बान क्लिक करो।
        [advisories] कोई WCAG AA उल्लंघन नि मिला। सुगम्यता संबंधी { $count } अन्य सुझाव मिले। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करण
           *[open] खोलण
        } बान क्लिक करो।
       *[clean] कोई WCAG AA उल्लंघन नि मिला। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करण
           *[open] खोलण
        } बान क्लिक करो।
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
editor-format-as-doenetml = DoenetML रूप में स्वरूपित करो
editor-format-as-xml = XML रूप में स्वरूपित करो


## The diagnostics panel

editor-diagnostic-line = पंक्ति #{ $line }

editor-no-errors = कोई त्रुटि नि
editor-no-warnings = कोई चेतावनी नि
editor-no-info = कोई सूचनात्मक निदान नि

editor-show-info-annotations = संपादक में सूचनात्मक निदान दिखाओ
editor-show-accessibility-annotations = संपादक में सुगम्यता निदान दिखाओ

editor-accessibility-learn-more = जाणो कि Doenet सुगम्यता कैं किस तरह देखता छ

editor-accessibility-violations-heading = सुगम्यता उल्लंघन ({ $standard })

editor-accessibility-other-heading = अन्य सुगम्यता समस्याएँ
editor-none-found = कुछ नि मिला


## Submitted responses

editor-no-responses = अभी तक कोई उत्तर नि भेजा गया
editor-response-answer-id = उत्तर आईडी
editor-response-response = उत्तर
editor-response-credit = अंक
editor-response-submitted = भेजा गया


## The context-help panel

help-placeholder = दस्तावेज़ीकरण देखण बान कर्सर कैं टैग नाम, विशेषता या { $ref } पर धरो।

help-unsupported-ref-chain = { $example } जस बहु-भागीय संदर्भों की सहायता अभी उपलब्ध नि छ।

help-unresolved-ref =
    { $reason ->
        [notFound] ये संदर्भ क कोई लक्ष्य नि मिला: { $ref }।
        [multiple] ये संदर्भ का कई लक्ष्य मिले: { $ref }।
       *[indeterminate] { $ref } क लक्ष्य निर्धारित नि किया जा सका।
    }

help-learn-about-references = संदर्भों क बारा में जाणो →
help-reference-page = संदर्भ पृष्ठ →

help-suggestions-header =
    { $location ->
        [inside] { $element } क भितर
       *[top] शीर्ष स्तर पर
    }{ $allowed ->
        [none] { " — यहाँ कुछ नि रखा जा सकन।" }
        [text] { " — यहाँ पाठ लिखा जा सकन छ।" }
        [text-and-components] { " — यहाँ पाठ लेखो, या ये अजमाओ:" }
       *[components] { " — ये अजमाओ:" }
    }

help-suggestions-footer = सभी { $total } घटक देखण बान { $shortcut } दबाओ।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref }, { $target } क संदर्भ छ।
       *[other] { $ref }, { $target } क संदर्भ छ (पंक्ति { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } द्वारा { $role } क रूप में लाया गया।
       *[other] { $owner } द्वारा पंक्ति { $line } में { $role } क रूप में लाया गया।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref }, { $element } का { $property } गुण क संदर्भ छ।
       *[other] { $ref }, { $element } का { $property } गुण क संदर्भ छ (पंक्ति { $line })।
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

help-inserts = जोड़ता छ:

help-coordinates = निर्देशांक:

help-type = प्रकार:

help-resolved-style = निर्धारित शैली (styleNumber { $styleNumber }):

help-resolved-function-names = निर्धारित फलन नाम:
help-reset-list = ये इनपुट की रीसेट सूची:
help-added-on-input = ये इनपुट पर जोड़ा गया:
help-removed-on-input = ये इनपुट पर हटाया गया:

help-reset-overrides = { $reset }, { $additional } अर { $removed } पर वरीयता रखता छ।
