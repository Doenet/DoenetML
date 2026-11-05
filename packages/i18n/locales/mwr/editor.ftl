# Marwari (मारवाड़ी) editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker and the context-help panel beside them. Translated
# from `locales/en/editor.ftl`, which is the source of truth.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Devanagari.** Marwari is written in Devanagari today, in print
# and online; the Mahajani script it once used for accounts is not a running
# script for prose and is not attempted here.
#
# **Method, stated plainly.** Marwari has no established register for
# mathematics or for software, so the technical vocabulary of this catalog is
# Hindi — रेखा, बहुभुज, फलन, विशेषता, घटक, संस्करण — the words a Marwari
# speaker meets in a Rajasthani classroom, which teaches out of Hindi
# textbooks. What is Marwari here is the grammatical layer written over it:
# the genitive रो / री / रा rather than Hindi का / की / के, the object marker
# नै, the copula छै, the negative कोनी, मांय for *in*, सूं for *from*, अर for
# *and*, कै for *or*, जे for *if*, रै वास्ते for *for*, and the -ओ imperative
# (करो, दिखावो, हटावो) that Marwari puts on a button. A reviewer should read
# this as Marwari grammar over Hindi terminology and is free to replace the
# terminology wherever Marwari has its own word.
#
# **Nothing selects on a plural category.** CLDR has no plural data for
# `mwr`, so `lint:i18n` would reject a `[one]` branch outright. Every count
# in this file is written with one form and no selector at all. The
# catalog's one branch on a number is `attempts-remaining`'s explicit `[0]`
# in `chrome.ftl`, which Fluent matches against the number itself rather
# than against a category.

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
editor-variant-next = अगलो रूपांतर चुणो
editor-variant-previous = पिछलो रूपांतर चुणो


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA सुगम्यता उल्लंघन पायो गयो। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करण
           *[open] खोलण
        } रै वास्ते क्लिक करो।
        [advisories] सुगम्यता रिपोर्ट { $action ->
            [close] बंद करण
           *[open] खोलण
        } रै वास्ते क्लिक करो। कोई WCAG AA उल्लंघन कोनी मिल्यो, पर सुगम्यता संबंधी अन्य सुझाव छै।
       *[clean] सुगम्यता रिपोर्ट { $action ->
            [close] बंद करण
           *[open] खोलण
        } रै वास्ते क्लिक करो। कोई सुगम्यता समस्या कोनी मिली।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA सुगम्यता उल्लंघन पायो गयो। { $count } WCAG AA उल्लंघन मिल्या। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करण
           *[open] खोलण
        } रै वास्ते क्लिक करो।
        [advisories] कोई WCAG AA उल्लंघन कोनी मिल्यो। सुगम्यता संबंधी { $count } अन्य सुझाव मिल्या। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करण
           *[open] खोलण
        } रै वास्ते क्लिक करो।
       *[clean] कोई WCAG AA उल्लंघन कोनी मिल्यो। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करण
           *[open] खोलण
        } रै वास्ते क्लिक करो।
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
editor-tab-responses = भेजे गिया उत्तर

editor-tab-with-count = { $label }: { $count }

editor-options = संपादक विकल्प
editor-format-as-doenetml = DoenetML रूप मांय स्वरूपित करो
editor-format-as-xml = XML रूप मांय स्वरूपित करो


## The diagnostics panel

editor-diagnostic-line = पंक्ति #{ $line }

editor-no-errors = कोई त्रुटि कोनी
editor-no-warnings = कोई चेतावनी कोनी
editor-no-info = कोई सूचनात्मक निदान कोनी

editor-show-info-annotations = संपादक मांय सूचनात्मक निदान दिखावो
editor-show-accessibility-annotations = संपादक मांय सुगम्यता निदान दिखावो

editor-accessibility-learn-more = जाणो कि Doenet सुगम्यता नै किस तरह देखता छै

editor-accessibility-violations-heading = सुगम्यता उल्लंघन ({ $standard })

editor-accessibility-other-heading = अन्य सुगम्यता समस्याएँ
editor-none-found = कुछ कोनी मिल्यो


## Submitted responses

editor-no-responses = अभी तक कोई उत्तर कोनी भेज्यो गयो
editor-response-answer-id = उत्तर आईडी
editor-response-response = उत्तर
editor-response-credit = अंक
editor-response-submitted = भेज्यो गयो


## The context-help panel

help-placeholder = दस्तावेज़ीकरण देखण रै वास्ते कर्सर नै टैग नाम, विशेषता कै { $ref } पर राखो।

help-unsupported-ref-chain = { $example } जियां बहु-भागीय संदर्भों री सहायता अभी उपलब्ध कोनी।

help-unresolved-ref =
    { $reason ->
        [notFound] इण संदर्भ रो कोई लक्ष्य कोनी मिल्यो: { $ref }।
        [multiple] इण संदर्भ रा कई लक्ष्य मिल्या: { $ref }।
       *[indeterminate] { $ref } रो लक्ष्य निर्धारित कोनी करियो जा सका।
    }

help-learn-about-references = संदर्भों रै बारै मांय जाणो →
help-reference-page = संदर्भ पृष्ठ →

help-suggestions-header =
    { $location ->
        [inside] { $element } रै भीतर
       *[top] शीर्ष स्तर पर
    }{ $allowed ->
        [none] { " — यहाँ कुछ कोनी रखा जा सकै।" }
        [text] { " — यहाँ पाठ लिखा जा सकै छै।" }
        [text-and-components] { " — यहाँ पाठ लिखो, कै ये आजमावो:" }
       *[components] { " — ये आजमावो:" }
    }

help-suggestions-footer = सभी { $total } घटक देखण रै वास्ते { $shortcut } दबावो।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref }, { $target } रो संदर्भ छै।
       *[other] { $ref }, { $target } रो संदर्भ छै (पंक्ति { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } द्वारा { $role } रै रूप मांय लाया गयो।
       *[other] { $owner } द्वारा पंक्ति { $line } मांय { $role } रै रूप मांय लाया गयो।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref }, { $element } रा { $property } गुण रो संदर्भ छै।
       *[other] { $ref }, { $element } रा { $property } गुण रो संदर्भ छै (पंक्ति { $line })।
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

help-suggested-values = सुझाए गिया मान:

help-inserts = जोड़ता छै:

help-coordinates = निर्देशांक:

help-type = प्रकार:

help-resolved-style = निर्धारित शैली (styleNumber { $styleNumber }):

help-resolved-function-names = निर्धारित फलन नाम:
help-reset-list = इण इनपुट री रीसेट सूची:
help-added-on-input = इण इनपुट पर जोड़ा गयो:
help-removed-on-input = इण इनपुट पर हटाया गयो:

help-reset-overrides = { $reset }, { $additional } अर { $removed } पर वरीयता रखता छै।
