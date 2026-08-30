# Awadhi (अवधी) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button, and the
# context-help panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script, frame and register** are `chrome.ftl`'s: Devanagari with Latin
# digits; an Awadhi frame — «अहै», «नाहीं», «क», «अउर», «खातिर», «काहे से
# कि», «जइसे», «एह», «कउनो», «फेर» — around a Hindi and Sanskrit technical
# vocabulary that is declared rather than disguised. Buttons carry the
# honorific imperative in **-औ** («देखावौ», «दबावौ», «राखौ», «चुनौ»), the one
# choice in this catalog the seed is least sure of.
#
# **`WCAG`, `DoenetML`, `XML`, `styleNumber` and every element and attribute
# name stay in English.** They are identifiers an author types, not words.
#
# **The counts do not fork.** `editor-accessibility-label` and
# `help-coordinates` write a single `*[other]` where English writes `[one]`
# and `[other]`: CLDR has no plural data for `awa`, so an English-selected
# branch would be worse than none, and an Awadhi noun is unmarked after a
# numeral in any case.
#
# **`help-name-summary` is punctuation.** It renders with `{ $name }` empty
# for a suggestion the panel has already named, so the em dash and its spaces
# have to read on their own.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] रीसेट करौ
       *[update] अद्यतन करौ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] दर्सक { $word }
       *[other] दर्सक { $word } { $shortcut }
    }


## The variant picker

editor-variant = रूपांतर
editor-variant-filter = छानौ...
editor-variant-next = अगला रूपांतर चुनौ
editor-variant-previous = पहिले वाला रूपांतर चुनौ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA सुगम्यता उल्लंघन मिला। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करै
           *[open] खोलै
        } खातिर क्लिक करौ।
        [advisories] सुगम्यता रिपोर्ट { $action ->
            [close] बंद करै
           *[open] खोलै
        } खातिर क्लिक करौ। कउनो WCAG AA उल्लंघन नाहीं मिला, बाकी सुगम्यता क अउर सुझाव अहैं।
       *[clean] सुगम्यता रिपोर्ट { $action ->
            [close] बंद करै
           *[open] खोलै
        } खातिर क्लिक करौ। कउनो सुगम्यता क समस्या नाहीं मिली।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA सुगम्यता उल्लंघन मिला। { $count } WCAG AA उल्लंघन मिले। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करै
           *[open] खोलै
        } खातिर क्लिक करौ।
        [advisories] कउनो WCAG AA उल्लंघन नाहीं मिला। सुगम्यता क { $count } अउर सुझाव मिले। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करै
           *[open] खोलै
        } खातिर क्लिक करौ।
       *[clean] कउनो WCAG AA उल्लंघन नाहीं मिला। सुगम्यता रिपोर्ट { $action ->
            [close] बंद करै
           *[open] खोलै
        } खातिर क्लिक करौ।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML संस्करण { $version }

editor-tab-help = प्रसंग क हिसाब से मदद
editor-tab-help-short = प्रसंग
editor-tab-errors = त्रुटि
editor-tab-warnings = चेतावनी
editor-tab-info = जानकारी
editor-tab-accessibility = सुगम्यता
editor-tab-responses = पठावल गयल जवाब

editor-tab-with-count = { $label }: { $count }

editor-options = संपादक क विकल्प
editor-format-as-doenetml = DoenetML क रूप मा सजावौ
editor-format-as-xml = XML क रूप मा सजावौ


## The diagnostics panel

editor-diagnostic-line = पंक्ति #{ $line }

editor-no-errors = कउनो त्रुटि नाहीं
editor-no-warnings = कउनो चेतावनी नाहीं
editor-no-info = कउनो सूचनात्मक निदान नाहीं

editor-show-info-annotations = संपादक मा सूचनात्मक निदान देखावौ
editor-show-accessibility-annotations = संपादक मा सुगम्यता क निदान देखावौ

editor-accessibility-learn-more = जानौ कि Doenet सुगम्यता का कइसे देखत अहै

editor-accessibility-violations-heading = सुगम्यता उल्लंघन ({ $standard })

editor-accessibility-other-heading = सुगम्यता क अउर समस्या
editor-none-found = कुछ नाहीं मिला


## Submitted responses

editor-no-responses = अबहीं तक कउनो जवाब नाहीं पठावल गा
editor-response-answer-id = जवाब क आईडी
editor-response-response = जवाब
editor-response-credit = अंक
editor-response-submitted = पठावल गा


## The context-help panel

help-placeholder = दस्तावेजीकरण देखै खातिर कर्सर का कउनो टैग नाम, विशेषता या { $ref } पर राखौ।

help-unsupported-ref-chain = { $example } जइसे बहु-भागी संदर्भ क मदद अबहीं नाहीं अहै।

help-unresolved-ref =
    { $reason ->
        [notFound] एह संदर्भ क कउनो लक्ष्य नाहीं मिला: { $ref }।
        [multiple] एह संदर्भ क कई लक्ष्य मिले: { $ref }।
       *[indeterminate] { $ref } क लक्ष्य तय नाहीं कीन जाइ सका।
    }

help-learn-about-references = संदर्भ क बारे मा जानौ →
help-reference-page = संदर्भ क पन्ना →

help-suggestions-header =
    { $location ->
        [inside] { $element } क भीतर
       *[top] सबसे ऊपर क स्तर पर
    }{ $allowed ->
        [none] { " — इहाँ कुछ नाहीं राखा जाइ सकत।" }
        [text] { " — इहाँ पाठ लिखा जाइ सकत अहै।" }
        [text-and-components] { " — इहाँ पाठ लिखौ, या ई आजमावौ:" }
       *[components] { " — ई आजमावौ:" }
    }

help-suggestions-footer = सब { $total } घटक देखै खातिर { $shortcut } दबावौ।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref }, { $target } क संदर्भ अहै।
       *[other] { $ref }, { $target } क संदर्भ अहै (पंक्ति { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } { $role } क रूप मा एका लावा।
       *[other] { $owner } पंक्ति { $line } मा { $role } क रूप मा एका लावा।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref }, { $element } क { $property } गुण क संदर्भ अहै।
       *[other] { $ref }, { $element } क { $property } गुण क संदर्भ अहै (पंक्ति { $line })।
    }

help-kind-attribute = विशेषता
help-kind-snippet = कोड क टुकड़ा
help-kind-array-entry = सरणी क प्रविष्टि

help-default = पूर्वनिर्धारित:
help-active-default = चालू पूर्वनिर्धारित:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] मान्य मान (हर मद खातिर एक):
       *[other] मान्य मान:
    }

help-suggested-values = सुझावल मान:

help-inserts = जोड़त अहै:

help-coordinates = निर्देशांक:

help-type = प्रकार:

help-resolved-style = तय शैली (styleNumber { $styleNumber }):

help-resolved-function-names = तय फलन नाम:
help-reset-list = एह इनपुट क रीसेट सूची:
help-added-on-input = एह इनपुट पर जोड़ा गा:
help-removed-on-input = एह इनपुट पर हटावा गा:

help-reset-overrides = { $reset }, { $additional } अउर { $removed } पर भारी परत अहै।
